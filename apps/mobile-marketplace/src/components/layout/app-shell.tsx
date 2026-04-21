import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div container-id="app-shell" className="flex min-h-0 flex-1 flex-col">
			<SiteHeader />
			<main
				container-id="app-shell-main"
				className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 lg:px-8 lg:py-10"
			>
				{children}
			</main>
			<SiteFooter />
			<MobileBottomNav />
		</div>
	);
}
