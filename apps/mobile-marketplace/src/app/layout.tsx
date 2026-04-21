import type { Metadata } from "next";

import { AppProviders } from "@/lib/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
	title: "Bazaar Mobile",
	description: "Pakistan-focused marketplace for buying and selling phones with trusted local discovery.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body className="min-h-full flex flex-col bg-background font-sans text-foreground antialiased">
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
}
