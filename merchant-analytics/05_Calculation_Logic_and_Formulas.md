# Merchant Analytics Technical Calculation Logic & Formulas

This specification defines the backend SQL queries, data models, event timestamps, and state transitions for computing merchant metrics.

---

## 1. Authoritative Event Timestamps & Population Rules

### 1.1 The Authoritative Paid Timestamp Rule
All revenue and order metrics must filter strictly on `orders.paid_at`:

```sql
-- Core Authoritative Population Filter
WHERE order.status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')
  AND order.paid_at >= :start_time
  AND order.paid_at <  :end_time
```

### 1.2 Exclusion Criteria
The following records are strictly excluded from Paid Sales and Paid Orders:
- Orders in `DRAFT`, `PENDING_PAYMENT`, `EXPIRED`, or `REJECTED` status.
- Uncollected Cash-on-Delivery (COD) orders (where `payment.status != 'SUCCEEDED'`).
- System test orders or developer sandbox transactions.

---

## 2. Core SQL Aggregation Formulas

### 2.1 Paid Sales & Paid Orders Query
```sql
SELECT
    COUNT(DISTINCT o.id) AS paid_orders,
    SUM(o.total_amount)  AS paid_sales,
    o.currency           AS currency
FROM orders o
WHERE o.store_id = :store_id
  AND o.status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')
  AND o.paid_at >= :period_start
  AND o.paid_at <  :period_end
GROUP BY o.currency;
```

### 2.2 Average Order Value (AOV)
$$\text{AOV} = \frac{\text{Paid Sales}}{\text{Paid Orders}}$$
*Edge Case:* If `paid_orders = 0`, return `$0.00` (never divide by zero).

---

## 3. Operational Queue Queries

### 3.1 Orders Needing Decision
```sql
SELECT
    o.id,
    o.order_number,
    o.customer_name,
    o.total_amount,
    o.currency,
    o.decision_deadline,
    EXTRACT(EPOCH FROM (o.decision_deadline - NOW())) AS seconds_remaining
FROM orders o
WHERE o.store_id = :store_id
  AND (
      (o.payment_type = 'PREPAID' AND o.status = 'PAID')
      OR
      (o.payment_type = 'COD' AND o.status = 'PENDING_PAYMENT')
  )
ORDER BY o.decision_deadline ASC
LIMIT 10;
```

### 3.2 Fulfillment Backlog Query
```sql
SELECT
    o.id,
    o.order_number,
    o.customer_name,
    o.accepted_at,
    NOW() - o.accepted_at AS waiting_duration
FROM orders o
WHERE o.store_id = :store_id
  AND o.status = 'ACCEPTED'
ORDER BY o.accepted_at ASC
LIMIT 10;
```

### 3.3 Inventory Attention Query
```sql
SELECT
    p.id AS product_id,
    p.title AS product_name,
    pv.title AS variant_name,
    inv.physical_stock,
    inv.reserved_stock,
    (inv.physical_stock - inv.reserved_stock) AS available_units,
    CASE 
        WHEN (inv.physical_stock - inv.reserved_stock) <= 0 THEN 'OUT_OF_STOCK'
        WHEN (inv.physical_stock - inv.reserved_stock) <= 5 THEN 'LOW_STOCK'
    END AS alert_status
FROM inventory inv
JOIN product_variants pv ON pv.id = inv.variant_id
JOIN products p ON p.id = pv.product_id
WHERE p.store_id = :store_id
  AND inv.track_inventory = TRUE
  AND (inv.physical_stock - inv.reserved_stock) <= 5
ORDER BY available_units ASC
LIMIT 10;
```

---

## 4. Product Analytics & Ranking

### 4.1 Top Selling Products by Units Sold
```sql
SELECT
    p.id AS product_id,
    p.title AS product_name,
    p.thumbnail_url,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.total_price) AS gross_revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.store_id = :store_id
  AND o.status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')
  AND o.paid_at >= :period_start
  AND o.paid_at <  :period_end
GROUP BY p.id, p.title, p.thumbnail_url
ORDER BY units_sold DESC
LIMIT 5;
```

---

## 5. Timezone & Period Comparison Logic

### 5.1 Local Calendar Day Alignment
- The application stores timestamps in PostgreSQL as `TIMESTAMPTZ` (UTC).
- When a merchant requests "Today" or "Last 7 Days", timestamps must be truncated using the store's configured timezone:
```sql
-- Truncate to merchant's local day
date_trunc('day', o.paid_at AT TIME ZONE :store_timezone)
```

### 5.2 Equal-Length Preceding Period
Given a date filter $[T_{\text{start}}, T_{\text{end}}]$ of duration $D = T_{\text{end}} - T_{\text{start}}$:
- **Comparison Window:** $[T_{\text{start}} - D, T_{\text{start}}]$
- **Percentage Delta Formula:**
  $$\Delta\% = \frac{\text{Current Period Value} - \text{Prior Period Value}}{\text{Prior Period Value}} \times 100$$
- *Edge Case:* If `Prior Period Value = 0` and `Current Period Value > 0`, display `+100%` or `New` (never return `Infinity` or `NaN`).
