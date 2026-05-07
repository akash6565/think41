# Environment Variables — GSTEase v1.0

This document lists expected environment variables. Names are suggestions; finalize once the repo structure (`apps/web`, `apps/api`, `apps/worker`) is in place.

## 1) Common
- `NODE_ENV` — `development|test|production`
- `APP_ENV` — `local|sandbox|staging|prod`

## 2) Web (Next.js)
- **Clerk**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- **API base**
  - `NEXT_PUBLIC_API_BASE_URL`

## 3) API (NestJS)
### 3.1 Server
- `PORT`
- `CORS_ORIGINS` — comma-separated

### 3.2 Clerk (JWT verification)
- `CLERK_JWKS_URL` (or Clerk issuer URL, depending on integration)
- `CLERK_AUDIENCE` (if applicable)

### 3.3 Database
- `DATABASE_URL` — Postgres connection string

### 3.4 Redis
- `REDIS_URL`

### 3.5 AWS (KMS + storage + notifications)
- `AWS_REGION` — `ap-south-1`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (local only; prefer IAM roles in AWS)
- `AWS_KMS_KEY_ID`
- `S3_BUCKET_UPLOADS` (branding/logo uploads)
- `SES_FROM_EMAIL`
- `SNS_SENDER_ID` (if applicable)

### 3.6 GSP / GSTN provider
- `GSP_BASE_URL`
- `GSP_CLIENT_ID`
- `GSP_CLIENT_SECRET`
- `GSP_REDIRECT_URI` (OAuth callback)
- `GSP_WEBHOOK_SECRET` (if webhooks used)
- `GSP_RATE_LIMIT_PER_GSTIN_PER_MIN` (optional config override)

### 3.7 PDF generation
- `PDF_SERVICE_MODE` — `local|lambda|ecs`
- `PDF_LAMBDA_FUNCTION_NAME` (if lambda)

### 3.8 Observability
- `LOG_LEVEL` — `debug|info|warn|error`
- `SENTRY_DSN` (optional)

## 4) Worker (NestJS worker / queue consumer)
- `DATABASE_URL`
- `REDIS_URL`
- `AWS_REGION`
- `AWS_KMS_KEY_ID`
- `GSP_BASE_URL`
- `GSP_CLIENT_ID`
- `GSP_CLIENT_SECRET`
- `SES_FROM_EMAIL`

## 5) Local development defaults (suggested)
- `APP_ENV=local`
- `AWS_REGION=ap-south-1`
- `DATABASE_URL=postgresql://gstease:gstease@localhost:5432/gstease`
- `REDIS_URL=redis://localhost:6379`

