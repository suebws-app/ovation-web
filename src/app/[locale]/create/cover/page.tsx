import { Suspense } from "react";
import { CoverPage } from "@/features/create/cover/CoverPage";

const Page = () => (
  <Suspense fallback={null}>
    <CoverPage />
  </Suspense>
);

export default Page;
