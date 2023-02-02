function Me(t, n) {
  for (var i = 0; i < n.length; i++) {
    const o = n[i];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const c in o)
        if (c !== "default" && !(c in t)) {
          const s = Object.getOwnPropertyDescriptor(o, c);
          s && Object.defineProperty(t, c, s.get ? s : {
            enumerable: !0,
            get: () => o[c]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
function Ce(t, n, i, o = 0, c = 1) {
  const s = (c - o) / (i - n);
  return (t - n) * s + o;
}
function it(t, n, i) {
  return (1 - t) * n + t * i;
}
function _t(t, n) {
  const i = n.length - 1;
  let o = [...n];
  for (let c = 1; c <= i; c++)
    for (let s = 0; s <= i - c; s++)
      o[s] = it(t, o[s], o[s + 1]);
  return o[0];
}
function Le(t, n, i, o, c) {
  return [_t(t, [0, n, o, 1]), _t(t, [0, i, c, 1])];
}
function Te(t, n) {
  const i = n.map((c) => c[0]), o = n.map((c) => c[1]);
  return [_t(t, i), _t(t, o)];
}
function Ve(t) {
  return t * t;
}
function qe(t) {
  return -t * (t - 2);
}
function Ae(t) {
  return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
}
function Ie(t) {
  return t * t * t;
}
function He(t) {
  return (t = t - 1) * t * t + 1;
}
function le(t) {
  return (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
}
function Re(t) {
  return t * t * (3 - 2 * t);
}
const he = (t, n, i, o) => (c) => (c = Le(c, t, n, i, o)[1], c);
function ze(t) {
  return t = he(0.09, 0.91, 0.5, 1.5)(t), t;
}
function Ue(t) {
  return t = he(0.09, 0.91, 0.5, 1.5)(t), t;
}
function We(t) {
  return t = Te(t, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], t;
}
function qt(t, n, i) {
  t.prototype = n.prototype = i, i.constructor = t;
}
function pe(t, n) {
  var i = Object.create(t.prototype);
  for (var o in n)
    i[o] = n[o];
  return i;
}
function dt() {
}
var lt = 0.7, Pt = 1 / lt, st = "\\s*([+-]?\\d+)\\s*", ht = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", N = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", De = /^#([0-9a-f]{3,8})$/, Ke = new RegExp(`^rgb\\(${st},${st},${st}\\)$`), Ge = new RegExp(`^rgb\\(${N},${N},${N}\\)$`), Qe = new RegExp(`^rgba\\(${st},${st},${st},${ht}\\)$`), Ze = new RegExp(`^rgba\\(${N},${N},${N},${ht}\\)$`), Je = new RegExp(`^hsl\\(${ht},${N},${N}\\)$`), Xe = new RegExp(`^hsla\\(${ht},${N},${N},${ht}\\)$`), Jt = {
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
qt(dt, mt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Xt,
  // Deprecated! Use color.formatHex.
  formatHex: Xt,
  formatHex8: Ye,
  formatHsl: tn,
  formatRgb: Yt,
  toString: Yt
});
function Xt() {
  return this.rgb().formatHex();
}
function Ye() {
  return this.rgb().formatHex8();
}
function tn() {
  return de(this).formatHsl();
}
function Yt() {
  return this.rgb().formatRgb();
}
function mt(t) {
  var n, i;
  return t = (t + "").trim().toLowerCase(), (n = De.exec(t)) ? (i = n[1].length, n = parseInt(n[1], 16), i === 6 ? te(n) : i === 3 ? new $(n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, (n & 15) << 4 | n & 15, 1) : i === 8 ? Ot(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, (n & 255) / 255) : i === 4 ? Ot(n >> 12 & 15 | n >> 8 & 240, n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, ((n & 15) << 4 | n & 15) / 255) : null) : (n = Ke.exec(t)) ? new $(n[1], n[2], n[3], 1) : (n = Ge.exec(t)) ? new $(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, 1) : (n = Qe.exec(t)) ? Ot(n[1], n[2], n[3], n[4]) : (n = Ze.exec(t)) ? Ot(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, n[4]) : (n = Je.exec(t)) ? re(n[1], n[2] / 100, n[3] / 100, 1) : (n = Xe.exec(t)) ? re(n[1], n[2] / 100, n[3] / 100, n[4]) : Jt.hasOwnProperty(t) ? te(Jt[t]) : t === "transparent" ? new $(NaN, NaN, NaN, 0) : null;
}
function te(t) {
  return new $(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Ot(t, n, i, o) {
  return o <= 0 && (t = n = i = NaN), new $(t, n, i, o);
}
function en(t) {
  return t instanceof dt || (t = mt(t)), t ? (t = t.rgb(), new $(t.r, t.g, t.b, t.opacity)) : new $();
}
function nn(t, n, i, o) {
  return arguments.length === 1 ? en(t) : new $(t, n, i, o ?? 1);
}
function $(t, n, i, o) {
  this.r = +t, this.g = +n, this.b = +i, this.opacity = +o;
}
qt($, nn, pe(dt, {
  brighter(t) {
    return t = t == null ? Pt : Math.pow(Pt, t), new $(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? lt : Math.pow(lt, t), new $(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new $(D(this.r), D(this.g), D(this.b), Nt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ee,
  // Deprecated! Use color.formatHex.
  formatHex: ee,
  formatHex8: rn,
  formatRgb: ne,
  toString: ne
}));
function ee() {
  return `#${U(this.r)}${U(this.g)}${U(this.b)}`;
}
function rn() {
  return `#${U(this.r)}${U(this.g)}${U(this.b)}${U((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ne() {
  const t = Nt(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${D(this.r)}, ${D(this.g)}, ${D(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Nt(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function D(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function U(t) {
  return t = D(t), (t < 16 ? "0" : "") + t.toString(16);
}
function re(t, n, i, o) {
  return o <= 0 ? t = n = i = NaN : i <= 0 || i >= 1 ? t = n = NaN : n <= 0 && (t = NaN), new P(t, n, i, o);
}
function de(t) {
  if (t instanceof P)
    return new P(t.h, t.s, t.l, t.opacity);
  if (t instanceof dt || (t = mt(t)), !t)
    return new P();
  if (t instanceof P)
    return t;
  t = t.rgb();
  var n = t.r / 255, i = t.g / 255, o = t.b / 255, c = Math.min(n, i, o), s = Math.max(n, i, o), f = NaN, g = s - c, b = (s + c) / 2;
  return g ? (n === s ? f = (i - o) / g + (i < o) * 6 : i === s ? f = (o - n) / g + 2 : f = (n - i) / g + 4, g /= b < 0.5 ? s + c : 2 - s - c, f *= 60) : g = b > 0 && b < 1 ? 0 : f, new P(f, g, b, t.opacity);
}
function sn(t, n, i, o) {
  return arguments.length === 1 ? de(t) : new P(t, n, i, o ?? 1);
}
function P(t, n, i, o) {
  this.h = +t, this.s = +n, this.l = +i, this.opacity = +o;
}
qt(P, sn, pe(dt, {
  brighter(t) {
    return t = t == null ? Pt : Math.pow(Pt, t), new P(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? lt : Math.pow(lt, t), new P(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, n = isNaN(t) || isNaN(this.s) ? 0 : this.s, i = this.l, o = i + (i < 0.5 ? i : 1 - i) * n, c = 2 * i - o;
    return new $(
      Vt(t >= 240 ? t - 240 : t + 120, c, o),
      Vt(t, c, o),
      Vt(t < 120 ? t + 240 : t - 120, c, o),
      this.opacity
    );
  },
  clamp() {
    return new P(ie(this.h), Ft(this.s), Ft(this.l), Nt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Nt(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${ie(this.h)}, ${Ft(this.s) * 100}%, ${Ft(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function ie(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Ft(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Vt(t, n, i) {
  return (t < 60 ? n + (i - n) * t / 60 : t < 180 ? i : t < 240 ? n + (i - n) * (240 - t) / 60 : n) * 255;
}
var an = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function on(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var m = {}, un = {
  get exports() {
    return m;
  },
  set exports(t) {
    m = t;
  }
};
(function(t, n) {
  (function(i, o) {
    t.exports = o();
  })(typeof self < "u" ? self : an, function() {
    return function(i) {
      var o = {};
      function c(s) {
        if (o[s])
          return o[s].exports;
        var f = o[s] = { i: s, l: !1, exports: {} };
        return i[s].call(f.exports, f, f.exports, c), f.l = !0, f.exports;
      }
      return c.m = i, c.c = o, c.d = function(s, f, g) {
        c.o(s, f) || Object.defineProperty(s, f, { configurable: !1, enumerable: !0, get: g });
      }, c.r = function(s) {
        Object.defineProperty(s, "__esModule", { value: !0 });
      }, c.n = function(s) {
        var f = s && s.__esModule ? function() {
          return s.default;
        } : function() {
          return s;
        };
        return c.d(f, "a", f), f;
      }, c.o = function(s, f) {
        return Object.prototype.hasOwnProperty.call(s, f);
      }, c.p = "", c(c.s = 0);
    }([function(i, o, c) {
      function s(e) {
        if (!(this instanceof s))
          return new s(e);
        this._ = e;
      }
      var f = s.prototype;
      function g(e, r) {
        for (var a = 0; a < e; a++)
          r(a);
      }
      function b(e, r, a) {
        return function(u, l) {
          g(l.length, function(h) {
            u(l[h], h, l);
          });
        }(function(u, l, h) {
          r = e(r, u, l, h);
        }, a), r;
      }
      function k(e, r) {
        return b(function(a, u, l, h) {
          return a.concat([e(u, l, h)]);
        }, [], r);
      }
      function q(e, r) {
        var a = { v: 0, buf: r };
        return g(e, function() {
          var u;
          a = { v: a.v << 1 | (u = a.buf, u[0] >> 7), buf: function(l) {
            var h = b(function(p, d, x, S) {
              return p.concat(x === S.length - 1 ? Buffer.from([d, 0]).readUInt16BE(0) : S.readUInt16BE(x));
            }, [], l);
            return Buffer.from(k(function(p) {
              return (p << 1 & 65535) >> 8;
            }, h));
          }(a.buf) };
        }), a;
      }
      function K() {
        return typeof Buffer < "u";
      }
      function A() {
        if (!K())
          throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function G(e) {
        A();
        var r = b(function(h, p) {
          return h + p;
        }, 0, e);
        if (r % 8 != 0)
          throw new Error("The bits [" + e.join(", ") + "] add up to " + r + " which is not an even number of bytes; the total should be divisible by 8");
        var a, u = r / 8, l = (a = function(h) {
          return h > 48;
        }, b(function(h, p) {
          return h || (a(p) ? p : h);
        }, null, e));
        if (l)
          throw new Error(l + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new s(function(h, p) {
          var d = u + p;
          return d > h.length ? O(p, u.toString() + " bytes") : v(d, b(function(x, S) {
            var E = q(S, x.buf);
            return { coll: x.coll.concat(E.v), buf: E.buf };
          }, { coll: [], buf: h.slice(p, d) }, e).coll);
        });
      }
      function w(e, r) {
        return new s(function(a, u) {
          return A(), u + r > a.length ? O(u, r + " bytes for " + e) : v(u + r, a.slice(u, u + r));
        });
      }
      function j(e, r) {
        if (typeof (a = r) != "number" || Math.floor(a) !== a || r < 0 || r > 6)
          throw new Error(e + " requires integer length in range [0, 6].");
        var a;
      }
      function M(e) {
        return j("uintBE", e), w("uintBE(" + e + ")", e).map(function(r) {
          return r.readUIntBE(0, e);
        });
      }
      function Q(e) {
        return j("uintLE", e), w("uintLE(" + e + ")", e).map(function(r) {
          return r.readUIntLE(0, e);
        });
      }
      function gt(e) {
        return j("intBE", e), w("intBE(" + e + ")", e).map(function(r) {
          return r.readIntBE(0, e);
        });
      }
      function xt(e) {
        return j("intLE", e), w("intLE(" + e + ")", e).map(function(r) {
          return r.readIntLE(0, e);
        });
      }
      function at(e) {
        return e instanceof s;
      }
      function Z(e) {
        return {}.toString.call(e) === "[object Array]";
      }
      function ot(e) {
        return K() && Buffer.isBuffer(e);
      }
      function v(e, r) {
        return { status: !0, index: e, value: r, furthest: -1, expected: [] };
      }
      function O(e, r) {
        return Z(r) || (r = [r]), { status: !1, index: -1, value: null, furthest: e, expected: r };
      }
      function B(e, r) {
        if (!r || e.furthest > r.furthest)
          return e;
        var a = e.furthest === r.furthest ? function(u, l) {
          if (function() {
            if (s._supportsSet !== void 0)
              return s._supportsSet;
            var T = typeof Set < "u";
            return s._supportsSet = T, T;
          }() && Array.from) {
            for (var h = new Set(u), p = 0; p < l.length; p++)
              h.add(l[p]);
            var d = Array.from(h);
            return d.sort(), d;
          }
          for (var x = {}, S = 0; S < u.length; S++)
            x[u[S]] = !0;
          for (var E = 0; E < l.length; E++)
            x[l[E]] = !0;
          var L = [];
          for (var F in x)
            ({}).hasOwnProperty.call(x, F) && L.push(F);
          return L.sort(), L;
        }(e.expected, r.expected) : r.expected;
        return { status: e.status, index: e.index, value: e.value, furthest: r.furthest, expected: a };
      }
      var bt = {};
      function At(e, r) {
        if (ot(e))
          return { offset: r, line: -1, column: -1 };
        e in bt || (bt[e] = {});
        for (var a = bt[e], u = 0, l = 0, h = 0, p = r; p >= 0; ) {
          if (p in a) {
            u = a[p].line, h === 0 && (h = a[p].lineStart);
            break;
          }
          (e.charAt(p) === `
` || e.charAt(p) === "\r" && e.charAt(p + 1) !== `
`) && (l++, h === 0 && (h = p + 1)), p--;
        }
        var d = u + l, x = r - h;
        return a[r] = { line: d, lineStart: h }, { offset: r, line: d + 1, column: x + 1 };
      }
      function J(e) {
        if (!at(e))
          throw new Error("not a parser: " + e);
      }
      function wt(e, r) {
        return typeof e == "string" ? e.charAt(r) : e[r];
      }
      function X(e) {
        if (typeof e != "number")
          throw new Error("not a number: " + e);
      }
      function I(e) {
        if (typeof e != "function")
          throw new Error("not a function: " + e);
      }
      function ut(e) {
        if (typeof e != "string")
          throw new Error("not a string: " + e);
      }
      var be = 2, we = 3, V = 8, ve = 5 * V, ye = 4 * V, It = "  ";
      function vt(e, r) {
        return new Array(r + 1).join(e);
      }
      function yt(e, r, a) {
        var u = r - e.length;
        return u <= 0 ? e : vt(a, u) + e;
      }
      function Ht(e, r, a, u) {
        return { from: e - r > 0 ? e - r : 0, to: e + a > u ? u : e + a };
      }
      function Ee(e, r) {
        var a, u, l, h, p, d = r.index, x = d.offset, S = 1;
        if (x === e.length)
          return "Got the end of the input";
        if (ot(e)) {
          var E = x - x % V, L = x - E, F = Ht(E, ve, ye + V, e.length), T = k(function(y) {
            return k(function(tt) {
              return yt(tt.toString(16), 2, "0");
            }, y);
          }, function(y, tt) {
            var et = y.length, z = [], nt = 0;
            if (et <= tt)
              return [y.slice()];
            for (var rt = 0; rt < et; rt++)
              z[nt] || z.push([]), z[nt].push(y[rt]), (rt + 1) % tt == 0 && nt++;
            return z;
          }(e.slice(F.from, F.to).toJSON().data, V));
          h = function(y) {
            return y.from === 0 && y.to === 1 ? { from: y.from, to: y.to } : { from: y.from / V, to: Math.floor(y.to / V) };
          }(F), u = E / V, a = 3 * L, L >= 4 && (a += 1), S = 2, l = k(function(y) {
            return y.length <= 4 ? y.join(" ") : y.slice(0, 4).join(" ") + "  " + y.slice(4).join(" ");
          }, T), (p = (8 * (h.to > 0 ? h.to - 1 : h.to)).toString(16).length) < 2 && (p = 2);
        } else {
          var Y = e.split(/\r\n|[\n\r\u2028\u2029]/);
          a = d.column - 1, u = d.line - 1, h = Ht(u, be, we, Y.length), l = Y.slice(h.from, h.to), p = h.to.toString().length;
        }
        var Ne = u - h.from;
        return ot(e) && (p = (8 * (h.to > 0 ? h.to - 1 : h.to)).toString(16).length) < 2 && (p = 2), b(function(y, tt, et) {
          var z, nt = et === Ne, rt = nt ? "> " : It;
          return z = ot(e) ? yt((8 * (h.from + et)).toString(16), p, "0") : yt((h.from + et + 1).toString(), p, " "), [].concat(y, [rt + z + " | " + tt], nt ? [It + vt(" ", p) + " | " + yt("", a, " ") + vt("^", S)] : []);
        }, [], l).join(`
`);
      }
      function Rt(e, r) {
        return [`
`, "-- PARSING FAILED " + vt("-", 50), `

`, Ee(e, r), `

`, (a = r.expected, a.length === 1 ? `Expected:

` + a[0] : `Expected one of the following: 

` + a.join(", ")), `
`].join("");
        var a;
      }
      function zt(e) {
        return e.flags !== void 0 ? e.flags : [e.global ? "g" : "", e.ignoreCase ? "i" : "", e.multiline ? "m" : "", e.unicode ? "u" : "", e.sticky ? "y" : ""].join("");
      }
      function Et() {
        for (var e = [].slice.call(arguments), r = e.length, a = 0; a < r; a += 1)
          J(e[a]);
        return s(function(u, l) {
          for (var h, p = new Array(r), d = 0; d < r; d += 1) {
            if (!(h = B(e[d]._(u, l), h)).status)
              return h;
            p[d] = h.value, l = h.index;
          }
          return B(v(l, p), h);
        });
      }
      function H() {
        var e = [].slice.call(arguments);
        if (e.length === 0)
          throw new Error("seqMap needs at least one argument");
        var r = e.pop();
        return I(r), Et.apply(null, e).map(function(a) {
          return r.apply(null, a);
        });
      }
      function kt() {
        var e = [].slice.call(arguments), r = e.length;
        if (r === 0)
          return St("zero alternates");
        for (var a = 0; a < r; a += 1)
          J(e[a]);
        return s(function(u, l) {
          for (var h, p = 0; p < e.length; p += 1)
            if ((h = B(e[p]._(u, l), h)).status)
              return h;
          return h;
        });
      }
      function Ut(e, r) {
        return Ct(e, r).or(R([]));
      }
      function Ct(e, r) {
        return J(e), J(r), H(e, r.then(e).many(), function(a, u) {
          return [a].concat(u);
        });
      }
      function ft(e) {
        ut(e);
        var r = "'" + e + "'";
        return s(function(a, u) {
          var l = u + e.length, h = a.slice(u, l);
          return h === e ? v(l, h) : O(u, r);
        });
      }
      function C(e, r) {
        (function(l) {
          if (!(l instanceof RegExp))
            throw new Error("not a regexp: " + l);
          for (var h = zt(l), p = 0; p < h.length; p++) {
            var d = h.charAt(p);
            if (d !== "i" && d !== "m" && d !== "u" && d !== "s")
              throw new Error('unsupported regexp flag "' + d + '": ' + l);
          }
        })(e), arguments.length >= 2 ? X(r) : r = 0;
        var a = function(l) {
          return RegExp("^(?:" + l.source + ")", zt(l));
        }(e), u = "" + e;
        return s(function(l, h) {
          var p = a.exec(l.slice(h));
          if (p) {
            if (0 <= r && r <= p.length) {
              var d = p[0], x = p[r];
              return v(h + d.length, x);
            }
            return O(h, "valid match group (0 to " + p.length + ") in " + u);
          }
          return O(h, u);
        });
      }
      function R(e) {
        return s(function(r, a) {
          return v(a, e);
        });
      }
      function St(e) {
        return s(function(r, a) {
          return O(a, e);
        });
      }
      function $t(e) {
        if (at(e))
          return s(function(r, a) {
            var u = e._(r, a);
            return u.index = a, u.value = "", u;
          });
        if (typeof e == "string")
          return $t(ft(e));
        if (e instanceof RegExp)
          return $t(C(e));
        throw new Error("not a string, regexp, or parser: " + e);
      }
      function Wt(e) {
        return J(e), s(function(r, a) {
          var u = e._(r, a), l = r.slice(a, u.index);
          return u.status ? O(a, 'not "' + l + '"') : v(a, null);
        });
      }
      function jt(e) {
        return I(e), s(function(r, a) {
          var u = wt(r, a);
          return a < r.length && e(u) ? v(a + 1, u) : O(a, "a character/byte matching " + e);
        });
      }
      function Dt(e, r) {
        arguments.length < 2 && (r = e, e = void 0);
        var a = s(function(u, l) {
          return a._ = r()._, a._(u, l);
        });
        return e ? a.desc(e) : a;
      }
      function Lt() {
        return St("fantasy-land/empty");
      }
      f.parse = function(e) {
        if (typeof e != "string" && !ot(e))
          throw new Error(".parse must be called with a string or Buffer as its argument");
        var r, a = this.skip(Tt)._(e, 0);
        return r = a.status ? { status: !0, value: a.value } : { status: !1, index: At(e, a.furthest), expected: a.expected }, delete bt[e], r;
      }, f.tryParse = function(e) {
        var r = this.parse(e);
        if (r.status)
          return r.value;
        var a = Rt(e, r), u = new Error(a);
        throw u.type = "ParsimmonError", u.result = r, u;
      }, f.assert = function(e, r) {
        return this.chain(function(a) {
          return e(a) ? R(a) : St(r);
        });
      }, f.or = function(e) {
        return kt(this, e);
      }, f.trim = function(e) {
        return this.wrap(e, e);
      }, f.wrap = function(e, r) {
        return H(e, this, r, function(a, u) {
          return u;
        });
      }, f.thru = function(e) {
        return e(this);
      }, f.then = function(e) {
        return J(e), Et(this, e).map(function(r) {
          return r[1];
        });
      }, f.many = function() {
        var e = this;
        return s(function(r, a) {
          for (var u = [], l = void 0; ; ) {
            if (!(l = B(e._(r, a), l)).status)
              return B(v(a, u), l);
            if (a === l.index)
              throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            a = l.index, u.push(l.value);
          }
        });
      }, f.tieWith = function(e) {
        return ut(e), this.map(function(r) {
          if (function(l) {
            if (!Z(l))
              throw new Error("not an array: " + l);
          }(r), r.length) {
            ut(r[0]);
            for (var a = r[0], u = 1; u < r.length; u++)
              ut(r[u]), a += e + r[u];
            return a;
          }
          return "";
        });
      }, f.tie = function() {
        return this.tieWith("");
      }, f.times = function(e, r) {
        var a = this;
        return arguments.length < 2 && (r = e), X(e), X(r), s(function(u, l) {
          for (var h = [], p = void 0, d = void 0, x = 0; x < e; x += 1) {
            if (d = B(p = a._(u, l), d), !p.status)
              return d;
            l = p.index, h.push(p.value);
          }
          for (; x < r && (d = B(p = a._(u, l), d), p.status); x += 1)
            l = p.index, h.push(p.value);
          return B(v(l, h), d);
        });
      }, f.result = function(e) {
        return this.map(function() {
          return e;
        });
      }, f.atMost = function(e) {
        return this.times(0, e);
      }, f.atLeast = function(e) {
        return H(this.times(e), this.many(), function(r, a) {
          return r.concat(a);
        });
      }, f.map = function(e) {
        I(e);
        var r = this;
        return s(function(a, u) {
          var l = r._(a, u);
          return l.status ? B(v(l.index, e(l.value)), l) : l;
        });
      }, f.contramap = function(e) {
        I(e);
        var r = this;
        return s(function(a, u) {
          var l = r.parse(e(a.slice(u)));
          return l.status ? v(u + a.length, l.value) : l;
        });
      }, f.promap = function(e, r) {
        return I(e), I(r), this.contramap(e).map(r);
      }, f.skip = function(e) {
        return Et(this, e).map(function(r) {
          return r[0];
        });
      }, f.mark = function() {
        return H(ct, this, ct, function(e, r, a) {
          return { start: e, value: r, end: a };
        });
      }, f.node = function(e) {
        return H(ct, this, ct, function(r, a, u) {
          return { name: e, value: a, start: r, end: u };
        });
      }, f.sepBy = function(e) {
        return Ut(this, e);
      }, f.sepBy1 = function(e) {
        return Ct(this, e);
      }, f.lookahead = function(e) {
        return this.skip($t(e));
      }, f.notFollowedBy = function(e) {
        return this.skip(Wt(e));
      }, f.desc = function(e) {
        Z(e) || (e = [e]);
        var r = this;
        return s(function(a, u) {
          var l = r._(a, u);
          return l.status || (l.expected = e), l;
        });
      }, f.fallback = function(e) {
        return this.or(R(e));
      }, f.ap = function(e) {
        return H(e, this, function(r, a) {
          return r(a);
        });
      }, f.chain = function(e) {
        var r = this;
        return s(function(a, u) {
          var l = r._(a, u);
          return l.status ? B(e(l.value)._(a, l.index), l) : l;
        });
      }, f.concat = f.or, f.empty = Lt, f.of = R, f["fantasy-land/ap"] = f.ap, f["fantasy-land/chain"] = f.chain, f["fantasy-land/concat"] = f.concat, f["fantasy-land/empty"] = f.empty, f["fantasy-land/of"] = f.of, f["fantasy-land/map"] = f.map;
      var ct = s(function(e, r) {
        return v(r, At(e, r));
      }), ke = s(function(e, r) {
        return r >= e.length ? O(r, "any character/byte") : v(r + 1, wt(e, r));
      }), Se = s(function(e, r) {
        return v(e.length, e.slice(r));
      }), Tt = s(function(e, r) {
        return r < e.length ? O(r, "EOF") : v(r, null);
      }), $e = C(/[0-9]/).desc("a digit"), je = C(/[0-9]*/).desc("optional digits"), Oe = C(/[a-z]/i).desc("a letter"), Fe = C(/[a-z]*/i).desc("optional letters"), Be = C(/\s*/).desc("optional whitespace"), _e = C(/\s+/).desc("whitespace"), Kt = ft("\r"), Gt = ft(`
`), Qt = ft(`\r
`), Zt = kt(Qt, Gt, Kt).desc("newline"), Pe = kt(Zt, Tt);
      s.all = Se, s.alt = kt, s.any = ke, s.cr = Kt, s.createLanguage = function(e) {
        var r = {};
        for (var a in e)
          ({}).hasOwnProperty.call(e, a) && function(u) {
            r[u] = Dt(function() {
              return e[u](r);
            });
          }(a);
        return r;
      }, s.crlf = Qt, s.custom = function(e) {
        return s(e(v, O));
      }, s.digit = $e, s.digits = je, s.empty = Lt, s.end = Pe, s.eof = Tt, s.fail = St, s.formatError = Rt, s.index = ct, s.isParser = at, s.lazy = Dt, s.letter = Oe, s.letters = Fe, s.lf = Gt, s.lookahead = $t, s.makeFailure = O, s.makeSuccess = v, s.newline = Zt, s.noneOf = function(e) {
        return jt(function(r) {
          return e.indexOf(r) < 0;
        }).desc("none of '" + e + "'");
      }, s.notFollowedBy = Wt, s.of = R, s.oneOf = function(e) {
        for (var r = e.split(""), a = 0; a < r.length; a++)
          r[a] = "'" + r[a] + "'";
        return jt(function(u) {
          return e.indexOf(u) >= 0;
        }).desc(r);
      }, s.optWhitespace = Be, s.Parser = s, s.range = function(e, r) {
        return jt(function(a) {
          return e <= a && a <= r;
        }).desc(e + "-" + r);
      }, s.regex = C, s.regexp = C, s.sepBy = Ut, s.sepBy1 = Ct, s.seq = Et, s.seqMap = H, s.seqObj = function() {
        for (var e, r = {}, a = 0, u = (e = arguments, Array.prototype.slice.call(e)), l = u.length, h = 0; h < l; h += 1) {
          var p = u[h];
          if (!at(p)) {
            if (Z(p) && p.length === 2 && typeof p[0] == "string" && at(p[1])) {
              var d = p[0];
              if (Object.prototype.hasOwnProperty.call(r, d))
                throw new Error("seqObj: duplicate key " + d);
              r[d] = !0, a++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (a === 0)
          throw new Error("seqObj expects at least one named parser, found zero");
        return s(function(x, S) {
          for (var E, L = {}, F = 0; F < l; F += 1) {
            var T, Y;
            if (Z(u[F]) ? (T = u[F][0], Y = u[F][1]) : (T = null, Y = u[F]), !(E = B(Y._(x, S), E)).status)
              return E;
            T && (L[T] = E.value), S = E.index;
          }
          return B(v(S, L), E);
        });
      }, s.string = ft, s.succeed = R, s.takeWhile = function(e) {
        return I(e), s(function(r, a) {
          for (var u = a; u < r.length && e(wt(r, u)); )
            u++;
          return v(u, r.slice(a, u));
        });
      }, s.test = jt, s.whitespace = _e, s["fantasy-land/empty"] = Lt, s["fantasy-land/of"] = R, s.Binary = { bitSeq: G, bitSeqObj: function(e) {
        A();
        var r = {}, a = 0, u = k(function(h) {
          if (Z(h)) {
            var p = h;
            if (p.length !== 2)
              throw new Error("[" + p.join(", ") + "] should be length 2, got length " + p.length);
            if (ut(p[0]), X(p[1]), Object.prototype.hasOwnProperty.call(r, p[0]))
              throw new Error("duplicate key in bitSeqObj: " + p[0]);
            return r[p[0]] = !0, a++, p;
          }
          return X(h), [null, h];
        }, e);
        if (a < 1)
          throw new Error("bitSeqObj expects at least one named pair, got [" + e.join(", ") + "]");
        var l = k(function(h) {
          return h[0];
        }, u);
        return G(k(function(h) {
          return h[1];
        }, u)).map(function(h) {
          return b(function(p, d) {
            return d[0] !== null && (p[d[0]] = d[1]), p;
          }, {}, k(function(p, d) {
            return [p, h[d]];
          }, l));
        });
      }, byte: function(e) {
        if (A(), X(e), e > 255)
          throw new Error("Value specified to byte constructor (" + e + "=0x" + e.toString(16) + ") is larger in value than a single byte.");
        var r = (e > 15 ? "0x" : "0x0") + e.toString(16);
        return s(function(a, u) {
          var l = wt(a, u);
          return l === e ? v(u + 1, l) : O(u, r);
        });
      }, buffer: function(e) {
        return w("buffer", e).map(function(r) {
          return Buffer.from(r);
        });
      }, encodedString: function(e, r) {
        return w("string", r).map(function(a) {
          return a.toString(e);
        });
      }, uintBE: M, uint8BE: M(1), uint16BE: M(2), uint32BE: M(4), uintLE: Q, uint8LE: Q(1), uint16LE: Q(2), uint32LE: Q(4), intBE: gt, int8BE: gt(1), int16BE: gt(2), int32BE: gt(4), intLE: xt, int8LE: xt(1), int16LE: xt(2), int32LE: xt(4), floatBE: w("floatBE", 4).map(function(e) {
        return e.readFloatBE(0);
      }), floatLE: w("floatLE", 4).map(function(e) {
        return e.readFloatLE(0);
      }), doubleBE: w("doubleBE", 8).map(function(e) {
        return e.readDoubleBE(0);
      }), doubleLE: w("doubleLE", 8).map(function(e) {
        return e.readDoubleLE(0);
      }) }, i.exports = s;
    }]);
  });
})(un);
const fn = /* @__PURE__ */ on(m), me = /* @__PURE__ */ Me({
  __proto__: null,
  default: fn
}, [m]), se = (t, n) => {
  const i = getComputedStyle(t).getPropertyValue("--" + n), o = Mt.valueUnit.parse(i);
  return o.status ? o.value : void 0;
};
class _ {
  constructor(n, i) {
    this.value = n, this.unit = i;
    const o = mt(n);
    o && (this.unit = "color", this.value = o);
  }
  toString() {
    if (this.unit === "color") {
      const n = this.value;
      return `rgb(${n.r}, ${n.g}, ${n.b})`;
    } else
      return this.unit && this.unit !== "var" ? `${this.value}${this.unit}` : `${this.value}`;
  }
  lerp(n, i, o) {
    if (this.unit === "color") {
      const c = {
        r: it(n, this.value.r, i.value.r),
        g: it(n, this.value.g, i.value.g),
        b: it(n, this.value.b, i.value.b)
      };
      return new _(c, this.unit);
    } else if (o && (this.unit === "var" || i.unit === "var")) {
      const c = this.unit === "var" ? se(o, this.value) : this, s = i.unit === "var" ? se(o, i.value) : i;
      return c.lerp(n, s, o);
    } else if (this.unit !== i.unit) {
      const c = ae(this.value, this.unit, o), s = ae(i.value, i.unit, o), f = it(n, c, s);
      return new _(f, "px");
    } else {
      const c = it(n, this.value, i.value);
      return new _(c, this.unit);
    }
  }
}
class W {
  constructor(n, i) {
    this.name = n, this.values = i;
  }
  toString() {
    const n = this.values.map((i) => i.toString()).join(", ");
    return `${this.name}(${n})`;
  }
  lerp(n, i, o) {
    const c = Math.min(this.values.length, i.values.length), s = [];
    for (let f = 0; f < c; f++) {
      const g = this.values[f], b = i.values[f];
      s.push(g.lerp(n, b, o));
    }
    return new W(this.name, s);
  }
}
class pt {
  constructor(n) {
    this.values = n;
  }
  toString() {
    return this.values.map((n) => n.toString()).join(" ");
  }
  lerp(n, i, o) {
    const c = Math.min(this.values.length, i.values.length), s = [];
    for (let f = 0; f < c; f++) {
      const g = this.values[f], b = i.values[f];
      s.push(g.lerp(n, b, o));
    }
    return new pt(s);
  }
}
function cn(t, n) {
  let i = t;
  return n === "cm" ? i *= 96 / 2.54 : n === "mm" ? i *= 96 / 25.4 : n === "in" ? i *= 96 : n === "pt" ? i *= 4 / 3 : n === "pc" && (i *= 16), i;
}
function ae(t, n, i, o) {
  if (n === "em" && i)
    t *= parseFloat(getComputedStyle(i).fontSize);
  else if (n === "rem")
    t *= parseFloat(getComputedStyle(document.documentElement).fontSize);
  else if (n === "vh")
    t *= window.innerHeight / 100;
  else if (n === "vw")
    t *= window.innerWidth / 100;
  else if (n === "vmin")
    t *= Math.min(window.innerHeight, window.innerWidth) / 100;
  else if (n === "vmax")
    t *= Math.max(window.innerHeight, window.innerWidth) / 100;
  else if (n === "%" && (i != null && i.parentElement) && o) {
    const c = parseFloat(
      getComputedStyle(i.parentElement).getPropertyValue(o)
    );
    t = t / 100 * c;
  } else
    t = cn(t, n);
  return t;
}
const ln = (t) => t.replace(
  /([-_][a-z])/gi,
  (n) => n.toUpperCase().replace("-", "").replace("_", "")
), ge = (t) => me((n, i) => n.slice(i).toLowerCase().startsWith(t.toLowerCase()) ? m.makeSuccess(i + t.length, t) : m.makeFailure(i, `Expected ${t}`)), Bt = (t, n, i, o) => (i = i ?? t.lparen, o = o ?? t.rparen, t.ws.skip(i).skip(t.ws).then(n).skip(t.ws).skip(o).skip(t.ws)), hn = m.createLanguage({
  number: () => m.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),
  unit: () => m.regexp(/[a-zA-Z%]+/),
  numberValue: (t) => t.number.map((n) => new _(n)),
  unitValue: (t) => m.seq(t.number, t.unit).map(([n, i]) => new _(n, i)),
  colorValue: () => me((t, n) => {
    var c;
    const i = t.slice(n), o = (c = mt(i)) == null ? void 0 : c.rgb();
    return o ? m.makeSuccess(n + t.length, new _(o, "color")) : m.makeFailure(n, "Invalid color");
  }),
  value: (t) => m.alt(t.colorValue, t.unitValue, t.numberValue)
}), pn = ["translate", "scale", "rotate", "skew"].map(ge), dn = ["x", "y", "z"].map(ge), Mt = m.createLanguage({
  identifier: () => m.regexp(/[a-zA-Z][a-zA-Z0-9-]+/),
  ws: () => m.optWhitespace,
  rule: (t) => t.ws.then(m.string("@keyframes")).skip(t.ws).then(t.identifier),
  semi: () => m.string(";"),
  colon: () => m.string(":"),
  lcurly: () => m.string("{"),
  rcurly: () => m.string("}"),
  lparen: () => m.string("("),
  rparen: () => m.string(")"),
  commaWhitespace: (t) => t.ws.then(m.string(",")).skip(t.ws),
  percent: (t) => t.ws.then(
    m.alt(
      m.regexp(/\d+/).skip(m.string("%").or(m.string(""))),
      m.string("from").map(() => "0"),
      m.string("to").map(() => "100")
    )
  ).skip(t.ws).map(Number),
  unitValue: () => m.regexp(/[^(){},;\s]+/).map((t) => new _(t)),
  valueUnit: (t) => t.ws.then(m.alt(hn.value, t.unitValue)).skip(t.ws),
  transforms: (t) => m.seq(
    m.alt(...pn),
    m.alt(...dn, m.string("")),
    Bt(t, t.functionValuePart)
  ).map(([n, i, o]) => (n = n.toLowerCase(), i ? new W(n + i.toUpperCase(), [o[0]]) : o.length === 1 ? new W(n, [o[0]]) : new W(n, o))),
  variable: (t) => m.string("var").then(Bt(t, m.string("--").then(t.identifier))).map((n) => new _(n, "var")),
  calc: (t) => m.string("calc").then(Bt(t, t.valuePart.many())).map((n) => new _(n, "calc")),
  functionValuePart: (t) => t.valuePart.sepBy(t.commaWhitespace),
  functionValue: (t) => m.alt(
    t.transforms,
    t.variable,
    t.calc,
    m.seq(t.identifier, Bt(t, t.functionValuePart)).map(
      ([n, i]) => new W(n, i)
    )
  ),
  valuePart: (t) => m.alt(t.functionValue, t.valueUnit).skip(t.ws),
  value: (t) => t.valuePart.sepBy(t.ws).map((n) => new pt(n)),
  values: (t) => m.seq(
    t.identifier.skip(t.ws).skip(t.colon).skip(t.ws).map((n) => ln(n)),
    t.value.skip(t.ws).skip(t.semi).skip(t.ws)
  ).map(([n, i]) => ({
    [n]: i
  })),
  frame: (t) => m.seq(
    t.percent.skip(t.ws).skip(t.lcurly).skip(t.ws),
    t.values.atLeast(1).skip(t.ws).skip(t.rcurly)
  ).map(([n, i]) => ({
    [n]: Object.assign({}, ...i)
  })),
  keyframe: (t) => t.rule.skip(t.ws).skip(t.lcurly).skip(t.ws).then(t.frame.many()).skip(t.ws).skip(t.rcurly).skip(t.ws).map((n) => Object.assign({}, ...n))
}), mn = (t) => Mt.keyframe.tryParse(t), oe = (t) => Mt.percent.tryParse(String(t));
async function ue(t) {
  return await new Promise((n) => setTimeout(n, t));
}
function gn(t) {
  const n = {}, i = (o, c = "") => {
    if (o instanceof _ || o instanceof W || o instanceof pt)
      return o instanceof _ ? new pt([o]) : o;
    if (typeof o == "object")
      for (const [f, g] of Object.entries(o)) {
        const b = c ? `${c}.${f}` : f, k = i(g, b);
        k !== void 0 && (n[b] = k);
      }
    else {
      const f = Mt.value.parse(String(o));
      return f.status ? f.value : void 0;
    }
  };
  return i(t), n;
}
function xn(t, n, i) {
  const o = t.split(".");
  let c = i;
  for (let s = 0; s < o.length; s++) {
    const f = o[s];
    n !== void 0 && s === o.length - 1 ? c[f] = n.toString() : c = c[f] ?? (c[f] = {});
  }
  return i;
}
async function bn(t, n = 1e3 / 60) {
  return await new Promise((i) => {
    const o = setInterval(() => {
      t() && (clearInterval(o), i());
    }, n);
  });
}
const yn = {
  easeInQuad: Ve,
  easeOutQuad: qe,
  easeInOutQuad: Ae,
  easeInCubic: Ie,
  easeOutCubic: He,
  easeInOutCubic: le,
  easeInBounce: ze,
  bounceInEase: Ue,
  bounceInEaseHalf: We,
  smoothStep3: Re
};
function fe(t, n, i) {
  let [o, c] = [t.start, n.start];
  return o = o * i / 100, c = c * i / 100, {
    start: o,
    stop: c
  };
}
function ce(t, n, i) {
  for (let o = t - 1; o >= 0; o--)
    if (i(n[o]))
      return o;
}
function wn(t, n, i, o, c) {
  const [s, f] = [n[t], n[t + 1]], [g, b] = [i[t], i[t + 1]], k = fe(s, f, o), q = {}, K = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(b)])], A = (w, j, M) => ({
    start: i[j][w],
    stop: i[M][w]
  });
  K.forEach((w) => {
    if (w in g && w in b)
      q[w] = A(w, t, t + 1);
    else if (!(w in g) && w in b) {
      const j = ce(t, i, (Q) => w in Q);
      if (j == null)
        return;
      const M = c[j];
      M.time = fe(
        n[j],
        f,
        o
      ), M.interpVars[w] = A(w, j, t + 1);
    }
  });
  let G = s.transform;
  if (G == null) {
    const w = ce(t, c, (j) => j.transform != null);
    G = c[w].transform;
  }
  return {
    id: s.id,
    time: k,
    interpVars: q,
    transform: G,
    timingFunction: s.timingFunction
  };
}
const xe = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: le
};
class vn {
  constructor(n, i = document.documentElement) {
    this.target = i, this.templateFrames = [], this.transformedVars = [], this.frameId = 0, this.frames = [], this.startTime = void 0, this.pausedTime = 0, this.prevTime = 0, this.started = !1, this.done = !1, this.reversed = !1, this.paused = !1, this.options = { ...xe, ...n };
  }
  frame(n, i, o, c) {
    const s = {
      id: this.frameId,
      start: n,
      vars: i,
      transform: o,
      timingFunction: c ?? this.options.timingFunction
    };
    return this.templateFrames.push(s), this.frameId += 1, this;
  }
  transformVars() {
    return this.transformedVars = this.templateFrames.map((n) => gn(n.vars)), this;
  }
  parseFrames() {
    this.templateFrames.sort((n, i) => n.start - i.start);
    for (let n = 0; n < this.templateFrames.length - 1; n++) {
      const i = wn(
        n,
        this.templateFrames,
        this.transformedVars,
        this.options.duration,
        this.frames
      );
      this.frames.push(i);
    }
    return this;
  }
  parse() {
    return this.transformVars().parseFrames(), this;
  }
  reverse() {
    return this.reversed = !this.reversed, this;
  }
  pause() {
    return this.paused = !this.paused, this;
  }
  reset() {
    return this.startTime = void 0, this.pausedTime = 0, this.prevTime = 0, this.t = 0, this.started = !1, this.done = !0, this.reversed = !1, this.paused = !1, this;
  }
  fillForwards() {
    this.interpFrames(this.options.duration);
  }
  fillBackwards() {
    this.interpFrames(0);
  }
  interpFrames(n, i = {}) {
    n = this.reversed ? this.options.duration - n : n;
    for (let o = 0; o < this.frames.length; o++) {
      const c = this.frames[o], { start: s, stop: f } = c.time;
      if (n < s || n > f)
        continue;
      const g = Ce(n, s, f, 0, 1), b = c.timingFunction(g);
      for (const [k, q] of Object.entries(c.interpVars)) {
        const K = q.start.lerp(b, q.stop, this.target);
        xn(k, K, i);
      }
      c.transform(n, i);
    }
  }
  async onStart() {
    (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && await ue(this.options.delay), this.started = !0, this.done = !1;
  }
  onEnd() {
    this.options.fillMode === "forwards" || this.options.fillMode === "both" ? this.fillForwards() : (this.options.fillMode === "none" || this.options.fillMode === "backwards") && this.fillBackwards(), this.done = !0, this.startTime = void 0, this.pausedTime = 0, this.prevTime = 0;
  }
  async draw(n) {
    this.startTime === void 0 && (await this.onStart(), this.startTime = n + this.options.delay), n = n - this.startTime;
    const i = n - this.prevTime;
    return this.prevTime = n, this.paused ? (this.pausedTime += i, requestAnimationFrame(this.draw.bind(this))) : (this.startTime += this.pausedTime, n -= this.pausedTime, this.pausedTime = 0, this.t = n, n >= this.options.duration ? this.onEnd() : (this.interpFrames(n), requestAnimationFrame(this.draw.bind(this))));
  }
  async play() {
    (this.options.direction === "reverse" || this.options.direction === "alternate-reverse") && this.reverse();
    for (let n = 0; n < this.options.iterationCount; n++)
      n > 0 && (this.options.direction === "alternate" || this.options.direction === "alternate-reverse") && this.reverse(), requestAnimationFrame(this.draw.bind(this)), await ue(this.options.duration), await bn(() => this.done);
    this.started = !1;
  }
}
class En {
  constructor(n = {}, ...i) {
    this.options = { ...xe, ...n }, this.targets = i;
  }
  initAnimation() {
    var n;
    return this.animation = new vn(this.options, (n = this.targets) == null ? void 0 : n[0]), this;
  }
  fromFramesDefaultTransform(n) {
    this.initAnimation();
    for (const [i, o] of Object.entries(n))
      this.animation.frame(
        oe(i),
        o,
        this.transform.bind(this)
      );
    return this.animation.parse(), this;
  }
  fromVars(n, i) {
    this.initAnimation();
    for (let o = 0; o < n.length; o++) {
      const c = n[o], s = Math.round(o / (n.length - 1) * 100);
      this.animation.frame(s, c, i);
    }
    return this.animation.parse(), this;
  }
  fromFrames(n) {
    this.initAnimation();
    for (const [i, o] of Object.entries(n)) {
      const [c, s, f] = o;
      this.animation.frame(
        oe(i),
        c,
        s,
        f
      );
    }
    return this.animation.parse(), this;
  }
  fromCSSKeyframes(n) {
    this.initAnimation();
    const i = mn(n);
    for (const [o, c] of Object.entries(i))
      this.animation.frame(Number(o), c, this.transform.bind(this)), this.animation.transformedVars.push(c);
    return this.animation.parseFrames(), this;
  }
  transform(n, i) {
    for (const [o, c] of Object.entries(i)) {
      if (typeof c == "object") {
        let s = "";
        for (const [f, g] of Object.entries(c))
          s += g.includes("(") ? g : `${f}(${g}) `;
        i[o] = s;
      }
      this.targets.forEach((s) => {
        s.style[o] = i[o];
      });
    }
  }
  async play() {
    return await this.animation.play();
  }
  pause() {
    return this.animation.pause(), this;
  }
}
export {
  vn as Animation,
  En as CSSKeyframesAnimation,
  yn as easingFunctions,
  wn as parseTemplateFrame
};
