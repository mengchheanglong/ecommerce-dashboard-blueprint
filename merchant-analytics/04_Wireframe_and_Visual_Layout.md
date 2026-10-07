# Merchant Analytics Wireframe & Visual Layout Specification

This document defines the layout wireframes, chart configurations, and information architecture for the deep **Merchant Analytics Dashboard** (distinct from the daily Overview Dashboard).

---

## 1. Information Architecture & Page Wireframe

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  STORE ANALYTICS  │ Range: [ Last 30 Days ▼ ]  │ Channel: [ All Channels ▼ ] │ [Export]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  SECTION 1: REVENUE VELOCITY & CASH-FLOW GAP                                           │
│  ┌──────────────────────────────────────────────┬───────────────────────────────────┐  │
│  │ Paid Sales vs. Total Booked Sales            │ Cash on Delivery (COD) Health     │  │
│  │ Paid: $12,450.00  │ Total: $15,800.00        │ 88% Collection Rate               │  │
│  │ Gap: $3,350.00 in-flight with couriers (21%) │ • Collected: $4,200 (88%)         │  │
│  │ [ Daily Sales Timeline Bar Chart (30 Days) ] │ • Refused / Returned: $580 (12%)  │  │
│  └──────────────────────────────────────────────┴───────────────────────────────────┘  │
│                                                                                        │
│  SECTION 2: STOREFRONT FUNNEL & BASKET SIZE                                            │
│  ┌──────────────────────────────────────────────┬───────────────────────────────────┐  │
│  │ Storefront Conversion Funnel                 │ Basket Size Dynamics              │  │
│  │ Visits (14.2k) ──► Product (6.8k) ──►        │ • Average Order Value: $34.15     │  │
│  │ Cart (1.4k) ──► Checkout (620) ──► Paid(412) │ • Avg Items per Order: 2.4 units  │  │
│  │ Overall Conversion: 2.9%                     │ • Best Category: Apparel (54%)    │  │
│  └──────────────────────────────────────────────┴───────────────────────────────────┘  │
│                                                                                        │
│  SECTION 3: PRODUCT MERCHANDISING INTELLIGENCE                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Product Demand Leaderboard [ Toggle: Best Sellers ◉ | Slowest Movers ○ ]         │  │
│  │ 1. Canvas Tote Bag     — 148 units sold  ($2,220) │ Stock: In Stock (42 left)     │  │
│  │ 2. Ceramic Coffee Mug  — 112 units sold  ($1,680) │ Stock: Low Stock (3 left) ⚠️ │  │
│  │ 3. Indigo Denim Jacket —  74 units sold  ($2,960) │ Stock: In Stock (18 left)    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  SECTION 4: CUSTOMER RETENTION & ORDER LOSS REASONS                                    │
│  ┌──────────────────────────────────────────────┬───────────────────────────────────┐  │
│  │ Customer Retention & Loyalty                 │ Order Cancellations by Reason     │  │
│  │ • New Customers: 68% ($8,460)                │ • Merchant Timeout: 8 orders ⚠️   │  │
│  │ • Returning Customers: 32% ($3,990)          │ • Out of Stock: 5 orders          │  │
│  │ Frequency: 1x (74%) │ 2-3x (21%) │ 4+ (5%)   │ • COD Delivery Refusal: 4 orders  │  │
│  └──────────────────────────────────────────────┴───────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Visualization Guidelines by Section

### Section 1: Revenue Velocity & COD Health
- **Daily Sales Timeline:** 30-day discrete bar chart. Days with promotional campaigns are highlighted with distinct accent colors.
- **COD Collection Gauge:** Donut chart or 3-segment progress bar showing money collected vs. in-flight vs. courier return losses.

### Section 2: Storefront Conversion Funnel
- **Funnel Visualization:** Horizontal connected bars showing drop-off at each touchpoint. Clicking a step reveals top exit URLs.
- **Basket Size Metrics:** Paired metric cards showing Average Order Value (AOV) and Average Units per Order (UPT).

### Section 3: Product Merchandising Intelligence
- **Best vs. Slowest Movers Toggle:** Allows store owners to identify high-velocity SKUs for restocking and zero-velocity dead stock for promotional discounting.
- **Stock Health Badges:** Inline alerts ensure top sellers are never caught in unmonitored stockout states.

### Section 4: Customer Insights & Leakage Diagnostics
- **Retention Stack:** Stacked bar chart comparing new vs. repeat customer revenue shares.
- **Cancellation Reasons Bar:** Horizontal ranked bars showing exactly why orders failed after checkout, highlighting preventable operational issues.
