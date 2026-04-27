import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { ComposeClient } from "./compose/ComposeClient";

type GuestComposePageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestComposePage = async ({ params }: GuestComposePageProps) => {
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
    <GuestWizardShell event={event}>
      <ComposeClient slug={slug} />
    </GuestWizardShell>
  );
};
