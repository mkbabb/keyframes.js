import { CSSFunction as tt, ValueUnit as f, CSSValueUnit as A, identifier as j, hyphenToCamelCase as yt, ValueArray as T, number as wt, camelCaseToHyphen as Vt, memoize as V, tryParse as F, FunctionValue as U, easeInOutCubic as et, lerp as I, requestAnimationFrame as w, cancelAnimationFrame as k, parseCSSValueUnit as st, unpackMatrixValues as Tt, normalizeColorUnits as bt, COMPUTED_UNITS as $, convertToDPI as St, convertToMs as it, convertToDegrees as vt, convertToPixels as Ft, RESOLUTION_UNITS as It, TIME_UNITS as Pt, ANGLE_UNITS as Et, LENGTH_UNITS as Ct, timingFunctions as rt, flattenObject as nt, unflattenObjectToString as ot, clamp as E, scale as at, seekPreviousValue as B, unflattenObject as Ot, sleep as _t, isObject as kt } from "@mkbabb/value.js";
import { CSSCubicBezier as Ye, bezierPresets as Be, bounceInEase as Re, bounceInEaseHalf as We, bounceInOutEase as Le, bounceOutEase as Xe, bounceOutEaseHalf as He, cancelAnimationFrame as Ge, clamp as qe, cubicBezier as Ze, cubicBezierToSVG as Qe, cubicBezierToString as Je, deCasteljau as ts, easeInBounce as es, easeInCirc as ss, easeInCubic as is, easeInExpo as rs, easeInOutCirc as ns, easeInOutCubic as os, easeInOutExpo as as, easeInOutQuad as us, easeInOutSine as ls, easeInQuad as cs, easeInSine as hs, easeOutCirc as fs, easeOutCubic as ps, easeOutExpo as ms, easeOutQuad as ds, easeOutSine as gs, interpBezier as ys, jumpTerms as ws, lerp as Vs, linear as Ts, logerp as bs, requestAnimationFrame as Ss, scale as vs, sleep as Fs, smoothStep3 as Is, stepEnd as Ps, stepStart as Es, steppedEase as Cs, timingFunctions as Os } from "@mkbabb/value.js";
import { string as g, all as D, regex as ut, any as C, whitespace as Mt } from "@mkbabb/parse-that";
function lt(s, t, e, i) {
  let r = 0, o = s.length - 1;
  for (; r <= o; ) {
    const n = r + o >> 1, u = s[n];
    if (t < e(u)) o = n - 1;
    else if (t > i(u)) r = n + 1;
    else return n;
  }
  return -1;
}
const At = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ""), xt = (s) => s.replace(/\s*!important/gi, ""), N = (s) => xt(At(s));
g("(");
g(")");
const jt = g(";"), Ut = g(":"), K = g("{"), z = g("}"), $t = g(","), Dt = g("."), d = Mt, Nt = (s) => {
  const t = [];
  for (const e of s.flat(1 / 0)) {
    if (e instanceof f || e instanceof U) {
      t.push(e);
      continue;
    }
    throw new TypeError(
      `Expected parsed CSS value node, got ${typeof e}.`
    );
  }
  return t;
}, Kt = tt.Function, zt = D(K, ut(/[^{}]+/), z).map(
  (s) => {
    const t = s.join(`
`), e = JSON.parse(t);
    return new f(e, "json");
  }
), Y = C(
  A.Value,
  Kt,
  zt,
  ut(/[^\(\)\{\}\s,;]+/).map((s) => new f(s))
).trim(d), Yt = Y.sepBy(d), Bt = D(
  j.skip(Ut).trim(d).map((s) => yt(s)),
  Yt.skip(jt.opt()).trim(d)
).map((s) => {
  const [t, e] = s, i = new T(...Nt(e));
  return i.setProperty(t), {
    [t]: i
  };
}), Rt = C(
  A.TimePercentage.trim(d).map((s) => s.toString()),
  wt.map((s) => `${s}%`)
), Wt = Rt.sepBy($t).trim(d), ct = Bt.many().trim(d).wrap(K, z).map((s) => Object.assign({}, ...s)), Lt = g("@keyframes").trim(d).next(j), R = D(Wt, ct).map(
  ([s, t]) => s.reduce((e, i) => (e.set(i, t), e), /* @__PURE__ */ new Map())
), ht = C(
  Lt.next(R.many(1).trim(d).wrap(K, z).trim(d)),
  R.many(1).trim(d)
).map((s) => s.reduce(
  (t, e) => {
    for (const [i, r] of e)
      t.has(i) ? t.set(i, { ...t.get(i), ...r }) : t.set(i, r);
    return t;
  },
  /* @__PURE__ */ new Map()
)), Xt = Dt.trim(d).next(j).trim(d), Ht = ct.map((s) => {
  const t = {};
  for (const [e, i] of Object.entries(s))
    if (e.includes("animation")) {
      const r = e.replace(/^animation/i, "").replace(/^\w/, (n) => n.toLowerCase()), o = Vt(i.toString());
      t[r] = o, delete s[e];
    }
  return {
    options: t,
    values: s
  };
}), Gt = Xt.next(Ht), qt = C(
  Gt.map((s) => s),
  ht.map((s) => ({
    keyframes: s
  }))
), Zt = qt.sepBy(d).map((s) => Object.assign({}, ...s)), W = {
  Value: Y,
  FunctionArgs: tt.FunctionArgs
}, Qt = V(
  (s) => F(Y, N(s))
), Jt = V(
  (s) => F(ht, N(s))
);
V((s) => {
  const t = F(
    Zt,
    N(s)
  ), e = {
    keyframes: t.keyframes
  };
  return t.options != null && (e.options = t.options), t.values != null && (e.values = t.values), e;
});
V(
  (s) => F(A.Percentage, String(s)).valueOf()
);
const L = V((s) => F(
  A.Time.map((t) => t.unit === "ms" ? t.value : t.unit === "s" ? t.value * 1e3 : t.value),
  s
));
V((s) => s >= 5e3 ? `${s / 1e3}s` : `${s}ms`);
V((s) => s === 1 / 0 ? "infinite" : String(s));
const te = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: et,
  useWAAPI: !0,
  colorSpace: "oklab"
}, ee = {
  zIndex: 0,
  weight: 1,
  blendMode: "replace",
  enabled: !0
}, _ = (s) => typeof s != "object" || s == null ? !1 : "value" in s && typeof s.value == "number";
class se {
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
    for (const i of t) {
      let r, o;
      i instanceof gt ? r = i : (r = i.animation, o = i.layer), this.transform ??= r.frames[0].transform;
      const n = x(r);
      this.animations[n] = {
        values: {},
        animation: r,
        layer: { ...ee, ...o }
      }, r.managed = !0, e.push(r);
    }
    this.singleTarget = e.every(
      (i) => i.targets[0] === e[0]?.targets[0]
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
    for (const i of e)
      i.animation.setTargets(...t);
    return this.singleTarget = e.every(
      (i) => i.animation.targets[0] === e[0]?.animation.targets[0]
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
    const e = {}, i = this.getEntries();
    let r = !0;
    for (const o of i) {
      const { animation: n, values: u, layer: a } = o;
      if (r = r && n.done, !a.enabled) continue;
      if (!(n.done || n.paused)) {
        const l = n.interpFrames(n.t, !1);
        Object.assign(u, l);
      }
      const c = a.properties ? Object.fromEntries(
        Object.entries(u).filter(
          ([l]) => a.properties.has(l)
        )
      ) : u;
      switch (a.blendMode) {
        case "replace":
          Object.assign(e, c);
          break;
        case "add":
          for (const [l, h] of Object.entries(c))
            if (l in e) {
              const m = e[l], p = h;
              _(m) && _(p) ? m.value = m.value + p.value : e[l] = h;
            } else
              e[l] = h;
          break;
        case "weighted":
          for (const [l, h] of Object.entries(c))
            if (l in e && a.weight < 1) {
              const m = e[l], p = h;
              _(m) && _(p) ? m.value = I(
                a.weight,
                m.value,
                p.value
              ) : e[l] = h;
            } else
              e[l] = h;
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
    for (const i of t) {
      const r = i.animation.interpFrames(i.animation.t, !1);
      this.singleTarget && Object.assign(i.values, r);
    }
    if (this.singleTarget)
      this.transformFramesGrouped(e);
    else
      for (const i of t)
        i.animation.interpFrames(i.animation.t, !0);
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
    for (const i of this.getEntries()) {
      const r = i.animation;
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
        for (const i of this.getEntries())
          i.animation.interpFrames(i.animation.t, !0), e = e && i.animation.done;
        this.done = e;
      }
      this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = w(this._boundDraw);
    }
  }
  /**
   * Start the animation group. Returns a promise that resolves
   * when all child animations complete (or on explicit stop/reset).
   */
  async play() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = w(this._boundDraw);
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
      const i = e.animation;
      this.paused ? (i.pause(!1), i.pausedTime === 0 && (i.pausedTime = t)) : i.paused = !1;
    }
    return this.paused ? (k(this.handleId), this.handleId = void 0, this.renderPauseFrame()) : this.handleId = w(this._boundDraw), this;
  }
  reset() {
    for (const t of this.getEntries()) {
      const e = t.animation;
      e.started && e.frames.length > 0 && e.interpFrames(0, !0), e.managed = !1, e.reset();
    }
    return this.started = !1, this.done = !1, this.paused = !1, this.lastTickTime = 0, this;
  }
  stop() {
    return k(this.handleId), this.handleId = void 0, this.reset(), this;
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
  /** Set layer config for an animation by name or reference. Chainable. */
  setLayerConfig(t, e) {
    const i = typeof t == "string" ? t : x(t), r = this.animations[i];
    return r && (Object.assign(r.layer, e), this.invalidateEntries()), this;
  }
  /** Convenience toggle for enabling/disabling a layer. Chainable. */
  setLayerEnabled(t, e) {
    return this.setLayerConfig(t, { enabled: e });
  }
  /** Read the layer config for an animation. */
  getLayerConfig(t) {
    const e = typeof t == "string" ? t : x(t);
    return this.animations[e]?.layer;
  }
}
const ie = /* @__PURE__ */ new Set([
  "scaleX",
  "scaleY",
  "scaleZ",
  "skewX",
  "skewY",
  "skewZ",
  "translateX",
  "translateY",
  "translateZ",
  "rotateX",
  "rotateY",
  "rotateZ",
  "perspectiveX",
  "perspectiveY",
  "perspectiveZ",
  "perspectiveW"
]), re = (s) => typeof s == "string" && Ct.includes(s), ne = (s) => typeof s == "string" && Et.includes(s), oe = (s) => typeof s == "string" && Pt.includes(s), ae = (s) => typeof s == "string" && It.includes(s), X = (s) => typeof s == "string" && $.includes(s), ue = (s) => ie.has(
  s
), le = (s, t) => {
  if (typeof s != "number" || !Number.isFinite(s))
    throw new TypeError(
      `Expected numeric ${t}, got ${String(s)}.`
    );
  return s;
}, H = (s) => {
  if (s.unit !== "color")
    throw new TypeError("Expected a color ValueUnit.");
  return s;
}, ce = (s) => s, G = /* @__PURE__ */ new WeakMap();
let he = 0;
const fe = (s) => {
  let t = G.get(s);
  return t === void 0 && (t = he++, G.set(s, t)), t;
}, q = V(
  (s, t) => (() => {
    if (!t)
      return s;
    if (s.unit === "var") {
      const r = getComputedStyle(t).getPropertyValue(
        s.value
      );
      return st(r);
    }
    if (s.unit === "calc" && s.property && s.subProperty && s.value && t) {
      const r = ce(t.style), o = r[s.property] ?? "", n = s.subProperty ? `${s.subProperty}(${s.toString()})` : s.toString();
      r[s.property] = n;
      const u = getComputedStyle(t).getPropertyValue(
        s.property
      );
      r[s.property] = o;
      const a = Qt(u);
      if (a instanceof f)
        return a;
      if (a.name.startsWith("matrix")) {
        const c = Tt(a);
        if (ue(s.subProperty)) {
          const l = c[s.subProperty];
          if (l != null)
            return new f(l, "px", [
              "length",
              "absolute"
            ]);
        }
      }
    }
    return s;
  })().coalesce(s),
  {
    keyFn: (s, t) => `${s.toString()}-${t ? fe(t) : "null"}`,
    // Don't cache when the element is disconnected (e.g. inside a Teleport
    // defer DocumentFragment). Layout-dependent units like cqw/vh resolve
    // to 0 without a live DOM context.
    shouldCache: (s, t, e) => !e || e.isConnected
  }
), pe = (s, t, e = !1) => {
  if (s?.superType?.[0] !== t?.superType?.[0])
    return e ? [s, t] : [s.clone(), t.clone()];
  const i = (n) => {
    const u = n?.superType?.[0], a = le(n.value, "ValueUnit");
    switch (u) {
      case "length":
        if (!re(n.unit))
          throw new TypeError(
            `Unsupported length unit: ${String(n.unit)}`
          );
        return {
          value: Ft(
            a,
            n.unit,
            n.targets?.[0]
          ),
          unit: "px"
        };
      case "angle":
        if (!ne(n.unit))
          throw new TypeError(
            `Unsupported angle unit: ${String(n.unit)}`
          );
        return {
          value: vt(a, n.unit),
          unit: "deg"
        };
      case "time":
        if (!oe(n.unit))
          throw new TypeError(
            `Unsupported time unit: ${String(n.unit)}`
          );
        return {
          value: it(a, n.unit),
          unit: "ms"
        };
      case "resolution":
        if (!ae(n.unit))
          throw new TypeError(
            `Unsupported resolution unit: ${String(n.unit)}`
          );
        return {
          value: St(a, n.unit),
          unit: "dpi"
        };
      default:
        return {
          value: a,
          unit: typeof n.unit == "string" ? n.unit : ""
        };
    }
  }, [r, o] = [
    i(s),
    i(t)
  ];
  return e ? (s.value = r.value, s.unit = r.unit, t.value = o.value, t.unit = o.unit, [s, t]) : [
    new f(
      r.value,
      r.unit,
      s.superType,
      s.subProperty,
      s.property,
      s.targets
    ),
    new f(
      o.value,
      o.unit,
      t.superType,
      t.subProperty,
      t.property,
      t.targets
    )
  ];
};
function me(s, t, e = "oklab", i) {
  s = s.coalesce(t), t = t.coalesce(s);
  const r = {
    start: s,
    stop: t,
    value: s.clone(),
    computed: !1
  };
  if (s.unit === "color" && t.unit === "color") {
    const [o, n] = bt(
      H(s),
      H(t),
      e,
      !1,
      !0,
      !1,
      i
    );
    r.start = o, r.stop = n, r.value = o.clone();
  }
  if (s.unit !== t.unit) {
    const [o, n] = pe(
      s,
      t,
      !0
    );
    r.start = o, r.stop = n, r.value = o.clone();
  }
  return r.computed = X(s.unit) || X(t.unit), r;
}
const v = (s) => {
  if (s instanceof f)
    return [s.clone()];
  if (s instanceof U)
    return s.values.flatMap((t) => v(t));
  if (s instanceof T)
    return s.flatMap((t) => v(t));
  throw new TypeError(
    `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof s}`
  );
}, de = (s) => {
  const t = s.split(".").pop(), e = s.split(".").shift();
  if (!t || !e)
    throw new Error(`Invalid flattened key: ${s}`);
  return { mainKey: e, childKey: t };
}, P = (s, t, e) => (s.setProperty(t), e !== t && s.setSubProperty(e), s), M = (s) => {
  if (typeof s == "string") {
    const t = rt[s];
    return typeof t == "function" && t.length <= 1 ? t : void 0;
  } else if (s == null)
    return;
  return s;
};
function ft(s, { start: t, stop: e, value: i }) {
  const r = t.targets?.[0] ?? e.targets?.[0];
  if (!r)
    throw new Error(
      "Cannot interpolate computed values without a target element."
    );
  const o = q(t, r), n = q(e, r), u = $.includes(o.unit) ? n.unit : o.unit, a = I(s, o.value, n.value);
  return i.value = a, i.unit = u, i;
}
function pt(s, { start: t, stop: e, value: i }) {
  return t.value.keys().forEach((r) => {
    const o = t.value[r], n = e.value[r], u = o instanceof f ? o.value : o, a = n instanceof f ? n.value : n, c = I(s, u, a), l = i.value[r];
    l instanceof f ? l.value = c : i.value[r] = c;
  }), i;
}
function ge(s, { start: t, stop: e, value: i }) {
  return i.value = I(s, t.value, e.value), i;
}
function ye(s, t) {
  const e = t._lerp;
  if (e)
    return e(s, t), t;
  const { start: i, stop: r, computed: o } = t;
  return typeof i.value == "number" && typeof r.value == "number" ? t.value.value = I(s, i.value, r.value) : i.unit === "color" ? pt(s, t) : o && ft(s, t), t;
}
const Z = /* @__PURE__ */ new Map();
function we(s) {
  const t = nt(s), e = (r, o) => {
    const { childKey: n, mainKey: u } = de(r);
    if (o instanceof f)
      return P(
        new T(...v(o)),
        u,
        n
      );
    if (o instanceof U) {
      const p = o.values.flatMap(
        (y) => v(e(r, y))
      );
      return P(
        new T(...p),
        u,
        n
      );
    } else if (o instanceof T) {
      const p = o.flatMap(
        (y) => v(e(r, y))
      );
      return P(
        new T(...p),
        u,
        n
      );
    }
    const a = String(o), c = `${n}:${a}`, l = Z.get(c);
    if (l)
      return P(l.clone(), u, n);
    const h = F(
      C(
        W.FunctionArgs.map((p) => (p.setSubProperty(n), p)),
        W.Value
      ),
      a
    ), m = P(
      new T(...v(h)),
      u,
      n
    );
    return Z.set(c, m.clone()), m;
  };
  return Object.entries(t).reduce(
    (r, [o, n]) => (r[o] = e(o, n), r),
    {}
  );
}
const Ve = (s, t, e, i, r = "oklab", o) => {
  const n = i[t], u = i[e];
  if (!n || !u)
    throw new Error(
      `Invalid interpolation frame bounds (${t} -> ${e}).`
    );
  const a = n[s], c = u[s];
  if (!a || !c)
    throw new Error(`Missing variable "${s}" in interpolation bounds.`);
  const l = Math.max(a.length, c.length), h = (y) => {
    const b = y.map((S) => {
      if (!(S instanceof f))
        throw new TypeError(
          `Interpolation for "${s}" requires ValueUnit leaves.`
        );
      return S;
    });
    for (; b.length < l; )
      b.push(new f(0));
    return b;
  }, m = h(a), p = h(c);
  return m.map((y, b) => {
    const S = p[b];
    if (!S)
      throw new Error(
        `Missing right-hand interpolation value at index ${b}.`
      );
    if (!(y instanceof f) || !(S instanceof f))
      throw new TypeError(
        `Interpolation for "${s}" requires ValueUnit leaves.`
      );
    const O = me(y, S, r, o);
    return O._lerp = O.computed ? ft : O.start.unit === "color" ? pt : ge, O;
  });
};
function Te(s, t, e) {
  const [i, r] = [s.start, t.start];
  return {
    start: i.value * e / 100,
    stop: r.value * e / 100
  };
}
function mt(s, t, e = !0) {
  s = e ? s : nt(s);
  const i = ot(s);
  t.forEach((r) => {
    Object.entries(i).forEach(([o, n]) => {
      r.style.setProperty(o, n);
    });
  });
}
const be = (s) => s;
class Se {
  keyframes;
  segments;
  positions;
  timingFn;
  result;
  _duration;
  // Playback state
  _rafId = null;
  _resolve = null;
  _startTime = void 0;
  constructor(t, e) {
    if (t.length < 2)
      throw new Error(
        "NumericAnimation requires at least 2 keyframes."
      );
    if (this.keyframes = t.map((i) => ({ ...i })), this._duration = e?.duration ?? 0, this.timingFn = (e?.timingFunction ? M(e.timingFunction) : void 0) ?? be, e?.positions) {
      if (e.positions.length !== t.length)
        throw new Error(
          "positions length must match keyframes length."
        );
      this.positions = e.positions;
    } else
      this.positions = t.map(
        (i, r) => r / (t.length - 1) * 100
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
    const e = this.keyframes[t], i = this.keyframes[t + 1], r = Object.keys(e);
    return {
      startPos: this.positions[t],
      stopPos: this.positions[t + 1],
      keys: r,
      startVals: r.map((o) => e[o]),
      stopVals: r.map((o) => i[o]),
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
    const e = E(t, 0, 1) * 100;
    let i = lt(
      this.segments,
      e,
      (u) => u.startPos,
      (u) => u.stopPos
    );
    i === -1 && (i = this.segments.length - 1);
    const r = this.segments[i], o = at(
      E(e, r.startPos, r.stopPos),
      r.startPos,
      r.stopPos,
      0,
      1
    ), n = r.timingFunction(o);
    for (let u = 0; u < r.keys.length; u++)
      this.result[r.keys[u]] = I(
        n,
        r.startVals[u],
        r.stopVals[u]
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
    const i = e ?? this._duration;
    if (i <= 0)
      throw new Error(
        "NumericAnimation.play() requires a duration > 0. Pass it in the constructor options or as a parameter to play()."
      );
    return this.stop(), new Promise((r) => {
      this._resolve = r, this._startTime = void 0;
      const o = (n) => {
        this._startTime === void 0 && (this._startTime = n);
        const u = E((n - this._startTime) / i, 0, 1), a = this.at(u);
        t?.(a), u < 1 ? this._rafId = w(o) : this._cleanup();
      };
      this._rafId = w(o);
    });
  }
  /** Cancel a running `.play()` animation. The play promise resolves immediately. */
  stop() {
    this._rafId !== null && k(this._rafId), this._cleanup();
  }
  _cleanup() {
    this._rafId = null, this._startTime = void 0;
    const t = this._resolve;
    this._resolve = null, t?.();
  }
}
const ve = {
  damping: 0.1,
  snapThreshold: 1e-3,
  targetEpsilon: 0,
  initial: 0,
  clamp: !0
};
class Fe {
  options;
  targetValue;
  currentValue;
  isSettled;
  constructor(t) {
    this.options = { ...ve, ...t }, this.targetValue = this.options.initial, this.currentValue = this.options.initial, this.isSettled = !0;
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
const Q = (s) => {
  if (s instanceof HTMLElement) {
    const t = s.getBoundingClientRect();
    return { x: t.x, y: t.y, width: t.width, height: t.height };
  }
  return s;
};
class Ue {
  animation;
  transformOrigin;
  timingFunction;
  duration;
  constructor(t, e, i) {
    this.transformOrigin = i?.transformOrigin ?? "top left", this.timingFunction = i?.timingFunction, this.duration = i?.duration ?? 0, this.measure(t, e);
  }
  /** Re-measure source and destination, rebuilding the internal animation. */
  measure(t, e) {
    const i = Q(t), r = Q(e), o = r.x - i.x, n = r.y - i.y, u = i.width === 0 ? 1 : r.width / i.width, a = i.height === 0 ? 1 : r.height / i.height;
    return this.animation = new Se(
      [
        { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
        { translateX: o, translateY: n, scaleX: u, scaleY: a }
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
    const { translateX: e, translateY: i, scaleX: r, scaleY: o } = this.animation.at(t);
    return `translate(${e}px, ${i}px) scale(${r}, ${o})`;
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
    return this.animation.play((i) => {
      const { translateX: r, translateY: o, scaleX: n, scaleY: u } = i;
      t.style.transform = `translate(${r}px, ${o}px) scale(${n}, ${u})`, t.style.transformOrigin = this.transformOrigin;
    }, e ?? this.duration);
  }
  /** Cancel a running `.play()` animation. */
  stop() {
    this.animation.stop();
  }
}
const Ie = (s) => {
  if (s == null) return null;
  if (typeof s == "function") return s;
  const t = rt[s];
  return typeof t == "function" && t.length <= 1 ? t : null;
}, Pe = (s) => Math.max(0, Math.min(1, s));
class dt {
  smoother;
  easingFn;
  currentProgress = 0;
  boundaryEpsilon;
  constructor(t) {
    this.easingFn = Ie(t?.easing), this.boundaryEpsilon = t?.boundaryEpsilon ?? 5e-3, t?.smoothing === !1 ? this.smoother = null : this.smoother = new Fe(
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
    let t = Pe(this.sample());
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
  /** Advance one frame. Applies easing → boundary snap → smoothing. */
  tick() {
    const t = this.applyPipeline();
    return this.smoother && t > 0 && t < 1 ? (this.smoother.setTarget(t), this.smoother.tick(), this.currentProgress = this.smoother.current) : this.finalizeProgress(t), this.currentProgress;
  }
  /** Frame-rate independent variant. `dt` in milliseconds. */
  tickDt(t) {
    const e = this.applyPipeline();
    return this.smoother && e > 0 && e < 1 ? (this.smoother.setTarget(e), this.smoother.tickDt(t), this.currentProgress = this.smoother.current) : this.finalizeProgress(e), this.currentProgress;
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
class $e extends dt {
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
class De extends dt {
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
const Ee = (s) => typeof s.transform == "function", J = (s) => typeof s == "string" && $.includes(s);
function Ce(s) {
  if (!s.targets || s.targets.length === 0)
    return !1;
  const t = Ee(s) ? s.transform : void 0;
  for (const e of s.frames) {
    const i = e.transform;
    if (i !== mt && i !== t)
      return !1;
  }
  if (s.frames.length > 1) {
    const e = s.frames[0].timingFunction;
    for (let i = 1; i < s.frames.length; i++)
      if (s.frames[i].timingFunction !== e)
        return !1;
  }
  for (const e of s.frames)
    for (const i of Object.values(e.interpVars))
      for (const r of i) {
        const o = r.start?.unit, n = r.stop?.unit;
        if (J(o) || J(n))
          return !1;
      }
  for (const e of s.frames)
    for (const i of Object.values(e.interpVars))
      for (const r of i)
        if (r.start?.unit === "color" || r.stop?.unit === "color")
          return !1;
  return !0;
}
function Oe(s) {
  const t = s.options.duration, e = [], i = /* @__PURE__ */ new Set();
  for (const o of s.frames)
    i.add(o.time.start), i.add(o.time.stop);
  const r = [...i].sort((o, n) => o - n);
  for (const o of r) {
    const n = s.interpFrames(o, !1);
    if (Object.keys(n).length === 0) continue;
    const u = ot(n), a = {
      offset: Math.max(0, Math.min(1, o / t)),
      ...u
    };
    e.push(a);
  }
  return e;
}
function _e(s) {
  const t = s.options, e = {
    normal: "normal",
    reverse: "reverse",
    alternate: "alternate",
    "alternate-reverse": "alternate-reverse"
  }, i = {
    none: "none",
    forwards: "forwards",
    backwards: "backwards",
    both: "both"
  };
  return {
    duration: t.duration,
    delay: t.delay,
    iterations: t.iterationCount === 1 / 0 ? 1 / 0 : t.iterationCount,
    // TODO(HIGH): Remove enum fallbacks; throw when direction/fill values are outside supported WAAPI maps.
    direction: e[t.direction] ?? "normal",
    fill: i[t.fillMode] ?? "forwards",
    // WAAPI easing is set per-animation — we use the frame's timing function name
    // For custom functions we fall back to linear (the JS interpolation handles easing)
    easing: "linear"
  };
}
async function ke(s) {
  const t = Oe(s), e = _e(s), i = [];
  for (const r of s.targets) {
    const o = r.animate(t, e);
    i.push(o);
  }
  return await Promise.all(i.map((r) => r.finished)), i;
}
const Me = (s) => typeof s != "object" || s == null ? !1 : typeof s.clone == "function", x = (s) => typeof s == "string" ? s : s.name ?? String(s.id);
let Ae = 0;
class gt {
  id = Ae++;
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
  prevTime = 0;
  t = 0;
  iteration = 0;
  started = !1;
  done = !1;
  reversed = !1;
  paused = !1;
  /** When true, this animation is managed by an AnimationGroup and should not run its own rAF loop. */
  managed = !1;
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
  constructor(t, e, i, r) {
    this.options = {}, this.setOptions({ ...te, ...t ?? {} }), this.targets = e == null ? [] : Array.isArray(e) ? e : [e], this.name = i, this.superKey = r;
  }
  convertFrameStart(t) {
    if (t.start.unit === "s" || t.start.unit === "ms" || !t.start.unit) {
      const e = t.start.unit === "s" ? "s" : "ms", i = it(t.start.value, e);
      t.start.value = i / this.options.duration * 100, t.start.unit = "%";
    }
    return t.start.value = E(t.start.value, 0, 100), t;
  }
  addFrame(t, e, i, r) {
    typeof t == "number" ? t = String(t) + "%" : typeof t == "string" ? t = t : t instanceof f && (t = String(t));
    const o = st(t);
    let n = {
      id: this.frameId,
      start: o,
      vars: e,
      transform: i,
      timingFunction: M(r) ?? this.options.timingFunction
    };
    return this.convertFrameStart(
      n
    ), this.templateFrames.push(
      n
    ), this.frameId += 1, this;
  }
  createFrame(t, e) {
    const i = this.templateFrames[t], r = this.templateFrames[e], o = {
      start: t,
      stop: e
    }, n = Te(i, r, this.options.duration);
    let u = i.transform;
    if (u == null) {
      const l = B(
        t,
        this.frames,
        (h) => h.transform != null
      );
      u = this.frames[l].transform;
    }
    let a = i.timingFunction;
    if (a == null) {
      const l = B(
        t,
        this.frames,
        (h) => h.timingFunction != null
      );
      a = this.frames[l].timingFunction;
    }
    return {
      id: this.frameId++,
      ixs: o,
      start: i.start,
      time: n,
      vars: void 0,
      flatVars: void 0,
      interpVars: {},
      allInterpVars: [],
      transform: u,
      timingFunction: a
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
      for (const i of Object.keys(this.parsedVars[e])) {
        let r = t.get(i);
        r || (r = [], t.set(i, r)), r.push(e);
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
    const i = this.parsedVars[t];
    if (i)
      for (const r of Object.keys(i)) {
        const o = e.get(r);
        if (!o) continue;
        let n = -1;
        for (const h of o)
          if (h > t) {
            n = h;
            break;
          }
        if (n === -1) continue;
        const [u, a] = [t, n], c = this.frames.findIndex(
          (h) => h.ixs.start === u && h.ixs.stop === a
        ), l = c !== -1 ? this.frames[c] : this.createFrame(u, a);
        l.interpVars[r] = Ve(
          r,
          u,
          a,
          this.parsedVars,
          this.options.colorSpace,
          this.options.hueMethod
        ), c === -1 && this.frames.push(l);
      }
  }
  parse() {
    this.frames = [], this.templateFrames.sort((e, i) => e.start.value - i.start.value), this.parsedVars = this.templateFrames.map((e) => {
      const i = we(
        e.vars
      );
      return Object.values(i).forEach((r) => {
        r.setTargets(this.targets);
      }), i;
    });
    for (let e = 0; e < this.templateFrames.length - 1; e++)
      this.frames.push(this.createFrame(e, e + 1));
    const t = this.buildVarIndex();
    return this.frames.forEach((e, i) => this.reconcileVars(i, t)), this.frames.sort((e, i) => e.time.start === i.time.start ? e.time.stop - i.time.stop : e.time.start - i.time.start), this.frames = this.frames.filter(
      (e) => e.interpVars != null && Object.keys(e.interpVars).length > 0
    ), this.frames.forEach((e) => {
      const i = Object.entries(e.interpVars).reduce((r, [o, n]) => (r[o] = n.map((u) => u.value), r), {});
      e.flatVars = i, e.vars = Ot(e.flatVars), e.allInterpVars = Object.values(e.interpVars).flat();
    }), this;
  }
  setTimingFunction(t) {
    return this.options.timingFunction = M(t) ?? et, this;
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
    typeof t == "string" && (t = L(t));
    const e = t ?? this.options.duration;
    if (!isFinite(e) || e <= 0) return this;
    const i = this.options.duration, r = e / i;
    for (let o = 0; o < this.frames.length; o++) {
      const n = this.frames[o];
      n.time.start *= r, n.time.stop *= r;
    }
    return this.options.duration = e, this;
  }
  setDelay(t) {
    return typeof t == "string" && (t = L(t)), this.options.delay = t ?? 0, this;
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
    const i = this.reversed;
    this.reversed = !1;
    const r = E(t, 0, 1) * this.options.duration, o = this.interpFrames(r, e);
    return this.reversed = i, o;
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
    const i = {}, r = this.frames, o = r.length, n = lt(
      r,
      t,
      (a) => a.time.start,
      (a) => a.time.stop
    );
    if (n === -1) return i;
    const u = (a) => {
      const { start: c, stop: l } = a.time, h = at(t, c, l, 0, 1), m = a.timingFunction(h);
      for (const p of a.allInterpVars)
        ye(m, p);
      e && a.transform(
        this.unflatten ? a.vars : a.flatVars,
        t
      ), Object.assign(i, a.flatVars);
    };
    for (let a = n; a >= 0; a--) {
      const c = r[a];
      if (t < c.time.start || t > c.time.stop) break;
      u(c);
    }
    for (let a = n + 1; a < o; a++) {
      const c = r[a];
      if (t < c.time.start || t > c.time.stop) break;
      u(c);
    }
    return i;
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" && this.iteration % 2 === 0 || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.paused = !0, await _t(this.options.delay), this.paused = !1), this.started = !0;
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
    this.managed || (t = await this.tick(t), !this.paused && (this.interpFrames(t, !0), this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = w(this._boundDraw)));
  }
  /** Internal rAF-based play loop. */
  _playRAF() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = w(this._boundDraw);
    });
  }
  /** Play via the Web Animations API for compositor-thread execution. */
  async _playWAAPI() {
    try {
      await ke(this), this.reset();
    } catch {
      return this._playRAF();
    }
  }
  async play() {
    if (this.managed)
      return;
    if (this._playingPromise) return this._playingPromise;
    let t;
    return this.options.useWAAPI && this.targets.length > 0 && typeof this.targets[0]?.animate == "function" && Ce(this) ? t = this._playWAAPI() : t = this._playRAF(), this._playingPromise = t, t.finally(() => {
      this._playingPromise = null;
    }), t;
  }
  pause(t = !0) {
    return this.paused && t ? this.resume() : (this.started && (this.paused = !0), this);
  }
  resume() {
    return this.started && this.paused && (this.paused = !1, this.handleId = w(this._boundDraw)), this;
  }
  stop() {
    k(this.handleId), this.reset();
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
      Object.values(e.interpVars).forEach((i) => {
        i.forEach(({ start: r, stop: o, value: n }) => {
          r.setTargets(this.targets), o.setTargets(this.targets), n.setTargets(this.targets);
        });
      });
    }), this;
  }
  group(...t) {
    return new se(this, ...t);
  }
}
class Ne extends gt {
  constructor(t, ...e) {
    super(t, e), this.unflatten = !1;
  }
  fromVars(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    for (let i = 0; i < t.length; i++) {
      const r = t[i], o = Math.round(i / (t.length - 1) * 100);
      this.addFrame(o, r, e);
    }
    return this.parse(), this;
  }
  fromKeyframes(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this), kt(t) && (t = new Map(Object.entries(t)));
    const i = t instanceof Map ? t.entries() : Object.entries(t);
    for (const [r, o] of i)
      this.addFrame(r, o, e);
    return this.parse(), this;
  }
  fromString(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    const i = Jt(t);
    for (const [r, o] of i.entries()) {
      const n = Object.fromEntries(
        Object.entries(o).map(([c, l]) => [
          c,
          Me(l) ? l.clone() : l
        ])
      ), u = n.animationTimingFunction ?? n.timingFunction;
      delete n.animationTimingFunction, delete n.timingFunction;
      const a = u ? M(u.toString()) : void 0;
      this.addFrame(r, n, e, a);
    }
    return this.parse(), this;
  }
  transform(t) {
    mt(t, this.targets);
  }
}
export {
  gt as Animation,
  se as AnimationGroup,
  Ye as CSSCubicBezier,
  Ne as CSSKeyframesAnimation,
  Ue as ElementMorph,
  De as ManualTimeline,
  Se as NumericAnimation,
  $e as ScrollTimeline,
  Fe as SmoothProgress,
  dt as Timeline,
  Be as bezierPresets,
  Re as bounceInEase,
  We as bounceInEaseHalf,
  Le as bounceInOutEase,
  Xe as bounceOutEase,
  He as bounceOutEaseHalf,
  Ge as cancelAnimationFrame,
  qe as clamp,
  Ze as cubicBezier,
  Qe as cubicBezierToSVG,
  Je as cubicBezierToString,
  ts as deCasteljau,
  es as easeInBounce,
  ss as easeInCirc,
  is as easeInCubic,
  rs as easeInExpo,
  ns as easeInOutCirc,
  os as easeInOutCubic,
  as as easeInOutExpo,
  us as easeInOutQuad,
  ls as easeInOutSine,
  cs as easeInQuad,
  hs as easeInSine,
  fs as easeOutCirc,
  ps as easeOutCubic,
  ms as easeOutExpo,
  ds as easeOutQuad,
  gs as easeOutSine,
  x as getAnimationId,
  ys as interpBezier,
  ws as jumpTerms,
  Vs as lerp,
  Ts as linear,
  bs as logerp,
  Ss as requestAnimationFrame,
  vs as scale,
  Fs as sleep,
  Is as smoothStep3,
  Ps as stepEnd,
  Es as stepStart,
  Cs as steppedEase,
  Os as timingFunctions
};
