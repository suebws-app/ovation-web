import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo/urls";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/monitoring"],
    },
  ],
  sitemap: `${appUrl}/sitemap.xml`,
});

export default robots;
