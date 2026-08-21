import { GENERAL_KEY_PREFIX } from "./variant";

type KeyChecker = { has: (key: string) => boolean };

/**
 * Resolves a section key against a variant prefix, falling back to the shared
 * general copy when that variant has no override. Lets an event-type page
 * reword only the lines worth rewording instead of restating every key.
 */
export const createVariantKey =
  (t: KeyChecker, keyPrefix: string) =>
  (suffix: string): string => {
    const scoped = `${keyPrefix}${suffix}`;
    return t.has(scoped) ? scoped : `${GENERAL_KEY_PREFIX}${suffix}`;
  };
