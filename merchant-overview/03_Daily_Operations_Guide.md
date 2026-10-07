# Merchant Daily 5-Minute Operations Routine

This operational checklist outlines the recommended routine for store owners to manage incoming customer orders and prevent revenue loss using the Overview Dashboard.

---

## The 5-Minute Routine

```text
┌────────────────────────────────────────────────────────────────────────┐
│  STEP 1: Check "Orders Need Decision"                                  │
│  • Accept all pending orders before auto-cancellation deadline expires │
│  • Reject or contact customer if item cannot be fulfilled             │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 2: Check "Fulfillment Backlog"                                   │
│  • Batch-print shipping labels for accepted prepaid orders             │
│  • Hand packages over to delivery couriers                             │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 3: Check "Inventory Attention"                                   │
│  • Review SKUs with Low Stock (1–5 units) or Out of Stock alerts       │
│  • Submit purchase orders to suppliers or pause active ad campaigns    │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 4: Review "Paid Sales & Orders"                                  │
│  • Monitor daily revenue rhythm and 30-day percentage deltas           │
│  • Check Average Order Value (AOV) to evaluate bundling effectiveness  │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 5: Check "Available Balance"                                     │
│  • Review withdrawable cash snapshot                                   │
│  • Request payout to bank if working capital is needed                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Common Edge Cases & Triage Rules

| Situation | Triage Action |
|---|---|
| **Order deadline $< 2$ hours remaining** | High urgency: Open order drawer immediately; accept or reject directly from phone to avoid auto-cancel penalties. |
| **Out of stock item on pending order** | Reject order with reason `OUT_OF_STOCK` or contact shopper to offer substitute item before deadline. |
| **Pending balance vs. Available balance** | Money from credit card checkouts typically takes 1–3 business days to clear gateway escrow before moving to Available Balance. |
| **Prepaid vs. COD Orders** | Prepaid orders appear in `Orders Need Decision` once payment gateway succeeds. COD orders appear upon order placement and convert to Paid Sales only after cash collection. |
