"use client"

import { ago, maskAccount, money } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { PermissionWall } from "@/components/app/permission-gate"
import { useSession } from "@/components/app/session-provider"
import { useMockState } from "@/lib/mock-store"
import type { Settlement } from "@/data/seed"

/**
 * Merchant Settlements — P1, PRD R5.4–R5.9.
 *
 * V1 payouts are performed **manually** (R5.5); this screen records that work
 * rather than executing it. Automated bank settlement and reconciliation are
 * explicitly out of scope (R5.9), so there is deliberately no "run payouts"
 * button anywhere in this feature.
 */
export default function SettlementsPage() {
	const { allowed } = useSession()
	const mock = useMockState()

	if (!allowed("settlement.view")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Merchant Settlements" />
				<PermissionWall permission="settlement.view" title="Merchant Settlements" />
			</div>
		)
	}

	const columns: Column<Settlement>[] = [
		{
			key: "id",
			header: "Payout",
			width: "10rem",
			sortValue: (row) => row.id,
			cell: (row) => (
				<div className="space-y-0.5">
					<p className="font-mono text-xs text-muted-foreground">{row.id}</p>
					<p className="text-xs text-muted-foreground">{row.periodCovered}</p>
				</div>
			),
		},
		{
			key: "store",
			header: "Store",
			sortValue: (row) => row.storeName,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.storeName}</p>
					{row.blockedReason && (
						<p className="line-clamp-2 text-xs text-destructive">{row.blockedReason}</p>
					)}
				</div>
			),
		},
		{
			key: "destination",
			header: "Destination",
			hideBelow: "lg",
			cell: (row) => (
				<div className="space-y-0.5">
					<p className="text-sm">{row.destinationBank}</p>
					<p className="tnum font-mono text-xs text-muted-foreground">
						{maskAccount(row.destinationLast4)}
					</p>
				</div>
			),
		},
		{
			key: "stage",
			header: "Stage",
			sortValue: (row) => row.stage,
			cell: (row) => <StatusBadge status={row.stage} />,
		},
		{
			key: "amount",
			header: "Amount",
			align: "right",
			sortValue: (row) => row.amount,
			cell: (row) => (
				<span className="text-sm font-semibold">{money(row.amount, row.currency)}</span>
			),
		},
		{
			key: "requested",
			header: "Prepared",
			align: "right",
			hideBelow: "xl",
			sortValue: (row) => new Date(row.requestedAt).getTime(),
			cell: (row) => (
				<span className="text-sm text-muted-foreground">{ago(row.requestedAt)}</span>
			),
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Merchant Settlements"
				description="Manual pilot payouts to merchants, recorded with enough evidence to trace each transfer to its merchant, destination, amount, result, operator, and time."
			/>

			<Callout tone="warning" title="Payouts are performed manually during the V1 pilot">
				This feature <strong>records</strong> a transfer that Finance performs in the
				bank&rsquo;s own system. It does not move money, and automated bank settlement and
				reconciliation are out of scope for V1 (R5.5, R5.9).
			</Callout>

			<DataTable
				rows={mock.settlements}
				columns={columns}
				hrefFor={(row) => `/settlements/${row.id}`}
				searchIn={(row) => `${row.id} ${row.storeName} ${row.stage} ${row.destinationBank}`}
				searchPlaceholder="Search payouts by store or reference"
				initialSort={{ key: "stage", direction: "asc" }}
				filters={[
					{
						key: "stage",
						label: "Filter stage",
						options: [
							{ value: "blocked", label: "Blocked", match: (r) => r.stage === "Blocked" },
							{
								value: "awaiting",
								label: "Awaiting transfer",
								match: (r) => r.stage === "Awaiting transfer",
							},
							{
								value: "processing",
								label: "Processing",
								match: (r) => r.stage === "Processing",
							},
							{
								value: "completed",
								label: "Completed",
								match: (r) => r.stage === "Completed",
							},
						],
					},
				]}
				empty={{ title: "No payouts recorded" }}
			/>
		</div>
	)
}
