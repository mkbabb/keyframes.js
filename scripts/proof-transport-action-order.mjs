#!/usr/bin/env node
/**
 * proof:transport-action-order — T.B10 (VERDICT #6's second clause: "the play
 * button should be the first element"). THE MODEL CLAUSE (GREEN).
 *
 * Before T.B10, "play first" had NO data-layer lever — `TransportDock.vue`
 * rendered persistent controls in fixed markup order (name/select, Reset, Clear,
 * then Play LAST), so reordering Play was a per-dock markup edit every redesign
 * paid again. T.B10 exposes an ORDERED action model off `useSceneTransport`:
 *
 *   { primary: { kind: "play", … }, secondary: [ { kind: "reset" }, { kind: "clear" } ] }
 *
 * so "play first" is a DATA fact, consumed uniformly by whatever dock-grammar
 * component T.C1 lands on. This gate is the SNAPSHOT of that exposed model — the
 * single source of order truth `proof:dock-grammar`'s "play first" render clause
 * (T.C1) must agree with.
 *
 * THE SPLIT (charter §5 lockstep — honest gate posture). The FULL T.B10 gate has
 * two clauses: (1) the MODEL clause (primary.kind === "play", primary before
 * secondary) — GREEN today, this gate; (2) the RENDER clause (the dock draws play
 * from `actions.primary`, never a hardcoded markup-last position) — RED today
 * (TransportDock renders Play markup-last) and owned by T.C1's rail-core rebuild.
 * The render clause rides its OWN born-RED gate `proof:transport-play-first-render`
 * (T_BORNRED_BACKLOG, dischargedBy T.C1) so THIS model clause can stand GREEN and
 * blocking without masking the pending render work.
 *
 * DEVICE-INDEPENDENT (pure source parse; no browser, no Vue runtime): the model is
 * a `computed()` over reactive state (the play LABEL flips with `isPlaying`), so it
 * cannot be node-evaluated as a static literal — the gate reads the exposed model
 * literal's SHAPE from the composable source. Overrides (plant-test): KF_TRANSPORT.
 *   node scripts/proof-transport-action-order.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TRANSPORT =
    process.env.KF_TRANSPORT ||
    join(root, "demo/app/runtime/useSceneTransport.ts");

const failures = [];
const passes = [];

console.log(
    "proof:transport-action-order — T.B10 (the ordered transport-action model — play-first as data) [MODEL clause]\n",
);

let src = "";
try {
    src = readFileSync(TRANSPORT, "utf8");
} catch (e) {
    failures.push(`transport-present — cannot read ${TRANSPORT}: ${e.message}.`);
}

if (src) {
    // ── clause 1: the exposed model TYPE names an ordered primary + secondary ──
    const hasModelType =
        /interface\s+TransportActionModel\s*\{[\s\S]*?\bprimary\s*:\s*TransportAction[\s\S]*?\bsecondary\s*:\s*readonly\s+TransportAction\[\][\s\S]*?\}/.test(
            src,
        );
    if (hasModelType) {
        passes.push(
            "model-type — `TransportActionModel` exposes an ordered { primary: TransportAction; " +
                "secondary: readonly TransportAction[] } — the play-first-as-data shape.",
        );
    } else {
        failures.push(
            "model-type — no `TransportActionModel` interface with `primary: TransportAction` + " +
                "`secondary: readonly TransportAction[]`. The ordered action model is the T.B10 lever; " +
                "without the type there is no data-layer 'play first'.",
        );
    }

    // ── clause 2: the composable RETURNS the model (additive, not a dead type) ──
    const returnsActions =
        /return\s*\{[^}]*\bactions\b[^}]*\}/.test(src) &&
        /\bactions\s*:\s*ComputedRef<TransportActionModel>/.test(src);
    if (returnsActions) {
        passes.push(
            "model-returned — `useSceneTransport` RETURNS `actions: ComputedRef<TransportActionModel>` " +
                "(the model is live on the composable, not a dead type).",
        );
    } else {
        failures.push(
            "model-returned — `useSceneTransport` does not return `actions: ComputedRef<TransportActionModel>`. " +
                "The ordered model must be EXPOSED to be consumed by T.C's dock grammar.",
        );
    }

    // ── clause 3 (THE SNAPSHOT): the exposed model's primary.kind === "play",
    //    and primary is declared BEFORE the secondary rail (play first as data). ──
    const actionsBlock = (() => {
        const m = src.match(/const\s+actions\s*=\s*computed<TransportActionModel>\(\(\)\s*=>\s*\(\{[\s\S]*?\}\)\);/);
        return m ? m[0] : "";
    })();
    if (!actionsBlock) {
        failures.push(
            "snapshot — could not locate the `actions = computed<TransportActionModel>(() => ({ … }))` " +
                "literal in the composable. The gate reads the exposed model's shape from this literal.",
        );
    } else {
        const primaryIdx = actionsBlock.indexOf("primary:");
        const secondaryIdx = actionsBlock.indexOf("secondary:");
        // primary's own kind literal (the first `kind: "…"` inside the primary object).
        const primaryKind = (() => {
            if (primaryIdx === -1) return null;
            const scope = actionsBlock.slice(
                primaryIdx,
                secondaryIdx === -1 ? actionsBlock.length : secondaryIdx,
            );
            const km = scope.match(/kind\s*:\s*"([a-z]+)"/);
            return km ? km[1] : null;
        })();
        if (primaryKind === "play") {
            passes.push(
                'snapshot — the exposed model\'s `primary.kind === "play"` (VERDICT #6: the play button is the primary action).',
            );
        } else {
            failures.push(
                `snapshot — the exposed model's primary.kind is ${primaryKind === null ? "ABSENT" : `"${primaryKind}"`}, not "play". ` +
                    "The PRIMARY transport action must be play (the data-layer 'play first').",
            );
        }
        if (primaryIdx !== -1 && secondaryIdx !== -1 && primaryIdx < secondaryIdx) {
            passes.push(
                "snapshot — `primary` is declared BEFORE `secondary` in the model (play leads the ordered rail).",
            );
        } else {
            failures.push(
                "snapshot — `primary` is not declared before `secondary` in the model literal. The order " +
                    "IS the contract (the render draws primary first).",
            );
        }
        // The ordered secondary rail carries the reset→clear pair (VERDICT #6's
        // "secondary" examples) — the non-play controls the dock draws after play.
        const secKinds = [...actionsBlock.slice(secondaryIdx).matchAll(/kind\s*:\s*"([a-z]+)"/g)].map(
            (m) => m[1],
        );
        const hasResetThenClear =
            secKinds.indexOf("reset") !== -1 &&
            secKinds.indexOf("clear") !== -1 &&
            secKinds.indexOf("reset") < secKinds.indexOf("clear");
        if (hasResetThenClear) {
            passes.push(
                "snapshot — the ordered `secondary` rail carries reset→clear (the non-play controls, in order).",
            );
        } else {
            failures.push(
                `snapshot — the secondary rail does not carry reset→clear in order (found: [${secKinds.join(", ")}]). ` +
                    "The ordered model must name the secondary controls so the dock draws them uniformly.",
            );
        }
    }
}

for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:transport-action-order — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:transport-action-order — PASS: the ordered transport-action model exposes " +
        'primary.kind === "play" first + an ordered reset→clear secondary rail (play-first as data; ' +
        "the render clause rides proof:transport-play-first-render, dischargedBy T.C1).",
);
process.exit(0);
