import { redirect } from "next/navigation";

import { BUYER_VIEWED_HISTORY_PAGE_LIMIT } from "../constants";

import { fetchMyViewedListings } from "@/lib/features/favorites/services";
import { mapListingPrimaryImageUrls } from "@/lib/features/listings/services";

import ViewedShell from "./shell";

function parsePage(raw: Record<string, string | string[] | undefined>): number {
	const v = raw.page;
	const s = Array.isArray(v) ? v[0] : v;
	const n = Number.parseInt(String(s ?? "1"), 10);
	if (!Number.isFinite(n) || n < 1) {
		return 1;
	}
	return Math.min(n, 10_000);
}

export default async function BuyerViewedPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const raw = await searchParams;
	const page = parsePage(raw);

	const payload = await fetchMyViewedListings(page, BUYER_VIEWED_HISTORY_PAGE_LIMIT);
	if (!payload) {
		redirect("/sign-in");
	}

	const ids = payload.items.map((row) => row.listing.id);
	const thumbs = await mapListingPrimaryImageUrls(ids);
	const imageByListingId = Object.fromEntries(thumbs) as Record<string, string>;

	return (
		<ViewedShell imageByListingId={imageByListingId} page={page} payload={payload} />
	);
}
