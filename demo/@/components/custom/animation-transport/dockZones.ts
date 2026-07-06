// ─────────────────────────────────────────────────────────────────────────────
// THE DOCK-ZONE CARDINALITY MODEL — T.C1's consume-surface for the elision render.
//
// ⚠ LOCAL ADAPTER · FLAGGED FOR MERGE RECONCILIATION (batch ⑤, parallel lanes).
// T.B5 (lane 1) authors the AUTHORITATIVE cardinality model on the DFA/machine
// projection (`controlSurfaceDFA.ts`: `hasSingleControlSurface` /
// `soleControlSurfaceTab` / `hasSingleAnimation` → the `controlZone`/`channelZone`
// projection). That export was NOT yet visible in this worktree when T.C1's dock
// recut was authored (file-disjoint lanes), so — per the batch-⑤ drive clause
// ("code against the CONTRACT with a thin local adapter and FLAG it; the
// orchestrator reconciles at merge") — this module stands the contract up locally
// as a PURE derivation over the counts the docks already hold. When T.B5's export
// lands, repoint both docks at `@state`'s projection and DELETE this file (the two
// producers agree by construction — this adapter encodes the same arithmetic).
//
// THE CONTRACT (verbatim from waves/T.C.md §T.C1 "The elision RENDER"):
//   controlZone = { kind: "select" | "inline" | "absent" }
//   channelZone = { kind: "select" | "absent" }
//   + the CROSS-AXIS predicate: "is the control-surface identity a strict subset of
//     the scene identity already shown?" (lane 30 rec 4 — the `Spring│Spring` dup
//     #17 killer). A single control surface whose label is redundant with the scene
//     identity the compass already shows renders NOTHING (absent), never a demoted
//     static label.
//
// THE RENDER RULE T.C1 draws from these kinds:
//   • kind:"absent" ⇒ NO node and NO flanking separator.
//   • kind:"inline" ⇒ the tab body with zero dock chrome (no chevron, no dropdown).
//   • kind:"select" ⇒ the real `<Select>` dropdown.
// Per T.C1 ("0 or 1 ⇒ the zone does not exist — no label, no separator") the
// single-surface control case resolves to ABSENT here (the sole surface is always
// redundant with the scene identity on the surviving scene set: easing→"Easing",
// spring→"Spring"). The "inline" arm is carried in the union for forward-parity
// with T.B5's model but is not emitted by this adapter's default derivation.
// ─────────────────────────────────────────────────────────────────────────────

/** The control-tab zone kind (ChromeDock's controls `<Select>`). */
export type ControlZoneKind = "select" | "inline" | "absent";

/** The channel zone kind (TransportDock's animation `<Select>`). */
export type ChannelZoneKind = "select" | "absent";

export interface ControlZone {
    readonly kind: ControlZoneKind;
}
export interface ChannelZone {
    readonly kind: ChannelZoneKind;
}

/** Case-insensitive strict-subset identity check — the cross-axis redundancy
 *  predicate ("is this control label already the scene identity the compass
 *  shows?"). A single-surface label that equals the scene identity is redundant. */
function isRedundantWithScene(
    label: string | undefined,
    sceneIdentity: string | undefined,
): boolean {
    if (!label || !sceneIdentity) return false;
    return label.trim().toLowerCase() === sceneIdentity.trim().toLowerCase();
}

/**
 * Derive the control-tab zone from the tab COUNT × the scene identity (cross-axis).
 * `>1` ⇒ select; `1` ⇒ absent when the sole tab is redundant with the scene
 * identity (always true on the surviving scene set) else inline; `0` ⇒ absent.
 */
export function controlZone(
    tabCount: number,
    soleLabel?: string,
    sceneIdentity?: string,
): ControlZone {
    if (tabCount > 1) return { kind: "select" };
    if (tabCount === 1) {
        return isRedundantWithScene(soleLabel, sceneIdentity)
            ? { kind: "absent" }
            : { kind: "inline" };
    }
    return { kind: "absent" };
}

/**
 * Derive the channel zone from the animation-name COUNT. `>1` ⇒ select; `≤1` ⇒
 * absent (T.C1: "One or zero ⇒ zone absent" — a lone animation is the scene's
 * identity, transported without a dead 1-item dropdown or a demoted static name).
 */
export function channelZone(nameCount: number): ChannelZone {
    return nameCount > 1 ? { kind: "select" } : { kind: "absent" };
}
