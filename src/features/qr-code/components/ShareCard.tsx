"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { ShareChannel } from "./ShareChannel";

type ShareCardProps = {
  url?: string;
};

export const ShareCard = ({ url = "lena-and-tomas" }: ShareCardProps) => {
  const t = useTranslations();
  const channels = [
    {
      id: "whatsapp",
      label: t("qr_code__share__channel_whatsapp"),
      color: "#25D366",
    },
    {
      id: "email",
      label: t("qr_code__share__channel_email"),
      color: "oklch(0.705 0.120 262.5)",
    },
    {
      id: "messages",
      label: t("qr_code__share__channel_messages"),
      color: "#2CBE4E",
    },
    {
      id: "airdrop",
      label: t("qr_code__share__channel_airdrop"),
      color: "#0C84FE",
    },
  ];
  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Eyebrow className="text-muted-foreground mb-3">
        {t("qr_code__share__eyebrow")}
      </Eyebrow>
      <div className="grid grid-cols-4 gap-2.5">
        {channels.map((c) => (
          <ShareChannel key={c.id} {...c} />
        ))}
      </div>

      <div className="rounded-10 border-border bg-background mt-3.5 border border-dashed p-3">
        <p className="type-overline text-muted-foreground tracking-wider">
          {t("qr_code__share__suggested_label")}
        </p>
        <p className="type-body-small text-foreground mt-1 font-serif italic">
          {t("qr_code__share__suggested_a")}{" "}
          <span className="font-mono not-italic">ovation.love/{url}</span>
          {t("qr_code__share__suggested_b")}
        </p>
      </div>
    </div>
  );
};
