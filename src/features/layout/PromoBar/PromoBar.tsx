import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { PromoBarTrack } from "./PromoBarTrack";

type PromoBarProps = {
  className?: string;
};

export const PromoBar = ({ className }: PromoBarProps) => {
  const t = useTranslations();
  const message = t("marketing__promo_bar__message");

  return (
    <div
      role="status"
      aria-label={message}
      className={cn(
        "bg-foreground text-background relative overflow-hidden py-2",
        className,
      )}
    >
      <div className="animate-marquee flex w-max">
        <PromoBarTrack message={message} />
        <PromoBarTrack message={message} />
      </div>
    </div>
  );
};
