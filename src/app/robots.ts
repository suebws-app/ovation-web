import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo/urls";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/monitoring",
        "/coming-soon",
        "/checkout/",
        "/plans",
        "/create/",
        "/verify",
        "/home",
        "/settings",
        "/analytics",
        "/messages",
        "/events",
        "/guests",
        "/gallery",
        "/shop",
        "/orders",
        "/cart",
        "/account",
        "/qr-code",
        "/link",
        "/help",
        "/g/",
        "/i/",
        "/kiosk/",
        "/*/g/",
        "/*/i/",
        "/*/kiosk/",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
      ],
    },
  ],
  sitemap: `${appUrl}/sitemap.xml`,
});

export default robots;
