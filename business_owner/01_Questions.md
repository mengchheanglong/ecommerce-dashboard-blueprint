# 1. Business-Owner Question Register

**In one line:** every distinct business-owner question considered before the dashboard was designed — 60 stable IDs and full questions only. Every decision and reason lives in [02_Evaluation.md](02_Evaluation.md).

## Page contents

- A. Sales and paid demand (8 questions)
- B. Orders and seller decisions (8 questions)
- C. Fulfillment and completion (5 questions)
- D. Products and inventory (9 questions)
- E. Customers (7 questions)
- F. Checkout and product payments (6 questions)
- G. Finance and payouts (6 questions)
- H. Store readiness (6 questions)
- I. Future and advanced analytics (5 questions)

## A. Sales and paid demand

These questions examine whether the store is generating valid paid business and what is driving movement in that result.

| ID | Question |
|---|---|
| BO-S01 | What was valid Paid Sales in the selected period, by currency? |
| BO-S02 | How many distinct Paid Orders were recorded? |
| BO-S03 | How did Paid Sales and Paid Orders change from the matched previous period? |
| BO-S04 | What was Average Paid Order Value? |
| BO-S05 | How did paid business split between COD and online payment? |
| BO-S06 | Which day produced the highest valid Paid Sales? |
| BO-S07 | How much paid value was later refunded or reversed? |
| BO-S08 | How much profit or margin did the store make? |

## B. Orders and seller decisions

These questions examine orders that need seller decisions and historical outcomes that may reveal preventable order loss.

| ID | Question |
|---|---|
| BO-O01 | Which orders need the seller to accept or reject now? |
| BO-O02 | Which waiting order reaches its decision deadline first? |
| BO-O03 | How many orders were auto-cancelled because the seller missed the decision deadline? |
| BO-O04 | How were rejected orders distributed by reason? |
| BO-O05 | How many orders were cancelled by the customer, seller, or system? |
| BO-O06 | How many orders expired before payment succeeded? |
| BO-O07 | How many current orders are in each lifecycle status? |
| BO-O08 | How many COD orders were placed, accepted, and cash-collected? |

## C. Fulfillment and completion

These questions examine accepted work that still needs fulfillment and the speed or quality of order completion.

| ID | Question |
|---|---|
| BO-F01 | Which accepted prepaid orders still need fulfillment? |
| BO-F02 | Which fulfillment item has waited the longest? |
| BO-F03 | How long does fulfillment normally take after acceptance? |
| BO-F04 | How many orders are overdue or fulfilled on time? |
| BO-F05 | How many orders reached completed status? |

## D. Products and inventory

These questions examine product demand, availability, reservations, and evidence needed for future replenishment decisions.

| ID | Question |
|---|---|
| BO-I01 | Which product sold the most valid paid units? |
| BO-I02 | Which product produced the most valid Paid Sales? |
| BO-I03 | Which category produced the most valid Paid Sales? |
| BO-I04 | Which active products recorded no paid units? |
| BO-I05 | Which tracked products or variants need inventory attention because they are out of stock or low stock? |
| BO-I06 | Which open-order reservations reduce each item's available units? |
| BO-I07 | Which best-selling item is also at inventory risk? |
| BO-I08 | How many days remain before an item runs out? |
| BO-I09 | How much paid value may have been lost during stockouts? |

## E. Customers

These questions examine known-customer coverage, repeat purchasing, and the limits of customer analytics in guest checkout.

| ID | Question |
|---|---|
| BO-C01 | How many identifiable customers placed a valid paid order? |
| BO-C02 | What percentage of identifiable paid customers purchased again? |
| BO-C03 | How many identifiable paid customers were new versus returning? |
| BO-C04 | Which city or province produced the most paid orders? |
| BO-C05 | What percentage of Paid Orders can be linked to a known customer? |
| BO-C06 | Which identifiable customer produced the highest valid paid value? |
| BO-C07 | What is customer lifetime value? |

## F. Checkout and product payments

These questions examine payment reliability and the journey evidence Angkoro would need for checkout conversion analysis.

| ID | Question |
|---|---|
| BO-P01 | What percentage of complete online product-payment attempts succeeded? |
| BO-P02 | How many online product-payment attempts failed? |
| BO-P03 | Which failure reason, provider, or method performs worst? |
| BO-P04 | How long does a successful product payment normally take? |
| BO-P05 | At which tracked checkout step were carts abandoned? |
| BO-P06 | What percentage of storefront visits became valid Paid Orders? |

## G. Finance and payouts

These questions examine the seller wallet and payout lifecycle. They belong primarily to an authorized finance surface.

| ID | Question |
|---|---|
| BO-M01 | How much store money is currently available for payout? |
| BO-M02 | How much store money is pending settlement or held in escrow? |
| BO-M03 | How much money is reserved for payout requests in progress? |
| BO-M04 | Which payout requests failed, and why? |
| BO-M05 | How much money was successfully paid out? |
| BO-M06 | How much seller money was reversed through refunds or settlement corrections? |

## H. Store readiness

These questions examine whether store setup, checkout, notifications, and payout readiness are blocking normal operation.

| ID | Question |
|---|---|
| BO-R01 | Is the store active and allowed to operate? |
| BO-R02 | Does the storefront have at least one active sellable product? |
| BO-R03 | Can customers use at least one configured checkout method? |
| BO-R04 | Is the payout bank account verified? |
| BO-R05 | Are Telegram and order notifications connected and enabled? |
| BO-R06 | Are required contact and fulfillment settings complete? |

## I. Future and advanced analytics

These questions are valuable later but require attribution, cost, history, or modeling evidence that Angkoro does not yet have.

| ID | Question |
|---|---|
| BO-A01 | Which traffic source produces the most valid paid business? |
| BO-A02 | Which campaign produces more value than it costs? |
| BO-A03 | Which products are often purchased together? |
| BO-A04 | What demand should the seller expect next? |
| BO-A05 | Which unusual business change needs investigation? |

## Register count

**60 distinct questions** are recorded. Every ID appears once with its complete evaluation in `02_Evaluation.md`.
