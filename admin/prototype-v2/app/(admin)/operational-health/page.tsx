"use client"

import { useState } from "react"
import Link from "next/link"
import { RefreshCw } from "lucide-react"

import { ago, count } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { Panel } from "@/components/app/record"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, retryProcess } from "@/lib/mock-store"
import { Button } from "@/components/ui/button"
import type { ProcessHealth } from "@/data/seed"

/**
 * Operational Health and Background Processing — P2, PRD R7.
 *
 * R7.3 shapes this page more than anything else: infrastructure health already
 * covered by Uptime Kuma is **not** duplicated here. There is no CPU graph, no
 * uptime percentage, no database connection count.
 *
 * What belongs here is the class of failure Uptime Kuma cannot see — the API is
 * up, the database is fine, and yet order confirmations are not reaching
 * shoppers because a queue worker is failing. The backend audit (Register §5.1)
 * establishes why: every cron, BullMQ processor, and the outbox relay run in the
 * `worker` container, which binds no port and therefore cannot be reached by an
 * HTTP uptime check at all.
 */
export default function OperationalHealthPage() {
	const [retrying, setRetrying] = useState<ProcessHealth | null>(null)
	const { role, operator } = useSession()
	const mock = useMockState()

	const failed = mock.processHealth.filter((p) => p.state === "Failed")
	const degraded = mock.processHealth.filter((p) => p.state === "Degraded")
	const totalFailures = mock.processHealth.reduce((sum, p) => sum + p.failures24h, 0)

	return (
		<div className="space-y-5">
			<PageHeader
				title="Operational Health and Background Processing"
				description="Background and business-process failures that need staff attention — the ones that happen while the API and database still look perfectly healthy."
			/>

			<StatGrid columns={3}>
				<StatCard
					label="Failing processes"
					value={String(failed.length)}
					definition="Processes not completing their work at all"
					tone={failed.length > 0 ? "bad" : "neutral"}
				/>
				<StatCard
					label="Degraded processes"
					value={String(degraded.length)}
					definition="Running, but producing incorrect or incomplete results"
					tone={degraded.length > 0 ? "warn" : "neutral"}
				/>
				<StatCard
					label="Failures in 24 hours"
					value={count(totalFailures)}
					definition="Individual failed operations across all monitored processes"
					tone={totalFailures > 0 ? "warn" : "neutral"}
				/>
			</StatGrid>

			<Callout tone="info" title="Uptime Kuma is not duplicated here">
				Infrastructure uptime and alerting stay in Uptime Kuma and Slack (R7.3). This page
				covers what those tools structurally cannot see: the backend runs its crons, queue
				workers, and outbox relay in a worker process that binds no port, so an HTTP uptime
				check never touches them.
			</Callout>

			<Panel
				title="Monitored processes"
				description="Critical scheduled and background work where silent failure would affect Angkoro operations (R7.4)."
				contentClassName="p-0"
			>
				<ul className="divide-y divide-border">
					{mock.processHealth.map((process) => (
						<li key={process.id} className="px-4 py-3.5">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0 flex-1 space-y-1.5">
									<div className="flex flex-wrap items-center gap-2">
										<StatusBadge status={process.state} />
										<p className="text-sm font-semibold">{process.name}</p>
										<span className="text-xs text-muted-foreground">
											{process.kind}
										</span>
									</div>

									<p className="text-sm leading-relaxed text-muted-foreground">
										{process.detail}
									</p>

									<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
										<span>Last run {ago(process.lastRunAt)}</span>
										{process.failures24h > 0 && (
											<span className="font-semibold text-destructive">
												{count(process.failures24h)} failure
												{process.failures24h === 1 ? "" : "s"} in 24h
											</span>
										)}
										{process.caseId && (
											<Link
												href={`/support/${process.caseId}`}
												className="focus-ring rounded font-mono underline decoration-border underline-offset-4"
											>
												{process.caseId}
											</Link>
										)}
									</div>
								</div>

								{process.state !== "Healthy" && (
									<div className="shrink-0">
										{process.retryable ? (
											<PermissionGate permission="health.retry">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setRetrying(process)}
												>
													<RefreshCw />
													Retry
												</Button>
											</PermissionGate>
										) : (
											<span className="text-xs text-muted-foreground">
												Retry not safe here
											</span>
										)}
									</div>
								)}
							</div>
						</li>
					))}
				</ul>
			</Panel>

			<Callout tone="warning" title="Retry is not offered everywhere">
				A retry appears only where it is approved and safe for that specific process (R7.6).
				Re-running a job that already partly succeeded can double-charge, double-notify, or
				double-ship — so processes without a proven idempotent retry show no button at all,
				and the failure is escalated to the development team instead.
			</Callout>

			<OpenQuestion source="§5.2 Monitoring register">
				Which processes must be monitored, what threshold makes each one &ldquo;failing&rdquo;
				rather than merely slow, who is alerted, and which retries are provably safe, have
				not been agreed. The five processes above are drawn from the backend audit as
				candidates, not from an approved monitoring register.
			</OpenQuestion>

			<ConfirmAction
				open={retrying !== null}
				onOpenChange={(open) => !open && setRetrying(null)}
				title="Retry failed operations"
				summary="Re-run the failed operations for this process."
				target={retrying ? `${retrying.id} · ${retrying.name}` : ""}
				effects={[
					`Retries the ${retrying?.failures24h ?? 0} failed operation${retrying?.failures24h === 1 ? "" : "s"} recorded in the last 24 hours.`,
					"Operations that already succeeded are not repeated.",
					"The retry, its result, and your name are recorded.",
				]}
				doesNotAffect={[
					"Any order, payment, or shopper record beyond re-attempting the failed step.",
					"The underlying fault — if the cause persists, the retry will fail again.",
				]}
				confirmLabel="Retry operations"
				tone="caution"
				onConfirm={(reason) => {
					if (retrying) retryProcess(retrying.id, operator.name, role)
					notify.recorded("Retry succeeded", retrying ? retrying.name : undefined)
				}}
			/>
		</div>
	)
}
