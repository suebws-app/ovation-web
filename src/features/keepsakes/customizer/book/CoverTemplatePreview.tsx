import { CoverTemplateElement, type CoverTexts } from "./CoverTemplateElement";
import type { CoverLayout, CoverTemplate } from "@/lib/api/types";

type CoverTemplatePreviewProps = {
  template: CoverTemplate;
  pageAspect?: number;
  texts?: CoverTexts;
  slotThumbs?: Record<string, string | undefined>;
  coverBgColor?: string;
  textColorOverrides?: Record<string, string>;
  className?: string;
};

export const pickLayout = (
  layouts: CoverLayout[],
  pageAspect?: number,
): CoverLayout | undefined => {
  if (layouts.length === 0) return undefined;
  if (pageAspect === undefined) return layouts[0];
  return layouts.reduce((best, l) =>
    Math.abs(l.aspect - pageAspect) < Math.abs(best.aspect - pageAspect)
      ? l
      : best,
  );
};

export const CoverTemplatePreview = ({
  template,
  pageAspect,
  texts = {},
  slotThumbs = {},
  coverBgColor,
  textColorOverrides = {},
  className,
}: CoverTemplatePreviewProps) => {
  const layout = pickLayout(template.layouts, pageAspect);
  if (!layout) return null;

  const pageColor =
    coverBgColor || layout.pageColor || layout.color || "#ffffff";
  const pageAspectRatio = pageAspect ?? layout.aspect;
  const cardFillsHeight = pageAspectRatio >= layout.aspect;

  return (
    <div
      className={`rounded-8 relative w-full overflow-hidden ${className ?? ""}`}
      style={{
        aspectRatio: String(pageAspectRatio),
        backgroundColor: pageColor,
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{
          aspectRatio: String(layout.aspect),
          width: cardFillsHeight ? "auto" : "100%",
          height: cardFillsHeight ? "100%" : "auto",
          containerType: "size",
        }}
      >
        {layout.art && (
          <img
            src={`/cover-art/${layout.art}`}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: "cover" }}
          />
        )}
        {layout.elements.map((element) => (
          <CoverTemplateElement
            key={element.id}
            element={element}
            texts={texts}
            thumbUrl={
              element.type === "image" ? slotThumbs[element.id] : undefined
            }
            textColorOverride={
              element.type === "text"
                ? textColorOverrides[element.id]
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
