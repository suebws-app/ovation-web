export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="border-b border-border">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* TODO: Logo */}
          <div className="text-lg font-bold text-foreground">Ovation</div>
          {/* TODO: Nav links, Sign in/up buttons, language picker */}
          <div className="flex items-center gap-4" />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* TODO: Footer links, language picker */}
        </div>
      </footer>
    </>
  )
}
