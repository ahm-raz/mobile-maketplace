/**
 * Static `process.env.NEXT_PUBLIC_*` keys only — Next/Turbopack inlines these in client bundles.
 * Dynamic `process.env[name]` stays empty in the browser.
 */
const PUBLIC_ENV = {
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

export type PublicEnvName = keyof typeof PUBLIC_ENV;

export function requirePublicEnv(name: PublicEnvName): string {
	const value = PUBLIC_ENV[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}
