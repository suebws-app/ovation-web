export default function KioskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Fullscreen, no nav, no scroll, no chrome */}
      {/* TODO: Wake lock, exit via three-finger tap + PIN */}
      {children}
    </div>
  );
}
