import { notFound } from "next/navigation";

import ListingDetailShell from "./shell";

import { getListingDetailPagePayload, mapListingPrimaryImageUrls, searchListingsPublic } from "@/lib/features/listings/services";
import { fetchPublicProfile } from "@/lib/features/profiles/fetch-public-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ListingDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data, error } = await getListingDetailPagePayload(id, user?.id ?? null);
	if (error) {
		if (error instanceof Error) throw error;
		throw new Error("Failed to load listing", { cause: error });
	}
	if (!data) {
		notFound();
	}

	const sellerProfile = await fetchPublicProfile(data.listing.user_id);
	const { data: similar } = await searchListingsPublic({
		platform: "mobile",
		category_id: data.listing.category_id,
		limit: 5,
		page: 1,
	});
	const similarListings = (similar ?? []).filter((item) => item.id !== data.listing.id).slice(0, 4);
	const similarImages = await mapListingPrimaryImageUrls(similarListings.map((item) => item.id));
	const similarImageByListingId = Object.fromEntries(similarImages) as Record<string, string>;

	return (
		<ListingDetailShell
			currentUserId={user?.id ?? null}
			listing={data.listing}
			images={data.images}
			sellerProfile={sellerProfile}
			sellerReviews={data.sellerReviews}
			similarImageByListingId={similarImageByListingId}
			similarListings={similarListings}
		/>
	);
}
