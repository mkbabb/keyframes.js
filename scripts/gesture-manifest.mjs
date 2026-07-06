/**
 * gesture-manifest — the MACHINE-READABLE per-scene gesture census (S.G3 S6, SG-8).
 *
 * The demo's best interactions were SEALED (fold row 67, the hidden-affordance
 * systemic): cube's gesture grammar invisible; spring's derby, easing's gallery,
 * the square's tumble, amiga's boing all DOUBLE-CLICK-only (nonexistent on touch);
 * sequence's headline drag-to-retime tell-less. S.G3 surfaces each with an on-stage
 * TELL and a touch path pinned to a RELIABLE primitive, and makes the census
 * machine-readable so the claim is FALSIFIABLE — the `proof:gesture-manifest` gate
 * browser-actuates every entry, so a documented-but-unreachable gesture cannot pass
 * (the "README'd gesture set" laundering v1 allowed is structurally impossible).
 *
 * Each entry is one census row:
 *   - `scene`  — the scene id (matches `demo/app/scene/scenes.ts`).
 *   - `id`     — the gesture id (namespaces the tell: `scene:id`).
 *   - `label`  — the human description (for the gate log).
 *   - `tell`   — a CSS selector for the ON-STAGE TELL (the visible affordance hint).
 *                REQUIRED — a manifest entry WITHOUT a tell is a hard RED (the tell
 *                requirement bites; surfacing the affordance is mandatory).
 *   - `touch`  — the browser-actuated TOUCH PATH. `kind` MUST be a reliable
 *                primitive (`double-tap` / `tap` / `drag`) — NEVER native `dblclick`
 *                synthesis (unreliable across mobile browsers; the gate refuses it).
 *   - `effect` — the observable proof the gesture FIRED (a class/attr/element the
 *                gate asserts after actuation), so a dead tell cannot pass.
 *
 * The tells are authored in the scene components (the shared GestureLegend stamp,
 * the easing gallery-door button, the inline drafting stamps), each carrying the
 * stable `data-gesture-tell="scene:id"` contract this census points at.
 */

/** The reliable touch primitives (SG-8) — native `dblclick` synthesis is REFUSED. */
export const RELIABLE_TOUCH_KINDS = ["double-tap", "tap", "drag"];

export const GESTURE_MANIFEST = [
    // spring — the four-lane derby (spring.md:193 — the pinned pointer-based 300ms
    // double-tap; NEVER native dblclick). Tell: the legend stamp. Effect: the rail
    // enters its `--derby` racing state.
    {
        scene: "spring",
        id: "derby",
        label: "double-tap the rail → the four-lane spring derby",
        tell: '[data-gesture-tell="spring:derby"]',
        touch: { kind: "double-tap", target: ".spring-rail" },
        effect: { kind: "class-appears", selector: ".spring-rail", token: "spring-rail--derby" },
    },
    // cube — the die-roll census ROW is RE-CUT (T.A2): the owner ruled the cube's
    // on-stage GestureLegend stamp OUT (#8), so its `[data-gesture-tell="cube:roll"]`
    // TELL no longer renders. Per lane-18 (never leave a gate pointing at a deleted
    // tell) the row is removed in the SAME motion the legend is deleted — the
    // gesture-manifest KEY survives (spring/amiga/square/easing/sequence rows kept);
    // only the cube row (whose tell the owner removed) is cut. The double-tap Roll
    // egg itself is KEPT in CubeTarget.vue; it is simply no longer census-tracked
    // now that its surfacing legend is gone.
    // amiga — RE-CUT at T.A8/T.A10 (LOCKSTEP): the Boing double-tap EGG is GONE.
    // The Boing IS the scene now (the transport plays the continuous group), the
    // gesture legend was an owner-ruled removal (#8), and the canvas `--boing`
    // state token was retired with the egg — so there is no amiga gesture row to
    // census. The scene's remaining gesture (drag-the-sphere-to-spin) is the
    // subject interaction proved by proof:amiga-subject-is-pivot, not a hidden egg
    // with an on-stage tell. (proof:gesture-manifest's KEY survives — only this
    // scene's row is re-cut.)
    // square — the tumble palette-sweep egg. Tell: the legend stamp. Effect: the box
    // carries `data-palette-sweep` while the barrel-roll's colour sweep is live.
    {
        scene: "square",
        id: "tumble",
        label: "double-tap the box → a barrel-roll palette sweep",
        tell: '[data-gesture-tell="square:tumble"]',
        touch: { kind: "double-tap", target: ".demo-box" },
        effect: { kind: "attr-present", selector: ".demo-box[data-palette-sweep]" },
    },
    // (easing rows RE-CUT at T.E7 — both owner-ruled removals, the lane-18-rec-3
    //  lockstep: the `gallery` row died with the gallery-door button +
    //  useEasingGallery.ts (VERDICT #15 "remove this button"; the T.E6/OD-7
    //  redesigned scene IS the gallery), and the `identify` row died with
    //  EasingCurvePhysics.vue (VERDICT #13 "Remove all of this" — the telemetry
    //  block INCLUDING its "name this curve" dblclick egg). No easing row may
    //  point at a deleted tell.)
    // sequence — the headline drag-to-retime (charter: "tell-less"). Tell: the
    // inline drafting stamp. Effect: a row handle's aria-valuenow changes on drag.
    {
        scene: "sequence",
        id: "retime",
        label: "drag a row handle → re-author its start offset",
        tell: '[data-gesture-tell="sequence:retime"]',
        touch: { kind: "drag", target: ".seq-handle", dx: 22 },
        effect: { kind: "attr-changes", selector: ".seq-handle", attr: "aria-valuenow" },
    },
];
