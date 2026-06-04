import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { PlansPage } from "@/features/plans/PlansPage";
import { SignUpPlansPage } from "@/features/plans/SignUpPlansPage";
import { PlansSkeleton } from "@/features/plans/skeletons/PlansSkeleton";

type Props = { searchParams: Promise<Record<string, string>> };

export default async function PlansRoute({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (user) return <PlansPage searchParams={searchParams} />;
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<PlansSkeleton />}>
        <SignUpPlansPage />
      </Suspense>
    </div>
  );
}
