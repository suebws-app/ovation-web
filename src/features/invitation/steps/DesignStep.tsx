"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { Kicker } from "@ovation/ui/components/Kicker";
import { useInvitationTemplatesQuery } from "@/lib/query/invitationTemplatesQueries";
import { TemplateThumb } from "../components/TemplateThumb";
import type { InvitationFields } from "../invitationSchema";

export const DesignStep = () => {
  const t = useTranslations();
  const { control, setValue } = useFormContext<InvitationFields>();
  const templateId = useWatch({ control, name: "templateId" });
  const partnerA = useWatch({ control, name: "partnerA" });
  const partnerB = useWatch({ control, name: "partnerB" });

  const { data, isLoading, isError } = useInvitationTemplatesQuery();

  const selectTemplate = (id: string) =>
    setValue("templateId", id, { shouldDirty: true });

  return (
    <>
      <Kicker className="text-muted-foreground tablet:mt-7 mt-5 mb-3">
        {t("invitation__section__templates")}
      </Kicker>
      <p className="type-caption text-muted-foreground mb-3">
        {t("invitation__section__templates_sub")}
      </p>

      {isLoading && (
        <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-muted rounded-12 aspect-3/4 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="type-caption text-destructive">
          {t("invitation__templates__load_error")}
        </p>
      )}

      {data && (
        <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
          {data.templates.map((template) => (
            <TemplateThumb
              key={template.id}
              template={template}
              active={template.id === templateId}
              partnerA={partnerA}
              partnerB={partnerB}
              onSelect={selectTemplate}
            />
          ))}
        </div>
      )}
    </>
  );
};
