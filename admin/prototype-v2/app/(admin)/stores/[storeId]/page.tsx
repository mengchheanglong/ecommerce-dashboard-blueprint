"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, History } from "lucide-react"

import { dateTime, longDate, money } from "@/lib/format"
import { useMockState } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, Panel, RecordLayout } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { EmptyState } from "@/components/app/empty-state"
import { Button } from "@/components/ui/button"
import { StoreControls, DirectChangeHistory } from "./store-controls"


/** Store record — PRD R3.2, R3.4, R3.6, R3.7, R3.8. */
export default function StoreRecordPage({
	params,
}: {
	params: Promise<{ storeId: string }>
}) {
	const { storeId } = use(params)
	const mock = useMockState()
	const store = mock.stores.find((entry) => entry.id === storeId)
	if (!store) notFound()

	const owner = mock.users.find((entry) => entry.id === store.ownerId)
	const cases = mock.cases.filter((entry) => entry.linked.storeId === store.id)
	const openCases = cases.filter((c) => c.status !== "Resolved" && c.status !== "Closed")
	const settlements = mock.settlements.filter((s) => s.storeId === store.id)
	const billing = mock.billing.filter((b) => b.storeId === store.id)

	return (
		<div className="space-y-5">
			<PageHeader
				title={store.name}
				back={{ href: "/stores", label: "All stores" }}
				description={`${store.subdomain}.angkoro.com · created ${longDate(store.createdAt)}`}
				actions={
					<>
						<Button variant="outline" asChild>
							<a href={`/stores/${store.id}/merchant-view`}>
								<ExternalLink />
								View as merchant
							</a>
						</Button>
						<StoreControls
							storeName={store.name}
							storeId={store.id}
							status={store.status}
						/>
					</>
				}
			>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs text-muted-foreground">{store.id}</span>
					<StatusBadge status={store.status} />
					<StatusBadge status={`${store.plan} plan`} tone="neutral" />
					{store.planState !== "Active" && <StatusBadge status={store.planState} />}
				</div>
			</PageHeader>

			{store.restriction && (
				<Callout tone="danger" title="This store is restricted">
					<p>{store.restriction.reason}</p>
					<p className="mt-1.5 text-xs text-muted-foreground">
						Applied by {store.restriction.appliedBy} ·{" "}
						{dateTime(store.restriction.appliedAt)}
					</p>
				</Callout>
			)}

			{store.onboarding && (
				<Callout tone="warning" title="Onboarding is not complete">
					<p>
						Step {store.onboarding.completed} of {store.onboarding.total} —{" "}
						{store.onboarding.step}
					</p>
				</Callout>
			)}

			<RecordLayout
				main={
					<>
						<Panel
							title="Support history"
							description="Every case linked to this store."
							contentClassName="p-0"
						>
							{cases.length === 0 ? (
								<EmptyState title="No support cases for this store" compact />
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
													<p className="truncate text-sm font-medium">
														{entry.subject}
													</p>
												</div>
											</Link>
										</li>
									))}
								</ul>
							)}
						</Panel>

						<Panel
							title="Finance"
							description="Payouts Angkoro owes this store, and its own plan payments. The two are separate."
							contentClassName="p-0"
						>
							<div className="divide-y divide-border">
								<div className="px-4 py-3">
									<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
										Merchant settlements
									</p>
									{settlements.length === 0 ? (
										<p className="mt-2 text-sm text-muted-foreground">
											No payouts recorded for this store.
										</p>
									) : (
										<ul className="mt-2 space-y-1.5">
											{settlements.map((settlement) => (
												<li key={settlement.id}>
													<Link
														href={`/settlements/${settlement.id}`}
														className="focus-ring flex items-center justify-between gap-3 rounded-md border border-border px-2.5 py-2 transition-colors hover:border-ring/40 hover:bg-secondary/50"
													>
														<span className="flex items-center gap-2">
															<span className="font-mono text-xs text-muted-foreground">
																{settlement.id}
															</span>
															<StatusBadge status={settlement.stage} />
														</span>
														<span className="tnum text-sm font-semibold">
															{money(settlement.amount, settlement.currency)}
														</span>
													</Link>
												</li>
											))}
										</ul>
									)}
								</div>

								<div className="px-4 py-3">
									<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
										Store plan payments
									</p>
									{billing.length === 0 ? (
										<p className="mt-2 text-sm text-muted-foreground">
											No plan payments recorded.
										</p>
									) : (
										<ul className="mt-2 space-y-1.5">
											{billing.map((bill) => (
												<li
													key={bill.id}
													className="flex items-center justify-between gap-3 rounded-md border border-border px-2.5 py-2"
												>
													<span className="flex min-w-0 items-center gap-2">
														<span className="font-mono text-xs text-muted-foreground">
															{bill.id}
														</span>
														<StatusBadge status={bill.state} />
														<span className="truncate text-sm text-muted-foreground">
															{bill.plan}
														</span>
													</span>
													<span className="tnum text-sm font-semibold">
														{money(bill.amount, bill.currency)}
													</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						</Panel>

						<Panel
						title="Direct changes (Super Admin)"
						description="Changes made directly to this store or its merchant account — each with a stated reason and merchant consent (R3.9)."
						contentClassName="p-0"
					>
						<DirectChangeHistory storeId={store.id} />
					</Panel>

					<OpenQuestion source="§3.2 Restriction rules">
							What a store restriction actually blocks — storefront visibility,
							checkout, merchant sign-in, or all three — along with its allowed
							grounds, duration, merchant notice, appeal path, and restoration rule,
							has not been approved. The controls above are shaped correctly but the
							exact effects are not settled.
						</OpenQuestion>
					</>
				}
				aside={
					<>
						<Panel title="Ownership and access">
							<FieldList
								items={[
									{
										label: "Owner",
										value: owner ? (
											<Link
												href={`/users/${owner.id}`}
												className="focus-ring rounded underline decoration-border underline-offset-4 hover:decoration-foreground"
											>
												{owner.name}
											</Link>
										) : (
											store.owner
										),
									},
									{ label: "Owner account", value: store.ownerId },
									{ label: "Subdomain", value: `${store.subdomain}.angkoro.com` },
									{ label: "Created", value: longDate(store.createdAt) },
									{ label: "Last active", value: dateTime(store.lastActiveAt) },
								]}
							/>
						</Panel>

						<Panel
							title="Plan and billing"
							description="Billing state is tracked separately from restriction state (R3.8)."
						>
							<FieldList
								items={[
									{ label: "Plan", value: store.plan },
									{
										label: "Plan state",
										value: <StatusBadge status={store.planState} />,
									},
									{ label: "Currency", value: store.currency },
									{
										label: "Paid volume",
										value:
											store.paidVolume > 0
												? money(store.paidVolume, store.currency)
												: "—",
										hint: "Merchant commerce recorded by Angkoro — not Angkoro revenue.",
									},
								]}
							/>
						</Panel>

						<Panel title="At a glance">
							<FieldList
								items={[
									{ label: "Open cases", value: String(openCases.length) },
									{ label: "Total cases", value: String(cases.length) },
									{ label: "Payouts", value: String(settlements.length) },
								]}
							/>
						</Panel>
					</>
				}
			/>
		</div>
	)
}
