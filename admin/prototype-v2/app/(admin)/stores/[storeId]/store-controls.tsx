"use client"

import { useState } from "react"
import { Ban, FileEdit, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmAction } from "@/components/app/confirm-action"
import { PermissionGate } from "@/components/app/permission-gate"
import { EmptyState } from "@/components/app/empty-state"
import { notify, useSession } from "@/components/app/session-provider"
import { useMockState, setStoreStatus, directStoreChange } from "@/lib/mock-store"
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
import { Textarea } from "@/components/ui/textarea"
import type { StoreStatus } from "@/data/seed"

/**
 * Store controls — PRD R3.11 (suspend/restore) and R3.9/R3.10 (direct change).
 *
 * R3.13 is the one worth reading twice: restricting one record must not
 * silently restrict another. Suspending a store does **not** touch the merchant
 * account, and the dialog says so explicitly under "What this does not do".
 *
 * The direct-change flow (R3.9) is separate: Super Admin only, requires a
 * stated reason AND proven merchant consent, and never requires a support
 * case (R3.10).
 */
export function StoreControls({
	storeName,
	storeId,
	status,
}: {
	storeName: string
	storeId: string
	status: StoreStatus
}) {
	const [suspending, setSuspending] = useState(false)
	const [restoring, setRestoring] = useState(false)
	const [changing, setChanging] = useState(false)
	const [form, setForm] = useState({ change: "", consent: "", reason: "" })

	const { role, operator } = useSession()

	const restricted = status === "Suspended" || status === "Restricted"
	const target = `${storeId} · ${storeName}`

	const formValid =
		form.change.trim().length >= 3 && form.consent.trim().length >= 3 && form.reason.trim().length >= 3

	function submitDirectChange() {
		if (!formValid) return
		directStoreChange(storeId, form.change.trim(), form.consent.trim(), form.reason.trim(), operator.name, role)
		notify.recorded("Direct change recorded", `${target} · consent + reason written to audit history.`)
		setChanging(false)
		setForm({ change: "", consent: "", reason: "" })
	}

	return (
		<>
			{/* R3.9 — direct change with consent */}
			<PermissionGate permission="store.directchange">
				<Button variant="outline" onClick={() => setChanging(true)}>
					<FileEdit />
					Direct change
				</Button>
			</PermissionGate>

			{restricted ? (
				<PermissionGate permission="store.restrict">
					<Button variant="outline" onClick={() => setRestoring(true)}>
						<RotateCcw />
						Restore store
					</Button>
				</PermissionGate>
			) : (
				<PermissionGate permission="store.restrict">
					<Button variant="destructive-outline" onClick={() => setSuspending(true)}>
						<Ban />
						Suspend store
					</Button>
				</PermissionGate>
			)}

			<ConfirmAction
				open={suspending}
				onOpenChange={setSuspending}
				title="Suspend store"
				summary="Angkoro suspends a store only for an approved platform reason, never to settle an ordinary buyer–merchant dispute."
				target={target}
				effects={[
					"The storefront stops accepting new orders.",
					"The merchant is notified that Angkoro has restricted the store.",
					"Your name, the reason, and the time are written to the protected audit history.",
				]}
				doesNotAffect={[
					"The merchant's account — restricting it is a separate authorised action (R3.13).",
					"Other stores owned by the same merchant.",
					"The store's plan or billing state, which is tracked separately (R3.14).",
					"Existing paid orders, which remain the merchant's to fulfil.",
				]}
				confirmLabel="Suspend store"
				tone="danger"
				onConfirm={(reason) => {
					const ok = setStoreStatus(storeId, "Suspended", reason, operator.name, role)
					if (ok) notify.recorded("Store suspended", `${target} · merchant notified.`)
					return ok
				}}
			/>

			<ConfirmAction
				open={restoring}
				onOpenChange={setRestoring}
				title="Restore store"
				summary="Lift the Angkoro restriction and return the store to normal operation."
				target={target}
				effects={[
					"The storefront resumes accepting orders.",
					"The merchant is notified that the restriction has been lifted.",
					"The restoration and its reason are written to the audit history.",
				]}
				doesNotAffect={[
					"Any separate restriction on the merchant account, which must be lifted on its own.",
					"Plan or billing state.",
				]}
				confirmLabel="Restore store"
				tone="caution"
				onConfirm={(reason) => {
					const ok = setStoreStatus(storeId, "Active", reason, operator.name, role)
					if (ok) notify.recorded("Store restored", target)
					return ok
				}}
			/>

			{/* R3.9 — direct change dialog */}
			<Dialog open={changing} onOpenChange={setChanging}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Direct change to store/merchant account</DialogTitle>
						<DialogDescription>
							A direct change never requires an existing support case (R3.10), but it does
							require a stated reason <strong>and proven merchant consent</strong>. Both are
							written to the protected audit history with your name.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="dc-change">
								What changes <span className="text-destructive">*</span>
							</Label>
							<Input
								id="dc-change"
								value={form.change}
								onChange={(e) => setForm({ ...form, change: e.target.value })}
								placeholder="e.g. Update payout contact email to ops@…"
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="dc-consent">
								Merchant consent — how was it proven? <span className="text-destructive">*</span>
							</Label>
							<Input
								id="dc-consent"
								value={form.consent}
								onChange={(e) => setForm({ ...form, consent: e.target.value })}
								placeholder="e.g. Merchant reply on support email thread, 19 Aug 09:18"
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="dc-reason">
								Reason <span className="text-destructive">*</span>
							</Label>
							<Textarea
								id="dc-reason"
								value={form.reason}
								onChange={(e) => setForm({ ...form, reason: e.target.value })}
								placeholder="Why this change is needed for an approved Angkoro platform reason."
								rows={3}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setChanging(false)}>
							Cancel
						</Button>
						<Button disabled={!formValid} onClick={submitDirectChange}>
							Record direct change
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

/** The store's recorded direct-change history (R3.9/R3.10). */
export function DirectChangeHistory({ storeId }: { storeId: string }) {
	const mock = useMockState()
	const store = mock.stores.find((s) => s.id === storeId)
	const changes = store?.directChanges ?? []

	if (changes.length === 0) {
		return (
			<div className="p-4">
				<EmptyState
					title="No direct changes recorded"
					description="Super Admin direct changes appear here with their consent evidence and reason."
					compact
				/>
			</div>
		)
	}

	return (
		<ul className="divide-y divide-border">
			{changes.map((entry) => (
				<li key={`${entry.at}-${entry.change}`} className="px-4 py-3">
					<p className="text-sm font-medium">{entry.change}</p>
					<p className="mt-1 text-xs text-muted-foreground">{entry.reason}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Merchant consent: {entry.consent} · by {entry.by} · {entry.at}
					</p>
				</li>
			))}
		</ul>
	)
}
