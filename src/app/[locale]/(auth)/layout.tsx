export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      {/* TODO: Brand logo on top */}
      <div className="w-full max-w-md">{children}</div>
      {/* TODO: Support link */}
    </div>
  );
}
