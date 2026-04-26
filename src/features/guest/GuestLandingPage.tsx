import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Logo } from "@ovation/ui/components/Logo";
import { Mic } from "@ovation/icons/Mic";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { Link } from "@/i18n/navigation";

const formatWeddingDate = (raw: string | null): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type GuestLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestLandingPage = async ({ params }: GuestLandingPageProps) => {
  const { slug } = await params;
  const t = await getTranslations();

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  const dateLabel = formatWeddingDate(event.weddingDate);
  const cta =
    event.submissionOpen && !event.limitReached
      ? { href: `/g/${slug}/record` }
      : null;
  const closedMessage = event.limitReached
    ? t("guest__landing__closed_limit")
    : !event.submissionOpen
      ? t("guest__landing__closed_not_open")
      : t("guest__landing__closed_other");

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(160deg, ${event.themeColor} 0%, oklch(0.96 0.02 80) 100%)`,
      }}
    >
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-160 flex-col items-center px-6 pt-6 pb-12 text-center">
        <Eyebrow className="text-foreground/70 tracking-[2px]">
          {t("guest__landing__welcome_overline")}
        </Eyebrow>

        {event.couplePhotoUrl && (
          <img
            src={event.couplePhotoUrl}
            alt={`${event.partnerAName} & ${event.partnerBName}`}
            className="mt-6 size-44 rounded-full border-4 border-white object-cover shadow-lg"
          />
        )}

        <h1 className="type-display mt-6 font-serif leading-[1.05] font-semibold tracking-tight">
          {event.partnerAName}{" "}
          <span className="text-primary italic">&amp;</span>{" "}
          {event.partnerBName}
        </h1>

        {dateLabel && (
          <p className="type-body-small text-foreground/70 mt-3.5">
            {dateLabel}
          </p>
        )}

        {event.welcomeMessage && (
          <p className="text-foreground/80 type-h3 mt-9 max-w-md font-serif leading-relaxed italic">
            &ldquo;{event.welcomeMessage}&rdquo;
          </p>
        )}

        {cta ? (
          <Button asChild size="lg" className="mt-12 rounded-full shadow-lg">
            <Link href={cta.href}>
              <Mic width={16} height={16} />
              {t("guest__landing__cta_record")}
            </Link>
          </Button>
        ) : (
          <div className="rounded-16 bg-background/60 mt-12 max-w-md border border-white/40 p-5 backdrop-blur">
            <p className="type-body-small text-foreground/85">
              {closedMessage}
            </p>
          </div>
        )}

        <p className="type-caption text-foreground/55 mt-12 max-w-sm leading-relaxed">
          {t("guest__landing__caption")}
        </p>
      </main>
    </div>
  );
};
