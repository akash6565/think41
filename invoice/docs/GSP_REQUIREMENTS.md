# GSP Requirements (Vendor Selection + Capabilities) — GSTEase v1.0

This document defines the minimum requirements GSTEase needs from a GST Suvidha Provider (GSP) partner to ship v1.0 (official APIs only).

## 1) Vendor selection checklist
### 1.1 Commercial & legal
- Ability to provide **production + sandbox** credentials.
- Contract allows **scaling during peak dates** (7th/11th/20th) without punitive throttling.
- Clear pricing: per-call, per-return, per-IRN, bundled tiers, overage fees.
- Clear SLAs and support escalation for filing windows.
- Data residency posture compatible with **AWS ap-south-1** deployment.
- DPA/terms covering handling of taxpayer data and tokens.

### 1.2 Technical maturity
- Published API docs (OpenAPI/collections) and stable versioning.
- Webhook support for async status updates (optional but preferred).
- Clear rate limits **per GSTIN** and per tenant, with headers/metadata to enforce client-side throttling.
- Test utilities: sample payloads, sandbox GSTINs, deterministic error simulation.
- Good observability: request id correlation in responses and error objects.

### 1.3 Security
- OAuth2 / token-based authorization for taxpayer consent flows.
- Token rotation and refresh supported.
- No requirement to store or transmit GST portal passwords (PRD constraint).
- IP allowlisting / mTLS support (preferred).
- Audit log access for API calls (preferred).

## 2) Required API capabilities (v1.0)
### 2.1 IRP / e-Invoice (IRN + QR)
Must support:
- IRN generation API:
  - Submit invoice payload to IRP
  - Receive **signed JSON** and required response fields
  - Provide QR code payload (or enough data to generate it)
- IRN status inquiry and retrieval
- Error codes mapped to field paths (preferred)
- Retry-safe idempotency (preferred: idempotency key support)

### 2.2 Returns filing (GSTR-1, GSTR-3B)
Must support:
- GSTR-1:
  - Upload/submit JSON payload
  - Validate/preview errors (if available)
  - File return and get **ARN**
  - Filing status poll
- GSTR-3B:
  - Upload/submit JSON payload
  - Validate/preview errors (if available)
  - File return and get **ARN**
  - Filing status poll

### 2.3 Authentication for filing
Must support BOTH:
- **EVC/OTP**
  - Trigger OTP for filing
  - Verify OTP and complete filing
- **DSC**
  - Provide signing challenge / hash to be signed
  - Accept signed payload and complete filing
  - Clear instructions for client-side signing integration constraints

### 2.4 GSTR-2B fetch
Must support:
- OAuth2 consent/token flows for taxpayer
- Fetch GSTR-2B for a given period
- Provide structured line items and metadata sufficient for mismatch reporting:
  - supplier GSTIN, invoice number/date, taxable value, tax components, ITC eligibility flags (as available)

### 2.5 IMS (Invoice Management System)
Must support:
- Fetch IMS items/actions for period
- Push accept/reject actions (single + bulk preferred)
- Status synchronization with timestamps (for audit trail)

### 2.6 Public lookups (nice-to-have but strongly preferred)
- GSTIN validation / taxpayer details (public/paid)
- Supplier filing status checks (for “ITC at risk” alerts)

## 3) Operational requirements
### 3.1 Rate limiting + queuing compatibility
Vendor must specify:
- Rate limits per GSTIN and per tenant
- Recommended backoff behavior
- Distinction between throttling vs portal downtime

### 3.2 Downtime and degraded mode
- APIs should return structured errors indicating portal downtime vs validation error.
- Support status endpoints to check GSTN/IRP availability (if offered).

## 4) Deliverables from the chosen GSP
- Sandbox credentials + onboarding guide
- Production onboarding checklist and go-live steps
- API docs + sample payloads for:
  - IRN generation
  - GSTR-1/3B flows (EVC + DSC)
  - GSTR-2B pull
  - IMS accept/reject
- Rate limit specification and headers
- Support contacts + escalation path for filing window incidents

