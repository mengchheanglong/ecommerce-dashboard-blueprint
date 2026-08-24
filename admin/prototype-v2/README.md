# Angkoro Admin — Prototype v2

Next.js prototype of the internal admin system, built to
[`ANGKORO_ADMIN_V1_PRD_FINAL_v5.3.md`](../ANGKORO_ADMIN_V1_PRD_FINAL_v5.3.md) and
[`ANGKORO_ADMIN_V1_INTERNAL_DETAIL_REGISTER.md`](../ANGKORO_ADMIN_V1_INTERNAL_DETAIL_REGISTER.md).

It is a **UI prototype**: no backend, no authentication, no real data. It exists to make
the PRD's requirements visible and arguable before implementation starts.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

---

## Stack

Matched to [`Angkoro-Frontend`](../../../Angkoro-Frontend) so anything proven here ports
across without redesign.

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 with CSS-variable tokens |
| Components | shadcn/ui (new-york) on Radix primitives, `cva` + `clsx` + `tailwind-merge` |
| Icons | lucide-react · Charts: recharts · Toasts: sonner · Theme: next-themes |
| Type | Plus Jakarta Sans (Latin) + Kantumruy Pro (Khmer) via `next/font` |

**Light mode is the default.** `defaultTheme="light"` in
[`app/providers.tsx`](./app/providers.tsx) — admin work happens on a desk monitor beside the
storefront, which is a light surface. The topbar menu still offers Light / Dark / Match
system, and next-themes persists the choice.

**Design tokens are copied verbatim** from `Angkoro-Frontend/app/globals.css` — the same
forest/mint palette, 10px radius base, shadow scale, and chart colours, in both light and
dark. Do not re-pick values in [`app/globals.css`](./app/globals.css); change them upstream
and copy them down. The `components/ui/*` primitives are the production files, unmodified
except for `"use client"` directives, one added `showCloseButton` prop on `DialogContent`, and
the status-ink change below.

### One addition: status ink

Six tokens exist here that production does not have — `--success-ink`, `--warning-ink`,
`--destructive-ink`, `--info-ink`, `--violet-ink`, `--accent-ink`.

Status chips fill with their hue at 12–15% and set the label to that same hue. In dark mode
that passes comfortably (4.8–6.1:1). In light mode it inverts and fails: mint success text
on a mint tint is **2.11:1**, against a 4.5:1 AA floor for small text — on a screen where
status is the thing operators scan for. Violet and mint also fail as plain text on white.

The ink tokens are the same hues stepped down in luminance until each clears 4.5:1 on every
surface it can land on (card, canvas, secondary, and its own 12% and 15% tints). **Every
brand token is untouched** — buttons, fills, rings, borders, and charts still use the exact
production values. Only small coloured text uses ink. In dark mode ink is defined as the
brand colour, so nothing changes there.

If the production design system adopts the same fix, these can be deleted and the primitives
re-copied clean.

### Known upstream issue — not changed here

`--muted-foreground: #66796f` on the canvas `#f6faf8` measures **4.40:1**, just under the
4.5:1 AA floor for small text. It passes on cards (4.64:1), so only muted text sitting
directly on the page background is affected.

This is a shared design-system token that the production storefront uses too, so it is
deliberately **left as-is** rather than diverged in the prototype. The minimal fix, if you
want it, is `#64776d` — 4.53:1 on canvas, 4.77:1 on cards, a 2/2/2 RGB shift that is not
visibly different side by side. Change it upstream in `Angkoro-Frontend` first.

---

## What is built

All 18 features from PRD §4, tagged with their implementation priority.

| Priority | Features |
|---|---|
| **P0** Foundation | Admin Accounts and Roles · Admin Security and Activity |
| **P1** Core operations | Support and Concierge · Stores · Merchant Accounts · Store Plan and Billing · Customer Payments · Merchant Settlements · Settlement Account Review · Global Search |
| **P2** Operational support | Overview · Order Issues · Shopper Support · Support Access · Account Recovery · Plans and Entitlements · Operational Health |
| **P3** Enhancement | Platform Analytics · Controlled Exports |

Record pages exist for stores, merchant accounts, support cases, and settlements.
Global Search is the ⌘K palette in the top bar.

### Deliberately absent

PRD §4 lists these as **explicitly out of scope**, and prototype-v1 shipped the first
three. They are not carried over — do not add them back without a scope change:

My Work · User Directory · Reports and Review · Metric Catalog · generic approval-engine
module · unrestricted impersonation · generic database/SQL editing · raw secret display ·
deployment or migration controls.

---

## Architecture

```text
app/
├── globals.css              design tokens, ported from production
├── layout.tsx               fonts, theme provider, toaster
└── (admin)/                 every feature, one directory each
    ├── layout.tsx           → AppShell
    ├── page.tsx             Overview
    └── <feature>/page.tsx   + [recordId]/page.tsx where records exist

components/
├── ui/                      shadcn primitives (from Angkoro-Frontend)
├── app/                     composed, PRD-aware building blocks
└── shell/                   sidebar, topbar, command palette

config/navigation.ts         nav generated from PRD §4 priorities
lib/                         cn · format · permissions
data/seed.ts                 hand-written records demonstrating real workflows
```

### The reusable layer

Pages compose these rather than hand-rolling markup, which is why 18 features read
consistently:

| Component | Job |
|---|---|
| `PageHeader` / `SectionHeader` | Title, description, priority tag, action slot, back link |
| `DataTable` | Every index and queue — sort, search, filter chips, row links, responsive column hiding |
| `StatCard` / `StatGrid` | A measure with its **definition** — required, not decorative (R8.1) |
| `StatusBadge` / `StatusDot` / `PriorityChip` | Status colour from one central map, never per-call-site |
| `ConfirmAction` | Sensitive-action dialog: effects, non-effects, required reason (R9.2) |
| `PermissionGate` / `PermissionWall` | Disables and explains rather than hiding (R1.3) |
| `RecordLayout` / `Panel` / `FieldList` / `History` | Record-page furniture |
| `Callout` / `OpenQuestion` | Context, and unresolved rules marked as unresolved |

---

## Decisions worth knowing

**Permission-denied controls are disabled and explained, never hidden.** R1.3 requires the
restriction to protect the *action*, so hiding buys no security — and an operator who
cannot see that an action exists cannot learn who to ask. Hovering a locked control names
the owning role and cites the clause.

**`ConfirmAction` requires an `effects` list.** An action whose consequences cannot be
enumerated is not ready to be offered. Dialogs also state what the action **does not** do,
which is how R3.7 (no silent cascade) becomes visible: suspending a store says plainly that
the merchant account is untouched.

**Unapproved rules are labelled, not invented.** The Register marks several rules "Needs
definition" — action-risk levels (§3.1), restriction grounds (§3.2), the Support Access
elevation allowlist (§3.3), recovery evidence (§3.4), retention (§4.1–4.2), the monitoring
register (§5.2). Where a screen would need one, it renders an `OpenQuestion` block naming
the section instead of quietly shipping a guess. The permission matrix marks each mapping
`Approved` or `Proposed` for the same reason.

**Platform Analytics shows what it excludes.** R8.1 permits only measures with an approved
definition and reliable source, so the page carries a list of measures it is *not* showing
and why — paid sales, MRR, payment success rate. The source audit found the existing seller
analytics unreliable; re-plotting those numbers in a nicer chart would launder a known-bad
figure.

**The role switcher is a prototype affordance.** Real operators hold assigned roles and
cannot change their own (R1.1, R1.2). It exists so one reviewer can see four perspectives
without four accounts, and the menu says so.

**Time is frozen.** `lib/format.ts` pins `NOW` to 19 Aug 2026, so relative timestamps read
identically on every run and screenshot, and server and client renders agree.

**Currency never merges.** `money()` always takes an explicit currency; USD and KHR are
never summed into one figure.

---

## Relationship to prototype-v1

[`../prototype-v1`](../prototype-v1) is the earlier Vite + React Router prototype. It
remains useful as a reference for interaction patterns, but it predates the FINAL PRD and
contains three out-of-scope features. **This is the current prototype.**

---

## Limitations

No backend, no auth, no persistence — state resets on reload. Composers, invite forms, the
plan editor, and file generation are intentionally not built; the screens demonstrate the
*rules* around those actions, which is what still needs review. Nothing here authorizes
implementation.
