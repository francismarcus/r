import type { NextConfig } from "next";

const nextConfig: NextConfig = {

	images: {
		remotePatterns: [
			{
				hostname: "d1vo8zfysxy97v.cloudfront.net",
			},
		],
	},
	experimental: {
		ppr: true,
		dynamicIO: true,
		after: true
	},
};

export default nextConfig;
