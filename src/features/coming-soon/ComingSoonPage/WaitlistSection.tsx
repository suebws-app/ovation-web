import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";

type WaitlistState = "idle" | "loading" | "success" | "error";

type WaitlistSectionProps = {
  state: WaitlistState;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const WaitlistSuccess = () => (
  <div className="flex flex-col items-center gap-3 py-2 text-center">
    <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
      <CheckIcon width={20} height={20} className="text-primary-foreground" />
    </div>
    <div>
      <p className="type-body font-semibold text-foreground">
        You&rsquo;re on the list!
      </p>
      <p className="type-body-small text-muted-foreground mt-1">
        We&rsquo;ll email you when we launch.
      </p>
    </div>
  </div>
);

export const WaitlistSection = ({ state, onSubmit }: WaitlistSectionProps) => {
  if (state === "success") {
    return <WaitlistSuccess />;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        required
        disabled={state === "loading"}
      />
      {state === "error" && (
        <p className="type-caption text-danger px-1">
          Something went wrong — please try again.
        </p>
      )}
      <Button type="submit" disabled={state === "loading"} className="w-full">
        {state === "loading" ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
};
