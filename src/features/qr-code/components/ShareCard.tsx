"use client";

import { Eyebrow } from "@ovation/ui/components/Eyebrow";

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { id: "email", label: "Email", color: "oklch(0.705 0.120 262.5)" },
  { id: "messages", label: "Messages", color: "#2CBE4E" },
  { id: "airdrop", label: "AirDrop", color: "#0C84FE" },
];

type ShareCardProps = {
  url?: string;
};

export const ShareCard = ({ url = "lena-and-tomas" }: ShareCardProps) => (
  <div className="rounded-16 border-border bg-card border p-4.5">
    <Eyebrow className="text-muted-foreground mb-3">Share directly</Eyebrow>
    <div className="grid grid-cols-4 gap-2.5">
      {CHANNELS.map((c) => (
        <ShareChannel key={c.id} {...c} />
      ))}
    </div>

    <div className="rounded-10 border-border bg-background mt-3.5 border border-dashed p-3">
      <p className="type-overline text-muted-foreground tracking-wider">
        Suggested message
      </p>
      <p className="type-body-small text-foreground mt-1 font-serif italic">
        &ldquo;Hi! Would you record a short voice message for our wedding book?
        Scan the code or tap &mdash;{" "}
        <span className="font-mono not-italic">ovation.love/{url}</span>. Love,
        L&amp;T&rdquo;
      </p>
    </div>
  </div>
);

const ShareChannel = ({ label, color }: { label: string; color: string }) => (
  <button
    type="button"
    className="rounded-12 border-border bg-background hover:bg-muted flex cursor-pointer flex-col items-center gap-1.5 border p-3 transition-colors"
  >
    <span
      className="rounded-10 text-primary-foreground flex size-9 items-center justify-center"
      style={{ background: color }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
    <span className="type-caption text-foreground font-semibold">{label}</span>
  </button>
);
