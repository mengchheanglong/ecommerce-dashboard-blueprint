# Platform Admin Operations, SLAs & Compliance Guide

This guide establishes the Standard Operating Procedures (SOPs), Service Level Agreements (SLAs), and compliance standards for operators managing a multi-tenant e-commerce platform.

---

## 1. Operational SLAs & Escalation Matrix

To ensure consistent response times across administrative queues, operations adhere to the following SLA matrix:

| Queue / Workflow | Target SLA | Due Soon Warning | Critical Breach | Responsible Role | Escalation Action |
|---|:---:|:---:|:---:|:---:|---|
| **Support Case Triage** | 4 hours | 3 hours | > 4 hours | Admin | Alert Support Lead |
| **Bank Account KYC Verification** | 24 hours | 18 hours | > 24 hours | Admin / Super Admin | Alert Compliance Officer |
| **Merchant Payout Processing** | 48 hours | 36 hours | > 48 hours | Super Admin | Alert Head of Finance |
| **Stuck Order Exception Triage** | 12 hours | 8 hours | > 12 hours | Admin | Notify Merchant Support |
| **Failed Background Job Resolution** | 2 hours | 1 hour | > 2 hours | Platform Engineer | SRE On-call Page |
| **Security / Account Takeover Triage** | 1 hour | 30 minutes | > 1 hour | Super Admin | Initiate Incident Protocol |

---

## 2. Standard Operating Procedures (SOPs)

### 2.1 Bank Account & KYC Verification SOP
1. **Intake:** Merchant submits legal entity details and settlement account via merchant portal.
2. **Review Checklist:**
   - Account name must match legal business entity or verified owner name.
   - Bank identifier (routing / BIC / SWIFT) must belong to supported local financial institutions.
   - Masked verification: Ensure account number matches supporting documentation.
3. **Outcomes:**
   - **Approve:** Enables merchant withdrawal eligibility; stamps `verified_by_user_id` and timestamp.
   - **Reject:** Operator must select structured rejection reason (e.g. `NAME_MISMATCH`, `INVALID_ACCOUNT_DETAILS`, `UNSUPPORTED_INSTITUTION`) and provide merchant instructions.

### 2.2 Merchant Payout Execution SOP
1. **Pre-flight Checks:**
   - Verify Wallet-to-Ledger audit check is green.
   - Confirm merchant store is in good standing (no active fraud flags or high chargeback velocity).
   - Ensure destination bank account has `VERIFIED` status.
2. **Execution:**
   - Super Admin reviews requested amount against merchant available balance.
   - Super Admin authorizes transaction; system generates outbound banking instruction.
   - State advances: `REQUESTED` ──► `PROCESSING` ──► `COMPLETED`.
   - Double-entry ledger debits `MERCHANT_PAYABLE` and credits `ESCROW_HOLDING` / bank settlement account.

### 2.3 Store Suspension & Enforcement SOP
1. **Grounds for Suspension:**
   - Unresolved fraud alerts, high dispute rates (> 1.5%), severe terms of service violations, or non-payment of subscription dues beyond grace period.
2. **Execution Protocol:**
   - Super Admin selects store and triggers `Suspend Store`.
   - Mandatory modal prompts structured reason category and internal justification text.
   - System updates `stores.status = 'SUSPENDED'`.
   - Front-end storefront displays clean maintenance/inquiry banner; checkout endpoints are disabled.
   - Merchant receives automated email notification detailing suspension cause and appeal instructions.

### 2.4 User Session Revocation SOP
In the event of suspected credential compromise:
1. Operator navigates to User Profile in Directory.
2. Selects `Revoke Active Sessions`.
3. System invalidates all active JWT refresh tokens and session cookies in Redis cache.
4. User is immediately logged out across all web and mobile client surfaces.

---

## 3. Data Retention & Compliance Policies

### 3.1 Financial & Transaction Records
- **Retention Period:** 7 years (statutory financial audit requirement).
- **Scope:** Double-entry ledger entries, payout disbursements, payment intents, and subscription invoices.
- **Immutability:** No API, administrator action, or cron job is permitted to update or hard-delete ledger records. Adjustments must be posted as offsetting journal entries.

### 3.2 Audit Log Policy
- **Retention Period:** Permanent / Indefinite.
- **Coverage:** Every administrative mutation across stores, users, bank accounts, and platform configuration must write to `audit_logs`.
- **Payload Capture:** Logs must record both `payload_before` and `payload_after` for forensic auditing.

### 3.3 Customer Data & PII Redaction
- For user accounts deleted upon verified GDPR/CCPA consumer request:
  - Redact personal information (name, email, phone, shipping addresses) in historical order records after fulfillment lifecycle completion.
  - Maintain anonymized financial amounts, product IDs, and payment reference tokens to preserve tax reporting accuracy.
