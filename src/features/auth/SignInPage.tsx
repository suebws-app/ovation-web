import { cookies } from "next/headers";
import { SignInFlow } from "@/features/auth/SignIn/SignInFlow";

export const SignInPage = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("ovation_signin_fails")?.value;
  const initialFailCount = raw && /^\d+$/.test(raw) ? Number(raw) : 0;
  return <SignInFlow step="form" initialFailCount={initialFailCount} />;
};
