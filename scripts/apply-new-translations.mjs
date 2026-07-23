#!/usr/bin/env node
/**
 * Applies translation deltas from scripts/new-translations-data.json into
 * messages/{locale}/{namespace}.json. Only OVERWRITES the specific keys
 * present in the deltas — leaves every other key untouched.
 *
 * Usage: node scripts/apply-new-translations.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, 'new-translations-data.json');
const messagesRoot = join(here, '..', 'messages');

if (!existsSync(dataPath)) {
  console.error(`Missing ${dataPath}`);
  process.exit(2);
}
if (!existsSync(messagesRoot)) {
  console.error(`Missing ${messagesRoot}`);
  process.exit(2);
}

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

let filesTouched = 0;
let keysUpdated = 0;

for (const [namespace, byLocale] of Object.entries(data)) {
  for (const [locale, entries] of Object.entries(byLocale)) {
    const file = join(messagesRoot, locale, `${namespace}.json`);
    if (!existsSync(file)) {
      console.warn(`SKIP ${locale}/${namespace}.json (missing)`);
      continue;
    }
    const current = JSON.parse(readFileSync(file, 'utf8'));
    let changed = 0;
    for (const [key, value] of Object.entries(entries)) {
      if (current[key] !== value) {
        current[key] = value;
        changed += 1;
      }
    }
    if (changed > 0) {
      writeFileSync(file, JSON.stringify(current, null, 2) + '\n', 'utf8');
      console.log(`  ${locale}/${namespace}.json: ${changed} updated`);
      filesTouched += 1;
      keysUpdated += changed;
    }
  }
}

console.log(`\nDone. Files touched: ${filesTouched}. Keys updated: ${keysUpdated}.`);
