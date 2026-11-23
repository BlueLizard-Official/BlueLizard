import "server-only";

import {
  DRIVER_ERROR_CODES,
  DuplicateKeyError,
  LioranDriverError,
  type Collection,
} from "@liorandb/driver";
import { createHash, randomUUID } from "node:crypto";

import type { WaitlistSubmission } from "./waitlist-schema";
import { getLioranDBClient, getLioranDBConfig } from "./liorandb";

const WAITLIST_EMAIL_INDEX_NAME = "waitlist_email_unique";

export type WaitlistEntry = WaitlistSubmission & {
  readonly _id: string;
  readonly id: string;
  readonly createdAt: string;
};

export type CreateWaitlistEntryInput = WaitlistSubmission;

export class WaitlistDuplicateError extends Error {
  constructor() {
    super("The email address is already on the waitlist.");
    this.name = "WaitlistDuplicateError";
  }
}

type WaitlistCollection = Collection<WaitlistEntry>;

let waitlistCollectionPromise: Promise<WaitlistCollection> | undefined;

function normalizeEmail(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new TypeError("Waitlist email must not be empty");
  }

  return normalizedEmail;
}

function idempotencyKeyForEmail(email: string): string {
  const digest = createHash("sha256").update(email).digest("hex");
  return `blue-lizard-waitlist:${digest}`;
}

async function getWaitlistCollection(): Promise<WaitlistCollection> {
  if (waitlistCollectionPromise) {
    return waitlistCollectionPromise;
  }

  waitlistCollectionPromise = (async () => {
    const client = await getLioranDBClient();
    const { databaseName, waitlistCollectionName } = getLioranDBConfig();
    const collection = client.db(databaseName).collection<WaitlistEntry>(waitlistCollectionName);

    await collection.createIndex("email", {
      name: WAITLIST_EMAIL_INDEX_NAME,
      unique: true,
      idempotencyKey: "blue-lizard-waitlist-email-unique-v1",
    });

    return collection;
  })().catch((error: unknown) => {
    waitlistCollectionPromise = undefined;
    throw error;
  });

  return waitlistCollectionPromise;
}

function isDuplicateKeyError(error: unknown): boolean {
  return error instanceof DuplicateKeyError || (
    error instanceof LioranDriverError && error.code === DRIVER_ERROR_CODES.DUPLICATE_KEY
  );
}

function insertedIdAsString(insertedId: unknown): string | undefined {
  if (typeof insertedId === "string") return insertedId;
  if (typeof insertedId === "number") return String(insertedId);
  return undefined;
}

export async function findByEmail(email: string): Promise<WaitlistEntry | null> {
  const normalizedEmail = normalizeEmail(email);
  const collection = await getWaitlistCollection();
  return collection.findOne({ email: normalizedEmail });
}

export async function createEntry(input: CreateWaitlistEntryInput): Promise<WaitlistEntry> {
  const email = normalizeEmail(input.email);
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const document: WaitlistEntry = {
    ...input,
    email,
    _id: id,
    id,
    createdAt,
  };
  const collection = await getWaitlistCollection();

  try {
    const result = await collection.insertOne(document, {
      idempotencyKey: idempotencyKeyForEmail(email),
    });
    const insertedId = insertedIdAsString(result.insertedId);

    return insertedId && insertedId !== id
      ? { ...document, _id: insertedId, id: insertedId }
      : document;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new WaitlistDuplicateError();
    }

    throw error;
  }
}
