import { RootHeader } from '@/features/layout/RootHeader'
import { RootFooter } from '@/features/layout/RootFooter'

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </>
  )
}

export default MarketingLayout
