import { Inbox, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Empty state.
 *
 * An empty queue is usually good news in an admin system — "nothing waiting"
 * is a result, not a failure. The default copy therefore stays neutral and the
 * caller supplies the reassuring line where one is warranted.
 *
 * Visual language matches Angkoro-Frontend's `EmptyState`: accent-tinted icon
 * chip on a dashed border card, bold title, muted description.
 */
export function EmptyState({
	title,
	description,
	icon: Icon = Inbox,
	action,
	compact = false,
	className,
}: {
	title: string
	description?: string
	icon?: LucideIcon
	action?: React.ReactNode
	/** Inside a table cell, where the surrounding card already provides a border. */
	compact?: boolean
	className?: string
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center text-center",
				compact ? "px-6 py-12" : "rounded-xl border-[1.5px] border-dashed border-border bg-card/50 px-6 py-14",
				className,
			)}
		>
			<span className="flex size-11 items-center justify-center rounded-xl bg-accent/15">
				<Icon className="size-5 text-accent" aria-hidden="true" />
			</span>
			<h3 className="mt-3.5 text-[15px] font-bold text-foreground">{title}</h3>
			{description && (
				<p className="mt-1 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
					{description}
				</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	)
}
