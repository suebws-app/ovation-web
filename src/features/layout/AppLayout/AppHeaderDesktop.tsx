"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ovation/ui/components/Breadcrumb";
import { isLocale } from "@/lib/utils/isLocale";
import { useCurrentEventStore } from "@/features/events/useCurrentEventStore";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AppHeaderDesktopProps = {
  isPro: boolean;
};

export const AppHeaderDesktop = ({ isPro }: AppHeaderDesktopProps) => {
  const pathname = usePathname();
  const storeLabel = useCurrentEventStore((s) => s.label);
  const eventLabel = isPro ? storeLabel : null;
  if (!isPro) return null;
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !isLocale(seg));

  const HIDDEN_SEGMENTS = new Set(["events"]);
  const crumbs = segments.filter((seg) => !HIDDEN_SEGMENTS.has(seg));
  const labelFor = (seg: string) => (UUID_RE.test(seg) ? eventLabel : seg);
  const visibleCount = crumbs.filter(
    (seg) => !UUID_RE.test(seg) || Boolean(eventLabel),
  ).length;
  const showBreadcrumb = visibleCount > 1;
  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);
  if (!showBreadcrumb) return null;

  return (
    <header className="max-w-container desktop:flex mx-auto hidden h-16 w-full items-center justify-between px-6 py-3">
      {showBreadcrumb ? (
        <Breadcrumb>
          <BreadcrumbList className="type-caption">
            {parentCrumbs.map((crumb, i) => {
              if (UUID_RE.test(crumb) && !eventLabel) return null;
              const endIdx = segments.indexOf(crumb) + 1;
              const href = `/${segments.slice(0, endIdx).join("/")}`;
              return (
                <React.Fragment key={`${crumb}-${i}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={href} className="capitalize">
                      {labelFor(crumb)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );
            })}
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold capitalize">
                {labelFor(lastCrumb)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div />
      )}
    </header>
  );
};
