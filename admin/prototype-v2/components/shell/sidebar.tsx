"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Lock, Store, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { can } from "@/lib/permissions"
import { NAV_GROUPS, NAV_ITEMS, type NavItem } from "@/config/navigation"
import { useSession } from "@/components/app/session-provider"
import { Button } from "@/components/ui/button"

/**
 * The navigation sidebar — visually identical to the merchant dashboard's
 * `DashboardSidebar` in Angkoro-Frontend (fixed 64px card rail, Store icon +
 * title header, rounded-lg nav rows with accent/15 active state, account menu
 * at the bottom). One platform, one look, whether you operate a store or the
 * admin system.
 *
 * Sections the current role cannot fully use are dimmed with a lock, not
 * removed (PRD R1.3) — an operator who never sees "Merchant Settlements"
 * cannot know it exists to ask about.
 */
export function Sidebar({
	sidebarOpen,
	setSidebarOpen,
	onNavigate,
}: {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
	/** Called after a link is followed — closes the mobile drawer. */
	onNavigate?: () => void
}) {
	const pathname = usePathname()
	const { role } = useSession()

	return (
		<div>
			{/* Mobile backdrop */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}

			<aside
				aria-label="Admin navigation"
				className={cn(
					"fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
					sidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="flex h-full flex-col">
					{/* Header — matches the merchant dashboard header */}
					<div className="flex items-center justify-between border-b border-border p-3 sm:p-4 md:p-5">
						<Link href="/" className="cursor-pointer" onClick={onNavigate}>
							<div className="flex items-center gap-2">
								<Store className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
								<span className="text-base font-semibold sm:text-lg">Angkoro Admin</span>
							</div>
						</Link>
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setSidebarOpen(false)}
							aria-label="Close navigation"
						>
							<X className="h-4 w-4 sm:h-5 sm:w-5" />
						</Button>
					</div>

					{/* Navigation — FE pattern: 10px uppercase group labels, rounded-lg rows */}
					<nav className="flex-1 overflow-y-auto p-4" aria-label="Dashboard sections">
						{NAV_GROUPS.map((group, groupIndex) => {
							const items = NAV_ITEMS.filter((item) => item.group === group)
							if (items.length === 0) return null

							return (
								<div key={group ?? `group-${groupIndex}`}>
									<p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
										{group}
									</p>
									<ul className="space-y-1">
										{items.map((item) => {
											const isActive = isActivePath(pathname, item.href)
											const allowed = !item.permission || can(role, item.permission)
											return (
												<li key={item.href}>
													<NavRow
														item={item}
														active={isActive}
														allowed={allowed}
														onNavigate={() => setSidebarOpen(false)}
													/>
												</li>
											)
										})}
									</ul>
								</div>
							)
						})}
					</nav>
				</div>
			</aside>
		</div>
	)
}

function NavRow({
	item,
	active,
	allowed,
	onNavigate,
}: {
	item: NavItem
	active: boolean
	allowed: boolean
	onNavigate?: () => void
}) {
	const Icon = item.icon
	const label = item.short ?? item.title

	return (
		<Link
			href={item.href}
			onClick={onNavigate}
			aria-current={active ? "page" : undefined}
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:text-base",
				active ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
				!allowed && "opacity-40",
			)}
		>
			{!allowed ? (
				<Lock className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
			) : (
				<Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
			)}
			{label}
		</Link>
	)
}

function isActivePath(pathname: string, href: string): boolean {
	if (href === "/") return pathname === "/"
	return pathname === href || pathname.startsWith(`${href}/`)
}
