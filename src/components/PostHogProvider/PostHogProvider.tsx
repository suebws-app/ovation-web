"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { clientEnv } from "@/lib/utils/env.client";
import { PostHogIdentify } from "./PostHogIdentify";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!clientEnv.POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <PostHogIdentify />
      {children}
    </PHProvider>
  );
};
