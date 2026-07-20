# 4. Platform-Admin Dashboard — Layout and Display Choices

**In one line:** how the fifteen approved items are arranged on one screen, why each group sits where it sits, and why each item uses its display form.

Definitions, decisions, cadences, and healthy/danger signals stay in [03_Dashboard_Content.md](03_Dashboard_Content.md) — this page never repeats them. The working prototype is [`visual/Ongoing (admin).html`](../visual/Ongoing%20(admin).html).

The guiding rules:

- **The overview monitors and routes; dedicated pages operate.** The admin home is deliberately thin — a "single pane of glass" that tries to show everything serves no one. Role-deep work (finance ops, risk ops, support) lives in dedicated surfaces underneath.
- **Two levels of disclosure, never more.** Home tile → queue/detail page. No tile → summary → sub-summary → list.
- **One banner at a time**, dismissible; alerts otherwise live in their queue or chip.

---

## Screen order — and why

| # | Group | Items | Answers | Why this position |
|---|---|---|---|---|
| 1 | **Platform health** | Active Paid Stores · MRR & Collections · Paid Sales & Orders · Payment Success Rate | Is the paid platform operating and sustainable? | The governance row — growth, revenue, commerce, reliability. Payment Success Rate sits in it because it is the one number that can turn into an emergency between two glances. |
| 2 | **Growth** | Store Activation Funnel | Are new stores becoming real businesses? | Directly under health: activation explains *future* health, the way supporting detail explains current health on the seller dashboard. |
| 3 | **Needs attention** | 4 SLA queues (+ Failed Onboarding alert when triggered) | What must administrators act on now? | Above the fold on a working day. Every tile carries count + oldest age + due-soon, because age — not count — is the leading indicator of a rotting queue. |
| 4 | **Trust & control** | 5 status chips | Can we trust the numbers, the money, and the machine? | Persistent but compact at the bottom, except Data Trust, which also surfaces beside the page heading. Chips warn loudly only when something is wrong — and an explicit all-clear state proves the checks are alive. |

**Mobile order:** Needs attention first when any queue has work or any control warns; otherwise same as desktop.

---

## Wireframe (desktop)

```text
+---------+--------------------------------------------------------------------+
| Sidebar |  Topbar                                     theme · notifications  |
| Platform|--------------------------------------------------------------------|
| Finance |  Platform Overview                 Data Trust: Fresh · 2 min ago    |
| Ops     |  [ one banner — only when something needs attention ]               |
| + queue |                                                                     |
|  badges |  PLATFORM HEALTH                                    [7D][30D][90D]  |
|         |  +--------------+ +--------------+ +--------------+ +------------+  |
|         |  | Active Paid  | | Subscription | | Platform     | | Payment    |  |
|         |  | Stores  226  | | MRR  $9,420  | | Paid Sales   | | Success    |  |
|         |  | ^5.4%        | | Cash $8,940  | | $17,320      | | 96.8%      |  |
|         |  | +12 new -4   | | ~~trend~~    | | 3,547 orders | | prod/sub   |  |
|         |  |  churned     | |              | | ~~trend~~    | | ~~trend~~  |  |
|         |  +--------------+ +--------------+ +--------------+ +------------+  |
|         |                                                                     |
|         |  GROWTH — Store activation funnel (this period)                     |
|         |  Created 84  ->  Activated 61  ->  First paid order 38              |
|         |                                                                     |
|         |  NEEDS ATTENTION                                                    |
|         |  +---------------+ +---------------+ +---------------+ +---------+  |
|         |  | Payouts       | | Failed        | | Bank          | | Grace   |  |
|         |  | awaiting  23  | | payouts    2  | | verification 8| | renew 14|  |
|         |  | oldest 1d 6h  | | oldest 4h     | | oldest 22h    | | next 9h |  |
|         |  | 3 due soon    | | top rows...   | | 2 due soon    | | 4 <48h  |  |
|         |  | cleared 15/wk | |               | |               | |         |  |
|         |  +---------------+ +---------------+ +---------------+ +---------+  |
|         |                                                                     |
|         |  TRUST & CONTROL                                                    |
|         |  [Wallet-Ledger OK 09:12] [Entitlement OK 09:12] [System Status OK] |
|         |  [Source Reconciliation OK Sun 02:00]  ...or warnings when not      |
+---------+--------------------------------------------------------------------+
```

---

## Why each item looks the way it does

| Item | Display form | Why this form and not another |
|---|---|---|
| **Active Paid Stores** | KPI card + delta + net-change line (+new − churned) | The count alone is a vanity trajectory; the net-change decomposition is what turns it into a *decision* (acquisition vs retention). |
| **Subscription MRR & Collections** | KPI card: MRR primary, cash secondary | Two related numbers, one card, never merged — commitment (MRR) and cash (collections) answer different questions, and a widening gap between them *is* the signal. |
| **Platform Paid Sales & Orders** | KPI card: value primary, order count secondary + trend | Value and volume read as one motion; divergence between them is the story (concentration or quiet stores). |
| **Payment Success Rate** | KPI card: %, product/sub split, trend | A rate with a normal band — the card closest to an alarm. Later it gains a threshold line (rate-vs-threshold, the way payment platforms track network dispute programs). |
| **Store Activation Funnel** | 3-step horizontal funnel with counts | Steps-with-narrowing is the one shape that shows *where* stores get stuck; a single "activation %" would hide which step broke. |
| **Payout / Verification / Failed / Grace queues** | Queue tiles: count + oldest age + due-soon + top rows + cleared-this-week footer | Count alone hides rot ("40 items × 1 hour" vs "5 items × 9 days"). Oldest age and due-soon are leading indicators; throughput tells you if the backlog is draining. Sorted closest-to-breach first — never newest-first. |
| **Failed Onboarding** | Conditional alert banner | Failures are rare and transient; a permanently visible empty queue trains admins to ignore the section. |
| **Trust & control chips** | Status chips with last-checked timestamps + explicit all-clear | Service-health-card pattern: status + count on the home, detail one click away. The timestamp matters as much as the color — a green chip with an old check is not green. |
| **Data Trust** | Chip + freshness line beside the page heading | It qualifies every other number on the page, so it must be visible before any of them are read. |

**Why four KPI cards and not six:** MRR/collections and sales/orders pair naturally inside one card each (primary + secondary line). Four cards keep the governance row readable at a glance; every additional headline number dilutes all the others.

**Why the funnel is one row, not a section:** it's a weekly-cadence explainer, not daily work. One compact row honors it without competing with the queues.

---

## Interaction rules

- Every queue tile routes to its full authorized workflow page; tiles preview the top rows only (top 3, never the full list).
- Queue items close only via explicit disposition (approve / reject / retry / escalate) with actor, time, and reason recorded — silent disappearance is forbidden, and dispositions feed the audit trail (AD-U06).
- Row-level detail (bank reveal, payout execution) requires the existing authorization: platform ADMIN role, step-up auth for sensitive reveals, audit logging.
- The period switcher scopes the four KPI cards and the funnel — never the queues (always "now") or the control chips (own check times).

## Data honesty rules

- v1 displays USD; KHR handling awaits the currency policy; currencies are never combined.
- Missing or failed sources show **Stale / Unknown / Not connected** — never zero, never Passed, never healthy.
- Infrastructure capacity, backups, security feeds, support workflow, and COD collection remain **planned boundaries** shown as Not connected facets or absent sections — never silently omitted.
- Definitions, cadences, and healthy/danger responses: [03_Dashboard_Content.md](03_Dashboard_Content.md).
