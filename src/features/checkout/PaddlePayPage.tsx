import { getCurrentUser } from "@/lib/auth/session";
import { PaddlePayClient } from "./PaddlePayClient";

export const PaddlePayPage = async () => {
  const user = await getCurrentUser();
  return <PaddlePayClient userEmail={user?.email ?? null} />;
};
