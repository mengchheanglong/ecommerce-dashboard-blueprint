# Merchant Analytics Dashboard — Architecture & Documentation

This directory contains the complete product specification, metric governance, wireframe architecture, and SQL calculation logic for the **Merchant / Store Owner Analytics Dashboard**.

---

## Documentation Structure

| Document | Purpose |
|---|---|
| **[`01_Metrics_Questions.md`](./01_Metrics_Questions.md)** | Complete register of 60 merchant decision questions across 9 commerce categories. |
| **[`02_Metric_Evaluation_Matrix.md`](./02_Metric_Evaluation_Matrix.md)** | Evaluation matrix rating all 60 questions across merchant priorities, data readiness, and dashboard placement. |
| **[`03_Dashboard_KPI_Contracts.md`](./03_Dashboard_KPI_Contracts.md)** | Production KPI decision contracts for the 9 core merchant dashboard items (Paid Sales, Orders, Balance, Queues, AOV, Top Products, Readiness). |
| **[`04_Wireframe_and_Layout_Spec.md`](./04_Wireframe_and_Layout_Spec.md)** | Desktop/mobile layout wireframes, screen hierarchy, work queue preview drawers, and responsive behaviors. |
| **[`05_Calculation_Logic_and_Formulas.md`](./05_Calculation_Logic_and_Formulas.md)** | Backend SQL queries, database schema filters, authoritative timestamps, and timezone truncation logic. |
| **[`06_Seller_Decision_Guide.md`](./06_Seller_Decision_Guide.md)** | Everyday practical decision guide explaining how merchants interpret figures and take operational action. |

---

## Core Dashboard Shape

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

---

## Key Design Principles

1. **Urgent Work Over Passive Numbers:** When orders need immediate decision, action items take priority over passive charts.
2. **Authoritative Timestamping:** Revenue measures filter strictly on `orders.paid_at`, never uncaptured checkout attempts.
3. **Decoupled Working Capital:** Available Balance is a point-in-time wallet snapshot that never changes with date filters.
4. **Preventing Preventable Losses:** Prominent alerts for near-deadline orders and inventory stockouts protect merchant revenue.
