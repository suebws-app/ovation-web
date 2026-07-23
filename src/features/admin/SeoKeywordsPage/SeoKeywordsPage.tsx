import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { seoApi, type GscKeywordRow } from "@/lib/api/seo";
import { SeoKeywordRow } from "./SeoKeywordRow";

const fetchCandidates = async (): Promise<{
  rows: GscKeywordRow[];
  lastSyncedAt: string | null;
  error: boolean;
}> => {
  try {
    const res = await seoApi.refreshCandidates(4, 20, 100);
    return { rows: res.rows, lastSyncedAt: res.lastSyncedAt, error: false };
  } catch {
    return { rows: [], lastSyncedAt: null, error: true };
  }
};

export const SeoKeywordsPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const { rows, lastSyncedAt, error } = await fetchCandidates();

  return (
    <section className="section-container-small">
      <header className="mb-8">
        <h1 className="landing-h2 text-foreground">
          Refresh candidates (rank 4–20)
        </h1>
        <p className="text-muted-foreground type-body-small mt-2">
          {lastSyncedAt
            ? `Last GSC sync: ${new Date(lastSyncedAt).toLocaleString(locale)}`
            : "No GSC sync recorded"}
        </p>
      </header>

      {error ? (
        <p className="text-muted-foreground type-body">
          GSC data unavailable. Verify the nightly sync is running.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground type-body">
          No refresh candidates in the 4–20 rank band right now.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-border border-b">
                <th className="type-body-small text-muted-foreground py-3 pr-4 text-left font-medium">
                  Keyword
                </th>
                <th className="type-body-small text-muted-foreground py-3 pr-4 text-left font-medium">
                  Page
                </th>
                <th className="type-body-small text-muted-foreground py-3 pr-4 text-right font-medium">
                  Position
                </th>
                <th className="type-body-small text-muted-foreground py-3 pr-4 text-right font-medium">
                  Impressions
                </th>
                <th className="type-body-small text-muted-foreground py-3 text-right font-medium">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <SeoKeywordRow key={`${row.keyword}-${row.page}`} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
