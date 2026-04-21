import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/sign-in");
	}

	return <AppShell>{children}</AppShell>;
}
