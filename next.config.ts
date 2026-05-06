import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin(join(__dirname, "src/i18n/request.ts"));

const nextConfig: NextConfig = {
  transpilePackages: ["@ovation/ui", "@ovation/icons"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
