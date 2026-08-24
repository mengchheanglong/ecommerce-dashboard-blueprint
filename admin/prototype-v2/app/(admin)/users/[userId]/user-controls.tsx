"use client"

import { useState } from "react"
import { Ban, LogOut, ShieldOff, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { StatusBadge } from "@/components/app/status-badge"
import { notify, useSession } from "@/components/app/session-provider"
import { revokeUserSessions, setUserStatus } from "@/lib/mock-store"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { UserAccess, UserKind } from "@/data/seed"

/** User access controls — PRD v5.3 §2, R3.5, R3.6, R3.9, R3.10. Super Admin only. Wired to the mock store. */
export function UserControls({
	userId,
	userName,
	access,
	activeSessions,
}: {
	userId: string
	userName: string
	access: UserAccess[]
	activeSessions: number
}) {
	const [selectedKind, setSelectedKind] = useState<UserKind>(access[0]?.kind ?? "Shopper")
	const [restricting, setRestricting] = useState(false)
	const [banning, setBanning] = useState(false)
	const [restoring, setRestoring] = useState(false)
	const [revoking, setRevoking] = useState(false)

	const { role, operator } = useSession()
	const target = `${userId} · ${userName}`
	const selected = access.find((entry) => entry.kind === selectedKind) ?? access[0]
	const selectedStatus = selected?.status ?? "Active"
	const restricted = selectedStatus !== "Active"

	function applyStatus(status: "Active" | "Restricted" | "Banned", reason: string) {
		setUserStatus(userId, selected?.kind ?? "Shopper", status, reason, operator.name, role)
	}

	return (
		<>
			{access.length > 1 && (
				<Select value={selectedKind} onValueChange={(value) => setSelectedKind(value as UserKind)}>
					<SelectTrigger className="w-[11rem]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{access.map((entry) => (
							<SelectItem key={entry.kind} value={entry.kind}>
								{entry.kind} access
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}

			{selected && <StatusBadge status={selectedStatus} />}

			<PermissionGate permission="user.restrict">
				<Button
					variant="outline"
					disabled={activeSessions === 0}
					onClick={() => setRevoking(true)}
				>
					<LogOut />
					Revoke sessions
					{activeSessions > 0 && (
						<span className="tnum ml-0.5 text-xs opacity-70">({activeSessions})</span>
					)}
				</Button>
			</PermissionGate>

			{restricted ? (
				<PermissionGate permission="user.restrict">
					<Button variant="outline" onClick={() => setRestoring(true)}>
						<ShieldCheck />
						Restore access
					</Button>
				</PermissionGate>
			) : (
				<>
					<PermissionGate permission="user.restrict">
						<Button variant="destructive-outline" onClick={() => setRestricting(true)}>
							<ShieldOff />
							Restrict access
						</Button>
					</PermissionGate>
					<PermissionGate permission="user.restrict">
						<Button variant="destructive" onClick={() => setBanning(true)}>
							<Ban />
							Ban access
						</Button>
					</PermissionGate>
				</>
			)}

			<ConfirmAction
				open={revoking}
				onOpenChange={setRevoking}
				title="Revoke user sessions"
				summary="Sign this user out of every device they are currently signed in on."
				target={target}
				effects={[
					`All ${activeSessions} active session${activeSessions === 1 ? "" : "s"} end immediately.`,
					"The user must sign in again to regain access.",
					"The revocation is recorded with your name.",
				]}
				doesNotAffect={[
					"The account's status — it stays as it is and the user can sign in again.",
					"Connected stores, which continue operating normally (R3.10).",
				]}
				confirmLabel="Revoke sessions"
				tone="caution"
				onConfirm={() => {
					revokeUserSessions(userId, operator.name, role)
					notify.recorded("User sessions revoked", target)
				}}
			/>

			<ConfirmAction
				open={restricting}
				onOpenChange={setRestricting}
				title="Restrict user access"
				summary="Block this account's Angkoro access for an approved platform reason."
				target={target}
				effects={[
					"This account can no longer sign in to Angkoro.",
					"Active sessions are ended.",
					"The restriction, reason, and your name enter the protected audit history.",
				]}
				doesNotAffect={[
					"Connected stores — suspending a store is a separate authorised action (R3.10).",
					"Orders already placed, which remain the store's to fulfil.",
					"Any payout Angkoro already owes for completed commerce.",
				]}
				confirmLabel="Restrict access"
				tone="danger"
				onConfirm={(reason) => {
					applyStatus("Restricted", reason)
					notify.recorded("User access restricted", target)
				}}
			/>

			<ConfirmAction
				open={banning}
				onOpenChange={setBanning}
				title="Ban user access"
				summary="Permanently block this access type on the account after review."
				target={target}
				effects={[
					"This access type can no longer sign in to Angkoro.",
					"Active sessions are ended.",
					"The ban, reason, and your name enter the protected audit history.",
				]}
				doesNotAffect={[
					"Other access types on the same account — each is decided separately (R3.10).",
					"Connected stores, which continue operating normally (R3.10).",
				]}
				confirmLabel="Ban access"
				tone="danger"
				onConfirm={(reason) => {
					applyStatus("Banned", reason)
					notify.recorded("User access banned", target)
				}}
			/>

			<ConfirmAction
				open={restoring}
				onOpenChange={setRestoring}
				title="Restore user access"
				summary="Return normal Angkoro access to this account."
				target={target}
				effects={[
					"The account can sign in again.",
					"The restoration and its reason are recorded.",
				]}
				doesNotAffect={["Past audit history, which cannot be erased (R1.6)."]}
				confirmLabel="Restore access"
				tone="caution"
				onConfirm={(reason) => {
					applyStatus("Active", reason)
					notify.recorded("User access restored", target)
				}}
			/>
		</>
	)
}
