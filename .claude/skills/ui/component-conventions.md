---
name: component-conventions
description: Use this skill when creating React components — file structure, naming, server/client split, props typing, and co-location patterns
type: skill
---

# Component Conventions

## When to Use
- Creating any new React component
- Deciding server vs client component
- Organizing component files

## Core Principles
- **Always use arrow functions** for components — `export const MyComponent = () => {}`, never `function MyComponent() {}`
- Components are **server** (default) or **client** (`'use client'`)
- **UI primitives** live in `packages/ui/` — shadcn/ui pattern (Radix + cva + cn)
- **Feature components** in `src/features/<feature>/`
- Shared hooks in `src/lib/hooks/`
- **NEVER use raw Tailwind colors** (`text-zinc-50`, `bg-slate-900`) — always theme tokens
- Import UI: `import { Button } from '@ovation/ui/components/Button'`

## Component File Structure

```typescript
'use client' // Only if using hooks, state, or browser APIs

// 1. External imports
import { useState } from 'react'
import { useTranslations } from 'next-intl'

// 2. Package imports
import { Button } from '@ovation/ui/components/Button'
import { cn } from '@ovation/ui/utils/cn'

// 3. Relative imports
import type { CardProps } from './types'

// 4. Component — always arrow function
export const FeatureCard = ({ title, className }: CardProps) => {
  const t = useTranslations()
  return (
    <div className={cn('rounded-lg bg-background p-6', className)}>
      <h3>{title}</h3>
    </div>
  )
}
```

## Server vs Client Decision

| Component... | → |
|---|---|
| Fetches data (async)? | Server |
| Renders static content? | Server |
| Uses useState/useEffect? | Client |
| Uses event handlers? | Client |
| Uses useTranslations()? | Client |
| Uses browser APIs? | Client |

## File Organization

```
packages/ui/                    # @ovation/ui — shared UI package
├── src/
│   ├── components/             # shadcn/ui-style components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Dialog.tsx
│   └── utils/
│       └── cn.ts               # clsx + tailwind-merge
└── package.json

src/features/                   # App feature modules
├── auth/
│   ├── LoginForm.tsx
│   ├── loginSchema.ts
│   └── useLogin.ts
├── layout/
│   ├── AppProviders.tsx
│   ├── Sidebar.tsx
│   └── ThemeScript.tsx
└── domain/
    └── types.ts

src/lib/                        # Shared app utilities
├── hooks/
│   ├── useMediaQuery.ts
│   └── useDebounce.ts
└── utils/
    └── env.ts
```

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `LoginForm.tsx` |
| Hooks | camelCase with `use` | `useLogin.ts` |
| Types | PascalCase | `EventPayload` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| Utilities | camelCase | `formatDate.ts` |

## Props Patterns

```typescript
// Inline for simple components
function Card({ title, className }: { title: string; className?: string }) {}

// Always accept className for styling flexibility
// Use ComponentProps for extending HTML elements
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'secondary'
}
```

## Export Patterns

- **UI components**: individual file exports via package (`import { Button } from '@ovation/ui/components/Button'`), no barrel
- **Feature modules**: use an `index.ts` barrel for the public API of each feature
- **Hooks/utils**: individual file exports (`import { useDebounce } from '@/lib/hooks/useDebounce'`)

Barrel exports are fine when a feature has a small, stable public API. Avoid barrels for large sets (icons, many UI components) — they break tree-shaking.

## Conventions
- Always use `cn()` for conditional classes
- Always use `Link` / `useRouter` from `@/i18n/navigation`
- `params` is `Promise<T>` — `await` in server, `use()` in client
- `className` prop on all visual components

## Anti-patterns
- **NEVER use `text-zinc-*`, `bg-slate-*`, `text-gray-*`** — use theme tokens only
- Never put `'use client'` on a component that doesn't need it
- Never use `next/link` or `next/navigation` directly — use i18n wrappers
- Never put UI primitives in `src/` — they belong in `packages/ui/`
- Never use `any` without justification
- Never create a component without deciding server vs client first
