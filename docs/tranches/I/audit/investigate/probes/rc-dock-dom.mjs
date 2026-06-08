#!/usr/bin/env node
/** rc-dfa-gen — harvest the dock "Scene" select DOM so we can drive the real
 *  gesture. Open easing, expand dock, click the Scene trigger, dump every role,
 *  aria-label, and the reka popper content. */
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DEV = process.env.DEV_BASE || "http://localhost:5174";
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const chromium = (() => { try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; } })();

const main = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${DEV}/#/easing`, { waitUntil: "load" });
  await page.waitForTimeout(2800);

  const dumpRoles = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[role],[aria-label],button,select').forEach((el) => {
      const r = el.getAttribute("role"); const al = el.getAttribute("aria-label");
      const box = el.getBoundingClientRect();
      const vis = box.width > 0 && box.height > 0 && getComputedStyle(el).visibility !== "hidden";
      if (r || al) out.push({ tag: el.tagName.toLowerCase(), role: r, label: al, text: (el.textContent || "").trim().slice(0, 30), vis, w: Math.round(box.width), h: Math.round(box.height) });
    });
    return out.slice(0, 60);
  });

  const before = await dumpRoles();
  // expand dock + click Scene trigger
  await page.mouse.move(720, 860); await page.waitForTimeout(400);
  const trig = page.locator('button[aria-label="Scene"], [role="combobox"][aria-label="Scene"], [aria-label="Scene"]').first();
  const trigCount = await trig.count();
  let opened = false;
  if (trigCount) { await trig.click({ timeout: 3000, force: true }).catch(() => {}); await page.waitForTimeout(600); opened = true; }
  const afterOpen = await dumpRoles();
  // dump teleported popper content (reka renders to body end)
  const popper = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[role="option"],[role="listbox"],[data-reka-select-content],[id^="reka-"],[data-radix-select-viewport]').forEach((el) => {
      out.push({ role: el.getAttribute("role"), id: el.id, text: (el.textContent || "").trim().slice(0, 60) });
    });
    return out.slice(0, 40);
  });

  console.log(JSON.stringify({ trigCount, opened, before, afterOpen, popper }, null, 2));
  await ctx.close(); await browser.close();
};
main().catch((e) => { console.error(e); process.exit(1); });
