import type { ReactNode } from "react";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { PostHogProvider } from "@/components/PostHogProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <QueryProvider>{children}</QueryProvider>
    </PostHogProvider>
  );
};
