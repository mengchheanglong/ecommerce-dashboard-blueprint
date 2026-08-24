"use client"

import { ago, maskEmail, maskPhone } from "@/lib/format"
import { useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { PermissionWall } from "@/components/app/permission-gate"
import { useSession } from "@/components/app/session-provider"
import type { UserAccount } from "@/data/seed"

/**
 * Users — P1, PRD v5.3 §2 (Users), R3.1–R3.6.
 *
 * The centralized external-account feature. One person may hold several
 * account kinds at once — shopper, merchant, store owner, store staff (R3.3).
 * Admin views and manages normal account information; restricting shopper or
 * merchant access and revoking sessions is Super Admin only (§2, R3.5, R3.6).
 * Live from the mock store.
 */
export default function UsersPage() {
	const { allowed, role } = useSession()
	const mock = useMockState()
	const users = mock.users

	if (!allowed("user.view")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Users" />
				<PermissionWall permission="user.view" title="Users" />
			</div>
		)
	}

	// R9.4 — personal contact detail is limited to roles whose work needs it.
	const seesContact = role === "Super Admin"

	const columns: Column<UserAccount>[] = [
		{
			key: "name",
			header: "User",
			sortValue: (row) => row.name,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.name}</p>
					<p className="font-mono text-xs text-muted-foreground">{row.id}</p>
				</div>
			),
		},
		{
			key: "kinds",
			header: "Account types",
			cell: (row) => <span className="text-sm">{row.kinds.join(", ")}</span>,
		},
		{
			key: "contact",
			header: "Contact",
			hideBelow: "lg",
			cell: (row) => (
				<div className="space-y-0.5 text-xs text-muted-foreground">
					<p>{seesContact ? row.email : maskEmail(row.email)}</p>
					{seesContact && <p>{maskPhone(row.phone)}</p>}
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			sortValue: (row) => row.status,
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "stores",
			header: "Stores",
			align: "right",
			sortValue: (row) => row.storeIds.length,
			cell: (row) => <span className="text-sm">{row.storeIds.length}</span>,
		},
		{
			key: "sessions",
			header: "Sessions",
			align: "right",
			hideBelow: "md",
			sortValue: (row) => row.activeSessions,
			cell: (row) => (
				<span className={`text-sm ${row.activeSessions === 0 ? "text-muted-foreground" : ""}`}>
					{row.activeSessions}
				</span>
			),
		},
		{
			key: "lastSignIn",
			header: "Last sign-in",
			align: "right",
			hideBelow: "sm",
			sortValue: (row) => new Date(row.lastSignInAt).getTime(),
			cell: (row) => (
				<span className="text-sm text-muted-foreground">{ago(row.lastSignInAt)}</span>
			),
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Users"
				description="Centralized management of Angkoro external-user accounts — shoppers, merchants, store owners, and store staff."
			/>

			<Callout tone="info">
				Restricting one access type never cascades to another (R3.10). Restricting a
				user&rsquo;s shopper access does not touch their merchant access or their stores.
				Status changes belong to Super Admin and are always reasoned and audited.
			</Callout>

			<DataTable
				rows={users}
				columns={columns}
				hrefFor={(row) => `/users/${row.id}`}
				searchIn={(row) => `${row.id} ${row.name} ${row.email} ${row.phone} ${row.kinds.join(" ")} ${row.status}`}
				searchPlaceholder="Search by name, email, phone, or account id"
				initialSort={{ key: "lastSignIn", direction: "desc" }}
				filters={[
					{
						key: "kind",
						label: "Account type",
						// Every distinct account kind present in the seed data.
						options: [...new Set<string>(users.flatMap((u) => u.kinds))].map((kind) => ({
							value: kind,
							label: kind,
							match: (row: UserAccount) => row.kinds.includes(kind as UserAccount["kinds"][number]),
						})),
					},
				]}
			/>
		</div>
	)
}
