/**
 * The cube's hand, for the browser specs (owner 2026-11-15: "apple like in
 * inertia and momentum ... highly interactive on mobile with multi touch").
 *
 *  · `installRecorder(frame)`: in the die's own document, every frame's start
 *    (rAF) and every write of the orbit's transform (a MutationObserver, with
 *    its time), so a frame shows the last write made before the next frame
 *    began, whichever callback made it; and every pointer event delivered.
 *  · `geometry(frame)`: the die's projected centre and the arcball radius R
 *    (useOrbitalGesture's radius()), in the frame's px.
 *  · `replay(page, cdp, offset, geom, sequence)`: a recorded hand, its points
 *    in R units about the die's centre, dispatched as real Chromium touches
 *    (CDP Input.dispatchTouchEvent: true multi-touch) at its own pace.
 *  · `SEQUENCE`: the one recorded hand both sites are judged by (the
 *    isomorphism: the same hand on keyframes.babb.dev and on
 *    daraksha.babb.dev/motion turns the die the same).
 */

export const installRecorder = (frame) =>
    frame.evaluate(() => {
        if (window.__hand) return;
        const H = (window.__hand = { on: false, f: [], m: [], ev: [] });
        const el = () => document.querySelector(".graph > div");
        const mo = new MutationObserver(() => H.on && H.m.push({ t: performance.now(), tf: el()?.style.transform ?? "" }));
        for (const type of ["pointerdown", "pointermove", "pointerup", "pointercancel"])
            addEventListener(type, (e) => H.on && H.ev.push({ type, t: e.timeStamp, d: performance.now(), x: e.clientX, y: e.clientY, id: e.pointerId }), {
                capture: true,
                passive: true,
            });
        const loop = (t) => {
            if (!H.on) return;
            H.f.push({ t, sy: scrollY, vs: visualViewport?.scale ?? 1 });
            requestAnimationFrame(loop);
        };
        H.start = () => {
            H.f = [];
            H.m = [];
            H.ev = [];
            H.tf0 = el()?.style.transform ?? "";
            mo.observe(el(), { attributes: true, attributeFilter: ["style"] });
            H.on = true;
            requestAnimationFrame(loop);
        };
        H.stop = () => {
            H.on = false;
            mo.disconnect();
            let j = 0;
            let tf = H.tf0;
            for (let i = 0; i < H.f.length; i++) {
                const until = i + 1 < H.f.length ? H.f[i + 1].t : Infinity;
                while (j < H.m.length && H.m[j].t < until) tf = H.m[j++].tf;
                H.f[i].tf = tf;
            }
            return { f: H.f, ev: H.ev, m: H.m };
        };
        H.pose = () => el()?.style.transform ?? "";
    });

/** The die's projected centre and arcball radius R (frame px). */
export const geometry = (frame) =>
    frame.evaluate(() => {
        const graph = document.querySelector(".graph");
        const g = graph.getBoundingClientRect();
        const glide = graph.closest(".stage-glide");
        const fit = glide && glide.offsetWidth > 0 ? glide.getBoundingClientRect().width / glide.offsetWidth : 1;
        const cell = graph.closest(".stage-cell, [data-orbit-stage]");
        let cap = Infinity;
        if (cell) {
            const r = cell.getBoundingClientRect();
            const cs = getComputedStyle(cell);
            cap =
                0.5 *
                Math.min(
                    r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
                    r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
                );
        }
        const side = document.querySelector(".cube")?.offsetWidth ?? 0;
        const h = (side * fit) / 2;
        return { c: { x: g.left + g.width / 2, y: g.top + g.height / 2 }, R: Math.max(96, Math.min(2 * h, Math.max(96, cap))), side };
    });

/** The orbit's pose off its container's transform. */
export const parsePose = (tf) => {
    const num = (re) => (re.exec(tf)?.slice(1) ?? []).map(Number);
    const [tx = 0, ty = 0] = num(/translate3d\(([-\d.e]+)px,\s*([-\d.e]+)px/);
    const [ax = 0, ay = 0, az = 1, deg = 0] = num(/rotate3d\(([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+)deg\)/);
    const [s = 1] = num(/scale3d\(([-\d.e]+)/);
    const n = Math.hypot(ax, ay, az) || 1;
    const h = (deg * Math.PI) / 360;
    return { t: [tx, ty], q: [(ax / n) * Math.sin(h), (ay / n) * Math.sin(h), (az / n) * Math.sin(h), Math.cos(h)], s };
};

/** The angle (rad) between two attitudes. */
export const turn = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])));

/** Shoemake's sphere point under a pointer offset u (R units). */
export const sphere = (ux, uy) => {
    const r2 = ux * ux + uy * uy;
    if (r2 <= 1) return [ux, uy, Math.sqrt(1 - r2)];
    const r = Math.sqrt(r2);
    return [ux / r, uy / r, 0];
};
const between = (a, b) =>
    Math.atan2(Math.hypot(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]), a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
/** The turn (rad) the arcball owes a grab at p0 now at p (frame px). */
export const owed = (geom, p0, p) =>
    2 * between(sphere((p0.x - geom.c.x) / geom.R, (p0.y - geom.c.y) / geom.R), sphere((p.x - geom.c.x) / geom.R, (p.y - geom.c.y) / geom.R));

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Dispatch a hand: `steps` = [{ type, pts: [{ u: {x, y}, id }], wait }], each
 * point in R units about the die's centre, as Chromium touches at page px
 * (`offset` = the frame's place in the page).
 */
export async function replay(cdp, offset, geom, steps) {
    for (const s of steps) {
        const touchPoints = s.pts.map((p) => ({
            x: offset.x + geom.c.x + p.u.x * geom.R,
            y: offset.y + geom.c.y + p.u.y * geom.R,
            id: p.id,
            radiusX: 4,
            radiusY: 4,
            force: 1,
        }));
        await cdp.send("Input.dispatchTouchEvent", { type: s.type, touchPoints });
        if (s.wait) await sleep(s.wait);
    }
}

/** One finger from u0 to u1 in n moves `every` ms apart; released moving, or after a hold. */
export const stroke = (u0, u1, n, every = 8, hold = 0, id = 1) => {
    const steps = [{ type: "touchStart", pts: [{ u: u0, id }], wait: every }];
    for (let i = 1; i <= n; i++)
        steps.push({ type: "touchMove", pts: [{ u: { x: u0.x + ((u1.x - u0.x) * i) / n, y: u0.y + ((u1.y - u0.y) * i) / n }, id }], wait: every });
    if (hold) steps.push({ type: "touchMove", pts: [{ u: u1, id }], wait: hold });
    steps.push({ type: "touchEnd", pts: [] });
    return steps;
};

/**
 * THE recorded hand of the isomorphism: a slow drag held still (it tracks),
 * then a flick released moving (it coasts), all in R units, so a die of any
 * size on any page is asked the same thing.
 */
export const SEQUENCE = {
    drag: stroke({ x: -0.45, y: 0.1 }, { x: 0.35, y: -0.15 }, 30, 8, 160),
    flick: stroke({ x: -0.4, y: 0.05 }, { x: 0.45, y: -0.05 }, 12, 8, 0),
};

/** Per-frame poses of a recording, and the rotation increments between them. */
export const posesOf = (raw) => raw.f.map((x) => ({ ...parsePose(x.tf), time: x.t, sy: x.sy, vs: x.vs }));

/** What one hand did to the die: the drag's turn, and the flick's carry and coast. */
export function readHand(raw, geom) {
    const P = posesOf(raw);
    const up = [...raw.ev].reverse().find((e) => e.type === "pointerup");
    const down = raw.ev.find((e) => e.type === "pointerdown");
    const moves = raw.ev.filter((e) => e.type === "pointermove" && e.t <= (up?.t ?? Infinity));
    const last = moves[moves.length - 1];
    const first = moves.find((e) => last && last.t - e.t <= 80) ?? last;
    const hand = last && first && last.t > first.t ? (owed(geom, down, last) - owed(geom, down, first)) / ((last.t - first.t) / 1000) : 0;
    const iUp = P.findIndex((p) => p.time >= (up?.d ?? Infinity));
    const after = iUp < 0 ? [] : P.slice(iUp);
    const rates = [];
    for (let i = 1; i < after.length; i++) rates.push(turn(after[i - 1].q, after[i].q) / ((after[i].time - after[i - 1].time) / 1000));
    let coast = 0;
    for (let i = 1; i < after.length; i++) coast += turn(after[i - 1].q, after[i].q);
    let restIdx = rates.findIndex((r, i) => i > 3 && r < 0.03);
    if (restIdx < 0) restIdx = rates.length;
    return {
        handRate: hand,
        carry: rates.length > 2 ? Math.max(...rates.slice(0, 3)) / (hand || 1) : 0,
        rates,
        coastRad: coast,
        restMs: after.length && restIdx < after.length ? after[restIdx].time - after[0].time : Infinity,
        atUp: iUp >= 0 ? P[iUp] : P[P.length - 1],
        end: P[P.length - 1],
        start: P[0],
        poses: P,
    };
}
