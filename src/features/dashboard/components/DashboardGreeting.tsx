import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";

type DashboardGreetingProps = {
  name: string;
};

export const DashboardGreeting = ({ name }: DashboardGreetingProps) => {
  const t = useTranslations();
  return (
    <div className="tablet:mb-12 mb-8">
      <PageHeading className="mt-3 max-w-205">
        {t("dashboard__greeting", { name })}
      </PageHeading>
    </div>
  );
};
