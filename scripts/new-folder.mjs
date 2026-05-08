#!/usr/bin/env node
// Create a new section: <parent>/<slug>/index.md
//
// Non-interactive (Obsidian Shell Commands):
//   npm run new-folder -- "{{folder_path:relative}}" "{{value:Section title}}"
//
// Interactive (CLI — prompts if args are missing):
//   npm run new-folder

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { slugify, resolveParent, refuseIfExists, stub, ask } from "./_utils.mjs";

const [, , rawParent, ...titleParts] = process.argv;
const titleArg = titleParts.join(" ").trim();

let parent, title, description;

if (rawParent && titleArg) {
  // Non-interactive: args supplied (e.g. from Obsidian Shell Commands).
  parent = rawParent;
  title  = titleArg;
  description = "";
} else {
  // Interactive: prompt the user.
  console.log("\n  New Section\n");
  const answers = await ask([
    { name: "parent",      prompt: "Parent folder",    default: ".",  required: false },
    { name: "title",       prompt: "Section title",                   required: true  },
    { name: "description", prompt: "Short description",               required: false },
  ]);
  parent      = answers.parent;
  title       = answers.title;
  description = answers.description;
  console.log();
}

const parentDir  = resolveParent(parent);
const slug       = slugify(title);
const targetDir  = join(parentDir, slug);
const targetFile = join(targetDir, "index.md");
const sectionPath = join(parent === "." ? "" : parent, slug).replace(/^\//, "");

await refuseIfExists(targetFile, `${sectionPath}/index.md`);
await mkdir(targetDir, { recursive: true });
await writeFile(targetFile, stub(title, description), "utf8");

const parentLabel = parent === "." ? "index.md (root)" : `${parent}/index.md`;
console.log(`  Created  ${sectionPath}/index.md`);
console.log(`  Next     link to /${sectionPath}/ from ${parentLabel}\n`);
