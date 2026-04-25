"use client";

import { WhatsApp } from "@ovation/icons/WhatsApp";
import { Sms } from "@ovation/icons/Sms";
import { Mail } from "@ovation/icons/Mail";
import { cn } from "@ovation/ui/utils/cn";

const CHANNELS = [
  { label: "WhatsApp", icon: WhatsApp, count: 19, recommended: true },
  { label: "SMS", icon: Sms, count: 8, recommended: false },
  { label: "Email", icon: Mail, count: 7, recommended: false },
];

export const GuestNudgeCard = () => {
  return (
    <div className="rounded-20 border-border bg-card tablet:p-10 relative overflow-hidden border p-8">
      <div className="bg-destructive/15 absolute -top-8 -right-8 size-50 rounded-full" />
      <div className="relative">
        <span className="type-overline text-destructive">Follow-up</span>
        <h3 className="type-h2 mt-2.5 font-serif tracking-tight">
          Nudge 34 guests who haven&apos;t recorded yet
        </h3>
        <p className="type-body-small text-muted-foreground mt-2.5 max-w-xl leading-relaxed">
          We&apos;ll send a warm one-liner with your link. You can preview and
          edit before anything goes out. WhatsApp works best &mdash; 3&times;
          the response rate of email.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {CHANNELS.map((channel) => (
            <NudgeChannelButton key={channel.label} {...channel} />
          ))}
        </div>
        <div className="rounded-12 border-border bg-background type-body-small mt-5 max-w-xl border p-3.5 leading-relaxed">
          <span className="text-muted-foreground">Preview:</span>{" "}
          <span className="font-serif italic">
            &ldquo;Hi Ren&eacute;e &mdash; Lena &amp; Tom&aacute;s here. The
            book is closing soon; would love a quick voice note. 30 seconds is
            plenty. ovation.love/lena-tomas&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
};

type NudgeChannelButtonProps = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
  recommended: boolean;
};

const NudgeChannelButton = ({
  label,
  icon: Icon,
  count,
  recommended,
}: NudgeChannelButtonProps) => (
  <button
    type="button"
    className={cn(
      "rounded-16 type-body-small inline-flex cursor-pointer items-center gap-2.5 px-4 py-3 font-semibold",
      recommended
        ? "bg-foreground text-background"
        : "border-border bg-card text-foreground border",
    )}
  >
    <Icon width={15} height={15} />
    <span>{label}</span>
    <span
      className={cn(
        "type-caption font-bold",
        recommended ? "text-background/70" : "text-muted-foreground",
      )}
    >
      {count}
    </span>
    {recommended && (
      <span className="rounded-4 bg-destructive type-overline text-background px-1.5 py-0.5">
        BEST
      </span>
    )}
  </button>
);
