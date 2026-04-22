export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; eventId: string }>
}) {
  const { eventId } = await params

  // TODO: Fetch event data, validate access
  void eventId

  return (
    <>
      {/* TODO: Event context header — Couple names, countdown */}
      {/* TODO: Tab nav — Messages, Photos, Invite, Kiosk, Keepsakes, Settings */}
      <div className="flex-1">{children}</div>
    </>
  )
}
