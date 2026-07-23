#!/usr/bin/env node
/**
 * Copies EN keys missing from other locale files as English fallbacks.
 * Never overwrites existing translations — additive only.
 *
 * Usage:  node scripts/propagate-en-keys.mjs messages [namespace1 namespace2 ...]
 *   If no namespaces provided, walks every JSON file in messages/en/.
 *
 * Prints a summary of keys added per locale/namespace.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
const namespaceArgs = process.argv.slice(3);
if (!root || !existsSync(root)) {
  console.error(
    "Usage: node scripts/propagate-en-keys.mjs <messages-root> [ns1 ns2 ...]",
  );
  process.exit(2);
}

const enDir = join(root, "en");
if (!existsSync(enDir)) {
  console.error(`No 'en' locale at ${enDir}`);
  process.exit(2);
}

const namespaces =
  namespaceArgs.length > 0
    ? namespaceArgs.map((n) => (n.endsWith(".json") ? n : `${n}.json`))
    : readdirSync(enDir).filter((f) => f.endsWith(".json"));

const isDir = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};

const locales = readdirSync(root).filter(
  (entry) =>
    entry !== "en" && !entry.startsWith(".") && isDir(join(root, entry)),
);

let totalAdded = 0;

for (const namespace of namespaces) {
  const enPath = join(enDir, namespace);
  if (!existsSync(enPath)) {
    console.warn(`SKIP ${namespace}: not present in en/`);
    continue;
  }
  const enJson = JSON.parse(readFileSync(enPath, "utf8"));

  for (const locale of locales.sort()) {
    const targetPath = join(root, locale, namespace);
    let targetJson = {};
    if (existsSync(targetPath)) {
      try {
        targetJson = JSON.parse(readFileSync(targetPath, "utf8"));
      } catch (err) {
        console.error(`ERROR ${locale}/${namespace}: ${err.message}`);
        continue;
      }
    }
    let added = 0;
    for (const [key, value] of Object.entries(enJson)) {
      if (!(key in targetJson)) {
        targetJson[key] = value;
        added += 1;
      }
    }
    if (added > 0) {
      writeFileSync(
        targetPath,
        JSON.stringify(targetJson, null, 2) + "\n",
        "utf8",
      );
      console.log(`  ${locale}/${namespace}: +${added} keys`);
      totalAdded += added;
    }
  }
}

console.log(`\nTotal keys added: ${totalAdded}`);
