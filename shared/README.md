# Shared Analytics Standards & Architecture

This directory contains cross-cutting principles, calculation traps, and governance standards shared between the Platform Admin and Merchant Analytics dashboards.

---

## Directory Contents

| Document | Purpose |
|---|---|
| **[`01_Analytics_Audit_and_Pitfalls.md`](./01_Analytics_Audit_and_Pitfalls.md)** | Technical audit of common e-commerce calculation traps (timezone alignment, currency segregation, gross vs net revenue, cash-on-delivery handling, order state machines, double-entry ledger). |
| **[`02_Metric_Governance_Framework.md`](./02_Metric_Governance_Framework.md)** | Metric lifecycle, data-readiness maturity taxonomy (L1–L4), delivery gates, and the standardized **Metric Decision Contract Template**. |

---

## Key Principles

- **Question Before Visualization:** Metrics serve recurring decisions, not decorative vanity.
- **Explicit Authoritative Timestamps:** Always aggregate sales by verified order paid timestamps, never unverified checkout captures.
- **Segregated Multi-Currency:** Never sum distinct currencies into a single flat value.
- **Server-Side Aggregations:** Never rely on naive client-side loops over paginated records.
