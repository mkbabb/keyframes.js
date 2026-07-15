// scripts/lib/glass-caps.mjs — the SINGLE glass-ui consumed-dist capability probe
// (T.H2 · charter §5 lockstep). BEFORE this module, `proof:workaround-deletion`
// computed the `glassCaps` shape inline; the T.H gap-ledger tripwire
// (`proof:glass-ui-gap-tripwire`) needs the SAME cap shape, and the T.H1 edge is
// explicit: the two gates must read ONE source of the cap shape (else they can
// DISAGREE — the cap-name discipline in KF-TO-GLASSUI-BG.md §1). So the probe is
// hoisted here and BOTH gates import it. Never a second copy.
//
// Every cap is a DEVICE-INDEPENDENT DIST-CONTENT GREP over the package tarball
// behind the REGISTRY'S `dist-tags.latest` (a string match, not a timing
// measurement, not a mounted-component readback — the mounted-DOM oracle is the
// SEPARATE, device-bearing `proof:glassui-aria-ask` gate, kept distinct so these
// gates stay portable). The frozen installed dist is diagnostic only. A cap is
// TRUE iff the published latest dist carries the cure's structural signature;
// an unavailable registry probe is explicitly INDETERMINATE, never an
// installed-only/vacuous-green claim.

import {
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const PACKAGE = "@mkbabb/glass-ui";

/** Read a glass-ui dist file's content ("" if absent — content false → PENDING). */
function distFileFrom(distRoot, rel) {
    try {
        return readFileSync(join(distRoot, rel), "utf8");
    } catch {
        return "";
    }
}

const installedDistRoot = join(
    root,
    "node_modules/@mkbabb/glass-ui/dist",
);

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
 * Read the registry's latest tag without treating the installed optional
 * dependency as a proxy for the published frontier.  A missing registry
 * response is explicitly INDETERMINATE; callers must not silently substitute
 * the frozen installed dist, which was the U.F5 vacuous-green blind spot.
 */
function latestPublishedVersion() {
    try {
        const stdout = execFileSync(
            "npm",
            ["view", PACKAGE, "dist-tags.latest", "--json", "--silent"],
            {
                cwd: root,
                encoding: "utf8",
                stdio: ["ignore", "pipe", "pipe"],
                timeout: 30_000,
            },
        );
        const value = JSON.parse(String(stdout).trim());
        return typeof value === "string" && value.trim() ? value.trim() : null;
    } catch {
        return null;
    }
}

/**
 * Fetch the exact tarball behind dist-tags.latest into a temporary directory.
 * The temporary package is read-only evidence; it never mutates node_modules,
 * package.json, or the lockfile.  Returning null is an explicit unavailable
 * state, not permission to fall back to installedGlassUiVersion().
 */
function fetchLatestDist() {
    const version = latestPublishedVersion();
    if (!version) {
        return {
            state: "INDETERMINATE",
            version: null,
            distRoot: null,
            cleanupRoot: null,
        };
    }

    const temp = mkdtempSync(join(tmpdir(), "kf-glass-ui-latest-"));
    try {
        const stdout = execFileSync(
            "npm",
            [
                "pack",
                `${PACKAGE}@${version}`,
                "--ignore-scripts",
                "--json",
                "--pack-destination",
                temp,
            ],
            {
                cwd: root,
                encoding: "utf8",
                stdio: ["ignore", "pipe", "pipe"],
                timeout: 120_000,
            },
        );
        const records = JSON.parse(String(stdout));
        const filename = records?.[0]?.filename;
        if (typeof filename !== "string") {
            return { state: "INDETERMINATE", version, distRoot: null, cleanupRoot: temp };
        }
        const tarball = join(temp, filename);
        if (!existsSync(tarball)) {
            return { state: "INDETERMINATE", version, distRoot: null, cleanupRoot: temp };
        }
        execFileSync("tar", ["-xzf", tarball, "-C", temp], {
            cwd: root,
            stdio: ["ignore", "ignore", "pipe"],
            timeout: 30_000,
        });
        const packageRoot = join(temp, "package");
        const packageVersion = (() => {
            try {
                return JSON.parse(
                    readFileSync(join(packageRoot, "package.json"), "utf8"),
                ).version;
            } catch {
                return null;
            }
        })();
        if (packageVersion !== version || !existsSync(join(packageRoot, "dist"))) {
            return { state: "INDETERMINATE", version, distRoot: null, cleanupRoot: temp };
        }
        return {
            state: "PUBLISHED",
            version,
            distRoot: join(packageRoot, "dist"),
            cleanupRoot: temp,
        };
    } catch {
        return { state: "INDETERMINATE", version, distRoot: null, cleanupRoot: temp };
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
 *   drawerDetentInset       — BG-11 (NEW, T.H3): a DETENTED live-behind `Drawer`
 *                             gains a bottom-reserve token
 *                             (`--drawer-inset-block-end`) + a max-detent-height CAP,
 *                             so a full detent no longer forces height:100%/bottom:0
 *                             over the bottom menubar band. Today the consumed
 *                             `dist/styles/drawer.css` snap-points selector is
 *                             `height:100%; max-height:100%` with NO inset lever →
 *                             false → the T.H3 Drawer swap stays HELD (the occlusion
 *                             cure would regress); flips true when the cure ships.
 *
 * The two EXISTING caps (ariaGuard / dockStrandKeepalive) are moved here VERBATIM
 * from proof-workaround-deletion.mjs — the single-source hoist, byte-for-byte the
 * same grep shape.
 */
export function computeGlassCaps(distRoot = installedDistRoot) {
    const tabsDist = distFileFrom(distRoot, "tabs.js");
    const dockDist = distFileFrom(distRoot, "dock.js");
    const drawerCss = distFileFrom(distRoot, "styles/drawer.css");

    // ariaGuard — an `aria-orientation` PROP-BIND whose value carries a
    // role-conditional `: void 0`/`: undefined`/`: null` else arm (present ONLY
    // after the BG-1 SFC guard ships). The UNCONDITIONAL 4.2.0 emit
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
    // installed 4.2.0 dock carries only the UNRELATED `useDockClickIntegrity` +
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
    // 4.2.0 dock carries the `keepOpen` API but NO dismiss-outside handler that
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
    // pointerdown-open marker. The installed 4.2.0 opens the dropdown on CLICK
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

    // drawerDetentInset (BG-11, NEW) — the cure gives a DETENTED live-behind
    // Drawer a bottom-reserve lever + a genuine max-detent cap. Its structural
    // signature: the drawer stylesheet declares the proposed
    // `--drawer-inset-block-end` token AND the detented (snap-points) selector no
    // longer fills the viewport unconditionally — its `max-height` is CAPPED
    // (references calc/min/clamp/var or the inset token) rather than a bare
    // `100%`/`100vh`. The installed 4.2.0 drawer.css forces
    // `.glass-drawer[data-glass-drawer-snap-points="true"] { height:100%;
    // max-height:100% }` with `bottom:0` and NO inset token (VERIFIED) → false →
    // the T.H3 tripwire is vacuously green today (the bespoke sheet is still the
    // occlusion-correct choice), flips the instant the cure lands.
    const drawerDetentInset = (() => {
        if (!drawerCss) return false;
        const tokenPresent = /--drawer-inset-block-end/.test(drawerCss);
        // Isolate the detented (snap-points) rule block and read its max-height.
        const m = drawerCss.match(
            /\.glass-drawer\[data-glass-drawer-snap-points\s*=\s*["']true["']\]\s*\{([\s\S]*?)\}/,
        );
        const detentBlock = m ? m[1] : "";
        const maxH = (detentBlock.match(/max-height\s*:\s*([^;]+);/) || [])[1] || "";
        const detentCapped =
            /calc\(|min\(|clamp\(|var\(|--drawer-inset-block-end/.test(maxH) &&
            !/^\s*(?:100%|100vh|100dvh|none)\s*$/.test(maxH);
        return tokenPresent && detentCapped;
    })();

    return {
        ariaGuard,
        dockStrandKeepalive,
        dockDismissHold,
        dockDropdownPointerdown,
        drawerDetentInset,
    };
}

/**
 * The computed cap shape (evaluated once at import — the dist does not change
 * mid-run). Both consuming gates read THIS object.  The authoritative source is
 * always the fetched dist behind `dist-tags.latest`; installed 4.0.x is retained
 * only as diagnostic evidence.  If the registry probe is unavailable, all caps
 * remain false and `glassCapsMeta.state` is INDETERMINATE — no installed-only
 * fallback can make the tripwire vacuously green.
 */
const latestSnapshot = fetchLatestDist();
const installedCaps = computeGlassCaps(installedDistRoot);
const latestCaps =
    latestSnapshot.state === "PUBLISHED" && latestSnapshot.distRoot
        ? computeGlassCaps(latestSnapshot.distRoot)
        : null;
// OD-U4 keeps the consume edge on the frozen ~4.0.x line until the planned
// glass-ui 5.0.0 release is both published and explicitly adopted. A positive
// cap in an intervening 4.x latest (4.2.0 currently carries ariaGuard) is
// valuable frontier evidence, but it is NOT permission to delete a 4.0.x
// workaround. The consuming gates therefore arm only for the 5.x release line;
// they still print the latest 4.x caps so the drift cannot hide.
const latestMajor = Number.parseInt(
    String(latestSnapshot.version ?? "").split(".")[0],
    10,
);
const consumeEligible =
    latestSnapshot.state === "PUBLISHED" && latestMajor >= 5;

export const glassCaps = latestCaps ?? {
    ariaGuard: false,
    dockStrandKeepalive: false,
    dockDismissHold: false,
    dockDropdownPointerdown: false,
    drawerDetentInset: false,
};

export const glassCapsMeta = Object.freeze({
    state: latestSnapshot.state,
    latestVersion: latestSnapshot.version,
    installedVersion: installedGlassUiVersion(),
    source: latestCaps ? "published-latest" : "unavailable",
    consumeEligible,
    installedCaps,
    latestCaps,
});

// `fetchLatestDist` owns a temporary directory for the extracted tarball.  The
// source root is no longer needed after the capability booleans are computed.
if (latestSnapshot.cleanupRoot) {
    const tempRoot = latestSnapshot.cleanupRoot;
    try {
        rmSync(tempRoot, { recursive: true, force: true });
    } catch {
        // Best-effort cleanup only; a failed cleanup cannot alter cap evidence.
    }
}
