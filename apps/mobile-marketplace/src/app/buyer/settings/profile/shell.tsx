"use client";

import Link from "next/link";

import { EditProfileForm } from "@/components/profiles/edit-profile-form";
import type { OwnProfile } from "@/lib/features/profiles/types";
import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

export default function ProfileSettingsShell({ profile }: { profile: OwnProfile }) {
	const completionItems = [
		Boolean(profile.display_name),
		Boolean(profile.avatar_url),
		Boolean(profile.city),
		Boolean(profile.bio),
	];
	const completion = Math.round(
		(completionItems.filter(Boolean).length / completionItems.length) * 100,
	);

	return (
		<div container-id="profile-settings-shell" className="flex flex-col gap-8">
			<header className="surface-panel max-w-4xl rounded-[2rem] border border-border/80 bg-card/85 p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight">Profile settings</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Update how you appear across the marketplace and complete the identity buyers
							and sellers see.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link
							href="/buyer/settings/avatar"
							className={cn(buttonVariants({ variant: "outline" }))}
						>
							Update avatar
						</Link>
					</div>
				</div>
				<div className="mt-5">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Profile completion</span>
						<span className="font-medium text-foreground">{completion}%</span>
					</div>
					<div className="mt-2 h-2 rounded-full bg-secondary">
						<div
							className="h-full rounded-full bg-primary"
							style={{ width: `${completion}%` }}
						/>
					</div>
				</div>
			</header>
			<div className="max-w-4xl">
				<EditProfileForm key={profile.updated_at} profile={profile} />
			</div>
		</div>
	);
}
