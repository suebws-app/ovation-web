import { Badge } from "@ovation/ui/components/Badge";
import { KeepsakePrice } from "./KeepsakePrice";

type KeepsakeCardProps = {
  name: string;
  description: string;
  price: string;
  fromLabel: string;
  productType: string;
  comingSoon?: boolean;
  comingSoonLabel: string;
};

export const KeepsakeCard = ({
  name,
  description,
  price,
  fromLabel,
  productType,
  comingSoon,
  comingSoonLabel,
}: KeepsakeCardProps) => (
  <div
    className={`border-border rounded-16 bg-card relative flex flex-col border p-6 ${
      comingSoon ? "opacity-70" : ""
    }`}
  >
    {comingSoon && (
      <Badge variant="outline" className="absolute top-4 right-4">
        {comingSoonLabel}
      </Badge>
    )}
    <h3 className="type-body font-semibold">{name}</h3>
    <p className="text-muted-foreground type-body-small mt-2 flex-1 leading-relaxed">
      {description}
    </p>
    <p
      className={`type-body mt-4 font-semibold ${
        comingSoon ? "text-muted-foreground" : "text-primary"
      }`}
    >
      {!comingSoon && (
        <>
          {fromLabel}{" "}
          <KeepsakePrice productType={productType} fallbackPrice={price} />
        </>
      )}
    </p>
  </div>
);
