import { notFound } from "next/navigation";
import { z } from "zod";

import { listPublicListingsBySellerId, mapListingPrimaryImageUrls } from "@/lib/features/listings/services";
import { fetchSellerPublicPagePayload } from "@/lib/features/reviews/services";

import SellerPublicShell from "./shell";

const uuid = z.string().uuid();

type Props = { params: Promise<{ id: string }> };

export default async function SellerPublicPage({ params }: Props) {
	const { id } = await params;
	if (!uuid.safeParse(id).success) {
		notFound();
	}

	const payload = await fetchSellerPublicPagePayload(id);
	if (!payload) {
		notFound();
	}

	const { data: listings } = await listPublicListingsBySellerId(id, 8);
	const thumbs = await mapListingPrimaryImageUrls((listings ?? []).map((listing) => listing.id));
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<SellerPublicShell
			imageByListingId={imageByListingId}
			listings={listings ?? []}
			profile={payload.profile}
			reviewsInitial={payload.reviewsInitial}
		/>
	);
}
