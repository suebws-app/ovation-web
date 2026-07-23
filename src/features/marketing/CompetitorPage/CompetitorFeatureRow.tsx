import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { XIcon } from "@ovation/icons/XIcon";
import type { CompetitorFeature, CompetitorFeatureValue } from "./competitors";

interface CompetitorFeatureRowProps {
  feature: CompetitorFeature;
  competitorName: string;
}

interface CellContentProps {
  value: CompetitorFeatureValue;
  yesLabel: string;
  noLabel: string;
  resolveText: (key: string) => string;
}

const CellContent = ({
  value,
  yesLabel,
  noLabel,
  resolveText,
}: CellContentProps) => {
  if (value === true)
    return (
      <span className="text-primary flex items-center gap-2">
        <CheckIcon className="size-5" />
        <span className="sr-only">{yesLabel}</span>
      </span>
    );
  if (value === false)
    return (
      <span className="text-muted-foreground flex items-center gap-2">
        <XIcon className="size-5" />
        <span className="sr-only">{noLabel}</span>
      </span>
    );
  return (
    <span className="text-muted-foreground type-body-small">
      {resolveText(value)}
    </span>
  );
};

export const CompetitorFeatureRow = ({
  feature,
  competitorName,
}: CompetitorFeatureRowProps) => {
  const t = useTranslations();
  const yesLabel = t("marketing__vs__cell_yes");
  const noLabel = t("marketing__vs__cell_no");
  const resolveText = (key: string) => t(key);

  return (
    <tr className="border-border border-t">
      <th
        scope="row"
        className="text-foreground type-body py-4 pr-4 text-left font-medium"
      >
        {t(feature.labelKey)}
      </th>
      <td className="py-4 pr-4">
        <CellContent
          value={feature.ovation}
          yesLabel={yesLabel}
          noLabel={noLabel}
          resolveText={resolveText}
        />
      </td>
      <td className="py-4">
        <CellContent
          value={feature.competitor}
          yesLabel={yesLabel}
          noLabel={noLabel}
          resolveText={resolveText}
        />
        <span className="sr-only"> ({competitorName})</span>
      </td>
    </tr>
  );
};
