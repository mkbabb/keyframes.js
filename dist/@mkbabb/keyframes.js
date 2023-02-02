var Ce = Object.defineProperty;
var Le = (t, n, i) => n in t ? Ce(t, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[n] = i;
var k = (t, n, i) => (Le(t, typeof n != "symbol" ? n + "" : n, i), i);
function Te(t, n, i, o = 0, l = 1) {
  const s = (l - o) / (i - n);
  return (t - n) * s + o;
}
function st(t, n, i) {
  return (1 - t) * n + t * i;
}
function Nt(t, n) {
  const i = n.length - 1;
  let o = [...n];
  for (let l = 1; l <= i; l++)
    for (let s = 0; s <= i - l; s++)
      o[s] = st(t, o[s], o[s + 1]);
  return o[0];
}
function Ve(t, n, i, o, l) {
  return [Nt(t, [0, n, o, 1]), Nt(t, [0, i, l, 1])];
}
function qe(t, n) {
  const i = n.map((l) => l[0]), o = n.map((l) => l[1]);
  return [Nt(t, i), Nt(t, o)];
}
function Ie(t) {
  return t * t;
}
function Ae(t) {
  return -t * (t - 2);
}
function He(t) {
  return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
}
function Re(t) {
  return t * t * t;
}
function ze(t) {
  return (t = t - 1) * t * t + 1;
}
function pe(t) {
  return (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
}
function Ue(t) {
  return t * t * (3 - 2 * t);
}
const de = (t, n, i, o) => (l) => (l = Ve(l, t, n, i, o)[1], l);
function We(t) {
  return t = de(0.09, 0.91, 0.5, 1.5)(t), t;
}
function De(t) {
  return t = de(0.09, 0.91, 0.5, 1.5)(t), t;
}
function Ke(t) {
  return t = qe(t, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], t;
}
function At(t, n, i) {
  t.prototype = n.prototype = i, i.constructor = t;
}
function me(t, n) {
  var i = Object.create(t.prototype);
  for (var o in n)
    i[o] = n[o];
  return i;
}
function mt() {
}
var ht = 0.7, Mt = 1 / ht, at = "\\s*([+-]?\\d+)\\s*", pt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", _ = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Ge = /^#([0-9a-f]{3,8})$/, Qe = new RegExp(`^rgb\\(${at},${at},${at}\\)$`), Ze = new RegExp(`^rgb\\(${_},${_},${_}\\)$`), Je = new RegExp(`^rgba\\(${at},${at},${at},${pt}\\)$`), Xe = new RegExp(`^rgba\\(${_},${_},${_},${pt}\\)$`), Ye = new RegExp(`^hsl\\(${pt},${_},${_}\\)$`), tn = new RegExp(`^hsla\\(${pt},${_},${_},${pt}\\)$`), Yt = {
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
At(mt, gt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: te,
  // Deprecated! Use color.formatHex.
  formatHex: te,
  formatHex8: en,
  formatHsl: nn,
  formatRgb: ee,
  toString: ee
});
function te() {
  return this.rgb().formatHex();
}
function en() {
  return this.rgb().formatHex8();
}
function nn() {
  return ge(this).formatHsl();
}
function ee() {
  return this.rgb().formatRgb();
}
function gt(t) {
  var n, i;
  return t = (t + "").trim().toLowerCase(), (n = Ge.exec(t)) ? (i = n[1].length, n = parseInt(n[1], 16), i === 6 ? ne(n) : i === 3 ? new j(n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, (n & 15) << 4 | n & 15, 1) : i === 8 ? Ot(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, (n & 255) / 255) : i === 4 ? Ot(n >> 12 & 15 | n >> 8 & 240, n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, ((n & 15) << 4 | n & 15) / 255) : null) : (n = Qe.exec(t)) ? new j(n[1], n[2], n[3], 1) : (n = Ze.exec(t)) ? new j(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, 1) : (n = Je.exec(t)) ? Ot(n[1], n[2], n[3], n[4]) : (n = Xe.exec(t)) ? Ot(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, n[4]) : (n = Ye.exec(t)) ? se(n[1], n[2] / 100, n[3] / 100, 1) : (n = tn.exec(t)) ? se(n[1], n[2] / 100, n[3] / 100, n[4]) : Yt.hasOwnProperty(t) ? ne(Yt[t]) : t === "transparent" ? new j(NaN, NaN, NaN, 0) : null;
}
function ne(t) {
  return new j(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Ot(t, n, i, o) {
  return o <= 0 && (t = n = i = NaN), new j(t, n, i, o);
}
function rn(t) {
  return t instanceof mt || (t = gt(t)), t ? (t = t.rgb(), new j(t.r, t.g, t.b, t.opacity)) : new j();
}
function sn(t, n, i, o) {
  return arguments.length === 1 ? rn(t) : new j(t, n, i, o ?? 1);
}
function j(t, n, i, o) {
  this.r = +t, this.g = +n, this.b = +i, this.opacity = +o;
}
At(j, sn, me(mt, {
  brighter(t) {
    return t = t == null ? Mt : Math.pow(Mt, t), new j(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ht : Math.pow(ht, t), new j(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new j(K(this.r), K(this.g), K(this.b), _t(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: re,
  // Deprecated! Use color.formatHex.
  formatHex: re,
  formatHex8: an,
  formatRgb: ie,
  toString: ie
}));
function re() {
  return `#${W(this.r)}${W(this.g)}${W(this.b)}`;
}
function an() {
  return `#${W(this.r)}${W(this.g)}${W(this.b)}${W((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ie() {
  const t = _t(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${K(this.r)}, ${K(this.g)}, ${K(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function _t(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function K(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function W(t) {
  return t = K(t), (t < 16 ? "0" : "") + t.toString(16);
}
function se(t, n, i, o) {
  return o <= 0 ? t = n = i = NaN : i <= 0 || i >= 1 ? t = n = NaN : n <= 0 && (t = NaN), new M(t, n, i, o);
}
function ge(t) {
  if (t instanceof M)
    return new M(t.h, t.s, t.l, t.opacity);
  if (t instanceof mt || (t = gt(t)), !t)
    return new M();
  if (t instanceof M)
    return t;
  t = t.rgb();
  var n = t.r / 255, i = t.g / 255, o = t.b / 255, l = Math.min(n, i, o), s = Math.max(n, i, o), f = NaN, g = s - l, b = (s + l) / 2;
  return g ? (n === s ? f = (i - o) / g + (i < o) * 6 : i === s ? f = (o - n) / g + 2 : f = (n - i) / g + 4, g /= b < 0.5 ? s + l : 2 - s - l, f *= 60) : g = b > 0 && b < 1 ? 0 : f, new M(f, g, b, t.opacity);
}
function on(t, n, i, o) {
  return arguments.length === 1 ? ge(t) : new M(t, n, i, o ?? 1);
}
function M(t, n, i, o) {
  this.h = +t, this.s = +n, this.l = +i, this.opacity = +o;
}
At(M, on, me(mt, {
  brighter(t) {
    return t = t == null ? Mt : Math.pow(Mt, t), new M(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ht : Math.pow(ht, t), new M(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, n = isNaN(t) || isNaN(this.s) ? 0 : this.s, i = this.l, o = i + (i < 0.5 ? i : 1 - i) * n, l = 2 * i - o;
    return new j(
      qt(t >= 240 ? t - 240 : t + 120, l, o),
      qt(t, l, o),
      qt(t < 120 ? t + 240 : t - 120, l, o),
      this.opacity
    );
  },
  clamp() {
    return new M(ae(this.h), Bt(this.s), Bt(this.l), _t(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = _t(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${ae(this.h)}, ${Bt(this.s) * 100}%, ${Bt(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function ae(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Bt(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function qt(t, n, i) {
  return (t < 60 ? n + (i - n) * t / 60 : t < 180 ? i : t < 240 ? n + (i - n) * (240 - t) / 60 : n) * 255;
}
var un = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function fn(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var It = {}, cn = {
  get exports() {
    return It;
  },
  set exports(t) {
    It = t;
  }
};
(function(t, n) {
  (function(i, o) {
    t.exports = o();
  })(typeof self < "u" ? self : un, function() {
    return function(i) {
      var o = {};
      function l(s) {
        if (o[s])
          return o[s].exports;
        var f = o[s] = { i: s, l: !1, exports: {} };
        return i[s].call(f.exports, f, f.exports, l), f.l = !0, f.exports;
      }
      return l.m = i, l.c = o, l.d = function(s, f, g) {
        l.o(s, f) || Object.defineProperty(s, f, { configurable: !1, enumerable: !0, get: g });
      }, l.r = function(s) {
        Object.defineProperty(s, "__esModule", { value: !0 });
      }, l.n = function(s) {
        var f = s && s.__esModule ? function() {
          return s.default;
        } : function() {
          return s;
        };
        return l.d(f, "a", f), f;
      }, l.o = function(s, f) {
        return Object.prototype.hasOwnProperty.call(s, f);
      }, l.p = "", l(l.s = 0);
    }([function(i, o, l) {
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
        return function(u, c) {
          g(c.length, function(h) {
            u(c[h], h, c);
          });
        }(function(u, c, h) {
          r = e(r, u, c, h);
        }, a), r;
      }
      function S(e, r) {
        return b(function(a, u, c, h) {
          return a.concat([e(u, c, h)]);
        }, [], r);
      }
      function I(e, r) {
        var a = { v: 0, buf: r };
        return g(e, function() {
          var u;
          a = { v: a.v << 1 | (u = a.buf, u[0] >> 7), buf: function(c) {
            var h = b(function(p, d, x, $) {
              return p.concat(x === $.length - 1 ? Buffer.from([d, 0]).readUInt16BE(0) : $.readUInt16BE(x));
            }, [], c);
            return Buffer.from(S(function(p) {
              return (p << 1 & 65535) >> 8;
            }, h));
          }(a.buf) };
        }), a;
      }
      function G() {
        return typeof Buffer < "u";
      }
      function A() {
        if (!G())
          throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function Q(e) {
        A();
        var r = b(function(h, p) {
          return h + p;
        }, 0, e);
        if (r % 8 != 0)
          throw new Error("The bits [" + e.join(", ") + "] add up to " + r + " which is not an even number of bytes; the total should be divisible by 8");
        var a, u = r / 8, c = (a = function(h) {
          return h > 48;
        }, b(function(h, p) {
          return h || (a(p) ? p : h);
        }, null, e));
        if (c)
          throw new Error(c + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new s(function(h, p) {
          var d = u + p;
          return d > h.length ? O(p, u.toString() + " bytes") : v(d, b(function(x, $) {
            var E = I($, x.buf);
            return { coll: x.coll.concat(E.v), buf: E.buf };
          }, { coll: [], buf: h.slice(p, d) }, e).coll);
        });
      }
      function w(e, r) {
        return new s(function(a, u) {
          return A(), u + r > a.length ? O(u, r + " bytes for " + e) : v(u + r, a.slice(u, u + r));
        });
      }
      function F(e, r) {
        if (typeof (a = r) != "number" || Math.floor(a) !== a || r < 0 || r > 6)
          throw new Error(e + " requires integer length in range [0, 6].");
        var a;
      }
      function C(e) {
        return F("uintBE", e), w("uintBE(" + e + ")", e).map(function(r) {
          return r.readUIntBE(0, e);
        });
      }
      function Z(e) {
        return F("uintLE", e), w("uintLE(" + e + ")", e).map(function(r) {
          return r.readUIntLE(0, e);
        });
      }
      function xt(e) {
        return F("intBE", e), w("intBE(" + e + ")", e).map(function(r) {
          return r.readIntBE(0, e);
        });
      }
      function bt(e) {
        return F("intLE", e), w("intLE(" + e + ")", e).map(function(r) {
          return r.readIntLE(0, e);
        });
      }
      function ot(e) {
        return e instanceof s;
      }
      function J(e) {
        return {}.toString.call(e) === "[object Array]";
      }
      function ut(e) {
        return G() && Buffer.isBuffer(e);
      }
      function v(e, r) {
        return { status: !0, index: e, value: r, furthest: -1, expected: [] };
      }
      function O(e, r) {
        return J(r) || (r = [r]), { status: !1, index: -1, value: null, furthest: e, expected: r };
      }
      function P(e, r) {
        if (!r || e.furthest > r.furthest)
          return e;
        var a = e.furthest === r.furthest ? function(u, c) {
          if (function() {
            if (s._supportsSet !== void 0)
              return s._supportsSet;
            var V = typeof Set < "u";
            return s._supportsSet = V, V;
          }() && Array.from) {
            for (var h = new Set(u), p = 0; p < c.length; p++)
              h.add(c[p]);
            var d = Array.from(h);
            return d.sort(), d;
          }
          for (var x = {}, $ = 0; $ < u.length; $++)
            x[u[$]] = !0;
          for (var E = 0; E < c.length; E++)
            x[c[E]] = !0;
          var T = [];
          for (var B in x)
            ({}).hasOwnProperty.call(x, B) && T.push(B);
          return T.sort(), T;
        }(e.expected, r.expected) : r.expected;
        return { status: e.status, index: e.index, value: e.value, furthest: r.furthest, expected: a };
      }
      var wt = {};
      function Ht(e, r) {
        if (ut(e))
          return { offset: r, line: -1, column: -1 };
        e in wt || (wt[e] = {});
        for (var a = wt[e], u = 0, c = 0, h = 0, p = r; p >= 0; ) {
          if (p in a) {
            u = a[p].line, h === 0 && (h = a[p].lineStart);
            break;
          }
          (e.charAt(p) === `
` || e.charAt(p) === "\r" && e.charAt(p + 1) !== `
`) && (c++, h === 0 && (h = p + 1)), p--;
        }
        var d = u + c, x = r - h;
        return a[r] = { line: d, lineStart: h }, { offset: r, line: d + 1, column: x + 1 };
      }
      function X(e) {
        if (!ot(e))
          throw new Error("not a parser: " + e);
      }
      function vt(e, r) {
        return typeof e == "string" ? e.charAt(r) : e[r];
      }
      function Y(e) {
        if (typeof e != "number")
          throw new Error("not a number: " + e);
      }
      function H(e) {
        if (typeof e != "function")
          throw new Error("not a function: " + e);
      }
      function ft(e) {
        if (typeof e != "string")
          throw new Error("not a string: " + e);
      }
      var we = 2, ve = 3, q = 8, ye = 5 * q, Ee = 4 * q, Rt = "  ";
      function yt(e, r) {
        return new Array(r + 1).join(e);
      }
      function Et(e, r, a) {
        var u = r - e.length;
        return u <= 0 ? e : yt(a, u) + e;
      }
      function zt(e, r, a, u) {
        return { from: e - r > 0 ? e - r : 0, to: e + a > u ? u : e + a };
      }
      function ke(e, r) {
        var a, u, c, h, p, d = r.index, x = d.offset, $ = 1;
        if (x === e.length)
          return "Got the end of the input";
        if (ut(e)) {
          var E = x - x % q, T = x - E, B = zt(E, ye, Ee + q, e.length), V = S(function(y) {
            return S(function(et) {
              return Et(et.toString(16), 2, "0");
            }, y);
          }, function(y, et) {
            var nt = y.length, U = [], rt = 0;
            if (nt <= et)
              return [y.slice()];
            for (var it = 0; it < nt; it++)
              U[rt] || U.push([]), U[rt].push(y[it]), (it + 1) % et == 0 && rt++;
            return U;
          }(e.slice(B.from, B.to).toJSON().data, q));
          h = function(y) {
            return y.from === 0 && y.to === 1 ? { from: y.from, to: y.to } : { from: y.from / q, to: Math.floor(y.to / q) };
          }(B), u = E / q, a = 3 * T, T >= 4 && (a += 1), $ = 2, c = S(function(y) {
            return y.length <= 4 ? y.join(" ") : y.slice(0, 4).join(" ") + "  " + y.slice(4).join(" ");
          }, V), (p = (8 * (h.to > 0 ? h.to - 1 : h.to)).toString(16).length) < 2 && (p = 2);
        } else {
          var tt = e.split(/\r\n|[\n\r\u2028\u2029]/);
          a = d.column - 1, u = d.line - 1, h = zt(u, we, ve, tt.length), c = tt.slice(h.from, h.to), p = h.to.toString().length;
        }
        var _e = u - h.from;
        return ut(e) && (p = (8 * (h.to > 0 ? h.to - 1 : h.to)).toString(16).length) < 2 && (p = 2), b(function(y, et, nt) {
          var U, rt = nt === _e, it = rt ? "> " : Rt;
          return U = ut(e) ? Et((8 * (h.from + nt)).toString(16), p, "0") : Et((h.from + nt + 1).toString(), p, " "), [].concat(y, [it + U + " | " + et], rt ? [Rt + yt(" ", p) + " | " + Et("", a, " ") + yt("^", $)] : []);
        }, [], c).join(`
`);
      }
      function Ut(e, r) {
        return [`
`, "-- PARSING FAILED " + yt("-", 50), `

`, ke(e, r), `

`, (a = r.expected, a.length === 1 ? `Expected:

` + a[0] : `Expected one of the following: 

` + a.join(", ")), `
`].join("");
        var a;
      }
      function Wt(e) {
        return e.flags !== void 0 ? e.flags : [e.global ? "g" : "", e.ignoreCase ? "i" : "", e.multiline ? "m" : "", e.unicode ? "u" : "", e.sticky ? "y" : ""].join("");
      }
      function kt() {
        for (var e = [].slice.call(arguments), r = e.length, a = 0; a < r; a += 1)
          X(e[a]);
        return s(function(u, c) {
          for (var h, p = new Array(r), d = 0; d < r; d += 1) {
            if (!(h = P(e[d]._(u, c), h)).status)
              return h;
            p[d] = h.value, c = h.index;
          }
          return P(v(c, p), h);
        });
      }
      function R() {
        var e = [].slice.call(arguments);
        if (e.length === 0)
          throw new Error("seqMap needs at least one argument");
        var r = e.pop();
        return H(r), kt.apply(null, e).map(function(a) {
          return r.apply(null, a);
        });
      }
      function St() {
        var e = [].slice.call(arguments), r = e.length;
        if (r === 0)
          return $t("zero alternates");
        for (var a = 0; a < r; a += 1)
          X(e[a]);
        return s(function(u, c) {
          for (var h, p = 0; p < e.length; p += 1)
            if ((h = P(e[p]._(u, c), h)).status)
              return h;
          return h;
        });
      }
      function Dt(e, r) {
        return Lt(e, r).or(z([]));
      }
      function Lt(e, r) {
        return X(e), X(r), R(e, r.then(e).many(), function(a, u) {
          return [a].concat(u);
        });
      }
      function ct(e) {
        ft(e);
        var r = "'" + e + "'";
        return s(function(a, u) {
          var c = u + e.length, h = a.slice(u, c);
          return h === e ? v(c, h) : O(u, r);
        });
      }
      function L(e, r) {
        (function(c) {
          if (!(c instanceof RegExp))
            throw new Error("not a regexp: " + c);
          for (var h = Wt(c), p = 0; p < h.length; p++) {
            var d = h.charAt(p);
            if (d !== "i" && d !== "m" && d !== "u" && d !== "s")
              throw new Error('unsupported regexp flag "' + d + '": ' + c);
          }
        })(e), arguments.length >= 2 ? Y(r) : r = 0;
        var a = function(c) {
          return RegExp("^(?:" + c.source + ")", Wt(c));
        }(e), u = "" + e;
        return s(function(c, h) {
          var p = a.exec(c.slice(h));
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
      function z(e) {
        return s(function(r, a) {
          return v(a, e);
        });
      }
      function $t(e) {
        return s(function(r, a) {
          return O(a, e);
        });
      }
      function jt(e) {
        if (ot(e))
          return s(function(r, a) {
            var u = e._(r, a);
            return u.index = a, u.value = "", u;
          });
        if (typeof e == "string")
          return jt(ct(e));
        if (e instanceof RegExp)
          return jt(L(e));
        throw new Error("not a string, regexp, or parser: " + e);
      }
      function Kt(e) {
        return X(e), s(function(r, a) {
          var u = e._(r, a), c = r.slice(a, u.index);
          return u.status ? O(a, 'not "' + c + '"') : v(a, null);
        });
      }
      function Ft(e) {
        return H(e), s(function(r, a) {
          var u = vt(r, a);
          return a < r.length && e(u) ? v(a + 1, u) : O(a, "a character/byte matching " + e);
        });
      }
      function Gt(e, r) {
        arguments.length < 2 && (r = e, e = void 0);
        var a = s(function(u, c) {
          return a._ = r()._, a._(u, c);
        });
        return e ? a.desc(e) : a;
      }
      function Tt() {
        return $t("fantasy-land/empty");
      }
      f.parse = function(e) {
        if (typeof e != "string" && !ut(e))
          throw new Error(".parse must be called with a string or Buffer as its argument");
        var r, a = this.skip(Vt)._(e, 0);
        return r = a.status ? { status: !0, value: a.value } : { status: !1, index: Ht(e, a.furthest), expected: a.expected }, delete wt[e], r;
      }, f.tryParse = function(e) {
        var r = this.parse(e);
        if (r.status)
          return r.value;
        var a = Ut(e, r), u = new Error(a);
        throw u.type = "ParsimmonError", u.result = r, u;
      }, f.assert = function(e, r) {
        return this.chain(function(a) {
          return e(a) ? z(a) : $t(r);
        });
      }, f.or = function(e) {
        return St(this, e);
      }, f.trim = function(e) {
        return this.wrap(e, e);
      }, f.wrap = function(e, r) {
        return R(e, this, r, function(a, u) {
          return u;
        });
      }, f.thru = function(e) {
        return e(this);
      }, f.then = function(e) {
        return X(e), kt(this, e).map(function(r) {
          return r[1];
        });
      }, f.many = function() {
        var e = this;
        return s(function(r, a) {
          for (var u = [], c = void 0; ; ) {
            if (!(c = P(e._(r, a), c)).status)
              return P(v(a, u), c);
            if (a === c.index)
              throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            a = c.index, u.push(c.value);
          }
        });
      }, f.tieWith = function(e) {
        return ft(e), this.map(function(r) {
          if (function(c) {
            if (!J(c))
              throw new Error("not an array: " + c);
          }(r), r.length) {
            ft(r[0]);
            for (var a = r[0], u = 1; u < r.length; u++)
              ft(r[u]), a += e + r[u];
            return a;
          }
          return "";
        });
      }, f.tie = function() {
        return this.tieWith("");
      }, f.times = function(e, r) {
        var a = this;
        return arguments.length < 2 && (r = e), Y(e), Y(r), s(function(u, c) {
          for (var h = [], p = void 0, d = void 0, x = 0; x < e; x += 1) {
            if (d = P(p = a._(u, c), d), !p.status)
              return d;
            c = p.index, h.push(p.value);
          }
          for (; x < r && (d = P(p = a._(u, c), d), p.status); x += 1)
            c = p.index, h.push(p.value);
          return P(v(c, h), d);
        });
      }, f.result = function(e) {
        return this.map(function() {
          return e;
        });
      }, f.atMost = function(e) {
        return this.times(0, e);
      }, f.atLeast = function(e) {
        return R(this.times(e), this.many(), function(r, a) {
          return r.concat(a);
        });
      }, f.map = function(e) {
        H(e);
        var r = this;
        return s(function(a, u) {
          var c = r._(a, u);
          return c.status ? P(v(c.index, e(c.value)), c) : c;
        });
      }, f.contramap = function(e) {
        H(e);
        var r = this;
        return s(function(a, u) {
          var c = r.parse(e(a.slice(u)));
          return c.status ? v(u + a.length, c.value) : c;
        });
      }, f.promap = function(e, r) {
        return H(e), H(r), this.contramap(e).map(r);
      }, f.skip = function(e) {
        return kt(this, e).map(function(r) {
          return r[0];
        });
      }, f.mark = function() {
        return R(lt, this, lt, function(e, r, a) {
          return { start: e, value: r, end: a };
        });
      }, f.node = function(e) {
        return R(lt, this, lt, function(r, a, u) {
          return { name: e, value: a, start: r, end: u };
        });
      }, f.sepBy = function(e) {
        return Dt(this, e);
      }, f.sepBy1 = function(e) {
        return Lt(this, e);
      }, f.lookahead = function(e) {
        return this.skip(jt(e));
      }, f.notFollowedBy = function(e) {
        return this.skip(Kt(e));
      }, f.desc = function(e) {
        J(e) || (e = [e]);
        var r = this;
        return s(function(a, u) {
          var c = r._(a, u);
          return c.status || (c.expected = e), c;
        });
      }, f.fallback = function(e) {
        return this.or(z(e));
      }, f.ap = function(e) {
        return R(e, this, function(r, a) {
          return r(a);
        });
      }, f.chain = function(e) {
        var r = this;
        return s(function(a, u) {
          var c = r._(a, u);
          return c.status ? P(e(c.value)._(a, c.index), c) : c;
        });
      }, f.concat = f.or, f.empty = Tt, f.of = z, f["fantasy-land/ap"] = f.ap, f["fantasy-land/chain"] = f.chain, f["fantasy-land/concat"] = f.concat, f["fantasy-land/empty"] = f.empty, f["fantasy-land/of"] = f.of, f["fantasy-land/map"] = f.map;
      var lt = s(function(e, r) {
        return v(r, Ht(e, r));
      }), Se = s(function(e, r) {
        return r >= e.length ? O(r, "any character/byte") : v(r + 1, vt(e, r));
      }), $e = s(function(e, r) {
        return v(e.length, e.slice(r));
      }), Vt = s(function(e, r) {
        return r < e.length ? O(r, "EOF") : v(r, null);
      }), je = L(/[0-9]/).desc("a digit"), Fe = L(/[0-9]*/).desc("optional digits"), Oe = L(/[a-z]/i).desc("a letter"), Be = L(/[a-z]*/i).desc("optional letters"), Pe = L(/\s*/).desc("optional whitespace"), Ne = L(/\s+/).desc("whitespace"), Qt = ct("\r"), Zt = ct(`
`), Jt = ct(`\r
`), Xt = St(Jt, Zt, Qt).desc("newline"), Me = St(Xt, Vt);
      s.all = $e, s.alt = St, s.any = Se, s.cr = Qt, s.createLanguage = function(e) {
        var r = {};
        for (var a in e)
          ({}).hasOwnProperty.call(e, a) && function(u) {
            r[u] = Gt(function() {
              return e[u](r);
            });
          }(a);
        return r;
      }, s.crlf = Jt, s.custom = function(e) {
        return s(e(v, O));
      }, s.digit = je, s.digits = Fe, s.empty = Tt, s.end = Me, s.eof = Vt, s.fail = $t, s.formatError = Ut, s.index = lt, s.isParser = ot, s.lazy = Gt, s.letter = Oe, s.letters = Be, s.lf = Zt, s.lookahead = jt, s.makeFailure = O, s.makeSuccess = v, s.newline = Xt, s.noneOf = function(e) {
        return Ft(function(r) {
          return e.indexOf(r) < 0;
        }).desc("none of '" + e + "'");
      }, s.notFollowedBy = Kt, s.of = z, s.oneOf = function(e) {
        for (var r = e.split(""), a = 0; a < r.length; a++)
          r[a] = "'" + r[a] + "'";
        return Ft(function(u) {
          return e.indexOf(u) >= 0;
        }).desc(r);
      }, s.optWhitespace = Pe, s.Parser = s, s.range = function(e, r) {
        return Ft(function(a) {
          return e <= a && a <= r;
        }).desc(e + "-" + r);
      }, s.regex = L, s.regexp = L, s.sepBy = Dt, s.sepBy1 = Lt, s.seq = kt, s.seqMap = R, s.seqObj = function() {
        for (var e, r = {}, a = 0, u = (e = arguments, Array.prototype.slice.call(e)), c = u.length, h = 0; h < c; h += 1) {
          var p = u[h];
          if (!ot(p)) {
            if (J(p) && p.length === 2 && typeof p[0] == "string" && ot(p[1])) {
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
        return s(function(x, $) {
          for (var E, T = {}, B = 0; B < c; B += 1) {
            var V, tt;
            if (J(u[B]) ? (V = u[B][0], tt = u[B][1]) : (V = null, tt = u[B]), !(E = P(tt._(x, $), E)).status)
              return E;
            V && (T[V] = E.value), $ = E.index;
          }
          return P(v($, T), E);
        });
      }, s.string = ct, s.succeed = z, s.takeWhile = function(e) {
        return H(e), s(function(r, a) {
          for (var u = a; u < r.length && e(vt(r, u)); )
            u++;
          return v(u, r.slice(a, u));
        });
      }, s.test = Ft, s.whitespace = Ne, s["fantasy-land/empty"] = Tt, s["fantasy-land/of"] = z, s.Binary = { bitSeq: Q, bitSeqObj: function(e) {
        A();
        var r = {}, a = 0, u = S(function(h) {
          if (J(h)) {
            var p = h;
            if (p.length !== 2)
              throw new Error("[" + p.join(", ") + "] should be length 2, got length " + p.length);
            if (ft(p[0]), Y(p[1]), Object.prototype.hasOwnProperty.call(r, p[0]))
              throw new Error("duplicate key in bitSeqObj: " + p[0]);
            return r[p[0]] = !0, a++, p;
          }
          return Y(h), [null, h];
        }, e);
        if (a < 1)
          throw new Error("bitSeqObj expects at least one named pair, got [" + e.join(", ") + "]");
        var c = S(function(h) {
          return h[0];
        }, u);
        return Q(S(function(h) {
          return h[1];
        }, u)).map(function(h) {
          return b(function(p, d) {
            return d[0] !== null && (p[d[0]] = d[1]), p;
          }, {}, S(function(p, d) {
            return [p, h[d]];
          }, c));
        });
      }, byte: function(e) {
        if (A(), Y(e), e > 255)
          throw new Error("Value specified to byte constructor (" + e + "=0x" + e.toString(16) + ") is larger in value than a single byte.");
        var r = (e > 15 ? "0x" : "0x0") + e.toString(16);
        return s(function(a, u) {
          var c = vt(a, u);
          return c === e ? v(u + 1, c) : O(u, r);
        });
      }, buffer: function(e) {
        return w("buffer", e).map(function(r) {
          return Buffer.from(r);
        });
      }, encodedString: function(e, r) {
        return w("string", r).map(function(a) {
          return a.toString(e);
        });
      }, uintBE: C, uint8BE: C(1), uint16BE: C(2), uint32BE: C(4), uintLE: Z, uint8LE: Z(1), uint16LE: Z(2), uint32LE: Z(4), intBE: xt, int8BE: xt(1), int16BE: xt(2), int32BE: xt(4), intLE: bt, int8LE: bt(1), int16LE: bt(2), int32LE: bt(4), floatBE: w("floatBE", 4).map(function(e) {
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
})(cn);
const m = /* @__PURE__ */ fn(It), oe = (t, n) => {
  const i = getComputedStyle(t).getPropertyValue("--" + n), o = Ct.valueUnit.parse(i);
  return o.status ? o.value : void 0;
};
class N {
  constructor(n, i) {
    this.value = n, this.unit = i;
    const o = gt(n);
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
      const l = {
        r: st(n, this.value.r, i.value.r),
        g: st(n, this.value.g, i.value.g),
        b: st(n, this.value.b, i.value.b)
      };
      return new N(l, this.unit);
    } else if (o && (this.unit === "var" || i.unit === "var")) {
      const l = this.unit === "var" ? oe(o, this.value) : this, s = i.unit === "var" ? oe(o, i.value) : i;
      return l.lerp(n, s, o);
    } else if (this.unit !== i.unit) {
      const l = ue(this.value, this.unit, o), s = ue(i.value, i.unit, o), f = st(n, l, s);
      return new N(f, "px");
    } else {
      const l = st(n, this.value, i.value);
      return new N(l, this.unit);
    }
  }
}
class D {
  constructor(n, i) {
    this.name = n, this.values = i;
  }
  toString() {
    const n = this.values.map((i) => i.toString()).join(", ");
    return `${this.name}(${n})`;
  }
  lerp(n, i, o) {
    const l = Math.min(this.values.length, i.values.length), s = [];
    for (let f = 0; f < l; f++) {
      const g = this.values[f], b = i.values[f];
      s.push(g.lerp(n, b, o));
    }
    return new D(this.name, s);
  }
}
class dt {
  constructor(n) {
    this.values = n;
  }
  toString() {
    return this.values.map((n) => n.toString()).join(" ");
  }
  lerp(n, i, o) {
    const l = Math.min(this.values.length, i.values.length), s = [];
    for (let f = 0; f < l; f++) {
      const g = this.values[f], b = i.values[f];
      s.push(g.lerp(n, b, o));
    }
    return new dt(s);
  }
}
function ln(t, n) {
  let i = t;
  return n === "cm" ? i *= 96 / 2.54 : n === "mm" ? i *= 96 / 25.4 : n === "in" ? i *= 96 : n === "pt" ? i *= 4 / 3 : n === "pc" && (i *= 16), i;
}
function ue(t, n, i, o) {
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
    const l = parseFloat(
      getComputedStyle(i.parentElement).getPropertyValue(o)
    );
    t = t / 100 * l;
  } else
    t = ln(t, n);
  return t;
}
const hn = (t) => t.replace(
  /([-_][a-z])/gi,
  (n) => n.toUpperCase().replace("-", "").replace("_", "")
), xe = (t) => m((n, i) => n.slice(i).toLowerCase().startsWith(t.toLowerCase()) ? m.makeSuccess(i + t.length, t) : m.makeFailure(i, `Expected ${t}`)), Pt = (t, n, i, o) => (i = i ?? t.lparen, o = o ?? t.rparen, t.ws.skip(i).skip(t.ws).then(n).skip(t.ws).skip(o).skip(t.ws)), pn = m.createLanguage({
  number: () => m.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),
  unit: () => m.regexp(/[a-zA-Z%]+/),
  numberValue: (t) => t.number.map((n) => new N(n)),
  unitValue: (t) => m.seq(t.number, t.unit).map(([n, i]) => new N(n, i)),
  colorValue: () => m((t, n) => {
    var l;
    const i = t.slice(n), o = (l = gt(i)) == null ? void 0 : l.rgb();
    return o ? m.makeSuccess(n + t.length, new N(o, "color")) : m.makeFailure(n, "Invalid color");
  }),
  value: (t) => m.alt(t.colorValue, t.unitValue, t.numberValue)
}), dn = ["translate", "scale", "rotate", "skew"].map(xe), mn = ["x", "y", "z"].map(xe), Ct = m.createLanguage({
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
  unitValue: () => m.regexp(/[^(){},;\s]+/).map((t) => new N(t)),
  valueUnit: (t) => t.ws.then(m.alt(pn.value, t.unitValue)).skip(t.ws),
  transforms: (t) => m.seq(
    m.alt(...dn),
    m.alt(...mn, m.string("")),
    Pt(t, t.functionValuePart)
  ).map(([n, i, o]) => (n = n.toLowerCase(), i ? new D(n + i.toUpperCase(), [o[0]]) : o.length === 1 ? new D(n, [o[0]]) : new D(n, o))),
  variable: (t) => m.string("var").then(Pt(t, m.string("--").then(t.identifier))).map((n) => new N(n, "var")),
  calc: (t) => m.string("calc").then(Pt(t, t.valuePart.many())).map((n) => new N(n, "calc")),
  functionValuePart: (t) => t.valuePart.sepBy(t.commaWhitespace),
  functionValue: (t) => m.alt(
    t.transforms,
    t.variable,
    t.calc,
    m.seq(t.identifier, Pt(t, t.functionValuePart)).map(
      ([n, i]) => new D(n, i)
    )
  ),
  valuePart: (t) => m.alt(t.functionValue, t.valueUnit).skip(t.ws),
  value: (t) => t.valuePart.sepBy(t.ws).map((n) => new dt(n)),
  values: (t) => m.seq(
    t.identifier.skip(t.ws).skip(t.colon).skip(t.ws).map((n) => hn(n)),
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
}), gn = (t) => Ct.keyframe.tryParse(t), fe = (t) => Ct.percent.tryParse(String(t));
async function ce(t) {
  return await new Promise((n) => setTimeout(n, t));
}
function xn(t) {
  const n = {}, i = (o, l = "") => {
    if (o instanceof N || o instanceof D || o instanceof dt)
      return o instanceof N ? new dt([o]) : o;
    if (typeof o == "object")
      for (const [f, g] of Object.entries(o)) {
        const b = l ? `${l}.${f}` : f, S = i(g, b);
        S !== void 0 && (n[b] = S);
      }
    else {
      const f = Ct.value.parse(String(o));
      return f.status ? f.value : void 0;
    }
  };
  return i(t), n;
}
function bn(t, n, i) {
  const o = t.split(".");
  let l = i;
  for (let s = 0; s < o.length; s++) {
    const f = o[s];
    n !== void 0 && s === o.length - 1 ? l[f] = n.toString() : l = l[f] ?? (l[f] = {});
  }
  return i;
}
async function wn(t, n = 1e3 / 60) {
  return await new Promise((i) => {
    const o = setInterval(() => {
      t() && (clearInterval(o), i());
    }, n);
  });
}
const kn = {
  easeInQuad: Ie,
  easeOutQuad: Ae,
  easeInOutQuad: He,
  easeInCubic: Re,
  easeOutCubic: ze,
  easeInOutCubic: pe,
  easeInBounce: We,
  bounceInEase: De,
  bounceInEaseHalf: Ke,
  smoothStep3: Ue
};
function le(t, n, i) {
  let [o, l] = [t.start, n.start];
  return o = o * i / 100, l = l * i / 100, {
    start: o,
    stop: l
  };
}
function he(t, n, i) {
  for (let o = t - 1; o >= 0; o--)
    if (i(n[o]))
      return o;
}
function vn(t, n, i, o, l) {
  const [s, f] = [n[t], n[t + 1]], [g, b] = [i[t], i[t + 1]], S = le(s, f, o), I = {}, G = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(b)])], A = (w, F, C) => ({
    start: i[F][w],
    stop: i[C][w]
  });
  G.forEach((w) => {
    if (w in g && w in b)
      I[w] = A(w, t, t + 1);
    else if (!(w in g) && w in b) {
      const F = he(t, i, (Z) => w in Z);
      if (F == null)
        return;
      const C = l[F];
      C.time = le(
        n[F],
        f,
        o
      ), C.interpVars[w] = A(w, F, t + 1);
    }
  });
  let Q = s.transform;
  if (Q == null) {
    const w = he(t, l, (F) => F.transform != null);
    Q = l[w].transform;
  }
  return {
    id: s.id,
    time: S,
    interpVars: I,
    transform: Q,
    timingFunction: s.timingFunction
  };
}
const be = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: pe
};
class yn {
  constructor(n, i = document.documentElement) {
    k(this, "options");
    k(this, "templateFrames", []);
    k(this, "transformedVars", []);
    k(this, "frameId", 0);
    k(this, "frames", []);
    k(this, "startTime");
    k(this, "pausedTime", 0);
    k(this, "prevTime", 0);
    k(this, "t");
    k(this, "started", !1);
    k(this, "done", !1);
    k(this, "reversed", !1);
    k(this, "paused", !1);
    this.target = i, this.options = { ...be, ...n };
  }
  frame(n, i, o, l) {
    const s = {
      id: this.frameId,
      start: n,
      vars: i,
      transform: o,
      timingFunction: l ?? this.options.timingFunction
    };
    return this.templateFrames.push(s), this.frameId += 1, this;
  }
  transformVars() {
    return this.transformedVars = this.templateFrames.map((n) => xn(n.vars)), this;
  }
  parseFrames() {
    this.templateFrames.sort((n, i) => n.start - i.start);
    for (let n = 0; n < this.templateFrames.length - 1; n++) {
      const i = vn(
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
      const l = this.frames[o], { start: s, stop: f } = l.time;
      if (n < s || n > f)
        continue;
      const g = Te(n, s, f, 0, 1), b = l.timingFunction(g);
      for (const [S, I] of Object.entries(l.interpVars)) {
        const G = I.start.lerp(b, I.stop, this.target);
        bn(S, G, i);
      }
      l.transform(n, i);
    }
  }
  async onStart() {
    (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && await ce(this.options.delay), this.started = !0, this.done = !1;
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
      n > 0 && (this.options.direction === "alternate" || this.options.direction === "alternate-reverse") && this.reverse(), requestAnimationFrame(this.draw.bind(this)), await ce(this.options.duration), await wn(() => this.done);
    this.started = !1;
  }
}
class Sn {
  constructor(n = {}, ...i) {
    k(this, "options");
    k(this, "targets");
    k(this, "animation");
    this.options = { ...be, ...n }, this.targets = i;
  }
  initAnimation() {
    var n;
    return this.animation = new yn(this.options, (n = this.targets) == null ? void 0 : n[0]), this;
  }
  fromFramesDefaultTransform(n) {
    this.initAnimation();
    for (const [i, o] of Object.entries(n))
      this.animation.frame(
        fe(i),
        o,
        this.transform.bind(this)
      );
    return this.animation.parse(), this;
  }
  fromVars(n, i) {
    this.initAnimation();
    for (let o = 0; o < n.length; o++) {
      const l = n[o], s = Math.round(o / (n.length - 1) * 100);
      this.animation.frame(s, l, i);
    }
    return this.animation.parse(), this;
  }
  fromFrames(n) {
    this.initAnimation();
    for (const [i, o] of Object.entries(n)) {
      const [l, s, f] = o;
      this.animation.frame(
        fe(i),
        l,
        s,
        f
      );
    }
    return this.animation.parse(), this;
  }
  fromCSSKeyframes(n) {
    this.initAnimation();
    const i = gn(n);
    for (const [o, l] of Object.entries(i))
      this.animation.frame(Number(o), l, this.transform.bind(this)), this.animation.transformedVars.push(l);
    return this.animation.parseFrames(), this;
  }
  transform(n, i) {
    for (const [o, l] of Object.entries(i)) {
      if (typeof l == "object") {
        let s = "";
        for (const [f, g] of Object.entries(l))
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
  yn as Animation,
  Sn as CSSKeyframesAnimation,
  kn as easingFunctions,
  vn as parseTemplateFrame
};
