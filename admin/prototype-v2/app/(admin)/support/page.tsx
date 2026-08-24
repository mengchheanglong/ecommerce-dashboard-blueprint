"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { age, until } from "@/lib/format"
import { PageHeader } from "@/components/app/page-header"
import { DataTable, type Column } from "@/components/app/data-table"
import { PriorityChip, StatusBadge } from "@/components/app/status-badge"
import { Callout } from "@/components/app/callout"
import { PermissionWall } from "@/components/app/permission-gate"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/components/app/session-provider"
import { useMockState, createCase } from "@/lib/mock-store"
import type { SupportCase } from "@/data/seed"

/**
 * Support & Concierge — P1, PRD v5.3 R2.
 *
 * The single shared case system for merchant AND shopper support (R2.11).
 *
 * O1 in the PRD is "no Angkoro support request is lost": every platform report,
 * Telegram message, and support email becomes a trackable case. The channel
 * column is therefore never decoration — it is the evidence that intake worked,
 * and R2.2 requires the case to exist *before* Admin asks for more detail.
 */
export default function SupportPage() {
	const { allowed, operator, role } = useSession()
	const mock = useMockState()
	const cases = mock.cases
	const [creating, setCreating] = useState(false)
	// New-case form state (R2.1/R2.2 — manual intake for Telegram and email).
	const [form, setForm] = useState({
		subject: "",
		channel: "Telegram" as SupportCase["channel"],
		priority: "Normal" as SupportCase["priority"],
		reporterName: "",
		reporterKind: "Merchant" as SupportCase["reporter"]["kind"],
		summary: "",
		storeId: "",
	})
	const formValid =
		form.subject.trim().length >= 4 && form.summary.trim().length >= 8 && form.reporterName.trim().length >= 2

	function create() {
		if (!formValid) return
		createCase({
			subject: form.subject.trim(),
			channel: form.channel,
			priority: form.priority,
			reporterName: form.reporterName.trim(),
			reporterKind: form.reporterKind,
			summary: form.summary.trim(),
			storeId: form.storeId || undefined,
			operator: operator.name,
			role,
		})
		setCreating(false)
		setForm({ subject: "", channel: "Telegram", priority: "Normal", reporterName: "", reporterKind: "Merchant", summary: "", storeId: "" })
	}

	if (!allowed("case.manage")) {
		return (
			<div className="space-y-5">
				<PageHeader title="Support & Concierge" />
				<PermissionWall permission="case.manage" title="Support & Concierge" />
			</div>
		)
	}

	const columns: Column<SupportCase>[] = [
		{
			key: "id",
			header: "Case",
			width: "9rem",
			sortValue: (row) => row.id,
			cell: (row) => (
				<div className="space-y-1">
					<span className="font-mono text-xs text-muted-foreground">{row.id}</span>
					<div>
						<PriorityChip priority={row.priority} />
					</div>
				</div>
			),
		},
		{
			key: "subject",
			header: "Subject",
			sortValue: (row) => row.subject,
			cell: (row) => (
				<div className="min-w-0 space-y-0.5">
					<p className="font-medium">{row.subject}</p>
					<p className="text-xs text-muted-foreground">
						{row.reporter.name} · {row.reporter.kind}
					</p>
				</div>
			),
		},
		{
			key: "channel",
			header: "Channel",
			hideBelow: "lg",
			sortValue: (row) => row.channel,
			cell: (row) => <span className="text-sm">{row.channel}</span>,
		},
		{
			key: "status",
			header: "Status",
			sortValue: (row) => row.status,
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "assignee",
			header: "Owner",
			hideBelow: "md",
			sortValue: (row) => row.assignee ?? "",
			cell: (row) =>
				row.assignee ? (
					<span className="text-sm">{row.assignee}</span>
				) : (
					<span className="text-sm font-semibold text-warning">Unassigned</span>
				),
		},
		{
			key: "due",
			header: "Response target",
			align: "right",
			hideBelow: "sm",
			sortValue: (row) => new Date(row.dueAt).getTime(),
			cell: (row) => {
				const due = until(row.dueAt)
				if (row.status === "Resolved" || row.status === "Closed") {
					return <span className="text-sm text-muted-foreground">—</span>
				}
				return (
					<span className={`text-sm ${due.overdue ? "font-semibold text-destructive" : ""}`}>
						{due.label}
					</span>
				)
			},
		},
		{
			key: "age",
			header: "Open for",
			align: "right",
			hideBelow: "xl",
			sortValue: (row) => new Date(row.openedAt).getTime(),
			cell: (row) => <span className="text-sm text-muted-foreground">{age(row.openedAt)}</span>,
		},
	]

	return (
		<div className="space-y-5">
			<PageHeader
				title="Support & Concierge"
				description="One official place to record, assign, answer, and close platform-support cases. Specialist investigations stay linked to the case that raised them."
				actions={
					<Button onClick={() => setCreating(true)}>
						<Plus />
						Record a request
					</Button>
				}
			/>

			<Callout tone="info">
				A request arriving by Telegram or support email is recorded as a case{" "}
				<strong>before</strong> Admin asks the user for anything further, preserving the
				original message, sender, time, and channel (R2.2). Shopper cases live here too:
				a shopper issue belongs to Angkoro only when it concerns an Angkoro-controlled
				account, payment record, or technical function — otherwise it is recorded,
				explained, and directed back to the merchant (R2.9–R2.11).
			</Callout>

			<DataTable
				rows={cases}
				columns={columns}
				hrefFor={(row) => `/support/${row.id}`}
				searchIn={(row) =>
					`${row.id} ${row.subject} ${row.reporter.name} ${row.reporter.contact} ${row.channel} ${row.status}`
				}
				searchPlaceholder="Search cases, reporters, or contacts"
				initialSort={{ key: "due", direction: "asc" }}
				filters={[
					{
						key: "state",
						label: "Filter cases",
						options: [
							{
								value: "unassigned",
								label: "Unassigned",
								match: (row) => !row.assignee,
							},
							{
								value: "open",
								label: "Open",
								match: (row) => row.status !== "Resolved" && row.status !== "Closed",
							},
							{
								value: "overdue",
								label: "Past target",
								match: (row) =>
									row.status !== "Resolved" &&
									row.status !== "Closed" &&
									until(row.dueAt).overdue,
							},
						],
					},
					{
						key: "channel",
						label: "Filter channel",
						options: [
							{
								value: "report",
								label: "Platform report",
								match: (row) => row.channel === "Platform report",
							},
							{
								value: "telegram",
								label: "Telegram",
								match: (row) => row.channel === "Telegram",
							},
							{
								value: "email",
								label: "Email",
								match: (row) => row.channel === "Support email",
							},
						],
					},
				]}
				empty={{ title: "No support cases", description: "Nothing is waiting for the team." }}
			/>

			<Callout tone="warning" title="Response targets are not yet agreed">
				The &ldquo;response target&rdquo; column uses a placeholder interval. First-response
				and resolution targets per priority are still to be defined —{" "}
				<Link href="/support" className="underline">
					Internal Detail Register §3.5
				</Link>{" "}
				marks the support case model as needing definition. Do not treat these times as a
				committed service level.
			</Callout>

			<Dialog open={creating} onOpenChange={setCreating}>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Record a support request</DialogTitle>
						<DialogDescription>
							A Telegram or email request becomes a case <strong>before</strong> anything is
							asked of the user (R2.2). A platform report creates its own case automatically.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label>Channel</Label>
								<Select
									value={form.channel}
									onValueChange={(v) => setForm({ ...form, channel: v as SupportCase["channel"] })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Telegram">Telegram</SelectItem>
										<SelectItem value="Support email">Support email</SelectItem>
										<SelectItem value="Platform report">Platform report</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label>Priority</Label>
								<Select
									value={form.priority}
									onValueChange={(v) => setForm({ ...form, priority: v as SupportCase["priority"] })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Urgent">Urgent</SelectItem>
										<SelectItem value="High">High</SelectItem>
										<SelectItem value="Normal">Normal</SelectItem>
										<SelectItem value="Low">Low</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="nc-subject">
								Subject <span className="text-destructive">*</span>
							</Label>
							<Input
								id="nc-subject"
								value={form.subject}
								onChange={(e) => setForm({ ...form, subject: e.target.value })}
								placeholder="Short summary of the problem"
							/>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="nc-reporter">
									Reporter name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="nc-reporter"
									value={form.reporterName}
									onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
									placeholder="Who contacted us"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>Reporter type</Label>
								<Select
									value={form.reporterKind}
									onValueChange={(v) =>
										setForm({ ...form, reporterKind: v as SupportCase["reporter"]["kind"] })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Merchant">Merchant</SelectItem>
										<SelectItem value="Shopper">Shopper</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label>Linked store (optional)</Label>
							<Select value={form.storeId} onValueChange={(v) => setForm({ ...form, storeId: v })}>
								<SelectTrigger>
									<SelectValue placeholder="No store linked" />
								</SelectTrigger>
								<SelectContent>
									{mock.stores.map((store) => (
										<SelectItem key={store.id} value={store.id}>
											{store.name} · {store.id}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="nc-summary">
								What happened <span className="text-destructive">*</span>
							</Label>
							<Textarea
								id="nc-summary"
								rows={3}
								value={form.summary}
								onChange={(e) => setForm({ ...form, summary: e.target.value })}
								placeholder="The original message or a faithful summary, with any evidence noted."
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setCreating(false)}>
							Cancel
						</Button>
						<Button disabled={!formValid} onClick={create}>
							Create case
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
