#!/usr/bin/env node
/**
 * proof:workaround-deletion — L.W9 Band-B (the consume-edge deletion ledger).
 *
 * The kf consume seam carries FIVE live workarounds for SIBLING defects (the
 * 36-lane audit's ⚠1–3/⚠5/⚠7/⚠18–20/⚠24 class). Each is a named precept
 * violation today (inv-16 / no-workaround / inv-L-acyclic-purity): the FIX
 * belongs in the sibling, and kf's side is a band-aid held until the sibling
 * publishes the root cure. Deleting a band-aid BEFORE the sibling has actually
 * shipped the fix would leave the consumer broken — so this gate must NOT demand
 * deletion before the publish lands.
 *
 * THE THREE-STATE MODEL (the Band-B consume-edge lifecycle, exactly):
 *
 *   ABSENT               → GREEN   (workaround deleted; the cure is consumed)
 *   PRESENT + UNPUBLISHED → PENDING (exit 0 — the sibling root-fix has NOT
 *                                    shipped; deleting now would break the
 *                                    consumer; this is the STAGED state, not a
 *                                    false alarm)
 *   PRESENT + PUBLISHED   → RED     (exit 1 — the sibling fixed the root and
 *                                    published it, but kf has NOT consumed; the
 *                                    deletion is now OVERDUE)
 *
 * The gate is therefore born-PENDING on today's tree (every arm PRESENT, every
 * paired sibling fix UNPUBLISHED) and GREENs arm-by-arm as siblings publish AND
 * kf consumes. It only ever turns RED to demand an action that is now SAFE.
 *
 * THE PUBLISH PROBE (`npm show <pkg>@<required> version`):
 *   - exit 0 + a non-empty version on stdout  → PUBLISHED.
 *   - exit != 0 with `E404` in stderr          → genuinely UNPUBLISHED → PENDING.
 *   - any other probe failure (network error / no registry / ENOTFOUND /
 *     ECONNREFUSED / timeout)                  → INDETERMINATE → PENDING.
 * INDETERMINATE collapses to PENDING by design: a flaky registry probe must
 * NEVER red a still-needed workaround (the inverse mistake the guardrail names).
 * The only path to RED is a CONFIRMED publish (exit 0 + version) over a PRESENT
 * workaround.
 *
 * Each arm GREPS the workaround PATTERN over the kf source tree (a device-
 * INDEPENDENT FACT — a string match, not a timing measurement; a `hard` gate).
 * STATIC, re-runnable, no browser: `node scripts/proof-workaround-deletion.mjs`.
 *
 * GUARDRAIL (a workaround was caught + reverted in L.W1): this gate is GATE-
 * FIRST. It does NOT delete any workaround; it does NOT weaken any other gate.
 * It records the per-arm state and exits 0 while every arm is PENDING.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Source-tree grep (no shell; a pure FS walk + per-line regex) ─────────────

/** Recursively collect files under `dir` that match `fileFilter`, skipping
 *  node_modules / .git / dist (the workaround sources live in src/ + demo/). */
function collectFiles(dir, fileFilter, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const name of entries) {
        if (
            name === "node_modules" ||
            name === ".git" ||
            name === "dist" ||
            name === ".vite"
        ) {
            continue;
        }
        const full = join(dir, name);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) {
            collectFiles(full, fileFilter, acc);
        } else if (fileFilter(full)) {
            acc.push(full);
        }
    }
    return acc;
}

/** Grep `pattern` across the files under `subpath` (relative to repo root) whose
 *  name passes `fileFilter`. Returns [{ file, line, text }] hits. The pattern is
 *  a RegExp tested per line. */
function grepTree(subpath, fileFilter, pattern) {
    const base = join(root, subpath);
    if (!existsSync(base)) return [];
    const files = statSync(base).isDirectory()
        ? collectFiles(base, fileFilter)
        : fileFilter(base)
          ? [base]
          : [];
    const hits = [];
    for (const file of files) {
        let lines;
        try {
            lines = readFileSync(file, "utf8").split("\n");
        } catch {
            continue;
        }
        lines.forEach((text, i) => {
            // Reset lastIndex defensively (pattern may be /g).
            pattern.lastIndex = 0;
            if (pattern.test(text)) {
                hits.push({
                    file: relative(root, file),
                    line: i + 1,
                    text: text.trim(),
                });
            }
        });
    }
    return hits;
}

const isVue = (f) => f.endsWith(".vue");
const isTs = (f) => f.endsWith(".ts");
const exact = (rel) => (f) => f === join(root, rel);

// ── Replacement-API capability probe (observable-truth) ──
//
// A registry version EXISTING does NOT prove the specific consume-edge fix
// landed: value.js's O tranche shipped VJ-L2 (linear() serialize) but DEFERRED
// VJ-L1 (flatLeaf provenance) and VJ-L3 (parseCSSSubValue). So the version-publish
// probe alone over-reports — it flips S8/S9 RED on the mere existence of
// value.js@0.14.0+ even though those APIs are absent. An arm is RED only when the
// REPLACEMENT API is genuinely consumable; "version published but API absent" is
// PENDING (held until the API actually ships), NOT RED. The gate checks the
// installed value.js for each replacement.
const vjs = await import("@mkbabb/value.js").catch(() => ({}));
const vjsCaps = {
    // VJ-L2 — linear() serializes with space-separated position hints.
    linearSerialize: (() => {
        try {
            return (
                vjs.parseCSSValue?.("linear(0, 0.5 50%, 1)")?.toString() ===
                "linear(0, 0.5 50%, 1)"
            );
        } catch {
            return false;
        }
    })(),
    // VJ-Q4 (VJ-L1 terminal) — a first-class, `clone()`-preserved flatten-origin
    // provenance field on `ValueUnit` (`.fnName`). The S8 terminal: the field
    // lets `clone()` carry the function-token name natively, retiring kf's
    // module-local `FN_NAME_MAP` WeakMap + the clone-restamp ceremony. We probe
    // the INSTALLED surface for the shipped SHAPE (the field exists AND survives
    // `clone()`), not a registry version — the `apiPresent` content-probe
    // discipline (S7/S9's idiom). value.js 1.2.0 ships the field but does NOT
    // auto-populate it on flatten (kf threads `FunctionValue.name` down), so the
    // probe writes-then-clones to confirm the clone-preserved contract holds.
    flatLeaf: (() => {
        try {
            const ValueUnitCtor = vjs.ValueUnit;
            if (typeof ValueUnitCtor !== "function") return false;
            const u = new ValueUnitCtor(
                2,
                "",
                undefined,
                undefined,
                undefined,
                undefined,
                "scale",
            );
            // The field exists AND `clone()` preserves it — the VJ-Q4 contract.
            return u.fnName === "scale" && u.clone().fnName === "scale";
        } catch {
            return false;
        }
    })(),
    // VJ-L3 — a sub-value parse helper so kf need not reach parse-that directly
    // (NOT shipped in O).
    parseCSSSubValue: "parseCSSSubValue" in vjs || "parseSingleValue" in vjs,
};

// ── glass-ui content-probe (Q.WG-S1S2-HYGIENE — the false-RED fix) ──
//
// A registry version EXISTING does NOT prove the glass-ui FIX is in the dist kf
// CONSUMES. glass-ui 4.1.0 is published, but kf installs 4.0.1 (the
// prohibited-aria dist), and the BC aria/dock cures are hard-gated behind the
// unexecuted USER-DOMAIN BD.W-CUT — so deleting the S1/S2 band-aids NOW
// re-breaks ARIA / the dock click-strand. The S1/S2 arms therefore CANNOT key
// on the registry version (the false-RED that exits 1 today, failing
// proof:hygiene). They must read the INSTALLED glass-ui dist CONTENT — the EXACT
// `vjsCaps` discipline (S7/S8/S9 already carry `apiPresent`), now mirrored for
// glass-ui. Both probes are DIST-CONTENT GREPS (device-INDEPENDENT — they do NOT
// mount a component; the mounted-DOM readback is the SEPARATE, device-bearing
// `proof:glassui-aria-ask` gate, kept distinct so this gate stays portable).
const glassCaps = (() => {
    let tabsDist = "";
    let dockDist = "";
    try {
        tabsDist = readFileSync(
            join(root, "node_modules/@mkbabb/glass-ui/dist/tabs.js"),
            "utf8",
        );
    } catch {
        /* dist absent — content false → PENDING (held, never false-RED) */
    }
    try {
        dockDist = readFileSync(
            join(root, "node_modules/@mkbabb/glass-ui/dist/dock.js"),
            "utf8",
        );
    } catch {
        /* dist absent — content false → PENDING */
    }
    return {
        // ariaGuard — the SegmentedTabs aria-orientation guard is present iff the
        // installed `dist/tabs.js` does NOT emit `aria-orientation` UNCONDITIONALLY
        // on `role=group`. The installed 4.0.1 emits `aria-orientation": L.value ?
        // "vertical" : "horizontal"` — an UNCONDITIONAL ternary (no role-guarded
        // else arm) → ariaGuard=false → PENDING. When the BC cut ships the guard,
        // the dist carries the role-conditional `: void 0`/`: undefined` else arm
        // on the `aria-orientation` bind → the GUARDED shape grep matches →
        // ariaGuard=true. A DIST-CONTENT grep, NOT a registry/DOM probe.
        ariaGuard: (() => {
            if (!tabsDist) return false;
            // The GUARDED shape: an `aria-orientation` PROP-BIND (`aria-orientation":
            // <expr>`) whose value carries a role-conditional `: void 0`/`:
            // undefined`/`: null` else arm (the pill/group variant suppresses the
            // attribute) — present ONLY after the BC SFC guard ships. Scan EVERY
            // `aria-orientation"` PROP-BIND occurrence (the dist also carries the
            // bare attr-name in a `["role","aria-orientation"]` array — NOT a bind,
            // skipped by requiring the trailing `:`), and match the suppress-else
            // token within the bind's value window. The UNCONDITIONAL 4.0.1 emit
            // (`aria-orientation": L.value ? "vertical" : "horizontal"`) carries no
            // suppress-else → no match → ariaGuard=false → PENDING.
            const BIND = /aria-orientation["']\s*:\s*([^,}\n]{0,120})/g;
            let m;
            while ((m = BIND.exec(tabsDist)) !== null) {
                if (/:\s*(?:void 0|undefined|null)\b/.test(m[1])) return true;
            }
            return false;
        })(),
        // dockStrandKeepalive — the collapse-crossfade keepalive is present iff the
        // installed `dist/dock.js` carries the keepalive's STRUCTURAL signature: the
        // active `.dock-layer` RETAINS pointer-events/hit-test across the crossfade
        // (rather than the current drop/recreate that swallows a mid-crossfade
        // pointerdown). A device-INDEPENDENT dist-content grep, NOT a live DOM
        // session (the BEHAVIORAL observable — a pointerdown lands mid-crossfade —
        // is the SEPARATE, device-bearing `proof:live-session` consume gate). It
        // needs NO forward-named PUBLIC API string: it reads the structural dist
        // signature the cure necessarily leaves. The installed 4.0.1 dock carries
        // only the UNRELATED `useDockClickIntegrity` + `pointer-events-none` on the
        // indicator — NOT a `.dock-layer` keepalive → dockStrandKeepalive=false →
        // PENDING.
        dockStrandKeepalive: (() => {
            if (!dockDist) return false;
            // The keepalive signature: the dock-layer markup carries a
            // pointer-events KEEPALIVE on the ACTIVE layer across the crossfade —
            // the cure-specific token the BC cut introduces. We match a
            // `dock-layer` token co-located with a pointer-events KEEPALIVE
            // (`pointer-events:auto`/`pointer-events-auto`/a `keepalive`/`keep-alive`
            // marker) — NOT the existing `pointer-events-none` indicator. Absent
            // today (the cure not in the dist) → false → PENDING.
            return (
                /dock-layer[^]{0,400}?(?:pointer-events:\s*auto|pointer-events-auto|keep-?alive)/i.test(
                    dockDist,
                ) ||
                /(?:keep-?alive|keepActiveLayer|retainActiveLayer)[^]{0,200}?dock-layer/i.test(
                    dockDist,
                )
            );
        })(),
    };
})();

// ── Publish probe (the three-state classifier's PUBLISHED/UNPUBLISHED axis) ──

/**
 * Probe whether `pkg@version` is published to the registry.
 * Returns one of: "PUBLISHED" | "UNPUBLISHED" | "INDETERMINATE".
 *   - PUBLISHED:    npm show exits 0 with a non-empty version on stdout.
 *   - UNPUBLISHED:  npm show fails with a registry E404 (the version is not
 *                   published — the genuine "sibling hasn't shipped" signal).
 *   - INDETERMINATE: any other failure (network / no registry / timeout) — the
 *                   probe could not determine publish state; collapses to
 *                   PENDING upstream so a flaky probe never reds a workaround.
 */
function probePublish(pkg, version) {
    let stdout = "";
    try {
        stdout = execFileSync("npm", ["show", `${pkg}@${version}`, "version"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
            timeout: 30_000,
        });
        const v = String(stdout).trim();
        return v.length > 0 ? "PUBLISHED" : "INDETERMINATE";
    } catch (err) {
        const stderr = String(err?.stderr ?? "");
        const msg = String(err?.message ?? "");
        const blob = `${stderr}\n${msg}`;
        // A genuine "this version is not published" is an npm E404.
        if (/E404|404 No match found|could not be found/i.test(blob)) {
            return "UNPUBLISHED";
        }
        // Network / registry / timeout failure — cannot determine; PENDING.
        return "INDETERMINATE";
    }
}

// ── The arms (one per S-clause; the workaround pattern + its paired publish) ──

/**
 * Each arm declares:
 *   - id / title:    the S-clause + what the workaround is.
 *   - witness:       { subpath, fileFilter, pattern } — the grep that finds the
 *                    workaround. ABSENT (zero hits) ⇒ GREEN.
 *   - sibling:       { pkg, version, name } — the sibling PUBLISH whose landing
 *                    is the delete pre-condition (probed only when PRESENT).
 */
const arms = [
    {
        id: "S1",
        title:
            "aria-orientation suppress-on-consume (SpringSidebar.vue pill strip) " +
            "→ glass-ui SegmentedTabs root fix",
        // The band-aid: `:aria-orientation="undefined"` on a pill strip. We match
        // the bind whose value is `undefined` (the suppress shape) — NOT every
        // mention of aria-orientation (a doc comment naming it is not a workaround).
        witness: {
            subpath: "demo",
            fileFilter: isVue,
            pattern: /aria-orientation\s*=\s*["']?\s*undefined/,
        },
        // Q.WG-S1S2-HYGIENE: key on the INSTALLED-dist CONTENT (the aria guard's
        // presence), NOT the registry version. RED only when the guard IS in the
        // consumed dist AND the suppress is still present (the genuinely-OVERDUE
        // state). With the guard ABSENT (today's 4.0.1), the arm is PENDING —
        // held until the BC SFC guard ships — NOT a false-RED.
        sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB SegmentedTabs aria guard (BD.W-CUT, content-probed)" },
        apiPresent: glassCaps.ariaGuard,
    },
    {
        id: "S2",
        title:
            "pointerHandled / onPlayPointerDown interim (TransportDock.vue) " +
            "→ glass-ui collapse-crossfade dock-layer keepalive cure",
        witness: {
            subpath: "demo",
            fileFilter: isVue,
            pattern: /pointerHandled|onPlayPointerDown/,
        },
        // Q.WG-S1S2-HYGIENE: retarget OFF the wrong `useDockClickIntegrity`-4.1.0
        // sentinel (4.1.0 contains only the UNRELATED ASK-2 cure, not the
        // collapse-crossfade strand) ONTO the BC cut + the keepalive STRUCTURAL
        // signature (GU-Q2). `apiPresent` reads the installed dock dist for the
        // keepalive shape (NOT a version), so S2 is PENDING until the keepalive
        // is observed in the consumed dist — never a false-RED on 4.1.0.
        sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB collapse-crossfade dock-layer keepalive (GU-Q2, content-probed)" },
        apiPresent: glassCaps.dockStrandKeepalive,
    },
    {
        id: "S7",
        title:
            "linear() flat-comma normalize fold (utils.ts timingFunction.replace) " +
            "→ value.js VJ-L2 FunctionValue.toString() fix",
        // The WORKAROUND is the flat-comma → space fold on the timing-function
        // string (NOT the `LINEAR_PAREN_PREFIX` cheap prefix guard, which stays —
        // a non-`linear(` string must never reach the throwing value.js parser).
        // The fold was `timingFunction.replace(/,\s*(-?[\d.]+%)/g, " $1")`.
        witness: {
            subpath: "src/animation/compile/parse-flatten.ts",
            fileFilter: exact("src/animation/compile/parse-flatten.ts"),
            pattern: /timingFunction\.replace/,
        },
        sibling: { pkg: "@mkbabb/value.js", version: "0.14.0", name: "VJ-L2 linear() serialize fix" },
        apiPresent: vjsCaps.linearSerialize,
    },
    {
        id: "S8",
        title:
            "FN_NAME flatten-origin provenance carrier (utils.ts) " +
            "→ value.js VJ-Q4 first-class clone()-preserved ValueUnit.fnName",
        // The recurrence-resistant pattern: the FN_NAME carrier OR any new
        // `Symbol("kf.` stamped onto a published class (the broader bite the
        // spec's §Bite names).
        //
        // P.W11 / O.W16 §S3 swapped the foreign `Symbol("kf.fnName")` stamp for a
        // kf-internal `WeakMap<ValueUnit,string>` (`FN_NAME_MAP`). That dissolved
        // the FOREIGN-OBJECT-ANNOTATION breach (the realm is clean — certified by
        // the separate `proof:no-foreign-symbol-stamp` gate), but it did NOT
        // retire the S8 TRIPWIRE: the WeakMap does not survive `ValueUnit.clone()`,
        // so the clone-restamp ceremony stayed. value.js 1.2.0 (VJ-Q4) ships the
        // first-class `clone()`-preserved `ValueUnit.fnName` field — kf now sets
        // that PUBLIC value.js field at flatten time and reads it back directly,
        // RETIRING the WeakMap + the ceremony entirely. ABSENT → GREEN (the
        // `FN_NAME_MAP` witness gone). The `apiPresent` content-probe writes a
        // `ValueUnit` with `fnName` and confirms `clone()` preserves it (VJ-Q4),
        // so the arm only goes RED (delete-overdue) once the published field is
        // actually consumable, never on a bare version bump.
        witness: {
            subpath: "src/animation/compile/parse-flatten.ts",
            fileFilter: exact("src/animation/compile/parse-flatten.ts"),
            pattern: /FN_NAME|Symbol\(\s*["']kf\./,
        },
        sibling: { pkg: "@mkbabb/value.js", version: "1.2.0", name: "VJ-Q4 clone()-preserved ValueUnit.fnName field" },
        apiPresent: vjsCaps.flatLeaf,
    },
    {
        id: "S9",
        title:
            "direct @mkbabb/parse-that import (utils.ts:1) reaching through value.js's " +
            "parser abstraction → value.js VJ-L3 parseCSSSubValue",
        witness: {
            subpath: "src/animation/compile/parse-flatten.ts",
            fileFilter: exact("src/animation/compile/parse-flatten.ts"),
            pattern: /from\s+["']@mkbabb\/parse-that["']/,
        },
        // value.js Tranche P shipped VJ-L3 (`parseCSSSubValue`) at 1.1.0 — kf
        // consumed it (O.W16 §S4): the parse-that composition is replaced by the
        // single `parseCSSSubValue(strValue, { subProperty })` call, the direct
        // @mkbabb/parse-that production dep is dropped, and this arm is ABSENT →
        // GREEN. The W96 parse-that source-scan (proof:boundary §4b) is the
        // companion no-direct-parse-that-import guard.
        sibling: { pkg: "@mkbabb/value.js", version: "1.1.0", name: "VJ-L3 parseCSSSubValue helper" },
        apiPresent: vjsCaps.parseCSSSubValue,
    },
];

// ── Run the arms ─────────────────────────────────────────────────────────────

console.log(
    "proof:workaround-deletion — L.W9 Band-B (the three-state consume-edge deletion ledger)\n",
);

const states = []; // { id, state: GREEN|PENDING|RED, detail }

for (const arm of arms) {
    const hits = grepTree(
        arm.witness.subpath,
        arm.witness.fileFilter,
        arm.witness.pattern,
    );

    if (hits.length === 0) {
        // ABSENT → GREEN. The workaround is gone; the cure is consumed.
        console.log(`  ✓ ${arm.id} GREEN — ABSENT. ${arm.title}`);
        console.log(`      (no workaround pattern in ${arm.witness.subpath})`);
        states.push({ id: arm.id, state: "GREEN", detail: "ABSENT" });
        continue;
    }

    // PRESENT — probe the paired sibling publish.
    const where = hits.map((h) => `${h.file}:${h.line}`).join(", ");
    const pub = probePublish(arm.sibling.pkg, arm.sibling.version);
    // RED requires the REPLACEMENT API to genuinely exist, not just the version.
    const apiLanded = arm.apiPresent === undefined || arm.apiPresent === true;

    if (pub === "PUBLISHED" && apiLanded) {
        // PRESENT + PUBLISHED + API LANDED → RED. The sibling fixed the root; kf
        // has not consumed. The deletion is OVERDUE and now SAFE.
        console.error(
            `  ✗ ${arm.id} RED — PRESENT + sibling PUBLISHED. ${arm.title}`,
        );
        console.error(
            `      workaround at ${where}; ${arm.sibling.pkg}@${arm.sibling.version} ` +
                `(${arm.sibling.name}) IS published — DELETE the workaround and re-pin.`,
        );
        states.push({
            id: arm.id,
            state: "RED",
            detail: `PRESENT @ ${where}; ${arm.sibling.pkg}@${arm.sibling.version} PUBLISHED`,
        });
    } else {
        // PRESENT + (API-not-landed | UNPUBLISHED | INDETERMINATE) → PENDING.
        const why =
            pub === "PUBLISHED" && arm.apiPresent === false
                ? `${arm.sibling.pkg}@${arm.sibling.version} is published but its ${arm.sibling.name} has NOT landed (value.js O shipped VJ-L2 only) — held until the API ships`
                : pub === "UNPUBLISHED"
                  ? `${arm.sibling.pkg}@${arm.sibling.version} is NOT YET published (E404)`
                  : `${arm.sibling.pkg}@${arm.sibling.version} publish state INDETERMINATE (registry unreachable — conservatively PENDING)`;
        console.log(
            `  … ${arm.id} PENDING — PRESENT + sibling UNPUBLISHED. ${arm.title}`,
        );
        console.log(
            `      workaround at ${where}; ${why}. Deleting now would break the ` +
                `consumer — held until ${arm.sibling.name} ships.`,
        );
        states.push({
            id: arm.id,
            state: "PENDING",
            detail: `PRESENT @ ${where}; ${why}`,
        });
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────

const red = states.filter((s) => s.state === "RED");
const pending = states.filter((s) => s.state === "PENDING");
const green = states.filter((s) => s.state === "GREEN");

console.log(
    `\nproof:workaround-deletion — ${green.length} GREEN / ${pending.length} PENDING / ${red.length} RED` +
        ` over ${states.length} arms.`,
);
console.log(
    "  state map: " +
        states.map((s) => `${s.id}=${s.state}`).join("  "),
);

if (red.length > 0) {
    console.error(
        `\nproof:workaround-deletion — FAIL (${red.length}): a sibling root-fix is PUBLISHED ` +
            "but the kf workaround is still PRESENT. The deletion is now SAFE and OVERDUE — " +
            "delete the workaround and re-pin the sibling. The arms:\n" +
            red.map((s) => `    ${s.id}: ${s.detail}`).join("\n"),
    );
    process.exit(1);
}

if (pending.length > 0) {
    console.log(
        `\nproof:workaround-deletion — PENDING (${pending.length}): every remaining workaround ` +
            "is PRESENT with its paired sibling-fix UNPUBLISHED. This is the STAGED Band-B state " +
            "(not a failure) — each arm GREENs when the sibling publishes AND kf consumes. " +
            "Exit 0.",
    );
    process.exit(0);
}

console.log(
    "\nproof:workaround-deletion — PASS: every workaround is ABSENT (every sibling cure " +
        "consumed). The consume-edge deletion ledger is fully discharged.",
);
process.exit(0);
