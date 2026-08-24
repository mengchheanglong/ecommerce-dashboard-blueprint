"use client"

import { useState } from "react"
import { Lock, LogOut } from "lucide-react"

import { ago, dateTime } from "@/lib/format"
import { ROLE_SHORT } from "@/lib/permissions"
import { PageHeader } from "@/components/app/page-header"
import { Panel } from "@/components/app/record"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ADMIN_SESSIONS, ADMINS, AUDIT } from "@/data/seed"
import { useMockState, revokeAdminSession } from "@/lib/mock-store"

/**
 * Admin Security and Activity — P0, PRD R1.5, R1.6.
 *
 * The audit history is **append-only**. There is deliberately no edit control,
 * no delete control, and no bulk clear anywhere on this page: R1.6 states that
 * ordinary administrators cannot rewrite or erase protected audit history, and
 * an interface that offers the button undermines the guarantee even if the
 * server refuses.
 *
 * Entries recorded during this session appear at the top, so a reviewer can
 * watch the audit trail fill as they exercise other screens.
 */
export default function SecurityPage() {
	const { audit, role, operator } = useSession()
	const mock = useMockState()
	const [revoking, setRevoking] = useState<(typeof mock.adminSessions)[number] | null>(null)

	const combined = [
		...mock.audit.map((entry) => ({
			id: entry.id,
			action: entry.action,
			target: entry.target,
			actor: entry.actor,
			role: entry.role,
			at: entry.at,
			reason: entry.reason,
			// Only entries appended during this browser session carry the mock
			// store's AUD-NEW- id prefix; seeded history must not be labelled as
			// this session.
			thisSession: entry.id.startsWith("AUD-NEW-"),
		})),
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Admin Security and Activity"
				description="Active administrator sessions and the protected history of sensitive actions — who acted, what changed, when, and why."
			/>

			<StatGrid columns={3}>
				<StatCard
					label="Active admin sessions"
					value={String(mock.adminSessions.length)}
					definition="Signed-in administrator sessions across all devices"
				/>
				<StatCard
					label="Administrators with 2FA"
					value={`${mock.admins.filter((a) => a.twoFactor).length} of ${mock.admins.length}`}
					definition="Accounts with two-factor authentication enabled"
					tone={mock.admins.some((a) => !a.twoFactor && a.state === "Active") ? "warn" : "neutral"}
				/>
				<StatCard
					label="Recorded sensitive actions"
					value={String(combined.length)}
					definition="Audit entries visible in this view"
				/>
			</StatGrid>

			<Panel
				title="Active administrator sessions"
				description="Revoking a session signs that administrator out of that device."
				contentClassName="p-0"
			>
				<ul className="divide-y divide-border">
					{mock.adminSessions.map((session) => (
						<li
							key={session.id}
							className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
						>
							<div className="min-w-0 space-y-0.5">
								<div className="flex flex-wrap items-center gap-2">
									<p className="text-sm font-medium">{session.adminName}</p>
									{session.current && (
										<Badge variant="success" className="text-[11px]">
											This session
										</Badge>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									{session.device} · {session.location}
								</p>
								<p className="text-xs text-muted-foreground">
									Started {dateTime(session.startedAt)} · last seen{" "}
									{ago(session.lastSeenAt)}
								</p>
							</div>

							{!session.current && (
								<PermissionGate permission="admin.session.revoke">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setRevoking(session)}
									>
										<LogOut />
										Revoke
									</Button>
								</PermissionGate>
							)}
						</li>
					))}
				</ul>
			</Panel>

			<Panel
				title="Audit history"
				description="Append-only. Ordinary administrators cannot edit or erase these entries (R1.6)."
				actions={
					<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
						<Lock className="size-3.5" />
						Protected
					</span>
				}
				contentClassName="p-0"
			>
				<ul className="divide-y divide-border">
					{combined.map((entry) => (
						<li key={entry.id} className="px-4 py-3">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0 flex-1 space-y-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="text-sm font-semibold">{entry.action}</p>
										{entry.thisSession && (
											<Badge variant="info" className="text-[11px]">
												This session
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">{entry.target}</p>
									{entry.reason && (
										<p className="rounded-md border-l-2 border-border bg-secondary/60 px-2.5 py-1.5 text-sm">
											<span className="font-semibold">Reason: </span>
											{entry.reason}
										</p>
									)}
								</div>

								<div className="shrink-0 space-y-0.5 text-right">
									<p className="text-xs font-medium">{entry.actor}</p>
									<p className="text-xs text-muted-foreground">
										{ROLE_SHORT[entry.role]}
									</p>
									<p className="text-xs text-muted-foreground">
										{dateTime(entry.at)}
									</p>
									<p className="font-mono text-[11px] text-muted-foreground/70">
										{entry.id}
									</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</Panel>

			<Callout tone="info" title="What is never shown here">
				Passwords, tokens, private keys, connection strings, and raw provider secrets are
				never displayed anywhere in the admin system (R9.3). Audit entries record that an
				action happened and why — never the credential involved.
			</Callout>

			<OpenQuestion source="§4.1–4.2 Retention rules">
				How long audit, session, support, and personal records are kept before deletion or
				anonymisation — and which categories are exempt because of an active case or a
				financial obligation — has not been approved. This view shows everything retained.
			</OpenQuestion>

			<ConfirmAction
				open={revoking !== null}
				onOpenChange={(open) => !open && setRevoking(null)}
				title="Revoke administrator session"
				summary="End this signed-in session immediately."
				target={revoking ? `${revoking.id} · ${revoking.adminName} · ${revoking.device}` : ""}
				effects={[
					"That device is signed out immediately.",
					"The administrator must sign in again to continue working.",
					"The revocation is recorded with your name and reason.",
				]}
				doesNotAffect={[
					"Their account, which stays enabled.",
					"Their other sessions on other devices.",
				]}
				confirmLabel="Revoke session"
				tone="caution"
				onConfirm={(reason) => {
					if (revoking) revokeAdminSession(revoking.id, operator.name, role)
					notify.recorded("Session revoked", revoking ? revoking.adminName : undefined)
				}}
			/>
		</div>
	)
}
