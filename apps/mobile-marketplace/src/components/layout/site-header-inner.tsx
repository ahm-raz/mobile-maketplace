"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/primitives/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navLinkClass =
	"text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

type SiteHeaderInnerProps = {
	isSignedIn: boolean;
	userEmail: string | null;
};

export function SiteHeaderInner({ isSignedIn, userEmail }: SiteHeaderInnerProps) {
	const router = useRouter();

	return (
		<header
			container-id="site-header"
			className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
		>
			<div
				container-id="site-header-inner"
				className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:h-16 sm:px-6 lg:px-8"
			>
				<Link
					href="/"
					className="text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base"
				>
					Mobile marketplace
				</Link>
				<nav
					aria-label="Main"
					className="hidden flex-1 items-center justify-center gap-6 sm:flex lg:gap-8"
				>
					<Link className={navLinkClass} href="/">
						Browse
					</Link>
					<Link className={navLinkClass} href="/seller">
						Sell
					</Link>
					<Link className={navLinkClass} href="/buyer">
						Buy
					</Link>
				</nav>
				<div className="ml-auto flex max-w-[min(100%,14rem)] flex-wrap items-center justify-end gap-2 sm:ml-0 sm:max-w-none">
					{isSignedIn && userEmail ? (
						<span
							className="hidden max-w-[10rem] truncate text-xs text-muted-foreground lg:inline"
							title={userEmail}
						>
							{userEmail}
						</span>
					) : null}
					{isSignedIn ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={async () => {
								const supabase = createBrowserSupabaseClient();
								await supabase.auth.signOut();
								router.refresh();
								router.push("/");
							}}
						>
							Log out
						</Button>
					) : (
						<Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href="/sign-in">
							Sign in
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
