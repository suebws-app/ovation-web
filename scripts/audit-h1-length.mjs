#!/usr/bin/env node
/**
 * Audits H1 length in landing page metadata.
 * Scans messages/{locale}/{seo,marketing}.json for hero title keys and warns
 * if the composed H1 (line1 + line2 concatenation, or standalone title)
 * exceeds 60 chars.
 *
 * Usage:  node scripts/audit-h1-length.mjs messages [--strict]
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const MAX_H1 = 60;

const root = process.argv[2];
const strict = process.argv.includes("--strict");
if (!root || !existsSync(root)) {
  console.error("Usage: node scripts/audit-h1-length.mjs <messages-root> [--strict]");
  process.exit(2);
}

let errors = 0;

const isTitleLineKey = (key) =>
  /(?:__title|__title_line1|__title_line2)$/.test(key);

const locales = readdirSync(root).filter((entry) =>
  existsSync(join(root, entry, "marketing.json")),
);

for (const locale of locales.sort()) {
  const marketingPath = join(root, locale, "marketing.json");
  let json;
  try {
    json = JSON.parse(readFileSync(marketingPath, "utf8"));
  } catch (err) {
    console.error(`ERROR ${locale}/marketing.json: ${err.message}`);
    errors += 1;
    continue;
  }
  const bases = new Map();
  for (const key of Object.keys(json)) {
    if (!isTitleLineKey(key)) continue;
    const base = key.replace(/__title(?:_line[12])?$/, "");
    if (!bases.has(base)) bases.set(base, {});
    const bucket = bases.get(base);
    if (key.endsWith("__title_line1")) bucket.line1 = json[key];
    else if (key.endsWith("__title_line2")) bucket.line2 = json[key];
    else if (key.endsWith("__title")) bucket.title = json[key];
  }
  for (const [base, parts] of bases) {
    const composed =
      parts.title ??
      [parts.line1, parts.line2].filter(Boolean).join(" ");
    if (!composed) continue;
    if (composed.length > MAX_H1) {
      console.error(
        `ERROR ${locale} ${base}: composed H1 is ${composed.length} chars (max ${MAX_H1}) — "${composed}"`,
      );
      errors += 1;
    }
  }
}

console.log(`\nChecked ${locales.length} locales. Errors: ${errors}.`);
if (errors > 0 && strict) process.exit(1);
