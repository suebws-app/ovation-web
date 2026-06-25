import { useTranslations } from "next-intl";
import { MicIcon } from "@ovation/icons/MicIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const MessagesEmptyState = () => {
  const t = useTranslations();
  return (
    <EmptyState
      icon={<MicIcon width={42} height={42} strokeWidth={1.6} />}
      title={t("messages__empty__title")}
      body={t("messages__empty__body")}
      cta={{
        label: t("messages__empty__cta"),
        href: appRoutes.create.root,
      }}
    />
  );
};
