---
name: tailwind-design-system
description: Use this skill when working with Tailwind CSS v4 — CSS-based @theme config, CSS variables for design tokens, dark mode, cn() utility, and cva components
type: skill
---

# Tailwind CSS v4 Design System

## When to Use
- Adding or modifying design tokens (colors, typography, spacing)
- Implementing dark mode with CSS variables
- Building variant-based components with cva
- Setting up the `cn()` utility for class merging

## Core Principles
- **Tailwind v4 uses CSS, not JS** — no `tailwind.config.ts`, theme defined via `@theme inline` in CSS
- **CSS variables** define all design tokens in `:root` (and `.dark` for dark mode)
- **`@theme inline`** maps CSS variables to Tailwind utility classes
- `cn()` wraps `clsx` + `tailwind-merge` — always use it, never raw className concatenation
- Components use `cva` for variant-driven styling

## Tailwind v4 Config

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  /* Brand tokens */
  --primary: #779FEB;
  --secondary: #82E19D;
  --accent: #EDB974;
  --destructive: #EC8662;
  --danger: #E55353;
  --charcoal: #2D2D2D;
  --off-white: #F9F7F4;

  /* Semantic tokens */
  --background: var(--off-white);
  --foreground: var(--charcoal);
  --muted: #F5F5F7;
  --muted-foreground: #6B7280;
  --border: #E5E7EB;
  --ring: var(--primary);
}

/* Dark mode — add when implementing theme toggle (not yet in project) */
.dark {
  --background: #0F0F23;
  --foreground: #F1F1F3;
  --muted: #1A1A2E;
  --muted-foreground: #9CA3AF;
  --border: #2D2D44;
  --ring: #6B9AFF;
  --primary: #6B9AFF;
  --secondary: #4ADE80;
  --accent: #FBBF24;
  --destructive: #F87171;
  --danger: #F87171;
}

/* Map CSS variables → Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-danger: var(--danger);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
}
```

```mjs
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**No `tailwind.config.ts` needed.** Tailwind v4 reads `@theme` directives from CSS directly.

## cn() Utility

**Not yet installed.** Run first:
```bash
pnpm add clsx tailwind-merge
```

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Button with cva

```typescript
// src/features/ui/Button.tsx
'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-charcoal hover:bg-secondary/90',
        ghost: 'hover:bg-muted text-foreground',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        outline: 'border border-border bg-background text-foreground hover:bg-muted',
      },
      size: {
        default: 'h-10 gap-2 px-4 text-sm',
        lg: 'h-12 gap-2 px-6 text-base',
        sm: 'h-8 gap-1 px-3 text-xs',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
export { buttonVariants }
```

## CSS Class Patterns

```
/* Layout */        flex flex-col items-center justify-center gap-4
/* Colors */        bg-background text-foreground bg-primary text-white
/* Dark mode */     Automatic via CSS variables — no dark: prefix for themed colors
/* States */        hover:bg-primary/90 focus:ring-2 focus:ring-ring disabled:opacity-50
/* Border */        rounded-lg border border-border
/* Responsive */    sm:px-4 md:px-8 lg:px-0
```

## Conventions
- Always use `cn()` — never concatenate class strings manually
- Semantic color names (`primary`, `foreground`) not raw hex in classes
- Dark mode via CSS variables — `dark:` prefix only needed for non-themed values
- `cva` for any component with 2+ visual variants
- `@theme inline` for all Tailwind-consumed tokens
- Standard Tailwind v4 breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

## Anti-patterns
- Never create a `tailwind.config.ts` — Tailwind v4 uses CSS-based config
- Never use raw hex/rgb values in className — use theme tokens
- Never use `dark:` prefix for colors defined as CSS variables
- Never create component variants with conditional ternaries — use `cva`
- Never mix styled-components/Emotion with Tailwind
