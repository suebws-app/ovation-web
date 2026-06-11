"use client";

import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ovation/ui/components/DropdownMenu";
import { SortIcon } from "@ovation/icons/SortIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import {
  useMessageSort,
  useMessagesStore,
  type MessageSortOption,
} from "../store/useMessagesStore";

const OPTIONS: { value: MessageSortOption; labelKey: string }[] = [
  { value: "newest", labelKey: "messages__sort__newest" },
  { value: "oldest", labelKey: "messages__sort__oldest" },
  { value: "longest", labelKey: "messages__sort__longest" },
];

export const MessageSortButton = () => {
  const t = useTranslations();
  const sort = useMessageSort();
  const setSort = useMessagesStore((s) => s.setSort);

  const activeLabel =
    OPTIONS.find((o) => o.value === sort)?.labelKey ?? OPTIONS[0].labelKey;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="border-border bg-card type-caption text-muted-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
        >
          <SortIcon width={13} height={13} />
          {t(activeLabel)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt.value} onSelect={() => setSort(opt.value)}>
            <span className="flex-1">{t(opt.labelKey)}</span>
            {sort === opt.value && <CheckIcon width={12} height={12} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
