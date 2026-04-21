"use client";

import { useState } from "react";

import type { ListingRecord } from "@/lib/features/listings";
import type { PublicProfile } from "@/lib/features/profiles/types";
import type { ReviewsListPayload } from "@/lib/features/reviews/types";
import { ListingCard } from "@/components/listings/listing-card";
import { ProfileHeader } from "@/components/profiles/profile-header";
import { ProfileStats } from "@/components/profiles/profile-stats";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { Button } from "@/components/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";

type SellerPublicShellProps = {
	imageByListingId: Record<string, string>;
	listings: ListingRecord[];
	profile: PublicProfile;
	reviewsInitial: ReviewsListPayload;
};

export default function SellerPublicShell({
	imageByListingId,
	listings,
	profile,
	reviewsInitial,
}: SellerPublicShellProps) {
	const [tab, setTab] = useState<"overview" | "reviews">("overview");

	return (
		<div container-id="seller-public-shell" className="flex flex-col gap-8">
			<ProfileHeader profile={profile} />
			<ProfileStats
				stats={{
					avg_rating: profile.avg_rating,
					total_reviews: profile.total_reviews,
					total_listings: profile.total_listings,
					total_sales: profile.total_sales,
				}}
			/>

			<div
				container-id="seller-public-tabs"
				role="tablist"
				className="flex flex-wrap items-center gap-1 border-b border-border"
			>
				<Button
					type="button"
					role="tab"
					aria-selected={tab === "overview"}
					variant={tab === "overview" ? "secondary" : "ghost"}
					size="sm"
					className="-mb-px rounded-b-none"
					onClick={() => setTab("overview")}
				>
					Overview
				</Button>
				<Button
					type="button"
					role="tab"
					aria-selected={tab === "reviews"}
					variant={tab === "reviews" ? "secondary" : "ghost"}
					size="sm"
					className="-mb-px rounded-b-none"
					onClick={() => setTab("reviews")}
				>
					Reviews ({profile.total_reviews})
				</Button>
			</div>

			{tab === "overview" ? (
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
					<section className="flex flex-col gap-4">
						<div>
							<h2 className="text-xl font-semibold tracking-tight">Active listings</h2>
							<p className="text-sm text-muted-foreground">
								Current phones this seller has live on the marketplace.
							</p>
						</div>
						{listings.length === 0 ? (
							<Card>
								<CardHeader>
									<CardTitle className="text-base">No active listings</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										This seller does not have active phones right now.
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{listings.map((listing) => (
									<ListingCard
										key={listing.id}
										imageUrl={imageByListingId[listing.id]}
										listing={listing}
									/>
								))}
							</div>
						)}
					</section>

					<Card className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85">
						<CardHeader>
							<CardTitle className="text-base">Seller profile</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-muted-foreground">
							<p>{profile.bio ?? "This seller has not added a public bio yet."}</p>
							<p>Joined {new Date(profile.created_at).toLocaleDateString("en-PK")}</p>
							<p>{profile.city ?? "Pakistan"} seller</p>
							<p>{profile.is_verified ? "Verified profile" : "Growing trust profile"}</p>
						</CardContent>
					</Card>
				</div>
			) : null}

			{tab === "reviews" ? (
				<section container-id="seller-public-reviews" className="flex flex-col gap-4">
					<h2 className="text-lg font-semibold tracking-tight">Seller reviews</h2>
					<ReviewsList key={profile.id} sellerId={profile.id} initial={reviewsInitial} />
				</section>
			) : null}
		</div>
	);
}
