# Shared Analytics Standards, Architecture & Workflow

This directory contains cross-cutting principles, calculation traps, governance standards, and the end-to-end implementation workflow shared across the Platform Admin, Merchant Overview, and Merchant Analytics dashboards.

---

## Directory Contents

| Document | Purpose |
|---|---|
| **[`01_Analytics_Audit_and_Pitfalls.md`](./01_Analytics_Audit_and_Pitfalls.md)** | Technical audit of common e-commerce calculation traps (timezone alignment, currency segregation, gross vs net revenue, cash-on-delivery handling, order state machines, double-entry ledger). |
| **[`02_Metric_Governance_Framework.md`](./02_Metric_Governance_Framework.md)** | Metric lifecycle, data-readiness maturity taxonomy (L1–L4), delivery gates, and the standardized **Metric Decision Contract Template**. |
| **[`03_End_to_End_Implementation_Workflow.md`](./03_End_to_End_Implementation_Workflow.md)** | **Full Development Roadmap:** Phase-by-phase development workflow, recommended tech stack (Next.js, Radix, TanStack Query, NestJS, Postgres), and pre-deployment go-live checklist. |

---

## Key Principles

- **Question Before Visualization:** Metrics serve recurring operational decisions, not decorative vanity.
- **Explicit Authoritative Timestamps:** Always aggregate sales by verified order paid timestamps, never unverified checkout captures.
- **Segregated Multi-Currency:** Never sum distinct currencies into a single flat value.
- **Server-Side Aggregations:** Never rely on naive client-side loops over paginated records.
- **Action-Oriented Queues:** Operational tasks sort by urgency (deadline or oldest submitted) with SLA alerts.
