import { useTranslations } from "next-intl";

export const PublicGalleryUnavailable = () => {
  const t = useTranslations();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-12 text-center">
      <p className="type-h2 font-semibold">
        {t("guest_gallery__unavailable_title")}
      </p>
      <p className="type-body-small text-muted-foreground mt-2 max-w-sm">
        {t("guest_gallery__unavailable_body")}
      </p>
    </div>
  );
};
