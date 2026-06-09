#!/usr/bin/env node
/** rc-dfa-gen — INSTRUMENT the _gen deref. We cannot easily reach the dock
 *  gesture (B8 hides the trigger), so we PROVE the staleness window directly:
 *  patch RAFPlayback.prototype.stop (reached via the module) is not feasible from
 *  the page, so instead we observe the live group getter through the running app:
 *  drive a group->group switch and, via a per-frame poll on window, record
 *  whether the leaving scene's adapter could observe a swapped currentAnimationGroup.
 *
 *  Strategy: hook window.onerror + unhandledrejection to capture the FULL stack
 *  (not just the truncated console line), drive cube(playing)->amiga via the App's
 *  exposed runSceneSwitch if reachable on window, else hash, and dump any _gen
 *  stack with all frames. Also force the captureActive timing by issuing the
 *  NAVIGATE through a microtask-delayed double dispatch that mimics the VT-wrapped
 *  startViewTransition callback ordering. */
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DEV = process.env.DEV_BASE || "http://localhost:5174";
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const chromium = (() => { try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; } })();
const MK = "keyframes-js-scene-machine";

const main = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const stacks = [];
  page.on("pageerror", (e) => stacks.push(`[pageerror] ${e.name}: ${e.message}\n${(e.stack || "").split("\n").slice(0, 16).join("\n")}`));
  await page.exposeFunction("__rcLog", (s) => stacks.push(s));

  await page.goto(`${DEV}/#/cube`, { waitUntil: "load" });
  await page.waitForTimeout(2800);

  // Install a global error trap that captures the FULL stack for any _gen error.
  await page.evaluate(() => {
    window.addEventListener("error", (ev) => {
      const m = ev?.error?.stack || ev?.message || "";
      if (/_gen|undefined is not an object|Cannot read properties of undefined/.test(String(m)))
        window.__rcLog("[window.error] " + String(m).split("\n").slice(0, 16).join("\n"));
    });
    window.addEventListener("unhandledrejection", (ev) => {
      const m = ev?.reason?.stack || ev?.reason?.message || "";
      if (/_gen|undefined is not an object|Cannot read properties of undefined/.test(String(m)))
        window.__rcLog("[unhandledrejection] " + String(m).split("\n").slice(0, 16).join("\n"));
    });
  });

  // engage play on cube
  for (const s of ['button[aria-label="Play animation"]', 'button[aria-label="Play animation (collapsed dock)"]']) {
    const b = page.locator(s).first();
    if (await b.count()) { await b.click({ timeout: 2000, force: true }).catch(() => {}); break; }
  }
  await page.waitForTimeout(900);

  // Now: rapid NAVIGATE sequence to open the captureActive->suspend window on a
  // PLAYING group scene. The dock-gesture's VT wrap interleaves the key mutation
  // with the async chunk load; we mimic by firing the next hash before the prior
  // bindSceneAdapter settles.
  for (const id of ["amiga", "cube", "square", "cube", "amiga"]) {
    await page.evaluate((x) => { location.hash = `#/${x}`; }, id);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(2000);

  const finalScene = await page.evaluate((mk) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return null; } }, MK);
  console.log(JSON.stringify({ finalScene, genStacks: stacks.slice(0, 6), count: stacks.length }, null, 2));
  await ctx.close(); await browser.close();
};
main().catch((e) => { console.error(e); process.exit(1); });
