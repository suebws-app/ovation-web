import { Suspense } from "react";
import { CreatePage } from "@/features/create/CreatePage";

const Page = () => (
  <Suspense>
    <CreatePage />
  </Suspense>
);

export default Page;
