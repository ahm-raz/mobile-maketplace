"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

const tabs: { href: string; label: string; isActive: (pathname: string) => boolean }[] = [
	{ href: "/buyer", label: "Home", isActive: (p) => p === "/buyer" },
	{
		href: "/buyer/favorites",
		label: "Favorites",
		isActive: (p) => p.startsWith("/buyer/favorites"),
	},
	{
		href: "/buyer/viewed",
		label: "Recently viewed",
		isActive: (p) => p.startsWith("/buyer/viewed"),
	},
	{
		href: "/buyer/settings/profile",
		label: "Settings",
		isActive: (p) => p.startsWith("/buyer/settings"),
	},
];

export function BuyerDashboardNav({ className }: { className?: string }) {
	const pathname = usePathname() ?? "";

	return (
		<nav
			aria-label="Buyer dashboard"
			container-id="buyer-dashboard-nav"
			className={cn("flex flex-wrap gap-3", className)}
		>
			{tabs.map((t) => {
				const active = t.isActive(pathname);
				return (
					<Link
						key={t.href}
						href={t.href}
						className={cn(
							buttonVariants({ variant: active ? "default" : "outline", size: "default" }),
							"shrink-0",
						)}
					>
						{t.label}
					</Link>
				);
			})}
		</nav>
	);
}
