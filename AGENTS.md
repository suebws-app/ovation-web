<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Skills — ALWAYS reference before writing code

Before implementing anything, read the relevant skill from `.claude/skills/`. These contain project-specific patterns, conventions, and code templates that match the actual stack (Next.js 16, Tailwind v4, next-intl v4).

Start with `.claude/skills/INDEX.md` for the full list and dependency map.

| When you're working on... | Read this skill first |
|---|---|
| Project structure, file organization | `.claude/skills/project-bootstrap/project-setup.md` |
| Environment variables | `.claude/skills/project-bootstrap/env-management.md` |
| Tailwind, shadcn/ui, design tokens, cn(), cva | `.claude/skills/ui/tailwind-design-system.md` |
| Creating components, server/client split | `.claude/skills/ui/component-conventions.md` |
| i18n, translations, locale routing | `.claude/skills/i18n/next-intl-setup.md` |
| Routes, route groups, dynamic segments | `.claude/skills/app-router/route-structure.md` |
| Layouts, providers, auth guards | `.claude/skills/app-router/layouts-and-providers.md` |
| SEO, metadata, Open Graph | `.claude/skills/app-router/metadata.md` |
| Auth, proxy.ts, route protection | `.claude/skills/auth/proxy-auth.md` |
| API client, data fetching, caching | `.claude/skills/data-layer/data-layer.md` |
| Zustand stores, state management | `.claude/skills/state/zustand-patterns.md` |
| Forms, validation, Zod schemas | `.claude/skills/forms/react-hook-form-patterns.md` |
| Error tracking, Sentry | `.claude/skills/observability/sentry-setup.md` |

## Code style rules (do NOT ignore)

- **Always use arrow functions** for components — `export const MyComponent = () => {}`, never `function MyComponent() {}`
- **NEVER add code comments** — write self-documenting code with descriptive (but not excessively long) variable and function names
- **NEVER use raw Tailwind colors** (`text-zinc-50`, `bg-slate-900`) — always use theme tokens (`text-foreground`, `bg-primary`)
- UI components live in `packages/ui/` (`@ovation/ui`), icons in `packages/icons/` (`@ovation/icons`)

## Critical Next.js 16 rules (do NOT ignore)

- `proxy.ts` replaces `middleware.ts`
- `params` is `Promise<T>` — must `await` in server components, `use()` in client
- `cookies()` and `headers()` are async — must `await`
- `fetch()` is NOT cached by default — opt in with `cache: 'force-cache'`
- Turbopack is the default bundler
- `next lint` is removed — use ESLint CLI directly
- Tailwind v4 uses CSS `@theme inline` — no `tailwind.config.ts`
- Always use `Link`/`useRouter` from `@/i18n/navigation`, never from `next/link`
