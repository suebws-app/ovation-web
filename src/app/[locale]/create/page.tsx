import { Suspense } from "react";
import { CreatePage } from "@/features/create/CreatePage";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";

const Page = () => (
  <Suspense fallback={<CreatePageSkeleton />}>
    <CreatePage />
  </Suspense>
);

export default Page;
