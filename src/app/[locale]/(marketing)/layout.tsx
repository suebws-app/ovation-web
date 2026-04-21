export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: MarketingNav — Logo, Sign in/up */}
      <main className="flex-1">{children}</main>
      {/* TODO: MarketingFooter — Links, language picker */}
    </>
  );
}
