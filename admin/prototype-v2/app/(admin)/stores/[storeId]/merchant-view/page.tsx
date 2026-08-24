"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { Eye } from "lucide-react"

import { dateTime, money } from "@/lib/format"
import { useMockState, logStoreMerchantView } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { FieldList, Panel } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { StatCard, StatGrid } from "@/components/app/stat-card"
import { EmptyState } from "@/components/app/empty-state"
import { Button } from "@/components/ui/button"
import { useSession } from "@/components/app/session-provider"

/**
 * Merchant-facing store view — PRD R3.8 (lives inside Stores per §5 STORES).
 *
 * A read-only rendering of what the merchant sees in their own dashboard:
 * configuration, orders, billing, and related staff. Everything here is built
 * from data the admin system already holds; no merchant credentials or session
 * are used (R1.8), the real administrator stays attributed, and every open of
 * these panels is written to the audit history (R3.10).
 *
 * There are no edit buttons on purpose: a change to the store/merchant account
 * is Super Admin's separate consented direct-change flow on the store record
 * (R3.9), never an in-place edit inside someone else's store.
 */
export default function StoreMerchantViewPage({
	params,
}: {
	params: Promise<{ storeId: string }>
}) {
	const { storeId } = use(params)
	const mock = useMockState()
	const { role, operator } = useSession()

	const store = mock.stores.find((s) => s.id === storeId)
	if (!store) notFound()

	const activeStore = store
	function viewed(label: string) {
		logStoreMerchantView(activeStore.id, label, operator.name, role)
	}

	const owner = mock.users.find((entry) => entry.id === store.ownerId)
	const cases = mock.cases.filter((entry) => entry.linked.storeId === store.id)
	const openCases = cases.filter((entry) => entry.status !== "Resolved" && entry.status !== "Closed")
	const settlements = mock.settlements.filter((s) => s.storeId === store.id)
	const billing = mock.billing.filter((b) => b.storeId === store.id)

	return (
		<div className="space-y-5">
			{/* R1.8/R3.10 attribution banner */}
			<Callout tone="warning" title="Merchant-facing view · attributed">
				This is a rendering of what <strong>{store.name}</strong> sees, built from data the
				admin system already holds — no merchant credentials or session are used (R1.8).
				Opening these panels records your name against each view in the audit history (R3.10).{" "}
				<Link href={`/stores/${store.id}`} className="underline">
					Back to store record
				</Link>
			</Callout>

			<PageHeader
				title={store.name}
				back={{ href: `/stores/${store.id}`, label: `${store.name} record` }}
				description={`Merchant-facing form · ${store.subdomain}.angkoro.com`}
				actions={
					<Button variant="outline" onClick={() => viewed("Viewed store configuration")}>
						<Eye />
						Log current view
					</Button>
				}
			>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-xs text-muted-foreground">{store.id}</span>
					<StatusBadge status={store.status} />
					<StatusBadge status={`${store.plan} plan`} tone="neutral" />
				</div>
			</PageHeader>

			<StatGrid columns={4}>
				<StatCard
					label="Paid volume (period)"
					value={money(store.paidVolume, store.currency, { cents: false })}
					definition="Merchant commerce recorded by Angkoro — not Angkoro revenue."
				/>
				<StatCard label="Open cases" value={String(openCases.length)} definition="Linked support cases" />
				<StatCard
					label="Onboarding"
					value={
						store.onboarding ? `${store.onboarding.completed}/${store.onboarding.total}` : "Complete"
					}
					definition={store.onboarding?.step ?? "All steps finished"}
				/>
				<StatCard label="Payouts" value={String(settlements.length)} definition="Recorded payouts" />
			</StatGrid>

			<div className="grid gap-5 lg:grid-cols-2">
				<Panel title="Store configuration" description="What the merchant set up in their own dashboard.">
					<FieldList
						items={[
							{ label: "Store name", value: store.name },
							{ label: "Subdomain", value: `${store.subdomain}.angkoro.com` },
							{ label: "Owner", value: owner?.name ?? store.owner },
							{ label: "Currency", value: store.currency },
							{ label: "Created", value: dateTime(store.createdAt) },
							{ label: "Last active", value: dateTime(store.lastActiveAt) },
						]}
					/>
				</Panel>

				<div className="space-y-5">
					<Panel
						title="Recent orders"
						description="The merchant's own order list, as they see it."
						contentClassName="p-0"
					>
						<EmptyState
							title="Order history is illustrative here"
							description="Production renders the platform's real order feed. This prototype demonstrates the read-only boundary."
							compact
						/>
					</Panel>

					<Panel
						title="Billing state"
						description="Plan payments Angkoro has recorded for this store."
					>
						<FieldList
							items={[
								{ label: "Plan", value: store.plan },
								{
									label: "Payment state",
									value: <StatusBadge status={store.planState} />,
								},
								{
									label: "Billing history",
									value: `${billing.length} ${billing.length === 1 ? "record" : "records"}`,
								},
							]}
						/>
					</Panel>
				</div>
			</div>

			<Callout tone="info" title="Why there are no edit buttons here">
				R3.9 — changes to a store or its merchant account are made by Super Admin as a{" "}
				<strong>direct change with stated reason and merchant consent</strong>, recorded in the
				audit history, from the store record page. They never happen silently inside this view.
			</Callout>
		</div>
	)
}
