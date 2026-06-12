"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { useRouter } from "@/i18n/navigation";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import { authClient } from "@/lib/auth/client";
import { appRoutes } from "@/lib/routes";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { CloseAccountModal } from "./CloseAccountModal";

type ProfileCloseAccountProps = {
  email: string;
};

export const ProfileCloseAccount = ({ email }: ProfileCloseAccountProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setPending(true);
    setError(null);
    try {
      await profileClient.deleteAccount();
      await authClient.signOut();
      setShowModal(false);
      router.replace(appRoutes.auth.signIn);
    } catch (e) {
      setError(
        ApiError.isApiError(e)
          ? e.message
          : t("settings__danger__close_account_error"),
      );
      setPending(false);
    }
  };

  return (
    <>
      <div className="mt-11">
        <SettingsSectionTitle
          title={t("settings__danger__account_section")}
          description={t("settings__danger__subtitle")}
        />
        {error && (
          <p className="type-body-small text-destructive mt-3" role="alert">
            {error}
          </p>
        )}
        <SettingsCard>
          <SettingsRow
            title={t("settings__danger__close_account_title")}
            description={t("settings__danger__close_account_description", {
              email,
            })}
            warn
            last
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              disabled={pending}
              className="ring-destructive text-destructive hover:bg-destructive rounded-full hover:text-white"
            >
              {pending
                ? t("settings__danger__close_account_pending")
                : t("settings__danger__close_account_action")}
            </Button>
          </SettingsRow>
        </SettingsCard>
      </div>

      {showModal && (
        <CloseAccountModal
          email={email}
          pending={pending}
          onConfirm={handleDeleteAccount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
