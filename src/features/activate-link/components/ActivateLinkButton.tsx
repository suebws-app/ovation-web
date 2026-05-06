"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type ActivateLinkButtonProps = {
  className?: string;
  variant?: "default" | "outline";
};

export const ActivateLinkButton = ({
  className,
  variant = "default",
}: ActivateLinkButtonProps) => {
  const t = useTranslations();
  return (
    <Button
      asChild
      variant={variant}
      className={cn("rounded-full", className)}
    >
      <Link href={appRoutes.app.activate}>{t("activate_link__cta")}</Link>
    </Button>
  );
};
