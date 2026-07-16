import type { CoverElement, CoverTextSource } from "@/lib/api/types";

const COVER_FONT =
  "var(--font-cormorant), 'Cormorant Garamond', 'Times New Roman', serif";
const SCRIPT_FONT = "var(--font-snell), 'Snell Roundhand', cursive";

export type CoverTexts = Partial<Record<string, string>>;

const resolveText = (source: CoverTextSource, texts: CoverTexts): string => {
  if (typeof source === "object") return source.static;
  return texts[source] ?? "";
};

type CoverTemplateElementProps = {
  element: CoverElement;
  texts: CoverTexts;
  thumbUrl?: string;
  textColorOverride?: string;
};

export const CoverTemplateElement = ({
  element,
  texts,
  thumbUrl,
  textColorOverride,
}: CoverTemplateElementProps) => {
  const box: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.w}%`,
    height: `${element.h}%`,
    overflow: "hidden",
  };

  if (element.type === "image") {
    return (
      <div
        style={{
          ...box,
          borderRadius: element.radius ? `${element.radius}%` : undefined,
        }}
        className={
          thumbUrl ? "" : "bg-muted/60 border-border border border-dashed"
        }
      >
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            className="h-full w-full"
            style={{ objectFit: element.fit ?? "cover" }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        ...box,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: element.align ?? "center",
        color: textColorOverride || element.color,
        fontFamily: element.font === "script" ? SCRIPT_FONT : COVER_FONT,
        fontWeight: element.weight ?? 400,
        fontStyle: element.italic ? "italic" : "normal",
        fontSize: `${element.size}cqh`,
        letterSpacing: element.letterSpacing
          ? `${element.letterSpacing}em`
          : undefined,
        textTransform: element.transform ?? "none",
        lineHeight: 1.15,
      }}
    >
      {resolveText(element.source, texts)}
    </div>
  );
};
