# atelier-store

Next.js e-commerce app — project scaffold.

## Stack

| Concern  | Choice |
| -------- | ------ |
| Framework | Next.js (App Router) + TypeScript |
| Styling   | Tailwind CSS v4 |
| Auth      | better-auth |
| ORM       | Drizzle ORM |
| Database  | Postgres on Neon (`@neondatabase/serverless`, HTTP driver) |

## Getting started

```bash
cp .env.example .env
# fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run dev
```

Generate a secret with `openssl rand -base64 32`.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Generate SQL migrations from the schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema straight to the database |
| `npm run db:studio` | Drizzle Studio |

## Layout

```
src/
  app/
    api/auth/[...all]/route.ts   better-auth request handler
  db/
    index.ts                     Drizzle client (Neon HTTP)
    schema/index.ts              schema barrel — empty, add tables here
  lib/
    auth.ts                      better-auth server instance
    auth-client.ts               better-auth React client
  env.ts                         environment variable access
drizzle.config.ts                drizzle-kit config (reads the schema barrel)
drizzle/                         generated migrations (created on first generate)
```

## Not set up yet

No tables are defined, so the build logs a `Drizzle schema mismatch` warning from
better-auth about missing `user` / `session` / `account` / `verification` tables.
That is expected until auth tables are added:

```bash
npx @better-auth/cli generate --output src/db/schema/auth.ts
```

then export them from `src/db/schema/index.ts`, pass them to `drizzleAdapter` in
`src/lib/auth.ts`, and run `npm run db:generate && npm run db:migrate`.

Also out of scope for this scaffold: product/cart/order schemas, sign-in and
sign-up UI, storefront pages, payments, and deployment config.
