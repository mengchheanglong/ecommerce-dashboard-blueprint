"use client"

import { useState } from "react"
import { Check, Eye, EyeOff, X } from "lucide-react"

import { dateTime, maskAccount } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { Panel } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, decideAccountReview } from "@/lib/mock-store"
import type { AccountReview } from "@/data/seed"
import { Button } from "@/components/ui/button"

/**
 * Settlement Account Review — P1, PRD R5.7, R5.8. Live from the mock store.
 *
 * This is the gate in front of every payout: Super Admin confirms the destination
 * before Angkoro sends money there. A *changed* account is the risk case, so a
 * change is called out prominently and shows what it replaced.
 */
export default function SettlementAccountsPage() {
	const { allowed } = useSession()
	const mock = useMockState()

	if (!allowed("settlement.account.review")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Settlement Account Review" />
				<PermissionWall
					permission="settlement.account.review"
					title="Settlement Account Review"
				/>
			</div>
		)
	}

	const pending = mock.accountReviews.filter((r) => r.state === "Needs review")
	const decided = mock.accountReviews.filter((r) => r.state !== "Needs review")

	return (
		<div className="space-y-5">
			<PageHeader
				title="Settlement Account Review"
				description="Review and approve the merchant destination account Angkoro pays out to, preserving the history of what was approved and when."
			/>

			<Callout tone="warning" title="A changed account is the risk case">
				When a destination changes after verification, any prepared payout to that store is
				held until this review completes. Approving a destination is what allows money to
				leave Angkoro.
			</Callout>

			<Panel
				title={`Awaiting review (${pending.length})`}
				description="Payouts to these stores cannot proceed until a decision is recorded."
				contentClassName="p-0"
			>
				<ul className="divide-y divide-border">
					{pending.map((review) => (
						<ReviewRow key={review.id} review={review} />
					))}
				</ul>
			</Panel>

			<Panel title="Decision history" contentClassName="p-0">
				<ul className="divide-y divide-border">
					{decided.map((review) => (
						<ReviewRow key={review.id} review={review} />
					))}
				</ul>
			</Panel>

			<OpenQuestion source="§3.7 Settlement Account Review rules">
				What evidence proves an account belongs to the merchant, whether a name mismatch is
				an automatic rejection, and how long an approval remains valid before
				re-verification is required, have not been approved.
			</OpenQuestion>
		</div>
	)
}

function ReviewRow({ review }: { review: AccountReview }) {
	const [revealed, setRevealed] = useState(false)
	const [approving, setApproving] = useState(false)
	const [rejecting, setRejecting] = useState(false)

	const { role, operator } = useSession()
	const pending = review.state === "Needs review"
	const target = `${review.id} · ${review.storeName}`

	return (
		<li className="px-4 py-3.5">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 flex-1 space-y-1.5">
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-mono text-xs text-muted-foreground">{review.id}</span>
						<StatusBadge status={review.state} />
						{review.isChange && <StatusBadge status="Changed account" tone="warn" />}
					</div>

					<p className="text-sm font-medium">{review.storeName}</p>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
						<span>{review.bank}</span>
						<span className="tnum font-mono">
							{/*
							  R5.8 — masked by default. Revealing is an explicit act by an
							  authorised Finance operator, not the resting state of the page.
							*/}
							{revealed ? `•••• •••• ${review.accountLast4}` : maskAccount(review.accountLast4)}
						</span>
						<button
							type="button"
							onClick={() => setRevealed((r) => !r)}
							className="focus-ring inline-flex items-center gap-1 rounded text-xs font-medium hover:text-foreground"
						>
							{revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
							{revealed ? "Hide" : "Reveal for review"}
						</button>
					</div>

					<p className="text-sm">
						<span className="text-muted-foreground">Holder: </span>
						<span className="font-medium">{review.holderName}</span>
					</p>

					{review.isChange && review.previousLast4 && (
						<p className="text-xs text-warning">
							Replaces a previously verified account ending {review.previousLast4}.
						</p>
					)}

					{review.note && (
						<p className="text-xs text-muted-foreground">{review.note}</p>
					)}

					<p className="text-xs text-muted-foreground">
						Submitted {dateTime(review.submittedAt)}
						{review.reviewedBy &&
							review.reviewedAt &&
							` · decided by ${review.reviewedBy}, ${dateTime(review.reviewedAt)}`}
					</p>
				</div>

				{pending && (
					<div className="flex shrink-0 gap-2">
						<PermissionGate permission="settlement.account.review">
							<Button variant="outline" size="sm" onClick={() => setRejecting(true)}>
								<X />
								Reject
							</Button>
						</PermissionGate>
						<PermissionGate permission="settlement.account.review">
							<Button size="sm" onClick={() => setApproving(true)}>
								<Check />
								Approve
							</Button>
						</PermissionGate>
					</div>
				)}
			</div>

			<ConfirmAction
				open={approving}
				onOpenChange={setApproving}
				title="Approve settlement destination"
				summary="Confirm this account is the merchant's and may receive Angkoro payouts."
				target={`${target} · ${review.bank} ${maskAccount(review.accountLast4)}`}
				effects={[
					"Payouts to this store may be sent to this destination.",
					review.settlementId
						? `Only linked payout ${review.settlementId} is released for manual transfer.`
						: "No existing payout is unblocked because none is linked to this review.",
					"The approval, your name, and the time are preserved in the account history.",
				]}
				doesNotAffect={["Any payout already completed to a previous destination."]}
				confirmLabel="Approve destination"
				tone="caution"
				onConfirm={(reason) => {
					const ok = decideAccountReview(review.id, "Approved", reason, operator.name, role)
					if (ok) {
						notify.recorded("Destination approved", target)
					}
					return ok
				}}
			/>

			<ConfirmAction
				open={rejecting}
				onOpenChange={setRejecting}
				title="Reject settlement destination"
				summary="Refuse this account as a payout destination and tell the merchant why."
				target={`${target} · ${review.bank} ${maskAccount(review.accountLast4)}`}
				effects={[
					"No payout will be sent to this destination.",
					"Payouts to this store stay blocked until an acceptable account is submitted.",
					"The merchant is asked to submit a corrected account.",
				]}
				confirmLabel="Reject destination"
				tone="danger"
				onConfirm={(reason) => {
					const ok = decideAccountReview(review.id, "Rejected", reason, operator.name, role)
					if (ok) {
						notify.recorded("Destination rejected", target)
					}
					return ok
				}}
			/>
		</li>
	)
}
