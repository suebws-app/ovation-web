import type { SidebarNavGroup, SidebarNavItem } from "./types";

export const itemKey = (item: SidebarNavItem) => item.key ?? item.href;

const EVENT_PREFIX_RE = /^\/events\/[0-9a-f-]{8,}/i;

const stripEventPrefix = (path: string) =>
  path.replace(EVENT_PREFIX_RE, "") || "/";

const matchesPath = (href: string, pathname: string) => {
  const candidates = new Set([pathname, stripEventPrefix(pathname)]);
  const targets = new Set([href, stripEventPrefix(href)]);
  for (const candidate of candidates) {
    for (const target of targets) {
      if (candidate === target || candidate.startsWith(`${target}/`)) {
        return true;
      }
    }
  }
  return false;
};

export const resolveActiveKey = (
  groups: SidebarNavGroup[],
  pathname: string,
): string | null => {
  let bestKey: string | null = null;
  let bestLength = -1;
  for (const group of groups) {
    for (const item of group.items) {
      const targets = [item.href, ...(item.matchPaths ?? [])];
      for (const target of targets) {
        if (matchesPath(target, pathname) && target.length > bestLength) {
          bestKey = itemKey(item);
          bestLength = target.length;
        }
      }
    }
  }
  return bestKey;
};
