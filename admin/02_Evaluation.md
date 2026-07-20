# 2. Platform-Admin Question Evaluation

**In one line:** We evaluated all 67 platform-admin questions. **15 became dashboard items** — 4 health KPIs, 1 activation funnel, 4 queues with service targets, 1 conditional alert, and 5 trust/control statuses. Every other question stays documented here with a simple reason in its own row.

This page is the **authoritative decision record**. If this page and any other page disagree, this page wins.

---

## Adopted operating rules (20 July 2026)

These rules were adopted by the project lead. They turn questions that were blocked on a "missing rule" into buildable dashboard items. Each rule is a v1 definition — improving it later changes the rule, not the dashboard's purpose.

| # | Rule | Definition adopted | Unblocks |
|---|---|---|---|
| 1 | **Operational MRR** | Active + Grace subscriptions converted to a monthly value, per currency; labeled operational — not accounting revenue | AD-S09 |
| 2 | **Churn event** | A paid subscription that ends (Expired or Cancelled) without renewal counts as churned on that day | AD-S10 |
| 3 | **Payment-attempt counting** | The success rate counts only attempts that clearly ended (succeeded or failed); attempts hanging longer than 24 h are shown separately as "pending-stale" | AD-P01, AD-P02 |
| 4 | **Payout service target** | Process payout requests within 2 business days; "due soon" = final 25 % of the window | AD-F04, AD-F01 aging |
| 5 | **Verification service target** | Review pending bank accounts within 1 business day | AD-F06 aging |
| 6 | **Grace handling** | The renewals-in-grace queue sorts by next expiry; "due soon" = expires within 48 h | AD-S07 framing |
| 7 | **Queue disposition** | Every queue item is closed only by an explicit action (approve / reject / retry / escalate), recorded with who, when, and why | All queues; feeds AD-U06 |

---

## How to read the verdicts

| Verdict | Meaning |
|---|---|
| ✅ **Dashboard** | On the dashboard now (the bold name is the item it lives in) |
| ➡️ **Inside another item** | On the dashboard now, but shown inside another item — as a sub-line, a sort rule, a funnel step, or a status light |
| 🔔 **Conditional alert** | On the dashboard, but only visible while a problem exists |
| 📄 **Report / drill-down** | The data exists and is useful — but in a report or investigation page, not on the overview |
| 🕓 **Later** | **We want this.** It is blocked by one missing thing (a rule, history, or a system), written in its Why. When that blocker is fixed, the question comes back for review and joins the dashboard. |

**Priority** = how much the question matters: **High · Medium · Low**. Priority is separate from timing — a High question can still be 🕓 Later because its blocker isn't fixed yet.

**Data** = can Angkoro answer it today: **Current · Partial · Needs rule · Gap**.

---

## The result — 15 dashboard items

| Group | Item | IDs | Type |
|---|---|---|---|
| Platform health | **Active Paid Stores** (net change: +new − churned) | AD-G02 (+S03, S10) | Primary KPI |
| Platform health | **Subscription MRR & Collections** | AD-S09 + AD-S01 | Primary KPI |
| Platform health | **Platform Paid Sales & Orders** | AD-C02 + AD-C01 | Primary KPI |
| Platform health | **Payment Success Rate** | AD-P01 + AD-P02 | Primary KPI |
| Growth | **Store Activation Funnel** | AD-G03 + AD-G05 | Breakdown |
| Needs attention | **Payouts Awaiting Processing** | AD-F01 (+F04 target) | Action queue |
| Needs attention | **Failed Payouts** | AD-F03 | Action queue |
| Needs attention | **Bank Accounts Awaiting Verification** | AD-F06 | Action queue |
| Needs attention | **Renewals in Grace** | AD-S07 | Action queue |
| Needs attention | **Failed Onboarding** | AD-O01 | Conditional alert |
| Trust & control | **Wallet–Ledger Reconciliation** | AD-F08 | Conditional status |
| Trust & control | **Plan Entitlement Integrity** | AD-O06 | Conditional status |
| Trust & control | **Dashboard Data Trust** | AD-R06 | Conditional status |
| Trust & control | **System Status** | AD-R01 + R02 + R05 | Conditional status |
| Trust & control | **Source & Financial Reconciliation** | AD-R07 | Conditional status |

---

## A. Platform growth and store activity

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-G01 | How many stores are active and allowed to operate? | 📄 Report / drill-down | Medium | Current | "Active" counts paying and non-paying stores together, so it can look good while paying stores drop. The dashboard follows paying stores; this count stays in reports. |
| AD-G02 | How many stores currently have valid paid access? | ✅ **Active Paid Stores** | High | Current | Our paying customer base. Stores in Grace still count (their paid time is still running) but also appear in the renewal-risk queue. The card also shows how many stores joined and left this period. |
| AD-G03 | How many new stores were created and activated? | ➡️ Inside **Store Activation Funnel** | Medium | Current | Creating an account and opening a store that can sell are two different steps. The funnel counts them separately so we see where new stores get stuck. |
| AD-G04 | What percentage of created stores became active? | 🕓 Later | Medium | Partial | This % needs the date each store changed status, saved forever. Today the system only keeps the latest status, so history is missing. Joins the funnel when history is recorded. |
| AD-G05 | How many stores reached their first valid paid order? | ➡️ Inside **Store Activation Funnel** | Medium | Current | The last funnel step. The first real sale is when a store becomes a real business. |
| AD-G06 | How long does a new store take to reach its first valid paid order? | 🕓 Later | Low | Partial | Same missing history problem as G04, and we must also choose which event starts the clock. |
| AD-G07 | Which active stores have no recent Paid Orders? | 🕓 Later | Medium | Needs rule | Two decisions missing: how many quiet days means "inactive," and who contacts those stores. Without an owner, the list helps no one. |
| AD-G08 | What percentage of active stores have Telegram enabled? | 📄 Report / drill-down | Low | Current | Tells how many stores use Telegram. Good to know, but it changes no daily decision. |

## B. Platform commerce activity

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-C01 | How many valid Paid Orders occurred across Angkoro? | ✅ **Platform Paid Sales & Orders** | Medium | Current | Shown inside the Paid Sales card so value and order count are read together. Only orders with a real completed payment count. |
| AD-C02 | What valid Paid Sales occurred across Angkoro, by currency? | ✅ **Platform Paid Sales & Orders** | Medium | Current | The money customers really paid, across all stores. Payments that arrived after an order already expired don't count (Angkoro refunds them). COD counts only after the seller confirms the cash. Totals are computed over all orders on the server — never by adding up one page of results (the old dashboard's mistake). |
| AD-C03 | How is the seller-decision backlog distributed across stores? | 📄 Report / drill-down | Medium | Current | Shows which stores let orders pile up waiting for accept/reject. For investigation, not daily action. |
| AD-C04 | How many accepted prepaid orders await fulfillment? | 📄 Report / drill-down | Medium | Current | How much paid work still waits for shipping, across all stores. Report context. |
| AD-C05 | How many orders expired before payment succeeded? | 📄 Report / drill-down | Medium | Current | Orders where the buyer never finished paying — a sign of checkout friction. We can't yet see where buyers stopped. |
| AD-C06 | Which stores produced the most valid Paid Orders? | 📄 Report / drill-down | Low | Current | Shows if a few big stores make most of the sales. Important risk info, but a monthly review, not a daily one. |
| AD-C07 | How many orders auto-cancelled because sellers missed decision deadlines? | 📄 Report / drill-down | Medium | Partial | The auto-cancel reason is saved as plain text today. Counting text is fragile — one wording change breaks it. Needs a proper reason code first. |
| AD-C08 | What percentage of accepted COD orders failed cash collection? | 🕓 Later | High | Needs rule | Added 20 Jul 2026. When a buyer refuses a COD order, nothing records "collection failed" — it just looks like a normal cancel. The app must record refusal as its own event first. High priority because COD is core in Cambodia. |

## C. Subscriptions and monetization

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-S01 | How much valid subscription cash was collected, by currency? | ✅ **Subscription MRR & Collections** | High | Current | The subscription cash that really arrived this period, shown under MRR. The source is paid invoices — the reliable record. Kept separate from MRR on purpose. |
| AD-S02 | How are Active Paid Stores distributed across plans? | 📄 Report / drill-down | Medium | Current | Which plans paying stores are on. If most sit on the cheapest plan, revenue is fragile. Review material. |
| AD-S03 | How many stores reached their first valid paid subscription? | ➡️ Inside **Active Paid Stores** | Medium | Current | A store's first paid subscription = a new paying customer. It is the "+new" number on the Active Paid Stores card. |
| AD-S04 | How many stores are currently in a free trial? | 📄 Report / drill-down | Low | Current | How many stores are trying for free. Context only. |
| AD-S05 | What percentage of ended trials became paid subscriptions? | 🕓 Later | Medium | Partial | Needs each trial's end date saved in history, plus a rule for stores that pay weeks later. Can't be computed honestly yet. |
| AD-S06 | Which trials end next? | 📄 Report / drill-down | Medium | Current | Only useful if someone owns contacting stores before their trial ends. No owner yet. |
| AD-S07 | Which live subscriptions are in renewal Grace? | ✅ **Renewals in Grace** | High | Current | Their renewal payment failed, but their paid time is still running — they are still customers and can usually be saved. Sorted by whose access ends first. Calling them "churned" would make us give up too early. |
| AD-S08 | How many first subscription payments failed before activation? | 📄 Report / drill-down | Medium | Current | New stores whose very first payment failed. A different problem from renewal failure, so it is tracked separately in reports. |
| AD-S09 | What is monthly recurring subscription value? | ✅ **Subscription MRR & Collections** | High | Current | MRR = every active subscription converted to a monthly value. It answers: if nothing changes, how much do we earn per month? It is a promise, not cash — so cash collected is shown right under it. If the two drift apart, renewals are failing. Buildable now under rule 1. |
| AD-S10 | What percentage of paid stores stopped subscribing? | ➡️ Inside **Active Paid Stores** | High | Current | The "−churned" number on Active Paid Stores, using rule 2: a subscription that ends without renewal = churned that day. Deeper retention analysis needs more history. |
| AD-M01 | What operational platform-fee amount was recognized, by currency and source? | 📄 Finance report | Medium | Current | All platform fees are currently set to zero, so there is nothing to show. Becomes a dashboard item the day a fee policy exists. |

## D. Payment and checkout reliability

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-P01 | What percentage of complete product-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | Of all payment attempts that clearly ended (success or fail), how many succeeded. Attempts that just hang are shown separately so they don't distort the rate (rule 3). When this drops, every store is hurt at once. |
| AD-P02 | What percentage of complete subscription-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | The same rate for subscription payments, on the same card. When it drops, stores start falling into Grace. |
| AD-P03 | Which failure reason, provider, or method performs worst? | 🕓 Later | Medium | Partial | A fair "worst provider" ranking needs all providers to record failures in the same detail. Today they don't. Becomes the drill-down under the success rate once they do. |
| AD-P04 | Which payments have remained pending longer than expected? | 🕓 Later | Medium | Needs rule | "Too long" is different per method — seconds for cards, minutes for bank QR. Each method needs its own agreed limit first. |
| AD-P05 | How long does a successful payment normally take? | 📄 Report / drill-down | Low | Current | How long a successful payment usually takes. Background info. |
| AD-P06 | Which refunds, late captures, or orphan payment records need reconciliation? | 🕓 Later | High | Partial | Sometimes money arrives with no valid sale — for example, a payment that finished after its order expired. Angkoro auto-refunds these, but there is no complete detection and no owner for stuck cases. That must exist first. High priority — this is money integrity. |

## E. Payouts and bank verification

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-F01 | Which payout requests await processing? | ✅ **Payouts Awaiting Processing** | High | Current | A payout request is a seller asking for their own money — every waiting day is Angkoro holding someone's cash. Oldest first, against the 2-business-day target. Build note: a platform-wide queue view doesn't exist in the backend yet. |
| AD-F02 | Which payouts are currently being processed? | 📄 Report / drill-down | Medium | Current | Transfers already in progress. Belongs on the payout detail page. |
| AD-F03 | Which payouts failed, and why? | ✅ **Failed Payouts** | High | Current | A failed transfer is money still owed to a seller. Every failure must be closed by a clear action — retry, fix the account, or escalate (rule 7). Only safe reasons are shown, never full bank details. |
| AD-F04 | How long does a successful payout normally take? | ➡️ Inside payout queues | High | Current | Answered by the 2-business-day target itself (rule 4). It powers the age and "due soon" warnings on the queues instead of being its own card. |
| AD-F05 | How much payout value was completed, by currency? | 📄 Report / drill-down | Medium | Current | How much was paid out. Background for finance reports. |
| AD-F06 | Which payout bank accounts await verification? | ✅ **Bank Accounts Awaiting Verification** | High | Current | A store can sell but cannot withdraw money until its bank account is verified — so this queue blocks sellers' earnings. The safe backend queue mostly exists (shows last 4 digits only); it needs oldest-first sorting and the 1-business-day target. Seeing a full account number needs extra login and is always logged. |
| AD-F07 | Which bank accounts were rejected or disabled? | 📄 Report / drill-down | Medium | Current | Rejected or disabled accounts and why. Patterns here show repeated verification problems worth fixing at the source. |
| AD-F08 | Does every wallet balance reconcile with its ledger? | ✅ **Wallet–Ledger Reconciliation** | High | Current | Angkoro saves money twice on purpose: each store wallet has a **balance** (one number), and every movement is also written into a **ledger** (the full history that explains that number). The two must always match. This check re-adds the history and compares it with the balance. If they differ, money was created or lost on paper — a bug or manipulation — so payouts for that wallet stop first, investigation comes second. A pass means the two records agree; it is not a formal audit. |

## F. Users, stores, safety, and support

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-U01 | How many new users joined Angkoro? | 📄 Report / drill-down | Low | Current | New signups are context. The platform is measured by paying stores, not raw accounts. |
| AD-U02 | How are users distributed across account states? | 📄 Report / drill-down | Medium | Current | How many users are active, unverified, suspended, or banned. Used during investigations, not daily. |
| AD-U03 | Which users have remained unverified longer than the adopted limit? | 🕓 Later | Low | Needs rule | Needs two decisions first: how long is "too long," and who follows up. |
| AD-U04 | Which users or stores are suspended or banned? | 📄 Report / drill-down | Medium | Current | The enforcement list. Used during safety work; a count on the overview changes nothing. |
| AD-U05 | Which reports, appeals, or support cases await review? | 🕓 Later | Medium | Gap | There is no support/report system in the product yet, so there is no queue to show. Build the workflow first. |
| AD-U06 | Can every sensitive admin action be traced to admin, time, reason, and result? | 🕓 Later | High | Partial | Full accountability means every sensitive action records who/when/why/result. Today only some actions do. Rule 7 adds this for all queue actions — the first slice. A complete audit record across all sensitive actions still needs engineering. |

## G. Onboarding, Telegram, plans, and features

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-O01 | Which store-onboarding operations failed? | 🔔 **Failed Onboarding** alert | Medium | Current | Setup failures are rare and fixed quickly. A permanent card would sit at zero and get ignored; a banner appears only while a failure exists. Slow is not "failed" — only real failures trigger it. |
| AD-O02 | Which onboarding operations stopped progressing? | 🕓 Later | Medium | Needs rule | A setup that silently stopped can only be flagged fairly with an age limit per step and a person who chases it. Both are missing. |
| AD-O03 | At which onboarding step do businesses stop most often? | 🕓 Later | Medium | Gap | To know which step loses the most stores, every step change must be saved permanently. Today it isn't. |
| AD-O04 | How long does successful onboarding normally take? | 📄 Report / drill-down | Low | Partial | Rough setup-time numbers from existing timestamps. Background. |
| AD-O05 | Which requested or connected Telegram setups are unhealthy? | 📄 Report / drill-down | Medium | Current | The list of broken Telegram connections. For the ops team when sellers report missing notifications. |
| AD-O06 | Are active plans mapped to the intended features and limits? | ✅ **Plan Entitlement Integrity** | High | Current | Each plan has an official feature list, but live settings can drift from it (a bad deploy, a manual edit). Drift means a paying store missing features (trust problem) or a store getting paid features free (revenue leak). This check compares live settings against the official list and warns on mismatch. The official list is always the truth. |
| AD-O07 | Which stores are reaching or exceeding plan limits? | 🕓 Later | Medium | Partial | Needs an agreed way to measure usage against limits, and a rule for what happens when a store crosses one. |

## H. Platform reliability and data quality

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-R01 | Is the Angkoro API available, fast enough, and within an acceptable error rate? | ➡️ Inside **System Status** | High | Partial | Today's signals — the server alive-check and the error tracker — give a basic "API healthy" light inside System Status. A full picture with speed and uptime targets comes later. |
| AD-R02 | Which background jobs are failing or stuck? | ➡️ Inside **System Status** | High | Partial | Background jobs do critical work: auto-cancel expired orders, settle payments. If they fail silently, parts of the business stop without anyone noticing. v1 shows the failed/stuck count. |
| AD-R03 | Are database, Redis, server, or disk resources near capacity? | 🕓 Later | High | Gap | Server capacity numbers live outside the app. Until server monitoring is connected, System Status shows "Not connected" instead of pretending it's fine. |
| AD-R04 | Did the latest database backup complete successfully? | 🕓 Later | High | Gap | Backup results live in the deployment servers. An unverified backup means unproven recovery — that is why this is High. Shows "Not connected" until integrated. |
| AD-R05 | Which payment webhooks failed or could not be matched? | ➡️ Inside **System Status** | High | Partial | Payment providers confirm each payment by calling Angkoro back (a "webhook"); these calls are already recorded. When they fail, payments and payouts stall silently — the early warning that comes before the success rate visibly drops. v1 shows the failed count. |
| AD-R06 | Is dashboard data current, complete, and based on the full population? | ✅ **Dashboard Data Trust** | High | Current | The dashboard's own honesty light, next to the page title: is this screen's data fresh and complete? Old or missing data announces itself instead of quietly looking normal. |
| AD-R07 | Do independently recomputed totals reconcile with authoritative sources? | ✅ **Source & Financial Reconciliation** | High | Current | Different from the wallet check — this one checks the dashboard itself. A separate job recalculates the totals from raw records and compares them with the screen, catching bugs in the dashboard's own math or stale caches. A dashboard can't grade its own homework. Until that job exists and runs, this shows "Not connected," never "Passing." |

## I. Security, abuse, and incidents

**Read this first:** every question below is **High priority, and none is on the dashboard** — and that is on purpose. Angkoro today *blocks* attacks (rate limiting, lockouts, step-up login) but does not *record* them for review. In security, a false "no attacks" is more dangerous than an honest "we can't see yet," because it makes people relax exactly when they shouldn't. So the dashboard shows security as **Not connected** — the only true security status we can display — and each row below says exactly what would make it real.

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-X01 | Is the public website or API receiving abnormal or attack traffic? | 🕓 Later | High | Gap | Angkoro blocks abusive traffic, but blocking is not seeing — nothing records traffic history, so "abnormal" has nothing to compare against. A guessing indicator would be worse than none. **Unblock:** put an edge-security service (like Cloudflare) in front of the platform; its console becomes the investigation tool. |
| AD-X02 | Which authentication endpoints and IPs triggered repeated failures or lockouts? | 🕓 Later | High | Partial | Failed logins and lockouts are counted in temporary memory that erases itself — enough to block an attacker now, useless for review later. A slow attack spread over weeks leaves no trace. **Unblock:** save lockout events to a permanent table. The cheapest build in this section — do it first. |
| AD-X03 | Which active sessions show unusual IP or user-agent changes? | 🕓 Later | High | Partial | Sessions already record device and network details, so the raw material exists. But people change networks and devices all the time — without agreed rules for "suspicious," the list becomes noise or false accusations. **Unblock:** agree the rules and the response steps first, then build the queue. |
| AD-X04 | Which WAF or edge-security alerts require investigation? | 🕓 Later | High | Gap | No firewall/edge product is connected, so there are no alerts to show. The same single decision as X01 unblocks both. |
| AD-X05 | Which users, stores, payments, or payouts show unusual behavior? | 🕓 Later | High | Needs rule | An "unusual behavior" flag creates suspicion. Without baselines, severity levels, and a named reviewer, it becomes ignored noise or unfair punishment. Standing rule: an anomaly is a reason to look — never proof of fraud. **Unblock:** governance first (rules, owner, review process), detection second. |
| AD-X06 | Which security incidents remain unresolved? | 🕓 Later | High | Gap | Counting incidents needs an incident process: declare one, set severity, assign an owner, close it. That process doesn't exist — and a fake "Incidents: 0" would claim a process that isn't there. **Unblock:** adopt a minimal workflow (a table, three severity levels, an owner field); then the count is real. |

---

## Count check

- **67 questions** — every ID appears exactly once above.
- **15 dashboard items:** 15 questions Selected (✅), 8 combined into them (➡️), 1 conditional alert (🔔).
- Everything else: 21 report/drill-down (📄, including AD-M01 in Finance), 22 later (🕓).
- Security (all six AD-X), infrastructure capacity/backups, support workflow, and COD collection failure remain **explicit planned boundaries** — shown honestly as Not connected or absent, never as healthy.

For what each approved item means on screen — its decision, check cadence, and healthy/danger signals — see [03_Dashboard_Content.md](03_Dashboard_Content.md).
