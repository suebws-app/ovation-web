import { DashboardBackGuard } from "@/features/dashboard/components/DashboardBackGuard";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardBackGuard>{children}</DashboardBackGuard>;
};

export default AuthLayout;
