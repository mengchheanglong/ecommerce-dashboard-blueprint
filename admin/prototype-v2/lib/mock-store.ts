"use client"

/**
 * Mock application store.
 *
 * A single in-memory, seeded copy of every dataset, mutated through typed
 * actions. Every PRD workflow in the prototype goes through this layer so that
 * an action on one screen is visible everywhere else: closing a case removes it
 * from the Overview queue; approving a destination unblocks the payout; a
 * restriction applied to a user shows up on their record and in the audit.
 *
 * This is deliberately not localStorage-persisted — a refresh resets to seed so
 * a reviewer always starts from the same known state. In production each
 * action becomes one authenticated API call; the call sites are already shaped
 * like API boundaries (action name + payload + audited actor).
 */

import { useSyncExternalStore } from "react"

import { NOW } from "@/lib/format"
import { can, type Role } from "@/lib/permissions"
import {
	ACCOUNT_REVIEWS,
	ADMINS,
	ADMIN_SESSIONS,
	AUDIT,
	BILLING,
	CASES,
	ORDER_ISSUES,
	PAYMENTS,
	PLANS,
	PROCESS_HEALTH,
	RECOVERY,
	SETTLEMENTS,
	STORES,
	USERS,
	type AccountReview,
	type AdminAccount,
	type AdminSession,
	type BillingRecord,
	type OrderIssue,
	type Payment,
	type Plan,
	type ProcessHealth,
	type RecoveryCase,
	type Settlement,
	type SupportCase,
	type UserAccount,
	type UserAccess,
	type UserKind,
} from "@/data/seed"

/* -------------------------------------------------------------------------
   State shape
------------------------------------------------------------------------- */

export type AuditRecord = {
	id: string
	action: string
	target: string
	actor: string
	role: Role
	at: string
	reason?: string
}

type State = {
	users: UserAccount[]
	stores: (typeof STORES)[number][]
	cases: SupportCase[]
	payments: Payment[]
	settlements: Settlement[]
	accountReviews: AccountReview[]
	billing: BillingRecord[]
	orderIssues: OrderIssue[]
	recovery: RecoveryCase[]
	plans: Plan[]
	processHealth: ProcessHealth[]
	admins: AdminAccount[]
	adminSessions: AdminSession[]
	audit: AuditRecord[]
}

function initialState(): State {
	return {
		users: structuredClone(USERS),
		stores: structuredClone(STORES),
		cases: structuredClone(CASES),
		payments: structuredClone(PAYMENTS),
		settlements: structuredClone(SETTLEMENTS),
		accountReviews: structuredClone(ACCOUNT_REVIEWS),
		billing: structuredClone(BILLING),
		orderIssues: structuredClone(ORDER_ISSUES),
		recovery: structuredClone(RECOVERY),
		plans: structuredClone(PLANS),
		processHealth: structuredClone(PROCESS_HEALTH),
		admins: structuredClone(ADMINS),
		adminSessions: structuredClone(ADMIN_SESSIONS),
		audit: structuredClone(AUDIT),
	}
}

/* -------------------------------------------------------------------------
   Tiny external store
------------------------------------------------------------------------- */

let state: State = initialState()
const listeners = new Set<() => void>()

function emit() {
	for (const listener of listeners) listener()
}

export function useMockState(): State {
	return useSyncExternalStore(
		(onChange) => {
			listeners.add(onChange)
			return () => listeners.delete(onChange)
		},
		() => state,
		() => state,
	)
}

/** Reset everything back to seed — exposed for a "reset demo data" affordance. */
export function resetMockData() {
	state = initialState()
	emit()
}

/* -------------------------------------------------------------------------
   Helpers
------------------------------------------------------------------------- */

let auditSeq = 0

function appendAudit(entry: {
	action: string
	target: string
	actor: string
	role: Role
	reason?: string
}) {
	auditSeq += 1
	const record: AuditRecord = {
		id: `AUD-NEW-${String(auditSeq).padStart(3, "0")}`,
		at: NOW.toISOString(),
		...entry,
	}
	state.audit = [record, ...state.audit]
	return record
}

/** Stamp used for new history entries / timestamps across actions. */
function stamp(): string {
	return NOW.toISOString()
}

function nowLabel(): string {
	const d = NOW
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	return `${d.getDate()} ${months[d.getMonth()]} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const MAX_AUDIT_TEXT = 500

function cleanText(value: string | undefined, minimum = 1, maximum = MAX_AUDIT_TEXT) {
	const cleaned = value?.trim() ?? ""
	return cleaned.length >= minimum && cleaned.length <= maximum ? cleaned : undefined
}

/** Resolve every held account kind to its own independent access state. */
export function getUserAccesses(user: UserAccount): UserAccess[] {
	return user.kinds.map((kind) => {
		const explicit = user.access?.find((entry) => entry.kind === kind)
		if (explicit) return explicit
		const status = user.kinds.length === 1 ? user.status : "Active"
		return {
			kind,
			status,
			restriction: status === "Active" ? undefined : user.restriction,
		}
	})
}

function combinedUserStatus(access: UserAccess[]): UserAccount["status"] {
	if (access.some((entry) => entry.status === "Banned")) return "Banned"
	if (access.some((entry) => entry.status === "Restricted")) return "Restricted"
	return "Active"
}

/* -------------------------------------------------------------------------
   Actions — support cases (R2)
------------------------------------------------------------------------- */

export function assignCase(caseId: string, assignee: string, role: Role) {
	state.cases = state.cases.map((c) =>
		c.id === caseId ? { ...c, assignee, lastUpdateAt: stamp(), history: [...c.history, { at: nowLabel(), title: `Assigned to ${assignee}`, actor: assignee }] } : c,
	)
	appendAudit({ action: "Case assigned", target: caseId, actor: assignee, role })
	emit()
}

export function addCaseNote(caseId: string, note: string, author: string, role: Role) {
	state.cases = state.cases.map((c) =>
		c.id === caseId ? { ...c, lastUpdateAt: stamp(), history: [...c.history, { at: nowLabel(), title: "Internal note added", detail: note, actor: author }] } : c,
	)
	appendAudit({ action: "Internal note added", target: caseId, actor: author, role })
	emit()
}

export function replyToCase(caseId: string, message: string, channel: string, author: string, role: Role) {
	const label =
		channel === "Platform report" ? "Response sent through the platform" : `Reply sent via ${channel}`
	state.cases = state.cases.map((c) =>
		c.id === caseId
			? {
					...c,
					status: c.status === "Open" ? ("Investigating" as const) : c.status,
					lastUpdateAt: stamp(),
					history: [...c.history, { at: nowLabel(), title: label, detail: message, actor: author }],
				}
			: c,
	)
	appendAudit({ action: label, target: caseId, actor: author, role })
	emit()
}

export function closeCase(caseId: string, reason: string, operator: string, role: Role) {
	state.cases = state.cases.map((c) =>
		c.id === caseId
			? {
					...c,
					status: "Resolved",
					lastUpdateAt: stamp(),
					history: [
						...c.history,
						{ at: nowLabel(), title: "Case resolved and closed", detail: reason, actor: operator },
					],
				}
			: c,
	)
	appendAudit({ action: "Case closed", target: caseId, actor: operator, role, reason })
	emit()
}

export function createCase(input: {
	subject: string
	channel: SupportCase["channel"]
	priority: SupportCase["priority"]
	reporterName: string
	reporterKind: SupportCase["reporter"]["kind"]
	summary: string
	storeId?: string
	operator: string
	role: Role
}) {
	const subject = cleanText(input.subject, 4, 160)
	const reporterName = cleanText(input.reporterName, 2, 120)
	const summary = cleanText(input.summary, 8)
	const operator = cleanText(input.operator, 2, 120)
	const storeId = cleanText(input.storeId, 1, 40)
	if (!can(input.role, "case.manage") || !subject || !reporterName || !summary || !operator) return
	if (storeId && !state.stores.some((store) => store.id === storeId)) return

	const maxSuffix = Math.max(
		0,
		...state.cases.map((entry) => {
			const match = /^CASE-(\d+)$/.exec(entry.id)
			return match ? Number(match[1]) : 0
		}),
	)
	const id = `CASE-${maxSuffix + 1}`
	const due = new Date(NOW.getTime() + 4 * 60 * 60 * 1000).toISOString()
	const record: SupportCase = {
		id,
		subject,
		channel: input.channel,
		status: "Open",
		priority: input.priority,
		assignee: operator,
		reporter: { name: reporterName, kind: input.reporterKind, contact: "—" },
		linked: storeId ? { storeId } : {},
		openedAt: stamp(),
		dueAt: due,
		lastUpdateAt: stamp(),
		summary,
		history: [
			{
				at: nowLabel(),
				title:
					input.channel === "Platform report"
						? "Case created from platform report"
						: `Manually recorded from ${input.channel}`,
				detail: summary,
				actor: operator,
			},
		],
	}
	state.cases = [record, ...state.cases]
	appendAudit({
		action: "Support case created",
		target: `${id} · ${subject}`,
		actor: operator,
		role: input.role,
	})
	emit()
	return id
}

/* -------------------------------------------------------------------------
   Actions — users (R3.5–R3.6)
------------------------------------------------------------------------- */

export function setUserStatus(
	userId: string,
	accessKind: UserKind,
	status: UserAccount["status"],
	reason: string | undefined,
	operator: string,
	role: Role,
) {
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const user = state.users.find((entry) => entry.id === userId)
	const current = user ? getUserAccesses(user).find((entry) => entry.kind === accessKind) : undefined
	if (
		!can(role, "user.restrict") ||
		!user ||
		!current ||
		!cleanReason ||
		!cleanOperator ||
		current.status === status
	) return false

	state.users = state.users.map((entry) => {
		if (entry.id !== userId) return entry
		const access = getUserAccesses(entry).map((item) =>
			item.kind === accessKind
				? {
						kind: item.kind,
						status,
						restriction:
							status === "Active"
								? undefined
								: { reason: cleanReason, appliedBy: cleanOperator, appliedAt: stamp() },
					}
				: item,
		)
		const combinedStatus = combinedUserStatus(access)
		return {
			...entry,
			access,
			status: combinedStatus,
			activeSessions: status === "Active" ? entry.activeSessions : 0,
			restriction: access.find((item) => item.status !== "Active")?.restriction,
		}
	})
	appendAudit({
		action:
			status === "Active"
				? `${accessKind} access restored`
				: `${accessKind} access ${status.toLowerCase()}`,
		target: `${userId} · ${accessKind} access`,
		actor: cleanOperator,
		role,
		reason: cleanReason,
	})
	emit()
	return true
}

export function revokeUserSessions(userId: string, operator: string, role: Role) {
	const cleanOperator = cleanText(operator, 2, 120)
	const user = state.users.find((entry) => entry.id === userId)
	if (!can(role, "user.restrict") || !cleanOperator || !user || user.activeSessions === 0) return false
	state.users = state.users.map((u) => (u.id === userId ? { ...u, activeSessions: 0 } : u))
	appendAudit({ action: "User sessions revoked", target: userId, actor: cleanOperator, role })
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — stores (R3.8)
------------------------------------------------------------------------- */

export function setStoreStatus(
	storeId: string,
	status: (typeof STORES)[number]["status"],
	reason: string | undefined,
	operator: string,
	role: Role,
) {
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const store = state.stores.find((entry) => entry.id === storeId)
	if (
		!can(role, "store.restrict") ||
		!store ||
		!cleanReason ||
		!cleanOperator ||
		store.status === status
	) return false
	state.stores = state.stores.map((s) =>
		s.id === storeId
			? {
					...s,
					status,
					restriction:
						status === "Active"
							? undefined
							: { reason: cleanReason, appliedBy: cleanOperator, appliedAt: stamp() },
				}
			: s,
	)
	appendAudit({
		action: status === "Active" ? "Store restored" : `Store suspended`,
		target: storeId,
		actor: cleanOperator,
		role,
		reason: cleanReason,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — order issues (R4.7)
------------------------------------------------------------------------- */

const ORDER_ISSUE_TRANSITIONS: Record<OrderIssue["state"], OrderIssue["state"][]> = {
	Open: ["Investigating"],
	Investigating: ["Resolved"],
	Resolved: [],
}

export function setOrderIssueState(
	issueId: string,
	nextState: OrderIssue["state"],
	reason: string,
	operator: string,
	role: Role,
) {
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const issue = state.orderIssues.find((entry) => entry.id === issueId)
	const forward = issue ? ORDER_ISSUE_TRANSITIONS[issue.state].includes(nextState) : false
	if (!can(role, "orderissue.correct") || !issue || !forward || !cleanReason || !cleanOperator) {
		return false
	}
	state.orderIssues = state.orderIssues.map((entry) =>
		entry.id === issueId ? { ...entry, state: nextState } : entry,
	)
	appendAudit({
		action: `Order issue ${nextState.toLowerCase()}`,
		target: `${issueId} · ${issue.orderId} · ${issue.kind}`,
		actor: cleanOperator,
		role,
		reason: cleanReason,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — payments (R4.9–R4.11)
------------------------------------------------------------------------- */

export function matchPayment(paymentId: string, note: string, operator: string, role: Role) {
	const cleanNote = cleanText(note, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const payment = state.payments.find((entry) => entry.id === paymentId)
	if (
		!can(role, "payment.correct") ||
		!payment ||
		payment.state !== "Unmatched" ||
		!cleanNote ||
		!cleanOperator
	) return false
	state.payments = state.payments.map((p) =>
		p.id === paymentId ? { ...p, state: "Matched", note: cleanNote } : p,
	)
	appendAudit({ action: "Payment matched", target: paymentId, actor: cleanOperator, role, reason: cleanNote })
	emit()
	return true
}

export function recordMerchantRefund(
	paymentId: string,
	reference: string,
	note: string,
	operator: string,
	role: Role,
) {
	const cleanReference = cleanText(reference, 4, 120)
	const cleanNote = cleanText(note, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const payment = state.payments.find((entry) => entry.id === paymentId)
	if (
		!can(role, "payment.correct") ||
		!payment ||
		payment.state !== "Matched" ||
		payment.merchantRefund ||
		!cleanReference ||
		!cleanNote ||
		!cleanOperator
	) return false
	state.payments = state.payments.map((p) =>
		p.id === paymentId
			? {
					...p,
					merchantRefund: {
						at: stamp(),
						recordedBy: cleanOperator,
						reference: cleanReference,
						note: cleanNote,
					},
				}
			: p,
	)
	appendAudit({
		action: "Merchant refund recorded (no money moved by Angkoro)",
		target: paymentId,
		actor: cleanOperator,
		role,
		reason: `${cleanReference} · ${cleanNote}`,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — billing (R5.2)
------------------------------------------------------------------------- */

export function resolveBilling(
	billingId: string,
	reference: string,
	note: string,
	operator: string,
	role: Role,
) {
	const cleanReference = cleanText(reference, 4, 120)
	const cleanNote = cleanText(note, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const billing = state.billing.find((entry) => entry.id === billingId)
	if (
		!can(role, "billing.investigate") ||
		!billing ||
		billing.state === "Paid" ||
		!cleanReference ||
		!cleanNote ||
		!cleanOperator
	) return false
	state.billing = state.billing.map((entry) =>
		entry.id === billingId
			? { ...entry, state: "Paid", paidAt: stamp(), reference: cleanReference, note: cleanNote }
			: entry,
	)
	appendAudit({
		action: "Billing correction recorded",
		target: billingId,
		actor: cleanOperator,
		role,
		reason: `${cleanReference} · ${cleanNote}`,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — settlements and destinations (R5.5–R5.9)
------------------------------------------------------------------------- */

export function startTransfer(settlementId: string, operator: string, role: Role) {
	const cleanOperator = cleanText(operator, 2, 120)
	const settlement = state.settlements.find((entry) => entry.id === settlementId)
	if (
		!can(role, "settlement.record") ||
		!settlement ||
		settlement.stage !== "Awaiting transfer" ||
		!cleanOperator
	) return false
	state.settlements = state.settlements.map((s) =>
		s.id === settlementId
			? {
					...s,
					stage: "Processing",
					operator: cleanOperator,
					history: [...s.history, { at: nowLabel(), title: "Transfer started", detail: "Transfer initiated in the bank system. A bank reference is required when completion is recorded.", actor: cleanOperator, locked: true }],
				}
			: s,
	)
	appendAudit({ action: "Manual payout started", target: settlementId, actor: cleanOperator, role })
	emit()
	return true
}

export function completeTransfer(settlementId: string, bankReference: string, note: string | undefined, operator: string, role: Role) {
	const cleanReference = cleanText(bankReference, 6, 120)
	const cleanNote = cleanText(note, 1)
	const cleanOperator = cleanText(operator, 2, 120)
	const settlement = state.settlements.find((entry) => entry.id === settlementId)
	if (
		!can(role, "settlement.record") ||
		!settlement ||
		settlement.stage !== "Processing" ||
		!cleanReference ||
		!cleanOperator
	) return false
	state.settlements = state.settlements.map((s) =>
		s.id === settlementId
			? {
					...s,
					stage: "Completed",
					completedAt: stamp(),
					operator: cleanOperator,
					bankReference: cleanReference,
					history: [
						...s.history,
						{
							at: nowLabel(),
							title: "Completion recorded with evidence",
							detail: `Bank reference ${cleanReference} attached.${cleanNote ? ` ${cleanNote}` : ""}`,
							actor: cleanOperator,
							locked: true,
						},
					],
				}
			: s,
	)
	appendAudit({
		action: "Manual payout completed",
		target: settlementId,
		actor: cleanOperator,
		role,
		reason: cleanNote,
	})
	emit()
	return true
}

export function decideAccountReview(
	reviewId: string,
	decision: "Approved" | "Rejected",
	note: string | undefined,
	operator: string,
	role: Role,
) {
	const cleanNote = cleanText(note, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const review = state.accountReviews.find((entry) => entry.id === reviewId)
	if (
		!can(role, "settlement.account.review") ||
		!review ||
		review.state !== "Needs review" ||
		!cleanNote ||
		!cleanOperator
	) return false
	state.accountReviews = state.accountReviews.map((r) =>
		r.id === reviewId
			? { ...r, state: decision, reviewedBy: cleanOperator, reviewedAt: stamp(), note: cleanNote }
			: r,
	)
	// Approving a changed destination unblocks only the payout linked to this review.
	if (decision === "Approved" && review.settlementId) {
		state.settlements = state.settlements.map((s) =>
				s.id === review.settlementId && s.stage === "Blocked"
					? {
							...s,
							stage: "Awaiting transfer",
							blockedReason: undefined,
							history: [
								...s.history,
								{
									at: nowLabel(),
									title: "Unblocked",
									detail: "Destination account approved in Settlement Account Review.",
									actor: cleanOperator,
									locked: true,
								},
							],
						}
					: s,
			)
	}
	appendAudit({
		action: decision === "Approved" ? "Payout destination approved" : "Payout destination rejected",
		target: reviewId,
		actor: cleanOperator,
		role,
		reason: cleanNote,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — plans (R5.11–R5.16)
------------------------------------------------------------------------- */

export function updatePlan(planId: string, patch: Partial<Pick<Plan, "price" | "period">>, changeNote: string, operator: string, role: Role) {
	state.plans = state.plans.map((p) => (p.id === planId ? { ...p, ...patch } : p))
	appendAudit({
		action: "Plan configuration updated",
		target: planId,
		actor: operator,
		role,
		reason: changeNote,
	})
	emit()
}

export function togglePlanActive(planId: string, operator: string, role: Role) {
	let became: string | undefined
	state.plans = state.plans.map((p) => {
		if (p.id !== planId) return p
		became = p.active ? "deactivated" : "activated"
		return { ...p, active: !p.active }
	})
	appendAudit({ action: `Plan ${became}`, target: planId, actor: operator, role })
	emit()
}

/* -------------------------------------------------------------------------
   Actions — stores: merchant-facing view + direct change (R3.8–R3.10)
------------------------------------------------------------------------- */

/**
 * R3.8/R3.10 — every open of the store's merchant-facing view is attributed
 * to the real administrator and written to the audit history. The view itself
 * is built from data the admin system already holds; no merchant session.
 */
export function logStoreMerchantView(storeId: string, label: string, operator: string, role: Role) {
	const store = state.stores.find((s) => s.id === storeId)
	appendAudit({
		action: "Merchant-facing store view opened",
		target: `${storeId}${store ? ` · ${store.name}` : ""} · ${label}`,
		actor: operator,
		role,
		reason: "Built from admin-held data; no merchant credentials or session used (R1.8, R3.8).",
	})
	emit()
}

/**
 * R3.9/R3.10 — a direct change to the store/merchant account by Super Admin:
 * requires a stated reason AND proven merchant consent, never a support case.
 */
export function directStoreChange(
	storeId: string,
	change: string,
	consentMethod: string,
	reason: string,
	operator: string,
	role: Role,
) {
	const cleanChange = cleanText(change, 3, 240)
	const cleanConsent = cleanText(consentMethod, 3, 240)
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const store = state.stores.find((s) => s.id === storeId)
	if (
		!can(role, "store.directchange") ||
		!store ||
		!cleanChange ||
		!cleanConsent ||
		!cleanReason ||
		!cleanOperator
	) return false
	state.stores = state.stores.map((s) =>
		s.id === storeId
			? {
					...s,
					directChanges: [
						...(s.directChanges ?? []),
						{
							at: nowLabel(),
							change: cleanChange,
							consent: cleanConsent,
							reason: cleanReason,
							by: cleanOperator,
						},
					],
				}
			: s,
	)
	appendAudit({
		action: "Direct change to store/merchant account",
		target: `${storeId} · ${store.name} · ${cleanChange}`,
		actor: cleanOperator,
		role,
		reason: `${cleanReason} · merchant consent: ${cleanConsent}`,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — recovery (R6.8–R6.12)
------------------------------------------------------------------------- */

export function provideEvidence(recoveryId: string, kind: string, operator: string, role: Role) {
	const cleanKind = cleanText(kind, 2, 240)
	const cleanOperator = cleanText(operator, 2, 120)
	const recovery = state.recovery.find((entry) => entry.id === recoveryId)
	const evidence = recovery?.evidence.find((entry) => entry.kind === cleanKind)
	if (
		!can(role, "recovery.intake") ||
		!recovery ||
		recovery.state !== "Awaiting approval" ||
		!evidence ||
		evidence.provided ||
		!cleanOperator
	) return false
	state.recovery = state.recovery.map((r) =>
		r.id === recoveryId
			? {
					...r,
					evidence: r.evidence.map((e) => (e.kind === cleanKind ? { ...e, provided: true } : e)),
				}
			: r,
	)
	appendAudit({ action: "Recovery evidence marked provided", target: `${recoveryId} · ${cleanKind}`, actor: cleanOperator, role })
	emit()
	return true
}

export function decideRecovery(
	recoveryId: string,
	decision: "Approved" | "Rejected",
	note: string | undefined,
	operator: string,
	role: Role,
) {
	const cleanNote = cleanText(note, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const recovery = state.recovery.find((entry) => entry.id === recoveryId)
	if (
		!can(role, "recovery.approve") ||
		!recovery ||
		recovery.state !== "Awaiting approval" ||
		!cleanNote ||
		!cleanOperator ||
		(decision === "Approved" && !recovery.evidence.some((entry) => entry.provided))
	) return false
	state.recovery = state.recovery.map((r) =>
		r.id === recoveryId
			? { ...r, state: decision, approver: cleanOperator, decidedAt: stamp(), note: cleanNote }
			: r,
	)
	if (decision === "Approved") {
		state.users = state.users.map((user) =>
			user.id === recovery.accountId ? { ...user, activeSessions: 0 } : user,
		)
	}
	appendAudit({
		action: decision === "Approved" ? "Exceptional recovery approved" : "Recovery rejected",
		target: recoveryId,
		actor: cleanOperator,
		role,
		reason: cleanNote,
	})
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — operational health (R7.6)
------------------------------------------------------------------------- */

export function retryProcess(processId: string, operator: string, role: Role) {
	state.processHealth = state.processHealth.map((p) =>
		p.id === processId
			? { ...p, state: "Healthy", failures24h: 0, lastRunAt: stamp(), detail: `${p.detail}\n\nRetry succeeded — process healthy again.` }
			: p,
	)
	appendAudit({ action: "Operational retry performed", target: processId, actor: operator, role })
	emit()
}

/* -------------------------------------------------------------------------
   Actions — admin accounts and sessions (R1.4, R1.12)
------------------------------------------------------------------------- */

export function inviteAdmin(name: string, email: string, role: Role, operator: string, operatorRole: Role) {
	const cleanName = cleanText(name, 2, 120)
	const cleanEmail = cleanText(email, 5, 254)?.toLocaleLowerCase()
	const cleanOperator = cleanText(operator, 2, 120)
	if (
		!can(operatorRole, "admin.manage") ||
		!cleanName ||
		!cleanEmail ||
		!/^\S+@\S+\.\S+$/.test(cleanEmail) ||
		!cleanOperator ||
		state.admins.some((admin) => admin.email.trim().toLocaleLowerCase() === cleanEmail)
	) return
	const maxSuffix = Math.max(
		0,
		...state.admins.map((admin) => {
			const match = /^ADM-(\d+)$/.exec(admin.id)
			return match ? Number(match[1]) : 0
		}),
	)
	const id = `ADM-${String(maxSuffix + 1).padStart(2, "0")}`
	state.admins = [
		...state.admins,
		{
			id,
			name: cleanName,
			email: cleanEmail,
			roles: [role],
			state: "Invited",
			lastActiveAt: stamp(),
			activeSessions: 0,
			twoFactor: false,
			addedAt: stamp(),
		},
	]
	appendAudit({ action: "Administrator invited", target: `${id} · ${cleanEmail} · ${role}`, actor: cleanOperator, role: operatorRole })
	emit()
	return id
}

export function setAdminRole(adminId: string, next: Role, operator: string, operatorRole: Role) {
	const admin = state.admins.find((entry) => entry.id === adminId)
	if (!can(operatorRole, "admin.manage") || !admin || admin.roles.includes(next)) return false
	state.admins = state.admins.map((a) => (a.id === adminId ? { ...a, roles: [next] } : a))
	appendAudit({ action: `Administrator role changed to ${next}`, target: adminId, actor: operator, role: operatorRole })
	emit()
	return true
}

export function disableAdmin(
	adminId: string,
	reason: string,
	operator: string,
	operatorEmail: string,
	operatorRole: Role,
) {
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const admin = state.admins.find((entry) => entry.id === adminId)
	if (
		!can(operatorRole, "admin.manage") ||
		!admin ||
		admin.state === "Disabled" ||
		admin.email.trim().toLocaleLowerCase() === operatorEmail.trim().toLocaleLowerCase() ||
		!cleanReason ||
		!cleanOperator
	) return false
	state.admins = state.admins.map((a) =>
		a.id === adminId ? { ...a, state: "Disabled", activeSessions: 0 } : a,
	)
	state.adminSessions = state.adminSessions.filter((s) => s.adminId !== adminId)
	appendAudit({ action: "Administrator access disabled", target: adminId, actor: cleanOperator, role: operatorRole, reason: cleanReason })
	emit()
	return true
}

export function enableAdmin(adminId: string, reason: string, operator: string, operatorRole: Role) {
	const cleanReason = cleanText(reason, 8)
	const cleanOperator = cleanText(operator, 2, 120)
	const admin = state.admins.find((entry) => entry.id === adminId)
	if (
		!can(operatorRole, "admin.manage") ||
		!admin ||
		admin.state !== "Disabled" ||
		!cleanReason ||
		!cleanOperator
	) return false
	state.admins = state.admins.map((a) => (a.id === adminId ? { ...a, state: "Active" } : a))
	appendAudit({ action: "Administrator access enabled", target: adminId, actor: cleanOperator, role: operatorRole, reason: cleanReason })
	emit()
	return true
}

export function revokeAdminSession(sessionId: string, operator: string, operatorRole: Role) {
	const cleanOperator = cleanText(operator, 2, 120)
	const session = state.adminSessions.find((entry) => entry.id === sessionId)
	if (!can(operatorRole, "admin.session.revoke") || !session || session.current || !cleanOperator) return false
	state.adminSessions = state.adminSessions.filter((s) => s.id !== sessionId)
	state.admins = state.admins.map((admin) =>
		admin.id === session.adminId
			? { ...admin, activeSessions: Math.max(0, admin.activeSessions - 1) }
			: admin,
	)
	appendAudit({ action: "Administrator session revoked", target: sessionId, actor: cleanOperator, role: operatorRole })
	emit()
	return true
}

/* -------------------------------------------------------------------------
   Actions — exports (R8.3–R8.5)
------------------------------------------------------------------------- */

export function runExport(label: string, operator: string, role: Role) {
	appendAudit({ action: "Data export produced", target: label, actor: operator, role })
	emit()
}

export { appendAudit }
