<template>
    <!-- THE PAIR: two dice on the stage's own graph paper, laid as a table
         seen from above at an angle (dicePhysics.ts: the model, the camera and
         the table). A tap throws both; a flick throws them along it; a die
         pressed is picked up and carried (it rolls in the hand) and thrown on
         release; two fingers on a held die twist it. Space or Enter throws.
         One frame loop, running only while something moves. -->
    <div
        ref="stageEl"
        class="dice-stage"
        :data-cube-skin="skin"
        tabindex="0"
        role="group"
        aria-roledescription="dice"
        aria-label="Two dice: tap or flick to throw them, press a die to carry it"
        @pointerdown="onDown"
        @keydown="onKey"
    >
        <div class="dice-camera" :style="cameraVars">
            <div class="dice-table">
                <div class="dice-floor grid-background" aria-hidden="true"></div>
                <div
                    v-for="i in 2"
                    :key="`s${i}`"
                    :ref="(el) => (shadowEls[i - 1] = el as HTMLElement)"
                    class="die-shadow"
                    aria-hidden="true"
                ></div>
                <div
                    v-for="i in 2"
                    :key="`d${i}`"
                    :ref="(el) => (dieEls[i - 1] = el as HTMLElement)"
                    class="die"
                    aria-hidden="true"
                >
                    <!-- The core, inset 4 % in the seam ink: the seams read as
                         the die's hairline, never the table. -->
                    <div v-for="f in DIE_FACES" :key="`c${f.side}`" :class="['die-core', `die--${f.side}`]"></div>
                    <div v-for="f in DIE_FACES" :key="f.side" :class="['die-face', `die--${f.side}`]">
                        <div
                            class="die-fill"
                            :style="{
                                backgroundColor: valueColor(labels[i - 1]![f.side]),
                                color: valueInk(labels[i - 1]![f.side]),
                            }"
                        >
                            <DiePips :value="labels[i - 1]![f.side]" :class="{ 'die-pips--out': pipsOut }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="sr-only" aria-live="polite">{{ said }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, shallowReactive, shallowRef, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { SpringProgress } from "@mkbabb/keyframes.js";
import type { CubeSkin } from "@state";
import DiePips from "./DiePips.vue";
import { DIE_FACES, valueColor, valueInk, type DieValue } from "./pips";
import {
    TABLE_TILT,
    TILT_DEG,
    cameraFor,
    dieMatrix,
    faceUp,
    flatten,
    launch,
    newDie,
    project,
    qAxisAngle,
    qConj,
    qMul,
    qNorm,
    qSlerp,
    randomSpin,
    relabelUp,
    restingOn,
    rollingSpin,
    stepPair,
    tableDepth,
    tableFor,
    throwDice,
    unproject,
    type Camera,
    type Die,
    type Labels,
    type Q,
    type Table,
    type V3,
} from "./dicePhysics";
import { createFollower, frameSeconds, stepFollower, type Follower } from "../orbital-drag/follower";
import "./dice.css";

/** A die's pose on the table, and its scale. */
interface DiePose {
    q: Q;
    p: V3;
    scale: number;
}

/** The single die as the stage shows it: its attitude in the screen's frame,
 *  its centre (px from the stage's centre) and its side as seen (px). */
export interface StageDie {
    q: Q;
    x: number;
    y: number;
    side: number;
}

const props = defineProps<{
    skin: CubeSkin;
    /** The single die, when the pair takes over from it: the first die
     *  settles from there onto the table and the second drops in. */
    arrival?: StageDie | null;
}>();
const emit = defineEmits<{
    (e: "rolled", values: [DieValue, DieValue]): void;
    /** The pair has painted its first frame. */
    (e: "shown"): void;
}>();

const stageEl = useTemplateRef<HTMLElement>("stageEl");
const dieEls: HTMLElement[] = [];
const shadowEls: HTMLElement[] = [];

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
const rnd = Math.random;
const randValue = () => (1 + Math.floor(rnd() * 6)) as DieValue;

// ── The stage, the camera and the table ─────────────────────────────
const size = shallowReactive({ w: 0, h: 0 });
let cam: Camera = cameraFor(400, 400);
let table: Table = tableFor(cam);
const cameraVars = computed(() => {
    const c = cameraFor(size.w || 400, size.h || 400);
    return { "--persp": `${c.persp}px`, "--tilt": `${TILT_DEG}deg`, "--side": `${c.side}px` };
});
const tall = () => size.h > size.w * 1.2;

const dice: Die[] = [newDie([-60, 0, 40], 2, 0.4), newDie([60, 10, 40], 3, -0.5)];
/** The faces' values (a die relabelled under reduced motion keeps its hand). */
const labels = shallowRef<[Labels, Labels]>([{ ...dice[0]!.labels }, { ...dice[1]!.labels }]);
/** Each die's scale (1 on the table; the hand-over with the single die). */
const scales = [1, 1];

useResizeObserver(stageEl, (entries) => {
    const r = entries[0]?.contentRect;
    if (!r || r.width === 0 || r.height === 0) return;
    size.w = r.width;
    size.h = r.height;
    cam = cameraFor(size.w, size.h);
    table = tableFor(cam);
    const s = table.side;
    for (const d of dice) {
        if (d.phase === "rest") d.p[2] = s / 2;
        d.p[0] = Math.max(-table.halfX + s / 2, Math.min(table.halfX - s / 2, d.p[0]));
        d.p[1] = Math.max(-table.farY + s / 2, Math.min(table.nearY - s / 2, d.p[1]));
    }
    if (!entered) {
        entered = true;
        enter();
    } else paint();
});
let entered = false;

/** The pair's opening places: side by side about the table's middle (one
 *  beyond the other on a narrow table). */
const homes = (): [V3, V3] => {
    const s = table.side;
    const { mid, depth } = tableDepth(table);
    const y = mid + (tall() ? 0.05 * depth : 0);
    return table.halfX - 0.55 * s < 1.65 * s
        ? [
              [0, y - 0.8 * s, s / 2],
              [0, y + 0.8 * s, s / 2],
          ]
        : [
              [-0.9 * s, y, s / 2],
              [0.9 * s, y, s / 2],
          ];
};

// ── The paint: one transform per die and per shadow ─────────────────
function paint() {
    const s = table.side;
    for (let i = 0; i < 2; i++) {
        const d = dice[i]!;
        const el = dieEls[i];
        if (el) el.style.transform = dieMatrix(d, scales[i]);
        const sh = shadowEls[i];
        if (sh) {
            // One flat ellipse on the table under the die: wider and fainter
            // as the die rises off it.
            const lift = Math.max(0, d.p[2] - s / 2) / s;
            sh.style.transform = `translate3d(${d.p[0]}px, ${d.p[1]}px, 1px) scale(${(1 + 0.35 * lift) * scales[i]!})`;
            sh.style.opacity = String(Math.max(0, 1 - 0.45 * lift));
        }
    }
}

// ── Tweens: the hand-over with the single die, on keyframes' springs ─
/** The gentle spring (about 450 ms) and the quicker one. */
const GENTLE = { response: 0.42, dampingFraction: 1 };
const QUICK = { response: 0.26, dampingFraction: 1 };
interface Tween {
    spring: SpringProgress;
    apply: (u: number) => void;
    done: () => void;
}
const tweens = new Set<Tween>();
const tween = (spec: { response: number; dampingFraction: number }, apply: (u: number) => void) =>
    new Promise<void>((done) => {
        const spring = new SpringProgress({ ...spec, initial: 0, settleThreshold: 1e-4, velocitySettleThreshold: 1e-3, respectReducedMotion: false });
        spring.target = 1;
        tweens.add({ spring, apply, done });
        run();
    });
const stepTweens = (dt: number) => {
    for (const t of tweens) {
        const u = t.spring.tickDt(dt * 1000);
        t.apply(t.spring.settled ? 1 : u);
        if (t.spring.settled) {
            tweens.delete(t);
            t.done();
        }
    }
};
/** A pose between two, at u. */
const between = (d: Die, i: number, a: DiePose, b: DiePose, u: number) => {
    d.q = qSlerp(a.q, b.q, u);
    d.p = [a.p[0] + (b.p[0] - a.p[0]) * u, a.p[1] + (b.p[1] - a.p[1]) * u, a.p[2] + (b.p[2] - a.p[2]) * u];
    scales[i] = a.scale + (b.scale - a.scale) * u;
};

// ── The one frame loop ───────────────────────────────────────────────
let raf = 0;
let last = 0;
/** A throw is in the air: its result is said when the dice come to rest
 *  (an entrance or a hand-over is not a throw). */
let thrown = false;
const said = shallowRef("");

function frame(now: number) {
    raf = 0;
    const dt = last ? frameSeconds(last, now) : 1 / 60;
    last = now;
    stepTweens(dt);
    stepHeld(dt);
    const rolling = stepPair(dice, table, dt);
    paint();
    if (rolling || held || tweens.size) {
        raf = requestAnimationFrame(frame);
    } else {
        last = 0;
        if (thrown) {
            thrown = false;
            landed();
        }
    }
}
const run = () => {
    if (!raf) raf = requestAnimationFrame(frame);
};

const valuesUp = () => dice.map((d) => faceUp(d.q, d.labels).value) as [DieValue, DieValue];
function landed() {
    const values = valuesUp();
    said.value = `${values[0]} and ${values[1]}`;
    emit("rolled", values);
}

// ── Throws ───────────────────────────────────────────────────────────
/** Reduced motion's throw: the dice keep their place and their attitude;
 *  each is relabelled by the turn of its marks that brings the rolled value
 *  up, so it is still a true die. The pips go out (120 ms), the face colours
 *  cross over (200 ms), the pips come back (160 ms). Nothing moves and
 *  nothing vanishes. */
const pipsOut = shallowRef(false);
let relabelling = false;
function relabelThrow() {
    if (relabelling) return;
    relabelling = true;
    said.value = "";
    pipsOut.value = true;
    window.setTimeout(() => {
        for (const d of dice) d.labels = relabelUp(d.q, d.labels, randValue());
        labels.value = [{ ...dice[0]!.labels }, { ...dice[1]!.labels }];
        pipsOut.value = false;
        window.setTimeout(() => {
            relabelling = false;
            landed();
        }, 200);
    }, 120);
}

/** Throw both dice (a tap, Space or Enter), or along a flick (table px/s). */
function throwBoth(flick?: V3) {
    if (reducedMotion()) return relabelThrow();
    if (tweens.size) return;
    throwDice(dice, table, { tall: tall(), rnd, ...(flick ? { flick } : {}) });
    said.value = "";
    thrown = true;
    run();
}

// ── The hand ─────────────────────────────────────────────────────────
interface Sample {
    t: number;
    p: V3;
}
/** The held die rides K1's follower (stiff: its lag behind a steady hand is
 *  2/ω, a few px). */
const CARRY_OMEGA = 90;
type Hold = { i: number; id: number; target: V3; follow: Follower; samples: Sample[]; twistAt: number | null; twistRate: number };
let held: Hold | null = null;
const pointers = new Map<number, { x: number; y: number }>();
let tableGesture: { id: number; x0: number; y0: number; t0: number; samples: { t: number; x: number; y: number }[] } | null = null;

const fromCentre = (x: number, y: number) => {
    const r = stageEl.value!.getBoundingClientRect();
    return { sx: x - (r.left + r.width / 2), sy: y - (r.top + r.height / 2) };
};

/** The die under a stage point, if any. */
function dieAt(sx: number, sy: number): number {
    let best = -1;
    let bestD = Infinity;
    dice.forEach((d, i) => {
        const pr = project(cam, d.p);
        const dist = Math.hypot(pr.x - sx, pr.y - sy);
        if (dist < 0.8 * table.side * pr.k && dist < bestD) {
            best = i;
            bestD = dist;
        }
    });
    return best;
}

/** How high a die is carried (its centre, px above the table). */
const carryZ = () => table.side * 1.25;
/** The hand's point on the carry plane, kept inside the walls. */
const carryTarget = (x: number, y: number): V3 => {
    const { sx, sy } = fromCentre(x, y);
    const p = unproject(cam, sx, sy, carryZ());
    const m = table.side / 2;
    return [Math.max(-table.halfX + m, Math.min(table.halfX - m, p[0])), Math.max(-table.farY + m, Math.min(table.nearY - m, p[1])), p[2]];
};

function onDown(e: PointerEvent) {
    const el = stageEl.value;
    if (!el || tweens.size) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture?.(e.pointerId);
    if (pointers.size === 1) {
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
    }
    if (held) {
        // A second finger on a held die: the pair's angle twists it.
        if (pointers.size === 2) held.twistAt = twistAngle();
        return;
    }
    const { sx, sy } = fromCentre(e.clientX, e.clientY);
    const i = dieAt(sx, sy);
    if (i >= 0 && !reducedMotion() && !relabelling) {
        const d = dice[i]!;
        d.phase = "held";
        d.settle = undefined;
        d.v = [0, 0, 0];
        d.w = [0, 0, 0];
        const follow = createFollower(3, CARRY_OMEGA);
        follow.x = [...d.p];
        const target = carryTarget(e.clientX, e.clientY);
        follow.T = [...target];
        held = { i, id: e.pointerId, target, follow, samples: [{ t: e.timeStamp, p: target }], twistAt: null, twistRate: 0 };
        said.value = "";
        run();
        return;
    }
    tableGesture = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: e.timeStamp, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] };
}

function twistAngle(): number {
    const [a, b] = [...pointers.values()];
    return a && b ? Math.atan2(b.y - a.y, b.x - a.x) : 0;
}

/** Twist the held die about the table's vertical (screen clockwise is the
 *  table's clockwise seen from above). */
const twistHeld = (da: number, dtS: number) => {
    if (!held) return;
    const d = dice[held.i]!;
    d.q = qNorm(qMul(qAxisAngle([0, 0, 1], da), d.q));
    held.twistRate = 0.7 * held.twistRate + (0.3 * da) / Math.max(dtS, 1 / 240);
    run();
};

function onMove(e: PointerEvent) {
    if (!pointers.has(e.pointerId)) return;
    const evs = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
    for (const m of evs.length ? evs : [e]) {
        pointers.set(e.pointerId, { x: m.clientX, y: m.clientY });
        if (held && e.pointerId === held.id) {
            held.target = carryTarget(m.clientX, m.clientY);
            held.follow.T = [...held.target];
            held.samples.push({ t: m.timeStamp, p: held.target });
            while (held.samples.length > 2 && m.timeStamp - held.samples[0]!.t > 90) held.samples.shift();
        } else if (tableGesture && e.pointerId === tableGesture.id) {
            tableGesture.samples.push({ t: m.timeStamp, x: m.clientX, y: m.clientY });
            while (tableGesture.samples.length > 2 && m.timeStamp - tableGesture.samples[0]!.t > 90) tableGesture.samples.shift();
        }
    }
    if (held && held.twistAt !== null && pointers.size === 2) {
        const a = twistAngle();
        let da = a - held.twistAt;
        if (da > Math.PI) da -= 2 * Math.PI;
        if (da < -Math.PI) da += 2 * Math.PI;
        held.twistAt = a;
        twistHeld(da, 1 / 60);
    }
    run();
}

/** The carried die follows the hand on the follower and rolls the way it is
 *  carried. */
function stepHeld(dt: number) {
    if (!held) return;
    const d = dice[held.i]!;
    stepFollower(held.follow, dt);
    d.p = [held.follow.x[0]!, held.follow.x[1]!, held.follow.x[2]!];
    const w = rollingSpin([held.follow.v[0]!, held.follow.v[1]!, 0], table.side);
    const wl = Math.hypot(w[0], w[1], w[2]);
    if (wl > 1e-6) d.q = qNorm(qMul(qAxisAngle(w, wl * dt * 0.5), d.q));
}

/** The hand's velocity over its last 90 ms (table px/s). */
function handVelocity(samples: Sample[]): V3 {
    const a = samples[0];
    const b = samples[samples.length - 1];
    if (!a || !b || b.t - a.t < 8) return [0, 0, 0];
    const k = 1000 / (b.t - a.t);
    return [(b.p[0] - a.p[0]) * k, (b.p[1] - a.p[1]) * k, 0];
}

function onUp(e: PointerEvent) {
    pointers.delete(e.pointerId);
    const el = stageEl.value;
    if (held) {
        if (e.pointerId !== held.id) {
            held.twistAt = null;
        } else {
            // Let go moving: thrown at the hand's speed. Let go still: dropped.
            const d = dice[held.i]!;
            const s = table.side;
            const v = handVelocity(held.samples);
            const sp = Math.hypot(v[0], v[1]);
            const cap = 14 * s;
            const k = sp > cap ? cap / sp : 1;
            const moving = sp > 1.5 * s;
            const vv: V3 = [v[0] * k, v[1] * k, moving ? 2.5 * s : 0];
            const roll = rollingSpin(vv, s);
            const r = moving ? randomSpin(4, 10, rnd) : ([0, 0, 0] as V3);
            launch(d, vv, [roll[0] + r[0], roll[1] + r[1], roll[2] + r[2] + held.twistRate]);
            held = null;
            thrown = true;
            run();
        }
    } else if (tableGesture && e.pointerId === tableGesture.id) {
        const g = tableGesture;
        tableGesture = null;
        const moved = Math.hypot(e.clientX - g.x0, e.clientY - g.y0);
        if (moved < 10 && e.timeStamp - g.t0 < 400) {
            throwBoth();
        } else {
            const a = g.samples[0]!;
            const b = g.samples[g.samples.length - 1]!;
            const dtms = Math.max(8, b.t - a.t);
            const pa = fromCentre(a.x, a.y);
            const pb = fromCentre(b.x, b.y);
            const ua = unproject(cam, pa.sx, pa.sy, 0);
            const ub = unproject(cam, pb.sx, pb.sy, 0);
            const kv = 1000 / dtms;
            const fl: V3 = [(ub[0] - ua[0]) * kv, (ub[1] - ua[1]) * kv, 0];
            if (Math.hypot(fl[0], fl[1]) > 2 * table.side) throwBoth(fl);
        }
    }
    if (pointers.size === 0 && el) {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
    }
}

function onKey(e: KeyboardEvent) {
    if (e.key === "Enter") {
        e.preventDefault();
        throwBoth();
    }
}

/** A gesture the host relays (babb-embed v1): it twists a held die and is
 *  otherwise ignored (the table never zooms or pans). */
let relayedAngle: number | null = null;
function relay(phase: string, rotationDeg: number) {
    if (phase === "start" || relayedAngle === null) {
        relayedAngle = rotationDeg;
        return;
    }
    const da = ((rotationDeg - relayedAngle) * Math.PI) / 180;
    relayedAngle = phase === "end" ? null : rotationDeg;
    if (held) twistHeld(da, 1 / 60);
}

// ── The entrance and the hand-over with the single die ──────────────
function enter() {
    const [a, b] = homes();
    dice[0]!.p = [...a];
    dice[1]!.p = [...b];
    dice[0]!.q = restingOn(randValue(), rnd() * Math.PI);
    dice[1]!.q = restingOn(randValue(), rnd() * Math.PI);
    labels.value = [{ ...dice[0]!.labels }, { ...dice[1]!.labels }];
    if (reducedMotion()) {
        paint();
        emit("shown");
        return;
    }
    if (props.arrival) {
        // The single die settles from its orbit onto the table (to the
        // nearest resting face, its yaw kept) on the gentle spring, and the
        // second drops in beside it.
        const from = onTable(props.arrival);
        const d = dice[0]!;
        d.phase = "held";
        const to: DiePose = { q: flatten(from.q), p: [...a], scale: 1 };
        between(d, 0, from, from, 0);
        void tween(GENTLE, (u) => between(d, 0, from, to, u)).then(() => {
            d.q = to.q;
            d.p = [...to.p];
            d.phase = "rest";
        });
        dropIn(1);
    } else {
        dropIn(0);
        dropIn(1);
    }
    paint();
    emit("shown");
    run();
}

/** A die drops onto the table from above with a little spin. */
function dropIn(i: number) {
    const s = table.side;
    const d = dice[i]!;
    d.p[2] = s * 3.2;
    launch(d, [(rnd() - 0.5) * s, (rnd() - 0.5) * s, -2 * s], randomSpin(5, 9, rnd));
}

/**
 * The pair gives way to the single die: the second lifts away on the quicker
 * spring and the first rises to `to` (the single die's pose) on the gentle
 * one. Under reduced motion it resolves at once (the slice fades).
 */
async function leave(single: StageDie | null): Promise<void> {
    if (held) held = null;
    if (reducedMotion() || !single) return;
    const to = onTable(single);
    const s = table.side;
    for (const d of dice) {
        d.phase = "held";
        d.v = [0, 0, 0];
        d.w = [0, 0, 0];
    }
    const [a, b] = dice as [Die, Die];
    const fromA: DiePose = { q: a.q, p: [...a.p], scale: scales[0]! };
    const fromB: DiePose = { q: b.q, p: [...b.p], scale: scales[1]! };
    const away: DiePose = { q: qNorm(qMul(qAxisAngle([1, 0, 0], -1.2), b.q)), p: [b.p[0], b.p[1] - 2 * s, b.p[2] + 7 * s], scale: 1 };
    await Promise.all([tween(QUICK, (u) => between(b, 1, fromB, away, u)), tween(GENTLE, (u) => between(a, 0, fromA, to, u))]);
}

/** The single die on the table: its attitude turned into the table's frame,
 *  its centre where the stage shows it (at a resting die's height), and the
 *  scale that shows it at its size. */
const onTable = (die: StageDie): DiePose => {
    const p = unproject(cam, die.x, die.y, table.side / 2);
    return { q: qNorm(qMul(qConj(TABLE_TILT), die.q)), p, scale: die.side / (table.side * project(cam, p).k) };
};

onBeforeUnmount(() => {
    if (raf) cancelAnimationFrame(raf);
    for (const t of tweens) t.done();
    tweens.clear();
});

defineExpose({ throwBoth, relay, leave, valuesUp });
</script>

<style scoped>
.dice-stage {
    position: absolute;
    inset: 0;
    overflow: hidden;
    touch-action: none;
    overscroll-behavior: contain;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: grab;
}
.dice-stage:focus,
.dice-stage:focus-visible {
    outline: none;
}

.dice-camera {
    position: absolute;
    inset: 0;
    perspective: var(--persp);
}

/* The table: an origin at the stage's centre, turned back by the tilt. */
.dice-table {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-style: preserve-3d;
    transform: rotateX(var(--tilt));
}

/* Keyframes' own graph paper is the table, foreshortened with it. */
.dice-floor {
    position: absolute;
    inline-size: 2400px;
    block-size: 2400px;
    left: -1200px;
    top: -1200px;
    mask-image: radial-gradient(closest-side, #000 30%, transparent 70%);
    pointer-events: none;
}

/* The shadow: one flat neutral ellipse on the table under each die (a circle
   on the tilted table), solid to 55 % and soft at its rim; no blur filter.
   Black at 22 % on light paper, 42 % on dark, so at rest it reads darker than
   the table in both themes. */
.die-shadow {
    position: absolute;
    inline-size: calc(var(--side) * 1.3);
    block-size: calc(var(--side) * 1.3);
    left: calc(var(--side) * -0.65);
    top: calc(var(--side) * -0.65);
    border-radius: 50%;
    --die-shadow: light-dark(rgb(0 0 0 / 0.22), rgb(0 0 0 / 0.42));
    background: radial-gradient(closest-side, var(--die-shadow) 55%, transparent);
    pointer-events: none;
}

.die {
    position: absolute;
    inline-size: var(--side);
    block-size: var(--side);
    left: calc(var(--side) / -2);
    top: calc(var(--side) / -2);
    transform-style: preserve-3d;
}

/* The faces: rounded to a tenth of the side, over an opaque base of the page
   ground (a translucent crayon composites as on the cube). */
.die-face {
    position: absolute;
    inset: 0;
    border-radius: calc(var(--side) * 0.1);
    backface-visibility: hidden;
    background-color: var(--background);
    --at: calc(var(--side) / 2);
}
.die-fill {
    position: absolute;
    inset: -0.5px;
    border-radius: inherit;
    transition: background-color 200ms ease-in-out;
}
.die-fill :deep(.die-pips) {
    transition: opacity 160ms ease-out 40ms;
}
.die-fill :deep(.die-pips--out) {
    opacity: 0;
    transition: opacity 120ms ease-in;
}

/* The core: six planes inset 4 % in the seam ink. */
.die-core {
    position: absolute;
    inset: 4%;
    background: var(--die-seam);
    backface-visibility: hidden;
    --at: calc(var(--side) * 0.46);
}

.die--front {
    transform: translateZ(var(--at));
}
.die--back {
    transform: rotateY(180deg) translateZ(var(--at));
}
.die--right {
    transform: rotateY(90deg) translateZ(var(--at));
}
.die--left {
    transform: rotateY(-90deg) translateZ(var(--at));
}
.die--top {
    transform: rotateX(90deg) translateZ(var(--at));
}
.die--bottom {
    transform: rotateX(-90deg) translateZ(var(--at));
}
</style>
