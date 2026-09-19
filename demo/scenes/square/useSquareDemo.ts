import { kfEngine } from "@kf-engine";
import { SpringProgress } from "@mkbabb/keyframes.js";
import type { Vars } from "@mkbabb/keyframes.js";
import { parseCssScalar } from "@mkbabb/value.js/css";
import { clamp } from "@mkbabb/value.js/math";
import { useSquareTumble } from "./useSquareTumble";
import { onScopeDispose, type Ref } from "vue";
import { useSweepScene } from "@composables/scene-runtime/useSweepScene";

/**
 * MISS-6 — the square scene's OWN vars shape. The library's `Vars` is the open
 * `{ [arg: string]: number | string | T }` index with `T = any`, so every read
 * in `transformFunc` below (`transform.a.b.c.d`, `tilt.x`, `squash.y`) resolved
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
    tilt?: { x?: number; y?: number };
    squash?: { x?: number; y?: number };
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
) {
    // One spring per axis. Value/target are normalized [-1, 1] of the box's free
    // travel (mapped to a px translate). The (response 0.32, ζ 0.62) feel reads
    // as a lively, slightly springy chase under a drag.
    const springX = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });
    const springY = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });

    // How far (px) a full [-1, 1] spring deflection translates the box.
    const TRAVEL = 110;

    // T.A13 — THE `num()` NORMALIZER (the "0pxpx" CSSOM-discard cure).
    // The box has TWO writers into the SAME nested-object `transformFunc`: the
    // live spring loop hands RAW NUMBERS (`x: springX.value * TRAVEL`), while the
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

    const transformFunc = (vars: SquareVars) => {
        const el = box.value;
        if (!el) return;
        const { transform, backgroundColor, tilt, squash } = vars;
        const tx = num(transform?.x);
        const ty = num(transform?.y);
        if (!paintingFromLoop) {
            onTick?.({ x: tx / TRAVEL, y: ty / TRAVEL, settled: false });
        }
        // The nested `a.b.c.d` scale is percent-authored in the keyframes
        // (`d:"108%"` → 1.08) and raw in the spring loop (`1 + defl*0.12`).
        const scale = transform?.a?.b?.c?.d != null ? num(transform.a.b.c.d, true) : 1;
        // `rotate` is the four-corner tour's full-turn sweep (0→360° across the
        // diamond) in Play, and the "tumble" egg's barrel-roll under a gesture.
        // Composing it into the same custom transform keeps ONE paint authority.
        const rotate = num(transform?.rotate);
        // P.W6 S1(d) — velocity-tilt + directional squash. The box banks into the
        // pull (a skewX/skewY from the per-axis spring VELOCITY) and squashes along
        // the drag axis (a non-uniform scale from velocity magnitude). These ride
        // the SAME transform string (ONE paint authority, no second writer, no
        // extra rAF — the inv-ζ anti-rAF law). Velocity is the already-tracked
        // public `springX.velocity`/`springY.velocity` (zero new physics). The
        // skew is the visible mass: a fast pull leans the chip, a settle un-banks
        // it — the spring's hidden momentum made legible.
        const skewX = tilt?.x ?? 0;
        const skewY = tilt?.y ?? 0;
        const sx = squash?.x ?? 1;
        const sy = squash?.y ?? 1;
        el.style.transform =
            `translate(${tx}px, ${ty}px) rotate(${rotate}deg) ` +
            `skew(${skewX.toFixed(3)}deg, ${skewY.toFixed(3)}deg) ` +
            `scale(${(scale * sx).toFixed(4)}, ${(scale * sy).toFixed(4)})`;
        // Mirror the bank/squash onto CSS custom properties so the scene can paint
        // a velocity-reactive affordance off them (and a gate can witness the box
        // banking) — the transform itself stays the single paint authority.
        if (tilt) {
            el.style.setProperty("--spring-tilt", `${Math.hypot(skewX, skewY).toFixed(3)}`);
        }
        if (squash) {
            el.style.setProperty("--spring-squash", `${(Math.abs(sx - 1) + Math.abs(sy - 1)).toFixed(4)}`);
        }
        // C-1 — the colour lands on `--subject-fill`, which the plate's gradient,
        // its base colour AND its derived ink all read. Writing
        // `background-color` here painted under an opaque `background-image`:
        // never once visible, for either writer.
        if (backgroundColor) {
            el.style.setProperty("--subject-fill", backgroundColor);
        }
    };

    // ── EASTER EGG — "the Tumble palette-sweep" (H.W12.S6 + L.W11 S4) ─────────
    // Double-click the box → a delighted barrel-roll. A THIRD `SpringProgress`
    // chases a +360° target (a snappy underdamped spin with overshoot), folded
    // into the SAME paint loop + the SAME nested-object `transformFunc` (ONE
    // paint authority — the spin rides `transform.rotate`, no second writer).
    // While it spins the box sweeps through the rainbow palette so the tumble
    // also EXHIBITS the engine's color twin. inv ζ — the light-surface
    // SpringProgress drives the spin, no hand-rolled rAF.
    //
    // L.W11 S4 (the design-refinement egg) — the loved violet→teal sweep is a
    // PROVENANCE FIX, not a colour kill: the stops no longer dangle as three raw
    // hex literals (drift-prone against --subject-teal) — they are RESOLVED AND
    // PARSED ONCE at mount from the demo's sanctioned token family, and the
    // terminal stop IS `--subject-teal`, so the landing is seamless by identity
    // (L-11/C-5(b)). The marker is `data-palette-sweep` on the box so the
    // design-refinement probe reads the egg layer.
    const { spin: springSpin, colorAtSpin, tumble } = useSquareTumble(() =>
        startLoop(),
    );

    // ── The live paint loop (ticks both springs, paints via transformFunc) ──
    let lastNow = 0;
    // L-22a — WHOEVER WROTE THE FILL OWNS THE CLEAR. The loop cleared the inline
    // colour whenever the EGG's spin happened to be settled, which is not the
    // same question as "who is painting": any drag after a paused, fill-forwards
    // tour silently discarded the engine's own colour (masked until C-1 landed,
    // because nothing was visible either way). The sweep now clears exactly what
    // the sweep wrote, once, on its own settle.
    let sweepPainted = false;
    const sweepColor = (): { backgroundColor?: string } => {
        const sampled = colorAtSpin();
        if (sampled === undefined) return {};
        sweepPainted = true;
        return { backgroundColor: sampled };
    };

    const frame = (now: DOMHighResTimeStamp): boolean => {
        const dt = lastNow ? now - lastNow : 0;
        lastNow = now;
        springX.tickDt(dt);
        springY.tickDt(dt);
        springSpin.tickDt(dt);

        // Build the NESTED-OBJECT vars from the live spring state and paint. The
        // scale travels through `a.b.c.d` (a deflection-driven 1 → 1.12 swell),
        // so the nested-object structure is genuinely read every frame.
        const defl = Math.min(1, Math.hypot(springX.value, springY.value));
        const spinning = !springSpin.settled;
        // P.W6 S1(d) — read the ALREADY-tracked per-axis spring velocity (public,
        // spring.ts:250) and map it to a bank/squash. The skew leans the chip into
        // the direction of travel (capped so a hard fling never shears it apart);
        // the squash stretches along the velocity axis and pinches the cross-axis
        // (volume-preserving-ish), so a fast pull reads as inertial mass. The egg
        // SPIN suppresses the tilt (a barrel-roll owns its own geometry) so the two
        // never fight. Zero new physics, zero new rAF — pure derived reads.
        const TILT_GAIN = 5; // deg per (unit/s); spring velocity ~[-3..3] at a hard pull
        const TILT_CAP = 9; // deg — the shear ceiling
        const SQUASH_GAIN = 0.035; // scale delta per (unit/s)
        const SQUASH_CAP = 0.1;
        const clampTilt = (v: number) =>
            spinning ? 0 : clamp(v * TILT_GAIN, -TILT_CAP, TILT_CAP);
        // The skew banks PERPENDICULAR to each axis's motion (x-velocity skews the
        // vertical edges, y-velocity skews the horizontal edges) for a coherent lean.
        const tiltX = clampTilt(springY.velocity);
        const tiltY = clampTilt(springX.velocity);
        const sqMag = spinning
            ? 0
            : Math.max(
                  -SQUASH_CAP,
                  Math.min(SQUASH_CAP, Math.hypot(springX.velocity, springY.velocity) * SQUASH_GAIN),
              );
        // Stretch along the dominant velocity axis, pinch the cross-axis.
        const xDominant = Math.abs(springX.velocity) >= Math.abs(springY.velocity);
        paintingFromLoop = true;
        transformFunc({
            transform: {
                x: springX.value * TRAVEL,
                y: springY.value * TRAVEL,
                rotate: springSpin.value,
                a: { b: { c: { d: 1 + defl * 0.12 } } },
            },
            tilt: { x: tiltX, y: tiltY },
            squash: {
                x: 1 + (xDominant ? sqMag : -sqMag),
                y: 1 + (xDominant ? -sqMag : sqMag),
            },
            // Sweep the palette WHILE the egg spin is live. The sample is the
            // sweep's own CLAMPED progress through this turn (L-11/C-5(a) — the
            // wrapped angle snapped green↔violet on each of the six settle
            // crossings), and it may decline to answer, in which case nothing is
            // written this frame rather than a throw inside the rAF (D-27).
            ...(spinning ? sweepColor() : {}),
        });
        paintingFromLoop = false;
        // L.W11 S4 — mark the box with `data-palette-sweep` while the egg's
        // colour sweep is live, so the off-the-normal-path effect is observable
        // (the design-refinement browser probe reads `palette|sweep` on the box)
        // and scene CSS can register the tumble (a one-shot bloom, PRM-guarded).
        if (box.value) {
            if (spinning) box.value.setAttribute("data-palette-sweep", "");
            else box.value.removeAttribute("data-palette-sweep");
        }
        // The sweep just finished → hand the fill back to the stylesheet. The
        // CSS `--subject-teal` default wins the moment the inline custom
        // property is removed, and the sweep's terminal stop IS that token, so
        // the landing is seamless by identity (L-11/C-5(b)). L-22a: only a fill
        // THIS sweep wrote is cleared — an engine fill-forwards colour from a
        // paused tour is not the egg's to discard.
        if (!spinning && sweepPainted && box.value) {
            box.value.style.removeProperty("--subject-fill");
            sweepPainted = false;
        }

        // Self-terminate once every spring settles — re-armed by reseat()/tumble().
        const live = !(springX.settled && springY.settled && springSpin.settled);
        // L.W11 S4 — feed the scene's instrument layer the live spring snapshot
        // (the tether + the settled/tracking badge are derived reads of THIS, no
        // second rAF). Fired every frame the loop runs, plus once more on settle.
        // N-SQ-1 — THE SNAPSHOT COUNTS THE SAME THREE SPRINGS ITS OWN LIVENESS
        // TEST DOES. `live` above counts `springSpin`; this snapshot did not —
        // at the same call site, under a comment calling the tether and badge
        // "derived reads of THIS". So through the entire advertised 360° tumble
        // the loop RAN, `onTick` fired every frame with `settled: true`, the
        // badge read "settled" and the tether stayed hidden. A live feed,
        // narrowed at the snapshot.
        onTick?.({
            x: springX.value,
            y: springY.value,
            settled: !live,
        });
        // T.A13 — the moment the spring loop comes fully to rest, signal the host
        // so the FSM settles to `idle` (a drag/tumble finished chasing).
        if (!live) onSettle?.();
        return live;
    };

    // The accumulating spin target — each tumble adds a full turn (720°, 1080°…
    // are visually identical to 360°/0°, and the spring chases the new target
    // from wherever it is, so a re-tumble mid-spin keeps rolling smoothly). The
    // colour sweep keys off `value mod 360`, so it cycles every turn.

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
     * Settle in place (I.W4 D2 — the persist policy). On release the box should
     * STAY where dragged: the spring TARGETS already hold the last dragged value
     * (set by `reseat` during the gesture), so settling is simply letting the
     * spring chase-to-rest at THAT target — the lively spring feel is preserved
     * while the box stays put. This is the explicit counterpart to the
     * deliberate `Home`/`End` recenter (`reseat(0,0)`). It re-arms the loop so a
     * release while the spring had already settled still paints the final
     * chase-to-rest (idempotent — `startLoop` is a no-op while running).
     */
    const settle = (): void => {
        startLoop();
    };

    /**
     * T.A13 — POSE-CAPTURE TAKEOVER (the {playback → drag} FSM edge). When a
     * pointerdown lands mid-Play, the group is paused and the springs must SEAT
     * from the box's CURRENT painted pose so the spring chase begins EXACTLY
     * where the four-corner tour left the box — no frame jump. Read the live
     * painted translate off the computed transform (`DOMMatrix.m41/m42`), map it
     * back into normalized [-1,1] spring space, and `reset` both axes to that
     * value at rest (velocity 0). The drag's `reseat` then re-targets from here;
     * the box tracks the pointer continuously. This dogfoods the library's own
     * adopt/temporal-takeover idea at demo scale.
     */
    const seatFromPose = (): void => {
        const el = box.value;
        if (!el) return;
        const cs = getComputedStyle(el);
        let tx = 0;
        let ty = 0;
        let rotate = 0;
        try {
            const m = new DOMMatrixReadOnly(cs.transform);
            tx = m.m41;
            ty = m.m42;
            // L-5 — THE TAKEOVER IS JUMP-FREE IN ROTATION TOO, NOT ONLY IN
            // TRANSLATION. This read used to take `m41`/`m42` and then
            // `springSpin.reset(0, 0)`, throwing away the tour's own rotation
            // (0 → 360° across the diamond): the next spring frame painted
            // `rotate(0)` — up to a 90° un-rotation in ONE frame, against two
            // "no frame jump" comments. The painted angle is the 2D matrix's
            // own `atan2(b, a)`; seating the spin there means the first spring
            // frame paints exactly what the engine's last one did. (The nested
            // `d` scale needs no seat: the loop re-derives it from the seated
            // deflection, so it is continuous by construction.)
            rotate = (Math.atan2(m.b, m.a) * 180) / Math.PI;
        } catch {
            // KEEP: a malformed/"none" transform → seat at home (no jump from
            // rest) — the DOMMatrix parse is best-effort by design.
        }
        springX.reset(clamp(tx / TRAVEL, -1, 1), 0);
        springY.reset(clamp(ty / TRAVEL, -1, 1), 0);
        springSpin.reset(rotate, 0);
    };

    /** How far (px) a full [-1,1] deflection travels — for the drag math. */
    const travel = TRAVEL;

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
    // ±90px sits INSIDE the ±110px (TRAVEL) spring envelope so drag and playback
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
    // eliminating. `TOUR_PALETTE` below names the tokens; `resolveTourPalette()`
    // seats their live values at mount, and each hex here is that token's own
    // declared value so an unloaded stylesheet degrades hue-identically. This
    // became visible paint the moment C-1 was cured.
    /** The tour's five stops, as TOKEN NAMES beside the tokens' own declared
     *  values — one row per authored keyframe, in keyframe order. */
    const TOUR_PALETTE: ReadonlyArray<readonly [token: string, fallback: string]> = [
        ["--rainbow-violet", "hsl(300 75% 60%)"],
        ["--rainbow-blue", "hsl(210 80% 55%)"],
        ["--rainbow-cyan", "hsl(180 80% 50%)"],
        ["--rainbow-green", "hsl(130 70% 50%)"],
        ["--rainbow-violet", "hsl(300 75% 60%)"],
    ];

    const { CSSKeyframesAnimation } = kfEngine();
    const anim = new CSSKeyframesAnimation({
        duration: 2000,
        iterationCount: Infinity,
        fillMode: "forwards",
    }).fromKeyframes(
        {
            "0%": {
                transform: { x: "0px", y: "0px", rotate: 0, a: { b: { c: { d: "100%" } } } },
                backgroundColor: TOUR_PALETTE[0]![1],
            },
            "25%": {
                transform: { x: "90px", y: "-90px", rotate: 90, a: { b: { c: { d: "108%" } } } },
                backgroundColor: TOUR_PALETTE[1]![1],
            },
            "50%": {
                transform: { x: "0px", y: "90px", rotate: 180, a: { b: { c: { d: "100%" } } } },
                backgroundColor: TOUR_PALETTE[2]![1],
            },
            "75%": {
                transform: { x: "-90px", y: "-90px", rotate: 270, a: { b: { c: { d: "108%" } } } },
                backgroundColor: TOUR_PALETTE[3]![1],
            },
            "100%": {
                transform: { x: "0px", y: "0px", rotate: 360, a: { b: { c: { d: "100%" } } } },
                backgroundColor: TOUR_PALETTE[4]![1],
            },
        },
        transformFunc,
    );

    /**
     * MISS-5 — seat the tour's stops from the LIVE tokens (mount-time, DOM
     * available), so the diamond genuinely rides the sanctioned family its own
     * comment has always claimed. A token that resolves empty leaves the
     * authored fallback — which is that token's declared value — in place.
     */
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
     * 0% home) while a persist-policy drag had left the box up to 2×TRAVEL away
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

        const px = springX.value * TRAVEL;
        const py = springY.value * TRAVEL;
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
    const paintRest = (): void => {
        resolveTourPalette();
        paintingFromLoop = true;
        transformFunc({
            transform: { x: 0, y: 0, a: { b: { c: { d: 1 } } } },
            tilt: { x: 0, y: 0 },
            squash: { x: 1, y: 1 },
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
        tourTimeForPose,
        travel,
        paintRest,
        tumble,
        dispose,
    };
}
