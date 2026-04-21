import { NextResponse } from "next/server";

import { listingsSearchParamsSchema } from "@/lib/features/listings/schemas";
import { searchListingsPublic } from "@/lib/features/listings/services";

/**
 * Public listing search for the mobile-marketplace app (same-origin).
 */
export async function GET(request: Request) {
	try {
		const flat = Object.fromEntries(new URL(request.url).searchParams.entries());
		const parsed = listingsSearchParamsSchema.safeParse(flat);
		if (!parsed.success) {
			return NextResponse.json({ ok: false, error: "Invalid query parameters" }, { status: 400 });
		}

		const { data, pagination, error } = await searchListingsPublic(parsed.data);
		if (error) {
			return NextResponse.json({ ok: false, error: "Failed to search listings" }, { status: 500 });
		}

		return NextResponse.json(
			{ ok: true, data: data ?? [], pagination },
			{ status: 200 },
		);
	} catch (error) {
		console.error("UNEXPECTED: GET /api/listings", error);
		return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
	}
}
