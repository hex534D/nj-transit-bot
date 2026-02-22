# NJ Transit Bot

A lightweight Node.js/TypeScript service that queries the NJ Transit GraphQL
API and sends light‑rail alerts to a Telegram chat. It runs on a cron schedule
and currently supports a morning‑commute notification.

## Quick Start

1. install dependencies: `pnpm install`
2. set environment variables (see `src/config/env.ts` for required keys)
3. run in development mode:
   ```sh
   pnpm run dev
   ```
4. build for production:
   ```sh
   pnpm run build && pnpm start
   ```

## Structure

- `src/index.ts` – entry point, configures cron jobs
- `src/config/env.ts` – environment validation
- `src/jobs/` – scheduled tasks (e.g. `morningCommute.ts`)
- `src/services/` – API clients and notification helpers
- `src/utils/` – logger, types and utility functions
- `scripts/` – small one‑off tools for testing

Extend by adding new jobs and using the existing service/util helpers.
