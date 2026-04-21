export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Event context header — Couple names, countdown */}
      {/* TODO: Tab nav — Messages, Photos, Invite, Kiosk, Keepsakes, Settings */}
      <div className="flex-1">{children}</div>
    </>
  );
}
