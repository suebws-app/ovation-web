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

export const PrivateHeaderDesktop = () => {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !isLocale(seg))
    .filter((seg) => seg !== "app");

  const crumbs = ["dashboard", ...segments];

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);
  const isKeepsakes = segments.includes("keepsakes");

  return (
    <header className="max-w-container desktop:flex mx-auto hidden h-16 w-full items-center justify-between py-3">
      <Breadcrumb>
        <BreadcrumbList className="type-caption">
          {parentCrumbs.map((crumb, i) => {
            const href =
              i === 0 ? "/app" : `/app/${segments.slice(0, i).join("/")}`;
            return (
              <React.Fragment key={crumb}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={href} className="capitalize">
                    {crumb}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold capitalize">
              {lastCrumb}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {isKeepsakes && <KeepsakesActions />}
    </header>
  );
};

const KeepsakesActions = () => (
  <div className="flex items-center gap-3">
    <span className="type-caption text-accent-foreground font-semibold">
      &#9733; &euro;50 credit available
    </span>
    <button
      type="button"
      className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
    >
      Cart &middot; 0
    </button>
  </div>
);
