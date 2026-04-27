import { redirect } from "next/navigation";

type GuestRecordPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export const GuestRecordPage = async ({ params }: GuestRecordPageProps) => {
  const { slug, locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;
  redirect(`${prefix}/g/${slug}/compose`);
};
