---
name: project-setup
description: Use this skill when setting up or understanding the Next.js 16 project structure — single-app architecture, file organization, path aliases, and build config
type: skill
---

# Project Setup (Next.js 16)

## When to Use
- Understanding the project's directory structure and conventions
- Adding new top-level directories or modules
- Configuring TypeScript, ESLint, or build settings

## Core Principles
- **Single-app architecture** — no monorepo, no packages/ directory
- `src/` contains all application code
- Features are self-contained modules in `src/features/`
- Shared utilities live in `src/lib/`
- **Turbopack is the default** bundler in Next.js 16

## Project Structure

```
<PROJECT_ROOT>/
├── src/
│   ���── app/                    # App Router routes
│   │   ├── layout.tsx          # Root layout (metadata, globals.css)
│   │   ├── globals.css         # Tailwind v4 + CSS variables
│   │   └── [locale]/           # Locale-wrapped routes
│   │       ├── layout.tsx      # Locale layout (html, body, providers)
│   │       ├── (marketing)/    # Public pages
│   │       ├── (auth)/         # Auth pages
│   │       ├── (app)/          # Protected app
│   │       ├── g/              # Guest submission
│   │       ├── checkout/       # Purchase flow
│   │       └── kiosk/          # Fullscreen kiosk
│   │
│   ├── features/               # Feature modules (self-contained)
│   │   ├── ui/                 # Shared UI components
│   │   ├── layout/             # Layout components
│   │   ├── marketing/          # Marketing page components
│   │   └── domain/             # Domain types and logic
│   │
│   ├── lib/                    # Shared utilities and services
│   │   ├── api/                # API client, service modules
│   │   ├── auth/               # Auth helpers, session
│   │   ├── hooks/              # Shared React hooks
│   │   ├── utils/              # Pure utility functions (cn, etc.)
│   │   ├── kiosk/              # Kiosk-specific logic
│   │   └── media/              # Media handling (audio/photo)
��   │
│   ├── i18n/                   # Internationalization config
│   │   ├── config.ts           # Locales, currencies, BCP 47 tags
│   │   ├── routing.ts          # defineRouting
│   │   ├── navigation.ts       # createNavigation exports
│   │   ├── request.ts          # Message loading
│   │   └── currency.ts         # CLDR currency formatting
│   │
│   ├── styles/                 # Additional stylesheets
│   └── proxy.ts                # Next.js 16 proxy (replaces middleware)
│
├── messages/                   # i18n JSON translation files
│   ├── en.json                 # English (source of truth)
│   ├── fr.json, de.json, ...   # Other locales
│
├── public/                     # Static assets
├── next.config.ts              # Next.js config + next-intl plugin
├── postcss.config.mjs          # Tailwind v4 PostCSS plugin
├── eslint.config.mjs           # ESLint flat config
├── tsconfig.json               # TypeScript config
└── package.json
```

## What Goes Where

| Location | Contains | Rule |
|----------|----------|------|
| `src/app/` | Route files only | Thin shells that import from features |
| `src/features/` | Feature modules | Components, stores, types, schemas per feature |
| `src/lib/` | Shared code | API client, auth, hooks, utilities |
| `src/i18n/` | i18n config | Routing, navigation, translations, currency |
| `messages/` | Translation JSON | One file per locale |

**Decision test:** Feature-specific? → `src/features/<name>/`. Shared across features? → `src/lib/`.

## TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Single path alias: `@/*` → `./src/*`. Import examples:
- `@/features/auth/LoginForm`
- `@/lib/api/client`
- `@/i18n/navigation`

## Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const nextConfig: NextConfig = {}
export default withNextIntl(nextConfig)
```

## Key Next.js 16 Differences
- **Turbopack default** — no webpack config needed, opt in with `next build --webpack`
- **`proxy.ts` replaces `middleware.ts`** — runs on Node.js, not Edge
- **`params` is `Promise<T>`** — must `await` in all server components
- **`cookies()` and `headers()` are async** — must `await`
- **`next lint` removed** — use ESLint CLI directly: `npx eslint .`
- **Fetch not cached by default** — must opt in with `cache: 'force-cache'`

## Conventions
- Feature modules are self-contained: components + types + schemas + store
- Shared hooks in `src/lib/hooks/`, not scattered across features
- One `@/*` path alias for everything — no per-directory aliases
- Environment variables via `process.env` — `NEXT_PUBLIC_` prefix for client access

## Anti-patterns
- Never create a `packages/` directory — this is a single-app project
- Never create a `tailwind.config.ts` — Tailwind v4 uses CSS config
- Never name proxy file `middleware.ts` — Next.js 16 uses `proxy.ts`
- Never use webpack-specific config without `--webpack` flag
