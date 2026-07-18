import { publicApiFetch, publicApiFetchPaged } from "./server";
import type { ApiFetchOptions } from "./client";

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  locale: string;
  category: string | null;
  primaryKeyword: string;
  secondaryKeywords: string[];
  excerpt: string | null;
  contentMarkdown: string;
  contentHtml: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogMetadata: Record<string, string>;
  faqSchema: Array<{ question: string; answer: string }>;
  imagePrompts: Array<{ position: string; prompt: string; alt: string }>;
  coverImageUrl: string | null;
  internalLinks: Array<{ anchor: string; slug: string }>;
  externalReferences: Array<{ title: string; url: string }>;
  sourceArticleId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogArticleAlternate {
  locale: string;
  slug: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  locale: string;
  category: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
}

const listCacheOptions: ApiFetchOptions = {
  cache: "force-cache",
  next: { revalidate: 300, tags: ["blog-articles"] },
};

const articleCacheOptions: ApiFetchOptions = {
  cache: "force-cache",
  next: { revalidate: 300, tags: ["blog-articles"] },
};

export const blogApi = {
  publicList: (locale: string, page = 1, limit = 10) =>
    publicApiFetchPaged<BlogListItem>("/public/blog/articles", {
      query: { locale, page, limit },
      ...listCacheOptions,
    }),

  publicGet: (slug: string, locale: string) =>
    publicApiFetch<{
      article: BlogArticle;
      alternates: BlogArticleAlternate[];
    }>(`/public/blog/articles/${slug}`, {
      query: { locale },
      ...articleCacheOptions,
    }),
};
