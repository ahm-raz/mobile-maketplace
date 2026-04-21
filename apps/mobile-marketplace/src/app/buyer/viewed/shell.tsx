"use client";

import Link from "next/link";

import { BuyerDashboardNav } from "@/components/buyer/buyer-dashboard-nav";
import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { formatViewedAt } from "@/lib/features/favorites/format-viewed-at";
import type { ViewedListPayload } from "@/lib/features/favorites/types";
import { cn } from "@/lib/utils";

type ViewedShellProps = {
	payload: ViewedListPayload;
	page: number;
	imageByListingId: Record<string, string>;
};

export default function ViewedShell({ payload, page, imageByListingId }: ViewedShellProps) {
	const { items, pagination } = payload;
	const prevPage = page > 1 ? page - 1 : null;
	const nextPage = pagination.hasMore ? page + 1 : null;

	const hrefPage = (p: number) => (p === 1 ? "/buyer/viewed" : `/buyer/viewed?page=${p}`);

	return (
		<div container-id="viewed-shell" className="flex flex-col gap-8">
			<header container-id="viewed-header" className="flex flex-col gap-4">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl font-semibold tracking-tight">Recently viewed</h1>
						<p className="text-sm text-muted-foreground">
							Full history — listings you opened while signed in
							{pagination.total > 0 ? ` (${pagination.total} total)` : ""}.
						</p>
					</div>
					<Link
						href="/buyer/favorites"
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
					>
						Favorites
					</Link>
				</div>
				<BuyerDashboardNav />
			</header>

			{items.length === 0 ? (
				<div
					container-id="viewed-empty"
					className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center"
				>
					<p className="text-sm font-medium">No history yet.</p>
					<p className="text-xs text-muted-foreground">
						<Link href="/search" className="text-primary underline-offset-4 hover:underline">
							Browse listings
						</Link>{" "}
						to start building history.
					</p>
				</div>
			) : (
				<>
					<div
						container-id="viewed-grid"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{items.map((row) => (
							<div key={row.listing.id} className="flex flex-col gap-2">
								<ListingCard
									imageUrl={imageByListingId[row.listing.id]}
									listing={row.listing}
								/>
								<p className="px-1 text-xs text-muted-foreground">
									Viewed {formatViewedAt(row.viewed_at)}
								</p>
							</div>
						))}
					</div>

					{(prevPage !== null || nextPage !== null) && (
						<div
							container-id="viewed-pagination"
							className="flex flex-wrap items-center justify-end gap-2 pt-2"
						>
							{prevPage !== null ? (
								<Link
									href={hrefPage(prevPage)}
									className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
								>
									Previous
								</Link>
							) : null}
							{nextPage !== null ? (
								<Link
									href={hrefPage(nextPage)}
									className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
								>
									Next
								</Link>
							) : null}
						</div>
					)}
				</>
			)}
		</div>
	);
}
