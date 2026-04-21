import type { SupabaseClient } from "@supabase/supabase-js";

import type { OwnProfile } from "@/lib/features/profiles/types";

/**
 * Loads the signed-in user's profile row using the browser Supabase client (RLS).
 * Used when `GET /api/profiles/me` is unreachable (e.g. main app not running on :3000).
 */
export async function fetchOwnProfileWithSession(
	supabase: SupabaseClient,
	userId: string,
): Promise<OwnProfile | null> {
	const { data, error } = await supabase
		.from("profiles")
		.select(
			"id, role, display_name, avatar_url, phone_number, phone_verified, email, city, area, bio, is_verified, is_banned, avg_rating, total_reviews, total_listings, total_sales, created_at, updated_at, handle, onboarding_completed_at, last_seen_at, locale",
		)
		.eq("id", userId)
		.maybeSingle();

	if (error) {
		console.error("fetchOwnProfileWithSession", error);
		return null;
	}
	if (!data) {
		return null;
	}

	const p = data as Record<string, unknown>;
	return {
		...p,
		avg_rating: Number(p.avg_rating) || 0,
		total_reviews: Number(p.total_reviews) || 0,
		total_listings: Number(p.total_listings) || 0,
		total_sales: Number(p.total_sales) || 0,
	} as OwnProfile;
}
