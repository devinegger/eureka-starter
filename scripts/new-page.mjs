#!/usr/bin/env node
// Create a flat leaf page: <parent>/<slug>.md
//
// Non-interactive (Obsidian Shell Commands):
//   npm run new-page -- "{{folder_path:relative}}" "{{value:Page title}}"
//
// Interactive (CLI — prompts if args are missing):
//   npm run new-page

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { slugify, resolveParent, refuseIfExists, stub, ask } from "./_utils.mjs";

const [, , rawParent, ...titleParts] = process.argv;
const titleArg = titleParts.join(" ").trim();

let parent, title, description;

if (rawParent && titleArg) {
  // Non-interactive: args supplied (e.g. from Obsidian Shell Commands).
  parent = rawParent;
  title = titleArg;
  description = "";
} else {
  // Interactive: prompt the user.
  console.log("\n  New Page\n");
  const answers = await ask([
    { name: "parent",      prompt: "Parent folder",    default: ".",  required: false },
    { name: "title",       prompt: "Page title",                      required: true  },
    { name: "description", prompt: "Short description",               required: false },
  ]);
  parent      = answers.parent;
  title       = answers.title;
  description = answers.description;
  console.log();
}

const parentDir = resolveParent(parent);
const slug      = slugify(title);
const targetFile = join(parentDir, `${slug}.md`);
const displayPath = join(parent === "." ? "" : parent, `${slug}.md`).replace(/^\//, "");

await refuseIfExists(targetFile, displayPath);
await mkdir(parentDir, { recursive: true });
await writeFile(targetFile, stub(title, description), "utf8");

const parentLabel = parent === "." ? "index.md (root)" : `${parent}/index.md`;
console.log(`  Created  ${displayPath}`);
console.log(`  Next     link to /${displayPath.replace(/\.md$/, "/")} from ${parentLabel}\n`);
