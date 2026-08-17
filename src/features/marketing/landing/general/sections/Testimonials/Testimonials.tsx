import { useTranslations, useFormatter } from "next-intl";
import { StarIcon } from "@ovation/icons/StarIcon";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { REVIEW_COUNT, REVIEW_RATING, TESTIMONIAL_ITEMS } from "./constants";
import { QuoteHighlight } from "./QuoteHighlight";
import { TestimonialCard } from "./TestimonialCard";

export const Testimonials = () => {
  const t = useTranslations();
  const format = useFormatter();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section id="reviews" className="bg-background scroll-mt-24">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("reviews_title")}
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("reviews_description")}
          </p>
          <p className="text-foreground type-body mt-6 flex items-center gap-2">
            <StarIcon
              className="text-primary size-4 fill-current"
              aria-hidden
            />
            {t(`${GENERAL_KEY_PREFIX}reviews_rating`, {
              rating: format.number(REVIEW_RATING),
              count: format.number(REVIEW_COUNT),
            })}
          </p>
        </div>

        <div className="small-desktop:grid-cols-3 tablet:mt-16 mt-10 grid grid-cols-1 gap-6">
          {TESTIMONIAL_ITEMS.map((item) => (
            <TestimonialCard
              key={item.index}
              quote={t.rich(`keepsakes__testimonial__${item.index}__quote`, {
                mark: (chunks) => <QuoteHighlight>{chunks}</QuoteHighlight>,
              })}
              author={t(`keepsakes__testimonial__${item.index}__couple`)}
              location={t(`keepsakes__testimonial__${item.index}__location`)}
              avatarSrc={item.avatarSrc}
              photoSrc={item.photoSrc}
              photoAlt={k("hero_showcase_alt")}
              photoClassName={item.photoClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
