import HomeShell from "./shell";

import {
	BROWSE_SCOPE_HOME_HREFS,
	categoryIdsForBrowseScope,
	type ListingBrowseScope,
} from "@/lib/features/listings/browse-scopes";
import { orderedBrandsForHome } from "@/lib/features/product-catalog/home-brand-display";
import { listBrandsByPlatform } from "@/lib/features/product-catalog/services";
import type { ListingRecord } from "@/lib/features/listings/types";
import {
	listMobileCategories,
	mapListingPrimaryImageUrls,
	searchListingsPublic,
} from "@/lib/features/listings/services";

/** Single row on lg+ (4 columns); smaller breakpoints scroll horizontally. */
const HOME_STRIP_LIMIT = 4;

async function featuredForScope(
	categories: { id: string; name: string; slug: string }[],
	scope: ListingBrowseScope,
): Promise<ListingRecord[]> {
	const ids = categoryIdsForBrowseScope(categories, scope);
	if (ids.length === 0) return [];
	const { data } = await searchListingsPublic({
		platform: "mobile",
		category_ids: ids,
		limit: HOME_STRIP_LIMIT,
		page: 1,
		sort: "newest",
	});
	return data ?? [];
}

export default async function HomePage() {
	const { data: brandRows, error: brandsError } = await listBrandsByPlatform("mobile");
	const { data: categoryRows, error: categoriesError } = await listMobileCategories();
	if (brandsError) {
		throw new Error("Failed to load brands");
	}
	if (categoriesError) {
		throw new Error("Failed to load categories");
	}
	const brands = orderedBrandsForHome(brandRows ?? []);
	const categories = categoryRows ?? [];

	const scopes: ListingBrowseScope[] = [
		"all-devices",
		"phones",
		"smart-watches",
		"tablets",
	];
	const [featuredMixed, featuredPhones, featuredWatches, featuredTablets] = await Promise.all(
		scopes.map((s) => featuredForScope(categories, s)),
	);

	const allIds = [
		...featuredMixed,
		...featuredPhones,
		...featuredWatches,
		...featuredTablets,
	].map((l) => l.id);
	const thumbs = await mapListingPrimaryImageUrls(allIds);
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<HomeShell
			brands={brands}
			categories={categories}
			featuredMixed={featuredMixed}
			featuredPhones={featuredPhones}
			featuredWatches={featuredWatches}
			featuredTablets={featuredTablets}
			imageByListingId={imageByListingId}
			viewAllHrefs={BROWSE_SCOPE_HOME_HREFS}
		/>
	);
}
