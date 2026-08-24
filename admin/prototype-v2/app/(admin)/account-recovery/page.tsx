"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, CircleDashed, CircleCheck } from "lucide-react"

import { dateTime } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, Panel } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, decideRecovery, provideEvidence } from "@/lib/mock-store"
import type { RecoveryCase } from "@/data/seed"
import { Button } from "@/components/ui/button"

/**
 * Account Recovery — P2, PRD R6.8–R6.12.
 *
 * Two boundaries this screen exists to hold:
 *
 * - Normal self-service recovery is used first (R6.8). This feature is the
 *   *exception* path, not the default one.
 * - Recovery is never a store-ownership transfer (R6.12). The rejected case in
 *   the data is exactly that attempt, kept as a worked example.
 */
export default function AccountRecoveryPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const [approving, setApproving] = useState<RecoveryCase | null>(null)

	if (!allowed("recovery.intake")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Account Recovery" />
				<PermissionWall permission="recovery.intake" title="Account Recovery" />
			</div>
		)
	}

	return (
		<div className="space-y-5">
			<PageHeader
				title="Account Recovery"
				description="Exceptional recovery for when normal self-service recovery cannot be completed — evidence gathered by Support, decided by an authorised approver."
			/>

			<Callout tone="warning" title="This is the exception path">
				Self-service recovery is used first wherever it still works (R6.8). Recovery can
				never be used to transfer store ownership — that is a separate privileged workflow
				(R6.12).
			</Callout>

			{mock.recovery.map((recovery) => {
				const gathered = recovery.evidence.filter((e) => e.provided).length
				const undecided = recovery.state === "Awaiting approval"
				return (
					<Panel
						key={recovery.id}
						title={recovery.subject}
						description={`${recovery.id} · ${recovery.accountName} (${recovery.accountId})`}
						actions={<StatusBadge status={recovery.state} />}
					>
						<div className="grid gap-5 md:grid-cols-2">
							<div className="space-y-4">
								<FieldList
									items={[
										{
											label: "Support case",
											value: (
												<Link
													href={`/support/${recovery.caseId}`}
													className="focus-ring rounded underline decoration-border underline-offset-4 hover:decoration-foreground"
												>
													{recovery.caseId}
												</Link>
											),
										},
										{ label: "Opened", value: dateTime(recovery.openedAt) },
										{ label: "Opened by", value: recovery.openedBy },
										{
											label: "Decision",
											value: recovery.approver ? (
												`${recovery.approver} · ${recovery.decidedAt ? dateTime(recovery.decidedAt) : ""}`
											) : (
												<span className="text-muted-foreground">
													Not yet decided
												</span>
											),
										},
									]}
								/>

								{recovery.note && (
									<p className="rounded-lg border border-border bg-secondary/50 px-3.5 py-3 text-sm leading-relaxed">
										{recovery.note}
									</p>
								)}

								{recovery.state === "Awaiting approval" &&
									(gathered > 0 ? (
										<PermissionGate permission="recovery.approve">
											<Button onClick={() => setApproving(recovery)}>
												<Check />
												Approve recovery
											</Button>
										</PermissionGate>
									) : (
										<div className="rounded-md border border-dashed border-border bg-secondary/40 px-3.5 py-3 text-sm text-muted-foreground">
											<strong className="font-semibold text-foreground">
												Approval blocked
											</strong>{" "}
											— no evidence has been provided yet ({gathered} of{" "}
											{recovery.evidence.length}). Provide at least one item above
											before this case can be approved.
										</div>
									))}
								{undecided && (
									<PermissionGate permission="recovery.intake">
										<div className="mt-2 space-y-1.5">
											<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
												Mark evidence as provided
											</p>
											{recovery.evidence
												.filter((item) => !item.provided)
												.map((item) => (
													<Button
														key={item.kind}
														variant="outline"
														size="sm"
														className="w-full justify-start"
														onClick={() =>
															provideEvidence(recovery.id, item.kind, operator.name, role)
														}
													>
														<CircleCheck />
														{item.kind}
													</Button>
												))}
										</div>
									</PermissionGate>
								)}
							</div>

							<div>
								<div className="flex items-baseline justify-between gap-2">
									<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
										Evidence
									</p>
									<span className="tnum text-xs text-muted-foreground">
										{gathered} of {recovery.evidence.length}
									</span>
								</div>
								<ul className="mt-2 space-y-1.5">
									{recovery.evidence.map((item) => (
										<li
											key={item.kind}
											className="flex items-start gap-2.5 rounded-md border border-border px-2.5 py-2"
										>
											{item.provided ? (
												<CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
											) : (
												<CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
											)}
											<span
												className={`text-sm ${item.provided ? "" : "text-muted-foreground"}`}
											>
												{item.kind}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</Panel>
				)
			})}

			<OpenQuestion source="§3.4 Account-recovery evidence">
				Which evidence categories are accepted, how many are required, and who may approve
				each risk level have not been agreed. The items listed above are candidates under
				evaluation, not an approved checklist — do not treat a full set of ticks as
				sufficient grounds to approve.
			</OpenQuestion>

			<ConfirmAction
				open={approving !== null}
				onOpenChange={(open) => !open && setApproving(null)}
				title="Approve exceptional account recovery"
				summary="Restore this person's access to their account on the evidence gathered."
				target={approving ? `${approving.id} · ${approving.accountName}` : ""}
				effects={[
					"The account owner regains access through a fresh credential set-up.",
					"Sessions and access that should no longer be trusted are revoked (R6.11).",
					"The account owner is notified through an available trusted channel.",
					"The full recovery history, evidence, and your decision are preserved.",
				]}
				doesNotAffect={[
					"Store ownership — recovery never transfers a store to a different person (R6.12).",
					"Any restriction currently applied to the account or its stores.",
				]}
				confirmLabel="Approve recovery"
				tone="danger"
				onConfirm={(reason) => {
					if (!approving) return false
					const ok = decideRecovery(approving.id, "Approved", reason, operator.name, role)
					if (ok) {
						notify.recorded(
							"Recovery approved",
							`${approving.accountName} · old sessions revoked.`,
						)
					}
					return ok
				}}
			/>
		</div>
	)
}
