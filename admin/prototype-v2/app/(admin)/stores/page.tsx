"use client"

import { ago, money } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { STORES, type Store } from "@/data/seed"

/** Stores — P1, PRD R3.1–R3.8. */
export default function StoresPage() {
	const columns: Column<Store>[] = [
		{
			key: "name",
			header: "Store",
			sortValue: (row) => row.name,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.name}</p>
					<p className="font-mono text-xs text-muted-foreground">
						{row.id} · {row.subdomain}
					</p>
				</div>
			),
		},
		{
			key: "owner",
			header: "Owner",
			hideBelow: "md",
			sortValue: (row) => row.owner,
			cell: (row) => <span className="text-sm">{row.owner}</span>,
		},
		{
			key: "status",
			header: "Status",
			sortValue: (row) => row.status,
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "plan",
			header: "Plan",
			hideBelow: "lg",
			sortValue: (row) => row.plan,
			cell: (row) => (
				<div className="space-y-1">
					<span className="text-sm">{row.plan}</span>
					{row.planState !== "Active" && <StatusBadge status={row.planState} />}
				</div>
			),
		},
		{
			key: "volume",
			header: "Paid volume",
			align: "right",
			hideBelow: "xl",
			sortValue: (row) => row.paidVolume,
			cell: (row) =>
				row.paidVolume > 0 ? (
					<span className="text-sm">{money(row.paidVolume, row.currency)}</span>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				),
		},
		{
			key: "cases",
			header: "Open cases",
			align: "right",
			hideBelow: "lg",
			sortValue: (row) => row.openCases,
			cell: (row) =>
				row.openCases > 0 ? (
					<span className="text-sm font-semibold">{row.openCases}</span>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				),
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
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Stores"
				description="Find and open any store you are permitted to manage, and understand its ownership, access, plan, onboarding, restriction, and finance state."
			/>

			<Callout tone="info">
				Merchants own and operate their stores. Angkoro restricts a store only when it has
				an approved platform reason — not to settle an ordinary buyer–merchant
				disagreement (R3.4).
			</Callout>

			<DataTable
				rows={STORES}
				columns={columns}
				hrefFor={(row) => `/stores/${row.id}`}
				searchIn={(row) => `${row.id} ${row.name} ${row.subdomain} ${row.owner} ${row.status}`}
				searchPlaceholder="Search by store name, subdomain, or owner"
				initialSort={{ key: "active", direction: "desc" }}
				filters={[
					{
						key: "status",
						label: "Filter status",
						options: [
							{ value: "active", label: "Active", match: (r) => r.status === "Active" },
							{
								value: "onboarding",
								label: "Onboarding",
								match: (r) => r.status === "Onboarding",
							},
							{
								value: "restricted",
								label: "Restricted",
								match: (r) => r.status === "Suspended" || r.status === "Restricted",
							},
						],
					},
					{
						key: "plan",
						label: "Filter billing",
						options: [
							{
								value: "attention",
								label: "Billing attention",
								match: (r) => r.planState !== "Active",
							},
						],
					},
				]}
				empty={{ title: "No stores match" }}
			/>
		</div>
	)
}
