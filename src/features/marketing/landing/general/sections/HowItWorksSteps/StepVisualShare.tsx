import Image from "next/image";
import { StepPhone } from "./StepPhone";

type StepVisualShareProps = {
  signAlt: string;
  phoneAlt: string;
};

export const StepVisualShare = ({
  signAlt,
  phoneAlt,
}: StepVisualShareProps) => (
  <div className="relative w-full max-w-120">
    <div className="border-border bg-card rounded-12 relative aspect-3/4 overflow-hidden border-8 shadow-lg">
      <Image
        src="/images/qr_code.webp"
        alt={signAlt}
        fill
        sizes="(min-width: 740px) 30vw, 80vw"
        className="object-cover"
      />
    </div>
    <StepPhone
      imageSrc="/images/guest_page.webp"
      imageAlt={phoneAlt}
      className="tablet:w-44 absolute -right-2 -bottom-8 w-32"
    />
  </div>
);
