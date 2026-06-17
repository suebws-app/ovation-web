"use client";

import { Toaster as SonnerPrimitive, type ToasterProps } from "sonner";
import { useThemeStore } from "../utils/useThemeStore";

export const Sonner = (props: ToasterProps) => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <SonnerPrimitive
      theme={theme}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "type-body-small! rounded-12! shadow-lg! border! items-center! gap-3! py-3! pr-9! pl-4! backdrop-blur-md!",
          title: "type-body-small! font-medium! leading-snug!",
          description: "type-caption! opacity-80!",
          actionButton: "rounded-8! type-button-small!",
          cancelButton: "rounded-8! type-button-small!",
          closeButton:
            "absolute! top-[66%]! right-1! left-auto! flex! size-6! shrink-0! -translate-y-1/2! translate-x-0! items-center! justify-center! rounded-full! border-transparent! bg-transparent! text-current! opacity-70! transition! hover:bg-current/15! hover:opacity-100!",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--secondary)",
          "--success-text": "var(--secondary-foreground)",
          "--success-border": "var(--secondary)",
          "--error-bg": "var(--danger)",
          "--error-text": "var(--primary-foreground)",
          "--error-border": "var(--danger)",
          "--warning-bg": "var(--accent)",
          "--warning-text": "var(--accent-foreground)",
          "--warning-border": "var(--accent)",
          "--info-bg": "var(--muted)",
          "--info-text": "var(--muted-foreground)",
          "--info-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
