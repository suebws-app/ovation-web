import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  OgImageTemplate,
} from "@/lib/seo/ogImageTemplate";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "Ovation pricing";

interface Props {
  params: Promise<{ locale: string }>;
}

const Image = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return new ImageResponse(
    <OgImageTemplate
      eyebrow={t("marketing__pricing__eyebrow")}
      title={t("seo__pricing__title")}
      subtitle={t("seo__pricing__description")}
    />,
    { ...size },
  );
};

export default Image;
