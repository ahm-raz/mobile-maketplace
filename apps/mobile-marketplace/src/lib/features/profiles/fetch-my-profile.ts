import "server-only";

import { apiFetch } from "@/lib/api/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { ApiEnvelope, OwnProfile } from "./types";

/** Authenticated GET /api/profiles/me for RSC. Returns `null` if there is no session or the session is rejected. */
export async function fetchMyProfile(): Promise<OwnProfile | null> {
	const supabase = await createServerSupabaseClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session?.access_token) {
		return null;
	}

	try {
		const body = await apiFetch<ApiEnvelope<OwnProfile>>("/api/profiles/me", {
			accessToken: session.access_token,
		});
		if (!body.ok || !("data" in body) || !body.data) {
			return null;
		}
		return body.data;
	} catch (e) {
		// Avoid RSC error surfaces when the API is down or cookies lag; callers redirect to sign-in.
		console.error("fetchMyProfile:", e);
		return null;
	}
}
