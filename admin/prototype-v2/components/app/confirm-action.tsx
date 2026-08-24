"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AlertTriangle, ShieldAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/components/app/session-provider"

/**
 * Confirmation for a sensitive or dangerous action.
 *
 * PRD R9.2 — the action must make its effect clear *before* confirmation and
 * collect a reason where required. PRD R1.5 — the operator, action, record,
 * time, and reason are preserved. Register §3.1 lists the fields every sensitive
 * action must define; this dialog is the interface half of that table.
 *
 * Two rules the component enforces rather than trusting each caller with:
 *
 * 1. `effects` is required. An action whose consequences cannot be enumerated
 *    is not ready to be offered — R9.2 is not satisfiable without it.
 * 2. When `requireReason`, the confirm button stays disabled until a reason of
 *    real substance is typed. Blank and one-character reasons defeat the audit.
 */
export function ConfirmAction({
	open,
	onOpenChange,
	title,
	/** What the operator is about to do, in one plain sentence. */
	summary,
	/** The record being acted on, in human-readable terms (R9.1). */
	target,
	/** Every consequence, listed. Required — see rule 1 above. */
	effects,
	/** Consequences the action deliberately does NOT have (R3.7, no silent cascade). */
	doesNotAffect,
	requireReason = true,
	confirmLabel,
	tone = "danger",
	onConfirm,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	summary: string
	target: string
	effects: string[]
	doesNotAffect?: string[]
	requireReason?: boolean
	confirmLabel: string
	tone?: "danger" | "caution"
	onConfirm: (reason: string) => void
}) {
	const [reason, setReason] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const submittedForOpen = useRef(false)
	const reasonId = useId()
	const { record } = useSession()

	const reasonOk = !requireReason || reason.trim().length >= 8

	useEffect(() => {
		if (open) {
			submittedForOpen.current = false
		}
	}, [open])

	function confirm() {
		if (submittedForOpen.current || !reasonOk) return
		submittedForOpen.current = true
		setSubmitting(true)
		const cleanReason = reason.trim()
		record({ action: title, target, reason: cleanReason || undefined })
		onConfirm(cleanReason)
		setReason("")
		close(false)
	}

	function close(next: boolean) {
		if (!next) {
			setReason("")
			setSubmitting(false)
		}
		onOpenChange(next)
	}

	const Icon = tone === "danger" ? ShieldAlert : AlertTriangle

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<div className="flex items-start gap-3">
						<div
							className={cn(
								"flex size-9 shrink-0 items-center justify-center rounded-full",
								tone === "danger" ? "bg-destructive/12" : "bg-warning/12",
							)}
						>
							<Icon
								className={cn(
									"size-4.5",
									tone === "danger" ? "text-destructive" : "text-warning",
								)}
							/>
						</div>
						<div className="min-w-0 space-y-1">
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription>{summary}</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-4">
					<div className="rounded-lg border border-border bg-secondary/50 px-3.5 py-3">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Target
						</p>
						<p className="mt-0.5 break-words text-sm font-semibold [overflow-wrap:anywhere]">
							{target}
						</p>
					</div>

					<div className="space-y-2">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							What this does
						</p>
						<ul className="space-y-1.5">
							{effects.map((effect) => (
								<li
									key={effect}
									className="flex min-w-0 gap-2 break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
								>
									<span
										className={cn(
											"mt-1.5 size-1.5 shrink-0 rounded-full",
											tone === "danger" ? "bg-destructive" : "bg-warning",
										)}
										aria-hidden
									/>
									{effect}
								</li>
							))}
						</ul>
					</div>

					{doesNotAffect && doesNotAffect.length > 0 && (
						<div className="space-y-2">
							<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								What this does not do
							</p>
							<ul className="space-y-1.5">
								{doesNotAffect.map((item) => (
									<li
										key={item}
									className="flex min-w-0 gap-2 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
									>
										<span
											className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
											aria-hidden
										/>
										{item}
									</li>
								))}
							</ul>
						</div>
					)}

					{requireReason && (
						<div className="space-y-1.5">
							<Label htmlFor={reasonId}>
								Reason <span className="text-destructive">*</span>
							</Label>
							<Textarea
								id={reasonId}
								value={reason}
								onChange={(event) => setReason(event.target.value)}
								placeholder="Why this action is being taken, and on whose authority."
								rows={3}
								maxLength={500}
								className="break-words [overflow-wrap:anywhere]"
							/>
							<p className="text-xs text-muted-foreground">
								Stored with your name and the time, and cannot be edited afterwards.
							</p>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" disabled={submitting} onClick={() => close(false)}>
						Cancel
					</Button>
					<Button
						variant={tone === "danger" ? "destructive" : "default"}
						disabled={!reasonOk || submitting}
						onClick={confirm}
					>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
