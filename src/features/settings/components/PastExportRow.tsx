import { Button } from "@ovation/ui/components/Button";
import { Badge } from "@ovation/ui/components/Badge";
import { SettingsRow } from "./SettingsRow";

type PastExportRowProps = {
  date: string;
  title: string;
  size: string;
  status: "ready" | "expired";
  last?: boolean;
};

export const PastExportRow = ({
  date,
  title,
  size,
  status,
  last,
}: PastExportRowProps) => (
  <SettingsRow
    title={
      <span className="inline-flex items-center gap-3">
        {title}
        <Badge variant={status === "ready" ? "secondary" : "outline"}>
          {status === "ready" ? "Ready" : "Expired"}
        </Badge>
      </span>
    }
    description={`${date} \u00b7 ${size}`}
    last={last}
  >
    {status === "ready" ? (
      <Button size="sm" className="rounded-full">
        Download
      </Button>
    ) : (
      <Button variant="outline" size="sm" className="rounded-full">
        Re-generate
      </Button>
    )}
  </SettingsRow>
);
