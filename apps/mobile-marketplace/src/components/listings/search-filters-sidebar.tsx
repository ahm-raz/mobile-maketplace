"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type {
	CategoryOption,
	ListingsSearchParams,
} from "@/lib/features/listings";
import { Button } from "@/components/primitives/button";
import { Field, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/primitives/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";

type SearchFiltersSidebarProps = {
	categories: CategoryOption[];
	initial: ListingsSearchParams;
	basePath?: string;
};

function buildHref(basePath: string, next: ListingsSearchParams): string {
	const sp = new URLSearchParams();
	sp.set("platform", "mobile");
	if (next.q) sp.set("q", next.q);
	if (next.city) sp.set("city", next.city);
	if (next.price_min !== undefined) sp.set("price_min", String(next.price_min));
	if (next.price_max !== undefined) sp.set("price_max", String(next.price_max));
	if (next.model_id) sp.set("model_id", next.model_id);
	if (next.category_id) sp.set("category_id", next.category_id);
	if (next.condition) sp.set("condition", next.condition);
	if (next.sale_type) sp.set("sale_type", next.sale_type);
	if (next.is_negotiable !== undefined)
		sp.set("is_negotiable", String(next.is_negotiable));
	if (next.sort) sp.set("sort", next.sort);
	if (next.page && next.page > 1) sp.set("page", String(next.page));
	if (next.limit && next.limit !== 20) sp.set("limit", String(next.limit));
	const qs = sp.toString();
	return qs ? `${basePath}?${qs}` : `${basePath}?platform=mobile`;
}

export function SearchFiltersSidebar({
	categories,
	initial,
	basePath = "/search",
}: SearchFiltersSidebarProps) {
	const router = useRouter();
	const [q, setQ] = useState(initial.q ?? "");
	const [city, setCity] = useState(initial.city ?? "");
	const [priceMin, setPriceMin] = useState(initial.price_min?.toString() ?? "");
	const [priceMax, setPriceMax] = useState(initial.price_max?.toString() ?? "");
	const [categoryId, setCategoryId] = useState(initial.category_id ?? "all");
	const [condition, setCondition] = useState(initial.condition ?? "all");
	const [saleType, setSaleType] = useState(initial.sale_type ?? "all");
	const [sort, setSort] = useState(initial.sort ?? "newest");
	const [negotiable, setNegotiable] = useState(initial.is_negotiable ? "yes" : "all");

	function apply() {
		const next: ListingsSearchParams = {
			platform: "mobile",
			q: q.trim() || undefined,
			city: city.trim() || undefined,
			price_min: priceMin ? Number(priceMin) : undefined,
			price_max: priceMax ? Number(priceMax) : undefined,
			model_id: initial.model_id,
			category_id: categoryId === "all" ? undefined : categoryId,
			condition:
				condition === "all"
					? undefined
					: (condition as ListingsSearchParams["condition"]),
			sale_type:
				saleType === "all"
					? undefined
					: (saleType as ListingsSearchParams["sale_type"]),
			is_negotiable: negotiable === "yes" ? true : undefined,
			sort,
			page: 1,
			limit: initial.limit ?? 20,
		};
		router.push(buildHref(basePath, next));
	}

	return (
		<Card size="sm" container-id="search-filters-card">
			<CardHeader>
				<CardTitle className="text-base">Filters</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<Field>
					<FieldLabel htmlFor="search-q">Keyword</FieldLabel>
					<Input
						id="search-q"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Search title..."
					/>
				</Field>
				<Field>
					<FieldLabel>Category</FieldLabel>
					<Select
						value={categoryId}
						onValueChange={(value) => setCategoryId(value ?? "all")}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field>
					<FieldLabel htmlFor="search-city">City</FieldLabel>
					<Input
						id="search-city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						placeholder="City"
					/>
				</Field>
				<div container-id="search-filters-price" className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor="search-pmin">Min price</FieldLabel>
						<Input
							id="search-pmin"
							inputMode="numeric"
							value={priceMin}
							onChange={(e) => setPriceMin(e.target.value)}
							placeholder="0"
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="search-pmax">Max price</FieldLabel>
						<Input
							id="search-pmax"
							inputMode="numeric"
							value={priceMax}
							onChange={(e) => setPriceMax(e.target.value)}
							placeholder="No max"
						/>
					</Field>
				</div>
				<div className="grid grid-cols-1 gap-3">
					<Field>
						<FieldLabel>Condition</FieldLabel>
						<Select
							value={condition}
							onValueChange={(value) => setCondition(value ?? "all")}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Any condition</SelectItem>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="like_new">Like new</SelectItem>
								<SelectItem value="excellent">Excellent</SelectItem>
								<SelectItem value="good">Good</SelectItem>
								<SelectItem value="fair">Fair</SelectItem>
								<SelectItem value="poor">Poor</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<FieldLabel>Sale type</FieldLabel>
						<Select
							value={saleType}
							onValueChange={(value) => setSaleType(value ?? "all")}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Any sale type</SelectItem>
								<SelectItem value="fixed">Fixed price</SelectItem>
								<SelectItem value="auction">Auction</SelectItem>
								<SelectItem value="both">Fixed + auction</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<FieldLabel>Negotiable</FieldLabel>
						<Select
							value={negotiable}
							onValueChange={(value) => setNegotiable(value ?? "all")}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All listings</SelectItem>
								<SelectItem value="yes">Negotiable only</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<FieldLabel>Sort</FieldLabel>
						<Select
							value={sort}
							onValueChange={(value) =>
								setSort(value as NonNullable<ListingsSearchParams["sort"]>)
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest first</SelectItem>
								<SelectItem value="price_low">Price: low to high</SelectItem>
								<SelectItem value="price_high">Price: high to low</SelectItem>
							</SelectContent>
						</Select>
					</Field>
				</div>
				<Button type="button" onClick={apply} className="w-full">
					Apply filters
				</Button>
			</CardContent>
		</Card>
	);
}
