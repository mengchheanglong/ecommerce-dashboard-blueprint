"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { toast } from "sonner"

import { NOW } from "@/lib/format"
import type { Permission, Role } from "@/lib/permissions"
import { can } from "@/lib/permissions"

/**
 * Prototype session state.
 *
 * The operator is signed in with a fixed role — Super Admin, the fullest view.
 * In production an operator has one account with an assigned role (PRD R1.1,
 * R1.2) and cannot change it; reviewing the other role's experience requires
 * an account that actually holds it.
 */

export type AuditEntry = {
	id: string
	/** What was done, in operator language. */
	action: string
	/** The record acted on — human-readable, never a bare database id (R9.1). */
	target: string
	/** Why. Required for actions that collect a reason (R1.5, R9.2). */
	reason?: string
	actor: string
	role: Role
	at: string
}

type SessionValue = {
	role: Role
	operator: { name: string; email: string }
	allowed: (permission: Permission) => boolean
	/**
	 * Session-local audit trail. Real audit history is append-only and cannot be
	 * rewritten or erased by ordinary administrators (R1.6); this in-memory copy
	 * only demonstrates what gets captured.
	 */
	audit: AuditEntry[]
	record: (entry: Omit<AuditEntry, "id" | "actor" | "role" | "at">) => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [audit, setAudit] = useState<AuditEntry[]>([])

	const role = "Super Admin" as Role

	const operator = useMemo(
		() => ({ name: "Sophea Chan", email: "sophea.chan@angkoro.com" }),
		[],
	)

	const record = useCallback<SessionValue["record"]>(
		(entry) => {
			setAudit((current) => [
				{
					...entry,
					id: `AUD-${String(current.length + 1).padStart(4, "0")}`,
					actor: operator.name,
					role,
					at: NOW.toISOString(),
				},
				...current,
			])
		},
		[operator.name, role],
	)

	const allowed = useCallback((permission: Permission) => can(role, permission), [role])

	const value = useMemo(
		() => ({ role, operator, allowed, audit, record }),
		[role, operator, allowed, audit, record],
	)

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
	const value = useContext(SessionContext)
	if (!value) throw new Error("useSession must be used inside <SessionProvider>")
	return value
}

/** Toast helper so every page reports outcomes the same way. */
export const notify = {
	done: (title: string, description?: string) => toast.success(title, { description }),
	failed: (title: string, description?: string) => toast.error(title, { description }),
	info: (title: string, description?: string) => toast(title, { description }),
	recorded: (title: string, description?: string) =>
		toast.success(title, { description: description ?? "Recorded in the audit history." }),
}
