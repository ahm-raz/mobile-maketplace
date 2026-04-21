"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CategoryOption, ListingRecord } from "@/lib/features/listings";
import type { CreateListingWizardInput } from "@/lib/features/listings";
import { useUpdateListing } from "@/lib/features/listings";
import { Button } from "@/components/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import { Field, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/primitives/select";
import { Textarea } from "@/components/primitives/textarea";

type ListingEditFormProps = {
	listing: ListingRecord;
	categories: CategoryOption[];
};

const CONDITIONS = ["new", "like_new", "excellent", "good", "fair", "poor"] as const;
const SALE_TYPES = ["fixed", "auction", "both"] as const;

export function ListingEditForm({ listing, categories }: ListingEditFormProps) {
	const router = useRouter();
	const update = useUpdateListing();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [categoryId, setCategoryId] = useState(listing.category_id);
	const [title, setTitle] = useState(listing.title);
	const [description, setDescription] = useState(listing.description ?? "");
	const [price, setPrice] = useState(String(listing.price));
	const [city, setCity] = useState(listing.city);
	const [area, setArea] = useState(listing.area ?? "");
	const [saleType, setSaleType] = useState(listing.sale_type);
	const [isNegotiable, setIsNegotiable] = useState(listing.is_negotiable);
	const [condition, setCondition] = useState(listing.condition as (typeof CONDITIONS)[number]);

	async function onSave() {
		setError(null);
		setBusy(true);
		try {
			const patch: Partial<CreateListingWizardInput> = {
				category_id: categoryId,
				title: title.trim(),
				description: description.trim() || null,
				price: Number(price),
				condition,
				city: city.trim(),
				area: area.trim() || null,
				sale_type: saleType as CreateListingWizardInput["sale_type"],
				is_negotiable: isNegotiable,
			};
			await update(listing.id, patch);
			router.refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Update failed");
		} finally {
			setBusy(false);
		}
	}

	return (
		<Card size="sm" container-id="listing-edit-form" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
			<CardHeader>
				<CardTitle className="text-base">Edit listing</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				{error ? (
					<p
						role="alert"
						className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
					>
						{error}
					</p>
				) : null}
				<Field>
					<FieldLabel>Category</FieldLabel>
					<Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{categories.map((c) => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field>
					<FieldLabel htmlFor="ed-title">Title</FieldLabel>
					<Input id="ed-title" value={title} onChange={(e) => setTitle(e.target.value)} />
				</Field>
				<Field>
					<FieldLabel htmlFor="ed-desc">Description</FieldLabel>
					<Textarea
						id="ed-desc"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={5}
					/>
				</Field>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="ed-price">Price</FieldLabel>
						<Input
							id="ed-price"
							inputMode="decimal"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</Field>
					<Field>
						<FieldLabel>Sale type</FieldLabel>
						<Select value={saleType} onValueChange={(v) => v && setSaleType(v as typeof saleType)}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{SALE_TYPES.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="ed-city">City</FieldLabel>
						<Input id="ed-city" value={city} onChange={(e) => setCity(e.target.value)} />
					</Field>
					<Field>
						<FieldLabel htmlFor="ed-area">Area</FieldLabel>
						<Input id="ed-area" value={area} onChange={(e) => setArea(e.target.value)} />
					</Field>
				</div>
				<Field>
					<FieldLabel>Condition</FieldLabel>
					<Select value={condition} onValueChange={(v) => v && setCondition(v as (typeof CONDITIONS)[number])}>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CONDITIONS.map((item) => (
								<SelectItem key={item} value={item}>
									{item.replaceAll("_", " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground">
					<input
						type="checkbox"
						checked={isNegotiable}
						onChange={(e) => setIsNegotiable(e.target.checked)}
					/>
					<span>Allow negotiation on this listing</span>
				</label>
				<Button
					type="button"
					className="w-full sm:w-fit sm:self-end"
					disabled={busy}
					onClick={() => void onSave()}
				>
					Save changes
				</Button>
			</CardContent>
		</Card>
	);
}
