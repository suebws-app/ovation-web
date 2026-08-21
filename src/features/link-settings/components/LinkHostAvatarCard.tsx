"use client";

import { useTranslations } from "next-intl";
import { LinkPhotoCard } from "./LinkPhotoCard";

type LinkHostAvatarCardProps = {
  eventId: string;
  initialPhotoUrl: string | null;
};

export const LinkHostAvatarCard = ({
  eventId,
  initialPhotoUrl,
}: LinkHostAvatarCardProps) => {
  const t = useTranslations();

  return (
    <LinkPhotoCard
      eventId={eventId}
      field="hostAvatarUrl"
      initialUrl={initialPhotoUrl}
      circular
      labels={{
        eyebrow: t("settings__host_avatar__eyebrow"),
        title: t("settings__host_avatar__title"),
        description: t("settings__host_avatar__section_description"),
        hint: t("settings__host_avatar__hint"),
        upload: t("settings__host_avatar__upload"),
        change: t("settings__host_avatar__change"),
        remove: t("settings__host_avatar__remove"),
        uploading: t("settings__host_avatar__uploading"),
        removing: t("settings__host_avatar__removing"),
        saved: t("settings__host_avatar__saved"),
        uploadError: t("settings__host_avatar__upload_error"),
      }}
    />
  );
};
