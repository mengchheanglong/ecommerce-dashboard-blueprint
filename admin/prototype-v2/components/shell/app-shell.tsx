"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { JUMP_TARGETS } from "@/config/navigation"
import { CommandPalette, useCommandPalette } from "@/components/shell/command-palette"
import { Sidebar } from "@/components/shell/sidebar"
import { TopbarSearch, TopbarActions } from "@/components/shell/topbar"
import { Button } from "@/components/ui/button"
import { useSession } from "@/components/app/session-provider"

/**
 * The admin shell — structurally identical to the merchant dashboard layout in
 * Angkoro-Frontend (`app/s/[subdomain]/dashboard/layout.tsx`): fixed 64px
 * sidebar, sticky card-coloured top bar with the search field left and actions
 * right, content in a single padded main column. One platform, one muscle memory.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { open: searchOpen, setOpen: setSearchOpen } = useCommandPalette()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { operator, role } = useSession()

	useJumpShortcuts(router)

	return (
		<div className="min-h-screen bg-background">
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			{/* Main column — offset by the fixed sidebar on desktop */}
			<div className="lg:pl-64">
				<header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card p-3 px-3 sm:gap-4 sm:px-4 md:px-5 lg:px-6">
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden"
						onClick={() => setSidebarOpen(true)}
						aria-label="Open navigation"
					>
						<Menu className="h-4 w-4 sm:h-5 sm:w-5" />
					</Button>

					<TopbarSearch onOpen={() => setSearchOpen(true)} />

					<div className="ml-auto flex items-center gap-1.5">
						<TopbarActions operator={operator} role={role} />
					</div>
				</header>

				{/* FE admin-page pattern: container mx-auto, py-6 sm:py-8, space-y-4 sm:space-y-5 */}
				<main className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 md:px-6">
					<div className="space-y-4 sm:space-y-5">{children}</div>
				</main>
			</div>

			<CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
		</div>
	)
}

/**
 * `g` then a letter jumps to a section — the pattern operations staff already
 * know from Linear and GitHub. Operators work the same queues all day; the
 * keyboard is the fast path and the mouse is the fallback.
 */
function useJumpShortcuts(router: ReturnType<typeof useRouter>) {
	useEffect(() => {
		let armed = false
		let timer: ReturnType<typeof setTimeout> | undefined

		function onKeyDown(event: KeyboardEvent) {
			const target = event.target as HTMLElement | null
			if (
				target?.tagName === "INPUT" ||
				target?.tagName === "TEXTAREA" ||
				target?.isContentEditable ||
				event.metaKey ||
				event.ctrlKey ||
				event.altKey
			) {
				return
			}

			if (armed) {
				const match = JUMP_TARGETS.find((item) => item.jumpKey === event.key.toLowerCase())
				armed = false
				clearTimeout(timer)
				if (match) {
					event.preventDefault()
					router.push(match.href)
				}
				return
			}

			if (event.key.toLowerCase() === "g") {
				armed = true
				timer = setTimeout(() => {
					armed = false
				}, 1200)
			}
		}

		document.addEventListener("keydown", onKeyDown)
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			clearTimeout(timer)
		}
	}, [router])
}
