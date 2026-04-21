/** Formats `viewed_at` / `favorited_at` ISO timestamps for buyer UI. */
export function formatViewedAt(iso: string): string {
	try {
		return new Date(iso).toLocaleString(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		});
	} catch {
		return iso;
	}
}
