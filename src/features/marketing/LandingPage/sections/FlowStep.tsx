import Image from "next/image";

type FlowStepProps = {
  index: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export const FlowStep = ({
  index,
  imageSrc,
  imageAlt,
  title,
  description,
}: FlowStepProps) => (
  <div className="flex flex-col gap-3.5">
    <div className="rounded-14 bg-warm-panel/40 relative aspect-4/3 overflow-hidden shadow-md">
      <div className="text-foreground bg-warm-cream/95 landing-h4 absolute top-3 left-3 z-10 flex size-7.5 items-center justify-center rounded-full tabular-nums backdrop-blur-sm">
        <span className="leading-none">{index}</span>
      </div>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1220px) 22vw, (min-width: 740px) 45vw, 90vw"
        className="object-cover"
      />
    </div>
    <div>
      <h4 className="landing-h4 text-foreground">{title}</h4>
      <p className="landing-body text-muted-foreground mt-1.5">{description}</p>
    </div>
  </div>
);
