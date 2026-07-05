import { kfEngine } from "@utils/kfEngine";

// ── The room + the honest arc (T.A9) ────────────────────────────────────────
// The camera frames the ROOM (BOX_SIZE cube), not the rest pose. The authored
// bounce arc lives INSIDE the room walls and is rendered AT AUTHORED SCALE — the
// entire J.W7a frustum-fit apparatus (refreshBounceFraming / BounceScale /
// getBounceScale / BOUNCE_FIT_MARGIN) is DELETED: it crushed the authored ±5
// envelope to ±0.42 (a ball moving less than half its own radius). Now the
// keyframes ARE the rendered excursion.
const BOX_SIZE = 12;

export { BOX_SIZE };

export const SPHERE_RADIUS = 1;

// I.W3 S1 — the ONE centred home for the interactive subject (the room origin =
// the camera look-at = OrbitControls.target). The subject rests centred so a
// centre-drag HITS the mesh (proof:amiga-subject-is-pivot). Every authored arc
// starts AND ends at this home so PLAY cold-enters continuously from rest (no
// teleport — T.A8) and each infinite loop is seamless.
export const SPHERE_HOME = 0;

// The honest arc extents, at authored scale inside the room walls (half = 6):
//   · X sweeps WALL-TO-WALL (±WALL_X), ~4s per crossing, LINEAR (constant speed).
//   · Y slams FLOOR ↔ upper-third under a gravity-flavoured bounce.
//   · Z motion DIES — the original Boing is planar.
//   · spin is LINEAR about a tilted axis, its sign flipping at each wall reversal.
export const WALL_X = 5; // room half (6) − sphere radius (1)
export const FLOOR_Y = -4; // the floor slam (|py| = 4 ≥ 2.5·radius, gate T.A9)
export const APEX_Y = 2; // the upper-third apex
export const SPIN_AMP = Math.PI; // the ±π triangle peak of the linear spin

// The X sweep period: 25%→75% (+WALL_X → −WALL_X) is ONE wall-to-wall crossing =
// half the period, so 4s/crossing ⇒ 8s period. The spin shares this period so
// its sign flips exactly at the X walls (25% / 75%).
export const X_PERIOD_MS = 8000;
export const Y_PERIOD_MS = 1600;

/**
 * The rendered POSE the group composites into — NOT the mesh. `AmigaScene`'s
 * present loop is the SINGLE mesh writer: it composes this pose with the additive
 * gesture offset (T.A7) into the mesh transform each frame. The group's custom
 * `transform` writes here (plain authored-shaped numbers, T.A6), the gesture layer
 * writes an offset, and neither ever `Object.assign`s the mesh — one writer, no
 * last-wins stomp.
 */
export interface AmigaPose {
    px: number;
    py: number;
    pz: number;
    /** The linear spin angle (rad) about the tilted axis (composed in the scene). */
    spin: number;
}

export const SUPER_KEY = "Amiga";

export function useAmigaDemo() {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts.
    const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();

    // The composite pose the group writes each frame (T.A7). Starts at the centred
    // home so a never-played group rests centred.
    const pose: AmigaPose = {
        px: SPHERE_HOME,
        py: SPHERE_HOME,
        pz: SPHERE_HOME,
        spin: 0,
    };

    // T.A6/T.A7 — the group SoA compositor delivers PLAIN authored-shaped vars
    // (numbers where the author wrote numbers), so `vars.position.x` /
    // `vars.rotation.y` arrive as real numbers, never array-boxed ValueUnits. The
    // transform writes the POSE (not the mesh); the scene composes it. No
    // `singleTarget` dodge, no per-frame allocation.
    const transform = (vars: Record<string, any>) => {
        const p = vars.position;
        if (p) {
            if (typeof p.x === "number") pose.px = p.x;
            if (typeof p.y === "number") pose.py = p.y;
        }
        const r = vars.rotation;
        if (r && typeof r.y === "number") pose.spin = r.y;
    };

    // The LINEAR spin (T.A9): a triangle wave synced to the X sweep so |dθ/dt| is
    // constant between wall hits and the sign flips exactly at each wall (25% /
    // 75%, where X reverses). Peaks +π at 25% (X hits +WALL), −π at 75% (X hits
    // −WALL); LINEAR easing keeps every segment's slope equal.
    const spinning = new CSSKeyframesAnimation({
        duration: X_PERIOD_MS,
        iterationCount: Infinity,
        timingFunction: "linear",
    }).fromKeyframes(
        {
            "0%": { rotation: { y: 0 } },
            "25%": { rotation: { y: SPIN_AMP } },
            "50%": { rotation: { y: 0 } },
            "75%": { rotation: { y: -SPIN_AMP } },
            "100%": { rotation: { y: 0 } },
        },
        transform,
    );

    // X — wall-to-wall, LINEAR (constant horizontal velocity), starting/ending at
    // the centred home so PLAY enters continuously.
    const bouncingX = new CSSKeyframesAnimation({
        duration: X_PERIOD_MS,
        iterationCount: Infinity,
        timingFunction: "linear",
    }).fromKeyframes(
        {
            "0%": { position: { x: SPHERE_HOME } },
            "25%": { position: { x: SPHERE_HOME + WALL_X } },
            "50%": { position: { x: SPHERE_HOME } },
            "75%": { position: { x: SPHERE_HOME - WALL_X } },
            "100%": { position: { x: SPHERE_HOME } },
        },
        transform,
    );

    // Y — the floor↔upper-third slam under a gravity-flavoured bounce. Starts and
    // ends at the centred home; the peak |py| = |FLOOR_Y| = 4 ≥ 2.5·radius.
    const bouncingY = new CSSKeyframesAnimation({
        duration: Y_PERIOD_MS,
        iterationCount: Infinity,
        timingFunction: "cubic-bezier(0.36, 0, 0.66, 1)",
    }).fromKeyframes(
        {
            "0%": { position: { y: SPHERE_HOME } },
            "25%": { position: { y: FLOOR_Y } },
            "50%": { position: { y: APEX_Y } },
            "75%": { position: { y: FLOOR_Y } },
            "100%": { position: { y: SPHERE_HOME } },
        },
        transform,
    );

    spinning.name = "Spin";
    spinning.superKey = SUPER_KEY;
    bouncingX.name = "Bouncing X";
    bouncingX.superKey = SUPER_KEY;
    bouncingY.name = "Bouncing Y";
    bouncingY.superKey = SUPER_KEY;

    // T.A7 — the flagship AnimationGroup scene RIDES the group compositor: all
    // three animations composite through the singleTarget SoA blend onto ONE
    // plain-vars pose adapter. No `singleTarget = false` dodge (the group's plain
    // path, T.A6, now consumes the nested shape), no per-animation transform race.
    const animationGroup = new AnimationGroup(spinning, bouncingX, bouncingY);

    return { animationGroup, pose, spinning, bouncingX, bouncingY };
}
