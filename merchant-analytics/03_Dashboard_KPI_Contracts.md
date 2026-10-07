# Merchant Analytics Dashboard KPI Decision Contracts

This document specifies the **9 core production dashboard items** for the Merchant Store Overview. Each contract defines the merchant question answered, authoritative data boundary, formula, comparison logic, and immediate workflow action.

---

## Group 1: Business Health (Headline Results)

### Item 1: Paid Sales
- **Merchant Question:** "How much real money have I collected from customer orders in this period?"
- **Operational Decision:** Evaluate revenue momentum; determine advertising spend and inventory replenishment capacity.
- **Authoritative Timestamp:** `orders.paid_at` WHERE `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`.
- **Calculation Formula:**
  $$\text{Paid Sales} = \sum \text{orders.total\_amount}$$
- **Time Grain & Comparison:** Date range toggle (`Today`, `Last 7 Days`, `Last 30 Days`, `Custom`); percentage delta ($\Delta\%$) compares against an equal-length immediately preceding window.
- **Currency Handling:** Segmented per store currency (e.g., USD `$`, EUR `€`).
- **Immediate Merchant Action:** Clicking opens the Sales & Revenue Report with daily breakdown bars.

---

### Item 2: Paid Orders
- **Merchant Question:** "How many distinct customer orders generated that revenue?"
- **Operational Decision:** Distinguish whether sales growth was driven by transaction volume or high-value single purchases.
- **Authoritative Timestamp:** `orders.paid_at` on valid paid orders.
- **Calculation Formula:**
  $$\text{Paid Orders} = \text{Count of distinct valid paid orders in period}$$
- **Immediate Merchant Action:** Clicking filters the Orders Management table to show all paid orders in the date range.

---

### Item 3: Available Balance (Current Snapshot)
- **Merchant Question:** "How much cash can I withdraw to my bank account right now?"
- **Operational Decision:** Assess immediate working capital; decide whether to initiate a payout.
- **Data Boundary:** Current real-time wallet ledger balance (`merchant_wallets.available_balance`).
- **Critical Rule:** **Never scoped by period.** This is a real-time point-in-time snapshot. It does not display a date filter or trend percentage.
- **Sub-indicators:**
  - *Pending Settlement:* Balance currently held in settlement transit.
  - *Next Payout Date / Status:* Scheduled disbursement date or "Ready to withdraw".
- **Immediate Merchant Action:** Clicking triggers the `Request Payout` modal.

---

## Group 2: Immediate Operations (Action Queues)

These items represent physical work requiring merchant handling. They are capped at top rows with quick-action links.

### Item 4: Orders Needing Decision
- **Merchant Question:** "Which incoming orders must I accept or reject right now before they auto-cancel?"
- **Operational Decision:** Confirm stock and fulfillment capacity; accept or decline customer orders.
- **Population:**
  - Prepaid orders: `status = 'PAID'`
  - COD orders: `status = 'PENDING_PAYMENT'` AND `payment_method = 'COD'`
- **Sorting Logic:** Strictly sorted by **Nearest Decision Deadline First** (`deadline ASC`).
- **Display Elements:**
  - Counter badge of pending orders.
  - Urgency indicators: 🟡 Amber if $< 6$ hours remaining; 🔴 Red if $< 2$ hours remaining.
- **Immediate Merchant Action:** Inline `Accept` and `Reject` buttons directly in preview drawer.

---

### Item 5: Fulfillment Backlog
- **Merchant Question:** "Which paid orders are waiting for me to pack, label, and dispatch?"
- **Operational Decision:** Prioritize daily warehouse packaging and courier handover.
- **Population:** `status = 'ACCEPTED'` (Orders confirmed by merchant but not yet shipped).
- **Sorting Logic:** Oldest acceptance timestamp first (`accepted_at ASC`).
- **Display Elements:**
  - Total count of pending shipments.
  - Oldest order age (e.g. `Waiting 1d 4h`).
- **Immediate Merchant Action:** Opens Fulfillment Workspace with batch shipping label generation.

---

### Item 6: Inventory Attention (Stock Alerts)
- **Merchant Question:** "Which items are sold out or about to run out of stock?"
- **Operational Decision:** Reorder inventory from suppliers or pause marketing campaigns.
- **Population:** Tracked inventory items where:
  - **Out of Stock:** `available_units <= 0`
  - **Low Stock:** `1 <= available_units <= 5`
  *(Where $\text{available\_units} = \text{physical\_stock} - \text{reserved\_stock}$)*.
- **Exclusion:** Untracked inventory products are strictly excluded from warnings.
- **Immediate Merchant Action:** Clicking item opens SKU inventory modal to update stock levels.

---

## Group 3: Supporting Performance

### Item 7: Average Order Value (AOV)
- **Merchant Question:** "How much does a typical customer spend per purchase?"
- **Operational Decision:** Measure the impact of product bundling, free-shipping thresholds, and upsells.
- **Formula:**
  $$\text{AOV} = \frac{\text{Paid Sales in Period}}{\text{Paid Orders in Period}}$$
- **Immediate Merchant Action:** Contextual explanation; opens checkout optimization tips.

---

### Item 8: Top Products
- **Merchant Question:** "Which products are my primary revenue drivers?"
- **Operational Decision:** Optimize inventory restocking, homepage feature placement, and bundle packaging.
- **Display Format:** Top 5 ranked table displaying:
  1. Product Thumbnail & Title
  2. Units Sold (Paid items)
  3. Gross Revenue Generated
  4. Current Stock Status (Badge)
- **Immediate Merchant Action:** Links directly to Product Analytics and edit product page.

---

## Group 4: Conditional Onboarding

### Item 9: Store Readiness Checklist
- **Display Rule:** Displayed **only when the store has incomplete setup criteria**. Once all 6 steps pass, this card automatically unmounts to keep the dashboard clutter-free.
- **Checklist Criteria:**
  1. [ ] Store visibility: Published and open.
  2. [ ] Product catalog: At least one active product created.
  3. [ ] Checkout payments: At least one payment gateway connected.
  4. [ ] Payout account: Bank account submitted and verified.
  5. [ ] Notifications: Order alert channel configured.
  6. [ ] Shipping: At least one shipping zone/rate enabled.
- **Immediate Merchant Action:** Each incomplete item links directly to its setup wizard step.
