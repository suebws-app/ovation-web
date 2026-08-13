import { Skeleton } from "@ovation/ui/components/Skeleton";

const ROWS = Array.from({ length: 12 }, (_, i) => i);

export const SeoKeywordsSkeleton = () => (
  <section className="section-container-small">
    <header className="mb-8 flex flex-col gap-2">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-4 w-56" />
    </header>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-border border-b">
            {["Keyword", "Page", "Position", "Impressions", "Clicks"].map(
              (label, i) => (
                <th key={label} className="py-3 pr-4">
                  <Skeleton
                    className={`h-3 ${i < 2 ? "w-16" : "ml-auto w-16"}`}
                  />
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((i) => (
            <tr key={i} className="border-border border-b">
              <td className="py-3 pr-4">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="py-3 pr-4">
                <Skeleton className="h-4 w-56 max-w-full" />
              </td>
              <td className="py-3 pr-4">
                <Skeleton className="ml-auto h-4 w-10" />
              </td>
              <td className="py-3 pr-4">
                <Skeleton className="ml-auto h-4 w-16" />
              </td>
              <td className="py-3">
                <Skeleton className="ml-auto h-4 w-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
