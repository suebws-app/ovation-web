"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@ovation/ui/components/Button";
import type { InvitationTemplateMeta } from "../../invitationTemplates";
import type { InvitationFields } from "../../invitationSchema";
import { ColorField } from "../ColorField";

type CustomiseControlsProps = {
  template: InvitationTemplateMeta;
};

export const CustomiseControls = ({ template }: CustomiseControlsProps) => {
  const t = useTranslations();
  const { control, setValue } = useFormContext<InvitationFields>();

  const resetDesign = () => {
    setValue("pageBg", "", { shouldDirty: true });
    setValue("surroundBg", "", { shouldDirty: true });
    setValue("cardBg", "", { shouldDirty: true });
    setValue("textColor", "", { shouldDirty: true });
    setValue("mutedColor", "", { shouldDirty: true });
    setValue("accentColor", "", { shouldDirty: true });
    setValue("textScale", 1, { shouldDirty: true });
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="type-body-small font-semibold">
            {t("invitation__section__customise")}
          </h2>
          <p className="type-caption text-muted-foreground">
            {t("invitation__section__customise_sub")}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={resetDesign}>
          {t("invitation__customise__reset")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="pageBg"
          render={({ field }) => (
            <ColorField
              value={field.value}
              defaultHex={template.pageBg}
              label={t("invitation__field__bg_color")}
              onChange={field.onChange}
              onReset={() => field.onChange("")}
            />
          )}
        />

        <Controller
          control={control}
          name="cardBg"
          render={({ field }) => (
            <ColorField
              value={field.value}
              defaultHex={template.cardBg}
              label={t("invitation__field__card_color")}
              onChange={field.onChange}
              onReset={() => field.onChange("")}
            />
          )}
        />

        <Controller
          control={control}
          name="textColor"
          render={({ field }) => (
            <ColorField
              value={field.value}
              defaultHex={template.textColor}
              label={t("invitation__field__text_color")}
              onChange={field.onChange}
              onReset={() => field.onChange("")}
            />
          )}
        />

        <Controller
          control={control}
          name="mutedColor"
          render={({ field }) => (
            <ColorField
              value={field.value}
              defaultHex={template.mutedColor}
              label={t("invitation__field__text2_color")}
              onChange={field.onChange}
              onReset={() => field.onChange("")}
            />
          )}
        />

        <Controller
          control={control}
          name="accentColor"
          render={({ field }) => (
            <ColorField
              value={field.value}
              defaultHex={template.accentColor}
              label={t("invitation__field__accent_color")}
              onChange={field.onChange}
              onReset={() => field.onChange("")}
            />
          )}
        />
      </div>
    </div>
  );
};
