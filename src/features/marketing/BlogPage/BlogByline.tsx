import { useTranslations } from "next-intl";

export const BlogByline = () => {
  const t = useTranslations();
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
};
