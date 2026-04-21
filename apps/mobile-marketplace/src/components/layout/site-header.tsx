import { SiteHeaderInner } from "@/components/layout/site-header-inner";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function SiteHeader() {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<SiteHeaderInner isSignedIn={Boolean(user)} userEmail={user?.email ?? null} />
	);
}
