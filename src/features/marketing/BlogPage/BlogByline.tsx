import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogAuthor } from "@/lib/api/blog";

interface BlogBylineProps {
  author?: BlogAuthor | null;
}

export const BlogByline = ({ author }: BlogBylineProps) => {
  const t = useTranslations();

  if (!author) {
    return (
      <div className="border-border mt-10 flex items-center gap-4 border-t pt-8">
        <div className="bg-primary/10 text-primary type-h3 flex size-12 shrink-0 items-center justify-center rounded-full font-serif">
          O
        </div>
        <div>
          <p className="type-body text-foreground font-semibold">
            {t("marketing__blog__byline__name")}
          </p>
          <p className="type-body-small text-muted-foreground">
            {t("marketing__blog__byline__bio")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="border-border hover:border-primary mt-10 flex items-center gap-4 border-t pt-8 transition"
    >
      {author.imageUrl ? (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
          <Image
            src={author.imageUrl}
            alt={author.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="bg-primary/10 text-primary type-h3 flex size-12 shrink-0 items-center justify-center rounded-full font-serif">
          {author.name.charAt(0)}
        </div>
      )}
      <div>
        <p className="type-body text-foreground font-semibold">{author.name}</p>
        {author.role ? (
          <p className="type-body-small text-muted-foreground">{author.role}</p>
        ) : null}
      </div>
    </Link>
  );
};
