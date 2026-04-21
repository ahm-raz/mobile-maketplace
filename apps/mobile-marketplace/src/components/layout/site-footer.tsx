export function SiteFooter() {
	return (
		<footer container-id="site-footer" className="border-t border-border/80 bg-card/70">
			<div
				container-id="site-footer-inner"
				className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4 lg:px-8"
			>
				<div className="space-y-2">
					<p className="font-heading text-lg font-semibold text-foreground">Bazaar Mobile</p>
					<p>
						Buy and sell phones with local discovery, safer payments, and stronger seller
						trust signals.
					</p>
				</div>
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
						Marketplace
					</p>
					<p>Browse brands and models</p>
					<p>Find PTA approved phones</p>
					<p>Sell your used device faster</p>
				</div>
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
						Trust
					</p>
					<p>Escrow-ready purchase flows</p>
					<p>Seller ratings and reviews</p>
					<p>Testing and warranty hooks</p>
				</div>
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
						Help
					</p>
					<p>How buying works</p>
					<p>How to list a phone</p>
					<p>Safety tips for meetups and payments</p>
					<p>© {new Date().getFullYear()} Bazaar Mobile</p>
				</div>
			</div>
		</footer>
	);
}
