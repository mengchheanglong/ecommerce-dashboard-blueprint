# End-to-End Implementation & Development Workflow Guide

This document establishes the end-to-end development workflow, architectural staging, and verification gates for building the complete e-commerce dashboard system—from product specification to production delivery.

---

## 1. High-Level Architecture Overview

A production e-commerce platform connects three distinct surfaces to a unified backend and database:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT DASHBOARD SURFACES                       │
├────────────────────────────────────┬───────────────────────────────────┤
│  MERCHANT FACING SURFACES          │  INTERNAL OPERATOR SURFACES       │
│  (Next.js App / Subdomain Route)   │  (Next.js App / Admin Route)      │
│                                    │                                   │
│  1. Merchant Overview Dashboard    │  3. Platform Admin System         │
│     • Daily Operational Cockpit    │     • Full 11-Module Control Plane│
│     • Urgent Action Queues         │     • Least-Privilege 2-Role RBAC │
│                                    │     • SLA Queues (KYC / Payouts)  │
│  2. Merchant Analytics Dashboard   │     • Gateway Credentials & Webhooks│
│     • 3-Tab Analytical Deep-Dive   │     • Immutable Audit Trail       │
│     • Sales, Products, Operations  │                                   │
└──────────────────┬─────────────────┴───────────────────┬───────────────┘
                   │                                     │
                   ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          BACKEND API SERVICES                          │
│  - Multi-tenant Tenant Isolation Middleware                            │
│  - Order State Machine & Decision Timeout Background Workers           │
│  - Payment Gateway Webhook Ingestion & Idempotent Capture              │
│  - Double-Entry Ledger Engine & Escrow Holding Accounts                │
│  - Real-time Redis Caching for User Sessions & Queue Counters          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL & REDIS DB                          │
│  - Authoritative Event Timestamps (`orders.paid_at`, `invoices.paid_at`)│
│  - Append-Only `audit_logs` & `ledger_entries` Tables                  │
│  - Granular Indexes on `(store_id, paid_at, status)`                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Development Workflow

### Phase 1: Shared Foundation & Ledger Models
**Goal:** Establish database schemas, state machines, and financial integrity rules before writing any UI code.
1. **Order State Machine:** Implement the 10 order states (`DRAFT`, `PENDING_PAYMENT`, `PAID`, `ACCEPTED`, `REJECTED`, `FULFILLED`, `COMPLETED`, `CANCELLED`, `REFUNDED`, `EXPIRED`).
2. **Authoritative Timestamping:** Ensure `orders.paid_at` is stamped strictly when gateway funds settle. Exclude uncollected COD orders from paid status.
3. **Double-Entry Ledger:** Create immutable ledger account types (`ESCROW_HOLDING`, `MERCHANT_PAYABLE`, `PLATFORM_FEE`, `SUBSCRIPTION_REVENUE`).
4. **Timezone Policy:** Configure PostgreSQL queries to truncate timestamps by the merchant's configured store timezone (`date_trunc('day', paid_at AT TIME ZONE store_tz)`).

### Phase 2: Merchant Overview Dashboard (Daily Operations)
**Goal:** Provide merchants with a fast, responsive operational cockpit to prevent order drop-offs.
1. **Section 1: Business Health:**
   - Display Paid Sales, Paid Orders, and Available Balance.
   - Build daily/weekly/monthly granularity toggles with preceding-period percentage deltas.
2. **Section 2: Needs Attention Queues:**
   - Implement `decisionQueueTotal`: Query orders requiring accept/reject (`PAID` for prepaid, `PENDING_PAYMENT` for COD) sorted nearest deadline first.
   - Implement `fulfillmentQueueTotal`: Accepted prepaid orders awaiting dispatch.
   - Implement `inventoryAlertsTotal`: SKUs where `physical_stock - reserved_stock <= 5`.
3. **Section 3: Quick Action Drawers:**
   - Build slideout sheets allowing one-click order acceptance/rejection directly from mobile devices.

### Phase 3: Merchant Analytics Dashboard (3-Tab Architecture)
**Goal:** Deliver deep business intelligence without cognitive overload.
1. **Tab 1: Sales & Conversion:**
   - Build Paid Sales vs. Total Booked Sales revenue gap card.
   - Build Cash-on-Delivery (COD) collection rate gauge.
   - Build storefront conversion funnel (Visits ──► Product Views ──► Carts ──► Checkout ──► Paid).
2. **Tab 2: Products & Catalog:**
   - Build Best Sellers vs. Slowest Movers (Dead Stock) toggle table.
   - Build product category revenue breakdown chart.
   - Build customer retention split (New vs. Returning) and purchase frequency histogram (`1x`, `2–3x`, `4+`).
3. **Tab 3: Operations & Losses:**
   - Build fulfillment cycle turnaround timer.
   - Build categorical cancellation & refund breakdown bars.

### Phase 4: Platform Administration System (Full Control Plane)
**Goal:** Provide internal operators with a permission-controlled, auditable environment to govern the platform.
1. **Role-Based Access Control (RBAC):**
   - Implement strict 2-role boundaries (`Admin` vs. `Super Admin`).
   - Super Admin controls: Payout execution, KYC approval/rejection, store suspensions, admin invitations.
2. **Action Center SLA Queues:**
   - Bank Account KYC Review Queue (24h target SLA, oldest-first sort).
   - Payout Processing Queue (48h target SLA, oldest-first sort).
   - Support Concierge Inbox (4h first response SLA).
3. **Operational Telemetry & System Health:**
   - Active Paid Stores (with net change: `+ Activated - Expired`).
   - Subscription MRR run-rate & invoice collection velocity.
   - Gateway Success Rate monitor with automated alerts if $< 82\%$.
   - Live Trust Chips: API uptime, worker dead-letter queues, and wallet-ledger audit check.
4. **Security & Audit Logs:**
   - Implement append-only `audit_logs` table capturing `actor_id`, timestamp, prior state, new state, and mandatory justification.

---

## 3. Recommended Technology Stack

| Layer | Recommended Technologies | Rationale |
|---|---|---|
| **Frontend Framework** | **Next.js (App Router) + React 19** | Server components for initial hydration; sub-route isolation for dashboard tabs. |
| **Component System** | **Tailwind CSS v4 + Radix UI (Shadcn)** | Headless, accessible primitives with fluid responsive drawer interactions. |
| **Data Fetching** | **TanStack Query (React Query v5)** | Client-side query caching, background polling (`refetchInterval`), and optimistic UI updates. |
| **Charts & Visualizations** | **Recharts or Tremor** | Performant SVG/Canvas rendering for funnels, timelines, and sparklines. |
| **Backend Services** | **NestJS or Node.js (TypeScript)** | Clean modular architecture separating Commerce, Billing, and Admin services. |
| **Database & Cache** | **PostgreSQL + Redis** | Relational integrity for double-entry ledgers; Redis for active user sessions and queue locks. |

---

## 4. Production Verification & Go-Live Checklist

Before deploying dashboard surfaces to production, verify the following gates:

- [ ] **Authoritative Timestamp Audit:** Verified that no revenue metrics filter on unverified payment attempts or checkout creation times.
- [ ] **Cash-on-Delivery Isolation:** Confirmed that unpaid COD orders never enter Paid Sales or Paid Orders.
- [ ] **Ledger Discrepancy Circuit Breaker:** Tested that a simulated ledger imbalance immediately turns the topbar Trust Chip red and blocks automated payouts.
- [ ] **SLA Urgency Display:** Verified that queue items crossing SLA thresholds transition from green to amber and red.
- [ ] **Zero Self-Demotion:** Tested that an administrator cannot demote or disable their own account.
- [ ] **Audit Trail Immutability:** Verified that no database user or API endpoint can issue `UPDATE` or `DELETE` on `audit_logs`.
- [ ] **Mobile Action-First Usability:** Verified on mobile screens that urgent order decision queues appear prominently at the top of the viewport.
