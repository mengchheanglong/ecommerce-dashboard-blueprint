# Product Requirements Document (PRD): Multi-Tenant E-Commerce Platform Admin System

| Field | Detail |
|---|---|
| **Document Type** | Comprehensive System Product Requirements Document (PRD) |
| **System Surface** | Internal Platform Administration System (Full Platform Control Plane) |
| **Target Audience** | Engineering Leads, Product Managers, Platform Operators, Security Architects |
| **Responsibility Model** | Multi-tenant SaaS / Distributed Commerce (Merchant-owned stores & operations; Platform-governed infrastructure & rails) |

---

## 1. Product Context & Operational Boundary

A multi-tenant e-commerce platform provides independent businesses with branded digital storefronts while centralizing infrastructure, identity, payment gateways, and compliance.

### 1.1 The Operational Boundary
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

The Internal Platform Admin System gives operators a private, permission-controlled environment to support merchants, investigate technical exceptions, manage financial settlements, and monitor overall ecosystem health.

### 1.2 Time & Clock Policy
- **Authoritative Server Time:** All SLA calculations, token expirations, auto-cancellations, and security gates enforce strictly against server-side UTC timestamps (`TIMESTAMPTZ`). Client browser clocks are purely informational and cannot alter deadlines.
- **Configurable Platform Display Timezone:** Timestamps and date-based exports format in the platform's configured operational timezone (e.g. UTC, UTC+7, UTC-5) without altering stored epoch values.

---

## 2. Administrator Roles & Action-Level Boundaries (RBAC)

The system enforces a strict least-privilege two-role model: **Admin** and **Super Admin**.

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
│  + Provision & Activate Gateway Credentials                   │
│  + Modify Plan Entitlements & Platform Settings               │
│  + Create, Edit, or Deprecate Admin Accounts                  │
└───────────────────────────────────────────────────────────────┘
```

### 2.1 Action-Level Capabilities

| Action / Capability | Admin | Super Admin | Audit Log Trigger |
|---|:---:|:---:|:---:|
| **Platform Telemetry & Metrics** | View Only | View Only | No |
| **Support & Concierge Cases** | Create, Assign, Reply, Resolve | Full Access | Yes |
| **Store Directory** | View Details, Inspect Config | Suspend, Reinstate, Update Limits | Yes (Mandatory Reason) |
| **User Directory** | View Profile, History | Restrict, Ban, Revoke Sessions | Yes (Mandatory Reason) |
| **Order Exceptions & Stuck Orders** | View, Investigate Webhook | Force Status Sync, Flag Audit | Yes |
| **Customer Payments** | Inspect Status, Gateways | Mark Gateway Reconciliation Note | Yes |
| **Merchant Settlement Accounts** | View Submitted Details | Approve / Reject KYC & Bank Account | Yes (MANDATORY) |
| **Payout Executions** | View History & Balances | Execute Payout / Hold Escrow | Yes (MANDATORY) |
| **Gateway Credential Provisioning** | View Safe Metadata Only | Provision, Rotate, Suspend Credentials | Yes (MANDATORY) |
| **Subscription Plans & Billing** | View Plans & Subscribers | Create / Modify Plans & Feature Gates | Yes |
| **Operational Health & Queues** | View Status, Failure Dumps | Trigger Retry / Purge Failed Jobs | Yes |
| **Admin Account Management** | None | Invite, Change Roles, Deactivate | Yes (MANDATORY) |
| **Audit Logs** | View Accessible Actions | View All Actions | No (Read-only) |

### 2.2 Hard Administrative Safeguards
1. **Self-Demotion & Lockout Prevention:** No operator may change their own administrator role or disable their own account. The last active Super Admin account cannot be disabled or demoted.
2. **No Raw Secrets:** The admin system never displays, copies, or logs stored raw database passwords, full credit card numbers, or gateway API secret keys.
3. **No Ad-Hoc SQL Execution:** The web console never provides unconstrained raw SQL editors or arbitrary script runners.
4. **Assisted Merchant Changes:** Direct modifications to a merchant's store settings by an operator require explicit merchant consent, linked to an active support ticket ID.

---

## 3. Product Objectives & Success Criteria

| ID | Core Objective | Measurable Success Criteria |
|---|---|---|
| **O1** | **Zero Support Leakage** | 100% of merchant support inquiries generate a trackable ticket ID linked to affected store, order, or customer records. |
| **O2** | **Connected Investigation** | Operational exceptions (e.g. gateway timeout) link directly to originating store and user context. |
| **O3** | **Immutable Accountability** | Every sensitive administrative state mutation records `actor_id`, timestamp, prior state, new state, and mandatory reason. |
| **O4** | **Financial Traceability** | 100% of payout transactions and fee recognitions reconcile against immutable double-entry ledger accounts. |
| **O5** | **Governed SLA Queues** | Action backlogs (KYC review, payout approval, stuck orders) sort oldest-pending with color-coded SLA timers. |
| **O6** | **High-Fidelity Telemetry** | Platform KPIs (MRR, GMV, Success Rates) derive strictly from verified server-side event timestamps. |

---

## 4. The 11 Core System Modules

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   INTERNAL PLATFORM ADMINISTRATION                     │
├────────────────────────────────────────────────────────────────────────┤
│  1. Overview & Telemetry: Headline KPIs, Activation Funnel, Trust Chips│
│  2. Support & Concierge: Multi-channel intake, connected investigations│
│  3. Store Directory: Tenant search, store configuration & suspensions  │
│  4. User Directory: Identity controls, sessions, credential management │
│  5. Order Issues: Stuck orders, gateway timeouts, dispute tracking     │
│  6. Customer Payments: Gateway webhooks, intent logs, refund auditing  │
│  7. Merchant Settlements: Payout review, ledger audit, fund execution  │
│  8. Settlement Accounts: KYC bank account review, SLA queues           │
│  9. Plans & Billing: Subscription tiers, contracted MRR, entitlements  │
│ 10. Operational Health: Background jobs, worker queues, API monitoring │
│ 11. Security & Audit: RBAC accounts, immutable append-only audit trail │
└────────────────────────────────────────────────────────────────────────┘
```

### Module 1: Overview & Executive Telemetry
- **Primary KPIs:** Active Paid Stores (with 30-day net change), Subscription MRR & Cash Collections, Platform Paid Sales & Orders (GMV by currency), Gateway Success Rate.
- **Tenant Activation Funnel:** Created ──► Activated ──► First Valid Paid Order.
- **The Action Center:** 4 SLA-governed queues (KYC Bank Review, Payout Processing, Order Issues, Support Cases).
- **Trust Chips:** Real-time health indicators (System Status, Ledger Audit, Plan Entitlements, Data Freshness).

### Module 2: Support & Concierge System
- Unified ticket intake across web forms, support email, and platform webhooks.
- Connected dossiers: Cases attach directly to `store_id`, `order_id`, `payment_id`, or `user_id`.
- Internal discussion threads: Operator notes separated from merchant-visible replies.
- Strict 72-hour case resolution target with supervisor escalation.

### Module 3: Store Directory & Tenant Management
- Searchable multi-tenant directory with filters for Plan Tier, Status (`ACTIVE`, `GRACE`, `SUSPENDED`), and Launch Date.
- Store details: Owner contact, domains, connected sales channels, lifetime GMV, order volume.
- Controls (Super Admin): Temporary store suspension with customizable storefront maintenance banner; assisted configuration changes with recorded consent.

### Module 4: User & Identity Management
- Separation between **Shoppers** and **Store Owners/Staff**.
- Identity controls: Profile details, associated store memberships, login IP history, active session tracking.
- Security triggers: One-click session revocation (invalidating JWT refresh tokens in Redis) and forced credential reset.

### Module 5: Order Issues & Exception Management
- Monitoring for unhandled order states:
  - Missed merchant decision timeouts.
  - Gateway captures on cancelled/expired orders (triggering auto-refunds).
  - Webhook delivery failures.
- Detailed order timeline showing state transitions and payment gateway raw payloads.

### Module 6: Customer Payments & Gateway Webhooks
- Unified payment intent log across all integrated payment gateways.
- Gateway reconciliation fact sheets: Gateway reference ID, currency, amount, fee, capture timestamp.
- Failure code analysis: Diagnostic drawer grouping declines by issuer error codes.

### Module 7: Merchant Settlements & Payout Rails
- Payout review workbench: Payout amount requested, merchant available balance, escrow hold, destination account.
- Payout authorization workflow (Super Admin): Advances state from `REQUESTED` ──► `PROCESSING` ──► `COMPLETED`.
- Multi-currency segregation: Payouts executed strictly in store settlement currency without ad-hoc FX conversion.

### Module 8: Settlement Accounts & KYC Verification
- Queue displaying pending bank account submissions sorted oldest-first.
- SLA Target: 24-hour review window.
- Masked verification: Account holder name, bank identifier, masked account number (`•••• 1234`).
- Document inspection: Business registration proof and identity preview.

### Module 9: Store Plans, Entitlements & Billing
- SaaS subscription plan management: Tier pricing (Monthly/Annual), order volume quotas, feature entitlement flags.
- Contracted MRR baseline and invoice collection velocity.
- Private plan overrides: Controlled assignment of custom enterprise plan tiers.

### Module 10: Operational Health & Background Processing
- Queue telemetry: Active worker threads, queue latency, failed job dead-letter queue (DLQ).
- Monitored background processors:
  - Order acceptance timeout worker.
  - Subscription billing renewal worker.
  - Webhook delivery dispatcher.
- Idempotent manual job retries with stack trace inspection.

### Module 11: Security, Audit Logs & Admin Accounts
- Admin account roster: Super Admin and Admin staff accounts, session status, invitation management.
- Append-only audit log: `id`, `actor_id`, `action`, `resource_type`, `resource_id`, `payload_before`, `payload_after`, `ip_address`, `timestamp`.
- Strict immutability: No API or user can mutate or erase audit entries.
