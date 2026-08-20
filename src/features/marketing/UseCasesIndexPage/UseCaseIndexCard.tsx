import { Link } from "@/i18n/navigation";

type UseCaseIndexCardProps = {
  href: string;
  title: string;
  description: string;
};

export const UseCaseIndexCard = ({
  href,
  title,
  description,
}: UseCaseIndexCardProps) => (
  <Link
    href={href}
    className="border-border rounded-16 bg-card hover:border-primary/40 flex flex-col border p-6 transition"
  >
    <h3 className="type-body text-foreground font-semibold">{title}</h3>
    <p className="text-muted-foreground type-body-small mt-2 leading-relaxed">
      {description}
    </p>
  </Link>
);
