// The cube's gesture map in a real browser (owner 2026-11-12). Run:
//   npm run gh-pages && npx playwright test -c test/e2e/playwright.config.mjs --workers=1
// KF_GESTURE_BASE=https://keyframes.babb.dev points the same spec at a deploy.
import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: ".",
    testMatch: /.*\.spec\.mjs$/,
    workers: 1,
    timeout: 60_000,
    reporter: "list",
    use: { headless: true },
});
