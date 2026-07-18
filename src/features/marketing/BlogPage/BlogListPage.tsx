import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Pagination } from "@/components/Pagination";
import { blogApi } from "@/lib/api/blog";
import type { LocalePageProps } from "@/i18n/types";
import { BlogListCard } from "./BlogListCard";
import { BlogListHeader } from "./BlogListHeader";

type BlogListPageProps = LocalePageProps & {
  searchParams: Promise<{ page?: string }>;
};

const parsePage = (raw: string | undefined): number => {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
};

const fetchArticles = async (locale: string, page: number) => {
  try {
    return await blogApi.publicList(locale, page);
  } catch {
    return {
      items: [],
      page,
      pageSize: 0,
      total: 0,
      totalPages: 1,
    };
  }
};

const buildBlogHref = (page: number) =>
  page === 1
    ? { pathname: "/blog" as const }
    : { pathname: "/blog" as const, query: { page: String(page) } };

export const BlogListPage = ({ params, searchParams }: BlogListPageProps) => {
  const { locale } = use(params);
  const { page: pageParam } = use(searchParams);
  setRequestLocale(locale);

  const t = useTranslations();
  const page = parsePage(pageParam);
  const { items, totalPages } = use(fetchArticles(locale, page));

  return (
    <>
      <BlogListHeader />

      <section>
        <div className="section-container-small">
          {items.length === 0 ? (
            <p className="text-muted-foreground type-body">
              {t("marketing__blog__list__empty")}
            </p>
          ) : (
            <>
              <ul className="tablet:grid-cols-2 grid gap-8">
                {items.map((article) => (
                  <li key={article.id}>
                    <BlogListCard article={article} locale={locale} />
                  </li>
                ))}
              </ul>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={buildBlogHref}
                labels={{
                  prev: t("common__pagination__prev"),
                  next: t("common__pagination__next"),
                }}
                className="mt-12"
              />
            </>
          )}
        </div>
      </section>
    </>
  );
};
