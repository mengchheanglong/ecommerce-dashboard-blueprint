"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"

import { ago, longDate } from "@/lib/format"
import { PERMISSIONS, ROLES, ROLE_SUMMARY, type Permission, type Role } from "@/lib/permissions"
import { useMockState, disableAdmin, enableAdmin, inviteAdmin } from "@/lib/mock-store"
import { PageHeader, SectionHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { Panel } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ADMINS, type AdminAccount } from "@/data/seed"

/**
 * Admin Accounts — P0, PRD v5.3 R1.1–R1.4, R1.7, R1.12.
 *
 * P0 because everything else depends on it: without individual accounts and
 * enforced role boundaries, no other feature's audit trail means anything.
 *
 * The role matrix at the bottom is not decoration. R1.3 requires role limits to
 * protect the action rather than merely hide the control, and staff can only
 * work with a permission system they can see. It also marks which mappings are
 * still proposed rather than approved.
 */
export default function AdminAccountsPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const [disabling, setDisabling] = useState<AdminAccount | null>(null)
	const [enabling, setEnabling] = useState<AdminAccount | null>(null)
	const [inviting, setInviting] = useState(false)
	const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "Admin" as Role })

	if (!allowed("admin.manage")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Admin Accounts" />
				<PermissionWall permission="admin.manage" title="Admin Accounts" />
			</div>
		)
	}

	const inviteValid =
		inviteForm.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(inviteForm.email.trim())

	function invite() {
		if (!inviteValid) return
		const id = inviteAdmin(
			inviteForm.name.trim(),
			inviteForm.email.trim(),
			inviteForm.role,
			operator.name,
			role,
		)
		if (id) {
			notify.recorded("Invitation sent", `${inviteForm.name} · ${inviteForm.role}`)
			setInviting(false)
			setInviteForm({ name: "", email: "", role: "Admin" })
		}
	}

	const columns: Column<AdminAccount>[] = [
		{
			key: "name",
			header: "Administrator",
			sortValue: (row) => row.name,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.name}</p>
					<p className="text-xs text-muted-foreground">{row.email}</p>
				</div>
			),
		},
		{
			key: "roles",
			header: "Roles",
			cell: (row) => (
				<div className="flex flex-wrap gap-1">
					{row.roles.map((role) => (
						<Badge key={role} variant="secondary" className="text-[11px]">
							{role}
						</Badge>
					))}
				</div>
			),
		},
		{
			key: "state",
			header: "State",
			sortValue: (row) => row.state,
			cell: (row) => <StatusBadge status={row.state} />,
		},
		{
			key: "twoFactor",
			header: "2FA",
			hideBelow: "lg",
			cell: (row) =>
				row.twoFactor ? (
					<StatusBadge status="On" tone="good" />
				) : (
					<StatusBadge status="Off" tone="warn" />
				),
		},
		{
			key: "sessions",
			header: "Sessions",
			align: "right",
			hideBelow: "md",
			sortValue: (row) => row.activeSessions,
			cell: (row) => <span className="text-sm">{row.activeSessions}</span>,
		},
		{
			key: "active",
			header: "Last active",
			align: "right",
			hideBelow: "sm",
			sortValue: (row) => new Date(row.lastActiveAt).getTime(),
			cell: (row) => (
				<span className="text-sm text-muted-foreground">{ago(row.lastActiveAt)}</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "7rem",
			cell: (row) => {
				if (row.email === operator.email) {
					return <span className="text-xs text-muted-foreground">You</span>
				}
				if (row.state === "Disabled") {
					return (
						<PermissionGate permission="admin.manage">
							<Button
								variant="outline"
								size="sm"
								onClick={(event) => {
									event.stopPropagation()
									setEnabling(row)
								}}
							>
								Enable
							</Button>
						</PermissionGate>
					)
				}
				return (
					<PermissionGate permission="admin.manage">
						<Button
							variant="ghost"
							size="sm"
							onClick={(event) => {
								event.stopPropagation()
								setDisabling(row)
							}}
						>
							Disable
						</Button>
					</PermissionGate>
				)
			},
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Admin Accounts"
				description="Individual administrator accounts with the Admin or Super Admin role, and the state of internal access."
				actions={
					<PermissionGate permission="admin.manage">
						<Button onClick={() => setInviting(true)}>
							<UserPlus />
							Invite administrator
						</Button>
					</PermissionGate>
				}
			/>

			<Callout tone="info">
				Every internal operator uses an individual account — shared logins make the audit
				history meaningless (R1.1). V1 uses the two fixed roles below, Admin and Super
				Admin; custom administrator-role creation is out of scope (R1.7).
			</Callout>

			<DataTable
				rows={mock.admins}
				columns={columns}
				searchIn={(row) => `${row.name} ${row.email} ${row.roles.join(" ")} ${row.state}`}
				searchPlaceholder="Search administrators"
				initialSort={{ key: "active", direction: "desc" }}
				empty={{ title: "No administrators match" }}
			/>

			<div className="space-y-4">
				<SectionHeader
					title="The two fixed V1 roles"
					description="Admin and Super Admin — access levels, not headcount. Multiple staff may hold either."
				/>
				<div className="grid gap-3 sm:grid-cols-2">
					{ROLES.map((role) => (
						<Panel key={role} title={role}>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{ROLE_SUMMARY[role]}
							</p>
							<p className="tnum mt-3 text-xs text-muted-foreground">
								{
									mock.admins.filter(
										(a) => a.roles.includes(role) && a.state === "Active",
									).length
								}{" "}
								active administrator
								{mock.admins.filter(
									(a) => a.roles.includes(role) && a.state === "Active",
								).length === 1
									? ""
									: "s"}
							</p>
						</Panel>
					))}
				</div>
			</div>

			<Panel
				title="Permission matrix"
				description="Which role may perform each sensitive action, and whether that mapping is approved."
				contentClassName="p-0"
			>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border text-left">
								<th className="px-4 py-2.5 font-semibold">Action</th>
								<th className="px-4 py-2.5 font-semibold">Permitted roles</th>
								<th className="px-4 py-2.5 font-semibold">Basis</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{(Object.keys(PERMISSIONS) as Permission[])
								.filter((key) => PERMISSIONS[key].roles.length < 4)
								.map((key) => {
									const rule = PERMISSIONS[key]
									return (
										<tr key={key}>
											<td className="px-4 py-2.5 font-mono text-xs">{key}</td>
											<td className="px-4 py-2.5">
												<div className="flex flex-wrap gap-1">
													{rule.roles.map((role) => (
														<Badge
															key={role}
															variant="secondary"
															className="text-[11px]"
														>
															{role}
														</Badge>
													))}
												</div>
											</td>
											<td className="px-4 py-2.5">
												<div className="space-y-1">
													<Badge
														variant={
															rule.status === "confirmed" ? "success" : "warning"
														}
														className="text-[11px]"
													>
														{rule.status === "confirmed"
															? "Approved"
															: "Proposed"}
													</Badge>
													<p className="text-xs text-muted-foreground">
														{rule.source}
													</p>
												</div>
											</td>
										</tr>
									)
								})}
						</tbody>
					</table>
				</div>
			</Panel>

			<OpenQuestion source="§3.1 Action-risk rules">
				For each sensitive action the owning role, risk level, whether stronger
				authentication or an additional approval is required, and whether the affected user
				is notified, have not been approved. Rows marked <strong>Proposed</strong> above are
				a working baseline, not a decision.
			</OpenQuestion>

			<ConfirmAction
				open={disabling !== null}
				onOpenChange={(open) => !open && setDisabling(null)}
				title="Disable administrator access"
				summary="Remove this person's access to the Angkoro admin system."
				target={disabling ? `${disabling.id} · ${disabling.name}` : ""}
				effects={[
					"The administrator can no longer sign in.",
					"Their active sessions end immediately.",
					"The action, reason, and your name enter the protected audit history.",
				]}
				doesNotAffect={[
					"Their past actions in the audit history, which remain attributed to them and cannot be erased (R1.6).",
					"Any other administrator account (R1.12).",
					"Cases or records they own — reassign these separately.",
				]}
				confirmLabel="Disable access"
				tone="danger"
				onConfirm={(reason) => {
					if (!disabling) return
					const ok = disableAdmin(disabling.id, reason, operator.name, operator.email, role)
					if (ok) {
						notify.recorded("Administrator access disabled", `${disabling.name} · sessions ended.`)
					}
					return ok
				}}
			/>

			<ConfirmAction
				open={enabling !== null}
				onOpenChange={(open) => !open && setEnabling(null)}
				title="Enable administrator access"
				summary="Restore this person's access to the Angkoro admin system."
				target={enabling ? `${enabling.id} · ${enabling.name}` : ""}
				effects={[
					"The administrator can sign in again with their existing role.",
					"The action, reason, and your name enter the protected audit history.",
				]}
				doesNotAffect={[
					"Their role, which is unchanged.",
					"Their past actions in the audit history, which remain attributed to them (R1.6).",
				]}
				confirmLabel="Enable access"
				tone="caution"
				onConfirm={(reason) => {
					if (!enabling) return false
					const ok = enableAdmin(enabling.id, reason, operator.name, role)
					if (ok) {
						notify.recorded("Administrator access enabled", enabling.name)
					}
					return ok
				}}
			/>

			<Dialog open={inviting} onOpenChange={setInviting}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Invite an administrator</DialogTitle>
						<DialogDescription>
							An invitation email is sent. The account stays in Invited state until the
							person accepts and signs in for the first time (R1.1).
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="inv-name">
								Name <span className="text-destructive">*</span>
							</Label>
							<Input
								id="inv-name"
								value={inviteForm.name}
								onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
								placeholder="Full name"
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="inv-email">
								Work email <span className="text-destructive">*</span>
							</Label>
							<Input
								id="inv-email"
								type="email"
								value={inviteForm.email}
								onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
								placeholder="name@angkoro.com"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Role</Label>
							<Select
								value={inviteForm.role}
								onValueChange={(v) => setInviteForm({ ...inviteForm, role: v as Role })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ROLES.map((r) => (
										<SelectItem key={r} value={r}>
											{r}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setInviting(false)}>
							Cancel
						</Button>
						<Button disabled={!inviteValid} onClick={invite}>
							Send invitation
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
