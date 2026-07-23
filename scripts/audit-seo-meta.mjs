#!/usr/bin/env node
/**
 * Audits meta title and meta description lengths across all locales.
 *   - title:       hard limit  60 chars, warn if < 40 (wasting real estate)
 *   - description: hard limit 155 chars, warn if < 120 (wasting real estate)
 *
 * Usage:  node scripts/audit-seo-meta.mjs messages [--strict]
 * Exits 1 if any hard limit exceeded (and on warnings with --strict).
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const TITLE_MAX = 60;
const TITLE_MIN = 40;
const DESC_MAX = 155;
const DESC_MIN = 120;

const root = process.argv[2];
const strict = process.argv.includes("--strict");
if (!root || !existsSync(root)) {
  console.error("Usage: node scripts/audit-seo-meta.mjs <messages-root> [--strict]");
  process.exit(2);
}

let errors = 0;
let warnings = 0;

const locales = readdirSync(root).filter((entry) => {
  try {
    return existsSync(join(root, entry, "seo.json"));
  } catch {
    return false;
  }
});

for (const locale of locales.sort()) {
  const path = join(root, locale, "seo.json");
  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error(`ERROR ${locale}/seo.json: invalid JSON — ${err.message}`);
    errors += 1;
    continue;
  }
  for (const [key, value] of Object.entries(json)) {
    if (typeof value !== "string") continue;
    const isTitle = key.endsWith("__title");
    const isDesc = key.endsWith("__description");
    if (!isTitle && !isDesc) continue;
    const max = isTitle ? TITLE_MAX : DESC_MAX;
    const min = isTitle ? TITLE_MIN : DESC_MIN;
    const kind = isTitle ? "title" : "description";
    if (value.length > max) {
      console.error(
        `ERROR ${locale} ${key}: ${kind} is ${value.length} chars (max ${max})`,
      );
      errors += 1;
    } else if (value.length < min) {
      console.warn(
        `WARN  ${locale} ${key}: ${kind} is ${value.length} chars (target ${min}-${max})`,
      );
      warnings += 1;
    }
  }
}

console.log(
  `\nChecked ${locales.length} locales. Errors: ${errors}. Warnings: ${warnings}.`,
);
if (errors > 0 || (strict && warnings > 0)) process.exit(1);
