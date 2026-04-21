import HomeShell from "./shell";

import { orderedBrandsForHome } from "@/lib/features/product-catalog/home-brand-display";
import { listBrandsByPlatform } from "@/lib/features/product-catalog/services";
import { listingsSearchParamsSchema } from "@/lib/features/listings";
import { mapListingPrimaryImageUrls, searchListingsPublic } from "@/lib/features/listings/services";

const HOME_FEATURED_LIMIT = 8;

export default async function HomePage() {
	const { data: brandRows, error: brandsError } = await listBrandsByPlatform("mobile");
	if (brandsError) {
		throw new Error("Failed to load brands");
	}
	const brands = orderedBrandsForHome(brandRows ?? []);

	const query = listingsSearchParamsSchema.parse({
		platform: "mobile",
		page: 1,
		limit: HOME_FEATURED_LIMIT,
	});

	const { data: listings, error } = await searchListingsPublic(query);
	if (error) {
		throw new Error("Failed to load featured listings");
	}

	const list = listings ?? [];
	const thumbs = await mapListingPrimaryImageUrls(list.map((l) => l.id));
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<HomeShell brands={brands} imageByListingId={imageByListingId} listings={list} />
	);
}
