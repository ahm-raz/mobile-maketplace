-- ============================================================================
-- Local dev seed — mobile marketplace (phones), OLX-style browse data + photos
-- ============================================================================
--
-- Run via: npm run supabase:reset   (or first-time supabase start)
--
-- Demo logins (email / password):
--   ahmed.phones@seed.local  / password123
--   sara.gadgets@seed.local  / password123
--   omar.tech@seed.local     / password123
--
-- Images use stable HTTPS URLs (Unsplash) so listings show real phone photos
-- without uploading to Storage. Production listings still use listing-images bucket.
--

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Auth users + identities (local GoTrue)
-- ---------------------------------------------------------------------------

INSERT INTO auth.users (
	instance_id,
	id,
	aud,
	role,
	email,
	encrypted_password,
	email_confirmed_at,
	raw_app_meta_data,
	raw_user_meta_data,
	created_at,
	updated_at,
	is_sso_user,
	is_anonymous
)
VALUES
	(
		'00000000-0000-0000-0000-000000000000',
		'eeeeeeee-0001-4000-8000-000000000001',
		'authenticated',
		'authenticated',
		'ahmed.phones@seed.local',
		crypt('password123', gen_salt('bf')),
		now(),
		'{"provider":"email","providers":["email"]}'::jsonb,
		'{"full_name": "Ahmed Phones"}'::jsonb,
		now(),
		now(),
		false,
		false
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'eeeeeeee-0002-4000-8000-000000000002',
		'authenticated',
		'authenticated',
		'sara.gadgets@seed.local',
		crypt('password123', gen_salt('bf')),
		now(),
		'{"provider":"email","providers":["email"]}'::jsonb,
		'{"full_name": "Sara Gadgets"}'::jsonb,
		now(),
		now(),
		false,
		false
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'eeeeeeee-0003-4000-8000-000000000003',
		'authenticated',
		'authenticated',
		'omar.tech@seed.local',
		crypt('password123', gen_salt('bf')),
		now(),
		'{"provider":"email","providers":["email"]}'::jsonb,
		'{"full_name": "Omar Tech"}'::jsonb,
		now(),
		now(),
		false,
		false
	);

-- GoTrue scans these varchar columns as non-nullable strings; SQL inserts leave them NULL and
-- sign-in returns "Database error querying schema" (see supabase/auth#1940).
UPDATE auth.users
SET
	confirmation_token = '',
	recovery_token = '',
	email_change_token_new = '',
	email_change = '',
	phone_change = ''
WHERE email LIKE '%@seed.local';

INSERT INTO auth.identities (
	id,
	user_id,
	provider_id,
	identity_data,
	provider,
	last_sign_in_at,
	created_at,
	updated_at
)
SELECT
	gen_random_uuid(),
	id,
	id::text,
	jsonb_build_object(
		'sub', id::text,
		'email', email,
		'email_verified', true
	),
	'email',
	now(),
	now(),
	now()
FROM auth.users
WHERE email LIKE '%@seed.local';

-- Profiles: handles + cities (trigger already created base rows)
UPDATE public.profiles
SET
	handle = 'ahmed_phones',
	display_name = 'Ahmed Phones',
	city = 'Karachi',
	area = 'Clifton',
	onboarding_completed_at = now()
WHERE id = 'eeeeeeee-0001-4000-8000-000000000001';

UPDATE public.profiles
SET
	handle = 'sara_gadgets',
	display_name = 'Sara Gadgets',
	city = 'Lahore',
	area = 'Gulberg',
	onboarding_completed_at = now()
WHERE id = 'eeeeeeee-0002-4000-8000-000000000002';

UPDATE public.profiles
SET
	handle = 'omar_tech',
	display_name = 'Omar Tech',
	city = 'Islamabad',
	area = 'F-7',
	onboarding_completed_at = now()
WHERE id = 'eeeeeeee-0003-4000-8000-000000000003';

-- ---------------------------------------------------------------------------
-- Catalog (platform = mobile) — categories, brands, models, specs
-- ---------------------------------------------------------------------------

INSERT INTO categories (
	id,
	platform,
	name,
	slug,
	parent_id,
	position,
	spec_schema
)
VALUES
	(
		'c0000001-0000-4000-8000-000000000001',
		'mobile',
		'Mobile Phones',
		'mobile-phones',
		NULL,
		1,
		'{"ram_gb":"number","storage_gb":"number","color":"string","battery_health_pct":"number","pta_status":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000002',
		'mobile',
		'Smartphones',
		'smartphones',
		'c0000001-0000-4000-8000-000000000001',
		1,
		'{"ram_gb":"number","storage_gb":"number","color":"string","battery_health_pct":"number","pta_status":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000003',
		'mobile',
		'Tablets',
		'tablets',
		'c0000001-0000-4000-8000-000000000001',
		2,
		'{"ram_gb":"number","storage_gb":"number","color":"string","screen_in":"number"}'::jsonb
	);

INSERT INTO brands (id, platform, name, slug, logo_url)
VALUES
	('b0000001-0000-4000-8000-000000000001', 'mobile', 'Apple', 'apple', NULL),
	('b0000001-0000-4000-8000-000000000002', 'mobile', 'Samsung', 'samsung', NULL),
	('b0000001-0000-4000-8000-000000000003', 'mobile', 'Xiaomi', 'xiaomi', NULL),
	('b0000001-0000-4000-8000-000000000004', 'mobile', 'Google', 'google', NULL),
	('b0000001-0000-4000-8000-000000000005', 'mobile', 'OnePlus', 'oneplus', NULL),
	('b0000001-0000-4000-8000-000000000006', 'mobile', 'Realme', 'realme', NULL),
	('b0000001-0000-4000-8000-000000000007', 'mobile', 'Nokia', 'nokia', NULL),
	('b0000001-0000-4000-8000-000000000008', 'mobile', 'Redmi', 'redmi', NULL);

INSERT INTO models (id, brand_id, category_id, name, slug, year, image_url, is_active)
VALUES
	(
		'd0000001-0000-4000-b000-000000000001',
		'b0000001-0000-4000-8000-000000000001',
		'c0000001-0000-4000-8000-000000000002',
		'iPhone 15 Pro',
		'iphone-15-pro',
		2024,
		'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
		true
	),
	(
		'd0000002-0000-4000-b000-000000000002',
		'b0000001-0000-4000-8000-000000000001',
		'c0000001-0000-4000-8000-000000000002',
		'iPhone 14',
		'iphone-14',
		2023,
		'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
		true
	),
	(
		'd0000003-0000-4000-b000-000000000003',
		'b0000001-0000-4000-8000-000000000002',
		'c0000001-0000-4000-8000-000000000002',
		'Galaxy S24 Ultra',
		'galaxy-s24-ultra',
		2024,
		'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
		true
	),
	(
		'd0000004-0000-4000-b000-000000000004',
		'b0000001-0000-4000-8000-000000000002',
		'c0000001-0000-4000-8000-000000000002',
		'Galaxy A54',
		'galaxy-a54',
		2023,
		'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
		true
	),
	(
		'd0000005-0000-4000-b000-000000000005',
		'b0000001-0000-4000-8000-000000000003',
		'c0000001-0000-4000-8000-000000000002',
		'Redmi Note 13 Pro',
		'redmi-note-13-pro',
		2024,
		'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
		true
	),
	(
		'd0000006-0000-4000-b000-000000000006',
		'b0000001-0000-4000-8000-000000000004',
		'c0000001-0000-4000-8000-000000000002',
		'Pixel 8 Pro',
		'pixel-8-pro',
		2023,
		'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
		true
	),
	(
		'd0000007-0000-4000-b000-000000000007',
		'b0000001-0000-4000-8000-000000000005',
		'c0000001-0000-4000-8000-000000000002',
		'OnePlus 12',
		'oneplus-12',
		2024,
		'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&sat=-100',
		true
	),
	(
		'd0000008-0000-4000-b000-000000000008',
		'b0000001-0000-4000-8000-000000000002',
		'c0000001-0000-4000-8000-000000000003',
		'Galaxy Tab S9',
		'galaxy-tab-s9',
		2023,
		'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
		true
	),
	(
		'd0000009-0000-4000-b000-000000000009',
		'b0000001-0000-4000-8000-000000000003',
		'c0000001-0000-4000-8000-000000000002',
		'Xiaomi 14',
		'xiaomi-14',
		2024,
		'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
		true
	),
	(
		'd0000010-0000-4000-b000-000000000010',
		'b0000001-0000-4000-8000-000000000006',
		'c0000001-0000-4000-8000-000000000002',
		'Realme 12',
		'realme-12',
		2024,
		'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
		true
	),
	(
		'd0000011-0000-4000-b000-000000000011',
		'b0000001-0000-4000-8000-000000000007',
		'c0000001-0000-4000-8000-000000000002',
		'Nokia G42',
		'nokia-g42',
		2023,
		'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
		true
	);

INSERT INTO specifications (model_id, specs)
VALUES
	('d0000001-0000-4000-b000-000000000001', '{"display_in":"6.1","chip":"A17 Pro","network":"5G"}'::jsonb),
	('d0000002-0000-4000-b000-000000000002', '{"display_in":"6.1","chip":"A15","network":"5G"}'::jsonb),
	('d0000003-0000-4000-b000-000000000003', '{"display_in":"6.8","chip":"Snapdragon 8 Gen 3","network":"5G"}'::jsonb),
	('d0000004-0000-4000-b000-000000000004', '{"display_in":"6.4","chip":"Exynos 1380","network":"5G"}'::jsonb),
	('d0000005-0000-4000-b000-000000000005', '{"display_in":"6.67","chip":"Dimensity 7200-Ultra","network":"5G"}'::jsonb),
	('d0000006-0000-4000-b000-000000000006', '{"display_in":"6.7","chip":"Tensor G3","network":"5G"}'::jsonb),
	('d0000007-0000-4000-b000-000000000007', '{"display_in":"6.82","chip":"Snapdragon 8 Gen 3","network":"5G"}'::jsonb),
	('d0000008-0000-4000-b000-000000000008', '{"display_in":"11","chip":"Snapdragon 8 Gen 2"}'::jsonb),
	('d0000009-0000-4000-b000-000000000009', '{"display_in":"6.36","chip":"Snapdragon 8 Gen 3","network":"5G"}'::jsonb),
	('d0000010-0000-4000-b000-000000000010', '{"display_in":"6.72","chip":"Dimensity 6100+","network":"5G"}'::jsonb),
	('d0000011-0000-4000-b000-000000000011', '{"display_in":"6.56","chip":"Snapdragon 480+","network":"5G"}'::jsonb);

-- ---------------------------------------------------------------------------
-- Listings + images (external photo URLs — readable without Storage upload)
-- ---------------------------------------------------------------------------

INSERT INTO listings (
	id,
	user_id,
	platform,
	category_id,
	model_id,
	title,
	description,
	sale_type,
	price,
	is_negotiable,
	condition,
	details,
	city,
	area,
	status,
	published_at,
	expires_at
)
VALUES
	(
		'f0000001-0000-4000-b000-000000000001',
		'eeeeeeee-0001-4000-8000-000000000001',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000001-0000-4000-b000-000000000001',
		'iPhone 15 Pro 256GB Natural Titanium — PTA approved',
		'Box opened for checking only. 10/10 condition. Original cable + case. Selling because upgrading.',
		'fixed',
		284999.00,
		true,
		'like_new',
		'{"ram_gb":8,"storage_gb":256,"color":"Natural Titanium","battery_health_pct":100,"pta_status":"approved"}'::jsonb,
		'Karachi',
		'DHA Phase 6',
		'active',
		now() - interval '2 days',
		now() + interval '25 days'
	),
	(
		'f0000002-0000-4000-b000-000000000002',
		'eeeeeeee-0001-4000-8000-000000000001',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000002-0000-4000-b000-000000000002',
		'iPhone 14 128GB Midnight',
		'Minor scratches on frame, screen perfect. Battery 91%. Bill available.',
		'fixed',
		162500.00,
		true,
		'good',
		'{"ram_gb":6,"storage_gb":128,"color":"Midnight","battery_health_pct":91,"pta_status":"approved"}'::jsonb,
		'Karachi',
		'North Nazimabad',
		'active',
		now() - interval '5 days',
		now() + interval '22 days'
	),
	(
		'f0000003-0000-4000-b000-000000000003',
		'eeeeeeee-0002-4000-8000-000000000002',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000003-0000-4000-b000-000000000003',
		'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
		'Flagship with S Pen. Imported; PTA patched. No dents.',
		'both',
		339900.00,
		false,
		'excellent',
		'{"ram_gb":12,"storage_gb":512,"color":"Titanium Gray","battery_health_pct":98,"pta_status":"patched"}'::jsonb,
		'Lahore',
		'Johar Town',
		'active',
		now() - interval '1 day',
		now() + interval '27 days'
	),
	(
		'f0000004-0000-4000-b000-000000000004',
		'eeeeeeee-0002-4000-8000-000000000002',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000004-0000-4000-b000-000000000004',
		'Samsung Galaxy A54 5G Awesome Graphite',
		'Great mid-range phone. Used 8 months, always with glass protector.',
		'fixed',
		68500.00,
		true,
		'excellent',
		'{"ram_gb":8,"storage_gb":128,"color":"Awesome Graphite","battery_health_pct":96,"pta_status":"approved"}'::jsonb,
		'Lahore',
		'Model Town',
		'active',
		now() - interval '3 days',
		now() + interval '20 days'
	),
	(
		'f0000005-0000-4000-b000-000000000005',
		'eeeeeeee-0003-4000-8000-000000000003',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000005-0000-4000-b000-000000000005',
		'Xiaomi Redmi Note 13 Pro 8/256 Aurora Purple',
		'120Hz AMOLED, 200MP camera. Open box, full accessories.',
		'fixed',
		72999.00,
		true,
		'new',
		'{"ram_gb":8,"storage_gb":256,"color":"Aurora Purple","battery_health_pct":100,"pta_status":"approved"}'::jsonb,
		'Islamabad',
		'F-10',
		'active',
		now() - interval '6 hours',
		now() + interval '29 days'
	),
	(
		'f0000006-0000-4000-b000-000000000006',
		'eeeeeeee-0003-4000-8000-000000000003',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000006-0000-4000-b000-000000000006',
		'Google Pixel 8 Pro Bay',
		'Best camera for photos. Monthly updates. Small chip on corner (see photos).',
		'fixed',
		198000.00,
		true,
		'good',
		'{"ram_gb":12,"storage_gb":128,"color":"Bay","battery_health_pct":94,"pta_status":"approved"}'::jsonb,
		'Rawalpindi',
		'Bahria Town',
		'active',
		now() - interval '4 days',
		now() + interval '18 days'
	),
	(
		'f0000007-0000-4000-b000-000000000007',
		'eeeeeeee-0001-4000-8000-000000000001',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000007-0000-4000-b000-000000000007',
		'OnePlus 12 Flowy Emerald 16/512',
		'Fast charging 100W. Dual physical SIM slots. Warranty till next year.',
		'auction',
		175000.00,
		false,
		'like_new',
		'{"ram_gb":16,"storage_gb":512,"color":"Flowy Emerald","battery_health_pct":99,"pta_status":"approved"}'::jsonb,
		'Karachi',
		'Gulistan-e-Jauhar',
		'active',
		now() - interval '12 hours',
		now() + interval '28 days'
	),
	(
		'f0000008-0000-4000-b000-000000000008',
		'eeeeeeee-0002-4000-8000-000000000002',
		'mobile',
		'c0000001-0000-4000-8000-000000000003',
		'd0000008-0000-4000-b000-000000000008',
		'Samsung Galaxy Tab S9 128GB WiFi + keyboard cover',
		'Productivity tablet, AMOLED 120Hz. Keyboard and S Pen included.',
		'fixed',
		142000.00,
		true,
		'excellent',
		'{"ram_gb":8,"storage_gb":128,"color":"Graphite","screen_in":11}'::jsonb,
		'Lahore',
		'Defence Raya',
		'active',
		now() - interval '7 days',
		now() + interval '21 days'
	),
	(
		'f0000009-0000-4000-b000-000000000009',
		'eeeeeeee-0002-4000-8000-000000000002',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000010-0000-4000-b000-000000000010',
		'Realme 12 5G 8/256 Navigator Green',
		'Demo seed listing for buyer recently viewed history.',
		'fixed',
		52499.00,
		true,
		'like_new',
		'{"ram_gb":8,"storage_gb":256,"color":"Navigator Green","battery_health_pct":100,"pta_status":"approved"}'::jsonb,
		'Lahore',
		'Valencia',
		'active',
		now() - interval '8 hours',
		now() + interval '24 days'
	),
	(
		'f0000010-0000-4000-b000-000000000010',
		'eeeeeeee-0001-4000-8000-000000000001',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000011-0000-4000-b000-000000000011',
		'Nokia G42 5G 6/128 So Purple',
		'Demo seed listing for buyer recently viewed history.',
		'fixed',
		38500.00,
		true,
		'excellent',
		'{"ram_gb":6,"storage_gb":128,"color":"So Purple","battery_health_pct":97,"pta_status":"approved"}'::jsonb,
		'Karachi',
		'Korangi',
		'active',
		now() - interval '3 hours',
		now() + interval '26 days'
	),
	(
		'f0000011-0000-4000-b000-000000000011',
		'eeeeeeee-0003-4000-8000-000000000003',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000009-0000-4000-b000-000000000009',
		'Xiaomi 14 12/512 Black',
		'Demo seed listing for buyer recently viewed history.',
		'fixed',
		199999.00,
		false,
		'like_new',
		'{"ram_gb":12,"storage_gb":512,"color":"Black","battery_health_pct":100,"pta_status":"approved"}'::jsonb,
		'Islamabad',
		'Blue Area',
		'active',
		now() - interval '14 hours',
		now() + interval '20 days'
	);

-- Auction config for listing 007 (sale_type = auction)
INSERT INTO auction_config (
	listing_id,
	starting_price,
	min_increment,
	auction_start_at,
	auction_end_at,
	anti_snipe_minutes
)
VALUES (
	'f0000007-0000-4000-b000-000000000007',
	165000.00,
	1000.00,
	now() - interval '6 hours',
	now() + interval '3 days',
	5
);

UPDATE listings
SET current_bid = 172000.00
WHERE id = 'f0000007-0000-4000-b000-000000000007';

-- Listing images: storage_path is synthetic; url is what the UI shows for seeded demos
INSERT INTO listing_images (listing_id, storage_path, url, position)
VALUES
	('f0000001-0000-4000-b000-000000000001', 'seed/f0000001-0000-4000-b000-000000000001/0.jpg', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=85', 0),
	('f0000001-0000-4000-b000-000000000001', 'seed/f0000001-0000-4000-b000-000000000001/1.jpg', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=85', 1),
	('f0000001-0000-4000-b000-000000000001', 'seed/f0000001-0000-4000-b000-000000000001/2.jpg', 'https://images.unsplash.com/photo-1580910051074-3d6948262468?w=1200&q=85', 2),
	('f0000002-0000-4000-b000-000000000002', 'seed/f0000002-0000-4000-b000-000000000002/0.jpg', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=1200&q=85', 0),
	('f0000002-0000-4000-b000-000000000002', 'seed/f0000002-0000-4000-b000-000000000002/1.jpg', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85', 1),
	('f0000003-0000-4000-b000-000000000003', 'seed/f0000003-0000-4000-b000-000000000003/0.jpg', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=85', 0),
	('f0000003-0000-4000-b000-000000000003', 'seed/f0000003-0000-4000-b000-000000000003/1.jpg', 'https://images.unsplash.com/photo-1574944985070-8f6e2f3b6e2e?w=1200&q=85', 1),
	('f0000003-0000-4000-b000-000000000003', 'seed/f0000003-0000-4000-b000-000000000003/2.jpg', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=85', 2),
	('f0000004-0000-4000-b000-000000000004', 'seed/f0000004-0000-4000-b000-000000000004/0.jpg', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85', 0),
	('f0000004-0000-4000-b000-000000000004', 'seed/f0000004-0000-4000-b000-000000000004/1.jpg', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&q=85', 1),
	('f0000005-0000-4000-b000-000000000005', 'seed/f0000005-0000-4000-b000-000000000005/0.jpg', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&q=85', 0),
	('f0000005-0000-4000-b000-000000000005', 'seed/f0000005-0000-4000-b000-000000000005/1.jpg', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=85', 1),
	('f0000006-0000-4000-b000-000000000006', 'seed/f0000006-0000-4000-b000-000000000006/0.jpg', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=85', 0),
	('f0000006-0000-4000-b000-000000000006', 'seed/f0000006-0000-4000-b000-000000000006/1.jpg', 'https://images.unsplash.com/photo-1618384887929-16ec33fab8ef?w=1200&q=85', 1),
	('f0000007-0000-4000-b000-000000000007', 'seed/f0000007-0000-4000-b000-000000000007/0.jpg', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85&sat=-100', 0),
	('f0000007-0000-4000-b000-000000000007', 'seed/f0000007-0000-4000-b000-000000000007/1.jpg', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=85', 1),
	('f0000008-0000-4000-b000-000000000008', 'seed/f0000008-0000-4000-b000-000000000008/0.jpg', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=85', 0),
	('f0000008-0000-4000-b000-000000000008', 'seed/f0000008-0000-4000-b000-000000000008/1.jpg', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&q=85', 1),
	('f0000009-0000-4000-b000-000000000009', 'seed/f0000009-0000-4000-b000-000000000009/0.jpg', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=85', 0),
	('f0000010-0000-4000-b000-000000000010', 'seed/f0000010-0000-4000-b000-000000000010/0.jpg', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&q=85', 0),
	('f0000011-0000-4000-b000-000000000011', 'seed/f0000011-0000-4000-b000-000000000011/0.jpg', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85', 0);

-- Ahmed demo account: 11 distinct viewed listings (dashboard shows 10; "See more" lists full history)
INSERT INTO public.viewed_listings (user_id, listing_id, viewed_at)
VALUES
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000001-0000-4000-b000-000000000001', now() - interval '25 minutes'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000002-0000-4000-b000-000000000002', now() - interval '2 hours'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000003-0000-4000-b000-000000000003', now() - interval '6 hours'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000004-0000-4000-b000-000000000004', now() - interval '1 day'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000005-0000-4000-b000-000000000005', now() - interval '2 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000006-0000-4000-b000-000000000006', now() - interval '3 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000007-0000-4000-b000-000000000007', now() - interval '4 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000008-0000-4000-b000-000000000008', now() - interval '5 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000009-0000-4000-b000-000000000009', now() - interval '6 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000010-0000-4000-b000-000000000010', now() - interval '8 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000011-0000-4000-b000-000000000011', now() - interval '10 days');

-- Keep profile listing counts in sync with trigger expectations (if aggregates used)
UPDATE public.profiles p
SET total_listings = s.c
FROM (
	SELECT user_id, count(*)::int AS c
	FROM listings
	WHERE deleted_at IS NULL AND status = 'active'
	GROUP BY user_id
) s
WHERE p.id = s.user_id;

-- ---------------------------------------------------------------------------
-- Expanded demo accounts, richer profiles, additional categories/catalog rows,
-- more listings, favorites, and recently viewed history
-- ---------------------------------------------------------------------------

INSERT INTO auth.users (
	instance_id,
	id,
	aud,
	role,
	email,
	encrypted_password,
	email_confirmed_at,
	raw_app_meta_data,
	raw_user_meta_data,
	created_at,
	updated_at,
	is_sso_user,
	is_anonymous
)
VALUES
	(
		'00000000-0000-0000-0000-000000000000',
		'eeeeeeee-0004-4000-8000-000000000004',
		'authenticated',
		'authenticated',
		'zain.mobilehub@seed.local',
		crypt('password123', gen_salt('bf')),
		now(),
		'{"provider":"email","providers":["email"]}'::jsonb,
		'{"full_name": "Zain Mobile Hub"}'::jsonb,
		now(),
		now(),
		false,
		false
	),
	(
		'00000000-0000-0000-0000-000000000000',
		'eeeeeeee-0005-4000-8000-000000000005',
		'authenticated',
		'authenticated',
		'hina.tablets@seed.local',
		crypt('password123', gen_salt('bf')),
		now(),
		'{"provider":"email","providers":["email"]}'::jsonb,
		'{"full_name": "Hina Tablets"}'::jsonb,
		now(),
		now(),
		false,
		false
	);

UPDATE auth.users
SET
	confirmation_token = '',
	recovery_token = '',
	email_change_token_new = '',
	email_change = '',
	phone_change = ''
WHERE id IN (
	'eeeeeeee-0004-4000-8000-000000000004',
	'eeeeeeee-0005-4000-8000-000000000005'
);

INSERT INTO auth.identities (
	id,
	user_id,
	provider_id,
	identity_data,
	provider,
	last_sign_in_at,
	created_at,
	updated_at
)
SELECT
	gen_random_uuid(),
	id,
	id::text,
	jsonb_build_object(
		'sub', id::text,
		'email', email,
		'email_verified', true
	),
	'email',
	now(),
	now(),
	now()
FROM auth.users
WHERE id IN (
	'eeeeeeee-0004-4000-8000-000000000004',
	'eeeeeeee-0005-4000-8000-000000000005'
);

UPDATE public.profiles
SET
	handle = 'ahmed_phones',
	display_name = 'Ahmed Phones',
	city = 'Karachi',
	area = 'Clifton',
	bio = 'Trusted Apple and Samsung reseller. Focused on PTA approved phones, clear grading, and quick Karachi meetup deals.',
	phone_number = '+923001112233',
	phone_verified = true,
	is_verified = true,
	locale = 'en',
	last_seen_at = now() - interval '10 minutes'
WHERE id = 'eeeeeeee-0001-4000-8000-000000000001';

UPDATE public.profiles
SET
	handle = 'sara_gadgets',
	display_name = 'Sara Gadgets',
	city = 'Lahore',
	area = 'Gulberg',
	bio = 'Premium Android phones, tablets, and neat accessory bundles with clean photos and quick Lahore response times.',
	phone_number = '+923221234567',
	phone_verified = true,
	is_verified = true,
	locale = 'en',
	last_seen_at = now() - interval '30 minutes'
WHERE id = 'eeeeeeee-0002-4000-8000-000000000002';

UPDATE public.profiles
SET
	handle = 'omar_tech',
	display_name = 'Omar Tech',
	city = 'Islamabad',
	area = 'F-7',
	bio = 'Pixel, Xiaomi, and OnePlus inventory with honest descriptions, accessories included, and Islamabad / Rawalpindi meetups.',
	phone_number = '+923331010101',
	phone_verified = true,
	locale = 'en',
	last_seen_at = now() - interval '1 hour'
WHERE id = 'eeeeeeee-0003-4000-8000-000000000003';

UPDATE public.profiles
SET
	handle = 'zain_mobilehub',
	display_name = 'Zain Mobile Hub',
	city = 'Rawalpindi',
	area = 'Saddar',
	bio = 'Budget phones, official PTA devices, and bundle offers for students and resale buyers.',
	phone_number = '+923451234567',
	phone_verified = true,
	is_verified = true,
	locale = 'en',
	last_seen_at = now() - interval '2 hours',
	onboarding_completed_at = now()
WHERE id = 'eeeeeeee-0004-4000-8000-000000000004';

UPDATE public.profiles
SET
	handle = 'hina_tablets',
	display_name = 'Hina Tablets',
	city = 'Islamabad',
	area = 'Blue Area',
	bio = 'Focused on tablets, stylus devices, and student-friendly productivity setups.',
	phone_number = '+923001234890',
	phone_verified = true,
	locale = 'en',
	last_seen_at = now() - interval '3 hours',
	onboarding_completed_at = now()
WHERE id = 'eeeeeeee-0005-4000-8000-000000000005';

INSERT INTO categories (
	id,
	platform,
	name,
	slug,
	parent_id,
	position,
	spec_schema
)
VALUES
	(
		'c0000001-0000-4000-8000-000000000004',
		'mobile',
		'Gaming Phones',
		'gaming-phones',
		'c0000001-0000-4000-8000-000000000001',
		3,
		'{"ram_gb":"number","storage_gb":"number","color":"string","refresh_rate_hz":"number","pta_status":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000005',
		'mobile',
		'Foldables',
		'foldables',
		'c0000001-0000-4000-8000-000000000001',
		4,
		'{"ram_gb":"number","storage_gb":"number","color":"string","fold_type":"string","pta_status":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000006',
		'mobile',
		'Feature Phones',
		'feature-phones',
		'c0000001-0000-4000-8000-000000000001',
		5,
		'{"storage_gb":"number","color":"string","dual_sim":"boolean","pta_status":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000007',
		'mobile',
		'Accessories Bundles',
		'accessories-bundles',
		'c0000001-0000-4000-8000-000000000001',
		6,
		'{"items_included":"string","condition":"string","color":"string"}'::jsonb
	),
	(
		'c0000001-0000-4000-8000-000000000008',
		'mobile',
		'Smart Watches',
		'smart-watches',
		'c0000001-0000-4000-8000-000000000001',
		7,
		'{"case_mm":"number","color":"string","cellular":"boolean"}'::jsonb
	);

INSERT INTO brands (id, platform, name, slug, logo_url)
VALUES
	('b0000001-0000-4000-8000-000000000009', 'mobile', 'Infinix', 'infinix', NULL),
	('b0000001-0000-4000-8000-000000000010', 'mobile', 'Tecno', 'tecno', NULL),
	('b0000001-0000-4000-8000-000000000011', 'mobile', 'Lenovo', 'lenovo', NULL),
	('b0000001-0000-4000-8000-000000000012', 'mobile', 'Motorola', 'motorola', NULL);

INSERT INTO models (id, brand_id, category_id, name, slug, year, image_url, is_active)
VALUES
	(
		'd0000012-0000-4000-b000-000000000012',
		'b0000001-0000-4000-8000-000000000008',
		'c0000001-0000-4000-8000-000000000003',
		'Redmi Pad SE',
		'redmi-pad-se',
		2023,
		'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&q=80',
		true
	),
	(
		'd0000013-0000-4000-b000-000000000013',
		'b0000001-0000-4000-8000-000000000009',
		'c0000001-0000-4000-8000-000000000004',
		'Infinix GT 20 Pro',
		'infinix-gt-20-pro',
		2024,
		'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
		true
	),
	(
		'd0000014-0000-4000-b000-000000000014',
		'b0000001-0000-4000-8000-000000000010',
		'c0000001-0000-4000-8000-000000000002',
		'Tecno Camon 30',
		'tecno-camon-30',
		2024,
		'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
		true
	),
	(
		'd0000015-0000-4000-b000-000000000015',
		'b0000001-0000-4000-8000-000000000011',
		'c0000001-0000-4000-8000-000000000003',
		'Lenovo Tab P12',
		'lenovo-tab-p12',
		2024,
		'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
		true
	),
	(
		'd0000016-0000-4000-b000-000000000016',
		'b0000001-0000-4000-8000-000000000012',
		'c0000001-0000-4000-8000-000000000005',
		'Motorola Razr 40',
		'motorola-razr-40',
		2024,
		'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
		true
	),
	(
		'd0000017-0000-4000-b000-000000000017',
		'b0000001-0000-4000-8000-000000000007',
		'c0000001-0000-4000-8000-000000000006',
		'Nokia 2660 Flip',
		'nokia-2660-flip',
		2023,
		'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
		true
	),
	(
		'd0000018-0000-4000-b000-000000000018',
		'b0000001-0000-4000-8000-000000000001',
		'c0000001-0000-4000-8000-000000000003',
		'iPad Air M2',
		'ipad-air-m2',
		2024,
		'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&q=80',
		true
	),
	(
		'd0000019-0000-4000-b000-000000000019',
		'b0000001-0000-4000-8000-000000000001',
		'c0000001-0000-4000-8000-000000000008',
		'Apple Watch Ultra 2',
		'apple-watch-ultra-2',
		2024,
		'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
		true
	),
	(
		'd0000020-0000-4000-b000-000000000020',
		'b0000001-0000-4000-8000-000000000002',
		'c0000001-0000-4000-8000-000000000008',
		'Galaxy Watch 6 Classic',
		'galaxy-watch-6-classic',
		2023,
		'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
		true
	);

INSERT INTO specifications (model_id, specs)
VALUES
	('d0000012-0000-4000-b000-000000000012', '{"display_in":"11","chip":"Snapdragon 680","connectivity":"WiFi"}'::jsonb),
	('d0000013-0000-4000-b000-000000000013', '{"display_in":"6.78","chip":"Dimensity 8200 Ultimate","refresh_rate_hz":"144"}'::jsonb),
	('d0000014-0000-4000-b000-000000000014', '{"display_in":"6.78","chip":"Helio G99 Ultimate","network":"4G"}'::jsonb),
	('d0000015-0000-4000-b000-000000000015', '{"display_in":"12.7","chip":"Dimensity 7050","connectivity":"WiFi"}'::jsonb),
	('d0000016-0000-4000-b000-000000000016', '{"display_in":"6.9","chip":"Snapdragon 7 Gen 1","fold_type":"flip"}'::jsonb),
	('d0000017-0000-4000-b000-000000000017', '{"display_in":"2.8","dual_sim":"true","network":"4G"}'::jsonb),
	('d0000018-0000-4000-b000-000000000018', '{"display_in":"11","chip":"Apple M2","connectivity":"WiFi"}'::jsonb),
	('d0000019-0000-4000-b000-000000000019', '{"case_mm":49,"color":"Natural Titanium","cellular":true}'::jsonb),
	('d0000020-0000-4000-b000-000000000020', '{"case_mm":47,"color":"Black","cellular":false}'::jsonb);

INSERT INTO listings (
	id,
	user_id,
	platform,
	category_id,
	model_id,
	title,
	description,
	sale_type,
	price,
	is_negotiable,
	condition,
	details,
	city,
	area,
	status,
	published_at,
	expires_at
)
VALUES
	(
		'f0000012-0000-4000-b000-000000000012',
		'eeeeeeee-0004-4000-8000-000000000004',
		'mobile',
		'c0000001-0000-4000-8000-000000000004',
		'd0000013-0000-4000-b000-000000000013',
		'Infinix GT 20 Pro 12/256 Gaming Edition',
		'Gaming triggers, RGB back design, smooth 144Hz display. Great for PUBG and Warzone Mobile.',
		'fixed',
		99999.00,
		true,
		'new',
		'{"ram_gb":12,"storage_gb":256,"color":"Cyber Mecha Blue","refresh_rate_hz":144,"pta_status":"approved"}'::jsonb,
		'Rawalpindi',
		'Saddar',
		'active',
		now() - interval '9 hours',
		now() + interval '26 days'
	),
	(
		'f0000013-0000-4000-b000-000000000013',
		'eeeeeeee-0004-4000-8000-000000000004',
		'mobile',
		'c0000001-0000-4000-8000-000000000002',
		'd0000014-0000-4000-b000-000000000014',
		'Tecno Camon 30 8/256 Glacier White',
		'Good camera and bright screen. Barely used, with silicon cover.',
		'fixed',
		58999.00,
		true,
		'excellent',
		'{"ram_gb":8,"storage_gb":256,"color":"Glacier White","battery_health_pct":99,"pta_status":"approved","network":"4G"}'::jsonb,
		'Rawalpindi',
		'Commercial Market',
		'active',
		now() - interval '1 day',
		now() + interval '19 days'
	),
	(
		'f0000014-0000-4000-b000-000000000014',
		'eeeeeeee-0005-4000-8000-000000000005',
		'mobile',
		'c0000001-0000-4000-8000-000000000003',
		'd0000015-0000-4000-b000-000000000015',
		'Lenovo Tab P12 8/256 with folio cover',
		'Large screen tablet for study, Netflix, and note taking. Charger and cover included.',
		'fixed',
		118000.00,
		true,
		'like_new',
		'{"ram_gb":8,"storage_gb":256,"color":"Storm Grey","screen_in":12.7,"connectivity":"WiFi"}'::jsonb,
		'Islamabad',
		'G-11',
		'active',
		now() - interval '2 days',
		now() + interval '22 days'
	),
	(
		'f0000015-0000-4000-b000-000000000015',
		'eeeeeeee-0005-4000-8000-000000000005',
		'mobile',
		'c0000001-0000-4000-8000-000000000003',
		'd0000018-0000-4000-b000-000000000018',
		'iPad Air M2 128GB with Apple Pencil',
		'Ideal for designers and students. Pencil included and condition is spotless.',
		'fixed',
		214000.00,
		false,
		'like_new',
		'{"ram_gb":8,"storage_gb":128,"color":"Space Gray","screen_in":11,"connectivity":"WiFi"}'::jsonb,
		'Islamabad',
		'Blue Area',
		'active',
		now() - interval '10 hours',
		now() + interval '28 days'
	),
	(
		'f0000016-0000-4000-b000-000000000016',
		'eeeeeeee-0004-4000-8000-000000000004',
		'mobile',
		'c0000001-0000-4000-8000-000000000005',
		'd0000016-0000-4000-b000-000000000016',
		'Motorola Razr 40 Sage Green',
		'Flip phone in neat condition. Imported but patched and fully functional.',
		'both',
		189000.00,
		true,
		'excellent',
		'{"ram_gb":8,"storage_gb":256,"color":"Sage Green","fold_type":"flip","pta_status":"patched"}'::jsonb,
		'Lahore',
		'Cantt',
		'active',
		now() - interval '16 hours',
		now() + interval '23 days'
	),
	(
		'f0000017-0000-4000-b000-000000000017',
		'eeeeeeee-0004-4000-8000-000000000004',
		'mobile',
		'c0000001-0000-4000-8000-000000000006',
		'd0000017-0000-4000-b000-000000000017',
		'Nokia 2660 Flip Official PTA',
		'Simple reliable feature phone for elders and backup use. Dual SIM and loud speaker.',
		'fixed',
		15499.00,
		false,
		'new',
		'{"storage_gb":0,"color":"Black","dual_sim":true,"pta_status":"approved"}'::jsonb,
		'Rawalpindi',
		'Satellite Town',
		'active',
		now() - interval '4 hours',
		now() + interval '30 days'
	),
	(
		'f0000018-0000-4000-b000-000000000018',
		'eeeeeeee-0001-4000-8000-000000000001',
		'mobile',
		'c0000001-0000-4000-8000-000000000007',
		NULL,
		'Mobile accessories combo - charger, cable, MagSafe stand',
		'Useful desk bundle for iPhone users. Includes 20W charger, braided cable, and magnetic stand.',
		'fixed',
		14999.00,
		true,
		'excellent',
		'{"items_included":"20W charger, braided cable, magnetic stand","condition":"excellent","color":"white"}'::jsonb,
		'Karachi',
		'Clifton Block 5',
		'active',
		now() - interval '5 hours',
		now() + interval '20 days'
	),
	(
		'f0000019-0000-4000-b000-000000000019',
		'eeeeeeee-0003-4000-8000-000000000003',
		'mobile',
		'c0000001-0000-4000-8000-000000000003',
		'd0000012-0000-4000-b000-000000000012',
		'Redmi Pad SE 8/256 Mint Green',
		'Budget tablet with large battery and good speakers. Great for kids and streaming.',
		'fixed',
		67999.00,
		true,
		'new',
		'{"ram_gb":8,"storage_gb":256,"color":"Mint Green","screen_in":11,"connectivity":"WiFi"}'::jsonb,
		'Islamabad',
		'I-8',
		'active',
		now() - interval '12 hours',
		now() + interval '25 days'
	),
	(
		'f0000020-0000-4000-b000-000000000020',
		'eeeeeeee-0005-4000-8000-000000000005',
		'mobile',
		'c0000001-0000-4000-8000-000000000003',
		'd0000008-0000-4000-b000-000000000008',
		'Galaxy Tab S9 Ultra 256GB with cover',
		'Big AMOLED tablet for work and media. Great condition and official book cover included.',
		'fixed',
		256000.00,
		true,
		'excellent',
		'{"ram_gb":12,"storage_gb":256,"color":"Graphite","screen_in":14.6,"connectivity":"WiFi"}'::jsonb,
		'Islamabad',
		'F-6',
		'active',
		now() - interval '18 hours',
		now() + interval '26 days'
	),
	(
		'f0000021-0000-4000-b000-000000000021',
		'eeeeeeee-0003-4000-8000-000000000003',
		'mobile',
		'c0000001-0000-4000-8000-000000000008',
		'd0000019-0000-4000-b000-000000000019',
		'Apple Watch Ultra 2 49mm Cellular',
		'Battery health great, original Ocean band. PTA approved cellular model.',
		'fixed',
		142000.00,
		true,
		'excellent',
		'{"case_mm":49,"color":"Natural Titanium","cellular":true}'::jsonb,
		'Karachi',
		'DHA Phase 6',
		'active',
		now() - interval '3 hours',
		now() + interval '27 days'
	),
	(
		'f0000022-0000-4000-b000-000000000022',
		'eeeeeeee-0002-4000-8000-000000000002',
		'mobile',
		'c0000001-0000-4000-8000-000000000008',
		'd0000020-0000-4000-b000-000000000020',
		'Galaxy Watch 6 Classic 47mm Bluetooth',
		'Rotating bezel, charger included. Light wear on strap.',
		'fixed',
		78999.00,
		true,
		'like_new',
		'{"case_mm":47,"color":"Black","cellular":false}'::jsonb,
		'Lahore',
		'Johar Town',
		'active',
		now() - interval '6 hours',
		now() + interval '21 days'
	);

INSERT INTO auction_config (
	listing_id,
	starting_price,
	min_increment,
	auction_start_at,
	auction_end_at,
	anti_snipe_minutes
)
VALUES
	(
		'f0000016-0000-4000-b000-000000000016',
		180000.00,
		2000.00,
		now() - interval '4 hours',
		now() + interval '2 days',
		5
	);

UPDATE listings
SET current_bid = 186000.00
WHERE id = 'f0000016-0000-4000-b000-000000000016';

INSERT INTO listing_images (listing_id, storage_path, url, position)
VALUES
	('f0000012-0000-4000-b000-000000000012', 'seed/f0000012/0.jpg', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=85', 0),
	('f0000013-0000-4000-b000-000000000013', 'seed/f0000013/0.jpg', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&q=85', 0),
	('f0000014-0000-4000-b000-000000000014', 'seed/f0000014/0.jpg', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=85', 0),
	('f0000015-0000-4000-b000-000000000015', 'seed/f0000015/0.jpg', 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=1200&q=85', 0),
	('f0000016-0000-4000-b000-000000000016', 'seed/f0000016/0.jpg', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85', 0),
	('f0000017-0000-4000-b000-000000000017', 'seed/f0000017/0.jpg', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&q=85', 0),
	('f0000018-0000-4000-b000-000000000018', 'seed/f0000018/0.jpg', 'https://images.unsplash.com/photo-1580910051074-3d6948262468?w=1200&q=85', 0),
	('f0000019-0000-4000-b000-000000000019', 'seed/f0000019/0.jpg', 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=1200&q=85', 0),
	('f0000020-0000-4000-b000-000000000020', 'seed/f0000020/0.jpg', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=85', 0),
	('f0000021-0000-4000-b000-000000000021', 'seed/f0000021/0.jpg', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=85', 0),
	('f0000022-0000-4000-b000-000000000022', 'seed/f0000022/0.jpg', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=85', 0);

INSERT INTO public.favorites (user_id, listing_id, created_at)
VALUES
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000003-0000-4000-b000-000000000003', now() - interval '2 days'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000012-0000-4000-b000-000000000012', now() - interval '1 day'),
	('eeeeeeee-0001-4000-8000-000000000001', 'f0000015-0000-4000-b000-000000000015', now() - interval '4 hours'),
	('eeeeeeee-0002-4000-8000-000000000002', 'f0000001-0000-4000-b000-000000000001', now() - interval '3 days'),
	('eeeeeeee-0002-4000-8000-000000000002', 'f0000019-0000-4000-b000-000000000019', now() - interval '10 hours'),
	('eeeeeeee-0003-4000-8000-000000000003', 'f0000008-0000-4000-b000-000000000008', now() - interval '5 hours'),
	('eeeeeeee-0004-4000-8000-000000000004', 'f0000005-0000-4000-b000-000000000005', now() - interval '7 hours'),
	('eeeeeeee-0005-4000-8000-000000000005', 'f0000001-0000-4000-b000-000000000001', now() - interval '12 hours'),
	('eeeeeeee-0005-4000-8000-000000000005', 'f0000003-0000-4000-b000-000000000003', now() - interval '6 hours');

INSERT INTO public.viewed_listings (user_id, listing_id, viewed_at)
VALUES
	('eeeeeeee-0002-4000-8000-000000000002', 'f0000015-0000-4000-b000-000000000015', now() - interval '1 hour'),
	('eeeeeeee-0002-4000-8000-000000000002', 'f0000001-0000-4000-b000-000000000001', now() - interval '5 hours'),
	('eeeeeeee-0002-4000-8000-000000000002', 'f0000016-0000-4000-b000-000000000016', now() - interval '14 hours'),
	('eeeeeeee-0003-4000-8000-000000000003', 'f0000012-0000-4000-b000-000000000012', now() - interval '45 minutes'),
	('eeeeeeee-0003-4000-8000-000000000003', 'f0000014-0000-4000-b000-000000000014', now() - interval '7 hours'),
	('eeeeeeee-0004-4000-8000-000000000004', 'f0000019-0000-4000-b000-000000000019', now() - interval '30 minutes'),
	('eeeeeeee-0004-4000-8000-000000000004', 'f0000015-0000-4000-b000-000000000015', now() - interval '9 hours'),
	('eeeeeeee-0005-4000-8000-000000000005', 'f0000008-0000-4000-b000-000000000008', now() - interval '50 minutes'),
	('eeeeeeee-0005-4000-8000-000000000005', 'f0000018-0000-4000-b000-000000000018', now() - interval '4 hours')
ON CONFLICT (user_id, listing_id) DO UPDATE
SET viewed_at = EXCLUDED.viewed_at;

UPDATE public.listings l
SET favorite_count = x.c
FROM (
	SELECT listing_id, count(*)::int AS c
	FROM public.favorites
	GROUP BY listing_id
) x
WHERE l.id = x.listing_id;

UPDATE public.profiles p
SET total_listings = s.c
FROM (
	SELECT user_id, count(*)::int AS c
	FROM listings
	WHERE deleted_at IS NULL AND status = 'active'
	GROUP BY user_id
) s
WHERE p.id = s.user_id;
