import { redirect } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { getLocale } from "next-intl/server";

export const SignUpUrlRedirect = async () => {
  const locale = await getLocale();
  redirect({ href: appRoutes.auth.signUpCover, locale });
};
