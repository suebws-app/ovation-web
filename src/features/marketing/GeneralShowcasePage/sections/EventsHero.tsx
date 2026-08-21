import Image from "next/image";
import { useTranslations } from "next-intl";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL2_PREFIX } from "../constants";

export const EventsHero = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-primary/15 pointer-events-none absolute -top-24 right-10 size-125 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-secondary/25 pointer-events-none absolute -top-16 -left-24 size-100 rounded-full blur-3xl"
      />
      <div className="section-container tablet:grid-cols-[1.06fr_0.94fr] relative grid grid-cols-1 items-start gap-14">
        <div>
          <p className="landing-eyebrow text-primary">{k("hero_tag")}</p>
          <h1 className="landing-h1 tablet:landing-display small-desktop:landing-hero text-foreground mt-6">
            {k("hero_title_1")}{" "}
            <span className="text-primary-active italic">
              {k("hero_title_accent")}
            </span>
            .
          </h1>
          <p className="landing-body-large text-muted-foreground mt-6 max-w-130">
            {k("hero_lede")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="pillPrimary" size="pill" asChild>
              <Link href={appRoutes.auth.role}>{k("hero_cta_primary")}</Link>
            </Button>
            <Button variant="pillGhost" size="pill" asChild>
              <Link href={appRoutes.marketing.sample}>
                {k("hero_cta_secondary")}
              </Link>
            </Button>
          </div>
          <p className="type-body-small text-muted-foreground mt-3.5">
            {k("hero_cta_note")}
          </p>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-3.5">
          <div className="rounded-24 border-border relative row-span-2 overflow-hidden border shadow">
            <Image
              src="/images/general/gen-wedding-party.webp"
              alt=""
              fill
              sizes="(min-width: 740px) 24vw, 50vw"
              className="object-cover"
            />
            <span className="bg-card/90 type-caption text-foreground border-border absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-semibold shadow-sm backdrop-blur">
              <VideoIcon className="text-primary-active size-3.5" />
              {k("hero_pill_video")}
            </span>
          </div>
          <div className="rounded-24 border-border relative aspect-square overflow-hidden border shadow">
            <Image
              src="/images/general/gen-birthday.jpg"
              alt=""
              fill
              sizes="(min-width: 740px) 24vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="rounded-24 border-border relative aspect-square overflow-hidden border shadow">
            <Image
              src="/images/general/gen-anniversary.jpg"
              alt=""
              fill
              sizes="(min-width: 740px) 24vw, 50vw"
              className="object-cover"
            />
            <span className="bg-card/90 type-caption text-foreground border-border absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-semibold shadow-sm backdrop-blur">
              <MicIcon className="text-secondary-strong size-3.5" />
              {k("hero_pill_voice")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
