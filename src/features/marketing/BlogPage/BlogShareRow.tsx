"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { CopyIcon } from "@ovation/icons/CopyIcon";
import { FacebookIcon } from "@ovation/icons/FacebookIcon";
import { MailIcon } from "@ovation/icons/MailIcon";
import { PinterestIcon } from "@ovation/icons/PinterestIcon";
import { WhatsAppIcon } from "@ovation/icons/WhatsAppIcon";
import { XSocialIcon } from "@ovation/icons/XSocialIcon";

interface BlogShareRowProps {
  title: string;
  coverImageUrl?: string | null;
}

const shareButtonClasses =
  "border-border text-muted-foreground hover:border-primary hover:text-primary flex size-10 items-center justify-center rounded-full border transition";

const openSharePopup = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=640");
};

export const BlogShareRow = ({ title, coverImageUrl }: BlogShareRowProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    openSharePopup(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const handleX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    openSharePopup(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
  };

  const handlePinterest = () => {
    const url = encodeURIComponent(window.location.href);
    const description = encodeURIComponent(title);
    const media = coverImageUrl ? encodeURIComponent(coverImageUrl) : "";
    openSharePopup(
      `https://pinterest.com/pin/create/button/?url=${url}&description=${description}&media=${media}`,
    );
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${title} ${window.location.href}`);
    openSharePopup(`https://wa.me/?text=${text}`);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mt-16 flex flex-wrap items-center gap-3">
      <span className="type-overline text-muted-foreground">
        {t("marketing__blog__share__label")}
      </span>
      <button
        type="button"
        onClick={handleFacebook}
        aria-label={t("marketing__blog__share__facebook")}
        className={shareButtonClasses}
      >
        <FacebookIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={handleX}
        aria-label={t("marketing__blog__share__x")}
        className={shareButtonClasses}
      >
        <XSocialIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={handlePinterest}
        aria-label={t("marketing__blog__share__pinterest")}
        className={shareButtonClasses}
      >
        <PinterestIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={handleWhatsApp}
        aria-label={t("marketing__blog__share__whatsapp")}
        className={shareButtonClasses}
      >
        <WhatsAppIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={handleEmail}
        aria-label={t("marketing__blog__share__email")}
        className={shareButtonClasses}
      >
        <MailIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          copied
            ? t("marketing__blog__share__copied")
            : t("marketing__blog__share__copy")
        }
        className={shareButtonClasses}
      >
        {copied ? (
          <CheckIcon className="text-primary size-4.5" />
        ) : (
          <CopyIcon className="size-4.5" />
        )}
      </button>
    </div>
  );
};
