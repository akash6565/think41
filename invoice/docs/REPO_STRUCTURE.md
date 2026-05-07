# Repository Structure — GSTEase v1.0

GSTEase uses a TypeScript **monorepo** to share types/contracts between the web and API while keeping deployable units separate.

## Proposed layout
```
apps/
  web/            # Next.js 15+ (TypeScript, Tailwind)
  api/            # NestJS HTTP API (TypeScript)
  worker/         # NestJS worker/queue consumer (TypeScript)
packages/
  contracts/      # Shared DTOs + zod schemas + OpenAPI types (no runtime secrets)
  ui/             # Optional shared UI components (later)
  config/         # Optional shared eslint/tsconfig presets (later)
infra/
  docker/         # docker-compose for local Postgres/Redis
  aws/            # IaC placeholders (later: ECS/Lambda/RDS/ElastiCache)
docs/             # Product/engineering docs (PRD, design, architecture, runbooks)
```

## Principles
- **Single deployable responsibility** per `apps/*`.
- **No cross-app imports** except through `packages/*`.
- `packages/contracts` contains only:
  - request/response DTOs
  - schema validation (e.g., zod)
  - shared enums (invoice status, return types, etc.)
- Integration clients (GSP, AWS) live in `apps/api` or `apps/worker` depending on execution context.

## Local development expectations
- `apps/web` talks to `apps/api` over HTTP.
- `apps/api` and `apps/worker` share Postgres + Redis.
- Workers can be run as separate process in local env.

