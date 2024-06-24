var gl = Object.defineProperty;
var Dl = (f, k, j) => k in f ? gl(f, k, { enumerable: !0, configurable: !0, writable: !0, value: j }) : f[k] = j;
var rn = (f, k, j) => (Dl(f, typeof k != "symbol" ? k + "" : k, j), j);
function clamp(f, k, j) {
  return f < k ? k : f > j ? j : f;
}
function scale(f, k, j, we = 0, st = 1) {
  const Le = (st - we) / (j - k);
  return (f - k) * Le + we;
}
function lerp(f, k, j) {
  return (1 - f) * k + f * j;
}
function deCasteljau(f, k) {
  const j = k.length - 1, we = [...k];
  for (let st = 1; st <= j; st++)
    for (let Le = 0; Le <= j - st; Le++)
      we[Le] = lerp(f, we[Le], we[Le + 1]);
  return we[0];
}
function cubicBezier(f, k, j, we, st) {
  return [deCasteljau(f, [0, k, we, 1]), deCasteljau(f, [0, j, st, 1])];
}
function interpBezier(f, k) {
  const j = k.map((st) => st[0]), we = k.map((st) => st[1]);
  return [deCasteljau(f, j), deCasteljau(f, we)];
}
function linear(f) {
  return f;
}
function easeInQuad(f) {
  return f * f;
}
function easeOutQuad(f) {
  return -f * (f - 2);
}
function easeInOutQuad(f) {
  return (f /= 0.5) < 1 ? 0.5 * f * f : -0.5 * (--f * (f - 2) - 1);
}
function easeInCubic(f) {
  return f * f * f;
}
function easeOutCubic(f) {
  return (f = f - 1) * f * f + 1;
}
function easeInOutCubic(f) {
  return (f /= 0.5) < 1 ? 0.5 * f * f * f : 0.5 * ((f -= 2) * f * f + 2);
}
function smoothStep3(f) {
  return f * f * (3 - 2 * f);
}
const CSSBezier = (f, k, j, we) => (st) => (st = cubicBezier(st, f, k, j, we)[1], st);
function easeInBounce(f) {
  return f = CSSBezier(0.09, 0.91, 0.5, 1.5)(f), f;
}
function bounceInEase(f) {
  return f = CSSBezier(0.09, 0.91, 0.5, 1.5)(f), f;
}
function bounceInEaseHalf(f) {
  return f = interpBezier(f, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], f;
}
function jumpStart(f, k) {
  return Math.floor(f * k) / k;
}
function jumpEnd(f, k) {
  return Math.ceil(f * k) / k;
}
function jumpBoth(f, k) {
  return f === 0 || f === 1 ? f : jumpStart(f, k);
}
function jumpNone(f, k) {
  return Math.round(f * k) / k;
}
function steppedEase(f, k = "jump-start") {
  switch (k) {
    case "jump-none":
      return (j) => jumpNone(j, f);
    case "jump-start":
    case "start":
      return (j) => jumpStart(j, f);
    case "jump-end":
    case "end":
      return (j) => jumpEnd(j, f);
    case "jump-both":
      return (j) => jumpBoth(j, f);
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
function getDefaultExportFromCjs(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var parsimmon_umd_minExports = {}, parsimmon_umd_min = {
  get exports() {
    return parsimmon_umd_minExports;
  },
  set exports(f) {
    parsimmon_umd_minExports = f;
  }
};
(function(f, k) {
  (function(j, we) {
    f.exports = we();
  })(typeof self < "u" ? self : commonjsGlobal, function() {
    return function(j) {
      var we = {};
      function st(Le) {
        if (we[Le])
          return we[Le].exports;
        var pt = we[Le] = { i: Le, l: !1, exports: {} };
        return j[Le].call(pt.exports, pt, pt.exports, st), pt.l = !0, pt.exports;
      }
      return st.m = j, st.c = we, st.d = function(Le, pt, hr) {
        st.o(Le, pt) || Object.defineProperty(Le, pt, { configurable: !1, enumerable: !0, get: hr });
      }, st.r = function(Le) {
        Object.defineProperty(Le, "__esModule", { value: !0 });
      }, st.n = function(Le) {
        var pt = Le && Le.__esModule ? function() {
          return Le.default;
        } : function() {
          return Le;
        };
        return st.d(pt, "a", pt), pt;
      }, st.o = function(Le, pt) {
        return Object.prototype.hasOwnProperty.call(Le, pt);
      }, st.p = "", st(st.s = 0);
    }([function(j, we, st) {
      function Le(J) {
        if (!(this instanceof Le))
          return new Le(J);
        this._ = J;
      }
      var pt = Le.prototype;
      function hr(J, fe) {
        for (var Ee = 0; Ee < J; Ee++)
          fe(Ee);
      }
      function br(J, fe, Ee) {
        return function(Pe, et) {
          hr(et.length, function(Ae) {
            Pe(et[Ae], Ae, et);
          });
        }(function(Pe, et, Ae) {
          fe = J(fe, Pe, et, Ae);
        }, Ee), fe;
      }
      function Pr(J, fe) {
        return br(function(Ee, Pe, et, Ae) {
          return Ee.concat([J(Pe, et, Ae)]);
        }, [], fe);
      }
      function Ir(J, fe) {
        var Ee = { v: 0, buf: fe };
        return hr(J, function() {
          var Pe;
          Ee = { v: Ee.v << 1 | (Pe = Ee.buf, Pe[0] >> 7), buf: function(et) {
            var Ae = br(function(lt, wt, Rt, Ye) {
              return lt.concat(Rt === Ye.length - 1 ? Buffer.from([wt, 0]).readUInt16BE(0) : Ye.readUInt16BE(Rt));
            }, [], et);
            return Buffer.from(Pr(function(lt) {
              return (lt << 1 & 65535) >> 8;
            }, Ae));
          }(Ee.buf) };
        }), Ee;
      }
      function Pn() {
        return typeof Buffer < "u";
      }
      function fn() {
        if (!Pn())
          throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function nn(J) {
        fn();
        var fe = br(function(Ae, lt) {
          return Ae + lt;
        }, 0, J);
        if (fe % 8 != 0)
          throw new Error("The bits [" + J.join(", ") + "] add up to " + fe + " which is not an even number of bytes; the total should be divisible by 8");
        var Ee, Pe = fe / 8, et = (Ee = function(Ae) {
          return Ae > 48;
        }, br(function(Ae, lt) {
          return Ae || (Ee(lt) ? lt : Ae);
        }, null, J));
        if (et)
          throw new Error(et + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new Le(function(Ae, lt) {
          var wt = Pe + lt;
          return wt > Ae.length ? gn(lt, Pe.toString() + " bytes") : Xr(wt, br(function(Rt, Ye) {
            var Ht = Ir(Ye, Rt.buf);
            return { coll: Rt.coll.concat(Ht.v), buf: Ht.buf };
          }, { coll: [], buf: Ae.slice(lt, wt) }, J).coll);
        });
      }
      function Mr(J, fe) {
        return new Le(function(Ee, Pe) {
          return fn(), Pe + fe > Ee.length ? gn(Pe, fe + " bytes for " + J) : Xr(Pe + fe, Ee.slice(Pe, Pe + fe));
        });
      }
      function zr(J, fe) {
        if (typeof (Ee = fe) != "number" || Math.floor(Ee) !== Ee || fe < 0 || fe > 6)
          throw new Error(J + " requires integer length in range [0, 6].");
        var Ee;
      }
      function mn(J) {
        return zr("uintBE", J), Mr("uintBE(" + J + ")", J).map(function(fe) {
          return fe.readUIntBE(0, J);
        });
      }
      function qr(J) {
        return zr("uintLE", J), Mr("uintLE(" + J + ")", J).map(function(fe) {
          return fe.readUIntLE(0, J);
        });
      }
      function An(J) {
        return zr("intBE", J), Mr("intBE(" + J + ")", J).map(function(fe) {
          return fe.readIntBE(0, J);
        });
      }
      function Rn(J) {
        return zr("intLE", J), Mr("intLE(" + J + ")", J).map(function(fe) {
          return fe.readIntLE(0, J);
        });
      }
      function li(J) {
        return J instanceof Le;
      }
      function ci(J) {
        return {}.toString.call(J) === "[object Array]";
      }
      function Ei(J) {
        return Pn() && Buffer.isBuffer(J);
      }
      function Xr(J, fe) {
        return { status: !0, index: J, value: fe, furthest: -1, expected: [] };
      }
      function gn(J, fe) {
        return ci(fe) || (fe = [fe]), { status: !1, index: -1, value: null, furthest: J, expected: fe };
      }
      function yn(J, fe) {
        if (!fe || J.furthest > fe.furthest)
          return J;
        var Ee = J.furthest === fe.furthest ? function(Pe, et) {
          if (function() {
            if (Le._supportsSet !== void 0)
              return Le._supportsSet;
            var Tr = typeof Set < "u";
            return Le._supportsSet = Tr, Tr;
          }() && Array.from) {
            for (var Ae = new Set(Pe), lt = 0; lt < et.length; lt++)
              Ae.add(et[lt]);
            var wt = Array.from(Ae);
            return wt.sort(), wt;
          }
          for (var Rt = {}, Ye = 0; Ye < Pe.length; Ye++)
            Rt[Pe[Ye]] = !0;
          for (var Ht = 0; Ht < et.length; Ht++)
            Rt[et[Ht]] = !0;
          var ur = [];
          for (var xr in Rt)
            ({}).hasOwnProperty.call(Rt, xr) && ur.push(xr);
          return ur.sort(), ur;
        }(J.expected, fe.expected) : fe.expected;
        return { status: J.status, index: J.index, value: J.value, furthest: fe.furthest, expected: Ee };
      }
      var pi = {};
      function Ci(J, fe) {
        if (Ei(J))
          return { offset: fe, line: -1, column: -1 };
        J in pi || (pi[J] = {});
        for (var Ee = pi[J], Pe = 0, et = 0, Ae = 0, lt = fe; lt >= 0; ) {
          if (lt in Ee) {
            Pe = Ee[lt].line, Ae === 0 && (Ae = Ee[lt].lineStart);
            break;
          }
          (J.charAt(lt) === `
` || J.charAt(lt) === "\r" && J.charAt(lt + 1) !== `
`) && (et++, Ae === 0 && (Ae = lt + 1)), lt--;
        }
        var wt = Pe + et, Rt = fe - Ae;
        return Ee[fe] = { line: wt, lineStart: Ae }, { offset: fe, line: wt + 1, column: Rt + 1 };
      }
      function Qn(J) {
        if (!li(J))
          throw new Error("not a parser: " + J);
      }
      function ji(J, fe) {
        return typeof J == "string" ? J.charAt(fe) : J[fe];
      }
      function fi(J) {
        if (typeof J != "number")
          throw new Error("not a number: " + J);
      }
      function Bn(J) {
        if (typeof J != "function")
          throw new Error("not a function: " + J);
      }
      function Vn(J) {
        if (typeof J != "string")
          throw new Error("not a string: " + J);
      }
      var Yi = 2, Qi = 3, en = 8, Zi = 5 * en, di = 4 * en, bu = "  ";
      function ui(J, fe) {
        return new Array(fe + 1).join(J);
      }
      function Pi(J, fe, Ee) {
        var Pe = fe - J.length;
        return Pe <= 0 ? J : ui(Ee, Pe) + J;
      }
      function _i(J, fe, Ee, Pe) {
        return { from: J - fe > 0 ? J - fe : 0, to: J + Ee > Pe ? Pe : J + Ee };
      }
      function eu(J, fe) {
        var Ee, Pe, et, Ae, lt, wt = fe.index, Rt = wt.offset, Ye = 1;
        if (Rt === J.length)
          return "Got the end of the input";
        if (Ei(J)) {
          var Ht = Rt - Rt % en, ur = Rt - Ht, xr = _i(Ht, Zi, di + en, J.length), Tr = Pr(function(wr) {
            return Pr(function(un) {
              return Pi(un.toString(16), 2, "0");
            }, wr);
          }, function(wr, un) {
            var Lr = wr.length, sn = [], In = 0;
            if (Lr <= un)
              return [wr.slice()];
            for (var St = 0; St < Lr; St++)
              sn[In] || sn.push([]), sn[In].push(wr[St]), (St + 1) % un == 0 && In++;
            return sn;
          }(J.slice(xr.from, xr.to).toJSON().data, en));
          Ae = function(wr) {
            return wr.from === 0 && wr.to === 1 ? { from: wr.from, to: wr.to } : { from: wr.from / en, to: Math.floor(wr.to / en) };
          }(xr), Pe = Ht / en, Ee = 3 * ur, ur >= 4 && (Ee += 1), Ye = 2, et = Pr(function(wr) {
            return wr.length <= 4 ? wr.join(" ") : wr.slice(0, 4).join(" ") + "  " + wr.slice(4).join(" ");
          }, Tr), (lt = (8 * (Ae.to > 0 ? Ae.to - 1 : Ae.to)).toString(16).length) < 2 && (lt = 2);
        } else {
          var $r = J.split(/\r\n|[\n\r\u2028\u2029]/);
          Ee = wt.column - 1, Pe = wt.line - 1, Ae = _i(Pe, Yi, Qi, $r.length), et = $r.slice(Ae.from, Ae.to), lt = Ae.to.toString().length;
        }
        var Wr = Pe - Ae.from;
        return Ei(J) && (lt = (8 * (Ae.to > 0 ? Ae.to - 1 : Ae.to)).toString(16).length) < 2 && (lt = 2), br(function(wr, un, Lr) {
          var sn, In = Lr === Wr, St = In ? "> " : bu;
          return sn = Ei(J) ? Pi((8 * (Ae.from + Lr)).toString(16), lt, "0") : Pi((Ae.from + Lr + 1).toString(), lt, " "), [].concat(wr, [St + sn + " | " + un], In ? [bu + ui(" ", lt) + " | " + Pi("", Ee, " ") + ui("^", Ye)] : []);
        }, [], et).join(`
`);
      }
      function Eu(J, fe) {
        return [`
`, "-- PARSING FAILED " + ui("-", 50), `

`, eu(J, fe), `

`, (Ee = fe.expected, Ee.length === 1 ? `Expected:

` + Ee[0] : `Expected one of the following: 

` + Ee.join(", ")), `
`].join("");
        var Ee;
      }
      function ei(J) {
        return J.flags !== void 0 ? J.flags : [J.global ? "g" : "", J.ignoreCase ? "i" : "", J.multiline ? "m" : "", J.unicode ? "u" : "", J.sticky ? "y" : ""].join("");
      }
      function _n() {
        for (var J = [].slice.call(arguments), fe = J.length, Ee = 0; Ee < fe; Ee += 1)
          Qn(J[Ee]);
        return Le(function(Pe, et) {
          for (var Ae, lt = new Array(fe), wt = 0; wt < fe; wt += 1) {
            if (!(Ae = yn(J[wt]._(Pe, et), Ae)).status)
              return Ae;
            lt[wt] = Ae.value, et = Ae.index;
          }
          return yn(Xr(et, lt), Ae);
        });
      }
      function qn() {
        var J = [].slice.call(arguments);
        if (J.length === 0)
          throw new Error("seqMap needs at least one argument");
        var fe = J.pop();
        return Bn(fe), _n.apply(null, J).map(function(Ee) {
          return fe.apply(null, Ee);
        });
      }
      function Ii() {
        var J = [].slice.call(arguments), fe = J.length;
        if (fe === 0)
          return Fi("zero alternates");
        for (var Ee = 0; Ee < fe; Ee += 1)
          Qn(J[Ee]);
        return Le(function(Pe, et) {
          for (var Ae, lt = 0; lt < J.length; lt += 1)
            if ((Ae = yn(J[lt]._(Pe, et), Ae)).status)
              return Ae;
          return Ae;
        });
      }
      function tu(J, fe) {
        return ru(J, fe).or(si([]));
      }
      function ru(J, fe) {
        return Qn(J), Qn(fe), qn(J, fe.then(J).many(), function(Ee, Pe) {
          return [Ee].concat(Pe);
        });
      }
      function xi(J) {
        Vn(J);
        var fe = "'" + J + "'";
        return Le(function(Ee, Pe) {
          var et = Pe + J.length, Ae = Ee.slice(Pe, et);
          return Ae === J ? Xr(et, Ae) : gn(Pe, fe);
        });
      }
      function Nn(J, fe) {
        (function(et) {
          if (!(et instanceof RegExp))
            throw new Error("not a regexp: " + et);
          for (var Ae = ei(et), lt = 0; lt < Ae.length; lt++) {
            var wt = Ae.charAt(lt);
            if (wt !== "i" && wt !== "m" && wt !== "u" && wt !== "s")
              throw new Error('unsupported regexp flag "' + wt + '": ' + et);
          }
        })(J), arguments.length >= 2 ? fi(fe) : fe = 0;
        var Ee = function(et) {
          return RegExp("^(?:" + et.source + ")", ei(et));
        }(J), Pe = "" + J;
        return Le(function(et, Ae) {
          var lt = Ee.exec(et.slice(Ae));
          if (lt) {
            if (0 <= fe && fe <= lt.length) {
              var wt = lt[0], Rt = lt[fe];
              return Xr(Ae + wt.length, Rt);
            }
            return gn(Ae, "valid match group (0 to " + lt.length + ") in " + Pe);
          }
          return gn(Ae, Pe);
        });
      }
      function si(J) {
        return Le(function(fe, Ee) {
          return Xr(Ee, J);
        });
      }
      function Fi(J) {
        return Le(function(fe, Ee) {
          return gn(Ee, J);
        });
      }
      function Oi(J) {
        if (li(J))
          return Le(function(fe, Ee) {
            var Pe = J._(fe, Ee);
            return Pe.index = Ee, Pe.value = "", Pe;
          });
        if (typeof J == "string")
          return Oi(xi(J));
        if (J instanceof RegExp)
          return Oi(Nn(J));
        throw new Error("not a string, regexp, or parser: " + J);
      }
      function Cu(J) {
        return Qn(J), Le(function(fe, Ee) {
          var Pe = J._(fe, Ee), et = fe.slice(Ee, Pe.index);
          return Pe.status ? gn(Ee, 'not "' + et + '"') : Xr(Ee, null);
        });
      }
      function oi(J) {
        return Bn(J), Le(function(fe, Ee) {
          var Pe = ji(fe, Ee);
          return Ee < fe.length && J(Pe) ? Xr(Ee + 1, Pe) : gn(Ee, "a character/byte matching " + J);
        });
      }
      function xu(J, fe) {
        arguments.length < 2 && (fe = J, J = void 0);
        var Ee = Le(function(Pe, et) {
          return Ee._ = fe()._, Ee._(Pe, et);
        });
        return J ? Ee.desc(J) : Ee;
      }
      function nu() {
        return Fi("fantasy-land/empty");
      }
      pt.parse = function(J) {
        if (typeof J != "string" && !Ei(J))
          throw new Error(".parse must be called with a string or Buffer as its argument");
        var fe, Ee = this.skip(iu)._(J, 0);
        return fe = Ee.status ? { status: !0, value: Ee.value } : { status: !1, index: Ci(J, Ee.furthest), expected: Ee.expected }, delete pi[J], fe;
      }, pt.tryParse = function(J) {
        var fe = this.parse(J);
        if (fe.status)
          return fe.value;
        var Ee = Eu(J, fe), Pe = new Error(Ee);
        throw Pe.type = "ParsimmonError", Pe.result = fe, Pe;
      }, pt.assert = function(J, fe) {
        return this.chain(function(Ee) {
          return J(Ee) ? si(Ee) : Fi(fe);
        });
      }, pt.or = function(J) {
        return Ii(this, J);
      }, pt.trim = function(J) {
        return this.wrap(J, J);
      }, pt.wrap = function(J, fe) {
        return qn(J, this, fe, function(Ee, Pe) {
          return Pe;
        });
      }, pt.thru = function(J) {
        return J(this);
      }, pt.then = function(J) {
        return Qn(J), _n(this, J).map(function(fe) {
          return fe[1];
        });
      }, pt.many = function() {
        var J = this;
        return Le(function(fe, Ee) {
          for (var Pe = [], et = void 0; ; ) {
            if (!(et = yn(J._(fe, Ee), et)).status)
              return yn(Xr(Ee, Pe), et);
            if (Ee === et.index)
              throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            Ee = et.index, Pe.push(et.value);
          }
        });
      }, pt.tieWith = function(J) {
        return Vn(J), this.map(function(fe) {
          if (function(et) {
            if (!ci(et))
              throw new Error("not an array: " + et);
          }(fe), fe.length) {
            Vn(fe[0]);
            for (var Ee = fe[0], Pe = 1; Pe < fe.length; Pe++)
              Vn(fe[Pe]), Ee += J + fe[Pe];
            return Ee;
          }
          return "";
        });
      }, pt.tie = function() {
        return this.tieWith("");
      }, pt.times = function(J, fe) {
        var Ee = this;
        return arguments.length < 2 && (fe = J), fi(J), fi(fe), Le(function(Pe, et) {
          for (var Ae = [], lt = void 0, wt = void 0, Rt = 0; Rt < J; Rt += 1) {
            if (wt = yn(lt = Ee._(Pe, et), wt), !lt.status)
              return wt;
            et = lt.index, Ae.push(lt.value);
          }
          for (; Rt < fe && (wt = yn(lt = Ee._(Pe, et), wt), lt.status); Rt += 1)
            et = lt.index, Ae.push(lt.value);
          return yn(Xr(et, Ae), wt);
        });
      }, pt.result = function(J) {
        return this.map(function() {
          return J;
        });
      }, pt.atMost = function(J) {
        return this.times(0, J);
      }, pt.atLeast = function(J) {
        return qn(this.times(J), this.many(), function(fe, Ee) {
          return fe.concat(Ee);
        });
      }, pt.map = function(J) {
        Bn(J);
        var fe = this;
        return Le(function(Ee, Pe) {
          var et = fe._(Ee, Pe);
          return et.status ? yn(Xr(et.index, J(et.value)), et) : et;
        });
      }, pt.contramap = function(J) {
        Bn(J);
        var fe = this;
        return Le(function(Ee, Pe) {
          var et = fe.parse(J(Ee.slice(Pe)));
          return et.status ? Xr(Pe + Ee.length, et.value) : et;
        });
      }, pt.promap = function(J, fe) {
        return Bn(J), Bn(fe), this.contramap(J).map(fe);
      }, pt.skip = function(J) {
        return _n(this, J).map(function(fe) {
          return fe[0];
        });
      }, pt.mark = function() {
        return qn(Jn, this, Jn, function(J, fe, Ee) {
          return { start: J, value: fe, end: Ee };
        });
      }, pt.node = function(J) {
        return qn(Jn, this, Jn, function(fe, Ee, Pe) {
          return { name: J, value: Ee, start: fe, end: Pe };
        });
      }, pt.sepBy = function(J) {
        return tu(this, J);
      }, pt.sepBy1 = function(J) {
        return ru(this, J);
      }, pt.lookahead = function(J) {
        return this.skip(Oi(J));
      }, pt.notFollowedBy = function(J) {
        return this.skip(Cu(J));
      }, pt.desc = function(J) {
        ci(J) || (J = [J]);
        var fe = this;
        return Le(function(Ee, Pe) {
          var et = fe._(Ee, Pe);
          return et.status || (et.expected = J), et;
        });
      }, pt.fallback = function(J) {
        return this.or(si(J));
      }, pt.ap = function(J) {
        return qn(J, this, function(fe, Ee) {
          return fe(Ee);
        });
      }, pt.chain = function(J) {
        var fe = this;
        return Le(function(Ee, Pe) {
          var et = fe._(Ee, Pe);
          return et.status ? yn(J(et.value)._(Ee, et.index), et) : et;
        });
      }, pt.concat = pt.or, pt.empty = nu, pt.of = si, pt["fantasy-land/ap"] = pt.ap, pt["fantasy-land/chain"] = pt.chain, pt["fantasy-land/concat"] = pt.concat, pt["fantasy-land/empty"] = pt.empty, pt["fantasy-land/of"] = pt.of, pt["fantasy-land/map"] = pt.map;
      var Jn = Le(function(J, fe) {
        return Xr(fe, Ci(J, fe));
      }), Ku = Le(function(J, fe) {
        return fe >= J.length ? gn(fe, "any character/byte") : Xr(fe + 1, ji(J, fe));
      }), Yu = Le(function(J, fe) {
        return Xr(J.length, J.slice(fe));
      }), iu = Le(function(J, fe) {
        return fe < J.length ? gn(fe, "EOF") : Xr(fe, null);
      }), Qu = Nn(/[0-9]/).desc("a digit"), Zu = Nn(/[0-9]*/).desc("optional digits"), es = Nn(/[a-z]/i).desc("a letter"), ts = Nn(/[a-z]*/i).desc("optional letters"), rs = Nn(/\s*/).desc("optional whitespace"), Li = Nn(/\s+/).desc("whitespace"), uu = xi("\r"), Fu = xi(`
`), Au = xi(`\r
`), qt = Ii(Au, Fu, uu).desc("newline"), ft = Ii(qt, iu);
      Le.all = Yu, Le.alt = Ii, Le.any = Ku, Le.cr = uu, Le.createLanguage = function(J) {
        var fe = {};
        for (var Ee in J)
          ({}).hasOwnProperty.call(J, Ee) && function(Pe) {
            fe[Pe] = xu(function() {
              return J[Pe](fe);
            });
          }(Ee);
        return fe;
      }, Le.crlf = Au, Le.custom = function(J) {
        return Le(J(Xr, gn));
      }, Le.digit = Qu, Le.digits = Zu, Le.empty = nu, Le.end = ft, Le.eof = iu, Le.fail = Fi, Le.formatError = Eu, Le.index = Jn, Le.isParser = li, Le.lazy = xu, Le.letter = es, Le.letters = ts, Le.lf = Fu, Le.lookahead = Oi, Le.makeFailure = gn, Le.makeSuccess = Xr, Le.newline = qt, Le.noneOf = function(J) {
        return oi(function(fe) {
          return J.indexOf(fe) < 0;
        }).desc("none of '" + J + "'");
      }, Le.notFollowedBy = Cu, Le.of = si, Le.oneOf = function(J) {
        for (var fe = J.split(""), Ee = 0; Ee < fe.length; Ee++)
          fe[Ee] = "'" + fe[Ee] + "'";
        return oi(function(Pe) {
          return J.indexOf(Pe) >= 0;
        }).desc(fe);
      }, Le.optWhitespace = rs, Le.Parser = Le, Le.range = function(J, fe) {
        return oi(function(Ee) {
          return J <= Ee && Ee <= fe;
        }).desc(J + "-" + fe);
      }, Le.regex = Nn, Le.regexp = Nn, Le.sepBy = tu, Le.sepBy1 = ru, Le.seq = _n, Le.seqMap = qn, Le.seqObj = function() {
        for (var J, fe = {}, Ee = 0, Pe = (J = arguments, Array.prototype.slice.call(J)), et = Pe.length, Ae = 0; Ae < et; Ae += 1) {
          var lt = Pe[Ae];
          if (!li(lt)) {
            if (ci(lt) && lt.length === 2 && typeof lt[0] == "string" && li(lt[1])) {
              var wt = lt[0];
              if (Object.prototype.hasOwnProperty.call(fe, wt))
                throw new Error("seqObj: duplicate key " + wt);
              fe[wt] = !0, Ee++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (Ee === 0)
          throw new Error("seqObj expects at least one named parser, found zero");
        return Le(function(Rt, Ye) {
          for (var Ht, ur = {}, xr = 0; xr < et; xr += 1) {
            var Tr, $r;
            if (ci(Pe[xr]) ? (Tr = Pe[xr][0], $r = Pe[xr][1]) : (Tr = null, $r = Pe[xr]), !(Ht = yn($r._(Rt, Ye), Ht)).status)
              return Ht;
            Tr && (ur[Tr] = Ht.value), Ye = Ht.index;
          }
          return yn(Xr(Ye, ur), Ht);
        });
      }, Le.string = xi, Le.succeed = si, Le.takeWhile = function(J) {
        return Bn(J), Le(function(fe, Ee) {
          for (var Pe = Ee; Pe < fe.length && J(ji(fe, Pe)); )
            Pe++;
          return Xr(Pe, fe.slice(Ee, Pe));
        });
      }, Le.test = oi, Le.whitespace = Li, Le["fantasy-land/empty"] = nu, Le["fantasy-land/of"] = si, Le.Binary = { bitSeq: nn, bitSeqObj: function(J) {
        fn();
        var fe = {}, Ee = 0, Pe = Pr(function(Ae) {
          if (ci(Ae)) {
            var lt = Ae;
            if (lt.length !== 2)
              throw new Error("[" + lt.join(", ") + "] should be length 2, got length " + lt.length);
            if (Vn(lt[0]), fi(lt[1]), Object.prototype.hasOwnProperty.call(fe, lt[0]))
              throw new Error("duplicate key in bitSeqObj: " + lt[0]);
            return fe[lt[0]] = !0, Ee++, lt;
          }
          return fi(Ae), [null, Ae];
        }, J);
        if (Ee < 1)
          throw new Error("bitSeqObj expects at least one named pair, got [" + J.join(", ") + "]");
        var et = Pr(function(Ae) {
          return Ae[0];
        }, Pe);
        return nn(Pr(function(Ae) {
          return Ae[1];
        }, Pe)).map(function(Ae) {
          return br(function(lt, wt) {
            return wt[0] !== null && (lt[wt[0]] = wt[1]), lt;
          }, {}, Pr(function(lt, wt) {
            return [lt, Ae[wt]];
          }, et));
        });
      }, byte: function(J) {
        if (fn(), fi(J), J > 255)
          throw new Error("Value specified to byte constructor (" + J + "=0x" + J.toString(16) + ") is larger in value than a single byte.");
        var fe = (J > 15 ? "0x" : "0x0") + J.toString(16);
        return Le(function(Ee, Pe) {
          var et = ji(Ee, Pe);
          return et === J ? Xr(Pe + 1, et) : gn(Pe, fe);
        });
      }, buffer: function(J) {
        return Mr("buffer", J).map(function(fe) {
          return Buffer.from(fe);
        });
      }, encodedString: function(J, fe) {
        return Mr("string", fe).map(function(Ee) {
          return Ee.toString(J);
        });
      }, uintBE: mn, uint8BE: mn(1), uint16BE: mn(2), uint32BE: mn(4), uintLE: qr, uint8LE: qr(1), uint16LE: qr(2), uint32LE: qr(4), intBE: An, int8BE: An(1), int16BE: An(2), int32BE: An(4), intLE: Rn, int8LE: Rn(1), int16LE: Rn(2), int32LE: Rn(4), floatBE: Mr("floatBE", 4).map(function(J) {
        return J.readFloatBE(0);
      }), floatLE: Mr("floatLE", 4).map(function(J) {
        return J.readFloatLE(0);
      }), doubleBE: Mr("doubleBE", 8).map(function(J) {
        return J.readDoubleBE(0);
      }), doubleLE: Mr("doubleLE", 8).map(function(J) {
        return J.readDoubleLE(0);
      }) }, j.exports = Le;
    }]);
  });
})(parsimmon_umd_min);
const P = /* @__PURE__ */ getDefaultExportFromCjs(parsimmon_umd_minExports);
function define(f, k, j) {
  f.prototype = k.prototype = j, j.constructor = f;
}
function extend(f, k) {
  var j = Object.create(f.prototype);
  for (var we in k)
    j[we] = k[we];
  return j;
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
  copy(f) {
    return Object.assign(new this.constructor(), this, f);
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
function color(f) {
  var k, j;
  return f = (f + "").trim().toLowerCase(), (k = reHex.exec(f)) ? (j = k[1].length, k = parseInt(k[1], 16), j === 6 ? rgbn(k) : j === 3 ? new Rgb(k >> 8 & 15 | k >> 4 & 240, k >> 4 & 15 | k & 240, (k & 15) << 4 | k & 15, 1) : j === 8 ? rgba(k >> 24 & 255, k >> 16 & 255, k >> 8 & 255, (k & 255) / 255) : j === 4 ? rgba(k >> 12 & 15 | k >> 8 & 240, k >> 8 & 15 | k >> 4 & 240, k >> 4 & 15 | k & 240, ((k & 15) << 4 | k & 15) / 255) : null) : (k = reRgbInteger.exec(f)) ? new Rgb(k[1], k[2], k[3], 1) : (k = reRgbPercent.exec(f)) ? new Rgb(k[1] * 255 / 100, k[2] * 255 / 100, k[3] * 255 / 100, 1) : (k = reRgbaInteger.exec(f)) ? rgba(k[1], k[2], k[3], k[4]) : (k = reRgbaPercent.exec(f)) ? rgba(k[1] * 255 / 100, k[2] * 255 / 100, k[3] * 255 / 100, k[4]) : (k = reHslPercent.exec(f)) ? hsla(k[1], k[2] / 100, k[3] / 100, 1) : (k = reHslaPercent.exec(f)) ? hsla(k[1], k[2] / 100, k[3] / 100, k[4]) : named.hasOwnProperty(f) ? rgbn(named[f]) : f === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(f) {
  return new Rgb(f >> 16 & 255, f >> 8 & 255, f & 255, 1);
}
function rgba(f, k, j, we) {
  return we <= 0 && (f = k = j = NaN), new Rgb(f, k, j, we);
}
function rgbConvert(f) {
  return f instanceof Color || (f = color(f)), f ? (f = f.rgb(), new Rgb(f.r, f.g, f.b, f.opacity)) : new Rgb();
}
function rgb(f, k, j, we) {
  return arguments.length === 1 ? rgbConvert(f) : new Rgb(f, k, j, we ?? 1);
}
function Rgb(f, k, j, we) {
  this.r = +f, this.g = +k, this.b = +j, this.opacity = +we;
}
define(Rgb, rgb, extend(Color, {
  brighter(f) {
    return f = f == null ? brighter : Math.pow(brighter, f), new Rgb(this.r * f, this.g * f, this.b * f, this.opacity);
  },
  darker(f) {
    return f = f == null ? darker : Math.pow(darker, f), new Rgb(this.r * f, this.g * f, this.b * f, this.opacity);
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
  const f = clampa(this.opacity);
  return `${f === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${f === 1 ? ")" : `, ${f})`}`;
}
function clampa(f) {
  return isNaN(f) ? 1 : Math.max(0, Math.min(1, f));
}
function clampi(f) {
  return Math.max(0, Math.min(255, Math.round(f) || 0));
}
function hex(f) {
  return f = clampi(f), (f < 16 ? "0" : "") + f.toString(16);
}
function hsla(f, k, j, we) {
  return we <= 0 ? f = k = j = NaN : j <= 0 || j >= 1 ? f = k = NaN : k <= 0 && (f = NaN), new Hsl(f, k, j, we);
}
function hslConvert(f) {
  if (f instanceof Hsl)
    return new Hsl(f.h, f.s, f.l, f.opacity);
  if (f instanceof Color || (f = color(f)), !f)
    return new Hsl();
  if (f instanceof Hsl)
    return f;
  f = f.rgb();
  var k = f.r / 255, j = f.g / 255, we = f.b / 255, st = Math.min(k, j, we), Le = Math.max(k, j, we), pt = NaN, hr = Le - st, br = (Le + st) / 2;
  return hr ? (k === Le ? pt = (j - we) / hr + (j < we) * 6 : j === Le ? pt = (we - k) / hr + 2 : pt = (k - j) / hr + 4, hr /= br < 0.5 ? Le + st : 2 - Le - st, pt *= 60) : hr = br > 0 && br < 1 ? 0 : pt, new Hsl(pt, hr, br, f.opacity);
}
function hsl(f, k, j, we) {
  return arguments.length === 1 ? hslConvert(f) : new Hsl(f, k, j, we ?? 1);
}
function Hsl(f, k, j, we) {
  this.h = +f, this.s = +k, this.l = +j, this.opacity = +we;
}
define(Hsl, hsl, extend(Color, {
  brighter(f) {
    return f = f == null ? brighter : Math.pow(brighter, f), new Hsl(this.h, this.s, this.l * f, this.opacity);
  },
  darker(f) {
    return f = f == null ? darker : Math.pow(darker, f), new Hsl(this.h, this.s, this.l * f, this.opacity);
  },
  rgb() {
    var f = this.h % 360 + (this.h < 0) * 360, k = isNaN(f) || isNaN(this.s) ? 0 : this.s, j = this.l, we = j + (j < 0.5 ? j : 1 - j) * k, st = 2 * j - we;
    return new Rgb(
      hsl2rgb(f >= 240 ? f - 240 : f + 120, st, we),
      hsl2rgb(f, st, we),
      hsl2rgb(f < 120 ? f + 240 : f - 120, st, we),
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
    const f = clampa(this.opacity);
    return `${f === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${f === 1 ? ")" : `, ${f})`}`;
  }
}));
function clamph(f) {
  return f = (f || 0) % 360, f < 0 ? f + 360 : f;
}
function clampt(f) {
  return Math.max(0, Math.min(1, f || 0));
}
function hsl2rgb(f, k, j) {
  return (f < 60 ? k + (j - k) * f / 60 : f < 180 ? j : f < 240 ? k + (j - k) * (240 - f) / 60 : k) * 255;
}
const radians = Math.PI / 180, degrees = 180 / Math.PI, K = 18, Xn = 0.96422, Yn = 1, Zn = 0.82521, t0 = 4 / 29, t1 = 6 / 29, t2 = 3 * t1 * t1, t3 = t1 * t1 * t1;
function labConvert(f) {
  if (f instanceof Lab)
    return new Lab(f.l, f.a, f.b, f.opacity);
  if (f instanceof Hcl)
    return hcl2lab(f);
  f instanceof Rgb || (f = rgbConvert(f));
  var k = rgb2lrgb(f.r), j = rgb2lrgb(f.g), we = rgb2lrgb(f.b), st = xyz2lab((0.2225045 * k + 0.7168786 * j + 0.0606169 * we) / Yn), Le, pt;
  return k === j && j === we ? Le = pt = st : (Le = xyz2lab((0.4360747 * k + 0.3850649 * j + 0.1430804 * we) / Xn), pt = xyz2lab((0.0139322 * k + 0.0971045 * j + 0.7141733 * we) / Zn)), new Lab(116 * st - 16, 500 * (Le - st), 200 * (st - pt), f.opacity);
}
function lab(f, k, j, we) {
  return arguments.length === 1 ? labConvert(f) : new Lab(f, k, j, we ?? 1);
}
function Lab(f, k, j, we) {
  this.l = +f, this.a = +k, this.b = +j, this.opacity = +we;
}
define(Lab, lab, extend(Color, {
  brighter(f) {
    return new Lab(this.l + K * (f ?? 1), this.a, this.b, this.opacity);
  },
  darker(f) {
    return new Lab(this.l - K * (f ?? 1), this.a, this.b, this.opacity);
  },
  rgb() {
    var f = (this.l + 16) / 116, k = isNaN(this.a) ? f : f + this.a / 500, j = isNaN(this.b) ? f : f - this.b / 200;
    return k = Xn * lab2xyz(k), f = Yn * lab2xyz(f), j = Zn * lab2xyz(j), new Rgb(
      lrgb2rgb(3.1338561 * k - 1.6168667 * f - 0.4906146 * j),
      lrgb2rgb(-0.9787684 * k + 1.9161415 * f + 0.033454 * j),
      lrgb2rgb(0.0719453 * k - 0.2289914 * f + 1.4052427 * j),
      this.opacity
    );
  }
}));
function xyz2lab(f) {
  return f > t3 ? Math.pow(f, 1 / 3) : f / t2 + t0;
}
function lab2xyz(f) {
  return f > t1 ? f * f * f : t2 * (f - t0);
}
function lrgb2rgb(f) {
  return 255 * (f <= 31308e-7 ? 12.92 * f : 1.055 * Math.pow(f, 1 / 2.4) - 0.055);
}
function rgb2lrgb(f) {
  return (f /= 255) <= 0.04045 ? f / 12.92 : Math.pow((f + 0.055) / 1.055, 2.4);
}
function hclConvert(f) {
  if (f instanceof Hcl)
    return new Hcl(f.h, f.c, f.l, f.opacity);
  if (f instanceof Lab || (f = labConvert(f)), f.a === 0 && f.b === 0)
    return new Hcl(NaN, 0 < f.l && f.l < 100 ? 0 : NaN, f.l, f.opacity);
  var k = Math.atan2(f.b, f.a) * degrees;
  return new Hcl(k < 0 ? k + 360 : k, Math.sqrt(f.a * f.a + f.b * f.b), f.l, f.opacity);
}
function lch(f, k, j, we) {
  return arguments.length === 1 ? hclConvert(f) : new Hcl(j, k, f, we ?? 1);
}
function hcl(f, k, j, we) {
  return arguments.length === 1 ? hclConvert(f) : new Hcl(f, k, j, we ?? 1);
}
function Hcl(f, k, j, we) {
  this.h = +f, this.c = +k, this.l = +j, this.opacity = +we;
}
function hcl2lab(f) {
  if (isNaN(f.h))
    return new Lab(f.l, 0, 0, f.opacity);
  var k = f.h * radians;
  return new Lab(f.l, Math.cos(k) * f.c, Math.sin(k) * f.c, f.opacity);
}
define(Hcl, hcl, extend(Color, {
  brighter(f) {
    return new Hcl(this.h, this.c, this.l + K * (f ?? 1), this.opacity);
  },
  darker(f) {
    return new Hcl(this.h, this.c, this.l - K * (f ?? 1), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));
const arrayEquals = (f, k) => {
  if (!f || !k || f.length !== k.length)
    return !1;
  for (let j = 0; j < f.length; j++)
    if (f[j] !== k[j])
      return !1;
  return !0;
};
async function sleep(f) {
  return await new Promise((k) => setTimeout(k, f));
}
const hyphenToCamelCase = (f) => f.replace(
  /([-_][a-z])/gi,
  (k) => k.toUpperCase().replace("-", "").replace("_", "")
);
function camelCaseToHyphen(f) {
  return f.replace(/([A-Z])/g, (k) => `-${k[0].toLowerCase()}`);
}
function convertAbsoluteUnitToPixels(f, k) {
  let j = f;
  return k === "cm" ? j *= 96 / 2.54 : k === "mm" ? j *= 96 / 25.4 : k === "in" ? j *= 96 : k === "pt" ? j *= 4 / 3 : k === "pc" && (j *= 16), j;
}
function convertToPixels(f, k, j, we) {
  if (k === "em" && j)
    f *= parseFloat(getComputedStyle(j).fontSize);
  else if (k === "rem")
    f *= parseFloat(getComputedStyle(document.documentElement).fontSize);
  else if (k === "vh")
    f *= window.innerHeight / 100;
  else if (k === "vw")
    f *= window.innerWidth / 100;
  else if (k === "vmin")
    f *= Math.min(window.innerHeight, window.innerWidth) / 100;
  else if (k === "vmax")
    f *= Math.max(window.innerHeight, window.innerWidth) / 100;
  else if (k === "%" && (j != null && j.parentElement) && we) {
    const st = parseFloat(
      getComputedStyle(j.parentElement).getPropertyValue(we)
    );
    f = f / 100 * st;
  } else
    f = convertAbsoluteUnitToPixels(f, k);
  return f;
}
function convertToDegrees(f, k) {
  return k === "grad" ? f *= 0.9 : k === "rad" ? f *= 180 / Math.PI : k === "turn" && (f *= 360), f;
}
function convertToDpi(f, k) {
  return k === "dpcm" ? f *= 2.54 : k === "dppx" && (f *= 96), f;
}
const getComputedValue = (f, k) => {
  const j = getComputedStyle(f).getPropertyValue(k), we = CSSValueUnit.Value.parse(j);
  return we.status ? we.value : void 0;
}, lerpColor = (f, k, j) => {
  const we = k.value, st = j.value;
  return {
    r: lerp(f, we.r, st.r),
    g: lerp(f, we.g, st.g),
    b: lerp(f, we.b, st.b)
  };
}, lerpVar = (f, k, j, we) => {
  const st = k.unit === "var" ? getComputedValue(we, String(k.value)) : k, Le = j.unit === "var" ? getComputedValue(we, String(j.value)) : j;
  return st.lerp(f, Le, we);
};
class ValueUnit {
  constructor(k, j, we = []) {
    this.value = k, this.unit = j, this.superType = we;
  }
  toString() {
    if (!this.unit || this.unit === "string")
      return `${this.value}`;
    if (this.unit === "color") {
      const k = this.value;
      return `rgb(${k.r}, ${k.g}, ${k.b})`;
    } else
      return this.unit === "var" ? `var(${this.value})` : this.unit === "calc" ? `calc(${this.value})` : `${this.value}${this.unit}`;
  }
  lerp(k, j, we) {
    if (this.unit === "string" || j.unit === "string")
      return this;
    if (we && (this.unit === "var" || j.unit === "var"))
      return lerpVar(k, this, j, we);
    if (this.unit !== j.unit) {
      const [Le, pt] = collapseNumericType(this, j, we), hr = lerp(k, Le.value, pt.value);
      return new ValueUnit(hr, Le.unit, Le.superType);
    } else if (this.unit === "color") {
      const Le = lerpColor(
        k,
        this,
        j
      );
      return new ValueUnit(Le, this.unit, this.superType);
    }
    const st = lerp(k, this.value, j.value);
    return new ValueUnit(st, this.unit, this.superType);
  }
}
function lerpMany(f, k, j, we) {
  const st = Math.min(k.length, j.length), Le = [];
  for (let pt = 0; pt < st; pt++) {
    const hr = k[pt], br = j[pt];
    Le.push(hr.lerp(f, br, we));
  }
  return Le;
}
class FunctionValue {
  constructor(k, j) {
    this.name = k, this.values = j;
  }
  toString() {
    const k = this.values.map((j) => j.toString()).join(", ");
    return `${this.name}(${k})`;
  }
  lerp(k, j, we) {
    const st = lerpMany(k, this.values, j.values, we);
    return new FunctionValue(this.name, st);
  }
}
class ValueArray {
  constructor(k) {
    this.values = k;
  }
  toString() {
    return this.values.map((k) => k.toString()).join(" ");
  }
  lerp(k, j, we) {
    const st = lerpMany(k, this.values, j.values, we);
    return new ValueArray(st);
  }
}
const collapseNumericType = (f, k, j) => {
  if (!arrayEquals(f.superType, k.superType) && f.superType[0] !== "length")
    return [f, k];
  const [we, st] = (() => f.superType[0] === "length" ? [
    convertToPixels(f.value, f.unit, j),
    convertToPixels(k.value, k.unit, j)
  ] : f.superType[0] === "angle" ? [
    convertToDegrees(f.value, f.unit),
    convertToDegrees(k.value, k.unit)
  ] : f.superType[0] === "time" ? [parseCSSTime(f.value + f.unit), parseCSSTime(k.value + k.unit)] : f.superType[0] === "resolution" ? [convertToDpi(f.value, f.unit), convertToDpi(k.value, k.unit)] : [f, k])(), [Le, pt] = [f.unit, f.superType];
  return [new ValueUnit(we, Le, pt), new ValueUnit(st, Le, pt)];
};
function transformObject(f) {
  const k = {}, j = (we, st = "", Le = "") => {
    if (we instanceof ValueUnit || we instanceof FunctionValue || we instanceof ValueArray)
      return we;
    if (typeof we == "object")
      for (const [hr, br] of Object.entries(we)) {
        const Pr = st ? `${st}.${hr}` : hr, Ir = j(br, Pr, hr);
        Ir !== void 0 && (k[Pr] = Ir);
      }
    else
      return CSSKeyframes.FunctionArgs.map(
        (br) => new FunctionValue(Le, br)
      ).or(CSSKeyframes.Value).tryParse(String(we));
  };
  return j(f), k;
}
function reverseTransformObject(f, k, j = {}) {
  const we = f.split(".");
  let st = j;
  if (we.length === 1)
    return j[f] = k, j;
  for (let Le = 0; Le < we.length; Le++) {
    const pt = we[Le];
    k !== void 0 && Le === we.length - 1 ? st[pt] = k.toString() : st = st[pt] ?? (st[pt] = {});
  }
  return j;
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
  // tan: "#d2b48c",
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
], lengthUnits = [...absoluteLengthUnits, ...relativeLengthUnits], timeUnits = ["s", "ms"], angleUnits = ["deg", "rad", "grad", "turn"], percentageUnits = ["%"], resolutionUnits = ["dpi", "dpcm", "dppx"], identifier = P.regexp(/[a-zA-Z][a-zA-Z0-9-]+/), none = P.string("none"), integer = P.regexp(/-?\d+/).map(Number), number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number), opt = (f) => P.alt(f, P.succeed(void 0)), hex2rgb = (f) => {
  const k = parseInt(f.slice(1, 3), 16), j = parseInt(f.slice(3, 5), 16), we = parseInt(f.slice(5, 7), 16);
  return [k, j, we];
}, hsv2hsl = (f, k, j) => {
  const we = (2 - k) * j / 2, st = we !== 0 && we !== 1 ? k * j / (we < 0.5 ? we * 2 : 2 - we * 2) : 0;
  return [f, st, we];
}, hwb2hsl = (f, k, j) => {
  const we = (1 - j) / 2, st = k === 1 ? 0 : k === 0 ? 1 : (1 - k - j) / (1 - j);
  return [f, st, we];
}, colorOptionalAlpha = (f, k) => {
  const j = P.string(k).skip(opt(P.string("a"))).trim(P.optWhitespace), we = P.alt(
    P.seq(f.colorValue.skip(f.alphaSep), f.colorValue),
    P.seq(f.colorValue)
  ), st = P.seq(
    f.colorValue.skip(f.sep),
    f.colorValue.skip(f.sep),
    we
  ).trim(P.optWhitespace).wrap(P.string("("), P.string(")"));
  return j.then(st).map(([Le, pt, [hr, br]]) => [Le, pt, hr, br ?? 1]);
}, CSSColor = P.createLanguage({
  colorValue: () => P.alt(
    integer.skip(P.string("%")).map((f) => f / 100),
    number
  ),
  comma: () => P.string(","),
  space: () => P.string(" "),
  div: () => P.string("/"),
  sep: (f) => f.comma.or(f.space).trim(P.optWhitespace),
  alphaSep: (f) => f.sep.or(f.div).trim(P.optWhitespace),
  name: () => P.alt(
    ...Object.keys(colorNames).sort((f, k) => k.length - f.length).map(P.string)
  ).map((f) => {
    const k = colorNames[f], [j, we, st] = hex2rgb(k);
    return rgb(j, we, st);
  }),
  hex: () => P.regexp(/#[0-9a-fA-F]{3,6}/).map((f) => {
    const k = f.slice(1), j = k.length === 3 ? k[0] + k[0] : k.slice(0, 2), we = k.length === 3 ? k[1] + k[1] : k.slice(2, 4), st = k.length === 3 ? k[2] + k[2] : k.slice(4, 6);
    return rgb(parseInt(j, 16), parseInt(we, 16), parseInt(st, 16));
  }),
  rgb: (f) => colorOptionalAlpha(f, "rgb").map(([k, j, we, st]) => rgb(k, j, we, st)),
  hsl: (f) => colorOptionalAlpha(f, "hsl").map(([k, j, we, st]) => hsl(k, j, we, st)),
  hsv: (f) => colorOptionalAlpha(f, "hsv").map(([k, j, we, st]) => {
    const [Le, pt, hr] = hsv2hsl(k, j, we);
    return hsl(Le, pt, hr, st);
  }),
  hwb: (f) => colorOptionalAlpha(f, "hwb").map(([k, j, we, st]) => {
    const [Le, pt, hr] = hwb2hsl(k, j, we);
    return hsl(Le, pt, hr, st);
  }),
  lab: (f) => colorOptionalAlpha(f, "lab").map(([k, j, we, st]) => lab(k, j, we, st)),
  lch: (f) => colorOptionalAlpha(f, "lch").map(([k, j, we, st]) => lch(k, j, we, st)),
  Value: (f) => P.alt(f.hex, f.rgb, f.hsl, f.hsv, f.hwb, f.lab, f.lch, f.name).trim(
    P.optWhitespace
  )
}), CSSValueUnit = P.createLanguage({
  lengthUnit: () => P.alt(...lengthUnits.map(P.string)),
  angleUnit: () => P.alt(...angleUnits.map(P.string)),
  timeUnit: () => P.alt(...timeUnits.map(P.string)),
  resolutionUnit: () => P.alt(...resolutionUnits.map(P.string)),
  percentageUnit: () => P.alt(...percentageUnits.map(P.string)),
  Length: (f) => P.seq(number, f.lengthUnit).map(([k, j]) => {
    let we = ["length"];
    return relativeLengthUnits.includes(j) ? we.push("relative") : absoluteLengthUnits.includes(j) && we.push("absolute"), new ValueUnit(k, j, we);
  }),
  Angle: (f) => P.seq(number, f.angleUnit).map(([k, j]) => new ValueUnit(k, j, ["angle"])),
  Time: (f) => P.seq(number, f.timeUnit).map(([k, j]) => new ValueUnit(k, j, ["time"])),
  Resolution: (f) => P.seq(number, f.resolutionUnit).map(([k, j]) => new ValueUnit(k, j, ["resolution"])),
  Percentage: (f) => P.seq(integer, f.percentageUnit).map(([k, j]) => new ValueUnit(k, j, ["percentage"])),
  Color: (f) => CSSColor.Value.map((k) => new ValueUnit(k, "color")),
  Value: (f) => P.alt(
    f.Length,
    f.Angle,
    f.Time,
    f.Resolution,
    f.Percentage,
    f.Color,
    P.alt(number, none).map((k) => new ValueUnit(k))
  ).trim(P.optWhitespace)
}), istring = (f) => P((k, j) => k.slice(j).toLowerCase().startsWith(f.toLowerCase()) ? P.makeSuccess(j + f.length, f) : P.makeFailure(j, `Expected ${f}`)), unaryMathFunctions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  var: (f) => f
}, binaryMathFunctions = {
  pow: Math.pow,
  atan2: Math.atan2,
  min: Math.min,
  max: Math.max,
  clamp
}, mathFunctions = {
  ...unaryMathFunctions,
  ...binaryMathFunctions
}, evaluateMathFunction = (f, k) => {
  const j = k.reduce((pt, hr) => collapseNumericType(pt, hr), k[0])[0], we = k.map((pt) => pt.value).map((pt) => j.superType && j.superType[0] === "angle" ? convertToDegrees(pt, j.unit) * (Math.PI / 180) : pt), st = mathFunctions[f], Le = st(...we);
  if (Le)
    return new ValueUnit(Le, j.unit, j.superType);
};
function evaluateMathOperator(f, k, j) {
  if ([k, j] = collapseNumericType(k, j), !k.unit && j.unit)
    [k, j] = [j, k];
  else if (j.unit && !arrayEquals(k.superType, j.superType))
    return;
  const we = (() => {
    switch (f) {
      case "+":
        return k.value + j.value;
      case "-":
        return k.value - j.value;
      case "*":
        return k.value * j.value;
      case "/":
        return k.value / j.value;
      case "//":
        return Math.floor(k.value / j.value);
      case "^":
        return Math.pow(k.value, j.value);
      default:
        throw new Error(`Unknown operator ${f}`);
    }
  })();
  return new ValueUnit(we, k.unit, k.superType);
}
const reduceMathOperators = (f, k) => k.length === 0 ? f : k.reduce((we, [st, Le]) => {
  if (typeof we == "string" || !(Le instanceof ValueUnit))
    return `${we} ${st} ${Le}`;
  const pt = evaluateMathOperator(st, we, Le);
  return pt || `${we} ${st} ${Le}`;
}, f), MathValue = P.createLanguage({
  ws: () => P.optWhitespace,
  lparen: (f) => P.string("(").trim(f.ws),
  rparen: (f) => P.string(")").trim(f.ws),
  comma: (f) => P.string(",").trim(f.ws),
  termOperators: (f) => P.alt(...["*", "/", "//"].map(P.string)).trim(f.ws),
  factorOperators: (f) => P.alt(...["+", "-"].map(P.string)).trim(f.ws),
  pow: (f) => P.string("^").trim(f.ws),
  Expression: (f) => P.alt(f.Function, f.Term),
  FunctionArgs: (f) => P.sepBy1(f.Expression, f.comma).trim(f.ws).wrap(f.lparen, f.rparen),
  Function: (f) => P.seq(P.alt(...Object.keys(mathFunctions).map(P.string)), f.FunctionArgs).map(
    ([k, j]) => {
      const we = evaluateMathFunction(
        k,
        j
      );
      return we || new FunctionValue(k, j);
    }
  ),
  Term: (f) => P.seqMap(
    f.Factor,
    P.seq(f.termOperators, f.Factor).many(),
    reduceMathOperators
  ),
  Factor: (f) => P.seqMap(f.Atom, P.seq(f.factorOperators, f.Term).many(), reduceMathOperators),
  CSSVariable: (f) => P.string("--").then(identifier).map((k) => new ValueUnit("--" + k, "var")),
  Atom: (f) => P.alt(CSSValueUnit.Value, f.CSSVariable, f.Expression).trim(f.ws)
}), handleCalc = (f) => P.string("calc").then(MathValue.Expression.trim(f.ws).wrap(f.lparen, f.rparen)).map((k) => k instanceof ValueUnit ? k : new ValueUnit(k, "calc")), TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring), DIMS = ["x", "y", "z"].map(istring), handleFunc = (f, k) => P.seq(k || identifier, f.FunctionArgs).map((j) => j), handleTransform = (f) => {
  const k = P.seq(P.alt(...TRANSFORM_FUNCTIONS), P.alt(...DIMS, P.string("")));
  return handleFunc(f, k).map(([[we, st], Le]) => (we = we.toLowerCase(), st ? new FunctionValue(we + st.toUpperCase(), [Le[0]]) : Le.length === 1 ? new FunctionValue(we, [Le[0]]) : new FunctionValue(we, Le)));
}, handleVar = (f) => P.string("var").then(f.String.trim(f.ws).wrap(f.lparen, f.rparen)).map((k) => new ValueUnit(k, "var")), gradientDirections = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
}, handleGradient = (f) => {
  const k = P.alt(...["linear-gradient", "radial-gradient"].map(istring)), j = P.seq(
    P.string("to").skip(f.ws),
    P.alt(...["left", "right", "top", "bottom"].map(istring))
  ).map(([br, Pr]) => (Pr = gradientDirections[Pr.toLowerCase()], new ValueUnit(Pr, "deg"))), we = P.alt(CSSValueUnit.Angle, j), st = P.alt(CSSValueUnit.Length, CSSValueUnit.Percentage), Le = P.seq(
    CSSValueUnit.Color,
    P.sepBy(st, f.ws)
  ).map(([br, Pr]) => Pr ? [br, ...Pr] : [br]), pt = P.seq(
    Le,
    f.comma.trim(f.ws).then(Le.or(st)).many()
  ).map(([br, Pr]) => [br, ...Pr].map((Ir) => new ValueArray(Ir)));
  return P.seq(
    k,
    P.seq(opt(we.skip(f.comma)), pt).trim(f.ws).wrap(f.lparen, f.rparen).map(([br, Pr]) => br ? [br, ...Pr].flat() : [Pr])
  ).map(([br, Pr]) => new FunctionValue(br, Pr));
}, handleCubicBezier = (f) => handleFunc(f, P.string("cubic-bezier")).map((k) => new FunctionValue("cubic-bezier", k[1])), CSSKeyframes = P.createLanguage({
  ws: () => P.optWhitespace,
  semi: () => P.string(";"),
  colon: () => P.string(":"),
  lcurly: () => P.string("{"),
  rcurly: () => P.string("}"),
  lparen: () => P.string("("),
  rparen: () => P.string(")"),
  comma: () => P.string(","),
  Rule: (f) => P.string("@keyframes").trim(f.ws).then(identifier),
  String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((f) => new ValueUnit(f)),
  FunctionArgs: (f) => f.Value.sepBy(f.comma).trim(f.ws).wrap(f.lparen, f.rparen),
  Function: (f) => P.alt(
    handleTransform(f),
    handleVar(f),
    handleCalc(f),
    handleGradient(f),
    handleCubicBezier(f),
    handleFunc(f).map(([k, j]) => new FunctionValue(k, j))
  ),
  JSON: (r) => P.seq(r.lcurly, P.regexp(/[^{}]+/), r.rcurly).map((x) => {
    const s = x.join(`
`);
    let obj = eval("(" + s + ")");
    return new ValueUnit(obj, "json");
  }),
  Value: (f) => P.alt(CSSValueUnit.Value, f.Function, f.JSON, f.String).trim(f.ws),
  Values: (f) => f.Value.sepBy(f.ws).map((k) => new ValueArray(k)),
  Variables: (f) => P.seq(
    identifier.skip(f.colon).trim(f.ws).map((k) => hyphenToCamelCase(k)),
    f.Values.skip(f.semi).trim(f.ws)
  ).map(([k, j]) => {
    const we = j.values[0];
    return we.unit === "json" ? transformObject({
      [k]: we.value
    }) : {
      [k]: j
    };
  }),
  Percent: (f) => P.alt(
    integer.skip(P.string("%").or(P.string(""))),
    P.string("from").map(() => "0"),
    P.string("to").map(() => "100")
  ).trim(f.ws).map(Number),
  Percents: (f) => f.Percent.sepBy(f.comma).trim(f.ws),
  Body: (f) => f.Variables.many().trim(f.ws).wrap(f.lcurly, f.rcurly).map((k) => Object.assign({}, ...k)),
  Keyframe: (f) => P.seq(f.Percents, f.Body).map(([k, j]) => {
    const we = {};
    for (const st of k)
      we[st] = j;
    return we;
  }),
  Keyframes: (f) => f.Rule.then(
    f.Keyframe.atLeast(1).trim(f.ws).wrap(f.lcurly, f.rcurly).trim(f.ws)
  ).map((k) => Object.assign({}, ...k))
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
  Rule: (f) => f.dot.trim(f.ws).then(identifier).trim(f.ws),
  Class: (f) => f.Rule.then(
    CSSKeyframes.Body.map((k) => {
      const j = {};
      for (let [we, st] of Object.entries(k))
        if (we.includes("animation")) {
          let Le = we.replace(/^animation/i, "").replace(/^\w/, (pt) => pt.toLowerCase());
          j[Le] = st.toString(), delete k[we];
        }
      return {
        options: j,
        values: k
      };
    })
  )
});
P.createLanguage({
  ws: () => P.optWhitespace,
  Value: (f) => P.alt(
    CSSClass.Class,
    CSSKeyframes.Keyframes.map((k) => ({
      keyframes: k
    }))
  ),
  Values: (f) => f.Value.sepBy(f.ws).map((k) => Object.assign({}, ...k))
});
const parseCSSKeyframes = (f) => CSSKeyframes.Keyframes.tryParse(f), parseCSSPercent = (f) => CSSKeyframes.Percent.tryParse(String(f));
function parseCSSTime(f) {
  return CSSValueUnit.Time.map((k) => k.unit === "ms" ? k.value : k.unit === "s" ? k.value * 1e3 : k.value).tryParse(f);
}
const reverseCSSTime = (f) => f >= 5e3 ? `${f / 1e3}s` : `${f}ms`;
var standaloneExports = {}, standalone = {
  get exports() {
    return standaloneExports;
  },
  set exports(f) {
    standaloneExports = f;
  }
};
(function(f, k) {
  (function(j) {
    f.exports = j();
  })(function() {
    var j = (St, ze) => () => (ze || St((ze = { exports: {} }).exports, ze), ze.exports), we = j((St, ze) => {
      var $e = function(He) {
        return He && He.Math == Math && He;
      };
      ze.exports = $e(typeof globalThis == "object" && globalThis) || $e(typeof window == "object" && window) || $e(typeof self == "object" && self) || $e(typeof commonjsGlobal == "object" && commonjsGlobal) || function() {
        return this;
      }() || Function("return this")();
    }), st = j((St, ze) => {
      ze.exports = function($e) {
        try {
          return !!$e();
        } catch {
          return !0;
        }
      };
    }), Le = j((St, ze) => {
      var $e = st();
      ze.exports = !$e(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }), pt = j((St, ze) => {
      var $e = st();
      ze.exports = !$e(function() {
        var He = function() {
        }.bind();
        return typeof He != "function" || He.hasOwnProperty("prototype");
      });
    }), hr = j((St, ze) => {
      var $e = pt(), He = Function.prototype.call;
      ze.exports = $e ? He.bind(He) : function() {
        return He.apply(He, arguments);
      };
    }), br = j((St) => {
      var ze = {}.propertyIsEnumerable, $e = Object.getOwnPropertyDescriptor, He = $e && !ze.call({ 1: 2 }, 1);
      St.f = He ? function(Ge) {
        var at = $e(this, Ge);
        return !!at && at.enumerable;
      } : ze;
    }), Pr = j((St, ze) => {
      ze.exports = function($e, He) {
        return { enumerable: !($e & 1), configurable: !($e & 2), writable: !($e & 4), value: He };
      };
    }), Ir = j((St, ze) => {
      var $e = pt(), He = Function.prototype, Ge = He.call, at = $e && He.bind.bind(Ge, Ge);
      ze.exports = $e ? at : function(Dt) {
        return function() {
          return Ge.apply(Dt, arguments);
        };
      };
    }), Pn = j((St, ze) => {
      var $e = Ir(), He = $e({}.toString), Ge = $e("".slice);
      ze.exports = function(at) {
        return Ge(He(at), 8, -1);
      };
    }), fn = j((St, ze) => {
      var $e = Ir(), He = st(), Ge = Pn(), at = Object, Dt = $e("".split);
      ze.exports = He(function() {
        return !at("z").propertyIsEnumerable(0);
      }) ? function(Tt) {
        return Ge(Tt) == "String" ? Dt(Tt, "") : at(Tt);
      } : at;
    }), nn = j((St, ze) => {
      ze.exports = function($e) {
        return $e == null;
      };
    }), Mr = j((St, ze) => {
      var $e = nn(), He = TypeError;
      ze.exports = function(Ge) {
        if ($e(Ge))
          throw He("Can't call method on " + Ge);
        return Ge;
      };
    }), zr = j((St, ze) => {
      var $e = fn(), He = Mr();
      ze.exports = function(Ge) {
        return $e(He(Ge));
      };
    }), mn = j((St, ze) => {
      var $e = typeof document == "object" && document.all, He = typeof $e > "u" && $e !== void 0;
      ze.exports = { all: $e, IS_HTMLDDA: He };
    }), qr = j((St, ze) => {
      var $e = mn(), He = $e.all;
      ze.exports = $e.IS_HTMLDDA ? function(Ge) {
        return typeof Ge == "function" || Ge === He;
      } : function(Ge) {
        return typeof Ge == "function";
      };
    }), An = j((St, ze) => {
      var $e = qr(), He = mn(), Ge = He.all;
      ze.exports = He.IS_HTMLDDA ? function(at) {
        return typeof at == "object" ? at !== null : $e(at) || at === Ge;
      } : function(at) {
        return typeof at == "object" ? at !== null : $e(at);
      };
    }), Rn = j((St, ze) => {
      var $e = we(), He = qr(), Ge = function(at) {
        return He(at) ? at : void 0;
      };
      ze.exports = function(at, Dt) {
        return arguments.length < 2 ? Ge($e[at]) : $e[at] && $e[at][Dt];
      };
    }), li = j((St, ze) => {
      var $e = Ir();
      ze.exports = $e({}.isPrototypeOf);
    }), ci = j((St, ze) => {
      var $e = Rn();
      ze.exports = $e("navigator", "userAgent") || "";
    }), Ei = j((St, ze) => {
      var $e = we(), He = ci(), Ge = $e.process, at = $e.Deno, Dt = Ge && Ge.versions || at && at.version, Tt = Dt && Dt.v8, xt, Bt;
      Tt && (xt = Tt.split("."), Bt = xt[0] > 0 && xt[0] < 4 ? 1 : +(xt[0] + xt[1])), !Bt && He && (xt = He.match(/Edge\/(\d+)/), (!xt || xt[1] >= 74) && (xt = He.match(/Chrome\/(\d+)/), xt && (Bt = +xt[1]))), ze.exports = Bt;
    }), Xr = j((St, ze) => {
      var $e = Ei(), He = st();
      ze.exports = !!Object.getOwnPropertySymbols && !He(function() {
        var Ge = Symbol();
        return !String(Ge) || !(Object(Ge) instanceof Symbol) || !Symbol.sham && $e && $e < 41;
      });
    }), gn = j((St, ze) => {
      var $e = Xr();
      ze.exports = $e && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }), yn = j((St, ze) => {
      var $e = Rn(), He = qr(), Ge = li(), at = gn(), Dt = Object;
      ze.exports = at ? function(Tt) {
        return typeof Tt == "symbol";
      } : function(Tt) {
        var xt = $e("Symbol");
        return He(xt) && Ge(xt.prototype, Dt(Tt));
      };
    }), pi = j((St, ze) => {
      var $e = String;
      ze.exports = function(He) {
        try {
          return $e(He);
        } catch {
          return "Object";
        }
      };
    }), Ci = j((St, ze) => {
      var $e = qr(), He = pi(), Ge = TypeError;
      ze.exports = function(at) {
        if ($e(at))
          return at;
        throw Ge(He(at) + " is not a function");
      };
    }), Qn = j((St, ze) => {
      var $e = Ci(), He = nn();
      ze.exports = function(Ge, at) {
        var Dt = Ge[at];
        return He(Dt) ? void 0 : $e(Dt);
      };
    }), ji = j((St, ze) => {
      var $e = hr(), He = qr(), Ge = An(), at = TypeError;
      ze.exports = function(Dt, Tt) {
        var xt, Bt;
        if (Tt === "string" && He(xt = Dt.toString) && !Ge(Bt = $e(xt, Dt)) || He(xt = Dt.valueOf) && !Ge(Bt = $e(xt, Dt)) || Tt !== "string" && He(xt = Dt.toString) && !Ge(Bt = $e(xt, Dt)))
          return Bt;
        throw at("Can't convert object to primitive value");
      };
    }), fi = j((St, ze) => {
      ze.exports = !1;
    }), Bn = j((St, ze) => {
      var $e = we(), He = Object.defineProperty;
      ze.exports = function(Ge, at) {
        try {
          He($e, Ge, { value: at, configurable: !0, writable: !0 });
        } catch {
          $e[Ge] = at;
        }
        return at;
      };
    }), Vn = j((St, ze) => {
      var $e = we(), He = Bn(), Ge = "__core-js_shared__", at = $e[Ge] || He(Ge, {});
      ze.exports = at;
    }), Yi = j((St, ze) => {
      var $e = fi(), He = Vn();
      (ze.exports = function(Ge, at) {
        return He[Ge] || (He[Ge] = at !== void 0 ? at : {});
      })("versions", []).push({ version: "3.26.1", mode: $e ? "pure" : "global", copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)", license: "https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE", source: "https://github.com/zloirock/core-js" });
    }), Qi = j((St, ze) => {
      var $e = Mr(), He = Object;
      ze.exports = function(Ge) {
        return He($e(Ge));
      };
    }), en = j((St, ze) => {
      var $e = Ir(), He = Qi(), Ge = $e({}.hasOwnProperty);
      ze.exports = Object.hasOwn || function(at, Dt) {
        return Ge(He(at), Dt);
      };
    }), Zi = j((St, ze) => {
      var $e = Ir(), He = 0, Ge = Math.random(), at = $e(1 .toString);
      ze.exports = function(Dt) {
        return "Symbol(" + (Dt === void 0 ? "" : Dt) + ")_" + at(++He + Ge, 36);
      };
    }), di = j((St, ze) => {
      var $e = we(), He = Yi(), Ge = en(), at = Zi(), Dt = Xr(), Tt = gn(), xt = He("wks"), Bt = $e.Symbol, Gt = Bt && Bt.for, Kt = Tt ? Bt : Bt && Bt.withoutSetter || at;
      ze.exports = function(Zt) {
        if (!Ge(xt, Zt) || !(Dt || typeof xt[Zt] == "string")) {
          var Wt = "Symbol." + Zt;
          Dt && Ge(Bt, Zt) ? xt[Zt] = Bt[Zt] : Tt && Gt ? xt[Zt] = Gt(Wt) : xt[Zt] = Kt(Wt);
        }
        return xt[Zt];
      };
    }), bu = j((St, ze) => {
      var $e = hr(), He = An(), Ge = yn(), at = Qn(), Dt = ji(), Tt = di(), xt = TypeError, Bt = Tt("toPrimitive");
      ze.exports = function(Gt, Kt) {
        if (!He(Gt) || Ge(Gt))
          return Gt;
        var Zt = at(Gt, Bt), Wt;
        if (Zt) {
          if (Kt === void 0 && (Kt = "default"), Wt = $e(Zt, Gt, Kt), !He(Wt) || Ge(Wt))
            return Wt;
          throw xt("Can't convert object to primitive value");
        }
        return Kt === void 0 && (Kt = "number"), Dt(Gt, Kt);
      };
    }), ui = j((St, ze) => {
      var $e = bu(), He = yn();
      ze.exports = function(Ge) {
        var at = $e(Ge, "string");
        return He(at) ? at : at + "";
      };
    }), Pi = j((St, ze) => {
      var $e = we(), He = An(), Ge = $e.document, at = He(Ge) && He(Ge.createElement);
      ze.exports = function(Dt) {
        return at ? Ge.createElement(Dt) : {};
      };
    }), _i = j((St, ze) => {
      var $e = Le(), He = st(), Ge = Pi();
      ze.exports = !$e && !He(function() {
        return Object.defineProperty(Ge("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }), eu = j((St) => {
      var ze = Le(), $e = hr(), He = br(), Ge = Pr(), at = zr(), Dt = ui(), Tt = en(), xt = _i(), Bt = Object.getOwnPropertyDescriptor;
      St.f = ze ? Bt : function(Gt, Kt) {
        if (Gt = at(Gt), Kt = Dt(Kt), xt)
          try {
            return Bt(Gt, Kt);
          } catch {
          }
        if (Tt(Gt, Kt))
          return Ge(!$e(He.f, Gt, Kt), Gt[Kt]);
      };
    }), Eu = j((St, ze) => {
      var $e = Le(), He = st();
      ze.exports = $e && He(function() {
        return Object.defineProperty(function() {
        }, "prototype", { value: 42, writable: !1 }).prototype != 42;
      });
    }), ei = j((St, ze) => {
      var $e = An(), He = String, Ge = TypeError;
      ze.exports = function(at) {
        if ($e(at))
          return at;
        throw Ge(He(at) + " is not an object");
      };
    }), _n = j((St) => {
      var ze = Le(), $e = _i(), He = Eu(), Ge = ei(), at = ui(), Dt = TypeError, Tt = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, Bt = "enumerable", Gt = "configurable", Kt = "writable";
      St.f = ze ? He ? function(Zt, Wt, Ce) {
        if (Ge(Zt), Wt = at(Wt), Ge(Ce), typeof Zt == "function" && Wt === "prototype" && "value" in Ce && Kt in Ce && !Ce[Kt]) {
          var ar = xt(Zt, Wt);
          ar && ar[Kt] && (Zt[Wt] = Ce.value, Ce = { configurable: Gt in Ce ? Ce[Gt] : ar[Gt], enumerable: Bt in Ce ? Ce[Bt] : ar[Bt], writable: !1 });
        }
        return Tt(Zt, Wt, Ce);
      } : Tt : function(Zt, Wt, Ce) {
        if (Ge(Zt), Wt = at(Wt), Ge(Ce), $e)
          try {
            return Tt(Zt, Wt, Ce);
          } catch {
          }
        if ("get" in Ce || "set" in Ce)
          throw Dt("Accessors not supported");
        return "value" in Ce && (Zt[Wt] = Ce.value), Zt;
      };
    }), qn = j((St, ze) => {
      var $e = Le(), He = _n(), Ge = Pr();
      ze.exports = $e ? function(at, Dt, Tt) {
        return He.f(at, Dt, Ge(1, Tt));
      } : function(at, Dt, Tt) {
        return at[Dt] = Tt, at;
      };
    }), Ii = j((St, ze) => {
      var $e = Le(), He = en(), Ge = Function.prototype, at = $e && Object.getOwnPropertyDescriptor, Dt = He(Ge, "name"), Tt = Dt && function() {
      }.name === "something", xt = Dt && (!$e || $e && at(Ge, "name").configurable);
      ze.exports = { EXISTS: Dt, PROPER: Tt, CONFIGURABLE: xt };
    }), tu = j((St, ze) => {
      var $e = Ir(), He = qr(), Ge = Vn(), at = $e(Function.toString);
      He(Ge.inspectSource) || (Ge.inspectSource = function(Dt) {
        return at(Dt);
      }), ze.exports = Ge.inspectSource;
    }), ru = j((St, ze) => {
      var $e = we(), He = qr(), Ge = $e.WeakMap;
      ze.exports = He(Ge) && /native code/.test(String(Ge));
    }), xi = j((St, ze) => {
      var $e = Yi(), He = Zi(), Ge = $e("keys");
      ze.exports = function(at) {
        return Ge[at] || (Ge[at] = He(at));
      };
    }), Nn = j((St, ze) => {
      ze.exports = {};
    }), si = j((St, ze) => {
      var $e = ru(), He = we(), Ge = An(), at = qn(), Dt = en(), Tt = Vn(), xt = xi(), Bt = Nn(), Gt = "Object already initialized", Kt = He.TypeError, Zt = He.WeakMap, Wt, Ce, ar, Er = function(Be) {
        return ar(Be) ? Ce(Be) : Wt(Be, {});
      }, jr = function(Be) {
        return function(vn) {
          var Ai;
          if (!Ge(vn) || (Ai = Ce(vn)).type !== Be)
            throw Kt("Incompatible receiver, " + Be + " required");
          return Ai;
        };
      };
      $e || Tt.state ? (Nr = Tt.state || (Tt.state = new Zt()), Nr.get = Nr.get, Nr.has = Nr.has, Nr.set = Nr.set, Wt = function(Be, vn) {
        if (Nr.has(Be))
          throw Kt(Gt);
        return vn.facade = Be, Nr.set(Be, vn), vn;
      }, Ce = function(Be) {
        return Nr.get(Be) || {};
      }, ar = function(Be) {
        return Nr.has(Be);
      }) : (Kr = xt("state"), Bt[Kr] = !0, Wt = function(Be, vn) {
        if (Dt(Be, Kr))
          throw Kt(Gt);
        return vn.facade = Be, at(Be, Kr, vn), vn;
      }, Ce = function(Be) {
        return Dt(Be, Kr) ? Be[Kr] : {};
      }, ar = function(Be) {
        return Dt(Be, Kr);
      });
      var Nr, Kr;
      ze.exports = { set: Wt, get: Ce, has: ar, enforce: Er, getterFor: jr };
    }), Fi = j((St, ze) => {
      var $e = st(), He = qr(), Ge = en(), at = Le(), Dt = Ii().CONFIGURABLE, Tt = tu(), xt = si(), Bt = xt.enforce, Gt = xt.get, Kt = Object.defineProperty, Zt = at && !$e(function() {
        return Kt(function() {
        }, "length", { value: 8 }).length !== 8;
      }), Wt = String(String).split("String"), Ce = ze.exports = function(ar, Er, jr) {
        String(Er).slice(0, 7) === "Symbol(" && (Er = "[" + String(Er).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"), jr && jr.getter && (Er = "get " + Er), jr && jr.setter && (Er = "set " + Er), (!Ge(ar, "name") || Dt && ar.name !== Er) && (at ? Kt(ar, "name", { value: Er, configurable: !0 }) : ar.name = Er), Zt && jr && Ge(jr, "arity") && ar.length !== jr.arity && Kt(ar, "length", { value: jr.arity });
        try {
          jr && Ge(jr, "constructor") && jr.constructor ? at && Kt(ar, "prototype", { writable: !1 }) : ar.prototype && (ar.prototype = void 0);
        } catch {
        }
        var Nr = Bt(ar);
        return Ge(Nr, "source") || (Nr.source = Wt.join(typeof Er == "string" ? Er : "")), ar;
      };
      Function.prototype.toString = Ce(function() {
        return He(this) && Gt(this).source || Tt(this);
      }, "toString");
    }), Oi = j((St, ze) => {
      var $e = qr(), He = _n(), Ge = Fi(), at = Bn();
      ze.exports = function(Dt, Tt, xt, Bt) {
        Bt || (Bt = {});
        var Gt = Bt.enumerable, Kt = Bt.name !== void 0 ? Bt.name : Tt;
        if ($e(xt) && Ge(xt, Kt, Bt), Bt.global)
          Gt ? Dt[Tt] = xt : at(Tt, xt);
        else {
          try {
            Bt.unsafe ? Dt[Tt] && (Gt = !0) : delete Dt[Tt];
          } catch {
          }
          Gt ? Dt[Tt] = xt : He.f(Dt, Tt, { value: xt, enumerable: !1, configurable: !Bt.nonConfigurable, writable: !Bt.nonWritable });
        }
        return Dt;
      };
    }), Cu = j((St, ze) => {
      var $e = Math.ceil, He = Math.floor;
      ze.exports = Math.trunc || function(Ge) {
        var at = +Ge;
        return (at > 0 ? He : $e)(at);
      };
    }), oi = j((St, ze) => {
      var $e = Cu();
      ze.exports = function(He) {
        var Ge = +He;
        return Ge !== Ge || Ge === 0 ? 0 : $e(Ge);
      };
    }), xu = j((St, ze) => {
      var $e = oi(), He = Math.max, Ge = Math.min;
      ze.exports = function(at, Dt) {
        var Tt = $e(at);
        return Tt < 0 ? He(Tt + Dt, 0) : Ge(Tt, Dt);
      };
    }), nu = j((St, ze) => {
      var $e = oi(), He = Math.min;
      ze.exports = function(Ge) {
        return Ge > 0 ? He($e(Ge), 9007199254740991) : 0;
      };
    }), Jn = j((St, ze) => {
      var $e = nu();
      ze.exports = function(He) {
        return $e(He.length);
      };
    }), Ku = j((St, ze) => {
      var $e = zr(), He = xu(), Ge = Jn(), at = function(Dt) {
        return function(Tt, xt, Bt) {
          var Gt = $e(Tt), Kt = Ge(Gt), Zt = He(Bt, Kt), Wt;
          if (Dt && xt != xt) {
            for (; Kt > Zt; )
              if (Wt = Gt[Zt++], Wt != Wt)
                return !0;
          } else
            for (; Kt > Zt; Zt++)
              if ((Dt || Zt in Gt) && Gt[Zt] === xt)
                return Dt || Zt || 0;
          return !Dt && -1;
        };
      };
      ze.exports = { includes: at(!0), indexOf: at(!1) };
    }), Yu = j((St, ze) => {
      var $e = Ir(), He = en(), Ge = zr(), at = Ku().indexOf, Dt = Nn(), Tt = $e([].push);
      ze.exports = function(xt, Bt) {
        var Gt = Ge(xt), Kt = 0, Zt = [], Wt;
        for (Wt in Gt)
          !He(Dt, Wt) && He(Gt, Wt) && Tt(Zt, Wt);
        for (; Bt.length > Kt; )
          He(Gt, Wt = Bt[Kt++]) && (~at(Zt, Wt) || Tt(Zt, Wt));
        return Zt;
      };
    }), iu = j((St, ze) => {
      ze.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }), Qu = j((St) => {
      var ze = Yu(), $e = iu(), He = $e.concat("length", "prototype");
      St.f = Object.getOwnPropertyNames || function(Ge) {
        return ze(Ge, He);
      };
    }), Zu = j((St) => {
      St.f = Object.getOwnPropertySymbols;
    }), es = j((St, ze) => {
      var $e = Rn(), He = Ir(), Ge = Qu(), at = Zu(), Dt = ei(), Tt = He([].concat);
      ze.exports = $e("Reflect", "ownKeys") || function(xt) {
        var Bt = Ge.f(Dt(xt)), Gt = at.f;
        return Gt ? Tt(Bt, Gt(xt)) : Bt;
      };
    }), ts = j((St, ze) => {
      var $e = en(), He = es(), Ge = eu(), at = _n();
      ze.exports = function(Dt, Tt, xt) {
        for (var Bt = He(Tt), Gt = at.f, Kt = Ge.f, Zt = 0; Zt < Bt.length; Zt++) {
          var Wt = Bt[Zt];
          !$e(Dt, Wt) && !(xt && $e(xt, Wt)) && Gt(Dt, Wt, Kt(Tt, Wt));
        }
      };
    }), rs = j((St, ze) => {
      var $e = st(), He = qr(), Ge = /#|\.prototype\./, at = function(Gt, Kt) {
        var Zt = Tt[Dt(Gt)];
        return Zt == Bt ? !0 : Zt == xt ? !1 : He(Kt) ? $e(Kt) : !!Kt;
      }, Dt = at.normalize = function(Gt) {
        return String(Gt).replace(Ge, ".").toLowerCase();
      }, Tt = at.data = {}, xt = at.NATIVE = "N", Bt = at.POLYFILL = "P";
      ze.exports = at;
    }), Li = j((St, ze) => {
      var $e = we(), He = eu().f, Ge = qn(), at = Oi(), Dt = Bn(), Tt = ts(), xt = rs();
      ze.exports = function(Bt, Gt) {
        var Kt = Bt.target, Zt = Bt.global, Wt = Bt.stat, Ce, ar, Er, jr, Nr, Kr;
        if (Zt ? ar = $e : Wt ? ar = $e[Kt] || Dt(Kt, {}) : ar = ($e[Kt] || {}).prototype, ar)
          for (Er in Gt) {
            if (Nr = Gt[Er], Bt.dontCallGetSet ? (Kr = He(ar, Er), jr = Kr && Kr.value) : jr = ar[Er], Ce = xt(Zt ? Er : Kt + (Wt ? "." : "#") + Er, Bt.forced), !Ce && jr !== void 0) {
              if (typeof Nr == typeof jr)
                continue;
              Tt(Nr, jr);
            }
            (Bt.sham || jr && jr.sham) && Ge(Nr, "sham", !0), at(ar, Er, Nr, Bt);
          }
      };
    }), uu = j((St, ze) => {
      var $e = Pn();
      ze.exports = Array.isArray || function(He) {
        return $e(He) == "Array";
      };
    }), Fu = j((St, ze) => {
      var $e = TypeError, He = 9007199254740991;
      ze.exports = function(Ge) {
        if (Ge > He)
          throw $e("Maximum allowed index exceeded");
        return Ge;
      };
    }), Au = j((St, ze) => {
      var $e = Pn(), He = Ir();
      ze.exports = function(Ge) {
        if ($e(Ge) === "Function")
          return He(Ge);
      };
    }), qt = j((St, ze) => {
      var $e = Au(), He = Ci(), Ge = pt(), at = $e($e.bind);
      ze.exports = function(Dt, Tt) {
        return He(Dt), Tt === void 0 ? Dt : Ge ? at(Dt, Tt) : function() {
          return Dt.apply(Tt, arguments);
        };
      };
    }), ft = j((St, ze) => {
      var $e = uu(), He = Jn(), Ge = Fu(), at = qt(), Dt = function(Tt, xt, Bt, Gt, Kt, Zt, Wt, Ce) {
        for (var ar = Kt, Er = 0, jr = Wt ? at(Wt, Ce) : !1, Nr, Kr; Er < Gt; )
          Er in Bt && (Nr = jr ? jr(Bt[Er], Er, xt) : Bt[Er], Zt > 0 && $e(Nr) ? (Kr = He(Nr), ar = Dt(Tt, xt, Nr, Kr, ar, Zt - 1) - 1) : (Ge(ar + 1), Tt[ar] = Nr), ar++), Er++;
        return ar;
      };
      ze.exports = Dt;
    }), J = j((St, ze) => {
      var $e = di(), He = $e("toStringTag"), Ge = {};
      Ge[He] = "z", ze.exports = String(Ge) === "[object z]";
    }), fe = j((St, ze) => {
      var $e = J(), He = qr(), Ge = Pn(), at = di(), Dt = at("toStringTag"), Tt = Object, xt = Ge(function() {
        return arguments;
      }()) == "Arguments", Bt = function(Gt, Kt) {
        try {
          return Gt[Kt];
        } catch {
        }
      };
      ze.exports = $e ? Ge : function(Gt) {
        var Kt, Zt, Wt;
        return Gt === void 0 ? "Undefined" : Gt === null ? "Null" : typeof (Zt = Bt(Kt = Tt(Gt), Dt)) == "string" ? Zt : xt ? Ge(Kt) : (Wt = Ge(Kt)) == "Object" && He(Kt.callee) ? "Arguments" : Wt;
      };
    }), Ee = j((St, ze) => {
      var $e = Ir(), He = st(), Ge = qr(), at = fe(), Dt = Rn(), Tt = tu(), xt = function() {
      }, Bt = [], Gt = Dt("Reflect", "construct"), Kt = /^\s*(?:class|function)\b/, Zt = $e(Kt.exec), Wt = !Kt.exec(xt), Ce = function(Er) {
        if (!Ge(Er))
          return !1;
        try {
          return Gt(xt, Bt, Er), !0;
        } catch {
          return !1;
        }
      }, ar = function(Er) {
        if (!Ge(Er))
          return !1;
        switch (at(Er)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return !1;
        }
        try {
          return Wt || !!Zt(Kt, Tt(Er));
        } catch {
          return !0;
        }
      };
      ar.sham = !0, ze.exports = !Gt || He(function() {
        var Er;
        return Ce(Ce.call) || !Ce(Object) || !Ce(function() {
          Er = !0;
        }) || Er;
      }) ? ar : Ce;
    }), Pe = j((St, ze) => {
      var $e = uu(), He = Ee(), Ge = An(), at = di(), Dt = at("species"), Tt = Array;
      ze.exports = function(xt) {
        var Bt;
        return $e(xt) && (Bt = xt.constructor, He(Bt) && (Bt === Tt || $e(Bt.prototype)) ? Bt = void 0 : Ge(Bt) && (Bt = Bt[Dt], Bt === null && (Bt = void 0))), Bt === void 0 ? Tt : Bt;
      };
    }), et = j((St, ze) => {
      var $e = Pe();
      ze.exports = function(He, Ge) {
        return new ($e(He))(Ge === 0 ? 0 : Ge);
      };
    }), Ae = j(() => {
      var St = Li(), ze = ft(), $e = Ci(), He = Qi(), Ge = Jn(), at = et();
      St({ target: "Array", proto: !0 }, { flatMap: function(Dt) {
        var Tt = He(this), xt = Ge(Tt), Bt;
        return $e(Dt), Bt = at(Tt, 0), Bt.length = ze(Bt, Tt, Tt, xt, 0, 1, Dt, arguments.length > 1 ? arguments[1] : void 0), Bt;
      } });
    }), lt = j((St, ze) => {
      ze.exports = {};
    }), wt = j((St, ze) => {
      var $e = di(), He = lt(), Ge = $e("iterator"), at = Array.prototype;
      ze.exports = function(Dt) {
        return Dt !== void 0 && (He.Array === Dt || at[Ge] === Dt);
      };
    }), Rt = j((St, ze) => {
      var $e = fe(), He = Qn(), Ge = nn(), at = lt(), Dt = di(), Tt = Dt("iterator");
      ze.exports = function(xt) {
        if (!Ge(xt))
          return He(xt, Tt) || He(xt, "@@iterator") || at[$e(xt)];
      };
    }), Ye = j((St, ze) => {
      var $e = hr(), He = Ci(), Ge = ei(), at = pi(), Dt = Rt(), Tt = TypeError;
      ze.exports = function(xt, Bt) {
        var Gt = arguments.length < 2 ? Dt(xt) : Bt;
        if (He(Gt))
          return Ge($e(Gt, xt));
        throw Tt(at(xt) + " is not iterable");
      };
    }), Ht = j((St, ze) => {
      var $e = hr(), He = ei(), Ge = Qn();
      ze.exports = function(at, Dt, Tt) {
        var xt, Bt;
        He(at);
        try {
          if (xt = Ge(at, "return"), !xt) {
            if (Dt === "throw")
              throw Tt;
            return Tt;
          }
          xt = $e(xt, at);
        } catch (Gt) {
          Bt = !0, xt = Gt;
        }
        if (Dt === "throw")
          throw Tt;
        if (Bt)
          throw xt;
        return He(xt), Tt;
      };
    }), ur = j((St, ze) => {
      var $e = qt(), He = hr(), Ge = ei(), at = pi(), Dt = wt(), Tt = Jn(), xt = li(), Bt = Ye(), Gt = Rt(), Kt = Ht(), Zt = TypeError, Wt = function(ar, Er) {
        this.stopped = ar, this.result = Er;
      }, Ce = Wt.prototype;
      ze.exports = function(ar, Er, jr) {
        var Nr = jr && jr.that, Kr = !!(jr && jr.AS_ENTRIES), Be = !!(jr && jr.IS_RECORD), vn = !!(jr && jr.IS_ITERATOR), Ai = !!(jr && jr.INTERRUPTED), Mi = $e(Er, Nr), On, hi, dn, wu, Un, Su, Tu, jn = function(kn) {
          return On && Kt(On, "normal", kn), new Wt(!0, kn);
        }, bn = function(kn) {
          return Kr ? (Ge(kn), Ai ? Mi(kn[0], kn[1], jn) : Mi(kn[0], kn[1])) : Ai ? Mi(kn, jn) : Mi(kn);
        };
        if (Be)
          On = ar.iterator;
        else if (vn)
          On = ar;
        else {
          if (hi = Gt(ar), !hi)
            throw Zt(at(ar) + " is not iterable");
          if (Dt(hi)) {
            for (dn = 0, wu = Tt(ar); wu > dn; dn++)
              if (Un = bn(ar[dn]), Un && xt(Ce, Un))
                return Un;
            return new Wt(!1);
          }
          On = Bt(ar, hi);
        }
        for (Su = Be ? ar.next : On.next; !(Tu = He(Su, On)).done; ) {
          try {
            Un = bn(Tu.value);
          } catch (kn) {
            Kt(On, "throw", kn);
          }
          if (typeof Un == "object" && Un && xt(Ce, Un))
            return Un;
        }
        return new Wt(!1);
      };
    }), xr = j((St, ze) => {
      var $e = ui(), He = _n(), Ge = Pr();
      ze.exports = function(at, Dt, Tt) {
        var xt = $e(Dt);
        xt in at ? He.f(at, xt, Ge(0, Tt)) : at[xt] = Tt;
      };
    }), Tr = j(() => {
      var St = Li(), ze = ur(), $e = xr();
      St({ target: "Object", stat: !0 }, { fromEntries: function(He) {
        var Ge = {};
        return ze(He, function(at, Dt) {
          $e(Ge, at, Dt);
        }, { AS_ENTRIES: !0 }), Ge;
      } });
    }), $r = j((St, ze) => {
      var $e = Fi(), He = _n();
      ze.exports = function(Ge, at, Dt) {
        return Dt.get && $e(Dt.get, at, { getter: !0 }), Dt.set && $e(Dt.set, at, { setter: !0 }), He.f(Ge, at, Dt);
      };
    }), Wr = j((St, ze) => {
      var $e = ei();
      ze.exports = function() {
        var He = $e(this), Ge = "";
        return He.hasIndices && (Ge += "d"), He.global && (Ge += "g"), He.ignoreCase && (Ge += "i"), He.multiline && (Ge += "m"), He.dotAll && (Ge += "s"), He.unicode && (Ge += "u"), He.unicodeSets && (Ge += "v"), He.sticky && (Ge += "y"), Ge;
      };
    }), wr = j(() => {
      var St = we(), ze = Le(), $e = $r(), He = Wr(), Ge = st(), at = St.RegExp, Dt = at.prototype, Tt = ze && Ge(function() {
        var xt = !0;
        try {
          at(".", "d");
        } catch {
          xt = !1;
        }
        var Bt = {}, Gt = "", Kt = xt ? "dgimsy" : "gimsy", Zt = function(Er, jr) {
          Object.defineProperty(Bt, Er, { get: function() {
            return Gt += jr, !0;
          } });
        }, Wt = { dotAll: "s", global: "g", ignoreCase: "i", multiline: "m", sticky: "y" };
        xt && (Wt.hasIndices = "d");
        for (var Ce in Wt)
          Zt(Ce, Wt[Ce]);
        var ar = Object.getOwnPropertyDescriptor(Dt, "flags").get.call(Bt);
        return ar !== Kt || Gt !== Kt;
      });
      Tt && $e(Dt, "flags", { configurable: !0, get: He });
    }), un = j(() => {
      var St = Li(), ze = we();
      St({ global: !0, forced: ze.globalThis !== ze }, { globalThis: ze });
    }), Lr = j(() => {
      un();
    }), sn = j(() => {
      var St = Li(), ze = ft(), $e = Qi(), He = Jn(), Ge = oi(), at = et();
      St({ target: "Array", proto: !0 }, { flat: function() {
        var Dt = arguments.length ? arguments[0] : void 0, Tt = $e(this), xt = He(Tt), Bt = at(Tt, 0);
        return Bt.length = ze(Bt, Tt, Tt, xt, 0, Dt === void 0 ? 1 : Ge(Dt)), Bt;
      } });
    }), In = j((St, ze) => {
      var $e = ["cliName", "cliCategory", "cliDescription"], He = ["_"], Ge = ["languageId"];
      function at(o, m) {
        if (o == null)
          return {};
        var t = Dt(o, m), p, c;
        if (Object.getOwnPropertySymbols) {
          var e = Object.getOwnPropertySymbols(o);
          for (c = 0; c < e.length; c++)
            p = e[c], !(m.indexOf(p) >= 0) && Object.prototype.propertyIsEnumerable.call(o, p) && (t[p] = o[p]);
        }
        return t;
      }
      function Dt(o, m) {
        if (o == null)
          return {};
        var t = {}, p = Object.keys(o), c, e;
        for (e = 0; e < p.length; e++)
          c = p[e], !(m.indexOf(c) >= 0) && (t[c] = o[c]);
        return t;
      }
      Ae(), Tr(), wr(), Lr(), sn();
      var Tt = Object.create, xt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, Gt = Object.getOwnPropertyNames, Kt = Object.getPrototypeOf, Zt = Object.prototype.hasOwnProperty, Wt = (o, m) => function() {
        return o && (m = (0, o[Gt(o)[0]])(o = 0)), m;
      }, Ce = (o, m) => function() {
        return m || (0, o[Gt(o)[0]])((m = { exports: {} }).exports, m), m.exports;
      }, ar = (o, m) => {
        for (var t in m)
          xt(o, t, { get: m[t], enumerable: !0 });
      }, Er = (o, m, t, p) => {
        if (m && typeof m == "object" || typeof m == "function")
          for (let c of Gt(m))
            !Zt.call(o, c) && c !== t && xt(o, c, { get: () => m[c], enumerable: !(p = Bt(m, c)) || p.enumerable });
        return o;
      }, jr = (o, m, t) => (t = o != null ? Tt(Kt(o)) : {}, Er(m || !o || !o.__esModule ? xt(t, "default", { value: o, enumerable: !0 }) : t, o)), Nr = (o) => Er(xt({}, "__esModule", { value: !0 }), o), Kr, Be = Wt({ "<define:process>"() {
        Kr = { env: {}, argv: [] };
      } }), vn = Ce({ "package.json"(o, m) {
        m.exports = { version: "2.8.3" };
      } }), Ai = Ce({ "node_modules/diff/lib/diff/base.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.default = m;
        function m() {
        }
        m.prototype = { diff: function(c, e) {
          var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, u = i.callback;
          typeof i == "function" && (u = i, i = {}), this.options = i;
          var h = this;
          function D(B) {
            return u ? (setTimeout(function() {
              u(void 0, B);
            }, 0), !0) : B;
          }
          c = this.castInput(c), e = this.castInput(e), c = this.removeEmpty(this.tokenize(c)), e = this.removeEmpty(this.tokenize(e));
          var E = e.length, C = c.length, F = 1, g = E + C, b = [{ newPos: -1, components: [] }], T = this.extractCommon(b[0], e, c, 0);
          if (b[0].newPos + 1 >= E && T + 1 >= C)
            return D([{ value: this.join(e), count: e.length }]);
          function G() {
            for (var B = -1 * F; B <= F; B += 2) {
              var _ = void 0, U = b[B - 1], Q = b[B + 1], H = (Q ? Q.newPos : 0) - B;
              U && (b[B - 1] = void 0);
              var ge = U && U.newPos + 1 < E, y = Q && 0 <= H && H < C;
              if (!ge && !y) {
                b[B] = void 0;
                continue;
              }
              if (!ge || y && U.newPos < Q.newPos ? (_ = p(Q), h.pushComponent(_.components, void 0, !0)) : (_ = U, _.newPos++, h.pushComponent(_.components, !0, void 0)), H = h.extractCommon(_, e, c, B), _.newPos + 1 >= E && H + 1 >= C)
                return D(t(h, _.components, e, c, h.useLongestToken));
              b[B] = _;
            }
            F++;
          }
          if (u)
            (function B() {
              setTimeout(function() {
                if (F > g)
                  return u();
                G() || B();
              }, 0);
            })();
          else
            for (; F <= g; ) {
              var W = G();
              if (W)
                return W;
            }
        }, pushComponent: function(c, e, i) {
          var u = c[c.length - 1];
          u && u.added === e && u.removed === i ? c[c.length - 1] = { count: u.count + 1, added: e, removed: i } : c.push({ count: 1, added: e, removed: i });
        }, extractCommon: function(c, e, i, u) {
          for (var h = e.length, D = i.length, E = c.newPos, C = E - u, F = 0; E + 1 < h && C + 1 < D && this.equals(e[E + 1], i[C + 1]); )
            E++, C++, F++;
          return F && c.components.push({ count: F }), c.newPos = E, C;
        }, equals: function(c, e) {
          return this.options.comparator ? this.options.comparator(c, e) : c === e || this.options.ignoreCase && c.toLowerCase() === e.toLowerCase();
        }, removeEmpty: function(c) {
          for (var e = [], i = 0; i < c.length; i++)
            c[i] && e.push(c[i]);
          return e;
        }, castInput: function(c) {
          return c;
        }, tokenize: function(c) {
          return c.split("");
        }, join: function(c) {
          return c.join("");
        } };
        function t(c, e, i, u, h) {
          for (var D = 0, E = e.length, C = 0, F = 0; D < E; D++) {
            var g = e[D];
            if (g.removed) {
              if (g.value = c.join(u.slice(F, F + g.count)), F += g.count, D && e[D - 1].added) {
                var b = e[D - 1];
                e[D - 1] = e[D], e[D] = b;
              }
            } else {
              if (!g.added && h) {
                var T = i.slice(C, C + g.count);
                T = T.map(function(W, B) {
                  var _ = u[F + B];
                  return _.length > W.length ? _ : W;
                }), g.value = c.join(T);
              } else
                g.value = c.join(i.slice(C, C + g.count));
              C += g.count, g.added || (F += g.count);
            }
          }
          var G = e[E - 1];
          return E > 1 && typeof G.value == "string" && (G.added || G.removed) && c.equals("", G.value) && (e[E - 2].value += G.value, e.pop()), e;
        }
        function p(c) {
          return { newPos: c.newPos, components: c.components.slice(0) };
        }
      } }), Mi = Ce({ "node_modules/diff/lib/diff/array.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.diffArrays = c, o.arrayDiff = void 0;
        var m = t(Ai());
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var p = new m.default();
        o.arrayDiff = p, p.tokenize = function(e) {
          return e.slice();
        }, p.join = p.removeEmpty = function(e) {
          return e;
        };
        function c(e, i, u) {
          return p.diff(e, i, u);
        }
      } }), On = Ce({ "src/document/doc-builders.js"(o, m) {
        Be();
        function t(S) {
          return { type: "concat", parts: S };
        }
        function p(S) {
          return { type: "indent", contents: S };
        }
        function c(S, l) {
          return { type: "align", contents: l, n: S };
        }
        function e(S) {
          let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return { type: "group", id: l.id, contents: S, break: Boolean(l.shouldBreak), expandedStates: l.expandedStates };
        }
        function i(S) {
          return c(Number.NEGATIVE_INFINITY, S);
        }
        function u(S) {
          return c({ type: "root" }, S);
        }
        function h(S) {
          return c(-1, S);
        }
        function D(S, l) {
          return e(S[0], Object.assign(Object.assign({}, l), {}, { expandedStates: S }));
        }
        function E(S) {
          return { type: "fill", parts: S };
        }
        function C(S, l) {
          let A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return { type: "if-break", breakContents: S, flatContents: l, groupId: A.groupId };
        }
        function F(S, l) {
          return { type: "indent-if-break", contents: S, groupId: l.groupId, negate: l.negate };
        }
        function g(S) {
          return { type: "line-suffix", contents: S };
        }
        var b = { type: "line-suffix-boundary" }, T = { type: "break-parent" }, G = { type: "trim" }, W = { type: "line", hard: !0 }, B = { type: "line", hard: !0, literal: !0 }, _ = { type: "line" }, U = { type: "line", soft: !0 }, Q = t([W, T]), H = t([B, T]), ge = { type: "cursor", placeholder: Symbol("cursor") };
        function y(S, l) {
          let A = [];
          for (let w = 0; w < l.length; w++)
            w !== 0 && A.push(S), A.push(l[w]);
          return t(A);
        }
        function R(S, l, A) {
          let w = S;
          if (l > 0) {
            for (let I = 0; I < Math.floor(l / A); ++I)
              w = p(w);
            w = c(l % A, w), w = c(Number.NEGATIVE_INFINITY, w);
          }
          return w;
        }
        function v(S, l) {
          return { type: "label", label: S, contents: l };
        }
        m.exports = { concat: t, join: y, line: _, softline: U, hardline: Q, literalline: H, group: e, conditionalGroup: D, fill: E, lineSuffix: g, lineSuffixBoundary: b, cursor: ge, breakParent: T, ifBreak: C, trim: G, indent: p, indentIfBreak: F, align: c, addAlignmentToDoc: R, markAsRoot: u, dedentToRoot: i, dedent: h, hardlineWithoutBreakParent: W, literallineWithoutBreakParent: B, label: v };
      } }), hi = Ce({ "src/common/end-of-line.js"(o, m) {
        Be();
        function t(i) {
          let u = i.indexOf("\r");
          return u >= 0 ? i.charAt(u + 1) === `
` ? "crlf" : "cr" : "lf";
        }
        function p(i) {
          switch (i) {
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
        function c(i, u) {
          let h;
          switch (u) {
            case `
`:
              h = /\n/g;
              break;
            case "\r":
              h = /\r/g;
              break;
            case `\r
`:
              h = /\r\n/g;
              break;
            default:
              throw new Error(`Unexpected "eol" ${JSON.stringify(u)}.`);
          }
          let D = i.match(h);
          return D ? D.length : 0;
        }
        function e(i) {
          return i.replace(/\r\n?/g, `
`);
        }
        m.exports = { guessEndOfLine: t, convertEndOfLineToChars: p, countEndOfLineChars: c, normalizeEndOfLine: e };
      } }), dn = Ce({ "src/utils/get-last.js"(o, m) {
        Be();
        var t = (p) => p[p.length - 1];
        m.exports = t;
      } });
      function wu() {
        let { onlyFirst: o = !1 } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, m = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(m, o ? void 0 : "g");
      }
      var Un = Wt({ "node_modules/strip-ansi/node_modules/ansi-regex/index.js"() {
        Be();
      } });
      function Su(o) {
        if (typeof o != "string")
          throw new TypeError(`Expected a \`string\`, got \`${typeof o}\``);
        return o.replace(wu(), "");
      }
      var Tu = Wt({ "node_modules/strip-ansi/index.js"() {
        Be(), Un();
      } });
      function jn(o) {
        return Number.isInteger(o) ? o >= 4352 && (o <= 4447 || o === 9001 || o === 9002 || 11904 <= o && o <= 12871 && o !== 12351 || 12880 <= o && o <= 19903 || 19968 <= o && o <= 42182 || 43360 <= o && o <= 43388 || 44032 <= o && o <= 55203 || 63744 <= o && o <= 64255 || 65040 <= o && o <= 65049 || 65072 <= o && o <= 65131 || 65281 <= o && o <= 65376 || 65504 <= o && o <= 65510 || 110592 <= o && o <= 110593 || 127488 <= o && o <= 127569 || 131072 <= o && o <= 262141) : !1;
      }
      var bn = Wt({ "node_modules/is-fullwidth-code-point/index.js"() {
        Be();
      } }), kn = Ce({ "node_modules/emoji-regex/index.js"(o, m) {
        Be(), m.exports = function() {
          return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
        };
      } }), ns = {};
      ar(ns, { default: () => so });
      function so(o) {
        if (typeof o != "string" || o.length === 0 || (o = Su(o), o.length === 0))
          return 0;
        o = o.replace((0, is.default)(), "  ");
        let m = 0;
        for (let t = 0; t < o.length; t++) {
          let p = o.codePointAt(t);
          p <= 31 || p >= 127 && p <= 159 || p >= 768 && p <= 879 || (p > 65535 && t++, m += jn(p) ? 2 : 1);
        }
        return m;
      }
      var is, oo = Wt({ "node_modules/string-width/index.js"() {
        Be(), Tu(), bn(), is = jr(kn());
      } }), us = Ce({ "src/utils/get-string-width.js"(o, m) {
        Be();
        var t = (oo(), Nr(ns)).default, p = /[^\x20-\x7F]/;
        function c(e) {
          return e ? p.test(e) ? t(e) : e.length : 0;
        }
        m.exports = c;
      } }), $i = Ce({ "src/document/doc-utils.js"(o, m) {
        Be();
        var t = dn(), { literalline: p, join: c } = On(), e = (l) => Array.isArray(l) || l && l.type === "concat", i = (l) => {
          if (Array.isArray(l))
            return l;
          if (l.type !== "concat" && l.type !== "fill")
            throw new Error("Expect doc type to be `concat` or `fill`.");
          return l.parts;
        }, u = {};
        function h(l, A, w, I) {
          let O = [l];
          for (; O.length > 0; ) {
            let M = O.pop();
            if (M === u) {
              w(O.pop());
              continue;
            }
            if (w && O.push(M, u), !A || A(M) !== !1)
              if (e(M) || M.type === "fill") {
                let ee = i(M);
                for (let pe = ee.length, he = pe - 1; he >= 0; --he)
                  O.push(ee[he]);
              } else if (M.type === "if-break")
                M.flatContents && O.push(M.flatContents), M.breakContents && O.push(M.breakContents);
              else if (M.type === "group" && M.expandedStates)
                if (I)
                  for (let ee = M.expandedStates.length, pe = ee - 1; pe >= 0; --pe)
                    O.push(M.expandedStates[pe]);
                else
                  O.push(M.contents);
              else
                M.contents && O.push(M.contents);
          }
        }
        function D(l, A) {
          let w = /* @__PURE__ */ new Map();
          return I(l);
          function I(M) {
            if (w.has(M))
              return w.get(M);
            let ee = O(M);
            return w.set(M, ee), ee;
          }
          function O(M) {
            if (Array.isArray(M))
              return A(M.map(I));
            if (M.type === "concat" || M.type === "fill") {
              let ee = M.parts.map(I);
              return A(Object.assign(Object.assign({}, M), {}, { parts: ee }));
            }
            if (M.type === "if-break") {
              let ee = M.breakContents && I(M.breakContents), pe = M.flatContents && I(M.flatContents);
              return A(Object.assign(Object.assign({}, M), {}, { breakContents: ee, flatContents: pe }));
            }
            if (M.type === "group" && M.expandedStates) {
              let ee = M.expandedStates.map(I), pe = ee[0];
              return A(Object.assign(Object.assign({}, M), {}, { contents: pe, expandedStates: ee }));
            }
            if (M.contents) {
              let ee = I(M.contents);
              return A(Object.assign(Object.assign({}, M), {}, { contents: ee }));
            }
            return A(M);
          }
        }
        function E(l, A, w) {
          let I = w, O = !1;
          function M(ee) {
            let pe = A(ee);
            if (pe !== void 0 && (O = !0, I = pe), O)
              return !1;
          }
          return h(l, M), I;
        }
        function C(l) {
          if (l.type === "group" && l.break || l.type === "line" && l.hard || l.type === "break-parent")
            return !0;
        }
        function F(l) {
          return E(l, C, !1);
        }
        function g(l) {
          if (l.length > 0) {
            let A = t(l);
            !A.expandedStates && !A.break && (A.break = "propagated");
          }
          return null;
        }
        function b(l) {
          let A = /* @__PURE__ */ new Set(), w = [];
          function I(M) {
            if (M.type === "break-parent" && g(w), M.type === "group") {
              if (w.push(M), A.has(M))
                return !1;
              A.add(M);
            }
          }
          function O(M) {
            M.type === "group" && w.pop().break && g(w);
          }
          h(l, I, O, !0);
        }
        function T(l) {
          return l.type === "line" && !l.hard ? l.soft ? "" : " " : l.type === "if-break" ? l.flatContents || "" : l;
        }
        function G(l) {
          return D(l, T);
        }
        var W = (l, A) => l && l.type === "line" && l.hard && A && A.type === "break-parent";
        function B(l) {
          if (!l)
            return l;
          if (e(l) || l.type === "fill") {
            let A = i(l);
            for (; A.length > 1 && W(...A.slice(-2)); )
              A.length -= 2;
            if (A.length > 0) {
              let w = B(t(A));
              A[A.length - 1] = w;
            }
            return Array.isArray(l) ? A : Object.assign(Object.assign({}, l), {}, { parts: A });
          }
          switch (l.type) {
            case "align":
            case "indent":
            case "indent-if-break":
            case "group":
            case "line-suffix":
            case "label": {
              let A = B(l.contents);
              return Object.assign(Object.assign({}, l), {}, { contents: A });
            }
            case "if-break": {
              let A = B(l.breakContents), w = B(l.flatContents);
              return Object.assign(Object.assign({}, l), {}, { breakContents: A, flatContents: w });
            }
          }
          return l;
        }
        function _(l) {
          return B(Q(l));
        }
        function U(l) {
          switch (l.type) {
            case "fill":
              if (l.parts.every((w) => w === ""))
                return "";
              break;
            case "group":
              if (!l.contents && !l.id && !l.break && !l.expandedStates)
                return "";
              if (l.contents.type === "group" && l.contents.id === l.id && l.contents.break === l.break && l.contents.expandedStates === l.expandedStates)
                return l.contents;
              break;
            case "align":
            case "indent":
            case "indent-if-break":
            case "line-suffix":
              if (!l.contents)
                return "";
              break;
            case "if-break":
              if (!l.flatContents && !l.breakContents)
                return "";
              break;
          }
          if (!e(l))
            return l;
          let A = [];
          for (let w of i(l)) {
            if (!w)
              continue;
            let [I, ...O] = e(w) ? i(w) : [w];
            typeof I == "string" && typeof t(A) == "string" ? A[A.length - 1] += I : A.push(I), A.push(...O);
          }
          return A.length === 0 ? "" : A.length === 1 ? A[0] : Array.isArray(l) ? A : Object.assign(Object.assign({}, l), {}, { parts: A });
        }
        function Q(l) {
          return D(l, (A) => U(A));
        }
        function H(l) {
          let A = [], w = l.filter(Boolean);
          for (; w.length > 0; ) {
            let I = w.shift();
            if (I) {
              if (e(I)) {
                w.unshift(...i(I));
                continue;
              }
              if (A.length > 0 && typeof t(A) == "string" && typeof I == "string") {
                A[A.length - 1] += I;
                continue;
              }
              A.push(I);
            }
          }
          return A;
        }
        function ge(l) {
          return D(l, (A) => Array.isArray(A) ? H(A) : A.parts ? Object.assign(Object.assign({}, A), {}, { parts: H(A.parts) }) : A);
        }
        function y(l) {
          return D(l, (A) => typeof A == "string" && A.includes(`
`) ? R(A) : A);
        }
        function R(l) {
          let A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : p;
          return c(A, l.split(`
`)).parts;
        }
        function v(l) {
          if (l.type === "line")
            return !0;
        }
        function S(l) {
          return E(l, v, !1);
        }
        m.exports = { isConcat: e, getDocParts: i, willBreak: F, traverseDoc: h, findInDoc: E, mapDoc: D, propagateBreaks: b, removeLines: G, stripTrailingHardline: _, normalizeParts: H, normalizeDoc: ge, cleanDoc: Q, replaceTextEndOfLine: R, replaceEndOfLine: y, canBreak: S };
      } }), ao = Ce({ "src/document/doc-printer.js"(o, m) {
        Be();
        var { convertEndOfLineToChars: t } = hi(), p = dn(), c = us(), { fill: e, cursor: i, indent: u } = On(), { isConcat: h, getDocParts: D } = $i(), E, C = 1, F = 2;
        function g() {
          return { value: "", length: 0, queue: [] };
        }
        function b(U, Q) {
          return G(U, { type: "indent" }, Q);
        }
        function T(U, Q, H) {
          return Q === Number.NEGATIVE_INFINITY ? U.root || g() : Q < 0 ? G(U, { type: "dedent" }, H) : Q ? Q.type === "root" ? Object.assign(Object.assign({}, U), {}, { root: U }) : G(U, { type: typeof Q == "string" ? "stringAlign" : "numberAlign", n: Q }, H) : U;
        }
        function G(U, Q, H) {
          let ge = Q.type === "dedent" ? U.queue.slice(0, -1) : [...U.queue, Q], y = "", R = 0, v = 0, S = 0;
          for (let ee of ge)
            switch (ee.type) {
              case "indent":
                w(), H.useTabs ? l(1) : A(H.tabWidth);
                break;
              case "stringAlign":
                w(), y += ee.n, R += ee.n.length;
                break;
              case "numberAlign":
                v += 1, S += ee.n;
                break;
              default:
                throw new Error(`Unexpected type '${ee.type}'`);
            }
          return O(), Object.assign(Object.assign({}, U), {}, { value: y, length: R, queue: ge });
          function l(ee) {
            y += "	".repeat(ee), R += H.tabWidth * ee;
          }
          function A(ee) {
            y += " ".repeat(ee), R += ee;
          }
          function w() {
            H.useTabs ? I() : O();
          }
          function I() {
            v > 0 && l(v), M();
          }
          function O() {
            S > 0 && A(S), M();
          }
          function M() {
            v = 0, S = 0;
          }
        }
        function W(U) {
          if (U.length === 0)
            return 0;
          let Q = 0;
          for (; U.length > 0 && typeof p(U) == "string" && /^[\t ]*$/.test(p(U)); )
            Q += U.pop().length;
          if (U.length > 0 && typeof p(U) == "string") {
            let H = p(U).replace(/[\t ]*$/, "");
            Q += p(U).length - H.length, U[U.length - 1] = H;
          }
          return Q;
        }
        function B(U, Q, H, ge, y) {
          let R = Q.length, v = [U], S = [];
          for (; H >= 0; ) {
            if (v.length === 0) {
              if (R === 0)
                return !0;
              v.push(Q[--R]);
              continue;
            }
            let { mode: l, doc: A } = v.pop();
            if (typeof A == "string")
              S.push(A), H -= c(A);
            else if (h(A) || A.type === "fill") {
              let w = D(A);
              for (let I = w.length - 1; I >= 0; I--)
                v.push({ mode: l, doc: w[I] });
            } else
              switch (A.type) {
                case "indent":
                case "align":
                case "indent-if-break":
                case "label":
                  v.push({ mode: l, doc: A.contents });
                  break;
                case "trim":
                  H += W(S);
                  break;
                case "group": {
                  if (y && A.break)
                    return !1;
                  let w = A.break ? C : l, I = A.expandedStates && w === C ? p(A.expandedStates) : A.contents;
                  v.push({ mode: w, doc: I });
                  break;
                }
                case "if-break": {
                  let w = (A.groupId ? E[A.groupId] || F : l) === C ? A.breakContents : A.flatContents;
                  w && v.push({ mode: l, doc: w });
                  break;
                }
                case "line":
                  if (l === C || A.hard)
                    return !0;
                  A.soft || (S.push(" "), H--);
                  break;
                case "line-suffix":
                  ge = !0;
                  break;
                case "line-suffix-boundary":
                  if (ge)
                    return !1;
                  break;
              }
          }
          return !1;
        }
        function _(U, Q) {
          E = {};
          let H = Q.printWidth, ge = t(Q.endOfLine), y = 0, R = [{ ind: g(), mode: C, doc: U }], v = [], S = !1, l = [];
          for (; R.length > 0; ) {
            let { ind: w, mode: I, doc: O } = R.pop();
            if (typeof O == "string") {
              let M = ge !== `
` ? O.replace(/\n/g, ge) : O;
              v.push(M), y += c(M);
            } else if (h(O)) {
              let M = D(O);
              for (let ee = M.length - 1; ee >= 0; ee--)
                R.push({ ind: w, mode: I, doc: M[ee] });
            } else
              switch (O.type) {
                case "cursor":
                  v.push(i.placeholder);
                  break;
                case "indent":
                  R.push({ ind: b(w, Q), mode: I, doc: O.contents });
                  break;
                case "align":
                  R.push({ ind: T(w, O.n, Q), mode: I, doc: O.contents });
                  break;
                case "trim":
                  y -= W(v);
                  break;
                case "group":
                  switch (I) {
                    case F:
                      if (!S) {
                        R.push({ ind: w, mode: O.break ? C : F, doc: O.contents });
                        break;
                      }
                    case C: {
                      S = !1;
                      let M = { ind: w, mode: F, doc: O.contents }, ee = H - y, pe = l.length > 0;
                      if (!O.break && B(M, R, ee, pe))
                        R.push(M);
                      else if (O.expandedStates) {
                        let he = p(O.expandedStates);
                        if (O.break) {
                          R.push({ ind: w, mode: C, doc: he });
                          break;
                        } else
                          for (let ce = 1; ce < O.expandedStates.length + 1; ce++)
                            if (ce >= O.expandedStates.length) {
                              R.push({ ind: w, mode: C, doc: he });
                              break;
                            } else {
                              let xe = O.expandedStates[ce], ie = { ind: w, mode: F, doc: xe };
                              if (B(ie, R, ee, pe)) {
                                R.push(ie);
                                break;
                              }
                            }
                      } else
                        R.push({ ind: w, mode: C, doc: O.contents });
                      break;
                    }
                  }
                  O.id && (E[O.id] = p(R).mode);
                  break;
                case "fill": {
                  let M = H - y, { parts: ee } = O;
                  if (ee.length === 0)
                    break;
                  let [pe, he] = ee, ce = { ind: w, mode: F, doc: pe }, xe = { ind: w, mode: C, doc: pe }, ie = B(ce, [], M, l.length > 0, !0);
                  if (ee.length === 1) {
                    ie ? R.push(ce) : R.push(xe);
                    break;
                  }
                  let je = { ind: w, mode: F, doc: he }, de = { ind: w, mode: C, doc: he };
                  if (ee.length === 2) {
                    ie ? R.push(je, ce) : R.push(de, xe);
                    break;
                  }
                  ee.splice(0, 2);
                  let oe = { ind: w, mode: I, doc: e(ee) }, Ne = ee[0];
                  B({ ind: w, mode: F, doc: [pe, he, Ne] }, [], M, l.length > 0, !0) ? R.push(oe, je, ce) : ie ? R.push(oe, de, ce) : R.push(oe, de, xe);
                  break;
                }
                case "if-break":
                case "indent-if-break": {
                  let M = O.groupId ? E[O.groupId] : I;
                  if (M === C) {
                    let ee = O.type === "if-break" ? O.breakContents : O.negate ? O.contents : u(O.contents);
                    ee && R.push({ ind: w, mode: I, doc: ee });
                  }
                  if (M === F) {
                    let ee = O.type === "if-break" ? O.flatContents : O.negate ? u(O.contents) : O.contents;
                    ee && R.push({ ind: w, mode: I, doc: ee });
                  }
                  break;
                }
                case "line-suffix":
                  l.push({ ind: w, mode: I, doc: O.contents });
                  break;
                case "line-suffix-boundary":
                  l.length > 0 && R.push({ ind: w, mode: I, doc: { type: "line", hard: !0 } });
                  break;
                case "line":
                  switch (I) {
                    case F:
                      if (O.hard)
                        S = !0;
                      else {
                        O.soft || (v.push(" "), y += 1);
                        break;
                      }
                    case C:
                      if (l.length > 0) {
                        R.push({ ind: w, mode: I, doc: O }, ...l.reverse()), l.length = 0;
                        break;
                      }
                      O.literal ? w.root ? (v.push(ge, w.root.value), y = w.root.length) : (v.push(ge), y = 0) : (y -= W(v), v.push(ge + w.value), y = w.length);
                      break;
                  }
                  break;
                case "label":
                  R.push({ ind: w, mode: I, doc: O.contents });
                  break;
              }
            R.length === 0 && l.length > 0 && (R.push(...l.reverse()), l.length = 0);
          }
          let A = v.indexOf(i.placeholder);
          if (A !== -1) {
            let w = v.indexOf(i.placeholder, A + 1), I = v.slice(0, A).join(""), O = v.slice(A + 1, w).join(""), M = v.slice(w + 1).join("");
            return { formatted: I + O + M, cursorNodeStart: I.length, cursorNodeText: O };
          }
          return { formatted: v.join("") };
        }
        m.exports = { printDocToString: _ };
      } }), lo = Ce({ "src/document/doc-debug.js"(o, m) {
        Be();
        var { isConcat: t, getDocParts: p } = $i();
        function c(i) {
          if (!i)
            return "";
          if (t(i)) {
            let u = [];
            for (let h of p(i))
              if (t(h))
                u.push(...c(h).parts);
              else {
                let D = c(h);
                D !== "" && u.push(D);
              }
            return { type: "concat", parts: u };
          }
          return i.type === "if-break" ? Object.assign(Object.assign({}, i), {}, { breakContents: c(i.breakContents), flatContents: c(i.flatContents) }) : i.type === "group" ? Object.assign(Object.assign({}, i), {}, { contents: c(i.contents), expandedStates: i.expandedStates && i.expandedStates.map(c) }) : i.type === "fill" ? { type: "fill", parts: i.parts.map(c) } : i.contents ? Object.assign(Object.assign({}, i), {}, { contents: c(i.contents) }) : i;
        }
        function e(i) {
          let u = /* @__PURE__ */ Object.create(null), h = /* @__PURE__ */ new Set();
          return D(c(i));
          function D(C, F, g) {
            if (typeof C == "string")
              return JSON.stringify(C);
            if (t(C)) {
              let b = p(C).map(D).filter(Boolean);
              return b.length === 1 ? b[0] : `[${b.join(", ")}]`;
            }
            if (C.type === "line") {
              let b = Array.isArray(g) && g[F + 1] && g[F + 1].type === "break-parent";
              return C.literal ? b ? "literalline" : "literallineWithoutBreakParent" : C.hard ? b ? "hardline" : "hardlineWithoutBreakParent" : C.soft ? "softline" : "line";
            }
            if (C.type === "break-parent")
              return Array.isArray(g) && g[F - 1] && g[F - 1].type === "line" && g[F - 1].hard ? void 0 : "breakParent";
            if (C.type === "trim")
              return "trim";
            if (C.type === "indent")
              return "indent(" + D(C.contents) + ")";
            if (C.type === "align")
              return C.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + D(C.contents) + ")" : C.n < 0 ? "dedent(" + D(C.contents) + ")" : C.n.type === "root" ? "markAsRoot(" + D(C.contents) + ")" : "align(" + JSON.stringify(C.n) + ", " + D(C.contents) + ")";
            if (C.type === "if-break")
              return "ifBreak(" + D(C.breakContents) + (C.flatContents ? ", " + D(C.flatContents) : "") + (C.groupId ? (C.flatContents ? "" : ', ""') + `, { groupId: ${E(C.groupId)} }` : "") + ")";
            if (C.type === "indent-if-break") {
              let b = [];
              C.negate && b.push("negate: true"), C.groupId && b.push(`groupId: ${E(C.groupId)}`);
              let T = b.length > 0 ? `, { ${b.join(", ")} }` : "";
              return `indentIfBreak(${D(C.contents)}${T})`;
            }
            if (C.type === "group") {
              let b = [];
              C.break && C.break !== "propagated" && b.push("shouldBreak: true"), C.id && b.push(`id: ${E(C.id)}`);
              let T = b.length > 0 ? `, { ${b.join(", ")} }` : "";
              return C.expandedStates ? `conditionalGroup([${C.expandedStates.map((G) => D(G)).join(",")}]${T})` : `group(${D(C.contents)}${T})`;
            }
            if (C.type === "fill")
              return `fill([${C.parts.map((b) => D(b)).join(", ")}])`;
            if (C.type === "line-suffix")
              return "lineSuffix(" + D(C.contents) + ")";
            if (C.type === "line-suffix-boundary")
              return "lineSuffixBoundary";
            if (C.type === "label")
              return `label(${JSON.stringify(C.label)}, ${D(C.contents)})`;
            throw new Error("Unknown doc type " + C.type);
          }
          function E(C) {
            if (typeof C != "symbol")
              return JSON.stringify(String(C));
            if (C in u)
              return u[C];
            let F = String(C).slice(7, -1) || "symbol";
            for (let g = 0; ; g++) {
              let b = F + (g > 0 ? ` #${g}` : "");
              if (!h.has(b))
                return h.add(b), u[C] = `Symbol.for(${JSON.stringify(b)})`;
            }
          }
        }
        m.exports = { printDocToDebug: e };
      } }), sr = Ce({ "src/document/index.js"(o, m) {
        Be(), m.exports = { builders: On(), printer: ao(), utils: $i(), debug: lo() };
      } }), ss = {};
      ar(ss, { default: () => co });
      function co(o) {
        if (typeof o != "string")
          throw new TypeError("Expected a string");
        return o.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
      }
      var po = Wt({ "node_modules/escape-string-regexp/index.js"() {
        Be();
      } }), os = Ce({ "node_modules/semver/internal/debug.js"(o, m) {
        Be();
        var t = typeof Kr == "object" && Kr.env && Kr.env.NODE_DEBUG && /\bsemver\b/i.test(Kr.env.NODE_DEBUG) ? function() {
          for (var p = arguments.length, c = new Array(p), e = 0; e < p; e++)
            c[e] = arguments[e];
          return console.error("SEMVER", ...c);
        } : () => {
        };
        m.exports = t;
      } }), as = Ce({ "node_modules/semver/internal/constants.js"(o, m) {
        Be();
        var t = "2.0.0", p = 256, c = Number.MAX_SAFE_INTEGER || 9007199254740991, e = 16;
        m.exports = { SEMVER_SPEC_VERSION: t, MAX_LENGTH: p, MAX_SAFE_INTEGER: c, MAX_SAFE_COMPONENT_LENGTH: e };
      } }), fo = Ce({ "node_modules/semver/internal/re.js"(o, m) {
        Be();
        var { MAX_SAFE_COMPONENT_LENGTH: t } = as(), p = os();
        o = m.exports = {};
        var c = o.re = [], e = o.src = [], i = o.t = {}, u = 0, h = (D, E, C) => {
          let F = u++;
          p(D, F, E), i[D] = F, e[F] = E, c[F] = new RegExp(E, C ? "g" : void 0);
        };
        h("NUMERICIDENTIFIER", "0|[1-9]\\d*"), h("NUMERICIDENTIFIERLOOSE", "[0-9]+"), h("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*"), h("MAINVERSION", `(${e[i.NUMERICIDENTIFIER]})\\.(${e[i.NUMERICIDENTIFIER]})\\.(${e[i.NUMERICIDENTIFIER]})`), h("MAINVERSIONLOOSE", `(${e[i.NUMERICIDENTIFIERLOOSE]})\\.(${e[i.NUMERICIDENTIFIERLOOSE]})\\.(${e[i.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASEIDENTIFIER", `(?:${e[i.NUMERICIDENTIFIER]}|${e[i.NONNUMERICIDENTIFIER]})`), h("PRERELEASEIDENTIFIERLOOSE", `(?:${e[i.NUMERICIDENTIFIERLOOSE]}|${e[i.NONNUMERICIDENTIFIER]})`), h("PRERELEASE", `(?:-(${e[i.PRERELEASEIDENTIFIER]}(?:\\.${e[i.PRERELEASEIDENTIFIER]})*))`), h("PRERELEASELOOSE", `(?:-?(${e[i.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${e[i.PRERELEASEIDENTIFIERLOOSE]})*))`), h("BUILDIDENTIFIER", "[0-9A-Za-z-]+"), h("BUILD", `(?:\\+(${e[i.BUILDIDENTIFIER]}(?:\\.${e[i.BUILDIDENTIFIER]})*))`), h("FULLPLAIN", `v?${e[i.MAINVERSION]}${e[i.PRERELEASE]}?${e[i.BUILD]}?`), h("FULL", `^${e[i.FULLPLAIN]}$`), h("LOOSEPLAIN", `[v=\\s]*${e[i.MAINVERSIONLOOSE]}${e[i.PRERELEASELOOSE]}?${e[i.BUILD]}?`), h("LOOSE", `^${e[i.LOOSEPLAIN]}$`), h("GTLT", "((?:<|>)?=?)"), h("XRANGEIDENTIFIERLOOSE", `${e[i.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), h("XRANGEIDENTIFIER", `${e[i.NUMERICIDENTIFIER]}|x|X|\\*`), h("XRANGEPLAIN", `[v=\\s]*(${e[i.XRANGEIDENTIFIER]})(?:\\.(${e[i.XRANGEIDENTIFIER]})(?:\\.(${e[i.XRANGEIDENTIFIER]})(?:${e[i.PRERELEASE]})?${e[i.BUILD]}?)?)?`), h("XRANGEPLAINLOOSE", `[v=\\s]*(${e[i.XRANGEIDENTIFIERLOOSE]})(?:\\.(${e[i.XRANGEIDENTIFIERLOOSE]})(?:\\.(${e[i.XRANGEIDENTIFIERLOOSE]})(?:${e[i.PRERELEASELOOSE]})?${e[i.BUILD]}?)?)?`), h("XRANGE", `^${e[i.GTLT]}\\s*${e[i.XRANGEPLAIN]}$`), h("XRANGELOOSE", `^${e[i.GTLT]}\\s*${e[i.XRANGEPLAINLOOSE]}$`), h("COERCE", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?(?:$|[^\\d])`), h("COERCERTL", e[i.COERCE], !0), h("LONETILDE", "(?:~>?)"), h("TILDETRIM", `(\\s*)${e[i.LONETILDE]}\\s+`, !0), o.tildeTrimReplace = "$1~", h("TILDE", `^${e[i.LONETILDE]}${e[i.XRANGEPLAIN]}$`), h("TILDELOOSE", `^${e[i.LONETILDE]}${e[i.XRANGEPLAINLOOSE]}$`), h("LONECARET", "(?:\\^)"), h("CARETTRIM", `(\\s*)${e[i.LONECARET]}\\s+`, !0), o.caretTrimReplace = "$1^", h("CARET", `^${e[i.LONECARET]}${e[i.XRANGEPLAIN]}$`), h("CARETLOOSE", `^${e[i.LONECARET]}${e[i.XRANGEPLAINLOOSE]}$`), h("COMPARATORLOOSE", `^${e[i.GTLT]}\\s*(${e[i.LOOSEPLAIN]})$|^$`), h("COMPARATOR", `^${e[i.GTLT]}\\s*(${e[i.FULLPLAIN]})$|^$`), h("COMPARATORTRIM", `(\\s*)${e[i.GTLT]}\\s*(${e[i.LOOSEPLAIN]}|${e[i.XRANGEPLAIN]})`, !0), o.comparatorTrimReplace = "$1$2$3", h("HYPHENRANGE", `^\\s*(${e[i.XRANGEPLAIN]})\\s+-\\s+(${e[i.XRANGEPLAIN]})\\s*$`), h("HYPHENRANGELOOSE", `^\\s*(${e[i.XRANGEPLAINLOOSE]})\\s+-\\s+(${e[i.XRANGEPLAINLOOSE]})\\s*$`), h("STAR", "(<|>)?=?\\s*\\*"), h("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), h("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
      } }), ua = Ce({ "node_modules/semver/internal/parse-options.js"(o, m) {
        Be();
        var t = ["includePrerelease", "loose", "rtl"], p = (c) => c ? typeof c != "object" ? { loose: !0 } : t.filter((e) => c[e]).reduce((e, i) => (e[i] = !0, e), {}) : {};
        m.exports = p;
      } }), sa = Ce({ "node_modules/semver/internal/identifiers.js"(o, m) {
        Be();
        var t = /^[0-9]+$/, p = (e, i) => {
          let u = t.test(e), h = t.test(i);
          return u && h && (e = +e, i = +i), e === i ? 0 : u && !h ? -1 : h && !u ? 1 : e < i ? -1 : 1;
        }, c = (e, i) => p(i, e);
        m.exports = { compareIdentifiers: p, rcompareIdentifiers: c };
      } }), ho = Ce({ "node_modules/semver/classes/semver.js"(o, m) {
        Be();
        var t = os(), { MAX_LENGTH: p, MAX_SAFE_INTEGER: c } = as(), { re: e, t: i } = fo(), u = ua(), { compareIdentifiers: h } = sa(), D = class {
          constructor(E, C) {
            if (C = u(C), E instanceof D) {
              if (E.loose === !!C.loose && E.includePrerelease === !!C.includePrerelease)
                return E;
              E = E.version;
            } else if (typeof E != "string")
              throw new TypeError(`Invalid Version: ${E}`);
            if (E.length > p)
              throw new TypeError(`version is longer than ${p} characters`);
            t("SemVer", E, C), this.options = C, this.loose = !!C.loose, this.includePrerelease = !!C.includePrerelease;
            let F = E.trim().match(C.loose ? e[i.LOOSE] : e[i.FULL]);
            if (!F)
              throw new TypeError(`Invalid Version: ${E}`);
            if (this.raw = E, this.major = +F[1], this.minor = +F[2], this.patch = +F[3], this.major > c || this.major < 0)
              throw new TypeError("Invalid major version");
            if (this.minor > c || this.minor < 0)
              throw new TypeError("Invalid minor version");
            if (this.patch > c || this.patch < 0)
              throw new TypeError("Invalid patch version");
            F[4] ? this.prerelease = F[4].split(".").map((g) => {
              if (/^[0-9]+$/.test(g)) {
                let b = +g;
                if (b >= 0 && b < c)
                  return b;
              }
              return g;
            }) : this.prerelease = [], this.build = F[5] ? F[5].split(".") : [], this.format();
          }
          format() {
            return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
          }
          toString() {
            return this.version;
          }
          compare(E) {
            if (t("SemVer.compare", this.version, this.options, E), !(E instanceof D)) {
              if (typeof E == "string" && E === this.version)
                return 0;
              E = new D(E, this.options);
            }
            return E.version === this.version ? 0 : this.compareMain(E) || this.comparePre(E);
          }
          compareMain(E) {
            return E instanceof D || (E = new D(E, this.options)), h(this.major, E.major) || h(this.minor, E.minor) || h(this.patch, E.patch);
          }
          comparePre(E) {
            if (E instanceof D || (E = new D(E, this.options)), this.prerelease.length && !E.prerelease.length)
              return -1;
            if (!this.prerelease.length && E.prerelease.length)
              return 1;
            if (!this.prerelease.length && !E.prerelease.length)
              return 0;
            let C = 0;
            do {
              let F = this.prerelease[C], g = E.prerelease[C];
              if (t("prerelease compare", C, F, g), F === void 0 && g === void 0)
                return 0;
              if (g === void 0)
                return 1;
              if (F === void 0)
                return -1;
              if (F !== g)
                return h(F, g);
            } while (++C);
          }
          compareBuild(E) {
            E instanceof D || (E = new D(E, this.options));
            let C = 0;
            do {
              let F = this.build[C], g = E.build[C];
              if (t("prerelease compare", C, F, g), F === void 0 && g === void 0)
                return 0;
              if (g === void 0)
                return 1;
              if (F === void 0)
                return -1;
              if (F !== g)
                return h(F, g);
            } while (++C);
          }
          inc(E, C) {
            switch (E) {
              case "premajor":
                this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", C);
                break;
              case "preminor":
                this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", C);
                break;
              case "prepatch":
                this.prerelease.length = 0, this.inc("patch", C), this.inc("pre", C);
                break;
              case "prerelease":
                this.prerelease.length === 0 && this.inc("patch", C), this.inc("pre", C);
                break;
              case "major":
                (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
                break;
              case "minor":
                (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
                break;
              case "patch":
                this.prerelease.length === 0 && this.patch++, this.prerelease = [];
                break;
              case "pre":
                if (this.prerelease.length === 0)
                  this.prerelease = [0];
                else {
                  let F = this.prerelease.length;
                  for (; --F >= 0; )
                    typeof this.prerelease[F] == "number" && (this.prerelease[F]++, F = -2);
                  F === -1 && this.prerelease.push(0);
                }
                C && (h(this.prerelease[0], C) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = [C, 0]) : this.prerelease = [C, 0]);
                break;
              default:
                throw new Error(`invalid increment argument: ${E}`);
            }
            return this.format(), this.raw = this.version, this;
          }
        };
        m.exports = D;
      } }), ls = Ce({ "node_modules/semver/functions/compare.js"(o, m) {
        Be();
        var t = ho(), p = (c, e, i) => new t(c, i).compare(new t(e, i));
        m.exports = p;
      } }), mo = Ce({ "node_modules/semver/functions/lt.js"(o, m) {
        Be();
        var t = ls(), p = (c, e, i) => t(c, e, i) < 0;
        m.exports = p;
      } }), wi = Ce({ "node_modules/semver/functions/gte.js"(o, m) {
        Be();
        var t = ls(), p = (c, e, i) => t(c, e, i) >= 0;
        m.exports = p;
      } }), oa = Ce({ "src/utils/arrayify.js"(o, m) {
        Be(), m.exports = (t, p) => Object.entries(t).map((c) => {
          let [e, i] = c;
          return Object.assign({ [p]: e }, i);
        });
      } }), aa = Ce({ "node_modules/outdent/lib/index.js"(o, m) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.outdent = void 0;
        function t() {
          for (var B = [], _ = 0; _ < arguments.length; _++)
            B[_] = arguments[_];
        }
        function p() {
          return typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : c();
        }
        function c() {
          return { add: t, delete: t, get: t, set: t, has: function(B) {
            return !1;
          } };
        }
        var e = Object.prototype.hasOwnProperty, i = function(B, _) {
          return e.call(B, _);
        };
        function u(B, _) {
          for (var U in _)
            i(_, U) && (B[U] = _[U]);
          return B;
        }
        var h = /^[ \t]*(?:\r\n|\r|\n)/, D = /(?:\r\n|\r|\n)[ \t]*$/, E = /^(?:[\r\n]|$)/, C = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/, F = /^[ \t]*[\r\n][ \t\r\n]*$/;
        function g(B, _, U) {
          var Q = 0, H = B[0].match(C);
          H && (Q = H[1].length);
          var ge = "(\\r\\n|\\r|\\n).{0," + Q + "}", y = new RegExp(ge, "g");
          _ && (B = B.slice(1));
          var R = U.newline, v = U.trimLeadingNewline, S = U.trimTrailingNewline, l = typeof R == "string", A = B.length, w = B.map(function(I, O) {
            return I = I.replace(y, "$1"), O === 0 && v && (I = I.replace(h, "")), O === A - 1 && S && (I = I.replace(D, "")), l && (I = I.replace(/\r\n|\n|\r/g, function(M) {
              return R;
            })), I;
          });
          return w;
        }
        function b(B, _) {
          for (var U = "", Q = 0, H = B.length; Q < H; Q++)
            U += B[Q], Q < H - 1 && (U += _[Q]);
          return U;
        }
        function T(B) {
          return i(B, "raw") && i(B, "length");
        }
        function G(B) {
          var _ = p(), U = p();
          function Q(ge) {
            for (var y = [], R = 1; R < arguments.length; R++)
              y[R - 1] = arguments[R];
            if (T(ge)) {
              var v = ge, S = (y[0] === Q || y[0] === W) && F.test(v[0]) && E.test(v[1]), l = S ? U : _, A = l.get(v);
              if (A || (A = g(v, S, B), l.set(v, A)), y.length === 0)
                return A[0];
              var w = b(A, S ? y.slice(1) : y);
              return w;
            } else
              return G(u(u({}, B), ge || {}));
          }
          var H = u(Q, { string: function(ge) {
            return g([ge], !1, B)[0];
          } });
          return H;
        }
        var W = G({ trimLeadingNewline: !0, trimTrailingNewline: !0 });
        if (o.outdent = W, o.default = W, typeof m < "u")
          try {
            m.exports = W, Object.defineProperty(W, "__esModule", { value: !0 }), W.default = W, W.outdent = W;
          } catch {
          }
      } }), la = Ce({ "src/main/core-options.js"(o, m) {
        Be();
        var { outdent: t } = aa(), p = "Config", c = "Editor", e = "Format", i = "Other", u = "Output", h = "Global", D = "Special", E = { cursorOffset: { since: "1.4.0", category: D, type: "int", default: -1, range: { start: -1, end: Number.POSITIVE_INFINITY, step: 1 }, description: t`
      Print (to stderr) where a cursor at the given position would move to after formatting.
      This option cannot be used with --range-start and --range-end.
    `, cliCategory: c }, endOfLine: { since: "1.15.0", category: h, type: "choice", default: [{ since: "1.15.0", value: "auto" }, { since: "2.0.0", value: "lf" }], description: "Which end of line characters to apply.", choices: [{ value: "lf", description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos" }, { value: "crlf", description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows" }, { value: "cr", description: "Carriage Return character only (\\r), used very rarely" }, { value: "auto", description: t`
          Maintain existing
          (mixed values within one file are normalised by looking at what's used after the first line)
        ` }] }, filepath: { since: "1.4.0", category: D, type: "path", description: "Specify the input filepath. This will be used to do parser inference.", cliName: "stdin-filepath", cliCategory: i, cliDescription: "Path to the file to pretend that stdin comes from." }, insertPragma: { since: "1.8.0", category: D, type: "boolean", default: !1, description: "Insert @format pragma into file's first docblock comment.", cliCategory: i }, parser: { since: "0.0.10", category: h, type: "choice", default: [{ since: "0.0.10", value: "babylon" }, { since: "1.13.0", value: void 0 }], description: "Which parser to use.", exception: (C) => typeof C == "string" || typeof C == "function", choices: [{ value: "flow", description: "Flow" }, { value: "babel", since: "1.16.0", description: "JavaScript" }, { value: "babel-flow", since: "1.16.0", description: "Flow" }, { value: "babel-ts", since: "2.0.0", description: "TypeScript" }, { value: "typescript", since: "1.4.0", description: "TypeScript" }, { value: "acorn", since: "2.6.0", description: "JavaScript" }, { value: "espree", since: "2.2.0", description: "JavaScript" }, { value: "meriyah", since: "2.2.0", description: "JavaScript" }, { value: "css", since: "1.7.1", description: "CSS" }, { value: "less", since: "1.7.1", description: "Less" }, { value: "scss", since: "1.7.1", description: "SCSS" }, { value: "json", since: "1.5.0", description: "JSON" }, { value: "json5", since: "1.13.0", description: "JSON5" }, { value: "json-stringify", since: "1.13.0", description: "JSON.stringify" }, { value: "graphql", since: "1.5.0", description: "GraphQL" }, { value: "markdown", since: "1.8.0", description: "Markdown" }, { value: "mdx", since: "1.15.0", description: "MDX" }, { value: "vue", since: "1.10.0", description: "Vue" }, { value: "yaml", since: "1.14.0", description: "YAML" }, { value: "glimmer", since: "2.3.0", description: "Ember / Handlebars" }, { value: "html", since: "1.15.0", description: "HTML" }, { value: "angular", since: "1.15.0", description: "Angular" }, { value: "lwc", since: "1.17.0", description: "Lightning Web Components" }] }, plugins: { since: "1.10.0", type: "path", array: !0, default: [{ value: [] }], category: h, description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.", exception: (C) => typeof C == "string" || typeof C == "object", cliName: "plugin", cliCategory: p }, pluginSearchDirs: { since: "1.13.0", type: "path", array: !0, default: [{ value: [] }], category: h, description: t`
      Custom directory that contains prettier plugins in node_modules subdirectory.
      Overrides default behavior when plugins are searched relatively to the location of Prettier.
      Multiple values are accepted.
    `, exception: (C) => typeof C == "string" || typeof C == "object", cliName: "plugin-search-dir", cliCategory: p }, printWidth: { since: "0.0.0", category: h, type: "int", default: 80, description: "The line length where Prettier will try wrap.", range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 } }, rangeEnd: { since: "1.4.0", category: D, type: "int", default: Number.POSITIVE_INFINITY, range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 }, description: t`
      Format code ending at a given character offset (exclusive).
      The range will extend forwards to the end of the selected statement.
      This option cannot be used with --cursor-offset.
    `, cliCategory: c }, rangeStart: { since: "1.4.0", category: D, type: "int", default: 0, range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 }, description: t`
      Format code starting at a given character offset.
      The range will extend backwards to the start of the first line containing the selected statement.
      This option cannot be used with --cursor-offset.
    `, cliCategory: c }, requirePragma: { since: "1.7.0", category: D, type: "boolean", default: !1, description: t`
      Require either '@prettier' or '@format' to be present in the file's first docblock comment
      in order for it to be formatted.
    `, cliCategory: i }, tabWidth: { type: "int", category: h, default: 2, description: "Number of spaces per indentation level.", range: { start: 0, end: Number.POSITIVE_INFINITY, step: 1 } }, useTabs: { since: "1.0.0", category: h, type: "boolean", default: !1, description: "Indent with tabs instead of spaces." }, embeddedLanguageFormatting: { since: "2.1.0", category: h, type: "choice", default: [{ since: "2.1.0", value: "auto" }], description: "Control how Prettier formats quoted code embedded in the file.", choices: [{ value: "auto", description: "Format embedded code if Prettier can automatically identify it." }, { value: "off", description: "Never automatically format embedded code." }] } };
        m.exports = { CATEGORY_CONFIG: p, CATEGORY_EDITOR: c, CATEGORY_FORMAT: e, CATEGORY_OTHER: i, CATEGORY_OUTPUT: u, CATEGORY_GLOBAL: h, CATEGORY_SPECIAL: D, options: E };
      } }), cs = Ce({ "src/main/support.js"(o, m) {
        Be();
        var t = { compare: ls(), lt: mo(), gte: wi() }, p = oa(), c = vn().version, e = la().options;
        function i() {
          let { plugins: h = [], showUnreleased: D = !1, showDeprecated: E = !1, showInternal: C = !1 } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, F = c.split("-", 1)[0], g = h.flatMap((B) => B.languages || []).filter(T), b = p(Object.assign({}, ...h.map((B) => {
            let { options: _ } = B;
            return _;
          }), e), "name").filter((B) => T(B) && G(B)).sort((B, _) => B.name === _.name ? 0 : B.name < _.name ? -1 : 1).map(W).map((B) => {
            B = Object.assign({}, B), Array.isArray(B.default) && (B.default = B.default.length === 1 ? B.default[0].value : B.default.filter(T).sort((U, Q) => t.compare(Q.since, U.since))[0].value), Array.isArray(B.choices) && (B.choices = B.choices.filter((U) => T(U) && G(U)), B.name === "parser" && u(B, g, h));
            let _ = Object.fromEntries(h.filter((U) => U.defaultOptions && U.defaultOptions[B.name] !== void 0).map((U) => [U.name, U.defaultOptions[B.name]]));
            return Object.assign(Object.assign({}, B), {}, { pluginDefaults: _ });
          });
          return { languages: g, options: b };
          function T(B) {
            return D || !("since" in B) || B.since && t.gte(F, B.since);
          }
          function G(B) {
            return E || !("deprecated" in B) || B.deprecated && t.lt(F, B.deprecated);
          }
          function W(B) {
            return C ? B : at(B, $e);
          }
        }
        function u(h, D, E) {
          let C = new Set(h.choices.map((F) => F.value));
          for (let F of D)
            if (F.parsers) {
              for (let g of F.parsers)
                if (!C.has(g)) {
                  C.add(g);
                  let b = E.find((G) => G.parsers && G.parsers[g]), T = F.name;
                  b && b.name && (T += ` (plugin: ${b.name})`), h.choices.push({ value: g, description: T });
                }
            }
        }
        m.exports = { getSupportInfo: i };
      } }), ps = Ce({ "src/utils/is-non-empty-array.js"(o, m) {
        Be();
        function t(p) {
          return Array.isArray(p) && p.length > 0;
        }
        m.exports = t;
      } }), ku = Ce({ "src/utils/text/skip.js"(o, m) {
        Be();
        function t(u) {
          return (h, D, E) => {
            let C = E && E.backwards;
            if (D === !1)
              return !1;
            let { length: F } = h, g = D;
            for (; g >= 0 && g < F; ) {
              let b = h.charAt(g);
              if (u instanceof RegExp) {
                if (!u.test(b))
                  return g;
              } else if (!u.includes(b))
                return g;
              C ? g-- : g++;
            }
            return g === -1 || g === F ? g : !1;
          };
        }
        var p = t(/\s/), c = t(" 	"), e = t(",; 	"), i = t(/[^\n\r]/);
        m.exports = { skipWhitespace: p, skipSpaces: c, skipToLineEnd: e, skipEverythingButNewLine: i };
      } }), ti = Ce({ "src/utils/text/skip-inline-comment.js"(o, m) {
        Be();
        function t(p, c) {
          if (c === !1)
            return !1;
          if (p.charAt(c) === "/" && p.charAt(c + 1) === "*") {
            for (let e = c + 2; e < p.length; ++e)
              if (p.charAt(e) === "*" && p.charAt(e + 1) === "/")
                return e + 2;
          }
          return c;
        }
        m.exports = t;
      } }), ri = Ce({ "src/utils/text/skip-trailing-comment.js"(o, m) {
        Be();
        var { skipEverythingButNewLine: t } = ku();
        function p(c, e) {
          return e === !1 ? !1 : c.charAt(e) === "/" && c.charAt(e + 1) === "/" ? t(c, e) : e;
        }
        m.exports = p;
      } }), Gn = Ce({ "src/utils/text/skip-newline.js"(o, m) {
        Be();
        function t(p, c, e) {
          let i = e && e.backwards;
          if (c === !1)
            return !1;
          let u = p.charAt(c);
          if (i) {
            if (p.charAt(c - 1) === "\r" && u === `
`)
              return c - 2;
            if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029")
              return c - 1;
          } else {
            if (u === "\r" && p.charAt(c + 1) === `
`)
              return c + 2;
            if (u === `
` || u === "\r" || u === "\u2028" || u === "\u2029")
              return c + 1;
          }
          return c;
        }
        m.exports = t;
      } }), Si = Ce({ "src/utils/text/get-next-non-space-non-comment-character-index-with-start-index.js"(o, m) {
        Be();
        var t = ti(), p = Gn(), c = ri(), { skipSpaces: e } = ku();
        function i(u, h) {
          let D = null, E = h;
          for (; E !== D; )
            D = E, E = e(u, E), E = t(u, E), E = c(u, E), E = p(u, E);
          return E;
        }
        m.exports = i;
      } }), yr = Ce({ "src/common/util.js"(o, m) {
        Be();
        var { default: t } = (po(), Nr(ss)), p = dn(), { getSupportInfo: c } = cs(), e = ps(), i = us(), { skipWhitespace: u, skipSpaces: h, skipToLineEnd: D, skipEverythingButNewLine: E } = ku(), C = ti(), F = ri(), g = Gn(), b = Si(), T = (de) => de[de.length - 2];
        function G(de) {
          return (oe, Ne, Je) => {
            let _e = Je && Je.backwards;
            if (Ne === !1)
              return !1;
            let { length: it } = oe, me = Ne;
            for (; me >= 0 && me < it; ) {
              let Se = oe.charAt(me);
              if (de instanceof RegExp) {
                if (!de.test(Se))
                  return me;
              } else if (!de.includes(Se))
                return me;
              _e ? me-- : me++;
            }
            return me === -1 || me === it ? me : !1;
          };
        }
        function W(de, oe) {
          let Ne = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, Je = h(de, Ne.backwards ? oe - 1 : oe, Ne), _e = g(de, Je, Ne);
          return Je !== _e;
        }
        function B(de, oe, Ne) {
          for (let Je = oe; Je < Ne; ++Je)
            if (de.charAt(Je) === `
`)
              return !0;
          return !1;
        }
        function _(de, oe, Ne) {
          let Je = Ne(oe) - 1;
          Je = h(de, Je, { backwards: !0 }), Je = g(de, Je, { backwards: !0 }), Je = h(de, Je, { backwards: !0 });
          let _e = g(de, Je, { backwards: !0 });
          return Je !== _e;
        }
        function U(de, oe) {
          let Ne = null, Je = oe;
          for (; Je !== Ne; )
            Ne = Je, Je = D(de, Je), Je = C(de, Je), Je = h(de, Je);
          return Je = F(de, Je), Je = g(de, Je), Je !== !1 && W(de, Je);
        }
        function Q(de, oe, Ne) {
          return U(de, Ne(oe));
        }
        function H(de, oe, Ne) {
          return b(de, Ne(oe));
        }
        function ge(de, oe, Ne) {
          return de.charAt(H(de, oe, Ne));
        }
        function y(de, oe) {
          let Ne = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return h(de, Ne.backwards ? oe - 1 : oe, Ne) !== oe;
        }
        function R(de, oe) {
          let Ne = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, Je = 0;
          for (let _e = Ne; _e < de.length; ++_e)
            de[_e] === "	" ? Je = Je + oe - Je % oe : Je++;
          return Je;
        }
        function v(de, oe) {
          let Ne = de.lastIndexOf(`
`);
          return Ne === -1 ? 0 : R(de.slice(Ne + 1).match(/^[\t ]*/)[0], oe);
        }
        function S(de, oe) {
          let Ne = { quote: '"', regex: /"/g, escaped: "&quot;" }, Je = { quote: "'", regex: /'/g, escaped: "&apos;" }, _e = oe === "'" ? Je : Ne, it = _e === Je ? Ne : Je, me = _e;
          if (de.includes(_e.quote) || de.includes(it.quote)) {
            let Se = (de.match(_e.regex) || []).length, Qe = (de.match(it.regex) || []).length;
            me = Se > Qe ? it : _e;
          }
          return me;
        }
        function l(de, oe) {
          let Ne = de.slice(1, -1), Je = oe.parser === "json" || oe.parser === "json5" && oe.quoteProps === "preserve" && !oe.singleQuote ? '"' : oe.__isInHtmlAttribute ? "'" : S(Ne, oe.singleQuote ? "'" : '"').quote;
          return A(Ne, Je, !(oe.parser === "css" || oe.parser === "less" || oe.parser === "scss" || oe.__embeddedInHtml));
        }
        function A(de, oe, Ne) {
          let Je = oe === '"' ? "'" : '"', _e = /\\(.)|(["'])/gs, it = de.replace(_e, (me, Se, Qe) => Se === Je ? Se : Qe === oe ? "\\" + Qe : Qe || (Ne && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(Se) ? Se : "\\" + Se));
          return oe + it + oe;
        }
        function w(de) {
          return de.toLowerCase().replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(\d)/, "$1$2$3").replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1").replace(/^([+-])?\./, "$10.").replace(/(\.\d+?)0+(?=e|$)/, "$1").replace(/\.(?=e|$)/, "");
        }
        function I(de, oe) {
          let Ne = de.match(new RegExp(`(${t(oe)})+`, "g"));
          return Ne === null ? 0 : Ne.reduce((Je, _e) => Math.max(Je, _e.length / oe.length), 0);
        }
        function O(de, oe) {
          let Ne = de.match(new RegExp(`(${t(oe)})+`, "g"));
          if (Ne === null)
            return 0;
          let Je = /* @__PURE__ */ new Map(), _e = 0;
          for (let it of Ne) {
            let me = it.length / oe.length;
            Je.set(me, !0), me > _e && (_e = me);
          }
          for (let it = 1; it < _e; it++)
            if (!Je.get(it))
              return it;
          return _e + 1;
        }
        function M(de, oe) {
          (de.comments || (de.comments = [])).push(oe), oe.printed = !1, oe.nodeDescription = je(de);
        }
        function ee(de, oe) {
          oe.leading = !0, oe.trailing = !1, M(de, oe);
        }
        function pe(de, oe, Ne) {
          oe.leading = !1, oe.trailing = !1, Ne && (oe.marker = Ne), M(de, oe);
        }
        function he(de, oe) {
          oe.leading = !1, oe.trailing = !0, M(de, oe);
        }
        function ce(de, oe) {
          let { languages: Ne } = c({ plugins: oe.plugins }), Je = Ne.find((_e) => {
            let { name: it } = _e;
            return it.toLowerCase() === de;
          }) || Ne.find((_e) => {
            let { aliases: it } = _e;
            return Array.isArray(it) && it.includes(de);
          }) || Ne.find((_e) => {
            let { extensions: it } = _e;
            return Array.isArray(it) && it.includes(`.${de}`);
          });
          return Je && Je.parsers[0];
        }
        function xe(de) {
          return de && de.type === "front-matter";
        }
        function ie(de) {
          let oe = /* @__PURE__ */ new WeakMap();
          return function(Ne) {
            return oe.has(Ne) || oe.set(Ne, Symbol(de)), oe.get(Ne);
          };
        }
        function je(de) {
          let oe = de.type || de.kind || "(unknown type)", Ne = String(de.name || de.id && (typeof de.id == "object" ? de.id.name : de.id) || de.key && (typeof de.key == "object" ? de.key.name : de.key) || de.value && (typeof de.value == "object" ? "" : String(de.value)) || de.operator || "");
          return Ne.length > 20 && (Ne = Ne.slice(0, 19) + "…"), oe + (Ne ? " " + Ne : "");
        }
        m.exports = { inferParserByLanguage: ce, getStringWidth: i, getMaxContinuousCount: I, getMinNotPresentContinuousCount: O, getPenultimate: T, getLast: p, getNextNonSpaceNonCommentCharacterIndexWithStartIndex: b, getNextNonSpaceNonCommentCharacterIndex: H, getNextNonSpaceNonCommentCharacter: ge, skip: G, skipWhitespace: u, skipSpaces: h, skipToLineEnd: D, skipEverythingButNewLine: E, skipInlineComment: C, skipTrailingComment: F, skipNewline: g, isNextLineEmptyAfterIndex: U, isNextLineEmpty: Q, isPreviousLineEmpty: _, hasNewline: W, hasNewlineInRange: B, hasSpaces: y, getAlignmentSize: R, getIndentSize: v, getPreferredQuote: S, printString: l, printNumber: w, makeString: A, addLeadingComment: ee, addDanglingComment: pe, addTrailingComment: he, isFrontMatterNode: xe, isNonEmptyArray: e, createGroupIdMapper: ie };
      } }), Ri = {};
      ar(Ri, { basename: () => gs, default: () => vs, delimiter: () => _u, dirname: () => ms, extname: () => Ds, isAbsolute: () => Nu, join: () => ds, normalize: () => Bu, relative: () => hs, resolve: () => su, sep: () => Pu });
      function fs(o, m) {
        for (var t = 0, p = o.length - 1; p >= 0; p--) {
          var c = o[p];
          c === "." ? o.splice(p, 1) : c === ".." ? (o.splice(p, 1), t++) : t && (o.splice(p, 1), t--);
        }
        if (m)
          for (; t--; t)
            o.unshift("..");
        return o;
      }
      function su() {
        for (var o = "", m = !1, t = arguments.length - 1; t >= -1 && !m; t--) {
          var p = t >= 0 ? arguments[t] : "/";
          if (typeof p != "string")
            throw new TypeError("Arguments to path.resolve must be strings");
          p && (o = p + "/" + o, m = p.charAt(0) === "/");
        }
        return o = fs(ju(o.split("/"), function(c) {
          return !!c;
        }), !m).join("/"), (m ? "/" : "") + o || ".";
      }
      function Bu(o) {
        var m = Nu(o), t = bs(o, -1) === "/";
        return o = fs(ju(o.split("/"), function(p) {
          return !!p;
        }), !m).join("/"), !o && !m && (o = "."), o && t && (o += "/"), (m ? "/" : "") + o;
      }
      function Nu(o) {
        return o.charAt(0) === "/";
      }
      function ds() {
        var o = Array.prototype.slice.call(arguments, 0);
        return Bu(ju(o, function(m, t) {
          if (typeof m != "string")
            throw new TypeError("Arguments to path.join must be strings");
          return m;
        }).join("/"));
      }
      function hs(o, m) {
        o = su(o).substr(1), m = su(m).substr(1);
        function t(D) {
          for (var E = 0; E < D.length && D[E] === ""; E++)
            ;
          for (var C = D.length - 1; C >= 0 && D[C] === ""; C--)
            ;
          return E > C ? [] : D.slice(E, C - E + 1);
        }
        for (var p = t(o.split("/")), c = t(m.split("/")), e = Math.min(p.length, c.length), i = e, u = 0; u < e; u++)
          if (p[u] !== c[u]) {
            i = u;
            break;
          }
        for (var h = [], u = i; u < p.length; u++)
          h.push("..");
        return h = h.concat(c.slice(i)), h.join("/");
      }
      function ms(o) {
        var m = ou(o), t = m[0], p = m[1];
        return !t && !p ? "." : (p && (p = p.substr(0, p.length - 1)), t + p);
      }
      function gs(o, m) {
        var t = ou(o)[2];
        return m && t.substr(-1 * m.length) === m && (t = t.substr(0, t.length - m.length)), t;
      }
      function Ds(o) {
        return ou(o)[3];
      }
      function ju(o, m) {
        if (o.filter)
          return o.filter(m);
        for (var t = [], p = 0; p < o.length; p++)
          m(o[p], p, o) && t.push(o[p]);
        return t;
      }
      var ys, ou, Pu, _u, vs, bs, Ti = Wt({ "node-modules-polyfills:path"() {
        Be(), ys = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, ou = function(o) {
          return ys.exec(o).slice(1);
        }, Pu = "/", _u = ":", vs = { extname: Ds, basename: gs, dirname: ms, sep: Pu, delimiter: _u, relative: hs, join: ds, isAbsolute: Nu, normalize: Bu, resolve: su }, bs = "ab".substr(-1) === "b" ? function(o, m, t) {
          return o.substr(m, t);
        } : function(o, m, t) {
          return m < 0 && (m = o.length + m), o.substr(m, t);
        };
      } }), go = Ce({ "node-modules-polyfills-commonjs:path"(o, m) {
        Be();
        var t = (Ti(), Nr(Ri));
        if (t && t.default) {
          m.exports = t.default;
          for (let p in t)
            m.exports[p] = t[p];
        } else
          t && (m.exports = t);
      } }), Vi = Ce({ "src/common/errors.js"(o, m) {
        Be();
        var t = class extends Error {
        }, p = class extends Error {
        }, c = class extends Error {
        }, e = class extends Error {
        };
        m.exports = { ConfigError: t, DebugError: p, UndefinedParserError: c, ArgExpansionBailout: e };
      } }), ni = {};
      ar(ni, { __assign: () => qi, __asyncDelegator: () => Fs, __asyncGenerator: () => ha, __asyncValues: () => ma, __await: () => mi, __awaiter: () => Do, __classPrivateFieldGet: () => Ou, __classPrivateFieldSet: () => lu, __createBinding: () => xs, __decorate: () => Es, __exportStar: () => yo, __extends: () => au, __generator: () => Iu, __importDefault: () => ws, __importStar: () => ga, __makeTemplateObject: () => As, __metadata: () => pa, __param: () => Cs, __read: () => vo, __rest: () => ca, __spread: () => fa, __spreadArrays: () => da, __values: () => Ln });
      function au(o, m) {
        cu(o, m);
        function t() {
          this.constructor = o;
        }
        o.prototype = m === null ? Object.create(m) : (t.prototype = m.prototype, new t());
      }
      function ca(o, m) {
        var t = {};
        for (var p in o)
          Object.prototype.hasOwnProperty.call(o, p) && m.indexOf(p) < 0 && (t[p] = o[p]);
        if (o != null && typeof Object.getOwnPropertySymbols == "function")
          for (var c = 0, p = Object.getOwnPropertySymbols(o); c < p.length; c++)
            m.indexOf(p[c]) < 0 && Object.prototype.propertyIsEnumerable.call(o, p[c]) && (t[p[c]] = o[p[c]]);
        return t;
      }
      function Es(o, m, t, p) {
        var c = arguments.length, e = c < 3 ? m : p === null ? p = Object.getOwnPropertyDescriptor(m, t) : p, i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
          e = Reflect.decorate(o, m, t, p);
        else
          for (var u = o.length - 1; u >= 0; u--)
            (i = o[u]) && (e = (c < 3 ? i(e) : c > 3 ? i(m, t, e) : i(m, t)) || e);
        return c > 3 && e && Object.defineProperty(m, t, e), e;
      }
      function Cs(o, m) {
        return function(t, p) {
          m(t, p, o);
        };
      }
      function pa(o, m) {
        if (typeof Reflect == "object" && typeof Reflect.metadata == "function")
          return Reflect.metadata(o, m);
      }
      function Do(o, m, t, p) {
        function c(e) {
          return e instanceof t ? e : new t(function(i) {
            i(e);
          });
        }
        return new (t || (t = Promise))(function(e, i) {
          function u(E) {
            try {
              D(p.next(E));
            } catch (C) {
              i(C);
            }
          }
          function h(E) {
            try {
              D(p.throw(E));
            } catch (C) {
              i(C);
            }
          }
          function D(E) {
            E.done ? e(E.value) : c(E.value).then(u, h);
          }
          D((p = p.apply(o, m || [])).next());
        });
      }
      function Iu(o, m) {
        var t = { label: 0, sent: function() {
          if (e[0] & 1)
            throw e[1];
          return e[1];
        }, trys: [], ops: [] }, p, c, e, i;
        return i = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (i[Symbol.iterator] = function() {
          return this;
        }), i;
        function u(D) {
          return function(E) {
            return h([D, E]);
          };
        }
        function h(D) {
          if (p)
            throw new TypeError("Generator is already executing.");
          for (; t; )
            try {
              if (p = 1, c && (e = D[0] & 2 ? c.return : D[0] ? c.throw || ((e = c.return) && e.call(c), 0) : c.next) && !(e = e.call(c, D[1])).done)
                return e;
              switch (c = 0, e && (D = [D[0] & 2, e.value]), D[0]) {
                case 0:
                case 1:
                  e = D;
                  break;
                case 4:
                  return t.label++, { value: D[1], done: !1 };
                case 5:
                  t.label++, c = D[1], D = [0];
                  continue;
                case 7:
                  D = t.ops.pop(), t.trys.pop();
                  continue;
                default:
                  if (e = t.trys, !(e = e.length > 0 && e[e.length - 1]) && (D[0] === 6 || D[0] === 2)) {
                    t = 0;
                    continue;
                  }
                  if (D[0] === 3 && (!e || D[1] > e[0] && D[1] < e[3])) {
                    t.label = D[1];
                    break;
                  }
                  if (D[0] === 6 && t.label < e[1]) {
                    t.label = e[1], e = D;
                    break;
                  }
                  if (e && t.label < e[2]) {
                    t.label = e[2], t.ops.push(D);
                    break;
                  }
                  e[2] && t.ops.pop(), t.trys.pop();
                  continue;
              }
              D = m.call(o, t);
            } catch (E) {
              D = [6, E], c = 0;
            } finally {
              p = e = 0;
            }
          if (D[0] & 5)
            throw D[1];
          return { value: D[0] ? D[1] : void 0, done: !0 };
        }
      }
      function xs(o, m, t, p) {
        p === void 0 && (p = t), o[p] = m[t];
      }
      function yo(o, m) {
        for (var t in o)
          t !== "default" && !m.hasOwnProperty(t) && (m[t] = o[t]);
      }
      function Ln(o) {
        var m = typeof Symbol == "function" && Symbol.iterator, t = m && o[m], p = 0;
        if (t)
          return t.call(o);
        if (o && typeof o.length == "number")
          return { next: function() {
            return o && p >= o.length && (o = void 0), { value: o && o[p++], done: !o };
          } };
        throw new TypeError(m ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }
      function vo(o, m) {
        var t = typeof Symbol == "function" && o[Symbol.iterator];
        if (!t)
          return o;
        var p = t.call(o), c, e = [], i;
        try {
          for (; (m === void 0 || m-- > 0) && !(c = p.next()).done; )
            e.push(c.value);
        } catch (u) {
          i = { error: u };
        } finally {
          try {
            c && !c.done && (t = p.return) && t.call(p);
          } finally {
            if (i)
              throw i.error;
          }
        }
        return e;
      }
      function fa() {
        for (var o = [], m = 0; m < arguments.length; m++)
          o = o.concat(vo(arguments[m]));
        return o;
      }
      function da() {
        for (var o = 0, m = 0, t = arguments.length; m < t; m++)
          o += arguments[m].length;
        for (var p = Array(o), c = 0, m = 0; m < t; m++)
          for (var e = arguments[m], i = 0, u = e.length; i < u; i++, c++)
            p[c] = e[i];
        return p;
      }
      function mi(o) {
        return this instanceof mi ? (this.v = o, this) : new mi(o);
      }
      function ha(o, m, t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var p = t.apply(o, m || []), c, e = [];
        return c = {}, i("next"), i("throw"), i("return"), c[Symbol.asyncIterator] = function() {
          return this;
        }, c;
        function i(F) {
          p[F] && (c[F] = function(g) {
            return new Promise(function(b, T) {
              e.push([F, g, b, T]) > 1 || u(F, g);
            });
          });
        }
        function u(F, g) {
          try {
            h(p[F](g));
          } catch (b) {
            C(e[0][3], b);
          }
        }
        function h(F) {
          F.value instanceof mi ? Promise.resolve(F.value.v).then(D, E) : C(e[0][2], F);
        }
        function D(F) {
          u("next", F);
        }
        function E(F) {
          u("throw", F);
        }
        function C(F, g) {
          F(g), e.shift(), e.length && u(e[0][0], e[0][1]);
        }
      }
      function Fs(o) {
        var m, t;
        return m = {}, p("next"), p("throw", function(c) {
          throw c;
        }), p("return"), m[Symbol.iterator] = function() {
          return this;
        }, m;
        function p(c, e) {
          m[c] = o[c] ? function(i) {
            return (t = !t) ? { value: mi(o[c](i)), done: c === "return" } : e ? e(i) : i;
          } : e;
        }
      }
      function ma(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], t;
        return m ? m.call(o) : (o = typeof Ln == "function" ? Ln(o) : o[Symbol.iterator](), t = {}, p("next"), p("throw"), p("return"), t[Symbol.asyncIterator] = function() {
          return this;
        }, t);
        function p(e) {
          t[e] = o[e] && function(i) {
            return new Promise(function(u, h) {
              i = o[e](i), c(u, h, i.done, i.value);
            });
          };
        }
        function c(e, i, u, h) {
          Promise.resolve(h).then(function(D) {
            e({ value: D, done: u });
          }, i);
        }
      }
      function As(o, m) {
        return Object.defineProperty ? Object.defineProperty(o, "raw", { value: m }) : o.raw = m, o;
      }
      function ga(o) {
        if (o && o.__esModule)
          return o;
        var m = {};
        if (o != null)
          for (var t in o)
            Object.hasOwnProperty.call(o, t) && (m[t] = o[t]);
        return m.default = o, m;
      }
      function ws(o) {
        return o && o.__esModule ? o : { default: o };
      }
      function Ou(o, m) {
        if (!m.has(o))
          throw new TypeError("attempted to get private field on non-instance");
        return m.get(o);
      }
      function lu(o, m, t) {
        if (!m.has(o))
          throw new TypeError("attempted to set private field on non-instance");
        return m.set(o, t), t;
      }
      var cu, qi, Mn = Wt({ "node_modules/tslib/tslib.es6.js"() {
        Be(), cu = function(o, m) {
          return cu = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, p) {
            t.__proto__ = p;
          } || function(t, p) {
            for (var c in p)
              p.hasOwnProperty(c) && (t[c] = p[c]);
          }, cu(o, m);
        }, qi = function() {
          return qi = Object.assign || function(o) {
            for (var m, t = 1, p = arguments.length; t < p; t++) {
              m = arguments[t];
              for (var c in m)
                Object.prototype.hasOwnProperty.call(m, c) && (o[c] = m[c]);
            }
            return o;
          }, qi.apply(this, arguments);
        };
      } }), Ss = Ce({ "node_modules/vnopts/lib/descriptors/api.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.apiDescriptor = { key: (m) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(m) ? m : JSON.stringify(m), value(m) {
          if (m === null || typeof m != "object")
            return JSON.stringify(m);
          if (Array.isArray(m))
            return `[${m.map((p) => o.apiDescriptor.value(p)).join(", ")}]`;
          let t = Object.keys(m);
          return t.length === 0 ? "{}" : `{ ${t.map((p) => `${o.apiDescriptor.key(p)}: ${o.apiDescriptor.value(m[p])}`).join(", ")} }`;
        }, pair: (m) => {
          let { key: t, value: p } = m;
          return o.apiDescriptor.value({ [t]: p });
        } };
      } }), ii = Ce({ "node_modules/vnopts/lib/descriptors/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(Ss(), o);
      } }), gi = Ce({ "scripts/build/shims/chalk.cjs"(o, m) {
        Be();
        var t = (p) => p;
        t.grey = t, t.red = t, t.bold = t, t.yellow = t, t.blue = t, t.default = t, m.exports = t;
      } }), Di = Ce({ "node_modules/vnopts/lib/handlers/deprecated/common.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = gi();
        o.commonDeprecatedHandler = (t, p, c) => {
          let { descriptor: e } = c, i = [`${m.default.yellow(typeof t == "string" ? e.key(t) : e.pair(t))} is deprecated`];
          return p && i.push(`we now treat it as ${m.default.blue(typeof p == "string" ? e.key(p) : e.pair(p))}`), i.join("; ") + ".";
        };
      } }), Lu = Ce({ "node_modules/vnopts/lib/handlers/deprecated/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(Di(), o);
      } }), pu = Ce({ "node_modules/vnopts/lib/handlers/invalid/common.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = gi();
        o.commonInvalidHandler = (t, p, c) => [`Invalid ${m.default.red(c.descriptor.key(t))} value.`, `Expected ${m.default.blue(c.schemas[t].expected(c))},`, `but received ${m.default.red(c.descriptor.value(p))}.`].join(" ");
      } }), Ji = Ce({ "node_modules/vnopts/lib/handlers/invalid/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(pu(), o);
      } }), bo = Ce({ "node_modules/vnopts/node_modules/leven/index.js"(o, m) {
        Be();
        var t = [], p = [];
        m.exports = function(c, e) {
          if (c === e)
            return 0;
          var i = c;
          c.length > e.length && (c = e, e = i);
          var u = c.length, h = e.length;
          if (u === 0)
            return h;
          if (h === 0)
            return u;
          for (; u > 0 && c.charCodeAt(~-u) === e.charCodeAt(~-h); )
            u--, h--;
          if (u === 0)
            return h;
          for (var D = 0; D < u && c.charCodeAt(D) === e.charCodeAt(D); )
            D++;
          if (u -= D, h -= D, u === 0)
            return h;
          for (var E, C, F, g, b = 0, T = 0; b < u; )
            p[D + b] = c.charCodeAt(D + b), t[b] = ++b;
          for (; T < h; )
            for (E = e.charCodeAt(D + T), F = T++, C = T, b = 0; b < u; b++)
              g = E === p[D + b] ? F : F + 1, F = t[b], C = t[b] = F > C ? g > C ? C + 1 : g : g > F ? F + 1 : g;
          return C;
        };
      } }), Ts = Ce({ "node_modules/vnopts/lib/handlers/unknown/leven.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = gi(), t = bo();
        o.levenUnknownHandler = (p, c, e) => {
          let { descriptor: i, logger: u, schemas: h } = e, D = [`Ignored unknown option ${m.default.yellow(i.pair({ key: p, value: c }))}.`], E = Object.keys(h).sort().find((C) => t(p, C) < 3);
          E && D.push(`Did you mean ${m.default.blue(i.key(E))}?`), u.warn(D.join(" "));
        };
      } }), ks = Ce({ "node_modules/vnopts/lib/handlers/unknown/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(Ts(), o);
      } }), Bs = Ce({ "node_modules/vnopts/lib/handlers/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(Lu(), o), m.__exportStar(Ji(), o), m.__exportStar(ks(), o);
      } }), yi = Ce({ "node_modules/vnopts/lib/schema.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = ["default", "expected", "validate", "deprecated", "forward", "redirect", "overlap", "preprocess", "postprocess"];
        function t(e, i) {
          let u = new e(i), h = Object.create(u);
          for (let D of m)
            D in i && (h[D] = c(i[D], u, p.prototype[D].length));
          return h;
        }
        o.createSchema = t;
        var p = class {
          constructor(e) {
            this.name = e.name;
          }
          static create(e) {
            return t(this, e);
          }
          default(e) {
          }
          expected(e) {
            return "nothing";
          }
          validate(e, i) {
            return !1;
          }
          deprecated(e, i) {
            return !1;
          }
          forward(e, i) {
          }
          redirect(e, i) {
          }
          overlap(e, i, u) {
            return e;
          }
          preprocess(e, i) {
            return e;
          }
          postprocess(e, i) {
            return e;
          }
        };
        o.Schema = p;
        function c(e, i, u) {
          return typeof e == "function" ? function() {
            for (var h = arguments.length, D = new Array(h), E = 0; E < h; E++)
              D[E] = arguments[E];
            return e(...D.slice(0, u - 1), i, ...D.slice(u - 1));
          } : () => e;
        }
      } }), Eo = Ce({ "node_modules/vnopts/lib/schemas/alias.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = class extends m.Schema {
          constructor(p) {
            super(p), this._sourceName = p.sourceName;
          }
          expected(p) {
            return p.schemas[this._sourceName].expected(p);
          }
          validate(p, c) {
            return c.schemas[this._sourceName].validate(p, c);
          }
          redirect(p, c) {
            return this._sourceName;
          }
        };
        o.AliasSchema = t;
      } }), Ns = Ce({ "node_modules/vnopts/lib/schemas/any.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = class extends m.Schema {
          expected() {
            return "anything";
          }
          validate() {
            return !0;
          }
        };
        o.AnySchema = t;
      } }), Co = Ce({ "node_modules/vnopts/lib/schemas/array.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni)), t = yi(), p = class extends t.Schema {
          constructor(e) {
            var { valueSchema: i, name: u = i.name } = e, h = m.__rest(e, ["valueSchema", "name"]);
            super(Object.assign({}, h, { name: u })), this._valueSchema = i;
          }
          expected(e) {
            return `an array of ${this._valueSchema.expected(e)}`;
          }
          validate(e, i) {
            if (!Array.isArray(e))
              return !1;
            let u = [];
            for (let h of e) {
              let D = i.normalizeValidateResult(this._valueSchema.validate(h, i), h);
              D !== !0 && u.push(D.value);
            }
            return u.length === 0 ? !0 : { value: u };
          }
          deprecated(e, i) {
            let u = [];
            for (let h of e) {
              let D = i.normalizeDeprecatedResult(this._valueSchema.deprecated(h, i), h);
              D !== !1 && u.push(...D.map((E) => {
                let { value: C } = E;
                return { value: [C] };
              }));
            }
            return u;
          }
          forward(e, i) {
            let u = [];
            for (let h of e) {
              let D = i.normalizeForwardResult(this._valueSchema.forward(h, i), h);
              u.push(...D.map(c));
            }
            return u;
          }
          redirect(e, i) {
            let u = [], h = [];
            for (let D of e) {
              let E = i.normalizeRedirectResult(this._valueSchema.redirect(D, i), D);
              "remain" in E && u.push(E.remain), h.push(...E.redirect.map(c));
            }
            return u.length === 0 ? { redirect: h } : { redirect: h, remain: u };
          }
          overlap(e, i) {
            return e.concat(i);
          }
        };
        o.ArraySchema = p;
        function c(e) {
          let { from: i, to: u } = e;
          return { from: [i], to: u };
        }
      } }), xo = Ce({ "node_modules/vnopts/lib/schemas/boolean.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = class extends m.Schema {
          expected() {
            return "true or false";
          }
          validate(p) {
            return typeof p == "boolean";
          }
        };
        o.BooleanSchema = t;
      } }), ki = Ce({ "node_modules/vnopts/lib/utils.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        function m(g, b) {
          let T = /* @__PURE__ */ Object.create(null);
          for (let G of g) {
            let W = G[b];
            if (T[W])
              throw new Error(`Duplicate ${b} ${JSON.stringify(W)}`);
            T[W] = G;
          }
          return T;
        }
        o.recordFromArray = m;
        function t(g, b) {
          let T = /* @__PURE__ */ new Map();
          for (let G of g) {
            let W = G[b];
            if (T.has(W))
              throw new Error(`Duplicate ${b} ${JSON.stringify(W)}`);
            T.set(W, G);
          }
          return T;
        }
        o.mapFromArray = t;
        function p() {
          let g = /* @__PURE__ */ Object.create(null);
          return (b) => {
            let T = JSON.stringify(b);
            return g[T] ? !0 : (g[T] = !0, !1);
          };
        }
        o.createAutoChecklist = p;
        function c(g, b) {
          let T = [], G = [];
          for (let W of g)
            b(W) ? T.push(W) : G.push(W);
          return [T, G];
        }
        o.partition = c;
        function e(g) {
          return g === Math.floor(g);
        }
        o.isInt = e;
        function i(g, b) {
          if (g === b)
            return 0;
          let T = typeof g, G = typeof b, W = ["undefined", "object", "boolean", "number", "string"];
          return T !== G ? W.indexOf(T) - W.indexOf(G) : T !== "string" ? Number(g) - Number(b) : g.localeCompare(b);
        }
        o.comparePrimitive = i;
        function u(g) {
          return g === void 0 ? {} : g;
        }
        o.normalizeDefaultResult = u;
        function h(g, b) {
          return g === !0 ? !0 : g === !1 ? { value: b } : g;
        }
        o.normalizeValidateResult = h;
        function D(g, b) {
          let T = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
          return g === !1 ? !1 : g === !0 ? T ? !0 : [{ value: b }] : "value" in g ? [g] : g.length === 0 ? !1 : g;
        }
        o.normalizeDeprecatedResult = D;
        function E(g, b) {
          return typeof g == "string" || "key" in g ? { from: b, to: g } : "from" in g ? { from: g.from, to: g.to } : { from: b, to: g.to };
        }
        o.normalizeTransferResult = E;
        function C(g, b) {
          return g === void 0 ? [] : Array.isArray(g) ? g.map((T) => E(T, b)) : [E(g, b)];
        }
        o.normalizeForwardResult = C;
        function F(g, b) {
          let T = C(typeof g == "object" && "redirect" in g ? g.redirect : g, b);
          return T.length === 0 ? { remain: b, redirect: T } : typeof g == "object" && "remain" in g ? { remain: g.remain, redirect: T } : { redirect: T };
        }
        o.normalizeRedirectResult = F;
      } }), js = Ce({ "node_modules/vnopts/lib/schemas/choice.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = ki(), p = class extends m.Schema {
          constructor(c) {
            super(c), this._choices = t.mapFromArray(c.choices.map((e) => e && typeof e == "object" ? e : { value: e }), "value");
          }
          expected(c) {
            let { descriptor: e } = c, i = Array.from(this._choices.keys()).map((D) => this._choices.get(D)).filter((D) => !D.deprecated).map((D) => D.value).sort(t.comparePrimitive).map(e.value), u = i.slice(0, -2), h = i.slice(-2);
            return u.concat(h.join(" or ")).join(", ");
          }
          validate(c) {
            return this._choices.has(c);
          }
          deprecated(c) {
            let e = this._choices.get(c);
            return e && e.deprecated ? { value: c } : !1;
          }
          forward(c) {
            let e = this._choices.get(c);
            return e ? e.forward : void 0;
          }
          redirect(c) {
            let e = this._choices.get(c);
            return e ? e.redirect : void 0;
          }
        };
        o.ChoiceSchema = p;
      } }), Ps = Ce({ "node_modules/vnopts/lib/schemas/number.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = class extends m.Schema {
          expected() {
            return "a number";
          }
          validate(p, c) {
            return typeof p == "number";
          }
        };
        o.NumberSchema = t;
      } }), Fo = Ce({ "node_modules/vnopts/lib/schemas/integer.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = ki(), t = Ps(), p = class extends t.NumberSchema {
          expected() {
            return "an integer";
          }
          validate(c, e) {
            return e.normalizeValidateResult(super.validate(c, e), c) === !0 && m.isInt(c);
          }
        };
        o.IntegerSchema = p;
      } }), Da = Ce({ "node_modules/vnopts/lib/schemas/string.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = yi(), t = class extends m.Schema {
          expected() {
            return "a string";
          }
          validate(p) {
            return typeof p == "string";
          }
        };
        o.StringSchema = t;
      } }), ya = Ce({ "node_modules/vnopts/lib/schemas/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(Eo(), o), m.__exportStar(Ns(), o), m.__exportStar(Co(), o), m.__exportStar(xo(), o), m.__exportStar(js(), o), m.__exportStar(Fo(), o), m.__exportStar(Ps(), o), m.__exportStar(Da(), o);
      } }), va = Ce({ "node_modules/vnopts/lib/defaults.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = Ss(), t = Di(), p = Ji(), c = Ts();
        o.defaultDescriptor = m.apiDescriptor, o.defaultUnknownHandler = c.levenUnknownHandler, o.defaultInvalidHandler = p.commonInvalidHandler, o.defaultDeprecatedHandler = t.commonDeprecatedHandler;
      } }), ba = Ce({ "node_modules/vnopts/lib/normalize.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = va(), t = ki();
        o.normalize = (c, e, i) => new p(e, i).normalize(c);
        var p = class {
          constructor(c, e) {
            let { logger: i = console, descriptor: u = m.defaultDescriptor, unknown: h = m.defaultUnknownHandler, invalid: D = m.defaultInvalidHandler, deprecated: E = m.defaultDeprecatedHandler } = e || {};
            this._utils = { descriptor: u, logger: i || { warn: () => {
            } }, schemas: t.recordFromArray(c, "name"), normalizeDefaultResult: t.normalizeDefaultResult, normalizeDeprecatedResult: t.normalizeDeprecatedResult, normalizeForwardResult: t.normalizeForwardResult, normalizeRedirectResult: t.normalizeRedirectResult, normalizeValidateResult: t.normalizeValidateResult }, this._unknownHandler = h, this._invalidHandler = D, this._deprecatedHandler = E, this.cleanHistory();
          }
          cleanHistory() {
            this._hasDeprecationWarned = t.createAutoChecklist();
          }
          normalize(c) {
            let e = {}, i = [c], u = () => {
              for (; i.length !== 0; ) {
                let h = i.shift(), D = this._applyNormalization(h, e);
                i.push(...D);
              }
            };
            u();
            for (let h of Object.keys(this._utils.schemas)) {
              let D = this._utils.schemas[h];
              if (!(h in e)) {
                let E = t.normalizeDefaultResult(D.default(this._utils));
                "value" in E && i.push({ [h]: E.value });
              }
            }
            u();
            for (let h of Object.keys(this._utils.schemas)) {
              let D = this._utils.schemas[h];
              h in e && (e[h] = D.postprocess(e[h], this._utils));
            }
            return e;
          }
          _applyNormalization(c, e) {
            let i = [], [u, h] = t.partition(Object.keys(c), (D) => D in this._utils.schemas);
            for (let D of u) {
              let E = this._utils.schemas[D], C = E.preprocess(c[D], this._utils), F = t.normalizeValidateResult(E.validate(C, this._utils), C);
              if (F !== !0) {
                let { value: G } = F, W = this._invalidHandler(D, G, this._utils);
                throw typeof W == "string" ? new Error(W) : W;
              }
              let g = (G) => {
                let { from: W, to: B } = G;
                i.push(typeof B == "string" ? { [B]: W } : { [B.key]: B.value });
              }, b = (G) => {
                let { value: W, redirectTo: B } = G, _ = t.normalizeDeprecatedResult(E.deprecated(W, this._utils), C, !0);
                if (_ !== !1)
                  if (_ === !0)
                    this._hasDeprecationWarned(D) || this._utils.logger.warn(this._deprecatedHandler(D, B, this._utils));
                  else
                    for (let { value: U } of _) {
                      let Q = { key: D, value: U };
                      if (!this._hasDeprecationWarned(Q)) {
                        let H = typeof B == "string" ? { key: B, value: U } : B;
                        this._utils.logger.warn(this._deprecatedHandler(Q, H, this._utils));
                      }
                    }
              };
              t.normalizeForwardResult(E.forward(C, this._utils), C).forEach(g);
              let T = t.normalizeRedirectResult(E.redirect(C, this._utils), C);
              if (T.redirect.forEach(g), "remain" in T) {
                let G = T.remain;
                e[D] = D in e ? E.overlap(e[D], G, this._utils) : G, b({ value: G });
              }
              for (let { from: G, to: W } of T.redirect)
                b({ value: G, redirectTo: W });
            }
            for (let D of h) {
              let E = c[D], C = this._unknownHandler(D, E, this._utils);
              if (C)
                for (let F of Object.keys(C)) {
                  let g = { [F]: C[F] };
                  F in this._utils.schemas ? i.push(g) : Object.assign(e, g);
                }
            }
            return i;
          }
        };
        o.Normalizer = p;
      } }), Ao = Ce({ "node_modules/vnopts/lib/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = (Mn(), Nr(ni));
        m.__exportStar(ii(), o), m.__exportStar(Bs(), o), m.__exportStar(ya(), o), m.__exportStar(ba(), o), m.__exportStar(yi(), o);
      } }), wo = Ce({ "src/main/options-normalizer.js"(o, m) {
        Be();
        var t = Ao(), p = dn(), c = { key: (F) => F.length === 1 ? `-${F}` : `--${F}`, value: (F) => t.apiDescriptor.value(F), pair: (F) => {
          let { key: g, value: b } = F;
          return b === !1 ? `--no-${g}` : b === !0 ? c.key(g) : b === "" ? `${c.key(g)} without an argument` : `${c.key(g)}=${b}`;
        } }, e = (F) => {
          let { colorsModule: g, levenshteinDistance: b } = F;
          return class extends t.ChoiceSchema {
            constructor(T) {
              let { name: G, flags: W } = T;
              super({ name: G, choices: W }), this._flags = [...W].sort();
            }
            preprocess(T, G) {
              if (typeof T == "string" && T.length > 0 && !this._flags.includes(T)) {
                let W = this._flags.find((B) => b(B, T) < 3);
                if (W)
                  return G.logger.warn([`Unknown flag ${g.yellow(G.descriptor.value(T))},`, `did you mean ${g.blue(G.descriptor.value(W))}?`].join(" ")), W;
              }
              return T;
            }
            expected() {
              return "a flag";
            }
          };
        }, i;
        function u(F, g) {
          let { logger: b = !1, isCLI: T = !1, passThrough: G = !1, colorsModule: W = null, levenshteinDistance: B = null } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, _ = G ? Array.isArray(G) ? (R, v) => G.includes(R) ? { [R]: v } : void 0 : (R, v) => ({ [R]: v }) : (R, v, S) => {
            let l = S.schemas, A = at(l, He);
            return t.levenUnknownHandler(R, v, Object.assign(Object.assign({}, S), {}, { schemas: A }));
          }, U = T ? c : t.apiDescriptor, Q = h(g, { isCLI: T, colorsModule: W, levenshteinDistance: B }), H = new t.Normalizer(Q, { logger: b, unknown: _, descriptor: U }), ge = b !== !1;
          ge && i && (H._hasDeprecationWarned = i);
          let y = H.normalize(F);
          return ge && (i = H._hasDeprecationWarned), T && y["plugin-search"] === !1 && (y["plugin-search-dir"] = !1), y;
        }
        function h(F, g) {
          let { isCLI: b, colorsModule: T, levenshteinDistance: G } = g, W = [];
          b && W.push(t.AnySchema.create({ name: "_" }));
          for (let B of F)
            W.push(D(B, { isCLI: b, optionInfos: F, colorsModule: T, levenshteinDistance: G })), B.alias && b && W.push(t.AliasSchema.create({ name: B.alias, sourceName: B.name }));
          return W;
        }
        function D(F, g) {
          let { isCLI: b, optionInfos: T, colorsModule: G, levenshteinDistance: W } = g, { name: B } = F;
          if (B === "plugin-search-dir" || B === "pluginSearchDirs")
            return t.AnySchema.create({ name: B, preprocess(H) {
              return H === !1 || (H = Array.isArray(H) ? H : [H]), H;
            }, validate(H) {
              return H === !1 ? !0 : H.every((ge) => typeof ge == "string");
            }, expected() {
              return "false or paths to plugin search dir";
            } });
          let _ = { name: B }, U, Q = {};
          switch (F.type) {
            case "int":
              U = t.IntegerSchema, b && (_.preprocess = Number);
              break;
            case "string":
              U = t.StringSchema;
              break;
            case "choice":
              U = t.ChoiceSchema, _.choices = F.choices.map((H) => typeof H == "object" && H.redirect ? Object.assign(Object.assign({}, H), {}, { redirect: { to: { key: F.name, value: H.redirect } } }) : H);
              break;
            case "boolean":
              U = t.BooleanSchema;
              break;
            case "flag":
              U = e({ colorsModule: G, levenshteinDistance: W }), _.flags = T.flatMap((H) => [H.alias, H.description && H.name, H.oppositeDescription && `no-${H.name}`].filter(Boolean));
              break;
            case "path":
              U = t.StringSchema;
              break;
            default:
              throw new Error(`Unexpected type ${F.type}`);
          }
          if (F.exception ? _.validate = (H, ge, y) => F.exception(H) || ge.validate(H, y) : _.validate = (H, ge, y) => H === void 0 || ge.validate(H, y), F.redirect && (Q.redirect = (H) => H ? { to: { key: F.redirect.option, value: F.redirect.value } } : void 0), F.deprecated && (Q.deprecated = !0), b && !F.array) {
            let H = _.preprocess || ((ge) => ge);
            _.preprocess = (ge, y, R) => y.preprocess(H(Array.isArray(ge) ? p(ge) : ge), R);
          }
          return F.array ? t.ArraySchema.create(Object.assign(Object.assign(Object.assign({}, b ? { preprocess: (H) => Array.isArray(H) ? H : [H] } : {}), Q), {}, { valueSchema: U.create(_) })) : U.create(Object.assign(Object.assign({}, _), Q));
        }
        function E(F, g, b) {
          return u(F, g, b);
        }
        function C(F, g, b) {
          return u(F, g, Object.assign({ isCLI: !0 }, b));
        }
        m.exports = { normalizeApiOptions: E, normalizeCliOptions: C };
      } }), Dn = Ce({ "src/language-js/loc.js"(o, m) {
        Be();
        var t = ps();
        function p(h) {
          var D, E;
          let C = h.range ? h.range[0] : h.start, F = (D = (E = h.declaration) === null || E === void 0 ? void 0 : E.decorators) !== null && D !== void 0 ? D : h.decorators;
          return t(F) ? Math.min(p(F[0]), C) : C;
        }
        function c(h) {
          return h.range ? h.range[1] : h.end;
        }
        function e(h, D) {
          let E = p(h);
          return Number.isInteger(E) && E === p(D);
        }
        function i(h, D) {
          let E = c(h);
          return Number.isInteger(E) && E === c(D);
        }
        function u(h, D) {
          return e(h, D) && i(h, D);
        }
        m.exports = { locStart: p, locEnd: c, hasSameLocStart: e, hasSameLoc: u };
      } }), Ea = Ce({ "src/main/load-parser.js"(o, m) {
        Be(), m.exports = () => {
        };
      } }), Ca = Ce({ "scripts/build/shims/babel-highlight.cjs"(o, m) {
        Be();
        var t = gi(), p = { shouldHighlight: () => !1, getChalk: () => t };
        m.exports = p;
      } }), xa = Ce({ "node_modules/@babel/code-frame/lib/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.codeFrameColumns = i, o.default = u;
        var m = Ca(), t = !1;
        function p(h) {
          return { gutter: h.grey, marker: h.red.bold, message: h.red.bold };
        }
        var c = /\r\n|[\n\r\u2028\u2029]/;
        function e(h, D, E) {
          let C = Object.assign({ column: 0, line: -1 }, h.start), F = Object.assign({}, C, h.end), { linesAbove: g = 2, linesBelow: b = 3 } = E || {}, T = C.line, G = C.column, W = F.line, B = F.column, _ = Math.max(T - (g + 1), 0), U = Math.min(D.length, W + b);
          T === -1 && (_ = 0), W === -1 && (U = D.length);
          let Q = W - T, H = {};
          if (Q)
            for (let ge = 0; ge <= Q; ge++) {
              let y = ge + T;
              if (!G)
                H[y] = !0;
              else if (ge === 0) {
                let R = D[y - 1].length;
                H[y] = [G, R - G + 1];
              } else if (ge === Q)
                H[y] = [0, B];
              else {
                let R = D[y - ge].length;
                H[y] = [0, R];
              }
            }
          else
            G === B ? G ? H[T] = [G, 0] : H[T] = !0 : H[T] = [G, B - G];
          return { start: _, end: U, markerLines: H };
        }
        function i(h, D) {
          let E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, C = (E.highlightCode || E.forceColor) && (0, m.shouldHighlight)(E), F = (0, m.getChalk)(E), g = p(F), b = (H, ge) => C ? H(ge) : ge, T = h.split(c), { start: G, end: W, markerLines: B } = e(D, T, E), _ = D.start && typeof D.start.column == "number", U = String(W).length, Q = (C ? (0, m.default)(h, E) : h).split(c, W).slice(G, W).map((H, ge) => {
            let y = G + 1 + ge, R = ` ${` ${y}`.slice(-U)} |`, v = B[y], S = !B[y + 1];
            if (v) {
              let l = "";
              if (Array.isArray(v)) {
                let A = H.slice(0, Math.max(v[0] - 1, 0)).replace(/[^\t]/g, " "), w = v[1] || 1;
                l = [`
 `, b(g.gutter, R.replace(/\d/g, " ")), " ", A, b(g.marker, "^").repeat(w)].join(""), S && E.message && (l += " " + b(g.message, E.message));
              }
              return [b(g.marker, ">"), b(g.gutter, R), H.length > 0 ? ` ${H}` : "", l].join("");
            } else
              return ` ${b(g.gutter, R)}${H.length > 0 ? ` ${H}` : ""}`;
          }).join(`
`);
          return E.message && !_ && (Q = `${" ".repeat(U + 1)}${E.message}
${Q}`), C ? F.reset(Q) : Q;
        }
        function u(h, D, E) {
          let C = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          if (!t) {
            t = !0;
            let F = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";
            if (Kr.emitWarning)
              Kr.emitWarning(F, "DeprecationWarning");
            else {
              let g = new Error(F);
              g.name = "DeprecationWarning", console.warn(new Error(F));
            }
          }
          return E = Math.max(E, 0), i(h, { start: { column: E, line: D } }, C);
        }
      } }), vi = Ce({ "src/main/parser.js"(o, m) {
        Be();
        var { ConfigError: t } = Vi(), p = Dn();
        Ea();
        var { locStart: c, locEnd: e } = p, i = Object.getOwnPropertyNames, u = Object.getOwnPropertyDescriptor;
        function h(C) {
          let F = {};
          for (let g of C.plugins)
            if (g.parsers)
              for (let b of i(g.parsers))
                Object.defineProperty(F, b, u(g.parsers, b));
          return F;
        }
        function D(C) {
          let F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : h(C);
          if (typeof C.parser == "function")
            return { parse: C.parser, astFormat: "estree", locStart: c, locEnd: e };
          if (typeof C.parser == "string") {
            if (Object.prototype.hasOwnProperty.call(F, C.parser))
              return F[C.parser];
            throw new t(`Couldn't resolve parser "${C.parser}". Parsers must be explicitly added to the standalone bundle.`);
          }
        }
        function E(C, F) {
          let g = h(F), b = Object.defineProperties({}, Object.fromEntries(Object.keys(g).map((G) => [G, { enumerable: !0, get() {
            return g[G].parse;
          } }]))), T = D(F, g);
          try {
            return T.preprocess && (C = T.preprocess(C, F)), { text: C, ast: T.parse(C, b, F) };
          } catch (G) {
            let { loc: W } = G;
            if (W) {
              let { codeFrameColumns: B } = xa();
              throw G.codeFrame = B(C, W, { highlightCode: !0 }), G.message += `
` + G.codeFrame, G;
            }
            throw G;
          }
        }
        m.exports = { parse: E, resolveParser: D };
      } }), En = Ce({ "src/main/options.js"(o, m) {
        Be();
        var t = go(), { UndefinedParserError: p } = Vi(), { getSupportInfo: c } = cs(), e = wo(), { resolveParser: i } = vi(), u = { astFormat: "estree", printer: {}, originalText: void 0, locStart: null, locEnd: null };
        function h(C) {
          let F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, g = Object.assign({}, C), b = c({ plugins: C.plugins, showUnreleased: !0, showDeprecated: !0 }).options, T = Object.assign(Object.assign({}, u), Object.fromEntries(b.filter((U) => U.default !== void 0).map((U) => [U.name, U.default])));
          if (!g.parser) {
            if (!g.filepath)
              (F.logger || console).warn("No parser and no filepath given, using 'babel' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred."), g.parser = "babel";
            else if (g.parser = E(g.filepath, g.plugins), !g.parser)
              throw new p(`No parser could be inferred for file: ${g.filepath}`);
          }
          let G = i(e.normalizeApiOptions(g, [b.find((U) => U.name === "parser")], { passThrough: !0, logger: !1 }));
          g.astFormat = G.astFormat, g.locEnd = G.locEnd, g.locStart = G.locStart;
          let W = D(g);
          g.printer = W.printers[g.astFormat];
          let B = Object.fromEntries(b.filter((U) => U.pluginDefaults && U.pluginDefaults[W.name] !== void 0).map((U) => [U.name, U.pluginDefaults[W.name]])), _ = Object.assign(Object.assign({}, T), B);
          for (let [U, Q] of Object.entries(_))
            (g[U] === null || g[U] === void 0) && (g[U] = Q);
          return g.parser === "json" && (g.trailingComma = "none"), e.normalizeApiOptions(g, b, Object.assign({ passThrough: Object.keys(u) }, F));
        }
        function D(C) {
          let { astFormat: F } = C;
          if (!F)
            throw new Error("getPlugin() requires astFormat to be set");
          let g = C.plugins.find((b) => b.printers && b.printers[F]);
          if (!g)
            throw new Error(`Couldn't find plugin for AST format "${F}"`);
          return g;
        }
        function E(C, F) {
          let g = t.basename(C).toLowerCase(), b = c({ plugins: F }).languages.filter((T) => T.since !== null).find((T) => T.extensions && T.extensions.some((G) => g.endsWith(G)) || T.filenames && T.filenames.some((G) => G.toLowerCase() === g));
          return b && b.parsers[0];
        }
        m.exports = { normalize: h, hiddenDefaults: u, inferParser: E };
      } }), _s = Ce({ "src/main/massage-ast.js"(o, m) {
        Be();
        function t(p, c, e) {
          if (Array.isArray(p))
            return p.map((D) => t(D, c, e)).filter(Boolean);
          if (!p || typeof p != "object")
            return p;
          let i = c.printer.massageAstNode, u;
          i && i.ignoredProperties ? u = i.ignoredProperties : u = /* @__PURE__ */ new Set();
          let h = {};
          for (let [D, E] of Object.entries(p))
            !u.has(D) && typeof E != "function" && (h[D] = t(E, c, p));
          if (i) {
            let D = i(p, h, e);
            if (D === null)
              return;
            if (D)
              return D;
          }
          return h;
        }
        m.exports = t;
      } }), Ui = Ce({ "scripts/build/shims/assert.cjs"(o, m) {
        Be();
        var t = () => {
        };
        t.ok = t, t.strictEqual = t, m.exports = t;
      } }), tn = Ce({ "src/main/comments.js"(o, m) {
        Be();
        var t = Ui(), { builders: { line: p, hardline: c, breakParent: e, indent: i, lineSuffix: u, join: h, cursor: D } } = sr(), { hasNewline: E, skipNewline: C, skipSpaces: F, isPreviousLineEmpty: g, addLeadingComment: b, addDanglingComment: T, addTrailingComment: G } = yr(), W = /* @__PURE__ */ new WeakMap();
        function B(ee, pe, he) {
          if (!ee)
            return;
          let { printer: ce, locStart: xe, locEnd: ie } = pe;
          if (he) {
            if (ce.canAttachComment && ce.canAttachComment(ee)) {
              let de;
              for (de = he.length - 1; de >= 0 && !(xe(he[de]) <= xe(ee) && ie(he[de]) <= ie(ee)); --de)
                ;
              he.splice(de + 1, 0, ee);
              return;
            }
          } else if (W.has(ee))
            return W.get(ee);
          let je = ce.getCommentChildNodes && ce.getCommentChildNodes(ee, pe) || typeof ee == "object" && Object.entries(ee).filter((de) => {
            let [oe] = de;
            return oe !== "enclosingNode" && oe !== "precedingNode" && oe !== "followingNode" && oe !== "tokens" && oe !== "comments" && oe !== "parent";
          }).map((de) => {
            let [, oe] = de;
            return oe;
          });
          if (je) {
            he || (he = [], W.set(ee, he));
            for (let de of je)
              B(de, pe, he);
            return he;
          }
        }
        function _(ee, pe, he, ce) {
          let { locStart: xe, locEnd: ie } = he, je = xe(pe), de = ie(pe), oe = B(ee, he), Ne, Je, _e = 0, it = oe.length;
          for (; _e < it; ) {
            let me = _e + it >> 1, Se = oe[me], Qe = xe(Se), Ze = ie(Se);
            if (Qe <= je && de <= Ze)
              return _(Se, pe, he, Se);
            if (Ze <= je) {
              Ne = Se, _e = me + 1;
              continue;
            }
            if (de <= Qe) {
              Je = Se, it = me;
              continue;
            }
            throw new Error("Comment location overlaps with node location");
          }
          if (ce && ce.type === "TemplateLiteral") {
            let { quasis: me } = ce, Se = S(me, pe, he);
            Ne && S(me, Ne, he) !== Se && (Ne = null), Je && S(me, Je, he) !== Se && (Je = null);
          }
          return { enclosingNode: ce, precedingNode: Ne, followingNode: Je };
        }
        var U = () => !1;
        function Q(ee, pe, he, ce) {
          if (!Array.isArray(ee))
            return;
          let xe = [], { locStart: ie, locEnd: je, printer: { handleComments: de = {} } } = ce, { avoidAstMutation: oe, ownLine: Ne = U, endOfLine: Je = U, remaining: _e = U } = de, it = ee.map((me, Se) => Object.assign(Object.assign({}, _(pe, me, ce)), {}, { comment: me, text: he, options: ce, ast: pe, isLastComment: ee.length - 1 === Se }));
          for (let [me, Se] of it.entries()) {
            let { comment: Qe, precedingNode: Ze, enclosingNode: kt, followingNode: ke, text: be, options: Oe, ast: Re, isLastComment: ut } = Se;
            if (Oe.parser === "json" || Oe.parser === "json5" || Oe.parser === "__js_expression" || Oe.parser === "__vue_expression" || Oe.parser === "__vue_ts_expression") {
              if (ie(Qe) - ie(Re) <= 0) {
                b(Re, Qe);
                continue;
              }
              if (je(Qe) - je(Re) >= 0) {
                G(Re, Qe);
                continue;
              }
            }
            let ht;
            if (oe ? ht = [Se] : (Qe.enclosingNode = kt, Qe.precedingNode = Ze, Qe.followingNode = ke, ht = [Qe, be, Oe, Re, ut]), ge(be, Oe, it, me))
              Qe.placement = "ownLine", Ne(...ht) || (ke ? b(ke, Qe) : Ze ? G(Ze, Qe) : T(kt || Re, Qe));
            else if (y(be, Oe, it, me))
              Qe.placement = "endOfLine", Je(...ht) || (Ze ? G(Ze, Qe) : ke ? b(ke, Qe) : T(kt || Re, Qe));
            else if (Qe.placement = "remaining", !_e(...ht))
              if (Ze && ke) {
                let vt = xe.length;
                vt > 0 && xe[vt - 1].followingNode !== ke && R(xe, be, Oe), xe.push(Se);
              } else
                Ze ? G(Ze, Qe) : ke ? b(ke, Qe) : T(kt || Re, Qe);
          }
          if (R(xe, he, ce), !oe)
            for (let me of ee)
              delete me.precedingNode, delete me.enclosingNode, delete me.followingNode;
        }
        var H = (ee) => !/[\S\n\u2028\u2029]/.test(ee);
        function ge(ee, pe, he, ce) {
          let { comment: xe, precedingNode: ie } = he[ce], { locStart: je, locEnd: de } = pe, oe = je(xe);
          if (ie)
            for (let Ne = ce - 1; Ne >= 0; Ne--) {
              let { comment: Je, precedingNode: _e } = he[Ne];
              if (_e !== ie || !H(ee.slice(de(Je), oe)))
                break;
              oe = je(Je);
            }
          return E(ee, oe, { backwards: !0 });
        }
        function y(ee, pe, he, ce) {
          let { comment: xe, followingNode: ie } = he[ce], { locStart: je, locEnd: de } = pe, oe = de(xe);
          if (ie)
            for (let Ne = ce + 1; Ne < he.length; Ne++) {
              let { comment: Je, followingNode: _e } = he[Ne];
              if (_e !== ie || !H(ee.slice(oe, je(Je))))
                break;
              oe = de(Je);
            }
          return E(ee, oe);
        }
        function R(ee, pe, he) {
          let ce = ee.length;
          if (ce === 0)
            return;
          let { precedingNode: xe, followingNode: ie, enclosingNode: je } = ee[0], de = he.printer.getGapRegex && he.printer.getGapRegex(je) || /^[\s(]*$/, oe = he.locStart(ie), Ne;
          for (Ne = ce; Ne > 0; --Ne) {
            let { comment: Je, precedingNode: _e, followingNode: it } = ee[Ne - 1];
            t.strictEqual(_e, xe), t.strictEqual(it, ie);
            let me = pe.slice(he.locEnd(Je), oe);
            if (de.test(me))
              oe = he.locStart(Je);
            else
              break;
          }
          for (let [Je, { comment: _e }] of ee.entries())
            Je < Ne ? G(xe, _e) : b(ie, _e);
          for (let Je of [xe, ie])
            Je.comments && Je.comments.length > 1 && Je.comments.sort((_e, it) => he.locStart(_e) - he.locStart(it));
          ee.length = 0;
        }
        function v(ee, pe) {
          let he = ee.getValue();
          return he.printed = !0, pe.printer.printComment(ee, pe);
        }
        function S(ee, pe, he) {
          let ce = he.locStart(pe) - 1;
          for (let xe = 1; xe < ee.length; ++xe)
            if (ce < he.locStart(ee[xe]))
              return xe - 1;
          return 0;
        }
        function l(ee, pe) {
          let he = ee.getValue(), ce = [v(ee, pe)], { printer: xe, originalText: ie, locStart: je, locEnd: de } = pe;
          if (xe.isBlockComment && xe.isBlockComment(he)) {
            let Ne = E(ie, de(he)) ? E(ie, je(he), { backwards: !0 }) ? c : p : " ";
            ce.push(Ne);
          } else
            ce.push(c);
          let oe = C(ie, F(ie, de(he)));
          return oe !== !1 && E(ie, oe) && ce.push(c), ce;
        }
        function A(ee, pe) {
          let he = ee.getValue(), ce = v(ee, pe), { printer: xe, originalText: ie, locStart: je } = pe, de = xe.isBlockComment && xe.isBlockComment(he);
          if (E(ie, je(he), { backwards: !0 })) {
            let Ne = g(ie, he, je);
            return u([c, Ne ? c : "", ce]);
          }
          let oe = [" ", ce];
          return de || (oe = [u(oe), e]), oe;
        }
        function w(ee, pe, he, ce) {
          let xe = [], ie = ee.getValue();
          return !ie || !ie.comments || (ee.each(() => {
            let je = ee.getValue();
            !je.leading && !je.trailing && (!ce || ce(je)) && xe.push(v(ee, pe));
          }, "comments"), xe.length === 0) ? "" : he ? h(c, xe) : i([c, h(c, xe)]);
        }
        function I(ee, pe, he) {
          let ce = ee.getValue();
          if (!ce)
            return {};
          let xe = ce.comments || [];
          he && (xe = xe.filter((oe) => !he.has(oe)));
          let ie = ce === pe.cursorNode;
          if (xe.length === 0) {
            let oe = ie ? D : "";
            return { leading: oe, trailing: oe };
          }
          let je = [], de = [];
          return ee.each(() => {
            let oe = ee.getValue();
            if (he && he.has(oe))
              return;
            let { leading: Ne, trailing: Je } = oe;
            Ne ? je.push(l(ee, pe)) : Je && de.push(A(ee, pe));
          }, "comments"), ie && (je.unshift(D), de.push(D)), { leading: je, trailing: de };
        }
        function O(ee, pe, he, ce) {
          let { leading: xe, trailing: ie } = I(ee, he, ce);
          return !xe && !ie ? pe : [xe, pe, ie];
        }
        function M(ee) {
          if (ee)
            for (let pe of ee) {
              if (!pe.printed)
                throw new Error('Comment "' + pe.value.trim() + '" was not printed. Please report this error!');
              delete pe.printed;
            }
        }
        m.exports = { attach: Q, printComments: O, printCommentsSeparately: I, printDanglingComments: w, getSortedChildNodes: B, ensureAllCommentsPrinted: M };
      } }), fu = Ce({ "src/common/ast-path.js"(o, m) {
        Be();
        var t = dn();
        function p(i, u) {
          let h = c(i.stack, u);
          return h === -1 ? null : i.stack[h];
        }
        function c(i, u) {
          for (let h = i.length - 1; h >= 0; h -= 2) {
            let D = i[h];
            if (D && !Array.isArray(D) && --u < 0)
              return h;
          }
          return -1;
        }
        var e = class {
          constructor(i) {
            this.stack = [i];
          }
          getName() {
            let { stack: i } = this, { length: u } = i;
            return u > 1 ? i[u - 2] : null;
          }
          getValue() {
            return t(this.stack);
          }
          getNode() {
            let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
            return p(this, i);
          }
          getParentNode() {
            let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
            return p(this, i + 1);
          }
          call(i) {
            let { stack: u } = this, { length: h } = u, D = t(u);
            for (var E = arguments.length, C = new Array(E > 1 ? E - 1 : 0), F = 1; F < E; F++)
              C[F - 1] = arguments[F];
            for (let b of C)
              D = D[b], u.push(b, D);
            let g = i(this);
            return u.length = h, g;
          }
          callParent(i) {
            let u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, h = c(this.stack, u + 1), D = this.stack.splice(h + 1), E = i(this);
            return this.stack.push(...D), E;
          }
          each(i) {
            let { stack: u } = this, { length: h } = u, D = t(u);
            for (var E = arguments.length, C = new Array(E > 1 ? E - 1 : 0), F = 1; F < E; F++)
              C[F - 1] = arguments[F];
            for (let g of C)
              D = D[g], u.push(g, D);
            for (let g = 0; g < D.length; ++g)
              u.push(g, D[g]), i(this, g, D), u.length -= 2;
            u.length = h;
          }
          map(i) {
            let u = [];
            for (var h = arguments.length, D = new Array(h > 1 ? h - 1 : 0), E = 1; E < h; E++)
              D[E - 1] = arguments[E];
            return this.each((C, F, g) => {
              u[F] = i(C, F, g);
            }, ...D), u;
          }
          try(i) {
            let { stack: u } = this, h = [...u];
            try {
              return i();
            } finally {
              u.length = 0, u.push(...h);
            }
          }
          match() {
            let i = this.stack.length - 1, u = null, h = this.stack[i--];
            for (var D = arguments.length, E = new Array(D), C = 0; C < D; C++)
              E[C] = arguments[C];
            for (let F of E) {
              if (h === void 0)
                return !1;
              let g = null;
              if (typeof u == "number" && (g = u, u = this.stack[i--], h = this.stack[i--]), F && !F(h, u, g))
                return !1;
              u = this.stack[i--], h = this.stack[i--];
            }
            return !0;
          }
          findAncestor(i) {
            let u = this.stack.length - 1, h = null, D = this.stack[u--];
            for (; D; ) {
              let E = null;
              if (typeof h == "number" && (E = h, h = this.stack[u--], D = this.stack[u--]), h !== null && i(D, h, E))
                return D;
              h = this.stack[u--], D = this.stack[u--];
            }
          }
        };
        m.exports = e;
      } }), So = Ce({ "src/main/multiparser.js"(o, m) {
        Be();
        var { utils: { stripTrailingHardline: t } } = sr(), { normalize: p } = En(), c = tn();
        function e(u, h, D, E) {
          if (D.printer.embed && D.embeddedLanguageFormatting === "auto")
            return D.printer.embed(u, h, (C, F, g) => i(C, F, D, E, g), D);
        }
        function i(u, h, D, E) {
          let { stripTrailingHardline: C = !1 } = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {}, F = p(Object.assign(Object.assign(Object.assign({}, D), h), {}, { parentParser: D.parser, originalText: u }), { passThrough: !0 }), g = vi().parse(u, F), { ast: b } = g;
          u = g.text;
          let T = b.comments;
          delete b.comments, c.attach(T, b, u, F), F[Symbol.for("comments")] = T || [], F[Symbol.for("tokens")] = b.tokens || [];
          let G = E(b, F);
          return c.ensureAllCommentsPrinted(T), C ? typeof G == "string" ? G.replace(/(?:\r?\n)*$/, "") : t(G) : G;
        }
        m.exports = { printSubtree: e };
      } }), To = Ce({ "src/main/ast-to-doc.js"(o, m) {
        Be();
        var t = fu(), { builders: { hardline: p, addAlignmentToDoc: c }, utils: { propagateBreaks: e } } = sr(), { printComments: i } = tn(), u = So();
        function h(C, F) {
          let g = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, { printer: b } = F;
          b.preprocess && (C = b.preprocess(C, F));
          let T = /* @__PURE__ */ new Map(), G = new t(C), W = B();
          return g > 0 && (W = c([p, W], g, F.tabWidth)), e(W), W;
          function B(U, Q) {
            return U === void 0 || U === G ? _(Q) : Array.isArray(U) ? G.call(() => _(Q), ...U) : G.call(() => _(Q), U);
          }
          function _(U) {
            let Q = G.getValue(), H = Q && typeof Q == "object" && U === void 0;
            if (H && T.has(Q))
              return T.get(Q);
            let ge = E(G, F, B, U);
            return H && T.set(Q, ge), ge;
          }
        }
        function D(C, F) {
          let { originalText: g, [Symbol.for("comments")]: b, locStart: T, locEnd: G } = F, W = T(C), B = G(C), _ = /* @__PURE__ */ new Set();
          for (let U of b)
            T(U) >= W && G(U) <= B && (U.printed = !0, _.add(U));
          return { doc: g.slice(W, B), printedComments: _ };
        }
        function E(C, F, g, b) {
          let T = C.getValue(), { printer: G } = F, W, B;
          if (G.hasPrettierIgnore && G.hasPrettierIgnore(C))
            ({ doc: W, printedComments: B } = D(T, F));
          else {
            if (T)
              try {
                W = u.printSubtree(C, g, F, h);
              } catch (_) {
                if (globalThis.PRETTIER_DEBUG)
                  throw _;
              }
            W || (W = G.print(C, F, g, b));
          }
          return (!G.willPrintOwnComments || !G.willPrintOwnComments(C, F)) && (W = i(C, W, F, B)), W;
        }
        m.exports = h;
      } }), ko = Ce({ "src/main/range-util.js"(o, m) {
        Be();
        var t = Ui(), p = tn(), c = (b) => {
          let { parser: T } = b;
          return T === "json" || T === "json5" || T === "json-stringify";
        };
        function e(b, T) {
          let G = [b.node, ...b.parentNodes], W = /* @__PURE__ */ new Set([T.node, ...T.parentNodes]);
          return G.find((B) => E.has(B.type) && W.has(B));
        }
        function i(b) {
          let T = b.length - 1;
          for (; ; ) {
            let G = b[T];
            if (G && (G.type === "Program" || G.type === "File"))
              T--;
            else
              break;
          }
          return b.slice(0, T + 1);
        }
        function u(b, T, G) {
          let { locStart: W, locEnd: B } = G, _ = b.node, U = T.node;
          if (_ === U)
            return { startNode: _, endNode: U };
          let Q = W(b.node);
          for (let ge of i(T.parentNodes))
            if (W(ge) >= Q)
              U = ge;
            else
              break;
          let H = B(T.node);
          for (let ge of i(b.parentNodes)) {
            if (B(ge) <= H)
              _ = ge;
            else
              break;
            if (_ === U)
              break;
          }
          return { startNode: _, endNode: U };
        }
        function h(b, T, G, W) {
          let B = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [], _ = arguments.length > 5 ? arguments[5] : void 0, { locStart: U, locEnd: Q } = G, H = U(b), ge = Q(b);
          if (!(T > ge || T < H || _ === "rangeEnd" && T === H || _ === "rangeStart" && T === ge)) {
            for (let y of p.getSortedChildNodes(b, G)) {
              let R = h(y, T, G, W, [b, ...B], _);
              if (R)
                return R;
            }
            if (!W || W(b, B[0]))
              return { node: b, parentNodes: B };
          }
        }
        function D(b, T) {
          return T !== "DeclareExportDeclaration" && b !== "TypeParameterDeclaration" && (b === "Directive" || b === "TypeAlias" || b === "TSExportAssignment" || b.startsWith("Declare") || b.startsWith("TSDeclare") || b.endsWith("Statement") || b.endsWith("Declaration"));
        }
        var E = /* @__PURE__ */ new Set(["ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "NullLiteral", "UnaryExpression", "TemplateLiteral"]), C = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefinition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinition", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionTypeDefinition", "ScalarTypeDefinition"]);
        function F(b, T, G) {
          if (!T)
            return !1;
          switch (b.parser) {
            case "flow":
            case "babel":
            case "babel-flow":
            case "babel-ts":
            case "typescript":
            case "acorn":
            case "espree":
            case "meriyah":
            case "__babel_estree":
              return D(T.type, G && G.type);
            case "json":
            case "json5":
            case "json-stringify":
              return E.has(T.type);
            case "graphql":
              return C.has(T.kind);
            case "vue":
              return T.tag !== "root";
          }
          return !1;
        }
        function g(b, T, G) {
          let { rangeStart: W, rangeEnd: B, locStart: _, locEnd: U } = T;
          t.ok(B > W);
          let Q = b.slice(W, B).search(/\S/), H = Q === -1;
          if (!H)
            for (W += Q; B > W && !/\S/.test(b[B - 1]); --B)
              ;
          let ge = h(G, W, T, (S, l) => F(T, S, l), [], "rangeStart"), y = H ? ge : h(G, B, T, (S) => F(T, S), [], "rangeEnd");
          if (!ge || !y)
            return { rangeStart: 0, rangeEnd: 0 };
          let R, v;
          if (c(T)) {
            let S = e(ge, y);
            R = S, v = S;
          } else
            ({ startNode: R, endNode: v } = u(ge, y, T));
          return { rangeStart: Math.min(_(R), _(v)), rangeEnd: Math.max(U(R), U(v)) };
        }
        m.exports = { calculateRange: g, findNodeAtOffset: h };
      } }), Bo = Ce({ "src/main/core.js"(o, m) {
        Be();
        var { diffArrays: t } = Mi(), { printer: { printDocToString: p }, debug: { printDocToDebug: c } } = sr(), { getAlignmentSize: e } = yr(), { guessEndOfLine: i, convertEndOfLineToChars: u, countEndOfLineChars: h, normalizeEndOfLine: D } = hi(), E = En().normalize, C = _s(), F = tn(), g = vi(), b = To(), T = ko(), G = "\uFEFF", W = Symbol("cursor");
        function B(v, S, l) {
          let A = S.comments;
          return A && (delete S.comments, F.attach(A, S, v, l)), l[Symbol.for("comments")] = A || [], l[Symbol.for("tokens")] = S.tokens || [], l.originalText = v, A;
        }
        function _(v, S) {
          let l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
          if (!v || v.trim().length === 0)
            return { formatted: "", cursorOffset: -1, comments: [] };
          let { ast: A, text: w } = g.parse(v, S);
          if (S.cursorOffset >= 0) {
            let ee = T.findNodeAtOffset(A, S.cursorOffset, S);
            ee && ee.node && (S.cursorNode = ee.node);
          }
          let I = B(w, A, S), O = b(A, S, l), M = p(O, S);
          if (F.ensureAllCommentsPrinted(I), l > 0) {
            let ee = M.formatted.trim();
            M.cursorNodeStart !== void 0 && (M.cursorNodeStart -= M.formatted.indexOf(ee)), M.formatted = ee + u(S.endOfLine);
          }
          if (S.cursorOffset >= 0) {
            let ee, pe, he, ce, xe;
            if (S.cursorNode && M.cursorNodeText ? (ee = S.locStart(S.cursorNode), pe = w.slice(ee, S.locEnd(S.cursorNode)), he = S.cursorOffset - ee, ce = M.cursorNodeStart, xe = M.cursorNodeText) : (ee = 0, pe = w, he = S.cursorOffset, ce = 0, xe = M.formatted), pe === xe)
              return { formatted: M.formatted, cursorOffset: ce + he, comments: I };
            let ie = [...pe];
            ie.splice(he, 0, W);
            let je = [...xe], de = t(ie, je), oe = ce;
            for (let Ne of de)
              if (Ne.removed) {
                if (Ne.value.includes(W))
                  break;
              } else
                oe += Ne.count;
            return { formatted: M.formatted, cursorOffset: oe, comments: I };
          }
          return { formatted: M.formatted, cursorOffset: -1, comments: I };
        }
        function U(v, S) {
          let { ast: l, text: A } = g.parse(v, S), { rangeStart: w, rangeEnd: I } = T.calculateRange(A, S, l), O = A.slice(w, I), M = Math.min(w, A.lastIndexOf(`
`, w) + 1), ee = A.slice(M, w).match(/^\s*/)[0], pe = e(ee, S.tabWidth), he = _(O, Object.assign(Object.assign({}, S), {}, { rangeStart: 0, rangeEnd: Number.POSITIVE_INFINITY, cursorOffset: S.cursorOffset > w && S.cursorOffset <= I ? S.cursorOffset - w : -1, endOfLine: "lf" }), pe), ce = he.formatted.trimEnd(), { cursorOffset: xe } = S;
          xe > I ? xe += ce.length - O.length : he.cursorOffset >= 0 && (xe = he.cursorOffset + w);
          let ie = A.slice(0, w) + ce + A.slice(I);
          if (S.endOfLine !== "lf") {
            let je = u(S.endOfLine);
            xe >= 0 && je === `\r
` && (xe += h(ie.slice(0, xe), `
`)), ie = ie.replace(/\n/g, je);
          }
          return { formatted: ie, cursorOffset: xe, comments: he.comments };
        }
        function Q(v, S, l) {
          return typeof S != "number" || Number.isNaN(S) || S < 0 || S > v.length ? l : S;
        }
        function H(v, S) {
          let { cursorOffset: l, rangeStart: A, rangeEnd: w } = S;
          return l = Q(v, l, -1), A = Q(v, A, 0), w = Q(v, w, v.length), Object.assign(Object.assign({}, S), {}, { cursorOffset: l, rangeStart: A, rangeEnd: w });
        }
        function ge(v, S) {
          let { cursorOffset: l, rangeStart: A, rangeEnd: w, endOfLine: I } = H(v, S), O = v.charAt(0) === G;
          if (O && (v = v.slice(1), l--, A--, w--), I === "auto" && (I = i(v)), v.includes("\r")) {
            let M = (ee) => h(v.slice(0, Math.max(ee, 0)), `\r
`);
            l -= M(l), A -= M(A), w -= M(w), v = D(v);
          }
          return { hasBOM: O, text: v, options: H(v, Object.assign(Object.assign({}, S), {}, { cursorOffset: l, rangeStart: A, rangeEnd: w, endOfLine: I })) };
        }
        function y(v, S) {
          let l = g.resolveParser(S);
          return !l.hasPragma || l.hasPragma(v);
        }
        function R(v, S) {
          let { hasBOM: l, text: A, options: w } = ge(v, E(S));
          if (w.rangeStart >= w.rangeEnd && A !== "" || w.requirePragma && !y(A, w))
            return { formatted: v, cursorOffset: S.cursorOffset, comments: [] };
          let I;
          return w.rangeStart > 0 || w.rangeEnd < A.length ? I = U(A, w) : (!w.requirePragma && w.insertPragma && w.printer.insertPragma && !y(A, w) && (A = w.printer.insertPragma(A)), I = _(A, w)), l && (I.formatted = G + I.formatted, I.cursorOffset >= 0 && I.cursorOffset++), I;
        }
        m.exports = { formatWithCursor: R, parse(v, S, l) {
          let { text: A, options: w } = ge(v, E(S)), I = g.parse(A, w);
          return l && (I.ast = C(I.ast, w)), I;
        }, formatAST(v, S) {
          S = E(S);
          let l = b(v, S);
          return p(l, S);
        }, formatDoc(v, S) {
          return R(c(v), Object.assign(Object.assign({}, S), {}, { parser: "__js_expression" })).formatted;
        }, printToDoc(v, S) {
          S = E(S);
          let { ast: l, text: A } = g.parse(v, S);
          return B(A, l, S), b(l, S);
        }, printDocToString(v, S) {
          return p(v, E(S));
        } };
      } }), No = Ce({ "src/common/util-shared.js"(o, m) {
        Be();
        var { getMaxContinuousCount: t, getStringWidth: p, getAlignmentSize: c, getIndentSize: e, skip: i, skipWhitespace: u, skipSpaces: h, skipNewline: D, skipToLineEnd: E, skipEverythingButNewLine: C, skipInlineComment: F, skipTrailingComment: g, hasNewline: b, hasNewlineInRange: T, hasSpaces: G, isNextLineEmpty: W, isNextLineEmptyAfterIndex: B, isPreviousLineEmpty: _, getNextNonSpaceNonCommentCharacterIndex: U, makeString: Q, addLeadingComment: H, addDanglingComment: ge, addTrailingComment: y } = yr();
        m.exports = { getMaxContinuousCount: t, getStringWidth: p, getAlignmentSize: c, getIndentSize: e, skip: i, skipWhitespace: u, skipSpaces: h, skipNewline: D, skipToLineEnd: E, skipEverythingButNewLine: C, skipInlineComment: F, skipTrailingComment: g, hasNewline: b, hasNewlineInRange: T, hasSpaces: G, isNextLineEmpty: W, isNextLineEmptyAfterIndex: B, isPreviousLineEmpty: _, getNextNonSpaceNonCommentCharacterIndex: U, makeString: Q, addLeadingComment: H, addDanglingComment: ge, addTrailingComment: y };
      } }), bi = Ce({ "src/utils/create-language.js"(o, m) {
        Be(), m.exports = function(t, p) {
          let { languageId: c } = t, e = at(t, Ge);
          return Object.assign(Object.assign({ linguistLanguageId: c }, e), p(t));
        };
      } }), jo = Ce({ "node_modules/esutils/lib/ast.js"(o, m) {
        Be(), function() {
          function t(h) {
            if (h == null)
              return !1;
            switch (h.type) {
              case "ArrayExpression":
              case "AssignmentExpression":
              case "BinaryExpression":
              case "CallExpression":
              case "ConditionalExpression":
              case "FunctionExpression":
              case "Identifier":
              case "Literal":
              case "LogicalExpression":
              case "MemberExpression":
              case "NewExpression":
              case "ObjectExpression":
              case "SequenceExpression":
              case "ThisExpression":
              case "UnaryExpression":
              case "UpdateExpression":
                return !0;
            }
            return !1;
          }
          function p(h) {
            if (h == null)
              return !1;
            switch (h.type) {
              case "DoWhileStatement":
              case "ForInStatement":
              case "ForStatement":
              case "WhileStatement":
                return !0;
            }
            return !1;
          }
          function c(h) {
            if (h == null)
              return !1;
            switch (h.type) {
              case "BlockStatement":
              case "BreakStatement":
              case "ContinueStatement":
              case "DebuggerStatement":
              case "DoWhileStatement":
              case "EmptyStatement":
              case "ExpressionStatement":
              case "ForInStatement":
              case "ForStatement":
              case "IfStatement":
              case "LabeledStatement":
              case "ReturnStatement":
              case "SwitchStatement":
              case "ThrowStatement":
              case "TryStatement":
              case "VariableDeclaration":
              case "WhileStatement":
              case "WithStatement":
                return !0;
            }
            return !1;
          }
          function e(h) {
            return c(h) || h != null && h.type === "FunctionDeclaration";
          }
          function i(h) {
            switch (h.type) {
              case "IfStatement":
                return h.alternate != null ? h.alternate : h.consequent;
              case "LabeledStatement":
              case "ForStatement":
              case "ForInStatement":
              case "WhileStatement":
              case "WithStatement":
                return h.body;
            }
            return null;
          }
          function u(h) {
            var D;
            if (h.type !== "IfStatement" || h.alternate == null)
              return !1;
            D = h.consequent;
            do {
              if (D.type === "IfStatement" && D.alternate == null)
                return !0;
              D = i(D);
            } while (D);
            return !1;
          }
          m.exports = { isExpression: t, isStatement: c, isIterationStatement: p, isSourceElement: e, isProblematicIfStatement: u, trailingStatement: i };
        }();
      } }), Is = Ce({ "node_modules/esutils/lib/code.js"(o, m) {
        Be(), function() {
          var t, p, c, e, i, u;
          p = { NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/ }, t = { NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/, NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/ };
          function h(B) {
            return 48 <= B && B <= 57;
          }
          function D(B) {
            return 48 <= B && B <= 57 || 97 <= B && B <= 102 || 65 <= B && B <= 70;
          }
          function E(B) {
            return B >= 48 && B <= 55;
          }
          c = [5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279];
          function C(B) {
            return B === 32 || B === 9 || B === 11 || B === 12 || B === 160 || B >= 5760 && c.indexOf(B) >= 0;
          }
          function F(B) {
            return B === 10 || B === 13 || B === 8232 || B === 8233;
          }
          function g(B) {
            if (B <= 65535)
              return String.fromCharCode(B);
            var _ = String.fromCharCode(Math.floor((B - 65536) / 1024) + 55296), U = String.fromCharCode((B - 65536) % 1024 + 56320);
            return _ + U;
          }
          for (e = new Array(128), u = 0; u < 128; ++u)
            e[u] = u >= 97 && u <= 122 || u >= 65 && u <= 90 || u === 36 || u === 95;
          for (i = new Array(128), u = 0; u < 128; ++u)
            i[u] = u >= 97 && u <= 122 || u >= 65 && u <= 90 || u >= 48 && u <= 57 || u === 36 || u === 95;
          function b(B) {
            return B < 128 ? e[B] : p.NonAsciiIdentifierStart.test(g(B));
          }
          function T(B) {
            return B < 128 ? i[B] : p.NonAsciiIdentifierPart.test(g(B));
          }
          function G(B) {
            return B < 128 ? e[B] : t.NonAsciiIdentifierStart.test(g(B));
          }
          function W(B) {
            return B < 128 ? i[B] : t.NonAsciiIdentifierPart.test(g(B));
          }
          m.exports = { isDecimalDigit: h, isHexDigit: D, isOctalDigit: E, isWhiteSpace: C, isLineTerminator: F, isIdentifierStartES5: b, isIdentifierPartES5: T, isIdentifierStartES6: G, isIdentifierPartES6: W };
        }();
      } }), Po = Ce({ "node_modules/esutils/lib/keyword.js"(o, m) {
        Be(), function() {
          var t = Is();
          function p(b) {
            switch (b) {
              case "implements":
              case "interface":
              case "package":
              case "private":
              case "protected":
              case "public":
              case "static":
              case "let":
                return !0;
              default:
                return !1;
            }
          }
          function c(b, T) {
            return !T && b === "yield" ? !1 : e(b, T);
          }
          function e(b, T) {
            if (T && p(b))
              return !0;
            switch (b.length) {
              case 2:
                return b === "if" || b === "in" || b === "do";
              case 3:
                return b === "var" || b === "for" || b === "new" || b === "try";
              case 4:
                return b === "this" || b === "else" || b === "case" || b === "void" || b === "with" || b === "enum";
              case 5:
                return b === "while" || b === "break" || b === "catch" || b === "throw" || b === "const" || b === "yield" || b === "class" || b === "super";
              case 6:
                return b === "return" || b === "typeof" || b === "delete" || b === "switch" || b === "export" || b === "import";
              case 7:
                return b === "default" || b === "finally" || b === "extends";
              case 8:
                return b === "function" || b === "continue" || b === "debugger";
              case 10:
                return b === "instanceof";
              default:
                return !1;
            }
          }
          function i(b, T) {
            return b === "null" || b === "true" || b === "false" || c(b, T);
          }
          function u(b, T) {
            return b === "null" || b === "true" || b === "false" || e(b, T);
          }
          function h(b) {
            return b === "eval" || b === "arguments";
          }
          function D(b) {
            var T, G, W;
            if (b.length === 0 || (W = b.charCodeAt(0), !t.isIdentifierStartES5(W)))
              return !1;
            for (T = 1, G = b.length; T < G; ++T)
              if (W = b.charCodeAt(T), !t.isIdentifierPartES5(W))
                return !1;
            return !0;
          }
          function E(b, T) {
            return (b - 55296) * 1024 + (T - 56320) + 65536;
          }
          function C(b) {
            var T, G, W, B, _;
            if (b.length === 0)
              return !1;
            for (_ = t.isIdentifierStartES6, T = 0, G = b.length; T < G; ++T) {
              if (W = b.charCodeAt(T), 55296 <= W && W <= 56319) {
                if (++T, T >= G || (B = b.charCodeAt(T), !(56320 <= B && B <= 57343)))
                  return !1;
                W = E(W, B);
              }
              if (!_(W))
                return !1;
              _ = t.isIdentifierPartES6;
            }
            return !0;
          }
          function F(b, T) {
            return D(b) && !i(b, T);
          }
          function g(b, T) {
            return C(b) && !u(b, T);
          }
          m.exports = { isKeywordES5: c, isKeywordES6: e, isReservedWordES5: i, isReservedWordES6: u, isRestrictedWord: h, isIdentifierNameES5: D, isIdentifierNameES6: C, isIdentifierES5: F, isIdentifierES6: g };
        }();
      } }), _o = Ce({ "node_modules/esutils/lib/utils.js"(o) {
        Be(), function() {
          o.ast = jo(), o.code = Is(), o.keyword = Po();
        }();
      } }), Gi = Ce({ "src/language-js/utils/is-block-comment.js"(o, m) {
        Be();
        var t = /* @__PURE__ */ new Set(["Block", "CommentBlock", "MultiLine"]), p = (c) => t.has(c == null ? void 0 : c.type);
        m.exports = p;
      } }), Fa = Ce({ "src/language-js/utils/is-node-matches.js"(o, m) {
        Be();
        function t(c, e) {
          let i = e.split(".");
          for (let u = i.length - 1; u >= 0; u--) {
            let h = i[u];
            if (u === 0)
              return c.type === "Identifier" && c.name === h;
            if (c.type !== "MemberExpression" || c.optional || c.computed || c.property.type !== "Identifier" || c.property.name !== h)
              return !1;
            c = c.object;
          }
        }
        function p(c, e) {
          return e.some((i) => t(c, i));
        }
        m.exports = p;
      } }), Vr = Ce({ "src/language-js/utils/index.js"(o, m) {
        Be();
        var t = _o().keyword.isIdentifierNameES5, { getLast: p, hasNewline: c, skipWhitespace: e, isNonEmptyArray: i, isNextLineEmptyAfterIndex: u, getStringWidth: h } = yr(), { locStart: D, locEnd: E, hasSameLocStart: C } = Dn(), F = Gi(), g = Fa(), b = "(?:(?=.)\\s)", T = new RegExp(`^${b}*:`), G = new RegExp(`^${b}*::`);
        function W(se) {
          var ot, Xt;
          return ((ot = se.extra) === null || ot === void 0 ? void 0 : ot.parenthesized) && F((Xt = se.trailingComments) === null || Xt === void 0 ? void 0 : Xt[0]) && T.test(se.trailingComments[0].value);
        }
        function B(se) {
          let ot = se == null ? void 0 : se[0];
          return F(ot) && G.test(ot.value);
        }
        function _(se, ot) {
          if (!se || typeof se != "object")
            return !1;
          if (Array.isArray(se))
            return se.some((kr) => _(kr, ot));
          let Xt = ot(se);
          return typeof Xt == "boolean" ? Xt : Object.values(se).some((kr) => _(kr, ot));
        }
        function U(se) {
          return se.type === "AssignmentExpression" || se.type === "BinaryExpression" || se.type === "LogicalExpression" || se.type === "NGPipeExpression" || se.type === "ConditionalExpression" || Qe(se) || Ze(se) || se.type === "SequenceExpression" || se.type === "TaggedTemplateExpression" || se.type === "BindExpression" || se.type === "UpdateExpression" && !se.prefix || Hn(se) || se.type === "TSNonNullExpression";
        }
        function Q(se) {
          var ot, Xt, kr, Br, $n, Qr;
          return se.expressions ? se.expressions[0] : (ot = (Xt = (kr = (Br = ($n = (Qr = se.left) !== null && Qr !== void 0 ? Qr : se.test) !== null && $n !== void 0 ? $n : se.callee) !== null && Br !== void 0 ? Br : se.object) !== null && kr !== void 0 ? kr : se.tag) !== null && Xt !== void 0 ? Xt : se.argument) !== null && ot !== void 0 ? ot : se.expression;
        }
        function H(se, ot) {
          if (ot.expressions)
            return ["expressions", 0];
          if (ot.left)
            return ["left"];
          if (ot.test)
            return ["test"];
          if (ot.object)
            return ["object"];
          if (ot.callee)
            return ["callee"];
          if (ot.tag)
            return ["tag"];
          if (ot.argument)
            return ["argument"];
          if (ot.expression)
            return ["expression"];
          throw new Error("Unexpected node has no left side.");
        }
        function ge(se) {
          return se = new Set(se), (ot) => se.has(ot == null ? void 0 : ot.type);
        }
        var y = ge(["Line", "CommentLine", "SingleLine", "HashbangComment", "HTMLOpen", "HTMLClose"]), R = ge(["ExportDefaultDeclaration", "ExportDefaultSpecifier", "DeclareExportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"]);
        function v(se) {
          let ot = se.getParentNode();
          return se.getName() === "declaration" && R(ot) ? ot : null;
        }
        var S = ge(["BooleanLiteral", "DirectiveLiteral", "Literal", "NullLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "RegExpLiteral", "StringLiteral", "TemplateLiteral", "TSTypeLiteral", "JSXText"]);
        function l(se) {
          return se.type === "NumericLiteral" || se.type === "Literal" && typeof se.value == "number";
        }
        function A(se) {
          return se.type === "UnaryExpression" && (se.operator === "+" || se.operator === "-") && l(se.argument);
        }
        function w(se) {
          return se.type === "StringLiteral" || se.type === "Literal" && typeof se.value == "string";
        }
        var I = ge(["ObjectTypeAnnotation", "TSTypeLiteral", "TSMappedType"]), O = ge(["FunctionExpression", "ArrowFunctionExpression"]);
        function M(se) {
          return se.type === "FunctionExpression" || se.type === "ArrowFunctionExpression" && se.body.type === "BlockStatement";
        }
        function ee(se) {
          return Qe(se) && se.callee.type === "Identifier" && ["async", "inject", "fakeAsync", "waitForAsync"].includes(se.callee.name);
        }
        var pe = ge(["JSXElement", "JSXFragment"]);
        function he(se, ot) {
          if (se.parentParser !== "markdown" && se.parentParser !== "mdx")
            return !1;
          let Xt = ot.getNode();
          if (!Xt.expression || !pe(Xt.expression))
            return !1;
          let kr = ot.getParentNode();
          return kr.type === "Program" && kr.body.length === 1;
        }
        function ce(se) {
          return se.kind === "get" || se.kind === "set";
        }
        function xe(se) {
          return ce(se) || C(se, se.value);
        }
        function ie(se) {
          return (se.type === "ObjectTypeProperty" || se.type === "ObjectTypeInternalSlot") && se.value.type === "FunctionTypeAnnotation" && !se.static && !xe(se);
        }
        function je(se) {
          return (se.type === "TypeAnnotation" || se.type === "TSTypeAnnotation") && se.typeAnnotation.type === "FunctionTypeAnnotation" && !se.static && !C(se, se.typeAnnotation);
        }
        var de = ge(["BinaryExpression", "LogicalExpression", "NGPipeExpression"]);
        function oe(se) {
          return Ze(se) || se.type === "BindExpression" && Boolean(se.object);
        }
        var Ne = /* @__PURE__ */ new Set(["AnyTypeAnnotation", "TSAnyKeyword", "NullLiteralTypeAnnotation", "TSNullKeyword", "ThisTypeAnnotation", "TSThisType", "NumberTypeAnnotation", "TSNumberKeyword", "VoidTypeAnnotation", "TSVoidKeyword", "BooleanTypeAnnotation", "TSBooleanKeyword", "BigIntTypeAnnotation", "TSBigIntKeyword", "SymbolTypeAnnotation", "TSSymbolKeyword", "StringTypeAnnotation", "TSStringKeyword", "BooleanLiteralTypeAnnotation", "StringLiteralTypeAnnotation", "BigIntLiteralTypeAnnotation", "NumberLiteralTypeAnnotation", "TSLiteralType", "TSTemplateLiteralType", "EmptyTypeAnnotation", "MixedTypeAnnotation", "TSNeverKeyword", "TSObjectKeyword", "TSUndefinedKeyword", "TSUnknownKeyword"]);
        function Je(se) {
          return se ? !!((se.type === "GenericTypeAnnotation" || se.type === "TSTypeReference") && !se.typeParameters || Ne.has(se.type)) : !1;
        }
        function _e(se) {
          let ot = /^(?:before|after)(?:Each|All)$/;
          return se.callee.type === "Identifier" && ot.test(se.callee.name) && se.arguments.length === 1;
        }
        var it = ["it", "it.only", "it.skip", "describe", "describe.only", "describe.skip", "test", "test.only", "test.skip", "test.step", "test.describe", "test.describe.only", "test.describe.parallel", "test.describe.parallel.only", "test.describe.serial", "test.describe.serial.only", "skip", "xit", "xdescribe", "xtest", "fit", "fdescribe", "ftest"];
        function me(se) {
          return g(se, it);
        }
        function Se(se, ot) {
          if (se.type !== "CallExpression")
            return !1;
          if (se.arguments.length === 1) {
            if (ee(se) && ot && Se(ot))
              return O(se.arguments[0]);
            if (_e(se))
              return ee(se.arguments[0]);
          } else if ((se.arguments.length === 2 || se.arguments.length === 3) && (se.arguments[0].type === "TemplateLiteral" || w(se.arguments[0])) && me(se.callee))
            return se.arguments[2] && !l(se.arguments[2]) ? !1 : (se.arguments.length === 2 ? O(se.arguments[1]) : M(se.arguments[1]) && bt(se.arguments[1]).length <= 1) || ee(se.arguments[1]);
          return !1;
        }
        var Qe = ge(["CallExpression", "OptionalCallExpression"]), Ze = ge(["MemberExpression", "OptionalMemberExpression"]);
        function kt(se) {
          let ot = "expressions";
          se.type === "TSTemplateLiteralType" && (ot = "types");
          let Xt = se[ot];
          return Xt.length === 0 ? !1 : Xt.every((kr) => {
            if (or(kr))
              return !1;
            if (kr.type === "Identifier" || kr.type === "ThisExpression")
              return !0;
            if (Ze(kr)) {
              let Br = kr;
              for (; Ze(Br); )
                if (Br.property.type !== "Identifier" && Br.property.type !== "Literal" && Br.property.type !== "StringLiteral" && Br.property.type !== "NumericLiteral" || (Br = Br.object, or(Br)))
                  return !1;
              return Br.type === "Identifier" || Br.type === "ThisExpression";
            }
            return !1;
          });
        }
        function ke(se, ot) {
          return se === "+" || se === "-" ? se + ot : ot;
        }
        function be(se, ot) {
          let Xt = D(ot), kr = e(se, E(ot));
          return kr !== !1 && se.slice(Xt, Xt + 2) === "/*" && se.slice(kr, kr + 2) === "*/";
        }
        function Oe(se, ot) {
          return pe(ot) ? gr(ot) : or(ot, Lt.Leading, (Xt) => c(se, E(Xt)));
        }
        function Re(se, ot) {
          return ot.parser !== "json" && w(se.key) && Xe(se.key).slice(1, -1) === se.key.value && (t(se.key.value) && !(ot.parser === "babel-ts" && se.type === "ClassProperty" || ot.parser === "typescript" && se.type === "PropertyDefinition") || ut(se.key.value) && String(Number(se.key.value)) === se.key.value && (ot.parser === "babel" || ot.parser === "acorn" || ot.parser === "espree" || ot.parser === "meriyah" || ot.parser === "__babel_estree"));
        }
        function ut(se) {
          return /^(?:\d+|\d+\.\d+)$/.test(se);
        }
        function ht(se, ot) {
          let Xt = /^[fx]?(?:describe|it|test)$/;
          return ot.type === "TaggedTemplateExpression" && ot.quasi === se && ot.tag.type === "MemberExpression" && ot.tag.property.type === "Identifier" && ot.tag.property.name === "each" && (ot.tag.object.type === "Identifier" && Xt.test(ot.tag.object.name) || ot.tag.object.type === "MemberExpression" && ot.tag.object.property.type === "Identifier" && (ot.tag.object.property.name === "only" || ot.tag.object.property.name === "skip") && ot.tag.object.object.type === "Identifier" && Xt.test(ot.tag.object.object.name));
        }
        function vt(se) {
          return se.quasis.some((ot) => ot.value.raw.includes(`
`));
        }
        function Ut(se, ot) {
          return (se.type === "TemplateLiteral" && vt(se) || se.type === "TaggedTemplateExpression" && vt(se.quasi)) && !c(ot, D(se), { backwards: !0 });
        }
        function Dr(se) {
          if (!or(se))
            return !1;
          let ot = p(Ke(se, Lt.Dangling));
          return ot && !F(ot);
        }
        function mr(se) {
          if (se.length <= 1)
            return !1;
          let ot = 0;
          for (let Xt of se)
            if (O(Xt)) {
              if (ot += 1, ot > 1)
                return !0;
            } else if (Qe(Xt)) {
              for (let kr of Xt.arguments)
                if (O(kr))
                  return !0;
            }
          return !1;
        }
        function Vt(se) {
          let ot = se.getValue(), Xt = se.getParentNode();
          return Qe(ot) && Qe(Xt) && Xt.callee === ot && ot.arguments.length > Xt.arguments.length && Xt.arguments.length > 0;
        }
        function Qt(se, ot) {
          if (ot >= 2)
            return !1;
          let Xt = (Qr) => Qt(Qr, ot + 1), kr = se.type === "Literal" && "regex" in se && se.regex.pattern || se.type === "RegExpLiteral" && se.pattern;
          if (kr && h(kr) > 5)
            return !1;
          if (se.type === "Literal" || se.type === "BigIntLiteral" || se.type === "DecimalLiteral" || se.type === "BooleanLiteral" || se.type === "NullLiteral" || se.type === "NumericLiteral" || se.type === "RegExpLiteral" || se.type === "StringLiteral" || se.type === "Identifier" || se.type === "ThisExpression" || se.type === "Super" || se.type === "PrivateName" || se.type === "PrivateIdentifier" || se.type === "ArgumentPlaceholder" || se.type === "Import")
            return !0;
          if (se.type === "TemplateLiteral")
            return se.quasis.every((Qr) => !Qr.value.raw.includes(`
`)) && se.expressions.every(Xt);
          if (se.type === "ObjectExpression")
            return se.properties.every((Qr) => !Qr.computed && (Qr.shorthand || Qr.value && Xt(Qr.value)));
          if (se.type === "ArrayExpression")
            return se.elements.every((Qr) => Qr === null || Xt(Qr));
          if (Fn(se))
            return (se.type === "ImportExpression" || Qt(se.callee, ot)) && Gr(se).every(Xt);
          if (Ze(se))
            return Qt(se.object, ot) && Qt(se.property, ot);
          let Br = { "!": !0, "-": !0, "+": !0, "~": !0 };
          if (se.type === "UnaryExpression" && Br[se.operator])
            return Qt(se.argument, ot);
          let $n = { "++": !0, "--": !0 };
          return se.type === "UpdateExpression" && $n[se.operator] ? Qt(se.argument, ot) : se.type === "TSNonNullExpression" ? Qt(se.expression, ot) : !1;
        }
        function Xe(se) {
          var ot, Xt;
          return (ot = (Xt = se.extra) === null || Xt === void 0 ? void 0 : Xt.raw) !== null && ot !== void 0 ? ot : se.raw;
        }
        function ye(se) {
          return se;
        }
        function tt(se) {
          return se.filepath && /\.tsx$/i.test(se.filepath);
        }
        function Te(se) {
          let ot = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "es5";
          return se.trailingComma === "es5" && ot === "es5" || se.trailingComma === "all" && (ot === "all" || ot === "es5");
        }
        function rt(se, ot) {
          switch (se.type) {
            case "BinaryExpression":
            case "LogicalExpression":
            case "AssignmentExpression":
            case "NGPipeExpression":
              return rt(se.left, ot);
            case "MemberExpression":
            case "OptionalMemberExpression":
              return rt(se.object, ot);
            case "TaggedTemplateExpression":
              return se.tag.type === "FunctionExpression" ? !1 : rt(se.tag, ot);
            case "CallExpression":
            case "OptionalCallExpression":
              return se.callee.type === "FunctionExpression" ? !1 : rt(se.callee, ot);
            case "ConditionalExpression":
              return rt(se.test, ot);
            case "UpdateExpression":
              return !se.prefix && rt(se.argument, ot);
            case "BindExpression":
              return se.object && rt(se.object, ot);
            case "SequenceExpression":
              return rt(se.expressions[0], ot);
            case "TSSatisfiesExpression":
            case "TSAsExpression":
            case "TSNonNullExpression":
              return rt(se.expression, ot);
            default:
              return ot(se);
          }
        }
        var jt = { "==": !0, "!=": !0, "===": !0, "!==": !0 }, Ct = { "*": !0, "/": !0, "%": !0 }, nt = { ">>": !0, ">>>": !0, "<<": !0 };
        function N(se, ot) {
          return !(Ue(ot) !== Ue(se) || se === "**" || jt[se] && jt[ot] || ot === "%" && Ct[se] || se === "%" && Ct[ot] || ot !== se && Ct[ot] && Ct[se] || nt[se] && nt[ot]);
        }
        var Fe = new Map([["|>"], ["??"], ["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"], ["**"]].flatMap((se, ot) => se.map((Xt) => [Xt, ot])));
        function Ue(se) {
          return Fe.get(se);
        }
        function yt(se) {
          return Boolean(nt[se]) || se === "|" || se === "^" || se === "&";
        }
        function Et(se) {
          var ot;
          if (se.rest)
            return !0;
          let Xt = bt(se);
          return ((ot = p(Xt)) === null || ot === void 0 ? void 0 : ot.type) === "RestElement";
        }
        var $t = /* @__PURE__ */ new WeakMap();
        function bt(se) {
          if ($t.has(se))
            return $t.get(se);
          let ot = [];
          return se.this && ot.push(se.this), Array.isArray(se.parameters) ? ot.push(...se.parameters) : Array.isArray(se.params) && ot.push(...se.params), se.rest && ot.push(se.rest), $t.set(se, ot), ot;
        }
        function Hr(se, ot) {
          let Xt = se.getValue(), kr = 0, Br = ($n) => ot($n, kr++);
          Xt.this && se.call(Br, "this"), Array.isArray(Xt.parameters) ? se.each(Br, "parameters") : Array.isArray(Xt.params) && se.each(Br, "params"), Xt.rest && se.call(Br, "rest");
        }
        var Ot = /* @__PURE__ */ new WeakMap();
        function Gr(se) {
          if (Ot.has(se))
            return Ot.get(se);
          let ot = se.arguments;
          return se.type === "ImportExpression" && (ot = [se.source], se.attributes && ot.push(se.attributes)), Ot.set(se, ot), ot;
        }
        function _t(se, ot) {
          let Xt = se.getValue();
          Xt.type === "ImportExpression" ? (se.call((kr) => ot(kr, 0), "source"), Xt.attributes && se.call((kr) => ot(kr, 1), "attributes")) : se.each(ot, "arguments");
        }
        function nr(se) {
          return se.value.trim() === "prettier-ignore" && !se.unignore;
        }
        function gr(se) {
          return se && (se.prettierIgnore || or(se, Lt.PrettierIgnore));
        }
        function Rr(se) {
          let ot = se.getValue();
          return gr(ot);
        }
        var Lt = { Leading: 1 << 1, Trailing: 1 << 2, Dangling: 1 << 3, Block: 1 << 4, Line: 1 << 5, PrettierIgnore: 1 << 6, First: 1 << 7, Last: 1 << 8 }, dr = (se, ot) => {
          if (typeof se == "function" && (ot = se, se = 0), se || ot)
            return (Xt, kr, Br) => !(se & Lt.Leading && !Xt.leading || se & Lt.Trailing && !Xt.trailing || se & Lt.Dangling && (Xt.leading || Xt.trailing) || se & Lt.Block && !F(Xt) || se & Lt.Line && !y(Xt) || se & Lt.First && kr !== 0 || se & Lt.Last && kr !== Br.length - 1 || se & Lt.PrettierIgnore && !nr(Xt) || ot && !ot(Xt));
        };
        function or(se, ot, Xt) {
          if (!i(se == null ? void 0 : se.comments))
            return !1;
          let kr = dr(ot, Xt);
          return kr ? se.comments.some(kr) : !0;
        }
        function Ke(se, ot, Xt) {
          if (!Array.isArray(se == null ? void 0 : se.comments))
            return [];
          let kr = dr(ot, Xt);
          return kr ? se.comments.filter(kr) : se.comments;
        }
        var Wn = (se, ot) => {
          let { originalText: Xt } = ot;
          return u(Xt, E(se));
        };
        function Fn(se) {
          return Qe(se) || se.type === "NewExpression" || se.type === "ImportExpression";
        }
        function Ar(se) {
          return se && (se.type === "ObjectProperty" || se.type === "Property" && !se.method && se.kind === "init");
        }
        function Sr(se) {
          return Boolean(se.__isUsingHackPipeline);
        }
        var Ur = Symbol("ifWithoutBlockAndSameLineComment");
        function Hn(se) {
          return se.type === "TSAsExpression" || se.type === "TSSatisfiesExpression";
        }
        m.exports = { getFunctionParameters: bt, iterateFunctionParametersPath: Hr, getCallArguments: Gr, iterateCallArgumentsPath: _t, hasRestParameter: Et, getLeftSide: Q, getLeftSidePathName: H, getParentExportDeclaration: v, getTypeScriptMappedTypeModifier: ke, hasFlowAnnotationComment: B, hasFlowShorthandAnnotationComment: W, hasLeadingOwnLineComment: Oe, hasNakedLeftSide: U, hasNode: _, hasIgnoreComment: Rr, hasNodeIgnoreComment: gr, identity: ye, isBinaryish: de, isCallLikeExpression: Fn, isEnabledHackPipeline: Sr, isLineComment: y, isPrettierIgnoreComment: nr, isCallExpression: Qe, isMemberExpression: Ze, isExportDeclaration: R, isFlowAnnotationComment: be, isFunctionCompositionArgs: mr, isFunctionNotation: xe, isFunctionOrArrowExpression: O, isGetterOrSetter: ce, isJestEachTemplateLiteral: ht, isJsxNode: pe, isLiteral: S, isLongCurriedCallExpression: Vt, isSimpleCallArgument: Qt, isMemberish: oe, isNumericLiteral: l, isSignedNumericLiteral: A, isObjectProperty: Ar, isObjectType: I, isObjectTypePropertyAFunction: ie, isSimpleType: Je, isSimpleNumber: ut, isSimpleTemplateLiteral: kt, isStringLiteral: w, isStringPropSafeToUnquote: Re, isTemplateOnItsOwnLine: Ut, isTestCall: Se, isTheOnlyJsxElementInMarkdown: he, isTSXFile: tt, isTypeAnnotationAFunction: je, isNextLineEmpty: Wn, needsHardlineAfterDanglingComment: Dr, rawText: Xe, shouldPrintComma: Te, isBitwiseOperator: yt, shouldFlatten: N, startsWithNoLookaheadToken: rt, getPrecedence: Ue, hasComment: or, getComments: Ke, CommentCheckFlags: Lt, markerForIfWithoutBlockAndSameLineComment: Ur, isTSTypeExpression: Hn };
      } }), zi = Ce({ "src/language-js/print/template-literal.js"(o, m) {
        Be();
        var t = dn(), { getStringWidth: p, getIndentSize: c } = yr(), { builders: { join: e, hardline: i, softline: u, group: h, indent: D, align: E, lineSuffixBoundary: C, addAlignmentToDoc: F }, printer: { printDocToString: g }, utils: { mapDoc: b } } = sr(), { isBinaryish: T, isJestEachTemplateLiteral: G, isSimpleTemplateLiteral: W, hasComment: B, isMemberExpression: _, isTSTypeExpression: U } = Vr();
        function Q(S, l, A) {
          let w = S.getValue();
          if (w.type === "TemplateLiteral" && G(w, S.getParentNode())) {
            let pe = H(S, A, l);
            if (pe)
              return pe;
          }
          let I = "expressions";
          w.type === "TSTemplateLiteralType" && (I = "types");
          let O = [], M = S.map(l, I), ee = W(w);
          return ee && (M = M.map((pe) => g(pe, Object.assign(Object.assign({}, A), {}, { printWidth: Number.POSITIVE_INFINITY })).formatted)), O.push(C, "`"), S.each((pe) => {
            let he = pe.getName();
            if (O.push(l()), he < M.length) {
              let { tabWidth: ce } = A, xe = pe.getValue(), ie = c(xe.value.raw, ce), je = M[he];
              if (!ee) {
                let oe = w[I][he];
                (B(oe) || _(oe) || oe.type === "ConditionalExpression" || oe.type === "SequenceExpression" || U(oe) || T(oe)) && (je = [D([u, je]), u]);
              }
              let de = ie === 0 && xe.value.raw.endsWith(`
`) ? E(Number.NEGATIVE_INFINITY, je) : F(je, ie, ce);
              O.push(h(["${", de, C, "}"]));
            }
          }, "quasis"), O.push("`"), O;
        }
        function H(S, l, A) {
          let w = S.getNode(), I = w.quasis[0].value.raw.trim().split(/\s*\|\s*/);
          if (I.length > 1 || I.some((O) => O.length > 0)) {
            l.__inJestEach = !0;
            let O = S.map(A, "expressions");
            l.__inJestEach = !1;
            let M = [], ee = O.map((ie) => "${" + g(ie, Object.assign(Object.assign({}, l), {}, { printWidth: Number.POSITIVE_INFINITY, endOfLine: "lf" })).formatted + "}"), pe = [{ hasLineBreak: !1, cells: [] }];
            for (let ie = 1; ie < w.quasis.length; ie++) {
              let je = t(pe), de = ee[ie - 1];
              je.cells.push(de), de.includes(`
`) && (je.hasLineBreak = !0), w.quasis[ie].value.raw.includes(`
`) && pe.push({ hasLineBreak: !1, cells: [] });
            }
            let he = Math.max(I.length, ...pe.map((ie) => ie.cells.length)), ce = Array.from({ length: he }).fill(0), xe = [{ cells: I }, ...pe.filter((ie) => ie.cells.length > 0)];
            for (let { cells: ie } of xe.filter((je) => !je.hasLineBreak))
              for (let [je, de] of ie.entries())
                ce[je] = Math.max(ce[je], p(de));
            return M.push(C, "`", D([i, e(i, xe.map((ie) => e(" | ", ie.cells.map((je, de) => ie.hasLineBreak ? je : je + " ".repeat(ce[de] - p(je))))))]), i, "`"), M;
          }
        }
        function ge(S, l) {
          let A = S.getValue(), w = l();
          return B(A) && (w = h([D([u, w]), u])), ["${", w, C, "}"];
        }
        function y(S, l) {
          return S.map((A) => ge(A, l), "expressions");
        }
        function R(S, l) {
          return b(S, (A) => typeof A == "string" ? l ? A.replace(/(\\*)`/g, "$1$1\\`") : v(A) : A);
        }
        function v(S) {
          return S.replace(/([\\`]|\${)/g, "\\$1");
        }
        m.exports = { printTemplateLiteral: Q, printTemplateExpressions: y, escapeTemplateCharacters: R, uncookTemplateElementValue: v };
      } }), Aa = Ce({ "src/language-js/embed/markdown.js"(o, m) {
        Be();
        var { builders: { indent: t, softline: p, literalline: c, dedentToRoot: e } } = sr(), { escapeTemplateCharacters: i } = zi();
        function u(D, E, C) {
          let F = D.getValue().quasis[0].value.raw.replace(/((?:\\\\)*)\\`/g, (G, W) => "\\".repeat(W.length / 2) + "`"), g = h(F), b = g !== "";
          b && (F = F.replace(new RegExp(`^${g}`, "gm"), ""));
          let T = i(C(F, { parser: "markdown", __inJsTemplate: !0 }, { stripTrailingHardline: !0 }), !0);
          return ["`", b ? t([p, T]) : [c, e(T)], p, "`"];
        }
        function h(D) {
          let E = D.match(/^([^\S\n]*)\S/m);
          return E === null ? "" : E[1];
        }
        m.exports = u;
      } }), Io = Ce({ "src/language-js/embed/css.js"(o, m) {
        Be();
        var { isNonEmptyArray: t } = yr(), { builders: { indent: p, hardline: c, softline: e }, utils: { mapDoc: i, replaceEndOfLine: u, cleanDoc: h } } = sr(), { printTemplateExpressions: D } = zi();
        function E(g, b, T) {
          let G = g.getValue(), W = G.quasis.map((H) => H.value.raw), B = 0, _ = W.reduce((H, ge, y) => y === 0 ? ge : H + "@prettier-placeholder-" + B++ + "-id" + ge, ""), U = T(_, { parser: "scss" }, { stripTrailingHardline: !0 }), Q = D(g, b);
          return C(U, G, Q);
        }
        function C(g, b, T) {
          if (b.quasis.length === 1 && !b.quasis[0].value.raw.trim())
            return "``";
          let G = F(g, T);
          if (!G)
            throw new Error("Couldn't insert all the expressions");
          return ["`", p([c, G]), e, "`"];
        }
        function F(g, b) {
          if (!t(b))
            return g;
          let T = 0, G = i(h(g), (W) => typeof W != "string" || !W.includes("@prettier-placeholder") ? W : W.split(/@prettier-placeholder-(\d+)-id/).map((B, _) => _ % 2 === 0 ? u(B) : (T++, b[B])));
          return b.length === T ? G : null;
        }
        m.exports = E;
      } }), Oo = Ce({ "src/language-js/embed/graphql.js"(o, m) {
        Be();
        var { builders: { indent: t, join: p, hardline: c } } = sr(), { escapeTemplateCharacters: e, printTemplateExpressions: i } = zi();
        function u(D, E, C) {
          let F = D.getValue(), g = F.quasis.length;
          if (g === 1 && F.quasis[0].value.raw.trim() === "")
            return "``";
          let b = i(D, E), T = [];
          for (let G = 0; G < g; G++) {
            let W = F.quasis[G], B = G === 0, _ = G === g - 1, U = W.value.cooked, Q = U.split(`
`), H = Q.length, ge = b[G], y = H > 2 && Q[0].trim() === "" && Q[1].trim() === "", R = H > 2 && Q[H - 1].trim() === "" && Q[H - 2].trim() === "", v = Q.every((l) => /^\s*(?:#[^\n\r]*)?$/.test(l));
            if (!_ && /#[^\n\r]*$/.test(Q[H - 1]))
              return null;
            let S = null;
            v ? S = h(Q) : S = C(U, { parser: "graphql" }, { stripTrailingHardline: !0 }), S ? (S = e(S, !1), !B && y && T.push(""), T.push(S), !_ && R && T.push("")) : !B && !_ && y && T.push(""), ge && T.push(ge);
          }
          return ["`", t([c, p(c, T)]), c, "`"];
        }
        function h(D) {
          let E = [], C = !1, F = D.map((g) => g.trim());
          for (let [g, b] of F.entries())
            b !== "" && (F[g - 1] === "" && C ? E.push([c, b]) : E.push(b), C = !0);
          return E.length === 0 ? null : p(c, E);
        }
        m.exports = u;
      } }), wa = Ce({ "src/language-js/embed/html.js"(o, m) {
        Be();
        var { builders: { indent: t, line: p, hardline: c, group: e }, utils: { mapDoc: i } } = sr(), { printTemplateExpressions: u, uncookTemplateElementValue: h } = zi(), D = 0;
        function E(C, F, g, b, T) {
          let { parser: G } = T, W = C.getValue(), B = D;
          D = D + 1 >>> 0;
          let _ = (A) => `PRETTIER_HTML_PLACEHOLDER_${A}_${B}_IN_JS`, U = W.quasis.map((A, w, I) => w === I.length - 1 ? A.value.cooked : A.value.cooked + _(w)).join(""), Q = u(C, F);
          if (Q.length === 0 && U.trim().length === 0)
            return "``";
          let H = new RegExp(_("(\\d+)"), "g"), ge = 0, y = g(U, { parser: G, __onHtmlRoot(A) {
            ge = A.children.length;
          } }, { stripTrailingHardline: !0 }), R = i(y, (A) => {
            if (typeof A != "string")
              return A;
            let w = [], I = A.split(H);
            for (let O = 0; O < I.length; O++) {
              let M = I[O];
              if (O % 2 === 0) {
                M && (M = h(M), b.__embeddedInHtml && (M = M.replace(/<\/(script)\b/gi, "<\\/$1")), w.push(M));
                continue;
              }
              let ee = Number(M);
              w.push(Q[ee]);
            }
            return w;
          }), v = /^\s/.test(U) ? " " : "", S = /\s$/.test(U) ? " " : "", l = b.htmlWhitespaceSensitivity === "ignore" ? c : v && S ? p : null;
          return e(l ? ["`", t([l, e(R)]), l, "`"] : ["`", v, ge > 1 ? t(e(R)) : e(R), S, "`"]);
        }
        m.exports = E;
      } }), Sa = Ce({ "src/language-js/embed.js"(o, m) {
        Be();
        var { hasComment: t, CommentCheckFlags: p, isObjectProperty: c } = Vr(), e = Aa(), i = Io(), u = Oo(), h = wa();
        function D(y) {
          if (F(y) || G(y) || W(y) || g(y))
            return "css";
          if (U(y))
            return "graphql";
          if (H(y))
            return "html";
          if (b(y))
            return "angular";
          if (C(y))
            return "markdown";
        }
        function E(y, R, v, S) {
          let l = y.getValue();
          if (l.type !== "TemplateLiteral" || ge(l))
            return;
          let A = D(y);
          if (A) {
            if (A === "markdown")
              return e(y, R, v);
            if (A === "css")
              return i(y, R, v);
            if (A === "graphql")
              return u(y, R, v);
            if (A === "html" || A === "angular")
              return h(y, R, v, S, { parser: A });
          }
        }
        function C(y) {
          let R = y.getValue(), v = y.getParentNode();
          return v && v.type === "TaggedTemplateExpression" && R.quasis.length === 1 && v.tag.type === "Identifier" && (v.tag.name === "md" || v.tag.name === "markdown");
        }
        function F(y) {
          let R = y.getValue(), v = y.getParentNode(), S = y.getParentNode(1);
          return S && R.quasis && v.type === "JSXExpressionContainer" && S.type === "JSXElement" && S.openingElement.name.name === "style" && S.openingElement.attributes.some((l) => l.name.name === "jsx") || v && v.type === "TaggedTemplateExpression" && v.tag.type === "Identifier" && v.tag.name === "css" || v && v.type === "TaggedTemplateExpression" && v.tag.type === "MemberExpression" && v.tag.object.name === "css" && (v.tag.property.name === "global" || v.tag.property.name === "resolve");
        }
        function g(y) {
          return y.match((R) => R.type === "TemplateLiteral", (R, v) => R.type === "ArrayExpression" && v === "elements", (R, v) => c(R) && R.key.type === "Identifier" && R.key.name === "styles" && v === "value", ...T);
        }
        function b(y) {
          return y.match((R) => R.type === "TemplateLiteral", (R, v) => c(R) && R.key.type === "Identifier" && R.key.name === "template" && v === "value", ...T);
        }
        var T = [(y, R) => y.type === "ObjectExpression" && R === "properties", (y, R) => y.type === "CallExpression" && y.callee.type === "Identifier" && y.callee.name === "Component" && R === "arguments", (y, R) => y.type === "Decorator" && R === "expression"];
        function G(y) {
          let R = y.getParentNode();
          if (!R || R.type !== "TaggedTemplateExpression")
            return !1;
          let v = R.tag.type === "ParenthesizedExpression" ? R.tag.expression : R.tag;
          switch (v.type) {
            case "MemberExpression":
              return B(v.object) || _(v);
            case "CallExpression":
              return B(v.callee) || v.callee.type === "MemberExpression" && (v.callee.object.type === "MemberExpression" && (B(v.callee.object.object) || _(v.callee.object)) || v.callee.object.type === "CallExpression" && B(v.callee.object.callee));
            case "Identifier":
              return v.name === "css";
            default:
              return !1;
          }
        }
        function W(y) {
          let R = y.getParentNode(), v = y.getParentNode(1);
          return v && R.type === "JSXExpressionContainer" && v.type === "JSXAttribute" && v.name.type === "JSXIdentifier" && v.name.name === "css";
        }
        function B(y) {
          return y.type === "Identifier" && y.name === "styled";
        }
        function _(y) {
          return /^[A-Z]/.test(y.object.name) && y.property.name === "extend";
        }
        function U(y) {
          let R = y.getValue(), v = y.getParentNode();
          return Q(R, "GraphQL") || v && (v.type === "TaggedTemplateExpression" && (v.tag.type === "MemberExpression" && v.tag.object.name === "graphql" && v.tag.property.name === "experimental" || v.tag.type === "Identifier" && (v.tag.name === "gql" || v.tag.name === "graphql")) || v.type === "CallExpression" && v.callee.type === "Identifier" && v.callee.name === "graphql");
        }
        function Q(y, R) {
          return t(y, p.Block | p.Leading, (v) => {
            let { value: S } = v;
            return S === ` ${R} `;
          });
        }
        function H(y) {
          return Q(y.getValue(), "HTML") || y.match((R) => R.type === "TemplateLiteral", (R, v) => R.type === "TaggedTemplateExpression" && R.tag.type === "Identifier" && R.tag.name === "html" && v === "quasi");
        }
        function ge(y) {
          let { quasis: R } = y;
          return R.some((v) => {
            let { value: { cooked: S } } = v;
            return S === null;
          });
        }
        m.exports = E;
      } }), Lo = Ce({ "src/language-js/clean.js"(o, m) {
        Be();
        var t = Gi(), p = /* @__PURE__ */ new Set(["range", "raw", "comments", "leadingComments", "trailingComments", "innerComments", "extra", "start", "end", "loc", "flags", "errors", "tokens"]), c = (i) => {
          for (let u of i.quasis)
            delete u.value;
        };
        function e(i, u, h) {
          if (i.type === "Program" && delete u.sourceType, (i.type === "BigIntLiteral" || i.type === "BigIntLiteralTypeAnnotation") && u.value && (u.value = u.value.toLowerCase()), (i.type === "BigIntLiteral" || i.type === "Literal") && u.bigint && (u.bigint = u.bigint.toLowerCase()), i.type === "DecimalLiteral" && (u.value = Number(u.value)), i.type === "Literal" && u.decimal && (u.decimal = Number(u.decimal)), i.type === "EmptyStatement" || i.type === "JSXText" || i.type === "JSXExpressionContainer" && (i.expression.type === "Literal" || i.expression.type === "StringLiteral") && i.expression.value === " ")
            return null;
          if ((i.type === "Property" || i.type === "ObjectProperty" || i.type === "MethodDefinition" || i.type === "ClassProperty" || i.type === "ClassMethod" || i.type === "PropertyDefinition" || i.type === "TSDeclareMethod" || i.type === "TSPropertySignature" || i.type === "ObjectTypeProperty") && typeof i.key == "object" && i.key && (i.key.type === "Literal" || i.key.type === "NumericLiteral" || i.key.type === "StringLiteral" || i.key.type === "Identifier") && delete u.key, i.type === "JSXElement" && i.openingElement.name.name === "style" && i.openingElement.attributes.some((C) => C.name.name === "jsx"))
            for (let { type: C, expression: F } of u.children)
              C === "JSXExpressionContainer" && F.type === "TemplateLiteral" && c(F);
          i.type === "JSXAttribute" && i.name.name === "css" && i.value.type === "JSXExpressionContainer" && i.value.expression.type === "TemplateLiteral" && c(u.value.expression), i.type === "JSXAttribute" && i.value && i.value.type === "Literal" && /["']|&quot;|&apos;/.test(i.value.value) && (u.value.value = u.value.value.replace(/["']|&quot;|&apos;/g, '"'));
          let D = i.expression || i.callee;
          if (i.type === "Decorator" && D.type === "CallExpression" && D.callee.name === "Component" && D.arguments.length === 1) {
            let C = i.expression.arguments[0].properties;
            for (let [F, g] of u.expression.arguments[0].properties.entries())
              switch (C[F].key.name) {
                case "styles":
                  g.value.type === "ArrayExpression" && c(g.value.elements[0]);
                  break;
                case "template":
                  g.value.type === "TemplateLiteral" && c(g.value);
                  break;
              }
          }
          if (i.type === "TaggedTemplateExpression" && (i.tag.type === "MemberExpression" || i.tag.type === "Identifier" && (i.tag.name === "gql" || i.tag.name === "graphql" || i.tag.name === "css" || i.tag.name === "md" || i.tag.name === "markdown" || i.tag.name === "html") || i.tag.type === "CallExpression") && c(u.quasi), i.type === "TemplateLiteral") {
            var E;
            (!((E = i.leadingComments) === null || E === void 0) && E.some((C) => t(C) && ["GraphQL", "HTML"].some((F) => C.value === ` ${F} `)) || h.type === "CallExpression" && h.callee.name === "graphql" || !i.leadingComments) && c(u);
          }
          if (i.type === "InterpreterDirective" && (u.value = u.value.trimEnd()), (i.type === "TSIntersectionType" || i.type === "TSUnionType") && i.types.length === 1)
            return u.types[0];
        }
        e.ignoredProperties = p, m.exports = e;
      } }), Os = {};
      ar(Os, { EOL: () => zs, arch: () => Js, cpus: () => Rs, default: () => Mo, endianness: () => du, freemem: () => Ms, getNetworkInterfaces: () => hu, hostname: () => Mu, loadavg: () => $u, networkInterfaces: () => qs, platform: () => Us, release: () => Ru, tmpDir: () => Vu, tmpdir: () => Gs, totalmem: () => $s, type: () => Vs, uptime: () => Ls });
      function du() {
        if (typeof mu > "u") {
          var o = new ArrayBuffer(2), m = new Uint8Array(o), t = new Uint16Array(o);
          if (m[0] = 1, m[1] = 2, t[0] === 258)
            mu = "BE";
          else if (t[0] === 513)
            mu = "LE";
          else
            throw new Error("unable to figure out endianess");
        }
        return mu;
      }
      function Mu() {
        return typeof globalThis.location < "u" ? globalThis.location.hostname : "";
      }
      function $u() {
        return [];
      }
      function Ls() {
        return 0;
      }
      function Ms() {
        return Number.MAX_VALUE;
      }
      function $s() {
        return Number.MAX_VALUE;
      }
      function Rs() {
        return [];
      }
      function Vs() {
        return "Browser";
      }
      function Ru() {
        return typeof globalThis.navigator < "u" ? globalThis.navigator.appVersion : "";
      }
      function qs() {
      }
      function hu() {
      }
      function Js() {
        return "javascript";
      }
      function Us() {
        return "browser";
      }
      function Vu() {
        return "/tmp";
      }
      var mu, Gs, zs, Mo, Ta = Wt({ "node-modules-polyfills:os"() {
        Be(), Gs = Vu, zs = `
`, Mo = { EOL: zs, tmpdir: Gs, tmpDir: Vu, networkInterfaces: qs, getNetworkInterfaces: hu, release: Ru, type: Vs, cpus: Rs, totalmem: $s, freemem: Ms, uptime: Ls, loadavg: $u, hostname: Mu, endianness: du };
      } }), $o = Ce({ "node-modules-polyfills-commonjs:os"(o, m) {
        Be();
        var t = (Ta(), Nr(Os));
        if (t && t.default) {
          m.exports = t.default;
          for (let p in t)
            m.exports[p] = t[p];
        } else
          t && (m.exports = t);
      } }), ka = Ce({ "node_modules/detect-newline/index.js"(o, m) {
        Be();
        var t = (p) => {
          if (typeof p != "string")
            throw new TypeError("Expected a string");
          let c = p.match(/(?:\r?\n)/g) || [];
          if (c.length === 0)
            return;
          let e = c.filter((u) => u === `\r
`).length, i = c.length - e;
          return e > i ? `\r
` : `
`;
        };
        m.exports = t, m.exports.graceful = (p) => typeof p == "string" && t(p) || `
`;
      } }), qu = Ce({ "node_modules/jest-docblock/build/index.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.extract = g, o.parse = T, o.parseWithComments = G, o.print = W, o.strip = b;
        function m() {
          let _ = $o();
          return m = function() {
            return _;
          }, _;
        }
        function t() {
          let _ = p(ka());
          return t = function() {
            return _;
          }, _;
        }
        function p(_) {
          return _ && _.__esModule ? _ : { default: _ };
        }
        var c = /\*\/$/, e = /^\/\*\*?/, i = /^\s*(\/\*\*?(.|\r?\n)*?\*\/)/, u = /(^|\s+)\/\/([^\r\n]*)/g, h = /^(\r?\n)+/, D = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *(?![^@\r\n]*\/\/[^]*)([^@\r\n\s][^@\r\n]+?) *\r?\n/g, E = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g, C = /(\r?\n|^) *\* ?/g, F = [];
        function g(_) {
          let U = _.match(i);
          return U ? U[0].trimLeft() : "";
        }
        function b(_) {
          let U = _.match(i);
          return U && U[0] ? _.substring(U[0].length) : _;
        }
        function T(_) {
          return G(_).pragmas;
        }
        function G(_) {
          let U = (0, t().default)(_) || m().EOL;
          _ = _.replace(e, "").replace(c, "").replace(C, "$1");
          let Q = "";
          for (; Q !== _; )
            Q = _, _ = _.replace(D, `${U}$1 $2${U}`);
          _ = _.replace(h, "").trimRight();
          let H = /* @__PURE__ */ Object.create(null), ge = _.replace(E, "").replace(h, "").trimRight(), y;
          for (; y = E.exec(_); ) {
            let R = y[2].replace(u, "");
            typeof H[y[1]] == "string" || Array.isArray(H[y[1]]) ? H[y[1]] = F.concat(H[y[1]], R) : H[y[1]] = R;
          }
          return { comments: ge, pragmas: H };
        }
        function W(_) {
          let { comments: U = "", pragmas: Q = {} } = _, H = (0, t().default)(U) || m().EOL, ge = "/**", y = " *", R = " */", v = Object.keys(Q), S = v.map((A) => B(A, Q[A])).reduce((A, w) => A.concat(w), []).map((A) => `${y} ${A}${H}`).join("");
          if (!U) {
            if (v.length === 0)
              return "";
            if (v.length === 1 && !Array.isArray(Q[v[0]])) {
              let A = Q[v[0]];
              return `${ge} ${B(v[0], A)[0]}${R}`;
            }
          }
          let l = U.split(H).map((A) => `${y} ${A}`).join(H) + H;
          return ge + H + (U ? l : "") + (U && v.length ? y + H : "") + S + R;
        }
        function B(_, U) {
          return F.concat(U).map((Q) => `@${_} ${Q}`.trim());
        }
      } }), Ju = Ce({ "src/language-js/utils/get-shebang.js"(o, m) {
        Be();
        function t(p) {
          if (!p.startsWith("#!"))
            return "";
          let c = p.indexOf(`
`);
          return c === -1 ? p : p.slice(0, c);
        }
        m.exports = t;
      } }), Ws = Ce({ "src/language-js/pragma.js"(o, m) {
        Be();
        var { parseWithComments: t, strip: p, extract: c, print: e } = qu(), { normalizeEndOfLine: i } = hi(), u = Ju();
        function h(C) {
          let F = u(C);
          F && (C = C.slice(F.length + 1));
          let g = c(C), { pragmas: b, comments: T } = t(g);
          return { shebang: F, text: C, pragmas: b, comments: T };
        }
        function D(C) {
          let F = Object.keys(h(C).pragmas);
          return F.includes("prettier") || F.includes("format");
        }
        function E(C) {
          let { shebang: F, text: g, pragmas: b, comments: T } = h(C), G = p(g), W = e({ pragmas: Object.assign({ format: "" }, b), comments: T.trimStart() });
          return (F ? `${F}
` : "") + i(W) + (G.startsWith(`
`) ? `
` : `

`) + G;
        }
        m.exports = { hasPragma: D, insertPragma: E };
      } }), Uu = Ce({ "src/language-js/comments.js"(o, m) {
        Be();
        var { getLast: t, hasNewline: p, getNextNonSpaceNonCommentCharacterIndexWithStartIndex: c, getNextNonSpaceNonCommentCharacter: e, hasNewlineInRange: i, addLeadingComment: u, addTrailingComment: h, addDanglingComment: D, getNextNonSpaceNonCommentCharacterIndex: E, isNonEmptyArray: C } = yr(), { getFunctionParameters: F, isPrettierIgnoreComment: g, isJsxNode: b, hasFlowShorthandAnnotationComment: T, hasFlowAnnotationComment: G, hasIgnoreComment: W, isCallLikeExpression: B, getCallArguments: _, isCallExpression: U, isMemberExpression: Q, isObjectProperty: H, isLineComment: ge, getComments: y, CommentCheckFlags: R, markerForIfWithoutBlockAndSameLineComment: v } = Vr(), { locStart: S, locEnd: l } = Dn(), A = Gi();
        function w(nt) {
          return [Xe, Ze, ie, he, ce, xe, Ne, ht, Oe, ut, vt, Ut, _e, kt, ke].some((N) => N(nt));
        }
        function I(nt) {
          return [pe, Ze, je, vt, he, ce, xe, Ne, kt, be, Re, ut, Vt, ke, tt].some((N) => N(nt));
        }
        function O(nt) {
          return [Xe, he, ce, de, Qe, _e, ut, Se, me, ye, ke, Qt].some((N) => N(nt));
        }
        function M(nt, N) {
          let Fe = (nt.body || nt.properties).find((Ue) => {
            let { type: yt } = Ue;
            return yt !== "EmptyStatement";
          });
          Fe ? u(Fe, N) : D(nt, N);
        }
        function ee(nt, N) {
          nt.type === "BlockStatement" ? M(nt, N) : u(nt, N);
        }
        function pe(nt) {
          let { comment: N, followingNode: Fe } = nt;
          return Fe && jt(N) ? (u(Fe, N), !0) : !1;
        }
        function he(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt, text: Et } = nt;
          if ((Ue == null ? void 0 : Ue.type) !== "IfStatement" || !yt)
            return !1;
          if (e(Et, N, l) === ")")
            return h(Fe, N), !0;
          if (Fe === Ue.consequent && yt === Ue.alternate) {
            if (Fe.type === "BlockStatement")
              h(Fe, N);
            else {
              let $t = N.type === "SingleLine" || N.loc.start.line === N.loc.end.line, bt = N.loc.start.line === Fe.loc.start.line;
              $t && bt ? D(Fe, N, v) : D(Ue, N);
            }
            return !0;
          }
          return yt.type === "BlockStatement" ? (M(yt, N), !0) : yt.type === "IfStatement" ? (ee(yt.consequent, N), !0) : Ue.consequent === yt ? (u(yt, N), !0) : !1;
        }
        function ce(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt, text: Et } = nt;
          return (Ue == null ? void 0 : Ue.type) !== "WhileStatement" || !yt ? !1 : e(Et, N, l) === ")" ? (h(Fe, N), !0) : yt.type === "BlockStatement" ? (M(yt, N), !0) : Ue.body === yt ? (u(yt, N), !0) : !1;
        }
        function xe(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt } = nt;
          return (Ue == null ? void 0 : Ue.type) !== "TryStatement" && (Ue == null ? void 0 : Ue.type) !== "CatchClause" || !yt ? !1 : Ue.type === "CatchClause" && Fe ? (h(Fe, N), !0) : yt.type === "BlockStatement" ? (M(yt, N), !0) : yt.type === "TryStatement" ? (ee(yt.finalizer, N), !0) : yt.type === "CatchClause" ? (ee(yt.body, N), !0) : !1;
        }
        function ie(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue } = nt;
          return Q(Fe) && (Ue == null ? void 0 : Ue.type) === "Identifier" ? (u(Fe, N), !0) : !1;
        }
        function je(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt, text: Et } = nt, $t = Fe && !i(Et, l(Fe), S(N));
          return (!Fe || !$t) && ((Ue == null ? void 0 : Ue.type) === "ConditionalExpression" || (Ue == null ? void 0 : Ue.type) === "TSConditionalType") && yt ? (u(yt, N), !0) : !1;
        }
        function de(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue } = nt;
          return H(Ue) && Ue.shorthand && Ue.key === Fe && Ue.value.type === "AssignmentPattern" ? (h(Ue.value.left, N), !0) : !1;
        }
        var oe = /* @__PURE__ */ new Set(["ClassDeclaration", "ClassExpression", "DeclareClass", "DeclareInterface", "InterfaceDeclaration", "TSInterfaceDeclaration"]);
        function Ne(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt } = nt;
          if (oe.has(Ue == null ? void 0 : Ue.type)) {
            if (C(Ue.decorators) && !(yt && yt.type === "Decorator"))
              return h(t(Ue.decorators), N), !0;
            if (Ue.body && yt === Ue.body)
              return M(Ue.body, N), !0;
            if (yt) {
              if (Ue.superClass && yt === Ue.superClass && Fe && (Fe === Ue.id || Fe === Ue.typeParameters))
                return h(Fe, N), !0;
              for (let Et of ["implements", "extends", "mixins"])
                if (Ue[Et] && yt === Ue[Et][0])
                  return Fe && (Fe === Ue.id || Fe === Ue.typeParameters || Fe === Ue.superClass) ? h(Fe, N) : D(Ue, N, Et), !0;
            }
          }
          return !1;
        }
        var Je = /* @__PURE__ */ new Set(["ClassMethod", "ClassProperty", "PropertyDefinition", "TSAbstractPropertyDefinition", "TSAbstractMethodDefinition", "TSDeclareMethod", "MethodDefinition", "ClassAccessorProperty", "AccessorProperty", "TSAbstractAccessorProperty"]);
        function _e(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, text: yt } = nt;
          return Ue && Fe && e(yt, N, l) === "(" && (Ue.type === "Property" || Ue.type === "TSDeclareMethod" || Ue.type === "TSAbstractMethodDefinition") && Fe.type === "Identifier" && Ue.key === Fe && e(yt, Fe, l) !== ":" || (Fe == null ? void 0 : Fe.type) === "Decorator" && Je.has(Ue == null ? void 0 : Ue.type) ? (h(Fe, N), !0) : !1;
        }
        var it = /* @__PURE__ */ new Set(["FunctionDeclaration", "FunctionExpression", "ClassMethod", "MethodDefinition", "ObjectMethod"]);
        function me(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, text: yt } = nt;
          return e(yt, N, l) !== "(" ? !1 : Fe && it.has(Ue == null ? void 0 : Ue.type) ? (h(Fe, N), !0) : !1;
        }
        function Se(nt) {
          let { comment: N, enclosingNode: Fe, text: Ue } = nt;
          if ((Fe == null ? void 0 : Fe.type) !== "ArrowFunctionExpression")
            return !1;
          let yt = E(Ue, N, l);
          return yt !== !1 && Ue.slice(yt, yt + 2) === "=>" ? (D(Fe, N), !0) : !1;
        }
        function Qe(nt) {
          let { comment: N, enclosingNode: Fe, text: Ue } = nt;
          return e(Ue, N, l) !== ")" ? !1 : Fe && (Te(Fe) && F(Fe).length === 0 || B(Fe) && _(Fe).length === 0) ? (D(Fe, N), !0) : ((Fe == null ? void 0 : Fe.type) === "MethodDefinition" || (Fe == null ? void 0 : Fe.type) === "TSAbstractMethodDefinition") && F(Fe.value).length === 0 ? (D(Fe.value, N), !0) : !1;
        }
        function Ze(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt, text: Et } = nt;
          if ((Fe == null ? void 0 : Fe.type) === "FunctionTypeParam" && (Ue == null ? void 0 : Ue.type) === "FunctionTypeAnnotation" && (yt == null ? void 0 : yt.type) !== "FunctionTypeParam" || ((Fe == null ? void 0 : Fe.type) === "Identifier" || (Fe == null ? void 0 : Fe.type) === "AssignmentPattern") && Ue && Te(Ue) && e(Et, N, l) === ")")
            return h(Fe, N), !0;
          if ((Ue == null ? void 0 : Ue.type) === "FunctionDeclaration" && (yt == null ? void 0 : yt.type) === "BlockStatement") {
            let $t = (() => {
              let bt = F(Ue);
              if (bt.length > 0)
                return c(Et, l(t(bt)));
              let Hr = c(Et, l(Ue.id));
              return Hr !== !1 && c(Et, Hr + 1);
            })();
            if (S(N) > $t)
              return M(yt, N), !0;
          }
          return !1;
        }
        function kt(nt) {
          let { comment: N, enclosingNode: Fe } = nt;
          return (Fe == null ? void 0 : Fe.type) === "LabeledStatement" ? (u(Fe, N), !0) : !1;
        }
        function ke(nt) {
          let { comment: N, enclosingNode: Fe } = nt;
          return ((Fe == null ? void 0 : Fe.type) === "ContinueStatement" || (Fe == null ? void 0 : Fe.type) === "BreakStatement") && !Fe.label ? (h(Fe, N), !0) : !1;
        }
        function be(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue } = nt;
          return U(Ue) && Fe && Ue.callee === Fe && Ue.arguments.length > 0 ? (u(Ue.arguments[0], N), !0) : !1;
        }
        function Oe(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt } = nt;
          return (Ue == null ? void 0 : Ue.type) === "UnionTypeAnnotation" || (Ue == null ? void 0 : Ue.type) === "TSUnionType" ? (g(N) && (yt.prettierIgnore = !0, N.unignore = !0), Fe ? (h(Fe, N), !0) : !1) : (((yt == null ? void 0 : yt.type) === "UnionTypeAnnotation" || (yt == null ? void 0 : yt.type) === "TSUnionType") && g(N) && (yt.types[0].prettierIgnore = !0, N.unignore = !0), !1);
        }
        function Re(nt) {
          let { comment: N, enclosingNode: Fe } = nt;
          return H(Fe) ? (u(Fe, N), !0) : !1;
        }
        function ut(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue, ast: yt, isLastComment: Et } = nt;
          return yt && yt.body && yt.body.length === 0 ? (Et ? D(yt, N) : u(yt, N), !0) : (Fe == null ? void 0 : Fe.type) === "Program" && (Fe == null ? void 0 : Fe.body.length) === 0 && !C(Fe.directives) ? (Et ? D(Fe, N) : u(Fe, N), !0) : (Ue == null ? void 0 : Ue.type) === "Program" && (Ue == null ? void 0 : Ue.body.length) === 0 && (Fe == null ? void 0 : Fe.type) === "ModuleExpression" ? (D(Ue, N), !0) : !1;
        }
        function ht(nt) {
          let { comment: N, enclosingNode: Fe } = nt;
          return (Fe == null ? void 0 : Fe.type) === "ForInStatement" || (Fe == null ? void 0 : Fe.type) === "ForOfStatement" ? (u(Fe, N), !0) : !1;
        }
        function vt(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, text: yt } = nt;
          if ((Ue == null ? void 0 : Ue.type) === "ImportSpecifier" || (Ue == null ? void 0 : Ue.type) === "ExportSpecifier")
            return u(Ue, N), !0;
          let Et = (Fe == null ? void 0 : Fe.type) === "ImportSpecifier" && (Ue == null ? void 0 : Ue.type) === "ImportDeclaration", $t = (Fe == null ? void 0 : Fe.type) === "ExportSpecifier" && (Ue == null ? void 0 : Ue.type) === "ExportNamedDeclaration";
          return (Et || $t) && p(yt, l(N)) ? (h(Fe, N), !0) : !1;
        }
        function Ut(nt) {
          let { comment: N, enclosingNode: Fe } = nt;
          return (Fe == null ? void 0 : Fe.type) === "AssignmentPattern" ? (u(Fe, N), !0) : !1;
        }
        var Dr = /* @__PURE__ */ new Set(["VariableDeclarator", "AssignmentExpression", "TypeAlias", "TSTypeAliasDeclaration"]), mr = /* @__PURE__ */ new Set(["ObjectExpression", "ArrayExpression", "TemplateLiteral", "TaggedTemplateExpression", "ObjectTypeAnnotation", "TSTypeLiteral"]);
        function Vt(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue } = nt;
          return Dr.has(Fe == null ? void 0 : Fe.type) && Ue && (mr.has(Ue.type) || A(N)) ? (u(Ue, N), !0) : !1;
        }
        function Qt(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue, text: yt } = nt;
          return !Ue && ((Fe == null ? void 0 : Fe.type) === "TSMethodSignature" || (Fe == null ? void 0 : Fe.type) === "TSDeclareFunction" || (Fe == null ? void 0 : Fe.type) === "TSAbstractMethodDefinition") && e(yt, N, l) === ";" ? (h(Fe, N), !0) : !1;
        }
        function Xe(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue } = nt;
          if (g(N) && (Fe == null ? void 0 : Fe.type) === "TSMappedType" && (Ue == null ? void 0 : Ue.type) === "TSTypeParameter" && Ue.constraint)
            return Fe.prettierIgnore = !0, N.unignore = !0, !0;
        }
        function ye(nt) {
          let { comment: N, precedingNode: Fe, enclosingNode: Ue, followingNode: yt } = nt;
          return (Ue == null ? void 0 : Ue.type) !== "TSMappedType" ? !1 : (yt == null ? void 0 : yt.type) === "TSTypeParameter" && yt.name ? (u(yt.name, N), !0) : (Fe == null ? void 0 : Fe.type) === "TSTypeParameter" && Fe.constraint ? (h(Fe.constraint, N), !0) : !1;
        }
        function tt(nt) {
          let { comment: N, enclosingNode: Fe, followingNode: Ue } = nt;
          return !Fe || Fe.type !== "SwitchCase" || Fe.test || !Ue || Ue !== Fe.consequent[0] ? !1 : (Ue.type === "BlockStatement" && ge(N) ? M(Ue, N) : D(Fe, N), !0);
        }
        function Te(nt) {
          return nt.type === "ArrowFunctionExpression" || nt.type === "FunctionExpression" || nt.type === "FunctionDeclaration" || nt.type === "ObjectMethod" || nt.type === "ClassMethod" || nt.type === "TSDeclareFunction" || nt.type === "TSCallSignatureDeclaration" || nt.type === "TSConstructSignatureDeclaration" || nt.type === "TSMethodSignature" || nt.type === "TSConstructorType" || nt.type === "TSFunctionType" || nt.type === "TSDeclareMethod";
        }
        function rt(nt, N) {
          if ((N.parser === "typescript" || N.parser === "flow" || N.parser === "acorn" || N.parser === "espree" || N.parser === "meriyah" || N.parser === "__babel_estree") && nt.type === "MethodDefinition" && nt.value && nt.value.type === "FunctionExpression" && F(nt.value).length === 0 && !nt.value.returnType && !C(nt.value.typeParameters) && nt.value.body)
            return [...nt.decorators || [], nt.key, nt.value.body];
        }
        function jt(nt) {
          return A(nt) && nt.value[0] === "*" && /@type\b/.test(nt.value);
        }
        function Ct(nt) {
          let N = nt.getValue(), Fe = nt.getParentNode(), Ue = (yt) => G(y(yt, R.Leading)) || G(y(yt, R.Trailing));
          return (N && (b(N) || T(N) || U(Fe) && Ue(N)) || Fe && (Fe.type === "JSXSpreadAttribute" || Fe.type === "JSXSpreadChild" || Fe.type === "UnionTypeAnnotation" || Fe.type === "TSUnionType" || (Fe.type === "ClassDeclaration" || Fe.type === "ClassExpression") && Fe.superClass === N)) && (!W(nt) || Fe.type === "UnionTypeAnnotation" || Fe.type === "TSUnionType");
        }
        m.exports = { handleOwnLineComment: w, handleEndOfLineComment: I, handleRemainingComment: O, isTypeCastComment: jt, getCommentChildNodes: rt, willPrintOwnComments: Ct };
      } }), ai = Ce({ "src/language-js/needs-parens.js"(o, m) {
        Be();
        var t = dn(), p = ps(), { getFunctionParameters: c, getLeftSidePathName: e, hasFlowShorthandAnnotationComment: i, hasNakedLeftSide: u, hasNode: h, isBitwiseOperator: D, startsWithNoLookaheadToken: E, shouldFlatten: C, getPrecedence: F, isCallExpression: g, isMemberExpression: b, isObjectProperty: T, isTSTypeExpression: G } = Vr();
        function W(y, R) {
          let v = y.getParentNode();
          if (!v)
            return !1;
          let S = y.getName(), l = y.getNode();
          if (R.__isInHtmlInterpolation && !R.bracketSpacing && Q(l) && H(y))
            return !0;
          if (B(l))
            return !1;
          if (R.parser !== "flow" && i(y.getValue()))
            return !0;
          if (l.type === "Identifier") {
            if (l.extra && l.extra.parenthesized && /^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/.test(l.name) || S === "left" && (l.name === "async" && !v.await || l.name === "let") && v.type === "ForOfStatement")
              return !0;
            if (l.name === "let") {
              var A;
              let I = (A = y.findAncestor((O) => O.type === "ForOfStatement")) === null || A === void 0 ? void 0 : A.left;
              if (I && E(I, (O) => O === l))
                return !0;
            }
            if (S === "object" && l.name === "let" && v.type === "MemberExpression" && v.computed && !v.optional) {
              let I = y.findAncestor((M) => M.type === "ExpressionStatement" || M.type === "ForStatement" || M.type === "ForInStatement"), O = I ? I.type === "ExpressionStatement" ? I.expression : I.type === "ForStatement" ? I.init : I.left : void 0;
              if (O && E(O, (M) => M === l))
                return !0;
            }
            return !1;
          }
          if (l.type === "ObjectExpression" || l.type === "FunctionExpression" || l.type === "ClassExpression" || l.type === "DoExpression") {
            var w;
            let I = (w = y.findAncestor((O) => O.type === "ExpressionStatement")) === null || w === void 0 ? void 0 : w.expression;
            if (I && E(I, (O) => O === l))
              return !0;
          }
          switch (v.type) {
            case "ParenthesizedExpression":
              return !1;
            case "ClassDeclaration":
            case "ClassExpression": {
              if (S === "superClass" && (l.type === "ArrowFunctionExpression" || l.type === "AssignmentExpression" || l.type === "AwaitExpression" || l.type === "BinaryExpression" || l.type === "ConditionalExpression" || l.type === "LogicalExpression" || l.type === "NewExpression" || l.type === "ObjectExpression" || l.type === "SequenceExpression" || l.type === "TaggedTemplateExpression" || l.type === "UnaryExpression" || l.type === "UpdateExpression" || l.type === "YieldExpression" || l.type === "TSNonNullExpression"))
                return !0;
              break;
            }
            case "ExportDefaultDeclaration":
              return ge(y, R) || l.type === "SequenceExpression";
            case "Decorator": {
              if (S === "expression") {
                let I = !1, O = !1, M = l;
                for (; M; )
                  switch (M.type) {
                    case "MemberExpression":
                      O = !0, M = M.object;
                      break;
                    case "CallExpression":
                      if (O || I)
                        return R.parser !== "typescript";
                      I = !0, M = M.callee;
                      break;
                    case "Identifier":
                      return !1;
                    case "TaggedTemplateExpression":
                      return R.parser !== "typescript";
                    default:
                      return !0;
                  }
                return !0;
              }
              break;
            }
            case "ArrowFunctionExpression": {
              if (S === "body" && l.type !== "SequenceExpression" && E(l, (I) => I.type === "ObjectExpression"))
                return !0;
              break;
            }
          }
          switch (l.type) {
            case "UpdateExpression":
              if (v.type === "UnaryExpression")
                return l.prefix && (l.operator === "++" && v.operator === "+" || l.operator === "--" && v.operator === "-");
            case "UnaryExpression":
              switch (v.type) {
                case "UnaryExpression":
                  return l.operator === v.operator && (l.operator === "+" || l.operator === "-");
                case "BindExpression":
                  return !0;
                case "MemberExpression":
                case "OptionalMemberExpression":
                  return S === "object";
                case "TaggedTemplateExpression":
                  return !0;
                case "NewExpression":
                case "CallExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "BinaryExpression":
                  return S === "left" && v.operator === "**";
                case "TSNonNullExpression":
                  return !0;
                default:
                  return !1;
              }
            case "BinaryExpression": {
              if (v.type === "UpdateExpression" || l.operator === "in" && _(y))
                return !0;
              if (l.operator === "|>" && l.extra && l.extra.parenthesized) {
                let I = y.getParentNode(1);
                if (I.type === "BinaryExpression" && I.operator === "|>")
                  return !0;
              }
            }
            case "TSTypeAssertion":
            case "TSAsExpression":
            case "TSSatisfiesExpression":
            case "LogicalExpression":
              switch (v.type) {
                case "TSSatisfiesExpression":
                case "TSAsExpression":
                  return !G(l);
                case "ConditionalExpression":
                  return G(l);
                case "CallExpression":
                case "NewExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "ClassExpression":
                case "ClassDeclaration":
                  return S === "superClass";
                case "TSTypeAssertion":
                case "TaggedTemplateExpression":
                case "UnaryExpression":
                case "JSXSpreadAttribute":
                case "SpreadElement":
                case "SpreadProperty":
                case "BindExpression":
                case "AwaitExpression":
                case "TSNonNullExpression":
                case "UpdateExpression":
                  return !0;
                case "MemberExpression":
                case "OptionalMemberExpression":
                  return S === "object";
                case "AssignmentExpression":
                case "AssignmentPattern":
                  return S === "left" && (l.type === "TSTypeAssertion" || G(l));
                case "LogicalExpression":
                  if (l.type === "LogicalExpression")
                    return v.operator !== l.operator;
                case "BinaryExpression": {
                  let { operator: I, type: O } = l;
                  if (!I && O !== "TSTypeAssertion")
                    return !0;
                  let M = F(I), ee = v.operator, pe = F(ee);
                  return pe > M || S === "right" && pe === M || pe === M && !C(ee, I) ? !0 : pe < M && I === "%" ? ee === "+" || ee === "-" : !!D(ee);
                }
                default:
                  return !1;
              }
            case "SequenceExpression":
              switch (v.type) {
                case "ReturnStatement":
                  return !1;
                case "ForStatement":
                  return !1;
                case "ExpressionStatement":
                  return S !== "expression";
                case "ArrowFunctionExpression":
                  return S !== "body";
                default:
                  return !0;
              }
            case "YieldExpression":
              if (v.type === "UnaryExpression" || v.type === "AwaitExpression" || G(v) || v.type === "TSNonNullExpression")
                return !0;
            case "AwaitExpression":
              switch (v.type) {
                case "TaggedTemplateExpression":
                case "UnaryExpression":
                case "LogicalExpression":
                case "SpreadElement":
                case "SpreadProperty":
                case "TSAsExpression":
                case "TSSatisfiesExpression":
                case "TSNonNullExpression":
                case "BindExpression":
                  return !0;
                case "MemberExpression":
                case "OptionalMemberExpression":
                  return S === "object";
                case "NewExpression":
                case "CallExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "ConditionalExpression":
                  return S === "test";
                case "BinaryExpression":
                  return !(!l.argument && v.operator === "|>");
                default:
                  return !1;
              }
            case "TSConditionalType":
              if (S === "extendsType" && v.type === "TSConditionalType")
                return !0;
            case "TSFunctionType":
            case "TSConstructorType":
              if (S === "extendsType" && v.type === "TSConditionalType") {
                let I = (l.returnType || l.typeAnnotation).typeAnnotation;
                if (I.type === "TSInferType" && I.typeParameter.constraint)
                  return !0;
              }
              if (S === "checkType" && v.type === "TSConditionalType")
                return !0;
            case "TSUnionType":
            case "TSIntersectionType":
              if ((v.type === "TSUnionType" || v.type === "TSIntersectionType") && v.types.length > 1 && (!l.types || l.types.length > 1))
                return !0;
            case "TSInferType":
              if (l.type === "TSInferType" && v.type === "TSRestType")
                return !1;
            case "TSTypeOperator":
              return v.type === "TSArrayType" || v.type === "TSOptionalType" || v.type === "TSRestType" || S === "objectType" && v.type === "TSIndexedAccessType" || v.type === "TSTypeOperator" || v.type === "TSTypeAnnotation" && y.getParentNode(1).type.startsWith("TSJSDoc");
            case "TSTypeQuery":
              return S === "objectType" && v.type === "TSIndexedAccessType" || S === "elementType" && v.type === "TSArrayType";
            case "ArrayTypeAnnotation":
              return v.type === "NullableTypeAnnotation";
            case "IntersectionTypeAnnotation":
            case "UnionTypeAnnotation":
              return v.type === "ArrayTypeAnnotation" || v.type === "NullableTypeAnnotation" || v.type === "IntersectionTypeAnnotation" || v.type === "UnionTypeAnnotation" || S === "objectType" && (v.type === "IndexedAccessType" || v.type === "OptionalIndexedAccessType");
            case "NullableTypeAnnotation":
              return v.type === "ArrayTypeAnnotation" || S === "objectType" && (v.type === "IndexedAccessType" || v.type === "OptionalIndexedAccessType");
            case "FunctionTypeAnnotation": {
              let I = v.type === "NullableTypeAnnotation" ? y.getParentNode(1) : v;
              return I.type === "UnionTypeAnnotation" || I.type === "IntersectionTypeAnnotation" || I.type === "ArrayTypeAnnotation" || S === "objectType" && (I.type === "IndexedAccessType" || I.type === "OptionalIndexedAccessType") || I.type === "NullableTypeAnnotation" || v.type === "FunctionTypeParam" && v.name === null && c(l).some((O) => O.typeAnnotation && O.typeAnnotation.type === "NullableTypeAnnotation");
            }
            case "OptionalIndexedAccessType":
              return S === "objectType" && v.type === "IndexedAccessType";
            case "TypeofTypeAnnotation":
              return S === "objectType" && (v.type === "IndexedAccessType" || v.type === "OptionalIndexedAccessType");
            case "StringLiteral":
            case "NumericLiteral":
            case "Literal":
              if (typeof l.value == "string" && v.type === "ExpressionStatement" && !v.directive) {
                let I = y.getParentNode(1);
                return I.type === "Program" || I.type === "BlockStatement";
              }
              return S === "object" && v.type === "MemberExpression" && typeof l.value == "number";
            case "AssignmentExpression": {
              let I = y.getParentNode(1);
              return S === "body" && v.type === "ArrowFunctionExpression" ? !0 : S === "key" && (v.type === "ClassProperty" || v.type === "PropertyDefinition") && v.computed || (S === "init" || S === "update") && v.type === "ForStatement" ? !1 : v.type === "ExpressionStatement" ? l.left.type === "ObjectPattern" : !(S === "key" && v.type === "TSPropertySignature" || v.type === "AssignmentExpression" || v.type === "SequenceExpression" && I && I.type === "ForStatement" && (I.init === v || I.update === v) || S === "value" && v.type === "Property" && I && I.type === "ObjectPattern" && I.properties.includes(v) || v.type === "NGChainedExpression");
            }
            case "ConditionalExpression":
              switch (v.type) {
                case "TaggedTemplateExpression":
                case "UnaryExpression":
                case "SpreadElement":
                case "SpreadProperty":
                case "BinaryExpression":
                case "LogicalExpression":
                case "NGPipeExpression":
                case "ExportDefaultDeclaration":
                case "AwaitExpression":
                case "JSXSpreadAttribute":
                case "TSTypeAssertion":
                case "TypeCastExpression":
                case "TSAsExpression":
                case "TSSatisfiesExpression":
                case "TSNonNullExpression":
                  return !0;
                case "NewExpression":
                case "CallExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "ConditionalExpression":
                  return S === "test";
                case "MemberExpression":
                case "OptionalMemberExpression":
                  return S === "object";
                default:
                  return !1;
              }
            case "FunctionExpression":
              switch (v.type) {
                case "NewExpression":
                case "CallExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "TaggedTemplateExpression":
                  return !0;
                default:
                  return !1;
              }
            case "ArrowFunctionExpression":
              switch (v.type) {
                case "BinaryExpression":
                  return v.operator !== "|>" || l.extra && l.extra.parenthesized;
                case "NewExpression":
                case "CallExpression":
                case "OptionalCallExpression":
                  return S === "callee";
                case "MemberExpression":
                case "OptionalMemberExpression":
                  return S === "object";
                case "TSAsExpression":
                case "TSSatisfiesExpression":
                case "TSNonNullExpression":
                case "BindExpression":
                case "TaggedTemplateExpression":
                case "UnaryExpression":
                case "LogicalExpression":
                case "AwaitExpression":
                case "TSTypeAssertion":
                  return !0;
                case "ConditionalExpression":
                  return S === "test";
                default:
                  return !1;
              }
            case "ClassExpression":
              if (p(l.decorators))
                return !0;
              switch (v.type) {
                case "NewExpression":
                  return S === "callee";
                default:
                  return !1;
              }
            case "OptionalMemberExpression":
            case "OptionalCallExpression": {
              let I = y.getParentNode(1);
              if (S === "object" && v.type === "MemberExpression" || S === "callee" && (v.type === "CallExpression" || v.type === "NewExpression") || v.type === "TSNonNullExpression" && I.type === "MemberExpression" && I.object === v)
                return !0;
            }
            case "CallExpression":
            case "MemberExpression":
            case "TaggedTemplateExpression":
            case "TSNonNullExpression":
              if (S === "callee" && (v.type === "BindExpression" || v.type === "NewExpression")) {
                let I = l;
                for (; I; )
                  switch (I.type) {
                    case "CallExpression":
                    case "OptionalCallExpression":
                      return !0;
                    case "MemberExpression":
                    case "OptionalMemberExpression":
                    case "BindExpression":
                      I = I.object;
                      break;
                    case "TaggedTemplateExpression":
                      I = I.tag;
                      break;
                    case "TSNonNullExpression":
                      I = I.expression;
                      break;
                    default:
                      return !1;
                  }
              }
              return !1;
            case "BindExpression":
              return S === "callee" && (v.type === "BindExpression" || v.type === "NewExpression") || S === "object" && b(v);
            case "NGPipeExpression":
              return !(v.type === "NGRoot" || v.type === "NGMicrosyntaxExpression" || v.type === "ObjectProperty" && !(l.extra && l.extra.parenthesized) || v.type === "ArrayExpression" || g(v) && v.arguments[S] === l || S === "right" && v.type === "NGPipeExpression" || S === "property" && v.type === "MemberExpression" || v.type === "AssignmentExpression");
            case "JSXFragment":
            case "JSXElement":
              return S === "callee" || S === "left" && v.type === "BinaryExpression" && v.operator === "<" || v.type !== "ArrayExpression" && v.type !== "ArrowFunctionExpression" && v.type !== "AssignmentExpression" && v.type !== "AssignmentPattern" && v.type !== "BinaryExpression" && v.type !== "NewExpression" && v.type !== "ConditionalExpression" && v.type !== "ExpressionStatement" && v.type !== "JsExpressionRoot" && v.type !== "JSXAttribute" && v.type !== "JSXElement" && v.type !== "JSXExpressionContainer" && v.type !== "JSXFragment" && v.type !== "LogicalExpression" && !g(v) && !T(v) && v.type !== "ReturnStatement" && v.type !== "ThrowStatement" && v.type !== "TypeCastExpression" && v.type !== "VariableDeclarator" && v.type !== "YieldExpression";
            case "TypeAnnotation":
              return S === "returnType" && v.type === "ArrowFunctionExpression" && U(l);
          }
          return !1;
        }
        function B(y) {
          return y.type === "BlockStatement" || y.type === "BreakStatement" || y.type === "ClassBody" || y.type === "ClassDeclaration" || y.type === "ClassMethod" || y.type === "ClassProperty" || y.type === "PropertyDefinition" || y.type === "ClassPrivateProperty" || y.type === "ContinueStatement" || y.type === "DebuggerStatement" || y.type === "DeclareClass" || y.type === "DeclareExportAllDeclaration" || y.type === "DeclareExportDeclaration" || y.type === "DeclareFunction" || y.type === "DeclareInterface" || y.type === "DeclareModule" || y.type === "DeclareModuleExports" || y.type === "DeclareVariable" || y.type === "DoWhileStatement" || y.type === "EnumDeclaration" || y.type === "ExportAllDeclaration" || y.type === "ExportDefaultDeclaration" || y.type === "ExportNamedDeclaration" || y.type === "ExpressionStatement" || y.type === "ForInStatement" || y.type === "ForOfStatement" || y.type === "ForStatement" || y.type === "FunctionDeclaration" || y.type === "IfStatement" || y.type === "ImportDeclaration" || y.type === "InterfaceDeclaration" || y.type === "LabeledStatement" || y.type === "MethodDefinition" || y.type === "ReturnStatement" || y.type === "SwitchStatement" || y.type === "ThrowStatement" || y.type === "TryStatement" || y.type === "TSDeclareFunction" || y.type === "TSEnumDeclaration" || y.type === "TSImportEqualsDeclaration" || y.type === "TSInterfaceDeclaration" || y.type === "TSModuleDeclaration" || y.type === "TSNamespaceExportDeclaration" || y.type === "TypeAlias" || y.type === "VariableDeclaration" || y.type === "WhileStatement" || y.type === "WithStatement";
        }
        function _(y) {
          let R = 0, v = y.getValue();
          for (; v; ) {
            let S = y.getParentNode(R++);
            if (S && S.type === "ForStatement" && S.init === v)
              return !0;
            v = S;
          }
          return !1;
        }
        function U(y) {
          return h(y, (R) => R.type === "ObjectTypeAnnotation" && h(R, (v) => v.type === "FunctionTypeAnnotation" || void 0) || void 0);
        }
        function Q(y) {
          switch (y.type) {
            case "ObjectExpression":
              return !0;
            default:
              return !1;
          }
        }
        function H(y) {
          let R = y.getValue(), v = y.getParentNode(), S = y.getName();
          switch (v.type) {
            case "NGPipeExpression":
              if (typeof S == "number" && v.arguments[S] === R && v.arguments.length - 1 === S)
                return y.callParent(H);
              break;
            case "ObjectProperty":
              if (S === "value") {
                let l = y.getParentNode(1);
                return t(l.properties) === v;
              }
              break;
            case "BinaryExpression":
            case "LogicalExpression":
              if (S === "right")
                return y.callParent(H);
              break;
            case "ConditionalExpression":
              if (S === "alternate")
                return y.callParent(H);
              break;
            case "UnaryExpression":
              if (v.prefix)
                return y.callParent(H);
              break;
          }
          return !1;
        }
        function ge(y, R) {
          let v = y.getValue(), S = y.getParentNode();
          return v.type === "FunctionExpression" || v.type === "ClassExpression" ? S.type === "ExportDefaultDeclaration" || !W(y, R) : !u(v) || S.type !== "ExportDefaultDeclaration" && W(y, R) ? !1 : y.call((l) => ge(l, R), ...e(y, v));
        }
        m.exports = W;
      } }), Xs = Ce({ "src/language-js/print-preprocess.js"(o, m) {
        Be();
        function t(p, c) {
          switch (c.parser) {
            case "json":
            case "json5":
            case "json-stringify":
            case "__js_expression":
            case "__vue_expression":
            case "__vue_ts_expression":
              return Object.assign(Object.assign({}, p), {}, { type: c.parser.startsWith("__") ? "JsExpressionRoot" : "JsonRoot", node: p, comments: [], rootMarker: c.rootMarker });
            default:
              return p;
          }
        }
        m.exports = t;
      } }), Hs = Ce({ "src/language-js/print/html-binding.js"(o, m) {
        Be();
        var { builders: { join: t, line: p, group: c, softline: e, indent: i } } = sr();
        function u(D, E, C) {
          let F = D.getValue();
          if (E.__onHtmlBindingRoot && D.getName() === null && E.__onHtmlBindingRoot(F, E), F.type === "File") {
            if (E.__isVueForBindingLeft)
              return D.call((g) => {
                let b = t([",", p], g.map(C, "params")), { params: T } = g.getValue();
                return T.length === 1 ? b : ["(", i([e, c(b)]), e, ")"];
              }, "program", "body", 0);
            if (E.__isVueBindings)
              return D.call((g) => t([",", p], g.map(C, "params")), "program", "body", 0);
          }
        }
        function h(D) {
          switch (D.type) {
            case "MemberExpression":
              switch (D.property.type) {
                case "Identifier":
                case "NumericLiteral":
                case "StringLiteral":
                  return h(D.object);
              }
              return !1;
            case "Identifier":
              return !0;
            default:
              return !1;
          }
        }
        m.exports = { isVueEventBindingExpression: h, printHtmlBinding: u };
      } }), Gu = Ce({ "src/language-js/print/binaryish.js"(o, m) {
        Be();
        var { printComments: t } = tn(), { getLast: p } = yr(), { builders: { join: c, line: e, softline: i, group: u, indent: h, align: D, indentIfBreak: E }, utils: { cleanDoc: C, getDocParts: F, isConcat: g } } = sr(), { hasLeadingOwnLineComment: b, isBinaryish: T, isJsxNode: G, shouldFlatten: W, hasComment: B, CommentCheckFlags: _, isCallExpression: U, isMemberExpression: Q, isObjectProperty: H, isEnabledHackPipeline: ge } = Vr(), y = 0;
        function R(l, A, w) {
          let I = l.getValue(), O = l.getParentNode(), M = l.getParentNode(1), ee = I !== O.body && (O.type === "IfStatement" || O.type === "WhileStatement" || O.type === "SwitchStatement" || O.type === "DoWhileStatement"), pe = ge(A) && I.operator === "|>", he = v(l, w, A, !1, ee);
          if (ee)
            return he;
          if (pe)
            return u(he);
          if (U(O) && O.callee === I || O.type === "UnaryExpression" || Q(O) && !O.computed)
            return u([h([i, ...he]), i]);
          let ce = O.type === "ReturnStatement" || O.type === "ThrowStatement" || O.type === "JSXExpressionContainer" && M.type === "JSXAttribute" || I.operator !== "|" && O.type === "JsExpressionRoot" || I.type !== "NGPipeExpression" && (O.type === "NGRoot" && A.parser === "__ng_binding" || O.type === "NGMicrosyntaxExpression" && M.type === "NGMicrosyntax" && M.body.length === 1) || I === O.body && O.type === "ArrowFunctionExpression" || I !== O.body && O.type === "ForStatement" || O.type === "ConditionalExpression" && M.type !== "ReturnStatement" && M.type !== "ThrowStatement" && !U(M) || O.type === "TemplateLiteral", xe = O.type === "AssignmentExpression" || O.type === "VariableDeclarator" || O.type === "ClassProperty" || O.type === "PropertyDefinition" || O.type === "TSAbstractPropertyDefinition" || O.type === "ClassPrivateProperty" || H(O), ie = T(I.left) && W(I.operator, I.left.operator);
          if (ce || S(I) && !ie || !S(I) && xe)
            return u(he);
          if (he.length === 0)
            return "";
          let je = G(I.right), de = he.findIndex((me) => typeof me != "string" && !Array.isArray(me) && me.type === "group"), oe = he.slice(0, de === -1 ? 1 : de + 1), Ne = he.slice(oe.length, je ? -1 : void 0), Je = Symbol("logicalChain-" + ++y), _e = u([...oe, h(Ne)], { id: Je });
          if (!je)
            return _e;
          let it = p(he);
          return u([_e, E(it, { groupId: Je })]);
        }
        function v(l, A, w, I, O) {
          let M = l.getValue();
          if (!T(M))
            return [u(A())];
          let ee = [];
          W(M.operator, M.left.operator) ? ee = l.call((Ne) => v(Ne, A, w, !0, O), "left") : ee.push(u(A("left")));
          let pe = S(M), he = (M.operator === "|>" || M.type === "NGPipeExpression" || M.operator === "|" && w.parser === "__vue_expression") && !b(w.originalText, M.right), ce = M.type === "NGPipeExpression" ? "|" : M.operator, xe = M.type === "NGPipeExpression" && M.arguments.length > 0 ? u(h([e, ": ", c([e, ": "], l.map(A, "arguments").map((Ne) => D(2, u(Ne))))])) : "", ie;
          if (pe)
            ie = [ce, " ", A("right"), xe];
          else {
            let Ne = ge(w) && ce === "|>" ? l.call((Je) => v(Je, A, w, !0, O), "right") : A("right");
            ie = [he ? e : "", ce, he ? " " : e, Ne, xe];
          }
          let je = l.getParentNode(), de = B(M.left, _.Trailing | _.Line), oe = de || !(O && M.type === "LogicalExpression") && je.type !== M.type && M.left.type !== M.type && M.right.type !== M.type;
          if (ee.push(he ? "" : " ", oe ? u(ie, { shouldBreak: de }) : ie), I && B(M)) {
            let Ne = C(t(l, ee, w));
            return g(Ne) || Ne.type === "fill" ? F(Ne) : [Ne];
          }
          return ee;
        }
        function S(l) {
          return l.type !== "LogicalExpression" ? !1 : !!(l.right.type === "ObjectExpression" && l.right.properties.length > 0 || l.right.type === "ArrayExpression" && l.right.elements.length > 0 || G(l.right));
        }
        m.exports = { printBinaryishExpression: R, shouldInlineLogicalExpression: S };
      } }), Ba = Ce({ "src/language-js/print/angular.js"(o, m) {
        Be();
        var { builders: { join: t, line: p, group: c } } = sr(), { hasNode: e, hasComment: i, getComments: u } = Vr(), { printBinaryishExpression: h } = Gu();
        function D(F, g, b) {
          let T = F.getValue();
          if (T.type.startsWith("NG"))
            switch (T.type) {
              case "NGRoot":
                return [b("node"), i(T.node) ? " //" + u(T.node)[0].value.trimEnd() : ""];
              case "NGPipeExpression":
                return h(F, g, b);
              case "NGChainedExpression":
                return c(t([";", p], F.map((G) => C(G) ? b() : ["(", b(), ")"], "expressions")));
              case "NGEmptyExpression":
                return "";
              case "NGQuotedExpression":
                return [T.prefix, ": ", T.value.trim()];
              case "NGMicrosyntax":
                return F.map((G, W) => [W === 0 ? "" : E(G.getValue(), W, T) ? " " : [";", p], b()], "body");
              case "NGMicrosyntaxKey":
                return /^[$_a-z][\w$]*(?:-[$_a-z][\w$])*$/i.test(T.name) ? T.name : JSON.stringify(T.name);
              case "NGMicrosyntaxExpression":
                return [b("expression"), T.alias === null ? "" : [" as ", b("alias")]];
              case "NGMicrosyntaxKeyedExpression": {
                let G = F.getName(), W = F.getParentNode(), B = E(T, G, W) || (G === 1 && (T.key.name === "then" || T.key.name === "else") || G === 2 && T.key.name === "else" && W.body[G - 1].type === "NGMicrosyntaxKeyedExpression" && W.body[G - 1].key.name === "then") && W.body[0].type === "NGMicrosyntaxExpression";
                return [b("key"), B ? " " : ": ", b("expression")];
              }
              case "NGMicrosyntaxLet":
                return ["let ", b("key"), T.value === null ? "" : [" = ", b("value")]];
              case "NGMicrosyntaxAs":
                return [b("key"), " as ", b("alias")];
              default:
                throw new Error(`Unknown Angular node type: ${JSON.stringify(T.type)}.`);
            }
        }
        function E(F, g, b) {
          return F.type === "NGMicrosyntaxKeyedExpression" && F.key.name === "of" && g === 1 && b.body[0].type === "NGMicrosyntaxLet" && b.body[0].value === null;
        }
        function C(F) {
          return e(F.getValue(), (g) => {
            switch (g.type) {
              case void 0:
                return !1;
              case "CallExpression":
              case "OptionalCallExpression":
              case "AssignmentExpression":
                return !0;
            }
          });
        }
        m.exports = { printAngular: D };
      } }), Ro = Ce({ "src/language-js/print/jsx.js"(o, m) {
        Be();
        var { printComments: t, printDanglingComments: p, printCommentsSeparately: c } = tn(), { builders: { line: e, hardline: i, softline: u, group: h, indent: D, conditionalGroup: E, fill: C, ifBreak: F, lineSuffixBoundary: g, join: b }, utils: { willBreak: T } } = sr(), { getLast: G, getPreferredQuote: W } = yr(), { isJsxNode: B, rawText: _, isCallExpression: U, isStringLiteral: Q, isBinaryish: H, hasComment: ge, CommentCheckFlags: y, hasNodeIgnoreComment: R } = Vr(), v = ai(), { willPrintOwnComments: S } = Uu(), l = (be) => be === "" || be === e || be === i || be === u;
        function A(be, Oe, Re) {
          let ut = be.getValue();
          if (ut.type === "JSXElement" && Qe(ut))
            return [Re("openingElement"), Re("closingElement")];
          let ht = ut.type === "JSXElement" ? Re("openingElement") : Re("openingFragment"), vt = ut.type === "JSXElement" ? Re("closingElement") : Re("closingFragment");
          if (ut.children.length === 1 && ut.children[0].type === "JSXExpressionContainer" && (ut.children[0].expression.type === "TemplateLiteral" || ut.children[0].expression.type === "TaggedTemplateExpression"))
            return [ht, ...be.map(Re, "children"), vt];
          ut.children = ut.children.map((N) => kt(N) ? { type: "JSXText", value: " ", raw: " " } : N);
          let Ut = ut.children.some(B), Dr = ut.children.filter((N) => N.type === "JSXExpressionContainer").length > 1, mr = ut.type === "JSXElement" && ut.openingElement.attributes.length > 1, Vt = T(ht) || Ut || mr || Dr, Qt = be.getParentNode().rootMarker === "mdx", Xe = Oe.singleQuote ? "{' '}" : '{" "}', ye = Qt ? " " : F([Xe, u], " "), tt = ut.openingElement && ut.openingElement.name && ut.openingElement.name.name === "fbt", Te = w(be, Oe, Re, ye, tt), rt = ut.children.some((N) => Ze(N));
          for (let N = Te.length - 2; N >= 0; N--) {
            let Fe = Te[N] === "" && Te[N + 1] === "", Ue = Te[N] === i && Te[N + 1] === "" && Te[N + 2] === i, yt = (Te[N] === u || Te[N] === i) && Te[N + 1] === "" && Te[N + 2] === ye, Et = Te[N] === ye && Te[N + 1] === "" && (Te[N + 2] === u || Te[N + 2] === i), $t = Te[N] === ye && Te[N + 1] === "" && Te[N + 2] === ye, bt = Te[N] === u && Te[N + 1] === "" && Te[N + 2] === i || Te[N] === i && Te[N + 1] === "" && Te[N + 2] === u;
            Ue && rt || Fe || yt || $t || bt ? Te.splice(N, 2) : Et && Te.splice(N + 1, 2);
          }
          for (; Te.length > 0 && l(G(Te)); )
            Te.pop();
          for (; Te.length > 1 && l(Te[0]) && l(Te[1]); )
            Te.shift(), Te.shift();
          let jt = [];
          for (let [N, Fe] of Te.entries()) {
            if (Fe === ye) {
              if (N === 1 && Te[N - 1] === "") {
                if (Te.length === 2) {
                  jt.push(Xe);
                  continue;
                }
                jt.push([Xe, i]);
                continue;
              } else if (N === Te.length - 1) {
                jt.push(Xe);
                continue;
              } else if (Te[N - 1] === "" && Te[N - 2] === i) {
                jt.push(Xe);
                continue;
              }
            }
            jt.push(Fe), T(Fe) && (Vt = !0);
          }
          let Ct = rt ? C(jt) : h(jt, { shouldBreak: !0 });
          if (Qt)
            return Ct;
          let nt = h([ht, D([i, Ct]), i, vt]);
          return Vt ? nt : E([h([ht, ...Te, vt]), nt]);
        }
        function w(be, Oe, Re, ut, ht) {
          let vt = [];
          return be.each((Ut, Dr, mr) => {
            let Vt = Ut.getValue();
            if (Vt.type === "JSXText") {
              let Qt = _(Vt);
              if (Ze(Vt)) {
                let Xe = Qt.split(it);
                if (Xe[0] === "") {
                  if (vt.push(""), Xe.shift(), /\n/.test(Xe[0])) {
                    let tt = mr[Dr + 1];
                    vt.push(O(ht, Xe[1], Vt, tt));
                  } else
                    vt.push(ut);
                  Xe.shift();
                }
                let ye;
                if (G(Xe) === "" && (Xe.pop(), ye = Xe.pop()), Xe.length === 0)
                  return;
                for (let [tt, Te] of Xe.entries())
                  tt % 2 === 1 ? vt.push(e) : vt.push(Te);
                if (ye !== void 0)
                  if (/\n/.test(ye)) {
                    let tt = mr[Dr + 1];
                    vt.push(O(ht, G(vt), Vt, tt));
                  } else
                    vt.push(ut);
                else {
                  let tt = mr[Dr + 1];
                  vt.push(I(ht, G(vt), Vt, tt));
                }
              } else
                /\n/.test(Qt) ? Qt.match(/\n/g).length > 1 && vt.push("", i) : vt.push("", ut);
            } else {
              let Qt = Re();
              vt.push(Qt);
              let Xe = mr[Dr + 1];
              if (Xe && Ze(Xe)) {
                let ye = Se(_(Xe)).split(it)[0];
                vt.push(I(ht, ye, Vt, Xe));
              } else
                vt.push(i);
            }
          }, "children"), vt;
        }
        function I(be, Oe, Re, ut) {
          return be ? "" : Re.type === "JSXElement" && !Re.closingElement || ut && ut.type === "JSXElement" && !ut.closingElement ? Oe.length === 1 ? u : i : u;
        }
        function O(be, Oe, Re, ut) {
          return be ? i : Oe.length === 1 ? Re.type === "JSXElement" && !Re.closingElement || ut && ut.type === "JSXElement" && !ut.closingElement ? i : u : i;
        }
        function M(be, Oe, Re) {
          let ut = be.getParentNode();
          if (!ut || { ArrayExpression: !0, JSXAttribute: !0, JSXElement: !0, JSXExpressionContainer: !0, JSXFragment: !0, ExpressionStatement: !0, CallExpression: !0, OptionalCallExpression: !0, ConditionalExpression: !0, JsExpressionRoot: !0 }[ut.type])
            return Oe;
          let ht = be.match(void 0, (Ut) => Ut.type === "ArrowFunctionExpression", U, (Ut) => Ut.type === "JSXExpressionContainer"), vt = v(be, Re);
          return h([vt ? "" : F("("), D([u, Oe]), u, vt ? "" : F(")")], { shouldBreak: ht });
        }
        function ee(be, Oe, Re) {
          let ut = be.getValue(), ht = [];
          if (ht.push(Re("name")), ut.value) {
            let vt;
            if (Q(ut.value)) {
              let Ut = _(ut.value).slice(1, -1).replace(/&apos;/g, "'").replace(/&quot;/g, '"'), { escaped: Dr, quote: mr, regex: Vt } = W(Ut, Oe.jsxSingleQuote ? "'" : '"');
              Ut = Ut.replace(Vt, Dr);
              let { leading: Qt, trailing: Xe } = be.call(() => c(be, Oe), "value");
              vt = [Qt, mr, Ut, mr, Xe];
            } else
              vt = Re("value");
            ht.push("=", vt);
          }
          return ht;
        }
        function pe(be, Oe, Re) {
          let ut = be.getValue(), ht = (vt, Ut) => vt.type === "JSXEmptyExpression" || !ge(vt) && (vt.type === "ArrayExpression" || vt.type === "ObjectExpression" || vt.type === "ArrowFunctionExpression" || vt.type === "AwaitExpression" && (ht(vt.argument, vt) || vt.argument.type === "JSXElement") || U(vt) || vt.type === "FunctionExpression" || vt.type === "TemplateLiteral" || vt.type === "TaggedTemplateExpression" || vt.type === "DoExpression" || B(Ut) && (vt.type === "ConditionalExpression" || H(vt)));
          return ht(ut.expression, be.getParentNode(0)) ? h(["{", Re("expression"), g, "}"]) : h(["{", D([u, Re("expression")]), u, g, "}"]);
        }
        function he(be, Oe, Re) {
          let ut = be.getValue(), ht = ut.name && ge(ut.name) || ut.typeParameters && ge(ut.typeParameters);
          if (ut.selfClosing && ut.attributes.length === 0 && !ht)
            return ["<", Re("name"), Re("typeParameters"), " />"];
          if (ut.attributes && ut.attributes.length === 1 && ut.attributes[0].value && Q(ut.attributes[0].value) && !ut.attributes[0].value.value.includes(`
`) && !ht && !ge(ut.attributes[0]))
            return h(["<", Re("name"), Re("typeParameters"), " ", ...be.map(Re, "attributes"), ut.selfClosing ? " />" : ">"]);
          let vt = ut.attributes && ut.attributes.some((Dr) => Dr.value && Q(Dr.value) && Dr.value.value.includes(`
`)), Ut = Oe.singleAttributePerLine && ut.attributes.length > 1 ? i : e;
          return h(["<", Re("name"), Re("typeParameters"), D(be.map(() => [Ut, Re()], "attributes")), ...ce(ut, Oe, ht)], { shouldBreak: vt });
        }
        function ce(be, Oe, Re) {
          return be.selfClosing ? [e, "/>"] : xe(be, Oe, Re) ? [">"] : [u, ">"];
        }
        function xe(be, Oe, Re) {
          let ut = be.attributes.length > 0 && ge(G(be.attributes), y.Trailing);
          return be.attributes.length === 0 && !Re || (Oe.bracketSameLine || Oe.jsxBracketSameLine) && (!Re || be.attributes.length > 0) && !ut;
        }
        function ie(be, Oe, Re) {
          let ut = be.getValue(), ht = [];
          ht.push("</");
          let vt = Re("name");
          return ge(ut.name, y.Leading | y.Line) ? ht.push(D([i, vt]), i) : ge(ut.name, y.Leading | y.Block) ? ht.push(" ", vt) : ht.push(vt), ht.push(">"), ht;
        }
        function je(be, Oe) {
          let Re = be.getValue(), ut = ge(Re), ht = ge(Re, y.Line), vt = Re.type === "JSXOpeningFragment";
          return [vt ? "<" : "</", D([ht ? i : ut && !vt ? " " : "", p(be, Oe, !0)]), ht ? i : "", ">"];
        }
        function de(be, Oe, Re) {
          let ut = t(be, A(be, Oe, Re), Oe);
          return M(be, ut, Oe);
        }
        function oe(be, Oe) {
          let Re = be.getValue(), ut = ge(Re, y.Line);
          return [p(be, Oe, !ut), ut ? i : ""];
        }
        function Ne(be, Oe, Re) {
          let ut = be.getValue();
          return ["{", be.call((ht) => {
            let vt = ["...", Re()], Ut = ht.getValue();
            return !ge(Ut) || !S(ht) ? vt : [D([u, t(ht, vt, Oe)]), u];
          }, ut.type === "JSXSpreadAttribute" ? "argument" : "expression"), "}"];
        }
        function Je(be, Oe, Re) {
          let ut = be.getValue();
          if (ut.type.startsWith("JSX"))
            switch (ut.type) {
              case "JSXAttribute":
                return ee(be, Oe, Re);
              case "JSXIdentifier":
                return String(ut.name);
              case "JSXNamespacedName":
                return b(":", [Re("namespace"), Re("name")]);
              case "JSXMemberExpression":
                return b(".", [Re("object"), Re("property")]);
              case "JSXSpreadAttribute":
                return Ne(be, Oe, Re);
              case "JSXSpreadChild":
                return Ne(be, Oe, Re);
              case "JSXExpressionContainer":
                return pe(be, Oe, Re);
              case "JSXFragment":
              case "JSXElement":
                return de(be, Oe, Re);
              case "JSXOpeningElement":
                return he(be, Oe, Re);
              case "JSXClosingElement":
                return ie(be, Oe, Re);
              case "JSXOpeningFragment":
              case "JSXClosingFragment":
                return je(be, Oe);
              case "JSXEmptyExpression":
                return oe(be, Oe);
              case "JSXText":
                throw new Error("JSXText should be handled by JSXElement");
              default:
                throw new Error(`Unknown JSX node type: ${JSON.stringify(ut.type)}.`);
            }
        }
        var _e = ` 
\r	`, it = new RegExp("([" + _e + "]+)"), me = new RegExp("[^" + _e + "]"), Se = (be) => be.replace(new RegExp("(?:^" + it.source + "|" + it.source + "$)"), "");
        function Qe(be) {
          if (be.children.length === 0)
            return !0;
          if (be.children.length > 1)
            return !1;
          let Oe = be.children[0];
          return Oe.type === "JSXText" && !Ze(Oe);
        }
        function Ze(be) {
          return be.type === "JSXText" && (me.test(_(be)) || !/\n/.test(_(be)));
        }
        function kt(be) {
          return be.type === "JSXExpressionContainer" && Q(be.expression) && be.expression.value === " " && !ge(be.expression);
        }
        function ke(be) {
          let Oe = be.getValue(), Re = be.getParentNode();
          if (!Re || !Oe || !B(Oe) || !B(Re))
            return !1;
          let ut = Re.children.indexOf(Oe), ht = null;
          for (let vt = ut; vt > 0; vt--) {
            let Ut = Re.children[vt - 1];
            if (!(Ut.type === "JSXText" && !Ze(Ut))) {
              ht = Ut;
              break;
            }
          }
          return ht && ht.type === "JSXExpressionContainer" && ht.expression.type === "JSXEmptyExpression" && R(ht.expression);
        }
        m.exports = { hasJsxIgnoreComment: ke, printJsx: Je };
      } }), Cn = Ce({ "src/language-js/print/misc.js"(o, m) {
        Be();
        var { isNonEmptyArray: t } = yr(), { builders: { indent: p, join: c, line: e } } = sr(), { isFlowAnnotationComment: i } = Vr();
        function u(G) {
          let W = G.getValue();
          return !W.optional || W.type === "Identifier" && W === G.getParentNode().key ? "" : W.type === "OptionalCallExpression" || W.type === "OptionalMemberExpression" && W.computed ? "?." : "?";
        }
        function h(G) {
          return G.getValue().definite || G.match(void 0, (W, B) => B === "id" && W.type === "VariableDeclarator" && W.definite) ? "!" : "";
        }
        function D(G, W, B) {
          let _ = G.getValue();
          return _.typeArguments ? B("typeArguments") : _.typeParameters ? B("typeParameters") : "";
        }
        function E(G, W, B) {
          let _ = G.getValue();
          if (!_.typeAnnotation)
            return "";
          let U = G.getParentNode(), Q = U.type === "DeclareFunction" && U.id === _;
          return i(W.originalText, _.typeAnnotation) ? [" /*: ", B("typeAnnotation"), " */"] : [Q ? "" : ": ", B("typeAnnotation")];
        }
        function C(G, W, B) {
          return ["::", B("callee")];
        }
        function F(G, W, B) {
          let _ = G.getValue();
          return t(_.modifiers) ? [c(" ", G.map(B, "modifiers")), " "] : "";
        }
        function g(G, W, B) {
          return G.type === "EmptyStatement" ? ";" : G.type === "BlockStatement" || B ? [" ", W] : p([e, W]);
        }
        function b(G, W, B) {
          return ["...", B("argument"), E(G, W, B)];
        }
        function T(G, W) {
          let B = G.slice(1, -1);
          if (B.includes('"') || B.includes("'"))
            return G;
          let _ = W.singleQuote ? "'" : '"';
          return _ + B + _;
        }
        m.exports = { printOptionalToken: u, printDefiniteToken: h, printFunctionTypeParameters: D, printBindExpressionCallee: C, printTypeScriptModifiers: F, printTypeAnnotation: E, printRestSpread: b, adjustClause: g, printDirective: T };
      } }), Wi = Ce({ "src/language-js/print/array.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { builders: { line: p, softline: c, hardline: e, group: i, indent: u, ifBreak: h, fill: D } } = sr(), { getLast: E, hasNewline: C } = yr(), { shouldPrintComma: F, hasComment: g, CommentCheckFlags: b, isNextLineEmpty: T, isNumericLiteral: G, isSignedNumericLiteral: W } = Vr(), { locStart: B } = Dn(), { printOptionalToken: _, printTypeAnnotation: U } = Cn();
        function Q(R, v, S) {
          let l = R.getValue(), A = [], w = l.type === "TupleExpression" ? "#[" : "[", I = "]";
          if (l.elements.length === 0)
            g(l, b.Dangling) ? A.push(i([w, t(R, v), c, I])) : A.push(w, I);
          else {
            let O = E(l.elements), M = !(O && O.type === "RestElement"), ee = O === null, pe = Symbol("array"), he = !v.__inJestEach && l.elements.length > 1 && l.elements.every((ie, je, de) => {
              let oe = ie && ie.type;
              if (oe !== "ArrayExpression" && oe !== "ObjectExpression")
                return !1;
              let Ne = de[je + 1];
              if (Ne && oe !== Ne.type)
                return !1;
              let Je = oe === "ArrayExpression" ? "elements" : "properties";
              return ie[Je] && ie[Je].length > 1;
            }), ce = H(l, v), xe = M ? ee ? "," : F(v) ? ce ? h(",", "", { groupId: pe }) : h(",") : "" : "";
            A.push(i([w, u([c, ce ? y(R, v, S, xe) : [ge(R, v, "elements", S), xe], t(R, v, !0)]), c, I], { shouldBreak: he, id: pe }));
          }
          return A.push(_(R), U(R, v, S)), A;
        }
        function H(R, v) {
          return R.elements.length > 1 && R.elements.every((S) => S && (G(S) || W(S) && !g(S.argument)) && !g(S, b.Trailing | b.Line, (l) => !C(v.originalText, B(l), { backwards: !0 })));
        }
        function ge(R, v, S, l) {
          let A = [], w = [];
          return R.each((I) => {
            A.push(w, i(l())), w = [",", p], I.getValue() && T(I.getValue(), v) && w.push(c);
          }, S), A;
        }
        function y(R, v, S, l) {
          let A = [];
          return R.each((w, I, O) => {
            let M = I === O.length - 1;
            A.push([S(), M ? l : ","]), M || A.push(T(w.getValue(), v) ? [e, e] : g(O[I + 1], b.Leading | b.Line) ? e : p);
          }, "elements"), D(A);
        }
        m.exports = { printArray: Q, printArrayItems: ge, isConciselyPrintedArray: H };
      } }), Vo = Ce({ "src/language-js/print/call-arguments.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { getLast: p, getPenultimate: c } = yr(), { getFunctionParameters: e, hasComment: i, CommentCheckFlags: u, isFunctionCompositionArgs: h, isJsxNode: D, isLongCurriedCallExpression: E, shouldPrintComma: C, getCallArguments: F, iterateCallArgumentsPath: g, isNextLineEmpty: b, isCallExpression: T, isStringLiteral: G, isObjectProperty: W, isTSTypeExpression: B } = Vr(), { builders: { line: _, hardline: U, softline: Q, group: H, indent: ge, conditionalGroup: y, ifBreak: R, breakParent: v }, utils: { willBreak: S } } = sr(), { ArgExpansionBailout: l } = Vi(), { isConciselyPrintedArray: A } = Wi();
        function w(ce, xe, ie) {
          let je = ce.getValue(), de = je.type === "ImportExpression", oe = F(je);
          if (oe.length === 0)
            return ["(", t(ce, xe, !0), ")"];
          if (ee(oe))
            return ["(", ie(["arguments", 0]), ", ", ie(["arguments", 1]), ")"];
          let Ne = !1, Je = !1, _e = oe.length - 1, it = [];
          g(ce, (ke, be) => {
            let Oe = ke.getNode(), Re = [ie()];
            be === _e || (b(Oe, xe) ? (be === 0 && (Je = !0), Ne = !0, Re.push(",", U, U)) : Re.push(",", _)), it.push(Re);
          });
          let me = !(de || je.callee && je.callee.type === "Import") && C(xe, "all") ? "," : "";
          function Se() {
            return H(["(", ge([_, ...it]), me, _, ")"], { shouldBreak: !0 });
          }
          if (Ne || ce.getParentNode().type !== "Decorator" && h(oe))
            return Se();
          let Qe = M(oe), Ze = O(oe, xe);
          if (Qe || Ze) {
            if (Qe ? it.slice(1).some(S) : it.slice(0, -1).some(S))
              return Se();
            let ke = [];
            try {
              ce.try(() => {
                g(ce, (be, Oe) => {
                  Qe && Oe === 0 && (ke = [[ie([], { expandFirstArg: !0 }), it.length > 1 ? "," : "", Je ? U : _, Je ? U : ""], ...it.slice(1)]), Ze && Oe === _e && (ke = [...it.slice(0, -1), ie([], { expandLastArg: !0 })]);
                });
              });
            } catch (be) {
              if (be instanceof l)
                return Se();
              throw be;
            }
            return [it.some(S) ? v : "", y([["(", ...ke, ")"], Qe ? ["(", H(ke[0], { shouldBreak: !0 }), ...ke.slice(1), ")"] : ["(", ...it.slice(0, -1), H(p(ke), { shouldBreak: !0 }), ")"], Se()])];
          }
          let kt = ["(", ge([Q, ...it]), R(me), Q, ")"];
          return E(ce) ? kt : H(kt, { shouldBreak: it.some(S) || Ne });
        }
        function I(ce) {
          let xe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
          return ce.type === "ObjectExpression" && (ce.properties.length > 0 || i(ce)) || ce.type === "ArrayExpression" && (ce.elements.length > 0 || i(ce)) || ce.type === "TSTypeAssertion" && I(ce.expression) || B(ce) && I(ce.expression) || ce.type === "FunctionExpression" || ce.type === "ArrowFunctionExpression" && (!ce.returnType || !ce.returnType.typeAnnotation || ce.returnType.typeAnnotation.type !== "TSTypeReference" || pe(ce.body)) && (ce.body.type === "BlockStatement" || ce.body.type === "ArrowFunctionExpression" && I(ce.body, !0) || ce.body.type === "ObjectExpression" || ce.body.type === "ArrayExpression" || !xe && (T(ce.body) || ce.body.type === "ConditionalExpression") || D(ce.body)) || ce.type === "DoExpression" || ce.type === "ModuleExpression";
        }
        function O(ce, xe) {
          let ie = p(ce), je = c(ce);
          return !i(ie, u.Leading) && !i(ie, u.Trailing) && I(ie) && (!je || je.type !== ie.type) && (ce.length !== 2 || je.type !== "ArrowFunctionExpression" || ie.type !== "ArrayExpression") && !(ce.length > 1 && ie.type === "ArrayExpression" && A(ie, xe));
        }
        function M(ce) {
          if (ce.length !== 2)
            return !1;
          let [xe, ie] = ce;
          return xe.type === "ModuleExpression" && he(ie) ? !0 : !i(xe) && (xe.type === "FunctionExpression" || xe.type === "ArrowFunctionExpression" && xe.body.type === "BlockStatement") && ie.type !== "FunctionExpression" && ie.type !== "ArrowFunctionExpression" && ie.type !== "ConditionalExpression" && !I(ie);
        }
        function ee(ce) {
          return ce.length === 2 && ce[0].type === "ArrowFunctionExpression" && e(ce[0]).length === 0 && ce[0].body.type === "BlockStatement" && ce[1].type === "ArrayExpression" && !ce.some((xe) => i(xe));
        }
        function pe(ce) {
          return ce.type === "BlockStatement" && (ce.body.some((xe) => xe.type !== "EmptyStatement") || i(ce, u.Dangling));
        }
        function he(ce) {
          return ce.type === "ObjectExpression" && ce.properties.length === 1 && W(ce.properties[0]) && ce.properties[0].key.type === "Identifier" && ce.properties[0].key.name === "type" && G(ce.properties[0].value) && ce.properties[0].value.value === "module";
        }
        m.exports = w;
      } }), qo = Ce({ "src/language-js/print/member.js"(o, m) {
        Be();
        var { builders: { softline: t, group: p, indent: c, label: e } } = sr(), { isNumericLiteral: i, isMemberExpression: u, isCallExpression: h } = Vr(), { printOptionalToken: D } = Cn();
        function E(F, g, b) {
          let T = F.getValue(), G = F.getParentNode(), W, B = 0;
          do
            W = F.getParentNode(B), B++;
          while (W && (u(W) || W.type === "TSNonNullExpression"));
          let _ = b("object"), U = C(F, g, b), Q = W && (W.type === "NewExpression" || W.type === "BindExpression" || W.type === "AssignmentExpression" && W.left.type !== "Identifier") || T.computed || T.object.type === "Identifier" && T.property.type === "Identifier" && !u(G) || (G.type === "AssignmentExpression" || G.type === "VariableDeclarator") && (h(T.object) && T.object.arguments.length > 0 || T.object.type === "TSNonNullExpression" && h(T.object.expression) && T.object.expression.arguments.length > 0 || _.label === "member-chain");
          return e(_.label === "member-chain" ? "member-chain" : "member", [_, Q ? U : p(c([t, U]))]);
        }
        function C(F, g, b) {
          let T = b("property"), G = F.getValue(), W = D(F);
          return G.computed ? !G.property || i(G.property) ? [W, "[", T, "]"] : p([W, "[", c([t, T]), t, "]"]) : [W, ".", T];
        }
        m.exports = { printMemberExpression: E, printMemberLookup: C };
      } }), Na = Ce({ "src/language-js/print/member-chain.js"(o, m) {
        Be();
        var { printComments: t } = tn(), { getLast: p, isNextLineEmptyAfterIndex: c, getNextNonSpaceNonCommentCharacterIndex: e } = yr(), i = ai(), { isCallExpression: u, isMemberExpression: h, isFunctionOrArrowExpression: D, isLongCurriedCallExpression: E, isMemberish: C, isNumericLiteral: F, isSimpleCallArgument: g, hasComment: b, CommentCheckFlags: T, isNextLineEmpty: G } = Vr(), { locEnd: W } = Dn(), { builders: { join: B, hardline: _, group: U, indent: Q, conditionalGroup: H, breakParent: ge, label: y }, utils: { willBreak: R } } = sr(), v = Vo(), { printMemberLookup: S } = qo(), { printOptionalToken: l, printFunctionTypeParameters: A, printBindExpressionCallee: w } = Cn();
        function I(O, M, ee) {
          let pe = O.getParentNode(), he = !pe || pe.type === "ExpressionStatement", ce = [];
          function xe(Vt) {
            let { originalText: Qt } = M, Xe = e(Qt, Vt, W);
            return Qt.charAt(Xe) === ")" ? Xe !== !1 && c(Qt, Xe + 1) : G(Vt, M);
          }
          function ie(Vt) {
            let Qt = Vt.getValue();
            u(Qt) && (C(Qt.callee) || u(Qt.callee)) ? (ce.unshift({ node: Qt, printed: [t(Vt, [l(Vt), A(Vt, M, ee), v(Vt, M, ee)], M), xe(Qt) ? _ : ""] }), Vt.call((Xe) => ie(Xe), "callee")) : C(Qt) ? (ce.unshift({ node: Qt, needsParens: i(Vt, M), printed: t(Vt, h(Qt) ? S(Vt, M, ee) : w(Vt, M, ee), M) }), Vt.call((Xe) => ie(Xe), "object")) : Qt.type === "TSNonNullExpression" ? (ce.unshift({ node: Qt, printed: t(Vt, "!", M) }), Vt.call((Xe) => ie(Xe), "expression")) : ce.unshift({ node: Qt, printed: ee() });
          }
          let je = O.getValue();
          ce.unshift({ node: je, printed: [l(O), A(O, M, ee), v(O, M, ee)] }), je.callee && O.call((Vt) => ie(Vt), "callee");
          let de = [], oe = [ce[0]], Ne = 1;
          for (; Ne < ce.length && (ce[Ne].node.type === "TSNonNullExpression" || u(ce[Ne].node) || h(ce[Ne].node) && ce[Ne].node.computed && F(ce[Ne].node.property)); ++Ne)
            oe.push(ce[Ne]);
          if (!u(ce[0].node))
            for (; Ne + 1 < ce.length && C(ce[Ne].node) && C(ce[Ne + 1].node); ++Ne)
              oe.push(ce[Ne]);
          de.push(oe), oe = [];
          let Je = !1;
          for (; Ne < ce.length; ++Ne) {
            if (Je && C(ce[Ne].node)) {
              if (ce[Ne].node.computed && F(ce[Ne].node.property)) {
                oe.push(ce[Ne]);
                continue;
              }
              de.push(oe), oe = [], Je = !1;
            }
            (u(ce[Ne].node) || ce[Ne].node.type === "ImportExpression") && (Je = !0), oe.push(ce[Ne]), b(ce[Ne].node, T.Trailing) && (de.push(oe), oe = [], Je = !1);
          }
          oe.length > 0 && de.push(oe);
          function _e(Vt) {
            return /^[A-Z]|^[$_]+$/.test(Vt);
          }
          function it(Vt) {
            return Vt.length <= M.tabWidth;
          }
          function me(Vt) {
            let Qt = Vt[1].length > 0 && Vt[1][0].node.computed;
            if (Vt[0].length === 1) {
              let ye = Vt[0][0].node;
              return ye.type === "ThisExpression" || ye.type === "Identifier" && (_e(ye.name) || he && it(ye.name) || Qt);
            }
            let Xe = p(Vt[0]).node;
            return h(Xe) && Xe.property.type === "Identifier" && (_e(Xe.property.name) || Qt);
          }
          let Se = de.length >= 2 && !b(de[1][0].node) && me(de);
          function Qe(Vt) {
            let Qt = Vt.map((Xe) => Xe.printed);
            return Vt.length > 0 && p(Vt).needsParens ? ["(", ...Qt, ")"] : Qt;
          }
          function Ze(Vt) {
            return Vt.length === 0 ? "" : Q(U([_, B(_, Vt.map(Qe))]));
          }
          let kt = de.map(Qe), ke = kt, be = Se ? 3 : 2, Oe = de.flat(), Re = Oe.slice(1, -1).some((Vt) => b(Vt.node, T.Leading)) || Oe.slice(0, -1).some((Vt) => b(Vt.node, T.Trailing)) || de[be] && b(de[be][0].node, T.Leading);
          if (de.length <= be && !Re)
            return E(O) ? ke : U(ke);
          let ut = p(de[Se ? 1 : 0]).node, ht = !u(ut) && xe(ut), vt = [Qe(de[0]), Se ? de.slice(1, 2).map(Qe) : "", ht ? _ : "", Ze(de.slice(Se ? 2 : 1))], Ut = ce.map((Vt) => {
            let { node: Qt } = Vt;
            return Qt;
          }).filter(u);
          function Dr() {
            let Vt = p(p(de)).node, Qt = p(kt);
            return u(Vt) && R(Qt) && Ut.slice(0, -1).some((Xe) => Xe.arguments.some(D));
          }
          let mr;
          return Re || Ut.length > 2 && Ut.some((Vt) => !Vt.arguments.every((Qt) => g(Qt, 0))) || kt.slice(0, -1).some(R) || Dr() ? mr = U(vt) : mr = [R(ke) || ht ? ge : "", H([ke, vt])], y("member-chain", mr);
        }
        m.exports = I;
      } }), Jo = Ce({ "src/language-js/print/call-expression.js"(o, m) {
        Be();
        var { builders: { join: t, group: p } } = sr(), c = ai(), { getCallArguments: e, hasFlowAnnotationComment: i, isCallExpression: u, isMemberish: h, isStringLiteral: D, isTemplateOnItsOwnLine: E, isTestCall: C, iterateCallArgumentsPath: F } = Vr(), g = Na(), b = Vo(), { printOptionalToken: T, printFunctionTypeParameters: G } = Cn();
        function W(_, U, Q) {
          let H = _.getValue(), ge = _.getParentNode(), y = H.type === "NewExpression", R = H.type === "ImportExpression", v = T(_), S = e(H);
          if (S.length > 0 && (!R && !y && B(H, ge) || S.length === 1 && E(S[0], U.originalText) || !y && C(H, ge))) {
            let w = [];
            return F(_, () => {
              w.push(Q());
            }), [y ? "new " : "", Q("callee"), v, G(_, U, Q), "(", t(", ", w), ")"];
          }
          let l = (U.parser === "babel" || U.parser === "babel-flow") && H.callee && H.callee.type === "Identifier" && i(H.callee.trailingComments);
          if (l && (H.callee.trailingComments[0].printed = !0), !R && !y && h(H.callee) && !_.call((w) => c(w, U), "callee"))
            return g(_, U, Q);
          let A = [y ? "new " : "", R ? "import" : Q("callee"), v, l ? `/*:: ${H.callee.trailingComments[0].value.slice(2).trim()} */` : "", G(_, U, Q), b(_, U, Q)];
          return R || u(H.callee) ? p(A) : A;
        }
        function B(_, U) {
          if (_.callee.type !== "Identifier")
            return !1;
          if (_.callee.name === "require")
            return !0;
          if (_.callee.name === "define") {
            let Q = e(_);
            return U.type === "ExpressionStatement" && (Q.length === 1 || Q.length === 2 && Q[0].type === "ArrayExpression" || Q.length === 3 && D(Q[0]) && Q[1].type === "ArrayExpression");
          }
          return !1;
        }
        m.exports = { printCallExpression: W };
      } }), Xi = Ce({ "src/language-js/print/assignment.js"(o, m) {
        Be();
        var { isNonEmptyArray: t, getStringWidth: p } = yr(), { builders: { line: c, group: e, indent: i, indentIfBreak: u, lineSuffixBoundary: h }, utils: { cleanDoc: D, willBreak: E, canBreak: C } } = sr(), { hasLeadingOwnLineComment: F, isBinaryish: g, isStringLiteral: b, isLiteral: T, isNumericLiteral: G, isCallExpression: W, isMemberExpression: B, getCallArguments: _, rawText: U, hasComment: Q, isSignedNumericLiteral: H, isObjectProperty: ge } = Vr(), { shouldInlineLogicalExpression: y } = Gu(), { printCallExpression: R } = Jo();
        function v(me, Se, Qe, Ze, kt, ke) {
          let be = A(me, Se, Qe, Ze, ke), Oe = Qe(ke, { assignmentLayout: be });
          switch (be) {
            case "break-after-operator":
              return e([e(Ze), kt, e(i([c, Oe]))]);
            case "never-break-after-operator":
              return e([e(Ze), kt, " ", Oe]);
            case "fluid": {
              let Re = Symbol("assignment");
              return e([e(Ze), kt, e(i(c), { id: Re }), h, u(Oe, { groupId: Re })]);
            }
            case "break-lhs":
              return e([Ze, kt, " ", e(Oe)]);
            case "chain":
              return [e(Ze), kt, c, Oe];
            case "chain-tail":
              return [e(Ze), kt, i([c, Oe])];
            case "chain-tail-arrow-chain":
              return [e(Ze), kt, Oe];
            case "only-left":
              return Ze;
          }
        }
        function S(me, Se, Qe) {
          let Ze = me.getValue();
          return v(me, Se, Qe, Qe("left"), [" ", Ze.operator], "right");
        }
        function l(me, Se, Qe) {
          return v(me, Se, Qe, Qe("id"), " =", "init");
        }
        function A(me, Se, Qe, Ze, kt) {
          let ke = me.getValue(), be = ke[kt];
          if (!be)
            return "only-left";
          let Oe = !O(be);
          if (me.match(O, M, (ut) => !Oe || ut.type !== "ExpressionStatement" && ut.type !== "VariableDeclaration"))
            return Oe ? be.type === "ArrowFunctionExpression" && be.body.type === "ArrowFunctionExpression" ? "chain-tail-arrow-chain" : "chain-tail" : "chain";
          if (!Oe && O(be.right) || F(Se.originalText, be))
            return "break-after-operator";
          if (be.type === "CallExpression" && be.callee.name === "require" || Se.parser === "json5" || Se.parser === "json")
            return "never-break-after-operator";
          if (I(ke) || ee(ke) || ce(ke) || xe(ke) && C(Ze))
            return "break-lhs";
          let Re = Je(ke, Ze, Se);
          return me.call(() => w(me, Se, Qe, Re), kt) ? "break-after-operator" : Re || be.type === "TemplateLiteral" || be.type === "TaggedTemplateExpression" || be.type === "BooleanLiteral" || G(be) || be.type === "ClassExpression" ? "never-break-after-operator" : "fluid";
        }
        function w(me, Se, Qe, Ze) {
          let kt = me.getValue();
          if (g(kt) && !y(kt))
            return !0;
          switch (kt.type) {
            case "StringLiteralTypeAnnotation":
            case "SequenceExpression":
              return !0;
            case "ConditionalExpression": {
              let { test: Oe } = kt;
              return g(Oe) && !y(Oe);
            }
            case "ClassExpression":
              return t(kt.decorators);
          }
          if (Ze)
            return !1;
          let ke = kt, be = [];
          for (; ; )
            if (ke.type === "UnaryExpression")
              ke = ke.argument, be.push("argument");
            else if (ke.type === "TSNonNullExpression")
              ke = ke.expression, be.push("expression");
            else
              break;
          return !!(b(ke) || me.call(() => de(me, Se, Qe), ...be));
        }
        function I(me) {
          if (M(me)) {
            let Se = me.left || me.id;
            return Se.type === "ObjectPattern" && Se.properties.length > 2 && Se.properties.some((Qe) => ge(Qe) && (!Qe.shorthand || Qe.value && Qe.value.type === "AssignmentPattern"));
          }
          return !1;
        }
        function O(me) {
          return me.type === "AssignmentExpression";
        }
        function M(me) {
          return O(me) || me.type === "VariableDeclarator";
        }
        function ee(me) {
          let Se = pe(me);
          if (t(Se)) {
            let Qe = me.type === "TSTypeAliasDeclaration" ? "constraint" : "bound";
            if (Se.length > 1 && Se.some((Ze) => Ze[Qe] || Ze.default))
              return !0;
          }
          return !1;
        }
        function pe(me) {
          return he(me) && me.typeParameters && me.typeParameters.params ? me.typeParameters.params : null;
        }
        function he(me) {
          return me.type === "TSTypeAliasDeclaration" || me.type === "TypeAlias";
        }
        function ce(me) {
          if (me.type !== "VariableDeclarator")
            return !1;
          let { typeAnnotation: Se } = me.id;
          if (!Se || !Se.typeAnnotation)
            return !1;
          let Qe = ie(Se.typeAnnotation);
          return t(Qe) && Qe.length > 1 && Qe.some((Ze) => t(ie(Ze)) || Ze.type === "TSConditionalType");
        }
        function xe(me) {
          return me.type === "VariableDeclarator" && me.init && me.init.type === "ArrowFunctionExpression";
        }
        function ie(me) {
          return je(me) && me.typeParameters && me.typeParameters.params ? me.typeParameters.params : null;
        }
        function je(me) {
          return me.type === "TSTypeReference" || me.type === "GenericTypeAnnotation";
        }
        function de(me, Se, Qe) {
          let Ze = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1, kt = me.getValue(), ke = () => de(me, Se, Qe, !0);
          if (kt.type === "TSNonNullExpression")
            return me.call(ke, "expression");
          if (W(kt)) {
            if (R(me, Se, Qe).label === "member-chain")
              return !1;
            let be = _(kt);
            return !(be.length === 0 || be.length === 1 && Ne(be[0], Se)) || _e(kt, Qe) ? !1 : me.call(ke, "callee");
          }
          return B(kt) ? me.call(ke, "object") : Ze && (kt.type === "Identifier" || kt.type === "ThisExpression");
        }
        var oe = 0.25;
        function Ne(me, Se) {
          let { printWidth: Qe } = Se;
          if (Q(me))
            return !1;
          let Ze = Qe * oe;
          if (me.type === "ThisExpression" || me.type === "Identifier" && me.name.length <= Ze || H(me) && !Q(me.argument))
            return !0;
          let kt = me.type === "Literal" && "regex" in me && me.regex.pattern || me.type === "RegExpLiteral" && me.pattern;
          return kt ? kt.length <= Ze : b(me) ? U(me).length <= Ze : me.type === "TemplateLiteral" ? me.expressions.length === 0 && me.quasis[0].value.raw.length <= Ze && !me.quasis[0].value.raw.includes(`
`) : T(me);
        }
        function Je(me, Se, Qe) {
          if (!ge(me))
            return !1;
          Se = D(Se);
          let Ze = 3;
          return typeof Se == "string" && p(Se) < Qe.tabWidth + Ze;
        }
        function _e(me, Se) {
          let Qe = it(me);
          if (t(Qe)) {
            if (Qe.length > 1)
              return !0;
            if (Qe.length === 1) {
              let kt = Qe[0];
              if (kt.type === "TSUnionType" || kt.type === "UnionTypeAnnotation" || kt.type === "TSIntersectionType" || kt.type === "IntersectionTypeAnnotation" || kt.type === "TSTypeLiteral" || kt.type === "ObjectTypeAnnotation")
                return !0;
            }
            let Ze = me.typeParameters ? "typeParameters" : "typeArguments";
            if (E(Se(Ze)))
              return !0;
          }
          return !1;
        }
        function it(me) {
          return me.typeParameters && me.typeParameters.params || me.typeArguments && me.typeArguments.params;
        }
        m.exports = { printVariableDeclarator: l, printAssignmentExpression: S, printAssignment: v, isArrowFunctionVariableDeclarator: xe };
      } }), zu = Ce({ "src/language-js/print/function-parameters.js"(o, m) {
        Be();
        var { getNextNonSpaceNonCommentCharacter: t } = yr(), { printDanglingComments: p } = tn(), { builders: { line: c, hardline: e, softline: i, group: u, indent: h, ifBreak: D }, utils: { removeLines: E, willBreak: C } } = sr(), { getFunctionParameters: F, iterateFunctionParametersPath: g, isSimpleType: b, isTestCall: T, isTypeAnnotationAFunction: G, isObjectType: W, isObjectTypePropertyAFunction: B, hasRestParameter: _, shouldPrintComma: U, hasComment: Q, isNextLineEmpty: H } = Vr(), { locEnd: ge } = Dn(), { ArgExpansionBailout: y } = Vi(), { printFunctionTypeParameters: R } = Cn();
        function v(w, I, O, M, ee) {
          let pe = w.getValue(), he = F(pe), ce = ee ? R(w, O, I) : "";
          if (he.length === 0)
            return [ce, "(", p(w, O, !0, (Ne) => t(O.originalText, Ne, ge) === ")"), ")"];
          let xe = w.getParentNode(), ie = T(xe), je = S(pe), de = [];
          if (g(w, (Ne, Je) => {
            let _e = Je === he.length - 1;
            _e && pe.rest && de.push("..."), de.push(I()), !_e && (de.push(","), ie || je ? de.push(" ") : H(he[Je], O) ? de.push(e, e) : de.push(c));
          }), M) {
            if (C(ce) || C(de))
              throw new y();
            return u([E(ce), "(", E(de), ")"]);
          }
          let oe = he.every((Ne) => !Ne.decorators);
          return je && oe ? [ce, "(", ...de, ")"] : ie ? [ce, "(", ...de, ")"] : (B(xe) || G(xe) || xe.type === "TypeAlias" || xe.type === "UnionTypeAnnotation" || xe.type === "TSUnionType" || xe.type === "IntersectionTypeAnnotation" || xe.type === "FunctionTypeAnnotation" && xe.returnType === pe) && he.length === 1 && he[0].name === null && pe.this !== he[0] && he[0].typeAnnotation && pe.typeParameters === null && b(he[0].typeAnnotation) && !pe.rest ? O.arrowParens === "always" ? ["(", ...de, ")"] : de : [ce, "(", h([i, ...de]), D(!_(pe) && U(O, "all") ? "," : ""), i, ")"];
        }
        function S(w) {
          if (!w)
            return !1;
          let I = F(w);
          if (I.length !== 1)
            return !1;
          let [O] = I;
          return !Q(O) && (O.type === "ObjectPattern" || O.type === "ArrayPattern" || O.type === "Identifier" && O.typeAnnotation && (O.typeAnnotation.type === "TypeAnnotation" || O.typeAnnotation.type === "TSTypeAnnotation") && W(O.typeAnnotation.typeAnnotation) || O.type === "FunctionTypeParam" && W(O.typeAnnotation) || O.type === "AssignmentPattern" && (O.left.type === "ObjectPattern" || O.left.type === "ArrayPattern") && (O.right.type === "Identifier" || O.right.type === "ObjectExpression" && O.right.properties.length === 0 || O.right.type === "ArrayExpression" && O.right.elements.length === 0));
        }
        function l(w) {
          let I;
          return w.returnType ? (I = w.returnType, I.typeAnnotation && (I = I.typeAnnotation)) : w.typeAnnotation && (I = w.typeAnnotation), I;
        }
        function A(w, I) {
          let O = l(w);
          if (!O)
            return !1;
          let M = w.typeParameters && w.typeParameters.params;
          if (M) {
            if (M.length > 1)
              return !1;
            if (M.length === 1) {
              let ee = M[0];
              if (ee.constraint || ee.default)
                return !1;
            }
          }
          return F(w).length === 1 && (W(O) || C(I));
        }
        m.exports = { printFunctionParameters: v, shouldHugFunctionParameters: S, shouldGroupFunctionParameters: A };
      } }), Wu = Ce({ "src/language-js/print/type-annotation.js"(o, m) {
        Be();
        var { printComments: t, printDanglingComments: p } = tn(), { isNonEmptyArray: c } = yr(), { builders: { group: e, join: i, line: u, softline: h, indent: D, align: E, ifBreak: C } } = sr(), F = ai(), { locStart: g } = Dn(), { isSimpleType: b, isObjectType: T, hasLeadingOwnLineComment: G, isObjectTypePropertyAFunction: W, shouldPrintComma: B } = Vr(), { printAssignment: _ } = Xi(), { printFunctionParameters: U, shouldGroupFunctionParameters: Q } = zu(), { printArrayItems: H } = Wi();
        function ge(O) {
          if (b(O) || T(O))
            return !0;
          if (O.type === "UnionTypeAnnotation" || O.type === "TSUnionType") {
            let M = O.types.filter((pe) => pe.type === "VoidTypeAnnotation" || pe.type === "TSVoidKeyword" || pe.type === "NullLiteralTypeAnnotation" || pe.type === "TSNullKeyword").length, ee = O.types.some((pe) => pe.type === "ObjectTypeAnnotation" || pe.type === "TSTypeLiteral" || pe.type === "GenericTypeAnnotation" || pe.type === "TSTypeReference");
            if (O.types.length - 1 === M && ee)
              return !0;
          }
          return !1;
        }
        function y(O, M, ee) {
          let pe = M.semi ? ";" : "", he = O.getValue(), ce = [];
          return ce.push("opaque type ", ee("id"), ee("typeParameters")), he.supertype && ce.push(": ", ee("supertype")), he.impltype && ce.push(" = ", ee("impltype")), ce.push(pe), ce;
        }
        function R(O, M, ee) {
          let pe = M.semi ? ";" : "", he = O.getValue(), ce = [];
          he.declare && ce.push("declare "), ce.push("type ", ee("id"), ee("typeParameters"));
          let xe = he.type === "TSTypeAliasDeclaration" ? "typeAnnotation" : "right";
          return [_(O, M, ee, ce, " =", xe), pe];
        }
        function v(O, M, ee) {
          let pe = O.getValue(), he = O.map(ee, "types"), ce = [], xe = !1;
          for (let ie = 0; ie < he.length; ++ie)
            ie === 0 ? ce.push(he[ie]) : T(pe.types[ie - 1]) && T(pe.types[ie]) ? ce.push([" & ", xe ? D(he[ie]) : he[ie]]) : !T(pe.types[ie - 1]) && !T(pe.types[ie]) ? ce.push(D([" &", u, he[ie]])) : (ie > 1 && (xe = !0), ce.push(" & ", ie > 1 ? D(he[ie]) : he[ie]));
          return e(ce);
        }
        function S(O, M, ee) {
          let pe = O.getValue(), he = O.getParentNode(), ce = he.type !== "TypeParameterInstantiation" && he.type !== "TSTypeParameterInstantiation" && he.type !== "GenericTypeAnnotation" && he.type !== "TSTypeReference" && he.type !== "TSTypeAssertion" && he.type !== "TupleTypeAnnotation" && he.type !== "TSTupleType" && !(he.type === "FunctionTypeParam" && !he.name && O.getParentNode(1).this !== he) && !((he.type === "TypeAlias" || he.type === "VariableDeclarator" || he.type === "TSTypeAliasDeclaration") && G(M.originalText, pe)), xe = ge(pe), ie = O.map((oe) => {
            let Ne = ee();
            return xe || (Ne = E(2, Ne)), t(oe, Ne, M);
          }, "types");
          if (xe)
            return i(" | ", ie);
          let je = ce && !G(M.originalText, pe), de = [C([je ? u : "", "| "]), i([u, "| "], ie)];
          return F(O, M) ? e([D(de), h]) : he.type === "TupleTypeAnnotation" && he.types.length > 1 || he.type === "TSTupleType" && he.elementTypes.length > 1 ? e([D([C(["(", h]), de]), h, C(")")]) : e(ce ? D(de) : de);
        }
        function l(O, M, ee) {
          let pe = O.getValue(), he = [], ce = O.getParentNode(0), xe = O.getParentNode(1), ie = O.getParentNode(2), je = pe.type === "TSFunctionType" || !((ce.type === "ObjectTypeProperty" || ce.type === "ObjectTypeInternalSlot") && !ce.variance && !ce.optional && g(ce) === g(pe) || ce.type === "ObjectTypeCallProperty" || ie && ie.type === "DeclareFunction"), de = je && (ce.type === "TypeAnnotation" || ce.type === "TSTypeAnnotation"), oe = de && je && (ce.type === "TypeAnnotation" || ce.type === "TSTypeAnnotation") && xe.type === "ArrowFunctionExpression";
          W(ce) && (je = !0, de = !0), oe && he.push("(");
          let Ne = U(O, ee, M, !1, !0), Je = pe.returnType || pe.predicate || pe.typeAnnotation ? [je ? " => " : ": ", ee("returnType"), ee("predicate"), ee("typeAnnotation")] : "", _e = Q(pe, Je);
          return he.push(_e ? e(Ne) : Ne), Je && he.push(Je), oe && he.push(")"), e(he);
        }
        function A(O, M, ee) {
          let pe = O.getValue(), he = pe.type === "TSTupleType" ? "elementTypes" : "types", ce = pe[he], xe = c(ce), ie = xe ? h : "";
          return e(["[", D([ie, H(O, M, he, ee)]), C(xe && B(M, "all") ? "," : ""), p(O, M, !0), ie, "]"]);
        }
        function w(O, M, ee) {
          let pe = O.getValue(), he = pe.type === "OptionalIndexedAccessType" && pe.optional ? "?.[" : "[";
          return [ee("objectType"), he, ee("indexType"), "]"];
        }
        function I(O, M, ee) {
          let pe = O.getValue();
          return [pe.postfix ? "" : ee, M("typeAnnotation"), pe.postfix ? ee : ""];
        }
        m.exports = { printOpaqueType: y, printTypeAlias: R, printIntersectionType: v, printUnionType: S, printFunctionType: l, printTupleType: A, printIndexedAccessType: w, shouldHugType: ge, printJSDocType: I };
      } }), Hi = Ce({ "src/language-js/print/type-parameters.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { builders: { join: p, line: c, hardline: e, softline: i, group: u, indent: h, ifBreak: D } } = sr(), { isTestCall: E, hasComment: C, CommentCheckFlags: F, isTSXFile: g, shouldPrintComma: b, getFunctionParameters: T, isObjectType: G } = Vr(), { createGroupIdMapper: W } = yr(), { shouldHugType: B } = Wu(), { isArrowFunctionVariableDeclarator: _ } = Xi(), U = W("typeParameters");
        function Q(y, R, v, S) {
          let l = y.getValue();
          if (!l[S])
            return "";
          if (!Array.isArray(l[S]))
            return v(S);
          let A = y.getNode(2), w = A && E(A), I = y.match((M) => !(M[S].length === 1 && G(M[S][0])), void 0, (M, ee) => ee === "typeAnnotation", (M) => M.type === "Identifier", _);
          if (l[S].length === 0 || !I && (w || l[S].length === 1 && (l[S][0].type === "NullableTypeAnnotation" || B(l[S][0]))))
            return ["<", p(", ", y.map(v, S)), H(y, R), ">"];
          let O = l.type === "TSTypeParameterInstantiation" ? "" : T(l).length === 1 && g(R) && !l[S][0].constraint && y.getParentNode().type === "ArrowFunctionExpression" ? "," : b(R, "all") ? D(",") : "";
          return u(["<", h([i, p([",", c], y.map(v, S))]), O, i, ">"], { id: U(l) });
        }
        function H(y, R) {
          let v = y.getValue();
          if (!C(v, F.Dangling))
            return "";
          let S = !C(v, F.Line), l = t(y, R, S);
          return S ? l : [l, e];
        }
        function ge(y, R, v) {
          let S = y.getValue(), l = [], A = y.getParentNode();
          return A.type === "TSMappedType" ? (l.push("[", v("name")), S.constraint && l.push(" in ", v("constraint")), A.nameType && l.push(" as ", y.callParent(() => v("nameType"))), l.push("]"), l) : (S.variance && l.push(v("variance")), S.in && l.push("in "), S.out && l.push("out "), l.push(v("name")), S.bound && l.push(": ", v("bound")), S.constraint && l.push(" extends ", v("constraint")), S.default && l.push(" = ", v("default")), l);
        }
        m.exports = { printTypeParameter: ge, printTypeParameters: Q, getTypeParametersGroupId: U };
      } }), gu = Ce({ "src/language-js/print/property.js"(o, m) {
        Be();
        var { printComments: t } = tn(), { printString: p, printNumber: c } = yr(), { isNumericLiteral: e, isSimpleNumber: i, isStringLiteral: u, isStringPropSafeToUnquote: h, rawText: D } = Vr(), { printAssignment: E } = Xi(), C = /* @__PURE__ */ new WeakMap();
        function F(b, T, G) {
          let W = b.getNode();
          if (W.computed)
            return ["[", G("key"), "]"];
          let B = b.getParentNode(), { key: _ } = W;
          if (T.quoteProps === "consistent" && !C.has(B)) {
            let U = (B.properties || B.body || B.members).some((Q) => !Q.computed && Q.key && u(Q.key) && !h(Q, T));
            C.set(B, U);
          }
          if ((_.type === "Identifier" || e(_) && i(c(D(_))) && String(_.value) === c(D(_)) && !(T.parser === "typescript" || T.parser === "babel-ts")) && (T.parser === "json" || T.quoteProps === "consistent" && C.get(B))) {
            let U = p(JSON.stringify(_.type === "Identifier" ? _.name : _.value.toString()), T);
            return b.call((Q) => t(Q, U, T), "key");
          }
          return h(W, T) && (T.quoteProps === "as-needed" || T.quoteProps === "consistent" && !C.get(B)) ? b.call((U) => t(U, /^\d/.test(_.value) ? c(_.value) : _.value, T), "key") : G("key");
        }
        function g(b, T, G) {
          return b.getValue().shorthand ? G("value") : E(b, T, G, F(b, T, G), ":", "value");
        }
        m.exports = { printProperty: g, printPropertyKey: F };
      } }), Xu = Ce({ "src/language-js/print/function.js"(o, m) {
        Be();
        var t = Ui(), { printDanglingComments: p, printCommentsSeparately: c } = tn(), e = dn(), { getNextNonSpaceNonCommentCharacterIndex: i } = yr(), { builders: { line: u, softline: h, group: D, indent: E, ifBreak: C, hardline: F, join: g, indentIfBreak: b }, utils: { removeLines: T, willBreak: G } } = sr(), { ArgExpansionBailout: W } = Vi(), { getFunctionParameters: B, hasLeadingOwnLineComment: _, isFlowAnnotationComment: U, isJsxNode: Q, isTemplateOnItsOwnLine: H, shouldPrintComma: ge, startsWithNoLookaheadToken: y, isBinaryish: R, isLineComment: v, hasComment: S, getComments: l, CommentCheckFlags: A, isCallLikeExpression: w, isCallExpression: I, getCallArguments: O, hasNakedLeftSide: M, getLeftSide: ee } = Vr(), { locEnd: pe } = Dn(), { printFunctionParameters: he, shouldGroupFunctionParameters: ce } = zu(), { printPropertyKey: xe } = gu(), { printFunctionTypeParameters: ie } = Cn();
        function je(be, Oe, Re, ut) {
          let ht = be.getValue(), vt = !1;
          if ((ht.type === "FunctionDeclaration" || ht.type === "FunctionExpression") && ut && ut.expandLastArg) {
            let Qt = be.getParentNode();
            I(Qt) && O(Qt).length > 1 && (vt = !0);
          }
          let Ut = [];
          ht.type === "TSDeclareFunction" && ht.declare && Ut.push("declare "), ht.async && Ut.push("async "), ht.generator ? Ut.push("function* ") : Ut.push("function "), ht.id && Ut.push(Oe("id"));
          let Dr = he(be, Oe, Re, vt), mr = Se(be, Oe, Re), Vt = ce(ht, mr);
          return Ut.push(ie(be, Re, Oe), D([Vt ? D(Dr) : Dr, mr]), ht.body ? " " : "", Oe("body")), Re.semi && (ht.declare || !ht.body) && Ut.push(";"), Ut;
        }
        function de(be, Oe, Re) {
          let ut = be.getNode(), { kind: ht } = ut, vt = ut.value || ut, Ut = [];
          return !ht || ht === "init" || ht === "method" || ht === "constructor" ? vt.async && Ut.push("async ") : (t.ok(ht === "get" || ht === "set"), Ut.push(ht, " ")), vt.generator && Ut.push("*"), Ut.push(xe(be, Oe, Re), ut.optional || ut.key.optional ? "?" : ""), ut === vt ? Ut.push(oe(be, Oe, Re)) : vt.type === "FunctionExpression" ? Ut.push(be.call((Dr) => oe(Dr, Oe, Re), "value")) : Ut.push(Re("value")), Ut;
        }
        function oe(be, Oe, Re) {
          let ut = be.getNode(), ht = he(be, Re, Oe), vt = Se(be, Re, Oe), Ut = ce(ut, vt), Dr = [ie(be, Oe, Re), D([Ut ? D(ht) : ht, vt])];
          return ut.body ? Dr.push(" ", Re("body")) : Dr.push(Oe.semi ? ";" : ""), Dr;
        }
        function Ne(be, Oe, Re, ut) {
          let ht = be.getValue(), vt = [];
          if (ht.async && vt.push("async "), me(be, Oe))
            vt.push(Re(["params", 0]));
          else {
            let Dr = ut && (ut.expandLastArg || ut.expandFirstArg), mr = Se(be, Re, Oe);
            if (Dr) {
              if (G(mr))
                throw new W();
              mr = D(T(mr));
            }
            vt.push(D([he(be, Re, Oe, Dr, !0), mr]));
          }
          let Ut = p(be, Oe, !0, (Dr) => {
            let mr = i(Oe.originalText, Dr, pe);
            return mr !== !1 && Oe.originalText.slice(mr, mr + 2) === "=>";
          });
          return Ut && vt.push(" ", Ut), vt;
        }
        function Je(be, Oe, Re, ut, ht, vt) {
          let Ut = be.getName(), Dr = be.getParentNode(), mr = w(Dr) && Ut === "callee", Vt = Boolean(Oe && Oe.assignmentLayout), Qt = vt.body.type !== "BlockStatement" && vt.body.type !== "ObjectExpression" && vt.body.type !== "SequenceExpression", Xe = mr && Qt || Oe && Oe.assignmentLayout === "chain-tail-arrow-chain", ye = Symbol("arrow-chain");
          return vt.body.type === "SequenceExpression" && (ht = D(["(", E([h, ht]), h, ")"])), D([D(E([mr || Vt ? h : "", D(g([" =>", u], Re), { shouldBreak: ut })]), { id: ye, shouldBreak: Xe }), " =>", b(Qt ? E([u, ht]) : [" ", ht], { groupId: ye }), mr ? C(h, "", { groupId: ye }) : ""]);
        }
        function _e(be, Oe, Re, ut) {
          let ht = be.getValue(), vt = [], Ut = [], Dr = !1;
          if (function ye() {
            let tt = Ne(be, Oe, Re, ut);
            if (vt.length === 0)
              vt.push(tt);
            else {
              let { leading: Te, trailing: rt } = c(be, Oe);
              vt.push([Te, tt]), Ut.unshift(rt);
            }
            Dr = Dr || ht.returnType && B(ht).length > 0 || ht.typeParameters || B(ht).some((Te) => Te.type !== "Identifier"), ht.body.type !== "ArrowFunctionExpression" || ut && ut.expandLastArg ? Ut.unshift(Re("body", ut)) : (ht = ht.body, be.call(ye, "body"));
          }(), vt.length > 1)
            return Je(be, ut, vt, Dr, Ut, ht);
          let mr = vt;
          if (mr.push(" =>"), !_(Oe.originalText, ht.body) && (ht.body.type === "ArrayExpression" || ht.body.type === "ObjectExpression" || ht.body.type === "BlockStatement" || Q(ht.body) || H(ht.body, Oe.originalText) || ht.body.type === "ArrowFunctionExpression" || ht.body.type === "DoExpression"))
            return D([...mr, " ", Ut]);
          if (ht.body.type === "SequenceExpression")
            return D([...mr, D([" (", E([h, Ut]), h, ")"])]);
          let Vt = (ut && ut.expandLastArg || be.getParentNode().type === "JSXExpressionContainer") && !S(ht), Qt = ut && ut.expandLastArg && ge(Oe, "all"), Xe = ht.body.type === "ConditionalExpression" && !y(ht.body, (ye) => ye.type === "ObjectExpression");
          return D([...mr, D([E([u, Xe ? C("", "(") : "", Ut, Xe ? C("", ")") : ""]), Vt ? [C(Qt ? "," : ""), h] : ""])]);
        }
        function it(be) {
          let Oe = B(be);
          return Oe.length === 1 && !be.typeParameters && !S(be, A.Dangling) && Oe[0].type === "Identifier" && !Oe[0].typeAnnotation && !S(Oe[0]) && !Oe[0].optional && !be.predicate && !be.returnType;
        }
        function me(be, Oe) {
          if (Oe.arrowParens === "always")
            return !1;
          if (Oe.arrowParens === "avoid") {
            let Re = be.getValue();
            return it(Re);
          }
          return !1;
        }
        function Se(be, Oe, Re) {
          let ut = be.getValue(), ht = Oe("returnType");
          if (ut.returnType && U(Re.originalText, ut.returnType))
            return [" /*: ", ht, " */"];
          let vt = [ht];
          return ut.returnType && ut.returnType.typeAnnotation && vt.unshift(": "), ut.predicate && vt.push(ut.returnType ? " " : ": ", Oe("predicate")), vt;
        }
        function Qe(be, Oe, Re) {
          let ut = be.getValue(), ht = Oe.semi ? ";" : "", vt = [];
          ut.argument && (ke(Oe, ut.argument) ? vt.push([" (", E([F, Re("argument")]), F, ")"]) : R(ut.argument) || ut.argument.type === "SequenceExpression" ? vt.push(D([C(" (", " "), E([h, Re("argument")]), h, C(")")])) : vt.push(" ", Re("argument")));
          let Ut = l(ut), Dr = e(Ut), mr = Dr && v(Dr);
          return mr && vt.push(ht), S(ut, A.Dangling) && vt.push(" ", p(be, Oe, !0)), mr || vt.push(ht), vt;
        }
        function Ze(be, Oe, Re) {
          return ["return", Qe(be, Oe, Re)];
        }
        function kt(be, Oe, Re) {
          return ["throw", Qe(be, Oe, Re)];
        }
        function ke(be, Oe) {
          if (_(be.originalText, Oe))
            return !0;
          if (M(Oe)) {
            let Re = Oe, ut;
            for (; ut = ee(Re); )
              if (Re = ut, _(be.originalText, Re))
                return !0;
          }
          return !1;
        }
        m.exports = { printFunction: je, printArrowFunction: _e, printMethod: de, printReturnStatement: Ze, printThrowStatement: kt, printMethodInternal: oe, shouldPrintParamsWithoutParens: me };
      } }), Ks = Ce({ "src/language-js/print/decorators.js"(o, m) {
        Be();
        var { isNonEmptyArray: t, hasNewline: p } = yr(), { builders: { line: c, hardline: e, join: i, breakParent: u, group: h } } = sr(), { locStart: D, locEnd: E } = Dn(), { getParentExportDeclaration: C } = Vr();
        function F(W, B, _) {
          let U = W.getValue();
          return h([i(c, W.map(_, "decorators")), T(U, B) ? e : c]);
        }
        function g(W, B, _) {
          return [i(e, W.map(_, "declaration", "decorators")), e];
        }
        function b(W, B, _) {
          let U = W.getValue(), { decorators: Q } = U;
          if (!t(Q) || G(W.getParentNode()))
            return;
          let H = U.type === "ClassExpression" || U.type === "ClassDeclaration" || T(U, B);
          return [C(W) ? e : H ? u : "", i(c, W.map(_, "decorators")), c];
        }
        function T(W, B) {
          return W.decorators.some((_) => p(B.originalText, E(_)));
        }
        function G(W) {
          if (W.type !== "ExportDefaultDeclaration" && W.type !== "ExportNamedDeclaration" && W.type !== "DeclareExportDeclaration")
            return !1;
          let B = W.declaration && W.declaration.decorators;
          return t(B) && D(W) === D(B[0]);
        }
        m.exports = { printDecorators: b, printClassMemberDecorators: F, printDecoratorsBeforeExport: g, hasDecoratorsBeforeExport: G };
      } }), Du = Ce({ "src/language-js/print/class.js"(o, m) {
        Be();
        var { isNonEmptyArray: t, createGroupIdMapper: p } = yr(), { printComments: c, printDanglingComments: e } = tn(), { builders: { join: i, line: u, hardline: h, softline: D, group: E, indent: C, ifBreak: F } } = sr(), { hasComment: g, CommentCheckFlags: b } = Vr(), { getTypeParametersGroupId: T } = Hi(), { printMethod: G } = Xu(), { printOptionalToken: W, printTypeAnnotation: B, printDefiniteToken: _ } = Cn(), { printPropertyKey: U } = gu(), { printAssignment: Q } = Xi(), { printClassMemberDecorators: H } = Ks();
        function ge(O, M, ee) {
          let pe = O.getValue(), he = [];
          pe.declare && he.push("declare "), pe.abstract && he.push("abstract "), he.push("class");
          let ce = pe.id && g(pe.id, b.Trailing) || pe.typeParameters && g(pe.typeParameters, b.Trailing) || pe.superClass && g(pe.superClass) || t(pe.extends) || t(pe.mixins) || t(pe.implements), xe = [], ie = [];
          if (pe.id && xe.push(" ", ee("id")), xe.push(ee("typeParameters")), pe.superClass) {
            let je = [A(O, M, ee), ee("superTypeParameters")], de = O.call((oe) => ["extends ", c(oe, je, M)], "superClass");
            ce ? ie.push(u, E(de)) : ie.push(" ", de);
          } else
            ie.push(l(O, M, ee, "extends"));
          if (ie.push(l(O, M, ee, "mixins"), l(O, M, ee, "implements")), ce) {
            let je;
            S(pe) ? je = [...xe, C(ie)] : je = C([...xe, ie]), he.push(E(je, { id: y(pe) }));
          } else
            he.push(...xe, ...ie);
          return he.push(" ", ee("body")), he;
        }
        var y = p("heritageGroup");
        function R(O) {
          return F(h, "", { groupId: y(O) });
        }
        function v(O) {
          return ["superClass", "extends", "mixins", "implements"].filter((M) => Boolean(O[M])).length > 1;
        }
        function S(O) {
          return O.typeParameters && !g(O.typeParameters, b.Trailing | b.Line) && !v(O);
        }
        function l(O, M, ee, pe) {
          let he = O.getValue();
          if (!t(he[pe]))
            return "";
          let ce = e(O, M, !0, (xe) => {
            let { marker: ie } = xe;
            return ie === pe;
          });
          return [S(he) ? F(" ", u, { groupId: T(he.typeParameters) }) : u, ce, ce && h, pe, E(C([u, i([",", u], O.map(ee, pe))]))];
        }
        function A(O, M, ee) {
          let pe = ee("superClass");
          return O.getParentNode().type === "AssignmentExpression" ? E(F(["(", C([D, pe]), D, ")"], pe)) : pe;
        }
        function w(O, M, ee) {
          let pe = O.getValue(), he = [];
          return t(pe.decorators) && he.push(H(O, M, ee)), pe.accessibility && he.push(pe.accessibility + " "), pe.readonly && he.push("readonly "), pe.declare && he.push("declare "), pe.static && he.push("static "), (pe.type === "TSAbstractMethodDefinition" || pe.abstract) && he.push("abstract "), pe.override && he.push("override "), he.push(G(O, M, ee)), he;
        }
        function I(O, M, ee) {
          let pe = O.getValue(), he = [], ce = M.semi ? ";" : "";
          return t(pe.decorators) && he.push(H(O, M, ee)), pe.accessibility && he.push(pe.accessibility + " "), pe.declare && he.push("declare "), pe.static && he.push("static "), (pe.type === "TSAbstractPropertyDefinition" || pe.type === "TSAbstractAccessorProperty" || pe.abstract) && he.push("abstract "), pe.override && he.push("override "), pe.readonly && he.push("readonly "), pe.variance && he.push(ee("variance")), (pe.type === "ClassAccessorProperty" || pe.type === "AccessorProperty" || pe.type === "TSAbstractAccessorProperty") && he.push("accessor "), he.push(U(O, M, ee), W(O), _(O), B(O, M, ee)), [Q(O, M, ee, he, " =", "value"), ce];
        }
        m.exports = { printClass: ge, printClassMethod: w, printClassProperty: I, printHardlineAfterHeritage: R };
      } }), Uo = Ce({ "src/language-js/print/interface.js"(o, m) {
        Be();
        var { isNonEmptyArray: t } = yr(), { builders: { join: p, line: c, group: e, indent: i, ifBreak: u } } = sr(), { hasComment: h, identity: D, CommentCheckFlags: E } = Vr(), { getTypeParametersGroupId: C } = Hi(), { printTypeScriptModifiers: F } = Cn();
        function g(b, T, G) {
          let W = b.getValue(), B = [];
          W.declare && B.push("declare "), W.type === "TSInterfaceDeclaration" && B.push(W.abstract ? "abstract " : "", F(b, T, G)), B.push("interface");
          let _ = [], U = [];
          W.type !== "InterfaceTypeAnnotation" && _.push(" ", G("id"), G("typeParameters"));
          let Q = W.typeParameters && !h(W.typeParameters, E.Trailing | E.Line);
          return t(W.extends) && U.push(Q ? u(" ", c, { groupId: C(W.typeParameters) }) : c, "extends ", (W.extends.length === 1 ? D : i)(p([",", c], b.map(G, "extends")))), W.id && h(W.id, E.Trailing) || t(W.extends) ? Q ? B.push(e([..._, i(U)])) : B.push(e(i([..._, ...U]))) : B.push(..._, ...U), B.push(" ", G("body")), e(B);
        }
        m.exports = { printInterface: g };
      } }), Go = Ce({ "src/language-js/print/module.js"(o, m) {
        Be();
        var { isNonEmptyArray: t } = yr(), { builders: { softline: p, group: c, indent: e, join: i, line: u, ifBreak: h, hardline: D } } = sr(), { printDanglingComments: E } = tn(), { hasComment: C, CommentCheckFlags: F, shouldPrintComma: g, needsHardlineAfterDanglingComment: b, isStringLiteral: T, rawText: G } = Vr(), { locStart: W, hasSameLoc: B } = Dn(), { hasDecoratorsBeforeExport: _, printDecoratorsBeforeExport: U } = Ks();
        function Q(I, O, M) {
          let ee = I.getValue(), pe = O.semi ? ";" : "", he = [], { importKind: ce } = ee;
          return he.push("import"), ce && ce !== "value" && he.push(" ", ce), he.push(v(I, O, M), R(I, O, M), l(I, O, M), pe), he;
        }
        function H(I, O, M) {
          let ee = I.getValue(), pe = [];
          _(ee) && pe.push(U(I, O, M));
          let { type: he, exportKind: ce, declaration: xe } = ee;
          return pe.push("export"), (ee.default || he === "ExportDefaultDeclaration") && pe.push(" default"), C(ee, F.Dangling) && (pe.push(" ", E(I, O, !0)), b(ee) && pe.push(D)), xe ? pe.push(" ", M("declaration")) : pe.push(ce === "type" ? " type" : "", v(I, O, M), R(I, O, M), l(I, O, M)), y(ee, O) && pe.push(";"), pe;
        }
        function ge(I, O, M) {
          let ee = I.getValue(), pe = O.semi ? ";" : "", he = [], { exportKind: ce, exported: xe } = ee;
          return he.push("export"), ce === "type" && he.push(" type"), he.push(" *"), xe && he.push(" as ", M("exported")), he.push(R(I, O, M), l(I, O, M), pe), he;
        }
        function y(I, O) {
          if (!O.semi)
            return !1;
          let { type: M, declaration: ee } = I, pe = I.default || M === "ExportDefaultDeclaration";
          if (!ee)
            return !0;
          let { type: he } = ee;
          return !!(pe && he !== "ClassDeclaration" && he !== "FunctionDeclaration" && he !== "TSInterfaceDeclaration" && he !== "DeclareClass" && he !== "DeclareFunction" && he !== "TSDeclareFunction" && he !== "EnumDeclaration");
        }
        function R(I, O, M) {
          let ee = I.getValue();
          if (!ee.source)
            return "";
          let pe = [];
          return S(ee, O) || pe.push(" from"), pe.push(" ", M("source")), pe;
        }
        function v(I, O, M) {
          let ee = I.getValue();
          if (S(ee, O))
            return "";
          let pe = [" "];
          if (t(ee.specifiers)) {
            let he = [], ce = [];
            I.each(() => {
              let xe = I.getValue().type;
              if (xe === "ExportNamespaceSpecifier" || xe === "ExportDefaultSpecifier" || xe === "ImportNamespaceSpecifier" || xe === "ImportDefaultSpecifier")
                he.push(M());
              else if (xe === "ExportSpecifier" || xe === "ImportSpecifier")
                ce.push(M());
              else
                throw new Error(`Unknown specifier type ${JSON.stringify(xe)}`);
            }, "specifiers"), pe.push(i(", ", he)), ce.length > 0 && (he.length > 0 && pe.push(", "), ce.length > 1 || he.length > 0 || ee.specifiers.some((xe) => C(xe)) ? pe.push(c(["{", e([O.bracketSpacing ? u : p, i([",", u], ce)]), h(g(O) ? "," : ""), O.bracketSpacing ? u : p, "}"])) : pe.push(["{", O.bracketSpacing ? " " : "", ...ce, O.bracketSpacing ? " " : "", "}"]));
          } else
            pe.push("{}");
          return pe;
        }
        function S(I, O) {
          let { type: M, importKind: ee, source: pe, specifiers: he } = I;
          return M !== "ImportDeclaration" || t(he) || ee === "type" ? !1 : !/{\s*}/.test(O.originalText.slice(W(I), W(pe)));
        }
        function l(I, O, M) {
          let ee = I.getNode();
          return t(ee.assertions) ? [" assert {", O.bracketSpacing ? " " : "", i(", ", I.map(M, "assertions")), O.bracketSpacing ? " " : "", "}"] : "";
        }
        function A(I, O, M) {
          let ee = I.getNode(), { type: pe } = ee, he = [], ce = pe === "ImportSpecifier" ? ee.importKind : ee.exportKind;
          ce && ce !== "value" && he.push(ce, " ");
          let xe = pe.startsWith("Import"), ie = xe ? "imported" : "local", je = xe ? "local" : "exported", de = ee[ie], oe = ee[je], Ne = "", Je = "";
          return pe === "ExportNamespaceSpecifier" || pe === "ImportNamespaceSpecifier" ? Ne = "*" : de && (Ne = M(ie)), oe && !w(ee) && (Je = M(je)), he.push(Ne, Ne && Je ? " as " : "", Je), he;
        }
        function w(I) {
          if (I.type !== "ImportSpecifier" && I.type !== "ExportSpecifier")
            return !1;
          let { local: O, [I.type === "ImportSpecifier" ? "imported" : "exported"]: M } = I;
          if (O.type !== M.type || !B(O, M))
            return !1;
          if (T(O))
            return O.value === M.value && G(O) === G(M);
          switch (O.type) {
            case "Identifier":
              return O.name === M.name;
            default:
              return !1;
          }
        }
        m.exports = { printImportDeclaration: Q, printExportDeclaration: H, printExportAllDeclaration: ge, printModuleSpecifier: A };
      } }), Ys = Ce({ "src/language-js/print/object.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { builders: { line: p, softline: c, group: e, indent: i, ifBreak: u, hardline: h } } = sr(), { getLast: D, hasNewlineInRange: E, hasNewline: C, isNonEmptyArray: F } = yr(), { shouldPrintComma: g, hasComment: b, getComments: T, CommentCheckFlags: G, isNextLineEmpty: W } = Vr(), { locStart: B, locEnd: _ } = Dn(), { printOptionalToken: U, printTypeAnnotation: Q } = Cn(), { shouldHugFunctionParameters: H } = zu(), { shouldHugType: ge } = Wu(), { printHardlineAfterHeritage: y } = Du();
        function R(v, S, l) {
          let A = S.semi ? ";" : "", w = v.getValue(), I;
          w.type === "TSTypeLiteral" ? I = "members" : w.type === "TSInterfaceBody" ? I = "body" : I = "properties";
          let O = w.type === "ObjectTypeAnnotation", M = [I];
          O && M.push("indexers", "callProperties", "internalSlots");
          let ee = M.map((me) => w[me][0]).sort((me, Se) => B(me) - B(Se))[0], pe = v.getParentNode(0), he = O && pe && (pe.type === "InterfaceDeclaration" || pe.type === "DeclareInterface" || pe.type === "DeclareClass") && v.getName() === "body", ce = w.type === "TSInterfaceBody" || he || w.type === "ObjectPattern" && pe.type !== "FunctionDeclaration" && pe.type !== "FunctionExpression" && pe.type !== "ArrowFunctionExpression" && pe.type !== "ObjectMethod" && pe.type !== "ClassMethod" && pe.type !== "ClassPrivateMethod" && pe.type !== "AssignmentPattern" && pe.type !== "CatchClause" && w.properties.some((me) => me.value && (me.value.type === "ObjectPattern" || me.value.type === "ArrayPattern")) || w.type !== "ObjectPattern" && ee && E(S.originalText, B(w), B(ee)), xe = he ? ";" : w.type === "TSInterfaceBody" || w.type === "TSTypeLiteral" ? u(A, ";") : ",", ie = w.type === "RecordExpression" ? "#{" : w.exact ? "{|" : "{", je = w.exact ? "|}" : "}", de = [];
          for (let me of M)
            v.each((Se) => {
              let Qe = Se.getValue();
              de.push({ node: Qe, printed: l(), loc: B(Qe) });
            }, me);
          M.length > 1 && de.sort((me, Se) => me.loc - Se.loc);
          let oe = [], Ne = de.map((me) => {
            let Se = [...oe, e(me.printed)];
            return oe = [xe, p], (me.node.type === "TSPropertySignature" || me.node.type === "TSMethodSignature" || me.node.type === "TSConstructSignatureDeclaration") && b(me.node, G.PrettierIgnore) && oe.shift(), W(me.node, S) && oe.push(h), Se;
          });
          if (w.inexact) {
            let me;
            if (b(w, G.Dangling)) {
              let Se = b(w, G.Line);
              me = [t(v, S, !0), Se || C(S.originalText, _(D(T(w)))) ? h : p, "..."];
            } else
              me = ["..."];
            Ne.push([...oe, ...me]);
          }
          let Je = D(w[I]), _e = !(w.inexact || Je && Je.type === "RestElement" || Je && (Je.type === "TSPropertySignature" || Je.type === "TSCallSignatureDeclaration" || Je.type === "TSMethodSignature" || Je.type === "TSConstructSignatureDeclaration") && b(Je, G.PrettierIgnore)), it;
          if (Ne.length === 0) {
            if (!b(w, G.Dangling))
              return [ie, je, Q(v, S, l)];
            it = e([ie, t(v, S), c, je, U(v), Q(v, S, l)]);
          } else
            it = [he && F(w.properties) ? y(pe) : "", ie, i([S.bracketSpacing ? p : c, ...Ne]), u(_e && (xe !== "," || g(S)) ? xe : ""), S.bracketSpacing ? p : c, je, U(v), Q(v, S, l)];
          return v.match((me) => me.type === "ObjectPattern" && !me.decorators, (me, Se, Qe) => H(me) && (Se === "params" || Se === "parameters" || Se === "this" || Se === "rest") && Qe === 0) || v.match(ge, (me, Se) => Se === "typeAnnotation", (me, Se) => Se === "typeAnnotation", (me, Se, Qe) => H(me) && (Se === "params" || Se === "parameters" || Se === "this" || Se === "rest") && Qe === 0) || !ce && v.match((me) => me.type === "ObjectPattern", (me) => me.type === "AssignmentExpression" || me.type === "VariableDeclarator") ? it : e(it, { shouldBreak: ce });
        }
        m.exports = { printObject: R };
      } }), ja = Ce({ "src/language-js/print/flow.js"(o, m) {
        Be();
        var t = Ui(), { printDanglingComments: p } = tn(), { printString: c, printNumber: e } = yr(), { builders: { hardline: i, softline: u, group: h, indent: D } } = sr(), { getParentExportDeclaration: E, isFunctionNotation: C, isGetterOrSetter: F, rawText: g, shouldPrintComma: b } = Vr(), { locStart: T, locEnd: G } = Dn(), { replaceTextEndOfLine: W } = $i(), { printClass: B } = Du(), { printOpaqueType: _, printTypeAlias: U, printIntersectionType: Q, printUnionType: H, printFunctionType: ge, printTupleType: y, printIndexedAccessType: R } = Wu(), { printInterface: v } = Uo(), { printTypeParameter: S, printTypeParameters: l } = Hi(), { printExportDeclaration: A, printExportAllDeclaration: w } = Go(), { printArrayItems: I } = Wi(), { printObject: O } = Ys(), { printPropertyKey: M } = gu(), { printOptionalToken: ee, printTypeAnnotation: pe, printRestSpread: he } = Cn();
        function ce(ie, je, de) {
          let oe = ie.getValue(), Ne = je.semi ? ";" : "", Je = [];
          switch (oe.type) {
            case "DeclareClass":
              return xe(ie, B(ie, je, de));
            case "DeclareFunction":
              return xe(ie, ["function ", de("id"), oe.predicate ? " " : "", de("predicate"), Ne]);
            case "DeclareModule":
              return xe(ie, ["module ", de("id"), " ", de("body")]);
            case "DeclareModuleExports":
              return xe(ie, ["module.exports", ": ", de("typeAnnotation"), Ne]);
            case "DeclareVariable":
              return xe(ie, ["var ", de("id"), Ne]);
            case "DeclareOpaqueType":
              return xe(ie, _(ie, je, de));
            case "DeclareInterface":
              return xe(ie, v(ie, je, de));
            case "DeclareTypeAlias":
              return xe(ie, U(ie, je, de));
            case "DeclareExportDeclaration":
              return xe(ie, A(ie, je, de));
            case "DeclareExportAllDeclaration":
              return xe(ie, w(ie, je, de));
            case "OpaqueType":
              return _(ie, je, de);
            case "TypeAlias":
              return U(ie, je, de);
            case "IntersectionTypeAnnotation":
              return Q(ie, je, de);
            case "UnionTypeAnnotation":
              return H(ie, je, de);
            case "FunctionTypeAnnotation":
              return ge(ie, je, de);
            case "TupleTypeAnnotation":
              return y(ie, je, de);
            case "GenericTypeAnnotation":
              return [de("id"), l(ie, je, de, "typeParameters")];
            case "IndexedAccessType":
            case "OptionalIndexedAccessType":
              return R(ie, je, de);
            case "TypeAnnotation":
              return de("typeAnnotation");
            case "TypeParameter":
              return S(ie, je, de);
            case "TypeofTypeAnnotation":
              return ["typeof ", de("argument")];
            case "ExistsTypeAnnotation":
              return "*";
            case "EmptyTypeAnnotation":
              return "empty";
            case "MixedTypeAnnotation":
              return "mixed";
            case "ArrayTypeAnnotation":
              return [de("elementType"), "[]"];
            case "BooleanLiteralTypeAnnotation":
              return String(oe.value);
            case "EnumDeclaration":
              return ["enum ", de("id"), " ", de("body")];
            case "EnumBooleanBody":
            case "EnumNumberBody":
            case "EnumStringBody":
            case "EnumSymbolBody": {
              if (oe.type === "EnumSymbolBody" || oe.explicitType) {
                let _e = null;
                switch (oe.type) {
                  case "EnumBooleanBody":
                    _e = "boolean";
                    break;
                  case "EnumNumberBody":
                    _e = "number";
                    break;
                  case "EnumStringBody":
                    _e = "string";
                    break;
                  case "EnumSymbolBody":
                    _e = "symbol";
                    break;
                }
                Je.push("of ", _e, " ");
              }
              if (oe.members.length === 0 && !oe.hasUnknownMembers)
                Je.push(h(["{", p(ie, je), u, "}"]));
              else {
                let _e = oe.members.length > 0 ? [i, I(ie, je, "members", de), oe.hasUnknownMembers || b(je) ? "," : ""] : [];
                Je.push(h(["{", D([..._e, ...oe.hasUnknownMembers ? [i, "..."] : []]), p(ie, je, !0), i, "}"]));
              }
              return Je;
            }
            case "EnumBooleanMember":
            case "EnumNumberMember":
            case "EnumStringMember":
              return [de("id"), " = ", typeof oe.init == "object" ? de("init") : String(oe.init)];
            case "EnumDefaultedMember":
              return de("id");
            case "FunctionTypeParam": {
              let _e = oe.name ? de("name") : ie.getParentNode().this === oe ? "this" : "";
              return [_e, ee(ie), _e ? ": " : "", de("typeAnnotation")];
            }
            case "InterfaceDeclaration":
            case "InterfaceTypeAnnotation":
              return v(ie, je, de);
            case "ClassImplements":
            case "InterfaceExtends":
              return [de("id"), de("typeParameters")];
            case "NullableTypeAnnotation":
              return ["?", de("typeAnnotation")];
            case "Variance": {
              let { kind: _e } = oe;
              return t.ok(_e === "plus" || _e === "minus"), _e === "plus" ? "+" : "-";
            }
            case "ObjectTypeCallProperty":
              return oe.static && Je.push("static "), Je.push(de("value")), Je;
            case "ObjectTypeIndexer":
              return [oe.static ? "static " : "", oe.variance ? de("variance") : "", "[", de("id"), oe.id ? ": " : "", de("key"), "]: ", de("value")];
            case "ObjectTypeProperty": {
              let _e = "";
              return oe.proto ? _e = "proto " : oe.static && (_e = "static "), [_e, F(oe) ? oe.kind + " " : "", oe.variance ? de("variance") : "", M(ie, je, de), ee(ie), C(oe) ? "" : ": ", de("value")];
            }
            case "ObjectTypeAnnotation":
              return O(ie, je, de);
            case "ObjectTypeInternalSlot":
              return [oe.static ? "static " : "", "[[", de("id"), "]]", ee(ie), oe.method ? "" : ": ", de("value")];
            case "ObjectTypeSpreadProperty":
              return he(ie, je, de);
            case "QualifiedTypeofIdentifier":
            case "QualifiedTypeIdentifier":
              return [de("qualification"), ".", de("id")];
            case "StringLiteralTypeAnnotation":
              return W(c(g(oe), je));
            case "NumberLiteralTypeAnnotation":
              t.strictEqual(typeof oe.value, "number");
            case "BigIntLiteralTypeAnnotation":
              return oe.extra ? e(oe.extra.raw) : e(oe.raw);
            case "TypeCastExpression":
              return ["(", de("expression"), pe(ie, je, de), ")"];
            case "TypeParameterDeclaration":
            case "TypeParameterInstantiation": {
              let _e = l(ie, je, de, "params");
              if (je.parser === "flow") {
                let it = T(oe), me = G(oe), Se = je.originalText.lastIndexOf("/*", it), Qe = je.originalText.indexOf("*/", me);
                if (Se !== -1 && Qe !== -1) {
                  let Ze = je.originalText.slice(Se + 2, Qe).trim();
                  if (Ze.startsWith("::") && !Ze.includes("/*") && !Ze.includes("*/"))
                    return ["/*:: ", _e, " */"];
                }
              }
              return _e;
            }
            case "InferredPredicate":
              return "%checks";
            case "DeclaredPredicate":
              return ["%checks(", de("value"), ")"];
            case "AnyTypeAnnotation":
              return "any";
            case "BooleanTypeAnnotation":
              return "boolean";
            case "BigIntTypeAnnotation":
              return "bigint";
            case "NullLiteralTypeAnnotation":
              return "null";
            case "NumberTypeAnnotation":
              return "number";
            case "SymbolTypeAnnotation":
              return "symbol";
            case "StringTypeAnnotation":
              return "string";
            case "VoidTypeAnnotation":
              return "void";
            case "ThisTypeAnnotation":
              return "this";
            case "Node":
            case "Printable":
            case "SourceLocation":
            case "Position":
            case "Statement":
            case "Function":
            case "Pattern":
            case "Expression":
            case "Declaration":
            case "Specifier":
            case "NamedSpecifier":
            case "Comment":
            case "MemberTypeAnnotation":
            case "Type":
              throw new Error("unprintable type: " + JSON.stringify(oe.type));
          }
        }
        function xe(ie, je) {
          let de = E(ie);
          return de ? (t.strictEqual(de.type, "DeclareExportDeclaration"), je) : ["declare ", je];
        }
        m.exports = { printFlow: ce };
      } }), Pa = Ce({ "src/language-js/utils/is-ts-keyword-type.js"(o, m) {
        Be();
        function t(p) {
          let { type: c } = p;
          return c.startsWith("TS") && c.endsWith("Keyword");
        }
        m.exports = t;
      } }), zo = Ce({ "src/language-js/print/ternary.js"(o, m) {
        Be();
        var { hasNewlineInRange: t } = yr(), { isJsxNode: p, getComments: c, isCallExpression: e, isMemberExpression: i, isTSTypeExpression: u } = Vr(), { locStart: h, locEnd: D } = Dn(), E = Gi(), { builders: { line: C, softline: F, group: g, indent: b, align: T, ifBreak: G, dedent: W, breakParent: B } } = sr();
        function _(y) {
          let R = [y];
          for (let v = 0; v < R.length; v++) {
            let S = R[v];
            for (let l of ["test", "consequent", "alternate"]) {
              let A = S[l];
              if (p(A))
                return !0;
              A.type === "ConditionalExpression" && R.push(A);
            }
          }
          return !1;
        }
        function U(y, R, v) {
          let S = y.getValue(), l = S.type === "ConditionalExpression", A = l ? "alternate" : "falseType", w = y.getParentNode(), I = l ? v("test") : [v("checkType"), " ", "extends", " ", v("extendsType")];
          return w.type === S.type && w[A] === S ? T(2, I) : I;
        }
        var Q = /* @__PURE__ */ new Map([["AssignmentExpression", "right"], ["VariableDeclarator", "init"], ["ReturnStatement", "argument"], ["ThrowStatement", "argument"], ["UnaryExpression", "argument"], ["YieldExpression", "argument"]]);
        function H(y) {
          let R = y.getValue();
          if (R.type !== "ConditionalExpression")
            return !1;
          let v, S = R;
          for (let l = 0; !v; l++) {
            let A = y.getParentNode(l);
            if (e(A) && A.callee === S || i(A) && A.object === S || A.type === "TSNonNullExpression" && A.expression === S) {
              S = A;
              continue;
            }
            A.type === "NewExpression" && A.callee === S || u(A) && A.expression === S ? (v = y.getParentNode(l + 1), S = A) : v = A;
          }
          return S === R ? !1 : v[Q.get(v.type)] === S;
        }
        function ge(y, R, v) {
          let S = y.getValue(), l = S.type === "ConditionalExpression", A = l ? "consequent" : "trueType", w = l ? "alternate" : "falseType", I = l ? ["test"] : ["checkType", "extendsType"], O = S[A], M = S[w], ee = [], pe = !1, he = y.getParentNode(), ce = he.type === S.type && I.some((Qe) => he[Qe] === S), xe = he.type === S.type && !ce, ie, je, de = 0;
          do
            je = ie || S, ie = y.getParentNode(de), de++;
          while (ie && ie.type === S.type && I.every((Qe) => ie[Qe] !== je));
          let oe = ie || he, Ne = je;
          if (l && (p(S[I[0]]) || p(O) || p(M) || _(Ne))) {
            pe = !0, xe = !0;
            let Qe = (kt) => [G("("), b([F, kt]), F, G(")")], Ze = (kt) => kt.type === "NullLiteral" || kt.type === "Literal" && kt.value === null || kt.type === "Identifier" && kt.name === "undefined";
            ee.push(" ? ", Ze(O) ? v(A) : Qe(v(A)), " : ", M.type === S.type || Ze(M) ? v(w) : Qe(v(w)));
          } else {
            let Qe = [C, "? ", O.type === S.type ? G("", "(") : "", T(2, v(A)), O.type === S.type ? G("", ")") : "", C, ": ", M.type === S.type ? v(w) : T(2, v(w))];
            ee.push(he.type !== S.type || he[w] === S || ce ? Qe : R.useTabs ? W(b(Qe)) : T(Math.max(0, R.tabWidth - 2), Qe));
          }
          let Je = [...I.map((Qe) => c(S[Qe])), c(O), c(M)].flat().some((Qe) => E(Qe) && t(R.originalText, h(Qe), D(Qe))), _e = (Qe) => he === oe ? g(Qe, { shouldBreak: Je }) : Je ? [Qe, B] : Qe, it = !pe && (i(he) || he.type === "NGPipeExpression" && he.left === S) && !he.computed, me = H(y), Se = _e([U(y, R, v), xe ? ee : b(ee), l && it && !me ? F : ""]);
          return ce || me ? g([b([F, Se]), F]) : Se;
        }
        m.exports = { printTernary: ge };
      } }), Wo = Ce({ "src/language-js/print/statement.js"(o, m) {
        Be();
        var { builders: { hardline: t } } = sr(), p = ai(), { getLeftSidePathName: c, hasNakedLeftSide: e, isJsxNode: i, isTheOnlyJsxElementInMarkdown: u, hasComment: h, CommentCheckFlags: D, isNextLineEmpty: E } = Vr(), { shouldPrintParamsWithoutParens: C } = Xu();
        function F(U, Q, H, ge) {
          let y = U.getValue(), R = [], v = y.type === "ClassBody", S = g(y[ge]);
          return U.each((l, A, w) => {
            let I = l.getValue();
            if (I.type === "EmptyStatement")
              return;
            let O = H();
            !Q.semi && !v && !u(Q, l) && b(l, Q) ? h(I, D.Leading) ? R.push(H([], { needsSemi: !0 })) : R.push(";", O) : R.push(O), !Q.semi && v && B(I) && _(I, w[A + 1]) && R.push(";"), I !== S && (R.push(t), E(I, Q) && R.push(t));
          }, ge), R;
        }
        function g(U) {
          for (let Q = U.length - 1; Q >= 0; Q--) {
            let H = U[Q];
            if (H.type !== "EmptyStatement")
              return H;
          }
        }
        function b(U, Q) {
          return U.getNode().type !== "ExpressionStatement" ? !1 : U.call((H) => T(H, Q), "expression");
        }
        function T(U, Q) {
          let H = U.getValue();
          switch (H.type) {
            case "ParenthesizedExpression":
            case "TypeCastExpression":
            case "ArrayExpression":
            case "ArrayPattern":
            case "TemplateLiteral":
            case "TemplateElement":
            case "RegExpLiteral":
              return !0;
            case "ArrowFunctionExpression": {
              if (!C(U, Q))
                return !0;
              break;
            }
            case "UnaryExpression": {
              let { prefix: ge, operator: y } = H;
              if (ge && (y === "+" || y === "-"))
                return !0;
              break;
            }
            case "BindExpression": {
              if (!H.object)
                return !0;
              break;
            }
            case "Literal": {
              if (H.regex)
                return !0;
              break;
            }
            default:
              if (i(H))
                return !0;
          }
          return p(U, Q) ? !0 : e(H) ? U.call((ge) => T(ge, Q), ...c(U, H)) : !1;
        }
        function G(U, Q, H) {
          return F(U, Q, H, "body");
        }
        function W(U, Q, H) {
          return F(U, Q, H, "consequent");
        }
        var B = (U) => {
          let { type: Q } = U;
          return Q === "ClassProperty" || Q === "PropertyDefinition" || Q === "ClassPrivateProperty" || Q === "ClassAccessorProperty" || Q === "AccessorProperty" || Q === "TSAbstractPropertyDefinition" || Q === "TSAbstractAccessorProperty";
        };
        function _(U, Q) {
          let { type: H, name: ge } = U.key;
          if (!U.computed && H === "Identifier" && (ge === "static" || ge === "get" || ge === "set" || ge === "accessor") && !U.value && !U.typeAnnotation)
            return !0;
          if (!Q || Q.static || Q.accessibility)
            return !1;
          if (!Q.computed) {
            let y = Q.key && Q.key.name;
            if (y === "in" || y === "instanceof")
              return !0;
          }
          if (B(Q) && Q.variance && !Q.static && !Q.declare)
            return !0;
          switch (Q.type) {
            case "ClassProperty":
            case "PropertyDefinition":
            case "TSAbstractPropertyDefinition":
              return Q.computed;
            case "MethodDefinition":
            case "TSAbstractMethodDefinition":
            case "ClassMethod":
            case "ClassPrivateMethod": {
              if ((Q.value ? Q.value.async : Q.async) || Q.kind === "get" || Q.kind === "set")
                return !1;
              let y = Q.value ? Q.value.generator : Q.generator;
              return !!(Q.computed || y);
            }
            case "TSIndexSignature":
              return !0;
          }
          return !1;
        }
        m.exports = { printBody: G, printSwitchCaseConsequent: W };
      } }), Xo = Ce({ "src/language-js/print/block.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { isNonEmptyArray: p } = yr(), { builders: { hardline: c, indent: e } } = sr(), { hasComment: i, CommentCheckFlags: u, isNextLineEmpty: h } = Vr(), { printHardlineAfterHeritage: D } = Du(), { printBody: E } = Wo();
        function C(g, b, T) {
          let G = g.getValue(), W = [];
          if (G.type === "StaticBlock" && W.push("static "), G.type === "ClassBody" && p(G.body)) {
            let _ = g.getParentNode();
            W.push(D(_));
          }
          W.push("{");
          let B = F(g, b, T);
          if (B)
            W.push(e([c, B]), c);
          else {
            let _ = g.getParentNode(), U = g.getParentNode(1);
            _.type === "ArrowFunctionExpression" || _.type === "FunctionExpression" || _.type === "FunctionDeclaration" || _.type === "ObjectMethod" || _.type === "ClassMethod" || _.type === "ClassPrivateMethod" || _.type === "ForStatement" || _.type === "WhileStatement" || _.type === "DoWhileStatement" || _.type === "DoExpression" || _.type === "CatchClause" && !U.finalizer || _.type === "TSModuleDeclaration" || _.type === "TSDeclareFunction" || G.type === "StaticBlock" || G.type === "ClassBody" || W.push(c);
          }
          return W.push("}"), W;
        }
        function F(g, b, T) {
          let G = g.getValue(), W = p(G.directives), B = G.body.some((Q) => Q.type !== "EmptyStatement"), _ = i(G, u.Dangling);
          if (!W && !B && !_)
            return "";
          let U = [];
          if (W && g.each((Q, H, ge) => {
            U.push(T()), (H < ge.length - 1 || B || _) && (U.push(c), h(Q.getValue(), b) && U.push(c));
          }, "directives"), B && U.push(E(g, b, T)), _ && U.push(t(g, b, !0)), G.type === "Program") {
            let Q = g.getParentNode();
            (!Q || Q.type !== "ModuleExpression") && U.push(c);
          }
          return U;
        }
        m.exports = { printBlock: C, printBlockBody: F };
      } }), _a = Ce({ "src/language-js/print/typescript.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { hasNewlineInRange: p } = yr(), { builders: { join: c, line: e, hardline: i, softline: u, group: h, indent: D, conditionalGroup: E, ifBreak: C } } = sr(), { isStringLiteral: F, getTypeScriptMappedTypeModifier: g, shouldPrintComma: b, isCallExpression: T, isMemberExpression: G } = Vr(), W = Pa(), { locStart: B, locEnd: _ } = Dn(), { printOptionalToken: U, printTypeScriptModifiers: Q } = Cn(), { printTernary: H } = zo(), { printFunctionParameters: ge, shouldGroupFunctionParameters: y } = zu(), { printTemplateLiteral: R } = zi(), { printArrayItems: v } = Wi(), { printObject: S } = Ys(), { printClassProperty: l, printClassMethod: A } = Du(), { printTypeParameter: w, printTypeParameters: I } = Hi(), { printPropertyKey: O } = gu(), { printFunction: M, printMethodInternal: ee } = Xu(), { printInterface: pe } = Uo(), { printBlock: he } = Xo(), { printTypeAlias: ce, printIntersectionType: xe, printUnionType: ie, printFunctionType: je, printTupleType: de, printIndexedAccessType: oe, printJSDocType: Ne } = Wu();
        function Je(_e, it, me) {
          let Se = _e.getValue();
          if (!Se.type.startsWith("TS"))
            return;
          if (W(Se))
            return Se.type.slice(2, -7).toLowerCase();
          let Qe = it.semi ? ";" : "", Ze = [];
          switch (Se.type) {
            case "TSThisType":
              return "this";
            case "TSTypeAssertion": {
              let kt = !(Se.expression.type === "ArrayExpression" || Se.expression.type === "ObjectExpression"), ke = h(["<", D([u, me("typeAnnotation")]), u, ">"]), be = [C("("), D([u, me("expression")]), u, C(")")];
              return kt ? E([[ke, me("expression")], [ke, h(be, { shouldBreak: !0 })], [ke, me("expression")]]) : h([ke, me("expression")]);
            }
            case "TSDeclareFunction":
              return M(_e, me, it);
            case "TSExportAssignment":
              return ["export = ", me("expression"), Qe];
            case "TSModuleBlock":
              return he(_e, it, me);
            case "TSInterfaceBody":
            case "TSTypeLiteral":
              return S(_e, it, me);
            case "TSTypeAliasDeclaration":
              return ce(_e, it, me);
            case "TSQualifiedName":
              return c(".", [me("left"), me("right")]);
            case "TSAbstractMethodDefinition":
            case "TSDeclareMethod":
              return A(_e, it, me);
            case "TSAbstractAccessorProperty":
            case "TSAbstractPropertyDefinition":
              return l(_e, it, me);
            case "TSInterfaceHeritage":
            case "TSExpressionWithTypeArguments":
              return Ze.push(me("expression")), Se.typeParameters && Ze.push(me("typeParameters")), Ze;
            case "TSTemplateLiteralType":
              return R(_e, me, it);
            case "TSNamedTupleMember":
              return [me("label"), Se.optional ? "?" : "", ": ", me("elementType")];
            case "TSRestType":
              return ["...", me("typeAnnotation")];
            case "TSOptionalType":
              return [me("typeAnnotation"), "?"];
            case "TSInterfaceDeclaration":
              return pe(_e, it, me);
            case "TSClassImplements":
              return [me("expression"), me("typeParameters")];
            case "TSTypeParameterDeclaration":
            case "TSTypeParameterInstantiation":
              return I(_e, it, me, "params");
            case "TSTypeParameter":
              return w(_e, it, me);
            case "TSSatisfiesExpression":
            case "TSAsExpression": {
              let kt = Se.type === "TSAsExpression" ? "as" : "satisfies";
              Ze.push(me("expression"), ` ${kt} `, me("typeAnnotation"));
              let ke = _e.getParentNode();
              return T(ke) && ke.callee === Se || G(ke) && ke.object === Se ? h([D([u, ...Ze]), u]) : Ze;
            }
            case "TSArrayType":
              return [me("elementType"), "[]"];
            case "TSPropertySignature":
              return Se.readonly && Ze.push("readonly "), Ze.push(O(_e, it, me), U(_e)), Se.typeAnnotation && Ze.push(": ", me("typeAnnotation")), Se.initializer && Ze.push(" = ", me("initializer")), Ze;
            case "TSParameterProperty":
              return Se.accessibility && Ze.push(Se.accessibility + " "), Se.export && Ze.push("export "), Se.static && Ze.push("static "), Se.override && Ze.push("override "), Se.readonly && Ze.push("readonly "), Ze.push(me("parameter")), Ze;
            case "TSTypeQuery":
              return ["typeof ", me("exprName"), me("typeParameters")];
            case "TSIndexSignature": {
              let kt = _e.getParentNode(), ke = Se.parameters.length > 1 ? C(b(it) ? "," : "") : "", be = h([D([u, c([", ", u], _e.map(me, "parameters"))]), ke, u]);
              return [Se.export ? "export " : "", Se.accessibility ? [Se.accessibility, " "] : "", Se.static ? "static " : "", Se.readonly ? "readonly " : "", Se.declare ? "declare " : "", "[", Se.parameters ? be : "", Se.typeAnnotation ? "]: " : "]", Se.typeAnnotation ? me("typeAnnotation") : "", kt.type === "ClassBody" ? Qe : ""];
            }
            case "TSTypePredicate":
              return [Se.asserts ? "asserts " : "", me("parameterName"), Se.typeAnnotation ? [" is ", me("typeAnnotation")] : ""];
            case "TSNonNullExpression":
              return [me("expression"), "!"];
            case "TSImportType":
              return [Se.isTypeOf ? "typeof " : "", "import(", me(Se.parameter ? "parameter" : "argument"), ")", Se.qualifier ? [".", me("qualifier")] : "", I(_e, it, me, "typeParameters")];
            case "TSLiteralType":
              return me("literal");
            case "TSIndexedAccessType":
              return oe(_e, it, me);
            case "TSConstructSignatureDeclaration":
            case "TSCallSignatureDeclaration":
            case "TSConstructorType": {
              if (Se.type === "TSConstructorType" && Se.abstract && Ze.push("abstract "), Se.type !== "TSCallSignatureDeclaration" && Ze.push("new "), Ze.push(h(ge(_e, me, it, !1, !0))), Se.returnType || Se.typeAnnotation) {
                let kt = Se.type === "TSConstructorType";
                Ze.push(kt ? " => " : ": ", me("returnType"), me("typeAnnotation"));
              }
              return Ze;
            }
            case "TSTypeOperator":
              return [Se.operator, " ", me("typeAnnotation")];
            case "TSMappedType": {
              let kt = p(it.originalText, B(Se), _(Se));
              return h(["{", D([it.bracketSpacing ? e : u, Se.readonly ? [g(Se.readonly, "readonly"), " "] : "", Q(_e, it, me), me("typeParameter"), Se.optional ? g(Se.optional, "?") : "", Se.typeAnnotation ? ": " : "", me("typeAnnotation"), C(Qe)]), t(_e, it, !0), it.bracketSpacing ? e : u, "}"], { shouldBreak: kt });
            }
            case "TSMethodSignature": {
              let kt = Se.kind && Se.kind !== "method" ? `${Se.kind} ` : "";
              Ze.push(Se.accessibility ? [Se.accessibility, " "] : "", kt, Se.export ? "export " : "", Se.static ? "static " : "", Se.readonly ? "readonly " : "", Se.abstract ? "abstract " : "", Se.declare ? "declare " : "", Se.computed ? "[" : "", me("key"), Se.computed ? "]" : "", U(_e));
              let ke = ge(_e, me, it, !1, !0), be = Se.returnType ? "returnType" : "typeAnnotation", Oe = Se[be], Re = Oe ? me(be) : "", ut = y(Se, Re);
              return Ze.push(ut ? h(ke) : ke), Oe && Ze.push(": ", h(Re)), h(Ze);
            }
            case "TSNamespaceExportDeclaration":
              return Ze.push("export as namespace ", me("id")), it.semi && Ze.push(";"), h(Ze);
            case "TSEnumDeclaration":
              return Se.declare && Ze.push("declare "), Se.modifiers && Ze.push(Q(_e, it, me)), Se.const && Ze.push("const "), Ze.push("enum ", me("id"), " "), Se.members.length === 0 ? Ze.push(h(["{", t(_e, it), u, "}"])) : Ze.push(h(["{", D([i, v(_e, it, "members", me), b(it, "es5") ? "," : ""]), t(_e, it, !0), i, "}"])), Ze;
            case "TSEnumMember":
              return Se.computed ? Ze.push("[", me("id"), "]") : Ze.push(me("id")), Se.initializer && Ze.push(" = ", me("initializer")), Ze;
            case "TSImportEqualsDeclaration":
              return Se.isExport && Ze.push("export "), Ze.push("import "), Se.importKind && Se.importKind !== "value" && Ze.push(Se.importKind, " "), Ze.push(me("id"), " = ", me("moduleReference")), it.semi && Ze.push(";"), h(Ze);
            case "TSExternalModuleReference":
              return ["require(", me("expression"), ")"];
            case "TSModuleDeclaration": {
              let kt = _e.getParentNode(), ke = F(Se.id), be = kt.type === "TSModuleDeclaration", Oe = Se.body && Se.body.type === "TSModuleDeclaration";
              if (be)
                Ze.push(".");
              else {
                Se.declare && Ze.push("declare "), Ze.push(Q(_e, it, me));
                let Re = it.originalText.slice(B(Se), B(Se.id));
                Se.id.type === "Identifier" && Se.id.name === "global" && !/namespace|module/.test(Re) || Ze.push(ke || /(?:^|\s)module(?:\s|$)/.test(Re) ? "module " : "namespace ");
              }
              return Ze.push(me("id")), Oe ? Ze.push(me("body")) : Se.body ? Ze.push(" ", h(me("body"))) : Ze.push(Qe), Ze;
            }
            case "TSConditionalType":
              return H(_e, it, me);
            case "TSInferType":
              return ["infer", " ", me("typeParameter")];
            case "TSIntersectionType":
              return xe(_e, it, me);
            case "TSUnionType":
              return ie(_e, it, me);
            case "TSFunctionType":
              return je(_e, it, me);
            case "TSTupleType":
              return de(_e, it, me);
            case "TSTypeReference":
              return [me("typeName"), I(_e, it, me, "typeParameters")];
            case "TSTypeAnnotation":
              return me("typeAnnotation");
            case "TSEmptyBodyFunctionExpression":
              return ee(_e, it, me);
            case "TSJSDocAllType":
              return "*";
            case "TSJSDocUnknownType":
              return "?";
            case "TSJSDocNullableType":
              return Ne(_e, me, "?");
            case "TSJSDocNonNullableType":
              return Ne(_e, me, "!");
            case "TSInstantiationExpression":
              return [me("expression"), me("typeParameters")];
            default:
              throw new Error(`Unknown TypeScript node type: ${JSON.stringify(Se.type)}.`);
          }
        }
        m.exports = { printTypescript: Je };
      } }), Ia = Ce({ "src/language-js/print/comment.js"(o, m) {
        Be();
        var { hasNewline: t } = yr(), { builders: { join: p, hardline: c }, utils: { replaceTextEndOfLine: e } } = sr(), { isLineComment: i } = Vr(), { locStart: u, locEnd: h } = Dn(), D = Gi();
        function E(g, b) {
          let T = g.getValue();
          if (i(T))
            return b.originalText.slice(u(T), h(T)).trimEnd();
          if (D(T)) {
            if (C(T)) {
              let B = F(T);
              return T.trailing && !t(b.originalText, u(T), { backwards: !0 }) ? [c, B] : B;
            }
            let G = h(T), W = b.originalText.slice(G - 3, G) === "*-/";
            return ["/*", e(T.value), W ? "*-/" : "*/"];
          }
          throw new Error("Not a comment: " + JSON.stringify(T));
        }
        function C(g) {
          let b = `*${g.value}*`.split(`
`);
          return b.length > 1 && b.every((T) => T.trim()[0] === "*");
        }
        function F(g) {
          let b = g.value.split(`
`);
          return ["/*", p(c, b.map((T, G) => G === 0 ? T.trimEnd() : " " + (G < b.length - 1 ? T.trim() : T.trimStart()))), "*/"];
        }
        m.exports = { printComment: E };
      } }), Oa = Ce({ "src/language-js/print/literal.js"(o, m) {
        Be();
        var { printString: t, printNumber: p } = yr(), { replaceTextEndOfLine: c } = $i(), { printDirective: e } = Cn();
        function i(E, C) {
          let F = E.getNode();
          switch (F.type) {
            case "RegExpLiteral":
              return D(F);
            case "BigIntLiteral":
              return h(F.bigint || F.extra.raw);
            case "NumericLiteral":
              return p(F.extra.raw);
            case "StringLiteral":
              return c(t(F.extra.raw, C));
            case "NullLiteral":
              return "null";
            case "BooleanLiteral":
              return String(F.value);
            case "DecimalLiteral":
              return p(F.value) + "m";
            case "Literal": {
              if (F.regex)
                return D(F.regex);
              if (F.bigint)
                return h(F.raw);
              if (F.decimal)
                return p(F.decimal) + "m";
              let { value: g } = F;
              return typeof g == "number" ? p(F.raw) : typeof g == "string" ? u(E) ? e(F.raw, C) : c(t(F.raw, C)) : String(g);
            }
          }
        }
        function u(E) {
          if (E.getName() !== "expression")
            return;
          let C = E.getParentNode();
          return C.type === "ExpressionStatement" && C.directive;
        }
        function h(E) {
          return E.toLowerCase();
        }
        function D(E) {
          let { pattern: C, flags: F } = E;
          return F = [...F].sort().join(""), `/${C}/${F}`;
        }
        m.exports = { printLiteral: i };
      } }), La = Ce({ "src/language-js/printer-estree.js"(o, m) {
        Be();
        var { printDanglingComments: t } = tn(), { hasNewline: p } = yr(), { builders: { join: c, line: e, hardline: i, softline: u, group: h, indent: D }, utils: { replaceTextEndOfLine: E } } = sr(), C = Sa(), F = Lo(), { insertPragma: g } = Ws(), b = Uu(), T = ai(), G = Xs(), { hasFlowShorthandAnnotationComment: W, hasComment: B, CommentCheckFlags: _, isTheOnlyJsxElementInMarkdown: U, isLineComment: Q, isNextLineEmpty: H, needsHardlineAfterDanglingComment: ge, hasIgnoreComment: y, isCallExpression: R, isMemberExpression: v, markerForIfWithoutBlockAndSameLineComment: S } = Vr(), { locStart: l, locEnd: A } = Dn(), w = Gi(), { printHtmlBinding: I, isVueEventBindingExpression: O } = Hs(), { printAngular: M } = Ba(), { printJsx: ee, hasJsxIgnoreComment: pe } = Ro(), { printFlow: he } = ja(), { printTypescript: ce } = _a(), { printOptionalToken: xe, printBindExpressionCallee: ie, printTypeAnnotation: je, adjustClause: de, printRestSpread: oe, printDefiniteToken: Ne, printDirective: Je } = Cn(), { printImportDeclaration: _e, printExportDeclaration: it, printExportAllDeclaration: me, printModuleSpecifier: Se } = Go(), { printTernary: Qe } = zo(), { printTemplateLiteral: Ze } = zi(), { printArray: kt } = Wi(), { printObject: ke } = Ys(), { printClass: be, printClassMethod: Oe, printClassProperty: Re } = Du(), { printProperty: ut } = gu(), { printFunction: ht, printArrowFunction: vt, printMethod: Ut, printReturnStatement: Dr, printThrowStatement: mr } = Xu(), { printCallExpression: Vt } = Jo(), { printVariableDeclarator: Qt, printAssignmentExpression: Xe } = Xi(), { printBinaryishExpression: ye } = Gu(), { printSwitchCaseConsequent: tt } = Wo(), { printMemberExpression: Te } = qo(), { printBlock: rt, printBlockBody: jt } = Xo(), { printComment: Ct } = Ia(), { printLiteral: nt } = Oa(), { printDecorators: N } = Ks();
        function Fe(Et, $t, bt, Hr) {
          let Ot = Ue(Et, $t, bt, Hr);
          if (!Ot)
            return "";
          let Gr = Et.getValue(), { type: _t } = Gr;
          if (_t === "ClassMethod" || _t === "ClassPrivateMethod" || _t === "ClassProperty" || _t === "ClassAccessorProperty" || _t === "AccessorProperty" || _t === "TSAbstractAccessorProperty" || _t === "PropertyDefinition" || _t === "TSAbstractPropertyDefinition" || _t === "ClassPrivateProperty" || _t === "MethodDefinition" || _t === "TSAbstractMethodDefinition" || _t === "TSDeclareMethod")
            return Ot;
          let nr = [Ot], gr = N(Et, $t, bt), Rr = Gr.type === "ClassExpression" && gr;
          if (gr && (nr = [...gr, Ot], !Rr))
            return h(nr);
          if (!T(Et, $t))
            return Hr && Hr.needsSemi && nr.unshift(";"), nr.length === 1 && nr[0] === Ot ? Ot : nr;
          if (Rr && (nr = [D([e, ...nr])]), nr.unshift("("), Hr && Hr.needsSemi && nr.unshift(";"), W(Gr)) {
            let [Lt] = Gr.trailingComments;
            nr.push(" /*", Lt.value.trimStart(), "*/"), Lt.printed = !0;
          }
          return Rr && nr.push(e), nr.push(")"), nr;
        }
        function Ue(Et, $t, bt, Hr) {
          let Ot = Et.getValue(), Gr = $t.semi ? ";" : "";
          if (!Ot)
            return "";
          if (typeof Ot == "string")
            return Ot;
          for (let nr of [nt, I, M, ee, he, ce]) {
            let gr = nr(Et, $t, bt);
            if (typeof gr < "u")
              return gr;
          }
          let _t = [];
          switch (Ot.type) {
            case "JsExpressionRoot":
              return bt("node");
            case "JsonRoot":
              return [bt("node"), i];
            case "File":
              return Ot.program && Ot.program.interpreter && _t.push(bt(["program", "interpreter"])), _t.push(bt("program")), _t;
            case "Program":
              return jt(Et, $t, bt);
            case "EmptyStatement":
              return "";
            case "ExpressionStatement": {
              if ($t.parser === "__vue_event_binding" || $t.parser === "__vue_ts_event_binding") {
                let gr = Et.getParentNode();
                if (gr.type === "Program" && gr.body.length === 1 && gr.body[0] === Ot)
                  return [bt("expression"), O(Ot.expression) ? ";" : ""];
              }
              let nr = t(Et, $t, !0, (gr) => {
                let { marker: Rr } = gr;
                return Rr === S;
              });
              return [bt("expression"), U($t, Et) ? "" : Gr, nr ? [" ", nr] : ""];
            }
            case "ParenthesizedExpression":
              return !B(Ot.expression) && (Ot.expression.type === "ObjectExpression" || Ot.expression.type === "ArrayExpression") ? ["(", bt("expression"), ")"] : h(["(", D([u, bt("expression")]), u, ")"]);
            case "AssignmentExpression":
              return Xe(Et, $t, bt);
            case "VariableDeclarator":
              return Qt(Et, $t, bt);
            case "BinaryExpression":
            case "LogicalExpression":
              return ye(Et, $t, bt);
            case "AssignmentPattern":
              return [bt("left"), " = ", bt("right")];
            case "OptionalMemberExpression":
            case "MemberExpression":
              return Te(Et, $t, bt);
            case "MetaProperty":
              return [bt("meta"), ".", bt("property")];
            case "BindExpression":
              return Ot.object && _t.push(bt("object")), _t.push(h(D([u, ie(Et, $t, bt)]))), _t;
            case "Identifier":
              return [Ot.name, xe(Et), Ne(Et), je(Et, $t, bt)];
            case "V8IntrinsicIdentifier":
              return ["%", Ot.name];
            case "SpreadElement":
            case "SpreadElementPattern":
            case "SpreadProperty":
            case "SpreadPropertyPattern":
            case "RestElement":
              return oe(Et, $t, bt);
            case "FunctionDeclaration":
            case "FunctionExpression":
              return ht(Et, bt, $t, Hr);
            case "ArrowFunctionExpression":
              return vt(Et, $t, bt, Hr);
            case "YieldExpression":
              return _t.push("yield"), Ot.delegate && _t.push("*"), Ot.argument && _t.push(" ", bt("argument")), _t;
            case "AwaitExpression": {
              if (_t.push("await"), Ot.argument) {
                _t.push(" ", bt("argument"));
                let nr = Et.getParentNode();
                if (R(nr) && nr.callee === Ot || v(nr) && nr.object === Ot) {
                  _t = [D([u, ..._t]), u];
                  let gr = Et.findAncestor((Rr) => Rr.type === "AwaitExpression" || Rr.type === "BlockStatement");
                  if (!gr || gr.type !== "AwaitExpression")
                    return h(_t);
                }
              }
              return _t;
            }
            case "ExportDefaultDeclaration":
            case "ExportNamedDeclaration":
              return it(Et, $t, bt);
            case "ExportAllDeclaration":
              return me(Et, $t, bt);
            case "ImportDeclaration":
              return _e(Et, $t, bt);
            case "ImportSpecifier":
            case "ExportSpecifier":
            case "ImportNamespaceSpecifier":
            case "ExportNamespaceSpecifier":
            case "ImportDefaultSpecifier":
            case "ExportDefaultSpecifier":
              return Se(Et, $t, bt);
            case "ImportAttribute":
              return [bt("key"), ": ", bt("value")];
            case "Import":
              return "import";
            case "BlockStatement":
            case "StaticBlock":
            case "ClassBody":
              return rt(Et, $t, bt);
            case "ThrowStatement":
              return mr(Et, $t, bt);
            case "ReturnStatement":
              return Dr(Et, $t, bt);
            case "NewExpression":
            case "ImportExpression":
            case "OptionalCallExpression":
            case "CallExpression":
              return Vt(Et, $t, bt);
            case "ObjectExpression":
            case "ObjectPattern":
            case "RecordExpression":
              return ke(Et, $t, bt);
            case "ObjectProperty":
            case "Property":
              return Ot.method || Ot.kind === "get" || Ot.kind === "set" ? Ut(Et, $t, bt) : ut(Et, $t, bt);
            case "ObjectMethod":
              return Ut(Et, $t, bt);
            case "Decorator":
              return ["@", bt("expression")];
            case "ArrayExpression":
            case "ArrayPattern":
            case "TupleExpression":
              return kt(Et, $t, bt);
            case "SequenceExpression": {
              let nr = Et.getParentNode(0);
              if (nr.type === "ExpressionStatement" || nr.type === "ForStatement") {
                let gr = [];
                return Et.each((Rr, Lt) => {
                  Lt === 0 ? gr.push(bt()) : gr.push(",", D([e, bt()]));
                }, "expressions"), h(gr);
              }
              return h(c([",", e], Et.map(bt, "expressions")));
            }
            case "ThisExpression":
              return "this";
            case "Super":
              return "super";
            case "Directive":
              return [bt("value"), Gr];
            case "DirectiveLiteral":
              return Je(Ot.extra.raw, $t);
            case "UnaryExpression":
              return _t.push(Ot.operator), /[a-z]$/.test(Ot.operator) && _t.push(" "), B(Ot.argument) ? _t.push(h(["(", D([u, bt("argument")]), u, ")"])) : _t.push(bt("argument")), _t;
            case "UpdateExpression":
              return _t.push(bt("argument"), Ot.operator), Ot.prefix && _t.reverse(), _t;
            case "ConditionalExpression":
              return Qe(Et, $t, bt);
            case "VariableDeclaration": {
              let nr = Et.map(bt, "declarations"), gr = Et.getParentNode(), Rr = gr.type === "ForStatement" || gr.type === "ForInStatement" || gr.type === "ForOfStatement", Lt = Ot.declarations.some((or) => or.init), dr;
              return nr.length === 1 && !B(Ot.declarations[0]) ? dr = nr[0] : nr.length > 0 && (dr = D(nr[0])), _t = [Ot.declare ? "declare " : "", Ot.kind, dr ? [" ", dr] : "", D(nr.slice(1).map((or) => [",", Lt && !Rr ? i : e, or]))], Rr && gr.body !== Ot || _t.push(Gr), h(_t);
            }
            case "WithStatement":
              return h(["with (", bt("object"), ")", de(Ot.body, bt("body"))]);
            case "IfStatement": {
              let nr = de(Ot.consequent, bt("consequent")), gr = h(["if (", h([D([u, bt("test")]), u]), ")", nr]);
              if (_t.push(gr), Ot.alternate) {
                let Rr = B(Ot.consequent, _.Trailing | _.Line) || ge(Ot), Lt = Ot.consequent.type === "BlockStatement" && !Rr;
                _t.push(Lt ? " " : i), B(Ot, _.Dangling) && _t.push(t(Et, $t, !0), Rr ? i : " "), _t.push("else", h(de(Ot.alternate, bt("alternate"), Ot.alternate.type === "IfStatement")));
              }
              return _t;
            }
            case "ForStatement": {
              let nr = de(Ot.body, bt("body")), gr = t(Et, $t, !0), Rr = gr ? [gr, u] : "";
              return !Ot.init && !Ot.test && !Ot.update ? [Rr, h(["for (;;)", nr])] : [Rr, h(["for (", h([D([u, bt("init"), ";", e, bt("test"), ";", e, bt("update")]), u]), ")", nr])];
            }
            case "WhileStatement":
              return h(["while (", h([D([u, bt("test")]), u]), ")", de(Ot.body, bt("body"))]);
            case "ForInStatement":
              return h(["for (", bt("left"), " in ", bt("right"), ")", de(Ot.body, bt("body"))]);
            case "ForOfStatement":
              return h(["for", Ot.await ? " await" : "", " (", bt("left"), " of ", bt("right"), ")", de(Ot.body, bt("body"))]);
            case "DoWhileStatement": {
              let nr = de(Ot.body, bt("body"));
              return _t = [h(["do", nr])], Ot.body.type === "BlockStatement" ? _t.push(" ") : _t.push(i), _t.push("while (", h([D([u, bt("test")]), u]), ")", Gr), _t;
            }
            case "DoExpression":
              return [Ot.async ? "async " : "", "do ", bt("body")];
            case "BreakStatement":
              return _t.push("break"), Ot.label && _t.push(" ", bt("label")), _t.push(Gr), _t;
            case "ContinueStatement":
              return _t.push("continue"), Ot.label && _t.push(" ", bt("label")), _t.push(Gr), _t;
            case "LabeledStatement":
              return Ot.body.type === "EmptyStatement" ? [bt("label"), ":;"] : [bt("label"), ": ", bt("body")];
            case "TryStatement":
              return ["try ", bt("block"), Ot.handler ? [" ", bt("handler")] : "", Ot.finalizer ? [" finally ", bt("finalizer")] : ""];
            case "CatchClause":
              if (Ot.param) {
                let nr = B(Ot.param, (Rr) => !w(Rr) || Rr.leading && p($t.originalText, A(Rr)) || Rr.trailing && p($t.originalText, l(Rr), { backwards: !0 })), gr = bt("param");
                return ["catch ", nr ? ["(", D([u, gr]), u, ") "] : ["(", gr, ") "], bt("body")];
              }
              return ["catch ", bt("body")];
            case "SwitchStatement":
              return [h(["switch (", D([u, bt("discriminant")]), u, ")"]), " {", Ot.cases.length > 0 ? D([i, c(i, Et.map((nr, gr, Rr) => {
                let Lt = nr.getValue();
                return [bt(), gr !== Rr.length - 1 && H(Lt, $t) ? i : ""];
              }, "cases"))]) : "", i, "}"];
            case "SwitchCase": {
              Ot.test ? _t.push("case ", bt("test"), ":") : _t.push("default:"), B(Ot, _.Dangling) && _t.push(" ", t(Et, $t, !0));
              let nr = Ot.consequent.filter((gr) => gr.type !== "EmptyStatement");
              if (nr.length > 0) {
                let gr = tt(Et, $t, bt);
                _t.push(nr.length === 1 && nr[0].type === "BlockStatement" ? [" ", gr] : D([i, gr]));
              }
              return _t;
            }
            case "DebuggerStatement":
              return ["debugger", Gr];
            case "ClassDeclaration":
            case "ClassExpression":
              return be(Et, $t, bt);
            case "ClassMethod":
            case "ClassPrivateMethod":
            case "MethodDefinition":
              return Oe(Et, $t, bt);
            case "ClassProperty":
            case "PropertyDefinition":
            case "ClassPrivateProperty":
            case "ClassAccessorProperty":
            case "AccessorProperty":
              return Re(Et, $t, bt);
            case "TemplateElement":
              return E(Ot.value.raw);
            case "TemplateLiteral":
              return Ze(Et, bt, $t);
            case "TaggedTemplateExpression":
              return [bt("tag"), bt("typeParameters"), bt("quasi")];
            case "PrivateIdentifier":
              return ["#", bt("name")];
            case "PrivateName":
              return ["#", bt("id")];
            case "InterpreterDirective":
              return _t.push("#!", Ot.value, i), H(Ot, $t) && _t.push(i), _t;
            case "TopicReference":
              return "%";
            case "ArgumentPlaceholder":
              return "?";
            case "ModuleExpression": {
              _t.push("module {");
              let nr = bt("body");
              return nr && _t.push(D([i, nr]), i), _t.push("}"), _t;
            }
            default:
              throw new Error("unknown type: " + JSON.stringify(Ot.type));
          }
        }
        function yt(Et) {
          return Et.type && !w(Et) && !Q(Et) && Et.type !== "EmptyStatement" && Et.type !== "TemplateElement" && Et.type !== "Import" && Et.type !== "TSEmptyBodyFunctionExpression";
        }
        m.exports = { preprocess: G, print: Fe, embed: C, insertPragma: g, massageAstNode: F, hasPrettierIgnore(Et) {
          return y(Et) || pe(Et);
        }, willPrintOwnComments: b.willPrintOwnComments, canAttachComment: yt, printComment: Ct, isBlockComment: w, handleComments: { avoidAstMutation: !0, ownLine: b.handleOwnLineComment, endOfLine: b.handleEndOfLineComment, remaining: b.handleRemainingComment }, getCommentChildNodes: b.getCommentChildNodes };
      } }), Qs = Ce({ "src/language-js/printer-estree-json.js"(o, m) {
        Be();
        var { builders: { hardline: t, indent: p, join: c } } = sr(), e = Xs();
        function i(E, C, F) {
          let g = E.getValue();
          switch (g.type) {
            case "JsonRoot":
              return [F("node"), t];
            case "ArrayExpression": {
              if (g.elements.length === 0)
                return "[]";
              let b = E.map(() => E.getValue() === null ? "null" : F(), "elements");
              return ["[", p([t, c([",", t], b)]), t, "]"];
            }
            case "ObjectExpression":
              return g.properties.length === 0 ? "{}" : ["{", p([t, c([",", t], E.map(F, "properties"))]), t, "}"];
            case "ObjectProperty":
              return [F("key"), ": ", F("value")];
            case "UnaryExpression":
              return [g.operator === "+" ? "" : g.operator, F("argument")];
            case "NullLiteral":
              return "null";
            case "BooleanLiteral":
              return g.value ? "true" : "false";
            case "StringLiteral":
              return JSON.stringify(g.value);
            case "NumericLiteral":
              return u(E) ? JSON.stringify(String(g.value)) : JSON.stringify(g.value);
            case "Identifier":
              return u(E) ? JSON.stringify(g.name) : g.name;
            case "TemplateLiteral":
              return F(["quasis", 0]);
            case "TemplateElement":
              return JSON.stringify(g.value.cooked);
            default:
              throw new Error("unknown type: " + JSON.stringify(g.type));
          }
        }
        function u(E) {
          return E.getName() === "key" && E.getParentNode().type === "ObjectProperty";
        }
        var h = /* @__PURE__ */ new Set(["start", "end", "extra", "loc", "comments", "leadingComments", "trailingComments", "innerComments", "errors", "range", "tokens"]);
        function D(E, C) {
          let { type: F } = E;
          if (F === "ObjectProperty") {
            let { key: g } = E;
            g.type === "Identifier" ? C.key = { type: "StringLiteral", value: g.name } : g.type === "NumericLiteral" && (C.key = { type: "StringLiteral", value: String(g.value) });
            return;
          }
          if (F === "UnaryExpression" && E.operator === "+")
            return C.argument;
          if (F === "ArrayExpression") {
            for (let [g, b] of E.elements.entries())
              b === null && C.elements.splice(g, 0, { type: "NullLiteral" });
            return;
          }
          if (F === "TemplateLiteral")
            return { type: "StringLiteral", value: E.quasis[0].value.cooked };
        }
        D.ignoredProperties = h, m.exports = { preprocess: e, print: i, massageAstNode: D };
      } }), Ki = Ce({ "src/common/common-options.js"(o, m) {
        Be();
        var t = "Common";
        m.exports = { bracketSpacing: { since: "0.0.0", category: t, type: "boolean", default: !0, description: "Print spaces between brackets.", oppositeDescription: "Do not print spaces between brackets." }, singleQuote: { since: "0.0.0", category: t, type: "boolean", default: !1, description: "Use single quotes instead of double quotes." }, proseWrap: { since: "1.8.2", category: t, type: "choice", default: [{ since: "1.8.2", value: !0 }, { since: "1.9.0", value: "preserve" }], description: "How to wrap prose.", choices: [{ since: "1.9.0", value: "always", description: "Wrap prose if it exceeds the print width." }, { since: "1.9.0", value: "never", description: "Do not wrap prose." }, { since: "1.9.0", value: "preserve", description: "Wrap prose as-is." }] }, bracketSameLine: { since: "2.4.0", category: t, type: "boolean", default: !1, description: "Put > of opening tags on the last line instead of on a new line." }, singleAttributePerLine: { since: "2.6.0", category: t, type: "boolean", default: !1, description: "Enforce single attribute per line in HTML, Vue and JSX." } };
      } }), Ma = Ce({ "src/language-js/options.js"(o, m) {
        Be();
        var t = Ki(), p = "JavaScript";
        m.exports = { arrowParens: { since: "1.9.0", category: p, type: "choice", default: [{ since: "1.9.0", value: "avoid" }, { since: "2.0.0", value: "always" }], description: "Include parentheses around a sole arrow function parameter.", choices: [{ value: "always", description: "Always include parens. Example: `(x) => x`" }, { value: "avoid", description: "Omit parens when possible. Example: `x => x`" }] }, bracketSameLine: t.bracketSameLine, bracketSpacing: t.bracketSpacing, jsxBracketSameLine: { since: "0.17.0", category: p, type: "boolean", description: "Put > on the last line instead of at a new line.", deprecated: "2.4.0" }, semi: { since: "1.0.0", category: p, type: "boolean", default: !0, description: "Print semicolons.", oppositeDescription: "Do not print semicolons, except at the beginning of lines which may need them." }, singleQuote: t.singleQuote, jsxSingleQuote: { since: "1.15.0", category: p, type: "boolean", default: !1, description: "Use single quotes in JSX." }, quoteProps: { since: "1.17.0", category: p, type: "choice", default: "as-needed", description: "Change when properties in objects are quoted.", choices: [{ value: "as-needed", description: "Only add quotes around object properties where required." }, { value: "consistent", description: "If at least one property in an object requires quotes, quote all properties." }, { value: "preserve", description: "Respect the input use of quotes in object properties." }] }, trailingComma: { since: "0.0.0", category: p, type: "choice", default: [{ since: "0.0.0", value: !1 }, { since: "0.19.0", value: "none" }, { since: "2.0.0", value: "es5" }], description: "Print trailing commas wherever possible when multi-line.", choices: [{ value: "es5", description: "Trailing commas where valid in ES5 (objects, arrays, etc.)" }, { value: "none", description: "No trailing commas." }, { value: "all", description: "Trailing commas wherever possible (including function arguments)." }] }, singleAttributePerLine: t.singleAttributePerLine };
      } }), $a = Ce({ "src/language-js/parse/parsers.js"() {
        Be();
      } }), Zs = Ce({ "node_modules/linguist-languages/data/JavaScript.json"(o, m) {
        m.exports = { name: "JavaScript", type: "programming", tmScope: "source.js", aceMode: "javascript", codemirrorMode: "javascript", codemirrorMimeType: "text/javascript", color: "#f1e05a", aliases: ["js", "node"], extensions: [".js", "._js", ".bones", ".cjs", ".es", ".es6", ".frag", ".gs", ".jake", ".javascript", ".jsb", ".jscad", ".jsfl", ".jslib", ".jsm", ".jspre", ".jss", ".jsx", ".mjs", ".njs", ".pac", ".sjs", ".ssjs", ".xsjs", ".xsjslib"], filenames: ["Jakefile"], interpreters: ["chakra", "d8", "gjs", "js", "node", "nodejs", "qjs", "rhino", "v8", "v8-shell"], languageId: 183 };
      } }), Ra = Ce({ "node_modules/linguist-languages/data/TypeScript.json"(o, m) {
        m.exports = { name: "TypeScript", type: "programming", color: "#3178c6", aliases: ["ts"], interpreters: ["deno", "ts-node"], extensions: [".ts", ".cts", ".mts"], tmScope: "source.ts", aceMode: "typescript", codemirrorMode: "javascript", codemirrorMimeType: "application/typescript", languageId: 378 };
      } }), Va = Ce({ "node_modules/linguist-languages/data/TSX.json"(o, m) {
        m.exports = { name: "TSX", type: "programming", color: "#3178c6", group: "TypeScript", extensions: [".tsx"], tmScope: "source.tsx", aceMode: "javascript", codemirrorMode: "jsx", codemirrorMimeType: "text/jsx", languageId: 94901924 };
      } }), Ho = Ce({ "node_modules/linguist-languages/data/JSON.json"(o, m) {
        m.exports = { name: "JSON", type: "data", color: "#292929", tmScope: "source.json", aceMode: "json", codemirrorMode: "javascript", codemirrorMimeType: "application/json", aliases: ["geojson", "jsonl", "topojson"], extensions: [".json", ".4DForm", ".4DProject", ".avsc", ".geojson", ".gltf", ".har", ".ice", ".JSON-tmLanguage", ".jsonl", ".mcmeta", ".tfstate", ".tfstate.backup", ".topojson", ".webapp", ".webmanifest", ".yy", ".yyp"], filenames: [".arcconfig", ".auto-changelog", ".c8rc", ".htmlhintrc", ".imgbotconfig", ".nycrc", ".tern-config", ".tern-project", ".watchmanconfig", "Pipfile.lock", "composer.lock", "mcmod.info"], languageId: 174 };
      } }), qa = Ce({ "node_modules/linguist-languages/data/JSON with Comments.json"(o, m) {
        m.exports = { name: "JSON with Comments", type: "data", color: "#292929", group: "JSON", tmScope: "source.js", aceMode: "javascript", codemirrorMode: "javascript", codemirrorMimeType: "text/javascript", aliases: ["jsonc"], extensions: [".jsonc", ".code-snippets", ".sublime-build", ".sublime-commands", ".sublime-completions", ".sublime-keymap", ".sublime-macro", ".sublime-menu", ".sublime-mousemap", ".sublime-project", ".sublime-settings", ".sublime-theme", ".sublime-workspace", ".sublime_metrics", ".sublime_session"], filenames: [".babelrc", ".devcontainer.json", ".eslintrc.json", ".jscsrc", ".jshintrc", ".jslintrc", "api-extractor.json", "devcontainer.json", "jsconfig.json", "language-configuration.json", "tsconfig.json", "tslint.json"], languageId: 423 };
      } }), eo = Ce({ "node_modules/linguist-languages/data/JSON5.json"(o, m) {
        m.exports = { name: "JSON5", type: "data", color: "#267CB9", extensions: [".json5"], tmScope: "source.js", aceMode: "javascript", codemirrorMode: "javascript", codemirrorMimeType: "application/json", languageId: 175 };
      } }), Ko = Ce({ "src/language-js/index.js"(o, m) {
        Be();
        var t = bi(), p = La(), c = Qs(), e = Ma(), i = $a(), u = [t(Zs(), (D) => ({ since: "0.0.0", parsers: ["babel", "acorn", "espree", "meriyah", "babel-flow", "babel-ts", "flow", "typescript"], vscodeLanguageIds: ["javascript", "mongo"], interpreters: [...D.interpreters, "zx"], extensions: [...D.extensions.filter((E) => E !== ".jsx"), ".wxs"] })), t(Zs(), () => ({ name: "Flow", since: "0.0.0", parsers: ["flow", "babel-flow"], vscodeLanguageIds: ["javascript"], aliases: [], filenames: [], extensions: [".js.flow"] })), t(Zs(), () => ({ name: "JSX", since: "0.0.0", parsers: ["babel", "babel-flow", "babel-ts", "flow", "typescript", "espree", "meriyah"], vscodeLanguageIds: ["javascriptreact"], aliases: void 0, filenames: void 0, extensions: [".jsx"], group: "JavaScript", interpreters: void 0, tmScope: "source.js.jsx", aceMode: "javascript", codemirrorMode: "jsx", codemirrorMimeType: "text/jsx", color: void 0 })), t(Ra(), () => ({ since: "1.4.0", parsers: ["typescript", "babel-ts"], vscodeLanguageIds: ["typescript"] })), t(Va(), () => ({ since: "1.4.0", parsers: ["typescript", "babel-ts"], vscodeLanguageIds: ["typescriptreact"] })), t(Ho(), () => ({ name: "JSON.stringify", since: "1.13.0", parsers: ["json-stringify"], vscodeLanguageIds: ["json"], extensions: [".importmap"], filenames: ["package.json", "package-lock.json", "composer.json"] })), t(Ho(), (D) => ({ since: "1.5.0", parsers: ["json"], vscodeLanguageIds: ["json"], extensions: D.extensions.filter((E) => E !== ".jsonl") })), t(qa(), (D) => ({ since: "1.5.0", parsers: ["json"], vscodeLanguageIds: ["jsonc"], filenames: [...D.filenames, ".eslintrc", ".swcrc"] })), t(eo(), () => ({ since: "1.13.0", parsers: ["json5"], vscodeLanguageIds: ["json5"] }))], h = { estree: p, "estree-json": c };
        m.exports = { languages: u, options: e, printers: h, parsers: i };
      } }), Ja = Ce({ "src/language-css/clean.js"(o, m) {
        Be();
        var { isFrontMatterNode: t } = yr(), p = dn(), c = /* @__PURE__ */ new Set(["raw", "raws", "sourceIndex", "source", "before", "after", "trailingComma"]);
        function e(u, h, D) {
          if (t(u) && u.lang === "yaml" && delete h.value, u.type === "css-comment" && D.type === "css-root" && D.nodes.length > 0 && ((D.nodes[0] === u || t(D.nodes[0]) && D.nodes[1] === u) && (delete h.text, /^\*\s*@(?:format|prettier)\s*$/.test(u.text)) || D.type === "css-root" && p(D.nodes) === u))
            return null;
          if (u.type === "value-root" && delete h.text, (u.type === "media-query" || u.type === "media-query-list" || u.type === "media-feature-expression") && delete h.value, u.type === "css-rule" && delete h.params, u.type === "selector-combinator" && (h.value = h.value.replace(/\s+/g, " ")), u.type === "media-feature" && (h.value = h.value.replace(/ /g, "")), (u.type === "value-word" && (u.isColor && u.isHex || ["initial", "inherit", "unset", "revert"].includes(h.value.replace().toLowerCase())) || u.type === "media-feature" || u.type === "selector-root-invalid" || u.type === "selector-pseudo") && (h.value = h.value.toLowerCase()), u.type === "css-decl" && (h.prop = h.prop.toLowerCase()), (u.type === "css-atrule" || u.type === "css-import") && (h.name = h.name.toLowerCase()), u.type === "value-number" && (h.unit = h.unit.toLowerCase()), (u.type === "media-feature" || u.type === "media-keyword" || u.type === "media-type" || u.type === "media-unknown" || u.type === "media-url" || u.type === "media-value" || u.type === "selector-attribute" || u.type === "selector-string" || u.type === "selector-class" || u.type === "selector-combinator" || u.type === "value-string") && h.value && (h.value = i(h.value)), u.type === "selector-attribute" && (h.attribute = h.attribute.trim(), h.namespace && typeof h.namespace == "string" && (h.namespace = h.namespace.trim(), h.namespace.length === 0 && (h.namespace = !0)), h.value && (h.value = h.value.trim().replace(/^["']|["']$/g, ""), delete h.quoted)), (u.type === "media-value" || u.type === "media-type" || u.type === "value-number" || u.type === "selector-root-invalid" || u.type === "selector-class" || u.type === "selector-combinator" || u.type === "selector-tag") && h.value && (h.value = h.value.replace(/([\d+.Ee-]+)([A-Za-z]*)/g, (E, C, F) => {
            let g = Number(C);
            return Number.isNaN(g) ? E : g + F.toLowerCase();
          })), u.type === "selector-tag") {
            let E = u.value.toLowerCase();
            ["from", "to"].includes(E) && (h.value = E);
          }
          if (u.type === "css-atrule" && u.name.toLowerCase() === "supports" && delete h.value, u.type === "selector-unknown" && delete h.value, u.type === "value-comma_group") {
            let E = u.groups.findIndex((C) => C.type === "value-number" && C.unit === "...");
            E !== -1 && (h.groups[E].unit = "", h.groups.splice(E + 1, 0, { type: "value-word", value: "...", isColor: !1, isHex: !1 }));
          }
          if (u.type === "value-comma_group" && u.groups.some((E) => E.type === "value-atword" && E.value.endsWith("[") || E.type === "value-word" && E.value.startsWith("]")))
            return { type: "value-atword", value: u.groups.map((E) => E.value).join(""), group: { open: null, close: null, groups: [], type: "value-paren_group" } };
        }
        e.ignoredProperties = c;
        function i(u) {
          return u.replace(/'/g, '"').replace(/\\([^\dA-Fa-f])/g, "$1");
        }
        m.exports = e;
      } }), to = Ce({ "src/utils/front-matter/print.js"(o, m) {
        Be();
        var { builders: { hardline: t, markAsRoot: p } } = sr();
        function c(e, i) {
          if (e.lang === "yaml") {
            let u = e.value.trim(), h = u ? i(u, { parser: "yaml" }, { stripTrailingHardline: !0 }) : "";
            return p([e.startDelimiter, t, h, h ? t : "", e.endDelimiter]);
          }
        }
        m.exports = c;
      } }), Ua = Ce({ "src/language-css/embed.js"(o, m) {
        Be();
        var { builders: { hardline: t } } = sr(), p = to();
        function c(e, i, u) {
          let h = e.getValue();
          if (h.type === "front-matter") {
            let D = p(h, u);
            return D ? [D, t] : "";
          }
        }
        m.exports = c;
      } }), Yo = Ce({ "src/utils/front-matter/parse.js"(o, m) {
        Be();
        var t = new RegExp("^(?<startDelimiter>-{3}|\\+{3})(?<language>[^\\n]*)\\n(?:|(?<value>.*?)\\n)(?<endDelimiter>\\k<startDelimiter>|\\.{3})[^\\S\\n]*(?:\\n|$)", "s");
        function p(c) {
          let e = c.match(t);
          if (!e)
            return { content: c };
          let { startDelimiter: i, language: u, value: h = "", endDelimiter: D } = e.groups, E = u.trim() || "yaml";
          if (i === "+++" && (E = "toml"), E !== "yaml" && i !== D)
            return { content: c };
          let [C] = e;
          return { frontMatter: { type: "front-matter", lang: E, value: h, startDelimiter: i, endDelimiter: D, raw: C.replace(/\n$/, "") }, content: C.replace(/[^\n]/g, " ") + c.slice(C.length) };
        }
        m.exports = p;
      } }), Ga = Ce({ "src/language-css/pragma.js"(o, m) {
        Be();
        var t = Ws(), p = Yo();
        function c(i) {
          return t.hasPragma(p(i).content);
        }
        function e(i) {
          let { frontMatter: u, content: h } = p(i);
          return (u ? u.raw + `

` : "") + t.insertPragma(h);
        }
        m.exports = { hasPragma: c, insertPragma: e };
      } }), za = Ce({ "src/language-css/utils/index.js"(o, m) {
        Be();
        var t = /* @__PURE__ */ new Set(["red", "green", "blue", "alpha", "a", "rgb", "hue", "h", "saturation", "s", "lightness", "l", "whiteness", "w", "blackness", "b", "tint", "shade", "blend", "blenda", "contrast", "hsl", "hsla", "hwb", "hwba"]);
        function p(ke, be) {
          let Oe = Array.isArray(be) ? be : [be], Re = -1, ut;
          for (; ut = ke.getParentNode(++Re); )
            if (Oe.includes(ut.type))
              return Re;
          return -1;
        }
        function c(ke, be) {
          let Oe = p(ke, be);
          return Oe === -1 ? null : ke.getParentNode(Oe);
        }
        function e(ke) {
          var be;
          let Oe = c(ke, "css-decl");
          return Oe == null || (be = Oe.prop) === null || be === void 0 ? void 0 : be.toLowerCase();
        }
        var i = /* @__PURE__ */ new Set(["initial", "inherit", "unset", "revert"]);
        function u(ke) {
          return i.has(ke.toLowerCase());
        }
        function h(ke, be) {
          let Oe = c(ke, "css-atrule");
          return (Oe == null ? void 0 : Oe.name) && Oe.name.toLowerCase().endsWith("keyframes") && ["from", "to"].includes(be.toLowerCase());
        }
        function D(ke) {
          return ke.includes("$") || ke.includes("@") || ke.includes("#") || ke.startsWith("%") || ke.startsWith("--") || ke.startsWith(":--") || ke.includes("(") && ke.includes(")") ? ke : ke.toLowerCase();
        }
        function E(ke, be) {
          var Oe;
          let Re = c(ke, "value-func");
          return (Re == null || (Oe = Re.value) === null || Oe === void 0 ? void 0 : Oe.toLowerCase()) === be;
        }
        function C(ke) {
          var be;
          let Oe = c(ke, "css-rule"), Re = Oe == null || (be = Oe.raws) === null || be === void 0 ? void 0 : be.selector;
          return Re && (Re.startsWith(":import") || Re.startsWith(":export"));
        }
        function F(ke, be) {
          let Oe = Array.isArray(be) ? be : [be], Re = c(ke, "css-atrule");
          return Re && Oe.includes(Re.name.toLowerCase());
        }
        function g(ke) {
          let be = ke.getValue(), Oe = c(ke, "css-atrule");
          return (Oe == null ? void 0 : Oe.name) === "import" && be.groups[0].value === "url" && be.groups.length === 2;
        }
        function b(ke) {
          return ke.type === "value-func" && ke.value.toLowerCase() === "url";
        }
        function T(ke, be) {
          var Oe;
          let Re = (Oe = ke.getParentNode()) === null || Oe === void 0 ? void 0 : Oe.nodes;
          return Re && Re.indexOf(be) === Re.length - 1;
        }
        function G(ke) {
          let { selector: be } = ke;
          return be ? typeof be == "string" && /^@.+:.*$/.test(be) || be.value && /^@.+:.*$/.test(be.value) : !1;
        }
        function W(ke) {
          return ke.type === "value-word" && ["from", "through", "end"].includes(ke.value);
        }
        function B(ke) {
          return ke.type === "value-word" && ["and", "or", "not"].includes(ke.value);
        }
        function _(ke) {
          return ke.type === "value-word" && ke.value === "in";
        }
        function U(ke) {
          return ke.type === "value-operator" && ke.value === "*";
        }
        function Q(ke) {
          return ke.type === "value-operator" && ke.value === "/";
        }
        function H(ke) {
          return ke.type === "value-operator" && ke.value === "+";
        }
        function ge(ke) {
          return ke.type === "value-operator" && ke.value === "-";
        }
        function y(ke) {
          return ke.type === "value-operator" && ke.value === "%";
        }
        function R(ke) {
          return U(ke) || Q(ke) || H(ke) || ge(ke) || y(ke);
        }
        function v(ke) {
          return ke.type === "value-word" && ["==", "!="].includes(ke.value);
        }
        function S(ke) {
          return ke.type === "value-word" && ["<", ">", "<=", ">="].includes(ke.value);
        }
        function l(ke) {
          return ke.type === "css-atrule" && ["if", "else", "for", "each", "while"].includes(ke.name);
        }
        function A(ke) {
          var be;
          return ((be = ke.raws) === null || be === void 0 ? void 0 : be.params) && /^\(\s*\)$/.test(ke.raws.params);
        }
        function w(ke) {
          return ke.name.startsWith("prettier-placeholder");
        }
        function I(ke) {
          return ke.prop.startsWith("@prettier-placeholder");
        }
        function O(ke, be) {
          return ke.value === "$$" && ke.type === "value-func" && (be == null ? void 0 : be.type) === "value-word" && !be.raws.before;
        }
        function M(ke) {
          var be, Oe;
          return ((be = ke.value) === null || be === void 0 ? void 0 : be.type) === "value-root" && ((Oe = ke.value.group) === null || Oe === void 0 ? void 0 : Oe.type) === "value-value" && ke.prop.toLowerCase() === "composes";
        }
        function ee(ke) {
          var be, Oe, Re;
          return ((be = ke.value) === null || be === void 0 || (Oe = be.group) === null || Oe === void 0 || (Re = Oe.group) === null || Re === void 0 ? void 0 : Re.type) === "value-paren_group" && ke.value.group.group.open !== null && ke.value.group.group.close !== null;
        }
        function pe(ke) {
          var be;
          return ((be = ke.raws) === null || be === void 0 ? void 0 : be.before) === "";
        }
        function he(ke) {
          var be, Oe;
          return ke.type === "value-comma_group" && ((be = ke.groups) === null || be === void 0 || (Oe = be[1]) === null || Oe === void 0 ? void 0 : Oe.type) === "value-colon";
        }
        function ce(ke) {
          var be;
          return ke.type === "value-paren_group" && ((be = ke.groups) === null || be === void 0 ? void 0 : be[0]) && he(ke.groups[0]);
        }
        function xe(ke) {
          var be;
          let Oe = ke.getValue();
          if (Oe.groups.length === 0)
            return !1;
          let Re = ke.getParentNode(1);
          if (!ce(Oe) && !(Re && ce(Re)))
            return !1;
          let ut = c(ke, "css-decl");
          return !!(ut != null && (be = ut.prop) !== null && be !== void 0 && be.startsWith("$") || ce(Re) || Re.type === "value-func");
        }
        function ie(ke) {
          return ke.type === "value-comment" && ke.inline;
        }
        function je(ke) {
          return ke.type === "value-word" && ke.value === "#";
        }
        function de(ke) {
          return ke.type === "value-word" && ke.value === "{";
        }
        function oe(ke) {
          return ke.type === "value-word" && ke.value === "}";
        }
        function Ne(ke) {
          return ["value-word", "value-atword"].includes(ke.type);
        }
        function Je(ke) {
          return (ke == null ? void 0 : ke.type) === "value-colon";
        }
        function _e(ke, be) {
          if (!he(be))
            return !1;
          let { groups: Oe } = be, Re = Oe.indexOf(ke);
          return Re === -1 ? !1 : Je(Oe[Re + 1]);
        }
        function it(ke) {
          return ke.value && ["not", "and", "or"].includes(ke.value.toLowerCase());
        }
        function me(ke) {
          return ke.type !== "value-func" ? !1 : t.has(ke.value.toLowerCase());
        }
        function Se(ke) {
          return /\/\//.test(ke.split(/[\n\r]/).pop());
        }
        function Qe(ke) {
          return (ke == null ? void 0 : ke.type) === "value-atword" && ke.value.startsWith("prettier-placeholder-");
        }
        function Ze(ke, be) {
          var Oe, Re;
          if (((Oe = ke.open) === null || Oe === void 0 ? void 0 : Oe.value) !== "(" || ((Re = ke.close) === null || Re === void 0 ? void 0 : Re.value) !== ")" || ke.groups.some((ut) => ut.type !== "value-comma_group"))
            return !1;
          if (be.type === "value-comma_group") {
            let ut = be.groups.indexOf(ke) - 1, ht = be.groups[ut];
            if ((ht == null ? void 0 : ht.type) === "value-word" && ht.value === "with")
              return !0;
          }
          return !1;
        }
        function kt(ke) {
          var be, Oe;
          return ke.type === "value-paren_group" && ((be = ke.open) === null || be === void 0 ? void 0 : be.value) === "(" && ((Oe = ke.close) === null || Oe === void 0 ? void 0 : Oe.value) === ")";
        }
        m.exports = { getAncestorCounter: p, getAncestorNode: c, getPropOfDeclNode: e, maybeToLowerCase: D, insideValueFunctionNode: E, insideICSSRuleNode: C, insideAtRuleNode: F, insideURLFunctionInImportAtRuleNode: g, isKeyframeAtRuleKeywords: h, isWideKeywords: u, isLastNode: T, isSCSSControlDirectiveNode: l, isDetachedRulesetDeclarationNode: G, isRelationalOperatorNode: S, isEqualityOperatorNode: v, isMultiplicationNode: U, isDivisionNode: Q, isAdditionNode: H, isSubtractionNode: ge, isModuloNode: y, isMathOperatorNode: R, isEachKeywordNode: _, isForKeywordNode: W, isURLFunctionNode: b, isIfElseKeywordNode: B, hasComposesNode: M, hasParensAroundNode: ee, hasEmptyRawBefore: pe, isDetachedRulesetCallNode: A, isTemplatePlaceholderNode: w, isTemplatePropNode: I, isPostcssSimpleVarNode: O, isKeyValuePairNode: he, isKeyValuePairInParenGroupNode: ce, isKeyInValuePairNode: _e, isSCSSMapItemNode: xe, isInlineValueCommentNode: ie, isHashNode: je, isLeftCurlyBraceNode: de, isRightCurlyBraceNode: oe, isWordNode: Ne, isColonNode: Je, isMediaAndSupportsKeywords: it, isColorAdjusterFuncNode: me, lastLineHasInlineComment: Se, isAtWordPlaceholderNode: Qe, isConfigurationNode: Ze, isParenGroupNode: kt };
      } }), ro = Ce({ "src/utils/line-column-to-index.js"(o, m) {
        Be(), m.exports = function(t, p) {
          let c = 0;
          for (let e = 0; e < t.line - 1; ++e)
            c = p.indexOf(`
`, c) + 1;
          return c + t.column;
        };
      } }), yu = Ce({ "src/language-css/loc.js"(o, m) {
        Be();
        var { skipEverythingButNewLine: t } = ku(), p = dn(), c = ro();
        function e(g, b) {
          return typeof g.sourceIndex == "number" ? g.sourceIndex : g.source ? c(g.source.start, b) - 1 : null;
        }
        function i(g, b) {
          if (g.type === "css-comment" && g.inline)
            return t(b, g.source.startOffset);
          let T = g.nodes && p(g.nodes);
          return T && g.source && !g.source.end && (g = T), g.source && g.source.end ? c(g.source.end, b) : null;
        }
        function u(g, b) {
          g.source && (g.source.startOffset = e(g, b), g.source.endOffset = i(g, b));
          for (let T in g) {
            let G = g[T];
            T === "source" || !G || typeof G != "object" || (G.type === "value-root" || G.type === "value-unknown" ? h(G, D(g), G.text || G.value) : u(G, b));
          }
        }
        function h(g, b, T) {
          g.source && (g.source.startOffset = e(g, T) + b, g.source.endOffset = i(g, T) + b);
          for (let G in g) {
            let W = g[G];
            G === "source" || !W || typeof W != "object" || h(W, b, T);
          }
        }
        function D(g) {
          let b = g.source.startOffset;
          return typeof g.prop == "string" && (b += g.prop.length), g.type === "css-atrule" && typeof g.name == "string" && (b += 1 + g.name.length + g.raws.afterName.match(/^\s*:?\s*/)[0].length), g.type !== "css-atrule" && g.raws && typeof g.raws.between == "string" && (b += g.raws.between.length), b;
        }
        function E(g) {
          let b = "initial", T = "initial", G, W = !1, B = [];
          for (let _ = 0; _ < g.length; _++) {
            let U = g[_];
            switch (b) {
              case "initial":
                if (U === "'") {
                  b = "single-quotes";
                  continue;
                }
                if (U === '"') {
                  b = "double-quotes";
                  continue;
                }
                if ((U === "u" || U === "U") && g.slice(_, _ + 4).toLowerCase() === "url(") {
                  b = "url", _ += 3;
                  continue;
                }
                if (U === "*" && g[_ - 1] === "/") {
                  b = "comment-block";
                  continue;
                }
                if (U === "/" && g[_ - 1] === "/") {
                  b = "comment-inline", G = _ - 1;
                  continue;
                }
                continue;
              case "single-quotes":
                if (U === "'" && g[_ - 1] !== "\\" && (b = T, T = "initial"), U === `
` || U === "\r")
                  return g;
                continue;
              case "double-quotes":
                if (U === '"' && g[_ - 1] !== "\\" && (b = T, T = "initial"), U === `
` || U === "\r")
                  return g;
                continue;
              case "url":
                if (U === ")" && (b = "initial"), U === `
` || U === "\r")
                  return g;
                if (U === "'") {
                  b = "single-quotes", T = "url";
                  continue;
                }
                if (U === '"') {
                  b = "double-quotes", T = "url";
                  continue;
                }
                continue;
              case "comment-block":
                U === "/" && g[_ - 1] === "*" && (b = "initial");
                continue;
              case "comment-inline":
                (U === '"' || U === "'" || U === "*") && (W = !0), (U === `
` || U === "\r") && (W && B.push([G, _]), b = "initial", W = !1);
                continue;
            }
          }
          for (let [_, U] of B)
            g = g.slice(0, _) + g.slice(_, U).replace(/["'*]/g, " ") + g.slice(U);
          return g;
        }
        function C(g) {
          return g.source.startOffset;
        }
        function F(g) {
          return g.source.endOffset;
        }
        m.exports = { locStart: C, locEnd: F, calculateLoc: u, replaceQuotesInInlineComments: E };
      } }), Qo = Ce({ "src/language-css/utils/is-less-parser.js"(o, m) {
        Be();
        function t(p) {
          return p.parser === "css" || p.parser === "less";
        }
        m.exports = t;
      } }), Zo = Ce({ "src/language-css/utils/is-scss.js"(o, m) {
        Be();
        function t(p, c) {
          return p === "less" || p === "scss" ? p === "scss" : /(?:\w\s*:\s*[^:}]+|#){|@import[^\n]+(?:url|,)/.test(c);
        }
        m.exports = t;
      } }), Bi = Ce({ "src/language-css/utils/css-units.evaluate.js"(o, m) {
        m.exports = { em: "em", rem: "rem", ex: "ex", rex: "rex", cap: "cap", rcap: "rcap", ch: "ch", rch: "rch", ic: "ic", ric: "ric", lh: "lh", rlh: "rlh", vw: "vw", svw: "svw", lvw: "lvw", dvw: "dvw", vh: "vh", svh: "svh", lvh: "lvh", dvh: "dvh", vi: "vi", svi: "svi", lvi: "lvi", dvi: "dvi", vb: "vb", svb: "svb", lvb: "lvb", dvb: "dvb", vmin: "vmin", svmin: "svmin", lvmin: "lvmin", dvmin: "dvmin", vmax: "vmax", svmax: "svmax", lvmax: "lvmax", dvmax: "dvmax", cm: "cm", mm: "mm", q: "Q", in: "in", pt: "pt", pc: "pc", px: "px", deg: "deg", grad: "grad", rad: "rad", turn: "turn", s: "s", ms: "ms", hz: "Hz", khz: "kHz", dpi: "dpi", dpcm: "dpcm", dppx: "dppx", x: "x" };
      } }), Ni = Ce({ "src/language-css/utils/print-unit.js"(o, m) {
        Be();
        var t = Bi();
        function p(c) {
          let e = c.toLowerCase();
          return Object.prototype.hasOwnProperty.call(t, e) ? t[e] : c;
        }
        m.exports = p;
      } }), Wa = Ce({ "src/language-css/printer-postcss.js"(o, m) {
        Be();
        var t = dn(), { printNumber: p, printString: c, hasNewline: e, isFrontMatterNode: i, isNextLineEmpty: u, isNonEmptyArray: h } = yr(), { builders: { join: D, line: E, hardline: C, softline: F, group: g, fill: b, indent: T, dedent: G, ifBreak: W, breakParent: B }, utils: { removeLines: _, getDocParts: U } } = sr(), Q = Ja(), H = Ua(), { insertPragma: ge } = Ga(), { getAncestorNode: y, getPropOfDeclNode: R, maybeToLowerCase: v, insideValueFunctionNode: S, insideICSSRuleNode: l, insideAtRuleNode: A, insideURLFunctionInImportAtRuleNode: w, isKeyframeAtRuleKeywords: I, isWideKeywords: O, isLastNode: M, isSCSSControlDirectiveNode: ee, isDetachedRulesetDeclarationNode: pe, isRelationalOperatorNode: he, isEqualityOperatorNode: ce, isMultiplicationNode: xe, isDivisionNode: ie, isAdditionNode: je, isSubtractionNode: de, isMathOperatorNode: oe, isEachKeywordNode: Ne, isForKeywordNode: Je, isURLFunctionNode: _e, isIfElseKeywordNode: it, hasComposesNode: me, hasParensAroundNode: Se, hasEmptyRawBefore: Qe, isKeyValuePairNode: Ze, isKeyInValuePairNode: kt, isDetachedRulesetCallNode: ke, isTemplatePlaceholderNode: be, isTemplatePropNode: Oe, isPostcssSimpleVarNode: Re, isSCSSMapItemNode: ut, isInlineValueCommentNode: ht, isHashNode: vt, isLeftCurlyBraceNode: Ut, isRightCurlyBraceNode: Dr, isWordNode: mr, isColonNode: Vt, isMediaAndSupportsKeywords: Qt, isColorAdjusterFuncNode: Xe, lastLineHasInlineComment: ye, isAtWordPlaceholderNode: tt, isConfigurationNode: Te, isParenGroupNode: rt } = za(), { locStart: jt, locEnd: Ct } = yu(), nt = Qo(), N = Zo(), Fe = Ni();
        function Ue(Lt) {
          return Lt.trailingComma === "es5" || Lt.trailingComma === "all";
        }
        function yt(Lt, dr, or) {
          let Ke = Lt.getValue();
          if (!Ke)
            return "";
          if (typeof Ke == "string")
            return Ke;
          switch (Ke.type) {
            case "front-matter":
              return [Ke.raw, C];
            case "css-root": {
              let Ar = Et(Lt, dr, or), Sr = Ke.raws.after.trim();
              return Sr.startsWith(";") && (Sr = Sr.slice(1).trim()), [Ar, Sr ? ` ${Sr}` : "", U(Ar).length > 0 ? C : ""];
            }
            case "css-comment": {
              let Ar = Ke.inline || Ke.raws.inline, Sr = dr.originalText.slice(jt(Ke), Ct(Ke));
              return Ar ? Sr.trimEnd() : Sr;
            }
            case "css-rule":
              return [or("selector"), Ke.important ? " !important" : "", Ke.nodes ? [Ke.selector && Ke.selector.type === "selector-unknown" && ye(Ke.selector.value) ? E : " ", "{", Ke.nodes.length > 0 ? T([C, Et(Lt, dr, or)]) : "", C, "}", pe(Ke) ? ";" : ""] : ";"];
            case "css-decl": {
              let Ar = Lt.getParentNode(), { between: Sr } = Ke.raws, Ur = Sr.trim(), Hn = Ur === ":", se = me(Ke) ? _(or("value")) : or("value");
              return !Hn && ye(Ur) && (se = T([C, G(se)])), [Ke.raws.before.replace(/[\s;]/g, ""), Ar.type === "css-atrule" && Ar.variable || l(Lt) ? Ke.prop : v(Ke.prop), Ur.startsWith("//") ? " " : "", Ur, Ke.extend ? "" : " ", nt(dr) && Ke.extend && Ke.selector ? ["extend(", or("selector"), ")"] : "", se, Ke.raws.important ? Ke.raws.important.replace(/\s*!\s*important/i, " !important") : Ke.important ? " !important" : "", Ke.raws.scssDefault ? Ke.raws.scssDefault.replace(/\s*!default/i, " !default") : Ke.scssDefault ? " !default" : "", Ke.raws.scssGlobal ? Ke.raws.scssGlobal.replace(/\s*!global/i, " !global") : Ke.scssGlobal ? " !global" : "", Ke.nodes ? [" {", T([F, Et(Lt, dr, or)]), F, "}"] : Oe(Ke) && !Ar.raws.semicolon && dr.originalText[Ct(Ke) - 1] !== ";" ? "" : dr.__isHTMLStyleAttribute && M(Lt, Ke) ? W(";") : ";"];
            }
            case "css-atrule": {
              let Ar = Lt.getParentNode(), Sr = be(Ke) && !Ar.raws.semicolon && dr.originalText[Ct(Ke) - 1] !== ";";
              if (nt(dr)) {
                if (Ke.mixin)
                  return [or("selector"), Ke.important ? " !important" : "", Sr ? "" : ";"];
                if (Ke.function)
                  return [Ke.name, or("params"), Sr ? "" : ";"];
                if (Ke.variable)
                  return ["@", Ke.name, ": ", Ke.value ? or("value") : "", Ke.raws.between.trim() ? Ke.raws.between.trim() + " " : "", Ke.nodes ? ["{", T([Ke.nodes.length > 0 ? F : "", Et(Lt, dr, or)]), F, "}"] : "", Sr ? "" : ";"];
              }
              return ["@", ke(Ke) || Ke.name.endsWith(":") ? Ke.name : v(Ke.name), Ke.params ? [ke(Ke) ? "" : be(Ke) ? Ke.raws.afterName === "" ? "" : Ke.name.endsWith(":") ? " " : /^\s*\n\s*\n/.test(Ke.raws.afterName) ? [C, C] : /^\s*\n/.test(Ke.raws.afterName) ? C : " " : " ", or("params")] : "", Ke.selector ? T([" ", or("selector")]) : "", Ke.value ? g([" ", or("value"), ee(Ke) ? Se(Ke) ? " " : E : ""]) : Ke.name === "else" ? " " : "", Ke.nodes ? [ee(Ke) ? "" : Ke.selector && !Ke.selector.nodes && typeof Ke.selector.value == "string" && ye(Ke.selector.value) || !Ke.selector && typeof Ke.params == "string" && ye(Ke.params) ? E : " ", "{", T([Ke.nodes.length > 0 ? F : "", Et(Lt, dr, or)]), F, "}"] : Sr ? "" : ";"];
            }
            case "media-query-list": {
              let Ar = [];
              return Lt.each((Sr) => {
                let Ur = Sr.getValue();
                Ur.type === "media-query" && Ur.value === "" || Ar.push(or());
              }, "nodes"), g(T(D(E, Ar)));
            }
            case "media-query":
              return [D(" ", Lt.map(or, "nodes")), M(Lt, Ke) ? "" : ","];
            case "media-type":
              return gr(_t(Ke.value, dr));
            case "media-feature-expression":
              return Ke.nodes ? ["(", ...Lt.map(or, "nodes"), ")"] : Ke.value;
            case "media-feature":
              return v(_t(Ke.value.replace(/ +/g, " "), dr));
            case "media-colon":
              return [Ke.value, " "];
            case "media-value":
              return gr(_t(Ke.value, dr));
            case "media-keyword":
              return _t(Ke.value, dr);
            case "media-url":
              return _t(Ke.value.replace(/^url\(\s+/gi, "url(").replace(/\s+\)$/g, ")"), dr);
            case "media-unknown":
              return Ke.value;
            case "selector-root":
              return g([A(Lt, "custom-selector") ? [y(Lt, "css-atrule").customSelector, E] : "", D([",", A(Lt, ["extend", "custom-selector", "nest"]) ? E : C], Lt.map(or, "nodes"))]);
            case "selector-selector":
              return g(T(Lt.map(or, "nodes")));
            case "selector-comment":
              return Ke.value;
            case "selector-string":
              return _t(Ke.value, dr);
            case "selector-tag": {
              let Ar = Lt.getParentNode(), Sr = Ar && Ar.nodes.indexOf(Ke), Ur = Sr && Ar.nodes[Sr - 1];
              return [Ke.namespace ? [Ke.namespace === !0 ? "" : Ke.namespace.trim(), "|"] : "", Ur.type === "selector-nesting" ? Ke.value : gr(I(Lt, Ke.value) ? Ke.value.toLowerCase() : Ke.value)];
            }
            case "selector-id":
              return ["#", Ke.value];
            case "selector-class":
              return [".", gr(_t(Ke.value, dr))];
            case "selector-attribute": {
              var Wn;
              return ["[", Ke.namespace ? [Ke.namespace === !0 ? "" : Ke.namespace.trim(), "|"] : "", Ke.attribute.trim(), (Wn = Ke.operator) !== null && Wn !== void 0 ? Wn : "", Ke.value ? nr(_t(Ke.value.trim(), dr), dr) : "", Ke.insensitive ? " i" : "", "]"];
            }
            case "selector-combinator": {
              if (Ke.value === "+" || Ke.value === ">" || Ke.value === "~" || Ke.value === ">>>") {
                let Ur = Lt.getParentNode();
                return [Ur.type === "selector-selector" && Ur.nodes[0] === Ke ? "" : E, Ke.value, M(Lt, Ke) ? "" : " "];
              }
              let Ar = Ke.value.trim().startsWith("(") ? E : "", Sr = gr(_t(Ke.value.trim(), dr)) || E;
              return [Ar, Sr];
            }
            case "selector-universal":
              return [Ke.namespace ? [Ke.namespace === !0 ? "" : Ke.namespace.trim(), "|"] : "", Ke.value];
            case "selector-pseudo":
              return [v(Ke.value), h(Ke.nodes) ? g(["(", T([F, D([",", E], Lt.map(or, "nodes"))]), F, ")"]) : ""];
            case "selector-nesting":
              return Ke.value;
            case "selector-unknown": {
              let Ar = y(Lt, "css-rule");
              if (Ar && Ar.isSCSSNesterProperty)
                return gr(_t(v(Ke.value), dr));
              let Sr = Lt.getParentNode();
              if (Sr.raws && Sr.raws.selector) {
                let Hn = jt(Sr), se = Hn + Sr.raws.selector.length;
                return dr.originalText.slice(Hn, se).trim();
              }
              let Ur = Lt.getParentNode(1);
              if (Sr.type === "value-paren_group" && Ur && Ur.type === "value-func" && Ur.value === "selector") {
                let Hn = Ct(Sr.open) + 1, se = jt(Sr.close), ot = dr.originalText.slice(Hn, se).trim();
                return ye(ot) ? [B, ot] : ot;
              }
              return Ke.value;
            }
            case "value-value":
            case "value-root":
              return or("group");
            case "value-comment":
              return dr.originalText.slice(jt(Ke), Ct(Ke));
            case "value-comma_group": {
              let Ar = Lt.getParentNode(), Sr = Lt.getParentNode(1), Ur = R(Lt), Hn = Ur && Ar.type === "value-value" && (Ur === "grid" || Ur.startsWith("grid-template")), se = y(Lt, "css-atrule"), ot = se && ee(se), Xt = Ke.groups.some((Kn) => ht(Kn)), kr = Lt.map(or, "groups"), Br = [], $n = S(Lt, "url"), Qr = !1, Tn = !1;
              for (let Kn = 0; Kn < Ke.groups.length; ++Kn) {
                var Fn;
                Br.push(kr[Kn]);
                let pn = Ke.groups[Kn - 1], cr = Ke.groups[Kn], Cr = Ke.groups[Kn + 1], ia = Ke.groups[Kn + 2];
                if ($n) {
                  (Cr && je(Cr) || je(cr)) && Br.push(" ");
                  continue;
                }
                if (A(Lt, "forward") && cr.type === "value-word" && cr.value && pn !== void 0 && pn.type === "value-word" && pn.value === "as" && Cr.type === "value-operator" && Cr.value === "*" || !Cr || cr.type === "value-word" && cr.value.endsWith("-") && tt(Cr))
                  continue;
                if (cr.type === "value-string" && cr.quoted) {
                  let Za = cr.value.lastIndexOf("#{"), el = cr.value.lastIndexOf("}");
                  Za !== -1 && el !== -1 ? Qr = Za > el : Za !== -1 ? Qr = !0 : el !== -1 && (Qr = !1);
                }
                if (Qr || Vt(cr) || Vt(Cr) || cr.type === "value-atword" && (cr.value === "" || cr.value.endsWith("[")) || Cr.type === "value-word" && Cr.value.startsWith("]") || cr.value === "~" || cr.value && cr.value.includes("\\") && Cr && Cr.type !== "value-comment" || pn && pn.value && pn.value.indexOf("\\") === pn.value.length - 1 && cr.type === "value-operator" && cr.value === "/" || cr.value === "\\" || Re(cr, Cr) || vt(cr) || Ut(cr) || Dr(Cr) || Ut(Cr) && Qe(Cr) || Dr(cr) && Qe(Cr) || cr.value === "--" && vt(Cr))
                  continue;
                let Qa = oe(cr), tl = oe(Cr);
                if ((Qa && vt(Cr) || tl && Dr(cr)) && Qe(Cr) || !pn && ie(cr) || S(Lt, "calc") && (je(cr) || je(Cr) || de(cr) || de(Cr)) && Qe(Cr))
                  continue;
                let ml = (je(cr) || de(cr)) && Kn === 0 && (Cr.type === "value-number" || Cr.isHex) && Sr && Xe(Sr) && !Qe(Cr), rl = ia && ia.type === "value-func" || ia && mr(ia) || cr.type === "value-func" || mr(cr), nl = Cr.type === "value-func" || mr(Cr) || pn && pn.type === "value-func" || pn && mr(pn);
                if (!(!(xe(Cr) || xe(cr)) && !S(Lt, "calc") && !ml && (ie(Cr) && !rl || ie(cr) && !nl || je(Cr) && !rl || je(cr) && !nl || de(Cr) || de(cr)) && (Qe(Cr) || Qa && (!pn || pn && oe(pn)))) && !((dr.parser === "scss" || dr.parser === "less") && Qa && cr.value === "-" && rt(Cr) && Ct(cr) === jt(Cr.open) && Cr.open.value === "(")) {
                  if (ht(cr)) {
                    if (Ar.type === "value-paren_group") {
                      Br.push(G(C));
                      continue;
                    }
                    Br.push(C);
                    continue;
                  }
                  if (ot && (ce(Cr) || he(Cr) || it(Cr) || Ne(cr) || Je(cr))) {
                    Br.push(" ");
                    continue;
                  }
                  if (se && se.name.toLowerCase() === "namespace") {
                    Br.push(" ");
                    continue;
                  }
                  if (Hn) {
                    cr.source && Cr.source && cr.source.start.line !== Cr.source.start.line ? (Br.push(C), Tn = !0) : Br.push(" ");
                    continue;
                  }
                  if (tl) {
                    Br.push(" ");
                    continue;
                  }
                  if (!(Cr && Cr.value === "...") && !(tt(cr) && tt(Cr) && Ct(cr) === jt(Cr))) {
                    if (tt(cr) && rt(Cr) && Ct(cr) === jt(Cr.open)) {
                      Br.push(F);
                      continue;
                    }
                    if (cr.value === "with" && rt(Cr)) {
                      Br.push(" ");
                      continue;
                    }
                    (Fn = cr.value) !== null && Fn !== void 0 && Fn.endsWith("#") && Cr.value === "{" && rt(Cr.group) || Br.push(E);
                  }
                }
              }
              return Xt && Br.push(B), Tn && Br.unshift(C), ot ? g(T(Br)) : w(Lt) ? g(b(Br)) : g(T(b(Br)));
            }
            case "value-paren_group": {
              let Ar = Lt.getParentNode();
              if (Ar && _e(Ar) && (Ke.groups.length === 1 || Ke.groups.length > 0 && Ke.groups[0].type === "value-comma_group" && Ke.groups[0].groups.length > 0 && Ke.groups[0].groups[0].type === "value-word" && Ke.groups[0].groups[0].value.startsWith("data:")))
                return [Ke.open ? or("open") : "", D(",", Lt.map(or, "groups")), Ke.close ? or("close") : ""];
              if (!Ke.open) {
                let $n = Lt.map(or, "groups"), Qr = [];
                for (let Tn = 0; Tn < $n.length; Tn++)
                  Tn !== 0 && Qr.push([",", E]), Qr.push($n[Tn]);
                return g(T(b(Qr)));
              }
              let Sr = ut(Lt), Ur = t(Ke.groups), Hn = Ur && Ur.type === "value-comment", se = kt(Ke, Ar), ot = Te(Ke, Ar), Xt = ot || Sr && !se, kr = ot || se, Br = g([Ke.open ? or("open") : "", T([F, D([E], Lt.map(($n, Qr) => {
                let Tn = $n.getValue(), Kn = Qr === Ke.groups.length - 1, pn = [or(), Kn ? "" : ","];
                if (Ze(Tn) && Tn.type === "value-comma_group" && Tn.groups && Tn.groups[0].type !== "value-paren_group" && Tn.groups[2] && Tn.groups[2].type === "value-paren_group") {
                  let cr = U(pn[0].contents.contents);
                  cr[1] = g(cr[1]), pn = [g(G(pn))];
                }
                if (!Kn && Tn.type === "value-comma_group" && h(Tn.groups)) {
                  let cr = t(Tn.groups);
                  !cr.source && cr.close && (cr = cr.close), cr.source && u(dr.originalText, cr, Ct) && pn.push(C);
                }
                return pn;
              }, "groups"))]), W(!Hn && N(dr.parser, dr.originalText) && Sr && Ue(dr) ? "," : ""), F, Ke.close ? or("close") : ""], { shouldBreak: Xt });
              return kr ? G(Br) : Br;
            }
            case "value-func":
              return [Ke.value, A(Lt, "supports") && Qt(Ke) ? " " : "", or("group")];
            case "value-paren":
              return Ke.value;
            case "value-number":
              return [Rr(Ke.value), Fe(Ke.unit)];
            case "value-operator":
              return Ke.value;
            case "value-word":
              return Ke.isColor && Ke.isHex || O(Ke.value) ? Ke.value.toLowerCase() : Ke.value;
            case "value-colon": {
              let Ar = Lt.getParentNode(), Sr = Ar && Ar.groups.indexOf(Ke), Ur = Sr && Ar.groups[Sr - 1];
              return [Ke.value, Ur && typeof Ur.value == "string" && t(Ur.value) === "\\" || S(Lt, "url") ? "" : E];
            }
            case "value-comma":
              return [Ke.value, " "];
            case "value-string":
              return c(Ke.raws.quote + Ke.value + Ke.raws.quote, dr);
            case "value-atword":
              return ["@", Ke.value];
            case "value-unicode-range":
              return Ke.value;
            case "value-unknown":
              return Ke.value;
            default:
              throw new Error(`Unknown postcss type ${JSON.stringify(Ke.type)}`);
          }
        }
        function Et(Lt, dr, or) {
          let Ke = [];
          return Lt.each((Wn, Fn, Ar) => {
            let Sr = Ar[Fn - 1];
            if (Sr && Sr.type === "css-comment" && Sr.text.trim() === "prettier-ignore") {
              let Ur = Wn.getValue();
              Ke.push(dr.originalText.slice(jt(Ur), Ct(Ur)));
            } else
              Ke.push(or());
            Fn !== Ar.length - 1 && (Ar[Fn + 1].type === "css-comment" && !e(dr.originalText, jt(Ar[Fn + 1]), { backwards: !0 }) && !i(Ar[Fn]) || Ar[Fn + 1].type === "css-atrule" && Ar[Fn + 1].name === "else" && Ar[Fn].type !== "css-comment" ? Ke.push(" ") : (Ke.push(dr.__isHTMLStyleAttribute ? E : C), u(dr.originalText, Wn.getValue(), Ct) && !i(Ar[Fn]) && Ke.push(C)));
          }, "nodes"), Ke;
        }
        var $t = /(["'])(?:(?!\1)[^\\]|\\.)*\1/gs, bt = /(?:\d*\.\d+|\d+\.?)(?:[Ee][+-]?\d+)?/g, Hr = /[A-Za-z]+/g, Ot = /[$@]?[A-Z_a-z\u0080-\uFFFF][\w\u0080-\uFFFF-]*/g, Gr = new RegExp($t.source + `|(${Ot.source})?(${bt.source})(${Hr.source})?`, "g");
        function _t(Lt, dr) {
          return Lt.replace($t, (or) => c(or, dr));
        }
        function nr(Lt, dr) {
          let or = dr.singleQuote ? "'" : '"';
          return Lt.includes('"') || Lt.includes("'") ? Lt : or + Lt + or;
        }
        function gr(Lt) {
          return Lt.replace(Gr, (dr, or, Ke, Wn, Fn) => !Ke && Wn ? Rr(Wn) + v(Fn || "") : dr);
        }
        function Rr(Lt) {
          return p(Lt).replace(/\.0(?=$|e)/, "");
        }
        m.exports = { print: yt, embed: H, insertPragma: ge, massageAstNode: Q };
      } }), Xa = Ce({ "src/language-css/options.js"(o, m) {
        Be();
        var t = Ki();
        m.exports = { singleQuote: t.singleQuote };
      } }), Ha = Ce({ "src/language-css/parsers.js"() {
        Be();
      } }), ea = Ce({ "node_modules/linguist-languages/data/CSS.json"(o, m) {
        m.exports = { name: "CSS", type: "markup", tmScope: "source.css", aceMode: "css", codemirrorMode: "css", codemirrorMimeType: "text/css", color: "#563d7c", extensions: [".css"], languageId: 50 };
      } }), ta = Ce({ "node_modules/linguist-languages/data/PostCSS.json"(o, m) {
        m.exports = { name: "PostCSS", type: "markup", color: "#dc3a0c", tmScope: "source.postcss", group: "CSS", extensions: [".pcss", ".postcss"], aceMode: "text", languageId: 262764437 };
      } }), Ka = Ce({ "node_modules/linguist-languages/data/Less.json"(o, m) {
        m.exports = { name: "Less", type: "markup", color: "#1d365d", aliases: ["less-css"], extensions: [".less"], tmScope: "source.css.less", aceMode: "less", codemirrorMode: "css", codemirrorMimeType: "text/css", languageId: 198 };
      } }), no = Ce({ "node_modules/linguist-languages/data/SCSS.json"(o, m) {
        m.exports = { name: "SCSS", type: "markup", color: "#c6538c", tmScope: "source.css.scss", aceMode: "scss", codemirrorMode: "css", codemirrorMimeType: "text/x-scss", extensions: [".scss"], languageId: 329 };
      } }), io = Ce({ "src/language-css/index.js"(o, m) {
        Be();
        var t = bi(), p = Wa(), c = Xa(), e = Ha(), i = [t(ea(), (h) => ({ since: "1.4.0", parsers: ["css"], vscodeLanguageIds: ["css"], extensions: [...h.extensions, ".wxss"] })), t(ta(), () => ({ since: "1.4.0", parsers: ["css"], vscodeLanguageIds: ["postcss"] })), t(Ka(), () => ({ since: "1.4.0", parsers: ["less"], vscodeLanguageIds: ["less"] })), t(no(), () => ({ since: "1.4.0", parsers: ["scss"], vscodeLanguageIds: ["scss"] }))], u = { postcss: p };
        m.exports = { languages: i, options: c, printers: u, parsers: e };
      } }), uo = Ce({ "src/language-handlebars/loc.js"(o, m) {
        Be();
        function t(c) {
          return c.loc.start.offset;
        }
        function p(c) {
          return c.loc.end.offset;
        }
        m.exports = { locStart: t, locEnd: p };
      } }), a = Ce({ "src/language-handlebars/clean.js"(o, m) {
        Be();
        function t(p, c) {
          if (p.type === "TextNode") {
            let e = p.chars.trim();
            if (!e)
              return null;
            c.chars = e.replace(/[\t\n\f\r ]+/g, " ");
          }
          p.type === "AttrNode" && p.name.toLowerCase() === "class" && delete c.value;
        }
        t.ignoredProperties = /* @__PURE__ */ new Set(["loc", "selfClosing"]), m.exports = t;
      } }), z = Ce({ "vendors/html-void-elements.json"(o, m) {
        m.exports = { htmlVoidElements: ["area", "base", "basefont", "bgsound", "br", "col", "command", "embed", "frame", "hr", "image", "img", "input", "isindex", "keygen", "link", "menuitem", "meta", "nextid", "param", "source", "track", "wbr"] };
      } }), $ = Ce({ "src/language-handlebars/utils.js"(o, m) {
        Be();
        var { htmlVoidElements: t } = z(), p = dn();
        function c(_) {
          let U = _.getValue(), Q = _.getParentNode(0);
          return !!(C(_, ["ElementNode"]) && p(Q.children) === U || C(_, ["Block"]) && p(Q.body) === U);
        }
        function e(_) {
          return _.toUpperCase() === _;
        }
        function i(_) {
          return E(_, ["ElementNode"]) && typeof _.tag == "string" && !_.tag.startsWith(":") && (e(_.tag[0]) || _.tag.includes("."));
        }
        var u = new Set(t);
        function h(_) {
          return u.has(_.tag) || _.selfClosing === !0 || i(_) && _.children.every((U) => D(U));
        }
        function D(_) {
          return E(_, ["TextNode"]) && !/\S/.test(_.chars);
        }
        function E(_, U) {
          return _ && U.includes(_.type);
        }
        function C(_, U) {
          let Q = _.getParentNode(0);
          return E(Q, U);
        }
        function F(_, U) {
          let Q = T(_);
          return E(Q, U);
        }
        function g(_, U) {
          let Q = G(_);
          return E(Q, U);
        }
        function b(_, U) {
          var Q, H, ge, y;
          let R = _.getValue(), v = (Q = _.getParentNode(0)) !== null && Q !== void 0 ? Q : {}, S = (H = (ge = (y = v.children) !== null && y !== void 0 ? y : v.body) !== null && ge !== void 0 ? ge : v.parts) !== null && H !== void 0 ? H : [], l = S.indexOf(R);
          return l !== -1 && S[l + U];
        }
        function T(_) {
          let U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
          return b(_, -U);
        }
        function G(_) {
          return b(_, 1);
        }
        function W(_) {
          return E(_, ["MustacheCommentStatement"]) && typeof _.value == "string" && _.value.trim() === "prettier-ignore";
        }
        function B(_) {
          let U = _.getValue(), Q = T(_, 2);
          return W(U) || W(Q);
        }
        m.exports = { getNextNode: G, getPreviousNode: T, hasPrettierIgnore: B, isLastNodeOfSiblings: c, isNextNodeOfSomeType: g, isNodeOfSomeType: E, isParentOfSomeType: C, isPreviousNodeOfSomeType: F, isVoid: h, isWhitespaceNode: D };
      } }), V = Ce({ "src/language-handlebars/printer-glimmer.js"(o, m) {
        Be();
        var { builders: { dedent: t, fill: p, group: c, hardline: e, ifBreak: i, indent: u, join: h, line: D, softline: E }, utils: { getDocParts: C, replaceTextEndOfLine: F } } = sr(), { getPreferredQuote: g, isNonEmptyArray: b } = yr(), { locStart: T, locEnd: G } = uo(), W = a(), { getNextNode: B, getPreviousNode: _, hasPrettierIgnore: U, isLastNodeOfSiblings: Q, isNextNodeOfSomeType: H, isNodeOfSomeType: ge, isParentOfSomeType: y, isPreviousNodeOfSomeType: R, isVoid: v, isWhitespaceNode: S } = $(), l = 2;
        function A(ye, tt, Te) {
          let rt = ye.getValue();
          if (!rt)
            return "";
          if (U(ye))
            return tt.originalText.slice(T(rt), G(rt));
          let jt = tt.singleQuote ? "'" : '"';
          switch (rt.type) {
            case "Block":
            case "Program":
            case "Template":
              return c(ye.map(Te, "body"));
            case "ElementNode": {
              let Ct = c(I(ye, Te)), nt = tt.htmlWhitespaceSensitivity === "ignore" && H(ye, ["ElementNode"]) ? E : "";
              if (v(rt))
                return [Ct, nt];
              let N = ["</", rt.tag, ">"];
              return rt.children.length === 0 ? [Ct, u(N), nt] : tt.htmlWhitespaceSensitivity === "ignore" ? [Ct, u(O(ye, tt, Te)), e, u(N), nt] : [Ct, u(c(O(ye, tt, Te))), u(N), nt];
            }
            case "BlockStatement": {
              let Ct = ye.getParentNode(1);
              return Ct && Ct.inverse && Ct.inverse.body.length === 1 && Ct.inverse.body[0] === rt && Ct.inverse.body[0].path.parts[0] === Ct.path.parts[0] ? [Je(ye, Te, Ct.inverse.body[0].path.parts[0]), Qe(ye, Te, tt), Ze(ye, Te, tt)] : [oe(ye, Te), c([Qe(ye, Te, tt), Ze(ye, Te, tt), _e(ye, Te, tt)])];
            }
            case "ElementModifierStatement":
              return c(["{{", mr(ye, Te), "}}"]);
            case "MustacheStatement":
              return c([ee(rt), mr(ye, Te), pe(rt)]);
            case "SubExpression":
              return c(["(", Dr(ye, Te), E, ")"]);
            case "AttrNode": {
              let Ct = rt.value.type === "TextNode";
              if (Ct && rt.value.chars === "" && T(rt.value) === G(rt.value))
                return rt.name;
              let nt = Ct ? g(rt.value.chars, jt).quote : rt.value.type === "ConcatStatement" ? g(rt.value.parts.filter((Fe) => Fe.type === "TextNode").map((Fe) => Fe.chars).join(""), jt).quote : "", N = Te("value");
              return [rt.name, "=", nt, rt.name === "class" && nt ? c(u(N)) : N, nt];
            }
            case "ConcatStatement":
              return ye.map(Te, "parts");
            case "Hash":
              return h(D, ye.map(Te, "pairs"));
            case "HashPair":
              return [rt.key, "=", Te("value")];
            case "TextNode": {
              let Ct = rt.chars.replace(/{{/g, "\\{{"), nt = be(ye);
              if (nt) {
                if (nt === "class") {
                  let Ot = Ct.trim().split(/\s+/).join(" "), Gr = !1, _t = !1;
                  return y(ye, ["ConcatStatement"]) && (R(ye, ["MustacheStatement"]) && /^\s/.test(Ct) && (Gr = !0), H(ye, ["MustacheStatement"]) && /\s$/.test(Ct) && Ot !== "" && (_t = !0)), [Gr ? D : "", Ot, _t ? D : ""];
                }
                return F(Ct);
              }
              let N = /^[\t\n\f\r ]*$/.test(Ct), Fe = !_(ye), Ue = !B(ye);
              if (tt.htmlWhitespaceSensitivity !== "ignore") {
                let Ot = /^[\t\n\f\r ]*/, Gr = /[\t\n\f\r ]*$/, _t = Ue && y(ye, ["Template"]), nr = Fe && y(ye, ["Template"]);
                if (N) {
                  if (nr || _t)
                    return "";
                  let or = [D], Ke = Oe(Ct);
                  return Ke && (or = ht(Ke)), Q(ye) && (or = or.map((Wn) => t(Wn))), or;
                }
                let [gr] = Ct.match(Ot), [Rr] = Ct.match(Gr), Lt = [];
                if (gr) {
                  Lt = [D];
                  let or = Oe(gr);
                  or && (Lt = ht(or)), Ct = Ct.replace(Ot, "");
                }
                let dr = [];
                if (Rr) {
                  if (!_t) {
                    dr = [D];
                    let or = Oe(Rr);
                    or && (dr = ht(or)), Q(ye) && (dr = dr.map((Ke) => t(Ke)));
                  }
                  Ct = Ct.replace(Gr, "");
                }
                return [...Lt, p(kt(Ct)), ...dr];
              }
              let yt = Oe(Ct), Et = Re(Ct), $t = ut(Ct);
              if ((Fe || Ue) && N && y(ye, ["Block", "ElementNode", "Template"]))
                return "";
              N && yt ? (Et = Math.min(yt, l), $t = 0) : (H(ye, ["BlockStatement", "ElementNode"]) && ($t = Math.max($t, 1)), R(ye, ["BlockStatement", "ElementNode"]) && (Et = Math.max(Et, 1)));
              let bt = "", Hr = "";
              return $t === 0 && H(ye, ["MustacheStatement"]) && (Hr = " "), Et === 0 && R(ye, ["MustacheStatement"]) && (bt = " "), Fe && (Et = 0, bt = ""), Ue && ($t = 0, Hr = ""), Ct = Ct.replace(/^[\t\n\f\r ]+/g, bt).replace(/[\t\n\f\r ]+$/, Hr), [...ht(Et), p(kt(Ct)), ...ht($t)];
            }
            case "MustacheCommentStatement": {
              let Ct = T(rt), nt = G(rt), N = tt.originalText.charAt(Ct + 2) === "~", Fe = tt.originalText.charAt(nt - 3) === "~", Ue = rt.value.includes("}}") ? "--" : "";
              return ["{{", N ? "~" : "", "!", Ue, rt.value, Ue, Fe ? "~" : "", "}}"];
            }
            case "PathExpression":
              return rt.original;
            case "BooleanLiteral":
              return String(rt.value);
            case "CommentStatement":
              return ["<!--", rt.value, "-->"];
            case "StringLiteral": {
              if (Ut(ye)) {
                let Ct = tt.singleQuote ? '"' : "'";
                return vt(rt.value, Ct);
              }
              return vt(rt.value, jt);
            }
            case "NumberLiteral":
              return String(rt.value);
            case "UndefinedLiteral":
              return "undefined";
            case "NullLiteral":
              return "null";
            default:
              throw new Error("unknown glimmer type: " + JSON.stringify(rt.type));
          }
        }
        function w(ye, tt) {
          return T(ye) - T(tt);
        }
        function I(ye, tt) {
          let Te = ye.getValue(), rt = ["attributes", "modifiers", "comments"].filter((Ct) => b(Te[Ct])), jt = rt.flatMap((Ct) => Te[Ct]).sort(w);
          for (let Ct of rt)
            ye.each((nt) => {
              let N = jt.indexOf(nt.getValue());
              jt.splice(N, 1, [D, tt()]);
            }, Ct);
          return b(Te.blockParams) && jt.push(D, Xe(Te)), ["<", Te.tag, u(jt), M(Te)];
        }
        function O(ye, tt, Te) {
          let rt = ye.getValue().children.every((jt) => S(jt));
          return tt.htmlWhitespaceSensitivity === "ignore" && rt ? "" : ye.map((jt, Ct) => {
            let nt = Te();
            return Ct === 0 && tt.htmlWhitespaceSensitivity === "ignore" ? [E, nt] : nt;
          }, "children");
        }
        function M(ye) {
          return v(ye) ? i([E, "/>"], [" />", E]) : i([E, ">"], ">");
        }
        function ee(ye) {
          let tt = ye.escaped === !1 ? "{{{" : "{{", Te = ye.strip && ye.strip.open ? "~" : "";
          return [tt, Te];
        }
        function pe(ye) {
          let tt = ye.escaped === !1 ? "}}}" : "}}";
          return [ye.strip && ye.strip.close ? "~" : "", tt];
        }
        function he(ye) {
          let tt = ee(ye), Te = ye.openStrip.open ? "~" : "";
          return [tt, Te, "#"];
        }
        function ce(ye) {
          let tt = pe(ye);
          return [ye.openStrip.close ? "~" : "", tt];
        }
        function xe(ye) {
          let tt = ee(ye), Te = ye.closeStrip.open ? "~" : "";
          return [tt, Te, "/"];
        }
        function ie(ye) {
          let tt = pe(ye);
          return [ye.closeStrip.close ? "~" : "", tt];
        }
        function je(ye) {
          let tt = ee(ye), Te = ye.inverseStrip.open ? "~" : "";
          return [tt, Te];
        }
        function de(ye) {
          let tt = pe(ye);
          return [ye.inverseStrip.close ? "~" : "", tt];
        }
        function oe(ye, tt) {
          let Te = ye.getValue(), rt = he(Te), jt = ce(Te), Ct = [Vt(ye, tt)], nt = Qt(ye, tt);
          if (nt && Ct.push(D, nt), b(Te.program.blockParams)) {
            let N = Xe(Te.program);
            Ct.push(D, N);
          }
          return c([rt, u(Ct), E, jt]);
        }
        function Ne(ye, tt) {
          return [tt.htmlWhitespaceSensitivity === "ignore" ? e : "", je(ye), "else", de(ye)];
        }
        function Je(ye, tt, Te) {
          let rt = ye.getValue(), jt = [];
          b(rt.program.blockParams) && (jt = [D, Xe(rt.program)]);
          let Ct = ye.getParentNode(1);
          return c([je(Ct), u(c([c(["else", D, Te]), D, Qt(ye, tt)])), u(jt), E, de(Ct)]);
        }
        function _e(ye, tt, Te) {
          let rt = ye.getValue();
          return Te.htmlWhitespaceSensitivity === "ignore" ? [it(rt) ? E : e, xe(rt), tt("path"), ie(rt)] : [xe(rt), tt("path"), ie(rt)];
        }
        function it(ye) {
          return ge(ye, ["BlockStatement"]) && ye.program.body.every((tt) => S(tt));
        }
        function me(ye) {
          return Se(ye) && ye.inverse.body.length === 1 && ge(ye.inverse.body[0], ["BlockStatement"]) && ye.inverse.body[0].path.parts[0] === ye.path.parts[0];
        }
        function Se(ye) {
          return ge(ye, ["BlockStatement"]) && ye.inverse;
        }
        function Qe(ye, tt, Te) {
          let rt = ye.getValue();
          if (it(rt))
            return "";
          let jt = tt("program");
          return Te.htmlWhitespaceSensitivity === "ignore" ? u([e, jt]) : u(jt);
        }
        function Ze(ye, tt, Te) {
          let rt = ye.getValue(), jt = tt("inverse"), Ct = Te.htmlWhitespaceSensitivity === "ignore" ? [e, jt] : jt;
          return me(rt) ? Ct : Se(rt) ? [Ne(rt, Te), u(Ct)] : "";
        }
        function kt(ye) {
          return C(h(D, ke(ye)));
        }
        function ke(ye) {
          return ye.split(/[\t\n\f\r ]+/);
        }
        function be(ye) {
          for (let tt = 0; tt < 2; tt++) {
            let Te = ye.getParentNode(tt);
            if (Te && Te.type === "AttrNode")
              return Te.name.toLowerCase();
          }
        }
        function Oe(ye) {
          return ye = typeof ye == "string" ? ye : "", ye.split(`
`).length - 1;
        }
        function Re(ye) {
          ye = typeof ye == "string" ? ye : "";
          let tt = (ye.match(/^([^\S\n\r]*[\n\r])+/g) || [])[0] || "";
          return Oe(tt);
        }
        function ut(ye) {
          ye = typeof ye == "string" ? ye : "";
          let tt = (ye.match(/([\n\r][^\S\n\r]*)+$/g) || [])[0] || "";
          return Oe(tt);
        }
        function ht() {
          let ye = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          return Array.from({ length: Math.min(ye, l) }).fill(e);
        }
        function vt(ye, tt) {
          let { quote: Te, regex: rt } = g(ye, tt);
          return [Te, ye.replace(rt, `\\${Te}`), Te];
        }
        function Ut(ye) {
          let tt = 0, Te = ye.getParentNode(tt);
          for (; Te && ge(Te, ["SubExpression"]); )
            tt++, Te = ye.getParentNode(tt);
          return !!(Te && ge(ye.getParentNode(tt + 1), ["ConcatStatement"]) && ge(ye.getParentNode(tt + 2), ["AttrNode"]));
        }
        function Dr(ye, tt) {
          let Te = Vt(ye, tt), rt = Qt(ye, tt);
          return rt ? u([Te, D, c(rt)]) : Te;
        }
        function mr(ye, tt) {
          let Te = Vt(ye, tt), rt = Qt(ye, tt);
          return rt ? [u([Te, D, rt]), E] : Te;
        }
        function Vt(ye, tt) {
          return tt("path");
        }
        function Qt(ye, tt) {
          let Te = ye.getValue(), rt = [];
          if (Te.params.length > 0) {
            let jt = ye.map(tt, "params");
            rt.push(...jt);
          }
          if (Te.hash && Te.hash.pairs.length > 0) {
            let jt = tt("hash");
            rt.push(jt);
          }
          return rt.length === 0 ? "" : h(D, rt);
        }
        function Xe(ye) {
          return ["as |", ye.blockParams.join(" "), "|"];
        }
        m.exports = { print: A, massageAstNode: W };
      } }), Y = Ce({ "src/language-handlebars/parsers.js"() {
        Be();
      } }), te = Ce({ "node_modules/linguist-languages/data/Handlebars.json"(o, m) {
        m.exports = { name: "Handlebars", type: "markup", color: "#f7931e", aliases: ["hbs", "htmlbars"], extensions: [".handlebars", ".hbs"], tmScope: "text.html.handlebars", aceMode: "handlebars", languageId: 155 };
      } }), Z = Ce({ "src/language-handlebars/index.js"(o, m) {
        Be();
        var t = bi(), p = V(), c = Y(), e = [t(te(), () => ({ since: "2.3.0", parsers: ["glimmer"], vscodeLanguageIds: ["handlebars"] }))], i = { glimmer: p };
        m.exports = { languages: e, printers: i, parsers: c };
      } }), ne = Ce({ "src/language-graphql/pragma.js"(o, m) {
        Be();
        function t(c) {
          return /^\s*#[^\S\n]*@(?:format|prettier)\s*(?:\n|$)/.test(c);
        }
        function p(c) {
          return `# @format

` + c;
        }
        m.exports = { hasPragma: t, insertPragma: p };
      } }), X = Ce({ "src/language-graphql/loc.js"(o, m) {
        Be();
        function t(c) {
          return typeof c.start == "number" ? c.start : c.loc && c.loc.start;
        }
        function p(c) {
          return typeof c.end == "number" ? c.end : c.loc && c.loc.end;
        }
        m.exports = { locStart: t, locEnd: p };
      } }), re = Ce({ "src/language-graphql/printer-graphql.js"(o, m) {
        Be();
        var { builders: { join: t, hardline: p, line: c, softline: e, group: i, indent: u, ifBreak: h } } = sr(), { isNextLineEmpty: D, isNonEmptyArray: E } = yr(), { insertPragma: C } = ne(), { locStart: F, locEnd: g } = X();
        function b(H, ge, y) {
          let R = H.getValue();
          if (!R)
            return "";
          if (typeof R == "string")
            return R;
          switch (R.kind) {
            case "Document": {
              let v = [];
              return H.each((S, l, A) => {
                v.push(y()), l !== A.length - 1 && (v.push(p), D(ge.originalText, S.getValue(), g) && v.push(p));
              }, "definitions"), [...v, p];
            }
            case "OperationDefinition": {
              let v = ge.originalText[F(R)] !== "{", S = Boolean(R.name);
              return [v ? R.operation : "", v && S ? [" ", y("name")] : "", v && !S && E(R.variableDefinitions) ? " " : "", E(R.variableDefinitions) ? i(["(", u([e, t([h("", ", "), e], H.map(y, "variableDefinitions"))]), e, ")"]) : "", T(H, y, R), R.selectionSet ? !v && !S ? "" : " " : "", y("selectionSet")];
            }
            case "FragmentDefinition":
              return ["fragment ", y("name"), E(R.variableDefinitions) ? i(["(", u([e, t([h("", ", "), e], H.map(y, "variableDefinitions"))]), e, ")"]) : "", " on ", y("typeCondition"), T(H, y, R), " ", y("selectionSet")];
            case "SelectionSet":
              return ["{", u([p, t(p, G(H, ge, y, "selections"))]), p, "}"];
            case "Field":
              return i([R.alias ? [y("alias"), ": "] : "", y("name"), R.arguments.length > 0 ? i(["(", u([e, t([h("", ", "), e], G(H, ge, y, "arguments"))]), e, ")"]) : "", T(H, y, R), R.selectionSet ? " " : "", y("selectionSet")]);
            case "Name":
              return R.value;
            case "StringValue": {
              if (R.block) {
                let v = R.value.replace(/"""/g, "\\$&").split(`
`);
                return v.length === 1 && (v[0] = v[0].trim()), v.every((S) => S === "") && (v.length = 0), t(p, ['"""', ...v, '"""']);
              }
              return ['"', R.value.replace(/["\\]/g, "\\$&").replace(/\n/g, "\\n"), '"'];
            }
            case "IntValue":
            case "FloatValue":
            case "EnumValue":
              return R.value;
            case "BooleanValue":
              return R.value ? "true" : "false";
            case "NullValue":
              return "null";
            case "Variable":
              return ["$", y("name")];
            case "ListValue":
              return i(["[", u([e, t([h("", ", "), e], H.map(y, "values"))]), e, "]"]);
            case "ObjectValue":
              return i(["{", ge.bracketSpacing && R.fields.length > 0 ? " " : "", u([e, t([h("", ", "), e], H.map(y, "fields"))]), e, h("", ge.bracketSpacing && R.fields.length > 0 ? " " : ""), "}"]);
            case "ObjectField":
            case "Argument":
              return [y("name"), ": ", y("value")];
            case "Directive":
              return ["@", y("name"), R.arguments.length > 0 ? i(["(", u([e, t([h("", ", "), e], G(H, ge, y, "arguments"))]), e, ")"]) : ""];
            case "NamedType":
              return y("name");
            case "VariableDefinition":
              return [y("variable"), ": ", y("type"), R.defaultValue ? [" = ", y("defaultValue")] : "", T(H, y, R)];
            case "ObjectTypeExtension":
            case "ObjectTypeDefinition":
              return [y("description"), R.description ? p : "", R.kind === "ObjectTypeExtension" ? "extend " : "", "type ", y("name"), R.interfaces.length > 0 ? [" implements ", ..._(H, ge, y)] : "", T(H, y, R), R.fields.length > 0 ? [" {", u([p, t(p, G(H, ge, y, "fields"))]), p, "}"] : ""];
            case "FieldDefinition":
              return [y("description"), R.description ? p : "", y("name"), R.arguments.length > 0 ? i(["(", u([e, t([h("", ", "), e], G(H, ge, y, "arguments"))]), e, ")"]) : "", ": ", y("type"), T(H, y, R)];
            case "DirectiveDefinition":
              return [y("description"), R.description ? p : "", "directive ", "@", y("name"), R.arguments.length > 0 ? i(["(", u([e, t([h("", ", "), e], G(H, ge, y, "arguments"))]), e, ")"]) : "", R.repeatable ? " repeatable" : "", " on ", t(" | ", H.map(y, "locations"))];
            case "EnumTypeExtension":
            case "EnumTypeDefinition":
              return [y("description"), R.description ? p : "", R.kind === "EnumTypeExtension" ? "extend " : "", "enum ", y("name"), T(H, y, R), R.values.length > 0 ? [" {", u([p, t(p, G(H, ge, y, "values"))]), p, "}"] : ""];
            case "EnumValueDefinition":
              return [y("description"), R.description ? p : "", y("name"), T(H, y, R)];
            case "InputValueDefinition":
              return [y("description"), R.description ? R.description.block ? p : c : "", y("name"), ": ", y("type"), R.defaultValue ? [" = ", y("defaultValue")] : "", T(H, y, R)];
            case "InputObjectTypeExtension":
            case "InputObjectTypeDefinition":
              return [y("description"), R.description ? p : "", R.kind === "InputObjectTypeExtension" ? "extend " : "", "input ", y("name"), T(H, y, R), R.fields.length > 0 ? [" {", u([p, t(p, G(H, ge, y, "fields"))]), p, "}"] : ""];
            case "SchemaExtension":
              return ["extend schema", T(H, y, R), ...R.operationTypes.length > 0 ? [" {", u([p, t(p, G(H, ge, y, "operationTypes"))]), p, "}"] : []];
            case "SchemaDefinition":
              return [y("description"), R.description ? p : "", "schema", T(H, y, R), " {", R.operationTypes.length > 0 ? u([p, t(p, G(H, ge, y, "operationTypes"))]) : "", p, "}"];
            case "OperationTypeDefinition":
              return [y("operation"), ": ", y("type")];
            case "InterfaceTypeExtension":
            case "InterfaceTypeDefinition":
              return [y("description"), R.description ? p : "", R.kind === "InterfaceTypeExtension" ? "extend " : "", "interface ", y("name"), R.interfaces.length > 0 ? [" implements ", ..._(H, ge, y)] : "", T(H, y, R), R.fields.length > 0 ? [" {", u([p, t(p, G(H, ge, y, "fields"))]), p, "}"] : ""];
            case "FragmentSpread":
              return ["...", y("name"), T(H, y, R)];
            case "InlineFragment":
              return ["...", R.typeCondition ? [" on ", y("typeCondition")] : "", T(H, y, R), " ", y("selectionSet")];
            case "UnionTypeExtension":
            case "UnionTypeDefinition":
              return i([y("description"), R.description ? p : "", i([R.kind === "UnionTypeExtension" ? "extend " : "", "union ", y("name"), T(H, y, R), R.types.length > 0 ? [" =", h("", " "), u([h([c, "  "]), t([c, "| "], H.map(y, "types"))])] : ""])]);
            case "ScalarTypeExtension":
            case "ScalarTypeDefinition":
              return [y("description"), R.description ? p : "", R.kind === "ScalarTypeExtension" ? "extend " : "", "scalar ", y("name"), T(H, y, R)];
            case "NonNullType":
              return [y("type"), "!"];
            case "ListType":
              return ["[", y("type"), "]"];
            default:
              throw new Error("unknown graphql type: " + JSON.stringify(R.kind));
          }
        }
        function T(H, ge, y) {
          if (y.directives.length === 0)
            return "";
          let R = t(c, H.map(ge, "directives"));
          return y.kind === "FragmentDefinition" || y.kind === "OperationDefinition" ? i([c, R]) : [" ", i(u([e, R]))];
        }
        function G(H, ge, y, R) {
          return H.map((v, S, l) => {
            let A = y();
            return S < l.length - 1 && D(ge.originalText, v.getValue(), g) ? [A, p] : A;
          }, R);
        }
        function W(H) {
          return H.kind && H.kind !== "Comment";
        }
        function B(H) {
          let ge = H.getValue();
          if (ge.kind === "Comment")
            return "#" + ge.value.trimEnd();
          throw new Error("Not a comment: " + JSON.stringify(ge));
        }
        function _(H, ge, y) {
          let R = H.getNode(), v = [], { interfaces: S } = R, l = H.map((A) => y(A), "interfaces");
          for (let A = 0; A < S.length; A++) {
            let w = S[A];
            v.push(l[A]);
            let I = S[A + 1];
            if (I) {
              let O = ge.originalText.slice(w.loc.end, I.loc.start), M = O.includes("#"), ee = O.replace(/#.*/g, "").trim();
              v.push(ee === "," ? "," : " &", M ? c : " ");
            }
          }
          return v;
        }
        function U(H, ge) {
          H.kind === "StringValue" && H.block && !H.value.includes(`
`) && (ge.value = ge.value.trim());
        }
        U.ignoredProperties = /* @__PURE__ */ new Set(["loc", "comments"]);
        function Q(H) {
          var ge;
          let y = H.getValue();
          return y == null || (ge = y.comments) === null || ge === void 0 ? void 0 : ge.some((R) => R.value.trim() === "prettier-ignore");
        }
        m.exports = { print: b, massageAstNode: U, hasPrettierIgnore: Q, insertPragma: C, printComment: B, canAttachComment: W };
      } }), d = Ce({ "src/language-graphql/options.js"(o, m) {
        Be();
        var t = Ki();
        m.exports = { bracketSpacing: t.bracketSpacing };
      } }), n = Ce({ "src/language-graphql/parsers.js"() {
        Be();
      } }), q = Ce({ "node_modules/linguist-languages/data/GraphQL.json"(o, m) {
        m.exports = { name: "GraphQL", type: "data", color: "#e10098", extensions: [".graphql", ".gql", ".graphqls"], tmScope: "source.graphql", aceMode: "text", languageId: 139 };
      } }), L = Ce({ "src/language-graphql/index.js"(o, m) {
        Be();
        var t = bi(), p = re(), c = d(), e = n(), i = [t(q(), () => ({ since: "1.5.0", parsers: ["graphql"], vscodeLanguageIds: ["graphql"] }))], u = { graphql: p };
        m.exports = { languages: i, options: c, printers: u, parsers: e };
      } }), ae = Ce({ "node_modules/collapse-white-space/index.js"(o, m) {
        Be(), m.exports = t;
        function t(p) {
          return String(p).replace(/\s+/g, " ");
        }
      } }), ue = Ce({ "src/language-markdown/loc.js"(o, m) {
        Be();
        function t(c) {
          return c.position.start.offset;
        }
        function p(c) {
          return c.position.end.offset;
        }
        m.exports = { locStart: t, locEnd: p };
      } }), ve = Ce({ "src/language-markdown/constants.evaluate.js"(o, m) {
        m.exports = { cjkPattern: "(?:[\\u02ea-\\u02eb\\u1100-\\u11ff\\u2e80-\\u2e99\\u2e9b-\\u2ef3\\u2f00-\\u2fd5\\u2ff0-\\u303f\\u3041-\\u3096\\u3099-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312f\\u3131-\\u318e\\u3190-\\u3191\\u3196-\\u31ba\\u31c0-\\u31e3\\u31f0-\\u321e\\u322a-\\u3247\\u3260-\\u327e\\u328a-\\u32b0\\u32c0-\\u32cb\\u32d0-\\u3370\\u337b-\\u337f\\u33e0-\\u33fe\\u3400-\\u4db5\\u4e00-\\u9fef\\ua960-\\ua97c\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufe10-\\ufe1f\\ufe30-\\ufe6f\\uff00-\\uffef]|[\\ud840-\\ud868\\ud86a-\\ud86c\\ud86f-\\ud872\\ud874-\\ud879][\\udc00-\\udfff]|\\ud82c[\\udc00-\\udd1e\\udd50-\\udd52\\udd64-\\udd67]|\\ud83c[\\ude00\\ude50-\\ude51]|\\ud869[\\udc00-\\uded6\\udf00-\\udfff]|\\ud86d[\\udc00-\\udf34\\udf40-\\udfff]|\\ud86e[\\udc00-\\udc1d\\udc20-\\udfff]|\\ud873[\\udc00-\\udea1\\udeb0-\\udfff]|\\ud87a[\\udc00-\\udfe0]|\\ud87e[\\udc00-\\ude1d])(?:[\\ufe00-\\ufe0f]|\\udb40[\\udd00-\\uddef])?", kPattern: "[\\u1100-\\u11ff\\u3001-\\u3003\\u3008-\\u3011\\u3013-\\u301f\\u302e-\\u3030\\u3037\\u30fb\\u3131-\\u318e\\u3200-\\u321e\\u3260-\\u327e\\ua960-\\ua97c\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\ufe45-\\ufe46\\uff61-\\uff65\\uffa0-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc]", punctuationPattern: "[\\u0021-\\u002f\\u003a-\\u0040\\u005b-\\u0060\\u007b-\\u007e\\u00a1\\u00a7\\u00ab\\u00b6-\\u00b7\\u00bb\\u00bf\\u037e\\u0387\\u055a-\\u055f\\u0589-\\u058a\\u05be\\u05c0\\u05c3\\u05c6\\u05f3-\\u05f4\\u0609-\\u060a\\u060c-\\u060d\\u061b\\u061e-\\u061f\\u066a-\\u066d\\u06d4\\u0700-\\u070d\\u07f7-\\u07f9\\u0830-\\u083e\\u085e\\u0964-\\u0965\\u0970\\u09fd\\u0a76\\u0af0\\u0c77\\u0c84\\u0df4\\u0e4f\\u0e5a-\\u0e5b\\u0f04-\\u0f12\\u0f14\\u0f3a-\\u0f3d\\u0f85\\u0fd0-\\u0fd4\\u0fd9-\\u0fda\\u104a-\\u104f\\u10fb\\u1360-\\u1368\\u1400\\u166e\\u169b-\\u169c\\u16eb-\\u16ed\\u1735-\\u1736\\u17d4-\\u17d6\\u17d8-\\u17da\\u1800-\\u180a\\u1944-\\u1945\\u1a1e-\\u1a1f\\u1aa0-\\u1aa6\\u1aa8-\\u1aad\\u1b5a-\\u1b60\\u1bfc-\\u1bff\\u1c3b-\\u1c3f\\u1c7e-\\u1c7f\\u1cc0-\\u1cc7\\u1cd3\\u2010-\\u2027\\u2030-\\u2043\\u2045-\\u2051\\u2053-\\u205e\\u207d-\\u207e\\u208d-\\u208e\\u2308-\\u230b\\u2329-\\u232a\\u2768-\\u2775\\u27c5-\\u27c6\\u27e6-\\u27ef\\u2983-\\u2998\\u29d8-\\u29db\\u29fc-\\u29fd\\u2cf9-\\u2cfc\\u2cfe-\\u2cff\\u2d70\\u2e00-\\u2e2e\\u2e30-\\u2e4f\\u3001-\\u3003\\u3008-\\u3011\\u3014-\\u301f\\u3030\\u303d\\u30a0\\u30fb\\ua4fe-\\ua4ff\\ua60d-\\ua60f\\ua673\\ua67e\\ua6f2-\\ua6f7\\ua874-\\ua877\\ua8ce-\\ua8cf\\ua8f8-\\ua8fa\\ua8fc\\ua92e-\\ua92f\\ua95f\\ua9c1-\\ua9cd\\ua9de-\\ua9df\\uaa5c-\\uaa5f\\uaade-\\uaadf\\uaaf0-\\uaaf1\\uabeb\\ufd3e-\\ufd3f\\ufe10-\\ufe19\\ufe30-\\ufe52\\ufe54-\\ufe61\\ufe63\\ufe68\\ufe6a-\\ufe6b\\uff01-\\uff03\\uff05-\\uff0a\\uff0c-\\uff0f\\uff1a-\\uff1b\\uff1f-\\uff20\\uff3b-\\uff3d\\uff3f\\uff5b\\uff5d\\uff5f-\\uff65]|\\ud800[\\udd00-\\udd02\\udf9f\\udfd0]|\\ud801[\\udd6f]|\\ud802[\\udc57\\udd1f\\udd3f\\ude50-\\ude58\\ude7f\\udef0-\\udef6\\udf39-\\udf3f\\udf99-\\udf9c]|\\ud803[\\udf55-\\udf59]|\\ud804[\\udc47-\\udc4d\\udcbb-\\udcbc\\udcbe-\\udcc1\\udd40-\\udd43\\udd74-\\udd75\\uddc5-\\uddc8\\uddcd\\udddb\\udddd-\\udddf\\ude38-\\ude3d\\udea9]|\\ud805[\\udc4b-\\udc4f\\udc5b\\udc5d\\udcc6\\uddc1-\\uddd7\\ude41-\\ude43\\ude60-\\ude6c\\udf3c-\\udf3e]|\\ud806[\\udc3b\\udde2\\ude3f-\\ude46\\ude9a-\\ude9c\\ude9e-\\udea2]|\\ud807[\\udc41-\\udc45\\udc70-\\udc71\\udef7-\\udef8\\udfff]|\\ud809[\\udc70-\\udc74]|\\ud81a[\\ude6e-\\ude6f\\udef5\\udf37-\\udf3b\\udf44]|\\ud81b[\\ude97-\\ude9a\\udfe2]|\\ud82f[\\udc9f]|\\ud836[\\ude87-\\ude8b]|\\ud83a[\\udd5e-\\udd5f]" };
      } }), De = Ce({ "src/language-markdown/utils.js"(o, m) {
        Be();
        var { getLast: t } = yr(), { locStart: p, locEnd: c } = ue(), { cjkPattern: e, kPattern: i, punctuationPattern: u } = ve(), h = ["liquidNode", "inlineCode", "emphasis", "esComment", "strong", "delete", "wikiLink", "link", "linkReference", "image", "imageReference", "footnote", "footnoteReference", "sentence", "whitespace", "word", "break", "inlineMath"], D = [...h, "tableCell", "paragraph", "heading"], E = new RegExp(i), C = new RegExp(u);
        function F(B, _) {
          let U = "non-cjk", Q = "cj-letter", H = "k-letter", ge = "cjk-punctuation", y = [], R = (_.proseWrap === "preserve" ? B : B.replace(new RegExp(`(${e})
(${e})`, "g"), "$1$2")).split(/([\t\n ]+)/);
          for (let [S, l] of R.entries()) {
            if (S % 2 === 1) {
              y.push({ type: "whitespace", value: /\n/.test(l) ? `
` : " " });
              continue;
            }
            if ((S === 0 || S === R.length - 1) && l === "")
              continue;
            let A = l.split(new RegExp(`(${e})`));
            for (let [w, I] of A.entries())
              if (!((w === 0 || w === A.length - 1) && I === "")) {
                if (w % 2 === 0) {
                  I !== "" && v({ type: "word", value: I, kind: U, hasLeadingPunctuation: C.test(I[0]), hasTrailingPunctuation: C.test(t(I)) });
                  continue;
                }
                v(C.test(I) ? { type: "word", value: I, kind: ge, hasLeadingPunctuation: !0, hasTrailingPunctuation: !0 } : { type: "word", value: I, kind: E.test(I) ? H : Q, hasLeadingPunctuation: !1, hasTrailingPunctuation: !1 });
              }
          }
          return y;
          function v(S) {
            let l = t(y);
            l && l.type === "word" && (l.kind === U && S.kind === Q && !l.hasTrailingPunctuation || l.kind === Q && S.kind === U && !S.hasLeadingPunctuation ? y.push({ type: "whitespace", value: " " }) : !A(U, ge) && ![l.value, S.value].some((w) => /\u3000/.test(w)) && y.push({ type: "whitespace", value: "" })), y.push(S);
            function A(w, I) {
              return l.kind === w && S.kind === I || l.kind === I && S.kind === w;
            }
          }
        }
        function g(B, _) {
          let [, U, Q, H] = _.slice(B.position.start.offset, B.position.end.offset).match(/^\s*(\d+)(\.|\))(\s*)/);
          return { numberText: U, marker: Q, leadingSpaces: H };
        }
        function b(B, _) {
          if (!B.ordered || B.children.length < 2)
            return !1;
          let U = Number(g(B.children[0], _.originalText).numberText), Q = Number(g(B.children[1], _.originalText).numberText);
          if (U === 0 && B.children.length > 2) {
            let H = Number(g(B.children[2], _.originalText).numberText);
            return Q === 1 && H === 1;
          }
          return Q === 1;
        }
        function T(B, _) {
          let { value: U } = B;
          return B.position.end.offset === _.length && U.endsWith(`
`) && _.endsWith(`
`) ? U.slice(0, -1) : U;
        }
        function G(B, _) {
          return function U(Q, H, ge) {
            let y = Object.assign({}, _(Q, H, ge));
            return y.children && (y.children = y.children.map((R, v) => U(R, v, [y, ...ge]))), y;
          }(B, null, []);
        }
        function W(B) {
          if ((B == null ? void 0 : B.type) !== "link" || B.children.length !== 1)
            return !1;
          let [_] = B.children;
          return p(B) === p(_) && c(B) === c(_);
        }
        m.exports = { mapAst: G, splitText: F, punctuationPattern: u, getFencedCodeBlockValue: T, getOrderedListItemInfo: g, hasGitDiffFriendlyOrderedList: b, INLINE_NODE_TYPES: h, INLINE_NODE_WRAPPER_TYPES: D, isAutolink: W };
      } }), le = Ce({ "src/language-markdown/embed.js"(o, m) {
        Be();
        var { inferParserByLanguage: t, getMaxContinuousCount: p } = yr(), { builders: { hardline: c, markAsRoot: e }, utils: { replaceEndOfLine: i } } = sr(), u = to(), { getFencedCodeBlockValue: h } = De();
        function D(E, C, F, g) {
          let b = E.getValue();
          if (b.type === "code" && b.lang !== null) {
            let T = t(b.lang, g);
            if (T) {
              let G = g.__inJsTemplate ? "~" : "`", W = G.repeat(Math.max(3, p(b.value, G) + 1)), B = { parser: T };
              b.lang === "tsx" && (B.filepath = "dummy.tsx");
              let _ = F(h(b, g.originalText), B, { stripTrailingHardline: !0 });
              return e([W, b.lang, b.meta ? " " + b.meta : "", c, i(_), c, W]);
            }
          }
          switch (b.type) {
            case "front-matter":
              return u(b, F);
            case "importExport":
              return [F(b.value, { parser: "babel" }, { stripTrailingHardline: !0 }), c];
            case "jsx":
              return F(`<$>${b.value}</$>`, { parser: "__js_expression", rootMarker: "mdx" }, { stripTrailingHardline: !0 });
          }
          return null;
        }
        m.exports = D;
      } }), Ie = Ce({ "src/language-markdown/pragma.js"(o, m) {
        Be();
        var t = Yo(), p = ["format", "prettier"];
        function c(e) {
          let i = `@(${p.join("|")})`, u = new RegExp([`<!--\\s*${i}\\s*-->`, `{\\s*\\/\\*\\s*${i}\\s*\\*\\/\\s*}`, `<!--.*\r?
[\\s\\S]*(^|
)[^\\S
]*${i}[^\\S
]*($|
)[\\s\\S]*
.*-->`].join("|"), "m"), h = e.match(u);
          return (h == null ? void 0 : h.index) === 0;
        }
        m.exports = { startWithPragma: c, hasPragma: (e) => c(t(e).content.trimStart()), insertPragma: (e) => {
          let i = t(e), u = `<!-- @${p[0]} -->`;
          return i.frontMatter ? `${i.frontMatter.raw}

${u}

${i.content}` : `${u}

${i.content}`;
        } };
      } }), Me = Ce({ "src/language-markdown/print-preprocess.js"(o, m) {
        Be();
        var t = dn(), { getOrderedListItemInfo: p, mapAst: c, splitText: e } = De(), i = /^.$/su;
        function u(W, B) {
          return W = E(W, B), W = g(W), W = D(W, B), W = T(W, B), W = G(W, B), W = b(W, B), W = h(W), W = C(W), W;
        }
        function h(W) {
          return c(W, (B) => B.type !== "import" && B.type !== "export" ? B : Object.assign(Object.assign({}, B), {}, { type: "importExport" }));
        }
        function D(W, B) {
          return c(W, (_) => _.type !== "inlineCode" || B.proseWrap === "preserve" ? _ : Object.assign(Object.assign({}, _), {}, { value: _.value.replace(/\s+/g, " ") }));
        }
        function E(W, B) {
          return c(W, (_) => _.type !== "text" || _.value === "*" || _.value === "_" || !i.test(_.value) || _.position.end.offset - _.position.start.offset === _.value.length ? _ : Object.assign(Object.assign({}, _), {}, { value: B.originalText.slice(_.position.start.offset, _.position.end.offset) }));
        }
        function C(W) {
          return F(W, (B, _) => B.type === "importExport" && _.type === "importExport", (B, _) => ({ type: "importExport", value: B.value + `

` + _.value, position: { start: B.position.start, end: _.position.end } }));
        }
        function F(W, B, _) {
          return c(W, (U) => {
            if (!U.children)
              return U;
            let Q = U.children.reduce((H, ge) => {
              let y = t(H);
              return y && B(y, ge) ? H.splice(-1, 1, _(y, ge)) : H.push(ge), H;
            }, []);
            return Object.assign(Object.assign({}, U), {}, { children: Q });
          });
        }
        function g(W) {
          return F(W, (B, _) => B.type === "text" && _.type === "text", (B, _) => ({ type: "text", value: B.value + _.value, position: { start: B.position.start, end: _.position.end } }));
        }
        function b(W, B) {
          return c(W, (_, U, Q) => {
            let [H] = Q;
            if (_.type !== "text")
              return _;
            let { value: ge } = _;
            return H.type === "paragraph" && (U === 0 && (ge = ge.trimStart()), U === H.children.length - 1 && (ge = ge.trimEnd())), { type: "sentence", position: _.position, children: e(ge, B) };
          });
        }
        function T(W, B) {
          return c(W, (_, U, Q) => {
            if (_.type === "code") {
              let H = /^\n?(?: {4,}|\t)/.test(B.originalText.slice(_.position.start.offset, _.position.end.offset));
              if (_.isIndented = H, H)
                for (let ge = 0; ge < Q.length; ge++) {
                  let y = Q[ge];
                  if (y.hasIndentedCodeblock)
                    break;
                  y.type === "list" && (y.hasIndentedCodeblock = !0);
                }
            }
            return _;
          });
        }
        function G(W, B) {
          return c(W, (Q, H, ge) => {
            if (Q.type === "list" && Q.children.length > 0) {
              for (let y = 0; y < ge.length; y++) {
                let R = ge[y];
                if (R.type === "list" && !R.isAligned)
                  return Q.isAligned = !1, Q;
              }
              Q.isAligned = U(Q);
            }
            return Q;
          });
          function _(Q) {
            return Q.children.length === 0 ? -1 : Q.children[0].position.start.column - 1;
          }
          function U(Q) {
            if (!Q.ordered)
              return !0;
            let [H, ge] = Q.children;
            if (p(H, B.originalText).leadingSpaces.length > 1)
              return !0;
            let y = _(H);
            if (y === -1)
              return !1;
            if (Q.children.length === 1)
              return y % B.tabWidth === 0;
            let R = _(ge);
            return y !== R ? !1 : y % B.tabWidth === 0 ? !0 : p(ge, B.originalText).leadingSpaces.length > 1;
          }
        }
        m.exports = u;
      } }), We = Ce({ "src/language-markdown/clean.js"(o, m) {
        Be();
        var t = ae(), { isFrontMatterNode: p } = yr(), { startWithPragma: c } = Ie(), e = /* @__PURE__ */ new Set(["position", "raw"]);
        function i(u, h, D) {
          if ((u.type === "front-matter" || u.type === "code" || u.type === "yaml" || u.type === "import" || u.type === "export" || u.type === "jsx") && delete h.value, u.type === "list" && delete h.isAligned, (u.type === "list" || u.type === "listItem") && (delete h.spread, delete h.loose), u.type === "text" || (u.type === "inlineCode" && (h.value = u.value.replace(/[\t\n ]+/g, " ")), u.type === "wikiLink" && (h.value = u.value.trim().replace(/[\t\n]+/g, " ")), (u.type === "definition" || u.type === "linkReference" || u.type === "imageReference") && (h.label = t(u.label)), (u.type === "definition" || u.type === "link" || u.type === "image") && u.title && (h.title = u.title.replace(/\\(["')])/g, "$1")), D && D.type === "root" && D.children.length > 0 && (D.children[0] === u || p(D.children[0]) && D.children[1] === u) && u.type === "html" && c(u.value)))
            return null;
        }
        i.ignoredProperties = e, m.exports = i;
      } }), Ft = Ce({ "src/language-markdown/printer-markdown.js"(o, m) {
        Be();
        var t = ae(), { getLast: p, getMinNotPresentContinuousCount: c, getMaxContinuousCount: e, getStringWidth: i, isNonEmptyArray: u } = yr(), { builders: { breakParent: h, join: D, line: E, literalline: C, markAsRoot: F, hardline: g, softline: b, ifBreak: T, fill: G, align: W, indent: B, group: _, hardlineWithoutBreakParent: U }, utils: { normalizeDoc: Q, replaceTextEndOfLine: H }, printer: { printDocToString: ge } } = sr(), y = le(), { insertPragma: R } = Ie(), { locStart: v, locEnd: S } = ue(), l = Me(), A = We(), { getFencedCodeBlockValue: w, hasGitDiffFriendlyOrderedList: I, splitText: O, punctuationPattern: M, INLINE_NODE_TYPES: ee, INLINE_NODE_WRAPPER_TYPES: pe, isAutolink: he } = De(), ce = /* @__PURE__ */ new Set(["importExport"]), xe = ["heading", "tableCell", "link", "wikiLink"], ie = /* @__PURE__ */ new Set(["listItem", "definition", "footnoteDefinition"]);
        function je(Xe, ye, tt) {
          let Te = Xe.getValue();
          if (ht(Xe))
            return O(ye.originalText.slice(Te.position.start.offset, Te.position.end.offset), ye).map((rt) => rt.type === "word" ? rt.value : rt.value === "" ? "" : me(Xe, rt.value, ye));
          switch (Te.type) {
            case "front-matter":
              return ye.originalText.slice(Te.position.start.offset, Te.position.end.offset);
            case "root":
              return Te.children.length === 0 ? "" : [Q(Qe(Xe, ye, tt)), ce.has(ke(Te).type) ? "" : g];
            case "paragraph":
              return Ze(Xe, ye, tt, { postprocessor: G });
            case "sentence":
              return Ze(Xe, ye, tt);
            case "word": {
              let rt = Te.value.replace(/\*/g, "\\$&").replace(new RegExp([`(^|${M})(_+)`, `(_+)(${M}|$)`].join("|"), "g"), (nt, N, Fe, Ue, yt) => (Fe ? `${N}${Fe}` : `${Ue}${yt}`).replace(/_/g, "\\_")), jt = (nt, N, Fe) => nt.type === "sentence" && Fe === 0, Ct = (nt, N, Fe) => he(nt.children[Fe - 1]);
              return rt !== Te.value && (Xe.match(void 0, jt, Ct) || Xe.match(void 0, jt, (nt, N, Fe) => nt.type === "emphasis" && Fe === 0, Ct)) && (rt = rt.replace(/^(\\?[*_])+/, (nt) => nt.replace(/\\/g, ""))), rt;
            }
            case "whitespace": {
              let rt = Xe.getParentNode(), jt = rt.children.indexOf(Te), Ct = rt.children[jt + 1], nt = Ct && /^>|^(?:[*+-]|#{1,6}|\d+[).])$/.test(Ct.value) ? "never" : ye.proseWrap;
              return me(Xe, Te.value, { proseWrap: nt });
            }
            case "emphasis": {
              let rt;
              if (he(Te.children[0]))
                rt = ye.originalText[Te.position.start.offset];
              else {
                let jt = Xe.getParentNode(), Ct = jt.children.indexOf(Te), nt = jt.children[Ct - 1], N = jt.children[Ct + 1];
                rt = nt && nt.type === "sentence" && nt.children.length > 0 && p(nt.children).type === "word" && !p(nt.children).hasTrailingPunctuation || N && N.type === "sentence" && N.children.length > 0 && N.children[0].type === "word" && !N.children[0].hasLeadingPunctuation || it(Xe, "emphasis") ? "*" : "_";
              }
              return [rt, Ze(Xe, ye, tt), rt];
            }
            case "strong":
              return ["**", Ze(Xe, ye, tt), "**"];
            case "delete":
              return ["~~", Ze(Xe, ye, tt), "~~"];
            case "inlineCode": {
              let rt = c(Te.value, "`"), jt = "`".repeat(rt || 1), Ct = rt && !/^\s/.test(Te.value) ? " " : "";
              return [jt, Ct, Te.value, Ct, jt];
            }
            case "wikiLink": {
              let rt = "";
              return ye.proseWrap === "preserve" ? rt = Te.value : rt = Te.value.replace(/[\t\n]+/g, " "), ["[[", rt, "]]"];
            }
            case "link":
              switch (ye.originalText[Te.position.start.offset]) {
                case "<": {
                  let rt = "mailto:";
                  return ["<", Te.url.startsWith(rt) && ye.originalText.slice(Te.position.start.offset + 1, Te.position.start.offset + 1 + rt.length) !== rt ? Te.url.slice(rt.length) : Te.url, ">"];
                }
                case "[":
                  return ["[", Ze(Xe, ye, tt), "](", vt(Te.url, ")"), Ut(Te.title, ye), ")"];
                default:
                  return ye.originalText.slice(Te.position.start.offset, Te.position.end.offset);
              }
            case "image":
              return ["![", Te.alt || "", "](", vt(Te.url, ")"), Ut(Te.title, ye), ")"];
            case "blockquote":
              return ["> ", W("> ", Ze(Xe, ye, tt))];
            case "heading":
              return ["#".repeat(Te.depth) + " ", Ze(Xe, ye, tt)];
            case "code": {
              if (Te.isIndented) {
                let Ct = " ".repeat(4);
                return W(Ct, [Ct, ...H(Te.value, g)]);
              }
              let rt = ye.__inJsTemplate ? "~" : "`", jt = rt.repeat(Math.max(3, e(Te.value, rt) + 1));
              return [jt, Te.lang || "", Te.meta ? " " + Te.meta : "", g, ...H(w(Te, ye.originalText), g), g, jt];
            }
            case "html": {
              let rt = Xe.getParentNode(), jt = rt.type === "root" && p(rt.children) === Te ? Te.value.trimEnd() : Te.value, Ct = /^<!--.*-->$/s.test(jt);
              return H(jt, Ct ? g : F(C));
            }
            case "list": {
              let rt = Ne(Te, Xe.getParentNode()), jt = I(Te, ye);
              return Ze(Xe, ye, tt, { processor: (Ct, nt) => {
                let N = Ue(), Fe = Ct.getValue();
                if (Fe.children.length === 2 && Fe.children[1].type === "html" && Fe.children[0].position.start.column !== Fe.children[1].position.start.column)
                  return [N, de(Ct, ye, tt, N)];
                return [N, W(" ".repeat(N.length), de(Ct, ye, tt, N))];
                function Ue() {
                  let yt = Te.ordered ? (nt === 0 ? Te.start : jt ? 1 : Te.start + nt) + (rt % 2 === 0 ? ". " : ") ") : rt % 2 === 0 ? "- " : "* ";
                  return Te.isAligned || Te.hasIndentedCodeblock ? oe(yt, ye) : yt;
                }
              } });
            }
            case "thematicBreak": {
              let rt = _e(Xe, "list");
              return rt === -1 ? "---" : Ne(Xe.getParentNode(rt), Xe.getParentNode(rt + 1)) % 2 === 0 ? "***" : "---";
            }
            case "linkReference":
              return ["[", Ze(Xe, ye, tt), "]", Te.referenceType === "full" ? Vt(Te) : Te.referenceType === "collapsed" ? "[]" : ""];
            case "imageReference":
              switch (Te.referenceType) {
                case "full":
                  return ["![", Te.alt || "", "]", Vt(Te)];
                default:
                  return ["![", Te.alt, "]", Te.referenceType === "collapsed" ? "[]" : ""];
              }
            case "definition": {
              let rt = ye.proseWrap === "always" ? E : " ";
              return _([Vt(Te), ":", B([rt, vt(Te.url), Te.title === null ? "" : [rt, Ut(Te.title, ye, !1)]])]);
            }
            case "footnote":
              return ["[^", Ze(Xe, ye, tt), "]"];
            case "footnoteReference":
              return Qt(Te);
            case "footnoteDefinition": {
              let rt = Xe.getParentNode().children[Xe.getName() + 1], jt = Te.children.length === 1 && Te.children[0].type === "paragraph" && (ye.proseWrap === "never" || ye.proseWrap === "preserve" && Te.children[0].position.start.line === Te.children[0].position.end.line);
              return [Qt(Te), ": ", jt ? Ze(Xe, ye, tt) : _([W(" ".repeat(4), Ze(Xe, ye, tt, { processor: (Ct, nt) => nt === 0 ? _([b, tt()]) : tt() })), rt && rt.type === "footnoteDefinition" ? b : ""])];
            }
            case "table":
              return Se(Xe, ye, tt);
            case "tableCell":
              return Ze(Xe, ye, tt);
            case "break":
              return /\s/.test(ye.originalText[Te.position.start.offset]) ? ["  ", F(C)] : ["\\", g];
            case "liquidNode":
              return H(Te.value, g);
            case "importExport":
              return [Te.value, g];
            case "esComment":
              return ["{/* ", Te.value, " */}"];
            case "jsx":
              return Te.value;
            case "math":
              return ["$$", g, Te.value ? [...H(Te.value, g), g] : "", "$$"];
            case "inlineMath":
              return ye.originalText.slice(v(Te), S(Te));
            case "tableRow":
            case "listItem":
            default:
              throw new Error(`Unknown markdown type ${JSON.stringify(Te.type)}`);
          }
        }
        function de(Xe, ye, tt, Te) {
          let rt = Xe.getValue(), jt = rt.checked === null ? "" : rt.checked ? "[x] " : "[ ] ";
          return [jt, Ze(Xe, ye, tt, { processor: (Ct, nt) => {
            if (nt === 0 && Ct.getValue().type !== "list")
              return W(" ".repeat(jt.length), tt());
            let N = " ".repeat(Dr(ye.tabWidth - Te.length, 0, 3));
            return [N, W(N, tt())];
          } })];
        }
        function oe(Xe, ye) {
          let tt = Te();
          return Xe + " ".repeat(tt >= 4 ? 0 : tt);
          function Te() {
            let rt = Xe.length % ye.tabWidth;
            return rt === 0 ? 0 : ye.tabWidth - rt;
          }
        }
        function Ne(Xe, ye) {
          return Je(Xe, ye, (tt) => tt.ordered === Xe.ordered);
        }
        function Je(Xe, ye, tt) {
          let Te = -1;
          for (let rt of ye.children)
            if (rt.type === Xe.type && tt(rt) ? Te++ : Te = -1, rt === Xe)
              return Te;
        }
        function _e(Xe, ye) {
          let tt = Array.isArray(ye) ? ye : [ye], Te = -1, rt;
          for (; rt = Xe.getParentNode(++Te); )
            if (tt.includes(rt.type))
              return Te;
          return -1;
        }
        function it(Xe, ye) {
          let tt = _e(Xe, ye);
          return tt === -1 ? null : Xe.getParentNode(tt);
        }
        function me(Xe, ye, tt) {
          if (tt.proseWrap === "preserve" && ye === `
`)
            return g;
          let Te = tt.proseWrap === "always" && !it(Xe, xe);
          return ye !== "" ? Te ? E : " " : Te ? b : "";
        }
        function Se(Xe, ye, tt) {
          let Te = Xe.getValue(), rt = [], jt = Xe.map((yt) => yt.map((Et, $t) => {
            let bt = ge(tt(), ye).formatted, Hr = i(bt);
            return rt[$t] = Math.max(rt[$t] || 3, Hr), { text: bt, width: Hr };
          }, "children"), "children"), Ct = N(!1);
          if (ye.proseWrap !== "never")
            return [h, Ct];
          let nt = N(!0);
          return [h, _(T(nt, Ct))];
          function N(yt) {
            let Et = [Ue(jt[0], yt), Fe(yt)];
            return jt.length > 1 && Et.push(D(U, jt.slice(1).map(($t) => Ue($t, yt)))), D(U, Et);
          }
          function Fe(yt) {
            return `| ${rt.map((Et, $t) => {
              let bt = Te.align[$t], Hr = bt === "center" || bt === "left" ? ":" : "-", Ot = bt === "center" || bt === "right" ? ":" : "-", Gr = yt ? "-" : "-".repeat(Et - 2);
              return `${Hr}${Gr}${Ot}`;
            }).join(" | ")} |`;
          }
          function Ue(yt, Et) {
            return `| ${yt.map(($t, bt) => {
              let { text: Hr, width: Ot } = $t;
              if (Et)
                return Hr;
              let Gr = rt[bt] - Ot, _t = Te.align[bt], nr = 0;
              _t === "right" ? nr = Gr : _t === "center" && (nr = Math.floor(Gr / 2));
              let gr = Gr - nr;
              return `${" ".repeat(nr)}${Hr}${" ".repeat(gr)}`;
            }).join(" | ")} |`;
          }
        }
        function Qe(Xe, ye, tt) {
          let Te = [], rt = null, { children: jt } = Xe.getValue();
          for (let [Ct, nt] of jt.entries())
            switch (be(nt)) {
              case "start":
                rt === null && (rt = { index: Ct, offset: nt.position.end.offset });
                break;
              case "end":
                rt !== null && (Te.push({ start: rt, end: { index: Ct, offset: nt.position.start.offset } }), rt = null);
                break;
            }
          return Ze(Xe, ye, tt, { processor: (Ct, nt) => {
            if (Te.length > 0) {
              let N = Te[0];
              if (nt === N.start.index)
                return [kt(jt[N.start.index]), ye.originalText.slice(N.start.offset, N.end.offset), kt(jt[N.end.index])];
              if (N.start.index < nt && nt < N.end.index)
                return !1;
              if (nt === N.end.index)
                return Te.shift(), !1;
            }
            return tt();
          } });
        }
        function Ze(Xe, ye, tt) {
          let Te = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, { postprocessor: rt } = Te, jt = Te.processor || (() => tt()), Ct = Xe.getValue(), nt = [], N;
          return Xe.each((Fe, Ue) => {
            let yt = Fe.getValue(), Et = jt(Fe, Ue);
            if (Et !== !1) {
              let $t = { parts: nt, prevNode: N, parentNode: Ct, options: ye };
              Oe(yt, $t) && (nt.push(g), N && ce.has(N.type) || (Re(yt, $t) || ut(yt, $t)) && nt.push(g), ut(yt, $t) && nt.push(g)), nt.push(Et), N = yt;
            }
          }, "children"), rt ? rt(nt) : nt;
        }
        function kt(Xe) {
          if (Xe.type === "html")
            return Xe.value;
          if (Xe.type === "paragraph" && Array.isArray(Xe.children) && Xe.children.length === 1 && Xe.children[0].type === "esComment")
            return ["{/* ", Xe.children[0].value, " */}"];
        }
        function ke(Xe) {
          let ye = Xe;
          for (; u(ye.children); )
            ye = p(ye.children);
          return ye;
        }
        function be(Xe) {
          let ye;
          if (Xe.type === "html")
            ye = Xe.value.match(/^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/);
          else {
            let tt;
            Xe.type === "esComment" ? tt = Xe : Xe.type === "paragraph" && Xe.children.length === 1 && Xe.children[0].type === "esComment" && (tt = Xe.children[0]), tt && (ye = tt.value.match(/^prettier-ignore(?:-(start|end))?$/));
          }
          return ye ? ye[1] || "next" : !1;
        }
        function Oe(Xe, ye) {
          let tt = ye.parts.length === 0, Te = ee.includes(Xe.type), rt = Xe.type === "html" && pe.includes(ye.parentNode.type);
          return !tt && !Te && !rt;
        }
        function Re(Xe, ye) {
          var tt, Te, rt;
          let jt = (ye.prevNode && ye.prevNode.type) === Xe.type && ie.has(Xe.type), Ct = ye.parentNode.type === "listItem" && !ye.parentNode.loose, nt = ((tt = ye.prevNode) === null || tt === void 0 ? void 0 : tt.type) === "listItem" && ye.prevNode.loose, N = be(ye.prevNode) === "next", Fe = Xe.type === "html" && ((Te = ye.prevNode) === null || Te === void 0 ? void 0 : Te.type) === "html" && ye.prevNode.position.end.line + 1 === Xe.position.start.line, Ue = Xe.type === "html" && ye.parentNode.type === "listItem" && ((rt = ye.prevNode) === null || rt === void 0 ? void 0 : rt.type) === "paragraph" && ye.prevNode.position.end.line + 1 === Xe.position.start.line;
          return nt || !(jt || Ct || N || Fe || Ue);
        }
        function ut(Xe, ye) {
          let tt = ye.prevNode && ye.prevNode.type === "list", Te = Xe.type === "code" && Xe.isIndented;
          return tt && Te;
        }
        function ht(Xe) {
          let ye = it(Xe, ["linkReference", "imageReference"]);
          return ye && (ye.type !== "linkReference" || ye.referenceType !== "full");
        }
        function vt(Xe) {
          let ye = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], tt = [" ", ...Array.isArray(ye) ? ye : [ye]];
          return new RegExp(tt.map((Te) => `\\${Te}`).join("|")).test(Xe) ? `<${Xe}>` : Xe;
        }
        function Ut(Xe, ye) {
          let tt = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
          if (!Xe)
            return "";
          if (tt)
            return " " + Ut(Xe, ye, !1);
          if (Xe = Xe.replace(/\\(["')])/g, "$1"), Xe.includes('"') && Xe.includes("'") && !Xe.includes(")"))
            return `(${Xe})`;
          let Te = Xe.split("'").length - 1, rt = Xe.split('"').length - 1, jt = Te > rt ? '"' : rt > Te || ye.singleQuote ? "'" : '"';
          return Xe = Xe.replace(/\\/, "\\\\"), Xe = Xe.replace(new RegExp(`(${jt})`, "g"), "\\$1"), `${jt}${Xe}${jt}`;
        }
        function Dr(Xe, ye, tt) {
          return Xe < ye ? ye : Xe > tt ? tt : Xe;
        }
        function mr(Xe) {
          let ye = Number(Xe.getName());
          if (ye === 0)
            return !1;
          let tt = Xe.getParentNode().children[ye - 1];
          return be(tt) === "next";
        }
        function Vt(Xe) {
          return `[${t(Xe.label)}]`;
        }
        function Qt(Xe) {
          return `[^${Xe.label}]`;
        }
        m.exports = { preprocess: l, print: je, embed: y, massageAstNode: A, hasPrettierIgnore: mr, insertPragma: R };
      } }), Pt = Ce({ "src/language-markdown/options.js"(o, m) {
        Be();
        var t = Ki();
        m.exports = { proseWrap: t.proseWrap, singleQuote: t.singleQuote };
      } }), Mt = Ce({ "src/language-markdown/parsers.js"() {
        Be();
      } }), rr = Ce({ "node_modules/linguist-languages/data/Markdown.json"(o, m) {
        m.exports = { name: "Markdown", type: "prose", color: "#083fa1", aliases: ["pandoc"], aceMode: "markdown", codemirrorMode: "gfm", codemirrorMimeType: "text/x-gfm", wrap: !0, extensions: [".md", ".livemd", ".markdown", ".mdown", ".mdwn", ".mdx", ".mkd", ".mkdn", ".mkdown", ".ronn", ".scd", ".workbook"], filenames: ["contents.lr"], tmScope: "source.gfm", languageId: 222 };
      } }), tr = Ce({ "src/language-markdown/index.js"(o, m) {
        Be();
        var t = bi(), p = Ft(), c = Pt(), e = Mt(), i = [t(rr(), (h) => ({ since: "1.8.0", parsers: ["markdown"], vscodeLanguageIds: ["markdown"], filenames: [...h.filenames, "README"], extensions: h.extensions.filter((D) => D !== ".mdx") })), t(rr(), () => ({ name: "MDX", since: "1.15.0", parsers: ["mdx"], vscodeLanguageIds: ["mdx"], filenames: [], extensions: [".mdx"] }))], u = { mdast: p };
        m.exports = { languages: i, options: c, printers: u, parsers: e };
      } }), pr = Ce({ "src/language-html/clean.js"(o, m) {
        Be();
        var { isFrontMatterNode: t } = yr(), p = /* @__PURE__ */ new Set(["sourceSpan", "startSourceSpan", "endSourceSpan", "nameSpan", "valueSpan"]);
        function c(e, i) {
          if (e.type === "text" || e.type === "comment" || t(e) || e.type === "yaml" || e.type === "toml")
            return null;
          e.type === "attribute" && delete i.value, e.type === "docType" && delete i.value;
        }
        c.ignoredProperties = p, m.exports = c;
      } }), er = Ce({ "src/language-html/constants.evaluate.js"(o, m) {
        m.exports = { CSS_DISPLAY_TAGS: { area: "none", base: "none", basefont: "none", datalist: "none", head: "none", link: "none", meta: "none", noembed: "none", noframes: "none", param: "block", rp: "none", script: "block", source: "block", style: "none", template: "inline", track: "block", title: "none", html: "block", body: "block", address: "block", blockquote: "block", center: "block", div: "block", figure: "block", figcaption: "block", footer: "block", form: "block", header: "block", hr: "block", legend: "block", listing: "block", main: "block", p: "block", plaintext: "block", pre: "block", xmp: "block", slot: "contents", ruby: "ruby", rt: "ruby-text", article: "block", aside: "block", h1: "block", h2: "block", h3: "block", h4: "block", h5: "block", h6: "block", hgroup: "block", nav: "block", section: "block", dir: "block", dd: "block", dl: "block", dt: "block", ol: "block", ul: "block", li: "list-item", table: "table", caption: "table-caption", colgroup: "table-column-group", col: "table-column", thead: "table-header-group", tbody: "table-row-group", tfoot: "table-footer-group", tr: "table-row", td: "table-cell", th: "table-cell", fieldset: "block", button: "inline-block", details: "block", summary: "block", dialog: "block", meter: "inline-block", progress: "inline-block", object: "inline-block", video: "inline-block", audio: "inline-block", select: "inline-block", option: "block", optgroup: "block" }, CSS_DISPLAY_DEFAULT: "inline", CSS_WHITE_SPACE_TAGS: { listing: "pre", plaintext: "pre", pre: "pre", xmp: "pre", nobr: "nowrap", table: "initial", textarea: "pre-wrap" }, CSS_WHITE_SPACE_DEFAULT: "normal" };
      } }), ir = Ce({ "src/language-html/utils/is-unknown-namespace.js"(o, m) {
        Be();
        function t(p) {
          return p.type === "element" && !p.hasExplicitNamespace && !["html", "svg"].includes(p.namespace);
        }
        m.exports = t;
      } }), At = Ce({ "src/language-html/utils/index.js"(o, m) {
        Be();
        var { inferParserByLanguage: t, isFrontMatterNode: p } = yr(), { builders: { line: c, hardline: e, join: i }, utils: { getDocParts: u, replaceTextEndOfLine: h } } = sr(), { CSS_DISPLAY_TAGS: D, CSS_DISPLAY_DEFAULT: E, CSS_WHITE_SPACE_TAGS: C, CSS_WHITE_SPACE_DEFAULT: F } = er(), g = ir(), b = /* @__PURE__ */ new Set(["	", `
`, "\f", "\r", " "]), T = (N) => N.replace(/^[\t\n\f\r ]+/, ""), G = (N) => N.replace(/[\t\n\f\r ]+$/, ""), W = (N) => T(G(N)), B = (N) => N.replace(/^[\t\f\r ]*\n/g, ""), _ = (N) => B(G(N)), U = (N) => N.split(/[\t\n\f\r ]+/), Q = (N) => N.match(/^[\t\n\f\r ]*/)[0], H = (N) => {
          let [, Fe, Ue, yt] = N.match(/^([\t\n\f\r ]*)(.*?)([\t\n\f\r ]*)$/s);
          return { leadingWhitespace: Fe, trailingWhitespace: yt, text: Ue };
        }, ge = (N) => /[\t\n\f\r ]/.test(N);
        function y(N, Fe) {
          return !!(N.type === "ieConditionalComment" && N.lastChild && !N.lastChild.isSelfClosing && !N.lastChild.endSourceSpan || N.type === "ieConditionalComment" && !N.complete || Re(N) && N.children.some((Ue) => Ue.type !== "text" && Ue.type !== "interpolation") || Te(N, Fe) && !l(N) && N.type !== "interpolation");
        }
        function R(N) {
          return N.type === "attribute" || !N.parent || !N.prev ? !1 : v(N.prev);
        }
        function v(N) {
          return N.type === "comment" && N.value.trim() === "prettier-ignore";
        }
        function S(N) {
          return N.type === "text" || N.type === "comment";
        }
        function l(N) {
          return N.type === "element" && (N.fullName === "script" || N.fullName === "style" || N.fullName === "svg:style" || g(N) && (N.name === "script" || N.name === "style"));
        }
        function A(N) {
          return N.children && !l(N);
        }
        function w(N) {
          return l(N) || N.type === "interpolation" || I(N);
        }
        function I(N) {
          return Ut(N).startsWith("pre");
        }
        function O(N, Fe) {
          let Ue = yt();
          if (Ue && !N.prev && N.parent && N.parent.tagDefinition && N.parent.tagDefinition.ignoreFirstLf)
            return N.type === "interpolation";
          return Ue;
          function yt() {
            return p(N) ? !1 : (N.type === "text" || N.type === "interpolation") && N.prev && (N.prev.type === "text" || N.prev.type === "interpolation") ? !0 : !N.parent || N.parent.cssDisplay === "none" ? !1 : Re(N.parent) ? !0 : !(!N.prev && (N.parent.type === "root" || Re(N) && N.parent || l(N.parent) || ye(N.parent, Fe) || !Ze(N.parent.cssDisplay)) || N.prev && !be(N.prev.cssDisplay));
          }
        }
        function M(N, Fe) {
          return p(N) ? !1 : (N.type === "text" || N.type === "interpolation") && N.next && (N.next.type === "text" || N.next.type === "interpolation") ? !0 : !N.parent || N.parent.cssDisplay === "none" ? !1 : Re(N.parent) ? !0 : !(!N.next && (N.parent.type === "root" || Re(N) && N.parent || l(N.parent) || ye(N.parent, Fe) || !kt(N.parent.cssDisplay)) || N.next && !ke(N.next.cssDisplay));
        }
        function ee(N) {
          return Oe(N.cssDisplay) && !l(N);
        }
        function pe(N) {
          return p(N) || N.next && N.sourceSpan.end && N.sourceSpan.end.line + 1 < N.next.sourceSpan.start.line;
        }
        function he(N) {
          return ce(N) || N.type === "element" && N.children.length > 0 && (["body", "script", "style"].includes(N.name) || N.children.some((Fe) => _e(Fe))) || N.firstChild && N.firstChild === N.lastChild && N.firstChild.type !== "text" && de(N.firstChild) && (!N.lastChild.isTrailingSpaceSensitive || oe(N.lastChild));
        }
        function ce(N) {
          return N.type === "element" && N.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(N.name) || N.cssDisplay.startsWith("table") && N.cssDisplay !== "table-cell");
        }
        function xe(N) {
          return Ne(N) || N.prev && ie(N.prev) || je(N);
        }
        function ie(N) {
          return Ne(N) || N.type === "element" && N.fullName === "br" || je(N);
        }
        function je(N) {
          return de(N) && oe(N);
        }
        function de(N) {
          return N.hasLeadingSpaces && (N.prev ? N.prev.sourceSpan.end.line < N.sourceSpan.start.line : N.parent.type === "root" || N.parent.startSourceSpan.end.line < N.sourceSpan.start.line);
        }
        function oe(N) {
          return N.hasTrailingSpaces && (N.next ? N.next.sourceSpan.start.line > N.sourceSpan.end.line : N.parent.type === "root" || N.parent.endSourceSpan && N.parent.endSourceSpan.start.line > N.sourceSpan.end.line);
        }
        function Ne(N) {
          switch (N.type) {
            case "ieConditionalComment":
            case "comment":
            case "directive":
              return !0;
            case "element":
              return ["script", "select"].includes(N.name);
          }
          return !1;
        }
        function Je(N) {
          return N.lastChild ? Je(N.lastChild) : N;
        }
        function _e(N) {
          return N.children && N.children.some((Fe) => Fe.type !== "text");
        }
        function it(N) {
          let { type: Fe, lang: Ue } = N.attrMap;
          if (Fe === "module" || Fe === "text/javascript" || Fe === "text/babel" || Fe === "application/javascript" || Ue === "jsx")
            return "babel";
          if (Fe === "application/x-typescript" || Ue === "ts" || Ue === "tsx")
            return "typescript";
          if (Fe === "text/markdown")
            return "markdown";
          if (Fe === "text/html")
            return "html";
          if (Fe && (Fe.endsWith("json") || Fe.endsWith("importmap")) || Fe === "speculationrules")
            return "json";
          if (Fe === "text/x-handlebars-template")
            return "glimmer";
        }
        function me(N, Fe) {
          let { lang: Ue } = N.attrMap;
          if (!Ue || Ue === "postcss" || Ue === "css")
            return "css";
          if (Ue === "scss")
            return "scss";
          if (Ue === "less")
            return "less";
          if (Ue === "stylus")
            return t("stylus", Fe);
        }
        function Se(N, Fe) {
          if (N.name === "script" && !N.attrMap.src)
            return !N.attrMap.lang && !N.attrMap.type ? "babel" : it(N);
          if (N.name === "style")
            return me(N, Fe);
          if (Fe && Te(N, Fe))
            return it(N) || !("src" in N.attrMap) && t(N.attrMap.lang, Fe);
        }
        function Qe(N) {
          return N === "block" || N === "list-item" || N.startsWith("table");
        }
        function Ze(N) {
          return !Qe(N) && N !== "inline-block";
        }
        function kt(N) {
          return !Qe(N) && N !== "inline-block";
        }
        function ke(N) {
          return !Qe(N);
        }
        function be(N) {
          return !Qe(N);
        }
        function Oe(N) {
          return !Qe(N) && N !== "inline-block";
        }
        function Re(N) {
          return Ut(N).startsWith("pre");
        }
        function ut(N, Fe) {
          let Ue = 0;
          for (let yt = N.stack.length - 1; yt >= 0; yt--) {
            let Et = N.stack[yt];
            Et && typeof Et == "object" && !Array.isArray(Et) && Fe(Et) && Ue++;
          }
          return Ue;
        }
        function ht(N, Fe) {
          let Ue = N;
          for (; Ue; ) {
            if (Fe(Ue))
              return !0;
            Ue = Ue.parent;
          }
          return !1;
        }
        function vt(N, Fe) {
          if (N.prev && N.prev.type === "comment") {
            let yt = N.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/);
            if (yt)
              return yt[1];
          }
          let Ue = !1;
          if (N.type === "element" && N.namespace === "svg")
            if (ht(N, (yt) => yt.fullName === "svg:foreignObject"))
              Ue = !0;
            else
              return N.name === "svg" ? "inline-block" : "block";
          switch (Fe.htmlWhitespaceSensitivity) {
            case "strict":
              return "inline";
            case "ignore":
              return "block";
            default:
              return Fe.parser === "vue" && N.parent && N.parent.type === "root" ? "block" : N.type === "element" && (!N.namespace || Ue || g(N)) && D[N.name] || E;
          }
        }
        function Ut(N) {
          return N.type === "element" && (!N.namespace || g(N)) && C[N.name] || F;
        }
        function Dr(N) {
          let Fe = Number.POSITIVE_INFINITY;
          for (let Ue of N.split(`
`)) {
            if (Ue.length === 0)
              continue;
            if (!b.has(Ue[0]))
              return 0;
            let yt = Q(Ue).length;
            Ue.length !== yt && yt < Fe && (Fe = yt);
          }
          return Fe === Number.POSITIVE_INFINITY ? 0 : Fe;
        }
        function mr(N) {
          let Fe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Dr(N);
          return Fe === 0 ? N : N.split(`
`).map((Ue) => Ue.slice(Fe)).join(`
`);
        }
        function Vt(N, Fe) {
          let Ue = 0;
          for (let yt = 0; yt < N.length; yt++)
            N[yt] === Fe && Ue++;
          return Ue;
        }
        function Qt(N) {
          return N.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
        }
        var Xe = /* @__PURE__ */ new Set(["template", "style", "script"]);
        function ye(N, Fe) {
          return tt(N, Fe) && !Xe.has(N.fullName);
        }
        function tt(N, Fe) {
          return Fe.parser === "vue" && N.type === "element" && N.parent.type === "root" && N.fullName.toLowerCase() !== "html";
        }
        function Te(N, Fe) {
          return tt(N, Fe) && (ye(N, Fe) || N.attrMap.lang && N.attrMap.lang !== "html");
        }
        function rt(N) {
          let Fe = N.fullName;
          return Fe.charAt(0) === "#" || Fe === "slot-scope" || Fe === "v-slot" || Fe.startsWith("v-slot:");
        }
        function jt(N, Fe) {
          let Ue = N.parent;
          if (!tt(Ue, Fe))
            return !1;
          let yt = Ue.fullName, Et = N.fullName;
          return yt === "script" && Et === "setup" || yt === "style" && Et === "vars";
        }
        function Ct(N) {
          let Fe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : N.value;
          return N.parent.isWhitespaceSensitive ? N.parent.isIndentationSensitive ? h(Fe) : h(mr(_(Fe)), e) : u(i(c, U(Fe)));
        }
        function nt(N, Fe) {
          return tt(N, Fe) && N.name === "script";
        }
        m.exports = { htmlTrim: W, htmlTrimPreserveIndentation: _, hasHtmlWhitespace: ge, getLeadingAndTrailingHtmlWhitespace: H, canHaveInterpolation: A, countChars: Vt, countParents: ut, dedentString: mr, forceBreakChildren: ce, forceBreakContent: he, forceNextEmptyLine: pe, getLastDescendant: Je, getNodeCssStyleDisplay: vt, getNodeCssStyleWhiteSpace: Ut, hasPrettierIgnore: R, inferScriptParser: Se, isVueCustomBlock: ye, isVueNonHtmlBlock: Te, isVueScriptTag: nt, isVueSlotAttribute: rt, isVueSfcBindingsAttribute: jt, isVueSfcBlock: tt, isDanglingSpaceSensitiveNode: ee, isIndentationSensitiveNode: I, isLeadingSpaceSensitiveNode: O, isPreLikeNode: Re, isScriptLikeTag: l, isTextLikeNode: S, isTrailingSpaceSensitiveNode: M, isWhitespaceSensitiveNode: w, isUnknownNamespace: g, preferHardlineAsLeadingSpaces: xe, preferHardlineAsTrailingSpaces: ie, shouldPreserveContent: y, unescapeQuoteEntities: Qt, getTextValueParts: Ct };
      } }), gt = Ce({ "node_modules/angular-html-parser/lib/compiler/src/chars.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 }), o.$EOF = 0, o.$BSPACE = 8, o.$TAB = 9, o.$LF = 10, o.$VTAB = 11, o.$FF = 12, o.$CR = 13, o.$SPACE = 32, o.$BANG = 33, o.$DQ = 34, o.$HASH = 35, o.$$ = 36, o.$PERCENT = 37, o.$AMPERSAND = 38, o.$SQ = 39, o.$LPAREN = 40, o.$RPAREN = 41, o.$STAR = 42, o.$PLUS = 43, o.$COMMA = 44, o.$MINUS = 45, o.$PERIOD = 46, o.$SLASH = 47, o.$COLON = 58, o.$SEMICOLON = 59, o.$LT = 60, o.$EQ = 61, o.$GT = 62, o.$QUESTION = 63, o.$0 = 48, o.$7 = 55, o.$9 = 57, o.$A = 65, o.$E = 69, o.$F = 70, o.$X = 88, o.$Z = 90, o.$LBRACKET = 91, o.$BACKSLASH = 92, o.$RBRACKET = 93, o.$CARET = 94, o.$_ = 95, o.$a = 97, o.$b = 98, o.$e = 101, o.$f = 102, o.$n = 110, o.$r = 114, o.$t = 116, o.$u = 117, o.$v = 118, o.$x = 120, o.$z = 122, o.$LBRACE = 123, o.$BAR = 124, o.$RBRACE = 125, o.$NBSP = 160, o.$PIPE = 124, o.$TILDA = 126, o.$AT = 64, o.$BT = 96;
        function m(u) {
          return u >= o.$TAB && u <= o.$SPACE || u == o.$NBSP;
        }
        o.isWhitespace = m;
        function t(u) {
          return o.$0 <= u && u <= o.$9;
        }
        o.isDigit = t;
        function p(u) {
          return u >= o.$a && u <= o.$z || u >= o.$A && u <= o.$Z;
        }
        o.isAsciiLetter = p;
        function c(u) {
          return u >= o.$a && u <= o.$f || u >= o.$A && u <= o.$F || t(u);
        }
        o.isAsciiHexDigit = c;
        function e(u) {
          return u === o.$LF || u === o.$CR;
        }
        o.isNewLine = e;
        function i(u) {
          return o.$0 <= u && u <= o.$7;
        }
        o.isOctalDigit = i;
      } }), Nt = Ce({ "node_modules/angular-html-parser/lib/compiler/src/aot/static_symbol.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = class {
          constructor(p, c, e) {
            this.filePath = p, this.name = c, this.members = e;
          }
          assertNoMembers() {
            if (this.members.length)
              throw new Error(`Illegal state: symbol without members expected, but got ${JSON.stringify(this)}.`);
          }
        };
        o.StaticSymbol = m;
        var t = class {
          constructor() {
            this.cache = /* @__PURE__ */ new Map();
          }
          get(p, c, e) {
            e = e || [];
            let i = e.length ? `.${e.join(".")}` : "", u = `"${p}".${c}${i}`, h = this.cache.get(u);
            return h || (h = new m(p, c, e), this.cache.set(u, h)), h;
          }
        };
        o.StaticSymbolCache = t;
      } }), mt = Ce({ "node_modules/angular-html-parser/lib/compiler/src/util.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = /-+([a-z0-9])/g;
        function t(l) {
          return l.replace(m, function() {
            for (var A = arguments.length, w = new Array(A), I = 0; I < A; I++)
              w[I] = arguments[I];
            return w[1].toUpperCase();
          });
        }
        o.dashCaseToCamelCase = t;
        function p(l, A) {
          return e(l, ":", A);
        }
        o.splitAtColon = p;
        function c(l, A) {
          return e(l, ".", A);
        }
        o.splitAtPeriod = c;
        function e(l, A, w) {
          let I = l.indexOf(A);
          return I == -1 ? w : [l.slice(0, I).trim(), l.slice(I + 1).trim()];
        }
        function i(l, A, w) {
          return Array.isArray(l) ? A.visitArray(l, w) : B(l) ? A.visitStringMap(l, w) : l == null || typeof l == "string" || typeof l == "number" || typeof l == "boolean" ? A.visitPrimitive(l, w) : A.visitOther(l, w);
        }
        o.visitValue = i;
        function u(l) {
          return l != null;
        }
        o.isDefined = u;
        function h(l) {
          return l === void 0 ? null : l;
        }
        o.noUndefined = h;
        var D = class {
          visitArray(l, A) {
            return l.map((w) => i(w, this, A));
          }
          visitStringMap(l, A) {
            let w = {};
            return Object.keys(l).forEach((I) => {
              w[I] = i(l[I], this, A);
            }), w;
          }
          visitPrimitive(l, A) {
            return l;
          }
          visitOther(l, A) {
            return l;
          }
        };
        o.ValueTransformer = D, o.SyncAsync = { assertSync: (l) => {
          if (H(l))
            throw new Error("Illegal state: value cannot be a promise");
          return l;
        }, then: (l, A) => H(l) ? l.then(A) : A(l), all: (l) => l.some(H) ? Promise.all(l) : l };
        function E(l) {
          throw new Error(`Internal Error: ${l}`);
        }
        o.error = E;
        function C(l, A) {
          let w = Error(l);
          return w[F] = !0, A && (w[g] = A), w;
        }
        o.syntaxError = C;
        var F = "ngSyntaxError", g = "ngParseErrors";
        function b(l) {
          return l[F];
        }
        o.isSyntaxError = b;
        function T(l) {
          return l[g] || [];
        }
        o.getParseErrors = T;
        function G(l) {
          return l.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        }
        o.escapeRegExp = G;
        var W = Object.getPrototypeOf({});
        function B(l) {
          return typeof l == "object" && l !== null && Object.getPrototypeOf(l) === W;
        }
        function _(l) {
          let A = "";
          for (let w = 0; w < l.length; w++) {
            let I = l.charCodeAt(w);
            if (I >= 55296 && I <= 56319 && l.length > w + 1) {
              let O = l.charCodeAt(w + 1);
              O >= 56320 && O <= 57343 && (w++, I = (I - 55296 << 10) + O - 56320 + 65536);
            }
            I <= 127 ? A += String.fromCharCode(I) : I <= 2047 ? A += String.fromCharCode(I >> 6 & 31 | 192, I & 63 | 128) : I <= 65535 ? A += String.fromCharCode(I >> 12 | 224, I >> 6 & 63 | 128, I & 63 | 128) : I <= 2097151 && (A += String.fromCharCode(I >> 18 & 7 | 240, I >> 12 & 63 | 128, I >> 6 & 63 | 128, I & 63 | 128));
          }
          return A;
        }
        o.utf8Encode = _;
        function U(l) {
          if (typeof l == "string")
            return l;
          if (l instanceof Array)
            return "[" + l.map(U).join(", ") + "]";
          if (l == null)
            return "" + l;
          if (l.overriddenName)
            return `${l.overriddenName}`;
          if (l.name)
            return `${l.name}`;
          if (!l.toString)
            return "object";
          let A = l.toString();
          if (A == null)
            return "" + A;
          let w = A.indexOf(`
`);
          return w === -1 ? A : A.substring(0, w);
        }
        o.stringify = U;
        function Q(l) {
          return typeof l == "function" && l.hasOwnProperty("__forward_ref__") ? l() : l;
        }
        o.resolveForwardRef = Q;
        function H(l) {
          return !!l && typeof l.then == "function";
        }
        o.isPromise = H;
        var ge = class {
          constructor(l) {
            this.full = l;
            let A = l.split(".");
            this.major = A[0], this.minor = A[1], this.patch = A.slice(2).join(".");
          }
        };
        o.Version = ge;
        var y = typeof window < "u" && window, R = typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self, v = typeof globalThis < "u" && globalThis, S = v || y || R;
        o.global = S;
      } }), Zr = Ce({ "node_modules/angular-html-parser/lib/compiler/src/compile_metadata.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = Nt(), t = mt(), p = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
        function c(w) {
          return w.replace(/\W/g, "_");
        }
        o.sanitizeIdentifier = c;
        var e = 0;
        function i(w) {
          if (!w || !w.reference)
            return null;
          let I = w.reference;
          if (I instanceof m.StaticSymbol)
            return I.name;
          if (I.__anonymousType)
            return I.__anonymousType;
          let O = t.stringify(I);
          return O.indexOf("(") >= 0 ? (O = `anonymous_${e++}`, I.__anonymousType = O) : O = c(O), O;
        }
        o.identifierName = i;
        function u(w) {
          let I = w.reference;
          return I instanceof m.StaticSymbol ? I.filePath : `./${t.stringify(I)}`;
        }
        o.identifierModuleUrl = u;
        function h(w, I) {
          return `View_${i({ reference: w })}_${I}`;
        }
        o.viewClassName = h;
        function D(w) {
          return `RenderType_${i({ reference: w })}`;
        }
        o.rendererTypeName = D;
        function E(w) {
          return `HostView_${i({ reference: w })}`;
        }
        o.hostViewClassName = E;
        function C(w) {
          return `${i({ reference: w })}NgFactory`;
        }
        o.componentFactoryName = C;
        var F;
        (function(w) {
          w[w.Pipe = 0] = "Pipe", w[w.Directive = 1] = "Directive", w[w.NgModule = 2] = "NgModule", w[w.Injectable = 3] = "Injectable";
        })(F = o.CompileSummaryKind || (o.CompileSummaryKind = {}));
        function g(w) {
          return w.value != null ? c(w.value) : i(w.identifier);
        }
        o.tokenName = g;
        function b(w) {
          return w.identifier != null ? w.identifier.reference : w.value;
        }
        o.tokenReference = b;
        var T = class {
          constructor() {
            let { moduleUrl: w, styles: I, styleUrls: O } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            this.moduleUrl = w || null, this.styles = H(I), this.styleUrls = H(O);
          }
        };
        o.CompileStylesheetMetadata = T;
        var G = class {
          constructor(w) {
            let { encapsulation: I, template: O, templateUrl: M, htmlAst: ee, styles: pe, styleUrls: he, externalStylesheets: ce, animations: xe, ngContentSelectors: ie, interpolation: je, isInline: de, preserveWhitespaces: oe } = w;
            if (this.encapsulation = I, this.template = O, this.templateUrl = M, this.htmlAst = ee, this.styles = H(pe), this.styleUrls = H(he), this.externalStylesheets = H(ce), this.animations = xe ? y(xe) : [], this.ngContentSelectors = ie || [], je && je.length != 2)
              throw new Error("'interpolation' should have a start and an end symbol.");
            this.interpolation = je, this.isInline = de, this.preserveWhitespaces = oe;
          }
          toSummary() {
            return { ngContentSelectors: this.ngContentSelectors, encapsulation: this.encapsulation, styles: this.styles, animations: this.animations };
          }
        };
        o.CompileTemplateMetadata = G;
        var W = class {
          static create(w) {
            let { isHost: I, type: O, isComponent: M, selector: ee, exportAs: pe, changeDetection: he, inputs: ce, outputs: xe, host: ie, providers: je, viewProviders: de, queries: oe, guards: Ne, viewQueries: Je, entryComponents: _e, template: it, componentViewType: me, rendererType: Se, componentFactory: Qe } = w, Ze = {}, kt = {}, ke = {};
            ie != null && Object.keys(ie).forEach((Re) => {
              let ut = ie[Re], ht = Re.match(p);
              ht === null ? ke[Re] = ut : ht[1] != null ? kt[ht[1]] = ut : ht[2] != null && (Ze[ht[2]] = ut);
            });
            let be = {};
            ce != null && ce.forEach((Re) => {
              let ut = t.splitAtColon(Re, [Re, Re]);
              be[ut[0]] = ut[1];
            });
            let Oe = {};
            return xe != null && xe.forEach((Re) => {
              let ut = t.splitAtColon(Re, [Re, Re]);
              Oe[ut[0]] = ut[1];
            }), new W({ isHost: I, type: O, isComponent: !!M, selector: ee, exportAs: pe, changeDetection: he, inputs: be, outputs: Oe, hostListeners: Ze, hostProperties: kt, hostAttributes: ke, providers: je, viewProviders: de, queries: oe, guards: Ne, viewQueries: Je, entryComponents: _e, template: it, componentViewType: me, rendererType: Se, componentFactory: Qe });
          }
          constructor(w) {
            let { isHost: I, type: O, isComponent: M, selector: ee, exportAs: pe, changeDetection: he, inputs: ce, outputs: xe, hostListeners: ie, hostProperties: je, hostAttributes: de, providers: oe, viewProviders: Ne, queries: Je, guards: _e, viewQueries: it, entryComponents: me, template: Se, componentViewType: Qe, rendererType: Ze, componentFactory: kt } = w;
            this.isHost = !!I, this.type = O, this.isComponent = M, this.selector = ee, this.exportAs = pe, this.changeDetection = he, this.inputs = ce, this.outputs = xe, this.hostListeners = ie, this.hostProperties = je, this.hostAttributes = de, this.providers = H(oe), this.viewProviders = H(Ne), this.queries = H(Je), this.guards = _e, this.viewQueries = H(it), this.entryComponents = H(me), this.template = Se, this.componentViewType = Qe, this.rendererType = Ze, this.componentFactory = kt;
          }
          toSummary() {
            return { summaryKind: F.Directive, type: this.type, isComponent: this.isComponent, selector: this.selector, exportAs: this.exportAs, inputs: this.inputs, outputs: this.outputs, hostListeners: this.hostListeners, hostProperties: this.hostProperties, hostAttributes: this.hostAttributes, providers: this.providers, viewProviders: this.viewProviders, queries: this.queries, guards: this.guards, viewQueries: this.viewQueries, entryComponents: this.entryComponents, changeDetection: this.changeDetection, template: this.template && this.template.toSummary(), componentViewType: this.componentViewType, rendererType: this.rendererType, componentFactory: this.componentFactory };
          }
        };
        o.CompileDirectiveMetadata = W;
        var B = class {
          constructor(w) {
            let { type: I, name: O, pure: M } = w;
            this.type = I, this.name = O, this.pure = !!M;
          }
          toSummary() {
            return { summaryKind: F.Pipe, type: this.type, name: this.name, pure: this.pure };
          }
        };
        o.CompilePipeMetadata = B;
        var _ = class {
        };
        o.CompileShallowModuleMetadata = _;
        var U = class {
          constructor(w) {
            let { type: I, providers: O, declaredDirectives: M, exportedDirectives: ee, declaredPipes: pe, exportedPipes: he, entryComponents: ce, bootstrapComponents: xe, importedModules: ie, exportedModules: je, schemas: de, transitiveModule: oe, id: Ne } = w;
            this.type = I || null, this.declaredDirectives = H(M), this.exportedDirectives = H(ee), this.declaredPipes = H(pe), this.exportedPipes = H(he), this.providers = H(O), this.entryComponents = H(ce), this.bootstrapComponents = H(xe), this.importedModules = H(ie), this.exportedModules = H(je), this.schemas = H(de), this.id = Ne || null, this.transitiveModule = oe || null;
          }
          toSummary() {
            let w = this.transitiveModule;
            return { summaryKind: F.NgModule, type: this.type, entryComponents: w.entryComponents, providers: w.providers, modules: w.modules, exportedDirectives: w.exportedDirectives, exportedPipes: w.exportedPipes };
          }
        };
        o.CompileNgModuleMetadata = U;
        var Q = class {
          constructor() {
            this.directivesSet = /* @__PURE__ */ new Set(), this.directives = [], this.exportedDirectivesSet = /* @__PURE__ */ new Set(), this.exportedDirectives = [], this.pipesSet = /* @__PURE__ */ new Set(), this.pipes = [], this.exportedPipesSet = /* @__PURE__ */ new Set(), this.exportedPipes = [], this.modulesSet = /* @__PURE__ */ new Set(), this.modules = [], this.entryComponentsSet = /* @__PURE__ */ new Set(), this.entryComponents = [], this.providers = [];
          }
          addProvider(w, I) {
            this.providers.push({ provider: w, module: I });
          }
          addDirective(w) {
            this.directivesSet.has(w.reference) || (this.directivesSet.add(w.reference), this.directives.push(w));
          }
          addExportedDirective(w) {
            this.exportedDirectivesSet.has(w.reference) || (this.exportedDirectivesSet.add(w.reference), this.exportedDirectives.push(w));
          }
          addPipe(w) {
            this.pipesSet.has(w.reference) || (this.pipesSet.add(w.reference), this.pipes.push(w));
          }
          addExportedPipe(w) {
            this.exportedPipesSet.has(w.reference) || (this.exportedPipesSet.add(w.reference), this.exportedPipes.push(w));
          }
          addModule(w) {
            this.modulesSet.has(w.reference) || (this.modulesSet.add(w.reference), this.modules.push(w));
          }
          addEntryComponent(w) {
            this.entryComponentsSet.has(w.componentType) || (this.entryComponentsSet.add(w.componentType), this.entryComponents.push(w));
          }
        };
        o.TransitiveCompileNgModuleMetadata = Q;
        function H(w) {
          return w || [];
        }
        var ge = class {
          constructor(w, I) {
            let { useClass: O, useValue: M, useExisting: ee, useFactory: pe, deps: he, multi: ce } = I;
            this.token = w, this.useClass = O || null, this.useValue = M, this.useExisting = ee, this.useFactory = pe || null, this.dependencies = he || null, this.multi = !!ce;
          }
        };
        o.ProviderMeta = ge;
        function y(w) {
          return w.reduce((I, O) => {
            let M = Array.isArray(O) ? y(O) : O;
            return I.concat(M);
          }, []);
        }
        o.flatten = y;
        function R(w) {
          return w.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, "ng:///");
        }
        function v(w, I, O) {
          let M;
          return O.isInline ? I.type.reference instanceof m.StaticSymbol ? M = `${I.type.reference.filePath}.${I.type.reference.name}.html` : M = `${i(w)}/${i(I.type)}.html` : M = O.templateUrl, I.type.reference instanceof m.StaticSymbol ? M : R(M);
        }
        o.templateSourceUrl = v;
        function S(w, I) {
          let O = w.moduleUrl.split(/\/\\/g), M = O[O.length - 1];
          return R(`css/${I}${M}.ngstyle.js`);
        }
        o.sharedStylesheetJitUrl = S;
        function l(w) {
          return R(`${i(w.type)}/module.ngfactory.js`);
        }
        o.ngModuleJitUrl = l;
        function A(w, I) {
          return R(`${i(w)}/${i(I.type)}.ngfactory.js`);
        }
        o.templateJitUrl = A;
      } }), Or = Ce({ "node_modules/angular-html-parser/lib/compiler/src/parse_util.js"(o) {
        Be(), Object.defineProperty(o, "__esModule", { value: !0 });
        var m = gt(), t = Zr(), p = class {
          constructor(E, C, F, g) {
            this.file = E, this.offset = C, this.line = F, this.col = g;
          }
          toString() {
            return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
          }
          moveBy(E) {
            let C = this.file.content, F = C.length, g = this.offset, b = this.line, T = this.col;
            for (; g > 0 && E < 0; )
              if (g--, E++, C.charCodeAt(g) == m.$LF) {
                b--;
                let G = C.substr(0, g - 1).lastIndexOf(String.fromCharCode(m.$LF));
                T = G > 0 ? g - G : g;
              } else
                T--;
            for (; g < F && E > 0; ) {
              let G = C.charCodeAt(g);
              g++, E--, G == m.$LF ? (b++, T = 0) : T++;
            }
            return new p(this.file, g, b, T);
          }
          getContext(E, C) {
            let F = this.file.content, g = this.offset;
            if (g != null) {
              g > F.length - 1 && (g = F.length - 1);
              let b = g, T = 0, G = 0;
              for (; T < E && g > 0 && (g--, T++, !(F[g] == `
` && ++G == C)); )
                ;
              for (T = 0, G = 0; T < E && b < F.length - 1 && (b++, T++, !(F[b] == `
` && ++G == C)); )
                ;
              return { before: F.substring(g, this.offset), after: F.substring(this.offset, b + 1) };
            }
            return null;
          }
        };
        o.ParseLocation = p;
        var c = class {
          constructor(E, C) {
            this.content = E, this.url = C;
          }
        };
        o.ParseSourceFile = c;
        var e = class {
          constructor(E, C) {
            let F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
            this.start = E, this.end = C, this.details = F;
          }
          toString() {
            return this.start.file.content.substring(this.start.offset, this.end.offset);
          }
        };
        o.ParseSourceSpan = e, o.EMPTY_PARSE_LOCATION = new p(new c("", ""), 0, 0, 0), o.EMPTY_SOURCE_SPAN = new e(o.EMPTY_PARSE_LOCATION, o.EMPTY_PARSE_LOCATION);
        var i;
        (function(E) {
          E[E.WARNING = 0] = "WARNING", E[E.ERROR = 1] = "ERROR";
        })(i = o.ParseErrorLevel || (o.ParseErrorLevel = {}));
        var u = class {
          constructor(E, C) {
            let F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : i.ERROR;
            this.span = E, this.msg = C, this.level = F;
          }
          contextualMessage() {
            let E = this.span.start.getContext(100, 3);
            return E ? `${this.msg} ("${E.before}[${i[this.level]} ->]${E.after}")` : this.msg;
          }
          toString() {
            let E = this.span.details ? `, ${this.span.details}` : "";
            return `${this.contextualMessage()}: ${this.span.start}${E}`;
          }
        };
        o.ParseError = u;
        function h(E, C) {
          let F = t.identifierModuleUrl(C), g = F != null ? `in ${E} ${t.identifierName(C)} in ${F}` : `in ${E} ${t.identifierName(C)}`, b = new c("", g);
          return new e(new p(b, -1, -1, -1), new p(b, -1, -1, -1));
        }
        o.typeSourceSpan = h;
        function D(E, C, F) {
          let g = `in ${E} ${C} in ${F}`, b = new c("", g);
          return new e(new p(b, -1, -1, -1), new p(b, -1, -1, -1));
        }
        o.r3JitTypeSourceSpan = D;
      } }), Jr = Ce({ "src/language-html/print-preprocess.js"(o, m) {
        Be();
        var { ParseSourceSpan: t } = Or(), { htmlTrim: p, getLeadingAndTrailingHtmlWhitespace: c, hasHtmlWhitespace: e, canHaveInterpolation: i, getNodeCssStyleDisplay: u, isDanglingSpaceSensitiveNode: h, isIndentationSensitiveNode: D, isLeadingSpaceSensitiveNode: E, isTrailingSpaceSensitiveNode: C, isWhitespaceSensitiveNode: F, isVueScriptTag: g } = At(), b = [G, W, _, Q, H, R, ge, y, v, U, S];
        function T(l, A) {
          for (let w of b)
            w(l, A);
          return l;
        }
        function G(l) {
          l.walk((A) => {
            if (A.type === "element" && A.tagDefinition.ignoreFirstLf && A.children.length > 0 && A.children[0].type === "text" && A.children[0].value[0] === `
`) {
              let w = A.children[0];
              w.value.length === 1 ? A.removeChild(w) : w.value = w.value.slice(1);
            }
          });
        }
        function W(l) {
          let A = (w) => w.type === "element" && w.prev && w.prev.type === "ieConditionalStartComment" && w.prev.sourceSpan.end.offset === w.startSourceSpan.start.offset && w.firstChild && w.firstChild.type === "ieConditionalEndComment" && w.firstChild.sourceSpan.start.offset === w.startSourceSpan.end.offset;
          l.walk((w) => {
            if (w.children)
              for (let I = 0; I < w.children.length; I++) {
                let O = w.children[I];
                if (!A(O))
                  continue;
                let M = O.prev, ee = O.firstChild;
                w.removeChild(M), I--;
                let pe = new t(M.sourceSpan.start, ee.sourceSpan.end), he = new t(pe.start, O.sourceSpan.end);
                O.condition = M.condition, O.sourceSpan = he, O.startSourceSpan = pe, O.removeChild(ee);
              }
          });
        }
        function B(l, A, w) {
          l.walk((I) => {
            if (I.children)
              for (let O = 0; O < I.children.length; O++) {
                let M = I.children[O];
                if (M.type !== "text" && !A(M))
                  continue;
                M.type !== "text" && (M.type = "text", M.value = w(M));
                let ee = M.prev;
                !ee || ee.type !== "text" || (ee.value += M.value, ee.sourceSpan = new t(ee.sourceSpan.start, M.sourceSpan.end), I.removeChild(M), O--);
              }
          });
        }
        function _(l) {
          return B(l, (A) => A.type === "cdata", (A) => `<![CDATA[${A.value}]]>`);
        }
        function U(l) {
          let A = (w) => w.type === "element" && w.attrs.length === 0 && w.children.length === 1 && w.firstChild.type === "text" && !e(w.children[0].value) && !w.firstChild.hasLeadingSpaces && !w.firstChild.hasTrailingSpaces && w.isLeadingSpaceSensitive && !w.hasLeadingSpaces && w.isTrailingSpaceSensitive && !w.hasTrailingSpaces && w.prev && w.prev.type === "text" && w.next && w.next.type === "text";
          l.walk((w) => {
            if (w.children)
              for (let I = 0; I < w.children.length; I++) {
                let O = w.children[I];
                if (!A(O))
                  continue;
                let M = O.prev, ee = O.next;
                M.value += `<${O.rawName}>` + O.firstChild.value + `</${O.rawName}>` + ee.value, M.sourceSpan = new t(M.sourceSpan.start, ee.sourceSpan.end), M.isTrailingSpaceSensitive = ee.isTrailingSpaceSensitive, M.hasTrailingSpaces = ee.hasTrailingSpaces, w.removeChild(O), I--, w.removeChild(ee);
              }
          });
        }
        function Q(l, A) {
          if (A.parser === "html")
            return;
          let w = /{{(.+?)}}/s;
          l.walk((I) => {
            if (i(I))
              for (let O of I.children) {
                if (O.type !== "text")
                  continue;
                let M = O.sourceSpan.start, ee = null, pe = O.value.split(w);
                for (let he = 0; he < pe.length; he++, M = ee) {
                  let ce = pe[he];
                  if (he % 2 === 0) {
                    ee = M.moveBy(ce.length), ce.length > 0 && I.insertChildBefore(O, { type: "text", value: ce, sourceSpan: new t(M, ee) });
                    continue;
                  }
                  ee = M.moveBy(ce.length + 4), I.insertChildBefore(O, { type: "interpolation", sourceSpan: new t(M, ee), children: ce.length === 0 ? [] : [{ type: "text", value: ce, sourceSpan: new t(M.moveBy(2), ee.moveBy(-2)) }] });
                }
                I.removeChild(O);
              }
          });
        }
        function H(l) {
          l.walk((A) => {
            if (!A.children)
              return;
            if (A.children.length === 0 || A.children.length === 1 && A.children[0].type === "text" && p(A.children[0].value).length === 0) {
              A.hasDanglingSpaces = A.children.length > 0, A.children = [];
              return;
            }
            let w = F(A), I = D(A);
            if (!w)
              for (let O = 0; O < A.children.length; O++) {
                let M = A.children[O];
                if (M.type !== "text")
                  continue;
                let { leadingWhitespace: ee, text: pe, trailingWhitespace: he } = c(M.value), ce = M.prev, xe = M.next;
                pe ? (M.value = pe, M.sourceSpan = new t(M.sourceSpan.start.moveBy(ee.length), M.sourceSpan.end.moveBy(-he.length)), ee && (ce && (ce.hasTrailingSpaces = !0), M.hasLeadingSpaces = !0), he && (M.hasTrailingSpaces = !0, xe && (xe.hasLeadingSpaces = !0))) : (A.removeChild(M), O--, (ee || he) && (ce && (ce.hasTrailingSpaces = !0), xe && (xe.hasLeadingSpaces = !0)));
              }
            A.isWhitespaceSensitive = w, A.isIndentationSensitive = I;
          });
        }
        function ge(l) {
          l.walk((A) => {
            A.isSelfClosing = !A.children || A.type === "element" && (A.tagDefinition.isVoid || A.startSourceSpan === A.endSourceSpan);
          });
        }
        function y(l, A) {
          l.walk((w) => {
            w.type === "element" && (w.hasHtmComponentClosingTag = w.endSourceSpan && /^<\s*\/\s*\/\s*>$/.test(A.originalText.slice(w.endSourceSpan.start.offset, w.endSourceSpan.end.offset)));
          });
        }
        function R(l, A) {
          l.walk((w) => {
            w.cssDisplay = u(w, A);
          });
        }
        function v(l, A) {
          l.walk((w) => {
            let { children: I } = w;
            if (I) {
              if (I.length === 0) {
                w.isDanglingSpaceSensitive = h(w);
                return;
              }
              for (let O of I)
                O.isLeadingSpaceSensitive = E(O, A), O.isTrailingSpaceSensitive = C(O, A);
              for (let O = 0; O < I.length; O++) {
                let M = I[O];
                M.isLeadingSpaceSensitive = (O === 0 || M.prev.isTrailingSpaceSensitive) && M.isLeadingSpaceSensitive, M.isTrailingSpaceSensitive = (O === I.length - 1 || M.next.isLeadingSpaceSensitive) && M.isTrailingSpaceSensitive;
              }
            }
          });
        }
        function S(l, A) {
          if (A.parser === "vue") {
            let w = l.children.find((O) => g(O, A));
            if (!w)
              return;
            let { lang: I } = w.attrMap;
            (I === "ts" || I === "typescript") && (A.__should_parse_vue_template_with_ts = !0);
          }
        }
        m.exports = T;
      } }), _r = Ce({ "src/language-html/pragma.js"(o, m) {
        Be();
        function t(c) {
          return /^\s*<!--\s*@(?:format|prettier)\s*-->/.test(c);
        }
        function p(c) {
          return `<!-- @format -->

` + c.replace(/^\s*\n/, "");
        }
        m.exports = { hasPragma: t, insertPragma: p };
      } }), Fr = Ce({ "src/language-html/loc.js"(o, m) {
        Be();
        function t(c) {
          return c.sourceSpan.start.offset;
        }
        function p(c) {
          return c.sourceSpan.end.offset;
        }
        m.exports = { locStart: t, locEnd: p };
      } }), zt = Ce({ "src/language-html/print/tag.js"(o, m) {
        Be();
        var t = Ui(), { isNonEmptyArray: p } = yr(), { builders: { indent: c, join: e, line: i, softline: u, hardline: h }, utils: { replaceTextEndOfLine: D } } = sr(), { locStart: E, locEnd: C } = Fr(), { isTextLikeNode: F, getLastDescendant: g, isPreLikeNode: b, hasPrettierIgnore: T, shouldPreserveContent: G, isVueSfcBlock: W } = At();
        function B(ie, je) {
          return [ie.isSelfClosing ? "" : _(ie, je), U(ie, je)];
        }
        function _(ie, je) {
          return ie.lastChild && l(ie.lastChild) ? "" : [Q(ie, je), ge(ie, je)];
        }
        function U(ie, je) {
          return (ie.next ? v(ie.next) : S(ie.parent)) ? "" : [y(ie, je), H(ie, je)];
        }
        function Q(ie, je) {
          return S(ie) ? y(ie.lastChild, je) : "";
        }
        function H(ie, je) {
          return l(ie) ? ge(ie.parent, je) : A(ie) ? ce(ie.next) : "";
        }
        function ge(ie, je) {
          if (t(!ie.isSelfClosing), R(ie, je))
            return "";
          switch (ie.type) {
            case "ieConditionalComment":
              return "<!";
            case "element":
              if (ie.hasHtmComponentClosingTag)
                return "<//";
            default:
              return `</${ie.rawName}`;
          }
        }
        function y(ie, je) {
          if (R(ie, je))
            return "";
          switch (ie.type) {
            case "ieConditionalComment":
            case "ieConditionalEndComment":
              return "[endif]-->";
            case "ieConditionalStartComment":
              return "]><!-->";
            case "interpolation":
              return "}}";
            case "element":
              if (ie.isSelfClosing)
                return "/>";
            default:
              return ">";
          }
        }
        function R(ie, je) {
          return !ie.isSelfClosing && !ie.endSourceSpan && (T(ie) || G(ie.parent, je));
        }
        function v(ie) {
          return ie.prev && ie.prev.type !== "docType" && !F(ie.prev) && ie.isLeadingSpaceSensitive && !ie.hasLeadingSpaces;
        }
        function S(ie) {
          return ie.lastChild && ie.lastChild.isTrailingSpaceSensitive && !ie.lastChild.hasTrailingSpaces && !F(g(ie.lastChild)) && !b(ie);
        }
        function l(ie) {
          return !ie.next && !ie.hasTrailingSpaces && ie.isTrailingSpaceSensitive && F(g(ie));
        }
        function A(ie) {
          return ie.next && !F(ie.next) && F(ie) && ie.isTrailingSpaceSensitive && !ie.hasTrailingSpaces;
        }
        function w(ie) {
          let je = ie.trim().match(/^prettier-ignore-attribute(?:\s+(.+))?$/s);
          return je ? je[1] ? je[1].split(/\s+/) : !0 : !1;
        }
        function I(ie) {
          return !ie.prev && ie.isLeadingSpaceSensitive && !ie.hasLeadingSpaces;
        }
        function O(ie, je, de) {
          let oe = ie.getValue();
          if (!p(oe.attrs))
            return oe.isSelfClosing ? " " : "";
          let Ne = oe.prev && oe.prev.type === "comment" && w(oe.prev.value), Je = typeof Ne == "boolean" ? () => Ne : Array.isArray(Ne) ? (Qe) => Ne.includes(Qe.rawName) : () => !1, _e = ie.map((Qe) => {
            let Ze = Qe.getValue();
            return Je(Ze) ? D(je.originalText.slice(E(Ze), C(Ze))) : de();
          }, "attrs"), it = oe.type === "element" && oe.fullName === "script" && oe.attrs.length === 1 && oe.attrs[0].fullName === "src" && oe.children.length === 0, me = je.singleAttributePerLine && oe.attrs.length > 1 && !W(oe, je) ? h : i, Se = [c([it ? " " : i, e(me, _e)])];
          return oe.firstChild && I(oe.firstChild) || oe.isSelfClosing && S(oe.parent) || it ? Se.push(oe.isSelfClosing ? " " : "") : Se.push(je.bracketSameLine ? oe.isSelfClosing ? " " : "" : oe.isSelfClosing ? i : u), Se;
        }
        function M(ie) {
          return ie.firstChild && I(ie.firstChild) ? "" : xe(ie);
        }
        function ee(ie, je, de) {
          let oe = ie.getValue();
          return [pe(oe, je), O(ie, je, de), oe.isSelfClosing ? "" : M(oe)];
        }
        function pe(ie, je) {
          return ie.prev && A(ie.prev) ? "" : [he(ie, je), ce(ie)];
        }
        function he(ie, je) {
          return I(ie) ? xe(ie.parent) : v(ie) ? y(ie.prev, je) : "";
        }
        function ce(ie) {
          switch (ie.type) {
            case "ieConditionalComment":
            case "ieConditionalStartComment":
              return `<!--[if ${ie.condition}`;
            case "ieConditionalEndComment":
              return "<!--<!";
            case "interpolation":
              return "{{";
            case "docType":
              return "<!DOCTYPE";
            case "element":
              if (ie.condition)
                return `<!--[if ${ie.condition}]><!--><${ie.rawName}`;
            default:
              return `<${ie.rawName}`;
          }
        }
        function xe(ie) {
          switch (t(!ie.isSelfClosing), ie.type) {
            case "ieConditionalComment":
              return "]>";
            case "element":
              if (ie.condition)
                return "><!--<![endif]-->";
            default:
              return ">";
          }
        }
        m.exports = { printClosingTag: B, printClosingTagStart: _, printClosingTagStartMarker: ge, printClosingTagEndMarker: y, printClosingTagSuffix: H, printClosingTagEnd: U, needsToBorrowLastChildClosingTagEndMarker: S, needsToBorrowParentClosingTagStartMarker: l, needsToBorrowPrevClosingTagEndMarker: v, printOpeningTag: ee, printOpeningTagStart: pe, printOpeningTagPrefix: he, printOpeningTagStartMarker: ce, printOpeningTagEndMarker: xe, needsToBorrowNextOpeningTagStartMarker: A, needsToBorrowParentOpeningTagEndMarker: I };
      } }), vr = Ce({ "node_modules/parse-srcset/src/parse-srcset.js"(o, m) {
        Be(), function(t, p) {
          typeof m == "object" && m.exports ? m.exports = p() : t.parseSrcset = p();
        }(o, function() {
          return function(t, p) {
            var c = p && p.logger || console;
            function e(ge) {
              return ge === " " || ge === "	" || ge === `
` || ge === "\f" || ge === "\r";
            }
            function i(ge) {
              var y, R = ge.exec(t.substring(_));
              if (R)
                return y = R[0], _ += y.length, y;
            }
            for (var u = t.length, h = /^[ \t\n\r\u000c]+/, D = /^[, \t\n\r\u000c]+/, E = /^[^ \t\n\r\u000c]+/, C = /[,]+$/, F = /^\d+$/, g = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, b, T, G, W, B, _ = 0, U = []; ; ) {
              if (i(D), _ >= u)
                return U;
              b = i(E), T = [], b.slice(-1) === "," ? (b = b.replace(C, ""), H()) : Q();
            }
            function Q() {
              for (i(h), G = "", W = "in descriptor"; ; ) {
                if (B = t.charAt(_), W === "in descriptor")
                  if (e(B))
                    G && (T.push(G), G = "", W = "after descriptor");
                  else if (B === ",") {
                    _ += 1, G && T.push(G), H();
                    return;
                  } else if (B === "(")
                    G = G + B, W = "in parens";
                  else if (B === "") {
                    G && T.push(G), H();
                    return;
                  } else
                    G = G + B;
                else if (W === "in parens")
                  if (B === ")")
                    G = G + B, W = "in descriptor";
                  else if (B === "") {
                    T.push(G), H();
                    return;
                  } else
                    G = G + B;
                else if (W === "after descriptor" && !e(B))
                  if (B === "") {
                    H();
                    return;
                  } else
                    W = "in descriptor", _ -= 1;
                _ += 1;
              }
            }
            function H() {
              var ge = !1, y, R, v, S, l = {}, A, w, I, O, M;
              for (S = 0; S < T.length; S++)
                A = T[S], w = A[A.length - 1], I = A.substring(0, A.length - 1), O = parseInt(I, 10), M = parseFloat(I), F.test(I) && w === "w" ? ((y || R) && (ge = !0), O === 0 ? ge = !0 : y = O) : g.test(I) && w === "x" ? ((y || R || v) && (ge = !0), M < 0 ? ge = !0 : R = M) : F.test(I) && w === "h" ? ((v || R) && (ge = !0), O === 0 ? ge = !0 : v = O) : ge = !0;
              ge ? c && c.error && c.error("Invalid srcset descriptor found in '" + t + "' at '" + A + "'.") : (l.url = b, y && (l.w = y), R && (l.d = R), v && (l.h = v), U.push(l));
            }
          };
        });
      } }), lr = Ce({ "src/language-html/syntax-attribute.js"(o, m) {
        Be();
        var t = vr(), { builders: { ifBreak: p, join: c, line: e } } = sr();
        function i(h) {
          let D = t(h, { logger: { error(Q) {
            throw new Error(Q);
          } } }), E = D.some((Q) => {
            let { w: H } = Q;
            return H;
          }), C = D.some((Q) => {
            let { h: H } = Q;
            return H;
          }), F = D.some((Q) => {
            let { d: H } = Q;
            return H;
          });
          if (E + C + F > 1)
            throw new Error("Mixed descriptor in srcset is not supported");
          let g = E ? "w" : C ? "h" : "d", b = E ? "w" : C ? "h" : "x", T = (Q) => Math.max(...Q), G = D.map((Q) => Q.url), W = T(G.map((Q) => Q.length)), B = D.map((Q) => Q[g]).map((Q) => Q ? Q.toString() : ""), _ = B.map((Q) => {
            let H = Q.indexOf(".");
            return H === -1 ? Q.length : H;
          }), U = T(_);
          return c([",", e], G.map((Q, H) => {
            let ge = [Q], y = B[H];
            if (y) {
              let R = W - Q.length + 1, v = U - _[H], S = " ".repeat(R + v);
              ge.push(p(S, " "), y + b);
            }
            return ge;
          }));
        }
        function u(h) {
          return h.trim().split(/\s+/).join(" ");
        }
        m.exports = { printImgSrcset: i, printClassNames: u };
      } }), fr = Ce({ "src/language-html/syntax-vue.js"(o, m) {
        Be();
        var { builders: { group: t } } = sr();
        function p(u, h) {
          let { left: D, operator: E, right: C } = c(u);
          return [t(h(`function _(${D}) {}`, { parser: "babel", __isVueForBindingLeft: !0 })), " ", E, " ", h(C, { parser: "__js_expression" }, { stripTrailingHardline: !0 })];
        }
        function c(u) {
          let h = /(.*?)\s+(in|of)\s+(.*)/s, D = /,([^,\]}]*)(?:,([^,\]}]*))?$/, E = /^\(|\)$/g, C = u.match(h);
          if (!C)
            return;
          let F = {};
          if (F.for = C[3].trim(), !F.for)
            return;
          let g = C[1].trim().replace(E, ""), b = g.match(D);
          b ? (F.alias = g.replace(D, ""), F.iterator1 = b[1].trim(), b[2] && (F.iterator2 = b[2].trim())) : F.alias = g;
          let T = [F.alias, F.iterator1, F.iterator2];
          if (!T.some((G, W) => !G && (W === 0 || T.slice(W + 1).some(Boolean))))
            return { left: T.filter(Boolean).join(","), operator: C[2], right: F.for };
        }
        function e(u, h) {
          return h(`function _(${u}) {}`, { parser: "babel", __isVueBindings: !0 });
        }
        function i(u) {
          let h = /^(?:[\w$]+|\([^)]*\))\s*=>|^function\s*\(/, D = /^[$A-Z_a-z][\w$]*(?:\.[$A-Z_a-z][\w$]*|\['[^']*']|\["[^"]*"]|\[\d+]|\[[$A-Z_a-z][\w$]*])*$/, E = u.trim();
          return h.test(E) || D.test(E);
        }
        m.exports = { isVueEventBindingExpression: i, printVueFor: p, printVueBindings: e };
      } }), qe = Ce({ "src/language-html/get-node-content.js"(o, m) {
        Be();
        var { needsToBorrowParentClosingTagStartMarker: t, printClosingTagStartMarker: p, needsToBorrowLastChildClosingTagEndMarker: c, printClosingTagEndMarker: e, needsToBorrowParentOpeningTagEndMarker: i, printOpeningTagEndMarker: u } = zt();
        function h(D, E) {
          let C = D.startSourceSpan.end.offset;
          D.firstChild && i(D.firstChild) && (C -= u(D).length);
          let F = D.endSourceSpan.start.offset;
          return D.lastChild && t(D.lastChild) ? F += p(D, E).length : c(D) && (F -= e(D.lastChild, E).length), E.originalText.slice(C, F);
        }
        m.exports = h;
      } }), ct = Ce({ "src/language-html/embed.js"(o, m) {
        Be();
        var { builders: { breakParent: t, group: p, hardline: c, indent: e, line: i, fill: u, softline: h }, utils: { mapDoc: D, replaceTextEndOfLine: E } } = sr(), C = to(), { printClosingTag: F, printClosingTagSuffix: g, needsToBorrowPrevClosingTagEndMarker: b, printOpeningTagPrefix: T, printOpeningTag: G } = zt(), { printImgSrcset: W, printClassNames: B } = lr(), { printVueFor: _, printVueBindings: U, isVueEventBindingExpression: Q } = fr(), { isScriptLikeTag: H, isVueNonHtmlBlock: ge, inferScriptParser: y, htmlTrimPreserveIndentation: R, dedentString: v, unescapeQuoteEntities: S, isVueSlotAttribute: l, isVueSfcBindingsAttribute: A, getTextValueParts: w } = At(), I = qe();
        function O(ee, pe, he) {
          let ce = (_e) => new RegExp(_e.join("|")).test(ee.fullName), xe = () => S(ee.value), ie = !1, je = (_e, it) => {
            let me = _e.type === "NGRoot" ? _e.node.type === "NGMicrosyntax" && _e.node.body.length === 1 && _e.node.body[0].type === "NGMicrosyntaxExpression" ? _e.node.body[0].expression : _e.node : _e.type === "JsExpressionRoot" ? _e.node : _e;
            me && (me.type === "ObjectExpression" || me.type === "ArrayExpression" || it.parser === "__vue_expression" && (me.type === "TemplateLiteral" || me.type === "StringLiteral")) && (ie = !0);
          }, de = (_e) => p(_e), oe = function(_e) {
            let it = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
            return p([e([h, _e]), it ? h : ""]);
          }, Ne = (_e) => ie ? de(_e) : oe(_e), Je = (_e, it) => pe(_e, Object.assign({ __onHtmlBindingRoot: je, __embeddedInHtml: !0 }, it));
          if (ee.fullName === "srcset" && (ee.parent.fullName === "img" || ee.parent.fullName === "source"))
            return oe(W(xe()));
          if (ee.fullName === "class" && !he.parentParser) {
            let _e = xe();
            if (!_e.includes("{{"))
              return B(_e);
          }
          if (ee.fullName === "style" && !he.parentParser) {
            let _e = xe();
            if (!_e.includes("{{"))
              return oe(Je(_e, { parser: "css", __isHTMLStyleAttribute: !0 }));
          }
          if (he.parser === "vue") {
            if (ee.fullName === "v-for")
              return _(xe(), Je);
            if (l(ee) || A(ee, he))
              return U(xe(), Je);
            let _e = ["^@", "^v-on:"], it = ["^:", "^v-bind:"], me = ["^v-"];
            if (ce(_e)) {
              let Se = xe(), Qe = Q(Se) ? "__js_expression" : he.__should_parse_vue_template_with_ts ? "__vue_ts_event_binding" : "__vue_event_binding";
              return Ne(Je(Se, { parser: Qe }));
            }
            if (ce(it))
              return Ne(Je(xe(), { parser: "__vue_expression" }));
            if (ce(me))
              return Ne(Je(xe(), { parser: "__js_expression" }));
          }
          if (he.parser === "angular") {
            let _e = (ke, be) => Je(ke, Object.assign(Object.assign({}, be), {}, { trailingComma: "none" })), it = ["^\\*"], me = ["^\\(.+\\)$", "^on-"], Se = ["^\\[.+\\]$", "^bind(on)?-", "^ng-(if|show|hide|class|style)$"], Qe = ["^i18n(-.+)?$"];
            if (ce(me))
              return Ne(_e(xe(), { parser: "__ng_action" }));
            if (ce(Se))
              return Ne(_e(xe(), { parser: "__ng_binding" }));
            if (ce(Qe)) {
              let ke = xe().trim();
              return oe(u(w(ee, ke)), !ke.includes("@@"));
            }
            if (ce(it))
              return Ne(_e(xe(), { parser: "__ng_directive" }));
            let Ze = /{{(.+?)}}/s, kt = xe();
            if (Ze.test(kt)) {
              let ke = [];
              for (let [be, Oe] of kt.split(Ze).entries())
                if (be % 2 === 0)
                  ke.push(E(Oe));
                else
                  try {
                    ke.push(p(["{{", e([i, _e(Oe, { parser: "__ng_interpolation", __isInHtmlInterpolation: !0 })]), i, "}}"]));
                  } catch {
                    ke.push("{{", E(Oe), "}}");
                  }
              return p(ke);
            }
          }
          return null;
        }
        function M(ee, pe, he, ce) {
          let xe = ee.getValue();
          switch (xe.type) {
            case "element": {
              if (H(xe) || xe.type === "interpolation")
                return;
              if (!xe.isSelfClosing && ge(xe, ce)) {
                let ie = y(xe, ce);
                if (!ie)
                  return;
                let je = I(xe, ce), de = /^\s*$/.test(je), oe = "";
                return de || (oe = he(R(je), { parser: ie, __embeddedInHtml: !0 }, { stripTrailingHardline: !0 }), de = oe === ""), [T(xe, ce), p(G(ee, ce, pe)), de ? "" : c, oe, de ? "" : c, F(xe, ce), g(xe, ce)];
              }
              break;
            }
            case "text": {
              if (H(xe.parent)) {
                let ie = y(xe.parent, ce);
                if (ie) {
                  let je = ie === "markdown" ? v(xe.value.replace(/^[^\S\n]*\n/, "")) : xe.value, de = { parser: ie, __embeddedInHtml: !0 };
                  if (ce.parser === "html" && ie === "babel") {
                    let oe = "script", { attrMap: Ne } = xe.parent;
                    Ne && (Ne.type === "module" || Ne.type === "text/babel" && Ne["data-type"] === "module") && (oe = "module"), de.__babelSourceType = oe;
                  }
                  return [t, T(xe, ce), he(je, de, { stripTrailingHardline: !0 }), g(xe, ce)];
                }
              } else if (xe.parent.type === "interpolation") {
                let ie = { __isInHtmlInterpolation: !0, __embeddedInHtml: !0 };
                return ce.parser === "angular" ? (ie.parser = "__ng_interpolation", ie.trailingComma = "none") : ce.parser === "vue" ? ie.parser = ce.__should_parse_vue_template_with_ts ? "__vue_ts_expression" : "__vue_expression" : ie.parser = "__js_expression", [e([i, he(xe.value, ie, { stripTrailingHardline: !0 })]), xe.parent.next && b(xe.parent.next) ? " " : i];
              }
              break;
            }
            case "attribute": {
              if (!xe.value)
                break;
              if (/^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/.test(ce.originalText.slice(xe.valueSpan.start.offset, xe.valueSpan.end.offset)))
                return [xe.rawName, "=", xe.value];
              if (ce.parser === "lwc" && /^{.*}$/s.test(ce.originalText.slice(xe.valueSpan.start.offset, xe.valueSpan.end.offset)))
                return [xe.rawName, "=", xe.value];
              let ie = O(xe, (je, de) => he(je, Object.assign({ __isInHtmlAttribute: !0, __embeddedInHtml: !0 }, de), { stripTrailingHardline: !0 }), ce);
              if (ie)
                return [xe.rawName, '="', p(D(ie, (je) => typeof je == "string" ? je.replace(/"/g, "&quot;") : je)), '"'];
              break;
            }
            case "front-matter":
              return C(xe, he);
          }
        }
        m.exports = M;
      } }), dt = Ce({ "src/language-html/print/children.js"(o, m) {
        Be();
        var { builders: { breakParent: t, group: p, ifBreak: c, line: e, softline: i, hardline: u }, utils: { replaceTextEndOfLine: h } } = sr(), { locStart: D, locEnd: E } = Fr(), { forceBreakChildren: C, forceNextEmptyLine: F, isTextLikeNode: g, hasPrettierIgnore: b, preferHardlineAsLeadingSpaces: T } = At(), { printOpeningTagPrefix: G, needsToBorrowNextOpeningTagStartMarker: W, printOpeningTagStartMarker: B, needsToBorrowPrevClosingTagEndMarker: _, printClosingTagEndMarker: U, printClosingTagSuffix: Q, needsToBorrowParentClosingTagStartMarker: H } = zt();
        function ge(v, S, l) {
          let A = v.getValue();
          return b(A) ? [G(A, S), ...h(S.originalText.slice(D(A) + (A.prev && W(A.prev) ? B(A).length : 0), E(A) - (A.next && _(A.next) ? U(A, S).length : 0))), Q(A, S)] : l();
        }
        function y(v, S) {
          return g(v) && g(S) ? v.isTrailingSpaceSensitive ? v.hasTrailingSpaces ? T(S) ? u : e : "" : T(S) ? u : i : W(v) && (b(S) || S.firstChild || S.isSelfClosing || S.type === "element" && S.attrs.length > 0) || v.type === "element" && v.isSelfClosing && _(S) ? "" : !S.isLeadingSpaceSensitive || T(S) || _(S) && v.lastChild && H(v.lastChild) && v.lastChild.lastChild && H(v.lastChild.lastChild) ? u : S.hasLeadingSpaces ? e : i;
        }
        function R(v, S, l) {
          let A = v.getValue();
          if (C(A))
            return [t, ...v.map((I) => {
              let O = I.getValue(), M = O.prev ? y(O.prev, O) : "";
              return [M ? [M, F(O.prev) ? u : ""] : "", ge(I, S, l)];
            }, "children")];
          let w = A.children.map(() => Symbol(""));
          return v.map((I, O) => {
            let M = I.getValue();
            if (g(M)) {
              if (M.prev && g(M.prev)) {
                let je = y(M.prev, M);
                if (je)
                  return F(M.prev) ? [u, u, ge(I, S, l)] : [je, ge(I, S, l)];
              }
              return ge(I, S, l);
            }
            let ee = [], pe = [], he = [], ce = [], xe = M.prev ? y(M.prev, M) : "", ie = M.next ? y(M, M.next) : "";
            return xe && (F(M.prev) ? ee.push(u, u) : xe === u ? ee.push(u) : g(M.prev) ? pe.push(xe) : pe.push(c("", i, { groupId: w[O - 1] }))), ie && (F(M) ? g(M.next) && ce.push(u, u) : ie === u ? g(M.next) && ce.push(u) : he.push(ie)), [...ee, p([...pe, p([ge(I, S, l), ...he], { id: w[O] })]), ...ce];
          }, "children");
        }
        m.exports = { printChildren: R };
      } }), It = Ce({ "src/language-html/print/element.js"(o, m) {
        Be();
        var { builders: { breakParent: t, dedentToRoot: p, group: c, ifBreak: e, indentIfBreak: i, indent: u, line: h, softline: D }, utils: { replaceTextEndOfLine: E } } = sr(), C = qe(), { shouldPreserveContent: F, isScriptLikeTag: g, isVueCustomBlock: b, countParents: T, forceBreakContent: G } = At(), { printOpeningTagPrefix: W, printOpeningTag: B, printClosingTagSuffix: _, printClosingTag: U, needsToBorrowPrevClosingTagEndMarker: Q, needsToBorrowLastChildClosingTagEndMarker: H } = zt(), { printChildren: ge } = dt();
        function y(R, v, S) {
          let l = R.getValue();
          if (F(l, v))
            return [W(l, v), c(B(R, v, S)), ...E(C(l, v)), ...U(l, v), _(l, v)];
          let A = l.children.length === 1 && l.firstChild.type === "interpolation" && l.firstChild.isLeadingSpaceSensitive && !l.firstChild.hasLeadingSpaces && l.lastChild.isTrailingSpaceSensitive && !l.lastChild.hasTrailingSpaces, w = Symbol("element-attr-group-id"), I = (pe) => c([c(B(R, v, S), { id: w }), pe, U(l, v)]), O = (pe) => A ? i(pe, { groupId: w }) : (g(l) || b(l, v)) && l.parent.type === "root" && v.parser === "vue" && !v.vueIndentScriptAndStyle ? pe : u(pe), M = () => A ? e(D, "", { groupId: w }) : l.firstChild.hasLeadingSpaces && l.firstChild.isLeadingSpaceSensitive ? h : l.firstChild.type === "text" && l.isWhitespaceSensitive && l.isIndentationSensitive ? p(D) : D, ee = () => (l.next ? Q(l.next) : H(l.parent)) ? l.lastChild.hasTrailingSpaces && l.lastChild.isTrailingSpaceSensitive ? " " : "" : A ? e(D, "", { groupId: w }) : l.lastChild.hasTrailingSpaces && l.lastChild.isTrailingSpaceSensitive ? h : (l.lastChild.type === "comment" || l.lastChild.type === "text" && l.isWhitespaceSensitive && l.isIndentationSensitive) && new RegExp(`\\n[\\t ]{${v.tabWidth * T(R, (pe) => pe.parent && pe.parent.type !== "root")}}$`).test(l.lastChild.value) ? "" : D;
          return l.children.length === 0 ? I(l.hasDanglingSpaces && l.isDanglingSpaceSensitive ? h : "") : I([G(l) ? t : "", O([M(), ge(R, v, S)]), ee()]);
        }
        m.exports = { printElement: y };
      } }), Ve = Ce({ "src/language-html/printer-html.js"(o, m) {
        Be();
        var { builders: { fill: t, group: p, hardline: c, literalline: e }, utils: { cleanDoc: i, getDocParts: u, isConcat: h, replaceTextEndOfLine: D } } = sr(), E = pr(), { countChars: C, unescapeQuoteEntities: F, getTextValueParts: g } = At(), b = Jr(), { insertPragma: T } = _r(), { locStart: G, locEnd: W } = Fr(), B = ct(), { printClosingTagSuffix: _, printClosingTagEnd: U, printOpeningTagPrefix: Q, printOpeningTagStart: H } = zt(), { printElement: ge } = It(), { printChildren: y } = dt();
        function R(v, S, l) {
          let A = v.getValue();
          switch (A.type) {
            case "front-matter":
              return D(A.raw);
            case "root":
              return S.__onHtmlRoot && S.__onHtmlRoot(A), [p(y(v, S, l)), c];
            case "element":
            case "ieConditionalComment":
              return ge(v, S, l);
            case "ieConditionalStartComment":
            case "ieConditionalEndComment":
              return [H(A), U(A)];
            case "interpolation":
              return [H(A, S), ...v.map(l, "children"), U(A, S)];
            case "text": {
              if (A.parent.type === "interpolation") {
                let I = /\n[^\S\n]*$/, O = I.test(A.value), M = O ? A.value.replace(I, "") : A.value;
                return [...D(M), O ? c : ""];
              }
              let w = i([Q(A, S), ...g(A), _(A, S)]);
              return h(w) || w.type === "fill" ? t(u(w)) : w;
            }
            case "docType":
              return [p([H(A, S), " ", A.value.replace(/^html\b/i, "html").replace(/\s+/g, " ")]), U(A, S)];
            case "comment":
              return [Q(A, S), ...D(S.originalText.slice(G(A), W(A)), e), _(A, S)];
            case "attribute": {
              if (A.value === null)
                return A.rawName;
              let w = F(A.value), I = C(w, "'"), O = C(w, '"'), M = I < O ? "'" : '"';
              return [A.rawName, "=", M, ...D(M === '"' ? w.replace(/"/g, "&quot;") : w.replace(/'/g, "&apos;")), M];
            }
            default:
              throw new Error(`Unexpected node type ${A.type}`);
          }
        }
        m.exports = { preprocess: b, print: R, insertPragma: T, massageAstNode: E, embed: B };
      } }), Yt = Ce({ "src/language-html/options.js"(o, m) {
        Be();
        var t = Ki(), p = "HTML";
        m.exports = { bracketSameLine: t.bracketSameLine, htmlWhitespaceSensitivity: { since: "1.15.0", category: p, type: "choice", default: "css", description: "How to handle whitespaces in HTML.", choices: [{ value: "css", description: "Respect the default value of CSS display property." }, { value: "strict", description: "Whitespaces are considered sensitive." }, { value: "ignore", description: "Whitespaces are considered insensitive." }] }, singleAttributePerLine: t.singleAttributePerLine, vueIndentScriptAndStyle: { since: "1.19.0", category: p, type: "boolean", default: !1, description: "Indent script and style tags in Vue files." } };
      } }), Jt = Ce({ "src/language-html/parsers.js"() {
        Be();
      } }), on = Ce({ "node_modules/linguist-languages/data/HTML.json"(o, m) {
        m.exports = { name: "HTML", type: "markup", tmScope: "text.html.basic", aceMode: "html", codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", color: "#e34c26", aliases: ["xhtml"], extensions: [".html", ".hta", ".htm", ".html.hl", ".inc", ".xht", ".xhtml"], languageId: 146 };
      } }), an = Ce({ "node_modules/linguist-languages/data/Vue.json"(o, m) {
        m.exports = { name: "Vue", type: "markup", color: "#41b883", extensions: [".vue"], tmScope: "text.html.vue", aceMode: "html", languageId: 391 };
      } }), wn = Ce({ "src/language-html/index.js"(o, m) {
        Be();
        var t = bi(), p = Ve(), c = Yt(), e = Jt(), i = [t(on(), () => ({ name: "Angular", since: "1.15.0", parsers: ["angular"], vscodeLanguageIds: ["html"], extensions: [".component.html"], filenames: [] })), t(on(), (h) => ({ since: "1.15.0", parsers: ["html"], vscodeLanguageIds: ["html"], extensions: [...h.extensions, ".mjml"] })), t(on(), () => ({ name: "Lightning Web Components", since: "1.17.0", parsers: ["lwc"], vscodeLanguageIds: ["html"], extensions: [], filenames: [] })), t(an(), () => ({ since: "1.10.0", parsers: ["vue"], vscodeLanguageIds: ["vue"] }))], u = { html: p };
        m.exports = { languages: i, printers: u, options: c, parsers: e };
      } }), zn = Ce({ "src/language-yaml/pragma.js"(o, m) {
        Be();
        function t(e) {
          return /^\s*@(?:prettier|format)\s*$/.test(e);
        }
        function p(e) {
          return /^\s*#[^\S\n]*@(?:prettier|format)\s*?(?:\n|$)/.test(e);
        }
        function c(e) {
          return `# @format

${e}`;
        }
        m.exports = { isPragma: t, hasPragma: p, insertPragma: c };
      } }), xn = Ce({ "src/language-yaml/loc.js"(o, m) {
        Be();
        function t(c) {
          return c.position.start.offset;
        }
        function p(c) {
          return c.position.end.offset;
        }
        m.exports = { locStart: t, locEnd: p };
      } }), ln = Ce({ "src/language-yaml/embed.js"(o, m) {
        Be();
        function t(p, c, e, i) {
          if (p.getValue().type === "root" && i.filepath && /(?:[/\\]|^)\.(?:prettier|stylelint|lintstaged)rc$/.test(i.filepath))
            return e(i.originalText, Object.assign(Object.assign({}, i), {}, { parser: "json" }));
        }
        m.exports = t;
      } }), cn = Ce({ "src/language-yaml/utils.js"(o, m) {
        Be();
        var { getLast: t, isNonEmptyArray: p } = yr();
        function c(y, R) {
          let v = 0, S = y.stack.length - 1;
          for (let l = 0; l < S; l++) {
            let A = y.stack[l];
            e(A) && R(A) && v++;
          }
          return v;
        }
        function e(y, R) {
          return y && typeof y.type == "string" && (!R || R.includes(y.type));
        }
        function i(y, R, v) {
          return R("children" in y ? Object.assign(Object.assign({}, y), {}, { children: y.children.map((S) => i(S, R, y)) }) : y, v);
        }
        function u(y, R, v) {
          Object.defineProperty(y, R, { get: v, enumerable: !1 });
        }
        function h(y, R) {
          let v = 0, S = R.length;
          for (let l = y.position.end.offset - 1; l < S; l++) {
            let A = R[l];
            if (A === `
` && v++, v === 1 && /\S/.test(A))
              return !1;
            if (v === 2)
              return !0;
          }
          return !1;
        }
        function D(y) {
          switch (y.getValue().type) {
            case "tag":
            case "anchor":
            case "comment":
              return !1;
          }
          let R = y.stack.length;
          for (let v = 1; v < R; v++) {
            let S = y.stack[v], l = y.stack[v - 1];
            if (Array.isArray(l) && typeof S == "number" && S !== l.length - 1)
              return !1;
          }
          return !0;
        }
        function E(y) {
          return p(y.children) ? E(t(y.children)) : y;
        }
        function C(y) {
          return y.value.trim() === "prettier-ignore";
        }
        function F(y) {
          let R = y.getValue();
          if (R.type === "documentBody") {
            let v = y.getParentNode();
            return _(v.head) && C(t(v.head.endComments));
          }
          return T(R) && C(t(R.leadingComments));
        }
        function g(y) {
          return !p(y.children) && !b(y);
        }
        function b(y) {
          return T(y) || G(y) || W(y) || B(y) || _(y);
        }
        function T(y) {
          return p(y == null ? void 0 : y.leadingComments);
        }
        function G(y) {
          return p(y == null ? void 0 : y.middleComments);
        }
        function W(y) {
          return y == null ? void 0 : y.indicatorComment;
        }
        function B(y) {
          return y == null ? void 0 : y.trailingComment;
        }
        function _(y) {
          return p(y == null ? void 0 : y.endComments);
        }
        function U(y) {
          let R = [], v;
          for (let S of y.split(/( +)/))
            S !== " " ? v === " " ? R.push(S) : R.push((R.pop() || "") + S) : v === void 0 && R.unshift(""), v = S;
          return v === " " && R.push((R.pop() || "") + " "), R[0] === "" && (R.shift(), R.unshift(" " + (R.shift() || ""))), R;
        }
        function Q(y, R, v) {
          let S = R.split(`
`).map((l, A, w) => A === 0 && A === w.length - 1 ? l : A !== 0 && A !== w.length - 1 ? l.trim() : A === 0 ? l.trimEnd() : l.trimStart());
          return v.proseWrap === "preserve" ? S.map((l) => l.length === 0 ? [] : [l]) : S.map((l) => l.length === 0 ? [] : U(l)).reduce((l, A, w) => w !== 0 && S[w - 1].length > 0 && A.length > 0 && !(y === "quoteDouble" && t(t(l)).endsWith("\\")) ? [...l.slice(0, -1), [...t(l), ...A]] : [...l, A], []).map((l) => v.proseWrap === "never" ? [l.join(" ")] : l);
        }
        function H(y, R) {
          let { parentIndent: v, isLastDescendant: S, options: l } = R, A = y.position.start.line === y.position.end.line ? "" : l.originalText.slice(y.position.start.offset, y.position.end.offset).match(/^[^\n]*\n(.*)$/s)[1], w;
          if (y.indent === null) {
            let M = A.match(/^(?<leadingSpace> *)[^\n\r ]/m);
            w = M ? M.groups.leadingSpace.length : Number.POSITIVE_INFINITY;
          } else
            w = y.indent - 1 + v;
          let I = A.split(`
`).map((M) => M.slice(w));
          if (l.proseWrap === "preserve" || y.type === "blockLiteral")
            return O(I.map((M) => M.length === 0 ? [] : [M]));
          return O(I.map((M) => M.length === 0 ? [] : U(M)).reduce((M, ee, pe) => pe !== 0 && I[pe - 1].length > 0 && ee.length > 0 && !/^\s/.test(ee[0]) && !/^\s|\s$/.test(t(M)) ? [...M.slice(0, -1), [...t(M), ...ee]] : [...M, ee], []).map((M) => M.reduce((ee, pe) => ee.length > 0 && /\s$/.test(t(ee)) ? [...ee.slice(0, -1), t(ee) + " " + pe] : [...ee, pe], [])).map((M) => l.proseWrap === "never" ? [M.join(" ")] : M));
          function O(M) {
            if (y.chomping === "keep")
              return t(M).length === 0 ? M.slice(0, -1) : M;
            let ee = 0;
            for (let pe = M.length - 1; pe >= 0 && M[pe].length === 0; pe--)
              ee++;
            return ee === 0 ? M : ee >= 2 && !S ? M.slice(0, -(ee - 1)) : M.slice(0, -ee);
          }
        }
        function ge(y) {
          if (!y)
            return !0;
          switch (y.type) {
            case "plain":
            case "quoteDouble":
            case "quoteSingle":
            case "alias":
            case "flowMapping":
            case "flowSequence":
              return !0;
            default:
              return !1;
          }
        }
        m.exports = { getLast: t, getAncestorCount: c, isNode: e, isEmptyNode: g, isInlineNode: ge, mapNode: i, defineShortcut: u, isNextLineEmpty: h, isLastDescendantNode: D, getBlockValueLineContents: H, getFlowScalarLineContents: Q, getLastDescendantNode: E, hasPrettierIgnore: F, hasLeadingComments: T, hasMiddleComments: G, hasIndicatorComment: W, hasTrailingComment: B, hasEndComments: _ };
      } }), hn = Ce({ "src/language-yaml/print-preprocess.js"(o, m) {
        Be();
        var { defineShortcut: t, mapNode: p } = cn();
        function c(i) {
          return p(i, e);
        }
        function e(i) {
          switch (i.type) {
            case "document":
              t(i, "head", () => i.children[0]), t(i, "body", () => i.children[1]);
              break;
            case "documentBody":
            case "sequenceItem":
            case "flowSequenceItem":
            case "mappingKey":
            case "mappingValue":
              t(i, "content", () => i.children[0]);
              break;
            case "mappingItem":
            case "flowMappingItem":
              t(i, "key", () => i.children[0]), t(i, "value", () => i.children[1]);
              break;
          }
          return i;
        }
        m.exports = c;
      } }), Yr = Ce({ "src/language-yaml/print/misc.js"(o, m) {
        Be();
        var { builders: { softline: t, align: p } } = sr(), { hasEndComments: c, isNextLineEmpty: e, isNode: i } = cn(), u = /* @__PURE__ */ new WeakMap();
        function h(C, F) {
          let g = C.getValue(), b = C.stack[0], T;
          return u.has(b) ? T = u.get(b) : (T = /* @__PURE__ */ new Set(), u.set(b, T)), !T.has(g.position.end.line) && (T.add(g.position.end.line), e(g, F) && !D(C.getParentNode())) ? t : "";
        }
        function D(C) {
          return c(C) && !i(C, ["documentHead", "documentBody", "flowMapping", "flowSequence"]);
        }
        function E(C, F) {
          return p(" ".repeat(C), F);
        }
        m.exports = { alignWithSpaces: E, shouldPrintEndComments: D, printNextEmptyLine: h };
      } }), Sn = Ce({ "src/language-yaml/print/flow-mapping-sequence.js"(o, m) {
        Be();
        var { builders: { ifBreak: t, line: p, softline: c, hardline: e, join: i } } = sr(), { isEmptyNode: u, getLast: h, hasEndComments: D } = cn(), { printNextEmptyLine: E, alignWithSpaces: C } = Yr();
        function F(b, T, G) {
          let W = b.getValue(), B = W.type === "flowMapping", _ = B ? "{" : "[", U = B ? "}" : "]", Q = c;
          B && W.children.length > 0 && G.bracketSpacing && (Q = p);
          let H = h(W.children), ge = H && H.type === "flowMappingItem" && u(H.key) && u(H.value);
          return [_, C(G.tabWidth, [Q, g(b, T, G), G.trailingComma === "none" ? "" : t(","), D(W) ? [e, i(e, b.map(T, "endComments"))] : ""]), ge ? "" : Q, U];
        }
        function g(b, T, G) {
          let W = b.getValue();
          return b.map((B, _) => [T(), _ === W.children.length - 1 ? "" : [",", p, W.children[_].position.start.line !== W.children[_ + 1].position.start.line ? E(B, G.originalText) : ""]], "children");
        }
        m.exports = { printFlowMapping: F, printFlowSequence: F };
      } }), ra = Ce({ "src/language-yaml/print/mapping-item.js"(o, m) {
        Be();
        var { builders: { conditionalGroup: t, group: p, hardline: c, ifBreak: e, join: i, line: u } } = sr(), { hasLeadingComments: h, hasMiddleComments: D, hasTrailingComment: E, hasEndComments: C, isNode: F, isEmptyNode: g, isInlineNode: b } = cn(), { alignWithSpaces: T } = Yr();
        function G(U, Q, H, ge, y) {
          let { key: R, value: v } = U, S = g(R), l = g(v);
          if (S && l)
            return ": ";
          let A = ge("key"), w = B(U) ? " " : "";
          if (l)
            return U.type === "flowMappingItem" && Q.type === "flowMapping" ? A : U.type === "mappingItem" && W(R.content, y) && !E(R.content) && (!Q.tag || Q.tag.value !== "tag:yaml.org,2002:set") ? [A, w, ":"] : ["? ", T(2, A)];
          let I = ge("value");
          if (S)
            return [": ", T(2, I)];
          if (h(v) || !b(R.content))
            return ["? ", T(2, A), c, i("", H.map(ge, "value", "leadingComments").map((ce) => [ce, c])), ": ", T(2, I)];
          if (_(R.content) && !h(R.content) && !D(R.content) && !E(R.content) && !C(R) && !h(v.content) && !D(v.content) && !C(v) && W(v.content, y))
            return [A, w, ": ", I];
          let O = Symbol("mappingKey"), M = p([e("? "), p(T(2, A), { id: O })]), ee = [c, ": ", T(2, I)], pe = [w, ":"];
          h(v.content) || C(v) && v.content && !F(v.content, ["mapping", "sequence"]) || Q.type === "mapping" && E(R.content) && b(v.content) || F(v.content, ["mapping", "sequence"]) && v.content.tag === null && v.content.anchor === null ? pe.push(c) : v.content && pe.push(u), pe.push(I);
          let he = T(y.tabWidth, pe);
          return W(R.content, y) && !h(R.content) && !D(R.content) && !C(R) ? t([[A, he]]) : t([[M, e(ee, he, { groupId: O })]]);
        }
        function W(U, Q) {
          if (!U)
            return !0;
          switch (U.type) {
            case "plain":
            case "quoteSingle":
            case "quoteDouble":
              break;
            case "alias":
              return !0;
            default:
              return !1;
          }
          if (Q.proseWrap === "preserve")
            return U.position.start.line === U.position.end.line;
          if (/\\$/m.test(Q.originalText.slice(U.position.start.offset, U.position.end.offset)))
            return !1;
          switch (Q.proseWrap) {
            case "never":
              return !U.value.includes(`
`);
            case "always":
              return !/[\n ]/.test(U.value);
            default:
              return !1;
          }
        }
        function B(U) {
          return U.key.content && U.key.content.type === "alias";
        }
        function _(U) {
          if (!U)
            return !0;
          switch (U.type) {
            case "plain":
            case "quoteDouble":
            case "quoteSingle":
              return U.position.start.line === U.position.end.line;
            case "alias":
              return !0;
            default:
              return !1;
          }
        }
        m.exports = G;
      } }), na = Ce({ "src/language-yaml/print/block.js"(o, m) {
        Be();
        var { builders: { dedent: t, dedentToRoot: p, fill: c, hardline: e, join: i, line: u, literalline: h, markAsRoot: D }, utils: { getDocParts: E } } = sr(), { getAncestorCount: C, getBlockValueLineContents: F, hasIndicatorComment: g, isLastDescendantNode: b, isNode: T } = cn(), { alignWithSpaces: G } = Yr();
        function W(B, _, U) {
          let Q = B.getValue(), H = C(B, (S) => T(S, ["sequence", "mapping"])), ge = b(B), y = [Q.type === "blockFolded" ? ">" : "|"];
          Q.indent !== null && y.push(Q.indent.toString()), Q.chomping !== "clip" && y.push(Q.chomping === "keep" ? "+" : "-"), g(Q) && y.push(" ", _("indicatorComment"));
          let R = F(Q, { parentIndent: H, isLastDescendant: ge, options: U }), v = [];
          for (let [S, l] of R.entries())
            S === 0 && v.push(e), v.push(c(E(i(u, l)))), S !== R.length - 1 ? v.push(l.length === 0 ? e : D(h)) : Q.chomping === "keep" && ge && v.push(p(l.length === 0 ? e : h));
          return Q.indent === null ? y.push(t(G(U.tabWidth, v))) : y.push(p(G(Q.indent - 1 + H, v))), y;
        }
        m.exports = W;
      } }), il = Ce({ "src/language-yaml/printer-yaml.js"(o, m) {
        Be();
        var { builders: { breakParent: t, fill: p, group: c, hardline: e, join: i, line: u, lineSuffix: h, literalline: D }, utils: { getDocParts: E, replaceTextEndOfLine: C } } = sr(), { isPreviousLineEmpty: F } = yr(), { insertPragma: g, isPragma: b } = zn(), { locStart: T } = xn(), G = ln(), { getFlowScalarLineContents: W, getLastDescendantNode: B, hasLeadingComments: _, hasMiddleComments: U, hasTrailingComment: Q, hasEndComments: H, hasPrettierIgnore: ge, isLastDescendantNode: y, isNode: R, isInlineNode: v } = cn(), S = hn(), { alignWithSpaces: l, printNextEmptyLine: A, shouldPrintEndComments: w } = Yr(), { printFlowMapping: I, printFlowSequence: O } = Sn(), M = ra(), ee = na();
        function pe(oe, Ne, Je) {
          let _e = oe.getValue(), it = [];
          _e.type !== "mappingValue" && _(_e) && it.push([i(e, oe.map(Je, "leadingComments")), e]);
          let { tag: me, anchor: Se } = _e;
          me && it.push(Je("tag")), me && Se && it.push(" "), Se && it.push(Je("anchor"));
          let Qe = "";
          R(_e, ["mapping", "sequence", "comment", "directive", "mappingItem", "sequenceItem"]) && !y(oe) && (Qe = A(oe, Ne.originalText)), (me || Se) && (R(_e, ["sequence", "mapping"]) && !U(_e) ? it.push(e) : it.push(" ")), U(_e) && it.push([_e.middleComments.length === 1 ? "" : e, i(e, oe.map(Je, "middleComments")), e]);
          let Ze = oe.getParentNode();
          return ge(oe) ? it.push(C(Ne.originalText.slice(_e.position.start.offset, _e.position.end.offset).trimEnd(), D)) : it.push(c(he(_e, Ze, oe, Ne, Je))), Q(_e) && !R(_e, ["document", "documentHead"]) && it.push(h([_e.type === "mappingValue" && !_e.content ? "" : " ", Ze.type === "mappingKey" && oe.getParentNode(2).type === "mapping" && v(_e) ? "" : t, Je("trailingComment")])), w(_e) && it.push(l(_e.type === "sequenceItem" ? 2 : 0, [e, i(e, oe.map((kt) => [F(Ne.originalText, kt.getValue(), T) ? e : "", Je()], "endComments"))])), it.push(Qe), it;
        }
        function he(oe, Ne, Je, _e, it) {
          switch (oe.type) {
            case "root": {
              let { children: me } = oe, Se = [];
              Je.each((Ze, kt) => {
                let ke = me[kt], be = me[kt + 1];
                kt !== 0 && Se.push(e), Se.push(it()), xe(ke, be) ? (Se.push(e, "..."), Q(ke) && Se.push(" ", it("trailingComment"))) : be && !Q(be.head) && Se.push(e, "---");
              }, "children");
              let Qe = B(oe);
              return (!R(Qe, ["blockLiteral", "blockFolded"]) || Qe.chomping !== "keep") && Se.push(e), Se;
            }
            case "document": {
              let me = Ne.children[Je.getName() + 1], Se = [];
              return ie(oe, me, Ne, _e) === "head" && ((oe.head.children.length > 0 || oe.head.endComments.length > 0) && Se.push(it("head")), Q(oe.head) ? Se.push(["---", " ", it(["head", "trailingComment"])]) : Se.push("---")), ce(oe) && Se.push(it("body")), i(e, Se);
            }
            case "documentHead":
              return i(e, [...Je.map(it, "children"), ...Je.map(it, "endComments")]);
            case "documentBody": {
              let { children: me, endComments: Se } = oe, Qe = "";
              if (me.length > 0 && Se.length > 0) {
                let Ze = B(oe);
                R(Ze, ["blockFolded", "blockLiteral"]) ? Ze.chomping !== "keep" && (Qe = [e, e]) : Qe = e;
              }
              return [i(e, Je.map(it, "children")), Qe, i(e, Je.map(it, "endComments"))];
            }
            case "directive":
              return ["%", i(" ", [oe.name, ...oe.parameters])];
            case "comment":
              return ["#", oe.value];
            case "alias":
              return ["*", oe.value];
            case "tag":
              return _e.originalText.slice(oe.position.start.offset, oe.position.end.offset);
            case "anchor":
              return ["&", oe.value];
            case "plain":
              return je(oe.type, _e.originalText.slice(oe.position.start.offset, oe.position.end.offset), _e);
            case "quoteDouble":
            case "quoteSingle": {
              let me = "'", Se = '"', Qe = _e.originalText.slice(oe.position.start.offset + 1, oe.position.end.offset - 1);
              if (oe.type === "quoteSingle" && Qe.includes("\\") || oe.type === "quoteDouble" && /\\[^"]/.test(Qe)) {
                let kt = oe.type === "quoteDouble" ? Se : me;
                return [kt, je(oe.type, Qe, _e), kt];
              }
              if (Qe.includes(Se))
                return [me, je(oe.type, oe.type === "quoteDouble" ? Qe.replace(/\\"/g, Se).replace(/'/g, me.repeat(2)) : Qe, _e), me];
              if (Qe.includes(me))
                return [Se, je(oe.type, oe.type === "quoteSingle" ? Qe.replace(/''/g, me) : Qe, _e), Se];
              let Ze = _e.singleQuote ? me : Se;
              return [Ze, je(oe.type, Qe, _e), Ze];
            }
            case "blockFolded":
            case "blockLiteral":
              return ee(Je, it, _e);
            case "mapping":
            case "sequence":
              return i(e, Je.map(it, "children"));
            case "sequenceItem":
              return ["- ", l(2, oe.content ? it("content") : "")];
            case "mappingKey":
            case "mappingValue":
              return oe.content ? it("content") : "";
            case "mappingItem":
            case "flowMappingItem":
              return M(oe, Ne, Je, it, _e);
            case "flowMapping":
              return I(Je, it, _e);
            case "flowSequence":
              return O(Je, it, _e);
            case "flowSequenceItem":
              return it("content");
            default:
              throw new Error(`Unexpected node type ${oe.type}`);
          }
        }
        function ce(oe) {
          return oe.body.children.length > 0 || H(oe.body);
        }
        function xe(oe, Ne) {
          return Q(oe) || Ne && (Ne.head.children.length > 0 || H(Ne.head));
        }
        function ie(oe, Ne, Je, _e) {
          return Je.children[0] === oe && /---(?:\s|$)/.test(_e.originalText.slice(T(oe), T(oe) + 4)) || oe.head.children.length > 0 || H(oe.head) || Q(oe.head) ? "head" : xe(oe, Ne) ? !1 : Ne ? "root" : !1;
        }
        function je(oe, Ne, Je) {
          let _e = W(oe, Ne, Je);
          return i(e, _e.map((it) => p(E(i(u, it)))));
        }
        function de(oe, Ne) {
          if (R(Ne))
            switch (delete Ne.position, Ne.type) {
              case "comment":
                if (b(Ne.value))
                  return null;
                break;
              case "quoteDouble":
              case "quoteSingle":
                Ne.type = "quote";
                break;
            }
        }
        m.exports = { preprocess: S, embed: G, print: pe, massageAstNode: de, insertPragma: g };
      } }), ul = Ce({ "src/language-yaml/options.js"(o, m) {
        Be();
        var t = Ki();
        m.exports = { bracketSpacing: t.bracketSpacing, singleQuote: t.singleQuote, proseWrap: t.proseWrap };
      } }), sl = Ce({ "src/language-yaml/parsers.js"() {
        Be();
      } }), ol = Ce({ "node_modules/linguist-languages/data/YAML.json"(o, m) {
        m.exports = { name: "YAML", type: "data", color: "#cb171e", tmScope: "source.yaml", aliases: ["yml"], extensions: [".yml", ".mir", ".reek", ".rviz", ".sublime-syntax", ".syntax", ".yaml", ".yaml-tmlanguage", ".yaml.sed", ".yml.mysql"], filenames: [".clang-format", ".clang-tidy", ".gemrc", "CITATION.cff", "glide.lock", "yarn.lock"], aceMode: "yaml", codemirrorMode: "yaml", codemirrorMimeType: "text/x-yaml", languageId: 407 };
      } }), al = Ce({ "src/language-yaml/index.js"(o, m) {
        Be();
        var t = bi(), p = il(), c = ul(), e = sl(), i = [t(ol(), (u) => ({ since: "1.14.0", parsers: ["yaml"], vscodeLanguageIds: ["yaml", "ansible", "home-assistant"], filenames: [...u.filenames.filter((h) => h !== "yarn.lock"), ".prettierrc", ".stylelintrc", ".lintstagedrc"] }))];
        m.exports = { languages: i, printers: { yaml: p }, options: c, parsers: e };
      } }), ll = Ce({ "src/languages.js"(o, m) {
        Be(), m.exports = [Ko(), io(), Z(), L(), tr(), wn(), al()];
      } });
      Be();
      var { version: cl } = vn(), Hu = Bo(), { getSupportInfo: pl } = cs(), fl = No(), dl = ll(), hl = sr();
      function vu(o) {
        let m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        return function() {
          for (var t = arguments.length, p = new Array(t), c = 0; c < t; c++)
            p[c] = arguments[c];
          let e = p[m] || {}, i = e.plugins || [];
          return p[m] = Object.assign(Object.assign({}, e), {}, { plugins: [...dl, ...Array.isArray(i) ? i : Object.values(i)] }), o(...p);
        };
      }
      var Ya = vu(Hu.formatWithCursor);
      ze.exports = { formatWithCursor: Ya, format(o, m) {
        return Ya(o, m).formatted;
      }, check(o, m) {
        let { formatted: t } = Ya(o, m);
        return t === o;
      }, doc: hl, getSupportInfo: vu(pl, 0), version: cl, util: fl, __debug: { parse: vu(Hu.parse), formatAST: vu(Hu.formatAST), formatDoc: vu(Hu.formatDoc), printToDoc: vu(Hu.printToDoc), printDocToString: vu(Hu.printDocToString) } };
    });
    return In();
  });
})(standalone);
const prettier = /* @__PURE__ */ getDefaultExportFromCjs(standaloneExports);
var parserPostcssExports = {}, parserPostcss = {
  get exports() {
    return parserPostcssExports;
  },
  set exports(f) {
    parserPostcssExports = f;
  }
};
(function(f, k) {
  (function(j) {
    f.exports = j();
  })(function() {
    var j = (qt, ft) => () => (ft || qt((ft = { exports: {} }).exports, ft), ft.exports), we = j((qt, ft) => {
      var J = function(fe) {
        return fe && fe.Math == Math && fe;
      };
      ft.exports = J(typeof globalThis == "object" && globalThis) || J(typeof window == "object" && window) || J(typeof self == "object" && self) || J(typeof commonjsGlobal == "object" && commonjsGlobal) || function() {
        return this;
      }() || Function("return this")();
    }), st = j((qt, ft) => {
      ft.exports = function(J) {
        try {
          return !!J();
        } catch {
          return !0;
        }
      };
    }), Le = j((qt, ft) => {
      var J = st();
      ft.exports = !J(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }), pt = j((qt, ft) => {
      var J = st();
      ft.exports = !J(function() {
        var fe = function() {
        }.bind();
        return typeof fe != "function" || fe.hasOwnProperty("prototype");
      });
    }), hr = j((qt, ft) => {
      var J = pt(), fe = Function.prototype.call;
      ft.exports = J ? fe.bind(fe) : function() {
        return fe.apply(fe, arguments);
      };
    }), br = j((qt) => {
      var ft = {}.propertyIsEnumerable, J = Object.getOwnPropertyDescriptor, fe = J && !ft.call({ 1: 2 }, 1);
      qt.f = fe ? function(Ee) {
        var Pe = J(this, Ee);
        return !!Pe && Pe.enumerable;
      } : ft;
    }), Pr = j((qt, ft) => {
      ft.exports = function(J, fe) {
        return { enumerable: !(J & 1), configurable: !(J & 2), writable: !(J & 4), value: fe };
      };
    }), Ir = j((qt, ft) => {
      var J = pt(), fe = Function.prototype, Ee = fe.call, Pe = J && fe.bind.bind(Ee, Ee);
      ft.exports = J ? Pe : function(et) {
        return function() {
          return Ee.apply(et, arguments);
        };
      };
    }), Pn = j((qt, ft) => {
      var J = Ir(), fe = J({}.toString), Ee = J("".slice);
      ft.exports = function(Pe) {
        return Ee(fe(Pe), 8, -1);
      };
    }), fn = j((qt, ft) => {
      var J = Ir(), fe = st(), Ee = Pn(), Pe = Object, et = J("".split);
      ft.exports = fe(function() {
        return !Pe("z").propertyIsEnumerable(0);
      }) ? function(Ae) {
        return Ee(Ae) == "String" ? et(Ae, "") : Pe(Ae);
      } : Pe;
    }), nn = j((qt, ft) => {
      ft.exports = function(J) {
        return J == null;
      };
    }), Mr = j((qt, ft) => {
      var J = nn(), fe = TypeError;
      ft.exports = function(Ee) {
        if (J(Ee))
          throw fe("Can't call method on " + Ee);
        return Ee;
      };
    }), zr = j((qt, ft) => {
      var J = fn(), fe = Mr();
      ft.exports = function(Ee) {
        return J(fe(Ee));
      };
    }), mn = j((qt, ft) => {
      var J = typeof document == "object" && document.all, fe = typeof J > "u" && J !== void 0;
      ft.exports = { all: J, IS_HTMLDDA: fe };
    }), qr = j((qt, ft) => {
      var J = mn(), fe = J.all;
      ft.exports = J.IS_HTMLDDA ? function(Ee) {
        return typeof Ee == "function" || Ee === fe;
      } : function(Ee) {
        return typeof Ee == "function";
      };
    }), An = j((qt, ft) => {
      var J = qr(), fe = mn(), Ee = fe.all;
      ft.exports = fe.IS_HTMLDDA ? function(Pe) {
        return typeof Pe == "object" ? Pe !== null : J(Pe) || Pe === Ee;
      } : function(Pe) {
        return typeof Pe == "object" ? Pe !== null : J(Pe);
      };
    }), Rn = j((qt, ft) => {
      var J = we(), fe = qr(), Ee = function(Pe) {
        return fe(Pe) ? Pe : void 0;
      };
      ft.exports = function(Pe, et) {
        return arguments.length < 2 ? Ee(J[Pe]) : J[Pe] && J[Pe][et];
      };
    }), li = j((qt, ft) => {
      var J = Ir();
      ft.exports = J({}.isPrototypeOf);
    }), ci = j((qt, ft) => {
      var J = Rn();
      ft.exports = J("navigator", "userAgent") || "";
    }), Ei = j((qt, ft) => {
      var J = we(), fe = ci(), Ee = J.process, Pe = J.Deno, et = Ee && Ee.versions || Pe && Pe.version, Ae = et && et.v8, lt, wt;
      Ae && (lt = Ae.split("."), wt = lt[0] > 0 && lt[0] < 4 ? 1 : +(lt[0] + lt[1])), !wt && fe && (lt = fe.match(/Edge\/(\d+)/), (!lt || lt[1] >= 74) && (lt = fe.match(/Chrome\/(\d+)/), lt && (wt = +lt[1]))), ft.exports = wt;
    }), Xr = j((qt, ft) => {
      var J = Ei(), fe = st();
      ft.exports = !!Object.getOwnPropertySymbols && !fe(function() {
        var Ee = Symbol();
        return !String(Ee) || !(Object(Ee) instanceof Symbol) || !Symbol.sham && J && J < 41;
      });
    }), gn = j((qt, ft) => {
      var J = Xr();
      ft.exports = J && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }), yn = j((qt, ft) => {
      var J = Rn(), fe = qr(), Ee = li(), Pe = gn(), et = Object;
      ft.exports = Pe ? function(Ae) {
        return typeof Ae == "symbol";
      } : function(Ae) {
        var lt = J("Symbol");
        return fe(lt) && Ee(lt.prototype, et(Ae));
      };
    }), pi = j((qt, ft) => {
      var J = String;
      ft.exports = function(fe) {
        try {
          return J(fe);
        } catch {
          return "Object";
        }
      };
    }), Ci = j((qt, ft) => {
      var J = qr(), fe = pi(), Ee = TypeError;
      ft.exports = function(Pe) {
        if (J(Pe))
          return Pe;
        throw Ee(fe(Pe) + " is not a function");
      };
    }), Qn = j((qt, ft) => {
      var J = Ci(), fe = nn();
      ft.exports = function(Ee, Pe) {
        var et = Ee[Pe];
        return fe(et) ? void 0 : J(et);
      };
    }), ji = j((qt, ft) => {
      var J = hr(), fe = qr(), Ee = An(), Pe = TypeError;
      ft.exports = function(et, Ae) {
        var lt, wt;
        if (Ae === "string" && fe(lt = et.toString) && !Ee(wt = J(lt, et)) || fe(lt = et.valueOf) && !Ee(wt = J(lt, et)) || Ae !== "string" && fe(lt = et.toString) && !Ee(wt = J(lt, et)))
          return wt;
        throw Pe("Can't convert object to primitive value");
      };
    }), fi = j((qt, ft) => {
      ft.exports = !1;
    }), Bn = j((qt, ft) => {
      var J = we(), fe = Object.defineProperty;
      ft.exports = function(Ee, Pe) {
        try {
          fe(J, Ee, { value: Pe, configurable: !0, writable: !0 });
        } catch {
          J[Ee] = Pe;
        }
        return Pe;
      };
    }), Vn = j((qt, ft) => {
      var J = we(), fe = Bn(), Ee = "__core-js_shared__", Pe = J[Ee] || fe(Ee, {});
      ft.exports = Pe;
    }), Yi = j((qt, ft) => {
      var J = fi(), fe = Vn();
      (ft.exports = function(Ee, Pe) {
        return fe[Ee] || (fe[Ee] = Pe !== void 0 ? Pe : {});
      })("versions", []).push({ version: "3.26.1", mode: J ? "pure" : "global", copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)", license: "https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE", source: "https://github.com/zloirock/core-js" });
    }), Qi = j((qt, ft) => {
      var J = Mr(), fe = Object;
      ft.exports = function(Ee) {
        return fe(J(Ee));
      };
    }), en = j((qt, ft) => {
      var J = Ir(), fe = Qi(), Ee = J({}.hasOwnProperty);
      ft.exports = Object.hasOwn || function(Pe, et) {
        return Ee(fe(Pe), et);
      };
    }), Zi = j((qt, ft) => {
      var J = Ir(), fe = 0, Ee = Math.random(), Pe = J(1 .toString);
      ft.exports = function(et) {
        return "Symbol(" + (et === void 0 ? "" : et) + ")_" + Pe(++fe + Ee, 36);
      };
    }), di = j((qt, ft) => {
      var J = we(), fe = Yi(), Ee = en(), Pe = Zi(), et = Xr(), Ae = gn(), lt = fe("wks"), wt = J.Symbol, Rt = wt && wt.for, Ye = Ae ? wt : wt && wt.withoutSetter || Pe;
      ft.exports = function(Ht) {
        if (!Ee(lt, Ht) || !(et || typeof lt[Ht] == "string")) {
          var ur = "Symbol." + Ht;
          et && Ee(wt, Ht) ? lt[Ht] = wt[Ht] : Ae && Rt ? lt[Ht] = Rt(ur) : lt[Ht] = Ye(ur);
        }
        return lt[Ht];
      };
    }), bu = j((qt, ft) => {
      var J = hr(), fe = An(), Ee = yn(), Pe = Qn(), et = ji(), Ae = di(), lt = TypeError, wt = Ae("toPrimitive");
      ft.exports = function(Rt, Ye) {
        if (!fe(Rt) || Ee(Rt))
          return Rt;
        var Ht = Pe(Rt, wt), ur;
        if (Ht) {
          if (Ye === void 0 && (Ye = "default"), ur = J(Ht, Rt, Ye), !fe(ur) || Ee(ur))
            return ur;
          throw lt("Can't convert object to primitive value");
        }
        return Ye === void 0 && (Ye = "number"), et(Rt, Ye);
      };
    }), ui = j((qt, ft) => {
      var J = bu(), fe = yn();
      ft.exports = function(Ee) {
        var Pe = J(Ee, "string");
        return fe(Pe) ? Pe : Pe + "";
      };
    }), Pi = j((qt, ft) => {
      var J = we(), fe = An(), Ee = J.document, Pe = fe(Ee) && fe(Ee.createElement);
      ft.exports = function(et) {
        return Pe ? Ee.createElement(et) : {};
      };
    }), _i = j((qt, ft) => {
      var J = Le(), fe = st(), Ee = Pi();
      ft.exports = !J && !fe(function() {
        return Object.defineProperty(Ee("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }), eu = j((qt) => {
      var ft = Le(), J = hr(), fe = br(), Ee = Pr(), Pe = zr(), et = ui(), Ae = en(), lt = _i(), wt = Object.getOwnPropertyDescriptor;
      qt.f = ft ? wt : function(Rt, Ye) {
        if (Rt = Pe(Rt), Ye = et(Ye), lt)
          try {
            return wt(Rt, Ye);
          } catch {
          }
        if (Ae(Rt, Ye))
          return Ee(!J(fe.f, Rt, Ye), Rt[Ye]);
      };
    }), Eu = j((qt, ft) => {
      var J = Le(), fe = st();
      ft.exports = J && fe(function() {
        return Object.defineProperty(function() {
        }, "prototype", { value: 42, writable: !1 }).prototype != 42;
      });
    }), ei = j((qt, ft) => {
      var J = An(), fe = String, Ee = TypeError;
      ft.exports = function(Pe) {
        if (J(Pe))
          return Pe;
        throw Ee(fe(Pe) + " is not an object");
      };
    }), _n = j((qt) => {
      var ft = Le(), J = _i(), fe = Eu(), Ee = ei(), Pe = ui(), et = TypeError, Ae = Object.defineProperty, lt = Object.getOwnPropertyDescriptor, wt = "enumerable", Rt = "configurable", Ye = "writable";
      qt.f = ft ? fe ? function(Ht, ur, xr) {
        if (Ee(Ht), ur = Pe(ur), Ee(xr), typeof Ht == "function" && ur === "prototype" && "value" in xr && Ye in xr && !xr[Ye]) {
          var Tr = lt(Ht, ur);
          Tr && Tr[Ye] && (Ht[ur] = xr.value, xr = { configurable: Rt in xr ? xr[Rt] : Tr[Rt], enumerable: wt in xr ? xr[wt] : Tr[wt], writable: !1 });
        }
        return Ae(Ht, ur, xr);
      } : Ae : function(Ht, ur, xr) {
        if (Ee(Ht), ur = Pe(ur), Ee(xr), J)
          try {
            return Ae(Ht, ur, xr);
          } catch {
          }
        if ("get" in xr || "set" in xr)
          throw et("Accessors not supported");
        return "value" in xr && (Ht[ur] = xr.value), Ht;
      };
    }), qn = j((qt, ft) => {
      var J = Le(), fe = _n(), Ee = Pr();
      ft.exports = J ? function(Pe, et, Ae) {
        return fe.f(Pe, et, Ee(1, Ae));
      } : function(Pe, et, Ae) {
        return Pe[et] = Ae, Pe;
      };
    }), Ii = j((qt, ft) => {
      var J = Le(), fe = en(), Ee = Function.prototype, Pe = J && Object.getOwnPropertyDescriptor, et = fe(Ee, "name"), Ae = et && function() {
      }.name === "something", lt = et && (!J || J && Pe(Ee, "name").configurable);
      ft.exports = { EXISTS: et, PROPER: Ae, CONFIGURABLE: lt };
    }), tu = j((qt, ft) => {
      var J = Ir(), fe = qr(), Ee = Vn(), Pe = J(Function.toString);
      fe(Ee.inspectSource) || (Ee.inspectSource = function(et) {
        return Pe(et);
      }), ft.exports = Ee.inspectSource;
    }), ru = j((qt, ft) => {
      var J = we(), fe = qr(), Ee = J.WeakMap;
      ft.exports = fe(Ee) && /native code/.test(String(Ee));
    }), xi = j((qt, ft) => {
      var J = Yi(), fe = Zi(), Ee = J("keys");
      ft.exports = function(Pe) {
        return Ee[Pe] || (Ee[Pe] = fe(Pe));
      };
    }), Nn = j((qt, ft) => {
      ft.exports = {};
    }), si = j((qt, ft) => {
      var J = ru(), fe = we(), Ee = An(), Pe = qn(), et = en(), Ae = Vn(), lt = xi(), wt = Nn(), Rt = "Object already initialized", Ye = fe.TypeError, Ht = fe.WeakMap, ur, xr, Tr, $r = function(Lr) {
        return Tr(Lr) ? xr(Lr) : ur(Lr, {});
      }, Wr = function(Lr) {
        return function(sn) {
          var In;
          if (!Ee(sn) || (In = xr(sn)).type !== Lr)
            throw Ye("Incompatible receiver, " + Lr + " required");
          return In;
        };
      };
      J || Ae.state ? (wr = Ae.state || (Ae.state = new Ht()), wr.get = wr.get, wr.has = wr.has, wr.set = wr.set, ur = function(Lr, sn) {
        if (wr.has(Lr))
          throw Ye(Rt);
        return sn.facade = Lr, wr.set(Lr, sn), sn;
      }, xr = function(Lr) {
        return wr.get(Lr) || {};
      }, Tr = function(Lr) {
        return wr.has(Lr);
      }) : (un = lt("state"), wt[un] = !0, ur = function(Lr, sn) {
        if (et(Lr, un))
          throw Ye(Rt);
        return sn.facade = Lr, Pe(Lr, un, sn), sn;
      }, xr = function(Lr) {
        return et(Lr, un) ? Lr[un] : {};
      }, Tr = function(Lr) {
        return et(Lr, un);
      });
      var wr, un;
      ft.exports = { set: ur, get: xr, has: Tr, enforce: $r, getterFor: Wr };
    }), Fi = j((qt, ft) => {
      var J = st(), fe = qr(), Ee = en(), Pe = Le(), et = Ii().CONFIGURABLE, Ae = tu(), lt = si(), wt = lt.enforce, Rt = lt.get, Ye = Object.defineProperty, Ht = Pe && !J(function() {
        return Ye(function() {
        }, "length", { value: 8 }).length !== 8;
      }), ur = String(String).split("String"), xr = ft.exports = function(Tr, $r, Wr) {
        String($r).slice(0, 7) === "Symbol(" && ($r = "[" + String($r).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"), Wr && Wr.getter && ($r = "get " + $r), Wr && Wr.setter && ($r = "set " + $r), (!Ee(Tr, "name") || et && Tr.name !== $r) && (Pe ? Ye(Tr, "name", { value: $r, configurable: !0 }) : Tr.name = $r), Ht && Wr && Ee(Wr, "arity") && Tr.length !== Wr.arity && Ye(Tr, "length", { value: Wr.arity });
        try {
          Wr && Ee(Wr, "constructor") && Wr.constructor ? Pe && Ye(Tr, "prototype", { writable: !1 }) : Tr.prototype && (Tr.prototype = void 0);
        } catch {
        }
        var wr = wt(Tr);
        return Ee(wr, "source") || (wr.source = ur.join(typeof $r == "string" ? $r : "")), Tr;
      };
      Function.prototype.toString = xr(function() {
        return fe(this) && Rt(this).source || Ae(this);
      }, "toString");
    }), Oi = j((qt, ft) => {
      var J = qr(), fe = _n(), Ee = Fi(), Pe = Bn();
      ft.exports = function(et, Ae, lt, wt) {
        wt || (wt = {});
        var Rt = wt.enumerable, Ye = wt.name !== void 0 ? wt.name : Ae;
        if (J(lt) && Ee(lt, Ye, wt), wt.global)
          Rt ? et[Ae] = lt : Pe(Ae, lt);
        else {
          try {
            wt.unsafe ? et[Ae] && (Rt = !0) : delete et[Ae];
          } catch {
          }
          Rt ? et[Ae] = lt : fe.f(et, Ae, { value: lt, enumerable: !1, configurable: !wt.nonConfigurable, writable: !wt.nonWritable });
        }
        return et;
      };
    }), Cu = j((qt, ft) => {
      var J = Math.ceil, fe = Math.floor;
      ft.exports = Math.trunc || function(Ee) {
        var Pe = +Ee;
        return (Pe > 0 ? fe : J)(Pe);
      };
    }), oi = j((qt, ft) => {
      var J = Cu();
      ft.exports = function(fe) {
        var Ee = +fe;
        return Ee !== Ee || Ee === 0 ? 0 : J(Ee);
      };
    }), xu = j((qt, ft) => {
      var J = oi(), fe = Math.max, Ee = Math.min;
      ft.exports = function(Pe, et) {
        var Ae = J(Pe);
        return Ae < 0 ? fe(Ae + et, 0) : Ee(Ae, et);
      };
    }), nu = j((qt, ft) => {
      var J = oi(), fe = Math.min;
      ft.exports = function(Ee) {
        return Ee > 0 ? fe(J(Ee), 9007199254740991) : 0;
      };
    }), Jn = j((qt, ft) => {
      var J = nu();
      ft.exports = function(fe) {
        return J(fe.length);
      };
    }), Ku = j((qt, ft) => {
      var J = zr(), fe = xu(), Ee = Jn(), Pe = function(et) {
        return function(Ae, lt, wt) {
          var Rt = J(Ae), Ye = Ee(Rt), Ht = fe(wt, Ye), ur;
          if (et && lt != lt) {
            for (; Ye > Ht; )
              if (ur = Rt[Ht++], ur != ur)
                return !0;
          } else
            for (; Ye > Ht; Ht++)
              if ((et || Ht in Rt) && Rt[Ht] === lt)
                return et || Ht || 0;
          return !et && -1;
        };
      };
      ft.exports = { includes: Pe(!0), indexOf: Pe(!1) };
    }), Yu = j((qt, ft) => {
      var J = Ir(), fe = en(), Ee = zr(), Pe = Ku().indexOf, et = Nn(), Ae = J([].push);
      ft.exports = function(lt, wt) {
        var Rt = Ee(lt), Ye = 0, Ht = [], ur;
        for (ur in Rt)
          !fe(et, ur) && fe(Rt, ur) && Ae(Ht, ur);
        for (; wt.length > Ye; )
          fe(Rt, ur = wt[Ye++]) && (~Pe(Ht, ur) || Ae(Ht, ur));
        return Ht;
      };
    }), iu = j((qt, ft) => {
      ft.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }), Qu = j((qt) => {
      var ft = Yu(), J = iu(), fe = J.concat("length", "prototype");
      qt.f = Object.getOwnPropertyNames || function(Ee) {
        return ft(Ee, fe);
      };
    }), Zu = j((qt) => {
      qt.f = Object.getOwnPropertySymbols;
    }), es = j((qt, ft) => {
      var J = Rn(), fe = Ir(), Ee = Qu(), Pe = Zu(), et = ei(), Ae = fe([].concat);
      ft.exports = J("Reflect", "ownKeys") || function(lt) {
        var wt = Ee.f(et(lt)), Rt = Pe.f;
        return Rt ? Ae(wt, Rt(lt)) : wt;
      };
    }), ts = j((qt, ft) => {
      var J = en(), fe = es(), Ee = eu(), Pe = _n();
      ft.exports = function(et, Ae, lt) {
        for (var wt = fe(Ae), Rt = Pe.f, Ye = Ee.f, Ht = 0; Ht < wt.length; Ht++) {
          var ur = wt[Ht];
          !J(et, ur) && !(lt && J(lt, ur)) && Rt(et, ur, Ye(Ae, ur));
        }
      };
    }), rs = j((qt, ft) => {
      var J = st(), fe = qr(), Ee = /#|\.prototype\./, Pe = function(Rt, Ye) {
        var Ht = Ae[et(Rt)];
        return Ht == wt ? !0 : Ht == lt ? !1 : fe(Ye) ? J(Ye) : !!Ye;
      }, et = Pe.normalize = function(Rt) {
        return String(Rt).replace(Ee, ".").toLowerCase();
      }, Ae = Pe.data = {}, lt = Pe.NATIVE = "N", wt = Pe.POLYFILL = "P";
      ft.exports = Pe;
    }), Li = j((qt, ft) => {
      var J = we(), fe = eu().f, Ee = qn(), Pe = Oi(), et = Bn(), Ae = ts(), lt = rs();
      ft.exports = function(wt, Rt) {
        var Ye = wt.target, Ht = wt.global, ur = wt.stat, xr, Tr, $r, Wr, wr, un;
        if (Ht ? Tr = J : ur ? Tr = J[Ye] || et(Ye, {}) : Tr = (J[Ye] || {}).prototype, Tr)
          for ($r in Rt) {
            if (wr = Rt[$r], wt.dontCallGetSet ? (un = fe(Tr, $r), Wr = un && un.value) : Wr = Tr[$r], xr = lt(Ht ? $r : Ye + (ur ? "." : "#") + $r, wt.forced), !xr && Wr !== void 0) {
              if (typeof wr == typeof Wr)
                continue;
              Ae(wr, Wr);
            }
            (wt.sham || Wr && Wr.sham) && Ee(wr, "sham", !0), Pe(Tr, $r, wr, wt);
          }
      };
    }), uu = j(() => {
      var qt = Li(), ft = we();
      qt({ global: !0, forced: ft.globalThis !== ft }, { globalThis: ft });
    }), Fu = j(() => {
      uu();
    }), Au = j((qt, ft) => {
      Fu();
      var J = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, Ee = Object.getOwnPropertyNames, Pe = Object.prototype.hasOwnProperty, et = (a, z) => function() {
        return a && (z = (0, a[Ee(a)[0]])(a = 0)), z;
      }, Ae = (a, z) => function() {
        return z || (0, a[Ee(a)[0]])((z = { exports: {} }).exports, z), z.exports;
      }, lt = (a, z) => {
        for (var $ in z)
          J(a, $, { get: z[$], enumerable: !0 });
      }, wt = (a, z, $, V) => {
        if (z && typeof z == "object" || typeof z == "function")
          for (let Y of Ee(z))
            !Pe.call(a, Y) && Y !== $ && J(a, Y, { get: () => z[Y], enumerable: !(V = fe(z, Y)) || V.enumerable });
        return a;
      }, Rt = (a) => wt(J({}, "__esModule", { value: !0 }), a), Ye = et({ "<define:process>"() {
      } }), Ht = Ae({ "src/common/parser-create-error.js"(a, z) {
        Ye();
        function $(V, Y) {
          let te = new SyntaxError(V + " (" + Y.start.line + ":" + Y.start.column + ")");
          return te.loc = Y, te;
        }
        z.exports = $;
      } }), ur = Ae({ "src/utils/get-last.js"(a, z) {
        Ye();
        var $ = (V) => V[V.length - 1];
        z.exports = $;
      } }), xr = Ae({ "src/utils/front-matter/parse.js"(a, z) {
        Ye();
        var $ = new RegExp("^(?<startDelimiter>-{3}|\\+{3})(?<language>[^\\n]*)\\n(?:|(?<value>.*?)\\n)(?<endDelimiter>\\k<startDelimiter>|\\.{3})[^\\S\\n]*(?:\\n|$)", "s");
        function V(Y) {
          let te = Y.match($);
          if (!te)
            return { content: Y };
          let { startDelimiter: Z, language: ne, value: X = "", endDelimiter: re } = te.groups, d = ne.trim() || "yaml";
          if (Z === "+++" && (d = "toml"), d !== "yaml" && Z !== re)
            return { content: Y };
          let [n] = te;
          return { frontMatter: { type: "front-matter", lang: d, value: X, startDelimiter: Z, endDelimiter: re, raw: n.replace(/\n$/, "") }, content: n.replace(/[^\n]/g, " ") + Y.slice(n.length) };
        }
        z.exports = V;
      } }), Tr = {};
      lt(Tr, { EOL: () => Bt, arch: () => Ge, cpus: () => In, default: () => Gt, endianness: () => $r, freemem: () => Lr, getNetworkInterfaces: () => He, hostname: () => Wr, loadavg: () => wr, networkInterfaces: () => $e, platform: () => at, release: () => ze, tmpDir: () => Dt, tmpdir: () => xt, totalmem: () => sn, type: () => St, uptime: () => un });
      function $r() {
        if (typeof Tt > "u") {
          var a = new ArrayBuffer(2), z = new Uint8Array(a), $ = new Uint16Array(a);
          if (z[0] = 1, z[1] = 2, $[0] === 258)
            Tt = "BE";
          else if ($[0] === 513)
            Tt = "LE";
          else
            throw new Error("unable to figure out endianess");
        }
        return Tt;
      }
      function Wr() {
        return typeof globalThis.location < "u" ? globalThis.location.hostname : "";
      }
      function wr() {
        return [];
      }
      function un() {
        return 0;
      }
      function Lr() {
        return Number.MAX_VALUE;
      }
      function sn() {
        return Number.MAX_VALUE;
      }
      function In() {
        return [];
      }
      function St() {
        return "Browser";
      }
      function ze() {
        return typeof globalThis.navigator < "u" ? globalThis.navigator.appVersion : "";
      }
      function $e() {
      }
      function He() {
      }
      function Ge() {
        return "javascript";
      }
      function at() {
        return "browser";
      }
      function Dt() {
        return "/tmp";
      }
      var Tt, xt, Bt, Gt, Kt = et({ "node-modules-polyfills:os"() {
        Ye(), xt = Dt, Bt = `
`, Gt = { EOL: Bt, tmpdir: xt, tmpDir: Dt, networkInterfaces: $e, getNetworkInterfaces: He, release: ze, type: St, cpus: In, totalmem: sn, freemem: Lr, uptime: un, loadavg: wr, hostname: Wr, endianness: $r };
      } }), Zt = Ae({ "node-modules-polyfills-commonjs:os"(a, z) {
        Ye();
        var $ = (Kt(), Rt(Tr));
        if ($ && $.default) {
          z.exports = $.default;
          for (let V in $)
            z.exports[V] = $[V];
        } else
          $ && (z.exports = $);
      } }), Wt = Ae({ "node_modules/detect-newline/index.js"(a, z) {
        Ye();
        var $ = (V) => {
          if (typeof V != "string")
            throw new TypeError("Expected a string");
          let Y = V.match(/(?:\r?\n)/g) || [];
          if (Y.length === 0)
            return;
          let te = Y.filter((ne) => ne === `\r
`).length, Z = Y.length - te;
          return te > Z ? `\r
` : `
`;
        };
        z.exports = $, z.exports.graceful = (V) => typeof V == "string" && $(V) || `
`;
      } }), Ce = Ae({ "node_modules/jest-docblock/build/index.js"(a) {
        Ye(), Object.defineProperty(a, "__esModule", { value: !0 }), a.extract = L, a.parse = ue, a.parseWithComments = ve, a.print = De, a.strip = ae;
        function z() {
          let Ie = Zt();
          return z = function() {
            return Ie;
          }, Ie;
        }
        function $() {
          let Ie = V(Wt());
          return $ = function() {
            return Ie;
          }, Ie;
        }
        function V(Ie) {
          return Ie && Ie.__esModule ? Ie : { default: Ie };
        }
        var Y = /\*\/$/, te = /^\/\*\*?/, Z = /^\s*(\/\*\*?(.|\r?\n)*?\*\/)/, ne = /(^|\s+)\/\/([^\r\n]*)/g, X = /^(\r?\n)+/, re = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *(?![^@\r\n]*\/\/[^]*)([^@\r\n\s][^@\r\n]+?) *\r?\n/g, d = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g, n = /(\r?\n|^) *\* ?/g, q = [];
        function L(Ie) {
          let Me = Ie.match(Z);
          return Me ? Me[0].trimLeft() : "";
        }
        function ae(Ie) {
          let Me = Ie.match(Z);
          return Me && Me[0] ? Ie.substring(Me[0].length) : Ie;
        }
        function ue(Ie) {
          return ve(Ie).pragmas;
        }
        function ve(Ie) {
          let Me = (0, $().default)(Ie) || z().EOL;
          Ie = Ie.replace(te, "").replace(Y, "").replace(n, "$1");
          let We = "";
          for (; We !== Ie; )
            We = Ie, Ie = Ie.replace(re, `${Me}$1 $2${Me}`);
          Ie = Ie.replace(X, "").trimRight();
          let Ft = /* @__PURE__ */ Object.create(null), Pt = Ie.replace(d, "").replace(X, "").trimRight(), Mt;
          for (; Mt = d.exec(Ie); ) {
            let rr = Mt[2].replace(ne, "");
            typeof Ft[Mt[1]] == "string" || Array.isArray(Ft[Mt[1]]) ? Ft[Mt[1]] = q.concat(Ft[Mt[1]], rr) : Ft[Mt[1]] = rr;
          }
          return { comments: Pt, pragmas: Ft };
        }
        function De(Ie) {
          let { comments: Me = "", pragmas: We = {} } = Ie, Ft = (0, $().default)(Me) || z().EOL, Pt = "/**", Mt = " *", rr = " */", tr = Object.keys(We), pr = tr.map((ir) => le(ir, We[ir])).reduce((ir, At) => ir.concat(At), []).map((ir) => `${Mt} ${ir}${Ft}`).join("");
          if (!Me) {
            if (tr.length === 0)
              return "";
            if (tr.length === 1 && !Array.isArray(We[tr[0]])) {
              let ir = We[tr[0]];
              return `${Pt} ${le(tr[0], ir)[0]}${rr}`;
            }
          }
          let er = Me.split(Ft).map((ir) => `${Mt} ${ir}`).join(Ft) + Ft;
          return Pt + Ft + (Me ? er : "") + (Me && tr.length ? Mt + Ft : "") + pr + rr;
        }
        function le(Ie, Me) {
          return q.concat(Me).map((We) => `@${Ie} ${We}`.trim());
        }
      } }), ar = Ae({ "src/common/end-of-line.js"(a, z) {
        Ye();
        function $(Z) {
          let ne = Z.indexOf("\r");
          return ne >= 0 ? Z.charAt(ne + 1) === `
` ? "crlf" : "cr" : "lf";
        }
        function V(Z) {
          switch (Z) {
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
        function Y(Z, ne) {
          let X;
          switch (ne) {
            case `
`:
              X = /\n/g;
              break;
            case "\r":
              X = /\r/g;
              break;
            case `\r
`:
              X = /\r\n/g;
              break;
            default:
              throw new Error(`Unexpected "eol" ${JSON.stringify(ne)}.`);
          }
          let re = Z.match(X);
          return re ? re.length : 0;
        }
        function te(Z) {
          return Z.replace(/\r\n?/g, `
`);
        }
        z.exports = { guessEndOfLine: $, convertEndOfLineToChars: V, countEndOfLineChars: Y, normalizeEndOfLine: te };
      } }), Er = Ae({ "src/language-js/utils/get-shebang.js"(a, z) {
        Ye();
        function $(V) {
          if (!V.startsWith("#!"))
            return "";
          let Y = V.indexOf(`
`);
          return Y === -1 ? V : V.slice(0, Y);
        }
        z.exports = $;
      } }), jr = Ae({ "src/language-js/pragma.js"(a, z) {
        Ye();
        var { parseWithComments: $, strip: V, extract: Y, print: te } = Ce(), { normalizeEndOfLine: Z } = ar(), ne = Er();
        function X(n) {
          let q = ne(n);
          q && (n = n.slice(q.length + 1));
          let L = Y(n), { pragmas: ae, comments: ue } = $(L);
          return { shebang: q, text: n, pragmas: ae, comments: ue };
        }
        function re(n) {
          let q = Object.keys(X(n).pragmas);
          return q.includes("prettier") || q.includes("format");
        }
        function d(n) {
          let { shebang: q, text: L, pragmas: ae, comments: ue } = X(n), ve = V(L), De = te({ pragmas: Object.assign({ format: "" }, ae), comments: ue.trimStart() });
          return (q ? `${q}
` : "") + Z(De) + (ve.startsWith(`
`) ? `
` : `

`) + ve;
        }
        z.exports = { hasPragma: re, insertPragma: d };
      } }), Nr = Ae({ "src/language-css/pragma.js"(a, z) {
        Ye();
        var $ = jr(), V = xr();
        function Y(Z) {
          return $.hasPragma(V(Z).content);
        }
        function te(Z) {
          let { frontMatter: ne, content: X } = V(Z);
          return (ne ? ne.raw + `

` : "") + $.insertPragma(X);
        }
        z.exports = { hasPragma: Y, insertPragma: te };
      } }), Kr = Ae({ "src/utils/text/skip.js"(a, z) {
        Ye();
        function $(ne) {
          return (X, re, d) => {
            let n = d && d.backwards;
            if (re === !1)
              return !1;
            let { length: q } = X, L = re;
            for (; L >= 0 && L < q; ) {
              let ae = X.charAt(L);
              if (ne instanceof RegExp) {
                if (!ne.test(ae))
                  return L;
              } else if (!ne.includes(ae))
                return L;
              n ? L-- : L++;
            }
            return L === -1 || L === q ? L : !1;
          };
        }
        var V = $(/\s/), Y = $(" 	"), te = $(",; 	"), Z = $(/[^\n\r]/);
        z.exports = { skipWhitespace: V, skipSpaces: Y, skipToLineEnd: te, skipEverythingButNewLine: Z };
      } }), Be = Ae({ "src/utils/line-column-to-index.js"(a, z) {
        Ye(), z.exports = function($, V) {
          let Y = 0;
          for (let te = 0; te < $.line - 1; ++te)
            Y = V.indexOf(`
`, Y) + 1;
          return Y + $.column;
        };
      } }), vn = Ae({ "src/language-css/loc.js"(a, z) {
        Ye();
        var { skipEverythingButNewLine: $ } = Kr(), V = ur(), Y = Be();
        function te(L, ae) {
          return typeof L.sourceIndex == "number" ? L.sourceIndex : L.source ? Y(L.source.start, ae) - 1 : null;
        }
        function Z(L, ae) {
          if (L.type === "css-comment" && L.inline)
            return $(ae, L.source.startOffset);
          let ue = L.nodes && V(L.nodes);
          return ue && L.source && !L.source.end && (L = ue), L.source && L.source.end ? Y(L.source.end, ae) : null;
        }
        function ne(L, ae) {
          L.source && (L.source.startOffset = te(L, ae), L.source.endOffset = Z(L, ae));
          for (let ue in L) {
            let ve = L[ue];
            ue === "source" || !ve || typeof ve != "object" || (ve.type === "value-root" || ve.type === "value-unknown" ? X(ve, re(L), ve.text || ve.value) : ne(ve, ae));
          }
        }
        function X(L, ae, ue) {
          L.source && (L.source.startOffset = te(L, ue) + ae, L.source.endOffset = Z(L, ue) + ae);
          for (let ve in L) {
            let De = L[ve];
            ve === "source" || !De || typeof De != "object" || X(De, ae, ue);
          }
        }
        function re(L) {
          let ae = L.source.startOffset;
          return typeof L.prop == "string" && (ae += L.prop.length), L.type === "css-atrule" && typeof L.name == "string" && (ae += 1 + L.name.length + L.raws.afterName.match(/^\s*:?\s*/)[0].length), L.type !== "css-atrule" && L.raws && typeof L.raws.between == "string" && (ae += L.raws.between.length), ae;
        }
        function d(L) {
          let ae = "initial", ue = "initial", ve, De = !1, le = [];
          for (let Ie = 0; Ie < L.length; Ie++) {
            let Me = L[Ie];
            switch (ae) {
              case "initial":
                if (Me === "'") {
                  ae = "single-quotes";
                  continue;
                }
                if (Me === '"') {
                  ae = "double-quotes";
                  continue;
                }
                if ((Me === "u" || Me === "U") && L.slice(Ie, Ie + 4).toLowerCase() === "url(") {
                  ae = "url", Ie += 3;
                  continue;
                }
                if (Me === "*" && L[Ie - 1] === "/") {
                  ae = "comment-block";
                  continue;
                }
                if (Me === "/" && L[Ie - 1] === "/") {
                  ae = "comment-inline", ve = Ie - 1;
                  continue;
                }
                continue;
              case "single-quotes":
                if (Me === "'" && L[Ie - 1] !== "\\" && (ae = ue, ue = "initial"), Me === `
` || Me === "\r")
                  return L;
                continue;
              case "double-quotes":
                if (Me === '"' && L[Ie - 1] !== "\\" && (ae = ue, ue = "initial"), Me === `
` || Me === "\r")
                  return L;
                continue;
              case "url":
                if (Me === ")" && (ae = "initial"), Me === `
` || Me === "\r")
                  return L;
                if (Me === "'") {
                  ae = "single-quotes", ue = "url";
                  continue;
                }
                if (Me === '"') {
                  ae = "double-quotes", ue = "url";
                  continue;
                }
                continue;
              case "comment-block":
                Me === "/" && L[Ie - 1] === "*" && (ae = "initial");
                continue;
              case "comment-inline":
                (Me === '"' || Me === "'" || Me === "*") && (De = !0), (Me === `
` || Me === "\r") && (De && le.push([ve, Ie]), ae = "initial", De = !1);
                continue;
            }
          }
          for (let [Ie, Me] of le)
            L = L.slice(0, Ie) + L.slice(Ie, Me).replace(/["'*]/g, " ") + L.slice(Me);
          return L;
        }
        function n(L) {
          return L.source.startOffset;
        }
        function q(L) {
          return L.source.endOffset;
        }
        z.exports = { locStart: n, locEnd: q, calculateLoc: ne, replaceQuotesInInlineComments: d };
      } }), Ai = Ae({ "src/utils/is-non-empty-array.js"(a, z) {
        Ye();
        function $(V) {
          return Array.isArray(V) && V.length > 0;
        }
        z.exports = $;
      } }), Mi = Ae({ "src/language-css/utils/has-scss-interpolation.js"(a, z) {
        Ye();
        var $ = Ai();
        function V(Y) {
          if ($(Y)) {
            for (let te = Y.length - 1; te > 0; te--)
              if (Y[te].type === "word" && Y[te].value === "{" && Y[te - 1].type === "word" && Y[te - 1].value.endsWith("#"))
                return !0;
          }
          return !1;
        }
        z.exports = V;
      } }), On = Ae({ "src/language-css/utils/has-string-or-function.js"(a, z) {
        Ye();
        function $(V) {
          return V.some((Y) => Y.type === "string" || Y.type === "func");
        }
        z.exports = $;
      } }), hi = Ae({ "src/language-css/utils/is-less-parser.js"(a, z) {
        Ye();
        function $(V) {
          return V.parser === "css" || V.parser === "less";
        }
        z.exports = $;
      } }), dn = Ae({ "src/language-css/utils/is-scss.js"(a, z) {
        Ye();
        function $(V, Y) {
          return V === "less" || V === "scss" ? V === "scss" : /(?:\w\s*:\s*[^:}]+|#){|@import[^\n]+(?:url|,)/.test(Y);
        }
        z.exports = $;
      } }), wu = Ae({ "src/language-css/utils/is-scss-nested-property-node.js"(a, z) {
        Ye();
        function $(V) {
          return V.selector ? V.selector.replace(/\/\*.*?\*\//, "").replace(/\/\/.*\n/, "").trim().endsWith(":") : !1;
        }
        z.exports = $;
      } }), Un = Ae({ "src/language-css/utils/is-scss-variable.js"(a, z) {
        Ye();
        function $(V) {
          return Boolean((V == null ? void 0 : V.type) === "word" && V.value.startsWith("$"));
        }
        z.exports = $;
      } }), Su = Ae({ "src/language-css/utils/stringify-node.js"(a, z) {
        Ye();
        function $(V) {
          var Y, te, Z;
          if (V.groups) {
            var ne, X, re;
            let De = ((ne = V.open) === null || ne === void 0 ? void 0 : ne.value) || "", le = V.groups.map((Me) => $(Me)).join(((X = V.groups[0]) === null || X === void 0 ? void 0 : X.type) === "comma_group" ? "," : ""), Ie = ((re = V.close) === null || re === void 0 ? void 0 : re.value) || "";
            return De + le + Ie;
          }
          let d = ((Y = V.raws) === null || Y === void 0 ? void 0 : Y.before) || "", n = ((te = V.raws) === null || te === void 0 ? void 0 : te.quote) || "", q = V.type === "atword" ? "@" : "", L = V.value || "", ae = V.unit || "", ue = V.group ? $(V.group) : "", ve = ((Z = V.raws) === null || Z === void 0 ? void 0 : Z.after) || "";
          return d + n + q + L + n + ae + ue + ve;
        }
        z.exports = $;
      } }), Tu = Ae({ "src/language-css/utils/is-module-rule-name.js"(a, z) {
        Ye();
        var $ = /* @__PURE__ */ new Set(["import", "use", "forward"]);
        function V(Y) {
          return $.has(Y);
        }
        z.exports = V;
      } }), jn = Ae({ "node_modules/postcss-values-parser/lib/node.js"(a, z) {
        Ye();
        var $ = function(V, Y) {
          let te = new V.constructor();
          for (let Z in V) {
            if (!V.hasOwnProperty(Z))
              continue;
            let ne = V[Z], X = typeof ne;
            Z === "parent" && X === "object" ? Y && (te[Z] = Y) : Z === "source" ? te[Z] = ne : ne instanceof Array ? te[Z] = ne.map((re) => $(re, te)) : Z !== "before" && Z !== "after" && Z !== "between" && Z !== "semicolon" && (X === "object" && ne !== null && (ne = $(ne)), te[Z] = ne);
          }
          return te;
        };
        z.exports = class {
          constructor(V) {
            V = V || {}, this.raws = { before: "", after: "" };
            for (let Y in V)
              this[Y] = V[Y];
          }
          remove() {
            return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
          }
          toString() {
            return [this.raws.before, String(this.value), this.raws.after].join("");
          }
          clone(V) {
            V = V || {};
            let Y = $(this);
            for (let te in V)
              Y[te] = V[te];
            return Y;
          }
          cloneBefore(V) {
            V = V || {};
            let Y = this.clone(V);
            return this.parent.insertBefore(this, Y), Y;
          }
          cloneAfter(V) {
            V = V || {};
            let Y = this.clone(V);
            return this.parent.insertAfter(this, Y), Y;
          }
          replaceWith() {
            let V = Array.prototype.slice.call(arguments);
            if (this.parent) {
              for (let Y of V)
                this.parent.insertBefore(this, Y);
              this.remove();
            }
            return this;
          }
          moveTo(V) {
            return this.cleanRaws(this.root() === V.root()), this.remove(), V.append(this), this;
          }
          moveBefore(V) {
            return this.cleanRaws(this.root() === V.root()), this.remove(), V.parent.insertBefore(V, this), this;
          }
          moveAfter(V) {
            return this.cleanRaws(this.root() === V.root()), this.remove(), V.parent.insertAfter(V, this), this;
          }
          next() {
            let V = this.parent.index(this);
            return this.parent.nodes[V + 1];
          }
          prev() {
            let V = this.parent.index(this);
            return this.parent.nodes[V - 1];
          }
          toJSON() {
            let V = {};
            for (let Y in this) {
              if (!this.hasOwnProperty(Y) || Y === "parent")
                continue;
              let te = this[Y];
              te instanceof Array ? V[Y] = te.map((Z) => typeof Z == "object" && Z.toJSON ? Z.toJSON() : Z) : typeof te == "object" && te.toJSON ? V[Y] = te.toJSON() : V[Y] = te;
            }
            return V;
          }
          root() {
            let V = this;
            for (; V.parent; )
              V = V.parent;
            return V;
          }
          cleanRaws(V) {
            delete this.raws.before, delete this.raws.after, V || delete this.raws.between;
          }
          positionInside(V) {
            let Y = this.toString(), te = this.source.start.column, Z = this.source.start.line;
            for (let ne = 0; ne < V; ne++)
              Y[ne] === `
` ? (te = 1, Z += 1) : te += 1;
            return { line: Z, column: te };
          }
          positionBy(V) {
            let Y = this.source.start;
            if (Object(V).index)
              Y = this.positionInside(V.index);
            else if (Object(V).word) {
              let te = this.toString().indexOf(V.word);
              te !== -1 && (Y = this.positionInside(te));
            }
            return Y;
          }
        };
      } }), bn = Ae({ "node_modules/postcss-values-parser/lib/container.js"(a, z) {
        Ye();
        var $ = jn(), V = class extends $ {
          constructor(Y) {
            super(Y), this.nodes || (this.nodes = []);
          }
          push(Y) {
            return Y.parent = this, this.nodes.push(Y), this;
          }
          each(Y) {
            this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
            let te = this.lastEach, Z, ne;
            if (this.indexes[te] = 0, !!this.nodes) {
              for (; this.indexes[te] < this.nodes.length && (Z = this.indexes[te], ne = Y(this.nodes[Z], Z), ne !== !1); )
                this.indexes[te] += 1;
              return delete this.indexes[te], ne;
            }
          }
          walk(Y) {
            return this.each((te, Z) => {
              let ne = Y(te, Z);
              return ne !== !1 && te.walk && (ne = te.walk(Y)), ne;
            });
          }
          walkType(Y, te) {
            if (!Y || !te)
              throw new Error("Parameters {type} and {callback} are required.");
            let Z = typeof Y == "function";
            return this.walk((ne, X) => {
              if (Z && ne instanceof Y || !Z && ne.type === Y)
                return te.call(this, ne, X);
            });
          }
          append(Y) {
            return Y.parent = this, this.nodes.push(Y), this;
          }
          prepend(Y) {
            return Y.parent = this, this.nodes.unshift(Y), this;
          }
          cleanRaws(Y) {
            if (super.cleanRaws(Y), this.nodes)
              for (let te of this.nodes)
                te.cleanRaws(Y);
          }
          insertAfter(Y, te) {
            let Z = this.index(Y), ne;
            this.nodes.splice(Z + 1, 0, te);
            for (let X in this.indexes)
              ne = this.indexes[X], Z <= ne && (this.indexes[X] = ne + this.nodes.length);
            return this;
          }
          insertBefore(Y, te) {
            let Z = this.index(Y), ne;
            this.nodes.splice(Z, 0, te);
            for (let X in this.indexes)
              ne = this.indexes[X], Z <= ne && (this.indexes[X] = ne + this.nodes.length);
            return this;
          }
          removeChild(Y) {
            Y = this.index(Y), this.nodes[Y].parent = void 0, this.nodes.splice(Y, 1);
            let te;
            for (let Z in this.indexes)
              te = this.indexes[Z], te >= Y && (this.indexes[Z] = te - 1);
            return this;
          }
          removeAll() {
            for (let Y of this.nodes)
              Y.parent = void 0;
            return this.nodes = [], this;
          }
          every(Y) {
            return this.nodes.every(Y);
          }
          some(Y) {
            return this.nodes.some(Y);
          }
          index(Y) {
            return typeof Y == "number" ? Y : this.nodes.indexOf(Y);
          }
          get first() {
            if (this.nodes)
              return this.nodes[0];
          }
          get last() {
            if (this.nodes)
              return this.nodes[this.nodes.length - 1];
          }
          toString() {
            let Y = this.nodes.map(String).join("");
            return this.value && (Y = this.value + Y), this.raws.before && (Y = this.raws.before + Y), this.raws.after && (Y += this.raws.after), Y;
          }
        };
        V.registerWalker = (Y) => {
          let te = "walk" + Y.name;
          te.lastIndexOf("s") !== te.length - 1 && (te += "s"), !V.prototype[te] && (V.prototype[te] = function(Z) {
            return this.walkType(Y, Z);
          });
        }, z.exports = V;
      } }), kn = Ae({ "node_modules/postcss-values-parser/lib/root.js"(a, z) {
        Ye();
        var $ = bn();
        z.exports = class extends $ {
          constructor(V) {
            super(V), this.type = "root";
          }
        };
      } }), ns = Ae({ "node_modules/postcss-values-parser/lib/value.js"(a, z) {
        Ye();
        var $ = bn();
        z.exports = class extends $ {
          constructor(V) {
            super(V), this.type = "value", this.unbalanced = 0;
          }
        };
      } }), so = Ae({ "node_modules/postcss-values-parser/lib/atword.js"(a, z) {
        Ye();
        var $ = bn(), V = class extends $ {
          constructor(Y) {
            super(Y), this.type = "atword";
          }
          toString() {
            return this.quoted && this.raws.quote, [this.raws.before, "@", String.prototype.toString.call(this.value), this.raws.after].join("");
          }
        };
        $.registerWalker(V), z.exports = V;
      } }), is = Ae({ "node_modules/postcss-values-parser/lib/colon.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "colon";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), oo = Ae({ "node_modules/postcss-values-parser/lib/comma.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "comma";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), us = Ae({ "node_modules/postcss-values-parser/lib/comment.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "comment", this.inline = Object(te).inline || !1;
          }
          toString() {
            return [this.raws.before, this.inline ? "//" : "/*", String(this.value), this.inline ? "" : "*/", this.raws.after].join("");
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), $i = Ae({ "node_modules/postcss-values-parser/lib/function.js"(a, z) {
        Ye();
        var $ = bn(), V = class extends $ {
          constructor(Y) {
            super(Y), this.type = "func", this.unbalanced = -1;
          }
        };
        $.registerWalker(V), z.exports = V;
      } }), ao = Ae({ "node_modules/postcss-values-parser/lib/number.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "number", this.unit = Object(te).unit || "";
          }
          toString() {
            return [this.raws.before, String(this.value), this.unit, this.raws.after].join("");
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), lo = Ae({ "node_modules/postcss-values-parser/lib/operator.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "operator";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), sr = Ae({ "node_modules/postcss-values-parser/lib/paren.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "paren", this.parenType = "";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), ss = Ae({ "node_modules/postcss-values-parser/lib/string.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "string";
          }
          toString() {
            let te = this.quoted ? this.raws.quote : "";
            return [this.raws.before, te, this.value + "", te, this.raws.after].join("");
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), co = Ae({ "node_modules/postcss-values-parser/lib/word.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "word";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } }), po = Ae({ "node_modules/postcss-values-parser/lib/unicode-range.js"(a, z) {
        Ye();
        var $ = bn(), V = jn(), Y = class extends V {
          constructor(te) {
            super(te), this.type = "unicode-range";
          }
        };
        $.registerWalker(Y), z.exports = Y;
      } });
      function os() {
        throw new Error("setTimeout has not been defined");
      }
      function as() {
        throw new Error("clearTimeout has not been defined");
      }
      function fo(a) {
        if (ti === setTimeout)
          return setTimeout(a, 0);
        if ((ti === os || !ti) && setTimeout)
          return ti = setTimeout, setTimeout(a, 0);
        try {
          return ti(a, 0);
        } catch {
          try {
            return ti.call(null, a, 0);
          } catch {
            return ti.call(this, a, 0);
          }
        }
      }
      function ua(a) {
        if (ri === clearTimeout)
          return clearTimeout(a);
        if ((ri === as || !ri) && clearTimeout)
          return ri = clearTimeout, clearTimeout(a);
        try {
          return ri(a);
        } catch {
          try {
            return ri.call(null, a);
          } catch {
            return ri.call(this, a);
          }
        }
      }
      function sa() {
        !Si || !yr || (Si = !1, yr.length ? Gn = yr.concat(Gn) : Ri = -1, Gn.length && ho());
      }
      function ho() {
        if (!Si) {
          var a = fo(sa);
          Si = !0;
          for (var z = Gn.length; z; ) {
            for (yr = Gn, Gn = []; ++Ri < z; )
              yr && yr[Ri].run();
            Ri = -1, z = Gn.length;
          }
          yr = null, Si = !1, ua(a);
        }
      }
      function ls(a) {
        var z = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var $ = 1; $ < arguments.length; $++)
            z[$ - 1] = arguments[$];
        Gn.push(new mo(a, z)), Gn.length === 1 && !Si && fo(ho);
      }
      function mo(a, z) {
        this.fun = a, this.array = z;
      }
      function wi() {
      }
      function oa(a) {
        throw new Error("process.binding is not supported");
      }
      function aa() {
        return "/";
      }
      function la(a) {
        throw new Error("process.chdir is not supported");
      }
      function cs() {
        return 0;
      }
      function ps(a) {
        var z = go.call(Ti) * 1e-3, $ = Math.floor(z), V = Math.floor(z % 1 * 1e9);
        return a && ($ = $ - a[0], V = V - a[1], V < 0 && ($--, V += 1e9)), [$, V];
      }
      function ku() {
        var a = new Date(), z = a - Vi;
        return z / 1e3;
      }
      var ti, ri, Gn, Si, yr, Ri, fs, su, Bu, Nu, ds, hs, ms, gs, Ds, ju, ys, ou, Pu, _u, vs, bs, Ti, go, Vi, ni, au, ca = et({ "node-modules-polyfills:process"() {
        Ye(), ti = os, ri = as, typeof globalThis.setTimeout == "function" && (ti = setTimeout), typeof globalThis.clearTimeout == "function" && (ri = clearTimeout), Gn = [], Si = !1, Ri = -1, mo.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, fs = "browser", su = "browser", Bu = !0, Nu = {}, ds = [], hs = "", ms = {}, gs = {}, Ds = {}, ju = wi, ys = wi, ou = wi, Pu = wi, _u = wi, vs = wi, bs = wi, Ti = globalThis.performance || {}, go = Ti.now || Ti.mozNow || Ti.msNow || Ti.oNow || Ti.webkitNow || function() {
          return new Date().getTime();
        }, Vi = new Date(), ni = { nextTick: ls, title: fs, browser: Bu, env: Nu, argv: ds, version: hs, versions: ms, on: ju, addListener: ys, once: ou, off: Pu, removeListener: _u, removeAllListeners: vs, emit: bs, binding: oa, cwd: aa, chdir: la, umask: cs, hrtime: ps, platform: su, release: gs, config: Ds, uptime: ku }, au = ni;
      } }), Es, Cs, pa = et({ "node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js"() {
        Ye(), typeof Object.create == "function" ? Es = function(a, z) {
          a.super_ = z, a.prototype = Object.create(z.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } });
        } : Es = function(a, z) {
          a.super_ = z;
          var $ = function() {
          };
          $.prototype = z.prototype, a.prototype = new $(), a.prototype.constructor = a;
        }, Cs = Es;
      } }), Do = {};
      lt(Do, { _extend: () => Ns, debuglog: () => yo, default: () => Fo, deprecate: () => xs, format: () => Iu, inherits: () => Cs, inspect: () => Ln, isArray: () => ws, isBoolean: () => Ou, isBuffer: () => Ts, isDate: () => Lu, isError: () => pu, isFunction: () => Ji, isNull: () => lu, isNullOrUndefined: () => cu, isNumber: () => qi, isObject: () => Di, isPrimitive: () => bo, isRegExp: () => gi, isString: () => Mn, isSymbol: () => Ss, isUndefined: () => ii, log: () => Eo });
      function Iu(a) {
        if (!Mn(a)) {
          for (var z = [], $ = 0; $ < arguments.length; $++)
            z.push(Ln(arguments[$]));
          return z.join(" ");
        }
        for (var $ = 1, V = arguments, Y = V.length, te = String(a).replace(xo, function(X) {
          if (X === "%%")
            return "%";
          if ($ >= Y)
            return X;
          switch (X) {
            case "%s":
              return String(V[$++]);
            case "%d":
              return Number(V[$++]);
            case "%j":
              try {
                return JSON.stringify(V[$++]);
              } catch {
                return "[Circular]";
              }
            default:
              return X;
          }
        }), Z = V[$]; $ < Y; Z = V[++$])
          lu(Z) || !Di(Z) ? te += " " + Z : te += " " + Ln(Z);
        return te;
      }
      function xs(a, z) {
        if (ii(globalThis.process))
          return function() {
            return xs(a, z).apply(this, arguments);
          };
        if (au.noDeprecation === !0)
          return a;
        var $ = !1;
        function V() {
          if (!$) {
            if (au.throwDeprecation)
              throw new Error(z);
            au.traceDeprecation ? console.trace(z) : console.error(z), $ = !0;
          }
          return a.apply(this, arguments);
        }
        return V;
      }
      function yo(a) {
        if (ii(js) && (js = au.env.NODE_DEBUG || ""), a = a.toUpperCase(), !ki[a])
          if (new RegExp("\\b" + a + "\\b", "i").test(js)) {
            var z = 0;
            ki[a] = function() {
              var $ = Iu.apply(null, arguments);
              console.error("%s %d: %s", a, z, $);
            };
          } else
            ki[a] = function() {
            };
        return ki[a];
      }
      function Ln(a, z) {
        var $ = { seen: [], stylize: fa };
        return arguments.length >= 3 && ($.depth = arguments[2]), arguments.length >= 4 && ($.colors = arguments[3]), Ou(z) ? $.showHidden = z : z && Ns($, z), ii($.showHidden) && ($.showHidden = !1), ii($.depth) && ($.depth = 2), ii($.colors) && ($.colors = !1), ii($.customInspect) && ($.customInspect = !0), $.colors && ($.stylize = vo), mi($, a, $.depth);
      }
      function vo(a, z) {
        var $ = Ln.styles[z];
        return $ ? "\x1B[" + Ln.colors[$][0] + "m" + a + "\x1B[" + Ln.colors[$][1] + "m" : a;
      }
      function fa(a, z) {
        return a;
      }
      function da(a) {
        var z = {};
        return a.forEach(function($, V) {
          z[$] = !0;
        }), z;
      }
      function mi(a, z, $) {
        if (a.customInspect && z && Ji(z.inspect) && z.inspect !== Ln && !(z.constructor && z.constructor.prototype === z)) {
          var V = z.inspect($, a);
          return Mn(V) || (V = mi(a, V, $)), V;
        }
        var Y = ha(a, z);
        if (Y)
          return Y;
        var te = Object.keys(z), Z = da(te);
        if (a.showHidden && (te = Object.getOwnPropertyNames(z)), pu(z) && (te.indexOf("message") >= 0 || te.indexOf("description") >= 0))
          return Fs(z);
        if (te.length === 0) {
          if (Ji(z)) {
            var ne = z.name ? ": " + z.name : "";
            return a.stylize("[Function" + ne + "]", "special");
          }
          if (gi(z))
            return a.stylize(RegExp.prototype.toString.call(z), "regexp");
          if (Lu(z))
            return a.stylize(Date.prototype.toString.call(z), "date");
          if (pu(z))
            return Fs(z);
        }
        var X = "", re = !1, d = ["{", "}"];
        if (ws(z) && (re = !0, d = ["[", "]"]), Ji(z)) {
          var n = z.name ? ": " + z.name : "";
          X = " [Function" + n + "]";
        }
        if (gi(z) && (X = " " + RegExp.prototype.toString.call(z)), Lu(z) && (X = " " + Date.prototype.toUTCString.call(z)), pu(z) && (X = " " + Fs(z)), te.length === 0 && (!re || z.length == 0))
          return d[0] + X + d[1];
        if ($ < 0)
          return gi(z) ? a.stylize(RegExp.prototype.toString.call(z), "regexp") : a.stylize("[Object]", "special");
        a.seen.push(z);
        var q;
        return re ? q = ma(a, z, $, Z, te) : q = te.map(function(L) {
          return As(a, z, $, Z, L, re);
        }), a.seen.pop(), ga(q, X, d);
      }
      function ha(a, z) {
        if (ii(z))
          return a.stylize("undefined", "undefined");
        if (Mn(z)) {
          var $ = "'" + JSON.stringify(z).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return a.stylize($, "string");
        }
        if (qi(z))
          return a.stylize("" + z, "number");
        if (Ou(z))
          return a.stylize("" + z, "boolean");
        if (lu(z))
          return a.stylize("null", "null");
      }
      function Fs(a) {
        return "[" + Error.prototype.toString.call(a) + "]";
      }
      function ma(a, z, $, V, Y) {
        for (var te = [], Z = 0, ne = z.length; Z < ne; ++Z)
          Co(z, String(Z)) ? te.push(As(a, z, $, V, String(Z), !0)) : te.push("");
        return Y.forEach(function(X) {
          X.match(/^\d+$/) || te.push(As(a, z, $, V, X, !0));
        }), te;
      }
      function As(a, z, $, V, Y, te) {
        var Z, ne, X;
        if (X = Object.getOwnPropertyDescriptor(z, Y) || { value: z[Y] }, X.get ? X.set ? ne = a.stylize("[Getter/Setter]", "special") : ne = a.stylize("[Getter]", "special") : X.set && (ne = a.stylize("[Setter]", "special")), Co(V, Y) || (Z = "[" + Y + "]"), ne || (a.seen.indexOf(X.value) < 0 ? (lu($) ? ne = mi(a, X.value, null) : ne = mi(a, X.value, $ - 1), ne.indexOf(`
`) > -1 && (te ? ne = ne.split(`
`).map(function(re) {
          return "  " + re;
        }).join(`
`).substr(2) : ne = `
` + ne.split(`
`).map(function(re) {
          return "   " + re;
        }).join(`
`))) : ne = a.stylize("[Circular]", "special")), ii(Z)) {
          if (te && Y.match(/^\d+$/))
            return ne;
          Z = JSON.stringify("" + Y), Z.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (Z = Z.substr(1, Z.length - 2), Z = a.stylize(Z, "name")) : (Z = Z.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), Z = a.stylize(Z, "string"));
        }
        return Z + ": " + ne;
      }
      function ga(a, z, $) {
        var V = 0, Y = a.reduce(function(te, Z) {
          return V++, Z.indexOf(`
`) >= 0 && V++, te + Z.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        return Y > 60 ? $[0] + (z === "" ? "" : z + `
 `) + " " + a.join(`,
  `) + " " + $[1] : $[0] + z + " " + a.join(", ") + " " + $[1];
      }
      function ws(a) {
        return Array.isArray(a);
      }
      function Ou(a) {
        return typeof a == "boolean";
      }
      function lu(a) {
        return a === null;
      }
      function cu(a) {
        return a == null;
      }
      function qi(a) {
        return typeof a == "number";
      }
      function Mn(a) {
        return typeof a == "string";
      }
      function Ss(a) {
        return typeof a == "symbol";
      }
      function ii(a) {
        return a === void 0;
      }
      function gi(a) {
        return Di(a) && ks(a) === "[object RegExp]";
      }
      function Di(a) {
        return typeof a == "object" && a !== null;
      }
      function Lu(a) {
        return Di(a) && ks(a) === "[object Date]";
      }
      function pu(a) {
        return Di(a) && (ks(a) === "[object Error]" || a instanceof Error);
      }
      function Ji(a) {
        return typeof a == "function";
      }
      function bo(a) {
        return a === null || typeof a == "boolean" || typeof a == "number" || typeof a == "string" || typeof a == "symbol" || typeof a > "u";
      }
      function Ts(a) {
        return Buffer.isBuffer(a);
      }
      function ks(a) {
        return Object.prototype.toString.call(a);
      }
      function Bs(a) {
        return a < 10 ? "0" + a.toString(10) : a.toString(10);
      }
      function yi() {
        var a = new Date(), z = [Bs(a.getHours()), Bs(a.getMinutes()), Bs(a.getSeconds())].join(":");
        return [a.getDate(), Ps[a.getMonth()], z].join(" ");
      }
      function Eo() {
        console.log("%s - %s", yi(), Iu.apply(null, arguments));
      }
      function Ns(a, z) {
        if (!z || !Di(z))
          return a;
        for (var $ = Object.keys(z), V = $.length; V--; )
          a[$[V]] = z[$[V]];
        return a;
      }
      function Co(a, z) {
        return Object.prototype.hasOwnProperty.call(a, z);
      }
      var xo, ki, js, Ps, Fo, Da = et({ "node-modules-polyfills:util"() {
        Ye(), ca(), pa(), xo = /%[sdj%]/g, ki = {}, Ln.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, Ln.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, Ps = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], Fo = { inherits: Cs, _extend: Ns, log: Eo, isBuffer: Ts, isPrimitive: bo, isFunction: Ji, isError: pu, isDate: Lu, isObject: Di, isRegExp: gi, isUndefined: ii, isSymbol: Ss, isString: Mn, isNumber: qi, isNullOrUndefined: cu, isNull: lu, isBoolean: Ou, isArray: ws, inspect: Ln, deprecate: xs, format: Iu, debuglog: yo };
      } }), ya = Ae({ "node-modules-polyfills-commonjs:util"(a, z) {
        Ye();
        var $ = (Da(), Rt(Do));
        if ($ && $.default) {
          z.exports = $.default;
          for (let V in $)
            z.exports[V] = $[V];
        } else
          $ && (z.exports = $);
      } }), va = Ae({ "node_modules/postcss-values-parser/lib/errors/TokenizeError.js"(a, z) {
        Ye();
        var $ = class extends Error {
          constructor(V) {
            super(V), this.name = this.constructor.name, this.message = V || "An error ocurred while tokzenizing.", typeof Error.captureStackTrace == "function" ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error(V).stack;
          }
        };
        z.exports = $;
      } }), ba = Ae({ "node_modules/postcss-values-parser/lib/tokenize.js"(a, z) {
        Ye();
        var $ = "{".charCodeAt(0), V = "}".charCodeAt(0), Y = "(".charCodeAt(0), te = ")".charCodeAt(0), Z = "'".charCodeAt(0), ne = '"'.charCodeAt(0), X = "\\".charCodeAt(0), re = "/".charCodeAt(0), d = ".".charCodeAt(0), n = ",".charCodeAt(0), q = ":".charCodeAt(0), L = "*".charCodeAt(0), ae = "-".charCodeAt(0), ue = "+".charCodeAt(0), ve = "#".charCodeAt(0), De = `
`.charCodeAt(0), le = " ".charCodeAt(0), Ie = "\f".charCodeAt(0), Me = "	".charCodeAt(0), We = "\r".charCodeAt(0), Ft = "@".charCodeAt(0), Pt = "e".charCodeAt(0), Mt = "E".charCodeAt(0), rr = "0".charCodeAt(0), tr = "9".charCodeAt(0), pr = "u".charCodeAt(0), er = "U".charCodeAt(0), ir = /[ \n\t\r\{\(\)'"\\;,/]/g, At = /[ \n\t\r\(\)\{\}\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g, gt = /[ \n\t\r\(\)\{\}\*:;@!&'"\-\+\|~>,\[\]\\]|\//g, Nt = /^[a-z0-9]/i, mt = /^[a-f0-9?\-]/i, Zr = ya(), Or = va();
        z.exports = function(Jr, _r) {
          _r = _r || {};
          let Fr = [], zt = Jr.valueOf(), vr = zt.length, lr = -1, fr = 1, qe = 0, ct = 0, dt = null, It, Ve, Yt, Jt, on, an, wn, zn, xn, ln, cn;
          function hn(Yr) {
            let Sn = Zr.format("Unclosed %s at line: %d, column: %d, token: %d", Yr, fr, qe - lr, qe);
            throw new Or(Sn);
          }
          for (; qe < vr; ) {
            switch (It = zt.charCodeAt(qe), It === De && (lr = qe, fr += 1), It) {
              case De:
              case le:
              case Me:
              case We:
              case Ie:
                Ve = qe;
                do
                  Ve += 1, It = zt.charCodeAt(Ve), It === De && (lr = Ve, fr += 1);
                while (It === le || It === De || It === Me || It === We || It === Ie);
                Fr.push(["space", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                break;
              case q:
                Ve = qe + 1, Fr.push(["colon", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                break;
              case n:
                Ve = qe + 1, Fr.push(["comma", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                break;
              case $:
                Fr.push(["{", "{", fr, qe - lr, fr, Ve - lr, qe]);
                break;
              case V:
                Fr.push(["}", "}", fr, qe - lr, fr, Ve - lr, qe]);
                break;
              case Y:
                ct++, dt = !dt && ct === 1 && Fr.length > 0 && Fr[Fr.length - 1][0] === "word" && Fr[Fr.length - 1][1] === "url", Fr.push(["(", "(", fr, qe - lr, fr, Ve - lr, qe]);
                break;
              case te:
                ct--, dt = dt && ct > 0, Fr.push([")", ")", fr, qe - lr, fr, Ve - lr, qe]);
                break;
              case Z:
              case ne:
                Yt = It === Z ? "'" : '"', Ve = qe;
                do
                  for (xn = !1, Ve = zt.indexOf(Yt, Ve + 1), Ve === -1 && hn("quote"), ln = Ve; zt.charCodeAt(ln - 1) === X; )
                    ln -= 1, xn = !xn;
                while (xn);
                Fr.push(["string", zt.slice(qe, Ve + 1), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve;
                break;
              case Ft:
                ir.lastIndex = qe + 1, ir.test(zt), ir.lastIndex === 0 ? Ve = zt.length - 1 : Ve = ir.lastIndex - 2, Fr.push(["atword", zt.slice(qe, Ve + 1), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve;
                break;
              case X:
                Ve = qe, It = zt.charCodeAt(Ve + 1), Fr.push(["word", zt.slice(qe, Ve + 1), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve;
                break;
              case ue:
              case ae:
              case L:
                if (Ve = qe + 1, cn = zt.slice(qe + 1, Ve + 1), zt.slice(qe - 1, qe), It === ae && cn.charCodeAt(0) === ae) {
                  Ve++, Fr.push(["word", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                  break;
                }
                Fr.push(["operator", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                break;
              default:
                if (It === re && (zt.charCodeAt(qe + 1) === L || _r.loose && !dt && zt.charCodeAt(qe + 1) === re)) {
                  if (zt.charCodeAt(qe + 1) === L)
                    Ve = zt.indexOf("*/", qe + 2) + 1, Ve === 0 && hn("comment");
                  else {
                    let Yr = zt.indexOf(`
`, qe + 2);
                    Ve = Yr !== -1 ? Yr - 1 : vr;
                  }
                  an = zt.slice(qe, Ve + 1), Jt = an.split(`
`), on = Jt.length - 1, on > 0 ? (wn = fr + on, zn = Ve - Jt[on].length) : (wn = fr, zn = lr), Fr.push(["comment", an, fr, qe - lr, wn, Ve - zn, qe]), lr = zn, fr = wn, qe = Ve;
                } else if (It === ve && !Nt.test(zt.slice(qe + 1, qe + 2)))
                  Ve = qe + 1, Fr.push(["#", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                else if ((It === pr || It === er) && zt.charCodeAt(qe + 1) === ue) {
                  Ve = qe + 2;
                  do
                    Ve += 1, It = zt.charCodeAt(Ve);
                  while (Ve < vr && mt.test(zt.slice(Ve, Ve + 1)));
                  Fr.push(["unicoderange", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                } else if (It === re)
                  Ve = qe + 1, Fr.push(["operator", zt.slice(qe, Ve), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve - 1;
                else {
                  let Yr = At;
                  if (It >= rr && It <= tr && (Yr = gt), Yr.lastIndex = qe + 1, Yr.test(zt), Yr.lastIndex === 0 ? Ve = zt.length - 1 : Ve = Yr.lastIndex - 2, Yr === gt || It === d) {
                    let Sn = zt.charCodeAt(Ve), ra = zt.charCodeAt(Ve + 1), na = zt.charCodeAt(Ve + 2);
                    (Sn === Pt || Sn === Mt) && (ra === ae || ra === ue) && na >= rr && na <= tr && (gt.lastIndex = Ve + 2, gt.test(zt), gt.lastIndex === 0 ? Ve = zt.length - 1 : Ve = gt.lastIndex - 2);
                  }
                  Fr.push(["word", zt.slice(qe, Ve + 1), fr, qe - lr, fr, Ve - lr, qe]), qe = Ve;
                }
                break;
            }
            qe++;
          }
          return Fr;
        };
      } }), Ao = Ae({ "node_modules/flatten/index.js"(a, z) {
        Ye(), z.exports = function($, V) {
          if (V = typeof V == "number" ? V : 1 / 0, !V)
            return Array.isArray($) ? $.map(function(te) {
              return te;
            }) : $;
          return Y($, 1);
          function Y(te, Z) {
            return te.reduce(function(ne, X) {
              return Array.isArray(X) && Z < V ? ne.concat(Y(X, Z + 1)) : ne.concat(X);
            }, []);
          }
        };
      } }), wo = Ae({ "node_modules/indexes-of/index.js"(a, z) {
        Ye(), z.exports = function($, V) {
          for (var Y = -1, te = []; (Y = $.indexOf(V, Y + 1)) !== -1; )
            te.push(Y);
          return te;
        };
      } }), Dn = Ae({ "node_modules/uniq/uniq.js"(a, z) {
        Ye();
        function $(te, Z) {
          for (var ne = 1, X = te.length, re = te[0], d = te[0], n = 1; n < X; ++n)
            if (d = re, re = te[n], Z(re, d)) {
              if (n === ne) {
                ne++;
                continue;
              }
              te[ne++] = re;
            }
          return te.length = ne, te;
        }
        function V(te) {
          for (var Z = 1, ne = te.length, X = te[0], re = te[0], d = 1; d < ne; ++d, re = X)
            if (re = X, X = te[d], X !== re) {
              if (d === Z) {
                Z++;
                continue;
              }
              te[Z++] = X;
            }
          return te.length = Z, te;
        }
        function Y(te, Z, ne) {
          return te.length === 0 ? te : Z ? (ne || te.sort(Z), $(te, Z)) : (ne || te.sort(), V(te));
        }
        z.exports = Y;
      } }), Ea = Ae({ "node_modules/postcss-values-parser/lib/errors/ParserError.js"(a, z) {
        Ye();
        var $ = class extends Error {
          constructor(V) {
            super(V), this.name = this.constructor.name, this.message = V || "An error ocurred while parsing.", typeof Error.captureStackTrace == "function" ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error(V).stack;
          }
        };
        z.exports = $;
      } }), Ca = Ae({ "node_modules/postcss-values-parser/lib/parser.js"(a, z) {
        Ye();
        var $ = kn(), V = ns(), Y = so(), te = is(), Z = oo(), ne = us(), X = $i(), re = ao(), d = lo(), n = sr(), q = ss(), L = co(), ae = po(), ue = ba(), ve = Ao(), De = wo(), le = Dn(), Ie = Ea();
        function Me(We) {
          return We.sort((Ft, Pt) => Ft - Pt);
        }
        z.exports = class {
          constructor(We, Ft) {
            let Pt = { loose: !1 };
            this.cache = [], this.input = We, this.options = Object.assign({}, Pt, Ft), this.position = 0, this.unbalanced = 0, this.root = new $();
            let Mt = new V();
            this.root.append(Mt), this.current = Mt, this.tokens = ue(We, this.options);
          }
          parse() {
            return this.loop();
          }
          colon() {
            let We = this.currToken;
            this.newNode(new te({ value: We[1], source: { start: { line: We[2], column: We[3] }, end: { line: We[4], column: We[5] } }, sourceIndex: We[6] })), this.position++;
          }
          comma() {
            let We = this.currToken;
            this.newNode(new Z({ value: We[1], source: { start: { line: We[2], column: We[3] }, end: { line: We[4], column: We[5] } }, sourceIndex: We[6] })), this.position++;
          }
          comment() {
            let We = !1, Ft = this.currToken[1].replace(/\/\*|\*\//g, ""), Pt;
            this.options.loose && Ft.startsWith("//") && (Ft = Ft.substring(2), We = !0), Pt = new ne({ value: Ft, inline: We, source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] }), this.newNode(Pt), this.position++;
          }
          error(We, Ft) {
            throw new Ie(We + ` at line: ${Ft[2]}, column ${Ft[3]}`);
          }
          loop() {
            for (; this.position < this.tokens.length; )
              this.parseTokens();
            return !this.current.last && this.spaces ? this.current.raws.before += this.spaces : this.spaces && (this.current.last.raws.after += this.spaces), this.spaces = "", this.root;
          }
          operator() {
            let We = this.currToken[1], Ft;
            if (We === "+" || We === "-") {
              if (this.options.loose || this.position > 0 && (this.current.type === "func" && this.current.value === "calc" ? this.prevToken[0] !== "space" && this.prevToken[0] !== "(" ? this.error("Syntax Error", this.currToken) : this.nextToken[0] !== "space" && this.nextToken[0] !== "word" ? this.error("Syntax Error", this.currToken) : this.nextToken[0] === "word" && this.current.last.type !== "operator" && this.current.last.value !== "(" && this.error("Syntax Error", this.currToken) : (this.nextToken[0] === "space" || this.nextToken[0] === "operator" || this.prevToken[0] === "operator") && this.error("Syntax Error", this.currToken)), this.options.loose) {
                if ((!this.current.nodes.length || this.current.last && this.current.last.type === "operator") && this.nextToken[0] === "word")
                  return this.word();
              } else if (this.nextToken[0] === "word")
                return this.word();
            }
            return Ft = new d({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }), this.position++, this.newNode(Ft);
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
            let We = 1, Ft = this.position + 1, Pt = this.currToken, Mt;
            for (; Ft < this.tokens.length && We; ) {
              let rr = this.tokens[Ft];
              rr[0] === "(" && We++, rr[0] === ")" && We--, Ft++;
            }
            if (We && this.error("Expected closing parenthesis", Pt), Mt = this.current.last, Mt && Mt.type === "func" && Mt.unbalanced < 0 && (Mt.unbalanced = 0, this.current = Mt), this.current.unbalanced++, this.newNode(new n({ value: Pt[1], source: { start: { line: Pt[2], column: Pt[3] }, end: { line: Pt[4], column: Pt[5] } }, sourceIndex: Pt[6] })), this.position++, this.current.type === "func" && this.current.unbalanced && this.current.value === "url" && this.currToken[0] !== "string" && this.currToken[0] !== ")" && !this.options.loose) {
              let rr = this.nextToken, tr = this.currToken[1], pr = { line: this.currToken[2], column: this.currToken[3] };
              for (; rr && rr[0] !== ")" && this.current.unbalanced; )
                this.position++, tr += this.currToken[1], rr = this.nextToken;
              this.position !== this.tokens.length - 1 && (this.position++, this.newNode(new L({ value: tr, source: { start: pr, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] })));
            }
          }
          parenClose() {
            let We = this.currToken;
            this.newNode(new n({ value: We[1], source: { start: { line: We[2], column: We[3] }, end: { line: We[4], column: We[5] } }, sourceIndex: We[6] })), this.position++, !(this.position >= this.tokens.length - 1 && !this.current.unbalanced) && (this.current.unbalanced--, this.current.unbalanced < 0 && this.error("Expected opening parenthesis", We), !this.current.unbalanced && this.cache.length && (this.current = this.cache.pop()));
          }
          space() {
            let We = this.currToken;
            this.position === this.tokens.length - 1 || this.nextToken[0] === "," || this.nextToken[0] === ")" ? (this.current.last.raws.after += We[1], this.position++) : (this.spaces = We[1], this.position++);
          }
          unicodeRange() {
            let We = this.currToken;
            this.newNode(new ae({ value: We[1], source: { start: { line: We[2], column: We[3] }, end: { line: We[4], column: We[5] } }, sourceIndex: We[6] })), this.position++;
          }
          splitWord() {
            let We = this.nextToken, Ft = this.currToken[1], Pt = /^[\+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][\+\-]?\d+)?/, Mt = /^(?!\#([a-z0-9]+))[\#\{\}]/gi, rr, tr;
            if (!Mt.test(Ft))
              for (; We && We[0] === "word"; ) {
                this.position++;
                let pr = this.currToken[1];
                Ft += pr, We = this.nextToken;
              }
            rr = De(Ft, "@"), tr = Me(le(ve([[0], rr]))), tr.forEach((pr, er) => {
              let ir = tr[er + 1] || Ft.length, At = Ft.slice(pr, ir), gt;
              if (~rr.indexOf(pr))
                gt = new Y({ value: At.slice(1), source: { start: { line: this.currToken[2], column: this.currToken[3] + pr }, end: { line: this.currToken[4], column: this.currToken[3] + (ir - 1) } }, sourceIndex: this.currToken[6] + tr[er] });
              else if (Pt.test(this.currToken[1])) {
                let Nt = At.replace(Pt, "");
                gt = new re({ value: At.replace(Nt, ""), source: { start: { line: this.currToken[2], column: this.currToken[3] + pr }, end: { line: this.currToken[4], column: this.currToken[3] + (ir - 1) } }, sourceIndex: this.currToken[6] + tr[er], unit: Nt });
              } else
                gt = new (We && We[0] === "(" ? X : L)({ value: At, source: { start: { line: this.currToken[2], column: this.currToken[3] + pr }, end: { line: this.currToken[4], column: this.currToken[3] + (ir - 1) } }, sourceIndex: this.currToken[6] + tr[er] }), gt.type === "word" ? (gt.isHex = /^#(.+)/.test(At), gt.isColor = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(At)) : this.cache.push(this.current);
              this.newNode(gt);
            }), this.position++;
          }
          string() {
            let We = this.currToken, Ft = this.currToken[1], Pt = /^(\"|\')/, Mt = Pt.test(Ft), rr = "", tr;
            Mt && (rr = Ft.match(Pt)[0], Ft = Ft.slice(1, Ft.length - 1)), tr = new q({ value: Ft, source: { start: { line: We[2], column: We[3] }, end: { line: We[4], column: We[5] } }, sourceIndex: We[6], quoted: Mt }), tr.raws.quote = rr, this.newNode(tr), this.position++;
          }
          word() {
            return this.splitWord();
          }
          newNode(We) {
            return this.spaces && (We.raws.before += this.spaces, this.spaces = ""), this.current.append(We);
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
      } }), xa = Ae({ "node_modules/postcss-values-parser/lib/index.js"(a, z) {
        Ye();
        var $ = Ca(), V = so(), Y = is(), te = oo(), Z = us(), ne = $i(), X = ao(), re = lo(), d = sr(), n = ss(), q = po(), L = ns(), ae = co(), ue = function(ve, De) {
          return new $(ve, De);
        };
        ue.atword = function(ve) {
          return new V(ve);
        }, ue.colon = function(ve) {
          return new Y(Object.assign({ value: ":" }, ve));
        }, ue.comma = function(ve) {
          return new te(Object.assign({ value: "," }, ve));
        }, ue.comment = function(ve) {
          return new Z(ve);
        }, ue.func = function(ve) {
          return new ne(ve);
        }, ue.number = function(ve) {
          return new X(ve);
        }, ue.operator = function(ve) {
          return new re(ve);
        }, ue.paren = function(ve) {
          return new d(Object.assign({ value: "(" }, ve));
        }, ue.string = function(ve) {
          return new n(Object.assign({ quote: "'" }, ve));
        }, ue.value = function(ve) {
          return new L(ve);
        }, ue.word = function(ve) {
          return new ae(ve);
        }, ue.unicodeRange = function(ve) {
          return new q(ve);
        }, z.exports = ue;
      } }), vi = Ae({ "node_modules/postcss-selector-parser/dist/selectors/node.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Z) {
          return typeof Z;
        } : function(Z) {
          return Z && typeof Symbol == "function" && Z.constructor === Symbol && Z !== Symbol.prototype ? "symbol" : typeof Z;
        };
        function V(Z, ne) {
          if (!(Z instanceof ne))
            throw new TypeError("Cannot call a class as a function");
        }
        var Y = function Z(ne, X) {
          if ((typeof ne > "u" ? "undefined" : $(ne)) !== "object")
            return ne;
          var re = new ne.constructor();
          for (var d in ne)
            if (ne.hasOwnProperty(d)) {
              var n = ne[d], q = typeof n > "u" ? "undefined" : $(n);
              d === "parent" && q === "object" ? X && (re[d] = X) : n instanceof Array ? re[d] = n.map(function(L) {
                return Z(L, re);
              }) : re[d] = Z(n, re);
            }
          return re;
        }, te = function() {
          function Z() {
            var ne = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            V(this, Z);
            for (var X in ne)
              this[X] = ne[X];
            var re = ne.spaces;
            re = re === void 0 ? {} : re;
            var d = re.before, n = d === void 0 ? "" : d, q = re.after, L = q === void 0 ? "" : q;
            this.spaces = { before: n, after: L };
          }
          return Z.prototype.remove = function() {
            return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
          }, Z.prototype.replaceWith = function() {
            if (this.parent) {
              for (var ne in arguments)
                this.parent.insertBefore(this, arguments[ne]);
              this.remove();
            }
            return this;
          }, Z.prototype.next = function() {
            return this.parent.at(this.parent.index(this) + 1);
          }, Z.prototype.prev = function() {
            return this.parent.at(this.parent.index(this) - 1);
          }, Z.prototype.clone = function() {
            var ne = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, X = Y(this);
            for (var re in ne)
              X[re] = ne[re];
            return X;
          }, Z.prototype.toString = function() {
            return [this.spaces.before, String(this.value), this.spaces.after].join("");
          }, Z;
        }();
        a.default = te, z.exports = a.default;
      } }), En = Ae({ "node_modules/postcss-selector-parser/dist/selectors/types.js"(a) {
        Ye(), a.__esModule = !0, a.TAG = "tag", a.STRING = "string", a.SELECTOR = "selector", a.ROOT = "root", a.PSEUDO = "pseudo", a.NESTING = "nesting", a.ID = "id", a.COMMENT = "comment", a.COMBINATOR = "combinator", a.CLASS = "class", a.ATTRIBUTE = "attribute", a.UNIVERSAL = "universal";
      } }), _s = Ae({ "node_modules/postcss-selector-parser/dist/selectors/container.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = function() {
          function L(ae, ue) {
            for (var ve = 0; ve < ue.length; ve++) {
              var De = ue[ve];
              De.enumerable = De.enumerable || !1, De.configurable = !0, "value" in De && (De.writable = !0), Object.defineProperty(ae, De.key, De);
            }
          }
          return function(ae, ue, ve) {
            return ue && L(ae.prototype, ue), ve && L(ae, ve), ae;
          };
        }(), V = vi(), Y = X(V), te = En(), Z = ne(te);
        function ne(L) {
          if (L && L.__esModule)
            return L;
          var ae = {};
          if (L != null)
            for (var ue in L)
              Object.prototype.hasOwnProperty.call(L, ue) && (ae[ue] = L[ue]);
          return ae.default = L, ae;
        }
        function X(L) {
          return L && L.__esModule ? L : { default: L };
        }
        function re(L, ae) {
          if (!(L instanceof ae))
            throw new TypeError("Cannot call a class as a function");
        }
        function d(L, ae) {
          if (!L)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return ae && (typeof ae == "object" || typeof ae == "function") ? ae : L;
        }
        function n(L, ae) {
          if (typeof ae != "function" && ae !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof ae);
          L.prototype = Object.create(ae && ae.prototype, { constructor: { value: L, enumerable: !1, writable: !0, configurable: !0 } }), ae && (Object.setPrototypeOf ? Object.setPrototypeOf(L, ae) : L.__proto__ = ae);
        }
        var q = function(L) {
          n(ae, L);
          function ae(ue) {
            re(this, ae);
            var ve = d(this, L.call(this, ue));
            return ve.nodes || (ve.nodes = []), ve;
          }
          return ae.prototype.append = function(ue) {
            return ue.parent = this, this.nodes.push(ue), this;
          }, ae.prototype.prepend = function(ue) {
            return ue.parent = this, this.nodes.unshift(ue), this;
          }, ae.prototype.at = function(ue) {
            return this.nodes[ue];
          }, ae.prototype.index = function(ue) {
            return typeof ue == "number" ? ue : this.nodes.indexOf(ue);
          }, ae.prototype.removeChild = function(ue) {
            ue = this.index(ue), this.at(ue).parent = void 0, this.nodes.splice(ue, 1);
            var ve = void 0;
            for (var De in this.indexes)
              ve = this.indexes[De], ve >= ue && (this.indexes[De] = ve - 1);
            return this;
          }, ae.prototype.removeAll = function() {
            for (var De = this.nodes, ue = Array.isArray(De), ve = 0, De = ue ? De : De[Symbol.iterator](); ; ) {
              var le;
              if (ue) {
                if (ve >= De.length)
                  break;
                le = De[ve++];
              } else {
                if (ve = De.next(), ve.done)
                  break;
                le = ve.value;
              }
              var Ie = le;
              Ie.parent = void 0;
            }
            return this.nodes = [], this;
          }, ae.prototype.empty = function() {
            return this.removeAll();
          }, ae.prototype.insertAfter = function(ue, ve) {
            var De = this.index(ue);
            this.nodes.splice(De + 1, 0, ve);
            var le = void 0;
            for (var Ie in this.indexes)
              le = this.indexes[Ie], De <= le && (this.indexes[Ie] = le + this.nodes.length);
            return this;
          }, ae.prototype.insertBefore = function(ue, ve) {
            var De = this.index(ue);
            this.nodes.splice(De, 0, ve);
            var le = void 0;
            for (var Ie in this.indexes)
              le = this.indexes[Ie], De <= le && (this.indexes[Ie] = le + this.nodes.length);
            return this;
          }, ae.prototype.each = function(ue) {
            this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach++;
            var ve = this.lastEach;
            if (this.indexes[ve] = 0, !!this.length) {
              for (var De = void 0, le = void 0; this.indexes[ve] < this.length && (De = this.indexes[ve], le = ue(this.at(De), De), le !== !1); )
                this.indexes[ve] += 1;
              if (delete this.indexes[ve], le === !1)
                return !1;
            }
          }, ae.prototype.walk = function(ue) {
            return this.each(function(ve, De) {
              var le = ue(ve, De);
              if (le !== !1 && ve.length && (le = ve.walk(ue)), le === !1)
                return !1;
            });
          }, ae.prototype.walkAttributes = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.ATTRIBUTE)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkClasses = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.CLASS)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkCombinators = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.COMBINATOR)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkComments = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.COMMENT)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkIds = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.ID)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkNesting = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.NESTING)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkPseudos = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.PSEUDO)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkTags = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.TAG)
                return ue.call(ve, De);
            });
          }, ae.prototype.walkUniversals = function(ue) {
            var ve = this;
            return this.walk(function(De) {
              if (De.type === Z.UNIVERSAL)
                return ue.call(ve, De);
            });
          }, ae.prototype.split = function(ue) {
            var ve = this, De = [];
            return this.reduce(function(le, Ie, Me) {
              var We = ue.call(ve, Ie);
              return De.push(Ie), We ? (le.push(De), De = []) : Me === ve.length - 1 && le.push(De), le;
            }, []);
          }, ae.prototype.map = function(ue) {
            return this.nodes.map(ue);
          }, ae.prototype.reduce = function(ue, ve) {
            return this.nodes.reduce(ue, ve);
          }, ae.prototype.every = function(ue) {
            return this.nodes.every(ue);
          }, ae.prototype.some = function(ue) {
            return this.nodes.some(ue);
          }, ae.prototype.filter = function(ue) {
            return this.nodes.filter(ue);
          }, ae.prototype.sort = function(ue) {
            return this.nodes.sort(ue);
          }, ae.prototype.toString = function() {
            return this.map(String).join("");
          }, $(ae, [{ key: "first", get: function() {
            return this.at(0);
          } }, { key: "last", get: function() {
            return this.at(this.length - 1);
          } }, { key: "length", get: function() {
            return this.nodes.length;
          } }]), ae;
        }(Y.default);
        a.default = q, z.exports = a.default;
      } }), Ui = Ae({ "node_modules/postcss-selector-parser/dist/selectors/root.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = _s(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.ROOT, L;
          }
          return n.prototype.toString = function() {
            var q = this.reduce(function(L, ae) {
              var ue = String(ae);
              return ue ? L + ue + "," : "";
            }, "").slice(0, -1);
            return this.trailingComma ? q + "," : q;
          }, n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), tn = Ae({ "node_modules/postcss-selector-parser/dist/selectors/selector.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = _s(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.SELECTOR, L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), fu = Ae({ "node_modules/postcss-selector-parser/dist/selectors/namespace.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = function() {
          function d(n, q) {
            for (var L = 0; L < q.length; L++) {
              var ae = q[L];
              ae.enumerable = ae.enumerable || !1, ae.configurable = !0, "value" in ae && (ae.writable = !0), Object.defineProperty(n, ae.key, ae);
            }
          }
          return function(n, q, L) {
            return q && d(n.prototype, q), L && d(n, L), n;
          };
        }(), V = vi(), Y = te(V);
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n() {
            return Z(this, n), ne(this, d.apply(this, arguments));
          }
          return n.prototype.toString = function() {
            return [this.spaces.before, this.ns, String(this.value), this.spaces.after].join("");
          }, $(n, [{ key: "ns", get: function() {
            var q = this.namespace;
            return q ? (typeof q == "string" ? q : "") + "|" : "";
          } }]), n;
        }(Y.default);
        a.default = re, z.exports = a.default;
      } }), So = Ae({ "node_modules/postcss-selector-parser/dist/selectors/className.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = fu(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.CLASS, L;
          }
          return n.prototype.toString = function() {
            return [this.spaces.before, this.ns, String("." + this.value), this.spaces.after].join("");
          }, n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), To = Ae({ "node_modules/postcss-selector-parser/dist/selectors/comment.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = vi(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.COMMENT, L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), ko = Ae({ "node_modules/postcss-selector-parser/dist/selectors/id.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = fu(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.ID, L;
          }
          return n.prototype.toString = function() {
            return [this.spaces.before, this.ns, String("#" + this.value), this.spaces.after].join("");
          }, n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), Bo = Ae({ "node_modules/postcss-selector-parser/dist/selectors/tag.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = fu(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.TAG, L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), No = Ae({ "node_modules/postcss-selector-parser/dist/selectors/string.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = vi(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.STRING, L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), bi = Ae({ "node_modules/postcss-selector-parser/dist/selectors/pseudo.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = _s(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.PSEUDO, L;
          }
          return n.prototype.toString = function() {
            var q = this.length ? "(" + this.map(String).join(",") + ")" : "";
            return [this.spaces.before, String(this.value), q, this.spaces.after].join("");
          }, n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), jo = Ae({ "node_modules/postcss-selector-parser/dist/selectors/attribute.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = fu(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.ATTRIBUTE, L.raws = {}, L;
          }
          return n.prototype.toString = function() {
            var q = [this.spaces.before, "[", this.ns, this.attribute];
            return this.operator && q.push(this.operator), this.value && q.push(this.value), this.raws.insensitive ? q.push(this.raws.insensitive) : this.insensitive && q.push(" i"), q.push("]"), q.concat(this.spaces.after).join("");
          }, n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), Is = Ae({ "node_modules/postcss-selector-parser/dist/selectors/universal.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = fu(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.UNIVERSAL, L.value = "*", L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), Po = Ae({ "node_modules/postcss-selector-parser/dist/selectors/combinator.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = vi(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.COMBINATOR, L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), _o = Ae({ "node_modules/postcss-selector-parser/dist/selectors/nesting.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = vi(), V = te($), Y = En();
        function te(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Z(d, n) {
          if (!(d instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function ne(d, n) {
          if (!d)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return n && (typeof n == "object" || typeof n == "function") ? n : d;
        }
        function X(d, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError("Super expression must either be null or a function, not " + typeof n);
          d.prototype = Object.create(n && n.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }), n && (Object.setPrototypeOf ? Object.setPrototypeOf(d, n) : d.__proto__ = n);
        }
        var re = function(d) {
          X(n, d);
          function n(q) {
            Z(this, n);
            var L = ne(this, d.call(this, q));
            return L.type = Y.NESTING, L.value = "&", L;
          }
          return n;
        }(V.default);
        a.default = re, z.exports = a.default;
      } }), Gi = Ae({ "node_modules/postcss-selector-parser/dist/sortAscending.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = $;
        function $(V) {
          return V.sort(function(Y, te) {
            return Y - te;
          });
        }
        z.exports = a.default;
      } }), Fa = Ae({ "node_modules/postcss-selector-parser/dist/tokenize.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = pr;
        var $ = 39, V = 34, Y = 92, te = 47, Z = 10, ne = 32, X = 12, re = 9, d = 13, n = 43, q = 62, L = 126, ae = 124, ue = 44, ve = 40, De = 41, le = 91, Ie = 93, Me = 59, We = 42, Ft = 58, Pt = 38, Mt = 64, rr = /[ \n\t\r\{\(\)'"\\;/]/g, tr = /[ \n\t\r\(\)\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g;
        function pr(er) {
          for (var ir = [], At = er.css.valueOf(), gt = void 0, Nt = void 0, mt = void 0, Zr = void 0, Or = void 0, Jr = void 0, _r = void 0, Fr = void 0, zt = void 0, vr = void 0, lr = void 0, fr = At.length, qe = -1, ct = 1, dt = 0, It = function(Ve, Yt) {
            if (er.safe)
              At += Yt, Nt = At.length - 1;
            else
              throw er.error("Unclosed " + Ve, ct, dt - qe, dt);
          }; dt < fr; ) {
            switch (gt = At.charCodeAt(dt), gt === Z && (qe = dt, ct += 1), gt) {
              case Z:
              case ne:
              case re:
              case d:
              case X:
                Nt = dt;
                do
                  Nt += 1, gt = At.charCodeAt(Nt), gt === Z && (qe = Nt, ct += 1);
                while (gt === ne || gt === Z || gt === re || gt === d || gt === X);
                ir.push(["space", At.slice(dt, Nt), ct, dt - qe, dt]), dt = Nt - 1;
                break;
              case n:
              case q:
              case L:
              case ae:
                Nt = dt;
                do
                  Nt += 1, gt = At.charCodeAt(Nt);
                while (gt === n || gt === q || gt === L || gt === ae);
                ir.push(["combinator", At.slice(dt, Nt), ct, dt - qe, dt]), dt = Nt - 1;
                break;
              case We:
                ir.push(["*", "*", ct, dt - qe, dt]);
                break;
              case Pt:
                ir.push(["&", "&", ct, dt - qe, dt]);
                break;
              case ue:
                ir.push([",", ",", ct, dt - qe, dt]);
                break;
              case le:
                ir.push(["[", "[", ct, dt - qe, dt]);
                break;
              case Ie:
                ir.push(["]", "]", ct, dt - qe, dt]);
                break;
              case Ft:
                ir.push([":", ":", ct, dt - qe, dt]);
                break;
              case Me:
                ir.push([";", ";", ct, dt - qe, dt]);
                break;
              case ve:
                ir.push(["(", "(", ct, dt - qe, dt]);
                break;
              case De:
                ir.push([")", ")", ct, dt - qe, dt]);
                break;
              case $:
              case V:
                mt = gt === $ ? "'" : '"', Nt = dt;
                do
                  for (vr = !1, Nt = At.indexOf(mt, Nt + 1), Nt === -1 && It("quote", mt), lr = Nt; At.charCodeAt(lr - 1) === Y; )
                    lr -= 1, vr = !vr;
                while (vr);
                ir.push(["string", At.slice(dt, Nt + 1), ct, dt - qe, ct, Nt - qe, dt]), dt = Nt;
                break;
              case Mt:
                rr.lastIndex = dt + 1, rr.test(At), rr.lastIndex === 0 ? Nt = At.length - 1 : Nt = rr.lastIndex - 2, ir.push(["at-word", At.slice(dt, Nt + 1), ct, dt - qe, ct, Nt - qe, dt]), dt = Nt;
                break;
              case Y:
                for (Nt = dt, _r = !0; At.charCodeAt(Nt + 1) === Y; )
                  Nt += 1, _r = !_r;
                gt = At.charCodeAt(Nt + 1), _r && gt !== te && gt !== ne && gt !== Z && gt !== re && gt !== d && gt !== X && (Nt += 1), ir.push(["word", At.slice(dt, Nt + 1), ct, dt - qe, ct, Nt - qe, dt]), dt = Nt;
                break;
              default:
                gt === te && At.charCodeAt(dt + 1) === We ? (Nt = At.indexOf("*/", dt + 2) + 1, Nt === 0 && It("comment", "*/"), Jr = At.slice(dt, Nt + 1), Zr = Jr.split(`
`), Or = Zr.length - 1, Or > 0 ? (Fr = ct + Or, zt = Nt - Zr[Or].length) : (Fr = ct, zt = qe), ir.push(["comment", Jr, ct, dt - qe, Fr, Nt - zt, dt]), qe = zt, ct = Fr, dt = Nt) : (tr.lastIndex = dt + 1, tr.test(At), tr.lastIndex === 0 ? Nt = At.length - 1 : Nt = tr.lastIndex - 2, ir.push(["word", At.slice(dt, Nt + 1), ct, dt - qe, ct, Nt - qe, dt]), dt = Nt);
                break;
            }
            dt++;
          }
          return ir;
        }
        z.exports = a.default;
      } }), Vr = Ae({ "node_modules/postcss-selector-parser/dist/parser.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = function() {
          function qe(ct, dt) {
            for (var It = 0; It < dt.length; It++) {
              var Ve = dt[It];
              Ve.enumerable = Ve.enumerable || !1, Ve.configurable = !0, "value" in Ve && (Ve.writable = !0), Object.defineProperty(ct, Ve.key, Ve);
            }
          }
          return function(ct, dt, It) {
            return dt && qe(ct.prototype, dt), It && qe(ct, It), ct;
          };
        }(), V = Ao(), Y = vr(V), te = wo(), Z = vr(te), ne = Dn(), X = vr(ne), re = Ui(), d = vr(re), n = tn(), q = vr(n), L = So(), ae = vr(L), ue = To(), ve = vr(ue), De = ko(), le = vr(De), Ie = Bo(), Me = vr(Ie), We = No(), Ft = vr(We), Pt = bi(), Mt = vr(Pt), rr = jo(), tr = vr(rr), pr = Is(), er = vr(pr), ir = Po(), At = vr(ir), gt = _o(), Nt = vr(gt), mt = Gi(), Zr = vr(mt), Or = Fa(), Jr = vr(Or), _r = En(), Fr = zt(_r);
        function zt(qe) {
          if (qe && qe.__esModule)
            return qe;
          var ct = {};
          if (qe != null)
            for (var dt in qe)
              Object.prototype.hasOwnProperty.call(qe, dt) && (ct[dt] = qe[dt]);
          return ct.default = qe, ct;
        }
        function vr(qe) {
          return qe && qe.__esModule ? qe : { default: qe };
        }
        function lr(qe, ct) {
          if (!(qe instanceof ct))
            throw new TypeError("Cannot call a class as a function");
        }
        var fr = function() {
          function qe(ct) {
            lr(this, qe), this.input = ct, this.lossy = ct.options.lossless === !1, this.position = 0, this.root = new d.default();
            var dt = new q.default();
            return this.root.append(dt), this.current = dt, this.lossy ? this.tokens = (0, Jr.default)({ safe: ct.safe, css: ct.css.trim() }) : this.tokens = (0, Jr.default)(ct), this.loop();
          }
          return qe.prototype.attribute = function() {
            var ct = "", dt = void 0, It = this.currToken;
            for (this.position++; this.position < this.tokens.length && this.currToken[0] !== "]"; )
              ct += this.tokens[this.position][1], this.position++;
            this.position === this.tokens.length && !~ct.indexOf("]") && this.error("Expected a closing square bracket.");
            var Ve = ct.split(/((?:[*~^$|]?=))([^]*)/), Yt = Ve[0].split(/(\|)/g), Jt = { operator: Ve[1], value: Ve[2], source: { start: { line: It[2], column: It[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: It[4] };
            if (Yt.length > 1 ? (Yt[0] === "" && (Yt[0] = !0), Jt.attribute = this.parseValue(Yt[2]), Jt.namespace = this.parseNamespace(Yt[0])) : Jt.attribute = this.parseValue(Ve[0]), dt = new tr.default(Jt), Ve[2]) {
              var on = Ve[2].split(/(\s+i\s*?)$/), an = on[0].trim();
              dt.value = this.lossy ? an : on[0], on[1] && (dt.insensitive = !0, this.lossy || (dt.raws.insensitive = on[1])), dt.quoted = an[0] === "'" || an[0] === '"', dt.raws.unquoted = dt.quoted ? an.slice(1, -1) : an;
            }
            this.newNode(dt), this.position++;
          }, qe.prototype.combinator = function() {
            if (this.currToken[1] === "|")
              return this.namespace();
            for (var ct = new At.default({ value: "", source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }); this.position < this.tokens.length && this.currToken && (this.currToken[0] === "space" || this.currToken[0] === "combinator"); )
              this.nextToken && this.nextToken[0] === "combinator" ? (ct.spaces.before = this.parseSpace(this.currToken[1]), ct.source.start.line = this.nextToken[2], ct.source.start.column = this.nextToken[3], ct.source.end.column = this.nextToken[3], ct.source.end.line = this.nextToken[2], ct.sourceIndex = this.nextToken[4]) : this.prevToken && this.prevToken[0] === "combinator" ? ct.spaces.after = this.parseSpace(this.currToken[1]) : this.currToken[0] === "combinator" ? ct.value = this.currToken[1] : this.currToken[0] === "space" && (ct.value = this.parseSpace(this.currToken[1], " ")), this.position++;
            return this.newNode(ct);
          }, qe.prototype.comma = function() {
            if (this.position === this.tokens.length - 1) {
              this.root.trailingComma = !0, this.position++;
              return;
            }
            var ct = new q.default();
            this.current.parent.append(ct), this.current = ct, this.position++;
          }, qe.prototype.comment = function() {
            var ct = new ve.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[4], column: this.currToken[5] } }, sourceIndex: this.currToken[6] });
            this.newNode(ct), this.position++;
          }, qe.prototype.error = function(ct) {
            throw new this.input.error(ct);
          }, qe.prototype.missingBackslash = function() {
            return this.error("Expected a backslash preceding the semicolon.");
          }, qe.prototype.missingParenthesis = function() {
            return this.error("Expected opening parenthesis.");
          }, qe.prototype.missingSquareBracket = function() {
            return this.error("Expected opening square bracket.");
          }, qe.prototype.namespace = function() {
            var ct = this.prevToken && this.prevToken[1] || !0;
            if (this.nextToken[0] === "word")
              return this.position++, this.word(ct);
            if (this.nextToken[0] === "*")
              return this.position++, this.universal(ct);
          }, qe.prototype.nesting = function() {
            this.newNode(new Nt.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] })), this.position++;
          }, qe.prototype.parentheses = function() {
            var ct = this.current.last;
            if (ct && ct.type === Fr.PSEUDO) {
              var dt = new q.default(), It = this.current;
              ct.append(dt), this.current = dt;
              var Ve = 1;
              for (this.position++; this.position < this.tokens.length && Ve; )
                this.currToken[0] === "(" && Ve++, this.currToken[0] === ")" && Ve--, Ve ? this.parse() : (dt.parent.source.end.line = this.currToken[2], dt.parent.source.end.column = this.currToken[3], this.position++);
              Ve && this.error("Expected closing parenthesis."), this.current = It;
            } else {
              var Yt = 1;
              for (this.position++, ct.value += "("; this.position < this.tokens.length && Yt; )
                this.currToken[0] === "(" && Yt++, this.currToken[0] === ")" && Yt--, ct.value += this.parseParenthesisToken(this.currToken), this.position++;
              Yt && this.error("Expected closing parenthesis.");
            }
          }, qe.prototype.pseudo = function() {
            for (var ct = this, dt = "", It = this.currToken; this.currToken && this.currToken[0] === ":"; )
              dt += this.currToken[1], this.position++;
            if (!this.currToken)
              return this.error("Expected pseudo-class or pseudo-element");
            if (this.currToken[0] === "word") {
              var Ve = void 0;
              this.splitWord(!1, function(Yt, Jt) {
                dt += Yt, Ve = new Mt.default({ value: dt, source: { start: { line: It[2], column: It[3] }, end: { line: ct.currToken[4], column: ct.currToken[5] } }, sourceIndex: It[4] }), ct.newNode(Ve), Jt > 1 && ct.nextToken && ct.nextToken[0] === "(" && ct.error("Misplaced parenthesis.");
              });
            } else
              this.error('Unexpected "' + this.currToken[0] + '" found.');
          }, qe.prototype.space = function() {
            var ct = this.currToken;
            this.position === 0 || this.prevToken[0] === "," || this.prevToken[0] === "(" ? (this.spaces = this.parseSpace(ct[1]), this.position++) : this.position === this.tokens.length - 1 || this.nextToken[0] === "," || this.nextToken[0] === ")" ? (this.current.last.spaces.after = this.parseSpace(ct[1]), this.position++) : this.combinator();
          }, qe.prototype.string = function() {
            var ct = this.currToken;
            this.newNode(new Ft.default({ value: this.currToken[1], source: { start: { line: ct[2], column: ct[3] }, end: { line: ct[4], column: ct[5] } }, sourceIndex: ct[6] })), this.position++;
          }, qe.prototype.universal = function(ct) {
            var dt = this.nextToken;
            if (dt && dt[1] === "|")
              return this.position++, this.namespace();
            this.newNode(new er.default({ value: this.currToken[1], source: { start: { line: this.currToken[2], column: this.currToken[3] }, end: { line: this.currToken[2], column: this.currToken[3] } }, sourceIndex: this.currToken[4] }), ct), this.position++;
          }, qe.prototype.splitWord = function(ct, dt) {
            for (var It = this, Ve = this.nextToken, Yt = this.currToken[1]; Ve && Ve[0] === "word"; ) {
              this.position++;
              var Jt = this.currToken[1];
              if (Yt += Jt, Jt.lastIndexOf("\\") === Jt.length - 1) {
                var on = this.nextToken;
                on && on[0] === "space" && (Yt += this.parseSpace(on[1], " "), this.position++);
              }
              Ve = this.nextToken;
            }
            var an = (0, Z.default)(Yt, "."), wn = (0, Z.default)(Yt, "#"), zn = (0, Z.default)(Yt, "#{");
            zn.length && (wn = wn.filter(function(ln) {
              return !~zn.indexOf(ln);
            }));
            var xn = (0, Zr.default)((0, X.default)((0, Y.default)([[0], an, wn])));
            xn.forEach(function(ln, cn) {
              var hn = xn[cn + 1] || Yt.length, Yr = Yt.slice(ln, hn);
              if (cn === 0 && dt)
                return dt.call(It, Yr, xn.length);
              var Sn = void 0;
              ~an.indexOf(ln) ? Sn = new ae.default({ value: Yr.slice(1), source: { start: { line: It.currToken[2], column: It.currToken[3] + ln }, end: { line: It.currToken[4], column: It.currToken[3] + (hn - 1) } }, sourceIndex: It.currToken[6] + xn[cn] }) : ~wn.indexOf(ln) ? Sn = new le.default({ value: Yr.slice(1), source: { start: { line: It.currToken[2], column: It.currToken[3] + ln }, end: { line: It.currToken[4], column: It.currToken[3] + (hn - 1) } }, sourceIndex: It.currToken[6] + xn[cn] }) : Sn = new Me.default({ value: Yr, source: { start: { line: It.currToken[2], column: It.currToken[3] + ln }, end: { line: It.currToken[4], column: It.currToken[3] + (hn - 1) } }, sourceIndex: It.currToken[6] + xn[cn] }), It.newNode(Sn, ct);
            }), this.position++;
          }, qe.prototype.word = function(ct) {
            var dt = this.nextToken;
            return dt && dt[1] === "|" ? (this.position++, this.namespace()) : this.splitWord(ct);
          }, qe.prototype.loop = function() {
            for (; this.position < this.tokens.length; )
              this.parse(!0);
            return this.root;
          }, qe.prototype.parse = function(ct) {
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
                ct && this.missingParenthesis();
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
          }, qe.prototype.parseNamespace = function(ct) {
            if (this.lossy && typeof ct == "string") {
              var dt = ct.trim();
              return dt.length ? dt : !0;
            }
            return ct;
          }, qe.prototype.parseSpace = function(ct, dt) {
            return this.lossy ? dt || "" : ct;
          }, qe.prototype.parseValue = function(ct) {
            return this.lossy && ct && typeof ct == "string" ? ct.trim() : ct;
          }, qe.prototype.parseParenthesisToken = function(ct) {
            return this.lossy ? ct[0] === "space" ? this.parseSpace(ct[1], " ") : this.parseValue(ct[1]) : ct[1];
          }, qe.prototype.newNode = function(ct, dt) {
            return dt && (ct.namespace = this.parseNamespace(dt)), this.spaces && (ct.spaces.before = this.spaces, this.spaces = ""), this.current.append(ct);
          }, $(qe, [{ key: "currToken", get: function() {
            return this.tokens[this.position];
          } }, { key: "nextToken", get: function() {
            return this.tokens[this.position + 1];
          } }, { key: "prevToken", get: function() {
            return this.tokens[this.position - 1];
          } }]), qe;
        }();
        a.default = fr, z.exports = a.default;
      } }), zi = Ae({ "node_modules/postcss-selector-parser/dist/processor.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = function() {
          function X(re, d) {
            for (var n = 0; n < d.length; n++) {
              var q = d[n];
              q.enumerable = q.enumerable || !1, q.configurable = !0, "value" in q && (q.writable = !0), Object.defineProperty(re, q.key, q);
            }
          }
          return function(re, d, n) {
            return d && X(re.prototype, d), n && X(re, n), re;
          };
        }(), V = Vr(), Y = te(V);
        function te(X) {
          return X && X.__esModule ? X : { default: X };
        }
        function Z(X, re) {
          if (!(X instanceof re))
            throw new TypeError("Cannot call a class as a function");
        }
        var ne = function() {
          function X(re) {
            return Z(this, X), this.func = re || function() {
            }, this;
          }
          return X.prototype.process = function(re) {
            var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = new Y.default({ css: re, error: function(q) {
              throw new Error(q);
            }, options: d });
            return this.res = n, this.func(n), this;
          }, $(X, [{ key: "result", get: function() {
            return String(this.res);
          } }]), X;
        }();
        a.default = ne, z.exports = a.default;
      } }), Aa = Ae({ "node_modules/postcss-selector-parser/dist/index.js"(a, z) {
        Ye(), a.__esModule = !0;
        var $ = zi(), V = gt($), Y = jo(), te = gt(Y), Z = So(), ne = gt(Z), X = Po(), re = gt(X), d = To(), n = gt(d), q = ko(), L = gt(q), ae = _o(), ue = gt(ae), ve = bi(), De = gt(ve), le = Ui(), Ie = gt(le), Me = tn(), We = gt(Me), Ft = No(), Pt = gt(Ft), Mt = Bo(), rr = gt(Mt), tr = Is(), pr = gt(tr), er = En(), ir = At(er);
        function At(mt) {
          if (mt && mt.__esModule)
            return mt;
          var Zr = {};
          if (mt != null)
            for (var Or in mt)
              Object.prototype.hasOwnProperty.call(mt, Or) && (Zr[Or] = mt[Or]);
          return Zr.default = mt, Zr;
        }
        function gt(mt) {
          return mt && mt.__esModule ? mt : { default: mt };
        }
        var Nt = function(mt) {
          return new V.default(mt);
        };
        Nt.attribute = function(mt) {
          return new te.default(mt);
        }, Nt.className = function(mt) {
          return new ne.default(mt);
        }, Nt.combinator = function(mt) {
          return new re.default(mt);
        }, Nt.comment = function(mt) {
          return new n.default(mt);
        }, Nt.id = function(mt) {
          return new L.default(mt);
        }, Nt.nesting = function(mt) {
          return new ue.default(mt);
        }, Nt.pseudo = function(mt) {
          return new De.default(mt);
        }, Nt.root = function(mt) {
          return new Ie.default(mt);
        }, Nt.selector = function(mt) {
          return new We.default(mt);
        }, Nt.string = function(mt) {
          return new Pt.default(mt);
        }, Nt.tag = function(mt) {
          return new rr.default(mt);
        }, Nt.universal = function(mt) {
          return new pr.default(mt);
        }, Object.keys(ir).forEach(function(mt) {
          mt !== "__esModule" && (Nt[mt] = ir[mt]);
        }), a.default = Nt, z.exports = a.default;
      } }), Io = Ae({ "node_modules/postcss-media-query-parser/dist/nodes/Node.js"(a) {
        Ye(), Object.defineProperty(a, "__esModule", { value: !0 });
        function z($) {
          this.after = $.after, this.before = $.before, this.type = $.type, this.value = $.value, this.sourceIndex = $.sourceIndex;
        }
        a.default = z;
      } }), Oo = Ae({ "node_modules/postcss-media-query-parser/dist/nodes/Container.js"(a) {
        Ye(), Object.defineProperty(a, "__esModule", { value: !0 });
        var z = Io(), $ = V(z);
        function V(te) {
          return te && te.__esModule ? te : { default: te };
        }
        function Y(te) {
          var Z = this;
          this.constructor(te), this.nodes = te.nodes, this.after === void 0 && (this.after = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1].after : ""), this.before === void 0 && (this.before = this.nodes.length > 0 ? this.nodes[0].before : ""), this.sourceIndex === void 0 && (this.sourceIndex = this.before.length), this.nodes.forEach(function(ne) {
            ne.parent = Z;
          });
        }
        Y.prototype = Object.create($.default.prototype), Y.constructor = $.default, Y.prototype.walk = function(te, Z) {
          for (var ne = typeof te == "string" || te instanceof RegExp, X = ne ? Z : te, re = typeof te == "string" ? new RegExp(te) : te, d = 0; d < this.nodes.length; d++) {
            var n = this.nodes[d], q = ne ? re.test(n.type) : !0;
            if (q && X && X(n, d, this.nodes) === !1 || n.nodes && n.walk(te, Z) === !1)
              return !1;
          }
          return !0;
        }, Y.prototype.each = function() {
          for (var te = arguments.length <= 0 || arguments[0] === void 0 ? function() {
          } : arguments[0], Z = 0; Z < this.nodes.length; Z++) {
            var ne = this.nodes[Z];
            if (te(ne, Z, this.nodes) === !1)
              return !1;
          }
          return !0;
        }, a.default = Y;
      } }), wa = Ae({ "node_modules/postcss-media-query-parser/dist/parsers.js"(a) {
        Ye(), Object.defineProperty(a, "__esModule", { value: !0 }), a.parseMediaFeature = Z, a.parseMediaQuery = ne, a.parseMediaList = X;
        var z = Io(), $ = te(z), V = Oo(), Y = te(V);
        function te(re) {
          return re && re.__esModule ? re : { default: re };
        }
        function Z(re) {
          var d = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1], n = [{ mode: "normal", character: null }], q = [], L = 0, ae = "", ue = null, ve = null, De = d, le = re;
          re[0] === "(" && re[re.length - 1] === ")" && (le = re.substring(1, re.length - 1), De++);
          for (var Ie = 0; Ie < le.length; Ie++) {
            var Me = le[Ie];
            if ((Me === "'" || Me === '"') && (n[L].isCalculationEnabled === !0 ? (n.push({ mode: "string", isCalculationEnabled: !1, character: Me }), L++) : n[L].mode === "string" && n[L].character === Me && le[Ie - 1] !== "\\" && (n.pop(), L--)), Me === "{" ? (n.push({ mode: "interpolation", isCalculationEnabled: !0 }), L++) : Me === "}" && (n.pop(), L--), n[L].mode === "normal" && Me === ":") {
              var We = le.substring(Ie + 1);
              ve = { type: "value", before: /^(\s*)/.exec(We)[1], after: /(\s*)$/.exec(We)[1], value: We.trim() }, ve.sourceIndex = ve.before.length + Ie + 1 + De, ue = { type: "colon", sourceIndex: Ie + De, after: ve.before, value: ":" };
              break;
            }
            ae += Me;
          }
          return ae = { type: "media-feature", before: /^(\s*)/.exec(ae)[1], after: /(\s*)$/.exec(ae)[1], value: ae.trim() }, ae.sourceIndex = ae.before.length + De, q.push(ae), ue !== null && (ue.before = ae.after, q.push(ue)), ve !== null && q.push(ve), q;
        }
        function ne(re) {
          var d = arguments.length <= 1 || arguments[1] === void 0 ? 0 : arguments[1], n = [], q = 0, L = !1, ae = void 0;
          function ue() {
            return { before: "", after: "", value: "" };
          }
          ae = ue();
          for (var ve = 0; ve < re.length; ve++) {
            var De = re[ve];
            L ? (ae.value += De, (De === "{" || De === "(") && q++, (De === ")" || De === "}") && q--) : De.search(/\s/) !== -1 ? ae.before += De : (De === "(" && (ae.type = "media-feature-expression", q++), ae.value = De, ae.sourceIndex = d + ve, L = !0), L && q === 0 && (De === ")" || ve === re.length - 1 || re[ve + 1].search(/\s/) !== -1) && (["not", "only", "and"].indexOf(ae.value) !== -1 && (ae.type = "keyword"), ae.type === "media-feature-expression" && (ae.nodes = Z(ae.value, ae.sourceIndex)), n.push(Array.isArray(ae.nodes) ? new Y.default(ae) : new $.default(ae)), ae = ue(), L = !1);
          }
          for (var le = 0; le < n.length; le++)
            if (ae = n[le], le > 0 && (n[le - 1].after = ae.before), ae.type === void 0) {
              if (le > 0) {
                if (n[le - 1].type === "media-feature-expression") {
                  ae.type = "keyword";
                  continue;
                }
                if (n[le - 1].value === "not" || n[le - 1].value === "only") {
                  ae.type = "media-type";
                  continue;
                }
                if (n[le - 1].value === "and") {
                  ae.type = "media-feature-expression";
                  continue;
                }
                n[le - 1].type === "media-type" && (n[le + 1] ? ae.type = n[le + 1].type === "media-feature-expression" ? "keyword" : "media-feature-expression" : ae.type = "media-feature-expression");
              }
              if (le === 0) {
                if (!n[le + 1]) {
                  ae.type = "media-type";
                  continue;
                }
                if (n[le + 1] && (n[le + 1].type === "media-feature-expression" || n[le + 1].type === "keyword")) {
                  ae.type = "media-type";
                  continue;
                }
                if (n[le + 2]) {
                  if (n[le + 2].type === "media-feature-expression") {
                    ae.type = "media-type", n[le + 1].type = "keyword";
                    continue;
                  }
                  if (n[le + 2].type === "keyword") {
                    ae.type = "keyword", n[le + 1].type = "media-type";
                    continue;
                  }
                }
                if (n[le + 3] && n[le + 3].type === "media-feature-expression") {
                  ae.type = "keyword", n[le + 1].type = "media-type", n[le + 2].type = "keyword";
                  continue;
                }
              }
            }
          return n;
        }
        function X(re) {
          var d = [], n = 0, q = 0, L = /^(\s*)url\s*\(/.exec(re);
          if (L !== null) {
            for (var ae = L[0].length, ue = 1; ue > 0; ) {
              var ve = re[ae];
              ve === "(" && ue++, ve === ")" && ue--, ae++;
            }
            d.unshift(new $.default({ type: "url", value: re.substring(0, ae).trim(), sourceIndex: L[1].length, before: L[1], after: /^(\s*)/.exec(re.substring(ae))[1] })), n = ae;
          }
          for (var De = n; De < re.length; De++) {
            var le = re[De];
            if (le === "(" && q++, le === ")" && q--, q === 0 && le === ",") {
              var Ie = re.substring(n, De), Me = /^(\s*)/.exec(Ie)[1];
              d.push(new Y.default({ type: "media-query", value: Ie.trim(), sourceIndex: n + Me.length, nodes: ne(Ie, n), before: Me, after: /(\s*)$/.exec(Ie)[1] })), n = De + 1;
            }
          }
          var We = re.substring(n), Ft = /^(\s*)/.exec(We)[1];
          return d.push(new Y.default({ type: "media-query", value: We.trim(), sourceIndex: n + Ft.length, nodes: ne(We, n), before: Ft, after: /(\s*)$/.exec(We)[1] })), d;
        }
      } }), Sa = Ae({ "node_modules/postcss-media-query-parser/dist/index.js"(a) {
        Ye(), Object.defineProperty(a, "__esModule", { value: !0 }), a.default = te;
        var z = Oo(), $ = Y(z), V = wa();
        function Y(Z) {
          return Z && Z.__esModule ? Z : { default: Z };
        }
        function te(Z) {
          return new $.default({ nodes: (0, V.parseMediaList)(Z), type: "media-query-list", value: Z.trim() });
        }
      } }), Lo = {};
      lt(Lo, { basename: () => Rs, default: () => Vu, delimiter: () => Us, dirname: () => $s, extname: () => Vs, isAbsolute: () => $u, join: () => Ls, normalize: () => Mu, relative: () => Ms, resolve: () => du, sep: () => Js });
      function Os(a, z) {
        for (var $ = 0, V = a.length - 1; V >= 0; V--) {
          var Y = a[V];
          Y === "." ? a.splice(V, 1) : Y === ".." ? (a.splice(V, 1), $++) : $ && (a.splice(V, 1), $--);
        }
        if (z)
          for (; $--; $)
            a.unshift("..");
        return a;
      }
      function du() {
        for (var a = "", z = !1, $ = arguments.length - 1; $ >= -1 && !z; $--) {
          var V = $ >= 0 ? arguments[$] : "/";
          if (typeof V != "string")
            throw new TypeError("Arguments to path.resolve must be strings");
          V && (a = V + "/" + a, z = V.charAt(0) === "/");
        }
        return a = Os(Ru(a.split("/"), function(Y) {
          return !!Y;
        }), !z).join("/"), (z ? "/" : "") + a || ".";
      }
      function Mu(a) {
        var z = $u(a), $ = mu(a, -1) === "/";
        return a = Os(Ru(a.split("/"), function(V) {
          return !!V;
        }), !z).join("/"), !a && !z && (a = "."), a && $ && (a += "/"), (z ? "/" : "") + a;
      }
      function $u(a) {
        return a.charAt(0) === "/";
      }
      function Ls() {
        var a = Array.prototype.slice.call(arguments, 0);
        return Mu(Ru(a, function(z, $) {
          if (typeof z != "string")
            throw new TypeError("Arguments to path.join must be strings");
          return z;
        }).join("/"));
      }
      function Ms(a, z) {
        a = du(a).substr(1), z = du(z).substr(1);
        function $(re) {
          for (var d = 0; d < re.length && re[d] === ""; d++)
            ;
          for (var n = re.length - 1; n >= 0 && re[n] === ""; n--)
            ;
          return d > n ? [] : re.slice(d, n - d + 1);
        }
        for (var V = $(a.split("/")), Y = $(z.split("/")), te = Math.min(V.length, Y.length), Z = te, ne = 0; ne < te; ne++)
          if (V[ne] !== Y[ne]) {
            Z = ne;
            break;
          }
        for (var X = [], ne = Z; ne < V.length; ne++)
          X.push("..");
        return X = X.concat(Y.slice(Z)), X.join("/");
      }
      function $s(a) {
        var z = hu(a), $ = z[0], V = z[1];
        return !$ && !V ? "." : (V && (V = V.substr(0, V.length - 1)), $ + V);
      }
      function Rs(a, z) {
        var $ = hu(a)[2];
        return z && $.substr(-1 * z.length) === z && ($ = $.substr(0, $.length - z.length)), $;
      }
      function Vs(a) {
        return hu(a)[3];
      }
      function Ru(a, z) {
        if (a.filter)
          return a.filter(z);
        for (var $ = [], V = 0; V < a.length; V++)
          z(a[V], V, a) && $.push(a[V]);
        return $;
      }
      var qs, hu, Js, Us, Vu, mu, Gs = et({ "node-modules-polyfills:path"() {
        Ye(), qs = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, hu = function(a) {
          return qs.exec(a).slice(1);
        }, Js = "/", Us = ":", Vu = { extname: Vs, basename: Rs, dirname: $s, sep: Js, delimiter: Us, relative: Ms, join: Ls, isAbsolute: $u, normalize: Mu, resolve: du }, mu = "ab".substr(-1) === "b" ? function(a, z, $) {
          return a.substr(z, $);
        } : function(a, z, $) {
          return z < 0 && (z = a.length + z), a.substr(z, $);
        };
      } }), zs = Ae({ "node-modules-polyfills-commonjs:path"(a, z) {
        Ye();
        var $ = (Gs(), Rt(Lo));
        if ($ && $.default) {
          z.exports = $.default;
          for (let V in $)
            z.exports[V] = $[V];
        } else
          $ && (z.exports = $);
      } }), Mo = Ae({ "node_modules/picocolors/picocolors.browser.js"(a, z) {
        Ye();
        var $ = String, V = function() {
          return { isColorSupported: !1, reset: $, bold: $, dim: $, italic: $, underline: $, inverse: $, hidden: $, strikethrough: $, black: $, red: $, green: $, yellow: $, blue: $, magenta: $, cyan: $, white: $, gray: $, bgBlack: $, bgRed: $, bgGreen: $, bgYellow: $, bgBlue: $, bgMagenta: $, bgCyan: $, bgWhite: $ };
        };
        z.exports = V(), z.exports.createColors = V;
      } }), Ta = Ae({ "(disabled):node_modules/postcss/lib/terminal-highlight"() {
        Ye();
      } }), $o = Ae({ "node_modules/postcss/lib/css-syntax-error.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = Y(Mo()), V = Y(Ta());
        function Y(ue) {
          return ue && ue.__esModule ? ue : { default: ue };
        }
        function te(ue) {
          if (ue === void 0)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return ue;
        }
        function Z(ue, ve) {
          ue.prototype = Object.create(ve.prototype), ue.prototype.constructor = ue, ue.__proto__ = ve;
        }
        function ne(ue) {
          var ve = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
          return ne = function(De) {
            if (De === null || !d(De))
              return De;
            if (typeof De != "function")
              throw new TypeError("Super expression must either be null or a function");
            if (typeof ve < "u") {
              if (ve.has(De))
                return ve.get(De);
              ve.set(De, le);
            }
            function le() {
              return X(De, arguments, q(this).constructor);
            }
            return le.prototype = Object.create(De.prototype, { constructor: { value: le, enumerable: !1, writable: !0, configurable: !0 } }), n(le, De);
          }, ne(ue);
        }
        function X(ue, ve, De) {
          return re() ? X = Reflect.construct : X = function(le, Ie, Me) {
            var We = [null];
            We.push.apply(We, Ie);
            var Ft = Function.bind.apply(le, We), Pt = new Ft();
            return Me && n(Pt, Me.prototype), Pt;
          }, X.apply(null, arguments);
        }
        function re() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
            return !1;
          if (typeof Proxy == "function")
            return !0;
          try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }
        function d(ue) {
          return Function.toString.call(ue).indexOf("[native code]") !== -1;
        }
        function n(ue, ve) {
          return n = Object.setPrototypeOf || function(De, le) {
            return De.__proto__ = le, De;
          }, n(ue, ve);
        }
        function q(ue) {
          return q = Object.setPrototypeOf ? Object.getPrototypeOf : function(ve) {
            return ve.__proto__ || Object.getPrototypeOf(ve);
          }, q(ue);
        }
        var L = function(ue) {
          Z(ve, ue);
          function ve(le, Ie, Me, We, Ft, Pt) {
            var Mt;
            return Mt = ue.call(this, le) || this, Mt.name = "CssSyntaxError", Mt.reason = le, Ft && (Mt.file = Ft), We && (Mt.source = We), Pt && (Mt.plugin = Pt), typeof Ie < "u" && typeof Me < "u" && (Mt.line = Ie, Mt.column = Me), Mt.setMessage(), Error.captureStackTrace && Error.captureStackTrace(te(Mt), ve), Mt;
          }
          var De = ve.prototype;
          return De.setMessage = function() {
            this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
          }, De.showSourceCode = function(le) {
            var Ie = this;
            if (!this.source)
              return "";
            var Me = this.source;
            V.default && (typeof le > "u" && (le = $.default.isColorSupported), le && (Me = (0, V.default)(Me)));
            var We = Me.split(/\r?\n/), Ft = Math.max(this.line - 3, 0), Pt = Math.min(this.line + 2, We.length), Mt = String(Pt).length;
            function rr(pr) {
              return le && $.default.red ? $.default.red($.default.bold(pr)) : pr;
            }
            function tr(pr) {
              return le && $.default.gray ? $.default.gray(pr) : pr;
            }
            return We.slice(Ft, Pt).map(function(pr, er) {
              var ir = Ft + 1 + er, At = " " + (" " + ir).slice(-Mt) + " | ";
              if (ir === Ie.line) {
                var gt = tr(At.replace(/\d/g, " ")) + pr.slice(0, Ie.column - 1).replace(/[^\t]/g, " ");
                return rr(">") + tr(At) + pr + `
 ` + gt + rr("^");
              }
              return " " + tr(At) + pr;
            }).join(`
`);
          }, De.toString = function() {
            var le = this.showSourceCode();
            return le && (le = `

` + le + `
`), this.name + ": " + this.message + le;
          }, ve;
        }(ne(Error)), ae = L;
        a.default = ae, z.exports = a.default;
      } }), ka = Ae({ "node_modules/postcss/lib/previous-map.js"(a, z) {
        Ye(), z.exports = class {
        };
      } }), qu = Ae({ "node_modules/postcss/lib/input.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = te(zs()), V = te($o()), Y = te(ka());
        function te(n) {
          return n && n.__esModule ? n : { default: n };
        }
        function Z(n, q) {
          for (var L = 0; L < q.length; L++) {
            var ae = q[L];
            ae.enumerable = ae.enumerable || !1, ae.configurable = !0, "value" in ae && (ae.writable = !0), Object.defineProperty(n, ae.key, ae);
          }
        }
        function ne(n, q, L) {
          return q && Z(n.prototype, q), L && Z(n, L), n;
        }
        var X = 0, re = function() {
          function n(L, ae) {
            if (ae === void 0 && (ae = {}), L === null || typeof L > "u" || typeof L == "object" && !L.toString)
              throw new Error("PostCSS received " + L + " instead of CSS string");
            this.css = L.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, ae.from && (/^\w+:\/\//.test(ae.from) || $.default.isAbsolute(ae.from) ? this.file = ae.from : this.file = $.default.resolve(ae.from));
            var ue = new Y.default(this.css, ae);
            if (ue.text) {
              this.map = ue;
              var ve = ue.consumer().file;
              !this.file && ve && (this.file = this.mapResolve(ve));
            }
            this.file || (X += 1, this.id = "<input css " + X + ">"), this.map && (this.map.file = this.from);
          }
          var q = n.prototype;
          return q.error = function(L, ae, ue, ve) {
            ve === void 0 && (ve = {});
            var De, le = this.origin(ae, ue);
            return le ? De = new V.default(L, le.line, le.column, le.source, le.file, ve.plugin) : De = new V.default(L, ae, ue, this.css, this.file, ve.plugin), De.input = { line: ae, column: ue, source: this.css }, this.file && (De.input.file = this.file), De;
          }, q.origin = function(L, ae) {
            if (!this.map)
              return !1;
            var ue = this.map.consumer(), ve = ue.originalPositionFor({ line: L, column: ae });
            if (!ve.source)
              return !1;
            var De = { file: this.mapResolve(ve.source), line: ve.line, column: ve.column }, le = ue.sourceContentFor(ve.source);
            return le && (De.source = le), De;
          }, q.mapResolve = function(L) {
            return /^\w+:\/\//.test(L) ? L : $.default.resolve(this.map.consumer().sourceRoot || ".", L);
          }, ne(n, [{ key: "from", get: function() {
            return this.file || this.id;
          } }]), n;
        }(), d = re;
        a.default = d, z.exports = a.default;
      } }), Ju = Ae({ "node_modules/postcss/lib/stringifier.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = { colon: ": ", indent: "    ", beforeDecl: `
`, beforeRule: `
`, beforeOpen: " ", beforeClose: `
`, beforeComment: `
`, after: `
`, emptyBody: "", commentLeft: " ", commentRight: " ", semicolon: !1 };
        function V(Z) {
          return Z[0].toUpperCase() + Z.slice(1);
        }
        var Y = function() {
          function Z(X) {
            this.builder = X;
          }
          var ne = Z.prototype;
          return ne.stringify = function(X, re) {
            this[X.type](X, re);
          }, ne.root = function(X) {
            this.body(X), X.raws.after && this.builder(X.raws.after);
          }, ne.comment = function(X) {
            var re = this.raw(X, "left", "commentLeft"), d = this.raw(X, "right", "commentRight");
            this.builder("/*" + re + X.text + d + "*/", X);
          }, ne.decl = function(X, re) {
            var d = this.raw(X, "between", "colon"), n = X.prop + d + this.rawValue(X, "value");
            X.important && (n += X.raws.important || " !important"), re && (n += ";"), this.builder(n, X);
          }, ne.rule = function(X) {
            this.block(X, this.rawValue(X, "selector")), X.raws.ownSemicolon && this.builder(X.raws.ownSemicolon, X, "end");
          }, ne.atrule = function(X, re) {
            var d = "@" + X.name, n = X.params ? this.rawValue(X, "params") : "";
            if (typeof X.raws.afterName < "u" ? d += X.raws.afterName : n && (d += " "), X.nodes)
              this.block(X, d + n);
            else {
              var q = (X.raws.between || "") + (re ? ";" : "");
              this.builder(d + n + q, X);
            }
          }, ne.body = function(X) {
            for (var re = X.nodes.length - 1; re > 0 && X.nodes[re].type === "comment"; )
              re -= 1;
            for (var d = this.raw(X, "semicolon"), n = 0; n < X.nodes.length; n++) {
              var q = X.nodes[n], L = this.raw(q, "before");
              L && this.builder(L), this.stringify(q, re !== n || d);
            }
          }, ne.block = function(X, re) {
            var d = this.raw(X, "between", "beforeOpen");
            this.builder(re + d + "{", X, "start");
            var n;
            X.nodes && X.nodes.length ? (this.body(X), n = this.raw(X, "after")) : n = this.raw(X, "after", "emptyBody"), n && this.builder(n), this.builder("}", X, "end");
          }, ne.raw = function(X, re, d) {
            var n;
            if (d || (d = re), re && (n = X.raws[re], typeof n < "u"))
              return n;
            var q = X.parent;
            if (d === "before" && (!q || q.type === "root" && q.first === X))
              return "";
            if (!q)
              return $[d];
            var L = X.root();
            if (L.rawCache || (L.rawCache = {}), typeof L.rawCache[d] < "u")
              return L.rawCache[d];
            if (d === "before" || d === "after")
              return this.beforeAfter(X, d);
            var ae = "raw" + V(d);
            return this[ae] ? n = this[ae](L, X) : L.walk(function(ue) {
              if (n = ue.raws[re], typeof n < "u")
                return !1;
            }), typeof n > "u" && (n = $[d]), L.rawCache[d] = n, n;
          }, ne.rawSemicolon = function(X) {
            var re;
            return X.walk(function(d) {
              if (d.nodes && d.nodes.length && d.last.type === "decl" && (re = d.raws.semicolon, typeof re < "u"))
                return !1;
            }), re;
          }, ne.rawEmptyBody = function(X) {
            var re;
            return X.walk(function(d) {
              if (d.nodes && d.nodes.length === 0 && (re = d.raws.after, typeof re < "u"))
                return !1;
            }), re;
          }, ne.rawIndent = function(X) {
            if (X.raws.indent)
              return X.raws.indent;
            var re;
            return X.walk(function(d) {
              var n = d.parent;
              if (n && n !== X && n.parent && n.parent === X && typeof d.raws.before < "u") {
                var q = d.raws.before.split(`
`);
                return re = q[q.length - 1], re = re.replace(/[^\s]/g, ""), !1;
              }
            }), re;
          }, ne.rawBeforeComment = function(X, re) {
            var d;
            return X.walkComments(function(n) {
              if (typeof n.raws.before < "u")
                return d = n.raws.before, d.indexOf(`
`) !== -1 && (d = d.replace(/[^\n]+$/, "")), !1;
            }), typeof d > "u" ? d = this.raw(re, null, "beforeDecl") : d && (d = d.replace(/[^\s]/g, "")), d;
          }, ne.rawBeforeDecl = function(X, re) {
            var d;
            return X.walkDecls(function(n) {
              if (typeof n.raws.before < "u")
                return d = n.raws.before, d.indexOf(`
`) !== -1 && (d = d.replace(/[^\n]+$/, "")), !1;
            }), typeof d > "u" ? d = this.raw(re, null, "beforeRule") : d && (d = d.replace(/[^\s]/g, "")), d;
          }, ne.rawBeforeRule = function(X) {
            var re;
            return X.walk(function(d) {
              if (d.nodes && (d.parent !== X || X.first !== d) && typeof d.raws.before < "u")
                return re = d.raws.before, re.indexOf(`
`) !== -1 && (re = re.replace(/[^\n]+$/, "")), !1;
            }), re && (re = re.replace(/[^\s]/g, "")), re;
          }, ne.rawBeforeClose = function(X) {
            var re;
            return X.walk(function(d) {
              if (d.nodes && d.nodes.length > 0 && typeof d.raws.after < "u")
                return re = d.raws.after, re.indexOf(`
`) !== -1 && (re = re.replace(/[^\n]+$/, "")), !1;
            }), re && (re = re.replace(/[^\s]/g, "")), re;
          }, ne.rawBeforeOpen = function(X) {
            var re;
            return X.walk(function(d) {
              if (d.type !== "decl" && (re = d.raws.between, typeof re < "u"))
                return !1;
            }), re;
          }, ne.rawColon = function(X) {
            var re;
            return X.walkDecls(function(d) {
              if (typeof d.raws.between < "u")
                return re = d.raws.between.replace(/[^\s:]/g, ""), !1;
            }), re;
          }, ne.beforeAfter = function(X, re) {
            var d;
            X.type === "decl" ? d = this.raw(X, null, "beforeDecl") : X.type === "comment" ? d = this.raw(X, null, "beforeComment") : re === "before" ? d = this.raw(X, null, "beforeRule") : d = this.raw(X, null, "beforeClose");
            for (var n = X.parent, q = 0; n && n.type !== "root"; )
              q += 1, n = n.parent;
            if (d.indexOf(`
`) !== -1) {
              var L = this.raw(X, null, "indent");
              if (L.length)
                for (var ae = 0; ae < q; ae++)
                  d += L;
            }
            return d;
          }, ne.rawValue = function(X, re) {
            var d = X[re], n = X.raws[re];
            return n && n.value === d ? n.raw : d;
          }, Z;
        }(), te = Y;
        a.default = te, z.exports = a.default;
      } }), Ws = Ae({ "node_modules/postcss/lib/stringify.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Ju());
        function V(Z) {
          return Z && Z.__esModule ? Z : { default: Z };
        }
        function Y(Z, ne) {
          var X = new $.default(ne);
          X.stringify(Z);
        }
        var te = Y;
        a.default = te, z.exports = a.default;
      } }), Uu = Ae({ "node_modules/postcss/lib/node.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = te($o()), V = te(Ju()), Y = te(Ws());
        function te(re) {
          return re && re.__esModule ? re : { default: re };
        }
        function Z(re, d) {
          var n = new re.constructor();
          for (var q in re)
            if (re.hasOwnProperty(q)) {
              var L = re[q], ae = typeof L;
              q === "parent" && ae === "object" ? d && (n[q] = d) : q === "source" ? n[q] = L : L instanceof Array ? n[q] = L.map(function(ue) {
                return Z(ue, n);
              }) : (ae === "object" && L !== null && (L = Z(L)), n[q] = L);
            }
          return n;
        }
        var ne = function() {
          function re(n) {
            n === void 0 && (n = {}), this.raws = {};
            for (var q in n)
              this[q] = n[q];
          }
          var d = re.prototype;
          return d.error = function(n, q) {
            if (q === void 0 && (q = {}), this.source) {
              var L = this.positionBy(q);
              return this.source.input.error(n, L.line, L.column, q);
            }
            return new $.default(n);
          }, d.warn = function(n, q, L) {
            var ae = { node: this };
            for (var ue in L)
              ae[ue] = L[ue];
            return n.warn(q, ae);
          }, d.remove = function() {
            return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
          }, d.toString = function(n) {
            n === void 0 && (n = Y.default), n.stringify && (n = n.stringify);
            var q = "";
            return n(this, function(L) {
              q += L;
            }), q;
          }, d.clone = function(n) {
            n === void 0 && (n = {});
            var q = Z(this);
            for (var L in n)
              q[L] = n[L];
            return q;
          }, d.cloneBefore = function(n) {
            n === void 0 && (n = {});
            var q = this.clone(n);
            return this.parent.insertBefore(this, q), q;
          }, d.cloneAfter = function(n) {
            n === void 0 && (n = {});
            var q = this.clone(n);
            return this.parent.insertAfter(this, q), q;
          }, d.replaceWith = function() {
            if (this.parent) {
              for (var n = arguments.length, q = new Array(n), L = 0; L < n; L++)
                q[L] = arguments[L];
              for (var ae = 0, ue = q; ae < ue.length; ae++) {
                var ve = ue[ae];
                this.parent.insertBefore(this, ve);
              }
              this.remove();
            }
            return this;
          }, d.next = function() {
            if (this.parent) {
              var n = this.parent.index(this);
              return this.parent.nodes[n + 1];
            }
          }, d.prev = function() {
            if (this.parent) {
              var n = this.parent.index(this);
              return this.parent.nodes[n - 1];
            }
          }, d.before = function(n) {
            return this.parent.insertBefore(this, n), this;
          }, d.after = function(n) {
            return this.parent.insertAfter(this, n), this;
          }, d.toJSON = function() {
            var n = {};
            for (var q in this)
              if (this.hasOwnProperty(q) && q !== "parent") {
                var L = this[q];
                L instanceof Array ? n[q] = L.map(function(ae) {
                  return typeof ae == "object" && ae.toJSON ? ae.toJSON() : ae;
                }) : typeof L == "object" && L.toJSON ? n[q] = L.toJSON() : n[q] = L;
              }
            return n;
          }, d.raw = function(n, q) {
            var L = new V.default();
            return L.raw(this, n, q);
          }, d.root = function() {
            for (var n = this; n.parent; )
              n = n.parent;
            return n;
          }, d.cleanRaws = function(n) {
            delete this.raws.before, delete this.raws.after, n || delete this.raws.between;
          }, d.positionInside = function(n) {
            for (var q = this.toString(), L = this.source.start.column, ae = this.source.start.line, ue = 0; ue < n; ue++)
              q[ue] === `
` ? (L = 1, ae += 1) : L += 1;
            return { line: ae, column: L };
          }, d.positionBy = function(n) {
            var q = this.source.start;
            if (n.index)
              q = this.positionInside(n.index);
            else if (n.word) {
              var L = this.toString().indexOf(n.word);
              L !== -1 && (q = this.positionInside(L));
            }
            return q;
          }, re;
        }(), X = ne;
        a.default = X, z.exports = a.default;
      } }), ai = Ae({ "node_modules/postcss/lib/comment.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Uu());
        function V(ne) {
          return ne && ne.__esModule ? ne : { default: ne };
        }
        function Y(ne, X) {
          ne.prototype = Object.create(X.prototype), ne.prototype.constructor = ne, ne.__proto__ = X;
        }
        var te = function(ne) {
          Y(X, ne);
          function X(re) {
            var d;
            return d = ne.call(this, re) || this, d.type = "comment", d;
          }
          return X;
        }($.default), Z = te;
        a.default = Z, z.exports = a.default;
      } }), Xs = Ae({ "node_modules/postcss/lib/declaration.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Uu());
        function V(ne) {
          return ne && ne.__esModule ? ne : { default: ne };
        }
        function Y(ne, X) {
          ne.prototype = Object.create(X.prototype), ne.prototype.constructor = ne, ne.__proto__ = X;
        }
        var te = function(ne) {
          Y(X, ne);
          function X(re) {
            var d;
            return d = ne.call(this, re) || this, d.type = "decl", d;
          }
          return X;
        }($.default), Z = te;
        a.default = Z, z.exports = a.default;
      } }), Hs = Ae({ "node_modules/postcss/lib/tokenize.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = rr;
        var $ = "'".charCodeAt(0), V = '"'.charCodeAt(0), Y = "\\".charCodeAt(0), te = "/".charCodeAt(0), Z = `
`.charCodeAt(0), ne = " ".charCodeAt(0), X = "\f".charCodeAt(0), re = "	".charCodeAt(0), d = "\r".charCodeAt(0), n = "[".charCodeAt(0), q = "]".charCodeAt(0), L = "(".charCodeAt(0), ae = ")".charCodeAt(0), ue = "{".charCodeAt(0), ve = "}".charCodeAt(0), De = ";".charCodeAt(0), le = "*".charCodeAt(0), Ie = ":".charCodeAt(0), Me = "@".charCodeAt(0), We = /[ \n\t\r\f{}()'"\\;/[\]#]/g, Ft = /[ \n\t\r\f(){}:;@!'"\\\][#]|\/(?=\*)/g, Pt = /.[\\/("'\n]/, Mt = /[a-f0-9]/i;
        function rr(tr, pr) {
          pr === void 0 && (pr = {});
          var er = tr.css.valueOf(), ir = pr.ignoreErrors, At, gt, Nt, mt, Zr, Or, Jr, _r, Fr, zt, vr, lr, fr, qe, ct = er.length, dt = -1, It = 1, Ve = 0, Yt = [], Jt = [];
          function on() {
            return Ve;
          }
          function an(ln) {
            throw tr.error("Unclosed " + ln, It, Ve - dt);
          }
          function wn() {
            return Jt.length === 0 && Ve >= ct;
          }
          function zn(ln) {
            if (Jt.length)
              return Jt.pop();
            if (!(Ve >= ct)) {
              var cn = ln ? ln.ignoreUnclosed : !1;
              switch (At = er.charCodeAt(Ve), (At === Z || At === X || At === d && er.charCodeAt(Ve + 1) !== Z) && (dt = Ve, It += 1), At) {
                case Z:
                case ne:
                case re:
                case d:
                case X:
                  gt = Ve;
                  do
                    gt += 1, At = er.charCodeAt(gt), At === Z && (dt = gt, It += 1);
                  while (At === ne || At === Z || At === re || At === d || At === X);
                  qe = ["space", er.slice(Ve, gt)], Ve = gt - 1;
                  break;
                case n:
                case q:
                case ue:
                case ve:
                case Ie:
                case De:
                case ae:
                  var hn = String.fromCharCode(At);
                  qe = [hn, hn, It, Ve - dt];
                  break;
                case L:
                  if (lr = Yt.length ? Yt.pop()[1] : "", fr = er.charCodeAt(Ve + 1), lr === "url" && fr !== $ && fr !== V && fr !== ne && fr !== Z && fr !== re && fr !== X && fr !== d) {
                    gt = Ve;
                    do {
                      if (zt = !1, gt = er.indexOf(")", gt + 1), gt === -1)
                        if (ir || cn) {
                          gt = Ve;
                          break;
                        } else
                          an("bracket");
                      for (vr = gt; er.charCodeAt(vr - 1) === Y; )
                        vr -= 1, zt = !zt;
                    } while (zt);
                    qe = ["brackets", er.slice(Ve, gt + 1), It, Ve - dt, It, gt - dt], Ve = gt;
                  } else
                    gt = er.indexOf(")", Ve + 1), Or = er.slice(Ve, gt + 1), gt === -1 || Pt.test(Or) ? qe = ["(", "(", It, Ve - dt] : (qe = ["brackets", Or, It, Ve - dt, It, gt - dt], Ve = gt);
                  break;
                case $:
                case V:
                  Nt = At === $ ? "'" : '"', gt = Ve;
                  do {
                    if (zt = !1, gt = er.indexOf(Nt, gt + 1), gt === -1)
                      if (ir || cn) {
                        gt = Ve + 1;
                        break;
                      } else
                        an("string");
                    for (vr = gt; er.charCodeAt(vr - 1) === Y; )
                      vr -= 1, zt = !zt;
                  } while (zt);
                  Or = er.slice(Ve, gt + 1), mt = Or.split(`
`), Zr = mt.length - 1, Zr > 0 ? (_r = It + Zr, Fr = gt - mt[Zr].length) : (_r = It, Fr = dt), qe = ["string", er.slice(Ve, gt + 1), It, Ve - dt, _r, gt - Fr], dt = Fr, It = _r, Ve = gt;
                  break;
                case Me:
                  We.lastIndex = Ve + 1, We.test(er), We.lastIndex === 0 ? gt = er.length - 1 : gt = We.lastIndex - 2, qe = ["at-word", er.slice(Ve, gt + 1), It, Ve - dt, It, gt - dt], Ve = gt;
                  break;
                case Y:
                  for (gt = Ve, Jr = !0; er.charCodeAt(gt + 1) === Y; )
                    gt += 1, Jr = !Jr;
                  if (At = er.charCodeAt(gt + 1), Jr && At !== te && At !== ne && At !== Z && At !== re && At !== d && At !== X && (gt += 1, Mt.test(er.charAt(gt)))) {
                    for (; Mt.test(er.charAt(gt + 1)); )
                      gt += 1;
                    er.charCodeAt(gt + 1) === ne && (gt += 1);
                  }
                  qe = ["word", er.slice(Ve, gt + 1), It, Ve - dt, It, gt - dt], Ve = gt;
                  break;
                default:
                  At === te && er.charCodeAt(Ve + 1) === le ? (gt = er.indexOf("*/", Ve + 2) + 1, gt === 0 && (ir || cn ? gt = er.length : an("comment")), Or = er.slice(Ve, gt + 1), mt = Or.split(`
`), Zr = mt.length - 1, Zr > 0 ? (_r = It + Zr, Fr = gt - mt[Zr].length) : (_r = It, Fr = dt), qe = ["comment", Or, It, Ve - dt, _r, gt - Fr], dt = Fr, It = _r, Ve = gt) : (Ft.lastIndex = Ve + 1, Ft.test(er), Ft.lastIndex === 0 ? gt = er.length - 1 : gt = Ft.lastIndex - 2, qe = ["word", er.slice(Ve, gt + 1), It, Ve - dt, It, gt - dt], Yt.push(qe), Ve = gt);
                  break;
              }
              return Ve++, qe;
            }
          }
          function xn(ln) {
            Jt.push(ln);
          }
          return { back: xn, nextToken: zn, endOfFile: wn, position: on };
        }
        z.exports = a.default;
      } }), Gu = Ae({ "node_modules/postcss/lib/parse.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = Y(Hi()), V = Y(qu());
        function Y(ne) {
          return ne && ne.__esModule ? ne : { default: ne };
        }
        function te(ne, X) {
          var re = new V.default(ne, X), d = new $.default(re);
          try {
            d.parse();
          } catch (n) {
            throw n;
          }
          return d.root;
        }
        var Z = te;
        a.default = Z, z.exports = a.default;
      } }), Ba = Ae({ "node_modules/postcss/lib/list.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = { split: function(Y, te, Z) {
          for (var ne = [], X = "", re = !1, d = 0, n = !1, q = !1, L = 0; L < Y.length; L++) {
            var ae = Y[L];
            n ? q ? q = !1 : ae === "\\" ? q = !0 : ae === n && (n = !1) : ae === '"' || ae === "'" ? n = ae : ae === "(" ? d += 1 : ae === ")" ? d > 0 && (d -= 1) : d === 0 && te.indexOf(ae) !== -1 && (re = !0), re ? (X !== "" && ne.push(X.trim()), X = "", re = !1) : X += ae;
          }
          return (Z || X !== "") && ne.push(X.trim()), ne;
        }, space: function(Y) {
          var te = [" ", `
`, "	"];
          return $.split(Y, te);
        }, comma: function(Y) {
          return $.split(Y, [","], !0);
        } }, V = $;
        a.default = V, z.exports = a.default;
      } }), Ro = Ae({ "node_modules/postcss/lib/rule.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = Y(Cn()), V = Y(Ba());
        function Y(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function te(d, n) {
          for (var q = 0; q < n.length; q++) {
            var L = n[q];
            L.enumerable = L.enumerable || !1, L.configurable = !0, "value" in L && (L.writable = !0), Object.defineProperty(d, L.key, L);
          }
        }
        function Z(d, n, q) {
          return n && te(d.prototype, n), q && te(d, q), d;
        }
        function ne(d, n) {
          d.prototype = Object.create(n.prototype), d.prototype.constructor = d, d.__proto__ = n;
        }
        var X = function(d) {
          ne(n, d);
          function n(q) {
            var L;
            return L = d.call(this, q) || this, L.type = "rule", L.nodes || (L.nodes = []), L;
          }
          return Z(n, [{ key: "selectors", get: function() {
            return V.default.comma(this.selector);
          }, set: function(q) {
            var L = this.selector ? this.selector.match(/,\s*/) : null, ae = L ? L[0] : "," + this.raw("between", "beforeOpen");
            this.selector = q.join(ae);
          } }]), n;
        }($.default), re = X;
        a.default = re, z.exports = a.default;
      } }), Cn = Ae({ "node_modules/postcss/lib/container.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = te(Xs()), V = te(ai()), Y = te(Uu());
        function te(ue) {
          return ue && ue.__esModule ? ue : { default: ue };
        }
        function Z(ue, ve) {
          var De;
          if (typeof Symbol > "u" || ue[Symbol.iterator] == null) {
            if (Array.isArray(ue) || (De = ne(ue)) || ve && ue && typeof ue.length == "number") {
              De && (ue = De);
              var le = 0;
              return function() {
                return le >= ue.length ? { done: !0 } : { done: !1, value: ue[le++] };
              };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          return De = ue[Symbol.iterator](), De.next.bind(De);
        }
        function ne(ue, ve) {
          if (ue) {
            if (typeof ue == "string")
              return X(ue, ve);
            var De = Object.prototype.toString.call(ue).slice(8, -1);
            if (De === "Object" && ue.constructor && (De = ue.constructor.name), De === "Map" || De === "Set")
              return Array.from(ue);
            if (De === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(De))
              return X(ue, ve);
          }
        }
        function X(ue, ve) {
          (ve == null || ve > ue.length) && (ve = ue.length);
          for (var De = 0, le = new Array(ve); De < ve; De++)
            le[De] = ue[De];
          return le;
        }
        function re(ue, ve) {
          for (var De = 0; De < ve.length; De++) {
            var le = ve[De];
            le.enumerable = le.enumerable || !1, le.configurable = !0, "value" in le && (le.writable = !0), Object.defineProperty(ue, le.key, le);
          }
        }
        function d(ue, ve, De) {
          return ve && re(ue.prototype, ve), De && re(ue, De), ue;
        }
        function n(ue, ve) {
          ue.prototype = Object.create(ve.prototype), ue.prototype.constructor = ue, ue.__proto__ = ve;
        }
        function q(ue) {
          return ue.map(function(ve) {
            return ve.nodes && (ve.nodes = q(ve.nodes)), delete ve.source, ve;
          });
        }
        var L = function(ue) {
          n(ve, ue);
          function ve() {
            return ue.apply(this, arguments) || this;
          }
          var De = ve.prototype;
          return De.push = function(le) {
            return le.parent = this, this.nodes.push(le), this;
          }, De.each = function(le) {
            this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
            var Ie = this.lastEach;
            if (this.indexes[Ie] = 0, !!this.nodes) {
              for (var Me, We; this.indexes[Ie] < this.nodes.length && (Me = this.indexes[Ie], We = le(this.nodes[Me], Me), We !== !1); )
                this.indexes[Ie] += 1;
              return delete this.indexes[Ie], We;
            }
          }, De.walk = function(le) {
            return this.each(function(Ie, Me) {
              var We;
              try {
                We = le(Ie, Me);
              } catch (Pt) {
                if (Pt.postcssNode = Ie, Pt.stack && Ie.source && /\n\s{4}at /.test(Pt.stack)) {
                  var Ft = Ie.source;
                  Pt.stack = Pt.stack.replace(/\n\s{4}at /, "$&" + Ft.input.from + ":" + Ft.start.line + ":" + Ft.start.column + "$&");
                }
                throw Pt;
              }
              return We !== !1 && Ie.walk && (We = Ie.walk(le)), We;
            });
          }, De.walkDecls = function(le, Ie) {
            return Ie ? le instanceof RegExp ? this.walk(function(Me, We) {
              if (Me.type === "decl" && le.test(Me.prop))
                return Ie(Me, We);
            }) : this.walk(function(Me, We) {
              if (Me.type === "decl" && Me.prop === le)
                return Ie(Me, We);
            }) : (Ie = le, this.walk(function(Me, We) {
              if (Me.type === "decl")
                return Ie(Me, We);
            }));
          }, De.walkRules = function(le, Ie) {
            return Ie ? le instanceof RegExp ? this.walk(function(Me, We) {
              if (Me.type === "rule" && le.test(Me.selector))
                return Ie(Me, We);
            }) : this.walk(function(Me, We) {
              if (Me.type === "rule" && Me.selector === le)
                return Ie(Me, We);
            }) : (Ie = le, this.walk(function(Me, We) {
              if (Me.type === "rule")
                return Ie(Me, We);
            }));
          }, De.walkAtRules = function(le, Ie) {
            return Ie ? le instanceof RegExp ? this.walk(function(Me, We) {
              if (Me.type === "atrule" && le.test(Me.name))
                return Ie(Me, We);
            }) : this.walk(function(Me, We) {
              if (Me.type === "atrule" && Me.name === le)
                return Ie(Me, We);
            }) : (Ie = le, this.walk(function(Me, We) {
              if (Me.type === "atrule")
                return Ie(Me, We);
            }));
          }, De.walkComments = function(le) {
            return this.walk(function(Ie, Me) {
              if (Ie.type === "comment")
                return le(Ie, Me);
            });
          }, De.append = function() {
            for (var le = arguments.length, Ie = new Array(le), Me = 0; Me < le; Me++)
              Ie[Me] = arguments[Me];
            for (var We = 0, Ft = Ie; We < Ft.length; We++)
              for (var Pt = Ft[We], Mt = this.normalize(Pt, this.last), rr = Z(Mt), tr; !(tr = rr()).done; ) {
                var pr = tr.value;
                this.nodes.push(pr);
              }
            return this;
          }, De.prepend = function() {
            for (var le = arguments.length, Ie = new Array(le), Me = 0; Me < le; Me++)
              Ie[Me] = arguments[Me];
            Ie = Ie.reverse();
            for (var We = Z(Ie), Ft; !(Ft = We()).done; ) {
              for (var Pt = Ft.value, Mt = this.normalize(Pt, this.first, "prepend").reverse(), rr = Z(Mt), tr; !(tr = rr()).done; ) {
                var pr = tr.value;
                this.nodes.unshift(pr);
              }
              for (var er in this.indexes)
                this.indexes[er] = this.indexes[er] + Mt.length;
            }
            return this;
          }, De.cleanRaws = function(le) {
            if (ue.prototype.cleanRaws.call(this, le), this.nodes)
              for (var Ie = Z(this.nodes), Me; !(Me = Ie()).done; ) {
                var We = Me.value;
                We.cleanRaws(le);
              }
          }, De.insertBefore = function(le, Ie) {
            le = this.index(le);
            for (var Me = le === 0 ? "prepend" : !1, We = this.normalize(Ie, this.nodes[le], Me).reverse(), Ft = Z(We), Pt; !(Pt = Ft()).done; ) {
              var Mt = Pt.value;
              this.nodes.splice(le, 0, Mt);
            }
            var rr;
            for (var tr in this.indexes)
              rr = this.indexes[tr], le <= rr && (this.indexes[tr] = rr + We.length);
            return this;
          }, De.insertAfter = function(le, Ie) {
            le = this.index(le);
            for (var Me = this.normalize(Ie, this.nodes[le]).reverse(), We = Z(Me), Ft; !(Ft = We()).done; ) {
              var Pt = Ft.value;
              this.nodes.splice(le + 1, 0, Pt);
            }
            var Mt;
            for (var rr in this.indexes)
              Mt = this.indexes[rr], le < Mt && (this.indexes[rr] = Mt + Me.length);
            return this;
          }, De.removeChild = function(le) {
            le = this.index(le), this.nodes[le].parent = void 0, this.nodes.splice(le, 1);
            var Ie;
            for (var Me in this.indexes)
              Ie = this.indexes[Me], Ie >= le && (this.indexes[Me] = Ie - 1);
            return this;
          }, De.removeAll = function() {
            for (var le = Z(this.nodes), Ie; !(Ie = le()).done; ) {
              var Me = Ie.value;
              Me.parent = void 0;
            }
            return this.nodes = [], this;
          }, De.replaceValues = function(le, Ie, Me) {
            return Me || (Me = Ie, Ie = {}), this.walkDecls(function(We) {
              Ie.props && Ie.props.indexOf(We.prop) === -1 || Ie.fast && We.value.indexOf(Ie.fast) === -1 || (We.value = We.value.replace(le, Me));
            }), this;
          }, De.every = function(le) {
            return this.nodes.every(le);
          }, De.some = function(le) {
            return this.nodes.some(le);
          }, De.index = function(le) {
            return typeof le == "number" ? le : this.nodes.indexOf(le);
          }, De.normalize = function(le, Ie) {
            var Me = this;
            if (typeof le == "string") {
              var We = Gu();
              le = q(We(le).nodes);
            } else if (Array.isArray(le)) {
              le = le.slice(0);
              for (var Ft = Z(le), Pt; !(Pt = Ft()).done; ) {
                var Mt = Pt.value;
                Mt.parent && Mt.parent.removeChild(Mt, "ignore");
              }
            } else if (le.type === "root") {
              le = le.nodes.slice(0);
              for (var rr = Z(le), tr; !(tr = rr()).done; ) {
                var pr = tr.value;
                pr.parent && pr.parent.removeChild(pr, "ignore");
              }
            } else if (le.type)
              le = [le];
            else if (le.prop) {
              if (typeof le.value > "u")
                throw new Error("Value field is missed in node creation");
              typeof le.value != "string" && (le.value = String(le.value)), le = [new $.default(le)];
            } else if (le.selector) {
              var er = Ro();
              le = [new er(le)];
            } else if (le.name) {
              var ir = Wi();
              le = [new ir(le)];
            } else if (le.text)
              le = [new V.default(le)];
            else
              throw new Error("Unknown node type in node creation");
            var At = le.map(function(gt) {
              return gt.parent && gt.parent.removeChild(gt), typeof gt.raws.before > "u" && Ie && typeof Ie.raws.before < "u" && (gt.raws.before = Ie.raws.before.replace(/[^\s]/g, "")), gt.parent = Me, gt;
            });
            return At;
          }, d(ve, [{ key: "first", get: function() {
            if (this.nodes)
              return this.nodes[0];
          } }, { key: "last", get: function() {
            if (this.nodes)
              return this.nodes[this.nodes.length - 1];
          } }]), ve;
        }(Y.default), ae = L;
        a.default = ae, z.exports = a.default;
      } }), Wi = Ae({ "node_modules/postcss/lib/at-rule.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Cn());
        function V(ne) {
          return ne && ne.__esModule ? ne : { default: ne };
        }
        function Y(ne, X) {
          ne.prototype = Object.create(X.prototype), ne.prototype.constructor = ne, ne.__proto__ = X;
        }
        var te = function(ne) {
          Y(X, ne);
          function X(d) {
            var n;
            return n = ne.call(this, d) || this, n.type = "atrule", n;
          }
          var re = X.prototype;
          return re.append = function() {
            var d;
            this.nodes || (this.nodes = []);
            for (var n = arguments.length, q = new Array(n), L = 0; L < n; L++)
              q[L] = arguments[L];
            return (d = ne.prototype.append).call.apply(d, [this].concat(q));
          }, re.prepend = function() {
            var d;
            this.nodes || (this.nodes = []);
            for (var n = arguments.length, q = new Array(n), L = 0; L < n; L++)
              q[L] = arguments[L];
            return (d = ne.prototype.prepend).call.apply(d, [this].concat(q));
          }, X;
        }($.default), Z = te;
        a.default = Z, z.exports = a.default;
      } }), Vo = Ae({ "node_modules/postcss/lib/map-generator.js"(a, z) {
        Ye(), z.exports = class {
          generate() {
          }
        };
      } }), qo = Ae({ "node_modules/postcss/lib/warn-once.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = V;
        var $ = {};
        function V(Y) {
          $[Y] || ($[Y] = !0, typeof console < "u" && console.warn && console.warn(Y));
        }
        z.exports = a.default;
      } }), Na = Ae({ "node_modules/postcss/lib/warning.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = function() {
          function Y(Z, ne) {
            if (ne === void 0 && (ne = {}), this.type = "warning", this.text = Z, ne.node && ne.node.source) {
              var X = ne.node.positionBy(ne);
              this.line = X.line, this.column = X.column;
            }
            for (var re in ne)
              this[re] = ne[re];
          }
          var te = Y.prototype;
          return te.toString = function() {
            return this.node ? this.node.error(this.text, { plugin: this.plugin, index: this.index, word: this.word }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
          }, Y;
        }(), V = $;
        a.default = V, z.exports = a.default;
      } }), Jo = Ae({ "node_modules/postcss/lib/result.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Na());
        function V(X) {
          return X && X.__esModule ? X : { default: X };
        }
        function Y(X, re) {
          for (var d = 0; d < re.length; d++) {
            var n = re[d];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(X, n.key, n);
          }
        }
        function te(X, re, d) {
          return re && Y(X.prototype, re), d && Y(X, d), X;
        }
        var Z = function() {
          function X(d, n, q) {
            this.processor = d, this.messages = [], this.root = n, this.opts = q, this.css = void 0, this.map = void 0;
          }
          var re = X.prototype;
          return re.toString = function() {
            return this.css;
          }, re.warn = function(d, n) {
            n === void 0 && (n = {}), n.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (n.plugin = this.lastPlugin.postcssPlugin);
            var q = new $.default(d, n);
            return this.messages.push(q), q;
          }, re.warnings = function() {
            return this.messages.filter(function(d) {
              return d.type === "warning";
            });
          }, te(X, [{ key: "content", get: function() {
            return this.css;
          } }]), X;
        }(), ne = Z;
        a.default = ne, z.exports = a.default;
      } }), Xi = Ae({ "node_modules/postcss/lib/lazy-result.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = Z(Vo()), V = Z(Ws());
        Z(qo());
        var Y = Z(Jo()), te = Z(Gu());
        function Z(ue) {
          return ue && ue.__esModule ? ue : { default: ue };
        }
        function ne(ue, ve) {
          var De;
          if (typeof Symbol > "u" || ue[Symbol.iterator] == null) {
            if (Array.isArray(ue) || (De = X(ue)) || ve && ue && typeof ue.length == "number") {
              De && (ue = De);
              var le = 0;
              return function() {
                return le >= ue.length ? { done: !0 } : { done: !1, value: ue[le++] };
              };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          return De = ue[Symbol.iterator](), De.next.bind(De);
        }
        function X(ue, ve) {
          if (ue) {
            if (typeof ue == "string")
              return re(ue, ve);
            var De = Object.prototype.toString.call(ue).slice(8, -1);
            if (De === "Object" && ue.constructor && (De = ue.constructor.name), De === "Map" || De === "Set")
              return Array.from(ue);
            if (De === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(De))
              return re(ue, ve);
          }
        }
        function re(ue, ve) {
          (ve == null || ve > ue.length) && (ve = ue.length);
          for (var De = 0, le = new Array(ve); De < ve; De++)
            le[De] = ue[De];
          return le;
        }
        function d(ue, ve) {
          for (var De = 0; De < ve.length; De++) {
            var le = ve[De];
            le.enumerable = le.enumerable || !1, le.configurable = !0, "value" in le && (le.writable = !0), Object.defineProperty(ue, le.key, le);
          }
        }
        function n(ue, ve, De) {
          return ve && d(ue.prototype, ve), De && d(ue, De), ue;
        }
        function q(ue) {
          return typeof ue == "object" && typeof ue.then == "function";
        }
        var L = function() {
          function ue(De, le, Ie) {
            this.stringified = !1, this.processed = !1;
            var Me;
            if (typeof le == "object" && le !== null && le.type === "root")
              Me = le;
            else if (le instanceof ue || le instanceof Y.default)
              Me = le.root, le.map && (typeof Ie.map > "u" && (Ie.map = {}), Ie.map.inline || (Ie.map.inline = !1), Ie.map.prev = le.map);
            else {
              var We = te.default;
              Ie.syntax && (We = Ie.syntax.parse), Ie.parser && (We = Ie.parser), We.parse && (We = We.parse);
              try {
                Me = We(le, Ie);
              } catch (Ft) {
                this.error = Ft;
              }
            }
            this.result = new Y.default(De, Me, Ie);
          }
          var ve = ue.prototype;
          return ve.warnings = function() {
            return this.sync().warnings();
          }, ve.toString = function() {
            return this.css;
          }, ve.then = function(De, le) {
            return this.async().then(De, le);
          }, ve.catch = function(De) {
            return this.async().catch(De);
          }, ve.finally = function(De) {
            return this.async().then(De, De);
          }, ve.handleError = function(De, le) {
            try {
              if (this.error = De, De.name === "CssSyntaxError" && !De.plugin)
                De.plugin = le.postcssPlugin, De.setMessage();
              else if (le.postcssVersion && !1)
                var Ie, Me, We, Ft, Pt;
            } catch (Mt) {
              console && console.error && console.error(Mt);
            }
          }, ve.asyncTick = function(De, le) {
            var Ie = this;
            if (this.plugin >= this.processor.plugins.length)
              return this.processed = !0, De();
            try {
              var Me = this.processor.plugins[this.plugin], We = this.run(Me);
              this.plugin += 1, q(We) ? We.then(function() {
                Ie.asyncTick(De, le);
              }).catch(function(Ft) {
                Ie.handleError(Ft, Me), Ie.processed = !0, le(Ft);
              }) : this.asyncTick(De, le);
            } catch (Ft) {
              this.processed = !0, le(Ft);
            }
          }, ve.async = function() {
            var De = this;
            return this.processed ? new Promise(function(le, Ie) {
              De.error ? Ie(De.error) : le(De.stringify());
            }) : this.processing ? this.processing : (this.processing = new Promise(function(le, Ie) {
              if (De.error)
                return Ie(De.error);
              De.plugin = 0, De.asyncTick(le, Ie);
            }).then(function() {
              return De.processed = !0, De.stringify();
            }), this.processing);
          }, ve.sync = function() {
            if (this.processed)
              return this.result;
            if (this.processed = !0, this.processing)
              throw new Error("Use process(css).then(cb) to work with async plugins");
            if (this.error)
              throw this.error;
            for (var De = ne(this.result.processor.plugins), le; !(le = De()).done; ) {
              var Ie = le.value, Me = this.run(Ie);
              if (q(Me))
                throw new Error("Use process(css).then(cb) to work with async plugins");
            }
            return this.result;
          }, ve.run = function(De) {
            this.result.lastPlugin = De;
            try {
              return De(this.result.root, this.result);
            } catch (le) {
              throw this.handleError(le, De), le;
            }
          }, ve.stringify = function() {
            if (this.stringified)
              return this.result;
            this.stringified = !0, this.sync();
            var De = this.result.opts, le = V.default;
            De.syntax && (le = De.syntax.stringify), De.stringifier && (le = De.stringifier), le.stringify && (le = le.stringify);
            var Ie = new $.default(le, this.result.root, this.result.opts), Me = Ie.generate();
            return this.result.css = Me[0], this.result.map = Me[1], this.result;
          }, n(ue, [{ key: "processor", get: function() {
            return this.result.processor;
          } }, { key: "opts", get: function() {
            return this.result.opts;
          } }, { key: "css", get: function() {
            return this.stringify().css;
          } }, { key: "content", get: function() {
            return this.stringify().content;
          } }, { key: "map", get: function() {
            return this.stringify().map;
          } }, { key: "root", get: function() {
            return this.sync().root;
          } }, { key: "messages", get: function() {
            return this.sync().messages;
          } }]), ue;
        }(), ae = L;
        a.default = ae, z.exports = a.default;
      } }), zu = Ae({ "node_modules/postcss/lib/processor.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Xi());
        function V(re) {
          return re && re.__esModule ? re : { default: re };
        }
        function Y(re, d) {
          var n;
          if (typeof Symbol > "u" || re[Symbol.iterator] == null) {
            if (Array.isArray(re) || (n = te(re)) || d && re && typeof re.length == "number") {
              n && (re = n);
              var q = 0;
              return function() {
                return q >= re.length ? { done: !0 } : { done: !1, value: re[q++] };
              };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          return n = re[Symbol.iterator](), n.next.bind(n);
        }
        function te(re, d) {
          if (re) {
            if (typeof re == "string")
              return Z(re, d);
            var n = Object.prototype.toString.call(re).slice(8, -1);
            if (n === "Object" && re.constructor && (n = re.constructor.name), n === "Map" || n === "Set")
              return Array.from(re);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
              return Z(re, d);
          }
        }
        function Z(re, d) {
          (d == null || d > re.length) && (d = re.length);
          for (var n = 0, q = new Array(d); n < d; n++)
            q[n] = re[n];
          return q;
        }
        var ne = function() {
          function re(n) {
            n === void 0 && (n = []), this.version = "7.0.39", this.plugins = this.normalize(n);
          }
          var d = re.prototype;
          return d.use = function(n) {
            return this.plugins = this.plugins.concat(this.normalize([n])), this;
          }, d.process = function(n) {
            function q(L) {
              return n.apply(this, arguments);
            }
            return q.toString = function() {
              return n.toString();
            }, q;
          }(function(n, q) {
            return q === void 0 && (q = {}), this.plugins.length === 0 && (q.parser, q.stringifier), new $.default(this, n, q);
          }), d.normalize = function(n) {
            for (var q = [], L = Y(n), ae; !(ae = L()).done; ) {
              var ue = ae.value;
              if (ue.postcss === !0) {
                var ve = ue();
                throw new Error("PostCSS plugin " + ve.postcssPlugin + ` requires PostCSS 8.
Migration guide for end-users:
https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users`);
              }
              if (ue.postcss && (ue = ue.postcss), typeof ue == "object" && Array.isArray(ue.plugins))
                q = q.concat(ue.plugins);
              else if (typeof ue == "function")
                q.push(ue);
              else if (!(typeof ue == "object" && (ue.parse || ue.stringify)))
                throw typeof ue == "object" && ue.postcssPlugin ? new Error("PostCSS plugin " + ue.postcssPlugin + ` requires PostCSS 8.
Migration guide for end-users:
https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users`) : new Error(ue + " is not a PostCSS plugin");
            }
            return q;
          }, re;
        }(), X = ne;
        a.default = X, z.exports = a.default;
      } }), Wu = Ae({ "node_modules/postcss/lib/root.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = V(Cn());
        function V(d) {
          return d && d.__esModule ? d : { default: d };
        }
        function Y(d, n) {
          var q;
          if (typeof Symbol > "u" || d[Symbol.iterator] == null) {
            if (Array.isArray(d) || (q = te(d)) || n && d && typeof d.length == "number") {
              q && (d = q);
              var L = 0;
              return function() {
                return L >= d.length ? { done: !0 } : { done: !1, value: d[L++] };
              };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          return q = d[Symbol.iterator](), q.next.bind(q);
        }
        function te(d, n) {
          if (d) {
            if (typeof d == "string")
              return Z(d, n);
            var q = Object.prototype.toString.call(d).slice(8, -1);
            if (q === "Object" && d.constructor && (q = d.constructor.name), q === "Map" || q === "Set")
              return Array.from(d);
            if (q === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(q))
              return Z(d, n);
          }
        }
        function Z(d, n) {
          (n == null || n > d.length) && (n = d.length);
          for (var q = 0, L = new Array(n); q < n; q++)
            L[q] = d[q];
          return L;
        }
        function ne(d, n) {
          d.prototype = Object.create(n.prototype), d.prototype.constructor = d, d.__proto__ = n;
        }
        var X = function(d) {
          ne(n, d);
          function n(L) {
            var ae;
            return ae = d.call(this, L) || this, ae.type = "root", ae.nodes || (ae.nodes = []), ae;
          }
          var q = n.prototype;
          return q.removeChild = function(L, ae) {
            var ue = this.index(L);
            return !ae && ue === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[ue].raws.before), d.prototype.removeChild.call(this, L);
          }, q.normalize = function(L, ae, ue) {
            var ve = d.prototype.normalize.call(this, L);
            if (ae) {
              if (ue === "prepend")
                this.nodes.length > 1 ? ae.raws.before = this.nodes[1].raws.before : delete ae.raws.before;
              else if (this.first !== ae)
                for (var De = Y(ve), le; !(le = De()).done; ) {
                  var Ie = le.value;
                  Ie.raws.before = ae.raws.before;
                }
            }
            return ve;
          }, q.toResult = function(L) {
            L === void 0 && (L = {});
            var ae = Xi(), ue = zu(), ve = new ae(new ue(), this, L);
            return ve.stringify();
          }, n;
        }($.default), re = X;
        a.default = re, z.exports = a.default;
      } }), Hi = Ae({ "node_modules/postcss/lib/parser.js"(a, z) {
        Ye(), a.__esModule = !0, a.default = void 0;
        var $ = X(Xs()), V = X(Hs()), Y = X(ai()), te = X(Wi()), Z = X(Wu()), ne = X(Ro());
        function X(d) {
          return d && d.__esModule ? d : { default: d };
        }
        var re = function() {
          function d(q) {
            this.input = q, this.root = new Z.default(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: q, start: { line: 1, column: 1 } };
          }
          var n = d.prototype;
          return n.createTokenizer = function() {
            this.tokenizer = (0, V.default)(this.input);
          }, n.parse = function() {
            for (var q; !this.tokenizer.endOfFile(); )
              switch (q = this.tokenizer.nextToken(), q[0]) {
                case "space":
                  this.spaces += q[1];
                  break;
                case ";":
                  this.freeSemicolon(q);
                  break;
                case "}":
                  this.end(q);
                  break;
                case "comment":
                  this.comment(q);
                  break;
                case "at-word":
                  this.atrule(q);
                  break;
                case "{":
                  this.emptyRule(q);
                  break;
                default:
                  this.other(q);
                  break;
              }
            this.endFile();
          }, n.comment = function(q) {
            var L = new Y.default();
            this.init(L, q[2], q[3]), L.source.end = { line: q[4], column: q[5] };
            var ae = q[1].slice(2, -2);
            if (/^\s*$/.test(ae))
              L.text = "", L.raws.left = ae, L.raws.right = "";
            else {
              var ue = ae.match(/^(\s*)([^]*[^\s])(\s*)$/);
              L.text = ue[2], L.raws.left = ue[1], L.raws.right = ue[3];
            }
          }, n.emptyRule = function(q) {
            var L = new ne.default();
            this.init(L, q[2], q[3]), L.selector = "", L.raws.between = "", this.current = L;
          }, n.other = function(q) {
            for (var L = !1, ae = null, ue = !1, ve = null, De = [], le = [], Ie = q; Ie; ) {
              if (ae = Ie[0], le.push(Ie), ae === "(" || ae === "[")
                ve || (ve = Ie), De.push(ae === "(" ? ")" : "]");
              else if (De.length === 0)
                if (ae === ";")
                  if (ue) {
                    this.decl(le);
                    return;
                  } else
                    break;
                else if (ae === "{") {
                  this.rule(le);
                  return;
                } else if (ae === "}") {
                  this.tokenizer.back(le.pop()), L = !0;
                  break;
                } else
                  ae === ":" && (ue = !0);
              else
                ae === De[De.length - 1] && (De.pop(), De.length === 0 && (ve = null));
              Ie = this.tokenizer.nextToken();
            }
            if (this.tokenizer.endOfFile() && (L = !0), De.length > 0 && this.unclosedBracket(ve), L && ue) {
              for (; le.length && (Ie = le[le.length - 1][0], !(Ie !== "space" && Ie !== "comment")); )
                this.tokenizer.back(le.pop());
              this.decl(le);
            } else
              this.unknownWord(le);
          }, n.rule = function(q) {
            q.pop();
            var L = new ne.default();
            this.init(L, q[0][2], q[0][3]), L.raws.between = this.spacesAndCommentsFromEnd(q), this.raw(L, "selector", q), this.current = L;
          }, n.decl = function(q) {
            var L = new $.default();
            this.init(L);
            var ae = q[q.length - 1];
            for (ae[0] === ";" && (this.semicolon = !0, q.pop()), ae[4] ? L.source.end = { line: ae[4], column: ae[5] } : L.source.end = { line: ae[2], column: ae[3] }; q[0][0] !== "word"; )
              q.length === 1 && this.unknownWord(q), L.raws.before += q.shift()[1];
            for (L.source.start = { line: q[0][2], column: q[0][3] }, L.prop = ""; q.length; ) {
              var ue = q[0][0];
              if (ue === ":" || ue === "space" || ue === "comment")
                break;
              L.prop += q.shift()[1];
            }
            L.raws.between = "";
            for (var ve; q.length; )
              if (ve = q.shift(), ve[0] === ":") {
                L.raws.between += ve[1];
                break;
              } else
                ve[0] === "word" && /\w/.test(ve[1]) && this.unknownWord([ve]), L.raws.between += ve[1];
            (L.prop[0] === "_" || L.prop[0] === "*") && (L.raws.before += L.prop[0], L.prop = L.prop.slice(1)), L.raws.between += this.spacesAndCommentsFromStart(q), this.precheckMissedSemicolon(q);
            for (var De = q.length - 1; De > 0; De--) {
              if (ve = q[De], ve[1].toLowerCase() === "!important") {
                L.important = !0;
                var le = this.stringFrom(q, De);
                le = this.spacesFromEnd(q) + le, le !== " !important" && (L.raws.important = le);
                break;
              } else if (ve[1].toLowerCase() === "important") {
                for (var Ie = q.slice(0), Me = "", We = De; We > 0; We--) {
                  var Ft = Ie[We][0];
                  if (Me.trim().indexOf("!") === 0 && Ft !== "space")
                    break;
                  Me = Ie.pop()[1] + Me;
                }
                Me.trim().indexOf("!") === 0 && (L.important = !0, L.raws.important = Me, q = Ie);
              }
              if (ve[0] !== "space" && ve[0] !== "comment")
                break;
            }
            this.raw(L, "value", q), L.value.indexOf(":") !== -1 && this.checkMissedSemicolon(q);
          }, n.atrule = function(q) {
            var L = new te.default();
            L.name = q[1].slice(1), L.name === "" && this.unnamedAtrule(L, q), this.init(L, q[2], q[3]);
            for (var ae, ue, ve = !1, De = !1, le = []; !this.tokenizer.endOfFile(); ) {
              if (q = this.tokenizer.nextToken(), q[0] === ";") {
                L.source.end = { line: q[2], column: q[3] }, this.semicolon = !0;
                break;
              } else if (q[0] === "{") {
                De = !0;
                break;
              } else if (q[0] === "}") {
                if (le.length > 0) {
                  for (ue = le.length - 1, ae = le[ue]; ae && ae[0] === "space"; )
                    ae = le[--ue];
                  ae && (L.source.end = { line: ae[4], column: ae[5] });
                }
                this.end(q);
                break;
              } else
                le.push(q);
              if (this.tokenizer.endOfFile()) {
                ve = !0;
                break;
              }
            }
            L.raws.between = this.spacesAndCommentsFromEnd(le), le.length ? (L.raws.afterName = this.spacesAndCommentsFromStart(le), this.raw(L, "params", le), ve && (q = le[le.length - 1], L.source.end = { line: q[4], column: q[5] }, this.spaces = L.raws.between, L.raws.between = "")) : (L.raws.afterName = "", L.params = ""), De && (L.nodes = [], this.current = L);
          }, n.end = function(q) {
            this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = { line: q[2], column: q[3] }, this.current = this.current.parent) : this.unexpectedClose(q);
          }, n.endFile = function() {
            this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces;
          }, n.freeSemicolon = function(q) {
            if (this.spaces += q[1], this.current.nodes) {
              var L = this.current.nodes[this.current.nodes.length - 1];
              L && L.type === "rule" && !L.raws.ownSemicolon && (L.raws.ownSemicolon = this.spaces, this.spaces = "");
            }
          }, n.init = function(q, L, ae) {
            this.current.push(q), q.source = { start: { line: L, column: ae }, input: this.input }, q.raws.before = this.spaces, this.spaces = "", q.type !== "comment" && (this.semicolon = !1);
          }, n.raw = function(q, L, ae) {
            for (var ue, ve, De = ae.length, le = "", Ie = !0, Me, We, Ft = /^([.|#])?([\w])+/i, Pt = 0; Pt < De; Pt += 1) {
              if (ue = ae[Pt], ve = ue[0], ve === "comment" && q.type === "rule") {
                We = ae[Pt - 1], Me = ae[Pt + 1], We[0] !== "space" && Me[0] !== "space" && Ft.test(We[1]) && Ft.test(Me[1]) ? le += ue[1] : Ie = !1;
                continue;
              }
              ve === "comment" || ve === "space" && Pt === De - 1 ? Ie = !1 : le += ue[1];
            }
            if (!Ie) {
              var Mt = ae.reduce(function(rr, tr) {
                return rr + tr[1];
              }, "");
              q.raws[L] = { value: le, raw: Mt };
            }
            q[L] = le;
          }, n.spacesAndCommentsFromEnd = function(q) {
            for (var L, ae = ""; q.length && (L = q[q.length - 1][0], !(L !== "space" && L !== "comment")); )
              ae = q.pop()[1] + ae;
            return ae;
          }, n.spacesAndCommentsFromStart = function(q) {
            for (var L, ae = ""; q.length && (L = q[0][0], !(L !== "space" && L !== "comment")); )
              ae += q.shift()[1];
            return ae;
          }, n.spacesFromEnd = function(q) {
            for (var L, ae = ""; q.length && (L = q[q.length - 1][0], L === "space"); )
              ae = q.pop()[1] + ae;
            return ae;
          }, n.stringFrom = function(q, L) {
            for (var ae = "", ue = L; ue < q.length; ue++)
              ae += q[ue][1];
            return q.splice(L, q.length - L), ae;
          }, n.colon = function(q) {
            for (var L = 0, ae, ue, ve, De = 0; De < q.length; De++) {
              if (ae = q[De], ue = ae[0], ue === "(" && (L += 1), ue === ")" && (L -= 1), L === 0 && ue === ":")
                if (!ve)
                  this.doubleColon(ae);
                else {
                  if (ve[0] === "word" && ve[1] === "progid")
                    continue;
                  return De;
                }
              ve = ae;
            }
            return !1;
          }, n.unclosedBracket = function(q) {
            throw this.input.error("Unclosed bracket", q[2], q[3]);
          }, n.unknownWord = function(q) {
            throw this.input.error("Unknown word", q[0][2], q[0][3]);
          }, n.unexpectedClose = function(q) {
            throw this.input.error("Unexpected }", q[2], q[3]);
          }, n.unclosedBlock = function() {
            var q = this.current.source.start;
            throw this.input.error("Unclosed block", q.line, q.column);
          }, n.doubleColon = function(q) {
            throw this.input.error("Double colon", q[2], q[3]);
          }, n.unnamedAtrule = function(q, L) {
            throw this.input.error("At-rule without name", L[2], L[3]);
          }, n.precheckMissedSemicolon = function() {
          }, n.checkMissedSemicolon = function(q) {
            var L = this.colon(q);
            if (L !== !1) {
              for (var ae = 0, ue, ve = L - 1; ve >= 0 && (ue = q[ve], !(ue[0] !== "space" && (ae += 1, ae === 2))); ve--)
                ;
              throw this.input.error("Missed semicolon", ue[2], ue[3]);
            }
          }, d;
        }();
        a.default = re, z.exports = a.default;
      } }), gu = Ae({ "node_modules/postcss-less/lib/nodes/inline-comment.js"(a, z) {
        Ye();
        var $ = Hs(), V = qu();
        z.exports = { isInlineComment(Y) {
          if (Y[0] === "word" && Y[1].slice(0, 2) === "//") {
            let te = Y, Z = [], ne;
            for (; Y; ) {
              if (/\r?\n/.test(Y[1])) {
                if (/['"].*\r?\n/.test(Y[1])) {
                  Z.push(Y[1].substring(0, Y[1].indexOf(`
`)));
                  let re = Y[1].substring(Y[1].indexOf(`
`));
                  re += this.input.css.valueOf().substring(this.tokenizer.position()), this.input = new V(re), this.tokenizer = $(this.input);
                } else
                  this.tokenizer.back(Y);
                break;
              }
              Z.push(Y[1]), ne = Y, Y = this.tokenizer.nextToken({ ignoreUnclosed: !0 });
            }
            let X = ["comment", Z.join(""), te[2], te[3], ne[2], ne[3]];
            return this.inlineComment(X), !0;
          } else if (Y[1] === "/") {
            let te = this.tokenizer.nextToken({ ignoreUnclosed: !0 });
            if (te[0] === "comment" && /^\/\*/.test(te[1]))
              return te[0] = "word", te[1] = te[1].slice(1), Y[1] = "//", this.tokenizer.back(te), z.exports.isInlineComment.bind(this)(Y);
          }
          return !1;
        } };
      } }), Xu = Ae({ "node_modules/postcss-less/lib/nodes/interpolation.js"(a, z) {
        Ye(), z.exports = { interpolation($) {
          let V = $, Y = [$], te = ["word", "{", "}"];
          if ($ = this.tokenizer.nextToken(), V[1].length > 1 || $[0] !== "{")
            return this.tokenizer.back($), !1;
          for (; $ && te.includes($[0]); )
            Y.push($), $ = this.tokenizer.nextToken();
          let Z = Y.map((n) => n[1]);
          [V] = Y;
          let ne = Y.pop(), X = [V[2], V[3]], re = [ne[4] || ne[2], ne[5] || ne[3]], d = ["word", Z.join("")].concat(X, re);
          return this.tokenizer.back($), this.tokenizer.back(d), !0;
        } };
      } }), Ks = Ae({ "node_modules/postcss-less/lib/nodes/mixin.js"(a, z) {
        Ye();
        var $ = /^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{3}$/, V = /\.[0-9]/, Y = (te) => {
          let [, Z] = te, [ne] = Z;
          return (ne === "." || ne === "#") && $.test(Z) === !1 && V.test(Z) === !1;
        };
        z.exports = { isMixinToken: Y };
      } }), Du = Ae({ "node_modules/postcss-less/lib/nodes/import.js"(a, z) {
        Ye();
        var $ = Hs(), V = /^url\((.+)\)/;
        z.exports = (Y) => {
          let { name: te, params: Z = "" } = Y;
          if (te === "import" && Z.length) {
            Y.import = !0;
            let ne = $({ css: Z });
            for (Y.filename = Z.replace(V, "$1"); !ne.endOfFile(); ) {
              let [X, re] = ne.nextToken();
              if (X === "word" && re === "url")
                return;
              if (X === "brackets") {
                Y.options = re, Y.filename = Z.replace(re, "").trim();
                break;
              }
            }
          }
        };
      } }), Uo = Ae({ "node_modules/postcss-less/lib/nodes/variable.js"(a, z) {
        Ye();
        var $ = /:$/, V = /^:(\s+)?/;
        z.exports = (Y) => {
          let { name: te, params: Z = "" } = Y;
          if (Y.name.slice(-1) === ":") {
            if ($.test(te)) {
              let [ne] = te.match($);
              Y.name = te.replace(ne, ""), Y.raws.afterName = ne + (Y.raws.afterName || ""), Y.variable = !0, Y.value = Y.params;
            }
            if (V.test(Z)) {
              let [ne] = Z.match(V);
              Y.value = Z.replace(ne, ""), Y.raws.afterName = (Y.raws.afterName || "") + ne, Y.variable = !0;
            }
          }
        };
      } }), Go = Ae({ "node_modules/postcss-less/lib/LessParser.js"(a, z) {
        Ye();
        var $ = ai(), V = Hi(), { isInlineComment: Y } = gu(), { interpolation: te } = Xu(), { isMixinToken: Z } = Ks(), ne = Du(), X = Uo(), re = /(!\s*important)$/i;
        z.exports = class extends V {
          constructor() {
            super(...arguments), this.lastNode = null;
          }
          atrule(d) {
            te.bind(this)(d) || (super.atrule(d), ne(this.lastNode), X(this.lastNode));
          }
          decl() {
            super.decl(...arguments), /extend\(.+\)/i.test(this.lastNode.value) && (this.lastNode.extend = !0);
          }
          each(d) {
            d[0][1] = ` ${d[0][1]}`;
            let n = d.findIndex((ue) => ue[0] === "("), q = d.reverse().find((ue) => ue[0] === ")"), L = d.reverse().indexOf(q), ae = d.splice(n, L).map((ue) => ue[1]).join("");
            for (let ue of d.reverse())
              this.tokenizer.back(ue);
            this.atrule(this.tokenizer.nextToken()), this.lastNode.function = !0, this.lastNode.params = ae;
          }
          init(d, n, q) {
            super.init(d, n, q), this.lastNode = d;
          }
          inlineComment(d) {
            let n = new $(), q = d[1].slice(2);
            if (this.init(n, d[2], d[3]), n.source.end = { line: d[4], column: d[5] }, n.inline = !0, n.raws.begin = "//", /^\s*$/.test(q))
              n.text = "", n.raws.left = q, n.raws.right = "";
            else {
              let L = q.match(/^(\s*)([^]*[^\s])(\s*)$/);
              [, n.raws.left, n.text, n.raws.right] = L;
            }
          }
          mixin(d) {
            let [n] = d, q = n[1].slice(0, 1), L = d.findIndex((le) => le[0] === "brackets"), ae = d.findIndex((le) => le[0] === "("), ue = "";
            if ((L < 0 || L > 3) && ae > 0) {
              let le = d.reduce((pr, er, ir) => er[0] === ")" ? ir : pr), Ie = d.slice(ae, le + ae).map((pr) => pr[1]).join(""), [Me] = d.slice(ae), We = [Me[2], Me[3]], [Ft] = d.slice(le, le + 1), Pt = [Ft[2], Ft[3]], Mt = ["brackets", Ie].concat(We, Pt), rr = d.slice(0, ae), tr = d.slice(le + 1);
              d = rr, d.push(Mt), d = d.concat(tr);
            }
            let ve = [];
            for (let le of d)
              if ((le[1] === "!" || ve.length) && ve.push(le), le[1] === "important")
                break;
            if (ve.length) {
              let [le] = ve, Ie = d.indexOf(le), Me = ve[ve.length - 1], We = [le[2], le[3]], Ft = [Me[4], Me[5]], Pt = ["word", ve.map((Mt) => Mt[1]).join("")].concat(We, Ft);
              d.splice(Ie, ve.length, Pt);
            }
            let De = d.findIndex((le) => re.test(le[1]));
            De > 0 && ([, ue] = d[De], d.splice(De, 1));
            for (let le of d.reverse())
              this.tokenizer.back(le);
            this.atrule(this.tokenizer.nextToken()), this.lastNode.mixin = !0, this.lastNode.raws.identifier = q, ue && (this.lastNode.important = !0, this.lastNode.raws.important = ue);
          }
          other(d) {
            Y.bind(this)(d) || super.other(d);
          }
          rule(d) {
            let n = d[d.length - 1], q = d[d.length - 2];
            if (q[0] === "at-word" && n[0] === "{" && (this.tokenizer.back(n), te.bind(this)(q))) {
              let L = this.tokenizer.nextToken();
              d = d.slice(0, d.length - 2).concat([L]);
              for (let ae of d.reverse())
                this.tokenizer.back(ae);
              return;
            }
            super.rule(d), /:extend\(.+\)/i.test(this.lastNode.selector) && (this.lastNode.extend = !0);
          }
          unknownWord(d) {
            let [n] = d;
            if (d[0][1] === "each" && d[1][0] === "(") {
              this.each(d);
              return;
            }
            if (Z(n)) {
              this.mixin(d);
              return;
            }
            super.unknownWord(d);
          }
        };
      } }), Ys = Ae({ "node_modules/postcss-less/lib/LessStringifier.js"(a, z) {
        Ye();
        var $ = Ju();
        z.exports = class extends $ {
          atrule(V, Y) {
            if (!V.mixin && !V.variable && !V.function) {
              super.atrule(V, Y);
              return;
            }
            let te = `${V.function ? "" : V.raws.identifier || "@"}${V.name}`, Z = V.params ? this.rawValue(V, "params") : "", ne = V.raws.important || "";
            if (V.variable && (Z = V.value), typeof V.raws.afterName < "u" ? te += V.raws.afterName : Z && (te += " "), V.nodes)
              this.block(V, te + Z + ne);
            else {
              let X = (V.raws.between || "") + ne + (Y ? ";" : "");
              this.builder(te + Z + X, V);
            }
          }
          comment(V) {
            if (V.inline) {
              let Y = this.raw(V, "left", "commentLeft"), te = this.raw(V, "right", "commentRight");
              this.builder(`//${Y}${V.text}${te}`, V);
            } else
              super.comment(V);
          }
        };
      } }), ja = Ae({ "node_modules/postcss-less/lib/index.js"(a, z) {
        Ye();
        var $ = qu(), V = Go(), Y = Ys();
        z.exports = { parse(te, Z) {
          let ne = new $(te, Z), X = new V(ne);
          return X.parse(), X.root;
        }, stringify(te, Z) {
          new Y(Z).stringify(te);
        }, nodeToString(te) {
          let Z = "";
          return z.exports.stringify(te, (ne) => {
            Z += ne;
          }), Z;
        } };
      } }), Pa = Ae({ "node_modules/postcss-scss/lib/scss-stringifier.js"(a, z) {
        Ye();
        function $(te, Z) {
          te.prototype = Object.create(Z.prototype), te.prototype.constructor = te, te.__proto__ = Z;
        }
        var V = Ju(), Y = function(te) {
          $(Z, te);
          function Z() {
            return te.apply(this, arguments) || this;
          }
          var ne = Z.prototype;
          return ne.comment = function(X) {
            var re = this.raw(X, "left", "commentLeft"), d = this.raw(X, "right", "commentRight");
            if (X.raws.inline) {
              var n = X.raws.text || X.text;
              this.builder("//" + re + n + d, X);
            } else
              this.builder("/*" + re + X.text + d + "*/", X);
          }, ne.decl = function(X, re) {
            if (!X.isNested)
              te.prototype.decl.call(this, X, re);
            else {
              var d = this.raw(X, "between", "colon"), n = X.prop + d + this.rawValue(X, "value");
              X.important && (n += X.raws.important || " !important"), this.builder(n + "{", X, "start");
              var q;
              X.nodes && X.nodes.length ? (this.body(X), q = this.raw(X, "after")) : q = this.raw(X, "after", "emptyBody"), q && this.builder(q), this.builder("}", X, "end");
            }
          }, ne.rawValue = function(X, re) {
            var d = X[re], n = X.raws[re];
            return n && n.value === d ? n.scss ? n.scss : n.raw : d;
          }, Z;
        }(V);
        z.exports = Y;
      } }), zo = Ae({ "node_modules/postcss-scss/lib/scss-stringify.js"(a, z) {
        Ye();
        var $ = Pa();
        z.exports = function(V, Y) {
          var te = new $(Y);
          te.stringify(V);
        };
      } }), Wo = Ae({ "node_modules/postcss-scss/lib/nested-declaration.js"(a, z) {
        Ye();
        function $(te, Z) {
          te.prototype = Object.create(Z.prototype), te.prototype.constructor = te, te.__proto__ = Z;
        }
        var V = Cn(), Y = function(te) {
          $(Z, te);
          function Z(ne) {
            var X;
            return X = te.call(this, ne) || this, X.type = "decl", X.isNested = !0, X.nodes || (X.nodes = []), X;
          }
          return Z;
        }(V);
        z.exports = Y;
      } }), Xo = Ae({ "node_modules/postcss-scss/lib/scss-tokenize.js"(a, z) {
        Ye();
        var $ = "'".charCodeAt(0), V = '"'.charCodeAt(0), Y = "\\".charCodeAt(0), te = "/".charCodeAt(0), Z = `
`.charCodeAt(0), ne = " ".charCodeAt(0), X = "\f".charCodeAt(0), re = "	".charCodeAt(0), d = "\r".charCodeAt(0), n = "[".charCodeAt(0), q = "]".charCodeAt(0), L = "(".charCodeAt(0), ae = ")".charCodeAt(0), ue = "{".charCodeAt(0), ve = "}".charCodeAt(0), De = ";".charCodeAt(0), le = "*".charCodeAt(0), Ie = ":".charCodeAt(0), Me = "@".charCodeAt(0), We = ",".charCodeAt(0), Ft = "#".charCodeAt(0), Pt = /[ \n\t\r\f{}()'"\\;/[\]#]/g, Mt = /[ \n\t\r\f(){}:;@!'"\\\][#]|\/(?=\*)/g, rr = /.[\\/("'\n]/, tr = /[a-f0-9]/i, pr = /[\r\f\n]/g;
        z.exports = function(er, ir) {
          ir === void 0 && (ir = {});
          var At = er.css.valueOf(), gt = ir.ignoreErrors, Nt, mt, Zr, Or, Jr, _r, Fr, zt, vr, lr, fr, qe, ct, dt, It = At.length, Ve = -1, Yt = 1, Jt = 0, on = [], an = [];
          function wn(hn) {
            throw er.error("Unclosed " + hn, Yt, Jt - Ve);
          }
          function zn() {
            return an.length === 0 && Jt >= It;
          }
          function xn() {
            for (var hn = 1, Yr = !1, Sn = !1; hn > 0; )
              mt += 1, At.length <= mt && wn("interpolation"), Nt = At.charCodeAt(mt), qe = At.charCodeAt(mt + 1), Yr ? !Sn && Nt === Yr ? (Yr = !1, Sn = !1) : Nt === Y ? Sn = !lr : Sn && (Sn = !1) : Nt === $ || Nt === V ? Yr = Nt : Nt === ve ? hn -= 1 : Nt === Ft && qe === ue && (hn += 1);
          }
          function ln() {
            if (an.length)
              return an.pop();
            if (!(Jt >= It)) {
              switch (Nt = At.charCodeAt(Jt), (Nt === Z || Nt === X || Nt === d && At.charCodeAt(Jt + 1) !== Z) && (Ve = Jt, Yt += 1), Nt) {
                case Z:
                case ne:
                case re:
                case d:
                case X:
                  mt = Jt;
                  do
                    mt += 1, Nt = At.charCodeAt(mt), Nt === Z && (Ve = mt, Yt += 1);
                  while (Nt === ne || Nt === Z || Nt === re || Nt === d || Nt === X);
                  ct = ["space", At.slice(Jt, mt)], Jt = mt - 1;
                  break;
                case n:
                  ct = ["[", "[", Yt, Jt - Ve];
                  break;
                case q:
                  ct = ["]", "]", Yt, Jt - Ve];
                  break;
                case ue:
                  ct = ["{", "{", Yt, Jt - Ve];
                  break;
                case ve:
                  ct = ["}", "}", Yt, Jt - Ve];
                  break;
                case We:
                  ct = ["word", ",", Yt, Jt - Ve, Yt, Jt - Ve + 1];
                  break;
                case Ie:
                  ct = [":", ":", Yt, Jt - Ve];
                  break;
                case De:
                  ct = [";", ";", Yt, Jt - Ve];
                  break;
                case L:
                  if (fr = on.length ? on.pop()[1] : "", qe = At.charCodeAt(Jt + 1), fr === "url" && qe !== $ && qe !== V) {
                    for (dt = 1, lr = !1, mt = Jt + 1; mt <= At.length - 1; ) {
                      if (qe = At.charCodeAt(mt), qe === Y)
                        lr = !lr;
                      else if (qe === L)
                        dt += 1;
                      else if (qe === ae && (dt -= 1, dt === 0))
                        break;
                      mt += 1;
                    }
                    _r = At.slice(Jt, mt + 1), Or = _r.split(`
`), Jr = Or.length - 1, Jr > 0 ? (zt = Yt + Jr, vr = mt - Or[Jr].length) : (zt = Yt, vr = Ve), ct = ["brackets", _r, Yt, Jt - Ve, zt, mt - vr], Ve = vr, Yt = zt, Jt = mt;
                  } else
                    mt = At.indexOf(")", Jt + 1), _r = At.slice(Jt, mt + 1), mt === -1 || rr.test(_r) ? ct = ["(", "(", Yt, Jt - Ve] : (ct = ["brackets", _r, Yt, Jt - Ve, Yt, mt - Ve], Jt = mt);
                  break;
                case ae:
                  ct = [")", ")", Yt, Jt - Ve];
                  break;
                case $:
                case V:
                  for (Zr = Nt, mt = Jt, lr = !1; mt < It && (mt++, mt === It && wn("string"), Nt = At.charCodeAt(mt), qe = At.charCodeAt(mt + 1), !(!lr && Nt === Zr)); )
                    Nt === Y ? lr = !lr : lr ? lr = !1 : Nt === Ft && qe === ue && xn();
                  _r = At.slice(Jt, mt + 1), Or = _r.split(`
`), Jr = Or.length - 1, Jr > 0 ? (zt = Yt + Jr, vr = mt - Or[Jr].length) : (zt = Yt, vr = Ve), ct = ["string", At.slice(Jt, mt + 1), Yt, Jt - Ve, zt, mt - vr], Ve = vr, Yt = zt, Jt = mt;
                  break;
                case Me:
                  Pt.lastIndex = Jt + 1, Pt.test(At), Pt.lastIndex === 0 ? mt = At.length - 1 : mt = Pt.lastIndex - 2, ct = ["at-word", At.slice(Jt, mt + 1), Yt, Jt - Ve, Yt, mt - Ve], Jt = mt;
                  break;
                case Y:
                  for (mt = Jt, Fr = !0; At.charCodeAt(mt + 1) === Y; )
                    mt += 1, Fr = !Fr;
                  if (Nt = At.charCodeAt(mt + 1), Fr && Nt !== te && Nt !== ne && Nt !== Z && Nt !== re && Nt !== d && Nt !== X && (mt += 1, tr.test(At.charAt(mt)))) {
                    for (; tr.test(At.charAt(mt + 1)); )
                      mt += 1;
                    At.charCodeAt(mt + 1) === ne && (mt += 1);
                  }
                  ct = ["word", At.slice(Jt, mt + 1), Yt, Jt - Ve, Yt, mt - Ve], Jt = mt;
                  break;
                default:
                  qe = At.charCodeAt(Jt + 1), Nt === Ft && qe === ue ? (mt = Jt, xn(), _r = At.slice(Jt, mt + 1), Or = _r.split(`
`), Jr = Or.length - 1, Jr > 0 ? (zt = Yt + Jr, vr = mt - Or[Jr].length) : (zt = Yt, vr = Ve), ct = ["word", _r, Yt, Jt - Ve, zt, mt - vr], Ve = vr, Yt = zt, Jt = mt) : Nt === te && qe === le ? (mt = At.indexOf("*/", Jt + 2) + 1, mt === 0 && (gt ? mt = At.length : wn("comment")), _r = At.slice(Jt, mt + 1), Or = _r.split(`
`), Jr = Or.length - 1, Jr > 0 ? (zt = Yt + Jr, vr = mt - Or[Jr].length) : (zt = Yt, vr = Ve), ct = ["comment", _r, Yt, Jt - Ve, zt, mt - vr], Ve = vr, Yt = zt, Jt = mt) : Nt === te && qe === te ? (pr.lastIndex = Jt + 1, pr.test(At), pr.lastIndex === 0 ? mt = At.length - 1 : mt = pr.lastIndex - 2, _r = At.slice(Jt, mt + 1), ct = ["comment", _r, Yt, Jt - Ve, Yt, mt - Ve, "inline"], Jt = mt) : (Mt.lastIndex = Jt + 1, Mt.test(At), Mt.lastIndex === 0 ? mt = At.length - 1 : mt = Mt.lastIndex - 2, ct = ["word", At.slice(Jt, mt + 1), Yt, Jt - Ve, Yt, mt - Ve], on.push(ct), Jt = mt);
                  break;
              }
              return Jt++, ct;
            }
          }
          function cn(hn) {
            an.push(hn);
          }
          return { back: cn, nextToken: ln, endOfFile: zn };
        };
      } }), _a = Ae({ "node_modules/postcss-scss/lib/scss-parser.js"(a, z) {
        Ye();
        function $(X, re) {
          X.prototype = Object.create(re.prototype), X.prototype.constructor = X, X.__proto__ = re;
        }
        var V = ai(), Y = Hi(), te = Wo(), Z = Xo(), ne = function(X) {
          $(re, X);
          function re() {
            return X.apply(this, arguments) || this;
          }
          var d = re.prototype;
          return d.createTokenizer = function() {
            this.tokenizer = Z(this.input);
          }, d.rule = function(n) {
            for (var q = !1, L = 0, ae = "", De = n, ue = Array.isArray(De), ve = 0, De = ue ? De : De[Symbol.iterator](); ; ) {
              var le;
              if (ue) {
                if (ve >= De.length)
                  break;
                le = De[ve++];
              } else {
                if (ve = De.next(), ve.done)
                  break;
                le = ve.value;
              }
              var Ie = le;
              if (q)
                Ie[0] !== "comment" && Ie[0] !== "{" && (ae += Ie[1]);
              else {
                if (Ie[0] === "space" && Ie[1].indexOf(`
`) !== -1)
                  break;
                Ie[0] === "(" ? L += 1 : Ie[0] === ")" ? L -= 1 : L === 0 && Ie[0] === ":" && (q = !0);
              }
            }
            if (!q || ae.trim() === "" || /^[a-zA-Z-:#]/.test(ae))
              X.prototype.rule.call(this, n);
            else {
              n.pop();
              var Me = new te();
              this.init(Me);
              var We = n[n.length - 1];
              for (We[4] ? Me.source.end = { line: We[4], column: We[5] } : Me.source.end = { line: We[2], column: We[3] }; n[0][0] !== "word"; )
                Me.raws.before += n.shift()[1];
              for (Me.source.start = { line: n[0][2], column: n[0][3] }, Me.prop = ""; n.length; ) {
                var Ft = n[0][0];
                if (Ft === ":" || Ft === "space" || Ft === "comment")
                  break;
                Me.prop += n.shift()[1];
              }
              Me.raws.between = "";
              for (var Pt; n.length; )
                if (Pt = n.shift(), Pt[0] === ":") {
                  Me.raws.between += Pt[1];
                  break;
                } else
                  Me.raws.between += Pt[1];
              (Me.prop[0] === "_" || Me.prop[0] === "*") && (Me.raws.before += Me.prop[0], Me.prop = Me.prop.slice(1)), Me.raws.between += this.spacesAndCommentsFromStart(n), this.precheckMissedSemicolon(n);
              for (var Mt = n.length - 1; Mt > 0; Mt--) {
                if (Pt = n[Mt], Pt[1] === "!important") {
                  Me.important = !0;
                  var rr = this.stringFrom(n, Mt);
                  rr = this.spacesFromEnd(n) + rr, rr !== " !important" && (Me.raws.important = rr);
                  break;
                } else if (Pt[1] === "important") {
                  for (var tr = n.slice(0), pr = "", er = Mt; er > 0; er--) {
                    var ir = tr[er][0];
                    if (pr.trim().indexOf("!") === 0 && ir !== "space")
                      break;
                    pr = tr.pop()[1] + pr;
                  }
                  pr.trim().indexOf("!") === 0 && (Me.important = !0, Me.raws.important = pr, n = tr);
                }
                if (Pt[0] !== "space" && Pt[0] !== "comment")
                  break;
              }
              this.raw(Me, "value", n), Me.value.indexOf(":") !== -1 && this.checkMissedSemicolon(n), this.current = Me;
            }
          }, d.comment = function(n) {
            if (n[6] === "inline") {
              var q = new V();
              this.init(q, n[2], n[3]), q.raws.inline = !0, q.source.end = { line: n[4], column: n[5] };
              var L = n[1].slice(2);
              if (/^\s*$/.test(L))
                q.text = "", q.raws.left = L, q.raws.right = "";
              else {
                var ae = L.match(/^(\s*)([^]*[^\s])(\s*)$/), ue = ae[2].replace(/(\*\/|\/\*)/g, "*//*");
                q.text = ue, q.raws.left = ae[1], q.raws.right = ae[3], q.raws.text = ae[2];
              }
            } else
              X.prototype.comment.call(this, n);
          }, d.raw = function(n, q, L) {
            if (X.prototype.raw.call(this, n, q, L), n.raws[q]) {
              var ae = n.raws[q].raw;
              n.raws[q].raw = L.reduce(function(ue, ve) {
                if (ve[0] === "comment" && ve[6] === "inline") {
                  var De = ve[1].slice(2).replace(/(\*\/|\/\*)/g, "*//*");
                  return ue + "/*" + De + "*/";
                } else
                  return ue + ve[1];
              }, ""), ae !== n.raws[q].raw && (n.raws[q].scss = ae);
            }
          }, re;
        }(Y);
        z.exports = ne;
      } }), Ia = Ae({ "node_modules/postcss-scss/lib/scss-parse.js"(a, z) {
        Ye();
        var $ = qu(), V = _a();
        z.exports = function(Y, te) {
          var Z = new $(Y, te), ne = new V(Z);
          return ne.parse(), ne.root;
        };
      } }), Oa = Ae({ "node_modules/postcss-scss/lib/scss-syntax.js"(a, z) {
        Ye();
        var $ = zo(), V = Ia();
        z.exports = { parse: V, stringify: $ };
      } });
      Ye();
      var La = Ht(), Qs = ur(), Ki = xr(), { hasPragma: Ma } = Nr(), { locStart: $a, locEnd: Zs } = vn(), { calculateLoc: Ra, replaceQuotesInInlineComments: Va } = vn(), Ho = Mi(), qa = On(), eo = hi(), Ko = dn(), Ja = wu(), to = Un(), Ua = Su(), Yo = Tu(), Ga = (a) => {
        for (; a.parent; )
          a = a.parent;
        return a;
      };
      function za(a, z) {
        let { nodes: $ } = a, V = { open: null, close: null, groups: [], type: "paren_group" }, Y = [V], te = V, Z = { groups: [], type: "comma_group" }, ne = [Z];
        for (let X = 0; X < $.length; ++X) {
          let re = $[X];
          if (Ko(z.parser, re.value) && re.type === "number" && re.unit === ".." && Qs(re.value) === "." && (re.value = re.value.slice(0, -1), re.unit = "..."), re.type === "func" && re.value === "selector" && (re.group.groups = [Ni(Ga(a).text.slice(re.group.open.sourceIndex + 1, re.group.close.sourceIndex))]), re.type === "func" && re.value === "url") {
            let d = re.group && re.group.groups || [], n = [];
            for (let q = 0; q < d.length; q++) {
              let L = d[q];
              L.type === "comma_group" ? n = [...n, ...L.groups] : n.push(L);
            }
            if (Ho(n) || !qa(n) && !to(n[0])) {
              let q = Ua({ groups: re.group.groups });
              re.group.groups = [q.trim()];
            }
          }
          if (re.type === "paren" && re.value === "(")
            V = { open: re, close: null, groups: [], type: "paren_group" }, Y.push(V), Z = { groups: [], type: "comma_group" }, ne.push(Z);
          else if (re.type === "paren" && re.value === ")") {
            if (Z.groups.length > 0 && V.groups.push(Z), V.close = re, ne.length === 1)
              throw new Error("Unbalanced parenthesis");
            ne.pop(), Z = Qs(ne), Z.groups.push(V), Y.pop(), V = Qs(Y);
          } else
            re.type === "comma" ? (V.groups.push(Z), Z = { groups: [], type: "comma_group" }, ne[ne.length - 1] = Z) : Z.groups.push(re);
        }
        return Z.groups.length > 0 && V.groups.push(Z), te;
      }
      function ro(a) {
        return a.type === "paren_group" && !a.open && !a.close && a.groups.length === 1 || a.type === "comma_group" && a.groups.length === 1 ? ro(a.groups[0]) : a.type === "paren_group" || a.type === "comma_group" ? Object.assign(Object.assign({}, a), {}, { groups: a.groups.map(ro) }) : a;
      }
      function yu(a, z, $) {
        if (a && typeof a == "object") {
          delete a.parent;
          for (let V in a)
            yu(a[V], z, $), V === "type" && typeof a[V] == "string" && !a[V].startsWith(z) && (!$ || !$.test(a[V])) && (a[V] = z + a[V]);
        }
        return a;
      }
      function Qo(a) {
        if (a && typeof a == "object") {
          delete a.parent;
          for (let z in a)
            Qo(a[z]);
          !Array.isArray(a) && a.value && !a.type && (a.type = "unknown");
        }
        return a;
      }
      function Zo(a, z) {
        if (a && typeof a == "object") {
          for (let $ in a)
            $ !== "parent" && (Zo(a[$], z), $ === "nodes" && (a.group = ro(za(a, z)), delete a[$]));
          delete a.parent;
        }
        return a;
      }
      function Bi(a, z) {
        let $ = xa(), V = null;
        try {
          V = $(a, { loose: !0 }).parse();
        } catch {
          return { type: "value-unknown", value: a };
        }
        V.text = a;
        let Y = Zo(V, z);
        return yu(Y, "value-", /^selector-/);
      }
      function Ni(a) {
        if (/\/\/|\/\*/.test(a))
          return { type: "selector-unknown", value: a.trim() };
        let z = Aa(), $ = null;
        try {
          z((V) => {
            $ = V;
          }).process(a);
        } catch {
          return { type: "selector-unknown", value: a };
        }
        return yu($, "selector-");
      }
      function Wa(a) {
        let z = Sa().default, $ = null;
        try {
          $ = z(a);
        } catch {
          return { type: "selector-unknown", value: a };
        }
        return yu(Qo($), "media-");
      }
      var Xa = /(\s*)(!default).*$/, Ha = /(\s*)(!global).*$/;
      function ea(a, z) {
        if (a && typeof a == "object") {
          delete a.parent;
          for (let X in a)
            ea(a[X], z);
          if (!a.type)
            return a;
          a.raws || (a.raws = {});
          let te = "";
          if (typeof a.selector == "string") {
            var $;
            te = a.raws.selector ? ($ = a.raws.selector.scss) !== null && $ !== void 0 ? $ : a.raws.selector.raw : a.selector, a.raws.between && a.raws.between.trim().length > 0 && (te += a.raws.between), a.raws.selector = te;
          }
          let Z = "";
          if (typeof a.value == "string") {
            var V;
            Z = a.raws.value ? (V = a.raws.value.scss) !== null && V !== void 0 ? V : a.raws.value.raw : a.value, Z = Z.trim(), a.raws.value = Z;
          }
          let ne = "";
          if (typeof a.params == "string") {
            var Y;
            ne = a.raws.params ? (Y = a.raws.params.scss) !== null && Y !== void 0 ? Y : a.raws.params.raw : a.params, a.raws.afterName && a.raws.afterName.trim().length > 0 && (ne = a.raws.afterName + ne), a.raws.between && a.raws.between.trim().length > 0 && (ne = ne + a.raws.between), ne = ne.trim(), a.raws.params = ne;
          }
          if (te.trim().length > 0)
            return te.startsWith("@") && te.endsWith(":") ? a : a.mixin ? (a.selector = Bi(te, z), a) : (Ja(a) && (a.isSCSSNesterProperty = !0), a.selector = Ni(te), a);
          if (Z.length > 0) {
            let X = Z.match(Xa);
            X && (Z = Z.slice(0, X.index), a.scssDefault = !0, X[0].trim() !== "!default" && (a.raws.scssDefault = X[0]));
            let re = Z.match(Ha);
            if (re && (Z = Z.slice(0, re.index), a.scssGlobal = !0, re[0].trim() !== "!global" && (a.raws.scssGlobal = re[0])), Z.startsWith("progid:"))
              return { type: "value-unknown", value: Z };
            a.value = Bi(Z, z);
          }
          if (eo(z) && a.type === "css-decl" && Z.startsWith("extend(") && (a.extend || (a.extend = a.raws.between === ":"), a.extend && !a.selector && (delete a.value, a.selector = Ni(Z.slice(7, -1)))), a.type === "css-atrule") {
            if (eo(z)) {
              if (a.mixin) {
                let X = a.raws.identifier + a.name + a.raws.afterName + a.raws.params;
                return a.selector = Ni(X), delete a.params, a;
              }
              if (a.function)
                return a;
            }
            if (z.parser === "css" && a.name === "custom-selector") {
              let X = a.params.match(/:--\S+\s+/)[0].trim();
              return a.customSelector = X, a.selector = Ni(a.params.slice(X.length).trim()), delete a.params, a;
            }
            if (eo(z)) {
              if (a.name.includes(":") && !a.params) {
                a.variable = !0;
                let X = a.name.split(":");
                a.name = X[0], a.value = Bi(X.slice(1).join(":"), z);
              }
              if (!["page", "nest", "keyframes"].includes(a.name) && a.params && a.params[0] === ":") {
                a.variable = !0;
                let X = a.params.slice(1);
                X && (a.value = Bi(X, z)), a.raws.afterName += ":";
              }
              if (a.variable)
                return delete a.params, a.value || delete a.value, a;
            }
          }
          if (a.type === "css-atrule" && ne.length > 0) {
            let { name: X } = a, re = a.name.toLowerCase();
            return X === "warn" || X === "error" ? (a.params = { type: "media-unknown", value: ne }, a) : X === "extend" || X === "nest" ? (a.selector = Ni(ne), delete a.params, a) : X === "at-root" ? (/^\(\s*(?:without|with)\s*:.+\)$/s.test(ne) ? a.params = Bi(ne, z) : (a.selector = Ni(ne), delete a.params), a) : Yo(re) ? (a.import = !0, delete a.filename, a.params = Bi(ne, z), a) : ["namespace", "supports", "if", "else", "for", "each", "while", "debug", "mixin", "include", "function", "return", "define-mixin", "add-mixin"].includes(X) ? (ne = ne.replace(/(\$\S+?)(\s+)?\.{3}/, "$1...$2"), ne = ne.replace(/^(?!if)(\S+)(\s+)\(/, "$1($2"), a.value = Bi(ne, z), delete a.params, a) : ["media", "custom-media"].includes(re) ? ne.includes("#{") ? { type: "media-unknown", value: ne } : (a.params = Wa(ne), a) : (a.params = ne, a);
          }
        }
        return a;
      }
      function ta(a, z, $) {
        let V = Ki(z), { frontMatter: Y } = V;
        z = V.content;
        let te;
        try {
          te = a(z);
        } catch (Z) {
          let { name: ne, reason: X, line: re, column: d } = Z;
          throw typeof re != "number" ? Z : La(`${ne}: ${X}`, { start: { line: re, column: d } });
        }
        return te = ea(yu(te, "css-"), $), Ra(te, z), Y && (Y.source = { startOffset: 0, endOffset: Y.raw.length }, te.nodes.unshift(Y)), te;
      }
      function Ka(a, z) {
        let $ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, V = Ko($.parser, a) ? [io, no] : [no, io], Y;
        for (let te of V)
          try {
            return te(a, z, $);
          } catch (Z) {
            Y = Y || Z;
          }
        if (Y)
          throw Y;
      }
      function no(a, z) {
        let $ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, V = ja();
        return ta((Y) => V.parse(Va(Y)), a, $);
      }
      function io(a, z) {
        let $ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, { parse: V } = Oa();
        return ta(V, a, $);
      }
      var uo = { astFormat: "postcss", hasPragma: Ma, locStart: $a, locEnd: Zs };
      ft.exports = { parsers: { css: Object.assign(Object.assign({}, uo), {}, { parse: Ka }), less: Object.assign(Object.assign({}, uo), {}, { parse: no }), scss: Object.assign(Object.assign({}, uo), {}, { parse: io }) } };
    });
    return Au();
  });
})(parserPostcss);
const parserPostCSS = /* @__PURE__ */ getDefaultExportFromCjs(parserPostcssExports);
function calcFrameTime(f, k, j) {
  const [we, st] = [f.start, k.start];
  return {
    start: we.value * j / 100,
    stop: st.value * j / 100
  };
}
function seekPreviousValue(f, k, j) {
  for (let we = f - 1; we >= 0; we--)
    if (j(k[we]))
      return we;
}
function parseTemplateFrame(f, k, j, we, st) {
  const [Le, pt] = [k[f], k[f + 1]], [hr, br] = [j[f], j[f + 1]], Pr = calcFrameTime(Le, pt, we), Ir = {}, Pn = [.../* @__PURE__ */ new Set([...Object.keys(hr), ...Object.keys(br)])], fn = (Mr, zr, mn) => ({
    start: j[zr][Mr],
    stop: j[mn][Mr]
  });
  Pn.forEach((Mr) => {
    if (Mr in hr && Mr in br)
      Ir[Mr] = fn(Mr, f, f + 1);
    else if (!(Mr in hr) && Mr in br) {
      const zr = seekPreviousValue(f, j, (qr) => Mr in qr);
      if (zr == null)
        return;
      const mn = st[zr];
      mn.time = calcFrameTime(
        k[zr],
        pt,
        we
      ), mn.interpVars[Mr] = fn(Mr, zr, f + 1);
    }
  });
  let nn = Le.transform;
  if (nn == null) {
    const Mr = seekPreviousValue(f, st, (zr) => zr.transform != null);
    nn = st[Mr].transform;
  }
  return {
    id: Le.id,
    time: Pr,
    interpVars: Ir,
    transform: nn,
    timingFunction: Le.timingFunction
  };
}
const defaultOptions = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: easeInOutCubic
}, getTimingFunction = (f) => typeof f == "string" ? timingFunctions[f] : f ?? void 0;
let nextId = 0;
class Animation {
  constructor(k, j = document.documentElement) {
    rn(this, "id", nextId++);
    rn(this, "options");
    rn(this, "templateFrames", []);
    rn(this, "transformedVars", []);
    rn(this, "frameId", 0);
    rn(this, "frames", []);
    rn(this, "startTime");
    rn(this, "pausedTime", 0);
    rn(this, "prevTime", 0);
    rn(this, "t", 0);
    rn(this, "iteration", 0);
    rn(this, "started", !1);
    rn(this, "done", !1);
    rn(this, "reversed", !1);
    rn(this, "paused", !1);
    this.target = j, this.options = { ...defaultOptions, ...k }, this.parseOptions(k);
  }
  frame(k, j, we, st) {
    k = typeof k == "number" ? String(k) + "%" : k;
    const Le = CSSValueUnit.Value.tryParse(k), pt = {
      id: this.frameId,
      start: Le,
      vars: j,
      transform: we,
      timingFunction: getTimingFunction(st) ?? this.options.timingFunction
    };
    return this.templateFrames.push(pt), this.frameId += 1, this;
  }
  transformVars() {
    return this.transformedVars = this.templateFrames.map((k) => transformObject(k.vars)), this;
  }
  parseFrames() {
    for (let k = 0; k < this.templateFrames.length; k++) {
      const j = this.templateFrames[k];
      if (j.start.unit === "ms") {
        j.start.unit = "%";
        const Le = ((k > 0 ? this.templateFrames[k - 1].start.value : 0) * this.options.duration / 100 + j.start.value) / this.options.duration * 100;
        j.start.value = Le;
      }
    }
    this.templateFrames.sort((k, j) => k.start.value - j.start.value);
    for (let k = 0; k < this.templateFrames.length - 1; k++) {
      const j = parseTemplateFrame(
        k,
        this.templateFrames,
        this.transformedVars,
        this.options.duration,
        this.frames
      );
      this.frames.push(j);
    }
    return this;
  }
  updateTimingFunction(k) {
    return this.options.timingFunction = getTimingFunction(k), this;
  }
  updateIterationCount(k) {
    return k === "infinite" ? this.options.iterationCount = 1 / 0 : typeof k == "string" ? this.options.iterationCount = parseFloat(k) : this.options.iterationCount = k, this;
  }
  updateDuration(k) {
    typeof k == "string" && (k = parseCSSTime(k));
    const j = this.options.duration, we = k / j;
    for (let st = 0; st < this.frames.length; st++) {
      const Le = this.frames[st];
      Le.time.start *= we, Le.time.stop *= we;
    }
    return this.options.duration = k, this;
  }
  updateDelay(k) {
    return typeof k == "string" && (k = parseCSSTime(k)), this.options.delay = k, this;
  }
  parseOptions(k) {
    return this.updateTimingFunction(k.timingFunction), this.updateDuration(k.duration), this.updateIterationCount(k.iterationCount), this.updateDelay(k.delay), this;
  }
  parse() {
    return this.transformVars().parseFrames(), this;
  }
  reverse() {
    return this.reversed = !this.reversed, this;
  }
  pause(k = !0) {
    return this.paused && k && requestAnimationFrame(this.draw.bind(this)), this.started && (this.paused = !this.paused), this;
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
  transformFrames(k) {
    k = this.reversed ? this.options.duration - k : k;
    for (let j = 0; j < this.frames.length; j++) {
      const we = this.frames[j], { start: st, stop: Le } = we.time;
      if (k < st || k > Le)
        continue;
      const pt = scale(k, st, Le, 0, 1), hr = we.timingFunction(pt), br = {};
      for (const [Pr, Ir] of Object.entries(we.interpVars))
        reverseTransformObject(
          Pr,
          Ir.start.lerp(hr, Ir.stop, this.target),
          br
        );
      we.transform(k, br);
    }
  }
  interpFrames(k, j) {
    k = this.reversed ? this.options.duration - k : k;
    for (let we = 0; we < this.frames.length; we++) {
      const st = this.frames[we], { start: Le, stop: pt } = st.time;
      if (k < Le || k > pt)
        continue;
      const hr = scale(k, Le, pt, 0, 1), br = st.timingFunction(hr);
      for (const [Pr, Ir] of Object.entries(st.interpVars))
        j[Pr] = Ir.start.lerp(br, Ir.stop, this.target);
    }
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.pause(), await sleep(this.options.delay), this.pause()), this.started = !0;
  }
  onEnd() {
    this.options.fillMode === "forwards" || this.options.fillMode === "both" ? this.fillForwards() : (this.options.fillMode === "none" || this.options.fillMode === "backwards") && this.fillBackwards(), this.reset(), this.iteration === this.options.iterationCount - 1 ? (this.done = !0, this.iteration = 0) : this.iteration += 1;
  }
  tick(k) {
    if (this.startTime === void 0 && (this.onStart(), this.startTime = k + this.options.delay), this.paused && this.pausedTime === 0)
      return this.pausedTime = k, this.t;
    if (this.pausedTime > 0 && !this.paused) {
      const j = k - this.pausedTime;
      this.startTime += j, this.pausedTime = 0;
    }
    return this.t = k - this.startTime, this.t >= this.options.duration && (this.onEnd(), this.t = this.options.duration), this.t;
  }
  draw(k) {
    k = this.tick(k), !this.paused && (this.transformFrames(k), this.done || requestAnimationFrame(this.draw.bind(this)));
  }
  play() {
    requestAnimationFrame(this.draw.bind(this));
  }
}
function reverseTransformStyle(f, k) {
  for (const [j, we] of Object.entries(k))
    if (typeof we == "object") {
      let st = "";
      for (const [Le, pt] of Object.entries(we))
        st += pt.includes("(") ? pt : `${Le}(${pt}) `;
      k[j] = st;
    }
  return k;
}
function transformTargetsStyle(f, k, j) {
  const we = {};
  for (const [st, Le] of Object.entries(k))
    if (typeof Le == "object") {
      let pt = "";
      for (const [hr, br] of Object.entries(Le))
        pt += br.includes("(") ? br : `${hr}(${br})`;
      we[st] = pt;
    } else
      we[st] = Le;
  j.forEach((st) => {
    Object.assign(st.style, we);
  });
}
class CSSKeyframesAnimation {
  constructor(k = {}, ...j) {
    rn(this, "options");
    rn(this, "targets");
    rn(this, "animation");
    this.options = { ...defaultOptions, ...k }, this.targets = j;
  }
  addTargets(...k) {
    return this.targets = k, this.animation && (this.animation.target = k[0]), this;
  }
  initAnimation() {
    var k;
    return this.animation = new Animation(this.options, (k = this.targets) == null ? void 0 : k[0]), this.options = this.animation.options, this;
  }
  fromFramesDefaultTransform(k) {
    this.initAnimation();
    for (const [j, we] of Object.entries(k))
      this.animation.frame(
        parseCSSPercent(j),
        we,
        this.transform.bind(this)
      );
    return this.animation.parse(), this;
  }
  fromVars(k, j) {
    this.initAnimation(), j = j ?? this.transform.bind(this);
    for (let we = 0; we < k.length; we++) {
      const st = k[we], Le = Math.round(we / (k.length - 1) * 100);
      this.animation.frame(Le, st, j);
    }
    return this.animation.parse(), this;
  }
  fromFrames(k) {
    this.initAnimation();
    for (const [j, we, st, Le] of k)
      this.animation.frame(
        j,
        we,
        st,
        getTimingFunction(Le)
      );
    return this.animation.parse(), this;
  }
  fromCSSKeyframes(k, j) {
    this.initAnimation(), j = j ?? this.transform.bind(this);
    const we = typeof k == "string" ? parseCSSKeyframes(k) : k;
    for (const [st, Le] of Object.entries(we))
      this.animation.frame(Number(st), Le, j), this.animation.transformedVars.push(Le);
    return this.animation.parseFrames(), this;
  }
  transform(k, j) {
    transformTargetsStyle(k, j, this.targets);
  }
  play() {
    return this.animation.play();
  }
  pause() {
    return this.animation.pause(), this;
  }
}
class AnimationGroup {
  constructor(...k) {
    rn(this, "animationGroup", []);
    rn(this, "transform");
    rn(this, "paused", !1);
    rn(this, "started", !1);
    rn(this, "done", !1);
    this.transform = k[0].frames[0].transform;
    for (const j of k)
      this.animationGroup.push({
        values: {},
        animation: j
      });
  }
  reset() {
    return this.animationGroup.forEach((k) => {
      k.animation.reset();
    }), this.started = !1, this.done = !1, this.paused = !1, this;
  }
  onStart() {
    return this.started = !0, this;
  }
  onEnd() {
    return this.reset(), this.done = !0, this;
  }
  pause() {
    const k = this.paused;
    return this.started && (this.paused = !this.paused, this.animationGroup.forEach((j) => {
      j.animation.pause(!1);
    })), k && requestAnimationFrame(this.draw.bind(this)), this;
  }
  transformFrames(k) {
    let j = {}, we = !0;
    for (const Le of this.animationGroup) {
      const { animation: pt, values: hr } = Le;
      we = we && pt.done, pt.done || pt.paused || pt.interpFrames(pt.t, hr), j = { ...hr, ...j };
    }
    this.done = we;
    const st = {};
    return Object.entries(j).forEach(([Le, pt]) => {
      reverseTransformObject(Le, pt, st);
    }), this.transform(k, st), st;
  }
  tick(k) {
    this.started || this.onStart();
    for (const j of this.animationGroup)
      (!j.animation.paused || j.animation.pausedTime === 0) && j.animation.tick(k);
    return this.done && this.onEnd(), this;
  }
  draw(k) {
    this.tick(k), !this.paused && (this.transformFrames(k), this.done || requestAnimationFrame(this.draw.bind(this)));
  }
  play() {
    return this.onStart(), requestAnimationFrame(this.draw.bind(this)), this;
  }
}
function objectToString(f, k) {
  return typeof k == "object" && !(k instanceof ValueArray) ? Object.entries(k).map(([j, we]) => we instanceof FunctionValue ? String(we) : `${j}(${we})`).join(" ") : String(k);
}
function CSSKeyframesToString(f, k = "animation", j = 80) {
  var Pn;
  const we = f.options, st = /* @__PURE__ */ new Map();
  f.templateFrames.forEach((fn) => {
    let nn = `{
`;
    const Mr = {};
    Object.entries(fn.vars).forEach(([zr, mn]) => {
      reverseTransformObject(zr, mn, Mr);
    });
    for (let [zr, mn] of Object.entries(Mr)) {
      zr = camelCaseToHyphen(zr);
      let qr = objectToString(zr, mn);
      nn += `  ${zr}: ${qr};
`;
    }
    nn += `  }
`, st.has(nn) ? st.get(nn).push(fn.start) : st.set(nn, [fn.start]);
  });
  let Le = "";
  for (let [fn, nn] of st)
    Le += `${nn.join(", ")} ${fn}`;
  let pt = `.${k} {
`;
  pt += `  animation-name: ${k};
`;
  const hr = reverseCSSTime(we.duration);
  pt += `  animation-duration: ${hr};
`;
  let br = ((Pn = Object.entries(timingFunctions).filter(([fn, nn]) => nn === we.timingFunction).map(([fn]) => fn)) == null ? void 0 : Pn[0]) ?? "linear";
  pt += `  animation-timing-function: ${br};
`, pt += `  animation-iteration-count: ${isFinite(we.iterationCount) ? we.iterationCount : "infinite"};
`, pt += `  animation-direction: ${we.direction};
`, pt += `  animation-fill-mode: ${we.fillMode};
`, we.delay > 0 && (pt += `  animation-delay: ${reverseCSSTime(we.delay)};
`), pt += `}
`;
  const Pr = `${pt}
@keyframes ${k} {
${Le}}`;
  return prettier.format(Pr, {
    parser: "css",
    plugins: [parserPostCSS],
    printWidth: j
  }).replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
}
export {
  Animation,
  AnimationGroup,
  CSSKeyframesAnimation,
  CSSKeyframesToString,
  parseTemplateFrame,
  reverseTransformStyle
};
