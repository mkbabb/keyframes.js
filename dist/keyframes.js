import { parseCSSStylesheet as k, extractAnimationOptions as tt, extractProperties as W, extractKeyframes as P, easeInOutCubic as z, lerp as B, requestAnimationFrame as g, cancelAnimationFrame as T, clamp as V, CSSFunction as j, CSSValues as I, memoize as A, extractStyleRules as et, parseCSSValue as st, hyphenToCamelCase as M, CSSCubicBezier as it, timingFunctions as N, ValueUnit as y, prepareInterpVar as rt, normalizeValueUnits as nt, flattenObject as Y, unflattenObjectToString as q, ValueArray as v, FunctionValue as H, tryParse as at, scale as G, COMPUTED_UNITS as ot, convertToMs as lt, parseCSSValueUnit as ht, seekPreviousValue as D, unflattenObject as ut, parseCSSTime as $, sleep as ct, isObject as ft, lerpValue as pt } from "@mkbabb/value.js";
import { CSSCubicBezier as ne, bezierPresets as ae, bounceInEase as oe, bounceInEaseHalf as le, bounceInOutEase as he, bounceOutEase as ue, bounceOutEaseHalf as ce, cancelAnimationFrame as fe, clamp as pe, cubicBezier as me, cubicBezierToSVG as de, cubicBezierToString as ge, deCasteljau as ye, easeInBounce as be, easeInCirc as ve, easeInCubic as we, easeInExpo as Fe, easeInOutCirc as Ve, easeInOutCubic as Se, easeInOutExpo as Te, easeInOutQuad as Ie, easeInOutSine as Ee, easeInQuad as ke, easeInSine as Pe, easeOutCirc as Ae, easeOutCubic as Oe, easeOutExpo as Me, easeOutQuad as _e, easeOutSine as Ce, interpBezier as xe, jumpTerms as je, lerp as De, linear as $e, logerp as Re, parseCSSPercent as Ke, parseCSSStylesheet as Le, parseCSSTime as Ue, requestAnimationFrame as We, scale as ze, sleep as Be, smoothStep3 as Ne, stepEnd as Ye, stepStart as qe, steppedEase as He, timingFunctionDescriptions as Ge, timingFunctions as Xe } from "@mkbabb/value.js";
import { any as mt } from "@mkbabb/parse-that";
function X(i, t, e, s) {
  let r = 0, n = i.length - 1;
  for (; r <= n; ) {
    const a = r + n >> 1, o = i[a];
    if (t < e(o)) n = a - 1;
    else if (t > s(o)) r = a + 1;
    else return a;
  }
  return -1;
}
const dt = (i) => {
  const t = {};
  for (const e of i.declarations)
    t[e.name] = e.value;
  return t;
}, gt = (i) => {
  const t = [];
  for (const e of i.selectors)
    e.kind === "percent" ? t.push(`${e.value}%`) : t.push(e.name);
  return t;
}, yt = (i) => {
  const t = P(i);
  for (const e of t.values())
    if (e.length > 0) return e;
  return [];
}, bt = (i) => {
  const t = i.trim();
  return /@keyframes\b/i.test(t) || t.length === 0 ? i : `@keyframes anonymous {
${t}
}`;
}, vt = (i) => {
  const t = typeof i == "string" ? k(bt(i)) : i, e = yt(t), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = dt(n);
    for (const o of gt(n)) {
      const l = s.get(o);
      s.set(o, { ...l ?? {}, ...a }), n.timingFunction != null && r.set(o, n.timingFunction);
    }
  }
  return {
    keyframes: s,
    timingFunctions: r,
    properties: W(t),
    options: tt(t)
  };
}, Qt = [
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse"
], Zt = ["none", "forwards", "backwards", "both"], wt = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: z,
  useWAAPI: !0,
  colorSpace: "oklab"
}, Ft = {
  zIndex: 0,
  weight: 1,
  blendMode: "replace",
  enabled: !0
}, S = (i) => typeof i != "object" || i == null ? !1 : "value" in i && typeof i.value == "number";
class Vt {
  animations = {};
  transform;
  superKey;
  paused = !1;
  started = !1;
  done = !1;
  singleTarget = !0;
  lastTickTime = 0;
  handleId = void 0;
  resolvePromise = null;
  /**
   * Pre-bound draw callback — allocated once in constructor to avoid
   * creating a new closure on every requestAnimationFrame reschedule.
   */
  _boundDraw;
  /**
   * Cached entries array, sorted by layer zIndex. Rebuilt on demand
   * via dirty flag to avoid Object.values() allocation on every frame.
   */
  _entries = [];
  _entriesDirty = !0;
  constructor(...t) {
    this._boundDraw = this.draw.bind(this);
    const e = [];
    for (const s of t) {
      let r, n;
      s instanceof J ? r = s : (r = s.animation, n = s.layer), this.transform == null && r.frames[0] != null && (this.transform = r.frames[0].transform);
      const a = O(r);
      this.animations[a] = {
        values: {},
        animation: r,
        layer: { ...Ft, ...n }
      }, r.managed = !0, e.push(r);
    }
    this.singleTarget = e.every(
      (s) => s.targets[0] === e[0]?.targets[0]
    ), this.invalidateEntries();
  }
  // ── Entry cache ──────────────────────────────────────────────────
  /**
   * Returns the animation entries sorted by layer zIndex.
   * Uses dirty-flag caching — only rebuilds when the animations object
   * or layer configs are mutated. All hot-path iteration (tick, draw,
   * transformFramesGrouped) uses this instead of Object.values().
   */
  getEntries() {
    return this._entriesDirty && (this._entries = Object.values(this.animations), this._entries.sort((t, e) => t.layer.zIndex - e.layer.zIndex), this._entriesDirty = !1), this._entries;
  }
  /** Mark entries cache stale. Called at all mutation boundaries. */
  invalidateEntries() {
    this._entriesDirty = !0;
  }
  // ── Setup ────────────────────────────────────────────────────────
  setSuperKey(t) {
    this.superKey = t;
    for (const e of this.getEntries())
      e.animation.superKey = t;
    return this;
  }
  setTargets(...t) {
    const e = this.getEntries();
    for (const s of e)
      s.animation.setTargets(...t);
    return this.singleTarget = e.every(
      (s) => s.animation.targets[0] === e[0]?.animation.targets[0]
    ), this;
  }
  // ── Lifecycle hooks ──────────────────────────────────────────────
  onStart() {
    return this.started = !0, this;
  }
  onEnd() {
    return this;
  }
  // ── Frame rendering ──────────────────────────────────────────────
  /**
   * Composite all animation values into a single grouped transform.
   * Called per-frame for single-target groups. Applies layer blending
   * (replace / add / weighted) in zIndex order, then calls the group
   * transform function with the merged values.
   */
  transformFramesGrouped(t) {
    const e = {}, s = this.getEntries();
    let r = !0;
    for (const n of s) {
      const { animation: a, values: o, layer: l } = n;
      if (r = r && a.done, !l.enabled) continue;
      if (!(a.done || a.paused)) {
        const h = a.interpFrames(a.t, !1);
        Object.assign(o, h);
      }
      const u = l.properties ? Object.fromEntries(
        Object.entries(o).filter(
          ([h]) => l.properties.has(h)
        )
      ) : o;
      switch (l.blendMode) {
        case "replace":
          Object.assign(e, u);
          break;
        case "add":
          for (const [h, c] of Object.entries(u))
            if (h in e) {
              const f = e[h], p = c;
              S(f) && S(p) ? f.value = f.value + p.value : e[h] = c;
            } else
              e[h] = c;
          break;
        case "weighted":
          for (const [h, c] of Object.entries(u))
            if (h in e) {
              const f = e[h], p = c;
              S(f) && S(p) ? f.value = B(
                l.weight,
                f.value,
                p.value
              ) : e[h] = c;
            } else
              e[h] = c;
          break;
      }
    }
    return this.done = r, this.transform(e, t), e;
  }
  /**
   * Render the current animation state as a static frame.
   * Called on pause to ensure the visual matches the exact pause moment.
   * Handles both single-target (grouped blending) and multi-target
   * (per-child interpFrames) paths.
   */
  renderPauseFrame() {
    const t = this.getEntries(), e = this.lastTickTime || performance.now();
    for (const s of t) {
      const r = s.animation.interpFrames(s.animation.t, !1);
      this.singleTarget && Object.assign(s.values, r);
    }
    if (this.singleTarget)
      this.transformFramesGrouped(e);
    else
      for (const s of t)
        s.animation.interpFrames(s.animation.t, !0);
  }
  // ── Playback loop ────────────────────────────────────────────────
  /**
   * Advance all child animations to timestamp `t`.
   * Awaits all child tick() promises so deferred state updates
   * (startTime, this.t) resolve before interpFrames reads them.
   */
  async tick(t) {
    this.lastTickTime = t, this.started || this.onStart();
    const e = [];
    for (const s of this.getEntries()) {
      const r = s.animation;
      (!r.paused || r.pausedTime === 0) && e.push(r.tick(t));
    }
    return await Promise.all(e), this.done && this.onEnd(), this;
  }
  /**
   * Main animation frame callback. Ticks all children, then renders
   * (single-target: grouped blending; multi-target: per-child).
   * Reschedules itself via rAF until done.
   */
  async draw(t) {
    if (await this.tick(t), !this.paused) {
      if (this.singleTarget)
        this.transformFramesGrouped(t);
      else {
        let e = !0;
        for (const s of this.getEntries())
          s.animation.interpFrames(s.animation.t, !0), e = e && s.animation.done;
        this.done = e;
      }
      this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = g(this._boundDraw);
    }
  }
  /**
   * Start the animation group. Returns a promise that resolves
   * when all child animations complete (or on explicit stop/reset).
   */
  async play() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = g(this._boundDraw);
    });
  }
  /**
   * Toggle pause state. Calling pause() when playing pauses; calling
   * pause() when paused resumes. (Toggle semantics preserved for
   * backward compatibility with demo's toggleAnimationGroup.)
   *
   * On pause: explicitly cancels the rAF loop and renders a final
   * frame snapshot so the visual matches the exact pause moment.
   * On resume: re-registers the rAF loop.
   */
  pause() {
    if (!this.started) return this;
    this.paused = !this.paused;
    const t = this.lastTickTime || performance.now();
    for (const e of this.getEntries()) {
      const s = e.animation;
      this.paused ? (s.pause(!1), s.pausedTime === 0 && (s.pausedTime = t)) : s.paused = !1;
    }
    return this.paused ? (T(this.handleId), this.handleId = void 0, this.renderPauseFrame()) : this.handleId = g(this._boundDraw), this;
  }
  reset() {
    for (const t of this.getEntries()) {
      const e = t.animation;
      e.started && e.frames.length > 0 && e.interpFrames(0, !0), e.managed = !1, e.reset();
    }
    return this.started = !1, this.done = !1, this.paused = !1, this.lastTickTime = 0, this;
  }
  stop() {
    return T(this.handleId), this.handleId = void 0, this.reset(), this;
  }
  playing() {
    return !(!this.started || this.paused);
  }
  forcePause() {
    this.paused = !0;
    for (const t of this.getEntries())
      t.animation.paused = !0;
  }
  forcePlay() {
    this.paused = !1;
    for (const t of this.getEntries())
      t.animation.paused = !1;
  }
  // ── Layer management API ─────────────────────────────────────────
  /**
   * Set layer config for an animation by name or reference.
   * Chainable. Throws when the key doesn't match a registered
   * animation — silent no-ops were hiding consumer bugs.
   */
  setLayerConfig(t, e) {
    const s = typeof t == "string" ? t : O(t), r = this.animations[s];
    if (!r)
      throw new Error(
        `AnimationGroup.setLayerConfig: no animation registered for key "${s}". Known keys: ${Object.keys(this.animations).join(", ") || "(none)"}.`
      );
    return Object.assign(r.layer, e), this.invalidateEntries(), this;
  }
  /** Convenience toggle for enabling/disabling a layer. Chainable. */
  setLayerEnabled(t, e) {
    return this.setLayerConfig(t, { enabled: e });
  }
  /** Read the layer config for an animation. */
  getLayerConfig(t) {
    const e = typeof t == "string" ? t : O(t);
    return this.animations[e]?.layer;
  }
}
class St {
  // `requestAnimationFrame` returns `number` in browsers but the
  // shared `requestAnimationFrame` shim falls back to `setTimeout`
  // in non-DOM environments (jsdom/Node) which returns
  // `NodeJS.Timeout`. Either suffices as an opaque cancel handle.
  _rafId = null;
  _startTime = void 0;
  _resolve = null;
  /**
   * Drive `onTick(progress)` once per frame for `duration` ms.
   * `progress` is clamped to [0, 1]; the loop terminates after the
   * frame at `progress === 1`. The returned promise resolves when
   * the animation completes naturally or is interrupted by `stop()`.
   */
  play(t, e) {
    if (t <= 0)
      throw new Error(
        "RAFPlayback.play() requires a duration > 0."
      );
    return this.stop(), new Promise((s) => {
      this._resolve = s, this._startTime = void 0;
      const r = (n) => {
        this._startTime === void 0 && (this._startTime = n);
        const a = V((n - this._startTime) / t, 0, 1);
        e(a), a < 1 ? this._rafId = g(r) : this._cleanup();
      };
      this._rafId = g(r);
    });
  }
  /** Cancel a running playback. The play promise resolves immediately. */
  stop() {
    this._rafId !== null && T(this._rafId), this._cleanup();
  }
  _cleanup() {
    this._rafId = null, this._startTime = void 0;
    const t = this._resolve;
    this._resolve = null, t?.();
  }
}
const R = {
  Value: I.Value,
  Values: I.Values,
  FunctionArgs: j.FunctionArgs,
  Function: j.Function
}, Tt = (i) => {
  const t = {};
  for (const e of i.declarations) {
    const s = e.name.startsWith("--") ? e.name : M(e.name);
    t[s] = e.value;
  }
  return i.timingFunction != null && (t.animationTimingFunction = i.timingFunction), t;
}, _ = (i) => {
  const t = /* @__PURE__ */ new Map();
  for (const e of i) {
    const s = Tt(e);
    for (const r of e.selectors) {
      const n = r.kind === "percent" ? `${r.value}%` : r.name, a = t.get(n);
      t.set(n, { ...a ?? {}, ...s });
    }
  }
  return t;
}, C = (i) => {
  const t = i.trim();
  return /@keyframes\b/i.test(t) || t.length === 0 ? i : `@keyframes anonymous {
${t}
}`;
}, It = (i) => {
  const t = k(C(i));
  for (const e of P(t).values())
    if (e.length > 0) return e;
  return [];
};
A(
  (i) => _(It(i))
);
const Et = (i) => {
  const t = {};
  for (const e of i) {
    if (!e.name.startsWith("animation")) continue;
    const s = M(e.name).replace(/^animation/, "").replace(/^./, (r) => r.toLowerCase());
    t[s] = e.value.toString();
  }
  return t;
}, kt = (i) => {
  const t = {};
  for (const e of i) {
    if (e.name.startsWith("animation")) continue;
    const s = e.name.startsWith("--") ? e.name : M(e.name);
    t[s] = e.value;
  }
  return t;
};
A(
  (i) => {
    const t = k(C(i)), e = _(
      (() => {
        for (const l of P(t).values())
          if (l.length > 0) return l;
        return [];
      })()
    ), s = et(t);
    if (s.length === 0)
      return { keyframes: e };
    const r = s[0], n = { keyframes: e }, a = Et(r.declarations), o = kt(r.declarations);
    return Object.keys(a).length > 0 && (n.options = a), Object.keys(o).length > 0 && (n.values = o), n;
  }
);
A(
  (i) => {
    const t = k(C(i));
    return {
      properties: W(t),
      keyframes: _(
        (() => {
          for (const e of P(t).values())
            if (e.length > 0) return e;
          return [];
        })()
      )
    };
  }
);
A(
  (i) => st(i)
);
I.Value, I.Values;
const w = (i) => {
  if (i instanceof y)
    return [i.clone()];
  if (i instanceof H)
    return i.values.flatMap((t) => w(t));
  if (i instanceof v)
    return i.flatMap((t) => w(t));
  throw new TypeError(
    `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof i}`
  );
}, Pt = (i) => {
  const t = i.split(".").pop(), e = i.split(".").shift();
  if (!t || !e)
    throw new Error(`Invalid flattened key: ${i}`);
  return { mainKey: e, childKey: t };
}, F = (i, t, e) => (i.setProperty(t), e !== t && i.setSubProperty(e), i), At = /^\s*cubic-bezier\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)\s*$/i, E = (i) => {
  if (i == null)
    return;
  if (typeof i != "string")
    return i;
  const t = i.match(At);
  if (t) {
    const s = t.slice(1, 5).map(
      (r) => Number.parseFloat(r ?? "")
    );
    if (s.length === 4 && s.every((r) => Number.isFinite(r))) {
      const [r, n, a, o] = s;
      return it(r, n, a, o);
    }
  }
  const e = N[i];
  if (typeof e == "function" && e.length <= 1)
    return e;
}, K = /* @__PURE__ */ new Map();
function Ot(i) {
  const t = Y(i), e = (r, n) => {
    const { childKey: a, mainKey: o } = Pt(r);
    if (n instanceof y)
      return F(
        new v(...w(n)),
        o,
        a
      );
    if (n instanceof H) {
      const m = n.values.flatMap(
        (d) => w(e(r, d))
      );
      return F(
        new v(...m),
        o,
        a
      );
    } else if (n instanceof v) {
      const m = n.flatMap(
        (d) => w(e(r, d))
      );
      return F(
        new v(...m),
        o,
        a
      );
    }
    const l = String(n), u = `${a}:${l}`, h = K.get(u);
    if (h)
      return F(h.clone(), o, a);
    const c = R.FunctionArgs.map(
      (m) => (m.setSubProperty(a), m)
    ), f = at(
      mt(c, R.Value),
      l
    ), p = F(
      new v(...w(f)),
      o,
      a
    );
    return K.set(u, p.clone()), p;
  };
  return Object.entries(t).reduce(
    (r, [n, a]) => (r[n] = e(n, a), r),
    {}
  );
}
const Mt = (i, t, e, s, r = "oklab", n) => {
  const a = s[t], o = s[e];
  if (!a || !o)
    throw new Error(
      `Invalid interpolation frame bounds (${t} -> ${e}).`
    );
  const l = a[i], u = o[i];
  if (!l || !u)
    throw new Error(`Missing variable "${i}" in interpolation bounds.`);
  const h = Math.max(l.length, u.length), c = (m) => {
    const d = m.map((b) => {
      if (!(b instanceof y))
        throw new TypeError(
          `Interpolation for "${i}" requires ValueUnit leaves.`
        );
      return b;
    });
    for (; d.length < h; )
      d.push(new y(0));
    return d;
  }, f = c(l), p = c(u);
  return f.map((m, d) => {
    const b = p[d];
    if (!b)
      throw new Error(
        `Missing right-hand interpolation value at index ${d}.`
      );
    if (!(m instanceof y) || !(b instanceof y))
      throw new TypeError(
        `Interpolation for "${i}" requires ValueUnit leaves.`
      );
    const x = { colorSpace: r };
    return n !== void 0 && (x.hueMethod = n), rt(nt(m, b, x));
  });
};
function _t(i, t, e) {
  const [s, r] = [i.start, t.start];
  return {
    start: s.value * e / 100,
    stop: r.value * e / 100
  };
}
function Q(i, t, e = !0) {
  i = e ? i : Y(i);
  const s = q(i);
  t.forEach((r) => {
    Object.entries(s).forEach(([n, a]) => {
      r.style.setProperty(n, a);
    });
  });
}
Q[/* @__PURE__ */ Symbol.for("keyframes.defaultRenderer")] = !0;
const Ct = (i) => i;
class xt {
  keyframes;
  segments;
  positions;
  timingFn;
  result;
  _duration;
  // Shared rAF lifecycle for `.play()` / `.stop()`.
  _playback = new St();
  constructor(t, e) {
    if (t.length < 2)
      throw new Error(
        "NumericAnimation requires at least 2 keyframes."
      );
    if (this.keyframes = t.map((s) => ({ ...s })), this._duration = e?.duration ?? 0, this.timingFn = (e?.timingFunction ? E(e.timingFunction) : void 0) ?? Ct, e?.positions) {
      if (e.positions.length !== t.length)
        throw new Error(
          "positions length must match keyframes length."
        );
      this.positions = e.positions;
    } else
      this.positions = t.map(
        (s, r) => r / (t.length - 1) * 100
      );
    this.result = { ...t[0] }, this.segments = this.buildSegments();
  }
  buildSegments() {
    const t = [];
    for (let e = 0; e < this.keyframes.length - 1; e++)
      t.push(this.buildSegment(e));
    return t;
  }
  buildSegment(t) {
    const e = this.keyframes[t], s = this.keyframes[t + 1], r = Object.keys(e);
    return {
      startPos: this.positions[t],
      stopPos: this.positions[t + 1],
      keys: r,
      startVals: r.map((n) => e[n]),
      stopVals: r.map((n) => s[n]),
      timingFunction: this.timingFn
    };
  }
  /**
   * Map [0, 1] progress to interpolated values. Zero allocation —
   * returns the same pre-allocated result object on every call.
   *
   * Uses O(log N) binary search over segments. Falls back to the
   * last segment if progress is past the final stop position.
   */
  at(t) {
    const e = V(t, 0, 1) * 100;
    let s = X(
      this.segments,
      e,
      (o) => o.startPos,
      (o) => o.stopPos
    );
    s === -1 && (s = this.segments.length - 1);
    const r = this.segments[s], n = G(
      V(e, r.startPos, r.stopPos),
      r.startPos,
      r.stopPos,
      0,
      1
    ), a = r.timingFunction(n);
    for (let o = 0; o < r.keys.length; o++)
      this.result[r.keys[o]] = B(
        a,
        r.startVals[o],
        r.stopVals[o]
      );
    return this.result;
  }
  /** Update a keyframe's values in-place, recomputing adjacent segments. */
  updateKeyframe(t, e) {
    if (t < 0 || t >= this.keyframes.length)
      throw new RangeError(
        `Keyframe index ${t} out of range [0, ${this.keyframes.length - 1}].`
      );
    return Object.assign(this.keyframes[t], e), t > 0 && (this.segments[t - 1] = this.buildSegment(t - 1)), t < this.keyframes.length - 1 && (this.segments[t] = this.buildSegment(t)), this;
  }
  // ── Playback ─────────────────────────────────────────────────────
  /**
   * Play the animation over its duration using requestAnimationFrame.
   *
   * Calls `onFrame` each frame with the interpolated values (the same
   * zero-allocation object returned by `.at()`). Returns a Promise that
   * resolves when the animation completes or is stopped.
   *
   * @param onFrame — optional per-frame callback receiving interpolated values
   * @param duration — override the duration set in constructor options (ms)
   */
  play(t, e) {
    const s = e ?? this._duration;
    return this._playback.play(s, (r) => {
      const n = this.at(r);
      t?.(n);
    });
  }
  /** Cancel a running `.play()` animation. The play promise resolves immediately. */
  stop() {
    this._playback.stop();
  }
}
const jt = {
  damping: 0.1,
  snapThreshold: 1e-3,
  targetEpsilon: 0,
  initial: 0,
  clamp: !0
};
class Dt {
  options;
  targetValue;
  currentValue;
  isSettled;
  constructor(t) {
    this.options = { ...jt, ...t }, this.targetValue = this.options.initial, this.currentValue = this.options.initial, this.isSettled = !0;
  }
  get target() {
    return this.targetValue;
  }
  get current() {
    return this.currentValue;
  }
  get settled() {
    return this.isSettled;
  }
  setTarget(t) {
    this.options.clamp && (t = Math.max(0, Math.min(1, t)));
    const e = Math.abs(t - this.targetValue);
    e > 0 && e >= this.options.targetEpsilon && (this.targetValue = t, this.isSettled = !1);
  }
  /** Advance one step using fixed damping. Returns current value. */
  tick() {
    return this.isSettled ? this.currentValue : (this.currentValue += (this.targetValue - this.currentValue) * this.options.damping, Math.abs(this.targetValue - this.currentValue) < this.options.snapThreshold && (this.currentValue = this.targetValue, this.isSettled = !0), this.options.clamp && (this.currentValue = Math.max(
      0,
      Math.min(1, this.currentValue)
    )), this.currentValue);
  }
  /** Frame-rate independent tick. dt is in milliseconds. */
  tickDt(t) {
    if (this.isSettled) return this.currentValue;
    const e = 1 - Math.exp(-this.options.damping * t / 16.667);
    return this.currentValue += (this.targetValue - this.currentValue) * e, Math.abs(this.targetValue - this.currentValue) < this.options.snapThreshold && (this.currentValue = this.targetValue, this.isSettled = !0), this.options.clamp && (this.currentValue = Math.max(
      0,
      Math.min(1, this.currentValue)
    )), this.currentValue;
  }
  /** Immediately set current = target. */
  snap() {
    this.currentValue = this.targetValue, this.isSettled = !0;
  }
  /** Reset to a specific value (default 0). */
  reset(t) {
    const e = t ?? 0;
    this.targetValue = e, this.currentValue = e, this.isSettled = !0;
  }
}
const L = (i) => {
  if (i instanceof HTMLElement) {
    const t = i.getBoundingClientRect();
    return { x: t.x, y: t.y, width: t.width, height: t.height };
  }
  return i;
};
class Jt {
  animation;
  transformOrigin;
  timingFunction;
  duration;
  constructor(t, e, s) {
    this.transformOrigin = s?.transformOrigin ?? "top left", this.timingFunction = s?.timingFunction, this.duration = s?.duration ?? 0, this.measure(t, e);
  }
  /** Re-measure source and destination, rebuilding the internal animation. */
  measure(t, e) {
    const s = L(t), r = L(e), n = r.x - s.x, a = r.y - s.y, o = s.width === 0 ? 1 : r.width / s.width, l = s.height === 0 ? 1 : r.height / s.height;
    return this.animation = new xt(
      [
        { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
        { translateX: n, translateY: a, scaleX: o, scaleY: l }
      ],
      { timingFunction: this.timingFunction, duration: this.duration }
    ), this;
  }
  /** Get raw transform values at the given progress [0, 1]. */
  at(t) {
    return this.animation.at(t);
  }
  /** Get a CSS transform string at the given progress [0, 1]. */
  toCSSTransform(t) {
    const { translateX: e, translateY: s, scaleX: r, scaleY: n } = this.animation.at(t);
    return `translate(${e}px, ${s}px) scale(${r}, ${n})`;
  }
  /** Apply the morph transform to an element at the given progress [0, 1]. */
  apply(t, e) {
    t.style.transform = this.toCSSTransform(e), t.style.transformOrigin = this.transformOrigin;
  }
  /**
   * Animate an element from source to destination over the configured duration.
   *
   * @param element — the element to apply transforms to
   * @param duration — override the duration set in constructor options (ms)
   */
  play(t, e) {
    return this.animation.play((s) => {
      const { translateX: r, translateY: n, scaleX: a, scaleY: o } = s;
      t.style.transform = `translate(${r}px, ${n}px) scale(${a}, ${o})`, t.style.transformOrigin = this.transformOrigin;
    }, e ?? this.duration);
  }
  /** Cancel a running `.play()` animation. */
  stop() {
    this.animation.stop();
  }
}
const $t = (i) => {
  if (i == null) return null;
  if (typeof i == "function") return i;
  const t = N[i];
  return typeof t == "function" && t.length <= 1 ? t : null;
}, Rt = (i) => Math.max(0, Math.min(1, i));
class Z {
  smoother;
  easingFn;
  currentProgress = 0;
  boundaryEpsilon;
  constructor(t) {
    this.easingFn = $t(t?.easing), this.boundaryEpsilon = t?.boundaryEpsilon ?? 5e-3, t?.smoothing === !1 ? this.smoother = null : this.smoother = new Dt(
      t?.smoothing
    );
  }
  /**
   * Shared progress pipeline: sample → clamp → easing → boundary snap.
   * Returns the processed raw value. Does NOT advance the smoother —
   * the caller (tick or tickDt) drives the smoother with the appropriate
   * time-step method.
   */
  applyPipeline() {
    let t = Rt(this.sample());
    this.easingFn && (t = this.easingFn(t));
    const e = this.boundaryEpsilon;
    return t <= e ? t = 0 : t >= 1 - e && (t = 1), t;
  }
  /**
   * Finalize progress after the smoother has been advanced (or bypassed).
   * Snaps the smoother at boundaries [0, 1] for instant convergence.
   */
  finalizeProgress(t) {
    return this.smoother && (this.smoother.setTarget(t), (t <= 0 || t >= 1) && this.smoother.snap()), this.currentProgress = this.smoother ? this.smoother.current : t, this.currentProgress;
  }
  /**
   * Shared advance step. When `dt` is undefined, drives the
   * smoother in frame-rate-dependent mode (`tick()`); when given,
   * uses the frame-rate-independent variant (`tickDt(dt)`).
   */
  _advance(t) {
    const e = this.applyPipeline();
    return this.smoother && e > 0 && e < 1 ? (this.smoother.setTarget(e), t === void 0 ? this.smoother.tick() : this.smoother.tickDt(t), this.currentProgress = this.smoother.current) : this.finalizeProgress(e), this.currentProgress;
  }
  /** Advance one frame. Applies easing → boundary snap → smoothing. */
  tick() {
    return this._advance();
  }
  /** Frame-rate independent variant. `dt` in milliseconds. */
  tickDt(t) {
    return this._advance(t);
  }
  get progress() {
    return this.currentProgress;
  }
  /** True if no smoother or smoother is settled. */
  get settled() {
    return this.smoother == null || this.smoother.settled;
  }
  /** Immediately converge smoother to current target. */
  snap() {
    this.smoother?.snap(), this.smoother && (this.currentProgress = this.smoother.current);
  }
  /** Reset progress to a specific value (default 0). */
  reset(t) {
    const e = t ?? 0;
    this.smoother && this.smoother.reset(e), this.currentProgress = e;
  }
}
class te extends Z {
  threshold;
  getScrollY;
  getViewportHeight;
  constructor(t) {
    super(t), this.threshold = t?.threshold ?? 0.35, this.getScrollY = t?.getScrollY ?? (() => window.scrollY), this.getViewportHeight = t?.getViewportHeight ?? (() => window.innerHeight);
  }
  sample() {
    const t = this.getViewportHeight() * this.threshold;
    return t <= 0 ? 0 : this.getScrollY() / t;
  }
}
class ee extends Z {
  value = 0;
  constructor(t) {
    super({ smoothing: !1, ...t });
  }
  /** Set the raw progress value. */
  set(t) {
    this.value = t;
  }
  sample() {
    return this.value;
  }
}
const U = (i) => typeof i == "string" && ot.includes(i), Kt = /* @__PURE__ */ Symbol.for("keyframes.defaultRenderer"), Lt = (i) => typeof i == "function" && i[Kt] === !0;
function Ut(i) {
  if (!i.targets || i.targets.length === 0)
    return { eligible: !1, reason: "no DOM targets" };
  if (typeof i.targets[0]?.animate != "function")
    return {
      eligible: !1,
      reason: "target does not implement Element.animate()"
    };
  for (const t of i.frames)
    if (!Lt(t.transform))
      return {
        eligible: !1,
        reason: "custom transform function (not the default DOM renderer)"
      };
  if (i.frames.length > 1) {
    const t = i.frames[0].timingFunction;
    for (let e = 1; e < i.frames.length; e++)
      if (i.frames[e].timingFunction !== t)
        return {
          eligible: !1,
          reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)"
        };
  }
  for (const t of i.frames)
    for (const e of Object.values(t.interpVars))
      for (const s of e) {
        if (U(s.start?.unit) || U(s.stop?.unit))
          return {
            eligible: !1,
            reason: `computed unit (${String(s.start?.unit ?? s.stop?.unit)}) requires DOM resolution`
          };
        if (s.start?.unit === "color" || s.stop?.unit === "color")
          return {
            eligible: !1,
            reason: "color interpolation requires perceptual lerp"
          };
      }
  return { eligible: !0 };
}
function Wt(i) {
  const t = i.options.duration, e = [], s = /* @__PURE__ */ new Set();
  for (const n of i.frames)
    s.add(n.time.start), s.add(n.time.stop);
  const r = [...s].sort((n, a) => n - a);
  for (const n of r) {
    const a = i.interpFrames(n, !1);
    if (Object.keys(a).length === 0) continue;
    const o = q(a);
    e.push({
      offset: Math.max(0, Math.min(1, n / t)),
      ...o
    });
  }
  return e;
}
const zt = {
  normal: "normal",
  reverse: "reverse",
  alternate: "alternate",
  "alternate-reverse": "alternate-reverse"
}, Bt = {
  none: "none",
  forwards: "forwards",
  backwards: "backwards",
  both: "both"
};
function Nt(i) {
  const t = i.options, e = zt[t.direction], s = Bt[t.fillMode];
  if (e == null)
    throw new TypeError(
      `Unrecognised animation direction "${t.direction}".`
    );
  if (s == null)
    throw new TypeError(
      `Unrecognised animation fill mode "${t.fillMode}".`
    );
  return {
    duration: t.duration,
    delay: t.delay,
    iterations: t.iterationCount === 1 / 0 ? 1 / 0 : t.iterationCount,
    direction: e,
    fill: s,
    // WAAPI easing is per-animation; per-frame easing is baked
    // into the keyframe values upstream when JS interpolation
    // is in play. For WAAPI delegation we always emit `linear`
    // and let the keyframe stops carry any easing intent.
    easing: "linear"
  };
}
async function Yt(i) {
  const t = Wt(i), e = Nt(i), s = i.targets.map(
    (a) => a.animate(t, e)
  );
  let r = !1;
  const n = (a) => {
    if (!(r || i.done)) {
      if (i.tick(a), i.paused)
        for (const o of s) o.pause();
      else
        for (const o of s)
          o.playState === "paused" && o.play();
      i.handleId = requestAnimationFrame(n);
    }
  };
  i.handleId = requestAnimationFrame(n);
  try {
    await Promise.all(s.map((a) => a.finished));
  } finally {
    r = !0;
  }
}
const qt = (i) => typeof i != "object" || i == null ? !1 : typeof i.clone == "function", O = (i) => typeof i == "string" ? i : i.name ?? String(i.id);
let Ht = 0;
class J {
  id = Ht++;
  name;
  superKey;
  targets;
  options;
  templateFrames = [];
  parsedVars = [];
  frameId = 0;
  frames = [];
  handleId = void 0;
  startTime = void 0;
  pausedTime = 0;
  t = 0;
  iteration = 0;
  started = !1;
  done = !1;
  reversed = !1;
  paused = !1;
  /**
   * True when an `AnimationGroup` is driving this animation's
   * `tick()` and `interpFrames()` from its own rAF loop. Set by
   * the group at construction; standalone `.play()` / `.draw()`
   * throw when this is true rather than racing the group.
   */
  managed = !1;
  /**
   * If the most recent `play()` was rejected by WAAPI eligibility
   * but `useWAAPI: true` was requested, this records the reason.
   * Queryable by debug builds — no console output is produced.
   */
  waapiIneligibleReason = void 0;
  unflatten = !0;
  resolvePromise = null;
  _playingPromise = null;
  /**
   * Pre-bound draw callback — allocated once to avoid creating a new
   * closure on every requestAnimationFrame reschedule.
   */
  _boundDraw = this.draw.bind(this);
  dispatchAnimationEvent(t) {
    if (!(typeof AnimationEvent > "u"))
      for (const e of this.targets)
        typeof e?.dispatchEvent == "function" && e.dispatchEvent(
          new AnimationEvent(t, {
            animationName: this.name ?? "",
            elapsedTime: this.t / 1e3
          })
        );
  }
  constructor(t, e, s, r) {
    this.options = {}, this.setOptions({ ...wt, ...t ?? {} }), this.targets = e == null ? [] : Array.isArray(e) ? e : [e], this.name = s, this.superKey = r;
  }
  convertFrameStart(t) {
    if (t.start.unit === "s" || t.start.unit === "ms" || !t.start.unit) {
      const e = t.start.unit === "s" ? "s" : "ms", s = lt(t.start.value, e);
      t.start.value = s / this.options.duration * 100, t.start.unit = "%";
    }
    return t.start.value = V(t.start.value, 0, 100), t;
  }
  addFrame(t, e, s, r) {
    typeof t == "number" ? t = String(t) + "%" : typeof t == "string" ? t = t : t instanceof y && (t = String(t));
    const n = ht(t);
    let a = {
      id: this.frameId,
      start: n,
      vars: e,
      transform: s,
      timingFunction: E(r) ?? this.options.timingFunction
    };
    return this.convertFrameStart(
      a
    ), this.templateFrames.push(
      a
    ), this.frameId += 1, this;
  }
  createFrame(t, e) {
    const s = this.templateFrames[t], r = this.templateFrames[e], n = {
      start: t,
      stop: e
    }, a = _t(s, r, this.options.duration);
    let o = s.transform;
    if (o == null) {
      const h = D(
        t,
        this.frames,
        (c) => c.transform != null
      );
      o = this.frames[h].transform;
    }
    let l = s.timingFunction;
    if (l == null) {
      const h = D(
        t,
        this.frames,
        (c) => c.timingFunction != null
      );
      l = this.frames[h].timingFunction;
    }
    return {
      id: this.frameId++,
      ixs: n,
      start: s.start,
      time: a,
      vars: void 0,
      flatVars: void 0,
      interpVars: {},
      allInterpVars: [],
      transform: o,
      timingFunction: l
    };
  }
  /**
   * Build an index mapping each variable name to the frame indices where
   * it appears. Used by reconcileVars() for O(1) "next occurrence" lookups
   * instead of O(N) findIndex scans per variable.
   */
  buildVarIndex() {
    const t = /* @__PURE__ */ new Map();
    for (let e = 0; e < this.parsedVars.length; e++)
      for (const s of Object.keys(this.parsedVars[e])) {
        let r = t.get(s);
        r || (r = [], t.set(s, r)), r.push(e);
      }
    return t;
  }
  /**
   * Reconcile interpolation variables across non-adjacent keyframes.
   * For each variable at frame `ix`, find the next frame that also
   * defines that variable and create an interpolation segment between them.
   *
   * Uses a pre-built variable index (from buildVarIndex) to avoid
   * O(frames²) findIndex scans.
   */
  reconcileVars(t, e) {
    const s = this.parsedVars[t];
    if (s)
      for (const r of Object.keys(s)) {
        const n = e.get(r);
        if (!n) continue;
        let a = -1;
        for (const c of n)
          if (c > t) {
            a = c;
            break;
          }
        if (a === -1) continue;
        const [o, l] = [t, a], u = this.frames.findIndex(
          (c) => c.ixs.start === o && c.ixs.stop === l
        ), h = u !== -1 ? this.frames[u] : this.createFrame(o, l);
        h.interpVars[r] = Mt(
          r,
          o,
          l,
          this.parsedVars,
          this.options.colorSpace,
          this.options.hueMethod
        ), u === -1 && this.frames.push(h);
      }
  }
  parse() {
    this.frames = [], this.templateFrames.sort((e, s) => e.start.value - s.start.value), this.parsedVars = this.templateFrames.map((e) => {
      const s = Ot(
        e.vars
      );
      return Object.values(s).forEach((r) => {
        r.setTargets(this.targets);
      }), s;
    });
    for (let e = 0; e < this.templateFrames.length - 1; e++)
      this.frames.push(this.createFrame(e, e + 1));
    const t = this.buildVarIndex();
    return this.frames.forEach((e, s) => this.reconcileVars(s, t)), this.frames.sort((e, s) => e.time.start === s.time.start ? e.time.stop - s.time.stop : e.time.start - s.time.start), this.frames = this.frames.filter(
      (e) => e.interpVars != null && Object.keys(e.interpVars).length > 0
    ), this.frames.forEach((e) => {
      const s = Object.entries(e.interpVars).reduce((r, [n, a]) => (r[n] = a.map((o) => o.value), r), {});
      e.flatVars = s, e.vars = ut(e.flatVars), e.allInterpVars = Object.values(e.interpVars).flat();
    }), this;
  }
  setTimingFunction(t) {
    return this.options.timingFunction = E(t) ?? z, this;
  }
  setIterationCount(t) {
    if (!t || t === "infinite" || t === "∞" || t === "Infinity")
      this.options.iterationCount = 1 / 0;
    else if (typeof t == "string") {
      const e = parseFloat(t.trim());
      if (isNaN(e) || e < 0) return this;
      this.options.iterationCount = e;
    } else {
      if (isNaN(t) || t < 0) return this;
      this.options.iterationCount = t;
    }
    return this;
  }
  setDuration(t) {
    typeof t == "string" && (t = $(t));
    const e = t ?? this.options.duration;
    if (!isFinite(e) || e <= 0) return this;
    const s = this.options.duration, r = e / s;
    for (let n = 0; n < this.frames.length; n++) {
      const a = this.frames[n];
      a.time.start *= r, a.time.stop *= r;
    }
    return this.options.duration = e, this;
  }
  setDelay(t) {
    return typeof t == "string" && (t = $(t)), this.options.delay = t ?? 0, this;
  }
  setDirection(t) {
    return this.options.direction = t ?? "normal", this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" && this.iteration % 2 === 0 || this.options.direction === "alternate" && this.iteration % 2 === 1) && (this.reversed = !0), this;
  }
  setFillMode(t) {
    return this.options.fillMode = t ?? "forwards", this;
  }
  setUseWAAPI(t) {
    return this.options.useWAAPI = t ?? !0, this;
  }
  setColorSpace(t) {
    return this.options.colorSpace = t ?? "oklab", this;
  }
  setHueMethod(t) {
    return t !== void 0 && (this.options.hueMethod = t), this;
  }
  setOptions(t) {
    return this.setTimingFunction(t.timingFunction), this.setDuration(t.duration), this.setIterationCount(t.iterationCount), this.setDelay(t.delay), this.setDirection(t.direction), this.setFillMode(t.fillMode), this.setUseWAAPI(t.useWAAPI), this.setColorSpace(t.colorSpace), this.setHueMethod(t.hueMethod), this;
  }
  reverse() {
    if (this.startTime !== void 0) {
      const t = this.t, e = this.options.duration - 2 * t;
      this.startTime -= e;
    }
    return this.reversed = !this.reversed, this;
  }
  fillForwards() {
    this.interpFrames(this.options.duration, !0);
  }
  fillBackwards() {
    this.interpFrames(0, !0);
  }
  /**
   * Stateless progress query. Maps [0,1] from first keyframe to last,
   * regardless of playback direction. `apply=true` invokes transform callbacks.
   */
  at(t, e = !1) {
    const s = this.reversed;
    this.reversed = !1;
    const r = V(t, 0, 1) * this.options.duration, n = this.interpFrames(r, e);
    return this.reversed = s, n;
  }
  /**
   * Interpolate all active frames at time `t`. This is the hot path —
   * called once per rAF frame during playback.
   *
   * Uses binary search (O(log N)) to find the first matching frame,
   * then scans neighbors to collect all overlapping frames at `t`
   * (multiple properties may share the same time range).
   *
   * @param t - Current animation time in milliseconds
   * @param transformFrames - If true, applies each frame's transform function to targets
   * @returns Merged flat vars from all active frames
   */
  interpFrames(t, e = !1) {
    t = this.reversed ? this.options.duration - t : t;
    const s = {}, r = this.frames, n = r.length, a = X(
      r,
      t,
      (l) => l.time.start,
      (l) => l.time.stop
    );
    if (a === -1) return s;
    const o = (l) => {
      const { start: u, stop: h } = l.time, c = G(t, u, h, 0, 1), f = l.timingFunction(c);
      for (const p of l.allInterpVars)
        pt(f, p);
      e && l.transform(
        this.unflatten ? l.vars : l.flatVars,
        t
      ), Object.assign(s, l.flatVars);
    };
    for (let l = a; l >= 0; l--) {
      const u = r[l];
      if (t < u.time.start || t > u.time.stop) break;
      o(u);
    }
    for (let l = a + 1; l < n; l++) {
      const u = r[l];
      if (t < u.time.start || t > u.time.stop) break;
      o(u);
    }
    return s;
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" && this.iteration % 2 === 0 || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.paused = !0, await ct(this.options.delay), this.paused = !1), this.started = !0;
  }
  async onEnd() {
    this.options.fillMode === "forwards" || this.options.fillMode === "both" ? this.fillForwards() : (this.options.fillMode === "none" || this.options.fillMode === "backwards") && this.fillBackwards(), this.startTime = void 0, this.iteration >= this.options.iterationCount - 1 ? (this.done = !0, this.iteration = 0, this.dispatchAnimationEvent("animationend")) : (this.iteration += 1, this.dispatchAnimationEvent("animationiteration"));
  }
  async tick(t) {
    if (this.startTime === void 0 && (await this.onStart(), this.startTime = t + this.options.delay, this.dispatchAnimationEvent("animationstart")), this.paused && this.pausedTime === 0)
      return this.pausedTime = t, this.t;
    if (this.pausedTime > 0 && !this.paused) {
      const e = t - this.pausedTime;
      this.startTime += e, this.pausedTime = 0;
    }
    return this.t = t - this.startTime, this.t >= this.options.duration && (await this.onEnd(), this.t = this.options.duration), this.t;
  }
  async draw(t) {
    if (this.managed)
      throw new Error(
        "Animation.draw() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play()/pause()/stop() instead."
      );
    t = await this.tick(t), !this.paused && (this.interpFrames(t, !0), this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = g(this._boundDraw));
  }
  /** Internal rAF-based play loop. */
  _playRAF() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = g(this._boundDraw);
    });
  }
  /**
   * Play via the Web Animations API. WAAPI handles visuals on the
   * compositor thread; a shadow rAF loop in `playWAAPI` drives
   * `tick()` so events, iteration count, pause/resume, and other
   * lifecycle state stay coherent with the rAF path.
   *
   * No silent fallback — eligibility is decided once in `play()`
   * before this is invoked, and runtime errors propagate.
   */
  async _playWAAPI() {
    await Yt(this), this.reset();
  }
  async play() {
    if (this.managed)
      throw new Error(
        "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead."
      );
    if (this._playingPromise) return this._playingPromise;
    let t;
    if (this.options.useWAAPI) {
      const e = Ut(this);
      e.eligible ? (this.waapiIneligibleReason = void 0, t = this._playWAAPI()) : (this.waapiIneligibleReason = e.reason, t = this._playRAF());
    } else
      this.waapiIneligibleReason = void 0, t = this._playRAF();
    return this._playingPromise = t, t.finally(() => {
      this._playingPromise = null;
    }), t;
  }
  pause(t = !0) {
    return this.paused && t ? this.resume() : (this.started && (this.paused = !0), this);
  }
  resume() {
    return this.started && this.paused && (this.paused = !1, this.handleId = g(this._boundDraw)), this;
  }
  stop() {
    T(this.handleId), this.reset();
  }
  playing() {
    return !(!this.started || this.paused);
  }
  /** Returns the effective time accounting for direction reversal. */
  get effectiveT() {
    return this.reversed ? this.options.duration - this.t : this.t;
  }
  reset() {
    return this.done = !1, this.started = !1, this.paused = !1, this.reversed = !1, this.iteration = 0, this.startTime = void 0, this.pausedTime = 0, this.t = 0, this;
  }
  setTargets(...t) {
    return this.targets = t, this.frames.forEach((e) => {
      Object.values(e.interpVars).forEach((s) => {
        s.forEach(({ start: r, stop: n, value: a }) => {
          r.setTargets(this.targets), n.setTargets(this.targets), a.setTargets(this.targets);
        });
      });
    }), this;
  }
  group(...t) {
    return new Vt(this, ...t);
  }
}
class se extends J {
  constructor(t, ...e) {
    super(t, e), this.unflatten = !1;
  }
  fromVars(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    for (let s = 0; s < t.length; s++) {
      const r = t[s], n = Math.round(s / (t.length - 1) * 100);
      this.addFrame(n, r, e);
    }
    return this.parse(), this;
  }
  fromKeyframes(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this), ft(t) && (t = new Map(Object.entries(t)));
    const s = t instanceof Map ? t.entries() : Object.entries(t);
    for (const [r, n] of s)
      this.addFrame(r, n, e);
    return this.parse(), this;
  }
  /**
   * Property registry from `@property` declarations parsed by
   * `fromString`. Empty when the input had no `@property` rules.
   * Consumers can read this to recover the type metadata for
   * custom properties (syntax string, initial value, inheritance
   * flag) without re-parsing the source CSS.
   */
  propertyRegistry = /* @__PURE__ */ new Map();
  fromString(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    const s = vt(t);
    this.propertyRegistry = s.properties;
    for (const [r, n] of s.keyframes.entries()) {
      const a = Object.fromEntries(
        Object.entries(n).map(([u, h]) => [
          u,
          qt(h) ? h.clone() : h
        ])
      ), o = s.timingFunctions.get(r), l = o ? E(o) : void 0;
      this.addFrame(r, a, e, l);
    }
    return this.parse(), this;
  }
  transform(t) {
    Q(t, this.targets);
  }
}
export {
  J as Animation,
  Vt as AnimationGroup,
  ne as CSSCubicBezier,
  se as CSSKeyframesAnimation,
  Qt as DIRECTIONS,
  Jt as ElementMorph,
  Zt as FILL_MODES,
  ee as ManualTimeline,
  xt as NumericAnimation,
  te as ScrollTimeline,
  Dt as SmoothProgress,
  Z as Timeline,
  ae as bezierPresets,
  oe as bounceInEase,
  le as bounceInEaseHalf,
  he as bounceInOutEase,
  ue as bounceOutEase,
  ce as bounceOutEaseHalf,
  fe as cancelAnimationFrame,
  pe as clamp,
  me as cubicBezier,
  de as cubicBezierToSVG,
  ge as cubicBezierToString,
  ye as deCasteljau,
  Ft as defaultLayerConfig,
  wt as defaultOptions,
  be as easeInBounce,
  ve as easeInCirc,
  we as easeInCubic,
  Fe as easeInExpo,
  Ve as easeInOutCirc,
  Se as easeInOutCubic,
  Te as easeInOutExpo,
  Ie as easeInOutQuad,
  Ee as easeInOutSine,
  ke as easeInQuad,
  Pe as easeInSine,
  Ae as easeOutCirc,
  Oe as easeOutCubic,
  Me as easeOutExpo,
  _e as easeOutQuad,
  Ce as easeOutSine,
  O as getAnimationId,
  E as getTimingFunction,
  xe as interpBezier,
  je as jumpTerms,
  De as lerp,
  $e as linear,
  Re as logerp,
  Ke as parseCSSPercent,
  Le as parseCSSStylesheet,
  Ue as parseCSSTime,
  We as requestAnimationFrame,
  ze as scale,
  Be as sleep,
  Ne as smoothStep3,
  Ye as stepEnd,
  qe as stepStart,
  He as steppedEase,
  Ge as timingFunctionDescriptions,
  Xe as timingFunctions
};
