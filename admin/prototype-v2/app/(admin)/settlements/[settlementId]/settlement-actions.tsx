"use client"

import { useId, useState } from "react"
import { Banknote, CheckCircle2 } from "lucide-react"

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
import { PermissionGate } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { completeTransfer, startTransfer } from "@/lib/mock-store"
import type { SettlementStage } from "@/data/seed"

/**
 * Recording a manual payout — PRD R5.5, R5.6.
 *
 * Starting records that the operator initiated the transfer; a bank reference
 * does not exist yet. Completion requires the reference because R5.6 demands
 * enough evidence to reconcile the result against the statement later.
 */
export function SettlementActions({
	settlementId,
	stage,
	storeName,
	amount,
	destination,
}: {
	settlementId: string
	stage: SettlementStage
	storeName: string
	amount: string
	destination: string
}) {
	const [open, setOpen] = useState(false)
	const [reference, setReference] = useState("")
	const [note, setNote] = useState("")
	const referenceId = useId()
	const noteId = useId()
	const { record, operator, role } = useSession()

	if (stage === "Completed") {
		return (
			<span className="text-sm text-muted-foreground">
				Transfer completed and evidenced.
			</span>
		)
	}

	if (stage === "Blocked") {
		return (
			<span className="text-sm font-medium text-destructive">
				Blocked — resolve the destination review first.
			</span>
		)
	}

	const starting = stage === "Awaiting transfer"
	const referenceOk = reference.trim().length >= 6

	function submit() {
		const recorded = starting
			? startTransfer(settlementId, operator.name, role)
			: completeTransfer(settlementId, reference, note, operator.name, role)
		if (!recorded) return
		record({
			action: starting ? "Manual payout started" : "Manual payout completed",
			target: `${settlementId} · ${storeName} · ${amount}`,
			reason: note.trim() || undefined,
		})
		notify.recorded(
			starting ? "Transfer marked as started" : "Payout completion recorded",
			starting
				? `${settlementId} · ${operator.name} · bank reference required on completion.`
				: `${settlementId} · ${operator.name} · reference ${reference.trim()}`,
		)
		setOpen(false)
		setReference("")
		setNote("")
	}

	return (
		<>
			<PermissionGate permission="settlement.record">
				<Button onClick={() => setOpen(true)}>
					{starting ? <Banknote /> : <CheckCircle2 />}
					{starting ? "Record transfer started" : "Record completion"}
				</Button>
			</PermissionGate>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{starting ? "Record that the transfer was started" : "Record the completed payout"}
						</DialogTitle>
						<DialogDescription>
							Angkoro does not move money from this screen. Perform the transfer in the
							bank&rsquo;s own system first, then record what happened here.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<dl className="divide-y divide-border rounded-lg border border-border bg-secondary/40 px-3.5">
							{[
								["Payout", settlementId],
								["Store", storeName],
								["Amount", amount],
								["Destination", destination],
								["Operator", operator.name],
							].map(([label, value]) => (
								<div key={label} className="flex justify-between gap-4 py-2 text-sm">
									<dt className="text-muted-foreground">{label}</dt>
									<dd className="text-right font-medium">{value}</dd>
								</div>
							))}
						</dl>

						{!starting && (
							<>
								<div className="space-y-1.5">
									<Label htmlFor={referenceId}>
										Bank reference <span className="text-destructive">*</span>
									</Label>
									<Input
										id={referenceId}
										value={reference}
										onChange={(event) => setReference(event.target.value)}
										placeholder="e.g. ACL-20260819-77412"
										className="font-mono"
										maxLength={120}
									/>
									<p className="text-xs text-muted-foreground">
										Required on completion so the payout can be reconciled against the bank statement.
									</p>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor={noteId}>Note</Label>
									<Textarea
										id={noteId}
										value={note}
										onChange={(event) => setNote(event.target.value)}
										placeholder="Anything a reviewer would need to understand this transfer."
										rows={2}
										maxLength={500}
										className="break-words [overflow-wrap:anywhere]"
									/>
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button disabled={!starting && !referenceOk} onClick={submit}>
							{starting ? "Record as started" : "Record completion"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
