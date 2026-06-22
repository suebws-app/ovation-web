import { getTranslations } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { CreatePageBodySkeleton } from "@/features/create/skeletons/CreatePageSkeleton";

export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="desktop:grid desktop:grid-cols-[40%_1fr] desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible grid h-[calc(100svh-89px)] overflow-hidden">
      <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-linear-to-br">
        <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
        <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__book_details__brand_eyebrow")}
          </Kicker>
          <div className="bg-foreground/10 aspect-[3/4] w-full max-w-72 animate-pulse rounded-2xl" />
          <p className="type-body-small leading-relaxed opacity-80">
            {t("signup__book_details__brand_caption")}
          </p>
        </div>
      </div>

      <div className="tablet:px-18 tablet:pt-10 tablet:pb-12 desktop:justify-start flex h-full items-start justify-center overflow-y-auto px-5 pt-5 pb-5">
        <div className="mx-auto my-auto w-full max-w-130">
          <Kicker className="text-primary mb-3">
            {t("auth__signup__eyebrow_step", {
              step: 1,
              label: t("signup__book_details__step_label"),
            })}
          </Kicker>
          <h1 className="type-h2 tablet:type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__book_details__title_a")}{" "}
            <span className="text-primary italic">
              {t("signup__book_details__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground tablet:mt-3 mt-1.5 leading-relaxed">
            {t("signup__book_details__subtitle")}
          </p>
          <CreatePageBodySkeleton />
        </div>
      </div>
    </div>
  );
}
