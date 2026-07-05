// scripts/lib/glass-caps.mjs — the SINGLE glass-ui consumed-dist capability probe
// (T.H2 · charter §5 lockstep). BEFORE this module, `proof:workaround-deletion`
// computed the `glassCaps` shape inline; the T.H gap-ledger tripwire
// (`proof:glass-ui-gap-tripwire`) needs the SAME cap shape, and the T.H1 edge is
// explicit: the two gates must read ONE source of the cap shape (else they can
// DISAGREE — the cap-name discipline in KF-TO-GLASSUI-BG.md §1). So the probe is
// hoisted here and BOTH gates import it. Never a second copy.
//
// Every cap is a DEVICE-INDEPENDENT DIST-CONTENT GREP over the INSTALLED
// `@mkbabb/glass-ui/dist/*.js` (a string match, not a timing measurement, not a
// mounted-component readback — the mounted-DOM oracle is the SEPARATE,
// device-bearing `proof:glassui-aria-ask` gate, kept distinct so these gates stay
// portable). A cap is TRUE iff the consumed dist carries the cure's structural
// signature; FALSE (→ PENDING / vacuously-green tripwire) while the fix is
// UNPUBLISHED — never a false-RED before the fix ships.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Read a glass-ui dist file's content ("" if absent — content false → PENDING). */
function distFile(rel) {
    try {
        return readFileSync(
            join(root, "node_modules/@mkbabb/glass-ui/dist", rel),
            "utf8",
        );
    } catch {
        return "";
    }
}

/** The INSTALLED @mkbabb/glass-ui version (the tripwire's version dimension), or
 *  null when the package is absent. Read straight from the installed
 *  package.json (the `exports` map forbids require('<pkg>/package.json')). */
export function installedGlassUiVersion() {
    try {
        return (
            JSON.parse(
                readFileSync(
                    join(root, "node_modules/@mkbabb/glass-ui/package.json"),
                    "utf8",
                ),
            ).version ?? null
        );
    } catch {
        return null;
    }
}

/**
 * The consumed-dist capability shape — the SINGLE source both
 * `proof:workaround-deletion` and `proof:glass-ui-gap-tripwire` read.
 *
 *   ariaGuard               — BG-1: the SegmentedTabs pill no longer emits
 *                             `aria-orientation` UNCONDITIONALLY on `role=group`
 *                             (a role-conditional `: void 0` else-arm ships).
 *   dockStrandKeepalive     — GU-4: the collapse-crossfade holds the active
 *                             `.dock-layer` interactive (no swallowed pointerdown).
 *   dockDismissHold         — GU-3 (NEW, T.H2): the dock's own dismiss-pointerdown
 *                             respects `keepOpen()` holds (no self-collapse under
 *                             its own open popover).
 *   dockDropdownPointerdown — BG-4 (NEW, T.H2): `DockDropdownTrigger` opens on
 *                             pointerdown (parity with `DockSelectTrigger`), so the
 *                             press-scale reflow no longer strands the click.
 *
 * The two EXISTING caps (ariaGuard / dockStrandKeepalive) are moved here VERBATIM
 * from proof-workaround-deletion.mjs — the single-source hoist, byte-for-byte the
 * same grep shape.
 */
export function computeGlassCaps() {
    const tabsDist = distFile("tabs.js");
    const dockDist = distFile("dock.js");

    // ariaGuard — an `aria-orientation` PROP-BIND whose value carries a
    // role-conditional `: void 0`/`: undefined`/`: null` else arm (present ONLY
    // after the BG-1 SFC guard ships). The UNCONDITIONAL 4.0.1 emit
    // (`aria-orientation": L.value ? "vertical" : "horizontal"`) carries no
    // suppress-else → no match → false → PENDING.
    const ariaGuard = (() => {
        if (!tabsDist) return false;
        const BIND = /aria-orientation["']\s*:\s*([^,}\n]{0,120})/g;
        let m;
        while ((m = BIND.exec(tabsDist)) !== null) {
            if (/:\s*(?:void 0|undefined|null)\b/.test(m[1])) return true;
        }
        return false;
    })();

    // dockStrandKeepalive — the active `.dock-layer` RETAINS pointer-events/hit-test
    // across the crossfade (the cure-specific token the BG cut introduces). The
    // installed 4.0.1 dock carries only the UNRELATED `useDockClickIntegrity` +
    // `pointer-events-none` on the indicator → false → PENDING.
    const dockStrandKeepalive = (() => {
        if (!dockDist) return false;
        return (
            /dock-layer[^]{0,400}?(?:pointer-events:\s*auto|pointer-events-auto|keep-?alive)/i.test(
                dockDist,
            ) ||
            /(?:keep-?alive|keepActiveLayer|retainActiveLayer)[^]{0,200}?dock-layer/i.test(
                dockDist,
            )
        );
    })();

    // dockDismissHold (GU-3, NEW) — the cure makes the dock's own
    // dismiss-pointerdown CONSULT the `keepOpen()` hold state before self-
    // collapsing. Its structural signature: a dismiss / pointer-down-outside
    // handler token CO-LOCATED with the `keepOpen`/hold-count state. The installed
    // 4.0.1 dock carries the `keepOpen` API but NO dismiss-outside handler that
    // reads it (ChromeDock re-implements the re-expand watch) → false → the GU-3
    // tripwire is vacuously green today, flips the instant the cure lands.
    const dockDismissHold = (() => {
        if (!dockDist) return false;
        return (
            /keepOpen[^]{0,600}?(?:pointerDownOutside|onDismiss|dismissRespect|respectsKeepOpen|dismissHold|holdGuard)/i.test(
                dockDist,
            ) ||
            /(?:pointerDownOutside|onDismiss|dismissRespect|respectsKeepOpen|dismissHold|holdGuard)[^]{0,600}?keepOpen/i.test(
                dockDist,
            )
        );
    })();

    // dockDropdownPointerdown (BG-4, NEW) — the cure gives `DockDropdownTrigger`
    // pointerdown-open PARITY with `DockSelectTrigger` (the letter's proposed
    // `trigger-action="pointerdown"` prop / open-on-pointerdown). Its structural
    // signature: `DockDropdownTrigger` co-located with an explicit
    // pointerdown-open marker. The installed 4.0.1 opens the dropdown on CLICK
    // (MbabbMenu synthesizes reka's click on pointerdown to route around the
    // press-scale reflow), so no pointerdown-open marker sits by
    // `DockDropdownTrigger` → false → PENDING.
    const dockDropdownPointerdown = (() => {
        if (!dockDist) return false;
        return (
            /DockDropdownTrigger[^]{0,600}?(?:openOnPointerDown|pointerdownOpen|trigger-action|triggerAction|pointerdownTrigger)/i.test(
                dockDist,
            ) ||
            /(?:openOnPointerDown|pointerdownOpen|pointerdownTrigger)[^]{0,600}?DockDropdown/i.test(
                dockDist,
            )
        );
    })();

    return {
        ariaGuard,
        dockStrandKeepalive,
        dockDismissHold,
        dockDropdownPointerdown,
    };
}

/** The computed cap shape (evaluated once at import — the dist does not change
 *  mid-run). Both consuming gates read THIS object. */
export const glassCaps = computeGlassCaps();
