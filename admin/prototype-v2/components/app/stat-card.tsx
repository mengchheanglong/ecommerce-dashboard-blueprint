import Link from "next/link"
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A single measure.
 *
 * PRD R8.1 — Platform Analytics shows only measures with an approved definition
 * and a reliable data source. `definition` is therefore not optional decoration:
 * a number without a stated population and timestamp rule is exactly the trap the
 * source audit warns about, so every stat states what it counts.
 */
export function StatCard({
	label,
	value,
	definition,
	delta,
	href,
	tone = "neutral",
	className,
}: {
	label: string
	value: string
	/** What the number counts. Rendered as the card's footnote. */
	definition?: string
	/** Period-over-period movement. Omit for snapshots that have no period. */
	delta?: { value: string; direction: "up" | "down" | "flat"; good?: boolean }
	/** Where the number's detail lives, if it has an owning feature. */
	href?: string
	tone?: "neutral" | "warn" | "bad"
	className?: string
}) {
	const body = (
		<>
			<div className="flex items-start justify-between gap-3">
					<p className="text-xs font-semibold text-muted-foreground">{label}</p>
					{href && (
						<ArrowRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
					)}
				</div>

				<div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
					<span
						className={cn(
							"tnum text-2xl font-extrabold tracking-tight",
							tone === "bad" && "text-destructive-ink",
							tone === "warn" && "text-warning-ink",
						)}
					>
						{value}
					</span>
					{delta && <DeltaTag {...delta} />}
				</div>

			{definition && (
				<p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{definition}</p>
			)}
		</>
	)

	const shell = cn(
		"group block rounded-xl border border-border bg-card p-4 text-card-foreground shadow-(--shadow-card) transition-colors",
		className,
	)

	if (href) {
		return (
			<Link href={href} className={cn(shell, "focus-ring hover:border-ring/40 hover:bg-secondary/40")}>
				{body}
			</Link>
		)
	}
	return <div className={shell}>{body}</div>
}

function DeltaTag({
	value,
	direction,
	good,
}: {
	value: string
	direction: "up" | "down" | "flat"
	good?: boolean
}) {
	const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus

	// "Up" is not automatically good — rising failed payments is bad news. The
	// caller states the meaning; the component never infers it from direction.
	const positive = good ?? direction === "up"
	const tone =
		direction === "flat"
			? "text-muted-foreground"
			: positive
				? "text-success-ink"
				: "text-destructive-ink"

	return (
		<span className={cn("tnum inline-flex items-center gap-0.5 text-xs font-semibold", tone)}>
			<Icon className="size-3.5" aria-hidden />
			{value}
		</span>
	)
}

/** Responsive row of stat cards — the standard 1 / 2 / 4 column ladder. */
export function StatGrid({
	children,
	columns = 4,
	className,
}: {
	children: React.ReactNode
	columns?: 2 | 3 | 4
	className?: string
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-3 sm:gap-4",
				columns === 2 && "",
				columns === 3 && "lg:grid-cols-3",
				columns === 4 && "lg:grid-cols-4",
				className,
			)}
		>
			{children}
		</div>
	)
}
