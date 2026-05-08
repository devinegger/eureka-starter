#!/usr/bin/env node
// Promote a flat page to a section: <name>.md → <name>/index.md
// The file content is preserved exactly. The original .md file is removed.
//
// Usage (CLI):
//   npm run convert-page -- "<path/to/file.md>"
//   npm run convert-page -- services/ant-control.md
//
// Obsidian Shell Commands:
//   npm run convert-page -- "{{file_path:relative}}"

import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { projectRoot } from "./_utils.mjs";

const [, , rawFilePath] = process.argv;

if (!rawFilePath) {
  console.error("Usage: npm run convert-page -- \"<path/to/file.md>\"");
  console.error("Example: npm run convert-page -- services/ant-control.md");
  process.exit(1);
}

const filePath = rawFilePath.replace(/^\/+|\/+$/g, "");

if (filePath.includes("..")) {
  console.error(`Refused: invalid path "${rawFilePath}".`);
  process.exit(1);
}

if (!filePath.endsWith(".md")) {
  console.error(`Refused: "${filePath}" is not a .md file.`);
  process.exit(1);
}

const absFile = join(projectRoot, filePath);

// Confirm source exists.
try {
  await access(absFile);
} catch {
  console.error(`Not found: ${filePath}`);
  process.exit(1);
}

const fileName = basename(filePath, ".md");
const parentDir = dirname(filePath);
const newDir = join(projectRoot, parentDir, fileName);
const newFile = join(newDir, "index.md");
const newDisplayPath = join(parentDir, fileName, "index.md").replace(/^\.\//, "");

// Refuse if the folder already exists.
try {
  await access(newDir);
  console.error(`Refused: ${join(parentDir, fileName)} already exists.`);
  process.exit(1);
} catch {
  // good
}

const content = await readFile(absFile, "utf8");
await mkdir(newDir, { recursive: true });
await writeFile(newFile, content, "utf8");
await rm(absFile);

console.log(`Converted ${filePath} → ${newDisplayPath}`);
console.log(`URL /${join(parentDir, fileName).replace(/^\.\//, "")}/ is unchanged.`);
