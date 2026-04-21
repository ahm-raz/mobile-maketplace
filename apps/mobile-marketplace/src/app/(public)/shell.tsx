"use client";

import Link from "next/link";
import {
	ChevronRight,
	MapPin,
	ShieldCheck,
	Sparkles,
	Store,
	WalletCards,
} from "lucide-react";

import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import type { ListingBrowseScope } from "@/lib/features/listings/browse-scopes";
import { homeBrandChipLabel } from "@/lib/features/product-catalog/home-brand-display";
import type { Brand } from "@/lib/features/product-catalog/types";
import type { CategoryOption, ListingRecord } from "@/lib/features/listings";
import { MARKETPLACE_PLATFORM } from "@/lib/features/marketplace";
import { cn } from "@/lib/utils";

type HomeShellProps = {
	brands: Brand[];
	categories: CategoryOption[];
	featuredMixed: ListingRecord[];
	featuredPhones: ListingRecord[];
	featuredWatches: ListingRecord[];
	featuredTablets: ListingRecord[];
	imageByListingId: Record<string, string>;
	viewAllHrefs: Record<ListingBrowseScope, string>;
};

function HomeListingRail({
	kicker,
	title,
	viewAllHref,
	listings,
	imageByListingId,
	emptyHint,
}: {
	kicker: string;
	title: string;
	viewAllHref: string;
	listings: ListingRecord[];
	imageByListingId: Record<string, string>;
	emptyHint: string;
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-wrap items-end justify-between gap-2">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						{kicker}
					</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
				</div>
				<Link
					href={viewAllHref}
					className={cn(
						buttonVariants({ variant: "outline", size: "sm" }),
						"inline-flex items-center gap-1 shrink-0",
					)}
				>
					View all
					<ChevronRight className="size-4" aria-hidden />
				</Link>
			</div>
			{listings.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
					{emptyHint}
				</div>
			) : (
				<div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
					{listings.map((listing) => (
						<div
							key={listing.id}
							className="min-w-[min(100%,260px)] shrink-0 snap-start md:min-w-0"
						>
							<ListingCard
								imageUrl={imageByListingId[listing.id]}
								listing={listing}
							/>
						</div>
					))}
				</div>
			)}
		</section>
	);
}

const TRUST_POINTS = [
	{
		icon: ShieldCheck,
		title: "Trusted deals",
		text: "Seller reviews, profile history, and safer transaction flows.",
	},
	{
		icon: WalletCards,
		title: "Escrow-ready buying",
		text: "Pay for fixed-price listings with protected checkout states.",
	},
	{
		icon: Store,
		title: "Sell faster",
		text: "List your phone with photos, specs, and location-led discovery.",
	},
];

export default function HomeShell({
	brands,
	categories,
	featuredMixed,
	featuredPhones,
	featuredWatches,
	featuredTablets,
	imageByListingId,
	viewAllHrefs,
}: HomeShellProps) {
	return (
		<div container-id="home-shell" className="flex flex-col gap-10 lg:gap-14">
			<section
				container-id="home-hero"
				className="surface-hero relative overflow-hidden rounded-[2rem] border border-border/70 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
			>
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)] lg:items-end">
					<div className="flex flex-col gap-6">
						<div className="space-y-3">
							<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
								{MARKETPLACE_PLATFORM} marketplace
							</p>
							<h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Buy PTA approved phones and sell used mobiles faster.
							</h1>
							<p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
								Search by brand, price, condition, and city. Compare verified sellers,
								save favorites, and launch listings with a cleaner seller workflow.
							</p>
						</div>

						<div className="surface-panel flex flex-col gap-3 rounded-[1.6rem] border border-border/80 bg-card/90 p-3 sm:flex-row sm:items-center">
							<div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-background/90 px-4 py-3 text-sm text-muted-foreground">
								<Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
								<span className="truncate">
									Try: iPhone 13 PTA approved, Samsung A54 Lahore, Pixel under Rs 100k
								</span>
							</div>
							<div className="flex gap-2">
								<Link
									className={cn(buttonVariants({ size: "lg" }), "flex-1 sm:flex-none")}
									href="/search"
								>
									Search all listings
								</Link>
								<Link
									className={cn(
										buttonVariants({ size: "lg", variant: "outline" }),
										"flex-1 sm:flex-none",
									)}
									href="/seller/listings/new"
								>
									Sell a phone
								</Link>
							</div>
						</div>

						<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
							<span className="rounded-full border border-border/80 bg-card/70 px-4 py-2">
								Fresh stock daily
							</span>
							<span className="rounded-full border border-border/80 bg-card/70 px-4 py-2">
								Local city filters
							</span>
							<span className="rounded-full border border-border/80 bg-card/70 px-4 py-2">
								Reviews + safer checkout
							</span>
						</div>
					</div>

					<div className="surface-panel grid gap-3 rounded-[1.8rem] border border-border/70 bg-card/85 p-5">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Quick market snapshot
							</p>
							<p className="mt-2 text-2xl font-semibold text-foreground">
								Built for phones in Pakistan
							</p>
						</div>
						<div className="grid grid-cols-3 gap-3">
							<div className="rounded-2xl bg-background/80 p-4">
								<p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
									Brands
								</p>
								<p className="mt-2 text-2xl font-semibold">{brands.length}+</p>
							</div>
							<div className="rounded-2xl bg-background/80 p-4">
								<p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
									Categories
								</p>
								<p className="mt-2 text-2xl font-semibold">{categories.length}</p>
							</div>
							<div className="rounded-2xl bg-background/80 p-4">
								<p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
									Featured
								</p>
								<p className="mt-2 text-2xl font-semibold">{featuredMixed.length}</p>
							</div>
						</div>
						<div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
							Use smart filters for location, condition, and sale type to find better deals
							faster.
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-3">
				{TRUST_POINTS.map((item) => (
					<div
						key={item.title}
						className="surface-panel rounded-[1.6rem] border border-border/80 bg-card/80 p-5"
					>
						<item.icon className="size-5 text-primary" aria-hidden />
						<h2 className="mt-4 font-heading text-xl font-semibold">{item.title}</h2>
						<p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
					</div>
				))}
			</section>

			<section container-id="home-categories" className="flex flex-col gap-4">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Categories
						</p>
						<h2 className="mt-1 text-2xl font-semibold tracking-tight">
							Start with the device type you want
						</h2>
					</div>
					<Link
						href="/search"
						className="text-sm font-medium text-foreground underline underline-offset-4"
					>
						Open all listings
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{categories.map((category, index) => (
						<Link
							key={category.id}
							href={`/search?platform=mobile&category_id=${category.id}`}
							className="surface-panel rounded-[1.5rem] border border-border/80 bg-card/85 p-4 transition-transform hover:-translate-y-0.5"
						>
							<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								0{index + 1}
							</p>
							<p className="mt-4 text-lg font-semibold">{category.name}</p>
							<p className="mt-2 text-sm text-muted-foreground">
								Browse active {category.slug.replaceAll("-", " ")} listings
							</p>
						</Link>
					))}
				</div>
			</section>

			<section container-id="home-shop-by-brand" className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						Shop by brand
					</h2>
					<p className="text-sm text-muted-foreground">
						Go from brand to model pages, then jump into active local listings.
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
									"shrink-0 rounded-full bg-card/80 whitespace-nowrap",
								)}
								href={`/browse/brands/${brand.slug}`}
							>
								{homeBrandChipLabel(brand)}
							</Link>
						))}
					</div>
				)}
			</section>

			<div container-id="home-featured-strips" className="flex flex-col gap-12 lg:gap-14">
				<HomeListingRail
					kicker="Featured listings"
					title="Fresh devices across phones, watches & tablets"
					viewAllHref={viewAllHrefs["all-devices"]}
					listings={featuredMixed}
					imageByListingId={imageByListingId}
					emptyHint='No mixed listings yet. Run npm run supabase:reset to load seed data.'
				/>
				<HomeListingRail
					kicker="Mobile phones"
					title="Smartphones and pocket-friendly picks"
					viewAllHref={viewAllHrefs.phones}
					listings={featuredPhones}
					imageByListingId={imageByListingId}
					emptyHint="No phone listings in this slice yet."
				/>
				<HomeListingRail
					kicker="Smart watches"
					title="Wearables worth a look"
					viewAllHref={viewAllHrefs["smart-watches"]}
					listings={featuredWatches}
					imageByListingId={imageByListingId}
					emptyHint="No smart watch listings yet."
				/>
				<HomeListingRail
					kicker="Tablets"
					title="Tablets for work and entertainment"
					viewAllHref={viewAllHrefs.tablets}
					listings={featuredTablets}
					imageByListingId={imageByListingId}
					emptyHint="No tablet listings yet."
				/>
			</div>

			<section className="surface-panel rounded-[2rem] border border-border/80 bg-card/85 p-6 lg:p-8">
				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							How it works
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight">
							Search local listings, compare sellers, close better deals.
						</h2>
					</div>
					<div className="flex flex-wrap gap-2 text-sm">
						<span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground">
							<MapPin className="size-4" />
							City-first discovery
						</span>
						<span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground">
							<ShieldCheck className="size-4" />
							Trust signals
						</span>
						<span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground">
							<WalletCards className="size-4" />
							Buying flows
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}
