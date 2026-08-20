"use client";

import { useQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/api/public-client";
import { queryKeys } from "@/lib/query/keys";
import type { DemoSession } from "@/lib/api/types";

const STORAGE_KEY = "ovation.demo.session";

const readStoredSession = (): DemoSession | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoSession;
    if (!parsed?.slug || !parsed?.galleryCode) return null;
    if (Date.parse(parsed.expiresAt) <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStoredSession = (session: DemoSession | null) => {
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
};

const resolveSession = async (): Promise<DemoSession> => {
  const stored = readStoredSession();
  if (stored) {
    try {
      const revalidated = await publicClient.getDemoSession(stored.slug);
      writeStoredSession(revalidated);
      return revalidated;
    } catch {
      writeStoredSession(null);
    }
  }

  const created = await publicClient.createDemoSession();
  writeStoredSession(created);
  return created;
};

export const useDemoSession = (active: boolean) => {
  const query = useQuery({
    queryKey: queryKeys.demo.session(),
    queryFn: resolveSession,
    enabled: active,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    session: query.data ?? null,
    isLoading: query.isPending,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
};
