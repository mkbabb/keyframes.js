import { kfEngine } from "@kf-engine";
import { SpringProgress } from "@mkbabb/keyframes.js";
import type { Vars } from "@mkbabb/keyframes.js";
import { parseCssScalar } from "@mkbabb/value.js/css";
import { clamp } from "@mkbabb/value.js/math";
import { useSquareTumble } from "./useSquareTumble";
import { SQUARE_TOUR_OPTIONS, TOUR_PALETTE, squareTourKeyframes } from "./squareMotion";
import { onScopeDispose, ref, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useSweepScene } from "@composables/scene-runtime/useSweepScene";

/**
 * MISS-6 — the square scene's OWN vars shape. The library's `Vars` is the open
 * `{ [arg: string]: number | string | T }` index with `T = any`, so every read
 * in `transformFunc` below (`transform.a.b.c.d`, `motion.lean`) resolved
 * to `any` and NO checker in the tree could catch a misspelt leaf of the one
 * scene whose whole point is the nested-object primitive. Declaring the scene's
 * shape is the free win: the leaves keep their two authored spellings (a raw
 * number from the spring loop, a CSS-authored string from the keyframes — the
 * `num()` bridge at `:78` resolves both), and the interface still extends `Vars`
 * so the engine's `TransformFunction<V extends Vars>` contract is unchanged.
 */
interface SquareVars extends Vars {
    transform?: {
        x?: number | string;
        y?: number | string;
        rotate?: number | string;
        a?: { b?: { c?: { d?: number | string } } };
    };
    /** A CSS colour STRING only — the tour's authored stop or the tumble
     *  sweep's sampled value. The renderer paints it onto the subject's own
     *  `--subject-fill` custom property rather than `background-color`, because
     *  the plate's two-tone material owns `background-image` and an opaque image
     *  occludes the colour underneath it (C-1; CSS Backgrounds L3 §3.10). */
    backgroundColor?: string;
    /** X.KF.W13X · KFA-34/92/186 — the drag's MASS, in the frame of its own
     *  travel: `heading` (deg) is the low-passed velocity's direction, `stretch`
     *  the volume-preserving elongation along it, `lean` (deg) the shear that
     *  makes the edges trail the travel. The spring loop authors it; the tour
     *  does not. */
    motion?: { heading: number; stretch: number; lean: number };
}

/**
 * useSquareDemo — the dogfood of the custom-transform-function over
 * NESTED-OBJECT values primitive (the distinct library feature this scene
 * exists to prove: a `transformFunc` composes `transform` from deeply-nested
 * vars like `a.b.c.d` that map to no CSS property). H.W5.S5 makes it LIVE: the
 * box is directly manipulable.
 *
 * THE LIVE PATH (the always-on interactivity, no bottom-bar Play required):
 * TWO `SpringProgress` trackers (one per axis) own the box position. A pointer-
 * drag re-seats each spring's `target` (the SAME live re-seat idiom the Spring
 * scene ships — `spring.target = v`); the spring chases mid-flight from its
 * current `(x, v)` so the trajectory never jumps. A single owned `RAFPlayback`
 * loop (the spring scene's exact pattern) ticks both springs by the real
 * inter-frame dt and, each frame, builds a NESTED-OBJECT `vars` from the live
 * spring state and calls the custom `transformFunc` — so the nested-object
 * primitive is exercised by the live drag, frame by frame. The loop self-
 * terminates when both springs settle (nothing to repaint) and `reseat` re-arms
 * it; the spring scene's `useSceneVisibilityPause` discipline is unneeded here
 * because the loop is already idle whenever the springs are at rest.
 *
 * THE HONEST PLAY (T.A13): the `CSSKeyframesAnimation` carries REAL four-corner
 * keyframes (a ±90px diamond tour, full 360° rotation, nested `d` swell, rainbow
 * sweep) over the SAME nested-object `transformFunc`. Play drives the group → the
 * box tours the diamond, VISIBLY obeying duration/easing/direction (the panel triad
 * edits a LIVE animation, T.B3). The two writers (the spring drag loop and the
 * engine tour) are never simultaneous — the {idle,drag,playback} FSM in the host
 * pauses the group on a drag and seats the springs from the painted pose
 * (`seatFromPose`), so there is one paint authority at a time. The unit-honest
 * `num()` normalizer resolves BOTH writers (raw numbers and authored strings),
 * curing the S.G2 "0pxpx" CSSOM-discard that made Play paint nothing.
 */
export function useSquareDemo(
    // Accept the `useTemplateRef` shape (a readonly shallow ref that yields
    // `null` before mount) as well as a plain ref — the box only exists after
    // mount, so the transformFunc null-guards every read.
    box: Readonly<Ref<HTMLElement | null | undefined>>,
    // T.A13 — invoked the frame the live spring loop self-terminates (every spring
    // settled). The host uses it to settle the {idle,drag,playback} FSM to `idle`
    // when a drag/tumble comes fully to rest (the loop's own settle IS the signal —
    // NO timer band-aid, NO shadow flag).
    onSettle?: () => void,
    // L.W11 S4 — a per-frame DERIVED-READ hook for the scene's instrument layer
    // (the rubber-band tether + the settled/tracking telemetry). Invoked with the
    // live spring snapshot each frame the loop runs, so the tether is a read of
    // the SAME spring state the box paints — NO second writer, NO second rAF.
    onTick?: (snapshot: { x: number; y: number; settled: boolean }) => void,
    // X.KF.W13X · UIA-KF-026 — whether the engine is TOURING (started and not
    // paused). An engine paint while it is not — a seek, or Reset's rewind — is
    // a pose the transport AUTHORED: the springs seat on it and the instrument
    // reads settled. Absent (a harness with no group), every engine paint is one.
    isTouring: () => boolean = () => false,
) {
    // One spring per axis. Value/target are normalized [-1, 1] of the box's free
    // travel (mapped to a px translate). The (response 0.32, ζ 0.62) feel reads
    // as a lively, slightly springy chase under a drag.
    const springX = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });
    const springY = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });

    // D-8 — HOW FAR (px) A FULL [-1,1] SPRING DEFLECTION TRANSLATES THE BOX, and
    // it is no longer a constant. A fixed 110 px against a fixed 12 rem subject
    // amputated both on a phone (the arithmetic is in `SquareScene.css`); the
    // stylesheet owns the clamp, publishes it as `--square-travel`, and this is
    // the one place that reads it — so the spring's coordinate world, the
    // tether's px space and the tour's authored corners all come off ONE number.
    // 110 is the desktop maximum and the value every existing figure was derived
    // against; it is also the fallback when the property is absent (a test
    // harness with no stylesheet, a detached element).
    const TRAVEL_MAX = 110;
    const travel = ref(TRAVEL_MAX);

    // T.A13 — THE `num()` NORMALIZER (the "0pxpx" CSSOM-discard cure).
    // The box has TWO writers into the SAME nested-object `transformFunc`: the
    // live spring loop hands RAW NUMBERS (`x: springX.value * travel`), while the
    // engine's four-corner keyframes deliver each leaf's AUTHORED SHAPE — a bare
    // `number` for a unitless leaf
    // but a STRING for a unit/percent leaf (`x: "42px"`, `d: "108%"`). The old
    // code interpolated the raw leaf into a template literal — `` `${"42px"}px` ``
    // → `"42pxpx"` → invalid CSS → CSSOM SILENTLY DISCARDS the write → the box
    // never moved on Play (S.G2's amputation cause). `num()` resolves BOTH writers
    // to a plain number: a number passes through, a unit string is parsed
    // (`"42px"` → 42), and a percent leaf is fractionalized when asked
    // (`"108%"` → 1.08).
    //
    // L-10 — IT IS UNIT-*BLIND*, NOT UNIT-HONEST, AND THE NAME SAID OTHERWISE.
    // Only `%` is interpreted; every other unit is dropped and the bare magnitude
    // is consumed AT THE CALL SITE'S OWN UNIT — `"5rem"` paints `translate(5px…)`,
    // `"90deg"` on `x` paints 90 px. The scene's own keyframes author px and %
    // only, so the blindness is latent here; the docblock no longer claims
    // otherwise.
    //
    // D-27/L-7/C-9 — DEGRADE, DO NOT THROW, IN THE FRAME PATH. `num()` used to
    // `throw` on a malformed leaf, from inside the rAF frame, once per frame: the
    // engine now winds a failed frame down recoverably (X.KF.W5 C-2 / G-RAF) but
    // the scene still lost its paint loop for as long as the bad leaf was
    // authored — and a malformed leaf is ordinary editor traffic (`calc(1px +
    // 2px)` is valid CSS that `parseCssScalar` refuses). The function is TOTAL
    // now: an unreadable leaf paints the neutral value for its position and is
    // REPORTED ONCE per spelling (never swallowed, never repeated 60× a second).
    // `undefined` → the neutral identity (0 for a length, 1 for a scale); that is
    // the identity element of the composed transform, not a guess.
    const reportedLeaves = new Set<string>();
    const neutral = (v: unknown, pct: boolean): number => {
        const spelling = JSON.stringify(typeof v === "string" ? v : String(v));
        if (!reportedLeaves.has(spelling)) {
            reportedLeaves.add(spelling);
            console.error(
                `[square] malformed authored transform leaf ${spelling} — painting the neutral value and carrying on.`,
            );
        }
        return pct ? 1 : 0;
    };
    const num = (v: unknown, pct = false): number => {
        if (v === undefined) return pct ? 1 : 0;
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string") {
            const parsed = parseCssScalar(v);
            if (!parsed.ok || parsed.value.payload.type !== "number") {
                return neutral(v, pct);
            }
            const { value, unit } = parsed.value.payload;
            return pct && unit === "%" ? value / 100 : value;
        }
        return neutral(v, pct);
    };

    /**
     * The CUSTOM TRANSFORM FUNCTION — the primitive. It composes `transform`
     * from a NESTED-OBJECT `vars` (`transform.a.b.c.d` is a real nested read that
     * maps to no CSS property) plus the live translate. Identical shape to the
     * engine's `transformFunc` contract; the spring loop feeds it live vars.
     * Every positional leaf routes through `num()` so the raw-number (drag) and
     * the authored-string (Play keyframes) writers BOTH resolve.
     */
    // L-4/C-12 + C-3/L-D3 — WHICHEVER WRITER IS PAINTING FEEDS THE INSTRUMENT.
    // `onTick` had exactly two call sites, both inside the SPRING loop, and the
    // engine tour never pumped it — so through the scene's own headline verb the
    // badge read "settled", the tether froze and the numerals held stale drag
    // values while the box toured ±90 px, 360° and a colour sweep. The strip had
    // no `mode` prop either, so it could not even suppress what it knew was
    // stale. The cure the record ranks first is "pump the derived reads from the
    // paint authority, whichever it is": the renderer IS the one paint
    // authority, so it feeds the instrument directly when the caller is the
    // engine. `paintingFromLoop` keeps the spring loop's own richer snapshot
    // (it knows about settling) from being fired twice per frame.
    let paintingFromLoop = false;

    /** The last painted pose, whichever writer painted it — the seat a
     *  takeover (or a transport-authored pose) reads, in the renderer's own
     *  numbers rather than a decomposed matrix. */
    const lastPaint = { tx: 0, ty: 0, rotate: 0, scale: 1 };

    const transformFunc = (vars: SquareVars) => {
        const el = box.value;
        if (!el) return;
        const { transform, backgroundColor, motion } = vars;
        const tx = num(transform?.x);
        const ty = num(transform?.y);
        // The nested `a.b.c.d` scale is percent-authored in the keyframes
        // (`d:"108%"` → 1.08) and raw in the spring loop (`1 + defl*0.12`).
        const scale = transform?.a?.b?.c?.d != null ? num(transform.a.b.c.d, true) : 1;
        // `rotate` is the four-corner tour's full-turn sweep (0→360° across the
        // diamond) in Play, and the "tumble" egg's barrel-roll under a gesture.
        // Composing it into the same custom transform keeps ONE paint authority.
        const rotate = num(transform?.rotate);
        lastPaint.tx = tx;
        lastPaint.ty = ty;
        lastPaint.rotate = rotate;
        lastPaint.scale = scale;
        // X.KF.W13X · KFA-34/92/186 — THE MASS IS DRAWN IN THE FRAME OF THE
        // TRAVEL. The squash picked an axis with a hard `|vx| >= |vy|` boolean, so
        // on a diagonal float noise flipped a tall rhombus into a wide one every
        // few frames (~24 px width pops, served ×2); the tilt read vy into skewX
        // and vx into skewY (a horizontal fling slanted the top and bottom edges)
        // at a gain that pinned its 9° cap on frame one. Now one velocity vector
        // is conjugated in: `rotate(h) scale(1+s, 1/(1+s)) skewX(lean) rotate(-h)`
        // — a volume-preserving stretch ALONG the travel and a lean whose trailing
        // edge is the one behind it, the same shape in every direction by
        // construction (rotation-equivariant; no per-quadrant sign to get wrong).
        // It sits outside the subject's own rotation, so it is screen-space mass.
        const heading = motion?.heading ?? 0;
        const stretch = motion?.stretch ?? 0;
        const lean = motion?.lean ?? 0;
        const mass =
            stretch === 0 && lean === 0
                ? ""
                : `rotate(${heading.toFixed(3)}deg) ` +
                  `scale(${(1 + stretch).toFixed(4)}, ${(1 / (1 + stretch)).toFixed(4)}) ` +
                  `skewX(${lean.toFixed(3)}deg) rotate(${(-heading).toFixed(3)}deg) `;
        el.style.transform =
            `translate(${tx}px, ${ty}px) ${mass}rotate(${rotate}deg) ` +
            `scale(${scale.toFixed(4)})`;
        // Mirror the lean/stretch onto CSS custom properties so the scene can paint
        // a velocity-reactive affordance off them (and a gate can witness the box
        // banking) — the transform itself stays the single paint authority.
        if (motion) {
            el.style.setProperty("--spring-tilt", `${Math.abs(lean).toFixed(3)}`);
            el.style.setProperty("--spring-squash", `${stretch.toFixed(4)}`);
        }
        // C-1 — the colour lands on `--subject-fill`, which the plate's gradient,
        // its base colour AND its derived ink all read. Writing
        // `background-color` here painted under an opaque `background-image`:
        // never once visible, for either writer.
        if (backgroundColor) {
            el.style.setProperty("--subject-fill", backgroundColor);
            // L-22a — the fill now belongs to whoever just wrote it: an engine
            // colour is never a sweep's to clear.
            if (!paintingFromLoop) sweepPainted = false;
        }
        if (!paintingFromLoop) enginePainted();
    };

    // ── EASTER EGG — "the Tumble palette-sweep" (H.W12.S6 + L.W11 S4) ─────────
    // Double-TAP the box → a delighted barrel-roll (D-17: `useDoubleTap`, the
    // touch-reachable recogniser). A THIRD `SpringProgress` chases a +360°
    // target, folded into the SAME paint loop + the SAME nested-object
    // `transformFunc` (ONE paint authority — the spin rides `transform.rotate`).
    // While it spins the box sweeps its palette so the tumble also EXHIBITS the
    // engine's colour twin; the marker is `data-palette-sweep` on the box.
    const { spin: springSpin, tumble: tumbleSpin, returnHome, halt, sample } =
        useSquareTumble(() => startLoop());

    /** The fill the box is painted in right now (an inline tour or sweep
     *  colour), or `undefined` when it rests on the stylesheet's teal. */
    const paintedFill = (): string | undefined =>
        box.value?.style.getPropertyValue("--subject-fill").trim() || undefined;

    // ── The live paint loop (ticks both springs, paints via transformFunc) ──
    let lastNow = 0;
    // L-22a — WHOEVER WROTE THE FILL OWNS THE CLEAR. A sweep clears exactly what
    // a sweep wrote, once, when it ends — never an engine fill-forwards colour.
    let sweepPainted = false;

    // X.KF.W13X · KFA-34/92/186 — the mass reads a LOW-PASSED velocity (τ 70 ms):
    // the raw spring velocity jumps to its peak on the frame a target moves, so
    // the old read snapped the lean to its cap in one frame (KFA-92). Both
    // channels saturate SOFTLY (tanh) at caps an ordinary drag does not reach —
    // at 3 u/s the lean is ~2.2° and the stretch ~3.5 % (they were 9° and 10 %,
    // pinned together for ~15 frames: distortion, not mass — KFA-186).
    const MASS_TAU_MS = 70;
    const LEAN_CAP = 6; // deg
    const STRETCH_CAP = 0.08;
    const MASS_SPEED = 8; // u/s at which tanh reaches 0.76 of a cap
    let vx = 0;
    let vy = 0;
    let heading = 0;

    // X.KF.W13X · KFA-94 — THE SCALE CARRIER. A takeover seated x/y/spin but
    // not the nested `d`: the loop re-derived it from the seated deflection
    // (1.077) where the tour had painted 1.012 — a 6.5 % pop in one frame. The
    // difference is carried from the painted scale and decays (τ 120 ms).
    const SCALE_TAU_MS = 120;
    let scaleCarry = 0;

    const frame = (now: DOMHighResTimeStamp): boolean => {
        const dt = lastNow ? now - lastNow : 0;
        lastNow = now;
        springX.tickDt(dt);
        springY.tickDt(dt);
        springSpin.tickDt(dt);

        const sweep = sample(now);
        const tumbling = sweep.marker;
        const k = dt > 0 ? 1 - Math.exp(-dt / MASS_TAU_MS) : 0;
        vx += (springX.velocity - vx) * k;
        vy += (springY.velocity - vy) * k;
        const speed = Math.hypot(vx, vy);
        // The heading holds while the box is (nearly) still, so a vanishing
        // vector never spins the frame (the magnitudes are ~0 there anyway).
        if (speed > 1e-3) heading = (Math.atan2(vy, vx) * 180) / Math.PI;
        // The egg's barrel-roll owns its own geometry: no mass while it rolls.
        const soft = tumbling ? 0 : Math.tanh(speed / MASS_SPEED);
        if (dt > 0) scaleCarry *= Math.exp(-dt / SCALE_TAU_MS);
        if (Math.abs(scaleCarry) < 1e-4) scaleCarry = 0;

        // Build the NESTED-OBJECT vars from the live spring state and paint. The
        // scale travels through `a.b.c.d` (a deflection-driven 1 → 1.12 swell),
        // so the nested-object structure is genuinely read every frame.
        const defl = Math.min(1, Math.hypot(springX.value, springY.value));
        paintingFromLoop = true;
        transformFunc({
            transform: {
                x: springX.value * travel.value,
                y: springY.value * travel.value,
                rotate: springSpin.value,
                a: { b: { c: { d: 1 + defl * 0.12 + scaleCarry } } },
            },
            motion: { heading, stretch: STRETCH_CAP * soft, lean: LEAN_CAP * soft },
            // D-27 — a sweep that declines to answer writes nothing this frame.
            ...(sweep.color !== undefined ? { backgroundColor: sweep.color } : {}),
        });
        paintingFromLoop = false;
        if (sweep.color !== undefined) sweepPainted = true;
        if (box.value) {
            if (tumbling) box.value.setAttribute("data-palette-sweep", "");
            else box.value.removeAttribute("data-palette-sweep");
        }
        // The sweep just ended → hand the fill back to the stylesheet. Its last
        // stop IS `--subject-teal`, so the landing is seamless by identity.
        if (!sweep.live && sweepPainted && box.value) {
            box.value.style.removeProperty("--subject-fill");
            sweepPainted = false;
        }

        // Self-terminate once every spring, the sweep and the carrier are at
        // rest — re-armed by reseat()/tumble()/a takeover.
        const live =
            !(springX.settled && springY.settled && springSpin.settled) ||
            sweep.live ||
            scaleCarry !== 0 ||
            speed > 1e-3;
        // N-SQ-1 — the snapshot counts what the loop's own liveness counts.
        onTick?.({ x: springX.value, y: springY.value, settled: !live });
        if (!live) onSettle?.();
        return live;
    };

    const { playback, startLoop, stopLoop } = useSweepScene({
        frame,
        onArm: () => { lastNow = 0; },
        getProgress: () => 0,
        setProgress: () => {},
        getPlaying: () => playback.running,
    });

    /**
     * Re-seat both axis targets from a normalized pointer offset. `nx`/`ny` ∈
     * [-1, 1]; the springs chase from their current state (continuous), and the
     * loop re-arms so the chase paints even if it had settled.
     */
    const reseat = (nx: number, ny: number): void => {
        springX.target = clamp(nx, -1, 1);
        springY.target = clamp(ny, -1, 1);
        startLoop();
    };

    /**
     * Settle in place (I.W4 D2 — the persist policy): the spring targets already
     * hold the last dragged value, so settling is letting the chase come to rest
     * THERE. Re-arms the loop so a release after a momentary settle still paints.
     */
    const settle = (): void => {
        startLoop();
    };

    /** The tumble egg, leaving from the colour the box is painted in. */
    const tumble = (): void => tumbleSpin(paintedFill());

    /** Seat all three springs AT REST on a pose (normalized x/y, degrees). */
    const seatSprings = (tx: number, ty: number, rotate: number): void => {
        springX.reset(clamp(tx / travel.value, -1, 1), 0);
        springY.reset(clamp(ty / travel.value, -1, 1), 0);
        springSpin.reset(rotate, 0);
        vx = 0;
        vy = 0;
    };

    /** The sweep and the loop yield: nothing the loop wrote outlives it. */
    const quiesce = (): void => {
        stopLoop();
        halt();
        scaleCarry = 0;
        const el = box.value;
        if (el) el.removeAttribute("data-palette-sweep");
        if (sweepPainted && el) el.style.removeProperty("--subject-fill");
        sweepPainted = false;
    };

    /**
     * T.A13 — POSE-CAPTURE TAKEOVER (the {playback → drag} FSM edge). The group
     * is paused and the springs SEAT on the pose the engine last painted, so the
     * chase begins exactly where the tour left the box (L-5: in rotation too).
     * X.KF.W13X · KFA-94 — the nested scale is carried from the painted one,
     * and UIA-KF-199 — the channels the drag does not own go HOME: the spin
     * returns to the nearest upright turn and the tour's colour blends back to
     * the rest teal (the box used to rest there rotated ~170° and off-colour,
     * and Home, which moves only x/y, could not restore it).
     */
    const seatFromPose = (): void => {
        seatSprings(lastPaint.tx, lastPaint.ty, lastPaint.rotate);
        const defl = Math.min(1, Math.hypot(springX.value, springY.value));
        scaleCarry = lastPaint.scale - (1 + defl * 0.12);
        returnHome(paintedFill());
    };

    /**
     * X.KF.W13X · KFA-96 — THE TOUR TAKES THE BOX. Play's rising edge retires the
     * spring loop first: the spin rests (mod one turn), the sweep and its marker
     * end, the loop stops. Play mid-tumble used to leave the spin loop writing
     * `transform` and the fill beside the engine for ~1.75 s (two writers).
     */
    const yieldToTour = (): void => quiesce();

    /**
     * X.KF.W13X · UIA-KF-026 — an ENGINE paint. While the tour runs it feeds the
     * instrument (L-4/C-12: the renderer pumps the reads whichever writer
     * paints). Otherwise it is a pose the transport authored — a seek, or
     * Reset's rewind to 0 % — and it is the truth: the springs seat on it at
     * rest, any loop and sweep yield, and the instrument reads settled. Reset
     * used to leave the springs where the takeover had put them, so the loop
     * painted over the rewind, the fill stayed on the 0 % stop while the pose did
     * not, and Home chased back to the stale pose.
     */
    function enginePainted(): void {
        if (isTouring()) {
            onTick?.({ x: lastPaint.tx / travel.value, y: lastPaint.ty / travel.value, settled: false });
            return;
        }
        quiesce();
        seatSprings(lastPaint.tx, lastPaint.ty, lastPaint.rotate);
        onTick?.({ x: springX.value, y: springY.value, settled: true });
    }

    /** The playing edge's fall (a Pause, or a stop): the pose the engine left is
     *  the rest the springs hold from now on, and the instrument reads settled. */
    const adoptPaintedPose = (): void => {
        quiesce();
        seatSprings(lastPaint.tx, lastPaint.ty, lastPaint.rotate);
        onTick?.({ x: springX.value, y: springY.value, settled: true });
    };

    // ── The bottom-bar transport-contract host (the nested-object keyframes) ──
    // Minimal CSSKeyframesAnimation carrying the SAME nested-object keyframes so
    // the Keyframes-string readout serializes the authored nested shape. Like the
    // Spring/Easing contract anim, it drives no box paint. HEAVY — constructed
    // through the warmed engine surface (kfEngine(), L.W8 S1 dogfood inversion);
    // the warm resolves before any scene mounts, so this stays synchronous. The
    // live spring drag path (above) is LIGHT and runs independent of this.
    // T.A13 — THE REAL FOUR-CORNER KEYFRAMES (the diamond tour). The former
    // `x:"0px"→"0px"` keyframes were MOTIONLESS — Play painted nothing even once
    // the "0pxpx" discard was cured, because the box never left center. This is a
    // genuine diamond circuit: center → top-right → bottom → top-left → center,
    // a FULL 360° rotation, the nested `d` scale swelling on the corners, and a
    // rainbow backgroundColor sweep.
    // The authored ±90px sits INSIDE the ±110px desktop envelope (and is re-seated
    // proportionally when the envelope clamps down) so drag and playback
    // share ONE coordinate world (the pose-capture takeover is seamless, in both
    // directions now — see `tourTimeForPose`). Now
    // duration/easing/direction/fill/iterations VISIBLY govern the paint — the
    // panel triad edits a live animation, not a dead one (the T.B3 honest panel).
    //
    // MISS-5 — THE STOPS BELOW ARE AUTHORED FALLBACKS, AND THE COMMENT NO LONGER
    // CLAIMS THEM AS TOKENS. The five hexes were introduced under a comment
    // calling them "the sanctioned `--rainbow-*` family" while belonging to no
    // member of it: `--rainbow-violet` is hsl(300 75% 60%) ≈ #E64DE6, not
    // #C462D8, and no family member resolves to #5AC8FA or #3DD0C4 at all — the
    // exact drift hazard this module's own sibling comment describes
    // eliminating. `TOUR_PALETTE` (now in `squareMotion.ts`) names the tokens; `resolveTourPalette()`
    // seats their live values at mount, and each hex here is that token's own
    // declared value so an unloaded stylesheet degrades hue-identically. This
    // became visible paint the moment C-1 was cured.
    // KF.W13U.d2 — the tour's options and keyframes live in `squareMotion.ts`,
    // read here and by the dock miniature (`SquareMini.vue`).
    const { CSSKeyframesAnimation } = kfEngine();
    const anim = new CSSKeyframesAnimation({ ...SQUARE_TOUR_OPTIONS }).fromKeyframes(
        squareTourKeyframes(),
        transformFunc,
    );

    /**
     * MISS-5 — seat the tour's stops from the LIVE tokens (mount-time, DOM
     * available), so the diamond genuinely rides the sanctioned family its own
     * comment has always claimed. A token that resolves empty leaves the
     * authored fallback — which is that token's declared value — in place.
     */
    /**
     * D-8 — read the clamped envelope out of the stylesheet and re-seat the
     * tour's authored corners proportionally, so the diamond keeps its
     * relationship to the spring field (the authored ±90 px is 90/110 of the
     * desktop travel; it stays that fraction at every width). Runs at mount and
     * whenever the arena resizes, because the envelope is the plate's
     * (X.KF.W13X: `cqmin` of the stage, a registered `<length>`).
     */
    const CORNER_FRACTION = 90 / TRAVEL_MAX;
    const resolveEnvelope = (): void => {
        const el = box.value;
        if (!el) return;
        const declared = parseFloat(
            getComputedStyle(el).getPropertyValue("--square-travel"),
        );
        const next = Number.isFinite(declared) && declared > 0 ? declared : TRAVEL_MAX;
        if (next === travel.value) return;
        travel.value = next;

        const corner = Math.round(next * CORNER_FRACTION);
        let moved = false;
        for (const frame of anim.templateFrames) {
            const authored = (frame.vars as SquareVars).transform;
            if (!authored) continue;
            for (const axis of ["x", "y"] as const) {
                const current = num(authored[axis]);
                if (current === 0) continue;
                const scaled = `${Math.sign(current) * corner}px`;
                if (authored[axis] !== scaled) {
                    authored[axis] = scaled;
                    moved = true;
                }
            }
        }
        if (moved) anim.parse();
    };

    const resolveTourPalette = (): void => {
        const style = getComputedStyle(document.documentElement);
        let moved = false;
        anim.templateFrames.forEach((frame, index) => {
            const row = TOUR_PALETTE[index];
            if (!row) return;
            const resolved = style.getPropertyValue(row[0]).trim();
            const vars = frame.vars as SquareVars;
            if (resolved && resolved !== vars.backgroundColor) {
                vars.backgroundColor = resolved;
                moved = true;
            }
        });
        if (moved) anim.parse();
    };

    /**
     * ARB-1 — THE REVERSE POSE-ADOPTION: which tour time is the box already at?
     *
     * `seatFromPose` seats the SPRINGS from the engine's painted pose; nothing
     * did the mirror, so Play resumed the tour at its own clock (or started at
     * 0% home) while a persist-policy drag had left the box up to two travels away
     * — a one-frame snap of ~220 px plus a rotation out of nowhere.
     *
     * The authored diamond is read off the animation's OWN template frames (one
     * source of truth — the keyframes below, never a second table), projected
     * onto each segment, and the nearest point's normalized time returned. The
     * path is segment-linear while the engine's within-segment motion carries
     * the timing function, so the residual is one segment's easing warp rather
     * than a whole diamond.
     */
    const tourTimeForPose = (): number => {
        const stops = anim.templateFrames
            .map((frame) => {
                const vars = frame.vars as SquareVars;
                return {
                    t: frame.start.kind === "percent" ? frame.start.value : 0,
                    x: num(vars.transform?.x),
                    y: num(vars.transform?.y),
                };
            })
            .sort((a, b) => a.t - b.t);
        if (stops.length < 2) return 0;

        const px = springX.value * travel.value;
        const py = springY.value * travel.value;
        let bestT = 0;
        let bestDist = Infinity;
        for (let i = 0; i + 1 < stops.length; i += 1) {
            const a = stops[i]!;
            const b = stops[i + 1]!;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const span = dx * dx + dy * dy;
            const u =
                span === 0
                    ? 0
                    : clamp(((px - a.x) * dx + (py - a.y) * dy) / span, 0, 1);
            const qx = a.x + u * dx;
            const qy = a.y + u * dy;
            const dist = (px - qx) ** 2 + (py - qy) ** 2;
            if (dist < bestDist) {
                bestDist = dist;
                bestT = a.t + u * (b.t - a.t);
            }
        }
        return clamp(bestT, 0, 1);
    };

    /**
     * Paint the rest pose once on mount (the springs start at 0 → the box sits
     * home, un-deflected, before any drag) AND seat the tour's stops from the
     * live tokens. The comment here used to promise the second half and the code
     * did only the first — the sweep's own resolution lives in `useSquareTumble`,
     * and the tour's stops were resolved nowhere at all (MISS-5). Both halves
     * are true of this function now.
     */
    // D-8 / X.KF.W13X — the envelope is the PLATE's, so the plate resizing moves
    // it (a window resize, and also a sheet or pane opening beside the stage,
    // which no window `resize` reports). The springs are normalized, so nothing
    // needs re-seating; only the px scale and the tour's authored corners follow.
    useResizeObserver(
        () => box.value?.parentElement ?? null,
        () => resolveEnvelope(),
    );

    const paintRest = (): void => {
        resolveEnvelope();
        resolveTourPalette();
        paintingFromLoop = true;
        transformFunc({
            transform: { x: 0, y: 0, a: { b: { c: { d: 1 } } } },
            motion: { heading: 0, stretch: 0, lean: 0 },
        });
        paintingFromLoop = false;
        // Seat the instrument layer at rest (the tether hidden, the badge settled).
        onTick?.({ x: springX.value, y: springY.value, settled: true });
    };

    /**
     * MISS-10 — teardown hands the BORROWED element back as it found it. The
     * composable wrote `transform`, two custom properties, the fill and a data
     * attribute onto an element it does not own, and abandoned all of them —
     * benign while the element dies with the scene, inherited by any KeepAlive
     * or portal future. Each write above has its removal here.
     */
    const dispose = (): void => {
        stopLoop();
        springX.dispose();
        springY.dispose();
        const el = box.value;
        if (el) {
            el.style.removeProperty("transform");
            el.style.removeProperty("--spring-tilt");
            el.style.removeProperty("--spring-squash");
            el.style.removeProperty("--subject-fill");
            el.removeAttribute("data-palette-sweep");
        }
    };

    // Self-clean on the host's setup scope tear-down (the SAME idiom the sibling
    // scene composables ship — useSpringDemo/useEasingDemo/useSequenceDemo each
    // `onScopeDispose(() => playback.stop())`, mirroring useRafLoop.ts's
    // onUnmounted(stop)). The raw RAFPlayback loop owner MUST stop on dispose
    // itself, not lean on a host remembering to call dispose() — so the loop
    // cannot leak past unmount if a future host forgets the wiring (G.W9 §S3).
    // The host (SquareScene) still calls dispose() to stop its own AnimationGroup
    // beside this, which is idempotent (playback.stop() twice is a no-op).
    onScopeDispose(dispose);

    return {
        anim,
        springX,
        springY,
        reseat,
        settle,
        seatFromPose,
        yieldToTour,
        adoptPaintedPose,
        tourTimeForPose,
        travel,
        paintRest,
        tumble,
        dispose,
    };
}
