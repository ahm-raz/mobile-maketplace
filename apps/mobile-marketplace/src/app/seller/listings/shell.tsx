"use client";

import Link from "next/link";

import type { ListingRecord } from "@/lib/features/listings";
import { ListingCard } from "@/components/listings/listing-card";
import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

type SellerListingsShellProps = {
	listings: ListingRecord[];
};

const groups = [
	{ key: "active", title: "Active listings" },
	{ key: "draft", title: "Drafts" },
	{ key: "sold", title: "Sold" },
] as const;

export default function SellerListingsShell({ listings }: SellerListingsShellProps) {
	return (
		<div container-id="seller-listings-shell" className="flex flex-col gap-8">
			<header
				container-id="seller-listings-header"
				className="surface-panel flex flex-wrap items-end justify-between gap-3 rounded-[2rem] border border-border/80 bg-card/85 p-6"
			>
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-semibold tracking-tight">My listings</h1>
					<p className="text-sm text-muted-foreground">
						Manage drafts, active phones, and sold inventory from one place.
					</p>
				</div>
				<Link href="/seller/listings/new" className={cn(buttonVariants())}>
					New listing
				</Link>
			</header>

			{listings.length === 0 ? (
				<div
					container-id="seller-listings-empty"
					className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center"
				>
					<p className="text-sm font-medium">No listings yet.</p>
					<p className="text-xs text-muted-foreground">
						<Link
							href="/seller/listings/new"
							className="text-primary underline-offset-4 hover:underline"
						>
							Create one
						</Link>{" "}
						to get started.
					</p>
				</div>
			) : (
				groups.map((group) => {
					const items = listings.filter((listing) => listing.status === group.key);
					if (!items.length) return null;

					return (
						<section key={group.key} className="flex flex-col gap-4">
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
								<p className="text-sm text-muted-foreground">{items.length} listing(s)</p>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{items.map((listing) => (
									<div key={listing.id} className="flex flex-col gap-2">
										<ListingCard listing={listing} />
										<Link
											href={`/seller/listings/${listing.id}/edit`}
											className={cn(
												buttonVariants({ variant: "outline", size: "sm" }),
												"w-full",
											)}
										>
											Edit
										</Link>
									</div>
								))}
							</div>
						</section>
					);
				})
			)}
		</div>
	);
}
