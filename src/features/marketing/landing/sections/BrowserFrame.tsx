import Image from "next/image";

type BrowserFrameProps = {
  url: string;
  imageSrc: string;
  imageAlt: string;
};

export const BrowserFrame = ({
  url,
  imageSrc,
  imageAlt,
}: BrowserFrameProps) => (
  <div className="border-border bg-card rounded-16 mx-auto w-full max-w-140 overflow-hidden border shadow-lg">
    <div className="bg-warm-cream border-border flex h-10 items-center gap-2 border-b px-4">
      <span className="bg-primary size-3 rounded-full" />
      <span className="bg-accent size-3 rounded-full" />
      <span className="bg-secondary size-3 rounded-full" />
      <span className="border-border bg-card ml-3 flex h-6 max-w-70 flex-1 items-center gap-1.5 rounded-full border px-3.5">
        <span className="text-muted-foreground type-caption font-mono">
          {url}
        </span>
      </span>
    </div>
    <div className="bg-warm-panel/40 relative h-90">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 740px) 40vw, 90vw"
        className="object-cover object-top"
      />
    </div>
  </div>
);
