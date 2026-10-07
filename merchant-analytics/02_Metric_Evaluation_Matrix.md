# Merchant Analytics Metric Evaluation Matrix

This document records the evaluation of all **60 merchant decision questions**, determining which measures earn placement on the primary Store Overview dashboard versus secondary reports or future roadmap additions.

---

## 1. Operating Rules for Merchant Analytics

| # | Rule Name | Adopted Specification | Unblocks |
|---|---|---|---|
| **M1** | **Authoritative Paid Sales** | Only orders satisfying `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')` with a non-null `paid_at` enter Paid Sales. Uncollected COD orders and expired checkouts are strictly excluded. | BO-S01, BO-S02 |
| **M2** | **Reporting Timezone Alignment** | All date-range filters group events according to the store's configured local timezone rather than server UTC to match merchant banking days. | All period metrics |
| **M3** | **Preceding Period Comparison** | Period deltas ($\Delta\%$) calculate against an equal-length immediately preceding window (e.g. today vs. yesterday; last 30 days vs. prior 30 days). | BO-S03 |
| **M4** | **Available Balance Snapshot** | Available balance is a real-time ledger snapshot of withdrawable cash right now—it does not vary by date filter and does not display historical percentage deltas. | BO-M01 |
| **M5** | **Decision Urgency Sorting** | The "Orders Needing Decision" work queue sorts strictly by **nearest auto-cancellation deadline first**, alerting merchants before orders lapse. | BO-O01, BO-O02 |
| **M6** | **Tracked Inventory Boundary** | "Out of Stock" (0 units) and "Low Stock" (1–5 units) alerts evaluate strictly on tracked inventory SKUs; untracked products are excluded from alerts. | BO-I05 |

---

## 2. The Core 9 Dashboard Items

Out of 60 evaluated questions, **9 items were approved for the primary Merchant Overview**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. BUSINESS HEALTH (Headline Results)                                  │
│  [ Paid Sales: $4,850 ]  [ Paid Orders: 142 ]  [ Available Balance: $1,280 ]
├────────────────────────────────────────────────────────────────────────┤
│ 2. IMMEDIATE OPERATIONS (Action Queues)                                │
│  [ Orders Need Decision (3) ] [ Fulfillment (5) ] [ Stock Alerts (2) ] │
├────────────────────────────────────────────────────────────────────────┤
│ 3. SUPPORTING PERFORMANCE                                              │
│  [ Average Order Value: $34.15 ]      [ Top Products (Top 5 SKUs) ]    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. CONDITIONAL ONBOARDING                                              │
│  [ Store Readiness Checklist (Visible only when setup is incomplete) ] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive Evaluation Matrix

### Category A: Sales & Paid Demand

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-S01** | Valid Paid Sales | ✅ Dashboard Core | High | Hero Card 1 | Primary measure of cash-collected business. Headline metric. |
| **BO-S02** | Distinct Paid Orders | ✅ Dashboard Core | High | Hero Card 2 | Explains whether revenue movement is driven by order volume. |
| **BO-S03** | Period vs Period delta | ➡️ Component | High | Cards 1 & 2 | Rendered as percentage badges (`▲ +12%`) on headline cards. |
| **BO-S04** | Average Order Value (AOV) | ✅ Dashboard Core | Medium | Supporting Row | Contextual indicator explaining basket size dynamics. |
| **BO-S05** | COD vs Digital payment split | 📄 Report | Medium | Orders Report | Diagnostic breakdown in the detailed Orders tab. |
| **BO-S06** | Peak sales day | 📄 Report | Low | Sales Report | Charted in the 30-day sales timeline report. |
| **BO-S07** | Refunded value | 📄 Report | Medium | Financial Report | Tracked in the returns and reconciliation ledger. |
| **BO-S08** | Estimated gross profit | 🕓 Later | Medium | Roadmap | Requires cost-of-goods-sold (COGS) tracking. |

---

### Category B: Orders & Merchant Decisions

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-O01** | Orders needing accept/reject | ✅ Action Queue | High | Action Row 1 | Urgent to-do list; prevents auto-cancellations. |
| **BO-O02** | Waiting order nearest deadline | ➡️ Component | High | Queue 1 Badge | Drives sort order and amber/red badge urgency. |
| **BO-O03** | Auto-cancelled orders | 📄 Report | High | Orders Report | Diagnostic metric tracking preventable revenue loss. |
| **BO-O04** | Rejection reasons breakdown | 📄 Report | Low | Orders Report | Merchandising feedback in detailed order logs. |
| **BO-O05** | Order cancellations by initiator | 📄 Report | Medium | Orders Report | Root-cause analysis report. |
| **BO-O06** | Expired checkout sessions | 📄 Report | Low | Analytics Report | Top-of-funnel checkout conversion drop-off. |
| **BO-O07** | Orders in each lifecycle state | 📄 Report | Medium | Orders Filter Bar | Tabs in the main Orders management table. |
| **BO-O08** | COD acceptance vs cash collection | 📄 Report | High | Orders Report | Delivery carrier performance metric. |

---

### Category C: Fulfillment & Order Completion

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-F01** | Accepted orders awaiting shipping | ✅ Action Queue | High | Action Row 2 | Core fulfillment queue; keeps customer goods moving. |
| **BO-F02** | Fulfillment item waiting longest | ➡️ Component | High | Queue 2 Badge | Flags oldest unfulfilled order in the queue. |
| **BO-F03** | Average fulfillment turnaround time | 📄 Report | Medium | Fulfillment Tab | Operational efficiency benchmark. |
| **BO-F04** | On-time delivery SLA compliance | 📄 Report | Medium | Fulfillment Tab | Carrier reliability report. |
| **BO-F05** | Orders reached completed status | 📄 Report | Low | Orders Filter | Terminal status filter in Orders table. |

---

### Category D: Products & Inventory Attention

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-I01** | Top products by paid units | ✅ Dashboard Core | High | Supporting Row | Drives restocking and inventory planning. Ranked top 5 table. |
| **BO-I02** | Top products by gross revenue | 📄 Report | High | Products Report | Secondary toggle on the Top Products table. |
| **BO-I03** | Top categories by revenue | 📄 Report | Medium | Products Report | Merchandising breakdown report. |
| **BO-I04** | Active products with zero sales | 📄 Report | Low | Products Report | Dead stock candidate list in Catalog tab. |
| **BO-I05** | Products low stock or out of stock | ✅ Action Queue | High | Action Row 3 | Critical stockout warning; prevents lost sales. |
| **BO-I06** | Reserved stock held by orders | 📄 Report | Medium | Inventory Tab | Displayed in SKU inventory detail modal. |
| **BO-I07** | Best-selling item at stockout risk | 🔔 Alert | High | Queue 3 Highlight | High-priority callout in Inventory Attention. |
| **BO-I08** | Days of inventory remaining | 🕓 Later | Medium | Roadmap | Requires replenishment velocity modeling. |
| **BO-I09** | Estimated stockout lost sales | 🕓 Later | Low | Roadmap | Advanced predictive analytics. |

---

### Category E: Customers & Retention

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-C01** | Identifiable paying customers | 📄 Report | Medium | Customers Tab | Customer count in Audience view. |
| **BO-C02** | Repeat customer percentage | 📄 Report | High | Customers Tab | Store loyalty KPI in Customer Analytics. |
| **BO-C03** | New vs. returning customer split | 📄 Report | Medium | Customers Tab | Acquisition vs retention balance chart. |
| **BO-C04** | Top geographic sales regions | 📄 Report | Low | Customers Tab | Regional demand heat map. |
| **BO-C05** | Guest vs registered checkout share | 📄 Report | Low | Settings Tab | Checkout configuration metric. |
| **BO-C06** | Top customers by spend | 📄 Report | Medium | Customers Tab | VIP customer roster. |
| **BO-C07** | Customer Lifetime Value (CLV) | 🕓 Later | Medium | Roadmap | Requires multi-month cohort tracking. |

---

### Category F: Checkout & Payment Conversion

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-P01** | Online payment success rate | 📄 Report | Medium | Payment Settings | Gateway conversion health check. |
| **BO-P02** | Failed customer payments count | 📄 Report | Medium | Payment Settings | Troubleshooting log for customer support. |
| **BO-P03** | Payment failure reason breakdown | 📄 Report | Low | Payment Settings | Diagnostic drawer. |
| **BO-P04** | Average payment capture latency | 📄 Report | Low | Settings Tab | Gateway performance metric. |
| **BO-P05** | Checkout drop-off step | 🕓 Later | High | Roadmap | Requires client-side funnel tracking instrumentation. |
| **BO-P06** | Storefront visit-to-order conversion | 🕓 Later | High | Roadmap | Requires privacy-safe session tracking. |

---

### Category G: Finances, Balance & Payouts

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-M01** | Available withdrawable balance | ✅ Dashboard Core | High | Hero Card 3 | Real-time working capital snapshot. |
| **BO-M02** | Escrow / pending settlement balance | 📄 Report | High | Payouts Tab | Forward liquidity pipeline. |
| **BO-M03** | In-flight withdrawal requests | 📄 Report | Medium | Payouts Tab | Status tracker for pending payouts. |
| **BO-M04** | Failed payout alerts | 🔔 Alert | High | Payouts Tab | Banner notification prompting bank detail review. |
| **BO-M05** | Cumulative payouts disbursed | 📄 Report | Low | Payouts Tab | Lifetime earnings summary. |
| **BO-M06** | Chargeback & refund deductions | 📄 Report | Medium | Financial Ledger | Deductions breakdown in Payouts tab. |

---

### Category H: Store Readiness & Setup Verification

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-R01** | Store published & open | ✅ Checklist | High | Readiness Card | Step 1 in onboarding checklist. |
| **BO-R02** | Active sellable product exists | ✅ Checklist | High | Readiness Card | Step 2 in onboarding checklist. |
| **BO-R03** | Payment gateway connected | ✅ Checklist | High | Readiness Card | Step 3 in onboarding checklist. |
| **BO-R04** | Payout bank account verified | ✅ Checklist | High | Readiness Card | Step 4 in onboarding checklist. |
| **BO-R05** | Order notification alerts enabled | ✅ Checklist | High | Readiness Card | Step 5 in onboarding checklist. |
| **BO-R06** | Shipping rates configured | ✅ Checklist | Medium | Readiness Card | Step 6 in onboarding checklist. |

*(Note: The Store Readiness checklist hides automatically once all 6 verification criteria are met).*

---

### Category I: Advanced & Predictive Analytics

| ID | Question | Verdict | Priority | Placement | Rationale |
|---|---|---|---|---|---|
| **BO-A01** | Marketing attribution by channel | 🕓 Later | High | Roadmap | Requires UTM and referrer capture pipelines. |
| **BO-A02** | Campaign Return on Ad Spend (ROAS) | 🕓 Later | Medium | Roadmap | Requires ad network API integrations. |
| **BO-A03** | Products frequently bought together | 🕓 Later | High | Roadmap | Recommendation engine module. |
| **BO-A04** | Predictive demand forecast | 🕓 Later | Medium | Roadmap | Machine learning forecasting pipeline. |
| **BO-A05** | Automated anomaly alerts | 🕓 Later | Medium | Roadmap | Statistical anomaly detection worker. |
