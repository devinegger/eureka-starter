#!/usr/bin/env node
// Promote a flat page to a section: <name>.md → <name>/index.md
// Content is preserved exactly. The original .md file is removed.
// The URL /<name>/ is unchanged.
//
// Non-interactive (Obsidian Shell Commands):
//   npm run convert-page -- "{{file_path:relative}}"
//
// Interactive (CLI — prompts if arg is missing):
//   npm run convert-page

import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { projectRoot, ask } from "./_utils.mjs";

const [, , rawFilePath] = process.argv;

let filePath;

if (rawFilePath) {
  // Non-interactive: arg supplied.
  filePath = rawFilePath.replace(/^\/+|\/+$/g, "");
} else {
  // Interactive: prompt the user.
  console.log("\n  Convert Page → Section\n");
  const answers = await ask([
    { name: "file", prompt: "File to convert (e.g. services/about.md)", required: true },
  ]);
  filePath = answers.file.replace(/^\/+|\/+$/g, "");
  console.log();
}

if (filePath.includes("..")) {
  console.error(`  Refused: invalid path "${filePath}".`);
  process.exit(1);
}

if (!filePath.endsWith(".md")) {
  console.error(`  Refused: "${filePath}" is not a .md file.`);
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
const newDisplayPath = join(parentDir, fileName, "index.md").replace(/^\.\//, "");

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

const urlPath = join(parentDir, fileName).replace(/^\.\//, "");
console.log(`  Converted  ${filePath} → ${newDisplayPath}`);
console.log(`  URL        /${urlPath}/ is unchanged.\n`);
