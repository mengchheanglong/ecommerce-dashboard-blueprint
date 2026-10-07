# Merchant Overview Dashboard — Core KPI Contracts

The **Merchant Overview Dashboard** is designed for daily operational use. It serves as the daily operational cockpit for store owners, answering two immediate questions:
1. **Is paid business happening right now?**
2. **What urgent work needs my attention today?**

---

## The 4 Functional Sections

```text
┌────────────────────────────────────────────────────────────────────────┐
│ SECTION 1: BUSINESS HEALTH (Headline Performance & Working Capital)   │
│  [ Paid Sales: $4,850 ]  [ Paid Orders: 142 ]  [ Available Balance: $1,280 ]
│  [ Granularity Toggle: Day | Week | Month ]    [ Date Range Selector ] │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: NEEDS ATTENTION (Urgent Operational Work Queues)           │
│  [ Orders Need Decision (3) ] [ Fulfillment (5) ] [ Stock Alerts (2) ] │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: SUPPORTING PERFORMANCE                                      │
│  [ Average Order Value: $34.15 ]      [ Top Products (Top 5 SKUs) ]    │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: GATEWAY & STORE READINESS NUDGE                             │
│  [ Payment Gateway Status: Under Review | Approved | Active | Action ] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Business Health (Headline Results)

### Item 1: Paid Sales
- **User Question:** *"How much real money have I collected from customer orders in this period?"*
- **Operational Decision:** Evaluate revenue momentum; determine advertising spend and inventory replenishment capacity.
- **Authoritative Timestamp:** `orders.paid_at` WHERE `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`.
- **Formula:**
  $$\text{Paid Sales} = \sum \text{orders.total\_amount}$$
- **Granularity & Range:** Supports `Day`, `Week`, and `Month` buckets with equal-length preceding period delta ($\Delta\%$).
- **Currency Handling:** Segmented per store currency (e.g. `$ USD`, `€ EUR`).
- **Immediate Action:** Clicking navigates to the detailed Sales Performance tab in the Analytics dashboard.

---

### Item 2: Paid Orders
- **User Question:** *"How many distinct customer orders generated that revenue?"*
- **Operational Decision:** Distinguish whether revenue growth was driven by order volume or high-value single transactions.
- **Authoritative Timestamp:** `orders.paid_at` on valid paid orders.
- **Formula:**
  $$\text{Paid Orders} = \text{Count of distinct valid paid orders in period}$$
- **Immediate Action:** Filters the Orders table to show all paid orders in the selected date range.

---

### Item 3: Available Balance (Current Working Capital Snapshot)
- **User Question:** *"How much cash can I withdraw to my bank account right now?"*
- **Operational Decision:** Assess immediate working capital; decide whether to initiate a payout.
- **Data Boundary:** Current real-time wallet ledger balance (`merchant_wallets.available_balance`).
- **Critical Rule:** **Never scoped by period.** This is a real-time point-in-time snapshot. It does not vary by date filter and does not display historical percentage deltas.
- **Sub-indicators:**
  - *Pending Settlement:* Balance currently held in gateway escrow or clearing transit.
  - *Next Payout Status:* "Ready to withdraw" or scheduled disbursement date.
- **Immediate Action:** Clicking triggers the `Request Payout` modal.

---

## Section 2: Needs Attention (Immediate Work Queues)

These queues represent urgent operational tasks requiring merchant handling. Each queue links directly to pre-filtered order and inventory workspaces.

### Item 4: Orders Needing Decision
- **User Question:** *"Which incoming orders must I accept or reject right now before they auto-cancel?"*
- **Operational Decision:** Confirm stock and fulfillment capacity; accept or decline customer orders.
- **Critical Architectural Boundary:**
  - **Prepaid orders:** Waiting while `status = 'PAID'`.
  - **Cash-on-Delivery (COD) orders:** Waiting while `status = 'PENDING_PAYMENT'` AND `payment_type = 'COD'`.
  - *(Note: Do NOT filter simply on `PENDING_PAYMENT`—that misses prepaid orders awaiting acceptance and includes unpaid abandoned checkouts).*
- **Sorting Logic:** Strictly sorted by **Nearest Decision Deadline First** (`deadline ASC`).
- **Urgency Badges:** 🟡 Amber if $< 6$ hours remaining; 🔴 Red if $< 2$ hours remaining.
- **Immediate Action:** Inline `Accept` and `Reject` buttons directly in preview drawer.

---

### Item 5: Fulfillment Backlog
- **User Question:** *"Which paid orders are waiting for me to pack, label, and dispatch?"*
- **Operational Decision:** Prioritize daily warehouse packaging and courier handover.
- **Population:** `status = 'ACCEPTED'` (Orders confirmed by merchant but not yet shipped).
- **Sorting Logic:** Oldest acceptance timestamp first (`accepted_at ASC`).
- **Display Elements:**
  - Total count of pending shipments.
  - Oldest order age (e.g. `Waiting 1d 4h`).
- **Immediate Action:** Opens Fulfillment Workspace with batch shipping label generation.

---

### Item 6: Inventory Attention (Stock Alerts)
- **User Question:** *"Which items are sold out or about to run out of stock?"*
- **Operational Decision:** Reorder inventory from suppliers or pause marketing campaigns.
- **Population:** Tracked inventory items where:
  - **Out of Stock:** `available_units <= 0`
  - **Low Stock:** `1 <= available_units <= 5`
  *(Where $\text{available\_units} = \text{physical\_stock} - \text{reserved\_stock}$)*.
- **Exclusion:** Untracked inventory products are strictly excluded from warnings.
- **Immediate Action:** Clicking item opens SKU inventory modal to update stock levels.

---

## Section 3: Supporting Performance

### Item 7: Average Order Value (AOV)
- **User Question:** *"How much does a typical customer spend per purchase?"*
- **Operational Decision:** Measure the impact of product bundling, free-shipping thresholds, and upsells.
- **Formula:**
  $$\text{AOV} = \frac{\text{Paid Sales in Period}}{\text{Paid Orders in Period}}$$
  *(Returns `$0.00` if `Paid Orders = 0`)*.
- **Immediate Action:** Opens basket size optimization guide.

---

### Item 8: Top Products
- **User Question:** *"Which products are my primary revenue drivers right now?"*
- **Operational Decision:** Optimize inventory restocking and homepage feature placement.
- **Display Format:** Top 5 ranked table displaying Thumbnail, Title, Units Sold, Gross Revenue, and Stock Status.
- **Immediate Action:** Links directly to Product Catalog.

---

## Section 4: Gateway Readiness & Setup Nudge

### Item 9: Payment Gateway Readiness Nudge
- **User Question:** *"Is my payment gateway active, or is action required to accept digital customer payments?"*
- **State Badges:**
  - `NOT_REQUESTED` — Prompt merchant to submit payment gateway application.
  - `UNDER_REVIEW` — Gateway account submitted; compliance review in progress.
  - `AWAITING_ACTIVATION` — Compliance approved; credentials awaiting merchant activation.
  - `ACTIVE` — Live and processing transactions smoothly.
  - `NEEDS_ATTENTION` — Application rejected or credentials suspended; requires merchant correction.
- **Immediate Action:** Contextual button linking directly to Payment Settings or Application Form.
