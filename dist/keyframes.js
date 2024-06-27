var Ke = Object.defineProperty;
var Xe = (e, t, n) => t in e ? Ke(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var v = (e, t, n) => Xe(e, typeof t != "symbol" ? t + "" : t, n);
function clamp(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
function scale(e, t, n, o = 0, u = 1) {
  const a = (u - o) / (n - t);
  return (e - t) * a + o;
}
function lerp(e, t, n) {
  return (1 - e) * t + e * n;
}
function deCasteljau(e, t) {
  const n = t.length - 1, o = [...t];
  for (let u = 1; u <= n; u++)
    for (let a = 0; a <= n - u; a++)
      o[a] = lerp(e, o[a], o[a + 1]);
  return o[0];
}
function cubicBezier(e, t, n, o, u) {
  return [deCasteljau(e, [0, t, o, 1]), deCasteljau(e, [0, n, u, 1])];
}
function interpBezier(e, t) {
  const n = t.map((u) => u[0]), o = t.map((u) => u[1]);
  return [deCasteljau(e, n), deCasteljau(e, o)];
}
function linear(e) {
  return e;
}
function easeInQuad(e) {
  return e * e;
}
function easeOutQuad(e) {
  return -e * (e - 2);
}
function easeInOutQuad(e) {
  return (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
}
function easeInCubic(e) {
  return e * e * e;
}
function easeOutCubic(e) {
  return (e = e - 1) * e * e + 1;
}
function easeInOutCubic(e) {
  return (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
}
function smoothStep3(e) {
  return e * e * (3 - 2 * e);
}
const CSSBezier = (e, t, n, o) => (u) => (u = cubicBezier(u, e, t, n, o)[1], u);
function easeInBounce(e) {
  return e = CSSBezier(0.09, 0.91, 0.5, 1.5)(e), e;
}
function bounceInEase(e) {
  return e = CSSBezier(0.09, 0.91, 0.5, 1.5)(e), e;
}
function bounceInEaseHalf(e) {
  return e = interpBezier(e, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], e;
}
function jumpStart(e, t) {
  return Math.floor(e * t) / t;
}
function jumpEnd(e, t) {
  return Math.ceil(e * t) / t;
}
function jumpBoth(e, t) {
  return e === 0 || e === 1 ? e : jumpStart(e, t);
}
function jumpNone(e, t) {
  return Math.round(e * t) / t;
}
function steppedEase(e, t = "jump-start") {
  switch (t) {
    case "jump-none":
      return (n) => jumpNone(n, e);
    case "jump-start":
    case "start":
      return (n) => jumpStart(n, e);
    case "jump-end":
    case "end":
      return (n) => jumpEnd(n, e);
    case "jump-both":
    case "both":
      return (n) => jumpBoth(n, e);
  }
}
function stepStart() {
  return steppedEase(1, "jump-start");
}
function stepEnd() {
  return steppedEase(1, "jump-end");
}
const bezierPresets = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "ease-in-back": [0.6, -0.28, 0.735, 0.045],
  "ease-out-back": [0.175, 0.885, 0.32, 1.275],
  "ease-in-out-back": [0.68, -0.55, 0.265, 1.55]
}, timingFunctions = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInBounce,
  bounceInEase,
  bounceInEaseHalf,
  smoothStep3,
  ease: CSSBezier(...bezierPresets.ease),
  "ease-in": CSSBezier(...bezierPresets["ease-in"]),
  "ease-out": CSSBezier(...bezierPresets["ease-out"]),
  "ease-in-out": CSSBezier(...bezierPresets["ease-in-out"]),
  "ease-in-back": CSSBezier(...bezierPresets["ease-in-back"]),
  "ease-out-back": CSSBezier(...bezierPresets["ease-out-back"]),
  "ease-in-out-back": CSSBezier(...bezierPresets["ease-in-out-back"]),
  steps: steppedEase,
  "step-start": stepStart,
  "step-end": stepEnd
};
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function getDefaultExportFromCjs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var parsimmon_umd_min = { exports: {} };
(function(e, t) {
  (function(n, o) {
    e.exports = o();
  })(typeof self < "u" ? self : commonjsGlobal, function() {
    return function(n) {
      var o = {};
      function u(a) {
        if (o[a]) return o[a].exports;
        var f = o[a] = { i: a, l: !1, exports: {} };
        return n[a].call(f.exports, f, f.exports, u), f.l = !0, f.exports;
      }
      return u.m = n, u.c = o, u.d = function(a, f, g) {
        u.o(a, f) || Object.defineProperty(a, f, { configurable: !1, enumerable: !0, get: g });
      }, u.r = function(a) {
        Object.defineProperty(a, "__esModule", { value: !0 });
      }, u.n = function(a) {
        var f = a && a.__esModule ? function() {
          return a.default;
        } : function() {
          return a;
        };
        return u.d(f, "a", f), f;
      }, u.o = function(a, f) {
        return Object.prototype.hasOwnProperty.call(a, f);
      }, u.p = "", u(u.s = 0);
    }([function(n, o, u) {
      function a(i) {
        if (!(this instanceof a)) return new a(i);
        this._ = i;
      }
      var f = a.prototype;
      function g(i, l) {
        for (var c = 0; c < i; c++) l(c);
      }
      function b(i, l, c) {
        return function(d, h) {
          g(h.length, function(p) {
            d(h[p], p, h);
          });
        }(function(d, h, p) {
          l = i(l, d, h, p);
        }, c), l;
      }
      function y(i, l) {
        return b(function(c, d, h, p) {
          return c.concat([i(d, h, p)]);
        }, [], l);
      }
      function T(i, l) {
        var c = { v: 0, buf: l };
        return g(i, function() {
          var d;
          c = { v: c.v << 1 | (d = c.buf, d[0] >> 7), buf: function(h) {
            var p = b(function(m, w, k, O) {
              return m.concat(k === O.length - 1 ? Buffer.from([w, 0]).readUInt16BE(0) : O.readUInt16BE(k));
            }, [], h);
            return Buffer.from(y(function(m) {
              return (m << 1 & 65535) >> 8;
            }, p));
          }(c.buf) };
        }), c;
      }
      function W() {
        return typeof Buffer < "u";
      }
      function z() {
        if (!W()) throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function _(i) {
        z();
        var l = b(function(p, m) {
          return p + m;
        }, 0, i);
        if (l % 8 != 0) throw new Error("The bits [" + i.join(", ") + "] add up to " + l + " which is not an even number of bytes; the total should be divisible by 8");
        var c, d = l / 8, h = (c = function(p) {
          return p > 48;
        }, b(function(p, m) {
          return p || (c(m) ? m : p);
        }, null, i));
        if (h) throw new Error(h + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new a(function(p, m) {
          var w = d + m;
          return w > p.length ? F(m, d.toString() + " bytes") : C(w, b(function(k, O) {
            var E = T(O, k.buf);
            return { coll: k.coll.concat(E.v), buf: E.buf };
          }, { coll: [], buf: p.slice(m, w) }, i).coll);
        });
      }
      function S(i, l) {
        return new a(function(c, d) {
          return z(), d + l > c.length ? F(d, l + " bytes for " + i) : C(d + l, c.slice(d, d + l));
        });
      }
      function V(i, l) {
        if (typeof (c = l) != "number" || Math.floor(c) !== c || l < 0 || l > 6) throw new Error(i + " requires integer length in range [0, 6].");
        var c;
      }
      function A(i) {
        return V("uintBE", i), S("uintBE(" + i + ")", i).map(function(l) {
          return l.readUIntBE(0, i);
        });
      }
      function D(i) {
        return V("uintLE", i), S("uintLE(" + i + ")", i).map(function(l) {
          return l.readUIntLE(0, i);
        });
      }
      function se(i) {
        return V("intBE", i), S("intBE(" + i + ")", i).map(function(l) {
          return l.readIntBE(0, i);
        });
      }
      function le(i) {
        return V("intLE", i), S("intLE(" + i + ")", i).map(function(l) {
          return l.readIntLE(0, i);
        });
      }
      function re(i) {
        return i instanceof a;
      }
      function G(i) {
        return {}.toString.call(i) === "[object Array]";
      }
      function ne(i) {
        return W() && Buffer.isBuffer(i);
      }
      function C(i, l) {
        return { status: !0, index: i, value: l, furthest: -1, expected: [] };
      }
      function F(i, l) {
        return G(l) || (l = [l]), { status: !1, index: -1, value: null, furthest: i, expected: l };
      }
      function M(i, l) {
        if (!l || i.furthest > l.furthest) return i;
        var c = i.furthest === l.furthest ? function(d, h) {
          if (function() {
            if (a._supportsSet !== void 0) return a._supportsSet;
            var L = typeof Set < "u";
            return a._supportsSet = L, L;
          }() && Array.from) {
            for (var p = new Set(d), m = 0; m < h.length; m++) p.add(h[m]);
            var w = Array.from(p);
            return w.sort(), w;
          }
          for (var k = {}, O = 0; O < d.length; O++) k[d[O]] = !0;
          for (var E = 0; E < h.length; E++) k[h[E]] = !0;
          var j = [];
          for (var I in k) ({}).hasOwnProperty.call(k, I) && j.push(I);
          return j.sort(), j;
        }(i.expected, l.expected) : l.expected;
        return { status: i.status, index: i.index, value: i.value, furthest: l.furthest, expected: c };
      }
      var ue = {};
      function ke(i, l) {
        if (ne(i)) return { offset: l, line: -1, column: -1 };
        i in ue || (ue[i] = {});
        for (var c = ue[i], d = 0, h = 0, p = 0, m = l; m >= 0; ) {
          if (m in c) {
            d = c[m].line, p === 0 && (p = c[m].lineStart);
            break;
          }
          (i.charAt(m) === `
` || i.charAt(m) === "\r" && i.charAt(m + 1) !== `
`) && (h++, p === 0 && (p = m + 1)), m--;
        }
        var w = d + h, k = l - p;
        return c[l] = { line: w, lineStart: p }, { offset: l, line: w + 1, column: k + 1 };
      }
      function X(i) {
        if (!re(i)) throw new Error("not a parser: " + i);
      }
      function ce(i, l) {
        return typeof i == "string" ? i.charAt(l) : i[l];
      }
      function Y(i) {
        if (typeof i != "number") throw new Error("not a number: " + i);
      }
      function U(i) {
        if (typeof i != "function") throw new Error("not a function: " + i);
      }
      function ie(i) {
        if (typeof i != "string") throw new Error("not a string: " + i);
      }
      var Me = 2, Ae = 3, N = 8, Re = 5 * N, je = 4 * N, ve = "  ";
      function fe(i, l) {
        return new Array(l + 1).join(i);
      }
      function de(i, l, c) {
        var d = l - i.length;
        return d <= 0 ? i : fe(c, d) + i;
      }
      function Se(i, l, c, d) {
        return { from: i - l > 0 ? i - l : 0, to: i + c > d ? d : i + c };
      }
      function Le(i, l) {
        var c, d, h, p, m, w = l.index, k = w.offset, O = 1;
        if (k === i.length) return "Got the end of the input";
        if (ne(i)) {
          var E = k - k % N, j = k - E, I = Se(E, Re, je + N, i.length), L = y(function(B) {
            return y(function(Z) {
              return de(Z.toString(16), 2, "0");
            }, B);
          }, function(B, Z) {
            var J = B.length, H = [], ee = 0;
            if (J <= Z) return [B.slice()];
            for (var te = 0; te < J; te++) H[ee] || H.push([]), H[ee].push(B[te]), (te + 1) % Z == 0 && ee++;
            return H;
          }(i.slice(I.from, I.to).toJSON().data, N));
          p = function(B) {
            return B.from === 0 && B.to === 1 ? { from: B.from, to: B.to } : { from: B.from / N, to: Math.floor(B.to / N) };
          }(I), d = E / N, c = 3 * j, j >= 4 && (c += 1), O = 2, h = y(function(B) {
            return B.length <= 4 ? B.join(" ") : B.slice(0, 4).join(" ") + "  " + B.slice(4).join(" ");
          }, L), (m = (8 * (p.to > 0 ? p.to - 1 : p.to)).toString(16).length) < 2 && (m = 2);
        } else {
          var Q = i.split(/\r\n|[\n\r\u2028\u2029]/);
          c = w.column - 1, d = w.line - 1, p = Se(d, Me, Ae, Q.length), h = Q.slice(p.from, p.to), m = p.to.toString().length;
        }
        var Ge = d - p.from;
        return ne(i) && (m = (8 * (p.to > 0 ? p.to - 1 : p.to)).toString(16).length) < 2 && (m = 2), b(function(B, Z, J) {
          var H, ee = J === Ge, te = ee ? "> " : ve;
          return H = ne(i) ? de((8 * (p.from + J)).toString(16), m, "0") : de((p.from + J + 1).toString(), m, " "), [].concat(B, [te + H + " | " + Z], ee ? [ve + fe(" ", m) + " | " + de("", c, " ") + fe("^", O)] : []);
        }, [], h).join(`
`);
      }
      function Pe(i, l) {
        return [`
`, "-- PARSING FAILED " + fe("-", 50), `

`, Le(i, l), `

`, (c = l.expected, c.length === 1 ? `Expected:

` + c[0] : `Expected one of the following: 

` + c.join(", ")), `
`].join("");
        var c;
      }
      function Ce(i) {
        return i.flags !== void 0 ? i.flags : [i.global ? "g" : "", i.ignoreCase ? "i" : "", i.multiline ? "m" : "", i.unicode ? "u" : "", i.sticky ? "y" : ""].join("");
      }
      function he() {
        for (var i = [].slice.call(arguments), l = i.length, c = 0; c < l; c += 1) X(i[c]);
        return a(function(d, h) {
          for (var p, m = new Array(l), w = 0; w < l; w += 1) {
            if (!(p = M(i[w]._(d, h), p)).status) return p;
            m[w] = p.value, h = p.index;
          }
          return M(C(h, m), p);
        });
      }
      function $() {
        var i = [].slice.call(arguments);
        if (i.length === 0) throw new Error("seqMap needs at least one argument");
        var l = i.pop();
        return U(l), he.apply(null, i).map(function(c) {
          return l.apply(null, c);
        });
      }
      function pe() {
        var i = [].slice.call(arguments), l = i.length;
        if (l === 0) return me("zero alternates");
        for (var c = 0; c < l; c += 1) X(i[c]);
        return a(function(d, h) {
          for (var p, m = 0; m < i.length; m += 1) if ((p = M(i[m]._(d, h), p)).status) return p;
          return p;
        });
      }
      function Be(i, l) {
        return we(i, l).or(q([]));
      }
      function we(i, l) {
        return X(i), X(l), $(i, l.then(i).many(), function(c, d) {
          return [c].concat(d);
        });
      }
      function ae(i) {
        ie(i);
        var l = "'" + i + "'";
        return a(function(c, d) {
          var h = d + i.length, p = c.slice(d, h);
          return p === i ? C(h, p) : F(d, l);
        });
      }
      function R(i, l) {
        (function(h) {
          if (!(h instanceof RegExp)) throw new Error("not a regexp: " + h);
          for (var p = Ce(h), m = 0; m < p.length; m++) {
            var w = p.charAt(m);
            if (w !== "i" && w !== "m" && w !== "u" && w !== "s") throw new Error('unsupported regexp flag "' + w + '": ' + h);
          }
        })(i), arguments.length >= 2 ? Y(l) : l = 0;
        var c = function(h) {
          return RegExp("^(?:" + h.source + ")", Ce(h));
        }(i), d = "" + i;
        return a(function(h, p) {
          var m = c.exec(h.slice(p));
          if (m) {
            if (0 <= l && l <= m.length) {
              var w = m[0], k = m[l];
              return C(p + w.length, k);
            }
            return F(p, "valid match group (0 to " + m.length + ") in " + d);
          }
          return F(p, d);
        });
      }
      function q(i) {
        return a(function(l, c) {
          return C(c, i);
        });
      }
      function me(i) {
        return a(function(l, c) {
          return F(c, i);
        });
      }
      function ge(i) {
        if (re(i)) return a(function(l, c) {
          var d = i._(l, c);
          return d.index = c, d.value = "", d;
        });
        if (typeof i == "string") return ge(ae(i));
        if (i instanceof RegExp) return ge(R(i));
        throw new Error("not a string, regexp, or parser: " + i);
      }
      function Ee(i) {
        return X(i), a(function(l, c) {
          var d = i._(l, c), h = l.slice(c, d.index);
          return d.status ? F(c, 'not "' + h + '"') : C(c, null);
        });
      }
      function be(i) {
        return U(i), a(function(l, c) {
          var d = ce(l, c);
          return c < l.length && i(d) ? C(c + 1, d) : F(c, "a character/byte matching " + i);
        });
      }
      function Te(i, l) {
        arguments.length < 2 && (l = i, i = void 0);
        var c = a(function(d, h) {
          return c._ = l()._, c._(d, h);
        });
        return i ? c.desc(i) : c;
      }
      function ye() {
        return me("fantasy-land/empty");
      }
      f.parse = function(i) {
        if (typeof i != "string" && !ne(i)) throw new Error(".parse must be called with a string or Buffer as its argument");
        var l, c = this.skip(xe)._(i, 0);
        return l = c.status ? { status: !0, value: c.value } : { status: !1, index: ke(i, c.furthest), expected: c.expected }, delete ue[i], l;
      }, f.tryParse = function(i) {
        var l = this.parse(i);
        if (l.status) return l.value;
        var c = Pe(i, l), d = new Error(c);
        throw d.type = "ParsimmonError", d.result = l, d;
      }, f.assert = function(i, l) {
        return this.chain(function(c) {
          return i(c) ? q(c) : me(l);
        });
      }, f.or = function(i) {
        return pe(this, i);
      }, f.trim = function(i) {
        return this.wrap(i, i);
      }, f.wrap = function(i, l) {
        return $(i, this, l, function(c, d) {
          return d;
        });
      }, f.thru = function(i) {
        return i(this);
      }, f.then = function(i) {
        return X(i), he(this, i).map(function(l) {
          return l[1];
        });
      }, f.many = function() {
        var i = this;
        return a(function(l, c) {
          for (var d = [], h = void 0; ; ) {
            if (!(h = M(i._(l, c), h)).status) return M(C(c, d), h);
            if (c === h.index) throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            c = h.index, d.push(h.value);
          }
        });
      }, f.tieWith = function(i) {
        return ie(i), this.map(function(l) {
          if (function(h) {
            if (!G(h)) throw new Error("not an array: " + h);
          }(l), l.length) {
            ie(l[0]);
            for (var c = l[0], d = 1; d < l.length; d++) ie(l[d]), c += i + l[d];
            return c;
          }
          return "";
        });
      }, f.tie = function() {
        return this.tieWith("");
      }, f.times = function(i, l) {
        var c = this;
        return arguments.length < 2 && (l = i), Y(i), Y(l), a(function(d, h) {
          for (var p = [], m = void 0, w = void 0, k = 0; k < i; k += 1) {
            if (w = M(m = c._(d, h), w), !m.status) return w;
            h = m.index, p.push(m.value);
          }
          for (; k < l && (w = M(m = c._(d, h), w), m.status); k += 1) h = m.index, p.push(m.value);
          return M(C(h, p), w);
        });
      }, f.result = function(i) {
        return this.map(function() {
          return i;
        });
      }, f.atMost = function(i) {
        return this.times(0, i);
      }, f.atLeast = function(i) {
        return $(this.times(i), this.many(), function(l, c) {
          return l.concat(c);
        });
      }, f.map = function(i) {
        U(i);
        var l = this;
        return a(function(c, d) {
          var h = l._(c, d);
          return h.status ? M(C(h.index, i(h.value)), h) : h;
        });
      }, f.contramap = function(i) {
        U(i);
        var l = this;
        return a(function(c, d) {
          var h = l.parse(i(c.slice(d)));
          return h.status ? C(d + c.length, h.value) : h;
        });
      }, f.promap = function(i, l) {
        return U(i), U(l), this.contramap(i).map(l);
      }, f.skip = function(i) {
        return he(this, i).map(function(l) {
          return l[0];
        });
      }, f.mark = function() {
        return $(oe, this, oe, function(i, l, c) {
          return { start: i, value: l, end: c };
        });
      }, f.node = function(i) {
        return $(oe, this, oe, function(l, c, d) {
          return { name: i, value: c, start: l, end: d };
        });
      }, f.sepBy = function(i) {
        return Be(this, i);
      }, f.sepBy1 = function(i) {
        return we(this, i);
      }, f.lookahead = function(i) {
        return this.skip(ge(i));
      }, f.notFollowedBy = function(i) {
        return this.skip(Ee(i));
      }, f.desc = function(i) {
        G(i) || (i = [i]);
        var l = this;
        return a(function(c, d) {
          var h = l._(c, d);
          return h.status || (h.expected = i), h;
        });
      }, f.fallback = function(i) {
        return this.or(q(i));
      }, f.ap = function(i) {
        return $(i, this, function(l, c) {
          return l(c);
        });
      }, f.chain = function(i) {
        var l = this;
        return a(function(c, d) {
          var h = l._(c, d);
          return h.status ? M(i(h.value)._(c, h.index), h) : h;
        });
      }, f.concat = f.or, f.empty = ye, f.of = q, f["fantasy-land/ap"] = f.ap, f["fantasy-land/chain"] = f.chain, f["fantasy-land/concat"] = f.concat, f["fantasy-land/empty"] = f.empty, f["fantasy-land/of"] = f.of, f["fantasy-land/map"] = f.map;
      var oe = a(function(i, l) {
        return C(l, ke(i, l));
      }), Ne = a(function(i, l) {
        return l >= i.length ? F(l, "any character/byte") : C(l + 1, ce(i, l));
      }), ze = a(function(i, l) {
        return C(i.length, i.slice(l));
      }), xe = a(function(i, l) {
        return l < i.length ? F(l, "EOF") : C(l, null);
      }), Ue = R(/[0-9]/).desc("a digit"), $e = R(/[0-9]*/).desc("optional digits"), qe = R(/[a-z]/i).desc("a letter"), He = R(/[a-z]*/i).desc("optional letters"), We = R(/\s*/).desc("optional whitespace"), _e = R(/\s+/).desc("whitespace"), Oe = ae("\r"), Ve = ae(`
`), Fe = ae(`\r
`), Ie = pe(Fe, Ve, Oe).desc("newline"), De = pe(Ie, xe);
      a.all = ze, a.alt = pe, a.any = Ne, a.cr = Oe, a.createLanguage = function(i) {
        var l = {};
        for (var c in i) ({}).hasOwnProperty.call(i, c) && function(d) {
          l[d] = Te(function() {
            return i[d](l);
          });
        }(c);
        return l;
      }, a.crlf = Fe, a.custom = function(i) {
        return a(i(C, F));
      }, a.digit = Ue, a.digits = $e, a.empty = ye, a.end = De, a.eof = xe, a.fail = me, a.formatError = Pe, a.index = oe, a.isParser = re, a.lazy = Te, a.letter = qe, a.letters = He, a.lf = Ve, a.lookahead = ge, a.makeFailure = F, a.makeSuccess = C, a.newline = Ie, a.noneOf = function(i) {
        return be(function(l) {
          return i.indexOf(l) < 0;
        }).desc("none of '" + i + "'");
      }, a.notFollowedBy = Ee, a.of = q, a.oneOf = function(i) {
        for (var l = i.split(""), c = 0; c < l.length; c++) l[c] = "'" + l[c] + "'";
        return be(function(d) {
          return i.indexOf(d) >= 0;
        }).desc(l);
      }, a.optWhitespace = We, a.Parser = a, a.range = function(i, l) {
        return be(function(c) {
          return i <= c && c <= l;
        }).desc(i + "-" + l);
      }, a.regex = R, a.regexp = R, a.sepBy = Be, a.sepBy1 = we, a.seq = he, a.seqMap = $, a.seqObj = function() {
        for (var i, l = {}, c = 0, d = (i = arguments, Array.prototype.slice.call(i)), h = d.length, p = 0; p < h; p += 1) {
          var m = d[p];
          if (!re(m)) {
            if (G(m) && m.length === 2 && typeof m[0] == "string" && re(m[1])) {
              var w = m[0];
              if (Object.prototype.hasOwnProperty.call(l, w)) throw new Error("seqObj: duplicate key " + w);
              l[w] = !0, c++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (c === 0) throw new Error("seqObj expects at least one named parser, found zero");
        return a(function(k, O) {
          for (var E, j = {}, I = 0; I < h; I += 1) {
            var L, Q;
            if (G(d[I]) ? (L = d[I][0], Q = d[I][1]) : (L = null, Q = d[I]), !(E = M(Q._(k, O), E)).status) return E;
            L && (j[L] = E.value), O = E.index;
          }
          return M(C(O, j), E);
        });
      }, a.string = ae, a.succeed = q, a.takeWhile = function(i) {
        return U(i), a(function(l, c) {
          for (var d = c; d < l.length && i(ce(l, d)); ) d++;
          return C(d, l.slice(c, d));
        });
      }, a.test = be, a.whitespace = _e, a["fantasy-land/empty"] = ye, a["fantasy-land/of"] = q, a.Binary = { bitSeq: _, bitSeqObj: function(i) {
        z();
        var l = {}, c = 0, d = y(function(p) {
          if (G(p)) {
            var m = p;
            if (m.length !== 2) throw new Error("[" + m.join(", ") + "] should be length 2, got length " + m.length);
            if (ie(m[0]), Y(m[1]), Object.prototype.hasOwnProperty.call(l, m[0])) throw new Error("duplicate key in bitSeqObj: " + m[0]);
            return l[m[0]] = !0, c++, m;
          }
          return Y(p), [null, p];
        }, i);
        if (c < 1) throw new Error("bitSeqObj expects at least one named pair, got [" + i.join(", ") + "]");
        var h = y(function(p) {
          return p[0];
        }, d);
        return _(y(function(p) {
          return p[1];
        }, d)).map(function(p) {
          return b(function(m, w) {
            return w[0] !== null && (m[w[0]] = w[1]), m;
          }, {}, y(function(m, w) {
            return [m, p[w]];
          }, h));
        });
      }, byte: function(i) {
        if (z(), Y(i), i > 255) throw new Error("Value specified to byte constructor (" + i + "=0x" + i.toString(16) + ") is larger in value than a single byte.");
        var l = (i > 15 ? "0x" : "0x0") + i.toString(16);
        return a(function(c, d) {
          var h = ce(c, d);
          return h === i ? C(d + 1, h) : F(d, l);
        });
      }, buffer: function(i) {
        return S("buffer", i).map(function(l) {
          return Buffer.from(l);
        });
      }, encodedString: function(i, l) {
        return S("string", l).map(function(c) {
          return c.toString(i);
        });
      }, uintBE: A, uint8BE: A(1), uint16BE: A(2), uint32BE: A(4), uintLE: D, uint8LE: D(1), uint16LE: D(2), uint32LE: D(4), intBE: se, int8BE: se(1), int16BE: se(2), int32BE: se(4), intLE: le, int8LE: le(1), int16LE: le(2), int32LE: le(4), floatBE: S("floatBE", 4).map(function(i) {
        return i.readFloatBE(0);
      }), floatLE: S("floatLE", 4).map(function(i) {
        return i.readFloatLE(0);
      }), doubleBE: S("doubleBE", 8).map(function(i) {
        return i.readDoubleBE(0);
      }), doubleLE: S("doubleLE", 8).map(function(i) {
        return i.readDoubleLE(0);
      }) }, n.exports = a;
    }]);
  });
})(parsimmon_umd_min);
var parsimmon_umd_minExports = parsimmon_umd_min.exports;
const P = /* @__PURE__ */ getDefaultExportFromCjs(parsimmon_umd_minExports);
function define(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function extend(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function Color() {
}
var darker = 0.7, brighter = 1 / darker, reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`), named = {
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
define(Color, color, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = reHex.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? rgbn(t) : n === 3 ? new Rgb(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? rgba(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? rgba(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = reRgbInteger.exec(e)) ? new Rgb(t[1], t[2], t[3], 1) : (t = reRgbPercent.exec(e)) ? new Rgb(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = reRgbaInteger.exec(e)) ? rgba(t[1], t[2], t[3], t[4]) : (t = reRgbaPercent.exec(e)) ? rgba(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = reHslPercent.exec(e)) ? hsla(t[1], t[2] / 100, t[3] / 100, 1) : (t = reHslaPercent.exec(e)) ? hsla(t[1], t[2] / 100, t[3] / 100, t[4]) : named.hasOwnProperty(e) ? rgbn(named[e]) : e === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(e) {
  return new Rgb(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function rgba(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Rgb(e, t, n, o);
}
function rgbConvert(e) {
  return e instanceof Color || (e = color(e)), e ? (e = e.rgb(), new Rgb(e.r, e.g, e.b, e.opacity)) : new Rgb();
}
function rgb(e, t, n, o) {
  return arguments.length === 1 ? rgbConvert(e) : new Rgb(e, t, n, o ?? 1);
}
function Rgb(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
define(Rgb, rgb, extend(Color, {
  brighter(e) {
    return e = e == null ? brighter : Math.pow(brighter, e), new Rgb(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? darker : Math.pow(darker, e), new Rgb(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const e = clampa(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function clampa(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function clampi(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function hex(e) {
  return e = clampi(e), (e < 16 ? "0" : "") + e.toString(16);
}
function hsla(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Hsl(e, t, n, o);
}
function hslConvert(e) {
  if (e instanceof Hsl) return new Hsl(e.h, e.s, e.l, e.opacity);
  if (e instanceof Color || (e = color(e)), !e) return new Hsl();
  if (e instanceof Hsl) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, u = Math.min(t, n, o), a = Math.max(t, n, o), f = NaN, g = a - u, b = (a + u) / 2;
  return g ? (t === a ? f = (n - o) / g + (n < o) * 6 : n === a ? f = (o - t) / g + 2 : f = (t - n) / g + 4, g /= b < 0.5 ? a + u : 2 - a - u, f *= 60) : g = b > 0 && b < 1 ? 0 : f, new Hsl(f, g, b, e.opacity);
}
function hsl(e, t, n, o) {
  return arguments.length === 1 ? hslConvert(e) : new Hsl(e, t, n, o ?? 1);
}
function Hsl(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
define(Hsl, hsl, extend(Color, {
  brighter(e) {
    return e = e == null ? brighter : Math.pow(brighter, e), new Hsl(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? darker : Math.pow(darker, e), new Hsl(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, u = 2 * n - o;
    return new Rgb(
      hsl2rgb(e >= 240 ? e - 240 : e + 120, u, o),
      hsl2rgb(e, u, o),
      hsl2rgb(e < 120 ? e + 240 : e - 120, u, o),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = clampa(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function clamph(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function clampt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function hsl2rgb(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const radians = Math.PI / 180, degrees = 180 / Math.PI, K = 18, Xn = 0.96422, Yn = 1, Zn = 0.82521, t0 = 4 / 29, t1 = 6 / 29, t2 = 3 * t1 * t1, t3 = t1 * t1 * t1;
function labConvert(e) {
  if (e instanceof Lab) return new Lab(e.l, e.a, e.b, e.opacity);
  if (e instanceof Hcl) return hcl2lab(e);
  e instanceof Rgb || (e = rgbConvert(e));
  var t = rgb2lrgb(e.r), n = rgb2lrgb(e.g), o = rgb2lrgb(e.b), u = xyz2lab((0.2225045 * t + 0.7168786 * n + 0.0606169 * o) / Yn), a, f;
  return t === n && n === o ? a = f = u : (a = xyz2lab((0.4360747 * t + 0.3850649 * n + 0.1430804 * o) / Xn), f = xyz2lab((0.0139322 * t + 0.0971045 * n + 0.7141733 * o) / Zn)), new Lab(116 * u - 16, 500 * (a - u), 200 * (u - f), e.opacity);
}
function lab(e, t, n, o) {
  return arguments.length === 1 ? labConvert(e) : new Lab(e, t, n, o ?? 1);
}
function Lab(e, t, n, o) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +o;
}
define(Lab, lab, extend(Color, {
  brighter(e) {
    return new Lab(this.l + K * (e ?? 1), this.a, this.b, this.opacity);
  },
  darker(e) {
    return new Lab(this.l - K * (e ?? 1), this.a, this.b, this.opacity);
  },
  rgb() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = Xn * lab2xyz(t), e = Yn * lab2xyz(e), n = Zn * lab2xyz(n), new Rgb(
      lrgb2rgb(3.1338561 * t - 1.6168667 * e - 0.4906146 * n),
      lrgb2rgb(-0.9787684 * t + 1.9161415 * e + 0.033454 * n),
      lrgb2rgb(0.0719453 * t - 0.2289914 * e + 1.4052427 * n),
      this.opacity
    );
  }
}));
function xyz2lab(e) {
  return e > t3 ? Math.pow(e, 1 / 3) : e / t2 + t0;
}
function lab2xyz(e) {
  return e > t1 ? e * e * e : t2 * (e - t0);
}
function lrgb2rgb(e) {
  return 255 * (e <= 31308e-7 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);
}
function rgb2lrgb(e) {
  return (e /= 255) <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function hclConvert(e) {
  if (e instanceof Hcl) return new Hcl(e.h, e.c, e.l, e.opacity);
  if (e instanceof Lab || (e = labConvert(e)), e.a === 0 && e.b === 0) return new Hcl(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
  var t = Math.atan2(e.b, e.a) * degrees;
  return new Hcl(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function lch(e, t, n, o) {
  return arguments.length === 1 ? hclConvert(e) : new Hcl(n, t, e, o ?? 1);
}
function hcl(e, t, n, o) {
  return arguments.length === 1 ? hclConvert(e) : new Hcl(e, t, n, o ?? 1);
}
function Hcl(e, t, n, o) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +o;
}
function hcl2lab(e) {
  if (isNaN(e.h)) return new Lab(e.l, 0, 0, e.opacity);
  var t = e.h * radians;
  return new Lab(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
define(Hcl, hcl, extend(Color, {
  brighter(e) {
    return new Hcl(this.h, this.c, this.l + K * (e ?? 1), this.opacity);
  },
  darker(e) {
    return new Hcl(this.h, this.c, this.l - K * (e ?? 1), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));
const styleNames = [
  "accentColor",
  "additiveSymbols",
  "alignContent",
  "alignItems",
  "alignSelf",
  "alignmentBaseline",
  "all",
  "anchorName",
  "animation",
  "animationComposition",
  "animationDelay",
  "animationDirection",
  "animationDuration",
  "animationFillMode",
  "animationIterationCount",
  "animationName",
  "animationPlayState",
  "animationRange",
  "animationRangeEnd",
  "animationRangeStart",
  "animationTimeline",
  "animationTimingFunction",
  "appRegion",
  "appearance",
  "ascentOverride",
  "aspectRatio",
  "backdropFilter",
  "backfaceVisibility",
  "background",
  "backgroundAttachment",
  "backgroundBlendMode",
  "backgroundClip",
  "backgroundColor",
  "backgroundImage",
  "backgroundOrigin",
  "backgroundPosition",
  "backgroundPositionX",
  "backgroundPositionY",
  "backgroundRepeat",
  "backgroundSize",
  "basePalette",
  "baselineShift",
  "baselineSource",
  "blockSize",
  "border",
  "borderBlock",
  "borderBlockColor",
  "borderBlockEnd",
  "borderBlockEndColor",
  "borderBlockEndStyle",
  "borderBlockEndWidth",
  "borderBlockStart",
  "borderBlockStartColor",
  "borderBlockStartStyle",
  "borderBlockStartWidth",
  "borderBlockStyle",
  "borderBlockWidth",
  "borderBottom",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStyle",
  "borderBottomWidth",
  "borderCollapse",
  "borderColor",
  "borderEndEndRadius",
  "borderEndStartRadius",
  "borderImage",
  "borderImageOutset",
  "borderImageRepeat",
  "borderImageSlice",
  "borderImageSource",
  "borderImageWidth",
  "borderInline",
  "borderInlineColor",
  "borderInlineEnd",
  "borderInlineEndColor",
  "borderInlineEndStyle",
  "borderInlineEndWidth",
  "borderInlineStart",
  "borderInlineStartColor",
  "borderInlineStartStyle",
  "borderInlineStartWidth",
  "borderInlineStyle",
  "borderInlineWidth",
  "borderLeft",
  "borderLeftColor",
  "borderLeftStyle",
  "borderLeftWidth",
  "borderRadius",
  "borderRight",
  "borderRightColor",
  "borderRightStyle",
  "borderRightWidth",
  "borderSpacing",
  "borderStartEndRadius",
  "borderStartStartRadius",
  "borderStyle",
  "borderTop",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStyle",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "boxShadow",
  "boxSizing",
  "breakAfter",
  "breakBefore",
  "breakInside",
  "bufferedRendering",
  "captionSide",
  "caretColor",
  "clear",
  "clip",
  "clipPath",
  "clipRule",
  "color",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorRendering",
  "colorScheme",
  "columnCount",
  "columnFill",
  "columnGap",
  "columnRule",
  "columnRuleColor",
  "columnRuleStyle",
  "columnRuleWidth",
  "columnSpan",
  "columnWidth",
  "columns",
  "contain",
  "containIntrinsicBlockSize",
  "containIntrinsicHeight",
  "containIntrinsicInlineSize",
  "containIntrinsicSize",
  "containIntrinsicWidth",
  "container",
  "containerName",
  "containerType",
  "content",
  "contentVisibility",
  "counterIncrement",
  "counterReset",
  "counterSet",
  "cursor",
  "cx",
  "cy",
  "d",
  "descentOverride",
  "direction",
  "display",
  "dominantBaseline",
  "emptyCells",
  "fallback",
  "fieldSizing",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexFlow",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "float",
  "floodColor",
  "floodOpacity",
  "font",
  "fontDisplay",
  "fontFamily",
  "fontFeatureSettings",
  "fontKerning",
  "fontOpticalSizing",
  "fontPalette",
  "fontSize",
  "fontStretch",
  "fontStyle",
  "fontSynthesis",
  "fontSynthesisSmallCaps",
  "fontSynthesisStyle",
  "fontSynthesisWeight",
  "fontVariant",
  "fontVariantAlternates",
  "fontVariantCaps",
  "fontVariantEastAsian",
  "fontVariantLigatures",
  "fontVariantNumeric",
  "fontVariantPosition",
  "fontVariationSettings",
  "fontWeight",
  "forcedColorAdjust",
  "gap",
  "grid",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnGap",
  "gridColumnStart",
  "gridGap",
  "gridRow",
  "gridRowEnd",
  "gridRowGap",
  "gridRowStart",
  "gridTemplate",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "hyphenateCharacter",
  "hyphenateLimitChars",
  "hyphens",
  "imageOrientation",
  "imageRendering",
  "inherits",
  "initialLetter",
  "initialValue",
  "inlineSize",
  "inset",
  "insetArea",
  "insetBlock",
  "insetBlockEnd",
  "insetBlockStart",
  "insetInline",
  "insetInlineEnd",
  "insetInlineStart",
  "isolation",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "letterSpacing",
  "lightingColor",
  "lineBreak",
  "lineGapOverride",
  "lineHeight",
  "listStyle",
  "listStyleImage",
  "listStylePosition",
  "listStyleType",
  "margin",
  "marginBlock",
  "marginBlockEnd",
  "marginBlockStart",
  "marginBottom",
  "marginInline",
  "marginInlineEnd",
  "marginInlineStart",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marker",
  "markerEnd",
  "markerMid",
  "markerStart",
  "mask",
  "maskClip",
  "maskComposite",
  "maskImage",
  "maskMode",
  "maskOrigin",
  "maskPosition",
  "maskRepeat",
  "maskSize",
  "maskType",
  "mathDepth",
  "mathShift",
  "mathStyle",
  "maxBlockSize",
  "maxHeight",
  "maxInlineSize",
  "maxWidth",
  "minBlockSize",
  "minHeight",
  "minInlineSize",
  "minWidth",
  "mixBlendMode",
  "navigation",
  "negative",
  "objectFit",
  "objectPosition",
  "objectViewBox",
  "offset",
  "offsetAnchor",
  "offsetDistance",
  "offsetPath",
  "offsetPosition",
  "offsetRotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outlineColor",
  "outlineOffset",
  "outlineStyle",
  "outlineWidth",
  "overflow",
  "overflowAnchor",
  "overflowClipMargin",
  "overflowWrap",
  "overflowX",
  "overflowY",
  "overlay",
  "overrideColors",
  "overscrollBehavior",
  "overscrollBehaviorBlock",
  "overscrollBehaviorInline",
  "overscrollBehaviorX",
  "overscrollBehaviorY",
  "pad",
  "padding",
  "paddingBlock",
  "paddingBlockEnd",
  "paddingBlockStart",
  "paddingBottom",
  "paddingInline",
  "paddingInlineEnd",
  "paddingInlineStart",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "page",
  "pageBreakAfter",
  "pageBreakBefore",
  "pageBreakInside",
  "pageOrientation",
  "paintOrder",
  "perspective",
  "perspectiveOrigin",
  "placeContent",
  "placeItems",
  "placeSelf",
  "pointerEvents",
  "position",
  "positionAnchor",
  "positionTry",
  "positionTryOptions",
  "positionTryOrder",
  "positionVisibility",
  "prefix",
  "quotes",
  "r",
  "range",
  "resize",
  "right",
  "rotate",
  "rowGap",
  "rubyPosition",
  "rx",
  "ry",
  "scale",
  "scrollBehavior",
  "scrollMargin",
  "scrollMarginBlock",
  "scrollMarginBlockEnd",
  "scrollMarginBlockStart",
  "scrollMarginBottom",
  "scrollMarginInline",
  "scrollMarginInlineEnd",
  "scrollMarginInlineStart",
  "scrollMarginLeft",
  "scrollMarginRight",
  "scrollMarginTop",
  "scrollPadding",
  "scrollPaddingBlock",
  "scrollPaddingBlockEnd",
  "scrollPaddingBlockStart",
  "scrollPaddingBottom",
  "scrollPaddingInline",
  "scrollPaddingInlineEnd",
  "scrollPaddingInlineStart",
  "scrollPaddingLeft",
  "scrollPaddingRight",
  "scrollPaddingTop",
  "scrollSnapAlign",
  "scrollSnapStop",
  "scrollSnapType",
  "scrollTimeline",
  "scrollTimelineAxis",
  "scrollTimelineName",
  "scrollbarColor",
  "scrollbarGutter",
  "scrollbarWidth",
  "shapeImageThreshold",
  "shapeMargin",
  "shapeOutside",
  "shapeRendering",
  "size",
  "sizeAdjust",
  "speak",
  "speakAs",
  "src",
  "stopColor",
  "stopOpacity",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "suffix",
  "symbols",
  "syntax",
  "system",
  "tabSize",
  "tableLayout",
  "textAlign",
  "textAlignLast",
  "textAnchor",
  "textCombineUpright",
  "textDecoration",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationSkipInk",
  "textDecorationStyle",
  "textDecorationThickness",
  "textEmphasis",
  "textEmphasisColor",
  "textEmphasisPosition",
  "textEmphasisStyle",
  "textIndent",
  "textOrientation",
  "textOverflow",
  "textRendering",
  "textShadow",
  "textSizeAdjust",
  "textSpacingTrim",
  "textTransform",
  "textUnderlineOffset",
  "textUnderlinePosition",
  "textWrap",
  "timelineScope",
  "top",
  "touchAction",
  "transform",
  "transformBox",
  "transformOrigin",
  "transformStyle",
  "transition",
  "transitionBehavior",
  "transitionDelay",
  "transitionDuration",
  "transitionProperty",
  "transitionTimingFunction",
  "translate",
  "types",
  "unicodeBidi",
  "unicodeRange",
  "userSelect",
  "vectorEffect",
  "verticalAlign",
  "viewTimeline",
  "viewTimelineAxis",
  "viewTimelineInset",
  "viewTimelineName",
  "viewTransitionClass",
  "viewTransitionName",
  "visibility",
  "webkitAlignContent",
  "webkitAlignItems",
  "webkitAlignSelf",
  "webkitAnimation",
  "webkitAnimationDelay",
  "webkitAnimationDirection",
  "webkitAnimationDuration",
  "webkitAnimationFillMode",
  "webkitAnimationIterationCount",
  "webkitAnimationName",
  "webkitAnimationPlayState",
  "webkitAnimationTimingFunction",
  "webkitAppRegion",
  "webkitAppearance",
  "webkitBackfaceVisibility",
  "webkitBackgroundClip",
  "webkitBackgroundOrigin",
  "webkitBackgroundSize",
  "webkitBorderAfter",
  "webkitBorderAfterColor",
  "webkitBorderAfterStyle",
  "webkitBorderAfterWidth",
  "webkitBorderBefore",
  "webkitBorderBeforeColor",
  "webkitBorderBeforeStyle",
  "webkitBorderBeforeWidth",
  "webkitBorderBottomLeftRadius",
  "webkitBorderBottomRightRadius",
  "webkitBorderEnd",
  "webkitBorderEndColor",
  "webkitBorderEndStyle",
  "webkitBorderEndWidth",
  "webkitBorderHorizontalSpacing",
  "webkitBorderImage",
  "webkitBorderRadius",
  "webkitBorderStart",
  "webkitBorderStartColor",
  "webkitBorderStartStyle",
  "webkitBorderStartWidth",
  "webkitBorderTopLeftRadius",
  "webkitBorderTopRightRadius",
  "webkitBorderVerticalSpacing",
  "webkitBoxAlign",
  "webkitBoxDecorationBreak",
  "webkitBoxDirection",
  "webkitBoxFlex",
  "webkitBoxOrdinalGroup",
  "webkitBoxOrient",
  "webkitBoxPack",
  "webkitBoxReflect",
  "webkitBoxShadow",
  "webkitBoxSizing",
  "webkitClipPath",
  "webkitColumnBreakAfter",
  "webkitColumnBreakBefore",
  "webkitColumnBreakInside",
  "webkitColumnCount",
  "webkitColumnGap",
  "webkitColumnRule",
  "webkitColumnRuleColor",
  "webkitColumnRuleStyle",
  "webkitColumnRuleWidth",
  "webkitColumnSpan",
  "webkitColumnWidth",
  "webkitColumns",
  "webkitFilter",
  "webkitFlex",
  "webkitFlexBasis",
  "webkitFlexDirection",
  "webkitFlexFlow",
  "webkitFlexGrow",
  "webkitFlexShrink",
  "webkitFlexWrap",
  "webkitFontFeatureSettings",
  "webkitFontSmoothing",
  "webkitHyphenateCharacter",
  "webkitJustifyContent",
  "webkitLineBreak",
  "webkitLineClamp",
  "webkitLocale",
  "webkitLogicalHeight",
  "webkitLogicalWidth",
  "webkitMarginAfter",
  "webkitMarginBefore",
  "webkitMarginEnd",
  "webkitMarginStart",
  "webkitMask",
  "webkitMaskBoxImage",
  "webkitMaskBoxImageOutset",
  "webkitMaskBoxImageRepeat",
  "webkitMaskBoxImageSlice",
  "webkitMaskBoxImageSource",
  "webkitMaskBoxImageWidth",
  "webkitMaskClip",
  "webkitMaskComposite",
  "webkitMaskImage",
  "webkitMaskOrigin",
  "webkitMaskPosition",
  "webkitMaskPositionX",
  "webkitMaskPositionY",
  "webkitMaskRepeat",
  "webkitMaskSize",
  "webkitMaxLogicalHeight",
  "webkitMaxLogicalWidth",
  "webkitMinLogicalHeight",
  "webkitMinLogicalWidth",
  "webkitOpacity",
  "webkitOrder",
  "webkitPaddingAfter",
  "webkitPaddingBefore",
  "webkitPaddingEnd",
  "webkitPaddingStart",
  "webkitPerspective",
  "webkitPerspectiveOrigin",
  "webkitPerspectiveOriginX",
  "webkitPerspectiveOriginY",
  "webkitPrintColorAdjust",
  "webkitRtlOrdering",
  "webkitRubyPosition",
  "webkitShapeImageThreshold",
  "webkitShapeMargin",
  "webkitShapeOutside",
  "webkitTapHighlightColor",
  "webkitTextCombine",
  "webkitTextDecorationsInEffect",
  "webkitTextEmphasis",
  "webkitTextEmphasisColor",
  "webkitTextEmphasisPosition",
  "webkitTextEmphasisStyle",
  "webkitTextFillColor",
  "webkitTextOrientation",
  "webkitTextSecurity",
  "webkitTextSizeAdjust",
  "webkitTextStroke",
  "webkitTextStrokeColor",
  "webkitTextStrokeWidth",
  "webkitTransform",
  "webkitTransformOrigin",
  "webkitTransformOriginX",
  "webkitTransformOriginY",
  "webkitTransformOriginZ",
  "webkitTransformStyle",
  "webkitTransition",
  "webkitTransitionDelay",
  "webkitTransitionDuration",
  "webkitTransitionProperty",
  "webkitTransitionTimingFunction",
  "webkitUserDrag",
  "webkitUserModify",
  "webkitUserSelect",
  "webkitWritingMode",
  "whiteSpace",
  "whiteSpaceCollapse",
  "widows",
  "width",
  "willChange",
  "wordBreak",
  "wordSpacing",
  "wordWrap",
  "writingMode",
  "x",
  "y",
  "zIndex",
  "zoom"
], setStyleNames = new Set(styleNames);
function isCSSStyleName(e) {
  return setStyleNames.has(e);
}
const isObject = (e) => !!e && e.constructor === Object, arrayEquals = (e, t) => {
  if (!e || !t || e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
};
async function sleep(e) {
  return await new Promise((t) => setTimeout(t, e));
}
const hyphenToCamelCase = (e) => e.replace(
  /([-_][a-z])/gi,
  (t) => t.toUpperCase().replace("-", "").replace("_", "")
);
function requestAnimationFrame(e) {
  return window != null ? window.requestAnimationFrame(e) : setImmediate(() => {
    e(Date.now());
  });
}
function convertAbsoluteUnitToPixels(e, t) {
  let n = e;
  return t === "cm" ? n *= 96 / 2.54 : t === "mm" ? n *= 96 / 25.4 : t === "in" ? n *= 96 : t === "pt" ? n *= 4 / 3 : t === "pc" && (n *= 16), n;
}
function convertToPixels(e, t, n, o) {
  if (t === "em" && n)
    e *= parseFloat(getComputedStyle(n).fontSize);
  else if (t === "rem")
    e *= parseFloat(getComputedStyle(document.documentElement).fontSize);
  else if (t === "vh")
    e *= window.innerHeight / 100;
  else if (t === "vw")
    e *= window.innerWidth / 100;
  else if (t === "vmin")
    e *= Math.min(window.innerHeight, window.innerWidth) / 100;
  else if (t === "vmax")
    e *= Math.max(window.innerHeight, window.innerWidth) / 100;
  else if (t === "%" && (n != null && n.parentElement) && o) {
    const u = parseFloat(
      getComputedStyle(n.parentElement).getPropertyValue(o)
    );
    e = e / 100 * u;
  } else
    e = convertAbsoluteUnitToPixels(e, t);
  return e;
}
function convertToDegrees(e, t) {
  return t === "grad" ? e *= 0.9 : t === "rad" ? e *= 180 / Math.PI : t === "turn" && (e *= 360), e;
}
function convertToDpi(e, t) {
  return t === "dpcm" ? e *= 2.54 : t === "dppx" && (e *= 96), e;
}
const getComputedValue = (e, t) => {
  const n = getComputedStyle(e).getPropertyValue(t), o = CSSValueUnit.Value.parse(n);
  return o.status ? o.value : void 0;
}, lerpColor = (e, t, n) => {
  const o = t.value, u = n.value;
  return {
    r: lerp(e, o.r, u.r),
    g: lerp(e, o.g, u.g),
    b: lerp(e, o.b, u.b)
  };
}, lerpVar = (e, t, n, o) => {
  const u = t.unit === "var" ? getComputedValue(o, String(t.value)) : t, a = n.unit === "var" ? getComputedValue(o, String(n.value)) : n;
  return u.lerp(e, a, o);
};
class ValueUnit {
  constructor(t, n, o = []) {
    this.value = t, this.unit = n, this.superType = o;
  }
  valueOf() {
    return this.unit ? this.toString() : this.value;
  }
  toString() {
    if (!this.unit || this.unit === "string")
      return `${this.value}`;
    if (this.unit === "color") {
      const t = this.value;
      return `rgb(${t.r}, ${t.g}, ${t.b})`;
    } else return this.unit === "var" ? `var(${this.value})` : this.unit === "calc" ? `calc(${this.value})` : `${this.value}${this.unit}`;
  }
  lerp(t, n, o) {
    if (n instanceof FunctionValue || n instanceof ValueArray)
      return n.lerp(t, this, o);
    if (this.unit === "string" || n.unit === "string")
      return this;
    if (o && (this.unit === "var" || n.unit === "var"))
      return lerpVar(
        t,
        this,
        n,
        o
      );
    if (this.unit !== n.unit) {
      const [a, f] = collapseNumericType(
        this,
        n,
        o
      ), g = lerp(t, a.value, f.value);
      return new ValueUnit(g, a.unit, a.superType);
    } else if (this.unit === "color") {
      const a = lerpColor(
        t,
        this,
        n
      );
      return new ValueUnit(a, this.unit, this.superType);
    }
    const u = lerp(t, this.value, n.value);
    return new ValueUnit(u, this.unit, this.superType);
  }
}
function lerpMany(e, t, n, o) {
  const u = Math.min(t.length, n.length), a = [];
  for (let f = 0; f < u; f++) {
    const g = t[f], b = n[f], y = g.lerp(e, b, o);
    a.push(y);
  }
  return a;
}
class FunctionValue {
  constructor(t, n) {
    v(this, "values");
    this.name = t, Array.isArray(n) ? this.values = n : this.values = [n];
  }
  valueOf() {
    return this.values.map((t) => t.valueOf());
  }
  toString() {
    const t = this.values.map((n) => n.toString()).join(", ");
    return `${this.name}(${t})`;
  }
  lerp(t, n, o) {
    const u = n instanceof ValueUnit ? [n] : n.values, a = lerpMany(t, this.values, u, o);
    return new FunctionValue(this.name, a);
  }
}
class ValueArray {
  constructor(t) {
    v(this, "values");
    t instanceof ValueArray ? this.values = t.values : Array.isArray(t) ? this.values = t : this.values = [t];
  }
  valueOf() {
    return this.values.map((t) => t.valueOf());
  }
  toString() {
    return this.values.map((t) => t.toString()).join(" ");
  }
  lerp(t, n, o) {
    const u = n instanceof ValueUnit ? [n] : n.values, a = lerpMany(t, this.values, u, o);
    return new ValueArray(a);
  }
}
const isValueType = (e) => e instanceof ValueUnit || e instanceof FunctionValue || e instanceof ValueArray, collapseNumericType = (e, t, n) => {
  if (!arrayEquals(e.superType, t.superType) && e.superType[0] !== "length")
    return [e, t];
  const [o, u] = e.superType[0] === "length" ? [
    convertToPixels(e.value, e.unit, n),
    convertToPixels(t.value, t.unit, n)
  ] : e.superType[0] === "angle" ? [
    convertToDegrees(e.value, e.unit),
    convertToDegrees(t.value, t.unit)
  ] : e.superType[0] === "time" ? [parseCSSTime(e.value + e.unit), parseCSSTime(t.value + t.unit)] : e.superType[0] === "resolution" ? [convertToDpi(e.value, e.unit), convertToDpi(t.value, t.unit)] : [e.value, t.value], [a, f] = [e.unit, e.superType];
  return [new ValueUnit(o, a, f), new ValueUnit(u, a, f)];
};
function transformObject(e) {
  const t = {}, n = (u, a = void 0) => {
    for (const [f, g] of Object.entries(u)) {
      const b = a ? `${a}.${f}` : f;
      isObject(g) ? n(g, b) : t[b] = g;
    }
  };
  return n(e), Object.entries(t).map(([u, a]) => {
    const f = u.split(".").pop();
    if (isValueType(a))
      return [u, a];
    const g = CSSKeyframes.FunctionArgs.map((b) => isCSSStyleName(f) ? new ValueArray(b) : new FunctionValue(f, b)).or(CSSKeyframes.Value).tryParse(String(a));
    return [u, g];
  }).reduce((u, [a, f]) => (u[a] = f, u), {});
}
function mergeValueObjects(e, t) {
  if (e == null)
    return t;
  const n = new ValueArray(Object.values(e)), o = new ValueArray(t);
  return new ValueArray([...n.values, ...o.values]);
}
function reverseTransformObject(e, t, n = {}) {
  const o = e.split(".");
  let u = n;
  return o.length === 1 ? (u[e] = mergeValueObjects(u[e], t), n) : (o.forEach((a, f) => {
    t != null && f === o.length - 1 ? u[a] = mergeValueObjects(u[a], t) : (u[a] == null && (u[a] = {}), u = u[a]);
  }), n);
}
function transformTargetsStyle(e, t, n) {
  function o(a, f = void 0, g = void 0) {
    const b = (() => {
      if (isObject(a))
        return Object.entries(a).map(([y, T]) => o(T, y, g)).join(" ");
      if (Array.isArray(a)) {
        const y = a.map((T) => o(T, f)).join(", ");
        return `${f}(${y})`;
      } else
        return a.toString();
    })();
    return g ? `${g} ${b}` : b;
  }
  const u = Object.entries(t).reduce((a, [f, g]) => {
    const b = o(g, f);
    return a[f] = b, a;
  }, {});
  n.forEach((a) => {
    Object.assign(a.style, u);
  });
}
const colorNames = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
}, absoluteLengthUnits = ["px", "cm", "mm", "Q", "in", "pc", "pt"], relativeLengthUnits = [
  "em",
  "ex",
  "ch",
  "rem",
  "lh",
  "rlh",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "vb",
  "vi",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "dvw",
  "dvh"
], lengthUnits = [...absoluteLengthUnits, ...relativeLengthUnits], timeUnits = ["s", "ms"], angleUnits = ["deg", "rad", "grad", "turn"], percentageUnits = ["%"], resolutionUnits = ["dpi", "dpcm", "dppx"], identifier = P.regexp(/-?[a-zA-Z][a-zA-Z0-9-]*/), none = P.string("none"), integer = P.regexp(/-?\d+/).map(Number), number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number), opt = (e) => P.alt(e, P.succeed(void 0)), hex2rgb = (e) => {
  const t = parseInt(e.slice(1, 3), 16), n = parseInt(e.slice(3, 5), 16), o = parseInt(e.slice(5, 7), 16);
  return [t, n, o];
}, hsv2hsl = (e, t, n) => {
  const o = (2 - t) * n / 2, u = o !== 0 && o !== 1 ? t * n / (o < 0.5 ? o * 2 : 2 - o * 2) : 0;
  return [e, u, o];
}, hwb2hsl = (e, t, n) => {
  const o = (1 - n) / 2, u = t === 1 ? 0 : t === 0 ? 1 : (1 - t - n) / (1 - n);
  return [e, u, o];
}, colorOptionalAlpha = (e, t) => {
  const n = P.string(t).skip(opt(P.string("a"))).trim(P.optWhitespace), o = P.alt(
    P.seq(e.colorValue.skip(e.alphaSep), e.colorValue),
    P.seq(e.colorValue)
  ), u = P.seq(
    e.colorValue.skip(e.sep),
    e.colorValue.skip(e.sep),
    o
  ).trim(P.optWhitespace).wrap(P.string("("), P.string(")"));
  return n.then(u).map(([a, f, [g, b]]) => [a, f, g, b ?? 1]);
}, CSSColor = P.createLanguage({
  colorValue: () => P.alt(
    integer.skip(P.string("%")).map((e) => e / 100),
    number
  ),
  comma: () => P.string(","),
  space: () => P.string(" "),
  div: () => P.string("/"),
  sep: (e) => e.comma.or(e.space).trim(P.optWhitespace),
  alphaSep: (e) => e.sep.or(e.div).trim(P.optWhitespace),
  name: () => P.alt(
    ...Object.keys(colorNames).sort((e, t) => t.length - e.length).map(P.string)
  ).map((e) => {
    const t = colorNames[e], [n, o, u] = hex2rgb(t);
    return rgb(n, o, u);
  }),
  hex: () => P.regexp(/#[0-9a-fA-F]{3,6}/).map((e) => {
    const t = e.slice(1), n = t.length === 3 ? t[0] + t[0] : t.slice(0, 2), o = t.length === 3 ? t[1] + t[1] : t.slice(2, 4), u = t.length === 3 ? t[2] + t[2] : t.slice(4, 6);
    return rgb(parseInt(n, 16), parseInt(o, 16), parseInt(u, 16));
  }),
  rgb: (e) => colorOptionalAlpha(e, "rgb").map(([t, n, o, u]) => rgb(t, n, o, u)),
  hsl: (e) => colorOptionalAlpha(e, "hsl").map(([t, n, o, u]) => hsl(t, n, o, u)),
  hsv: (e) => colorOptionalAlpha(e, "hsv").map(([t, n, o, u]) => {
    const [a, f, g] = hsv2hsl(t, n, o);
    return hsl(a, f, g, u);
  }),
  hwb: (e) => colorOptionalAlpha(e, "hwb").map(([t, n, o, u]) => {
    const [a, f, g] = hwb2hsl(t, n, o);
    return hsl(a, f, g, u);
  }),
  lab: (e) => colorOptionalAlpha(e, "lab").map(([t, n, o, u]) => lab(t, n, o, u)),
  lch: (e) => colorOptionalAlpha(e, "lch").map(([t, n, o, u]) => lch(t, n, o, u)),
  Value: (e) => P.alt(e.hex, e.rgb, e.hsl, e.hsv, e.hwb, e.lab, e.lch, e.name).trim(
    P.optWhitespace
  )
}), CSSValueUnit = P.createLanguage({
  lengthUnit: () => P.alt(...lengthUnits.map(P.string)),
  angleUnit: () => P.alt(...angleUnits.map(P.string)),
  timeUnit: () => P.alt(...timeUnits.map(P.string)),
  resolutionUnit: () => P.alt(...resolutionUnits.map(P.string)),
  percentageUnit: () => P.alt(...percentageUnits.map(P.string)),
  Length: (e) => P.seq(number, e.lengthUnit).map(([t, n]) => {
    let o = ["length"];
    return relativeLengthUnits.includes(n) ? o.push("relative") : absoluteLengthUnits.includes(n) && o.push("absolute"), new ValueUnit(t, n, o);
  }),
  Angle: (e) => P.seq(number, e.angleUnit).map(([t, n]) => new ValueUnit(t, n, ["angle"])),
  Time: (e) => P.seq(number, e.timeUnit).map(([t, n]) => new ValueUnit(t, n, ["time"])),
  Resolution: (e) => P.seq(number, e.resolutionUnit).map(([t, n]) => new ValueUnit(t, n, ["resolution"])),
  Percentage: (e) => P.seq(number, e.percentageUnit).map(([t, n]) => new ValueUnit(t, n, ["percentage"])),
  Color: (e) => CSSColor.Value.map((t) => new ValueUnit(t, "color")),
  Value: (e) => P.alt(
    e.Length,
    e.Angle,
    e.Time,
    e.Resolution,
    e.Percentage,
    e.Color,
    P.alt(number, none).map((t) => new ValueUnit(t))
  ).trim(P.optWhitespace)
}), istring = (e) => P((t, n) => t.slice(n).toLowerCase().startsWith(e.toLowerCase()) ? P.makeSuccess(n + e.length, e) : P.makeFailure(n, `Expected ${e}`)), unaryMathFunctions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  var: (e) => e
}, binaryMathFunctions = {
  pow: Math.pow,
  atan2: Math.atan2,
  min: Math.min,
  max: Math.max,
  clamp
}, mathFunctions = {
  ...unaryMathFunctions,
  ...binaryMathFunctions
}, evaluateMathFunction = (e, t) => {
  const n = t.reduce((f, g) => collapseNumericType(f, g), t[0])[0], o = t.map((f) => f.value).map((f) => n.superType && n.superType[0] === "angle" ? convertToDegrees(f, n.unit) * (Math.PI / 180) : f), u = mathFunctions[e], a = u(...o);
  if (a)
    return new ValueUnit(a, n.unit, n.superType);
};
function evaluateMathOperator(e, t, n) {
  if ([t, n] = collapseNumericType(t, n), !t.unit && n.unit)
    [t, n] = [n, t];
  else if (n.unit && !arrayEquals(t.superType, n.superType))
    return;
  const o = (() => {
    switch (e) {
      case "+":
        return t.value + n.value;
      case "-":
        return t.value - n.value;
      case "*":
        return t.value * n.value;
      case "/":
        return t.value / n.value;
      case "//":
        return Math.floor(t.value / n.value);
      case "^":
        return Math.pow(t.value, n.value);
      default:
        throw new Error(`Unknown operator ${e}`);
    }
  })();
  return new ValueUnit(o, t.unit, t.superType);
}
const reduceMathOperators = (e, t) => t.length === 0 ? e : t.reduce((o, [u, a]) => {
  if (typeof o == "string" || !(a instanceof ValueUnit))
    return `${o} ${u} ${a}`;
  const f = evaluateMathOperator(u, o, a);
  return f || `${o} ${u} ${a}`;
}, e), MathValue = P.createLanguage({
  ws: () => P.optWhitespace,
  lparen: (e) => P.string("(").trim(e.ws),
  rparen: (e) => P.string(")").trim(e.ws),
  comma: (e) => P.string(",").trim(e.ws),
  termOperators: (e) => P.alt(...["*", "/", "//"].map(P.string)).trim(e.ws),
  factorOperators: (e) => P.alt(...["+", "-"].map(P.string)).trim(e.ws),
  pow: (e) => P.string("^").trim(e.ws),
  Expression: (e) => P.alt(e.Function, e.Term),
  FunctionArgs: (e) => P.sepBy1(e.Expression, e.comma).trim(e.ws).wrap(e.lparen, e.rparen),
  Function: (e) => P.seq(P.alt(...Object.keys(mathFunctions).map(P.string)), e.FunctionArgs).map(
    ([t, n]) => {
      const o = evaluateMathFunction(
        t,
        n
      );
      return o || new FunctionValue(t, n);
    }
  ),
  Term: (e) => P.seqMap(
    e.Factor,
    P.seq(e.termOperators, e.Factor).many(),
    reduceMathOperators
  ),
  Factor: (e) => P.seqMap(e.Atom, P.seq(e.factorOperators, e.Term).many(), reduceMathOperators),
  CSSVariable: (e) => P.string("--").then(identifier).map((t) => new ValueUnit("--" + t, "var")),
  Atom: (e) => P.alt(CSSValueUnit.Value, e.CSSVariable, e.Expression).trim(e.ws)
}), handleCalc = (e) => P.string("calc").then(MathValue.Expression.trim(e.ws).wrap(e.lparen, e.rparen)).map((t) => t instanceof ValueUnit ? t : new ValueUnit(t, "calc")), TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring), DIMS = ["x", "y", "z"].map(istring), handleFunc = (e, t) => P.seq(t || identifier, e.FunctionArgs.wrap(e.lparen, e.rparen)).map(
  (n) => n
), handleTransform = (e) => {
  const t = P.seq(P.alt(...TRANSFORM_FUNCTIONS), P.alt(...DIMS, P.string("")));
  return handleFunc(e, t).map(([[o, u], a]) => (o = o.toLowerCase(), u ? new FunctionValue(o + u.toUpperCase(), [a[0]]) : a.length === 1 ? new FunctionValue(o, [a[0]]) : new FunctionValue(o, a)));
}, handleVar = (e) => P.string("var").then(e.String.trim(e.ws).wrap(e.lparen, e.rparen)).map((t) => new ValueUnit(t, "var")), gradientDirections = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
}, handleGradient = (e) => {
  const t = P.alt(...["linear-gradient", "radial-gradient"].map(istring)), n = P.seq(
    P.string("to").skip(e.ws),
    P.alt(...["left", "right", "top", "bottom"].map(istring))
  ).map(([b, y]) => (y = gradientDirections[y.toLowerCase()], new ValueUnit(y, "deg"))), o = P.alt(CSSValueUnit.Angle, n), u = P.alt(CSSValueUnit.Length, CSSValueUnit.Percentage), a = P.seq(
    CSSValueUnit.Color,
    P.sepBy(u, e.ws)
  ).map(([b, y]) => y ? [b, ...y] : [b]), f = P.seq(
    a,
    e.comma.trim(e.ws).then(a.or(u)).many()
  ).map(([b, y]) => [b, ...y].map((T) => new ValueArray(T)));
  return P.seq(
    t,
    P.seq(opt(o.skip(e.comma)), f).trim(e.ws).wrap(e.lparen, e.rparen).map(([b, y]) => b ? [b, ...y].flat() : [y])
  ).map(([b, y]) => new FunctionValue(b, y));
}, handleCubicBezier = (e) => handleFunc(e, P.string("cubic-bezier")).map((t) => new FunctionValue("cubic-bezier", t[1])), CSSKeyframes = P.createLanguage({
  ws: () => P.optWhitespace,
  semi: () => P.string(";"),
  colon: () => P.string(":"),
  lcurly: () => P.string("{"),
  rcurly: () => P.string("}"),
  lparen: () => P.string("("),
  rparen: () => P.string(")"),
  comma: () => P.string(","),
  Rule: (e) => P.string("@keyframes").trim(e.ws).then(identifier),
  String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((e) => new ValueUnit(e)),
  FunctionArgs: (e) => e.Value.sepBy(e.comma).trim(e.ws),
  Function: (e) => P.alt(
    handleTransform(e),
    handleVar(e),
    handleCalc(e),
    handleGradient(e),
    handleCubicBezier(e),
    handleFunc(e).map(([t, n]) => new FunctionValue(t, n))
  ),
  JSON: (r) => P.seq(r.lcurly, P.regexp(/[^{}]+/), r.rcurly).map((x) => {
    const s = x.join(`
`);
    let obj = eval("(" + s + ")");
    return new ValueUnit(obj, "json");
  }),
  Value: (e) => P.alt(CSSValueUnit.Value, e.Function, e.JSON, e.String).trim(e.ws),
  Values: (e) => e.Value.sepBy(e.ws).map((t) => new ValueArray(t)),
  Variables: (e) => P.seq(
    identifier.skip(e.colon).trim(e.ws).map((t) => hyphenToCamelCase(t)),
    e.Values.skip(e.semi).trim(e.ws)
  ).map(([t, n]) => {
    const o = n.values[0];
    return o.unit === "json" ? transformObject({
      [t]: o.value
    }) : {
      [t]: n
    };
  }),
  Percent: (e) => P.alt(
    integer.skip(P.string("%").or(P.string(""))),
    P.string("from").map(() => "0"),
    P.string("to").map(() => "100")
  ).trim(e.ws).map(Number),
  Percents: (e) => e.Percent.sepBy(e.comma).trim(e.ws),
  Body: (e) => e.Variables.many().trim(e.ws).wrap(e.lcurly, e.rcurly).map((t) => Object.assign({}, ...t)),
  Keyframe: (e) => P.seq(e.Percents, e.Body).map(([t, n]) => {
    const o = {};
    for (const u of t)
      o[u] = n;
    return o;
  }),
  Keyframes: (e) => e.Rule.then(
    e.Keyframe.atLeast(1).trim(e.ws).wrap(e.lcurly, e.rcurly).trim(e.ws)
  ).map((t) => Object.assign({}, ...t))
}), CSSClass = P.createLanguage({
  ws: () => P.optWhitespace,
  semi: () => P.string(";"),
  colon: () => P.string(":"),
  lcurly: () => P.string("{"),
  rcurly: () => P.string("}"),
  lparen: () => P.string("("),
  rparen: () => P.string(")"),
  comma: () => P.string(","),
  dot: () => P.string("."),
  Rule: (e) => e.dot.trim(e.ws).then(identifier).trim(e.ws),
  Class: (e) => e.Rule.then(
    CSSKeyframes.Body.map((t) => {
      const n = {};
      for (let [o, u] of Object.entries(t))
        if (o.includes("animation")) {
          let a = o.replace(/^animation/i, "").replace(/^\w/, (f) => f.toLowerCase());
          n[a] = u.toString(), delete t[o];
        }
      return {
        options: n,
        values: t
      };
    })
  )
});
P.createLanguage({
  ws: () => P.optWhitespace,
  Value: (e) => P.alt(
    CSSClass.Class,
    CSSKeyframes.Keyframes.map((t) => ({
      keyframes: t
    }))
  ),
  Values: (e) => e.Value.sepBy(e.ws).map((t) => Object.assign({}, ...t))
});
const parseCSSKeyframes = (e) => CSSKeyframes.Keyframes.tryParse(e), parseCSSPercent = (e) => CSSKeyframes.Percent.tryParse(String(e));
function parseCSSTime(e) {
  return CSSValueUnit.Time.map((t) => t.unit === "ms" ? t.value : t.unit === "s" ? t.value * 1e3 : t.value).tryParse(e);
}
function calcFrameTime(e, t, n) {
  const [o, u] = [e.start, t.start];
  return {
    start: o.value * n / 100,
    stop: u.value * n / 100
  };
}
function seekPreviousValue(e, t, n) {
  for (let o = e - 1; o >= 0; o--)
    if (n(t[o]))
      return o;
}
function parseTemplateFrame(e, t, n, o, u) {
  const [a, f] = [t[e], t[e + 1]], [g, b] = [n[e], n[e + 1]], y = calcFrameTime(a, f, o), T = {}, W = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(b)])], z = (S, V, A) => ({
    start: n[V][S],
    stop: n[A][S]
  });
  W.forEach((S) => {
    if (S in g && S in b)
      T[S] = z(S, e, e + 1);
    else if (!(S in g) && S in b) {
      const V = seekPreviousValue(e, n, (D) => S in D);
      if (V == null)
        return;
      const A = u[V];
      A.time = calcFrameTime(
        t[V],
        f,
        o
      ), A.interpVars[S] = z(S, V, e + 1);
    }
  });
  let _ = a.transform;
  if (_ == null) {
    const S = seekPreviousValue(e, u, (V) => V.transform != null);
    _ = u[S].transform;
  }
  return {
    id: a.id,
    time: y,
    interpVars: T,
    transform: _,
    timingFunction: a.timingFunction
  };
}
const defaultOptions = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: easeInOutCubic
}, getTimingFunction = (e) => typeof e == "string" ? timingFunctions[e] : e ?? void 0;
let nextId = 0;
class Animation {
  constructor(t, n = document.documentElement) {
    v(this, "id", nextId++);
    v(this, "options");
    v(this, "templateFrames", []);
    v(this, "transformedVars", []);
    v(this, "frameId", 0);
    v(this, "frames", []);
    v(this, "startTime");
    v(this, "pausedTime", 0);
    v(this, "prevTime", 0);
    v(this, "t", 0);
    v(this, "iteration", 0);
    v(this, "started", !1);
    v(this, "done", !1);
    v(this, "reversed", !1);
    v(this, "paused", !1);
    this.target = n, this.options = { ...defaultOptions, ...t }, this.parseOptions(t);
  }
  frame(t, n, o, u) {
    t = typeof t == "number" ? String(t) + "%" : t;
    const a = CSSValueUnit.Value.tryParse(t), f = {
      id: this.frameId,
      start: a,
      vars: n,
      transform: o,
      timingFunction: getTimingFunction(u) ?? this.options.timingFunction
    };
    return this.templateFrames.push(f), this.frameId += 1, this;
  }
  transformVars() {
    return this.transformedVars = this.templateFrames.map((t) => transformObject(t.vars)), this;
  }
  parseFrames() {
    for (let t = 0; t < this.templateFrames.length; t++) {
      const n = this.templateFrames[t];
      if (n.start.unit === "ms") {
        n.start.unit = "%";
        const a = ((t > 0 ? this.templateFrames[t - 1].start.value : 0) * this.options.duration / 100 + n.start.value) / this.options.duration * 100;
        n.start.value = a;
      }
    }
    this.templateFrames.sort((t, n) => t.start.value - n.start.value);
    for (let t = 0; t < this.templateFrames.length - 1; t++) {
      const n = parseTemplateFrame(
        t,
        this.templateFrames,
        this.transformedVars,
        this.options.duration,
        this.frames
      );
      this.frames.push(n);
    }
    return this;
  }
  updateTimingFunction(t) {
    return this.options.timingFunction = getTimingFunction(t), this;
  }
  updateIterationCount(t) {
    return t === "infinite" ? this.options.iterationCount = 1 / 0 : typeof t == "string" ? this.options.iterationCount = parseFloat(t) : this.options.iterationCount = t, this;
  }
  updateDuration(t) {
    typeof t == "string" && (t = parseCSSTime(t));
    const n = this.options.duration, o = t / n;
    for (let u = 0; u < this.frames.length; u++) {
      const a = this.frames[u];
      a.time.start *= o, a.time.stop *= o;
    }
    return this.options.duration = t, this;
  }
  updateDelay(t) {
    return typeof t == "string" && (t = parseCSSTime(t)), this.options.delay = t, this;
  }
  parseOptions(t) {
    return this.updateTimingFunction(t.timingFunction), this.updateDuration(t.duration), this.updateIterationCount(t.iterationCount), this.updateDelay(t.delay), this;
  }
  parse() {
    return this.transformVars().parseFrames(), this;
  }
  reverse() {
    return this.reversed = !this.reversed, this;
  }
  pause(t = !0) {
    return this.paused && t && requestAnimationFrame(this.draw.bind(this)), this.started && (this.paused = !this.paused), this;
  }
  playing() {
    return !(!this.started || this.paused);
  }
  reset() {
    return this.startTime = void 0, this;
  }
  fillForwards() {
    this.transformFrames(this.options.duration);
  }
  fillBackwards() {
    this.transformFrames(0);
  }
  transformFrames(t) {
    t = this.reversed ? this.options.duration - t : t;
    for (let n = 0; n < this.frames.length; n++) {
      const o = this.frames[n], { start: u, stop: a } = o.time;
      if (t < u || t > a)
        continue;
      const f = scale(t, u, a, 0, 1), g = o.timingFunction(f), b = {};
      for (const [y, T] of Object.entries(o.interpVars)) {
        const W = T.start.lerp(g, T.stop, this.target);
        reverseTransformObject(y, W, b);
      }
      o.transform(t, b);
    }
  }
  interpFrames(t, n) {
    t = this.reversed ? this.options.duration - t : t;
    for (let o = 0; o < this.frames.length; o++) {
      const u = this.frames[o], { start: a, stop: f } = u.time;
      if (t < a || t > f)
        continue;
      const g = scale(t, a, f, 0, 1), b = u.timingFunction(g);
      for (const [y, T] of Object.entries(u.interpVars))
        n[y] = T.start.lerp(b, T.stop, this.target);
    }
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.pause(), await sleep(this.options.delay), this.pause()), this.started = !0;
  }
  onEnd() {
    this.options.fillMode === "forwards" || this.options.fillMode === "both" ? this.fillForwards() : (this.options.fillMode === "none" || this.options.fillMode === "backwards") && this.fillBackwards(), this.reset(), this.iteration === this.options.iterationCount - 1 ? (this.done = !0, this.iteration = 0) : this.iteration += 1;
  }
  tick(t) {
    if (this.startTime === void 0 && (this.onStart(), this.startTime = t + this.options.delay), this.paused && this.pausedTime === 0)
      return this.pausedTime = t, this.t;
    if (this.pausedTime > 0 && !this.paused) {
      const n = t - this.pausedTime;
      this.startTime += n, this.pausedTime = 0;
    }
    return this.t = t - this.startTime, this.t >= this.options.duration && (this.onEnd(), this.t = this.options.duration), this.t;
  }
  draw(t) {
    t = this.tick(t), !this.paused && (this.transformFrames(t), this.done || requestAnimationFrame(this.draw.bind(this)));
  }
  play() {
    requestAnimationFrame(this.draw.bind(this));
  }
}
class CSSKeyframesAnimation {
  constructor(t = {}, ...n) {
    v(this, "options");
    v(this, "targets");
    v(this, "animation");
    this.options = { ...defaultOptions, ...t }, this.targets = n;
  }
  addTargets(...t) {
    return this.targets = t, this.animation && (this.animation.target = t[0]), this;
  }
  initAnimation() {
    var t;
    return this.animation = new Animation(this.options, (t = this.targets) == null ? void 0 : t[0]), this.options = this.animation.options, this;
  }
  fromKeyframesDefaultTransform(t) {
    this.initAnimation();
    for (const [n, o] of Object.entries(t))
      this.animation.frame(
        parseCSSPercent(n),
        o,
        this.transform.bind(this)
      );
    return this.animation.parse(), this;
  }
  fromVars(t, n) {
    this.initAnimation(), n = n ?? this.transform.bind(this);
    for (let o = 0; o < t.length; o++) {
      const u = t[o], a = Math.round(o / (t.length - 1) * 100);
      this.animation.frame(a, u, n);
    }
    return this.animation.parse(), this;
  }
  fromKeyframes(t) {
    this.initAnimation();
    for (const [n, o, u, a] of t)
      this.animation.frame(
        n,
        o,
        u,
        getTimingFunction(a)
      );
    return this.animation.parse(), this;
  }
  fromCSSKeyframes(t, n) {
    this.initAnimation(), n = n ?? this.transform.bind(this);
    const o = typeof t == "string" ? parseCSSKeyframes(t) : t;
    for (const [u, a] of Object.entries(o))
      this.animation.frame(Number(u), a, n), this.animation.transformedVars.push(a);
    return this.animation.parseFrames(), this;
  }
  transform(t, n) {
    transformTargetsStyle(t, n, this.targets);
  }
  play() {
    return this.animation.play();
  }
  pause() {
    return this.animation.pause(), this;
  }
}
class AnimationGroup {
  constructor(...t) {
    v(this, "animationGroup", []);
    v(this, "transform");
    v(this, "paused", !1);
    v(this, "started", !1);
    v(this, "done", !1);
    this.transform = t[0].frames[0].transform;
    for (const n of t)
      this.animationGroup.push({
        values: {},
        animation: n
      });
  }
  reset() {
    return this.animationGroup.forEach((t) => {
      t.animation.reset();
    }), this.started = !1, this.done = !1, this.paused = !1, this;
  }
  onStart() {
    return this.started = !0, this;
  }
  onEnd() {
    return this.reset(), this.done = !0, this;
  }
  pause() {
    const t = this.paused;
    return this.started && (this.paused = !this.paused, this.animationGroup.forEach((n) => {
      n.animation.pause(!1);
    })), t && requestAnimationFrame(this.draw.bind(this)), this;
  }
  playing() {
    return !(!this.started || this.paused);
  }
  transformFrames(t) {
    let n = {}, o = !0;
    for (const a of this.animationGroup) {
      const { animation: f, values: g } = a;
      o = o && f.done, f.done || f.paused || f.interpFrames(f.t, g), n = { ...g, ...n };
    }
    this.done = o;
    const u = {};
    return Object.entries(n).forEach(([a, f]) => {
      reverseTransformObject(a, f, u);
    }), this.transform(t, u), u;
  }
  tick(t) {
    this.started || this.onStart();
    for (const n of this.animationGroup)
      (!n.animation.paused || n.animation.pausedTime === 0) && n.animation.tick(t);
    return this.done && this.onEnd(), this;
  }
  draw(t) {
    this.tick(t), !this.paused && (this.transformFrames(t), this.done || requestAnimationFrame(this.draw.bind(this)));
  }
  play() {
    return this.onStart(), requestAnimationFrame(this.draw.bind(this)), this;
  }
}
export {
  Animation,
  AnimationGroup,
  CSSKeyframesAnimation,
  parseTemplateFrame
};
