import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Brand } from "@/lib/features/product-catalog/types";
import type { CategoryOption, ListingRecord } from "@/lib/features/listings";
import { BROWSE_SCOPE_HOME_HREFS } from "@/lib/features/listings/browse-scopes";

import HomeShell from "./shell";

const demoBrands: Brand[] = [
	{
		id: "b1",
		platform: "mobile",
		name: "Apple",
		slug: "apple",
		logo_url: null,
		created_at: "",
		updated_at: "",
	},
	{
		id: "b2",
		platform: "mobile",
		name: "Samsung",
		slug: "samsung",
		logo_url: null,
		created_at: "",
		updated_at: "",
	},
	{
		id: "b3",
		platform: "mobile",
		name: "Redmi",
		slug: "redmi",
		logo_url: null,
		created_at: "",
		updated_at: "",
	},
];

const demoCategories: CategoryOption[] = [
	{ id: "c-sm", name: "Smartphones", slug: "smartphones" },
	{ id: "c-g", name: "Gaming Phones", slug: "gaming-phones" },
	{ id: "c-f", name: "Foldables", slug: "foldables" },
	{ id: "c-fe", name: "Feature Phones", slug: "feature-phones" },
	{ id: "c-tab", name: "Tablets", slug: "tablets" },
	{ id: "c-w", name: "Smart Watches", slug: "smart-watches" },
];

const demoListing: ListingRecord = {
	id: "f0000001-0000-4000-b000-000000000001",
	user_id: "eeeeeeee-0001-4000-8000-000000000001",
	platform: "mobile",
	category_id: "c0000001-0000-4000-8000-000000000002",
	model_id: "d0000001-0000-4000-b000-000000000001",
	title: "iPhone 15 Pro 256GB demo card",
	description: null,
	sale_type: "fixed",
	price: 284_999,
	is_negotiable: true,
	condition: "like_new",
	details: {},
	city: "Karachi",
	area: "DHA",
	status: "active",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	deleted_at: null,
};

const meta = {
	title: "Pages/Public/Home",
	component: HomeShell,
	args: {
		brands: demoBrands,
		categories: demoCategories,
		featuredMixed: [demoListing],
		featuredPhones: [demoListing],
		featuredWatches: [demoListing],
		featuredTablets: [demoListing],
		imageByListingId: {
			[demoListing.id]:
				"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
		},
		viewAllHrefs: BROWSE_SCOPE_HOME_HREFS,
	},
} satisfies Meta<typeof HomeShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Empty: Story = {
	args: {
		brands: demoBrands,
		categories: demoCategories,
		featuredMixed: [],
		featuredPhones: [],
		featuredWatches: [],
		featuredTablets: [],
		imageByListingId: {},
		viewAllHrefs: BROWSE_SCOPE_HOME_HREFS,
	},
};
