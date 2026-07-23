export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = "image/png";

const BACKGROUND = "#0B0A08";
const TEXT_PRIMARY = "#F7F4EC";
const TEXT_MUTED = "#A8A196";
const ACCENT = "#C8A24A";

interface OgImageTemplateProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export const OgImageTemplate = ({
  eyebrow,
  title,
  subtitle,
}: OgImageTemplateProps) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: BACKGROUND,
      color: TEXT_PRIMARY,
      padding: "72px 80px",
      fontFamily:
        '"Inter", "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif',
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: -0.5,
        color: TEXT_PRIMARY,
      }}
    >
      <span style={{ color: ACCENT, fontSize: 40, lineHeight: 1 }}>❦</span>
      Ovation
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 1000,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 80,
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.35,
            color: TEXT_MUTED,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: TEXT_MUTED,
        fontSize: 22,
      }}
    >
      <span>ovationday.com</span>
      <span>Wedding guest book · voices, photos, notes</span>
    </div>
  </div>
);
