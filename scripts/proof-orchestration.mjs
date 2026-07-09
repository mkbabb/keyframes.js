#!/usr/bin/env node
/**
 * proof:orchestration — the F.W3 orchestration-tier coverage gate.
 *
 * The E.W10 orchestration tier (stagger / flip / drag+decay / Sequence) shipped
 * as the highest-profile new public API but with the WEAKEST gate posture: every
 * OTHER E surface got a named biting gate (`proof:engine-correctness`,
 * `proof:standalone-zero-alloc`, `proof:compile-deterministic`,
 * `proof:platform-adopt`), yet the orchestration BEHAVIOUR ran only under the
 * bare `vitest run` tail of `proof:all` — no named `proof-*.mjs` referenced it
 * (a-tranche-retro-F §3.1: the single biggest gate-quality gap from E).
 *
 * The orchestration unit tests are SOTA-honest (a-test-quality §0) — the gap is
 * the absence of a NAMED instrument, not the bite. So this gate does NOT
 * re-implement the behaviour assertions; it CHAINS them as a named clause-set
 * (the F.W3 §Design-decision 1 posture). It is a SOURCE-GREP gate in the style
 * of `proof:engine` / `proof:platform-adopt`: it asserts each orchestration
 * behaviour clause is LOCKED by a live test assertion, and it BITES if a clause
 * test is deleted — delete the FLIP-identity assert, or the decayRest analytic,
 * or the Sequence cursor map, and the matching clause reds.
 *
 * CLAUSES (each BITES on a deleted locking test):
 *
 *   stagger-distribution — the origin-weighted spread is locked: `from:'center'`
 *       symmetric about the zero origin, `from:'edges'` zero at both ends, a
 *       numeric `from` index as the zero origin. BITE: a uniform-delay test
 *       would not assert the symmetric/edges/index distribution — delete the
 *       distribution asserts → reds.
 *
 *   flip-rect — the rect first/last/invert/play identity is locked: the t=0
 *       inversion to the BEFORE rect, the t=1 landing at identity, and the
 *       one-mutate-between-two-measurements layout-thrash lock (mutateCalls === 1
 *       with exactly two measurements). BITE: a non-identity endpoint, or a
 *       second forced measurement, would not carry these asserts → reds.
 *
 *   decay-rest — the closed-form rest is locked: `decay` samples match the
 *       v0·e^(−kt) analytic to 9 places and `decayRest` returns the projected
 *       x0+v0/k endpoint without running the loop. BITE: a Euler-integrated drift
 *       off the closed form would not match the analytic assert → reds.
 *
 *   sequence-ordering — the add/label/seek/play boundary order is locked:
 *       auto-append starts at the running cursor, a label resolves to its
 *       registered position, seek maps the master clock onto each child's local
 *       clock, and play() drives via advanceTo to each segment's rest frame.
 *       BITE: a reordered or dropped boundary event would not carry the cursor /
 *       label / seek-map / play asserts → reds.
 *
 *   api-isolation — the two LIGHT public-API edges have ISOLATED locks
 *       (a-test-quality §3): `createNativeTimeline` returns the guard-absent
 *       fallback (null, no throw) when the native global is absent, and
 *       `toEasing` normalizes a callable / typed Easing to `{ fn, css? }`. BITE:
 *       delete the isolated public-API test → reds.
 *
 * Mirrors `proof:engine` / `proof:platform-adopt`: exits 1 on any residual. The
 * behaviour-equivalence itself is proven by the chained tests, run by the
 * `proof:all` tail (`vitest run`).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/**
 * Assert EVERY anchor pattern is present in `src` — each anchor is a
 * load-bearing test assertion (an `expect(...)` line or an `it(...)` behaviour
 * name), not a comment. The clause reds the moment ANY anchor goes missing
 * (delete the test → the grep reds), naming the missing lock.
 */
const requireAll = (clause, file, anchors) => {
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing the locking assertion(s): ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} behaviour is no longer gated.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} assertion(s)`);
    }
};

console.log("proof:orchestration — F.W3 (the orchestration tier, named-gated)");

// ── stagger-distribution — origin-weighted spread is locked ──────────────────
requireAll("stagger-distribution", "test/orchestration/stagger.test.ts", [
    {
        name: "from:'center' symmetric about the zero origin (delays[2] === 0; arms mirror)",
        re: /from:\s*"center"[\s\S]*?expect\(delays\[2\]\)\.toBe\(0\)[\s\S]*?expect\(delays\[0\]\)\.toBe\(delays\[4\]\)/,
    },
    {
        name: "from:'edges' zero at both ends, max in the middle",
        re: /from:\s*"edges"[\s\S]*?expect\(delays\[0\]\)\.toBe\(0\)[\s\S]*?expect\(delays\[4\]\)\.toBe\(0\)/,
    },
    {
        name: "from: numeric index uses that index as the zero origin (delays[1] === 0)",
        re: /from:\s*1\s*\}[\s\S]*?expect\(delays\[1\]\)\.toBe\(0\)/,
    },
]);

// ── flip-rect — first/last/invert/play identity + thrash lock ────────────────
requireAll("flip-rect", "test/orchestration/flip.test.ts", [
    {
        name: "t=0 inverts to the BEFORE rect (FLIP identity: tx === before.x − after.x)",
        re: /the FLIP identity[\s\S]*?expect\(tx\)\.toBeCloseTo\(before\.x\s*-\s*after\.x\)/,
    },
    {
        name: "t=1 lands at identity (the AFTER rect): tx→0, sx→1",
        re: /lands at identity[\s\S]*?expect\(tx\)\.toBeCloseTo\(0\)[\s\S]*?expect\(sx\)\.toBeCloseTo\(1\)/,
    },
    {
        name: "one mutate between exactly two measurements (layout-thrash lock)",
        re: /expect\(mutateCalls\)\.toBe\(1\)[\s\S]*?expect\(measurements\.length\)\.toBe\(2\)/,
    },
]);

// ── decay-rest — the v0·e^(−kt) closed form + projected rest endpoint ─────────
requireAll("decay-rest", "test/physics/drag.test.ts", [
    {
        name: "decay matches the x(t) = x0 + v0/k·(1 − e^(−kt)) analytic to 9 places",
        re: /x0\s*\+\s*\(v0\s*\/\s*k\)\s*\*\s*\(1\s*-\s*Math\.exp\(-k\s*\*\s*t\)\)[\s\S]*?expect\(sample\(t\)\.value\)\.toBeCloseTo\(expected,\s*9\)/,
    },
    {
        name: "decayRest returns the projected x0 + v0/k rest point (closed form, no loop)",
        re: /expect\(\s*decayRest\(\{[\s\S]*?\}\)\s*\)\.toBeCloseTo\(\s*rest,/,
    },
    {
        name: "decay rejects non-positive friction (no finite rest point)",
        re: /expect\(\(\)\s*=>\s*decayRest\(\{[^}]*friction:\s*0[^}]*\}\)\)\.toThrow\(\)/,
    },
]);

// ── sequence-ordering — add/label/seek/play boundary order is locked ──────────
requireAll("sequence-ordering", "test/orchestration/sequence.test.ts", [
    {
        name: "auto-append starts after the previous segment ends (cursor at 1000)",
        re: /auto-append[\s\S]*?expect\(seq\.entries\.find\([\s\S]*?\.at\)\.toBe\(1000\)/,
    },
    {
        name: "a label resolves to its registered position",
        re: /\.label\("mid",\s*400\)[\s\S]*?expect\(seq\.entries\.find\([\s\S]*?\.at\)\.toBe\(400\)/,
    },
    {
        name: "seek maps the master clock to each child's local clock (0.5 / 0)",
        re: /seq\.seek\(500\)[\s\S]*?expect\(paintedOpacity\(a\)\)\.toBeCloseTo\(0\.5,\s*5\)/,
    },
    {
        name: "play() drives via advanceTo, landing every segment at its rest frame",
        re: /play\(\)\s*drives\s*via\s*advanceTo[\s\S]*?await\s+seq\.play\(\)[\s\S]*?expect\(paintedOpacity\(a\)\)\.toBeCloseTo\(1,\s*5\)/,
    },
]);

// ── api-isolation — the two LIGHT public-API edges, locked in isolation ───────
requireAll("api-isolation", "test/orchestration/orchestration-api.test.ts", [
    {
        name: "createNativeTimeline returns the guard-absent fallback (null) for kind:'scroll'",
        re: /globalThis\.ScrollTimeline is absent[\s\S]*?expect\(createNativeTimeline\(\{\s*kind:\s*"scroll"\s*\}\)\)\.toBeNull\(\)/,
    },
    {
        name: "createNativeTimeline does NOT throw at the guard (soft fallback)",
        re: /expect\(\(\)\s*=>\s*createNativeTimeline\(\{\s*kind:\s*"scroll"\s*\}\)\)\.not\.toThrow\(\)/,
    },
    {
        name: "toEasing wraps a passthrough callable to { fn } with no css (by reference)",
        re: /expect\(easing\.fn\)\.toBe\(fn\)[\s\S]*?expect\(easing\.css\)\.toBeUndefined\(\)/,
    },
    {
        name: "toEasing passes a typed Easing through unchanged (css retained)",
        re: /const\s+out\s*=\s*toEasing\(input\)[\s\S]*?expect\(out\)\.toBe\(input\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:orchestration — FAIL: the orchestration tier is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  Each clause CHAINS an existing SOTA-honest test assertion as a named\n" +
            "  lock (F.W3 §Design-decision 1 — chain, do not re-implement). A clause\n" +
            "  reds the moment its locking test is deleted: restore the stagger\n" +
            "  distribution / FLIP identity / decay analytic / Sequence cursor map /\n" +
            "  public-API isolation assert it names.",
    );
    process.exit(1);
}
console.log(
    "proof:orchestration — PASS: the E.W10 orchestration tier is a NAMED gate —\n" +
        "stagger distribution, the FLIP first/last/invert/play identity (+ the\n" +
        "layout-thrash lock), the decay closed-form rest, the Sequence add/label/\n" +
        "seek/play ordering, and the two isolated public-API edges each carry a\n" +
        "biting locking assertion. The named-gate asymmetry with the other E\n" +
        "surfaces is closed (a-tranche-retro-F §3.1).",
);
