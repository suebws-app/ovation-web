import { getTranslations } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { AuthSplitLayout } from "../../components/AuthSplitLayout";
import { ChecklistItem } from "../components/ChecklistItem";
import { CreateAccountForm } from "./CreateAccountForm";

const CreateAccountPanel = async () => {
  const t = await getTranslations();
  const setupSteps = [
    t("auth__signup__brand_step__create_account"),
    t("auth__signup__brand_step__name_book"),
    t("auth__signup__brand_step__cover_link"),
    t("auth__signup__brand_step__choose_plan"),
  ];
  return (
    <>
      <Kicker className="relative tracking-[2.5px] opacity-80">
        {t("auth__signup__brand_eyebrow")}
      </Kicker>
      <p className="relative font-serif text-5xl leading-tight font-medium tracking-tight">
        {t("auth__signup__brand_intro")}
      </p>
      <div className="relative flex flex-col gap-3.5">
        {setupSteps.map((label, i) => (
          <ChecklistItem key={label} index={i + 1} label={label} active={i === 0} />
        ))}
      </div>
    </>
  );
};

export const CreateAccountStep = () => (
  <AuthSplitLayout panel={<CreateAccountPanel />}>
    <CreateAccountForm />
  </AuthSplitLayout>
);
