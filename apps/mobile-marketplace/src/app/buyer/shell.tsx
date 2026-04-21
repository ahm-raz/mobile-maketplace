"use client";

import Link from "next/link";

import { BuyerDashboardNav } from "@/components/buyer/buyer-dashboard-nav";
import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { formatViewedAt } from "@/lib/features/favorites/format-viewed-at";
import type { ViewedListPayload } from "@/lib/features/favorites/types";
import { cn } from "@/lib/utils";

import { BUYER_HOME_RECENT_VIEWS_LIMIT } from "./constants";

type BuyerShellProps = {
	recentViewed: ViewedListPayload;
	recentImageByListingId: Record<string, string>;
};

export default function BuyerShell({ recentViewed, recentImageByListingId }: BuyerShellProps) {
	const { items, pagination } = recentViewed;
	const showSeeMore =
		pagination.total > BUYER_HOME_RECENT_VIEWS_LIMIT || pagination.hasMore;

	return (
		<div container-id="buyer-shell" className="flex flex-col gap-8">
			<header container-id="buyer-header" className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						Buyer dashboard
					</p>
					<h1 className="text-3xl font-semibold tracking-tight">Buyer</h1>
					<p className="text-sm text-muted-foreground">
						Saved listings, browsing history, and account shortcuts.
					</p>
				</div>
				<BuyerDashboardNav />
			</header>

			<section container-id="buyer-recent-views" className="flex flex-col gap-4">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-semibold tracking-tight">Recently viewed</h2>
						<p className="text-sm text-muted-foreground">
							{pagination.total === 0
								? "No history yet — open listings while signed in to build this list."
								: `Showing ${items.length} of ${pagination.total} — newest first.`}
						</p>
					</div>
					{showSeeMore ? (
						<Link
							href="/buyer/viewed"
							className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
						>
							See more
						</Link>
					) : null}
				</div>

				{items.length === 0 ? (
					<div
						container-id="buyer-recent-empty"
						className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center"
					>
						<p className="text-sm font-medium">No recently viewed listings.</p>
						<p className="text-xs text-muted-foreground">
							<Link href="/search" className="text-primary underline-offset-4 hover:underline">
								Browse listings
							</Link>{" "}
							and open a detail page to add history.
						</p>
					</div>
				) : (
					<div
						container-id="buyer-recent-grid"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{items.map((row) => (
							<div key={row.listing.id} className="flex flex-col gap-2">
								<ListingCard
									imageUrl={recentImageByListingId[row.listing.id]}
									listing={row.listing}
								/>
								<p className="px-1 text-xs text-muted-foreground">
									Viewed {formatViewedAt(row.viewed_at)}
								</p>
							</div>
						))}
					</div>
				)}
			</section>

			<p container-id="buyer-help" className="text-xs text-muted-foreground">
				When an order is completed, open your review link from order details (buyer → orders →
				review).
			</p>
		</div>
	);
}
