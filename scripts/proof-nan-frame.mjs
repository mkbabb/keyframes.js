#!/usr/bin/env node
/**
 * proof:nan-frame — Q.WD1 (DM-22 named-selector NaN-frame, the PROPER cure: a
 * 4-tranche chronic terminal).
 *
 * The defect chain: a scroll-range named selector (`entry`/`exit`/`cover`/
 * `contain`) is stored OPAQUELY at ingest (`ValueUnit(rawSelector, undefined,
 * [NAMED_SELECTOR_SUPERTYPE])`, `.value` = the raw STRING) — the L.W1 S4 floor
 * (`fromString` round-trips VERBATIM, NEVER throws). But `parse()`'s sort
 * (`"entry" - "exit"` = NaN) + `calcFrameTime` (`"entry" * dur / 100` = NaN)
 * produce NaN frame times, and `binarySearchRange` treats a NaN-bounded range as
 * ALWAYS-ACTIVE (the silent DM-22 defect).
 *
 * The cure (this wave) is Path B (Path A — a parse-time throw — was REVERTED in
 * the impl drive because it broke the opaque-ingest floor): deferred resolution
 * at `bindTimeline(timeline)` attach (named phase → numeric `%` via
 * `namedSelectorToFraction`, clearing the superType tag) + a TYPED throw
 * (`NAMED_SELECTOR_NO_TIMELINE`) ONLY at `play()`/`at()` when an unresolved named
 * frame remains (no timeline bound) — NEVER at parse.
 *
 * Four RUNTIME-observable clauses (NOT a source-shape proxy — the inv-M-
 * observable-truth lesson DM-22 escaped for 4 tranches). A pure headless tsx
 * probe over the REAL engine + frame-compiler + ManualTimeline (no browser, no
 * jsdom). Born-RED on today's tree: `bindTimeline`/`namedSelectorToFraction` do
 * not exist; `play()` does NOT throw (silent NaN). `s4-ingest-roundtrip` is GREEN
 * today (the floor holds) — and MUST stay green after the cure.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:nan-frame — Q.WD1 (DM-22 named-selector NaN-frame proper cure: bind-resolve + play-time guard)",
);

// R.W2 — `CSSKeyframesAnimation` moved to `engine/css-animation.ts`.
const engineUrl = pathToFileURL(
    join(root, "src", "animation", "engine", "css-animation.ts"),
).href;
// S.B3 C-2 — the re-export ceremony through frame-compiler is DEAD;
// `namedSelectorToFraction` is imported from its REAL home, `compile/selector.ts`.
const selectorUrl = pathToFileURL(
    join(root, "src", "animation", "compile", "selector.ts"),
).href;
const timelineUrl = pathToFileURL(
    join(root, "src", "animation", "orchestration", "timeline", "index.ts"),
).href;

const probe = `
import { CSSKeyframesAnimation } from ${JSON.stringify(engineUrl)};
import { ManualTimeline } from ${JSON.stringify(timelineUrl)};

const out = { clauses: {} };
const rec = (name, payload) => { out.clauses[name] = payload; };

// Dynamic import so a MISSING namedSelectorToFraction export (the born-RED state)
// does not crash the whole probe — each clause reports independently.
let namedSelectorToFraction = null;
try {
  const sel = await import(${JSON.stringify(selectorUrl)});
  namedSelectorToFraction = sel.namedSelectorToFraction ?? null;
} catch {}

const CSS = '@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }';

// ── s4-ingest-roundtrip: fromString does NOT throw + round-trips verbatim ──────
try {
  const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(CSS);
  const raw = String(anim.templateFrames[0].start.value);
  const hasNamed = anim.templateFrames.some(
    (f) => /entry|exit|cover|contain/.test(String(f.start.value)),
  );
  rec('s4-ingest-roundtrip', { threw: false, raw, hasNamed });
} catch (e) {
  rec('s4-ingest-roundtrip', { threw: true, error: String(e && e.message || e) });
}

// ── bind-resolves: namedSelectorToFraction exact mappings ─────────────────────
if (typeof namedSelectorToFraction !== 'function') {
  rec('bind-resolves', { ok: false, error: 'namedSelectorToFraction is not exported from compile/selector.ts' });
} else {
  try {
    const vals = {
      entry: namedSelectorToFraction('entry'),
      cover: namedSelectorToFraction('cover'),
      contain: namedSelectorToFraction('contain'),
      exit: namedSelectorToFraction('exit'),
      entry50: namedSelectorToFraction('entry 50%'),
    };
    rec('bind-resolves', { ok: true, vals });
  } catch (e) {
    rec('bind-resolves', { ok: false, error: String(e && e.message || e) });
  }
}

// ── no-nan-at-play: after bindTimeline + re-compile, finite times + no throw ──
try {
  const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(CSS);
  if (typeof anim.bindTimeline !== 'function') {
    rec('no-nan-at-play', { ok: false, reason: 'bindTimeline is not a function' });
  } else {
    anim.bindTimeline(new ManualTimeline());
    const allFinite = anim.frames.every(
      (f) => Number.isFinite(f.time.start) && Number.isFinite(f.time.stop),
    );
    // (b) the ORDERING ENFORCER: at()/play() on the BOUND animation must NOT throw
    // NAMED_SELECTOR_NO_TIMELINE (the guard reads the CLEARED superType tag).
    let atThrew = false, atErr = '';
    const v0 = (() => { try { return anim.at(0); } catch (e) { atThrew = true; atErr = String(e && e.code || e && e.message || e); return null; } })();
    const v5 = (() => { try { return anim.at(0.5); } catch (e) { atThrew = true; atErr = String(e && e.code || e && e.message || e); return null; } })();
    const v1 = (() => { try { return anim.at(1); } catch (e) { atThrew = true; atErr = String(e && e.code || e && e.message || e); return null; } })();
    rec('no-nan-at-play', { ok: allFinite && !atThrew, allFinite, atThrew, atErr });
  }
} catch (e) {
  rec('no-nan-at-play', { ok: false, error: String(e && e.message || e) });
}

// ── play-throws-no-timeline: WITHOUT bindTimeline, play() throws the typed code ─
try {
  const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(CSS);
  let threwCode = null, threwName = null;
  try {
    // at() shares the guard (the oracle path) — synchronous, no rAF.
    anim.at(0.5);
    rec('play-throws-no-timeline', { ok: false, reason: 'at() did NOT throw (silent NaN)' });
  } catch (e) {
    threwCode = e && e.code; threwName = e && e.name;
    rec('play-throws-no-timeline', {
      ok: threwCode === 'NAMED_SELECTOR_NO_TIMELINE',
      code: threwCode, name: threwName,
    });
  }
} catch (e) {
  rec('play-throws-no-timeline', { ok: false, error: String(e && e.message || e) });
}

console.log(JSON.stringify(out));
`;

const tmp = mkdtempSync(join(tmpdir(), "kf-nan-frame-"));
const probeFile = join(tmp, "probe.mts");
let result = null;
try {
    writeFileSync(probeFile, probe, "utf8");
    const run = spawnSync("npx", ["tsx", probeFile], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    });
    const line = (run.stdout ?? "")
        .trim()
        .split("\n")
        .filter((l) => l.trim().startsWith("{"))
        .pop();
    if (run.status !== 0 || !line) {
        const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
            .split("\n")
            .filter((l) => l.trim())
            .slice(-20)
            .join("\n");
        // A probe-LOAD failure (e.g. namedSelectorToFraction not exported) IS the
        // born-RED witness on today's tree — surface it as the clause failures.
        fail(
            "probe",
            `the nan-frame probe failed (status ${run.status}). Tail:\n${tail}`,
        );
    } else {
        result = JSON.parse(line);
    }
} finally {
    rmSync(tmp, { recursive: true, force: true });
}

if (result !== null) {
    const c = result.clauses;

    // ── s4-ingest-roundtrip (stays GREEN — the floor) ─────────────────────────
    if (!c["s4-ingest-roundtrip"] || c["s4-ingest-roundtrip"].threw) {
        fail(
            "s4-ingest-roundtrip",
            `fromString THREW on a named-selector input — the L.W1 S4 opaque-ingest ` +
                `floor is BROKEN (the impl-drive Path-A trap). Error: ${
                    c["s4-ingest-roundtrip"]?.error
                }`,
        );
    } else if (
        !/entry/.test(c["s4-ingest-roundtrip"].raw) ||
        !c["s4-ingest-roundtrip"].hasNamed
    ) {
        fail(
            "s4-ingest-roundtrip",
            `the named selector did NOT round-trip verbatim (raw=${JSON.stringify(
                c["s4-ingest-roundtrip"].raw,
            )}) — the ingest floor must preserve the authored token.`,
        );
    } else {
        ok(
            "s4-ingest-roundtrip",
            `fromString does NOT throw + round-trips "entry" verbatim (the L.W1 S4 floor holds)`,
        );
    }

    // ── bind-resolves (numeric correctness) ───────────────────────────────────
    const br = c["bind-resolves"];
    if (!br || !br.ok) {
        fail(
            "bind-resolves",
            `namedSelectorToFraction is absent or threw — ${
                br?.error ?? "the resolver does not exist"
            }`,
        );
    } else {
        const v = br.vals;
        const expect = {
            entry: 0,
            cover: 0.25,
            contain: 0.375,
            exit: 0.75,
            entry50: 0.125,
        };
        const wrong = Object.entries(expect).filter(
            ([k, val]) => Math.abs((v[k] ?? NaN) - val) > 1e-9,
        );
        if (wrong.length > 0) {
            fail(
                "bind-resolves",
                `namedSelectorToFraction returns WRONG values: ${wrong
                    .map(([k, val]) => `${k}=${v[k]} (expected ${val})`)
                    .join("; ")}`,
            );
        } else {
            ok(
                "bind-resolves",
                `namedSelectorToFraction: entry=0, cover=0.25, contain=0.375, exit=0.75, ` +
                    `entry 50%=0.125 (the single-position mapping locked)`,
            );
        }
    }

    // ── no-nan-at-play (the resolver connected + the guard reads the cleared tag) ─
    const nn = c["no-nan-at-play"];
    if (!nn || !nn.ok) {
        fail(
            "no-nan-at-play",
            `after bindTimeline(new ManualTimeline()): finite frame times = ${
                nn?.allFinite
            }, at()/play() over-threw = ${nn?.atThrew} (${nn?.atErr ?? nn?.reason ?? nn?.error}). ` +
                `Either bindTimeline is missing/stubbed, the resolver produced non-numeric ` +
                `starts (NaN sort), OR the S3 guard landed BEFORE the S2 resolver (it ` +
                `over-throws on the BOUND animation — the ordering-enforcer trap).`,
        );
    } else {
        ok(
            "no-nan-at-play",
            `after bindTimeline: every frame.time is finite AND the bound animation's ` +
                `at(0)/at(0.5)/at(1) do NOT throw (the guard reads the cleared superType tag)`,
        );
    }

    // ── play-throws-no-timeline (the typed throw, the keystone) ────────────────
    const pt = c["play-throws-no-timeline"];
    if (!pt || !pt.ok) {
        fail(
            "play-throws-no-timeline",
            `a named-selector animation WITHOUT bindTimeline did NOT throw ` +
                `NAMED_SELECTOR_NO_TIMELINE at play/at time (code=${
                    pt?.code
                }, reason=${pt?.reason ?? pt?.error}) — DM-22 is live (silent NaN, ` +
                `always-active frame).`,
        );
    } else {
        ok(
            "play-throws-no-timeline",
            `at()/play() WITHOUT a bound timeline throws AnimationOptionError with ` +
                `code === "NAMED_SELECTOR_NO_TIMELINE" (the typed-never-thrown placeholder ` +
                `is now a live code path)`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:nan-frame — FAIL:\n" + failures.join("\n"));
    console.error(
        "\n  DM-22 is the named-selector NaN-frame chronic. The proper cure: opaque " +
            "ingest stays (the L.W1 S4 floor — fromString NEVER throws); bindTimeline " +
            "resolves the named phase to a numeric % at attach; play()/at() throw the " +
            "TYPED NAMED_SELECTOR_NO_TIMELINE only when no timeline is bound — NEVER a " +
            "parse-time throw (the reverted Path-A trap).",
    );
    process.exit(1);
}
console.log(
    "proof:nan-frame — PASS: the L.W1 S4 ingest floor holds (fromString verbatim, no\n" +
        "throw); namedSelectorToFraction maps the named phases correctly; bindTimeline\n" +
        "resolves them to finite numeric % (no NaN at play); and play()/at() without a\n" +
        "bound timeline throw the typed NAMED_SELECTOR_NO_TIMELINE — DM-22 closed.",
);
