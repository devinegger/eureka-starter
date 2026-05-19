#!/usr/bin/env node
// Promote a flat page to a section: <name>.md → <name>/index.md
// Content is preserved exactly. The URL /<name>/ is unchanged.
//
//   npm run convert-page src/pages/about.md
//   npm run convert-page                       # interactive

import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { projectRoot, ask } from "./_utils.mjs";

const [, , rawFilePath] = process.argv;

let filePath;

if (rawFilePath) {
  filePath = rawFilePath.replace(/^\/+|\/+$/g, "");
} else {
  console.log("\n  Convert Page → Section\n");
  const answers = await ask([
    { name: "file", prompt: "File to convert (e.g. src/pages/about.md)", required: true },
  ]);
  filePath = answers.file.replace(/^\/+|\/+$/g, "");
}

if (filePath.includes("..") || !filePath.endsWith(".md")) {
  console.error(`  Refused: invalid or non-md path "${filePath}".`);
  process.exit(1);
}

const absFile = join(projectRoot, filePath);

try {
  await access(absFile);
} catch {
  console.error(`  Not found: ${filePath}`);
  process.exit(1);
}

const fileName  = basename(filePath, ".md");
const parentDir = dirname(filePath);
const newDir    = join(projectRoot, parentDir, fileName);
const newFile   = join(newDir, "index.md");
const newDisplayPath = join(parentDir, fileName, "index.md");

try {
  await access(newDir);
  console.error(`  Refused: ${join(parentDir, fileName)} already exists.`);
  process.exit(1);
} catch {
  // good
}

const content = await readFile(absFile, "utf8");
await mkdir(newDir, { recursive: true });
await writeFile(newFile, content, "utf8");
await rm(absFile);

console.log(`  Converted  ${filePath} → ${newDisplayPath}\n`);
