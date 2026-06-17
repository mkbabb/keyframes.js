#!/usr/bin/env node
/**
 * proof:ingest-replay — K.W8 (the round-trip pointed FORWARD at the live web):
 * the REPLAY-EQUALITY invariant, forward direction. kf reads the live web's OWN
 * CSS (`fromStyleSheets`/`fromLiveAnimations` walk the CSSOM), takes over a
 * RUNNING CSS animation mid-flight (`adoptRunning`), and every step it cannot
 * complete faithfully (a cross-origin sheet, a malformed rule) becomes a citable
 * `ParseDiagnostic` row — never a silent drop.
 *
 * BORN-RED WITNESS (the FRONTIER sense): on the pre-cure tree NO CSSOM-walk
 * surface exists — `grep -rn "styleSheets|getAnimations|cssRules|fromStyleSheets|
 * fromLiveAnimations|adoptRunning" src/` returned ZERO hits. There is no
 * `fromStyleSheets` to call, so every replay-equality clause reds by
 * construction (the capability is ABSENT). This gate greens only once the ingest
 * surface ships AND the reconstructed object replays equal to its source.
 *
 * CLAUSES (each BITES — the source-shape locks; the VALUE proof rides the
 * `vitest run test/ingest.test.ts` step wired beside this in package.json):
 *
 *   module-exists  — `src/animation/ingest.ts` exists and exports the K1/K2
 *       surface (`fromStyleSheets`, `fromLiveAnimations`, `resolveLiveKeyframes`,
 *       `adoptRunning`). BITE: delete the module / an export → the surface is
 *       absent (the born-RED root) → the value test cannot import → reds.
 *
 *   reuses-resolve — the ingest REUSES the existing parse pipeline WHOLE: it
 *       feeds `rule.cssText` into `CSSKeyframesAnimation.fromString` (which calls
 *       `resolveKeyframes`), NOT a re-derived lossy emitter. BITE: re-author a
 *       parser inside ingest.ts → the round-trip's faithfulness is forfeit (the
 *       moat-loss the mandate forbids) → this clause reds.
 *
 *   cssom-walk     — the walk reads `styleSheets`/`cssRules` and filters
 *       `@keyframes` rules (`CSSKeyframesRule`/type 7). BITE: drop the walk → the
 *       capability is gone → reds.
 *
 *   cors-honest    — the per-sheet `try/catch` emits a `CORS_SKIP` diagnostic
 *       (never a silent drop, never an uncaught throw). BITE: drop the catch / the
 *       row → a cross-origin sheet is silently dropped (the forbidden class) → reds.
 *
 *   adopt-runtime  — `adoptRunning` reads `getAnimations()` for the playhead,
 *       reconstructs from the CSSOM RULE (via `resolveLiveKeyframes`, NOT
 *       `getKeyframes()`), and seeds at the captured `currentTime` (the
 *       continuity seed, NOT seed-at-zero). BITE: seed at zero → the flash returns
 *       → the value test reds.
 *
 *   adopt-distinct — the new method is `adoptRunning`, NOT `adopt()` — it does
 *       NOT collide with the shipped `engine.ts adoptCompiled` (HARDENING-5
 *       HAZARD-1). BITE: rename to `adopt()` / touch `adoptCompiled` → reds.
 *
 *   barrel-heavy   — the ingest runtime rides `loadAnimationEngine()` (the HEAVY
 *       dynamic boundary), NOT the LIGHT static barrel — only its TYPES are
 *       re-exported statically (erased). BITE: add a static runtime export to the
 *       barrel → proof:boundary would red; this clause guards the wiring shape.
 *
 *   test-locks     — `test/ingest.test.ts` carries the per-clause born-RED
 *       replay-equality asserts. BITE: delete a lock → reds.
 *
 * Mirrors proof:diagnostics-channel / proof:roundtrip-fidelity: exits 1 on any
 * residual. The replay-equality VALUE proof is the vitest step; this script is
 * the source-shape lock that keeps the surface from drifting.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/**
 * Strip line + block comments so a NO-WORKAROUND scan reads CODE, not the
 * prose that NAMES the forbidden pattern (e.g. "reconstructs from the CSSOM
 * rule, NOT `getAnimations().getKeyframes()`"). A faithful spec documents the
 * anti-pattern; the scan must not red on the documentation of it.
 */
const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

// `file` may be ONE path or an ARRAY of paths (the K-close decomposition split
// ingest.ts at the CSSOM-walk vs adopt/handoff seam into `ingest.ts` +
// `ingest-cssom.ts`; the surface contract bites over the colocated PAIR, the
// SAME code, now relocated). When an array, the anchors are sought across the
// CONCATENATED sources — no clause is weakened, only the sweep follows the split.
const requireAll = (clause, file, anchors) => {
    const files = Array.isArray(file) ? file : [file];
    const present = files.filter((f) => existsSync(join(root, f)));
    if (present.length === 0) {
        fail(
            clause,
            `${files.join(" + ")} does not exist — the ingest surface is ABSENT.`,
        );
        return;
    }
    const src = present.map((f) => read(f)).join("\n");
    const label = files.join(" + ");
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${label} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${label} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log(
    "proof:ingest-replay — K.W8 (the round-trip pointed FORWARD at the live web)",
);

// The K-close decomposition split the ingest surface at the CSSOM-walk vs the
// adopt/handoff seam: the STYLESHEET walk (resolveLiveKeyframes / fromStyleSheets
// / fromLiveAnimations + the cssRules/CORS/fromString machinery) lives in
// `ingest-cssom.ts`; the mid-flight TEMPORAL takeover (adoptRunning + the
// continuity seed) lives in `ingest.ts`, which re-exports the walk surface. The
// source-shape contract bites over the colocated PAIR (the SAME code, relocated).
const INGEST = "src/animation/ingest.ts";
const INGEST_CSSOM = "src/animation/ingest-cssom.ts";
const INGEST_SURFACE = [INGEST, INGEST_CSSOM];
const INDEX = "src/animation/index.ts";
// L close (`fix(tranche-L close): the gate-suite roster reconciliation`)
// extracted `loadAnimationEngine` + its dynamic `import("./…")` edges and the
// engine-surface runtime assigns out of `index.ts` into `load-engine.ts` (a new
// module the barrel re-exports `loadAnimationEngine` from). The ingest dynamic
// import + the `fromStyleSheets/adoptRunning: ingestMod.…` assigns now live
// there; the barrel keeps ONLY the erased type re-export.
const LOAD_ENGINE = "src/animation/load-engine.ts";
const ENGINE = "src/animation/engine.ts";
const ADAPTER = "src/animation/adapter.ts";
const TEST = "test/ingest.test.ts";

// Read the concatenated ingest surface (the split PAIR) for the inline
// NO-WORKAROUND scans below (they must read the SAME code the requireAll
// anchors do, now spread across the two colocated files).
const readSurface = () =>
    INGEST_SURFACE.filter((f) => existsSync(join(root, f)))
        .map((f) => read(f))
        .join("\n");
const surfaceExists = () =>
    INGEST_SURFACE.some((f) => existsSync(join(root, f)));

// ── module-exists — the K1/K2 surface ─────────────────────────────────────────
requireAll("module-exists", INGEST_SURFACE, [
    {
        name: "export fromStyleSheets",
        re: /export\s+const\s+fromStyleSheets\b/,
    },
    {
        name: "export fromLiveAnimations",
        re: /export\s+const\s+fromLiveAnimations\b/,
    },
    {
        name: "export resolveLiveKeyframes",
        re: /export\s+const\s+resolveLiveKeyframes\b/,
    },
    { name: "export adoptRunning", re: /export\s+const\s+adoptRunning\b/ },
]);

// ── reuses-resolve — the parse pipeline is REUSED WHOLE (no re-derivation) ─────
requireAll("reuses-resolve", INGEST_SURFACE, [
    {
        name: "feeds rule.cssText into CSSKeyframesAnimation.fromString",
        re: /\.fromString\(/,
    },
    {
        name: "imports CSSKeyframesAnimation from ./engine (the reused engine)",
        re: /import\s*\{[\s\S]*?CSSKeyframesAnimation[\s\S]*?\}\s*from\s*["']\.\/engine["']/,
    },
    {
        name: "reads rule.cssText (the CSSOM serialize the engine already eats)",
        re: /\.cssText\b/,
    },
]);
{
    // NO-WORKAROUND: the ingest must NOT re-author a parser. A direct
    // `parseCSSStylesheet`/`parseCSSValueUnit` call inside ingest.ts would be a
    // re-derivation that forfeits the round-trip — the bridge is `fromString`
    // (which owns `resolveKeyframes`), never a parallel parse.
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        if (/parseCSSStylesheet\s*\(|parseCSSValueUnit\s*\(/.test(src)) {
            fail(
                "reuses-resolve",
                `${INGEST} calls a value.js parser directly — the ingest must REUSE the engine's fromString→resolveKeyframes pipeline WHOLE, never re-derive (the moat-loss the mandate forbids).`,
            );
        } else {
            ok(
                "reuses-resolve",
                "no direct value.js parser call in ingest.ts (the pipeline is reused via fromString, not re-derived)",
            );
        }
    }
}

// ── cssom-walk — reads styleSheets/cssRules + filters @keyframes ──────────────
requireAll("cssom-walk", INGEST_SURFACE, [
    { name: "reads .cssRules (the CSSOM walk)", re: /\.cssRules\b/ },
    {
        name: "filters CSSKeyframesRule (instanceof or type 7)",
        re: /CSSKeyframesRule|KEYFRAMES_RULE|===\s*7\b/,
    },
    { name: "walks styleSheets", re: /styleSheets\b/ },
]);

// ── cors-honest — per-sheet try/catch → CORS_SKIP, never a silent drop ────────
requireAll("cors-honest", INGEST_SURFACE, [
    {
        name: "a CORS_SKIP diagnostic row is emitted",
        re: /["']CORS_SKIP["']/,
    },
    {
        name: "the cssRules read is guarded by try/catch",
        re: /try\s*\{[\s\S]*?\.cssRules[\s\S]*?\}\s*catch/,
    },
]);

// ── adopt-runtime — getAnimations playhead + CSSOM-rule reconstruction + seed ─
requireAll("adopt-runtime", INGEST_SURFACE, [
    {
        name: "adoptRunning reads getAnimations() for the playhead",
        re: /getAnimations\(\)/,
    },
    {
        name: "reconstructs from the CSSOM rule via resolveLiveKeyframes (NOT getKeyframes)",
        re: /resolveLiveKeyframes\s*</,
    },
    {
        name: "reads the captured currentTime (the continuity seed)",
        re: /currentTime\b/,
    },
    {
        name: "the commit-on-ADOPT paints the current frame inline (interpFrames)",
        re: /interpFrames\(/,
    },
]);
{
    // NO-WORKAROUND: K2 must NOT read the keyframe SOURCE from getAnimations() —
    // the computed getKeyframes() form has lost var()/cqw/oklab. A getKeyframes()
    // call as the KEYFRAME source is the moat-loss; reconstruction rides the
    // CSSOM rule (resolveLiveKeyframes). getAnimations() is the playhead only.
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        if (/\.getKeyframes\s*\(/.test(src)) {
            fail(
                "adopt-runtime",
                `${INGEST} calls getKeyframes() — K2 must reconstruct from the CSSOM @keyframes RULE (the authored form), never the computed keyframe list (which has lost var()/cqw/oklab).`,
            );
        } else {
            ok(
                "adopt-runtime",
                "no getKeyframes() keyframe-source read (reconstruction rides the CSSOM rule; getAnimations() is the playhead only)",
            );
        }
    }
}

// ── adopt-distinct — adoptRunning, NOT adopt(); adoptCompiled untouched ───────
{
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        // The method is named `adoptRunning` (the HAZARD-1 distinct name).
        const hasRunning = /\badoptRunning\b/.test(src);
        // It does NOT define/export a bare `adopt` that would conflate with the
        // shipped engine.ts adoptCompiled.
        const definesBareAdopt =
            /export\s+const\s+adopt\b(?!Running|Compiled)/.test(src);
        if (!hasRunning || definesBareAdopt) {
            fail(
                "adopt-distinct",
                `${INGEST}: adoptRunning present=${hasRunning}, bare adopt export=${definesBareAdopt} — the takeover MUST be named adoptRunning to disambiguate from engine.ts adoptCompiled (HARDENING-5 HAZARD-1).`,
            );
        } else {
            ok(
                "adopt-distinct",
                "the takeover is named adoptRunning (distinct from the shipped adoptCompiled)",
            );
        }
    }
    // engine.ts adoptCompiled is UNTOUCHED by this wave (the naming contract, not
    // a co-edit) — assert it still exists.
    requireAll("adopt-distinct", ENGINE, [
        {
            name: "engine.ts adoptCompiled is untouched (still present)",
            re: /adoptCompiled\(/,
        },
    ]);
}

// ── barrel-heavy — the ingest runtime rides loadAnimationEngine, types erased ─
// The dynamic import + the engine-surface assigns live in the load-engine module
// the barrel re-exports `loadAnimationEngine` from; the erased TYPE re-export
// stays on the barrel itself.
requireAll("barrel-heavy", LOAD_ENGINE, [
    {
        name: "the ingest module is dynamically imported in loadAnimationEngine",
        re: /import\(["']\.\/ingest["']\)/,
    },
    {
        name: "fromStyleSheets is merged onto the heavy engine surface",
        re: /fromStyleSheets:\s*ingestMod\.fromStyleSheets/,
    },
    {
        name: "adoptRunning is merged onto the heavy engine surface",
        re: /adoptRunning:\s*ingestMod\.adoptRunning/,
    },
]);
requireAll("barrel-heavy", INDEX, [
    {
        name: "the ingest TYPES are re-exported (erased — no static value.js edge)",
        re: /export\s+type\s*\{[\s\S]*?IngestResult[\s\S]*?\}\s*from\s*["']\.\/ingest["']/,
    },
]);
{
    // The ingest must NOT have a STATIC runtime export on the barrel surface
    // (that would pull value.js into the LIGHT graph — proof:boundary would
    // red). Only the dynamic merge + the erased types are allowed — on EITHER
    // the barrel or the load-engine module.
    const staticRuntimeRe =
        /export\s*\{\s*(?:fromStyleSheets|fromLiveAnimations|resolveLiveKeyframes|adoptRunning)\b[^}]*\}\s*from\s*["']\.\/ingest["']/;
    if (existsSync(join(root, INDEX)) && existsSync(join(root, LOAD_ENGINE))) {
        const staticRuntime =
            staticRuntimeRe.test(stripComments(read(INDEX))) ||
            staticRuntimeRe.test(stripComments(read(LOAD_ENGINE)));
        if (staticRuntime) {
            fail(
                "barrel-heavy",
                `the barrel surface statically re-exports an ingest RUNTIME value — the ingest is HEAVY (value.js-bearing) and must ride loadAnimationEngine(), never the LIGHT static barrel (proof:boundary).`,
            );
        } else {
            ok(
                "barrel-heavy",
                "no static ingest runtime export on the barrel (the HEAVY surface rides loadAnimationEngine; only types are erased-exported)",
            );
        }
    }
}

// ── test-locks — the per-clause born-RED replay-equality asserts ──────────────
requireAll("test-locks", TEST, [
    {
        name: "clause (a) replay-equality: the kf sample equals the source interp",
        re: /SAMPLES equal to the source linear interp/,
    },
    {
        name: "clause (b) byte-faithful: re-serialise to a template-equivalent",
        re: /re-serialises to a template-equivalent/,
    },
    {
        name: "clause (c) flash-free: seeds at the captured currentTime, NOT zero",
        re: /seeds at the captured currentTime, NOT at zero/,
    },
    {
        name: "clause (d) CORS skip is a CORS_SKIP diagnostic row",
        re: /toContain\(["']CORS_SKIP["']\)|d\.code\s*===\s*["']CORS_SKIP["']/,
    },
]);

// ═══════════════════════════════════════════════════════════════════════════════
// L.W3 — Ingest deepening: five NEW arms appended to this EXISTING gate (no new
// package.json proof:* key). Each clause is BORN-RED on today's UNCURED tree —
// its anchor regex does NOT match the current source — and greens ONLY when its
// S-clause cures. The eight K.W8 clauses + these five = TWELVE; the wave exits
// on `proof:ingest-replay` GREEN over all twelve. See docs/tranches/L/waves/L.W3.md.
//
// ANTI-VACUOUS: each anchor below names a CURE-ONLY symbol the pre-cure source
// provably lacks (verified by grep against today's tree before authoring). A
// clause that matched today would be vacuous — the anchor is the bite.
// ═══════════════════════════════════════════════════════════════════════════════

// ── S1 delay-reset — seedAtTime strips the source delay before onStart() ──────
// RED today: `seedAtTime` (ingest.ts) calls `animation.onStart()` with no delay
// reset; when options.delay > 0 the delay branch sets paused=true and the
// takeover freezes. The cure resets the delay to 0 BEFORE onStart() — via
// `setDelay(0)` or `options.delay = 0` INSIDE seedAtTime's body. The anchor
// requires that reset to appear; today neither token exists in ingest.ts.
{
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        // The reset must live in seedAtTime (the takeover-only strip), not as a
        // reconstruction-time option (the sibling rule preserves the declared
        // delay for serialization symmetry). We require the seedAtTime body — the
        // span from `const seedAtTime` to the file end — to carry the reset.
        const seedIdx = src.indexOf("seedAtTime");
        const seedBody = seedIdx >= 0 ? src.slice(seedIdx) : "";
        const hasReset =
            /setDelay\(\s*0\s*\)/.test(seedBody) ||
            /options\.delay\s*=\s*0\b/.test(seedBody);
        if (!hasReset) {
            fail(
                "delay-reset",
                `${INGEST}: seedAtTime does NOT reset the source delay to 0 before onStart() ` +
                    `(no setDelay(0) | options.delay = 0 in its body) — a takeover of an animation ` +
                    `with animation-delay > 0 freezes (onStart's delay branch leaves paused=true). ` +
                    `The mid-flight takeover MUST strip the delay (the native side already elapsed it).`,
            );
        } else {
            ok(
                "delay-reset",
                "seedAtTime resets the source delay to 0 before onStart() (the takeover is a mid-flight continuation, not a re-delayed start)",
            );
        }
    } else {
        fail("delay-reset", `${INGEST} does not exist — the ingest surface is ABSENT.`);
    }
}

// ── nested-walk — walkSheet descends into CSSGroupingRule for nested @keyframes ─
// RED today: `walkSheet` (ingest-cssom.ts) is a flat loop — a single `.cssRules`
// access at the CALLER (resolveLiveKeyframes); walkSheet itself never re-reads
// `.cssRules` and never recurses. The cure descends into grouping rules: a
// SECOND `.cssRules` access INSIDE walkSheet AND a recursive `walkSheet(` call.
// The anchors require the cure-only recursion tokens; today walkSheet has zero
// recursive self-call and zero inner `.cssRules` read.
{
    if (existsSync(join(root, INGEST_CSSOM))) {
        const src = stripComments(read(INGEST_CSSOM));
        const walkIdx = src.indexOf("const walkSheet");
        // Bound the search to the walkSheet body (up to the next top-level const).
        const afterWalk = walkIdx >= 0 ? src.slice(walkIdx) : "";
        const nextConstIdx = afterWalk.search(/\nconst\s+\w+\s*=/);
        const walkBody =
            walkIdx >= 0
                ? nextConstIdx > 0
                    ? afterWalk.slice(0, nextConstIdx)
                    : afterWalk
                : "";
        // The recursive descent: walkSheet calls itself on a grouping rule's
        // .cssRules (the cure idiom). Require BOTH the self-call AND a CSSGrouping
        // structural test (a .cssRules read inside the body, not just the caller).
        const recurses = /\bwalkSheet\s*</.test(walkBody) || /\bwalkSheet\s*\(/.test(walkBody);
        const innerCssRules = /\.cssRules\b/.test(walkBody);
        if (!recurses || !innerCssRules) {
            fail(
                "nested-walk",
                `${INGEST_CSSOM}: walkSheet does NOT descend into CSSGroupingRule ` +
                    `(recursive walkSheet call present=${recurses}, inner .cssRules read present=${innerCssRules}) — ` +
                    `a @keyframes inside @media/@supports/@layer/@container is silently absent ` +
                    `(zero diagnostics, empty Map — the forbidden silent-absent class). The walk ` +
                    `MUST recurse into grouping rules (bounded depth guard).`,
            );
        } else {
            ok(
                "nested-walk",
                "walkSheet descends recursively into CSSGroupingRule (nested @keyframes inside @media/@supports/@layer/@container are reconstructed)",
            );
        }
    } else {
        fail(
            "nested-walk",
            `${INGEST_CSSOM} does not exist — the ingest surface is ABSENT.`,
        );
    }
}

// ── adopt-refuse — ADOPT_REFUSE distinguishes an ingest refusal from WAAPI-API ─
// RED today: `DiagnosticCode` (adapter.ts) has NO "ADOPT_REFUSE" entry; both
// refuse paths in ingest.ts emit "WAAPI_INELIGIBLE". The cure adds the code to
// the type AND uses it in ingest.ts for the ingest-domain refusal. Two anchors:
// the type carries it (adapter.ts) AND it is emitted (ingest.ts).
requireAll("adopt-refuse", ADAPTER, [
    {
        name: 'DiagnosticCode carries the "ADOPT_REFUSE" entry (the new ingest-domain code)',
        re: /["']ADOPT_REFUSE["']/,
    },
]);
{
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        if (!/["']ADOPT_REFUSE["']/.test(src)) {
            fail(
                "adopt-refuse",
                `${INGEST}: the "no running animation by that name" / "rule not reconstructed" ` +
                    `refusal does NOT emit "ADOPT_REFUSE" — it is conflated with "WAAPI_INELIGIBLE" ` +
                    `(a genuine WAAPI-API absence), forcing consumers to scrape the message string to ` +
                    `tell the branches apart (violates the stable-code, never-scrape-message contract).`,
            );
        } else {
            ok(
                "adopt-refuse",
                'adoptRunning emits "ADOPT_REFUSE" for the ingest-domain refusal (distinct from the WAAPI-API-absent "WAAPI_INELIGIBLE")',
            );
        }
    } else {
        fail("adopt-refuse", `${INGEST} does not exist — the ingest surface is ABSENT.`);
    }
}

// ── shadow-walk — resolveLiveKeyframes walks a ShadowRoot's stylesheets ────────
// RED today: the source-resolution block (ingest-cssom.ts) handles
// null / Array / Document only — NO ShadowRoot branch. The cure adds a
// ShadowRoot branch collecting `styleSheets` + `adoptedStyleSheets`. The anchors
// require BOTH the `ShadowRoot` token AND `adoptedStyleSheets`; today neither
// appears anywhere in the ingest surface (verified: zero hits pre-cure).
requireAll("shadow-walk", INGEST_SURFACE, [
    {
        name: "the source-resolution block handles a ShadowRoot source",
        re: /\bShadowRoot\b/,
    },
    {
        name: "the ShadowRoot branch collects adoptedStyleSheets (Baseline 2023)",
        re: /\badoptedStyleSheets\b/,
    },
]);

// ── scroll-time — adoptRunning resolves a scroll-driven CSSUnitValue currentTime ─
// RED today: the currentTime extraction (ingest.ts) accepts ONLY
// `typeof rawTime === "number"` — a CSSUnitValue ({value, unit: "percent"})
// from a scroll-driven CSSAnimation defaults silently to 0. The cure branches on
// the CSSUnitValue shape (unit === "percent"). The anchor requires a
// `percent` / `CSSUnitValue` branch in ingest.ts; today neither token exists.
{
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        const hasScrollBranch =
            /\bCSSUnitValue\b/.test(src) ||
            /["']percent["']/.test(src) ||
            /\.unit\s*===\s*["']percent["']/.test(src);
        if (!hasScrollBranch) {
            fail(
                "scroll-time",
                `${INGEST}: the currentTime extraction has NO CSSUnitValue/"percent" branch — ` +
                    `a scroll-driven CSSAnimation's currentTime ({value, unit: "percent"}) is not a ` +
                    `number, so it defaults silently to 0 (the takeover jumps the scroll target to ` +
                    `position 0 — the flash the continuity seed exists to prevent). The extraction ` +
                    `MUST branch on the CSSUnitValue percent shape and seed from the scroll percentage.`,
            );
        } else {
            ok(
                "scroll-time",
                'adoptRunning resolves a scroll-driven CSSUnitValue ("percent") currentTime (the scroll percentage seeds the playhead, never a silent default-to-0)',
            );
        }
    } else {
        fail("scroll-time", `${INGEST} does not exist — the ingest surface is ABSENT.`);
    }
}

// ── test-locks-w3 — the five L.W3 born-RED value asserts are present ──────────
requireAll("test-locks-w3", TEST, [
    {
        name: "S1 lock: a takeover with animation-delay advances past the seeded time",
        re: /advances past the seeded time/,
    },
    {
        name: "S2 lock: a @keyframes inside @media is reconstructed (recursive descent)",
        re: /the recursive descent/,
    },
    {
        name: "S3 lock: a name not present refuses with ADOPT_REFUSE",
        re: /refuses with ADOPT_REFUSE/,
    },
    {
        name: "S4 lock: a @keyframes in a ShadowRoot's adoptedStyleSheets is reconstructed",
        re: /in a ShadowRoot's adoptedStyleSheets is reconstructed/,
    },
    {
        name: "S5 lock: a CSSUnitValue percent currentTime is NOT silently defaulted to 0",
        re: /CSSUnitValue percent currentTime is NOT silently defaulted to 0/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:ingest-replay — FAIL: the forward-direction replay-equality\n" +
            "surface is not fully wired:\n" +
            failures.join("\n") +
            "\n\n  K.W8 ships `src/animation/ingest.ts` (the CSSOM walk + adoptRunning),\n" +
            "  reuses `resolveKeyframes` WHOLE (never a re-derived emitter), reports a\n" +
            "  cross-origin sheet as a CORS_SKIP diagnostic (never a silent drop),\n" +
            "  seeds adoptRunning at the captured currentTime (never seed-at-zero), and\n" +
            "  rides loadAnimationEngine (HEAVY, never the LIGHT barrel). Restore the\n" +
            "  clause each anchor names. The replay-equality VALUE proof rides\n" +
            "  `vitest run test/ingest.test.ts`.",
    );
    process.exit(1);
}
console.log(
    "proof:ingest-replay — PASS: the ingest surface (fromStyleSheets /\n" +
        "fromLiveAnimations / resolveLiveKeyframes / adoptRunning) walks the CSSOM,\n" +
        "reuses the engine's fromString→resolveKeyframes pipeline WHOLE, reports\n" +
        "every cross-origin skip as a CORS_SKIP diagnostic, seeds the takeover at\n" +
        "the captured currentTime (the continuity seed), and rides\n" +
        "loadAnimationEngine (HEAVY). The replay-equality VALUE proof rides\n" +
        "`vitest run test/ingest.test.ts`.",
);
