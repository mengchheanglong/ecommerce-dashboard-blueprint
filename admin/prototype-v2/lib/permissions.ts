/**
 * Role and permission model.
 *
 * Two fixed roles are set by PRD v5.3 §2 and R1.7 — custom role creation is
 * out of scope for V1:
 *
 *   **Admin**       normal daily operations (PRD §2 Admin list)
 *   **Super Admin** all Admin access, plus the restricted actions in PRD §2
 *
 * IMPORTANT — the mapping below is a *proposed baseline*, not an approved rule.
 * Internal Detail Register §3.1 (action-risk rules) and §3.2 (restriction rules)
 * are still marked "Needs definition": the approval requirement and notice
 * behaviour for each sensitive action have not been signed off. This file exists
 * so the prototype can demonstrate permission-shaped behaviour, and every entry
 * carries `status` so the interface can say which rules are still open instead
 * of presenting a guess as settled.
 */

export type Role = "Super Admin" | "Admin"

export const ROLES: Role[] = ["Super Admin", "Admin"]

/** PRD v5.3 §2. */
export const ROLE_SUMMARY: Record<Role, string> = {
	"Super Admin":
		"All Admin access, plus administrator accounts, payout execution and destination review, store suspension/restore, direct store changes with merchant consent, user restriction and session revocation, exceptional recovery, and plan management",
	Admin: "Normal daily operations — support cases, users and stores (including the merchant-facing view), order issues, customer payments, billing, operational health, analytics, global search, audit review, recovery intake, and feature exports",
}

export const ROLE_SHORT: Record<Role, string> = {
	"Super Admin": "Super Admin",
	Admin: "Admin",
}

/* -------------------------------------------------------------------------
   Permissions
------------------------------------------------------------------------- */

export type Permission =
	| "admin.manage"
	| "admin.session.revoke"
	| "audit.view"
	| "case.manage"
	| "user.view"
	| "user.restrict"
	| "store.view"
	| "store.restrict"
	| "billing.investigate"
	| "payment.investigate"
	| "payment.correct"
	| "orderissue.correct"
	| "settlement.view"
	| "settlement.record"
	| "settlement.account.review"
	| "plan.view"
	| "plan.manage"
	| "store.merchantview"
	| "store.directchange"
	| "recovery.intake"
	| "recovery.approve"
	| "health.view"
	| "health.retry"
	| "analytics.view"
	| "export.run"

type Rule = {
	/** Roles permitted to perform the action. */
	roles: Role[]
	/** Short sentence shown when a control is disabled for the current role. */
	because: string
	/**
	 * Whether this mapping is settled.
	 * - `confirmed`  — stated directly in the PRD.
	 * - `proposed`   — a reasonable baseline; Register §3.1/§3.2 still open.
	 */
	status: "confirmed" | "proposed"
	/** PRD or Register clause this rule derives from. */
	source: string
}

const ALL: Role[] = ["Super Admin", "Admin"]

export const PERMISSIONS: Record<Permission, Rule> = {
	"admin.manage": {
		roles: ["Super Admin"],
		because: "Only Super Admin can manage administrator accounts.",
		status: "confirmed",
		source: "PRD §2 · R1.4",
	},
	"admin.session.revoke": {
		roles: ["Super Admin"],
		because: "Only Super Admin can revoke an active administrator session.",
		status: "confirmed",
		source: "PRD §2 · R1.4",
	},
	"audit.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD R1.5, R1.6",
	},
	"case.manage": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R2.4",
	},
	"user.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R3.1–R3.3",
	},
	"user.restrict": {
		roles: ["Super Admin"],
		because: "Restricting shopper or merchant access and revoking sessions is Super Admin only.",
		status: "confirmed",
		source: "PRD §2 · R3.5, R3.6",
	},
	"store.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R3.7",
	},
	"store.restrict": {
		roles: ["Super Admin"],
		because: "Suspending or restoring a store is Super Admin only.",
		status: "confirmed",
		source: "PRD §2 · R3.8",
	},
	"billing.investigate": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R5.2",
	},
	"payment.investigate": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R4.8",
	},
	"payment.correct": {
		roles: ALL,
		because: "Approved matching/correction actions stay within the operator's permission.",
		status: "proposed",
		source: "PRD R4.9 · action-risk detail still open in Register §3.1",
	},
	"orderissue.correct": {
		roles: ALL,
		because: "Approved order-issue investigation and correction actions stay within the operator's permission.",
		status: "proposed",
		source: "PRD R4.7 · action-risk detail still open in Register §3.1",
	},
	"settlement.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R5.4",
	},
	"settlement.record": {
		roles: ["Super Admin"],
		because: "Merchant payouts are executed by Super Admin manually during the pilot.",
		status: "confirmed",
		source: "PRD §2 · R5.5, R5.6",
	},
	"settlement.account.review": {
		roles: ["Super Admin"],
		because: "Payout-destination accounts are managed by Super Admin.",
		status: "confirmed",
		source: "PRD §2 · R5.7",
	},
	"plan.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R5.10",
	},
	"plan.manage": {
		roles: ["Super Admin"],
		because: "Plans, prices, features, and limits are managed by Super Admin; Admin is view-only.",
		status: "confirmed",
		source: "PRD §2 · R5.10–R5.16",
	},
	"store.merchantview": {
		roles: ALL,
		because: "Admin can view any store, including the merchant-facing view built from admin-held data.",
		status: "confirmed",
		source: "PRD §2 Stores · R3.8",
	},
	"store.directchange": {
		roles: ["Super Admin"],
		because: "Direct changes to a store/merchant account require Super Admin plus stated reason and merchant consent.",
		status: "confirmed",
		source: "PRD §2 Stores · R3.9, R3.10",
	},
	"recovery.intake": {
		roles: ALL,
		because: "Admin prepares and verifies recovery cases.",
		status: "confirmed",
		source: "PRD §2 · R6.8",
	},
	"recovery.approve": {
		roles: ["Super Admin"],
		because: "Exceptional recovery is performed by Super Admin.",
		status: "confirmed",
		source: "PRD §2 · R6.9",
	},
	"health.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R7.1, R7.2",
	},
	"health.retry": {
		roles: ALL,
		because: "Retry is available only where it is approved and safe for the process.",
		status: "proposed",
		source: "PRD R7.6 · safe-retry register still open in Register §5",
	},
	"analytics.view": {
		roles: ALL,
		because: "",
		status: "confirmed",
		source: "PRD §2 · R8.1",
	},
	"export.run": {
		roles: ALL,
		because: "Exports follow each feature's own permissions and are audited.",
		status: "confirmed",
		source: "PRD §2 Exports · R8.3–R8.5",
	},
}

export function can(role: Role, permission: Permission): boolean {
	return PERMISSIONS[permission].roles.includes(role)
}

/**
 * Why a control is unavailable. PRD R1.3 requires the restriction to protect the
 * action itself rather than only hiding the control — and an operator who cannot
 * see that an action exists cannot learn who to ask. So the interface disables
 * and explains rather than hiding.
 */
export function denialReason(permission: Permission): string {
	const rule = PERMISSIONS[permission]
	const owners = rule.roles.map((r) => ROLE_SHORT[r]).join(" or ")
	return rule.because || `${owners} role required.`
}

export function permissionRule(permission: Permission): Rule {
	return PERMISSIONS[permission]
}
