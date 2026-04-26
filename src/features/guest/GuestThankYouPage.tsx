import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Button } from "@ovation/ui/components/Button";
import { Logo } from "@ovation/ui/components/Logo";
import { Heart } from "@ovation/icons/Heart";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { Link } from "@/i18n/navigation";

type GuestThankYouPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestThankYouPage = async ({ params }: GuestThankYouPageProps) => {
  const { slug } = await params;
  const t = await getTranslations();

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  const names = `${event.partnerAName} & ${event.partnerBName}`;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: `linear-gradient(160deg, ${event.themeColor} 0%, oklch(0.96 0.02 80) 100%)`,
      }}
    >
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-140 flex-1 flex-col items-center px-6 py-10 text-center">
        <div className="rounded-20 bg-background/70 mt-6 inline-flex size-20 items-center justify-center backdrop-blur">
          <Heart
            width={36}
            height={36}
            className="fill-destructive text-destructive"
          />
        </div>

        <Eyebrow className="text-foreground/70 mt-9 tracking-[2px]">
          {t("guest__thank_you__eyebrow")}
        </Eyebrow>
        <h1 className="type-h1 mt-3 font-serif leading-tight font-semibold tracking-tight">
          {t.rich("guest__thank_you__title", {
            names,
            emph: (chunks) => (
              <span className="text-primary italic">{chunks}</span>
            ),
          })}
        </h1>
        <p className="type-body-small text-foreground/75 mt-4 leading-relaxed">
          {t("guest__thank_you__body")}
        </p>

        {event.submissionOpen && !event.limitReached && (
          <Button asChild className="mt-9 rounded-full" variant="outline">
            <Link href={`/g/${slug}/record`}>{t("guest__thank_you__cta")}</Link>
          </Button>
        )}

        <p className="type-caption text-foreground/55 mt-12 max-w-sm leading-relaxed">
          {t("guest__thank_you__caption")}
        </p>
      </main>
    </div>
  );
};
