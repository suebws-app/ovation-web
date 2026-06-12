import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { MailIcon } from "@ovation/icons/MailIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { AuthScreen } from "./components/AuthScreen";
import { AuthHeading } from "./components/AuthHeading";
import { VerifyEmailRedirect } from "./VerifyEmailRedirect";

export const VerifyEmailPage = async () => {
  const t = await getTranslations();
  return (
    <AuthScreen centered>
      <VerifyEmailRedirect />
      <div className="rounded-20 bg-primary/10 mb-6 inline-flex size-18 items-center justify-center">
        <MailIcon
          width={30}
          height={30}
          className="text-primary"
          strokeWidth={1.75}
        />
      </div>
      <AuthHeading
        eyebrow={t("auth__verify__page_eyebrow")}
        title={t("auth__verify__page_missing_title")}
        subtitle={t("auth__verify__page_missing_body")}
      />
      <Button asChild className="mt-9 rounded-full">
        <Link href={appRoutes.auth.signIn}>
          {t("auth__verify__back_to_signin")}
        </Link>
      </Button>
    </AuthScreen>
  );
};
