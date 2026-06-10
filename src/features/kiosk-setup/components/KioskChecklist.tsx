"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { useTranslations } from "next-intl";
import { KioskChecklistItem } from "./KioskChecklistItem";

type ChecklistKey =
  | "charger"
  | "stand"
  | "volume"
  | "dnd"
  | "airplane"
  | "test";

const ITEM_KEYS: ReadonlyArray<{
  id: ChecklistKey;
  titleKey: string;
  descKey: string;
  ctaKey?: string;
}> = [
  {
    id: "charger",
    titleKey: "kiosk__checklist__charger__title",
    descKey: "kiosk__checklist__charger__desc",
  },
  {
    id: "stand",
    titleKey: "kiosk__checklist__stand__title",
    descKey: "kiosk__checklist__stand__desc",
  },
  {
    id: "volume",
    titleKey: "kiosk__checklist__volume__title",
    descKey: "kiosk__checklist__volume__desc",
  },
  {
    id: "dnd",
    titleKey: "kiosk__checklist__dnd__title",
    descKey: "kiosk__checklist__dnd__desc",
  },
  {
    id: "airplane",
    titleKey: "kiosk__checklist__airplane__title",
    descKey: "kiosk__checklist__airplane__desc",
  },
  {
    id: "test",
    titleKey: "kiosk__checklist__test__title",
    descKey: "kiosk__checklist__test__desc",
    ctaKey: "kiosk__checklist__test__cta",
  },
];

const storageKey = (eventId?: string) =>
  `ovation_kiosk_checklist:${eventId ?? "default"}`;

type KioskChecklistProps = {
  eventId?: string;
  onTestClick?: () => void;
};

export const KioskChecklist = ({
  eventId,
  onTestClick,
}: KioskChecklistProps) => {
  const t = useTranslations();
  const [done, setDone] = useState<Record<ChecklistKey, boolean>>({
    charger: false,
    stand: false,
    volume: false,
    dnd: false,
    airplane: false,
    test: false,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = window.localStorage.getItem(storageKey(eventId));
        if (raw) setDone((prev) => ({ ...prev, ...JSON.parse(raw) }));
      } catch {
        // ignore
      }
      setHydrated(true);
    });
  }, [eventId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey(eventId), JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [done, eventId, hydrated]);

  const toggle = useCallback((id: ChecklistKey) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const items = useMemo(
    () =>
      ITEM_KEYS.map((item) => ({
        id: item.id,
        title: t(item.titleKey),
        description: t(item.descKey),
        done: done[item.id],
        cta: item.ctaKey ? t(item.ctaKey) : undefined,
      })),
    [t, done],
  );

  const doneCount = items.filter((i) => i.done).length;

  const handleCta = (id: ChecklistKey) => {
    if (id === "test") {
      onTestClick?.();
    }
    toggle(id);
  };

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 tracking-tight">
          {t("kiosk__checklist__title")}
        </h2>
        <span className="type-caption text-muted-foreground">
          {t.rich("kiosk__checklist__progress", {
            done: doneCount,
            total: items.length,
            strong: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
          })}
        </span>
      </div>
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        {items.map((item) => (
          <KioskChecklistItem
            key={item.id}
            title={item.title}
            description={item.description}
            done={item.done}
            cta={item.cta}
            onToggle={() => toggle(item.id)}
            onCta={() => handleCta(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
