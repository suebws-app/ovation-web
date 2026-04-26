import { Check } from "@ovation/icons/Check";

export const CoverSelectedBadge = () => (
  <div className="bg-primary absolute top-2 right-2 flex size-6 items-center justify-center rounded-full shadow-md">
    <Check
      width={13}
      height={13}
      className="text-primary-foreground"
      strokeWidth={3}
    />
  </div>
);
