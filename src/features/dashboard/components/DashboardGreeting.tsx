import { useTranslations } from "next-intl";

type DashboardGreetingProps = {
  name: string;
};

export const DashboardGreeting = ({ name }: DashboardGreetingProps) => {
  const t = useTranslations();
  return (
    <div className="tablet:mb-12 mb-8">
      <h1 className="tablet:type-h0 type-h0 mt-3 max-w-205 leading-[1.05] font-semibold tracking-tight">
        {t("dashboard__greeting", { name })}
      </h1>
    </div>
  );
};
