import BrowseBrandsShell from "./shell";

import { listBrandsByPlatform } from "@/lib/features/product-catalog/services";
import { listMobileCategories } from "@/lib/features/listings/services";

export default async function BrowseBrandsPage() {
	const { data, error } = await listBrandsByPlatform("mobile");
	const { data: categories, error: categoriesError } = await listMobileCategories();
	if (error) {
		throw new Error("Failed to load brands");
	}
	if (categoriesError) {
		throw new Error("Failed to load categories");
	}

	return <BrowseBrandsShell brands={data ?? []} categories={categories ?? []} />;
}
