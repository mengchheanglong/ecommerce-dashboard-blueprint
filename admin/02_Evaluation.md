# 2. Platform-Admin Question Evaluation

**In one line:** We evaluated all 67 platform-admin questions. **15 became dashboard items** — 4 health KPIs, 1 activation funnel, 4 queues with service targets, 1 conditional alert, and 5 trust/control statuses. Every other question stays documented here with a full plain-language reason in its own row.

This page is the **authoritative decision record**. If this page and any other page disagree, this page wins.

---

## Adopted operating rules (20 July 2026)

These rules were adopted by the project lead. They convert previously blocked "needs rule" questions into buildable dashboard items. Each rule is a v1 operating definition — refining it later changes the rule, not the dashboard's purpose.

| # | Rule | Definition adopted | Unblocks |
|---|---|---|---|
| 1 | **Operational MRR** | Active + Grace subscriptions converted to a monthly value, per currency; labeled operational — not accounting revenue | AD-S09 |
| 2 | **Churn event** | A paid subscription that ends (Expired or Cancelled) without renewal counts as churned on that day; deeper cohort analysis comes later | AD-S10 |
| 3 | **Payment-attempt denominator** | The success rate counts only attempts that reached a clear end (succeeded or failed); attempts hanging beyond 24 h are reported separately as pending-stale, never counted as success | AD-P01, AD-P02 |
| 4 | **Payout service target** | Process payout requests within 2 business days; "due soon" = final 25 % of the window | AD-F04, AD-F01 aging |
| 5 | **Verification service target** | Review pending bank accounts within 1 business day | AD-F06 aging |
| 6 | **Grace handling** | The renewals-in-grace queue sorts by next expiry; "due soon" = expires within 48 h | AD-S07 framing |
| 7 | **Queue disposition** | Every queue item closes only through an explicit action (approve / reject / retry / escalate) recorded with who, when, and why — never by silently disappearing | All queues; feeds AD-U06 |

---

## How to read the verdicts

| Verdict | Meaning |
|---|---|
| ✅ **Dashboard** | On the current dashboard (the bold name is the item it lives in) |
| ➡️ **Inside another item** | Answered inside an approved item — as a sub-line, sort rule, funnel step, or status light |
| 🔔 **Conditional alert** | Appears only while a triggering problem exists |
| 📄 **Report / drill-down** | Real data, useful in a report or investigation — but it doesn't drive a daily overview decision |
| 🕓 **Later** | Blocked on a missing rule, missing history, or missing system; the Why says exactly what unblocks it |

**Priority:** High · Medium · Low · Future  **Data:** Current · Partial · Needs rule · Gap

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
| AD-G01 | How many stores are active and allowed to operate? | 📄 Report / drill-down | Medium | Current | "Active" mixes paying and non-paying stores — a store can be open while on a trial or unpaid, so this count can grow while the paying base shrinks. The dashboard governs the paid base; this full count stays available as a report filter. |
| AD-G02 | How many stores currently have valid paid access? | ✅ **Active Paid Stores** | High | Current | This is the platform's customer base: stores whose subscription currently allows paid access. Stores in Grace (renewal failed, but the already-paid period is still running) count here too — and the same stores also appear in the renewal-risk queue, so the risk is never hidden. The card also shows how many stores were added and lost this period. |
| AD-G03 | How many new stores were created and activated? | ➡️ Inside **Store Activation Funnel** | Medium | Current | Creating an account and having a store that can actually sell are two different moments. Counting them as separate funnel steps is what reveals where new stores get stuck instead of one blurry "new stores" number. |
| AD-G04 | What percentage of created stores became active? | 🕓 Later | Future | Partial | To say "X % of stores created in March became active," the exact date each store changed state must be kept permanently. Today the system only stores the *current* state, which gets overwritten — a historical percentage would be partly guesswork. The rate joins the funnel once change history is recorded. |
| AD-G05 | How many stores reached their first valid paid order? | ➡️ Inside **Store Activation Funnel** | Medium | Current | The funnel's final step. The first real sale is the moment a store stops being a signup and becomes a business — the best single measure that onboarding actually worked. |
| AD-G06 | How long does a new store take to reach its first valid paid order? | 🕓 Later | Future | Partial | Same history problem as the activation rate — and we must first define which event starts the clock (account created? store activated?). Needs those decisions plus permanent event records. |
| AD-G07 | Which active stores have no recent Paid Orders? | 🕓 Later | Future | Needs rule | Two decisions are missing: how many quiet days counts as "no recent orders" (7? 30?), and who contacts those stores. A list nobody acts on is decoration; with a window and an owner, this becomes a real queue. |
| AD-G08 | What percentage of active stores have Telegram enabled? | 📄 Report / drill-down | Low | Current | Useful context about notification-channel adoption, but it doesn't change a daily platform decision. Report material. |

## B. Platform commerce activity

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-C01 | How many valid Paid Orders occurred across Angkoro? | ✅ **Platform Paid Sales & Orders** | Medium | Current | Shown as the order count inside the Paid Sales card so value and volume are always read together. Counts only orders with a completed, valid payment — never every order created or attempted. |
| AD-C02 | What valid Paid Sales occurred across Angkoro, by currency? | ✅ **Platform Paid Sales & Orders** | Medium | Current | The total value customers actually paid across all stores. "Valid" does real work here: a payment counts only if its order was truly marked paid. Money arriving *after* an order already expired (a "late capture") is excluded because Angkoro auto-refunds it, and cash-on-delivery counts only after the seller confirms cash in hand. Totals are computed on the server over all records — never by adding up one page of results, which was the old dashboard's core mistake. |
| AD-C03 | How is the seller-decision backlog distributed across stores? | 📄 Report / drill-down | Medium | Current | Shows which stores let orders pile up waiting for accept/reject. Useful when investigating service quality across the platform; not a daily admin action. |
| AD-C04 | How many accepted prepaid orders await fulfillment? | 📄 Report / drill-down | Medium | Current | How much paid work across all stores is still waiting to be shipped. Service-quality context for reports. |
| AD-C05 | How many orders expired before payment succeeded? | 📄 Report / drill-down | Medium | Current | Orders where the buyer never finished paying — a checkout-friction signal. We can't yet say exactly *where* buyers gave up (no step tracking), so it stays descriptive report material. |
| AD-C06 | Which stores produced the most valid Paid Orders? | 📄 Report / drill-down | Low | Current | Shows whether a few big stores dominate platform sales. That concentration matters for risk (one big store leaving would hit hard), but it's a monthly-review question, not a daily one. |
| AD-C07 | How many orders auto-cancelled because sellers missed decision deadlines? | 📄 Report / drill-down | Medium | Partial | A real service-quality signal, but today the auto-cancel reason is stored as a *sentence of text*. Counting by reading text breaks the day the wording changes; a machine-readable reason code makes it reliable enough to govern. |
| AD-C08 | What percentage of accepted COD orders failed cash collection? | 🕓 Later | High | Needs rule | Added 20 July 2026. When a buyer refuses a cash-on-delivery order at the door, nothing today records "collection failed" — it just becomes another cancelled order. Until refusal is recorded as its own event, any failure rate would be a guess. High priority because COD is core to the Cambodian market. |

## C. Subscriptions and monetization

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-S01 | How much valid subscription cash was collected, by currency? | ✅ **Subscription MRR & Collections** | High | Current | The cash that actually arrived from subscriptions this period, shown directly under MRR. It uses paid *invoices* as the source of truth, because subscription payment records don't reliably store a success time. Kept separate from MRR on purpose — cash and commitment answer different questions. |
| AD-S02 | How are Active Paid Stores distributed across plans? | 📄 Report / drill-down | Medium | Current | Which plans the paying stores sit on. If most are on the cheapest plan, revenue is fragile — important for plan-strategy reviews, not for daily operations. |
| AD-S03 | How many stores reached their first valid paid subscription? | ➡️ Inside **Active Paid Stores** | Medium | Current | A store's first paid subscription is the moment it joins the paying base — so it appears as the "+new" part of the added/lost line on the Active Paid Stores card. |
| AD-S04 | How many stores are currently in a free trial? | 📄 Report / drill-down | Low | Current | The population trying the product for free. Context for growth reviews; not paid health. |
| AD-S05 | What percentage of ended trials became paid subscriptions? | 🕓 Later | Future | Partial | An honest conversion rate needs each trial's end date frozen in history, plus a rule for stores that pay weeks later (which month's conversion do they count in?). Current state can be overwritten, so this can't be computed truthfully yet. |
| AD-S06 | Which trials end next? | 📄 Report / drill-down | Medium | Current | Only worth surfacing if someone owns contacting stores whose trial is ending. No owner exists yet, so it stays a report. |
| AD-S07 | Which live subscriptions are in renewal Grace? | ✅ **Renewals in Grace** | High | Current | These stores' renewal payment failed, but their already-paid period is still running — they are still customers, and usually saveable. The queue sorts by whose access expires next. Calling them churned would both exaggerate losses and make the team give up on stores that can still be recovered. |
| AD-S08 | How many first subscription payments failed before activation? | 📄 Report / drill-down | Medium | Current | New stores whose very first payment failed. That's an *acquisition* problem, different from renewal failure (a *retention* problem) — keeping them separate in reports prevents mixing two different fixes. |
| AD-S09 | What is monthly recurring subscription value? | ✅ **Subscription MRR & Collections** | High | Current | MRR ("monthly recurring revenue") converts every active subscription to its monthly value and answers: *if nothing changes, how much does the platform earn per month?* It is the sustainability number investors and leads govern by. It measures commitment, not cash — which is exactly why the card shows cash collected right beneath it: when the two drift apart, renewal payments are failing somewhere. Buildable now under adopted rule 1. |
| AD-S10 | What percentage of paid stores stopped subscribing? | ➡️ Inside **Active Paid Stores** | High | Current | Appears as the "−churned" part of the added/lost line, using adopted rule 2 (a subscription that ends without renewal counts as churned that day). Deeper retention analysis — do stores that joined in March stay longer than January's? — needs history the platform hasn't accumulated yet. |
| AD-M01 | What operational platform-fee amount was recognized, by currency and source? | 📄 Finance report | Medium | Current | The ledger has places to record platform fees, but the code currently sets every commerce and payout fee to zero, and COD takes no commission — so there is genuinely nothing to show. The day a fee policy is adopted, this becomes the platform's *own* revenue line and earns dashboard space. |

## D. Payment and checkout reliability

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-P01 | What percentage of complete product-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | The platform's own report card: of all payment attempts that reached a clear end (succeeded or failed), what share succeeded? Attempts that just hang — buyer closed the page, bank never answered — are shown separately as "pending-stale" instead of distorting the rate (adopted rule 3). When this number drops, every store on the platform suffers at once, which is why it's a headline KPI checked on every visit. |
| AD-P02 | What percentage of complete subscription-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | The same rate for subscription payments, shown as the second line of the same card. When *this* one drops, stores start falling into Grace — it's the upstream cause of renewal risk. |
| AD-P03 | Which failure reason, provider, or method performs worst? | 🕓 Later | Medium | Partial | To fairly name the worst provider or payment method, all providers must record failures in comparable detail — today some do and some don't, so a ranking would punish the honest recorders. Once coverage is comparable, this becomes the natural drill-down under the success rate. |
| AD-P04 | Which payments have remained pending longer than expected? | 🕓 Later | Future | Needs rule | "Too long" is different for a card payment (seconds) and a bank QR transfer (minutes). Each method needs its own agreed limit before a warning would be honest. |
| AD-P05 | How long does a successful payment normally take? | 📄 Report / drill-down | Low | Current | Descriptive timing background from existing timestamps. Useful in reports; drives no daily decision. |
| AD-P06 | Which refunds, late captures, or orphan payment records need reconciliation? | 🕓 Later | High | Partial | Sometimes money arrives with no valid sale attached — for example a payment completing *after* its order expired. Angkoro auto-refunds these, but there is no complete detection of every case and no named owner for stuck ones. High priority because this is money integrity; blocked until that detection and ownership exist. |

## E. Payouts and bank verification

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-F01 | Which payout requests await processing? | ✅ **Payouts Awaiting Processing** | High | Current | A payout request is a seller asking for *their own money* — every waiting day is Angkoro holding someone else's cash, which makes this the platform's most direct trust obligation. Oldest requests first, aged against the adopted 2-business-day target. Build note: admins can act on a payout by ID today, but a platform-wide queue view doesn't exist yet. |
| AD-F02 | Which payouts are currently being processed? | 📄 Report / drill-down | Medium | Current | Transfers already in flight need watching only when something else goes wrong. They belong on the payout detail page, not the overview. |
| AD-F03 | Which payouts failed, and why? | ✅ **Failed Payouts** | High | Current | A failed transfer is money still owed to a seller. Every failure must be closed by an explicit choice — retry, fix the account, or escalate — so nothing disappears silently (adopted rule 7). Only safe reasons are shown ("bank rejected"), never full account details, and repeat failures at the same bank point to a systemic problem rather than seller error. |
| AD-F04 | How long does a successful payout normally take? | ➡️ Inside payout queues | High | Current | Answered by adopted rule 4 — the 2-business-day target itself. Instead of being its own card, it powers the age and "due soon" warnings on the payout queues. |
| AD-F05 | How much payout value was completed, by currency? | 📄 Report / drill-down | Medium | Current | How much was actually paid out. Throughput background for finance reports. |
| AD-F06 | Which payout bank accounts await verification? | ✅ **Bank Accounts Awaiting Verification** | High | Current | A store can sell but cannot withdraw until its bank account is verified — so this queue directly blocks seller money. The safe backend queue mostly exists already (shows only the last 4 digits); it needs oldest-first sorting added, plus the adopted 1-business-day target. Viewing a full account number stays behind extra authentication and is always logged. |
| AD-F07 | Which bank accounts were rejected or disabled? | 📄 Report / drill-down | Medium | Current | The rejection/disable history. Patterns here reveal recurring verification problems (bad instructions, one bank's formats failing) worth fixing at the source. |
| AD-F08 | Does every wallet balance reconcile with its ledger? | ✅ **Wallet–Ledger Reconciliation** | High | Current | Angkoro records money twice, on purpose: each store wallet has a **balance** (one number, fast to read, used everywhere), and every movement — sale, refund, payout, fee — is also written into a **ledger** (the full paper trail of *why* the balance is what it is). The two must always match. This check re-adds each wallet's ledger entries and compares the sum with the balance. If they disagree, money was created or lost *on paper* — a bug, a missed write, or manipulation — and payouts for that wallet stop immediately, because paying out from a wrong balance turns a data error into real lost money. Warns only on mismatch; a pass means the two systems agree, not that the books are formally audited. |

## F. Users, stores, safety, and support

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-U01 | How many new users joined Angkoro? | 📄 Report / drill-down | Low | Current | New signups are context. The platform is governed by paying stores, not raw account counts — this belongs in growth reports. |
| AD-U02 | How are users distributed across account states? | 📄 Report / drill-down | Medium | Current | How many users are active, unverified, suspended, banned, or merged. A navigation aid you consult *during* an investigation — a count on the overview would change no daily decision. |
| AD-U03 | Which users have remained unverified longer than the adopted limit? | 🕓 Later | Future | Needs rule | Two missing decisions: how long unverified counts as "too long," and who follows up. The moment both exist, this becomes a legitimate queue — it simply has no owner today. |
| AD-U04 | Which users or stores are suspended or banned? | 📄 Report / drill-down | Medium | Current | The enforcement list — consulted during safety work, kept in the Users/Stores management pages. Real data, wrong altitude for the overview. |
| AD-U05 | Which reports, appeals, or support cases await review? | 🕓 Later | Future | Gap | There is no support/report/appeal system in the product at all, so there is no queue to display. The workflow must be built first; its queue joins the dashboard after. |
| AD-U06 | Can every sensitive admin action be traced to admin, time, reason, and result? | 🕓 Later | High | Partial | Full accountability means every sensitive action (reveal bank details, process a payout, suspend a store) leaves a who/when/why/result record — today only *some* actions do. Adopted rule 7 delivers the first real slice: every queue action now records exactly that. A complete audit record across all sensitive actions remains engineering work, and until it exists no dashboard can honestly claim "all actions are traceable." |

## G. Onboarding, Telegram, plans, and features

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-O01 | Which store-onboarding operations failed? | 🔔 **Failed Onboarding** alert | Medium | Current | Setup failures are rare and transient — a webhook timeout, a name clash — fixed once and gone. A permanent card would sit at zero and teach admins to ignore the section; a banner that appears only while a failure exists gets attention exactly when deserved. Guardrail: only *explicit* failures trigger it — a setup that is merely slow is not "failed." |
| AD-O02 | Which onboarding operations stopped progressing? | 🕓 Later | Future | Needs rule | A setup that silently stalled is different from one that failed. Flagging it honestly needs an agreed age limit per setup step and a named person to chase stalls — neither exists yet. |
| AD-O03 | At which onboarding step do businesses stop most often? | 🕓 Later | Future | Gap | To say which step loses the most stores, every step change must be recorded permanently as it happens. Today it isn't — so the statistic can't be computed truthfully. |
| AD-O04 | How long does successful onboarding normally take? | 📄 Report / drill-down | Low | Partial | Existing timestamps give rough setup-duration figures. Limited but harmless background for reports. |
| AD-O05 | Which requested or connected Telegram setups are unhealthy? | 📄 Report / drill-down | Medium | Current | The list of broken or stuck Telegram connections — investigation material for the ops team, opened when a seller reports missing notifications. |
| AD-O06 | Are active plans mapped to the intended features and limits? | ✅ **Plan Entitlement Integrity** | High | Current | Each plan has an official list of what it includes; the live settings can drift from that list through a bad deploy or a manual edit. Drift in one direction means a paying store missing features it paid for (a trust failure); in the other, a store getting paid features free (a revenue leak). This check compares live settings against the official plan list and warns only on mismatch. The official list is always the truth — never guess a plan's limits from what stores are seen doing. |
| AD-O07 | Which stores are reaching or exceeding plan limits? | 🕓 Later | Future | Partial | Needs an agreed way to measure each store's usage against its plan limits, plus a rule for what happens when a store crosses one (block? upsell? warn?). Measurement and consequence must both exist first. |

## H. Platform reliability and data quality

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-R01 | Is the Angkoro API available, fast enough, and within an acceptable error rate? | ➡️ Inside **System Status** | High | Partial | Today's real signals — the server's alive-check and the error tracker (Sentry) — are enough for a v1 "is the API healthy" light inside System Status. A full picture with speed and uptime targets needs a proper monitoring series that doesn't exist yet; the light must not be oversold as full observability. |
| AD-R02 | Which background jobs are failing or stuck? | ➡️ Inside **System Status** | High | Partial | Background jobs run critical work — auto-cancelling expired orders, settling payments. If they silently fail, parts of the business stop without anyone noticing. v1 shows the failed/stuck job count as a System Status light; a full job console with retry tools is later work. |
| AD-R03 | Are database, Redis, server, or disk resources near capacity? | 🕓 Later | High | Gap | Capacity numbers live on the servers, outside the application — nothing in the codebase can report them. Until server monitoring is connected, System Status shows this line as **Not connected** rather than pretending it's fine. |
| AD-R04 | Did the latest database backup complete successfully? | 🕓 Later | High | Gap | Backup results live in the deployment infrastructure. An unverified backup means unproven recovery — which is exactly why this is high priority and why its absence is shown as **Not connected**, never assumed healthy. |
| AD-R05 | Which payment webhooks failed or could not be matched? | ➡️ Inside **System Status** | High | Partial | Payment providers confirm payments by calling Angkoro back (a "webhook"); those calls are already recorded. When they fail or can't be matched to a payment, orders and payouts silently stall — it's the early warning that usually comes *before* the Payment Success Rate visibly drops. v1 shows the failed/unmatched count; a recovery workflow for stuck ones is later work. |
| AD-R06 | Is dashboard data current, complete, and based on the full population? | ✅ **Dashboard Data Trust** | High | Current | The dashboard's own honesty light, shown beside the page title: is the data on this screen fresh, complete, and covering all records? Stale or missing data announces itself — it never quietly looks normal, and it is never displayed as zero. |
| AD-R07 | Do independently recomputed totals reconcile with authoritative sources? | ✅ **Source & Financial Reconciliation** | High | Current | Different job from the wallet check: that one compares two money systems inside the product; this one checks **the dashboard itself**. A separate scheduled job recalculates the displayed totals from raw records and compares — catching bugs in the dashboard's own math, stale caches, or missing records. A dashboard cannot grade its own homework. Until that independent job exists and runs, this shows **Not connected** — it never defaults to "Passing." |

## I. Security, abuse, and incidents

**Read this first:** every question below is **High priority, and none is on the dashboard** — and that is the point, not a contradiction. Angkoro today is *defended but not observed*: rate limiting, lockouts, and step-up authentication actively block abuse, but almost nothing durably *records* it for review. Security has an asymmetry no other section has — a false **"no attacks"** is far more dangerous than an honest **"we can't see yet,"** because it invites relaxing exactly where vigilance is needed. So the dashboard shows security as **Not connected**, the only true security status the platform can display, and each row below names precisely what would make it real.

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-X01 | Is the public website or API receiving abnormal or attack traffic? | 🕓 Later | High | Gap | Angkoro has rate limiting that *blocks* abusive traffic — but blocking is defense, not visibility, and nothing records traffic history to compare against "normal." An attack indicator without a baseline is guessing, and a false "no attack" is the worst kind of wrong. **Unblock:** put an edge-security service (e.g., Cloudflare) in front of the platform; its console becomes the investigation surface, and an honest summary can then reach this dashboard. |
| AD-X02 | Which authentication endpoints and IPs triggered repeated failures or lockouts? | 🕓 Later | High | Partial | Failed logins and lockouts are counted in temporary memory that deletes itself — good enough to block an attacker *now*, useless for review, because a slow password-guessing campaign spread across weeks leaves no trace. **Unblock:** save lockout events to a permanent table — one table and a writer. This is the cheapest build in the whole section and the recommended first security step. |
| AD-X03 | Which active sessions show unusual IP or user-agent changes? | 🕓 Later | High | Partial | Sessions already record device and network details, so raw material exists. But real people change networks and devices constantly — without agreed rules for "suspicious," this list is either constant noise (ignored) or false accusations against legitimate users (harm). It also needs a privacy-safe way to show session data and a defined response when something is confirmed. **Unblock:** adopt the anomaly rules and response workflow first; then build the queue. |
| AD-X04 | Which WAF or edge-security alerts require investigation? | 🕓 Later | High | Gap | No firewall/edge-security product is connected, so there are no alerts to display — this is purely an integration decision, the same one that unblocks AD-X01. |
| AD-X05 | Which users, stores, payments, or payouts show unusual behavior? | 🕓 Later | High | Needs rule | An "unusual behavior" flag is a suspicion generator. Without baselines for what's usual, severity levels, false-positive controls, and a named reviewer, it becomes ignored noise or unfair enforcement — both worse than not having it. Standing platform decision: an anomaly is never proof of fraud or compromise; it is a reason for a human to look. **Unblock:** governance first (rules, owner, review process), detection second. |
| AD-X06 | Which security incidents remain unresolved? | 🕓 Later | High | Gap | Counting unresolved incidents presupposes an incident *process*: someone can declare one, rate its severity, assign an owner, and close it. None of that exists — and a hardcoded "Incidents: 0" would be the most dangerous number on the page, claiming a process that isn't there. **Unblock:** adopt even a minimal incident workflow (a table, three severity levels, an owner field); the count becomes real the day the process does. |

---

## Count check

- **67 questions** — every ID appears exactly once above.
- **15 dashboard items:** 15 questions Selected (✅), 8 combined into them (➡️), 1 conditional alert (🔔).
- Everything else: 21 report/drill-down (📄, including AD-M01 in Finance), 22 later (🕓).
- Security (all six AD-X), infrastructure capacity/backups, support workflow, and COD collection failure remain **explicit planned boundaries** — represented honestly as Not connected or absent, never as healthy.

For what each approved item means on screen — its decision, check cadence, and healthy/danger signals — see [03_Dashboard_Content.md](03_Dashboard_Content.md).
