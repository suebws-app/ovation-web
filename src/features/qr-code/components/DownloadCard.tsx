"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { FormatRow } from "./FormatRow";

export const DownloadCard = () => {
  const t = useTranslations();
  const formats = [
    { ext: "PNG", desc: t("qr_code__download__png_desc"), size: "142 KB" },
    { ext: "SVG", desc: t("qr_code__download__svg_desc"), size: "8 KB" },
    { ext: "PDF", desc: t("qr_code__download__pdf_desc"), size: "38 KB" },
    { ext: "EPS", desc: t("qr_code__download__eps_desc"), size: "14 KB" },
  ];
  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Eyebrow className="text-muted-foreground mb-3">
        {t("qr_code__download__eyebrow")}
      </Eyebrow>
      <div className="flex flex-col gap-2">
        {formats.map((f, i) => (
          <FormatRow key={f.ext} {...f} primary={i === 0} />
        ))}
      </div>
    </div>
  );
};
