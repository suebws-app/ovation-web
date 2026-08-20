"use client";

import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ovation/ui/components/DropdownMenu";
import { MenuIcon } from "@ovation/icons/MenuIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { ArrowLeftIcon } from "@ovation/icons/ArrowLeftIcon";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { AlbumCollection } from "./albumScope";

type AlbumMenuProps = {
  slug: string;
  onOpenCollection?: (collection: AlbumCollection) => void;
};

export const AlbumMenu = ({ slug, onOpenCollection }: AlbumMenuProps) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("guest__album__menu")}
          className="text-foreground flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur transition-colors hover:bg-white"
        >
          <MenuIcon className="size-5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
        {onOpenCollection && (
          <>
            <DropdownMenuItem onSelect={() => onOpenCollection("mine")}>
              <ImageIcon className="size-4" aria-hidden />
              <span className="flex-1">{t("guest__album__filter_mine")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onOpenCollection("liked")}>
              <HeartIcon className="size-4" aria-hidden />
              <span className="flex-1">{t("guest__album__filter_liked")}</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onSelect={() =>
            router.push(`${appRoutes.guest.base(slug)}?edit=name`)
          }
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          <span className="flex-1">{t("guest__album__back_to_welcome")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
