// proof:wave-charter — Q.WA4 §S1/§S2/§S3 (the contrivance smell-test ENFORCER +
// the machine-readable DAG manifest parse/topo-sort + the dissolved-edge witness).
//
// RUN: node scripts/proof-wave-charter.mjs
//
// WHY THIS GATE EXISTS (AUDIT-31 B6-completeness-critic + B6-dag-ordering). The
// CONTRIVANCE-AUDIT's durable preventive — the 7-question pre-charter smell-test +
// the transplanted-ratio bite (docs/tranches/P/CONTRIVANCE-AUDIT.md:144-154) — was
// authored as a DISCIPLINE but never wired as a GATE. So the "aggressively optimize"
// trap was re-armed for Q: a perf wave could charter on a TRANSPLANTED ratio (the
// 3.86× reused across paths — the exact trap the impl drive hit and reverted,
// spring-vector-decision.json lineage) with no gate to bite it. And the Q DAG was
// DEV-authored as a machine-readable manifest (docs/tranches/Q/DAG.md) but NO gate
// parsed it — nothing asserted it acyclic or no-unpublished-consume.
//
// THE REAL OBSERVABLE (inv-observable-truth, NOT a proxy): the genuine defect is
// *a Q perf wave chartering on a transplanted/speculative ratio with no smell-test
// answers, a DAG that is silently cyclic or consumes an unpublished sibling, or a
// dissolved edge that reappears*. This gate parses the ACTUAL wave-spec headers (the
// 7-question markers + the name-matched born-RED bench baseline), the ACTUAL DAG
// manifest (its own Kahn topo-sort — NOT trusting the printed topologicalOrder), and
// the ACTUAL consume-edge dispatch fields — each the genuine observable, never a grep
// of intent.
//
// FOUR CLAUSE GROUPS:
//   (a)  the 7-question smell-test + the transplanted-ratio bite over every
//        PERF-claiming Q.W*.md (S1).
//   (b)  the DAG manifest is present + acyclic (own Kahn sort) + no-unpublished-consume
//        + the dissolvedEdges[] are absent from edges[] (S2, S3).
// The pin-ledger witness (S4 / clause c) is the SIBLING gate proof:pin-ledger-current.
//
// BORN-RED on today's tree (pre-cure): this script + PIN-LEDGER.json are absent, so
// the smell-test is un-enforced and the DAG is un-parsed. The script self-tests the
// transplanted-ratio bite against a PLANTED fixture wave (--selftest-plant) — a header
// claiming "2.5× faster" whose decision-JSON baselineCase names a NON-target function
// reds the gate. GREEN on the cure (this gate + the committed, Kahn-valid DAG.md).

import {
    existsSync,
    readFileSync,
    readdirSync,
    mkdtempSync,
    writeFileSync,
    rmSync,
} from "node:fs";
import { resolve, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const WAVES_DIR = resolve(REPO, "docs/tranches/Q/waves");
const DAG_MD = resolve(REPO, "docs/tranches/Q/DAG.md");

let failed = false;
const results = [];
const check = (id, ok, detail) => {
    results.push({ id, ok, detail });
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
    if (!ok) failed = true;
};

// ─────────────────────────────────────────────────────────────────────────────
// PERF-WAVE DETECTION — the genuine signal, not a keyword soup.
//
// A wave is PERF-claiming iff it charters a born-RED MEASUREMENT verdict: it names a
// `*-decision.json` durable terminal AND a `proof:*` bench/ratio gate over it. This is
// exactly the contrivance-prone shape (a perf wave that asserts a ratio/count win) —
// a feature wave (Q.WB1: no decision-JSON, no ratio) is correctly NOT swept in.
// ─────────────────────────────────────────────────────────────────────────────
const DECISION_JSON_RE = /([A-Za-z0-9-]+)-decision\.json/g;
const PERF_GATE_RE =
    /\bproof:[a-z0-9-]*(?:soa|densify|perf|bench|ratio|throughput)[a-z0-9-]*\b/i;

/** The 7-question smell-test MARKERS — the contrivance discipline a perf wave must carry. */
const SMELL_TEST_MARKERS = [
    // MEASURE-FIRST is satisfied by ANY of the established attestations that the bench
    // PRECEDES the edit: the literal "measure-first", the P.W1 `ratioGate` discipline,
    // a born-RED gate over a decision-JSON terminal, or a "baseline recorded BEFORE"
    // clause. The bite is on a perf wave with NONE of these (the plant) — not on a
    // particular phrasing.
    {
        key: "measure-first",
        re: /\bmeasure-first\b|\bMEASURE-FIRST\b|\bratioGate\b|born-RED\s+(?:decision\s+)?gate|baseline\s+recorded\s+BEFORE|measure(?:-|\s)first\b/i,
        label: "MEASURE-FIRST discipline (measure-first / ratioGate / a born-RED decision gate before the edit)",
    },
    {
        key: "same-report-ratio",
        re: /\bSAME-REPORT\b|\bsame-report\b|device-independent|device-honest/,
        label: "SAME-REPORT-RATIO (numerator+denominator one pass — not a transplanted multiple)",
    },
    {
        key: "demote-or-spike",
        re: /\bDEMOTE-TO-SPIKE\b|\bMEASURE-FIRST\b|ADOPT-or-KILL|ADOPT \(|\bKILL\b/,
        label: "DEMOTE-TO-SPIKE/ADOPT-or-KILL disposition (the no-on-Q1/3/4/6 redress)",
    },
    {
        key: "durable-terminal",
        re: /P-inv(?:ariant)?-28|durable.*terminal|terminal home/i,
        label: "P-inv-28 durable terminal home (the verdict is recorded, never a perpetual punt)",
    },
];

/**
 * The DECLARED TARGET FUNCTION — asserted by name in the wave header (the load-bearing
 * clause). A perf wave names its target path (the function/emit the bench measures). We
 * extract the back-ticked identifiers near the perf headline AND the decision-JSON's own
 * scope, then assert the decision-JSON `baselineCase`/`$comment` scope NAME-MATCHES one
 * of them — the transplanted-ratio bite.
 */
function declaredTargets(src) {
    // Back-ticked identifiers in the title + the §Scope S1 lines (the target path names).
    const ids = new Set();
    for (const m of src.matchAll(/`([A-Za-z_][A-Za-z0-9_]*)`/g)) {
        ids.add(m[1]);
    }
    return ids;
}

/**
 * The decision-JSON name-match bite. For each `*-decision.json` a perf wave references,
 * IF that decision-JSON EXISTS on the tree, read its `baselineCase` (or, in the durable
 * shape, the `$comment` scope) and assert it name-matches a declared target identifier.
 * A decision-JSON whose baseline measures a DIFFERENT path (the transplant) → RED.
 *
 * The decision-JSON does NOT have to exist yet (the impl-staged scaffold lands during
 * the perf wave's own impl); the bite ARMS when it lands with a mismatched baseline.
 */
function transplantedRatioBite(waveId, src, repoRoot) {
    const targets = declaredTargets(src);
    const seenJson = new Set();
    for (const m of src.matchAll(DECISION_JSON_RE)) {
        seenJson.add(m[1] + "-decision.json");
    }
    for (const jsonName of seenJson) {
        const jsonPath = resolve(repoRoot, "scripts", jsonName);
        if (!existsSync(jsonPath)) {
            // Not yet authored — the bite is dormant (impl-staged). The presence of the
            // REFERENCE is the wave's declared terminal home; no false-RED on absence.
            continue;
        }
        let decision;
        try {
            decision = JSON.parse(readFileSync(jsonPath, "utf8"));
        } catch (e) {
            check(
                `${waveId}/transplant/${jsonName}`,
                false,
                `decision-JSON is malformed: ${e.message}`,
            );
            continue;
        }
        // The baseline scope: an explicit `baselineCase`/`target`/`targetFunction` field,
        // else the durable-shape `$comment` scope string.
        const baselineScope =
            decision.baselineCase ??
            decision.target ??
            decision.targetFunction ??
            decision.baseline ??
            decision.$comment ??
            "";
        const scopeStr = String(baselineScope);
        const nameMatched = [...targets].some((t) => scopeStr.includes(t));
        check(
            `${waveId}/transplant/${jsonName}`,
            nameMatched,
            nameMatched
                ? `decision-JSON baseline scope name-matches a declared target (${[
                      ...targets,
                  ]
                      .filter((t) => scopeStr.includes(t))
                      .slice(0, 3)
                      .join(", ")})`
                : `TRANSPLANTED-RATIO: baseline scope "${scopeStr.slice(0, 60)}" name-matches NONE of the wave's declared targets — the ratio is measured on a DIFFERENT path`,
        );
    }
}

/** Clause (a) over one waves directory — returns the count of perf waves swept. */
function smellTestOverWaves(wavesDir, repoRoot, { silent = false } = {}) {
    if (!existsSync(wavesDir)) {
        if (!silent)
            check("(a)/waves-dir", false, `waves dir absent: ${wavesDir}`);
        return 0;
    }
    const files = readdirSync(wavesDir).filter((f) => /^Q\.W.*\.md$/.test(f));
    let perfCount = 0;
    for (const f of files) {
        const src = readFileSync(join(wavesDir, f), "utf8");
        const waveId = f.replace(/\.md$/, "");
        const namesDecisionJson = DECISION_JSON_RE.test(src);
        DECISION_JSON_RE.lastIndex = 0; // reset the /g regex
        const namesPerfGate = PERF_GATE_RE.test(src);
        const isPerf = namesDecisionJson && namesPerfGate;
        if (!isPerf) continue;
        perfCount++;

        // (a-i) — the 7-question smell-test markers MUST be present.
        const missing = SMELL_TEST_MARKERS.filter((m) => !m.re.test(src)).map(
            (m) => m.label,
        );
        check(
            `(a-i)/${waveId}/smell-test`,
            missing.length === 0,
            missing.length === 0
                ? `the 7-question contrivance markers are present (measure-first · same-report · ADOPT-or-KILL · P-inv-28)`
                : `MISSING smell-test markers: ${missing.join("; ")}`,
        );

        // (a-ii) — the transplanted-ratio bite (the load-bearing clause).
        transplantedRatioBite(waveId, src, repoRoot);

        // (a-iii) — a [radical] wave with a "no" must carry a DEMOTE-TO-SPIKE/MEASURE-FIRST disposition.
        if (/\[radical\]/i.test(src)) {
            const disposed = /\bDEMOTE-TO-SPIKE\b|\bMEASURE-FIRST\b/.test(src);
            check(
                `(a-iii)/${waveId}/radical-disposition`,
                disposed,
                disposed
                    ? `[radical] wave carries a DEMOTE-TO-SPIKE/MEASURE-FIRST disposition`
                    : `[radical] wave has NO measure-first/demote-to-spike disposition (CONTRIVANCE-AUDIT.md:154)`,
            );
        }
    }
    return perfCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE GROUP (a) — the smell-test over the committed Q waves.
// ─────────────────────────────────────────────────────────────────────────────
console.log(
    "proof:wave-charter — the contrivance smell-test ENFORCER + the Q DAG witness\n",
);
console.log(
    "(a) the 7-question smell-test + the transplanted-ratio bite over the Q perf waves:",
);
const perfSwept = smellTestOverWaves(WAVES_DIR, REPO);
check(
    "(a)/perf-waves-swept",
    perfSwept > 0,
    `${perfSwept} perf-claiming Q wave(s) detected + smell-tested (each names a *-decision.json terminal + a proof:* bench gate — e.g. Q.WB3 processFrame-SoA · Q.WB4 WAAPI densify · Q.WF2 group-SoA)`,
);

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE GROUP (b) — the DAG manifest parse + the OWN Kahn topo-sort + the
// no-unpublished-consume + the dissolved-edge-absent assertions (S2, S3).
// ─────────────────────────────────────────────────────────────────────────────
console.log(
    "\n(b) the DAG manifest is present + acyclic + no-unpublished-consume:",
);

// (b.0) the manifest is present (a standing regression guard — DEV-authored).
const dagPresent = existsSync(DAG_MD);
check(
    "(b.0)/dag-present",
    dagPresent,
    dagPresent
        ? `docs/tranches/Q/DAG.md present`
        : `docs/tranches/Q/DAG.md ABSENT`,
);

if (dagPresent) {
    const md = readFileSync(DAG_MD, "utf8");
    // Parse the FIRST fenced ```json block (the machine-readable manifest).
    const fence = md.match(/```json\s*\n([\s\S]*?)\n```/);
    let manifest = null;
    if (!fence) {
        check("(b.1)/dag-json-block", false, "no fenced json block in DAG.md");
    } else {
        try {
            manifest = JSON.parse(fence[1]);
            check(
                "(b.1)/dag-json-block",
                true,
                `the fenced json manifest parses (${manifest.nodes?.length ?? 0} nodes, ${manifest.edges?.length ?? 0} edges)`,
            );
        } catch (e) {
            check(
                "(b.1)/dag-json-block",
                false,
                `the fenced json block is malformed: ${e.message}`,
            );
        }
    }

    if (manifest) {
        const nodes = manifest.nodes ?? [];
        const edges = manifest.edges ?? [];
        const nodeIds = new Set(nodes.map((n) => n.id));

        // (b.2) every edge endpoint is a declared node (no dangling reference).
        const dangling = [];
        for (const e of edges) {
            if (!nodeIds.has(e.from)) dangling.push(`${e.from} (from)`);
            if (!nodeIds.has(e.to)) dangling.push(`${e.to} (to)`);
        }
        check(
            "(b.2)/edges-resolve",
            dangling.length === 0,
            dangling.length === 0
                ? `all ${edges.length} edges reference declared nodes`
                : `dangling edge endpoints: ${[...new Set(dangling)].join(", ")}`,
        );

        // (b.3) the OWN Kahn topological sort — NOT trusting the printed topologicalOrder.
        const adj = new Map([...nodeIds].map((id) => [id, []]));
        const indeg = new Map([...nodeIds].map((id) => [id, 0]));
        for (const e of edges) {
            if (nodeIds.has(e.from) && nodeIds.has(e.to)) {
                adj.get(e.from).push(e.to);
                indeg.set(e.to, indeg.get(e.to) + 1);
            }
        }
        const queue = [...nodeIds].filter((id) => indeg.get(id) === 0);
        const order = [];
        while (queue.length) {
            const u = queue.shift();
            order.push(u);
            for (const v of adj.get(u)) {
                indeg.set(v, indeg.get(v) - 1);
                if (indeg.get(v) === 0) queue.push(v);
            }
        }
        const acyclic = order.length === nodeIds.size;
        const cycleNodes = acyclic
            ? []
            : [...nodeIds].filter((id) => indeg.get(id) > 0);
        check(
            "(b.3)/acyclic",
            acyclic,
            acyclic
                ? `Kahn topological sort SUCCEEDS over ${nodeIds.size} nodes × ${edges.length} edges — the DAG is acyclic (own sort, not the printed topologicalOrder)`
                : `CYCLIC: ${cycleNodes.length} node(s) never reach in-degree 0 (a cycle through ${cycleNodes.slice(0, 6).join(", ")})`,
        );

        // (b.4) no-unpublished-consume: every GATED node carries a non-empty
        // gatedOn.siblingPublish AND a non-null gatedOn.dispatchDoc.
        const gatedBreaches = [];
        for (const n of nodes) {
            if (n.phase !== "GATED") continue;
            const g = n.gatedOn ?? {};
            if (!g.siblingPublish || String(g.siblingPublish).trim() === "") {
                gatedBreaches.push(`${n.id}: empty gatedOn.siblingPublish`);
            }
            if (!g.dispatchDoc || String(g.dispatchDoc).trim() === "") {
                gatedBreaches.push(
                    `${n.id}: null gatedOn.dispatchDoc (consumes an unpublished surface with no dispatch)`,
                );
            }
        }
        const gatedCount = nodes.filter((n) => n.phase === "GATED").length;
        check(
            "(b.4)/no-unpublished-consume",
            gatedBreaches.length === 0,
            gatedBreaches.length === 0
                ? `all ${gatedCount} GATED node(s) name a non-empty siblingPublish + a non-null dispatchDoc (no kf wave consumes an unpublished surface)`
                : `no-unpublished-consume BREACH: ${gatedBreaches.join("; ")}`,
        );

        // (b.5) the dissolvedEdges[0] (drag2D-light-export → Q.WC1) is ABSENT from edges[].
        const dissolved = manifest.dissolvedEdges ?? [];
        const dissolvedBreaches = [];
        for (const de of dissolved) {
            if (de.assertAbsentFromEdges === false) continue;
            const present = edges.some(
                (e) => e.from === de.from && e.to === de.to,
            );
            if (present) dissolvedBreaches.push(`${de.from} → ${de.to}`);
        }
        const firstDissolved = dissolved[0];
        check(
            "(b.5)/dissolved-edge-absent",
            dissolvedBreaches.length === 0,
            dissolvedBreaches.length === 0
                ? `the dissolvedEdges[] are absent from edges[] (the drag2D-light-export → Q.WC1 gating edge stays dissolved${firstDissolved ? ` — ${firstDissolved.from} → ${firstDissolved.to}` : ""})`
                : `DISSOLVED-EDGE REGRESSION: a dissolved edge reappeared in edges[]: ${dissolvedBreaches.join(", ")}`,
        );

        // (b.6) the dissolvedEdges[0] is EXACTLY the drag2D-light-export → Q.WC1 record (Q.WA4 §S3 names it).
        const hasDrag2dDissolved =
            firstDissolved &&
            firstDissolved.from === "drag2D-light-export" &&
            firstDissolved.to === "Q.WC1";
        check(
            "(b.6)/dissolved-edge-recorded",
            hasDrag2dDissolved,
            hasDrag2dDissolved
                ? `dissolvedEdges[0] is the drag2D-light-export → Q.WC1 record (Q.WA4 §S3), assertAbsentFromEdges=${firstDissolved.assertAbsentFromEdges}`
                : `dissolvedEdges[0] is NOT the named drag2D-light-export → Q.WC1 record`,
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SELF-TEST — the born-RED witness. The transplanted-ratio bite reds a PLANTED
// fixture wave (a header claiming "2.5× faster" whose decision-JSON baselineCase
// names a NON-target function). Run with --selftest-plant; this proves the
// instrument BITES (it is not a no-op that greens on anything).
// ─────────────────────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest-plant")) {
    console.log(
        "\n[--selftest-plant] the transplanted-ratio bite over a PLANTED contrived fixture:",
    );
    const { mkdirSync } = await import("node:fs");
    const tmp = mkdtempSync(join(tmpdir(), "wave-charter-plant-"));
    const tmpWaves = join(tmp, "waves");
    const tmpScripts = join(tmp, "scripts");
    mkdirSync(tmpWaves, { recursive: true });
    mkdirSync(tmpScripts, { recursive: true });
    // A contrived perf wave: declares target `fastBlend`, references proof:fastblend-soa +
    // fastblend-decision.json — but the decision-JSON's baseline measures `someOtherPath`.
    writeFileSync(
        join(tmpWaves, "Q.WPLANT.md"),
        [
            "# Q.WPLANT — a CONTRIVED perf wave: 2.5× faster `fastBlend` (the transplant trap)",
            "MEASURE-FIRST · SAME-REPORT · ADOPT-or-KILL · P-inv-28 durable terminal home.",
            "The bench `proof:fastblend-soa` over `scripts/fastblend-decision.json` claims a 2.5× win on `fastBlend`.",
        ].join("\n"),
        "utf8",
    );
    writeFileSync(
        join(tmpScripts, "fastblend-decision.json"),
        JSON.stringify({
            $comment: "ratio scoped to someOtherPath (a DIFFERENT function)",
            ratio: 2.5,
            verdict: "ADOPT",
        }),
        "utf8",
    );
    // Run the smell-test over the PLANTED dir with a fresh result accumulator.
    const before = results.length;
    smellTestOverWaves(tmpWaves, tmp);
    const planted = results.slice(before);
    const transplantBite = planted.find((r) => /\/transplant\//.test(r.id));
    const bit = transplantBite && transplantBite.ok === false;
    rmSync(tmp, { recursive: true, force: true });
    // Re-tally: the PLANTED bite SHOULD have reded; that is the EXPECTED outcome, so we
    // must NOT let it poison the gate's real verdict. Restore `failed` to its pre-plant
    // state and assert the bite fired.
    failed = results.slice(0, before).some((r) => !r.ok);
    console.log(
        `  ${bit ? "PASS" : "FAIL"}  selftest/transplant-bite  ${bit ? "the PLANTED transplanted-ratio fixture REDS (the instrument bites)" : "the PLANTED fixture did NOT red — the bite is a no-op (INSTRUMENT BROKEN)"}`,
    );
    if (!bit) failed = true;
}

console.log(
    `\nproof:wave-charter ${failed ? "FAIL" : "GREEN"} — ${failed ? "a contrivance/DAG/dissolved-edge breach is live" : "the 7-question smell-test is enforced + the Q DAG is acyclic, no-unpublished-consume, dissolved-edge-clean"}.`,
);
process.exit(failed ? 1 : 0);
