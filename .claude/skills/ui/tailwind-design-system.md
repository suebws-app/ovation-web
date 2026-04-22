---
name: tailwind-design-system
description: Use this skill when working with Tailwind CSS v4, shadcn/ui component patterns, the full theme token set, cn() utility, and cva components
type: skill
---

# Tailwind CSS v4 + shadcn/ui Design System

## When to Use
- Adding or modifying design tokens (colors, typography, spacing)
- Building new UI components
- Implementing dark mode
- Adding shadcn/ui components or customizing existing ones

## Core Principles
- **shadcn/ui pattern** — components use Radix UI primitives + cva + cn(), live in `packages/ui/`
- **Tailwind v4 uses CSS, not JS** — no `tailwind.config.ts`, theme defined via `@theme inline` in CSS
- **Full shadcn/ui token set** — oklch colors, radius scale, sidebar/chart tokens
- **NEVER use raw Tailwind colors** (`text-zinc-50`, `bg-slate-900`, etc.) — always use theme tokens
- `cn()` wraps `clsx` + `tailwind-merge` — always use it, never raw className concatenation

## UI Package Location

```
packages/ui/
├── package.json              # @ovation/ui — workspace package
├── tsconfig.json
└── src/
    ├── components/           # shadcn/ui-style components
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── ...
    └── utils/
        └── cn.ts             # clsx + tailwind-merge
```

Import from app code:
```typescript
import { Button } from '@ovation/ui/components/Button'
import { cn } from '@ovation/ui/utils/cn'
```

## Theme Structure (globals.css)

The CSS follows the standard shadcn/ui theme layout:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Maps CSS variables → Tailwind utility classes */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... full token set ... */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  /* ... radius scale ... */
}

:root { /* Light mode oklch values */ }
.dark { /* Dark mode oklch values */ }

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

## Complete Token Reference

### Core tokens (always available)

| Token | Tailwind class | Use for |
|-------|---------------|---------|
| `background` / `foreground` | `bg-background`, `text-foreground` | Page backgrounds, body text |
| `card` / `card-foreground` | `bg-card`, `text-card-foreground` | Card surfaces |
| `popover` / `popover-foreground` | `bg-popover`, `text-popover-foreground` | Dropdowns, popovers |
| `primary` / `primary-foreground` | `bg-primary`, `text-primary-foreground` | CTAs, links (Cornflower #779FEB) |
| `secondary` / `secondary-foreground` | `bg-secondary`, `text-secondary-foreground` | Success, positive (Jade #82E19D) |
| `accent` / `accent-foreground` | `bg-accent`, `text-accent-foreground` | Premium, special (Kernel #EDB974) |
| `muted` / `muted-foreground` | `bg-muted`, `text-muted-foreground` | Subtle backgrounds, secondary text |
| `destructive` | `bg-destructive` | Alerts, warnings (Peachy #EC8662) |
| `danger` | `bg-danger` | Delete, destructive actions (#E55353) |
| `border` | `border-border` | Borders, dividers |
| `input` | `border-input` | Input borders (slightly different from border) |
| `ring` | `ring-ring` | Focus rings |

### Sidebar tokens (for app layout)

| Token | Use for |
|-------|---------|
| `sidebar` / `sidebar-foreground` | Sidebar background and text |
| `sidebar-primary` / `sidebar-primary-foreground` | Active sidebar item |
| `sidebar-accent` / `sidebar-accent-foreground` | Hover/selected sidebar item |
| `sidebar-border` / `sidebar-ring` | Sidebar borders and focus |

### Chart tokens

`chart-1` through `chart-5` — mapped to brand colors for data visualization.

### Radius scale

`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl` etc. — all derived from `--radius: 0.625rem`.

## Adding New Tokens

Add in **three places**:
1. `@theme inline { --color-new-token: var(--new-token); }`
2. `:root { --new-token: oklch(...); }`
3. `.dark { --new-token: oklch(...); }`

## cn() Utility

```typescript
// packages/ui/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Adding New shadcn/ui Components

1. Check [ui.shadcn.com](https://ui.shadcn.com) for the component
2. Copy the component code into `packages/ui/src/components/<Component>.tsx`
3. Update imports: `cn` from `../utils/cn` (relative, not `@/`)
4. Replace `text-white` with `text-primary-foreground` etc. — use theme tokens
5. Install any missing Radix primitives: `pnpm add @radix-ui/react-<primitive>`

### Example: Adding a Dialog

```bash
pnpm add @radix-ui/react-dialog
```

```typescript
// packages/ui/src/components/Dialog.tsx
'use client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export function DialogContent({ className, children, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'rounded-lg bg-popover p-6 shadow-lg border border-border text-popover-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
```

## Installed Dependencies

| Package | Purpose |
|---------|---------|
| `tailwindcss` v4 | CSS framework |
| `@tailwindcss/postcss` | PostCSS plugin |
| `shadcn` | Base CSS (keyframes, Radix variants, scrollbar utility) |
| `class-variance-authority` | Component variants (cva) |
| `clsx` | Conditional class names |
| `tailwind-merge` | Smart class merging |
| `@radix-ui/react-slot` | Polymorphic `asChild` pattern |

## Conventions
- **NEVER use raw Tailwind colors** — no `text-zinc-50`, `bg-slate-900`, `text-gray-500`. Always use theme tokens: `text-foreground`, `bg-background`, `text-muted-foreground`
- Always use `cn()` — never concatenate class strings
- `cva` for any component with 2+ visual variants
- UI components live in `packages/ui/src/components/` — one file per component
- Components use relative imports (`../utils/cn`), not `@/` aliases
- Follow shadcn/ui component APIs for consistency
- All colors use oklch in the CSS variables
- Add `@ovation/ui` to `transpilePackages` in `next.config.ts`

## Anti-patterns
- **NEVER use `text-zinc-*`, `bg-slate-*`, `text-gray-*` or any raw color** — use theme tokens only
- Never create a `tailwind.config.ts` — Tailwind v4 uses CSS-based config
- Never hardcode hex/rgb in className — use CSS variable tokens
- Never use `dark:` prefix for colors defined as CSS variables — they switch automatically
- Never put UI components in `src/features/ui/` — they live in `packages/ui/`
- Never install shadcn CLI — copy components manually and adapt
