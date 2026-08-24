"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/app/empty-state"

/**
 * The index/queue table used by every list page.
 *
 * Design notes worth keeping:
 *
 * - Sorting, searching, and filtering are *client-side over a supplied array*.
 *   That is right for a prototype and wrong for production: the real system
 *   sorts and filters server-side under the operator's permissions, so a row
 *   they may not see is never sent (R1.9).
 * - Numeric columns get `align: "right"` and tabular figures. Amounts compared
 *   down a column must share a decimal position or scanning breaks down.
 * - A row click navigates when `hrefFor` is supplied; the row is then a real
 *   link target for the keyboard too, not a div with an onClick.
 */

export type Column<T> = {
	key: string
	header: string
	/** Cell contents. Return a node, not a string, when it needs a badge. */
	cell: (row: T) => React.ReactNode
	/** Value used for sorting; omit to make the column unsortable. */
	sortValue?: (row: T) => string | number
	align?: "left" | "right"
	/** Hide below this breakpoint so narrow screens keep the important columns. */
	hideBelow?: "sm" | "md" | "lg" | "xl"
	width?: string
}

export type Filter<T> = {
	key: string
	label: string
	options: Array<{ value: string; label: string; match: (row: T) => boolean }>
}

export function DataTable<T>({
	rows,
	columns,
	/** Fields concatenated for the search box. Human-readable values only. */
	searchIn,
	searchPlaceholder = "Search",
	filters,
	hrefFor,
	empty,
	initialSort,
	className,
}: {
	rows: T[]
	columns: Array<Column<T>>
	searchIn?: (row: T) => string
	searchPlaceholder?: string
	filters?: Array<Filter<T>>
	hrefFor?: (row: T) => string
	empty?: { title: string; description?: string }
	initialSort?: { key: string; direction: "asc" | "desc" }
	className?: string
}) {
	const router = useRouter()
	const [query, setQuery] = useState("")
	const [sort, setSort] = useState(initialSort ?? null)
	const [active, setActive] = useState<Record<string, string>>({})

	const visible = useMemo(() => {
		let result = rows

		if (query.trim() && searchIn) {
			const needle = query.trim().toLowerCase()
			result = result.filter((row) => searchIn(row).toLowerCase().includes(needle))
		}

		for (const filter of filters ?? []) {
			const chosen = active[filter.key]
			if (!chosen || chosen === "all") continue
			const option = filter.options.find((o) => o.value === chosen)
			if (option) result = result.filter(option.match)
		}

		if (sort) {
			const column = columns.find((c) => c.key === sort.key)
			if (column?.sortValue) {
				const get = column.sortValue
				result = [...result].sort((a, b) => {
					const left = get(a)
					const right = get(b)
					const order =
						typeof left === "number" && typeof right === "number"
							? left - right
							: String(left).localeCompare(String(right))
					return sort.direction === "asc" ? order : -order
				})
			}
		}

		return result
	}, [rows, query, searchIn, filters, active, sort, columns])

	function toggleSort(key: string) {
		setSort((current) => {
			if (current?.key !== key) return { key, direction: "asc" }
			if (current.direction === "asc") return { key, direction: "desc" }
			return null
		})
	}

	const hasControls = Boolean(searchIn) || Boolean(filters?.length)

	return (
		<div className={cn("space-y-4", className)}>
			{hasControls && (
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					{searchIn && (
						<div className="relative w-full sm:max-w-md">
							<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder={searchPlaceholder}
								className="pl-9"
								aria-label={searchPlaceholder}
							/>
						</div>
					)}

					{filters?.map((filter) => (
						<FilterChips
							key={filter.key}
							filter={filter}
							value={active[filter.key] ?? "all"}
							onChange={(value) => setActive((c) => ({ ...c, [filter.key]: value }))}
						/>
					))}

					<span className="tnum ml-auto hidden text-xs text-muted-foreground sm:block">
						{visible.length === rows.length
							? `${rows.length} ${rows.length === 1 ? "record" : "records"}`
							: `${visible.length} of ${rows.length}`}
					</span>
				</div>
			)}

			<div className="overflow-x-auto rounded-xl border border-border bg-card shadow-(--shadow-card)">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{columns.map((column) => (
								<TableHead
									key={column.key}
									style={column.width ? { width: column.width } : undefined}
									className={cn(
										column.align === "right" && "text-right",
										column.hideBelow === "sm" && "hidden sm:table-cell",
										column.hideBelow === "md" && "hidden md:table-cell",
										column.hideBelow === "lg" && "hidden lg:table-cell",
										column.hideBelow === "xl" && "hidden xl:table-cell",
									)}
								>
									{column.sortValue ? (
										<button
											type="button"
											onClick={() => toggleSort(column.key)}
											className={cn(
												"focus-ring -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground",
												column.align === "right" && "flex-row-reverse",
											)}
											aria-label={`Sort by ${column.header}`}
										>
											{column.header}
											<SortIcon
												active={sort?.key === column.key}
												direction={sort?.direction}
											/>
										</button>
									) : (
										column.header
									)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{visible.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={columns.length} className="p-0">
									<EmptyState
										title={empty?.title ?? "Nothing to show"}
										description={
											empty?.description ??
											(query || Object.keys(active).length
												? "No record matches the current search or filter."
												: undefined)
										}
										compact
									/>
								</TableCell>
							</TableRow>
						) : (
							visible.map((row, index) => {
								const href = hrefFor?.(row)
								return (
									<TableRow
										key={index}
										onClick={href ? () => router.push(href) : undefined}
										onKeyDown={
											href
												? (event) => {
														if (event.currentTarget !== event.target) return
														if (event.key === "Enter" || event.key === " ") {
															event.preventDefault()
															router.push(href)
														}
													}
												: undefined
										}
										tabIndex={href ? 0 : undefined}
										role={href ? "link" : undefined}
										className={cn(href && "cursor-pointer")}
									>
										{columns.map((column) => (
											<TableCell
												key={column.key}
												className={cn(
													column.align === "right" && "tnum text-right",
													column.hideBelow === "sm" && "hidden sm:table-cell",
													column.hideBelow === "md" && "hidden md:table-cell",
													column.hideBelow === "lg" && "hidden lg:table-cell",
													column.hideBelow === "xl" && "hidden xl:table-cell",
												)}
											>
												{column.cell(row)}
											</TableCell>
										))}
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

function SortIcon({ active, direction }: { active: boolean; direction?: "asc" | "desc" }) {
	if (!active) return <ChevronsUpDown className="size-3.5 opacity-40" aria-hidden />
	return direction === "asc" ? (
		<ArrowUp className="size-3.5" aria-hidden />
	) : (
		<ArrowDown className="size-3.5" aria-hidden />
	)
}

function FilterChips<T>({
	filter,
	value,
	onChange,
}: {
	filter: Filter<T>
	value: string
	onChange: (value: string) => void
}) {
	return (
		<div
			className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5"
			role="group"
			aria-label={filter.label}
		>
			<SlidersHorizontal className="ml-1.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
			{[{ value: "all", label: "All" }, ...filter.options].map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					aria-pressed={value === option.value}
					className={cn(
						"focus-ring rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors",
						value === option.value
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:bg-secondary hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	)
}
