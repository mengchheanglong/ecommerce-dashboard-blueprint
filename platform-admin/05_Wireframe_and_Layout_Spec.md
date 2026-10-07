# Platform Admin Wireframe & Layout Specification

This document defines the layout architecture, responsive wireframe layouts, visual hierarchy, and UI state models for the Platform Administration Dashboard.

---

## 1. Information Architecture & Hierarchy

The Platform Admin interface is organized into a topbar header with global status chips, followed by four visual bands structured by operational importance:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  PLATFORM ADMIN  │  Search stores, users, orders... (Ctrl+K)   │ [Admin User] [Role]   │
│  Chips: [🟢 System: 100%] [🟢 Ledger: Balanced] [🟢 Data: 2m ago] [🔔 Alerts: 0]        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  BAND 1: PLATFORM HEALTH (Headline Primary KPIs)                                       │
│  ┌───────────────────┬───────────────────┬───────────────────┬──────────────────────┐  │
│  │ Active Paid Stores│ Subscription MRR  │ Platform GMV      │ Payment Success Rate │  │
│  │ 1,248             │ $34,800 / mo      │ $412,650          │ 94.2%                │  │
│  │ ▲ +34 net (30d)   │ $31.2k collected  │ 18,420 orders     │ 3.1% fail │ 2.7% stl │  │
│  └───────────────────┴───────────────────┴───────────────────┴──────────────────────┘  │
│                                                                                        │
│  BAND 2: TENANT GROWTH & ACTIVATION FUNNEL                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Store Funnel: 124 Created ──────► 88 Activated (71%) ──────► 52 First Sale (42%)│  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  BAND 3: ACTION CENTER (SLA-Governed Work Queues)                                      │
│  ┌────────────────────────┬────────────────────────┬─────────────────────────────┐     │
│  │ Bank KYC Verification  │ Payouts Awaiting Action│ Support Cases               │     │
│  │ 14 Pending             │ 8 Requests ($12,450)   │ 19 Open Tickets             │     │
│  │ Oldest: 19h (1 Due Soon)│ Oldest: 38h (2 Due)   │ 3 Breached SLA              │     │
│  │ [Review Queue ──►]     │ [Authorize Payouts ──►]│ [Open Inbox ──►]            │     │
│  └────────────────────────┴────────────────────────┴─────────────────────────────┘     │
│                                                                                        │
│  BAND 4: CONDITIONAL ALERTS (Rendered dynamically when active)                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ ⚠️ 2 Tenant Onboarding Provisioning Jobs Failed. [Inspect DLQ Queue]             │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Desktop Layout Specification (1440px Grid)

### Topbar & Trust Header
- **Left:** Platform Logo, Environment Badge (`Production`, `Staging`), Breadcrumbs.
- **Center:** Global Search Trigger (`Cmd+K` / `Ctrl+K`) searching across Stores, Users, Order IDs, and Transaction IDs.
- **Right:**
  - Trust Status Chips: Interactive pills that open diagnostic drawers.
  - Role Badge: `Super Admin` (Purple) / `Admin` (Blue).
  - User Avatar & Session Controls.

### Band 1: Platform Health Cards (4-Column Grid)
- **Card 1: Active Paid Stores**
  - Large Metric: `1,248`
  - Delta badge: `▲ +34` net change over 30 days.
  - Sub-line: `1,180 Active | 68 Grace Period`.
- **Card 2: Subscription MRR**
  - Large Metric: `$34,800`
  - Sparkline: Trailing 6-month MRR trend.
  - Sub-line: `$31,200 collected this month`.
- **Card 3: Platform Paid Sales & Orders (GMV)**
  - Large Metric: `$412,650` (USD)
  - Sub-line: `18,420 valid orders | $22.40 AOV`.
  - Multi-currency switcher dropdown if secondary currencies exist.
- **Card 4: Payment Success Rate**
  - Large Metric: `94.2%`
  - Status indicator: Green circle if $\ge 88\%$, Yellow if $82-87\%$, Red if $<82\%$.
  - Sub-line: `4.1% declined | 1.7% timeout`.

### Band 2: Growth & Funnel (Single Spanned Card)
- Visual horizontal funnel with connecting arrows:
  - Step 1: `Created (124)`
  - Arrow with conversion rate: `71%`
  - Step 2: `Activated (88)`
  - Arrow with conversion rate: `59%`
  - Step 3: `First Paid Order (52)`
- Clicking any node navigates to the filtered Store Directory.

### Band 3: Action Center Queues (3-Column Grid)
Cards designed for operational action rather than passive reporting:
- **Card 1: Bank Account Verification Queue**
  - Pending Count badge: `14`.
  - SLA Aging indicator: Oldest pending `19h ago` (turns yellow at 18h, red at 24h).
  - Primary button: `Review Next Submission`.
- **Card 2: Merchant Payout Processing Queue**
  - Pending Count & Volume: `8 Requests ($12,450)`.
  - SLA Aging indicator: Oldest request `38h ago` (turns yellow at 36h, red at 48h).
  - Primary button: `Review Payouts` (Gated to Super Admin).
- **Card 3: Support & Concierge Backlog**
  - Open tickets count: `19`.
  - Unassigned count: `6`.
  - Breached tickets count: `3`.
  - Primary button: `Triage Inbox`.

---

## 3. Dashboard UI States

The dashboard UI adapts dynamically across three operational states:

### 3.1 Normal / Healthy State (🟢)
- All trust status chips render in muted green with checkmark icons.
- SLA queue timers show within-target durations (e.g., `< 12h`).
- Conditional alert band is completely hidden from view.
- Executive KPIs display smooth green trend lines.

### 3.2 Busy / Backlog State (🟡)
- One or more SLA queues approach deadline limits (e.g. Bank review $> 18h$, Payouts $> 36h$).
- Warning chips change to amber `Due Soon`.
- Primary action buttons in affected queues highlight to draw immediate operator focus.

### 3.3 Degraded / Incident State (🔴)
- If payment success rate drops below $82\%$, Card 4 turns red with an alert border.
- If a ledger audit variance occurs or background workers stall, the topbar System Health chip turns red and pulses.
- The conditional alert banner slides down across the top of the viewport with a high-contrast danger callout.
- Automated payout execution is disabled if the Wallet-Ledger audit fails.

---

## 4. Mobile & Responsive Behavior (< 768px)

On mobile and narrow tablet screens:
1. **Action-First Reordering:** The **Action Center** queues automatically reorder to the top of the page, placing pending tasks immediately under the operator's thumb.
2. **Band 1 Metric Carousel / Stack:** Health KPI cards collapse into a 2x2 grid or swipeable card stack.
3. **Sticky Urgent Banners:** Critical failure alerts stick to the top navigation header.
4. **Touch Targets:** All queue review triggers expand to full width with a minimum 48px touch target.
