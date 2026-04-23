"use client";

import { useState, useMemo } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Calendar } from "@ovation/ui/components/DatePicker";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { SplitLayout } from "../components/SplitLayout";
import { BookPreview } from "../components/BookPreview";
import { NameOrderOption } from "../components/NameOrderOption";
import { CountdownCard } from "../components/CountdownCard";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";

export const BookDetailsStep = () => {
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const { partner1Name, partner2Name, displayOrder, weddingDate, venue } =
    formData;
  const [showCalendar, setShowCalendar] = useState(false);

  const orderOptions = [
    `${partner1Name || "Partner 1"} & ${partner2Name || "Partner 2"}`,
    `${partner2Name || "Partner 2"} & ${partner1Name || "Partner 1"}`,
    "Custom\u2026",
  ];

  const NAME_MAX_LENGTH = 24;

  const blobScale = useMemo(() => {
    const totalChars =
      (partner1Name?.length ?? 0) + (partner2Name?.length ?? 0);
    return 0.6 + Math.min(totalChars / 20, 1) * 0.8;
  }, [partner1Name, partner2Name]);

  const daysUntil = weddingDate
    ? Math.max(
        0,
        Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000),
      )
    : 0;

  const handleContinue = () => {
    router.push("/sign-up/step/4");
  };

  return (
    <SplitLayout
      blobScale={blobScale}
      left={
        <>
          <Eyebrow className="relative tracking-[2.5px] opacity-80">
            Cover preview
          </Eyebrow>
          <div className="relative">
            <BookPreview
              partner1={partner1Name}
              partner2={partner2Name}
              date={weddingDate?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              venue={venue}
            />
            <p className="mt-6 type-body-small leading-relaxed opacity-80">
              Your cover updates as you type. This is how guests see your book.
            </p>
          </div>
          {daysUntil > 0 && <CountdownCard days={daysUntil} />}
        </>
      }
      right={
        <>
          <Eyebrow className="mb-3 text-primary">
            Step 3 &middot; Your book
          </Eyebrow>
          <h1 className="font-serif text-[2.75rem] font-semibold leading-tight tracking-tight">
            Names, date
            <br />
            <span className="italic text-primary">&amp; place.</span>
          </h1>
          <p className="mt-3 type-body-small leading-relaxed text-muted-foreground">
            Just first names or nicknames — whatever your guests will recognize.
          </p>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-3.5">
            <div>
              <Label htmlFor="partner1" className="mb-2">
                Partner 1
              </Label>
              <Input
                id="partner1"
                value={partner1Name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) =>
                  updateFormData({ partner1Name: e.target.value })
                }
                placeholder="First name"
              />
            </div>
            <span className="pb-2.5 font-serif text-[2rem] italic text-muted-foreground">
              &amp;
            </span>
            <div>
              <Label htmlFor="partner2" className="mb-2">
                Partner 2
              </Label>
              <Input
                id="partner2"
                value={partner2Name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) =>
                  updateFormData({ partner2Name: e.target.value })
                }
                placeholder="First name"
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">How should the book read?</Label>
            <div className="flex flex-wrap gap-2">
              {orderOptions.map((option) => (
                <NameOrderOption
                  key={option}
                  label={option}
                  active={displayOrder === option}
                  onClick={() => updateFormData({ displayOrder: option })}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="mb-2">Wedding date</Label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="group flex w-full cursor-pointer items-center justify-between rounded-12 border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-input"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-8 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <span
                  className={
                    weddingDate
                      ? "type-body-small font-medium text-foreground"
                      : "type-body-small text-muted-foreground"
                  }
                >
                  {weddingDate
                    ? weddingDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Pick a date"}
                </span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 type-caption font-medium text-muted-foreground">
                {weddingDate
                  ? weddingDate.toLocaleDateString("en-US", { weekday: "long" })
                  : "Optional"}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: showCalendar ? "1fr" : "0fr",
                opacity: showCalendar ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="mt-3 rounded-16 border border-border bg-card p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={weddingDate ?? undefined}
                    onSelect={(date) => {
                      updateFormData({ weddingDate: date ?? null });
                      setShowCalendar(false);
                    }}
                    disabled={{ before: new Date() }}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="venue" className="mb-2">
              Venue or city
            </Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => updateFormData({ venue: e.target.value })}
              placeholder="e.g. Villa Rosa, Tuscany"
            />
            <p className="mt-2 type-caption text-muted-foreground">
              Used on guest cards. Optional — just a country works too.
            </p>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!partner1Name || !partner2Name}
            size="lg"
            className="mt-6 w-full rounded-full shadow-md shadow-primary/40"
          >
            Continue
            <ArrowRight width={16} height={16} />
          </Button>
        </>
      }
    />
  );
};
