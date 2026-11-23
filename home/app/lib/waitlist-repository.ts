import "server-only";

import {
  DRIVER_ERROR_CODES,
  DuplicateKeyError,
  LioranDriverError,
  type Collection,
} from "@liorandb/driver";
import { createHash } from "node:crypto";

import { getLioranDBClient, getLioranDBConfig } from "./liorandb";

const WAITLIST_EMAIL_INDEX_NAME = "waitlist_email_unique";

export type WaitlistEntry = {
  readonly _id?: string;
  readonly email: string;
  readonly createdAt: string;
};

export type CreateWaitlistEntryInput = {
  readonly email: string;
};

export class WaitlistDuplicateError extends Error {
  constructor(email: string) {
    super(`The email address is already on the waitlist: ${email}`);
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
    const collection = client
      .db(databaseName)
      .collection<WaitlistEntry>(waitlistCollectionName);

    // createIndex() is the documented LioranDB unique-index API. The
    // idempotency key makes repeated cold-start initialization safe.
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
  return (
    error instanceof DuplicateKeyError ||
    (error instanceof LioranDriverError &&
      error.code === DRIVER_ERROR_CODES.DUPLICATE_KEY)
  );
}

function insertedIdAsString(insertedId: unknown): string | undefined {
  if (typeof insertedId === "string") {
    return insertedId;
  }

  if (typeof insertedId === "number") {
    return String(insertedId);
  }

  return undefined;
}

export async function findByEmail(
  email: string,
): Promise<WaitlistEntry | null> {
  const normalizedEmail = normalizeEmail(email);
  const collection = await getWaitlistCollection();

  return collection.findOne({ email: normalizedEmail });
}

export async function createEntry(
  input: CreateWaitlistEntryInput,
): Promise<WaitlistEntry> {
  const email = normalizeEmail(input.email);
  const createdAt = new Date().toISOString();
  const collection = await getWaitlistCollection();

  try {
    const result = await collection.insertOne(
      { email, createdAt },
      { idempotencyKey: idempotencyKeyForEmail(email) },
    );
    const insertedId = insertedIdAsString(result.insertedId);

    return insertedId
      ? { _id: insertedId, email, createdAt }
      : { email, createdAt };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new WaitlistDuplicateError(email);
    }

    throw error;
  }
}
