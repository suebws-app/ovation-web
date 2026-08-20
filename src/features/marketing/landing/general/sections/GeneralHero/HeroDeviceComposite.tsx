import { useTranslations } from "next-intl";
import { HeroTabletScreen } from "./HeroTabletScreen";
import { HeroPhoneScreen } from "./HeroPhoneScreen";

type HeroDeviceCompositeProps = {
  keyPrefix: string;
};

export const HeroDeviceComposite = ({
  keyPrefix,
}: HeroDeviceCompositeProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <div className="relative">
      <div className="tablet:pl-16 desktop:pl-24 pl-9">
        <HeroTabletScreen
          photoAlt={k("hero_showcase_alt")}
          captionLabel={k("hero_showcase_caption")}
          qrLabel={k("hero_showcase_qr_label")}
        />
      </div>

      <div className="tablet:bottom-4 desktop:bottom-6 absolute bottom-4 left-0 w-1/4">
        <HeroPhoneScreen
          photoAlt={k("hero_showcase_alt")}
          newLabel={k("hero_showcase_phone_new")}
          uploadLabel={k("hero_showcase_phone_upload")}
        />
      </div>
    </div>
  );
};
