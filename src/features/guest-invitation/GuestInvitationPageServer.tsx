import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { invitationTemplatesApi } from "@/lib/api/invitation-templates";
import { publicApi } from "@/lib/api/public";
import { invitationFontVariables } from "@/features/invitation/invitationFonts";
import { GuestInvitationView } from "./components/GuestInvitationView";

type GuestInvitationPageServerProps = {
  params: Promise<{ slug: string; token: string }>;
};

export const GuestInvitationPageServer = async ({
  params,
}: GuestInvitationPageServerProps) => {
  const { slug, token } = await params;

  const [invitation, templatesResponse] = await Promise.all([
    publicApi.getInvitation(slug, token).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    invitationTemplatesApi.list().catch(() => null),
  ]);

  if (!invitation) notFound();

  const templates = templatesResponse?.templates ?? [];
  const fallbackTemplateId = templatesResponse?.defaultTemplateId;
  const template =
    templates.find((tpl) => tpl.id === invitation.event.invitationTemplateId) ??
    templates.find((tpl) => tpl.id === fallbackTemplateId) ??
    templates[0];

  if (!template) notFound();

  return (
    <div className={`${invitationFontVariables} contents`}>
      <GuestInvitationView
        slug={slug}
        token={token}
        event={invitation.event}
        invitee={invitation.invitee}
        template={template}
      />
    </div>
  );
};
