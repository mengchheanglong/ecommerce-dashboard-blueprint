"use client"

import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { can, denialReason, permissionRule, type Permission } from "@/lib/permissions"
import { useSession } from "@/components/app/session-provider"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Wraps a sensitive control.
 *
 * The interface **disables and explains** rather than hiding. PRD R1.3 requires
 * the restriction to protect the action itself rather than only hiding the
 * control, so hiding buys no security — and an operator who cannot see that an
 * action exists cannot learn which role to ask. Staff build an accurate mental
 * model of the permission system by seeing the locked door and its owner.
 *
 * The real enforcement is server-side. This is the affordance, not the guard.
 */
export function PermissionGate({
	permission,
	children,
	/** Render nothing at all when denied. Only for whole read-only sections. */
	hideWhenDenied = false,
}: {
	permission: Permission
	children: React.ReactNode
	hideWhenDenied?: boolean
}) {
	const { role } = useSession()
	const allowed = can(role, permission)

	if (allowed) return <>{children}</>
	if (hideWhenDenied) return null

	const rule = permissionRule(permission)

	return (
		<TooltipProvider delayDuration={150}>
			<Tooltip>
				<TooltipTrigger asChild>
					{/* The wrapper takes the pointer events the disabled child cannot. */}
					<span className="inline-flex cursor-not-allowed">
						<span className="pointer-events-none opacity-50 grayscale" aria-disabled>
							{children}
						</span>
					</span>
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs">
					<p className="font-semibold">{denialReason(permission)}</p>
					<p className="mt-1 text-xs opacity-80">
						{rule.source}
						{rule.status === "proposed" && " · owning role not yet approved"}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

/**
 * Whole-section guard for a feature the current role may not open at all.
 * Explains who owns the section rather than showing an empty page.
 */
export function PermissionWall({
	permission,
	title,
	className,
}: {
	permission: Permission
	title: string
	className?: string
}) {
	const rule = permissionRule(permission)
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center",
				className,
			)}
		>
			<div className="flex size-11 items-center justify-center rounded-full bg-muted">
				<Lock className="size-5 text-muted-foreground" />
			</div>
			<h2 className="mt-4 text-base font-bold">{title} is limited by role</h2>
			<p className="mt-1.5 max-w-md text-sm text-muted-foreground">{denialReason(permission)}</p>
			<p className="mt-4 font-mono text-xs text-muted-foreground/70">{rule.source}</p>
		</div>
	)
}
