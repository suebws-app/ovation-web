import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { RecorderClient } from "./record/RecorderClient";

type GuestRecordPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestRecordPage = async ({ params }: GuestRecordPageProps) => {
  const { slug } = await params;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  if (!event.submissionOpen || event.limitReached) {
    redirect(`/g/${slug}`);
  }

  return (
    <RecorderClient
      slug={slug}
      themeColor={event.themeColor}
      defaultLanguage={event.defaultLanguage}
    />
  );
};
