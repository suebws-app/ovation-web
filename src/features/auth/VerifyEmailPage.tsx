import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { MailIcon } from "@ovation/icons/MailIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { AuthPageShell } from "./components/AuthPageShell";
import { VerifyEmailRedirect } from "./VerifyEmailRedirect";

export const VerifyEmailPage = async () => {
  const t = await getTranslations();
  return (
    <AuthPageShell centered>
      <VerifyEmailRedirect />
      <div className="rounded-20 bg-primary/10 mb-6 inline-flex size-18 items-center justify-center">
        <MailIcon width={30} height={30} className="text-primary" strokeWidth={1.75} />
      </div>
      <Kicker className="text-primary">{t("auth__verify__page_eyebrow")}</Kicker>
      <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
        {t("auth__verify__page_missing_title")}
      </h1>
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-105 leading-relaxed">
        {t("auth__verify__page_missing_body")}
      </p>
      <Button asChild className="mt-9 rounded-full">
        <Link href={appRoutes.auth.signIn}>{t("auth__verify__back_to_signin")}</Link>
      </Button>
    </AuthPageShell>
  );
};
