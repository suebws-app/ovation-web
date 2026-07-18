import "server-only";
import { captureException } from "@sentry/nextjs";
import { headers as nextHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { serverEnv as env } from "@/lib/utils/env.server";
import {
  API_BASE_PATH,
  buildRequestInit,
  buildSearch,
  ensureLeadingSlash,
  parseError,
  readJson,
  type ApiFetchOptions,
  type Paginated,
} from "./client";

const buildBackendUrl = (path: string, query?: ApiFetchOptions["query"]) =>
  `${env.INTERNAL_API_URL}${API_BASE_PATH}${ensureLeadingSlash(path)}${buildSearch(query)}`;

const withSessionHeaders = async (init: RequestInit): Promise<RequestInit> => {
  const headers = new Headers(init.headers);
  const incoming = await nextHeaders();
  const cookieHeader = incoming.get("cookie");
  if (cookieHeader) headers.set("cookie", cookieHeader);
  if (!headers.has("accept-language")) {
    headers.set("accept-language", await getLocale());
  }
  if (env.CF_ORIGIN_TOKEN) {
    headers.set("x-origin-token", env.CF_ORIGIN_TOKEN);
  }

  return { ...init, headers };
};

const withPublicHeaders = async (init: RequestInit): Promise<RequestInit> => {
  const headers = new Headers(init.headers);
  headers.set("accept-language", await getLocale());
  if (env.CF_ORIGIN_TOKEN) {
    headers.set("x-origin-token", env.CF_ORIGIN_TOKEN);
  }

  return { ...init, headers };
};

const runApiFetch = async (
  path: string,
  options: ApiFetchOptions,
  buildHeaders: (init: RequestInit) => Promise<RequestInit>,
): Promise<Response> => {
  const init = await buildHeaders(buildRequestInit(options));
  try {
    return await fetch(buildBackendUrl(path, options.query), init);
  } catch (err) {
    captureException(err, {
      tags: { source: "apiFetch", kind: "network", side: "server" },
      extra: { path },
    });
    throw err;
  }
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const res = await runApiFetch(path, options, withSessionHeaders);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T }>(res);
  return (json?.data ?? (undefined as T)) as T;
};

export const publicApiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const res = await runApiFetch(path, options, withPublicHeaders);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T }>(res);
  return (json?.data ?? (undefined as T)) as T;
};

export const apiFetchPaginated = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> => {
  const res = await runApiFetch(path, options, withSessionHeaders);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T[]; nextCursor: string | null }>(res);
  return { items: json?.data ?? [], nextCursor: json?.nextCursor ?? null };
};

export const publicApiFetchPaginated = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> => {
  const res = await runApiFetch(path, options, withPublicHeaders);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T[]; nextCursor: string | null }>(res);
  return { items: json?.data ?? [], nextCursor: json?.nextCursor ?? null };
};

export type PagedList<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const publicApiFetchPaged = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<PagedList<T>> => {
  const res = await runApiFetch(path, options, withPublicHeaders);
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>(res);
  return {
    items: json?.data ?? [],
    page: json?.page ?? 1,
    pageSize: json?.pageSize ?? 0,
    total: json?.total ?? 0,
    totalPages: json?.totalPages ?? 1,
  };
};
