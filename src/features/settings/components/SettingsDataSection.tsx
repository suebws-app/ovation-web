"use client";

import { Button } from "@ovation/ui/components/Button";
import { Badge } from "@ovation/ui/components/Badge";
import { Box } from "@ovation/icons/Box";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { ExportHeroCard } from "./ExportHeroCard";
import { PastExportRow } from "./PastExportRow";

const INDIVIDUAL_EXPORTS = [
  {
    title: "All audio (original quality)",
    description: "142 files \u00b7 MP3 + WAV original \u00b7 1.8 GB",
  },
  {
    title: "All transcripts",
    description: "As .txt, .docx, or structured JSON",
  },
  {
    title: "All photos",
    description: "63 photos \u00b7 original resolution \u00b7 EXIF intact",
  },
  {
    title: "Book layout as PDF",
    description: "Your current Gold Book draft \u00b7 print-ready 300 dpi",
  },
  {
    title: "Guest list",
    description: "88 guests \u00b7 CSV with contact info + contribution status",
  },
];

const PAST_EXPORTS = [
  {
    date: "Oct 12, 2025",
    title: "Full archive",
    size: "2.1 GB",
    status: "ready" as const,
  },
  {
    date: "Sep 28, 2025",
    title: "Audio only",
    size: "1.8 GB",
    status: "expired" as const,
  },
  {
    date: "Sep 14, 2025",
    title: "Transcripts only",
    size: "3.2 MB",
    status: "ready" as const,
  },
];

export const SettingsDataSection = () => {
  return (
    <>
      <span className="type-overline text-primary">Settings</span>
      <h1 className="type-display mt-2 font-serif tracking-tight">
        Data &amp; <span className="text-primary italic">export</span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        Your messages belong to you. Download everything anytime &mdash; audio,
        transcripts, photos, metadata.
      </p>

      <ExportHeroCard />

      <div className="mt-9">
        <SettingsSectionTitle title="Export individual pieces" />
        <SettingsCard>
          {INDIVIDUAL_EXPORTS.map((exp, i) => (
            <SettingsRow
              key={exp.title}
              title={exp.title}
              description={exp.description}
              last={i === INDIVIDUAL_EXPORTS.length - 1}
            >
              <Button variant="outline" size="sm" className="rounded-full">
                <Box width={13} height={13} />
                Download
              </Button>
            </SettingsRow>
          ))}
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title="Past exports" />
        <SettingsCard>
          {PAST_EXPORTS.map((exp, i) => (
            <PastExportRow
              key={`${exp.date}-${exp.title}`}
              {...exp}
              last={i === PAST_EXPORTS.length - 1}
            />
          ))}
        </SettingsCard>
        <p className="type-caption text-muted-foreground mt-2.5">
          Download links expire after 7 days for your security.
        </p>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle
          title="Data rights"
          description="Under GDPR & CCPA. For requests on behalf of a deceased partner, contact support."
        />
        <SettingsCard>
          <SettingsRow
            title="Request a human-readable data report"
            description="A PDF summary of everything we know about you and your book. Takes up to 72 hours."
          >
            <Button variant="outline" size="sm" className="rounded-full">
              Request
            </Button>
          </SettingsRow>
          <SettingsRow
            title="Ask us to stop using your data for service improvement"
            description="We use anonymized patterns to tune transcription and layout. Opt out any time."
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>
    </>
  );
};
