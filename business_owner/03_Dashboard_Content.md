# 3. Business-Owner Dashboard Content

**In one line:** the nine things on the dashboard, what each one means, and how to read each one safely.

Every item answers one question from [02_Evaluation.md](02_Evaluation.md). Layout and display choices live in [04_Dashboard_Grouping_and_Wireframe.md](04_Dashboard_Grouping_and_Wireframe.md).

---

## Content types

| Type | Simple meaning |
|---|---|
| Primary KPI | Main business result for the selected period |
| Current finance snapshot | Money available right now — not a period metric |
| Action queue | Work that needs attention, sorted by urgency |
| Supporting metric | Helps explain a main result |
| Breakdown | Ranks or divides a result |
| Conditional status | Appears only when something needs attention |

## The dashboard at a glance

| # | Item | ID | Type | The owner asks… |
|---|---|---|---|---|
| 1 | **Paid Sales** | BO-S01 | Primary KPI | *"How much did I actually make this period?"* |
| 2 | **Paid Orders** | BO-S02 | Primary KPI | *"How many orders did I get paid for?"* |
| 3 | **Available Balance** | BO-M01 | Current finance snapshot | *"How much can I withdraw right now?"* |
| 4 | **Orders Need Decision** | BO-O01 | Action queue | *"Which orders must I answer before they auto-cancel?"* |
| 5 | **Fulfillment Backlog** | BO-F01 | Action queue | *"Which paid orders do I still need to ship?"* |
| 6 | **Inventory Attention** | BO-I05 | Action queue | *"What's out of stock or running low?"* |
| 7 | **Avg Paid Order Value** | BO-S04 | Supporting metric | *"Are customers spending more or less per order?"* |
| 8 | **Top Products** | BO-I01 | Breakdown | *"What's my best seller?"* |
| 9 | **Store Readiness** | BO-R01–R06 | Conditional status | *"Is anything in my setup blocking sales or payouts?"* |

The plain phrasing above is the door; the governed question behind each ID in [02_Evaluation.md](02_Evaluation.md) is the definition. When wording and implementation disagree, the governed question wins.

## Shared rules for every item

- **Currency:** v1 displays **USD**. KHR display waits for the currency-policy decision (Product + Finance). Currencies are **never combined** into one total.
- **Time:** all periods use `Asia/Phnom_Penh`; comparisons use the immediately preceding equal-length period.
- **Freshness:** the dashboard always shows when data was last updated. Missing or failed data shows **Stale**, **Unknown**, or **Not connected** — never zero, and never "healthy."
- **Actions:** every action revalidates current server state; the dashboard snapshot is never trusted for a decision.

---

## Business health

### 1. Paid Sales — BO-S01

- **In plain words:** the money customers actually paid for valid orders in the selected period, shown with a trend and a previous-period comparison.
- **Use it to:** see whether real paid business is rising or falling — always read beside Paid Orders.
- **Rules that keep it honest:** counts only successful payments linked to an order marked paid (`paidAt`); late captures on cancelled/expired orders are excluded; COD counts **only after confirmed cash collection**; it is gross paid business before refunds — **not** profit, wallet balance, or accounting revenue.

### 2. Paid Orders — BO-S02

- **In plain words:** how many distinct orders produced the Paid Sales above — same period, same valid-payment population.
- **Use it to:** tell whether a sales change came from **more orders** or **bigger orders**.
- **Rules that keep it honest:** never counts created orders or checkout attempts; a paid order stays counted after later lifecycle changes; COD counts only after confirmed cash collection.

### 3. Available Balance — BO-M01

- **In plain words:** the wallet money that can be withdrawn **right now**. A snapshot with a timestamp — not a period result.
- **Use it to:** decide whether to request a payout; the card links to the Finance page for the full picture.
- **Rules that keep it honest:** the period selector never applies to it; no trend, no percent change; it is not profit and not Paid Sales (pending settlement, escrow, and COD cash held by the seller explain the difference — all detailed on Finance).

---

## Needs attention

### 4. Orders Need Decision — BO-O01

- **In plain words:** paid prepaid orders waiting for acceptance, plus COD orders waiting for a decision — **nearest deadline first**, with a countdown.
- **Use it to:** act before the deadline; a missed decision **auto-cancels the order**.
- **Rules that keep it honest:** this is not every open order — only orders whose next step is the seller's accept/reject decision. Rows preview the order; the decision itself happens in the Orders workflow.

### 5. Fulfillment Backlog — BO-F01

- **In plain words:** accepted prepaid orders not yet fulfilled — **oldest first**, with age shown.
- **Use it to:** keep paid customer commitments moving and notice work piling up.
- **Rules that keep it honest:** excludes orders still waiting for a decision and anything already fulfilled; age is shown neutrally — nothing is called "overdue" until Angkoro adopts a fulfillment target.

### 6. Inventory Attention — BO-I05

- **In plain words:** tracked items with **0 or fewer available units (Out of stock)** shown first, then items with **1–5 available units (Low stock)**. Available = stock minus reservations.
- **Use it to:** restock, fix inventory records, review reservations, or change sellability before more sales are affected.
- **Rules that keep it honest:** the 1–5 rule is a simple v1 warning — not a forecast or a per-product reorder point; untracked items are never called out of stock.

---

## Supporting detail

### 7. Average Paid Order Value — BO-S04

- **In plain words:** Paid Sales ÷ Paid Orders for the same period and population.
- **Use it to:** explain the health numbers — did customers place larger or smaller paid orders?
- **Rules that keep it honest:** undefined with zero paid orders (shows "—", never an error); always a supporting card below the headline row, never a headline KPI.

### 8. Top Products — BO-I01

- **In plain words:** the **top 5** products by valid paid units in the selected period, as ranked bars.
- **Use it to:** spot proven demand for restock and promotion decisions; the full ranking lives in Analytics.
- **Rules that keep it honest:** only products with at least 1 paid unit appear — the list is never padded; ties break by paid value, then name; paid units are **not** revenue, profit, or a forecast.

---

## Conditional

### 9. Store Readiness — BO-R01–R06

- **In plain words:** a setup checklist covering: store active · sellable product · checkout configured · payout bank verified · notifications connected · contact & fulfillment settings complete.
- **Use it to:** fix whatever is blocking selling, order handling, or payouts — each failing check links to its fix.
- **Rules that keep it honest:** **only failing checks are shown** (with a one-line count of passing ones); the whole section disappears when setup is complete; sensitive bank details never appear here; it is a setup status, not a performance metric.
