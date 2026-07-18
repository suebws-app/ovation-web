"use client";

import { clientEnv } from "@/lib/utils/env.client";
import { ConsentListener } from "./ConsentListener";
import { PostHogIdentify } from "./PostHogIdentify";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!clientEnv.POSTHOG_KEY) return <>{children}</>;

  return (
    <>
      <ConsentListener />
      <PostHogIdentify />
      {children}
    </>
  );
};
