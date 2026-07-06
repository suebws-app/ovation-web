"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useSession } from "@/lib/auth/client";

const isEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

const PageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isEnabled || !pathname) return;
    const query = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
};

const Identify = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!isEnabled) return;
    if (userId) {
      posthog.identify(userId);
    } else {
      posthog.reset();
    }
  }, [userId]);

  return null;
};

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!isEnabled) return <>{children}</>;
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      <Identify />
      {children}
    </PHProvider>
  );
};
