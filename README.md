# E-Commerce Dashboard Architecture & Blueprint

> **A comprehensive architectural specification, product requirements framework, and metric governance template for building modern e-commerce dashboards.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Template](https://img.shields.io/badge/Status-Specification%20Template-success.svg)]()
[![Domain: E-Commerce](https://img.shields.io/badge/Domain-Multi--Tenant%20Commerce-orange.svg)]()

---

## 📌 GitHub Repository Details

If configuring this repository on GitHub (`https://github.com/mengchheanglong/analytics-dashboard.git`), use the following suggested metadata:

- **Repository Title:** `E-Commerce Dashboard Architecture Blueprint`
- **Short Description (About):**  
  > *A battle-tested architectural blueprint, PRD specification, and metric governance template for building multi-tenant e-commerce platform admin, merchant overview, and merchant analytics dashboards.*
- **Topics / Tags:**  
  `ecommerce` · `analytics-dashboard` · `platform-admin` · `merchant-portal` · `product-management` · `prd-template` · `metrics-governance` · `kpi-specification` · `system-design`

---

## 🧭 The Three Dashboard Surfaces

Building dashboards for e-commerce platforms requires clear separation between different operating rhythms and personas. This repository structures commerce dashboards into **three distinct surfaces**:

```text
                                  ┌────────────────────────────────┐
                                  │   E-COMMERCE PLATFORM SYSTEM   │
                                  └───────────────┬────────────────┘
                                                  │
                  ┌───────────────────────────────┴──────────────────────────────┐
                  ▼                                                              ▼
┌──────────────────────────────────┐                           ┌──────────────────────────────────┐
│ 1. PLATFORM ADMIN SYSTEM         │                           │ 2. MERCHANT / STORE SIDE         │
│    (Full Internal Platform)      │                           │    (Store Owners & Operators)    │
├──────────────────────────────────┤                           ├──────────────────────────────────┤
│ Full PRD covering all 11 modules:│                           │ Two distinct dashboards:         │
│ • Tenant & Store Directory       │                           │                                  │
│ • Subscription MRR & Plans       │                           │ A. STORE OVERVIEW DASHBOARD      │
│ • Gateway Reliability & Webhooks │                           │    • Daily Operational Cockpit   │
│ • Payouts & Bank KYC Review (SLA)│                           │    • Immediate Tasks & Queues    │
│ • Operational Health & Queues    │                           │    • Withdrawable Balance        │
│ • Security RBAC & Audit Trails   │                           │                                  │
│                                  │                           │ B. STORE ANALYTICS DASHBOARD     │
│ [Enter platform-admin/]          │                           │    • Deep Business Intelligence  │
│                                  │                           │    • Conversion Funnels & Trends │
│                                  │                           │    • Merchandising & Retention   │
│                                  │                           │    • Order Loss Diagnostics      │
│                                  │                           │                                  │
│                                  │                           │ [Enter merchant-overview/]       │
│                                  │                           │ [Enter merchant-analytics/]      │
└──────────────────────────────────┘                           └──────────────────────────────────┘
```

---

## 📂 Repository Structure

```text
analytics-dashboard/
├── platform-admin/                          # 1. ENTIRE PLATFORM ADMIN SYSTEM (Comprehensive PRD & Architecture)
│   ├── README.md                            # Platform Admin System Overview
│   ├── 01_System_PRD_Specification.md       # Full System PRD: RBAC roles, 11 modules, workflows, non-goals
│   ├── 02_Platform_Metrics_Evaluation.md    # 67 Platform questions, 15 core items, 7 operating rules
│   ├── 03_Dashboard_Wireframe_and_States.md # Executive platform dashboard layout & dynamic UI states
│   └── 04_Operations_SLAs_and_Compliance.md # SOPs, KYC review, Payout execution, SLAs, 7-year audit retention
│
├── merchant-overview/                       # 2. MERCHANT OVERVIEW DASHBOARD (Operational & Daily Health)
│   ├── README.md                            # Overview Dashboard architecture & purpose
│   ├── 01_Overview_KPI_Contracts.md         # The 9 Core Overview Items (Paid Sales, Orders, Balance, Queues, Stock)
│   ├── 02_Wireframe_and_Layout_Spec.md      # Screen hierarchy, 4 visual bands, quick-action drawers
│   └── 03_Daily_Operations_Guide.md         # Daily 5-minute operational workflow for store owners
│
├── merchant-analytics/                      # 3. MERCHANT ANALYTICS DASHBOARD (Deep BI & Growth Intelligence)
│   ├── README.md                            # Analytics Dashboard architecture & purpose
│   ├── 01_Analytics_Question_Register.md    # 60 Merchant Analytics & Growth Questions
│   ├── 02_Metric_Evaluation_and_Rankings.md # Deep evaluation matrix: 16 ranked KPIs & placement
│   ├── 03_Analytics_KPI_Specifications.md   # Deep KPI specs (COD recovery, Funnels, Retention, Loss reasons)
│   ├── 04_Wireframe_and_Visual_Layout.md    # Detailed analytics page layout & chart configurations
│   └── 05_SQL_Calculation_Logic.md          # Technical queries, timestamps, timezone logic & formulas
│
├── shared/                                  # 4. SHARED STANDARDS & CALCULATION TRAPS
│   ├── README.md                            # Overview of shared engineering standards
│   ├── 01_Analytics_Audit_and_Pitfalls.md   # Calculation traps (COD traps, currency, gross/net, ledger)
│   └── 02_Metric_Governance_Framework.md    # Data-readiness taxonomy (L1–L4) & Decision Contract Template
│
└── .gitignore                               # Standard git ignore rules
```

---

## 🔍 Surface Summaries

### 1. Platform Administration System (`platform-admin/`)
- **Target Audience:** Internal platform operators, super administrators, and compliance teams.
- **Scope:** The entire multi-tenant system. Unlike merchant dashboards (which are scoped to a single store), the admin system provides the full control plane: store creation, subscription billing, customer payment logs, settlement account KYC reviews, payout authorizations, worker queue telemetry, and security audit logs.
- **Authority:** Full PRD specification, 2-role RBAC model (`Admin` vs `Super Admin`), and SLA-governed action queues.

### 2. Merchant Overview Dashboard (`merchant-overview/`)
- **Target Audience:** Daily store owners and fulfillment staff.
- **Operating Rhythm:** Real-time / Daily 5-minute triage.
- **Core Questions:** *"Is paid business happening today?"* and *"What urgent work needs my attention right now?"*
- **Key Indicators:** Paid Sales, Paid Orders, Available Balance (working capital snapshot), Orders Need Decision (accept/reject SLA countdown), Fulfillment Backlog, and Inventory Stock Alerts.

### 3. Merchant Analytics Dashboard (`merchant-analytics/`)
- **Target Audience:** Store owners, merchandisers, and growth marketers.
- **Operating Rhythm:** Weekly / Monthly strategic review.
- **Core Questions:** *"What are my sales trends?", "Where am I losing money?", "Which customers and products drive growth?"*
- **Key Indicators:** Paid Sales vs Total Booked Sales gap, Cash-on-Delivery (COD) collection recovery rate, storefront visit-to-order conversion funnels, new vs returning customer split, purchase frequency buckets (`1x`, `2–3x`, `4+`), best vs worst selling products, and categorical order cancellation reasons.

---

## 🚀 How to Use this Template for Your Next Project

When starting a new e-commerce platform, marketplace, or SaaS store builder:

1. **For the Entire Admin System:**  
   Adopt the full architecture in [`platform-admin/01_System_PRD_Specification.md`](./platform-admin/01_System_PRD_Specification.md) to establish RBAC permissions, store directories, payout workflows, and SLA queues.
2. **For the Daily Merchant Cockpit:**  
   Implement the 9 core items and wireframe in [`merchant-overview/01_Overview_KPI_Contracts.md`](./merchant-overview/01_Overview_KPI_Contracts.md) and [`merchant-overview/02_Wireframe_and_Layout_Spec.md`](./merchant-overview/02_Wireframe_and_Layout_Spec.md).
3. **For the In-Depth Merchant Analytics:**  
   Implement the 16 ranked KPIs, conversion funnels, and SQL queries in [`merchant-analytics/02_Metric_Evaluation_and_Rankings.md`](./merchant-analytics/02_Metric_Evaluation_and_Rankings.md) and [`merchant-analytics/05_SQL_Calculation_Logic.md`](./merchant-analytics/05_SQL_Calculation_Logic.md).
4. **Avoid Calculation Traps:**  
   Follow [`shared/01_Analytics_Audit_and_Pitfalls.md`](./shared/01_Analytics_Audit_and_Pitfalls.md) to ensure correct timezone truncation, multi-currency segregation, double-entry ledger audits, and proper Cash-on-Delivery revenue recognition.

---

## 📄 License

This documentation template is released under the [MIT License](https://opensource.org/licenses/MIT). Feel free to adapt, extend, and use it in your commercial or open-source commerce platforms.
