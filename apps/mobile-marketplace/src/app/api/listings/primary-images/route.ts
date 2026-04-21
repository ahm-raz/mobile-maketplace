import { NextResponse } from "next/server";

import { mapListingPrimaryImageUrls } from "@/lib/features/listings/services";

const MAX_IDS = 60;

/**
 * Returns a map of listing id → primary image URL for grid cards.
 */
export async function GET(request: Request) {
	try {
		const raw = new URL(request.url).searchParams.get("ids") ?? "";
		const ids = raw
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (ids.length === 0) {
			return NextResponse.json({ ok: true, data: {} as Record<string, string> }, { status: 200 });
		}
		if (ids.length > MAX_IDS) {
			return NextResponse.json({ ok: false, error: "Too many ids" }, { status: 400 });
		}

		const map = await mapListingPrimaryImageUrls(ids);
		const data = Object.fromEntries(map) as Record<string, string>;
		return NextResponse.json({ ok: true, data }, { status: 200 });
	} catch (error) {
		console.error("UNEXPECTED: GET /api/listings/primary-images", error);
		return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
	}
}
