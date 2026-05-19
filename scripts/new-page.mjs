#!/usr/bin/env node
// Create a flat content page under src/pages/: <parent>/<slug>.md
//
//   npm run new-page services/my-service "My Service"
//   npm run new-page                       # interactive

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
  console.log("\n  New Page\n");
  const answers = await ask([
    { name: "parent",      prompt: "Parent folder (under src/pages/)", default: ".", required: false },
    { name: "title",       prompt: "Page title",                       required: true },
    { name: "description", prompt: "Short description",                required: false },
  ]);
  parent = answers.parent;
  title = answers.title;
  description = answers.description;
}

const parentDir  = resolveParent(parent);
const slug       = slugify(title);
const targetFile = join(parentDir, `${slug}.md`);
const displayPath = join("src/pages", parent === "." ? "" : parent, `${slug}.md`).replace(/^\//, "");

await refuseIfExists(targetFile, displayPath);
await mkdir(parentDir, { recursive: true });
await writeFile(targetFile, stub(title, description), "utf8");

console.log(`  Created  ${displayPath}`);
console.log(`  Nav      add an entry to src/_data/nav.json if this should appear in the menu`);
console.log(`  URL      /${parent === "." ? "" : parent + "/"}${slug}/\n`);
