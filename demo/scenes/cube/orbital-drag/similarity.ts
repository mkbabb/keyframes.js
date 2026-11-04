// SERVED MODEL: claude-opus-5-5
/**
 * Two pointers, one similarity (KF-M2, COHESION §0hm D-7 · D-13 · D-30). Pure.
 *
 * From the anchor pair (p₀, p₁) to the current pair, with d = p₁ − p₀ and m the
 * midpoint, the hand authors three independent channels:
 *   zoom   k  = |d| / |d₀|                    (multiplicative, never additive)
 *   twist  Δθ = atan2(d₀ × d, d₀ · d)         (signed; exactly 0 for parallel
 *                                              fingers, so no sentinel)
 *   pan    Δm = m − m₀
 * Each channel sits behind a small dead zone so the other two do not leak into
 * it (a pinch's ±3° wobble is not a roll). The dead zone is PAID BACK as the
 * gesture grows — eff = raw − thr²/raw past the threshold — so the channel
 * engages from zero (no jump) and a full gesture lands 1:1.
 */

export type Vec2 = { x: number; y: number };
export type Box = { left: number; top: number; right: number; bottom: number };

/** Dead zones: twist 4°, pinch |ln k| 0.04, pan 6 px. */
export const TWIST_DEADZONE_RAD = (4 * Math.PI) / 180;
export const PINCH_DEADZONE_LN = 0.04;
export const PAN_DEADZONE_PX = 6;

export interface PairReading {
    /** Zoom ratio |d|/|d₀|. */
    k: number;
    /** Signed twist (rad); positive is clockwise on screen (y down). */
    dTheta: number;
    /** Midpoint travel. */
    dm: Vec2;
    /** The anchor midpoint. */
    m0: Vec2;
}

export const readPair = (a0: Vec2, b0: Vec2, a: Vec2, b: Vec2): PairReading => {
    const d0x = b0.x - a0.x;
    const d0y = b0.y - a0.y;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l0 = Math.hypot(d0x, d0y);
    const l = Math.hypot(dx, dy);
    const m0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
    return {
        k: l0 > 0 ? l / l0 : 1,
        dTheta: Math.atan2(d0x * dy - d0y * dx, d0x * dx + d0y * dy),
        dm: { x: (a.x + b.x) / 2 - m0.x, y: (a.y + b.y) / 2 - m0.y },
        m0,
    };
};

/** The soft dead zone: 0 inside ±thr, raw − thr²/raw outside (continuous at
 *  thr, → raw as the gesture grows). */
export const softDeadzone = (raw: number, thr: number) => {
    const a = Math.abs(raw);
    return a <= thr ? 0 : Math.sign(raw) * (a - (thr * thr) / a);
};

export interface PairEffect {
    k: number;
    dTheta: number;
    dm: Vec2;
}

/** The reading after each channel's dead zone. */
export const engagePair = (r: PairReading): PairEffect => {
    const lnk = softDeadzone(Math.log(r.k), PINCH_DEADZONE_LN);
    const len = Math.hypot(r.dm.x, r.dm.y);
    const panLen = softDeadzone(len, PAN_DEADZONE_PX);
    const f = len > 0 ? panLen / len : 0;
    return {
        k: Math.exp(lnk),
        dTheta: softDeadzone(r.dTheta, TWIST_DEADZONE_RAD),
        dm: { x: r.dm.x * f, y: r.dm.y * f },
    };
};

/**
 * The anchored translation: t = t₀ + Δm + (k′ − 1)(c₀ − m₀). The content under
 * the anchor centroid stays under the fingers through the whole pinch, and a
 * two-finger drag moves the subject exactly as far as the fingers.
 */
export const anchoredTranslate = (
    t0: Vec2,
    dm: Vec2,
    kEff: number,
    c0: Vec2,
    m0: Vec2,
): Vec2 => ({
    x: t0.x + dm.x + (kEff - 1) * (c0.x - m0.x),
    y: t0.y + dm.y + (kEff - 1) * (c0.y - m0.y),
});

/** Hold a point inside a box (a missing or inverted box holds nothing). */
export const clampToBox = (p: Vec2, box: Box | null | undefined): Vec2 => {
    if (!box || box.right < box.left || box.bottom < box.top) return p;
    return {
        x: Math.min(box.right, Math.max(box.left, p.x)),
        y: Math.min(box.bottom, Math.max(box.top, p.y)),
    };
};

/** Unwrap a twist reading (rad) onto the turn nearest the previous one, so a
 *  twist past ±180° keeps counting. */
export const unwrapRadians = (a: number, prev: number) =>
    a + 2 * Math.PI * Math.round((prev - a) / (2 * Math.PI));
