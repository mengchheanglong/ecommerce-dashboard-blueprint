# Merchant Overview Dashboard — Architecture & Specification

The **Merchant Overview Dashboard** is the daily operational cockpit for store owners. Unlike deep analytics reports, the overview is built for immediate action and real-time operational triage.

---

## Purpose & Core Questions Answered

1. **Is paid business happening today?** (Revenue momentum, distinct order counts, working capital).
2. **What urgent work needs my attention right now?** (Orders awaiting acceptance, fulfillment backlogs, low-stock warnings).

---

## Directory Contents

| Document | Description |
|---|---|
| **[`01_Overview_KPI_Contracts.md`](./01_Overview_KPI_Contracts.md)** | Production KPI decision contracts for the 9 core overview items (Paid Sales, Orders, Available Balance, Decision Queue, Fulfillment Backlog, Stock Alerts, AOV, Top Products, Readiness Checklist). |
| **[`02_Wireframe_and_Layout_Spec.md`](./02_Wireframe_and_Layout_Spec.md)** | Desktop and mobile layout wireframes, screen hierarchy, and responsive mobile reordering. |
| **[`03_Daily_Operations_Guide.md`](./03_Daily_Operations_Guide.md)** | Daily 5-minute operational triage routine for store owners to manage incoming customer orders and prevent revenue loss. |

---

## Screen Shape

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MERCHANT STORE OVERVIEW                         │
├────────────────────────────────────────────────────────────────────────┤
│  Band 1: Business Health (Headline Results & Working Capital)          │
│  [ Paid Sales: $4,850 ]  [ Paid Orders: 142 ]  [ Available Balance: $1,280 ]
│                                                                        │
│  Band 2: Immediate Operations (Urgent Action Queues)                   │
│  [ Orders Need Decision (3) ] [ Fulfillment (5) ] [ Stock Alerts (2) ] │
│                                                                        │
│  Band 3: Supporting Performance                                        │
│  [ Average Order Value: $34.15 ]      [ Top Products (Top 5 SKUs) ]    │
│                                                                        │
│  Band 4: Conditional Onboarding                                        │
│  [ Store Readiness Checklist (Visible only when setup is incomplete) ] │
└────────────────────────────────────────────────────────────────────────┘
```
