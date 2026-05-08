#!/usr/bin/env node
// Create a new section: <parent>/<slug>/index.md
//
// Usage (CLI):
//   npm run new-folder -- "<parent>" "<Title>"
//   npm run new-folder -- services "Mosquito Control"
//   npm run new-folder -- . "Case Studies"
//
// Obsidian Shell Commands:
//   npm run new-folder -- "{{folder_path:relative}}" "{{value:Section title}}"

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { slugify, resolveParent, refuseIfExists, stub } from "./_utils.mjs";

const [, , rawParent, ...titleParts] = process.argv;
const title = titleParts.join(" ").trim();

if (!rawParent || !title) {
  console.error("Usage: npm run new-folder -- \"<parent>\" \"<Title>\"");
  console.error('Examples:');
  console.error('  npm run new-folder -- services "Mosquito Control"');
  console.error('  npm run new-folder -- . "Case Studies"');
  process.exit(1);
}

const parentDir = resolveParent(rawParent);
const slug = slugify(title);
const targetDir = join(parentDir, slug);
const targetFile = join(targetDir, "index.md");
const displayPath = join(rawParent === "." ? "" : rawParent, slug, "index.md")
  .replace(/^\//, "");

await refuseIfExists(targetFile, displayPath);
await mkdir(targetDir, { recursive: true });
await writeFile(targetFile, stub(title), "utf8");

const sectionPath = displayPath.replace(/\/index\.md$/, "");
console.log(`Created ${displayPath}`);
console.log(`Next: add a link to /${sectionPath}/ from ${rawParent === "." ? "index.md (root)" : `${rawParent}/index.md`}.`);
