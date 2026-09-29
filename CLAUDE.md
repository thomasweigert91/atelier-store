# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run db:generate  # generate SQL migrations from the schema into drizzle/
npm run db:migrate   # apply migrations
npm run db:push      # push schema straight to the DB (dev shortcut, no migration file)
npm run db:studio    # Drizzle Studio
```

No test framework is installed — there is no test command to run. `npm run lint && npm run typecheck` is the full check.

Requires a `.env` (copy `.env.example`). `DATABASE_URL` and `BETTER_AUTH_SECRET` have no defaults and throw at access time if missing.

## Stack

Next.js 16 (App Router) + React 19 with the React Compiler enabled (`reactCompiler: true` in `next.config.ts` — avoid manual `useMemo`/`useCallback`), TypeScript strict, Tailwind CSS v4, better-auth, Drizzle ORM over Neon Postgres via the HTTP driver.

Tailwind v4 has no `tailwind.config.*`. Theme tokens are declared in CSS in `src/app/globals.css` under `@theme inline`; add design tokens there, not in a JS config.

Import project code through the `@/*` alias (→ `src/`), not relative paths across directories.

## Architecture

**Environment access** (`src/env.ts`) — all env reads go through this module, never `process.env` directly in app code. `serverEnv` is a getter object precisely so that a client component importing `publicEnv` from the same module never evaluates server-only vars. Keep that shape when adding variables: server-only values as getters on `serverEnv`, browser-visible `NEXT_PUBLIC_*` values as plain properties on `publicEnv`.

**Database** (`src/db/index.ts`) — a single `db` instance built from `neon(serverEnv.databaseUrl)` + `drizzle(sql, { schema })`. The Neon HTTP driver is stateless per query: no transactions, no connection pooling to manage, and it is safe in serverless/edge-ish contexts.

**Schema barrel** (`src/db/schema/index.ts`) — `drizzle.config.ts` points at this one file, so any new table file in `src/db/schema/` must be re-exported from the barrel or drizzle-kit will not see it and `db:generate` will silently produce nothing for it. The barrel is currently empty (`export {}`).

**Two database URLs** — the app uses the pooled `DATABASE_URL`; `drizzle.config.ts` prefers `DATABASE_URL_UNPOOLED` because Neon's pooler cannot run migration DDL reliably. Keep both set.

**Auth** — `src/lib/auth.ts` is the server instance (import it in server code / route handlers); `src/lib/auth-client.ts` is the React client for components. All auth HTTP traffic is handled by the catch-all `src/app/api/auth/[...all]/route.ts`, which just re-exports better-auth's Next handler — don't hand-write auth endpoints alongside it.

## Current state of the scaffold

No tables are defined yet, so the build logs a `Drizzle schema mismatch` warning from better-auth about missing `user` / `session` / `account` / `verification` tables. That is expected. To resolve it:

```bash
npx @better-auth/cli generate --output src/db/schema/auth.ts
```

then export those tables from `src/db/schema/index.ts`, pass them to the adapter in `src/lib/auth.ts` as `drizzleAdapter(db, { provider: "pg", schema })`, and run `npm run db:generate && npm run db:migrate`.

Also not built yet: product/cart/order schemas, sign-in and sign-up UI, storefront pages, payments, deployment config. `src/app/layout.tsx` still carries the create-next-app default metadata.
