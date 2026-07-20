# Angkoro Analytics — Current Evidence-Grounded Documentation

**Status:** Analytics-lead specification adopted; technical build pending  
**Prepared:** 18 July 2026  
**Evidence boundary:** Live source code and documentation inspected; no production values calculated

## Documentation goal

Define role-appropriate Angkoro dashboards that answer important recurring decisions honestly. The business-owner surface stays focused; the platform-admin surface provides full-platform oversight while labeling unavailable capabilities as planned.

The dashboard is a **Monitor / Operate** surface:

- monitor essential paid-business or paid-platform health;
- expose urgent action queues;
- provide focused explanation and drill-down;
- preserve complete decision reasoning; and
- avoid an all-purpose chart warehouse.

## Recommended Notion page structure

Create one top-level Notion page named **Angkoro Analytics Documentation** and import the Markdown pages into this hierarchy:

```text
Angkoro Analytics Documentation
│
├── 00 — Source Audit and Adopted Decisions
│
├── Business Owner Dashboard
│   ├── Overview and Stakeholder Summary
│   ├── 01 — Question Register
│   ├── 02 — Question Evaluation and Decision Record
│   ├── 03 — Dashboard Content
│   └── 04 — Dashboard Grouping and Wireframe
│
└── Platform Admin Dashboard
    ├── Overview and Stakeholder Summary
    ├── 01 — Question Register
    ├── 02 — Question Evaluation and Decision Record
    ├── 03 — Dashboard Content
    └── 04 — Dashboard Grouping and Wireframe
```

Use each role’s `README.md` as the role landing page. The numeric prefixes preserve a clear reading order after import.

## Reading paths

Different readers should not be forced through the same level of detail.

### Stakeholder or presentation path

For the relevant role, read:

1. `README.md` — one-page recommendation and decisions
2. `03_Dashboard_Content.md` — approved current dashboard content only; planned capability decisions remain in `02_Evaluation.md`
3. `04_Dashboard_Grouping_and_Wireframe.md` — grouping, overview wireframe, and purpose-fit presentations for the catalog
4. `02_Evaluation.md` — only when someone asks why a specific question was selected, merged, deferred, or rejected

### Product, analytics, or project-management path

Read:

1. `00_Source_Audit_and_Decisions.md`
2. the role’s `01_Questions.md`
3. the role’s `02_Evaluation.md`
4. the role’s `03_Dashboard_Content.md`
5. the role’s `04_Dashboard_Grouping_and_Wireframe.md`

## File index

### Shared evidence

- [`00_Source_Audit_and_Decisions.md`](00_Source_Audit_and_Decisions.md) — verified source behavior, known calculation traps, adopted v1 rules, and external boundaries

### Business owner

- [`business_owner/README.md`](business_owner/README.md) — stakeholder landing page
- [`business_owner/01_Questions.md`](business_owner/01_Questions.md) — strict register of 60 IDs and full questions; no evaluation reasoning
- [`business_owner/02_Evaluation.md`](business_owner/02_Evaluation.md) — 60 plain-language evaluations using Decision, Priority, Data, Status, Why, and Dashboard item when selected
- [`business_owner/03_Dashboard_Content.md`](business_owner/03_Dashboard_Content.md) — nine approved dashboard items classified by content type, meaning, use, and guardrail
- [`business_owner/04_Dashboard_Grouping_and_Wireframe.md`](business_owner/04_Dashboard_Grouping_and_Wireframe.md) — grouping with reasoning, one overview wireframe, and a nine-item display guide


### Platform admin

- [`admin/README.md`](admin/README.md) — stakeholder landing page
- [`admin/01_Questions.md`](admin/01_Questions.md) — strict register of 67 IDs and full questions, including monetization, security, and abuse oversight
- [`admin/02_Evaluation.md`](admin/02_Evaluation.md) — verdict tables for all 67 questions plus the seven adopted operating rules (20 July 2026)
- [`admin/03_Dashboard_Content.md`](admin/03_Dashboard_Content.md) — complete catalog of the 15 approved current items, using the same content template as the business-owner page
- [`admin/04_Dashboard_Grouping_and_Wireframe.md`](admin/04_Dashboard_Grouping_and_Wireframe.md) — simple grouping, one overview wireframe, and a 15-item display guide


## Self-contained documentation rule

`01_Questions.md` and `02_Evaluation.md` have deliberately different jobs:

- `01` is a fast question register. It contains categories, stable IDs, and full questions only.
- `02` is the authoritative evaluation and decision record.

Every entry in `02_Evaluation.md` includes:

- the full question;
- a clear decision;
- priority, data readiness, and status on one line;
- one plain-language **Why**; and
- the dashboard item only when the question is selected or combined.

A reader can scan `01` without evaluation detail and can read any `02` entry without switching back to decode its ID.

Because this repetition improves standalone Notion reading but increases maintenance cost, `02` remains the authority for disposition. Any question, selection, or wording change must update every repeated occurrence in the same change and pass exact-ID, exact-question, `03`/`04`, count, type, and link validation before the pack is called current.

## Method

```text
Live product evidence
→ atomic user questions
→ duplicate and drill-down clustering
→ detailed evaluation of every question
→ role-appropriate approved current dashboard content
→ planned capability decisions retained in `02`
→ stakeholder definitions and layout
```

Question priority comes before KPI choice. A measure is selected because its question serves an important recurring decision—not because it is common in ecommerce or SaaS dashboards.

## Shared outcome relationship

`BO-S01 — Paid Sales` is the store-scoped view of the same governed paid-event population summarized platform-wide by `AD-C02 — Platform Paid Sales`. Both keep currency separate and use the same validity boundary. This is merchant-commerce activity—not Angkoro subscription revenue—and the team has not adopted a single North Star metric.

## Data-readiness labels

- **Current data** — required fields exist in the live model; a governed aggregate or queue may still need implementation.
- **Partial** — some evidence exists, but coverage, history, identity, or reason coding is incomplete.
- **Needs rule** — fields exist, but an operating definition, cohort, threshold, or service target is missing.
- **Gap** — Angkoro does not reliably record the required event, denominator, cost, history, or attribution.

Data readiness and delivery readiness are different. A database field does not prove that the current frontend calculates the measure correctly.

## Approved business-owner dashboard content

### Business health

1. **Paid Sales** — Valid product-payment value in the selected period, with matched comparison
2. **Paid Orders** — Distinct valid paid orders in the same period
3. **Available Balance** — Withdrawable wallet money right now (current snapshot, never period-scoped)

### Immediate operations

4. **Orders Need Decision** — Open accept/reject work, nearest deadline first
5. **Fulfillment Backlog** — Accepted prepaid orders still needing fulfillment
6. **Inventory Attention** — Out of Stock at 0 or below; Low Stock at 1–5 available tracked units

### Supporting and conditional content

7. **Average Paid Order Value** — Supporting explanation for Paid Sales and Paid Orders
8. **Top Products** — Ranked breakdown by valid paid units
9. **Store Readiness** — Conditional setup checklist for new or blocked stores

## Current platform-admin dashboard content

The current admin dashboard contains 15 items:

1. **Platform health** — four primary KPIs: Active Paid Stores (with net change), Subscription MRR & Collections, Platform Paid Sales & Orders, and Payment Success Rate
2. **Growth** — the store activation funnel (created → activated → first paid order)
3. **Action center** — four SLA-managed administrator queues plus a conditional failed-onboarding alert
4. **Trust and control** — five conditional statuses, including the new System Status chip

All 67 questions remain evaluated in `02`, together with the seven operating rules adopted on 20 July 2026 that unblocked MRR, churn, payment success rate, and queue SLAs. Infrastructure capacity/backups, security/incidents, support/governance, and COD collection failure remain explicit planned boundaries with reasons rather than additional dashboard widgets.

## Important implementation warning

The existing seller analytics page is not a trustworthy metric source. It aggregates a limited order page in the browser, uses order creation time for monthly results, includes inappropriate statuses in several calculations, and hardcodes USD formatting. The backend statistics endpoint also needs correction before dashboard reuse.

**Interim containment:** Hide or disable that seller analytics route before seller exposure, or correct its calculations and labels first. Do not leave known-invalid numbers live as the temporary baseline while the replacement dashboard is built.

See the source audit for the verified evidence and known calculation problems.

Before engineering begins, each approved item requires a separate implementation metric contract covering population, authoritative event timestamp, grain, inclusion/exclusion rules, currency, source fields, per-item freshness/stale behavior, exact role/guard/permission and step-up mapping, server-side action revalidation, and verification tests. The role `03_Dashboard_Content.md` pages are intentionally stakeholder catalogs—not substitutes for that technical handoff.

## Dashboard lifecycle gate

This package is ready for stakeholder review, but recurring delivery remains blocked until the operating responsibilities below are assigned. `Not assigned` is an explicit delivery gate, not permission to invent a default.

| Requirement | Current state before delivery |
|---|---|
| Dashboard artifact owner | Not assigned — required before delivery |
| Metric-definition owner | Analytics task lead owns this specification; each implementation contract must name the ongoing definition approver |
| Per-item refresh cadence and stale threshold | Not assigned — required in each implementation contract |
| Refresh-failure and incident owner | Not assigned — required before delivery |
| Adoption and decision-use measure | Not defined — required before delivery |
| Maintenance owner and expected burden | Not assigned — required before delivery |
| Review date or cadence | Not scheduled — required before delivery |
| Retirement or consolidation criterion | Not defined — required before delivery |
| Accessibility verification | Required before delivery: readable labels, no color-only status encoding, and keyboard/assistive-technology checks |

## Evidence and authority boundary

This pack defines analytics questions, decisions, stakeholder interpretation, source evidence, evidence boundaries, layout, and acceptance expectations.

It does not claim:

- that production values were calculated;
- that the dashboards are already implemented;
- that operational analytics equals certified accounting revenue;
- that missing service-level or cohort rules have been silently invented; or
- that sensitive administrator actions may bypass existing authorization and audit controls;
- that a missing security, WAF, infrastructure, backup, queue, or incident source proves the platform is healthy; or
- that an anomaly signal proves fraud, abuse, or compromise without investigation.
