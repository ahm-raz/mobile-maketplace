import type { CategoryOption } from "@/lib/features/listings/types";

/** URL segment under `/browse/listings/:scope`. */
export const LISTING_BROWSE_SCOPES = [
	"all-devices",
	"phones",
	"smart-watches",
	"tablets",
] as const;

export type ListingBrowseScope = (typeof LISTING_BROWSE_SCOPES)[number];

export function isListingBrowseScope(value: string): value is ListingBrowseScope {
	return (LISTING_BROWSE_SCOPES as readonly string[]).includes(value);
}

const PHONE_SLUGS = ["smartphones", "gaming-phones", "foldables", "feature-phones"] as const;
const TABLET_SLUGS = ["tablets"] as const;
const WATCH_SLUGS = ["smart-watches"] as const;

function idsForSlugs(categories: CategoryOption[], slugs: readonly string[]): string[] {
	const bySlug = new Map(categories.map((c) => [c.slug, c.id]));
	return slugs.map((s) => bySlug.get(s)).filter((id): id is string => Boolean(id));
}

/** Resolves catalog rows for the mobile platform into listing `category_id` filters. */
export function categoryIdsForBrowseScope(
	categories: CategoryOption[],
	scope: ListingBrowseScope,
): string[] {
	const phones = idsForSlugs(categories, PHONE_SLUGS);
	const tablets = idsForSlugs(categories, TABLET_SLUGS);
	const watches = idsForSlugs(categories, WATCH_SLUGS);

	switch (scope) {
		case "all-devices":
			return [...phones, ...tablets, ...watches];
		case "phones":
			return phones;
		case "tablets":
			return tablets;
		case "smart-watches":
			return watches;
		default: {
			const _exhaustive: never = scope;
			return _exhaustive;
		}
	}
}

export const BROWSE_SCOPE_COPY: Record<
	ListingBrowseScope,
	{ kicker: string; title: string; description: string }
> = {
	"all-devices": {
		kicker: "All devices",
		title: "Phones, watches & tablets",
		description: "Mixed listings across mobile phones, smart watches, and tablets.",
	},
	phones: {
		kicker: "Mobile phones",
		title: "Browse mobile phones",
		description: "Smartphones, gaming phones, foldables, and feature phones.",
	},
	"smart-watches": {
		kicker: "Smart watches",
		title: "Browse smart watches",
		description: "Wearables and fitness-focused listings.",
	},
	tablets: {
		kicker: "Tablets",
		title: "Browse tablets",
		description: "iPad, Galaxy Tab, and other tablet listings.",
	},
};

export const BROWSE_SCOPE_HOME_HREFS: Record<ListingBrowseScope, string> = {
	"all-devices": "/browse/listings/all-devices",
	phones: "/browse/listings/phones",
	"smart-watches": "/browse/listings/smart-watches",
	tablets: "/browse/listings/tablets",
};

/** Chunk sizes for each successive “Load more” click (cycles). */
export const BROWSE_LOAD_MORE_CHUNK_PATTERN = [10, 20, 30] as const;
