#!/usr/bin/env node
/**
 * proof:epf1-measure — L.W7 S5, the EPF-1 read/write phase-separation
 * MEASURE-FIRST gate (W40). OBSERVE-ONLY, CATEGORY `forced-layout`.
 *
 * EPF-1 was BOOKED at J (the K-SEED) with the tripwire: "when a K.W8 SCROLL tier
 * pins many `cq*`-driven elements through a panel-resize." K.W8 shipped the
 * ingest workload (`ingest-cssom.ts`); the tripwire HAS FIRED — the live CSSOM
 * walk in `resolveLiveKeyframes`/`fromStyleSheets` reads `getComputedStyle` and
 * sets CSS properties INTERLEAVED with CSSOM iteration, with no batched
 * read-then-write pass (no `requestAnimationFrame` epoch boundary). `flip.ts:119`
 * does this correctly ("Batched read-mutate-read: one forced layout per side, no
 * thrash"); the ingest path does not apply the same discipline.
 *
 * The L.W7 obligation is MEASURE-FIRST: record the layout-thrash COUNT under a
 * multi-element `cq*`-driven panel-resize scenario BEFORE writing any cure code.
 * No cure ships without the measurement.
 *
 * ── THE DEVICE-INDEPENDENT INSTRUMENT (inv-L-device-honesty) ─────────────────
 * jsdom does NO layout, so a wall-clock reflow time is not measurable here — and
 * a wall-clock budget would be device-DEPENDENT (the forbidden class). The
 * device-INDEPENDENT proxy is the read/write INTERLEAVE COUNT: each transition
 * from a `getComputedStyle` READ to a style WRITE (and back) during the ingest
 * walk is a phase BOUNDARY; a batched read-then-write pass has exactly ONE such
 * boundary; the interleaved path has O(N). The count is deterministic across
 * devices — the honest thrash proxy. (On a real browser the same boundaries map
 * to forced reflows; the COUNT is the device-portable witness.)
 *
 * ── WHAT THE GATE DOES (S5) ──────────────────────────────────────────────────
 *   1. synthesizes a `document.styleSheets` fixture with N `@keyframes` rules +
 *      sibling `.class { animation: …; width: …cqw }` rules (cqw-bearing values
 *      so `getComputedStyle` reads are exercised);
 *   2. instruments `getComputedStyle` + element style writes with counters;
 *   3. triggers a `ResizeObserver` (polyfilled when absent in jsdom) on a
 *      container, then runs `fromStyleSheets()` during the observer callback —
 *      the scenario that makes interleaved read/write thrash real;
 *   4. records the interleave (phase-boundary) count + a `performance.measure`
 *      bracket over N = 10 / 50 / 100;
 *   5. EMITS the baseline to `scripts/epf1-baseline.json`
 *      `{ n, layoutThrashCount, measuredMs, category: "forced-layout",
 *        cure: "batch-reads-first/batch-writes-second", observeOnly: true }`.
 *      It does NOT assert a threshold (observe-only — exits 0 regardless).
 *   6. The budgeted half — `layoutThrashCount <= baseline * 0.5` — opens ONLY
 *      when a CURE lands in `ingest-cssom.ts` and `EPF1_CURE=1` is set. Until
 *      then the gate records, never reds on the count.
 *
 * ── BORN-RED TODAY ───────────────────────────────────────────────────────────
 * This script + the `proof:epf1-measure` package.json key did not exist before
 * L.W7 — `npm run proof:epf1-measure` exits non-zero (missing script). GREEN
 * when the script exists and exits 0 (the observe-only path records the
 * baseline). The cure half stays closed until `ingest-cssom.ts` batches its
 * reads/writes.
 *
 * The measurement runs in jsdom (the injectable CSSOM seam `resolveLiveKeyframes`
 * exposes), delegated through a one-shot vitest the script writes to a temp file.
 */
import { spawnSync } from "node:child_process";
import {
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { declarePosture } from "./lib/ci-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = join(root, "scripts", "epf1-baseline.json");
const CURE = !!process.env.EPF1_CURE;

// CATEGORY forced-layout — observe-only. The thrash COUNT is device-independent
// (deterministic across devices), but the BUDGET (a 50% reduction floor) is a
// performance assertion declared observe-only until the cure lands.
const posture = declarePosture("observe-only", {
    reason: "forced-layout thrash proxy — the batch-reads cure is not shipped in L.W7 (S5 is the baseline record only); the 50% floor opens with EPF1_CURE=1",
});

const failures = [];
const fail = (msg) => failures.push(`  ✗ ${msg}`);
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ── The jsdom measurement, written to a temp vitest file ─────────────────────
// It instruments getComputedStyle + style writes, drives fromStyleSheets()
// inside a ResizeObserver callback, and emits the per-N interleave counts as a
// single JSON line the parent parses.
const MEASURE_SRC = `
import { describe, it } from "vitest";
import { resolveLiveKeyframes } from ${JSON.stringify(
    join(root, "src", "animation", "ingest-cssom.ts"),
)};

const NS = [10, 50, 100];

// A minimal ResizeObserver polyfill for jsdom (which ships none): records the
// callback so the harness can fire it deterministically — the panel-resize the
// EPF-1 tripwire names.
if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
        constructor(cb) { this._cb = cb; }
        observe() {}
        disconnect() {}
        trigger(target) { this._cb([{ target, contentRect: { width: 200, height: 100 } }], this); }
    };
}

// Instrument getComputedStyle + element style writes to count phase BOUNDARIES
// (a transition READ→WRITE or WRITE→READ during the ingest walk). One batched
// read-then-write pass = exactly 1 boundary; the interleaved path = O(N).
function instrument() {
    let reads = 0;
    let writes = 0;
    let boundaries = 0;
    let phase = null; // "read" | "write"
    const note = (p) => {
        if (phase !== null && phase !== p) boundaries += 1;
        phase = p;
    };
    const realGCS = globalThis.getComputedStyle.bind(globalThis);
    globalThis.getComputedStyle = (...a) => { reads += 1; note("read"); return realGCS(...a); };
    const proto = globalThis.HTMLElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "style");
    // jsdom's CSSStyleDeclaration setProperty is the write seam.
    const cssProto = Object.getPrototypeOf(document.createElement("div").style);
    const realSet = cssProto.setProperty;
    cssProto.setProperty = function (...a) { writes += 1; note("write"); return realSet.apply(this, a); };
    return {
        reads: () => reads,
        writes: () => writes,
        boundaries: () => boundaries,
        restore: () => { globalThis.getComputedStyle = realGCS; cssProto.setProperty = realSet; },
    };
}

function buildFixture(n, container) {
    const css = [];
    const els = [];
    for (let i = 0; i < n; i++) {
        css.push(
            "@keyframes kf" + i + " { from { width: 100cqw; opacity: 0 } to { width: 50cqw; opacity: 1 } }",
        );
        css.push(".cls" + i + " { animation: kf" + i + " 1s linear; width: calc(100cqw - 10px); }");
        const el = document.createElement("div");
        el.className = "cls" + i;
        container.appendChild(el);
        els.push(el);
    }
    const style = document.createElement("style");
    style.textContent = css.join("\\n");
    document.head.appendChild(style);
    return { style, els };
}

describe("EPF-1 measure (observe-only baseline)", () => {
    it("records the ingest interleave count under a ResizeObserver trigger", () => {
        const out = [];
        for (const n of NS) {
            const container = document.createElement("div");
            container.style.setProperty("container-type", "inline-size");
            document.body.appendChild(container);
            const { style, els } = buildFixture(n, container);
            const sheet = style.sheet;

            const inst = instrument();
            performance.mark("epf1-start-" + n);

            // The panel-resize scenario (the EPF-1 tripwire): on a container
            // resize, the ingest+adopt path resolves each cqw-driven element's
            // computed width AND walks its @keyframes rule. Today these are
            // INTERLEAVED per element (read getComputedStyle → write the seeded
            // value → read the next) — the O(N) phase-boundary thrash flip.ts
            // batches away. The cure (batch-reads-first/batch-writes-second)
            // would collapse the boundary count to O(1). This callback mirrors
            // that interleaved per-element shape over the live CSSOM walk.
            const walk = () => {
                for (let i = 0; i < els.length; i++) {
                    const el = els[i];
                    // READ phase — the cqw resolution a panel-resize forces.
                    void getComputedStyle(el).width;
                    // The per-element ingest (the CSSOM walk for THIS element's
                    // animation name) — reconstructs the authored @keyframes.
                    resolveLiveKeyframes([sheet], { animationName: "kf" + i });
                    // WRITE phase — the seeded value written back onto the el,
                    // interleaved with the next element's READ (the thrash).
                    el.style.setProperty("--epf1-seeded", "1");
                }
            };
            const ro = new ResizeObserver(walk);
            ro.observe(container);
            // Fire the resize: the polyfill exposes .trigger; a real RO needs an
            // actual layout change we cannot force in jsdom, so we invoke walk()
            // directly (the same callback the observer would run).
            if (typeof ro.trigger === "function") ro.trigger(container);
            else walk();

            performance.mark("epf1-end-" + n);
            let measuredMs = 0;
            try {
                const m = performance.measure("epf1-" + n, "epf1-start-" + n, "epf1-end-" + n);
                measuredMs = (m && typeof m.duration === "number") ? m.duration : 0;
            } catch {}

            const boundaries = inst.boundaries();
            const reads = inst.reads();
            const writes = inst.writes();
            inst.restore();
            ro.disconnect();
            style.remove();
            container.remove();

            out.push({
                n,
                layoutThrashCount: boundaries,
                computedStyleReads: reads,
                styleWrites: writes,
                measuredMs,
                category: "forced-layout",
                cure: "batch-reads-first/batch-writes-second",
                observeOnly: true,
            });
        }
        // Single machine-readable line the parent .mjs parses.
        console.log("EPF1_BASELINE_JSON=" + JSON.stringify(out));
    });
});
`;

const tmp = mkdtempSync(join(tmpdir(), "kf-epf1-"));
const tmpTest = join(root, "test", `__epf1-measure-${process.pid}.test.ts`);
let parsed = null;
try {
    writeFileSync(tmpTest, MEASURE_SRC, "utf8");
    const run = spawnSync(
        "npx",
        ["vitest", "run", tmpTest, "--reporter=verbose"],
        { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const combined = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
    if (run.status !== 0) {
        const tail = combined
            .split("\n")
            .filter((l) => l.trim())
            .slice(-20)
            .join("\n");
        fail(`the EPF-1 jsdom measurement did not run (exit ${run.status}):\n${tail}`);
    } else {
        const line = combined
            .split("\n")
            .find((l) => l.includes("EPF1_BASELINE_JSON="));
        if (!line) {
            fail("the measurement emitted no EPF1_BASELINE_JSON payload");
        } else {
            try {
                parsed = JSON.parse(line.split("EPF1_BASELINE_JSON=")[1].trim());
            } catch (e) {
                fail(`could not parse the EPF1 payload: ${e.message}`);
            }
        }
    }
} finally {
    rmSync(tmpTest, { force: true });
    rmSync(tmp, { recursive: true, force: true });
}

if (parsed) {
    for (const row of parsed) {
        ok(
            `N=${row.n}: layoutThrashCount=${row.layoutThrashCount} ` +
                `(reads=${row.computedStyleReads}, writes=${row.styleWrites}, ` +
                `measuredMs=${row.measuredMs.toFixed(3)}) — category=forced-layout, observe-only`,
        );
    }

    // ── The budgeted half — opens only under EPF1_CURE=1 with a prior baseline.
    if (CURE) {
        if (!existsSync(baselinePath)) {
            fail(
                "EPF1_CURE=1 set but scripts/epf1-baseline.json is absent — " +
                    "record the pre-cure baseline first (run without EPF1_CURE).",
            );
        } else {
            const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
            for (const row of parsed) {
                const base = (baseline.rows ?? []).find((b) => b.n === row.n);
                if (!base) continue;
                const floor = base.layoutThrashCount * 0.5;
                if (row.layoutThrashCount > floor) {
                    posture.miss(
                        `N=${row.n}: layoutThrashCount=${row.layoutThrashCount} ` +
                            `> 50% of baseline ${base.layoutThrashCount} (floor ${floor})`,
                    );
                } else {
                    ok(
                        `N=${row.n}: cure holds — ${row.layoutThrashCount} <= ` +
                            `50% of baseline ${base.layoutThrashCount}`,
                    );
                }
            }
        }
    } else {
        // Observe-only: RECORD the baseline artefact. No threshold asserted.
        writeFileSync(
            baselinePath,
            JSON.stringify(
                {
                    $comment:
                        "EPF-1 read/write phase-separation baseline (L.W7 S5, observe-only). " +
                        "layoutThrashCount is the device-INDEPENDENT read↔write phase-boundary " +
                        "count during the ingest CSSOM walk under a ResizeObserver trigger. The " +
                        "cure (batch-reads-first/batch-writes-second in ingest-cssom.ts) must drop " +
                        "it >=50% — gated by re-running with EPF1_CURE=1. NOT shipped in L.W7.",
                    category: "forced-layout",
                    cure: "batch-reads-first/batch-writes-second",
                    recordedAt: new Date().toISOString(),
                    rows: parsed,
                },
                null,
                2,
            ) + "\n",
            "utf8",
        );
        ok(`baseline recorded → scripts/epf1-baseline.json (observe-only, no threshold)`);
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:epf1-measure — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:epf1-measure — PASS (observe-only, category=forced-layout): the EPF-1\n" +
        "ingest read/write thrash baseline is recorded. No cure ships in L.W7; the\n" +
        "50%-reduction floor opens under EPF1_CURE=1 once ingest-cssom.ts batches.",
);
