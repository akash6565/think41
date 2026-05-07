# GSTEase v1.0 Architecture Overview

This document is the single source of truth for GSTEase’s v1.0 system architecture, service boundaries, and environment setup. It aligns with the PRD (`docs/GSTEase_PRD_v1.0.pdf`), the design system (`docs/GST_SaaS_Design_Doc.md`), and the recommended stack (`docs/TECHSTACK.md`).

## Goals (v1.0)
- Guided GST-compliant invoicing (B2B/B2C) with PDF export and delivery.
- e-Invoicing compliance for eligible taxpayers (IRN + NIC-verifiable QR).
- ITC reconciliation (Phase 1: manual import; Phase 2: GSTR-2B auto-pull + IMS accept/reject).
- Guided return filing: GSTR-1 and GSTR-3B (EVC + DSC), with pre-validation and filing history (ARN).
- Resilient integrations: rate limits, queue/retry, and graceful GSTN downtime UX.
- Security/compliance: India-region hosting, encryption at rest (AES-256 via KMS), server-side token handling.

## Non-goals (v1.0)
- Full accounting/bookkeeping, payroll, income tax.
- Inventory/POS.
- Multi-GSTIN / multi-entity.
- Annual return (GSTR-9).
- ERP integrations.
- CA multi-client dashboard.

## System overview
### Primary components
- **Web app (Next.js 15 + TypeScript + Tailwind)**: user-facing UI (dashboard, invoicing, ITC, filing wizards, settings).
- **API service (NestJS + TypeScript)**: core domain logic, authz, validations, invoice/tax computation, return generation, integrations orchestration.
- **Worker(s) (NestJS worker or separate process)**: async jobs for IRN generation, filing submit/polling, GSTR-2B pulls, reminders.
- **PostgreSQL (RDS in prod)**: authoritative relational store (orgs, invoices, returns payloads, audit trails).
- **Redis (ElastiCache in prod)**: rate limiting, per-GSTIN queues, background job coordination, idempotency keys.
- **AWS KMS**: envelope encryption for sensitive at-rest data (tokens, selected invoice/org fields as needed).
- **Email/SMS**: AWS SES + SNS for reminders and invoice delivery.
- **PDF generation**: Playwright-based HTML→PDF rendering (local + Lambda in prod).

### External systems (via GSP)
- **IRP**: IRN generation, signed JSON, QR payload.
- **GSTN Returns API**: GSTR-1 and GSTR-3B submit, status, acknowledgment (ARN).
- **GSTR-2B Fetch API**: monthly ITC statement pull.
- **IMS API**: accept/reject actions and status sync.
- **Public APIs**: GSTIN validation, supplier filing status (availability varies by provider/API).

## Service boundaries
### Web (Next.js)
- **Responsibilities**
  - UX flows: onboarding, invoicing, ITC dashboard, return filing wizards, filing history, settings.
  - Rendering PDF previews (fetching generated PDFs from API).
  - Client-side form validation and optimistic UX (never handles GSTN/GSP tokens).
- **Hard constraints**
  - No GSTN/GSP tokens in browser storage.
  - All filing/IRN actions trigger server-side jobs and status polling.

### API (NestJS)
- **Responsibilities**
  - AuthN/AuthZ (Clerk JWT verification, org membership, object-level checks).
  - Domain logic and persistence.
  - Schema validation and “plain-English” error translation.
  - Idempotent write APIs and job enqueueing.
  - Observability and redaction of sensitive fields.

### Worker(s)
- **Responsibilities**
  - IRN generation queue processing with retries/backoff.
  - Filing submission + status polling (GSTR-1/3B) with EVC/DSC flows.
  - Scheduled monthly pulls (GSTR-2B, IMS sync) and due-date reminders.
  - Enforcement of rate limits per GSTIN and circuit-breaking during outages.

## Data model (high level)
- **Identity & tenancy**
  - `users` (Clerk user id)
  - `organizations` (single GSTIN per org in v1)
  - `organization_members`
- **Masters**
  - `clients` (customers)
  - `products_services` (HSN/SAC, rates)
- **Invoicing**
  - `invoices` (header, totals, status)
  - `invoice_items`
  - `payments` (manual status now; webhooks later)
  - `einvoice_irn_requests` (attempts/status, signed JSON metadata)
- **Returns**
  - `returns_periods`
  - `gstr1_payloads` (versioned JSON + validation result)
  - `gstr3b_payloads` (versioned JSON + validation result)
  - filing submissions + acknowledgments (ARN) and receipts
- **ITC**
  - `purchase_records` (manual import)
  - `gstr2b_lines` (auto-pull)
  - `itc_reconciliation_actions` (audit trail)
- **Audit/ops**
  - audit log table for security-sensitive actions
  - job state tables where needed for user-facing status

## Security & compliance posture (v1.0)
- **Encryption at rest**: PostgreSQL storage uses envelope encryption for sensitive fields using **AWS KMS**; keys managed in ap-south-1.
- **Token handling**: GSTN/GSP OAuth tokens stored encrypted; never returned to client; never logged.
- **Data residency**: production runs in **AWS ap-south-1** (Mumbai).
- **Least privilege**: separate IAM roles for API, worker, PDF lambda, and notifications.
- **Auditability**: append-only logs for filing submit events, ITC accept/reject actions, token refreshes.

## Reliability patterns
- **Async for GSTN calls**: all IRN and filing requests are queued; UI shows queued/pending/success/failure.
- **Per-GSTIN throttling**: Redis-based token bucket + queue to honor provider/GSTN limits.
- **Retries**: exponential backoff; terminal states surfaced to user with next actions.
- **Idempotency**: write APIs use idempotency keys for submit actions to prevent duplicates.
- **Graceful degradation**: when upstream is down, keep user workflow unblocked and defer submission.

## Environments
### Local development
- Postgres + Redis running locally (compose).
- Sandbox GSP credentials (no real filing).
- Local KMS fallback (dev-only key material) while keeping the encryption API identical.

### Sandbox / staging
- Full stack on AWS (ap-south-1), using GSTN/GSP sandbox.
- Seeded sample orgs/GSTINs; background jobs enabled.
- Observability enabled with alerting thresholds set low for early detection.

### Production
- Multi-AZ Postgres, Redis, ECS/Fargate services for API + workers, Lambda for PDF (or ECS-run Playwright if needed).
- Strict secret management (AWS Secrets Manager/SSM), KMS enforced.
- Peak-date scaling policy (7th/11th/20th).

