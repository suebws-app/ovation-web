import { useTranslations } from "next-intl";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const PhotosEmptyState = () => {
  const t = useTranslations();
  return (
    <EmptyState
      icon={<ImageIcon width={42} height={42} strokeWidth={1.6} />}
      title={t("photos__empty__title")}
      body={t("photos__empty__body")}
      cta={{
        label: t("photos__empty__cta"),
        href: appRoutes.create.root,
      }}
    />
  );
};
