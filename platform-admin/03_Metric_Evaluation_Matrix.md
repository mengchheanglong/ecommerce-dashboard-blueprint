# Platform Admin Metric Evaluation Matrix

This document records the evaluation of all **67 platform administration questions**, determining which measures earn placement on the primary executive dashboard versus drill-down investigation surfaces or future roadmap iterations.

---

## 1. Operating Rules & Metric Governance

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

## 2. Evaluation Taxonomy

### 2.1 Verdict Categories
- ✅ **Dashboard Core:** Displayed prominently on the primary platform overview.
- ➡️ **Sub-indicator / Component:** Displayed inside a primary card (e.g., secondary delta, sparkline, or sort rule).
- 🔔 **Conditional Alert:** Visible only when an operational failure or threshold breach occurs.
- 📄 **Drill-down / Report:** Accessible in specialist sub-pages (e.g., store directory, finance ledger).
- 🕓 **Roadmap / Later:** High value, but blocked pending schema instrumentation or policy definition.

### 2.2 Data Readiness Levels
- **Current Data:** Authoritative fields verified in production schema.
- **Partial:** Relational structure exists; requires index, event tag, or aggregation query.
- **Needs Rule:** Data exists; requires stakeholder policy signoff (e.g., SLA threshold).
- **Gap:** Event logging or ingestion pipeline required.

---

## 3. Comprehensive Evaluation Matrix

### Category A: Platform Growth & Store Activity

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-G01** | Total active stores | ➡️ Component | High | Current Data | Included as supporting context under Active Paid Stores. |
| **AD-G02** | Active paid stores | ✅ Dashboard Core | High | Current Data | **Primary KPI 1.** Measures core paying tenant footprint and platform scale. |
| **AD-G03** | New stores created & activated | ➡️ Component | High | Current Data | Step 1 in the **Store Activation Funnel** card. |
| **AD-G04** | Store activation rate (%) | ➡️ Component | Medium | Current Data | Conversion metric between Step 1 and Step 2 of the activation funnel. |
| **AD-G05** | Stores reaching first paid order | ➡️ Component | High | Current Data | Step 2 in the **Store Activation Funnel** card (core Time-to-Value milestone). |
| **AD-G06** | Days to first paid order | 📄 Report | Medium | Needs Rule | Belongs in Cohort & Activation deep-dive analytics. |
| **AD-G07** | Active stores with zero recent orders | 📄 Report | Medium | Current Data | Lives in the Store Directory filtered view for merchant success outreach. |
| **AD-G08** | Multi-channel adoption rate (%) | 📄 Report | Low | Current Data | Feature adoption telemetry in the integrations report. |

---

### Category B: Platform Commerce Activity & GMV

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-C01** | Total valid Paid Orders | ➡️ Component | High | Current Data | Secondary headline number inside the **Platform Paid Sales & Orders** card. |
| **AD-C02** | Total valid Paid Sales (GMV) | ✅ Dashboard Core | High | Current Data | **Primary KPI 3.** Total platform economic volume, segregated by currency. |
| **AD-C03** | Order decision backlog across stores | 📄 Report | Medium | Current Data | Aggregate store health; surfaced in the Merchant Issues detail view. |
| **AD-C04** | Unfulfilled prepaid order backlog | 📄 Report | Medium | Current Data | Surfaced in Order Issues and merchant risk reviews. |
| **AD-C05** | Expired checkout sessions | 📄 Report | Low | Current Data | Checkout funnel diagnostic on the payment provider performance page. |
| **AD-C06** | Top stores by order volume | 📄 Report | Medium | Current Data | Ranked leaderboard on the Store Analytics deep-dive page. |
| **AD-C07** | Auto-cancelled orders (decision timeout) | 🔔 Conditional Alert | Medium | Current Data | Alerts operators if a spike in merchant timeouts occurs across multiple stores. |
| **AD-C08** | Cash-on-Delivery (COD) failure rate | 📄 Report | Medium | Partial | Diagnostic on the payment risk analysis page. |

---

### Category C: Subscriptions & Platform Monetization

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-S01** | Subscription cash collections | ✅ Dashboard Core | High | Current Data | **Primary KPI 2.** Authoritative SaaS subscription collections in the period. |
| **AD-S02** | Paid stores by subscription plan | 📄 Report | Medium | Current Data | Plan distribution chart in the Subscription Billing module. |
| **AD-S03** | Stores reaching first paid subscription | ➡️ Component | High | Current Data | Included as positive inflow in Active Paid Stores net change (+). |
| **AD-S04** | Active free trials count | 📄 Report | Medium | Current Data | Top-of-funnel conversion pipeline in Billing Reports. |
| **AD-S05** | Trial conversion rate (%) | 📄 Report | Medium | Current Data | Conversion metric in the Monthly SaaS Performance report. |
| **AD-S06** | Trials ending in next 7 days | 📄 Report | Medium | Current Data | Outreach list for sales/concierge onboarding reps. |
| **AD-S07** | Expiring plans inside notice window | ✅ Action Queue | High | Current Data | **Queue 4 (Plans Expiring Soon).** Operator queue for renewal follow-ups. |
| **AD-S08** | Stores pending first plan payment | 📄 Report | Low | Current Data | Onboarding staging table in Store Directory. |
| **AD-S09** | Contracted MRR baseline | ➡️ Component | High | Current Data | Primary recurring revenue metric displayed alongside cash collections. |
| **AD-S10** | Subscription churn rate (%) | ➡️ Component | High | Current Data | Subtracted in Active Paid Stores net change (-). |
| **AD-M01** | Operational platform fee revenue | 📄 Report | Medium | Needs Rule | Lives in Financial Ledger reporting once non-zero take rates activate. |

---

### Category D: Payment Gateway & Checkout Reliability

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-P01** | Checkout payment success rate (%) | ✅ Dashboard Core | High | Current Data | **Primary KPI 4.** Core gateway checkout health indicator. |
| **AD-P02** | Subscription billing success rate (%) | 📄 Report | High | Current Data | Displayed in Subscription Billing health tab. |
| **AD-P03** | Gateway & payment method failure breakdown | 📄 Report | High | Partial | Gateway error code diagnostic drawer. |
| **AD-P04** | Stale pending payments (>24h) | 🔔 Conditional Alert | Medium | Current Data | Visible in System Status when webhook capture delays exceed normal bounds. |
| **AD-P05** | Payment capture latency (p50/p95) | 📄 Report | Low | Gap | Infrastructure performance metric in telemetry dashboard. |
| **AD-P06** | Orphan payment records needing audit | 📄 Report | Medium | Partial | Financial reconciliation workbench. |

---

### Category E: Merchant Payouts & Settlement Verification

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-F01** | Payout requests awaiting processing | ✅ Action Queue | High | Current Data | **Queue 1 (Payouts Awaiting Processing).** Sorted oldest first, with SLA timer. |
| **AD-F02** | In-flight processing payouts | ➡️ Component | Medium | Current Data | Sub-counter inside Payout Queue header. |
| **AD-F03** | Failed payouts requiring retry | ✅ Action Queue | High | Current Data | **Queue 2 (Failed Payouts).** Action queue for resolving banking errors. |
| **AD-F04** | Payout completion duration | ➡️ Component | Medium | Current Data | Drives the SLA color-coding threshold on Queue 1. |
| **AD-F05** | Disbursed payout volume by currency | 📄 Report | Medium | Current Data | Total outbound liquidity chart in Settlements module. |
| **AD-F06** | Bank accounts awaiting verification | ✅ Action Queue | High | Current Data | **Queue 3 (Bank Accounts Awaiting Verification).** KYC approval backlog. |
| **AD-F07** | Rejected or disabled bank accounts | 📄 Report | Low | Current Data | Audit history in Settlement Accounts tab. |
| **AD-F08** | Wallet-to-Ledger reconciliation check | ✅ Trust Chip | High | Current Data | **Trust Chip 1.** Displays green when balance matches ledger; red alert if variance. |

---

### Category F: Users, Identity, Safety & Support

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-U01** | Total registered users | 📄 Report | Low | Current Data | Executive user growth metric in Directory tab. |
| **AD-U02** | User status distribution | 📄 Report | Low | Current Data | Segmentation bar in User Directory. |
| **AD-U03** | Stale unverified accounts | 📄 Report | Low | Current Data | Periodic cleanup queue in User Admin. |
| **AD-U04** | Active suspensions & bans | 📄 Report | Medium | Current Data | Flagged roster in Security & Directory modules. |
| **AD-U05** | Open support cases & appeals | ✅ Action Queue | High | Current Data | **Queue 5 (Support Cases Awaiting Triage).** Support SLA tracker. |
| **AD-U06** | Administrative action auditability | ✅ Trust Chip | High | Current Data | **Trust Chip 2.** Verifies append-only audit log integrity and completeness. |

---

### Category G: Tenant Onboarding, Integrations & Feature Limits

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-O01** | Failed onboarding operations | 🔔 Conditional Alert | High | Current Data | **Conditional Alert 1.** Prominently alerts when automated tenant setup errors out. |
| **AD-O02** | Stalled onboarding setups | 📄 Report | Medium | Current Data | Triage list in Merchant Onboarding Concierge. |
| **AD-O03** | Onboarding step drop-off analysis | 📄 Report | Medium | Partial | Funnel analytics in Product Analytics module. |
| **AD-O04** | Mean time to store launch | 📄 Report | Low | Current Data | Product efficiency KPI in Monthly Ops review. |
| **AD-O05** | Failing webhooks & sales channels | 📄 Report | Medium | Current Data | Integration health diagnostic in Developer Settings. |
| **AD-O06** | Plan entitlement integrity | ✅ Trust Chip | High | Current Data | **Trust Chip 3.** Automated daily scan ensuring store feature flags match plan tier. |
| **AD-O07** | Stores approaching plan quotas | 📄 Report | Medium | Current Data | Upsell target report for Sales/Account Management. |

---

### Category H: Platform Reliability, Background Queues & Data Trust

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-R01** | Core API availability & error rate | ✅ Trust Chip | High | Current Data | **Trust Chip 4 (System Status).** Real-time API uptime and error rate indicator. |
| **AD-R02** | Failing background worker jobs | ➡️ Component | High | Current Data | Factor inside System Status chip; opens dead-letter queue (DLQ) drawer. |
| **AD-R03** | Infrastructure capacity limits | 📄 Report | Medium | Partial | Managed via cloud monitoring (Datadog/CloudWatch) with critical webhook hook. |
| **AD-R04** | Database backup snapshot status | ➡️ Component | High | Current Data | Factor inside System Status chip; alerts if snapshot >24h old. |
| **AD-R05** | Unmatched payment webhooks | ➡️ Component | High | Current Data | Factor inside System Status chip; links to Webhook Triage drawer. |
| **AD-R06** | Dashboard data freshness & trust | ✅ Trust Chip | High | Current Data | **Trust Chip 5 (Data Trust).** Visual timestamp indicating pipeline sync lag. |
| **AD-R07** | Financial reconciliation verification | ✅ Trust Chip | High | Current Data | **Trust Chip 6 (Financial Audit).** Nightly automated batch audit status. |

---

### Category I: Security, Abuse, Fraud & Incidents

| ID | Question | Verdict | Priority | Data Readiness | Rationale & Placement |
|---|---|---|---|---|---|
| **AD-X01** | Edge attack traffic / DDoS | 📄 Report | High | Partial | Edge WAF console; critical alerts trigger System Status banner. |
| **AD-X02** | Brute-force auth failures / lockouts | 📄 Report | Medium | Current Data | Security Audit Log filter in User Security module. |
| **AD-X03** | Suspicious session IP/agent shifts | 📄 Report | Medium | Partial | Real-time session anomaly alerts in Security module. |
| **AD-X04** | WAF & bot mitigation alerts | 📄 Report | Low | Partial | Security operations center (SOC) deep-dive. |
| **AD-X05** | Transaction velocity fraud anomalies | 📄 Report | High | Needs Rule | Fraud prevention queue in Risk module. |
| **AD-X06** | Active security incidents | 🔔 Conditional Alert | High | Current Data | Global red incident banner on dashboard when severity = SEV-1. |
