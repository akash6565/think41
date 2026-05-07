# Data Classification & Handling — GSTEase v1.0 (Draft)

This document classifies GSTEase data, defines handling requirements, and sets placeholders for retention/deletion policies required by the PRD.

## 1) Classification levels
### L0 — Public
Data safe to disclose publicly.
- Marketing site content, documentation meant for public release.

### L1 — Internal
Non-sensitive operational data.
- Feature flags (non-user specific), anonymized metrics, non-secret configuration.

### L2 — Confidential (Customer)
Business data that must be protected and access-controlled.
- Invoice headers/items, customer master data, product/service masters.
- Return payload summaries and statuses (excluding tokens/secrets).
- Filing history (ARNs, timestamps).

### L3 — Regulated / Highly sensitive
Data that can enable account takeover, fraud, or significant privacy risk.
- GSTN/GSP OAuth tokens and refresh tokens.
- Any credentials or secrets (PRD: **never store portal passwords**).
- Encryption keys or materials (KMS key ids, wrapped keys, etc.).
- DS/DSC signing artifacts where applicable (private key must never be handled by server).

## 2) Data types and examples
- **PII**: name, email, phone, address of users and customers.
- **Tax identifiers**: GSTIN, PAN (if present), invoice numbers, IRN, ARN.
- **Financial**: invoice values, taxes, liability computations, payment status.
- **Operational**: job statuses, API request ids, error logs (redacted).

## 3) Handling requirements (by classification)
### L0
- No restrictions.

### L1
- Access limited to staff and systems; no secrets.

### L2
- Stored in Postgres (RDS) with strict authz (org membership + object-level checks).
- Encrypted at rest via managed storage; select fields may be additionally encrypted (see L3).
- Never logged in full when not required; avoid dumping payloads into logs.
- Backups treated as L2.

### L3
- Stored only when required and always **field-level encrypted** using KMS envelope encryption.
- Never returned to the browser/client.
- Never logged (request/response scrubbing required).
- Strict IAM roles and least privilege.
- Access restricted to server-side components that must use them (API/worker).

## 4) Token handling policy (GSTN/GSP)
- Tokens are obtained via official OAuth flows and stored encrypted.
- Tokens are used only by server-side services (API/worker).
- Token refresh is performed server-side; refresh events are audit logged (without token values).
- Any token-bearing HTTP payload is scrubbed from logs.

## 5) DSC handling policy
- Private keys **must remain client-side** (USB token / local signing utility).
- Server provides a signing challenge/hash and accepts a signature response.
- Store only what is required to prove submission (timestamps, non-sensitive references).

## 6) Retention & deletion (placeholders to finalize)
These are placeholders until legal/compliance finalization.
- **Account cancellation**: initiate deletion workflow; retain minimal records for compliance/audit as required.
- **Invoices and return filings**: retention period TBD (commonly multiple years; verify statutory requirements).
- **Tokens**: delete immediately on disconnect/revocation; rotate and purge on schedule.
- **Logs**: retention TBD; ensure logs never contain L3 data.

## 7) Access control model (v1)
- Single GSTIN per org in v1.
- All objects are scoped to an org.
- Every request enforces: authenticated user → org membership → object belongs to org.

## 8) Audit requirements (v1)
Audit log entries (no secrets) for:
- Filing submission attempts and outcomes.
- ITC accept/reject actions.
- Token refresh and revocation events.
- Org settings changes (GSTIN, address, bank details, branding).

