"use client"

import { useState } from "react"
import Link from "next/link"
import { SquarePen } from "lucide-react"

import { longDate, money, until } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, resolveBilling } from "@/lib/mock-store"
import { STORES, type BillingRecord } from "@/data/seed"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"

/**
 * Store Plan and Billing — P1, PRD R5.1–R5.3.
 *
 * R3.8 draws the line this page must respect: a store's *billing* state and its
 * *administrative restriction* state are separate. A store can be suspended for
 * policy while fully paid up, or lapsed on billing while in perfect standing —
 * and neither implies the other. Mekong Home Goods in the data is exactly this
 * case, and the callout below names it.
 */
export default function BillingPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const [correcting, setCorrecting] = useState<BillingRecord | null>(null)
	const [correctionForm, setCorrectionForm] = useState({ reference: "", note: "" })

	if (!allowed("billing.investigate")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Store Plan and Billing" />
				<PermissionWall permission="billing.investigate" title="Store Plan and Billing" />
			</div>
		)
	}

	const attention = mock.billing.filter((b) => b.state !== "Paid")
	const unmatched = mock.billing.filter((b) => b.state === "Unmatched")
	const expiring = STORES.filter((s) => s.planState === "Expiring" || s.planState === "Expired")

	const correctionValid =
		correctionForm.reference.trim().length >= 4 && correctionForm.note.trim().length >= 8

	const columns: Column<BillingRecord>[] = [
		{
			key: "id",
			header: "Record",
			width: "9rem",
			sortValue: (row) => row.id,
			cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span>,
		},
		{
			key: "store",
			header: "Store",
			sortValue: (row) => row.storeName,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<Link
						href={`/stores/${row.storeId}`}
						className="focus-ring rounded font-medium underline decoration-transparent underline-offset-4 transition-colors hover:decoration-border"
					>
						{row.storeName}
					</Link>
					<p className="text-xs text-muted-foreground">{row.plan}</p>
				</div>
			),
		},
		{
			key: "state",
			header: "Payment state",
			sortValue: (row) => row.state,
			cell: (row) => <StatusBadge status={row.state} />,
		},
		{
			key: "method",
			header: "Method",
			hideBelow: "lg",
			cell: (row) => (
				<div className="space-y-0.5">
					<span className="text-sm">{row.method}</span>
					{row.reference && (
						<p className="font-mono text-xs text-muted-foreground">{row.reference}</p>
					)}
				</div>
			),
		},
		{
			key: "due",
			header: "Due",
			align: "right",
			hideBelow: "md",
			sortValue: (row) => new Date(row.dueAt).getTime(),
			cell: (row) => {
				const due = until(row.dueAt)
				return (
					<div className="space-y-0.5">
						<p className="text-sm">{longDate(row.dueAt)}</p>
						{row.state !== "Paid" && (
							<p
								className={`text-xs ${due.overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}
							>
								{due.label}
							</p>
						)}
					</div>
				)
			},
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
			key: "note",
			header: "Note",
			hideBelow: "xl",
			cell: (row) => (
				<p className="max-w-xs text-xs text-muted-foreground">{row.note ?? "—"}</p>
			),
		},
		{
			key: "actions",
			header: "",
			width: "10rem",
			cell: (row) =>
				row.state !== "Paid" ? (
					<PermissionGate permission="billing.investigate">
						<Button
							variant="ghost"
							size="sm"
							onClick={(event) => {
								event.stopPropagation()
								setCorrecting(row)
								setCorrectionForm({ reference: "", note: "" })
							}}
						>
							<SquarePen />
							Record correction
						</Button>
					</PermissionGate>
				) : (
					<span className="text-xs text-muted-foreground">Paid</span>
				),
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Store Plan and Billing"
				description="Each store's current plan access, billing history, and plan-payment state, with the stores needing billing attention easy to find."
			/>

			<StatGrid columns={3}>
				<StatCard
					label="Needing attention"
					value={String(attention.length)}
					definition="Plan payments that are unmatched, failed, or still pending"
					tone={attention.length > 0 ? "warn" : "neutral"}
				/>
				<StatCard
					label="Unmatched payments"
					value={String(unmatched.length)}
					definition="Merchant reports paying, but no matching record exists"
					tone={unmatched.length > 0 ? "bad" : "neutral"}
				/>
				<StatCard
					label="Access lapsing"
					value={String(expiring.length)}
					definition="Stores whose plan access has expired or expires shortly"
					tone={expiring.length > 0 ? "warn" : "neutral"}
				/>
			</StatGrid>

			<Callout tone="info" title="Billing state is not restriction state">
				A lapsed plan is a commercial matter; an administrative restriction is a platform
				decision. Neither implies the other, and the two are never merged into one status
				(R3.8).
			</Callout>

			<DataTable
				rows={mock.billing}
				columns={columns}
				searchIn={(row) => `${row.id} ${row.storeName} ${row.plan} ${row.state} ${row.reference ?? ""}`}
				searchPlaceholder="Search by store, plan, or reference"
				initialSort={{ key: "state", direction: "asc" }}
				filters={[
					{
						key: "state",
						label: "Filter state",
						options: [
							{
								value: "attention",
								label: "Needs attention",
								match: (r) => r.state !== "Paid",
							},
							{ value: "paid", label: "Paid", match: (r) => r.state === "Paid" },
						],
					},
				]}
				empty={{ title: "No plan payments match" }}
			/>

			<Callout tone="info">
				The admin system displays the subscription and access state supplied by the commerce
				platform — it is not a second source of truth for what a store may use (R5.3).
			</Callout>

			<Dialog
				open={correcting !== null}
				onOpenChange={(open) => !open && setCorrecting(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Record billing correction</DialogTitle>
						<DialogDescription>
							Record that a plan payment was received and mark this attention row as paid.
							This resolves the unpaid state only — it does not grant or revoke any store
							access by itself.
						</DialogDescription>
					</DialogHeader>

					{correcting && (
						<div className="space-y-4">
							<div className="rounded-lg border border-border bg-secondary/50 px-3.5 py-3">
								<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
									Target
								</p>
								<p className="mt-0.5 break-words text-sm font-semibold [overflow-wrap:anywhere]">
									{correcting.id} · {correcting.storeName} ·{" "}
									{money(correcting.amount, correcting.currency)}
								</p>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="corr-ref">
									Payment reference <span className="text-destructive">*</span>
								</Label>
								<Input
									id="corr-ref"
									value={correctionForm.reference}
									onChange={(e) =>
										setCorrectionForm({ ...correctionForm, reference: e.target.value })
									}
									placeholder="Bank or card reference for the received payment"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="corr-note">
									Note <span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="corr-note"
									value={correctionForm.note}
									onChange={(e) =>
										setCorrectionForm({ ...correctionForm, note: e.target.value })
									}
									placeholder="Why the payment is being confirmed, and on whose authority."
									rows={3}
									maxLength={500}
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setCorrecting(null)}>
							Cancel
						</Button>
						<Button
							disabled={!correctionValid}
							onClick={() => {
								if (!correcting || !correctionValid) return
								if (
									resolveBilling(
										correcting.id,
										correctionForm.reference.trim(),
										correctionForm.note.trim(),
										operator.name,
										role,
									)
								) {
									notify.recorded(
										"Billing correction recorded",
										`${correcting.storeName} · marked paid.`,
									)
								}
								setCorrecting(null)
							}}
						>
							Record correction
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
