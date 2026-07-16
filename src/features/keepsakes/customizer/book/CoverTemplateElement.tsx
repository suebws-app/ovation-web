import type { CoverElement, CoverTextSource } from "@/lib/api/types";

const COVER_FONT =
  "var(--font-cormorant), 'Cormorant Garamond', 'Times New Roman', serif";
const SCRIPT_FONT = "var(--font-snell), 'Snell Roundhand', cursive";

export type CoverTexts = Partial<Record<string, string>>;

const resolveText = (source: CoverTextSource, texts: CoverTexts): string => {
  if (typeof source === "object") return source.static;
  return texts[source] ?? "";
};

// MUST match the backend (ovation-api media-preprocessor `fitFontSize`) exactly
// so the live preview and the rendered PDF size cover text identically.
const FIT_REF_CHARS = 24;
const FIT_MIN_SCALE = 0.5;
const fitFontSize = (baseSize: number, text: string): number => {
  const len = text.trim().length;
  if (len <= FIT_REF_CHARS) return baseSize;
  return baseSize * Math.max(FIT_MIN_SCALE, FIT_REF_CHARS / len);
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

  const textValue = resolveText(element.source, texts);

  return (
    <div
      style={{
        ...box,
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: element.align ?? "center",
        color: textColorOverride || element.color,
        fontFamily: element.font === "script" ? SCRIPT_FONT : COVER_FONT,
        fontWeight: element.weight ?? 400,
        fontStyle: element.italic ? "italic" : "normal",
        fontSize: `${fitFontSize(element.size, textValue)}cqh`,
        letterSpacing: element.letterSpacing
          ? `${element.letterSpacing}em`
          : undefined,
        textTransform: element.transform ?? "none",
        lineHeight: 1.15,
      }}
    >
      {textValue}
    </div>
  );
};
