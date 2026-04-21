"use client";

import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, Smartphone, Store, WalletCards } from "lucide-react";

import type { ListingImageRecord, ListingRecord } from "@/lib/features/listings";
import type { PublicProfile } from "@/lib/features/profiles/types";
import type { ReviewsListPayload } from "@/lib/features/reviews/types";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { RecordListingView } from "@/components/favorites/record-listing-view";
import { ListingActionPanel } from "@/components/listings/listing-action-panel";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingDetailGallery } from "@/components/listings/listing-detail-gallery";
import { ListingSpecsTable } from "@/components/listings/listing-specs-table";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";

type ListingDetailShellProps = {
	currentUserId: string | null;
	listing: ListingRecord;
	images: ListingImageRecord[];
	sellerProfile: PublicProfile | null;
	sellerReviews: ReviewsListPayload;
	similarListings: ListingRecord[];
	similarImageByListingId: Record<string, string>;
};

function formatDate(dateString: string) {
	return new Intl.DateTimeFormat("en-PK", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(dateString));
}

function initials(profile: PublicProfile | null) {
	const base = profile?.display_name ?? profile?.handle ?? "S";
	return base
		.split(/\s+/)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function ListingDetailShell({
	currentUserId,
	listing,
	images,
	sellerProfile,
	sellerReviews,
	similarListings,
	similarImageByListingId,
}: ListingDetailShellProps) {
	return (
		<div container-id="listing-detail-shell" className="flex flex-col gap-10">
			<RecordListingView listingId={listing.id} />

			<header container-id="listing-detail-header" className="flex flex-col gap-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{listing.status}</Badge>
						<Badge variant="secondary">{listing.condition.replaceAll("_", " ")}</Badge>
						<Badge variant="secondary">
							{listing.sale_type === "both" ? "buy or bid" : listing.sale_type}
						</Badge>
						{listing.is_negotiable ? <Badge variant="outline">Negotiable</Badge> : null}
					</div>
					<FavoriteButton listingId={listing.id} />
				</div>
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
					<div className="space-y-3">
						<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
							{listing.title}
						</h1>
						<p className="text-3xl font-semibold tabular-nums sm:text-4xl">
							Rs. {listing.price.toLocaleString("en-PK")}
						</p>
						<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-1">
								<MapPin className="size-4" />
								{listing.city}
								{listing.area ? `, ${listing.area}` : ""}
							</span>
							<span className="inline-flex items-center gap-1">
								<CalendarDays className="size-4" />
								Posted {formatDate(listing.created_at)}
							</span>
							<span className="inline-flex items-center gap-1">
								<Smartphone className="size-4" />
								Condition {listing.condition.replaceAll("_", " ")}
							</span>
						</div>
					</div>
					<div className="surface-panel rounded-[1.6rem] border border-border/80 bg-card/85 p-4 text-sm text-muted-foreground lg:max-w-xs">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Trust panel
						</p>
						<div className="mt-3 space-y-3">
							<p className="inline-flex items-center gap-2">
								<ShieldCheck className="size-4 text-primary" />
								Seller profile and reviews visible
							</p>
							<p className="inline-flex items-center gap-2">
								<WalletCards className="size-4 text-primary" />
								Fixed-price checkout uses order flow
							</p>
							<p className="inline-flex items-center gap-2">
								<Store className="size-4 text-primary" />
								Use city, condition, and similar listings before closing
							</p>
						</div>
					</div>
				</div>
			</header>

			<div
				container-id="listing-detail-grid"
				className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10"
			>
				<div container-id="listing-detail-main" className="flex min-w-0 flex-col gap-8">
					<ListingDetailGallery images={images} title={listing.title} />

					<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85">
						<CardHeader>
							<CardTitle className="text-base">Description</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
								{listing.description ?? "No description."}
							</p>
						</CardContent>
					</Card>

					<ListingSpecsTable listing={listing} />

					{similarListings.length ? (
						<section className="flex flex-col gap-4">
							<div>
								<h2 className="text-xl font-semibold tracking-tight">Similar listings</h2>
								<p className="text-sm text-muted-foreground">
									Compare nearby alternatives in the same category before you decide.
								</p>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{similarListings.map((item) => (
									<ListingCard
										key={item.id}
										imageUrl={similarImageByListingId[item.id]}
										listing={item}
									/>
								))}
							</div>
						</section>
					) : null}

					<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85">
						<CardHeader>
							<CardTitle className="text-base">Seller reviews</CardTitle>
						</CardHeader>
						<CardContent>
							<ReviewsList
								key={listing.user_id}
								sellerId={listing.user_id}
								initial={sellerReviews}
								emptyMessage="This seller has no reviews yet."
							/>
						</CardContent>
					</Card>
				</div>

				<aside
					container-id="listing-detail-side"
					className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start"
				>
					<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
						<CardHeader>
							<CardTitle className="text-base">Buy or bid</CardTitle>
						</CardHeader>
						<CardContent>
							<ListingActionPanel currentUserId={currentUserId} listing={listing} />
						</CardContent>
					</Card>

					{sellerProfile ? (
						<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
							<CardHeader>
								<CardTitle className="text-base">Seller</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex items-center gap-3">
									<Avatar className="size-12">
										{sellerProfile.avatar_url ? (
											<AvatarImage alt="" src={sellerProfile.avatar_url} />
										) : null}
										<AvatarFallback>{initials(sellerProfile)}</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{sellerProfile.display_name ?? "Marketplace seller"}
										</p>
										<p className="text-sm text-muted-foreground">
											{sellerProfile.city ?? "Pakistan"} • {sellerProfile.total_reviews} reviews
										</p>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">
									{sellerProfile.bio ?? "Seller profile with public reviews and active listings."}
								</p>
								<Link
									href={`/sellers/${sellerProfile.id}`}
									className="text-sm font-medium text-foreground underline underline-offset-4"
								>
									View seller storefront
								</Link>
							</CardContent>
						</Card>
					) : null}
				</aside>
			</div>
		</div>
	);
}
