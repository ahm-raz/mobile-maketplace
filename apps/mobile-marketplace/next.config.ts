import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const appRoot =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/** npm workspaces run with cwd at repo root — load this app’s `.env*` so `NEXT_PUBLIC_*` are set. */
loadEnvConfig(appRoot, process.env.NODE_ENV !== "production", undefined, true);

const nextConfig: NextConfig = {
	allowedDevOrigins: ["127.0.0.1"],
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
			{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
		],
	},
};

export default nextConfig;
