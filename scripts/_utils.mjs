// Shared utilities for page scaffolding scripts.

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { access, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  ".."
);

/** Turn a title into a URL-safe slug. */
export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Resolve and validate a parent directory argument. */
export function resolveParent(raw) {
  const cleaned = (raw || ".").replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
  if (cleaned.includes("..")) throw new Error(`Invalid parent path: "${raw}"`);
  return cleaned === "." || cleaned === "" ? projectRoot : join(projectRoot, cleaned);
}

/** Exit if a path already exists. */
export async function refuseIfExists(filePath, label) {
  try {
    await access(filePath);
    console.error(`  Refused: ${label} already exists.`);
    process.exit(1);
  } catch {
    // good — does not exist
  }
}

/**
 * Prompt for a list of questions interactively.
 * Each question: { name, prompt, default?, required? }
 * Returns an object of { name: answer }.
 */
export async function ask(questions) {
  const rl = createInterface({ input, output });
  const answers = {};

  for (const q of questions) {
    const hint = q.default
      ? ` (${q.default})`
      : q.required ? "" : " (optional, Enter to skip)";
    const raw = await rl.question(`  ${q.prompt}${hint}: `);
    const val = raw.trim() || q.default || "";
    if (q.required && !val) {
      console.error(`\n  "${q.name}" is required. Aborting.`);
      rl.close();
      process.exit(1);
    }
    answers[q.name] = val;
  }

  rl.close();
  return answers;
}

/**
 * Ask where to include a new page in site navigation.
 * Only call this when the page is being added at the root level (parent = ".").
 * Returns { main: bool, footer: bool }.
 */
export async function askNavInclusion() {
  const rl = createInterface({ input, output });
  const raw = await rl.question(
    "  Add to navigation? (main / footer / both / no, default: no): "
  );
  rl.close();

  const answer = raw.trim().toLowerCase();
  return {
    main:   answer === "main"   || answer === "both",
    footer: answer === "footer" || answer === "both",
  };
}

/**
 * Insert a nav link into _includes/base.liquid at the given marker.
 * marker: "main-nav" | "footer-nav"
 * label: display text
 * url:   href value e.g. "/about/"
 */
export async function insertNavLink(marker, label, url) {
  const layoutPath = join(projectRoot, "_includes", "base.liquid");
  let src;

  try {
    src = await readFile(layoutPath, "utf8");
  } catch {
    console.warn(`  Warning: could not read _includes/base.liquid — add the nav link manually.`);
    return;
  }

  const tag = `<!-- insert:${marker} -->`;

  if (!src.includes(tag)) {
    console.warn(`  Warning: marker "${tag}" not found in base.liquid — add the nav link manually:`);
    console.warn(`    <a href="${url}">${label}</a>`);
    return;
  }

  // Detect indentation from the marker line.
  const markerLine = src.split("\n").find((l) => l.includes(tag)) || "";
  const indent = markerLine.match(/^(\s*)/)?.[1] ?? "          ";

  const link = `${indent}<a href="${url}">${label}</a>\n${indent}${tag}`;
  const updated = src.replace(`${indent}${tag}`, link);

  await writeFile(layoutPath, updated, "utf8");
}

/** Front-matter stub. Falls back to TODO if description is empty. */
export function stub(title, description = "") {
  const desc = description || "TODO — short summary for hero/meta description.";
  return `---
title: ${title}
description: ${desc}
layout: base.liquid
---

TODO: page content.
`;
}
