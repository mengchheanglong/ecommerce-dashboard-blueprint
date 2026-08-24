"use client"

import { useTheme } from "next-themes"
import { Check, LogOut, Monitor, Moon, Search, Sun } from "lucide-react"

import { initials } from "@/lib/format"
import type { Role } from "@/lib/permissions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Top-bar pieces — visually matching the merchant dashboard's `DashboardHeader`
 * (theme + account controls on the right of a card-coloured bar), with the
 * admin's Global Search field in the FE dashboard-header position.
 *
 * The operator is signed in as their assigned role (PRD R1.1/R1.2); there is no
 * role switcher — reviewing the other role's view requires an account that
 * actually holds it.
 */

export function TopbarSearch({ onOpen }: { onOpen: () => void }) {
	return (
		<button
			type="button"
			onClick={onOpen}
			className="focus-ring flex h-9 min-w-0 max-w-md flex-1 items-center gap-2.5 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-ring/40 hover:bg-secondary/50"
		>
			<Search className="size-4 shrink-0" aria-hidden />
			<span className="truncate">Search stores, users, cases…</span>
			<kbd className="ml-auto hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:block">
				⌘K
			</kbd>
		</button>
	)
}

export function TopbarActions({
	operator,
	role,
}: {
	operator: { name: string; email: string }
	role: Role
}) {
	return (
		<>
			<ThemeToggle />
			<OperatorMenu name={operator.name} email={operator.email} role={role} />
		</>
	)
}

function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const options = [
		{ value: "light", label: "Light", icon: Sun },
		{ value: "dark", label: "Dark", icon: Moon },
		{ value: "system", label: "Match system", icon: Monitor },
	] as const

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Change theme">
					<Sun className="size-4 dark:hidden" />
					<Moon className="hidden size-4 dark:block" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options.map((option) => (
					<DropdownMenuItem key={option.value} onSelect={() => setTheme(option.value)}>
						<option.icon className="size-4" />
						{option.label}
						{theme === option.value && <Check className="ml-auto size-4 text-primary" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function OperatorMenu({ name, email, role }: { name: string; email: string; role: Role }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="focus-ring flex w-full items-center gap-3 rounded-lg p-1 text-left transition-colors hover:bg-muted"
					aria-label="Account menu"
				>
					<Avatar className="size-8 shrink-0">
						<AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
							{initials(name)}
						</AvatarFallback>
					</Avatar>
					<div className="hidden min-w-0 md:block">
						<p className="truncate text-sm font-semibold">{name}</p>
						<p className="truncate text-xs text-muted-foreground">{email}</p>
					</div>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="font-normal">
					<p className="font-semibold">{name}</p>
					<p className="text-xs text-muted-foreground">{email}</p>
					<p className="mt-1.5 text-xs text-muted-foreground">
						Signed in as <span className="font-medium text-foreground">{role}</span>
					</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled>
					<LogOut className="size-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
