#!/usr/bin/env node
// Scaffold a new page: creates <path>/index.md with stub front-matter.
// Usage:
//   npm run new-page <path> "<title>"
// Examples:
//   npm run new-page services/ant-control "Ant Control"
//   npm run new-page about "About Us"
//   npm run new-page services/ant-control/diy-tips "DIY Ant Tips"

import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const [, , rawPath, ...titleParts] = process.argv;
const title = titleParts.join(" ").trim();

if (!rawPath || !title) {
  console.error('Usage: npm run new-page <path> "<title>"');
  console.error('Example: npm run new-page services/ant-control "Ant Control"');
  process.exit(1);
}

// Strip leading/trailing slashes; reject absolute or parent-traversal paths.
const path = rawPath.replace(/^\/+|\/+$/g, "");
if (path.includes("..") || path.startsWith("/")) {
  console.error(`Refused: invalid path "${rawPath}".`);
  process.exit(1);
}

const targetDir = join(projectRoot, path);
const targetFile = join(targetDir, "index.md");

try {
  await access(targetFile);
  console.error(`Refused: ${path}/index.md already exists.`);
  process.exit(1);
} catch {
  // does not exist — proceed
}

await mkdir(targetDir, { recursive: true });

const body = `---
title: ${title}
description: TODO — short summary for hero/meta description.
layout: base.liquid
---

TODO: page content.
`;

await writeFile(targetFile, body, "utf8");

const parent = path.includes("/") ? path.split("/").slice(0, -1).join("/") : "";
const parentLabel = parent ? `${parent}/index.md` : "index.md (root)";

console.log(`Created ${path}/index.md`);
console.log(`Next: add a link to /${path}/ from ${parentLabel}.`);
