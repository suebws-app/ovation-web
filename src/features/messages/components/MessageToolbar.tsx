"use client";

import { Button } from "@ovation/ui/components/Button";
import { Download } from "@ovation/icons/Download";

export const MessageToolbar = () => (
  <div className="border-border bg-card tablet:px-7 border-b px-4 py-5">
    <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-4">
      <div>
        <h1 className="desktop:text-[2rem] font-serif text-[1.75rem] leading-tight font-semibold tracking-tight">
          <span>87 messages.</span>{" "}
          <span className="text-primary italic">1h 42m of love.</span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-1.5">
          From 112 guests &middot; 64 with photos &middot; 14 favourited
          &middot; last received 2 days ago
        </p>
      </div>
      <div className="flex gap-2">
        <SortButton />
        <Button className="rounded-10 bg-foreground text-background hover:bg-foreground/90">
          <Download width={13} height={13} /> Export all
        </Button>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2.5">
      <SearchInput />
      <div className="desktop:flex hidden gap-1.5">
        <FilterChip label="Wedding night" active />
        <FilterChip label="+ Add filter" />
      </div>
    </div>
  </div>
);

const SearchInput = () => (
  <div className="rounded-10 border-border bg-background flex flex-1 items-center gap-2.5 border px-3.5 py-2.5">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="text-muted-foreground"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
    <input
      placeholder="Search transcripts, names, quotes\u2026"
      className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
    />
    <kbd className="rounded-4 border-border bg-card type-caption text-muted-foreground border px-1.5 py-0.5">
      \u2318K
    </kbd>
  </div>
);

const SortButton = () => (
  <button
    type="button"
    className="rounded-10 border-border bg-card type-body-small text-muted-foreground hover:bg-muted desktop:inline-flex hidden cursor-pointer items-center gap-1.5 border px-3.5 py-2.5 font-medium transition-colors"
  >
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l-3 3m3-3l3 3" />
    </svg>
    Newest first
  </button>
);

const FilterChip = ({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) => (
  <span
    className={`type-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${active ? "bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground border"}`}
  >
    {label}
    {active && (
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    )}
  </span>
);
