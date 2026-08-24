"use client"

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

import { count } from "@/lib/format"
import { PageHeader, SectionHeader } from "@/components/app/page-header"
import { Panel } from "@/components/app/record"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { Callout } from "@/components/app/callout"
import { PermissionWall } from "@/components/app/permission-gate"
import { useSession } from "@/components/app/session-provider"
import { Badge } from "@/components/ui/badge"
import { CASES, PROCESS_HEALTH, SETTLEMENTS, STORES } from "@/data/seed"

/**
 * Platform Analytics — P3, PRD R8.1, R8.2.
 *
 * R8.1 is a hard gate: "Platform Analytics shall show only measures with an
 * approved definition and a reliable data source." That rules out most of what a
 * dashboard normally reaches for.
 *
 * So this page shows a small set of *operational counts* — things Angkoro
 * records directly and can define without argument — and then lists explicitly
 * what it is NOT showing and why. The excluded list is the honest, useful part:
 * the shared source audit found the existing analytics surface aggregates a
 * partial order page in the browser, uses order-creation time for monthly
 * results, and hardcodes USD. Reproducing that here with a nicer chart library
 * would launder a known-bad number into something that looks trustworthy.
 */
export default function AnalyticsPage() {
	const { allowed } = useSession()

	if (!allowed("analytics.view")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Platform Analytics" />
				<PermissionWall permission="analytics.view" title="Platform Analytics" />
			</div>
		)
	}

	const byChannel = ["Platform report", "Telegram", "Support email", "In-app request"].map(
		(channel) => ({
			channel: channel.replace(" report", "").replace("Support ", ""),
			cases: CASES.filter((c) => c.channel === channel).length,
		}),
	)

	const activeStores = STORES.filter((s) => s.status === "Active").length
	const onboarding = STORES.filter((s) => s.status === "Onboarding").length
	const openCases = CASES.filter((c) => c.status !== "Resolved" && c.status !== "Closed").length
	const pendingPayouts = SETTLEMENTS.filter((s) => s.stage !== "Completed").length

	return (
		<div className="space-y-5">
			<PageHeader
				title="Platform Analytics"
				description="Operational counts that help Angkoro understand platform usage, support load, merchant activity, finance operations, and system issues during the pilot."
			/>

			<Callout tone="warning" title="Only approved, reliably-sourced measures appear here">
				R8.1 permits a measure only when it has an approved definition and a reliable data
				source. The counts below are records Angkoro creates directly. Anything that would
				require an unagreed rule — or that depends on the existing seller analytics
				calculations, which the source audit found unreliable — is listed as excluded rather
				than estimated.
			</Callout>

			<StatGrid>
				<StatCard
					label="Active stores"
					value={count(activeStores)}
					definition="Stores with status Active. Counted from store records, not inferred from activity."
				/>
				<StatCard
					label="Stores onboarding"
					value={count(onboarding)}
					definition="Created but not yet activated, with at least one setup step outstanding."
				/>
				<StatCard
					label="Open support cases"
					value={count(openCases)}
					definition="Cases not yet Resolved or Closed, counted at this moment."
				/>
				<StatCard
					label="Payouts in flight"
					value={count(pendingPayouts)}
					definition="Manual payouts prepared but not yet completed."
					tone={pendingPayouts > 0 ? "warn" : "neutral"}
				/>
			</StatGrid>

			<Panel
				title="Support load by intake channel"
				description="Where requests arrive from. Counted from case records — every case carries the channel it came in on (R2.2)."
			>
				<div className="h-64 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={byChannel} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
							<XAxis
								dataKey="channel"
								tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
								tickLine={false}
								axisLine={{ stroke: "var(--border)" }}
							/>
							<YAxis
								allowDecimals={false}
								tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip
								cursor={{ fill: "var(--secondary)" }}
								contentStyle={{
									background: "var(--popover)",
									border: "1px solid var(--border)",
									borderRadius: "var(--radius)",
									fontSize: 13,
								}}
							/>
							<Bar dataKey="cases" radius={[6, 6, 0, 0]} maxBarSize={64}>
								{byChannel.map((entry, index) => (
									<Cell key={entry.channel} fill={`var(--chart-${(index % 4) + 1})`} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</Panel>

			<Panel
				title="Process reliability"
				description="Failures recorded in the last 24 hours per monitored process."
				contentClassName="p-0"
			>
				<ul className="divide-y divide-border">
					{PROCESS_HEALTH.map((process) => (
						<li
							key={process.id}
							className="flex items-center justify-between gap-4 px-4 py-2.5"
						>
							<span className="min-w-0 truncate text-sm">{process.name}</span>
							<span
								className={`tnum shrink-0 text-sm font-semibold ${process.failures24h > 0 ? "text-destructive" : "text-muted-foreground"}`}
							>
								{count(process.failures24h)}
							</span>
						</li>
					))}
				</ul>
			</Panel>

			<div className="space-y-4">
				<SectionHeader
					title="Deliberately not shown"
					description="Each of these needs an approved definition or a trustworthy source before it can appear."
				/>
				<Panel title="Excluded measures" contentClassName="p-0">
					<ul className="divide-y divide-border">
						{[
							{
								measure: "Platform paid sales and orders",
								reason:
									"The existing seller analytics aggregates a partial order page in the browser, uses order-creation time for monthly results, and hardcodes USD formatting. The backend statistics endpoint needs correction before reuse.",
								blocker: "Unreliable source",
							},
							{
								measure: "Subscription MRR and churn",
								reason:
									"Requires an agreed treatment of mid-period plan changes, prepaid periods, and lapsed-then-renewed stores. No rule has been approved.",
								blocker: "Needs rule",
							},
							{
								measure: "Payment success rate",
								reason:
									"The denominator is undefined — whether abandoned checkouts, COD orders, and retried payments count is not agreed. A rate with an arguable denominator misleads more than no rate.",
								blocker: "Needs rule",
							},
							{
								measure: "Case response and resolution times",
								reason:
									"Register §3.5 marks the support case model as needing definition; first-response and resolution targets do not exist yet, so there is nothing to measure against.",
								blocker: "Needs rule",
							},
							{
								measure: "Infrastructure uptime",
								reason:
									"Already covered adequately by Uptime Kuma. Duplicating it here would create a second, likely-disagreeing number (R7.3).",
								blocker: "Out of scope",
							},
						].map((item) => (
							<li key={item.measure} className="px-4 py-3">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0 flex-1 space-y-1">
										<p className="text-sm font-semibold">{item.measure}</p>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{item.reason}
										</p>
									</div>
									<Badge variant="warning" className="shrink-0 text-[11px]">
										{item.blocker}
									</Badge>
								</div>
							</li>
						))}
					</ul>
				</Panel>
			</div>

			<Callout tone="info">
				No production values have been calculated for this prototype. Every figure above is
				counted from the prototype&rsquo;s own seed records.
			</Callout>
		</div>
	)
}
