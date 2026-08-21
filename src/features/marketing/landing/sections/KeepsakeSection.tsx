import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { WEDDING_KEY_PREFIX } from "../variant";

type KeepsakeSectionProps = {
  keyPrefix?: string;
};

export const KeepsakeSection = ({
  keyPrefix = WEDDING_KEY_PREFIX,
}: KeepsakeSectionProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <section id="keepsake" className="bg-warm-panel/40">
      <div className="section-container">
        <div className="tablet:grid-cols-2 grid grid-cols-1 items-center gap-14">
          <div className="rounded-24 tablet:order-1 relative order-2 min-h-130 overflow-hidden">
            <Image
              src="/images/layflat-photo-book.webp"
              alt={k("keepsake_title_line2")}
              fill
              sizes="(min-width: 740px) 45vw, 90vw"
              className="object-contain"
            />
          </div>
          <div className="tablet:order-2 order-1">
            <p className="landing-eyebrow text-primary">
              {k("keepsake_eyebrow")}
            </p>
            <h2 className="landing-h2 tablet:landing-h1 text-foreground mt-3">
              {k("keepsake_title_line1")}{" "}
              <span className="text-primary italic">
                {k("keepsake_title_line2")}
              </span>
              .
            </h2>
            <p className="landing-body-large text-muted-foreground mt-5">
              {k("keepsake_description")}
            </p>
            <Button variant="pillPrimary" size="pill" className="mt-6" asChild>
              <Link href={appRoutes.marketing.goldBook}>
                {k("keepsake_cta")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
