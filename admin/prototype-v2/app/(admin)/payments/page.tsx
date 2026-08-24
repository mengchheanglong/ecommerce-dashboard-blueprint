"use client"

import { useState } from "react"
import { Check, ReceiptText } from "lucide-react"

import { ago, money } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, matchPayment, recordMerchantRefund } from "@/lib/mock-store"
import { storeById, type Payment } from "@/data/seed"
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
 * Customer Payments — P1, PRD R4.9–R4.13.
 *
 * The hard boundary this screen has to hold: **Angkoro does not refund
 * shoppers.** Merchants issue refunds from their own bank account (R4.11); this
 * feature can only *record* that a merchant did so (R4.12). There is therefore
 * no refund button here, and the recorded-refund column exists to show the
 * difference between the two.
 */
export default function PaymentsPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const [matching, setMatching] = useState<Payment | null>(null)
	const [refunding, setRefunding] = useState<Payment | null>(null)
	const [refundForm, setRefundForm] = useState({ reference: "", note: "" })

	if (!allowed("payment.investigate")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Customer Payments" />
				<PermissionWall permission="payment.investigate" title="Customer Payments" />
			</div>
		)
	}

	const refundValid =
		refundForm.reference.trim().length >= 4 && refundForm.note.trim().length >= 8

	const columns: Column<Payment>[] = [
		{
			key: "id",
			header: "Payment",
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
			key: "store",
			header: "Store and shopper",
			sortValue: (row) => row.storeId,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{storeById(row.storeId)?.name ?? row.storeId}</p>
					<p className="text-xs text-muted-foreground">{row.shopper}</p>
				</div>
			),
		},
		{
			key: "method",
			header: "Method",
			hideBelow: "md",
			sortValue: (row) => row.method,
			cell: (row) => <span className="text-sm">{row.method}</span>,
		},
		{
			key: "state",
			header: "State",
			sortValue: (row) => row.state,
			cell: (row) => (
				<div className="space-y-1">
					<StatusBadge status={row.state} />
					{row.merchantRefund && (
						<StatusBadge status="Merchant refunded" tone="neutral" />
					)}
				</div>
			),
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
			key: "recorded",
			header: "Recorded",
			align: "right",
			hideBelow: "lg",
			sortValue: (row) => new Date(row.recordedAt).getTime(),
			cell: (row) => (
				<span className="text-sm text-muted-foreground">{ago(row.recordedAt)}</span>
			),
		},
		{
			key: "note",
			header: "Investigation note",
			hideBelow: "xl",
			cell: (row) => (
				<p className="max-w-xs text-xs text-muted-foreground">
					{row.note ?? row.merchantRefund?.note ?? "—"}
				</p>
			),
		},
		{
			key: "actions",
			header: "",
			width: "11rem",
			cell: (row) => {
				const canMatch = row.state === "Unmatched"
				const canRefund = row.state === "Matched" && !row.merchantRefund
				return (
					<div className="flex flex-wrap gap-1.5">
						{canMatch && (
							<PermissionGate permission="payment.correct">
								<Button
									variant="outline"
									size="sm"
									onClick={(event) => {
										event.stopPropagation()
										setMatching(row)
									}}
								>
									<Check />
									Match
								</Button>
							</PermissionGate>
						)}
						{canRefund && (
							<PermissionGate permission="payment.correct">
								<Button
									variant="ghost"
									size="sm"
									onClick={(event) => {
										event.stopPropagation()
										setRefunding(row)
										setRefundForm({ reference: "", note: "" })
									}}
								>
									<ReceiptText />
									Record refund
								</Button>
							</PermissionGate>
						)}
					</div>
				)
			},
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Customer Payments"
				description="Angkoro-recorded shopper payments, their relationship to the order and store, and their current payment or matching state."
			/>

			<Callout tone="warning" title="Angkoro does not refund shoppers">
				Refunds are issued by the merchant from the merchant&rsquo;s own bank account
				(R4.11). This feature can record that a merchant-performed refund happened, but the
				admin system never moves refund money (R4.12). Provider-side disputes and
				chargebacks have no V1 feature and are handled manually by Finance (R4.13).
			</Callout>

			<DataTable
				rows={mock.payments}
				columns={columns}
				searchIn={(row) => `${row.id} ${row.orderId} ${row.shopper} ${row.state} ${row.method}`}
				searchPlaceholder="Search by payment, order, or shopper"
				initialSort={{ key: "recorded", direction: "desc" }}
				filters={[
					{
						key: "state",
						label: "Filter state",
						options: [
							{
								value: "exception",
								label: "Needs investigation",
								match: (r) => r.state === "Unmatched" || r.state === "Failed",
							},
							{ value: "matched", label: "Matched", match: (r) => r.state === "Matched" },
							{
								value: "refunded",
								label: "Merchant refunded",
								match: (r) => Boolean(r.merchantRefund),
							},
						],
					},
				]}
				empty={{ title: "No payments match" }}
			/>

			<Callout tone="info" title="Payment visibility is not custody">
				A payment appearing here means Angkoro <em>recorded</em> it. It does not by itself
				mean Angkoro received or holds the money — COD cash never enters the platform at
				all.
			</Callout>

			<ConfirmAction
				open={matching !== null}
				onOpenChange={(open) => !open && setMatching(null)}
				title="Match payment"
				summary="Confirm this recorded payment corresponds to a verified shopper payment, resolving it from Unmatched to Matched."
				target={matching ? `${matching.id} · ${matching.shopper} · ${money(matching.amount, matching.currency)}` : ""}
				effects={[
					"The payment is marked Matched and leaves the investigation queue.",
					"The note you provide is stored with the payment and in the audit history.",
				]}
				doesNotAffect={[
					"Whether Angkoro received or holds the money — matching confirms the record, not custody.",
				]}
				confirmLabel="Match payment"
				tone="caution"
				onConfirm={(reason) => {
					if (matching && matchPayment(matching.id, reason, operator.name, role)) {
						notify.recorded("Payment matched", matching.id)
					}
				}}
			/>

			<Dialog
				open={refunding !== null}
				onOpenChange={(open) => !open && setRefunding(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Record a merchant refund</DialogTitle>
						<DialogDescription>
							The merchant refunded the shopper from their own bank account. Angkoro only
							<em> records</em> this — no money moves through Angkoro (R4.12).
						</DialogDescription>
					</DialogHeader>

					{refunding && (
						<div className="space-y-4">
							<div className="rounded-lg border border-border bg-secondary/50 px-3.5 py-3">
								<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
									Target
								</p>
								<p className="mt-0.5 break-words text-sm font-semibold [overflow-wrap:anywhere]">
									{refunding.id} · {refunding.shopper} ·{" "}
									{money(refunding.amount, refunding.currency)}
								</p>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="ref-ref">
									Merchant refund reference <span className="text-destructive">*</span>
								</Label>
								<Input
									id="ref-ref"
									value={refundForm.reference}
									onChange={(e) =>
										setRefundForm({ ...refundForm, reference: e.target.value })
									}
									placeholder="Merchant's own refund reference"
								/>
								<p className="text-xs text-muted-foreground">
									The merchant&rsquo;s bank reference for the refund they issued.
								</p>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="ref-note">
									Note <span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="ref-note"
									value={refundForm.note}
									onChange={(e) =>
										setRefundForm({ ...refundForm, note: e.target.value })
									}
									placeholder="Why and how the merchant refunded, and on whose authority."
									rows={3}
									maxLength={500}
								/>
							</div>

							<p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
								Recording a refund here does not move any money. Funds are held and
								returned entirely by the merchant (R4.11, R4.12).
							</p>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setRefunding(null)}>
							Cancel
						</Button>
						<Button
							disabled={!refundValid}
							onClick={() => {
								if (!refunding || !refundValid) return
								if (
									recordMerchantRefund(
										refunding.id,
										refundForm.reference.trim(),
										refundForm.note.trim(),
										operator.name,
										role,
									)
								) {
									notify.recorded(
										"Merchant refund recorded",
										`${refunding.id} · no money moved by Angkoro.`,
									)
								}
								setRefunding(null)
							}}
						>
							Record refund
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
