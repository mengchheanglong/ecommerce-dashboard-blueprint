import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The header every page opens with. One component so the title, description,
 * and action slot land in the same place on every feature — operators should
 * never have to re-find the primary action per screen.
 *
 * Matches Angkoro-Frontend's `PageHeader`: bold two-step title, muted
 * description below, actions right, wrapping to stacked on narrow screens.
 */
export function PageHeader({
	title,
	description,
	actions,
	back,
	children,
	className,
}: {
	title: string
	description?: string
	actions?: React.ReactNode
	/** Record pages carry a labelled way back to their index. */
	back?: { href: string; label: string }
	/** Filters, tabs, or a segmented control sitting under the title block. */
	children?: React.ReactNode
	className?: string
}) {
	return (
		<header className={cn("space-y-4", className)}>
			{back && (
				<Link
					href={back.href}
					className="focus-ring inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="size-4" />
					{back.label}
				</Link>
			)}

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px] sm:leading-tight">
						{title}
					</h1>
					{description && (
						<p className="mt-1 max-w-3xl text-sm text-muted-foreground sm:text-base">
							{description}
						</p>
					)}
				</div>

				{actions && (
					<div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
				)}
			</div>

			{children}
		</header>
	)
}

/** Section divider inside a page — a heading with an optional right-hand slot. */
export function SectionHeader({
	title,
	description,
	actions,
	className,
}: {
	title: string
	description?: string
	actions?: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-2", className)}>
			<div className="min-w-0 space-y-0.5">
				<h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
				{description && <p className="text-sm text-muted-foreground">{description}</p>}
			</div>
			{actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
		</div>
	)
}
