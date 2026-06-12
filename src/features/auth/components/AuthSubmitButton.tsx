import { Button } from "@ovation/ui/components/Button";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { cn } from "@ovation/ui/utils/cn";

type AuthSubmitButtonProps = {
  label: string;
  pendingLabel: string;
  pending: boolean;
  className?: string;
};

export const AuthSubmitButton = ({
  label,
  pendingLabel,
  pending,
  className,
}: AuthSubmitButtonProps) => (
  <Button
    type="submit"
    disabled={pending}
    size="lg"
    className={cn(
      "shadow-primary/40 tablet:mt-6 mt-4 w-full rounded-full shadow-md",
      className,
    )}
  >
    {pending ? pendingLabel : label}
    <ArrowRightIcon width={16} height={16} />
  </Button>
);
