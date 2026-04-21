"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ListingRecord } from "@/lib/features/listings";
import { useBuyNow, usePlaceBid } from "@/lib/features/listings";
import { Button, buttonVariants } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { cn } from "@/lib/utils";

type ListingActionPanelProps = {
	currentUserId: string | null;
	listing: ListingRecord;
};

export function ListingActionPanel({
	currentUserId,
	listing,
}: ListingActionPanelProps) {
	const router = useRouter();
	const buyNow = useBuyNow();
	const placeBid = usePlaceBid();
	const [bidAmount, setBidAmount] = useState(String(listing.price));
	const [error, setError] = useState<string | null>(null);
	const [busyAction, setBusyAction] = useState<"buy" | "bid" | null>(null);

	const isOwner = currentUserId === listing.user_id;
	const canBuy = !isOwner && (listing.sale_type === "fixed" || listing.sale_type === "both");
	const canBid = !isOwner && (listing.sale_type === "auction" || listing.sale_type === "both");

	async function onBuyNow() {
		setError(null);
		setBusyAction("buy");
		try {
			const result = await buyNow(listing.id);
			router.push(`/buyer/orders/${result.order_id}/review`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not start checkout");
		} finally {
			setBusyAction(null);
		}
	}

	async function onBid() {
		setError(null);
		setBusyAction("bid");
		try {
			await placeBid(listing.id, Number(bidAmount));
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not place bid");
		} finally {
			setBusyAction(null);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			{isOwner ? (
				<p className="rounded-2xl border border-border/70 bg-secondary/70 px-4 py-3 text-sm text-secondary-foreground">
					This is your listing. Manage it from your seller dashboard instead of buying or bidding.
				</p>
			) : null}
			{error ? (
				<p
					role="alert"
					className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
				>
					{error}
				</p>
			) : null}
			{canBuy ? (
				<Button type="button" disabled={busyAction !== null} onClick={() => void onBuyNow()}>
					{busyAction === "buy" ? "Starting checkout..." : "Buy now"}
				</Button>
			) : null}
			{canBid ? (
				<div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/80 p-3">
					<Input
						inputMode="numeric"
						value={bidAmount}
						onChange={(event) => setBidAmount(event.target.value)}
						placeholder="Enter bid amount"
					/>
					<Button
						type="button"
						variant="outline"
						disabled={busyAction !== null}
						onClick={() => void onBid()}
					>
						{busyAction === "bid" ? "Placing bid..." : "Place bid"}
					</Button>
				</div>
			) : null}
			<Link
				href="/search"
				className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}
			>
				Back to search
			</Link>
		</div>
	);
}
