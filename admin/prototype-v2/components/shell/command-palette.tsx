"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { CornerDownLeft, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { can } from "@/lib/permissions"
import { NAV_ITEMS } from "@/config/navigation"
import { useSession } from "@/components/app/session-provider"
import { CASES, SETTLEMENTS, STORES, USERS } from "@/data/seed"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

/**
 * Global Search — PRD R1.9, R1.10.
 *
 * Two requirements shape this component:
 *
 * - **R1.9** results are found by *human-readable identifier* and return only
 *   what the operator may access. The permission filter below is the prototype
 *   stand-in; production filters server-side so a forbidden record is never
 *   sent to the browser in the first place.
 * - **R1.10** selecting a result opens the record in the feature that owns it —
 *   never in a generic viewer. Every entry therefore carries its owning route.
 */

type Result = {
	id: string
	title: string
	subtitle: string
	group: string
	href: string
	/** Result is only offered when the role holds this. */
	permission?: Parameters<typeof can>[1]
}

export function CommandPalette({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const router = useRouter()
	const { role } = useSession()
	const [query, setQuery] = useState("")

	const results = useMemo<Result[]>(() => {
		const sections: Result[] = []

		for (const item of NAV_ITEMS) {
			sections.push({
				id: `nav-${item.href}`,
				title: item.title,
				subtitle: item.description,
				group: "Go to",
				href: item.href,
				permission: item.permission,
			})
		}

		for (const store of STORES) {
			sections.push({
				id: store.id,
				title: store.name,
				subtitle: `${store.id} · ${store.owner} · ${store.status}`,
				group: "Stores",
				href: `/stores/${store.id}`,
				permission: "store.view",
			})
		}

		for (const user of USERS) {
			sections.push({
				id: user.id,
				title: user.name,
				subtitle: `${user.id} · ${user.kinds.join(", ")} · ${user.email}`,
				group: "Users",
				href: `/users/${user.id}`,
				permission: "user.view",
			})
		}

		for (const entry of CASES) {
			sections.push({
				id: entry.id,
				title: entry.subject,
				subtitle: `${entry.id} · ${entry.channel} · ${entry.status}`,
				group: "Support cases",
				href: `/support/${entry.id}`,
				permission: "case.manage",
			})
		}

		for (const settlement of SETTLEMENTS) {
			sections.push({
				id: settlement.id,
				title: `${settlement.storeName} payout`,
				subtitle: `${settlement.id} · ${settlement.stage}`,
				group: "Settlements",
				href: `/settlements/${settlement.id}`,
				permission: "settlement.view",
			})
		}

		// R1.9 — only results the operator may access.
		return sections.filter((result) => !result.permission || can(role, result.permission))
	}, [role])

	const go = useCallback(
		(href: string) => {
			onOpenChange(false)
			setQuery("")
			router.push(href)
		},
		[onOpenChange, router],
	)

	const groups = useMemo(() => {
		const order = ["Go to", "Stores", "Users", "Support cases", "Settlements"]
		return order
			.map((name) => ({ name, items: results.filter((r) => r.group === name) }))
			.filter((group) => group.items.length > 0)
	}, [results])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">Search Angkoro admin</DialogTitle>

				<Command
					loop
					className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground/70"
				>
					<div className="flex items-center gap-2.5 border-b border-border px-3.5">
						<Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
						<Command.Input
							value={query}
							onValueChange={setQuery}
							placeholder="Search stores, users, cases, settlements, or a section"
							className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
						/>
						<kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
							ESC
						</kbd>
					</div>

					<Command.List className="max-h-[22rem] overflow-y-auto p-2">
						<Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
							Nothing matches that. Try a store name, a case number, or a user email.
						</Command.Empty>

						{groups.map((group) => (
							<Command.Group key={group.name} heading={group.name}>
								{group.items.map((result) => (
									<Command.Item
										key={result.id}
										value={`${result.title} ${result.subtitle}`}
										onSelect={() => go(result.href)}
										className={cn(
											"group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm",
											"data-[selected=true]:bg-secondary",
										)}
									>
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium">{result.title}</p>
											<p className="truncate text-xs text-muted-foreground">
												{result.subtitle}
											</p>
										</div>
										<CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100" />
									</Command.Item>
								))}
							</Command.Group>
						))}
					</Command.List>
				</Command>
			</DialogContent>
		</Dialog>
	)
}

/** Ctrl/⌘-K and "/" open the palette from anywhere. */
export function useCommandPalette() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			const target = event.target as HTMLElement | null
			const typing =
				target?.tagName === "INPUT" ||
				target?.tagName === "TEXTAREA" ||
				target?.isContentEditable

			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault()
				setOpen((current) => !current)
				return
			}
			if (event.key === "/" && !typing) {
				event.preventDefault()
				setOpen(true)
			}
		}

		document.addEventListener("keydown", onKeyDown)
		return () => document.removeEventListener("keydown", onKeyDown)
	}, [])

	return { open, setOpen }
}
