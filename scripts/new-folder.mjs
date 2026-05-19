#!/usr/bin/env node
// Create a section folder under src/pages/: <parent>/<slug>/index.md
//
//   npm run new-folder services "Services"
//   npm run new-folder                  # interactive

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { slugify, resolveParent, refuseIfExists, stub, ask } from "./_utils.mjs";

const [, , rawParent, ...titleParts] = process.argv;
const titleArg = titleParts.join(" ").trim();

let parent, title, description;

if (rawParent && titleArg) {
  parent = rawParent;
  title = titleArg;
  description = "";
} else {
  console.log("\n  New Section\n");
  const answers = await ask([
    { name: "parent",      prompt: "Parent folder (under src/pages/)", default: ".", required: false },
    { name: "title",       prompt: "Section title",                    required: true },
    { name: "description", prompt: "Short description",                required: false },
  ]);
  parent = answers.parent;
  title = answers.title;
  description = answers.description;
}

const parentDir  = resolveParent(parent);
const slug       = slugify(title);
const targetDir  = join(parentDir, slug);
const targetFile = join(targetDir, "index.md");
const sectionPath = join("src/pages", parent === "." ? "" : parent, slug).replace(/^\//, "");

await refuseIfExists(targetFile, `${sectionPath}/index.md`);
await mkdir(targetDir, { recursive: true });
await writeFile(targetFile, stub(title, description), "utf8");

console.log(`  Created  ${sectionPath}/index.md`);
console.log(`  Nav      add an entry to src/_data/nav.json if this should appear in the menu`);
console.log(`  URL      /${parent === "." ? "" : parent + "/"}${slug}/\n`);
