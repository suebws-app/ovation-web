import { CheckIcon } from "@ovation/icons/CheckIcon";

type UpgradeFeatureRowProps = {
  label: string;
};

export const UpgradeFeatureRow = ({ label }: UpgradeFeatureRowProps) => (
  <li className="flex items-center gap-3">
    <span className="bg-primary/15 text-primary inline-flex size-6 shrink-0 items-center justify-center rounded-full">
      <CheckIcon width={13} height={13} />
    </span>
    <span className="type-body-small">{label}</span>
  </li>
);
