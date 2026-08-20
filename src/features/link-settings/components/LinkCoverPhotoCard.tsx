"use client";

import { useTranslations } from "next-intl";
import { LinkPhotoCard } from "./LinkPhotoCard";

type LinkCoverPhotoCardProps = {
  eventId: string;
  initialPhotoUrl: string | null;
};

export const LinkCoverPhotoCard = ({
  eventId,
  initialPhotoUrl,
}: LinkCoverPhotoCardProps) => {
  const t = useTranslations();

  return (
    <LinkPhotoCard
      eventId={eventId}
      field="coverPhotoUrl"
      initialUrl={initialPhotoUrl}
      labels={{
        eyebrow: t("settings__couple_photo__eyebrow"),
        title: t("settings__couple_photo__title"),
        description: t("settings__couple_photo__section_description"),
        hint: t("settings__couple_photo__hint"),
        upload: t("settings__couple_photo__upload"),
        change: t("settings__couple_photo__change"),
        remove: t("settings__couple_photo__remove"),
        uploading: t("settings__couple_photo__uploading"),
        removing: t("settings__couple_photo__removing"),
        saved: t("settings__couple_photo__saved"),
        uploadError: t("settings__couple_photo__upload_error"),
      }}
    />
  );
};
