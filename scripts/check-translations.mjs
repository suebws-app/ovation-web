#!/usr/bin/env node
/**
 * Translation completeness checker. Uses the `en` locale as the reference
 * and verifies every other locale directory against it.
 *
 * Checks per locale:
 *   ERROR   missing file          — a JSON file present in en/ is absent
 *   ERROR   missing key           — a key present in en is absent
 *   ERROR   placeholder mismatch  — {icuArgs} or <richTags> differ from en
 *   ERROR   empty value           — key exists but value is ""
 *   WARN    orphan key            — key not present in en (dead weight)
 *   WARN    untranslated          — long value identical to the en value
 *
 * Usage:   node scripts/check-translations.mjs <translations-root> [--strict]
 * Exits 1 on any ERROR (and on WARN with --strict); 0 otherwise.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2];
const strict = process.argv.includes("--strict");
if (!root || !existsSync(root)) {
  console.error("Usage: node scripts/check-translations.mjs <translations-root> [--strict]");
  process.exit(2);
}

const REFERENCE = "en";
const UNTRANSLATED_MIN_LENGTH = 30;

const jsonFilesUnder = (dir) => {
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const p = join(d, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (entry.endsWith(".json")) out.push(p);
    }
  };
  walk(dir);
  return out;
};

const flatten = (obj, prefix = "") => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") Object.assign(out, flatten(v, key));
    else out[key] = String(v ?? "");
  }
  return out;
};

// Proper ICU argument extraction: brace-depth parsing so plural/select
// branch delimiters (e.g. `one {invitee}`) aren't mistaken for arguments,
// while nested interpolations inside branches ({min}, {name}) are found.
// Compares unique argument names — valid translations may use fewer plural
// branches than English, so occurrence counts must not matter.
const braceGroup = (s, open) => {
  let depth = 1;
  let i = open + 1;
  while (i < s.length && depth > 0) {
    if (s[i] === "{") depth += 1;
    else if (s[i] === "}") depth -= 1;
    i += 1;
  }
  return s.slice(open + 1, i - 1);
};

const extractIcuArgs = (str, args = new Set()) => {
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] !== "{") continue;
    const inner = braceGroup(str, i);
    const m = inner.match(/^\s*(\w+)\s*(?:,\s*\w+\s*,?([\s\S]*))?$/);
    if (m) {
      args.add(m[1]);
      if (m[2]) {
        for (let j = 0; j < m[2].length; j += 1) {
          if (m[2][j] !== "{") continue;
          const branch = braceGroup(m[2], j);
          extractIcuArgs(branch, args);
          j += branch.length + 1;
        }
      }
    }
    i += inner.length + 1;
  }
  return args;
};

const signature = (value) => {
  const icu = [...extractIcuArgs(value)].sort();
  const tags = [...new Set([...value.matchAll(/<(\w+)>/g)].map((m) => m[1]))].sort();
  return JSON.stringify([icu, tags]);
};

const loadLocaleFiles = (locale) => {
  const dir = join(root, locale);
  const files = {};
  for (const p of jsonFilesUnder(dir)) {
    files[relative(dir, p).split(sep).join("/")] = flatten(
      JSON.parse(readFileSync(p, "utf8")),
    );
  }
  return files;
};

const reference = loadLocaleFiles(REFERENCE);
const referenceKeyCount = Object.values(reference).reduce(
  (n, keys) => n + Object.keys(keys).length,
  0,
);

const locales = readdirSync(root)
  .filter((d) => d !== REFERENCE && statSync(join(root, d)).isDirectory())
  .sort();

let totalErrors = 0;
let totalWarnings = 0;

for (const locale of locales) {
  const errors = [];
  const warnings = [];
  let localeFiles;
  try {
    localeFiles = loadLocaleFiles(locale);
  } catch (err) {
    console.error(`✖ ${locale}: unreadable JSON — ${err.message}`);
    totalErrors += 1;
    continue;
  }

  for (const [file, refKeys] of Object.entries(reference)) {
    const keys = localeFiles[file];
    if (!keys) {
      errors.push(`missing file ${file} (${Object.keys(refKeys).length} keys)`);
      continue;
    }
    for (const [key, refValue] of Object.entries(refKeys)) {
      const value = keys[key];
      if (value === undefined) errors.push(`missing key ${file} → ${key}`);
      else if (value === "" && refValue !== "")
        errors.push(`empty value ${file} → ${key}`);
      else if (signature(value) !== signature(refValue))
        errors.push(`placeholder mismatch ${file} → ${key}`);
      else if (value === refValue && refValue.length >= UNTRANSLATED_MIN_LENGTH)
        warnings.push(`untranslated ${file} → ${key}`);
    }
    for (const key of Object.keys(keys)) {
      if (!(key in refKeys)) warnings.push(`orphan key ${file} → ${key}`);
    }
  }
  for (const file of Object.keys(localeFiles)) {
    if (!(file in reference)) warnings.push(`orphan file ${file}`);
  }

  totalErrors += errors.length;
  totalWarnings += warnings.length;

  const status = errors.length > 0 ? "✖" : warnings.length > 0 ? "⚠" : "✓";
  console.log(
    `${status} ${locale}: ${errors.length} errors, ${warnings.length} warnings`,
  );
  for (const line of errors) console.log(`    ERROR ${line}`);
  if (process.env.I18N_CHECK_VERBOSE || strict) {
    for (const line of warnings) console.log(`    WARN  ${line}`);
  }
}

console.log(
  `\n${locales.length} locales checked against ${REFERENCE} (${referenceKeyCount} keys): ` +
    `${totalErrors} errors, ${totalWarnings} warnings`,
);
if (totalWarnings > 0 && !strict && !process.env.I18N_CHECK_VERBOSE) {
  console.log("(re-run with --strict or I18N_CHECK_VERBOSE=1 to list warnings)");
}
process.exit(totalErrors > 0 || (strict && totalWarnings > 0) ? 1 : 0);
