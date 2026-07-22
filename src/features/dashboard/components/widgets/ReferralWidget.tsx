"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { GiftIcon } from "@ovation/icons/GiftIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { MailIcon } from "@ovation/icons/MailIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { ArrowUpRightIcon } from "@ovation/icons/ArrowUpRightIcon";

import { trackEvent } from "@/lib/analytics";
import { clientEnv } from "@/lib/utils/env.client";
import {
  useMyReferralSummary,
  type ReferralSummary,
} from "@/lib/query/referralsQueries";

type ReferralWidgetProps = {
  senderName: string;
};

const DEFAULT_REWARD_CENTS = 1000;

const supportsNativeShare = (): boolean =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

const buildShareUrl = (code: string): string =>
  `${clientEnv.APP_URL.replace(/\/$/, "")}/?ref=${encodeURIComponent(code)}`;

const formatCents = (cents: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

export const ReferralWidget = ({ senderName }: ReferralWidgetProps) => {
  const { data: summary, isPending, isError } = useMyReferralSummary();

  if (isError) return null;

  return (
    <ReferralWidgetShell
      senderName={senderName}
      summary={summary}
      isPending={isPending}
    />
  );
};

type ReferralWidgetShellProps = {
  senderName: string;
  summary: ReferralSummary | undefined;
  isPending: boolean;
};

const ReferralWidgetShell = ({
  senderName,
  summary,
  isPending,
}: ReferralWidgetShellProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const rewardCents = summary?.rewardCents ?? DEFAULT_REWARD_CENTS;
  const rewardLabel = formatCents(rewardCents, "en-US");
  const referralUrl = summary ? buildShareUrl(summary.code) : "";
  const balanceLabel =
    summary && summary.creditBalanceCents > 0
      ? formatCents(summary.creditBalanceCents, "en-US")
      : null;

  const shareText = useMemo(
    () => t("dashboard__widget__referral__share_body", { name: senderName }),
    [t, senderName],
  );
  const shareTitle = t("dashboard__widget__referral__share_title");
  const emailSubject = t("dashboard__widget__referral__email_subject");

  const emailHref = useMemo(() => {
    if (!referralUrl) return "";
    const params = new URLSearchParams({
      subject: emailSubject,
      body: `${shareText}\n\n${referralUrl}`,
    });
    return `mailto:?${params.toString()}`;
  }, [emailSubject, referralUrl, shareText]);

  const handleCopy = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      trackEvent("referral_shared", { channel: "copy" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (!referralUrl) return;
    if (!supportsNativeShare()) {
      void handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: referralUrl,
      });
      trackEvent("referral_shared", { channel: "native" });
    } catch {
      /* user cancelled — no-op */
    }
  };

  const handleEmailClick = () => {
    if (!referralUrl) return;
    trackEvent("referral_shared", { channel: "email" });
  };

  return (
    <div className="rounded-20 from-accent/40 to-accent/10 border-accent/30 relative flex w-full flex-col overflow-hidden border bg-linear-to-br p-5 shadow-sm">
      <div
        className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.45), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="bg-foreground text-background rounded-12 inline-flex size-10 items-center justify-center">
          <GiftIcon width={18} height={18} />
        </span>
        <p className="type-overline text-muted-foreground tracking-[2px] uppercase">
          {t("dashboard__widget__referral__eyebrow")}
        </p>
      </div>

      <div className="relative mt-4 flex flex-col gap-2">
        <h3 className="type-h4 text-foreground">
          {t("dashboard__widget__referral__title")}
        </h3>
        <p className="type-body-small text-muted-foreground">
          {t("dashboard__widget__referral__description", {
            reward: rewardLabel,
          })}
        </p>
      </div>

      {balanceLabel && (
        <div className="rounded-12 bg-background/60 border-foreground/10 type-body-small relative mt-4 flex items-center justify-between border px-3 py-2">
          <span className="text-muted-foreground">
            {t("dashboard__widget__referral__balance_label")}
          </span>
          <span className="text-foreground font-semibold">{balanceLabel}</span>
        </div>
      )}

      {summary && (summary.invitedCount > 0 || summary.convertedCount > 0) && (
        <p className="type-caption text-muted-foreground relative mt-3">
          {t("dashboard__widget__referral__stats", {
            invited: summary.invitedCount,
            converted: summary.convertedCount,
          })}
        </p>
      )}

      {isPending ? (
        <div
          className="bg-foreground/5 relative mt-5 h-11 w-full animate-pulse rounded-full"
          aria-hidden
        />
      ) : (
        <button
          type="button"
          onClick={handleNativeShare}
          className="bg-foreground text-background hover:bg-foreground/90 type-body-small relative mt-5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-semibold transition-colors"
        >
          <ArrowUpRightIcon width={14} height={14} />
          {t("dashboard__widget__referral__share_cta")}
        </button>
      )}

      {isPending ? (
        <div className="relative mt-3 flex items-center gap-2">
          <div
            className="bg-foreground/5 h-10 flex-1 animate-pulse rounded-full"
            aria-hidden
          />
          <div
            className="bg-foreground/5 size-10 shrink-0 animate-pulse rounded-full"
            aria-hidden
          />
        </div>
      ) : (
        <div className="relative mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={
              copied
                ? t("dashboard__widget__referral__copied")
                : t("dashboard__widget__referral__copy_link")
            }
            className="bg-background/60 hover:bg-background border-foreground/10 type-body-small flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-medium transition-colors"
          >
            {copied ? (
              <CheckIcon width={14} height={14} />
            ) : (
              <LinkIcon width={14} height={14} />
            )}
            {copied
              ? t("dashboard__widget__referral__copied")
              : t("dashboard__widget__referral__copy_link")}
          </button>
          <a
            href={emailHref}
            onClick={handleEmailClick}
            aria-label={t("dashboard__widget__referral__email_share")}
            className="bg-background/60 hover:bg-background border-foreground/10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors"
          >
            <MailIcon width={14} height={14} />
          </a>
        </div>
      )}
    </div>
  );
};
