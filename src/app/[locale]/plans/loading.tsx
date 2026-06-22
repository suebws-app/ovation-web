import { getTranslations } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { PlansCardsSkeleton } from "@/features/plans/skeletons/PlansSkeleton";

export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-14 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("signup__plan__step_label")}
          </Kicker>
          <h1 className="type-h0 mt-3.5 leading-tight font-semibold tracking-tight">
            {t("signup__plan__title_a")}{" "}
            <span className="text-primary italic">
              {t("signup__plan__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("signup__plan__subtitle")}
          </p>
        </div>
        <PlansCardsSkeleton />
      </div>
    </div>
  );
}
