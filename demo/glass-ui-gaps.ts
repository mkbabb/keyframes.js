/**
 * demo/glass-ui-gaps.ts — THE glass-ui gap ledger (T.H1).
 *
 * The demo carries a small set of load-bearing hand-rolls that exist ONLY because
 * a glass-ui ask has not published — three band-aids (KfPillTabs, usePlayActuation,
 * the MbabbMenu synthesis) each independently re-declared "P-invariant-28 forbids
 * the Nth carry" and survived anyway, because NONE pointed at a shared ledger and
 * no gate fired when the gap closed. This is that ledger: ONE registry every
 * band-aid file imports and cites, so a reviewer sees in one place "these die when
 * glass-ui BG/BH lands", and the `proof:glass-ui-gap-tripwire` gate FAILS the
 * instant a gap's fix is satisfied in the consumed dist while its workaround site
 * still exists (the self-justifying-carry killer — the version TRIPWIRE).
 *
 * Each entry names: the consumed-dist DEFECT, the letter ASK it dispatches
 * (KF-TO-GLASSUI-BG.md §0), the `glassCaps` probe key (the SINGLE dist-content cap
 * scripts/lib/glass-caps.mjs computes — reused by proof:workaround-deletion, never
 * a second copy), the WORKAROUND SITE(S) that die on the re-pin, and the acceptance
 * gate that flips. A `glassCap: null` / empty-`workaroundSites` row is a RECORDED
 * gap with no kf band-aid (a render/perf/type ask) — kept here for the version
 * dimension, never a tripwire arm.
 *
 * inv-16: kf NEVER patches glass-ui in-demo — every entry is a glass-ui-root fix
 * dispatched by the letter; the kf side is the band-aid held until the publish.
 */

/** One `glassCaps` probe key (scripts/lib/glass-caps.mjs) — or `null` for a
 *  recorded render/perf/type gap with no dist-content cap. */
export type GlassCapKey =
    | "ariaGuard"
    | "dockStrandKeepalive"
    | "dockDismissHold"
    | "dockDropdownPointerdown"
    | "drawerDetentInset"
    | null;

export interface GlassUiGap {
    /** The letter ask id(s) in KF-TO-GLASSUI-BG.md §0. */
    readonly ask: string;
    /** The consumed-dist defect, one line. */
    readonly defect: string;
    /** The `glassCaps` cap key that flips true when the cure ships (null = a
     *  recorded gap with no dist-content cap: a render/perf/type ask). */
    readonly glassCap: GlassCapKey;
    /** The glass-ui version/cut expected to fix it (the version dimension). */
    readonly fixVersion: string;
    /** Repo-relative kf workaround site(s) that die on the re-pin (empty for a
     *  recorded no-band-aid gap). Each listed site MUST cite this ledger entry
     *  (a `GLASSUI-GAP:` marker) OR import @mkbabb/glass-ui — proof:glass-ui-gap-
     *  tripwire's lane-25-rec-2 clause reds a replacement site with neither. */
    readonly workaroundSites: readonly string[];
    /** The kf-side acceptance gate that flips on the re-pin (a real proof:* key),
     *  or a delineated non-blocking GAP note for the BG-7..BG-10 asks. */
    readonly acceptanceGate: string;
}

export const GLASS_UI_GAPS = {
    // ── The four workaround-bearing gaps (tripwire arms) ─────────────────────
    segmentedTabsAriaOrientation: {
        ask: "BG-1 + BG-3",
        defect:
            "SegmentedTabs pill emits aria-orientation UNCONDITIONALLY on role=group " +
            "(WAI-ARIA 1.2 §6.3) — and couples material to role (pill ⇒ role=group)",
        glassCap: "ariaGuard",
        fixVersion: "@mkbabb/glass-ui BG/BH (aria guard + material↔role decouple)",
        workaroundSites: [
            "demo/@/components/custom/instrument/transport/KfPillTabs.vue",
            "demo/@/components/custom/instrument/transport/useKfPillTabs.ts",
        ],
        acceptanceGate: "proof:glassui-aria-ask",
    },
    dockStrandKeepalive: {
        ask: "GU-4",
        defect:
            "the collapse-crossfade sets the active .dock-layer pointer-events:none " +
            "before the trailing click synthesizes — stranding a @click-only play toggle",
        glassCap: "dockStrandKeepalive",
        fixVersion: "@mkbabb/glass-ui BG/BH (dock-layer keepalive)",
        workaroundSites: [
            "demo/@/components/custom/instrument/transport/TransportDock.vue",
            "demo/@/components/custom/instrument/transport/composables/usePlayActuation.ts",
        ],
        acceptanceGate: "proof:workaround-deletion",
    },
    dockDropdownPointerdown: {
        ask: "BG-4",
        defect:
            "DockDropdownTrigger opens on click while DockSelectTrigger opens on " +
            "pointerdown; the press-scale reflow (scale:.96) drops the native click",
        glassCap: "dockDropdownPointerdown",
        fixVersion: "@mkbabb/glass-ui BG/BH (DockDropdownTrigger pointerdown parity)",
        workaroundSites: ["demo/app/dock/MbabbMenu.vue"],
        acceptanceGate: "proof:dock-popover-opens",
    },
    dockDismissHold: {
        ask: "GU-3",
        defect:
            "the dock's own dismiss-synthetic pointerdown self-collapses it under an " +
            "open popover — the hold contract does not cover its own dismiss path",
        glassCap: "dockDismissHold",
        fixVersion: "@mkbabb/glass-ui BG/BH (dismiss-pointerdown respects keepOpen)",
        workaroundSites: ["demo/app/dock/ChromeDock.vue"],
        acceptanceGate: "proof:workaround-deletion",
    },
    drawerDetentInset: {
        // BG-11 (T.H3): the batch-④ Drawer finding. glass-ui 4.0.1 ALREADY ships
        // `<Drawer mode="live-behind">` — the peek/half/full sheet the demo
        // hand-rolls — BUT a DETENTED Drawer is forced by drawer.css
        // `.glass-drawer[data-glass-drawer-snap-points="true"] { height:100%;
        // max-height:100% }` (+ base `bottom:0`) to fill the viewport at its full
        // detent, overlapping the bottom menubar band at ANY snap. NO blessed prop
        // gives a bottom-inset / max-detent lever. Adopting as-is REGRESSES the
        // owner-verified occlusion cure (52dvh stage-reserve, ≤70dvh never-full-
        // height, never-occlude-menubar). So the T.H3 swap is HELD behind BG-11:
        // the tripwire arms on the drawerDetentInset cap (a bottom-reserve token +
        // a max-detent cap) — cap satisfied ∧ the bespoke sheet still present ⇒ RED
        // (execute the swap). Until then the bespoke sheet is the occlusion-correct
        // choice. The geometry DECISION (hold-the-cure vs adopt-full-height) is
        // owner-open — docs/tranches/T/verdicts/T.H3.md (PENDING-OWNER).
        ask: "BG-11",
        defect:
            "a DETENTED live-behind Drawer is forced to height:100%/bottom:0 (drawer.css " +
            "[data-glass-drawer-snap-points=true]) — its full detent covers the viewport + the " +
            "bottom menubar band; no bottom-inset / max-detent lever exists",
        glassCap: "drawerDetentInset",
        fixVersion:
            "@mkbabb/glass-ui BG/BH (--drawer-inset-block-end bottom-reserve token + max-detent-height cap)",
        // The bespoke peek/half/full sheet the T.H3 swap would delete — held until
        // BG-11 so the Drawer adoption does not regress the occlusion cure. Both
        // sites import @mkbabb/glass-ui (CLAUSE B of the tripwire is satisfied by
        // the import; they are NOT edited by T.H3 — lane-owned).
        workaroundSites: [
            "demo/@/components/custom/instrument/transport/components/ControlsPaneWrapper.vue",
            "demo/@/components/custom/instrument/transport/composables/useSheetGesture.ts",
        ],
        acceptanceGate: "proof:glass-ui-gap-tripwire",
    },

    // ── Recorded no-band-aid gaps (the version dimension; NOT tripwire arms) ──
    // Render / perf / type / catalogue asks with no kf workaround to strand: kf
    // cannot self-cure them, so there is nothing to delete on the re-pin — they
    // are kept here so the ledger is the ONE place the whole gap set is visible.
    dockRestBlur: {
        ask: "GU-1",
        defect:
            "a RESTING dock computes filter: blur(3px) (BB.W-LIQUID-REVEAL bloom not " +
            "gated on [data-morphing]) — destroys legibility + a standing composite pass",
        glassCap: null,
        fixVersion: "@mkbabb/glass-ui BG/BH (reveal-blur gated on [data-morphing])",
        workaroundSites: [],
        acceptanceGate: "proof:dock-rest-crisp",
    },
    dockMorphMeasure: {
        ask: "GU-2",
        defect:
            "the width morph pins un-laid-out endpoints (~14px sliver) then max-content " +
            "releases as a jump-cut — the morph the eye tracks never runs",
        glassCap: null,
        fixVersion: "@mkbabb/glass-ui BG/BH (real laid-out endpoint measurement)",
        workaroundSites: [],
        acceptanceGate: "proof:dock-morph-continuity",
    },
    staticBackdrop: {
        ask: "BG-5",
        defect:
            "backdrop-filter blur over the animating stage re-rasterizes every frame " +
            "(morph 33→116fps, motion-path 43→120fps when neutralized) — a fixed chrome cost",
        glassCap: null,
        fixVersion: "@mkbabb/glass-ui BG/BH (blur-source=\"static\" frozen-backdrop mode)",
        workaroundSites: [],
        acceptanceGate: "proof:blur-not-resampled",
    },
    fontDisplayWeight: {
        ask: "BG-6",
        defect:
            "the display rungs hardcode font-weight:600 (tuned for Jakarta); a single-" +
            "weight Instrument Serif smears synthetic faux-bold — no --font-display-weight token",
        glassCap: null,
        fixVersion: "@mkbabb/glass-ui BG/BH (font-weight: var(--font-display-weight, 600))",
        workaroundSites: [],
        acceptanceGate: "proof:demo-fonts",
    },
    specularWriterPublic: {
        ask: "BG-7",
        defect:
            "the rAF-coalesced createSpecularWriter is internal to Card/DockIconButton — " +
            "no public export for a wash over ordinary DOM (a NAMED gap, never a workaround)",
        glassCap: null,
        fixVersion: "@mkbabb/glass-ui BG/BH (public createSpecularWriter / useSpecularTracking)",
        workaroundSites: [],
        acceptanceGate:
            "GAP: served today by public @mkbabb/glass-ui/aurora (T.D13/OD-2); do NOT hand-copy the internal composable",
    },
} as const satisfies Record<string, GlassUiGap>;

export type GlassUiGapId = keyof typeof GLASS_UI_GAPS;

/** Cite a ledger entry from a band-aid file (the load-bearing import that surfaces
 *  the gap in the live DOM via `:data-glassui-gap`). The returned id is the same
 *  token proof:glass-ui-gap-tripwire's citation clause greps for. */
export function glassUiGap(id: GlassUiGapId): GlassUiGap & { readonly id: GlassUiGapId } {
    return { id, ...GLASS_UI_GAPS[id] };
}
