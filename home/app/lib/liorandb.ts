import "server-only";

import { LioranDBClient } from "@liorandb/driver";

const CONNECT_TIMEOUT_MS = 5_000;
const REQUEST_TIMEOUT_MS = 10_000;

declare global {
  // Keep state outside the module graph so Next.js hot reloads do not open a
  // new connection for every reload.
  var __blueLizardLioranDBClient: LioranDBClient | undefined;
  var __blueLizardLioranDBConnectPromise:
    | Promise<LioranDBClient>
    | undefined;
  var __blueLizardLioranDBShutdownRegistered: boolean | undefined;
}

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

function registerShutdownHandlers(client: LioranDBClient): void {
  if (globalThis.__blueLizardLioranDBShutdownRegistered) {
    return;
  }

  globalThis.__blueLizardLioranDBShutdownRegistered = true;

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      void client.close().finally(() => process.exit(0));
    });
  }
}

function createClient(): LioranDBClient {
  const client = new LioranDBClient(requiredEnvironmentVariable("LIORANDB_URI"), {
    transport: "grpc",
    connectTimeoutMS: CONNECT_TIMEOUT_MS,
    requestTimeoutMS: REQUEST_TIMEOUT_MS,
    appName: "blue-lizard",
  });

  registerShutdownHandlers(client);
  return client;
}

export type LioranDBConfig = {
  readonly databaseName: string;
  readonly waitlistCollectionName: string;
};

export function getLioranDBConfig(): LioranDBConfig {
  return {
    databaseName: requiredEnvironmentVariable("LIORANDB_DATABASE"),
    waitlistCollectionName: requiredEnvironmentVariable(
      "LIORANDB_WAITLIST_COLLECTION",
    ),
  };
}

export async function getLioranDBClient(): Promise<LioranDBClient> {
  const client =
    globalThis.__blueLizardLioranDBClient ??
    (globalThis.__blueLizardLioranDBClient = createClient());

  if (client.isConnected()) {
    return client;
  }

  const existingConnection = globalThis.__blueLizardLioranDBConnectPromise;
  if (existingConnection) {
    return existingConnection;
  }

  const connection = client.connect().catch((error: unknown) => {
    if (globalThis.__blueLizardLioranDBConnectPromise === connection) {
      globalThis.__blueLizardLioranDBConnectPromise = undefined;
    }

    throw error;
  });

  globalThis.__blueLizardLioranDBConnectPromise = connection;
  return connection;
}

export async function closeLioranDBClient(): Promise<void> {
  const client = globalThis.__blueLizardLioranDBClient;

  if (!client) {
    return;
  }

  await client.close();
  globalThis.__blueLizardLioranDBClient = undefined;
  globalThis.__blueLizardLioranDBConnectPromise = undefined;
  globalThis.__blueLizardLioranDBShutdownRegistered = undefined;
}
