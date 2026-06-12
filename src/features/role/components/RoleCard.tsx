import { useTranslations } from "next-intl";
import { Card } from "@ovation/ui/components/Card";
import { Link } from "@/i18n/navigation";

type RoleCardProps = {
  title: string;
  description: string;
  href: string;
};

export const RoleCard = ({ title, description, href }: RoleCardProps) => {
  const t = useTranslations();

  return (
    <Link href={href} className="group block">
      <Card className="tablet:gap-4 tablet:p-8 flex h-full cursor-pointer flex-col gap-2 rounded-3xl p-5 transition-shadow group-hover:shadow-lg">
        <p className="type-h4 tablet:type-h3 font-semibold">{t(title)}</p>
        <p className="text-muted-foreground type-body-small leading-relaxed">
          {t(description)}
        </p>
      </Card>
    </Link>
  );
};
