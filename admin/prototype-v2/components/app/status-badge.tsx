import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/**
 * Status tone.
 *
 * Every status in the admin system maps onto one of these six tones, and the
 * mapping lives in `TONE_BY_STATUS` below rather than at each call site — so
 * "Blocked" is the same red on the settlements queue, the store record, and the
 * overview, without anyone having to remember which variant to pass.
 *
 * PRD R9.2 and the accessibility gate both require status to survive without
 * color: every badge therefore carries its own text and a leading dot, and tone
 * is reinforcement, never the only signal. This mirrors the production
 * `StatusBadge` in Angkoro-Frontend exactly (tint fill + strong ink + dot).
 */
export type Tone = "good" | "warn" | "serious" | "bad" | "info" | "neutral"

/** Tone → shadcn badge variant. Same vocabulary as Angkoro-Frontend's ui/badge. */
const TONE_VARIANT: Record<Tone, React.ComponentProps<typeof Badge>["variant"]> = {
	good: "success",
	warn: "warning",
	serious: "violet",
	bad: "destructive",
	info: "info",
	neutral: "muted",
}

/**
 * The single source of truth for status colour across the whole admin surface.
 * Anything not listed falls back to `neutral` — an unknown status reads as
 * "no opinion", never as accidentally good.
 */
const TONE_BY_STATUS: Record<string, Tone> = {
	// Generic lifecycle
	Active: "good",
	Completed: "good",
	Resolved: "good",
	Approved: "good",
	Verified: "good",
	Healthy: "good",
	Delivered: "good",
	Matched: "good",
	Sent: "good",
	Paid: "good",
	Closed: "neutral",

	// In flight
	Processing: "info",
	"In review": "info",
	Investigating: "info",
	Open: "info",
	Onboarding: "info",
	Scheduled: "info",
	Accepted: "info",
	"Read-only": "info",
	Draft: "neutral",
	Pending: "warn",
	"Awaiting transfer": "warn",
	"Awaiting evidence": "warn",
	"Awaiting approval": "warn",
	"Awaiting consent": "warn",
	"Elevation requested": "warn",
	"Elevated": "serious",
	"Needs review": "warn",
	Unmatched: "warn",
	Degraded: "warn",
	Expiring: "warn",
	Overdue: "bad",

	// Stopped or failed
	Blocked: "bad",
	Failed: "bad",
	Rejected: "bad",
	Suspended: "bad",
	Restricted: "bad",
	Banned: "bad",
	Down: "bad",
	Expired: "bad",
	Cancelled: "neutral",
	Revoked: "neutral",
	Disabled: "neutral",
}

export function toneFor(status: string): Tone {
	return TONE_BY_STATUS[status] ?? "neutral"
}

export function StatusBadge({
	status,
	tone,
	className,
}: {
	status: string
	/** Override the mapped tone. Use sparingly — prefer extending TONE_BY_STATUS. */
	tone?: Tone
	className?: string
}) {
	return (
		<Badge variant={TONE_VARIANT[tone ?? toneFor(status)]} className={className}>
			<span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
			{status}
		</Badge>
	)
}

/**
 * A status shown as a dot plus plain label, for dense table cells where a full
 * badge would be too heavy repeated down forty rows.
 */
export function StatusDot({
	status,
	tone,
	className,
}: {
	status: string
	tone?: Tone
	className?: string
}) {
	const resolved = tone ?? toneFor(status)
	const dot: Record<Tone, string> = {
		good: "bg-success",
		warn: "bg-warning",
		serious: "bg-violet",
		bad: "bg-destructive",
		info: "bg-info",
		neutral: "bg-muted-foreground/50",
	}
	return (
		<span className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
			<span className={cn("size-1.5 shrink-0 rounded-full", dot[resolved])} aria-hidden />
			<span className="text-sm text-foreground">{status}</span>
		</span>
	)
}

/* -------------------------------------------------------------------------
   Priority

   Support case priority (Register §3.5). Shown as a labelled chip rather than
   a bare colour so Urgent and Low are distinguishable in greyscale.
------------------------------------------------------------------------- */

export type CasePriority = "Urgent" | "High" | "Normal" | "Low"

const PRIORITY_VARIANT: Record<CasePriority, React.ComponentProps<typeof Badge>["variant"]> = {
	Urgent: "destructive",
	High: "warning",
	Normal: "info",
	Low: "muted",
}

export function PriorityChip({ priority }: { priority: CasePriority }) {
	return (
		<Badge variant={PRIORITY_VARIANT[priority]}>
			{priority}
		</Badge>
	)
}
