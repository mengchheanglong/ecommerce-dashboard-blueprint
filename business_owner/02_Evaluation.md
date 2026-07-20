# 2. Business-Owner Question Evaluation

**In one line:** We evaluated all 60 business-owner questions. **9 became dashboard items.** Every other question stays documented here with a plain reason, so nothing is lost and nothing crowds the dashboard.

This page is the **authoritative decision record**. If this page and any other page disagree, this page wins.

---

## How to read the verdicts

| Verdict | Meaning | Old label |
|---|---|---|
| ✅ **Dashboard** | On the current dashboard | Selected |
| ➡️ **Inside another item** | Already answered inside an approved item (as a comparison, sort rule, or checklist line) | Combined |
| 📄 **Report / drill-down** | Useful in a report or investigation — not on the overview | Supporting |
| 🔗 **Finance page** | Belongs on the authorized Finance page | Separate surface |
| 🕓 **Later** | Revisit when the missing rule, data, or history exists | Planned |
| ✖️ **Excluded** | Deliberately excluded | Not selected |

**Priority:** High · Medium · Low · Future  **Data:** Current · Partial · Needs rule · Gap

---

## The result — 9 dashboard items

| Group | Item | ID | Type |
|---|---|---|---|
| Business health | **Paid Sales** | BO-S01 | Primary KPI |
| Business health | **Paid Orders** | BO-S02 | Primary KPI |
| Business health | **Available Balance** | BO-M01 | Current finance snapshot |
| Needs attention | **Orders Need Decision** | BO-O01 | Action queue |
| Needs attention | **Fulfillment Backlog** | BO-F01 | Action queue |
| Needs attention | **Inventory Attention** | BO-I05 | Action queue |
| Supporting detail | **Average Paid Order Value** | BO-S04 | Supporting metric |
| Supporting detail | **Top Products** | BO-I01 | Breakdown |
| Conditional | **Store Readiness** | BO-R01–R06 | Conditional status |

Available Balance is a **current snapshot** beside the KPIs — it never gets a period filter, trend, or percent change. The full money lifecycle (pending, escrow, reserved, paid out) stays on the authorized Finance page.

---

## A. Sales and paid demand

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-S01 | What was valid Paid Sales in the selected period, by currency? | ✅ **Paid Sales** | High | Current | Shows whether customers generated real paid business — valid paid events, not merely created orders. |
| BO-S02 | How many distinct Paid Orders were recorded? | ✅ **Paid Orders** | High | Current | Shows how much order volume produced the sales; value and count together beat an average alone. |
| BO-S03 | How did Paid Sales and Paid Orders change from the matched previous period? | ➡️ Inside Paid Sales & Paid Orders | High | Current | The comparison lives inside both KPI cards, not as a separate widget. |
| BO-S04 | What was Average Paid Order Value? | ✅ **Avg Paid Order Value** | Medium | Current | Explains whether sales moved because orders got larger or smaller; sits below the headline cards, never as one. |
| BO-S05 | How did paid business split between COD and online payment? | 📄 Report / drill-down | Medium | Current | Payment-mix is report material; it creates no immediate seller action. |
| BO-S06 | Which day produced the highest valid Paid Sales? | 📄 Report / drill-down | Low | Current | Interesting pattern, rarely a first-screen action. |
| BO-S07 | How much paid value was later refunded or reversed? | ✖️ Excluded | Low | Partial | Removed at stakeholder request; kept only for reconciliation work. |
| BO-S08 | How much profit or margin did the store make? | 🕓 Later | Future | Gap | No cost data exists yet, so profit cannot be defended. |

## B. Orders and seller decisions

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-O01 | Which orders need the seller to accept or reject now? | ✅ **Orders Need Decision** | High | Current | Missed decisions auto-cancel orders; this queue prevents avoidable loss. |
| BO-O02 | Which waiting order reaches its decision deadline first? | ➡️ Inside Orders Need Decision | High | Current | The earliest deadline is the queue's sort rule. |
| BO-O03 | How many orders were auto-cancelled because the seller missed the decision deadline? | 📄 Report / drill-down | Medium | Partial | Useful history of preventable loss, but needs a durable machine-readable reason code first. |
| BO-O04 | How were rejected orders distributed by reason? | 📄 Report / drill-down | Medium | Current | Rejection reasons help listing and policy review. |
| BO-O05 | How many orders were cancelled by the customer, seller, or system? | 📄 Report / drill-down | Medium | Partial | Actor fields exist, but system reasons need stronger coding. |
| BO-O06 | How many orders expired before payment succeeded? | 📄 Report / drill-down | Medium | Current | Signals payment or buyer-completion loss — investigation material. |
| BO-O07 | How many current orders are in each lifecycle status? | 📄 Report / drill-down | Low | Current | A navigation aid; raw statuses are not business outcomes. |
| BO-O08 | How many COD orders were placed, accepted, and cash-collected? | 📄 Report / drill-down | Medium | Current | COD stage context is useful but not a top daily decision. |

## C. Fulfillment and completion

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-F01 | Which accepted prepaid orders still need fulfillment? | ✅ **Fulfillment Backlog** | High | Current | Accepted prepaid orders are paid customer commitments still unfinished; separate from decision work. |
| BO-F02 | Which fulfillment item has waited the longest? | ➡️ Inside Fulfillment Backlog | High | Current | Oldest-first is the queue's sort rule. |
| BO-F03 | How long does fulfillment normally take after acceptance? | 📄 Report / drill-down | Medium | Current | Timestamps can describe operating speed — report material. |
| BO-F04 | How many orders are overdue or fulfilled on time? | 🕓 Later | Future | Needs rule | "Overdue" needs a fulfillment target that Angkoro has not adopted. |
| BO-F05 | How many orders reached completed status? | 📄 Report / drill-down | Low | Current | Throughput context, not usually the next decision. |

## D. Products and inventory

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-I01 | Which product sold the most valid paid units? | ✅ **Top Products** | Medium | Current | Ranked paid units support stock and promotion decisions without becoming another headline KPI. |
| BO-I02 | Which product produced the most valid Paid Sales? | 📄 Report / drill-down | Medium | Current | Product value contribution explains Paid Sales — report material. |
| BO-I03 | Which category produced the most valid Paid Sales? | 🕓 Later | Future | Partial | Historical category snapshots are not reliably preserved. |
| BO-I04 | Which active products recorded no paid units? | 📄 Report / drill-down | Low | Current | Zero-sale lists need context (new, seasonal, intentionally quiet items); belongs in Analytics with qualification rules, not on the overview. |
| BO-I05 | Which tracked products or variants need inventory attention because they are out of stock or low stock? | ✅ **Inventory Attention** | High | Current | Both states lead to the same action — restock or change availability — with immediate shortages shown first. |
| BO-I06 | Which open-order reservations reduce each item's available units? | 📄 Report / drill-down | Medium | Current | Reservation pressure explains availability — drill-down material. |
| BO-I07 | Which best-selling item is also at inventory risk? | 📄 Report / drill-down | Medium | Current | Useful cross of demand and inventory risk for a report. |
| BO-I08 | How many days remain before an item runs out? | 🕓 Later | Future | Gap | Needs inventory history, a demand window, and replenishment assumptions. |
| BO-I09 | How much paid value may have been lost during stockouts? | 🕓 Later | Future | Gap | Needs stockout intervals and suppressed-demand evidence. |

## E. Customers

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-C01 | How many identifiable customers placed a valid paid order? | 📄 Report / drill-down | Medium | Current | Only meaningful with explicit identifiable-customer coverage shown beside it. |
| BO-C02 | What percentage of identifiable paid customers purchased again? | 📄 Report / drill-down | Medium | Partial | Repeat rate is limited by guest checkout and changing identity. |
| BO-C03 | How many identifiable paid customers were new versus returning? | 📄 Report / drill-down | Medium | Partial | New/returning classification depends on stable history. |
| BO-C04 | Which city or province produced the most paid orders? | 📄 Report / drill-down | Low | Current | Local delivery and promotion context, not primary health. |
| BO-C05 | What percentage of Paid Orders can be linked to a known customer? | 📄 Report / drill-down | Medium | Current | The denominator warning every customer metric needs first. |
| BO-C06 | Which identifiable customer produced the highest valid paid value? | 📄 Report / drill-down | Low | Partial | Needs privacy-safe use and stable identity. |
| BO-C07 | What is customer lifetime value? | 🕓 Later | Future | Gap | Stable identity and sufficient history are not yet reliable. |

## F. Checkout and product payments

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-P01 | What percentage of complete online product-payment attempts succeeded? | 🕓 Later | Future | Partial | The attempt denominator needs a coverage audit first. |
| BO-P02 | How many online product-payment attempts failed? | 📄 Report / drill-down | Medium | Partial | Failed-payment rows help troubleshooting but may be incomplete. |
| BO-P03 | Which failure reason, provider, or method performs worst? | 📄 Report / drill-down | Medium | Partial | Provider comparison needs comparable attempt coverage. |
| BO-P04 | How long does a successful product payment normally take? | 📄 Report / drill-down | Low | Current | Payment timestamps can describe completion time. |
| BO-P05 | At which tracked checkout step were carts abandoned? | 🕓 Later | Future | Gap | No cart or checkout-step event stream exists. |
| BO-P06 | What percentage of storefront visits became valid Paid Orders? | 🕓 Later | Future | Gap | No trustworthy storefront-visit denominator exists. |

## G. Finance and payouts

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-M01 | How much store money is currently available for payout? | ✅ **Available Balance** | Medium | Current | The owner's immediate cash question — a "right now" snapshot, never a period performance metric. |
| BO-M02 | How much store money is pending settlement or held in escrow? | 🔗 Finance page | Medium | Current | Explains why online sales are not withdrawable yet — Finance page detail. |
| BO-M03 | How much money is reserved for payout requests in progress? | 📄 Report / drill-down | Medium | Current | Prevents confusing reserved with available money — Finance detail. |
| BO-M04 | Which payout requests failed, and why? | 📄 Report / drill-down | Medium | Current | Payout recovery work belongs in Finance. |
| BO-M05 | How much money was successfully paid out? | 📄 Report / drill-down | Low | Current | Payout history, not daily commerce command. |
| BO-M06 | How much seller money was reversed through refunds or settlement corrections? | 📄 Report / drill-down | Low | Current | Reconciliation information, not a general KPI. |

## H. Store readiness

All six checks combine into one conditional item: **Store Readiness**. Each check appears **only while it is failing**.

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-R01 | Is the store active and allowed to operate? | ➡️ Inside Store Readiness | Medium | Current | The operating-permission check. |
| BO-R02 | Does the storefront have at least one active sellable product? | ➡️ Inside Store Readiness | Medium | Current | The sellable-product check. |
| BO-R03 | Can customers use at least one configured checkout method? | ➡️ Inside Store Readiness | Medium | Current | The checkout-method check. |
| BO-R04 | Is the payout bank account verified? | ➡️ Inside Store Readiness | Medium | Current | The payout-readiness check — sensitive bank details never appear on the dashboard. |
| BO-R05 | Are Telegram and order notifications connected and enabled? | ➡️ Inside Store Readiness | Medium | Current | The notification check — a disconnected seller can miss decision deadlines. |
| BO-R06 | Are required contact and fulfillment settings complete? | ➡️ Inside Store Readiness | Medium | Current | The settings-completeness check. |

## I. Future and advanced analytics

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| BO-A01 | Which traffic source produces the most valid paid business? | 🕓 Later | Future | Gap | Traffic-source attribution is not recorded. |
| BO-A02 | Which campaign produces more value than it costs? | 🕓 Later | Future | Gap | Campaign cost and attribution are missing. |
| BO-A03 | Which products are often purchased together? | 🕓 Later | Future | Current | Order items could support this today, but it ranks below the selected health and action questions. |
| BO-A04 | What demand should the seller expect next? | 🕓 Later | Future | Gap | Forecasting needs reliable history, lead time, and evaluation. |
| BO-A05 | Which unusual business change needs investigation? | 🕓 Later | Future | Partial | Needs approved baselines and enough history; a signal is not a cause. |

---

## Count check

- **60 questions** — every ID appears exactly once above.
- **8 selected** (✅) **+ 6 readiness checks combined into one item** (➡️ BO-R01–R06) = **9 dashboard items**.
- Everything else: 3 comparisons/sort rules folded into approved items, 27 report/drill-down, 1 Finance page, 14 later, 1 excluded.

For what each approved item means and how to read it safely, see [03_Dashboard_Content.md](03_Dashboard_Content.md).
