"use client";

import Link from "next/link";

import type { ListingRecord } from "@/lib/features/listings";
import type { OwnProfile } from "@/lib/features/profiles/types";
import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

type SellerShellProps = {
	listings: ListingRecord[];
	imageByListingId: Record<string, string>;
	profile: OwnProfile | null;
};

export default function SellerShell({
	listings,
	imageByListingId,
	profile,
}: SellerShellProps) {
	const activeCount = listings.filter((listing) => listing.status === "active").length;
	const draftCount = listings.filter((listing) => listing.status === "draft").length;
	const soldCount = listings.filter((listing) => listing.status === "sold").length;
	const completionItems = [
		Boolean(profile?.display_name),
		Boolean(profile?.city),
		Boolean(profile?.avatar_url),
		Boolean(profile?.bio),
	];
	const completion = Math.round(
		(completionItems.filter(Boolean).length / completionItems.length) * 100,
	);

	return (
		<div container-id="seller-shell" className="flex flex-col gap-8">
			<header className="surface-panel rounded-[2rem] border border-border/80 bg-card/85 p-6 lg:p-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Seller dashboard
						</p>
						<h1 className="mt-2 text-3xl font-semibold tracking-tight">
							Run your phone listings like a storefront
						</h1>
						<p className="mt-2 max-w-2xl text-sm text-muted-foreground">
							Track active inventory, keep drafts moving, and tighten your seller
							profile so buyers trust you faster.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link className={cn(buttonVariants())} href="/seller/listings/new">
							New listing
						</Link>
						<Link
							className={cn(buttonVariants({ variant: "outline" }))}
							href="/seller/listings"
						>
							Manage listings
						</Link>
					</div>
				</div>
				<div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Active
						</p>
						<p className="mt-2 text-3xl font-semibold">{activeCount}</p>
					</div>
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Drafts
						</p>
						<p className="mt-2 text-3xl font-semibold">{draftCount}</p>
					</div>
					<div className="rounded-[1.4rem] bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Sold
						</p>
						<p className="mt-2 text-3xl font-semibold">{soldCount}</p>
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
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="text-xl font-semibold tracking-tight">
								Recently updated listings
							</h2>
							<p className="text-sm text-muted-foreground">
								Keep your active phones fresh with better photos, pricing, and descriptions.
							</p>
						</div>
						<Link
							href="/seller/listings"
							className="text-sm font-medium text-foreground underline underline-offset-4"
						>
							View all
						</Link>
					</div>
					{listings.length === 0 ? (
						<div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
							No listings yet. Start with a draft and add clear photos, your city, and
							honest condition notes.
						</div>
					) : (
						<div className="mt-4 grid gap-4 sm:grid-cols-2">
							{listings.slice(0, 4).map((listing) => (
								<ListingCard
									key={listing.id}
									imageUrl={imageByListingId[listing.id]}
									listing={listing}
								/>
							))}
						</div>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<div className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
						<h2 className="text-xl font-semibold tracking-tight">Seller checklist</h2>
						<div className="mt-4 space-y-3 text-sm text-muted-foreground">
							<p>1. Add fresh photos with a clean cover image.</p>
							<p>2. Keep city, area, and negotiable state accurate.</p>
							<p>3. Fill your profile so buyers see a complete storefront.</p>
						</div>
					</div>
					<div className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
						<h2 className="text-xl font-semibold tracking-tight">Quick actions</h2>
						<div className="mt-4 flex flex-col gap-2">
							<Link
								className={cn(buttonVariants({ variant: "outline" }))}
								href="/buyer/settings/profile"
							>
								Edit seller profile
							</Link>
							<Link
								className={cn(buttonVariants({ variant: "outline" }))}
								href="/buyer/settings/avatar"
							>
								Update avatar
							</Link>
							<Link className={cn(buttonVariants())} href="/seller/listings/new">
								Post another phone
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
