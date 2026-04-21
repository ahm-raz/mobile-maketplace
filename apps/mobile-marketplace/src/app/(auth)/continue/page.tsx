"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { ApiError, apiFetch } from "@/lib/api/client";
import { getPostSignInRedirectPath } from "@/lib/features/onboarding/post-sign-in-redirect";
import { fetchOwnProfileWithSession } from "@/lib/features/profiles/fetch-own-profile-client";
import type { ApiEnvelope, OwnProfile } from "@/lib/features/profiles/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * After `signInWithPassword` / `signUp`, the browser session exists before
 * SSR cookies are always visible. We load the profile here on the client so
 * `getSession()` matches the token we send to `GET /api/profiles/me`.
 */
export default function ContinuePage() {
	const router = useRouter();

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			const supabase = createBrowserSupabaseClient();
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (cancelled) {
				return;
			}

			if (sessionError) {
				toast.error(sessionError.message);
				router.replace("/sign-in");
				return;
			}

			if (!session?.access_token) {
				toast.error("Session not ready — try signing in again.");
				router.replace("/sign-in");
				return;
			}

			try {
				const body = await apiFetch<ApiEnvelope<OwnProfile>>("/api/profiles/me", {
					accessToken: session.access_token,
				});
				if (cancelled) {
					return;
				}
				if (!body.ok || !("data" in body) || !body.data) {
					toast.error("Could not load your profile.");
					router.replace("/sign-in");
					return;
				}
				router.replace(getPostSignInRedirectPath(body.data));
			} catch (e) {
				if (cancelled) {
					return;
				}
				const isUnreachableApi =
					e instanceof TypeError && String(e.message).toLowerCase().includes("fetch");
				if (isUnreachableApi && session.user?.id) {
					const profile = await fetchOwnProfileWithSession(supabase, session.user.id);
					if (!cancelled && profile) {
						router.replace(getPostSignInRedirectPath(profile));
						return;
					}
				}
				const hint = isUnreachableApi ? " Start the main app: npm run dev (port 3000)." : "";
				const msg =
					e instanceof ApiError
						? e.message
						: e instanceof Error
							? e.message
							: "Request failed";
				toast.error(msg + hint);
				router.replace("/sign-in");
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [router]);

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
			<p className="text-muted-foreground animate-pulse text-sm">Signing you in…</p>
		</div>
	);
}
