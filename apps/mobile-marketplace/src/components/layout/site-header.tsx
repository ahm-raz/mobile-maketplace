import { SiteHeaderInner } from "@/components/layout/site-header-inner";
import type { UserProfileSummary } from "@/components/layout/site-header-inner";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function SiteHeader() {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let profile: UserProfileSummary | null = null;
	if (user) {
		const { data } = await supabase
			.from("profiles")
			.select("display_name, bio, avatar_url, handle")
			.eq("id", user.id)
			.maybeSingle();
		if (data) {
			profile = {
				displayName: data.display_name,
				bio: data.bio,
				avatarUrl: data.avatar_url,
				handle: data.handle,
			};
		}
	}

	return (
		<SiteHeaderInner
			isSignedIn={Boolean(user)}
			userEmail={user?.email ?? null}
			userProfile={profile}
		/>
	);
}
