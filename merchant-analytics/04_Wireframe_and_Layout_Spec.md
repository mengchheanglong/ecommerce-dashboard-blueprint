# Merchant Analytics Wireframe & Layout Specification

This document defines the layout wireframes, screen hierarchy, visual grouping logic, and responsive adaptations for the Merchant Store Overview Dashboard.

---

## 1. Information Hierarchy & Wireframe Layout

The Merchant Overview is designed around a single core principle: **Separate passive performance monitoring from urgent operational work.**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  STORE LOGO  │ Store: The Artisan Boutique │ Date: [ Last 30 Days ▼ ] │ [Owner Avatar] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  BAND 1: BUSINESS HEALTH (Headline Performance & Working Capital)                      │
│  ┌─────────────────────────┬─────────────────────────┬──────────────────────────────┐  │
│  │ Paid Sales              │ Paid Orders             │ Available Balance            │  │
│  │ $4,850.00               │ 142                     │ $1,280.50                    │  │
│  │ ▲ +14.2% vs prior period│ ▲ +8.5% vs prior period │ Ready to withdraw            │  │
│  │ [ Sparkline 30d ]       │ [ Daily Order Bars ]    │ [ Request Payout Button ──►] │  │
│  └─────────────────────────┴─────────────────────────┴──────────────────────────────┘  │
│                                                                                        │
│  BAND 2: IMMEDIATE OPERATIONS (Action Queues — Capped at Top 3 Rows)                  │
│  ┌─────────────────────────┬─────────────────────────┬──────────────────────────────┐  │
│  │ ⚡ Orders Need Decision │ 📦 Fulfillment Backlog  │ ⚠️ Inventory Attention       │  │
│  │ 3 Orders Pending        │ 5 Orders Ready to Ship  │ 2 Items Need Restock         │  │
│  │ • #1042 — Due in 1h 15m │ • #1038 — Waiting 18h   │ • Linen Shirt (M) — 0 left   │  │
│  │ • #1044 — Due in 4h 30m │ • #1039 — Waiting 12h   │ • Silk Scarf — 2 left        │  │
│  │ [ View all 3 ──► ]      │ [ View all 5 ──► ]      │ [ Manage Inventory ──► ]     │  │
│  └─────────────────────────┴─────────────────────────┴──────────────────────────────┘  │
│                                                                                        │
│  BAND 3: SUPPORTING PERFORMANCE                                                        │
│  ┌───────────────────────────────────────┬──────────────────────────────────────────┐  │
│  │ Average Order Value                   │ Top Products (By Units Sold)             │  │
│  │ $34.15                                │ 1. Canvas Tote Bag     — 48 units ($720) │  │
│  │ ▲ +$1.80 vs prior period              │ 2. Ceramic Coffee Mug  — 36 units ($540) │  │
│  │ (Paid Sales / Paid Orders)            │ 3. Indigo Denim Jacket — 22 units ($880) │  │
│  └───────────────────────────────────────┴──────────────────────────────────────────┘  │
│                                                                                        │
│  BAND 4: CONDITIONAL STORE READINESS (Hides automatically when 6/6 complete)           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🚀 Store Setup Checklist (5 of 6 Completed)                                      │  │
│  │ [✔] Store Open  [✔] Products Live  [✔] Payments  [✔] Notifications  [ ] Bank KYC │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 Band 1: Business Health Cards
- **Card 1: Paid Sales**
  - High-contrast hero typography (`text-3xl font-bold`).
  - Green/Red trend chip displaying percentage delta against preceding window.
  - Micro-sparkline visualizing daily sales rhythm.
- **Card 2: Paid Orders**
  - Distinct count of valid orders.
  - Paired with Paid Sales to prevent misleading conclusions if single large orders skew sales.
- **Card 3: Available Balance**
  - Point-in-time cash snapshot (decoupled from date picker).
  - Explicit `Request Payout` secondary button allowing instant withdrawal trigger.

### 2.2 Band 2: Immediate Operations (The Work Band)
The three operational queues prevent lost orders, delayed shipping, and stockouts:
- **Orders Need Decision:**
  - Displays order number, customer name, and a visual SLA countdown timer.
  - Hovering/clicking a row opens a quick-review slideout drawer with item summary, delivery address, and direct `Accept` / `Reject` buttons.
- **Fulfillment Backlog:**
  - Shows accepted prepaid orders awaiting courier dispatch.
  - Flags orders waiting $> 24$ hours.
- **Inventory Attention:**
  - Categorized badges: Red `Out of Stock` (0 units) and Amber `Low Stock` (1–5 units).
  - Clicking launches stock adjustment drawer.

### 2.3 Band 3: Supporting Content
- **Average Order Value (AOV):** Explains whether changes in Paid Sales were driven by pricing/upselling or sheer order volume.
- **Top Products Table:** Displays top 5 bestsellers with thumbnail, units sold, revenue, and inline stock health indicator.

---

## 3. Responsive & Mobile Behavior (< 768px)

On mobile smartphones:
1. **Urgent Work First:** When actionable items exist in **Band 2** (Orders Needing Decision $> 0$), Band 2 dynamically shifts **above** Band 1 on mobile, allowing store owners to accept orders in seconds from their phone.
2. **Horizontal Snap Scrolling:** Health metric cards transform into a smooth horizontal touch carousel with pagination dots.
3. **Slideout Drawers:** Queue items open bottom sheets (`Sheet` component) rather than navigating to full pages, keeping the seller in flow.
4. **Tap Targets:** Minimum button height of 48px with clear tactile feedback.
