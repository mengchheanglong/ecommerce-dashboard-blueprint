# Platform Admin Dashboard KPI Decision Contracts

This document specifies the **15 core production dashboard items** for the Platform Administration interface. Each contract defines the operational decision served, authoritative timestamp, calculation formula, health bands, and immediate operator action.

---

## Dashboard Architecture Summary

The executive platform overview is structured into 4 distinct visual bands:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PLATFORM HEALTH (Headline Executive KPIs)                           │
│  [ Active Paid Stores ] [ Subscription MRR ] [ Platform GMV ] [ Pay % ]│
├────────────────────────────────────────────────────────────────────────┤
│ 2. GROWTH & ACTIVATION (Tenant Funnel)                                 │
│  [ Store Activation Funnel: Created ──► Activated ──► First Sale ]      │
├────────────────────────────────────────────────────────────────────────┤
│ 3. ACTION CENTER (SLA-Governed Work Queues & Alerts)                   │
│  [ KYC Bank Review ] [ Payout Review ] [ Failed Payouts ] [ Support ]   │
│  [ ! Conditional Alert: Failed Tenant Onboarding ]                     │
├────────────────────────────────────────────────────────────────────────┤
│ 4. TRUST & GOVERNANCE (Integrity Chips)                                │
│  [ System Health ] [ Ledger Audit ] [ Entitlement Check ] [ Data Fresh]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## Band 1: Platform Health (Primary KPIs)

### Item 1: Active Paid Stores
- **User Question:** "How many paying tenants are operating on the platform right now, and is the base growing?"
- **Operational Decision:** Evaluate tenant retention and platform expansion; trigger growth or retention initiatives.
- **Authoritative Entity & Timestamp:** `stores.id` WHERE `subscription.status IN ('ACTIVE', 'GRACE')` evaluated at current snapshot.
- **Formula:** 
  $$\text{Active Paid Stores} = \text{Count of distinct stores with non-expired paid plan access}$$
  - **Net Change Display:** `(+ Activated - Expired)` over the selected period.
- **Cadence / Refresh:** Hourly snapshot; real-time delta.
- **Health Bands:**
  - 🟢 **Healthy:** Net Change $\ge 0$ over trailing 30 days.
  - 🔴 **Danger:** Net Change $< 0$ (net contraction of tenant base).
- **Operator Action:** Clicking opens Store Directory filtered by status (`ACTIVE`, `GRACE`, `EXPIRED`).

---

### Item 2: Subscription MRR & Confirmed Collections
- **User Question:** "What is our recurring subscription revenue run-rate, and how much cash was actually collected?"
- **Operational Decision:** Monitor platform SaaS cash flow and subscription billing velocity.
- **Authoritative Entity & Timestamp:** `subscription_invoices.paid_at` on `status = 'PAID'`.
- **Formula:**
  - **Contracted MRR (Headline):** $\sum (\text{Active Monthly Plan Fees}) + \sum (\text{Annual Plan Fees} / 12)$
  - **Cash Collections (Sub-line):** $\sum \text{invoices.amount}$ where `paid_at` falls in selected period.
- **Cadence / Refresh:** 15-minute cached aggregate.
- **Health Bands:**
  - 🟢 **Healthy:** Cash collections tracking $\ge 95\%$ of expected billings.
  - 🔴 **Danger:** Cash collections $< 85\%$ of expected billings (billing gateway retry failures).
- **Operator Action:** Clicking opens Subscription Billing & Invoice Management.

---

### Item 3: Platform Paid Sales & Orders (GMV)
- **User Question:** "What volume and value of commerce is being transacted across all hosted storefronts?"
- **Operational Decision:** Track platform economic throughput; detect broad market or checkout disruptions.
- **Authoritative Entity & Timestamp:** `orders.paid_at` on `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`.
- **Formula:**
  - **Platform Paid Sales (GMV):** $\sum \text{orders.total\_amount}$ by currency (USD, EUR, etc. displayed separately).
  - **Platform Paid Orders:** Distinct count of valid paid orders in selected period.
- **Cadence / Refresh:** 5-minute cached aggregate.
- **Health Bands:**
  - 🟢 **Healthy:** Volume within normal historical seasonal bounds ($\pm 15\%$).
  - 🔴 **Danger:** Sudden $> 40\%$ drop compared to same weekday prior week (indicates payment rail disruption).
- **Operator Action:** Opens Platform Commerce Analytics with breakdown by store and category.

---

### Item 4: Payment Gateway Success Rate
- **User Question:** "Are customers able to complete checkout payments reliably across all gateways?"
- **Operational Decision:** Detect payment provider outages, webhook dropouts, or bank gateway degradations.
- **Authoritative Entity & Timestamp:** `payment_intents.updated_at` where status is terminal (`SUCCEEDED` or `FAILED`).
- **Formula:**
  $$\text{Success Rate} = \frac{\text{Count of SUCCEEDED Payment Intents}}{\text{Count of (SUCCEEDED + FAILED) Payment Intents}} \times 100$$
  *(Excludes intents pending $< 24$ hours)*.
- **Cadence / Refresh:** Near real-time (1-minute rolling 1-hour window).
- **Health Bands:**
  - 🟢 **Healthy:** $\ge 88.0\%$ overall success rate.
  - 🟡 **Warning:** $82.0\% - 87.9\%$.
  - 🔴 **Danger:** $< 82.0\%$ (triggers automated system alert).
- **Operator Action:** Clicking opens Gateway Diagnostic Drawer displaying failure codes per provider.

---

## Band 2: Growth & Activation

### Item 5: Store Activation Funnel
- **User Question:** "Where are new merchants dropping off between signup and their first customer transaction?"
- **Operational Decision:** Direct onboarding support and concierge assistance to stuck merchants.
- **Stages:**
  1. **Created:** Total new merchant accounts registered.
  2. **Activated:** Completed store profile, added product, and connected payment setup.
  3. **First Paid Order:** Processed first real customer transaction.
- **Cadence / Refresh:** Daily aggregate.
- **Operator Action:** Clicking any funnel stage opens the Store Directory filtered to merchants currently at that stage.

---

## Band 3: Action Center (SLA-Governed Queues)

All action queues enforce **R7 (Queue Disposition)**: items are resolved only by explicit, auditable operator actions.

### Item 6: Bank & Settlement Accounts Awaiting Verification
- **User Question:** "Which merchant payout bank accounts need compliance / KYC review?"
- **SLA Target:** Review within **24 hours** of submission.
- **Sort Order:** Strictly **Oldest Submitted First** (`created_at ASC`).
- **Display Badges:**
  - Total pending count.
  - Oldest item age (e.g., `18h ago`).
  - 🟡 **Due Soon:** Items with age $> 18h$.
  - 🔴 **Overdue:** Items with age $> 24h$.
- **Operator Action:** Opens Settlement Account Verification Workbench with masked preview and document viewer.

---

### Item 7: Payouts Awaiting Processing
- **User Question:** "Which approved merchant withdrawal requests need execution?"
- **SLA Target:** Execute within **48 hours** (2 business days).
- **Sort Order:** Oldest requested first.
- **Display Badges:**
  - Count of pending requests & total withdrawal liability.
  - 🟡 **Due Soon:** Age $> 36h$.
  - 🔴 **Overdue:** Age $> 48h$.
- **Operator Action:** Opens Payout Execution Drawer for Super Admin authorization.

---

### Item 8: Failed Payouts Queue
- **User Question:** "Which payout disbursements failed during bank transfer and require manual intervention?"
- **SLA Target:** Triage and retry/cancel within **12 hours**.
- **Display Badges:** Count of failed records requiring operator resolution.
- **Operator Action:** Opens Payout Error Log with banking response codes and manual retry triggers.

---

### Item 9: Support Cases Awaiting Triage
- **User Question:** "How many merchant support tickets remain unassigned or unanswered past target SLA?"
- **SLA Target:** First response within **4 hours**.
- **Display Badges:** Open ticket count and count breached.
- **Operator Action:** Opens Support Concierge Inbox sorted by oldest unassigned.

---

### Item 10: Conditional Alert — Failed Store Onboardings
- **Display Condition:** Visible **only when count > 0**.
- **User Question:** "Did any automated background provisioning jobs fail during store creation?"
- **Operator Action:** Red banner with count; clicking opens Provisioning Failure Log to trigger automated re-run.

---

## Band 4: Trust & Governance Status Chips

Small status chips placed at the top or bottom of the dashboard providing continuous proof of platform integrity.

| Item | Name | Verification Check | Healthy State (🟢) | Degraded / Action State (🔴) |
|---|---|---|---|---|
| **11** | **System Status** | Core API latency, background queue lag, Redis health. | All services responding `< 200ms`, queue lag `< 30s`. | API degraded, or worker DLQ $> 0$. |
| **12** | **Wallet-Ledger Audit** | Automated sum of merchant wallet balances vs. double-entry ledger accounts. | Discrepancy $= \$0.00$. | Ledger mismatch $> \$0.00$ (Halts automated payouts). |
| **13** | **Plan Entitlements** | Daily scan verifying store feature flags match current subscription tier. | Zero unauthorized feature overrides. | Mismatch detected (flags manual override). |
| **14** | **Data Freshness** | Timestamp of latest completed analytics pipeline batch. | Data synced $< 15$ minutes ago. | Data sync lag $> 60$ minutes. |
| **15** | **Reconciliation Audit** | Nightly reconciliation between payment gateway captured funds and bank deposits. | 100% gateway capture matched to order records. | Unmatched capture or orphan payment detected. |
