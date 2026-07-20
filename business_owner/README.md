# Business-Owner Dashboard — Stakeholder Summary

## Purpose

Help an Angkoro store owner answer two simple things:

1. **Is paid business happening?**
2. **What work needs attention now?**

This page is the presentation view. The complete question register, decision reasoning, stakeholder explanations, supporting indicators, and wireframe are linked below.

## Recommended dashboard

### Business health

| Indicator | Plain-language answer | Why it matters |
|---|---|---|
| **Paid Sales** | How much customers paid for valid orders | Shows real paid business, with a matched previous-period comparison |
| **Paid Orders** | How many distinct orders became valid paid orders | Explains whether sales movement came from order volume |
| **Available Balance** | How much money is withdrawable right now | The owner's immediate cash question — a current snapshot, never a period metric |

### Immediate operations

| Indicator | Plain-language answer | Why it matters |
|---|---|---|
| **Orders Need Decision** | Which orders need accept/reject now | Prevents avoidable automatic cancellation |
| **Fulfillment Backlog** | Which accepted prepaid orders still need fulfillment | Keeps paid customer work moving |
| **Inventory Attention** | Which tracked items are out of stock or low stock | Helps the seller restock before more sales are affected |

## One-screen shape

```text
[ Paid Sales ] [ Paid Orders ] [ Available Balance — snapshot ]

[ Need Decision ] [ Fulfillment ] [ Inventory Attention ]

[ Average Paid Order Value    ] [ Top Products — top 5 ]

[ Store Readiness — only when setup needs attention ]
```

These are not equal cards. Paid Sales and Paid Orders monitor business health; Available Balance is a "right now" cash snapshot with no period or trend; the three queues lead to immediate work.

## Supporting and conditional content

These explain the primary KPIs or appear only when needed; they do not compete as equal headline cards:

- Average Paid Order Value
- Top Products — ranked by paid units
- Store Readiness for new or blocked stores

## Adopted v1 decisions

- **Reporting timezone:** `Asia/Phnom_Penh`
- **Comparison:** Equal-length immediately preceding period
- **Paid Sales:** Valid gross product-payment amount before later refunds, separated by currency
- **Low Stock:** Tracked sellable item with **1–5 available units**; a global v1 heuristic, not a demand-aware reorder point
- **Out of Stock:** Tracked sellable item with **0 or fewer available units**
- **Refund KPI:** Not displayed, following stakeholder feedback

These are analytics-lead decisions for v1, not unresolved team checkboxes. A future stored store timezone or configurable stock threshold can replace the defaults without changing the dashboard purpose.

### Paid Sales and “where is my money?”

Paid Sales measures valid commerce; it does not equal money available for payout. The overview must provide a visible authorized path to the finance surface answering BO-M01 and BO-M02: available balance by currency, pending or escrowed online funds, and payout state. COD cash remains with the seller and does not enter the platform wallet. If that finance detail is unavailable, show it as not connected rather than imply Paid Sales and wallet balance should match.

## Delivery reality

The required database fields mostly exist, but the current frontend dashboard calculations are not reliable enough to implement these definitions. Engineering needs governed backend aggregates and server-computed action queues. Until corrected, the existing analytics route should be hidden or disabled before seller exposure rather than left live with known-invalid numbers.

No production values were calculated for this document.

## Documentation map

- [01 — Question register](./01_Questions.md) — all 60 stable IDs and full questions only; no evaluation reasoning
- [02 — Evaluation and decision record](./02_Evaluation.md) — plain Decision, Priority, Data, Status, Why, and selected dashboard item for every question
- [03 — Dashboard content](./03_Dashboard_Content.md) — complete catalog of primary KPIs, action queues, supporting views, and conditional content
- [04 — Dashboard grouping and wireframe](./04_Dashboard_Grouping_and_Wireframe.md) — simple grouping, one overview wireframe, and an eight-item display guide
- [Shared source audit](../00_Source_Audit_and_Decisions.md) — verified source behavior and known implementation traps

The evaluation page is self-contained. A reader does not need to switch to the question inventory to understand any decision.
