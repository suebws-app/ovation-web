import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";

type UnlockState = "idle" | "loading" | "error";

type UnlockSectionProps = {
  state: UnlockState;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const UnlockSection = ({ state, onSubmit }: UnlockSectionProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-3">
    <Input
      type="password"
      name="password"
      placeholder="Preview password"
      autoComplete="current-password"
      required
      disabled={state === "loading"}
    />
    {state === "error" && (
      <p className="type-caption text-danger px-1">
        Incorrect password — please try again.
      </p>
    )}
    <Button
      type="submit"
      variant="outline"
      disabled={state === "loading"}
      className="w-full"
    >
      {state === "loading" ? "Verifying…" : "Access preview"}
    </Button>
  </form>
);
