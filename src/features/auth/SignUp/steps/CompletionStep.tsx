"use client";

import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { Check } from "@ovation/icons/Check";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { NextStepCard } from "../components/NextStepCard";
import { ConfettiDot } from "../components/ConfettiDot";
import { useSignUpStore } from "../useSignUpStore";
import { Link } from "@/i18n/navigation";

const CONFETTI = [
  {
    top: 160,
    left: 220,
    color: "oklch(0.723 0.135 40)",
    size: 8,
    rotation: 20,
  },
  {
    top: 240,
    left: 380,
    color: "oklch(0.705 0.120 262.5)",
    size: 6,
    rotation: -15,
  },
  {
    top: 180,
    right: 260,
    color: "oklch(0.833 0.132 151.8)",
    size: 10,
    rotation: 10,
  },
  {
    top: 300,
    right: 420,
    color: "oklch(0.818 0.105 73.3)",
    size: 7,
    rotation: 30,
  },
  {
    top: 520,
    left: 180,
    color: "oklch(0.723 0.135 40)",
    size: 6,
    rotation: 45,
  },
  {
    top: 600,
    right: 300,
    color: "oklch(0.705 0.120 262.5)",
    size: 8,
    rotation: -10,
  },
  {
    top: 700,
    right: 360,
    color: "oklch(0.833 0.132 151.8)",
    size: 7,
    rotation: 25,
  },
  {
    top: 430,
    left: 100,
    color: "oklch(0.705 0.120 262.5)",
    size: 5,
    rotation: 0,
  },
];

const NEXT_STEPS = [
  {
    emoji: "\uD83D\uDCEC",
    title: "Your QR cards are printing",
    description: "Ships soon \u2014 arrives in 5\u20137 days",
  },
  {
    emoji: "\u2709\uFE0F",
    title: "Invite your partner",
    description: "They\u2019ll get co-owner access",
  },
  {
    emoji: "\uD83C\uDFA8",
    title: "Customize your book",
    description: "Fonts, colors, welcome message",
  },
];

export const CompletionStep = () => {
  const { formData } = useSignUpStore();
  const bookUrl = formData.bookUrl || "your-book";

  return (
    <div className="relative min-h-[calc(100vh-89px)] bg-[radial-gradient(900px_500px_at_50%_20%,_oklch(0.705_0.120_262.5/0.18),_transparent_60%),radial-gradient(700px_500px_at_10%_90%,_oklch(0.833_0.132_151.8/0.10),_transparent_60%),radial-gradient(700px_500px_at_90%_80%,_oklch(0.723_0.135_40/0.10),_transparent_60%)]">
      {CONFETTI.map((dot, i) => (
        <ConfettiDot key={i} {...dot} />
      ))}

      <div className="tablet:px-20 flex min-h-[calc(100vh-89px)] items-center justify-center px-6">
        <div className="relative max-w-[740px] text-center">
          <SuccessIcon />

          <Eyebrow className="text-primary">
            Step 7 &middot; Your book is live
          </Eyebrow>
          <h1 className="tablet:text-[4.5rem] mt-4.5 font-serif text-[3rem] leading-none font-semibold tracking-tight">
            Your book is
            <br />
            <span className="text-primary italic">open.</span>
          </h1>
          <p className="type-body-large text-muted-foreground mx-auto mt-5 max-w-[540px] leading-relaxed">
            <strong className="text-foreground">ovation.love/{bookUrl}</strong>{" "}
            is yours. Share the link with anyone you want, or wait for your QR
            cards to arrive.
          </p>

          <div className="rounded-16 border-border bg-card mx-auto mt-9 flex max-w-[480px] items-center gap-3 border px-4.5 py-3.5 shadow-sm">
            <LinkIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
            <span className="type-body-small text-foreground flex-1 text-left font-mono">
              ovation.love/{bookUrl}
            </span>
            <button
              type="button"
              className="border-border bg-card type-caption text-foreground hover:bg-muted cursor-pointer rounded-full border px-3.5 py-2 font-semibold transition-colors"
            >
              Copy
            </button>
          </div>

          <div className="tablet:grid-cols-3 mt-9 grid gap-3.5 text-left">
            {NEXT_STEPS.map((step) => (
              <NextStepCard key={step.title} {...step} />
            ))}
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="shadow-primary/40 rounded-full shadow-md"
            >
              <Link href="/dashboard">
                Open your dashboard
                <ArrowRight width={15} height={15} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href={`/g/${bookUrl}`}>Preview guest view</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessIcon = () => (
  <div className="bg-secondary mb-7.5 inline-flex size-25 items-center justify-center rounded-full shadow-[0_0_0_14px_oklch(0.833_0.132_151.8/0.15),0_0_0_30px_oklch(0.833_0.132_151.8/0.07),0_20px_50px_oklch(0.833_0.132_151.8/0.45)]">
    <Check
      width={44}
      height={44}
      className="text-primary-foreground"
      strokeWidth={3}
    />
  </div>
);
