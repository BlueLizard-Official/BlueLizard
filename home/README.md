This is a [Next.js](https://nextjs.org) project for BlueLizard.

## Pre-launch website

BlueLizard is presented as a pre-launch product with an MVP target of December 3, 2026. The homepage, `/features`, `/mcp`, `/pricing`, `/cli`, and `/roadmap` describe the intended blueprint, security, MCP, pricing, build-output, and developer workflows. Planned capabilities are labeled as planned or in progress; the site does not claim a public compiler, MCP server, payment checkout, or completed security audit.

The public waitlist is available at `/waitlist`. It accepts registrations through `/api/waitlist`, but it does not expose waitlist records or database credentials to the browser. Production deployments also need a trusted edge rate limiter; an in-memory limiter is not treated as reliable across serverless instances.

## LioranDB waitlist integration

The reusable waitlist persistence layer lives in [app/lib/liorandb.ts](app/lib/liorandb.ts) and [app/lib/waitlist-repository.ts](app/lib/waitlist-repository.ts). Both modules are explicitly server-only. Copy `.env.example` to `.env.local` and provide:

```text
LIORANDB_URI=liorandb+https://username:password@db.example.com:443/default
LIORANDB_DATABASE=blue_lizard
LIORANDB_WAITLIST_COLLECTION=waitlist

WAITLIST_EDGE_RATE_LIMIT_URL=https://rate-limit.example.com/check
WAITLIST_EDGE_RATE_LIMIT_TOKEN=replace-with-server-only-token
```

The URI is kept in a non-`NEXT_PUBLIC_` environment variable so credentials are not exposed to browser bundles. For remote production deployments, use a TLS URI such as `liorandb+https://...`; reserved URI characters in credentials must be percent-encoded.

The database module uses the documented `LioranDBClient` API with gRPC data transport, 5-second connection and 10-second request timeouts, one cached client per server process, and graceful `SIGINT`/`SIGTERM` shutdown. The repository uses only documented `collection.findOne()`, `collection.insertOne()`, and `collection.createIndex()` operations. LioranDB documents are JSON-compatible, so `createdAt` is stored as an ISO string rather than a JavaScript `Date`.

On first repository use, the integration ensures the documented unique `email` index named `waitlist_email_unique`. Emails are trimmed and lowercased before reads and writes. Concurrent duplicate submissions are protected by that server-side unique index; a duplicate-key response becomes `WaitlistDuplicateError`. Inserts also use a deterministic idempotency key derived from the normalized email for safe retry handling.

The installed driver exposes MongoDB-shaped names but is not the MongoDB driver. It does not expose MongoDB sessions, transactions, change streams, `replaceOne`, `bulkWrite`, or `findById`; no such assumptions are made here. The repository currently exposes `findByEmail()` and `createEntry()` because an ID lookup is not required by the waitlist flow.

## Waitlist email notifications

Set these server-side variables in the deployment environment to email the team after each new registration is saved:

```text
RESEND_API_KEY=replace-with-a-sending-only-key
WAITLIST_NOTIFICATION_FROM="BlueLizard <waitlist@bluelizard.sbs>"
WAITLIST_NOTIFICATION_TO=contact@bluelizard.sbs
```

The sender must use a domain verified in Resend. The recipient defaults to `contact@bluelizard.sbs`. The form saves registrations to LioranDB before attempting delivery. Failed sends are logged on the server and leave the saved registration available in LioranDB.

## Driver API inventory

The integration is based on the installed `@liorandb/driver` 2.0.10 package declarations and bundled documentation:

- Connection: `LioranDBClient`, `connect()`, `close()`, `isConnected()`, `db()`.
- Collections: `collection<T>()`, `findOne()`, `find()`, `insertOne()`, `insertMany()`, `createIndex()`, `listIndexes()`, and typed driver errors including `DuplicateKeyError`.
- Operations intentionally not invented: no MongoDB `ObjectId`, `Date` document values, sessions, multi-document transactions, `replaceOne`, or `bulkWrite`.
- Production guidance followed: gRPC-first data operations, TLS for remote deployments, bounded timeouts, per-process client reuse, idempotency keys for retried writes, and explicit shutdown.

The driver package includes connection, CRUD, query, index, authentication, error, best-practice, Next.js, and MongoDB migration documentation under `node_modules/@liorandb/driver/docs/`. Its public declarations are in `node_modules/@liorandb/driver/dist/index.d.ts`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
