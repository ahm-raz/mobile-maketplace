import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BrowseListingsShell from "./browse-listings-shell";

import { SEARCH_LIMIT_MAX } from "@/lib/features/listings/config";
import {
	BROWSE_SCOPE_COPY,
	categoryIdsForBrowseScope,
	isListingBrowseScope,
} from "@/lib/features/listings/browse-scopes";
import type { ListingRecord } from "@/lib/features/listings/types";
import {
	listMobileCategories,
	mapListingPrimaryImageUrls,
	searchListingsPublic,
} from "@/lib/features/listings/services";

type PageProps = { params: Promise<{ scope: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { scope: raw } = await params;
	if (!isListingBrowseScope(raw)) {
		return { title: "Listings" };
	}
	const copy = BROWSE_SCOPE_COPY[raw];
	return {
		title: `${copy.title} · Bazaar Mobile`,
		description: copy.description,
	};
}

export default async function BrowseListingsPage({ params }: PageProps) {
	const { scope: raw } = await params;
	if (!isListingBrowseScope(raw)) {
		notFound();
	}
	const { data: categoryRows, error: categoriesError } = await listMobileCategories();
	if (categoriesError) {
		throw new Error("Failed to load categories");
	}
	const categories = categoryRows ?? [];
	const categoryIds = categoryIdsForBrowseScope(categories, raw);

	let total = 0;
	let initial: ListingRecord[] = [];

	if (categoryIds.length > 0) {
		const probe = await searchListingsPublic({
			platform: "mobile",
			category_ids: categoryIds,
			limit: 1,
			page: 1,
			sort: "newest",
		});
		total = probe.pagination.total;
		const half =
			total <= 0 ? 0 : Math.min(Math.max(1, Math.ceil(total / 2)), SEARCH_LIMIT_MAX);
		if (half > 0) {
			const pageResult = await searchListingsPublic({
				platform: "mobile",
				category_ids: categoryIds,
				limit: half,
				offset: 0,
				sort: "newest",
			});
			initial = pageResult.data ?? [];
		}
	}

	const thumbs = await mapListingPrimaryImageUrls(initial.map((l) => l.id));
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;
	const copy = BROWSE_SCOPE_COPY[raw];

	return (
		<BrowseListingsShell
			categoryIdsParam={categoryIds.join(",")}
			initialListings={initial}
			totalCount={total}
			imageByListingId={imageByListingId}
			kicker={copy.kicker}
			title={copy.title}
			description={copy.description}
		/>
	);
}
