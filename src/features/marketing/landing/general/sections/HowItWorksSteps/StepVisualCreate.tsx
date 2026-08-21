import { BrowserFrame } from "../../../sections/BrowserFrame";
import { StepPhone } from "./StepPhone";

type StepVisualCreateProps = {
  browserAlt: string;
  phoneAlt: string;
};

export const StepVisualCreate = ({
  browserAlt,
  phoneAlt,
}: StepVisualCreateProps) => (
  <div className="relative w-full max-w-140">
    <BrowserFrame
      url="ovationday.com"
      imageSrc="/images/dashboard.webp"
      imageAlt={browserAlt}
    />
    <StepPhone
      imageSrc="/images/guest_page.webp"
      imageAlt={phoneAlt}
      className="tablet:-right-4 tablet:w-42 absolute right-0 -bottom-8 w-32"
    />
  </div>
);
