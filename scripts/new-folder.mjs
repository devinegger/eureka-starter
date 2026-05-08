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
import {
  slugify, resolveParent, refuseIfExists, stub,
  ask, askNavInclusion, insertNavLink,
} from "./_utils.mjs";

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
    { name: "parent",      prompt: "Parent folder",    default: ".", required: false },
    { name: "title",       prompt: "Section title",                  required: true  },
    { name: "description", prompt: "Short description",              required: false },
  ]);
  parent      = answers.parent;
  title       = answers.title;
  description = answers.description;

  // Only ask about nav for root-level sections — nested ones live under an
  // existing nav section and don't need a separate top-level entry.
  let nav = { main: false, footer: false };
  if (parent === "." || parent === "") {
    console.log();
    nav = await askNavInclusion();
  }

  const parentDir  = resolveParent(parent);
  const slug       = slugify(title);
  const targetDir  = join(parentDir, slug);
  const targetFile = join(targetDir, "index.md");
  const sectionPath = join(parent === "." ? "" : parent, slug).replace(/^\//, "");

  await refuseIfExists(targetFile, `${sectionPath}/index.md`);
  await mkdir(targetDir, { recursive: true });
  await writeFile(targetFile, stub(title, description), "utf8");

  const url = `/${slug}/`;
  if (nav.main)   await insertNavLink("main-nav",   title, url);
  if (nav.footer) await insertNavLink("footer-nav", title, url);

  const parentLabel = parent === "." ? "index.md (root)" : `${parent}/index.md`;
  console.log(`\n  Created  ${sectionPath}/index.md`);
  if (nav.main || nav.footer) {
    const where = [nav.main && "main", nav.footer && "footer"].filter(Boolean).join(" + ");
    console.log(`  Nav      added to ${where} in _includes/base.liquid`);
  }
  console.log(`  Next     link to /${sectionPath}/ from ${parentLabel}\n`);
  process.exit(0);
}

// Non-interactive path (Obsidian — no nav prompt).
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
