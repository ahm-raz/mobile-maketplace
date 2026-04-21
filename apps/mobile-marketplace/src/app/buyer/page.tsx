import { redirect } from "next/navigation";

import { BUYER_HOME_RECENT_VIEWS_LIMIT } from "./constants";
import BuyerShell from "./shell";

import { fetchMyFavorites, fetchMyViewedListings } from "@/lib/features/favorites/services";
import { mapListingPrimaryImageUrls } from "@/lib/features/listings/services";
import { fetchMyProfile } from "@/lib/features/profiles/fetch-my-profile";

export default async function BuyerHomePage() {
	const [recentPayload, favoritesPayload, profile] = await Promise.all([
		fetchMyViewedListings(1, BUYER_HOME_RECENT_VIEWS_LIMIT),
		fetchMyFavorites(1, 4),
		fetchMyProfile(),
	]);
	if (!recentPayload || !profile) {
		redirect("/sign-in");
	}

	const ids = [
		...recentPayload.items.map((row) => row.listing.id),
		...(favoritesPayload?.items.map((row) => row.listing.id) ?? []),
	];
	const thumbs = await mapListingPrimaryImageUrls(ids);
	const recentImageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<BuyerShell
			favorites={favoritesPayload}
			profile={profile}
			recentImageByListingId={recentImageByListingId}
			recentViewed={recentPayload}
		/>
	);
}
