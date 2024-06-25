var ta = Object.defineProperty;
var na = (e, t, n) => t in e ? ta(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ts = (e, t, n) => na(e, typeof t != "symbol" ? t + "" : t, n);
function clamp(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
function scale(e, t, n, i = 0, u = 1) {
  const o = (u - i) / (n - t);
  return (e - t) * o + i;
}
function lerp(e, t, n) {
  return (1 - e) * t + e * n;
}
function deCasteljau(e, t) {
  const n = t.length - 1, i = [...t];
  for (let u = 1; u <= n; u++)
    for (let o = 0; o <= n - u; o++)
      i[o] = lerp(e, i[o], i[o + 1]);
  return i[0];
}
function cubicBezier(e, t, n, i, u) {
  return [deCasteljau(e, [0, t, i, 1]), deCasteljau(e, [0, n, u, 1])];
}
function interpBezier(e, t) {
  const n = t.map((u) => u[0]), i = t.map((u) => u[1]);
  return [deCasteljau(e, n), deCasteljau(e, i)];
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
const CSSBezier = (e, t, n, i) => (u) => (u = cubicBezier(u, e, t, n, i)[1], u);
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
  (function(n, i) {
    e.exports = i();
  })(typeof self < "u" ? self : commonjsGlobal, function() {
    return function(n) {
      var i = {};
      function u(o) {
        if (i[o]) return i[o].exports;
        var l = i[o] = { i: o, l: !1, exports: {} };
        return n[o].call(l.exports, l, l.exports, u), l.l = !0, l.exports;
      }
      return u.m = n, u.c = i, u.d = function(o, l, f) {
        u.o(o, l) || Object.defineProperty(o, l, { configurable: !1, enumerable: !0, get: f });
      }, u.r = function(o) {
        Object.defineProperty(o, "__esModule", { value: !0 });
      }, u.n = function(o) {
        var l = o && o.__esModule ? function() {
          return o.default;
        } : function() {
          return o;
        };
        return u.d(l, "a", l), l;
      }, u.o = function(o, l) {
        return Object.prototype.hasOwnProperty.call(o, l);
      }, u.p = "", u(u.s = 0);
    }([function(n, i, u) {
      function o(Be) {
        if (!(this instanceof o)) return new o(Be);
        this._ = Be;
      }
      var l = o.prototype;
      function f(Be, Sn) {
        for (var is = 0; is < Be; is++) Sn(is);
      }
      function d(Be, Sn, is) {
        return function(cs, ps) {
          f(ps.length, function(ds) {
            cs(ps[ds], ds, ps);
          });
        }(function(cs, ps, ds) {
          Sn = Be(Sn, cs, ps, ds);
        }, is), Sn;
      }
      function p(Be, Sn) {
        return d(function(is, cs, ps, ds) {
          return is.concat([Be(cs, ps, ds)]);
        }, [], Sn);
      }
      function c(Be, Sn) {
        var is = { v: 0, buf: Sn };
        return f(Be, function() {
          var cs;
          is = { v: is.v << 1 | (cs = is.buf, cs[0] >> 7), buf: function(ps) {
            var ds = d(function(gs, Os, js, Hs) {
              return gs.concat(js === Hs.length - 1 ? Buffer.from([Os, 0]).readUInt16BE(0) : Hs.readUInt16BE(js));
            }, [], ps);
            return Buffer.from(p(function(gs) {
              return (gs << 1 & 65535) >> 8;
            }, ds));
          }(is.buf) };
        }), is;
      }
      function a() {
        return typeof Buffer < "u";
      }
      function m() {
        if (!a()) throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function g(Be) {
        m();
        var Sn = d(function(ds, gs) {
          return ds + gs;
        }, 0, Be);
        if (Sn % 8 != 0) throw new Error("The bits [" + Be.join(", ") + "] add up to " + Sn + " which is not an even number of bytes; the total should be divisible by 8");
        var is, cs = Sn / 8, ps = (is = function(ds) {
          return ds > 48;
        }, d(function(ds, gs) {
          return ds || (is(gs) ? gs : ds);
        }, null, Be));
        if (ps) throw new Error(ps + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new o(function(ds, gs) {
          var Os = cs + gs;
          return Os > ds.length ? ns(gs, cs.toString() + " bytes") : yt(Os, d(function(js, Hs) {
            var zs = c(Hs, js.buf);
            return { coll: js.coll.concat(zs.v), buf: zs.buf };
          }, { coll: [], buf: ds.slice(gs, Os) }, Be).coll);
        });
      }
      function v(Be, Sn) {
        return new o(function(is, cs) {
          return m(), cs + Sn > is.length ? ns(cs, Sn + " bytes for " + Be) : yt(cs + Sn, is.slice(cs, cs + Sn));
        });
      }
      function h(Be, Sn) {
        if (typeof (is = Sn) != "number" || Math.floor(is) !== is || Sn < 0 || Sn > 6) throw new Error(Be + " requires integer length in range [0, 6].");
        var is;
      }
      function F(Be) {
        return h("uintBE", Be), v("uintBE(" + Be + ")", Be).map(function(Sn) {
          return Sn.readUIntBE(0, Be);
        });
      }
      function C(Be) {
        return h("uintLE", Be), v("uintLE(" + Be + ")", Be).map(function(Sn) {
          return Sn.readUIntLE(0, Be);
        });
      }
      function _(Be) {
        return h("intBE", Be), v("intBE(" + Be + ")", Be).map(function(Sn) {
          return Sn.readIntBE(0, Be);
        });
      }
      function H(Be) {
        return h("intLE", Be), v("intLE(" + Be + ")", Be).map(function(Sn) {
          return Sn.readIntLE(0, Be);
        });
      }
      function Dr(Be) {
        return Be instanceof o;
      }
      function ge(Be) {
        return {}.toString.call(Be) === "[object Array]";
      }
      function gt(Be) {
        return a() && Buffer.isBuffer(Be);
      }
      function yt(Be, Sn) {
        return { status: !0, index: Be, value: Sn, furthest: -1, expected: [] };
      }
      function ns(Be, Sn) {
        return ge(Sn) || (Sn = [Sn]), { status: !1, index: -1, value: null, furthest: Be, expected: Sn };
      }
      function us(Be, Sn) {
        if (!Sn || Be.furthest > Sn.furthest) return Be;
        var is = Be.furthest === Sn.furthest ? function(cs, ps) {
          if (function() {
            if (o._supportsSet !== void 0) return o._supportsSet;
            var Oi = typeof Set < "u";
            return o._supportsSet = Oi, Oi;
          }() && Array.from) {
            for (var ds = new Set(cs), gs = 0; gs < ps.length; gs++) ds.add(ps[gs]);
            var Os = Array.from(ds);
            return Os.sort(), Os;
          }
          for (var js = {}, Hs = 0; Hs < cs.length; Hs++) js[cs[Hs]] = !0;
          for (var zs = 0; zs < ps.length; zs++) js[ps[zs]] = !0;
          var Si = [];
          for (var Ys in js) ({}).hasOwnProperty.call(js, Ys) && Si.push(Ys);
          return Si.sort(), Si;
        }(Be.expected, Sn.expected) : Sn.expected;
        return { status: Be.status, index: Be.index, value: Be.value, furthest: Sn.furthest, expected: is };
      }
      var ms = {};
      function ks(Be, Sn) {
        if (gt(Be)) return { offset: Sn, line: -1, column: -1 };
        Be in ms || (ms[Be] = {});
        for (var is = ms[Be], cs = 0, ps = 0, ds = 0, gs = Sn; gs >= 0; ) {
          if (gs in is) {
            cs = is[gs].line, ds === 0 && (ds = is[gs].lineStart);
            break;
          }
          (Be.charAt(gs) === `
` || Be.charAt(gs) === "\r" && Be.charAt(gs + 1) !== `
`) && (ps++, ds === 0 && (ds = gs + 1)), gs--;
        }
        var Os = cs + ps, js = Sn - ds;
        return is[Sn] = { line: Os, lineStart: ds }, { offset: Sn, line: Os + 1, column: js + 1 };
      }
      function Cs(Be) {
        if (!Dr(Be)) throw new Error("not a parser: " + Be);
      }
      function $s(Be, Sn) {
        return typeof Be == "string" ? Be.charAt(Sn) : Be[Sn];
      }
      function Fs(Be) {
        if (typeof Be != "number") throw new Error("not a number: " + Be);
      }
      function ws(Be) {
        if (typeof Be != "function") throw new Error("not a function: " + Be);
      }
      function vs(Be) {
        if (typeof Be != "string") throw new Error("not a string: " + Be);
      }
      var Is = 2, Ci = 3, Vs = 8, xi = 5 * Vs, Fi = 4 * Vs, Ei = "  ";
      function yi(Be, Sn) {
        return new Array(Sn + 1).join(Be);
      }
      function Ps(Be, Sn, is) {
        var cs = Sn - Be.length;
        return cs <= 0 ? Be : yi(is, cs) + Be;
      }
      function Ai(Be, Sn, is, cs) {
        return { from: Be - Sn > 0 ? Be - Sn : 0, to: Be + is > cs ? cs : Be + is };
      }
      function Ri(Be, Sn) {
        var is, cs, ps, ds, gs, Os = Sn.index, js = Os.offset, Hs = 1;
        if (js === Be.length) return "Got the end of the input";
        if (gt(Be)) {
          var zs = js - js % Vs, Si = js - zs, Ys = Ai(zs, xi, Fi + Vs, Be.length), Oi = p(function(qs) {
            return p(function(Ni) {
              return Ps(Ni.toString(16), 2, "0");
            }, qs);
          }, function(qs, Ni) {
            var Ii = qs.length, _i = [], Mi = 0;
            if (Ii <= Ni) return [qs.slice()];
            for (var Li = 0; Li < Ii; Li++) _i[Mi] || _i.push([]), _i[Mi].push(qs[Li]), (Li + 1) % Ni == 0 && Mi++;
            return _i;
          }(Be.slice(Ys.from, Ys.to).toJSON().data, Vs));
          ds = function(qs) {
            return qs.from === 0 && qs.to === 1 ? { from: qs.from, to: qs.to } : { from: qs.from / Vs, to: Math.floor(qs.to / Vs) };
          }(Ys), cs = zs / Vs, is = 3 * Si, Si >= 4 && (is += 1), Hs = 2, ps = p(function(qs) {
            return qs.length <= 4 ? qs.join(" ") : qs.slice(0, 4).join(" ") + "  " + qs.slice(4).join(" ");
          }, Oi), (gs = (8 * (ds.to > 0 ? ds.to - 1 : ds.to)).toString(16).length) < 2 && (gs = 2);
        } else {
          var ji = Be.split(/\r\n|[\n\r\u2028\u2029]/);
          is = Os.column - 1, cs = Os.line - 1, ds = Ai(cs, Is, Ci, ji.length), ps = ji.slice(ds.from, ds.to), gs = ds.to.toString().length;
        }
        var wu = cs - ds.from;
        return gt(Be) && (gs = (8 * (ds.to > 0 ? ds.to - 1 : ds.to)).toString(16).length) < 2 && (gs = 2), d(function(qs, Ni, Ii) {
          var _i, Mi = Ii === wu, Li = Mi ? "> " : Ei;
          return _i = gt(Be) ? Ps((8 * (ds.from + Ii)).toString(16), gs, "0") : Ps((ds.from + Ii + 1).toString(), gs, " "), [].concat(qs, [Li + _i + " | " + Ni], Mi ? [Ei + yi(" ", gs) + " | " + Ps("", is, " ") + yi("^", Hs)] : []);
        }, [], ps).join(`
`);
      }
      function ys(Be, Sn) {
        return [`
`, "-- PARSING FAILED " + yi("-", 50), `

`, Ri(Be, Sn), `

`, (is = Sn.expected, is.length === 1 ? `Expected:

` + is[0] : `Expected one of the following: 

` + is.join(", ")), `
`].join("");
        var is;
      }
      function as(Be) {
        return Be.flags !== void 0 ? Be.flags : [Be.global ? "g" : "", Be.ignoreCase ? "i" : "", Be.multiline ? "m" : "", Be.unicode ? "u" : "", Be.sticky ? "y" : ""].join("");
      }
      function ls() {
        for (var Be = [].slice.call(arguments), Sn = Be.length, is = 0; is < Sn; is += 1) Cs(Be[is]);
        return o(function(cs, ps) {
          for (var ds, gs = new Array(Sn), Os = 0; Os < Sn; Os += 1) {
            if (!(ds = us(Be[Os]._(cs, ps), ds)).status) return ds;
            gs[Os] = ds.value, ps = ds.index;
          }
          return us(yt(ps, gs), ds);
        });
      }
      function Es() {
        var Be = [].slice.call(arguments);
        if (Be.length === 0) throw new Error("seqMap needs at least one argument");
        var Sn = Be.pop();
        return ws(Sn), ls.apply(null, Be).map(function(is) {
          return Sn.apply(null, is);
        });
      }
      function As() {
        var Be = [].slice.call(arguments), Sn = Be.length;
        if (Sn === 0) return Pi("zero alternates");
        for (var is = 0; is < Sn; is += 1) Cs(Be[is]);
        return o(function(cs, ps) {
          for (var ds, gs = 0; gs < Be.length; gs += 1) if ((ds = us(Be[gs]._(cs, ps), ds)).status) return ds;
          return ds;
        });
      }
      function Ls(Be, Sn) {
        return Ks(Be, Sn).or(gi([]));
      }
      function Ks(Be, Sn) {
        return Cs(Be), Cs(Sn), Es(Be, Sn.then(Be).many(), function(is, cs) {
          return [is].concat(cs);
        });
      }
      function Gs(Be) {
        vs(Be);
        var Sn = "'" + Be + "'";
        return o(function(is, cs) {
          var ps = cs + Be.length, ds = is.slice(cs, ps);
          return ds === Be ? yt(ps, ds) : ns(cs, Sn);
        });
      }
      function Ws(Be, Sn) {
        (function(ps) {
          if (!(ps instanceof RegExp)) throw new Error("not a regexp: " + ps);
          for (var ds = as(ps), gs = 0; gs < ds.length; gs++) {
            var Os = ds.charAt(gs);
            if (Os !== "i" && Os !== "m" && Os !== "u" && Os !== "s") throw new Error('unsupported regexp flag "' + Os + '": ' + ps);
          }
        })(Be), arguments.length >= 2 ? Fs(Sn) : Sn = 0;
        var is = function(ps) {
          return RegExp("^(?:" + ps.source + ")", as(ps));
        }(Be), cs = "" + Be;
        return o(function(ps, ds) {
          var gs = is.exec(ps.slice(ds));
          if (gs) {
            if (0 <= Sn && Sn <= gs.length) {
              var Os = gs[0], js = gs[Sn];
              return yt(ds + Os.length, js);
            }
            return ns(ds, "valid match group (0 to " + gs.length + ") in " + cs);
          }
          return ns(ds, cs);
        });
      }
      function gi(Be) {
        return o(function(Sn, is) {
          return yt(is, Be);
        });
      }
      function Pi(Be) {
        return o(function(Sn, is) {
          return ns(is, Be);
        });
      }
      function vi(Be) {
        if (Dr(Be)) return o(function(Sn, is) {
          var cs = Be._(Sn, is);
          return cs.index = is, cs.value = "", cs;
        });
        if (typeof Be == "string") return vi(Gs(Be));
        if (Be instanceof RegExp) return vi(Ws(Be));
        throw new Error("not a string, regexp, or parser: " + Be);
      }
      function bi(Be) {
        return Cs(Be), o(function(Sn, is) {
          var cs = Be._(Sn, is), ps = Sn.slice(is, cs.index);
          return cs.status ? ns(is, 'not "' + ps + '"') : yt(is, null);
        });
      }
      function $i(Be) {
        return ws(Be), o(function(Sn, is) {
          var cs = $s(Sn, is);
          return is < Sn.length && Be(cs) ? yt(is + 1, cs) : ns(is, "a character/byte matching " + Be);
        });
      }
      function Bi(Be, Sn) {
        arguments.length < 2 && (Sn = Be, Be = void 0);
        var is = o(function(cs, ps) {
          return is._ = Sn()._, is._(cs, ps);
        });
        return Be ? is.desc(Be) : is;
      }
      function Ti() {
        return Pi("fantasy-land/empty");
      }
      l.parse = function(Be) {
        if (typeof Be != "string" && !gt(Be)) throw new Error(".parse must be called with a string or Buffer as its argument");
        var Sn, is = this.skip(Vi)._(Be, 0);
        return Sn = is.status ? { status: !0, value: is.value } : { status: !1, index: ks(Be, is.furthest), expected: is.expected }, delete ms[Be], Sn;
      }, l.tryParse = function(Be) {
        var Sn = this.parse(Be);
        if (Sn.status) return Sn.value;
        var is = ys(Be, Sn), cs = new Error(is);
        throw cs.type = "ParsimmonError", cs.result = Sn, cs;
      }, l.assert = function(Be, Sn) {
        return this.chain(function(is) {
          return Be(is) ? gi(is) : Pi(Sn);
        });
      }, l.or = function(Be) {
        return As(this, Be);
      }, l.trim = function(Be) {
        return this.wrap(Be, Be);
      }, l.wrap = function(Be, Sn) {
        return Es(Be, this, Sn, function(is, cs) {
          return cs;
        });
      }, l.thru = function(Be) {
        return Be(this);
      }, l.then = function(Be) {
        return Cs(Be), ls(this, Be).map(function(Sn) {
          return Sn[1];
        });
      }, l.many = function() {
        var Be = this;
        return o(function(Sn, is) {
          for (var cs = [], ps = void 0; ; ) {
            if (!(ps = us(Be._(Sn, is), ps)).status) return us(yt(is, cs), ps);
            if (is === ps.index) throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            is = ps.index, cs.push(ps.value);
          }
        });
      }, l.tieWith = function(Be) {
        return vs(Be), this.map(function(Sn) {
          if (function(ps) {
            if (!ge(ps)) throw new Error("not an array: " + ps);
          }(Sn), Sn.length) {
            vs(Sn[0]);
            for (var is = Sn[0], cs = 1; cs < Sn.length; cs++) vs(Sn[cs]), is += Be + Sn[cs];
            return is;
          }
          return "";
        });
      }, l.tie = function() {
        return this.tieWith("");
      }, l.times = function(Be, Sn) {
        var is = this;
        return arguments.length < 2 && (Sn = Be), Fs(Be), Fs(Sn), o(function(cs, ps) {
          for (var ds = [], gs = void 0, Os = void 0, js = 0; js < Be; js += 1) {
            if (Os = us(gs = is._(cs, ps), Os), !gs.status) return Os;
            ps = gs.index, ds.push(gs.value);
          }
          for (; js < Sn && (Os = us(gs = is._(cs, ps), Os), gs.status); js += 1) ps = gs.index, ds.push(gs.value);
          return us(yt(ps, ds), Os);
        });
      }, l.result = function(Be) {
        return this.map(function() {
          return Be;
        });
      }, l.atMost = function(Be) {
        return this.times(0, Be);
      }, l.atLeast = function(Be) {
        return Es(this.times(Be), this.many(), function(Sn, is) {
          return Sn.concat(is);
        });
      }, l.map = function(Be) {
        ws(Be);
        var Sn = this;
        return o(function(is, cs) {
          var ps = Sn._(is, cs);
          return ps.status ? us(yt(ps.index, Be(ps.value)), ps) : ps;
        });
      }, l.contramap = function(Be) {
        ws(Be);
        var Sn = this;
        return o(function(is, cs) {
          var ps = Sn.parse(Be(is.slice(cs)));
          return ps.status ? yt(cs + is.length, ps.value) : ps;
        });
      }, l.promap = function(Be, Sn) {
        return ws(Be), ws(Sn), this.contramap(Be).map(Sn);
      }, l.skip = function(Be) {
        return ls(this, Be).map(function(Sn) {
          return Sn[0];
        });
      }, l.mark = function() {
        return Es(ki, this, ki, function(Be, Sn, is) {
          return { start: Be, value: Sn, end: is };
        });
      }, l.node = function(Be) {
        return Es(ki, this, ki, function(Sn, is, cs) {
          return { name: Be, value: is, start: Sn, end: cs };
        });
      }, l.sepBy = function(Be) {
        return Ls(this, Be);
      }, l.sepBy1 = function(Be) {
        return Ks(this, Be);
      }, l.lookahead = function(Be) {
        return this.skip(vi(Be));
      }, l.notFollowedBy = function(Be) {
        return this.skip(bi(Be));
      }, l.desc = function(Be) {
        ge(Be) || (Be = [Be]);
        var Sn = this;
        return o(function(is, cs) {
          var ps = Sn._(is, cs);
          return ps.status || (ps.expected = Be), ps;
        });
      }, l.fallback = function(Be) {
        return this.or(gi(Be));
      }, l.ap = function(Be) {
        return Es(Be, this, function(Sn, is) {
          return Sn(is);
        });
      }, l.chain = function(Be) {
        var Sn = this;
        return o(function(is, cs) {
          var ps = Sn._(is, cs);
          return ps.status ? us(Be(ps.value)._(is, ps.index), ps) : ps;
        });
      }, l.concat = l.or, l.empty = Ti, l.of = gi, l["fantasy-land/ap"] = l.ap, l["fantasy-land/chain"] = l.chain, l["fantasy-land/concat"] = l.concat, l["fantasy-land/empty"] = l.empty, l["fantasy-land/of"] = l.of, l["fantasy-land/map"] = l.map;
      var ki = o(function(Be, Sn) {
        return yt(Sn, ks(Be, Sn));
      }), Ji = o(function(Be, Sn) {
        return Sn >= Be.length ? ns(Sn, "any character/byte") : yt(Sn + 1, $s(Be, Sn));
      }), Zi = o(function(Be, Sn) {
        return yt(Be.length, Be.slice(Sn));
      }), Vi = o(function(Be, Sn) {
        return Sn < Be.length ? ns(Sn, "EOF") : yt(Sn, null);
      }), Yi = Ws(/[0-9]/).desc("a digit"), uo = Ws(/[0-9]*/).desc("optional digits"), po = Ws(/[a-z]/i).desc("a letter"), wo = Ws(/[a-z]*/i).desc("optional letters"), xo = Ws(/\s*/).desc("optional whitespace"), ko = Ws(/\s+/).desc("whitespace"), qi = Gs("\r"), Wi = Gs(`
`), zi = Gs(`\r
`), Ui = As(zi, Wi, qi).desc("newline"), Vo = As(Ui, Vi);
      o.all = Zi, o.alt = As, o.any = Ji, o.cr = qi, o.createLanguage = function(Be) {
        var Sn = {};
        for (var is in Be) ({}).hasOwnProperty.call(Be, is) && function(cs) {
          Sn[cs] = Bi(function() {
            return Be[cs](Sn);
          });
        }(is);
        return Sn;
      }, o.crlf = zi, o.custom = function(Be) {
        return o(Be(yt, ns));
      }, o.digit = Yi, o.digits = uo, o.empty = Ti, o.end = Vo, o.eof = Vi, o.fail = Pi, o.formatError = ys, o.index = ki, o.isParser = Dr, o.lazy = Bi, o.letter = po, o.letters = wo, o.lf = Wi, o.lookahead = vi, o.makeFailure = ns, o.makeSuccess = yt, o.newline = Ui, o.noneOf = function(Be) {
        return $i(function(Sn) {
          return Be.indexOf(Sn) < 0;
        }).desc("none of '" + Be + "'");
      }, o.notFollowedBy = bi, o.of = gi, o.oneOf = function(Be) {
        for (var Sn = Be.split(""), is = 0; is < Sn.length; is++) Sn[is] = "'" + Sn[is] + "'";
        return $i(function(cs) {
          return Be.indexOf(cs) >= 0;
        }).desc(Sn);
      }, o.optWhitespace = xo, o.Parser = o, o.range = function(Be, Sn) {
        return $i(function(is) {
          return Be <= is && is <= Sn;
        }).desc(Be + "-" + Sn);
      }, o.regex = Ws, o.regexp = Ws, o.sepBy = Ls, o.sepBy1 = Ks, o.seq = ls, o.seqMap = Es, o.seqObj = function() {
        for (var Be, Sn = {}, is = 0, cs = (Be = arguments, Array.prototype.slice.call(Be)), ps = cs.length, ds = 0; ds < ps; ds += 1) {
          var gs = cs[ds];
          if (!Dr(gs)) {
            if (ge(gs) && gs.length === 2 && typeof gs[0] == "string" && Dr(gs[1])) {
              var Os = gs[0];
              if (Object.prototype.hasOwnProperty.call(Sn, Os)) throw new Error("seqObj: duplicate key " + Os);
              Sn[Os] = !0, is++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (is === 0) throw new Error("seqObj expects at least one named parser, found zero");
        return o(function(js, Hs) {
          for (var zs, Si = {}, Ys = 0; Ys < ps; Ys += 1) {
            var Oi, ji;
            if (ge(cs[Ys]) ? (Oi = cs[Ys][0], ji = cs[Ys][1]) : (Oi = null, ji = cs[Ys]), !(zs = us(ji._(js, Hs), zs)).status) return zs;
            Oi && (Si[Oi] = zs.value), Hs = zs.index;
          }
          return us(yt(Hs, Si), zs);
        });
      }, o.string = Gs, o.succeed = gi, o.takeWhile = function(Be) {
        return ws(Be), o(function(Sn, is) {
          for (var cs = is; cs < Sn.length && Be($s(Sn, cs)); ) cs++;
          return yt(cs, Sn.slice(is, cs));
        });
      }, o.test = $i, o.whitespace = ko, o["fantasy-land/empty"] = Ti, o["fantasy-land/of"] = gi, o.Binary = { bitSeq: g, bitSeqObj: function(Be) {
        m();
        var Sn = {}, is = 0, cs = p(function(ds) {
          if (ge(ds)) {
            var gs = ds;
            if (gs.length !== 2) throw new Error("[" + gs.join(", ") + "] should be length 2, got length " + gs.length);
            if (vs(gs[0]), Fs(gs[1]), Object.prototype.hasOwnProperty.call(Sn, gs[0])) throw new Error("duplicate key in bitSeqObj: " + gs[0]);
            return Sn[gs[0]] = !0, is++, gs;
          }
          return Fs(ds), [null, ds];
        }, Be);
        if (is < 1) throw new Error("bitSeqObj expects at least one named pair, got [" + Be.join(", ") + "]");
        var ps = p(function(ds) {
          return ds[0];
        }, cs);
        return g(p(function(ds) {
          return ds[1];
        }, cs)).map(function(ds) {
          return d(function(gs, Os) {
            return Os[0] !== null && (gs[Os[0]] = Os[1]), gs;
          }, {}, p(function(gs, Os) {
            return [gs, ds[Os]];
          }, ps));
        });
      }, byte: function(Be) {
        if (m(), Fs(Be), Be > 255) throw new Error("Value specified to byte constructor (" + Be + "=0x" + Be.toString(16) + ") is larger in value than a single byte.");
        var Sn = (Be > 15 ? "0x" : "0x0") + Be.toString(16);
        return o(function(is, cs) {
          var ps = $s(is, cs);
          return ps === Be ? yt(cs + 1, ps) : ns(cs, Sn);
        });
      }, buffer: function(Be) {
        return v("buffer", Be).map(function(Sn) {
          return Buffer.from(Sn);
        });
      }, encodedString: function(Be, Sn) {
        return v("string", Sn).map(function(is) {
          return is.toString(Be);
        });
      }, uintBE: F, uint8BE: F(1), uint16BE: F(2), uint32BE: F(4), uintLE: C, uint8LE: C(1), uint16LE: C(2), uint32LE: C(4), intBE: _, int8BE: _(1), int16BE: _(2), int32BE: _(4), intLE: H, int8LE: H(1), int16LE: H(2), int32LE: H(4), floatBE: v("floatBE", 4).map(function(Be) {
        return Be.readFloatBE(0);
      }), floatLE: v("floatLE", 4).map(function(Be) {
        return Be.readFloatLE(0);
      }), doubleBE: v("doubleBE", 8).map(function(Be) {
        return Be.readDoubleBE(0);
      }), doubleLE: v("doubleLE", 8).map(function(Be) {
        return Be.readDoubleLE(0);
      }) }, n.exports = o;
    }]);
  });
})(parsimmon_umd_min);
var parsimmon_umd_minExports = parsimmon_umd_min.exports;
const P$2 = /* @__PURE__ */ getDefaultExportFromCjs(parsimmon_umd_minExports);
function define(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function extend(e, t) {
  var n = Object.create(e.prototype);
  for (var i in t) n[i] = t[i];
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
function rgba(e, t, n, i) {
  return i <= 0 && (e = t = n = NaN), new Rgb(e, t, n, i);
}
function rgbConvert(e) {
  return e instanceof Color || (e = color(e)), e ? (e = e.rgb(), new Rgb(e.r, e.g, e.b, e.opacity)) : new Rgb();
}
function rgb(e, t, n, i) {
  return arguments.length === 1 ? rgbConvert(e) : new Rgb(e, t, n, i ?? 1);
}
function Rgb(e, t, n, i) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +i;
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
function hsla(e, t, n, i) {
  return i <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Hsl(e, t, n, i);
}
function hslConvert(e) {
  if (e instanceof Hsl) return new Hsl(e.h, e.s, e.l, e.opacity);
  if (e instanceof Color || (e = color(e)), !e) return new Hsl();
  if (e instanceof Hsl) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, i = e.b / 255, u = Math.min(t, n, i), o = Math.max(t, n, i), l = NaN, f = o - u, d = (o + u) / 2;
  return f ? (t === o ? l = (n - i) / f + (n < i) * 6 : n === o ? l = (i - t) / f + 2 : l = (t - n) / f + 4, f /= d < 0.5 ? o + u : 2 - o - u, l *= 60) : f = d > 0 && d < 1 ? 0 : l, new Hsl(l, f, d, e.opacity);
}
function hsl(e, t, n, i) {
  return arguments.length === 1 ? hslConvert(e) : new Hsl(e, t, n, i ?? 1);
}
function Hsl(e, t, n, i) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +i;
}
define(Hsl, hsl, extend(Color, {
  brighter(e) {
    return e = e == null ? brighter : Math.pow(brighter, e), new Hsl(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? darker : Math.pow(darker, e), new Hsl(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, i = n + (n < 0.5 ? n : 1 - n) * t, u = 2 * n - i;
    return new Rgb(
      hsl2rgb(e >= 240 ? e - 240 : e + 120, u, i),
      hsl2rgb(e, u, i),
      hsl2rgb(e < 120 ? e + 240 : e - 120, u, i),
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
const radians = Math.PI / 180, degrees = 180 / Math.PI, K$2 = 18, Xn$2 = 0.96422, Yn$1 = 1, Zn$2 = 0.82521, t0 = 4 / 29, t1 = 6 / 29, t2 = 3 * t1 * t1, t3 = t1 * t1 * t1;
function labConvert(e) {
  if (e instanceof Lab) return new Lab(e.l, e.a, e.b, e.opacity);
  if (e instanceof Hcl) return hcl2lab(e);
  e instanceof Rgb || (e = rgbConvert(e));
  var t = rgb2lrgb(e.r), n = rgb2lrgb(e.g), i = rgb2lrgb(e.b), u = xyz2lab((0.2225045 * t + 0.7168786 * n + 0.0606169 * i) / Yn$1), o, l;
  return t === n && n === i ? o = l = u : (o = xyz2lab((0.4360747 * t + 0.3850649 * n + 0.1430804 * i) / Xn$2), l = xyz2lab((0.0139322 * t + 0.0971045 * n + 0.7141733 * i) / Zn$2)), new Lab(116 * u - 16, 500 * (o - u), 200 * (u - l), e.opacity);
}
function lab(e, t, n, i) {
  return arguments.length === 1 ? labConvert(e) : new Lab(e, t, n, i ?? 1);
}
function Lab(e, t, n, i) {
  this.l = +e, this.a = +t, this.b = +n, this.opacity = +i;
}
define(Lab, lab, extend(Color, {
  brighter(e) {
    return new Lab(this.l + K$2 * (e ?? 1), this.a, this.b, this.opacity);
  },
  darker(e) {
    return new Lab(this.l - K$2 * (e ?? 1), this.a, this.b, this.opacity);
  },
  rgb() {
    var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
    return t = Xn$2 * lab2xyz(t), e = Yn$1 * lab2xyz(e), n = Zn$2 * lab2xyz(n), new Rgb(
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
function lch(e, t, n, i) {
  return arguments.length === 1 ? hclConvert(e) : new Hcl(n, t, e, i ?? 1);
}
function hcl(e, t, n, i) {
  return arguments.length === 1 ? hclConvert(e) : new Hcl(e, t, n, i ?? 1);
}
function Hcl(e, t, n, i) {
  this.h = +e, this.c = +t, this.l = +n, this.opacity = +i;
}
function hcl2lab(e) {
  if (isNaN(e.h)) return new Lab(e.l, 0, 0, e.opacity);
  var t = e.h * radians;
  return new Lab(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
define(Hcl, hcl, extend(Color, {
  brighter(e) {
    return new Hcl(this.h, this.c, this.l + K$2 * (e ?? 1), this.opacity);
  },
  darker(e) {
    return new Hcl(this.h, this.c, this.l - K$2 * (e ?? 1), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));
const arrayEquals = (e, t) => {
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
function camelCaseToHyphen(e) {
  return e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`);
}
function requestAnimationFrame(e) {
  return window != null ? window.requestAnimationFrame(e) : setImmediate(() => {
    e(Date.now());
  });
}
function convertAbsoluteUnitToPixels(e, t) {
  let n = e;
  return t === "cm" ? n *= 96 / 2.54 : t === "mm" ? n *= 96 / 25.4 : t === "in" ? n *= 96 : t === "pt" ? n *= 4 / 3 : t === "pc" && (n *= 16), n;
}
function convertToPixels(e, t, n, i) {
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
  else if (t === "%" && (n != null && n.parentElement) && i) {
    const u = parseFloat(
      getComputedStyle(n.parentElement).getPropertyValue(i)
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
  const n = getComputedStyle(e).getPropertyValue(t), i = CSSValueUnit.Value.parse(n);
  return i.status ? i.value : void 0;
}, lerpColor = (e, t, n) => {
  const i = t.value, u = n.value;
  return {
    r: lerp(e, i.r, u.r),
    g: lerp(e, i.g, u.g),
    b: lerp(e, i.b, u.b)
  };
}, lerpVar = (e, t, n, i) => {
  const u = t.unit === "var" ? getComputedValue(i, String(t.value)) : t, o = n.unit === "var" ? getComputedValue(i, String(n.value)) : n;
  return u.lerp(e, o, i);
};
class ValueUnit {
  constructor(t, n, i = []) {
    this.value = t, this.unit = n, this.superType = i;
  }
  toString() {
    if (!this.unit || this.unit === "string")
      return `${this.value}`;
    if (this.unit === "color") {
      const t = this.value;
      return `rgb(${t.r}, ${t.g}, ${t.b})`;
    } else return this.unit === "var" ? `var(${this.value})` : this.unit === "calc" ? `calc(${this.value})` : `${this.value}${this.unit}`;
  }
  lerp(t, n, i) {
    if (this.unit === "string" || n.unit === "string")
      return this;
    if (i && (this.unit === "var" || n.unit === "var"))
      return lerpVar(t, this, n, i);
    if (this.unit !== n.unit) {
      const [o, l] = collapseNumericType(this, n, i), f = lerp(t, o.value, l.value);
      return new ValueUnit(f, o.unit, o.superType);
    } else if (this.unit === "color") {
      const o = lerpColor(
        t,
        this,
        n
      );
      return new ValueUnit(o, this.unit, this.superType);
    }
    const u = lerp(t, this.value, n.value);
    return new ValueUnit(u, this.unit, this.superType);
  }
}
function lerpMany(e, t, n, i) {
  const u = Math.min(t.length, n.length), o = [];
  for (let l = 0; l < u; l++) {
    const f = t[l], d = n[l];
    o.push(f.lerp(e, d, i));
  }
  return o;
}
class FunctionValue {
  constructor(t, n) {
    this.name = t, this.values = n;
  }
  toString() {
    const t = this.values.map((n) => n.toString()).join(", ");
    return `${this.name}(${t})`;
  }
  lerp(t, n, i) {
    const u = lerpMany(t, this.values, n.values, i);
    return new FunctionValue(this.name, u);
  }
}
class ValueArray {
  constructor(t) {
    this.values = t;
  }
  toString() {
    return this.values.map((t) => t.toString()).join(" ");
  }
  lerp(t, n, i) {
    const u = lerpMany(t, this.values, n.values, i);
    return new ValueArray(u);
  }
}
const collapseNumericType = (e, t, n) => {
  if (!arrayEquals(e.superType, t.superType) && e.superType[0] !== "length")
    return [e, t];
  const [i, u] = e.superType[0] === "length" ? [
    convertToPixels(e.value, e.unit, n),
    convertToPixels(t.value, t.unit, n)
  ] : e.superType[0] === "angle" ? [
    convertToDegrees(e.value, e.unit),
    convertToDegrees(t.value, t.unit)
  ] : e.superType[0] === "time" ? [parseCSSTime(e.value + e.unit), parseCSSTime(t.value + t.unit)] : e.superType[0] === "resolution" ? [convertToDpi(e.value, e.unit), convertToDpi(t.value, t.unit)] : [e, t], [o, l] = [e.unit, e.superType];
  return [new ValueUnit(i, o, l), new ValueUnit(u, o, l)];
};
function transformObject(e) {
  const t = {}, n = (i, u = "", o = "") => {
    if (i instanceof ValueUnit || i instanceof FunctionValue || i instanceof ValueArray)
      return i;
    if (typeof i == "object")
      for (const [f, d] of Object.entries(i)) {
        const p = u ? `${u}.${f}` : f, c = n(d, p, f);
        c !== void 0 && (t[p] = c);
      }
    else
      return CSSKeyframes.FunctionArgs.map(
        (d) => new FunctionValue(o, d)
      ).or(CSSKeyframes.Value).tryParse(String(i));
  };
  return n(e), t;
}
function reverseTransformObject(e, t, n = {}) {
  const i = e.split(".");
  let u = n;
  if (i.length === 1)
    return n[e] = t, n;
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    t !== void 0 && o === i.length - 1 ? u[l] = t.toString() : u = u[l] ?? (u[l] = {});
  }
  return n;
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
  // TODO! Fix conflict with Math.tan
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
], lengthUnits = [...absoluteLengthUnits, ...relativeLengthUnits], timeUnits = ["s", "ms"], angleUnits = ["deg", "rad", "grad", "turn"], percentageUnits = ["%"], resolutionUnits = ["dpi", "dpcm", "dppx"], identifier = P$2.regexp(/[a-zA-Z][a-zA-Z0-9-]+/), none = P$2.string("none"), integer = P$2.regexp(/-?\d+/).map(Number), number = P$2.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number), opt = (e) => P$2.alt(e, P$2.succeed(void 0)), hex2rgb = (e) => {
  const t = parseInt(e.slice(1, 3), 16), n = parseInt(e.slice(3, 5), 16), i = parseInt(e.slice(5, 7), 16);
  return [t, n, i];
}, hsv2hsl = (e, t, n) => {
  const i = (2 - t) * n / 2, u = i !== 0 && i !== 1 ? t * n / (i < 0.5 ? i * 2 : 2 - i * 2) : 0;
  return [e, u, i];
}, hwb2hsl = (e, t, n) => {
  const i = (1 - n) / 2, u = t === 1 ? 0 : t === 0 ? 1 : (1 - t - n) / (1 - n);
  return [e, u, i];
}, colorOptionalAlpha = (e, t) => {
  const n = P$2.string(t).skip(opt(P$2.string("a"))).trim(P$2.optWhitespace), i = P$2.alt(
    P$2.seq(e.colorValue.skip(e.alphaSep), e.colorValue),
    P$2.seq(e.colorValue)
  ), u = P$2.seq(
    e.colorValue.skip(e.sep),
    e.colorValue.skip(e.sep),
    i
  ).trim(P$2.optWhitespace).wrap(P$2.string("("), P$2.string(")"));
  return n.then(u).map(([o, l, [f, d]]) => [o, l, f, d ?? 1]);
}, CSSColor = P$2.createLanguage({
  colorValue: () => P$2.alt(
    integer.skip(P$2.string("%")).map((e) => e / 100),
    number
  ),
  comma: () => P$2.string(","),
  space: () => P$2.string(" "),
  div: () => P$2.string("/"),
  sep: (e) => e.comma.or(e.space).trim(P$2.optWhitespace),
  alphaSep: (e) => e.sep.or(e.div).trim(P$2.optWhitespace),
  name: () => P$2.alt(
    ...Object.keys(colorNames).sort((e, t) => t.length - e.length).map(P$2.string)
  ).map((e) => {
    const t = colorNames[e], [n, i, u] = hex2rgb(t);
    return rgb(n, i, u);
  }),
  hex: () => P$2.regexp(/#[0-9a-fA-F]{3,6}/).map((e) => {
    const t = e.slice(1), n = t.length === 3 ? t[0] + t[0] : t.slice(0, 2), i = t.length === 3 ? t[1] + t[1] : t.slice(2, 4), u = t.length === 3 ? t[2] + t[2] : t.slice(4, 6);
    return rgb(parseInt(n, 16), parseInt(i, 16), parseInt(u, 16));
  }),
  rgb: (e) => colorOptionalAlpha(e, "rgb").map(([t, n, i, u]) => rgb(t, n, i, u)),
  hsl: (e) => colorOptionalAlpha(e, "hsl").map(([t, n, i, u]) => hsl(t, n, i, u)),
  hsv: (e) => colorOptionalAlpha(e, "hsv").map(([t, n, i, u]) => {
    const [o, l, f] = hsv2hsl(t, n, i);
    return hsl(o, l, f, u);
  }),
  hwb: (e) => colorOptionalAlpha(e, "hwb").map(([t, n, i, u]) => {
    const [o, l, f] = hwb2hsl(t, n, i);
    return hsl(o, l, f, u);
  }),
  lab: (e) => colorOptionalAlpha(e, "lab").map(([t, n, i, u]) => lab(t, n, i, u)),
  lch: (e) => colorOptionalAlpha(e, "lch").map(([t, n, i, u]) => lch(t, n, i, u)),
  Value: (e) => P$2.alt(e.hex, e.rgb, e.hsl, e.hsv, e.hwb, e.lab, e.lch, e.name).trim(
    P$2.optWhitespace
  )
}), CSSValueUnit = P$2.createLanguage({
  lengthUnit: () => P$2.alt(...lengthUnits.map(P$2.string)),
  angleUnit: () => P$2.alt(...angleUnits.map(P$2.string)),
  timeUnit: () => P$2.alt(...timeUnits.map(P$2.string)),
  resolutionUnit: () => P$2.alt(...resolutionUnits.map(P$2.string)),
  percentageUnit: () => P$2.alt(...percentageUnits.map(P$2.string)),
  Length: (e) => P$2.seq(number, e.lengthUnit).map(([t, n]) => {
    let i = ["length"];
    return relativeLengthUnits.includes(n) ? i.push("relative") : absoluteLengthUnits.includes(n) && i.push("absolute"), new ValueUnit(t, n, i);
  }),
  Angle: (e) => P$2.seq(number, e.angleUnit).map(([t, n]) => new ValueUnit(t, n, ["angle"])),
  Time: (e) => P$2.seq(number, e.timeUnit).map(([t, n]) => new ValueUnit(t, n, ["time"])),
  Resolution: (e) => P$2.seq(number, e.resolutionUnit).map(([t, n]) => new ValueUnit(t, n, ["resolution"])),
  Percentage: (e) => P$2.seq(integer, e.percentageUnit).map(([t, n]) => new ValueUnit(t, n, ["percentage"])),
  Color: (e) => CSSColor.Value.map((t) => new ValueUnit(t, "color")),
  Value: (e) => P$2.alt(
    e.Length,
    e.Angle,
    e.Time,
    e.Resolution,
    e.Percentage,
    e.Color,
    P$2.alt(number, none).map((t) => new ValueUnit(t))
  ).trim(P$2.optWhitespace)
}), istring = (e) => P$2((t, n) => t.slice(n).toLowerCase().startsWith(e.toLowerCase()) ? P$2.makeSuccess(n + e.length, e) : P$2.makeFailure(n, `Expected ${e}`)), unaryMathFunctions = {
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
  const n = t.reduce((l, f) => collapseNumericType(l, f), t[0])[0], i = t.map((l) => l.value).map((l) => n.superType && n.superType[0] === "angle" ? convertToDegrees(l, n.unit) * (Math.PI / 180) : l), u = mathFunctions[e], o = u(...i);
  if (o)
    return new ValueUnit(o, n.unit, n.superType);
};
function evaluateMathOperator(e, t, n) {
  if ([t, n] = collapseNumericType(t, n), !t.unit && n.unit)
    [t, n] = [n, t];
  else if (n.unit && !arrayEquals(t.superType, n.superType))
    return;
  const i = (() => {
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
  return new ValueUnit(i, t.unit, t.superType);
}
const reduceMathOperators = (e, t) => t.length === 0 ? e : t.reduce((i, [u, o]) => {
  if (typeof i == "string" || !(o instanceof ValueUnit))
    return `${i} ${u} ${o}`;
  const l = evaluateMathOperator(u, i, o);
  return l || `${i} ${u} ${o}`;
}, e), MathValue = P$2.createLanguage({
  ws: () => P$2.optWhitespace,
  lparen: (e) => P$2.string("(").trim(e.ws),
  rparen: (e) => P$2.string(")").trim(e.ws),
  comma: (e) => P$2.string(",").trim(e.ws),
  termOperators: (e) => P$2.alt(...["*", "/", "//"].map(P$2.string)).trim(e.ws),
  factorOperators: (e) => P$2.alt(...["+", "-"].map(P$2.string)).trim(e.ws),
  pow: (e) => P$2.string("^").trim(e.ws),
  Expression: (e) => P$2.alt(e.Function, e.Term),
  FunctionArgs: (e) => P$2.sepBy1(e.Expression, e.comma).trim(e.ws).wrap(e.lparen, e.rparen),
  Function: (e) => P$2.seq(P$2.alt(...Object.keys(mathFunctions).map(P$2.string)), e.FunctionArgs).map(
    ([t, n]) => {
      const i = evaluateMathFunction(
        t,
        n
      );
      return i || new FunctionValue(t, n);
    }
  ),
  Term: (e) => P$2.seqMap(
    e.Factor,
    P$2.seq(e.termOperators, e.Factor).many(),
    reduceMathOperators
  ),
  Factor: (e) => P$2.seqMap(e.Atom, P$2.seq(e.factorOperators, e.Term).many(), reduceMathOperators),
  CSSVariable: (e) => P$2.string("--").then(identifier).map((t) => new ValueUnit("--" + t, "var")),
  Atom: (e) => P$2.alt(CSSValueUnit.Value, e.CSSVariable, e.Expression).trim(e.ws)
}), handleCalc = (e) => P$2.string("calc").then(MathValue.Expression.trim(e.ws).wrap(e.lparen, e.rparen)).map((t) => t instanceof ValueUnit ? t : new ValueUnit(t, "calc")), TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring), DIMS = ["x", "y", "z"].map(istring), handleFunc = (e, t) => P$2.seq(t || identifier, e.FunctionArgs).map((n) => n), handleTransform = (e) => {
  const t = P$2.seq(P$2.alt(...TRANSFORM_FUNCTIONS), P$2.alt(...DIMS, P$2.string("")));
  return handleFunc(e, t).map(([[i, u], o]) => (i = i.toLowerCase(), u ? new FunctionValue(i + u.toUpperCase(), [o[0]]) : o.length === 1 ? new FunctionValue(i, [o[0]]) : new FunctionValue(i, o)));
}, handleVar = (e) => P$2.string("var").then(e.String.trim(e.ws).wrap(e.lparen, e.rparen)).map((t) => new ValueUnit(t, "var")), gradientDirections = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
}, handleGradient = (e) => {
  const t = P$2.alt(...["linear-gradient", "radial-gradient"].map(istring)), n = P$2.seq(
    P$2.string("to").skip(e.ws),
    P$2.alt(...["left", "right", "top", "bottom"].map(istring))
  ).map(([d, p]) => (p = gradientDirections[p.toLowerCase()], new ValueUnit(p, "deg"))), i = P$2.alt(CSSValueUnit.Angle, n), u = P$2.alt(CSSValueUnit.Length, CSSValueUnit.Percentage), o = P$2.seq(
    CSSValueUnit.Color,
    P$2.sepBy(u, e.ws)
  ).map(([d, p]) => p ? [d, ...p] : [d]), l = P$2.seq(
    o,
    e.comma.trim(e.ws).then(o.or(u)).many()
  ).map(([d, p]) => [d, ...p].map((c) => new ValueArray(c)));
  return P$2.seq(
    t,
    P$2.seq(opt(i.skip(e.comma)), l).trim(e.ws).wrap(e.lparen, e.rparen).map(([d, p]) => d ? [d, ...p].flat() : [p])
  ).map(([d, p]) => new FunctionValue(d, p));
}, handleCubicBezier = (e) => handleFunc(e, P$2.string("cubic-bezier")).map((t) => new FunctionValue("cubic-bezier", t[1])), CSSKeyframes = P$2.createLanguage({
  ws: () => P$2.optWhitespace,
  semi: () => P$2.string(";"),
  colon: () => P$2.string(":"),
  lcurly: () => P$2.string("{"),
  rcurly: () => P$2.string("}"),
  lparen: () => P$2.string("("),
  rparen: () => P$2.string(")"),
  comma: () => P$2.string(","),
  Rule: (e) => P$2.string("@keyframes").trim(e.ws).then(identifier),
  String: () => P$2.regexp(/[^\(\)\{\}\s,;]+/).map((e) => new ValueUnit(e)),
  FunctionArgs: (e) => e.Value.sepBy(e.comma).trim(e.ws).wrap(e.lparen, e.rparen),
  Function: (e) => P$2.alt(
    handleTransform(e),
    handleVar(e),
    handleCalc(e),
    handleGradient(e),
    handleCubicBezier(e),
    handleFunc(e).map(([t, n]) => new FunctionValue(t, n))
  ),
  JSON: (r) => P$2.seq(r.lcurly, P$2.regexp(/[^{}]+/), r.rcurly).map((x) => {
    const s = x.join(`
`);
    let obj = eval("(" + s + ")");
    return new ValueUnit(obj, "json");
  }),
  Value: (e) => P$2.alt(CSSValueUnit.Value, e.Function, e.JSON, e.String).trim(e.ws),
  Values: (e) => e.Value.sepBy(e.ws).map((t) => new ValueArray(t)),
  Variables: (e) => P$2.seq(
    identifier.skip(e.colon).trim(e.ws).map((t) => hyphenToCamelCase(t)),
    e.Values.skip(e.semi).trim(e.ws)
  ).map(([t, n]) => {
    const i = n.values[0];
    return i.unit === "json" ? transformObject({
      [t]: i.value
    }) : {
      [t]: n
    };
  }),
  Percent: (e) => P$2.alt(
    integer.skip(P$2.string("%").or(P$2.string(""))),
    P$2.string("from").map(() => "0"),
    P$2.string("to").map(() => "100")
  ).trim(e.ws).map(Number),
  Percents: (e) => e.Percent.sepBy(e.comma).trim(e.ws),
  Body: (e) => e.Variables.many().trim(e.ws).wrap(e.lcurly, e.rcurly).map((t) => Object.assign({}, ...t)),
  Keyframe: (e) => P$2.seq(e.Percents, e.Body).map(([t, n]) => {
    const i = {};
    for (const u of t)
      i[u] = n;
    return i;
  }),
  Keyframes: (e) => e.Rule.then(
    e.Keyframe.atLeast(1).trim(e.ws).wrap(e.lcurly, e.rcurly).trim(e.ws)
  ).map((t) => Object.assign({}, ...t))
}), CSSClass = P$2.createLanguage({
  ws: () => P$2.optWhitespace,
  semi: () => P$2.string(";"),
  colon: () => P$2.string(":"),
  lcurly: () => P$2.string("{"),
  rcurly: () => P$2.string("}"),
  lparen: () => P$2.string("("),
  rparen: () => P$2.string(")"),
  comma: () => P$2.string(","),
  dot: () => P$2.string("."),
  Rule: (e) => e.dot.trim(e.ws).then(identifier).trim(e.ws),
  Class: (e) => e.Rule.then(
    CSSKeyframes.Body.map((t) => {
      const n = {};
      for (let [i, u] of Object.entries(t))
        if (i.includes("animation")) {
          let o = i.replace(/^animation/i, "").replace(/^\w/, (l) => l.toLowerCase());
          n[o] = u.toString(), delete t[i];
        }
      return {
        options: n,
        values: t
      };
    })
  )
});
P$2.createLanguage({
  ws: () => P$2.optWhitespace,
  Value: (e) => P$2.alt(
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
const reverseCSSTime = (e) => e >= 5e3 ? `${e / 1e3}s` : `${e}ms`;
var Eu = Object.create, $e$1 = Object.defineProperty, Cu = Object.getOwnPropertyDescriptor, hu = Object.getOwnPropertyNames, gu$1 = Object.getPrototypeOf, yu$1 = Object.prototype.hasOwnProperty, or = (e) => {
  throw TypeError(e);
}, Au$1 = (e, t) => () => (e && (t = e(e = 0)), t), ye = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), We$1 = (e, t) => {
  for (var n in t) $e$1(e, n, { get: t[n], enumerable: !0 });
}, ir = (e, t, n, i) => {
  if (t && typeof t == "object" || typeof t == "function") for (let u of hu(t)) !yu$1.call(e, u) && u !== n && $e$1(e, u, { get: () => t[u], enumerable: !(i = Cu(t, u)) || i.enumerable });
  return e;
}, Ae$1 = (e, t, n) => (n = e != null ? Eu(gu$1(e)) : {}, ir($e$1(n, "default", { value: e, enumerable: !0 }), e)), Bu = (e) => ir($e$1({}, "__esModule", { value: !0 }), e), _u = (e, t, n) => t.has(e) || or("Cannot " + n), sr = (e, t, n) => t.has(e) ? or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), fe = (e, t, n) => (_u(e, t, "access private method"), n), ar = ye((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.default = t;
  function t() {
  }
  t.prototype = { diff: function(i, u) {
    var o, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, f = l.callback;
    typeof l == "function" && (f = l, l = {}), this.options = l;
    var d = this;
    function p(gt) {
      return f ? (setTimeout(function() {
        f(void 0, gt);
      }, 0), !0) : gt;
    }
    i = this.castInput(i), u = this.castInput(u), i = this.removeEmpty(this.tokenize(i)), u = this.removeEmpty(this.tokenize(u));
    var c = u.length, a = i.length, m = 1, g = c + a;
    l.maxEditLength && (g = Math.min(g, l.maxEditLength));
    var v = (o = l.timeout) !== null && o !== void 0 ? o : 1 / 0, h = Date.now() + v, F = [{ oldPos: -1, lastComponent: void 0 }], C = this.extractCommon(F[0], u, i, 0);
    if (F[0].oldPos + 1 >= a && C + 1 >= c) return p([{ value: this.join(u), count: u.length }]);
    var _ = -1 / 0, H = 1 / 0;
    function Dr() {
      for (var gt = Math.max(_, -m); gt <= Math.min(H, m); gt += 2) {
        var yt = void 0, ns = F[gt - 1], us = F[gt + 1];
        ns && (F[gt - 1] = void 0);
        var ms = !1;
        if (us) {
          var ks = us.oldPos - gt;
          ms = us && 0 <= ks && ks < c;
        }
        var Cs = ns && ns.oldPos + 1 < a;
        if (!ms && !Cs) {
          F[gt] = void 0;
          continue;
        }
        if (!Cs || ms && ns.oldPos + 1 < us.oldPos ? yt = d.addToPath(us, !0, void 0, 0) : yt = d.addToPath(ns, void 0, !0, 1), C = d.extractCommon(yt, u, i, gt), yt.oldPos + 1 >= a && C + 1 >= c) return p(n(d, yt.lastComponent, u, i, d.useLongestToken));
        F[gt] = yt, yt.oldPos + 1 >= a && (H = Math.min(H, gt - 1)), C + 1 >= c && (_ = Math.max(_, gt + 1));
      }
      m++;
    }
    if (f) (function gt() {
      setTimeout(function() {
        if (m > g || Date.now() > h) return f();
        Dr() || gt();
      }, 0);
    })();
    else for (; m <= g && Date.now() <= h; ) {
      var ge = Dr();
      if (ge) return ge;
    }
  }, addToPath: function(i, u, o, l) {
    var f = i.lastComponent;
    return f && f.added === u && f.removed === o ? { oldPos: i.oldPos + l, lastComponent: { count: f.count + 1, added: u, removed: o, previousComponent: f.previousComponent } } : { oldPos: i.oldPos + l, lastComponent: { count: 1, added: u, removed: o, previousComponent: f } };
  }, extractCommon: function(i, u, o, l) {
    for (var f = u.length, d = o.length, p = i.oldPos, c = p - l, a = 0; c + 1 < f && p + 1 < d && this.equals(u[c + 1], o[p + 1]); ) c++, p++, a++;
    return a && (i.lastComponent = { count: a, previousComponent: i.lastComponent }), i.oldPos = p, c;
  }, equals: function(i, u) {
    return this.options.comparator ? this.options.comparator(i, u) : i === u || this.options.ignoreCase && i.toLowerCase() === u.toLowerCase();
  }, removeEmpty: function(i) {
    for (var u = [], o = 0; o < i.length; o++) i[o] && u.push(i[o]);
    return u;
  }, castInput: function(i) {
    return i;
  }, tokenize: function(i) {
    return i.split("");
  }, join: function(i) {
    return i.join("");
  } };
  function n(i, u, o, l, f) {
    for (var d = [], p; u; ) d.push(u), p = u.previousComponent, delete u.previousComponent, u = p;
    d.reverse();
    for (var c = 0, a = d.length, m = 0, g = 0; c < a; c++) {
      var v = d[c];
      if (v.removed) {
        if (v.value = i.join(l.slice(g, g + v.count)), g += v.count, c && d[c - 1].added) {
          var h = d[c - 1];
          d[c - 1] = d[c], d[c] = h;
        }
      } else {
        if (!v.added && f) {
          var F = o.slice(m, m + v.count);
          F = F.map(function(_, H) {
            var Dr = l[g + H];
            return Dr.length > _.length ? Dr : _;
          }), v.value = i.join(F);
        } else v.value = i.join(o.slice(m, m + v.count));
        m += v.count, v.added || (g += v.count);
      }
    }
    var C = d[a - 1];
    return a > 1 && typeof C.value == "string" && (C.added || C.removed) && i.equals("", C.value) && (d[a - 2].value += C.value, d.pop()), d;
  }
}), cr = ye((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.diffArrays = u, e.arrayDiff = void 0;
  var t = n(ar());
  function n(o) {
    return o && o.__esModule ? o : { default: o };
  }
  var i = new t.default();
  e.arrayDiff = i, i.tokenize = function(o) {
    return o.slice();
  }, i.join = i.removeEmpty = function(o) {
    return o;
  };
  function u(o, l, f) {
    return i.diff(o, l, f);
  }
}), ot = ye((e, t) => {
  var n = new Proxy(String, { get: () => n });
  t.exports = n;
}), wn$1 = {};
We$1(wn$1, { default: () => Ao, shouldHighlight: () => yo$1 });
var yo$1, Ao, On = Au$1(() => {
  yo$1 = () => !1, Ao = String;
}), Tn = ye((e, t) => {
  var n = String, i = function() {
    return { isColorSupported: !1, reset: n, bold: n, dim: n, italic: n, underline: n, inverse: n, hidden: n, strikethrough: n, black: n, red: n, green: n, yellow: n, blue: n, magenta: n, cyan: n, white: n, gray: n, bgBlack: n, bgRed: n, bgGreen: n, bgYellow: n, bgBlue: n, bgMagenta: n, bgCyan: n, bgWhite: n };
  };
  t.exports = i(), t.exports.createColors = i;
}), jn$1 = ye((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.codeFrameColumns = g, e.default = v;
  var t = (On(), Bu(wn$1)), n = u(Tn(), !0);
  function i(h) {
    if (typeof WeakMap != "function") return null;
    var F = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap();
    return (i = function(_) {
      return _ ? C : F;
    })(h);
  }
  function u(h, F) {
    if (h === null || typeof h != "object" && typeof h != "function") return { default: h };
    var C = i(F);
    if (C && C.has(h)) return C.get(h);
    var _ = { __proto__: null }, H = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var Dr in h) if (Dr !== "default" && {}.hasOwnProperty.call(h, Dr)) {
      var ge = H ? Object.getOwnPropertyDescriptor(h, Dr) : null;
      ge && (ge.get || ge.set) ? Object.defineProperty(_, Dr, ge) : _[Dr] = h[Dr];
    }
    return _.default = h, C && C.set(h, _), _;
  }
  var o = n.default, l = (h, F) => (C) => h(F(C)), f;
  function d(h) {
    return h ? (f != null || (f = (0, n.createColors)(!0)), f) : o;
  }
  var p = !1;
  function c(h) {
    return { gutter: h.gray, marker: l(h.red, h.bold), message: l(h.red, h.bold) };
  }
  var a = /\r\n|[\n\r\u2028\u2029]/;
  function m(h, F, C) {
    let _ = Object.assign({ column: 0, line: -1 }, h.start), H = Object.assign({}, _, h.end), { linesAbove: Dr = 2, linesBelow: ge = 3 } = C || {}, gt = _.line, yt = _.column, ns = H.line, us = H.column, ms = Math.max(gt - (Dr + 1), 0), ks = Math.min(F.length, ns + ge);
    gt === -1 && (ms = 0), ns === -1 && (ks = F.length);
    let Cs = ns - gt, $s = {};
    if (Cs) for (let Fs = 0; Fs <= Cs; Fs++) {
      let ws = Fs + gt;
      if (!yt) $s[ws] = !0;
      else if (Fs === 0) {
        let vs = F[ws - 1].length;
        $s[ws] = [yt, vs - yt + 1];
      } else if (Fs === Cs) $s[ws] = [0, us];
      else {
        let vs = F[ws - Fs].length;
        $s[ws] = [0, vs];
      }
    }
    else yt === us ? yt ? $s[gt] = [yt, 0] : $s[gt] = !0 : $s[gt] = [yt, us - yt];
    return { start: ms, end: ks, markerLines: $s };
  }
  function g(h, F, C = {}) {
    let _ = (C.highlightCode || C.forceColor) && (0, t.shouldHighlight)(C), H = d(C.forceColor), Dr = c(H), ge = ($s, Fs) => _ ? $s(Fs) : Fs, gt = h.split(a), { start: yt, end: ns, markerLines: us } = m(F, gt, C), ms = F.start && typeof F.start.column == "number", ks = String(ns).length, Cs = (_ ? (0, t.default)(h, C) : h).split(a, ns).slice(yt, ns).map(($s, Fs) => {
      let ws = yt + 1 + Fs, vs = ` ${` ${ws}`.slice(-ks)} |`, Is = us[ws], Ci = !us[ws + 1];
      if (Is) {
        let Vs = "";
        if (Array.isArray(Is)) {
          let xi = $s.slice(0, Math.max(Is[0] - 1, 0)).replace(/[^\t]/g, " "), Fi = Is[1] || 1;
          Vs = [`
 `, ge(Dr.gutter, vs.replace(/\d/g, " ")), " ", xi, ge(Dr.marker, "^").repeat(Fi)].join(""), Ci && C.message && (Vs += " " + ge(Dr.message, C.message));
        }
        return [ge(Dr.marker, ">"), ge(Dr.gutter, vs), $s.length > 0 ? ` ${$s}` : "", Vs].join("");
      } else return ` ${ge(Dr.gutter, vs)}${$s.length > 0 ? ` ${$s}` : ""}`;
    }).join(`
`);
    return C.message && !ms && (Cs = `${" ".repeat(ks + 1)}${C.message}
${Cs}`), _ ? H.reset(Cs) : Cs;
  }
  function v(h, F, C, _ = {}) {
    if (!p) {
      p = !0;
      let H = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";
      {
        let Dr = new Error(H);
        Dr.name = "DeprecationWarning", console.warn(new Error(H));
      }
    }
    return C = Math.max(C, 0), g(h, { start: { column: C, line: F } }, _);
  }
}), ur$1 = {};
We$1(ur$1, { __debug: () => ai$1, check: () => si$1, doc: () => tr$1, format: () => mu, formatWithCursor: () => du$1, getSupportInfo: () => Di, util: () => nr, version: () => Du });
var bu = (e, t, n, i) => {
  if (!(e && t == null)) return t.replaceAll ? t.replaceAll(n, i) : n.global ? t.replace(n, i) : t.split(n).join(i);
}, re$1 = bu, Qn$1 = Ae$1(cr());
function lr(e) {
  let t = e.indexOf("\r");
  return t >= 0 ? e.charAt(t + 1) === `
` ? "crlf" : "cr" : "lf";
}
function be$1(e) {
  switch (e) {
    case "cr":
      return "\r";
    case "crlf":
      return `\r
`;
    default:
      return `
`;
  }
}
function At$1(e, t) {
  let n;
  switch (t) {
    case `
`:
      n = /\n/g;
      break;
    case "\r":
      n = /\r/g;
      break;
    case `\r
`:
      n = /\r\n/g;
      break;
    default:
      throw new Error(`Unexpected "eol" ${JSON.stringify(t)}.`);
  }
  let i = e.match(n);
  return i ? i.length : 0;
}
function fr(e) {
  return re$1(!1, e, /\r\n?/g, `
`);
}
var G$1 = "string", V$1 = "array", z$1 = "cursor", P$1 = "indent", L$1 = "align", I = "trim", b = "group", N$1 = "fill", x = "if-break", R = "indent-if-break", Y = "line-suffix", j = "line-suffix-boundary", B = "line", T = "label", w = "break-parent", Ue$1 = /* @__PURE__ */ new Set([z$1, P$1, L$1, I, b, N$1, x, R, Y, j, B, T, w]);
function Nu(e) {
  if (typeof e == "string") return G$1;
  if (Array.isArray(e)) return V$1;
  if (!e) return;
  let { type: t } = e;
  if (Ue$1.has(t)) return t;
}
var K$1 = Nu, Tu = (e) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e);
function Su$1(e) {
  let t = e === null ? "null" : typeof e;
  if (t !== "string" && t !== "object") return `Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;
  if (K$1(e)) throw new Error("doc is valid.");
  let n = Object.prototype.toString.call(e);
  if (n !== "[object Object]") return `Unexpected doc '${n}'.`;
  let i = Tu([...Ue$1].map((u) => `'${u}'`));
  return `Unexpected doc.type '${e.type}'.
Expected it to be ${i}.`;
}
var Bt$1 = class extends Error {
  constructor(n) {
    super(Su$1(n));
    Ts(this, "name", "InvalidDocError");
    this.doc = n;
  }
}, Z$1 = Bt$1, Fr$1 = {};
function vu(e, t, n, i) {
  let u = [e];
  for (; u.length > 0; ) {
    let o = u.pop();
    if (o === Fr$1) {
      n(u.pop());
      continue;
    }
    n && u.push(o, Fr$1);
    let l = K$1(o);
    if (!l) throw new Z$1(o);
    if ((t == null ? void 0 : t(o)) !== !1) switch (l) {
      case V$1:
      case N$1: {
        let f = l === V$1 ? o : o.parts;
        for (let d = f.length, p = d - 1; p >= 0; --p) u.push(f[p]);
        break;
      }
      case x:
        u.push(o.flatContents, o.breakContents);
        break;
      case b:
        if (i && o.expandedStates) for (let f = o.expandedStates.length, d = f - 1; d >= 0; --d) u.push(o.expandedStates[d]);
        else u.push(o.contents);
        break;
      case L$1:
      case P$1:
      case R:
      case T:
      case Y:
        u.push(o.contents);
        break;
      case G$1:
      case z$1:
      case I:
      case j:
      case B:
      case w:
        break;
      default:
        throw new Z$1(o);
    }
  }
}
var xe$1 = vu, pr = () => {
}, Ge$1 = pr;
function De$1(e) {
  return { type: P$1, contents: e };
}
function se$1(e, t) {
  return { type: L$1, contents: t, n: e };
}
function _t(e, t = {}) {
  return Ge$1(t.expandedStates), { type: b, id: t.id, contents: e, break: !!t.shouldBreak, expandedStates: t.expandedStates };
}
function dr(e) {
  return se$1(Number.NEGATIVE_INFINITY, e);
}
function mr(e) {
  return se$1({ type: "root" }, e);
}
function Er(e) {
  return se$1(-1, e);
}
function Cr(e, t) {
  return _t(e[0], { ...t, expandedStates: e });
}
function ze$1(e) {
  return { type: N$1, parts: e };
}
function hr(e, t = "", n = {}) {
  return { type: x, breakContents: e, flatContents: t, groupId: n.groupId };
}
function gr(e, t) {
  return { type: R, contents: e, groupId: t.groupId, negate: t.negate };
}
function ke$1(e) {
  return { type: Y, contents: e };
}
var yr = { type: j }, Fe$1 = { type: w }, Ar = { type: I }, we$1 = { type: B, hard: !0 }, bt = { type: B, hard: !0, literal: !0 }, Ke$1 = { type: B }, Br = { type: B, soft: !0 }, q$1 = [we$1, Fe$1], He$1 = [bt, Fe$1], Oe$1 = { type: z$1 };
function Ne(e, t) {
  let n = [];
  for (let i = 0; i < t.length; i++) i !== 0 && n.push(e), n.push(t[i]);
  return n;
}
function qe$1(e, t, n) {
  let i = e;
  if (t > 0) {
    for (let u = 0; u < Math.floor(t / n); ++u) i = De$1(i);
    i = se$1(t % n, i), i = se$1(Number.NEGATIVE_INFINITY, i);
  }
  return i;
}
function _r(e, t) {
  return e ? { type: T, label: e, contents: t } : t;
}
function Q$1(e) {
  var t;
  if (!e) return "";
  if (Array.isArray(e)) {
    let n = [];
    for (let i of e) if (Array.isArray(i)) n.push(...Q$1(i));
    else {
      let u = Q$1(i);
      u !== "" && n.push(u);
    }
    return n;
  }
  return e.type === x ? { ...e, breakContents: Q$1(e.breakContents), flatContents: Q$1(e.flatContents) } : e.type === b ? { ...e, contents: Q$1(e.contents), expandedStates: (t = e.expandedStates) == null ? void 0 : t.map(Q$1) } : e.type === N$1 ? { type: "fill", parts: e.parts.map(Q$1) } : e.contents ? { ...e, contents: Q$1(e.contents) } : e;
}
function br(e) {
  let t = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ new Set();
  return i(Q$1(e));
  function i(o, l, f) {
    var d, p;
    if (typeof o == "string") return JSON.stringify(o);
    if (Array.isArray(o)) {
      let c = o.map(i).filter(Boolean);
      return c.length === 1 ? c[0] : `[${c.join(", ")}]`;
    }
    if (o.type === B) {
      let c = ((d = f == null ? void 0 : f[l + 1]) == null ? void 0 : d.type) === w;
      return o.literal ? c ? "literalline" : "literallineWithoutBreakParent" : o.hard ? c ? "hardline" : "hardlineWithoutBreakParent" : o.soft ? "softline" : "line";
    }
    if (o.type === w) return ((p = f == null ? void 0 : f[l - 1]) == null ? void 0 : p.type) === B && f[l - 1].hard ? void 0 : "breakParent";
    if (o.type === I) return "trim";
    if (o.type === P$1) return "indent(" + i(o.contents) + ")";
    if (o.type === L$1) return o.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + i(o.contents) + ")" : o.n < 0 ? "dedent(" + i(o.contents) + ")" : o.n.type === "root" ? "markAsRoot(" + i(o.contents) + ")" : "align(" + JSON.stringify(o.n) + ", " + i(o.contents) + ")";
    if (o.type === x) return "ifBreak(" + i(o.breakContents) + (o.flatContents ? ", " + i(o.flatContents) : "") + (o.groupId ? (o.flatContents ? "" : ', ""') + `, { groupId: ${u(o.groupId)} }` : "") + ")";
    if (o.type === R) {
      let c = [];
      o.negate && c.push("negate: true"), o.groupId && c.push(`groupId: ${u(o.groupId)}`);
      let a = c.length > 0 ? `, { ${c.join(", ")} }` : "";
      return `indentIfBreak(${i(o.contents)}${a})`;
    }
    if (o.type === b) {
      let c = [];
      o.break && o.break !== "propagated" && c.push("shouldBreak: true"), o.id && c.push(`id: ${u(o.id)}`);
      let a = c.length > 0 ? `, { ${c.join(", ")} }` : "";
      return o.expandedStates ? `conditionalGroup([${o.expandedStates.map((m) => i(m)).join(",")}]${a})` : `group(${i(o.contents)}${a})`;
    }
    if (o.type === N$1) return `fill([${o.parts.map((c) => i(c)).join(", ")}])`;
    if (o.type === Y) return "lineSuffix(" + i(o.contents) + ")";
    if (o.type === j) return "lineSuffixBoundary";
    if (o.type === T) return `label(${JSON.stringify(o.label)}, ${i(o.contents)})`;
    throw new Error("Unknown doc type " + o.type);
  }
  function u(o) {
    if (typeof o != "symbol") return JSON.stringify(String(o));
    if (o in t) return t[o];
    let l = o.description || "symbol";
    for (let f = 0; ; f++) {
      let d = l + (f > 0 ? ` #${f}` : "");
      if (!n.has(d)) return n.add(d), t[o] = `Symbol.for(${JSON.stringify(d)})`;
    }
  }
}
var Pu$1 = (e, t, n) => {
  if (!(e && t == null)) return Array.isArray(t) || typeof t == "string" ? t[n < 0 ? t.length + n : n] : t.at(n);
}, y$1 = Pu$1, xr = () => /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
function kr(e) {
  return e === 12288 || e >= 65281 && e <= 65376 || e >= 65504 && e <= 65510;
}
function wr(e) {
  return e >= 4352 && e <= 4447 || e === 8986 || e === 8987 || e === 9001 || e === 9002 || e >= 9193 && e <= 9196 || e === 9200 || e === 9203 || e === 9725 || e === 9726 || e === 9748 || e === 9749 || e >= 9800 && e <= 9811 || e === 9855 || e === 9875 || e === 9889 || e === 9898 || e === 9899 || e === 9917 || e === 9918 || e === 9924 || e === 9925 || e === 9934 || e === 9940 || e === 9962 || e === 9970 || e === 9971 || e === 9973 || e === 9978 || e === 9981 || e === 9989 || e === 9994 || e === 9995 || e === 10024 || e === 10060 || e === 10062 || e >= 10067 && e <= 10069 || e === 10071 || e >= 10133 && e <= 10135 || e === 10160 || e === 10175 || e === 11035 || e === 11036 || e === 11088 || e === 11093 || e >= 11904 && e <= 11929 || e >= 11931 && e <= 12019 || e >= 12032 && e <= 12245 || e >= 12272 && e <= 12287 || e >= 12289 && e <= 12350 || e >= 12353 && e <= 12438 || e >= 12441 && e <= 12543 || e >= 12549 && e <= 12591 || e >= 12593 && e <= 12686 || e >= 12688 && e <= 12771 || e >= 12783 && e <= 12830 || e >= 12832 && e <= 12871 || e >= 12880 && e <= 19903 || e >= 19968 && e <= 42124 || e >= 42128 && e <= 42182 || e >= 43360 && e <= 43388 || e >= 44032 && e <= 55203 || e >= 63744 && e <= 64255 || e >= 65040 && e <= 65049 || e >= 65072 && e <= 65106 || e >= 65108 && e <= 65126 || e >= 65128 && e <= 65131 || e >= 94176 && e <= 94180 || e === 94192 || e === 94193 || e >= 94208 && e <= 100343 || e >= 100352 && e <= 101589 || e >= 101632 && e <= 101640 || e >= 110576 && e <= 110579 || e >= 110581 && e <= 110587 || e === 110589 || e === 110590 || e >= 110592 && e <= 110882 || e === 110898 || e >= 110928 && e <= 110930 || e === 110933 || e >= 110948 && e <= 110951 || e >= 110960 && e <= 111355 || e === 126980 || e === 127183 || e === 127374 || e >= 127377 && e <= 127386 || e >= 127488 && e <= 127490 || e >= 127504 && e <= 127547 || e >= 127552 && e <= 127560 || e === 127568 || e === 127569 || e >= 127584 && e <= 127589 || e >= 127744 && e <= 127776 || e >= 127789 && e <= 127797 || e >= 127799 && e <= 127868 || e >= 127870 && e <= 127891 || e >= 127904 && e <= 127946 || e >= 127951 && e <= 127955 || e >= 127968 && e <= 127984 || e === 127988 || e >= 127992 && e <= 128062 || e === 128064 || e >= 128066 && e <= 128252 || e >= 128255 && e <= 128317 || e >= 128331 && e <= 128334 || e >= 128336 && e <= 128359 || e === 128378 || e === 128405 || e === 128406 || e === 128420 || e >= 128507 && e <= 128591 || e >= 128640 && e <= 128709 || e === 128716 || e >= 128720 && e <= 128722 || e >= 128725 && e <= 128727 || e >= 128732 && e <= 128735 || e === 128747 || e === 128748 || e >= 128756 && e <= 128764 || e >= 128992 && e <= 129003 || e === 129008 || e >= 129292 && e <= 129338 || e >= 129340 && e <= 129349 || e >= 129351 && e <= 129535 || e >= 129648 && e <= 129660 || e >= 129664 && e <= 129672 || e >= 129680 && e <= 129725 || e >= 129727 && e <= 129733 || e >= 129742 && e <= 129755 || e >= 129760 && e <= 129768 || e >= 129776 && e <= 129784 || e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141;
}
var Or = (e) => !(kr(e) || wr(e)), Lu$1 = /[^\x20-\x7F]/;
function Iu$1(e) {
  if (!e) return 0;
  if (!Lu$1.test(e)) return e.length;
  e = e.replace(xr(), "  ");
  let t = 0;
  for (let n of e) {
    let i = n.codePointAt(0);
    i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879 || (t += Or(i) ? 1 : 2);
  }
  return t;
}
var Te$1 = Iu$1;
function ve$1(e, t) {
  if (typeof e == "string") return t(e);
  let n = /* @__PURE__ */ new Map();
  return i(e);
  function i(o) {
    if (n.has(o)) return n.get(o);
    let l = u(o);
    return n.set(o, l), l;
  }
  function u(o) {
    switch (K$1(o)) {
      case V$1:
        return t(o.map(i));
      case N$1:
        return t({ ...o, parts: o.parts.map(i) });
      case x:
        return t({ ...o, breakContents: i(o.breakContents), flatContents: i(o.flatContents) });
      case b: {
        let { expandedStates: l, contents: f } = o;
        return l ? (l = l.map(i), f = l[0]) : f = i(f), t({ ...o, contents: f, expandedStates: l });
      }
      case L$1:
      case P$1:
      case R:
      case T:
      case Y:
        return t({ ...o, contents: i(o.contents) });
      case G$1:
      case z$1:
      case I:
      case j:
      case B:
      case w:
        return t(o);
      default:
        throw new Z$1(o);
    }
  }
}
function Je$1(e, t, n) {
  let i = n, u = !1;
  function o(l) {
    if (u) return !1;
    let f = t(l);
    f !== void 0 && (u = !0, i = f);
  }
  return xe$1(e, o), i;
}
function Ru(e) {
  if (e.type === b && e.break || e.type === B && e.hard || e.type === w) return !0;
}
function Sr(e) {
  return Je$1(e, Ru, !1);
}
function Nr(e) {
  if (e.length > 0) {
    let t = y$1(!1, e, -1);
    !t.expandedStates && !t.break && (t.break = "propagated");
  }
  return null;
}
function vr(e) {
  let t = /* @__PURE__ */ new Set(), n = [];
  function i(o) {
    if (o.type === w && Nr(n), o.type === b) {
      if (n.push(o), t.has(o)) return !1;
      t.add(o);
    }
  }
  function u(o) {
    o.type === b && n.pop().break && Nr(n);
  }
  xe$1(e, i, u, !0);
}
function Yu(e) {
  return e.type === B && !e.hard ? e.soft ? "" : " " : e.type === x ? e.flatContents : e;
}
function Pr(e) {
  return ve$1(e, Yu);
}
function Tr(e) {
  for (e = [...e]; e.length >= 2 && y$1(!1, e, -2).type === B && y$1(!1, e, -1).type === w; ) e.length -= 2;
  if (e.length > 0) {
    let t = Se$1(y$1(!1, e, -1));
    e[e.length - 1] = t;
  }
  return e;
}
function Se$1(e) {
  switch (K$1(e)) {
    case P$1:
    case R:
    case b:
    case Y:
    case T: {
      let t = Se$1(e.contents);
      return { ...e, contents: t };
    }
    case x:
      return { ...e, breakContents: Se$1(e.breakContents), flatContents: Se$1(e.flatContents) };
    case N$1:
      return { ...e, parts: Tr(e.parts) };
    case V$1:
      return Tr(e);
    case G$1:
      return e.replace(/[\n\r]*$/, "");
    case L$1:
    case z$1:
    case I:
    case j:
    case B:
    case w:
      break;
    default:
      throw new Z$1(e);
  }
  return e;
}
function Xe$1(e) {
  return Se$1(Mu$1(e));
}
function ju$1(e) {
  switch (K$1(e)) {
    case N$1:
      if (e.parts.every((t) => t === "")) return "";
      break;
    case b:
      if (!e.contents && !e.id && !e.break && !e.expandedStates) return "";
      if (e.contents.type === b && e.contents.id === e.id && e.contents.break === e.break && e.contents.expandedStates === e.expandedStates) return e.contents;
      break;
    case L$1:
    case P$1:
    case R:
    case Y:
      if (!e.contents) return "";
      break;
    case x:
      if (!e.flatContents && !e.breakContents) return "";
      break;
    case V$1: {
      let t = [];
      for (let n of e) {
        if (!n) continue;
        let [i, ...u] = Array.isArray(n) ? n : [n];
        typeof i == "string" && typeof y$1(!1, t, -1) == "string" ? t[t.length - 1] += i : t.push(i), t.push(...u);
      }
      return t.length === 0 ? "" : t.length === 1 ? t[0] : t;
    }
    case G$1:
    case z$1:
    case I:
    case j:
    case B:
    case T:
    case w:
      break;
    default:
      throw new Z$1(e);
  }
  return e;
}
function Mu$1(e) {
  return ve$1(e, (t) => ju$1(t));
}
function Lr(e, t = He$1) {
  return ve$1(e, (n) => typeof n == "string" ? Ne(t, n.split(`
`)) : n);
}
function Vu(e) {
  if (e.type === B) return !0;
}
function Ir(e) {
  return Je$1(e, Vu, !1);
}
function Ze$1(e, t) {
  return e.type === T ? { ...e, contents: t(e.contents) } : t(e);
}
var M$1 = Symbol("MODE_BREAK"), J$1 = Symbol("MODE_FLAT"), Pe$1 = Symbol("cursor");
function Rr() {
  return { value: "", length: 0, queue: [] };
}
function $u(e, t) {
  return xt(e, { type: "indent" }, t);
}
function Wu$1(e, t, n) {
  return t === Number.NEGATIVE_INFINITY ? e.root || Rr() : t < 0 ? xt(e, { type: "dedent" }, n) : t ? t.type === "root" ? { ...e, root: e } : xt(e, { type: typeof t == "string" ? "stringAlign" : "numberAlign", n: t }, n) : e;
}
function xt(e, t, n) {
  let i = t.type === "dedent" ? e.queue.slice(0, -1) : [...e.queue, t], u = "", o = 0, l = 0, f = 0;
  for (let v of i) switch (v.type) {
    case "indent":
      c(), n.useTabs ? d(1) : p(n.tabWidth);
      break;
    case "stringAlign":
      c(), u += v.n, o += v.n.length;
      break;
    case "numberAlign":
      l += 1, f += v.n;
      break;
    default:
      throw new Error(`Unexpected type '${v.type}'`);
  }
  return m(), { ...e, value: u, length: o, queue: i };
  function d(v) {
    u += "	".repeat(v), o += n.tabWidth * v;
  }
  function p(v) {
    u += " ".repeat(v), o += v;
  }
  function c() {
    n.useTabs ? a() : m();
  }
  function a() {
    l > 0 && d(l), g();
  }
  function m() {
    f > 0 && p(f), g();
  }
  function g() {
    l = 0, f = 0;
  }
}
function kt$1(e) {
  let t = 0, n = 0, i = e.length;
  e: for (; i--; ) {
    let u = e[i];
    if (u === Pe$1) {
      n++;
      continue;
    }
    for (let o = u.length - 1; o >= 0; o--) {
      let l = u[o];
      if (l === " " || l === "	") t++;
      else {
        e[i] = u.slice(0, o + 1);
        break e;
      }
    }
  }
  if (t > 0 || n > 0) for (e.length = i + 1; n-- > 0; ) e.push(Pe$1);
  return t;
}
function Qe$1(e, t, n, i, u, o) {
  if (n === Number.POSITIVE_INFINITY) return !0;
  let l = t.length, f = [e], d = [];
  for (; n >= 0; ) {
    if (f.length === 0) {
      if (l === 0) return !0;
      f.push(t[--l]);
      continue;
    }
    let { mode: p, doc: c } = f.pop(), a = K$1(c);
    switch (a) {
      case G$1:
        d.push(c), n -= Te$1(c);
        break;
      case V$1:
      case N$1: {
        let m = a === V$1 ? c : c.parts;
        for (let g = m.length - 1; g >= 0; g--) f.push({ mode: p, doc: m[g] });
        break;
      }
      case P$1:
      case L$1:
      case R:
      case T:
        f.push({ mode: p, doc: c.contents });
        break;
      case I:
        n += kt$1(d);
        break;
      case b: {
        if (o && c.break) return !1;
        let m = c.break ? M$1 : p, g = c.expandedStates && m === M$1 ? y$1(!1, c.expandedStates, -1) : c.contents;
        f.push({ mode: m, doc: g });
        break;
      }
      case x: {
        let m = (c.groupId ? u[c.groupId] || J$1 : p) === M$1 ? c.breakContents : c.flatContents;
        m && f.push({ mode: p, doc: m });
        break;
      }
      case B:
        if (p === M$1 || c.hard) return !0;
        c.soft || (d.push(" "), n--);
        break;
      case Y:
        i = !0;
        break;
      case j:
        if (i) return !1;
        break;
    }
  }
  return !1;
}
function pe$1(e, t) {
  let n = {}, i = t.printWidth, u = be$1(t.endOfLine), o = 0, l = [{ ind: Rr(), mode: M$1, doc: e }], f = [], d = !1, p = [], c = 0;
  for (vr(e); l.length > 0; ) {
    let { ind: m, mode: g, doc: v } = l.pop();
    switch (K$1(v)) {
      case G$1: {
        let h = u !== `
` ? re$1(!1, v, `
`, u) : v;
        f.push(h), l.length > 0 && (o += Te$1(h));
        break;
      }
      case V$1:
        for (let h = v.length - 1; h >= 0; h--) l.push({ ind: m, mode: g, doc: v[h] });
        break;
      case z$1:
        if (c >= 2) throw new Error("There are too many 'cursor' in doc.");
        f.push(Pe$1), c++;
        break;
      case P$1:
        l.push({ ind: $u(m, t), mode: g, doc: v.contents });
        break;
      case L$1:
        l.push({ ind: Wu$1(m, v.n, t), mode: g, doc: v.contents });
        break;
      case I:
        o -= kt$1(f);
        break;
      case b:
        switch (g) {
          case J$1:
            if (!d) {
              l.push({ ind: m, mode: v.break ? M$1 : J$1, doc: v.contents });
              break;
            }
          case M$1: {
            d = !1;
            let h = { ind: m, mode: J$1, doc: v.contents }, F = i - o, C = p.length > 0;
            if (!v.break && Qe$1(h, l, F, C, n)) l.push(h);
            else if (v.expandedStates) {
              let _ = y$1(!1, v.expandedStates, -1);
              if (v.break) {
                l.push({ ind: m, mode: M$1, doc: _ });
                break;
              } else for (let H = 1; H < v.expandedStates.length + 1; H++) if (H >= v.expandedStates.length) {
                l.push({ ind: m, mode: M$1, doc: _ });
                break;
              } else {
                let Dr = v.expandedStates[H], ge = { ind: m, mode: J$1, doc: Dr };
                if (Qe$1(ge, l, F, C, n)) {
                  l.push(ge);
                  break;
                }
              }
            } else l.push({ ind: m, mode: M$1, doc: v.contents });
            break;
          }
        }
        v.id && (n[v.id] = y$1(!1, l, -1).mode);
        break;
      case N$1: {
        let h = i - o, { parts: F } = v;
        if (F.length === 0) break;
        let [C, _] = F, H = { ind: m, mode: J$1, doc: C }, Dr = { ind: m, mode: M$1, doc: C }, ge = Qe$1(H, [], h, p.length > 0, n, !0);
        if (F.length === 1) {
          ge ? l.push(H) : l.push(Dr);
          break;
        }
        let gt = { ind: m, mode: J$1, doc: _ }, yt = { ind: m, mode: M$1, doc: _ };
        if (F.length === 2) {
          ge ? l.push(gt, H) : l.push(yt, Dr);
          break;
        }
        F.splice(0, 2);
        let ns = { ind: m, mode: g, doc: ze$1(F) }, us = F[0];
        Qe$1({ ind: m, mode: J$1, doc: [C, _, us] }, [], h, p.length > 0, n, !0) ? l.push(ns, gt, H) : ge ? l.push(ns, yt, H) : l.push(ns, yt, Dr);
        break;
      }
      case x:
      case R: {
        let h = v.groupId ? n[v.groupId] : g;
        if (h === M$1) {
          let F = v.type === x ? v.breakContents : v.negate ? v.contents : De$1(v.contents);
          F && l.push({ ind: m, mode: g, doc: F });
        }
        if (h === J$1) {
          let F = v.type === x ? v.flatContents : v.negate ? De$1(v.contents) : v.contents;
          F && l.push({ ind: m, mode: g, doc: F });
        }
        break;
      }
      case Y:
        p.push({ ind: m, mode: g, doc: v.contents });
        break;
      case j:
        p.length > 0 && l.push({ ind: m, mode: g, doc: we$1 });
        break;
      case B:
        switch (g) {
          case J$1:
            if (v.hard) d = !0;
            else {
              v.soft || (f.push(" "), o += 1);
              break;
            }
          case M$1:
            if (p.length > 0) {
              l.push({ ind: m, mode: g, doc: v }, ...p.reverse()), p.length = 0;
              break;
            }
            v.literal ? m.root ? (f.push(u, m.root.value), o = m.root.length) : (f.push(u), o = 0) : (o -= kt$1(f), f.push(u + m.value), o = m.length);
            break;
        }
        break;
      case T:
        l.push({ ind: m, mode: g, doc: v.contents });
        break;
      case w:
        break;
      default:
        throw new Z$1(v);
    }
    l.length === 0 && p.length > 0 && (l.push(...p.reverse()), p.length = 0);
  }
  let a = f.indexOf(Pe$1);
  if (a !== -1) {
    let m = f.indexOf(Pe$1, a + 1), g = f.slice(0, a).join(""), v = f.slice(a + 1, m).join(""), h = f.slice(m + 1).join("");
    return { formatted: g + v + h, cursorNodeStart: g.length, cursorNodeText: v };
  }
  return { formatted: f.join("") };
}
function Uu(e, t, n = 0) {
  let i = 0;
  for (let u = n; u < e.length; ++u) e[u] === "	" ? i = i + t - i % t : i++;
  return i;
}
var de$1 = Uu, ee$1, Ot$1, et$1, wt = class {
  constructor(e) {
    sr(this, ee$1), this.stack = [e];
  }
  get key() {
    let { stack: e, siblings: t } = this;
    return y$1(!1, e, t === null ? -2 : -4) ?? null;
  }
  get index() {
    return this.siblings === null ? null : y$1(!1, this.stack, -2);
  }
  get node() {
    return y$1(!1, this.stack, -1);
  }
  get parent() {
    return this.getNode(1);
  }
  get grandparent() {
    return this.getNode(2);
  }
  get isInArray() {
    return this.siblings !== null;
  }
  get siblings() {
    let { stack: e } = this, t = y$1(!1, e, -3);
    return Array.isArray(t) ? t : null;
  }
  get next() {
    let { siblings: e } = this;
    return e === null ? null : e[this.index + 1];
  }
  get previous() {
    let { siblings: e } = this;
    return e === null ? null : e[this.index - 1];
  }
  get isFirst() {
    return this.index === 0;
  }
  get isLast() {
    let { siblings: e, index: t } = this;
    return e !== null && t === e.length - 1;
  }
  get isRoot() {
    return this.stack.length === 1;
  }
  get root() {
    return this.stack[0];
  }
  get ancestors() {
    return [...fe(this, ee$1, et$1).call(this)];
  }
  getName() {
    let { stack: e } = this, { length: t } = e;
    return t > 1 ? y$1(!1, e, -2) : null;
  }
  getValue() {
    return y$1(!1, this.stack, -1);
  }
  getNode(e = 0) {
    let t = fe(this, ee$1, Ot$1).call(this, e);
    return t === -1 ? null : this.stack[t];
  }
  getParentNode(e = 0) {
    return this.getNode(e + 1);
  }
  call(e, ...t) {
    let { stack: n } = this, { length: i } = n, u = y$1(!1, n, -1);
    for (let o of t) u = u[o], n.push(o, u);
    try {
      return e(this);
    } finally {
      n.length = i;
    }
  }
  callParent(e, t = 0) {
    let n = fe(this, ee$1, Ot$1).call(this, t + 1), i = this.stack.splice(n + 1);
    try {
      return e(this);
    } finally {
      this.stack.push(...i);
    }
  }
  each(e, ...t) {
    let { stack: n } = this, { length: i } = n, u = y$1(!1, n, -1);
    for (let o of t) u = u[o], n.push(o, u);
    try {
      for (let o = 0; o < u.length; ++o) n.push(o, u[o]), e(this, o, u), n.length -= 2;
    } finally {
      n.length = i;
    }
  }
  map(e, ...t) {
    let n = [];
    return this.each((i, u, o) => {
      n[u] = e(i, u, o);
    }, ...t), n;
  }
  match(...e) {
    let t = this.stack.length - 1, n = null, i = this.stack[t--];
    for (let u of e) {
      if (i === void 0) return !1;
      let o = null;
      if (typeof n == "number" && (o = n, n = this.stack[t--], i = this.stack[t--]), u && !u(i, n, o)) return !1;
      n = this.stack[t--], i = this.stack[t--];
    }
    return !0;
  }
  findAncestor(e) {
    for (let t of fe(this, ee$1, et$1).call(this)) if (e(t)) return t;
  }
  hasAncestor(e) {
    for (let t of fe(this, ee$1, et$1).call(this)) if (e(t)) return !0;
    return !1;
  }
};
ee$1 = /* @__PURE__ */ new WeakSet(), Ot$1 = function(e) {
  let { stack: t } = this;
  for (let n = t.length - 1; n >= 0; n -= 2) if (!Array.isArray(t[n]) && --e < 0) return n;
  return -1;
}, et$1 = function* () {
  let { stack: e } = this;
  for (let t = e.length - 3; t >= 0; t -= 2) {
    let n = e[t];
    Array.isArray(n) || (yield n);
  }
};
var Yr$1 = wt, jr$1 = new Proxy(() => {
}, { get: () => jr$1 }), Le = jr$1;
function Gu$1(e) {
  return e !== null && typeof e == "object";
}
var Mr = Gu$1;
function* Nt$1(e, t) {
  let { getVisitorKeys: n, filter: i = () => !0 } = t, u = (o) => Mr(o) && i(o);
  for (let o of n(e)) {
    let l = e[o];
    if (Array.isArray(l)) for (let f of l) u(f) && (yield f);
    else u(l) && (yield l);
  }
}
function* Vr$1(e, t) {
  let n = [e];
  for (let i = 0; i < n.length; i++) {
    let u = n[i];
    for (let o of Nt$1(u, t)) yield o, n.push(o);
  }
}
function me(e) {
  return (t, n, i) => {
    let u = !!(i != null && i.backwards);
    if (n === !1) return !1;
    let { length: o } = t, l = n;
    for (; l >= 0 && l < o; ) {
      let f = t.charAt(l);
      if (e instanceof RegExp) {
        if (!e.test(f)) return l;
      } else if (!e.includes(f)) return l;
      u ? l-- : l++;
    }
    return l === -1 || l === o ? l : !1;
  };
}
var $r$1 = me(/\s/), S = me(" 	"), tt$1 = me(",; 	"), rt$1 = me(/[^\n\r]/);
function zu(e, t, n) {
  let i = !!(n != null && n.backwards);
  if (t === !1) return !1;
  let u = e.charAt(t);
  if (i) {
    if (e.charAt(t - 1) === "\r" && u === `
`) return t - 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t - 1;
  } else {
    if (u === "\r" && e.charAt(t + 1) === `
`) return t + 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t + 1;
  }
  return t;
}
var $ = zu;
function Ku$1(e, t, n = {}) {
  let i = S(e, n.backwards ? t - 1 : t, n), u = $(e, i, n);
  return i !== u;
}
var U$1 = Ku$1;
function Hu$1(e) {
  return Array.isArray(e) && e.length > 0;
}
var Tt$1 = Hu$1, Wr$1 = /* @__PURE__ */ new Set(["tokens", "comments", "parent", "enclosingNode", "precedingNode", "followingNode"]), qu = (e) => Object.keys(e).filter((t) => !Wr$1.has(t));
function Ju$1(e) {
  return e ? (t) => e(t, Wr$1) : qu;
}
var X = Ju$1;
function Xu$1(e) {
  let t = e.type || e.kind || "(unknown type)", n = String(e.name || e.id && (typeof e.id == "object" ? e.id.name : e.id) || e.key && (typeof e.key == "object" ? e.key.name : e.key) || e.value && (typeof e.value == "object" ? "" : String(e.value)) || e.operator || "");
  return n.length > 20 && (n = n.slice(0, 19) + "…"), t + (n ? " " + n : "");
}
function St$1(e, t) {
  (e.comments ?? (e.comments = [])).push(t), t.printed = !1, t.nodeDescription = Xu$1(e);
}
function ne(e, t) {
  t.leading = !0, t.trailing = !1, St$1(e, t);
}
function te$1(e, t, n) {
  t.leading = !1, t.trailing = !1, n && (t.marker = n), St$1(e, t);
}
function ue$1(e, t) {
  t.leading = !1, t.trailing = !0, St$1(e, t);
}
var vt = /* @__PURE__ */ new WeakMap();
function nt$1(e, t) {
  if (vt.has(e)) return vt.get(e);
  let { printer: { getCommentChildNodes: n, canAttachComment: i, getVisitorKeys: u }, locStart: o, locEnd: l } = t;
  if (!i) return [];
  let f = ((n == null ? void 0 : n(e, t)) ?? [...Nt$1(e, { getVisitorKeys: X(u) })]).flatMap((d) => i(d) ? [d] : nt$1(d, t));
  return f.sort((d, p) => o(d) - o(p) || l(d) - l(p)), vt.set(e, f), f;
}
function Gr$1(e, t, n, i) {
  let { locStart: u, locEnd: o } = n, l = u(t), f = o(t), d = nt$1(e, n), p, c, a = 0, m = d.length;
  for (; a < m; ) {
    let g = a + m >> 1, v = d[g], h = u(v), F = o(v);
    if (h <= l && f <= F) return Gr$1(v, t, n, v);
    if (F <= l) {
      p = v, a = g + 1;
      continue;
    }
    if (f <= h) {
      c = v, m = g;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if ((i == null ? void 0 : i.type) === "TemplateLiteral") {
    let { quasis: g } = i, v = Lt$1(g, t, n);
    p && Lt$1(g, p, n) !== v && (p = null), c && Lt$1(g, c, n) !== v && (c = null);
  }
  return { enclosingNode: i, precedingNode: p, followingNode: c };
}
var Pt$1 = () => !1;
function zr$1(e, t) {
  let { comments: n } = e;
  if (delete e.comments, !Tt$1(n) || !t.printer.canAttachComment) return;
  let i = [], { locStart: u, locEnd: o, printer: { experimentalFeatures: { avoidAstMutation: l = !1 } = {}, handleComments: f = {} }, originalText: d } = t, { ownLine: p = Pt$1, endOfLine: c = Pt$1, remaining: a = Pt$1 } = f, m = n.map((g, v) => ({ ...Gr$1(e, g, t), comment: g, text: d, options: t, ast: e, isLastComment: n.length - 1 === v }));
  for (let [g, v] of m.entries()) {
    let { comment: h, precedingNode: F, enclosingNode: C, followingNode: _, text: H, options: Dr, ast: ge, isLastComment: gt } = v;
    if (Dr.parser === "json" || Dr.parser === "json5" || Dr.parser === "jsonc" || Dr.parser === "__js_expression" || Dr.parser === "__ts_expression" || Dr.parser === "__vue_expression" || Dr.parser === "__vue_ts_expression") {
      if (u(h) - u(ge) <= 0) {
        ne(ge, h);
        continue;
      }
      if (o(h) - o(ge) >= 0) {
        ue$1(ge, h);
        continue;
      }
    }
    let yt;
    if (l ? yt = [v] : (h.enclosingNode = C, h.precedingNode = F, h.followingNode = _, yt = [h, H, Dr, ge, gt]), Zu$1(H, Dr, m, g)) h.placement = "ownLine", p(...yt) || (_ ? ne(_, h) : F ? ue$1(F, h) : te$1(C || ge, h));
    else if (Qu$1(H, Dr, m, g)) h.placement = "endOfLine", c(...yt) || (F ? ue$1(F, h) : _ ? ne(_, h) : te$1(C || ge, h));
    else if (h.placement = "remaining", !a(...yt)) if (F && _) {
      let ns = i.length;
      ns > 0 && i[ns - 1].followingNode !== _ && Ur(i, Dr), i.push(v);
    } else F ? ue$1(F, h) : _ ? ne(_, h) : te$1(C || ge, h);
  }
  if (Ur(i, t), !l) for (let g of n) delete g.precedingNode, delete g.enclosingNode, delete g.followingNode;
}
var Kr$1 = (e) => !/[\S\n\u2028\u2029]/.test(e);
function Zu$1(e, t, n, i) {
  let { comment: u, precedingNode: o } = n[i], { locStart: l, locEnd: f } = t, d = l(u);
  if (o) for (let p = i - 1; p >= 0; p--) {
    let { comment: c, precedingNode: a } = n[p];
    if (a !== o || !Kr$1(e.slice(f(c), d))) break;
    d = l(c);
  }
  return U$1(e, d, { backwards: !0 });
}
function Qu$1(e, t, n, i) {
  let { comment: u, followingNode: o } = n[i], { locStart: l, locEnd: f } = t, d = f(u);
  if (o) for (let p = i + 1; p < n.length; p++) {
    let { comment: c, followingNode: a } = n[p];
    if (a !== o || !Kr$1(e.slice(d, l(c)))) break;
    d = f(c);
  }
  return U$1(e, d);
}
function Ur(e, t) {
  var n, i;
  let u = e.length;
  if (u === 0) return;
  let { precedingNode: o, followingNode: l } = e[0], f = t.locStart(l), d;
  for (d = u; d > 0; --d) {
    let { comment: p, precedingNode: c, followingNode: a } = e[d - 1];
    Le.strictEqual(c, o), Le.strictEqual(a, l);
    let m = t.originalText.slice(t.locEnd(p), f);
    if (((i = (n = t.printer).isGap) == null ? void 0 : i.call(n, m, t)) ?? /^[\s(]*$/.test(m)) f = t.locStart(p);
    else break;
  }
  for (let [p, { comment: c }] of e.entries()) p < d ? ue$1(o, c) : ne(l, c);
  for (let p of [o, l]) p.comments && p.comments.length > 1 && p.comments.sort((c, a) => t.locStart(c) - t.locStart(a));
  e.length = 0;
}
function Lt$1(e, t, n) {
  let i = n.locStart(t) - 1;
  for (let u = 1; u < e.length; ++u) if (i < n.locStart(e[u])) return u - 1;
  return 0;
}
function eo(e, t) {
  let n = t - 1;
  n = S(e, n, { backwards: !0 }), n = $(e, n, { backwards: !0 }), n = S(e, n, { backwards: !0 });
  let i = $(e, n, { backwards: !0 });
  return n !== i;
}
var Ie = eo;
function Hr$1(e, t) {
  let n = e.node;
  return n.printed = !0, t.printer.printComment(e, t);
}
function to(e, t) {
  var n;
  let i = e.node, u = [Hr$1(e, t)], { printer: o, originalText: l, locStart: f, locEnd: d } = t;
  if ((n = o.isBlockComment) != null && n.call(o, i)) {
    let c = U$1(l, d(i)) ? U$1(l, f(i), { backwards: !0 }) ? q$1 : Ke$1 : " ";
    u.push(c);
  } else u.push(q$1);
  let p = $(l, S(l, d(i)));
  return p !== !1 && U$1(l, p) && u.push(q$1), u;
}
function ro(e, t, n) {
  var i;
  let u = e.node, o = Hr$1(e, t), { printer: l, originalText: f, locStart: d } = t, p = (i = l.isBlockComment) == null ? void 0 : i.call(l, u);
  if (n != null && n.hasLineSuffix && !(n != null && n.isBlock) || U$1(f, d(u), { backwards: !0 })) {
    let c = Ie(f, d(u));
    return { doc: ke$1([q$1, c ? q$1 : "", o]), isBlock: p, hasLineSuffix: !0 };
  }
  return !p || n != null && n.hasLineSuffix ? { doc: [ke$1([" ", o]), Fe$1], isBlock: p, hasLineSuffix: !0 } : { doc: [" ", o], isBlock: p, hasLineSuffix: !1 };
}
function no(e, t) {
  let n = e.node;
  if (!n) return {};
  let i = t[Symbol.for("printedComments")];
  if ((n.comments || []).filter((f) => !i.has(f)).length === 0) return { leading: "", trailing: "" };
  let u = [], o = [], l;
  return e.each(() => {
    let f = e.node;
    if (i != null && i.has(f)) return;
    let { leading: d, trailing: p } = f;
    d ? u.push(to(e, t)) : p && (l = ro(e, t, l), o.push(l.doc));
  }, "comments"), { leading: u, trailing: o };
}
function qr(e, t, n) {
  let { leading: i, trailing: u } = no(e, n);
  return !i && !u ? t : Ze$1(t, (o) => [i, o, u]);
}
function Jr$1(e) {
  let { [Symbol.for("comments")]: t, [Symbol.for("printedComments")]: n } = e;
  for (let i of t) {
    if (!i.printed && !n.has(i)) throw new Error('Comment "' + i.value.trim() + '" was not printed. Please report this error!');
    delete i.printed;
  }
}
var Re = class extends Error {
  constructor() {
    super(...arguments);
    Ts(this, "name", "ConfigError");
  }
}, Ye$1 = class extends Error {
  constructor() {
    super(...arguments);
    Ts(this, "name", "UndefinedParserError");
  }
}, Zr$1 = { cursorOffset: { category: "Special", type: "int", default: -1, range: { start: -1, end: 1 / 0, step: 1 }, description: "Print (to stderr) where a cursor at the given position would move to after formatting.", cliCategory: "Editor" }, endOfLine: { category: "Global", type: "choice", default: "lf", description: "Which end of line characters to apply.", choices: [{ value: "lf", description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos" }, { value: "crlf", description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows" }, { value: "cr", description: "Carriage Return character only (\\r), used very rarely" }, { value: "auto", description: `Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)` }] }, filepath: { category: "Special", type: "path", description: "Specify the input filepath. This will be used to do parser inference.", cliName: "stdin-filepath", cliCategory: "Other", cliDescription: "Path to the file to pretend that stdin comes from." }, insertPragma: { category: "Special", type: "boolean", default: !1, description: "Insert @format pragma into file's first docblock comment.", cliCategory: "Other" }, parser: { category: "Global", type: "choice", default: void 0, description: "Which parser to use.", exception: (e) => typeof e == "string" || typeof e == "function", choices: [{ value: "flow", description: "Flow" }, { value: "babel", description: "JavaScript" }, { value: "babel-flow", description: "Flow" }, { value: "babel-ts", description: "TypeScript" }, { value: "typescript", description: "TypeScript" }, { value: "acorn", description: "JavaScript" }, { value: "espree", description: "JavaScript" }, { value: "meriyah", description: "JavaScript" }, { value: "css", description: "CSS" }, { value: "less", description: "Less" }, { value: "scss", description: "SCSS" }, { value: "json", description: "JSON" }, { value: "json5", description: "JSON5" }, { value: "jsonc", description: "JSON with Comments" }, { value: "json-stringify", description: "JSON.stringify" }, { value: "graphql", description: "GraphQL" }, { value: "markdown", description: "Markdown" }, { value: "mdx", description: "MDX" }, { value: "vue", description: "Vue" }, { value: "yaml", description: "YAML" }, { value: "glimmer", description: "Ember / Handlebars" }, { value: "html", description: "HTML" }, { value: "angular", description: "Angular" }, { value: "lwc", description: "Lightning Web Components" }] }, plugins: { type: "path", array: !0, default: [{ value: [] }], category: "Global", description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.", exception: (e) => typeof e == "string" || typeof e == "object", cliName: "plugin", cliCategory: "Config" }, printWidth: { category: "Global", type: "int", default: 80, description: "The line length where Prettier will try wrap.", range: { start: 0, end: 1 / 0, step: 1 } }, rangeEnd: { category: "Special", type: "int", default: 1 / 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`, cliCategory: "Editor" }, rangeStart: { category: "Special", type: "int", default: 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`, cliCategory: "Editor" }, requirePragma: { category: "Special", type: "boolean", default: !1, description: `Require either '@prettier' or '@format' to be present in the file's first docblock comment
in order for it to be formatted.`, cliCategory: "Other" }, tabWidth: { type: "int", category: "Global", default: 2, description: "Number of spaces per indentation level.", range: { start: 0, end: 1 / 0, step: 1 } }, useTabs: { category: "Global", type: "boolean", default: !1, description: "Indent with tabs instead of spaces." }, embeddedLanguageFormatting: { category: "Global", type: "choice", default: "auto", description: "Control how Prettier formats quoted code embedded in the file.", choices: [{ value: "auto", description: "Format embedded code if Prettier can automatically identify it." }, { value: "off", description: "Never automatically format embedded code." }] } };
function ut({ plugins: e = [], showDeprecated: t = !1 } = {}) {
  let n = e.flatMap((u) => u.languages ?? []), i = [];
  for (let u of io$1(Object.assign({}, ...e.map(({ options: o }) => o), Zr$1))) !t && u.deprecated || (Array.isArray(u.choices) && (t || (u.choices = u.choices.filter((o) => !o.deprecated)), u.name === "parser" && (u.choices = [...u.choices, ...oo(u.choices, n, e)])), u.pluginDefaults = Object.fromEntries(e.filter((o) => {
    var l;
    return ((l = o.defaultOptions) == null ? void 0 : l[u.name]) !== void 0;
  }).map((o) => [o.name, o.defaultOptions[u.name]])), i.push(u));
  return { languages: n, options: i };
}
function* oo(e, t, n) {
  let i = new Set(e.map((u) => u.value));
  for (let u of t) if (u.parsers) {
    for (let o of u.parsers) if (!i.has(o)) {
      i.add(o);
      let l = n.find((d) => d.parsers && Object.prototype.hasOwnProperty.call(d.parsers, o)), f = u.name;
      l != null && l.name && (f += ` (plugin: ${l.name})`), yield { value: o, description: f };
    }
  }
}
function io$1(e) {
  let t = [];
  for (let [n, i] of Object.entries(e)) {
    let u = { name: n, ...i };
    Array.isArray(u.default) && (u.default = y$1(!1, u.default, -1).value), t.push(u);
  }
  return t;
}
var so = (e) => String(e).split(/[/\\]/).pop();
function Qr$1(e, t) {
  if (!t) return;
  let n = so(t).toLowerCase();
  return e.find(({ filenames: i }) => i == null ? void 0 : i.some((u) => u.toLowerCase() === n)) ?? e.find(({ extensions: i }) => i == null ? void 0 : i.some((u) => n.endsWith(u)));
}
function Do$1(e, t) {
  if (t) return e.find(({ name: n }) => n.toLowerCase() === t) ?? e.find(({ aliases: n }) => n == null ? void 0 : n.includes(t)) ?? e.find(({ extensions: n }) => n == null ? void 0 : n.includes(`.${t}`));
}
function ao$1(e, t) {
  let n = e.plugins.flatMap((u) => u.languages ?? []), i = Do$1(n, t.language) ?? Qr$1(n, t.physicalFile) ?? Qr$1(n, t.file) ?? (t.physicalFile, void 0);
  return i == null ? void 0 : i.parsers[0];
}
var en = ao$1, oe$1 = { key: (e) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e) ? e : JSON.stringify(e), value(e) {
  if (e === null || typeof e != "object") return JSON.stringify(e);
  if (Array.isArray(e)) return `[${e.map((n) => oe$1.value(n)).join(", ")}]`;
  let t = Object.keys(e);
  return t.length === 0 ? "{}" : `{ ${t.map((n) => `${oe$1.key(n)}: ${oe$1.value(e[n])}`).join(", ")} }`;
}, pair: ({ key: e, value: t }) => oe$1.value({ [e]: t }) }, It$1 = Ae$1(ot()), nn$1 = (e, t, { descriptor: n }) => {
  let i = [`${It$1.default.yellow(typeof e == "string" ? n.key(e) : n.pair(e))} is deprecated`];
  return t && i.push(`we now treat it as ${It$1.default.blue(typeof t == "string" ? n.key(t) : n.pair(t))}`), i.join("; ") + ".";
}, ae$1 = Ae$1(ot()), it = Symbol.for("vnopts.VALUE_NOT_EXIST"), Ee$1 = Symbol.for("vnopts.VALUE_UNCHANGED"), un$1 = " ".repeat(2), sn$1 = (e, t, n) => {
  let { text: i, list: u } = n.normalizeExpectedResult(n.schemas[e].expected(n)), o = [];
  return i && o.push(on$1(e, t, i, n.descriptor)), u && o.push([on$1(e, t, u.title, n.descriptor)].concat(u.values.map((l) => Dn$1(l, n.loggerPrintWidth))).join(`
`)), an$1(o, n.loggerPrintWidth);
};
function on$1(e, t, n, i) {
  return [`Invalid ${ae$1.default.red(i.key(e))} value.`, `Expected ${ae$1.default.blue(n)},`, `but received ${t === it ? ae$1.default.gray("nothing") : ae$1.default.red(i.value(t))}.`].join(" ");
}
function Dn$1({ text: e, list: t }, n) {
  let i = [];
  return e && i.push(`- ${ae$1.default.blue(e)}`), t && i.push([`- ${ae$1.default.blue(t.title)}:`].concat(t.values.map((u) => Dn$1(u, n - un$1.length).replace(/^|\n/g, `$&${un$1}`))).join(`
`)), an$1(i, n);
}
function an$1(e, t) {
  if (e.length === 1) return e[0];
  let [n, i] = e, [u, o] = e.map((l) => l.split(`
`, 1)[0].length);
  return u > t && u > o ? i : n;
}
var jt = Ae$1(ot()), Rt$1 = [], cn$1 = [];
function Yt$1(e, t) {
  if (e === t) return 0;
  let n = e;
  e.length > t.length && (e = t, t = n);
  let i = e.length, u = t.length;
  for (; i > 0 && e.charCodeAt(~-i) === t.charCodeAt(~-u); ) i--, u--;
  let o = 0;
  for (; o < i && e.charCodeAt(o) === t.charCodeAt(o); ) o++;
  if (i -= o, u -= o, i === 0) return u;
  let l, f, d, p, c = 0, a = 0;
  for (; c < i; ) cn$1[c] = e.charCodeAt(o + c), Rt$1[c] = ++c;
  for (; a < u; ) for (l = t.charCodeAt(o + a), d = a++, f = a, c = 0; c < i; c++) p = l === cn$1[c] ? d : d + 1, d = Rt$1[c], f = Rt$1[c] = d > f ? p > f ? f + 1 : p : p > d ? d + 1 : p;
  return f;
}
var st$1 = (e, t, { descriptor: n, logger: i, schemas: u }) => {
  let o = [`Ignored unknown option ${jt.default.yellow(n.pair({ key: e, value: t }))}.`], l = Object.keys(u).sort().find((f) => Yt$1(e, f) < 3);
  l && o.push(`Did you mean ${jt.default.blue(n.key(l))}?`), i.warn(o.join(" "));
}, co = ["default", "expected", "validate", "deprecated", "forward", "redirect", "overlap", "preprocess", "postprocess"];
function lo$1(e, t) {
  let n = new e(t), i = Object.create(n);
  for (let u of co) u in t && (i[u] = fo$1(t[u], n, O.prototype[u].length));
  return i;
}
var O = class {
  static create(e) {
    return lo$1(this, e);
  }
  constructor(e) {
    this.name = e.name;
  }
  default(e) {
  }
  expected(e) {
    return "nothing";
  }
  validate(e, t) {
    return !1;
  }
  deprecated(e, t) {
    return !1;
  }
  forward(e, t) {
  }
  redirect(e, t) {
  }
  overlap(e, t, n) {
    return e;
  }
  preprocess(e, t) {
    return e;
  }
  postprocess(e, t) {
    return Ee$1;
  }
};
function fo$1(e, t, n) {
  return typeof e == "function" ? (...i) => e(...i.slice(0, n - 1), t, ...i.slice(n - 1)) : () => e;
}
var Dt$1 = class extends O {
  constructor(t) {
    super(t), this._sourceName = t.sourceName;
  }
  expected(t) {
    return t.schemas[this._sourceName].expected(t);
  }
  validate(t, n) {
    return n.schemas[this._sourceName].validate(t, n);
  }
  redirect(t, n) {
    return this._sourceName;
  }
}, at$1 = class extends O {
  expected() {
    return "anything";
  }
  validate() {
    return !0;
  }
}, ct = class extends O {
  constructor({ valueSchema: e, name: t = e.name, ...n }) {
    super({ ...n, name: t }), this._valueSchema = e;
  }
  expected(e) {
    let { text: t, list: n } = e.normalizeExpectedResult(this._valueSchema.expected(e));
    return { text: t && `an array of ${t}`, list: n && { title: "an array of the following values", values: [{ list: n }] } };
  }
  validate(e, t) {
    if (!Array.isArray(e)) return !1;
    let n = [];
    for (let i of e) {
      let u = t.normalizeValidateResult(this._valueSchema.validate(i, t), i);
      u !== !0 && n.push(u.value);
    }
    return n.length === 0 ? !0 : { value: n };
  }
  deprecated(e, t) {
    let n = [];
    for (let i of e) {
      let u = t.normalizeDeprecatedResult(this._valueSchema.deprecated(i, t), i);
      u !== !1 && n.push(...u.map(({ value: o }) => ({ value: [o] })));
    }
    return n;
  }
  forward(e, t) {
    let n = [];
    for (let i of e) {
      let u = t.normalizeForwardResult(this._valueSchema.forward(i, t), i);
      n.push(...u.map(ln$1));
    }
    return n;
  }
  redirect(e, t) {
    let n = [], i = [];
    for (let u of e) {
      let o = t.normalizeRedirectResult(this._valueSchema.redirect(u, t), u);
      "remain" in o && n.push(o.remain), i.push(...o.redirect.map(ln$1));
    }
    return n.length === 0 ? { redirect: i } : { redirect: i, remain: n };
  }
  overlap(e, t) {
    return e.concat(t);
  }
};
function ln$1({ from: e, to: t }) {
  return { from: [e], to: t };
}
var lt$1 = class extends O {
  expected() {
    return "true or false";
  }
  validate(t) {
    return typeof t == "boolean";
  }
};
function Fn$1(e, t) {
  let n = /* @__PURE__ */ Object.create(null);
  for (let i of e) {
    let u = i[t];
    if (n[u]) throw new Error(`Duplicate ${t} ${JSON.stringify(u)}`);
    n[u] = i;
  }
  return n;
}
function pn$1(e, t) {
  let n = /* @__PURE__ */ new Map();
  for (let i of e) {
    let u = i[t];
    if (n.has(u)) throw new Error(`Duplicate ${t} ${JSON.stringify(u)}`);
    n.set(u, i);
  }
  return n;
}
function dn$1() {
  let e = /* @__PURE__ */ Object.create(null);
  return (t) => {
    let n = JSON.stringify(t);
    return e[n] ? !0 : (e[n] = !0, !1);
  };
}
function mn$1(e, t) {
  let n = [], i = [];
  for (let u of e) t(u) ? n.push(u) : i.push(u);
  return [n, i];
}
function En(e) {
  return e === Math.floor(e);
}
function Cn(e, t) {
  if (e === t) return 0;
  let n = typeof e, i = typeof t, u = ["undefined", "object", "boolean", "number", "string"];
  return n !== i ? u.indexOf(n) - u.indexOf(i) : n !== "string" ? Number(e) - Number(t) : e.localeCompare(t);
}
function hn$1(e) {
  return (...t) => {
    let n = e(...t);
    return typeof n == "string" ? new Error(n) : n;
  };
}
function Mt$1(e) {
  return e === void 0 ? {} : e;
}
function Vt(e) {
  if (typeof e == "string") return { text: e };
  let { text: t, list: n } = e;
  return Fo$1((t || n) !== void 0, "Unexpected `expected` result, there should be at least one field."), n ? { text: t, list: { title: n.title, values: n.values.map(Vt) } } : { text: t };
}
function $t$1(e, t) {
  return e === !0 ? !0 : e === !1 ? { value: t } : e;
}
function Wt$1(e, t, n = !1) {
  return e === !1 ? !1 : e === !0 ? n ? !0 : [{ value: t }] : "value" in e ? [e] : e.length === 0 ? !1 : e;
}
function fn$1(e, t) {
  return typeof e == "string" || "key" in e ? { from: t, to: e } : "from" in e ? { from: e.from, to: e.to } : { from: t, to: e.to };
}
function ft$1(e, t) {
  return e === void 0 ? [] : Array.isArray(e) ? e.map((n) => fn$1(n, t)) : [fn$1(e, t)];
}
function Ut$1(e, t) {
  let n = ft$1(typeof e == "object" && "redirect" in e ? e.redirect : e, t);
  return n.length === 0 ? { remain: t, redirect: n } : typeof e == "object" && "remain" in e ? { remain: e.remain, redirect: n } : { redirect: n };
}
function Fo$1(e, t) {
  if (!e) throw new Error(t);
}
var Ft$1 = class extends O {
  constructor(t) {
    super(t), this._choices = pn$1(t.choices.map((n) => n && typeof n == "object" ? n : { value: n }), "value");
  }
  expected({ descriptor: t }) {
    let n = Array.from(this._choices.keys()).map((o) => this._choices.get(o)).filter(({ hidden: o }) => !o).map((o) => o.value).sort(Cn).map(t.value), i = n.slice(0, -2), u = n.slice(-2);
    return { text: i.concat(u.join(" or ")).join(", "), list: { title: "one of the following values", values: n } };
  }
  validate(t) {
    return this._choices.has(t);
  }
  deprecated(t) {
    let n = this._choices.get(t);
    return n && n.deprecated ? { value: t } : !1;
  }
  forward(t) {
    let n = this._choices.get(t);
    return n ? n.forward : void 0;
  }
  redirect(t) {
    let n = this._choices.get(t);
    return n ? n.redirect : void 0;
  }
}, pt = class extends O {
  expected() {
    return "a number";
  }
  validate(e, t) {
    return typeof e == "number";
  }
}, dt$1 = class extends pt {
  expected() {
    return "an integer";
  }
  validate(t, n) {
    return n.normalizeValidateResult(super.validate(t, n), t) === !0 && En(t);
  }
}, je$1 = class extends O {
  expected() {
    return "a string";
  }
  validate(t) {
    return typeof t == "string";
  }
}, gn$1 = oe$1, yn$1 = st$1, An$1 = sn$1, Bn$1 = nn$1, mt = class {
  constructor(e, t) {
    let { logger: n = console, loggerPrintWidth: i = 80, descriptor: u = gn$1, unknown: o = yn$1, invalid: l = An$1, deprecated: f = Bn$1, missing: d = () => !1, required: p = () => !1, preprocess: c = (m) => m, postprocess: a = () => Ee$1 } = t || {};
    this._utils = { descriptor: u, logger: n || { warn: () => {
    } }, loggerPrintWidth: i, schemas: Fn$1(e, "name"), normalizeDefaultResult: Mt$1, normalizeExpectedResult: Vt, normalizeDeprecatedResult: Wt$1, normalizeForwardResult: ft$1, normalizeRedirectResult: Ut$1, normalizeValidateResult: $t$1 }, this._unknownHandler = o, this._invalidHandler = hn$1(l), this._deprecatedHandler = f, this._identifyMissing = (m, g) => !(m in g) || d(m, g), this._identifyRequired = p, this._preprocess = c, this._postprocess = a, this.cleanHistory();
  }
  cleanHistory() {
    this._hasDeprecationWarned = dn$1();
  }
  normalize(e) {
    let t = {}, n = [this._preprocess(e, this._utils)], i = () => {
      for (; n.length !== 0; ) {
        let u = n.shift(), o = this._applyNormalization(u, t);
        n.push(...o);
      }
    };
    i();
    for (let u of Object.keys(this._utils.schemas)) {
      let o = this._utils.schemas[u];
      if (!(u in t)) {
        let l = Mt$1(o.default(this._utils));
        "value" in l && n.push({ [u]: l.value });
      }
    }
    i();
    for (let u of Object.keys(this._utils.schemas)) {
      if (!(u in t)) continue;
      let o = this._utils.schemas[u], l = t[u], f = o.postprocess(l, this._utils);
      f !== Ee$1 && (this._applyValidation(f, u, o), t[u] = f);
    }
    return this._applyPostprocess(t), this._applyRequiredCheck(t), t;
  }
  _applyNormalization(e, t) {
    let n = [], { knownKeys: i, unknownKeys: u } = this._partitionOptionKeys(e);
    for (let o of i) {
      let l = this._utils.schemas[o], f = l.preprocess(e[o], this._utils);
      this._applyValidation(f, o, l);
      let d = ({ from: a, to: m }) => {
        n.push(typeof m == "string" ? { [m]: a } : { [m.key]: m.value });
      }, p = ({ value: a, redirectTo: m }) => {
        let g = Wt$1(l.deprecated(a, this._utils), f, !0);
        if (g !== !1) if (g === !0) this._hasDeprecationWarned(o) || this._utils.logger.warn(this._deprecatedHandler(o, m, this._utils));
        else for (let { value: v } of g) {
          let h = { key: o, value: v };
          if (!this._hasDeprecationWarned(h)) {
            let F = typeof m == "string" ? { key: m, value: v } : m;
            this._utils.logger.warn(this._deprecatedHandler(h, F, this._utils));
          }
        }
      };
      ft$1(l.forward(f, this._utils), f).forEach(d);
      let c = Ut$1(l.redirect(f, this._utils), f);
      if (c.redirect.forEach(d), "remain" in c) {
        let a = c.remain;
        t[o] = o in t ? l.overlap(t[o], a, this._utils) : a, p({ value: a });
      }
      for (let { from: a, to: m } of c.redirect) p({ value: a, redirectTo: m });
    }
    for (let o of u) {
      let l = e[o];
      this._applyUnknownHandler(o, l, t, (f, d) => {
        n.push({ [f]: d });
      });
    }
    return n;
  }
  _applyRequiredCheck(e) {
    for (let t of Object.keys(this._utils.schemas)) if (this._identifyMissing(t, e) && this._identifyRequired(t)) throw this._invalidHandler(t, it, this._utils);
  }
  _partitionOptionKeys(e) {
    let [t, n] = mn$1(Object.keys(e).filter((i) => !this._identifyMissing(i, e)), (i) => i in this._utils.schemas);
    return { knownKeys: t, unknownKeys: n };
  }
  _applyValidation(e, t, n) {
    let i = $t$1(n.validate(e, this._utils), e);
    if (i !== !0) throw this._invalidHandler(t, i.value, this._utils);
  }
  _applyUnknownHandler(e, t, n, i) {
    let u = this._unknownHandler(e, t, this._utils);
    if (u) for (let o of Object.keys(u)) {
      if (this._identifyMissing(o, u)) continue;
      let l = u[o];
      o in this._utils.schemas ? i(o, l) : n[o] = l;
    }
  }
  _applyPostprocess(e) {
    let t = this._postprocess(e, this._utils);
    if (t !== Ee$1) {
      if (t.delete) for (let n of t.delete) delete e[n];
      if (t.override) {
        let { knownKeys: n, unknownKeys: i } = this._partitionOptionKeys(t.override);
        for (let u of n) {
          let o = t.override[u];
          this._applyValidation(o, u, this._utils.schemas[u]), e[u] = o;
        }
        for (let u of i) {
          let o = t.override[u];
          this._applyUnknownHandler(u, o, e, (l, f) => {
            let d = this._utils.schemas[l];
            this._applyValidation(f, l, d), e[l] = f;
          });
        }
      }
    }
  }
}, Gt;
function mo(e, t, { logger: n = !1, isCLI: i = !1, passThrough: u = !1, FlagSchema: o, descriptor: l } = {}) {
  if (i) {
    if (!o) throw new Error("'FlagSchema' option is required.");
    if (!l) throw new Error("'descriptor' option is required.");
  } else l = oe$1;
  let f = u ? Array.isArray(u) ? (m, g) => u.includes(m) ? { [m]: g } : void 0 : (m, g) => ({ [m]: g }) : (m, g, v) => {
    let { _: h, ...F } = v.schemas;
    return st$1(m, g, { ...v, schemas: F });
  }, d = Eo(t, { isCLI: i, FlagSchema: o }), p = new mt(d, { logger: n, unknown: f, descriptor: l }), c = n !== !1;
  c && Gt && (p._hasDeprecationWarned = Gt);
  let a = p.normalize(e);
  return c && (Gt = p._hasDeprecationWarned), a;
}
function Eo(e, { isCLI: t, FlagSchema: n }) {
  let i = [];
  t && i.push(at$1.create({ name: "_" }));
  for (let u of e) i.push(Co(u, { isCLI: t, optionInfos: e, FlagSchema: n })), u.alias && t && i.push(Dt$1.create({ name: u.alias, sourceName: u.name }));
  return i;
}
function Co(e, { isCLI: t, optionInfos: n, FlagSchema: i }) {
  let { name: u } = e, o = { name: u }, l, f = {};
  switch (e.type) {
    case "int":
      l = dt$1, t && (o.preprocess = Number);
      break;
    case "string":
      l = je$1;
      break;
    case "choice":
      l = Ft$1, o.choices = e.choices.map((d) => d != null && d.redirect ? { ...d, redirect: { to: { key: e.name, value: d.redirect } } } : d);
      break;
    case "boolean":
      l = lt$1;
      break;
    case "flag":
      l = i, o.flags = n.flatMap((d) => [d.alias, d.description && d.name, d.oppositeDescription && `no-${d.name}`].filter(Boolean));
      break;
    case "path":
      l = je$1;
      break;
    default:
      throw new Error(`Unexpected type ${e.type}`);
  }
  if (e.exception ? o.validate = (d, p, c) => e.exception(d) || p.validate(d, c) : o.validate = (d, p, c) => d === void 0 || p.validate(d, c), e.redirect && (f.redirect = (d) => d ? { to: typeof e.redirect == "string" ? e.redirect : { key: e.redirect.option, value: e.redirect.value } } : void 0), e.deprecated && (f.deprecated = !0), t && !e.array) {
    let d = o.preprocess || ((p) => p);
    o.preprocess = (p, c, a) => c.preprocess(d(Array.isArray(p) ? y$1(!1, p, -1) : p), a);
  }
  return e.array ? ct.create({ ...t ? { preprocess: (d) => Array.isArray(d) ? d : [d] } : {}, ...f, valueSchema: l.create(o) }) : l.create({ ...o, ...f });
}
var _n$1 = mo, ho = (e, t, n) => {
  if (!(e && t == null)) {
    if (t.findLast) return t.findLast(n);
    for (let i = t.length - 1; i >= 0; i--) {
      let u = t[i];
      if (n(u, i, t)) return u;
    }
  }
}, zt$1 = ho;
function Kt$1(e, t) {
  if (!t) throw new Error("parserName is required.");
  let n = zt$1(!1, e, (u) => u.parsers && Object.prototype.hasOwnProperty.call(u.parsers, t));
  if (n) return n;
  let i = `Couldn't resolve parser "${t}".`;
  throw i += " Plugins must be explicitly added to the standalone bundle.", new Re(i);
}
function bn$1(e, t) {
  if (!t) throw new Error("astFormat is required.");
  let n = zt$1(!1, e, (u) => u.printers && Object.prototype.hasOwnProperty.call(u.printers, t));
  if (n) return n;
  let i = `Couldn't find plugin for AST format "${t}".`;
  throw i += " Plugins must be explicitly added to the standalone bundle.", new Re(i);
}
function Et$1({ plugins: e, parser: t }) {
  let n = Kt$1(e, t);
  return Ht$1(n, t);
}
function Ht$1(e, t) {
  let n = e.parsers[t];
  return typeof n == "function" ? n() : n;
}
function xn$1(e, t) {
  let n = e.printers[t];
  return typeof n == "function" ? n() : n;
}
var kn = { astFormat: "estree", printer: {}, originalText: void 0, locStart: null, locEnd: null };
async function go(e, t = {}) {
  var n;
  let i = { ...e };
  if (!i.parser) if (i.filepath) {
    if (i.parser = en(i, { physicalFile: i.filepath }), !i.parser) throw new Ye$1(`No parser could be inferred for file "${i.filepath}".`);
  } else throw new Ye$1("No parser and no file path given, couldn't infer a parser.");
  let u = ut({ plugins: e.plugins, showDeprecated: !0 }).options, o = { ...kn, ...Object.fromEntries(u.filter((m) => m.default !== void 0).map((m) => [m.name, m.default])) }, l = Kt$1(i.plugins, i.parser), f = await Ht$1(l, i.parser);
  i.astFormat = f.astFormat, i.locEnd = f.locEnd, i.locStart = f.locStart;
  let d = (n = l.printers) != null && n[f.astFormat] ? l : bn$1(i.plugins, f.astFormat), p = await xn$1(d, f.astFormat);
  i.printer = p;
  let c = d.defaultOptions ? Object.fromEntries(Object.entries(d.defaultOptions).filter(([, m]) => m !== void 0)) : {}, a = { ...o, ...c };
  for (let [m, g] of Object.entries(a)) (i[m] === null || i[m] === void 0) && (i[m] = g);
  return i.parser === "json" && (i.trailingComma = "none"), _n$1(i, u, { passThrough: Object.keys(kn), ...t });
}
var ie = go, Mn$1 = Ae$1(jn$1());
async function Oo(e, t) {
  let n = await Et$1(t), i = n.preprocess ? n.preprocess(e, t) : e;
  t.originalText = i;
  let u;
  try {
    u = await n.parse(i, t, t);
  } catch (o) {
    No(o, e);
  }
  return { text: i, ast: u };
}
function No(e, t) {
  let { loc: n } = e;
  if (n) {
    let i = (0, Mn$1.codeFrameColumns)(t, n, { highlightCode: !0 });
    throw e.message += `
` + i, e.codeFrame = i, e;
  }
  throw e;
}
var ce$1 = Oo;
async function Vn$1(e, t, n, i, u) {
  let { embeddedLanguageFormatting: o, printer: { embed: l, hasPrettierIgnore: f = () => !1, getVisitorKeys: d } } = n;
  if (!l || o !== "auto") return;
  if (l.length > 2) throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/en/plugins.html#optional-embed");
  let p = X(l.getVisitorKeys ?? d), c = [];
  g();
  let a = e.stack;
  for (let { print: v, node: h, pathStack: F } of c) try {
    e.stack = F;
    let C = await v(m, t, e, n);
    C && u.set(h, C);
  } catch (C) {
    if (globalThis.PRETTIER_DEBUG) throw C;
  }
  e.stack = a;
  function m(v, h) {
    return To(v, h, n, i);
  }
  function g() {
    let { node: v } = e;
    if (v === null || typeof v != "object" || f(e)) return;
    for (let F of p(v)) Array.isArray(v[F]) ? e.each(g, F) : e.call(g, F);
    let h = l(e, n);
    if (h) {
      if (typeof h == "function") {
        c.push({ print: h, node: v, pathStack: [...e.stack] });
        return;
      }
      u.set(v, h);
    }
  }
}
async function To(e, t, n, i) {
  let u = await ie({ ...n, ...t, parentParser: n.parser, originalText: e }, { passThrough: !0 }), { ast: o } = await ce$1(e, u), l = await i(o, u);
  return Xe$1(l);
}
function So(e, t) {
  let { originalText: n, [Symbol.for("comments")]: i, locStart: u, locEnd: o, [Symbol.for("printedComments")]: l } = t, { node: f } = e, d = u(f), p = o(f);
  for (let c of i) u(c) >= d && o(c) <= p && l.add(c);
  return n.slice(d, p);
}
var $n$1 = So;
async function Me(e, t) {
  ({ ast: e } = await Xt(e, t));
  let n = /* @__PURE__ */ new Map(), i = new Yr$1(e), u = /* @__PURE__ */ new Map();
  await Vn$1(i, l, t, Me, u);
  let o = await Wn$1(i, t, l, void 0, u);
  return Jr$1(t), o;
  function l(d, p) {
    return d === void 0 || d === i ? f(p) : Array.isArray(d) ? i.call(() => f(p), ...d) : i.call(() => f(p), d);
  }
  function f(d) {
    let p = i.node;
    if (p == null) return "";
    let c = p && typeof p == "object" && d === void 0;
    if (c && n.has(p)) return n.get(p);
    let a = Wn$1(i, t, l, d, u);
    return c && n.set(p, a), a;
  }
}
function Wn$1(e, t, n, i, u) {
  var o;
  let { node: l } = e, { printer: f } = t, d;
  return (o = f.hasPrettierIgnore) != null && o.call(f, e) ? d = $n$1(e, t) : u.has(l) ? d = u.get(l) : d = f.print(e, t, n, i), l === t.cursorNode && (d = Ze$1(d, (p) => [Oe$1, p, Oe$1])), f.printComment && (!f.willPrintOwnComments || !f.willPrintOwnComments(e, t)) && (d = qr(e, d, t)), d;
}
async function Xt(e, t) {
  let n = e.comments ?? [];
  t[Symbol.for("comments")] = n, t[Symbol.for("tokens")] = e.tokens ?? [], t[Symbol.for("printedComments")] = /* @__PURE__ */ new Set(), zr$1(e, t);
  let { printer: { preprocess: i } } = t;
  return e = i ? await i(e, t) : e, { ast: e, comments: n };
}
function vo$1(e, t) {
  let { cursorOffset: n, locStart: i, locEnd: u } = t, o = X(t.printer.getVisitorKeys), l = (d) => i(d) <= n && u(d) >= n, f = e;
  for (let d of Vr$1(e, { getVisitorKeys: o, filter: l })) f = d;
  return f;
}
var Un$1 = vo$1;
function Po(e, t) {
  let { printer: { massageAstNode: n, getVisitorKeys: i } } = t;
  if (!n) return e;
  let u = X(i), o = n.ignoredProperties ?? /* @__PURE__ */ new Set();
  return l(e);
  function l(f, d) {
    if (!(f !== null && typeof f == "object")) return f;
    if (Array.isArray(f)) return f.map((m) => l(m, d)).filter(Boolean);
    let p = {}, c = new Set(u(f));
    for (let m in f) !Object.prototype.hasOwnProperty.call(f, m) || o.has(m) || (c.has(m) ? p[m] = l(f[m], f) : p[m] = f[m]);
    let a = n(f, p, d);
    if (a !== null) return a ?? p;
  }
}
var Gn$1 = Po, Lo = ({ parser: e }) => e === "json" || e === "json5" || e === "jsonc" || e === "json-stringify";
function Io(e, t) {
  let n = [e.node, ...e.parentNodes], i = /* @__PURE__ */ new Set([t.node, ...t.parentNodes]);
  return n.find((u) => Hn$1.has(u.type) && i.has(u));
}
function zn$1(e) {
  let t = e.length - 1;
  for (; ; ) {
    let n = e[t];
    if ((n == null ? void 0 : n.type) === "Program" || (n == null ? void 0 : n.type) === "File") t--;
    else break;
  }
  return e.slice(0, t + 1);
}
function Ro(e, t, { locStart: n, locEnd: i }) {
  let u = e.node, o = t.node;
  if (u === o) return { startNode: u, endNode: o };
  let l = n(e.node);
  for (let d of zn$1(t.parentNodes)) if (n(d) >= l) o = d;
  else break;
  let f = i(t.node);
  for (let d of zn$1(e.parentNodes)) {
    if (i(d) <= f) u = d;
    else break;
    if (u === o) break;
  }
  return { startNode: u, endNode: o };
}
function Zt(e, t, n, i, u = [], o) {
  let { locStart: l, locEnd: f } = n, d = l(e), p = f(e);
  if (!(t > p || t < d || o === "rangeEnd" && t === d || o === "rangeStart" && t === p)) {
    for (let c of nt$1(e, n)) {
      let a = Zt(c, t, n, i, [e, ...u], o);
      if (a) return a;
    }
    if (!i || i(e, u[0])) return { node: e, parentNodes: u };
  }
}
function Yo(e, t) {
  return t !== "DeclareExportDeclaration" && e !== "TypeParameterDeclaration" && (e === "Directive" || e === "TypeAlias" || e === "TSExportAssignment" || e.startsWith("Declare") || e.startsWith("TSDeclare") || e.endsWith("Statement") || e.endsWith("Declaration"));
}
var Hn$1 = /* @__PURE__ */ new Set(["JsonRoot", "ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "NullLiteral", "UnaryExpression", "TemplateLiteral"]), jo = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefinition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinition", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionTypeDefinition", "ScalarTypeDefinition"]);
function Kn$1(e, t, n) {
  if (!t) return !1;
  switch (e.parser) {
    case "flow":
    case "babel":
    case "babel-flow":
    case "babel-ts":
    case "typescript":
    case "acorn":
    case "espree":
    case "meriyah":
    case "__babel_estree":
      return Yo(t.type, n == null ? void 0 : n.type);
    case "json":
    case "json5":
    case "jsonc":
    case "json-stringify":
      return Hn$1.has(t.type);
    case "graphql":
      return jo.has(t.kind);
    case "vue":
      return t.tag !== "root";
  }
  return !1;
}
function qn$1(e, t, n) {
  let { rangeStart: i, rangeEnd: u, locStart: o, locEnd: l } = t;
  Le.ok(u > i);
  let f = e.slice(i, u).search(/\S/), d = f === -1;
  if (!d) for (i += f; u > i && !/\S/.test(e[u - 1]); --u) ;
  let p = Zt(n, i, t, (g, v) => Kn$1(t, g, v), [], "rangeStart"), c = d ? p : Zt(n, u, t, (g) => Kn$1(t, g), [], "rangeEnd");
  if (!p || !c) return { rangeStart: 0, rangeEnd: 0 };
  let a, m;
  if (Lo(t)) {
    let g = Io(p, c);
    a = g, m = g;
  } else ({ startNode: a, endNode: m } = Ro(p, c, t));
  return { rangeStart: Math.min(o(a), o(m)), rangeEnd: Math.max(l(a), l(m)) };
}
var eu = "\uFEFF", Jn$1 = Symbol("cursor");
async function tu(e, t, n = 0) {
  if (!e || e.trim().length === 0) return { formatted: "", cursorOffset: -1, comments: [] };
  let { ast: i, text: u } = await ce$1(e, t);
  t.cursorOffset >= 0 && (t.cursorNode = Un$1(i, t));
  let o = await Me(i, t);
  n > 0 && (o = qe$1([q$1, o], n, t.tabWidth));
  let l = pe$1(o, t);
  if (n > 0) {
    let d = l.formatted.trim();
    l.cursorNodeStart !== void 0 && (l.cursorNodeStart -= l.formatted.indexOf(d)), l.formatted = d + be$1(t.endOfLine);
  }
  let f = t[Symbol.for("comments")];
  if (t.cursorOffset >= 0) {
    let d, p, c, a, m;
    if (t.cursorNode && l.cursorNodeText ? (d = t.locStart(t.cursorNode), p = u.slice(d, t.locEnd(t.cursorNode)), c = t.cursorOffset - d, a = l.cursorNodeStart, m = l.cursorNodeText) : (d = 0, p = u, c = t.cursorOffset, a = 0, m = l.formatted), p === m) return { formatted: l.formatted, cursorOffset: a + c, comments: f };
    let g = p.split("");
    g.splice(c, 0, Jn$1);
    let v = m.split(""), h = (0, Qn$1.diffArrays)(g, v), F = a;
    for (let C of h) if (C.removed) {
      if (C.value.includes(Jn$1)) break;
    } else F += C.count;
    return { formatted: l.formatted, cursorOffset: F, comments: f };
  }
  return { formatted: l.formatted, cursorOffset: -1, comments: f };
}
async function Mo(e, t) {
  let { ast: n, text: i } = await ce$1(e, t), { rangeStart: u, rangeEnd: o } = qn$1(i, t, n), l = i.slice(u, o), f = Math.min(u, i.lastIndexOf(`
`, u) + 1), d = i.slice(f, u).match(/^\s*/)[0], p = de$1(d, t.tabWidth), c = await tu(l, { ...t, rangeStart: 0, rangeEnd: Number.POSITIVE_INFINITY, cursorOffset: t.cursorOffset > u && t.cursorOffset <= o ? t.cursorOffset - u : -1, endOfLine: "lf" }, p), a = c.formatted.trimEnd(), { cursorOffset: m } = t;
  m > o ? m += a.length - l.length : c.cursorOffset >= 0 && (m = c.cursorOffset + u);
  let g = i.slice(0, u) + a + i.slice(o);
  if (t.endOfLine !== "lf") {
    let v = be$1(t.endOfLine);
    m >= 0 && v === `\r
` && (m += At$1(g.slice(0, m), `
`)), g = re$1(!1, g, `
`, v);
  }
  return { formatted: g, cursorOffset: m, comments: c.comments };
}
function Qt$1(e, t, n) {
  return typeof t != "number" || Number.isNaN(t) || t < 0 || t > e.length ? n : t;
}
function Xn$1(e, t) {
  let { cursorOffset: n, rangeStart: i, rangeEnd: u } = t;
  return n = Qt$1(e, n, -1), i = Qt$1(e, i, 0), u = Qt$1(e, u, e.length), { ...t, cursorOffset: n, rangeStart: i, rangeEnd: u };
}
function ru$1(e, t) {
  let { cursorOffset: n, rangeStart: i, rangeEnd: u, endOfLine: o } = Xn$1(e, t), l = e.charAt(0) === eu;
  if (l && (e = e.slice(1), n--, i--, u--), o === "auto" && (o = lr(e)), e.includes("\r")) {
    let f = (d) => At$1(e.slice(0, Math.max(d, 0)), `\r
`);
    n -= f(n), i -= f(i), u -= f(u), e = fr(e);
  }
  return { hasBOM: l, text: e, options: Xn$1(e, { ...t, cursorOffset: n, rangeStart: i, rangeEnd: u, endOfLine: o }) };
}
async function Zn$1(e, t) {
  let n = await Et$1(t);
  return !n.hasPragma || n.hasPragma(e);
}
async function er$1(e, t) {
  let { hasBOM: n, text: i, options: u } = ru$1(e, await ie(t));
  if (u.rangeStart >= u.rangeEnd && i !== "" || u.requirePragma && !await Zn$1(i, u)) return { formatted: e, cursorOffset: t.cursorOffset, comments: [] };
  let o;
  return u.rangeStart > 0 || u.rangeEnd < i.length ? o = await Mo(i, u) : (!u.requirePragma && u.insertPragma && u.printer.insertPragma && !await Zn$1(i, u) && (i = u.printer.insertPragma(i)), o = await tu(i, u)), n && (o.formatted = eu + o.formatted, o.cursorOffset >= 0 && o.cursorOffset++), o;
}
async function nu$1(e, t, n) {
  let { text: i, options: u } = ru$1(e, await ie(t)), o = await ce$1(i, u);
  return n && (n.preprocessForPrint && (o.ast = await Xt(o.ast, u)), n.massage && (o.ast = Gn$1(o.ast, u))), o;
}
async function uu(e, t) {
  t = await ie(t);
  let n = await Me(e, t);
  return pe$1(n, t);
}
async function ou(e, t) {
  let n = br(e), { formatted: i } = await er$1(n, { ...t, parser: "__js_expression" });
  return i;
}
async function iu$1(e, t) {
  t = await ie(t);
  let { ast: n } = await ce$1(e, t);
  return Me(n, t);
}
async function su(e, t) {
  return pe$1(e, await ie(t));
}
var tr$1 = {};
We$1(tr$1, { builders: () => $o, printer: () => Wo, utils: () => Uo });
var $o = { join: Ne, line: Ke$1, softline: Br, hardline: q$1, literalline: He$1, group: _t, conditionalGroup: Cr, fill: ze$1, lineSuffix: ke$1, lineSuffixBoundary: yr, cursor: Oe$1, breakParent: Fe$1, ifBreak: hr, trim: Ar, indent: De$1, indentIfBreak: gr, align: se$1, addAlignmentToDoc: qe$1, markAsRoot: mr, dedentToRoot: dr, dedent: Er, hardlineWithoutBreakParent: we$1, literallineWithoutBreakParent: bt, label: _r, concat: (e) => e }, Wo = { printDocToString: pe$1 }, Uo = { willBreak: Sr, traverseDoc: xe$1, findInDoc: Je$1, mapDoc: ve$1, removeLines: Pr, stripTrailingHardline: Xe$1, replaceEndOfLine: Lr, canBreak: Ir }, Du = "3.3.2", nr = {};
We$1(nr, { addDanglingComment: () => te$1, addLeadingComment: () => ne, addTrailingComment: () => ue$1, getAlignmentSize: () => de$1, getIndentSize: () => au, getMaxContinuousCount: () => cu, getNextNonSpaceNonCommentCharacter: () => lu$1, getNextNonSpaceNonCommentCharacterIndex: () => ri$1, getStringWidth: () => Te$1, hasNewline: () => U$1, hasNewlineInRange: () => fu$1, hasSpaces: () => Fu$1, isNextLineEmpty: () => ii$1, isNextLineEmptyAfterIndex: () => ht, isPreviousLineEmpty: () => ui$1, makeString: () => pu, skip: () => me, skipEverythingButNewLine: () => rt$1, skipInlineComment: () => Ce$1, skipNewline: () => $, skipSpaces: () => S, skipToLineEnd: () => tt$1, skipTrailingComment: () => he$1, skipWhitespace: () => $r$1 });
function Go(e, t) {
  if (t === !1) return !1;
  if (e.charAt(t) === "/" && e.charAt(t + 1) === "*") {
    for (let n = t + 2; n < e.length; ++n) if (e.charAt(n) === "*" && e.charAt(n + 1) === "/") return n + 2;
  }
  return t;
}
var Ce$1 = Go;
function zo(e, t) {
  return t === !1 ? !1 : e.charAt(t) === "/" && e.charAt(t + 1) === "/" ? rt$1(e, t) : t;
}
var he$1 = zo;
function Ko$1(e, t) {
  let n = null, i = t;
  for (; i !== n; ) n = i, i = S(e, i), i = Ce$1(e, i), i = he$1(e, i), i = $(e, i);
  return i;
}
var Ve$1 = Ko$1;
function Ho(e, t) {
  let n = null, i = t;
  for (; i !== n; ) n = i, i = tt$1(e, i), i = Ce$1(e, i), i = S(e, i);
  return i = he$1(e, i), i = $(e, i), i !== !1 && U$1(e, i);
}
var ht = Ho;
function qo(e, t) {
  let n = e.lastIndexOf(`
`);
  return n === -1 ? 0 : de$1(e.slice(n + 1).match(/^[\t ]*/)[0], t);
}
var au = qo;
function rr$1(e) {
  if (typeof e != "string") throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Jo(e, t) {
  let n = e.match(new RegExp(`(${rr$1(t)})+`, "g"));
  return n === null ? 0 : n.reduce((i, u) => Math.max(i, u.length / t.length), 0);
}
var cu = Jo;
function Xo$1(e, t) {
  let n = Ve$1(e, t);
  return n === !1 ? "" : e.charAt(n);
}
var lu$1 = Xo$1;
function Zo(e, t, n) {
  for (let i = t; i < n; ++i) if (e.charAt(i) === `
`) return !0;
  return !1;
}
var fu$1 = Zo;
function Qo(e, t, n = {}) {
  return S(e, n.backwards ? t - 1 : t, n) !== t;
}
var Fu$1 = Qo;
function ei$1(e, t, n) {
  let i = t === '"' ? "'" : '"', u = re$1(!1, e, /\\(.)|(["'])/gs, (o, l, f) => l === i ? l : f === t ? "\\" + f : f || (n && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(l) ? l : "\\" + l));
  return t + u + t;
}
var pu = ei$1;
function ti$1(e, t, n) {
  return Ve$1(e, n(t));
}
function ri$1(e, t) {
  return arguments.length === 2 || typeof t == "number" ? Ve$1(e, t) : ti$1(...arguments);
}
function ni$1(e, t, n) {
  return Ie(e, n(t));
}
function ui$1(e, t) {
  return arguments.length === 2 || typeof t == "number" ? Ie(e, t) : ni$1(...arguments);
}
function oi$1(e, t, n) {
  return ht(e, n(t));
}
function ii$1(e, t) {
  return arguments.length === 2 || typeof t == "number" ? ht(e, t) : oi$1(...arguments);
}
function le(e, t = 1) {
  return async (...n) => {
    let i = n[t] ?? {}, u = i.plugins ?? [];
    return n[t] = { ...i, plugins: Array.isArray(u) ? u : Object.values(u) }, e(...n);
  };
}
var du$1 = le(er$1);
async function mu(e, t) {
  let { formatted: n } = await du$1(e, { ...t, cursorOffset: -1 });
  return n;
}
async function si$1(e, t) {
  return await mu(e, t) === e;
}
var Di = le(ut, 0), ai$1 = { parse: le(nu$1), formatAST: le(uu), formatDoc: le(ou), printToDoc: le(iu$1), printDocToString: le(su) }, ul$1 = ur$1, ul = Object.create, Wr = Object.defineProperty, ll = Object.getOwnPropertyDescriptor, cl = Object.getOwnPropertyNames, fl = Object.getPrototypeOf, pl = Object.prototype.hasOwnProperty, y = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), tn = (e, t) => {
  for (var n in t) Wr(e, n, { get: t[n], enumerable: !0 });
}, hl = (e, t, n, i) => {
  if (t && typeof t == "object" || typeof t == "function") for (let u of cl(t)) !pl.call(e, u) && u !== n && Wr(e, u, { get: () => t[u], enumerable: !(i = ll(t, u)) || i.enumerable });
  return e;
}, ae = (e, t, n) => (n = e != null ? ul(fl(e)) : {}, hl(Wr(n, "default", { value: e, enumerable: !0 }), e)), An = y((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extract = c, e.parse = m, e.parseWithComments = g, e.print = v, e.strip = a;
  var t = /\*\/$/, n = /^\/\*\*?/, i = /^\s*(\/\*\*?(.|\r?\n)*?\*\/)/, u = /(^|\s+)\/\/([^\r\n]*)/g, o = /^(\r?\n)+/, l = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *(?![^@\r\n]*\/\/[^]*)([^@\r\n\s][^@\r\n]+?) *\r?\n/g, f = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g, d = /(\r?\n|^) *\* ?/g, p = [];
  function c(F) {
    let C = F.match(i);
    return C ? C[0].trimLeft() : "";
  }
  function a(F) {
    let C = F.match(i);
    return C && C[0] ? F.substring(C[0].length) : F;
  }
  function m(F) {
    return g(F).pragmas;
  }
  function g(F) {
    let C = `
`;
    F = F.replace(n, "").replace(t, "").replace(d, "$1");
    let _ = "";
    for (; _ !== F; ) _ = F, F = F.replace(l, `${C}$1 $2${C}`);
    F = F.replace(o, "").trimRight();
    let H = /* @__PURE__ */ Object.create(null), Dr = F.replace(f, "").replace(o, "").trimRight(), ge;
    for (; ge = f.exec(F); ) {
      let gt = ge[2].replace(u, "");
      typeof H[ge[1]] == "string" || Array.isArray(H[ge[1]]) ? H[ge[1]] = p.concat(H[ge[1]], gt) : H[ge[1]] = gt;
    }
    return { comments: Dr, pragmas: H };
  }
  function v({ comments: F = "", pragmas: C = {} }) {
    let _ = `
`, H = "/**", Dr = " *", ge = " */", gt = Object.keys(C), yt = gt.flatMap((us) => h(us, C[us])).map((us) => `${Dr} ${us}${_}`).join("");
    if (!F) {
      if (gt.length === 0) return "";
      if (gt.length === 1 && !Array.isArray(C[gt[0]])) {
        let us = C[gt[0]];
        return `${H} ${h(gt[0], us)[0]}${ge}`;
      }
    }
    let ns = F.split(_).map((us) => `${Dr} ${us}`).join(_) + _;
    return H + _ + (F ? ns : "") + (F && gt.length ? Dr + _ : "") + yt + ge;
  }
  function h(F, C) {
    return p.concat(C).map((_) => `@${F} ${_}`.trim());
  }
}), Wt = y((e, t) => {
  t.exports.isClean = Symbol("isClean"), t.exports.my = Symbol("my");
}), wi = y((e, t) => {
  var n = String, i = function() {
    return { isColorSupported: !1, reset: n, bold: n, dim: n, italic: n, underline: n, inverse: n, hidden: n, strikethrough: n, black: n, red: n, green: n, yellow: n, blue: n, magenta: n, cyan: n, white: n, gray: n, bgBlack: n, bgRed: n, bgGreen: n, bgYellow: n, bgBlue: n, bgMagenta: n, bgCyan: n, bgWhite: n };
  };
  t.exports = i(), t.exports.createColors = i;
}), os = y(() => {
}), Yt = y((e, t) => {
  var n = wi(), i = os(), u = class Hi extends Error {
    constructor(l, f, d, p, c, a) {
      super(l), this.name = "CssSyntaxError", this.reason = l, c && (this.file = c), p && (this.source = p), a && (this.plugin = a), typeof f < "u" && typeof d < "u" && (typeof f == "number" ? (this.line = f, this.column = d) : (this.line = f.line, this.column = f.column, this.endLine = d.line, this.endColumn = d.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, Hi);
    }
    setMessage() {
      this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
    }
    showSourceCode(l) {
      if (!this.source) return "";
      let f = this.source;
      l == null && (l = n.isColorSupported), i && l && (f = i(f));
      let d = f.split(/\r?\n/), p = Math.max(this.line - 3, 0), c = Math.min(this.line + 2, d.length), a = String(c).length, m, g;
      if (l) {
        let { bold: v, gray: h, red: F } = n.createColors(!0);
        m = (C) => v(F(C)), g = (C) => h(C);
      } else m = g = (v) => v;
      return d.slice(p, c).map((v, h) => {
        let F = p + 1 + h, C = " " + (" " + F).slice(-a) + " | ";
        if (F === this.line) {
          let _ = g(C.replace(/\d/g, " ")) + v.slice(0, this.column - 1).replace(/[^\t]/g, " ");
          return m(">") + g(C) + v + `
 ` + _ + m("^");
        }
        return " " + g(C) + v;
      }).join(`
`);
    }
    toString() {
      let l = this.showSourceCode();
      return l && (l = `

` + l + `
`), this.name + ": " + this.message + l;
    }
  };
  t.exports = u, u.default = u;
}), zt = y((e, t) => {
  var n = { after: `
`, beforeClose: `
`, beforeComment: `
`, beforeDecl: `
`, beforeOpen: " ", beforeRule: `
`, colon: ": ", commentLeft: " ", commentRight: " ", emptyBody: "", indent: "    ", semicolon: !1 };
  function i(o) {
    return o[0].toUpperCase() + o.slice(1);
  }
  var u = class {
    constructor(o) {
      this.builder = o;
    }
    atrule(o, l) {
      let f = "@" + o.name, d = o.params ? this.rawValue(o, "params") : "";
      if (typeof o.raws.afterName < "u" ? f += o.raws.afterName : d && (f += " "), o.nodes) this.block(o, f + d);
      else {
        let p = (o.raws.between || "") + (l ? ";" : "");
        this.builder(f + d + p, o);
      }
    }
    beforeAfter(o, l) {
      let f;
      o.type === "decl" ? f = this.raw(o, null, "beforeDecl") : o.type === "comment" ? f = this.raw(o, null, "beforeComment") : l === "before" ? f = this.raw(o, null, "beforeRule") : f = this.raw(o, null, "beforeClose");
      let d = o.parent, p = 0;
      for (; d && d.type !== "root"; ) p += 1, d = d.parent;
      if (f.includes(`
`)) {
        let c = this.raw(o, null, "indent");
        if (c.length) for (let a = 0; a < p; a++) f += c;
      }
      return f;
    }
    block(o, l) {
      let f = this.raw(o, "between", "beforeOpen");
      this.builder(l + f + "{", o, "start");
      let d;
      o.nodes && o.nodes.length ? (this.body(o), d = this.raw(o, "after")) : d = this.raw(o, "after", "emptyBody"), d && this.builder(d), this.builder("}", o, "end");
    }
    body(o) {
      let l = o.nodes.length - 1;
      for (; l > 0 && o.nodes[l].type === "comment"; ) l -= 1;
      let f = this.raw(o, "semicolon");
      for (let d = 0; d < o.nodes.length; d++) {
        let p = o.nodes[d], c = this.raw(p, "before");
        c && this.builder(c), this.stringify(p, l !== d || f);
      }
    }
    comment(o) {
      let l = this.raw(o, "left", "commentLeft"), f = this.raw(o, "right", "commentRight");
      this.builder("/*" + l + o.text + f + "*/", o);
    }
    decl(o, l) {
      let f = this.raw(o, "between", "colon"), d = o.prop + f + this.rawValue(o, "value");
      o.important && (d += o.raws.important || " !important"), l && (d += ";"), this.builder(d, o);
    }
    document(o) {
      this.body(o);
    }
    raw(o, l, f) {
      let d;
      if (f || (f = l), l && (d = o.raws[l], typeof d < "u")) return d;
      let p = o.parent;
      if (f === "before" && (!p || p.type === "root" && p.first === o || p && p.type === "document")) return "";
      if (!p) return n[f];
      let c = o.root();
      if (c.rawCache || (c.rawCache = {}), typeof c.rawCache[f] < "u") return c.rawCache[f];
      if (f === "before" || f === "after") return this.beforeAfter(o, f);
      {
        let a = "raw" + i(f);
        this[a] ? d = this[a](c, o) : c.walk((m) => {
          if (d = m.raws[l], typeof d < "u") return !1;
        });
      }
      return typeof d > "u" && (d = n[f]), c.rawCache[f] = d, d;
    }
    rawBeforeClose(o) {
      let l;
      return o.walk((f) => {
        if (f.nodes && f.nodes.length > 0 && typeof f.raws.after < "u") return l = f.raws.after, l.includes(`
`) && (l = l.replace(/[^\n]+$/, "")), !1;
      }), l && (l = l.replace(/\S/g, "")), l;
    }
    rawBeforeComment(o, l) {
      let f;
      return o.walkComments((d) => {
        if (typeof d.raws.before < "u") return f = d.raws.before, f.includes(`
`) && (f = f.replace(/[^\n]+$/, "")), !1;
      }), typeof f > "u" ? f = this.raw(l, null, "beforeDecl") : f && (f = f.replace(/\S/g, "")), f;
    }
    rawBeforeDecl(o, l) {
      let f;
      return o.walkDecls((d) => {
        if (typeof d.raws.before < "u") return f = d.raws.before, f.includes(`
`) && (f = f.replace(/[^\n]+$/, "")), !1;
      }), typeof f > "u" ? f = this.raw(l, null, "beforeRule") : f && (f = f.replace(/\S/g, "")), f;
    }
    rawBeforeOpen(o) {
      let l;
      return o.walk((f) => {
        if (f.type !== "decl" && (l = f.raws.between, typeof l < "u")) return !1;
      }), l;
    }
    rawBeforeRule(o) {
      let l;
      return o.walk((f) => {
        if (f.nodes && (f.parent !== o || o.first !== f) && typeof f.raws.before < "u") return l = f.raws.before, l.includes(`
`) && (l = l.replace(/[^\n]+$/, "")), !1;
      }), l && (l = l.replace(/\S/g, "")), l;
    }
    rawColon(o) {
      let l;
      return o.walkDecls((f) => {
        if (typeof f.raws.between < "u") return l = f.raws.between.replace(/[^\s:]/g, ""), !1;
      }), l;
    }
    rawEmptyBody(o) {
      let l;
      return o.walk((f) => {
        if (f.nodes && f.nodes.length === 0 && (l = f.raws.after, typeof l < "u")) return !1;
      }), l;
    }
    rawIndent(o) {
      if (o.raws.indent) return o.raws.indent;
      let l;
      return o.walk((f) => {
        let d = f.parent;
        if (d && d !== o && d.parent && d.parent === o && typeof f.raws.before < "u") {
          let p = f.raws.before.split(`
`);
          return l = p[p.length - 1], l = l.replace(/\S/g, ""), !1;
        }
      }), l;
    }
    rawSemicolon(o) {
      let l;
      return o.walk((f) => {
        if (f.nodes && f.nodes.length && f.last.type === "decl" && (l = f.raws.semicolon, typeof l < "u")) return !1;
      }), l;
    }
    rawValue(o, l) {
      let f = o[l], d = o.raws[l];
      return d && d.value === f ? d.raw : f;
    }
    root(o) {
      this.body(o), o.raws.after && this.builder(o.raws.after);
    }
    rule(o) {
      this.block(o, this.rawValue(o, "selector")), o.raws.ownSemicolon && this.builder(o.raws.ownSemicolon, o, "end");
    }
    stringify(o, l) {
      if (!this[o.type]) throw new Error("Unknown AST node type " + o.type + ". Maybe you need to change PostCSS stringifier.");
      this[o.type](o, l);
    }
  };
  t.exports = u, u.default = u;
}), at = y((e, t) => {
  var n = zt();
  function i(u, o) {
    new n(o).stringify(u);
  }
  t.exports = i, i.default = i;
}), lt = y((e, t) => {
  var { isClean: n, my: i } = Wt(), u = Yt(), o = zt(), l = at();
  function f(p, c) {
    let a = new p.constructor();
    for (let m in p) {
      if (!Object.prototype.hasOwnProperty.call(p, m) || m === "proxyCache") continue;
      let g = p[m], v = typeof g;
      m === "parent" && v === "object" ? c && (a[m] = c) : m === "source" ? a[m] = g : Array.isArray(g) ? a[m] = g.map((h) => f(h, a)) : (v === "object" && g !== null && (g = f(g)), a[m] = g);
    }
    return a;
  }
  var d = class {
    constructor(p = {}) {
      this.raws = {}, this[n] = !1, this[i] = !0;
      for (let c in p) if (c === "nodes") {
        this.nodes = [];
        for (let a of p[c]) typeof a.clone == "function" ? this.append(a.clone()) : this.append(a);
      } else this[c] = p[c];
    }
    addToError(p) {
      if (p.postcssNode = this, p.stack && this.source && /\n\s{4}at /.test(p.stack)) {
        let c = this.source;
        p.stack = p.stack.replace(/\n\s{4}at /, `$&${c.input.from}:${c.start.line}:${c.start.column}$&`);
      }
      return p;
    }
    after(p) {
      return this.parent.insertAfter(this, p), this;
    }
    assign(p = {}) {
      for (let c in p) this[c] = p[c];
      return this;
    }
    before(p) {
      return this.parent.insertBefore(this, p), this;
    }
    cleanRaws(p) {
      delete this.raws.before, delete this.raws.after, p || delete this.raws.between;
    }
    clone(p = {}) {
      let c = f(this);
      for (let a in p) c[a] = p[a];
      return c;
    }
    cloneAfter(p = {}) {
      let c = this.clone(p);
      return this.parent.insertAfter(this, c), c;
    }
    cloneBefore(p = {}) {
      let c = this.clone(p);
      return this.parent.insertBefore(this, c), c;
    }
    error(p, c = {}) {
      if (this.source) {
        let { end: a, start: m } = this.rangeBy(c);
        return this.source.input.error(p, { column: m.column, line: m.line }, { column: a.column, line: a.line }, c);
      }
      return new u(p);
    }
    getProxyProcessor() {
      return { get(p, c) {
        return c === "proxyOf" ? p : c === "root" ? () => p.root().toProxy() : p[c];
      }, set(p, c, a) {
        return p[c] === a || (p[c] = a, (c === "prop" || c === "value" || c === "name" || c === "params" || c === "important" || c === "text") && p.markDirty()), !0;
      } };
    }
    markDirty() {
      if (this[n]) {
        this[n] = !1;
        let p = this;
        for (; p = p.parent; ) p[n] = !1;
      }
    }
    next() {
      if (!this.parent) return;
      let p = this.parent.index(this);
      return this.parent.nodes[p + 1];
    }
    positionBy(p, c) {
      let a = this.source.start;
      if (p.index) a = this.positionInside(p.index, c);
      else if (p.word) {
        c = this.toString();
        let m = c.indexOf(p.word);
        m !== -1 && (a = this.positionInside(m, c));
      }
      return a;
    }
    positionInside(p, c) {
      let a = c || this.toString(), m = this.source.start.column, g = this.source.start.line;
      for (let v = 0; v < p; v++) a[v] === `
` ? (m = 1, g += 1) : m += 1;
      return { column: m, line: g };
    }
    prev() {
      if (!this.parent) return;
      let p = this.parent.index(this);
      return this.parent.nodes[p - 1];
    }
    rangeBy(p) {
      let c = { column: this.source.start.column, line: this.source.start.line }, a = this.source.end ? { column: this.source.end.column + 1, line: this.source.end.line } : { column: c.column + 1, line: c.line };
      if (p.word) {
        let m = this.toString(), g = m.indexOf(p.word);
        g !== -1 && (c = this.positionInside(g, m), a = this.positionInside(g + p.word.length, m));
      } else p.start ? c = { column: p.start.column, line: p.start.line } : p.index && (c = this.positionInside(p.index)), p.end ? a = { column: p.end.column, line: p.end.line } : typeof p.endIndex == "number" ? a = this.positionInside(p.endIndex) : p.index && (a = this.positionInside(p.index + 1));
      return (a.line < c.line || a.line === c.line && a.column <= c.column) && (a = { column: c.column + 1, line: c.line }), { end: a, start: c };
    }
    raw(p, c) {
      return new o().raw(this, p, c);
    }
    remove() {
      return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
    }
    replaceWith(...p) {
      if (this.parent) {
        let c = this, a = !1;
        for (let m of p) m === this ? a = !0 : a ? (this.parent.insertAfter(c, m), c = m) : this.parent.insertBefore(c, m);
        a || this.remove();
      }
      return this;
    }
    root() {
      let p = this;
      for (; p.parent && p.parent.type !== "document"; ) p = p.parent;
      return p;
    }
    toJSON(p, c) {
      let a = {}, m = c == null;
      c = c || /* @__PURE__ */ new Map();
      let g = 0;
      for (let v in this) {
        if (!Object.prototype.hasOwnProperty.call(this, v) || v === "parent" || v === "proxyCache") continue;
        let h = this[v];
        if (Array.isArray(h)) a[v] = h.map((F) => typeof F == "object" && F.toJSON ? F.toJSON(null, c) : F);
        else if (typeof h == "object" && h.toJSON) a[v] = h.toJSON(null, c);
        else if (v === "source") {
          let F = c.get(h.input);
          F == null && (F = g, c.set(h.input, g), g++), a[v] = { end: h.end, inputId: F, start: h.start };
        } else a[v] = h;
      }
      return m && (a.inputs = [...c.keys()].map((v) => v.toJSON())), a;
    }
    toProxy() {
      return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
    }
    toString(p = l) {
      p.stringify && (p = p.stringify);
      let c = "";
      return p(this, (a) => {
        c += a;
      }), c;
    }
    warn(p, c, a) {
      let m = { node: this };
      for (let g in a) m[g] = a[g];
      return p.warn(c, m);
    }
    get proxyOf() {
      return this;
    }
  };
  t.exports = d, d.default = d;
}), ft = y((e, t) => {
  var n = lt(), i = class extends n {
    constructor(u) {
      u && typeof u.value < "u" && typeof u.value != "string" && (u = { ...u, value: String(u.value) }), super(u), this.type = "decl";
    }
    get variable() {
      return this.prop.startsWith("--") || this.prop[0] === "$";
    }
  };
  t.exports = i, i.default = i;
}), Ae = y((e, t) => {
  var n = lt(), i = class extends n {
    constructor(u) {
      super(u), this.type = "comment";
    }
  };
  t.exports = i, i.default = i;
}), se = y((e, t) => {
  var { isClean: n, my: i } = Wt(), u = ft(), o = Ae(), l = lt(), f, d, p, c;
  function a(v) {
    return v.map((h) => (h.nodes && (h.nodes = a(h.nodes)), delete h.source, h));
  }
  function m(v) {
    if (v[n] = !1, v.proxyOf.nodes) for (let h of v.proxyOf.nodes) m(h);
  }
  var g = class Ki extends l {
    append(...h) {
      for (let F of h) {
        let C = this.normalize(F, this.last);
        for (let _ of C) this.proxyOf.nodes.push(_);
      }
      return this.markDirty(), this;
    }
    cleanRaws(h) {
      if (super.cleanRaws(h), this.nodes) for (let F of this.nodes) F.cleanRaws(h);
    }
    each(h) {
      if (!this.proxyOf.nodes) return;
      let F = this.getIterator(), C, _;
      for (; this.indexes[F] < this.proxyOf.nodes.length && (C = this.indexes[F], _ = h(this.proxyOf.nodes[C], C), _ !== !1); ) this.indexes[F] += 1;
      return delete this.indexes[F], _;
    }
    every(h) {
      return this.nodes.every(h);
    }
    getIterator() {
      this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
      let h = this.lastEach;
      return this.indexes[h] = 0, h;
    }
    getProxyProcessor() {
      return { get(h, F) {
        return F === "proxyOf" ? h : h[F] ? F === "each" || typeof F == "string" && F.startsWith("walk") ? (...C) => h[F](...C.map((_) => typeof _ == "function" ? (H, Dr) => _(H.toProxy(), Dr) : _)) : F === "every" || F === "some" ? (C) => h[F]((_, ...H) => C(_.toProxy(), ...H)) : F === "root" ? () => h.root().toProxy() : F === "nodes" ? h.nodes.map((C) => C.toProxy()) : F === "first" || F === "last" ? h[F].toProxy() : h[F] : h[F];
      }, set(h, F, C) {
        return h[F] === C || (h[F] = C, (F === "name" || F === "params" || F === "selector") && h.markDirty()), !0;
      } };
    }
    index(h) {
      return typeof h == "number" ? h : (h.proxyOf && (h = h.proxyOf), this.proxyOf.nodes.indexOf(h));
    }
    insertAfter(h, F) {
      let C = this.index(h), _ = this.normalize(F, this.proxyOf.nodes[C]).reverse();
      C = this.index(h);
      for (let Dr of _) this.proxyOf.nodes.splice(C + 1, 0, Dr);
      let H;
      for (let Dr in this.indexes) H = this.indexes[Dr], C < H && (this.indexes[Dr] = H + _.length);
      return this.markDirty(), this;
    }
    insertBefore(h, F) {
      let C = this.index(h), _ = C === 0 ? "prepend" : !1, H = this.normalize(F, this.proxyOf.nodes[C], _).reverse();
      C = this.index(h);
      for (let ge of H) this.proxyOf.nodes.splice(C, 0, ge);
      let Dr;
      for (let ge in this.indexes) Dr = this.indexes[ge], C <= Dr && (this.indexes[ge] = Dr + H.length);
      return this.markDirty(), this;
    }
    normalize(h, F) {
      if (typeof h == "string") h = a(f(h).nodes);
      else if (typeof h > "u") h = [];
      else if (Array.isArray(h)) {
        h = h.slice(0);
        for (let C of h) C.parent && C.parent.removeChild(C, "ignore");
      } else if (h.type === "root" && this.type !== "document") {
        h = h.nodes.slice(0);
        for (let C of h) C.parent && C.parent.removeChild(C, "ignore");
      } else if (h.type) h = [h];
      else if (h.prop) {
        if (typeof h.value > "u") throw new Error("Value field is missed in node creation");
        typeof h.value != "string" && (h.value = String(h.value)), h = [new u(h)];
      } else if (h.selector) h = [new d(h)];
      else if (h.name) h = [new p(h)];
      else if (h.text) h = [new o(h)];
      else throw new Error("Unknown node type in node creation");
      return h.map((C) => (C[i] || Ki.rebuild(C), C = C.proxyOf, C.parent && C.parent.removeChild(C), C[n] && m(C), typeof C.raws.before > "u" && F && typeof F.raws.before < "u" && (C.raws.before = F.raws.before.replace(/\S/g, "")), C.parent = this.proxyOf, C));
    }
    prepend(...h) {
      h = h.reverse();
      for (let F of h) {
        let C = this.normalize(F, this.first, "prepend").reverse();
        for (let _ of C) this.proxyOf.nodes.unshift(_);
        for (let _ in this.indexes) this.indexes[_] = this.indexes[_] + C.length;
      }
      return this.markDirty(), this;
    }
    push(h) {
      return h.parent = this, this.proxyOf.nodes.push(h), this;
    }
    removeAll() {
      for (let h of this.proxyOf.nodes) h.parent = void 0;
      return this.proxyOf.nodes = [], this.markDirty(), this;
    }
    removeChild(h) {
      h = this.index(h), this.proxyOf.nodes[h].parent = void 0, this.proxyOf.nodes.splice(h, 1);
      let F;
      for (let C in this.indexes) F = this.indexes[C], F >= h && (this.indexes[C] = F - 1);
      return this.markDirty(), this;
    }
    replaceValues(h, F, C) {
      return C || (C = F, F = {}), this.walkDecls((_) => {
        F.props && !F.props.includes(_.prop) || F.fast && !_.value.includes(F.fast) || (_.value = _.value.replace(h, C));
      }), this.markDirty(), this;
    }
    some(h) {
      return this.nodes.some(h);
    }
    walk(h) {
      return this.each((F, C) => {
        let _;
        try {
          _ = h(F, C);
        } catch (H) {
          throw F.addToError(H);
        }
        return _ !== !1 && F.walk && (_ = F.walk(h)), _;
      });
    }
    walkAtRules(h, F) {
      return F ? h instanceof RegExp ? this.walk((C, _) => {
        if (C.type === "atrule" && h.test(C.name)) return F(C, _);
      }) : this.walk((C, _) => {
        if (C.type === "atrule" && C.name === h) return F(C, _);
      }) : (F = h, this.walk((C, _) => {
        if (C.type === "atrule") return F(C, _);
      }));
    }
    walkComments(h) {
      return this.walk((F, C) => {
        if (F.type === "comment") return h(F, C);
      });
    }
    walkDecls(h, F) {
      return F ? h instanceof RegExp ? this.walk((C, _) => {
        if (C.type === "decl" && h.test(C.prop)) return F(C, _);
      }) : this.walk((C, _) => {
        if (C.type === "decl" && C.prop === h) return F(C, _);
      }) : (F = h, this.walk((C, _) => {
        if (C.type === "decl") return F(C, _);
      }));
    }
    walkRules(h, F) {
      return F ? h instanceof RegExp ? this.walk((C, _) => {
        if (C.type === "rule" && h.test(C.selector)) return F(C, _);
      }) : this.walk((C, _) => {
        if (C.type === "rule" && C.selector === h) return F(C, _);
      }) : (F = h, this.walk((C, _) => {
        if (C.type === "rule") return F(C, _);
      }));
    }
    get first() {
      if (this.proxyOf.nodes) return this.proxyOf.nodes[0];
    }
    get last() {
      if (this.proxyOf.nodes) return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
    }
  };
  g.registerParse = (v) => {
    f = v;
  }, g.registerRule = (v) => {
    d = v;
  }, g.registerAtRule = (v) => {
    p = v;
  }, g.registerRoot = (v) => {
    c = v;
  }, t.exports = g, g.default = g, g.rebuild = (v) => {
    v.type === "atrule" ? Object.setPrototypeOf(v, p.prototype) : v.type === "rule" ? Object.setPrototypeOf(v, d.prototype) : v.type === "decl" ? Object.setPrototypeOf(v, u.prototype) : v.type === "comment" ? Object.setPrototypeOf(v, o.prototype) : v.type === "root" && Object.setPrototypeOf(v, c.prototype), v[i] = !0, v.nodes && v.nodes.forEach((h) => {
      g.rebuild(h);
    });
  };
}), Ht = y((e, t) => {
  var n = /[\t\n\f\r "#'()/;[\\\]{}]/g, i = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, u = /.[\r\n"'(/\\]/, o = /[\da-f]/i;
  t.exports = function(l, f = {}) {
    let d = l.css.valueOf(), p = f.ignoreErrors, c, a, m, g, v, h, F, C, _, H, Dr = d.length, ge = 0, gt = [], yt = [];
    function ns() {
      return ge;
    }
    function us($s) {
      throw l.error("Unclosed " + $s, ge);
    }
    function ms() {
      return yt.length === 0 && ge >= Dr;
    }
    function ks($s) {
      if (yt.length) return yt.pop();
      if (ge >= Dr) return;
      let Fs = $s ? $s.ignoreUnclosed : !1;
      switch (c = d.charCodeAt(ge), c) {
        case 10:
        case 32:
        case 9:
        case 13:
        case 12: {
          a = ge;
          do
            a += 1, c = d.charCodeAt(a);
          while (c === 32 || c === 10 || c === 9 || c === 13 || c === 12);
          H = ["space", d.slice(ge, a)], ge = a - 1;
          break;
        }
        case 91:
        case 93:
        case 123:
        case 125:
        case 58:
        case 59:
        case 41: {
          let ws = String.fromCharCode(c);
          H = [ws, ws, ge];
          break;
        }
        case 40: {
          if (C = gt.length ? gt.pop()[1] : "", _ = d.charCodeAt(ge + 1), C === "url" && _ !== 39 && _ !== 34 && _ !== 32 && _ !== 10 && _ !== 9 && _ !== 12 && _ !== 13) {
            a = ge;
            do {
              if (h = !1, a = d.indexOf(")", a + 1), a === -1) if (p || Fs) {
                a = ge;
                break;
              } else us("bracket");
              for (F = a; d.charCodeAt(F - 1) === 92; ) F -= 1, h = !h;
            } while (h);
            H = ["brackets", d.slice(ge, a + 1), ge, a], ge = a;
          } else a = d.indexOf(")", ge + 1), g = d.slice(ge, a + 1), a === -1 || u.test(g) ? H = ["(", "(", ge] : (H = ["brackets", g, ge, a], ge = a);
          break;
        }
        case 39:
        case 34: {
          m = c === 39 ? "'" : '"', a = ge;
          do {
            if (h = !1, a = d.indexOf(m, a + 1), a === -1) if (p || Fs) {
              a = ge + 1;
              break;
            } else us("string");
            for (F = a; d.charCodeAt(F - 1) === 92; ) F -= 1, h = !h;
          } while (h);
          H = ["string", d.slice(ge, a + 1), ge, a], ge = a;
          break;
        }
        case 64: {
          n.lastIndex = ge + 1, n.test(d), n.lastIndex === 0 ? a = d.length - 1 : a = n.lastIndex - 2, H = ["at-word", d.slice(ge, a + 1), ge, a], ge = a;
          break;
        }
        case 92: {
          for (a = ge, v = !0; d.charCodeAt(a + 1) === 92; ) a += 1, v = !v;
          if (c = d.charCodeAt(a + 1), v && c !== 47 && c !== 32 && c !== 10 && c !== 9 && c !== 13 && c !== 12 && (a += 1, o.test(d.charAt(a)))) {
            for (; o.test(d.charAt(a + 1)); ) a += 1;
            d.charCodeAt(a + 1) === 32 && (a += 1);
          }
          H = ["word", d.slice(ge, a + 1), ge, a], ge = a;
          break;
        }
        default: {
          c === 47 && d.charCodeAt(ge + 1) === 42 ? (a = d.indexOf("*/", ge + 2) + 1, a === 0 && (p || Fs ? a = d.length : us("comment")), H = ["comment", d.slice(ge, a + 1), ge, a], ge = a) : (i.lastIndex = ge + 1, i.test(d), i.lastIndex === 0 ? a = d.length - 1 : a = i.lastIndex - 2, H = ["word", d.slice(ge, a + 1), ge, a], gt.push(H), ge = a);
          break;
        }
      }
      return ge++, H;
    }
    function Cs($s) {
      yt.push($s);
    }
    return { back: Cs, endOfFile: ms, nextToken: ks, position: ns };
  };
}), Kt = y((e, t) => {
  var n = se(), i = class extends n {
    constructor(u) {
      super(u), this.type = "atrule";
    }
    append(...u) {
      return this.proxyOf.nodes || (this.nodes = []), super.append(...u);
    }
    prepend(...u) {
      return this.proxyOf.nodes || (this.nodes = []), super.prepend(...u);
    }
  };
  t.exports = i, i.default = i, n.registerAtRule(i);
}), Pe = y((e, t) => {
  var n = se(), i, u, o = class extends n {
    constructor(l) {
      super(l), this.type = "root", this.nodes || (this.nodes = []);
    }
    normalize(l, f, d) {
      let p = super.normalize(l);
      if (f) {
        if (d === "prepend") this.nodes.length > 1 ? f.raws.before = this.nodes[1].raws.before : delete f.raws.before;
        else if (this.first !== f) for (let c of p) c.raws.before = f.raws.before;
      }
      return p;
    }
    removeChild(l, f) {
      let d = this.index(l);
      return !f && d === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[d].raws.before), super.removeChild(l);
    }
    toResult(l = {}) {
      return new i(new u(), this, l).stringify();
    }
  };
  o.registerLazyResult = (l) => {
    i = l;
  }, o.registerProcessor = (l) => {
    u = l;
  }, t.exports = o, o.default = o, n.registerRoot(o);
}), fs = y((e, t) => {
  var n = { comma(i) {
    return n.split(i, [","], !0);
  }, space(i) {
    let u = [" ", `
`, "	"];
    return n.split(i, u);
  }, split(i, u, o) {
    let l = [], f = "", d = !1, p = 0, c = !1, a = "", m = !1;
    for (let g of i) m ? m = !1 : g === "\\" ? m = !0 : c ? g === a && (c = !1) : g === '"' || g === "'" ? (c = !0, a = g) : g === "(" ? p += 1 : g === ")" ? p > 0 && (p -= 1) : p === 0 && u.includes(g) && (d = !0), d ? (f !== "" && l.push(f.trim()), f = "", d = !1) : f += g;
    return (o || f !== "") && l.push(f.trim()), l;
  } };
  t.exports = n, n.default = n;
}), Qt = y((e, t) => {
  var n = se(), i = fs(), u = class extends n {
    constructor(o) {
      super(o), this.type = "rule", this.nodes || (this.nodes = []);
    }
    get selectors() {
      return i.comma(this.selector);
    }
    set selectors(o) {
      let l = this.selector ? this.selector.match(/,\s*/) : null, f = l ? l[0] : "," + this.raw("between", "beforeOpen");
      this.selector = o.join(f);
    }
  };
  t.exports = u, u.default = u, n.registerRule(u);
}), Jt = y((e, t) => {
  var n = ft(), i = Ht(), u = Ae(), o = Kt(), l = Pe(), f = Qt(), d = { empty: !0, space: !0 };
  function p(a) {
    for (let m = a.length - 1; m >= 0; m--) {
      let g = a[m], v = g[3] || g[2];
      if (v) return v;
    }
  }
  var c = class {
    constructor(a) {
      this.input = a, this.root = new l(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: a, start: { column: 1, line: 1, offset: 0 } };
    }
    atrule(a) {
      let m = new o();
      m.name = a[1].slice(1), m.name === "" && this.unnamedAtrule(m, a), this.init(m, a[2]);
      let g, v, h, F = !1, C = !1, _ = [], H = [];
      for (; !this.tokenizer.endOfFile(); ) {
        if (a = this.tokenizer.nextToken(), g = a[0], g === "(" || g === "[" ? H.push(g === "(" ? ")" : "]") : g === "{" && H.length > 0 ? H.push("}") : g === H[H.length - 1] && H.pop(), H.length === 0) if (g === ";") {
          m.source.end = this.getPosition(a[2]), m.source.end.offset++, this.semicolon = !0;
          break;
        } else if (g === "{") {
          C = !0;
          break;
        } else if (g === "}") {
          if (_.length > 0) {
            for (h = _.length - 1, v = _[h]; v && v[0] === "space"; ) v = _[--h];
            v && (m.source.end = this.getPosition(v[3] || v[2]), m.source.end.offset++);
          }
          this.end(a);
          break;
        } else _.push(a);
        else _.push(a);
        if (this.tokenizer.endOfFile()) {
          F = !0;
          break;
        }
      }
      m.raws.between = this.spacesAndCommentsFromEnd(_), _.length ? (m.raws.afterName = this.spacesAndCommentsFromStart(_), this.raw(m, "params", _), F && (a = _[_.length - 1], m.source.end = this.getPosition(a[3] || a[2]), m.source.end.offset++, this.spaces = m.raws.between, m.raws.between = "")) : (m.raws.afterName = "", m.params = ""), C && (m.nodes = [], this.current = m);
    }
    checkMissedSemicolon(a) {
      let m = this.colon(a);
      if (m === !1) return;
      let g = 0, v;
      for (let h = m - 1; h >= 0 && (v = a[h], !(v[0] !== "space" && (g += 1, g === 2))); h--) ;
      throw this.input.error("Missed semicolon", v[0] === "word" ? v[3] + 1 : v[2]);
    }
    colon(a) {
      let m = 0, g, v, h;
      for (let [F, C] of a.entries()) {
        if (g = C, v = g[0], v === "(" && (m += 1), v === ")" && (m -= 1), m === 0 && v === ":") if (!h) this.doubleColon(g);
        else {
          if (h[0] === "word" && h[1] === "progid") continue;
          return F;
        }
        h = g;
      }
      return !1;
    }
    comment(a) {
      let m = new u();
      this.init(m, a[2]), m.source.end = this.getPosition(a[3] || a[2]), m.source.end.offset++;
      let g = a[1].slice(2, -2);
      if (/^\s*$/.test(g)) m.text = "", m.raws.left = g, m.raws.right = "";
      else {
        let v = g.match(/^(\s*)([^]*\S)(\s*)$/);
        m.text = v[2], m.raws.left = v[1], m.raws.right = v[3];
      }
    }
    createTokenizer() {
      this.tokenizer = i(this.input);
    }
    decl(a, m) {
      let g = new n();
      this.init(g, a[0][2]);
      let v = a[a.length - 1];
      for (v[0] === ";" && (this.semicolon = !0, a.pop()), g.source.end = this.getPosition(v[3] || v[2] || p(a)), g.source.end.offset++; a[0][0] !== "word"; ) a.length === 1 && this.unknownWord(a), g.raws.before += a.shift()[1];
      for (g.source.start = this.getPosition(a[0][2]), g.prop = ""; a.length; ) {
        let _ = a[0][0];
        if (_ === ":" || _ === "space" || _ === "comment") break;
        g.prop += a.shift()[1];
      }
      g.raws.between = "";
      let h;
      for (; a.length; ) if (h = a.shift(), h[0] === ":") {
        g.raws.between += h[1];
        break;
      } else h[0] === "word" && /\w/.test(h[1]) && this.unknownWord([h]), g.raws.between += h[1];
      (g.prop[0] === "_" || g.prop[0] === "*") && (g.raws.before += g.prop[0], g.prop = g.prop.slice(1));
      let F = [], C;
      for (; a.length && (C = a[0][0], !(C !== "space" && C !== "comment")); ) F.push(a.shift());
      this.precheckMissedSemicolon(a);
      for (let _ = a.length - 1; _ >= 0; _--) {
        if (h = a[_], h[1].toLowerCase() === "!important") {
          g.important = !0;
          let H = this.stringFrom(a, _);
          H = this.spacesFromEnd(a) + H, H !== " !important" && (g.raws.important = H);
          break;
        } else if (h[1].toLowerCase() === "important") {
          let H = a.slice(0), Dr = "";
          for (let ge = _; ge > 0; ge--) {
            let gt = H[ge][0];
            if (Dr.trim().indexOf("!") === 0 && gt !== "space") break;
            Dr = H.pop()[1] + Dr;
          }
          Dr.trim().indexOf("!") === 0 && (g.important = !0, g.raws.important = Dr, a = H);
        }
        if (h[0] !== "space" && h[0] !== "comment") break;
      }
      a.some((_) => _[0] !== "space" && _[0] !== "comment") && (g.raws.between += F.map((_) => _[1]).join(""), F = []), this.raw(g, "value", F.concat(a), m), g.value.includes(":") && !m && this.checkMissedSemicolon(a);
    }
    doubleColon(a) {
      throw this.input.error("Double colon", { offset: a[2] }, { offset: a[2] + a[1].length });
    }
    emptyRule(a) {
      let m = new f();
      this.init(m, a[2]), m.selector = "", m.raws.between = "", this.current = m;
    }
    end(a) {
      this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(a[2]), this.current.source.end.offset++, this.current = this.current.parent) : this.unexpectedClose(a);
    }
    endFile() {
      this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.root.source.end = this.getPosition(this.tokenizer.position());
    }
    freeSemicolon(a) {
      if (this.spaces += a[1], this.current.nodes) {
        let m = this.current.nodes[this.current.nodes.length - 1];
        m && m.type === "rule" && !m.raws.ownSemicolon && (m.raws.ownSemicolon = this.spaces, this.spaces = "");
      }
    }
    getPosition(a) {
      let m = this.input.fromOffset(a);
      return { column: m.col, line: m.line, offset: a };
    }
    init(a, m) {
      this.current.push(a), a.source = { input: this.input, start: this.getPosition(m) }, a.raws.before = this.spaces, this.spaces = "", a.type !== "comment" && (this.semicolon = !1);
    }
    other(a) {
      let m = !1, g = null, v = !1, h = null, F = [], C = a[1].startsWith("--"), _ = [], H = a;
      for (; H; ) {
        if (g = H[0], _.push(H), g === "(" || g === "[") h || (h = H), F.push(g === "(" ? ")" : "]");
        else if (C && v && g === "{") h || (h = H), F.push("}");
        else if (F.length === 0) if (g === ";") if (v) {
          this.decl(_, C);
          return;
        } else break;
        else if (g === "{") {
          this.rule(_);
          return;
        } else if (g === "}") {
          this.tokenizer.back(_.pop()), m = !0;
          break;
        } else g === ":" && (v = !0);
        else g === F[F.length - 1] && (F.pop(), F.length === 0 && (h = null));
        H = this.tokenizer.nextToken();
      }
      if (this.tokenizer.endOfFile() && (m = !0), F.length > 0 && this.unclosedBracket(h), m && v) {
        if (!C) for (; _.length && (H = _[_.length - 1][0], !(H !== "space" && H !== "comment")); ) this.tokenizer.back(_.pop());
        this.decl(_, C);
      } else this.unknownWord(_);
    }
    parse() {
      let a;
      for (; !this.tokenizer.endOfFile(); ) switch (a = this.tokenizer.nextToken(), a[0]) {
        case "space":
          this.spaces += a[1];
          break;
        case ";":
          this.freeSemicolon(a);
          break;
        case "}":
          this.end(a);
          break;
        case "comment":
          this.comment(a);
          break;
        case "at-word":
          this.atrule(a);
          break;
        case "{":
          this.emptyRule(a);
          break;
        default:
          this.other(a);
          break;
      }
      this.endFile();
    }
    precheckMissedSemicolon() {
    }
    raw(a, m, g, v) {
      let h, F, C = g.length, _ = "", H = !0, Dr, ge;
      for (let gt = 0; gt < C; gt += 1) h = g[gt], F = h[0], F === "space" && gt === C - 1 && !v ? H = !1 : F === "comment" ? (ge = g[gt - 1] ? g[gt - 1][0] : "empty", Dr = g[gt + 1] ? g[gt + 1][0] : "empty", !d[ge] && !d[Dr] ? _.slice(-1) === "," ? H = !1 : _ += h[1] : H = !1) : _ += h[1];
      if (!H) {
        let gt = g.reduce((yt, ns) => yt + ns[1], "");
        a.raws[m] = { raw: gt, value: _ };
      }
      a[m] = _;
    }
    rule(a) {
      a.pop();
      let m = new f();
      this.init(m, a[0][2]), m.raws.between = this.spacesAndCommentsFromEnd(a), this.raw(m, "selector", a), this.current = m;
    }
    spacesAndCommentsFromEnd(a) {
      let m, g = "";
      for (; a.length && (m = a[a.length - 1][0], !(m !== "space" && m !== "comment")); ) g = a.pop()[1] + g;
      return g;
    }
    spacesAndCommentsFromStart(a) {
      let m, g = "";
      for (; a.length && (m = a[0][0], !(m !== "space" && m !== "comment")); ) g += a.shift()[1];
      return g;
    }
    spacesFromEnd(a) {
      let m, g = "";
      for (; a.length && (m = a[a.length - 1][0], m === "space"); ) g = a.pop()[1] + g;
      return g;
    }
    stringFrom(a, m) {
      let g = "";
      for (let v = m; v < a.length; v++) g += a[v][1];
      return a.splice(m, a.length - m), g;
    }
    unclosedBlock() {
      let a = this.current.source.start;
      throw this.input.error("Unclosed block", a.line, a.column);
    }
    unclosedBracket(a) {
      throw this.input.error("Unclosed bracket", { offset: a[2] }, { offset: a[2] + 1 });
    }
    unexpectedClose(a) {
      throw this.input.error("Unexpected }", { offset: a[2] }, { offset: a[2] + 1 });
    }
    unknownWord(a) {
      throw this.input.error("Unknown word", { offset: a[0][2] }, { offset: a[0][2] + a[0][1].length });
    }
    unnamedAtrule(a, m) {
      throw this.input.error("At-rule without name", { offset: m[2] }, { offset: m[2] + m[1].length });
    }
  };
  t.exports = c;
}), Qi = y(() => {
}), Xi = y((e, t) => {
  var n = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", i = (o, l = 21) => (f = l) => {
    let d = "", p = f;
    for (; p--; ) d += o[Math.random() * o.length | 0];
    return d;
  }, u = (o = 21) => {
    let l = "", f = o;
    for (; f--; ) l += n[Math.random() * 64 | 0];
    return l;
  };
  t.exports = { nanoid: u, customAlphabet: i };
}), hs = y((e, t) => {
  t.exports = class {
  };
}), qe = y((e, t) => {
  var { SourceMapConsumer: n, SourceMapGenerator: i } = Qi(), { fileURLToPath: u, pathToFileURL: o } = {}, { isAbsolute: l, resolve: f } = {}, { nanoid: d } = Xi(), p = os(), c = Yt(), a = hs(), m = Symbol("fromOffsetCache"), g = !!(n && i), v = !!(f && l), h = class {
    constructor(F, C = {}) {
      if (F === null || typeof F > "u" || typeof F == "object" && !F.toString) throw new Error(`PostCSS received ${F} instead of CSS string`);
      if (this.css = F.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, C.from && (!v || /^\w+:\/\//.test(C.from) || l(C.from) ? this.file = C.from : this.file = f(C.from)), v && g) {
        let _ = new a(this.css, C);
        if (_.text) {
          this.map = _;
          let H = _.consumer().file;
          !this.file && H && (this.file = this.mapResolve(H));
        }
      }
      this.file || (this.id = "<input css " + d(6) + ">"), this.map && (this.map.file = this.from);
    }
    error(F, C, _, H = {}) {
      let Dr, ge, gt;
      if (C && typeof C == "object") {
        let ns = C, us = _;
        if (typeof ns.offset == "number") {
          let ms = this.fromOffset(ns.offset);
          C = ms.line, _ = ms.col;
        } else C = ns.line, _ = ns.column;
        if (typeof us.offset == "number") {
          let ms = this.fromOffset(us.offset);
          ge = ms.line, gt = ms.col;
        } else ge = us.line, gt = us.column;
      } else if (!_) {
        let ns = this.fromOffset(C);
        C = ns.line, _ = ns.col;
      }
      let yt = this.origin(C, _, ge, gt);
      return yt ? Dr = new c(F, yt.endLine === void 0 ? yt.line : { column: yt.column, line: yt.line }, yt.endLine === void 0 ? yt.column : { column: yt.endColumn, line: yt.endLine }, yt.source, yt.file, H.plugin) : Dr = new c(F, ge === void 0 ? C : { column: _, line: C }, ge === void 0 ? _ : { column: gt, line: ge }, this.css, this.file, H.plugin), Dr.input = { column: _, endColumn: gt, endLine: ge, line: C, source: this.css }, this.file && (o && (Dr.input.url = o(this.file).toString()), Dr.input.file = this.file), Dr;
    }
    fromOffset(F) {
      let C, _;
      if (this[m]) _ = this[m];
      else {
        let Dr = this.css.split(`
`);
        _ = new Array(Dr.length);
        let ge = 0;
        for (let gt = 0, yt = Dr.length; gt < yt; gt++) _[gt] = ge, ge += Dr[gt].length + 1;
        this[m] = _;
      }
      C = _[_.length - 1];
      let H = 0;
      if (F >= C) H = _.length - 1;
      else {
        let Dr = _.length - 2, ge;
        for (; H < Dr; ) if (ge = H + (Dr - H >> 1), F < _[ge]) Dr = ge - 1;
        else if (F >= _[ge + 1]) H = ge + 1;
        else {
          H = ge;
          break;
        }
      }
      return { col: F - _[H] + 1, line: H + 1 };
    }
    mapResolve(F) {
      return /^\w+:\/\//.test(F) ? F : f(this.map.consumer().sourceRoot || this.map.root || ".", F);
    }
    origin(F, C, _, H) {
      if (!this.map) return !1;
      let Dr = this.map.consumer(), ge = Dr.originalPositionFor({ column: C, line: F });
      if (!ge.source) return !1;
      let gt;
      typeof _ == "number" && (gt = Dr.originalPositionFor({ column: H, line: _ }));
      let yt;
      l(ge.source) ? yt = o(ge.source) : yt = new URL(ge.source, this.map.consumer().sourceRoot || o(this.map.mapFile));
      let ns = { column: ge.column, endColumn: gt && gt.column, endLine: gt && gt.line, line: ge.line, url: yt.toString() };
      if (yt.protocol === "file:") if (u) ns.file = u(yt);
      else throw new Error("file: protocol is not available in this PostCSS build");
      let us = Dr.sourceContentFor(ge.source);
      return us && (ns.source = us), ns;
    }
    toJSON() {
      let F = {};
      for (let C of ["hasBOM", "css", "file", "id"]) this[C] != null && (F[C] = this[C]);
      return this.map && (F.map = { ...this.map }, F.map.consumerCache && (F.map.consumerCache = void 0)), F;
    }
    get from() {
      return this.file || this.id;
    }
  };
  t.exports = h, h.default = h, p && p.registerInput && p.registerInput(h);
}), dt = y((e, t) => {
  var n = se(), i = Jt(), u = qe();
  function o(l, f) {
    let d = new u(l, f), p = new i(d);
    try {
      p.parse();
    } catch (c) {
      throw c;
    }
    return p.root;
  }
  t.exports = o, o.default = o, n.registerParse(o);
}), io = y((e, t) => {
  var n = Ht(), i = qe();
  t.exports = { isInlineComment(u) {
    if (u[0] === "word" && u[1].slice(0, 2) === "//") {
      let o = u, l = [], f, d;
      for (; u; ) {
        if (/\r?\n/.test(u[1])) {
          if (/['"].*\r?\n/.test(u[1])) {
            l.push(u[1].substring(0, u[1].indexOf(`
`))), d = u[1].substring(u[1].indexOf(`
`));
            let c = this.input.css.valueOf().substring(this.tokenizer.position());
            d += c, f = u[3] + c.length - d.length;
          } else this.tokenizer.back(u);
          break;
        }
        l.push(u[1]), f = u[2], u = this.tokenizer.nextToken({ ignoreUnclosed: !0 });
      }
      let p = ["comment", l.join(""), o[2], f];
      return this.inlineComment(p), d && (this.input = new i(d), this.tokenizer = n(this.input)), !0;
    } else if (u[1] === "/") {
      let o = this.tokenizer.nextToken({ ignoreUnclosed: !0 });
      if (o[0] === "comment" && /^\/\*/.test(o[1])) return o[0] = "word", o[1] = o[1].slice(1), u[1] = "//", this.tokenizer.back(o), t.exports.isInlineComment.bind(this)(u);
    }
    return !1;
  } };
}), ao = y((e, t) => {
  t.exports = { interpolation(n) {
    let i = [n, this.tokenizer.nextToken()], u = ["word", "}"];
    if (i[0][1].length > 1 || i[1][0] !== "{") return this.tokenizer.back(i[1]), !1;
    for (n = this.tokenizer.nextToken(); n && u.includes(n[0]); ) i.push(n), n = this.tokenizer.nextToken();
    let o = i.map((p) => p[1]), [l] = i, f = i.pop(), d = ["word", o.join(""), l[2], f[2]];
    return this.tokenizer.back(n), this.tokenizer.back(d), !0;
  } };
}), lo = y((e, t) => {
  var n = /^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{3}$/, i = /\.[0-9]/, u = (o) => {
    let [, l] = o, [f] = l;
    return (f === "." || f === "#") && n.test(l) === !1 && i.test(l) === !1;
  };
  t.exports = { isMixinToken: u };
}), fo = y((e, t) => {
  var n = Ht(), i = /^url\((.+)\)/;
  t.exports = (u) => {
    let { name: o, params: l = "" } = u;
    if (o === "import" && l.length) {
      u.import = !0;
      let f = n({ css: l });
      for (u.filename = l.replace(i, "$1"); !f.endOfFile(); ) {
        let [d, p] = f.nextToken();
        if (d === "word" && p === "url") return;
        if (d === "brackets") {
          u.options = p, u.filename = l.replace(p, "").trim();
          break;
        }
      }
    }
  };
}), yo = y((e, t) => {
  var n = /:$/, i = /^:(\s+)?/;
  t.exports = (u) => {
    let { name: o, params: l = "" } = u;
    if (u.name.slice(-1) === ":") {
      if (n.test(o)) {
        let [f] = o.match(n);
        u.name = o.replace(f, ""), u.raws.afterName = f + (u.raws.afterName || ""), u.variable = !0, u.value = u.params;
      }
      if (i.test(l)) {
        let [f] = l.match(i);
        u.value = l.replace(f, ""), u.raws.afterName = (u.raws.afterName || "") + f, u.variable = !0;
      }
    }
  };
}), vo = y((e, t) => {
  var n = Ae(), i = Jt(), { isInlineComment: u } = io(), { interpolation: o } = ao(), { isMixinToken: l } = lo(), f = fo(), d = yo(), p = /(!\s*important)$/i;
  t.exports = class extends i {
    constructor(...c) {
      super(...c), this.lastNode = null;
    }
    atrule(c) {
      o.bind(this)(c) || (super.atrule(c), f(this.lastNode), d(this.lastNode));
    }
    decl(...c) {
      super.decl(...c), /extend\(.+\)/i.test(this.lastNode.value) && (this.lastNode.extend = !0);
    }
    each(c) {
      c[0][1] = ` ${c[0][1]}`;
      let a = c.findIndex((h) => h[0] === "("), m = c.reverse().find((h) => h[0] === ")"), g = c.reverse().indexOf(m), v = c.splice(a, g).map((h) => h[1]).join("");
      for (let h of c.reverse()) this.tokenizer.back(h);
      this.atrule(this.tokenizer.nextToken()), this.lastNode.function = !0, this.lastNode.params = v;
    }
    init(c, a, m) {
      super.init(c, a, m), this.lastNode = c;
    }
    inlineComment(c) {
      let a = new n(), m = c[1].slice(2);
      if (this.init(a, c[2]), a.source.end = this.getPosition(c[3] || c[2]), a.inline = !0, a.raws.begin = "//", /^\s*$/.test(m)) a.text = "", a.raws.left = m, a.raws.right = "";
      else {
        let g = m.match(/^(\s*)([^]*[^\s])(\s*)$/);
        [, a.raws.left, a.text, a.raws.right] = g;
      }
    }
    mixin(c) {
      let [a] = c, m = a[1].slice(0, 1), g = c.findIndex((_) => _[0] === "brackets"), v = c.findIndex((_) => _[0] === "("), h = "";
      if ((g < 0 || g > 3) && v > 0) {
        let _ = c.reduce((ks, Cs, $s) => Cs[0] === ")" ? $s : ks), H = c.slice(v, _ + v).map((ks) => ks[1]).join(""), [Dr] = c.slice(v), ge = [Dr[2], Dr[3]], [gt] = c.slice(_, _ + 1), yt = [gt[2], gt[3]], ns = ["brackets", H].concat(ge, yt), us = c.slice(0, v), ms = c.slice(_ + 1);
        c = us, c.push(ns), c = c.concat(ms);
      }
      let F = [];
      for (let _ of c) if ((_[1] === "!" || F.length) && F.push(_), _[1] === "important") break;
      if (F.length) {
        let [_] = F, H = c.indexOf(_), Dr = F[F.length - 1], ge = [_[2], _[3]], gt = [Dr[4], Dr[5]], yt = ["word", F.map((ns) => ns[1]).join("")].concat(ge, gt);
        c.splice(H, F.length, yt);
      }
      let C = c.findIndex((_) => p.test(_[1]));
      C > 0 && ([, h] = c[C], c.splice(C, 1));
      for (let _ of c.reverse()) this.tokenizer.back(_);
      this.atrule(this.tokenizer.nextToken()), this.lastNode.mixin = !0, this.lastNode.raws.identifier = m, h && (this.lastNode.important = !0, this.lastNode.raws.important = h);
    }
    other(c) {
      u.bind(this)(c) || super.other(c);
    }
    rule(c) {
      let a = c[c.length - 1], m = c[c.length - 2];
      if (m[0] === "at-word" && a[0] === "{" && (this.tokenizer.back(a), o.bind(this)(m))) {
        let g = this.tokenizer.nextToken();
        c = c.slice(0, c.length - 2).concat([g]);
        for (let v of c.reverse()) this.tokenizer.back(v);
        return;
      }
      super.rule(c), /:extend\(.+\)/i.test(this.lastNode.selector) && (this.lastNode.extend = !0);
    }
    unknownWord(c) {
      let [a] = c;
      if (c[0][1] === "each" && c[1][0] === "(") {
        this.each(c);
        return;
      }
      if (l(a)) {
        this.mixin(c);
        return;
      }
      super.unknownWord(c);
    }
  };
}), bo = y((e, t) => {
  var n = zt();
  t.exports = class extends n {
    atrule(i, u) {
      if (!i.mixin && !i.variable && !i.function) {
        super.atrule(i, u);
        return;
      }
      let o = `${i.function ? "" : i.raws.identifier || "@"}${i.name}`, l = i.params ? this.rawValue(i, "params") : "", f = i.raws.important || "";
      if (i.variable && (l = i.value), typeof i.raws.afterName < "u" ? o += i.raws.afterName : l && (o += " "), i.nodes) this.block(i, o + l + f);
      else {
        let d = (i.raws.between || "") + f + (u ? ";" : "");
        this.builder(o + l + d, i);
      }
    }
    comment(i) {
      if (i.inline) {
        let u = this.raw(i, "left", "commentLeft"), o = this.raw(i, "right", "commentRight");
        this.builder(`//${u}${i.text}${o}`, i);
      } else super.comment(i);
    }
  };
}), _o = y((e, t) => {
  var n = qe(), i = vo(), u = bo();
  t.exports = { parse(o, l) {
    let f = new n(o, l), d = new i(f);
    return d.parse(), d.root.walk((p) => {
      let c = f.css.lastIndexOf(p.source.input.css);
      if (c === 0) return;
      if (c + p.source.input.css.length !== f.css.length) throw new Error("Invalid state detected in postcss-less");
      let a = c + p.source.start.offset, m = f.fromOffset(c + p.source.start.offset);
      if (p.source.start = { offset: a, line: m.line, column: m.col }, p.source.end) {
        let g = c + p.source.end.offset, v = f.fromOffset(c + p.source.end.offset);
        p.source.end = { offset: g, line: v.line, column: v.col };
      }
    }), d.root;
  }, stringify(o, l) {
    new u(l).stringify(o);
  }, nodeToString(o) {
    let l = "";
    return t.exports.stringify(o, (f) => {
      l += f;
    }), l;
  } };
}), xs = y((e, t) => {
  t.exports = class {
    generate() {
    }
  };
}), er = y((e, t) => {
  var n = se(), i, u, o = class extends n {
    constructor(l) {
      super({ type: "document", ...l }), this.nodes || (this.nodes = []);
    }
    toResult(l = {}) {
      return new i(new u(), this, l).stringify();
    }
  };
  o.registerLazyResult = (l) => {
    i = l;
  }, o.registerProcessor = (l) => {
    u = l;
  }, t.exports = o, o.default = o;
}), bs = y((e, t) => {
  var n = {};
  t.exports = function(i) {
    n[i] || (n[i] = !0, typeof console < "u" && console.warn && console.warn(i));
  };
}), _s = y((e, t) => {
  var n = class {
    constructor(i, u = {}) {
      if (this.type = "warning", this.text = i, u.node && u.node.source) {
        let o = u.node.rangeBy(u);
        this.line = o.start.line, this.column = o.start.column, this.endLine = o.end.line, this.endColumn = o.end.column;
      }
      for (let o in u) this[o] = u[o];
    }
    toString() {
      return this.node ? this.node.error(this.text, { index: this.index, plugin: this.plugin, word: this.word }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
    }
  };
  t.exports = n, n.default = n;
}), tr = y((e, t) => {
  var n = _s(), i = class {
    constructor(u, o, l) {
      this.processor = u, this.messages = [], this.root = o, this.opts = l, this.css = void 0, this.map = void 0;
    }
    toString() {
      return this.css;
    }
    warn(u, o = {}) {
      o.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (o.plugin = this.lastPlugin.postcssPlugin);
      let l = new n(u, o);
      return this.messages.push(l), l;
    }
    warnings() {
      return this.messages.filter((u) => u.type === "warning");
    }
    get content() {
      return this.css;
    }
  };
  t.exports = i, i.default = i;
}), Ss = y((e, t) => {
  var { isClean: n, my: i } = Wt(), u = xs(), o = at(), l = se(), f = er();
  bs();
  var d = tr(), p = dt(), c = Pe(), a = { atrule: "AtRule", comment: "Comment", decl: "Declaration", document: "Document", root: "Root", rule: "Rule" }, m = { AtRule: !0, AtRuleExit: !0, Comment: !0, CommentExit: !0, Declaration: !0, DeclarationExit: !0, Document: !0, DocumentExit: !0, Once: !0, OnceExit: !0, postcssPlugin: !0, prepare: !0, Root: !0, RootExit: !0, Rule: !0, RuleExit: !0 }, g = { Once: !0, postcssPlugin: !0, prepare: !0 }, v = 0;
  function h(ge) {
    return typeof ge == "object" && typeof ge.then == "function";
  }
  function F(ge) {
    let gt = !1, yt = a[ge.type];
    return ge.type === "decl" ? gt = ge.prop.toLowerCase() : ge.type === "atrule" && (gt = ge.name.toLowerCase()), gt && ge.append ? [yt, yt + "-" + gt, v, yt + "Exit", yt + "Exit-" + gt] : gt ? [yt, yt + "-" + gt, yt + "Exit", yt + "Exit-" + gt] : ge.append ? [yt, v, yt + "Exit"] : [yt, yt + "Exit"];
  }
  function C(ge) {
    let gt;
    return ge.type === "document" ? gt = ["Document", v, "DocumentExit"] : ge.type === "root" ? gt = ["Root", v, "RootExit"] : gt = F(ge), { eventIndex: 0, events: gt, iterator: 0, node: ge, visitorIndex: 0, visitors: [] };
  }
  function _(ge) {
    return ge[n] = !1, ge.nodes && ge.nodes.forEach((gt) => _(gt)), ge;
  }
  var H = {}, Dr = class Gi {
    constructor(gt, yt, ns) {
      this.stringified = !1, this.processed = !1;
      let us;
      if (typeof yt == "object" && yt !== null && (yt.type === "root" || yt.type === "document")) us = _(yt);
      else if (yt instanceof Gi || yt instanceof d) us = _(yt.root), yt.map && (typeof ns.map > "u" && (ns.map = {}), ns.map.inline || (ns.map.inline = !1), ns.map.prev = yt.map);
      else {
        let ms = p;
        ns.syntax && (ms = ns.syntax.parse), ns.parser && (ms = ns.parser), ms.parse && (ms = ms.parse);
        try {
          us = ms(yt, ns);
        } catch (ks) {
          this.processed = !0, this.error = ks;
        }
        us && !us[i] && l.rebuild(us);
      }
      this.result = new d(gt, us, ns), this.helpers = { ...H, postcss: H, result: this.result }, this.plugins = this.processor.plugins.map((ms) => typeof ms == "object" && ms.prepare ? { ...ms, ...ms.prepare(this.result) } : ms);
    }
    async() {
      return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
    }
    catch(gt) {
      return this.async().catch(gt);
    }
    finally(gt) {
      return this.async().then(gt, gt);
    }
    getAsyncError() {
      throw new Error("Use process(css).then(cb) to work with async plugins");
    }
    handleError(gt, yt) {
      let ns = this.result.lastPlugin;
      try {
        yt && yt.addToError(gt), this.error = gt, gt.name === "CssSyntaxError" && !gt.plugin ? (gt.plugin = ns.postcssPlugin, gt.setMessage()) : ns.postcssVersion;
      } catch (us) {
        console && console.error && console.error(us);
      }
      return gt;
    }
    prepareVisitors() {
      this.listeners = {};
      let gt = (yt, ns, us) => {
        this.listeners[ns] || (this.listeners[ns] = []), this.listeners[ns].push([yt, us]);
      };
      for (let yt of this.plugins) if (typeof yt == "object") for (let ns in yt) {
        if (!m[ns] && /^[A-Z]/.test(ns)) throw new Error(`Unknown event ${ns} in ${yt.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
        if (!g[ns]) if (typeof yt[ns] == "object") for (let us in yt[ns]) us === "*" ? gt(yt, ns, yt[ns][us]) : gt(yt, ns + "-" + us.toLowerCase(), yt[ns][us]);
        else typeof yt[ns] == "function" && gt(yt, ns, yt[ns]);
      }
      this.hasListener = Object.keys(this.listeners).length > 0;
    }
    async runAsync() {
      this.plugin = 0;
      for (let gt = 0; gt < this.plugins.length; gt++) {
        let yt = this.plugins[gt], ns = this.runOnRoot(yt);
        if (h(ns)) try {
          await ns;
        } catch (us) {
          throw this.handleError(us);
        }
      }
      if (this.prepareVisitors(), this.hasListener) {
        let gt = this.result.root;
        for (; !gt[n]; ) {
          gt[n] = !0;
          let yt = [C(gt)];
          for (; yt.length > 0; ) {
            let ns = this.visitTick(yt);
            if (h(ns)) try {
              await ns;
            } catch (us) {
              let ms = yt[yt.length - 1].node;
              throw this.handleError(us, ms);
            }
          }
        }
        if (this.listeners.OnceExit) for (let [yt, ns] of this.listeners.OnceExit) {
          this.result.lastPlugin = yt;
          try {
            if (gt.type === "document") {
              let us = gt.nodes.map((ms) => ns(ms, this.helpers));
              await Promise.all(us);
            } else await ns(gt, this.helpers);
          } catch (us) {
            throw this.handleError(us);
          }
        }
      }
      return this.processed = !0, this.stringify();
    }
    runOnRoot(gt) {
      this.result.lastPlugin = gt;
      try {
        if (typeof gt == "object" && gt.Once) {
          if (this.result.root.type === "document") {
            let yt = this.result.root.nodes.map((ns) => gt.Once(ns, this.helpers));
            return h(yt[0]) ? Promise.all(yt) : yt;
          }
          return gt.Once(this.result.root, this.helpers);
        } else if (typeof gt == "function") return gt(this.result.root, this.result);
      } catch (yt) {
        throw this.handleError(yt);
      }
    }
    stringify() {
      if (this.error) throw this.error;
      if (this.stringified) return this.result;
      this.stringified = !0, this.sync();
      let gt = this.result.opts, yt = o;
      gt.syntax && (yt = gt.syntax.stringify), gt.stringifier && (yt = gt.stringifier), yt.stringify && (yt = yt.stringify);
      let ns = new u(yt, this.result.root, this.result.opts).generate();
      return this.result.css = ns[0], this.result.map = ns[1], this.result;
    }
    sync() {
      if (this.error) throw this.error;
      if (this.processed) return this.result;
      if (this.processed = !0, this.processing) throw this.getAsyncError();
      for (let gt of this.plugins) {
        let yt = this.runOnRoot(gt);
        if (h(yt)) throw this.getAsyncError();
      }
      if (this.prepareVisitors(), this.hasListener) {
        let gt = this.result.root;
        for (; !gt[n]; ) gt[n] = !0, this.walkSync(gt);
        if (this.listeners.OnceExit) if (gt.type === "document") for (let yt of gt.nodes) this.visitSync(this.listeners.OnceExit, yt);
        else this.visitSync(this.listeners.OnceExit, gt);
      }
      return this.result;
    }
    then(gt, yt) {
      return this.async().then(gt, yt);
    }
    toString() {
      return this.css;
    }
    visitSync(gt, yt) {
      for (let [ns, us] of gt) {
        this.result.lastPlugin = ns;
        let ms;
        try {
          ms = us(yt, this.helpers);
        } catch (ks) {
          throw this.handleError(ks, yt.proxyOf);
        }
        if (yt.type !== "root" && yt.type !== "document" && !yt.parent) return !0;
        if (h(ms)) throw this.getAsyncError();
      }
    }
    visitTick(gt) {
      let yt = gt[gt.length - 1], { node: ns, visitors: us } = yt;
      if (ns.type !== "root" && ns.type !== "document" && !ns.parent) {
        gt.pop();
        return;
      }
      if (us.length > 0 && yt.visitorIndex < us.length) {
        let [ks, Cs] = us[yt.visitorIndex];
        yt.visitorIndex += 1, yt.visitorIndex === us.length && (yt.visitors = [], yt.visitorIndex = 0), this.result.lastPlugin = ks;
        try {
          return Cs(ns.toProxy(), this.helpers);
        } catch ($s) {
          throw this.handleError($s, ns);
        }
      }
      if (yt.iterator !== 0) {
        let ks = yt.iterator, Cs;
        for (; Cs = ns.nodes[ns.indexes[ks]]; ) if (ns.indexes[ks] += 1, !Cs[n]) {
          Cs[n] = !0, gt.push(C(Cs));
          return;
        }
        yt.iterator = 0, delete ns.indexes[ks];
      }
      let ms = yt.events;
      for (; yt.eventIndex < ms.length; ) {
        let ks = ms[yt.eventIndex];
        if (yt.eventIndex += 1, ks === v) {
          ns.nodes && ns.nodes.length && (ns[n] = !0, yt.iterator = ns.getIterator());
          return;
        } else if (this.listeners[ks]) {
          yt.visitors = this.listeners[ks];
          return;
        }
      }
      gt.pop();
    }
    walkSync(gt) {
      gt[n] = !0;
      let yt = F(gt);
      for (let ns of yt) if (ns === v) gt.nodes && gt.each((us) => {
        us[n] || this.walkSync(us);
      });
      else {
        let us = this.listeners[ns];
        if (us && this.visitSync(us, gt.toProxy())) return;
      }
    }
    warnings() {
      return this.sync().warnings();
    }
    get content() {
      return this.stringify().content;
    }
    get css() {
      return this.stringify().css;
    }
    get map() {
      return this.stringify().map;
    }
    get messages() {
      return this.sync().messages;
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      return this.sync().root;
    }
    get [Symbol.toStringTag]() {
      return "LazyResult";
    }
  };
  Dr.registerPostcss = (ge) => {
    H = ge;
  }, t.exports = Dr, Dr.default = Dr, c.registerLazyResult(Dr), f.registerLazyResult(Dr);
}), Do = y((e, t) => {
  var n = xs(), i = at();
  bs();
  var u = dt(), o = tr(), l = class {
    constructor(f, d, p) {
      d = d.toString(), this.stringified = !1, this._processor = f, this._css = d, this._opts = p, this._map = void 0;
      let c, a = i;
      this.result = new o(this._processor, c, this._opts), this.result.css = d;
      let m = this;
      Object.defineProperty(this.result, "root", { get() {
        return m.root;
      } });
      let g = new n(a, c, this._opts, d);
      if (g.isMap()) {
        let [v, h] = g.generate();
        v && (this.result.css = v), h && (this.result.map = h);
      } else g.clearAnnotation(), this.result.css = g.css;
    }
    async() {
      return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
    }
    catch(f) {
      return this.async().catch(f);
    }
    finally(f) {
      return this.async().then(f, f);
    }
    sync() {
      if (this.error) throw this.error;
      return this.result;
    }
    then(f, d) {
      return this.async().then(f, d);
    }
    toString() {
      return this._css;
    }
    warnings() {
      return [];
    }
    get content() {
      return this.result.css;
    }
    get css() {
      return this.result.css;
    }
    get map() {
      return this.result.map;
    }
    get messages() {
      return [];
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      if (this._root) return this._root;
      let f, d = u;
      try {
        f = d(this._css, this._opts);
      } catch (p) {
        this.error = p;
      }
      if (this.error) throw this.error;
      return this._root = f, f;
    }
    get [Symbol.toStringTag]() {
      return "NoWorkResult";
    }
  };
  t.exports = l, l.default = l;
}), Bo = y((e, t) => {
  var n = Do(), i = Ss(), u = er(), o = Pe(), l = class {
    constructor(f = []) {
      this.version = "8.4.38", this.plugins = this.normalize(f);
    }
    normalize(f) {
      let d = [];
      for (let p of f) if (p.postcss === !0 ? p = p() : p.postcss && (p = p.postcss), typeof p == "object" && Array.isArray(p.plugins)) d = d.concat(p.plugins);
      else if (typeof p == "object" && p.postcssPlugin) d.push(p);
      else if (typeof p == "function") d.push(p);
      else if (!(typeof p == "object" && (p.parse || p.stringify))) throw new Error(p + " is not a PostCSS plugin");
      return d;
    }
    process(f, d = {}) {
      return !this.plugins.length && !d.parser && !d.stringifier && !d.syntax ? new n(this, f, d) : new i(this, f, d);
    }
    use(f) {
      return this.plugins = this.plugins.concat(this.normalize([f])), this;
    }
  };
  t.exports = l, l.default = l, o.registerProcessor(l), u.registerProcessor(l);
}), Fo = y((e, t) => {
  var n = ft(), i = hs(), u = Ae(), o = Kt(), l = qe(), f = Pe(), d = Qt();
  function p(c, a) {
    if (Array.isArray(c)) return c.map((v) => p(v));
    let { inputs: m, ...g } = c;
    if (m) {
      a = [];
      for (let v of m) {
        let h = { ...v, __proto__: l.prototype };
        h.map && (h.map = { ...h.map, __proto__: i.prototype }), a.push(h);
      }
    }
    if (g.nodes && (g.nodes = c.nodes.map((v) => p(v, a))), g.source) {
      let { inputId: v, ...h } = g.source;
      g.source = h, v != null && (g.source.input = a[v]);
    }
    if (g.type === "root") return new f(g);
    if (g.type === "decl") return new n(g);
    if (g.type === "rule") return new d(g);
    if (g.type === "comment") return new u(g);
    if (g.type === "atrule") return new o(g);
    throw new Error("Unknown node type: " + c.type);
  }
  t.exports = p, p.default = p;
}), rr = y((e, t) => {
  var n = Yt(), i = ft(), u = Ss(), o = se(), l = Bo(), f = at(), d = Fo(), p = er(), c = _s(), a = Ae(), m = Kt(), g = tr(), v = qe(), h = dt(), F = fs(), C = Qt(), _ = Pe(), H = lt();
  function Dr(...ge) {
    return ge.length === 1 && Array.isArray(ge[0]) && (ge = ge[0]), new l(ge);
  }
  Dr.plugin = function(ge, gt) {
    let yt = !1;
    function ns(...ms) {
      console && console.warn && !yt && (yt = !0, console.warn(ge + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`));
      let ks = gt(...ms);
      return ks.postcssPlugin = ge, ks.postcssVersion = new l().version, ks;
    }
    let us;
    return Object.defineProperty(ns, "postcss", { get() {
      return us || (us = ns()), us;
    } }), ns.process = function(ms, ks, Cs) {
      return Dr([ns(Cs)]).process(ms, ks);
    }, ns;
  }, Dr.stringify = f, Dr.parse = h, Dr.fromJSON = d, Dr.list = F, Dr.comment = (ge) => new a(ge), Dr.atRule = (ge) => new m(ge), Dr.decl = (ge) => new i(ge), Dr.rule = (ge) => new C(ge), Dr.root = (ge) => new _(ge), Dr.document = (ge) => new p(ge), Dr.CssSyntaxError = n, Dr.Declaration = i, Dr.Container = o, Dr.Processor = l, Dr.Document = p, Dr.Comment = a, Dr.Warning = c, Dr.AtRule = m, Dr.Result = g, Dr.Input = v, Dr.Rule = C, Dr.Root = _, Dr.Node = H, u.registerPostcss(Dr), t.exports = Dr, Dr.default = Dr;
}), Ko = y((e, t) => {
  var { Container: n } = rr(), i = class extends n {
    constructor(u) {
      super(u), this.type = "decl", this.isNested = !0, this.nodes || (this.nodes = []);
    }
  };
  t.exports = i;
}), Xo = y((e, t) => {
  var n = /[\t\n\f\r "#'()/;[\\\]{}]/g, i = /[,\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, u = /.[\r\n"'(/\\]/, o = /[\da-f]/i, l = /[\n\f\r]/g;
  t.exports = function(f, d = {}) {
    let p = f.css.valueOf(), c = d.ignoreErrors, a, m, g, v, h, F, C, _, H, Dr = p.length, ge = 0, gt = [], yt = [], ns;
    function us() {
      return ge;
    }
    function ms(ws) {
      throw f.error("Unclosed " + ws, ge);
    }
    function ks() {
      return yt.length === 0 && ge >= Dr;
    }
    function Cs() {
      let ws = 1, vs = !1, Is = !1;
      for (; ws > 0; ) m += 1, p.length <= m && ms("interpolation"), a = p.charCodeAt(m), _ = p.charCodeAt(m + 1), vs ? !Is && a === vs ? (vs = !1, Is = !1) : a === 92 ? Is = !Is : Is && (Is = !1) : a === 39 || a === 34 ? vs = a : a === 125 ? ws -= 1 : a === 35 && _ === 123 && (ws += 1);
    }
    function $s(ws) {
      if (yt.length) return yt.pop();
      if (ge >= Dr) return;
      let vs = ws ? ws.ignoreUnclosed : !1;
      switch (a = p.charCodeAt(ge), a) {
        case 10:
        case 32:
        case 9:
        case 13:
        case 12: {
          m = ge;
          do
            m += 1, a = p.charCodeAt(m);
          while (a === 32 || a === 10 || a === 9 || a === 13 || a === 12);
          H = ["space", p.slice(ge, m)], ge = m - 1;
          break;
        }
        case 91:
        case 93:
        case 123:
        case 125:
        case 58:
        case 59:
        case 41: {
          let Is = String.fromCharCode(a);
          H = [Is, Is, ge];
          break;
        }
        case 44: {
          H = ["word", ",", ge, ge + 1];
          break;
        }
        case 40: {
          if (C = gt.length ? gt.pop()[1] : "", _ = p.charCodeAt(ge + 1), C === "url" && _ !== 39 && _ !== 34) {
            for (ns = 1, F = !1, m = ge + 1; m <= p.length - 1; ) {
              if (_ = p.charCodeAt(m), _ === 92) F = !F;
              else if (_ === 40) ns += 1;
              else if (_ === 41 && (ns -= 1, ns === 0)) break;
              m += 1;
            }
            v = p.slice(ge, m + 1), H = ["brackets", v, ge, m], ge = m;
          } else m = p.indexOf(")", ge + 1), v = p.slice(ge, m + 1), m === -1 || u.test(v) ? H = ["(", "(", ge] : (H = ["brackets", v, ge, m], ge = m);
          break;
        }
        case 39:
        case 34: {
          for (g = a, m = ge, F = !1; m < Dr && (m++, m === Dr && ms("string"), a = p.charCodeAt(m), _ = p.charCodeAt(m + 1), !(!F && a === g)); ) a === 92 ? F = !F : F ? F = !1 : a === 35 && _ === 123 && Cs();
          H = ["string", p.slice(ge, m + 1), ge, m], ge = m;
          break;
        }
        case 64: {
          n.lastIndex = ge + 1, n.test(p), n.lastIndex === 0 ? m = p.length - 1 : m = n.lastIndex - 2, H = ["at-word", p.slice(ge, m + 1), ge, m], ge = m;
          break;
        }
        case 92: {
          for (m = ge, h = !0; p.charCodeAt(m + 1) === 92; ) m += 1, h = !h;
          if (a = p.charCodeAt(m + 1), h && a !== 47 && a !== 32 && a !== 10 && a !== 9 && a !== 13 && a !== 12 && (m += 1, o.test(p.charAt(m)))) {
            for (; o.test(p.charAt(m + 1)); ) m += 1;
            p.charCodeAt(m + 1) === 32 && (m += 1);
          }
          H = ["word", p.slice(ge, m + 1), ge, m], ge = m;
          break;
        }
        default:
          _ = p.charCodeAt(ge + 1), a === 35 && _ === 123 ? (m = ge, Cs(), v = p.slice(ge, m + 1), H = ["word", v, ge, m], ge = m) : a === 47 && _ === 42 ? (m = p.indexOf("*/", ge + 2) + 1, m === 0 && (c || vs ? m = p.length : ms("comment")), H = ["comment", p.slice(ge, m + 1), ge, m], ge = m) : a === 47 && _ === 47 ? (l.lastIndex = ge + 1, l.test(p), l.lastIndex === 0 ? m = p.length - 1 : m = l.lastIndex - 2, v = p.slice(ge, m + 1), H = ["comment", v, ge, m, "inline"], ge = m) : (i.lastIndex = ge + 1, i.test(p), i.lastIndex === 0 ? m = p.length - 1 : m = i.lastIndex - 2, H = ["word", p.slice(ge, m + 1), ge, m], gt.push(H), ge = m);
          break;
      }
      return ge++, H;
    }
    function Fs(ws) {
      yt.push(ws);
    }
    return { back: Fs, endOfFile: ks, nextToken: $s, position: us };
  };
}), ea = y((e, t) => {
  var { Comment: n } = rr(), i = Jt(), u = Ko(), o = Xo(), l = class extends i {
    atrule(f) {
      let d = f[1], p = f;
      for (; !this.tokenizer.endOfFile(); ) {
        let c = this.tokenizer.nextToken();
        if (c[0] === "word" && c[2] === p[3] + 1) d += c[1], p = c;
        else {
          this.tokenizer.back(c);
          break;
        }
      }
      super.atrule(["at-word", d, f[2], p[3]]);
    }
    comment(f) {
      if (f[4] === "inline") {
        let d = new n();
        this.init(d, f[2]), d.raws.inline = !0;
        let p = this.input.fromOffset(f[3]);
        d.source.end = { column: p.col, line: p.line, offset: f[3] + 1 };
        let c = f[1].slice(2);
        if (/^\s*$/.test(c)) d.text = "", d.raws.left = c, d.raws.right = "";
        else {
          let a = c.match(/^(\s*)([^]*\S)(\s*)$/), m = a[2].replace(/(\*\/|\/\*)/g, "*//*");
          d.text = m, d.raws.left = a[1], d.raws.right = a[3], d.raws.text = a[2];
        }
      } else super.comment(f);
    }
    createTokenizer() {
      this.tokenizer = o(this.input);
    }
    raw(f, d, p, c) {
      if (super.raw(f, d, p, c), f.raws[d]) {
        let a = f.raws[d].raw;
        f.raws[d].raw = p.reduce((m, g) => {
          if (g[0] === "comment" && g[4] === "inline") {
            let v = g[1].slice(2).replace(/(\*\/|\/\*)/g, "*//*");
            return m + "/*" + v + "*/";
          } else return m + g[1];
        }, ""), a !== f.raws[d].raw && (f.raws[d].scss = a);
      }
    }
    rule(f) {
      let d = !1, p = 0, c = "";
      for (let a of f) if (d) a[0] !== "comment" && a[0] !== "{" && (c += a[1]);
      else {
        if (a[0] === "space" && a[1].includes(`
`)) break;
        a[0] === "(" ? p += 1 : a[0] === ")" ? p -= 1 : p === 0 && a[0] === ":" && (d = !0);
      }
      if (!d || c.trim() === "" || /^[#:A-Za-z-]/.test(c)) super.rule(f);
      else {
        f.pop();
        let a = new u();
        this.init(a, f[0][2]);
        let m;
        for (let v = f.length - 1; v >= 0; v--) if (f[v][0] !== "space") {
          m = f[v];
          break;
        }
        if (m[3]) {
          let v = this.input.fromOffset(m[3]);
          a.source.end = { column: v.col, line: v.line, offset: m[3] + 1 };
        } else {
          let v = this.input.fromOffset(m[2]);
          a.source.end = { column: v.col, line: v.line, offset: m[2] + 1 };
        }
        for (; f[0][0] !== "word"; ) a.raws.before += f.shift()[1];
        if (f[0][2]) {
          let v = this.input.fromOffset(f[0][2]);
          a.source.start = { column: v.col, line: v.line, offset: f[0][2] };
        }
        for (a.prop = ""; f.length; ) {
          let v = f[0][0];
          if (v === ":" || v === "space" || v === "comment") break;
          a.prop += f.shift()[1];
        }
        a.raws.between = "";
        let g;
        for (; f.length; ) if (g = f.shift(), g[0] === ":") {
          a.raws.between += g[1];
          break;
        } else a.raws.between += g[1];
        (a.prop[0] === "_" || a.prop[0] === "*") && (a.raws.before += a.prop[0], a.prop = a.prop.slice(1)), a.raws.between += this.spacesAndCommentsFromStart(f), this.precheckMissedSemicolon(f);
        for (let v = f.length - 1; v > 0; v--) {
          if (g = f[v], g[1] === "!important") {
            a.important = !0;
            let h = this.stringFrom(f, v);
            h = this.spacesFromEnd(f) + h, h !== " !important" && (a.raws.important = h);
            break;
          } else if (g[1] === "important") {
            let h = f.slice(0), F = "";
            for (let C = v; C > 0; C--) {
              let _ = h[C][0];
              if (F.trim().indexOf("!") === 0 && _ !== "space") break;
              F = h.pop()[1] + F;
            }
            F.trim().indexOf("!") === 0 && (a.important = !0, a.raws.important = F, f = h);
          }
          if (g[0] !== "space" && g[0] !== "comment") break;
        }
        this.raw(a, "value", f), a.value.includes(":") && this.checkMissedSemicolon(f), this.current = a;
      }
    }
  };
  t.exports = l;
}), ra = y((e, t) => {
  var { Input: n } = rr(), i = ea();
  t.exports = function(u, o) {
    let l = new n(u, o), f = new i(l);
    return f.parse(), f.root;
  };
}), Ns = y((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 });
  function t(n) {
    this.after = n.after, this.before = n.before, this.type = n.type, this.value = n.value, this.sourceIndex = n.sourceIndex;
  }
  e.default = t;
}), Rs = y((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 });
  var t = Ns(), n = i(t);
  function i(o) {
    return o && o.__esModule ? o : { default: o };
  }
  function u(o) {
    var l = this;
    this.constructor(o), this.nodes = o.nodes, this.after === void 0 && (this.after = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1].after : ""), this.before === void 0 && (this.before = this.nodes.length > 0 ? this.nodes[0].before : ""), this.sourceIndex === void 0 && (this.sourceIndex = this.before.length), this.nodes.forEach(function(f) {
      f.parent = l;
    });
  }
  u.prototype = Object.create(n.default.prototype), u.constructor = n.default, u.prototype.walk = function(o, l) {
    for (var f = typeof o == "string" || o instanceof RegExp, d = f ? l : o, p = typeof o == "string" ? new RegExp(o) : o, c = 0; c < this.nodes.length; c++) {
      var a = this.nodes[c], m = f ? p.test(a.type) : !0;
      if (m && d && d(a, c, this.nodes) === !1 || a.nodes && a.walk(o, l) === !1) return !1;
    }
    return !0;
  }, u.prototype.each = function() {
    for (var o = arguments.length <= 0 || arguments[0] === void 0 ? function() {
    } : arguments[0], l = 0; l < this.nodes.length; l++) {
      var f = this.nodes[l];
      if (o(f, l, this.nodes) === !1) return !1;
    }
    return !0;
  }, e.default = u;
}), ua = y((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.parseMediaFeature = l, e.parseMediaQuery = f, e.parseMediaList = d;
  var t = Ns(), n = o(t), i = Rs(), u = o(i);
  function o(p) {
    return p && p.__esModule ? p : { default: p };
  }
  function l(p) {
    var c = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1], a = [{ mode: "normal", character: null }], m = [], g = 0, v = "", h = null, F = null, C = c, _ = p;
    p[0] === "(" && p[p.length - 1] === ")" && (_ = p.substring(1, p.length - 1), C++);
    for (var H = 0; H < _.length; H++) {
      var Dr = _[H];
      if ((Dr === "'" || Dr === '"') && (a[g].isCalculationEnabled === !0 ? (a.push({ mode: "string", isCalculationEnabled: !1, character: Dr }), g++) : a[g].mode === "string" && a[g].character === Dr && _[H - 1] !== "\\" && (a.pop(), g--)), Dr === "{" ? (a.push({ mode: "interpolation", isCalculationEnabled: !0 }), g++) : Dr === "}" && (a.pop(), g--), a[g].mode === "normal" && Dr === ":") {
        var ge = _.substring(H + 1);
        F = { type: "value", before: /^(\s*)/.exec(ge)[1], after: /(\s*)$/.exec(ge)[1], value: ge.trim() }, F.sourceIndex = F.before.length + H + 1 + C, h = { type: "colon", sourceIndex: H + C, after: F.before, value: ":" };
        break;
      }
      v += Dr;
    }
    return v = { type: "media-feature", before: /^(\s*)/.exec(v)[1], after: /(\s*)$/.exec(v)[1], value: v.trim() }, v.sourceIndex = v.before.length + C, m.push(v), h !== null && (h.before = v.after, m.push(h)), F !== null && m.push(F), m;
  }
  function f(p) {
    var c = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1], a = [], m = 0, g = !1, v = void 0;
    function h() {
      return { before: "", after: "", value: "" };
    }
    v = h();
    for (var F = 0; F < p.length; F++) {
      var C = p[F];
      g ? (v.value += C, (C === "{" || C === "(") && m++, (C === ")" || C === "}") && m--) : C.search(/\s/) !== -1 ? v.before += C : (C === "(" && (v.type = "media-feature-expression", m++), v.value = C, v.sourceIndex = c + F, g = !0), g && m === 0 && (C === ")" || F === p.length - 1 || p[F + 1].search(/\s/) !== -1) && (["not", "only", "and"].indexOf(v.value) !== -1 && (v.type = "keyword"), v.type === "media-feature-expression" && (v.nodes = l(v.value, v.sourceIndex)), a.push(Array.isArray(v.nodes) ? new u.default(v) : new n.default(v)), v = h(), g = !1);
    }
    for (var _ = 0; _ < a.length; _++) if (v = a[_], _ > 0 && (a[_ - 1].after = v.before), v.type === void 0) {
      if (_ > 0) {
        if (a[_ - 1].type === "media-feature-expression") {
          v.type = "keyword";
          continue;
        }
        if (a[_ - 1].value === "not" || a[_ - 1].value === "only") {
          v.type = "media-type";
          continue;
        }
        if (a[_ - 1].value === "and") {
          v.type = "media-feature-expression";
          continue;
        }
        a[_ - 1].type === "media-type" && (a[_ + 1] ? v.type = a[_ + 1].type === "media-feature-expression" ? "keyword" : "media-feature-expression" : v.type = "media-feature-expression");
      }
      if (_ === 0) {
        if (!a[_ + 1]) {
          v.type = "media-type";
          continue;
        }
        if (a[_ + 1] && (a[_ + 1].type === "media-feature-expression" || a[_ + 1].type === "keyword")) {
          v.type = "media-type";
          continue;
        }
        if (a[_ + 2]) {
          if (a[_ + 2].type === "media-feature-expression") {
            v.type = "media-type", a[_ + 1].type = "keyword";
            continue;
          }
          if (a[_ + 2].type === "keyword") {
            v.type = "keyword", a[_ + 1].type = "media-type";
            continue;
          }
        }
        if (a[_ + 3] && a[_ + 3].type === "media-feature-expression") {
          v.type = "keyword", a[_ + 1].type = "media-type", a[_ + 2].type = "keyword";
          continue;
        }
      }
    }
    return a;
  }
  function d(p) {
    var c = [], a = 0, m = 0, g = /^(\s*)url\s*\(/.exec(p);
    if (g !== null) {
      for (var v = g[0].length, h = 1; h > 0; ) {
        var F = p[v];
        F === "(" && h++, F === ")" && h--, v++;
      }
      c.unshift(new n.default({ type: "url", value: p.substring(0, v).trim(), sourceIndex: g[1].length, before: g[1], after: /^(\s*)/.exec(p.substring(v))[1] })), a = v;
    }
    for (var C = a; C < p.length; C++) {
      var _ = p[C];
      if (_ === "(" && m++, _ === ")" && m--, m === 0 && _ === ",") {
        var H = p.substring(a, C), Dr = /^(\s*)/.exec(H)[1];
        c.push(new u.default({ type: "media-query", value: H.trim(), sourceIndex: a + Dr.length, nodes: f(H, a), before: Dr, after: /(\s*)$/.exec(H)[1] })), a = C + 1;
      }
    }
    var ge = p.substring(a), gt = /^(\s*)/.exec(ge)[1];
    return c.push(new u.default({ type: "media-query", value: ge.trim(), sourceIndex: a + gt.length, nodes: f(ge, a), before: gt, after: /(\s*)$/.exec(ge)[1] })), c;
  }
}), la = y((e) => {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.default = o;
  var t = Rs(), n = u(t), i = ua();
  function u(l) {
    return l && l.__esModule ? l : { default: l };
  }
  function o(l) {
    return new n.default({ nodes: (0, i.parseMediaList)(l), type: "media-query-list", value: l.trim() });
  }
}), Ms = y((e, t) => {
  t.exports = function(n, i) {
    if (i = typeof i == "number" ? i : 1 / 0, !i) return Array.isArray(n) ? n.map(function(o) {
      return o;
    }) : n;
    return u(n, 1);
    function u(o, l) {
      return o.reduce(function(f, d) {
        return Array.isArray(d) && l < i ? f.concat(u(d, l + 1)) : f.concat(d);
      }, []);
    }
  };
}), Bs = y((e, t) => {
  t.exports = function(n, i) {
    for (var u = -1, o = []; (u = n.indexOf(i, u + 1)) !== -1; ) o.push(u);
    return o;
  };
}), Us = y((e, t) => {
  function n(o, l) {
    for (var f = 1, d = o.length, p = o[0], c = o[0], a = 1; a < d; ++a) if (c = p, p = o[a], l(p, c)) {
      if (a === f) {
        f++;
        continue;
      }
      o[f++] = p;
    }
    return o.length = f, o;
  }
  function i(o) {
    for (var l = 1, f = o.length, d = o[0], p = o[0], c = 1; c < f; ++c, p = d) if (p = d, d = o[c], d !== p) {
      if (c === l) {
        l++;
        continue;
      }
      o[l++] = d;
    }
    return o.length = l, o;
  }
  function u(o, l, f) {
    return o.length === 0 ? o : l ? (f || o.sort(l), n(o, l)) : (f || o.sort(), i(o));
  }
  t.exports = u;
}), we = y((e, t) => {
  e.__esModule = !0;
  var n = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
    return typeof l;
  } : function(l) {
    return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
  };
  function i(l, f) {
    if (!(l instanceof f)) throw new TypeError("Cannot call a class as a function");
  }
  var u = function l(f, d) {
    if ((typeof f > "u" ? "undefined" : n(f)) !== "object") return f;
    var p = new f.constructor();
    for (var c in f) if (f.hasOwnProperty(c)) {
      var a = f[c], m = typeof a > "u" ? "undefined" : n(a);
      c === "parent" && m === "object" ? d && (p[c] = d) : a instanceof Array ? p[c] = a.map(function(g) {
        return l(g, p);
      }) : p[c] = l(a, p);
    }
    return p;
  }, o = function() {
    function l() {
      var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      i(this, l);
      for (var d in f) this[d] = f[d];
      var p = f.spaces;
      p = p === void 0 ? {} : p;
      var c = p.before, a = c === void 0 ? "" : c, m = p.after, g = m === void 0 ? "" : m;
      this.spaces = { before: a, after: g };
    }
    return l.prototype.remove = function() {
      return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
    }, l.prototype.replaceWith = function() {
      if (this.parent) {
        for (var f in arguments) this.parent.insertBefore(this, arguments[f]);
        this.remove();
      }
      return this;
    }, l.prototype.next = function() {
      return this.parent.at(this.parent.index(this) + 1);
    }, l.prototype.prev = function() {
      return this.parent.at(this.parent.index(this) - 1);
    }, l.prototype.clone = function() {
      var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, d = u(this);
      for (var p in f) d[p] = f[p];
      return d;
    }, l.prototype.toString = function() {
      return [this.spaces.before, String(this.value), this.spaces.after].join("");
    }, l;
  }();
  e.default = o, t.exports = e.default;
}), D = y((e) => {
  e.__esModule = !0, e.TAG = "tag", e.STRING = "string", e.SELECTOR = "selector", e.ROOT = "root", e.PSEUDO = "pseudo", e.NESTING = "nesting", e.ID = "id", e.COMMENT = "comment", e.COMBINATOR = "combinator", e.CLASS = "class", e.ATTRIBUTE = "attribute", e.UNIVERSAL = "universal";
}), ur = y((e, t) => {
  e.__esModule = !0;
  var n = /* @__PURE__ */ function() {
    function g(v, h) {
      for (var F = 0; F < h.length; F++) {
        var C = h[F];
        C.enumerable = C.enumerable || !1, C.configurable = !0, "value" in C && (C.writable = !0), Object.defineProperty(v, C.key, C);
      }
    }
    return function(v, h, F) {
      return h && g(v.prototype, h), F && g(v, F), v;
    };
  }(), i = we(), u = d(i), o = D(), l = f(o);
  function f(g) {
    if (g && g.__esModule) return g;
    var v = {};
    if (g != null) for (var h in g) Object.prototype.hasOwnProperty.call(g, h) && (v[h] = g[h]);
    return v.default = g, v;
  }
  function d(g) {
    return g && g.__esModule ? g : { default: g };
  }
  function p(g, v) {
    if (!(g instanceof v)) throw new TypeError("Cannot call a class as a function");
  }
  function c(g, v) {
    if (!g) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return v && (typeof v == "object" || typeof v == "function") ? v : g;
  }
  function a(g, v) {
    if (typeof v != "function" && v !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof v);
    g.prototype = Object.create(v && v.prototype, { constructor: { value: g, enumerable: !1, writable: !0, configurable: !0 } }), v && (Object.setPrototypeOf ? Object.setPrototypeOf(g, v) : g.__proto__ = v);
  }
  var m = function(g) {
    a(v, g);
    function v(h) {
      p(this, v);
      var F = c(this, g.call(this, h));
      return F.nodes || (F.nodes = []), F;
    }
    return v.prototype.append = function(h) {
      return h.parent = this, this.nodes.push(h), this;
    }, v.prototype.prepend = function(h) {
      return h.parent = this, this.nodes.unshift(h), this;
    }, v.prototype.at = function(h) {
      return this.nodes[h];
    }, v.prototype.index = function(h) {
      return typeof h == "number" ? h : this.nodes.indexOf(h);
    }, v.prototype.removeChild = function(h) {
      h = this.index(h), this.at(h).parent = void 0, this.nodes.splice(h, 1);
      var F = void 0;
      for (var C in this.indexes) F = this.indexes[C], F >= h && (this.indexes[C] = F - 1);
      return this;
    }, v.prototype.removeAll = function() {
      for (var C = this.nodes, h = Array.isArray(C), F = 0, C = h ? C : C[Symbol.iterator](); ; ) {
        var _;
        if (h) {
          if (F >= C.length) break;
          _ = C[F++];
        } else {
          if (F = C.next(), F.done) break;
          _ = F.value;
        }
        var H = _;
        H.parent = void 0;
      }
      return this.nodes = [], this;
    }, v.prototype.empty = function() {
      return this.removeAll();
    }, v.prototype.insertAfter = function(h, F) {
      var C = this.index(h);
      this.nodes.splice(C + 1, 0, F);
      var _ = void 0;
      for (var H in this.indexes) _ = this.indexes[H], C <= _ && (this.indexes[H] = _ + this.nodes.length);
      return this;
    }, v.prototype.insertBefore = function(h, F) {
      var C = this.index(h);
      this.nodes.splice(C, 0, F);
      var _ = void 0;
      for (var H in this.indexes) _ = this.indexes[H], C <= _ && (this.indexes[H] = _ + this.nodes.length);
      return this;
    }, v.prototype.each = function(h) {
      this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach++;
      var F = this.lastEach;
      if (this.indexes[F] = 0, !!this.length) {
        for (var C = void 0, _ = void 0; this.indexes[F] < this.length && (C = this.indexes[F], _ = h(this.at(C), C), _ !== !1); ) this.indexes[F] += 1;
        if (delete this.indexes[F], _ === !1) return !1;
      }
    }, v.prototype.walk = function(h) {
      return this.each(function(F, C) {
        var _ = h(F, C);
        if (_ !== !1 && F.length && (_ = F.walk(h)), _ === !1) return !1;
      });
    }, v.prototype.walkAttributes = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.ATTRIBUTE) return h.call(F, C);
      });
    }, v.prototype.walkClasses = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.CLASS) return h.call(F, C);
      });
    }, v.prototype.walkCombinators = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.COMBINATOR) return h.call(F, C);
      });
    }, v.prototype.walkComments = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.COMMENT) return h.call(F, C);
      });
    }, v.prototype.walkIds = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.ID) return h.call(F, C);
      });
    }, v.prototype.walkNesting = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.NESTING) return h.call(F, C);
      });
    }, v.prototype.walkPseudos = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.PSEUDO) return h.call(F, C);
      });
    }, v.prototype.walkTags = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.TAG) return h.call(F, C);
      });
    }, v.prototype.walkUniversals = function(h) {
      var F = this;
      return this.walk(function(C) {
        if (C.type === l.UNIVERSAL) return h.call(F, C);
      });
    }, v.prototype.split = function(h) {
      var F = this, C = [];
      return this.reduce(function(_, H, Dr) {
        var ge = h.call(F, H);
        return C.push(H), ge ? (_.push(C), C = []) : Dr === F.length - 1 && _.push(C), _;
      }, []);
    }, v.prototype.map = function(h) {
      return this.nodes.map(h);
    }, v.prototype.reduce = function(h, F) {
      return this.nodes.reduce(h, F);
    }, v.prototype.every = function(h) {
      return this.nodes.every(h);
    }, v.prototype.some = function(h) {
      return this.nodes.some(h);
    }, v.prototype.filter = function(h) {
      return this.nodes.filter(h);
    }, v.prototype.sort = function(h) {
      return this.nodes.sort(h);
    }, v.prototype.toString = function() {
      return this.map(String).join("");
    }, n(v, [{ key: "first", get: function() {
      return this.at(0);
    } }, { key: "last", get: function() {
      return this.at(this.length - 1);
    } }, { key: "length", get: function() {
      return this.nodes.length;
    } }]), v;
  }(u.default);
  e.default = m, t.exports = e.default;
}), va = y((e, t) => {
  e.__esModule = !0;
  var n = ur(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.ROOT, g;
    }
    return a.prototype.toString = function() {
      var m = this.reduce(function(g, v) {
        var h = String(v);
        return h ? g + h + "," : "";
      }, "").slice(0, -1);
      return this.trailingComma ? m + "," : m;
    }, a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), ba = y((e, t) => {
  e.__esModule = !0;
  var n = ur(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.SELECTOR, g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), De = y((e, t) => {
  e.__esModule = !0;
  var n = /* @__PURE__ */ function() {
    function c(a, m) {
      for (var g = 0; g < m.length; g++) {
        var v = m[g];
        v.enumerable = v.enumerable || !1, v.configurable = !0, "value" in v && (v.writable = !0), Object.defineProperty(a, v.key, v);
      }
    }
    return function(a, m, g) {
      return m && c(a.prototype, m), g && c(a, g), a;
    };
  }(), i = we(), u = o(i);
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a() {
      return l(this, a), f(this, c.apply(this, arguments));
    }
    return a.prototype.toString = function() {
      return [this.spaces.before, this.ns, String(this.value), this.spaces.after].join("");
    }, n(a, [{ key: "ns", get: function() {
      var m = this.namespace;
      return m ? (typeof m == "string" ? m : "") + "|" : "";
    } }]), a;
  }(u.default);
  e.default = p, t.exports = e.default;
}), Ea = y((e, t) => {
  e.__esModule = !0;
  var n = De(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.CLASS, g;
    }
    return a.prototype.toString = function() {
      return [this.spaces.before, this.ns, "." + this.value, this.spaces.after].join("");
    }, a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Ta = y((e, t) => {
  e.__esModule = !0;
  var n = we(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.COMMENT, g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Ca = y((e, t) => {
  e.__esModule = !0;
  var n = De(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.ID, g;
    }
    return a.prototype.toString = function() {
      return [this.spaces.before, this.ns, "#" + this.value, this.spaces.after].join("");
    }, a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Na = y((e, t) => {
  e.__esModule = !0;
  var n = De(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.TAG, g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Ra = y((e, t) => {
  e.__esModule = !0;
  var n = we(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.STRING, g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), qa = y((e, t) => {
  e.__esModule = !0;
  var n = ur(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.PSEUDO, g;
    }
    return a.prototype.toString = function() {
      var m = this.length ? "(" + this.map(String).join(",") + ")" : "";
      return [this.spaces.before, String(this.value), m, this.spaces.after].join("");
    }, a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Da = y((e, t) => {
  e.__esModule = !0;
  var n = De(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.ATTRIBUTE, g.raws = {}, g;
    }
    return a.prototype.toString = function() {
      var m = [this.spaces.before, "[", this.ns, this.attribute];
      return this.operator && m.push(this.operator), this.value && m.push(this.value), this.raws.insensitive ? m.push(this.raws.insensitive) : this.insensitive && m.push(" i"), m.push("]"), m.concat(this.spaces.after).join("");
    }, a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Ba = y((e, t) => {
  e.__esModule = !0;
  var n = De(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.UNIVERSAL, g.value = "*", g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Fa = y((e, t) => {
  e.__esModule = !0;
  var n = we(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.COMBINATOR, g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), Wa = y((e, t) => {
  e.__esModule = !0;
  var n = we(), i = o(n), u = D();
  function o(c) {
    return c && c.__esModule ? c : { default: c };
  }
  function l(c, a) {
    if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
  }
  function f(c, a) {
    if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a && (typeof a == "object" || typeof a == "function") ? a : c;
  }
  function d(c, a) {
    if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    c.prototype = Object.create(a && a.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }), a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
  }
  var p = function(c) {
    d(a, c);
    function a(m) {
      l(this, a);
      var g = f(this, c.call(this, m));
      return g.type = u.NESTING, g.value = "&", g;
    }
    return a;
  }(i.default);
  e.default = p, t.exports = e.default;
}), za = y((e, t) => {
  e.__esModule = !0, e.default = n;
  function n(i) {
    return i.sort(function(u, o) {
      return u - o;
    });
  }
  t.exports = e.default;
}), Za = y((e, t) => {
  e.__esModule = !0, e.default = ks;
  var n = 39, i = 34, u = 92, o = 47, l = 10, f = 32, d = 12, p = 9, c = 13, a = 43, m = 62, g = 126, v = 124, h = 44, F = 40, C = 41, _ = 91, H = 93, Dr = 59, ge = 42, gt = 58, yt = 38, ns = 64, us = /[ \n\t\r\{\(\)'"\\;/]/g, ms = /[ \n\t\r\(\)\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g;
  function ks(Cs) {
    for (var $s = [], Fs = Cs.css.valueOf(), ws = void 0, vs = void 0, Is = void 0, Ci = void 0, Vs = void 0, xi = void 0, Fi = void 0, Ei = void 0, yi = void 0, Ps = void 0, Ai = void 0, Ri = Fs.length, ys = -1, as = 1, ls = 0, Es = function(As, Ls) {
      if (Cs.safe) Fs += Ls, vs = Fs.length - 1;
      else throw Cs.error("Unclosed " + As, as, ls - ys, ls);
    }; ls < Ri; ) {
      switch (ws = Fs.charCodeAt(ls), ws === l && (ys = ls, as += 1), ws) {
        case l:
        case f:
        case p:
        case c:
        case d:
          vs = ls;
          do
            vs += 1, ws = Fs.charCodeAt(vs), ws === l && (ys = vs, as += 1);
          while (ws === f || ws === l || ws === p || ws === c || ws === d);
          $s.push(["space", Fs.slice(ls, vs), as, ls - ys, ls]), ls = vs - 1;
          break;
        case a:
        case m:
        case g:
        case v:
          vs = ls;
          do
            vs += 1, ws = Fs.charCodeAt(vs);
          while (ws === a || ws === m || ws === g || ws === v);
          $s.push(["combinator", Fs.slice(ls, vs), as, ls - ys, ls]), ls = vs - 1;
          break;
        case ge:
          $s.push(["*", "*", as, ls - ys, ls]);
          break;
        case yt:
          $s.push(["&", "&", as, ls - ys, ls]);
          break;
        case h:
          $s.push([",", ",", as, ls - ys, ls]);
          break;
        case _:
          $s.push(["[", "[", as, ls - ys, ls]);
          break;
        case H:
          $s.push(["]", "]", as, ls - ys, ls]);
          break;
        case gt:
          $s.push([":", ":", as, ls - ys, ls]);
          break;
        case Dr:
          $s.push([";", ";", as, ls - ys, ls]);
          break;
        case F:
          $s.push(["(", "(", as, ls - ys, ls]);
          break;
        case C:
          $s.push([")", ")", as, ls - ys, ls]);
          break;
        case n:
        case i:
          Is = ws === n ? "'" : '"', vs = ls;
          do
            for (Ps = !1, vs = Fs.indexOf(Is, vs + 1), vs === -1 && Es("quote", Is), Ai = vs; Fs.charCodeAt(Ai - 1) === u; ) Ai -= 1, Ps = !Ps;
          while (Ps);
          $s.push(["string", Fs.slice(ls, vs + 1), as, ls - ys, as, vs - ys, ls]), ls = vs;
          break;
        case ns:
          us.lastIndex = ls + 1, us.test(Fs), us.lastIndex === 0 ? vs = Fs.length - 1 : vs = us.lastIndex - 2, $s.push(["at-word", Fs.slice(ls, vs + 1), as, ls - ys, as, vs - ys, ls]), ls = vs;
          break;
        case u:
          for (vs = ls, Fi = !0; Fs.charCodeAt(vs + 1) === u; ) vs += 1, Fi = !Fi;
          ws = Fs.charCodeAt(vs + 1), Fi && ws !== o && ws !== f && ws !== l && ws !== p && ws !== c && ws !== d && (vs += 1), $s.push(["word", Fs.slice(ls, vs + 1), as, ls - ys, as, vs - ys, ls]), ls = vs;
          break;
        default:
          ws === o && Fs.charCodeAt(ls + 1) === ge ? (vs = Fs.indexOf("*/", ls + 2) + 1, vs === 0 && Es("comment", "*/"), xi = Fs.slice(ls, vs + 1), Ci = xi.split(`
`), Vs = Ci.length - 1, Vs > 0 ? (Ei = as + Vs, yi = vs - Ci[Vs].length) : (Ei = as, yi = ys), $s.push(["comment", xi, as, ls - ys, Ei, vs - yi, ls]), ys = yi, as = Ei, ls = vs) : (ms.lastIndex = ls + 1, ms.test(Fs), ms.lastIndex === 0 ? vs = Fs.length - 1 : vs = ms.lastIndex - 2, $s.push(["word", Fs.slice(ls, vs + 1), as, ls - ys, as, vs - ys, ls]), ls = vs);
          break;
      }
      ls++;
    }
    return $s;
  }
  t.exports = e.default;
}), ru = y((e, t) => {
  e.__esModule = !0;
  var n = /* @__PURE__ */ function() {
    function ys(as, ls) {
      for (var Es = 0; Es < ls.length; Es++) {
        var As = ls[Es];
        As.enumerable = As.enumerable || !1, As.configurable = !0, "value" in As && (As.writable = !0), Object.defineProperty(as, As.key, As);
      }
    }
    return function(as, ls, Es) {
      return ls && ys(as.prototype, ls), Es && ys(as, Es), as;
    };
  }(), i = Ms(), u = Ps(i), o = Bs(), l = Ps(o), f = Us(), d = Ps(f), p = va(), c = Ps(p), a = ba(), m = Ps(a), g = Ea(), v = Ps(g), h = Ta(), F = Ps(h), C = Ca(), _ = Ps(C), H = Na(), Dr = Ps(H), ge = Ra(), gt = Ps(ge), yt = qa(), ns = Ps(yt), us = Da(), ms = Ps(us), ks = Ba(), Cs = Ps(ks), $s = Fa(), Fs = Ps($s), ws = Wa(), vs = Ps(ws), Is = za(), Ci = Ps(Is), Vs = Za(), xi = Ps(Vs), Fi = D(), Ei = yi(Fi);
  function yi(ys) {
    if (ys && ys.__esModule) return ys;
    var as = {};
    if (ys != null) for (var ls in ys) Object.prototype.hasOwnProperty.call(ys, ls) && (as[ls] = ys[ls]);
    return as.default = ys, as;
  }
  function Ps(ys) {
    return ys && ys.__esModule ? ys : { default: ys };
  }
  function Ai(ys, as) {
    if (!(ys instanceof as)) throw new TypeError("Cannot call a class as a function");
  }
  var Ri = function() {
    function ys(as) {
      Ai(this, ys), this.input = as, this.lossy = as.options.lossless === !1, this.position = 0, this.root = new c.default();
      var ls = new m.default();
      return this.root.append(ls), this.current = ls, this.lossy ? this.tokens = (0, xi.default)({ safe: as.safe, css: as.css.trim() }) : this.tokens = (0, xi.default)(as), this.loop();
    }
    return ys.prototype.attribute = function() {
      var as = "", ls = void 0, Es = this.currToken;
      for (this.position++; this.position < this.tokens.length && this.currToken[0] !== "]"; ) as += this.tokens[this.position][1], this.position++;
      this.position === this.tokens.length && !~as.indexOf("]") && this.error("Expected a closing square bracket.");
      var As = as.split(/((?:[*~^$|]?=))([^]*)/), Ls = As[0].split(/(\|)/g), Ks = { operator: As[1], value: As[2], source: { start: { line: Es[2], column: Es[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: Es[4] };
      if (Ls.length > 1 ? (Ls[0] === "" && (Ls[0] = !0), Ks.attribute = this.parseValue(Ls[2]), Ks.namespace = this.parseNamespace(Ls[0])) : Ks.attribute = this.parseValue(As[0]), ls = new ms.default(Ks), As[2]) {
        var Gs = As[2].split(/(\s+i\s*?)$/), Ws = Gs[0].trim();
        ls.value = this.lossy ? Ws : Gs[0], Gs[1] && (ls.insensitive = !0, this.lossy || (ls.raws.insensitive = Gs[1])), ls.quoted = Ws[0] === "'" || Ws[0] === '"', ls.raws.unquoted = ls.quoted ? Ws.slice(1, -1) : Ws;
      }
      this.newNode(ls), this.position++;
    }, ys.prototype.combinator = function() {
      if (this.currToken[1] === "|") return this.namespace();
      for (var as = new Fs.default({ value: "", source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }); this.position < this.tokens.length && this.currToken && (this.currToken[0] === "space" || this.currToken[0] === "combinator"); ) this.nextToken && this.nextToken[0] === "combinator" ? (as.spaces.before = this.parseSpace(this.currToken[1]), as.source.start.line = this.nextToken[2], as.source.start.column = this.nextToken[3], as.source.end.column = this.nextToken[3], as.source.end.line = this.nextToken[2], as.sourceIndex = this.nextToken[4]) : this.prevToken && this.prevToken[0] === "combinator" ? as.spaces.after = this.parseSpace(this.currToken[1]) : this.currToken[0] === "combinator" ? as.value = this.currToken[1] : this.currToken[0] === "space" && (as.value = this.parseSpace(this.currToken[1], " ")), this.position++;
      return this.newNode(as);
    }, ys.prototype.comma = function() {
      if (this.position === this.tokens.length - 1) {
        this.root.trailingComma = !0, this.position++;
        return;
      }
      var as = new m.default();
      this.current.parent.append(as), this.current = as, this.position++;
    }, ys.prototype.comment = function() {
      var as = new F.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] });
      this.newNode(as), this.position++;
    }, ys.prototype.error = function(as) {
      throw new this.input.error(as);
    }, ys.prototype.missingBackslash = function() {
      return this.error("Expected a backslash preceding the semicolon.");
    }, ys.prototype.missingParenthesis = function() {
      return this.error("Expected opening parenthesis.");
    }, ys.prototype.missingSquareBracket = function() {
      return this.error("Expected opening square bracket.");
    }, ys.prototype.namespace = function() {
      var as = this.prevToken && this.prevToken[1] || !0;
      if (this.nextToken[0] === "word") return this.position++, this.word(as);
      if (this.nextToken[0] === "*") return this.position++, this.universal(as);
    }, ys.prototype.nesting = function() {
      this.newNode(new vs.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] })), this.position++;
    }, ys.prototype.parentheses = function() {
      var as = this.current.last;
      if (as && as.type === Ei.PSEUDO) {
        var ls = new m.default(), Es = this.current;
        as.append(ls), this.current = ls;
        var As = 1;
        for (this.position++; this.position < this.tokens.length && As; ) this.currToken[0] === "(" && As++, this.currToken[0] === ")" && As--, As ? this.parse() : (ls.parent.source.end.line = this.currToken[2], ls.parent.source.end.column = this.currToken[3], this.position++);
        As && this.error("Expected closing parenthesis."), this.current = Es;
      } else {
        var Ls = 1;
        for (this.position++, as.value += "("; this.position < this.tokens.length && Ls; ) this.currToken[0] === "(" && Ls++, this.currToken[0] === ")" && Ls--, as.value += this.parseParenthesisToken(this.currToken), this.position++;
        Ls && this.error("Expected closing parenthesis.");
      }
    }, ys.prototype.pseudo = function() {
      for (var as = this, ls = "", Es = this.currToken; this.currToken && this.currToken[0] === ":"; ) ls += this.currToken[1], this.position++;
      if (!this.currToken) return this.error("Expected pseudo-class or pseudo-element");
      if (this.currToken[0] === "word") {
        var As = void 0;
        this.splitWord(!1, function(Ls, Ks) {
          ls += Ls, As = new ns.default({ value: ls, source: { start: { line: Es[2], column: Es[3] }, end: { line: as.currToken[4], column: as.currToken[5] } }, sourceIndex: Es[4] }), as.newNode(As), Ks > 1 && as.nextToken && as.nextToken[0] === "(" && as.error("Misplaced parenthesis.");
        });
      } else this.error('Unexpected "' + this.currToken[0] + '" found.');
    }, ys.prototype.space = function() {
      var as = this.currToken;
      this.position === 0 || this.prevToken[0] === "," || this.prevToken[0] === "(" ? (this.spaces = this.parseSpace(as[1]), this.position++) : this.position === this.tokens.length - 1 || this.nextToken[0] === "," || this.nextToken[0] === ")" ? (this.current.last.spaces.after = this.parseSpace(as[1]), this.position++) : this.combinator();
    }, ys.prototype.string = function() {
      var as = this.currToken;
      this.newNode(new gt.default({ value: this.currToken[1], source: { start: { line: as[2], column: as[3] }, end: { line: as[4], column: as[5] } }, sourceIndex: as[6] })), this.position++;
    }, ys.prototype.universal = function(as) {
      var ls = this.nextToken;
      if (ls && ls[1] === "|") return this.position++, this.namespace();
      this.newNode(new Cs.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }), as), this.position++;
    }, ys.prototype.splitWord = function(as, ls) {
      for (var Es = this, As = this.nextToken, Ls = this.currToken[1]; As && As[0] === "word"; ) {
        this.position++;
        var Ks = this.currToken[1];
        if (Ls += Ks, Ks.lastIndexOf("\\") === Ks.length - 1) {
          var Gs = this.nextToken;
          Gs && Gs[0] === "space" && (Ls += this.parseSpace(Gs[1], " "), this.position++);
        }
        As = this.nextToken;
      }
      var Ws = (0, l.default)(Ls, "."), gi = (0, l.default)(Ls, "#"), Pi = (0, l.default)(Ls, "#{");
      Pi.length && (gi = gi.filter(function(bi) {
        return !~Pi.indexOf(bi);
      }));
      var vi = (0, Ci.default)((0, d.default)((0, u.default)([[0], Ws, gi])));
      vi.forEach(function(bi, $i) {
        var Bi = vi[$i + 1] || Ls.length, Ti = Ls.slice(bi, Bi);
        if ($i === 0 && ls) return ls.call(Es, Ti, vi.length);
        var ki = void 0;
        ~Ws.indexOf(bi) ? ki = new v.default({ value: Ti.slice(1), source: { start: { line: Es.currToken[2], column: Es.currToken[3] + bi }, end: { line: Es.currToken[4], column: Es.currToken[3] + (Bi - 1) } }, sourceIndex: Es.currToken[6] + vi[$i] }) : ~gi.indexOf(bi) ? ki = new _.default({ value: Ti.slice(1), source: { start: { line: Es.currToken[2], column: Es.currToken[3] + bi }, end: { line: Es.currToken[4], column: Es.currToken[3] + (Bi - 1) } }, sourceIndex: Es.currToken[6] + vi[$i] }) : ki = new Dr.default({ value: Ti, source: { start: { line: Es.currToken[2], column: Es.currToken[3] + bi }, end: { line: Es.currToken[4], column: Es.currToken[3] + (Bi - 1) } }, sourceIndex: Es.currToken[6] + vi[$i] }), Es.newNode(ki, as);
      }), this.position++;
    }, ys.prototype.word = function(as) {
      var ls = this.nextToken;
      return ls && ls[1] === "|" ? (this.position++, this.namespace()) : this.splitWord(as);
    }, ys.prototype.loop = function() {
      for (; this.position < this.tokens.length; ) this.parse(!0);
      return this.root;
    }, ys.prototype.parse = function(as) {
      switch (this.currToken[0]) {
        case "space":
          this.space();
          break;
        case "comment":
          this.comment();
          break;
        case "(":
          this.parentheses();
          break;
        case ")":
          as && this.missingParenthesis();
          break;
        case "[":
          this.attribute();
          break;
        case "]":
          this.missingSquareBracket();
          break;
        case "at-word":
        case "word":
          this.word();
          break;
        case ":":
          this.pseudo();
          break;
        case ";":
          this.missingBackslash();
          break;
        case ",":
          this.comma();
          break;
        case "*":
          this.universal();
          break;
        case "&":
          this.nesting();
          break;
        case "combinator":
          this.combinator();
          break;
        case "string":
          this.string();
          break;
      }
    }, ys.prototype.parseNamespace = function(as) {
      if (this.lossy && typeof as == "string") {
        var ls = as.trim();
        return ls.length ? ls : !0;
      }
      return as;
    }, ys.prototype.parseSpace = function(as, ls) {
      return this.lossy ? ls || "" : as;
    }, ys.prototype.parseValue = function(as) {
      return this.lossy && as && typeof as == "string" ? as.trim() : as;
    }, ys.prototype.parseParenthesisToken = function(as) {
      return this.lossy ? as[0] === "space" ? this.parseSpace(as[1], " ") : this.parseValue(as[1]) : as[1];
    }, ys.prototype.newNode = function(as, ls) {
      return ls && (as.namespace = this.parseNamespace(ls)), this.spaces && (as.spaces.before = this.spaces, this.spaces = ""), this.current.append(as);
    }, n(ys, [{ key: "currToken", get: function() {
      return this.tokens[this.position];
    } }, { key: "nextToken", get: function() {
      return this.tokens[this.position + 1];
    } }, { key: "prevToken", get: function() {
      return this.tokens[this.position - 1];
    } }]), ys;
  }();
  e.default = Ri, t.exports = e.default;
}), nu = y((e, t) => {
  e.__esModule = !0;
  var n = /* @__PURE__ */ function() {
    function d(p, c) {
      for (var a = 0; a < c.length; a++) {
        var m = c[a];
        m.enumerable = m.enumerable || !1, m.configurable = !0, "value" in m && (m.writable = !0), Object.defineProperty(p, m.key, m);
      }
    }
    return function(p, c, a) {
      return c && d(p.prototype, c), a && d(p, a), p;
    };
  }(), i = ru(), u = o(i);
  function o(d) {
    return d && d.__esModule ? d : { default: d };
  }
  function l(d, p) {
    if (!(d instanceof p)) throw new TypeError("Cannot call a class as a function");
  }
  var f = function() {
    function d(p) {
      return l(this, d), this.func = p || function() {
      }, this;
    }
    return d.prototype.process = function(p) {
      var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = new u.default({ css: p, error: function(m) {
        throw new Error(m);
      }, options: c });
      return this.res = a, this.func(a), this;
    }, n(d, [{ key: "result", get: function() {
      return String(this.res);
    } }]), d;
  }();
  e.default = f, t.exports = e.default;
}), z = y((e, t) => {
  var n = function(i, u) {
    let o = new i.constructor();
    for (let l in i) {
      if (!i.hasOwnProperty(l)) continue;
      let f = i[l], d = typeof f;
      l === "parent" && d === "object" ? u && (o[l] = u) : l === "source" ? o[l] = f : f instanceof Array ? o[l] = f.map((p) => n(p, o)) : l !== "before" && l !== "after" && l !== "between" && l !== "semicolon" && (d === "object" && f !== null && (f = n(f)), o[l] = f);
    }
    return o;
  };
  t.exports = class {
    constructor(i) {
      i = i || {}, this.raws = { before: "", after: "" };
      for (let u in i) this[u] = i[u];
    }
    remove() {
      return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
    }
    toString() {
      return [this.raws.before, String(this.value), this.raws.after].join("");
    }
    clone(i) {
      i = i || {};
      let u = n(this);
      for (let o in i) u[o] = i[o];
      return u;
    }
    cloneBefore(i) {
      i = i || {};
      let u = this.clone(i);
      return this.parent.insertBefore(this, u), u;
    }
    cloneAfter(i) {
      i = i || {};
      let u = this.clone(i);
      return this.parent.insertAfter(this, u), u;
    }
    replaceWith() {
      let i = Array.prototype.slice.call(arguments);
      if (this.parent) {
        for (let u of i) this.parent.insertBefore(this, u);
        this.remove();
      }
      return this;
    }
    moveTo(i) {
      return this.cleanRaws(this.root() === i.root()), this.remove(), i.append(this), this;
    }
    moveBefore(i) {
      return this.cleanRaws(this.root() === i.root()), this.remove(), i.parent.insertBefore(i, this), this;
    }
    moveAfter(i) {
      return this.cleanRaws(this.root() === i.root()), this.remove(), i.parent.insertAfter(i, this), this;
    }
    next() {
      let i = this.parent.index(this);
      return this.parent.nodes[i + 1];
    }
    prev() {
      let i = this.parent.index(this);
      return this.parent.nodes[i - 1];
    }
    toJSON() {
      let i = {};
      for (let u in this) {
        if (!this.hasOwnProperty(u) || u === "parent") continue;
        let o = this[u];
        o instanceof Array ? i[u] = o.map((l) => typeof l == "object" && l.toJSON ? l.toJSON() : l) : typeof o == "object" && o.toJSON ? i[u] = o.toJSON() : i[u] = o;
      }
      return i;
    }
    root() {
      let i = this;
      for (; i.parent; ) i = i.parent;
      return i;
    }
    cleanRaws(i) {
      delete this.raws.before, delete this.raws.after, i || delete this.raws.between;
    }
    positionInside(i) {
      let u = this.toString(), o = this.source.start.column, l = this.source.start.line;
      for (let f = 0; f < i; f++) u[f] === `
` ? (o = 1, l += 1) : o += 1;
      return { line: l, column: o };
    }
    positionBy(i) {
      let u = this.source.start;
      if (Object(i).index) u = this.positionInside(i.index);
      else if (Object(i).word) {
        let o = this.toString().indexOf(i.word);
        o !== -1 && (u = this.positionInside(o));
      }
      return u;
    }
  };
}), U = y((e, t) => {
  var n = z(), i = class extends n {
    constructor(u) {
      super(u), this.nodes || (this.nodes = []);
    }
    push(u) {
      return u.parent = this, this.nodes.push(u), this;
    }
    each(u) {
      this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
      let o = this.lastEach, l, f;
      if (this.indexes[o] = 0, !!this.nodes) {
        for (; this.indexes[o] < this.nodes.length && (l = this.indexes[o], f = u(this.nodes[l], l), f !== !1); ) this.indexes[o] += 1;
        return delete this.indexes[o], f;
      }
    }
    walk(u) {
      return this.each((o, l) => {
        let f = u(o, l);
        return f !== !1 && o.walk && (f = o.walk(u)), f;
      });
    }
    walkType(u, o) {
      if (!u || !o) throw new Error("Parameters {type} and {callback} are required.");
      let l = typeof u == "function";
      return this.walk((f, d) => {
        if (l && f instanceof u || !l && f.type === u) return o.call(this, f, d);
      });
    }
    append(u) {
      return u.parent = this, this.nodes.push(u), this;
    }
    prepend(u) {
      return u.parent = this, this.nodes.unshift(u), this;
    }
    cleanRaws(u) {
      if (super.cleanRaws(u), this.nodes) for (let o of this.nodes) o.cleanRaws(u);
    }
    insertAfter(u, o) {
      let l = this.index(u), f;
      this.nodes.splice(l + 1, 0, o);
      for (let d in this.indexes) f = this.indexes[d], l <= f && (this.indexes[d] = f + this.nodes.length);
      return this;
    }
    insertBefore(u, o) {
      let l = this.index(u), f;
      this.nodes.splice(l, 0, o);
      for (let d in this.indexes) f = this.indexes[d], l <= f && (this.indexes[d] = f + this.nodes.length);
      return this;
    }
    removeChild(u) {
      u = this.index(u), this.nodes[u].parent = void 0, this.nodes.splice(u, 1);
      let o;
      for (let l in this.indexes) o = this.indexes[l], o >= u && (this.indexes[l] = o - 1);
      return this;
    }
    removeAll() {
      for (let u of this.nodes) u.parent = void 0;
      return this.nodes = [], this;
    }
    every(u) {
      return this.nodes.every(u);
    }
    some(u) {
      return this.nodes.some(u);
    }
    index(u) {
      return typeof u == "number" ? u : this.nodes.indexOf(u);
    }
    get first() {
      if (this.nodes) return this.nodes[0];
    }
    get last() {
      if (this.nodes) return this.nodes[this.nodes.length - 1];
    }
    toString() {
      let u = this.nodes.map(String).join("");
      return this.value && (u = this.value + u), this.raws.before && (u = this.raws.before + u), this.raws.after && (u += this.raws.after), u;
    }
  };
  i.registerWalker = (u) => {
    let o = "walk" + u.name;
    o.lastIndexOf("s") !== o.length - 1 && (o += "s"), !i.prototype[o] && (i.prototype[o] = function(l) {
      return this.walkType(u, l);
    });
  }, t.exports = i;
}), lu = y((e, t) => {
  var n = U();
  t.exports = class extends n {
    constructor(i) {
      super(i), this.type = "root";
    }
  };
}), fu = y((e, t) => {
  var n = U();
  t.exports = class extends n {
    constructor(i) {
      super(i), this.type = "value", this.unbalanced = 0;
    }
  };
}), du = y((e, t) => {
  var n = U(), i = class extends n {
    constructor(u) {
      super(u), this.type = "atword";
    }
    toString() {
      return this.quoted && this.raws.quote, [this.raws.before, "@", String.prototype.toString.call(this.value), this.raws.after].join("");
    }
  };
  n.registerWalker(i), t.exports = i;
}), yu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "colon";
    }
  };
  n.registerWalker(u), t.exports = u;
}), gu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "comma";
    }
  };
  n.registerWalker(u), t.exports = u;
}), xu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "comment", this.inline = Object(o).inline || !1;
    }
    toString() {
      return [this.raws.before, this.inline ? "//" : "/*", String(this.value), this.inline ? "" : "*/", this.raws.after].join("");
    }
  };
  n.registerWalker(u), t.exports = u;
}), ku = y((e, t) => {
  var n = U(), i = class extends n {
    constructor(u) {
      super(u), this.type = "func", this.unbalanced = -1;
    }
  };
  n.registerWalker(i), t.exports = i;
}), Su = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "number", this.unit = Object(o).unit || "";
    }
    toString() {
      return [this.raws.before, String(this.value), this.unit, this.raws.after].join("");
    }
  };
  n.registerWalker(u), t.exports = u;
}), Ou = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "operator";
    }
  };
  n.registerWalker(u), t.exports = u;
}), Au = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "paren", this.parenType = "";
    }
  };
  n.registerWalker(u), t.exports = u;
}), Pu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "string";
    }
    toString() {
      let o = this.quoted ? this.raws.quote : "";
      return [this.raws.before, o, this.value + "", o, this.raws.after].join("");
    }
  };
  n.registerWalker(u), t.exports = u;
}), Iu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "word";
    }
  };
  n.registerWalker(u), t.exports = u;
}), Lu = y((e, t) => {
  var n = U(), i = z(), u = class extends i {
    constructor(o) {
      super(o), this.type = "unicode-range";
    }
  };
  n.registerWalker(u), t.exports = u;
}), Mu = y((e, t) => {
  var n = class extends Error {
    constructor(i) {
      super(i), this.name = this.constructor.name, this.message = i || "An error ocurred while tokzenizing.", typeof Error.captureStackTrace == "function" ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error(i).stack;
    }
  };
  t.exports = n;
}), Fu = y((e, t) => {
  var n = /[ \n\t\r\{\(\)'"\\;,/]/g, i = /[ \n\t\r\(\)\{\}\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g, u = /[ \n\t\r\(\)\{\}\*:;@!&'"\-\+\|~>,\[\]\\]|\//g, o = /^[a-z0-9]/i, l = /^[a-f0-9?\-]/i, f = Mu();
  t.exports = function(d, p) {
    p = p || {};
    let c = [], a = d.valueOf(), m = a.length, g = -1, v = 1, h = 0, F = 0, C = null, _, H, Dr, ge, gt, yt, ns, us, ms, ks, Cs;
    function $s(Fs) {
      let ws = `Unclosed ${Fs} at line: ${v}, column: ${h - g}, token: ${h}`;
      throw new f(ws);
    }
    for (; h < m; ) {
      switch (_ = a.charCodeAt(h), _ === 10 && (g = h, v += 1), _) {
        case 10:
        case 32:
        case 9:
        case 13:
        case 12:
          H = h;
          do
            H += 1, _ = a.charCodeAt(H), _ === 10 && (g = H, v += 1);
          while (_ === 32 || _ === 10 || _ === 9 || _ === 13 || _ === 12);
          c.push(["space", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          break;
        case 58:
          H = h + 1, c.push(["colon", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          break;
        case 44:
          H = h + 1, c.push(["comma", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          break;
        case 123:
          c.push(["{", "{", v, h - g, v, H - g, h]);
          break;
        case 125:
          c.push(["}", "}", v, h - g, v, H - g, h]);
          break;
        case 40:
          F++, C = !C && F === 1 && c.length > 0 && c[c.length - 1][0] === "word" && c[c.length - 1][1] === "url", c.push(["(", "(", v, h - g, v, H - g, h]);
          break;
        case 41:
          F--, C = C && F > 0, c.push([")", ")", v, h - g, v, H - g, h]);
          break;
        case 39:
        case 34:
          Dr = _ === 39 ? "'" : '"', H = h;
          do
            for (ms = !1, H = a.indexOf(Dr, H + 1), H === -1 && $s("quote"), ks = H; a.charCodeAt(ks - 1) === 92; ) ks -= 1, ms = !ms;
          while (ms);
          c.push(["string", a.slice(h, H + 1), v, h - g, v, H - g, h]), h = H;
          break;
        case 64:
          n.lastIndex = h + 1, n.test(a), n.lastIndex === 0 ? H = a.length - 1 : H = n.lastIndex - 2, c.push(["atword", a.slice(h, H + 1), v, h - g, v, H - g, h]), h = H;
          break;
        case 92:
          H = h, _ = a.charCodeAt(H + 1), c.push(["word", a.slice(h, H + 1), v, h - g, v, H - g, h]), h = H;
          break;
        case 43:
        case 45:
        case 42:
          if (H = h + 1, Cs = a.slice(h + 1, H + 1), a.slice(h - 1, h), _ === 45 && Cs.charCodeAt(0) === 45) {
            H++, c.push(["word", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
            break;
          }
          c.push(["operator", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          break;
        default:
          if (_ === 47 && (a.charCodeAt(h + 1) === 42 || p.loose && !C && a.charCodeAt(h + 1) === 47)) {
            if (a.charCodeAt(h + 1) === 42) H = a.indexOf("*/", h + 2) + 1, H === 0 && $s("comment");
            else {
              let Fs = a.indexOf(`
`, h + 2);
              H = Fs !== -1 ? Fs - 1 : m;
            }
            yt = a.slice(h, H + 1), ge = yt.split(`
`), gt = ge.length - 1, gt > 0 ? (ns = v + gt, us = H - ge[gt].length) : (ns = v, us = g), c.push(["comment", yt, v, h - g, ns, H - us, h]), g = us, v = ns, h = H;
          } else if (_ === 35 && !o.test(a.slice(h + 1, h + 2))) H = h + 1, c.push(["#", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          else if ((_ === 117 || _ === 85) && a.charCodeAt(h + 1) === 43) {
            H = h + 2;
            do
              H += 1, _ = a.charCodeAt(H);
            while (H < m && l.test(a.slice(H, H + 1)));
            c.push(["unicoderange", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          } else if (_ === 47) H = h + 1, c.push(["operator", a.slice(h, H), v, h - g, v, H - g, h]), h = H - 1;
          else {
            let Fs = i;
            if (_ >= 48 && _ <= 57 && (Fs = u), Fs.lastIndex = h + 1, Fs.test(a), Fs.lastIndex === 0 ? H = a.length - 1 : H = Fs.lastIndex - 2, Fs === u || _ === 46) {
              let ws = a.charCodeAt(H), vs = a.charCodeAt(H + 1), Is = a.charCodeAt(H + 2);
              (ws === 101 || ws === 69) && (vs === 45 || vs === 43) && Is >= 48 && Is <= 57 && (u.lastIndex = H + 2, u.test(a), u.lastIndex === 0 ? H = a.length - 1 : H = u.lastIndex - 2);
            }
            c.push(["word", a.slice(h, H + 1), v, h - g, v, H - g, h]), h = H;
          }
          break;
      }
      h++;
    }
    return c;
  };
}), Wu = y((e, t) => {
  var n = class extends Error {
    constructor(i) {
      super(i), this.name = this.constructor.name, this.message = i || "An error ocurred while parsing.", typeof Error.captureStackTrace == "function" ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error(i).stack;
    }
  };
  t.exports = n;
}), Gu = y((e, t) => {
  var n = lu(), i = fu(), u = du(), o = yu(), l = gu(), f = xu(), d = ku(), p = Su(), c = Ou(), a = Au(), m = Pu(), g = Iu(), v = Lu(), h = Fu(), F = Ms(), C = Bs(), _ = Us(), H = Wu();
  function Dr(ge) {
    return ge.sort((gt, yt) => gt - yt);
  }
  t.exports = class {
    constructor(ge, gt) {
      let yt = { loose: !1 };
      this.cache = [], this.input = ge, this.options = Object.assign({}, yt, gt), this.position = 0, this.unbalanced = 0, this.root = new n();
      let ns = new i();
      this.root.append(ns), this.current = ns, this.tokens = h(ge, this.options);
    }
    parse() {
      return this.loop();
    }
    colon() {
      let ge = this.currToken;
      this.newNode(new o({ value: ge[1], source: { start: { line: ge[2], column: ge[3] }, end: { line: ge[4], column: ge[5] } }, sourceIndex: ge[6] })), this.position++;
    }
    comma() {
      let ge = this.currToken;
      this.newNode(new l({ value: ge[1], source: { start: { line: ge[2], column: ge[3] }, end: { line: ge[4], column: ge[5] } }, sourceIndex: ge[6] })), this.position++;
    }
    comment() {
      let ge = !1, gt = this.currToken[1].replace(/\/\*|\*\//g, ""), yt;
      this.options.loose && gt.startsWith("//") && (gt = gt.substring(2), ge = !0), yt = new f({ value: gt, inline: ge, source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] }), this.newNode(yt), this.position++;
    }
    error(ge, gt) {
      throw new H(ge + ` at line: ${gt[2]}, column ${gt[3]}`);
    }
    loop() {
      for (; this.position < this.tokens.length; ) this.parseTokens();
      return !this.current.last && this.spaces ? this.current.raws.before += this.spaces : this.spaces && (this.current.last.raws.after += this.spaces), this.spaces = "", this.root;
    }
    operator() {
      let ge = this.currToken[1], gt;
      if (ge === "+" || ge === "-") {
        if (this.options.loose || this.position > 0 && (this.current.type === "func" && this.current.value === "calc" ? this.prevToken[0] !== "space" && this.prevToken[0] !== "(" ? this.error("Syntax Error", this.currToken) : this.nextToken[0] !== "space" && this.nextToken[0] !== "word" ? this.error("Syntax Error", this.currToken) : this.nextToken[0] === "word" && this.current.last.type !== "operator" && this.current.last.value !== "(" && this.error("Syntax Error", this.currToken) : (this.nextToken[0] === "space" || this.nextToken[0] === "operator" || this.prevToken[0] === "operator") && this.error("Syntax Error", this.currToken)), this.options.loose) {
          if ((!this.current.nodes.length || this.current.last && this.current.last.type === "operator") && this.nextToken[0] === "word") return this.word();
        } else if (this.nextToken[0] === "word") return this.word();
      }
      return gt = new c({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }), this.position++, this.newNode(gt);
    }
    parseTokens() {
      switch (this.currToken[0]) {
        case "space":
          this.space();
          break;
        case "colon":
          this.colon();
          break;
        case "comma":
          this.comma();
          break;
        case "comment":
          this.comment();
          break;
        case "(":
          this.parenOpen();
          break;
        case ")":
          this.parenClose();
          break;
        case "atword":
        case "word":
          this.word();
          break;
        case "operator":
          this.operator();
          break;
        case "string":
          this.string();
          break;
        case "unicoderange":
          this.unicodeRange();
          break;
        default:
          this.word();
          break;
      }
    }
    parenOpen() {
      let ge = 1, gt = this.position + 1, yt = this.currToken, ns;
      for (; gt < this.tokens.length && ge; ) {
        let us = this.tokens[gt];
        us[0] === "(" && ge++, us[0] === ")" && ge--, gt++;
      }
      if (ge && this.error("Expected closing parenthesis", yt), ns = this.current.last, ns && ns.type === "func" && ns.unbalanced < 0 && (ns.unbalanced = 0, this.current = ns), this.current.unbalanced++, this.newNode(new a({ value: yt[1], source: { start: { line: yt[2], column: yt[3] }, end: { line: yt[4], column: yt[5] } }, sourceIndex: yt[6] })), this.position++, this.current.type === "func" && this.current.unbalanced && this.current.value === "url" && this.currToken[0] !== "string" && this.currToken[0] !== ")" && !this.options.loose) {
        let us = this.nextToken, ms = this.currToken[1], ks = { line: this.currToken[2], column: this.currToken[3] };
        for (; us && us[0] !== ")" && this.current.unbalanced; ) this.position++, ms += this.currToken[1], us = this.nextToken;
        this.position !== this.tokens.length - 1 && (this.position++, this.newNode(new g({ value: ms, source: { start: ks, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] })));
      }
    }
    parenClose() {
      let ge = this.currToken;
      this.newNode(new a({ value: ge[1], source: { start: { line: ge[2], column: ge[3] }, end: { line: ge[4], column: ge[5] } }, sourceIndex: ge[6] })), this.position++, !(this.position >= this.tokens.length - 1 && !this.current.unbalanced) && (this.current.unbalanced--, this.current.unbalanced < 0 && this.error("Expected opening parenthesis", ge), !this.current.unbalanced && this.cache.length && (this.current = this.cache.pop()));
    }
    space() {
      let ge = this.currToken;
      this.position === this.tokens.length - 1 || this.nextToken[0] === "," || this.nextToken[0] === ")" ? (this.current.last.raws.after += ge[1], this.position++) : (this.spaces = ge[1], this.position++);
    }
    unicodeRange() {
      let ge = this.currToken;
      this.newNode(new v({ value: ge[1], source: { start: { line: ge[2], column: ge[3] }, end: { line: ge[4], column: ge[5] } }, sourceIndex: ge[6] })), this.position++;
    }
    splitWord() {
      let ge = this.nextToken, gt = this.currToken[1], yt = /^[\+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][\+\-]?\d+)?/, ns = /^(?!\#([a-z0-9]+))[\#\{\}]/gi, us, ms;
      if (!ns.test(gt)) for (; ge && ge[0] === "word"; ) {
        this.position++;
        let ks = this.currToken[1];
        gt += ks, ge = this.nextToken;
      }
      us = C(gt, "@"), ms = Dr(_(F([[0], us]))), ms.forEach((ks, Cs) => {
        let $s = ms[Cs + 1] || gt.length, Fs = gt.slice(ks, $s), ws;
        if (~us.indexOf(ks)) ws = new u({ value: Fs.slice(1), source: { start: { line: this.currToken[2], column: this.currToken[3] + ks }, end: { line: this.currToken[4], column: this.currToken[3] + ($s - 1) } }, sourceIndex: this.currToken[6] + ms[Cs] });
        else if (yt.test(this.currToken[1])) {
          let vs = Fs.replace(yt, "");
          ws = new p({ value: Fs.replace(vs, ""), source: { start: { line: this.currToken[2], column: this.currToken[3] + ks }, end: { line: this.currToken[4], column: this.currToken[3] + ($s - 1) } }, sourceIndex: this.currToken[6] + ms[Cs], unit: vs });
        } else ws = new (ge && ge[0] === "(" ? d : g)({ value: Fs, source: { start: { line: this.currToken[2], column: this.currToken[3] + ks }, end: { line: this.currToken[4], column: this.currToken[3] + ($s - 1) } }, sourceIndex: this.currToken[6] + ms[Cs] }), ws.type === "word" ? (ws.isHex = /^#(.+)/.test(Fs), ws.isColor = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(Fs)) : this.cache.push(this.current);
        this.newNode(ws);
      }), this.position++;
    }
    string() {
      let ge = this.currToken, gt = this.currToken[1], yt = /^(\"|\')/, ns = yt.test(gt), us = "", ms;
      ns && (us = gt.match(yt)[0], gt = gt.slice(1, gt.length - 1)), ms = new m({ value: gt, source: { start: { line: ge[2], column: ge[3] }, end: { line: ge[4], column: ge[5] } }, sourceIndex: ge[6], quoted: ns }), ms.raws.quote = us, this.newNode(ms), this.position++;
    }
    word() {
      return this.splitWord();
    }
    newNode(ge) {
      return this.spaces && (ge.raws.before += this.spaces, this.spaces = ""), this.current.append(ge);
    }
    get currToken() {
      return this.tokens[this.position];
    }
    get nextToken() {
      return this.tokens[this.position + 1];
    }
    get prevToken() {
      return this.tokens[this.position - 1];
    }
  };
}), Zs = {};
tn(Zs, { languages: () => hi, options: () => mi, parsers: () => Xs, printers: () => Ay });
var dl = (e, t, n, i) => {
  if (!(e && t == null)) return t.replaceAll ? t.replaceAll(n, i) : n.global ? t.replace(n, i) : t.split(n).join(i);
}, E = dl, Ue = "string", Fe = "array", $e = "cursor", ve = "indent", xe = "align", We = "trim", be = "group", _e = "fill", ue = "if-break", Ye = "indent-if-break", ze = "line-suffix", Ve = "line-suffix-boundary", K = "line", Ge = "label", ke = "break-parent", kt = /* @__PURE__ */ new Set([$e, ve, xe, We, be, _e, ue, Ye, ze, Ve, K, Ge, ke]);
function ml(e) {
  if (typeof e == "string") return Ue;
  if (Array.isArray(e)) return Fe;
  if (!e) return;
  let { type: t } = e;
  if (kt.has(t)) return t;
}
var je = ml, yl = (e) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e);
function wl(e) {
  let t = e === null ? "null" : typeof e;
  if (t !== "string" && t !== "object") return `Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;
  if (je(e)) throw new Error("doc is valid.");
  let n = Object.prototype.toString.call(e);
  if (n !== "[object Object]") return `Unexpected doc '${n}'.`;
  let i = yl([...kt].map((u) => `'${u}'`));
  return `Unexpected doc.type '${e.type}'.
Expected it to be ${i}.`;
}
var Yr = class extends Error {
  constructor(t) {
    super(wl(t));
    Ts(this, "name", "InvalidDocError");
    this.doc = t;
  }
}, zr = Yr, rn = () => {
}, Et = rn;
function q(e) {
  return { type: ve, contents: e };
}
function sn(e, t) {
  return { type: xe, contents: t, n: e };
}
function L(e, t = {}) {
  return Et(t.expandedStates), { type: be, id: t.id, contents: e, break: !!t.shouldBreak, expandedStates: t.expandedStates };
}
function nn(e) {
  return sn({ type: "root" }, e);
}
function ce(e) {
  return sn(-1, e);
}
function He(e) {
  return { type: _e, parts: e };
}
function St(e, t = "", n = {}) {
  return { type: ue, breakContents: e, flatContents: t, groupId: n.groupId };
}
var Ke = { type: ke }, gl = { type: K, hard: !0 }, A = { type: K }, M = { type: K, soft: !0 }, k = [gl, Ke];
function V(e, t) {
  let n = [];
  for (let i = 0; i < t.length; i++) i !== 0 && n.push(e), n.push(t[i]);
  return n;
}
var vl = (e, t, n) => {
  if (!(e && t == null)) return Array.isArray(t) || typeof t == "string" ? t[n < 0 ? t.length + n : n] : t.at(n);
}, G = vl;
function xl(e, t) {
  if (typeof e == "string") return t(e);
  let n = /* @__PURE__ */ new Map();
  return i(e);
  function i(o) {
    if (n.has(o)) return n.get(o);
    let l = u(o);
    return n.set(o, l), l;
  }
  function u(o) {
    switch (je(o)) {
      case Fe:
        return t(o.map(i));
      case _e:
        return t({ ...o, parts: o.parts.map(i) });
      case ue:
        return t({ ...o, breakContents: i(o.breakContents), flatContents: i(o.flatContents) });
      case be: {
        let { expandedStates: l, contents: f } = o;
        return l ? (l = l.map(i), f = l[0]) : f = i(f), t({ ...o, contents: f, expandedStates: l });
      }
      case xe:
      case ve:
      case Ye:
      case Ge:
      case ze:
        return t({ ...o, contents: i(o.contents) });
      case Ue:
      case $e:
      case We:
      case Ve:
      case K:
      case ke:
        return t(o);
      default:
        throw new zr(o);
    }
  }
}
function bl(e) {
  return e.type === K && !e.hard ? e.soft ? "" : " " : e.type === ue ? e.flatContents : e;
}
function on(e) {
  return xl(e, bl);
}
function _l(e) {
  return Array.isArray(e) && e.length > 0;
}
var ee = _l, Tt = "'", an = '"';
function kl(e, t) {
  let n = t === !0 || t === Tt ? Tt : an, i = n === Tt ? an : Tt, u = 0, o = 0;
  for (let l of e) l === n ? u++ : l === i && o++;
  return u > o ? i : n;
}
var un = kl;
function El(e, t, n) {
  let i = t === '"' ? "'" : '"', u = E(!1, e, /\\(.)|(["'])/gs, (o, l, f) => l === i ? l : f === t ? "\\" + f : f || (n && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(l) ? l : "\\" + l));
  return t + u + t;
}
var ln = El;
function Sl(e, t) {
  let n = e.slice(1, -1), i = t.parser === "json" || t.parser === "jsonc" || t.parser === "json5" && t.quoteProps === "preserve" && !t.singleQuote ? '"' : t.__isInHtmlAttribute ? "'" : un(n, t.singleQuote);
  return ln(n, i, !(t.parser === "css" || t.parser === "less" || t.parser === "scss" || t.__embeddedInHtml));
}
var Ot = Sl, Vr = class extends Error {
  constructor(t, n, i = "type") {
    super(`Unexpected ${n} node ${i}: ${JSON.stringify(t[i])}.`);
    Ts(this, "name", "UnexpectedNodeError");
    this.node = t;
  }
}, cn = Vr;
function Tl(e) {
  return (e == null ? void 0 : e.type) === "front-matter";
}
var Ee = Tl, Ol = /* @__PURE__ */ new Set(["raw", "raws", "sourceIndex", "source", "before", "after", "trailingComma", "spaces"]);
function fn(e, t, n) {
  if (Ee(e) && e.language === "yaml" && delete t.value, e.type === "css-comment" && n.type === "css-root" && n.nodes.length > 0 && ((n.nodes[0] === e || Ee(n.nodes[0]) && n.nodes[1] === e) && (delete t.text, /^\*\s*@(?:format|prettier)\s*$/.test(e.text)) || n.type === "css-root" && G(!1, n.nodes, -1) === e)) return null;
  if (e.type === "value-root" && delete t.text, (e.type === "media-query" || e.type === "media-query-list" || e.type === "media-feature-expression") && delete t.value, e.type === "css-rule" && delete t.params, (e.type === "media-feature" || e.type === "media-keyword" || e.type === "media-type" || e.type === "media-unknown" || e.type === "media-url" || e.type === "media-value" || e.type === "selector-attribute" || e.type === "selector-string" || e.type === "selector-class" || e.type === "selector-combinator" || e.type === "value-string") && e.value && (t.value = Cl(e.value)), e.type === "selector-combinator" && (t.value = E(!1, t.value, /\s+/g, " ")), e.type === "media-feature" && (t.value = E(!1, t.value, " ", "")), (e.type === "value-word" && (e.isColor && e.isHex || ["initial", "inherit", "unset", "revert"].includes(e.value.toLowerCase())) || e.type === "media-feature" || e.type === "selector-root-invalid" || e.type === "selector-pseudo") && (t.value = t.value.toLowerCase()), e.type === "css-decl" && (t.prop = e.prop.toLowerCase()), (e.type === "css-atrule" || e.type === "css-import") && (t.name = e.name.toLowerCase()), e.type === "value-number" && (t.unit = e.unit.toLowerCase()), e.type === "value-unknown" && (t.value = E(!1, t.value, /;$/g, "")), e.type === "selector-attribute" && (t.attribute = e.attribute.trim(), e.namespace && typeof e.namespace == "string" && (t.namespace = e.namespace.trim() || !0), e.value && (t.value = E(!1, t.value.trim(), /^["']|["']$/g, ""), delete t.quoted)), (e.type === "media-value" || e.type === "media-type" || e.type === "value-number" || e.type === "selector-root-invalid" || e.type === "selector-class" || e.type === "selector-combinator" || e.type === "selector-tag") && e.value && (t.value = E(!1, t.value, /([\d+.e-]+)([a-z]*)/gi, (i, u, o) => {
    let l = Number(u);
    return Number.isNaN(l) ? i : l + o.toLowerCase();
  })), e.type === "selector-tag") {
    let i = t.value.toLowerCase();
    ["from", "to"].includes(i) && (t.value = i);
  }
  if (e.type === "css-atrule" && e.name.toLowerCase() === "supports" && delete t.value, e.type === "selector-unknown" && delete t.value, e.type === "value-comma_group") {
    let i = e.groups.findIndex((u) => u.type === "value-number" && u.unit === "...");
    i !== -1 && (t.groups[i].unit = "", t.groups.splice(i + 1, 0, { type: "value-word", value: "...", isColor: !1, isHex: !1 }));
  }
  if (e.type === "value-comma_group" && e.groups.some((i) => i.type === "value-atword" && i.value.endsWith("[") || i.type === "value-word" && i.value.startsWith("]"))) return { type: "value-atword", value: e.groups.map((i) => i.value).join(""), group: { open: null, close: null, groups: [], type: "value-paren_group" } };
}
fn.ignoredProperties = Ol;
function Cl(e) {
  return E(!1, E(!1, e, "'", '"'), /\\([^\da-f])/gi, "$1");
}
var pn = fn;
async function Al(e, t) {
  if (e.language === "yaml") {
    let n = e.value.trim(), i = n ? await t(n, { parser: "yaml" }) : "";
    return nn([e.startDelimiter, e.explicitLanguage, k, i, i ? k : "", e.endDelimiter]);
  }
}
var hn = Al;
function dn(e) {
  let { node: t } = e;
  if (t.type === "front-matter") return async (n) => {
    let i = await hn(t, n);
    return i ? [i, k] : void 0;
  };
}
dn.getVisitorKeys = (e) => e.type === "css-root" ? ["frontMatter"] : [];
var mn = dn, Qe = null;
function Je(e) {
  if (Qe !== null && typeof Qe.property) {
    let t = Qe;
    return Qe = Je.prototype = null, t;
  }
  return Qe = Je.prototype = e ?? /* @__PURE__ */ Object.create(null), new Je();
}
var Nl = 10;
for (let e = 0; e <= Nl; e++) Je();
function Gr(e) {
  return Je(e);
}
function Pl(e, t = "type") {
  Gr(e);
  function n(i) {
    let u = i[t], o = e[u];
    if (!Array.isArray(o)) throw Object.assign(new Error(`Missing visitor keys for '${u}'.`), { node: i });
    return o;
  }
  return n;
}
var yn = Pl, Rl = { "front-matter": [], "css-root": ["frontMatter", "nodes"], "css-comment": [], "css-rule": ["selector", "nodes"], "css-decl": ["value", "selector", "nodes"], "css-atrule": ["selector", "params", "value", "nodes"], "media-query-list": ["nodes"], "media-query": ["nodes"], "media-type": [], "media-feature-expression": ["nodes"], "media-feature": [], "media-colon": [], "media-value": [], "media-keyword": [], "media-url": [], "media-unknown": [], "selector-root": ["nodes"], "selector-selector": ["nodes"], "selector-comment": [], "selector-string": [], "selector-tag": [], "selector-id": [], "selector-class": [], "selector-attribute": [], "selector-combinator": ["nodes"], "selector-universal": [], "selector-pseudo": ["nodes"], "selector-nesting": [], "selector-unknown": [], "value-value": ["group"], "value-root": ["group"], "value-comment": [], "value-comma_group": ["groups"], "value-paren_group": ["open", "groups", "close"], "value-func": ["group"], "value-paren": [], "value-number": [], "value-operator": [], "value-word": [], "value-colon": [], "value-comma": [], "value-string": [], "value-atword": [], "value-unicode-range": [], "value-unknown": [] }, wn = Rl, Il = yn(wn), gn = Il;
function ql(e, t) {
  let n = 0;
  for (let i = 0; i < e.line - 1; ++i) n = t.indexOf(`
`, n) + 1;
  return n + e.column;
}
var jr = ql;
function Ct(e) {
  return (t, n, i) => {
    let u = !!(i != null && i.backwards);
    if (n === !1) return !1;
    let { length: o } = t, l = n;
    for (; l >= 0 && l < o; ) {
      let f = t.charAt(l);
      if (e instanceof RegExp) {
        if (!e.test(f)) return l;
      } else if (!e.includes(f)) return l;
      u ? l-- : l++;
    }
    return l === -1 || l === o ? l : !1;
  };
}
var At = Ct(" 	"), vn = Ct(",; 	"), Nt = Ct(/[^\n\r]/);
function xn(e, t) {
  var n, i, u;
  if (typeof ((i = (n = e.source) == null ? void 0 : n.start) == null ? void 0 : i.offset) == "number") return e.source.start.offset;
  if (typeof e.sourceIndex == "number") return e.sourceIndex;
  if ((u = e.source) != null && u.start) return jr(e.source.start, t);
  throw Object.assign(new Error("Can not locate node."), { node: e });
}
function Hr(e, t) {
  var n, i;
  if (e.type === "css-comment" && e.inline) return Nt(t, e.source.startOffset);
  if (typeof ((i = (n = e.source) == null ? void 0 : n.end) == null ? void 0 : i.offset) == "number") return e.source.end.offset;
  if (e.source) {
    if (e.source.end) return jr(e.source.end, t);
    if (ee(e.nodes)) return Hr(G(!1, e.nodes, -1), t);
  }
  return null;
}
function Kr(e, t) {
  e.source && (e.source.startOffset = xn(e, t), e.source.endOffset = Hr(e, t));
  for (let n in e) {
    let i = e[n];
    n === "source" || !i || typeof i != "object" || (i.type === "value-root" || i.type === "value-unknown" ? bn(i, Ll(e), i.text || i.value) : Kr(i, t));
  }
}
function bn(e, t, n) {
  e.source && (e.source.startOffset = xn(e, n) + t, e.source.endOffset = Hr(e, n) + t);
  for (let i in e) {
    let u = e[i];
    i === "source" || !u || typeof u != "object" || bn(u, t, n);
  }
}
function Ll(e) {
  var t;
  let n = e.source.startOffset;
  return typeof e.prop == "string" && (n += e.prop.length), e.type === "css-atrule" && typeof e.name == "string" && (n += 1 + e.name.length + e.raws.afterName.match(/^\s*:?\s*/)[0].length), e.type !== "css-atrule" && typeof ((t = e.raws) == null ? void 0 : t.between) == "string" && (n += e.raws.between.length), n;
}
function _n(e) {
  let t = "initial", n = "initial", i, u = !1, o = [];
  for (let l = 0; l < e.length; l++) {
    let f = e[l];
    switch (t) {
      case "initial":
        if (f === "'") {
          t = "single-quotes";
          continue;
        }
        if (f === '"') {
          t = "double-quotes";
          continue;
        }
        if ((f === "u" || f === "U") && e.slice(l, l + 4).toLowerCase() === "url(") {
          t = "url", l += 3;
          continue;
        }
        if (f === "*" && e[l - 1] === "/") {
          t = "comment-block";
          continue;
        }
        if (f === "/" && e[l - 1] === "/") {
          t = "comment-inline", i = l - 1;
          continue;
        }
        continue;
      case "single-quotes":
        if (f === "'" && e[l - 1] !== "\\" && (t = n, n = "initial"), f === `
` || f === "\r") return e;
        continue;
      case "double-quotes":
        if (f === '"' && e[l - 1] !== "\\" && (t = n, n = "initial"), f === `
` || f === "\r") return e;
        continue;
      case "url":
        if (f === ")" && (t = "initial"), f === `
` || f === "\r") return e;
        if (f === "'") {
          t = "single-quotes", n = "url";
          continue;
        }
        if (f === '"') {
          t = "double-quotes", n = "url";
          continue;
        }
        continue;
      case "comment-block":
        f === "/" && e[l - 1] === "*" && (t = "initial");
        continue;
      case "comment-inline":
        (f === '"' || f === "'" || f === "*") && (u = !0), (f === `
` || f === "\r") && (u && o.push([i, l]), t = "initial", u = !1);
        continue;
    }
  }
  for (let [l, f] of o) e = e.slice(0, l) + E(!1, e.slice(l, f), /["'*]/g, " ") + e.slice(f);
  return e;
}
function N(e) {
  var t;
  return (t = e.source) == null ? void 0 : t.startOffset;
}
function P(e) {
  var t;
  return (t = e.source) == null ? void 0 : t.endOffset;
}
var te = ae(An());
function Vl(e) {
  if (!e.startsWith("#!")) return "";
  let t = e.indexOf(`
`);
  return t === -1 ? e : e.slice(0, t);
}
var Nn = Vl;
function Pn(e) {
  let t = Nn(e);
  t && (e = e.slice(t.length + 1));
  let n = (0, te.extract)(e), { pragmas: i, comments: u } = (0, te.parseWithComments)(n);
  return { shebang: t, text: e, pragmas: i, comments: u };
}
function Rn(e) {
  let { pragmas: t } = Pn(e);
  return Object.prototype.hasOwnProperty.call(t, "prettier") || Object.prototype.hasOwnProperty.call(t, "format");
}
function In(e) {
  let { shebang: t, text: n, pragmas: i, comments: u } = Pn(e), o = (0, te.strip)(n), l = (0, te.print)({ pragmas: { format: "", ...i }, comments: u.trimStart() });
  return (t ? `${t}
` : "") + l + (o.startsWith(`
`) ? `
` : `

`) + o;
}
var Xe = 3;
function Gl(e) {
  let t = e.slice(0, Xe);
  if (t !== "---" && t !== "+++") return;
  let n = e.indexOf(`
`, Xe);
  if (n === -1) return;
  let i = e.slice(Xe, n).trim(), u = e.indexOf(`
${t}`, n), o = i;
  if (o || (o = t === "+++" ? "toml" : "yaml"), u === -1 && t === "---" && o === "yaml" && (u = e.indexOf(`
...`, n)), u === -1) return;
  let l = u + 1 + Xe, f = e.charAt(l + 1);
  if (!/\s?/.test(f)) return;
  let d = e.slice(0, l);
  return { type: "front-matter", language: o, explicitLanguage: i, value: e.slice(n + 1, u), startDelimiter: t, endDelimiter: d.slice(-Xe), raw: d };
}
function jl(e) {
  let t = Gl(e);
  if (!t) return { content: e };
  let { raw: n } = t;
  return { frontMatter: t, content: E(!1, n, /[^\n]/g, " ") + e.slice(n.length) };
}
var Ze = jl;
function qn(e) {
  return Rn(Ze(e).content);
}
function Ln(e) {
  let { frontMatter: t, content: n } = Ze(e);
  return (t ? t.raw + `

` : "") + In(n);
}
var Hl = /* @__PURE__ */ new Set(["red", "green", "blue", "alpha", "a", "rgb", "hue", "h", "saturation", "s", "lightness", "l", "whiteness", "w", "blackness", "b", "tint", "shade", "blend", "blenda", "contrast", "hsl", "hsla", "hwb", "hwba"]);
function Dn(e) {
  var t, n;
  return (n = (t = e.findAncestor((i) => i.type === "css-decl")) == null ? void 0 : t.prop) == null ? void 0 : n.toLowerCase();
}
var Kl = /* @__PURE__ */ new Set(["initial", "inherit", "unset", "revert"]);
function Mn(e) {
  return Kl.has(e.toLowerCase());
}
function Bn(e, t) {
  var n;
  let i = e.findAncestor((u) => u.type === "css-atrule");
  return ((n = i == null ? void 0 : i.name) == null ? void 0 : n.toLowerCase().endsWith("keyframes")) && ["from", "to"].includes(t.toLowerCase());
}
function re(e) {
  return e.includes("$") || e.includes("@") || e.includes("#") || e.startsWith("%") || e.startsWith("--") || e.startsWith(":--") || e.includes("(") && e.includes(")") ? e : e.toLowerCase();
}
function Se(e, t) {
  var n;
  let i = e.findAncestor((u) => u.type === "value-func");
  return ((n = i == null ? void 0 : i.value) == null ? void 0 : n.toLowerCase()) === t;
}
function Un(e) {
  var t;
  let n = e.findAncestor((u) => u.type === "css-rule"), i = (t = n == null ? void 0 : n.raws) == null ? void 0 : t.selector;
  return i && (i.startsWith(":import") || i.startsWith(":export"));
}
function Te(e, t) {
  let n = Array.isArray(t) ? t : [t], i = e.findAncestor((u) => u.type === "css-atrule");
  return i && n.includes(i.name.toLowerCase());
}
function Fn(e) {
  var t;
  let { node: n } = e;
  return n.groups[0].value === "url" && n.groups.length === 2 && ((t = e.findAncestor((i) => i.type === "css-atrule")) == null ? void 0 : t.name) === "import";
}
function $n(e) {
  return e.type === "value-func" && e.value.toLowerCase() === "url";
}
function Wn(e) {
  return e.type === "value-func" && e.value.toLowerCase() === "var";
}
function Pt(e, t) {
  var n;
  let i = (n = e.parent) == null ? void 0 : n.nodes;
  return i && i.indexOf(t) === i.length - 1;
}
function Yn(e) {
  let { selector: t } = e;
  return t ? typeof t == "string" && /^@.+:.*$/.test(t) || t.value && /^@.+:.*$/.test(t.value) : !1;
}
function zn(e) {
  return e.type === "value-word" && ["from", "through", "end"].includes(e.value);
}
function Vn(e) {
  return e.type === "value-word" && ["and", "or", "not"].includes(e.value);
}
function Gn(e) {
  return e.type === "value-word" && e.value === "in";
}
function Rt(e) {
  return e.type === "value-operator" && e.value === "*";
}
function et(e) {
  return e.type === "value-operator" && e.value === "/";
}
function Q(e) {
  return e.type === "value-operator" && e.value === "+";
}
function pe(e) {
  return e.type === "value-operator" && e.value === "-";
}
function Ql(e) {
  return e.type === "value-operator" && e.value === "%";
}
function It(e) {
  return Rt(e) || et(e) || Q(e) || pe(e) || Ql(e);
}
function jn(e) {
  return e.type === "value-word" && ["==", "!="].includes(e.value);
}
function Hn(e) {
  return e.type === "value-word" && ["<", ">", "<=", ">="].includes(e.value);
}
function tt(e, t) {
  return t.parser === "scss" && e.type === "css-atrule" && ["if", "else", "for", "each", "while"].includes(e.name);
}
function Jr(e) {
  var t;
  return ((t = e.raws) == null ? void 0 : t.params) && /^\(\s*\)$/.test(e.raws.params);
}
function qt(e) {
  return e.name.startsWith("prettier-placeholder");
}
function Kn(e) {
  return e.prop.startsWith("@prettier-placeholder");
}
function Qn(e, t) {
  return e.value === "$$" && e.type === "value-func" && (t == null ? void 0 : t.type) === "value-word" && !t.raws.before;
}
function Jn(e) {
  var t, n;
  return ((t = e.value) == null ? void 0 : t.type) === "value-root" && ((n = e.value.group) == null ? void 0 : n.type) === "value-value" && e.prop.toLowerCase() === "composes";
}
function Xn(e) {
  var t, n, i;
  return ((i = (n = (t = e.value) == null ? void 0 : t.group) == null ? void 0 : n.group) == null ? void 0 : i.type) === "value-paren_group" && e.value.group.group.open !== null && e.value.group.group.close !== null;
}
function he(e) {
  var t;
  return ((t = e.raws) == null ? void 0 : t.before) === "";
}
function Lt(e) {
  var t, n;
  return e.type === "value-comma_group" && ((n = (t = e.groups) == null ? void 0 : t[1]) == null ? void 0 : n.type) === "value-colon";
}
function Qr(e) {
  var t;
  return e.type === "value-paren_group" && ((t = e.groups) == null ? void 0 : t[0]) && Lt(e.groups[0]);
}
function Xr(e, t) {
  var n;
  if (t.parser !== "scss") return !1;
  let { node: i } = e;
  if (i.groups.length === 0) return !1;
  let u = e.grandparent;
  if (!Qr(i) && !(u && Qr(u))) return !1;
  let o = e.findAncestor((l) => l.type === "css-decl");
  return !!((n = o == null ? void 0 : o.prop) != null && n.startsWith("$") || Qr(u) || u.type === "value-func");
}
function Zr(e) {
  return e.type === "value-comment" && e.inline;
}
function Dt(e) {
  return e.type === "value-word" && e.value === "#";
}
function es(e) {
  return e.type === "value-word" && e.value === "{";
}
function Mt(e) {
  return e.type === "value-word" && e.value === "}";
}
function rt(e) {
  return ["value-word", "value-atword"].includes(e.type);
}
function Bt(e) {
  return (e == null ? void 0 : e.type) === "value-colon";
}
function Zn(e, t) {
  if (!Lt(t)) return !1;
  let { groups: n } = t, i = n.indexOf(e);
  return i === -1 ? !1 : Bt(n[i + 1]);
}
function ei(e) {
  return e.value && ["not", "and", "or"].includes(e.value.toLowerCase());
}
function ti(e) {
  return e.type !== "value-func" ? !1 : Hl.has(e.value.toLowerCase());
}
function Oe(e) {
  return /\/\//.test(e.split(/[\n\r]/).pop());
}
function st(e) {
  return (e == null ? void 0 : e.type) === "value-atword" && e.value.startsWith("prettier-placeholder-");
}
function ri(e, t) {
  var n, i;
  if (((n = e.open) == null ? void 0 : n.value) !== "(" || ((i = e.close) == null ? void 0 : i.value) !== ")" || e.groups.some((u) => u.type !== "value-comma_group")) return !1;
  if (t.type === "value-comma_group") {
    let u = t.groups.indexOf(e) - 1, o = t.groups[u];
    if ((o == null ? void 0 : o.type) === "value-word" && o.value === "with") return !0;
  }
  return !1;
}
function nt(e) {
  var t, n;
  return e.type === "value-paren_group" && ((t = e.open) == null ? void 0 : t.value) === "(" && ((n = e.close) == null ? void 0 : n.value) === ")";
}
function Jl(e, t, n) {
  var i;
  let { node: u } = e, o = e.parent, l = e.grandparent, f = Dn(e), d = f && o.type === "value-value" && (f === "grid" || f.startsWith("grid-template")), p = e.findAncestor((C) => C.type === "css-atrule"), c = p && tt(p, t), a = u.groups.some((C) => Zr(C)), m = e.map(n, "groups"), g = [], v = Se(e, "url"), h = !1, F = !1;
  for (let C = 0; C < u.groups.length; ++C) {
    g.push(m[C]);
    let _ = u.groups[C - 1], H = u.groups[C], Dr = u.groups[C + 1], ge = u.groups[C + 2];
    if (v) {
      (Dr && Q(Dr) || Q(H)) && g.push(" ");
      continue;
    }
    if (Te(e, "forward") && H.type === "value-word" && H.value && _ !== void 0 && _.type === "value-word" && _.value === "as" && Dr.type === "value-operator" && Dr.value === "*" || !Dr || H.type === "value-word" && H.value.endsWith("-") && st(Dr)) continue;
    if (H.type === "value-string" && H.quoted) {
      let ks = H.value.lastIndexOf("#{"), Cs = H.value.lastIndexOf("}");
      ks !== -1 && Cs !== -1 ? h = ks > Cs : ks !== -1 ? h = !0 : Cs !== -1 && (h = !1);
    }
    if (h || Bt(H) || Bt(Dr) || H.type === "value-atword" && (H.value === "" || H.value.endsWith("[")) || Dr.type === "value-word" && Dr.value.startsWith("]") || H.value === "~" || H.type !== "value-string" && H.value && H.value.includes("\\") && Dr && Dr.type !== "value-comment" || _ != null && _.value && _.value.indexOf("\\") === _.value.length - 1 && H.type === "value-operator" && H.value === "/" || H.value === "\\" || Qn(H, Dr) || Dt(H) || es(H) || Mt(Dr) || es(Dr) && he(Dr) || Mt(H) && he(Dr) || H.value === "--" && Dt(Dr)) continue;
    let gt = It(H), yt = It(Dr);
    if ((gt && Dt(Dr) || yt && Mt(H)) && he(Dr) || !_ && et(H) || Se(e, "calc") && (Q(H) || Q(Dr) || pe(H) || pe(Dr)) && he(Dr)) continue;
    let ns = (Q(H) || pe(H)) && C === 0 && (Dr.type === "value-number" || Dr.isHex) && l && ti(l) && !he(Dr), us = (ge == null ? void 0 : ge.type) === "value-func" || ge && rt(ge) || H.type === "value-func" || rt(H), ms = Dr.type === "value-func" || rt(Dr) || (_ == null ? void 0 : _.type) === "value-func" || _ && rt(_);
    if (t.parser === "scss" && gt && H.value === "-" && Dr.type === "value-func" && P(H) !== N(Dr)) {
      g.push(" ");
      continue;
    }
    if (!(!(Rt(Dr) || Rt(H)) && !Se(e, "calc") && !ns && (et(Dr) && !us || et(H) && !ms || Q(Dr) && !us || Q(H) && !ms || pe(Dr) || pe(H)) && (he(Dr) || gt && (!_ || _ && It(_)))) && !((t.parser === "scss" || t.parser === "less") && gt && H.value === "-" && nt(Dr) && P(H) === N(Dr.open) && Dr.open.value === "(")) {
      if (Zr(H)) {
        if (o.type === "value-paren_group") {
          g.push(ce(k));
          continue;
        }
        g.push(k);
        continue;
      }
      if (c && (jn(Dr) || Hn(Dr) || Vn(Dr) || Gn(H) || zn(H))) {
        g.push(" ");
        continue;
      }
      if (p && p.name.toLowerCase() === "namespace") {
        g.push(" ");
        continue;
      }
      if (d) {
        H.source && Dr.source && H.source.start.line !== Dr.source.start.line ? (g.push(k), F = !0) : g.push(" ");
        continue;
      }
      if (yt) {
        g.push(" ");
        continue;
      }
      if ((Dr == null ? void 0 : Dr.value) !== "..." && !(st(H) && st(Dr) && P(H) === N(Dr))) {
        if (st(H) && nt(Dr) && P(H) === N(Dr.open)) {
          g.push(M);
          continue;
        }
        if (H.value === "with" && nt(Dr)) {
          g.push(" ");
          continue;
        }
        (i = H.value) != null && i.endsWith("#") && Dr.value === "{" && nt(Dr.group) || g.push(A);
      }
    }
  }
  return a && g.push(Ke), F && g.unshift(k), c ? L(q(g)) : Fn(e) ? L(He(g)) : L(q(He(g)));
}
var si = Jl;
function Xl(e) {
  return e.length === 1 ? e : e.toLowerCase().replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(?=\d)/, "$1$2").replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1").replace(/^([+-])?\./, "$10.").replace(/(\.\d+?)0+(?=e|$)/, "$1").replace(/\.(?=e|$)/, "");
}
var ni = Xl, ts = /* @__PURE__ */ new Map([["em", "em"], ["rem", "rem"], ["ex", "ex"], ["rex", "rex"], ["cap", "cap"], ["rcap", "rcap"], ["ch", "ch"], ["rch", "rch"], ["ic", "ic"], ["ric", "ric"], ["lh", "lh"], ["rlh", "rlh"], ["vw", "vw"], ["svw", "svw"], ["lvw", "lvw"], ["dvw", "dvw"], ["vh", "vh"], ["svh", "svh"], ["lvh", "lvh"], ["dvh", "dvh"], ["vi", "vi"], ["svi", "svi"], ["lvi", "lvi"], ["dvi", "dvi"], ["vb", "vb"], ["svb", "svb"], ["lvb", "lvb"], ["dvb", "dvb"], ["vmin", "vmin"], ["svmin", "svmin"], ["lvmin", "lvmin"], ["dvmin", "dvmin"], ["vmax", "vmax"], ["svmax", "svmax"], ["lvmax", "lvmax"], ["dvmax", "dvmax"], ["cm", "cm"], ["mm", "mm"], ["q", "Q"], ["in", "in"], ["pt", "pt"], ["pc", "pc"], ["px", "px"], ["deg", "deg"], ["grad", "grad"], ["rad", "rad"], ["turn", "turn"], ["s", "s"], ["ms", "ms"], ["hz", "Hz"], ["khz", "kHz"], ["dpi", "dpi"], ["dpcm", "dpcm"], ["dppx", "dppx"], ["x", "x"], ["cqw", "cqw"], ["cqh", "cqh"], ["cqi", "cqi"], ["cqb", "cqb"], ["cqmin", "cqmin"], ["cqmax", "cqmax"]]);
function ii(e) {
  let t = e.toLowerCase();
  return ts.has(t) ? ts.get(t) : e;
}
var oi = /(["'])(?:(?!\1)[^\\]|\\.)*\1/gs, Zl = /(?:\d*\.\d+|\d+\.?)(?:e[+-]?\d+)?/gi, ec = /[a-z]+/gi, tc = /[$@]?[_a-z\u0080-\uFFFF][\w\u0080-\uFFFF-]*/gi, rc = new RegExp(oi.source + `|(${tc.source})?(${Zl.source})(${ec.source})?`, "gi");
function W(e, t) {
  return E(!1, e, oi, (n) => Ot(n, t));
}
function ai(e, t) {
  let n = t.singleQuote ? "'" : '"';
  return e.includes('"') || e.includes("'") ? e : n + e + n;
}
function de(e) {
  return E(!1, e, rc, (t, n, i, u, o) => !i && u ? rs(u) + re(o || "") : t);
}
function rs(e) {
  return ni(e).replace(/\.0(?=$|e)/, "");
}
function ui(e) {
  return e.trailingComma === "es5" || e.trailingComma === "all";
}
function sc(e, t, n) {
  let i = !!(n != null && n.backwards);
  if (t === !1) return !1;
  let u = e.charAt(t);
  if (i) {
    if (e.charAt(t - 1) === "\r" && u === `
`) return t - 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t - 1;
  } else {
    if (u === "\r" && e.charAt(t + 1) === `
`) return t + 2;
    if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029") return t + 1;
  }
  return t;
}
var Ut = sc;
function nc(e, t, n = {}) {
  let i = At(e, n.backwards ? t - 1 : t, n), u = Ut(e, i, n);
  return i !== u;
}
var Ft = nc;
function ic(e, t) {
  if (t === !1) return !1;
  if (e.charAt(t) === "/" && e.charAt(t + 1) === "*") {
    for (let n = t + 2; n < e.length; ++n) if (e.charAt(n) === "*" && e.charAt(n + 1) === "/") return n + 2;
  }
  return t;
}
var li = ic;
function oc(e, t) {
  return t === !1 ? !1 : e.charAt(t) === "/" && e.charAt(t + 1) === "/" ? Nt(e, t) : t;
}
var ci = oc;
function ac(e, t) {
  let n = null, i = t;
  for (; i !== n; ) n = i, i = vn(e, i), i = li(e, i), i = At(e, i);
  return i = ci(e, i), i = Ut(e, i), i !== !1 && Ft(e, i);
}
var $t = ac;
function uc({ node: e, parent: t }, n) {
  return !!(e.source && n.originalText.slice(N(e), N(t.close)).trimEnd().endsWith(","));
}
function lc(e, t) {
  return Wn(e.grandparent) && uc(e, t) ? "," : e.node.type !== "value-comment" && !(e.node.type === "value-comma_group" && e.node.groups.every((n) => n.type === "value-comment")) && ui(t) && e.callParent(() => Xr(e, t)) ? St(",") : "";
}
function fi(e, t, n) {
  let { node: i, parent: u } = e, o = e.map(({ node: g }) => typeof g == "string" ? g : n(), "groups");
  if (u && $n(u) && (i.groups.length === 1 || i.groups.length > 0 && i.groups[0].type === "value-comma_group" && i.groups[0].groups.length > 0 && i.groups[0].groups[0].type === "value-word" && i.groups[0].groups[0].value.startsWith("data:"))) return [i.open ? n("open") : "", V(",", o), i.close ? n("close") : ""];
  if (!i.open) {
    let g = ss(e), v = V([",", g ? k : A], o);
    return q(g ? [k, v] : L(He(v)));
  }
  let l = e.map(({ node: g, isLast: v, index: h }) => {
    var F;
    let C = o[h];
    if (Lt(g) && g.type === "value-comma_group" && g.groups && g.groups[0].type !== "value-paren_group" && ((F = g.groups[2]) == null ? void 0 : F.type) === "value-paren_group") {
      let { parts: H } = C.contents.contents;
      H[1] = L(H[1]), C = L(ce(C));
    }
    let _ = [C, v ? lc(e, t) : ","];
    if (!v && g.type === "value-comma_group" && ee(g.groups)) {
      let H = G(!1, g.groups, -1);
      !H.source && H.close && (H = H.close), H.source && $t(t.originalText, P(H)) && _.push(k);
    }
    return _;
  }, "groups"), f = Zn(i, u), d = ri(i, u), p = Xr(e, t), c = d || p && !f, a = d || f, m = L([i.open ? n("open") : "", q([M, V(A, l)]), M, i.close ? n("close") : ""], { shouldBreak: c });
  return a ? ce(m) : m;
}
function ss(e) {
  return e.match((t) => t.type === "value-paren_group" && !t.open && t.groups.some((n) => n.type === "value-comma_group"), (t, n) => n === "group" && t.type === "value-value", (t, n) => n === "group" && t.type === "value-root", (t, n) => n === "value" && (t.type === "css-decl" && !t.prop.startsWith("--") || t.type === "css-atrule" && t.variable));
}
function cc(e, t, n) {
  let i = [];
  return e.each(() => {
    let { node: u, previous: o } = e;
    if ((o == null ? void 0 : o.type) === "css-comment" && o.text.trim() === "prettier-ignore" ? i.push(t.originalText.slice(N(u), P(u))) : i.push(n()), e.isLast) return;
    let { next: l } = e;
    l.type === "css-comment" && !Ft(t.originalText, N(l), { backwards: !0 }) && !Ee(u) || l.type === "css-atrule" && l.name === "else" && u.type !== "css-comment" ? i.push(" ") : (i.push(t.__isHTMLStyleAttribute ? A : k), $t(t.originalText, P(u)) && !Ee(u) && i.push(k));
  }, "nodes"), i;
}
var Ce = cc;
function fc(e, t, n) {
  var i, u, o, l, f, d;
  let { node: p } = e;
  switch (p.type) {
    case "front-matter":
      return [p.raw, k];
    case "css-root": {
      let c = Ce(e, t, n), a = p.raws.after.trim();
      return a.startsWith(";") && (a = a.slice(1).trim()), [p.frontMatter ? [n("frontMatter"), k] : "", c, a ? ` ${a}` : "", p.nodes.length > 0 ? k : ""];
    }
    case "css-comment": {
      let c = p.inline || p.raws.inline, a = t.originalText.slice(N(p), P(p));
      return c ? a.trimEnd() : a;
    }
    case "css-rule":
      return [n("selector"), p.important ? " !important" : "", p.nodes ? [((i = p.selector) == null ? void 0 : i.type) === "selector-unknown" && Oe(p.selector.value) ? A : p.selector ? " " : "", "{", p.nodes.length > 0 ? q([k, Ce(e, t, n)]) : "", k, "}", Yn(p) ? ";" : ""] : ";"];
    case "css-decl": {
      let c = e.parent, { between: a } = p.raws, m = a.trim(), g = m === ":", v = typeof p.value == "string" && /^ *$/.test(p.value), h = typeof p.value == "string" ? p.value : n("value");
      return h = Jn(p) ? on(h) : h, !g && Oe(m) && !((o = (u = p.value) == null ? void 0 : u.group) != null && o.group && e.call(() => ss(e), "value", "group", "group")) && (h = q([k, ce(h)])), [E(!1, p.raws.before, /[\s;]/g, ""), c.type === "css-atrule" && c.variable || Un(e) ? p.prop : re(p.prop), m.startsWith("//") ? " " : "", m, p.extend || v ? "" : " ", t.parser === "less" && p.extend && p.selector ? ["extend(", n("selector"), ")"] : "", h, p.raws.important ? p.raws.important.replace(/\s*!\s*important/i, " !important") : p.important ? " !important" : "", p.raws.scssDefault ? p.raws.scssDefault.replace(/\s*!default/i, " !default") : p.scssDefault ? " !default" : "", p.raws.scssGlobal ? p.raws.scssGlobal.replace(/\s*!global/i, " !global") : p.scssGlobal ? " !global" : "", p.nodes ? [" {", q([M, Ce(e, t, n)]), M, "}"] : Kn(p) && !c.raws.semicolon && t.originalText[P(p) - 1] !== ";" ? "" : t.__isHTMLStyleAttribute && Pt(e, p) ? St(";") : ";"];
    }
    case "css-atrule": {
      let c = e.parent, a = qt(p) && !c.raws.semicolon && t.originalText[P(p) - 1] !== ";";
      if (t.parser === "less") {
        if (p.mixin) return [n("selector"), p.important ? " !important" : "", a ? "" : ";"];
        if (p.function) return [p.name, typeof p.params == "string" ? p.params : n("params"), a ? "" : ";"];
        if (p.variable) return ["@", p.name, ": ", p.value ? n("value") : "", p.raws.between.trim() ? p.raws.between.trim() + " " : "", p.nodes ? ["{", q([p.nodes.length > 0 ? M : "", Ce(e, t, n)]), M, "}"] : "", a ? "" : ";"];
      }
      let m = p.name === "import" && ((l = p.params) == null ? void 0 : l.type) === "value-unknown" && p.params.value.endsWith(";");
      return ["@", Jr(p) || p.name.endsWith(":") || qt(p) ? p.name : re(p.name), p.params ? [Jr(p) ? "" : qt(p) ? p.raws.afterName === "" ? "" : p.name.endsWith(":") ? " " : /^\s*\n\s*\n/.test(p.raws.afterName) ? [k, k] : /^\s*\n/.test(p.raws.afterName) ? k : " " : " ", typeof p.params == "string" ? p.params : n("params")] : "", p.selector ? q([" ", n("selector")]) : "", p.value ? L([" ", n("value"), tt(p, t) ? Xn(p) ? " " : A : ""]) : p.name === "else" ? " " : "", p.nodes ? [tt(p, t) ? "" : p.selector && !p.selector.nodes && typeof p.selector.value == "string" && Oe(p.selector.value) || !p.selector && typeof p.params == "string" && Oe(p.params) ? A : " ", "{", q([p.nodes.length > 0 ? M : "", Ce(e, t, n)]), M, "}"] : a || m ? "" : ";"];
    }
    case "media-query-list": {
      let c = [];
      return e.each(({ node: a }) => {
        a.type === "media-query" && a.value === "" || c.push(n());
      }, "nodes"), L(q(V(A, c)));
    }
    case "media-query":
      return [V(" ", e.map(n, "nodes")), Pt(e, p) ? "" : ","];
    case "media-type":
      return de(W(p.value, t));
    case "media-feature-expression":
      return p.nodes ? ["(", ...e.map(n, "nodes"), ")"] : p.value;
    case "media-feature":
      return re(W(E(!1, p.value, / +/g, " "), t));
    case "media-colon":
      return [p.value, " "];
    case "media-value":
      return de(W(p.value, t));
    case "media-keyword":
      return W(p.value, t);
    case "media-url":
      return W(E(!1, E(!1, p.value, /^url\(\s+/gi, "url("), /\s+\)$/g, ")"), t);
    case "media-unknown":
      return p.value;
    case "selector-root":
      return L([Te(e, "custom-selector") ? [e.findAncestor((c) => c.type === "css-atrule").customSelector, A] : "", V([",", Te(e, ["extend", "custom-selector", "nest"]) ? A : k], e.map(n, "nodes"))]);
    case "selector-selector":
      return L(q(e.map(n, "nodes")));
    case "selector-comment":
      return p.value;
    case "selector-string":
      return W(p.value, t);
    case "selector-tag":
      return [p.namespace ? [p.namespace === !0 ? "" : p.namespace.trim(), "|"] : "", ((f = e.previous) == null ? void 0 : f.type) === "selector-nesting" ? p.value : de(Bn(e, p.value) ? p.value.toLowerCase() : p.value)];
    case "selector-id":
      return ["#", p.value];
    case "selector-class":
      return [".", de(W(p.value, t))];
    case "selector-attribute":
      return ["[", p.namespace ? [p.namespace === !0 ? "" : p.namespace.trim(), "|"] : "", p.attribute.trim(), p.operator ?? "", p.value ? ai(W(p.value.trim(), t), t) : "", p.insensitive ? " i" : "", "]"];
    case "selector-combinator": {
      if (p.value === "+" || p.value === ">" || p.value === "~" || p.value === ">>>") {
        let m = e.parent;
        return [m.type === "selector-selector" && m.nodes[0] === p ? "" : A, p.value, Pt(e, p) ? "" : " "];
      }
      let c = p.value.trim().startsWith("(") ? A : "", a = de(W(p.value.trim(), t)) || A;
      return [c, a];
    }
    case "selector-universal":
      return [p.namespace ? [p.namespace === !0 ? "" : p.namespace.trim(), "|"] : "", p.value];
    case "selector-pseudo":
      return [re(p.value), ee(p.nodes) ? L(["(", q([M, V([",", A], e.map(n, "nodes"))]), M, ")"]) : ""];
    case "selector-nesting":
      return p.value;
    case "selector-unknown": {
      let c = e.findAncestor((g) => g.type === "css-rule");
      if (c != null && c.isSCSSNesterProperty) return de(W(re(p.value), t));
      let a = e.parent;
      if ((d = a.raws) != null && d.selector) {
        let g = N(a), v = g + a.raws.selector.length;
        return t.originalText.slice(g, v).trim();
      }
      let m = e.grandparent;
      if (a.type === "value-paren_group" && (m == null ? void 0 : m.type) === "value-func" && m.value === "selector") {
        let g = P(a.open) + 1, v = N(a.close), h = t.originalText.slice(g, v).trim();
        return Oe(h) ? [Ke, h] : h;
      }
      return p.value;
    }
    case "value-value":
    case "value-root":
      return n("group");
    case "value-comment":
      return t.originalText.slice(N(p), P(p));
    case "value-comma_group":
      return si(e, t, n);
    case "value-paren_group":
      return fi(e, t, n);
    case "value-func":
      return [p.value, Te(e, "supports") && ei(p) ? " " : "", n("group")];
    case "value-paren":
      return p.value;
    case "value-number":
      return [rs(p.value), ii(p.unit)];
    case "value-operator":
      return p.value;
    case "value-word":
      return p.isColor && p.isHex || Mn(p.value) ? p.value.toLowerCase() : p.value;
    case "value-colon": {
      let { previous: c } = e;
      return [p.value, typeof (c == null ? void 0 : c.value) == "string" && c.value.endsWith("\\") || Se(e, "url") ? "" : A];
    }
    case "value-string":
      return Ot(p.raws.quote + p.value + p.raws.quote, t);
    case "value-atword":
      return ["@", p.value];
    case "value-unicode-range":
      return p.value;
    case "value-unknown":
      return p.value;
    case "value-comma":
    default:
      throw new cn(p, "PostCSS");
  }
}
var pc = { print: fc, embed: mn, insertPragma: Ln, massageAstNode: pn, getVisitorKeys: gn }, pi = pc, hi = [{ linguistLanguageId: 50, name: "CSS", type: "markup", tmScope: "source.css", aceMode: "css", codemirrorMode: "css", codemirrorMimeType: "text/css", color: "#563d7c", extensions: [".css", ".wxss"], parsers: ["css"], vscodeLanguageIds: ["css"] }, { linguistLanguageId: 262764437, name: "PostCSS", type: "markup", color: "#dc3a0c", tmScope: "source.postcss", group: "CSS", extensions: [".pcss", ".postcss"], aceMode: "text", parsers: ["css"], vscodeLanguageIds: ["postcss"] }, { linguistLanguageId: 198, name: "Less", type: "markup", color: "#1d365d", aliases: ["less-css"], extensions: [".less"], tmScope: "source.css.less", aceMode: "less", codemirrorMode: "css", codemirrorMimeType: "text/css", parsers: ["less"], vscodeLanguageIds: ["less"] }, { linguistLanguageId: 329, name: "SCSS", type: "markup", color: "#c6538c", tmScope: "source.css.scss", aceMode: "scss", codemirrorMode: "css", codemirrorMimeType: "text/x-scss", extensions: [".scss"], parsers: ["scss"], vscodeLanguageIds: ["scss"] }], di = { bracketSpacing: { category: "Common", type: "boolean", default: !0, description: "Print spaces between brackets.", oppositeDescription: "Do not print spaces between brackets." }, singleQuote: { category: "Common", type: "boolean", default: !1, description: "Use single quotes instead of double quotes." }, proseWrap: { category: "Common", type: "choice", default: "preserve", description: "How to wrap prose.", choices: [{ value: "always", description: "Wrap prose if it exceeds the print width." }, { value: "never", description: "Do not wrap prose." }, { value: "preserve", description: "Wrap prose as-is." }] }, bracketSameLine: { category: "Common", type: "boolean", default: !1, description: "Put > of opening tags on the last line instead of on a new line." }, singleAttributePerLine: { category: "Common", type: "boolean", default: !1, description: "Enforce single attribute per line in HTML, Vue and JSX." } }, hc = { singleQuote: di.singleQuote }, mi = hc, Xs = {};
tn(Xs, { css: () => Ty, less: () => Oy, scss: () => Cy });
var tl = ae(dt()), rl = ae(_o()), sl = ae(ra());
function Zf(e, t) {
  let n = new SyntaxError(e + " (" + t.loc.start.line + ":" + t.loc.start.column + ")");
  return Object.assign(n, t);
}
var sa = Zf, ca = ae(la());
function J(e, t, n) {
  if (e && typeof e == "object") {
    delete e.parent;
    for (let i in e) J(e[i], t, n), i === "type" && typeof e[i] == "string" && !e[i].startsWith(t) && (!n || !n.test(e[i])) && (e[i] = t + e[i]);
  }
  return e;
}
function Ds(e) {
  if (e && typeof e == "object") {
    delete e.parent;
    for (let t in e) Ds(e[t]);
    !Array.isArray(e) && e.value && !e.type && (e.type = "unknown");
  }
  return e;
}
var fp = ca.default.default;
function pp(e) {
  let t;
  try {
    t = fp(e);
  } catch {
    return { type: "selector-unknown", value: e };
  }
  return J(Ds(t), "media-");
}
var fa = pp, iu = ae(nu());
function Tm(e) {
  if (/\/\/|\/\*/.test(e)) return { type: "selector-unknown", value: e.trim() };
  let t;
  try {
    new iu.default((n) => {
      t = n;
    }).process(e);
  } catch {
    return { type: "selector-unknown", value: e };
  }
  return J(t, "selector-");
}
var Z = Tm, Ju = ae(Gu()), dy = (e) => {
  for (; e.parent; ) e = e.parent;
  return e;
}, Fr = dy;
function my(e) {
  return Fr(e).text.slice(e.group.open.sourceIndex + 1, e.group.close.sourceIndex).trim();
}
var ju = my;
function yy(e) {
  if (ee(e)) {
    for (let t = e.length - 1; t > 0; t--) if (e[t].type === "word" && e[t].value === "{" && e[t - 1].type === "word" && e[t - 1].value.endsWith("#")) return !0;
  }
  return !1;
}
var Hu = yy;
function wy(e) {
  return e.some((t) => t.type === "string" || t.type === "func" && !t.value.endsWith("\\"));
}
var Ku = wy;
function gy(e, t) {
  return !!(t.parser === "scss" && (e == null ? void 0 : e.type) === "word" && e.value.startsWith("$"));
}
var Qu = gy;
function vy(e, t) {
  var n;
  let { nodes: i } = e, u = { open: null, close: null, groups: [], type: "paren_group" }, o = [u], l = u, f = { groups: [], type: "comma_group" }, d = [f];
  for (let p = 0; p < i.length; ++p) {
    let c = i[p];
    if (t.parser === "scss" && c.type === "number" && c.unit === ".." && c.value.endsWith(".") && (c.value = c.value.slice(0, -1), c.unit = "..."), c.type === "func" && c.value === "selector" && (c.group.groups = [Z(Fr(e).text.slice(c.group.open.sourceIndex + 1, c.group.close.sourceIndex))]), c.type === "func" && c.value === "url") {
      let a = ((n = c.group) == null ? void 0 : n.groups) ?? [], m = [];
      for (let g = 0; g < a.length; g++) {
        let v = a[g];
        v.type === "comma_group" ? m = [...m, ...v.groups] : m.push(v);
      }
      (Hu(m) || !Ku(m) && !Qu(m[0], t)) && (c.group.groups = [ju(c)]);
    }
    if (c.type === "paren" && c.value === "(") u = { open: c, close: null, groups: [], type: "paren_group" }, o.push(u), f = { groups: [], type: "comma_group" }, d.push(f);
    else if (c.type === "paren" && c.value === ")") {
      if (f.groups.length > 0 && u.groups.push(f), u.close = c, d.length === 1) throw new Error("Unbalanced parenthesis");
      d.pop(), f = G(!1, d, -1), f.groups.push(u), o.pop(), u = G(!1, o, -1);
    } else c.type === "comma" ? (u.groups.push(f), f = { groups: [], type: "comma_group" }, d[d.length - 1] = f) : f.groups.push(c);
  }
  return f.groups.length > 0 && u.groups.push(f), l;
}
function $r(e) {
  return e.type === "paren_group" && !e.open && !e.close && e.groups.length === 1 || e.type === "comma_group" && e.groups.length === 1 ? $r(e.groups[0]) : e.type === "paren_group" || e.type === "comma_group" ? { ...e, groups: e.groups.map($r) } : e;
}
function Xu(e, t) {
  if (e && typeof e == "object") for (let n in e) n !== "parent" && (Xu(e[n], t), n === "nodes" && (e.group = $r(vy(e, t)), delete e[n]));
  return e;
}
function xy(e, t) {
  if (t.parser === "less" && e.startsWith("~`")) return { type: "value-unknown", value: e };
  let n = null;
  try {
    n = new Ju.default(e, { loose: !0 }).parse();
  } catch {
    return { type: "value-unknown", value: e };
  }
  n.text = e;
  let i = Xu(n, t);
  return J(i, "value-", /^selector-/);
}
var oe = xy, by = /* @__PURE__ */ new Set(["import", "use", "forward"]);
function _y(e) {
  return by.has(e);
}
var Zu = _y;
function ky(e, t) {
  return t.parser !== "scss" || !e.selector ? !1 : e.selector.replace(/\/\*.*?\*\//, "").replace(/\/\/.*\n/, "").trim().endsWith(":");
}
var el = ky, Ey = /(\s*)(!default).*$/, Sy = /(\s*)(!global).*$/;
function nl(e, t) {
  var n, i;
  if (e && typeof e == "object") {
    delete e.parent;
    for (let f in e) nl(e[f], t);
    if (!e.type) return e;
    if (e.raws ?? (e.raws = {}), e.type === "css-decl" && typeof e.prop == "string" && e.prop.startsWith("--") && typeof e.value == "string" && e.value.startsWith("{")) {
      let f;
      if (e.value.trimEnd().endsWith("}")) {
        let d = t.originalText.slice(0, e.source.start.offset), p = "a".repeat(e.prop.length) + t.originalText.slice(e.source.start.offset + e.prop.length, e.source.end.offset), c = E(!1, d, /[^\n]/g, " ") + p, a;
        t.parser === "scss" ? a = al : t.parser === "less" ? a = ol : a = il;
        let m;
        try {
          m = a(c, { ...t });
        } catch {
        }
        ((n = m == null ? void 0 : m.nodes) == null ? void 0 : n.length) === 1 && m.nodes[0].type === "css-rule" && (f = m.nodes[0].nodes);
      }
      return f ? e.value = { type: "css-rule", nodes: f } : e.value = { type: "value-unknown", value: e.raws.value.raw }, e;
    }
    let u = "";
    typeof e.selector == "string" && (u = e.raws.selector ? e.raws.selector.scss ?? e.raws.selector.raw : e.selector, e.raws.between && e.raws.between.trim().length > 0 && (u += e.raws.between), e.raws.selector = u);
    let o = "";
    typeof e.value == "string" && (o = e.raws.value ? e.raws.value.scss ?? e.raws.value.raw : e.value, o = o.trim(), e.raws.value = o);
    let l = "";
    if (typeof e.params == "string" && (l = e.raws.params ? e.raws.params.scss ?? e.raws.params.raw : e.params, e.raws.afterName && e.raws.afterName.trim().length > 0 && (l = e.raws.afterName + l), e.raws.between && e.raws.between.trim().length > 0 && (l = l + e.raws.between), l = l.trim(), e.raws.params = l), u.trim().length > 0) return u.startsWith("@") && u.endsWith(":") ? e : e.mixin ? (e.selector = oe(u, t), e) : (el(e, t) && (e.isSCSSNesterProperty = !0), e.selector = Z(u), e);
    if (o.length > 0) {
      let f = o.match(Ey);
      f && (o = o.slice(0, f.index), e.scssDefault = !0, f[0].trim() !== "!default" && (e.raws.scssDefault = f[0]));
      let d = o.match(Sy);
      if (d && (o = o.slice(0, d.index), e.scssGlobal = !0, d[0].trim() !== "!global" && (e.raws.scssGlobal = d[0])), o.startsWith("progid:")) return { type: "value-unknown", value: o };
      e.value = oe(o, t);
    }
    if (t.parser === "less" && e.type === "css-decl" && o.startsWith("extend(") && (e.extend || (e.extend = e.raws.between === ":"), e.extend && !e.selector && (delete e.value, e.selector = Z(o.slice(7, -1)))), e.type === "css-atrule") {
      if (t.parser === "less") {
        if (e.mixin) {
          let f = e.raws.identifier + e.name + e.raws.afterName + e.raws.params;
          return e.selector = Z(f), delete e.params, e;
        }
        if (e.function) return e;
      }
      if (t.parser === "css" && e.name === "custom-selector") {
        let f = e.params.match(/:--\S+\s+/)[0].trim();
        return e.customSelector = f, e.selector = Z(e.params.slice(f.length).trim()), delete e.params, e;
      }
      if (t.parser === "less") {
        if (e.name.includes(":") && !e.params) {
          e.variable = !0;
          let f = e.name.split(":");
          e.name = f[0], e.value = oe(f.slice(1).join(":"), t);
        }
        if (!["page", "nest", "keyframes"].includes(e.name) && ((i = e.params) == null ? void 0 : i[0]) === ":") {
          e.variable = !0;
          let f = e.params.slice(1);
          f && (e.value = oe(f, t)), e.raws.afterName += ":";
        }
        if (e.variable) return delete e.params, e.value || delete e.value, e;
      }
    }
    if (e.type === "css-atrule" && l.length > 0) {
      let { name: f } = e, d = e.name.toLowerCase();
      return f === "warn" || f === "error" ? (e.params = { type: "media-unknown", value: l }, e) : f === "extend" || f === "nest" ? (e.selector = Z(l), delete e.params, e) : f === "at-root" ? (/^\(\s*(?:without|with)\s*:.+\)$/s.test(l) ? e.params = oe(l, t) : (e.selector = Z(l), delete e.params), e) : Zu(d) ? (e.import = !0, delete e.filename, e.params = oe(l, t), e) : ["namespace", "supports", "if", "else", "for", "each", "while", "debug", "mixin", "include", "function", "return", "define-mixin", "add-mixin"].includes(f) ? (l = l.replace(/(\$\S+?)(\s+)?\.{3}/, "$1...$2"), l = l.replace(/^(?!if)(\S+)(\s+)\(/, "$1($2"), e.value = oe(l, t), delete e.params, e) : ["media", "custom-media"].includes(d) ? l.includes("#{") ? { type: "media-unknown", value: l } : (e.params = fa(l), e) : (e.params = l, e);
    }
  }
  return e;
}
function Qs(e, t, n) {
  let i = Ze(t), { frontMatter: u } = i;
  t = i.content;
  let o;
  try {
    o = e(t, { map: !1 });
  } catch (l) {
    let { name: f, reason: d, line: p, column: c } = l;
    throw typeof p != "number" ? l : sa(`${f}: ${d}`, { loc: { start: { line: p, column: c } }, cause: l });
  }
  return n.originalText = t, o = nl(J(o, "css-"), n), Kr(o, t), u && (u.source = { startOffset: 0, endOffset: u.raw.length }, o.frontMatter = u), o;
}
function il(e, t = {}) {
  return Qs(tl.default.default, e, t);
}
function ol(e, t = {}) {
  return Qs((n) => rl.default.parse(_n(n)), e, t);
}
function al(e, t = {}) {
  return Qs(sl.default, e, t);
}
var Js = { astFormat: "postcss", hasPragma: qn, locStart: N, locEnd: P }, Ty = { ...Js, parse: il }, Oy = { ...Js, parse: ol }, Cy = { ...Js, parse: al }, Ay = { postcss: pi }, Nb = Zs;
function calcFrameTime(e, t, n) {
  const [i, u] = [e.start, t.start];
  return {
    start: i.value * n / 100,
    stop: u.value * n / 100
  };
}
function seekPreviousValue(e, t, n) {
  for (let i = e - 1; i >= 0; i--)
    if (n(t[i]))
      return i;
}
function parseTemplateFrame(e, t, n, i, u) {
  const [o, l] = [t[e], t[e + 1]], [f, d] = [n[e], n[e + 1]], p = calcFrameTime(o, l, i), c = {}, a = [.../* @__PURE__ */ new Set([...Object.keys(f), ...Object.keys(d)])], m = (v, h, F) => ({
    start: n[h][v],
    stop: n[F][v]
  });
  a.forEach((v) => {
    if (v in f && v in d)
      c[v] = m(v, e, e + 1);
    else if (!(v in f) && v in d) {
      const h = seekPreviousValue(e, n, (C) => v in C);
      if (h == null)
        return;
      const F = u[h];
      F.time = calcFrameTime(
        t[h],
        l,
        i
      ), F.interpVars[v] = m(v, h, e + 1);
    }
  });
  let g = o.transform;
  if (g == null) {
    const v = seekPreviousValue(e, u, (h) => h.transform != null);
    g = u[v].transform;
  }
  return {
    id: o.id,
    time: p,
    interpVars: c,
    transform: g,
    timingFunction: o.timingFunction
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
    Ts(this, "id", nextId++);
    Ts(this, "options");
    Ts(this, "templateFrames", []);
    Ts(this, "transformedVars", []);
    Ts(this, "frameId", 0);
    Ts(this, "frames", []);
    Ts(this, "startTime");
    Ts(this, "pausedTime", 0);
    Ts(this, "prevTime", 0);
    Ts(this, "t", 0);
    Ts(this, "iteration", 0);
    Ts(this, "started", !1);
    Ts(this, "done", !1);
    Ts(this, "reversed", !1);
    Ts(this, "paused", !1);
    this.target = n, this.options = { ...defaultOptions, ...t }, this.parseOptions(t);
  }
  frame(t, n, i, u) {
    t = typeof t == "number" ? String(t) + "%" : t;
    const o = CSSValueUnit.Value.tryParse(t), l = {
      id: this.frameId,
      start: o,
      vars: n,
      transform: i,
      timingFunction: getTimingFunction(u) ?? this.options.timingFunction
    };
    return this.templateFrames.push(l), this.frameId += 1, this;
  }
  transformVars() {
    return this.transformedVars = this.templateFrames.map((t) => transformObject(t.vars)), this;
  }
  parseFrames() {
    for (let t = 0; t < this.templateFrames.length; t++) {
      const n = this.templateFrames[t];
      if (n.start.unit === "ms") {
        n.start.unit = "%";
        const o = ((t > 0 ? this.templateFrames[t - 1].start.value : 0) * this.options.duration / 100 + n.start.value) / this.options.duration * 100;
        n.start.value = o;
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
    const n = this.options.duration, i = t / n;
    for (let u = 0; u < this.frames.length; u++) {
      const o = this.frames[u];
      o.time.start *= i, o.time.stop *= i;
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
      const i = this.frames[n], { start: u, stop: o } = i.time;
      if (t < u || t > o)
        continue;
      const l = scale(t, u, o, 0, 1), f = i.timingFunction(l), d = {};
      for (const [p, c] of Object.entries(i.interpVars))
        reverseTransformObject(
          p,
          c.start.lerp(f, c.stop, this.target),
          d
        );
      i.transform(t, d);
    }
  }
  interpFrames(t, n) {
    t = this.reversed ? this.options.duration - t : t;
    for (let i = 0; i < this.frames.length; i++) {
      const u = this.frames[i], { start: o, stop: l } = u.time;
      if (t < o || t > l)
        continue;
      const f = scale(t, o, l, 0, 1), d = u.timingFunction(f);
      for (const [p, c] of Object.entries(u.interpVars))
        n[p] = c.start.lerp(d, c.stop, this.target);
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
function reverseTransformStyle(e, t) {
  for (const [n, i] of Object.entries(t))
    if (typeof i == "object") {
      let u = "";
      for (const [o, l] of Object.entries(i))
        u += l.includes("(") ? l : `${o}(${l}) `;
      t[n] = u;
    }
  return t;
}
function transformTargetsStyle(e, t, n) {
  const i = {};
  for (const [u, o] of Object.entries(t))
    if (typeof o == "object") {
      let l = "";
      for (const [f, d] of Object.entries(o))
        l += d.includes("(") ? d : `${f}(${d})`;
      i[u] = l;
    } else
      i[u] = o;
  n.forEach((u) => {
    Object.assign(u.style, i);
  });
}
class CSSKeyframesAnimation {
  constructor(t = {}, ...n) {
    Ts(this, "options");
    Ts(this, "targets");
    Ts(this, "animation");
    this.options = { ...defaultOptions, ...t }, this.targets = n;
  }
  addTargets(...t) {
    return this.targets = t, this.animation && (this.animation.target = t[0]), this;
  }
  initAnimation() {
    var t;
    return this.animation = new Animation(this.options, (t = this.targets) == null ? void 0 : t[0]), this.options = this.animation.options, this;
  }
  fromFramesDefaultTransform(t) {
    this.initAnimation();
    for (const [n, i] of Object.entries(t))
      this.animation.frame(
        parseCSSPercent(n),
        i,
        this.transform.bind(this)
      );
    return this.animation.parse(), this;
  }
  fromVars(t, n) {
    this.initAnimation(), n = n ?? this.transform.bind(this);
    for (let i = 0; i < t.length; i++) {
      const u = t[i], o = Math.round(i / (t.length - 1) * 100);
      this.animation.frame(o, u, n);
    }
    return this.animation.parse(), this;
  }
  fromFrames(t) {
    this.initAnimation();
    for (const [n, i, u, o] of t)
      this.animation.frame(
        n,
        i,
        u,
        getTimingFunction(o)
      );
    return this.animation.parse(), this;
  }
  fromCSSKeyframes(t, n) {
    this.initAnimation(), n = n ?? this.transform.bind(this);
    const i = typeof t == "string" ? parseCSSKeyframes(t) : t;
    for (const [u, o] of Object.entries(i))
      this.animation.frame(Number(u), o, n), this.animation.transformedVars.push(o);
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
    Ts(this, "animationGroup", []);
    Ts(this, "transform");
    Ts(this, "paused", !1);
    Ts(this, "started", !1);
    Ts(this, "done", !1);
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
    let n = {}, i = !0;
    for (const o of this.animationGroup) {
      const { animation: l, values: f } = o;
      i = i && l.done, l.done || l.paused || l.interpFrames(l.t, f), n = { ...f, ...n };
    }
    this.done = i;
    const u = {};
    return Object.entries(n).forEach(([o, l]) => {
      reverseTransformObject(o, l, u);
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
function objectToString(e, t) {
  return typeof t == "object" && !(t instanceof ValueArray) ? Object.entries(t).map(([n, i]) => i instanceof FunctionValue ? String(i) : `${n}(${i})`).join(" ") : String(t);
}
async function CSSKeyframesToString(e, t = "animation", n = 80) {
  var a;
  const i = e.options, u = /* @__PURE__ */ new Map();
  e.templateFrames.forEach((m) => {
    let g = `{
`;
    const v = {};
    Object.entries(m.vars).forEach(([h, F]) => {
      reverseTransformObject(h, F, v);
    });
    for (let [h, F] of Object.entries(v)) {
      h = camelCaseToHyphen(h);
      let C = objectToString(h, F);
      g += `  ${h}: ${C};
`;
    }
    g += `  }
`, u.has(g) ? u.get(g).push(m.start) : u.set(g, [m.start]);
  });
  let o = "";
  for (let [m, g] of u)
    o += `${g.join(", ")} ${m}`;
  let l = `.${t} {
`;
  l += `  animation-name: ${t};
`;
  const f = reverseCSSTime(i.duration);
  l += `  animation-duration: ${f};
`;
  let d = ((a = Object.entries(timingFunctions).filter(([m, g]) => g === i.timingFunction).map(([m]) => m)) == null ? void 0 : a[0]) ?? "linear";
  l += `  animation-timing-function: ${d};
`, l += `  animation-iteration-count: ${isFinite(i.iterationCount) ? i.iterationCount : "infinite"};
`, l += `  animation-direction: ${i.direction};
`, l += `  animation-fill-mode: ${i.fillMode};
`, i.delay > 0 && (l += `  animation-delay: ${reverseCSSTime(i.delay)};
`), l += `}
`;
  const p = `${l}
@keyframes ${t} {
${o}}`;
  return (await ul$1.format(p, {
    parser: "scss",
    plugins: [Nb],
    printWidth: n
  })).replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
export {
  Animation,
  AnimationGroup,
  CSSKeyframesAnimation,
  CSSKeyframesToString,
  parseTemplateFrame,
  reverseTransformStyle
};
