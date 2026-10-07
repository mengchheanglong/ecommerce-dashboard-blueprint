# Merchant Analytics Question Register

This register catalogs the complete set of **60 distinct decision questions** evaluated when designing an e-commerce merchant/store-owner analytics dashboard.

---

## Question Taxonomy

The questions are organized across 9 core commerce decision categories:

- **A. Sales & Paid Demand** (8 questions)
- **B. Orders & Merchant Decisions** (8 questions)
- **C. Fulfillment & Order Completion** (5 questions)
- **D. Products & Inventory Attention** (9 questions)
- **E. Customers & Retention** (7 questions)
- **F. Checkout & Payment Conversion** (6 questions)
- **G. Finances, Balance & Payouts** (6 questions)
- **H. Store Readiness & Setup Verification** (6 questions)
- **I. Advanced & Predictive Analytics** (5 questions)

---

## Category A: Sales & Paid Demand

Questions evaluating whether the store is generating real, verified revenue and what drives changes in sales volume.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-S01** | What was the total valid Paid Sales in the selected period, by currency? | Core headline revenue metric. |
| **BO-S02** | How many distinct Paid Orders were recorded? | Order volume metric; volume vs. price check. |
| **BO-S03** | How did Paid Sales and Paid Orders change compared to the previous period? | Growth velocity and trend comparison. |
| **BO-S04** | What was the Average Paid Order Value (AOV)? | Basket size and pricing effectiveness. |
| **BO-S05** | How did paid business split between Cash-on-Delivery (COD) and digital payment methods? | Payment preference and cash collection risk. |
| **BO-S06** | Which specific day produced the highest sales volume? | Campaign timing and weekday demand analysis. |
| **BO-S07** | How much paid value was later refunded or chargebacked? | Return rate and revenue retention. |
| **BO-S08** | What was the estimated gross profit or merchant margin? | Net profitability (requires unit cost tracking). |

---

## Category B: Orders & Merchant Decisions

Questions evaluating pending orders requiring immediate merchant action and preventable order loss.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-O01** | Which pending orders require the merchant to accept or reject right now? | Immediate operational work queue. |
| **BO-O02** | Which pending order reaches its auto-cancellation deadline first? | Prioritization by nearest SLA deadline. |
| **BO-O03** | How many orders auto-cancelled due to missed acceptance deadlines? | Unhandled demand loss and operational leakage. |
| **BO-O04** | What were the primary reasons for rejected orders? | Product out-of-stock or pricing discrepancies. |
| **BO-O05** | How many orders were cancelled by the customer vs. merchant vs. system? | Root-cause cancellation diagnosis. |
| **BO-O06** | How many checkout orders expired before payment was completed? | Checkout abandonment tracking. |
| **BO-O07** | How many active orders currently sit in each lifecycle status? | Operational pipeline overview. |
| **BO-O08** | What percentage of placed COD orders were accepted and successfully collected? | In-transit delivery return and refusal rate. |

---

## Category C: Fulfillment & Order Completion

Questions tracking order dispatch speed, packaging backlog, and fulfillment reliability.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-F01** | Which accepted prepaid orders currently await fulfillment/dispatch? | Active shipping backlog. |
| **BO-F02** | Which unfulfilled order has waited the longest? | Shipping bottleneck and SLA breach prevention. |
| **BO-F03** | What is the average duration from order acceptance to shipment dispatch? | Fulfillment cycle time. |
| **BO-F04** | What percentage of orders were dispatched within the promised delivery window? | On-time delivery SLA compliance. |
| **BO-F05** | How many orders reached terminal completed status? | Successfully finalized transactions. |

---

## Category D: Products & Inventory Attention

Questions evaluating product velocity, dead stock, and immediate stockout risks.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-I01** | Which products sold the most valid paid units in the period? | Demand ranking and restocking priorities. |
| **BO-I02** | Which products generated the highest gross revenue? | Revenue contribution by SKU. |
| **BO-I03** | Which product category generated the highest sales? | Category merchandising performance. |
| **BO-I04** | Which active products recorded zero sales in the period? | Dead stock and promotion candidates. |
| **BO-I05** | Which tracked products/variants are currently Out of Stock (0) or Low Stock (1–5)? | Urgent restocking action list. |
| **BO-I06** | How many reserved units are currently held by pending unfulfilled orders? | Available vs. physical stock clarity. |
| **BO-I07** | Which top-selling product is also approaching stockout? | High-risk revenue protection alert. |
| **BO-I08** | Estimated days of inventory remaining before stockout? | Inventory run-out forecast. |
| **BO-I09** | How much potential sales value was lost due to stockout days? | Stockout opportunity cost calculation. |

---

## Category E: Customers & Retention

Questions examining customer acquisition, guest checkout coverage, and repeat purchase loyalty.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-C01** | How many distinct customers placed a valid paid order in the period? | Active buying audience size. |
| **BO-C02** | What percentage of customers are repeat buyers? | Retention and store loyalty. |
| **BO-C03** | What was the split between new vs. returning customers? | Acquisition vs. retention balance. |
| **BO-C04** | Which geographic city, state, or region generated the most orders? | Shipping and regional marketing focus. |
| **BO-C05** | What percentage of orders originated from logged-in vs. guest checkouts? | Customer identity coverage. |
| **BO-C06** | Who are the store's top customers by lifetime spend? | VIP customer concierge list. |
| **BO-C07** | What is the average Customer Lifetime Value (CLV)? | Long-term customer acquisition ROI. |

---

## Category F: Checkout & Payment Conversion

Questions tracking payment reliability and checkout drop-off rates.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-P01** | What percentage of online payment attempts succeeded at checkout? | Payment gateway reliability. |
| **BO-P02** | How many customer payment attempts failed? | Checkout conversion friction. |
| **BO-P03** | Which payment method or card type had the highest decline rate? | Payment rail troubleshooting. |
| **BO-P04** | How long does payment capture take on average? | Checkout UX speed. |
| **BO-P05** | At which step in the multi-step checkout do shoppers abandon? | Checkout funnel optimization. |
| **BO-P06** | What is the overall storefront visit-to-order conversion rate? | Full-funnel conversion benchmark. |

---

## Category G: Finances, Balance & Payouts

Questions tracking the merchant wallet balance, escrow status, and payout schedule.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-M01** | How much store money is currently available for withdrawal right now? | Immediate working capital snapshot. |
| **BO-M02** | How much store money is pending settlement or held in escrow? | Forward liquidity pipeline. |
| **BO-M03** | How much balance is reserved for withdrawal requests in progress? | In-flight payout funds. |
| **BO-M04** | Did any payout request fail, and what was the reason? | Banking error notification. |
| **BO-M05** | What total payout volume was successfully disbursed to the merchant's bank? | Cumulative realized earnings. |
| **BO-M06** | What amount was deducted due to customer refunds or disputes? | Chargeback and refund liability. |

---

## Category H: Store Readiness & Setup Verification

Questions ensuring that store setup, payment connections, and catalog rules are operational.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-R01** | Is the store published and open to receive customer traffic? | Store visibility status. |
| **BO-R02** | Does the catalog have at least one active, in-stock, published product? | Catalog readiness. |
| **BO-R03** | Is at least one valid payment gateway configured and active? | Checkout payment readiness. |
| **BO-R04** | Is the merchant's settlement bank account verified for payouts? | Payout readiness. |
| **BO-R05** | Are order notification channels (Email, SMS, Webhooks) connected? | Operational notification alert readiness. |
| **BO-R06** | Are shipping zones and fulfillment rates configured? | Shipping policy completeness. |

---

## Category I: Advanced & Predictive Analytics

Forward-looking questions requiring specialized event tracking or predictive modeling.

| ID | Question | Operational Purpose |
|---|---|---|
| **BO-A01** | Which external marketing channel (Google, Meta, Direct) drove the most revenue? | Multi-touch attribution modeling. |
| **BO-A02** | What was the Return on Ad Spend (ROAS) across active campaigns? | Marketing budget efficiency. |
| **BO-A03** | Which products are most frequently purchased together in the same cart? | Cross-selling and product bundle logic. |
| **BO-A04** | What is the forecasted order volume for the next 14 days? | Predictive inventory planning. |
| **BO-A05** | Has there been an anomalous sudden shift in sales velocity or order size? | Automated anomaly detection. |
