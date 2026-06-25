import { useTranslations } from "next-intl";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const GuestsEmptyState = () => {
  const t = useTranslations();
  return (
    <EmptyState
      icon={<UsersIcon width={42} height={42} strokeWidth={1.6} />}
      title={t("guests__empty__title")}
      body={t("guests__empty__body")}
      cta={{
        label: t("guests__empty__cta"),
        href: appRoutes.create.root,
      }}
    />
  );
};
