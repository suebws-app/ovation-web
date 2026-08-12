import { useTranslations } from "next-intl";
import { ALBUMS, GENERAL2_PREFIX } from "../constants";
import { AlbumCard } from "./AlbumCard";

export const AlbumsSection = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);

  return (
    <section id="examples" className="section-container scroll-mt-20">
      <div className="mb-11 max-w-165">
        <p className="landing-eyebrow text-secondary-strong mb-3.5">
          {k("alb_tag")}
        </p>
        <h2 className="landing-h1 tablet:landing-display text-foreground">
          {k("alb_title")}
        </h2>
      </div>

      <div className="tablet:grid-cols-6 grid [grid-auto-rows:9.5rem] grid-cols-2 gap-3.5">
        {ALBUMS.map((album) => (
          <AlbumCard
            key={album.captionSuffix}
            caption={k(album.captionSuffix)}
            imageSrc={album.imageSrc}
            spanClassName={album.spanClassName}
          />
        ))}
      </div>
    </section>
  );
};
