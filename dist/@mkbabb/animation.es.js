function clamp(x, lowerLimit, upperLimit) {
  if (x < lowerLimit) {
    return lowerLimit;
  } else if (x > upperLimit) {
    return upperLimit;
  }
  return x;
}
function lerpIn(t, from, distance, duration) {
  return distance * (t /= duration) + from;
}
function lerp(t, from, to) {
  return (1 - t) * from + t * to;
}
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
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
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
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
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
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
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r === max)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
function percentageHandler(input, scale) {
  const value = parseFloat(input.slice(0, -1));
  if (scale) {
    return {
      value: value / 100 * scale,
      unit: "px"
    };
  } else {
    return {
      value,
      unit: "%"
    };
  }
}
function pxHandler(input) {
  const value = parseFloat(input.slice(0, -2));
  return {
    value,
    unit: "px"
  };
}
function remHandler(input) {
  const value = parseFloat(input.slice(0, -3));
  return {
    value,
    unit: "rem"
  };
}
function transformValue(input) {
  var _a;
  if (typeof input === "number") {
    return {
      value: input,
      unit: ""
    };
  }
  if (input.endsWith("%")) {
    return percentageHandler(input);
  } else if (input.endsWith("rem")) {
    return remHandler(input);
  } else if (input.endsWith("px")) {
    return pxHandler(input);
  } else {
    const c = (_a = color(input)) == null ? void 0 : _a.rgb();
    if (c != null) {
      return {
        value: c,
        unit: "color"
      };
    }
    return {
      value: parseFloat(input),
      unit: ""
    };
  }
}
function transformObject(input) {
  if (typeof input === "object") {
    const output = {};
    for (const [key, value] of Object.entries(input)) {
      output[key] = transformObject(value);
    }
    return output;
  }
  return transformValue(input);
}
function reverseTransformObject(input) {
  if (typeof input === "object" && (input == null ? void 0 : input.value) == null && (input == null ? void 0 : input.unit) == null) {
    const output = {};
    for (const [key, value2] of Object.entries(input)) {
      output[key] = reverseTransformObject(value2);
    }
    return output;
  }
  const { value, unit } = input;
  if (unit === "") {
    return value;
  } else if (unit === "color") {
    const c = value;
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
  } else {
    return `${value}${unit}`;
  }
}
function interpolateObject(t, start, stop) {
  if (typeof start === "object") {
    const output = {};
    for (const key of Object.keys(start)) {
      output[key] = interpolateObject(t, start[key], stop[key]);
    }
    return output;
  } else if (typeof start === "number" && typeof stop === "number") {
    return lerp(t, start, stop);
  }
  return start;
}
function animationLoop(drawFunc) {
  function animationLoop2(t) {
    if (drawFunc(t)) {
      return;
    } else {
      requestAnimationFrame(animationLoop2);
    }
  }
  requestAnimationFrame(animationLoop2);
}
function calcFrameTime(startFrame, endFrame, duration) {
  let [start, stop] = [startFrame.start, endFrame.start];
  start = start * duration / 100;
  stop = stop * duration / 100;
  return {
    start,
    stop,
    distance: stop - start
  };
}
function parseTemplateFrame(ix, templateFrames, transformedFrameVars, duration, frames) {
  var _a, _b;
  const [startFrame, endFrame] = [templateFrames[ix], templateFrames[ix + 1]];
  const time = calcFrameTime(startFrame, endFrame, duration);
  const interpVarValues = {};
  const allVars = [
    .../* @__PURE__ */ new Set([...Object.keys(startFrame.vars), ...Object.keys(endFrame.vars)])
  ];
  const createInterpVarValue = (v, startIx, endIx) => {
    return {
      start: transformedFrameVars[startIx][v],
      stop: transformedFrameVars[endIx][v]
    };
  };
  allVars.forEach((v) => {
    if (v in startFrame.vars && v in endFrame.vars) {
      interpVarValues[v] = createInterpVarValue(v, ix, ix + 1);
    } else if (!(v in startFrame.vars) && v in endFrame.vars) {
      for (let i = ix - 1; i >= 0; i--) {
        if (v in templateFrames[i].vars) {
          const oldFrame = frames[i];
          oldFrame.time = calcFrameTime(templateFrames[i], endFrame, duration);
          oldFrame.interpVarValues[v] = createInterpVarValue(v, i, ix + 1);
          break;
        }
      }
    }
  });
  return {
    id: startFrame.id,
    time,
    interpVarValues,
    transform: (_a = startFrame == null ? void 0 : startFrame.transform) != null ? _a : () => {
    },
    ease: (_b = startFrame == null ? void 0 : startFrame.ease) != null ? _b : lerpIn
  };
}
class Animation {
  constructor(duration) {
    this.duration = duration;
    this.templateFrames = [];
    this.frames = [];
    this.frameId = 0;
    this.prevId = 0;
  }
  from(start, vars) {
    if (this.frameId > 0 && this.templateFrame !== void 0) {
      this.templateFrames.push(this.templateFrame);
    }
    this.templateFrame = {
      id: this.frameId,
      start,
      vars
    };
    this.prevId = this.frameId;
    this.frameId += 1;
    return this;
  }
  transform(func) {
    if (this.templateFrame !== void 0) {
      this.templateFrame.transform = func;
    }
    return this;
  }
  ease(func) {
    if (this.templateFrame !== void 0) {
      this.templateFrame.ease = func;
    }
    return this;
  }
  done() {
    if (this.templateFrame !== void 0) {
      this.templateFrames.push(this.templateFrame);
      this.templateFrame = void 0;
    }
    this.templateFrames = this.templateFrames.sort((a, b) => a.start > b.start ? 1 : -1);
    const transformedFrameVars = this.templateFrames.map((frame) => transformObject(frame.vars));
    for (let i = 0; i < this.templateFrames.length - 1; i++) {
      const frame = parseTemplateFrame(i, this.templateFrames, transformedFrameVars, this.duration, this.frames);
      this.frames.push(frame);
    }
    return this;
  }
  reverse() {
    if (this.templateFrame !== void 0) {
      this.templateFrames.push(this.templateFrame);
      this.templateFrame = void 0;
    }
    const frameTimes = this.templateFrames.map((frame) => ({
      start: frame.start,
      transform: frame.transform,
      ease: frame.ease
    })).reverse();
    this.templateFrames.forEach((frame, i) => {
      frame.start = frameTimes[i].start;
      frame.transform = frameTimes[i].transform;
      frame.ease = frameTimes[i].ease;
    });
    this.templateFrames.reverse();
    return this;
  }
  async start() {
    let startTime = void 0;
    const drawFunc = (t) => {
      if (startTime === void 0) {
        startTime = t;
      }
      const dt = clamp(t - startTime, 0, this.duration);
      this.frames.filter((frame) => dt >= frame.time.start && dt <= frame.time.stop).forEach((frame) => {
        const { start, stop, distance } = frame.time;
        const t2 = frame.ease(dt - start, 0, 1, distance);
        const vars = {};
        Object.entries(frame.interpVarValues).forEach(([v, value]) => {
          vars[v] = interpolateObject(t2, value.start, value.stop);
        });
        frame.transform(t2, reverseTransformObject(vars));
      });
      return dt >= this.duration;
    };
    animationLoop(drawFunc);
    return await sleep(this.duration * 1.1);
  }
}
export { Animation, animationLoop, parseTemplateFrame };
