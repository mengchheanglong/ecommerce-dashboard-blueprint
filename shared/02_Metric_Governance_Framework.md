# Metric Governance Framework & Delivery Lifecycle

A reusable framework for evaluating, governing, and delivering trustworthy metrics in e-commerce dashboards.

---

## 1. Principles of Governed Analytics

1. **Question Before Visualization:** A metric exists to serve a recurring decision. Never add a KPI card simply because other dashboards include it.
2. **Data-Readiness ≠ Delivery-Readiness:** The presence of a column in a PostgreSQL database does not prove that an API endpoint or UI widget computes the measure correctly.
3. **Explicit Boundaries Over Silent Defaults:** Never fill in missing business logic with an unconfirmed default. If an SLA or threshold is unconfirmed, flag it as an open question.
4. **Actionable Outcomes:** Every dashboard widget should answer: *"If this number changes significantly, what specific operational action does the user take?"*

---

## 2. Data-Readiness Taxonomy

Before including any metric in an engineering roadmap, classify its data readiness:

| Level | Status | Meaning | Next Step to Unblock |
|---|---|---|---|
| **L1** | **Current Data** | Authoritative fields exist in the database with verified integrity. | Write backend aggregation endpoint and test edge cases. |
| **L2** | **Partial** | Some data exists, but history, reason codes, or attribution links are missing. | Add missing columns or relational tracking in the schema. |
| **L3** | **Needs Rule** | Data is present, but an operational policy, SLA, threshold, or cohort definition is missing. | Align with product/finance stakeholders on the exact operating rule. |
| **L4** | **Gap** | The platform does not capture the event, denominator, cost, or session data. | Instrument new event logging or ingest external tracking before designing UI. |

---

## 3. Metric Decision Contract Template

For every production KPI or dashboard card, engineering and product must sign off on a **Metric Decision Contract**:

```markdown
### [Metric Code] — [Metric Name]

- **User Question:** "What plain-language question does this answer?"
- **Operational Decision:** What specific choice does the user make based on this?
- **Authoritative Entity & Timestamp:** e.g., `orders.paid_at` on `status IN ('PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED')`
- **Calculation Formula:** Exact mathematical and logical definition.
- **Inclusions:** Explicit population included.
- **Exclusions:** Explicit population excluded (e.g., test orders, cancelled before capture).
- **Time Grain & Comparison:** e.g., Daily, equal-length preceding period.
- **Currency Handling:** Single-currency standard or segregated multi-currency breakdown.
- **Refresh Frequency:** Real-time / 5-minute cache / Hourly / Daily batch.
- **Stale Threshold:** When should the UI display a "Stale / Refreshing" badge?
- **Health Bands:**
  - 🟢 **Healthy:** Threshold criteria
  - 🟡 **Warning:** Threshold criteria
  - 🔴 **Danger:** Threshold criteria
- **Next User Action:** What link, drawer, or action workflow does the user trigger when alerted?
```

---

## 4. Delivery Lifecycle & Governance Gates

A metric is blocked from production release until the following responsibilities are assigned:

| Requirement | Description | Standard |
|---|---|---|
| **Metric Definition Owner** | Individual accountable for formula accuracy. | Product Manager / Lead Analyst |
| **Engineering Implementer** | Developer owning query performance and tests. | Backend Engineer |
| **Stale & Incident Owner** | Team paged when data pipelines lag. | Platform Ops / SRE |
| **Audit Verification** | Unit tests verifying math against edge cases. | Automated CI test suite |
| **Accessibility Verification** | Screen-reader labels, no color-only status coding, keyboard navigation. | Frontend QA Checklist |
| **Retirement Criteria** | When should this card be consolidated or removed? | Bi-annual metric usage review |
