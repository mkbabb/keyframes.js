import { lerp as B, lerpIn as D, clamp as G } from "./math.js";
function I(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function S(e, t) {
  var r = Object.create(e.prototype);
  for (var a in t)
    r[a] = t[a];
  return r;
}
function w() {
}
var p = 0.7, N = 1 / p, b = "\\s*([+-]?\\d+)\\s*", y = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", x = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", J = /^#([0-9a-f]{3,8})$/, K = new RegExp(`^rgb\\(${b},${b},${b}\\)$`), Q = new RegExp(`^rgb\\(${x},${x},${x}\\)$`), U = new RegExp(`^rgba\\(${b},${b},${b},${y}\\)$`), X = new RegExp(`^rgba\\(${x},${x},${x},${y}\\)$`), Y = new RegExp(`^hsl\\(${y},${x},${x}\\)$`), Z = new RegExp(`^hsla\\(${y},${x},${x},${y}\\)$`), M = {
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
I(w, R, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: E,
  // Deprecated! Use color.formatHex.
  formatHex: E,
  formatHex8: ee,
  formatHsl: te,
  formatRgb: O,
  toString: O
});
function E() {
  return this.rgb().formatHex();
}
function ee() {
  return this.rgb().formatHex8();
}
function te() {
  return A(this).formatHsl();
}
function O() {
  return this.rgb().formatRgb();
}
function R(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = J.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? q(t) : r === 3 ? new o(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? F(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? F(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = K.exec(e)) ? new o(t[1], t[2], t[3], 1) : (t = Q.exec(e)) ? new o(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = U.exec(e)) ? F(t[1], t[2], t[3], t[4]) : (t = X.exec(e)) ? F(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Y.exec(e)) ? _(t[1], t[2] / 100, t[3] / 100, 1) : (t = Z.exec(e)) ? _(t[1], t[2] / 100, t[3] / 100, t[4]) : M.hasOwnProperty(e) ? q(M[e]) : e === "transparent" ? new o(NaN, NaN, NaN, 0) : null;
}
function q(e) {
  return new o(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function F(e, t, r, a) {
  return a <= 0 && (e = t = r = NaN), new o(e, t, r, a);
}
function re(e) {
  return e instanceof w || (e = R(e)), e ? (e = e.rgb(), new o(e.r, e.g, e.b, e.opacity)) : new o();
}
function ae(e, t, r, a) {
  return arguments.length === 1 ? re(e) : new o(e, t, r, a ?? 1);
}
function o(e, t, r, a) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +a;
}
I(o, ae, S(w, {
  brighter(e) {
    return e = e == null ? N : Math.pow(N, e), new o(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? p : Math.pow(p, e), new o(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new o(m(this.r), m(this.g), m(this.b), H(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: V,
  // Deprecated! Use color.formatHex.
  formatHex: V,
  formatHex8: ne,
  formatRgb: P,
  toString: P
}));
function V() {
  return `#${d(this.r)}${d(this.g)}${d(this.b)}`;
}
function ne() {
  return `#${d(this.r)}${d(this.g)}${d(this.b)}${d((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function P() {
  const e = H(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${m(this.r)}, ${m(this.g)}, ${m(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function H(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function m(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function d(e) {
  return e = m(e), (e < 16 ? "0" : "") + e.toString(16);
}
function _(e, t, r, a) {
  return a <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new c(e, t, r, a);
}
function A(e) {
  if (e instanceof c)
    return new c(e.h, e.s, e.l, e.opacity);
  if (e instanceof w || (e = R(e)), !e)
    return new c();
  if (e instanceof c)
    return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, a = e.b / 255, i = Math.min(t, r, a), n = Math.max(t, r, a), s = NaN, h = n - i, u = (n + i) / 2;
  return h ? (t === n ? s = (r - a) / h + (r < a) * 6 : r === n ? s = (a - t) / h + 2 : s = (t - r) / h + 4, h /= u < 0.5 ? n + i : 2 - n - i, s *= 60) : h = u > 0 && u < 1 ? 0 : s, new c(s, h, u, e.opacity);
}
function ie(e, t, r, a) {
  return arguments.length === 1 ? A(e) : new c(e, t, r, a ?? 1);
}
function c(e, t, r, a) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +a;
}
I(c, ie, S(w, {
  brighter(e) {
    return e = e == null ? N : Math.pow(N, e), new c(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? p : Math.pow(p, e), new c(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, a = r + (r < 0.5 ? r : 1 - r) * t, i = 2 * r - a;
    return new o(
      j(e >= 240 ? e - 240 : e + 120, i, a),
      j(e, i, a),
      j(e < 120 ? e + 240 : e - 120, i, a),
      this.opacity
    );
  },
  clamp() {
    return new c(T(this.h), k(this.s), k(this.l), H(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = H(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${T(this.h)}, ${k(this.s) * 100}%, ${k(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function T(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function k(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function j(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
async function se(e) {
  return await new Promise((t) => setTimeout(t, e));
}
function fe(e, t) {
  const r = parseFloat(e.slice(0, -1));
  return t ? {
    value: r / 100 * t,
    unit: "px"
  } : {
    value: r,
    unit: "%"
  };
}
function oe(e) {
  return {
    value: parseFloat(e.slice(0, -2)),
    unit: "px"
  };
}
function le(e) {
  return {
    value: parseFloat(e.slice(0, -3)),
    unit: "rem"
  };
}
function ce(e) {
  var t;
  if (typeof e == "number")
    return {
      value: e,
      unit: ""
    };
  if (e.endsWith("%"))
    return fe(e);
  if (e.endsWith("rem"))
    return le(e);
  if (e.endsWith("px"))
    return oe(e);
  {
    const r = (t = R(e)) == null ? void 0 : t.rgb();
    return r != null ? {
      value: r,
      unit: "color"
    } : {
      value: parseFloat(e),
      unit: ""
    };
  }
}
function L(e) {
  if (typeof e == "object") {
    const t = {};
    for (const [r, a] of Object.entries(e))
      t[r] = L(a);
    return t;
  }
  return ce(e);
}
function W(e) {
  if (typeof e == "object" && (e == null ? void 0 : e.value) == null && (e == null ? void 0 : e.unit) == null) {
    const a = {};
    for (const [i, n] of Object.entries(e))
      a[i] = W(n);
    return a;
  }
  const { value: t, unit: r } = e;
  if (r === "")
    return t;
  if (r === "color") {
    const a = t;
    return `rgb(${a.r}, ${a.g}, ${a.b})`;
  } else
    return `${t}${r}`;
}
function z(e, t, r) {
  if (typeof t == "object") {
    const a = {};
    for (const i of Object.keys(t))
      a[i] = z(e, t[i], r[i]);
    return a;
  } else if (typeof t == "number" && typeof r == "number")
    return B(e, t, r);
  return t;
}
function he(e) {
  function t(r) {
    e(r) || requestAnimationFrame(t);
  }
  requestAnimationFrame(t);
}
function C(e, t, r) {
  let [a, i] = [e.start, t.start];
  return a = a * r / 100, i = i * r / 100, {
    start: a,
    stop: i,
    distance: i - a
  };
}
function xe(e, t, r, a, i) {
  const [n, s] = [t[e], t[e + 1]], h = C(n, s, a), u = {}, $ = [
    .../* @__PURE__ */ new Set([...Object.keys(n.vars), ...Object.keys(s.vars)])
  ], g = (f, l, v) => ({
    start: r[l][f],
    stop: r[v][f]
  });
  return $.forEach((f) => {
    if (f in n.vars && f in s.vars)
      u[f] = g(f, e, e + 1);
    else if (!(f in n.vars) && f in s.vars) {
      for (let l = e - 1; l >= 0; l--)
        if (f in t[l].vars) {
          const v = i[l];
          v.time = C(
            t[l],
            s,
            a
          ), v.interpVarValues[f] = g(f, l, e + 1);
          break;
        }
    }
  }), {
    id: n.id,
    time: h,
    interpVarValues: u,
    transform: (n == null ? void 0 : n.transform) ?? (() => {
    }),
    ease: (n == null ? void 0 : n.ease) ?? D
  };
}
class de {
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
  ease(t) {
    return this.templateFrame !== void 0 && (this.templateFrame.ease = t), this;
  }
  done() {
    this.templateFrame !== void 0 && (this.templateFrames.push(this.templateFrame), this.templateFrame = void 0), this.templateFrames = this.templateFrames.sort(
      (r, a) => r.start > a.start ? 1 : -1
    );
    const t = this.templateFrames.map(
      (r) => L(r.vars)
    );
    for (let r = 0; r < this.templateFrames.length - 1; r++) {
      const a = xe(
        r,
        this.templateFrames,
        t,
        this.duration,
        this.frames
      );
      this.frames.push(a);
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
    return this.templateFrames.forEach((r, a) => {
      r.start = t[a].start, r.transform = t[a].transform, r.ease = t[a].ease;
    }), this.templateFrames.reverse(), this;
  }
  async start() {
    let t;
    return he((a) => {
      t === void 0 && (t = a);
      const i = G(a - t, 0, this.duration);
      return this.frames.filter(
        (n) => i >= n.time.start && i <= n.time.stop
      ).forEach((n) => {
        const { start: s, stop: h, distance: u } = n.time, $ = n.ease(i - s, 0, 1, u), g = {};
        Object.entries(n.interpVarValues).forEach(([f, l]) => {
          g[f] = z($, l.start, l.stop);
        }), n.transform($, W(g));
      }), i >= this.duration;
    }), await se(this.duration * 1.1);
  }
}
export {
  de as Animation,
  he as animationLoop,
  xe as parseTemplateFrame
};
//# sourceMappingURL=index.js.map
