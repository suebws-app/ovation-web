import { ThemeToggle } from "@ovation/ui/components/ThemeToggle"

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <header className="border-b border-border">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-lg font-bold text-foreground">Ovation</div>
          <div className="flex items-center gap-4" />
          <ThemeToggle/>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          Footer
        </div>
      </footer>
    </>
  )
}

export default MarketingLayout
