"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/primitives/button";
import { BROWSE_LOAD_MORE_CHUNK_PATTERN } from "@/lib/features/listings/browse-scopes";
import type { ListingRecord } from "@/lib/features/listings";
import { toListingsApiQuery } from "@/lib/features/listings/search-query";
import { cn } from "@/lib/utils";

type BrowseListingsShellProps = {
	categoryIdsParam: string;
	initialListings: ListingRecord[];
	totalCount: number;
	imageByListingId: Record<string, string>;
	kicker: string;
	title: string;
	description: string;
};

async function fetchPrimaryImages(ids: string[]): Promise<Record<string, string>> {
	if (ids.length === 0) return {};
	const res = await fetch(`/api/listings/primary-images?ids=${encodeURIComponent(ids.join(","))}`);
	const body: unknown = await res.json().catch(() => null);
	if (!body || typeof body !== "object" || !("ok" in body) || !(body as { ok: boolean }).ok) {
		return {};
	}
	const data = (body as { data?: Record<string, string> }).data;
	return data && typeof data === "object" ? data : {};
}

export default function BrowseListingsShell({
	categoryIdsParam,
	initialListings,
	totalCount,
	imageByListingId: initialImages,
	kicker,
	title,
	description,
}: BrowseListingsShellProps) {
	const [listings, setListings] = useState(initialListings);
	const [images, setImages] = useState(initialImages);
	const [loadClick, setLoadClick] = useState(0);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loaded = listings.length;
	const remaining = totalCount - loaded;
	const nextChunk = useMemo(() => {
		const pattern = BROWSE_LOAD_MORE_CHUNK_PATTERN[loadClick % BROWSE_LOAD_MORE_CHUNK_PATTERN.length];
		return Math.max(0, Math.min(pattern, remaining));
	}, [loadClick, remaining]);

	const categoryIds = useMemo(
		() => categoryIdsParam.split(",").map((s) => s.trim()).filter(Boolean),
		[categoryIdsParam],
	);

	const loadMore = useCallback(async () => {
		if (nextChunk <= 0 || busy || categoryIds.length === 0) return;
		setBusy(true);
		setError(null);
		try {
			const qs = toListingsApiQuery({
				platform: "mobile",
				category_ids: categoryIds,
				limit: nextChunk,
				offset: loaded,
				sort: "newest",
			});
			const res = await fetch(`/api/listings${qs}`);
			const body: unknown = await res.json().catch(() => null);
			if (!body || typeof body !== "object" || !("ok" in body)) {
				setError("Could not load more listings.");
				return;
			}
			const envelope = body as { ok?: unknown; data?: unknown };
			if (envelope.ok !== true || !Array.isArray(envelope.data)) {
				setError("Could not load more listings.");
				return;
			}
			const newRows = envelope.data as ListingRecord[];
			setListings((prev) => [...prev, ...newRows]);
			setLoadClick((c) => c + 1);
			const thumbs = await fetchPrimaryImages(newRows.map((l) => l.id));
			setImages((prev) => ({ ...prev, ...thumbs }));
		} finally {
			setBusy(false);
		}
	}, [busy, categoryIds, loaded, nextChunk]);

	const showLoadMore = remaining > 0 && categoryIds.length > 0;

	return (
		<div container-id="browse-listings-shell" className="flex flex-col gap-8">
			<div>
				<Link
					href="/"
					className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
				>
					<ChevronLeft className="size-4" aria-hidden />
					Back to home
				</Link>
				<p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{kicker}
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
				<p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
				<p className="mt-3 text-xs text-muted-foreground">
					Showing{" "}
					<span className="font-medium text-foreground">
						{loaded}
						{totalCount > 0 ? ` of ${totalCount}` : ""}
					</span>{" "}
					active listings
					{totalCount === 0 ? " — try seeding the database or pick another category." : ""}
				</p>
			</div>

			{error ? (
				<p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			) : null}

			{listings.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
					No listings in this group yet.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{listings.map((listing) => (
						<ListingCard
							key={listing.id}
							imageUrl={images[listing.id]}
							listing={listing}
						/>
					))}
				</div>
			)}

			{showLoadMore ? (
				<div className="flex flex-col items-center gap-2 border-t border-border/80 pt-8">
					<Button
						type="button"
						size="lg"
						variant="outline"
						className={cn("min-w-[12rem]", busy && "pointer-events-none opacity-70")}
						onClick={() => void loadMore()}
					>
						{busy ? "Loading…" : `Load more (${nextChunk})`}
					</Button>
					<p className="text-center text-xs text-muted-foreground">
						Next batch loads {nextChunk} listing{nextChunk === 1 ? "" : "s"}, then cycles 10 → 20 →
						30 until everything is shown.
					</p>
				</div>
			) : null}
		</div>
	);
}
