# 0. Source Audit and Product Decisions

## Executive verdict

Angkoro has enough order, payment, inventory, subscription, onboarding, bank-account, wallet, and payout structure to design useful dashboards. The current dashboard UI and APIs are **not yet a governed analytics layer**.

This rebuild therefore separates:

- what the database can support;
- what the current API/UI already supports correctly;
- what needs a business rule;
- what requires new tracking; and
- what is only a recommendation.

## Evidence order used

1. Live backend entities, services, controllers, and lifecycle code.
2. Live frontend API wrappers and dashboard pages.
3. Workspace product documentation.
4. Previous Angkoro analytics drafts, read only after the live-source conclusions were formed.
5. Curated analytics methodology and external Reddit research.

No `.env` files, credentials, or production records were read.

## Product facts verified from code

### Orders and seller decisions

- Order states are `DRAFT`, `PENDING_PAYMENT`, `PAID`, `ACCEPTED`, `REJECTED`, `FULFILLED`, `COMPLETED`, `CANCELLED`, `REFUNDED`, and `EXPIRED`.
- Prepaid orders need an accept/reject decision while status is `PAID`.
- COD orders need that decision while status is `PENDING_PAYMENT` and their product payment provider is `COD`.
- The decision clock starts at `paidAt` for prepaid orders and `createdAt` for COD orders.
- A delayed job plus cron backstop auto-cancels missed decisions. The current default is 24 hours, but deployment may override it.
- System timeout cancellations use a deterministic reason beginning `Auto-cancelled: the store did not accept or reject within ...` and leave `cancelledByUserId` null.

**Source:**

- `angkoro/Angkoro-Backend/src/tenants/commerce/orders/entities/order.entity.ts`
- `angkoro/Angkoro-Backend/src/tenants/commerce/orders/order-decision-timeout.cron.ts`
- `angkoro/Angkoro-Backend/src/tenants/commerce/orders/processors/order-decision.processor.ts`

### Valid paid business

- Product payments contain `type`, `status`, `amount`, `currency`, `orderId`, `amountRefunded`, and `succeededAt`.
- Successful normal settlement changes the linked order from `PENDING_PAYMENT` to `PAID` and sets `paidAt`.
- A late capture on a `CANCELLED` or `EXPIRED` order can still set the payment to successful, but it does **not** set `order.paidAt`; Angkoro holds and auto-refunds that captured money.
- Therefore, `payment.succeededAt` alone is not enough for seller Paid Sales. A valid-sale rule must also require the linked order’s `paidAt`.
- COD follows a separate durable path: only the seller's cash-collected confirmation changes its payment to `SUCCEEDED`, stamps `payment.succeededAt` and `order.paidAt`, and completes the order. COD placement, acceptance, or fulfillment alone does not enter Paid Sales or Paid Orders.
- ABA checkout supports card and KHQR payment methods, including an ABA PayWay `bakong` payment-option value. Provider/method performance still belongs in supporting analysis until its denominator and operating use are governed.

**Source:**

- `angkoro/Angkoro-Backend/src/billing/payments/entities/payment.entity.ts`
- `angkoro/Angkoro-Backend/src/billing/payments/product-settlement.service.ts`
- `angkoro/Angkoro-Backend/src/billing/checkout/checkout.controller.ts`
- `angkoro/Angkoro-Backend/src/tenants/commerce/orders/orders.service.ts`

### Operational platform fees

- The double-entry ledger has `PLATFORM_FEE` and `PLATFORM_REVENUE` account types.
- Escrow settlement can credit `PLATFORM_FEE`; a later settled-funds refund can debit the recognized fee. Completed payouts can also credit `PLATFORM_FEE` for a withdrawal fee.
- Current product-payment creation sets `platformFee` to zero, current payout requests set `fee` to zero, and COD explicitly takes no per-order commission. The fee rails exist, but current code does not activate a non-zero commerce or payout fee policy.
- No live posting path was found for the general `PLATFORM_REVENUE` account. Its presence in the enum is not evidence of recognized revenue.

**Source:**

- `angkoro/Angkoro-Backend/src/billing/payments/payments.service.ts`
- `angkoro/Angkoro-Backend/src/billing/escrow/escrow.service.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/payout.service.ts`
- `angkoro/Angkoro-Backend/src/billing/ledger/entities/ledger-account.entity.ts`

### Inventory

- Available units are `stock - reserved`.
- Inventory is stored at product or variant grain.
- Untracked products/variants must not be called out of stock.
- There is no approved low-stock threshold.
- The API can retrieve inventory for one product or one product/variant, but there is no store-wide low-stock aggregate endpoint.

**Source:**

- `angkoro/Angkoro-Backend/src/tenants/commerce/inventory/entities/inventory.entity.ts`
- `angkoro/Angkoro-Backend/src/tenants/commerce/inventory/inventory.controller.ts`

### Platform subscriptions and payouts

- Subscription states distinguish `ACTIVE`, `GRACE`, `FAILED`, `EXPIRED`, `CANCELLED`, `SUSPENDED`, and `BANNED`.
- `GRACE` remains usable during the already-paid period after a renewal failure.
- Initial payment failure is distinct from deliberate cancellation, enabling clean onboarding diagnostics.
- Valid subscription collection is recorded authoritatively by a `PAID` subscription invoice and its `paidAt`. The generic subscription payment path does not stamp `Payment.succeededAt`, so raw payment success time must not be used for this metric.
- Payouts distinguish `REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED`, and `CANCELLED` and record lifecycle timestamps.
- Bank accounts distinguish `PENDING`, `VERIFIED`, `REJECTED`, and `DISABLED`.
- A paginated platform-admin bank-account queue already exists at `GET /admin/bank-accounts`; it supports `status=PENDING`, returns safe last-four-digit projections, and includes total-count metadata.
- The existing bank-account queue returns newest first and exposes no sort parameter; the dashboard requires a server-side oldest-first enhancement for work prioritization.
- The admin payout controller can act on a payout by ID but does not expose a platform-wide work queue.
- No independent dashboard-wide reconciliation job was found. AD-R07 has authoritative source facts available, but it cannot show a passing state until a separately computed check is implemented and completed successfully.

**Source:**

- `angkoro/Angkoro-Backend/src/billing/subscriptions/entities/subscriptions.entity.ts`
- `angkoro/Angkoro-Backend/src/billing/subscriptions/entities/subscription-invoice.entity.ts`
- `angkoro/Angkoro-Backend/src/billing/subscriptions/services/subscription-invoice.service.ts`
- `angkoro/Angkoro-Backend/src/billing/payments/payments.service.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/entities/payout.entity.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/entities/store-bank-account.entity.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/store-bank-account.service.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/bank-account-admin.controller.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/payout-admin.controller.ts`

### Authorization evidence for money workflows

- Store wallet and payout reads require `billing:view_payouts`; payout creation/cancellation requires `billing:manage_payouts`.
- Store bank-account mutations require `billing:manage_bank_accounts`, with step-up authentication on sensitive operations such as adding, revealing, changing, or disabling payout destinations.
- Platform-admin payout and bank-account operations require the platform `ADMIN` role. Full bank-account-number reveal additionally requires step-up authentication and is audit-logged.
- Dashboard visibility, row navigation, evidence reveal, and mutation authority are different permissions. Each delivery contract must map them separately rather than treating access to a summary card as authority to perform the action.

**Source:**

- `angkoro/Angkoro-Backend/src/billing/wallet/wallet.controller.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/payout.controller.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/store-bank-account.controller.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/payout-admin.controller.ts`
- `angkoro/Angkoro-Backend/src/billing/payouts/bank-account-admin.controller.ts`

### Security, reliability, and incident visibility

- Global request throttling is configured, with stricter payment and financial endpoint presets.
- Authentication and verification endpoints use IP-based lockout. Attempts are temporary Redis state and produce structured lockout logs; they are not a durable administrator-facing history.
- Sessions persist IP address, user agent, channel, last-use time, and revocation state. The current source does not provide governed suspicious-session detection or a platform-admin anomaly queue.
- Payment-provider callbacks are persisted before processing with status, attempts, signature result, processing error, timestamps, and correlation identifiers. This can support future failed/unmatched webhook recovery, subject to safe projection and workflow rules.
- BullMQ queues and cron backstops run critical work, but no administrator queue-health aggregate, failed-job console, or recovery dashboard was found.
- The API exposes a simple `GET /ping` liveness probe. Optional Sentry integration captures application errors when configured, but no governed availability, latency, error-rate, or SLA series was found.
- No consolidated WAF or edge-security feed, durable security-event store, cross-platform anomaly engine, infrastructure-capacity feed, backup-status source, or authoritative incident workflow was found.
- Some sensitive operations preserve reasons or action-specific audit evidence, but no general audit entity proving complete actor/time/reason/result coverage across all sensitive administrator actions was found.

**Source:**

- `angkoro/Angkoro-Backend/src/app.module.ts`
- `angkoro/Angkoro-Backend/src/shared/throttling/throttle-presets.ts`
- `angkoro/Angkoro-Backend/src/infra/redis/services/ip-lockout.service.ts`
- `angkoro/Angkoro-Backend/src/core/auth/entities/session.entity.ts`
- `angkoro/Angkoro-Backend/src/core/auth/services/session.service.ts`
- `angkoro/Angkoro-Backend/src/billing/payments/entities/payment-callback.entity.ts`
- `angkoro/Angkoro-Backend/src/infra/queue/queue.module.ts`
- `angkoro/Angkoro-Backend/src/app.controller.ts`
- `angkoro/Angkoro-Backend/src/instrument.ts`

## External admin-dashboard research refresh

The July 2026 refresh used official sources to distinguish a dashboard overview from reports, queues, observability consoles, and security investigation tools.

- **Microsoft Power BI:** a dashboard is an overview for monitoring current state; details belong in underlying reports, the most important information should stand out, and a one-screen layout without unnecessary scrolling is preferred.  
  <https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips>
- **Stripe Dashboard:** Home combines business-performance analytics with important unresolved notifications, while balances, transactions, customers, products, and disputes live in dedicated resource areas and detail pages.  
  <https://docs.stripe.com/dashboard/basics>
- **Google SRE:** user-facing reliability should focus on latency, traffic, errors, and saturation; alerts should represent clear, significant, actionable symptoms with low noise rather than vague abnormality.  
  <https://sre.google/sre-book/monitoring-distributed-systems/>  
  <https://sre.google/workbook/alerting-on-slos/>
- **Grafana:** select monitoring signals deliberately, use user-symptom methods such as RED separately from resource-cause methods such as USE, and reduce cognitive load.  
  <https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/>
- **Cloudflare:** Security Events summarizes flagged or mitigated traffic by action, service, and source, then supports filtering and event-level investigation; it does not turn every raw event into an overview card.  
  <https://developers.cloudflare.com/waf/analytics/security-events/>  
  <https://developers.cloudflare.com/security-center/>
- **Sentry:** large event volume is grouped into manageable issues for filtering, impact assessment, and triage; alert rules add severity-aware actions and integrations.  
  <https://docs.sentry.io/product/issues/>  
  <https://docs.sentry.io/product/alerts/>
- **OWASP:** security logging should capture when, where, who, and what, while security, audit, transaction, and other log purposes may need separation and restricted access.  
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- **NIST SP 800-61 Rev. 3:** incident response belongs across preparation, detection, response, and recovery activities rather than being reduced to an isolated dashboard count.  
  <https://csrc.nist.gov/pubs/sp/800/61/r3/final>
- **Progressive disclosure:** high-level pages should present high-level concepts and defer secondary detail, because appearing on the initial display signals importance.  
  <https://www.nngroup.com/articles/progressive-disclosure/>

### Research decision applied

1. Keep the current admin overview to health, urgent action, and trust/control decisions.
2. Embed supporting acquisition/merchant-activation context beneath related health KPIs.
3. Route explanations and diagnostics to reports, operational rows to queues, and raw security evidence to investigation tools.
4. Represent missing full-platform capabilities as four planned boundaries—not dozens of unavailable widgets.
5. Never convert absent telemetry into zero, healthy, no attack, or no incident.

## Current dashboard calculations that must not become the baseline

### Seller analytics page

`angkoro/Angkoro-Frontend/app/s/[subdomain]/dashboard/analytics/page.tsx` currently:

- requests only page 1 with `limit: 200`;
- builds monthly revenue from those listed orders and their `createdAt`;
- sums every listed order status for fallback revenue;
- builds top products from every listed order status;
- divides backend revenue by the list’s total-order count instead of using the backend’s `averageOrderValue`; and
- formats every amount as USD divided by 100.

This can produce incomplete, status-invalid, date-invalid, or currency-invalid results.

**Interim containment decision:** Because this route is present in seller navigation and renders known-invalid analytics, hide or disable it before seller exposure or correct its calculations and labels first. It must not remain the temporary production baseline while the governed replacement is built.

### Seller overview page

`angkoro/Angkoro-Frontend/app/s/[subdomain]/dashboard/page.tsx` currently:

- treats only `PENDING_PAYMENT` as pending, missing prepaid `PAID` orders awaiting a decision;
- falls back to revenue from five recent orders;
- labels results “lifetime” even when a fallback is partial; and
- also hardcodes USD formatting.

### Backend order statistics

`OrdersService.getStatistics()` currently:

- filters periods by `order.createdAt`;
- counts revenue only for orders whose **current** status is `PAID` or `COMPLETED`;
- omits valid paid orders that have moved to `ACCEPTED` or `FULFILLED`; and
- conflicts with the response DTO’s written average-order description.

The endpoint is useful as implementation history, not as the final metric contract.

## Test evidence

No matching `.spec.ts` tests were found for:

- order-statistics formulas;
- Paid Sales currency/date semantics;
- decision-timeout analytics classification;
- store-wide low-stock aggregation; or
- dashboard currency formatting.

Code support is therefore not the same as analytics verification.

## Feedback reconciliation

### Current sales versus last week or month

Accepted. The selected seller sales card uses a chosen period and the immediately preceding equal-length period. The authoritative event time is the linked order's `paidAt`, stamped by valid settlement or confirmed COD cash collection—not order creation time or an orphan late-capture success timestamp.

### Orders cancelled because the store accepted too late

Accepted as a visible diagnostic. Current data can infer these rows from the timeout reason, but a machine-readable cancellation source/reason code is recommended before treating the count as governed.

### Low stock below five or another amount

Adopted for v1 by the analytics task lead: **Low Stock = 1–5 available tracked units**. Zero or below belongs to Out of Stock and is not double-counted. The API returns the applied threshold so a future store-specific setting can replace the v1 default.

### Remove refund KPI A2

Applied. No refund KPI is selected or proposed for the seller dashboard. Automatic gateway reversals still exist in backend code and remain a reconciliation concern, but they are not presented as a seller KPI.

## What previous drafts contributed—and what was rejected

Useful ideas retained:

- use payment/paid event time for sales;
- do not aggregate from a paginated frontend list;
- keep currencies separate;
- separate current actions from historical performance;
- expose data and business-rule gaps.

Scope rejected:

- the historical `0/First_Principles_Redo` proposal of 17 core KPIs, seven Power BI pages, and a star schema before real dashboard usage;
- the previous admin inventory of 78 questions as an undeduplicated final scope; its useful coverage plus explicit security and operational platform-fee questions was preserved in 66 distinct questions (67 after the 20 July 2026 addition of AD-C08, COD cash-collection failure);
- the previous business-owner inventory of 92 questions as an undeduplicated final scope; its useful coverage is preserved in 60 distinct questions; and
- refund-centered seller reporting after the explicit product feedback.

## External Reddit evidence used carefully

### Evidence boundary

The July source-level Reddit audit found no universal dashboard-versus-insight ratio. The material is self-selected practitioner testimony, not prevalence evidence, and it cannot validate Angkoro's exact item counts or metric ranking.

The original provenance files listed below were reviewed during the July research but are not bundled with this stakeholder package. A 19 July recheck did not find them in the active or legacy analytics-skill stores, and direct retrieval of the five preserved Reddit comment IDs returned HTTP 403. This stress test therefore uses only the previously validated comment-ID claim ledger retained here; it is not a fresh corpus-wide recoding.

Historical provenance paths:

- `research-sources/data-analytics/provenance/reddit-2026-07/reddit-data-analytics-research-2026-07-18.md`
- `research-sources/data-analytics/provenance/reddit-2026-07/target-comments-tree.md`
- `research-sources/data-analytics/provenance/reddit-2026-07/broader/broader-sample.md`

### Final-dashboard stress test

| Preserved practitioner principle | Final Angkoro design test | Result |
|---|---|---|
| Start from a real problem rather than opening data and hoping for insight (`m9jwikq`) | The business-owner dashboard serves paid-business health and immediate seller work. The admin dashboard serves platform health, urgent administrator work, and control integrity. The 60/66-question inventories remain in `01`/`02` rather than becoming equal widgets. | **Pass** |
| Early data functions often need a small foundational dashboard (`m9huld8`) | Business owner has eight current items. Admin has 15 current items, but only four are primary KPIs; five are queues, two are subordinate explanations, and four are conditional controls. | **Pass with delivery guardrail** |
| Support two or three likely follow-up questions rather than expose every field (`m9tyyqt`) | Paid outcomes lead to volume, value, product, or activation context; queues lead to authorized work; control warnings lead to focused reconciliation. Reports and investigations retain detail outside the overview. | **Pass** |
| Filter and definition disputes create real operational costs (`m9nrcgv`, `m9o1g1e`) | Exact source questions, paid-event populations, period behavior, currency separation, lifecycle rules, readiness labels, freshness states, and interpretation guardrails are explicit across `02`–`04`. | **Pass** |

### Counterexamples and limits

- Reddit does **not** prove that eight and 15 are universally correct counts; those choices remain grounded in Angkoro's product, workflows, code, and operating stage.
- The admin design would fail the small-foundation principle if 15 items were rendered as equal, permanently visible cards. The approved hierarchy must remain four primary KPIs, subordinate supporting context, action queues, and compact conditional controls.
- Documentation detail is not permission to reproduce every definition on the runtime screen. `03` is the catalog; `04` preserves progressive disclosure.
- Practitioner advice favoring speed does not override Angkoro's financial, currency, privacy, lifecycle, and data-trust safeguards.

**Stress-test verdict: PASS WITH DELIVERY GUARDRAIL.** The Reddit evidence supports the final workflow, restraint, progressive disclosure, and semantic contracts. It does not support adding or removing a dashboard item. The next valid test is observed usage after delivery—especially seller finance discoverability and whether any admin control consumes permanent space while healthy.

## Adopted analytics decisions and external boundaries

1. **Reporting timezone:** V1 uses `Asia/Phnom_Penh`, matching Angkoro's Cambodian launch market. A future stored store timezone can replace it for international expansion.
2. **Period comparison:** Use the immediately preceding equal-length `[start, end)` period.
3. **Currency:** Never combine currencies without a governed conversion policy and rate source. Product and Finance own this decision and must approve the source, rate timestamp, rounding, and display treatment before any combined total appears.
4. **Low Stock:** V1 uses 1–5 available tracked units; Out of Stock is zero or below. This global heuristic can over-alert slow movers and under-alert fast movers; it is not days-of-cover or a product-specific reorder point.
5. **Metric authority:** The analytics task lead owns the dashboard definitions. Calling collection metrics certified accounting revenue remains a finance boundary.
6. **Freshness:** Every dashboard response exposes `asOf`/generation time plus explicit error and stale states. Each implementation contract must adopt an item-specific stale threshold, and every action must revalidate current server state rather than trust the displayed snapshot.
7. **Security and operations:** The future platform-admin product should add security posture and urgent alerts once authoritative telemetry and workflows exist. They are not current dashboard content; raw evidence and forensic work belong in a dedicated investigation surface or approved external tool.
8. **Unknown is not healthy:** Missing WAF, attack, queue, infrastructure, backup, or incident telemetry must display `Unknown` or `Not connected`, never zero, `Healthy`, or `No incidents`.
9. **Anomaly boundary:** Unusual traffic, session, account, store, payment, or payout signals require governed baselines, severity, false-positive controls, and human review; they are not proof of attack, fraud, abuse, or compromise.
10. **Reconciliation independence:** A served query, cache, or aggregate cannot certify itself. AD-R07 requires an independent recomputation path; absent, stale, or failed checks display `Unknown` or `Not connected`.
11. **Paid-to-available money:** Paid Sales is not wallet availability. The seller surface must link visibly to authorized finance detail for available balance, pending/escrow amounts, payout state, and the fact that COD cash remains with the seller.
