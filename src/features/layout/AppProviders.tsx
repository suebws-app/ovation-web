'use client'

import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Future: ThemeProvider, ErrorBoundary, Toaster */}
      {children}
    </>
  )
}
