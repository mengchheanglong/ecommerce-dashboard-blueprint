"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { use } from "react"

import { dateTime, longDate } from "@/lib/format"
import { getUserAccesses, useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, Panel, RecordLayout } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { EmptyState } from "@/components/app/empty-state"
import { UserControls } from "./user-controls"

/** User record — PRD v5.3 §2 (Users), R3.2–R3.6. Live from the mock store. */
export default function UserRecordPage({
	params,
}: {
	params: Promise<{ userId: string }>
}) {
	const { userId } = use(params)
	const mock = useMockState()
	const user = mock.users.find((u) => u.id === userId)
	if (!user) notFound()
	const access = getUserAccesses(user)

	const stores = user.storeIds
		.map((id) => mock.stores.find((s) => s.id === id))
		.filter((s) => s !== undefined)
	const cases = mock.cases.filter(
		(entry) => entry.linked.merchantId === user.id || entry.reporter.name === user.name,
	)

	return (
		<div className="space-y-5">
			<PageHeader
				title={user.name}
				back={{ href: "/users", label: "All users" }}
				description={`${user.kinds.join(" · ")} · joined ${longDate(user.joinedAt)}`}
				actions={
					<UserControls
						userId={user.id}
						userName={user.name}
						access={access}
						activeSessions={user.activeSessions}
					/>
				}
			>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs text-muted-foreground">{user.id}</span>
					<StatusBadge status={user.status} />
				</div>
			</PageHeader>

			{access.some((entry) => entry.status !== "Active") && (
				<Callout tone="danger" title="An access type on this account is restricted or banned">
					<ul className="space-y-2">
						{access
							.filter((entry) => entry.status !== "Active")
							.map((entry) => (
								<li key={entry.kind} className="break-words [overflow-wrap:anywhere]">
									<strong>{entry.kind} access · {entry.status}:</strong>{" "}
									{entry.restriction?.reason}
									{entry.restriction && (
										<span className="mt-1 block text-xs text-muted-foreground">
											Applied by {entry.restriction.appliedBy} ·{" "}
											{dateTime(entry.restriction.appliedAt)}
										</span>
									)}
								</li>
							))}
					</ul>
				</Callout>
			)}

			<RecordLayout
				main={
					<>
						<Panel
							title="Account types"
							description="One person may hold several account kinds at the same time (R3.3). Each access type is restricted separately — restricting one never cascades to another (R3.10)."
						>
							<FieldList
								items={access.map((entry) => ({
									label: `${entry.kind} access`,
									value: <StatusBadge status={entry.status} />,
								}))}
							/>
						</Panel>

						<Panel
							title="Connected stores"
							description="Each store has its own status and its own separate restriction decision."
							contentClassName="p-0"
						>
							{stores.length === 0 ? (
								<EmptyState title="No stores connected" compact />
							) : (
								<ul className="divide-y divide-border">
									{stores.map((store) => (
										<li key={store.id}>
											<Link
												href={`/stores/${store.id}`}
												className="focus-ring flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
											>
												<div className="min-w-0 space-y-1">
													<div className="flex flex-wrap items-center gap-2">
														<span className="font-mono text-xs text-muted-foreground">
															{store.id}
														</span>
														<StatusBadge status={store.status} />
													</div>
													<p className="truncate text-sm font-medium">{store.name}</p>
												</div>
												<span className="shrink-0 text-xs text-muted-foreground">
													{store.plan}
												</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</Panel>

						<Panel title="Related support history" contentClassName="p-0">
							{cases.length === 0 ? (
								<EmptyState title="No cases linked to this account" compact />
							) : (
								<ul className="divide-y divide-border">
									{cases.map((entry) => (
										<li key={entry.id}>
											<Link
												href={`/support/${entry.id}`}
												className="focus-ring flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
											>
												<div className="min-w-0 flex-1 space-y-1">
													<div className="flex flex-wrap items-center gap-2">
														<span className="font-mono text-xs text-muted-foreground">
															{entry.id}
														</span>
														<StatusBadge status={entry.status} />
													</div>
													<p className="truncate text-sm font-medium">{entry.subject}</p>
												</div>
											</Link>
										</li>
									))}
								</ul>
							)}
						</Panel>
					</>
				}
				aside={
					<>
						<Panel title="Account">
							<FieldList
								items={[
									{ label: "Email", value: user.email },
									{ label: "Phone", value: user.phone },
									{ label: "Joined", value: longDate(user.joinedAt) },
									{ label: "Last sign-in", value: dateTime(user.lastSignInAt) },
								]}
							/>
						</Panel>

						<Panel
							title="Access"
							description="Revoking sessions signs the user out of every device."
						>
							<FieldList
								items={[
									{
										label: "Active sessions",
										value: (
											<span className="tnum font-semibold">{user.activeSessions}</span>
										),
									},
									{
										label: "Status",
										value: <StatusBadge status={user.status} />,
									},
								]}
							/>
						</Panel>

						<Callout tone="info">
							No administrator receives unrestricted merchant powers or acts silently as a
							merchant (R1.8). Assisting a merchant goes through Stores — including its
							merchant-facing view — with any direct change made by Super Admin with merchant
							consent (R3.9) and an audit trail.
						</Callout>
					</>
				}
			/>
		</div>
	)
}
