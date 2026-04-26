# Better Auth migration plan

## Phase 1 — done

- `better-auth`, `pg` installed in `ovation-web`
- `src/lib/auth/better-auth.ts` — config with email/password, Google, Apple, email verification, custom user fields (`preferredLanguage`, `role`, `emailPreferences`)
- `src/app/api/auth/[...all]/route.ts` — Better Auth handler mounted
- `src/lib/auth/client.ts` — React client (`signIn`, `signUp`, `useSession`, …)
- `src/lib/auth/server-session.ts` — `getServerSession()` for server components
- `src/modules/auth/better-auth-session.service.ts` (NestJS) — read-only session validator querying Postgres directly
- `env.ts` extended with `DATABASE_URL`, `BETTER_AUTH_SECRET`, OAuth IDs, Resend keys

The existing Supabase auth path is untouched. Both systems coexist.

## Step 1 — generate Better Auth tables

Better Auth ships a CLI that generates SQL from the config. Run from `ovation-web`:

```bash
BETTER_AUTH_SECRET=$(openssl rand -base64 32) \
DATABASE_URL=<your-railway-pg-url> \
npx @better-auth/cli generate --output ./drizzle/0001_better_auth.sql
```

This produces SQL for four tables: `user`, `session`, `account`, `verification`.

Apply it once:

```bash
psql $DATABASE_URL -f ./drizzle/0001_better_auth.sql
```

In production, fold the generated SQL into the `ovation-api` Drizzle migration pipeline so it runs alongside everything else.

## Step 2 — env vars

Add to `ovation-web/.env.local` and Railway env:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<32+ random bytes>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
RESEND_API_KEY=re_...
EMAIL_FROM=Ovation <hello@ovation.app>
```

## Step 3 — wire verification emails

Better Auth calls a `sendVerificationEmail(user, url)` callback when `emailVerification.sendOnSignUp` is true. Currently the config has it enabled but no callback. Add to `better-auth.ts`:

```ts
emailVerification: {
  sendOnSignUp: true,
  autoSignInAfterVerification: true,
  expiresIn: 60 * 60 * 24,
  sendVerificationEmail: async ({ user, url }) => {
    // call Resend or hit the NestJS /email endpoint
  },
},
```

The simplest path: hit the existing NestJS email queue. Better Auth's user object carries the locale via the custom `preferredLanguage` field; pass it through.

## Step 4 — switch the frontend forms

Replace each form's submit handler to use Better Auth's client:

| File | Old (Supabase) | New (Better Auth) |
|---|---|---|
| `SignInFormStep.tsx` | `authClient.signIn(...)` from `@/lib/api/auth-client` | `signIn.email(...)` from `@/lib/auth/client` |
| `CreateAccountStep.tsx` | `authClient.signUp(...)` | `signUp.email(...)` |
| `VerifyEmailStep.tsx` | `authClient.verifyEmail(...)` | Better Auth handles via the verification URL |
| `ForgotPasswordPage.tsx` | `authClient.resetPasswordEmail(...)` | `forgetPassword(...)` |
| `ResetPasswordPage.tsx` | `authClient.resetPassword(...)` | `resetPassword(...)` |
| `OauthCallbackPage.tsx` | manual exchange | Better Auth handles `/api/auth/callback/<provider>` automatically |

After each form is migrated, delete the corresponding `src/app/api/auth/{signin,signout,refresh,oauth,verify-email}/route.ts`.

## Step 5 — switch the proxy

`src/app/api/proxy/[...path]/route.ts` currently reads `auth_token` cookie and forwards as `Authorization: Bearer <jwt>`. Change to read the Better Auth session cookie (`ovation.session_token`) and forward as `Authorization: Bearer <session-token>`.

The session cookie is httpOnly, signed, set automatically by Better Auth. Read it via `cookies().get(...)`.

## Step 6 — switch NestJS guard

In `src/common/guards/auth.guard.ts`, replace JWKS verification with a call to `BetterAuthSessionService.validate(token)`:

```ts
const result = await this.sessionService.validate(token);
if (!result) throw new UnauthorizedError(...);
request.currentUser = result.user;
```

Drop `jsonwebtoken` and `jwks-rsa` from `package.json`.

## Step 7 — migrate users (only relevant if you have live users)

Pre-launch: skip — no users to migrate.

If users exist:

1. Export from Supabase: `supabase admin auth export-users --output users.json`
2. Insert into Better Auth tables:
   - `user`: id, email, name, emailVerified=true, createdAt
   - `account`: providerId='credential', accountId=user_id, password=<bcrypt hash from Supabase>
3. Drop the existing app `users` table's `authProviderId`, swap to `userId` foreign key into Better Auth's `user.id`

## Step 8 — remove Supabase

```bash
cd ovation-web && pnpm remove @supabase/supabase-js  # if present
cd ovation-api && pnpm remove @supabase/supabase-js
```

Delete:
- `ovation-api/src/modules/auth/supabase-auth.provider.ts`
- `ovation-api/src/modules/auth/auth.controller.ts` (the routes Better Auth replaces)
- All `ovation-web/src/app/api/auth/{signin,signout,refresh,oauth,verify-email}/route.ts`
- Supabase env vars from both `.env.example` files
- `AUTH_JWKS_URL`, `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_USER_ID_CLAIM` env vars

## Rollback

Phase 1 introduces no behavioral changes. Until Step 5 (proxy switch), you can `git revert` the cutover commit safely. After Step 5 — the cookie format changes, so rollback requires forcing all sessions to expire (either by deleting the `session` table rows or by changing `cookiePrefix`). Plan to roll forward only.
