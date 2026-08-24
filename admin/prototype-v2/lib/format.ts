/**
 * Formatting helpers.
 *
 * Everything here is deterministic against a fixed `NOW` so the prototype reads
 * identically on every run, screenshot, and review session. Nothing calls
 * `Date.now()` — a relative timestamp that drifts between server render and
 * client hydration is both a hydration mismatch and a reviewability problem.
 */

/** Fixed "now" for the whole prototype. Asia/Phnom_Penh is the reporting zone. */
export const NOW = new Date("2026-08-19T10:32:00+07:00")

export const REPORTING_TIMEZONE = "Asia/Phnom_Penh"

/* -------------------------------------------------------------------------
   Money

   Angkoro operates in USD and KHR and the two are never summed into a single
   figure — PRD R9.1 and the analytics source audit both require currency to
   stay separate. `money()` therefore always takes an explicit currency.
------------------------------------------------------------------------- */

export type Currency = "USD" | "KHR"

export function money(
	amount: number,
	currency: Currency = "USD",
	opts: { cents?: boolean; compact?: boolean } = {},
): string {
	if (currency === "KHR") {
		// Riel has no minor unit in practice; never show cents.
		return `៛${Math.round(amount).toLocaleString("en-US")}`
	}

	if (opts.compact && Math.abs(amount) >= 1000) {
		const units: Array<[number, string]> = [
			[1_000_000, "M"],
			[1_000, "k"],
		]
		for (const [size, suffix] of units) {
			if (Math.abs(amount) >= size) {
				const scaled = amount / size
				return `$${scaled.toFixed(scaled >= 100 ? 0 : 1)}${suffix}`
			}
		}
	}

	const digits = opts.cents === false ? 0 : 2
	return `$${amount.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	})}`
}

export function count(value: number): string {
	return value.toLocaleString("en-US")
}

export function percent(value: number, digits = 1): string {
	return `${value.toFixed(digits)}%`
}

/* -------------------------------------------------------------------------
   Time
------------------------------------------------------------------------- */

/** Compact elapsed time against the fixed NOW, e.g. "12 min ago", "3d ago". */
export function ago(iso: string): string {
	const diff = NOW.getTime() - new Date(iso).getTime()
	if (diff < 0) return "scheduled"
	const minutes = Math.round(diff / 60_000)
	if (minutes < 1) return "just now"
	if (minutes < 60) return `${minutes} min ago`
	const hours = Math.round(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.round(hours / 24)
	if (days === 1) return "yesterday"
	if (days < 30) return `${days}d ago`
	return `${Math.round(days / 30)}mo ago`
}

/** Time until a future moment, e.g. "in 45m" — or "overdue 2h" when past. */
export function until(iso: string): { label: string; overdue: boolean } {
	const diff = new Date(iso).getTime() - NOW.getTime()
	const overdue = diff < 0
	const minutes = Math.round(Math.abs(diff) / 60_000)
	const span =
		minutes < 60
			? `${minutes}m`
			: minutes < 60 * 24
				? `${Math.round(minutes / 60)}h`
				: `${Math.round(minutes / (60 * 24))}d`
	return { label: overdue ? `overdue ${span}` : `in ${span}`, overdue }
}

/** Age of the oldest item in a queue — the triage-pressure signal. */
export function age(iso: string): string {
	const minutes = Math.round((NOW.getTime() - new Date(iso).getTime()) / 60_000)
	if (minutes < 60) return `${minutes}m`
	if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
	return `${Math.floor(minutes / (60 * 24))}d`
}

export function shortDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		timeZone: REPORTING_TIMEZONE,
	})
}

export function longDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: REPORTING_TIMEZONE,
	})
}

export function dateTime(iso: string): string {
	const date = new Date(iso)
	const day = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		timeZone: REPORTING_TIMEZONE,
	})
	const time = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: REPORTING_TIMEZONE,
	})
	return `${day} · ${time}`
}

/* -------------------------------------------------------------------------
   Identity and sensitive values
------------------------------------------------------------------------- */

export function initials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")
}

/**
 * Bank destination display. PRD R5.8: account information stays masked except
 * where an authorized Finance workflow requires more detail — so the unmasked
 * form is a deliberate, separate call, never the default.
 */
export function maskAccount(digits: string): string {
	return `•••• ${digits.slice(-4)}`
}

/** Contact masking for support views that do not need the full value. */
export function maskEmail(email: string): string {
	const [name, domain] = email.split("@")
	if (!domain) return "•••"
	const head = name.slice(0, 2)
	return `${head}${"•".repeat(Math.max(name.length - 2, 3))}@${domain}`
}

export function maskPhone(phone: string): string {
	return `${phone.slice(0, 4)}•••${phone.slice(-2)}`
}
