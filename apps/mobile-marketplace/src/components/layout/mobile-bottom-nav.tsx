"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
	{ href: "/", label: "Home", icon: Home, active: (path: string) => path === "/" },
	{
		href: "/browse",
		label: "Browse",
		icon: Search,
		active: (path: string) => path.startsWith("/browse") || path.startsWith("/search"),
	},
	{
		href: "/seller",
		label: "Sell",
		icon: ShoppingBag,
		active: (path: string) => path.startsWith("/seller"),
	},
	{
		href: "/buyer/favorites",
		label: "Saved",
		icon: Heart,
		active: (path: string) => path.startsWith("/buyer/favorites") || path.startsWith("/buyer/viewed"),
	},
	{
		href: "/buyer/settings/profile",
		label: "Profile",
		icon: UserRound,
		active: (path: string) => path.startsWith("/buyer") || path.startsWith("/sellers/"),
	},
];

export function MobileBottomNav() {
	const pathname = usePathname() ?? "";

	return (
		<nav
			aria-label="Mobile navigation"
			className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 px-2 py-2 backdrop-blur lg:hidden"
		>
			<div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
				{items.map((item) => {
					const active = item.active(pathname);
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-medium transition-colors",
								active
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:bg-card hover:text-foreground",
							)}
						>
							<Icon className="size-4" aria-hidden />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
