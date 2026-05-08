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
  console.log("\n  New Page\n");
  const answers = await ask([
    { name: "parent",      prompt: "Parent folder",    default: ".", required: false },
    { name: "title",       prompt: "Page title",                     required: true  },
    { name: "description", prompt: "Short description",              required: false },
  ]);
  parent      = answers.parent;
  title       = answers.title;
  description = answers.description;

  // Only ask about nav for root-level pages — nested pages live under an
  // existing nav section and don't need a separate top-level entry.
  let nav = { main: false, footer: false };
  if (parent === "." || parent === "") {
    console.log();
    nav = await askNavInclusion();
  }

  const parentDir  = resolveParent(parent);
  const slug       = slugify(title);
  const targetFile = join(parentDir, `${slug}.md`);
  const displayPath = join(parent === "." ? "" : parent, `${slug}.md`).replace(/^\//, "");

  await refuseIfExists(targetFile, displayPath);
  await mkdir(parentDir, { recursive: true });
  await writeFile(targetFile, stub(title, description), "utf8");

  const url = `/${slug}/`;
  if (nav.main)   await insertNavLink("main-nav",   title, url);
  if (nav.footer) await insertNavLink("footer-nav", title, url);

  const parentLabel = parent === "." ? "index.md (root)" : `${parent}/index.md`;
  console.log(`\n  Created  ${displayPath}`);
  if (nav.main || nav.footer) {
    const where = [nav.main && "main", nav.footer && "footer"].filter(Boolean).join(" + ");
    console.log(`  Nav      added to ${where} in _includes/base.liquid`);
  }
  console.log(`  Next     link to /${displayPath.replace(/\.md$/, "/")} from ${parentLabel}\n`);
  process.exit(0);
}

// Non-interactive path (Obsidian — no nav prompt).
const parentDir  = resolveParent(parent);
const slug       = slugify(title);
const targetFile = join(parentDir, `${slug}.md`);
const displayPath = join(parent === "." ? "" : parent, `${slug}.md`).replace(/^\//, "");

await refuseIfExists(targetFile, displayPath);
await mkdir(parentDir, { recursive: true });
await writeFile(targetFile, stub(title, description), "utf8");

const parentLabel = parent === "." ? "index.md (root)" : `${parent}/index.md`;
console.log(`  Created  ${displayPath}`);
console.log(`  Next     link to /${displayPath.replace(/\.md$/, "/")} from ${parentLabel}\n`);
