"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@ovation/ui/components/Sheet";
import { XIcon } from "@ovation/icons/XIcon";
import { Button } from "@ovation/ui/components/Button";
import { Skeleton } from "@ovation/ui/components/Skeleton";
import { useDemoSession } from "./useDemoSession";
import { useDemoFeed } from "./useDemoFeed";
import { DemoStep } from "./DemoStep";
import { DemoQrCard } from "./DemoQrCard";
import { DemoStage } from "./DemoStage";

type DemoSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DemoSheet = ({ open, onOpenChange }: DemoSheetProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`marketing__${suffix}`);
  const [openedAt] = useState(() => Date.now());
  const { session, isLoading, isError, retry } = useDemoSession(open);
  const { items } = useDemoFeed(
    session?.slug,
    session?.galleryCode,
    open,
    openedAt,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-24 max-h-[80vh] overflow-y-auto"
      >
        <SheetClose
          aria-label={k("demo_close")}
          className="bg-card/80 text-muted-foreground hover:text-foreground ring-border absolute top-4 right-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors"
        >
          <XIcon width={16} height={16} aria-hidden />
        </SheetClose>

        <div className="small-desktop:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] small-desktop:gap-10 small-desktop:px-6 mx-auto grid w-full max-w-332 grid-cols-1 gap-6 px-5 py-6">
          <div className="flex flex-col items-start">
            <SheetTitle className="landing-h3 text-foreground">
              {k("demo_title")}
            </SheetTitle>
            <SheetDescription className="type-body text-muted-foreground mt-3">
              {k("demo_description")}
            </SheetDescription>

            <ol className="mt-5 flex flex-col gap-3">
              <DemoStep index={1} text={k("demo_step_1")} />
              <DemoStep index={2} text={k("demo_step_2")} />
            </ol>

            <div className="mt-6">
              {isError && (
                <div className="flex flex-col items-start gap-3">
                  <p className="type-body text-muted-foreground">
                    {k("demo_error")}
                  </p>
                  <Button variant="pillPrimary" size="pill" onClick={retry}>
                    {k("demo_retry")}
                  </Button>
                </div>
              )}
              {!isError && (isLoading || !session) && (
                <Skeleton className="rounded-16 size-40" />
              )}
              {!isError && session && (
                <DemoQrCard guestUrl={session.guestUrl} />
              )}
            </div>
          </div>

          <DemoStage items={items} guestUrl={session?.guestUrl ?? null} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
