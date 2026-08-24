"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"

import { dateTime, maskAccount, money } from "@/lib/format"
import { useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, History, Panel, RecordLayout } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { SettlementActions } from "./settlement-actions"


/** Settlement record — PRD R5.5, R5.6, R5.8. */
export default function SettlementRecordPage({
	params,
}: {
	params: Promise<{ settlementId: string }>
}) {
	const { settlementId } = use(params)
	const mock = useMockState()
	const settlement = mock.settlements.find((entry) => entry.id === settlementId)
	if (!settlement) notFound()

	return (
		<div className="space-y-5">
			<PageHeader
				title={`${settlement.storeName} payout`}
				back={{ href: "/settlements", label: "All settlements" }}
				description={`Covering ${settlement.periodCovered}`}
				actions={
					<SettlementActions
						settlementId={settlement.id}
						stage={settlement.stage}
						storeName={settlement.storeName}
						amount={money(settlement.amount, settlement.currency)}
						destination={`${settlement.destinationBank} ${maskAccount(settlement.destinationLast4)}`}
					/>
				}
			>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs text-muted-foreground">{settlement.id}</span>
					<StatusBadge status={settlement.stage} />
					<span className="tnum text-sm font-bold">
						{money(settlement.amount, settlement.currency)}
					</span>
				</div>
			</PageHeader>

			{settlement.blockedReason && (
				<Callout tone="danger" title="This payout is blocked">
					<p>{settlement.blockedReason}</p>
					<Link
						href="/settlement-accounts"
						className="focus-ring mt-2 inline-block rounded text-sm font-semibold underline underline-offset-4"
					>
						Open Settlement Account Review
					</Link>
				</Callout>
			)}

			<RecordLayout
				main={
					<>
						<Panel
							title="Transfer history"
							description="Enough evidence to reconstruct this payout after the fact (R5.6)."
						>
							<History entries={settlement.history} />
						</Panel>

						{settlement.stage !== "Completed" && (
							<OpenQuestion source="§3.6 Settlement and payout operating rules">
								The payout cycle, minimum payout amount, eligibility hold period,
								and who may release a blocked transfer have not been approved. The
								stages shown here are a working shape, not a settled process.
							</OpenQuestion>
						)}
					</>
				}
				aside={
					<>
						<Panel
							title="Destination"
							description="Masked by default. Full detail is a separate authorised Finance step (R5.8)."
						>
							<FieldList
								items={[
									{ label: "Bank", value: settlement.destinationBank },
									{
										label: "Account",
										value: (
											<span className="tnum font-mono">
												{maskAccount(settlement.destinationLast4)}
											</span>
										),
									},
									{
										label: "Store",
										value: (
											<Link
												href={`/stores/${settlement.storeId}`}
												className="focus-ring rounded underline decoration-border underline-offset-4 hover:decoration-foreground"
											>
												{settlement.storeName}
											</Link>
										),
									},
									{
										label: "Merchant",
										value: (
											<Link
												href={`/users/${settlement.merchantId}`}
												className="focus-ring rounded underline decoration-border underline-offset-4 hover:decoration-foreground"
											>
												{settlement.merchantId}
											</Link>
										),
									},
								]}
							/>
						</Panel>

						<Panel title="Payout detail">
							<FieldList
								items={[
									{
										label: "Amount",
										value: (
											<span className="tnum font-bold">
												{money(settlement.amount, settlement.currency)}
											</span>
										),
									},
									{ label: "Period", value: settlement.periodCovered },
									{ label: "Prepared", value: dateTime(settlement.requestedAt) },
									{
										label: "Operator",
										value: settlement.operator ?? (
											<span className="text-muted-foreground">Not yet assigned</span>
										),
									},
									{
										label: "Bank reference",
										value: settlement.bankReference ? (
											<span className="font-mono text-xs">
												{settlement.bankReference}
											</span>
										) : (
											<span className="text-muted-foreground">
												Recorded on completion
											</span>
										),
									},
									{
										label: "Completed",
										value: settlement.completedAt ? (
											dateTime(settlement.completedAt)
										) : (
											<span className="text-muted-foreground">—</span>
										),
									},
								]}
							/>
						</Panel>
					</>
				}
			/>
		</div>
	)
}
