import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Record-page furniture — the two-column layout, the labelled field list, and
 * the event history. Every record page (store, settlement, case, recovery) uses
 * these so an operator learns one shape and reads all of them.
 */

/** Main column plus a sticky aside for context that stays visible while scrolling. */
export function RecordLayout({
	main,
	aside,
	className,
}: {
	main: React.ReactNode
	aside: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]", className)}>
			<div className="min-w-0 space-y-5">{main}</div>
			<aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">{aside}</aside>
		</div>
	)
}

/** A titled card. The default container for a section of a record page. */
export function Panel({
	title,
	description,
	actions,
	children,
	className,
	contentClassName,
}: {
	title: string
	description?: string
	actions?: React.ReactNode
	children: React.ReactNode
	className?: string
	contentClassName?: string
}) {
	return (
		<Card className={className}>
			<CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-4 pb-3">
				<div className="min-w-0 space-y-0.5">
					<CardTitle className="text-sm">{title}</CardTitle>
					{description && <p className="text-xs text-muted-foreground">{description}</p>}
				</div>
				{actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
			</CardHeader>
			<CardContent className={cn("p-4 pt-0", contentClassName)}>{children}</CardContent>
		</Card>
	)
}

/**
 * Label/value pairs. Values wrap; labels never do — a wrapped label makes the
 * pairing ambiguous, and these lists carry ownership and money facts.
 */
export function FieldList({
	items,
	className,
}: {
	items: Array<{ label: string; value: React.ReactNode; hint?: string }>
	className?: string
}) {
	return (
		<dl className={cn("divide-y divide-border", className)}>
			{items.map((item) => (
				<div
					key={item.label}
					className="grid grid-cols-[minmax(7rem,auto)_minmax(0,1fr)] gap-x-4 gap-y-0.5 py-2.5 first:pt-0 last:pb-0"
				>
					<dt className="text-sm text-muted-foreground">{item.label}</dt>
					<dd className="min-w-0 text-sm font-medium break-words">{item.value}</dd>
					{item.hint && (
						<p className="col-start-2 text-xs text-muted-foreground">{item.hint}</p>
					)}
				</div>
			))}
		</dl>
	)
}

/**
 * Event history.
 *
 * PRD R2.8 — a case preserves its investigation, communication, decision, and
 * closure history. R1.5/R1.6 — sensitive entries keep actor, time, and reason,
 * and ordinary administrators cannot rewrite them. The `locked` flag marks the
 * entries that belong to that protected history.
 */
export function History({
	entries,
	className,
}: {
	entries: Array<{
		at: string
		title: string
		detail?: string
		actor?: string
		reason?: string
		locked?: boolean
	}>
	className?: string
}) {
	return (
		<ol className={cn("relative space-y-0", className)}>
			{entries.map((entry, index) => (
				<li key={`${entry.at}-${entry.title}`} className="relative flex gap-3 pb-4 last:pb-0">
					<div className="flex flex-col items-center">
						<span
							className={cn(
								"mt-1 size-2 shrink-0 rounded-full ring-4 ring-card",
								entry.locked ? "bg-primary" : "bg-border",
							)}
							aria-hidden
						/>
						{index < entries.length - 1 && (
							<span className="w-px flex-1 bg-border" aria-hidden />
						)}
					</div>

					<div className="-mt-0.5 min-w-0 flex-1 space-y-0.5">
						<div className="flex flex-wrap items-baseline gap-x-2">
							<p className="text-sm font-semibold">{entry.title}</p>
							<time className="text-xs text-muted-foreground">{entry.at}</time>
						</div>
						{entry.detail && (
							<p className="text-sm leading-relaxed text-muted-foreground">{entry.detail}</p>
						)}
						{entry.reason && (
							<p className="rounded-md border-l-2 border-border bg-secondary/60 px-2.5 py-1.5 text-sm">
								<span className="font-semibold">Reason: </span>
								{entry.reason}
							</p>
						)}
						{entry.actor && (
							<p className="text-xs text-muted-foreground">{entry.actor}</p>
						)}
					</div>
				</li>
			))}
		</ol>
	)
}
