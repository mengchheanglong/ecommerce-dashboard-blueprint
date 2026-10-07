# Platform Administration Telemetry & Metric Evaluation Matrix

This document records the evaluation of all **67 platform administration questions**, establishing why and how metrics are incorporated into the platform administration system.

---

## 1. Operating Rules for Platform Administration

The following operating rules govern metric calculations and unblock ambiguous data models:

| # | Operating Rule | Adopted Specification | Unblocks |
|---|---|---|---|
| **R1** | **Confirmed Subscription Collection** | Subscription cash is recognized only when an invoice is fully confirmed and linked to a verified tenant, plan period, currency, and gateway transaction ID. | AD-S01 |
| **R2** | **Subscription Expiry Event** | A tenant leaves the active paid base at the timestamp their prepaid period expires without a successful renewal invoice. | AD-S10 |
| **R3** | **Payment Attempt Denominator** | Payment success rate includes only intents that have reached a terminal status (`SUCCEEDED` or `FAILED`). Intents pending >24 hours are segregated as "Stale Pending". | AD-P01, AD-P02 |
| **R4** | **Payout SLA Target** | Merchant payout requests must be executed within 2 business days. Requests in the final 25% of this window are marked "Due Soon". | AD-F01, AD-F04 |
| **R5** | **KYC & Bank Verification SLA** | Submitted merchant settlement bank accounts must be reviewed within 1 business day. | AD-F06 |
| **R6** | **Renewal Notice Handling** | Expiring subscriptions are queued oldest-expiry first, flagging tenants inside their proactive notice window (default: 7 days). | AD-S07 |
| **R7** | **Queue Action Accountability** | Queue items cannot be dismissed without an explicit action (`Approve`, `Reject`, `Retry`, `Escalate`) recording actor ID, timestamp, and justification. | All Queues, AD-U06 |

---

## 2. The 15 Core Executive Dashboard Items

While specialist features manage their own deep reports, the **15 core items** on the executive platform overview are:

1. **Active Paid Stores:** Total stores with valid paid access (`+ Activated - Expired` net change).
2. **Subscription MRR & Collections:** Contracted MRR run-rate paired with cash collected in period.
3. **Platform Paid Sales & Orders (GMV):** Ecosystem transaction value and distinct orders, segregated by currency.
4. **Payment Gateway Success Rate:** Terminal checkout intents (`SUCCEEDED / (SUCCEEDED + FAILED)`).
5. **Store Activation Funnel:** Created ──► Activated ──► First Valid Paid Order.
6. **Bank Verification Queue:** Pending KYC submissions sorted oldest first with SLA timer.
7. **Payout Processing Queue:** Pending withdrawal requests sorted oldest first with SLA timer.
8. **Failed Payouts Queue:** In-flight banking transfer failures requiring manual retry/resolution.
9. **Plans Expiring Soon:** Active store plans within renewal notice window.
10. **Support Cases Awaiting Triage:** Open merchant tickets with response SLA timers.
11. **Failed Onboarding Alert:** Conditional alert badge when automated store provisioning errors out.
12. **System Health Chip:** Real-time API latency, background worker status, and Redis health.
13. **Wallet-Ledger Audit Chip:** Real-time verification that merchant wallet balances equal ledger totals.
14. **Plan Entitlement Audit Chip:** Daily automated check that store capabilities match their plan tier.
15. **Data Freshness Chip:** Continuous display of data pipeline sync timestamp.

---

## 3. Comprehensive Evaluation of all 67 Questions

### Category A: Platform Growth & Store Activity
- **AD-G01 (Total active stores):** Component under Active Paid Stores.
- **AD-G02 (Active paid stores):** **Dashboard Core (KPI 1).** Measures core paying tenant footprint.
- **AD-G03 (New stores created):** Stage 1 in Store Activation Funnel.
- **AD-G04 (Store activation rate):** Conversion metric in Activation Funnel.
- **AD-G05 (First paid order milestone):** Stage 3 in Store Activation Funnel.
- **AD-G06 (Days to first paid order):** Report in Tenant Cohort Analytics.
- **AD-G07 (Active stores with zero orders):** Filtered list in Store Directory for merchant success.
- **AD-G08 (Multi-channel adoption):** Telemetry report in Integrations module.

### Category B: Platform Commerce Activity & GMV
- **AD-C01 (Total valid Paid Orders):** Headline metric in Platform Commerce card.
- **AD-C02 (Total valid Paid Sales / GMV):** **Dashboard Core (KPI 3).** Segmented by currency.
- **AD-C03 (Order decision backlog across stores):** Aggregate health indicator in Store Management.
- **AD-C04 (Unfulfilled order backlog):** Risk metric in Merchant Risk module.
- **AD-C05 (Expired checkout sessions):** Gateway report in Payment Analytics.
- **AD-C06 (Top stores by volume):** Leaderboard report in Platform Analytics.
- **AD-C07 (Auto-cancelled orders):** Operational alert in Order Issues module.
- **AD-C08 (COD collection failure rate):** Diagnostic report in Payment Risk analysis.

### Category C: Subscriptions & Platform Monetization
- **AD-S01 (Subscription cash collections):** **Dashboard Core (KPI 2).** Authoritative cash collected.
- **AD-S02 (Plan tier distribution):** Plan breakdown in Subscription Billing module.
- **AD-S03 (Upgrades to first paid plan):** Net change addition (+) in Active Paid Stores.
- **AD-S04 (Active free trials):** Pipeline report in Billing module.
- **AD-S05 (Trial conversion rate):** Monthly SaaS reporting metric.
- **AD-S06 (Trials ending in 7 days):** Outreach queue for sales/concierge teams.
- **AD-S07 (Plans expiring inside notice window):** **Action Queue (Queue 4).**
- **AD-S08 (Stores pending first payment):** Staging table in Store Directory.
- **AD-S09 (Contracted MRR):** Headline recurring revenue metric beside cash collections.
- **AD-S10 (Subscription churn rate):** Net change subtraction (-) in Active Paid Stores.
- **AD-M01 (Platform fee revenue):** Ledger reporting when transaction commissions activate.

### Category D: Payment Gateway & Checkout Reliability
- **AD-P01 (Checkout payment success rate):** **Dashboard Core (KPI 4).** Terminal success rate.
- **AD-P02 (Subscription billing success rate):** Diagnostic in Subscription Billing module.
- **AD-P03 (Failure reasons by gateway/provider):** Diagnostic drawer in Payment Monitoring.
- **AD-P04 (Stale pending payments >24h):** Alert in System Status when webhooks lag.
- **AD-P05 (Payment capture latency):** Infrastructure latency chart in SRE telemetry.
- **AD-P06 (Orphan payment records needing audit):** Financial reconciliation workbench.

### Category E: Merchant Payouts & Settlement Verification
- **AD-F01 (Payouts awaiting processing):** **Action Queue (Queue 2).** Oldest first, 48h SLA.
- **AD-F02 (In-flight processing payouts):** In-flight sub-counter on Payout Queue.
- **AD-F03 (Failed payouts requiring retry):** **Action Queue (Queue 3).** Banking error resolution.
- **AD-F04 (Payout completion duration):** Drives SLA warning color codes.
- **AD-F05 (Disbursed payout volume):** Cumulative liquidity report in Settlements module.
- **AD-F06 (Bank accounts awaiting KYC verification):** **Action Queue (Queue 1).** Oldest first, 24h SLA.
- **AD-F07 (Rejected/disabled bank accounts):** Audit log in Settlement Accounts tab.
- **AD-F08 (Wallet-to-Ledger reconciliation):** **Trust Chip 2.** Halts payouts if unbalanced.

### Category F: Users, Identity, Safety & Support
- **AD-U01 (Total registered users):** Growth report in User Directory.
- **AD-U02 (User status distribution):** Segmentation bar in User Directory.
- **AD-U03 (Stale unverified accounts):** Periodic cleanup list in Identity Management.
- **AD-U04 (Suspensions and bans):** Flagged security roster in User Admin.
- **AD-U05 (Open support cases):** **Action Queue (Queue 5).** Support ticket triage queue.
- **AD-U06 (Administrative auditability):** **Trust Chip 3.** Verifies immutable audit log integrity.

### Category G: Tenant Onboarding, Integrations & Feature Limits
- **AD-O01 (Failed store onboardings):** **Conditional Alert 1.** Alerts when provisioning errors.
- **AD-O02 (Stalled onboarding setups):** Concierge intervention queue.
- **AD-O03 (Onboarding step drop-off):** UX funnel analysis report.
- **AD-O04 (Mean time to store launch):** Product performance KPI.
- **AD-O05 (Failing webhooks/integrations):** Health diagnostic in Developer Settings.
- **AD-O06 (Plan entitlement integrity):** **Trust Chip 4.** Daily check against unauthorized overrides.
- **AD-O07 (Stores approaching plan quotas):** Upsell report for account managers.

### Category H: Platform Reliability, Background Queues & Data Trust
- **AD-R01 (Core API availability):** **Trust Chip 1.** Real-time uptime and error rate indicator.
- **AD-R02 (Failing worker jobs):** Dead-letter queue (DLQ) diagnostic drawer.
- **AD-R03 (Infrastructure capacity):** Cloud infrastructure alerts.
- **AD-R04 (Database backup snapshot status):** Status check inside System Health chip.
- **AD-R05 (Unmatched payment webhooks):** Triage drawer in Payment Monitoring.
- **AD-R06 (Dashboard data freshness):** **Trust Chip 5.** Displays pipeline sync lag.
- **AD-R07 (Financial ledger audit):** Nightly automated double-entry verification check.

### Category I: Security, Abuse, Fraud & Incidents
- **AD-X01 (Edge attack traffic / DDoS):** Perimeter security console.
- **AD-X02 (Brute-force auth lockouts):** Security log filter in Identity Management.
- **AD-X03 (Suspicious session anomalies):** Anomaly alerts in Security module.
- **AD-X04 (WAF / bot mitigation alerts):** Security operations center (SOC) report.
- **AD-X05 (Transaction velocity fraud alerts):** Risk review queue in Payments.
- **AD-X06 (Active security incidents):** Global banner when high-severity incidents occur.
