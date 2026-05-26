import { cookies } from "next/headers";
import { SignInFlow } from "@/features/auth/SignIn/SignInFlow";
import { BackNavigationGuard } from "@/components/BackNavigationGuard";
import { appRoutes } from "@/lib/routes";

export const SignInPage = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("ovation_signin_fails")?.value;
  const initialFailCount = raw && /^\d+$/.test(raw) ? Number(raw) : 0;
  return (
    <>
      <BackNavigationGuard redirectTo={appRoutes.auth.signIn} />
      <SignInFlow step="form" initialFailCount={initialFailCount} />
    </>
  );
};
