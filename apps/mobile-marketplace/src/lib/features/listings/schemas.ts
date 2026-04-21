import { z } from "zod";

import { SEARCH_LIMIT_MAX } from "@/lib/features/listings/config";

const categoryIdsFromParam = z
	.union([z.string(), z.array(z.string())])
	.optional()
	.transform((raw) => {
		if (raw === undefined) return undefined;
		const parts = Array.isArray(raw)
			? raw
			: raw.split(",").map((s) => s.trim());
		const uuids = parts.filter(Boolean);
		return uuids.length ? uuids : undefined;
	})
	.pipe(z.array(z.string().uuid()).max(24).optional());

/** URL/search params for `/search` (mirrors marketplace `listingsSearchQuerySchema`). */
export const listingsSearchParamsSchema = z
	.object({
		q: z.string().max(80).optional(),
		platform: z.enum(["mobile", "automotive"]).optional(),
		category_id: z.string().uuid().optional(),
		/** Comma-separated UUIDs; when set, filters with IN and takes precedence over `category_id`. */
		category_ids: categoryIdsFromParam,
		model_id: z.string().uuid().optional(),
		condition: z.enum(["new", "like_new", "excellent", "good", "fair", "poor"]).optional(),
		sale_type: z.enum(["fixed", "auction", "both"]).optional(),
		is_negotiable: z.coerce.boolean().optional(),
		city: z.string().max(120).optional(),
		price_min: z.coerce.number().positive().optional(),
		price_max: z.coerce.number().positive().optional(),
		sort: z.enum(["newest", "price_low", "price_high"]).optional(),
		page: z.coerce.number().int().min(1).max(100).optional(),
		limit: z.coerce.number().int().min(1).max(SEARCH_LIMIT_MAX).optional(),
		/** When set, skips page-based offset (used for browse “load more” chunks). */
		offset: z.coerce.number().int().min(0).max(100_000).optional(),
	})
	.strict();

export type ListingsSearchParams = z.infer<typeof listingsSearchParamsSchema>;

/** Minimal draft payload for the create wizard (matches remote API body shape). */
export const createListingWizardSchema = z
	.object({
		platform: z.literal("mobile"),
		category_id: z.string().uuid(),
		model_id: z.string().uuid().nullable().optional(),
		title: z.string().min(1).max(200),
		description: z.string().max(20000).nullable().optional(),
		sale_type: z.enum(["fixed", "auction", "both"]),
		price: z.number().nonnegative(),
		is_negotiable: z.boolean().optional(),
		condition: z.enum(["new", "like_new", "excellent", "good", "fair", "poor"]),
		details: z.record(z.string(), z.unknown()).default({}),
		city: z.string().min(1).max(120),
		area: z.string().max(120).nullable().optional(),
	})
	.strict();

export type CreateListingWizardInput = z.infer<typeof createListingWizardSchema>;
