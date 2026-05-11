import { RoleStep } from "./SignUp/steps/RoleStep";
import { CreateAccountStep } from "./SignUp/steps/CreateAccountStep";

type Props = { searchParams: Promise<{ as?: string }> };

export const SignUpPage = async ({ searchParams }: Props) => {
  const { as } = await searchParams;
  if (!as) return <RoleStep />;
  return <CreateAccountStep />;
};
