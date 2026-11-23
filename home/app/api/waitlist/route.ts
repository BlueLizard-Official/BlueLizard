import { after, NextResponse } from "next/server";
import {
  DRIVER_ERROR_CODES,
  DuplicateKeyError,
  LioranDriverError,
} from "@liorandb/driver";

import {
  createEntry,
  findByEmail,
  WaitlistDuplicateError,
} from "../../lib/waitlist-repository";
import { notifyWaitlistTeam } from "../../lib/waitlist-notification";
import { validateWaitlistSubmission } from "../../lib/waitlist-schema";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_RESOURCE = "blue-lizard-waitlist";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

class RequestBodyTooLargeError extends Error {}

function jsonResponse(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { ...NO_STORE_HEADERS, ...headers },
  });
}

async function readBodyWithinLimit(request: Request): Promise<string> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const parsedLength = Number(contentLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      throw new Error("Invalid content length");
    }
    if (parsedLength > MAX_BODY_BYTES) {
      throw new RequestBodyTooLargeError();
    }
  }

  if (!request.body) {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
      throw new RequestBodyTooLargeError();
    }
    return text;
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

function forwardedClientKey(request: Request): string {
  // This header is only used transiently as a key for the trusted edge limiter;
  // it is never persisted in LioranDB or returned to the caller.
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown-client";
}

async function enforceEdgeRateLimit(request: Request): Promise<"allowed" | "blocked"> {
  const limiterUrl = process.env.WAITLIST_EDGE_RATE_LIMIT_URL?.trim();
  const limiterToken = process.env.WAITLIST_EDGE_RATE_LIMIT_TOKEN?.trim();

  if (!limiterUrl && !limiterToken) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing trusted waitlist edge rate limiter configuration");
    }
    return "allowed";
  }

  if (!limiterUrl || !limiterToken) {
    throw new Error("Incomplete trusted waitlist edge rate limiter configuration");
  }

  const parsedLimiterUrl = new URL(limiterUrl);
  if (parsedLimiterUrl.protocol !== "https:") {
    throw new Error("Waitlist edge rate limiter must use HTTPS");
  }

  const response = await fetch(parsedLimiterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${limiterToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resource: RATE_LIMIT_RESOURCE,
      clientKey: forwardedClientKey(request),
    }),
    cache: "no-store",
  });

  if (response.status === 429) {
    return "blocked";
  }

  if (!response.ok) {
    throw new Error(`Waitlist edge rate limiter returned ${response.status}`);
  }

  return "allowed";
}

function isDuplicateError(error: unknown): boolean {
  return error instanceof WaitlistDuplicateError || error instanceof DuplicateKeyError || (
    error instanceof LioranDriverError && error.code === DRIVER_ERROR_CODES.DUPLICATE_KEY
  );
}

function logServerFailure(label: string, error: unknown): void {
  if (error instanceof LioranDriverError) {
    console.error(`[waitlist] ${label}`, {
      name: error.name,
      code: error.code,
      retryable: error.retryable,
    });
    return;
  }

  console.error(`[waitlist] ${label}`, {
    name: error instanceof Error ? error.name : "UnknownError",
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse(
      { ok: false, code: "UNSUPPORTED_CONTENT_TYPE", message: "Submit the waitlist form as JSON." },
      415,
    );
  }

  let payload: unknown;
  try {
    const body = await readBodyWithinLimit(request);
    payload = JSON.parse(body);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonResponse(
        { ok: false, code: "PAYLOAD_TOO_LARGE", message: "The submission is too large." },
        413,
      );
    }

    return jsonResponse(
      { ok: false, code: "INVALID_JSON", message: "Submit a valid JSON payload." },
      400,
    );
  }

  const validation = validateWaitlistSubmission(payload);
  if (!validation.ok) {
    return jsonResponse(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Please correct the highlighted fields.",
        fields: validation.errors,
      },
      400,
    );
  }

  try {
    const rateLimit = await enforceEdgeRateLimit(request);
    if (rateLimit === "blocked") {
      return jsonResponse(
        { ok: false, code: "RATE_LIMITED", message: "Too many attempts. Please try again in a minute." },
        429,
        { "Retry-After": "60" },
      );
    }

    const existing = await findByEmail(validation.data.email);
    if (existing) {
      return jsonResponse(
        { ok: false, code: "DUPLICATE_EMAIL", message: "That email is already on the list." },
        409,
      );
    }

    const entry = await createEntry(validation.data);
    after(() => notifyWaitlistTeam(entry));
    return jsonResponse({
      ok: true,
      message: "You're on the list. We'll contact you with BlueLizard MVP updates.",
    }, 201);
  } catch (error) {
    if (isDuplicateError(error)) {
      return jsonResponse(
        { ok: false, code: "DUPLICATE_EMAIL", message: "That email is already on the list." },
        409,
      );
    }

    logServerFailure("registration failed", error);
    return jsonResponse(
      { ok: false, code: "WAITLIST_UNAVAILABLE", message: "The waitlist is temporarily unavailable. Please try again later." },
      503,
    );
  }
}
