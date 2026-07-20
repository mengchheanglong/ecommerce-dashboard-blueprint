# 3. Platform-Admin Dashboard Content

**In one line:** the fifteen things on the admin dashboard — and for each one, in plain words: what it shows, the decision it supports, how often to check it, what healthy and danger look like, and what to do when it changes.

This page is written to stand alone: a teammate who reads only this page — without the evaluation record or any technical background — should understand every item. Why each item was chosen (and why 52 other questions were not) lives in [02_Evaluation.md](02_Evaluation.md); the screen layout lives in [04_Dashboard_Grouping_and_Wireframe.md](04_Dashboard_Grouping_and_Wireframe.md).

---

## Content types

| Type | Simple meaning |
|---|---|
| Primary KPI | A main platform result for the selected period |
| Breakdown | Shows the steps or parts behind a result |
| Action queue | Work administrators must handle, sorted by urgency |
| Conditional alert | Appears only while a problem exists |
| Conditional status | A check that stays small and quiet when passing, and warns when not |

## The dashboard at a glance

| # | Item | Type | The admin asks… |
|---|---|---|---|
| 1 | **Active Paid Stores** | Primary KPI | *"Is our paying customer base growing or shrinking?"* |
| 2 | **Subscription MRR & Collections** | Primary KPI | *"How much recurring revenue do we have — and did the cash actually arrive?"* |
| 3 | **Platform Paid Sales & Orders** | Primary KPI | *"How much real commerce is flowing through us?"* |
| 4 | **Payment Success Rate** | Primary KPI | *"When people try to pay, does it work?"* |
| 5 | **Store Activation Funnel** | Breakdown | *"Are new stores actually becoming real businesses?"* |
| 6 | **Payouts Awaiting Processing** | Action queue | *"Whose money are we holding, and for how long?"* |
| 7 | **Failed Payouts** | Action queue | *"Which payouts broke, and can we recover them?"* |
| 8 | **Bank Accounts Awaiting Verification** | Action queue | *"Who is waiting on us before they can get paid?"* |
| 9 | **Renewals in Grace** | Action queue | *"Which paying stores are about to slip away?"* |
| 10 | **Failed Onboarding** | Conditional alert | *"Did someone's store setup break?"* |
| 11 | **Wallet–Ledger Reconciliation** | Conditional status | *"Does every store's money balance match its records?"* |
| 12 | **Plan Entitlement Integrity** | Conditional status | *"Is anyone getting features they didn't pay for — or missing ones they did?"* |
| 13 | **Dashboard Data Trust** | Conditional status | *"Can I trust the numbers on this screen right now?"* |
| 14 | **System Status** | Conditional status | *"Is the platform itself running properly?"* |
| 15 | **Source & Financial Reconciliation** | Conditional status | *"Does an independent check agree with this dashboard?"* |

## Rules that apply to everything

- **Money:** for now everything displays in USD. Riel (KHR) display is waiting on a company decision about exchange-rate handling — and the two currencies are never added together into one total.
- **Time:** all periods use Cambodia time (`Asia/Phnom_Penh`). "vs previous period" always compares against the equal-length period immediately before.
- **Honesty:** if data is missing, old, or a check didn't run, the dashboard says **Stale**, **Unknown**, or **Not connected**. It never shows zero, and never pretends things are healthy.
- **Queues:** an item leaves a queue only when someone explicitly closes it (approve, reject, retry, or escalate), and the system records who did it, when, and why. Nothing disappears silently.
- **Actions:** before any action executes, the system re-checks the live state — the number on screen is a snapshot, never the basis for the action itself.

---

## Platform health

### 1. Active Paid Stores

- **What it shows:** how many stores currently have a valid paid subscription — the platform's paying customer base. Underneath the big number: how many stores **joined** (+new) and how many **left** (−churned) this period. Stores whose renewal failed but whose paid time is still running ("Grace" — see item 9) still count, because they are still paying customers.
- **Decision it supports:** should we spend energy on getting *new* stores, or on *keeping* the ones we have? The +new/−churned line answers that directly — a bare total can grow while quietly bleeding customers.
- **Check:** daily.
- **Healthy:** more joining than leaving. **Danger:** leaving ≥ joining for two periods in a row → treat it as a retention problem: open Renewals in Grace and the churn report *before* spending anything on acquisition.

### 2. Subscription MRR & Collections

- **What it shows:** two numbers that must never be confused. **MRR** (monthly recurring revenue) converts every active subscription to its monthly value and answers: *if nothing changes, how much does the platform earn per month?* Below it, **cash collected** shows what actually arrived in the period. MRR is a promise; collections is money in hand.
- **Decision it supports:** can the platform sustain itself — and are the promises turning into cash?
- **Check:** MRR weekly; collections daily.
- **Healthy:** cash tracks MRR closely. **Danger:** a widening gap between them → renewal payments are failing somewhere; check the Payment Success Rate (subscriptions line) and the Grace queue. Never merge or swap the two numbers — labeling cash as "MRR" (or the reverse) misleads everyone downstream.

### 3. Platform Paid Sales & Orders

- **What it shows:** the total value customers actually paid across all stores this period, with the number of paid orders underneath. Only *real* sales count: the payment succeeded **and** the order was truly marked paid. Cash-on-delivery counts only after the seller confirms the cash was collected. Money that arrived after an order had already expired is excluded — Angkoro refunds that automatically.
- **Decision it supports:** is the platform delivering value to merchants — is commerce through us growing? (Note: this is *merchants'* money passing through the platform, not Angkoro's own revenue — Angkoro's revenue is item 2.)
- **Check:** daily.
- **Healthy:** value and order count moving together. **Danger:** value up but orders flat → a few big stores carrying everything (fragility — check store concentration in reports); both falling while the paid-store count holds → stores are going quiet, a retention problem *before* it shows up as churn.

### 4. Payment Success Rate

- **What it shows:** when a customer or store tries to pay and the attempt reaches a clear end, how often does it succeed? Shown as one percentage with two lines beneath: product payments (customers buying) and subscription payments (stores renewing). Attempts that just hang — buyer closed the page, bank never answered — are counted separately as "pending-stale" so they don't distort the rate.
- **Decision it supports:** is checkout broken *right now*? This is the one number that can turn into a platform-wide emergency between two glances — a broken payment flow hurts every store at once.
- **Check:** every visit — this is the closest thing the dashboard has to an alarm.
- **Healthy:** stable within its normal range. **Danger:** a sudden drop of a few points → treat as an emergency: open System Status (are payment confirmations failing?), then the provider breakdown. A slow drift downward → a provider or checkout-experience problem worth a proper investigation this week.

---

## Growth

### 5. Store Activation Funnel

- **What it shows:** three steps for the selected period — stores **created** → stores **activated** (set up enough to actually sell) → stores that made their **first paid sale**. Each step shows the count and what share of created stores got that far.
- **Decision it supports:** where do new stores get stuck — and is onboarding effort paying off? A single "activation %" would hide *which* step is broken; three steps point at the fix.
- **Check:** weekly.
- **Healthy:** a steady share of created stores reaching their first sale. **Danger:** one step suddenly narrowing → something in that step broke (setup flow, checkout configuration, payments) — investigate now, because funnel problems become churn problems later.

---

## Needs attention

Every queue shows three things: **how many** items are open, **the oldest item's age**, and **how many are due soon** against our service targets — because a count alone hides rot (40 items one hour old is fine; 5 items nine days old is a crisis). The most urgent item is always first. The footer shows how many were cleared this week, so you can tell whether the backlog is draining or growing.

### 6. Payouts Awaiting Processing

- **What it shows:** sellers' requests to withdraw their own money that Angkoro hasn't processed yet. Oldest first, measured against our target: **process within 2 business days**.
- **Decision it supports:** pay sellers on time — the most direct trust promise the platform makes.
- **Check:** daily, first thing.
- **Healthy:** oldest item comfortably inside the target, backlog draining faster than new requests arrive. **Danger:** anything past target, or the oldest age growing day after day → escalate processing capacity *today*. Bank details never appear here beyond what's needed to work the queue.

### 7. Failed Payouts

- **What it shows:** payout transfers that didn't go through, with a safe reason ("bank rejected the transfer") — never full account details. Each one is money still owed to a seller.
- **Decision it supports:** recover broken payments before they become angry support tickets and lost trust.
- **Check:** daily; every failure gets a decision within 24 hours — retry, fix the account, or escalate. Nothing sits silently.
- **Healthy:** zero, shown as an explicit "0 — all clear" so you know the check is alive. **Danger:** several failures at the same bank or provider → that's a systemic problem, not individual seller mistakes; check the provider before retrying one by one.

### 8. Bank Accounts Awaiting Verification

- **What it shows:** sellers' payout bank accounts waiting for review. A store can *sell* without this — but it cannot *withdraw money* until verified, so this queue directly blocks sellers' earnings. Oldest first, against our target: **review within 1 business day**.
- **Decision it supports:** unblock sellers waiting to get paid.
- **Check:** daily.
- **Healthy:** queue clears within a day. **Danger:** a growing backlog → sellers can sell but can't withdraw, the fastest way to lose merchant trust. Only the last 4 digits of an account are ever shown here; seeing a full account number requires extra authentication and is always logged.

### 9. Renewals in Grace

- **What it shows:** paying stores whose renewal payment failed but whose already-paid time hasn't run out yet — "Grace." They still have access, and they are usually saveable. Sorted by whose access expires soonest; "due soon" means within 48 hours.
- **Decision it supports:** save recoverable customers before their time runs out.
- **Check:** daily.
- **Healthy:** a small, stable count with stores recovering. **Danger:** the count climbing while recoveries stall → that's usually *one* payment problem affecting many stores (check the Payment Success Rate), not many individual store problems. Grace is not churn — never treat these stores as lost.

### 10. Failed Onboarding

- **What it shows:** nothing, most of the time. When a store's setup process explicitly fails (for example, a step timed out or a store name clashed), a banner appears naming the store and the failed step, and disappears once resolved.
- **Decision it supports:** fix a broken store setup the day it breaks.
- **Check:** none needed — it announces itself.
- **Healthy:** invisible. **Danger:** repeated failures at the *same* step → that's a platform bug in onboarding, not unlucky merchants; send it to engineering rather than retrying case by case. A setup that is merely slow is not "failed" and never triggers this.

---

## Trust & control

Five small status lights at the bottom of the page. Each shows its state **and when it last checked** — a green light with an old timestamp is not really green. When everything passes, they say so explicitly (so you know the checks are alive); when something is wrong, they turn amber and link to the affected records. A check that never ran shows **Not connected** — absence of information is never displayed as health.

### 11. Wallet–Ledger Reconciliation

- **What it shows:** Angkoro keeps every store's money in two forms, on purpose. Each store wallet has a **balance** — one number, fast to read, used across the app. Separately, every money movement (a sale arriving, a refund, a payout, a fee) is written into a **ledger** — the complete paper trail explaining *why* the balance is what it is. By definition the two must always match. This check re-adds the paper trail and compares it with the balance, for every wallet.
- **Decision it supports:** stop moving money the moment the numbers disagree. A mismatch means money was created or lost *on paper* — a bug, a missed record, or manipulation.
- **Check:** runs continuously; glance daily.
- **Healthy:** "Passing" with a recent timestamp. **Danger:** any mismatch → **freeze payouts for the affected wallets first, investigate second** — paying out from a wrong balance turns a data error into real lost money. A pass means the systems agree with each other; it is not a formal audit of the books.

### 12. Plan Entitlement Integrity

- **What it shows:** each subscription plan has an official list of what it includes (features, limits). The live settings can drift from that list — through a bad deployment or a manual edit. This check compares what each paying store *actually gets* against what its plan *says it should get*, and warns only on mismatch.
- **Decision it supports:** catch both failure directions — a paying store missing features it paid for (breaks trust) and a store enjoying paid features free (leaks revenue).
- **Check:** glance daily.
- **Healthy:** quiet. **Danger:** a mismatch → fix the store's entitlement first, then find the cause (which deploy? which manual change?). The official plan list is always the truth — never assume a store's limits from what it's observed doing.

### 13. Dashboard Data Trust

- **What it shows:** whether the numbers on *this screen* are fresh, complete, and calculated over all records — the dashboard's own honesty light. It sits beside the page title because it qualifies everything else you're reading.
- **Decision it supports:** whether to trust this screen before acting on it.
- **Check:** every visit — it's the first thing to read.
- **Healthy:** "Fresh" with a recent time. **Danger:** "Stale," "Partial," or "Unknown" → don't make money or enforcement decisions from the affected cards until data refreshes. Affected cards also mark themselves individually.

### 14. System Status

- **What it shows:** whether the platform machinery is running, as one light with detail one click away. Today it watches three real signals: the **API** (is the server up and are errors rare?), **background jobs** (the invisible workers that auto-cancel expired orders and settle payments — if they jam, the business silently stops), and **payment confirmations** ("webhooks" — payment providers confirm each payment by calling Angkoro back; when those calls fail, orders and payouts quietly stall). Two more lines — server capacity and database backups — currently read **Not connected**, because that monitoring isn't integrated yet; the dashboard says so rather than pretending.
- **Decision it supports:** is anything on fire mechanically, before it becomes visible in the business numbers?
- **Check:** every visit.
- **Healthy:** all lines green with recent checks. **Danger:** failed payment confirmations climbing → act now; this is the early warning that usually comes *before* the Payment Success Rate visibly drops.

### 15. Source & Financial Reconciliation

- **What it shows:** a different job from item 11. That one checks two money systems against *each other*; this one checks **the dashboard itself**: a separate, independent process recalculates the dashboard's totals directly from the raw records and compares them with what's displayed — catching bugs in the dashboard's own math, stale caches, or missing data. The principle: a dashboard cannot grade its own homework.
- **Decision it supports:** whether these numbers are solid enough to report upward — to the lead, the team, or anyone outside.
- **Check:** the independent job runs on a schedule; glance weekly, and always before board-level or external reporting.
- **Healthy:** "Passing" with a recent run time. **Danger:** a mismatch → the affected section's numbers are not reportable until the difference is explained. Until the independent job exists and completes, this light reads **Not connected** — it never defaults to "Passing."
