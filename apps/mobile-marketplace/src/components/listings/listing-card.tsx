import Image from "next/image";
import Link from "next/link";

import type { ListingRecord } from "@/lib/features/listings";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Badge } from "@/components/primitives/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import { cn } from "@/lib/utils";

type ListingCardProps = {
	listing: ListingRecord;
	/** Cover image (e.g. seeded `listing_images.url`). */
	imageUrl?: string | null;
	className?: string;
};

function formatCondition(condition: string): string {
	return condition.replaceAll("_", " ");
}

export function ListingCard({ listing, imageUrl, className }: ListingCardProps) {
	return (
		<Link
			href={`/listings/${listing.id}`}
			className={cn("group block focus:outline-none", className)}
		>
			<Card
				size="sm"
				className="h-full cursor-pointer transition-all group-hover:border-foreground/20 group-hover:bg-accent/40 group-hover:shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-ring"
			>
				{imageUrl ? (
					<div className="relative aspect-[4/3] w-full shrink-0 bg-muted">
						<Image
							alt=""
							className="object-cover"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
							src={imageUrl}
						/>
					</div>
				) : null}
				<CardHeader>
					<CardTitle className="line-clamp-2 pr-10 text-base">{listing.title}</CardTitle>
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
				<CardContent className="flex flex-col gap-2">
					<p className="text-lg font-semibold tabular-nums">
						Rs.&nbsp;{listing.price.toLocaleString("en-PK")}
					</p>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{formatCondition(listing.condition)}</Badge>
						<span className="text-sm text-muted-foreground">{listing.city}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
