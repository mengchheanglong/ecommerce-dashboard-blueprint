# Merchant Analytics Wireframe & 3-Tab Architecture

This document specifies the layout wireframes, tab structure, chart configurations, and information architecture for the deep **Merchant Analytics Dashboard**.

---

## 1. Information Architecture: The 3-Tab Model

Seven analytical sections on a single screen creates cognitive overload. The production merchant analytics dashboard organizes metrics across **three focused tabs**, with the global date range selector (`7D`, `30D`, `90D`, `1Y`) scoped in the top header:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  STORE ANALYTICS  │ Range: [ Last 30 Days ▼ ]  │ Currency: [ USD ($) ]       │ [Export]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TABS:  [ ◉ Sales & Conversion ]    [ ○ Products & Catalog ]    [ ○ Operations & Losses]
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tab 1: Sales & Conversion (`tabSales`)

Focused on cash velocity, payment channel performance, and funnel conversion efficiency.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  1.1 SALES PERFORMANCE SECTION                                                         │
│  ┌──────────────────────────────────────────────────┬───────────────────────────────┐  │
│  │ Paid Sales vs. Total Booked Sales                │ Average Order Value (AOV)     │  │
│  │ Paid: $12,450.00  │ Total: $15,800.00            │ $34.15 (▲ +$1.80 vs prior)    │  │
│  │ In-transit gap: $3,350.00 (21% of booked revenue)│ Avg Items per Order: 2.4      │  │
│  ├──────────────────────────────────────────────────┴───────────────────────────────┤  │
│  │ [ Daily Sales Timeline Bar Chart — 30-Day Velocity with Trendline ]              │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  1.2 PAYMENT METHOD & COD RECONCILIATION SECTION                                       │
│  ┌──────────────────────────────────────────────────┬───────────────────────────────┐  │
│  │ Payment Channel Distribution                     │ Cash-on-Delivery (COD) Health │  │
│  │ • Digital Gateway (Card/QR): $8,250 (66%)        │ 88% Collection Rate           │  │
│  │ • Cash on Delivery (COD):    $4,200 (34%)        │ • Collected: $4,200 (88%)     │  │
│  │                                                  │ • Refused:   $580   (12%) ⚠️  │  │
│  └──────────────────────────────────────────────────┴───────────────────────────────┘  │
│                                                                                        │
│  1.3 STOREFRONT CONVERSION FUNNEL SECTION                                              │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Storefront Conversion Funnel:                                                    │  │
│  │ Visits (14.2k) ──► Product Views (6.8k) ──► Carts (1.4k) ──► Checkout ──► Paid  │  │
│  │ [ 48% view rate ]   [ 20% cart rate ]       [ 44% chk rate ]  [ 66% pay rate ]   │  │
│  │ Overall Visit-to-Paid Conversion Rate: 2.9%                                      │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tab 2: Products & Catalog (`tabProducts`)

Focused on SKU demand velocity, dead stock elimination, category mix, and customer loyalty.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  2.1 PRODUCTS & INVENTORY INTELLIGENCE SECTION                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Product Demand Leaderboard [ Toggle: Best Sellers ◉ | Slowest Movers ○ ]         │  │
│  │ 1. Canvas Tote Bag     — 148 units sold  ($2,220) │ Stock: In Stock (42 left)     │  │
│  │ 2. Ceramic Coffee Mug  — 112 units sold  ($1,680) │ Stock: Low Stock (3 left) ⚠️ │  │
│  │ 3. Indigo Denim Jacket —  74 units sold  ($2,960) │ Stock: In Stock (18 left)    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  2.2 CATEGORY BREAKDOWN & CUSTOMER RETENTION SECTION                                   │
│  ┌──────────────────────────────────────────────┬───────────────────────────────────┐  │
│  │ Category Sales Distribution                  │ Customer Retention & Frequency    │  │
│  │ • Apparel & Clothing: $6,720 (54%)           │ • New Customers: 68% ($8,460)     │  │
│  │ • Accessories:        $3,480 (28%)           │ • Returning:     32% ($3,990)     │  │
│  │ • Home Goods:         $2,250 (18%)           │ Buckets: 1x (74%) │ 2-3x │ 4+     │  │
│  └──────────────────────────────────────────────┴───────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tab 3: Operations & Losses (`tabOperations`)

Focused on operational efficiency, fulfillment turnaround speed, and diagnosing preventable order cancellations.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  3.1 FULFILLMENT PERFORMANCE SECTION                                                   │
│  ┌──────────────────────────────────────────────┬───────────────────────────────────┐  │
│  │ Mean Fulfillment Turnaround Time             │ Carrier On-Time Handover Rate     │  │
│  │ 18.4 Hours (Order Accept ──► Courier Pickup) │ 94.6% Dispatched within SLA       │  │
│  │ (▲ 2.1h faster than previous period)         │ Target: < 24h from acceptance     │  │
│  └──────────────────────────────────────────────┴───────────────────────────────────┘  │
│                                                                                        │
│  3.2 CANCELLED LOSSES & ROOT CAUSE SECTION                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Order Cancellations & Refunds Breakdown by Reason                                │  │
│  │ • Store Decision Timeout (Auto-cancelled after 24h):  8 orders ($280) ⚠️        │  │
│  │ • Out of Stock (Merchant inventory shortage):         5 orders ($195)            │  │
│  │ • COD Delivery Refused (Buyer rejected at door):      4 orders ($140)            │  │
│  │ • Customer Cancelled (Buyer changed mind):            3 orders ($95)             │  │
│  │ Total Preventable Order Loss: $710.00 (4.5% of gross orders)                     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. URL State Persistence & UX Patterns

1. **URL Parameter Syncing:** The active tab is synchronized with the URL query string (`?tab=sales`, `?tab=products`, `?tab=operations`), ensuring deep links and browser back/forward buttons work flawlessly.
2. **Local Preference Memory:** When navigating back to Analytics from Orders or Products, the application remembers the merchant's last-visited tab.
3. **Global Range Scoping:** Date filters selected in the top bar persist across all three tabs without re-querying or causing divergence.
