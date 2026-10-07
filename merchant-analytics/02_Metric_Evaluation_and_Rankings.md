# Merchant Analytics Metric Evaluation & Priority Rankings

This document evaluates the deep business analytics metrics for store owners, organizing them by decision priority, analytical value, and dashboard placement.

---

## 1. The 16 Ranked Core Analytics Measures

When analyzing store performance over time (30 days, 90 days, year-to-date), metrics are ranked by operational and commercial value:

| Rank | Metric & Category | Seller Question | Priority | Recommended Visualization | Analytical Rationale |
|---|---|---|---|---|---|
| **1** | **Paid Sales / Total Booked Sales** | *"How much money have I actually received, and how much is still pending?"* | High | Hero Card with % delta and sparkline; Total Sales as supporting line beneath. | The single number every seller opens analytics for. Paid leads because it represents spendable cash; Total sits beneath so pending money is visible. |
| **2** | **Paid Orders / Total Placed Orders** | *"How many orders am I paid for, and how many are in-flight?"* | High | Primary Card with 3 status filter pills (New / Processing / Completed). | Actionable order volume breakdown. Distinguishes order volume trends from order processing backlogs. |
| **3** | **COD Collected vs. COD Total** | *"How much of my revenue is tied up in Cash on Delivery?"* | High | Stacked comparison bar: Paid COD large, Total COD beneath, outstanding amount highlighted. | Shows merchant exposure to cash-flow risk from in-flight shipments with delivery carriers. |
| **4** | **COD Collection Success Rate** | *"What percentage of COD orders actually get paid?"* | High | Donut / progress percentage: Collected vs. Refused vs. In-Transit. | Diagnostic metric pointing to customer address verification, courier performance, and package refusal rates. |
| **5** | **Pending Payout & Working Capital** | *"How much money is owed to me and when do I receive it?"* | High | Financial Card with next scheduled payout date and escrow breakdown. | Solves cash-flow anxiety and provides financial predictability. |
| **6** | **Top & Worst Selling Products** | *"What sells best, and what is dead stock?"* | High | Ranked Table (Top 5) with toggle between **Best Sellers** and **Slowest Movers**. | Drives restocking and inventory liquidation. Slowest-sellers toggle prevents dead stock accumulation. |
| **7** | **Inventory Low Stock Alerts** | *"What products am I about to run out of?"* | High | Ranked table at top of Catalog section with units remaining (1–5 units). | Protects revenue by alerting merchant before stockouts halt order velocity. |
| **8** | **Cancellations & Refunds by Reason** | *"Why am I losing orders? Is it preventable?"* | High | Horizontal bar breakdown with categorical reasons (e.g. Out of Stock, Customer Changed Mind, Delivery Refusal). | Identifies fixable merchant issues such as delayed acceptance or inaccurate product descriptions. |
| **9** | **Order Timeline by Day** | *"Which days of the week produce the most orders?"* | Medium | Daily bar chart (30-day view) highlighting peak days. | Informs marketing promotion timing, social posting schedules, and warehouse staffing. |
| **10** | **Average Order Value (AOV) & Items per Order** | *"Are customers buying larger baskets?"* | Medium | Paired stat tiles with trend comparison arrows. | Demonstrates upselling, product bundling, and cross-sell effectiveness. |
| **11** | **New vs. Returning Customers** | *"Are buyers coming back to purchase again?"* | Medium | Dual-color stacked bar with percentage split. | Primary indicator of store quality, customer satisfaction, and product-market fit. |
| **12** | **Storefront Visits & Traffic** | *"How many people visited my store?"* | Medium | Funnel top bar paired with distinct sessions. | Separates a traffic acquisition bottleneck from a checkout conversion problem. |
| **13** | **Store Visit → Paid Order Conversion** | *"What percentage of visitors actually buy?"* | Medium | Multi-step funnel visualization with drop-off percentages. | The core efficiency metric of the storefront and checkout experience. |
| **14** | **Category Sales Performance** | *"Which product categories generate the most revenue?"* | Low | Ranked horizontal bar chart. | Merchandising analysis for multi-category stores. |
| **15** | **Customer Purchase Frequency** | *"How often does each customer purchase?"* | Low | Histogram bucket bars: `1x`, `2–3x`, `4+ purchases`. | Customer loyalty distribution; informs VIP retention campaigns. |
| **16** | **Active Products Listed** | *"How many products do I have published?"* | Low | Supporting count badge beside catalog health. | Operational context for catalog scale. |

---

## 2. Analytical Segmentation Rules

1. **Avoid Incomprehensible Scatterplots:** Store owners interpret bucketed histograms (`1x`, `2–3x`, `4+`) far better than raw statistical scatter plots.
2. **Gross vs. Net Separation:** Never subtract returns from historical sales graphs. Refunds are displayed in a dedicated returns section.
3. **Multi-Currency Clarity:** Stores supporting multiple checkout currencies display separate metrics per currency.
