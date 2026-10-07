# Merchant Overview Dashboard — Core KPI Contracts

The **Merchant Overview Dashboard** is designed for daily operational use. It answers two immediate questions:
1. **Is paid business happening right now?**
2. **What urgent work needs my attention today?**

---

## The 4 Visual Bands

```text
┌────────────────────────────────────────────────────────────────────────┐
│ BAND 1: BUSINESS HEALTH (Headline Results & Working Capital)           │
│  [ Paid Sales: $4,850 ]  [ Paid Orders: 142 ]  [ Available Balance: $1,280 ]
├────────────────────────────────────────────────────────────────────────┤
│ BAND 2: IMMEDIATE OPERATIONS (Action Queues — Urgent Tasks)           │
│  [ Orders Need Decision (3) ] [ Fulfillment (5) ] [ Stock Alerts (2) ] │
├────────────────────────────────────────────────────────────────────────┤
│ BAND 3: SUPPORTING PERFORMANCE                                         │
│  [ Average Order Value: $34.15 ]      [ Top Products (Top 5 SKUs) ]    │
├────────────────────────────────────────────────────────────────────────┤
│ BAND 4: CONDITIONAL ONBOARDING                                         │
│  [ Store Readiness Checklist (Visible only when setup is incomplete) ] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Band 1: Business Health (Headline Results)

### Item 1: Paid Sales
- **User Question:** "How much real money have I collected from customer orders in this period?"
- **Operational Decision:** Evaluate revenue momentum; determine advertising spend and inventory replenishment capacity.
- **Authoritative Timestamp:** `orders.paid_at` WHERE `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`.
- **Formula:**
  $$\text{Paid Sales} = \sum \text{orders.total\_amount}$$
- **Time Grain & Comparison:** Date range toggle (`Today`, `Last 7 Days`, `Last 30 Days`, `Custom`); percentage delta ($\Delta\%$) compares against an equal-length immediately preceding window.
- **Currency Handling:** Segmented per store currency (e.g. `$ USD`, `€ EUR`).
- **Immediate Action:** Clicking opens the deep Sales & Revenue analytics view.

---

### Item 2: Paid Orders
- **User Question:** "How many distinct customer orders generated that revenue?"
- **Operational Decision:** Distinguish whether revenue growth was driven by order volume or high-value single transactions.
- **Authoritative Timestamp:** `orders.paid_at` on valid paid orders.
- **Formula:**
  $$\text{Paid Orders} = \text{Count of distinct valid paid orders in period}$$
- **Immediate Action:** Filters the Orders table to show all paid orders in the date range.

---

### Item 3: Available Balance (Current Working Capital Snapshot)
- **User Question:** "How much cash can I withdraw to my bank account right now?"
- **Operational Decision:** Assess immediate working capital; decide whether to initiate a payout.
- **Data Boundary:** Current real-time wallet ledger balance (`merchant_wallets.available_balance`).
- **Critical Rule:** **Never scoped by period.** This is a real-time point-in-time snapshot. It does not vary by date filter and does not display historical percentage deltas.
- **Sub-indicators:**
  - *Pending Settlement:* Balance currently held in gateway escrow or clearing transit.
  - *Next Payout Status:* "Ready to withdraw" or scheduled disbursement date.
- **Immediate Action:** Clicking triggers the `Request Payout` modal.

---

## Band 2: Immediate Operations (Action Queues)

These items represent physical work requiring merchant handling. Capped at top rows with quick-action slideout drawers.

### Item 4: Orders Needing Decision
- **User Question:** "Which incoming orders must I accept or reject right now before they auto-cancel?"
- **Operational Decision:** Confirm stock and fulfillment capacity; accept or decline customer orders.
- **Population:**
  - Prepaid orders: `status = 'PAID'`
  - COD orders: `status = 'PENDING_PAYMENT'` AND `payment_method = 'COD'`
- **Sorting Logic:** Strictly sorted by **Nearest Decision Deadline First** (`deadline ASC`).
- **Display Elements:**
  - Counter badge of pending orders.
  - Urgency indicators: 🟡 Amber if $< 6$ hours remaining; 🔴 Red if $< 2$ hours remaining.
- **Immediate Action:** Inline `Accept` and `Reject` buttons directly in preview drawer.

---

### Item 5: Fulfillment Backlog
- **User Question:** "Which paid orders are waiting for me to pack, label, and dispatch?"
- **Operational Decision:** Prioritize daily warehouse packaging and courier handover.
- **Population:** `status = 'ACCEPTED'` (Orders confirmed by merchant but not yet shipped).
- **Sorting Logic:** Oldest acceptance timestamp first (`accepted_at ASC`).
- **Display Elements:**
  - Total count of pending shipments.
  - Oldest order age (e.g. `Waiting 1d 4h`).
- **Immediate Action:** Opens Fulfillment Workspace with batch shipping label generation.

---

### Item 6: Inventory Attention (Stock Alerts)
- **User Question:** "Which items are sold out or about to run out of stock?"
- **Operational Decision:** Reorder inventory from suppliers or pause marketing campaigns.
- **Population:** Tracked inventory items where:
  - **Out of Stock:** `available_units <= 0`
  - **Low Stock:** `1 <= available_units <= 5`
  *(Where $\text{available\_units} = \text{physical\_stock} - \text{reserved\_stock}$)*.
- **Exclusion:** Untracked inventory products are strictly excluded from warnings.
- **Immediate Action:** Clicking item opens SKU inventory modal to update stock levels.

---

## Band 3: Supporting Performance

### Item 7: Average Order Value (AOV)
- **User Question:** "How much does a typical customer spend per purchase?"
- **Operational Decision:** Measure the impact of product bundling, free-shipping thresholds, and upsells.
- **Formula:**
  $$\text{AOV} = \frac{\text{Paid Sales in Period}}{\text{Paid Orders in Period}}$$
- **Immediate Action:** Opens basket size optimization guide.

---

### Item 8: Top Products
- **User Question:** "Which products are my primary revenue drivers right now?"
- **Operational Decision:** Optimize inventory restocking and homepage feature placement.
- **Display Format:** Top 5 ranked table displaying:
  1. Product Thumbnail & Title
  2. Units Sold (Paid items)
  3. Gross Revenue Generated
  4. Current Stock Status Badge
- **Immediate Action:** Links directly to Product Analytics and edit product page.

---

## Band 4: Conditional Onboarding

### Item 9: Store Readiness Checklist
- **Display Rule:** Displayed **only when the store has incomplete setup criteria**. Once all 6 steps pass, this card automatically unmounts to keep the dashboard clean.
- **Checklist Criteria:**
  1. [ ] Store visibility: Published and open.
  2. [ ] Product catalog: At least one active product created.
  3. [ ] Checkout payments: At least one payment gateway connected.
  4. [ ] Payout account: Bank account submitted and verified.
  5. [ ] Notifications: Order alert channel configured.
  6. [ ] Shipping: At least one shipping zone/rate enabled.
- **Immediate Action:** Incomplete items link directly to their setup step.
