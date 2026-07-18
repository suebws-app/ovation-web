import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { serverEnv as env } from "@/lib/utils/env.server";

// Called by ovation-api after a PUBLISHED transition so the marketing site's
// blog list, article page, and sitemap are regenerated at once. Header-based
// shared secret keeps it unauthenticated at the app layer but private from
// the wider internet.
export const runtime = "nodejs";

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

  const paths = body.paths ?? [];
  for (const path of paths) revalidatePath(path);
  revalidateTag("blog-articles", "default");

  return NextResponse.json({ revalidated: true, paths });
};
