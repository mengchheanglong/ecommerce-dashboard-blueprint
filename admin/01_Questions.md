# 1. Platform-Admin Question Register

**In one line:** every distinct platform-admin question considered before the dashboard was designed — 67 stable IDs and full questions only. Every decision and reason lives in [02_Evaluation.md](./02_Evaluation.md).

## How to use this register

- Scan the complete question set without reading evaluation detail.
- Use the stable ID to find the corresponding standalone evaluation in `02_Evaluation.md`.
- Use category headings to check whether an important decision area was omitted.
- Do not interpret the order of questions as a priority ranking.

## Page contents

- A. Platform growth and store activity (8 questions)
- B. Platform commerce activity (8 questions)
- C. Subscriptions and monetization (11 questions)
- D. Payment and checkout reliability (6 questions)
- E. Payouts and bank verification (8 questions)
- F. Users, stores, safety, and support (6 questions)
- G. Onboarding, Telegram, plans, and features (7 questions)
- H. Platform reliability and data quality (7 questions)
- I. Security, abuse, and incidents (6 questions)

## A. Platform growth and store activity

These questions examine platform growth, store activation, paid-store health, and adoption of Angkoro’s Telegram channel.

| ID | Question |
|---|---|
| AD-G01 | How many stores are active and allowed to operate? |
| AD-G02 | How many stores currently have valid paid access? |
| AD-G03 | How many new stores were created and activated? |
| AD-G04 | What percentage of created stores became active? |
| AD-G05 | How many stores reached their first valid paid order? |
| AD-G06 | How long does a new store take to reach its first valid paid order? |
| AD-G07 | Which active stores have no recent Paid Orders? |
| AD-G08 | What percentage of active stores have Telegram enabled? |

## B. Platform commerce activity

These questions examine commerce activity across stores without giving platform administrators control over ordinary seller decisions.

| ID | Question |
|---|---|
| AD-C01 | How many valid Paid Orders occurred across Angkoro? |
| AD-C02 | What valid Paid Sales occurred across Angkoro, by currency? |
| AD-C03 | How is the seller-decision backlog distributed across stores? |
| AD-C04 | How many accepted prepaid orders await fulfillment? |
| AD-C05 | How many orders expired before payment succeeded? |
| AD-C06 | Which stores produced the most valid Paid Orders? |
| AD-C07 | How many orders auto-cancelled because sellers missed decision deadlines? |
| AD-C08 | What percentage of accepted COD orders failed cash collection? |

## C. Subscriptions and monetization

These questions examine paid subscriptions, actual collections, renewal risk, trial behavior, and future recurring-value definitions.

| ID | Question |
|---|---|
| AD-S01 | How much valid subscription cash was collected, by currency? |
| AD-S02 | How are Active Paid Stores distributed across plans? |
| AD-S03 | How many stores reached their first valid paid subscription? |
| AD-S04 | How many stores are currently in a free trial? |
| AD-S05 | What percentage of ended trials became paid subscriptions? |
| AD-S06 | Which trials end next? |
| AD-S07 | Which live subscriptions are in renewal Grace? |
| AD-S08 | How many first subscription payments failed before activation? |
| AD-S09 | What is monthly recurring subscription value? |
| AD-S10 | What percentage of paid stores stopped subscribing? |
| AD-M01 | What operational platform-fee amount was recognized, by currency and source? |

## D. Payment and checkout reliability

These questions examine payment reliability, pending work, provider performance, and records requiring financial reconciliation.

| ID | Question |
|---|---|
| AD-P01 | What percentage of complete product-payment attempts succeeded? |
| AD-P02 | What percentage of complete subscription-payment attempts succeeded? |
| AD-P03 | Which failure reason, provider, or method performs worst? |
| AD-P04 | Which payments have remained pending longer than expected? |
| AD-P05 | How long does successful payment normally take? |
| AD-P06 | Which refunds, late captures, or orphan payment records need reconciliation? |

## E. Payouts and bank verification

These questions examine seller-money obligations, payout execution, bank verification, and financial-integrity controls.

| ID | Question |
|---|---|
| AD-F01 | Which payout requests await processing? |
| AD-F02 | Which payouts are currently being processed? |
| AD-F03 | Which payouts failed, and why? |
| AD-F04 | How long does a successful payout normally take? |
| AD-F05 | How much payout value was completed, by currency? |
| AD-F06 | Which payout bank accounts await verification? |
| AD-F07 | Which bank accounts were rejected or disabled? |
| AD-F08 | Does every wallet balance reconcile with its ledger? |

## F. Users, stores, safety, and support

These questions examine user/store safety, support, verification, and whether sensitive administrator actions are accountable.

| ID | Question |
|---|---|
| AD-U01 | How many new users joined Angkoro? |
| AD-U02 | How are users distributed across active, unverified, suspended, banned, or merged states? |
| AD-U03 | Which users have remained unverified longer than the adopted limit? |
| AD-U04 | Which users or stores are suspended or banned? |
| AD-U05 | Which reports, appeals, or support cases await review? |
| AD-U06 | Can every sensitive admin action be traced to admin, time, reason, and result? |

## G. Onboarding, Telegram, plans, and features

These questions examine onboarding operations, Telegram health, plan entitlements, and feature-limit correctness.

| ID | Question |
|---|---|
| AD-O01 | Which store-onboarding operations failed? |
| AD-O02 | Which onboarding operations stopped progressing? |
| AD-O03 | At which onboarding step do businesses stop most often? |
| AD-O04 | How long does successful onboarding normally take? |
| AD-O05 | Which requested or connected Telegram setups are unhealthy? |
| AD-O06 | Are active plans mapped to the intended features and limits? |
| AD-O07 | Which stores are reaching or exceeding plan limits? |

## H. Platform reliability and data quality

These questions examine platform reliability and data trust. Most belong to an operational-control surface rather than an executive KPI row.

| ID | Question |
|---|---|
| AD-R01 | Is the Angkoro API available, fast enough, and within an acceptable error rate? |
| AD-R02 | Which background jobs are failing or stuck? |
| AD-R03 | Are database, Redis, server, or disk resources near capacity? |
| AD-R04 | Did the latest database backup complete successfully? |
| AD-R05 | Which payment webhooks failed or could not be matched? |
| AD-R06 | Is dashboard data current, complete, and based on the full population? |
| AD-R07 | Do independently recomputed dashboard totals reconcile with authoritative source records and financial ledgers? |

## I. Security, abuse, and incidents

These questions examine attack traffic, authentication abuse, suspicious sessions and behavior, edge-security alerts, and incident response.

| ID | Question |
|---|---|
| AD-X01 | Is the public website or API currently receiving abnormal or attack traffic? |
| AD-X02 | Which authentication endpoints and IP addresses triggered repeated failures or lockouts? |
| AD-X03 | Which active sessions show an unusual IP address or user-agent change that needs review? |
| AD-X04 | Which WAF or edge-security alerts require investigation? |
| AD-X05 | Which users, stores, payments, or payouts show unusual behavior that needs investigation? |
| AD-X06 | Which security incidents remain unresolved? |

## Register count

**67 distinct questions** are recorded. Every ID appears once with its complete evaluation in `02_Evaluation.md`.

AD-C08 was added on 20 July 2026: cash-on-delivery is a first-class Angkoro payment flow, and the original register never asked whether COD collection succeeds — a Cambodia-specific risk the platform must eventually govern.
