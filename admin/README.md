# Platform-Admin Dashboard — Stakeholder Summary

## Purpose

Help an authorized Angkoro platform administrator answer four simple things:

1. **Is the paid platform healthy and sustainable?**
2. **Are new stores becoming real businesses?**
3. **What work needs administrator attention now?**
4. **Can the administrator trust the money, entitlements, the system, and this dashboard?**

This page is the presentation view. The complete question register, decision reasoning, adopted operating rules, dashboard content, planned capability boundaries, and wireframe are linked below.

## Recommended dashboard — 15 items

### Platform health

| Indicator | The admin asks | Why it matters |
|---|---|---|
| **Active Paid Stores** | Is our paying base growing or shrinking? | Count plus **net change (+new − churned)** — the decomposition turns a vanity count into an acquisition-vs-retention decision |
| **Subscription MRR & Collections** | How much recurring revenue — and did the cash arrive? | MRR (commitment) and collections (cash) side by side, never merged; a widening gap means renewals are failing |
| **Platform Paid Sales & Orders** | How much real commerce flows through us? | Merchant-commerce value (GMV) with order volume — an input metric, read with retention in mind |
| **Payment Success Rate** | When people try to pay, does it work? | The platform's own responsibility metric — a sudden drop is a platform-wide emergency |

### Growth

| Indicator | The admin asks | Why it matters |
|---|---|---|
| **Store Activation Funnel** | Are new stores becoming real businesses? | Created → activated → first paid order; shows *where* new stores get stuck |

### Immediate operations

All queues show count, **oldest-item age, and due-soon count** against adopted service targets, sorted closest-to-breach first, and close items only by explicit recorded disposition.

| Indicator | The admin asks | Why it matters |
|---|---|---|
| **Payouts Awaiting Processing** | Whose money are we holding, and for how long? | Seller-money obligations against a 2-business-day target |
| **Failed Payouts** | Which payouts broke, and can we recover? | Recovery with 24-hour triage; repeat failures reveal systemic issues |
| **Bank Accounts Awaiting Verification** | Who is waiting on us before they can get paid? | Verification gates money movement; 1-business-day target |
| **Renewals in Grace** | Which paying stores are about to slip away? | Recoverable renewal risk sorted by next expiry; Grace is not churn |
| **Failed Onboarding** | Did someone's store setup break? | Conditional alert only while a failure exists |

### Trust and control

Rendered as compact status chips with last-checked timestamps and an explicit all-clear state.

| Indicator | The admin asks | Why it matters |
|---|---|---|
| **Wallet–Ledger Reconciliation** | Does every wallet match its ledger? | Money-integrity mismatch stops payouts first, reconciles second |
| **Plan Entitlement Integrity** | Is anyone getting features they didn't pay for? | Detects entitlement drift in both directions |
| **Dashboard Data Trust** | Can I trust the numbers on this screen? | Freshness qualifies every other card; shown beside the page heading |
| **System Status** | Is the platform itself running properly? | API errors, failed jobs, failed webhooks — v1 signals; missing facets show Not connected |
| **Source & Financial Reconciliation** | Does an independent check agree with this dashboard? | A served aggregate cannot certify itself |

## One-screen shape

```text
[ Active Paid Stores ] [ MRR & Collections ] [ Paid Sales & Orders ] [ Payment Success ]

[ Store activation funnel: created -> activated -> first paid order ]

[ Payouts Waiting ] [ Failed Payouts ] [ Bank Verification ] [ Renewals in Grace ]
[ Failed Onboarding — only when a failure exists ]

[ Wallet–Ledger ] [ Entitlement ] [ Data Trust ] [ System Status ] [ Reconciliation ]
```

These are not equal cards. Health governs, the funnel explains future health, queues lead to work, and control chips stay compact until something is wrong.

## Adopted v1 decisions

- **Reporting timezone:** `Asia/Phnom_Penh`
- **Currency:** v1 displays USD; KHR handling awaits the approved currency policy; currencies are never combined
- **Operating rules (20 July 2026):** seven project-lead rule adoptions — operational MRR, churn event, payment-attempt denominator, payout SLA, verification SLA, grace handling, and queue disposition — are recorded in [02_Evaluation.md](./02_Evaluation.md) and convert previously blocked questions into buildable items
- **Missing data:** display `Unknown` or `Not connected`, never zero or healthy
- **Security:** attack, WAF, anomaly, and incident monitoring remain planned until authoritative telemetry and workflows exist
- **Privacy:** minimize user, session, bank, payment, and audit evidence and enforce least privilege
- **Seller autonomy:** ordinary seller order decisions remain seller-owned

## Delivery reality

The current frontend does not implement this dashboard; governed aggregates, the reconciliation job, and the overview UI are build work. The newly adopted items add: an MRR aggregate, a terminal-outcome payment-attempt aggregate, activation funnel counts, SLA age fields on queues, and the three v1 System Status signals (Sentry error rate, failed-job count, failed-webhook count — callback records already exist). The existing safe bank-verification queue is reusable after oldest-first server sorting; payouts still need a platform-wide queue. AD-R07 cannot display a passing state until the independent reconciliation job exists and completes.

No production values were calculated for this document.

## Documentation map

- [01 — Question register](./01_Questions.md) — all 67 stable IDs and full questions only; no evaluation reasoning
- [02 — Evaluation and decision record](./02_Evaluation.md) — verdict tables for all 67 questions plus the seven adopted operating rules
- [03 — Dashboard content](./03_Dashboard_Content.md) — the 15 approved items with decision, cadence, and healthy/danger signals
- [04 — Dashboard grouping and wireframe](./04_Dashboard_Grouping_and_Wireframe.md) — grouping with reasoning, one overview wireframe, and display-form choices
- [Shared source audit](../00_Source_Audit_and_Decisions.md) — verified product evidence, external research, and implementation boundaries

The evaluation page is self-contained. A reader does not need to switch to the question inventory to understand any decision.
