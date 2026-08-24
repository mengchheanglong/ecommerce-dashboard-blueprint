"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Search } from "lucide-react"

import { ago } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, setOrderIssueState } from "@/lib/mock-store"
import type { OrderIssue } from "@/data/seed"
import { Button } from "@/components/ui/button"

/**
 * Order Issues — P2, PRD R4.1–R4.4.
 *
 * R4.1 is the boundary: this feature covers problems caused by *Angkoro's*
 * checkout, order, inventory, payment, or status processing. Ordinary product,
 * delivery, fulfillment, return, and missing-item complaints stay with the
 * merchant, and Support closes those as merchant responsibility (R2.9).
 *
 * The Origin column exists because of R4.2 — an issue may come from a user
 * report *or* a verified system signal, and the admin system must not imply
 * every order problem is detected automatically.
 *
 * Investigation and correction follow R4.7: an issue advances only forward
 * (Open -> Investigating -> Resolved), each transition is permission-controlled
 * and recorded with its stated reason, and no order, payment, or store record
 * is changed by these actions.
 */
export default function OrderIssuesPage() {
	const { operator, role } = useSession()
	const mock = useMockState()
	const [starting, setStarting] = useState<OrderIssue | null>(null)
	const [resolving, setResolving] = useState<OrderIssue | null>(null)

	const columns: Column<OrderIssue>[] = [
		{
			key: "id",
			header: "Issue",
			width: "10rem",
			sortValue: (row) => row.id,
			cell: (row) => (
				<div className="space-y-0.5">
					<p className="font-mono text-xs text-muted-foreground">{row.id}</p>
					<p className="font-mono text-xs text-muted-foreground">{row.orderId}</p>
				</div>
			),
		},
		{
			key: "kind",
			header: "Problem",
			sortValue: (row) => row.kind,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.kind}</p>
					<p className="line-clamp-2 text-xs text-muted-foreground">{row.summary}</p>
				</div>
			),
		},
		{
			key: "store",
			header: "Store",
			hideBelow: "lg",
			sortValue: (row) => row.storeName,
			cell: (row) => (
				<Link
					href={`/stores/${row.storeId}`}
					className="focus-ring rounded text-sm underline decoration-transparent underline-offset-4 transition-colors hover:decoration-border"
					onClick={(event) => event.stopPropagation()}
				>
					{row.storeName}
				</Link>
			),
		},
		{
			key: "origin",
			header: "Origin",
			hideBelow: "md",
			sortValue: (row) => row.origin,
			cell: (row) => (
				<StatusBadge
					status={row.origin}
					tone={row.origin === "Verified system signal" ? "info" : "neutral"}
				/>
			),
		},
		{
			key: "state",
			header: "State",
			sortValue: (row) => row.state,
			cell: (row) => <StatusBadge status={row.state} />,
		},
		{
			key: "case",
			header: "Case",
			hideBelow: "xl",
			cell: (row) =>
				row.caseId ? (
					<Link
						href={`/support/${row.caseId}`}
						className="focus-ring rounded font-mono text-xs underline decoration-border underline-offset-4"
						onClick={(event) => event.stopPropagation()}
					>
						{row.caseId}
					</Link>
				) : (
					<span className="text-xs text-muted-foreground">Not linked</span>
				),
		},
		{
			key: "detected",
			header: "Detected",
			align: "right",
			hideBelow: "sm",
			sortValue: (row) => new Date(row.detectedAt).getTime(),
			cell: (row) => (
				<span className="text-sm text-muted-foreground">{ago(row.detectedAt)}</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "11rem",
			cell: (row) => {
				if (row.state === "Open") {
					return (
						<PermissionGate permission="orderissue.correct">
							<Button
								variant="outline"
								size="sm"
								onClick={(event) => {
									event.stopPropagation()
									setStarting(row)
								}}
							>
								<Search />
								Start investigation
							</Button>
						</PermissionGate>
					)
				}
				if (row.state === "Investigating") {
					return (
						<PermissionGate permission="orderissue.correct">
							<Button
								variant="ghost"
								size="sm"
								onClick={(event) => {
									event.stopPropagation()
									setResolving(row)
								}}
							>
								<Check />
								Resolve
							</Button>
						</PermissionGate>
					)
				}
				return <span className="text-xs text-muted-foreground">Resolved</span>
			},
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Order Issues"
				description="Problems caused by Angkoro's own checkout, order, inventory, payment, or status processing."
			/>

			<Callout tone="info" title="What belongs here, and what does not">
				<p>
					<strong>Here:</strong> the platform mis-processed the order — a payment recorded
					but not applied, stock oversold at checkout, a status transition that fired
					wrongly.
				</p>
				<p className="mt-1.5">
					<strong>Not here:</strong> late delivery, damaged goods, wrong item, returns, or
					a shopper unhappy with the product. Those are the merchant&rsquo;s
					responsibility and are closed as such in Support (R4.1, R2.9).
				</p>
			</Callout>

			<DataTable
				rows={mock.orderIssues}
				columns={columns}
				searchIn={(row) => `${row.id} ${row.orderId} ${row.kind} ${row.storeName} ${row.state}`}
				searchPlaceholder="Search by issue, order, or store"
				initialSort={{ key: "detected", direction: "desc" }}
				filters={[
					{
						key: "state",
						label: "Filter state",
						options: [
							{
								value: "open",
								label: "Open",
								match: (r) => r.state !== "Resolved",
							},
							{
								value: "signal",
								label: "System-detected",
								match: (r) => r.origin === "Verified system signal",
							},
							{
								value: "reported",
								label: "User-reported",
								match: (r) => r.origin === "User report",
							},
						],
					},
				]}
				empty={{ title: "No order issues", description: "Nothing needs operational review." }}
			/>

			<Callout tone="warning">
				Not every order problem is detected automatically. An issue reaching this queue via
				a user report means a shopper or merchant noticed it before the platform did —
				worth tracking as its own signal (R4.2).
			</Callout>

			<ConfirmAction
				open={starting !== null}
				onOpenChange={(open) => !open && setStarting(null)}
				title="Start investigation"
				summary="Mark this order issue as under operational review, moving it from Open to Investigating."
				target={starting ? `${starting.id} · ${starting.orderId} · ${starting.kind}` : ""}
				effects={[
					"The issue is marked Investigating and leaves the open queue.",
					"The reason you provide is recorded in the audit history.",
				]}
				doesNotAffect={[
					"No order, payment, or store record is changed by starting the investigation.",
				]}
				confirmLabel="Start investigation"
				tone="caution"
				onConfirm={(reason) => {
					if (
						starting &&
						setOrderIssueState(starting.id, "Investigating", reason, operator.name, role)
					) {
						notify.recorded("Investigation started", starting.id)
					}
				}}
			/>

			<ConfirmAction
				open={resolving !== null}
				onOpenChange={(open) => !open && setResolving(null)}
				title="Resolve order issue"
				summary="Mark this order issue Resolved once the approved correction has been completed."
				target={resolving ? `${resolving.id} · ${resolving.orderId} · ${resolving.kind}` : ""}
				effects={[
					"The issue is marked Resolved and leaves the investigation queue.",
					"The reason you provide is recorded in the audit history.",
				]}
				doesNotAffect={[
					"No order, payment, or store record is changed — resolving records the outcome only.",
				]}
				confirmLabel="Resolve issue"
				tone="caution"
				onConfirm={(reason) => {
					if (
						resolving &&
						setOrderIssueState(resolving.id, "Resolved", reason, operator.name, role)
					) {
						notify.recorded("Order issue resolved", resolving.id)
					}
				}}
			/>
		</div>
	)
}
