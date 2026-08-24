import { AlertTriangle, HelpCircle, Info, ShieldAlert, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CalloutTone = "info" | "warning" | "danger" | "open-question"

const TONE: Record<CalloutTone, { icon: LucideIcon; box: string; chip: string }> = {
	info: {
		icon: Info,
		box: "border-info/30 bg-info/8",
		chip: "bg-info/15 text-info",
	},
	warning: {
		icon: AlertTriangle,
		box: "border-warning/30 bg-warning/8",
		chip: "bg-warning/15 text-warning",
	},
	danger: {
		icon: ShieldAlert,
		box: "border-destructive/30 bg-destructive/8",
		chip: "bg-destructive/15 text-destructive",
	},
	"open-question": {
		icon: HelpCircle,
		box: "border-violet/30 bg-violet/8",
		chip: "bg-violet/15 text-violet",
	},
}

export function Callout({
	tone = "info",
	title,
	children,
	className,
}: {
	tone?: CalloutTone
	title?: string
	children?: React.ReactNode
	className?: string
}) {
	const { icon: Icon, box, chip } = TONE[tone]
	return (
		<div className={cn("flex gap-3 rounded-lg border px-4 py-3.5", box, className)}>
			<span
				className={cn(
					"mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
					chip,
				)}
				aria-hidden
			>
				<Icon className="size-3.5" />
			</span>
			<div className="min-w-0 space-y-1 text-sm leading-relaxed">
				{title && <p className="font-semibold text-foreground">{title}</p>}
				{children && <div className="text-foreground/90">{children}</div>}
			</div>
		</div>
	)
}

/**
 * An unresolved rule, shown in place.
 *
 * The Internal Detail Register marks a number of operating rules "Needs
 * definition" — action-risk levels (§3.1), restriction grounds and durations
 * (§3.2), recovery evidence (§3.4), and retention periods (§4.2). This
 * prototype must not quietly invent them and present a guess as approved
 * product behaviour.
 *
 * So where a screen would need one of those rules to be real, it says so here
 * instead. That is the honest state of the product, and it makes the remaining
 * decisions visible to the people who have to make them.
 */
export function OpenQuestion({
	/** Register section, e.g. "§3.2 Restriction rules". */
	source,
	children,
	className,
}: {
	source: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<Callout tone="open-question" title="Not yet defined" className={className}>
			<p>{children}</p>
			<p className="mt-1.5 font-mono text-xs text-muted-foreground">
				Internal Detail Register {source} · marked &ldquo;Needs definition&rdquo;
			</p>
		</Callout>
	)
}
