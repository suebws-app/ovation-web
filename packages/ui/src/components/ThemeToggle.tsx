'use client'

import { useEffect, useState } from 'react'
import { Sun } from '@ovation/icons/Sun'
import { Moon } from '@ovation/icons/Moon'
import { Monitor } from '@ovation/icons/Monitor'
import { useThemeStore } from '../utils/useThemeStore'
import { cn } from '../utils/cn'

export const ThemeToggle = ({ className }: { className?: string }) => {
  const theme = useThemeStore((s) => s.theme)
  const cycleTheme = useThemeStore((s) => s.cycleTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition',
          className,
        )}
        aria-label="Toggle theme"
      >
        <span className="size-5" />
      </button>
    )
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition',
        className,
      )}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === 'light' && <Sun className="size-5" />}
      {theme === 'dark' && <Moon className="size-5" />}
      {theme === 'system' && <Monitor className="size-5" />}
    </button>
  )
}
