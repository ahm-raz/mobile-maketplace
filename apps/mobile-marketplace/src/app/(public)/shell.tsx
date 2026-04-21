"use client";

import Link from "next/link";

import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { homeBrandChipLabel } from "@/lib/features/product-catalog/home-brand-display";
import type { Brand } from "@/lib/features/product-catalog/types";
import type { ListingRecord } from "@/lib/features/listings";
import { MARKETPLACE_PLATFORM } from "@/lib/features/marketplace";
import { cn } from "@/lib/utils";

type HomeShellProps = {
	brands: Brand[];
	listings: ListingRecord[];
	imageByListingId: Record<string, string>;
};

export default function HomeShell({ brands, listings, imageByListingId }: HomeShellProps) {
	return (
		<div container-id="home-shell" className="flex flex-col gap-12">
			<section
				container-id="home-hero"
				className="flex flex-col items-start gap-6 py-6 sm:py-10"
			>
				<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{MARKETPLACE_PLATFORM} marketplace
				</p>
				<h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
					Browse phones
				</h1>
				<p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
					Pick a brand, then a model — or jump into latest listings. Sign in to sell, save favorites,
					or message sellers.
				</p>
				<div container-id="home-hero-cta" className="flex flex-wrap gap-3 pt-2">
					<Link className={cn(buttonVariants({ size: "lg" }))} href="/search">
						Search all listings
					</Link>
					<Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/sign-in">
						Sign in
					</Link>
					<Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/sign-up">
						Create account
					</Link>
				</div>
			</section>

			<section container-id="home-shortcuts" className="flex flex-col gap-4">
				<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					Shortcuts
				</h2>
				<div container-id="home-shortcut-grid" className="flex flex-wrap gap-3">
					<Link className={cn(buttonVariants({ variant: "outline" }))} href="/browse">
						Browse all brands
					</Link>
					<Link className={cn(buttonVariants({ variant: "outline" }))} href="/search">
						Search listings
					</Link>
					<Link className={cn(buttonVariants({ variant: "outline" }))} href="/seller">
						Seller dashboard
					</Link>
					<Link className={cn(buttonVariants({ variant: "outline" }))} href="/seller/listings">
						My listings
					</Link>
					<Link className={cn(buttonVariants({ variant: "outline" }))} href="/buyer">
						Buyer dashboard
					</Link>
				</div>
			</section>

			<section container-id="home-shop-by-brand" className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						Shop by brand
					</h2>
					<p className="text-sm text-muted-foreground">
						Each brand opens its phones and tablets — Apple, Samsung, Redmi, Realme, Nokia, and more.
					</p>
				</div>
				{brands.length === 0 ? (
					<p className="text-sm text-muted-foreground">No brands in catalog yet.</p>
				) : (
					<div
						container-id="home-brand-chips"
						className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
					>
						{brands.map((brand) => (
							<Link
								key={brand.id}
								className={cn(
									buttonVariants({ variant: "outline", size: "default" }),
									"shrink-0 whitespace-nowrap",
								)}
								href={`/browse/brands/${brand.slug}`}
							>
								{homeBrandChipLabel(brand)}
							</Link>
						))}
					</div>
				)}
			</section>

			<section container-id="home-featured" className="flex flex-col gap-4">
				<div className="flex flex-wrap items-end justify-between gap-2">
					<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						Featured listings
					</h2>
					<Link
						href="/search"
						className="text-sm font-medium text-foreground underline underline-offset-4"
					>
						View all
					</Link>
				</div>
				{listings.length === 0 ? (
					<div
						container-id="home-featured-empty"
						className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground"
					>
						No active listings yet. Run{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">npm run supabase:reset</code> to
						load seed data.
					</div>
				) : (
					<div
						container-id="home-featured-grid"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
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
		</div>
	);
}
