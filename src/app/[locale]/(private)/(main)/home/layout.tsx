import { BackNavigationGuard } from "@/components/BackNavigationGuard";
import { appRoutes } from "@/lib/routes";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackNavigationGuard redirectTo={appRoutes.app.root} />
      {children}
    </>
  );
}
