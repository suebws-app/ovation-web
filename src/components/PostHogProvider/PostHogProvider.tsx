"use client";

import { clientEnv } from "@/lib/utils/env.client";
import { DeferredPostHogLoader } from "./DeferredPostHogLoader";
import { PostHogIdentify } from "./PostHogIdentify";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!clientEnv.POSTHOG_KEY) return <>{children}</>;

  return (
    <>
      <DeferredPostHogLoader />
      <PostHogIdentify />
      {children}
    </>
  );
};
