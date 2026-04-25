"use client";

import { Logo } from "@ovation/ui/components/Logo";

type MobileHeaderProps = {
  onMenuToggle: () => void;
};

export const MobileHeader = ({ onMenuToggle }: MobileHeaderProps) => (
  <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
    <Logo />
    <button
      type="button"
      onClick={onMenuToggle}
      className="rounded-10 text-foreground hover:bg-muted flex size-10 cursor-pointer items-center justify-center transition-colors"
      aria-label="Open menu"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </header>
);
