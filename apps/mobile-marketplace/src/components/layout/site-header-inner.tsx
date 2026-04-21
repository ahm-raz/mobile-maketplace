"use client";

import { Popover } from "@base-ui/react/popover";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, LayoutGrid, LogOut, Search, ShoppingBag, UserRound } from "lucide-react";
import { useCallback, useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { Button, buttonVariants } from "@/components/primitives/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/browse", label: "Browse" },
	{ href: "/search", label: "Listings" },
	{ href: "/seller", label: "Sell" },
	{ href: "/buyer", label: "Account" },
];

export type UserProfileSummary = {
	displayName: string | null;
	bio: string | null;
	avatarUrl: string | null;
	handle: string | null;
};

type SiteHeaderInnerProps = {
	isSignedIn: boolean;
	userEmail: string | null;
	userProfile: UserProfileSummary | null;
};

function displayLabel(
	displayName: string | null,
	handle: string | null,
	email: string | null,
) {
	const trimmed = displayName?.trim();
	if (trimmed) return trimmed;
	if (handle) return `@${handle}`;
	const local = email?.split("@")[0]?.trim();
	if (local) return local;
	return "Your account";
}

function initialsFromIdentity(
	displayName: string | null,
	handle: string | null,
	email: string | null,
) {
	const base = displayName?.trim() || handle || email?.split("@")[0] || "?";
	const parts = base.replace(/^@/, "").split(/[\s._-]+/).filter(Boolean);
	if (parts.length >= 2) {
		return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
	}
	return base.slice(0, 2).toUpperCase();
}

function truncateIntro(text: string, max = 160) {
	const t = text.trim();
	if (!t) return null;
	return t.length > max ? `${t.slice(0, max)}…` : t;
}

function profileIntro(profile: UserProfileSummary | null, email: string | null) {
	const bio = profile?.bio ? truncateIntro(profile.bio) : null;
	if (bio) return bio;
	if (profile?.handle) return `@${profile.handle} on Bazaar Mobile`;
	if (email) return `Signed in as ${email}`;
	return "Manage your listings, orders, and saved phones from your account.";
}

function ProfileAccountMenu({
	userEmail,
	userProfile,
}: {
	userEmail: string | null;
	userProfile: UserProfileSummary | null;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const label = displayLabel(
		userProfile?.displayName ?? null,
		userProfile?.handle ?? null,
		userEmail ?? null,
	);
	const intro = profileIntro(userProfile, userEmail ?? null);
	const initials = initialsFromIdentity(
		userProfile?.displayName ?? null,
		userProfile?.handle ?? null,
		userEmail ?? null,
	);

	const signOut = useCallback(async () => {
		setOpen(false);
		const supabase = createBrowserSupabaseClient();
		await supabase.auth.signOut();
		router.refresh();
		router.push("/");
	}, [router]);

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger
				type="button"
				aria-label="Account menu"
				aria-expanded={open}
				className={cn(
					buttonVariants({ variant: "outline", size: "icon-sm" }),
					"rounded-full p-0",
				)}
			>
				<Avatar size="sm" className="size-7 border-0 after:border-0">
					{userProfile?.avatarUrl ? (
						<AvatarImage src={userProfile.avatarUrl} alt="" />
					) : null}
					<AvatarFallback className="bg-muted text-[10px] font-semibold">
						{initials}
					</AvatarFallback>
				</Avatar>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner side="bottom" align="end" sideOffset={8}>
					<Popover.Popup
						className={cn(
							"data-[ending-style]:scale-98 data-[starting-style]:scale-98 z-50 w-[min(100vw-2rem,20rem)] origin-[var(--transform-origin)] rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
							"data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
							"transition-[transform,opacity] duration-150 ease-out data-[ending-style]:duration-100 data-[instant]:duration-0",
						)}
					>
						<Popover.Title className="sr-only">Account</Popover.Title>
						<div className="flex gap-3 border-b border-border/80 pb-3">
							<Avatar size="sm" className="size-10 shrink-0">
								{userProfile?.avatarUrl ? (
									<AvatarImage src={userProfile.avatarUrl} alt="" />
								) : null}
								<AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-foreground">{label}</p>
								<p className="mt-1 text-xs leading-snug text-muted-foreground line-clamp-3">
									{intro}
								</p>
							</div>
						</div>
						{userEmail ? (
							<p className="mt-3 truncate text-xs text-muted-foreground" title={userEmail}>
								{userEmail}
							</p>
						) : (
							<p className="mt-3 text-xs text-muted-foreground">No email on file</p>
						)}
						<div className="mt-4 flex flex-col gap-1">
							<Link
								href="/buyer/settings/profile"
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"justify-start gap-2 font-normal",
								)}
								onClick={() => setOpen(false)}
							>
								<UserRound className="size-4 shrink-0 opacity-70" aria-hidden />
								Profile settings
							</Link>
							<button
								type="button"
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"w-full justify-start gap-2 font-normal text-destructive hover:text-destructive",
								)}
								onClick={() => void signOut()}
							>
								<LogOut className="size-4 shrink-0 opacity-70" aria-hidden />
								Log out
							</button>
						</div>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}

export function SiteHeaderInner({
	isSignedIn,
	userEmail,
	userProfile,
}: SiteHeaderInnerProps) {
	const pathname = usePathname() ?? "";

	return (
		<header
			container-id="site-header"
			className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/76"
		>
			<div
				container-id="site-header-inner"
				className="mx-auto flex min-h-18 w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 xl:flex-nowrap xl:px-8"
			>
				<Link href="/" className="flex shrink-0 items-center gap-3">
					<div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
						<ShoppingBag className="size-5" aria-hidden />
					</div>
					<div className="flex flex-col leading-none">
						<span className="font-heading text-lg font-semibold tracking-tight text-foreground">
							Bazaar Mobile
						</span>
						<span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
							Pakistan phone marketplace
						</span>
					</div>
				</Link>

				<nav
					aria-label="Main"
					className="hidden rounded-full border border-border/80 bg-card/80 p-1 xl:flex xl:items-center xl:gap-1"
				>
					{navItems.map((item) => {
						const active =
							item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"rounded-full px-4 py-2 text-sm font-medium transition-colors",
									active
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-secondary hover:text-foreground",
								)}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<Link
					href="/search"
					className="order-3 flex h-11 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card/90 px-4 text-sm text-muted-foreground surface-panel xl:order-none xl:max-w-xl"
				>
					<Search className="size-4 shrink-0" aria-hidden />
					<span className="truncate">
						Search iPhone, Samsung, PTA approved, used, Karachi...
					</span>
				</Link>

				<div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
					<ThemeToggle />

					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href="/seller/listings/new"
					>
						Sell now
					</Link>

					{isSignedIn ? (
						<ProfileAccountMenu userEmail={userEmail} userProfile={userProfile} />
					) : null}

					{isSignedIn ? null : (
						<>
							<Link
								className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
								href="/sign-in"
							>
								Sign in
							</Link>
							<Link className={cn(buttonVariants({ size: "sm" }))} href="/sign-up">
								Start selling
								<ArrowRight className="size-4" />
							</Link>
						</>
					)}
				</div>

				<div className="order-4 flex w-full items-center gap-2 xl:hidden">
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
						href="/browse"
					>
						<LayoutGrid className="size-4" />
						Shop brands
					</Link>
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
						href="/buyer/favorites"
					>
						Saved phones
					</Link>
					{!isSignedIn ? (
						<Link className={cn(buttonVariants({ size: "sm" }), "flex-1")} href="/sign-up">
							Join now
						</Link>
					) : null}
				</div>
			</div>
		</header>
	);
}
