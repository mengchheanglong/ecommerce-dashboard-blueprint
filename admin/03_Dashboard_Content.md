# 3. Platform-Admin Dashboard Content

**In one line:** the fifteen things on the admin dashboard — and for each one: the decision it supports, how often to check it, what healthy and danger look like, and what to do when it changes.

Every item follows the decision-driven contract: **a metric earns its place only by connecting to a decision.** Selection reasoning is in [02_Evaluation.md](02_Evaluation.md); layout is in [04_Dashboard_Grouping_and_Wireframe.md](04_Dashboard_Grouping_and_Wireframe.md).

---

## Content types

| Type | Simple meaning |
|---|---|
| Primary KPI | Main platform result for the selected period |
| Breakdown | Shows the steps or composition behind a result |
| Action queue | Work administrators must handle, sorted by urgency |
| Conditional alert | Appears only while a triggering problem exists |
| Conditional status | A control that stays compact when passing and warns when not |

## The dashboard at a glance

| # | Item | IDs | Type | The admin asks… |
|---|---|---|---|---|
| 1 | **Active Paid Stores** | AD-G02 | Primary KPI | *"Is our paying customer base growing or shrinking?"* |
| 2 | **Subscription MRR & Collections** | AD-S09 + S01 | Primary KPI | *"How much recurring revenue do we have — and did the cash actually arrive?"* |
| 3 | **Platform Paid Sales & Orders** | AD-C02 + C01 | Primary KPI | *"How much real commerce is flowing through us?"* |
| 4 | **Payment Success Rate** | AD-P01 + P02 | Primary KPI | *"When people try to pay, does it work?"* |
| 5 | **Store Activation Funnel** | AD-G03 + G05 | Breakdown | *"Are new stores actually becoming real businesses?"* |
| 6 | **Payouts Awaiting Processing** | AD-F01 | Action queue | *"Whose money are we holding, and for how long?"* |
| 7 | **Failed Payouts** | AD-F03 | Action queue | *"Which payouts broke, and can we recover them?"* |
| 8 | **Bank Accounts Awaiting Verification** | AD-F06 | Action queue | *"Who is waiting on us before they can get paid?"* |
| 9 | **Renewals in Grace** | AD-S07 | Action queue | *"Which paying stores are about to slip away?"* |
| 10 | **Failed Onboarding** | AD-O01 | Conditional alert | *"Did someone's store setup break?"* |
| 11 | **Wallet–Ledger Reconciliation** | AD-F08 | Conditional status | *"Does every wallet match its ledger?"* |
| 12 | **Plan Entitlement Integrity** | AD-O06 | Conditional status | *"Is anyone getting features they didn't pay for — or missing ones they did?"* |
| 13 | **Dashboard Data Trust** | AD-R06 | Conditional status | *"Can I trust the numbers on this screen?"* |
| 14 | **System Status** | AD-R01 + R02 + R05 | Conditional status | *"Is the platform itself running properly?"* |
| 15 | **Source & Financial Reconciliation** | AD-R07 | Conditional status | *"Does an independent check agree with this dashboard?"* |

## Shared rules

- **Currency:** v1 displays USD; KHR handling awaits the currency policy; currencies are never combined.
- **Time:** `Asia/Phnom_Penh`; comparisons use the immediately preceding equal-length period.
- **Missing data:** shows **Stale / Unknown / Not connected** — never zero, never "healthy."
- **Queues:** close items only by explicit disposition (approve / reject / retry / escalate), recorded with actor, time, and reason.
- **Actions:** always revalidate current server state; a dashboard snapshot is never trusted for a decision.

---

## Platform health

### 1. Active Paid Stores — AD-G02

- **Decision it supports:** is the paid base growing — do we push acquisition, or fix retention?
- **Check:** daily.
- **Card shows:** count + delta vs previous period, with the net-change line **+new − churned** (AD-S03, AD-S10).
- **Healthy:** net change positive; churn a small share of the base. **Danger:** churn ≥ new for two consecutive periods → treat as a retention incident: read Renewals in Grace, then plan-mix and churn reports before spending anything on acquisition.

### 2. Subscription MRR & Collections — AD-S09 + AD-S01

- **Decision it supports:** can the platform sustain itself — and is committed revenue actually turning into cash?
- **Check:** MRR weekly; collections daily.
- **Card shows:** operational MRR (rule 1) with cash collected beneath. The two are never merged: MRR is commitment, collections is cash.
- **Healthy:** collections track MRR closely. **Danger:** a widening gap between MRR and cash → renewal payments are failing; check Payment Success Rate (subscriptions) and the Grace queue.

### 3. Platform Paid Sales & Orders — AD-C02 + AD-C01

- **Decision it supports:** is merchant commerce growing — is the platform worth paying for?
- **Check:** daily.
- **Card shows:** valid paid sales (GMV) with the paid-order count beneath, both with trend.
- **Healthy:** both move together. **Danger:** sales up while orders flat (concentration risk — check top-store share) or both falling while paid stores hold (stores going quiet — retention risk before it shows in churn). GMV is an input metric: never read it alone as platform health.

### 4. Payment Success Rate — AD-P01 + AD-P02

- **Decision it supports:** is checkout broken right now — the one failure that hurts every store at once?
- **Check:** **real-time / every visit** — this is the closest thing the dashboard has to an alarm.
- **Card shows:** % of terminal payment attempts that succeeded (rule 3), split product / subscription.
- **Healthy:** stable within its normal band. **Danger:** a sudden drop of a few points → platform emergency: check System Status (webhooks), then provider/method drill-down (AD-P03 when built). A slow drift down → provider or UX degradation worth a week-level investigation.

---

## Growth

### 5. Store Activation Funnel — AD-G03 + AD-G05

- **Decision it supports:** where do new stores get stuck — and is onboarding effort paying off?
- **Check:** weekly.
- **Shows:** created → activated → first paid order for the selected period, as three steps with counts. The conversion *rate* (AD-G04) joins when transition history is reliable.
- **Healthy:** a steady share of created stores reaching first paid order. **Danger:** a step that suddenly narrows → the platform broke something in that step (setup flow, checkout config, payments) — investigate before it shows up as churn.

---

## Needs attention

Every queue tile shows: **open count · oldest item age · due-soon count**, sorted closest-to-SLA-breach first, with cleared-this-week as the footer. A count alone hides rot; age and due-soon are the leading indicators.

### 6. Payouts Awaiting Processing — AD-F01

- **Decision it supports:** process seller money on time — the platform's most direct trust obligation.
- **Check:** daily, morning.
- **SLA (rule 4):** 2 business days; due-soon = final 25 % of the window.
- **Healthy:** oldest item well inside SLA; backlog draining faster than inflow. **Danger:** any breach, or oldest age growing day over day → payouts are rotting; escalate processing capacity today. Never expose full bank details here.

### 7. Failed Payouts — AD-F03

- **Decision it supports:** recover broken seller payments before they become support tickets and lost trust.
- **Check:** daily.
- **SLA:** triage within 24 h — every failure gets a disposition (retry / fix account / escalate), never silence.
- **Healthy:** zero, with an explicit "0 — all clear" state. **Danger:** repeat failures on the same bank or provider → systemic issue, not seller error; check the provider before retrying individually.

### 8. Bank Accounts Awaiting Verification — AD-F06

- **Decision it supports:** unblock sellers waiting to get paid — verification gates money movement.
- **Check:** daily.
- **SLA (rule 5):** review within 1 business day; oldest first (backend needs the oldest-first sort).
- **Healthy:** queue clears within SLA. **Danger:** growing backlog → sellers can sell but not withdraw, the fastest way to lose merchant trust. Safe details only (last four digits); full reveal requires step-up auth and is audit-logged.

### 9. Renewals in Grace — AD-S07

- **Decision it supports:** save recoverable paying stores before Grace expires.
- **Check:** daily.
- **Sort (rule 6):** next expiry first; due-soon = expires within 48 h.
- **Healthy:** small, stable count with recoveries happening. **Danger:** Grace count climbing while recoveries stall → a renewal-payment problem (check Payment Success Rate), not sixty individual seller problems. Grace is not churn — treat these stores as saveable.

### 10. Failed Onboarding — AD-O01 (conditional alert)

- **Decision it supports:** fix a broken store setup the day it breaks.
- **Check:** appears only when a failure exists — no permanent space.
- **Healthy:** invisible. **Danger:** repeated failures at the same step → a platform bug in onboarding, not unlucky merchants; route to engineering, not case-by-case retries.

---

## Trust & control

These five render as compact status chips with a **"last checked" timestamp** each, and a deliberate all-clear state. A chip never fakes health: a check that didn't run shows **Unknown / Not connected**, not green.

### 11. Wallet–Ledger Reconciliation — AD-F08

- **Decision it supports:** stop moving money the moment wallets and ledgers disagree.
- **Check:** continuous check; chip read daily.
- **Healthy:** passing, with last-checked time. **Danger:** any mismatch → freeze affected payouts first, reconcile second. A passing check is operational comfort, not accounting certification.

### 12. Plan Entitlement Integrity — AD-O06

- **Decision it supports:** correct entitlement drift — revenue leaks (features without payment) and trust failures (payment without features).
- **Check:** chip read daily; warns only on mismatch against the approved plan catalog.
- **Healthy:** silent/compact. **Danger:** mismatch → fix the entitlement, then find the cause (deploy? manual change?) — never infer intended limits from usage.

### 13. Dashboard Data Trust — AD-R06

- **Decision it supports:** whether to trust *this screen* before acting on it.
- **Check:** every visit — it sits beside the page heading.
- **Healthy:** Fresh, recent timestamp. **Danger:** Stale / Partial / Unknown → do not make money or enforcement decisions from affected cards until refreshed.

### 14. System Status — AD-R01 + AD-R02 + AD-R05

- **Decision it supports:** is the platform mechanically working — API, background jobs, payment webhooks?
- **Check:** every visit; it is the "is anything on fire" chip.
- **v1 signals:** API error rate (Sentry + liveness), failed/stuck job count, failed/unmatched webhook count. Infrastructure capacity (AD-R03) and backups (AD-R04) show as **Not connected** until integrated — absence of telemetry is never displayed as health.
- **Healthy:** all facets green with recent checks. **Danger:** failed webhooks climbing → payment/payout state is silently stalling; this often *precedes* a Payment Success Rate drop.

### 15. Source & Financial Reconciliation — AD-R07

- **Decision it supports:** does an independent recomputation agree with what this dashboard claims?
- **Check:** scheduled check; chip read weekly and before any board-level reporting.
- **Healthy:** independent check ran recently and matches. **Danger:** mismatch → the affected section's numbers are not reportable until explained. The dashboard cannot certify itself: a missing or stale check shows Unknown / Not connected — never Passed.
