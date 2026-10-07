# Merchant Analytics Deep KPI Specifications

This document defines the technical calculation contracts and visualization parameters for deep business intelligence and growth metrics in the Merchant Analytics Dashboard.

---

## 1. Sales & Revenue Dynamics

### KPI 1: Paid Sales vs. Total Booked Sales (Revenue Gap Analysis)
- **User Question:** "How much money have I physically collected vs. how much is still tied up in delivery?"
- **Formula:**
  - **Paid Sales:** $\sum \text{orders.total\_amount}$ WHERE `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')` AND `paid_at IS NOT NULL`.
  - **Total Booked Sales:** Paid Sales + $\sum \text{orders.total\_amount}$ WHERE `payment_type = 'COD'` AND `status IN ('ACCEPTED', 'FULFILLED')` AND `paid_at IS NULL`.
- **Visualization:** Hero stat card with Paid Sales in high-contrast bold, Total Booked Sales as a secondary baseline beneath, and a percentage gap indicator.
- **Decision Value:** Identifies working capital exposure caused by in-transit shipments.

---

### KPI 2: Cash-on-Delivery (COD) Collection Success Rate
- **User Question:** "What share of my COD orders actually get paid upon delivery?"
- **Formula:**
  $$\text{COD Success Rate} = \frac{\text{Count of COD Orders with } \text{status} = \text{'COMPLETED'}}{\text{Count of COD Orders with } \text{status} \in (\text{'COMPLETED'}, \text{'CANCELLED'}, \text{'REJECTED'})} \times 100$$
- **Visualization:** Donut chart or 3-segment progress bar:
  - 🟢 **Collected:** Payment confirmed by courier.
  - 🟡 **In-Transit:** Out for delivery.
  - 🔴 **Refused / Returned:** Buyer rejected package at delivery.
- **Decision Value:** Directly points to delivery carrier issues, customer unresponsiveness, or packaging damage.

---

## 2. Storefront Conversion Funnel

### KPI 3: Storefront Visit-to-Order Conversion Funnel
- **User Question:** "Where are potential customers dropping out before completing an order?"
- **Funnel Stages:**
  1. **Storefront Visits:** Distinct user browsing sessions.
  2. **Product Page Views:** Sessions viewing at least one product detail page.
  3. **Add to Cart:** Sessions initiating cart items.
  4. **Checkout Started:** Sessions reaching checkout payment gateway.
  5. **Paid Orders:** Finalized transactions.
- **Visualization:** Horizontal funnel bar showing conversion rate between adjacent steps and overall visit-to-paid conversion percentage.
- **Decision Value:** Distinguishes marketing traffic quality (Stage 1 to 2) from checkout pricing/shipping friction (Stage 4 to 5).

---

## 3. Customer Retention & Loyalty

### KPI 4: New vs. Returning Customers
- **User Question:** "Are customers coming back to buy again?"
- **Definition:**
  - **New Customer:** Customer whose first paid order occurred within the selected date window.
  - **Returning Customer:** Customer with at least one prior paid order before the current period.
- **Visualization:** Stacked bar chart showing percentage share and total revenue contribution from each cohort.
- **Decision Value:** High-growth stores require steady new customer acquisition, while sustainable profit margins rely on repeat customer retention.

---

### KPI 5: Customer Purchase Frequency Distribution
- **User Question:** "How frequently do buyers place repeat orders?"
- **Buckets:**
  - `1 Order` (One-time buyers)
  - `2–3 Orders` (Emerging repeat buyers)
  - `4+ Orders` (High-loyalty VIP buyers)
- **Visualization:** Histogram column chart with buyer counts and average revenue per bucket.
- **Decision Value:** Informs whether to launch VIP loyalty programs or focus on post-purchase email re-engagement.

---

## 4. Order Losses & Leakage Diagnostics

### KPI 6: Cancellations & Refunds by Reason
- **User Question:** "Why am I losing orders after checkout?"
- **Population:** All orders transitioning to `CANCELLED` or `REFUNDED`.
- **Reason Breakdown Categories:**
  - `MERCHANT_DECISION_TIMEOUT` (Auto-cancelled after 24h)
  - `OUT_OF_STOCK` (Merchant lacked inventory)
  - `CUSTOMER_REQUESTED` (Buyer changed mind)
  - `COD_DELIVERY_REFUSED` (Customer refused courier delivery)
  - `PAYMENT_EXPIRED` (Checkout window expired)
- **Visualization:** Horizontal bar breakdown ranked by dollar value and incident count.
- **Decision Value:** Highlights preventable operational failures (e.g., late order acceptance, stock inaccuracies).
