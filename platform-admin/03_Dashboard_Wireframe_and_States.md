# Platform Admin Dashboard — Wireframes, KPIs & States

This document specifies the screen wireframes, KPI contracts, and dynamic UI state models for the executive Platform Administration Dashboard.

---

## 1. Information Architecture & Wireframe Layout

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  PLATFORM ADMIN  │  Search stores, users, orders... (Ctrl+K)   │ [Admin User] [Role]   │
│  Chips: [🟢 System: 100%] [🟢 Ledger: Balanced] [🟢 Data: 2m ago] [🔔 Alerts: 0]        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  BAND 1: PLATFORM HEALTH (Headline Primary KPIs)                                       │
│  ┌───────────────────┬───────────────────┬───────────────────┬──────────────────────┐  │
│  │ Active Paid Stores│ Subscription MRR  │ Platform GMV      │ Payment Success Rate │  │
│  │ 1,248             │ $34,800 / mo      │ $412,650          │ 94.2%                │  │
│  │ ▲ +34 net (30d)   │ $31.2k collected  │ 18,420 orders     │ 3.1% fail │ 2.7% stl │  │
│  └───────────────────┴───────────────────┴───────────────────┴──────────────────────┘  │
│                                                                                        │
│  BAND 2: TENANT GROWTH & ACTIVATION FUNNEL                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Store Funnel: 124 Created ──────► 88 Activated (71%) ──────► 52 First Sale (42%)│  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  BAND 3: ACTION CENTER (SLA-Governed Work Queues)                                      │
│  ┌────────────────────────┬────────────────────────┬─────────────────────────────┐     │
│  │ Bank KYC Verification  │ Payouts Awaiting Action│ Support Cases               │     │
│  │ 14 Pending             │ 8 Requests ($12,450)   │ 19 Open Tickets             │     │
│  │ Oldest: 19h (1 Due Soon)│ Oldest: 38h (2 Due)   │ 3 Breached SLA              │     │
│  │ [Review Queue ──►]     │ [Authorize Payouts ──►]│ [Open Inbox ──►]            │     │
│  └────────────────────────┴────────────────────────┴─────────────────────────────┘     │
│                                                                                        │
│  BAND 4: CONDITIONAL ALERTS (Rendered dynamically when active)                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ ⚠️ 2 Tenant Onboarding Provisioning Jobs Failed. [Inspect DLQ Queue]             │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 15 Core KPI Contracts

### Band 1: Headline Health
1. **Active Paid Stores:** Total stores with active/grace subscription. Formula: Count of distinct stores with non-expired paid plan access. Delta: `(+ Activated - Expired)` over 30 days.
2. **Subscription MRR & Collections:** Contracted MRR run-rate paired with cash collected in period. Includes active monthly plans + annual plans prorated.
3. **Platform Paid Sales & Orders (GMV):** Ecosystem transaction value and distinct orders, segregated by currency. Authoritative timestamp: `orders.paid_at`.
4. **Payment Gateway Success Rate:** Ratio of `SUCCEEDED / (SUCCEEDED + FAILED)` checkout payment intents. Segregates stale intents $> 24h$.

### Band 2: Growth & Activation
5. **Store Activation Funnel:** Created ──► Activated ──► First Valid Paid Order. Measures time-to-value and onboarding conversion drop-offs.

### Band 3: Action Center Queues
6. **Bank Account Verification Queue:** Pending KYC bank account reviews. SLA: 24h. Sorted oldest submitted first.
7. **Payouts Awaiting Processing:** Pending merchant withdrawal executions. SLA: 48h. Gated to Super Admin role.
8. **Failed Payouts Queue:** Banking transfer rejections requiring manual review and retry.
9. **Plans Expiring Soon:** Merchant accounts inside renewal notice window (default: 7 days).
10. **Support Cases Awaiting Triage:** Open merchant tickets with response SLA timers (< 4h).
11. **Failed Onboarding Alert:** High-visibility conditional banner rendered when background provisioning jobs fail.

### Band 4: Trust & Governance Chips
12. **System Health:** Real-time API latency (< 200ms) and background worker dead-letter queue count.
13. **Wallet-Ledger Audit:** Automated verification that merchant wallet balances equal double-entry ledger accounts. Discrepancy halts payouts.
14. **Plan Entitlement Audit:** Daily automated scan ensuring store feature flags match current subscription tier.
15. **Data Freshness:** Real-time badge indicating analytics pipeline synchronization lag (< 15m).

---

## 3. Dynamic UI States

- **Healthy State (🟢):** All trust status chips show green checkmarks. Queue aging timers are within target thresholds. Conditional alert banner is hidden.
- **Busy State (🟡):** One or more SLA queues approach deadline limits (e.g., Bank review $> 18h$, Payouts $> 36h$). Warning badges turn amber.
- **Degraded / Incident State (🔴):** Gateway success rate drops $< 82\%$, worker dead-letter queue $> 0$, or ledger variance detected. Topbar chip pulses red, and conditional alert banner slides down across viewport.
