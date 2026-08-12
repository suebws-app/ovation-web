import { useTranslations } from "next-intl";
import { PhoneFrame } from "./PhoneFrame";
import { ShowcaseBullet } from "./ShowcaseBullet";
import { WEDDING_KEY_PREFIX } from "../variant";

type PhoneShowcaseProps = {
  keyPrefix?: string;
};

export const PhoneShowcase = ({
  keyPrefix = WEDDING_KEY_PREFIX,
}: PhoneShowcaseProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <div className="tablet:grid-cols-2 grid grid-cols-1 items-center gap-14">
      <div className="from-secondary/30 to-warm-cream rounded-24 tablet:p-11 order-2 bg-linear-to-br p-8">
        <PhoneFrame
          imageSrc="/images/02-record.webp"
          imageAlt={k("phone_label")}
        />
      </div>
      <div className="order-1">
        <p className="landing-eyebrow text-primary">{k("phone_eyebrow")}</p>
        <h2 className="landing-h2 tablet:landing-h1 text-foreground mt-3">
          {k("phone_title_line1")}{" "}
          <span className="text-primary italic">{k("phone_title_line2")}</span>.
        </h2>
        <p className="landing-body-large text-muted-foreground mt-5">
          {k("phone_description")}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          <ShowcaseBullet>{k("phone_bullet_1")}</ShowcaseBullet>
          <ShowcaseBullet>{k("phone_bullet_2")}</ShowcaseBullet>
          <ShowcaseBullet>{k("phone_bullet_3")}</ShowcaseBullet>
        </ul>
      </div>
    </div>
  );
};
