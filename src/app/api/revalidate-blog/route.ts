import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { serverEnv as env } from "@/lib/utils/env.server";
import { locales, defaultLocale } from "@/i18n/config";

// Called by ovation-api after a PUBLISHED transition so the marketing site's
// blog list, article page, and sitemap are regenerated at once. Header-based
// shared secret keeps it unauthenticated at the app layer but private from
// the wider internet.
export const runtime = "nodejs";

// Route uses localePrefix: "as-needed" — default locale has no prefix,
// every other locale is prefixed. Expand a locale-agnostic path (e.g.
// "/blog") into every URL the edge cache actually stores for that page.
const expandPathAcrossLocales = (path: string): string[] => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locales.map((locale) =>
    locale === defaultLocale ? normalized : `/${locale}${normalized}`,
  );
};

export const POST = async (req: Request) => {
  const providedSecret = req.headers.get("x-revalidate-secret");
  const expectedSecret = env.BLOG_REVALIDATE_SECRET;

  if (expectedSecret && providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { paths?: string[] };
  try {
    body = (await req.json()) as { paths?: string[] };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const inputPaths = body.paths ?? [];
  const revalidated = new Set<string>();

  for (const path of inputPaths) {
    for (const localizedPath of expandPathAcrossLocales(path)) {
      revalidatePath(localizedPath);
      revalidated.add(localizedPath);
    }
  }

  // Always refresh the blog list at every locale so newly published
  // articles surface regardless of which locale the user lands on.
  for (const listPath of expandPathAcrossLocales("/blog")) {
    if (!revalidated.has(listPath)) {
      revalidatePath(listPath);
      revalidated.add(listPath);
    }
  }

  revalidateTag("blog-articles", "default");

  return NextResponse.json({
    revalidated: true,
    paths: [...revalidated],
  });
};
