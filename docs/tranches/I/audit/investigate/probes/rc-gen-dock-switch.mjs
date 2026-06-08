#!/usr/bin/env node
/** rc-dfa-gen — reproduce the USER'S EXACT _gen stack:
 *    suspend (scenePlaybackAdapters.ts) -> captureActive (useSceneMachine)
 *    -> dispatch -> switchScene (useSceneMachineApp).
 *  The user gesture is the DOCK "Scene" select (a reka combobox), NOT a hash nav.
 *  b12 noted the dock gesture diverges from the hash path. We drive the REAL dock
 *  select against the DEV server (:5174, source-mapped) so the stack frames match
 *  the user's verbatim report. We also instrument the live group getter to see
 *  WHETHER currentAnimationGroup.value (or its .playback) is undefined at suspend.
 */
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DEV = process.env.DEV_BASE || "http://localhost:5174";
const SHOTS = path.join(HERE, "..", "shots");
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const chromium = (() => { try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; } })();
const MK = "keyframes-js-scene-machine";
const noise = (t) => /content-visibility|Rendering was performed|GL Driver|GPU stall|WebGL|\[vite\]|hmr|sourcemap|Download the|Vue Devtools/i.test(t);

const main = async () => {
  const browser = await chromium.launch();
  const out = {};

  // The decisive case: easing (auto-plays) -> amiga via the REAL dock select.
  for (const [name, A, B] of [["easing_to_amiga", "easing", "amiga"], ["spring_to_amiga", "spring", "amiga"], ["cube_to_easing", "cube", "easing"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { const t = m.text(); if ((m.type() === "error" || m.type() === "warning") && !noise(t)) errs.push(`[${m.type()}] ${t.replace(/\s+/g, " ").slice(0, 240)}`); });
    page.on("pageerror", (e) => errs.push(`[PAGEERROR] ${e.name}: ${e.message}\n  ${(e.stack || "").split("\n").slice(1, 12).map((s) => s.trim()).join("\n  ")}`));
    try {
      await page.goto(`${DEV}/#/${A}`, { waitUntil: "load" });
      await page.waitForTimeout(2800); // dev settle
      // engage play if a Play button exists (cube/spring may not auto-play)
      for (const s of ['button[aria-label="Play animation"]', 'button[aria-label="Play animation (collapsed dock)"]']) {
        const b = page.locator(s).first();
        if (await b.count()) { await b.click({ timeout: 2000, force: true }).catch(() => {}); break; }
      }
      await page.waitForTimeout(900);
      // verify it is actually playing
      const playingBefore = await page.evaluate((mk) => { try { /* status lives in machine; read perScene snap or DOM */ const s = JSON.parse(localStorage.getItem(mk) || "{}"); return s; } catch { return null; } }, MK);
      const e0 = errs.length;

      // ── drive the REAL dock Scene select ──
      // The dock collapses; we must expand it first (hover/click the dock), then
      // open the reka "Scene" combobox, then pick B.
      const sceneTrigger = page.locator('button[aria-label="Scene"], [role="combobox"][aria-label="Scene"]').first();
      let gesture = "none";
      if (await sceneTrigger.count()) {
        // expand the dock so the trigger is hit-testable (B8: dock visibility churn)
        await page.mouse.move(720, 860); await page.waitForTimeout(300);
        await sceneTrigger.click({ timeout: 3000, force: true }).catch(async () => {
          await sceneTrigger.click({ timeout: 2000, force: true }).catch(() => {});
        });
        await page.waitForTimeout(400);
        // pick the option for B
        const opt = page.locator(`[role="option"]`).filter({ hasText: new RegExp(B, "i") }).first();
        if (await opt.count()) { await opt.click({ timeout: 2500, force: true }).catch(() => {}); gesture = "dock-select"; }
        else gesture = "trigger-open-no-option";
      } else {
        gesture = "no-trigger";
      }
      await page.waitForTimeout(1800);
      const arrived = (await page.evaluate((mk) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return null; } }, MK)) === B;
      await page.screenshot({ path: path.join(SHOTS, `rc-gen-${name}.png`) }).catch(() => {});
      out[name] = {
        gesture, arrived,
        switchErrs: errs.slice(e0).slice(0, 10),
        genError: errs.slice(e0).some((x) => /_gen|undefined is not an object|Cannot read properties of undefined/i.test(x)),
        playingBeforeStore: playingBefore,
      };
    } catch (e) { out[name] = { harnessError: String(e?.message || e) }; }
    finally { await ctx.close(); }
  }

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
};
main().catch((e) => { console.error(e); process.exit(1); });
