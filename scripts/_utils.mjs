// Shared utilities for page scaffolding scripts.
//
// Pages now live under src/pages/. Navigation is data-driven via
// src/_data/nav.json — scaffolding no longer patches a layout file.

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  ".."
);

export const pagesRoot = join(projectRoot, "src", "pages");

/** Turn a title into a URL-safe slug. */
export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Resolve a parent directory argument under src/pages/. */
export function resolveParent(raw) {
  const cleaned = (raw || ".").replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
  if (cleaned.includes("..")) throw new Error(`Invalid parent path: "${raw}"`);
  return cleaned === "." || cleaned === "" ? pagesRoot : join(pagesRoot, cleaned);
}

/** Exit if a path already exists. */
export async function refuseIfExists(filePath, label) {
  try {
    await access(filePath);
    console.error(`  Refused: ${label} already exists.`);
    process.exit(1);
  } catch {
    // does not exist — good
  }
}

/**
 * Prompt for a list of questions interactively.
 * Each question: { name, prompt, default?, required? }
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

/** Front-matter stub for a generic content page. */
export function stub(title, description = "") {
  const desc = description || "TODO — short summary for hero/meta description.";
  return `---
title: ${title}
description: ${desc}
layout: layouts/page.njk
---

TODO: page content. Markdown is processed as Nunjucks, so partials work too:

{% include "partials/cta-block.njk" %}
`;
}
