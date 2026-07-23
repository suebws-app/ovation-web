import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { seoApi, type SeoTrafficSummary } from "@/lib/api/seo";
import { SeoStatTile } from "./SeoStatTile";

const fetchSummary = async (): Promise<SeoTrafficSummary | null> => {
  try {
    return await seoApi.trafficSummary();
  } catch {
    return null;
  }
};

export const SeoDashboardPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const summary = await fetchSummary();

  return (
    <section className="section-container-small">
      <header className="mb-8">
        <h1 className="landing-h2 text-foreground">SEO overview</h1>
        <p className="text-muted-foreground type-body-small mt-2">
          {summary?.lastSyncedAt
            ? `Last GSC sync: ${new Date(summary.lastSyncedAt).toLocaleString(locale)}`
            : "No GSC sync recorded"}
        </p>
      </header>

      {summary ? (
        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-6">
          <SeoStatTile
            label="Clicks (last 28 days)"
            value={summary.totalClicks.toLocaleString()}
          />
          <SeoStatTile
            label="Impressions (last 28 days)"
            value={summary.totalImpressions.toLocaleString()}
          />
          <SeoStatTile
            label="Average position"
            value={summary.averagePosition.toFixed(1)}
          />
        </div>
      ) : (
        <p className="text-muted-foreground type-body">
          GSC summary unavailable. Verify the nightly sync is running.
        </p>
      )}
    </section>
  );
};
