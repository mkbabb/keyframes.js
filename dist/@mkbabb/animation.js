function K(e, t, r) {
  return e < t ? t : e > r ? r : e;
}
function U(e, t, r, n) {
  return r * (e /= n) * e + t;
}
function X(e, t, r, n) {
  return -r * (e /= n) * (e - 2) + t;
}
function Y(e, t, r, n) {
  return (e /= n / 2) < 1 ? r / 2 * e * e + t : -r / 2 * (--e * (e - 2) - 1) + t;
}
function Z(e, t, r, n) {
  return r * (e /= n) * e * e + t;
}
function ee(e, t, r, n) {
  return r * ((e = e / n - 1) * e * e + 1) + t;
}
function te(e, t, r, n) {
  return (e /= n / 2) < 1 ? r / 2 * e * e * e + t : r / 2 * ((e -= 2) * e * e + 2) + t;
}
function re(e, t, r, n) {
  return e /= n, r * Math.pow(e, 2) * (3 - 2 * e) + t;
}
function z(e, t, r, n) {
  return r * (e /= n) + t;
}
function A(e, t, r) {
  return (1 - e) * t + e * r;
}
function N(e, t) {
  const r = t.length - 1;
  let n = [...t];
  for (let a = 1; a <= r; a++)
    for (let i = 0; i <= r - a; i++)
      n[i] = A(e, n[i], n[i + 1]);
  return n[0];
}
function B(e, t, r, n, a) {
  return [N(e, [0, t, n, 1]), N(e, [0, r, a, 1])];
}
function ne(e, t) {
  const r = t.map((a) => a[0]), n = t.map((a) => a[1]);
  return [N(e, r), N(e, n)];
}
function ae(e, t, r, n) {
  return e = B(e / n, 0.09, 0.91, 0.5, 1.5)[1], r * e + t;
}
function Q(e, t, r, n) {
  return e = B(e / n, 0.19, -0.53, 0.83, 0.67)[1], r * e + t;
}
function ie(e, t, r, n) {
  const a = [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ];
  return e = ne(e / n, a)[1], r * e + t;
}
function R(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function W(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t)
    r[n] = t[n];
  return r;
}
function w() {
}
var p = 0.7, H = 1 / p, m = "\\s*([+-]?\\d+)\\s*", y = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", h = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", se = /^#([0-9a-f]{3,8})$/, fe = new RegExp(`^rgb\\(${m},${m},${m}\\)$`), oe = new RegExp(`^rgb\\(${h},${h},${h}\\)$`), le = new RegExp(`^rgba\\(${m},${m},${m},${y}\\)$`), ce = new RegExp(`^rgba\\(${h},${h},${h},${y}\\)$`), ue = new RegExp(`^hsl\\(${y},${h},${h}\\)$`), he = new RegExp(`^hsla\\(${y},${h},${h},${y}\\)$`), E = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
R(w, j, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: M,
  // Deprecated! Use color.formatHex.
  formatHex: M,
  formatHex8: xe,
  formatHsl: de,
  formatRgb: q,
  toString: q
});
function M() {
  return this.rgb().formatHex();
}
function xe() {
  return this.rgb().formatHex8();
}
function de() {
  return L(this).formatHsl();
}
function q() {
  return this.rgb().formatRgb();
}
function j(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = se.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? V(t) : r === 3 ? new o(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? F(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? F(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = fe.exec(e)) ? new o(t[1], t[2], t[3], 1) : (t = oe.exec(e)) ? new o(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = le.exec(e)) ? F(t[1], t[2], t[3], t[4]) : (t = ce.exec(e)) ? F(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ue.exec(e)) ? _(t[1], t[2] / 100, t[3] / 100, 1) : (t = he.exec(e)) ? _(t[1], t[2] / 100, t[3] / 100, t[4]) : E.hasOwnProperty(e) ? V(E[e]) : e === "transparent" ? new o(NaN, NaN, NaN, 0) : null;
}
function V(e) {
  return new o(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function F(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new o(e, t, r, n);
}
function be(e) {
  return e instanceof w || (e = j(e)), e ? (e = e.rgb(), new o(e.r, e.g, e.b, e.opacity)) : new o();
}
function me(e, t, r, n) {
  return arguments.length === 1 ? be(e) : new o(e, t, r, n ?? 1);
}
function o(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
R(o, me, W(w, {
  brighter(e) {
    return e = e == null ? H : Math.pow(H, e), new o(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? p : Math.pow(p, e), new o(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new o(b(this.r), b(this.g), b(this.b), I(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: C,
  // Deprecated! Use color.formatHex.
  formatHex: C,
  formatHex8: ge,
  formatRgb: P,
  toString: P
}));
function C() {
  return `#${d(this.r)}${d(this.g)}${d(this.b)}`;
}
function ge() {
  return `#${d(this.r)}${d(this.g)}${d(this.b)}${d((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function P() {
  const e = I(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${b(this.r)}, ${b(this.g)}, ${b(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function I(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function b(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function d(e) {
  return e = b(e), (e < 16 ? "0" : "") + e.toString(16);
}
function _(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new c(e, t, r, n);
}
function L(e) {
  if (e instanceof c)
    return new c(e.h, e.s, e.l, e.opacity);
  if (e instanceof w || (e = j(e)), !e)
    return new c();
  if (e instanceof c)
    return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, a = Math.min(t, r, n), i = Math.max(t, r, n), s = NaN, u = i - a, x = (i + a) / 2;
  return u ? (t === i ? s = (r - n) / u + (r < n) * 6 : r === i ? s = (n - t) / u + 2 : s = (t - r) / u + 4, u /= x < 0.5 ? i + a : 2 - i - a, s *= 60) : u = x > 0 && x < 1 ? 0 : s, new c(s, u, x, e.opacity);
}
function pe(e, t, r, n) {
  return arguments.length === 1 ? L(e) : new c(e, t, r, n ?? 1);
}
function c(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
R(c, pe, W(w, {
  brighter(e) {
    return e = e == null ? H : Math.pow(H, e), new c(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? p : Math.pow(p, e), new c(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, a = 2 * r - n;
    return new o(
      O(e >= 240 ? e - 240 : e + 120, a, n),
      O(e, a, n),
      O(e < 120 ? e + 240 : e - 120, a, n),
      this.opacity
    );
  },
  clamp() {
    return new c(T(this.h), k(this.s), k(this.l), I(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = I(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${T(this.h)}, ${k(this.s) * 100}%, ${k(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function T(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function k(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function O(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
async function ye(e) {
  return await new Promise((t) => setTimeout(t, e));
}
function we(e, t) {
  const r = parseFloat(e.slice(0, -1));
  return t ? {
    value: r / 100 * t,
    unit: "px"
  } : {
    value: r,
    unit: "%"
  };
}
function $e(e) {
  return {
    value: parseFloat(e.slice(0, -2)),
    unit: "px"
  };
}
function ve(e) {
  return {
    value: parseFloat(e.slice(0, -3)),
    unit: "rem"
  };
}
function Fe(e) {
  var t;
  if (typeof e == "number")
    return {
      value: e,
      unit: ""
    };
  if (e.endsWith("%"))
    return we(e);
  if (e.endsWith("rem"))
    return ve(e);
  if (e.endsWith("px"))
    return $e(e);
  {
    const r = (t = j(e)) == null ? void 0 : t.rgb();
    return r != null ? {
      value: r,
      unit: "color"
    } : {
      value: parseFloat(e),
      unit: ""
    };
  }
}
function D(e) {
  if (typeof e == "object") {
    const t = {};
    for (const [r, n] of Object.entries(e))
      t[r] = D(n);
    return t;
  }
  return Fe(e);
}
function G(e) {
  if (typeof e == "object" && (e == null ? void 0 : e.value) == null && (e == null ? void 0 : e.unit) == null) {
    const n = {};
    for (const [a, i] of Object.entries(e))
      n[a] = G(i);
    return n;
  }
  const { value: t, unit: r } = e;
  if (r === "")
    return t;
  if (r === "color") {
    const n = t;
    return `rgb(${n.r}, ${n.g}, ${n.b})`;
  } else
    return `${t}${r}`;
}
function J(e, t, r) {
  if (typeof t == "object") {
    const n = {};
    for (const a of Object.keys(t))
      n[a] = J(e, t[a], r[a]);
    return n;
  } else if (typeof t == "number" && typeof r == "number")
    return A(e, t, r);
  return t;
}
const He = {
  easeInQuad: U,
  easeOutQuad: X,
  easeInOutQuad: Y,
  easeInCubic: Z,
  easeOutCubic: ee,
  easeInOutCubic: te,
  easeInBounce: ae,
  bounceInEase: Q,
  bounceInEaseHalf: ie,
  smoothStep3: re,
  lerpIn: z
};
function ke(e) {
  function t(r) {
    e(r) || requestAnimationFrame(t);
  }
  requestAnimationFrame(t);
}
function S(e, t, r) {
  let [n, a] = [e.start, t.start];
  return n = n * r / 100, a = a * r / 100, {
    start: n,
    stop: a,
    distance: a - n
  };
}
function Ne(e, t, r, n, a) {
  const [i, s] = [t[e], t[e + 1]], u = S(i, s, n), x = {}, $ = [
    .../* @__PURE__ */ new Set([...Object.keys(i.vars), ...Object.keys(s.vars)])
  ], g = (f, l, v) => ({
    start: r[l][f],
    stop: r[v][f]
  });
  return $.forEach((f) => {
    if (f in i.vars && f in s.vars)
      x[f] = g(f, e, e + 1);
    else if (!(f in i.vars) && f in s.vars) {
      for (let l = e - 1; l >= 0; l--)
        if (f in t[l].vars) {
          const v = a[l];
          v.time = S(
            t[l],
            s,
            n
          ), v.interpVarValues[f] = g(f, l, e + 1);
          break;
        }
    }
  }), {
    id: i.id,
    time: u,
    interpVarValues: x,
    transform: (i == null ? void 0 : i.transform) ?? (() => {
    }),
    ease: (i == null ? void 0 : i.ease) ?? z
  };
}
class Ie {
  constructor(t) {
    this.duration = t, this.templateFrames = [], this.frames = [], this.frameId = 0, this.prevId = 0;
  }
  from(t, r) {
    return this.frameId > 0 && this.templateFrame !== void 0 && this.templateFrames.push(this.templateFrame), this.templateFrame = {
      id: this.frameId,
      start: t,
      vars: r
    }, this.prevId = this.frameId, this.frameId += 1, this;
  }
  transform(t) {
    return this.templateFrame !== void 0 && (this.templateFrame.transform = t), this;
  }
  ease(t = Q) {
    return this.templateFrame !== void 0 && (this.templateFrame.ease = t), this;
  }
  done() {
    this.templateFrame !== void 0 && (this.templateFrames.push(this.templateFrame), this.templateFrame = void 0), this.templateFrames = this.templateFrames.sort(
      (r, n) => r.start > n.start ? 1 : -1
    );
    const t = this.templateFrames.map(
      (r) => D(r.vars)
    );
    for (let r = 0; r < this.templateFrames.length - 1; r++) {
      const n = Ne(
        r,
        this.templateFrames,
        t,
        this.duration,
        this.frames
      );
      this.frames.push(n);
    }
    return this;
  }
  reverse() {
    this.templateFrame !== void 0 && (this.templateFrames.push(this.templateFrame), this.templateFrame = void 0);
    const t = this.templateFrames.map((r) => ({
      start: r.start,
      transform: r.transform,
      ease: r.ease
    })).reverse();
    return this.templateFrames.forEach((r, n) => {
      r.start = t[n].start, r.transform = t[n].transform, r.ease = t[n].ease;
    }), this.templateFrames.reverse(), this;
  }
  async start() {
    let t;
    return ke((n) => {
      t === void 0 && (t = n);
      const a = K(n - t, 0, this.duration);
      return this.frames.filter(
        (i) => a >= i.time.start && a <= i.time.stop
      ).forEach((i) => {
        const { start: s, stop: u, distance: x } = i.time, $ = i.ease(a - s, 0, 1, x), g = {};
        Object.entries(i.interpVarValues).forEach(([f, l]) => {
          g[f] = J($, l.start, l.stop);
        }), i.transform($, G(g));
      }), a >= this.duration;
    }), await ye(this.duration * 1.1);
  }
}
export {
  Ie as Animation,
  ke as animationLoop,
  He as easingFunctions,
  Ne as parseTemplateFrame
};
