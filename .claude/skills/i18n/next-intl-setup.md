---
name: next-intl-setup
description: Use this skill when working with next-intl v4 — routing config, createNavigation, translation loading, CLDR currency formatting, and translation key conventions
type: skill
---

# next-intl v4 Internationalization

## When to Use
- Setting up or modifying i18n configuration
- Adding new translation keys
- Building locale-aware navigation or currency formatting
- Working with translations in server or client components

## Core Principles
- All user-facing strings use `useTranslations()` (client) or `getTranslations()` (server)
- Locale prefix: `as-needed` — default locale (`en`) has no prefix
- Navigation exports (`Link`, `redirect`, `useRouter`) from `@/i18n/navigation` — never raw `next/link`
- `proxy.ts` handles locale detection (Next.js 16 uses proxy, not middleware)
- CLDR-aware currency formatting via `@/i18n/currency`

## File Structure

```
src/i18n/
├── config.ts       # Locales, default, currency map, BCP 47 tags
├── routing.ts      # defineRouting config
├── navigation.ts   # createNavigation exports (Link, redirect, useRouter, etc.)
├── request.ts      # getRequestConfig — loads messages per locale
└── currency.ts     # formatCurrency, formatCurrencyParts

messages/
├── en.json         # English translations (source of truth)
├── fr.json         # French
├── nl.json         # Dutch
├── de.json         # German
├── es.json         # Spanish
└── it.json         # Italian
```

## Code Templates

### Config

```typescript
// src/i18n/config.ts
export const locales = ['en', 'fr', 'nl', 'de', 'es', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeCurrency: Record<Locale, string> = {
  en: 'EUR', fr: 'EUR', nl: 'EUR', de: 'EUR', es: 'EUR', it: 'EUR',
}

export const localeMap: Record<Locale, string> = {
  en: 'en-GB', fr: 'fr-FR', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', it: 'it-IT',
}
```

### Routing

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})
```

### Navigation exports

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

### Request config (message loading)

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { hasLocale } from 'next-intl'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

### Next.js plugin

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withNextIntl(nextConfig)
```

### Proxy (Next.js 16 — replaces middleware)

```typescript
// src/proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(request: Request) {
  return intlMiddleware(request as any)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

### Server component usage

```typescript
import { getTranslations } from 'next-intl/server'

export default async function AboutPage() {
  const t = await getTranslations()
  return <h1>{t('about__title')}</h1>
}
```

### Client component usage

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function LoginForm() {
  const t = useTranslations()
  return <h2>{t('auth__login__title')}</h2>
}
```

### Language switcher

```typescript
'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales } from '@/i18n/config'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (locale: string) => {
    router.replace(pathname, { locale })
  }

  return (
    <select onChange={(e) => handleChange(e.target.value)}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>{loc.toUpperCase()}</option>
      ))}
    </select>
  )
}
```

## Translation Key Convention

```
<scope>__<section>__<element>

Examples:
  auth__login__title           → "Log in to your account"
  event__create__title         → "Create Event"
  common__save                 → "Save"
  validation__required         → "This field is required"
```

Scopes: `auth`, `event`, `common`, `validation`, `seo`, `error`

## Conventions
- Always use `Link` / `useRouter` from `@/i18n/navigation` — never `next/link`
- Translation keys: `scope__section__element` with double underscores
- Default locale (`en`) has no URL prefix; all others do
- Currency formatting uses CLDR-correct `Intl.NumberFormat` via `@/i18n/currency`
- Messages loaded from JSON files in `messages/` directory

## Anti-patterns
- Never hardcode strings in components — always use `t('key')`
- Never use `next/link` or `next/navigation` directly
- Never create a custom Link wrapper — `createNavigation` handles everything
- Never store locale in state — use the URL and cookie as source of truth
