"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { env } from "@/lib/utils/env";
import { ConfettiDot } from "./ConfettiDot";
import { CompletionSuccessIcon } from "./CompletionSuccessIcon";

const CONFETTI = [
  { top: 160, left: 220, color: "oklch(0.723 0.135 40)", size: 8, rotation: 20 },
  { top: 240, left: 380, color: "oklch(0.705 0.120 262.5)", size: 6, rotation: -15 },
  { top: 180, right: 260, color: "oklch(0.833 0.132 151.8)", size: 10, rotation: 10 },
  { top: 300, right: 420, color: "oklch(0.818 0.105 73.3)", size: 7, rotation: 30 },
  { top: 520, left: 180, color: "oklch(0.723 0.135 40)", size: 6, rotation: 45 },
  { top: 600, right: 300, color: "oklch(0.705 0.120 262.5)", size: 8, rotation: -10 },
  { top: 700, right: 360, color: "oklch(0.833 0.132 151.8)", size: 7, rotation: 25 },
  { top: 430, left: 100, color: "oklch(0.705 0.120 262.5)", size: 5, rotation: 0 },
] as const;

type CompletionSuccessViewProps = {
  slug: string;
};

export const CompletionSuccessView = ({ slug }: CompletionSuccessViewProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(`${env.APP_URL}/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-89px)] bg-[radial-gradient(900px_500px_at_50%_20%,oklch(0.705_0.120_262.5/0.18),transparent_60%),radial-gradient(700px_500px_at_10%_90%,oklch(0.833_0.132_151.8/0.10),transparent_60%),radial-gradient(700px_500px_at_90%_80%,oklch(0.723_0.135_40/0.10),transparent_60%)]">
      {CONFETTI.map((dot, i) => (
        <ConfettiDot key={i} {...dot} />
      ))}

      <div className="tablet:px-20 flex min-h-[calc(100dvh-89px)] items-center justify-center px-6 py-6">
        <div className="relative max-w-185 text-center">
          <CompletionSuccessIcon />

          <Kicker className="text-primary mt-6">
            {t("signup__completion__success_step")}
          </Kicker>
          <h1 className="tablet:type-display type-display mt-4.5 leading-none font-semibold tracking-tight">
            {t("signup__completion__success_title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__completion__success_title_b")}
            </span>
          </h1>
          <p className="type-body-large text-muted-foreground mx-auto mt-5 max-w-135 leading-relaxed">
            {t.rich("signup__completion__success_body", {
              slug,
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>

          <div className="rounded-16 border-border bg-card mx-auto mt-9 flex max-w-120 items-center gap-3 border px-4.5 py-3.5 shadow-sm">
            <LinkIcon width={16} height={16} className="text-muted-foreground" />
            <span className="type-body-small text-foreground flex-1 text-left font-mono">
              {env.APP_URL}/{slug}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="border-border bg-card type-caption text-foreground hover:bg-muted cursor-pointer rounded-full border px-3.5 py-2 font-semibold transition-colors"
            >
              {copied ? t("signup__completion__copied") : t("signup__completion__copy")}
            </button>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-primary/40 rounded-full shadow-md">
              <Link href={appRoutes.app.root}>
                {t("signup__completion__open_dashboard")}
                <ArrowRightIcon width={15} height={15} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href={appRoutes.guest.base(slug)}>
                {t("signup__completion__preview_guest")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
