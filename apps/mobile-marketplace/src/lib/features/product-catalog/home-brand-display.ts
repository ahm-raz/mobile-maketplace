import type { Brand } from "@/lib/features/product-catalog/types";

/** Preferred order for “Shop by brand” on the home page (OLX-style). */
const HOME_BRAND_SLUG_ORDER = [
	"apple",
	"samsung",
	"xiaomi",
	"redmi",
	"realme",
	"google",
	"oneplus",
	"nokia",
] as const;

const HOME_BRAND_LABEL: Partial<Record<string, string>> = {
	apple: "Apple · iPhone",
};

/**
 * Stable, marketplace-friendly ordering; unknown slugs follow alphabetically by name.
 */
export function orderedBrandsForHome(brands: Brand[]): Brand[] {
	const bySlug = new Map(brands.map((b) => [b.slug, b]));
	const out: Brand[] = [];
	for (const slug of HOME_BRAND_SLUG_ORDER) {
		const row = bySlug.get(slug);
		if (row) {
			out.push(row);
			bySlug.delete(slug);
		}
	}
	const rest = [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
	return [...out, ...rest];
}

export function homeBrandChipLabel(brand: Brand): string {
	return HOME_BRAND_LABEL[brand.slug] ?? brand.name;
}
