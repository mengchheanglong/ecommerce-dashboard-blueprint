# Merchant Analytics Dashboard — Deep Business Intelligence & Growth

The **Merchant Analytics Dashboard** is the deep business intelligence engine for store owners. While the [Merchant Overview Dashboard](../merchant-overview/) handles day-to-day operations and urgent tasks, the Analytics Dashboard focuses on **medium- to long-term performance trends, marketing conversion funnels, catalog merchandising, customer retention, and revenue leakage diagnostics.**

---

## Documentation Structure

| Document | Description |
|---|---|
| **[`01_Analytics_Question_Register.md`](./01_Analytics_Question_Register.md)** | Complete register of 60 business analytics questions across 9 commerce domains. |
| **[`02_Metric_Evaluation_and_Rankings.md`](./02_Metric_Evaluation_and_Rankings.md)** | Evaluation matrix detailing the **16 Ranked Core Analytics Measures** (Best/Worst sellers, COD recovery, Conversion funnels, Retention). |
| **[`03_Analytics_KPI_Specifications.md`](./03_Analytics_KPI_Specifications.md)** | Detailed calculation contracts for deep BI metrics (Paid vs. Total sales gap, COD collection rate, Funnel drop-offs, Customer loyalty buckets). |
| **[`04_Wireframe_and_Visual_Layout.md`](./04_Wireframe_and_Visual_Layout.md)** | Analytics page layout wireframes, chart configurations, and merchandising leaderboards. |
| **[`05_SQL_Calculation_Logic.md`](./05_SQL_Calculation_Logic.md)** | Production-ready SQL aggregation queries, event timestamp filtering, and timezone alignment. |

---

## Core Focus Areas

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      MERCHANT ANALYTICS DASHBOARD                      │
├────────────────────────────────────────────────────────────────────────┤
│  1. Revenue Velocity & Working Capital Gap                             │
│     - Paid Sales vs. Total Booked Sales                                │
│     - Cash on Delivery (COD) Collection & Return Rates                 │
│     - 30-Day Daily Sales Timeline                                      │
│                                                                        │
│  2. Storefront Funnel & Conversion                                     │
│     - Visits ──► Product Views ──► Carts ──► Checkout ──► Paid Orders  │
│     - Average Order Value (AOV) & Items per Order (UPT)                │
│                                                                        │
│  3. Merchandising Intelligence                                         │
│     - Ranked Best Sellers ↔ Slowest Movers (Dead Stock) toggle         │
│     - Revenue Contribution by Product Category                         │
│                                                                        │
│  4. Customer Retention & Leakage Diagnostics                           │
│     - New vs. Returning Customer Revenue Split                         │
│     - Purchase Frequency Buckets (1x, 2–3x, 4+)                        │
│     - Order Cancellations & Refunds Breakdown by Categorical Reason    │
└────────────────────────────────────────────────────────────────────────┘
```
