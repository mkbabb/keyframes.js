import { parseCSSStylesheet as q, extractAnimationOptions as z, extractProperties as B, extractKeyframes as G, easeInOutCubic as C, lerp as j, requestAnimationFrame as g, cancelAnimationFrame as V, clamp as T, CSSCubicBezier as H, timingFunctions as D, ValueUnit as y, prepareInterpVar as X, normalizeValueUnits as Z, flattenObject as R, unflattenObjectToString as $, ValueArray as b, FunctionValue as L, CSSFunction as J, tryParse as Q, CSSValues as tt, scale as K, COMPUTED_UNITS as et, convertToMs as st, parseCSSValueUnit as it, seekPreviousValue as M, unflattenObject as rt, parseCSSTime as P, sleep as nt, isObject as ot, lerpValue as at } from "@mkbabb/value.js";
import { any as ht } from "@mkbabb/parse-that";
function U(r, t, e, s) {
  let i = 0, n = r.length - 1;
  for (; i <= n; ) {
    const o = i + n >> 1, a = r[o];
    if (t < e(a)) n = o - 1;
    else if (t > s(a)) i = o + 1;
    else return o;
  }
  return -1;
}
const lt = (r) => {
  const t = {};
  for (const e of r.declarations)
    t[e.name] = e.value;
  return t;
}, ut = (r) => {
  const t = [];
  for (const e of r.selectors)
    e.kind === "percent" ? t.push(`${e.value}%`) : t.push(e.name);
  return t;
}, ct = (r) => {
  const t = G(r);
  for (const e of t.values())
    if (e.length > 0) return e;
  return [];
}, ft = (r) => {
  const t = r.trim();
  return /@keyframes\b/i.test(t) || t.length === 0 ? r : `@keyframes anonymous {
${t}
}`;
}, dt = (r) => {
  const t = typeof r == "string" ? q(ft(r)) : r, e = ct(t), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const n of e) {
    const o = lt(n);
    for (const a of ut(n)) {
      const u = s.get(a);
      s.set(a, { ...u ?? {}, ...o }), n.timingFunction != null && i.set(a, n.timingFunction);
    }
  }
  return {
    keyframes: s,
    timingFunctions: i,
    properties: B(t),
    options: z(t)
  };
}, Nt = [
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse"
], Wt = ["none", "forwards", "backwards", "both"], pt = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: C,
  useWAAPI: !0,
  colorSpace: "oklab"
}, mt = {
  zIndex: 0,
  weight: 1,
  blendMode: "replace",
  enabled: !0
}, _ = (r) => typeof r != "object" || r == null ? !1 : "value" in r && typeof r.value == "number";
class gt {
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
      let i, n;
      s instanceof Y ? i = s : (i = s.animation, n = s.layer), this.transform == null && i.frames[0] != null && (this.transform = i.frames[0].transform);
      const o = I(i);
      this.animations[o] = {
        values: {},
        animation: i,
        layer: { ...mt, ...n }
      }, i.managed = !0, e.push(i);
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
   *
   * Refreshes every child's values at its current `t` in place —
   * `interpFrames(t, false, entry.values)` clears and rewrites the
   * long-lived buffer, so no stale keys leak across frames and no
   * fresh object is allocated per entry per frame.
   */
  transformFramesGrouped(t) {
    const e = {}, s = this.getEntries();
    let i = !0;
    for (const n of s) {
      const { animation: o, layer: a, values: u } = n;
      if (i = i && o.done, !a.enabled) continue;
      o.interpFrames(o.t, !1, u);
      const h = a.properties ? Object.fromEntries(
        Object.entries(u).filter(
          ([l]) => a.properties.has(l)
        )
      ) : u;
      switch (a.blendMode) {
        case "replace":
          Object.assign(e, h);
          break;
        case "add":
          for (const [l, c] of Object.entries(h))
            if (l in e) {
              const f = e[l], p = c;
              _(f) && _(p) ? f.value = f.value + p.value : e[l] = c;
            } else
              e[l] = c;
          break;
        case "weighted":
          for (const [l, c] of Object.entries(h))
            if (l in e) {
              const f = e[l], p = c;
              _(f) && _(p) ? f.value = j(
                a.weight,
                f.value,
                p.value
              ) : e[l] = c;
            } else
              e[l] = c;
          break;
      }
    }
    return this.done = i, this.transform(e, t), e;
  }
  /**
   * Render the current composition as a static frame using each
   * child's current `t`. Single-target groups go through the
   * blended transform; multi-target groups apply each child's
   * interpolated vars directly to its own targets.
   *
   * This is the public entry point for scenarios that mutate a
   * child's state outside the rAF loop (scrubbing, state restore,
   * pause snapshots) and need the visual to update immediately.
   */
  render() {
    const t = this.lastTickTime || performance.now();
    if (this.singleTarget)
      this.transformFramesGrouped(t);
    else
      for (const e of this.getEntries())
        e.animation.interpFrames(e.animation.t, !0);
  }
  /**
   * Set a child animation's current time without touching its
   * siblings. Updates `pausedTime` so the child resumes correctly
   * from the scrub position. Chainable. Call `render()` afterwards
   * to reflect the change visually.
   */
  setChildTime(t, e) {
    const s = typeof t == "string" ? t : I(t), i = this.animations[s];
    if (!i)
      throw new Error(
        `AnimationGroup.setChildTime: no animation registered for key "${s}". Known keys: ${Object.keys(this.animations).join(", ") || "(none)"}.`
      );
    const n = i.animation;
    return n.t = e, n.startTime !== void 0 && (n.pausedTime = n.startTime + e), this;
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
      const i = s.animation;
      (!i.paused || i.pausedTime === 0) && e.push(i.tick(t));
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
    return this.paused ? (V(this.handleId), this.handleId = void 0, this.render()) : this.handleId = g(this._boundDraw), this;
  }
  reset() {
    for (const t of this.getEntries()) {
      const e = t.animation;
      e.started && e.frames.length > 0 && e.interpFrames(0, !0), e.managed = !1, e.reset();
    }
    return this.started = !1, this.done = !1, this.paused = !1, this.lastTickTime = 0, this;
  }
  stop() {
    return V(this.handleId), this.handleId = void 0, this.reset(), this;
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
    const s = typeof t == "string" ? t : I(t), i = this.animations[s];
    if (!i)
      throw new Error(
        `AnimationGroup.setLayerConfig: no animation registered for key "${s}". Known keys: ${Object.keys(this.animations).join(", ") || "(none)"}.`
      );
    return Object.assign(i.layer, e), this.invalidateEntries(), this;
  }
  /** Convenience toggle for enabling/disabling a layer. Chainable. */
  setLayerEnabled(t, e) {
    return this.setLayerConfig(t, { enabled: e });
  }
  /** Read the layer config for an animation. */
  getLayerConfig(t) {
    const e = typeof t == "string" ? t : I(t);
    return this.animations[e]?.layer;
  }
}
class yt {
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
      const i = (n) => {
        this._startTime === void 0 && (this._startTime = n);
        const o = T((n - this._startTime) / t, 0, 1);
        e(o), o < 1 ? this._rafId = g(i) : this._cleanup();
      };
      this._rafId = g(i);
    });
  }
  /** Cancel a running playback. The play promise resolves immediately. */
  stop() {
    this._rafId !== null && V(this._rafId), this._cleanup();
  }
  _cleanup() {
    this._rafId = null, this._startTime = void 0;
    const t = this._resolve;
    this._resolve = null, t?.();
  }
}
const v = (r) => {
  if (r instanceof y)
    return [r.clone()];
  if (r instanceof L)
    return r.values.flatMap((t) => v(t));
  if (r instanceof b)
    return r.flatMap((t) => v(t));
  throw new TypeError(
    `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof r}`
  );
}, wt = (r) => {
  const t = r.split(".").pop(), e = r.split(".").shift();
  if (!t || !e)
    throw new Error(`Invalid flattened key: ${r}`);
  return { mainKey: e, childKey: t };
}, F = (r, t, e) => (r.setProperty(t), e !== t && r.setSubProperty(e), r), bt = /^\s*cubic-bezier\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)\s*$/i, S = (r) => {
  if (r == null)
    return;
  if (typeof r != "string")
    return r;
  const t = r.match(bt);
  if (t) {
    const s = t.slice(1, 5).map(
      (i) => Number.parseFloat(i ?? "")
    );
    if (s.length === 4 && s.every((i) => Number.isFinite(i))) {
      const [i, n, o, a] = s;
      return H(i, n, o, a);
    }
  }
  const e = D[r];
  if (typeof e == "function" && e.length <= 1)
    return e;
}, k = /* @__PURE__ */ new Map();
function vt(r) {
  const t = R(r), e = (i, n) => {
    const { childKey: o, mainKey: a } = wt(i);
    if (n instanceof y)
      return F(
        new b(...v(n)),
        a,
        o
      );
    if (n instanceof L) {
      const d = n.values.flatMap(
        (m) => v(e(i, m))
      );
      return F(
        new b(...d),
        a,
        o
      );
    } else if (n instanceof b) {
      const d = n.flatMap(
        (m) => v(e(i, m))
      );
      return F(
        new b(...d),
        a,
        o
      );
    }
    const u = String(n), h = `${o}:${u}`, l = k.get(h);
    if (l)
      return F(l.clone(), a, o);
    const c = J.FunctionArgs.map(
      (d) => (d.setSubProperty(o), d)
    ), f = Q(
      ht(c, tt.Value),
      u
    ), p = F(
      new b(...v(f)),
      a,
      o
    );
    return k.set(h, p.clone()), p;
  };
  return Object.entries(t).reduce(
    (i, [n, o]) => (i[n] = e(n, o), i),
    {}
  );
}
const Ft = (r, t, e, s, i = "oklab", n) => {
  const o = s[t], a = s[e];
  if (!o || !a)
    throw new Error(
      `Invalid interpolation frame bounds (${t} -> ${e}).`
    );
  const u = o[r], h = a[r];
  if (!u || !h)
    throw new Error(`Missing variable "${r}" in interpolation bounds.`);
  const l = Math.max(u.length, h.length), c = (d) => {
    const m = d.map((w) => {
      if (!(w instanceof y))
        throw new TypeError(
          `Interpolation for "${r}" requires ValueUnit leaves.`
        );
      return w;
    });
    for (; m.length < l; )
      m.push(new y(0));
    return m;
  }, f = c(u), p = c(h);
  return f.map((d, m) => {
    const w = p[m];
    if (!w)
      throw new Error(
        `Missing right-hand interpolation value at index ${m}.`
      );
    if (!(d instanceof y) || !(w instanceof y))
      throw new TypeError(
        `Interpolation for "${r}" requires ValueUnit leaves.`
      );
    const E = { colorSpace: i };
    return n !== void 0 && (E.hueMethod = n), X(Z(d, w, E));
  });
};
function Vt(r, t, e) {
  const [s, i] = [r.start, t.start];
  return {
    start: s.value * e / 100,
    stop: i.value * e / 100
  };
}
function N(r, t, e = !0) {
  r = e ? r : R(r);
  const s = $(r);
  t.forEach((i) => {
    Object.entries(s).forEach(([n, o]) => {
      i.style.setProperty(n, o);
    });
  });
}
N[/* @__PURE__ */ Symbol.for("keyframes.defaultRenderer")] = !0;
function Tt() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const _t = (r) => r;
class It {
  keyframes;
  segments;
  positions;
  timingFn;
  result;
  _duration;
  _respectReducedMotion;
  // Shared rAF lifecycle for `.play()` / `.stop()`.
  _playback = new yt();
  constructor(t, e) {
    if (t.length < 2)
      throw new Error(
        "NumericAnimation requires at least 2 keyframes."
      );
    if (this.keyframes = t.map((s) => ({ ...s })), this._duration = e?.duration ?? 0, this._respectReducedMotion = e?.respectReducedMotion ?? !1, this.timingFn = (e?.timingFunction ? S(e.timingFunction) : void 0) ?? _t, e?.positions) {
      if (e.positions.length !== t.length)
        throw new Error(
          "positions length must match keyframes length."
        );
      this.positions = e.positions;
    } else
      this.positions = t.map(
        (s, i) => i / (t.length - 1) * 100
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
    const e = this.keyframes[t], s = this.keyframes[t + 1], i = Object.keys(e);
    return {
      startPos: this.positions[t],
      stopPos: this.positions[t + 1],
      keys: i,
      startVals: i.map((n) => e[n]),
      stopVals: i.map((n) => s[n]),
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
    const e = T(t, 0, 1) * 100;
    let s = U(
      this.segments,
      e,
      (a) => a.startPos,
      (a) => a.stopPos
    );
    s === -1 && (s = this.segments.length - 1);
    const i = this.segments[s], n = K(
      T(e, i.startPos, i.stopPos),
      i.startPos,
      i.stopPos,
      0,
      1
    ), o = i.timingFunction(n);
    for (let a = 0; a < i.keys.length; a++)
      this.result[i.keys[a]] = j(
        o,
        i.startVals[a],
        i.stopVals[a]
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
    if (this._respectReducedMotion && Tt()) {
      const i = this.at(1);
      return t?.(i), Promise.resolve();
    }
    return this._playback.play(s, (i) => {
      const n = this.at(i);
      t?.(n);
    });
  }
  /** Cancel a running `.play()` animation. The play promise resolves immediately. */
  stop() {
    this._playback.stop();
  }
}
const St = {
  damping: 0.1,
  snapThreshold: 1e-3,
  targetEpsilon: 0,
  initial: 0,
  clamp: !0,
  respectReducedMotion: !1
};
function A() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
class Et {
  options;
  targetValue;
  currentValue;
  isSettled;
  // Managed rAF lifecycle for `.play()` / `.stop()`. Symmetric with
  // `NumericAnimation.play(onFrame)`: the engine owns the loop so
  // consumers never reimplement rAF glue. Auto-stops on settle;
  // `setTarget()` while `onFrame` is attached and the loop is idle
  // auto-resumes the loop.
  _rafId = null;
  _lastFrameT = 0;
  _onFrame = void 0;
  constructor(t) {
    this.options = { ...St, ...t }, this.targetValue = this.options.initial, this.currentValue = this.options.initial, this.isSettled = !0;
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
    if (e > 0 && e >= this.options.targetEpsilon) {
      if (this.targetValue = t, this.options.respectReducedMotion && A()) {
        this.currentValue = t, this.isSettled = !0, this._onFrame?.(t);
        return;
      }
      this.isSettled = !1, this._onFrame && this._rafId === null && this._startLoop();
    }
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
    this.currentValue = this.targetValue, this.isSettled = !0, this._stopLoop();
  }
  /** Reset to a specific value (default 0). */
  reset(t) {
    const e = t ?? 0;
    this.targetValue = e, this.currentValue = e, this.isSettled = !0, this._stopLoop();
  }
  /**
   * Start a managed rAF loop that calls `tickDt(dt)` each frame until
   * `settled`, invoking `onFrame(current)` per tick. Idempotent — repeat
   * calls re-bind the callback without spawning a second loop. Once
   * settled the loop auto-stops; `setTarget()` while a callback is
   * bound auto-resumes the loop without needing another `.play()`.
   *
   * Symmetric with `NumericAnimation.play(onFrame)`: library owns rAF,
   * consumer provides a per-frame callback. Consumers that already
   * drive their own rAF (e.g. canvas renderers) should continue to
   * call `.tickDt(dt)` directly and never invoke `.play()`.
   */
  play(t) {
    if (this._onFrame = t, this.options.respectReducedMotion && A()) {
      this.currentValue = this.targetValue, this.isSettled = !0, t?.(this.currentValue);
      return;
    }
    if (this.isSettled) {
      t?.(this.currentValue);
      return;
    }
    this._startLoop();
  }
  /**
   * Cancel the managed rAF loop and detach the per-frame callback.
   * Pairs with `.play()`. Does not touch current/target/settled state.
   */
  stop() {
    this._onFrame = void 0, this._stopLoop();
  }
  _startLoop() {
    if (this._rafId !== null) return;
    this._lastFrameT = 0;
    const t = (e) => {
      const s = this._lastFrameT ? e - this._lastFrameT : 16.667;
      this._lastFrameT = e;
      const i = this.tickDt(s);
      if (this._onFrame?.(i), this.isSettled) {
        this._stopLoop();
        return;
      }
      this._rafId = g(t);
    };
    this._rafId = g(t);
  }
  _stopLoop() {
    this._rafId !== null && (V(this._rafId), this._rafId = null), this._lastFrameT = 0;
  }
}
const O = (r) => {
  if (r instanceof HTMLElement) {
    const t = r.getBoundingClientRect();
    return { x: t.x, y: t.y, width: t.width, height: t.height };
  }
  return r;
};
class Yt {
  animation;
  transformOrigin;
  timingFunction;
  duration;
  constructor(t, e, s) {
    this.transformOrigin = s?.transformOrigin ?? "top left", this.timingFunction = s?.timingFunction, this.duration = s?.duration ?? 0, this.measure(t, e);
  }
  /** Re-measure source and destination, rebuilding the internal animation. */
  measure(t, e) {
    const s = O(t), i = O(e), n = i.x - s.x, o = i.y - s.y, a = s.width === 0 ? 1 : i.width / s.width, u = s.height === 0 ? 1 : i.height / s.height;
    return this.animation = new It(
      [
        { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
        { translateX: n, translateY: o, scaleX: a, scaleY: u }
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
    const { translateX: e, translateY: s, scaleX: i, scaleY: n } = this.animation.at(t);
    return `translate(${e}px, ${s}px) scale(${i}, ${n})`;
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
      const { translateX: i, translateY: n, scaleX: o, scaleY: a } = s;
      t.style.transform = `translate(${i}px, ${n}px) scale(${o}, ${a})`, t.style.transformOrigin = this.transformOrigin;
    }, e ?? this.duration);
  }
  /** Cancel a running `.play()` animation. */
  stop() {
    this.animation.stop();
  }
}
const Mt = (r) => {
  if (r == null) return null;
  if (typeof r == "function") return r;
  const t = D[r];
  return typeof t == "function" && t.length <= 1 ? t : null;
}, Pt = (r) => Math.max(0, Math.min(1, r));
class W {
  smoother;
  easingFn;
  currentProgress = 0;
  boundaryEpsilon;
  constructor(t) {
    this.easingFn = Mt(t?.easing), this.boundaryEpsilon = t?.boundaryEpsilon ?? 5e-3, t?.smoothing === !1 ? this.smoother = null : this.smoother = new Et(
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
    let t = Pt(this.sample());
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
class qt extends W {
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
class zt extends W {
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
const x = (r) => typeof r == "string" && et.includes(r), kt = /* @__PURE__ */ Symbol.for("keyframes.defaultRenderer"), At = (r) => typeof r == "function" && r[kt] === !0;
function Ot(r) {
  if (!r.targets || r.targets.length === 0)
    return { eligible: !1, reason: "no DOM targets" };
  if (typeof r.targets[0]?.animate != "function")
    return {
      eligible: !1,
      reason: "target does not implement Element.animate()"
    };
  for (const t of r.frames)
    if (!At(t.transform))
      return {
        eligible: !1,
        reason: "custom transform function (not the default DOM renderer)"
      };
  if (r.frames.length > 1) {
    const t = r.frames[0].timingFunction;
    for (let e = 1; e < r.frames.length; e++)
      if (r.frames[e].timingFunction !== t)
        return {
          eligible: !1,
          reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)"
        };
  }
  for (const t of r.frames)
    for (const e of Object.values(t.interpVars))
      for (const s of e) {
        if (x(s.start?.unit) || x(s.stop?.unit))
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
function xt(r) {
  const t = r.options.duration, e = [], s = /* @__PURE__ */ new Set();
  for (const n of r.frames)
    s.add(n.time.start), s.add(n.time.stop);
  const i = [...s].sort((n, o) => n - o);
  for (const n of i) {
    const o = r.interpFrames(n, !1);
    if (Object.keys(o).length === 0) continue;
    const a = $(o);
    e.push({
      offset: Math.max(0, Math.min(1, n / t)),
      ...a
    });
  }
  return e;
}
const Ct = {
  normal: "normal",
  reverse: "reverse",
  alternate: "alternate",
  "alternate-reverse": "alternate-reverse"
}, jt = {
  none: "none",
  forwards: "forwards",
  backwards: "backwards",
  both: "both"
};
function Dt(r) {
  const t = r.options, e = Ct[t.direction], s = jt[t.fillMode];
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
async function Rt(r) {
  const t = xt(r), e = Dt(r), s = r.targets.map(
    (o) => o.animate(t, e)
  );
  let i = !1;
  const n = (o) => {
    if (!(i || r.done)) {
      if (r.tick(o), r.paused)
        for (const a of s) a.pause();
      else
        for (const a of s)
          a.playState === "paused" && a.play();
      r.handleId = requestAnimationFrame(n);
    }
  };
  r.handleId = requestAnimationFrame(n);
  try {
    await Promise.all(s.map((o) => o.finished));
  } finally {
    i = !0;
  }
}
const $t = (r) => typeof r != "object" || r == null ? !1 : typeof r.clone == "function", I = (r) => typeof r == "string" ? r : r.name ?? String(r.id);
let Lt = 0;
class Y {
  id = Lt++;
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
  constructor(t, e, s, i) {
    this.options = {}, this.setOptions({ ...pt, ...t ?? {} }), this.targets = e == null ? [] : Array.isArray(e) ? e : [e], this.name = s, this.superKey = i;
  }
  convertFrameStart(t) {
    if (t.start.unit === "s" || t.start.unit === "ms" || !t.start.unit) {
      const e = t.start.unit === "s" ? "s" : "ms", s = st(t.start.value, e);
      t.start.value = s / this.options.duration * 100, t.start.unit = "%";
    }
    return t.start.value = T(t.start.value, 0, 100), t;
  }
  addFrame(t, e, s, i) {
    typeof t == "number" ? t = String(t) + "%" : typeof t == "string" ? t = t : t instanceof y && (t = String(t));
    const n = it(t);
    let o = {
      id: this.frameId,
      start: n,
      vars: e,
      transform: s,
      timingFunction: S(i) ?? this.options.timingFunction
    };
    return this.convertFrameStart(
      o
    ), this.templateFrames.push(
      o
    ), this.frameId += 1, this;
  }
  createFrame(t, e) {
    const s = this.templateFrames[t], i = this.templateFrames[e], n = {
      start: t,
      stop: e
    }, o = Vt(s, i, this.options.duration);
    let a = s.transform;
    if (a == null) {
      const l = M(
        t,
        this.frames,
        (c) => c.transform != null
      );
      a = this.frames[l].transform;
    }
    let u = s.timingFunction;
    if (u == null) {
      const l = M(
        t,
        this.frames,
        (c) => c.timingFunction != null
      );
      u = this.frames[l].timingFunction;
    }
    return {
      id: this.frameId++,
      ixs: n,
      start: s.start,
      time: o,
      vars: void 0,
      flatVars: void 0,
      interpVars: {},
      allInterpVars: [],
      transform: a,
      timingFunction: u
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
        let i = t.get(s);
        i || (i = [], t.set(s, i)), i.push(e);
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
      for (const i of Object.keys(s)) {
        const n = e.get(i);
        if (!n) continue;
        let o = -1;
        for (const c of n)
          if (c > t) {
            o = c;
            break;
          }
        if (o === -1) continue;
        const [a, u] = [t, o], h = this.frames.findIndex(
          (c) => c.ixs.start === a && c.ixs.stop === u
        ), l = h !== -1 ? this.frames[h] : this.createFrame(a, u);
        l.interpVars[i] = Ft(
          i,
          a,
          u,
          this.parsedVars,
          this.options.colorSpace,
          this.options.hueMethod
        ), h === -1 && this.frames.push(l);
      }
  }
  parse() {
    this.frames = [], this.templateFrames.sort((e, s) => e.start.value - s.start.value), this.parsedVars = this.templateFrames.map((e) => {
      const s = vt(
        e.vars
      );
      return Object.values(s).forEach((i) => {
        i.setTargets(this.targets);
      }), s;
    });
    for (let e = 0; e < this.templateFrames.length - 1; e++)
      this.frames.push(this.createFrame(e, e + 1));
    const t = this.buildVarIndex();
    return this.frames.forEach((e, s) => this.reconcileVars(s, t)), this.frames.sort((e, s) => e.time.start === s.time.start ? e.time.stop - s.time.stop : e.time.start - s.time.start), this.frames = this.frames.filter(
      (e) => e.interpVars != null && Object.keys(e.interpVars).length > 0
    ), this.frames.forEach((e) => {
      const s = Object.entries(e.interpVars).reduce((i, [n, o]) => (i[n] = o.map((a) => a.value), i), {});
      e.flatVars = s, e.vars = rt(e.flatVars), e.allInterpVars = Object.values(e.interpVars).flat();
    }), this;
  }
  setTimingFunction(t) {
    return this.options.timingFunction = S(t) ?? C, this;
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
    typeof t == "string" && (t = P(t));
    const e = t ?? this.options.duration;
    if (!isFinite(e) || e <= 0) return this;
    const s = this.options.duration, i = e / s;
    for (let n = 0; n < this.frames.length; n++) {
      const o = this.frames[n];
      o.time.start *= i, o.time.stop *= i;
    }
    return this.options.duration = e, this;
  }
  setDelay(t) {
    return typeof t == "string" && (t = P(t)), this.options.delay = t ?? 0, this;
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
    const i = T(t, 0, 1) * this.options.duration, n = this.interpFrames(i, e);
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
   * @param out - Optional output object to write results into. When
   *   provided, its keys are cleared first so no stale keys from a
   *   previous call leak through. Pass this per-animation to achieve
   *   zero-allocation steady-state playback.
   * @returns Merged flat vars from all active frames
   */
  interpFrames(t, e = !1, s = {}) {
    t = this.reversed ? this.options.duration - t : t;
    const i = s;
    for (const h in i) delete i[h];
    const n = this.frames, o = n.length, a = U(
      n,
      t,
      (h) => h.time.start,
      (h) => h.time.stop
    );
    if (a === -1) return i;
    const u = (h) => {
      const { start: l, stop: c } = h.time, f = K(t, l, c, 0, 1), p = h.timingFunction(f);
      for (const d of h.allInterpVars)
        at(p, d);
      e && h.transform(
        this.unflatten ? h.vars : h.flatVars,
        t
      ), Object.assign(i, h.flatVars);
    };
    for (let h = a; h >= 0; h--) {
      const l = n[h];
      if (t < l.time.start || t > l.time.stop) break;
      u(l);
    }
    for (let h = a + 1; h < o; h++) {
      const l = n[h];
      if (t < l.time.start || t > l.time.stop) break;
      u(l);
    }
    return i;
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" && this.iteration % 2 === 0 || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.paused = !0, await nt(this.options.delay), this.paused = !1), this.started = !0;
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
    await Rt(this), this.reset();
  }
  async play() {
    if (this.managed)
      throw new Error(
        "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead."
      );
    if (this._playingPromise) return this._playingPromise;
    let t;
    if (this.options.useWAAPI) {
      const e = Ot(this);
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
    V(this.handleId), this.reset();
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
        s.forEach(({ start: i, stop: n, value: o }) => {
          i.setTargets(this.targets), n.setTargets(this.targets), o.setTargets(this.targets);
        });
      });
    }), this;
  }
  group(...t) {
    return new gt(this, ...t);
  }
}
class Bt extends Y {
  constructor(t, ...e) {
    super(t, e), this.unflatten = !1;
  }
  fromVars(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    for (let s = 0; s < t.length; s++) {
      const i = t[s], n = Math.round(s / (t.length - 1) * 100);
      this.addFrame(n, i, e);
    }
    return this.parse(), this;
  }
  fromKeyframes(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this), ot(t) && (t = new Map(Object.entries(t)));
    const s = t instanceof Map ? t.entries() : Object.entries(t);
    for (const [i, n] of s)
      this.addFrame(i, n, e);
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
    const s = dt(t);
    this.propertyRegistry = s.properties;
    for (const [i, n] of s.keyframes.entries()) {
      const o = Object.fromEntries(
        Object.entries(n).map(([h, l]) => [
          h,
          $t(l) ? l.clone() : l
        ])
      ), a = s.timingFunctions.get(i), u = a ? S(a) : void 0;
      this.addFrame(i, o, e, u);
    }
    return this.parse(), this;
  }
  transform(t) {
    N(t, this.targets);
  }
}
export {
  Y as Animation,
  gt as AnimationGroup,
  Bt as CSSKeyframesAnimation,
  Nt as DIRECTIONS,
  Yt as ElementMorph,
  Wt as FILL_MODES,
  zt as ManualTimeline,
  It as NumericAnimation,
  qt as ScrollTimeline,
  Et as SmoothProgress,
  W as Timeline,
  mt as defaultLayerConfig,
  pt as defaultOptions,
  I as getAnimationId,
  S as getTimingFunction,
  dt as resolveKeyframes
};
