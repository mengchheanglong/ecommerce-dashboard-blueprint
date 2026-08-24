import {
	Activity,
	BadgeCheck,
	BarChart3,
	Banknote,
	CreditCard,
	FileWarning,
	Headphones,
	KeyRound,
	LayoutDashboard,
	Layers,
	ReceiptText,
	Store,
	Users,
	type LucideIcon,
} from "lucide-react"

import type { Permission } from "@/lib/permissions"

/**
 * Navigation is generated from PRD v5.3 §4 (priority) and §5 (dashboard
 * sections). Priority is implementation order, not whether a feature ships:
 * every P0–P3 item below is part of the intended V1 admin system.
 *
 * Deliberately absent, because PRD v5.3 §4 lists them as explicitly out of
 * scope: My Work, a separate Merchant Accounts module (merchant identity lives
 * in Users), a separate Shopper Support module (shopper cases live in Support
 * & Concierge), Reports and Review, Metric Catalog, a generic approval-engine
 * module, and a separate Exports page (exports are feature-level). Do not add
 * them back without a scope change.
 */

export type Priority = "P0" | "P1" | "P2" | "P3"

export type NavItem = {
	href: string
	title: string
	/** Sidebar label when the full title is too long for the rail. */
	short?: string
	group: NavGroup
	priority: Priority
	icon: LucideIcon
	/** One line explaining the feature's job, shown in search and page headers. */
	description: string
	/** Viewing the section at all requires this permission. */
	permission?: Permission
	/** Second key of the `g`-prefixed jump shortcut. */
	jumpKey?: string
}

export type NavGroup =
	| "Overview"
	| "Issues and Support"
	| "Users"
	| "Stores"
	| "Payments and Settlements"
	| "Store Plan and Billing"
	| "Analytics"
	| "Angkoro System"

export const NAV_GROUPS: NavGroup[] = [
	"Overview",
	"Issues and Support",
	"Users",
	"Stores",
	"Payments and Settlements",
	"Store Plan and Billing",
	"Analytics",
	"Angkoro System",
]

export const NAV_ITEMS: NavItem[] = [
	/* ---- P2 — Overview (kept at the top of the rail; built after core ops) -- */
	{
		href: "/",
		title: "Overview",
		group: "Overview",
		priority: "P2",
		icon: LayoutDashboard,
		description: "Work requiring attention, routed to the feature that owns it.",
		jumpKey: "o",
	},

	/* ---- Issues and Support -------------------------------------------------- */
	{
		href: "/support",
		title: "Support & Concierge",
		short: "Support",
		group: "Issues and Support",
		priority: "P1",
		icon: Headphones,
		description:
			"One shared case system for merchant and shopper support — intake, assignment, communication, and resolution.",
		permission: "case.manage",
		jumpKey: "c",
	},
	{
		href: "/order-issues",
		title: "Order Issues",
		group: "Issues and Support",
		priority: "P2",
		icon: FileWarning,
		description:
			"Problems caused by Angkoro's checkout, order, inventory, payment, or status processing.",
		jumpKey: "i",
	},
	{
		href: "/account-recovery",
		title: "Account Recovery",
		short: "Recovery",
		group: "Issues and Support",
		priority: "P2",
		icon: KeyRound,
		description: "Exceptional recovery when normal self-service recovery cannot be completed.",
		permission: "recovery.intake",
		jumpKey: "r",
	},

	/* ---- Users --------------------------------------------------------------- */
	{
		href: "/users",
		title: "Users",
		group: "Users",
		priority: "P1",
		icon: Users,
		description:
			"Centralized external-user accounts — shoppers, merchants, store owners, and store staff.",
		permission: "user.view",
		jumpKey: "u",
	},

	/* ---- Stores -------------------------------------------------------------- */
	{
		href: "/stores",
		title: "Stores",
		group: "Stores",
		priority: "P1",
		icon: Store,
		description:
			"Store ownership, access, plan, onboarding, restrictions, merchant-facing view, and direct Super Admin changes with consent.",
		permission: "store.view",
		jumpKey: "s",
	},

	/* ---- Payments and Settlements -------------------------------------------- */
	{
		href: "/payments",
		title: "Customer Payments",
		short: "Payments",
		group: "Payments and Settlements",
		priority: "P1",
		icon: CreditCard,
		description: "Angkoro-recorded shopper payments, their order link, and matching state.",
		permission: "payment.investigate",
		jumpKey: "p",
	},
	{
		href: "/settlements",
		title: "Merchant Settlements",
		short: "Settlements",
		group: "Payments and Settlements",
		priority: "P1",
		icon: Banknote,
		description:
			"Payout status and history; Super Admin records and executes manual pilot payouts.",
		permission: "settlement.view",
		jumpKey: "e",
	},
	{
		href: "/settlement-accounts",
		title: "Settlement Account Review",
		short: "Account Review",
		group: "Payments and Settlements",
		priority: "P1",
		icon: BadgeCheck,
		description: "Review and approve the merchant destination account used for payouts.",
		permission: "settlement.account.review",
	},

	/* ---- Store Plan and Billing ---------------------------------------------- */
	{
		href: "/billing",
		title: "Store Plan & Billing",
		short: "Plan & Billing",
		group: "Store Plan and Billing",
		priority: "P1",
		icon: ReceiptText,
		description: "Store subscriptions, billing history, payment state, and billing problems.",
		permission: "billing.investigate",
		jumpKey: "b",
	},
	{
		href: "/plans",
		title: "Plans & Entitlements",
		short: "Plans",
		group: "Store Plan and Billing",
		priority: "P2",
		icon: Layers,
		description:
			"Plan definitions, customer-facing prices and periods, activation, and included limits. Admin view-only.",
		permission: "plan.view",
	},

	/* ---- Analytics ------------------------------------------------------------ */
	{
		href: "/analytics",
		title: "Analytics",
		group: "Analytics",
		priority: "P3",
		icon: BarChart3,
		description: "Only measures with an approved definition and a reliable data source.",
		permission: "analytics.view",
		jumpKey: "a",
	},

	/* ---- Angkoro System -------------------------------------------------------- */
	{
		href: "/operational-health",
		title: "Operational Health",
		group: "Angkoro System",
		priority: "P2",
		icon: Activity,
		description:
			"Background and business-process failures that Uptime Kuma does not already cover.",
		permission: "health.view",
		jumpKey: "h",
	},
	{
		href: "/security",
		title: "Security & Activity",
		short: "Security",
		group: "Angkoro System",
		priority: "P0",
		icon: Activity,
		description: "Administrator activity, security events, and the protected audit history.",
	},
	{
		href: "/admin-accounts",
		title: "Admin Accounts",
		group: "Angkoro System",
		priority: "P0",
		icon: Users,
		description: "Manage Admin and Super Admin accounts. Super Admin-only management actions.",
		permission: "admin.manage",
	},
]

export const JUMP_TARGETS = NAV_ITEMS.filter((item) => item.jumpKey)

export function navItemFor(pathname: string): NavItem {
	// Longest match wins so record pages (/stores/abc) resolve to their index.
	const matches = NAV_ITEMS.filter(
		(item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
	)
	return matches.sort((a, b) => b.href.length - a.href.length)[0] ?? NAV_ITEMS[0]
}

export const PRIORITY_NOTE: Record<Priority, string> = {
	P0: "Foundation — secure internal access and accountability that other features depend on.",
	P1: "Core operations — day-to-day platform operations.",
	P2: "Operational support — built after P1 core operations is working reliably.",
	P3: "Enhancement — built after core operational workflows are reliable.",
}
