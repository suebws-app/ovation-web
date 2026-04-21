import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Next.js 16 uses `proxy` instead of `middleware`.
 * We wrap next-intl's middleware so it runs as a proxy.
 */
export function proxy(request: Request) {
  return intlMiddleware(request as any);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
