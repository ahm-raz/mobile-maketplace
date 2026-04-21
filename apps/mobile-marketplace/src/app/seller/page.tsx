import { redirect } from "next/navigation";

import SellerShell from "./shell";

import { listSellerListings, mapListingPrimaryImageUrls } from "@/lib/features/listings/services";
import { fetchMyProfile } from "@/lib/features/profiles/fetch-my-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SellerHomePage() {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/sign-in");
	}

	const [profile, listingsResult] = await Promise.all([
		fetchMyProfile(),
		listSellerListings(user.id),
	]);
	const listings = listingsResult.data ?? [];
	const thumbs = await mapListingPrimaryImageUrls(listings.map((item) => item.id));
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<SellerShell
			imageByListingId={imageByListingId}
			listings={listings}
			profile={profile}
		/>
	);
}
