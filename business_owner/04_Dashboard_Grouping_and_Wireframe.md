# 4. Business-Owner Dashboard — Layout and Display Choices

**In one line:** how the nine approved items are arranged on one screen, why each group sits where it sits, and why each item looks the way it does.

This page reflects the working prototype: [`visual/Ongoing (business_owner).html`](../visual/Ongoing%20(business_owner).html). Definitions and guardrails stay in [03_Dashboard_Content.md](03_Dashboard_Content.md) — this page never repeats them.

The guiding rule for the whole screen: **the Overview monitors and routes; Orders and Inventory operate.** The Overview never duplicates another page's full workflow — it shows the head of each problem and links to the page that solves it.

---

## Screen order — and why

| # | Group | Items | Answers | Why this position |
|---|---|---|---|---|
| 1 | **Business health** | Paid Sales · Paid Orders · Available Balance | Is paid business happening, and what can I withdraw? | The two questions an owner opens the page with. Health leads on desktop because it is the page's identity. |
| 2 | **Needs attention** | Orders Need Decision · Fulfillment Backlog · Inventory Attention | What must I act on now? | Directly under health, above the fold. These are the only items with **deadlines** — a count alone cannot answer "which order expires first?", so each queue shows its top rows. |
| 3 | **Supporting detail** | Avg Paid Order Value · Top Products | Why did the health numbers move? | Explanation comes after the result it explains. Derived and ranked views must not compete with the headline row. |
| 4 | **Store readiness** | Conditional checklist | Is setup blocking the store? | Bottom, and only when something fails — plus a banner at the top of the page that jumps here, so a blocked store is never missed. |

**Mobile order:** when work exists, **Needs attention moves above Business health** — on a phone the seller is usually reacting, not analyzing. Otherwise the order matches desktop.

**Special states:**
- **New store** → the dashboard is replaced by a setup checklist; performance analytics are hidden until setup is meaningful.
- **Data problem** → affected cards show **Stale** (with last-refresh time) or **Not connected** ("—"), the freshness indicator turns amber, and a banner explains — missing data is never shown as zero.

---

## Wireframe (desktop)

```text
+---------+------------------------------------------------------------------+
| Sidebar |  Topbar:                       View Store · theme · notifications |
| + queue |------------------------------------------------------------------|
|  badges |  Good morning — store status          Updated 2 min ago · Phnom Penh
|         |  [ banner — only when setup or data needs attention ]             |
|         |                                                                   |
|         |  BUSINESS HEALTH                                   [7D][30D][90D] |
|         |  +----------------+  +----------------+  +---------------------+  |
|         |  | Paid Sales     |  | Paid Orders    |  | Available Balance   |  |
|         |  | $4,860         |  | 121            |  | $780.00  [Snapshot] |  |
|         |  | ^12.4% vs prev |  | ^9.0% vs prev  |  | As of 10:47 AM      |  |
|         |  | ~~ sparkline ~~|  | ~~ sparkline ~~|  | Open Finance ->     |  |
|         |  +----------------+  +----------------+  +---------------------+  |
|         |                                                                   |
|         |  NEEDS ATTENTION                                                  |
|         |  +---------------+  +----------------+  +---------------------+   |
|         |  | Need Decision |  | Fulfillment    |  | Inventory Attention |   |
|         |  | count · top 3 |  | count · top 3  |  | count · top 3       |   |
|         |  | deadline sort |  | oldest first   |  | out-of-stock first  |   |
|         |  | View all ->   |  | View all ->    |  | View all ->         |   |
|         |  +---------------+  +----------------+  +---------------------+   |
|         |                                                                   |
|         |  SUPPORTING DETAIL                                                |
|         |  +----------------+  +---------------------------------------+    |
|         |  | Avg Paid Order |  | Top Products — top 5 ranked bars      |    |
|         |  | Value + delta  |  | units at bar end · View all in       |    |
|         |  +----------------+  |  Analytics                            |    |
|         |                      +---------------------------------------+    |
|         |                                                                   |
|         |  STORE READINESS — only failing checks + "N passing" line         |
+---------+------------------------------------------------------------------+
```

---

## Why each item looks the way it does

| Item | Display form | Why this form and not another |
|---|---|---|
| **Paid Sales** | KPI card: number + % delta vs named period + small sparkline | The answer **is one number**, so a card beats a chart. The sparkline adds direction without axes or a legend; the delta names its comparison ("vs prev 30 days") so it can't be misread. |
| **Paid Orders** | Same KPI card form | Same logic — and using the identical form as Paid Sales makes the two readable as a pair (value vs volume). |
| **Available Balance** | Snapshot card: amount + "Snapshot / As of [time]" + Finance link — **no delta, no sparkline** | It answers "now", not "this period." Leaving off the trend and delta is deliberate: a trend would make it look like a performance KPI and invite comparison with Paid Sales, which the guardrails forbid. The visual difference *is* the message. |
| **Orders Need Decision** | Queue card: count + top 3 rows with **deadline countdown chips** + View all | A count can't answer "which first?" — the approved question includes the deadline sort. Three rows preview the head of the queue; the row opens a read-only preview and routes to Orders, where the accept/reject workflow (permissions, revalidation, audit) lives once. |
| **Fulfillment Backlog** | Queue card: count + top 3 rows with **neutral age chips** + View all | Same queue form, oldest first. Age chips stay neutral (no red) because nothing may be called "overdue" until a fulfillment target exists — color would imply a judgment the data can't support. |
| **Inventory Attention** | Queue card: count + top 3 rows with **Out / Low state chips** + View all | Out of stock and Low stock are different severities of the same restock action, so one card with ordered states beats two widgets. Routes to Inventory. |
| **Avg Paid Order Value** | Small supporting card: value + delta + one-line reading hint | It's a derived number (Sales ÷ Orders) — as a chart it would overstate itself, and in the headline row it would compete with the numbers it merely explains. |
| **Top Products** | Top-5 **ranked horizontal bars**, units labeled at the bar end | Ranking is the one job bars do better than anything: relative magnitude at a glance. Five rows is enough to show concentration (one-hero store vs spread demand) without becoming the report — the full ranking lives in Analytics. Never padded: fewer than five sellers → fewer bars. |
| **Store Readiness** | Conditional checklist: failing checks with Fix links + "N others passing" | A checklist matches the mental model of setup. Showing only failures keeps a healthy store's screen clean; the passing count proves the hidden checks weren't skipped. |

**Why cards and not one big chart for health:** the three health answers are one number each. A revenue chart belongs to the Analytics page; on the Overview a sparkline inside the card gives trend context at 1/10th of the space and zero reading cost.

**Why queues and not tables:** the Orders page owns the full table. The Overview queue is deliberately capped — top 3 by urgency, a count, and a route — so the two pages never compete.

---

## Interaction rules

- Every queue row opens a **read-only preview**; the action itself (accept, reject, fulfill, restock) happens in its authorized workflow page, which revalidates current server state.
- **View all →** on each queue routes to the owning page with the same sort applied.
- Available Balance links to Finance for the full money lifecycle.
- The period switcher (7D / 30D / 90D) scopes Paid Sales, Paid Orders, AOV, and Top Products together — and never the balance or the queues.

## Data honesty rules

- Show the selected period and the last-updated time (`Asia/Phnom_Penh`) at all times.
- v1 displays **USD**; KHR handling awaits the currency-policy decision; currencies are never combined.
- Missing or failed data shows **Stale / Unknown / Not connected** — never zero, never "healthy."
- No "overdue" labels anywhere until a fulfillment target is adopted.
- Definitions and per-item guardrails: [03_Dashboard_Content.md](03_Dashboard_Content.md).
