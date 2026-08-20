import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GuestAvatar } from "../welcome/GuestAvatar";

type UploadHeaderProps = {
  slug: string;
  title: string;
  initials: string;
  avatarUrl: string | null;
};

export const UploadHeader = ({
  slug,
  title,
  initials,
  avatarUrl,
}: UploadHeaderProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={appRoutes.guest.album(slug)}
        className="type-body-small text-primary inline-flex items-center gap-1 font-semibold"
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
        {t("guest__upload__back")}
      </Link>
      <div className="flex flex-col items-center gap-2">
        <GuestAvatar url={avatarUrl} initials={initials} alt={title} />
        <p className="type-body text-foreground font-semibold">{title}</p>
      </div>
    </div>
  );
};
