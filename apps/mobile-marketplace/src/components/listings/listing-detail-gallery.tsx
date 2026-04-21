/* eslint-disable @next/next/no-img-element -- listing image URLs are dynamic remote storage; configure `next/image` domains when ready. */
"use client";

import { useState } from "react";

import type { ListingImageRecord } from "@/lib/features/listings";
import { cn } from "@/lib/utils";

type ListingDetailGalleryProps = {
	images: ListingImageRecord[];
	title: string;
	className?: string;
};

export function ListingDetailGallery({
	images,
	title,
	className,
}: ListingDetailGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (!images.length) {
		return (
			<div
				container-id="listing-gallery-empty"
				className={cn(
					"flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground",
					className,
				)}
			>
				No photos yet
			</div>
		);
	}

	const primary = images[selectedIndex] ?? images[0];

	return (
		<div container-id="listing-gallery" className={cn("flex flex-col gap-3", className)}>
			<div
				container-id="listing-gallery-primary"
				className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.8rem] bg-muted ring-1 ring-foreground/10"
			>
				<img src={primary.url} alt={title} className="h-full w-full object-cover" />
				<div className="absolute right-3 bottom-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
					{selectedIndex + 1}/{images.length}
				</div>
			</div>
			{images.length > 1 ? (
				<div
					container-id="listing-gallery-thumbs"
					className="grid grid-cols-4 gap-2 sm:grid-cols-6"
				>
					{images.slice(0, 8).map((img, index) => (
						<button
							type="button"
							key={img.id}
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 transition-opacity hover:opacity-90",
								index === selectedIndex && "ring-2 ring-primary",
							)}
						>
							<img src={img.url} alt="" className="h-full w-full object-cover" />
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
