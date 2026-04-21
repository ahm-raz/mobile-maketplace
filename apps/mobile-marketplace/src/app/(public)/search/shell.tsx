"use client";

import Link from "next/link";

import type {
	CategoryOption,
	ListingRecord,
	ListingsPagination,
} from "@/lib/features/listings";
import type { ListingsSearchParams } from "@/lib/features/listings";
import { toListingsApiQuery } from "@/lib/features/listings/search-query";
import { ListingCard } from "@/components/listings/listing-card";
import {
	FilterChips,
	type ActiveFilterChip,
} from "@/components/listings/filter-chips";
import { SearchFiltersSidebar } from "@/components/listings/search-filters-sidebar";
import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

type SearchShellProps = {
	categories: CategoryOption[];
	listings: ListingRecord[];
	pagination: ListingsPagination;
	params: ListingsSearchParams;
};

function buildChips(params: ListingsSearchParams): ActiveFilterChip[] {
	const chips: ActiveFilterChip[] = [];
	const base = {
		...params,
		platform: params.platform ?? "mobile",
		page: 1 as number | undefined,
	};

	if (params.q) {
		const next = { ...base, q: undefined };
		chips.push({
			key: "q",
			label: `Keyword: ${params.q}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.city) {
		const next = { ...base, city: undefined };
		chips.push({
			key: "city",
			label: `City: ${params.city}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.price_min !== undefined) {
		const next = { ...base, price_min: undefined };
		chips.push({
			key: "pmin",
			label: `Min: ${params.price_min}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.price_max !== undefined) {
		const next = { ...base, price_max: undefined };
		chips.push({
			key: "pmax",
			label: `Max: ${params.price_max}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.condition) {
		const next = { ...base, condition: undefined };
		chips.push({
			key: "condition",
			label: `Condition: ${params.condition.replaceAll("_", " ")}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.sale_type) {
		const next = { ...base, sale_type: undefined };
		chips.push({
			key: "sale_type",
			label: `Sale: ${params.sale_type}`,
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	if (params.is_negotiable) {
		const next = { ...base, is_negotiable: undefined };
		chips.push({
			key: "is_negotiable",
			label: "Negotiable",
			removeHref: `/search${toListingsApiQuery(next)}`,
		});
	}
	return chips;
}

export default function SearchShell({
	categories,
	listings,
	pagination,
	params,
}: SearchShellProps) {
	const chips = buildChips(params);
	const page = params.page ?? 1;
	const prevPage = page > 1 ? page - 1 : null;
	const nextPage = pagination.hasMore ? page + 1 : null;

	const hrefBase = (p: number) =>
		`/search${toListingsApiQuery({
			...params,
			platform: params.platform ?? "mobile",
			page: p,
		})}`;

	return (
		<div
			container-id="search-shell"
			className="flex flex-col gap-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10"
		>
			<aside
				container-id="search-sidebar-desktop"
				className="hidden lg:sticky lg:top-24 lg:block"
			>
				<SearchFiltersSidebar categories={categories} initial={params} />
			</aside>

			<div container-id="search-main" className="flex min-w-0 flex-col gap-6">
				<header
					container-id="search-header"
					className="surface-panel flex flex-col gap-4 rounded-[1.8rem] border border-border/80 bg-card/80 p-5"
				>
					<div className="flex flex-wrap items-end justify-between gap-2">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight">
								Search listings
							</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Refine by location, category, condition, and sale type.
							</p>
						</div>
						<p className="text-sm text-muted-foreground tabular-nums">
							{pagination.total} result{pagination.total === 1 ? "" : "s"}
						</p>
					</div>
					<FilterChips chips={chips} />
				</header>

				<div
					container-id="search-results-grid"
					className="grid grid-cols-1 gap-4 sm:grid-cols-2"
				>
					{listings.map((l) => (
						<ListingCard key={l.id} listing={l} />
					))}
				</div>

				{listings.length === 0 ? (
					<div
						container-id="search-empty"
						className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center"
					>
						<p className="text-sm font-medium">No listings match your filters.</p>
						<p className="text-xs text-muted-foreground">
							Try removing a filter or broadening your search.
						</p>
					</div>
				) : null}

				<div
					container-id="search-pagination"
					className="flex flex-wrap items-center justify-end gap-2 pt-2"
				>
					{prevPage !== null ? (
						<Link
							href={hrefBase(prevPage)}
							className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						>
							Previous
						</Link>
					) : null}
					{nextPage !== null ? (
						<Link
							href={hrefBase(nextPage)}
							className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						>
							Next
						</Link>
					) : null}
				</div>
			</div>

			<div container-id="search-sidebar-mobile" className="lg:hidden">
				<SearchFiltersSidebar categories={categories} initial={params} />
			</div>
		</div>
	);
}
