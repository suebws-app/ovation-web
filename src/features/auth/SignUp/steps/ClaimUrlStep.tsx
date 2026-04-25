"use client";

import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { Check } from "@ovation/icons/Check";
import { Info } from "@ovation/icons/Info";
import { SplitLayout } from "../components/SplitLayout";
import { PhoneMockup } from "../components/PhoneMockup";
import { UrlSuggestionChip } from "../components/UrlSuggestionChip";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";

const URL_SUGGESTIONS = [
  "lena-and-tomas",
  "serra-navarro",
  "lt2026",
  "book-of-lena",
];

export const ClaimUrlStep = () => {
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const slug = formData.bookUrl || "";

  const generateSlug = () => {
    const p1 = formData.partner1Name?.toLowerCase() || "partner1";
    const p2 = formData.partner2Name?.toLowerCase() || "partner2";
    return `${p1}-and-${p2}`;
  };

  const suggestions = formData.partner1Name
    ? [
        generateSlug(),
        `${formData.partner1Name?.[0]?.toLowerCase() ?? ""}${formData.partner2Name?.[0]?.toLowerCase() ?? ""}2026`,
        `book-of-${formData.partner1Name?.toLowerCase() ?? "us"}`,
      ]
    : URL_SUGGESTIONS;

  return (
    <SplitLayout
      left={
        <>
          <Eyebrow className="relative tracking-[2.5px] opacity-80">
            Your guest link
          </Eyebrow>
          <div className="relative">
            <p className="font-serif text-[2.75rem] leading-tight tracking-tight italic">
              This short URL is where guests{" "}
              <span className="text-primary-foreground italic">
                land after the scan.
              </span>
            </p>
          </div>
          <PhoneMockup
            url={slug || generateSlug()}
            partner1={formData.partner1Name || "Partner 1"}
            partner2={formData.partner2Name || "Partner 2"}
            date={formData.weddingDate?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            venue={formData.venue}
          />
        </>
      }
      right={
        <>
          <Eyebrow className="text-primary mb-3">
            Step 5 &middot; Claim your link
          </Eyebrow>
          <h1 className="font-serif text-[2.75rem] leading-tight font-semibold tracking-tight">
            Pick your
            <br />
            <span className="text-primary italic">web address.</span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            This is the short URL your QR cards point to. Keep it simple — easy
            to say, easy to type.
          </p>

          <div className="mt-6.5">
            <Eyebrow className="text-muted-foreground mb-2">Your link</Eyebrow>
            <div className="rounded-16 border-primary bg-card shadow-input flex items-center gap-2 border-2 px-4 py-3.5">
              <span className="type-body-small text-muted-foreground font-mono">
                ovation.love /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  updateFormData({
                    bookUrl: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder={generateSlug()}
                className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent font-medium outline-none"
              />
              {slug.length >= 3 && <AvailableBadge />}
            </div>
            <p className="type-caption text-muted-foreground mt-2">
              Letters, numbers, dashes. 3–32 characters.
            </p>
          </div>

          <div className="mt-5.5">
            <Eyebrow className="text-muted-foreground mb-2.5">
              Or try one of these
            </Eyebrow>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <UrlSuggestionChip
                  key={s}
                  slug={s}
                  onClick={() => updateFormData({ bookUrl: s })}
                />
              ))}
            </div>
          </div>

          <div className="rounded-12 bg-primary/10 mt-8 flex items-start gap-2.5 p-3.5">
            <Info
              width={18}
              height={18}
              className="text-primary mt-0.5 shrink-0"
              strokeWidth={1.8}
            />
            <p className="type-caption text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                Keepsake &amp; Gold Book
              </strong>{" "}
              include a custom domain (
              <span className="font-mono">yournames.love</span>) if you&apos;d
              prefer.
            </p>
          </div>

          <Button
            onClick={() => router.push("/sign-up/step/6")}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            Continue
            <ArrowRight width={16} height={16} />
          </Button>
        </>
      }
    />
  );
};

const AvailableBadge = () => (
  <div className="bg-secondary/30 type-caption text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold">
    <Check width={12} height={12} strokeWidth={3} />
    Available
  </div>
);
