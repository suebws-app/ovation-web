import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { PrivateLayout } from "@/features/layout/PrivateLayout/PrivateLayout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <PrivateLayout>{children}</PrivateLayout>;
}
