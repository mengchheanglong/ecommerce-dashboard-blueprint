"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { ExternalLink } from "lucide-react"

import { dateTime, until } from "@/lib/format"
import { caseById } from "@/data/seed"
import { useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, History, Panel, RecordLayout } from "@/components/app/record"
import { PriorityChip, StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { CaseActions, CaseReplyComposer } from "./case-actions"

/**
 * Case record — PRD R2.3–R2.9.
 *
 * The linked-records panel is the mechanism behind objective O2, "one problem
 * stays connected": a specialist investigating the payment works from the same
 * case rather than opening an unrelated duplicate. Live from the mock store, so
 * replies, notes, assignment, and closure update this page immediately.
 */
export default function CaseRecordPage({
	params,
}: {
	params: Promise<{ caseId: string }>
}) {
	const { caseId } = use(params)
	const mock = useMockState()
	const record = mock.cases.find((c) => c.id === caseId) ?? caseById(caseId)
	if (!record) notFound()

	const store = record.linked.storeId ? mock.stores.find((s) => s.id === record.linked.storeId) : undefined
	const due = until(record.dueAt)
	const settled = record.status === "Resolved" || record.status === "Closed"

	return (
		<div className="space-y-5">
			<PageHeader
				title={record.subject}
				back={{ href: "/support", label: "All support cases" }}
				description={record.summary}
				actions={<CaseActions caseId={record.id} channel={record.channel} settled={settled} />}
			>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs text-muted-foreground">{record.id}</span>
					<PriorityChip priority={record.priority} />
					<StatusBadge status={record.status} />
					<StatusBadge status={record.channel} tone="neutral" />
					{!settled && (
						<span
							className={`text-xs font-medium ${due.overdue ? "text-destructive" : "text-muted-foreground"}`}
						>
							Response target {due.label}
						</span>
					)}
				</div>
			</PageHeader>

			{record.outcome === "Merchant responsibility" && (
				<Callout tone="warning" title="Closed as merchant responsibility">
					Angkoro operates the platform; the merchant owns their products, delivery,
					returns, and ordinary customer service. The reporting user was told this and
					directed back to the store (R2.9).
				</Callout>
			)}

			<RecordLayout
				main={
					<>
						<Panel
							title="Case history"
							description="Investigation, communication, decision, and closure are preserved in full (R2.8)."
						>
							<History entries={record.history} />
						</Panel>

						<Panel
							title="Reply to the reporter"
							description={
								record.channel === "Telegram" || record.channel === "Support email"
									? `Admin replies through the user's original channel (R2.6) — this case answers on ${record.channel}.`
									: "Angkoro delivers the response to the reporting user through the platform's own support experience (R2.7)."
							}
						>
							<CaseReplyComposer caseId={record.id} channel={record.channel} />
						</Panel>
					</>
				}
				aside={
					<>
						<Panel title="Reporter">
							<FieldList
								items={[
									{ label: "Name", value: record.reporter.name },
									{ label: "Type", value: record.reporter.kind },
									{ label: "Contact", value: record.reporter.contact },
									{ label: "Channel", value: record.channel },
									{ label: "Opened", value: dateTime(record.openedAt) },
								]}
							/>
						</Panel>

						<Panel
							title="Linked records"
							description="Specialist work stays attached to this case (R2.5)."
						>
							{Object.values(record.linked).filter(Boolean).length === 0 ? (
								<p className="text-sm text-muted-foreground">
									Nothing linked yet.
								</p>
							) : (
								<ul className="space-y-1.5">
									{store && (
										<LinkedRow
											label="Store"
											value={store.name}
											href={`/stores/${store.id}`}
										/>
									)}
									{record.linked.merchantId && (
										<LinkedRow
											label="Merchant"
											value={record.linked.merchantId}
											href={`/users/${record.linked.merchantId}`}
										/>
									)}
									{record.linked.orderId && (
										<LinkedRow
											label="Order"
											value={record.linked.orderId}
											href="/order-issues"
										/>
									)}
									{record.linked.paymentId && (
										<LinkedRow
											label="Payment"
											value={record.linked.paymentId}
											href="/payments"
										/>
									)}
								</ul>
							)}
						</Panel>

						<Panel title="Ownership">
							<FieldList
								items={[
									{
										label: "Assigned to",
										value: record.assignee ?? (
											<span className="font-semibold text-warning">Unassigned</span>
										),
									},
									{ label: "Last update", value: dateTime(record.lastUpdateAt) },
									{
										label: "Outcome",
										value: record.outcome ?? (
											<span className="text-muted-foreground">Not yet decided</span>
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

function LinkedRow({ label, value, href }: { label: string; value: string; href: string }) {
	return (
		<li>
			<Link
				href={href}
				className="focus-ring group flex items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2 transition-colors hover:border-ring/40 hover:bg-secondary/50"
			>
				<span className="min-w-0">
					<span className="block text-xs text-muted-foreground">{label}</span>
					<span className="block truncate text-sm font-medium">{value}</span>
				</span>
				<ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
			</Link>
		</li>
	)
}
