/**
 * Prototype data.
 *
 * Hand-written, not generated. Every record exists to demonstrate a specific
 * PRD requirement or core flow — a blocked settlement waiting on destination
 * re-verification, a case that turned out to be the merchant's responsibility,
 * an elevation request awaiting approval. Random data cannot show a workflow.
 *
 * Names are Cambodian and plausible; no real merchant, shopper, bank account,
 * or transaction is represented here.
 *
 * All amounts carry an explicit currency — USD and KHR are never summed.
 */

import type { CasePriority as Priority } from "@/components/app/status-badge"
import type { Currency } from "@/lib/format"
import type { Role } from "@/lib/permissions"

/* =========================================================================
   Stores  —  PRD R3.1, R3.2
   ========================================================================= */

export type StoreStatus = "Active" | "Onboarding" | "Suspended" | "Restricted"

export type DirectStoreChange = {
	at: string
	change: string
	consent: string
	reason: string
	by: string
}

export type Store = {
	/** R3.9/R3.10 — Super Admin direct changes made with merchant consent. */
	directChanges?: DirectStoreChange[]
	id: string
	name: string
	subdomain: string
	owner: string
	ownerId: string
	status: StoreStatus
	plan: "Starter" | "Growth" | "Scale"
	planState: "Active" | "Expiring" | "Expired" | "Pending"
	createdAt: string
	lastActiveAt: string
	currency: Currency
	/** Angkoro-recorded paid volume this period. Merchant commerce, not Angkoro revenue. */
	paidVolume: number
	openCases: number
	restriction?: { reason: string; appliedBy: string; appliedAt: string }
	onboarding?: { step: string; completed: number; total: number }
}

export const STORES: Store[] = [
	{
		id: "STR-1042",
		name: "River & Reed",
		subdomain: "riverandreed",
		owner: "Sokha Meas",
		ownerId: "USR-2201",
		status: "Active",
		plan: "Growth",
		planState: "Active",
		createdAt: "2026-03-12T09:00:00+07:00",
		lastActiveAt: "2026-08-19T08:14:00+07:00",
		currency: "USD",
		paidVolume: 18420.5,
		openCases: 1,
	},
	{
		id: "STR-1078",
		name: "Angkor Silk House",
		subdomain: "angkorsilk",
		owner: "Dara Pich",
		ownerId: "USR-2244",
		status: "Active",
		plan: "Scale",
		planState: "Expiring",
		createdAt: "2026-01-28T11:20:00+07:00",
		lastActiveAt: "2026-08-19T07:02:00+07:00",
		currency: "USD",
		paidVolume: 42980.0,
		openCases: 2,
	},
	{
		id: "STR-1115",
		name: "Kampot Pepper Co.",
		subdomain: "kampotpepper",
		owner: "Chantha Nou",
		ownerId: "USR-2290",
		status: "Active",
		plan: "Growth",
		planState: "Active",
		createdAt: "2026-04-02T14:45:00+07:00",
		lastActiveAt: "2026-08-18T19:30:00+07:00",
		currency: "USD",
		paidVolume: 9310.75,
		openCases: 0,
	},
	{
		id: "STR-1131",
		name: "Bassac Coffee Roasters",
		subdomain: "bassaccoffee",
		owner: "Vibol Sam",
		ownerId: "USR-2318",
		status: "Onboarding",
		plan: "Starter",
		planState: "Pending",
		createdAt: "2026-08-11T10:05:00+07:00",
		lastActiveAt: "2026-08-19T09:48:00+07:00",
		currency: "KHR",
		paidVolume: 0,
		openCases: 1,
		onboarding: { step: "Settlement account not yet submitted", completed: 4, total: 6 },
	},
	{
		id: "STR-1144",
		name: "Siem Reap Ceramics",
		subdomain: "srceramics",
		owner: "Bopha Ly",
		ownerId: "USR-2331",
		status: "Active",
		plan: "Starter",
		planState: "Expired",
		createdAt: "2026-02-19T16:10:00+07:00",
		lastActiveAt: "2026-08-17T12:22:00+07:00",
		currency: "USD",
		paidVolume: 3145.2,
		openCases: 1,
	},
	{
		id: "STR-1158",
		name: "Mekong Home Goods",
		subdomain: "mekonghome",
		owner: "Rithy Chea",
		ownerId: "USR-2350",
		status: "Suspended",
		plan: "Growth",
		planState: "Active",
		createdAt: "2026-05-30T08:30:00+07:00",
		lastActiveAt: "2026-08-15T21:11:00+07:00",
		currency: "USD",
		paidVolume: 6720.0,
		openCases: 3,
		restriction: {
			reason:
				"Hosted-service policy violation confirmed after review: storefront used to collect payment for goods the store does not hold.",
			appliedBy: "Sophea Chan",
			appliedAt: "2026-08-16T09:40:00+07:00",
		},
	},
	{
		id: "STR-1163",
		name: "Battambang Rice Traders",
		subdomain: "bbrice",
		owner: "Sopheak Ung",
		ownerId: "USR-2362",
		status: "Onboarding",
		plan: "Starter",
		planState: "Pending",
		createdAt: "2026-08-16T13:55:00+07:00",
		lastActiveAt: "2026-08-19T09:12:00+07:00",
		currency: "KHR",
		paidVolume: 0,
		openCases: 0,
		onboarding: { step: "Telegram channel not connected", completed: 3, total: 6 },
	},
	{
		id: "STR-1170",
		name: "Phnom Penh Bookbinders",
		subdomain: "ppbooks",
		owner: "Sokha Meas",
		ownerId: "USR-2201",
		status: "Active",
		plan: "Starter",
		planState: "Active",
		createdAt: "2026-06-21T09:15:00+07:00",
		lastActiveAt: "2026-08-19T06:40:00+07:00",
		currency: "USD",
		paidVolume: 2480.9,
		openCases: 0,
	},
]

/* =========================================================================
   Users  —  PRD v5.3 §2 (Users), R3.1–R3.6
   One person may hold several account kinds at the same time (R3.3).
   ========================================================================= */

export type UserKind = "Shopper" | "Merchant" | "Store owner" | "Store staff"

export type UserAccess = {
	kind: UserKind
	status: "Active" | "Restricted" | "Banned"
	restriction?: { reason: string; appliedBy: string; appliedAt: string }
}

export type UserAccount = {
	id: string
	name: string
	email: string
	phone: string
	kinds: UserKind[]
	/** Access is decided per account kind; one decision never cascades to another kind. */
	access?: UserAccess[]
	status: "Active" | "Restricted" | "Banned"
	storeIds: string[]
	activeSessions: number
	lastSignInAt: string
	joinedAt: string
	restriction?: { reason: string; appliedBy: string; appliedAt: string }
}

export const USERS: UserAccount[] = [
	{
		id: "USR-2201",
		name: "Sokha Meas",
		email: "sokha.meas@riverandreed.com",
		phone: "+855 12 884 201",
		kinds: ["Merchant", "Store owner"],
		status: "Active",
		storeIds: ["STR-1042", "STR-1170"],
		activeSessions: 2,
		lastSignInAt: "2026-08-19T08:12:00+07:00",
		joinedAt: "2026-03-12T09:00:00+07:00",
	},
	{
		id: "USR-2244",
		name: "Dara Pich",
		email: "dara@angkorsilk.com",
		phone: "+855 92 771 044",
		kinds: ["Merchant", "Store owner"],
		status: "Active",
		storeIds: ["STR-1078"],
		activeSessions: 1,
		lastSignInAt: "2026-08-19T07:00:00+07:00",
		joinedAt: "2026-01-28T11:20:00+07:00",
	},
	{
		id: "USR-2290",
		name: "Chantha Nou",
		email: "chantha@kampotpepper.co",
		phone: "+855 77 620 118",
		kinds: ["Merchant", "Store owner"],
		status: "Active",
		storeIds: ["STR-1115"],
		activeSessions: 1,
		lastSignInAt: "2026-08-18T19:28:00+07:00",
		joinedAt: "2026-04-02T14:45:00+07:00",
	},
	{
		id: "USR-2318",
		name: "Vibol Sam",
		email: "vibol.sam@bassaccoffee.com",
		phone: "+855 15 339 872",
		kinds: ["Merchant", "Store owner", "Shopper"],
		status: "Active",
		storeIds: ["STR-1131"],
		activeSessions: 3,
		lastSignInAt: "2026-08-19T09:45:00+07:00",
		joinedAt: "2026-08-11T10:05:00+07:00",
	},
	{
		id: "USR-2331",
		name: "Bopha Ly",
		email: "bopha@srceramics.com",
		phone: "+855 96 447 553",
		kinds: ["Merchant", "Store owner"],
		status: "Active",
		storeIds: ["STR-1144"],
		activeSessions: 0,
		lastSignInAt: "2026-08-17T12:20:00+07:00",
		joinedAt: "2026-02-19T16:10:00+07:00",
	},
	{
		id: "USR-2350",
		name: "Rithy Chea",
		email: "rithy@mekonghome.com",
		phone: "+855 10 228 640",
		kinds: ["Merchant", "Store owner"],
		access: [
			{
				kind: "Merchant",
				status: "Restricted",
				restriction: {
					reason:
						"Merchant access restricted during the hosted-service policy investigation on STR-1158. Store status is a separate decision (R3.13).",
					appliedBy: "Sophea Chan",
					appliedAt: "2026-08-16T09:44:00+07:00",
				},
			},
			{ kind: "Store owner", status: "Active" },
		],
		status: "Restricted",
		storeIds: ["STR-1158"],
		activeSessions: 0,
		lastSignInAt: "2026-08-15T20:58:00+07:00",
		joinedAt: "2026-05-30T08:30:00+07:00",
		restriction: {
			reason:
				"Merchant access restricted during the hosted-service policy investigation on STR-1158. Store status is a separate decision (R3.10).",
			appliedBy: "Sophea Chan",
			appliedAt: "2026-08-16T09:44:00+07:00",
		},
	},
	{
		id: "USR-2362",
		name: "Sopheak Ung",
		email: "sopheak@bbrice.com",
		phone: "+855 88 512 907",
		kinds: ["Merchant", "Store owner"],
		status: "Active",
		storeIds: ["STR-1163"],
		activeSessions: 1,
		lastSignInAt: "2026-08-19T09:10:00+07:00",
		joinedAt: "2026-08-16T13:55:00+07:00",
	},
	{
		id: "USR-2407",
		name: "Malis Thorn",
		email: "malis.thorn@gmail.com",
		phone: "+855 17 550 336",
		kinds: ["Shopper"],
		access: [
			{
				kind: "Shopper",
				status: "Banned",
				restriction: {
					reason:
						"Repeated fraudulent payment attempts across stores. Shopper access banned after review; no store or merchant access existed to affect.",
					appliedBy: "Sophea Chan",
					appliedAt: "2026-08-03T10:15:00+07:00",
				},
			},
		],
		status: "Banned",
		storeIds: [],
		activeSessions: 0,
		lastSignInAt: "2026-08-02T18:24:00+07:00",
		joinedAt: "2026-06-08T12:30:00+07:00",
		restriction: {
			reason:
				"Repeated fraudulent payment attempts across stores. Shopper access banned after review; no store or merchant access existed to affect.",
			appliedBy: "Sophea Chan",
			appliedAt: "2026-08-03T10:15:00+07:00",
		},
	},
	{
		id: "USR-2412",
		name: "Chantrea Kim",
		email: "chantrea.kim@gmail.com",
		phone: "+855 11 903 214",
		kinds: ["Shopper"],
		status: "Active",
		storeIds: [],
		activeSessions: 1,
		lastSignInAt: "2026-08-19T06:55:00+07:00",
		joinedAt: "2026-07-01T09:40:00+07:00",
	},
	{
		id: "USR-2419",
		name: "Vichea Tep",
		email: "vichea.tep@angkorsilk.com",
		phone: "+855 89 442 108",
		kinds: ["Store staff"],
		status: "Active",
		storeIds: ["STR-1078"],
		activeSessions: 1,
		lastSignInAt: "2026-08-19T08:50:00+07:00",
		joinedAt: "2026-05-14T10:20:00+07:00",
	},
]

/* =========================================================================
   Support cases  —  PRD R2, Register §3.5
   ========================================================================= */

export type CaseChannel = "Platform report" | "Telegram" | "Support email" | "In-app request"
export type CaseStatus =
	| "Open"
	| "Investigating"
	| "Awaiting evidence"
	| "Resolved"
	| "Closed"

export type SupportCase = {
	id: string
	subject: string
	channel: CaseChannel
	status: CaseStatus
	priority: Priority
	assignee: string | null
	reporter: { name: string; kind: "Merchant" | "Shopper"; contact: string }
	linked: { storeId?: string; merchantId?: string; orderId?: string; paymentId?: string }
	openedAt: string
	/** Register §3.5 — first-response and resolution targets are still to define. */
	dueAt: string
	lastUpdateAt: string
	summary: string
	/**
	 * PRD R2.9 — when the report is really the merchant's responsibility, Support
	 * records that outcome and directs the user back to the merchant.
	 */
	outcome?: "Angkoro platform issue" | "Merchant responsibility" | "No action required"
	history: Array<{
		at: string
		title: string
		detail?: string
		actor?: string
		reason?: string
		locked?: boolean
	}>
}

export const CASES: SupportCase[] = [
	{
		id: "CASE-4417",
		subject: "KHQR payment taken but order still shows unpaid",
		channel: "Platform report",
		status: "Investigating",
		priority: "Urgent",
		assignee: "Sophea Chan",
		reporter: { name: "Nary Sok", kind: "Shopper", contact: "nary.sok@gmail.com" },
		linked: { storeId: "STR-1078", orderId: "ORD-88214", paymentId: "PAY-55301" },
		openedAt: "2026-08-19T08:05:00+07:00",
		dueAt: "2026-08-19T12:05:00+07:00",
		lastUpdateAt: "2026-08-19T09:40:00+07:00",
		summary:
			"Shopper paid by KHQR and holds a bank confirmation, but the order remained in PENDING_PAYMENT and auto-cancelled. Payment record exists but is unmatched.",
		outcome: "Angkoro platform issue",
		history: [
			{
				at: "19 Aug · 08:05",
				title: "Case created from platform report",
				detail: "Reported from the order page. Order, store, and payment context attached automatically.",
				locked: true,
			},
			{
				at: "19 Aug · 08:22",
				title: "Assigned to Sophea Chan",
				actor: "Auto-assignment",
			},
			{
				at: "19 Aug · 09:40",
				title: "Linked to payment investigation",
				detail: "PAY-55301 is recorded as Unmatched. Escalated to Super Admin for matching review.",
				actor: "Sophea Chan",
			},
		],
	},
	{
		id: "CASE-4412",
		subject: "Item never arrived — asking Angkoro for a refund",
		channel: "Telegram",
		status: "Resolved",
		priority: "Normal",
		assignee: "Sophea Chan",
		reporter: { name: "Vanna Kim", kind: "Shopper", contact: "+855 78 220 411" },
		linked: { storeId: "STR-1042", orderId: "ORD-88102" },
		openedAt: "2026-08-18T14:20:00+07:00",
		dueAt: "2026-08-19T14:20:00+07:00",
		lastUpdateAt: "2026-08-18T16:05:00+07:00",
		summary:
			"Shopper contacted the Angkoro Telegram endpoint about a late delivery and asked Angkoro to refund the order.",
		outcome: "Merchant responsibility",
		history: [
			{
				at: "18 Aug · 14:20",
				title: "Case created from Telegram message",
				detail:
					"Original message, sender, time, and channel recorded before asking for more information.",
				locked: true,
			},
			{
				at: "18 Aug · 15:31",
				title: "Checked platform records",
				detail: "Payment captured normally, order accepted by the store, no platform fault found.",
				actor: "Sophea Chan",
			},
			{
				at: "18 Aug · 16:05",
				title: "Closed as merchant responsibility",
				detail:
					"Replied on Telegram with the store's contact and explained that delivery and refunds are handled by River & Reed. Refunds are issued by the merchant, not Angkoro.",
				reason: "Delivery and refund are the merchant's responsibility under the platform model.",
				actor: "Sophea Chan",
				locked: true,
			},
		],
	},
	{
		id: "CASE-4419",
		subject: "Merchant cannot connect the store Telegram channel",
		channel: "Support email",
		status: "Open",
		priority: "High",
		assignee: null,
		reporter: { name: "Sopheak Ung", kind: "Merchant", contact: "sopheak@bbrice.com" },
		linked: { storeId: "STR-1163", merchantId: "USR-2362" },
		openedAt: "2026-08-19T09:12:00+07:00",
		dueAt: "2026-08-19T13:12:00+07:00",
		lastUpdateAt: "2026-08-19T09:12:00+07:00",
		summary:
			"Onboarding merchant reports the Telegram connect step fails after authorising the bot. Blocking store activation.",
		history: [
			{
				at: "19 Aug · 09:12",
				title: "Case created from support email",
				detail: "Original email recorded with sender, time, and channel before requesting details.",
				locked: true,
			},
		],
	},
	{
		id: "CASE-4408",
		subject: "Plan payment sent but store still shows expired",
		channel: "In-app request",
		status: "Awaiting evidence",
		priority: "High",
		assignee: "Sophea Chan",
		reporter: { name: "Bopha Ly", kind: "Merchant", contact: "bopha@srceramics.com" },
		linked: { storeId: "STR-1144", merchantId: "USR-2331" },
		openedAt: "2026-08-18T09:40:00+07:00",
		dueAt: "2026-08-19T09:40:00+07:00",
		lastUpdateAt: "2026-08-18T11:15:00+07:00",
		summary:
			"Merchant states the Starter plan renewal was paid by KHQR on 17 Aug. No matching plan payment is recorded; store access has lapsed.",
		history: [
			{
				at: "18 Aug · 09:40",
				title: "Case created from in-app support request",
				locked: true,
			},
			{
				at: "18 Aug · 11:15",
				title: "Requested payment evidence",
				detail: "Asked the merchant for the bank transfer reference and timestamp.",
				actor: "Sophea Chan",
			},
		],
	},
	{
		id: "CASE-4415",
		subject: "Owner lost access to the registered email and phone",
		channel: "Support email",
		status: "Investigating",
		priority: "Urgent",
		assignee: "Sophea Chan",
		reporter: { name: "Bopha Ly", kind: "Merchant", contact: "bopha@srceramics.com" },
		linked: { storeId: "STR-1144", merchantId: "USR-2331" },
		openedAt: "2026-08-18T15:10:00+07:00",
		dueAt: "2026-08-18T19:10:00+07:00",
		lastUpdateAt: "2026-08-18T16:05:00+07:00",
		summary:
			"The owner cannot use normal self-service recovery because both registered contact methods are unreachable. Exceptional recovery evidence is being verified in REC-142.",
		history: [
			{
				at: "18 Aug · 15:10",
				title: "Case recorded before recovery review",
				detail: "Original support email and registered account context preserved.",
				locked: true,
			},
			{
				at: "18 Aug · 16:05",
				title: "Linked to exceptional recovery review",
				detail: "REC-142 opened; evidence collection is in progress.",
				actor: "Sophea Chan",
			},
		],
	},
	{
		id: "CASE-4402",
		subject: "Merchant requests transfer of store to a business partner",
		channel: "Support email",
		status: "Resolved",
		priority: "High",
		assignee: "Sophea Chan",
		reporter: { name: "Chantha Nou", kind: "Merchant", contact: "chantha@kampotpepper.co" },
		linked: { storeId: "STR-1115", merchantId: "USR-2290" },
		openedAt: "2026-08-14T11:30:00+07:00",
		dueAt: "2026-08-14T15:30:00+07:00",
		lastUpdateAt: "2026-08-14T14:20:00+07:00",
		summary:
			"The merchant asked to use account recovery to transfer the store to a business partner. Recovery cannot change store ownership.",
		outcome: "No action required",
		history: [
			{
				at: "14 Aug · 11:30",
				title: "Case recorded from support email",
				locked: true,
			},
			{
				at: "14 Aug · 14:20",
				title: "Recovery request rejected",
				detail:
					"REC-139 rejected because account recovery cannot transfer store ownership. The merchant was directed to the separate privileged ownership workflow.",
				reason: "Recovery is not an ownership-transfer workflow (R6.12).",
				actor: "Sophea Chan",
				locked: true,
			},
		],
	},
	{
		id: "CASE-4401",
		subject: "Storefront selling goods the store does not hold",
		channel: "Platform report",
		status: "Resolved",
		priority: "Urgent",
		assignee: "Sophea Chan",
		reporter: { name: "Anonymous report", kind: "Shopper", contact: "Withheld" },
		linked: { storeId: "STR-1158", merchantId: "USR-2350" },
		openedAt: "2026-08-15T18:02:00+07:00",
		dueAt: "2026-08-15T22:02:00+07:00",
		lastUpdateAt: "2026-08-16T09:44:00+07:00",
		summary:
			"Multiple reports that the storefront collected payment for stock it never held. Investigated as a hosted-service policy violation.",
		outcome: "Angkoro platform issue",
		history: [
			{ at: "15 Aug · 18:02", title: "Case created from platform report", locked: true },
			{
				at: "16 Aug · 08:50",
				title: "Investigation completed",
				detail: "Pattern confirmed across 14 orders. Escalated for a restriction decision.",
				actor: "Sophea Chan",
			},
			{
				at: "16 Aug · 09:40",
				title: "Store suspended",
				reason:
					"Hosted-service policy violation confirmed after review: storefront used to collect payment for goods the store does not hold.",
				actor: "Sophea Chan · Super Admin",
				locked: true,
			},
			{
				at: "16 Aug · 09:44",
				title: "Merchant account restricted",
				detail:
					"Applied as a separate authorised action on the merchant account — the store suspension did not cascade to it.",
				reason: "Account access restricted during the hosted-service policy investigation.",
				actor: "Sophea Chan · Super Admin",
				locked: true,
			},
		],
	},
]

/* =========================================================================
   Customer payments  —  PRD R4.9–R4.13
   ========================================================================= */

export type PaymentState = "Matched" | "Unmatched" | "Failed" | "Pending"

export type Payment = {
	id: string
	orderId: string
	storeId: string
	shopper: string
	amount: number
	currency: Currency
	method: "KHQR" | "Card" | "COD"
	state: PaymentState
	recordedAt: string
	note?: string
	/** PRD R4.12 — a merchant-performed refund can be recorded, not issued. */
	merchantRefund?: { at: string; recordedBy: string; reference: string; note: string }
}

export const PAYMENTS: Payment[] = [
	{
		id: "PAY-55301",
		orderId: "ORD-88214",
		storeId: "STR-1078",
		shopper: "Nary Sok",
		amount: 148.0,
		currency: "USD",
		method: "KHQR",
		state: "Unmatched",
		recordedAt: "2026-08-19T07:58:00+07:00",
		note: "Bank confirmation held by the shopper; no matching settlement line received.",
	},
	{
		id: "PAY-55298",
		orderId: "ORD-88209",
		storeId: "STR-1042",
		shopper: "Sreymom Chhay",
		amount: 62.5,
		currency: "USD",
		method: "KHQR",
		state: "Matched",
		recordedAt: "2026-08-19T06:31:00+07:00",
	},
	{
		id: "PAY-55284",
		orderId: "ORD-88190",
		storeId: "STR-1115",
		shopper: "Piseth Long",
		amount: 240000,
		currency: "KHR",
		method: "KHQR",
		state: "Matched",
		recordedAt: "2026-08-18T18:12:00+07:00",
	},
	{
		id: "PAY-55276",
		orderId: "ORD-88177",
		storeId: "STR-1078",
		shopper: "Chanlina Ros",
		amount: 315.0,
		currency: "USD",
		method: "Card",
		state: "Failed",
		recordedAt: "2026-08-18T15:44:00+07:00",
		note: "Provider declined. Shopper retried successfully on PAY-55279.",
	},
	{
		id: "PAY-55271",
		orderId: "ORD-88166",
		storeId: "STR-1042",
		shopper: "Vanna Kim",
		amount: 88.0,
		currency: "USD",
		method: "KHQR",
		state: "Matched",
		recordedAt: "2026-08-18T11:03:00+07:00",
		merchantRefund: {
			at: "2026-08-18T16:40:00+07:00",
			recordedBy: "Sophea Chan",
			reference: "MERCHANT-REF-88166",
			note: "Merchant confirmed a full refund from their own bank account. Angkoro did not move money.",
		},
	},
	{
		id: "PAY-55262",
		orderId: "ORD-88151",
		storeId: "STR-1144",
		shopper: "Kosal Neang",
		amount: 45.0,
		currency: "USD",
		method: "COD",
		state: "Pending",
		recordedAt: "2026-08-17T14:20:00+07:00",
		note: "Cash on delivery — collected by the merchant, never held by Angkoro.",
	},
]

/* =========================================================================
   Merchant settlements  —  PRD R5.4–R5.9
   ========================================================================= */

export type SettlementStage = "Awaiting transfer" | "Processing" | "Completed" | "Blocked"

export type Settlement = {
	id: string
	storeId: string
	storeName: string
	merchantId: string
	amount: number
	currency: Currency
	stage: SettlementStage
	/** Masked by default. R5.8 — unmasking is a separate authorised step. */
	destinationLast4: string
	destinationBank: string
	requestedAt: string
	completedAt?: string
	operator?: string
	bankReference?: string
	blockedReason?: string
	periodCovered: string
	history: Array<{
		at: string
		title: string
		detail?: string
		actor?: string
		reason?: string
		locked?: boolean
	}>
}

export const SETTLEMENTS: Settlement[] = [
	{
		id: "STL-3081",
		storeId: "STR-1078",
		storeName: "Angkor Silk House",
		merchantId: "USR-2244",
		amount: 8420.0,
		currency: "USD",
		stage: "Awaiting transfer",
		destinationLast4: "4417",
		destinationBank: "ABA Bank",
		requestedAt: "2026-08-19T07:00:00+07:00",
		periodCovered: "1–15 Aug 2026",
		history: [
			{
				at: "19 Aug · 07:00",
				title: "Payout prepared",
				detail: "Eligible balance calculated for 1–15 Aug. Destination account previously verified.",
				locked: true,
			},
		],
	},
	{
		id: "STL-3079",
		storeId: "STR-1131",
		storeName: "Bassac Coffee Roasters",
		merchantId: "USR-2318",
		amount: 1240000,
		currency: "KHR",
		stage: "Blocked",
		destinationLast4: "8890",
		destinationBank: "Wing Bank",
		requestedAt: "2026-08-18T07:00:00+07:00",
		blockedReason:
			"Destination account changed on 17 Aug and has not been re-verified. Settlement Account Review must approve the new destination first.",
		periodCovered: "1–15 Aug 2026",
		history: [
			{ at: "18 Aug · 07:00", title: "Payout prepared", locked: true },
			{
				at: "18 Aug · 07:01",
				title: "Blocked automatically",
				detail:
					"The destination account on file changed after the last verification. Transfer held pending review.",
				locked: true,
			},
		],
	},
	{
		id: "STL-3074",
		storeId: "STR-1042",
		storeName: "River & Reed",
		merchantId: "USR-2201",
		amount: 5180.25,
		currency: "USD",
		stage: "Completed",
		destinationLast4: "2019",
		destinationBank: "ACLEDA Bank",
		requestedAt: "2026-08-16T07:00:00+07:00",
		completedAt: "2026-08-16T14:32:00+07:00",
		operator: "Ratana Kong",
		bankReference: "ACL-20260816-77412",
		periodCovered: "16–31 Jul 2026",
		history: [
			{ at: "16 Aug · 07:00", title: "Payout prepared", locked: true },
			{
				at: "16 Aug · 14:12",
				title: "Transfer performed manually",
				detail: "Sent from the Angkoro operating account via ACLEDA business banking.",
				actor: "Ratana Kong · Admin (payout operator)",
				locked: true,
			},
			{
				at: "16 Aug · 14:32",
				title: "Completion recorded with evidence",
				detail: "Bank reference ACL-20260816-77412 attached. Transfer receipt uploaded.",
				actor: "Ratana Kong · Admin (payout operator)",
				locked: true,
			},
		],
	},
	{
		id: "STL-3070",
		storeId: "STR-1115",
		storeName: "Kampot Pepper Co.",
		merchantId: "USR-2290",
		amount: 3260.4,
		currency: "USD",
		stage: "Processing",
		destinationLast4: "6633",
		destinationBank: "ABA Bank",
		requestedAt: "2026-08-18T07:00:00+07:00",
		operator: "Ratana Kong",
		periodCovered: "1–15 Aug 2026",
		history: [
			{ at: "18 Aug · 07:00", title: "Payout prepared", locked: true },
			{
				at: "19 Aug · 09:05",
				title: "Transfer started",
				detail: "Awaiting the bank reference before completion can be recorded.",
				actor: "Ratana Kong · Admin (payout operator)",
				locked: true,
			},
		],
	},
]

/* =========================================================================
   Settlement account review  —  PRD R5.7, R5.8
   ========================================================================= */

export type AccountReview = {
	id: string
	storeId: string
	storeName: string
	merchantId: string
	/** The one blocked settlement waiting on this review, when one exists. */
	settlementId?: string
	holderName: string
	bank: string
	accountLast4: string
	state: "Needs review" | "Approved" | "Rejected"
	submittedAt: string
	isChange: boolean
	previousLast4?: string
	reviewedBy?: string
	reviewedAt?: string
	note?: string
}

export const ACCOUNT_REVIEWS: AccountReview[] = [
	{
		id: "ACR-810",
		storeId: "STR-1131",
		storeName: "Bassac Coffee Roasters",
		merchantId: "USR-2318",
		settlementId: "STL-3079",
		holderName: "SAM VIBOL",
		bank: "Wing Bank",
		accountLast4: "8890",
		state: "Needs review",
		submittedAt: "2026-08-17T16:22:00+07:00",
		isChange: true,
		previousLast4: "3312",
		note: "Destination changed three days after the previous account was verified. STL-3079 is blocked pending this review.",
	},
	{
		id: "ACR-808",
		storeId: "STR-1163",
		storeName: "Battambang Rice Traders",
		merchantId: "USR-2362",
		holderName: "UNG SOPHEAK",
		bank: "ACLEDA Bank",
		accountLast4: "5074",
		state: "Needs review",
		submittedAt: "2026-08-19T08:40:00+07:00",
		isChange: false,
	},
	{
		id: "ACR-801",
		storeId: "STR-1042",
		storeName: "River & Reed",
		merchantId: "USR-2201",
		holderName: "MEAS SOKHA",
		bank: "ACLEDA Bank",
		accountLast4: "2019",
		state: "Approved",
		submittedAt: "2026-07-28T10:15:00+07:00",
		isChange: false,
		reviewedBy: "Ratana Kong",
		reviewedAt: "2026-07-28T15:02:00+07:00",
	},
	{
		id: "ACR-796",
		storeId: "STR-1158",
		storeName: "Mekong Home Goods",
		merchantId: "USR-2350",
		holderName: "CHEA RITHY",
		bank: "ABA Bank",
		accountLast4: "9931",
		state: "Rejected",
		submittedAt: "2026-08-14T09:30:00+07:00",
		isChange: true,
		previousLast4: "7745",
		reviewedBy: "Ratana Kong",
		reviewedAt: "2026-08-16T10:10:00+07:00",
		note: "Account holder name does not match the registered merchant. Rejected during the policy investigation.",
	},
]

/* =========================================================================
   Store plan and billing  —  PRD R5.1–R5.3
   ========================================================================= */

export type BillingRecord = {
	id: string
	storeId: string
	storeName: string
	plan: string
	amount: number
	currency: Currency
	state: "Paid" | "Unmatched" | "Failed" | "Pending"
	dueAt: string
	paidAt?: string
	method: "KHQR" | "Card"
	reference?: string
	note?: string
}

export const BILLING: BillingRecord[] = [
	{
		id: "BIL-9204",
		storeId: "STR-1144",
		storeName: "Siem Reap Ceramics",
		plan: "Starter · monthly",
		amount: 15.0,
		currency: "USD",
		state: "Unmatched",
		dueAt: "2026-08-17T00:00:00+07:00",
		method: "KHQR",
		note: "Merchant states payment was sent 17 Aug. No matching record. CASE-4408 is awaiting evidence.",
	},
	{
		id: "BIL-9198",
		storeId: "STR-1078",
		storeName: "Angkor Silk House",
		plan: "Scale · monthly",
		amount: 79.0,
		currency: "USD",
		state: "Pending",
		dueAt: "2026-08-22T00:00:00+07:00",
		method: "KHQR",
		note: "Plan access expires in 3 days if the renewal is not received.",
	},
	{
		id: "BIL-9191",
		storeId: "STR-1042",
		storeName: "River & Reed",
		plan: "Growth · monthly",
		amount: 39.0,
		currency: "USD",
		state: "Paid",
		dueAt: "2026-08-12T00:00:00+07:00",
		paidAt: "2026-08-11T19:22:00+07:00",
		method: "KHQR",
		reference: "ABA-20260811-55219",
	},
	{
		id: "BIL-9187",
		storeId: "STR-1115",
		storeName: "Kampot Pepper Co.",
		plan: "Growth · monthly",
		amount: 39.0,
		currency: "USD",
		state: "Paid",
		dueAt: "2026-08-04T00:00:00+07:00",
		paidAt: "2026-08-03T08:41:00+07:00",
		method: "Card",
		reference: "CRD-20260803-11904",
	},
	{
		id: "BIL-9180",
		storeId: "STR-1158",
		storeName: "Mekong Home Goods",
		plan: "Growth · monthly",
		amount: 39.0,
		currency: "USD",
		state: "Failed",
		dueAt: "2026-08-08T00:00:00+07:00",
		method: "Card",
		note: "Card declined twice. Store is suspended for an unrelated policy reason — billing state is tracked separately (R3.8).",
	},
]

/* =========================================================================
   Order issues  —  PRD R4.1–R4.4
   ========================================================================= */

export type OrderIssue = {
	id: string
	orderId: string
	storeId: string
	storeName: string
	kind: string
	origin: "User report" | "Verified system signal"
	state: "Open" | "Investigating" | "Resolved"
	detectedAt: string
	caseId?: string
	summary: string
}

export const ORDER_ISSUES: OrderIssue[] = [
	{
		id: "OIS-612",
		orderId: "ORD-88214",
		storeId: "STR-1078",
		storeName: "Angkor Silk House",
		kind: "Payment recorded but order not advanced",
		origin: "User report",
		state: "Investigating",
		detectedAt: "2026-08-19T08:05:00+07:00",
		caseId: "CASE-4417",
		summary:
			"Order auto-cancelled on the decision timeout while an unmatched KHQR payment existed against it.",
	},
	{
		id: "OIS-609",
		orderId: "ORD-88203",
		storeId: "STR-1042",
		storeName: "River & Reed",
		kind: "Inventory oversold at checkout",
		origin: "Verified system signal",
		state: "Open",
		detectedAt: "2026-08-19T05:12:00+07:00",
		summary:
			"Two orders accepted for the same last tracked unit. Stock reservation did not hold across concurrent checkouts.",
	},
	{
		id: "OIS-604",
		orderId: "ORD-88188",
		storeId: "STR-1115",
		storeName: "Kampot Pepper Co.",
		kind: "Decision timeout fired early",
		origin: "Verified system signal",
		state: "Resolved",
		detectedAt: "2026-08-18T13:40:00+07:00",
		summary:
			"Auto-cancellation ran against createdAt rather than paidAt for a prepaid order. Order reinstated after review.",
	},
]

/* =========================================================================
   Account recovery  —  PRD R6, Register §3.4
   ========================================================================= */

export type RecoveryCase = {
	id: string
	caseId: string
	subject: string
	accountId: string
	accountName: string
	state: "Awaiting evidence" | "Awaiting approval" | "Approved" | "Rejected"
	openedAt: string
	openedBy: string
	evidence: Array<{ kind: string; provided: boolean }>
	approver?: string
	decidedAt?: string
	note?: string
}

export const RECOVERY: RecoveryCase[] = [
	{
		id: "REC-142",
		caseId: "CASE-4415",
		subject: "Owner lost access to the registered email and phone",
		accountId: "USR-2331",
		accountName: "Bopha Ly",
		state: "Awaiting approval",
		openedAt: "2026-08-18T15:10:00+07:00",
		openedBy: "Sophea Chan",
		evidence: [
			{ kind: "Government ID matching the registered account holder", provided: true },
			{ kind: "Business registration document for the store", provided: true },
			{ kind: "Access to a previously used payout account", provided: true },
			{ kind: "Video verification call with the account holder", provided: false },
		],
		note: "Self-service recovery unavailable: both the registered email and phone are unreachable.",
	},
	{
		id: "REC-139",
		caseId: "CASE-4402",
		subject: "Merchant requests transfer of store to a business partner",
		accountId: "USR-2290",
		accountName: "Chantha Nou",
		state: "Rejected",
		openedAt: "2026-08-14T11:30:00+07:00",
		openedBy: "Sophea Chan",
		evidence: [{ kind: "Government ID matching the registered account holder", provided: true }],
		approver: "Sophea Chan",
		decidedAt: "2026-08-14T14:20:00+07:00",
		note: "Account Recovery cannot be used to transfer store ownership (R6.12). Directed to the separate privileged ownership workflow.",
	},
]

/* =========================================================================
   Plans and entitlements  —  PRD R5.10–R5.15
   ========================================================================= */

export type Plan = {
	id: string
	name: string
	price: number
	currency: Currency
	period: "Monthly" | "Yearly"
	active: boolean
	subscribers: number
	limits: Array<{ label: string; value: string }>
}

export const PLANS: Plan[] = [
	{
		id: "PLN-01",
		name: "Starter",
		price: 15,
		currency: "USD",
		period: "Monthly",
		active: true,
		subscribers: 4,
		limits: [
			{ label: "Products", value: "100" },
			{ label: "Staff accounts", value: "1" },
			{ label: "Telegram channels", value: "1" },
			{ label: "Custom domain", value: "Not included" },
		],
	},
	{
		id: "PLN-02",
		name: "Growth",
		price: 39,
		currency: "USD",
		period: "Monthly",
		active: true,
		subscribers: 3,
		limits: [
			{ label: "Products", value: "1,000" },
			{ label: "Staff accounts", value: "5" },
			{ label: "Telegram channels", value: "3" },
			{ label: "Custom domain", value: "Included" },
		],
	},
	{
		id: "PLN-03",
		name: "Scale",
		price: 79,
		currency: "USD",
		period: "Monthly",
		active: true,
		subscribers: 1,
		limits: [
			{ label: "Products", value: "Unlimited" },
			{ label: "Staff accounts", value: "20" },
			{ label: "Telegram channels", value: "10" },
			{ label: "Custom domain", value: "Included" },
		],
	},
]

/* =========================================================================
   Operational health  —  PRD R7, Register §5.1 (from the backend audit)
   ========================================================================= */

export type ProcessHealth = {
	id: string
	name: string
	kind: "Scheduled job" | "Queue worker" | "Outbox relay" | "Integration"
	state: "Healthy" | "Degraded" | "Failed"
	lastRunAt: string
	detail: string
	/** Failures needing staff attention, not raw infrastructure metrics. */
	failures24h: number
	caseId?: string
	retryable: boolean
}

export const PROCESS_HEALTH: ProcessHealth[] = [
	{
		id: "PRC-01",
		name: "Order decision timeout",
		kind: "Scheduled job",
		state: "Degraded",
		lastRunAt: "2026-08-19T10:00:00+07:00",
		detail:
			"Cron backstop ran, but three prepaid orders were evaluated against createdAt instead of paidAt. Linked to OIS-604.",
		failures24h: 3,
		retryable: false,
	},
	{
		id: "PRC-02",
		name: "Telegram notification delivery",
		kind: "Queue worker",
		state: "Failed",
		lastRunAt: "2026-08-19T10:28:00+07:00",
		detail:
			"Bot API returned 429 for 41 messages in the last hour. Order confirmations to shoppers are not being delivered.",
		failures24h: 41,
		caseId: "CASE-4419",
		retryable: true,
	},
	{
		id: "PRC-03",
		name: "Payment webhook outbox relay",
		kind: "Outbox relay",
		state: "Healthy",
		lastRunAt: "2026-08-19T10:31:00+07:00",
		detail: "Relay is draining normally. No events older than 60 seconds in the outbox.",
		failures24h: 0,
		retryable: false,
	},
	{
		id: "PRC-04",
		name: "KHQR payment matching",
		kind: "Integration",
		state: "Degraded",
		lastRunAt: "2026-08-19T10:15:00+07:00",
		detail: "Two shopper payments recorded without a matched bank settlement line. PAY-55301 is one of them.",
		failures24h: 2,
		caseId: "CASE-4417",
		retryable: true,
	},
	{
		id: "PRC-05",
		name: "Plan renewal reminder",
		kind: "Scheduled job",
		state: "Healthy",
		lastRunAt: "2026-08-19T08:00:00+07:00",
		detail: "Ran on schedule. Two expiry notices sent.",
		failures24h: 0,
		retryable: false,
	},
]

/* =========================================================================
   Administrators and sessions  —  PRD R1
   ========================================================================= */

export type AdminAccount = {
	id: string
	name: string
	email: string
	roles: Role[]
	state: "Active" | "Invited" | "Disabled"
	lastActiveAt: string
	activeSessions: number
	twoFactor: boolean
	addedAt: string
}

export const ADMINS: AdminAccount[] = [
	{
		id: "ADM-01",
		name: "Sophea Chan",
		email: "sophea.chan@angkoro.com",
		roles: ["Super Admin"],
		state: "Active",
		lastActiveAt: "2026-08-19T10:30:00+07:00",
		activeSessions: 2,
		twoFactor: true,
		addedAt: "2026-01-05T09:00:00+07:00",
	},
	{
		id: "ADM-02",
		name: "Ratana Kong",
		email: "ratana.kong@angkoro.com",
		roles: ["Admin"],
		state: "Active",
		lastActiveAt: "2026-08-19T09:52:00+07:00",
		activeSessions: 1,
		twoFactor: true,
		addedAt: "2026-01-05T09:00:00+07:00",
	},
	{
		id: "ADM-03",
		name: "Panha Sok",
		email: "panha.sok@angkoro.com",
		roles: ["Admin"],
		state: "Active",
		lastActiveAt: "2026-08-19T10:22:00+07:00",
		activeSessions: 1,
		twoFactor: true,
		addedAt: "2026-02-11T09:00:00+07:00",
	},
	{
		id: "ADM-04",
		name: "Lena Uy",
		email: "lena.uy@angkoro.com",
		roles: ["Admin"],
		state: "Invited",
		lastActiveAt: "2026-08-18T16:00:00+07:00",
		activeSessions: 0,
		twoFactor: false,
		addedAt: "2026-08-18T16:00:00+07:00",
	},
	{
		id: "ADM-05",
		name: "Visal Heng",
		email: "visal.heng@angkoro.com",
		roles: ["Admin"],
		state: "Disabled",
		lastActiveAt: "2026-07-30T17:40:00+07:00",
		activeSessions: 0,
		twoFactor: true,
		addedAt: "2026-03-02T09:00:00+07:00",
	},
]

export type AdminSession = {
	id: string
	adminId: string
	adminName: string
	device: string
	location: string
	startedAt: string
	lastSeenAt: string
	current: boolean
}

export const ADMIN_SESSIONS: AdminSession[] = [
	{
		id: "SES-9001",
		adminId: "ADM-01",
		adminName: "Sophea Chan",
		device: "Chrome · Windows",
		location: "Phnom Penh, KH",
		startedAt: "2026-08-19T07:45:00+07:00",
		lastSeenAt: "2026-08-19T10:30:00+07:00",
		current: true,
	},
	{
		id: "SES-8994",
		adminId: "ADM-01",
		adminName: "Sophea Chan",
		device: "Safari · iPhone",
		location: "Phnom Penh, KH",
		startedAt: "2026-08-18T19:10:00+07:00",
		lastSeenAt: "2026-08-19T06:58:00+07:00",
		current: false,
	},
	{
		id: "SES-8990",
		adminId: "ADM-02",
		adminName: "Ratana Kong",
		device: "Chrome · macOS",
		location: "Phnom Penh, KH",
		startedAt: "2026-08-19T08:30:00+07:00",
		lastSeenAt: "2026-08-19T09:52:00+07:00",
		current: false,
	},
	{
		id: "SES-8981",
		adminId: "ADM-03",
		adminName: "Panha Sok",
		device: "Firefox · Linux",
		location: "Siem Reap, KH",
		startedAt: "2026-08-19T06:15:00+07:00",
		lastSeenAt: "2026-08-19T10:22:00+07:00",
		current: false,
	},
]

/**
 * Protected audit history (R1.5, R1.6).
 *
 * Append-only in production: ordinary administrators cannot rewrite or erase it.
 */
export type AuditRecord = {
	id: string
	action: string
	target: string
	actor: string
	role: Role
	at: string
	reason?: string
}

export const AUDIT: AuditRecord[] = [
	{
		id: "AUD-2214",
		action: "Merchant account restricted",
		target: "USR-2350 · Rithy Chea",
		actor: "Sophea Chan",
		role: "Super Admin",
		at: "2026-08-16T09:44:00+07:00",
		reason: "Account access restricted during the hosted-service policy investigation on STR-1158.",
	},
	{
		id: "AUD-2213",
		action: "Store suspended",
		target: "STR-1158 · Mekong Home Goods",
		actor: "Sophea Chan",
		role: "Super Admin",
		at: "2026-08-16T09:40:00+07:00",
		reason:
			"Hosted-service policy violation confirmed after review: storefront used to collect payment for goods the store does not hold.",
	},
	{
		id: "AUD-2211",
		action: "Settlement destination rejected",
		target: "ACR-796 · Mekong Home Goods",
		actor: "Ratana Kong",
		role: "Admin",
		at: "2026-08-16T10:10:00+07:00",
		reason: "Account holder name does not match the registered merchant.",
	},
	{
		id: "AUD-2208",
		action: "Manual payout completed",
		target: "STL-3074 · River & Reed · $5,180.25",
		actor: "Ratana Kong",
		role: "Admin",
		at: "2026-08-16T14:32:00+07:00",
	},
	{
		id: "AUD-2205",
		action: "Merchant-facing store view opened",
		target: "STR-1144 · Siem Reap Ceramics · Viewed billing history",
		actor: "Sophea Chan",
		role: "Admin",
		at: "2026-08-18T10:05:00+07:00",
		reason: "Built from admin-held data; no merchant credentials or session used (R1.8, R3.8). Investigating an unmatched plan payment on CASE-4408.",
	},
	{
		id: "AUD-2203",
		action: "Direct change to store/merchant account",
		target: "STR-1144 · Siem Reap Ceramics · Update payout contact email to ops@sr-ceramics.com",
		actor: "Sophea Chan",
		role: "Super Admin",
		at: "2026-08-18T11:40:00+07:00",
		reason: "Merchant's old contact mailbox bounced; consent proven by merchant reply on the CASE-4408 email thread.",
	},
	{
		id: "AUD-2201",
		action: "Administrator invited",
		target: "ADM-04 · lena.uy@angkoro.com",
		actor: "Sophea Chan",
		role: "Super Admin",
		at: "2026-08-18T16:00:00+07:00",
	},
	{
		id: "AUD-2196",
		action: "Administrator access disabled",
		target: "ADM-05 · Visal Heng",
		actor: "Sophea Chan",
		role: "Super Admin",
		at: "2026-07-30T17:45:00+07:00",
		reason: "Left the team. Access removed on the final working day.",
	},
]

/* =========================================================================
   Lookups
   ========================================================================= */

export function storeById(id: string): Store | undefined {
	return STORES.find((store) => store.id === id)
}

export function userById(id: string): UserAccount | undefined {
	return USERS.find((user) => user.id === id)
}

export function caseById(id: string): SupportCase | undefined {
	return CASES.find((entry) => entry.id === id)
}

export function settlementById(id: string): Settlement | undefined {
	return SETTLEMENTS.find((entry) => entry.id === id)
}
