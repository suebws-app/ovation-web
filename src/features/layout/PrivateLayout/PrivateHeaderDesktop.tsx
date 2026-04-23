"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ovation/ui/components/Breadcrumb";
import { Link } from "@/i18n/navigation";
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
    <header className="hidden w-full items-center justify-between py-3 h-16 max-w-container mx-auto desktop:flex">
      <Breadcrumb>
        <BreadcrumbList className="type-caption">
          {parentCrumbs.map((crumb, i) => {
            const href =
              i === 0 ? "/app" : `/app/${segments.slice(0, i).join("/")}`;
            return (
              <BreadcrumbItem key={crumb}>
                <BreadcrumbLink href={href} className="capitalize">
                  {crumb}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
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
    <span className="type-caption font-semibold text-[#9A6B2F]">
      &#9733; &euro;50 credit available
    </span>
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 type-caption font-semibold text-foreground transition-colors hover:bg-muted"
    >
      Cart &middot; 0
    </button>
  </div>
);
