import { useTranslations } from "next-intl";

interface BlogArticleMetaProps {
  publishedIso: string | null;
  formattedDate: string | null;
  readingMinutes: number;
}

export const BlogArticleMeta = ({
  publishedIso,
  formattedDate,
  readingMinutes,
}: BlogArticleMetaProps) => {
  const t = useTranslations();
  return (
    <div className="text-muted-foreground type-body-small flex flex-wrap items-center gap-x-3 gap-y-1">
      {formattedDate ? (
        <time dateTime={publishedIso ?? undefined}>{formattedDate}</time>
      ) : null}
      {formattedDate ? <span aria-hidden>·</span> : null}
      <span>
        {t("marketing__blog__article__reading_time", {
          minutes: readingMinutes,
        })}
      </span>
    </div>
  );
};
