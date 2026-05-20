#!/usr/bin/env node
// Production build orchestrator.
//
// Runs the Tina CMS admin build first (which generates the editor bundle
// into src/admin/), then runs Eleventy to build the site. If
// TINA_CLIENT_ID isn't set in the environment, the Tina build is skipped
// and the site builds anyway — the admin UI just won't be available until
// Tina Cloud credentials are configured.

import { execSync } from "node:child_process";

const hasTinaCreds = Boolean(process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN);

if (hasTinaCreds) {
  console.log("→ Building Tina admin bundle…");
  execSync("npx tinacms build", { stdio: "inherit" });
} else {
  console.log("⚠ TINA_CLIENT_ID / TINA_TOKEN not set — skipping Tina admin build.");
  console.log("  The site will build, but /admin/ won't have a working editor.");
  console.log("  See README.md → 'Tina Cloud setup' for how to configure these.");
}

console.log("→ Building site with Eleventy…");
execSync("npx eleventy", { stdio: "inherit" });
