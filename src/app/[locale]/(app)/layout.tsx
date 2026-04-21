export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Top bar — Event switcher, user menu, notifications */}
      {/* TODO: Desktop sidebar / Mobile bottom nav */}
      <main className="flex-1">{children}</main>
    </>
  );
}
