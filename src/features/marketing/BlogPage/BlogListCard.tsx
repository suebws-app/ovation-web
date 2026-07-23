import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogListItem } from "@/lib/api/blog";

interface BlogListCardProps {
  article: BlogListItem;
  locale: string;
}

export const BlogListCard = ({ article, locale }: BlogListCardProps) => {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="border-border rounded-16 hover:border-primary group flex h-full flex-col overflow-hidden border transition"
    >
      {article.coverImageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt ?? article.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {article.category ? (
          <span className="type-overline text-primary">{article.category}</span>
        ) : null}
        <h2 className="landing-h3 text-foreground group-hover:text-primary transition">
          {article.title}
        </h2>
        {article.excerpt ? (
          <p className="text-muted-foreground type-body line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        ) : null}
        {publishedDate ? (
          <time
            dateTime={article.publishedAt ?? undefined}
            className="text-muted-foreground type-body-small mt-auto pt-2"
          >
            {publishedDate}
          </time>
        ) : null}
      </div>
    </Link>
  );
};
