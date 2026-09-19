import type { Vars } from "@mkbabb/keyframes.js";
import { SpringProgress } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { AMIGA_SCENE_ID } from "./amigaKeys";

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

// L-m3 — the floor plane and the shadow's seat on it, declared ONCE. Both were
// re-derived, byte-identically, in the room AND in the scene's per-frame compose:
// two copies of one invariant, one of them re-computed sixty times a second.
/** The plane the ball's contact shadow lies on (the room's floor). */
export const CONTACT_FLOOR = FLOOR_Y - SPHERE_RADIUS;
/** The shadow's own y — the floor plus a z-fighting epsilon. */
export const SHADOW_PLANE_Y = CONTACT_FLOOR + 0.01;
const SPIN_AMP = Math.PI; // the ±π triangle peak of the linear spin

// The X sweep period: 25%→75% (+WALL_X → −WALL_X) is ONE wall-to-wall crossing =
// half the period, so 4s/crossing ⇒ 8s period. The spin shares this period so
// its sign flips exactly at the X walls (25% / 75%).
const X_PERIOD_MS = 8000;
const Y_PERIOD_MS = 1600;

/**
 * The rendered POSE the group composites into — NOT the mesh. `AmigaScene`'s
 * present loop is the SINGLE mesh writer: it composes this pose with the additive
 * gesture offset (T.A7) into the mesh transform each frame. The group's custom
 * `transform` writes here (plain authored-shaped numbers, T.A6), the gesture layer
 * writes an offset, and neither ever `Object.assign`s the mesh — one writer, no
 * last-wins stomp.
 *
 * C-10 — there is no `pz`. The original Boing is PLANAR and the file said so
 * ("Z motion DIES"), yet the channel was carried through four surfaces: allocated
 * on the pose, allocated on the re-seat's origin, copied by the compose, read by
 * the mesh write and published by the probe — while NOTHING ever wrote it. The
 * comment named the cure; the channel is gone and the mesh takes the room's home
 * plane directly.
 */
export interface AmigaPose {
    px: number;
    py: number;
    /** The linear spin angle (rad) about the tilted axis (composed in the scene). */
    spin: number;
}

/**
 * C-12 + L-i2 — the scene's OWN `Vars` instantiation, so the authored shape is
 * CHECKED instead of guarded. `Vars`'s index signature admits `number | string |
 * any` at every leaf, so the transform below had to interrogate each leaf with a
 * `typeof` and SILENTLY DROP whatever failed — a posture that turns an authoring
 * mistake (`{ x: "5px" }` in a scene whose sink takes world units) into a channel
 * that quietly never moves. Narrowed here, the same mistake is a compile error at
 * the keyframe that makes it, and the guards become presence checks.
 */
export type AmigaVars = Vars & {
    position?: { x?: number; y?: number };
    rotation?: { y?: number };
};

/** The three channels the stage actually composes (Z is not one — see AmigaPose). */
export interface PoseOffset {
    px: number;
    py: number;
    spin: number;
}

/**
 * D-3 + C-18 + M-3 + L-M4/C-2 — THE CONTINUITY LANES: one mechanism for every
 * seam, three PER-CHANNEL springs.
 *
 * A seam is any instant where the stage changes who authors its pose — the group
 * stopping (the pose hands over to HOME), the group resuming, a scrub taking the
 * stage from an in-flight settle. The T.A8 contract says a seam is never a
 * teleport, and the scene used to keep it in one direction only: the stop settle
 * was a 0→1 `SpringProgress` LERPING the stage home, while resume assigned
 * `rendered = pose` in a single frame — the exact `position.set` snap the
 * contract forbids.
 *
 * The lanes invert the shape. The scene renders `authority + offset`, where the
 * offset is the DISCONTINUITY the seam introduced and each lane decays its own
 * channel to zero. Two properties fall out that a shared progress scalar cannot
 * have:
 *
 *  · **Value continuity at every seam, in both directions.** The offset is
 *    seeded as `rendered − authority`, so the first composed frame after a seam
 *    is byte-identical to the last frame before it, whatever the authority does
 *    next — a moving pose included (the target may travel; the offset still
 *    converges, because ITS target is zero).
 *  · **Velocity continuity per channel (L-M4/C-2).** The stop re-seat seeded
 *    `initialVelocity: 0` while the X channel is LINEAR and carries |v| ≡ 2.5
 *    u/s at every instant, so no stop was kink-free; and one progress scalar
 *    cannot match three independent channel velocities anyway (the adjudicated
 *    ruling that KILLED the `reseatToSpring` drop-in). Each lane takes its OWN
 *    channel's entry velocity, relative to the authority's.
 *
 * The three springs are long-lived and re-seeded per seam (`reset` + target),
 * never allocated per transition — L-i3, the library's own "FEW and long-lived"
 * allocation note, which the per-stop `new SpringProgress` was breaking.
 */
export interface PoseContinuity {
    /** The live per-channel offset; a STABLE object, mutated in place. */
    readonly offset: Readonly<PoseOffset>;
    /** True while any lane is still carrying a seam. */
    readonly live: boolean;
    /** Seat a seam: the per-channel value gap and the RELATIVE entry velocity. */
    seed(gap: PoseOffset, velocity: PoseOffset): void;
    /** Collapse every lane NOW (the reduced-motion arm — elided, never faked). */
    snap(): void;
    /** Advance every lane by `dt` MILLISECONDS. */
    tick(dt: number): void;
}

const POSE_CHANNELS = ["px", "py", "spin"] as const;

export function createPoseContinuity(options?: {
    response?: number;
    dampingFraction?: number;
}): PoseContinuity {
    const springOptions = {
        initial: 0,
        response: options?.response ?? 0.4,
        dampingFraction: options?.dampingFraction ?? 1,
    };
    const lanes: Record<(typeof POSE_CHANNELS)[number], SpringProgress> = {
        px: new SpringProgress(springOptions),
        py: new SpringProgress(springOptions),
        spin: new SpringProgress(springOptions),
    };
    const offset: PoseOffset = { px: 0, py: 0, spin: 0 };
    let live = false;

    return {
        offset,
        get live() {
            return live;
        },
        seed(gap, velocity) {
            live = false;
            for (const channel of POSE_CHANNELS) {
                const lane = lanes[channel];
                // `reset(x, v)` seats position AND velocity; the target write
                // re-seats the closed form from that state (continuous by
                // construction) and un-settles the lane.
                lane.reset(gap[channel], velocity[channel]);
                lane.target = 0;
                offset[channel] = lane.settled ? 0 : lane.value;
                if (!lane.settled) live = true;
            }
        },
        snap() {
            live = false;
            for (const channel of POSE_CHANNELS) {
                lanes[channel].reset(0, 0);
                offset[channel] = 0;
            }
        },
        tick(dt) {
            if (!live || dt <= 0) return;
            live = false;
            for (const channel of POSE_CHANNELS) {
                const lane = lanes[channel];
                lane.tickDt(dt);
                if (lane.settled) {
                    offset[channel] = 0;
                } else {
                    offset[channel] = lane.value;
                    live = true;
                }
            }
        },
    };
}

export function useAmigaDemo() {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts.
    const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();

    // The composite pose the group writes each frame (T.A7). Starts at the centred
    // home so a never-played group rests centred.
    const pose: AmigaPose = {
        px: SPHERE_HOME,
        py: SPHERE_HOME,
        spin: 0,
    };

    // T.A6/T.A7 — the group compositor delivers nested authored values (numbers
    // where the author wrote numbers). The transform writes the POSE, not the
    // mesh; the scene composes it. No `singleTarget` dodge or per-frame allocation.
    const transform = (vars: AmigaVars) => {
        const p = vars.position;
        if (p?.x !== undefined) pose.px = p.x;
        if (p?.y !== undefined) pose.py = p.y;
        // C-13 — the channel is AUTHORED as `rotation.y` because that is the
        // keyframe grammar's name for it; what it drives is the spin angle about
        // the scene's 0.28-rad TILTED axis, composed in AmigaScene. One value,
        // two frames of reference, and the authored name is not the rendered one.
        if (vars.rotation?.y !== undefined) pose.spin = vars.rotation.y;
    };

    // The LINEAR spin (T.A9): a triangle wave synced to the X sweep so |dθ/dt| is
    // constant between wall hits and the sign flips exactly at each wall (25% /
    // 75%, where X reverses). Peaks +π at 25% (X hits +WALL), −π at 75% (X hits
    // −WALL); LINEAR easing keeps every segment's slope equal.
    //
    // MISSED-I — a triangle wave is a LOOK, not a roll: a ball of radius 1
    // rolling the 10-unit crossing would turn 10 rad, and this turns π. The
    // amplitude is chosen for the eye, and nothing downstream derives it.
    const spinning = new CSSKeyframesAnimation<AmigaVars>({
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
    const bouncingX = new CSSKeyframesAnimation<AmigaVars>({
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
    //
    // MISSED-E — the easing is PER SEGMENT, because gravity is. One shared
    // `cubic-bezier(0.36, 0, 0.66, 1)` used to govern all five keyframes, and
    // that curve has zero slope at BOTH control endpoints: the ball was slowest
    // at the floor slam and at the apex alike, and fastest mid-flight — the
    // inverse of the physics the comments claim twice. A falling body ACCELERATES
    // into the floor (ease-in) and DECELERATES into the apex (ease-out), so each
    // segment carries the easing its own direction of travel earns. The one thing
    // a keyframe engine's flagship scene showcases is the curve; it now tells the
    // truth. Authored through `addFrame`, which takes the per-frame timing
    // function `fromKeyframes` has no seat for — the frame's easing governs the
    // interval that STARTS at it.
    const FALL = "cubic-bezier(0.42, 0, 1, 1)"; // ease-in: slow → fast (down)
    const RISE = "cubic-bezier(0, 0, 0.58, 1)"; // ease-out: fast → slow (up)
    const bouncingY = new CSSKeyframesAnimation<AmigaVars>({
        duration: Y_PERIOD_MS,
        iterationCount: Infinity,
    })
        .addFrame("0%", { position: { y: SPHERE_HOME } }, transform, FALL)
        .addFrame("25%", { position: { y: FLOOR_Y } }, transform, RISE)
        .addFrame("50%", { position: { y: APEX_Y } }, transform, FALL)
        .addFrame("75%", { position: { y: FLOOR_Y } }, transform, RISE)
        .addFrame("100%", { position: { y: SPHERE_HOME } }, transform)
        .parse();

    // T.B9 — the ONE keyspace: the registry SceneId, read straight from
    // amigaKeys. C-13 — the local `SCENE_ID` alias is gone: one id had three
    // names (`AMIGA_SCENE_ID`, `SCENE_ID`, the scene's own `superKey` const) in
    // a keyspace built to have one, and a reader had to prove they were equal.
    spinning.name = "Spin";
    spinning.superKey = AMIGA_SCENE_ID;
    bouncingX.name = "Bouncing X";
    bouncingX.superKey = AMIGA_SCENE_ID;
    bouncingY.name = "Bouncing Y";
    bouncingY.superKey = AMIGA_SCENE_ID;

    // T.A7 — the flagship AnimationGroup scene RIDES the group compositor: all
    // three animations composite through the singleTarget SoA blend onto ONE
    // authored pose sink. No `singleTarget = false` dodge; the group consumes the
    // nested shape directly, with no per-animation transform race.
    const animationGroup = new AnimationGroup(spinning, bouncingX, bouncingY);

    // C-5 — the group and the pose sink, and nothing else. The three animations
    // were returned beside them and NO consumer in the tree ever read one: the
    // channels are reachable through the group's own entries (which is how the
    // scene facility builds its channel handles), so the extra members were a
    // second, unmaintained route to the same objects.
    return { animationGroup, pose };
}
