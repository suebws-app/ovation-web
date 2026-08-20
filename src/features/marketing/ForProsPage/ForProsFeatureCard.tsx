import Image from "next/image";

type ForProsFeatureCardProps = {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

export const ForProsFeatureCard = ({
  title,
  body,
  imageSrc,
  imageAlt,
}: ForProsFeatureCardProps) => (
  <div className="flex flex-col">
    <div className="rounded-16 bg-warm-panel/40 relative aspect-4/3 w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1200px) 30vw, (min-width: 740px) 45vw, 90vw"
        className="object-cover"
      />
    </div>
    <h3 className="landing-h3 text-foreground mt-6 text-center">{title}</h3>
    <p className="text-muted-foreground type-body mt-3 text-center leading-relaxed">
      {body}
    </p>
  </div>
);
