"use client";

import Link from "next/link";

import { BuyerDashboardNav } from "@/components/buyer/buyer-dashboard-nav";
import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { formatViewedAt } from "@/lib/features/favorites/format-viewed-at";
import type {
	FavoritesListPayload,
	ViewedListPayload,
} from "@/lib/features/favorites/types";
import type { OwnProfile } from "@/lib/features/profiles/types";
import { cn } from "@/lib/utils";

import { BUYER_HOME_RECENT_VIEWS_LIMIT } from "./constants";

type BuyerShellProps = {
	favorites: FavoritesListPayload | null;
	profile: OwnProfile;
	recentViewed: ViewedListPayload;
	recentImageByListingId: Record<string, string>;
};

export default function BuyerShell({
	favorites,
	profile,
	recentViewed,
	recentImageByListingId,
}: BuyerShellProps) {
	const { items, pagination } = recentViewed;
	const favoriteItems = favorites?.items ?? [];
	const showSeeMore =
		pagination.total > BUYER_HOME_RECENT_VIEWS_LIMIT || pagination.hasMore;
	const completionItems = [
		Boolean(profile.display_name),
		Boolean(profile.avatar_url),
		Boolean(profile.city),
		Boolean(profile.bio),
	];
	const completion = Math.round(
		(completionItems.filter(Boolean).length / completionItems.length) * 100,
	);

	return (
		<div container-id="buyer-shell" className="flex flex-col gap-8">
			<header className="surface-panel rounded-[2rem] border border-border/80 bg-card/85 p-6 lg:p-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex flex-col gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Buyer dashboard
						</p>
						<h1 className="text-3xl font-semibold tracking-tight">
							Track saved phones, recent views, and profile readiness
						</h1>
						<p className="text-sm text-muted-foreground">
							Keep your saved inventory close and move faster when a good phone appears.
						</p>
					</div>
					<BuyerDashboardNav />
				</div>
				<div className="mt-6 grid gap-3 sm:grid-cols-3">
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Saved listings
						</p>
						<p className="mt-2 text-3xl font-semibold">{favorites?.pagination.total ?? 0}</p>
					</div>
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Recently viewed
						</p>
						<p className="mt-2 text-3xl font-semibold">{pagination.total}</p>
					</div>
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Profile complete
						</p>
						<p className="mt-2 text-3xl font-semibold">{completion}%</p>
					</div>
				</div>
			</header>

			<section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
				<div className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
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
							className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center"
						>
							<p className="text-sm font-medium">No recently viewed listings.</p>
							<p className="text-xs text-muted-foreground">
								<Link
									href="/search"
									className="text-primary underline-offset-4 hover:underline"
								>
									Browse listings
								</Link>{" "}
								and open a detail page to add history.
							</p>
						</div>
					) : (
						<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
				</div>

				<div className="flex flex-col gap-4">
					<div className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
						<h2 className="text-xl font-semibold tracking-tight">Saved phones</h2>
						{favoriteItems.length === 0 ? (
							<p className="mt-3 text-sm text-muted-foreground">
								No favorites yet. Save listings from search or detail pages.
							</p>
						) : (
							<div className="mt-3 space-y-3">
								{favoriteItems.map((row) => (
									<Link
										key={row.listing.id}
										href={`/listings/${row.listing.id}`}
										className="block rounded-2xl border border-border/70 bg-background/80 p-3"
									>
										<p className="font-medium text-foreground">{row.listing.title}</p>
										<p className="text-sm text-muted-foreground">
											Rs. {row.listing.price.toLocaleString("en-PK")} • {row.listing.city}
										</p>
									</Link>
								))}
							</div>
						)}
					</div>
					<div className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
						<h2 className="text-xl font-semibold tracking-tight">Profile readiness</h2>
						<p className="mt-3 text-sm text-muted-foreground">
							Complete your profile so sellers trust your activity and future purchases.
						</p>
						<div className="mt-4 h-2 rounded-full bg-secondary">
							<div
								className="h-full rounded-full bg-primary"
								style={{ width: `${completion}%` }}
							/>
						</div>
						<div className="mt-4 flex flex-col gap-2">
							<Link
								className={cn(buttonVariants({ variant: "outline" }))}
								href="/buyer/settings/profile"
							>
								Edit profile
							</Link>
							<Link
								className={cn(buttonVariants({ variant: "outline" }))}
								href="/buyer/settings/avatar"
							>
								Update avatar
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
