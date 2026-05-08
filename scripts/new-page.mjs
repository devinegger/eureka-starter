#!/usr/bin/env node
// Create a flat leaf page: <parent>/<slug>.md
//
// Usage (CLI):
//   npm run new-page -- "<parent>" "<Title>"
//   npm run new-page -- services "Ant Control"
//   npm run new-page -- . "About Us"
//
// Obsidian Shell Commands:
//   npm run new-page -- "{{folder_path:relative}}" "{{value:Page title}}"

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { slugify, resolveParent, refuseIfExists, stub } from "./_utils.mjs";

const [, , rawParent, ...titleParts] = process.argv;
const title = titleParts.join(" ").trim();

if (!rawParent || !title) {
  console.error("Usage: npm run new-page -- \"<parent>\" \"<Title>\"");
  console.error('Examples:');
  console.error('  npm run new-page -- services "Ant Control"');
  console.error('  npm run new-page -- . "About Us"');
  process.exit(1);
}

const parentDir = resolveParent(rawParent);
const slug = slugify(title);
const targetFile = join(parentDir, `${slug}.md`);
const displayPath = join(rawParent === "." ? "" : rawParent, `${slug}.md`)
  .replace(/^\//, "");

await refuseIfExists(targetFile, displayPath);
await mkdir(parentDir, { recursive: true });
await writeFile(targetFile, stub(title), "utf8");

console.log(`Created ${displayPath}`);
console.log(`Next: add a link to /${displayPath.replace(/\.md$/, "/")} from ${rawParent === "." ? "index.md (root)" : `${rawParent}/index.md`}.`);
