import { redirect } from "next/navigation";

import { BUYER_HOME_RECENT_VIEWS_LIMIT } from "./constants";
import BuyerShell from "./shell";

import { fetchMyViewedListings } from "@/lib/features/favorites/services";
import { mapListingPrimaryImageUrls } from "@/lib/features/listings/services";

export default async function BuyerHomePage() {
	const recentPayload = await fetchMyViewedListings(1, BUYER_HOME_RECENT_VIEWS_LIMIT);
	if (!recentPayload) {
		redirect("/sign-in");
	}

	const ids = recentPayload.items.map((row) => row.listing.id);
	const thumbs = await mapListingPrimaryImageUrls(ids);
	const recentImageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<BuyerShell
			recentImageByListingId={recentImageByListingId}
			recentViewed={recentPayload}
		/>
	);
}
