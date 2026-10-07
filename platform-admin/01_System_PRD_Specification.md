# Product Requirements Document (PRD): Multi-Tenant E-Commerce Platform Admin System

| Field | Detail |
|---|---|
| **Document Type** | Product Requirements Document (PRD) — Architecture & Template |
| **System Surface** | Internal Platform Administration System |
| **Target Audience** | Engineering Leads, Product Managers, Platform Operators, Security Architects |
| **Responsibility Model** | Multi-tenant SaaS / Distributed Commerce (Merchant-owned stores & operations; Platform-governed infrastructure & rails) |

---

## 1. Product Context & Operational Boundary

A multi-tenant e-commerce platform provides independent businesses with branded digital storefronts while centralizing infrastructure, identity, payment gateways, and compliance.

### 1.1 The Responsibility Boundary
Clear separation between merchant responsibilities and platform responsibilities is essential to prevent platform operators from overstepping into day-to-day merchant operations:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MERCHANT RESPONSIBILITY                         │
│  - Product catalog, pricing, variants, and stock management            │
│  - Order preparation, packaging, fulfillment, and delivery             │
│  - Returns, product quality, and standard buyer disputes               │
│  - Direct customer communications and relationship management          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Hosted on Rails
┌──────────────────────────────────▼─────────────────────────────────────┐
│                        PLATFORM RESPONSIBILITY                         │
│  - Tenant onboarding, authentication, identity, and RBAC               │
│  - Platform subscription plans, entitlement limits, and billing        │
│  - Gateway integration, payment webhooks, and double-entry ledger      │
│  - Merchant payout accounts, KYC verification, and escrow settlements  │
│  - Operational health: cron schedules, queue workers, API availability │
│  - Platform security, abuse prevention, and immutable audit logs       │
└────────────────────────────────────────────────────────────────────────┘
```

The Internal Platform Admin System provides operators with a single, permission-controlled, auditable environment to support merchants, investigate technical exceptions, manage financial settlements, and monitor overall ecosystem health.

---

## 2. Administrator Roles & Permission Matrix (RBAC)

The admin system enforces a strict least-privilege two-role model: **Admin** and **Super Admin**.

```text
┌───────────────────────────────────────────────────────────────┐
│                          SUPER ADMIN                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                          ADMIN                          │  │
│  │  - Dashboard Overview & Telemetry                       │  │
│  │  - Read/Triage Support Cases & Concierge                │  │
│  │  - View User & Store Directories                        │  │
│  │  - Inspect Order Issues & Exceptions                    │  │
│  │  - View Payment Logs & Webhook Dispatches               │  │
│  │  - View Settlement & Payout History                     │  │
│  │  - Operational Health & Background Queues               │  │
│  │  - View Security Audit Logs                             │  │
│  └─────────────────────────────────────────────────────────┘  │
│  + Authorize & Execute Merchant Payouts                       │
│  + Verify / Reject Merchant Bank & Settlement Accounts        │
│  + Suspend / Reinstate Stores and User Accounts               │
│  + Revoke Active Sessions & Force Credential Resets           │
│  + Modify Plan Entitlements & Platform Settings               │
│  + Create, Edit, or Deprecate Admin Accounts                  │
└───────────────────────────────────────────────────────────────┘
```

### 2.1 Detailed Role Capabilities

| Module / Action | Admin | Super Admin | Audit Log Trigger |
|---|:---:|:---:|:---:|
| **Platform Telemetry & Metrics** | View Only | View Only | No |
| **Support & Concierge Cases** | Create, Assign, Reply, Resolve | Full Access | Yes |
| **Store Directory** | View Details, Inspect Config | Suspend, Reinstate, Update Limits | Yes (on state mutation) |
| **User Directory** | View Profile, History | Restrict, Ban, Revoke Sessions | Yes (on session/ban change) |
| **Order Exceptions** | View, Investigate Webhook | Force Status Sync, Flag Investigation | Yes |
| **Customer Payments** | Inspect Status, Gateways | Mark Gateway Reconciliation Note | Yes |
| **Merchant Settlement Accounts** | View Submitted Details | Approve / Reject KYC & Bank Account | Yes (MANDATORY) |
| **Payout Executions** | View History & Balances | Execute Payout / Hold Escrow | Yes (MANDATORY) |
| **Subscription Plans & Billing** | View Plans & Subscribers | Create / Modify Plans & Feature Gates | Yes |
| **Operational Health & Queues** | View Status, Failure Dumps | Trigger Retry / Purge Failed Jobs | Yes |
| **Admin Account Management** | None | Invite, Change Roles, Deactivate | Yes (MANDATORY) |
| **Audit Logs** | View Accessible Actions | View All Actions | No |

---

## 3. Product Objectives & Success Criteria

| ID | Core Objective | Measurable Success Criteria |
|---|---|---|
| **O1** | **Zero Support Leakage** | 100% of merchant support inquiries originating via in-app forms, support emails, or webhooks generate a trackable ticket ID. |
| **O2** | **Connected Investigation** | Operational exceptions (e.g. webhook drop) link directly to affected store, order, and customer records. |
| **O3** | **Immutable Accountability** | Every sensitive state change records `admin_user_id`, timestamp, prior state, new state, and mandatory reason. |
| **O4** | **Financial Traceability** | 100% of manual and automated payout transactions reconcile against double-entry ledger entries. |
| **O5** | **Governed SLA Queues** | Action backlogs (KYC review, payout approval, stuck orders) are sorted by oldest-pending and color-coded by SLA band. |
| **O6** | **High-Fidelity Telemetry** | Platform KPIs (MRR, GMV, Success Rates) derive strictly from verified server-side event timestamps. |

### 3.1 Explicit Non-Goals
To prevent feature bloat and security hazards, the V1 admin system explicitly excludes:
- **Marketplace Mediation:** Arbitrating standard return/warranty claims between shoppers and merchants.
- **Unrestricted Impersonation:** Logging in as a merchant without cryptographic delegation or merchant awareness.
- **Raw Secret Display:** Exposing database passwords, API keys, or full credit card / bank numbers.
- **Ad-Hoc Database Consoles:** Providing unconstrained raw SQL query execution in the browser.
- **Silent Cascading Deletions:** Deleting a merchant account must never cascade-delete immutable financial ledger logs.

---

## 4. Feature Specifications by Module

### 4.1 Overview & Action Center
- **Executive Health KPIs:**
  - **Active Paid Stores:** Total stores currently subscribed, with 30-day net change.
  - **Subscription MRR:** Monthly Recurring Revenue plus trailing 30-day collection velocity.
  - **Platform Paid Commerce (GMV):** Total valid commerce sales across all hosted stores, broken down by currency.
  - **Payment Gateway Success Rate:** Ratio of successful payment intents against all initiated intents.
- **Growth Funnel:** Store creation → store activation → first valid paid order.
- **The Action Center (SLA Queues):**
  - **Bank Verification Queue:** New accounts awaiting KYC review (SLA: < 24h).
  - **Payout Processing Queue:** Pending payout withdrawals awaiting execution (SLA: < 48h).
  - **Order Issues Queue:** Stuck or unacknowledged orders (SLA: < 12h).
  - **Support Queue:** Open merchant and platform tickets (SLA: < 4h).
- **System Status Chip:** Live health indicator showing database latency, background worker lag, and gateway uptime.

### 4.2 Support & Concierge System
- Unified case intake across web forms, emails, and integrated messaging webhooks.
- Case linking: Each case can be attached to a `store_id`, `user_id`, `order_id`, or `payment_id`.
- Internal discussion threads: Private operator notes segregated from merchant-visible messages.
- Pre-canned responses for standard compliance requests.

### 4.3 Store Directory & Tenant Management
- Searchable directory filtering by Plan, Status (`ACTIVE`, `GRACE`, `SUSPENDED`, `TRIAL`), and Creation Date.
- **Store Detail View:**
  - Owner details, store domain, connected custom domains.
  - Plan tier, billing status, next invoice date.
  - Performance summary: Lifetime GMV, 30-day order volume.
- **Store Controls (Super Admin only):**
  - Suspend store (temporary shutdown with customizable public banner).
  - Reinstate store.
  - Adjust feature flags / overrides.

### 4.4 User & Identity Management
- Separation of identities: **Shoppers** vs. **Store Owners / Staff**.
- User profile view: Associated stores, order history, active sessions, IP login history.
- Security actions: Revoke all active bearer tokens / cookies, force password reset, lock account for security investigation.

### 4.5 Financial Settlements & Payout Rails
- Dual-pane payout review interface:
  - Left pane: Payout request details (amount, requested timestamp, destination bank account, verified status).
  - Right pane: Store financial breakdown (available balance, locked escrow, recent disputes/refunds).
- Execution states: `REQUESTED` → `PROCESSING` → `COMPLETED` / `FAILED`.
- Multi-currency segregation: Payouts executed strictly in store settlement currency without ad-hoc currency conversion.

### 4.6 KYC & Bank Account Verification
- Queue displaying pending bank submissions sorted oldest-first.
- Masked projection: Account name, bank identifier, masked account number (`•••• 1234`).
- Document viewer: Identity proof and business registration preview.
- Decision triggers:
  - **Approve:** Activates payout capability for store.
  - **Reject:** Prompts mandatory reason selection; triggers automated notification to merchant.

### 4.7 Operational Health & Background Processing
- Real-time queue telemetry: Active workers, queue backlog count, failed job dead-letter queue (DLQ).
- Specific job monitoring:
  - Order acceptance timeout worker.
  - Subscription billing renewal worker.
  - Webhook delivery dispatcher.
- Failed job inspection: View stack trace, retry job manually, or archive.

### 4.8 Security & Audit Logging
- Append-only audit table: `audit_logs` storing `id`, `actor_id`, `actor_role`, `action`, `resource_type`, `resource_id`, `payload_before`, `payload_after`, `ip_address`, `created_at`.
- Immutable design: No API or admin interface allows update or deletion of audit logs.
- Filtering by actor, target store, date range, and severity level.
