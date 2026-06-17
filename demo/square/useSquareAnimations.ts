import { kfEngine } from "@utils/kfEngine";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import { SpringProgress } from "@mkbabb/keyframes.js";
import { onScopeDispose, type Ref } from "vue";

/**
 * useSquareAnimations — the dogfood of the custom-transform-function over
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
 * THE TRANSPORT CONTRACT: the `CSSKeyframesAnimation` carries the same nested-
 * object keyframes so the bottom-bar Keyframes-string readout serializes the
 * nested structure (the primitive's authored shape). It is a minimal transport
 * host — like the Spring/Easing scenes' contract anim — and owns NO box paint
 * (the spring loop is the sole paint authority, so there is no double-writer).
 */
export function useSquareAnimations(
    // Accept the `useTemplateRef` shape (a readonly shallow ref that yields
    // `null` before mount) as well as a plain ref — the box only exists after
    // mount, so the transformFunc null-guards every read.
    box: Readonly<Ref<HTMLElement | null | undefined>>,
    // S5b (K.W0) — invoked the frame the live loop self-terminates (every spring
    // settled). The host uses it to clear the one-shot "Play = tumble" play state
    // when the barrel-roll comes to rest (an honest verb that returns to idle —
    // NO timer band-aid, NO shadow flag; the loop's own settle IS the signal).
    onSettle?: () => void,
) {
    // One spring per axis. Value/target are normalized [-1, 1] of the box's free
    // travel (mapped to a px translate). The (response 0.32, ζ 0.62) feel reads
    // as a lively, slightly springy chase under a drag.
    const springX = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });
    const springY = new SpringProgress({ response: 0.32, dampingFraction: 0.62, initial: 0 });

    // How far (px) a full [-1, 1] spring deflection translates the box.
    const TRAVEL = 110;

    /**
     * The CUSTOM TRANSFORM FUNCTION — the primitive. It composes `transform`
     * from a NESTED-OBJECT `vars` (`transform.a.b.c.d` is a real nested read that
     * maps to no CSS property) plus the live translate. Identical shape to the
     * engine's `transformFunc` contract; the spring loop feeds it live vars.
     */
    const transformFunc = (vars: Record<string, any>) => {
        const el = box.value;
        if (!el) return;
        const { transform, backgroundColor } = vars;
        const tx = transform?.x ?? 0;
        const ty = transform?.y ?? 0;
        const scale = transform?.a?.b?.c?.d ?? 1;
        // `rotate` is OPTIONAL — the live spring loop omits it (defaults to 0, a
        // no-op), the "tumble" egg sweeps it for a barrel-roll. Composing it into
        // the same custom transform keeps ONE paint authority (no second writer).
        const rotate = transform?.rotate ?? 0;
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`;
        if (backgroundColor) el.style.backgroundColor = backgroundColor;
    };

    // ── EASTER EGG — "the Tumble" (H.W12.S6) ─────────────────────────────────
    // Double-click the box → a delighted barrel-roll. A THIRD `SpringProgress`
    // chases a +360° target (a snappy underdamped spin with overshoot), folded
    // into the SAME paint loop + the SAME nested-object `transformFunc` (ONE
    // paint authority — the spin rides `transform.rotate`, no second writer).
    // While it spins the box sweeps through the contract-keyframe palette
    // (#C462D8 → #52E898) so the tumble also EXHIBITS the engine's color twin.
    // Re-seats to 0 after settling so a re-tumble starts fresh. inv ζ — the
    // light-surface SpringProgress drives the spin, no hand-rolled rAF.
    const springSpin = new SpringProgress({ response: 0.55, dampingFraction: 0.58, initial: 0 });
    const EGG_HUES = ["#C462D8", "#7E6BE8", "#52E898"] as const;
    const lerpHue = (t: number): string => {
        const span = EGG_HUES.length - 1;
        const i = Math.min(span - 1, Math.floor(t * span));
        const f = t * span - i;
        const mix = (a: number, b: number) => Math.round(a + (b - a) * f);
        const hex = (h: string) => [
            parseInt(h.slice(1, 3), 16),
            parseInt(h.slice(3, 5), 16),
            parseInt(h.slice(5, 7), 16),
        ];
        const [r1, g1, b1] = hex(EGG_HUES[i]!);
        const [r2, g2, b2] = hex(EGG_HUES[i + 1]!);
        return `rgb(${mix(r1!, r2!)}, ${mix(g1!, g2!)}, ${mix(b1!, b2!)})`;
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
        transformFunc({
            transform: {
                x: springX.value * TRAVEL,
                y: springY.value * TRAVEL,
                rotate: springSpin.value,
                a: { b: { c: { d: 1 + defl * 0.12 } } },
            },
            // Sweep the palette WHILE the egg spin is live (keyed off the angle
            // WITHIN the current turn, so it cycles each tumble); when the spin
            // settles, clear the inline background so the box's CSS home colour
            // (--subject-teal — the EGG_HUES terminal stop itself, J.W7a D13)
            // returns.
            ...(spinning
                ? { backgroundColor: lerpHue(((((springSpin.value % 360) + 360) % 360) / 360)) }
                : {}),
        });
        // The spin just settled this frame → restore the home colour (the CSS
        // `--subject-teal` token wins once the inline override is removed —
        // and the egg's #52E898 terminal stop IS that token's value, so the
        // landing is seamless by construction, J.W7a D13).
        if (springSpin.settled && box.value && box.value.style.backgroundColor) {
            box.value.style.backgroundColor = "";
        }

        // Self-terminate once every spring settles — re-armed by reseat()/tumble().
        const live = !(springX.settled && springY.settled && springSpin.settled);
        // S5b — the moment the loop comes fully to rest, signal the host so the
        // one-shot "Play = tumble" play state clears (the button returns to Play).
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

    /** How far (px) a full [-1,1] deflection travels — for the drag math. */
    const travel = TRAVEL;

    // ── The bottom-bar transport-contract host (the nested-object keyframes) ──
    // Minimal CSSKeyframesAnimation carrying the SAME nested-object keyframes so
    // the Keyframes-string readout serializes the authored nested shape. Like the
    // Spring/Easing contract anim, it drives no box paint. HEAVY — constructed
    // through the warmed engine surface (kfEngine(), L.W8 S1 dogfood inversion);
    // the warm resolves before any scene mounts, so this stays synchronous. The
    // live spring drag path (above) is LIGHT and runs independent of this.
    const { CSSKeyframesAnimation } = kfEngine();
    const anim = new CSSKeyframesAnimation({
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
        fillMode: "forwards",
    }).fromKeyframes(
        {
            "0%": {
                transform: { x: "0px", y: "0px", a: { b: { c: { d: "100%" } } } },
                backgroundColor: "#C462D8",
            },
            "100%": {
                transform: { x: "0px", y: "0px", a: { b: { c: { d: "112%" } } } },
                backgroundColor: "#52E898",
            },
        },
        transformFunc,
    );

    // Paint the rest pose once on mount (the springs start at 0 → the box sits
    // home, un-deflected, before any drag).
    const paintRest = (): void => {
        transformFunc({
            transform: { x: 0, y: 0, a: { b: { c: { d: 1 } } } },
        });
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

    return { anim, springX, springY, reseat, settle, travel, startLoop, paintRest, tumble, dispose };
}
