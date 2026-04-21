"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CategoryOption, CreateListingWizardInput } from "@/lib/features/listings";
import {
	useCreateListing,
	usePublishListing,
	useUploadImages,
} from "@/lib/features/listings";
import { ImageDropzone } from "@/components/listings/image-dropzone";
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

type CreateListingWizardProps = {
	categories: CategoryOption[];
};

const CONDITIONS = ["new", "like_new", "excellent", "good", "fair", "poor"] as const;
const SALE_TYPES = ["fixed", "auction", "both"] as const;

export function CreateListingWizard({ categories }: CreateListingWizardProps) {
	const router = useRouter();
	const createListing = useCreateListing();
	const uploadImage = useUploadImages();
	const publishListing = usePublishListing();

	const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
	const [listingId, setListingId] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [city, setCity] = useState("");
	const [area, setArea] = useState("");
	const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("good");
	const [saleType, setSaleType] = useState<(typeof SALE_TYPES)[number]>("fixed");
	const [isNegotiable, setIsNegotiable] = useState(false);

	async function submitBasics() {
		setError(null);
		setBusy(true);
		try {
			const body: CreateListingWizardInput = {
				platform: "mobile",
				category_id: categoryId,
				model_id: null,
				title: title.trim(),
				description: description.trim() || null,
				sale_type: saleType,
				price: Number(price),
				is_negotiable: isNegotiable,
				condition,
				details: {},
				city: city.trim(),
				area: area.trim() || null,
			};
			const row = await createListing(body);
			setListingId(row.id);
			setStep(2);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not create draft");
		} finally {
			setBusy(false);
		}
	}

	async function onUpload(file: File) {
		if (!listingId) return;
		setError(null);
		setBusy(true);
		try {
			await uploadImage(listingId, file);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Upload failed");
		} finally {
			setBusy(false);
		}
	}

	async function onPublish() {
		if (!listingId) return;
		setError(null);
		setBusy(true);
		try {
			await publishListing(listingId);
			router.push(`/listings/${listingId}`);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Publish failed");
		} finally {
			setBusy(false);
		}
	}

	if (!categories.length) {
		return (
			<p className="text-sm text-muted-foreground">
				No categories available. Seed the catalog first.
			</p>
		);
	}

	return (
		<div container-id="create-listing-wizard" className="flex flex-col gap-6">
			<ol
				container-id="create-listing-wizard-steps"
				className="grid gap-2 rounded-[1.6rem] border border-border/80 bg-card/75 p-4 text-sm text-muted-foreground sm:grid-cols-4"
			>
				<li className={step >= 1 ? "font-medium text-foreground" : ""}>1. Core details</li>
				<li className={step >= 2 ? "font-medium text-foreground" : ""}>2. Pricing + location</li>
				<li className={step >= 3 ? "font-medium text-foreground" : ""}>3. Photos</li>
				<li className={step >= 4 ? "font-medium text-foreground" : ""}>4. Review + publish</li>
			</ol>

			{error ? (
				<p
					role="alert"
					className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
				>
					{error}
				</p>
			) : null}

			{step === 1 ? (
				<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
					<CardHeader>
						<CardTitle className="text-base">Core details</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<Field>
							<FieldLabel>Category</FieldLabel>
							<Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Category" />
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
							<FieldLabel htmlFor="lst-title">Listing title</FieldLabel>
							<Input
								id="lst-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. iPhone 13 PTA approved, 128GB"
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="lst-desc">Description</FieldLabel>
							<Textarea
								id="lst-desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={5}
								placeholder="Mention battery health, accessories, faults, and PTA status."
							/>
						</Field>
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
						<div className="flex justify-end">
							<Button type="button" disabled={busy} onClick={() => setStep(2)}>
								Continue
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}

			{step === 2 ? (
				<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
					<CardHeader>
						<CardTitle className="text-base">Pricing and location</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="lst-price">Price</FieldLabel>
								<Input
									id="lst-price"
									inputMode="decimal"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="95000"
								/>
							</Field>
							<Field>
								<FieldLabel>Sale type</FieldLabel>
								<Select value={saleType} onValueChange={(v) => v && setSaleType(v as (typeof SALE_TYPES)[number])}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="fixed">Fixed price</SelectItem>
										<SelectItem value="auction">Auction</SelectItem>
										<SelectItem value="both">Fixed + auction</SelectItem>
									</SelectContent>
								</Select>
							</Field>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="lst-city">City</FieldLabel>
								<Input
									id="lst-city"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder="Karachi"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="lst-area">Area</FieldLabel>
								<Input
									id="lst-area"
									value={area}
									onChange={(e) => setArea(e.target.value)}
									placeholder="Gulshan"
								/>
							</Field>
						</div>
						<label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground">
							<input
								type="checkbox"
								checked={isNegotiable}
								onChange={(e) => setIsNegotiable(e.target.checked)}
							/>
							<span>Allow negotiation on this listing</span>
						</label>
						<div className="flex justify-between gap-3">
							<Button type="button" variant="outline" onClick={() => setStep(1)}>
								Back
							</Button>
							<Button type="button" disabled={busy} onClick={() => void submitBasics()}>
								Create draft
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}

			{step === 3 && listingId ? (
				<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
					<CardHeader>
						<CardTitle className="text-base">Photos</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<ImageDropzone onFile={onUpload} disabled={busy} />
						<p className="text-sm text-muted-foreground">
							Add clean front, back, sides, and any faults so buyers trust the listing.
						</p>
						<div className="flex flex-wrap justify-between gap-2">
							<Button type="button" variant="outline" onClick={() => setStep(2)} disabled={busy}>
								Back
							</Button>
							<Button type="button" onClick={() => setStep(4)} disabled={busy}>
								Continue to review
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}

			{step === 4 && listingId ? (
				<Card size="sm" className="surface-panel rounded-[1.8rem] border border-border/80 bg-card/90">
					<CardHeader>
						<CardTitle className="text-base">Review and publish</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm">
							<p><span className="font-medium">Title:</span> {title}</p>
							<p><span className="font-medium">Price:</span> Rs. {Number(price || 0).toLocaleString("en-PK")}</p>
							<p><span className="font-medium">Location:</span> {city}{area ? `, ${area}` : ""}</p>
							<p><span className="font-medium">Sale type:</span> {saleType}</p>
							<p><span className="font-medium">Negotiable:</span> {isNegotiable ? "Yes" : "No"}</p>
						</div>
						<div className="flex flex-wrap justify-between gap-2">
							<Button type="button" variant="outline" onClick={() => setStep(3)} disabled={busy}>
								Back
							</Button>
							<Button type="button" disabled={busy} onClick={() => void onPublish()}>
								Publish listing
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}
