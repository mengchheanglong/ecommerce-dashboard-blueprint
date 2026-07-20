# 2. Platform-Admin Question Evaluation

**In one line:** We evaluated all 67 platform-admin questions. **15 became dashboard items** — 4 health KPIs, 1 activation funnel, 4 SLA-managed queues, 1 conditional alert, and 5 trust/control statuses. Every other question stays documented here with a plain reason.

This page is the **authoritative decision record**. If this page and any other page disagree, this page wins. Each category has two parts: a **verdict table** for fast scanning, and an **"In plain language"** section that explains the concepts and reasoning in full.

---

## Adopted operating rules (20 July 2026)

These rules were adopted by the project lead. They convert previously blocked "needs rule" questions into buildable dashboard items. Each rule is a v1 operating definition — refining it later changes the rule, not the dashboard's purpose.

| # | Rule | Definition adopted | Unblocks |
|---|---|---|---|
| 1 | **Operational MRR** | Active + Grace subscriptions normalized to a monthly value, per currency; labeled operational — not accounting revenue | AD-S09 |
| 2 | **Churn event** | A paid subscription reaching Expired or Cancelled without renewal churns on that day; cohort analysis comes later | AD-S10 |
| 3 | **Payment-attempt denominator** | Attempts that reached a terminal outcome (succeeded / failed); attempts pending beyond 24 h are reported separately as pending-stale, never counted as success | AD-P01, AD-P02 |
| 4 | **Payout SLA** | Process payout requests within 2 business days; "due soon" = final 25 % of the window | AD-F04, AD-F01 aging |
| 5 | **Verification SLA** | Review pending bank accounts within 1 business day | AD-F06 aging |
| 6 | **Grace handling** | Renewals-in-grace queue sorts by next expiry; "due soon" = expires within 48 h | AD-S07 framing |
| 7 | **Queue disposition** | Every queue item closes only through an explicit action (approve / reject / retry / escalate) recorded with actor, time, and reason — never by silently disappearing | All queues; feeds AD-U06 |

---

## How to read the verdicts

| Verdict | Meaning | Old label |
|---|---|---|
| ✅ **Dashboard** | On the current dashboard | Selected |
| ➡️ **Inside another item** | Answered inside an approved item (sub-line, sort rule, funnel step, or status facet) | Combined |
| 🔔 **Conditional alert** | Appears only while a triggering condition exists | Conditional alert |
| 📄 **Report / drill-down** | Useful in a report or investigation — not on the overview | Supporting |
| 🕓 **Later** | Revisit when the missing rule, data, or workflow exists | Planned |

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
| Needs attention | **Payouts Awaiting Processing** | AD-F01 (+F04 SLA) | Action queue |
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
| AD-G01 | How many stores are active and allowed to operate? | 📄 Report / drill-down | Medium | Current | Operational store count mixes paid and unpaid contexts. |
| AD-G02 | How many stores currently have valid paid access? | ✅ **Active Paid Stores** | High | Current | The usable paid-store base and its movement; Grace counts but must also appear in the renewal queue. |
| AD-G03 | How many new stores were created and activated? | ➡️ Inside **Store Activation Funnel** | Medium | Current | The created → activated steps of the funnel (rule adoption, 20 Jul 2026). |
| AD-G04 | What percentage of created stores became active? | 🕓 Later | Future | Partial | The activation *rate* joins the funnel once transition history is reliable. |
| AD-G05 | How many stores reached their first valid paid order? | ➡️ Inside **Store Activation Funnel** | Medium | Current | The funnel's final step — the moment a store becomes real commerce. |
| AD-G06 | How long does a new store take to reach its first valid paid order? | 🕓 Later | Future | Partial | Timing needs governed first-event logic. |
| AD-G07 | Which active stores have no recent Paid Orders? | 🕓 Later | Future | Needs rule | "Recent" needs an adopted inactivity window and an owner action. |
| AD-G08 | What percentage of active stores have Telegram enabled? | 📄 Report / drill-down | Low | Current | Channel-adoption context, not core paid health. |

### In plain language

- **AD-G01 vs AD-G02 — "active" and "paid" are different populations.** A store can be active (allowed to operate) while on a trial, in setup, or unpaid. Mixing them makes "growth" ambiguous: the paid base could shrink while the active count grows. The dashboard governs the **paid** base; the operational count is a report filter.
- **AD-G02 — why Grace counts as paid.** A store in Grace already paid for its current period; its renewal failed but access is still valid. Excluding it would overstate churn. The compensating rule: every Grace store must *also* appear in the renewal-risk queue, so the KPI never hides recoverable risk.
- **AD-G03 — created ≠ activated.** An account signup is not a store that can sell. Counting both steps separately is what lets the funnel show *where* new stores stall.
- **AD-G04 / AD-G06 — why the rate and the timing wait.** Store state today is a *current* value that gets overwritten. To say "X % of March's stores activated within 7 days" you need immutable timestamps of each transition. Until those exist, any historical rate would be partly reconstructed guesswork.
- **AD-G07 — why "quiet stores" needs a rule.** "No recent orders" requires choosing the window (7 days? 30?) and, more importantly, *who does what* when a store goes quiet. A list nobody acts on is decoration; adopt the window and an outreach owner, and this becomes a real queue.

## B. Platform commerce activity

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-C01 | How many valid Paid Orders occurred across Angkoro? | ✅ **Platform Paid Sales & Orders** | Medium | Current | The order count reads beneath Paid Sales — value and volume as one card. |
| AD-C02 | What valid Paid Sales occurred across Angkoro, by currency? | ✅ **Platform Paid Sales & Orders** | Medium | Current | Valid commerce value (GMV) across stores; an input metric — retention and net revenue are the later health measures. |
| AD-C03 | How is the seller-decision backlog distributed across stores? | 📄 Report / drill-down | Medium | Current | Platform-wide backlog accumulation — investigation material. |
| AD-C04 | How many accepted prepaid orders await fulfillment? | 📄 Report / drill-down | Medium | Current | Fulfillment pressure across stores — report material. |
| AD-C05 | How many orders expired before payment succeeded? | 📄 Report / drill-down | Medium | Current | Checkout friction signal without claiming an exact funnel. |
| AD-C06 | Which stores produced the most valid Paid Orders? | 📄 Report / drill-down | Low | Current | Concentration context; a governed top-10-share stat can join later. |
| AD-C07 | How many orders auto-cancelled because sellers missed decision deadlines? | 📄 Report / drill-down | Medium | Partial | Service-quality signal; durable reason code still needed. |
| AD-C08 | What percentage of accepted COD orders failed cash collection? | 🕓 Later | High | Needs rule | COD is a first-class flow and collection failure is a real Cambodia-specific risk, but a governed refusal/failed-collection event must exist before a rate can be trusted. |

### In plain language

- **AD-C01 / AD-C02 — what "valid" filters out.** A payment only counts when it succeeded **and** its order was actually stamped paid (`paidAt`). This excludes *late captures* — money that arrives after an order already expired or was cancelled; Angkoro holds and auto-refunds that money, so counting it would inflate sales with refunds-in-waiting. COD counts only when the seller confirms cash was collected — placement or acceptance alone is not revenue. And the totals must be computed server-side over the full population: the old frontend summed one page of API results, which is exactly the trap this dashboard replaces.
- **AD-C02 — why GMV alone can mislead.** Paid Sales is merchant money passing *through* the platform, not platform revenue. A rising GMV can hide a leaky store base (a few big stores masking many quiet ones) — which is why the KPI card pairs it with order volume, and why store concentration (C06) and retention are named as the next-stage health measures.
- **AD-C07 — why the auto-cancel count isn't governed yet.** The system writes a *text* reason ("Auto-cancelled: the store did not accept…"). Counting by parsing text strings is brittle — one wording change silently breaks the metric. A machine-readable reason code makes it trustworthy.
- **AD-C08 — the question we added.** Today, a buyer refusing a COD delivery most likely ends as a generic cancellation — nothing records "collection was attempted and failed." Until an explicit refusal event exists, any COD failure rate would be a guess. High priority because COD is core to the Cambodian market; blocked because the event doesn't exist yet.

## C. Subscriptions and monetization

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-S01 | How much valid subscription cash was collected, by currency? | ✅ **Subscription MRR & Collections** | High | Current | Cash collected, shown beneath MRR — commitment and cash are different numbers and are never merged. |
| AD-S02 | How are Active Paid Stores distributed across plans? | 📄 Report / drill-down | Medium | Current | Plan composition and exposure — report material. |
| AD-S03 | How many stores reached their first valid paid subscription? | ➡️ Inside **Active Paid Stores** | Medium | Current | The "+new" component of the net-change line. |
| AD-S04 | How many stores are currently in a free trial? | 📄 Report / drill-down | Low | Current | Trial population is context, not paid health. |
| AD-S05 | What percentage of ended trials became paid subscriptions? | 🕓 Later | Future | Partial | Needs immutable trial-end / paid-transition cohorts. |
| AD-S06 | Which trials end next? | 📄 Report / drill-down | Medium | Current | Actionable only if the team owns trial-expiry outreach. |
| AD-S07 | Which live subscriptions are in renewal Grace? | ✅ **Renewals in Grace** | High | Current | Recoverable renewal risk, sorted by next expiry (rule 6); Grace is not churn. |
| AD-S08 | How many first subscription payments failed before activation? | 📄 Report / drill-down | Medium | Current | Separates acquisition-payment failure from renewal problems. |
| AD-S09 | What is monthly recurring subscription value? | ✅ **Subscription MRR & Collections** | High | Current | Operational MRR under adopted rule 1 — the commitment number a platform is governed by. |
| AD-S10 | What percentage of paid stores stopped subscribing? | ➡️ Inside **Active Paid Stores** | High | Current | The "− churned" component of net change under adopted rule 2; retention cohorts remain later work. |
| AD-M01 | What operational platform-fee amount was recognized, by currency and source? | 📄 Finance report | Medium | Current | Commerce and payout fees are currently zero by policy; activates as an oversight item when a fee policy exists. |

### In plain language

- **AD-S09 vs AD-S01 — MRR and cash answer different questions.** MRR normalizes every active + grace subscription to a monthly value: *"if nothing changes, how much recurring revenue do we have?"* Collections is the cash that actually arrived this period. They diverge for good reasons (annual plans paid up front, renewals mid-cycle) and bad ones (renewal payments failing). That divergence is itself the signal — which is why they share one card but are never added together or relabeled as each other.
- **AD-S01 — why invoices, not payments, are the source.** The audit found the generic subscription-payment path does not stamp a success time; the **PAID invoice and its `paidAt`** is the authoritative record of subscription cash. Building collections on raw payment rows would miscount.
- **AD-S07 — what Grace actually is.** Renewal failed, but the store already paid for its current period, so access legitimately continues while recovery is attempted. Treating Grace as churn would both overstate losses and make the team give up on stores that are usually saveable. That's why it's a *recovery queue*, sorted by which access expires next.
- **AD-S05 — why trial conversion waits.** A trustworthy conversion rate needs each trial's end date frozen in history and a rule for late conversions (a store that pays 3 weeks after trial end belongs to which cohort?). Current state can be overwritten; cohorts can't be reconstructed from it.
- **AD-M01 — fee rails exist, fee policy doesn't.** The ledger has platform-fee account types, but current code sets commerce and payout fees to zero and COD takes no commission. There is nothing to report until a fee policy is adopted — and when it is, this becomes the platform's *own* revenue line (take rate), a different thing from GMV.

## D. Payment and checkout reliability

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-P01 | What percentage of complete product-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | Checkout success is the platform's own responsibility metric, buildable under adopted rule 3. |
| AD-P02 | What percentage of complete subscription-payment attempts succeeded? | ✅ **Payment Success Rate** | High | Current | Subscription-collection reliability, same adopted denominator; shown as the card's second line. |
| AD-P03 | Which failure reason, provider, or method performs worst? | 🕓 Later | Medium | Partial | Becomes the drill-down under the rate once reason coverage is comparable. |
| AD-P04 | Which payments have remained pending longer than expected? | 🕓 Later | Future | Needs rule | "Pending too long" needs method-specific limits. |
| AD-P05 | How long does successful payment normally take? | 📄 Report / drill-down | Low | Current | Timestamps can describe completion time. |
| AD-P06 | Which refunds, late captures, or orphan payment records need reconciliation? | 🕓 Later | High | Partial | Money-integrity detection and ownership are not yet governed. |

### In plain language

- **AD-P01 / AD-P02 — the denominator problem, and how rule 3 solves it.** The hard part of a success rate is deciding what counts as an attempt. Many attempts die ambiguously: the buyer closes the checkout, a provider callback never arrives. If those count as failures the rate looks artificially bad; if ignored, artificially good. Rule 3 counts only attempts with a **terminal outcome** (clearly succeeded or clearly failed) and reports long-pending attempts separately as *pending-stale* — visible, but never polluting the rate.
- **AD-P03 — why the provider comparison waits.** If provider A records detailed failure reasons and provider B doesn't, a "worst provider" ranking punishes honesty, not performance. The comparison joins when reason coverage is comparable across providers/methods.
- **AD-P06 — what an "orphan" payment is.** A capture that succeeds *after* its order expired or was cancelled: real money arrived with no valid sale attached. Angkoro auto-refunds these, but detecting every case, tracking refunds-in-flight, and naming who resolves stuck ones is money-integrity work that needs an owner and a workflow before it can be a queue.

## E. Payouts and bank verification

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-F01 | Which payout requests await processing? | ✅ **Payouts Awaiting Processing** | High | Current | Outstanding seller-money obligations — oldest first, aged against the adopted 2-business-day SLA. |
| AD-F02 | Which payouts are currently being processed? | 📄 Report / drill-down | Medium | Current | In-flight work belongs in the payout drill-down. |
| AD-F03 | Which payouts failed, and why? | ✅ **Failed Payouts** | High | Current | Recovery queue with safe reasons; closed only by explicit disposition (rule 7). |
| AD-F04 | How long does a successful payout normally take? | ➡️ Inside payout queues | High | Current | Answered by adopted rule 4 — the SLA that powers age and due-soon chips. |
| AD-F05 | How much payout value was completed, by currency? | 📄 Report / drill-down | Medium | Current | Throughput context per currency. |
| AD-F06 | Which payout bank accounts await verification? | ✅ **Bank Accounts Awaiting Verification** | High | Current | Verification work that blocks payouts, aged against the adopted 1-business-day SLA; safe details only. |
| AD-F07 | Which bank accounts were rejected or disabled? | 📄 Report / drill-down | Medium | Current | Rejection patterns reveal recurring verification issues. |
| AD-F08 | Does every wallet balance reconcile with its ledger? | ✅ **Wallet–Ledger Reconciliation** | High | Current | Warns only on mismatch; a passing check is not accounting certification. |

### In plain language

- **AD-F01 — why this queue is the platform's most direct trust obligation.** A payout request is a seller asking for *their own money*. Every hour it waits is Angkoro holding someone else's cash. The audit found the admin side can act on a payout by ID but has **no platform-wide work queue** — that queue is the build item, with the adopted 2-business-day SLA making "late" a defined fact instead of a feeling.
- **AD-F06 — mostly already built.** A safe admin queue exists (`status=PENDING`, last-four-digits projection, count metadata). Two things are missing: **oldest-first server sorting** (it currently returns newest first — the wrong order for working a backlog) and the SLA aging display. Full account-number reveal stays behind step-up authentication with audit logging.
- **AD-F08 — wallet–ledger reconciliation, explained from zero.** Angkoro stores money truth twice, on purpose. Each store wallet holds a **balance** — one number, fast to read, used everywhere. Separately, every money movement (sale settlement, refund, payout, fee) is written as **double-entry ledger lines** — the accounting-grade trail of *why* the balance is what it is. By construction, a wallet's balance must equal the sum of its ledger lines. The reconciliation check recomputes each balance from the ledger and compares. **If they disagree, money was created or destroyed on paper** — a bug, a missed write, or manipulation — and the affected wallet's payouts must stop *before* investigation, because paying out against a wrong balance turns a data bug into real lost money. A passing check means the two systems agree operationally; it is not a certified audit of the books.

## F. Users, stores, safety, and support

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-U01 | How many new users joined Angkoro? | 📄 Report / drill-down | Low | Current | User growth is context, not platform paid health. |
| AD-U02 | How are users distributed across account states? | 📄 Report / drill-down | Medium | Current | Account-health navigation for investigation. |
| AD-U03 | Which users have remained unverified longer than the adopted limit? | 🕓 Later | Future | Needs rule | Needs a verification-age threshold and owner action. |
| AD-U04 | Which users or stores are suspended or banned? | 📄 Report / drill-down | Medium | Current | Safety-enforcement visibility. |
| AD-U05 | Which reports, appeals, or support cases await review? | 🕓 Later | Future | Gap | No authoritative support/report workflow exists yet. |
| AD-U06 | Can every sensitive admin action be traced to admin, time, reason, and result? | 🕓 Later | High | Partial | Queue dispositions (rule 7) now create audit rows for queue actions; the complete audit surface across all sensitive actions remains build work. |

### In plain language

This section mostly fails the **"every KPI must connect to a decision"** test rather than a data test:

- **AD-U01 / U02 / U04 — real data, wrong altitude.** User counts, account-state distributions, and suspension lists are things an admin *consults during* an investigation, not things that change what they do today. They belong in the Stores/Users management pages. Putting a "suspended stores: 12" card on the overview with no attached action would be decoration.
- **AD-U03 — adoptable later, like the SLAs.** It needs two decisions: how old is "too long unverified," and who acts on the list. The moment both exist, this becomes a legitimate queue — it simply wasn't in the first cut because nobody owns the outreach today.
- **AD-U05 — you can't show a queue for a system that doesn't exist.** There is no support/case/appeal workflow in the product. Building the workflow comes first; its queue joins the dashboard after.
- **AD-U06 — mandatory, but it's a capability, not a metric.** Accountability means every sensitive admin action (reveal bank details, process payout, suspend store) leaves a who/when/why/result trail. The audit found only *some* actions preserve this. Note it did not come away empty-handed: **adopted rule 7 is the first real slice** — every queue disposition now generates exactly that trail. The full audit entity across all sensitive actions remains engineering work, and until it exists no dashboard can honestly claim "all actions are traceable."

## G. Onboarding, Telegram, plans, and features

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-O01 | Which store-onboarding operations failed? | 🔔 **Failed Onboarding** alert | Medium | Current | Failures are rare and transient — an alert when one occurs beats a permanently empty queue. |
| AD-O02 | Which onboarding operations stopped progressing? | 🕓 Later | Future | Needs rule | Silent stalls need per-stage age limits and an escalation owner. |
| AD-O03 | At which onboarding step do businesses stop most often? | 🕓 Later | Future | Gap | Step conversion needs immutable transition events. |
| AD-O04 | How long does successful onboarding normally take? | 📄 Report / drill-down | Low | Partial | Current timestamps describe only limited duration behavior. |
| AD-O05 | Which requested or connected Telegram setups are unhealthy? | 📄 Report / drill-down | Medium | Current | Channel-health list for investigation. |
| AD-O06 | Are active plans mapped to the intended features and limits? | ✅ **Plan Entitlement Integrity** | High | Current | Warns only when paid access and configured entitlements disagree, against the approved catalog. |
| AD-O07 | Which stores are reaching or exceeding plan limits? | 🕓 Later | Future | Partial | Needs governed usage measures and intervention rules. |

### In plain language

- **AD-O01 — why an alert, not a queue.** An onboarding failure is typically a webhook timeout or a duplicate slug: it happens, gets fixed once, and is gone. A permanent queue card would sit at zero most days, training admins to ignore the whole section. A conditional alert appears exactly when a failure exists and disappears when resolved. The guardrail: only *explicit* failures trigger it — an operation that is merely old or slow must not be labeled failed (that's AD-O02's separate, rule-needing question).
- **AD-O06 — entitlement drift, explained.** The plan catalog says what each plan *should* include; the live configuration says what each store *actually* gets. The two drift through bad deploys and manual edits — in one direction a paying store misses features it paid for (trust failure), in the other a store gets features free (revenue leak). The check compares live entitlements against the approved catalog and warns only on mismatch. Key rule: never infer "intended" limits from what stores are observed doing — the catalog is the truth.
- **AD-O03 vs AD-O01** — "where do stores stall *statistically*" needs immutable step-transition events to compute honestly; "which operation *failed right now*" only needs current state. Same theme, very different data readiness.

## H. Platform reliability and data quality

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-R01 | Is the Angkoro API available, fast enough, and within an acceptable error rate? | ➡️ Inside **System Status** | High | Partial | v1 signal: liveness + Sentry error rate; a governed SLA series remains later work. |
| AD-R02 | Which background jobs are failing or stuck? | ➡️ Inside **System Status** | High | Partial | v1 signal: failed/stuck job counts from the queue system. |
| AD-R03 | Are database, Redis, server, or disk resources near capacity? | 🕓 Later | High | Gap | Needs external infrastructure telemetry; System Status shows this facet as Not connected. |
| AD-R04 | Did the latest database backup complete successfully? | 🕓 Later | High | Gap | Backup evidence lives in deployment infrastructure; shown as Not connected until integrated. |
| AD-R05 | Which payment webhooks failed or could not be matched? | ➡️ Inside **System Status** | High | Partial | v1 signal: failed/unmatched callback count — callback records already exist. |
| AD-R06 | Is dashboard data current, complete, and based on the full population? | ✅ **Dashboard Data Trust** | High | Current | Freshness and completeness state; missing data is Unknown, never zero or healthy. |
| AD-R07 | Do independently recomputed totals reconcile with authoritative sources? | ✅ **Source & Financial Reconciliation** | High | Current | An independent check the dashboard cannot run on itself; absent or stale shows Unknown / Not connected, never Passed. |

### In plain language

- **Why R01/R02/R05 became one chip.** The admin's real question is *"is the platform mechanically working?"* — one answer, three v1 signals that all exist today in some form: Sentry error capture + the liveness probe (R01), the job queue's failed/stuck counts (R02 — these jobs run auto-cancellation and settlement, so a stuck queue silently stops the business), and the payment-callback table's failure records (R05). Webhooks matter most: when provider callbacks fail or don't match, payment and payout state stalls *silently* — it's the early warning that usually precedes a visible Payment Success Rate drop.
- **Why R03/R04 stay out but visible.** Capacity metrics and backup evidence live in infrastructure outside the application — nothing in the codebase can report them. The System Status drawer lists them as **Not connected** so their absence is a visible fact, not a silent hole. An unverified backup means unproven recovery; that's why R04 is High priority despite being unbuildable today.
- **AD-R06 — the meta-status.** Data Trust reports on the dashboard itself: is what you're looking at fresh, complete, and computed over the full population? It sits beside the page heading because it qualifies every other number on the screen.
- **AD-R07 vs AD-F08 — two reconciliations, different jobs.** Wallet–Ledger (F08) checks that two *internal money systems* agree with each other. Source & Financial Reconciliation (R07) checks that **the dashboard's own displayed totals** agree with an independent recomputation from raw records — it catches aggregation bugs, cache staleness, and population errors in the dashboard pipeline itself. The principle: a served query cannot certify itself; the checker must be a separate computation. Until that independent job exists and completes, this chip shows Not connected — it can never display "Passing" as a default.

## I. Security, abuse, and incidents

**Why this section matters most in this record:** every question below is **High priority, and none is on the dashboard.** That is not a contradiction — it is the honesty rule applied where it costs the most. Security has an asymmetry the other sections don't: a false **"no attacks"** is far more dangerous than an honest **"we can't see attacks yet,"** because it invites relaxation exactly where vigilance is needed. Angkoro today has *defenses* (rate limiting, IP lockouts, step-up auth) but almost no durable security *visibility* — and defenses are not visibility. The dashboard therefore shows security as **Not connected**, which is the only true security status the platform can display. This also follows how mature platforms work: Cloudflare routes security events to a dedicated investigation surface rather than overview cards, Sentry groups raw events into triaged issues, and NIST treats incident response as a workflow (prepare → detect → respond → recover), not a counter.

| ID | Question | Verdict | Priority | Data | Why |
|---|---|---|---|---|---|
| AD-X01 | Is the public website or API receiving abnormal or attack traffic? | 🕓 Later | High | Gap | No durable request baseline or WAF feed exists. |
| AD-X02 | Which authentication endpoints and IPs triggered repeated failures or lockouts? | 🕓 Later | High | Partial | Temporary Redis counters are not a durable admin queue. |
| AD-X03 | Which active sessions show unusual IP or user-agent changes? | 🕓 Later | High | Partial | Needs governed anomaly rules and a response workflow. |
| AD-X04 | Which WAF or edge-security alerts require investigation? | 🕓 Later | High | Gap | No edge-security feed is integrated. |
| AD-X05 | Which users, stores, payments, or payouts show unusual behavior? | 🕓 Later | High | Needs rule | Baselines, severity, ownership, and false-positive controls are unresolved. |
| AD-X06 | Which security incidents remain unresolved? | 🕓 Later | High | Gap | No authoritative incident workflow exists. |

### In plain language — the full case, question by question

- **AD-X01 — attack traffic.** *What exists:* request throttling with stricter presets on payment endpoints — a defense that blocks abuse but records no durable history of it. *What's missing:* a baseline of normal traffic and a feed of blocked/flagged requests. Without a baseline, "abnormal" is undefined; a tile would be guessing. *Unblock:* put an edge/WAF product (e.g., Cloudflare) in front of the platform — its security-events console becomes the investigation surface, and a summary of it can then honestly reach this dashboard.
- **AD-X02 — authentication abuse.** *What exists:* IP-based lockouts — but as **temporary Redis counters** that expire by design, plus log lines. An admin queue needs history: which IPs, which endpoints, how often, over what window. Reading expiring counters gives a partial "right now" that vanishes — useless for spotting a slow credential-stuffing campaign. *Unblock:* persist lockout events to a durable table. This is the **cheapest build in the whole section** — one table and a writer — and it's the one I'd do first.
- **AD-X03 — suspicious sessions.** *What exists:* sessions store IP, user agent, channel, and last-use — genuine raw material. *What's missing:* the rules that make "unusual" mean something (people legitimately switch networks and devices constantly), a privacy-safe way to show session data to admins, and a response workflow. Shipping this without governance produces either noise that trains admins to ignore it, or false accusations against legitimate users — both worse than waiting.
- **AD-X04 — WAF/edge alerts.** No WAF exists, so there are no alerts to show. This is purely an integration decision — the same one that unblocks X01.
- **AD-X05 — behavioral anomalies (fraud/abuse).** The deepest question: unusual money movement, order patterns, account behavior. It needs baselines ("usual" per store), severity tiers, false-positive controls, and a named owner for review — because an anomaly flag is a *suspicion generator*, and suspicion without process becomes either ignored noise or unfair enforcement. The pack's adopted decision 9 draws exactly this line: an anomaly signal is never proof of fraud, abuse, or compromise. Governance first, then detection.
- **AD-X06 — unresolved incidents.** An incident count presupposes an incident *process*: someone can declare one, assign severity and an owner, track it, and close it. None of that exists. A hardcoded "Incidents: 0" would be the single most dangerous number the dashboard could display — it claims a process that isn't there. *Unblock:* adopt even a minimal incident workflow (a table, three severities, an owner field); the count becomes real the day the process does.

**The one-sentence summary for the lead:** *Angkoro's security posture today is "defended but not observed" — the dashboard says so honestly with Not connected, and this record names the exact, mostly small, build steps (durable lockout table, WAF integration, minimal incident workflow) that convert each question from Later to live.*

---

## Count check

- **67 questions** — every ID appears exactly once above.
- **15 dashboard items:** 15 questions Selected (✅), 8 combined into them (➡️), 1 conditional alert (🔔).
- Everything else: 21 report/drill-down (📄, including AD-M01 in Finance), 22 later (🕓).
- Security (all six AD-X), infrastructure capacity/backups, support workflow, and COD collection failure remain **explicit planned boundaries** — represented honestly as Not connected or absent, never as healthy.

For what each approved item means, its decision, cadence, and healthy/danger signals, see [03_Dashboard_Content.md](03_Dashboard_Content.md).
