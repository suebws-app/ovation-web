import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { blogApi, type BlogArticle, type BlogListItem } from "@/lib/api/blog";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbListSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { BlogReferenceLink } from "./BlogReferenceLink";
import { BlogArticleMeta } from "./BlogArticleMeta";
import { BlogReadingProgress } from "./BlogReadingProgress";
import { BlogArticleBody } from "./BlogArticleBody";
import { BlogShareRow } from "./BlogShareRow";
import { BlogByline } from "./BlogByline";
import { BlogRelatedArticles } from "./BlogRelatedArticles";
import { estimateReadingMinutes } from "./readingTime";
import { extractHeadings } from "./extractHeadings";

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const fetchArticle = async (
  slug: string,
  locale: string,
): Promise<BlogArticle | null> => {
  try {
    const res = await blogApi.publicGet(slug, locale);
    return res?.article ?? null;
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) return null;
    throw err;
  }
};

const fetchRelatedArticles = async (
  locale: string,
  currentSlug: string,
): Promise<BlogListItem[]> => {
  try {
    const { items } = await blogApi.publicList(locale);
    return items.filter((item) => item.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
};

const buildFaqJsonLd = (article: BlogArticle) => {
  if (article.faqSchema.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqSchema.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
};

// Word count off the source markdown, stripped of syntax so table pipes,
// code fences, list markers, and image tags don't inflate the count that
// lands in BlogPosting.wordCount.
const stripMarkdown = (md: string): string =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    .replace(/^\s*#+\s+/gm, " ")
    .replace(/^\s*>+\s*/gm, " ")
    .replace(/^\s*[-*_]{3,}\s*$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_~]/g, " ");

const countWords = (markdown: string): number =>
  stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;

export const BlogArticlePage = async ({ params }: BlogArticlePageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await fetchArticle(slug, locale);
  if (!article) notFound();

  const t = await getTranslations();
  const relatedArticles = await fetchRelatedArticles(locale, slug);
  const headings = extractHeadings(article.contentMarkdown);
  const faqJsonLd = buildFaqJsonLd(article);
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const readingMinutes = estimateReadingMinutes(article.contentMarkdown);
  const canonicalUrl = localizedAbsoluteUrl(locale, `/blog/${slug}`);

  const blogPostingJsonLd = blogPostingSchema({
    url: canonicalUrl,
    headline: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt ?? undefined,
    imageUrl: article.coverImageUrl,
    imageAlt: article.title,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    locale: article.locale,
    wordCount: countWords(article.contentMarkdown),
    readingMinutes,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
  });

  // Home › Blog › Article — powers breadcrumb rich results in SERPs.
  const breadcrumbJsonLd = breadcrumbListSchema([
    { name: "Ovation", url: localizedAbsoluteUrl(locale, "/") },
    {
      name: t("marketing__blog__list__kicker"),
      url: localizedAbsoluteUrl(locale, "/blog"),
    },
    { name: article.title, url: canonicalUrl },
  ]);

  return (
    <>
      <JsonLd data={blogPostingJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <BlogReadingProgress />

      <article className="pb-24">
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-primary type-body-small inline-flex items-center gap-1.5 font-medium transition"
          >
            <span aria-hidden>←</span>
            <span>{t("marketing__blog__article__back")}</span>
          </Link>
        </div>
        <header className="tablet:pt-12 mx-auto flex max-w-4xl flex-col gap-6 px-6 pt-8 pb-12">
          {article.category ? (
            <span className="type-overline text-primary">
              {article.category}
            </span>
          ) : null}
          <h1 className="landing-h1 tablet:landing-display text-foreground">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="text-muted-foreground type-body-large">
              {article.excerpt}
            </p>
          ) : null}
          <BlogArticleMeta
            publishedIso={article.publishedAt}
            formattedDate={formattedDate}
            readingMinutes={readingMinutes}
          />
        </header>

        {article.coverImageUrl ? (
          <figure className="mx-auto mb-16 max-w-4xl px-6">
            <div className="rounded-16 relative aspect-video w-full overflow-hidden">
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </figure>
        ) : (
          <div className="border-border mx-auto mb-16 max-w-4xl border-t px-6" />
        )}

        <div className="mx-auto max-w-4xl px-6">
          <BlogArticleBody headings={headings}>
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{
                __html: article.contentHtml ?? "",
              }}
            />
          </BlogArticleBody>

          {article.externalReferences.length > 0 ? (
            <section className="border-border mt-16 border-t pt-12">
              <h2 className="landing-h3 text-foreground">
                {t("marketing__blog__article__further_reading")}
              </h2>
              <ul className="text-muted-foreground type-body mt-4 list-disc space-y-2 pl-6">
                {article.externalReferences.map((ref) => (
                  <BlogReferenceLink
                    key={ref.url}
                    title={ref.title}
                    url={ref.url}
                  />
                ))}
              </ul>
            </section>
          ) : null}

          <BlogShareRow
            title={article.title}
            coverImageUrl={article.coverImageUrl}
          />
          <BlogByline />
        </div>

        <BlogRelatedArticles articles={relatedArticles} locale={locale} />
      </article>
    </>
  );
};
