import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { blogApi, type BlogAuthor, type BlogListItem } from "@/lib/api/blog";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, personSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { BlogListCard } from "../BlogPage/BlogListCard";
import { AuthorSocialLinks } from "./AuthorSocialLinks";

interface AuthorPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const fetchAuthor = async (
  slug: string,
  locale: string,
): Promise<{ author: BlogAuthor; articles: BlogListItem[] } | null> => {
  try {
    return await blogApi.publicAuthor(slug, locale);
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) return null;
    throw err;
  }
};

export const AuthorPage = async ({ params }: AuthorPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await fetchAuthor(slug, locale);
  if (!result) notFound();

  const { author, articles } = result;
  const t = await getTranslations();
  const canonicalUrl = localizedAbsoluteUrl(locale, `/authors/${slug}`);

  const personJsonLd = personSchema({
    slug: author.slug,
    name: author.name,
    imageUrl: author.imageUrl,
    bio: author.bio ?? undefined,
    sameAs: author.sameAs,
  });

  const breadcrumbJsonLd = breadcrumbListSchema([
    { name: "Ovation", url: localizedAbsoluteUrl(locale, "/") },
    {
      name: t("marketing__blog__list__kicker"),
      url: localizedAbsoluteUrl(locale, "/blog"),
    },
    { name: author.name, url: canonicalUrl },
  ]);

  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <section>
        <div className="section-container-small">
          <div className="flex flex-col items-start gap-6">
            {author.imageUrl ? (
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={author.imageUrl}
                  alt={author.name}
                  fill
                  sizes="96px"
                  priority
                  className="object-cover"
                />
              </div>
            ) : null}
            <div>
              <h1 className="landing-h1 text-foreground">{author.name}</h1>
              {author.role ? (
                <p className="text-primary type-body-large mt-2">
                  {author.role}
                </p>
              ) : null}
            </div>
            {author.bio ? (
              <p className="text-muted-foreground type-body-large max-w-130 leading-relaxed">
                {author.bio}
              </p>
            ) : null}
            {author.sameAs.length > 0 ? (
              <AuthorSocialLinks urls={author.sameAs} />
            ) : null}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__author__articles_heading")}
          </h2>
          {articles.length === 0 ? (
            <p className="text-muted-foreground type-body mt-6">
              {t("marketing__author__no_articles")}
            </p>
          ) : (
            <ul className="tablet:grid-cols-2 desktop:grid-cols-3 mt-8 grid gap-6">
              {articles.map((article) => (
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
