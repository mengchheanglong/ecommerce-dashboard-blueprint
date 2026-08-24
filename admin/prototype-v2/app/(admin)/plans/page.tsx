"use client"

import { useState } from "react"
import { Power, SquarePen } from "lucide-react"

import { money } from "@/lib/format"
import { useMockState, togglePlanActive, updatePlan } from "@/lib/mock-store"
import { PageHeader } from "@/components/app/page-header"
import { Panel } from "@/components/app/record"
import { StatusBadge } from "@/components/app/status-badge"
import { Callout, OpenQuestion } from "@/components/app/callout"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate, PermissionWall } from "@/components/app/permission-gate"
import { notify, useSession } from "@/components/app/session-provider"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Plan } from "@/data/seed"

/**
 * Plans and Subscription Entitlements — P2, PRD R5.10–R5.15.
 *
 * R5.14 is the requirement with teeth: before a plan change is applied, its
 * intended effect on *existing and future* subscriptions must be clear enough
 * for the operator to review. A price or limit edit is not a settings change —
 * it can strand a merchant above a limit they already use. The confirm dialog
 * therefore states subscriber impact explicitly.
 */
export default function PlansPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const [deactivating, setDeactivating] = useState<Plan | null>(null)
	const [editing, setEditing] = useState<Plan | null>(null)
	const [newPrice, setNewPrice] = useState("")

	if (!allowed("plan.view")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Plans & Entitlements" />
				<PermissionWall permission="plan.view" title="Plans & Entitlements" />
			</div>
		)
	}

	return (
		<div className="space-y-5">
			<PageHeader
				title="Plans & Entitlements"
				description="The plans Angkoro sells: prices, billing periods, activation, and the capabilities and usage limits each one includes."
			/>

			<Callout tone="warning" title="A plan change reaches live merchants">
				Changing a price, period, or limit affects existing subscriptions as well as new
				ones. The effect must be reviewable before it is applied (R5.14), and every change
				is permission-controlled and auditable (R5.15).
			</Callout>

			<div className="grid gap-4 lg:grid-cols-3">
				{mock.plans.map((plan) => (
					<Panel
						key={plan.id}
						title={plan.name}
						description={`${plan.subscribers} active subscriber${plan.subscribers === 1 ? "" : "s"}`}
						actions={
							<StatusBadge
								status={plan.active ? "Active" : "Disabled"}
								tone={plan.active ? "good" : "neutral"}
							/>
						}
					>
						<div className="space-y-4">
							<div className="flex items-baseline gap-1.5">
								<span className="tnum text-2xl font-bold tracking-tight">
									{money(plan.price, plan.currency, { cents: false })}
								</span>
								<span className="text-sm text-muted-foreground">
									/ {plan.period.toLowerCase().replace("ly", "")}
								</span>
							</div>

							<dl className="divide-y divide-border">
								{plan.limits.map((limit) => (
									<div key={limit.label} className="flex justify-between gap-3 py-2">
										<dt className="text-sm text-muted-foreground">{limit.label}</dt>
										<dd className="text-sm font-medium">{limit.value}</dd>
									</div>
								))}
							</dl>

							<div className="flex gap-2">
								<PermissionGate permission="plan.manage">
									<Button
										variant="outline"
										size="sm"
										className="flex-1"
										onClick={() => {
											setEditing(plan)
											setNewPrice(String(plan.price))
										}}
									>
										<SquarePen />
										Edit
									</Button>
								</PermissionGate>
								<PermissionGate permission="plan.manage">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setDeactivating(plan)}
									>
										<Power />
										{plan.active ? "Deactivate" : "Activate"}
									</Button>
								</PermissionGate>
							</div>
						</div>
					</Panel>
				))}
			</div>

			<OpenQuestion source="§3.9 Plans and entitlement change behavior">
				Whether a price change applies to existing subscribers at their next renewal or
				only to new ones, what happens to a merchant already exceeding a newly-lowered
				limit, and how much notice a merchant receives, have not been approved.
			</OpenQuestion>

			<ConfirmAction
				open={deactivating !== null}
				onOpenChange={(open) => !open && setDeactivating(null)}
				title={deactivating?.active ? "Deactivate plan" : "Activate plan"}
				summary={
					deactivating?.active
						? "Stop offering this plan to new subscribers."
						: "Offer this plan to new subscribers again."
				}
				target={deactivating ? `${deactivating.id} · ${deactivating.name}` : ""}
				effects={
					deactivating?.active
						? [
								"New stores can no longer choose this plan.",
								`The ${deactivating.subscribers} store${deactivating.subscribers === 1 ? "" : "s"} already on it keep their current access and price.`,
								"The change and your reason are recorded in the audit history.",
							]
						: ["New stores may choose this plan again.", "The change is recorded."]
				}
				doesNotAffect={
					deactivating?.active
						? [
								"Existing subscriptions, which continue until the merchant changes plan.",
								"Billing already invoiced or collected.",
							]
						: undefined
				}
				confirmLabel={deactivating?.active ? "Deactivate plan" : "Activate plan"}
				tone="caution"
				onConfirm={(reason) => {
					if (!deactivating) return
					const ok = togglePlanActive(deactivating.id, reason, operator.name, role)
					if (ok) {
						notify.recorded(
							deactivating.active ? "Plan deactivated" : "Plan activated",
							deactivating.name,
						)
					}
					return ok
				}}
				/>

				<Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit plan price</DialogTitle>
						<DialogDescription>
							R5.14 — review the effect on existing subscribers before applying. Existing
							subscribers keep their current price until renewal; the new price applies at
							their next billing period.
						</DialogDescription>
					</DialogHeader>

					{editing && (
						<div className="space-y-4">
							<dl className="divide-y divide-border rounded-lg border border-border bg-secondary/40 px-3.5 text-sm">
								<div className="flex justify-between py-2">
									<dt className="text-muted-foreground">Plan</dt>
									<dd className="font-medium">{editing.name}</dd>
								</div>
								<div className="flex justify-between py-2">
									<dt className="text-muted-foreground">Current price</dt>
									<dd className="tnum font-medium">
										{money(editing.price, editing.currency, { cents: false })}
									</dd>
								</div>
								<div className="flex justify-between py-2">
									<dt className="text-muted-foreground">Existing subscribers affected</dt>
									<dd className="tnum font-semibold">{editing.subscribers}</dd>
								</div>
							</dl>

							<div className="space-y-1.5">
								<Label htmlFor="plan-price">New monthly price (USD)</Label>
								<Input
									id="plan-price"
									type="number"
									min={0}
									value={newPrice}
									onChange={(e) => setNewPrice(e.target.value)}
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setEditing(null)}>
							Cancel
						</Button>
						<Button
							disabled={
								!newPrice || Number.isNaN(Number(newPrice)) || Number(newPrice) < 0 ||
								(editing ? Number(newPrice) === editing.price : true)
							}
							onClick={() => {
								if (!editing) return
								const ok = updatePlan(
									editing.id,
									{ price: Number(newPrice) },
									`Price changed from $${editing.price} to $${newPrice}`,
									operator.name,
									role,
								)
								if (ok) {
									notify.recorded("Plan price updated", `${editing.name} · applies at next renewal`)
									setEditing(null)
								}
							}}
						>
							Apply change
						</Button>
					</DialogFooter>
				</DialogContent>
				</Dialog>
				</div>
				)
				}
