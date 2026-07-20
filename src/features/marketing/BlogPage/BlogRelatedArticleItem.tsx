import type { BlogListItem } from "@/lib/api/blog";
import { BlogListCard } from "./BlogListCard";

interface BlogRelatedArticleItemProps {
  article: BlogListItem;
  locale: string;
}

export const BlogRelatedArticleItem = ({
  article,
  locale,
}: BlogRelatedArticleItemProps) => {
  return (
    <li>
      <BlogListCard article={article} locale={locale} />
    </li>
  );
};
