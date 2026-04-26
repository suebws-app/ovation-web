import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/utils/env";
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
  `${env.API_URL}${API_BASE_PATH}${ensureLeadingSlash(path)}${buildSearch(query)}`;

const readAuthHeader = async (): Promise<string | undefined> => {
  const store = await cookies();
  const token = store.get("auth_token")?.value;
  return token ? `Bearer ${token}` : undefined;
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const authHeader = await readAuthHeader();
  const res = await fetch(
    buildBackendUrl(path, options.query),
    buildRequestInit(options, authHeader),
  );
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T }>(res);
  return (json?.data ?? (undefined as T)) as T;
};

export const apiFetchPaginated = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Paginated<T>> => {
  const authHeader = await readAuthHeader();
  const res = await fetch(
    buildBackendUrl(path, options.query),
    buildRequestInit(options, authHeader),
  );
  if (!res.ok) throw await parseError(res);
  const json = await readJson<{ data: T[]; nextCursor: string | null }>(res);
  return { items: json?.data ?? [], nextCursor: json?.nextCursor ?? null };
};
