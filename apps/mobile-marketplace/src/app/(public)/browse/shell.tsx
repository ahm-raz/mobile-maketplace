"use client";

import Link from "next/link";

import { BrandCard } from "./_components/brand-card";
import type { CategoryOption } from "@/lib/features/listings";
import type { Brand } from "@/lib/features/product-catalog";
import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

type BrowseBrandsShellProps = {
	brands: Brand[];
	categories: CategoryOption[];
};

export default function BrowseBrandsShell({
	brands,
	categories,
}: BrowseBrandsShellProps) {
	return (
		<div container-id="browse-shell" className="flex flex-col gap-8">
			<header container-id="browse-header" className="flex flex-col gap-2">
				<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					Catalog
				</p>
				<h1 className="text-3xl font-semibold tracking-tight">
					Browse phones your way
				</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					Start with a category, jump into a brand, or head straight to filtered listings.
				</p>
			</header>

			<section className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/85 p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Categories
						</p>
						<h2 className="mt-1 text-xl font-semibold tracking-tight">
							Quick category entry
						</h2>
					</div>
					<Link
						href="/search"
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
					>
						Open search
					</Link>
				</div>
				<div className="mt-4 flex flex-wrap gap-3">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/search?platform=mobile&category_id=${category.id}`}
							className={cn(
								buttonVariants({ variant: "outline" }),
								"rounded-full bg-background/80",
							)}
						>
							{category.name}
						</Link>
					))}
				</div>
			</section>

			<div
				container-id="browse-brands-grid"
				className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
			>
				{brands.map((brand) => (
					<BrandCard key={brand.id} brand={brand} href={`/browse/brands/${brand.slug}`} />
				))}
			</div>
		</div>
	);
}
