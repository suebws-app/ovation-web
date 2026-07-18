"use client";

interface BlogTocItemProps {
  heading: string;
  onNavigate: () => void;
}

export const BlogTocItem = ({ heading, onNavigate }: BlogTocItemProps) => {
  return (
    <li>
      <button
        type="button"
        onClick={onNavigate}
        className="text-muted-foreground hover:text-primary type-body text-left transition"
      >
        {heading}
      </button>
    </li>
  );
};
