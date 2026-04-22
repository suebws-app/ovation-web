const KioskLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Fullscreen, no nav, no scroll, no chrome */}
      {/* TODO: Wake lock, exit via three-finger tap + PIN */}
      {children}
    </div>
  )
}

export default KioskLayout
