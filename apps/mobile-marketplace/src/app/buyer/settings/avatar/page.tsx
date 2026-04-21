import { redirect } from "next/navigation";

import { fetchMyProfile } from "@/lib/features/profiles/fetch-my-profile";

import AvatarSettingsShell from "./shell";

export default async function BuyerAvatarSettingsPage() {
	const profile = await fetchMyProfile();
	if (!profile) {
		redirect("/sign-in");
	}

	return <AvatarSettingsShell profile={profile} />;
}
