import { Suspense } from "react";
import { CreateDetailsPage } from "@/features/create/CreateDetailsPage";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";

const Page = () => (
  <Suspense fallback={<CreatePageSkeleton />}>
    <CreateDetailsPage />
  </Suspense>
);

export default Page;
