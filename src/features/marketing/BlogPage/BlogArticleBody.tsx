"use client";

import { useRef } from "react";
import { BlogTableOfContents } from "./BlogTableOfContents";

interface BlogArticleBodyProps {
  headings: string[];
  children: React.ReactNode;
}

export const BlogArticleBody = ({
  headings,
  children,
}: BlogArticleBodyProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (index: number) => {
    const sections = bodyRef.current?.querySelectorAll("h2");
    sections?.[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <BlogTableOfContents headings={headings} onNavigate={scrollToSection} />
      <div ref={bodyRef}>{children}</div>
    </>
  );
};
