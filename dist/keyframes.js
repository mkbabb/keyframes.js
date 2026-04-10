import { CSSFunction as st, ValueUnit as f, CSSValueUnit as A, identifier as B, hyphenToCamelCase as Vt, ValueArray as T, number as St, camelCaseToHyphen as Tt, memoize as y, tryParse as b, FunctionValue as z, easeInOutCubic as rt, lerp as I, requestAnimationFrame as V, cancelAnimationFrame as _, parseCSSValueUnit as it, unpackMatrixValues as bt, normalizeColorUnits as vt, COMPUTED_UNITS as K, convertToDPI as Ft, convertToMs as nt, convertToDegrees as Pt, convertToPixels as It, RESOLUTION_UNITS as Et, TIME_UNITS as kt, ANGLE_UNITS as Ct, LENGTH_UNITS as Ot, timingFunctions as ot, flattenObject as at, unflattenObjectToString as ut, clamp as k, scale as lt, seekPreviousValue as L, unflattenObject as _t, sleep as Mt, isObject as At } from "@mkbabb/value.js";
import { CSSCubicBezier as Ze, bezierPresets as qe, bounceInEase as Qe, bounceInEaseHalf as Je, bounceInOutEase as ts, bounceOutEase as es, bounceOutEaseHalf as ss, cancelAnimationFrame as rs, clamp as is, cubicBezier as ns, cubicBezierToSVG as os, cubicBezierToString as as, deCasteljau as us, easeInBounce as ls, easeInCirc as cs, easeInCubic as hs, easeInExpo as ps, easeInOutCirc as fs, easeInOutCubic as ms, easeInOutExpo as ds, easeInOutQuad as gs, easeInOutSine as ys, easeInQuad as ws, easeInSine as Vs, easeOutCirc as Ss, easeOutCubic as Ts, easeOutExpo as bs, easeOutQuad as vs, easeOutSine as Fs, interpBezier as Ps, jumpTerms as Is, lerp as Es, linear as ks, logerp as Cs, requestAnimationFrame as Os, scale as _s, sleep as Ms, smoothStep3 as As, stepEnd as xs, stepStart as js, steppedEase as Us, timingFunctions as $s } from "@mkbabb/value.js";
import { regex as x, string as g, all as j, any as S, whitespace as xt } from "@mkbabb/parse-that";
function ct(s, t, e, r) {
  let i = 0, n = s.length - 1;
  for (; i <= n; ) {
    const o = i + n >> 1, u = s[o];
    if (t < e(u)) n = o - 1;
    else if (t > r(u)) i = o + 1;
    else return o;
  }
  return -1;
}
const ht = x(/--[a-zA-Z_][a-zA-Z0-9_-]*/), jt = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ""), Ut = (s) => s.replace(/\s*!important/gi, ""), U = (s) => Ut(jt(s));
g("(");
g(")");
const $t = g(";"), Dt = g(":"), $ = g("{"), D = g("}"), Nt = g(","), Bt = g("."), p = xt, zt = (s) => {
  const t = [];
  for (const e of s.flat(1 / 0)) {
    if (e instanceof f || e instanceof z) {
      t.push(e);
      continue;
    }
    throw new TypeError(
      `Expected parsed CSS value node, got ${typeof e}.`
    );
  }
  return t;
}, Kt = st.Function, Rt = j($, x(/[^{}]+/), D).map(
  (s) => {
    const t = s.join(`
`), e = JSON.parse(t);
    return new f(e, "json");
  }
), R = S(
  A.Value,
  Kt,
  Rt,
  x(/[^\(\)\{\}\s,;]+/).map((s) => new f(s))
).trim(p), Yt = R.sepBy(p), Lt = S(
  ht,
  B.map((s) => Vt(s))
), pt = j(
  Lt.skip(Dt).trim(p),
  Yt.skip($t.opt()).trim(p)
).map((s) => {
  const [t, e] = s, r = new T(...zt(e));
  return r.setProperty(t), {
    [t]: r
  };
}), Wt = S(
  A.TimePercentage.trim(p).map((s) => s.toString()),
  St.map((s) => `${s}%`)
), Xt = Wt.sepBy(Nt).trim(p), ft = pt.many().trim(p).wrap($, D).map((s) => Object.assign({}, ...s)), Ht = g("@keyframes").trim(p).next(B), W = j(Xt, ft).map(
  ([s, t]) => s.reduce((e, r) => (e.set(r, t), e), /* @__PURE__ */ new Map())
), Y = S(
  Ht.next(W.many(1).trim(p).wrap($, D).trim(p)),
  W.many(1).trim(p)
).map((s) => s.reduce(
  (t, e) => {
    for (const [r, i] of e)
      t.has(r) ? t.set(r, { ...t.get(r), ...i }) : t.set(r, i);
    return t;
  },
  /* @__PURE__ */ new Map()
));
x(/"[^"]*"/).map(
  (s) => s.slice(1, -1)
);
S(
  g("true").map(() => !0),
  g("false").map(() => !1)
);
const Gt = pt.many().trim(p).wrap($, D).map((s) => {
  const t = Object.assign({}, ...s), e = {};
  if (t.syntax !== void 0) {
    const r = t.syntax, i = String(r).replace(/^"|"$/g, "");
    e.syntax = i;
  }
  if (t.inherits !== void 0) {
    const r = String(t.inherits).toLowerCase();
    e.inherits = r === "true";
  }
  return t.initialValue !== void 0 && (e.initialValue = t.initialValue), e;
}), Zt = j(
  g("@property").trim(p).next(ht.trim(p)),
  Gt
).map(([s, t]) => ({
  name: s,
  descriptor: t
})), qt = S(
  Zt.map((s) => ({
    kind: "property",
    name: s.name,
    descriptor: s.descriptor
  })),
  Y.map((s) => ({
    kind: "keyframes",
    map: s
  }))
), Qt = qt.sepBy(p).trim(p).map((s) => {
  const t = /* @__PURE__ */ new Map();
  let e = /* @__PURE__ */ new Map();
  for (const r of s)
    if (r.kind === "property")
      t.set(r.name, r.descriptor);
    else if (r.kind === "keyframes")
      for (const [i, n] of r.map.entries())
        e.set(i, n);
  return { properties: t, keyframes: e };
}), Jt = Bt.trim(p).next(B).trim(p), te = ft.map((s) => {
  const t = {};
  for (const [e, r] of Object.entries(s))
    if (e.includes("animation")) {
      const i = e.replace(/^animation/i, "").replace(/^\w/, (o) => o.toLowerCase()), n = Tt(r.toString());
      t[i] = n, delete s[e];
    }
  return {
    options: t,
    values: s
  };
}), ee = Jt.next(te), se = S(
  ee.map((s) => s),
  Y.map((s) => ({
    keyframes: s
  }))
), re = se.sepBy(p).map((s) => Object.assign({}, ...s)), X = {
  Value: R,
  FunctionArgs: st.FunctionArgs
}, ie = y(
  (s) => b(R, U(s))
), ne = y(
  (s) => b(Y, U(s))
), oe = y(
  (s) => b(Qt, U(s))
);
y((s) => {
  const t = b(
    re,
    U(s)
  ), e = {
    keyframes: t.keyframes
  };
  return t.options != null && (e.options = t.options), t.values != null && (e.values = t.values), e;
});
const Re = y(
  (s) => b(A.Percentage, String(s)).valueOf()
), H = y((s) => b(
  A.Time.map((t) => t.unit === "ms" ? t.value : t.unit === "s" ? t.value * 1e3 : t.value),
  s
));
y((s) => s >= 5e3 ? `${s / 1e3}s` : `${s}ms`);
y((s) => s === 1 / 0 ? "infinite" : String(s));
const ae = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: rt,
  useWAAPI: !0,
  colorSpace: "oklab"
}, ue = {
  zIndex: 0,
  weight: 1,
  blendMode: "replace",
  enabled: !0
}, O = (s) => typeof s != "object" || s == null ? !1 : "value" in s && typeof s.value == "number";
class le {
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
    for (const r of t) {
      let i, n;
      r instanceof wt ? i = r : (i = r.animation, n = r.layer), this.transform ??= i.frames[0].transform;
      const o = N(i);
      this.animations[o] = {
        values: {},
        animation: i,
        layer: { ...ue, ...n }
      }, i.managed = !0, e.push(i);
    }
    this.singleTarget = e.every(
      (r) => r.targets[0] === e[0]?.targets[0]
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
    for (const r of e)
      r.animation.setTargets(...t);
    return this.singleTarget = e.every(
      (r) => r.animation.targets[0] === e[0]?.animation.targets[0]
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
    const e = {}, r = this.getEntries();
    let i = !0;
    for (const n of r) {
      const { animation: o, values: u, layer: a } = n;
      if (i = i && o.done, !a.enabled) continue;
      if (!(o.done || o.paused)) {
        const l = o.interpFrames(o.t, !1);
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
              const d = e[l], m = h;
              O(d) && O(m) ? d.value = d.value + m.value : e[l] = h;
            } else
              e[l] = h;
          break;
        case "weighted":
          for (const [l, h] of Object.entries(c))
            if (l in e && a.weight < 1) {
              const d = e[l], m = h;
              O(d) && O(m) ? d.value = I(
                a.weight,
                d.value,
                m.value
              ) : e[l] = h;
            } else
              e[l] = h;
          break;
      }
    }
    return this.done = i, this.transform(e, t), e;
  }
  /**
   * Render the current animation state as a static frame.
   * Called on pause to ensure the visual matches the exact pause moment.
   * Handles both single-target (grouped blending) and multi-target
   * (per-child interpFrames) paths.
   */
  renderPauseFrame() {
    const t = this.getEntries(), e = this.lastTickTime || performance.now();
    for (const r of t) {
      const i = r.animation.interpFrames(r.animation.t, !1);
      this.singleTarget && Object.assign(r.values, i);
    }
    if (this.singleTarget)
      this.transformFramesGrouped(e);
    else
      for (const r of t)
        r.animation.interpFrames(r.animation.t, !0);
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
    for (const r of this.getEntries()) {
      const i = r.animation;
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
        for (const r of this.getEntries())
          r.animation.interpFrames(r.animation.t, !0), e = e && r.animation.done;
        this.done = e;
      }
      this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = V(this._boundDraw);
    }
  }
  /**
   * Start the animation group. Returns a promise that resolves
   * when all child animations complete (or on explicit stop/reset).
   */
  async play() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = V(this._boundDraw);
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
      const r = e.animation;
      this.paused ? (r.pause(!1), r.pausedTime === 0 && (r.pausedTime = t)) : r.paused = !1;
    }
    return this.paused ? (_(this.handleId), this.handleId = void 0, this.renderPauseFrame()) : this.handleId = V(this._boundDraw), this;
  }
  reset() {
    for (const t of this.getEntries()) {
      const e = t.animation;
      e.started && e.frames.length > 0 && e.interpFrames(0, !0), e.managed = !1, e.reset();
    }
    return this.started = !1, this.done = !1, this.paused = !1, this.lastTickTime = 0, this;
  }
  stop() {
    return _(this.handleId), this.handleId = void 0, this.reset(), this;
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
    const r = typeof t == "string" ? t : N(t), i = this.animations[r];
    return i && (Object.assign(i.layer, e), this.invalidateEntries()), this;
  }
  /** Convenience toggle for enabling/disabling a layer. Chainable. */
  setLayerEnabled(t, e) {
    return this.setLayerConfig(t, { enabled: e });
  }
  /** Read the layer config for an animation. */
  getLayerConfig(t) {
    const e = typeof t == "string" ? t : N(t);
    return this.animations[e]?.layer;
  }
}
const ce = /* @__PURE__ */ new Set([
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
]), he = (s) => typeof s == "string" && Ot.includes(s), pe = (s) => typeof s == "string" && Ct.includes(s), fe = (s) => typeof s == "string" && kt.includes(s), me = (s) => typeof s == "string" && Et.includes(s), G = (s) => typeof s == "string" && K.includes(s), de = (s) => ce.has(
  s
), ge = (s, t) => {
  if (typeof s != "number" || !Number.isFinite(s))
    throw new TypeError(
      `Expected numeric ${t}, got ${String(s)}.`
    );
  return s;
}, Z = (s) => {
  if (s.unit !== "color")
    throw new TypeError("Expected a color ValueUnit.");
  return s;
}, ye = (s) => s, q = /* @__PURE__ */ new WeakMap();
let we = 0;
const Ve = (s) => {
  let t = q.get(s);
  return t === void 0 && (t = we++, q.set(s, t)), t;
}, Q = y(
  (s, t) => (() => {
    if (!t)
      return s;
    if (s.unit === "var") {
      const i = getComputedStyle(t).getPropertyValue(
        s.value
      );
      return it(i);
    }
    if (s.unit === "calc" && s.property && s.subProperty && s.value && t) {
      const i = ye(t.style), n = i[s.property] ?? "", o = s.subProperty ? `${s.subProperty}(${s.toString()})` : s.toString();
      i[s.property] = o;
      const u = getComputedStyle(t).getPropertyValue(
        s.property
      );
      i[s.property] = n;
      const a = ie(u);
      if (a instanceof f)
        return a;
      if (a.name.startsWith("matrix")) {
        const c = bt(a);
        if (de(s.subProperty)) {
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
    keyFn: (s, t) => `${s.toString()}-${t ? Ve(t) : "null"}`,
    // Don't cache when the element is disconnected (e.g. inside a Teleport
    // defer DocumentFragment). Layout-dependent units like cqw/vh resolve
    // to 0 without a live DOM context.
    shouldCache: (s, t, e) => !e || e.isConnected
  }
), Se = (s, t, e = !1) => {
  if (s?.superType?.[0] !== t?.superType?.[0])
    return e ? [s, t] : [s.clone(), t.clone()];
  const r = (o) => {
    const u = o?.superType?.[0], a = ge(o.value, "ValueUnit");
    switch (u) {
      case "length":
        if (!he(o.unit))
          throw new TypeError(
            `Unsupported length unit: ${String(o.unit)}`
          );
        return {
          value: It(
            a,
            o.unit,
            o.targets?.[0]
          ),
          unit: "px"
        };
      case "angle":
        if (!pe(o.unit))
          throw new TypeError(
            `Unsupported angle unit: ${String(o.unit)}`
          );
        return {
          value: Pt(a, o.unit),
          unit: "deg"
        };
      case "time":
        if (!fe(o.unit))
          throw new TypeError(
            `Unsupported time unit: ${String(o.unit)}`
          );
        return {
          value: nt(a, o.unit),
          unit: "ms"
        };
      case "resolution":
        if (!me(o.unit))
          throw new TypeError(
            `Unsupported resolution unit: ${String(o.unit)}`
          );
        return {
          value: Ft(a, o.unit),
          unit: "dpi"
        };
      default:
        return {
          value: a,
          unit: typeof o.unit == "string" ? o.unit : ""
        };
    }
  }, [i, n] = [
    r(s),
    r(t)
  ];
  return e ? (s.value = i.value, s.unit = i.unit, t.value = n.value, t.unit = n.unit, [s, t]) : [
    new f(
      i.value,
      i.unit,
      s.superType,
      s.subProperty,
      s.property,
      s.targets
    ),
    new f(
      n.value,
      n.unit,
      t.superType,
      t.subProperty,
      t.property,
      t.targets
    )
  ];
};
function Te(s, t, e = "oklab", r) {
  s = s.coalesce(t), t = t.coalesce(s);
  const i = {
    start: s,
    stop: t,
    value: s.clone(),
    computed: !1
  };
  if (s.unit === "color" && t.unit === "color") {
    const [n, o] = vt(
      Z(s),
      Z(t),
      e,
      !1,
      !0,
      !1,
      r
    );
    i.start = n, i.stop = o, i.value = n.clone();
  }
  if (s.unit !== t.unit) {
    const [n, o] = Se(
      s,
      t,
      !0
    );
    i.start = n, i.stop = o, i.value = n.clone();
  }
  return i.computed = G(s.unit) || G(t.unit), i;
}
const P = (s) => {
  if (s instanceof f)
    return [s.clone()];
  if (s instanceof z)
    return s.values.flatMap((t) => P(t));
  if (s instanceof T)
    return s.flatMap((t) => P(t));
  throw new TypeError(
    `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof s}`
  );
}, be = (s) => {
  const t = s.split(".").pop(), e = s.split(".").shift();
  if (!t || !e)
    throw new Error(`Invalid flattened key: ${s}`);
  return { mainKey: e, childKey: t };
}, E = (s, t, e) => (s.setProperty(t), e !== t && s.setSubProperty(e), s), M = (s) => {
  if (typeof s == "string") {
    const t = ot[s];
    return typeof t == "function" && t.length <= 1 ? t : void 0;
  } else if (s == null)
    return;
  return s;
};
function mt(s, { start: t, stop: e, value: r }) {
  const i = t.targets?.[0] ?? e.targets?.[0];
  if (!i)
    throw new Error(
      "Cannot interpolate computed values without a target element."
    );
  const n = Q(t, i), o = Q(e, i), u = K.includes(n.unit) ? o.unit : n.unit, a = I(s, n.value, o.value);
  return r.value = a, r.unit = u, r;
}
function dt(s, { start: t, stop: e, value: r }) {
  return t.value.keys().forEach((i) => {
    const n = t.value[i], o = e.value[i], u = n instanceof f ? n.value : n, a = o instanceof f ? o.value : o, c = I(s, u, a), l = r.value[i];
    l instanceof f ? l.value = c : r.value[i] = c;
  }), r;
}
function ve(s, { start: t, stop: e, value: r }) {
  return r.value = I(s, t.value, e.value), r;
}
function Fe(s, t) {
  const e = t._lerp;
  if (e)
    return e(s, t), t;
  const { start: r, stop: i, computed: n } = t;
  return typeof r.value == "number" && typeof i.value == "number" ? t.value.value = I(s, r.value, i.value) : r.unit === "color" ? dt(s, t) : n && mt(s, t), t;
}
const J = /* @__PURE__ */ new Map();
function Pe(s) {
  const t = at(s), e = (i, n) => {
    const { childKey: o, mainKey: u } = be(i);
    if (n instanceof f)
      return E(
        new T(...P(n)),
        u,
        o
      );
    if (n instanceof z) {
      const m = n.values.flatMap(
        (w) => P(e(i, w))
      );
      return E(
        new T(...m),
        u,
        o
      );
    } else if (n instanceof T) {
      const m = n.flatMap(
        (w) => P(e(i, w))
      );
      return E(
        new T(...m),
        u,
        o
      );
    }
    const a = String(n), c = `${o}:${a}`, l = J.get(c);
    if (l)
      return E(l.clone(), u, o);
    const h = b(
      S(
        X.FunctionArgs.map((m) => (m.setSubProperty(o), m)),
        X.Value
      ),
      a
    ), d = E(
      new T(...P(h)),
      u,
      o
    );
    return J.set(c, d.clone()), d;
  };
  return Object.entries(t).reduce(
    (i, [n, o]) => (i[n] = e(n, o), i),
    {}
  );
}
const Ie = (s, t, e, r, i = "oklab", n) => {
  const o = r[t], u = r[e];
  if (!o || !u)
    throw new Error(
      `Invalid interpolation frame bounds (${t} -> ${e}).`
    );
  const a = o[s], c = u[s];
  if (!a || !c)
    throw new Error(`Missing variable "${s}" in interpolation bounds.`);
  const l = Math.max(a.length, c.length), h = (w) => {
    const v = w.map((F) => {
      if (!(F instanceof f))
        throw new TypeError(
          `Interpolation for "${s}" requires ValueUnit leaves.`
        );
      return F;
    });
    for (; v.length < l; )
      v.push(new f(0));
    return v;
  }, d = h(a), m = h(c);
  return d.map((w, v) => {
    const F = m[v];
    if (!F)
      throw new Error(
        `Missing right-hand interpolation value at index ${v}.`
      );
    if (!(w instanceof f) || !(F instanceof f))
      throw new TypeError(
        `Interpolation for "${s}" requires ValueUnit leaves.`
      );
    const C = Te(w, F, i, n);
    return C._lerp = C.computed ? mt : C.start.unit === "color" ? dt : ve, C;
  });
};
function Ee(s, t, e) {
  const [r, i] = [s.start, t.start];
  return {
    start: r.value * e / 100,
    stop: i.value * e / 100
  };
}
function gt(s, t, e = !0) {
  s = e ? s : at(s);
  const r = ut(s);
  t.forEach((i) => {
    Object.entries(r).forEach(([n, o]) => {
      i.style.setProperty(n, o);
    });
  });
}
const ke = (s) => s;
class Ce {
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
    if (this.keyframes = t.map((r) => ({ ...r })), this._duration = e?.duration ?? 0, this.timingFn = (e?.timingFunction ? M(e.timingFunction) : void 0) ?? ke, e?.positions) {
      if (e.positions.length !== t.length)
        throw new Error(
          "positions length must match keyframes length."
        );
      this.positions = e.positions;
    } else
      this.positions = t.map(
        (r, i) => i / (t.length - 1) * 100
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
    const e = this.keyframes[t], r = this.keyframes[t + 1], i = Object.keys(e);
    return {
      startPos: this.positions[t],
      stopPos: this.positions[t + 1],
      keys: i,
      startVals: i.map((n) => e[n]),
      stopVals: i.map((n) => r[n]),
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
    const e = k(t, 0, 1) * 100;
    let r = ct(
      this.segments,
      e,
      (u) => u.startPos,
      (u) => u.stopPos
    );
    r === -1 && (r = this.segments.length - 1);
    const i = this.segments[r], n = lt(
      k(e, i.startPos, i.stopPos),
      i.startPos,
      i.stopPos,
      0,
      1
    ), o = i.timingFunction(n);
    for (let u = 0; u < i.keys.length; u++)
      this.result[i.keys[u]] = I(
        o,
        i.startVals[u],
        i.stopVals[u]
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
    const r = e ?? this._duration;
    if (r <= 0)
      throw new Error(
        "NumericAnimation.play() requires a duration > 0. Pass it in the constructor options or as a parameter to play()."
      );
    return this.stop(), new Promise((i) => {
      this._resolve = i, this._startTime = void 0;
      const n = (o) => {
        this._startTime === void 0 && (this._startTime = o);
        const u = k((o - this._startTime) / r, 0, 1), a = this.at(u);
        t?.(a), u < 1 ? this._rafId = V(n) : this._cleanup();
      };
      this._rafId = V(n);
    });
  }
  /** Cancel a running `.play()` animation. The play promise resolves immediately. */
  stop() {
    this._rafId !== null && _(this._rafId), this._cleanup();
  }
  _cleanup() {
    this._rafId = null, this._startTime = void 0;
    const t = this._resolve;
    this._resolve = null, t?.();
  }
}
const Oe = {
  damping: 0.1,
  snapThreshold: 1e-3,
  targetEpsilon: 0,
  initial: 0,
  clamp: !0
};
class _e {
  options;
  targetValue;
  currentValue;
  isSettled;
  constructor(t) {
    this.options = { ...Oe, ...t }, this.targetValue = this.options.initial, this.currentValue = this.options.initial, this.isSettled = !0;
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
const tt = (s) => {
  if (s instanceof HTMLElement) {
    const t = s.getBoundingClientRect();
    return { x: t.x, y: t.y, width: t.width, height: t.height };
  }
  return s;
};
class Ye {
  animation;
  transformOrigin;
  timingFunction;
  duration;
  constructor(t, e, r) {
    this.transformOrigin = r?.transformOrigin ?? "top left", this.timingFunction = r?.timingFunction, this.duration = r?.duration ?? 0, this.measure(t, e);
  }
  /** Re-measure source and destination, rebuilding the internal animation. */
  measure(t, e) {
    const r = tt(t), i = tt(e), n = i.x - r.x, o = i.y - r.y, u = r.width === 0 ? 1 : i.width / r.width, a = r.height === 0 ? 1 : i.height / r.height;
    return this.animation = new Ce(
      [
        { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
        { translateX: n, translateY: o, scaleX: u, scaleY: a }
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
    const { translateX: e, translateY: r, scaleX: i, scaleY: n } = this.animation.at(t);
    return `translate(${e}px, ${r}px) scale(${i}, ${n})`;
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
    return this.animation.play((r) => {
      const { translateX: i, translateY: n, scaleX: o, scaleY: u } = r;
      t.style.transform = `translate(${i}px, ${n}px) scale(${o}, ${u})`, t.style.transformOrigin = this.transformOrigin;
    }, e ?? this.duration);
  }
  /** Cancel a running `.play()` animation. */
  stop() {
    this.animation.stop();
  }
}
const Me = (s) => {
  if (s == null) return null;
  if (typeof s == "function") return s;
  const t = ot[s];
  return typeof t == "function" && t.length <= 1 ? t : null;
}, Ae = (s) => Math.max(0, Math.min(1, s));
class yt {
  smoother;
  easingFn;
  currentProgress = 0;
  boundaryEpsilon;
  constructor(t) {
    this.easingFn = Me(t?.easing), this.boundaryEpsilon = t?.boundaryEpsilon ?? 5e-3, t?.smoothing === !1 ? this.smoother = null : this.smoother = new _e(
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
    let t = Ae(this.sample());
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
class Le extends yt {
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
class We extends yt {
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
const xe = (s) => typeof s.transform == "function", et = (s) => typeof s == "string" && K.includes(s);
function je(s) {
  if (!s.targets || s.targets.length === 0)
    return !1;
  const t = xe(s) ? s.transform : void 0;
  for (const e of s.frames) {
    const r = e.transform;
    if (r !== gt && r !== t)
      return !1;
  }
  if (s.frames.length > 1) {
    const e = s.frames[0].timingFunction;
    for (let r = 1; r < s.frames.length; r++)
      if (s.frames[r].timingFunction !== e)
        return !1;
  }
  for (const e of s.frames)
    for (const r of Object.values(e.interpVars))
      for (const i of r) {
        const n = i.start?.unit, o = i.stop?.unit;
        if (et(n) || et(o))
          return !1;
      }
  for (const e of s.frames)
    for (const r of Object.values(e.interpVars))
      for (const i of r)
        if (i.start?.unit === "color" || i.stop?.unit === "color")
          return !1;
  return !0;
}
function Ue(s) {
  const t = s.options.duration, e = [], r = /* @__PURE__ */ new Set();
  for (const n of s.frames)
    r.add(n.time.start), r.add(n.time.stop);
  const i = [...r].sort((n, o) => n - o);
  for (const n of i) {
    const o = s.interpFrames(n, !1);
    if (Object.keys(o).length === 0) continue;
    const u = ut(o), a = {
      offset: Math.max(0, Math.min(1, n / t)),
      ...u
    };
    e.push(a);
  }
  return e;
}
function $e(s) {
  const t = s.options, e = {
    normal: "normal",
    reverse: "reverse",
    alternate: "alternate",
    "alternate-reverse": "alternate-reverse"
  }, r = {
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
    fill: r[t.fillMode] ?? "forwards",
    // WAAPI easing is set per-animation — we use the frame's timing function name
    // For custom functions we fall back to linear (the JS interpolation handles easing)
    easing: "linear"
  };
}
async function De(s) {
  const t = Ue(s), e = $e(s), r = [];
  for (const i of s.targets) {
    const n = i.animate(t, e);
    r.push(n);
  }
  return await Promise.all(r.map((i) => i.finished)), r;
}
const Ne = (s) => typeof s != "object" || s == null ? !1 : typeof s.clone == "function", N = (s) => typeof s == "string" ? s : s.name ?? String(s.id);
let Be = 0;
class wt {
  id = Be++;
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
  constructor(t, e, r, i) {
    this.options = {}, this.setOptions({ ...ae, ...t ?? {} }), this.targets = e == null ? [] : Array.isArray(e) ? e : [e], this.name = r, this.superKey = i;
  }
  convertFrameStart(t) {
    if (t.start.unit === "s" || t.start.unit === "ms" || !t.start.unit) {
      const e = t.start.unit === "s" ? "s" : "ms", r = nt(t.start.value, e);
      t.start.value = r / this.options.duration * 100, t.start.unit = "%";
    }
    return t.start.value = k(t.start.value, 0, 100), t;
  }
  addFrame(t, e, r, i) {
    typeof t == "number" ? t = String(t) + "%" : typeof t == "string" ? t = t : t instanceof f && (t = String(t));
    const n = it(t);
    let o = {
      id: this.frameId,
      start: n,
      vars: e,
      transform: r,
      timingFunction: M(i) ?? this.options.timingFunction
    };
    return this.convertFrameStart(
      o
    ), this.templateFrames.push(
      o
    ), this.frameId += 1, this;
  }
  createFrame(t, e) {
    const r = this.templateFrames[t], i = this.templateFrames[e], n = {
      start: t,
      stop: e
    }, o = Ee(r, i, this.options.duration);
    let u = r.transform;
    if (u == null) {
      const l = L(
        t,
        this.frames,
        (h) => h.transform != null
      );
      u = this.frames[l].transform;
    }
    let a = r.timingFunction;
    if (a == null) {
      const l = L(
        t,
        this.frames,
        (h) => h.timingFunction != null
      );
      a = this.frames[l].timingFunction;
    }
    return {
      id: this.frameId++,
      ixs: n,
      start: r.start,
      time: o,
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
      for (const r of Object.keys(this.parsedVars[e])) {
        let i = t.get(r);
        i || (i = [], t.set(r, i)), i.push(e);
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
    const r = this.parsedVars[t];
    if (r)
      for (const i of Object.keys(r)) {
        const n = e.get(i);
        if (!n) continue;
        let o = -1;
        for (const h of n)
          if (h > t) {
            o = h;
            break;
          }
        if (o === -1) continue;
        const [u, a] = [t, o], c = this.frames.findIndex(
          (h) => h.ixs.start === u && h.ixs.stop === a
        ), l = c !== -1 ? this.frames[c] : this.createFrame(u, a);
        l.interpVars[i] = Ie(
          i,
          u,
          a,
          this.parsedVars,
          this.options.colorSpace,
          this.options.hueMethod
        ), c === -1 && this.frames.push(l);
      }
  }
  parse() {
    this.frames = [], this.templateFrames.sort((e, r) => e.start.value - r.start.value), this.parsedVars = this.templateFrames.map((e) => {
      const r = Pe(
        e.vars
      );
      return Object.values(r).forEach((i) => {
        i.setTargets(this.targets);
      }), r;
    });
    for (let e = 0; e < this.templateFrames.length - 1; e++)
      this.frames.push(this.createFrame(e, e + 1));
    const t = this.buildVarIndex();
    return this.frames.forEach((e, r) => this.reconcileVars(r, t)), this.frames.sort((e, r) => e.time.start === r.time.start ? e.time.stop - r.time.stop : e.time.start - r.time.start), this.frames = this.frames.filter(
      (e) => e.interpVars != null && Object.keys(e.interpVars).length > 0
    ), this.frames.forEach((e) => {
      const r = Object.entries(e.interpVars).reduce((i, [n, o]) => (i[n] = o.map((u) => u.value), i), {});
      e.flatVars = r, e.vars = _t(e.flatVars), e.allInterpVars = Object.values(e.interpVars).flat();
    }), this;
  }
  setTimingFunction(t) {
    return this.options.timingFunction = M(t) ?? rt, this;
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
    typeof t == "string" && (t = H(t));
    const e = t ?? this.options.duration;
    if (!isFinite(e) || e <= 0) return this;
    const r = this.options.duration, i = e / r;
    for (let n = 0; n < this.frames.length; n++) {
      const o = this.frames[n];
      o.time.start *= i, o.time.stop *= i;
    }
    return this.options.duration = e, this;
  }
  setDelay(t) {
    return typeof t == "string" && (t = H(t)), this.options.delay = t ?? 0, this;
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
    const r = this.reversed;
    this.reversed = !1;
    const i = k(t, 0, 1) * this.options.duration, n = this.interpFrames(i, e);
    return this.reversed = r, n;
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
    const r = {}, i = this.frames, n = i.length, o = ct(
      i,
      t,
      (a) => a.time.start,
      (a) => a.time.stop
    );
    if (o === -1) return r;
    const u = (a) => {
      const { start: c, stop: l } = a.time, h = lt(t, c, l, 0, 1), d = a.timingFunction(h);
      for (const m of a.allInterpVars)
        Fe(d, m);
      e && a.transform(
        this.unflatten ? a.vars : a.flatVars,
        t
      ), Object.assign(r, a.flatVars);
    };
    for (let a = o; a >= 0; a--) {
      const c = i[a];
      if (t < c.time.start || t > c.time.stop) break;
      u(c);
    }
    for (let a = o + 1; a < n; a++) {
      const c = i[a];
      if (t < c.time.start || t > c.time.stop) break;
      u(c);
    }
    return r;
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" && this.iteration % 2 === 0 || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.paused = !0, await Mt(this.options.delay), this.paused = !1), this.started = !0;
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
    this.managed || (t = await this.tick(t), !this.paused && (this.interpFrames(t, !0), this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = V(this._boundDraw)));
  }
  /** Internal rAF-based play loop. */
  _playRAF() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = V(this._boundDraw);
    });
  }
  /** Play via the Web Animations API for compositor-thread execution. */
  async _playWAAPI() {
    try {
      await De(this), this.reset();
    } catch {
      return this._playRAF();
    }
  }
  async play() {
    if (this.managed)
      return;
    if (this._playingPromise) return this._playingPromise;
    let t;
    return this.options.useWAAPI && this.targets.length > 0 && typeof this.targets[0]?.animate == "function" && je(this) ? t = this._playWAAPI() : t = this._playRAF(), this._playingPromise = t, t.finally(() => {
      this._playingPromise = null;
    }), t;
  }
  pause(t = !0) {
    return this.paused && t ? this.resume() : (this.started && (this.paused = !0), this);
  }
  resume() {
    return this.started && this.paused && (this.paused = !1, this.handleId = V(this._boundDraw)), this;
  }
  stop() {
    _(this.handleId), this.reset();
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
      Object.values(e.interpVars).forEach((r) => {
        r.forEach(({ start: i, stop: n, value: o }) => {
          i.setTargets(this.targets), n.setTargets(this.targets), o.setTargets(this.targets);
        });
      });
    }), this;
  }
  group(...t) {
    return new le(this, ...t);
  }
}
class Xe extends wt {
  constructor(t, ...e) {
    super(t, e), this.unflatten = !1;
  }
  fromVars(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this);
    for (let r = 0; r < t.length; r++) {
      const i = t[r], n = Math.round(r / (t.length - 1) * 100);
      this.addFrame(n, i, e);
    }
    return this.parse(), this;
  }
  fromKeyframes(t, e) {
    this.unflatten = e != null, e ??= this.transform.bind(this), At(t) && (t = new Map(Object.entries(t)));
    const r = t instanceof Map ? t.entries() : Object.entries(t);
    for (const [i, n] of r)
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
    const i = /@property\b/i.test(t) ? (() => {
      const n = oe(t);
      return this.propertyRegistry = new Map(n.properties), n.keyframes;
    })() : ne(t);
    for (const [n, o] of i.entries()) {
      const u = Object.fromEntries(
        Object.entries(o).map(([l, h]) => [
          l,
          Ne(h) ? h.clone() : h
        ])
      ), a = u.animationTimingFunction ?? u.timingFunction;
      delete u.animationTimingFunction, delete u.timingFunction;
      const c = a ? M(a.toString()) : void 0;
      this.addFrame(n, u, e, c);
    }
    return this.parse(), this;
  }
  transform(t) {
    gt(t, this.targets);
  }
}
export {
  wt as Animation,
  le as AnimationGroup,
  Ze as CSSCubicBezier,
  Xe as CSSKeyframesAnimation,
  Ye as ElementMorph,
  We as ManualTimeline,
  Ce as NumericAnimation,
  Le as ScrollTimeline,
  _e as SmoothProgress,
  yt as Timeline,
  qe as bezierPresets,
  Qe as bounceInEase,
  Je as bounceInEaseHalf,
  ts as bounceInOutEase,
  es as bounceOutEase,
  ss as bounceOutEaseHalf,
  rs as cancelAnimationFrame,
  is as clamp,
  ns as cubicBezier,
  os as cubicBezierToSVG,
  as as cubicBezierToString,
  us as deCasteljau,
  ls as easeInBounce,
  cs as easeInCirc,
  hs as easeInCubic,
  ps as easeInExpo,
  fs as easeInOutCirc,
  ms as easeInOutCubic,
  ds as easeInOutExpo,
  gs as easeInOutQuad,
  ys as easeInOutSine,
  ws as easeInQuad,
  Vs as easeInSine,
  Ss as easeOutCirc,
  Ts as easeOutCubic,
  bs as easeOutExpo,
  vs as easeOutQuad,
  Fs as easeOutSine,
  N as getAnimationId,
  Ps as interpBezier,
  Is as jumpTerms,
  Es as lerp,
  ks as linear,
  Cs as logerp,
  ne as parseCSSKeyframes,
  Re as parseCSSPercent,
  oe as parseCSSStyleBlock,
  H as parseCSSTime,
  Os as requestAnimationFrame,
  _s as scale,
  Ms as sleep,
  As as smoothStep3,
  xs as stepEnd,
  js as stepStart,
  Us as steppedEase,
  $s as timingFunctions
};
