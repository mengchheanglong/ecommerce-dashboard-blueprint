# Platform Administration System — Architecture & Documentation

The **Platform Administration System** is the comprehensive operational cockpit and control plane for managing a multi-tenant e-commerce platform. 

Unlike the merchant surfaces (which are scoped to individual store operations and analytics), the Platform Admin system manages the entire platform: tenant onboarding, store controls, subscription billing, multi-gateway payments, merchant payout rails, KYC verifications, background queues, and compliance audit trails.

---

## Documentation Structure

| Document | Description |
|---|---|
| **[`01_System_PRD_Specification.md`](./01_System_PRD_Specification.md)** | **Full System PRD:** Least-privilege RBAC (`Admin` vs. `Super Admin`), operational boundary, 11 core modules, workflows, and explicit non-goals. |
| **[`02_Platform_Metrics_Evaluation.md`](./02_Platform_Metrics_Evaluation.md)** | Telemetry & Metric Evaluation Matrix: Evaluation of 67 operational platform questions, 7 adopted operating rules, and the 15 executive items. |
| **[`03_Dashboard_Wireframe_and_States.md`](./03_Dashboard_Wireframe_and_States.md)** | Executive Dashboard Blueprint: Wireframes, 4 visual bands, 15 KPI contracts, and dynamic UI states (Healthy 🟢, Busy 🟡, Degraded 🔴). |
| **[`04_Operations_SLAs_and_Compliance.md`](./04_Operations_SLAs_and_Compliance.md)** | Standard Operating Procedures (SOPs): Bank account KYC reviews, payout execution, store suspensions, queue SLAs, and 7-year audit retention. |

---

## Core System Modules

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
