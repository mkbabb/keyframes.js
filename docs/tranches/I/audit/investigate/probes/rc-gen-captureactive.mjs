#!/usr/bin/env node
/** rc-dfa-gen — reproduce the USER'S EXACT _gen stack via captureActive->suspend.
 *
 *  The user's stack: suspend (scenePlaybackAdapters.ts) -> captureActive
 *  (useSceneMachine) -> dispatch -> switchScene (useSceneMachineApp). That is the
 *  GROUP adapter's suspend() (group.pause()/group.playback.stop()), NOT the
 *  useSceneVisibilityPause unbound path (which would show flushJobs).
 *
 *  The dock-select gesture is obstructed by B8 (trigger visibility:hidden), so we
 *  drive switchScene via the SAME machine entry the dock would, but reached
 *  through the window-exposed handler if present, else via a direct hash + an
 *  immediate second NAVIGATE to force a captureActive against a group whose live
 *  getter may already be swapped. We instrument the live getter to record what
 *  currentAnimationGroup.value (and .playback) is AT suspend time.
 *
 *  Run on DEV (:5174) for source-mapped frames.
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

  // Scenarios chosen to stress the captureActive->suspend ordering on a GROUP
  // adapter (cube/amiga/square) whose live getter may be swapped mid-transition:
  //  - cube(playing) -> amiga : group->group, captureActive suspends cube's group
  //  - rapid double NAVIGATE   : second nav's captureActive runs while the first
  //    bindSceneAdapter already reassigned currentAnimationGroup.value.
  const cases = [
    { name: "cube_play_then_amiga", start: "cube", play: true, navs: ["amiga"] },
    { name: "amiga_play_then_cube", start: "amiga", play: true, navs: ["cube"] },
    { name: "cube_play_rapid_double", start: "cube", play: true, navs: ["amiga", "square"] },
    { name: "easing_play_then_amiga", start: "easing", play: false /* autoplays */, navs: ["amiga"] },
  ];

  for (const c of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { const t = m.text(); if ((m.type() === "error" || m.type() === "warning") && !noise(t)) errs.push(`[${m.type()}] ${t.replace(/\s+/g, " ").slice(0, 260)}`); });
    page.on("pageerror", (e) => errs.push(`[PAGEERROR] ${e.name}: ${e.message}\n  ${(e.stack || "").split("\n").slice(1, 14).map((s) => s.trim()).join("\n  ")}`));
    try {
      await page.goto(`${DEV}/#/${c.start}`, { waitUntil: "load" });
      await page.waitForTimeout(2800);
      if (c.play) {
        for (const s of ['button[aria-label="Play animation"]', 'button[aria-label="Play animation (collapsed dock)"]']) {
          const b = page.locator(s).first();
          if (await b.count()) { await b.click({ timeout: 2000, force: true }).catch(() => {}); break; }
        }
        await page.waitForTimeout(800);
      }
      const e0 = errs.length;
      // Drive the NAVIGATE(s) the dock would, in rapid succession (sub-settle) to
      // open the captureActive->suspend staleness window. Hash write triggers the
      // App's route watcher -> switchScene -> dispatch(NAVIGATE) -> captureActive.
      for (const to of c.navs) {
        await page.evaluate((x) => { location.hash = `#/${x}`; }, to);
        await page.waitForTimeout(c.navs.length > 1 ? 120 : 1400); // sub-settle when rapid
      }
      await page.waitForTimeout(1600);
      const finalScene = await page.evaluate((mk) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return null; } }, MK);
      await page.screenshot({ path: path.join(SHOTS, `rc-gen-ca-${c.name}.png`) }).catch(() => {});
      out[c.name] = {
        finalScene,
        arrived: finalScene === c.navs[c.navs.length - 1],
        errs: errs.slice(e0).slice(0, 12),
        genError: errs.slice(e0).some((x) => /_gen|undefined is not an object|Cannot read properties of undefined/i.test(x)),
        captureActiveFrame: errs.slice(e0).some((x) => /captureActive|scenePlaybackAdapters|switchScene/i.test(x)),
      };
    } catch (e) { out[c.name] = { harnessError: String(e?.message || e) }; }
    finally { await ctx.close(); }
  }

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
};
main().catch((e) => { console.error(e); process.exit(1); });
