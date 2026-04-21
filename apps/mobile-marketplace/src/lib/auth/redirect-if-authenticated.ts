import { redirect } from "next/navigation";

import { getPostSignInRedirectPath } from "@/lib/features/onboarding/post-sign-in-redirect";
import type { OwnProfile } from "@/lib/features/profiles/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * For `/sign-in` and `/sign-up`: if a session already exists, send the user to the
 * same destination as `/continue` (typically `/buyer` when onboarding is done).
 */
export async function redirectIfAlreadyAuthenticated(): Promise<void> {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return;
	}

	const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
	if (!profile) {
		redirect("/onboarding/profile");
	}

	redirect(getPostSignInRedirectPath(profile as OwnProfile));
}
