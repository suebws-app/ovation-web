import { Suspense } from "react";
import { CoverPage } from "@/features/create/cover/CoverPage";
import { CoverPageSkeleton } from "@/features/create/skeletons/CoverPageSkeleton";

const Page = () => (
  <Suspense fallback={<CoverPageSkeleton />}>
    <CoverPage />
  </Suspense>
);

export default Page;
