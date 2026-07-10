import { kfEngine } from "@utils/kfEngine";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import { SpringProgress } from "@mkbabb/keyframes.js";
import type { Vars } from "@mkbabb/keyframes.js";
import { onScopeDispose, type Ref } from "vue";

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
 * `num()` normalizer resolves BOTH writers (raw numbers AND plain-vars strings),
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

    // T.A13 — THE UNIT-HONEST `num()` NORMALIZER (the "0pxpx" CSSOM-discard cure).
    // The box has TWO writers into the SAME nested-object `transformFunc`: the
    // live spring loop hands RAW NUMBERS (`x: springX.value * TRAVEL`), while the
    // engine's four-corner keyframes flow through the T.A6 plain-vars projection
    // that delivers a leaf's AUTHORED SHAPE — a bare `number` for a unitless leaf
    // but a STRING for a unit/percent leaf (`x: "42px"`, `d: "108%"`). The old
    // code interpolated the raw leaf into a template literal — `` `${"42px"}px` ``
    // → `"42pxpx"` → invalid CSS → CSSOM SILENTLY DISCARDS the write → the box
    // never moved on Play (S.G2's amputation cause). `num()` resolves BOTH writers
    // to a plain number honestly: a number passes through, a unit string is
    // parsed (`"42px"` → 42), and a percent leaf is fractionalized when asked
    // (`"108%"` → 1.08). A defensive `.value` branch tolerates a stray ValueUnit.
    const num = (v: unknown, pct = false): number => {
        if (typeof v === "number") return v;
        if (typeof v === "string") {
            const n = Number.parseFloat(v);
            if (Number.isNaN(n)) return pct ? 1 : 0;
            return pct && v.trimEnd().endsWith("%") ? n / 100 : n;
        }
        if (v != null && typeof v === "object" && "value" in v) {
            const inner = (v as { value: unknown }).value;
            return typeof inner === "number" ? inner : pct ? 1 : 0;
        }
        return pct ? 1 : 0;
    };

    /**
     * The CUSTOM TRANSFORM FUNCTION — the primitive. It composes `transform`
     * from a NESTED-OBJECT `vars` (`transform.a.b.c.d` is a real nested read that
     * maps to no CSS property) plus the live translate. Identical shape to the
     * engine's `transformFunc` contract; the spring loop feeds it live vars.
     * Every positional leaf routes through `num()` so the raw-number (drag) and
     * the plain-vars authored-string (Play keyframes) writers BOTH resolve.
     */
    const transformFunc = (vars: Vars) => {
        const el = box.value;
        if (!el) return;
        const { transform, backgroundColor, tilt, squash } = vars;
        const tx = num(transform?.x);
        const ty = num(transform?.y);
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
        if (backgroundColor) el.style.backgroundColor = backgroundColor;
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
    // L.W11 S4 (the design-refinement egg) — the loved violet→green sweep is a
    // PROVENANCE FIX, not a colour kill: the EGG_HUES no longer dangle as three
    // raw hex literals (drift-prone against --subject-teal) — they are RESOLVED
    // ONCE at mount from the demo's sanctioned `--rainbow-*` family (the same
    // spectrum the demo paints everywhere else), so the tumble palette-sweep
    // rides the named crayon tokens by construction (hue-exact, zero drift). The
    // lerp math is untouched; the marker is `paletteSweep`/`sweepHue` so the
    // design-refinement gate reads the NEW egg layer.
    const springSpin = new SpringProgress({ response: 0.55, dampingFraction: 0.58, initial: 0 });

    // The palette-sweep stops, re-sourced from the rainbow tokens at mount. The
    // fallback hexes are the 4.3.0 EGG_HUES (kept byte-identical so a pre-mount
    // read or a missing token never drifts the hue): violet → blend → green.
    const PALETTE_SWEEP_FALLBACK = ["#C462D8", "#7E6BE8", "#52E898"] as const;
    const paletteSweepHues: string[] = [...PALETTE_SWEEP_FALLBACK];

    /** Resolve the palette-sweep stops from the sanctioned `--rainbow-*` family
     *  once at mount (violet → cyan → green, the demo's chosen 3-stop slice — the
     *  SAME spectrum --subject-teal terminates on). A provenance fix: the pixels
     *  are the named crayons, never a drift-prone literal. */
    const resolvePaletteSweep = (): void => {
        const root = typeof document !== "undefined" ? document.documentElement : null;
        if (!root) return;
        const cs = getComputedStyle(root);
        const read = (token: string): string | null => {
            const v = cs.getPropertyValue(token).trim();
            return v.length ? v : null;
        };
        const violet = read("--rainbow-violet");
        const cyan = read("--rainbow-cyan");
        const green = read("--rainbow-green");
        if (violet && cyan && green) {
            paletteSweepHues[0] = violet;
            paletteSweepHues[1] = cyan;
            paletteSweepHues[2] = green;
        }
    };

    // Parse a resolved token value (`rgb(...)`/`#hex`/`hsl(...)` are all served by
    // getComputedStyle as `rgb(...)`; the fallback may be `#hex`) into channels.
    const toRGB = (c: string): [number, number, number] => {
        const s = c.trim();
        const rgbM = s.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
        if (rgbM) return [+rgbM[1]!, +rgbM[2]!, +rgbM[3]!];
        if (s.startsWith("#")) {
            const h = s.length === 4
                ? s.slice(1).split("").map((d) => d + d).join("")
                : s.slice(1);
            return [
                parseInt(h.slice(0, 2), 16),
                parseInt(h.slice(2, 4), 16),
                parseInt(h.slice(4, 6), 16),
            ];
        }
        return [0, 0, 0];
    };

    /** The palette-sweep colour at t∈[0,1] across the three rainbow-sourced
     *  stops (the kept lerp; only the SOURCE of the stops moved to the tokens). */
    const sweepHue = (t: number): string => {
        const span = paletteSweepHues.length - 1;
        const i = Math.min(span - 1, Math.floor(t * span));
        const f = t * span - i;
        const mix = (a: number, b: number) => Math.round(a + (b - a) * f);
        const [r1, g1, b1] = toRGB(paletteSweepHues[i]!);
        const [r2, g2, b2] = toRGB(paletteSweepHues[i + 1]!);
        return `rgb(${mix(r1, r2)}, ${mix(g1, g2)}, ${mix(b1, b2)})`;
    };

    // ── The live paint loop (ticks both springs, paints via transformFunc) ──
    const playback = new RAFPlayback();
    let lastNow = 0;

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
            spinning ? 0 : Math.max(-TILT_CAP, Math.min(TILT_CAP, v * TILT_GAIN));
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
            // Sweep the palette WHILE the egg spin is live (keyed off the angle
            // WITHIN the current turn, so it cycles each tumble); when the spin
            // settles, clear the inline background so the box's CSS home colour
            // (--subject-teal — the rainbow-green terminal stop, J.W7a D13)
            // returns.
            ...(spinning
                ? { backgroundColor: sweepHue(((((springSpin.value % 360) + 360) % 360) / 360)) }
                : {}),
        });
        // L.W11 S4 — mark the box with `data-palette-sweep` while the egg's
        // colour sweep is live, so the off-the-normal-path effect is observable
        // (the design-refinement browser probe reads `palette|sweep` on the box)
        // and scene CSS can register the tumble (a one-shot bloom, PRM-guarded).
        if (box.value) {
            if (spinning) box.value.setAttribute("data-palette-sweep", "");
            else box.value.removeAttribute("data-palette-sweep");
        }
        // The spin just settled this frame → restore the home colour (the CSS
        // `--subject-teal` token wins once the inline override is removed —
        // and the sweep's rainbow-green terminal stop IS that token's value, so
        // the landing is seamless by construction, J.W7a D13).
        if (springSpin.settled && box.value && box.value.style.backgroundColor) {
            box.value.style.backgroundColor = "";
        }

        // Self-terminate once every spring settles — re-armed by reseat()/tumble().
        const live = !(springX.settled && springY.settled && springSpin.settled);
        // L.W11 S4 — feed the scene's instrument layer the live spring snapshot
        // (the tether + the settled/tracking badge are derived reads of THIS, no
        // second rAF). Fired every frame the loop runs, plus once more on settle.
        onTick?.({
            x: springX.value,
            y: springY.value,
            settled: springX.settled && springY.settled,
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
    let spinTarget = 0;

    /** Roll the box one full turn (the "Tumble" egg). The box paint loop is the
     *  SOLE driver (no second rAF) — this only re-seats the spin target. */
    const tumble = (): void => {
        spinTarget += 360;
        springSpin.target = spinTarget;
        startLoop();
    };

    /** Arm the loop (idempotent — a no-op while already running). */
    const startLoop = (): void => {
        if (!playback.running) {
            lastNow = 0;
            playback.loop(frame);
        }
    };

    /**
     * Re-seat both axis targets from a normalized pointer offset. `nx`/`ny` ∈
     * [-1, 1]; the springs chase from their current state (continuous), and the
     * loop re-arms so the chase paints even if it had settled.
     */
    const reseat = (nx: number, ny: number): void => {
        springX.target = Math.max(-1, Math.min(1, nx));
        springY.target = Math.max(-1, Math.min(1, ny));
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
        try {
            const m = new DOMMatrixReadOnly(cs.transform);
            tx = m.m41;
            ty = m.m42;
        } catch {
            // KEEP: a malformed/"none" transform → seat at home (no jump from
            // rest) — the DOMMatrix parse is best-effort by design.
        }
        springX.reset(Math.max(-1, Math.min(1, tx / TRAVEL)), 0);
        springY.reset(Math.max(-1, Math.min(1, ty / TRAVEL)), 0);
        springSpin.reset(0, 0);
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
    // rainbow backgroundColor sweep across the sanctioned `--rainbow-*` family.
    // ±90px sits INSIDE the ±110px (TRAVEL) spring envelope so drag and playback
    // share ONE coordinate world (the pose-capture takeover is seamless). Now
    // duration/easing/direction/fill/iterations VISIBLY govern the paint — the
    // panel triad edits a live animation, not a dead one (the T.B3 honest panel).
    const { CSSKeyframesAnimation } = kfEngine();
    const anim = new CSSKeyframesAnimation({
        duration: 2000,
        iterationCount: Infinity,
        fillMode: "forwards",
    }).fromKeyframes(
        {
            "0%": {
                transform: { x: "0px", y: "0px", rotate: 0, a: { b: { c: { d: "100%" } } } },
                backgroundColor: "#C462D8",
            },
            "25%": {
                transform: { x: "90px", y: "-90px", rotate: 90, a: { b: { c: { d: "108%" } } } },
                backgroundColor: "#5AC8FA",
            },
            "50%": {
                transform: { x: "0px", y: "90px", rotate: 180, a: { b: { c: { d: "100%" } } } },
                backgroundColor: "#3DD0C4",
            },
            "75%": {
                transform: { x: "-90px", y: "-90px", rotate: 270, a: { b: { c: { d: "108%" } } } },
                backgroundColor: "#52E898",
            },
            "100%": {
                transform: { x: "0px", y: "0px", rotate: 360, a: { b: { c: { d: "100%" } } } },
                backgroundColor: "#C462D8",
            },
        },
        transformFunc,
    );

    // Paint the rest pose once on mount (the springs start at 0 → the box sits
    // home, un-deflected, before any drag). Also resolve the palette-sweep stops
    // from the live `--rainbow-*` tokens here (mount-time, DOM available) so the
    // tumble egg rides the sanctioned crayon family by construction (L.W11 S4).
    const paintRest = (): void => {
        resolvePaletteSweep();
        transformFunc({
            transform: { x: 0, y: 0, a: { b: { c: { d: 1 } } } },
            tilt: { x: 0, y: 0 },
            squash: { x: 1, y: 1 },
        });
        // Seat the instrument layer at rest (the tether hidden, the badge settled).
        onTick?.({ x: springX.value, y: springY.value, settled: true });
    };

    const dispose = (): void => {
        playback.stop();
        springX.dispose();
        springY.dispose();
        springSpin.dispose();
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

    return { anim, springX, springY, reseat, settle, seatFromPose, travel, startLoop, paintRest, tumble, dispose };
}
