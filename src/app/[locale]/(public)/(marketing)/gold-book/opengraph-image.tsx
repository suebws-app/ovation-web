import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  OgImageTemplate,
} from "@/lib/seo/ogImageTemplate";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "The Ovation Gold Book";

interface Props {
  params: Promise<{ locale: string }>;
}

const Image = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return new ImageResponse(
    <OgImageTemplate
      eyebrow={t("marketing__gold_book__eyebrow")}
      title={t("seo__gold_book__title")}
      subtitle={t("seo__gold_book__description")}
    />,
    { ...size },
  );
};

export default Image;
