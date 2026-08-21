export { GeneralLandingPage as default } from "@/features/marketing/landing";
export { generateGeneralLandingMetadata as generateMetadata } from "@/lib/seo/marketingMetadata";

// Landing is SSG'd per locale via [locale]/generateStaticParams. Force-static
// guarantees the plansApi.publicList() fetch resolves at build time (cached
// via force-cache + revalidate: 300) and cannot silently opt into dynamic
// rendering, which would push TTFB into the LCP path on every request.
export const dynamic = "force-static";
export const revalidate = 300;
