# Platform Admin Metrics & Decision Questions

This register catalogs the complete set of **67 distinct operational and executive questions** evaluated when designing an e-commerce platform administration dashboard.

---

## Question Taxonomy

The questions are organized across 9 core operational categories:

- **A. Platform Growth & Store Activity** (8 questions)
- **B. Platform Commerce Activity & GMV** (8 questions)
- **C. Subscriptions & Platform Monetization** (11 questions)
- **D. Payment Gateway & Checkout Reliability** (6 questions)
- **E. Merchant Payouts & Settlement Verification** (8 questions)
- **F. Users, Identity, Safety & Support** (6 questions)
- **G. Tenant Onboarding, Integrations & Feature Limits** (7 questions)
- **H. Platform Reliability, Background Queues & Data Trust** (7 questions)
- **I. Security, Abuse, Fraud & Incidents** (6 questions)

---

## Category A: Platform Growth & Store Activity

Questions evaluating store activation velocity, paid subscription health, and store operating activity.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-G01** | How many stores are active and allowed to operate on the platform? | Platform scale & aggregate tenant capacity. |
| **AD-G02** | How many stores currently have valid paid access? | Core paid customer base; denominator for paid retention. |
| **AD-G03** | How many new stores were created and activated in the current period? | Top-of-funnel tenant acquisition velocity. |
| **AD-G04** | What percentage of created stores successfully reach activated status? | Onboarding conversion efficiency. |
| **AD-G05** | How many stores reached their first valid paid order in the period? | Core platform value milestone (Time-to-Value). |
| **AD-G06** | How long does a new store take to reach its first valid paid order? | Onboarding friction and activation lag. |
| **AD-G07** | Which active stores have zero recent paid orders? | At-risk / dormant merchant identification. |
| **AD-G08** | What percentage of active stores have external sales channels/integrations enabled? | Feature adoption and platform stickiness. |

---

## Category B: Platform Commerce Activity & GMV

Questions evaluating transaction volume and gross merchandise value across all hosted storefronts.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-C01** | How many valid Paid Orders occurred across the platform? | Total transaction volume and processing load. |
| **AD-C02** | What valid Paid Sales (GMV) occurred across the platform, by currency? | Ecosystem economic scale and platform throughput. |
| **AD-C03** | How is the merchant order-decision backlog distributed across stores? | Detection of merchant fulfillment bottlenecks. |
| **AD-C04** | How many accepted prepaid orders currently await fulfillment across the platform? | Aggregate unfulfilled customer liability. |
| **AD-C05** | How many checkout sessions expired before payment completed? | Checkout abandonment and checkout gateway friction. |
| **AD-C06** | Which stores produced the highest volume of valid Paid Orders? | Power-merchant concentration and volume distribution. |
| **AD-C07** | How many orders auto-cancelled because merchants missed decision deadlines? | Merchant unresponsiveness impact on shoppers. |
| **AD-C08** | What percentage of Cash-on-Delivery (COD) orders failed cash collection? | In-flight collection failure and delivery return risk. |

---

## Category C: Subscriptions & Platform Monetization

Questions tracking SaaS recurring revenue, subscription billing, plan distribution, and renewals.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-S01** | How much subscription plan cash was collected in the period, by currency? | Realized cash collections from platform fees/plans. |
| **AD-S02** | How are Active Paid Stores distributed across subscription tiers? | Plan tier mix and pricing tier performance. |
| **AD-S03** | How many stores upgraded to their first paid subscription period? | Free-to-paid conversion milestone. |
| **AD-S04** | How many stores are currently in an active free trial? | Pipeline for upcoming subscription conversions. |
| **AD-S05** | What percentage of expiring trials converted to a paid subscription plan? | Trial-to-paid conversion rate. |
| **AD-S06** | Which store trials expire in the next 7 days? | Targeted renewal reminders and concierge outreach. |
| **AD-S07** | Which subscription renewals are inside their notice window? | Proactive payment method update prompts. |
| **AD-S08** | Which stores are awaiting payment verification before activation? | Subscription onboarding queue management. |
| **AD-S09** | What is the total value of active prepaid plan commitments (Contracted MRR)? | Forward recurring revenue baseline. |
| **AD-S10** | What percentage of paid stores churned or lapsed at period end? | Platform subscription churn rate. |
| **AD-M01** | What operational platform fee revenue was recognized, by currency and source? | Non-subscription platform revenues (take rates, withdrawal fees). |

---

## Category D: Payment Gateway & Checkout Reliability

Questions tracking payment processing reliability, gateway latencies, and transaction reconciliation.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-P01** | What percentage of product payment attempts succeeded at checkout? | Primary payment checkout conversion health. |
| **AD-P02** | What percentage of subscription billing payment attempts succeeded? | SaaS recurring billing health. |
| **AD-P03** | Which payment gateway, provider, or method exhibits the highest failure rate? | Upstream gateway outage or degradation detection. |
| **AD-P04** | Which payments have remained pending longer than standard gateway windows? | Stuck transaction investigation backlog. |
| **AD-P05** | What is the p50 and p95 latency for successful payment capture? | Payment pipeline performance and user checkout latency. |
| **AD-P06** | Which refunds, late captures, or orphan payment records require reconciliation? | Financial integrity and escrow reconciliation backlog. |

---

## Category E: Merchant Payouts & Settlement Verification

Questions managing platform financial liability, payout approvals, and merchant bank account verification.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-F01** | Which merchant payout requests currently await administrative review? | Daily payout execution work queue. |
| **AD-F02** | Which payouts are currently being processed by banking/payment rails? | In-flight capital tracking. |
| **AD-F03** | Which payouts failed during processing, and for what reason? | Payout retry and banking error resolution. |
| **AD-F04** | What is the average duration from payout request to confirmed settlement? | Payout SLA efficiency for merchant cash flow. |
| **AD-F05** | What total payout volume was successfully disbursed, by currency? | Platform outbound financial liquidity volume. |
| **AD-F06** | Which merchant bank accounts currently await KYC verification? | New seller onboarding approval queue. |
| **AD-F07** | Which bank accounts were rejected or disabled, and why? | Fraud prevention and compliance auditing. |
| **AD-F08** | Does every merchant wallet balance strictly reconcile with its underlying ledger? | Core financial ledger integrity check. |

---

## Category F: Users, Identity, Safety & Support

Questions covering user governance, account safety, support ticket operations, and operator accountability.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-U01** | How many new user accounts were registered across the platform? | Ecosystem user growth. |
| **AD-U02** | How are users distributed across active, unverified, suspended, and banned states? | Platform health and user risk segmentation. |
| **AD-U03** | Which user accounts have remained unverified past the policy threshold? | Inactive account cleanup. |
| **AD-U04** | Which user accounts or stores are currently restricted, suspended, or banned? | Platform safety enforcement and compliance roster. |
| **AD-U05** | Which support tickets, appeals, or compliance reports await review? | Operator support backlog and customer response SLA. |
| **AD-U06** | Can every sensitive administrative action be traced to admin, time, reason, and prior state? | Immutable compliance and operator accountability. |

---

## Category G: Tenant Onboarding, Integrations & Feature Limits

Questions tracking merchant onboarding funnels, third-party integration health, and plan tier quota consumption.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-O01** | Which store onboarding provisioning workflows encountered errors? | Technical onboarding exception triage. |
| **AD-O02** | Which onboarding workflows stalled without completing setup? | Onboarding drop-off intervention. |
| **AD-O03** | At which specific step in the onboarding wizard do merchants abandon most frequently? | UX funnel optimization. |
| **AD-O04** | What is the average duration for a merchant to complete initial store setup? | Time-to-launch efficiency. |
| **AD-O05** | Which connected sales channels or custom webhook endpoints are failing? | External integration health monitoring. |
| **AD-O06** | Are active store entitlements and feature limits synchronized with their billing plan? | Entitlement billing consistency audit. |
| **AD-O07** | Which stores are approaching or exceeding plan limits (e.g., product count, monthly orders)? | Upsell opportunities and quota enforcement. |

---

## Category H: Platform Reliability, Background Queues & Data Trust

Questions monitoring infrastructure health, worker queues, database replication, and metric accuracy.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-R01** | Is the core platform API available, performant, and within error rate budgets? | System availability and SLA uptime. |
| **AD-R02** | Which asynchronous workers or background queues are failing or backing up? | Background processing health (emails, jobs, timeouts). |
| **AD-R03** | Are database, cache, or storage resources approaching capacity thresholds? | Proactive capacity planning. |
| **AD-R04** | Did the most recent database backup snapshot complete and verify successfully? | Disaster recovery readiness. |
| **AD-R05** | Which payment gateway webhooks failed signature verification or failed to match an order? | Data synchronization and orphan intent tracking. |
| **AD-R06** | Is dashboard telemetry current, complete, and calculated from authoritative source records? | Metric data freshness and trust assurance. |
| **AD-R07** | Do aggregated analytics totals independently reconcile with double-entry ledger accounts? | Financial data integrity verification. |

---

## Category I: Security, Abuse, Fraud & Incidents

Questions protecting the platform from automated attacks, credential abuse, and fraudulent activity.

| ID | Question | Operational Purpose |
|---|---|---|
| **AD-X01** | Is the platform currently receiving abnormal traffic volumes or DDoS patterns? | Edge security and perimeter defense. |
| **AD-X02** | Which authentication endpoints or IP addresses are triggering repeated brute-force lockouts? | Credential stuffing and account takeover prevention. |
| **AD-X03** | Which active sessions display suspicious IP address or user-agent shifts? | Session hijacking detection. |
| **AD-X04** | Which Web Application Firewall (WAF) or bot mitigation alerts require investigation? | Edge threat monitoring. |
| **AD-X05** | Which stores, payments, or payout requests exhibit anomalous velocity or fraud indicators? | Financial fraud and merchant risk mitigation. |
| **AD-X06** | Which high-severity security or operational incidents currently remain open? | Incident response tracking. |
