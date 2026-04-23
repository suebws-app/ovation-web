import { DashboardHome } from '@/features/dashboard/DashboardHome'

const EventDashboardPage = async ({
  params,
}: {
  params: Promise<{ eventId: string }>
}) => {
  const { eventId } = await params
  return <DashboardHome eventId={eventId} />
}

export default EventDashboardPage
