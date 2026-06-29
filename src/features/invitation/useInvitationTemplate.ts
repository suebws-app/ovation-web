"use client";

import { useMemo } from "react";
import { useInvitationTemplatesQuery } from "@/lib/query/invitationTemplatesQueries";
import { DEFAULT_INVITATION_TEMPLATE_ID } from "./invitationTemplates";
import type { InvitationTemplateMeta } from "./invitationTemplates";
import type { InvitationFields } from "./invitationSchema";

export const useInvitationTemplate = (
  values: InvitationFields | undefined,
): InvitationTemplateMeta | undefined => {
  const { data } = useInvitationTemplatesQuery();

  return useMemo(() => {
    const templates = data?.templates;
    if (!templates || templates.length === 0) return undefined;
    const selectedId =
      values?.templateId ??
      data?.defaultTemplateId ??
      DEFAULT_INVITATION_TEMPLATE_ID;
    return (
      templates.find((tpl) => tpl.id === selectedId) ??
      templates.find((tpl) => tpl.id === data?.defaultTemplateId) ??
      templates[0]
    );
  }, [data?.defaultTemplateId, data?.templates, values?.templateId]);
};
