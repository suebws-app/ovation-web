import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { blogApi } from "@/lib/api/blog";
import type { LocalePageProps } from "@/i18n/types";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { BlogListCard } from "./BlogListCard";

const fetchArticles = async (locale: string) => {
  try {
    return await blogApi.publicList(locale);
  } catch {
    return { items: [], nextCursor: null };
  }
};

export const BlogListPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();
  const { items } = use(fetchArticles(locale));

  return (
    <>
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__blog__list__kicker")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__blog__list__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__blog__list__title_line2")}
            </span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 leading-relaxed">
            {t("marketing__blog__list__subtitle")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          {items.length === 0 ? (
            <p className="text-muted-foreground type-body">
              {t("marketing__blog__list__empty")}
            </p>
          ) : (
            <ul className="tablet:grid-cols-2 grid gap-8">
              {items.map((article) => (
                <li key={article.id}>
                  <BlogListCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};
