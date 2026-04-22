'use client'

import type { ReactNode } from 'react'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* Future: ThemeProvider, ErrorBoundary, Toaster */}
      {children}
    </>
  )
}
