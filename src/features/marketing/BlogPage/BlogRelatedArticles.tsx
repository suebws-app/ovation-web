import { useTranslations } from "next-intl";
import type { BlogListItem } from "@/lib/api/blog";
import { BlogRelatedArticleItem } from "./BlogRelatedArticleItem";

interface BlogRelatedArticlesProps {
  articles: BlogListItem[];
  locale: string;
}

export const BlogRelatedArticles = ({
  articles,
  locale,
}: BlogRelatedArticlesProps) => {
  const t = useTranslations();
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto mt-24 max-w-5xl px-6">
      <h2 className="type-h2 text-foreground">
        {t("marketing__blog__article__related")}
      </h2>
      <ul className="tablet:grid-cols-2 desktop:grid-cols-3 mt-8 grid gap-8">
        {articles.map((article) => (
          <BlogRelatedArticleItem
            key={article.id}
            article={article}
            locale={locale}
          />
        ))}
      </ul>
    </section>
  );
};
