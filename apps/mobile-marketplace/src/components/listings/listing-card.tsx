import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, ShieldCheck } from "lucide-react";

import type { ListingRecord } from "@/lib/features/listings";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Badge } from "@/components/primitives/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/primitives/card";
import { cn } from "@/lib/utils";

type ListingCardProps = {
	listing: ListingRecord;
	imageUrl?: string | null;
	className?: string;
};

function formatCondition(condition: string): string {
	return condition.replaceAll("_", " ");
}

function formatRelativeDate(dateString: string): string {
	const diff = Date.now() - new Date(dateString).getTime();
	const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
	if (days === 1) return "1 day ago";
	if (days < 7) return `${days} days ago`;
	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
	const months = Math.floor(days / 30);
	return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function ListingCard({ listing, imageUrl, className }: ListingCardProps) {
	return (
		<Link
			href={`/listings/${listing.id}`}
			className={cn("group block focus:outline-none", className)}
		>
			<Card
				size="sm"
				className="surface-panel h-full cursor-pointer rounded-[1.6rem] border border-border/70 bg-card/90 transition-all group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:bg-accent/40 group-hover:shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-ring"
			>
				{imageUrl ? (
					<div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
						<Image
							alt=""
							className="object-cover"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
							src={imageUrl}
						/>
					</div>
				) : null}
				<CardHeader className="gap-3">
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">
							{listing.sale_type === "both" ? "Buy or bid" : listing.sale_type}
						</Badge>
						{listing.is_negotiable ? <Badge variant="outline">Negotiable</Badge> : null}
					</div>
					<CardTitle className="line-clamp-2 pr-10 text-base sm:text-lg">
						{listing.title}
					</CardTitle>
					<CardAction
						className="z-10"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<FavoriteButton listingId={listing.id} size="icon-sm" />
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<p className="text-xl font-semibold tabular-nums">
						Rs.&nbsp;{listing.price.toLocaleString("en-PK")}
					</p>
					<div className="flex flex-wrap items-center gap-2 text-sm">
						<Badge variant="secondary">{formatCondition(listing.condition)}</Badge>
						<span className="inline-flex items-center gap-1 text-muted-foreground">
							<MapPin className="size-3.5" aria-hidden />
							{listing.city}
						</span>
					</div>
					<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1">
							<Clock3 className="size-3.5" aria-hidden />
							{formatRelativeDate(listing.created_at)}
						</span>
						<span className="inline-flex items-center gap-1">
							<ShieldCheck className="size-3.5" aria-hidden />
							Marketplace checked flow
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
