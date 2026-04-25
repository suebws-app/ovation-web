"use client";

import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { PlanCard } from "../components/PlanCard";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";

const PLANS = [
  {
    id: "essential",
    name: "Essential",
    price: "\u20AC0",
    per: "free, forever",
    description: "Up to 40 guests. All core features.",
    features: ["Unlimited messages", "Auto-transcription", "Lifetime storage"],
  },
  {
    id: "keepsake",
    name: "Keepsake",
    price: "\u20AC189",
    per: "one-time",
    description: "Up to 250 guests. Letterpress cards, custom domain.",
    features: [
      "Everything in Essential",
      "Letterpress QR deck (shipped)",
      "Custom domain",
      "Planner co-pilot seat",
    ],
    highlighted: true,
  },
  {
    id: "gold",
    name: "Gold Book",
    price: "\u20AC389",
    per: "one-time",
    description: "Keepsake + the 180-page linen-bound book.",
    features: [
      "Everything in Keepsake",
      "The Gold Book (printed)",
      "Priority support",
      "Early access to new features",
    ],
  },
];

export const ChoosePlanStep = () => {
  const { updateFormData } = useSignUpStore();
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    updateFormData({ selectedPlan: planId });
    router.push("/sign-up/step/7");
  };

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-[1240px] px-14 py-14">
        <div className="mb-10 text-center">
          <Eyebrow className="text-primary">
            Step 6 &middot; Choose a plan
          </Eyebrow>
          <h1 className="mt-3.5 font-serif text-[3.25rem] leading-tight font-semibold tracking-tight">
            One book, <span className="text-primary italic">three ways.</span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-[560px] leading-relaxed">
            Start free. Upgrade anytime — even after the wedding. Messages are
            yours either way.
          </p>
        </div>

        <div className="tablet:grid-cols-3 grid gap-4.5">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              per={plan.per}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
              onSelect={() => handleSelectPlan(plan.id)}
            />
          ))}
        </div>

        <div className="type-body-small text-muted-foreground mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              updateFormData({ selectedPlan: "essential" });
              router.push("/sign-up/step/7");
            }}
            className="text-primary cursor-pointer font-semibold"
          >
            Skip for now &rarr;
          </button>
          <span className="mx-3 opacity-30">&middot;</span>
          You can upgrade at any time from your dashboard
        </div>
      </div>
    </div>
  );
};
