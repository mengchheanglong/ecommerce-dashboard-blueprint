"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { age, count, money, until } from "@/lib/format"
import { useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { Panel } from "@/components/app/record"
import { Callout } from "@/components/app/callout"
import { PriorityChip, StatusBadge } from "@/components/app/status-badge"
import { EmptyState } from "@/components/app/empty-state"

/**
 * Overview — PRD R1.11.
 *
 * "Overview shall summarize work requiring attention and direct the operator to
 * the owning feature." Every number on this page is therefore a link, and
 * nothing can be actioned here: the owning feature holds the action, the
 * permission check, and the audit entry. Overview is a router, not a console.
 *
 * It is deliberately *not* an analytics dashboard. Platform Analytics (P3) is a
 * separate feature with its own approved-definition constraint (R8.1).
 */
export default function OverviewPage() {
	const mock = useMockState()

	const openCases = mock.cases.filter((c) => c.status !== "Resolved" && c.status !== "Closed")
	const unassigned = openCases.filter((c) => !c.assignee)
	const overdue = openCases.filter((c) => until(c.dueAt).overdue)

	const blockedSettlements = mock.settlements.filter((s) => s.stage === "Blocked")
	const awaitingSettlements = mock.settlements.filter((s) => s.stage === "Awaiting transfer")
	const pendingReviews = mock.accountReviews.filter((r) => r.state === "Needs review")
	const billingAttention = mock.billing.filter((b) => b.state !== "Paid")
	const openIssues = mock.orderIssues.filter((i) => i.state !== "Resolved")
	const unhealthy = mock.processHealth.filter((p) => p.state !== "Healthy")
	const awaitingApproval = mock.recovery.filter((r) => r.state === "Awaiting approval")
	const onboarding = mock.stores.filter((s) => s.status === "Onboarding")

	return (
		<div className="space-y-5">
			<PageHeader
				title="Overview"
				description="Work requiring attention right now. Every item opens in the feature that owns it — nothing is actioned from this page."
			/>

			<StatGrid>
				<StatCard
					label="Open support cases"
					value={count(openCases.length)}
					definition={`${unassigned.length} unassigned · ${overdue.length} past target response`}
					href="/support"
					tone={overdue.length > 0 ? "warn" : "neutral"}
				/>
				<StatCard
					label="Payouts needing action"
					value={count(blockedSettlements.length + awaitingSettlements.length)}
					definition={`${blockedSettlements.length} blocked · ${awaitingSettlements.length} awaiting manual transfer`}
					href="/settlements"
					tone={blockedSettlements.length > 0 ? "bad" : "neutral"}
				/>
				<StatCard
					label="Destinations to review"
					value={count(pendingReviews.length)}
					definition="Merchant payout accounts awaiting Finance approval"
					href="/settlement-accounts"
					tone={pendingReviews.length > 0 ? "warn" : "neutral"}
				/>
				<StatCard
					label="Failing processes"
					value={count(unhealthy.length)}
					definition="Background or business-process failures outside Uptime Kuma's coverage"
					href="/operational-health"
					tone={unhealthy.some((p) => p.state === "Failed") ? "bad" : "warn"}
				/>
			</StatGrid>

			<div className="grid gap-5 lg:grid-cols-2">
				<Panel
					title="Support cases needing attention"
					description="Unassigned first, then those past their target response."
					actions={<SeeAll href="/support" />}
					contentClassName="p-0"
				>
					{openCases.length === 0 ? (
						<EmptyState title="No open cases" compact />
					) : (
						<ul className="divide-y divide-border">
							{[...unassigned, ...openCases.filter((c) => c.assignee)]
								.slice(0, 4)
								.map((entry) => {
									const due = until(entry.dueAt)
									return (
										<li key={entry.id}>
											<Link
												href={`/support/${entry.id}`}
												className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
											>
												<div className="min-w-0 flex-1 space-y-1">
													<div className="flex flex-wrap items-center gap-2">
														<PriorityChip priority={entry.priority} />
														<span className="font-mono text-xs text-muted-foreground">
															{entry.id}
														</span>
														<StatusBadge status={entry.status} />
													</div>
													<p className="truncate text-sm font-medium">
														{entry.subject}
													</p>
													<p className="text-xs text-muted-foreground">
														{entry.channel} ·{" "}
														{entry.assignee ?? (
															<span className="font-semibold text-warning">
																Unassigned
															</span>
														)}{" "}
														·{" "}
														<span className={due.overdue ? "text-destructive" : ""}>
															{due.label}
														</span>
													</p>
												</div>
											</Link>
										</li>
									)
								})}
						</ul>
					)}
				</Panel>

				<Panel
					title="Money operations"
					description="Manual pilot payouts and the destination reviews that gate them."
					actions={<SeeAll href="/settlements" />}
					contentClassName="p-0"
				>
					<ul className="divide-y divide-border">
						{[...blockedSettlements, ...awaitingSettlements].map((settlement) => (
							<li key={settlement.id}>
								<Link
									href={`/settlements/${settlement.id}`}
									className="focus-ring flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{settlement.id}
											</span>
											<StatusBadge status={settlement.stage} />
										</div>
										<p className="truncate text-sm font-medium">
											{settlement.storeName}
										</p>
										{settlement.blockedReason && (
											<p className="line-clamp-2 text-xs text-muted-foreground">
												{settlement.blockedReason}
											</p>
										)}
									</div>
									<span className="tnum shrink-0 text-sm font-semibold">
										{money(settlement.amount, settlement.currency)}
									</span>
								</Link>
							</li>
						))}
						{pendingReviews.map((review) => (
							<li key={review.id}>
								<Link
									href="/settlement-accounts"
									className="focus-ring flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{review.id}
											</span>
											<StatusBadge status={review.state} />
											{review.isChange && (
												<StatusBadge status="Changed account" tone="warn" />
											)}
										</div>
										<p className="truncate text-sm font-medium">{review.storeName}</p>
										<p className="text-xs text-muted-foreground">
											Destination review · waiting {age(review.submittedAt)}
										</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Panel>

				<Panel
					title="Platform problems"
					description="Order processing faults and background failures needing staff attention."
					actions={<SeeAll href="/operational-health" />}
					contentClassName="p-0"
				>
					<ul className="divide-y divide-border">
						{unhealthy.map((process) => (
							<li key={process.id}>
								<Link
									href="/operational-health"
									className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<StatusBadge status={process.state} />
											<span className="text-xs text-muted-foreground">
												{process.kind}
											</span>
										</div>
										<p className="text-sm font-medium">{process.name}</p>
										<p className="line-clamp-2 text-xs text-muted-foreground">
											{process.detail}
										</p>
									</div>
									{process.failures24h > 0 && (
										<span className="tnum shrink-0 text-xs font-semibold text-destructive">
											{count(process.failures24h)} in 24h
										</span>
									)}
								</Link>
							</li>
						))}
						{openIssues.map((issue) => (
							<li key={issue.id}>
								<Link
									href="/order-issues"
									className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{issue.id}
											</span>
											<StatusBadge status={issue.state} />
										</div>
										<p className="text-sm font-medium">{issue.kind}</p>
										<p className="text-xs text-muted-foreground">
											{issue.storeName} · {issue.origin}
										</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Panel>

				<Panel
					title="Waiting on a decision or a merchant"
					description="Items that cannot progress without an approval or a merchant response."
					contentClassName="p-0"
				>
					<ul className="divide-y divide-border">
						{awaitingApproval.map((recovery) => (
							<li key={recovery.id}>
								<Link
									href="/account-recovery"
									className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{recovery.id}
											</span>
											<StatusBadge status={recovery.state} />
										</div>
										<p className="text-sm font-medium">{recovery.subject}</p>
										<p className="text-xs text-muted-foreground">
											{recovery.accountName} · opened {age(recovery.openedAt)} ago
										</p>
									</div>
								</Link>
							</li>
						))}
						{billingAttention.slice(0, 2).map((bill) => (
							<li key={bill.id}>
								<Link
									href="/billing"
									className="focus-ring flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{bill.id}
											</span>
											<StatusBadge status={bill.state} />
										</div>
										<p className="truncate text-sm font-medium">{bill.storeName}</p>
										<p className="text-xs text-muted-foreground">{bill.plan}</p>
									</div>
									<span className="tnum shrink-0 text-sm font-semibold">
										{money(bill.amount, bill.currency)}
									</span>
								</Link>
							</li>
						))}
						{onboarding.map((store) => (
							<li key={store.id}>
								<Link
									href={`/stores/${store.id}`}
									className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground">
												{store.id}
											</span>
											<StatusBadge status="Onboarding" />
										</div>
										<p className="truncate text-sm font-medium">{store.name}</p>
										<p className="text-xs text-muted-foreground">
											{store.onboarding?.step} · step{" "}
											{store.onboarding?.completed}/{store.onboarding?.total}
										</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Panel>
			</div>

			<Callout tone="info" title="What this page is not">
				Overview routes to work; it does not measure the platform. Operational
				measures live in Platform Analytics, which shows only figures with an
				approved definition and a reliable source (R8.1). Infrastructure uptime stays
				in Uptime Kuma and is deliberately not duplicated here (R7.3).
			</Callout>
		</div>
	)
}

function SeeAll({ href }: { href: string }) {
	return (
		<Link
			href={href}
			className="focus-ring inline-flex items-center gap-1 rounded text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
		>
			See all
			<ArrowRight className="size-3.5" />
		</Link>
	)
}
