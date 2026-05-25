import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import { CreateHeader } from "@/features/layout/CreateHeader/CreateHeader";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.accountType === "pro" && !user.planTier) {
    redirect(`${appRoutes.auth.plans}?as=pro`);
  }

  if (user?.accountType === "couple") {
    const existing = await eventsApi.list({ limit: 1 }).catch(() => null);
    const event = existing?.items[0];
    if (event && event.kind !== "empty") {
      redirect(appRoutes.app.root);
    }
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <CreateHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
