#!/usr/bin/env node
// Production build orchestrator.
//
// Runs the Tina CMS admin build first (which generates the editor bundle
// into src/admin/), then runs Eleventy to build the site.
//
// Tina build is attempted only when both TINA_CLIENT_ID and TINA_TOKEN are
// set. If the Tina build fails (e.g. the Cloud project isn't fully connected
// yet), we warn and fall through — the site still deploys, /admin/ just
// won't have a working editor until Tina Cloud is properly configured.

import { execSync } from "node:child_process";

const hasTinaCreds = Boolean(process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN);

if (hasTinaCreds) {
  console.log("→ Building Tina admin bundle…");
  try {
    execSync("npx tinacms build", { stdio: "inherit" });
    console.log("✅ Tina admin bundle built successfully.");
  } catch (err) {
    console.warn("⚠ Tina admin build failed — the site will still deploy.");
    console.warn("  /admin/ won't have a working editor until Tina Cloud is fully");
    console.warn("  configured (project created + repo connected at app.tina.io).");
    console.warn("  Error:", err.message);
  }
} else {
  console.log("⚠ TINA_CLIENT_ID / TINA_TOKEN not set — skipping Tina admin build.");
  console.log("  The site will build, but /admin/ won't have a working editor.");
  console.log("  See README.md → 'Tina Cloud setup' for how to configure these.");
}

console.log("→ Building site with Eleventy…");
execSync("npx eleventy", { stdio: "inherit" });
