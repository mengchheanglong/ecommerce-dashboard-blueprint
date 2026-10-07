# E-Commerce Analytics Architecture & Common Pitfalls

This document provides a verified architectural audit guide and catalog of calculation traps common to multi-tenant e-commerce platforms. Use this reference when designing database schemas, analytics pipelines, metric endpoints, and dashboard interfaces.

---

## 1. Executive Summary

A common failure in e-commerce dashboard design is mistaking raw database fields or unvalidated frontend aggregations for an authoritative analytics layer. Without governed calculation boundaries, dashboards frequently report conflicting numbers for basic questions such as *"How much revenue did we make today?"*

This reference separates:
1. **Database Schema Support** — what relational models can track.
2. **Authoritative Event Boundaries** — exact state transitions and timestamps that certify an event.
3. **Business & Accounting Rules** — how refunds, fees, grace periods, and currencies are recognized.
4. **Implementation Pitfalls** — common anti-patterns in reporting queries and dashboard UI.

---

## 2. Order Lifecycle & Revenue Recognition

### 2.1 Order State Machine
A robust e-commerce platform tracks explicit order status transitions:

```text
[ DRAFT ] 
   │
   ▼
[ PENDING_PAYMENT ] ── (Payment Succeeded / COD Placed) ──► [ PAID ]
   │                                                           │
   ├─► [ EXPIRED ] (Payment window timed out)                  ├─► [ ACCEPTED ] (Merchant confirmed)
   └─► [ CANCELLED ]                                           │     │
                                                               │     ├─► [ FULFILLED ] (Shipped/Dispatched)
                                                               │     │     │
                                                               │     │     └─► [ COMPLETED ] (Delivered & Finalized)
                                                               │     │
                                                               │     └─► [ REFUNDED ]
                                                               └─► [ REJECTED ] (Merchant declined)
```

### 2.2 Payment Timestamp vs. Order Paid Timestamp
> **Trap:** Using `payment.succeeded_at` as the authoritative event timestamp for merchant sales.

- **Why it breaks:** If a customer initiates checkout, closes the tab, and the webhook captures payment hours or days later after an order has transitioned to `EXPIRED` or `CANCELLED`, the payment record is technically `SUCCEEDED`, but the order was never fulfilled.
- **Rule:** A valid commerce sale must satisfy both:
  1. `order.status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`
  2. `order.paid_at IS NOT NULL`
- **Authoritative Timestamp:** Always aggregate sales by `order.paid_at`, not `payment.succeeded_at` or `order.created_at`.

### 2.3 Prepaid Digital Payments vs. Cash-On-Delivery (COD)
> **Trap:** Lumping Cash-on-Delivery orders into "Paid Sales" upon order placement or acceptance.

- **Prepaid Digital Rails:** Funds are captured at checkout. Once verified by the payment gateway, `order.paid_at` is stamped.
- **COD Rails:** The order is accepted and shipped while payment is pending. 
- **Rule:** COD orders must **never** be counted in `Paid Sales` or `Paid Orders` until the merchant or delivery courier marks the physical cash as collected (`succeeded_at` / `paid_at`).
- **Dashboard Separation:** Expose two distinct figures:
  - **Paid Sales:** Cash physically settled or digitally captured.
  - **Booked / Expected Sales:** Includes in-flight COD orders with a clear indicator of outstanding collection risk.

---

## 3. Financial Traps & Ledger Integrity

### 3.1 Multi-Currency Aggregation
> **Trap:** Aggregating transactions in different currencies into a single number without real-time FX conversion or currency segmentation.

- **Rule:** Never display a single currency symbol (e.g., `$`) that sums multiple distinct currencies.
- **Best Practice:** Either display separate totals per currency (e.g., `$1,200.00 USD` and `€850.00 EUR`) or standardize on a defined platform base currency using an immutable exchange rate recorded at transaction time.

### 3.2 Gross Sales vs. Net Sales vs. Refunds
> **Trap:** Silently subtracting subsequent refunds from historical sales totals of past periods.

- **Scenario:** An order of $100 was placed and paid on January 15. On February 3, the customer received a full refund.
- **If you mutate January's numbers:** Historical financial reports for January will retroactively change, breaking accounting reconciliation.
- **Rule:**
  - **Gross Paid Sales for Jan 15:** Remains $100.
  - **Refund Event for Feb 3:** Recorded as -$100 in February's refund metrics.
  - **Net Sales:** Defined explicitly as `Gross Paid Sales - Refunds Recorded in Period`.

### 3.3 Platform Fees & Double-Entry Ledger
To support automated payouts and regulatory audits, maintain a double-entry ledger with distinct account types:
- `ESCROW_HOLDING` (Platform holds merchant funds temporarily)
- `MERCHANT_PAYABLE` (Verified funds available for withdrawal)
- `PLATFORM_FEE` (Commissions, transaction fees, processing charges)
- `PLATFORM_SUBSCRIPTION_REVENUE` (SaaS recurring revenue)

Ensure every fee deduction credits `PLATFORM_FEE` and debits `MERCHANT_PAYABLE` atomically in a single database transaction.

---

## 4. Operational Backlogs & SLAs

### 4.1 Order Acceptance Window
When an order is paid, merchants must accept or reject it within a bounded SLA (e.g., 24 hours):
- **Decision Clock:** Starts at `order.paid_at` (prepaid) or `order.created_at` (COD).
- **Auto-Cancellation:** If unhandled within SLA, an automated worker must transition the order to `CANCELLED` with a system reason (`Auto-cancelled: merchant decision timeout`) and trigger an automated customer refund.
- **Dashboard Metric:** "Orders Needing Decision" sorted strictly by **nearest deadline first**, not newest first.

### 4.2 Merchant Payout & Bank Verification Queues
Platform administrators must review merchant bank accounts and payout requests:
- **Bank Verification Queue:** Must be sorted **oldest pending first** to prevent older merchants from being starved of review.
- **SLA Thresholds:** Define clear visual warnings (e.g., Orange at >24 hours, Red at >48 hours).
- **Masking:** Never display raw bank account or card numbers. Project safe masked identifiers (e.g., `•••• 4821`).

---

## 5. Inventory & Stock Tracking

### 5.1 Available vs. Physical vs. Reserved Stock
> **Trap:** Relying solely on `physical_stock` count.

- **Formula:** `Available Units = physical_stock - reserved_stock`
- **Reserved Stock:** Units held for orders in `PAID` or `ACCEPTED` states before dispatch.
- **Untracked Inventory:** Some products do not have inventory tracking enabled (e.g., digital downloads, made-to-order items). The dashboard must explicitly exclude untracked items from "Low Stock" and "Out of Stock" alerts.

---

## 6. Subscriptions & SaaS Health

### 6.1 State Segmentation
A subscription lifecycle contains multiple active and degraded states:
- `ACTIVE` — Current paid billing cycle.
- `GRACE` — Payment failed at renewal; tenant retains access for a grace period (e.g., 3–7 days) while retry mechanisms run.
- `FAILED` — All retry attempts exhausted; services restricted.
- `CANCELLED` — Tenant initiated voluntary churn.
- `EXPIRED` — Terminated after non-payment.

### 6.2 MRR Calculation Rules
- **Include:** `ACTIVE` subscriptions + `GRACE` period subscriptions (as they represent existing recurring commitments undergoing routine card retry).
- **Exclude:** One-time setup fees, onboarding charges, and refunded invoices.
- **Renewal Failure vs. Voluntary Churn:** Separate involuntary billing churn (card expired) from voluntary merchant cancellations to inform product intervention.

---

## 7. Frontend & API Architectural Anti-Patterns

| Anti-Pattern | Description | Correct Architecture |
|---|---|---|
| **Client-side aggregation** | Fetching 50 paginated orders in the browser and summing totals in JavaScript. | Compute aggregates via dedicated SQL/OLAP endpoints on the server. |
| **Missing Timezone Alignment** | Comparing UTC timestamps with the user's local calendar day, causing split-day mismatches. | Align all time-bucket queries to the merchant's configured store timezone before grouping by day. |
| **Newest-First Work Queues** | Sorting operational backlogs by `created_at DESC`. | Sort action items by urgency / deadline (`deadline ASC` or `created_at ASC`). |
| **Silent Cascade Mutations** | Banning a user or store silently deleting connected transaction logs. | Soft-deactivate accounts; keep all ledger, order, and payment history immutable for audits. |
