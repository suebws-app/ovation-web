import type { GscKeywordRow } from "@/lib/api/seo";

interface SeoKeywordRowProps {
  row: GscKeywordRow;
}

export const SeoKeywordRow = ({ row }: SeoKeywordRowProps) => (
  <tr className="border-border border-b">
    <td className="type-body py-3 pr-4">{row.keyword}</td>
    <td className="type-body-small text-muted-foreground py-3 pr-4">
      <a href={row.page} target="_blank" rel="noreferrer" className="underline">
        {row.page}
      </a>
    </td>
    <td className="type-body-small py-3 pr-4 text-right tabular-nums">
      {row.position.toFixed(1)}
    </td>
    <td className="type-body-small py-3 pr-4 text-right tabular-nums">
      {row.impressions.toLocaleString()}
    </td>
    <td className="type-body-small py-3 text-right tabular-nums">
      {row.clicks.toLocaleString()}
    </td>
  </tr>
);
