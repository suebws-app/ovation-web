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
import { KeepsakesActions } from "./KeepsakesActions";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const AppHeaderDesktop = () => {
  const pathname = usePathname();
  const eventLabel = useCurrentEventStore((s) => s.label);
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !isLocale(seg));

  const crumbs = ["home", ...segments];

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);
  const isKeepsakes =
    segments.includes("keepsakes") || segments.includes("cart");

  return (
    <header className="max-w-container desktop:flex mx-auto hidden h-16 w-full items-center justify-between px-6 py-3">
      <Breadcrumb>
        <BreadcrumbList className="type-caption">
          {parentCrumbs.map((crumb, i) => {
            const href =
              i === 0 ? "/home" : `/${segments.slice(0, i).join("/")}`;
            const label =
              UUID_RE.test(crumb) && eventLabel ? eventLabel : crumb;
            return (
              <React.Fragment key={crumb}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={href} className="capitalize">
                    {label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold capitalize">
              {UUID_RE.test(lastCrumb) && eventLabel ? eventLabel : lastCrumb}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {isKeepsakes && <KeepsakesActions />}
    </header>
  );
};
