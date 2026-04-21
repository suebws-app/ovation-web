export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Event-themed header (if set) */}
      {/* TODO: Language picker */}
      <main className="flex-1">{children}</main>
      {/* No footer — minimal guest experience */}
    </>
  );
}
