import { LogoHeader } from "@/components/LogoHeader";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <LogoHeader />
      <main className="mx-auto flex w-full max-w-160 flex-1 flex-col justify-center gap-6 px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default CheckoutLayout;
