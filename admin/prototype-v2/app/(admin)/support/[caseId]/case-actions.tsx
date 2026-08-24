"use client"

import { useState } from "react"
import { CheckCircle2, MessageSquarePlus, UserPlus } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { addCaseNote, assignCase, closeCase, replyToCase } from "@/lib/mock-store"

/**
 * Case actions — wired to the mock store.
 *
 * Closing a case collects a reason; claiming one does not. R9.2 requires a
 * reason where the action's effect warrants it — claiming work is reversible and
 * self-evident, closure is a decision the reporting user is told about.
 */
export function CaseActions({ caseId, channel, settled }: { caseId: string; channel: string; settled: boolean }) {
	const [closing, setClosing] = useState(false)
	const { operator, role, record } = useSession()

	if (settled) {
		return (
			<span className="text-sm text-muted-foreground">
				This case is closed. Its history can no longer be edited.
			</span>
		)
	}

	function claim() {
		assignCase(caseId, operator.name, role)
		record({ action: "Case assigned", target: caseId })
		notify.done("Case assigned to you", `${caseId} · ${operator.name}`)
	}

	return (
		<>
			<PermissionGate permission="case.manage">
				<Button variant="outline" onClick={claim}>
					<UserPlus />
					Assign to me
				</Button>
			</PermissionGate>

			<PermissionGate permission="case.manage">
				<Button onClick={() => setClosing(true)}>
					<CheckCircle2 />
					Close case
				</Button>
			</PermissionGate>

			<ConfirmAction
				open={closing}
				onOpenChange={setClosing}
				title="Close support case"
				summary="Record the outcome and tell the reporting user through their original channel."
				target={`${caseId} · ${channel}`}
				effects={[
					"The case moves to Resolved and leaves the open queue.",
					"The reporting user receives the response through the channel they used.",
					"The closure, its reason, and your name are added to the case history permanently.",
				]}
				doesNotAffect={[
					"Linked order, payment, or store records — these keep their own state.",
					"Any restriction on the store or merchant account.",
				]}
				confirmLabel="Close case"
				tone="caution"
				onConfirm={(reason) => closeCase(caseId, reason, operator.name, role)}
			/>
		</>
	)
}

/** Reply composer — records the response in case history via the mock store. */
export function CaseReplyComposer({
	caseId,
	channel,
}: {
	caseId: string
	channel: string
}) {
	const [message, setMessage] = useState("")
	const [noteMode, setNoteMode] = useState<"reply" | "note">("reply")
	const { operator, role } = useSession()

	const empty = message.trim().length === 0

	function send() {
		if (empty) return
		if (noteMode === "note") {
			addCaseNote(caseId, message.trim(), operator.name, role)
			notify.recorded("Internal note added", `${caseId} · visible to admins only`)
		} else {
			replyToCase(caseId, message.trim(), channel, operator.name, role)
			notify.recorded(
				channel === "Platform report" ? "Response sent through the platform" : `Reply sent via ${channel}`,
				`${caseId} · ${operator.name}`,
			)
		}
		setMessage("")
	}

	return (
		<div className="space-y-3">
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setNoteMode("reply")}
					className={`focus-ring rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
						noteMode === "reply"
							? "border-primary bg-primary text-primary-foreground"
							: "border-border text-muted-foreground hover:bg-secondary/60"
					}`}
				>
					User-visible reply
				</button>
				<button
					type="button"
					onClick={() => setNoteMode("note")}
					className={`focus-ring rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
						noteMode === "note"
							? "border-primary bg-primary text-primary-foreground"
							: "border-border text-muted-foreground hover:bg-secondary/60"
					}`}
				>
					Internal note
				</button>
			</div>

			<Textarea
				value={message}
				onChange={(event) => setMessage(event.target.value)}
				rows={3}
				placeholder={
					noteMode === "reply"
						? channel === "Platform report"
							? "Write the response Angkoro will deliver through the platform…"
							: `Write the reply that will be sent via ${channel}…`
						: "Investigation notes — never shown to the user (R2 separation)."
				}
			/>

			<div className="flex items-center justify-between gap-3">
				<p className="text-xs text-muted-foreground">
					{noteMode === "reply"
						? channel === "Platform report"
							? "Delivered through the platform's support experience (R2.7)."
							: `Sent through the user's original channel (R2.6).`
						: "Stored in case history; internal only."}
				</p>
				<Button size="sm" disabled={empty} onClick={send}>
					<MessageSquarePlus />
					{noteMode === "reply" ? "Send reply" : "Add note"}
				</Button>
			</div>
		</div>
	)
}
