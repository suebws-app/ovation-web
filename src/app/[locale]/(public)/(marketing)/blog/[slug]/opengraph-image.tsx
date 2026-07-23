import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { blogApi } from "@/lib/api/blog";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  OgImageTemplate,
} from "@/lib/seo/ogImageTemplate";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Ovation blog post";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const Image = async ({ params }: Props) => {
  const { locale, slug } = await params;
  try {
    const { article } = await blogApi.publicGet(slug, locale);
    return new ImageResponse(
      <OgImageTemplate
        eyebrow={article.category ?? "Ovation blog"}
        title={article.title}
        subtitle={article.excerpt ?? undefined}
      />,
      { ...size },
    );
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) notFound();
    throw err;
  }
};

export default Image;
