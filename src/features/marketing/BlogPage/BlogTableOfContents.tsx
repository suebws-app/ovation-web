"use client";

import { useTranslations } from "next-intl";
import { BlogTocItem } from "./BlogTocItem";

interface BlogTableOfContentsProps {
  headings: string[];
  onNavigate: (index: number) => void;
}

export const BlogTableOfContents = ({
  headings,
  onNavigate,
}: BlogTableOfContentsProps) => {
  const t = useTranslations();
  if (headings.length < 2) return null;

  const label = t("marketing__blog__toc__label");

  return (
    <nav
      aria-label={label}
      className="border-border rounded-16 bg-muted/40 mb-12 border p-6"
    >
      <p className="type-overline text-muted-foreground">{label}</p>
      <ol className="mt-4 space-y-2">
        {headings.map((heading, index) => (
          <BlogTocItem
            key={`${index}-${heading}`}
            heading={heading}
            onNavigate={() => onNavigate(index)}
          />
        ))}
      </ol>
    </nav>
  );
};
