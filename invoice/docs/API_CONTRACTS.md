# Internal API Contracts (Draft) — GSTEase v1.0

This is the draft contract for GSTEase internal APIs between the Next.js web app and the NestJS API/worker services. Final shapes should be expressed as shared DTOs in `packages/contracts` when the monorepo is bootstrapped.

Conventions:
- All endpoints require authentication (Clerk JWT) unless explicitly noted.
- All endpoints are scoped by **active organization** (single GSTIN per org in v1).
- All list endpoints support pagination (`cursor` or `page/limit`) to be defined.
- Sensitive fields (tokens, secrets) are never returned.

## 1) Health
- `GET /health/live`
- `GET /health/ready`

## 2) Auth & Session / Org selection
- `GET /me`
  - Returns current user + active org summary.
- `POST /orgs`
  - Creates an organization (single GSTIN).
- `GET /orgs`
  - Lists organizations the user belongs to.
- `POST /orgs/:orgId/select`
  - Sets active organization.
- `GET /orgs/:orgId`
  - Fetch org details.
- `PATCH /orgs/:orgId`
  - Update org profile (address, bank details, branding refs).

## 3) GSTIN utilities
- `GET /gstin/validate?gstin=...`
  - Validates GSTIN format and (optionally) via public API provider.
- `GET /gstin/:gstin/taxpayer`
  - Optional: fetch taxpayer metadata if available via provider.

## 4) Clients (Customers)
- `GET /clients`
- `POST /clients`
- `GET /clients/:clientId`
- `PATCH /clients/:clientId`
- `DELETE /clients/:clientId`

## 5) Products & Services (HSN/SAC)
- `GET /products`
- `POST /products`
- `GET /products/:productId`
- `PATCH /products/:productId`
- `DELETE /products/:productId`
- `GET /hsn/search?q=...`
  - Optional: local lookup table search.

## 6) Invoices
### 6.1 Invoice CRUD + lifecycle
- `GET /invoices`
  - Filters: status (draft/issued/paid/overdue), date range, client.
- `POST /invoices`
  - Creates draft invoice (header + items).
- `GET /invoices/:invoiceId`
- `PATCH /invoices/:invoiceId`
  - Updates draft invoice, recalculates totals.
- `POST /invoices/:invoiceId/issue`
  - Transitions to issued; triggers IRN queue if eligible.
- `POST /invoices/:invoiceId/mark-paid`
  - Manual payment status update (v1).

### 6.2 Invoice PDF & delivery
- `GET /invoices/:invoiceId/pdf`
  - Streams generated PDF.
- `POST /invoices/:invoiceId/send-email`
  - Sends invoice email with PDF attachment/links.

### 6.3 e-Invoice / IRN
- `GET /invoices/:invoiceId/irn`
  - Returns IRN status and latest attempt result (no secrets).
- `POST /invoices/:invoiceId/irn/retry`
  - Enqueues a retry if in failed state.

## 7) Returns periods
- `GET /returns/periods`
  - Lists periods and their filing statuses.
- `POST /returns/periods/:periodId/refresh`
  - Optional: recompute statuses/payloads (idempotent).

## 8) GSTR-1
- `POST /returns/gstr1/:periodId/generate`
  - Generate (or regenerate) versioned payload from invoices.
- `GET /returns/gstr1/:periodId/payload`
  - Fetch current payload metadata + summary.
- `POST /returns/gstr1/:periodId/validate`
  - Runs pre-submission validation; returns errors with fix hints.
- `POST /returns/gstr1/:periodId/submit`
  - Enqueues submission job; returns job id.
- `GET /returns/gstr1/:periodId/status`
  - Returns filing status, ARN if available, and receipt refs.

## 9) GSTR-3B
- `POST /returns/gstr3b/:periodId/prefill`
  - Generates prefill from GSTR-1 aggregates + ITC.
- `GET /returns/gstr3b/:periodId/payload`
  - Fetch current payload metadata + summary.
- `POST /returns/gstr3b/:periodId/validate`
- `POST /returns/gstr3b/:periodId/submit`
- `GET /returns/gstr3b/:periodId/status`

## 10) Filing authentication flows
### 10.1 EVC/OTP
- `POST /filing/evc/:periodId/request-otp`
- `POST /filing/evc/:periodId/verify-otp`

### 10.2 DSC
- `POST /filing/dsc/:periodId/challenge`
  - Returns signing challenge/hash and instructions.
- `POST /filing/dsc/:periodId/submit-signature`
  - Accepts signature and completes filing.

## 11) ITC & Reconciliation
### 11.1 Manual purchase records (MVP)
- `POST /itc/purchases/import`
  - Upload CSV; returns parse result.
- `GET /itc/purchases`

### 11.2 GSTR-2B (Phase 2)
- `POST /itc/gstr2b/:periodId/pull`
  - Enqueue pull job.
- `GET /itc/gstr2b/:periodId/status`
- `GET /itc/gstr2b/:periodId/lines`

### 11.3 Mismatch report + actions
- `GET /itc/mismatches/:periodId`
- `POST /itc/mismatches/:periodId/actions`
  - Accept/reject (single + bulk), writes audit trail.

### 11.4 IMS (Phase 2)
- `POST /itc/ims/:periodId/sync`
- `GET /itc/ims/:periodId/items`
- `POST /itc/ims/:periodId/actions`

## 12) Liability & payments
- `GET /liability/:periodId`
  - Output tax, ITC, net payable; late fee/interest if overdue.
- `POST /payments/pmt06/:periodId/generate`
  - Generates challan data and returns GST portal redirect info.

## 13) Notifications
- `GET /settings/notifications`
- `PATCH /settings/notifications`
- `POST /notifications/test`
  - Optional: send a test email/SMS to verify configuration.

## 14) Admin / ops (restricted)
- `GET /admin/jobs`
  - Lists async job states without secrets.
- `GET /admin/metrics`
  - High-level counters for success rates and failures.

