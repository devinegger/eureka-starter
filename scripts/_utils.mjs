// Shared utilities for page scaffolding scripts.

import { access } from "node:fs/promises";
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
  // Accept ".", "", or a relative path — never allow traversal.
  const cleaned = (raw || ".").replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
  if (cleaned.includes("..")) throw new Error(`Invalid parent path: "${raw}"`);
  return cleaned === "." || cleaned === "" ? projectRoot : join(projectRoot, cleaned);
}

/** Throw if a path already exists. */
export async function refuseIfExists(filePath, label) {
  try {
    await access(filePath);
    console.error(`Refused: ${label} already exists.`);
    process.exit(1);
  } catch {
    // good — does not exist
  }
}

/** Minimal front-matter stub. */
export function stub(title) {
  return `---
title: ${title}
description: TODO — short summary for hero/meta description.
layout: base.liquid
---

TODO: page content.
`;
}
