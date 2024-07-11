"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var createPlugin$2 = {};
var createPlugin$1 = {};
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  Object.defineProperty(exports2, "default", {
    enumerable: true,
    get: function() {
      return _default;
    }
  });
  function createPlugin2(plugin3, config2) {
    return {
      handler: plugin3,
      config: config2
    };
  }
  createPlugin2.withOptions = function(pluginFunction, configFunction = () => ({})) {
    const optionsFunction = function(options) {
      return {
        __options: options,
        handler: pluginFunction(options),
        config: configFunction(options)
      };
    };
    optionsFunction.__isOptionsFunction = true;
    optionsFunction.__pluginFunction = pluginFunction;
    optionsFunction.__configFunction = configFunction;
    return optionsFunction;
  };
  const _default = createPlugin2;
})(createPlugin$1);
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  Object.defineProperty(exports2, "default", {
    enumerable: true,
    get: function() {
      return _default;
    }
  });
  const _createPlugin = /* @__PURE__ */ _interop_require_default(createPlugin$1);
  function _interop_require_default(obj2) {
    return obj2 && obj2.__esModule ? obj2 : {
      default: obj2
    };
  }
  const _default = _createPlugin.default;
})(createPlugin$2);
let createPlugin = createPlugin$2;
var plugin$2 = (createPlugin.__esModule ? createPlugin : { default: createPlugin }).default;
const plugin$1 = plugin$2;
function filterDefault(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => key !== "DEFAULT")
  );
}
var tailwindcssAnimate = plugin$1(
  ({ addUtilities, matchUtilities, theme }) => {
    addUtilities({
      "@keyframes enter": theme("keyframes.enter"),
      "@keyframes exit": theme("keyframes.exit"),
      ".animate-in": {
        animationName: "enter",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-enter-opacity": "initial",
        "--tw-enter-scale": "initial",
        "--tw-enter-rotate": "initial",
        "--tw-enter-translate-x": "initial",
        "--tw-enter-translate-y": "initial"
      },
      ".animate-out": {
        animationName: "exit",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-exit-opacity": "initial",
        "--tw-exit-scale": "initial",
        "--tw-exit-rotate": "initial",
        "--tw-exit-translate-x": "initial",
        "--tw-exit-translate-y": "initial"
      }
    });
    matchUtilities(
      {
        "fade-in": (value2) => ({ "--tw-enter-opacity": value2 }),
        "fade-out": (value2) => ({ "--tw-exit-opacity": value2 })
      },
      { values: theme("animationOpacity") }
    );
    matchUtilities(
      {
        "zoom-in": (value2) => ({ "--tw-enter-scale": value2 }),
        "zoom-out": (value2) => ({ "--tw-exit-scale": value2 })
      },
      { values: theme("animationScale") }
    );
    matchUtilities(
      {
        "spin-in": (value2) => ({ "--tw-enter-rotate": value2 }),
        "spin-out": (value2) => ({ "--tw-exit-rotate": value2 })
      },
      { values: theme("animationRotate") }
    );
    matchUtilities(
      {
        "slide-in-from-top": (value2) => ({
          "--tw-enter-translate-y": `-${value2}`
        }),
        "slide-in-from-bottom": (value2) => ({
          "--tw-enter-translate-y": value2
        }),
        "slide-in-from-left": (value2) => ({
          "--tw-enter-translate-x": `-${value2}`
        }),
        "slide-in-from-right": (value2) => ({
          "--tw-enter-translate-x": value2
        }),
        "slide-out-to-top": (value2) => ({
          "--tw-exit-translate-y": `-${value2}`
        }),
        "slide-out-to-bottom": (value2) => ({
          "--tw-exit-translate-y": value2
        }),
        "slide-out-to-left": (value2) => ({
          "--tw-exit-translate-x": `-${value2}`
        }),
        "slide-out-to-right": (value2) => ({
          "--tw-exit-translate-x": value2
        })
      },
      { values: theme("animationTranslate") }
    );
    matchUtilities(
      { duration: (value2) => ({ animationDuration: value2 }) },
      { values: filterDefault(theme("animationDuration")) }
    );
    matchUtilities(
      { delay: (value2) => ({ animationDelay: value2 }) },
      { values: theme("animationDelay") }
    );
    matchUtilities(
      { ease: (value2) => ({ animationTimingFunction: value2 }) },
      { values: filterDefault(theme("animationTimingFunction")) }
    );
    addUtilities({
      ".running": { animationPlayState: "running" },
      ".paused": { animationPlayState: "paused" }
    });
    matchUtilities(
      { "fill-mode": (value2) => ({ animationFillMode: value2 }) },
      { values: theme("animationFillMode") }
    );
    matchUtilities(
      { direction: (value2) => ({ animationDirection: value2 }) },
      { values: theme("animationDirection") }
    );
    matchUtilities(
      { repeat: (value2) => ({ animationIterationCount: value2 }) },
      { values: theme("animationRepeat") }
    );
  },
  {
    theme: {
      extend: {
        animationDelay: ({ theme }) => ({
          ...theme("transitionDelay")
        }),
        animationDuration: ({ theme }) => ({
          0: "0ms",
          ...theme("transitionDuration")
        }),
        animationTimingFunction: ({ theme }) => ({
          ...theme("transitionTimingFunction")
        }),
        animationFillMode: {
          none: "none",
          forwards: "forwards",
          backwards: "backwards",
          both: "both"
        },
        animationDirection: {
          normal: "normal",
          reverse: "reverse",
          alternate: "alternate",
          "alternate-reverse": "alternate-reverse"
        },
        animationOpacity: ({ theme }) => ({
          DEFAULT: 0,
          ...theme("opacity")
        }),
        animationTranslate: ({ theme }) => ({
          DEFAULT: "100%",
          ...theme("translate")
        }),
        animationScale: ({ theme }) => ({
          DEFAULT: 0,
          ...theme("scale")
        }),
        animationRotate: ({ theme }) => ({
          DEFAULT: "30deg",
          ...theme("rotate")
        }),
        animationRepeat: {
          0: "0",
          1: "1",
          infinite: "infinite"
        },
        keyframes: {
          enter: {
            from: {
              opacity: "var(--tw-enter-opacity, 1)",
              transform: "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))"
            }
          },
          exit: {
            to: {
              opacity: "var(--tw-exit-opacity, 1)",
              transform: "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))"
            }
          }
        }
      }
    }
  }
);
const index$1 = /* @__PURE__ */ getDefaultExportFromCjs(tailwindcssAnimate);
const animate = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: index$1
}, [tailwindcssAnimate]);
const config$1 = {
  // disable pre-flight
  corePlugins: {
    preflight: false
  },
  darkMode: ["selector"],
  safelist: ["dark"],
  prefix: "",
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./demo/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        shadow: {
          DEFAULT: "hsl(var(--shadow))"
        }
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" }
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out"
      }
    }
  },
  plugins: [animate]
};
class ValueUnit {
  constructor(value2, unit, superType, subProperty, property, targets) {
    this.value = value2;
    this.unit = unit;
    this.superType = superType;
    this.subProperty = subProperty;
    this.property = property;
    this.targets = targets;
  }
  setSubProperty(subProperty) {
    this.subProperty = subProperty;
  }
  setProperty(property) {
    this.property = property;
  }
  setTargets(targets) {
    this.targets = targets;
  }
  valueOf() {
    if (!this.unit) {
      return this.value;
    }
    return this.toString();
  }
  toString() {
    var _a;
    if (this.value == null) {
      return "";
    }
    if (this.unit == null || this.unit === "string") {
      return `${this.value}`;
    }
    if (this.unit === "color") {
      const values = Object.values(this.value);
      const name = ((_a = this.superType) == null ? void 0 : _a[1]) ?? "rgb";
      return `${name}(${values.join(", ")})`;
    } else if (this.unit === "var") {
      return `var(${this.value})`;
    } else if (this.unit === "calc") {
      return `calc(${this.value})`;
    } else {
      return `${this.value}${this.unit}`;
    }
  }
  toJSON() {
    return this.valueOf();
  }
  clone() {
    return new ValueUnit(
      this.value,
      this.unit,
      this.superType,
      this.subProperty,
      this.property
    );
  }
}
class FunctionValue {
  constructor(name, args) {
    this.name = name;
    this.args = args;
    args.forEach((v) => {
      this.setSubProperty(name);
    });
  }
  setSubProperty(subProperty) {
    this.args.forEach((v) => v.setSubProperty(subProperty));
  }
  setProperty(property) {
    this.args.forEach((v) => v.setProperty(property));
  }
  setTargets(targets) {
    this.args.forEach((v) => v.setTargets(targets));
  }
  valueOf() {
    return this.args.map((v) => v.valueOf());
  }
  toString() {
    return `${this.name}(${this.args.map((v) => v.toString()).join(", ")})`;
  }
  toJSON() {
    return {
      [this.name]: this.args.map((v) => v.toJSON())
    };
  }
  clone() {
    return new FunctionValue(
      this.name,
      this.args.map((v) => v.clone())
    );
  }
}
class ValueArray extends Array {
  constructor(...args) {
    super(...args);
  }
  setSubProperty(subProperty) {
    this.forEach((v) => v.setSubProperty(subProperty));
  }
  setProperty(property) {
    this.forEach((v) => v.setProperty(property));
  }
  setTargets(targets) {
    this.forEach((v) => v.setTargets(targets));
  }
  valueOf() {
    return this.map((v) => v.valueOf());
  }
  toString() {
    return this.map((v) => v.toString()).join(" ");
  }
  toJSON() {
    return this.map((v) => v.toJSON());
  }
  clone() {
    return new ValueArray(...this.map((v) => v.clone()));
  }
}
function clamp(value2, min, max2) {
  return Math.min(Math.max(value2, min), max2);
}
function scale(value2, fromMin, fromMax, toMin = 0, toMax = 1) {
  const slope = (toMax - toMin) / (fromMax - fromMin);
  return (value2 - fromMin) * slope + toMin;
}
function lerp(t, start, end) {
  return (1 - t) * start + t * end;
}
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
function create$2() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
function fromValues$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2];
  var a10 = a[3], a11 = a[4], a12 = a[5];
  var a20 = a[6], a21 = a[7], a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;
  var det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
function create$1() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function fromValues(x2, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x2;
  out[1] = y;
  out[2] = z;
  return out;
}
function transformMat3(out, a, m) {
  var x2 = a[0], y = a[1], z = a[2];
  out[0] = x2 * m[0] + y * m[3] + z * m[6];
  out[1] = x2 * m[1] + y * m[4] + z * m[7];
  out[2] = x2 * m[2] + y * m[5] + z * m[8];
  return out;
}
(function() {
  var vec = create$1();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
})();
const HEX_BASE = 16;
const RGBA_MAX = 255;
const hex2rgb = (hex) => {
  hex = hex.slice(1);
  if (hex.length <= 4) {
    const r2 = parseInt(hex[0] + hex[0], HEX_BASE);
    const g = parseInt(hex[1] + hex[1], HEX_BASE);
    const b = parseInt(hex[2] + hex[2], HEX_BASE);
    const alpha = hex[3] ? parseInt(hex[3] + hex[3], HEX_BASE) / RGBA_MAX : 1;
    return { r: r2, g, b, alpha };
  } else {
    const r2 = parseInt(hex.slice(0, 2), HEX_BASE);
    const g = parseInt(hex.slice(2, 4), HEX_BASE);
    const b = parseInt(hex.slice(4, 6), HEX_BASE);
    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), HEX_BASE) / RGBA_MAX : 1;
    return { r: r2, g, b, alpha };
  }
};
const MIN_TEMP = 1e3;
const MAX_TEMP = 4e4;
const TEMP_SCALE = 100;
const kelvin2rgb = (temp, alpha = 1) => {
  temp = clamp(temp, MIN_TEMP, MAX_TEMP) / TEMP_SCALE;
  let r2, g, b;
  if (temp <= 66) {
    r2 = RGBA_MAX;
  } else {
    r2 = temp - 60;
    r2 = 329.698727446 * r2 ** -0.1332047592;
  }
  r2 = clamp(r2, 0, RGBA_MAX) / RGBA_MAX;
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * g ** -0.0755148492;
  }
  g = clamp(g, 0, RGBA_MAX) / RGBA_MAX;
  if (temp >= 66) {
    b = RGBA_MAX;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
  }
  b = clamp(b, 0, RGBA_MAX) / RGBA_MAX;
  return { r: r2, g, b, alpha };
};
const hsv2hsl = (h, s2, v, alpha = 1) => {
  const l = v - v * s2 / 2;
  let sl;
  if (l === 0 || l === 1) {
    sl = 0;
  } else {
    sl = (v - l) / Math.min(l, 1 - l);
  }
  return { h, s: sl, l, alpha };
};
const hwb2hsl = (h, w, b, alpha = 1) => {
  const v = 1 - b;
  let sv;
  if (v === 0) {
    sv = 0;
  } else {
    sv = 1 - w / v;
  }
  return hsv2hsl(h, sv, v, alpha);
};
function hsl2rgb(h, s2, l, alpha = 1) {
  const c = (1 - Math.abs(2 * l - 1)) * s2;
  const x2 = c * (1 - Math.abs(h * 6 % 2 - 1));
  const m = l - c / 2;
  let r2, g, b;
  if (h < 1 / 6) {
    [r2, g, b] = [c, x2, 0];
  } else if (h < 2 / 6) {
    [r2, g, b] = [x2, c, 0];
  } else if (h < 3 / 6) {
    [r2, g, b] = [0, c, x2];
  } else if (h < 4 / 6) {
    [r2, g, b] = [0, x2, c];
  } else if (h < 5 / 6) {
    [r2, g, b] = [x2, 0, c];
  } else {
    [r2, g, b] = [c, 0, x2];
  }
  return {
    r: r2 + m,
    g: g + m,
    b: b + m,
    alpha
  };
}
const WHITE_POINT_D65 = fromValues(
  ...[
    0.95047,
    // X
    1,
    // Y
    1.08883
    // Z
  ]
);
const LAB_EPSILON = 8856e-6;
const LAB_KAPPA = 903.3;
const LAB_OFFSET = 16;
const LAB_SCALE_L = 116;
const LAB_SCALE_A = 500;
const LAB_SCALE_B = 200;
function xyz2lab(x2, y, z, alpha = 1) {
  const xr = x2 / WHITE_POINT_D65[0];
  const yr = y / WHITE_POINT_D65[1];
  const zr = z / WHITE_POINT_D65[2];
  const fx = xr > LAB_EPSILON ? Math.cbrt(xr) : (LAB_KAPPA * xr + LAB_OFFSET) / LAB_SCALE_L;
  const fy = yr > LAB_EPSILON ? Math.cbrt(yr) : (LAB_KAPPA * yr + LAB_OFFSET) / LAB_SCALE_L;
  const fz = zr > LAB_EPSILON ? Math.cbrt(zr) : (LAB_KAPPA * zr + LAB_OFFSET) / LAB_SCALE_L;
  const l = LAB_SCALE_L * fy - LAB_OFFSET;
  const a = LAB_SCALE_A * (fx - fy);
  const b = LAB_SCALE_B * (fy - fz);
  return { l, a, b, alpha };
}
const RGB_XYZ_MATRIX = fromValues$1(
  ...[0.4124564, 0.3575761, 0.1804375],
  ...[0.2126729, 0.7151522, 0.072175],
  ...[0.0193339, 0.119192, 0.9503041]
);
transpose(RGB_XYZ_MATRIX, RGB_XYZ_MATRIX);
const XYZ_RGB_MATRIX = create$2();
invert(XYZ_RGB_MATRIX, RGB_XYZ_MATRIX);
const SRGB_GAMMA = 2.4;
const SRGB_OFFSET = 0.055;
const SRGB_SLOPE = 12.92;
const SRGB_TRANSITION = 0.04045;
function srgbToLinear(channel) {
  if (channel <= SRGB_TRANSITION) {
    return channel / SRGB_SLOPE;
  } else {
    return ((channel + SRGB_OFFSET) / (1 + SRGB_OFFSET)) ** SRGB_GAMMA;
  }
}
function rgb2xyz(r2, g, b, alpha = 1) {
  const linearRGB = fromValues(
    srgbToLinear(r2),
    srgbToLinear(g),
    srgbToLinear(b)
  );
  const result2 = create$1();
  transformMat3(result2, linearRGB, RGB_XYZ_MATRIX);
  const [x2, y, z] = result2;
  return { x: x2, y, z, alpha };
}
function rgb2lab(r2, g, b, alpha = 1) {
  const { x: x2, y, z } = rgb2xyz(r2, g, b, alpha);
  return xyz2lab(x2, y, z, alpha);
}
function hsl2lab(h, s2, l, alpha = 1) {
  const { r: r2, g, b } = hsl2rgb(h, s2, l, alpha);
  return rgb2lab(r2, g, b, alpha);
}
function hsv2lab(h, s2, v, alpha = 1) {
  const { h: hh, s: ss, l } = hsv2hsl(h, s2, v, alpha);
  return hsl2lab(hh, ss, l, alpha);
}
function hwb2lab(h, w, b, alpha = 1) {
  const { h: hh, s: s2, l } = hwb2hsl(h, w, b, alpha);
  return hsl2lab(hh, s2, l, alpha);
}
function lch2lab(l, c, h, alpha = 1) {
  const hRad = h * 2 * Math.PI;
  return {
    l,
    a: Math.cos(hRad) * c,
    b: Math.sin(hRad) * c,
    alpha
  };
}
const LMS_TO_XYZ_MATRIX = fromValues$1(
  ...[0.8189330101, 0.0329845436, 0.0482003018],
  ...[0.3618667424, 0.9293118715, 0.2643662691],
  ...[-0.1288597137, 0.0361456387, 0.633851707]
);
transpose(LMS_TO_XYZ_MATRIX, LMS_TO_XYZ_MATRIX);
const XYZ_TO_LMS_MATRIX = create$2();
invert(XYZ_TO_LMS_MATRIX, LMS_TO_XYZ_MATRIX);
const LMS_TO_OKLAB_MATRIX = fromValues$1(
  ...[0.2104542553, 0.793617785, -0.0040720468],
  ...[1.9779984951, -2.428592205, 0.4505937099],
  ...[0.0259040371, 0.7827717662, -0.808675766]
);
transpose(LMS_TO_OKLAB_MATRIX, LMS_TO_OKLAB_MATRIX);
const OKLAB_TO_LMS_MATRIX = create$2();
invert(OKLAB_TO_LMS_MATRIX, LMS_TO_OKLAB_MATRIX);
function oklab2xyz(l, a, b, alpha = 1) {
  const lms = create$1();
  transformMat3(lms, fromValues(l, a, b), OKLAB_TO_LMS_MATRIX);
  lms.forEach((value2, index2) => {
    lms[index2] = value2 ** 3;
  });
  const xyz = create$1();
  transformMat3(xyz, lms, LMS_TO_XYZ_MATRIX);
  return { x: xyz[0], y: xyz[1], z: xyz[2], alpha };
}
function oklab2lab(l, a, b, alpha = 1) {
  const { x: x2, y, z } = oklab2xyz(l, a, b, alpha);
  return xyz2lab(x2, y, z, alpha);
}
function oklch2lab(l, c, h, alpha = 1) {
  const hRadians = h * 2 * Math.PI;
  const a = c * Math.cos(hRadians);
  const b = c * Math.sin(hRadians);
  return oklab2lab(l, a, b, alpha);
}
const COLOR_RANGES = {
  RGB: {
    r: { min: 0, max: 255 },
    g: { min: 0, max: 255 },
    b: { min: 0, max: 255 },
    percentage: { min: 0, max: 100 }
  },
  HSL: {
    h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
    s: { percentage: { min: 0, max: 100 } },
    l: { percentage: { min: 0, max: 100 } }
  },
  HSV: {
    h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
    s: { percentage: { min: 0, max: 100 } },
    v: { percentage: { min: 0, max: 100 } }
  },
  HWB: {
    h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
    w: { percentage: { min: 0, max: 100 } },
    b: { percentage: { min: 0, max: 100 } }
  },
  LAB: {
    l: { percentage: { min: 0, max: 100 } },
    a: { number: { min: -125, max: 125 }, percentage: { min: -100, max: 100 } },
    b: { number: { min: -125, max: 125 }, percentage: { min: -100, max: 100 } }
  },
  LCH: {
    l: { percentage: { min: 0, max: 100 } },
    c: { number: { min: 0, max: 230 }, percentage: { min: 0, max: 100 } },
    h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } }
  },
  OKLAB: {
    l: { percentage: { min: 0, max: 100 } },
    a: { number: { min: -0.4, max: 0.4 }, percentage: { min: -100, max: 100 } },
    b: { number: { min: -0.4, max: 0.4 }, percentage: { min: -100, max: 100 } }
  },
  OKLCH: {
    l: { percentage: { min: 0, max: 100 } },
    c: { number: { min: 0, max: 0.5 }, percentage: { min: 0, max: 100 } },
    h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } }
  },
  XYZ: {
    x: { percentage: { min: 0, max: 100 } },
    y: { percentage: { min: 0, max: 100 } },
    z: { percentage: { min: 0, max: 100 } }
  },
  ALPHA: { percentage: { min: 0, max: 100 } }
};
const normalizeValue = (value2, min, max2) => scale(value2, min, max2, 0, 1);
const normalizeAlpha = (v) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.ALPHA.percentage.min,
      COLOR_RANGES.ALPHA.percentage.max
    );
  return v.value;
};
const normalizeRGB = (v, component) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.RGB.percentage.min,
      COLOR_RANGES.RGB.percentage.max
    );
  return normalizeValue(
    v.value,
    COLOR_RANGES.RGB[component].min,
    COLOR_RANGES.RGB[component].max
  );
};
const normalizeHue = (v) => {
  if (v.unit === "deg")
    return normalizeValue(
      v.value,
      COLOR_RANGES.HSL.h.deg.min,
      COLOR_RANGES.HSL.h.deg.max
    );
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.HSL.h.percentage.min,
      COLOR_RANGES.HSL.h.percentage.max
    );
  return v.value;
};
const normalizeColorPercentage = (v) => normalizeValue(
  v.value,
  COLOR_RANGES.RGB.percentage.min,
  COLOR_RANGES.RGB.percentage.max
);
const normalizeAB = (v, component) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.LAB[component].percentage.min,
      COLOR_RANGES.LAB[component].percentage.max
    );
  return normalizeValue(
    v.value,
    COLOR_RANGES.LAB[component].number.min,
    COLOR_RANGES.LAB[component].number.max
  );
};
const normalizeC = (v) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.LCH.c.percentage.min,
      COLOR_RANGES.LCH.c.percentage.max
    );
  return normalizeValue(
    v.value,
    COLOR_RANGES.LCH.c.number.min,
    COLOR_RANGES.LCH.c.number.max
  );
};
const normalizeOKAB = (v, component) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.OKLAB[component].percentage.min,
      COLOR_RANGES.OKLAB[component].percentage.max
    );
  return normalizeValue(
    v.value,
    COLOR_RANGES.OKLAB[component].number.min,
    COLOR_RANGES.OKLAB[component].number.max
  );
};
const normalizeOKC = (v) => {
  if (v.unit === "%")
    return normalizeValue(
      v.value,
      COLOR_RANGES.OKLCH.c.percentage.min,
      COLOR_RANGES.OKLCH.c.percentage.max
    );
  return normalizeValue(
    v.value,
    COLOR_RANGES.OKLCH.c.number.min,
    COLOR_RANGES.OKLCH.c.number.max
  );
};
const normalizeRGBValueUnits = (rgb) => ({
  r: normalizeRGB(rgb.r, "r"),
  g: normalizeRGB(rgb.g, "g"),
  b: normalizeRGB(rgb.b, "b"),
  alpha: normalizeAlpha(rgb.alpha)
});
const normalizeHSLValueUnits = (hsl) => ({
  h: normalizeHue(hsl.h),
  s: normalizeColorPercentage(hsl.s),
  l: normalizeColorPercentage(hsl.l),
  alpha: normalizeAlpha(hsl.alpha)
});
const normalizeHSVValueUnits = (hsv) => ({
  h: normalizeHue(hsv.h),
  s: normalizeColorPercentage(hsv.s),
  v: normalizeColorPercentage(hsv.v),
  alpha: normalizeAlpha(hsv.alpha)
});
const normalizeHWBValueUnits = (hwb) => ({
  h: normalizeHue(hwb.h),
  w: normalizeColorPercentage(hwb.w),
  b: normalizeColorPercentage(hwb.b),
  alpha: normalizeAlpha(hwb.alpha)
});
const normalizeLABValueUnits = (lab) => ({
  l: normalizeColorPercentage(lab.l),
  a: normalizeAB(lab.a, "a"),
  b: normalizeAB(lab.b, "b"),
  alpha: normalizeAlpha(lab.alpha)
});
const normalizeLCHValueUnits = (lch) => ({
  l: normalizeColorPercentage(lch.l),
  c: normalizeC(lch.c),
  h: normalizeHue(lch.h),
  alpha: normalizeAlpha(lch.alpha)
});
const normalizeOKLABValueUnits = (oklab) => ({
  l: normalizeColorPercentage(oklab.l),
  a: normalizeOKAB(oklab.a, "a"),
  b: normalizeOKAB(oklab.b, "b"),
  alpha: normalizeAlpha(oklab.alpha)
});
const normalizeOKLCHValueUnits = (oklch) => ({
  l: normalizeColorPercentage(oklch.l),
  c: normalizeOKC(oklch.c),
  h: normalizeHue(oklch.h),
  alpha: normalizeAlpha(oklch.alpha)
});
const normalizeXYZValueUnits = (xyz) => ({
  x: normalizeColorPercentage(xyz.x),
  y: normalizeColorPercentage(xyz.y),
  z: normalizeColorPercentage(xyz.z),
  alpha: normalizeAlpha(xyz.alpha)
});
const normalizeColorUnit = (color2) => {
  var _a;
  const value2 = color2.value;
  const colorType = ((_a = color2.superType) == null ? void 0 : _a[1]) ?? "rgb";
  const normalizedValue = (() => {
    switch (colorType) {
      case "rgb":
        return normalizeRGBValueUnits(value2);
      case "hsl":
        return normalizeHSLValueUnits(value2);
      case "hsv":
        return normalizeHSVValueUnits(value2);
      case "hwb":
        return normalizeHWBValueUnits(value2);
      case "lab":
        return normalizeLABValueUnits(value2);
      case "lch":
        return normalizeLCHValueUnits(value2);
      case "oklab":
        return normalizeOKLABValueUnits(value2);
      case "oklch":
        return normalizeOKLCHValueUnits(value2);
      case "xyz":
        return normalizeXYZValueUnits(value2);
      default:
        return value2;
    }
  })();
  return new ValueUnit(
    normalizedValue,
    color2.unit,
    color2.superType ?? ["color", colorType],
    color2.subProperty,
    color2.property,
    color2.targets
  );
};
const normalizeColorUnitsToLAB = (a, b) => {
  const convertToLAB = (color2) => {
    const colorType = color2.superType[1];
    const value2 = color2.value;
    switch (colorType) {
      case "rgb":
        return rgb2lab(value2.r, value2.g, value2.b, value2.alpha);
      case "hsl":
        return hsl2lab(value2.h, value2.s, value2.l, value2.alpha);
      case "hsv":
        return hsv2lab(value2.h, value2.s, value2.v, value2.alpha);
      case "hwb":
        return hwb2lab(value2.h, value2.w, value2.b, value2.alpha);
      case "lab":
        return { l: value2.l, a: value2.a, b: value2.b, alpha: value2.alpha };
      case "lch":
        return lch2lab(value2.l, value2.c, value2.h, value2.alpha);
      case "oklab":
        return oklab2lab(value2.l, value2.a, value2.b, value2.alpha);
      case "oklch":
        return oklch2lab(value2.l, value2.c, value2.h, value2.alpha);
      case "xyz":
        return xyz2lab(value2.x, value2.y, value2.z, value2.alpha);
      default:
        throw new Error(`Unsupported color format: ${colorType}`);
    }
  };
  const [newA, newB] = [normalizeColorUnit(a), normalizeColorUnit(b)];
  const [LABA, LABB] = [convertToLAB(newA), convertToLAB(newB)];
  return [
    new ValueUnit(
      LABA,
      "color",
      ["color", "lab"],
      a.subProperty,
      a.property,
      a.targets
    ),
    new ValueUnit(
      LABB,
      "color",
      ["color", "lab"],
      b.subProperty,
      b.property,
      b.targets
    )
  ];
};
var parsimmon_umd_min = { exports: {} };
(function(module2, exports2) {
  !function(n, t) {
    module2.exports = t();
  }("undefined" != typeof self ? self : commonjsGlobal, function() {
    return function(n) {
      var t = {};
      function r2(e) {
        if (t[e])
          return t[e].exports;
        var u = t[e] = { i: e, l: false, exports: {} };
        return n[e].call(u.exports, u, u.exports, r2), u.l = true, u.exports;
      }
      return r2.m = n, r2.c = t, r2.d = function(n2, t2, e) {
        r2.o(n2, t2) || Object.defineProperty(n2, t2, { configurable: false, enumerable: true, get: e });
      }, r2.r = function(n2) {
        Object.defineProperty(n2, "__esModule", { value: true });
      }, r2.n = function(n2) {
        var t2 = n2 && n2.__esModule ? function() {
          return n2.default;
        } : function() {
          return n2;
        };
        return r2.d(t2, "a", t2), t2;
      }, r2.o = function(n2, t2) {
        return Object.prototype.hasOwnProperty.call(n2, t2);
      }, r2.p = "", r2(r2.s = 0);
    }([function(n, t, r2) {
      function e(n2) {
        if (!(this instanceof e))
          return new e(n2);
        this._ = n2;
      }
      var u = e.prototype;
      function o(n2, t2) {
        for (var r3 = 0; r3 < n2; r3++)
          t2(r3);
      }
      function i(n2, t2, r3) {
        return function(n3, t3) {
          o(t3.length, function(r4) {
            n3(t3[r4], r4, t3);
          });
        }(function(r4, e2, u2) {
          t2 = n2(t2, r4, e2, u2);
        }, r3), t2;
      }
      function a(n2, t2) {
        return i(function(t3, r3, e2, u2) {
          return t3.concat([n2(r3, e2, u2)]);
        }, [], t2);
      }
      function f(n2, t2) {
        var r3 = { v: 0, buf: t2 };
        return o(n2, function() {
          var n3;
          r3 = { v: r3.v << 1 | (n3 = r3.buf, n3[0] >> 7), buf: function(n4) {
            var t3 = i(function(n5, t4, r4, e2) {
              return n5.concat(r4 === e2.length - 1 ? Buffer.from([t4, 0]).readUInt16BE(0) : e2.readUInt16BE(r4));
            }, [], n4);
            return Buffer.from(a(function(n5) {
              return (n5 << 1 & 65535) >> 8;
            }, t3));
          }(r3.buf) };
        }), r3;
      }
      function c() {
        return "undefined" != typeof Buffer;
      }
      function s2() {
        if (!c())
          throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function l(n2) {
        s2();
        var t2 = i(function(n3, t3) {
          return n3 + t3;
        }, 0, n2);
        if (t2 % 8 != 0)
          throw new Error("The bits [" + n2.join(", ") + "] add up to " + t2 + " which is not an even number of bytes; the total should be divisible by 8");
        var r3, u2 = t2 / 8, o2 = (r3 = function(n3) {
          return n3 > 48;
        }, i(function(n3, t3) {
          return n3 || (r3(t3) ? t3 : n3);
        }, null, n2));
        if (o2)
          throw new Error(o2 + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new e(function(t3, r4) {
          var e2 = u2 + r4;
          return e2 > t3.length ? x2(r4, u2.toString() + " bytes") : b(e2, i(function(n3, t4) {
            var r5 = f(t4, n3.buf);
            return { coll: n3.coll.concat(r5.v), buf: r5.buf };
          }, { coll: [], buf: t3.slice(r4, e2) }, n2).coll);
        });
      }
      function h(n2, t2) {
        return new e(function(r3, e2) {
          return s2(), e2 + t2 > r3.length ? x2(e2, t2 + " bytes for " + n2) : b(e2 + t2, r3.slice(e2, e2 + t2));
        });
      }
      function p(n2, t2) {
        if ("number" != typeof (r3 = t2) || Math.floor(r3) !== r3 || t2 < 0 || t2 > 6)
          throw new Error(n2 + " requires integer length in range [0, 6].");
        var r3;
      }
      function d(n2) {
        return p("uintBE", n2), h("uintBE(" + n2 + ")", n2).map(function(t2) {
          return t2.readUIntBE(0, n2);
        });
      }
      function v(n2) {
        return p("uintLE", n2), h("uintLE(" + n2 + ")", n2).map(function(t2) {
          return t2.readUIntLE(0, n2);
        });
      }
      function g(n2) {
        return p("intBE", n2), h("intBE(" + n2 + ")", n2).map(function(t2) {
          return t2.readIntBE(0, n2);
        });
      }
      function m(n2) {
        return p("intLE", n2), h("intLE(" + n2 + ")", n2).map(function(t2) {
          return t2.readIntLE(0, n2);
        });
      }
      function y(n2) {
        return n2 instanceof e;
      }
      function E(n2) {
        return "[object Array]" === {}.toString.call(n2);
      }
      function w(n2) {
        return c() && Buffer.isBuffer(n2);
      }
      function b(n2, t2) {
        return { status: true, index: n2, value: t2, furthest: -1, expected: [] };
      }
      function x2(n2, t2) {
        return E(t2) || (t2 = [t2]), { status: false, index: -1, value: null, furthest: n2, expected: t2 };
      }
      function B(n2, t2) {
        if (!t2)
          return n2;
        if (n2.furthest > t2.furthest)
          return n2;
        var r3 = n2.furthest === t2.furthest ? function(n3, t3) {
          if (function() {
            if (void 0 !== e._supportsSet)
              return e._supportsSet;
            var n4 = "undefined" != typeof Set;
            return e._supportsSet = n4, n4;
          }() && Array.from) {
            for (var r4 = new Set(n3), u2 = 0; u2 < t3.length; u2++)
              r4.add(t3[u2]);
            var o2 = Array.from(r4);
            return o2.sort(), o2;
          }
          for (var i2 = {}, a2 = 0; a2 < n3.length; a2++)
            i2[n3[a2]] = true;
          for (var f2 = 0; f2 < t3.length; f2++)
            i2[t3[f2]] = true;
          var c2 = [];
          for (var s3 in i2)
            ({}).hasOwnProperty.call(i2, s3) && c2.push(s3);
          return c2.sort(), c2;
        }(n2.expected, t2.expected) : t2.expected;
        return { status: n2.status, index: n2.index, value: n2.value, furthest: t2.furthest, expected: r3 };
      }
      var j = {};
      function S(n2, t2) {
        if (w(n2))
          return { offset: t2, line: -1, column: -1 };
        n2 in j || (j[n2] = {});
        for (var r3 = j[n2], e2 = 0, u2 = 0, o2 = 0, i2 = t2; i2 >= 0; ) {
          if (i2 in r3) {
            e2 = r3[i2].line, 0 === o2 && (o2 = r3[i2].lineStart);
            break;
          }
          ("\n" === n2.charAt(i2) || "\r" === n2.charAt(i2) && "\n" !== n2.charAt(i2 + 1)) && (u2++, 0 === o2 && (o2 = i2 + 1)), i2--;
        }
        var a2 = e2 + u2, f2 = t2 - o2;
        return r3[t2] = { line: a2, lineStart: o2 }, { offset: t2, line: a2 + 1, column: f2 + 1 };
      }
      function _(n2) {
        if (!y(n2))
          throw new Error("not a parser: " + n2);
      }
      function L(n2, t2) {
        return "string" == typeof n2 ? n2.charAt(t2) : n2[t2];
      }
      function O(n2) {
        if ("number" != typeof n2)
          throw new Error("not a number: " + n2);
      }
      function k(n2) {
        if ("function" != typeof n2)
          throw new Error("not a function: " + n2);
      }
      function P2(n2) {
        if ("string" != typeof n2)
          throw new Error("not a string: " + n2);
      }
      var q = 2, A = 3, I = 8, F = 5 * I, M = 4 * I, z = "  ";
      function R(n2, t2) {
        return new Array(t2 + 1).join(n2);
      }
      function U(n2, t2, r3) {
        var e2 = t2 - n2.length;
        return e2 <= 0 ? n2 : R(r3, e2) + n2;
      }
      function W(n2, t2, r3, e2) {
        return { from: n2 - t2 > 0 ? n2 - t2 : 0, to: n2 + r3 > e2 ? e2 : n2 + r3 };
      }
      function D(n2, t2) {
        var r3, e2, u2, o2, f2, c2 = t2.index, s3 = c2.offset, l2 = 1;
        if (s3 === n2.length)
          return "Got the end of the input";
        if (w(n2)) {
          var h2 = s3 - s3 % I, p2 = s3 - h2, d2 = W(h2, F, M + I, n2.length), v2 = a(function(n3) {
            return a(function(n4) {
              return U(n4.toString(16), 2, "0");
            }, n3);
          }, function(n3, t3) {
            var r4 = n3.length, e3 = [], u3 = 0;
            if (r4 <= t3)
              return [n3.slice()];
            for (var o3 = 0; o3 < r4; o3++)
              e3[u3] || e3.push([]), e3[u3].push(n3[o3]), (o3 + 1) % t3 == 0 && u3++;
            return e3;
          }(n2.slice(d2.from, d2.to).toJSON().data, I));
          o2 = function(n3) {
            return 0 === n3.from && 1 === n3.to ? { from: n3.from, to: n3.to } : { from: n3.from / I, to: Math.floor(n3.to / I) };
          }(d2), e2 = h2 / I, r3 = 3 * p2, p2 >= 4 && (r3 += 1), l2 = 2, u2 = a(function(n3) {
            return n3.length <= 4 ? n3.join(" ") : n3.slice(0, 4).join(" ") + "  " + n3.slice(4).join(" ");
          }, v2), (f2 = (8 * (o2.to > 0 ? o2.to - 1 : o2.to)).toString(16).length) < 2 && (f2 = 2);
        } else {
          var g2 = n2.split(/\r\n|[\n\r\u2028\u2029]/);
          r3 = c2.column - 1, e2 = c2.line - 1, o2 = W(e2, q, A, g2.length), u2 = g2.slice(o2.from, o2.to), f2 = o2.to.toString().length;
        }
        var m2 = e2 - o2.from;
        return w(n2) && (f2 = (8 * (o2.to > 0 ? o2.to - 1 : o2.to)).toString(16).length) < 2 && (f2 = 2), i(function(t3, e3, u3) {
          var i2, a2 = u3 === m2, c3 = a2 ? "> " : z;
          return i2 = w(n2) ? U((8 * (o2.from + u3)).toString(16), f2, "0") : U((o2.from + u3 + 1).toString(), f2, " "), [].concat(t3, [c3 + i2 + " | " + e3], a2 ? [z + R(" ", f2) + " | " + U("", r3, " ") + R("^", l2)] : []);
        }, [], u2).join("\n");
      }
      function N(n2, t2) {
        return ["\n", "-- PARSING FAILED " + R("-", 50), "\n\n", D(n2, t2), "\n\n", (r3 = t2.expected, 1 === r3.length ? "Expected:\n\n" + r3[0] : "Expected one of the following: \n\n" + r3.join(", ")), "\n"].join("");
        var r3;
      }
      function G(n2) {
        return void 0 !== n2.flags ? n2.flags : [n2.global ? "g" : "", n2.ignoreCase ? "i" : "", n2.multiline ? "m" : "", n2.unicode ? "u" : "", n2.sticky ? "y" : ""].join("");
      }
      function C() {
        for (var n2 = [].slice.call(arguments), t2 = n2.length, r3 = 0; r3 < t2; r3 += 1)
          _(n2[r3]);
        return e(function(r4, e2) {
          for (var u2, o2 = new Array(t2), i2 = 0; i2 < t2; i2 += 1) {
            if (!(u2 = B(n2[i2]._(r4, e2), u2)).status)
              return u2;
            o2[i2] = u2.value, e2 = u2.index;
          }
          return B(b(e2, o2), u2);
        });
      }
      function J() {
        var n2 = [].slice.call(arguments);
        if (0 === n2.length)
          throw new Error("seqMap needs at least one argument");
        var t2 = n2.pop();
        return k(t2), C.apply(null, n2).map(function(n3) {
          return t2.apply(null, n3);
        });
      }
      function T() {
        var n2 = [].slice.call(arguments), t2 = n2.length;
        if (0 === t2)
          return Y("zero alternates");
        for (var r3 = 0; r3 < t2; r3 += 1)
          _(n2[r3]);
        return e(function(t3, r4) {
          for (var e2, u2 = 0; u2 < n2.length; u2 += 1)
            if ((e2 = B(n2[u2]._(t3, r4), e2)).status)
              return e2;
          return e2;
        });
      }
      function V(n2, t2) {
        return H(n2, t2).or(X([]));
      }
      function H(n2, t2) {
        return _(n2), _(t2), J(n2, t2.then(n2).many(), function(n3, t3) {
          return [n3].concat(t3);
        });
      }
      function K(n2) {
        P2(n2);
        var t2 = "'" + n2 + "'";
        return e(function(r3, e2) {
          var u2 = e2 + n2.length, o2 = r3.slice(e2, u2);
          return o2 === n2 ? b(u2, o2) : x2(e2, t2);
        });
      }
      function Q(n2, t2) {
        !function(n3) {
          if (!(n3 instanceof RegExp))
            throw new Error("not a regexp: " + n3);
          for (var t3 = G(n3), r4 = 0; r4 < t3.length; r4++) {
            var e2 = t3.charAt(r4);
            if ("i" !== e2 && "m" !== e2 && "u" !== e2 && "s" !== e2)
              throw new Error('unsupported regexp flag "' + e2 + '": ' + n3);
          }
        }(n2), arguments.length >= 2 ? O(t2) : t2 = 0;
        var r3 = function(n3) {
          return RegExp("^(?:" + n3.source + ")", G(n3));
        }(n2), u2 = "" + n2;
        return e(function(n3, e2) {
          var o2 = r3.exec(n3.slice(e2));
          if (o2) {
            if (0 <= t2 && t2 <= o2.length) {
              var i2 = o2[0], a2 = o2[t2];
              return b(e2 + i2.length, a2);
            }
            return x2(e2, "valid match group (0 to " + o2.length + ") in " + u2);
          }
          return x2(e2, u2);
        });
      }
      function X(n2) {
        return e(function(t2, r3) {
          return b(r3, n2);
        });
      }
      function Y(n2) {
        return e(function(t2, r3) {
          return x2(r3, n2);
        });
      }
      function Z(n2) {
        if (y(n2))
          return e(function(t2, r3) {
            var e2 = n2._(t2, r3);
            return e2.index = r3, e2.value = "", e2;
          });
        if ("string" == typeof n2)
          return Z(K(n2));
        if (n2 instanceof RegExp)
          return Z(Q(n2));
        throw new Error("not a string, regexp, or parser: " + n2);
      }
      function $(n2) {
        return _(n2), e(function(t2, r3) {
          var e2 = n2._(t2, r3), u2 = t2.slice(r3, e2.index);
          return e2.status ? x2(r3, 'not "' + u2 + '"') : b(r3, null);
        });
      }
      function nn(n2) {
        return k(n2), e(function(t2, r3) {
          var e2 = L(t2, r3);
          return r3 < t2.length && n2(e2) ? b(r3 + 1, e2) : x2(r3, "a character/byte matching " + n2);
        });
      }
      function tn(n2, t2) {
        arguments.length < 2 && (t2 = n2, n2 = void 0);
        var r3 = e(function(n3, e2) {
          return r3._ = t2()._, r3._(n3, e2);
        });
        return n2 ? r3.desc(n2) : r3;
      }
      function rn() {
        return Y("fantasy-land/empty");
      }
      u.parse = function(n2) {
        if ("string" != typeof n2 && !w(n2))
          throw new Error(".parse must be called with a string or Buffer as its argument");
        var t2, r3 = this.skip(an)._(n2, 0);
        return t2 = r3.status ? { status: true, value: r3.value } : { status: false, index: S(n2, r3.furthest), expected: r3.expected }, delete j[n2], t2;
      }, u.tryParse = function(n2) {
        var t2 = this.parse(n2);
        if (t2.status)
          return t2.value;
        var r3 = N(n2, t2), e2 = new Error(r3);
        throw e2.type = "ParsimmonError", e2.result = t2, e2;
      }, u.assert = function(n2, t2) {
        return this.chain(function(r3) {
          return n2(r3) ? X(r3) : Y(t2);
        });
      }, u.or = function(n2) {
        return T(this, n2);
      }, u.trim = function(n2) {
        return this.wrap(n2, n2);
      }, u.wrap = function(n2, t2) {
        return J(n2, this, t2, function(n3, t3) {
          return t3;
        });
      }, u.thru = function(n2) {
        return n2(this);
      }, u.then = function(n2) {
        return _(n2), C(this, n2).map(function(n3) {
          return n3[1];
        });
      }, u.many = function() {
        var n2 = this;
        return e(function(t2, r3) {
          for (var e2 = [], u2 = void 0; ; ) {
            if (!(u2 = B(n2._(t2, r3), u2)).status)
              return B(b(r3, e2), u2);
            if (r3 === u2.index)
              throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            r3 = u2.index, e2.push(u2.value);
          }
        });
      }, u.tieWith = function(n2) {
        return P2(n2), this.map(function(t2) {
          if (function(n3) {
            if (!E(n3))
              throw new Error("not an array: " + n3);
          }(t2), t2.length) {
            P2(t2[0]);
            for (var r3 = t2[0], e2 = 1; e2 < t2.length; e2++)
              P2(t2[e2]), r3 += n2 + t2[e2];
            return r3;
          }
          return "";
        });
      }, u.tie = function() {
        return this.tieWith("");
      }, u.times = function(n2, t2) {
        var r3 = this;
        return arguments.length < 2 && (t2 = n2), O(n2), O(t2), e(function(e2, u2) {
          for (var o2 = [], i2 = void 0, a2 = void 0, f2 = 0; f2 < n2; f2 += 1) {
            if (a2 = B(i2 = r3._(e2, u2), a2), !i2.status)
              return a2;
            u2 = i2.index, o2.push(i2.value);
          }
          for (; f2 < t2 && (a2 = B(i2 = r3._(e2, u2), a2), i2.status); f2 += 1)
            u2 = i2.index, o2.push(i2.value);
          return B(b(u2, o2), a2);
        });
      }, u.result = function(n2) {
        return this.map(function() {
          return n2;
        });
      }, u.atMost = function(n2) {
        return this.times(0, n2);
      }, u.atLeast = function(n2) {
        return J(this.times(n2), this.many(), function(n3, t2) {
          return n3.concat(t2);
        });
      }, u.map = function(n2) {
        k(n2);
        var t2 = this;
        return e(function(r3, e2) {
          var u2 = t2._(r3, e2);
          return u2.status ? B(b(u2.index, n2(u2.value)), u2) : u2;
        });
      }, u.contramap = function(n2) {
        k(n2);
        var t2 = this;
        return e(function(r3, e2) {
          var u2 = t2.parse(n2(r3.slice(e2)));
          return u2.status ? b(e2 + r3.length, u2.value) : u2;
        });
      }, u.promap = function(n2, t2) {
        return k(n2), k(t2), this.contramap(n2).map(t2);
      }, u.skip = function(n2) {
        return C(this, n2).map(function(n3) {
          return n3[0];
        });
      }, u.mark = function() {
        return J(en, this, en, function(n2, t2, r3) {
          return { start: n2, value: t2, end: r3 };
        });
      }, u.node = function(n2) {
        return J(en, this, en, function(t2, r3, e2) {
          return { name: n2, value: r3, start: t2, end: e2 };
        });
      }, u.sepBy = function(n2) {
        return V(this, n2);
      }, u.sepBy1 = function(n2) {
        return H(this, n2);
      }, u.lookahead = function(n2) {
        return this.skip(Z(n2));
      }, u.notFollowedBy = function(n2) {
        return this.skip($(n2));
      }, u.desc = function(n2) {
        E(n2) || (n2 = [n2]);
        var t2 = this;
        return e(function(r3, e2) {
          var u2 = t2._(r3, e2);
          return u2.status || (u2.expected = n2), u2;
        });
      }, u.fallback = function(n2) {
        return this.or(X(n2));
      }, u.ap = function(n2) {
        return J(n2, this, function(n3, t2) {
          return n3(t2);
        });
      }, u.chain = function(n2) {
        var t2 = this;
        return e(function(r3, e2) {
          var u2 = t2._(r3, e2);
          return u2.status ? B(n2(u2.value)._(r3, u2.index), u2) : u2;
        });
      }, u.concat = u.or, u.empty = rn, u.of = X, u["fantasy-land/ap"] = u.ap, u["fantasy-land/chain"] = u.chain, u["fantasy-land/concat"] = u.concat, u["fantasy-land/empty"] = u.empty, u["fantasy-land/of"] = u.of, u["fantasy-land/map"] = u.map;
      var en = e(function(n2, t2) {
        return b(t2, S(n2, t2));
      }), un = e(function(n2, t2) {
        return t2 >= n2.length ? x2(t2, "any character/byte") : b(t2 + 1, L(n2, t2));
      }), on = e(function(n2, t2) {
        return b(n2.length, n2.slice(t2));
      }), an = e(function(n2, t2) {
        return t2 < n2.length ? x2(t2, "EOF") : b(t2, null);
      }), fn = Q(/[0-9]/).desc("a digit"), cn = Q(/[0-9]*/).desc("optional digits"), sn = Q(/[a-z]/i).desc("a letter"), ln = Q(/[a-z]*/i).desc("optional letters"), hn = Q(/\s*/).desc("optional whitespace"), pn = Q(/\s+/).desc("whitespace"), dn = K("\r"), vn = K("\n"), gn = K("\r\n"), mn = T(gn, vn, dn).desc("newline"), yn = T(mn, an);
      e.all = on, e.alt = T, e.any = un, e.cr = dn, e.createLanguage = function(n2) {
        var t2 = {};
        for (var r3 in n2)
          ({}).hasOwnProperty.call(n2, r3) && function(r4) {
            t2[r4] = tn(function() {
              return n2[r4](t2);
            });
          }(r3);
        return t2;
      }, e.crlf = gn, e.custom = function(n2) {
        return e(n2(b, x2));
      }, e.digit = fn, e.digits = cn, e.empty = rn, e.end = yn, e.eof = an, e.fail = Y, e.formatError = N, e.index = en, e.isParser = y, e.lazy = tn, e.letter = sn, e.letters = ln, e.lf = vn, e.lookahead = Z, e.makeFailure = x2, e.makeSuccess = b, e.newline = mn, e.noneOf = function(n2) {
        return nn(function(t2) {
          return n2.indexOf(t2) < 0;
        }).desc("none of '" + n2 + "'");
      }, e.notFollowedBy = $, e.of = X, e.oneOf = function(n2) {
        for (var t2 = n2.split(""), r3 = 0; r3 < t2.length; r3++)
          t2[r3] = "'" + t2[r3] + "'";
        return nn(function(t3) {
          return n2.indexOf(t3) >= 0;
        }).desc(t2);
      }, e.optWhitespace = hn, e.Parser = e, e.range = function(n2, t2) {
        return nn(function(r3) {
          return n2 <= r3 && r3 <= t2;
        }).desc(n2 + "-" + t2);
      }, e.regex = Q, e.regexp = Q, e.sepBy = V, e.sepBy1 = H, e.seq = C, e.seqMap = J, e.seqObj = function() {
        for (var n2, t2 = {}, r3 = 0, u2 = (n2 = arguments, Array.prototype.slice.call(n2)), o2 = u2.length, i2 = 0; i2 < o2; i2 += 1) {
          var a2 = u2[i2];
          if (!y(a2)) {
            if (E(a2) && 2 === a2.length && "string" == typeof a2[0] && y(a2[1])) {
              var f2 = a2[0];
              if (Object.prototype.hasOwnProperty.call(t2, f2))
                throw new Error("seqObj: duplicate key " + f2);
              t2[f2] = true, r3++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (0 === r3)
          throw new Error("seqObj expects at least one named parser, found zero");
        return e(function(n3, t3) {
          for (var r4, e2 = {}, i3 = 0; i3 < o2; i3 += 1) {
            var a3, f3;
            if (E(u2[i3]) ? (a3 = u2[i3][0], f3 = u2[i3][1]) : (a3 = null, f3 = u2[i3]), !(r4 = B(f3._(n3, t3), r4)).status)
              return r4;
            a3 && (e2[a3] = r4.value), t3 = r4.index;
          }
          return B(b(t3, e2), r4);
        });
      }, e.string = K, e.succeed = X, e.takeWhile = function(n2) {
        return k(n2), e(function(t2, r3) {
          for (var e2 = r3; e2 < t2.length && n2(L(t2, e2)); )
            e2++;
          return b(e2, t2.slice(r3, e2));
        });
      }, e.test = nn, e.whitespace = pn, e["fantasy-land/empty"] = rn, e["fantasy-land/of"] = X, e.Binary = { bitSeq: l, bitSeqObj: function(n2) {
        s2();
        var t2 = {}, r3 = 0, e2 = a(function(n3) {
          if (E(n3)) {
            var e3 = n3;
            if (2 !== e3.length)
              throw new Error("[" + e3.join(", ") + "] should be length 2, got length " + e3.length);
            if (P2(e3[0]), O(e3[1]), Object.prototype.hasOwnProperty.call(t2, e3[0]))
              throw new Error("duplicate key in bitSeqObj: " + e3[0]);
            return t2[e3[0]] = true, r3++, e3;
          }
          return O(n3), [null, n3];
        }, n2);
        if (r3 < 1)
          throw new Error("bitSeqObj expects at least one named pair, got [" + n2.join(", ") + "]");
        var u2 = a(function(n3) {
          return n3[0];
        }, e2);
        return l(a(function(n3) {
          return n3[1];
        }, e2)).map(function(n3) {
          return i(function(n4, t3) {
            return null !== t3[0] && (n4[t3[0]] = t3[1]), n4;
          }, {}, a(function(t3, r4) {
            return [t3, n3[r4]];
          }, u2));
        });
      }, byte: function(n2) {
        if (s2(), O(n2), n2 > 255)
          throw new Error("Value specified to byte constructor (" + n2 + "=0x" + n2.toString(16) + ") is larger in value than a single byte.");
        var t2 = (n2 > 15 ? "0x" : "0x0") + n2.toString(16);
        return e(function(r3, e2) {
          var u2 = L(r3, e2);
          return u2 === n2 ? b(e2 + 1, u2) : x2(e2, t2);
        });
      }, buffer: function(n2) {
        return h("buffer", n2).map(function(n3) {
          return Buffer.from(n3);
        });
      }, encodedString: function(n2, t2) {
        return h("string", t2).map(function(t3) {
          return t3.toString(n2);
        });
      }, uintBE: d, uint8BE: d(1), uint16BE: d(2), uint32BE: d(4), uintLE: v, uint8LE: v(1), uint16LE: v(2), uint32LE: v(4), intBE: g, int8BE: g(1), int16BE: g(2), int32BE: g(4), intLE: m, int8LE: m(1), int16LE: m(2), int32LE: m(4), floatBE: h("floatBE", 4).map(function(n2) {
        return n2.readFloatBE(0);
      }), floatLE: h("floatLE", 4).map(function(n2) {
        return n2.readFloatLE(0);
      }), doubleBE: h("doubleBE", 8).map(function(n2) {
        return n2.readDoubleBE(0);
      }), doubleLE: h("doubleLE", 8).map(function(n2) {
        return n2.readDoubleLE(0);
      }) }, n.exports = e;
    }]);
  });
})(parsimmon_umd_min);
var parsimmon_umd_minExports = parsimmon_umd_min.exports;
const P = /* @__PURE__ */ getDefaultExportFromCjs(parsimmon_umd_minExports);
var picocolors_browser = { exports: {} };
var x = String;
var create = function() {
  return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
};
picocolors_browser.exports = create();
picocolors_browser.exports.createColors = create;
var picocolors_browserExports = picocolors_browser.exports;
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
let pico = picocolors_browserExports;
let terminalHighlight$1 = require$$2;
let CssSyntaxError$4 = class CssSyntaxError2 extends Error {
  constructor(message, line, column, source, file, plugin3) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin3) {
      this.plugin = plugin3;
    }
    if (typeof line !== "undefined" && typeof column !== "undefined") {
      if (typeof line === "number") {
        this.line = line;
        this.column = column;
      } else {
        this.line = line.line;
        this.column = line.column;
        this.endLine = column.line;
        this.endColumn = column.column;
      }
    }
    this.setMessage();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError2);
    }
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "";
    this.message += this.file ? this.file : "<css input>";
    if (typeof this.line !== "undefined") {
      this.message += ":" + this.line + ":" + this.column;
    }
    this.message += ": " + this.reason;
  }
  showSourceCode(color2) {
    if (!this.source)
      return "";
    let css = this.source;
    if (color2 == null)
      color2 = pico.isColorSupported;
    if (terminalHighlight$1) {
      if (color2)
        css = terminalHighlight$1(css);
    }
    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);
    let maxWidth = String(end).length;
    let mark, aside;
    if (color2) {
      let { bold, gray, red } = pico.createColors(true);
      mark = (text) => bold(red(text));
      aside = (text) => gray(text);
    } else {
      mark = aside = (str2) => str2;
    }
    return lines.slice(start, end).map((line, index2) => {
      let number2 = start + 1 + index2;
      let gutter = " " + (" " + number2).slice(-maxWidth) + " | ";
      if (number2 === this.line) {
        let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
      }
      return " " + aside(gutter) + line;
    }).join("\n");
  }
  toString() {
    let code = this.showSourceCode();
    if (code) {
      code = "\n\n" + code + "\n";
    }
    return this.name + ": " + this.message + code;
  }
};
var cssSyntaxError = CssSyntaxError$4;
CssSyntaxError$4.default = CssSyntaxError$4;
var symbols = {};
symbols.isClean = Symbol("isClean");
symbols.my = Symbol("my");
const DEFAULT_RAW = {
  after: "\n",
  beforeClose: "\n",
  beforeComment: "\n",
  beforeDecl: "\n",
  beforeOpen: " ",
  beforeRule: "\n",
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: false
};
function capitalize(str2) {
  return str2[0].toUpperCase() + str2.slice(1);
}
let Stringifier$2 = class Stringifier2 {
  constructor(builder) {
    this.builder = builder;
  }
  atrule(node2, semicolon2) {
    let name = "@" + node2.name;
    let params = node2.params ? this.rawValue(node2, "params") : "";
    if (typeof node2.raws.afterName !== "undefined") {
      name += node2.raws.afterName;
    } else if (params) {
      name += " ";
    }
    if (node2.nodes) {
      this.block(node2, name + params);
    } else {
      let end = (node2.raws.between || "") + (semicolon2 ? ";" : "");
      this.builder(name + params + end, node2);
    }
  }
  beforeAfter(node2, detect) {
    let value2;
    if (node2.type === "decl") {
      value2 = this.raw(node2, null, "beforeDecl");
    } else if (node2.type === "comment") {
      value2 = this.raw(node2, null, "beforeComment");
    } else if (detect === "before") {
      value2 = this.raw(node2, null, "beforeRule");
    } else {
      value2 = this.raw(node2, null, "beforeClose");
    }
    let buf = node2.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value2.includes("\n")) {
      let indent = this.raw(node2, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++)
          value2 += indent;
      }
    }
    return value2;
  }
  block(node2, start) {
    let between = this.raw(node2, "between", "beforeOpen");
    this.builder(start + between + "{", node2, "start");
    let after;
    if (node2.nodes && node2.nodes.length) {
      this.body(node2);
      after = this.raw(node2, "after");
    } else {
      after = this.raw(node2, "after", "emptyBody");
    }
    if (after)
      this.builder(after);
    this.builder("}", node2, "end");
  }
  body(node2) {
    let last = node2.nodes.length - 1;
    while (last > 0) {
      if (node2.nodes[last].type !== "comment")
        break;
      last -= 1;
    }
    let semicolon2 = this.raw(node2, "semicolon");
    for (let i = 0; i < node2.nodes.length; i++) {
      let child = node2.nodes[i];
      let before = this.raw(child, "before");
      if (before)
        this.builder(before);
      this.stringify(child, last !== i || semicolon2);
    }
  }
  comment(node2) {
    let left = this.raw(node2, "left", "commentLeft");
    let right = this.raw(node2, "right", "commentRight");
    this.builder("/*" + left + node2.text + right + "*/", node2);
  }
  decl(node2, semicolon2) {
    let between = this.raw(node2, "between", "colon");
    let string3 = node2.prop + between + this.rawValue(node2, "value");
    if (node2.important) {
      string3 += node2.raws.important || " !important";
    }
    if (semicolon2)
      string3 += ";";
    this.builder(string3, node2);
  }
  document(node2) {
    this.body(node2);
  }
  raw(node2, own, detect) {
    let value2;
    if (!detect)
      detect = own;
    if (own) {
      value2 = node2.raws[own];
      if (typeof value2 !== "undefined")
        return value2;
    }
    let parent = node2.parent;
    if (detect === "before") {
      if (!parent || parent.type === "root" && parent.first === node2) {
        return "";
      }
      if (parent && parent.type === "document") {
        return "";
      }
    }
    if (!parent)
      return DEFAULT_RAW[detect];
    let root3 = node2.root();
    if (!root3.rawCache)
      root3.rawCache = {};
    if (typeof root3.rawCache[detect] !== "undefined") {
      return root3.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node2, detect);
    } else {
      let method = "raw" + capitalize(detect);
      if (this[method]) {
        value2 = this[method](root3, node2);
      } else {
        root3.walk((i) => {
          value2 = i.raws[own];
          if (typeof value2 !== "undefined")
            return false;
        });
      }
    }
    if (typeof value2 === "undefined")
      value2 = DEFAULT_RAW[detect];
    root3.rawCache[detect] = value2;
    return value2;
  }
  rawBeforeClose(root3) {
    let value2;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== "undefined") {
          value2 = i.raws.after;
          if (value2.includes("\n")) {
            value2 = value2.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value2)
      value2 = value2.replace(/\S/g, "");
    return value2;
  }
  rawBeforeComment(root3, node2) {
    let value2;
    root3.walkComments((i) => {
      if (typeof i.raws.before !== "undefined") {
        value2 = i.raws.before;
        if (value2.includes("\n")) {
          value2 = value2.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value2 === "undefined") {
      value2 = this.raw(node2, null, "beforeDecl");
    } else if (value2) {
      value2 = value2.replace(/\S/g, "");
    }
    return value2;
  }
  rawBeforeDecl(root3, node2) {
    let value2;
    root3.walkDecls((i) => {
      if (typeof i.raws.before !== "undefined") {
        value2 = i.raws.before;
        if (value2.includes("\n")) {
          value2 = value2.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value2 === "undefined") {
      value2 = this.raw(node2, null, "beforeRule");
    } else if (value2) {
      value2 = value2.replace(/\S/g, "");
    }
    return value2;
  }
  rawBeforeOpen(root3) {
    let value2;
    root3.walk((i) => {
      if (i.type !== "decl") {
        value2 = i.raws.between;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawBeforeRule(root3) {
    let value2;
    root3.walk((i) => {
      if (i.nodes && (i.parent !== root3 || root3.first !== i)) {
        if (typeof i.raws.before !== "undefined") {
          value2 = i.raws.before;
          if (value2.includes("\n")) {
            value2 = value2.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value2)
      value2 = value2.replace(/\S/g, "");
    return value2;
  }
  rawColon(root3) {
    let value2;
    root3.walkDecls((i) => {
      if (typeof i.raws.between !== "undefined") {
        value2 = i.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value2;
  }
  rawEmptyBody(root3) {
    let value2;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value2 = i.raws.after;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawIndent(root3) {
    if (root3.raws.indent)
      return root3.raws.indent;
    let value2;
    root3.walk((i) => {
      let p = i.parent;
      if (p && p !== root3 && p.parent && p.parent === root3) {
        if (typeof i.raws.before !== "undefined") {
          let parts = i.raws.before.split("\n");
          value2 = parts[parts.length - 1];
          value2 = value2.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value2;
  }
  rawSemicolon(root3) {
    let value2;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === "decl") {
        value2 = i.raws.semicolon;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawValue(node2, prop) {
    let value2 = node2[prop];
    let raw = node2.raws[prop];
    if (raw && raw.value === value2) {
      return raw.raw;
    }
    return value2;
  }
  root(node2) {
    this.body(node2);
    if (node2.raws.after)
      this.builder(node2.raws.after);
  }
  rule(node2) {
    this.block(node2, this.rawValue(node2, "selector"));
    if (node2.raws.ownSemicolon) {
      this.builder(node2.raws.ownSemicolon, node2, "end");
    }
  }
  stringify(node2, semicolon2) {
    if (!this[node2.type]) {
      throw new Error(
        "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
      );
    }
    this[node2.type](node2, semicolon2);
  }
};
var stringifier = Stringifier$2;
Stringifier$2.default = Stringifier$2;
let Stringifier$1 = stringifier;
function stringify$5(node2, builder) {
  let str2 = new Stringifier$1(builder);
  str2.stringify(node2);
}
var stringify_1 = stringify$5;
stringify$5.default = stringify$5;
let { isClean: isClean$2, my: my$2 } = symbols;
let CssSyntaxError$3 = cssSyntaxError;
let Stringifier = stringifier;
let stringify$4 = stringify_1;
function cloneNode(obj2, parent) {
  let cloned = new obj2.constructor();
  for (let i in obj2) {
    if (!Object.prototype.hasOwnProperty.call(obj2, i)) {
      continue;
    }
    if (i === "proxyCache")
      continue;
    let value2 = obj2[i];
    let type = typeof value2;
    if (i === "parent" && type === "object") {
      if (parent)
        cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value2;
    } else if (Array.isArray(value2)) {
      cloned[i] = value2.map((j) => cloneNode(j, cloned));
    } else {
      if (type === "object" && value2 !== null)
        value2 = cloneNode(value2);
      cloned[i] = value2;
    }
  }
  return cloned;
}
let Node$5 = class Node2 {
  constructor(defaults3 = {}) {
    this.raws = {};
    this[isClean$2] = false;
    this[my$2] = true;
    for (let name in defaults3) {
      if (name === "nodes") {
        this.nodes = [];
        for (let node2 of defaults3[name]) {
          if (typeof node2.clone === "function") {
            this.append(node2.clone());
          } else {
            this.append(node2);
          }
        }
      } else {
        this[name] = defaults3[name];
      }
    }
  }
  addToError(error) {
    error.postcssNode = this;
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s2 = this.source;
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s2.input.from}:${s2.start.line}:${s2.start.column}$&`
      );
    }
    return error;
  }
  after(add) {
    this.parent.insertAfter(this, add);
    return this;
  }
  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name];
    }
    return this;
  }
  before(add) {
    this.parent.insertBefore(this, add);
    return this;
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween)
      delete this.raws.between;
  }
  clone(overrides = {}) {
    let cloned = cloneNode(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  error(message, opts = {}) {
    if (this.source) {
      let { end, start } = this.rangeBy(opts);
      return this.source.input.error(
        message,
        { column: start.column, line: start.line },
        { column: end.column, line: end.line },
        opts
      );
    }
    return new CssSyntaxError$3(message);
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value2) {
        if (node2[prop] === value2)
          return true;
        node2[prop] = value2;
        if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
        prop === "text") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  markDirty() {
    if (this[isClean$2]) {
      this[isClean$2] = false;
      let next = this;
      while (next = next.parent) {
        next[isClean$2] = false;
      }
    }
  }
  next() {
    if (!this.parent)
      return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 + 1];
  }
  positionBy(opts, stringRepresentation) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index, stringRepresentation);
    } else if (opts.word) {
      stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1)
        pos = this.positionInside(index2, stringRepresentation);
    }
    return pos;
  }
  positionInside(index2, stringRepresentation) {
    let string3 = stringRepresentation || this.toString();
    let column = this.source.start.column;
    let line = this.source.start.line;
    for (let i = 0; i < index2; i++) {
      if (string3[i] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { column, line };
  }
  prev() {
    if (!this.parent)
      return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 - 1];
  }
  rangeBy(opts) {
    let start = {
      column: this.source.start.column,
      line: this.source.start.line
    };
    let end = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: start.column + 1,
      line: start.line
    };
    if (opts.word) {
      let stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1) {
        start = this.positionInside(index2, stringRepresentation);
        end = this.positionInside(index2 + opts.word.length, stringRepresentation);
      }
    } else {
      if (opts.start) {
        start = {
          column: opts.start.column,
          line: opts.start.line
        };
      } else if (opts.index) {
        start = this.positionInside(opts.index);
      }
      if (opts.end) {
        end = {
          column: opts.end.column,
          line: opts.end.line
        };
      } else if (typeof opts.endIndex === "number") {
        end = this.positionInside(opts.endIndex);
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1);
      }
    }
    if (end.line < start.line || end.line === start.line && end.column <= start.column) {
      end = { column: start.column + 1, line: start.line };
    }
    return { end, start };
  }
  raw(prop, defaultType) {
    let str2 = new Stringifier();
    return str2.raw(this, prop, defaultType);
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this;
      let foundSelf = false;
      for (let node2 of nodes) {
        if (node2 === this) {
          foundSelf = true;
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node2);
          bookmark = node2;
        } else {
          this.parent.insertBefore(bookmark, node2);
        }
      }
      if (!foundSelf) {
        this.remove();
      }
    }
    return this;
  }
  root() {
    let result2 = this;
    while (result2.parent && result2.parent.type !== "document") {
      result2 = result2.parent;
    }
    return result2;
  }
  toJSON(_, inputs) {
    let fixed = {};
    let emitInputs = inputs == null;
    inputs = inputs || /* @__PURE__ */ new Map();
    let inputsNextIndex = 0;
    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        continue;
      }
      if (name === "parent" || name === "proxyCache")
        continue;
      let value2 = this[name];
      if (Array.isArray(value2)) {
        fixed[name] = value2.map((i) => {
          if (typeof i === "object" && i.toJSON) {
            return i.toJSON(null, inputs);
          } else {
            return i;
          }
        });
      } else if (typeof value2 === "object" && value2.toJSON) {
        fixed[name] = value2.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value2.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value2.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          end: value2.end,
          inputId,
          start: value2.start
        };
      } else {
        fixed[name] = value2;
      }
    }
    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
    }
    return fixed;
  }
  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor());
    }
    return this.proxyCache;
  }
  toString(stringifier2 = stringify$4) {
    if (stringifier2.stringify)
      stringifier2 = stringifier2.stringify;
    let result2 = "";
    stringifier2(this, (i) => {
      result2 += i;
    });
    return result2;
  }
  warn(result2, text, opts) {
    let data = { node: this };
    for (let i in opts)
      data[i] = opts[i];
    return result2.warn(text, data);
  }
  get proxyOf() {
    return this;
  }
};
var node$1 = Node$5;
Node$5.default = Node$5;
let Node$4 = node$1;
let Declaration$5 = class Declaration2 extends Node$4 {
  constructor(defaults3) {
    if (defaults3 && typeof defaults3.value !== "undefined" && typeof defaults3.value !== "string") {
      defaults3 = { ...defaults3, value: String(defaults3.value) };
    }
    super(defaults3);
    this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var declaration = Declaration$5;
Declaration$5.default = Declaration$5;
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id3 = "";
    let i = size;
    while (i--) {
      id3 += alphabet[Math.random() * alphabet.length | 0];
    }
    return id3;
  };
};
let nanoid$1 = (size = 21) => {
  let id3 = "";
  let i = size;
  while (i--) {
    id3 += urlAlphabet[Math.random() * 64 | 0];
  }
  return id3;
};
var nonSecure = { nanoid: nanoid$1, customAlphabet };
let { SourceMapConsumer: SourceMapConsumer$2, SourceMapGenerator: SourceMapGenerator$2 } = require$$2;
let { existsSync, readFileSync } = require$$2;
let { dirname: dirname$1, join: join$1 } = require$$2;
function fromBase64(str2) {
  if (Buffer) {
    return Buffer.from(str2, "base64").toString();
  } else {
    return window.atob(str2);
  }
}
let PreviousMap$2 = class PreviousMap2 {
  constructor(css, opts) {
    if (opts.map === false)
      return;
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");
    let prev = opts.map ? opts.map.prev : void 0;
    let text = this.loadMap(opts.from, prev);
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from;
    }
    if (this.mapFile)
      this.root = dirname$1(this.mapFile);
    if (text)
      this.text = text;
  }
  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer$2(this.text);
    }
    return this.consumerCache;
  }
  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    let baseUri = /^data:application\/json;base64,/;
    let charsetUri = /^data:application\/json;charset=utf-?8,/;
    let uri = /^data:application\/json,/;
    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length));
    }
    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length));
    }
    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + encoding);
  }
  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(map) {
    if (typeof map !== "object")
      return false;
    return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
  }
  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!comments)
      return;
    let start = css.lastIndexOf(comments.pop());
    let end = css.indexOf("*/", start);
    if (start > -1 && end > -1) {
      this.annotation = this.getAnnotationURL(css.substring(start, end));
    }
  }
  loadFile(path) {
    this.root = dirname$1(path);
    if (existsSync(path)) {
      this.mapFile = path;
      return readFileSync(path, "utf-8").toString().trim();
    }
  }
  loadMap(file, prev) {
    if (prev === false)
      return false;
    if (prev) {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "function") {
        let prevPath = prev(file);
        if (prevPath) {
          let map = this.loadFile(prevPath);
          if (!map) {
            throw new Error(
              "Unable to load previous source map: " + prevPath.toString()
            );
          }
          return map;
        }
      } else if (prev instanceof SourceMapConsumer$2) {
        return SourceMapGenerator$2.fromSourceMap(prev).toString();
      } else if (prev instanceof SourceMapGenerator$2) {
        return prev.toString();
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev);
      } else {
        throw new Error(
          "Unsupported previous source map format: " + prev.toString()
        );
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation);
    } else if (this.annotation) {
      let map = this.annotation;
      if (file)
        map = join$1(dirname$1(file), map);
      return this.loadFile(map);
    }
  }
  startWith(string3, start) {
    if (!string3)
      return false;
    return string3.substr(0, start.length) === start;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var previousMap = PreviousMap$2;
PreviousMap$2.default = PreviousMap$2;
let { SourceMapConsumer: SourceMapConsumer$1, SourceMapGenerator: SourceMapGenerator$1 } = require$$2;
let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = require$$2;
let { isAbsolute, resolve: resolve$1 } = require$$2;
let { nanoid } = nonSecure;
let terminalHighlight = require$$2;
let CssSyntaxError$2 = cssSyntaxError;
let PreviousMap$1 = previousMap;
let fromOffsetCache = Symbol("fromOffsetCache");
let sourceMapAvailable$1 = Boolean(SourceMapConsumer$1 && SourceMapGenerator$1);
let pathAvailable$1 = Boolean(resolve$1 && isAbsolute);
let Input$5 = class Input2 {
  constructor(css, opts = {}) {
    if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
      throw new Error(`PostCSS received ${css} instead of CSS string`);
    }
    this.css = css.toString();
    if (this.css[0] === "\uFEFF" || this.css[0] === "￾") {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }
    if (opts.from) {
      if (!pathAvailable$1 || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
        this.file = opts.from;
      } else {
        this.file = resolve$1(opts.from);
      }
    }
    if (pathAvailable$1 && sourceMapAvailable$1) {
      let map = new PreviousMap$1(this.css, opts);
      if (map.text) {
        this.map = map;
        let file = map.consumer().file;
        if (!this.file && file)
          this.file = this.mapResolve(file);
      }
    }
    if (!this.file) {
      this.id = "<input css " + nanoid(6) + ">";
    }
    if (this.map)
      this.map.file = this.from;
  }
  error(message, line, column, opts = {}) {
    let result2, endLine, endColumn;
    if (line && typeof line === "object") {
      let start = line;
      let end = column;
      if (typeof start.offset === "number") {
        let pos = this.fromOffset(start.offset);
        line = pos.line;
        column = pos.col;
      } else {
        line = start.line;
        column = start.column;
      }
      if (typeof end.offset === "number") {
        let pos = this.fromOffset(end.offset);
        endLine = pos.line;
        endColumn = pos.col;
      } else {
        endLine = end.line;
        endColumn = end.column;
      }
    } else if (!column) {
      let pos = this.fromOffset(line);
      line = pos.line;
      column = pos.col;
    }
    let origin = this.origin(line, column, endLine, endColumn);
    if (origin) {
      result2 = new CssSyntaxError$2(
        message,
        origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
        origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
        origin.source,
        origin.file,
        opts.plugin
      );
    } else {
      result2 = new CssSyntaxError$2(
        message,
        endLine === void 0 ? line : { column, line },
        endLine === void 0 ? column : { column: endColumn, line: endLine },
        this.css,
        this.file,
        opts.plugin
      );
    }
    result2.input = { column, endColumn, endLine, line, source: this.css };
    if (this.file) {
      if (pathToFileURL$1) {
        result2.input.url = pathToFileURL$1(this.file).toString();
      }
      result2.input.file = this.file;
    }
    return result2;
  }
  fromOffset(offset) {
    let lastLine, lineToIndex;
    if (!this[fromOffsetCache]) {
      let lines = this.css.split("\n");
      lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex;
        prevIndex += lines[i].length + 1;
      }
      this[fromOffsetCache] = lineToIndex;
    } else {
      lineToIndex = this[fromOffsetCache];
    }
    lastLine = lineToIndex[lineToIndex.length - 1];
    let min = 0;
    if (offset >= lastLine) {
      min = lineToIndex.length - 1;
    } else {
      let max2 = lineToIndex.length - 2;
      let mid;
      while (min < max2) {
        mid = min + (max2 - min >> 1);
        if (offset < lineToIndex[mid]) {
          max2 = mid - 1;
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1;
        } else {
          min = mid;
          break;
        }
      }
    }
    return {
      col: offset - lineToIndex[min] + 1,
      line: min + 1
    };
  }
  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file;
    }
    return resolve$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
  }
  origin(line, column, endLine, endColumn) {
    if (!this.map)
      return false;
    let consumer = this.map.consumer();
    let from = consumer.originalPositionFor({ column, line });
    if (!from.source)
      return false;
    let to;
    if (typeof endLine === "number") {
      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
    }
    let fromUrl;
    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL$1(from.source);
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile)
      );
    }
    let result2 = {
      column: from.column,
      endColumn: to && to.column,
      endLine: to && to.line,
      line: from.line,
      url: fromUrl.toString()
    };
    if (fromUrl.protocol === "file:") {
      if (fileURLToPath) {
        result2.file = fileURLToPath(fromUrl);
      } else {
        throw new Error(`file: protocol is not available in this PostCSS build`);
      }
    }
    let source = consumer.sourceContentFor(from.source);
    if (source)
      result2.source = source;
    return result2;
  }
  toJSON() {
    let json = {};
    for (let name of ["hasBOM", "css", "file", "id"]) {
      if (this[name] != null) {
        json[name] = this[name];
      }
    }
    if (this.map) {
      json.map = { ...this.map };
      if (json.map.consumerCache) {
        json.map.consumerCache = void 0;
      }
    }
    return json;
  }
  get from() {
    return this.file || this.id;
  }
};
var input = Input$5;
Input$5.default = Input$5;
if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input$5);
}
let { SourceMapConsumer, SourceMapGenerator } = require$$2;
let { dirname, relative, resolve, sep } = require$$2;
let { pathToFileURL } = require$$2;
let Input$4 = input;
let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
let pathAvailable = Boolean(dirname && resolve && relative && sep);
let MapGenerator$2 = class MapGenerator2 {
  constructor(stringify2, root3, opts, cssString) {
    this.stringify = stringify2;
    this.mapOpts = opts.map || {};
    this.root = root3;
    this.opts = opts;
    this.css = cssString;
    this.originalCSS = cssString;
    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
    this.memoizedFileURLs = /* @__PURE__ */ new Map();
    this.memoizedPaths = /* @__PURE__ */ new Map();
    this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let content;
    if (this.isInline()) {
      content = "data:application/json;base64," + this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === "string") {
      content = this.mapOpts.annotation;
    } else if (typeof this.mapOpts.annotation === "function") {
      content = this.mapOpts.annotation(this.opts.to, this.root);
    } else {
      content = this.outputFile() + ".map";
    }
    let eol = "\n";
    if (this.css.includes("\r\n"))
      eol = "\r\n";
    this.css += eol + "/*# sourceMappingURL=" + content + " */";
  }
  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file));
      let root3 = prev.root || dirname(prev.file);
      let map;
      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer(prev.text);
        if (map.sourcesContent) {
          map.sourcesContent = null;
        }
      } else {
        map = prev.consumer();
      }
      this.map.applySourceMap(map, from, this.toUrl(this.path(root3)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation === false)
      return;
    if (this.root) {
      let node2;
      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
        node2 = this.root.nodes[i];
        if (node2.type !== "comment")
          continue;
        if (node2.text.indexOf("# sourceMappingURL=") === 0) {
          this.root.removeChild(i);
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, "");
    }
  }
  generate() {
    this.clearAnnotation();
    if (pathAvailable && sourceMapAvailable && this.isMap()) {
      return this.generateMap();
    } else {
      let result2 = "";
      this.stringify(this.root, (i) => {
        result2 += i;
      });
      return [result2];
    }
  }
  generateMap() {
    if (this.root) {
      this.generateString();
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer();
      prev.file = this.outputFile();
      this.map = SourceMapGenerator.fromSourceMap(prev, {
        ignoreInvalidMapping: true
      });
    } else {
      this.map = new SourceMapGenerator({
        file: this.outputFile(),
        ignoreInvalidMapping: true
      });
      this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    }
    if (this.isSourcesContent())
      this.setSourcesContent();
    if (this.root && this.previous().length > 0)
      this.applyPrevMaps();
    if (this.isAnnotation())
      this.addAnnotation();
    if (this.isInline()) {
      return [this.css];
    } else {
      return [this.css, this.map];
    }
  }
  generateString() {
    this.css = "";
    this.map = new SourceMapGenerator({
      file: this.outputFile(),
      ignoreInvalidMapping: true
    });
    let line = 1;
    let column = 1;
    let noSource = "<no source>";
    let mapping = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    };
    let lines, last;
    this.stringify(this.root, (str2, node2, type) => {
      this.css += str2;
      if (node2 && type !== "end") {
        mapping.generated.line = line;
        mapping.generated.column = column - 1;
        if (node2.source && node2.source.start) {
          mapping.source = this.sourcePath(node2);
          mapping.original.line = node2.source.start.line;
          mapping.original.column = node2.source.start.column - 1;
          this.map.addMapping(mapping);
        } else {
          mapping.source = noSource;
          mapping.original.line = 1;
          mapping.original.column = 0;
          this.map.addMapping(mapping);
        }
      }
      lines = str2.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str2.lastIndexOf("\n");
        column = str2.length - last;
      } else {
        column += str2.length;
      }
      if (node2 && type !== "start") {
        let p = node2.parent || { raws: {} };
        let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
        if (!childless || node2 !== p.last || p.raws.semicolon) {
          if (node2.source && node2.source.end) {
            mapping.source = this.sourcePath(node2);
            mapping.original.line = node2.source.end.line;
            mapping.original.column = node2.source.end.column - 1;
            mapping.generated.line = line;
            mapping.generated.column = column - 2;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            this.map.addMapping(mapping);
          }
        }
      }
    });
  }
  isAnnotation() {
    if (this.isInline()) {
      return true;
    }
    if (typeof this.mapOpts.annotation !== "undefined") {
      return this.mapOpts.annotation;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.annotation);
    }
    return true;
  }
  isInline() {
    if (typeof this.mapOpts.inline !== "undefined") {
      return this.mapOpts.inline;
    }
    let annotation = this.mapOpts.annotation;
    if (typeof annotation !== "undefined" && annotation !== true) {
      return false;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.inline);
    }
    return true;
  }
  isMap() {
    if (typeof this.opts.map !== "undefined") {
      return !!this.opts.map;
    }
    return this.previous().length > 0;
  }
  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== "undefined") {
      return this.mapOpts.sourcesContent;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.withContent());
    }
    return true;
  }
  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to);
    } else if (this.opts.from) {
      return this.path(this.opts.from);
    } else {
      return "to.css";
    }
  }
  path(file) {
    if (this.mapOpts.absolute)
      return file;
    if (file.charCodeAt(0) === 60)
      return file;
    if (/^\w+:\/\//.test(file))
      return file;
    let cached = this.memoizedPaths.get(file);
    if (cached)
      return cached;
    let from = this.opts.to ? dirname(this.opts.to) : ".";
    if (typeof this.mapOpts.annotation === "string") {
      from = dirname(resolve(from, this.mapOpts.annotation));
    }
    let path = relative(from, file);
    this.memoizedPaths.set(file, path);
    return path;
  }
  previous() {
    if (!this.previousMaps) {
      this.previousMaps = [];
      if (this.root) {
        this.root.walk((node2) => {
          if (node2.source && node2.source.input.map) {
            let map = node2.source.input.map;
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map);
            }
          }
        });
      } else {
        let input2 = new Input$4(this.originalCSS, this.opts);
        if (input2.map)
          this.previousMaps.push(input2.map);
      }
    }
    return this.previousMaps;
  }
  setSourcesContent() {
    let already = {};
    if (this.root) {
      this.root.walk((node2) => {
        if (node2.source) {
          let from = node2.source.input.from;
          if (from && !already[from]) {
            already[from] = true;
            let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
            this.map.setSourceContent(fromUrl, node2.source.input.css);
          }
        }
      });
    } else if (this.css) {
      let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(from, this.css);
    }
  }
  sourcePath(node2) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from);
    } else if (this.usesFileUrls) {
      return this.toFileUrl(node2.source.input.from);
    } else {
      return this.toUrl(this.path(node2.source.input.from));
    }
  }
  toBase64(str2) {
    if (Buffer) {
      return Buffer.from(str2).toString("base64");
    } else {
      return window.btoa(unescape(encodeURIComponent(str2)));
    }
  }
  toFileUrl(path) {
    let cached = this.memoizedFileURLs.get(path);
    if (cached)
      return cached;
    if (pathToFileURL) {
      let fileURL = pathToFileURL(path).toString();
      this.memoizedFileURLs.set(path, fileURL);
      return fileURL;
    } else {
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
    }
  }
  toUrl(path) {
    let cached = this.memoizedURLs.get(path);
    if (cached)
      return cached;
    if (sep === "\\") {
      path = path.replace(/\\/g, "/");
    }
    let url2 = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    this.memoizedURLs.set(path, url2);
    return url2;
  }
};
var mapGenerator = MapGenerator$2;
let Node$3 = node$1;
let Comment$5 = class Comment2 extends Node$3 {
  constructor(defaults3) {
    super(defaults3);
    this.type = "comment";
  }
};
var comment$4 = Comment$5;
Comment$5.default = Comment$5;
let { isClean: isClean$1, my: my$1 } = symbols;
let Declaration$4 = declaration;
let Comment$4 = comment$4;
let Node$2 = node$1;
let parse$a, Rule$5, AtRule$5, Root$7;
function cleanSource(nodes) {
  return nodes.map((i) => {
    if (i.nodes)
      i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}
function markDirtyUp(node2) {
  node2[isClean$1] = false;
  if (node2.proxyOf.nodes) {
    for (let i of node2.proxyOf.nodes) {
      markDirtyUp(i);
    }
  }
}
let Container$8 = class Container2 extends Node$2 {
  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last);
      for (let node2 of nodes)
        this.proxyOf.nodes.push(node2);
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node2 of this.nodes)
        node2.cleanRaws(keepBetween);
    }
  }
  each(callback3) {
    if (!this.proxyOf.nodes)
      return void 0;
    let iterator = this.getIterator();
    let index2, result2;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index2 = this.indexes[iterator];
      result2 = callback3(this.proxyOf.nodes[index2], index2);
      if (result2 === false)
        break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result2;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  getIterator() {
    if (!this.lastEach)
      this.lastEach = 0;
    if (!this.indexes)
      this.indexes = {};
    this.lastEach += 1;
    let iterator = this.lastEach;
    this.indexes[iterator] = 0;
    return iterator;
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (!node2[prop]) {
          return node2[prop];
        } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
          return (...args) => {
            return node2[prop](
              ...args.map((i) => {
                if (typeof i === "function") {
                  return (child, index2) => i(child.toProxy(), index2);
                } else {
                  return i;
                }
              })
            );
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node2[prop](
              (child, ...other) => cb(child.toProxy(), ...other)
            );
          };
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else if (prop === "nodes") {
          return node2.nodes.map((i) => i.toProxy());
        } else if (prop === "first" || prop === "last") {
          return node2[prop].toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value2) {
        if (node2[prop] === value2)
          return true;
        node2[prop] = value2;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  index(child) {
    if (typeof child === "number")
      return child;
    if (child.proxyOf)
      child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  insertAfter(exist, add) {
    let existIndex = this.index(exist);
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes)
      this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
    let index2;
    for (let id3 in this.indexes) {
      index2 = this.indexes[id3];
      if (existIndex < index2) {
        this.indexes[id3] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertBefore(exist, add) {
    let existIndex = this.index(exist);
    let type = existIndex === 0 ? "prepend" : false;
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes)
      this.proxyOf.nodes.splice(existIndex, 0, node2);
    let index2;
    for (let id3 in this.indexes) {
      index2 = this.indexes[id3];
      if (existIndex <= index2) {
        this.indexes[id3] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  normalize(nodes, sample) {
    if (typeof nodes === "string") {
      nodes = cleanSource(parse$a(nodes).nodes);
    } else if (typeof nodes === "undefined") {
      nodes = [];
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (let i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (let i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === "undefined") {
        throw new Error("Value field is missed in node creation");
      } else if (typeof nodes.value !== "string") {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration$4(nodes)];
    } else if (nodes.selector) {
      nodes = [new Rule$5(nodes)];
    } else if (nodes.name) {
      nodes = [new AtRule$5(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment$4(nodes)];
    } else {
      throw new Error("Unknown node type in node creation");
    }
    let processed = nodes.map((i) => {
      if (!i[my$1])
        Container2.rebuild(i);
      i = i.proxyOf;
      if (i.parent)
        i.parent.removeChild(i);
      if (i[isClean$1])
        markDirtyUp(i);
      if (typeof i.raws.before === "undefined") {
        if (sample && typeof sample.raws.before !== "undefined") {
          i.raws.before = sample.raws.before.replace(/\S/g, "");
        }
      }
      i.parent = this.proxyOf;
      return i;
    });
    return processed;
  }
  prepend(...children) {
    children = children.reverse();
    for (let child of children) {
      let nodes = this.normalize(child, this.first, "prepend").reverse();
      for (let node2 of nodes)
        this.proxyOf.nodes.unshift(node2);
      for (let id3 in this.indexes) {
        this.indexes[id3] = this.indexes[id3] + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  push(child) {
    child.parent = this;
    this.proxyOf.nodes.push(child);
    return this;
  }
  removeAll() {
    for (let node2 of this.proxyOf.nodes)
      node2.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index2;
    for (let id3 in this.indexes) {
      index2 = this.indexes[id3];
      if (index2 >= child) {
        this.indexes[id3] = index2 - 1;
      }
    }
    this.markDirty();
    return this;
  }
  replaceValues(pattern2, opts, callback3) {
    if (!callback3) {
      callback3 = opts;
      opts = {};
    }
    this.walkDecls((decl2) => {
      if (opts.props && !opts.props.includes(decl2.prop))
        return;
      if (opts.fast && !decl2.value.includes(opts.fast))
        return;
      decl2.value = decl2.value.replace(pattern2, callback3);
    });
    this.markDirty();
    return this;
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  walk(callback3) {
    return this.each((child, i) => {
      let result2;
      try {
        result2 = callback3(child, i);
      } catch (e) {
        throw child.addToError(e);
      }
      if (result2 !== false && child.walk) {
        result2 = child.walk(callback3);
      }
      return result2;
    });
  }
  walkAtRules(name, callback3) {
    if (!callback3) {
      callback3 = name;
      return this.walk((child, i) => {
        if (child.type === "atrule") {
          return callback3(child, i);
        }
      });
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "atrule" && name.test(child.name)) {
          return callback3(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "atrule" && child.name === name) {
        return callback3(child, i);
      }
    });
  }
  walkComments(callback3) {
    return this.walk((child, i) => {
      if (child.type === "comment") {
        return callback3(child, i);
      }
    });
  }
  walkDecls(prop, callback3) {
    if (!callback3) {
      callback3 = prop;
      return this.walk((child, i) => {
        if (child.type === "decl") {
          return callback3(child, i);
        }
      });
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "decl" && prop.test(child.prop)) {
          return callback3(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "decl" && child.prop === prop) {
        return callback3(child, i);
      }
    });
  }
  walkRules(selector3, callback3) {
    if (!callback3) {
      callback3 = selector3;
      return this.walk((child, i) => {
        if (child.type === "rule") {
          return callback3(child, i);
        }
      });
    }
    if (selector3 instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "rule" && selector3.test(child.selector)) {
          return callback3(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "rule" && child.selector === selector3) {
        return callback3(child, i);
      }
    });
  }
  get first() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
Container$8.registerParse = (dependant) => {
  parse$a = dependant;
};
Container$8.registerRule = (dependant) => {
  Rule$5 = dependant;
};
Container$8.registerAtRule = (dependant) => {
  AtRule$5 = dependant;
};
Container$8.registerRoot = (dependant) => {
  Root$7 = dependant;
};
var container$1 = Container$8;
Container$8.default = Container$8;
Container$8.rebuild = (node2) => {
  if (node2.type === "atrule") {
    Object.setPrototypeOf(node2, AtRule$5.prototype);
  } else if (node2.type === "rule") {
    Object.setPrototypeOf(node2, Rule$5.prototype);
  } else if (node2.type === "decl") {
    Object.setPrototypeOf(node2, Declaration$4.prototype);
  } else if (node2.type === "comment") {
    Object.setPrototypeOf(node2, Comment$4.prototype);
  } else if (node2.type === "root") {
    Object.setPrototypeOf(node2, Root$7.prototype);
  }
  node2[my$1] = true;
  if (node2.nodes) {
    node2.nodes.forEach((child) => {
      Container$8.rebuild(child);
    });
  }
};
let Container$7 = container$1;
let LazyResult$4, Processor$4;
let Document$4 = class Document2 extends Container$7 {
  constructor(defaults3) {
    super({ type: "document", ...defaults3 });
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$4(new Processor$4(), this, opts);
    return lazy.stringify();
  }
};
Document$4.registerLazyResult = (dependant) => {
  LazyResult$4 = dependant;
};
Document$4.registerProcessor = (dependant) => {
  Processor$4 = dependant;
};
var document$2 = Document$4;
Document$4.default = Document$4;
let printed = {};
var warnOnce$2 = function warnOnce2(message) {
  if (printed[message])
    return;
  printed[message] = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(message);
  }
};
let Warning$3 = class Warning2 {
  constructor(text, opts = {}) {
    this.type = "warning";
    this.text = text;
    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts);
      this.line = range.start.line;
      this.column = range.start.column;
      this.endLine = range.end.line;
      this.endColumn = range.end.column;
    }
    for (let opt2 in opts)
      this[opt2] = opts[opt2];
  }
  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message;
    }
    if (this.plugin) {
      return this.plugin + ": " + this.text;
    }
    return this.text;
  }
};
var warning = Warning$3;
Warning$3.default = Warning$3;
let Warning$2 = warning;
let Result$4 = class Result2 {
  constructor(processor2, root3, opts) {
    this.processor = processor2;
    this.messages = [];
    this.root = root3;
    this.opts = opts;
    this.css = void 0;
    this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }
    let warning2 = new Warning$2(text, opts);
    this.messages.push(warning2);
    return warning2;
  }
  warnings() {
    return this.messages.filter((i) => i.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var result = Result$4;
Result$4.default = Result$4;
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const NEWLINE = "\n".charCodeAt(0);
const SPACE$1 = " ".charCodeAt(0);
const FEED = "\f".charCodeAt(0);
const TAB = "	".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const OPEN_SQUARE = "[".charCodeAt(0);
const CLOSE_SQUARE = "]".charCodeAt(0);
const OPEN_PARENTHESES = "(".charCodeAt(0);
const CLOSE_PARENTHESES = ")".charCodeAt(0);
const OPEN_CURLY = "{".charCodeAt(0);
const CLOSE_CURLY = "}".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const COLON = ":".charCodeAt(0);
const AT = "@".charCodeAt(0);
const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
const RE_HEX_ESCAPE = /[\da-f]/i;
var tokenize$1 = function tokenizer2(input2, options = {}) {
  let css = input2.css.valueOf();
  let ignore = options.ignoreErrors;
  let code, next, quote, content, escape2;
  let escaped, escapePos, prev, n, currentToken;
  let length2 = css.length;
  let pos = 0;
  let buffer = [];
  let returned = [];
  function position2() {
    return pos;
  }
  function unclosed(what) {
    throw input2.error("Unclosed " + what, pos);
  }
  function endOfFile() {
    return returned.length === 0 && pos >= length2;
  }
  function nextToken(opts) {
    if (returned.length)
      return returned.pop();
    if (pos >= length2)
      return;
    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE:
      case SPACE$1:
      case TAB:
      case CR:
      case FEED: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE$1 || code === NEWLINE || code === TAB || code === CR || code === FEED);
        currentToken = ["space", css.slice(pos, next)];
        pos = next - 1;
        break;
      }
      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, pos];
        break;
      }
      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : "";
        n = css.charCodeAt(pos + 1);
        if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE$1 && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(")", next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break;
              } else {
                unclosed("bracket");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          next = css.indexOf(")", pos + 1);
          content = css.slice(pos, next + 1);
          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ["(", "(", pos];
          } else {
            currentToken = ["brackets", content, pos, next];
            pos = next;
          }
        }
        break;
      }
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break;
            } else {
              unclosed("string");
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        currentToken = ["string", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case AT: {
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }
        currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case BACKSLASH: {
        next = pos;
        escape2 = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape2 = !escape2;
        }
        code = css.charCodeAt(next + 1);
        if (escape2 && code !== SLASH && code !== SPACE$1 && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE$1) {
              next += 1;
            }
          }
        }
        currentToken = ["word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed("comment");
            }
          }
          currentToken = ["comment", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          buffer.push(currentToken);
          pos = next;
        }
        break;
      }
    }
    pos++;
    return currentToken;
  }
  function back(token) {
    returned.push(token);
  }
  return {
    back,
    endOfFile,
    nextToken,
    position: position2
  };
};
let Container$6 = container$1;
let AtRule$4 = class AtRule2 extends Container$6 {
  constructor(defaults3) {
    super(defaults3);
    this.type = "atrule";
  }
  append(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.prepend(...children);
  }
};
var atRule$3 = AtRule$4;
AtRule$4.default = AtRule$4;
Container$6.registerAtRule(AtRule$4);
let Container$5 = container$1;
let LazyResult$3, Processor$3;
let Root$6 = class Root2 extends Container$5 {
  constructor(defaults3) {
    super(defaults3);
    this.type = "root";
    if (!this.nodes)
      this.nodes = [];
  }
  normalize(child, sample, type) {
    let nodes = super.normalize(child);
    if (sample) {
      if (type === "prepend") {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (let node2 of nodes) {
          node2.raws.before = sample.raws.before;
        }
      }
    }
    return nodes;
  }
  removeChild(child, ignore) {
    let index2 = this.index(child);
    if (!ignore && index2 === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index2].raws.before;
    }
    return super.removeChild(child);
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$3(new Processor$3(), this, opts);
    return lazy.stringify();
  }
};
Root$6.registerLazyResult = (dependant) => {
  LazyResult$3 = dependant;
};
Root$6.registerProcessor = (dependant) => {
  Processor$3 = dependant;
};
var root$3 = Root$6;
Root$6.default = Root$6;
Container$5.registerRoot(Root$6);
let list$4 = {
  comma(string3) {
    return list$4.split(string3, [","], true);
  },
  space(string3) {
    let spaces = [" ", "\n", "	"];
    return list$4.split(string3, spaces);
  },
  split(string3, separators, last) {
    let array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape2 = false;
    for (let letter of string3) {
      if (escape2) {
        escape2 = false;
      } else if (letter === "\\") {
        escape2 = true;
      } else if (inQuote) {
        if (letter === prevQuote) {
          inQuote = false;
        }
      } else if (letter === '"' || letter === "'") {
        inQuote = true;
        prevQuote = letter;
      } else if (letter === "(") {
        func += 1;
      } else if (letter === ")") {
        if (func > 0)
          func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter))
          split = true;
      }
      if (split) {
        if (current !== "")
          array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "")
      array.push(current.trim());
    return array;
  }
};
var list_1 = list$4;
list$4.default = list$4;
let Container$4 = container$1;
let list$3 = list_1;
let Rule$4 = class Rule2 extends Container$4 {
  constructor(defaults3) {
    super(defaults3);
    this.type = "rule";
    if (!this.nodes)
      this.nodes = [];
  }
  get selectors() {
    return list$3.comma(this.selector);
  }
  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null;
    let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
    this.selector = values.join(sep2);
  }
};
var rule$1 = Rule$4;
Rule$4.default = Rule$4;
Container$4.registerRule(Rule$4);
let Declaration$3 = declaration;
let tokenizer = tokenize$1;
let Comment$3 = comment$4;
let AtRule$3 = atRule$3;
let Root$5 = root$3;
let Rule$3 = rule$1;
const SAFE_COMMENT_NEIGHBOR = {
  empty: true,
  space: true
};
function findLastWithPosition(tokens) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    let token = tokens[i];
    let pos = token[3] || token[2];
    if (pos)
      return pos;
  }
}
let Parser$1 = class Parser2 {
  constructor(input2) {
    this.input = input2;
    this.root = new Root$5();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;
    this.createTokenizer();
    this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(token) {
    let node2 = new AtRule$3();
    node2.name = token[1].slice(1);
    if (node2.name === "") {
      this.unnamedAtrule(node2, token);
    }
    this.init(node2, token[2]);
    let type;
    let prev;
    let shift;
    let last = false;
    let open = false;
    let params = [];
    let brackets = [];
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      type = token[0];
      if (type === "(" || type === "[") {
        brackets.push(type === "(" ? ")" : "]");
      } else if (type === "{" && brackets.length > 0) {
        brackets.push("}");
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
      }
      if (brackets.length === 0) {
        if (type === ";") {
          node2.source.end = this.getPosition(token[2]);
          node2.source.end.offset++;
          this.semicolon = true;
          break;
        } else if (type === "{") {
          open = true;
          break;
        } else if (type === "}") {
          if (params.length > 0) {
            shift = params.length - 1;
            prev = params[shift];
            while (prev && prev[0] === "space") {
              prev = params[--shift];
            }
            if (prev) {
              node2.source.end = this.getPosition(prev[3] || prev[2]);
              node2.source.end.offset++;
            }
          }
          this.end(token);
          break;
        } else {
          params.push(token);
        }
      } else {
        params.push(token);
      }
      if (this.tokenizer.endOfFile()) {
        last = true;
        break;
      }
    }
    node2.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node2.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node2, "params", params);
      if (last) {
        token = params[params.length - 1];
        node2.source.end = this.getPosition(token[3] || token[2]);
        node2.source.end.offset++;
        this.spaces = node2.raws.between;
        node2.raws.between = "";
      }
    } else {
      node2.raws.afterName = "";
      node2.params = "";
    }
    if (open) {
      node2.nodes = [];
      this.current = node2;
    }
  }
  checkMissedSemicolon(tokens) {
    let colon2 = this.colon(tokens);
    if (colon2 === false)
      return;
    let founded = 0;
    let token;
    for (let j = colon2 - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2)
          break;
      }
    }
    throw this.input.error(
      "Missed semicolon",
      token[0] === "word" ? token[3] + 1 : token[2]
    );
  }
  colon(tokens) {
    let brackets = 0;
    let token, type, prev;
    for (let [i, element] of tokens.entries()) {
      token = element;
      type = token[0];
      if (type === "(") {
        brackets += 1;
      }
      if (type === ")") {
        brackets -= 1;
      }
      if (brackets === 0 && type === ":") {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === "word" && prev[1] === "progid") {
          continue;
        } else {
          return i;
        }
      }
      prev = token;
    }
    return false;
  }
  comment(token) {
    let node2 = new Comment$3();
    this.init(node2, token[2]);
    node2.source.end = this.getPosition(token[3] || token[2]);
    node2.source.end.offset++;
    let text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node2.text = "";
      node2.raws.left = text;
      node2.raws.right = "";
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
      node2.text = match[2];
      node2.raws.left = match[1];
      node2.raws.right = match[3];
    }
  }
  createTokenizer() {
    this.tokenizer = tokenizer(this.input);
  }
  decl(tokens, customProperty) {
    let node2 = new Declaration$3();
    this.init(node2, tokens[0][2]);
    let last = tokens[tokens.length - 1];
    if (last[0] === ";") {
      this.semicolon = true;
      tokens.pop();
    }
    node2.source.end = this.getPosition(
      last[3] || last[2] || findLastWithPosition(tokens)
    );
    node2.source.end.offset++;
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1)
        this.unknownWord(tokens);
      node2.raws.before += tokens.shift()[1];
    }
    node2.source.start = this.getPosition(tokens[0][2]);
    node2.prop = "";
    while (tokens.length) {
      let type = tokens[0][0];
      if (type === ":" || type === "space" || type === "comment") {
        break;
      }
      node2.prop += tokens.shift()[1];
    }
    node2.raws.between = "";
    let token;
    while (tokens.length) {
      token = tokens.shift();
      if (token[0] === ":") {
        node2.raws.between += token[1];
        break;
      } else {
        if (token[0] === "word" && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node2.raws.between += token[1];
      }
    }
    if (node2.prop[0] === "_" || node2.prop[0] === "*") {
      node2.raws.before += node2.prop[0];
      node2.prop = node2.prop.slice(1);
    }
    let firstSpaces = [];
    let next;
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];
      if (token[1].toLowerCase() === "!important") {
        node2.important = true;
        let string3 = this.stringFrom(tokens, i);
        string3 = this.spacesFromEnd(tokens) + string3;
        if (string3 !== " !important")
          node2.raws.important = string3;
        break;
      } else if (token[1].toLowerCase() === "important") {
        let cache2 = tokens.slice(0);
        let str2 = "";
        for (let j = i; j > 0; j--) {
          let type = cache2[j][0];
          if (str2.trim().indexOf("!") === 0 && type !== "space") {
            break;
          }
          str2 = cache2.pop()[1] + str2;
        }
        if (str2.trim().indexOf("!") === 0) {
          node2.important = true;
          node2.raws.important = str2;
          tokens = cache2;
        }
      }
      if (token[0] !== "space" && token[0] !== "comment") {
        break;
      }
    }
    let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
    if (hasWord) {
      node2.raws.between += firstSpaces.map((i) => i[1]).join("");
      firstSpaces = [];
    }
    this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
    if (node2.value.includes(":") && !customProperty) {
      this.checkMissedSemicolon(tokens);
    }
  }
  doubleColon(token) {
    throw this.input.error(
      "Double colon",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
  emptyRule(token) {
    let node2 = new Rule$3();
    this.init(node2, token[2]);
    node2.selector = "";
    node2.raws.between = "";
    this.current = node2;
  }
  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.spaces = "";
    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2]);
      this.current.source.end.offset++;
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }
  endFile() {
    if (this.current.parent)
      this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = "";
      }
    }
  }
  // Helpers
  getPosition(offset) {
    let pos = this.input.fromOffset(offset);
    return {
      column: pos.col,
      line: pos.line,
      offset
    };
  }
  init(node2, offset) {
    this.current.push(node2);
    node2.source = {
      input: this.input,
      start: this.getPosition(offset)
    };
    node2.raws.before = this.spaces;
    this.spaces = "";
    if (node2.type !== "comment")
      this.semicolon = false;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon2 = false;
    let bracket = null;
    let brackets = [];
    let customProperty = start[1].startsWith("--");
    let tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket)
          bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon2 && type === "{") {
        if (!bracket)
          bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon2) {
            this.decl(tokens, customProperty);
            return;
          } else {
            break;
          }
        } else if (type === "{") {
          this.rule(tokens);
          return;
        } else if (type === "}") {
          this.tokenizer.back(tokens.pop());
          end = true;
          break;
        } else if (type === ":") {
          colon2 = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0)
          bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile())
      end = true;
    if (brackets.length > 0)
      this.unclosedBracket(bracket);
    if (end && colon2) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment")
            break;
          this.tokenizer.back(tokens.pop());
        }
      }
      this.decl(tokens, customProperty);
    } else {
      this.unknownWord(tokens);
    }
  }
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      switch (token[0]) {
        case "space":
          this.spaces += token[1];
          break;
        case ";":
          this.freeSemicolon(token);
          break;
        case "}":
          this.end(token);
          break;
        case "comment":
          this.comment(token);
          break;
        case "at-word":
          this.atrule(token);
          break;
        case "{":
          this.emptyRule(token);
          break;
        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(node2, prop, tokens, customProperty) {
    let token, type;
    let length2 = tokens.length;
    let value2 = "";
    let clean = true;
    let next, prev;
    for (let i = 0; i < length2; i += 1) {
      token = tokens[i];
      type = token[0];
      if (type === "space" && i === length2 - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
        next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value2.slice(-1) === ",") {
            clean = false;
          } else {
            value2 += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value2 += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], "");
      node2.raws[prop] = { raw, value: value2 };
    }
    node2[prop] = value2;
  }
  rule(tokens) {
    tokens.pop();
    let node2 = new Rule$3();
    this.init(node2, tokens[0][2]);
    node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node2, "selector", tokens);
    this.current = node2;
  }
  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space" && lastTokenType !== "comment")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  // Errors
  spacesAndCommentsFromStart(tokens) {
    let next;
    let spaces = "";
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  stringFrom(tokens, from) {
    let result2 = "";
    for (let i = from; i < tokens.length; i++) {
      result2 += tokens[i][1];
    }
    tokens.splice(from, tokens.length - from);
    return result2;
  }
  unclosedBlock() {
    let pos = this.current.source.start;
    throw this.input.error("Unclosed block", pos.line, pos.column);
  }
  unclosedBracket(bracket) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    );
  }
  unexpectedClose(token) {
    throw this.input.error(
      "Unexpected }",
      { offset: token[2] },
      { offset: token[2] + 1 }
    );
  }
  unknownWord(tokens) {
    throw this.input.error(
      "Unknown word",
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    );
  }
  unnamedAtrule(node2, token) {
    throw this.input.error(
      "At-rule without name",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
};
var parser$3 = Parser$1;
let Container$3 = container$1;
let Parser = parser$3;
let Input$3 = input;
function parse$9(css, opts) {
  let input2 = new Input$3(css, opts);
  let parser2 = new Parser(input2);
  try {
    parser2.parse();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      if (e.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e;
  }
  return parser2.root;
}
var parse_1 = parse$9;
parse$9.default = parse$9;
Container$3.registerParse(parse$9);
let { isClean, my } = symbols;
let MapGenerator$1 = mapGenerator;
let stringify$3 = stringify_1;
let Container$2 = container$1;
let Document$3 = document$2;
let warnOnce$1 = warnOnce$2;
let Result$3 = result;
let parse$8 = parse_1;
let Root$4 = root$3;
const TYPE_TO_CLASS_NAME = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
};
const PLUGIN_PROPS = {
  AtRule: true,
  AtRuleExit: true,
  Comment: true,
  CommentExit: true,
  Declaration: true,
  DeclarationExit: true,
  Document: true,
  DocumentExit: true,
  Once: true,
  OnceExit: true,
  postcssPlugin: true,
  prepare: true,
  Root: true,
  RootExit: true,
  Rule: true,
  RuleExit: true
};
const NOT_VISITORS = {
  Once: true,
  postcssPlugin: true,
  prepare: true
};
const CHILDREN = 0;
function isPromise(obj2) {
  return typeof obj2 === "object" && typeof obj2.then === "function";
}
function getEvents(node2) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME[node2.type];
  if (node2.type === "decl") {
    key = node2.prop.toLowerCase();
  } else if (node2.type === "atrule") {
    key = node2.name.toLowerCase();
  }
  if (key && node2.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node2.append) {
    return [type, CHILDREN, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack(node2) {
  let events;
  if (node2.type === "document") {
    events = ["Document", CHILDREN, "DocumentExit"];
  } else if (node2.type === "root") {
    events = ["Root", CHILDREN, "RootExit"];
  } else {
    events = getEvents(node2);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node: node2,
    visitorIndex: 0,
    visitors: []
  };
}
function cleanMarks(node2) {
  node2[isClean] = false;
  if (node2.nodes)
    node2.nodes.forEach((i) => cleanMarks(i));
  return node2;
}
let postcss$6 = {};
let LazyResult$2 = class LazyResult2 {
  constructor(processor2, css, opts) {
    this.stringified = false;
    this.processed = false;
    let root3;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root3 = cleanMarks(css);
    } else if (css instanceof LazyResult2 || css instanceof Result$3) {
      root3 = cleanMarks(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined")
          opts.map = {};
        if (!opts.map.inline)
          opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser2 = parse$8;
      if (opts.syntax)
        parser2 = opts.syntax.parse;
      if (opts.parser)
        parser2 = opts.parser;
      if (parser2.parse)
        parser2 = parser2.parse;
      try {
        root3 = parser2(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root3 && !root3[my]) {
        Container$2.rebuild(root3);
      }
    }
    this.result = new Result$3(processor2, root3, opts);
    this.helpers = { ...postcss$6, postcss: postcss$6, result: this.result };
    this.plugins = this.processor.plugins.map((plugin3) => {
      if (typeof plugin3 === "object" && plugin3.prepare) {
        return { ...plugin3, ...plugin3.prepare(this.result) };
      } else {
        return plugin3;
      }
    });
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    if (this.processed)
      return Promise.resolve(this.result);
    if (!this.processing) {
      this.processing = this.runAsync();
    }
    return this.processing;
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(error, node2) {
    let plugin3 = this.result.lastPlugin;
    try {
      if (node2)
        node2.addToError(error);
      this.error = error;
      if (error.name === "CssSyntaxError" && !error.plugin) {
        error.plugin = plugin3.postcssPlugin;
        error.setMessage();
      } else if (plugin3.postcssVersion) {
        if (process.env.NODE_ENV !== "production") {
          let pluginName = plugin3.postcssPlugin;
          let pluginVer = plugin3.postcssVersion;
          let runtimeVer = this.result.processor.version;
          let a = pluginVer.split(".");
          let b = runtimeVer.split(".");
          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
            console.error(
              "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
            );
          }
        }
      }
    } catch (err) {
      if (console && console.error)
        console.error(err);
    }
    return error;
  }
  prepareVisitors() {
    this.listeners = {};
    let add = (plugin3, type, cb) => {
      if (!this.listeners[type])
        this.listeners[type] = [];
      this.listeners[type].push([plugin3, cb]);
    };
    for (let plugin3 of this.plugins) {
      if (typeof plugin3 === "object") {
        for (let event in plugin3) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin3.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin3[event] === "object") {
              for (let filter in plugin3[event]) {
                if (filter === "*") {
                  add(plugin3, event, plugin3[event][filter]);
                } else {
                  add(
                    plugin3,
                    event + "-" + filter.toLowerCase(),
                    plugin3[event][filter]
                  );
                }
              }
            } else if (typeof plugin3[event] === "function") {
              add(plugin3, event, plugin3[event]);
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let i = 0; i < this.plugins.length; i++) {
      let plugin3 = this.plugins[i];
      let promise = this.runOnRoot(plugin3);
      if (isPromise(promise)) {
        try {
          await promise;
        } catch (error) {
          throw this.handleError(error);
        }
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root3 = this.result.root;
      while (!root3[isClean]) {
        root3[isClean] = true;
        let stack = [toStack(root3)];
        while (stack.length > 0) {
          let promise = this.visitTick(stack);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (e) {
              let node2 = stack[stack.length - 1].node;
              throw this.handleError(e, node2);
            }
          }
        }
      }
      if (this.listeners.OnceExit) {
        for (let [plugin3, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin3;
          try {
            if (root3.type === "document") {
              let roots = root3.nodes.map(
                (subRoot) => visitor(subRoot, this.helpers)
              );
              await Promise.all(roots);
            } else {
              await visitor(root3, this.helpers);
            }
          } catch (e) {
            throw this.handleError(e);
          }
        }
      }
    }
    this.processed = true;
    return this.stringify();
  }
  runOnRoot(plugin3) {
    this.result.lastPlugin = plugin3;
    try {
      if (typeof plugin3 === "object" && plugin3.Once) {
        if (this.result.root.type === "document") {
          let roots = this.result.root.nodes.map(
            (root3) => plugin3.Once(root3, this.helpers)
          );
          if (isPromise(roots[0])) {
            return Promise.all(roots);
          }
          return roots;
        }
        return plugin3.Once(this.result.root, this.helpers);
      } else if (typeof plugin3 === "function") {
        return plugin3(this.result.root, this.result);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  stringify() {
    if (this.error)
      throw this.error;
    if (this.stringified)
      return this.result;
    this.stringified = true;
    this.sync();
    let opts = this.result.opts;
    let str2 = stringify$3;
    if (opts.syntax)
      str2 = opts.syntax.stringify;
    if (opts.stringifier)
      str2 = opts.stringifier;
    if (str2.stringify)
      str2 = str2.stringify;
    let map = new MapGenerator$1(str2, this.result.root, this.result.opts);
    let data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  sync() {
    if (this.error)
      throw this.error;
    if (this.processed)
      return this.result;
    this.processed = true;
    if (this.processing) {
      throw this.getAsyncError();
    }
    for (let plugin3 of this.plugins) {
      let promise = this.runOnRoot(plugin3);
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root3 = this.result.root;
      while (!root3[isClean]) {
        root3[isClean] = true;
        this.walkSync(root3);
      }
      if (this.listeners.OnceExit) {
        if (root3.type === "document") {
          for (let subRoot of root3.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root3);
        }
      }
    }
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this.opts)) {
        warnOnce$1(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this.css;
  }
  visitSync(visitors, node2) {
    for (let [plugin3, visitor] of visitors) {
      this.result.lastPlugin = plugin3;
      let promise;
      try {
        promise = visitor(node2, this.helpers);
      } catch (e) {
        throw this.handleError(e, node2.proxyOf);
      }
      if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
        return true;
      }
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
  }
  visitTick(stack) {
    let visit = stack[stack.length - 1];
    let { node: node2, visitors } = visit;
    if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
      stack.pop();
      return;
    }
    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      let [plugin3, visitor] = visitors[visit.visitorIndex];
      visit.visitorIndex += 1;
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = [];
        visit.visitorIndex = 0;
      }
      this.result.lastPlugin = plugin3;
      try {
        return visitor(node2.toProxy(), this.helpers);
      } catch (e) {
        throw this.handleError(e, node2);
      }
    }
    if (visit.iterator !== 0) {
      let iterator = visit.iterator;
      let child;
      while (child = node2.nodes[node2.indexes[iterator]]) {
        node2.indexes[iterator] += 1;
        if (!child[isClean]) {
          child[isClean] = true;
          stack.push(toStack(child));
          return;
        }
      }
      visit.iterator = 0;
      delete node2.indexes[iterator];
    }
    let events = visit.events;
    while (visit.eventIndex < events.length) {
      let event = events[visit.eventIndex];
      visit.eventIndex += 1;
      if (event === CHILDREN) {
        if (node2.nodes && node2.nodes.length) {
          node2[isClean] = true;
          visit.iterator = node2.getIterator();
        }
        return;
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event];
        return;
      }
    }
    stack.pop();
  }
  walkSync(node2) {
    node2[isClean] = true;
    let events = getEvents(node2);
    for (let event of events) {
      if (event === CHILDREN) {
        if (node2.nodes) {
          node2.each((child) => {
            if (!child[isClean])
              this.walkSync(child);
          });
        }
      } else {
        let visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node2.toProxy()))
            return;
        }
      }
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
LazyResult$2.registerPostcss = (dependant) => {
  postcss$6 = dependant;
};
var lazyResult = LazyResult$2;
LazyResult$2.default = LazyResult$2;
Root$4.registerLazyResult(LazyResult$2);
Document$3.registerLazyResult(LazyResult$2);
let MapGenerator = mapGenerator;
let stringify$2 = stringify_1;
let warnOnce = warnOnce$2;
let parse$7 = parse_1;
const Result$2 = result;
let NoWorkResult$1 = class NoWorkResult2 {
  constructor(processor2, css, opts) {
    css = css.toString();
    this.stringified = false;
    this._processor = processor2;
    this._css = css;
    this._opts = opts;
    this._map = void 0;
    let root3;
    let str2 = stringify$2;
    this.result = new Result$2(this._processor, root3, this._opts);
    this.result.css = css;
    let self2 = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self2.root;
      }
    });
    let map = new MapGenerator(str2, root3, this._opts, css);
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate();
      if (generatedCSS) {
        this.result.css = generatedCSS;
      }
      if (generatedMap) {
        this.result.map = generatedMap;
      }
    } else {
      map.clearAnnotation();
      this.result.css = map.css;
    }
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  sync() {
    if (this.error)
      throw this.error;
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this._opts)) {
        warnOnce(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
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
    if (this._root) {
      return this._root;
    }
    let root3;
    let parser2 = parse$7;
    try {
      root3 = parser2(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root3;
      return root3;
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var noWorkResult = NoWorkResult$1;
NoWorkResult$1.default = NoWorkResult$1;
let NoWorkResult = noWorkResult;
let LazyResult$1 = lazyResult;
let Document$2 = document$2;
let Root$3 = root$3;
let Processor$2 = class Processor2 {
  constructor(plugins = []) {
    this.version = "8.4.38";
    this.plugins = this.normalize(plugins);
  }
  normalize(plugins) {
    let normalized = [];
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i();
      } else if (i.postcss) {
        i = i.postcss;
      }
      if (typeof i === "object" && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === "object" && i.postcssPlugin) {
        normalized.push(i);
      } else if (typeof i === "function") {
        normalized.push(i);
      } else if (typeof i === "object" && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
        }
      } else {
        throw new Error(i + " is not a PostCSS plugin");
      }
    }
    return normalized;
  }
  process(css, opts = {}) {
    if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
      return new NoWorkResult(this, css, opts);
    } else {
      return new LazyResult$1(this, css, opts);
    }
  }
  use(plugin3) {
    this.plugins = this.plugins.concat(this.normalize([plugin3]));
    return this;
  }
};
var processor$1 = Processor$2;
Processor$2.default = Processor$2;
Root$3.registerProcessor(Processor$2);
Document$2.registerProcessor(Processor$2);
let Declaration$2 = declaration;
let PreviousMap = previousMap;
let Comment$2 = comment$4;
let AtRule$2 = atRule$3;
let Input$2 = input;
let Root$2 = root$3;
let Rule$2 = rule$1;
function fromJSON$2(json, inputs) {
  if (Array.isArray(json))
    return json.map((n) => fromJSON$2(n));
  let { inputs: ownInputs, ...defaults3 } = json;
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = { ...input2, __proto__: Input$2.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap.prototype
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults3.nodes) {
    defaults3.nodes = json.nodes.map((n) => fromJSON$2(n, inputs));
  }
  if (defaults3.source) {
    let { inputId, ...source } = defaults3.source;
    defaults3.source = source;
    if (inputId != null) {
      defaults3.source.input = inputs[inputId];
    }
  }
  if (defaults3.type === "root") {
    return new Root$2(defaults3);
  } else if (defaults3.type === "decl") {
    return new Declaration$2(defaults3);
  } else if (defaults3.type === "rule") {
    return new Rule$2(defaults3);
  } else if (defaults3.type === "comment") {
    return new Comment$2(defaults3);
  } else if (defaults3.type === "atrule") {
    return new AtRule$2(defaults3);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
var fromJSON_1 = fromJSON$2;
fromJSON$2.default = fromJSON$2;
let CssSyntaxError$1 = cssSyntaxError;
let Declaration$1 = declaration;
let LazyResult = lazyResult;
let Container$1 = container$1;
let Processor$1 = processor$1;
let stringify$1 = stringify_1;
let fromJSON$1 = fromJSON_1;
let Document$1 = document$2;
let Warning$1 = warning;
let Comment$1 = comment$4;
let AtRule$1 = atRule$3;
let Result$1 = result;
let Input$1 = input;
let parse$6 = parse_1;
let list$2 = list_1;
let Rule$1 = rule$1;
let Root$1 = root$3;
let Node$1 = node$1;
function postcss$4(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor$1(plugins);
}
postcss$4.plugin = function plugin2(name, initializer) {
  let warningPrinted = false;
  function creator(...args) {
    if (console && console.warn && !warningPrinted) {
      warningPrinted = true;
      console.warn(
        name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
      );
      if (process.env.LANG && process.env.LANG.startsWith("cn")) {
        console.warn(
          name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
        );
      }
    }
    let transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor$1().version;
    return transformer;
  }
  let cache2;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache2)
        cache2 = creator();
      return cache2;
    }
  });
  creator.process = function(css, processOpts, pluginOpts) {
    return postcss$4([creator(pluginOpts)]).process(css, processOpts);
  };
  return creator;
};
postcss$4.stringify = stringify$1;
postcss$4.parse = parse$6;
postcss$4.fromJSON = fromJSON$1;
postcss$4.list = list$2;
postcss$4.comment = (defaults3) => new Comment$1(defaults3);
postcss$4.atRule = (defaults3) => new AtRule$1(defaults3);
postcss$4.decl = (defaults3) => new Declaration$1(defaults3);
postcss$4.rule = (defaults3) => new Rule$1(defaults3);
postcss$4.root = (defaults3) => new Root$1(defaults3);
postcss$4.document = (defaults3) => new Document$1(defaults3);
postcss$4.CssSyntaxError = CssSyntaxError$1;
postcss$4.Declaration = Declaration$1;
postcss$4.Container = Container$1;
postcss$4.Processor = Processor$1;
postcss$4.Document = Document$1;
postcss$4.Comment = Comment$1;
postcss$4.Warning = Warning$1;
postcss$4.AtRule = AtRule$1;
postcss$4.Result = Result$1;
postcss$4.Input = Input$1;
postcss$4.Rule = Rule$1;
postcss$4.Root = Root$1;
postcss$4.Node = Node$1;
LazyResult.registerPostcss(postcss$4);
var postcss_1 = postcss$4;
postcss$4.default = postcss$4;
const postcss$5 = /* @__PURE__ */ getDefaultExportFromCjs(postcss_1);
const stringify = postcss$5.stringify;
const fromJSON = postcss$5.fromJSON;
const plugin = postcss$5.plugin;
const parse$5 = postcss$5.parse;
const list$1 = postcss$5.list;
const document$1 = postcss$5.document;
const comment$3 = postcss$5.comment;
const atRule$2 = postcss$5.atRule;
const rule = postcss$5.rule;
const decl$1 = postcss$5.decl;
const root$2 = postcss$5.root;
const CssSyntaxError = postcss$5.CssSyntaxError;
const Declaration = postcss$5.Declaration;
const Container = postcss$5.Container;
const Processor = postcss$5.Processor;
const Document = postcss$5.Document;
const Comment = postcss$5.Comment;
const Warning = postcss$5.Warning;
const AtRule = postcss$5.AtRule;
const Result = postcss$5.Result;
const Input = postcss$5.Input;
const Rule = postcss$5.Rule;
const Root = postcss$5.Root;
const Node = postcss$5.Node;
const postcss$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtRule,
  Comment,
  Container,
  CssSyntaxError,
  Declaration,
  Document,
  Input,
  Node,
  Processor,
  Result,
  Root,
  Rule,
  Warning,
  atRule: atRule$2,
  comment: comment$3,
  decl: decl$1,
  default: postcss$5,
  document: document$1,
  fromJSON,
  list: list$1,
  parse: parse$5,
  plugin,
  root: root$2,
  rule,
  stringify
}, Symbol.toStringTag, { value: "Module" }));
var dist = { exports: {} };
var processor = { exports: {} };
var parser$2 = { exports: {} };
var root$1 = { exports: {} };
var container = { exports: {} };
var node = { exports: {} };
var util = {};
var unesc = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = unesc2;
  function gobbleHex(str2) {
    var lower = str2.toLowerCase();
    var hex = "";
    var spaceTerminated = false;
    for (var i = 0; i < 6 && lower[i] !== void 0; i++) {
      var code = lower.charCodeAt(i);
      var valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
      spaceTerminated = code === 32;
      if (!valid) {
        break;
      }
      hex += lower[i];
    }
    if (hex.length === 0) {
      return void 0;
    }
    var codePoint = parseInt(hex, 16);
    var isSurrogate = codePoint >= 55296 && codePoint <= 57343;
    if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
      return ["�", hex.length + (spaceTerminated ? 1 : 0)];
    }
    return [String.fromCodePoint(codePoint), hex.length + (spaceTerminated ? 1 : 0)];
  }
  var CONTAINS_ESCAPE = /\\/;
  function unesc2(str2) {
    var needToProcess = CONTAINS_ESCAPE.test(str2);
    if (!needToProcess) {
      return str2;
    }
    var ret = "";
    for (var i = 0; i < str2.length; i++) {
      if (str2[i] === "\\") {
        var gobbled = gobbleHex(str2.slice(i + 1, i + 7));
        if (gobbled !== void 0) {
          ret += gobbled[0];
          i += gobbled[1];
          continue;
        }
        if (str2[i + 1] === "\\") {
          ret += "\\";
          i++;
          continue;
        }
        if (str2.length === i + 1) {
          ret += str2[i];
        }
        continue;
      }
      ret += str2[i];
    }
    return ret;
  }
  module2.exports = exports2.default;
})(unesc, unesc.exports);
var unescExports = unesc.exports;
const unescape$1 = /* @__PURE__ */ getDefaultExportFromCjs(unescExports);
var getProp = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = getProp2;
  function getProp2(obj2) {
    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }
    while (props.length > 0) {
      var prop = props.shift();
      if (!obj2[prop]) {
        return void 0;
      }
      obj2 = obj2[prop];
    }
    return obj2;
  }
  module2.exports = exports2.default;
})(getProp, getProp.exports);
var getPropExports = getProp.exports;
var ensureObject = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = ensureObject2;
  function ensureObject2(obj2) {
    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }
    while (props.length > 0) {
      var prop = props.shift();
      if (!obj2[prop]) {
        obj2[prop] = {};
      }
      obj2 = obj2[prop];
    }
  }
  module2.exports = exports2.default;
})(ensureObject, ensureObject.exports);
var ensureObjectExports = ensureObject.exports;
var stripComments = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = stripComments2;
  function stripComments2(str2) {
    var s2 = "";
    var commentStart = str2.indexOf("/*");
    var lastEnd = 0;
    while (commentStart >= 0) {
      s2 = s2 + str2.slice(lastEnd, commentStart);
      var commentEnd = str2.indexOf("*/", commentStart + 2);
      if (commentEnd < 0) {
        return s2;
      }
      lastEnd = commentEnd + 2;
      commentStart = str2.indexOf("/*", lastEnd);
    }
    s2 = s2 + str2.slice(lastEnd);
    return s2;
  }
  module2.exports = exports2.default;
})(stripComments, stripComments.exports);
var stripCommentsExports = stripComments.exports;
util.__esModule = true;
util.unesc = util.stripComments = util.getProp = util.ensureObject = void 0;
var _unesc = _interopRequireDefault$1(unescExports);
util.unesc = _unesc["default"];
var _getProp = _interopRequireDefault$1(getPropExports);
util.getProp = _getProp["default"];
var _ensureObject = _interopRequireDefault$1(ensureObjectExports);
util.ensureObject = _ensureObject["default"];
var _stripComments = _interopRequireDefault$1(stripCommentsExports);
util.stripComments = _stripComments["default"];
function _interopRequireDefault$1(obj2) {
  return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
}
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _util = util;
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  var cloneNode2 = function cloneNode3(obj2, parent) {
    if (typeof obj2 !== "object" || obj2 === null) {
      return obj2;
    }
    var cloned = new obj2.constructor();
    for (var i in obj2) {
      if (!obj2.hasOwnProperty(i)) {
        continue;
      }
      var value2 = obj2[i];
      var type = typeof value2;
      if (i === "parent" && type === "object") {
        if (parent) {
          cloned[i] = parent;
        }
      } else if (value2 instanceof Array) {
        cloned[i] = value2.map(function(j) {
          return cloneNode3(j, cloned);
        });
      } else {
        cloned[i] = cloneNode3(value2, cloned);
      }
    }
    return cloned;
  };
  var Node3 = /* @__PURE__ */ function() {
    function Node4(opts) {
      if (opts === void 0) {
        opts = {};
      }
      Object.assign(this, opts);
      this.spaces = this.spaces || {};
      this.spaces.before = this.spaces.before || "";
      this.spaces.after = this.spaces.after || "";
    }
    var _proto = Node4.prototype;
    _proto.remove = function remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      this.parent = void 0;
      return this;
    };
    _proto.replaceWith = function replaceWith() {
      if (this.parent) {
        for (var index2 in arguments) {
          this.parent.insertBefore(this, arguments[index2]);
        }
        this.remove();
      }
      return this;
    };
    _proto.next = function next() {
      return this.parent.at(this.parent.index(this) + 1);
    };
    _proto.prev = function prev() {
      return this.parent.at(this.parent.index(this) - 1);
    };
    _proto.clone = function clone(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }
      var cloned = cloneNode2(this);
      for (var name in overrides) {
        cloned[name] = overrides[name];
      }
      return cloned;
    };
    _proto.appendToPropertyAndEscape = function appendToPropertyAndEscape(name, value2, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }
      var originalValue = this[name];
      var originalEscaped = this.raws[name];
      this[name] = originalValue + value2;
      if (originalEscaped || valueEscaped !== value2) {
        this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
      } else {
        delete this.raws[name];
      }
    };
    _proto.setPropertyAndEscape = function setPropertyAndEscape(name, value2, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }
      this[name] = value2;
      this.raws[name] = valueEscaped;
    };
    _proto.setPropertyWithoutEscape = function setPropertyWithoutEscape(name, value2) {
      this[name] = value2;
      if (this.raws) {
        delete this.raws[name];
      }
    };
    _proto.isAtPosition = function isAtPosition(line, column) {
      if (this.source && this.source.start && this.source.end) {
        if (this.source.start.line > line) {
          return false;
        }
        if (this.source.end.line < line) {
          return false;
        }
        if (this.source.start.line === line && this.source.start.column > column) {
          return false;
        }
        if (this.source.end.line === line && this.source.end.column < column) {
          return false;
        }
        return true;
      }
      return void 0;
    };
    _proto.stringifyProperty = function stringifyProperty(name) {
      return this.raws && this.raws[name] || this[name];
    };
    _proto.valueToString = function valueToString() {
      return String(this.stringifyProperty("value"));
    };
    _proto.toString = function toString() {
      return [this.rawSpaceBefore, this.valueToString(), this.rawSpaceAfter].join("");
    };
    _createClass(Node4, [{
      key: "rawSpaceBefore",
      get: function get() {
        var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.before;
        if (rawSpace === void 0) {
          rawSpace = this.spaces && this.spaces.before;
        }
        return rawSpace || "";
      },
      set: function set(raw) {
        (0, _util.ensureObject)(this, "raws", "spaces");
        this.raws.spaces.before = raw;
      }
    }, {
      key: "rawSpaceAfter",
      get: function get() {
        var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.after;
        if (rawSpace === void 0) {
          rawSpace = this.spaces.after;
        }
        return rawSpace || "";
      },
      set: function set(raw) {
        (0, _util.ensureObject)(this, "raws", "spaces");
        this.raws.spaces.after = raw;
      }
    }]);
    return Node4;
  }();
  exports2["default"] = Node3;
  module2.exports = exports2.default;
})(node, node.exports);
var nodeExports = node.exports;
var types$1 = {};
types$1.__esModule = true;
types$1.UNIVERSAL = types$1.TAG = types$1.STRING = types$1.SELECTOR = types$1.ROOT = types$1.PSEUDO = types$1.NESTING = types$1.ID = types$1.COMMENT = types$1.COMBINATOR = types$1.CLASS = types$1.ATTRIBUTE = void 0;
var TAG = "tag";
types$1.TAG = TAG;
var STRING = "string";
types$1.STRING = STRING;
var SELECTOR = "selector";
types$1.SELECTOR = SELECTOR;
var ROOT = "root";
types$1.ROOT = ROOT;
var PSEUDO = "pseudo";
types$1.PSEUDO = PSEUDO;
var NESTING = "nesting";
types$1.NESTING = NESTING;
var ID = "id";
types$1.ID = ID;
var COMMENT = "comment";
types$1.COMMENT = COMMENT;
var COMBINATOR = "combinator";
types$1.COMBINATOR = COMBINATOR;
var CLASS = "class";
types$1.CLASS = CLASS;
var ATTRIBUTE = "attribute";
types$1.ATTRIBUTE = ATTRIBUTE;
var UNIVERSAL = "universal";
types$1.UNIVERSAL = UNIVERSAL;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var types2 = _interopRequireWildcard(types$1);
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj2, nodeInterop) {
    if (!nodeInterop && obj2 && obj2.__esModule) {
      return obj2;
    }
    if (obj2 === null || typeof obj2 !== "object" && typeof obj2 !== "function") {
      return { "default": obj2 };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj2)) {
      return cache2.get(obj2);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj2) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj2, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj2, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj2[key];
        }
      }
    }
    newObj["default"] = obj2;
    if (cache2) {
      cache2.set(obj2, newObj);
    }
    return newObj;
  }
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it)
      return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      return function() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Container3 = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(Container4, _Node);
    function Container4(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      if (!_this.nodes) {
        _this.nodes = [];
      }
      return _this;
    }
    var _proto = Container4.prototype;
    _proto.append = function append(selector3) {
      selector3.parent = this;
      this.nodes.push(selector3);
      return this;
    };
    _proto.prepend = function prepend(selector3) {
      selector3.parent = this;
      this.nodes.unshift(selector3);
      return this;
    };
    _proto.at = function at2(index2) {
      return this.nodes[index2];
    };
    _proto.index = function index2(child) {
      if (typeof child === "number") {
        return child;
      }
      return this.nodes.indexOf(child);
    };
    _proto.removeChild = function removeChild(child) {
      child = this.index(child);
      this.at(child).parent = void 0;
      this.nodes.splice(child, 1);
      var index2;
      for (var id3 in this.indexes) {
        index2 = this.indexes[id3];
        if (index2 >= child) {
          this.indexes[id3] = index2 - 1;
        }
      }
      return this;
    };
    _proto.removeAll = function removeAll() {
      for (var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step; !(_step = _iterator()).done; ) {
        var node2 = _step.value;
        node2.parent = void 0;
      }
      this.nodes = [];
      return this;
    };
    _proto.empty = function empty() {
      return this.removeAll();
    };
    _proto.insertAfter = function insertAfter(oldNode, newNode) {
      newNode.parent = this;
      var oldIndex = this.index(oldNode);
      this.nodes.splice(oldIndex + 1, 0, newNode);
      newNode.parent = this;
      var index2;
      for (var id3 in this.indexes) {
        index2 = this.indexes[id3];
        if (oldIndex <= index2) {
          this.indexes[id3] = index2 + 1;
        }
      }
      return this;
    };
    _proto.insertBefore = function insertBefore(oldNode, newNode) {
      newNode.parent = this;
      var oldIndex = this.index(oldNode);
      this.nodes.splice(oldIndex, 0, newNode);
      newNode.parent = this;
      var index2;
      for (var id3 in this.indexes) {
        index2 = this.indexes[id3];
        if (index2 <= oldIndex) {
          this.indexes[id3] = index2 + 1;
        }
      }
      return this;
    };
    _proto._findChildAtPosition = function _findChildAtPosition(line, col) {
      var found = void 0;
      this.each(function(node2) {
        if (node2.atPosition) {
          var foundChild = node2.atPosition(line, col);
          if (foundChild) {
            found = foundChild;
            return false;
          }
        } else if (node2.isAtPosition(line, col)) {
          found = node2;
          return false;
        }
      });
      return found;
    };
    _proto.atPosition = function atPosition(line, col) {
      if (this.isAtPosition(line, col)) {
        return this._findChildAtPosition(line, col) || this;
      } else {
        return void 0;
      }
    };
    _proto._inferEndPosition = function _inferEndPosition() {
      if (this.last && this.last.source && this.last.source.end) {
        this.source = this.source || {};
        this.source.end = this.source.end || {};
        Object.assign(this.source.end, this.last.source.end);
      }
    };
    _proto.each = function each(callback3) {
      if (!this.lastEach) {
        this.lastEach = 0;
      }
      if (!this.indexes) {
        this.indexes = {};
      }
      this.lastEach++;
      var id3 = this.lastEach;
      this.indexes[id3] = 0;
      if (!this.length) {
        return void 0;
      }
      var index2, result2;
      while (this.indexes[id3] < this.length) {
        index2 = this.indexes[id3];
        result2 = callback3(this.at(index2), index2);
        if (result2 === false) {
          break;
        }
        this.indexes[id3] += 1;
      }
      delete this.indexes[id3];
      if (result2 === false) {
        return false;
      }
    };
    _proto.walk = function walk(callback3) {
      return this.each(function(node2, i) {
        var result2 = callback3(node2, i);
        if (result2 !== false && node2.length) {
          result2 = node2.walk(callback3);
        }
        if (result2 === false) {
          return false;
        }
      });
    };
    _proto.walkAttributes = function walkAttributes(callback3) {
      var _this2 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.ATTRIBUTE) {
          return callback3.call(_this2, selector3);
        }
      });
    };
    _proto.walkClasses = function walkClasses(callback3) {
      var _this3 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.CLASS) {
          return callback3.call(_this3, selector3);
        }
      });
    };
    _proto.walkCombinators = function walkCombinators(callback3) {
      var _this4 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.COMBINATOR) {
          return callback3.call(_this4, selector3);
        }
      });
    };
    _proto.walkComments = function walkComments(callback3) {
      var _this5 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.COMMENT) {
          return callback3.call(_this5, selector3);
        }
      });
    };
    _proto.walkIds = function walkIds(callback3) {
      var _this6 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.ID) {
          return callback3.call(_this6, selector3);
        }
      });
    };
    _proto.walkNesting = function walkNesting(callback3) {
      var _this7 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.NESTING) {
          return callback3.call(_this7, selector3);
        }
      });
    };
    _proto.walkPseudos = function walkPseudos(callback3) {
      var _this8 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.PSEUDO) {
          return callback3.call(_this8, selector3);
        }
      });
    };
    _proto.walkTags = function walkTags(callback3) {
      var _this9 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.TAG) {
          return callback3.call(_this9, selector3);
        }
      });
    };
    _proto.walkUniversals = function walkUniversals(callback3) {
      var _this10 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types2.UNIVERSAL) {
          return callback3.call(_this10, selector3);
        }
      });
    };
    _proto.split = function split(callback3) {
      var _this11 = this;
      var current = [];
      return this.reduce(function(memo, node2, index2) {
        var split2 = callback3.call(_this11, node2);
        current.push(node2);
        if (split2) {
          memo.push(current);
          current = [];
        } else if (index2 === _this11.length - 1) {
          memo.push(current);
        }
        return memo;
      }, []);
    };
    _proto.map = function map(callback3) {
      return this.nodes.map(callback3);
    };
    _proto.reduce = function reduce(callback3, memo) {
      return this.nodes.reduce(callback3, memo);
    };
    _proto.every = function every(callback3) {
      return this.nodes.every(callback3);
    };
    _proto.some = function some(callback3) {
      return this.nodes.some(callback3);
    };
    _proto.filter = function filter(callback3) {
      return this.nodes.filter(callback3);
    };
    _proto.sort = function sort(callback3) {
      return this.nodes.sort(callback3);
    };
    _proto.toString = function toString() {
      return this.map(String).join("");
    };
    _createClass(Container4, [{
      key: "first",
      get: function get() {
        return this.at(0);
      }
    }, {
      key: "last",
      get: function get() {
        return this.at(this.length - 1);
      }
    }, {
      key: "length",
      get: function get() {
        return this.nodes.length;
      }
    }]);
    return Container4;
  }(_node["default"]);
  exports2["default"] = Container3;
  module2.exports = exports2.default;
})(container, container.exports);
var containerExports = container.exports;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _container = _interopRequireDefault2(containerExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Root3 = /* @__PURE__ */ function(_Container) {
    _inheritsLoose(Root4, _Container);
    function Root4(opts) {
      var _this;
      _this = _Container.call(this, opts) || this;
      _this.type = _types2.ROOT;
      return _this;
    }
    var _proto = Root4.prototype;
    _proto.toString = function toString() {
      var str2 = this.reduce(function(memo, selector3) {
        memo.push(String(selector3));
        return memo;
      }, []).join(",");
      return this.trailingComma ? str2 + "," : str2;
    };
    _proto.error = function error(message, options) {
      if (this._error) {
        return this._error(message, options);
      } else {
        return new Error(message);
      }
    };
    _createClass(Root4, [{
      key: "errorGenerator",
      set: function set(handler) {
        this._error = handler;
      }
    }]);
    return Root4;
  }(_container["default"]);
  exports2["default"] = Root3;
  module2.exports = exports2.default;
})(root$1, root$1.exports);
var rootExports = root$1.exports;
var selector$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _container = _interopRequireDefault2(containerExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Selector = /* @__PURE__ */ function(_Container) {
    _inheritsLoose(Selector2, _Container);
    function Selector2(opts) {
      var _this;
      _this = _Container.call(this, opts) || this;
      _this.type = _types2.SELECTOR;
      return _this;
    }
    return Selector2;
  }(_container["default"]);
  exports2["default"] = Selector;
  module2.exports = exports2.default;
})(selector$1, selector$1.exports);
var selectorExports = selector$1.exports;
var className$1 = { exports: {} };
/*! https://mths.be/cssesc v3.0.0 by @mathias */
var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = function merge2(options, defaults3) {
  if (!options) {
    return defaults3;
  }
  var result2 = {};
  for (var key in defaults3) {
    result2[key] = hasOwnProperty.call(options, key) ? options[key] : defaults3[key];
  }
  return result2;
};
var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
var cssesc = function cssesc2(string3, options) {
  options = merge(options, cssesc2.options);
  if (options.quotes != "single" && options.quotes != "double") {
    options.quotes = "single";
  }
  var quote = options.quotes == "double" ? '"' : "'";
  var isIdentifier2 = options.isIdentifier;
  var firstChar = string3.charAt(0);
  var output = "";
  var counter = 0;
  var length2 = string3.length;
  while (counter < length2) {
    var character = string3.charAt(counter++);
    var codePoint = character.charCodeAt();
    var value2 = void 0;
    if (codePoint < 32 || codePoint > 126) {
      if (codePoint >= 55296 && codePoint <= 56319 && counter < length2) {
        var extra = string3.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
        } else {
          counter--;
        }
      }
      value2 = "\\" + codePoint.toString(16).toUpperCase() + " ";
    } else {
      if (options.escapeEverything) {
        if (regexAnySingleEscape.test(character)) {
          value2 = "\\" + character;
        } else {
          value2 = "\\" + codePoint.toString(16).toUpperCase() + " ";
        }
      } else if (/[\t\n\f\r\x0B]/.test(character)) {
        value2 = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else if (character == "\\" || !isIdentifier2 && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier2 && regexSingleEscape.test(character)) {
        value2 = "\\" + character;
      } else {
        value2 = character;
      }
    }
    output += value2;
  }
  if (isIdentifier2) {
    if (/^-[-\d]/.test(output)) {
      output = "\\-" + output.slice(1);
    } else if (/\d/.test(firstChar)) {
      output = "\\3" + firstChar + " " + output.slice(1);
    }
  }
  output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
    if ($1 && $1.length % 2) {
      return $0;
    }
    return ($1 || "") + $2;
  });
  if (!isIdentifier2 && options.wrap) {
    return quote + output + quote;
  }
  return output;
};
cssesc.options = {
  "escapeEverything": false,
  "isIdentifier": false,
  "quotes": "single",
  "wrap": false
};
cssesc.version = "3.0.0";
var cssesc_1 = cssesc;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _cssesc = _interopRequireDefault2(cssesc_1);
  var _util = util;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var ClassName = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(ClassName2, _Node);
    function ClassName2(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.CLASS;
      _this._constructed = true;
      return _this;
    }
    var _proto = ClassName2.prototype;
    _proto.valueToString = function valueToString() {
      return "." + _Node.prototype.valueToString.call(this);
    };
    _createClass(ClassName2, [{
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(v) {
        if (this._constructed) {
          var escaped = (0, _cssesc["default"])(v, {
            isIdentifier: true
          });
          if (escaped !== v) {
            (0, _util.ensureObject)(this, "raws");
            this.raws.value = escaped;
          } else if (this.raws) {
            delete this.raws.value;
          }
        }
        this._value = v;
      }
    }]);
    return ClassName2;
  }(_node["default"]);
  exports2["default"] = ClassName;
  module2.exports = exports2.default;
})(className$1, className$1.exports);
var classNameExports = className$1.exports;
var comment$2 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Comment3 = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(Comment4, _Node);
    function Comment4(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.COMMENT;
      return _this;
    }
    return Comment4;
  }(_node["default"]);
  exports2["default"] = Comment3;
  module2.exports = exports2.default;
})(comment$2, comment$2.exports);
var commentExports = comment$2.exports;
var id$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var ID2 = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(ID3, _Node);
    function ID3(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.ID;
      return _this;
    }
    var _proto = ID3.prototype;
    _proto.valueToString = function valueToString() {
      return "#" + _Node.prototype.valueToString.call(this);
    };
    return ID3;
  }(_node["default"]);
  exports2["default"] = ID2;
  module2.exports = exports2.default;
})(id$1, id$1.exports);
var idExports = id$1.exports;
var tag$1 = { exports: {} };
var namespace = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _cssesc = _interopRequireDefault2(cssesc_1);
  var _util = util;
  var _node = _interopRequireDefault2(nodeExports);
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Namespace = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(Namespace2, _Node);
    function Namespace2() {
      return _Node.apply(this, arguments) || this;
    }
    var _proto = Namespace2.prototype;
    _proto.qualifiedName = function qualifiedName(value2) {
      if (this.namespace) {
        return this.namespaceString + "|" + value2;
      } else {
        return value2;
      }
    };
    _proto.valueToString = function valueToString() {
      return this.qualifiedName(_Node.prototype.valueToString.call(this));
    };
    _createClass(Namespace2, [{
      key: "namespace",
      get: function get() {
        return this._namespace;
      },
      set: function set(namespace2) {
        if (namespace2 === true || namespace2 === "*" || namespace2 === "&") {
          this._namespace = namespace2;
          if (this.raws) {
            delete this.raws.namespace;
          }
          return;
        }
        var escaped = (0, _cssesc["default"])(namespace2, {
          isIdentifier: true
        });
        this._namespace = namespace2;
        if (escaped !== namespace2) {
          (0, _util.ensureObject)(this, "raws");
          this.raws.namespace = escaped;
        } else if (this.raws) {
          delete this.raws.namespace;
        }
      }
    }, {
      key: "ns",
      get: function get() {
        return this._namespace;
      },
      set: function set(namespace2) {
        this.namespace = namespace2;
      }
    }, {
      key: "namespaceString",
      get: function get() {
        if (this.namespace) {
          var ns = this.stringifyProperty("namespace");
          if (ns === true) {
            return "";
          } else {
            return ns;
          }
        } else {
          return "";
        }
      }
    }]);
    return Namespace2;
  }(_node["default"]);
  exports2["default"] = Namespace;
  module2.exports = exports2.default;
})(namespace, namespace.exports);
var namespaceExports = namespace.exports;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _namespace = _interopRequireDefault2(namespaceExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Tag = /* @__PURE__ */ function(_Namespace) {
    _inheritsLoose(Tag2, _Namespace);
    function Tag2(opts) {
      var _this;
      _this = _Namespace.call(this, opts) || this;
      _this.type = _types2.TAG;
      return _this;
    }
    return Tag2;
  }(_namespace["default"]);
  exports2["default"] = Tag;
  module2.exports = exports2.default;
})(tag$1, tag$1.exports);
var tagExports = tag$1.exports;
var string$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var String2 = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(String3, _Node);
    function String3(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.STRING;
      return _this;
    }
    return String3;
  }(_node["default"]);
  exports2["default"] = String2;
  module2.exports = exports2.default;
})(string$1, string$1.exports);
var stringExports = string$1.exports;
var pseudo$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _container = _interopRequireDefault2(containerExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Pseudo = /* @__PURE__ */ function(_Container) {
    _inheritsLoose(Pseudo2, _Container);
    function Pseudo2(opts) {
      var _this;
      _this = _Container.call(this, opts) || this;
      _this.type = _types2.PSEUDO;
      return _this;
    }
    var _proto = Pseudo2.prototype;
    _proto.toString = function toString() {
      var params = this.length ? "(" + this.map(String).join(",") + ")" : "";
      return [this.rawSpaceBefore, this.stringifyProperty("value"), params, this.rawSpaceAfter].join("");
    };
    return Pseudo2;
  }(_container["default"]);
  exports2["default"] = Pseudo;
  module2.exports = exports2.default;
})(pseudo$1, pseudo$1.exports);
var pseudoExports = pseudo$1.exports;
var attribute$1 = {};
var browser = deprecate;
function deprecate(fn, msg) {
  if (config("noDeprecation")) {
    return fn;
  }
  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config("throwDeprecation")) {
        throw new Error(msg);
      } else if (config("traceDeprecation")) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}
function config(name) {
  try {
    if (!commonjsGlobal.localStorage)
      return false;
  } catch (_) {
    return false;
  }
  var val = commonjsGlobal.localStorage[name];
  if (null == val)
    return false;
  return String(val).toLowerCase() === "true";
}
(function(exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  exports2.unescapeValue = unescapeValue;
  var _cssesc = _interopRequireDefault2(cssesc_1);
  var _unesc2 = _interopRequireDefault2(unescExports);
  var _namespace = _interopRequireDefault2(namespaceExports);
  var _types2 = types$1;
  var _CSSESC_QUOTE_OPTIONS;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var deprecate2 = browser;
  var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
  var warnOfDeprecatedValueAssignment = deprecate2(function() {
  }, "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead.");
  var warnOfDeprecatedQuotedAssignment = deprecate2(function() {
  }, "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.");
  var warnOfDeprecatedConstructor = deprecate2(function() {
  }, "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
  function unescapeValue(value2) {
    var deprecatedUsage = false;
    var quoteMark = null;
    var unescaped = value2;
    var m = unescaped.match(WRAPPED_IN_QUOTES);
    if (m) {
      quoteMark = m[1];
      unescaped = m[2];
    }
    unescaped = (0, _unesc2["default"])(unescaped);
    if (unescaped !== value2) {
      deprecatedUsage = true;
    }
    return {
      deprecatedUsage,
      unescaped,
      quoteMark
    };
  }
  function handleDeprecatedContructorOpts(opts) {
    if (opts.quoteMark !== void 0) {
      return opts;
    }
    if (opts.value === void 0) {
      return opts;
    }
    warnOfDeprecatedConstructor();
    var _unescapeValue = unescapeValue(opts.value), quoteMark = _unescapeValue.quoteMark, unescaped = _unescapeValue.unescaped;
    if (!opts.raws) {
      opts.raws = {};
    }
    if (opts.raws.value === void 0) {
      opts.raws.value = opts.value;
    }
    opts.value = unescaped;
    opts.quoteMark = quoteMark;
    return opts;
  }
  var Attribute = /* @__PURE__ */ function(_Namespace) {
    _inheritsLoose(Attribute2, _Namespace);
    function Attribute2(opts) {
      var _this;
      if (opts === void 0) {
        opts = {};
      }
      _this = _Namespace.call(this, handleDeprecatedContructorOpts(opts)) || this;
      _this.type = _types2.ATTRIBUTE;
      _this.raws = _this.raws || {};
      Object.defineProperty(_this.raws, "unquoted", {
        get: deprecate2(function() {
          return _this.value;
        }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
        set: deprecate2(function() {
          return _this.value;
        }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.")
      });
      _this._constructed = true;
      return _this;
    }
    var _proto = Attribute2.prototype;
    _proto.getQuotedValue = function getQuotedValue(options) {
      if (options === void 0) {
        options = {};
      }
      var quoteMark = this._determineQuoteMark(options);
      var cssescopts = CSSESC_QUOTE_OPTIONS[quoteMark];
      var escaped = (0, _cssesc["default"])(this._value, cssescopts);
      return escaped;
    };
    _proto._determineQuoteMark = function _determineQuoteMark(options) {
      return options.smart ? this.smartQuoteMark(options) : this.preferredQuoteMark(options);
    };
    _proto.setValue = function setValue(value2, options) {
      if (options === void 0) {
        options = {};
      }
      this._value = value2;
      this._quoteMark = this._determineQuoteMark(options);
      this._syncRawValue();
    };
    _proto.smartQuoteMark = function smartQuoteMark(options) {
      var v = this.value;
      var numSingleQuotes = v.replace(/[^']/g, "").length;
      var numDoubleQuotes = v.replace(/[^"]/g, "").length;
      if (numSingleQuotes + numDoubleQuotes === 0) {
        var escaped = (0, _cssesc["default"])(v, {
          isIdentifier: true
        });
        if (escaped === v) {
          return Attribute2.NO_QUOTE;
        } else {
          var pref = this.preferredQuoteMark(options);
          if (pref === Attribute2.NO_QUOTE) {
            var quote = this.quoteMark || options.quoteMark || Attribute2.DOUBLE_QUOTE;
            var opts = CSSESC_QUOTE_OPTIONS[quote];
            var quoteValue = (0, _cssesc["default"])(v, opts);
            if (quoteValue.length < escaped.length) {
              return quote;
            }
          }
          return pref;
        }
      } else if (numDoubleQuotes === numSingleQuotes) {
        return this.preferredQuoteMark(options);
      } else if (numDoubleQuotes < numSingleQuotes) {
        return Attribute2.DOUBLE_QUOTE;
      } else {
        return Attribute2.SINGLE_QUOTE;
      }
    };
    _proto.preferredQuoteMark = function preferredQuoteMark(options) {
      var quoteMark = options.preferCurrentQuoteMark ? this.quoteMark : options.quoteMark;
      if (quoteMark === void 0) {
        quoteMark = options.preferCurrentQuoteMark ? options.quoteMark : this.quoteMark;
      }
      if (quoteMark === void 0) {
        quoteMark = Attribute2.DOUBLE_QUOTE;
      }
      return quoteMark;
    };
    _proto._syncRawValue = function _syncRawValue() {
      var rawValue = (0, _cssesc["default"])(this._value, CSSESC_QUOTE_OPTIONS[this.quoteMark]);
      if (rawValue === this._value) {
        if (this.raws) {
          delete this.raws.value;
        }
      } else {
        this.raws.value = rawValue;
      }
    };
    _proto._handleEscapes = function _handleEscapes(prop, value2) {
      if (this._constructed) {
        var escaped = (0, _cssesc["default"])(value2, {
          isIdentifier: true
        });
        if (escaped !== value2) {
          this.raws[prop] = escaped;
        } else {
          delete this.raws[prop];
        }
      }
    };
    _proto._spacesFor = function _spacesFor(name) {
      var attrSpaces = {
        before: "",
        after: ""
      };
      var spaces = this.spaces[name] || {};
      var rawSpaces = this.raws.spaces && this.raws.spaces[name] || {};
      return Object.assign(attrSpaces, spaces, rawSpaces);
    };
    _proto._stringFor = function _stringFor(name, spaceName, concat) {
      if (spaceName === void 0) {
        spaceName = name;
      }
      if (concat === void 0) {
        concat = defaultAttrConcat;
      }
      var attrSpaces = this._spacesFor(spaceName);
      return concat(this.stringifyProperty(name), attrSpaces);
    };
    _proto.offsetOf = function offsetOf(name) {
      var count = 1;
      var attributeSpaces = this._spacesFor("attribute");
      count += attributeSpaces.before.length;
      if (name === "namespace" || name === "ns") {
        return this.namespace ? count : -1;
      }
      if (name === "attributeNS") {
        return count;
      }
      count += this.namespaceString.length;
      if (this.namespace) {
        count += 1;
      }
      if (name === "attribute") {
        return count;
      }
      count += this.stringifyProperty("attribute").length;
      count += attributeSpaces.after.length;
      var operatorSpaces = this._spacesFor("operator");
      count += operatorSpaces.before.length;
      var operator = this.stringifyProperty("operator");
      if (name === "operator") {
        return operator ? count : -1;
      }
      count += operator.length;
      count += operatorSpaces.after.length;
      var valueSpaces = this._spacesFor("value");
      count += valueSpaces.before.length;
      var value2 = this.stringifyProperty("value");
      if (name === "value") {
        return value2 ? count : -1;
      }
      count += value2.length;
      count += valueSpaces.after.length;
      var insensitiveSpaces = this._spacesFor("insensitive");
      count += insensitiveSpaces.before.length;
      if (name === "insensitive") {
        return this.insensitive ? count : -1;
      }
      return -1;
    };
    _proto.toString = function toString() {
      var _this2 = this;
      var selector3 = [this.rawSpaceBefore, "["];
      selector3.push(this._stringFor("qualifiedAttribute", "attribute"));
      if (this.operator && (this.value || this.value === "")) {
        selector3.push(this._stringFor("operator"));
        selector3.push(this._stringFor("value"));
        selector3.push(this._stringFor("insensitiveFlag", "insensitive", function(attrValue, attrSpaces) {
          if (attrValue.length > 0 && !_this2.quoted && attrSpaces.before.length === 0 && !(_this2.spaces.value && _this2.spaces.value.after)) {
            attrSpaces.before = " ";
          }
          return defaultAttrConcat(attrValue, attrSpaces);
        }));
      }
      selector3.push("]");
      selector3.push(this.rawSpaceAfter);
      return selector3.join("");
    };
    _createClass(Attribute2, [{
      key: "quoted",
      get: function get() {
        var qm = this.quoteMark;
        return qm === "'" || qm === '"';
      },
      set: function set(value2) {
        warnOfDeprecatedQuotedAssignment();
      }
      /**
       * returns a single (`'`) or double (`"`) quote character if the value is quoted.
       * returns `null` if the value is not quoted.
       * returns `undefined` if the quotation state is unknown (this can happen when
       * the attribute is constructed without specifying a quote mark.)
       */
    }, {
      key: "quoteMark",
      get: function get() {
        return this._quoteMark;
      },
      set: function set(quoteMark) {
        if (!this._constructed) {
          this._quoteMark = quoteMark;
          return;
        }
        if (this._quoteMark !== quoteMark) {
          this._quoteMark = quoteMark;
          this._syncRawValue();
        }
      }
    }, {
      key: "qualifiedAttribute",
      get: function get() {
        return this.qualifiedName(this.raws.attribute || this.attribute);
      }
    }, {
      key: "insensitiveFlag",
      get: function get() {
        return this.insensitive ? "i" : "";
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      },
      set: (
        /**
         * Before 3.0, the value had to be set to an escaped value including any wrapped
         * quote marks. In 3.0, the semantics of `Attribute.value` changed so that the value
         * is unescaped during parsing and any quote marks are removed.
         *
         * Because the ambiguity of this semantic change, if you set `attr.value = newValue`,
         * a deprecation warning is raised when the new value contains any characters that would
         * require escaping (including if it contains wrapped quotes).
         *
         * Instead, you should call `attr.setValue(newValue, opts)` and pass options that describe
         * how the new value is quoted.
         */
        function set(v) {
          if (this._constructed) {
            var _unescapeValue2 = unescapeValue(v), deprecatedUsage = _unescapeValue2.deprecatedUsage, unescaped = _unescapeValue2.unescaped, quoteMark = _unescapeValue2.quoteMark;
            if (deprecatedUsage) {
              warnOfDeprecatedValueAssignment();
            }
            if (unescaped === this._value && quoteMark === this._quoteMark) {
              return;
            }
            this._value = unescaped;
            this._quoteMark = quoteMark;
            this._syncRawValue();
          } else {
            this._value = v;
          }
        }
      )
    }, {
      key: "insensitive",
      get: function get() {
        return this._insensitive;
      },
      set: function set(insensitive) {
        if (!insensitive) {
          this._insensitive = false;
          if (this.raws && (this.raws.insensitiveFlag === "I" || this.raws.insensitiveFlag === "i")) {
            this.raws.insensitiveFlag = void 0;
          }
        }
        this._insensitive = insensitive;
      }
    }, {
      key: "attribute",
      get: function get() {
        return this._attribute;
      },
      set: function set(name) {
        this._handleEscapes("attribute", name);
        this._attribute = name;
      }
    }]);
    return Attribute2;
  }(_namespace["default"]);
  exports2["default"] = Attribute;
  Attribute.NO_QUOTE = null;
  Attribute.SINGLE_QUOTE = "'";
  Attribute.DOUBLE_QUOTE = '"';
  var CSSESC_QUOTE_OPTIONS = (_CSSESC_QUOTE_OPTIONS = {
    "'": {
      quotes: "single",
      wrap: true
    },
    '"': {
      quotes: "double",
      wrap: true
    }
  }, _CSSESC_QUOTE_OPTIONS[null] = {
    isIdentifier: true
  }, _CSSESC_QUOTE_OPTIONS);
  function defaultAttrConcat(attrValue, attrSpaces) {
    return "" + attrSpaces.before + attrValue + attrSpaces.after;
  }
})(attribute$1);
var universal$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _namespace = _interopRequireDefault2(namespaceExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Universal = /* @__PURE__ */ function(_Namespace) {
    _inheritsLoose(Universal2, _Namespace);
    function Universal2(opts) {
      var _this;
      _this = _Namespace.call(this, opts) || this;
      _this.type = _types2.UNIVERSAL;
      _this.value = "*";
      return _this;
    }
    return Universal2;
  }(_namespace["default"]);
  exports2["default"] = Universal;
  module2.exports = exports2.default;
})(universal$1, universal$1.exports);
var universalExports = universal$1.exports;
var combinator$2 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Combinator = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(Combinator2, _Node);
    function Combinator2(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.COMBINATOR;
      return _this;
    }
    return Combinator2;
  }(_node["default"]);
  exports2["default"] = Combinator;
  module2.exports = exports2.default;
})(combinator$2, combinator$2.exports);
var combinatorExports = combinator$2.exports;
var nesting$1 = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var _types2 = types$1;
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  var Nesting = /* @__PURE__ */ function(_Node) {
    _inheritsLoose(Nesting2, _Node);
    function Nesting2(opts) {
      var _this;
      _this = _Node.call(this, opts) || this;
      _this.type = _types2.NESTING;
      _this.value = "&";
      return _this;
    }
    return Nesting2;
  }(_node["default"]);
  exports2["default"] = Nesting;
  module2.exports = exports2.default;
})(nesting$1, nesting$1.exports);
var nestingExports = nesting$1.exports;
var sortAscending = { exports: {} };
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = sortAscending2;
  function sortAscending2(list2) {
    return list2.sort(function(a, b) {
      return a - b;
    });
  }
  module2.exports = exports2.default;
})(sortAscending, sortAscending.exports);
var sortAscendingExports = sortAscending.exports;
var tokenize = {};
var tokenTypes = {};
tokenTypes.__esModule = true;
tokenTypes.word = tokenTypes.tilde = tokenTypes.tab = tokenTypes.str = tokenTypes.space = tokenTypes.slash = tokenTypes.singleQuote = tokenTypes.semicolon = tokenTypes.plus = tokenTypes.pipe = tokenTypes.openSquare = tokenTypes.openParenthesis = tokenTypes.newline = tokenTypes.greaterThan = tokenTypes.feed = tokenTypes.equals = tokenTypes.doubleQuote = tokenTypes.dollar = tokenTypes.cr = tokenTypes.comment = tokenTypes.comma = tokenTypes.combinator = tokenTypes.colon = tokenTypes.closeSquare = tokenTypes.closeParenthesis = tokenTypes.caret = tokenTypes.bang = tokenTypes.backslash = tokenTypes.at = tokenTypes.asterisk = tokenTypes.ampersand = void 0;
var ampersand = 38;
tokenTypes.ampersand = ampersand;
var asterisk = 42;
tokenTypes.asterisk = asterisk;
var at = 64;
tokenTypes.at = at;
var comma = 44;
tokenTypes.comma = comma;
var colon = 58;
tokenTypes.colon = colon;
var semicolon = 59;
tokenTypes.semicolon = semicolon;
var openParenthesis = 40;
tokenTypes.openParenthesis = openParenthesis;
var closeParenthesis = 41;
tokenTypes.closeParenthesis = closeParenthesis;
var openSquare = 91;
tokenTypes.openSquare = openSquare;
var closeSquare = 93;
tokenTypes.closeSquare = closeSquare;
var dollar = 36;
tokenTypes.dollar = dollar;
var tilde = 126;
tokenTypes.tilde = tilde;
var caret = 94;
tokenTypes.caret = caret;
var plus = 43;
tokenTypes.plus = plus;
var equals = 61;
tokenTypes.equals = equals;
var pipe = 124;
tokenTypes.pipe = pipe;
var greaterThan = 62;
tokenTypes.greaterThan = greaterThan;
var space = 32;
tokenTypes.space = space;
var singleQuote = 39;
tokenTypes.singleQuote = singleQuote;
var doubleQuote = 34;
tokenTypes.doubleQuote = doubleQuote;
var slash = 47;
tokenTypes.slash = slash;
var bang = 33;
tokenTypes.bang = bang;
var backslash = 92;
tokenTypes.backslash = backslash;
var cr = 13;
tokenTypes.cr = cr;
var feed = 12;
tokenTypes.feed = feed;
var newline = 10;
tokenTypes.newline = newline;
var tab = 9;
tokenTypes.tab = tab;
var str = singleQuote;
tokenTypes.str = str;
var comment$1 = -1;
tokenTypes.comment = comment$1;
var word = -2;
tokenTypes.word = word;
var combinator$1 = -3;
tokenTypes.combinator = combinator$1;
(function(exports2) {
  exports2.__esModule = true;
  exports2.FIELDS = void 0;
  exports2["default"] = tokenize2;
  var t = _interopRequireWildcard(tokenTypes);
  var _unescapable, _wordDelimiters;
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj2, nodeInterop) {
    if (!nodeInterop && obj2 && obj2.__esModule) {
      return obj2;
    }
    if (obj2 === null || typeof obj2 !== "object" && typeof obj2 !== "function") {
      return { "default": obj2 };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj2)) {
      return cache2.get(obj2);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj2) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj2, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj2, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj2[key];
        }
      }
    }
    newObj["default"] = obj2;
    if (cache2) {
      cache2.set(obj2, newObj);
    }
    return newObj;
  }
  var unescapable = (_unescapable = {}, _unescapable[t.tab] = true, _unescapable[t.newline] = true, _unescapable[t.cr] = true, _unescapable[t.feed] = true, _unescapable);
  var wordDelimiters = (_wordDelimiters = {}, _wordDelimiters[t.space] = true, _wordDelimiters[t.tab] = true, _wordDelimiters[t.newline] = true, _wordDelimiters[t.cr] = true, _wordDelimiters[t.feed] = true, _wordDelimiters[t.ampersand] = true, _wordDelimiters[t.asterisk] = true, _wordDelimiters[t.bang] = true, _wordDelimiters[t.comma] = true, _wordDelimiters[t.colon] = true, _wordDelimiters[t.semicolon] = true, _wordDelimiters[t.openParenthesis] = true, _wordDelimiters[t.closeParenthesis] = true, _wordDelimiters[t.openSquare] = true, _wordDelimiters[t.closeSquare] = true, _wordDelimiters[t.singleQuote] = true, _wordDelimiters[t.doubleQuote] = true, _wordDelimiters[t.plus] = true, _wordDelimiters[t.pipe] = true, _wordDelimiters[t.tilde] = true, _wordDelimiters[t.greaterThan] = true, _wordDelimiters[t.equals] = true, _wordDelimiters[t.dollar] = true, _wordDelimiters[t.caret] = true, _wordDelimiters[t.slash] = true, _wordDelimiters);
  var hex = {};
  var hexChars = "0123456789abcdefABCDEF";
  for (var i = 0; i < hexChars.length; i++) {
    hex[hexChars.charCodeAt(i)] = true;
  }
  function consumeWord(css, start) {
    var next = start;
    var code;
    do {
      code = css.charCodeAt(next);
      if (wordDelimiters[code]) {
        return next - 1;
      } else if (code === t.backslash) {
        next = consumeEscape(css, next) + 1;
      } else {
        next++;
      }
    } while (next < css.length);
    return next - 1;
  }
  function consumeEscape(css, start) {
    var next = start;
    var code = css.charCodeAt(next + 1);
    if (unescapable[code])
      ;
    else if (hex[code]) {
      var hexDigits = 0;
      do {
        next++;
        hexDigits++;
        code = css.charCodeAt(next + 1);
      } while (hex[code] && hexDigits < 6);
      if (hexDigits < 6 && code === t.space) {
        next++;
      }
    } else {
      next++;
    }
    return next;
  }
  var FIELDS = {
    TYPE: 0,
    START_LINE: 1,
    START_COL: 2,
    END_LINE: 3,
    END_COL: 4,
    START_POS: 5,
    END_POS: 6
  };
  exports2.FIELDS = FIELDS;
  function tokenize2(input2) {
    var tokens = [];
    var css = input2.css.valueOf();
    var _css = css, length2 = _css.length;
    var offset = -1;
    var line = 1;
    var start = 0;
    var end = 0;
    var code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
    function unclosed(what, fix) {
      if (input2.safe) {
        css += fix;
        next = css.length - 1;
      } else {
        throw input2.error("Unclosed " + what, line, start - offset, start);
      }
    }
    while (start < length2) {
      code = css.charCodeAt(start);
      if (code === t.newline) {
        offset = start;
        line += 1;
      }
      switch (code) {
        case t.space:
        case t.tab:
        case t.newline:
        case t.cr:
        case t.feed:
          next = start;
          do {
            next += 1;
            code = css.charCodeAt(next);
            if (code === t.newline) {
              offset = next;
              line += 1;
            }
          } while (code === t.space || code === t.newline || code === t.tab || code === t.cr || code === t.feed);
          tokenType = t.space;
          endLine = line;
          endColumn = next - offset - 1;
          end = next;
          break;
        case t.plus:
        case t.greaterThan:
        case t.tilde:
        case t.pipe:
          next = start;
          do {
            next += 1;
            code = css.charCodeAt(next);
          } while (code === t.plus || code === t.greaterThan || code === t.tilde || code === t.pipe);
          tokenType = t.combinator;
          endLine = line;
          endColumn = start - offset;
          end = next;
          break;
        case t.asterisk:
        case t.ampersand:
        case t.bang:
        case t.comma:
        case t.equals:
        case t.dollar:
        case t.caret:
        case t.openSquare:
        case t.closeSquare:
        case t.colon:
        case t.semicolon:
        case t.openParenthesis:
        case t.closeParenthesis:
          next = start;
          tokenType = code;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
          break;
        case t.singleQuote:
        case t.doubleQuote:
          quote = code === t.singleQuote ? "'" : '"';
          next = start;
          do {
            escaped = false;
            next = css.indexOf(quote, next + 1);
            if (next === -1) {
              unclosed("quote", quote);
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === t.backslash) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          tokenType = t.str;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
          break;
        default:
          if (code === t.slash && css.charCodeAt(start + 1) === t.asterisk) {
            next = css.indexOf("*/", start + 2) + 1;
            if (next === 0) {
              unclosed("comment", "*/");
            }
            content = css.slice(start, next + 1);
            lines = content.split("\n");
            last = lines.length - 1;
            if (last > 0) {
              nextLine = line + last;
              nextOffset = next - lines[last].length;
            } else {
              nextLine = line;
              nextOffset = offset;
            }
            tokenType = t.comment;
            line = nextLine;
            endLine = nextLine;
            endColumn = next - nextOffset;
          } else if (code === t.slash) {
            next = start;
            tokenType = code;
            endLine = line;
            endColumn = start - offset;
            end = next + 1;
          } else {
            next = consumeWord(css, start);
            tokenType = t.word;
            endLine = line;
            endColumn = next - offset;
          }
          end = next + 1;
          break;
      }
      tokens.push([
        tokenType,
        // [0] Token type
        line,
        // [1] Starting line
        start - offset,
        // [2] Starting column
        endLine,
        // [3] Ending line
        endColumn,
        // [4] Ending column
        start,
        // [5] Start position / Source index
        end
        // [6] End position
      ]);
      if (nextOffset) {
        offset = nextOffset;
        nextOffset = null;
      }
      start = end;
    }
    return tokens;
  }
})(tokenize);
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _root2 = _interopRequireDefault2(rootExports);
  var _selector2 = _interopRequireDefault2(selectorExports);
  var _className2 = _interopRequireDefault2(classNameExports);
  var _comment2 = _interopRequireDefault2(commentExports);
  var _id2 = _interopRequireDefault2(idExports);
  var _tag2 = _interopRequireDefault2(tagExports);
  var _string2 = _interopRequireDefault2(stringExports);
  var _pseudo2 = _interopRequireDefault2(pseudoExports);
  var _attribute2 = _interopRequireWildcard(attribute$1);
  var _universal2 = _interopRequireDefault2(universalExports);
  var _combinator2 = _interopRequireDefault2(combinatorExports);
  var _nesting2 = _interopRequireDefault2(nestingExports);
  var _sortAscending = _interopRequireDefault2(sortAscendingExports);
  var _tokenize = _interopRequireWildcard(tokenize);
  var tokens = _interopRequireWildcard(tokenTypes);
  var types2 = _interopRequireWildcard(types$1);
  var _util = util;
  var _WHITESPACE_TOKENS, _Object$assign;
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj2, nodeInterop) {
    if (!nodeInterop && obj2 && obj2.__esModule) {
      return obj2;
    }
    if (obj2 === null || typeof obj2 !== "object" && typeof obj2 !== "function") {
      return { "default": obj2 };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj2)) {
      return cache2.get(obj2);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj2) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj2, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj2, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj2[key];
        }
      }
    }
    newObj["default"] = obj2;
    if (cache2) {
      cache2.set(obj2, newObj);
    }
    return newObj;
  }
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  var WHITESPACE_TOKENS = (_WHITESPACE_TOKENS = {}, _WHITESPACE_TOKENS[tokens.space] = true, _WHITESPACE_TOKENS[tokens.cr] = true, _WHITESPACE_TOKENS[tokens.feed] = true, _WHITESPACE_TOKENS[tokens.newline] = true, _WHITESPACE_TOKENS[tokens.tab] = true, _WHITESPACE_TOKENS);
  var WHITESPACE_EQUIV_TOKENS = Object.assign({}, WHITESPACE_TOKENS, (_Object$assign = {}, _Object$assign[tokens.comment] = true, _Object$assign));
  function tokenStart(token) {
    return {
      line: token[_tokenize.FIELDS.START_LINE],
      column: token[_tokenize.FIELDS.START_COL]
    };
  }
  function tokenEnd(token) {
    return {
      line: token[_tokenize.FIELDS.END_LINE],
      column: token[_tokenize.FIELDS.END_COL]
    };
  }
  function getSource(startLine, startColumn, endLine, endColumn) {
    return {
      start: {
        line: startLine,
        column: startColumn
      },
      end: {
        line: endLine,
        column: endColumn
      }
    };
  }
  function getTokenSource(token) {
    return getSource(token[_tokenize.FIELDS.START_LINE], token[_tokenize.FIELDS.START_COL], token[_tokenize.FIELDS.END_LINE], token[_tokenize.FIELDS.END_COL]);
  }
  function getTokenSourceSpan(startToken, endToken) {
    if (!startToken) {
      return void 0;
    }
    return getSource(startToken[_tokenize.FIELDS.START_LINE], startToken[_tokenize.FIELDS.START_COL], endToken[_tokenize.FIELDS.END_LINE], endToken[_tokenize.FIELDS.END_COL]);
  }
  function unescapeProp(node2, prop) {
    var value2 = node2[prop];
    if (typeof value2 !== "string") {
      return;
    }
    if (value2.indexOf("\\") !== -1) {
      (0, _util.ensureObject)(node2, "raws");
      node2[prop] = (0, _util.unesc)(value2);
      if (node2.raws[prop] === void 0) {
        node2.raws[prop] = value2;
      }
    }
    return node2;
  }
  function indexesOf(array, item) {
    var i = -1;
    var indexes = [];
    while ((i = array.indexOf(item, i + 1)) !== -1) {
      indexes.push(i);
    }
    return indexes;
  }
  function uniqs() {
    var list2 = Array.prototype.concat.apply([], arguments);
    return list2.filter(function(item, i) {
      return i === list2.indexOf(item);
    });
  }
  var Parser3 = /* @__PURE__ */ function() {
    function Parser4(rule2, options) {
      if (options === void 0) {
        options = {};
      }
      this.rule = rule2;
      this.options = Object.assign({
        lossy: false,
        safe: false
      }, options);
      this.position = 0;
      this.css = typeof this.rule === "string" ? this.rule : this.rule.selector;
      this.tokens = (0, _tokenize["default"])({
        css: this.css,
        error: this._errorGenerator(),
        safe: this.options.safe
      });
      var rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
      this.root = new _root2["default"]({
        source: rootSource
      });
      this.root.errorGenerator = this._errorGenerator();
      var selector3 = new _selector2["default"]({
        source: {
          start: {
            line: 1,
            column: 1
          }
        },
        sourceIndex: 0
      });
      this.root.append(selector3);
      this.current = selector3;
      this.loop();
    }
    var _proto = Parser4.prototype;
    _proto._errorGenerator = function _errorGenerator() {
      var _this = this;
      return function(message, errorOptions) {
        if (typeof _this.rule === "string") {
          return new Error(message);
        }
        return _this.rule.error(message, errorOptions);
      };
    };
    _proto.attribute = function attribute3() {
      var attr = [];
      var startingToken = this.currToken;
      this.position++;
      while (this.position < this.tokens.length && this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
        attr.push(this.currToken);
        this.position++;
      }
      if (this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
        return this.expected("closing square bracket", this.currToken[_tokenize.FIELDS.START_POS]);
      }
      var len = attr.length;
      var node2 = {
        source: getSource(startingToken[1], startingToken[2], this.currToken[3], this.currToken[4]),
        sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
      };
      if (len === 1 && !~[tokens.word].indexOf(attr[0][_tokenize.FIELDS.TYPE])) {
        return this.expected("attribute", attr[0][_tokenize.FIELDS.START_POS]);
      }
      var pos = 0;
      var spaceBefore = "";
      var commentBefore = "";
      var lastAdded = null;
      var spaceAfterMeaningfulToken = false;
      while (pos < len) {
        var token = attr[pos];
        var content = this.content(token);
        var next = attr[pos + 1];
        switch (token[_tokenize.FIELDS.TYPE]) {
          case tokens.space:
            spaceAfterMeaningfulToken = true;
            if (this.options.lossy) {
              break;
            }
            if (lastAdded) {
              (0, _util.ensureObject)(node2, "spaces", lastAdded);
              var prevContent = node2.spaces[lastAdded].after || "";
              node2.spaces[lastAdded].after = prevContent + content;
              var existingComment = (0, _util.getProp)(node2, "raws", "spaces", lastAdded, "after") || null;
              if (existingComment) {
                node2.raws.spaces[lastAdded].after = existingComment + content;
              }
            } else {
              spaceBefore = spaceBefore + content;
              commentBefore = commentBefore + content;
            }
            break;
          case tokens.asterisk:
            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node2.operator = content;
              lastAdded = "operator";
            } else if ((!node2.namespace || lastAdded === "namespace" && !spaceAfterMeaningfulToken) && next) {
              if (spaceBefore) {
                (0, _util.ensureObject)(node2, "spaces", "attribute");
                node2.spaces.attribute.before = spaceBefore;
                spaceBefore = "";
              }
              if (commentBefore) {
                (0, _util.ensureObject)(node2, "raws", "spaces", "attribute");
                node2.raws.spaces.attribute.before = spaceBefore;
                commentBefore = "";
              }
              node2.namespace = (node2.namespace || "") + content;
              var rawValue = (0, _util.getProp)(node2, "raws", "namespace") || null;
              if (rawValue) {
                node2.raws.namespace += content;
              }
              lastAdded = "namespace";
            }
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.dollar:
            if (lastAdded === "value") {
              var oldRawValue = (0, _util.getProp)(node2, "raws", "value");
              node2.value += "$";
              if (oldRawValue) {
                node2.raws.value = oldRawValue + "$";
              }
              break;
            }
          case tokens.caret:
            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node2.operator = content;
              lastAdded = "operator";
            }
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.combinator:
            if (content === "~" && next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node2.operator = content;
              lastAdded = "operator";
            }
            if (content !== "|") {
              spaceAfterMeaningfulToken = false;
              break;
            }
            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node2.operator = content;
              lastAdded = "operator";
            } else if (!node2.namespace && !node2.attribute) {
              node2.namespace = true;
            }
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.word:
            if (next && this.content(next) === "|" && attr[pos + 2] && attr[pos + 2][_tokenize.FIELDS.TYPE] !== tokens.equals && // this look-ahead probably fails with comment nodes involved.
            !node2.operator && !node2.namespace) {
              node2.namespace = content;
              lastAdded = "namespace";
            } else if (!node2.attribute || lastAdded === "attribute" && !spaceAfterMeaningfulToken) {
              if (spaceBefore) {
                (0, _util.ensureObject)(node2, "spaces", "attribute");
                node2.spaces.attribute.before = spaceBefore;
                spaceBefore = "";
              }
              if (commentBefore) {
                (0, _util.ensureObject)(node2, "raws", "spaces", "attribute");
                node2.raws.spaces.attribute.before = commentBefore;
                commentBefore = "";
              }
              node2.attribute = (node2.attribute || "") + content;
              var _rawValue = (0, _util.getProp)(node2, "raws", "attribute") || null;
              if (_rawValue) {
                node2.raws.attribute += content;
              }
              lastAdded = "attribute";
            } else if (!node2.value && node2.value !== "" || lastAdded === "value" && !(spaceAfterMeaningfulToken || node2.quoteMark)) {
              var _unescaped = (0, _util.unesc)(content);
              var _oldRawValue = (0, _util.getProp)(node2, "raws", "value") || "";
              var oldValue = node2.value || "";
              node2.value = oldValue + _unescaped;
              node2.quoteMark = null;
              if (_unescaped !== content || _oldRawValue) {
                (0, _util.ensureObject)(node2, "raws");
                node2.raws.value = (_oldRawValue || oldValue) + content;
              }
              lastAdded = "value";
            } else {
              var insensitive = content === "i" || content === "I";
              if ((node2.value || node2.value === "") && (node2.quoteMark || spaceAfterMeaningfulToken)) {
                node2.insensitive = insensitive;
                if (!insensitive || content === "I") {
                  (0, _util.ensureObject)(node2, "raws");
                  node2.raws.insensitiveFlag = content;
                }
                lastAdded = "insensitive";
                if (spaceBefore) {
                  (0, _util.ensureObject)(node2, "spaces", "insensitive");
                  node2.spaces.insensitive.before = spaceBefore;
                  spaceBefore = "";
                }
                if (commentBefore) {
                  (0, _util.ensureObject)(node2, "raws", "spaces", "insensitive");
                  node2.raws.spaces.insensitive.before = commentBefore;
                  commentBefore = "";
                }
              } else if (node2.value || node2.value === "") {
                lastAdded = "value";
                node2.value += content;
                if (node2.raws.value) {
                  node2.raws.value += content;
                }
              }
            }
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.str:
            if (!node2.attribute || !node2.operator) {
              return this.error("Expected an attribute followed by an operator preceding the string.", {
                index: token[_tokenize.FIELDS.START_POS]
              });
            }
            var _unescapeValue = (0, _attribute2.unescapeValue)(content), unescaped = _unescapeValue.unescaped, quoteMark = _unescapeValue.quoteMark;
            node2.value = unescaped;
            node2.quoteMark = quoteMark;
            lastAdded = "value";
            (0, _util.ensureObject)(node2, "raws");
            node2.raws.value = content;
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.equals:
            if (!node2.attribute) {
              return this.expected("attribute", token[_tokenize.FIELDS.START_POS], content);
            }
            if (node2.value) {
              return this.error('Unexpected "=" found; an operator was already defined.', {
                index: token[_tokenize.FIELDS.START_POS]
              });
            }
            node2.operator = node2.operator ? node2.operator + content : content;
            lastAdded = "operator";
            spaceAfterMeaningfulToken = false;
            break;
          case tokens.comment:
            if (lastAdded) {
              if (spaceAfterMeaningfulToken || next && next[_tokenize.FIELDS.TYPE] === tokens.space || lastAdded === "insensitive") {
                var lastComment = (0, _util.getProp)(node2, "spaces", lastAdded, "after") || "";
                var rawLastComment = (0, _util.getProp)(node2, "raws", "spaces", lastAdded, "after") || lastComment;
                (0, _util.ensureObject)(node2, "raws", "spaces", lastAdded);
                node2.raws.spaces[lastAdded].after = rawLastComment + content;
              } else {
                var lastValue = node2[lastAdded] || "";
                var rawLastValue = (0, _util.getProp)(node2, "raws", lastAdded) || lastValue;
                (0, _util.ensureObject)(node2, "raws");
                node2.raws[lastAdded] = rawLastValue + content;
              }
            } else {
              commentBefore = commentBefore + content;
            }
            break;
          default:
            return this.error('Unexpected "' + content + '" found.', {
              index: token[_tokenize.FIELDS.START_POS]
            });
        }
        pos++;
      }
      unescapeProp(node2, "attribute");
      unescapeProp(node2, "namespace");
      this.newNode(new _attribute2["default"](node2));
      this.position++;
    };
    _proto.parseWhitespaceEquivalentTokens = function parseWhitespaceEquivalentTokens(stopPosition) {
      if (stopPosition < 0) {
        stopPosition = this.tokens.length;
      }
      var startPosition = this.position;
      var nodes = [];
      var space2 = "";
      var lastComment = void 0;
      do {
        if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
          if (!this.options.lossy) {
            space2 += this.content();
          }
        } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.comment) {
          var spaces = {};
          if (space2) {
            spaces.before = space2;
            space2 = "";
          }
          lastComment = new _comment2["default"]({
            value: this.content(),
            source: getTokenSource(this.currToken),
            sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
            spaces
          });
          nodes.push(lastComment);
        }
      } while (++this.position < stopPosition);
      if (space2) {
        if (lastComment) {
          lastComment.spaces.after = space2;
        } else if (!this.options.lossy) {
          var firstToken = this.tokens[startPosition];
          var lastToken = this.tokens[this.position - 1];
          nodes.push(new _string2["default"]({
            value: "",
            source: getSource(firstToken[_tokenize.FIELDS.START_LINE], firstToken[_tokenize.FIELDS.START_COL], lastToken[_tokenize.FIELDS.END_LINE], lastToken[_tokenize.FIELDS.END_COL]),
            sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
            spaces: {
              before: space2,
              after: ""
            }
          }));
        }
      }
      return nodes;
    };
    _proto.convertWhitespaceNodesToSpace = function convertWhitespaceNodesToSpace(nodes, requiredSpace) {
      var _this2 = this;
      if (requiredSpace === void 0) {
        requiredSpace = false;
      }
      var space2 = "";
      var rawSpace = "";
      nodes.forEach(function(n) {
        var spaceBefore = _this2.lossySpace(n.spaces.before, requiredSpace);
        var rawSpaceBefore = _this2.lossySpace(n.rawSpaceBefore, requiredSpace);
        space2 += spaceBefore + _this2.lossySpace(n.spaces.after, requiredSpace && spaceBefore.length === 0);
        rawSpace += spaceBefore + n.value + _this2.lossySpace(n.rawSpaceAfter, requiredSpace && rawSpaceBefore.length === 0);
      });
      if (rawSpace === space2) {
        rawSpace = void 0;
      }
      var result2 = {
        space: space2,
        rawSpace
      };
      return result2;
    };
    _proto.isNamedCombinator = function isNamedCombinator(position2) {
      if (position2 === void 0) {
        position2 = this.position;
      }
      return this.tokens[position2 + 0] && this.tokens[position2 + 0][_tokenize.FIELDS.TYPE] === tokens.slash && this.tokens[position2 + 1] && this.tokens[position2 + 1][_tokenize.FIELDS.TYPE] === tokens.word && this.tokens[position2 + 2] && this.tokens[position2 + 2][_tokenize.FIELDS.TYPE] === tokens.slash;
    };
    _proto.namedCombinator = function namedCombinator() {
      if (this.isNamedCombinator()) {
        var nameRaw = this.content(this.tokens[this.position + 1]);
        var name = (0, _util.unesc)(nameRaw).toLowerCase();
        var raws = {};
        if (name !== nameRaw) {
          raws.value = "/" + nameRaw + "/";
        }
        var node2 = new _combinator2["default"]({
          value: "/" + name + "/",
          source: getSource(this.currToken[_tokenize.FIELDS.START_LINE], this.currToken[_tokenize.FIELDS.START_COL], this.tokens[this.position + 2][_tokenize.FIELDS.END_LINE], this.tokens[this.position + 2][_tokenize.FIELDS.END_COL]),
          sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
          raws
        });
        this.position = this.position + 3;
        return node2;
      } else {
        this.unexpected();
      }
    };
    _proto.combinator = function combinator3() {
      var _this3 = this;
      if (this.content() === "|") {
        return this.namespace();
      }
      var nextSigTokenPos = this.locateNextMeaningfulToken(this.position);
      if (nextSigTokenPos < 0 || this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] === tokens.comma) {
        var nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
        if (nodes.length > 0) {
          var last = this.current.last;
          if (last) {
            var _this$convertWhitespa = this.convertWhitespaceNodesToSpace(nodes), space2 = _this$convertWhitespa.space, rawSpace = _this$convertWhitespa.rawSpace;
            if (rawSpace !== void 0) {
              last.rawSpaceAfter += rawSpace;
            }
            last.spaces.after += space2;
          } else {
            nodes.forEach(function(n) {
              return _this3.newNode(n);
            });
          }
        }
        return;
      }
      var firstToken = this.currToken;
      var spaceOrDescendantSelectorNodes = void 0;
      if (nextSigTokenPos > this.position) {
        spaceOrDescendantSelectorNodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
      }
      var node2;
      if (this.isNamedCombinator()) {
        node2 = this.namedCombinator();
      } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.combinator) {
        node2 = new _combinator2["default"]({
          value: this.content(),
          source: getTokenSource(this.currToken),
          sourceIndex: this.currToken[_tokenize.FIELDS.START_POS]
        });
        this.position++;
      } else if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]])
        ;
      else if (!spaceOrDescendantSelectorNodes) {
        this.unexpected();
      }
      if (node2) {
        if (spaceOrDescendantSelectorNodes) {
          var _this$convertWhitespa2 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes), _space = _this$convertWhitespa2.space, _rawSpace = _this$convertWhitespa2.rawSpace;
          node2.spaces.before = _space;
          node2.rawSpaceBefore = _rawSpace;
        }
      } else {
        var _this$convertWhitespa3 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes, true), _space2 = _this$convertWhitespa3.space, _rawSpace2 = _this$convertWhitespa3.rawSpace;
        if (!_rawSpace2) {
          _rawSpace2 = _space2;
        }
        var spaces = {};
        var raws = {
          spaces: {}
        };
        if (_space2.endsWith(" ") && _rawSpace2.endsWith(" ")) {
          spaces.before = _space2.slice(0, _space2.length - 1);
          raws.spaces.before = _rawSpace2.slice(0, _rawSpace2.length - 1);
        } else if (_space2.startsWith(" ") && _rawSpace2.startsWith(" ")) {
          spaces.after = _space2.slice(1);
          raws.spaces.after = _rawSpace2.slice(1);
        } else {
          raws.value = _rawSpace2;
        }
        node2 = new _combinator2["default"]({
          value: " ",
          source: getTokenSourceSpan(firstToken, this.tokens[this.position - 1]),
          sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
          spaces,
          raws
        });
      }
      if (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.space) {
        node2.spaces.after = this.optionalSpace(this.content());
        this.position++;
      }
      return this.newNode(node2);
    };
    _proto.comma = function comma2() {
      if (this.position === this.tokens.length - 1) {
        this.root.trailingComma = true;
        this.position++;
        return;
      }
      this.current._inferEndPosition();
      var selector3 = new _selector2["default"]({
        source: {
          start: tokenStart(this.tokens[this.position + 1])
        },
        sourceIndex: this.tokens[this.position + 1][_tokenize.FIELDS.START_POS]
      });
      this.current.parent.append(selector3);
      this.current = selector3;
      this.position++;
    };
    _proto.comment = function comment3() {
      var current = this.currToken;
      this.newNode(new _comment2["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };
    _proto.error = function error(message, opts) {
      throw this.root.error(message, opts);
    };
    _proto.missingBackslash = function missingBackslash() {
      return this.error("Expected a backslash preceding the semicolon.", {
        index: this.currToken[_tokenize.FIELDS.START_POS]
      });
    };
    _proto.missingParenthesis = function missingParenthesis() {
      return this.expected("opening parenthesis", this.currToken[_tokenize.FIELDS.START_POS]);
    };
    _proto.missingSquareBracket = function missingSquareBracket() {
      return this.expected("opening square bracket", this.currToken[_tokenize.FIELDS.START_POS]);
    };
    _proto.unexpected = function unexpected() {
      return this.error("Unexpected '" + this.content() + "'. Escaping special characters with \\ may help.", this.currToken[_tokenize.FIELDS.START_POS]);
    };
    _proto.unexpectedPipe = function unexpectedPipe() {
      return this.error("Unexpected '|'.", this.currToken[_tokenize.FIELDS.START_POS]);
    };
    _proto.namespace = function namespace2() {
      var before = this.prevToken && this.content(this.prevToken) || true;
      if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.word) {
        this.position++;
        return this.word(before);
      } else if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.asterisk) {
        this.position++;
        return this.universal(before);
      }
      this.unexpectedPipe();
    };
    _proto.nesting = function nesting3() {
      if (this.nextToken) {
        var nextContent = this.content(this.nextToken);
        if (nextContent === "|") {
          this.position++;
          return;
        }
      }
      var current = this.currToken;
      this.newNode(new _nesting2["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };
    _proto.parentheses = function parentheses() {
      var last = this.current.last;
      var unbalanced = 1;
      this.position++;
      if (last && last.type === types2.PSEUDO) {
        var selector3 = new _selector2["default"]({
          source: {
            start: tokenStart(this.tokens[this.position])
          },
          sourceIndex: this.tokens[this.position][_tokenize.FIELDS.START_POS]
        });
        var cache2 = this.current;
        last.append(selector3);
        this.current = selector3;
        while (this.position < this.tokens.length && unbalanced) {
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            unbalanced++;
          }
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
            unbalanced--;
          }
          if (unbalanced) {
            this.parse();
          } else {
            this.current.source.end = tokenEnd(this.currToken);
            this.current.parent.source.end = tokenEnd(this.currToken);
            this.position++;
          }
        }
        this.current = cache2;
      } else {
        var parenStart = this.currToken;
        var parenValue = "(";
        var parenEnd;
        while (this.position < this.tokens.length && unbalanced) {
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            unbalanced++;
          }
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
            unbalanced--;
          }
          parenEnd = this.currToken;
          parenValue += this.parseParenthesisToken(this.currToken);
          this.position++;
        }
        if (last) {
          last.appendToPropertyAndEscape("value", parenValue, parenValue);
        } else {
          this.newNode(new _string2["default"]({
            value: parenValue,
            source: getSource(parenStart[_tokenize.FIELDS.START_LINE], parenStart[_tokenize.FIELDS.START_COL], parenEnd[_tokenize.FIELDS.END_LINE], parenEnd[_tokenize.FIELDS.END_COL]),
            sourceIndex: parenStart[_tokenize.FIELDS.START_POS]
          }));
        }
      }
      if (unbalanced) {
        return this.expected("closing parenthesis", this.currToken[_tokenize.FIELDS.START_POS]);
      }
    };
    _proto.pseudo = function pseudo3() {
      var _this4 = this;
      var pseudoStr = "";
      var startingToken = this.currToken;
      while (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.colon) {
        pseudoStr += this.content();
        this.position++;
      }
      if (!this.currToken) {
        return this.expected(["pseudo-class", "pseudo-element"], this.position - 1);
      }
      if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.word) {
        this.splitWord(false, function(first, length2) {
          pseudoStr += first;
          _this4.newNode(new _pseudo2["default"]({
            value: pseudoStr,
            source: getTokenSourceSpan(startingToken, _this4.currToken),
            sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
          }));
          if (length2 > 1 && _this4.nextToken && _this4.nextToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            _this4.error("Misplaced parenthesis.", {
              index: _this4.nextToken[_tokenize.FIELDS.START_POS]
            });
          }
        });
      } else {
        return this.expected(["pseudo-class", "pseudo-element"], this.currToken[_tokenize.FIELDS.START_POS]);
      }
    };
    _proto.space = function space2() {
      var content = this.content();
      if (this.position === 0 || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis || this.current.nodes.every(function(node2) {
        return node2.type === "comment";
      })) {
        this.spaces = this.optionalSpace(content);
        this.position++;
      } else if (this.position === this.tokens.length - 1 || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
        this.current.last.spaces.after = this.optionalSpace(content);
        this.position++;
      } else {
        this.combinator();
      }
    };
    _proto.string = function string3() {
      var current = this.currToken;
      this.newNode(new _string2["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };
    _proto.universal = function universal3(namespace2) {
      var nextToken = this.nextToken;
      if (nextToken && this.content(nextToken) === "|") {
        this.position++;
        return this.namespace();
      }
      var current = this.currToken;
      this.newNode(new _universal2["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }), namespace2);
      this.position++;
    };
    _proto.splitWord = function splitWord(namespace2, firstCallback) {
      var _this5 = this;
      var nextToken = this.nextToken;
      var word2 = this.content();
      while (nextToken && ~[tokens.dollar, tokens.caret, tokens.equals, tokens.word].indexOf(nextToken[_tokenize.FIELDS.TYPE])) {
        this.position++;
        var current = this.content();
        word2 += current;
        if (current.lastIndexOf("\\") === current.length - 1) {
          var next = this.nextToken;
          if (next && next[_tokenize.FIELDS.TYPE] === tokens.space) {
            word2 += this.requiredSpace(this.content(next));
            this.position++;
          }
        }
        nextToken = this.nextToken;
      }
      var hasClass = indexesOf(word2, ".").filter(function(i) {
        var escapedDot = word2[i - 1] === "\\";
        var isKeyframesPercent = /^\d+\.\d+%$/.test(word2);
        return !escapedDot && !isKeyframesPercent;
      });
      var hasId = indexesOf(word2, "#").filter(function(i) {
        return word2[i - 1] !== "\\";
      });
      var interpolations = indexesOf(word2, "#{");
      if (interpolations.length) {
        hasId = hasId.filter(function(hashIndex) {
          return !~interpolations.indexOf(hashIndex);
        });
      }
      var indices = (0, _sortAscending["default"])(uniqs([0].concat(hasClass, hasId)));
      indices.forEach(function(ind, i) {
        var index2 = indices[i + 1] || word2.length;
        var value2 = word2.slice(ind, index2);
        if (i === 0 && firstCallback) {
          return firstCallback.call(_this5, value2, indices.length);
        }
        var node2;
        var current2 = _this5.currToken;
        var sourceIndex = current2[_tokenize.FIELDS.START_POS] + indices[i];
        var source = getSource(current2[1], current2[2] + ind, current2[3], current2[2] + (index2 - 1));
        if (~hasClass.indexOf(ind)) {
          var classNameOpts = {
            value: value2.slice(1),
            source,
            sourceIndex
          };
          node2 = new _className2["default"](unescapeProp(classNameOpts, "value"));
        } else if (~hasId.indexOf(ind)) {
          var idOpts = {
            value: value2.slice(1),
            source,
            sourceIndex
          };
          node2 = new _id2["default"](unescapeProp(idOpts, "value"));
        } else {
          var tagOpts = {
            value: value2,
            source,
            sourceIndex
          };
          unescapeProp(tagOpts, "value");
          node2 = new _tag2["default"](tagOpts);
        }
        _this5.newNode(node2, namespace2);
        namespace2 = null;
      });
      this.position++;
    };
    _proto.word = function word2(namespace2) {
      var nextToken = this.nextToken;
      if (nextToken && this.content(nextToken) === "|") {
        this.position++;
        return this.namespace();
      }
      return this.splitWord(namespace2);
    };
    _proto.loop = function loop() {
      while (this.position < this.tokens.length) {
        this.parse(true);
      }
      this.current._inferEndPosition();
      return this.root;
    };
    _proto.parse = function parse2(throwOnParenthesis) {
      switch (this.currToken[_tokenize.FIELDS.TYPE]) {
        case tokens.space:
          this.space();
          break;
        case tokens.comment:
          this.comment();
          break;
        case tokens.openParenthesis:
          this.parentheses();
          break;
        case tokens.closeParenthesis:
          if (throwOnParenthesis) {
            this.missingParenthesis();
          }
          break;
        case tokens.openSquare:
          this.attribute();
          break;
        case tokens.dollar:
        case tokens.caret:
        case tokens.equals:
        case tokens.word:
          this.word();
          break;
        case tokens.colon:
          this.pseudo();
          break;
        case tokens.comma:
          this.comma();
          break;
        case tokens.asterisk:
          this.universal();
          break;
        case tokens.ampersand:
          this.nesting();
          break;
        case tokens.slash:
        case tokens.combinator:
          this.combinator();
          break;
        case tokens.str:
          this.string();
          break;
        case tokens.closeSquare:
          this.missingSquareBracket();
        case tokens.semicolon:
          this.missingBackslash();
        default:
          this.unexpected();
      }
    };
    _proto.expected = function expected(description, index2, found) {
      if (Array.isArray(description)) {
        var last = description.pop();
        description = description.join(", ") + " or " + last;
      }
      var an = /^[aeiou]/.test(description[0]) ? "an" : "a";
      if (!found) {
        return this.error("Expected " + an + " " + description + ".", {
          index: index2
        });
      }
      return this.error("Expected " + an + " " + description + ', found "' + found + '" instead.', {
        index: index2
      });
    };
    _proto.requiredSpace = function requiredSpace(space2) {
      return this.options.lossy ? " " : space2;
    };
    _proto.optionalSpace = function optionalSpace(space2) {
      return this.options.lossy ? "" : space2;
    };
    _proto.lossySpace = function lossySpace(space2, required) {
      if (this.options.lossy) {
        return required ? " " : "";
      } else {
        return space2;
      }
    };
    _proto.parseParenthesisToken = function parseParenthesisToken(token) {
      var content = this.content(token);
      if (token[_tokenize.FIELDS.TYPE] === tokens.space) {
        return this.requiredSpace(content);
      } else {
        return content;
      }
    };
    _proto.newNode = function newNode(node2, namespace2) {
      if (namespace2) {
        if (/^ +$/.test(namespace2)) {
          if (!this.options.lossy) {
            this.spaces = (this.spaces || "") + namespace2;
          }
          namespace2 = true;
        }
        node2.namespace = namespace2;
        unescapeProp(node2, "namespace");
      }
      if (this.spaces) {
        node2.spaces.before = this.spaces;
        this.spaces = "";
      }
      return this.current.append(node2);
    };
    _proto.content = function content(token) {
      if (token === void 0) {
        token = this.currToken;
      }
      return this.css.slice(token[_tokenize.FIELDS.START_POS], token[_tokenize.FIELDS.END_POS]);
    };
    _proto.locateNextMeaningfulToken = function locateNextMeaningfulToken(startPosition) {
      if (startPosition === void 0) {
        startPosition = this.position + 1;
      }
      var searchPosition = startPosition;
      while (searchPosition < this.tokens.length) {
        if (WHITESPACE_EQUIV_TOKENS[this.tokens[searchPosition][_tokenize.FIELDS.TYPE]]) {
          searchPosition++;
          continue;
        } else {
          return searchPosition;
        }
      }
      return -1;
    };
    _createClass(Parser4, [{
      key: "currToken",
      get: function get() {
        return this.tokens[this.position];
      }
    }, {
      key: "nextToken",
      get: function get() {
        return this.tokens[this.position + 1];
      }
    }, {
      key: "prevToken",
      get: function get() {
        return this.tokens[this.position - 1];
      }
    }]);
    return Parser4;
  }();
  exports2["default"] = Parser3;
  module2.exports = exports2.default;
})(parser$2, parser$2.exports);
var parserExports = parser$2.exports;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _parser = _interopRequireDefault2(parserExports);
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  var Processor3 = /* @__PURE__ */ function() {
    function Processor4(func, options) {
      this.func = func || function noop() {
      };
      this.funcRes = null;
      this.options = options;
    }
    var _proto = Processor4.prototype;
    _proto._shouldUpdateSelector = function _shouldUpdateSelector(rule2, options) {
      if (options === void 0) {
        options = {};
      }
      var merged = Object.assign({}, this.options, options);
      if (merged.updateSelector === false) {
        return false;
      } else {
        return typeof rule2 !== "string";
      }
    };
    _proto._isLossy = function _isLossy(options) {
      if (options === void 0) {
        options = {};
      }
      var merged = Object.assign({}, this.options, options);
      if (merged.lossless === false) {
        return true;
      } else {
        return false;
      }
    };
    _proto._root = function _root2(rule2, options) {
      if (options === void 0) {
        options = {};
      }
      var parser2 = new _parser["default"](rule2, this._parseOptions(options));
      return parser2.root;
    };
    _proto._parseOptions = function _parseOptions(options) {
      return {
        lossy: this._isLossy(options)
      };
    };
    _proto._run = function _run(rule2, options) {
      var _this = this;
      if (options === void 0) {
        options = {};
      }
      return new Promise(function(resolve2, reject) {
        try {
          var root3 = _this._root(rule2, options);
          Promise.resolve(_this.func(root3)).then(function(transform) {
            var string3 = void 0;
            if (_this._shouldUpdateSelector(rule2, options)) {
              string3 = root3.toString();
              rule2.selector = string3;
            }
            return {
              transform,
              root: root3,
              string: string3
            };
          }).then(resolve2, reject);
        } catch (e) {
          reject(e);
          return;
        }
      });
    };
    _proto._runSync = function _runSync(rule2, options) {
      if (options === void 0) {
        options = {};
      }
      var root3 = this._root(rule2, options);
      var transform = this.func(root3);
      if (transform && typeof transform.then === "function") {
        throw new Error("Selector processor returned a promise to a synchronous call.");
      }
      var string3 = void 0;
      if (options.updateSelector && typeof rule2 !== "string") {
        string3 = root3.toString();
        rule2.selector = string3;
      }
      return {
        transform,
        root: root3,
        string: string3
      };
    };
    _proto.ast = function ast(rule2, options) {
      return this._run(rule2, options).then(function(result2) {
        return result2.root;
      });
    };
    _proto.astSync = function astSync(rule2, options) {
      return this._runSync(rule2, options).root;
    };
    _proto.transform = function transform(rule2, options) {
      return this._run(rule2, options).then(function(result2) {
        return result2.transform;
      });
    };
    _proto.transformSync = function transformSync(rule2, options) {
      return this._runSync(rule2, options).transform;
    };
    _proto.process = function process2(rule2, options) {
      return this._run(rule2, options).then(function(result2) {
        return result2.string || result2.root.toString();
      });
    };
    _proto.processSync = function processSync(rule2, options) {
      var result2 = this._runSync(rule2, options);
      return result2.string || result2.root.toString();
    };
    return Processor4;
  }();
  exports2["default"] = Processor3;
  module2.exports = exports2.default;
})(processor, processor.exports);
var processorExports = processor.exports;
var selectors$1 = {};
var constructors = {};
constructors.__esModule = true;
constructors.universal = constructors.tag = constructors.string = constructors.selector = constructors.root = constructors.pseudo = constructors.nesting = constructors.id = constructors.comment = constructors.combinator = constructors.className = constructors.attribute = void 0;
var _attribute = _interopRequireDefault(attribute$1);
var _className = _interopRequireDefault(classNameExports);
var _combinator = _interopRequireDefault(combinatorExports);
var _comment = _interopRequireDefault(commentExports);
var _id = _interopRequireDefault(idExports);
var _nesting = _interopRequireDefault(nestingExports);
var _pseudo = _interopRequireDefault(pseudoExports);
var _root = _interopRequireDefault(rootExports);
var _selector = _interopRequireDefault(selectorExports);
var _string = _interopRequireDefault(stringExports);
var _tag = _interopRequireDefault(tagExports);
var _universal = _interopRequireDefault(universalExports);
function _interopRequireDefault(obj2) {
  return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
}
var attribute = function attribute2(opts) {
  return new _attribute["default"](opts);
};
constructors.attribute = attribute;
var className = function className2(opts) {
  return new _className["default"](opts);
};
constructors.className = className;
var combinator = function combinator2(opts) {
  return new _combinator["default"](opts);
};
constructors.combinator = combinator;
var comment = function comment2(opts) {
  return new _comment["default"](opts);
};
constructors.comment = comment;
var id = function id2(opts) {
  return new _id["default"](opts);
};
constructors.id = id;
var nesting = function nesting2(opts) {
  return new _nesting["default"](opts);
};
constructors.nesting = nesting;
var pseudo = function pseudo2(opts) {
  return new _pseudo["default"](opts);
};
constructors.pseudo = pseudo;
var root = function root2(opts) {
  return new _root["default"](opts);
};
constructors.root = root;
var selector = function selector2(opts) {
  return new _selector["default"](opts);
};
constructors.selector = selector;
var string = function string2(opts) {
  return new _string["default"](opts);
};
constructors.string = string;
var tag = function tag2(opts) {
  return new _tag["default"](opts);
};
constructors.tag = tag;
var universal = function universal2(opts) {
  return new _universal["default"](opts);
};
constructors.universal = universal;
var guards = {};
guards.__esModule = true;
guards.isComment = guards.isCombinator = guards.isClassName = guards.isAttribute = void 0;
guards.isContainer = isContainer;
guards.isIdentifier = void 0;
guards.isNamespace = isNamespace;
guards.isNesting = void 0;
guards.isNode = isNode;
guards.isPseudo = void 0;
guards.isPseudoClass = isPseudoClass;
guards.isPseudoElement = isPseudoElement$1;
guards.isUniversal = guards.isTag = guards.isString = guards.isSelector = guards.isRoot = void 0;
var _types = types$1;
var _IS_TYPE;
var IS_TYPE = (_IS_TYPE = {}, _IS_TYPE[_types.ATTRIBUTE] = true, _IS_TYPE[_types.CLASS] = true, _IS_TYPE[_types.COMBINATOR] = true, _IS_TYPE[_types.COMMENT] = true, _IS_TYPE[_types.ID] = true, _IS_TYPE[_types.NESTING] = true, _IS_TYPE[_types.PSEUDO] = true, _IS_TYPE[_types.ROOT] = true, _IS_TYPE[_types.SELECTOR] = true, _IS_TYPE[_types.STRING] = true, _IS_TYPE[_types.TAG] = true, _IS_TYPE[_types.UNIVERSAL] = true, _IS_TYPE);
function isNode(node2) {
  return typeof node2 === "object" && IS_TYPE[node2.type];
}
function isNodeType(type, node2) {
  return isNode(node2) && node2.type === type;
}
var isAttribute = isNodeType.bind(null, _types.ATTRIBUTE);
guards.isAttribute = isAttribute;
var isClassName = isNodeType.bind(null, _types.CLASS);
guards.isClassName = isClassName;
var isCombinator = isNodeType.bind(null, _types.COMBINATOR);
guards.isCombinator = isCombinator;
var isComment = isNodeType.bind(null, _types.COMMENT);
guards.isComment = isComment;
var isIdentifier = isNodeType.bind(null, _types.ID);
guards.isIdentifier = isIdentifier;
var isNesting = isNodeType.bind(null, _types.NESTING);
guards.isNesting = isNesting;
var isPseudo = isNodeType.bind(null, _types.PSEUDO);
guards.isPseudo = isPseudo;
var isRoot$1 = isNodeType.bind(null, _types.ROOT);
guards.isRoot = isRoot$1;
var isSelector = isNodeType.bind(null, _types.SELECTOR);
guards.isSelector = isSelector;
var isString = isNodeType.bind(null, _types.STRING);
guards.isString = isString;
var isTag = isNodeType.bind(null, _types.TAG);
guards.isTag = isTag;
var isUniversal = isNodeType.bind(null, _types.UNIVERSAL);
guards.isUniversal = isUniversal;
function isPseudoElement$1(node2) {
  return isPseudo(node2) && node2.value && (node2.value.startsWith("::") || node2.value.toLowerCase() === ":before" || node2.value.toLowerCase() === ":after" || node2.value.toLowerCase() === ":first-letter" || node2.value.toLowerCase() === ":first-line");
}
function isPseudoClass(node2) {
  return isPseudo(node2) && !isPseudoElement$1(node2);
}
function isContainer(node2) {
  return !!(isNode(node2) && node2.walk);
}
function isNamespace(node2) {
  return isAttribute(node2) || isTag(node2);
}
(function(exports2) {
  exports2.__esModule = true;
  var _types2 = types$1;
  Object.keys(_types2).forEach(function(key) {
    if (key === "default" || key === "__esModule")
      return;
    if (key in exports2 && exports2[key] === _types2[key])
      return;
    exports2[key] = _types2[key];
  });
  var _constructors = constructors;
  Object.keys(_constructors).forEach(function(key) {
    if (key === "default" || key === "__esModule")
      return;
    if (key in exports2 && exports2[key] === _constructors[key])
      return;
    exports2[key] = _constructors[key];
  });
  var _guards = guards;
  Object.keys(_guards).forEach(function(key) {
    if (key === "default" || key === "__esModule")
      return;
    if (key in exports2 && exports2[key] === _guards[key])
      return;
    exports2[key] = _guards[key];
  });
})(selectors$1);
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _processor = _interopRequireDefault2(processorExports);
  var selectors2 = _interopRequireWildcard(selectors$1);
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj2, nodeInterop) {
    if (!nodeInterop && obj2 && obj2.__esModule) {
      return obj2;
    }
    if (obj2 === null || typeof obj2 !== "object" && typeof obj2 !== "function") {
      return { "default": obj2 };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj2)) {
      return cache2.get(obj2);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj2) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj2, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj2, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj2[key];
        }
      }
    }
    newObj["default"] = obj2;
    if (cache2) {
      cache2.set(obj2, newObj);
    }
    return newObj;
  }
  function _interopRequireDefault2(obj2) {
    return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
  }
  var parser2 = function parser3(processor2) {
    return new _processor["default"](processor2);
  };
  Object.assign(parser2, selectors2);
  delete parser2.__esModule;
  var _default = parser2;
  exports2["default"] = _default;
  module2.exports = exports2.default;
})(dist, dist.exports);
var distExports = dist.exports;
const selectorParser4 = /* @__PURE__ */ getDefaultExportFromCjs(distExports);
var postcssNested$1 = { exports: {} };
let parser$1 = distExports;
function parse$4(str2, rule2) {
  let nodes;
  let saver = parser$1((parsed) => {
    nodes = parsed;
  });
  try {
    saver.processSync(str2);
  } catch (e) {
    if (str2.includes(":")) {
      throw rule2 ? rule2.error("Missed semicolon") : e;
    } else {
      throw rule2 ? rule2.error(e.message) : e;
    }
  }
  return nodes.at(0);
}
function replace(nodes, parent) {
  let replaced = false;
  nodes.each((i) => {
    if (i.type === "nesting") {
      let clonedParent = parent.clone();
      if (i.value !== "&") {
        i.replaceWith(parse$4(i.value.replace("&", clonedParent.toString())));
      } else {
        i.replaceWith(clonedParent);
      }
      replaced = true;
    } else if (i.nodes) {
      if (replace(i, parent)) {
        replaced = true;
      }
    }
  });
  return replaced;
}
function selectors(parent, child) {
  let result2 = [];
  parent.selectors.forEach((i) => {
    let parentNode = parse$4(i, parent);
    child.selectors.forEach((j) => {
      if (j.length) {
        let node2 = parse$4(j, child);
        let replaced = replace(node2, parentNode);
        if (!replaced) {
          node2.prepend(parser$1.combinator({ value: " " }));
          node2.prepend(parentNode.clone());
        }
        result2.push(node2.toString());
      }
    });
  });
  return result2;
}
function pickComment(comment3, after) {
  if (comment3 && comment3.type === "comment") {
    after.after(comment3);
    return comment3;
  } else {
    return after;
  }
}
function createFnAtruleChilds(bubble) {
  return function atruleChilds(rule2, atrule, bubbling) {
    let children = [];
    atrule.each((child) => {
      if (child.type === "comment") {
        children.push(child);
      } else if (child.type === "decl") {
        children.push(child);
      } else if (child.type === "rule" && bubbling) {
        child.selectors = selectors(rule2, child);
      } else if (child.type === "atrule") {
        if (child.nodes && bubble[child.name]) {
          atruleChilds(rule2, child, true);
        } else {
          children.push(child);
        }
      }
    });
    if (bubbling) {
      if (children.length) {
        let clone = rule2.clone({ nodes: [] });
        for (let child of children) {
          clone.append(child);
        }
        atrule.prepend(clone);
      }
    }
  };
}
function pickDeclarations(selector3, declarations, after, Rule3) {
  let parent = new Rule3({
    selector: selector3,
    nodes: []
  });
  for (let declaration2 of declarations) {
    parent.append(declaration2);
  }
  after.after(parent);
  return parent;
}
function atruleNames(defaults3, custom) {
  let list2 = {};
  for (let i of defaults3) {
    list2[i] = true;
  }
  if (custom) {
    for (let i of custom) {
      let name = i.replace(/^@/, "");
      list2[name] = true;
    }
  }
  return list2;
}
postcssNested$1.exports = (opts = {}) => {
  let bubble = atruleNames(["media", "supports"], opts.bubble);
  let atruleChilds = createFnAtruleChilds(bubble);
  let unwrap = atruleNames(
    [
      "document",
      "font-face",
      "keyframes",
      "-webkit-keyframes",
      "-moz-keyframes"
    ],
    opts.unwrap
  );
  let preserveEmpty = opts.preserveEmpty;
  return {
    postcssPlugin: "postcss-nested",
    Rule(rule2, { Rule: Rule3 }) {
      let unwrapped = false;
      let after = rule2;
      let copyDeclarations = false;
      let declarations = [];
      rule2.each((child) => {
        if (child.type === "rule") {
          if (declarations.length) {
            after = pickDeclarations(rule2.selector, declarations, after, Rule3);
            declarations = [];
          }
          copyDeclarations = true;
          unwrapped = true;
          child.selectors = selectors(rule2, child);
          after = pickComment(child.prev(), after);
          after.after(child);
          after = child;
        } else if (child.type === "atrule") {
          if (declarations.length) {
            after = pickDeclarations(rule2.selector, declarations, after, Rule3);
            declarations = [];
          }
          if (child.name === "at-root") {
            unwrapped = true;
            atruleChilds(rule2, child, false);
            let nodes = child.nodes;
            if (child.params) {
              nodes = new Rule3({ selector: child.params, nodes });
            }
            after.after(nodes);
            after = nodes;
            child.remove();
          } else if (bubble[child.name]) {
            copyDeclarations = true;
            unwrapped = true;
            atruleChilds(rule2, child, true);
            after = pickComment(child.prev(), after);
            after.after(child);
            after = child;
          } else if (unwrap[child.name]) {
            copyDeclarations = true;
            unwrapped = true;
            atruleChilds(rule2, child, false);
            after = pickComment(child.prev(), after);
            after.after(child);
            after = child;
          } else if (copyDeclarations) {
            declarations.push(child);
          }
        } else if (child.type === "decl" && copyDeclarations) {
          declarations.push(child);
        }
      });
      if (declarations.length) {
        after = pickDeclarations(rule2.selector, declarations, after, Rule3);
      }
      if (unwrapped && preserveEmpty !== true) {
        rule2.raws.semicolon = true;
        if (rule2.nodes.length === 0)
          rule2.remove();
      }
    }
  };
};
postcssNested$1.exports.postcss = true;
var postcssNestedExports = postcssNested$1.exports;
const postcssNested = /* @__PURE__ */ getDefaultExportFromCjs(postcssNestedExports);
var pattern$1 = /-(\w|$)/g;
var callback = function callback2(dashChar, char) {
  return char.toUpperCase();
};
var camelCaseCSS = function camelCaseCSS2(property) {
  property = property.toLowerCase();
  if (property === "float") {
    return "cssFloat";
  } else if (property.charCodeAt(0) === 45 && property.charCodeAt(1) === 109 && property.charCodeAt(2) === 115 && property.charCodeAt(3) === 45) {
    return property.substr(1).replace(pattern$1, callback);
  } else {
    return property.replace(pattern$1, callback);
  }
};
var indexEs5 = camelCaseCSS;
let camelcase = indexEs5;
let UNITLESS$1 = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};
function atRule$1(node2) {
  if (typeof node2.nodes === "undefined") {
    return true;
  } else {
    return process$1(node2);
  }
}
function process$1(node2) {
  let name;
  let result2 = {};
  node2.each((child) => {
    if (child.type === "atrule") {
      name = "@" + child.name;
      if (child.params)
        name += " " + child.params;
      if (typeof result2[name] === "undefined") {
        result2[name] = atRule$1(child);
      } else if (Array.isArray(result2[name])) {
        result2[name].push(atRule$1(child));
      } else {
        result2[name] = [result2[name], atRule$1(child)];
      }
    } else if (child.type === "rule") {
      let body = process$1(child);
      if (result2[child.selector]) {
        for (let i in body) {
          result2[child.selector][i] = body[i];
        }
      } else {
        result2[child.selector] = body;
      }
    } else if (child.type === "decl") {
      if (child.prop[0] === "-" && child.prop[1] === "-") {
        name = child.prop;
      } else if (child.parent && child.parent.selector === ":export") {
        name = child.prop;
      } else {
        name = camelcase(child.prop);
      }
      let value2 = child.value;
      if (!isNaN(child.value) && UNITLESS$1[name]) {
        value2 = parseFloat(child.value);
      }
      if (child.important)
        value2 += " !important";
      if (typeof result2[name] === "undefined") {
        result2[name] = value2;
      } else if (Array.isArray(result2[name])) {
        result2[name].push(value2);
      } else {
        result2[name] = [result2[name], value2];
      }
    }
  });
  return result2;
}
var objectifier = process$1;
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(postcss$3);
let postcss$2 = require$$0;
let IMPORTANT = /\s*!important\s*$/i;
let UNITLESS = {
  "box-flex": true,
  "box-flex-group": true,
  "column-count": true,
  "flex": true,
  "flex-grow": true,
  "flex-positive": true,
  "flex-shrink": true,
  "flex-negative": true,
  "font-weight": true,
  "line-clamp": true,
  "line-height": true,
  "opacity": true,
  "order": true,
  "orphans": true,
  "tab-size": true,
  "widows": true,
  "z-index": true,
  "zoom": true,
  "fill-opacity": true,
  "stroke-dashoffset": true,
  "stroke-opacity": true,
  "stroke-width": true
};
function dashify(str2) {
  return str2.replace(/([A-Z])/g, "-$1").replace(/^ms-/, "-ms-").toLowerCase();
}
function decl(parent, name, value2) {
  if (value2 === false || value2 === null)
    return;
  if (!name.startsWith("--")) {
    name = dashify(name);
  }
  if (typeof value2 === "number") {
    if (value2 === 0 || UNITLESS[name]) {
      value2 = value2.toString();
    } else {
      value2 += "px";
    }
  }
  if (name === "css-float")
    name = "float";
  if (IMPORTANT.test(value2)) {
    value2 = value2.replace(IMPORTANT, "");
    parent.push(postcss$2.decl({ prop: name, value: value2, important: true }));
  } else {
    parent.push(postcss$2.decl({ prop: name, value: value2 }));
  }
}
function atRule(parent, parts, value2) {
  let node2 = postcss$2.atRule({ name: parts[1], params: parts[3] || "" });
  if (typeof value2 === "object") {
    node2.nodes = [];
    parse$3(value2, node2);
  }
  parent.push(node2);
}
function parse$3(obj2, parent) {
  let name, value2, node2;
  for (name in obj2) {
    value2 = obj2[name];
    if (value2 === null || typeof value2 === "undefined") {
      continue;
    } else if (name[0] === "@") {
      let parts = name.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
      if (Array.isArray(value2)) {
        for (let i of value2) {
          atRule(parent, parts, i);
        }
      } else {
        atRule(parent, parts, value2);
      }
    } else if (Array.isArray(value2)) {
      for (let i of value2) {
        decl(parent, name, i);
      }
    } else if (typeof value2 === "object") {
      node2 = postcss$2.rule({ selector: name });
      parse$3(value2, node2);
      parent.push(node2);
    } else {
      decl(parent, name, value2);
    }
  }
}
var parser = function(obj2) {
  let root3 = postcss$2.root();
  parse$3(obj2, root3);
  return root3;
};
let objectify$1 = objectifier;
var processResult$2 = function processResult2(result2) {
  if (console && console.warn) {
    result2.warnings().forEach((warn) => {
      let source = warn.plugin || "PostCSS";
      console.warn(source + ": " + warn.text);
    });
  }
  return objectify$1(result2.root);
};
let postcss$1 = require$$0;
let processResult$1 = processResult$2;
let parse$2 = parser;
var async$1 = function async2(plugins) {
  let processor2 = postcss$1(plugins);
  return async (input2) => {
    let result2 = await processor2.process(input2, {
      parser: parse$2,
      from: void 0
    });
    return processResult$1(result2);
  };
};
let postcss = require$$0;
let processResult = processResult$2;
let parse$1 = parser;
var sync$1 = function(plugins) {
  let processor2 = postcss(plugins);
  return (input2) => {
    let result2 = processor2.process(input2, { parser: parse$1, from: void 0 });
    return processResult(result2);
  };
};
let objectify = objectifier;
let parse = parser;
let async = async$1;
let sync = sync$1;
var postcssJs = {
  objectify,
  parse,
  async,
  sync
};
const index = /* @__PURE__ */ getDefaultExportFromCjs(postcssJs);
index.objectify;
index.parse;
index.async;
index.sync;
function dlv2(t, e, l, n, r2) {
  for (e = e.split ? e.split(".") : e, n = 0; n < e.length; n++)
    t = t ? t[e[n]] : r2;
  return t === r2 ? l : t;
}
var didYouMean1_2_1 = { exports: {} };
(function(module2) {
  (function() {
    function didYouMean2(str2, list2, key) {
      if (!str2)
        return null;
      if (!didYouMean2.caseSensitive) {
        str2 = str2.toLowerCase();
      }
      var thresholdRelative = didYouMean2.threshold === null ? null : didYouMean2.threshold * str2.length, thresholdAbsolute = didYouMean2.thresholdAbsolute, winningVal;
      if (thresholdRelative !== null && thresholdAbsolute !== null)
        winningVal = Math.min(thresholdRelative, thresholdAbsolute);
      else if (thresholdRelative !== null)
        winningVal = thresholdRelative;
      else if (thresholdAbsolute !== null)
        winningVal = thresholdAbsolute;
      else
        winningVal = null;
      var winner, candidate, testCandidate, val, i, len = list2.length;
      for (i = 0; i < len; i++) {
        candidate = list2[i];
        if (key) {
          candidate = candidate[key];
        }
        if (!candidate) {
          continue;
        }
        if (!didYouMean2.caseSensitive) {
          testCandidate = candidate.toLowerCase();
        } else {
          testCandidate = candidate;
        }
        val = getEditDistance(str2, testCandidate, winningVal);
        if (winningVal === null || val < winningVal) {
          winningVal = val;
          if (key && didYouMean2.returnWinningObject)
            winner = list2[i];
          else
            winner = candidate;
          if (didYouMean2.returnFirstMatch)
            return winner;
        }
      }
      return winner || didYouMean2.nullResultValue;
    }
    didYouMean2.threshold = 0.4;
    didYouMean2.thresholdAbsolute = 20;
    didYouMean2.caseSensitive = false;
    didYouMean2.nullResultValue = null;
    didYouMean2.returnWinningObject = null;
    didYouMean2.returnFirstMatch = false;
    if (module2.exports) {
      module2.exports = didYouMean2;
    } else {
      window.didYouMean = didYouMean2;
    }
    var MAX_INT = Math.pow(2, 32) - 1;
    function getEditDistance(a, b, max2) {
      max2 = max2 || max2 === 0 ? max2 : MAX_INT;
      var lena = a.length;
      var lenb = b.length;
      if (lena === 0)
        return Math.min(max2 + 1, lenb);
      if (lenb === 0)
        return Math.min(max2 + 1, lena);
      if (Math.abs(lena - lenb) > max2)
        return max2 + 1;
      var matrix = [], i, j, colMin, minJ, maxJ;
      for (i = 0; i <= lenb; i++) {
        matrix[i] = [i];
      }
      for (j = 0; j <= lena; j++) {
        matrix[0][j] = j;
      }
      for (i = 1; i <= lenb; i++) {
        colMin = MAX_INT;
        minJ = 1;
        if (i > max2)
          minJ = i - max2;
        maxJ = lenb + 1;
        if (maxJ > max2 + i)
          maxJ = max2 + i;
        for (j = 1; j <= lena; j++) {
          if (j < minJ || j > maxJ) {
            matrix[i][j] = max2 + 1;
          } else {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
              matrix[i][j] = matrix[i - 1][j - 1];
            } else {
              matrix[i][j] = Math.min(
                matrix[i - 1][j - 1] + 1,
                // Substitute
                Math.min(
                  matrix[i][j - 1] + 1,
                  // Insert
                  matrix[i - 1][j] + 1
                )
              );
            }
          }
          if (matrix[i][j] < colMin)
            colMin = matrix[i][j];
        }
        if (colMin > max2)
          return max2 + 1;
      }
      return matrix[lenb][lena];
    }
  })();
})(didYouMean1_2_1);
var didYouMean1_2_1Exports = didYouMean1_2_1.exports;
const didYouMean = /* @__PURE__ */ getDefaultExportFromCjs(didYouMean1_2_1Exports);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_quick_lru = __commonJS({
  "node_modules/@alloc/quick-lru/index.js"(exports2, module2) {
    var QuickLRU = class {
      constructor(options = {}) {
        if (!(options.maxSize && options.maxSize > 0)) {
          throw new TypeError("`maxSize` must be a number greater than 0");
        }
        if (typeof options.maxAge === "number" && options.maxAge === 0) {
          throw new TypeError("`maxAge` must be a number greater than 0");
        }
        this.maxSize = options.maxSize;
        this.maxAge = options.maxAge || Infinity;
        this.onEviction = options.onEviction;
        this.cache = /* @__PURE__ */ new Map();
        this.oldCache = /* @__PURE__ */ new Map();
        this._size = 0;
      }
      _emitEvictions(cache2) {
        if (typeof this.onEviction !== "function") {
          return;
        }
        for (const [key, item] of cache2) {
          this.onEviction(key, item.value);
        }
      }
      _deleteIfExpired(key, item) {
        if (typeof item.expiry === "number" && item.expiry <= Date.now()) {
          if (typeof this.onEviction === "function") {
            this.onEviction(key, item.value);
          }
          return this.delete(key);
        }
        return false;
      }
      _getOrDeleteIfExpired(key, item) {
        const deleted = this._deleteIfExpired(key, item);
        if (deleted === false) {
          return item.value;
        }
      }
      _getItemValue(key, item) {
        return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
      }
      _peek(key, cache2) {
        const item = cache2.get(key);
        return this._getItemValue(key, item);
      }
      _set(key, value2) {
        this.cache.set(key, value2);
        this._size++;
        if (this._size >= this.maxSize) {
          this._size = 0;
          this._emitEvictions(this.oldCache);
          this.oldCache = this.cache;
          this.cache = /* @__PURE__ */ new Map();
        }
      }
      _moveToRecent(key, item) {
        this.oldCache.delete(key);
        this._set(key, item);
      }
      *_entriesAscending() {
        for (const item of this.oldCache) {
          const [key, value2] = item;
          if (!this.cache.has(key)) {
            const deleted = this._deleteIfExpired(key, value2);
            if (deleted === false) {
              yield item;
            }
          }
        }
        for (const item of this.cache) {
          const [key, value2] = item;
          const deleted = this._deleteIfExpired(key, value2);
          if (deleted === false) {
            yield item;
          }
        }
      }
      get(key) {
        if (this.cache.has(key)) {
          const item = this.cache.get(key);
          return this._getItemValue(key, item);
        }
        if (this.oldCache.has(key)) {
          const item = this.oldCache.get(key);
          if (this._deleteIfExpired(key, item) === false) {
            this._moveToRecent(key, item);
            return item.value;
          }
        }
      }
      set(key, value2, { maxAge = this.maxAge === Infinity ? void 0 : Date.now() + this.maxAge } = {}) {
        if (this.cache.has(key)) {
          this.cache.set(key, {
            value: value2,
            maxAge
          });
        } else {
          this._set(key, { value: value2, expiry: maxAge });
        }
      }
      has(key) {
        if (this.cache.has(key)) {
          return !this._deleteIfExpired(key, this.cache.get(key));
        }
        if (this.oldCache.has(key)) {
          return !this._deleteIfExpired(key, this.oldCache.get(key));
        }
        return false;
      }
      peek(key) {
        if (this.cache.has(key)) {
          return this._peek(key, this.cache);
        }
        if (this.oldCache.has(key)) {
          return this._peek(key, this.oldCache);
        }
      }
      delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
          this._size--;
        }
        return this.oldCache.delete(key) || deleted;
      }
      clear() {
        this.cache.clear();
        this.oldCache.clear();
        this._size = 0;
      }
      resize(newSize) {
        if (!(newSize && newSize > 0)) {
          throw new TypeError("`maxSize` must be a number greater than 0");
        }
        const items = [...this._entriesAscending()];
        const removeCount = items.length - newSize;
        if (removeCount < 0) {
          this.cache = new Map(items);
          this.oldCache = /* @__PURE__ */ new Map();
          this._size = items.length;
        } else {
          if (removeCount > 0) {
            this._emitEvictions(items.slice(0, removeCount));
          }
          this.oldCache = new Map(items.slice(removeCount));
          this.cache = /* @__PURE__ */ new Map();
          this._size = 0;
        }
        this.maxSize = newSize;
      }
      *keys() {
        for (const [key] of this) {
          yield key;
        }
      }
      *values() {
        for (const [, value2] of this) {
          yield value2;
        }
      }
      *[Symbol.iterator]() {
        for (const item of this.cache) {
          const [key, value2] = item;
          const deleted = this._deleteIfExpired(key, value2);
          if (deleted === false) {
            yield [key, value2.value];
          }
        }
        for (const item of this.oldCache) {
          const [key, value2] = item;
          if (!this.cache.has(key)) {
            const deleted = this._deleteIfExpired(key, value2);
            if (deleted === false) {
              yield [key, value2.value];
            }
          }
        }
      }
      *entriesDescending() {
        let items = [...this.cache];
        for (let i = items.length - 1; i >= 0; --i) {
          const item = items[i];
          const [key, value2] = item;
          const deleted = this._deleteIfExpired(key, value2);
          if (deleted === false) {
            yield [key, value2.value];
          }
        }
        items = [...this.oldCache];
        for (let i = items.length - 1; i >= 0; --i) {
          const item = items[i];
          const [key, value2] = item;
          if (!this.cache.has(key)) {
            const deleted = this._deleteIfExpired(key, value2);
            if (deleted === false) {
              yield [key, value2.value];
            }
          }
        }
      }
      *entriesAscending() {
        for (const [key, value2] of this._entriesAscending()) {
          yield [key, value2.value];
        }
      }
      get size() {
        if (!this._size) {
          return this.oldCache.size;
        }
        let oldCacheSize = 0;
        for (const key of this.oldCache.keys()) {
          if (!this.cache.has(key)) {
            oldCacheSize++;
          }
        }
        return Math.min(this._size + oldCacheSize, this.maxSize);
      }
    };
    module2.exports = QuickLRU;
  }
});
var require_parse = __commonJS({
  "node_modules/tailwindcss/src/value-parser/parse.js"(exports2, module2) {
    var openParentheses = "(".charCodeAt(0);
    var closeParentheses = ")".charCodeAt(0);
    var singleQuote2 = "'".charCodeAt(0);
    var doubleQuote2 = '"'.charCodeAt(0);
    var backslash2 = "\\".charCodeAt(0);
    var slash2 = "/".charCodeAt(0);
    var comma2 = ",".charCodeAt(0);
    var colon2 = ":".charCodeAt(0);
    var star = "*".charCodeAt(0);
    var uLower = "u".charCodeAt(0);
    var uUpper = "U".charCodeAt(0);
    var plus2 = "+".charCodeAt(0);
    var isUnicodeRange = /^[a-f0-9?-]+$/i;
    module2.exports = function(input2) {
      var tokens = [];
      var value2 = input2;
      var next, quote, prev, token, escape2, escapePos, whitespacePos, parenthesesOpenPos;
      var pos = 0;
      var code = value2.charCodeAt(pos);
      var max2 = value2.length;
      var stack = [{ nodes: tokens }];
      var balanced = 0;
      var parent;
      var name = "";
      var before = "";
      var after = "";
      while (pos < max2) {
        if (code <= 32) {
          next = pos;
          do {
            next += 1;
            code = value2.charCodeAt(next);
          } while (code <= 32);
          token = value2.slice(pos, next);
          prev = tokens[tokens.length - 1];
          if (code === closeParentheses && balanced) {
            after = token;
          } else if (prev && prev.type === "div") {
            prev.after = token;
            prev.sourceEndIndex += token.length;
          } else if (code === comma2 || code === colon2 || code === slash2 && value2.charCodeAt(next + 1) !== star && (!parent || parent && parent.type === "function" && false)) {
            before = token;
          } else {
            tokens.push({
              type: "space",
              sourceIndex: pos,
              sourceEndIndex: next,
              value: token
            });
          }
          pos = next;
        } else if (code === singleQuote2 || code === doubleQuote2) {
          next = pos;
          quote = code === singleQuote2 ? "'" : '"';
          token = {
            type: "string",
            sourceIndex: pos,
            quote
          };
          do {
            escape2 = false;
            next = value2.indexOf(quote, next + 1);
            if (~next) {
              escapePos = next;
              while (value2.charCodeAt(escapePos - 1) === backslash2) {
                escapePos -= 1;
                escape2 = !escape2;
              }
            } else {
              value2 += quote;
              next = value2.length - 1;
              token.unclosed = true;
            }
          } while (escape2);
          token.value = value2.slice(pos + 1, next);
          token.sourceEndIndex = token.unclosed ? next : next + 1;
          tokens.push(token);
          pos = next + 1;
          code = value2.charCodeAt(pos);
        } else if (code === slash2 && value2.charCodeAt(pos + 1) === star) {
          next = value2.indexOf("*/", pos);
          token = {
            type: "comment",
            sourceIndex: pos,
            sourceEndIndex: next + 2
          };
          if (next === -1) {
            token.unclosed = true;
            next = value2.length;
            token.sourceEndIndex = next;
          }
          token.value = value2.slice(pos + 2, next);
          tokens.push(token);
          pos = next + 2;
          code = value2.charCodeAt(pos);
        } else if ((code === slash2 || code === star) && parent && parent.type === "function" && true) {
          token = value2[pos];
          tokens.push({
            type: "word",
            sourceIndex: pos - before.length,
            sourceEndIndex: pos + token.length,
            value: token
          });
          pos += 1;
          code = value2.charCodeAt(pos);
        } else if (code === slash2 || code === comma2 || code === colon2) {
          token = value2[pos];
          tokens.push({
            type: "div",
            sourceIndex: pos - before.length,
            sourceEndIndex: pos + token.length,
            value: token,
            before,
            after: ""
          });
          before = "";
          pos += 1;
          code = value2.charCodeAt(pos);
        } else if (openParentheses === code) {
          next = pos;
          do {
            next += 1;
            code = value2.charCodeAt(next);
          } while (code <= 32);
          parenthesesOpenPos = pos;
          token = {
            type: "function",
            sourceIndex: pos - name.length,
            value: name,
            before: value2.slice(parenthesesOpenPos + 1, next)
          };
          pos = next;
          if (name === "url" && code !== singleQuote2 && code !== doubleQuote2) {
            next -= 1;
            do {
              escape2 = false;
              next = value2.indexOf(")", next + 1);
              if (~next) {
                escapePos = next;
                while (value2.charCodeAt(escapePos - 1) === backslash2) {
                  escapePos -= 1;
                  escape2 = !escape2;
                }
              } else {
                value2 += ")";
                next = value2.length - 1;
                token.unclosed = true;
              }
            } while (escape2);
            whitespacePos = next;
            do {
              whitespacePos -= 1;
              code = value2.charCodeAt(whitespacePos);
            } while (code <= 32);
            if (parenthesesOpenPos < whitespacePos) {
              if (pos !== whitespacePos + 1) {
                token.nodes = [
                  {
                    type: "word",
                    sourceIndex: pos,
                    sourceEndIndex: whitespacePos + 1,
                    value: value2.slice(pos, whitespacePos + 1)
                  }
                ];
              } else {
                token.nodes = [];
              }
              if (token.unclosed && whitespacePos + 1 !== next) {
                token.after = "";
                token.nodes.push({
                  type: "space",
                  sourceIndex: whitespacePos + 1,
                  sourceEndIndex: next,
                  value: value2.slice(whitespacePos + 1, next)
                });
              } else {
                token.after = value2.slice(whitespacePos + 1, next);
                token.sourceEndIndex = next;
              }
            } else {
              token.after = "";
              token.nodes = [];
            }
            pos = next + 1;
            token.sourceEndIndex = token.unclosed ? next : pos;
            code = value2.charCodeAt(pos);
            tokens.push(token);
          } else {
            balanced += 1;
            token.after = "";
            token.sourceEndIndex = pos + 1;
            tokens.push(token);
            stack.push(token);
            tokens = token.nodes = [];
            parent = token;
          }
          name = "";
        } else if (closeParentheses === code && balanced) {
          pos += 1;
          code = value2.charCodeAt(pos);
          parent.after = after;
          parent.sourceEndIndex += after.length;
          after = "";
          balanced -= 1;
          stack[stack.length - 1].sourceEndIndex = pos;
          stack.pop();
          parent = stack[balanced];
          tokens = parent.nodes;
        } else {
          next = pos;
          do {
            if (code === backslash2) {
              next += 1;
            }
            next += 1;
            code = value2.charCodeAt(next);
          } while (next < max2 && !(code <= 32 || code === singleQuote2 || code === doubleQuote2 || code === comma2 || code === colon2 || code === slash2 || code === openParentheses || code === star && parent && parent.type === "function" && true || code === slash2 && parent.type === "function" && true || code === closeParentheses && balanced));
          token = value2.slice(pos, next);
          if (openParentheses === code) {
            name = token;
          } else if ((uLower === token.charCodeAt(0) || uUpper === token.charCodeAt(0)) && plus2 === token.charCodeAt(1) && isUnicodeRange.test(token.slice(2))) {
            tokens.push({
              type: "unicode-range",
              sourceIndex: pos,
              sourceEndIndex: next,
              value: token
            });
          } else {
            tokens.push({
              type: "word",
              sourceIndex: pos,
              sourceEndIndex: next,
              value: token
            });
          }
          pos = next;
        }
      }
      for (pos = stack.length - 1; pos; pos -= 1) {
        stack[pos].unclosed = true;
        stack[pos].sourceEndIndex = value2.length;
      }
      return stack[0].nodes;
    };
  }
});
var require_walk = __commonJS({
  "node_modules/tailwindcss/src/value-parser/walk.js"(exports2, module2) {
    module2.exports = function walk(nodes, cb, bubble) {
      var i, max2, node2, result2;
      for (i = 0, max2 = nodes.length; i < max2; i += 1) {
        node2 = nodes[i];
        if (!bubble) {
          result2 = cb(node2, i, nodes);
        }
        if (result2 !== false && node2.type === "function" && Array.isArray(node2.nodes)) {
          walk(node2.nodes, cb, bubble);
        }
        if (bubble) {
          cb(node2, i, nodes);
        }
      }
    };
  }
});
var require_stringify = __commonJS({
  "node_modules/tailwindcss/src/value-parser/stringify.js"(exports2, module2) {
    function stringifyNode(node2, custom) {
      var type = node2.type;
      var value2 = node2.value;
      var buf;
      var customResult;
      if (custom && (customResult = custom(node2)) !== void 0) {
        return customResult;
      } else if (type === "word" || type === "space") {
        return value2;
      } else if (type === "string") {
        buf = node2.quote || "";
        return buf + value2 + (node2.unclosed ? "" : buf);
      } else if (type === "comment") {
        return "/*" + value2 + (node2.unclosed ? "" : "*/");
      } else if (type === "div") {
        return (node2.before || "") + value2 + (node2.after || "");
      } else if (Array.isArray(node2.nodes)) {
        buf = stringify2(node2.nodes, custom);
        if (type !== "function") {
          return buf;
        }
        return value2 + "(" + (node2.before || "") + buf + (node2.after || "") + (node2.unclosed ? "" : ")");
      }
      return value2;
    }
    function stringify2(nodes, custom) {
      var result2, i;
      if (Array.isArray(nodes)) {
        result2 = "";
        for (i = nodes.length - 1; ~i; i -= 1) {
          result2 = stringifyNode(nodes[i], custom) + result2;
        }
        return result2;
      }
      return stringifyNode(nodes, custom);
    }
    module2.exports = stringify2;
  }
});
var require_unit = __commonJS({
  "node_modules/tailwindcss/src/value-parser/unit.js"(exports2, module2) {
    var minus = "-".charCodeAt(0);
    var plus2 = "+".charCodeAt(0);
    var dot = ".".charCodeAt(0);
    var exp = "e".charCodeAt(0);
    var EXP = "E".charCodeAt(0);
    function likeNumber(value2) {
      var code = value2.charCodeAt(0);
      var nextCode;
      if (code === plus2 || code === minus) {
        nextCode = value2.charCodeAt(1);
        if (nextCode >= 48 && nextCode <= 57) {
          return true;
        }
        var nextNextCode = value2.charCodeAt(2);
        if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
          return true;
        }
        return false;
      }
      if (code === dot) {
        nextCode = value2.charCodeAt(1);
        if (nextCode >= 48 && nextCode <= 57) {
          return true;
        }
        return false;
      }
      if (code >= 48 && code <= 57) {
        return true;
      }
      return false;
    }
    module2.exports = function(value2) {
      var pos = 0;
      var length2 = value2.length;
      var code;
      var nextCode;
      var nextNextCode;
      if (length2 === 0 || !likeNumber(value2)) {
        return false;
      }
      code = value2.charCodeAt(pos);
      if (code === plus2 || code === minus) {
        pos++;
      }
      while (pos < length2) {
        code = value2.charCodeAt(pos);
        if (code < 48 || code > 57) {
          break;
        }
        pos += 1;
      }
      code = value2.charCodeAt(pos);
      nextCode = value2.charCodeAt(pos + 1);
      if (code === dot && nextCode >= 48 && nextCode <= 57) {
        pos += 2;
        while (pos < length2) {
          code = value2.charCodeAt(pos);
          if (code < 48 || code > 57) {
            break;
          }
          pos += 1;
        }
      }
      code = value2.charCodeAt(pos);
      nextCode = value2.charCodeAt(pos + 1);
      nextNextCode = value2.charCodeAt(pos + 2);
      if ((code === exp || code === EXP) && (nextCode >= 48 && nextCode <= 57 || (nextCode === plus2 || nextCode === minus) && nextNextCode >= 48 && nextNextCode <= 57)) {
        pos += nextCode === plus2 || nextCode === minus ? 3 : 2;
        while (pos < length2) {
          code = value2.charCodeAt(pos);
          if (code < 48 || code > 57) {
            break;
          }
          pos += 1;
        }
      }
      return {
        number: value2.slice(0, pos),
        unit: value2.slice(pos)
      };
    };
  }
});
var require_value_parser = __commonJS({
  "node_modules/tailwindcss/src/value-parser/index.js"(exports2, module2) {
    var parse2 = require_parse();
    var walk = require_walk();
    var stringify2 = require_stringify();
    function ValueParser(value2) {
      if (this instanceof ValueParser) {
        this.nodes = parse2(value2);
        return this;
      }
      return new ValueParser(value2);
    }
    ValueParser.prototype.toString = function() {
      return Array.isArray(this.nodes) ? stringify2(this.nodes) : "";
    };
    ValueParser.prototype.walk = function(cb, bubble) {
      walk(this.nodes, cb, bubble);
      return this;
    };
    ValueParser.unit = require_unit();
    ValueParser.walk = walk;
    ValueParser.stringify = stringify2;
    module2.exports = ValueParser;
  }
});
var require_config_full = __commonJS({
  "node_modules/tailwindcss/stubs/config.full.js"(exports2, module2) {
    module2.exports = {
      content: [],
      presets: [],
      darkMode: "media",
      theme: {
        accentColor: ({ theme }) => ({
          ...theme("colors"),
          auto: "auto"
        }),
        animation: {
          none: "none",
          spin: "spin 1s linear infinite",
          ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
          pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          bounce: "bounce 1s infinite"
        },
        aria: {
          busy: 'busy="true"',
          checked: 'checked="true"',
          disabled: 'disabled="true"',
          expanded: 'expanded="true"',
          hidden: 'hidden="true"',
          pressed: 'pressed="true"',
          readonly: 'readonly="true"',
          required: 'required="true"',
          selected: 'selected="true"'
        },
        aspectRatio: {
          auto: "auto",
          square: "1 / 1",
          video: "16 / 9"
        },
        backdropBlur: ({ theme }) => theme("blur"),
        backdropBrightness: ({ theme }) => theme("brightness"),
        backdropContrast: ({ theme }) => theme("contrast"),
        backdropGrayscale: ({ theme }) => theme("grayscale"),
        backdropHueRotate: ({ theme }) => theme("hueRotate"),
        backdropInvert: ({ theme }) => theme("invert"),
        backdropOpacity: ({ theme }) => theme("opacity"),
        backdropSaturate: ({ theme }) => theme("saturate"),
        backdropSepia: ({ theme }) => theme("sepia"),
        backgroundColor: ({ theme }) => theme("colors"),
        backgroundImage: {
          none: "none",
          "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
          "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
          "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
          "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
          "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
          "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
          "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
          "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
        },
        backgroundOpacity: ({ theme }) => theme("opacity"),
        backgroundPosition: {
          bottom: "bottom",
          center: "center",
          left: "left",
          "left-bottom": "left bottom",
          "left-top": "left top",
          right: "right",
          "right-bottom": "right bottom",
          "right-top": "right top",
          top: "top"
        },
        backgroundSize: {
          auto: "auto",
          cover: "cover",
          contain: "contain"
        },
        blur: {
          0: "0",
          none: "0",
          sm: "4px",
          DEFAULT: "8px",
          md: "12px",
          lg: "16px",
          xl: "24px",
          "2xl": "40px",
          "3xl": "64px"
        },
        borderColor: ({ theme }) => ({
          ...theme("colors"),
          DEFAULT: theme("colors.gray.200", "currentColor")
        }),
        borderOpacity: ({ theme }) => theme("opacity"),
        borderRadius: {
          none: "0px",
          sm: "0.125rem",
          DEFAULT: "0.25rem",
          md: "0.375rem",
          lg: "0.5rem",
          xl: "0.75rem",
          "2xl": "1rem",
          "3xl": "1.5rem",
          full: "9999px"
        },
        borderSpacing: ({ theme }) => ({
          ...theme("spacing")
        }),
        borderWidth: {
          DEFAULT: "1px",
          0: "0px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        boxShadow: {
          sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
          none: "none"
        },
        boxShadowColor: ({ theme }) => theme("colors"),
        brightness: {
          0: "0",
          50: ".5",
          75: ".75",
          90: ".9",
          95: ".95",
          100: "1",
          105: "1.05",
          110: "1.1",
          125: "1.25",
          150: "1.5",
          200: "2"
        },
        caretColor: ({ theme }) => theme("colors"),
        colors: ({ colors }) => ({
          inherit: colors.inherit,
          current: colors.current,
          transparent: colors.transparent,
          black: colors.black,
          white: colors.white,
          slate: colors.slate,
          gray: colors.gray,
          zinc: colors.zinc,
          neutral: colors.neutral,
          stone: colors.stone,
          red: colors.red,
          orange: colors.orange,
          amber: colors.amber,
          yellow: colors.yellow,
          lime: colors.lime,
          green: colors.green,
          emerald: colors.emerald,
          teal: colors.teal,
          cyan: colors.cyan,
          sky: colors.sky,
          blue: colors.blue,
          indigo: colors.indigo,
          violet: colors.violet,
          purple: colors.purple,
          fuchsia: colors.fuchsia,
          pink: colors.pink,
          rose: colors.rose
        }),
        columns: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          "3xs": "16rem",
          "2xs": "18rem",
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem"
        },
        container: {},
        content: {
          none: "none"
        },
        contrast: {
          0: "0",
          50: ".5",
          75: ".75",
          100: "1",
          125: "1.25",
          150: "1.5",
          200: "2"
        },
        cursor: {
          auto: "auto",
          default: "default",
          pointer: "pointer",
          wait: "wait",
          text: "text",
          move: "move",
          help: "help",
          "not-allowed": "not-allowed",
          none: "none",
          "context-menu": "context-menu",
          progress: "progress",
          cell: "cell",
          crosshair: "crosshair",
          "vertical-text": "vertical-text",
          alias: "alias",
          copy: "copy",
          "no-drop": "no-drop",
          grab: "grab",
          grabbing: "grabbing",
          "all-scroll": "all-scroll",
          "col-resize": "col-resize",
          "row-resize": "row-resize",
          "n-resize": "n-resize",
          "e-resize": "e-resize",
          "s-resize": "s-resize",
          "w-resize": "w-resize",
          "ne-resize": "ne-resize",
          "nw-resize": "nw-resize",
          "se-resize": "se-resize",
          "sw-resize": "sw-resize",
          "ew-resize": "ew-resize",
          "ns-resize": "ns-resize",
          "nesw-resize": "nesw-resize",
          "nwse-resize": "nwse-resize",
          "zoom-in": "zoom-in",
          "zoom-out": "zoom-out"
        },
        divideColor: ({ theme }) => theme("borderColor"),
        divideOpacity: ({ theme }) => theme("borderOpacity"),
        divideWidth: ({ theme }) => theme("borderWidth"),
        dropShadow: {
          sm: "0 1px 1px rgb(0 0 0 / 0.05)",
          DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
          md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
          lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
          xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
          "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
          none: "0 0 #0000"
        },
        fill: ({ theme }) => ({
          none: "none",
          ...theme("colors")
        }),
        flex: {
          1: "1 1 0%",
          auto: "1 1 auto",
          initial: "0 1 auto",
          none: "none"
        },
        flexBasis: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%"
        }),
        flexGrow: {
          0: "0",
          DEFAULT: "1"
        },
        flexShrink: {
          0: "0",
          DEFAULT: "1"
        },
        fontFamily: {
          sans: [
            "ui-sans-serif",
            "system-ui",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"'
          ],
          serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
          mono: [
            "ui-monospace",
            "SFMono-Regular",
            "Menlo",
            "Monaco",
            "Consolas",
            '"Liberation Mono"',
            '"Courier New"',
            "monospace"
          ]
        },
        fontSize: {
          xs: ["0.75rem", { lineHeight: "1rem" }],
          sm: ["0.875rem", { lineHeight: "1.25rem" }],
          base: ["1rem", { lineHeight: "1.5rem" }],
          lg: ["1.125rem", { lineHeight: "1.75rem" }],
          xl: ["1.25rem", { lineHeight: "1.75rem" }],
          "2xl": ["1.5rem", { lineHeight: "2rem" }],
          "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
          "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
          "5xl": ["3rem", { lineHeight: "1" }],
          "6xl": ["3.75rem", { lineHeight: "1" }],
          "7xl": ["4.5rem", { lineHeight: "1" }],
          "8xl": ["6rem", { lineHeight: "1" }],
          "9xl": ["8rem", { lineHeight: "1" }]
        },
        fontWeight: {
          thin: "100",
          extralight: "200",
          light: "300",
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
          extrabold: "800",
          black: "900"
        },
        gap: ({ theme }) => theme("spacing"),
        gradientColorStops: ({ theme }) => theme("colors"),
        gradientColorStopPositions: {
          "0%": "0%",
          "5%": "5%",
          "10%": "10%",
          "15%": "15%",
          "20%": "20%",
          "25%": "25%",
          "30%": "30%",
          "35%": "35%",
          "40%": "40%",
          "45%": "45%",
          "50%": "50%",
          "55%": "55%",
          "60%": "60%",
          "65%": "65%",
          "70%": "70%",
          "75%": "75%",
          "80%": "80%",
          "85%": "85%",
          "90%": "90%",
          "95%": "95%",
          "100%": "100%"
        },
        grayscale: {
          0: "0",
          DEFAULT: "100%"
        },
        gridAutoColumns: {
          auto: "auto",
          min: "min-content",
          max: "max-content",
          fr: "minmax(0, 1fr)"
        },
        gridAutoRows: {
          auto: "auto",
          min: "min-content",
          max: "max-content",
          fr: "minmax(0, 1fr)"
        },
        gridColumn: {
          auto: "auto",
          "span-1": "span 1 / span 1",
          "span-2": "span 2 / span 2",
          "span-3": "span 3 / span 3",
          "span-4": "span 4 / span 4",
          "span-5": "span 5 / span 5",
          "span-6": "span 6 / span 6",
          "span-7": "span 7 / span 7",
          "span-8": "span 8 / span 8",
          "span-9": "span 9 / span 9",
          "span-10": "span 10 / span 10",
          "span-11": "span 11 / span 11",
          "span-12": "span 12 / span 12",
          "span-full": "1 / -1"
        },
        gridColumnEnd: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13"
        },
        gridColumnStart: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13"
        },
        gridRow: {
          auto: "auto",
          "span-1": "span 1 / span 1",
          "span-2": "span 2 / span 2",
          "span-3": "span 3 / span 3",
          "span-4": "span 4 / span 4",
          "span-5": "span 5 / span 5",
          "span-6": "span 6 / span 6",
          "span-7": "span 7 / span 7",
          "span-8": "span 8 / span 8",
          "span-9": "span 9 / span 9",
          "span-10": "span 10 / span 10",
          "span-11": "span 11 / span 11",
          "span-12": "span 12 / span 12",
          "span-full": "1 / -1"
        },
        gridRowEnd: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13"
        },
        gridRowStart: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13"
        },
        gridTemplateColumns: {
          none: "none",
          subgrid: "subgrid",
          1: "repeat(1, minmax(0, 1fr))",
          2: "repeat(2, minmax(0, 1fr))",
          3: "repeat(3, minmax(0, 1fr))",
          4: "repeat(4, minmax(0, 1fr))",
          5: "repeat(5, minmax(0, 1fr))",
          6: "repeat(6, minmax(0, 1fr))",
          7: "repeat(7, minmax(0, 1fr))",
          8: "repeat(8, minmax(0, 1fr))",
          9: "repeat(9, minmax(0, 1fr))",
          10: "repeat(10, minmax(0, 1fr))",
          11: "repeat(11, minmax(0, 1fr))",
          12: "repeat(12, minmax(0, 1fr))"
        },
        gridTemplateRows: {
          none: "none",
          subgrid: "subgrid",
          1: "repeat(1, minmax(0, 1fr))",
          2: "repeat(2, minmax(0, 1fr))",
          3: "repeat(3, minmax(0, 1fr))",
          4: "repeat(4, minmax(0, 1fr))",
          5: "repeat(5, minmax(0, 1fr))",
          6: "repeat(6, minmax(0, 1fr))",
          7: "repeat(7, minmax(0, 1fr))",
          8: "repeat(8, minmax(0, 1fr))",
          9: "repeat(9, minmax(0, 1fr))",
          10: "repeat(10, minmax(0, 1fr))",
          11: "repeat(11, minmax(0, 1fr))",
          12: "repeat(12, minmax(0, 1fr))"
        },
        height: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        hueRotate: {
          0: "0deg",
          15: "15deg",
          30: "30deg",
          60: "60deg",
          90: "90deg",
          180: "180deg"
        },
        inset: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          full: "100%"
        }),
        invert: {
          0: "0",
          DEFAULT: "100%"
        },
        keyframes: {
          spin: {
            to: {
              transform: "rotate(360deg)"
            }
          },
          ping: {
            "75%, 100%": {
              transform: "scale(2)",
              opacity: "0"
            }
          },
          pulse: {
            "50%": {
              opacity: ".5"
            }
          },
          bounce: {
            "0%, 100%": {
              transform: "translateY(-25%)",
              animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
            },
            "50%": {
              transform: "none",
              animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
            }
          }
        },
        letterSpacing: {
          tighter: "-0.05em",
          tight: "-0.025em",
          normal: "0em",
          wide: "0.025em",
          wider: "0.05em",
          widest: "0.1em"
        },
        lineHeight: {
          none: "1",
          tight: "1.25",
          snug: "1.375",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2",
          3: ".75rem",
          4: "1rem",
          5: "1.25rem",
          6: "1.5rem",
          7: "1.75rem",
          8: "2rem",
          9: "2.25rem",
          10: "2.5rem"
        },
        listStyleType: {
          none: "none",
          disc: "disc",
          decimal: "decimal"
        },
        listStyleImage: {
          none: "none"
        },
        margin: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing")
        }),
        lineClamp: {
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6"
        },
        maxHeight: ({ theme }) => ({
          ...theme("spacing"),
          none: "none",
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        maxWidth: ({ theme, breakpoints }) => ({
          ...theme("spacing"),
          none: "none",
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem",
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
          prose: "65ch",
          ...breakpoints(theme("screens"))
        }),
        minHeight: ({ theme }) => ({
          ...theme("spacing"),
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        minWidth: ({ theme }) => ({
          ...theme("spacing"),
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        objectPosition: {
          bottom: "bottom",
          center: "center",
          left: "left",
          "left-bottom": "left bottom",
          "left-top": "left top",
          right: "right",
          "right-bottom": "right bottom",
          "right-top": "right top",
          top: "top"
        },
        opacity: {
          0: "0",
          5: "0.05",
          10: "0.1",
          15: "0.15",
          20: "0.2",
          25: "0.25",
          30: "0.3",
          35: "0.35",
          40: "0.4",
          45: "0.45",
          50: "0.5",
          55: "0.55",
          60: "0.6",
          65: "0.65",
          70: "0.7",
          75: "0.75",
          80: "0.8",
          85: "0.85",
          90: "0.9",
          95: "0.95",
          100: "1"
        },
        order: {
          first: "-9999",
          last: "9999",
          none: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12"
        },
        outlineColor: ({ theme }) => theme("colors"),
        outlineOffset: {
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        outlineWidth: {
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        padding: ({ theme }) => theme("spacing"),
        placeholderColor: ({ theme }) => theme("colors"),
        placeholderOpacity: ({ theme }) => theme("opacity"),
        ringColor: ({ theme }) => ({
          DEFAULT: theme("colors.blue.500", "#3b82f6"),
          ...theme("colors")
        }),
        ringOffsetColor: ({ theme }) => theme("colors"),
        ringOffsetWidth: {
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        ringOpacity: ({ theme }) => ({
          DEFAULT: "0.5",
          ...theme("opacity")
        }),
        ringWidth: {
          DEFAULT: "3px",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        rotate: {
          0: "0deg",
          1: "1deg",
          2: "2deg",
          3: "3deg",
          6: "6deg",
          12: "12deg",
          45: "45deg",
          90: "90deg",
          180: "180deg"
        },
        saturate: {
          0: "0",
          50: ".5",
          100: "1",
          150: "1.5",
          200: "2"
        },
        scale: {
          0: "0",
          50: ".5",
          75: ".75",
          90: ".9",
          95: ".95",
          100: "1",
          105: "1.05",
          110: "1.1",
          125: "1.25",
          150: "1.5"
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px"
        },
        scrollMargin: ({ theme }) => ({
          ...theme("spacing")
        }),
        scrollPadding: ({ theme }) => theme("spacing"),
        sepia: {
          0: "0",
          DEFAULT: "100%"
        },
        skew: {
          0: "0deg",
          1: "1deg",
          2: "2deg",
          3: "3deg",
          6: "6deg",
          12: "12deg"
        },
        space: ({ theme }) => ({
          ...theme("spacing")
        }),
        spacing: {
          px: "1px",
          0: "0px",
          0.5: "0.125rem",
          1: "0.25rem",
          1.5: "0.375rem",
          2: "0.5rem",
          2.5: "0.625rem",
          3: "0.75rem",
          3.5: "0.875rem",
          4: "1rem",
          5: "1.25rem",
          6: "1.5rem",
          7: "1.75rem",
          8: "2rem",
          9: "2.25rem",
          10: "2.5rem",
          11: "2.75rem",
          12: "3rem",
          14: "3.5rem",
          16: "4rem",
          20: "5rem",
          24: "6rem",
          28: "7rem",
          32: "8rem",
          36: "9rem",
          40: "10rem",
          44: "11rem",
          48: "12rem",
          52: "13rem",
          56: "14rem",
          60: "15rem",
          64: "16rem",
          72: "18rem",
          80: "20rem",
          96: "24rem"
        },
        stroke: ({ theme }) => ({
          none: "none",
          ...theme("colors")
        }),
        strokeWidth: {
          0: "0",
          1: "1",
          2: "2"
        },
        supports: {},
        data: {},
        textColor: ({ theme }) => theme("colors"),
        textDecorationColor: ({ theme }) => theme("colors"),
        textDecorationThickness: {
          auto: "auto",
          "from-font": "from-font",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        textIndent: ({ theme }) => ({
          ...theme("spacing")
        }),
        textOpacity: ({ theme }) => theme("opacity"),
        textUnderlineOffset: {
          auto: "auto",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px"
        },
        transformOrigin: {
          center: "center",
          top: "top",
          "top-right": "top right",
          right: "right",
          "bottom-right": "bottom right",
          bottom: "bottom",
          "bottom-left": "bottom left",
          left: "left",
          "top-left": "top left"
        },
        transitionDelay: {
          0: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms"
        },
        transitionDuration: {
          DEFAULT: "150ms",
          0: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms"
        },
        transitionProperty: {
          none: "none",
          all: "all",
          DEFAULT: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
          colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
          opacity: "opacity",
          shadow: "box-shadow",
          transform: "transform"
        },
        transitionTimingFunction: {
          DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
          linear: "linear",
          in: "cubic-bezier(0.4, 0, 1, 1)",
          out: "cubic-bezier(0, 0, 0.2, 1)",
          "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
        },
        translate: ({ theme }) => ({
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          full: "100%"
        }),
        size: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        width: ({ theme }) => ({
          auto: "auto",
          ...theme("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%",
          screen: "100vw",
          svw: "100svw",
          lvw: "100lvw",
          dvw: "100dvw",
          min: "min-content",
          max: "max-content",
          fit: "fit-content"
        }),
        willChange: {
          auto: "auto",
          scroll: "scroll-position",
          contents: "contents",
          transform: "transform"
        },
        zIndex: {
          auto: "auto",
          0: "0",
          10: "10",
          20: "20",
          30: "30",
          40: "40",
          50: "50"
        }
      },
      plugins: []
    };
  }
});
function log() {
}
function dim(input2) {
  return input2;
}
var log_default = {
  info: log,
  warn: log,
  risk: log
};
function normalizeTailwindDirectives(root3) {
  let tailwindDirectives = /* @__PURE__ */ new Set();
  let layerDirectives = /* @__PURE__ */ new Set();
  let applyDirectives = /* @__PURE__ */ new Set();
  root3.walkAtRules((atRule2) => {
    if (atRule2.name === "apply") {
      applyDirectives.add(atRule2);
    }
    if (atRule2.name === "import") {
      if (atRule2.params === '"tailwindcss/base"' || atRule2.params === "'tailwindcss/base'") {
        atRule2.name = "tailwind";
        atRule2.params = "base";
      } else if (atRule2.params === '"tailwindcss/components"' || atRule2.params === "'tailwindcss/components'") {
        atRule2.name = "tailwind";
        atRule2.params = "components";
      } else if (atRule2.params === '"tailwindcss/utilities"' || atRule2.params === "'tailwindcss/utilities'") {
        atRule2.name = "tailwind";
        atRule2.params = "utilities";
      } else if (atRule2.params === '"tailwindcss/screens"' || atRule2.params === "'tailwindcss/screens'" || atRule2.params === '"tailwindcss/variants"' || atRule2.params === "'tailwindcss/variants'") {
        atRule2.name = "tailwind";
        atRule2.params = "variants";
      }
    }
    if (atRule2.name === "tailwind") {
      if (atRule2.params === "screens") {
        atRule2.params = "variants";
      }
      tailwindDirectives.add(atRule2.params);
    }
    if (["layer", "responsive", "variants"].includes(atRule2.name)) {
      if (["responsive", "variants"].includes(atRule2.name)) {
        log_default.warn(`${atRule2.name}-at-rule-deprecated`, [
          `The \`@${atRule2.name}\` directive has been deprecated in Tailwind CSS v3.0.`,
          `Use \`@layer utilities\` or \`@layer components\` instead.`,
          "https://tailwindcss.com/docs/upgrade-guide#replace-variants-with-layer"
        ]);
      }
      layerDirectives.add(atRule2);
    }
  });
  if (!tailwindDirectives.has("base") || !tailwindDirectives.has("components") || !tailwindDirectives.has("utilities")) {
    for (let rule2 of layerDirectives) {
      if (rule2.name === "layer" && ["base", "components", "utilities"].includes(rule2.params)) {
        if (!tailwindDirectives.has(rule2.params)) {
          throw rule2.error(
            `\`@layer ${rule2.params}\` is used but no matching \`@tailwind ${rule2.params}\` directive is present.`
          );
        }
      } else if (rule2.name === "responsive") {
        if (!tailwindDirectives.has("utilities")) {
          throw rule2.error("`@responsive` is used but `@tailwind utilities` is missing.");
        }
      } else if (rule2.name === "variants") {
        if (!tailwindDirectives.has("utilities")) {
          throw rule2.error("`@variants` is used but `@tailwind utilities` is missing.");
        }
      }
    }
  }
  return { tailwindDirectives, applyDirectives };
}
var preflight_default = '*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme("borderColor.DEFAULT",currentColor)}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme("fontFamily.sans",ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:theme("fontFamily.sans[1].fontFeatureSettings",normal);font-variation-settings:theme("fontFamily.sans[1].fontVariationSettings",normal);-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:theme("fontFamily.mono",ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:theme("fontFamily.mono[1].fontFeatureSettings",normal);font-variation-settings:theme("fontFamily.mono[1].fontVariationSettings",normal);font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme("colors.gray.400",#9ca3af)}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}\n';
var fs_default = {
  readFileSync: () => preflight_default
};
var import_quick_lru = __toESM(require_quick_lru());
var version = "3.4.1";
var package_default = {
  name: "tailwindcss",
  version,
  description: "A utility-first CSS framework for rapidly building custom user interfaces.",
  license: "MIT",
  main: "lib/index.js",
  types: "types/index.d.ts",
  repository: "https://github.com/tailwindlabs/tailwindcss.git",
  bugs: "https://github.com/tailwindlabs/tailwindcss/issues",
  homepage: "https://tailwindcss.com",
  bin: {
    tailwind: "lib/cli.js",
    tailwindcss: "lib/cli.js"
  },
  tailwindcss: {
    engine: "stable"
  },
  scripts: {
    prebuild: "npm run generate && rimraf lib",
    build: `swc src --out-dir lib --copy-files --config jsc.transform.optimizer.globals.vars.__OXIDE__='"false"'`,
    postbuild: "esbuild lib/cli-peer-dependencies.js --bundle --platform=node --outfile=peers/index.js --define:process.env.CSS_TRANSFORMER_WASM=false",
    "rebuild-fixtures": "npm run build && node -r @swc/register scripts/rebuildFixtures.js",
    style: "eslint .",
    pretest: "npm run generate",
    test: "jest",
    "test:integrations": "npm run test --prefix ./integrations",
    "install:integrations": "node scripts/install-integrations.js",
    "generate:plugin-list": "node -r @swc/register scripts/create-plugin-list.js",
    "generate:types": "node -r @swc/register scripts/generate-types.js",
    generate: "npm run generate:plugin-list && npm run generate:types",
    "release-channel": "node ./scripts/release-channel.js",
    "release-notes": "node ./scripts/release-notes.js",
    prepublishOnly: "npm install --force && npm run build"
  },
  files: [
    "src/*",
    "cli/*",
    "lib/*",
    "peers/*",
    "scripts/*.js",
    "stubs/*",
    "nesting/*",
    "types/**/*",
    "*.d.ts",
    "*.css",
    "*.js"
  ],
  devDependencies: {
    "@swc/cli": "^0.1.62",
    "@swc/core": "^1.3.55",
    "@swc/jest": "^0.2.26",
    "@swc/register": "^0.1.10",
    autoprefixer: "^10.4.14",
    browserslist: "^4.21.5",
    concurrently: "^8.0.1",
    cssnano: "^6.0.0",
    esbuild: "^0.17.18",
    eslint: "^8.39.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    jest: "^29.6.0",
    "jest-diff": "^29.6.0",
    lightningcss: "1.18.0",
    prettier: "^2.8.8",
    rimraf: "^5.0.0",
    "source-map-js": "^1.0.2",
    turbo: "^1.9.3"
  },
  dependencies: {
    "@alloc/quick-lru": "^5.2.0",
    arg: "^5.0.2",
    chokidar: "^3.5.3",
    didyoumean: "^1.2.2",
    dlv: "^1.1.3",
    "fast-glob": "^3.3.0",
    "glob-parent": "^6.0.2",
    "is-glob": "^4.0.3",
    jiti: "^1.19.1",
    lilconfig: "^2.1.0",
    micromatch: "^4.0.5",
    "normalize-path": "^3.0.0",
    "object-hash": "^3.0.0",
    picocolors: "^1.0.0",
    postcss: "^8.4.23",
    "postcss-import": "^15.1.0",
    "postcss-js": "^4.0.1",
    "postcss-load-config": "^4.0.1",
    "postcss-nested": "^6.0.1",
    "postcss-selector-parser": "^6.0.11",
    resolve: "^1.22.2",
    sucrase: "^3.32.0"
  },
  browserslist: [
    "> 1%",
    "not edge <= 18",
    "not ie 11",
    "not op_mini all"
  ],
  jest: {
    testTimeout: 3e4,
    setupFilesAfterEnv: [
      "<rootDir>/jest/customMatchers.js"
    ],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/integrations/",
      "/standalone-cli/",
      "\\.test\\.skip\\.js$"
    ],
    transformIgnorePatterns: [
      "node_modules/(?!lightningcss)"
    ],
    transform: {
      "\\.js$": "@swc/jest",
      "\\.ts$": "@swc/jest"
    }
  },
  engines: {
    node: ">=14.0.0"
  }
};
var env = typeof process !== "undefined" ? {
  NODE_ENV: "development",
  DEBUG: resolveDebug(void 0),
  ENGINE: package_default.tailwindcss.engine
} : {
  NODE_ENV: "production",
  DEBUG: false,
  ENGINE: package_default.tailwindcss.engine
};
var contextSourcesMap = /* @__PURE__ */ new Map();
var NOT_ON_DEMAND = new String("*");
var NONE = Symbol("__NONE__");
function resolveDebug(debug) {
  if (debug === void 0) {
    return false;
  }
  if (debug === "true" || debug === "1") {
    return true;
  }
  if (debug === "false" || debug === "0") {
    return false;
  }
  if (debug === "*") {
    return true;
  }
  let debuggers = debug.split(",").map((d) => d.split(":")[0]);
  if (debuggers.includes("-tailwindcss")) {
    return false;
  }
  if (debuggers.includes("tailwindcss")) {
    return true;
  }
  return false;
}
function parseObjectStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseObjectStyles([styles]);
  }
  return styles.flatMap((style) => {
    return postcss$5([
      postcssNested({
        bubble: ["screen"]
      })
    ]).process(style, {
      parser: index
    }).root.nodes;
  });
}
function isPlainObject(value2) {
  if (Object.prototype.toString.call(value2) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value2);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function prefixSelector_default(prefix3, selector3, prependNegative = false) {
  if (prefix3 === "") {
    return selector3;
  }
  let ast = typeof selector3 === "string" ? selectorParser4().astSync(selector3) : selector3;
  ast.walkClasses((classSelector) => {
    let baseClass = classSelector.value;
    let shouldPlaceNegativeBeforePrefix = prependNegative && baseClass.startsWith("-");
    classSelector.value = shouldPlaceNegativeBeforePrefix ? `-${prefix3}${baseClass.slice(1)}` : `${prefix3}${baseClass}`;
  });
  return typeof selector3 === "string" ? ast.toString() : ast;
}
function escapeCommas(className3) {
  return className3.replace(/\\,/g, "\\2c ");
}
var colorNames_default = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
var HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
var SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
var VALUE = /(?:\d+|\d*\.\d+)%?/;
var SEP = /(?:\s*,\s*|\s+)/;
var ALPHA_SEP = /\s*[,/]\s*/;
var CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/;
var RGB = new RegExp(
  `^(rgba?)\\(\\s*(${VALUE.source}|${CUSTOM_PROPERTY.source})(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
);
var HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY.source})(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
);
function parseColor(value2, { loose = false } = {}) {
  var _a, _b;
  if (typeof value2 !== "string") {
    return null;
  }
  value2 = value2.trim();
  if (value2 === "transparent") {
    return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" };
  }
  if (value2 in colorNames_default) {
    return { mode: "rgb", color: colorNames_default[value2].map((v) => v.toString()) };
  }
  let hex = value2.replace(SHORT_HEX, (_, r2, g, b, a) => ["#", r2, r2, g, g, b, b, a ? a + a : ""].join("")).match(HEX);
  if (hex !== null) {
    return {
      mode: "rgb",
      color: [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)].map(
        (v) => v.toString()
      ),
      alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : void 0
    };
  }
  let match = value2.match(RGB) ?? value2.match(HSL);
  if (match === null) {
    return null;
  }
  let color2 = [match[2], match[3], match[4]].filter(Boolean).map((v) => v.toString());
  if (color2.length === 2 && color2[0].startsWith("var(")) {
    return {
      mode: match[1],
      color: [color2[0]],
      alpha: color2[1]
    };
  }
  if (!loose && color2.length !== 3) {
    return null;
  }
  if (color2.length < 3 && !color2.some((part) => /^var\(.*?\)$/.test(part))) {
    return null;
  }
  return {
    mode: match[1],
    color: color2,
    alpha: (_b = (_a = match[5]) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a)
  };
}
function formatColor({ mode, color: color2, alpha }) {
  let hasAlpha = alpha !== void 0;
  if (mode === "rgba" || mode === "hsla") {
    return `${mode}(${color2.join(", ")}${hasAlpha ? `, ${alpha}` : ""})`;
  }
  return `${mode}(${color2.join(" ")}${hasAlpha ? ` / ${alpha}` : ""})`;
}
function withAlphaValue(color2, alphaValue, defaultValue) {
  if (typeof color2 === "function") {
    return color2({ opacityValue: alphaValue });
  }
  let parsed = parseColor(color2, { loose: true });
  if (parsed === null) {
    return defaultValue;
  }
  return formatColor({ ...parsed, alpha: alphaValue });
}
function withAlphaVariable({ color: color2, property, variable }) {
  let properties = [].concat(property);
  if (typeof color2 === "function") {
    return {
      [variable]: "1",
      ...Object.fromEntries(
        properties.map((p) => {
          return [p, color2({ opacityVariable: variable, opacityValue: `var(${variable})` })];
        })
      )
    };
  }
  const parsed = parseColor(color2);
  if (parsed === null) {
    return Object.fromEntries(properties.map((p) => [p, color2]));
  }
  if (parsed.alpha !== void 0) {
    return Object.fromEntries(properties.map((p) => [p, color2]));
  }
  return {
    [variable]: "1",
    ...Object.fromEntries(
      properties.map((p) => {
        return [p, formatColor({ ...parsed, alpha: `var(${variable})` })];
      })
    )
  };
}
function splitAtTopLevelOnly(input2, separator) {
  let stack = [];
  let parts = [];
  let lastPos = 0;
  let isEscaped = false;
  for (let idx = 0; idx < input2.length; idx++) {
    let char = input2[idx];
    if (stack.length === 0 && char === separator[0] && !isEscaped) {
      if (separator.length === 1 || input2.slice(idx, idx + separator.length) === separator) {
        parts.push(input2.slice(lastPos, idx));
        lastPos = idx + separator.length;
      }
    }
    if (isEscaped) {
      isEscaped = false;
    } else if (char === "\\") {
      isEscaped = true;
    }
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char === ")" && stack[stack.length - 1] === "(" || char === "]" && stack[stack.length - 1] === "[" || char === "}" && stack[stack.length - 1] === "{") {
      stack.pop();
    }
  }
  parts.push(input2.slice(lastPos));
  return parts;
}
var KEYWORDS = /* @__PURE__ */ new Set(["inset", "inherit", "initial", "revert", "unset"]);
var SPACE = /\ +(?![^(]*\))/g;
var LENGTH = /^-?(\d+|\.\d+)(.*?)$/g;
function parseBoxShadowValue(input2) {
  let shadows = splitAtTopLevelOnly(input2, ",");
  return shadows.map((shadow2) => {
    let value2 = shadow2.trim();
    let result2 = { raw: value2 };
    let parts = value2.split(SPACE);
    let seen = /* @__PURE__ */ new Set();
    for (let part of parts) {
      LENGTH.lastIndex = 0;
      if (!seen.has("KEYWORD") && KEYWORDS.has(part)) {
        result2.keyword = part;
        seen.add("KEYWORD");
      } else if (LENGTH.test(part)) {
        if (!seen.has("X")) {
          result2.x = part;
          seen.add("X");
        } else if (!seen.has("Y")) {
          result2.y = part;
          seen.add("Y");
        } else if (!seen.has("BLUR")) {
          result2.blur = part;
          seen.add("BLUR");
        } else if (!seen.has("SPREAD")) {
          result2.spread = part;
          seen.add("SPREAD");
        }
      } else {
        if (!result2.color) {
          result2.color = part;
        } else {
          if (!result2.unknown)
            result2.unknown = [];
          result2.unknown.push(part);
        }
      }
    }
    result2.valid = result2.x !== void 0 && result2.y !== void 0;
    return result2;
  });
}
function formatBoxShadowValue(shadows) {
  return shadows.map((shadow2) => {
    if (!shadow2.valid) {
      return shadow2.raw;
    }
    return [shadow2.keyword, shadow2.x, shadow2.y, shadow2.blur, shadow2.spread, shadow2.color].filter(Boolean).join(" ");
  }).join(", ");
}
var cssFunctions = ["min", "max", "clamp", "calc"];
function isCSSFunction(value2) {
  return cssFunctions.some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value2));
}
var AUTO_VAR_INJECTION_EXCEPTIONS = /* @__PURE__ */ new Set([
  "scroll-timeline-name",
  "timeline-scope",
  "view-timeline-name",
  "font-palette",
  "scroll-timeline",
  "animation-timeline",
  "view-timeline"
]);
function normalize(value2, context = null, isRoot2 = true) {
  let isVarException = context && AUTO_VAR_INJECTION_EXCEPTIONS.has(context.property);
  if (value2.startsWith("--") && !isVarException) {
    return `var(${value2})`;
  }
  if (value2.includes("url(")) {
    return value2.split(/(url\(.*?\))/g).filter(Boolean).map((part) => {
      if (/^url\(.*?\)$/.test(part)) {
        return part;
      }
      return normalize(part, context, false);
    }).join("");
  }
  value2 = value2.replace(
    /([^\\])_+/g,
    (fullMatch, characterBefore) => characterBefore + " ".repeat(fullMatch.length - 1)
  ).replace(/^_/g, " ").replace(/\\_/g, "_");
  if (isRoot2) {
    value2 = value2.trim();
  }
  value2 = normalizeMathOperatorSpacing(value2);
  return value2;
}
function normalizeMathOperatorSpacing(value2) {
  let preventFormattingInFunctions = ["theme"];
  let preventFormattingKeywords = [
    "min-content",
    "max-content",
    "fit-content",
    "safe-area-inset-top",
    "safe-area-inset-right",
    "safe-area-inset-bottom",
    "safe-area-inset-left",
    "titlebar-area-x",
    "titlebar-area-y",
    "titlebar-area-width",
    "titlebar-area-height",
    "keyboard-inset-top",
    "keyboard-inset-right",
    "keyboard-inset-bottom",
    "keyboard-inset-left",
    "keyboard-inset-width",
    "keyboard-inset-height",
    "radial-gradient",
    "linear-gradient",
    "conic-gradient",
    "repeating-radial-gradient",
    "repeating-linear-gradient",
    "repeating-conic-gradient"
  ];
  return value2.replace(/(calc|min|max|clamp)\(.+\)/g, (match) => {
    let result2 = "";
    function lastChar() {
      let char = result2.trimEnd();
      return char[char.length - 1];
    }
    for (let i = 0; i < match.length; i++) {
      let peek = function(word2) {
        return word2.split("").every((char2, j) => match[i + j] === char2);
      }, consumeUntil = function(chars) {
        let minIndex = Infinity;
        for (let char2 of chars) {
          let index2 = match.indexOf(char2, i);
          if (index2 !== -1 && index2 < minIndex) {
            minIndex = index2;
          }
        }
        let result22 = match.slice(i, minIndex);
        i += result22.length - 1;
        return result22;
      };
      let char = match[i];
      if (peek("var")) {
        result2 += consumeUntil([")", ","]);
      } else if (preventFormattingKeywords.some((keyword) => peek(keyword))) {
        let keyword = preventFormattingKeywords.find((keyword2) => peek(keyword2));
        result2 += keyword;
        i += keyword.length - 1;
      } else if (preventFormattingInFunctions.some((fn) => peek(fn))) {
        result2 += consumeUntil([")"]);
      } else if (peek("[")) {
        result2 += consumeUntil(["]"]);
      } else if (["+", "-", "*", "/"].includes(char) && !["(", "+", "-", "*", "/", ","].includes(lastChar())) {
        result2 += ` ${char} `;
      } else {
        result2 += char;
      }
    }
    return result2.replace(/\s+/g, " ");
  });
}
function url(value2) {
  return value2.startsWith("url(");
}
function number$1(value2) {
  return !isNaN(Number(value2)) || isCSSFunction(value2);
}
function percentage(value2) {
  return value2.endsWith("%") && number$1(value2.slice(0, -1)) || isCSSFunction(value2);
}
var lengthUnits = [
  "cm",
  "mm",
  "Q",
  "in",
  "pc",
  "pt",
  "px",
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
  "dvh",
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax"
];
var lengthUnitsPattern = `(?:${lengthUnits.join("|")})`;
function length(value2) {
  return value2 === "0" || new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${lengthUnitsPattern}$`).test(value2) || isCSSFunction(value2);
}
var lineWidths = /* @__PURE__ */ new Set(["thin", "medium", "thick"]);
function lineWidth(value2) {
  return lineWidths.has(value2);
}
function shadow(value2) {
  let parsedShadows = parseBoxShadowValue(normalize(value2));
  for (let parsedShadow of parsedShadows) {
    if (!parsedShadow.valid) {
      return false;
    }
  }
  return true;
}
function color(value2) {
  let colors = 0;
  let result2 = splitAtTopLevelOnly(value2, "_").every((part) => {
    part = normalize(part);
    if (part.startsWith("var("))
      return true;
    if (parseColor(part, { loose: true }) !== null)
      return colors++, true;
    return false;
  });
  if (!result2)
    return false;
  return colors > 0;
}
function image(value2) {
  let images = 0;
  let result2 = splitAtTopLevelOnly(value2, ",").every((part) => {
    part = normalize(part);
    if (part.startsWith("var("))
      return true;
    if (url(part) || gradient(part) || ["element(", "image(", "cross-fade(", "image-set("].some((fn) => part.startsWith(fn))) {
      images++;
      return true;
    }
    return false;
  });
  if (!result2)
    return false;
  return images > 0;
}
var gradientTypes = /* @__PURE__ */ new Set([
  "conic-gradient",
  "linear-gradient",
  "radial-gradient",
  "repeating-conic-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient"
]);
function gradient(value2) {
  value2 = normalize(value2);
  for (let type of gradientTypes) {
    if (value2.startsWith(`${type}(`)) {
      return true;
    }
  }
  return false;
}
var validPositions = /* @__PURE__ */ new Set(["center", "top", "right", "bottom", "left"]);
function position(value2) {
  let positions = 0;
  let result2 = splitAtTopLevelOnly(value2, "_").every((part) => {
    part = normalize(part);
    if (part.startsWith("var("))
      return true;
    if (validPositions.has(part) || length(part) || percentage(part)) {
      positions++;
      return true;
    }
    return false;
  });
  if (!result2)
    return false;
  return positions > 0;
}
function familyName(value2) {
  let fonts = 0;
  let result2 = splitAtTopLevelOnly(value2, ",").every((part) => {
    part = normalize(part);
    if (part.startsWith("var("))
      return true;
    if (part.includes(" ")) {
      if (!/(['"])([^"']+)\1/g.test(part)) {
        return false;
      }
    }
    if (/^\d/g.test(part)) {
      return false;
    }
    fonts++;
    return true;
  });
  if (!result2)
    return false;
  return fonts > 0;
}
var genericNames = /* @__PURE__ */ new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong"
]);
function genericName(value2) {
  return genericNames.has(value2);
}
var absoluteSizes = /* @__PURE__ */ new Set([
  "xx-small",
  "x-small",
  "small",
  "medium",
  "large",
  "x-large",
  "x-large",
  "xxx-large"
]);
function absoluteSize(value2) {
  return absoluteSizes.has(value2);
}
var relativeSizes = /* @__PURE__ */ new Set(["larger", "smaller"]);
function relativeSize(value2) {
  return relativeSizes.has(value2);
}
function negateValue(value2) {
  value2 = `${value2}`;
  if (value2 === "0") {
    return "0";
  }
  if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(value2)) {
    return value2.replace(/^[+-]?/, (sign) => sign === "-" ? "" : "-");
  }
  let numericFunctions = ["var", "calc", "min", "max", "clamp"];
  for (const fn of numericFunctions) {
    if (value2.includes(`${fn}(`)) {
      return `calc(${value2} * -1)`;
    }
  }
}
function backgroundSize(value2) {
  let keywordValues = ["cover", "contain"];
  return splitAtTopLevelOnly(value2, ",").every((part) => {
    let sizes = splitAtTopLevelOnly(part, "_").filter(Boolean);
    if (sizes.length === 1 && keywordValues.includes(sizes[0]))
      return true;
    if (sizes.length !== 1 && sizes.length !== 2)
      return false;
    return sizes.every((size) => length(size) || percentage(size) || size === "auto");
  });
}
var defaults = {
  optimizeUniversalDefaults: false,
  generalizedModifiers: true,
  get disableColorOpacityUtilitiesByDefault() {
    return false;
  },
  get relativeContentPathsByDefault() {
    return false;
  }
};
var featureFlags = {
  future: [
    "hoverOnlyWhenSupported",
    "respectDefaultRingColorOpacity",
    "disableColorOpacityUtilitiesByDefault",
    "relativeContentPathsByDefault"
  ],
  experimental: ["optimizeUniversalDefaults", "generalizedModifiers"]
};
function flagEnabled(config2, flag) {
  var _a, _b;
  if (featureFlags.future.includes(flag)) {
    return config2.future === "all" || (((_a = config2 == null ? void 0 : config2.future) == null ? void 0 : _a[flag]) ?? defaults[flag] ?? false);
  }
  if (featureFlags.experimental.includes(flag)) {
    return config2.experimental === "all" || (((_b = config2 == null ? void 0 : config2.experimental) == null ? void 0 : _b[flag]) ?? defaults[flag] ?? false);
  }
  return false;
}
function issueFlagNotices(config2) {
  {
    return;
  }
}
function updateAllClasses(selectors2, updateClass) {
  selectors2.walkClasses((sel) => {
    sel.value = updateClass(sel.value);
    if (sel.raws && sel.raws.value) {
      sel.raws.value = escapeCommas(sel.raws.value);
    }
  });
}
function resolveArbitraryValue(modifier, validate) {
  if (!isArbitraryValue(modifier)) {
    return void 0;
  }
  let value2 = modifier.slice(1, -1);
  if (!validate(value2)) {
    return void 0;
  }
  return normalize(value2);
}
function asNegativeValue(modifier, lookup = {}, validate) {
  let positiveValue = lookup[modifier];
  if (positiveValue !== void 0) {
    return negateValue(positiveValue);
  }
  if (isArbitraryValue(modifier)) {
    let resolved = resolveArbitraryValue(modifier, validate);
    if (resolved === void 0) {
      return void 0;
    }
    return negateValue(resolved);
  }
}
function asValue(modifier, options = {}, { validate = () => true } = {}) {
  var _a;
  let value2 = (_a = options.values) == null ? void 0 : _a[modifier];
  if (value2 !== void 0) {
    return value2;
  }
  if (options.supportsNegativeValues && modifier.startsWith("-")) {
    return asNegativeValue(modifier.slice(1), options.values, validate);
  }
  return resolveArbitraryValue(modifier, validate);
}
function isArbitraryValue(input2) {
  return input2.startsWith("[") && input2.endsWith("]");
}
function splitUtilityModifier(modifier) {
  let slashIdx = modifier.lastIndexOf("/");
  let arbitraryStartIdx = modifier.lastIndexOf("[", slashIdx);
  let arbitraryEndIdx = modifier.indexOf("]", slashIdx);
  let isNextToArbitrary = modifier[slashIdx - 1] === "]" || modifier[slashIdx + 1] === "[";
  if (!isNextToArbitrary) {
    if (arbitraryStartIdx !== -1 && arbitraryEndIdx !== -1) {
      if (arbitraryStartIdx < slashIdx && slashIdx < arbitraryEndIdx) {
        slashIdx = modifier.lastIndexOf("/", arbitraryStartIdx);
      }
    }
  }
  if (slashIdx === -1 || slashIdx === modifier.length - 1) {
    return [modifier, void 0];
  }
  let arbitrary = isArbitraryValue(modifier);
  if (arbitrary && !modifier.includes("]/[")) {
    return [modifier, void 0];
  }
  return [modifier.slice(0, slashIdx), modifier.slice(slashIdx + 1)];
}
function parseColorFormat(value2) {
  if (typeof value2 === "string" && value2.includes("<alpha-value>")) {
    let oldValue = value2;
    return ({ opacityValue = 1 }) => oldValue.replace("<alpha-value>", opacityValue);
  }
  return value2;
}
function unwrapArbitraryModifier(modifier) {
  return normalize(modifier.slice(1, -1));
}
function asColor(modifier, options = {}, { tailwindConfig = {} } = {}) {
  var _a, _b, _c, _d, _e;
  if (((_a = options.values) == null ? void 0 : _a[modifier]) !== void 0) {
    return parseColorFormat((_b = options.values) == null ? void 0 : _b[modifier]);
  }
  let [color2, alpha] = splitUtilityModifier(modifier);
  if (alpha !== void 0) {
    let normalizedColor = ((_c = options.values) == null ? void 0 : _c[color2]) ?? (isArbitraryValue(color2) ? color2.slice(1, -1) : void 0);
    if (normalizedColor === void 0) {
      return void 0;
    }
    normalizedColor = parseColorFormat(normalizedColor);
    if (isArbitraryValue(alpha)) {
      return withAlphaValue(normalizedColor, unwrapArbitraryModifier(alpha));
    }
    if (((_e = (_d = tailwindConfig.theme) == null ? void 0 : _d.opacity) == null ? void 0 : _e[alpha]) === void 0) {
      return void 0;
    }
    return withAlphaValue(normalizedColor, tailwindConfig.theme.opacity[alpha]);
  }
  return asValue(modifier, options, { validate: color });
}
function asLookupValue(modifier, options = {}) {
  var _a;
  return (_a = options.values) == null ? void 0 : _a[modifier];
}
function guess(validate) {
  return (modifier, options) => {
    return asValue(modifier, options, { validate });
  };
}
var typeMap = {
  any: asValue,
  color: asColor,
  url: guess(url),
  image: guess(image),
  length: guess(length),
  percentage: guess(percentage),
  position: guess(position),
  lookup: asLookupValue,
  "generic-name": guess(genericName),
  "family-name": guess(familyName),
  number: guess(number$1),
  "line-width": guess(lineWidth),
  "absolute-size": guess(absoluteSize),
  "relative-size": guess(relativeSize),
  shadow: guess(shadow),
  size: guess(backgroundSize)
};
var supportedTypes = Object.keys(typeMap);
function splitAtFirst(input2, delim) {
  let idx = input2.indexOf(delim);
  if (idx === -1)
    return [void 0, input2];
  return [input2.slice(0, idx), input2.slice(idx + 1)];
}
function coerceValue(types2, modifier, options, tailwindConfig) {
  if (options.values && modifier in options.values) {
    for (let { type } of types2 ?? []) {
      let result2 = typeMap[type](modifier, options, {
        tailwindConfig
      });
      if (result2 === void 0) {
        continue;
      }
      return [result2, type, null];
    }
  }
  if (isArbitraryValue(modifier)) {
    let arbitraryValue = modifier.slice(1, -1);
    let [explicitType, value2] = splitAtFirst(arbitraryValue, ":");
    if (!/^[\w-_]+$/g.test(explicitType)) {
      value2 = arbitraryValue;
    } else if (explicitType !== void 0 && !supportedTypes.includes(explicitType)) {
      return [];
    }
    if (value2.length > 0 && supportedTypes.includes(explicitType)) {
      return [asValue(`[${value2}]`, options), explicitType, null];
    }
  }
  let matches = getMatchingTypes(types2, modifier, options, tailwindConfig);
  for (let match of matches) {
    return match;
  }
  return [];
}
function* getMatchingTypes(types2, rawModifier, options, tailwindConfig) {
  var _a;
  let modifiersEnabled = flagEnabled(tailwindConfig, "generalizedModifiers");
  let [modifier, utilityModifier] = splitUtilityModifier(rawModifier);
  let canUseUtilityModifier = modifiersEnabled && options.modifiers != null && (options.modifiers === "any" || typeof options.modifiers === "object" && (utilityModifier && isArbitraryValue(utilityModifier) || utilityModifier in options.modifiers));
  if (!canUseUtilityModifier) {
    modifier = rawModifier;
    utilityModifier = void 0;
  }
  if (utilityModifier !== void 0 && modifier === "") {
    modifier = "DEFAULT";
  }
  if (utilityModifier !== void 0) {
    if (typeof options.modifiers === "object") {
      let configValue = ((_a = options.modifiers) == null ? void 0 : _a[utilityModifier]) ?? null;
      if (configValue !== null) {
        utilityModifier = configValue;
      } else if (isArbitraryValue(utilityModifier)) {
        utilityModifier = unwrapArbitraryModifier(utilityModifier);
      }
    }
  }
  for (let { type } of types2 ?? []) {
    let result2 = typeMap[type](modifier, options, {
      tailwindConfig
    });
    if (result2 === void 0) {
      continue;
    }
    yield [result2, type, utilityModifier ?? null];
  }
}
function escapeClassName(className3) {
  var _a;
  let node2 = selectorParser4.className();
  node2.value = className3;
  return escapeCommas(((_a = node2 == null ? void 0 : node2.raws) == null ? void 0 : _a.value) ?? node2.value);
}
var elementProperties = {
  "::after": ["terminal", "jumpable"],
  "::backdrop": ["terminal", "jumpable"],
  "::before": ["terminal", "jumpable"],
  "::cue": ["terminal"],
  "::cue-region": ["terminal"],
  "::first-letter": ["terminal", "jumpable"],
  "::first-line": ["terminal", "jumpable"],
  "::grammar-error": ["terminal"],
  "::marker": ["terminal", "jumpable"],
  "::part": ["terminal", "actionable"],
  "::placeholder": ["terminal", "jumpable"],
  "::selection": ["terminal", "jumpable"],
  "::slotted": ["terminal"],
  "::spelling-error": ["terminal"],
  "::target-text": ["terminal"],
  "::file-selector-button": ["terminal", "actionable"],
  "::deep": ["actionable"],
  "::v-deep": ["actionable"],
  "::ng-deep": ["actionable"],
  ":after": ["terminal", "jumpable"],
  ":before": ["terminal", "jumpable"],
  ":first-letter": ["terminal", "jumpable"],
  ":first-line": ["terminal", "jumpable"],
  ":where": [],
  ":is": [],
  ":has": [],
  __default__: ["terminal", "actionable"]
};
function movePseudos(sel) {
  let [pseudos] = movablePseudos(sel);
  pseudos.forEach(([sel2, pseudo3]) => sel2.removeChild(pseudo3));
  sel.nodes.push(...pseudos.map(([, pseudo3]) => pseudo3));
  return sel;
}
function movablePseudos(sel) {
  let buffer = [];
  let lastSeenElement = null;
  for (let node2 of sel.nodes) {
    if (node2.type === "combinator") {
      buffer = buffer.filter(([, node22]) => propertiesForPseudo(node22).includes("jumpable"));
      lastSeenElement = null;
    } else if (node2.type === "pseudo") {
      if (isMovablePseudoElement(node2)) {
        lastSeenElement = node2;
        buffer.push([sel, node2, null]);
      } else if (lastSeenElement && isAttachablePseudoClass(node2, lastSeenElement)) {
        buffer.push([sel, node2, lastSeenElement]);
      } else {
        lastSeenElement = null;
      }
      for (let sub of node2.nodes ?? []) {
        let [movable, lastSeenElementInSub] = movablePseudos(sub);
        lastSeenElement = lastSeenElementInSub || lastSeenElement;
        buffer.push(...movable);
      }
    }
  }
  return [buffer, lastSeenElement];
}
function isPseudoElement(node2) {
  return node2.value.startsWith("::") || elementProperties[node2.value] !== void 0;
}
function isMovablePseudoElement(node2) {
  return isPseudoElement(node2) && propertiesForPseudo(node2).includes("terminal");
}
function isAttachablePseudoClass(node2, pseudo3) {
  if (node2.type !== "pseudo")
    return false;
  if (isPseudoElement(node2))
    return false;
  return propertiesForPseudo(pseudo3).includes("actionable");
}
function propertiesForPseudo(pseudo3) {
  return elementProperties[pseudo3.value] ?? elementProperties.__default__;
}
var MERGE = ":merge";
function formatVariantSelector(formats, { context, candidate }) {
  let prefix3 = (context == null ? void 0 : context.tailwindConfig.prefix) ?? "";
  let parsedFormats = formats.map((format) => {
    let ast = selectorParser4().astSync(format.format);
    return {
      ...format,
      ast: format.respectPrefix ? prefixSelector_default(prefix3, ast) : ast
    };
  });
  let formatAst = selectorParser4.root({
    nodes: [
      selectorParser4.selector({
        nodes: [selectorParser4.className({ value: escapeClassName(candidate) })]
      })
    ]
  });
  for (let { ast } of parsedFormats) {
    [formatAst, ast] = handleMergePseudo(formatAst, ast);
    ast.walkNesting((nesting3) => nesting3.replaceWith(...formatAst.nodes[0].nodes));
    formatAst = ast;
  }
  return formatAst;
}
function simpleSelectorForNode(node2) {
  let nodes = [];
  while (node2.prev() && node2.prev().type !== "combinator") {
    node2 = node2.prev();
  }
  while (node2 && node2.type !== "combinator") {
    nodes.push(node2);
    node2 = node2.next();
  }
  return nodes;
}
function resortSelector(sel) {
  sel.sort((a, b) => {
    if (a.type === "tag" && b.type === "class") {
      return -1;
    } else if (a.type === "class" && b.type === "tag") {
      return 1;
    } else if (a.type === "class" && b.type === "pseudo" && b.value.startsWith("::")) {
      return -1;
    } else if (a.type === "pseudo" && a.value.startsWith("::") && b.type === "class") {
      return 1;
    }
    return sel.index(a) - sel.index(b);
  });
  return sel;
}
function eliminateIrrelevantSelectors(sel, base) {
  let hasClassesMatchingCandidate = false;
  sel.walk((child) => {
    if (child.type === "class" && child.value === base) {
      hasClassesMatchingCandidate = true;
      return false;
    }
  });
  if (!hasClassesMatchingCandidate) {
    sel.remove();
  }
}
function finalizeSelector(current, formats, { context, candidate, base }) {
  var _a;
  let separator = ((_a = context == null ? void 0 : context.tailwindConfig) == null ? void 0 : _a.separator) ?? ":";
  base = base ?? splitAtTopLevelOnly(candidate, separator).pop();
  let selector3 = selectorParser4().astSync(current);
  selector3.walkClasses((node2) => {
    if (node2.raws && node2.value.includes(base)) {
      node2.raws.value = escapeClassName(unescape$1(node2.raws.value));
    }
  });
  selector3.each((sel) => eliminateIrrelevantSelectors(sel, base));
  if (selector3.length === 0) {
    return null;
  }
  let formatAst = Array.isArray(formats) ? formatVariantSelector(formats, { context, candidate }) : formats;
  if (formatAst === null) {
    return selector3.toString();
  }
  let simpleStart = selectorParser4.comment({ value: "/*__simple__*/" });
  let simpleEnd = selectorParser4.comment({ value: "/*__simple__*/" });
  selector3.walkClasses((node2) => {
    if (node2.value !== base) {
      return;
    }
    let parent = node2.parent;
    let formatNodes = formatAst.nodes[0].nodes;
    if (parent.nodes.length === 1) {
      node2.replaceWith(...formatNodes);
      return;
    }
    let simpleSelector = simpleSelectorForNode(node2);
    parent.insertBefore(simpleSelector[0], simpleStart);
    parent.insertAfter(simpleSelector[simpleSelector.length - 1], simpleEnd);
    for (let child of formatNodes) {
      parent.insertBefore(simpleSelector[0], child.clone());
    }
    node2.remove();
    simpleSelector = simpleSelectorForNode(simpleStart);
    let firstNode = parent.index(simpleStart);
    parent.nodes.splice(
      firstNode,
      simpleSelector.length,
      ...resortSelector(selectorParser4.selector({ nodes: simpleSelector })).nodes
    );
    simpleStart.remove();
    simpleEnd.remove();
  });
  selector3.walkPseudos((p) => {
    if (p.value === MERGE) {
      p.replaceWith(p.nodes);
    }
  });
  selector3.each((sel) => movePseudos(sel));
  return selector3.toString();
}
function handleMergePseudo(selector3, format) {
  let merges = [];
  selector3.walkPseudos((pseudo3) => {
    if (pseudo3.value === MERGE) {
      merges.push({
        pseudo: pseudo3,
        value: pseudo3.nodes[0].toString()
      });
    }
  });
  format.walkPseudos((pseudo3) => {
    if (pseudo3.value !== MERGE) {
      return;
    }
    let value2 = pseudo3.nodes[0].toString();
    let existing = merges.find((merge3) => merge3.value === value2);
    if (!existing) {
      return;
    }
    let attachments = [];
    let next = pseudo3.next();
    while (next && next.type !== "combinator") {
      attachments.push(next);
      next = next.next();
    }
    let combinator3 = next;
    existing.pseudo.parent.insertAfter(
      existing.pseudo,
      selectorParser4.selector({ nodes: attachments.map((node2) => node2.clone()) })
    );
    pseudo3.remove();
    attachments.forEach((node2) => node2.remove());
    if (combinator3 && combinator3.type === "combinator") {
      combinator3.remove();
    }
  });
  return [selector3, format];
}
function asClass(name) {
  return escapeCommas(`.${escapeClassName(name)}`);
}
function nameClass(classPrefix, key) {
  return asClass(formatClass(classPrefix, key));
}
function formatClass(classPrefix, key) {
  if (key === "DEFAULT") {
    return classPrefix;
  }
  if (key === "-" || key === "-DEFAULT") {
    return `-${classPrefix}`;
  }
  if (key.startsWith("-")) {
    return `-${classPrefix}${key}`;
  }
  if (key.startsWith("/")) {
    return `${classPrefix}${key}`;
  }
  return `${classPrefix}-${key}`;
}
function transformThemeValue(themeSection) {
  if (["fontSize", "outline"].includes(themeSection)) {
    return (value2) => {
      if (typeof value2 === "function")
        value2 = value2({});
      if (Array.isArray(value2))
        value2 = value2[0];
      return value2;
    };
  }
  if (themeSection === "fontFamily") {
    return (value2) => {
      if (typeof value2 === "function")
        value2 = value2({});
      let families = Array.isArray(value2) && isPlainObject(value2[1]) ? value2[0] : value2;
      return Array.isArray(families) ? families.join(", ") : families;
    };
  }
  if ([
    "boxShadow",
    "transitionProperty",
    "transitionDuration",
    "transitionDelay",
    "transitionTimingFunction",
    "backgroundImage",
    "backgroundSize",
    "backgroundColor",
    "cursor",
    "animation"
  ].includes(themeSection)) {
    return (value2) => {
      if (typeof value2 === "function")
        value2 = value2({});
      if (Array.isArray(value2))
        value2 = value2.join(", ");
      return value2;
    };
  }
  if (["gridTemplateColumns", "gridTemplateRows", "objectPosition"].includes(themeSection)) {
    return (value2) => {
      if (typeof value2 === "function")
        value2 = value2({});
      if (typeof value2 === "string")
        value2 = postcss$5.list.comma(value2).join(" ");
      return value2;
    };
  }
  return (value2, opts = {}) => {
    if (typeof value2 === "function") {
      value2 = value2(opts);
    }
    return value2;
  };
}
var join = () => "";
function createUtilityPlugin(themeKey, utilityVariations = [[themeKey, [themeKey]]], { filterDefault: filterDefault2 = false, ...options } = {}) {
  let transformValue = transformThemeValue(themeKey);
  return function({ matchUtilities, theme }) {
    for (let utilityVariation of utilityVariations) {
      let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation];
      matchUtilities(
        group.reduce((obj2, [classPrefix, properties]) => {
          return Object.assign(obj2, {
            [classPrefix]: (value2) => {
              return properties.reduce((obj22, name) => {
                if (Array.isArray(name)) {
                  return Object.assign(obj22, { [name[0]]: name[1] });
                }
                return Object.assign(obj22, { [name]: transformValue(value2) });
              }, {});
            }
          });
        }, {}),
        {
          ...options,
          values: filterDefault2 ? Object.fromEntries(
            Object.entries(theme(themeKey) ?? {}).filter(([modifier]) => modifier !== "DEFAULT")
          ) : theme(themeKey)
        }
      );
    }
  };
}
function buildMediaQuery(screens) {
  screens = Array.isArray(screens) ? screens : [screens];
  return screens.map((screen) => {
    let values = screen.values.map((screen2) => {
      if (screen2.raw !== void 0) {
        return screen2.raw;
      }
      return [
        screen2.min && `(min-width: ${screen2.min})`,
        screen2.max && `(max-width: ${screen2.max})`
      ].filter(Boolean).join(" and ");
    });
    return screen.not ? `not all and ${values}` : values;
  }).join(", ");
}
var DIRECTIONS = /* @__PURE__ */ new Set(["normal", "reverse", "alternate", "alternate-reverse"]);
var PLAY_STATES = /* @__PURE__ */ new Set(["running", "paused"]);
var FILL_MODES = /* @__PURE__ */ new Set(["none", "forwards", "backwards", "both"]);
var ITERATION_COUNTS = /* @__PURE__ */ new Set(["infinite"]);
var TIMINGS = /* @__PURE__ */ new Set([
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "step-start",
  "step-end"
]);
var TIMING_FNS = ["cubic-bezier", "steps"];
var COMMA = /\,(?![^(]*\))/g;
var SPACE2 = /\ +(?![^(]*\))/g;
var TIME = /^(-?[\d.]+m?s)$/;
var DIGIT = /^(\d+)$/;
function parseAnimationValue(input2) {
  let animations = input2.split(COMMA);
  return animations.map((animation) => {
    let value2 = animation.trim();
    let result2 = { value: value2 };
    let parts = value2.split(SPACE2);
    let seen = /* @__PURE__ */ new Set();
    for (let part of parts) {
      if (!seen.has("DIRECTIONS") && DIRECTIONS.has(part)) {
        result2.direction = part;
        seen.add("DIRECTIONS");
      } else if (!seen.has("PLAY_STATES") && PLAY_STATES.has(part)) {
        result2.playState = part;
        seen.add("PLAY_STATES");
      } else if (!seen.has("FILL_MODES") && FILL_MODES.has(part)) {
        result2.fillMode = part;
        seen.add("FILL_MODES");
      } else if (!seen.has("ITERATION_COUNTS") && (ITERATION_COUNTS.has(part) || DIGIT.test(part))) {
        result2.iterationCount = part;
        seen.add("ITERATION_COUNTS");
      } else if (!seen.has("TIMING_FUNCTION") && TIMINGS.has(part)) {
        result2.timingFunction = part;
        seen.add("TIMING_FUNCTION");
      } else if (!seen.has("TIMING_FUNCTION") && TIMING_FNS.some((f) => part.startsWith(`${f}(`))) {
        result2.timingFunction = part;
        seen.add("TIMING_FUNCTION");
      } else if (!seen.has("DURATION") && TIME.test(part)) {
        result2.duration = part;
        seen.add("DURATION");
      } else if (!seen.has("DELAY") && TIME.test(part)) {
        result2.delay = part;
        seen.add("DELAY");
      } else if (!seen.has("NAME")) {
        result2.name = part;
        seen.add("NAME");
      } else {
        if (!result2.unknown)
          result2.unknown = [];
        result2.unknown.push(part);
      }
    }
    return result2;
  });
}
var flattenColorPalette = (colors) => Object.assign(
  {},
  ...Object.entries(colors ?? {}).flatMap(
    ([color2, values]) => typeof values == "object" ? Object.entries(flattenColorPalette(values)).map(([number2, hex]) => ({
      [color2 + (number2 === "DEFAULT" ? "" : `-${number2}`)]: hex
    })) : [{ [`${color2}`]: values }]
  )
);
var flattenColorPalette_default = flattenColorPalette;
function toColorValue(maybeFunction) {
  return typeof maybeFunction === "function" ? maybeFunction({}) : maybeFunction;
}
function normalizeScreens(screens, root3 = true) {
  if (Array.isArray(screens)) {
    return screens.map((screen) => {
      if (root3 && Array.isArray(screen)) {
        throw new Error("The tuple syntax is not supported for `screens`.");
      }
      if (typeof screen === "string") {
        return { name: screen.toString(), not: false, values: [{ min: screen, max: void 0 }] };
      }
      let [name, options] = screen;
      name = name.toString();
      if (typeof options === "string") {
        return { name, not: false, values: [{ min: options, max: void 0 }] };
      }
      if (Array.isArray(options)) {
        return { name, not: false, values: options.map((option) => resolveValue(option)) };
      }
      return { name, not: false, values: [resolveValue(options)] };
    });
  }
  return normalizeScreens(Object.entries(screens ?? {}), false);
}
function isScreenSortable(screen) {
  if (screen.values.length !== 1) {
    return { result: false, reason: "multiple-values" };
  } else if (screen.values[0].raw !== void 0) {
    return { result: false, reason: "raw-values" };
  } else if (screen.values[0].min !== void 0 && screen.values[0].max !== void 0) {
    return { result: false, reason: "min-and-max" };
  }
  return { result: true, reason: null };
}
function compareScreens(type, a, z) {
  let aScreen = toScreen(a, type);
  let zScreen = toScreen(z, type);
  let aSorting = isScreenSortable(aScreen);
  let bSorting = isScreenSortable(zScreen);
  if (aSorting.reason === "multiple-values" || bSorting.reason === "multiple-values") {
    throw new Error(
      "Attempted to sort a screen with multiple values. This should never happen. Please open a bug report."
    );
  } else if (aSorting.reason === "raw-values" || bSorting.reason === "raw-values") {
    throw new Error(
      "Attempted to sort a screen with raw values. This should never happen. Please open a bug report."
    );
  } else if (aSorting.reason === "min-and-max" || bSorting.reason === "min-and-max") {
    throw new Error(
      "Attempted to sort a screen with both min and max values. This should never happen. Please open a bug report."
    );
  }
  let { min: aMin, max: aMax } = aScreen.values[0];
  let { min: zMin, max: zMax } = zScreen.values[0];
  if (a.not)
    [aMin, aMax] = [aMax, aMin];
  if (z.not)
    [zMin, zMax] = [zMax, zMin];
  aMin = aMin === void 0 ? aMin : parseFloat(aMin);
  aMax = aMax === void 0 ? aMax : parseFloat(aMax);
  zMin = zMin === void 0 ? zMin : parseFloat(zMin);
  zMax = zMax === void 0 ? zMax : parseFloat(zMax);
  let [aValue, zValue] = type === "min" ? [aMin, zMin] : [zMax, aMax];
  return aValue - zValue;
}
function toScreen(value2, type) {
  if (typeof value2 === "object") {
    return value2;
  }
  return {
    name: "arbitrary-screen",
    values: [{ [type]: value2 }]
  };
}
function resolveValue({ "min-width": _minWidth, min = _minWidth, max: max2, raw } = {}) {
  return { min, max: max2, raw };
}
function removeAlphaVariables(container2, toRemove) {
  container2.walkDecls((decl2) => {
    if (toRemove.includes(decl2.prop)) {
      decl2.remove();
      return;
    }
    for (let varName of toRemove) {
      if (decl2.value.includes(`/ var(${varName})`)) {
        decl2.value = decl2.value.replace(`/ var(${varName})`, "");
      }
    }
  });
}
var variantPlugins = {
  childVariant: ({ addVariant }) => {
    addVariant("*", "& > *");
  },
  pseudoElementVariants: ({ addVariant }) => {
    addVariant("first-letter", "&::first-letter");
    addVariant("first-line", "&::first-line");
    addVariant("marker", [
      ({ container: container2 }) => {
        removeAlphaVariables(container2, ["--tw-text-opacity"]);
        return "& *::marker";
      },
      ({ container: container2 }) => {
        removeAlphaVariables(container2, ["--tw-text-opacity"]);
        return "&::marker";
      }
    ]);
    addVariant("selection", ["& *::selection", "&::selection"]);
    addVariant("file", "&::file-selector-button");
    addVariant("placeholder", "&::placeholder");
    addVariant("backdrop", "&::backdrop");
    addVariant("before", ({ container: container2 }) => {
      container2.walkRules((rule2) => {
        let foundContent = false;
        rule2.walkDecls("content", () => {
          foundContent = true;
        });
        if (!foundContent) {
          rule2.prepend(postcss$5.decl({ prop: "content", value: "var(--tw-content)" }));
        }
      });
      return "&::before";
    });
    addVariant("after", ({ container: container2 }) => {
      container2.walkRules((rule2) => {
        let foundContent = false;
        rule2.walkDecls("content", () => {
          foundContent = true;
        });
        if (!foundContent) {
          rule2.prepend(postcss$5.decl({ prop: "content", value: "var(--tw-content)" }));
        }
      });
      return "&::after";
    });
  },
  pseudoClassVariants: ({ addVariant, matchVariant, config: config2, prefix: prefix3 }) => {
    let pseudoVariants = [
      ["first", "&:first-child"],
      ["last", "&:last-child"],
      ["only", "&:only-child"],
      ["odd", "&:nth-child(odd)"],
      ["even", "&:nth-child(even)"],
      "first-of-type",
      "last-of-type",
      "only-of-type",
      [
        "visited",
        ({ container: container2 }) => {
          removeAlphaVariables(container2, [
            "--tw-text-opacity",
            "--tw-border-opacity",
            "--tw-bg-opacity"
          ]);
          return "&:visited";
        }
      ],
      "target",
      ["open", "&[open]"],
      "default",
      "checked",
      "indeterminate",
      "placeholder-shown",
      "autofill",
      "optional",
      "required",
      "valid",
      "invalid",
      "in-range",
      "out-of-range",
      "read-only",
      "empty",
      "focus-within",
      [
        "hover",
        !flagEnabled(config2(), "hoverOnlyWhenSupported") ? "&:hover" : "@media (hover: hover) and (pointer: fine) { &:hover }"
      ],
      "focus",
      "focus-visible",
      "active",
      "enabled",
      "disabled"
    ].map((variant) => Array.isArray(variant) ? variant : [variant, `&:${variant}`]);
    for (let [variantName, state] of pseudoVariants) {
      addVariant(variantName, (ctx) => {
        let result2 = typeof state === "function" ? state(ctx) : state;
        return result2;
      });
    }
    let variants = {
      group: (_, { modifier }) => modifier ? [`:merge(${prefix3(".group")}\\/${escapeClassName(modifier)})`, " &"] : [`:merge(${prefix3(".group")})`, " &"],
      peer: (_, { modifier }) => modifier ? [`:merge(${prefix3(".peer")}\\/${escapeClassName(modifier)})`, " ~ &"] : [`:merge(${prefix3(".peer")})`, " ~ &"]
    };
    for (let [name, fn] of Object.entries(variants)) {
      matchVariant(
        name,
        (value2 = "", extra) => {
          let result2 = normalize(typeof value2 === "function" ? value2(extra) : value2);
          if (!result2.includes("&"))
            result2 = "&" + result2;
          let [a, b] = fn("", extra);
          let start = null;
          let end = null;
          let quotes2 = 0;
          for (let i = 0; i < result2.length; ++i) {
            let c = result2[i];
            if (c === "&") {
              start = i;
            } else if (c === "'" || c === '"') {
              quotes2 += 1;
            } else if (start !== null && c === " " && !quotes2) {
              end = i;
            }
          }
          if (start !== null && end === null) {
            end = result2.length;
          }
          return result2.slice(0, start) + a + result2.slice(start + 1, end) + b + result2.slice(end);
        },
        {
          values: Object.fromEntries(pseudoVariants),
          [INTERNAL_FEATURES]: {
            respectPrefix: false
          }
        }
      );
    }
  },
  directionVariants: ({ addVariant }) => {
    addVariant("ltr", '&:where([dir="ltr"], [dir="ltr"] *)');
    addVariant("rtl", '&:where([dir="rtl"], [dir="rtl"] *)');
  },
  reducedMotionVariants: ({ addVariant }) => {
    addVariant("motion-safe", "@media (prefers-reduced-motion: no-preference)");
    addVariant("motion-reduce", "@media (prefers-reduced-motion: reduce)");
  },
  darkVariants: ({ config: config2, addVariant }) => {
    let [mode, selector3 = ".dark"] = [].concat(config2("darkMode", "media"));
    if (mode === false) {
      mode = "media";
    }
    if (mode === "variant") {
      let formats;
      if (Array.isArray(selector3)) {
        formats = selector3;
      } else if (typeof selector3 === "function") {
        formats = selector3;
      } else if (typeof selector3 === "string") {
        formats = [selector3];
      }
      if (Array.isArray(formats)) {
        for (let format of formats) {
          if (format === ".dark") {
            mode = false;
          } else if (!format.includes("&")) {
            mode = false;
          }
        }
      }
      selector3 = formats;
    }
    if (mode === "selector") {
      addVariant("dark", `&:where(${selector3}, ${selector3} *)`);
    } else if (mode === "media") {
      addVariant("dark", "@media (prefers-color-scheme: dark)");
    } else if (mode === "variant") {
      addVariant("dark", selector3);
    } else if (mode === "class") {
      addVariant("dark", `:is(${selector3} &)`);
    }
  },
  printVariant: ({ addVariant }) => {
    addVariant("print", "@media print");
  },
  screenVariants: ({ theme, addVariant, matchVariant }) => {
    let rawScreens = theme("screens") ?? {};
    let areSimpleScreens = Object.values(rawScreens).every((v) => typeof v === "string");
    let screens = normalizeScreens(theme("screens"));
    let unitCache = /* @__PURE__ */ new Set([]);
    function units(value2) {
      var _a;
      return ((_a = value2.match(/(\D+)$/)) == null ? void 0 : _a[1]) ?? "(none)";
    }
    function recordUnits(value2) {
      if (value2 !== void 0) {
        unitCache.add(units(value2));
      }
    }
    function canUseUnits(value2) {
      recordUnits(value2);
      return unitCache.size === 1;
    }
    for (const screen of screens) {
      for (const value2 of screen.values) {
        recordUnits(value2.min);
        recordUnits(value2.max);
      }
    }
    let screensUseConsistentUnits = unitCache.size <= 1;
    function buildScreenValues(type) {
      return Object.fromEntries(
        screens.filter((screen) => isScreenSortable(screen).result).map((screen) => {
          let { min, max: max2 } = screen.values[0];
          if (type === "min" && min !== void 0) {
            return screen;
          } else if (type === "min" && max2 !== void 0) {
            return { ...screen, not: !screen.not };
          } else if (type === "max" && max2 !== void 0) {
            return screen;
          } else if (type === "max" && min !== void 0) {
            return { ...screen, not: !screen.not };
          }
        }).map((screen) => [screen.name, screen])
      );
    }
    function buildSort(type) {
      return (a, z) => compareScreens(type, a.value, z.value);
    }
    let maxSort = buildSort("max");
    let minSort = buildSort("min");
    function buildScreenVariant(type) {
      return (value2) => {
        if (!areSimpleScreens) {
          return [];
        } else if (!screensUseConsistentUnits) {
          return [];
        } else if (typeof value2 === "string" && !canUseUnits(value2)) {
          return [];
        }
        return [`@media ${buildMediaQuery(toScreen(value2, type))}`];
      };
    }
    matchVariant("max", buildScreenVariant("max"), {
      sort: maxSort,
      values: areSimpleScreens ? buildScreenValues("max") : {}
    });
    let id3 = "min-screens";
    for (let screen of screens) {
      addVariant(screen.name, `@media ${buildMediaQuery(screen)}`, {
        id: id3,
        sort: areSimpleScreens && screensUseConsistentUnits ? minSort : void 0,
        value: screen
      });
    }
    matchVariant("min", buildScreenVariant("min"), {
      id: id3,
      sort: minSort
    });
  },
  supportsVariants: ({ matchVariant, theme }) => {
    matchVariant(
      "supports",
      (value2 = "") => {
        let check = normalize(value2);
        let isRaw = /^\w*\s*\(/.test(check);
        check = isRaw ? check.replace(/\b(and|or|not)\b/g, " $1 ") : check;
        if (isRaw) {
          return `@supports ${check}`;
        }
        if (!check.includes(":")) {
          check = `${check}: var(--tw)`;
        }
        if (!(check.startsWith("(") && check.endsWith(")"))) {
          check = `(${check})`;
        }
        return `@supports ${check}`;
      },
      { values: theme("supports") ?? {} }
    );
  },
  hasVariants: ({ matchVariant }) => {
    matchVariant("has", (value2) => `&:has(${normalize(value2)})`, { values: {} });
    matchVariant(
      "group-has",
      (value2, { modifier }) => modifier ? `:merge(.group\\/${modifier}):has(${normalize(value2)}) &` : `:merge(.group):has(${normalize(value2)}) &`,
      { values: {} }
    );
    matchVariant(
      "peer-has",
      (value2, { modifier }) => modifier ? `:merge(.peer\\/${modifier}):has(${normalize(value2)}) ~ &` : `:merge(.peer):has(${normalize(value2)}) ~ &`,
      { values: {} }
    );
  },
  ariaVariants: ({ matchVariant, theme }) => {
    matchVariant("aria", (value2) => `&[aria-${normalize(value2)}]`, { values: theme("aria") ?? {} });
    matchVariant(
      "group-aria",
      (value2, { modifier }) => modifier ? `:merge(.group\\/${modifier})[aria-${normalize(value2)}] &` : `:merge(.group)[aria-${normalize(value2)}] &`,
      { values: theme("aria") ?? {} }
    );
    matchVariant(
      "peer-aria",
      (value2, { modifier }) => modifier ? `:merge(.peer\\/${modifier})[aria-${normalize(value2)}] ~ &` : `:merge(.peer)[aria-${normalize(value2)}] ~ &`,
      { values: theme("aria") ?? {} }
    );
  },
  dataVariants: ({ matchVariant, theme }) => {
    matchVariant("data", (value2) => `&[data-${normalize(value2)}]`, { values: theme("data") ?? {} });
    matchVariant(
      "group-data",
      (value2, { modifier }) => modifier ? `:merge(.group\\/${modifier})[data-${normalize(value2)}] &` : `:merge(.group)[data-${normalize(value2)}] &`,
      { values: theme("data") ?? {} }
    );
    matchVariant(
      "peer-data",
      (value2, { modifier }) => modifier ? `:merge(.peer\\/${modifier})[data-${normalize(value2)}] ~ &` : `:merge(.peer)[data-${normalize(value2)}] ~ &`,
      { values: theme("data") ?? {} }
    );
  },
  orientationVariants: ({ addVariant }) => {
    addVariant("portrait", "@media (orientation: portrait)");
    addVariant("landscape", "@media (orientation: landscape)");
  },
  prefersContrastVariants: ({ addVariant }) => {
    addVariant("contrast-more", "@media (prefers-contrast: more)");
    addVariant("contrast-less", "@media (prefers-contrast: less)");
  },
  forcedColorsVariants: ({ addVariant }) => {
    addVariant("forced-colors", "@media (forced-colors: active)");
  }
};
var cssTransformValue = [
  "translate(var(--tw-translate-x), var(--tw-translate-y))",
  "rotate(var(--tw-rotate))",
  "skewX(var(--tw-skew-x))",
  "skewY(var(--tw-skew-y))",
  "scaleX(var(--tw-scale-x))",
  "scaleY(var(--tw-scale-y))"
].join(" ");
var cssFilterValue = [
  "var(--tw-blur)",
  "var(--tw-brightness)",
  "var(--tw-contrast)",
  "var(--tw-grayscale)",
  "var(--tw-hue-rotate)",
  "var(--tw-invert)",
  "var(--tw-saturate)",
  "var(--tw-sepia)",
  "var(--tw-drop-shadow)"
].join(" ");
var cssBackdropFilterValue = [
  "var(--tw-backdrop-blur)",
  "var(--tw-backdrop-brightness)",
  "var(--tw-backdrop-contrast)",
  "var(--tw-backdrop-grayscale)",
  "var(--tw-backdrop-hue-rotate)",
  "var(--tw-backdrop-invert)",
  "var(--tw-backdrop-opacity)",
  "var(--tw-backdrop-saturate)",
  "var(--tw-backdrop-sepia)"
].join(" ");
var corePlugins = {
  preflight: ({ addBase }) => {
    let preflightStyles = postcss$5.parse(
      fs_default.readFileSync(join(), "utf8")
    );
    addBase([
      postcss$5.comment({
        text: `! tailwindcss v${version} | MIT License | https://tailwindcss.com`
      }),
      ...preflightStyles.nodes
    ]);
  },
  container: /* @__PURE__ */ (() => {
    function extractMinWidths(breakpoints = []) {
      return breakpoints.flatMap((breakpoint) => breakpoint.values.map((breakpoint2) => breakpoint2.min)).filter((v) => v !== void 0);
    }
    function mapMinWidthsToPadding(minWidths, screens, paddings) {
      if (typeof paddings === "undefined") {
        return [];
      }
      if (!(typeof paddings === "object" && paddings !== null)) {
        return [
          {
            screen: "DEFAULT",
            minWidth: 0,
            padding: paddings
          }
        ];
      }
      let mapping = [];
      if (paddings.DEFAULT) {
        mapping.push({
          screen: "DEFAULT",
          minWidth: 0,
          padding: paddings.DEFAULT
        });
      }
      for (let minWidth of minWidths) {
        for (let screen of screens) {
          for (let { min } of screen.values) {
            if (min === minWidth) {
              mapping.push({ minWidth, padding: paddings[screen.name] });
            }
          }
        }
      }
      return mapping;
    }
    return function({ addComponents, theme }) {
      let screens = normalizeScreens(theme("container.screens", theme("screens")));
      let minWidths = extractMinWidths(screens);
      let paddings = mapMinWidthsToPadding(minWidths, screens, theme("container.padding"));
      let generatePaddingFor = (minWidth) => {
        let paddingConfig = paddings.find((padding) => padding.minWidth === minWidth);
        if (!paddingConfig) {
          return {};
        }
        return {
          paddingRight: paddingConfig.padding,
          paddingLeft: paddingConfig.padding
        };
      };
      let atRules = Array.from(
        new Set(minWidths.slice().sort((a, z) => parseInt(a) - parseInt(z)))
      ).map((minWidth) => ({
        [`@media (min-width: ${minWidth})`]: {
          ".container": {
            "max-width": minWidth,
            ...generatePaddingFor(minWidth)
          }
        }
      }));
      addComponents([
        {
          ".container": Object.assign(
            { width: "100%" },
            theme("container.center", false) ? { marginRight: "auto", marginLeft: "auto" } : {},
            generatePaddingFor(0)
          )
        },
        ...atRules
      ]);
    };
  })(),
  accessibility: ({ addUtilities }) => {
    addUtilities({
      ".sr-only": {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0"
      },
      ".not-sr-only": {
        position: "static",
        width: "auto",
        height: "auto",
        padding: "0",
        margin: "0",
        overflow: "visible",
        clip: "auto",
        whiteSpace: "normal"
      }
    });
  },
  pointerEvents: ({ addUtilities }) => {
    addUtilities({
      ".pointer-events-none": { "pointer-events": "none" },
      ".pointer-events-auto": { "pointer-events": "auto" }
    });
  },
  visibility: ({ addUtilities }) => {
    addUtilities({
      ".visible": { visibility: "visible" },
      ".invisible": { visibility: "hidden" },
      ".collapse": { visibility: "collapse" }
    });
  },
  position: ({ addUtilities }) => {
    addUtilities({
      ".static": { position: "static" },
      ".fixed": { position: "fixed" },
      ".absolute": { position: "absolute" },
      ".relative": { position: "relative" },
      ".sticky": { position: "sticky" }
    });
  },
  inset: createUtilityPlugin(
    "inset",
    [
      ["inset", ["inset"]],
      [
        ["inset-x", ["left", "right"]],
        ["inset-y", ["top", "bottom"]]
      ],
      [
        ["start", ["inset-inline-start"]],
        ["end", ["inset-inline-end"]],
        ["top", ["top"]],
        ["right", ["right"]],
        ["bottom", ["bottom"]],
        ["left", ["left"]]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  isolation: ({ addUtilities }) => {
    addUtilities({
      ".isolate": { isolation: "isolate" },
      ".isolation-auto": { isolation: "auto" }
    });
  },
  zIndex: createUtilityPlugin("zIndex", [["z", ["zIndex"]]], { supportsNegativeValues: true }),
  order: createUtilityPlugin("order", void 0, { supportsNegativeValues: true }),
  gridColumn: createUtilityPlugin("gridColumn", [["col", ["gridColumn"]]]),
  gridColumnStart: createUtilityPlugin("gridColumnStart", [["col-start", ["gridColumnStart"]]]),
  gridColumnEnd: createUtilityPlugin("gridColumnEnd", [["col-end", ["gridColumnEnd"]]]),
  gridRow: createUtilityPlugin("gridRow", [["row", ["gridRow"]]]),
  gridRowStart: createUtilityPlugin("gridRowStart", [["row-start", ["gridRowStart"]]]),
  gridRowEnd: createUtilityPlugin("gridRowEnd", [["row-end", ["gridRowEnd"]]]),
  float: ({ addUtilities }) => {
    addUtilities({
      ".float-start": { float: "inline-start" },
      ".float-end": { float: "inline-end" },
      ".float-right": { float: "right" },
      ".float-left": { float: "left" },
      ".float-none": { float: "none" }
    });
  },
  clear: ({ addUtilities }) => {
    addUtilities({
      ".clear-start": { clear: "inline-start" },
      ".clear-end": { clear: "inline-end" },
      ".clear-left": { clear: "left" },
      ".clear-right": { clear: "right" },
      ".clear-both": { clear: "both" },
      ".clear-none": { clear: "none" }
    });
  },
  margin: createUtilityPlugin(
    "margin",
    [
      ["m", ["margin"]],
      [
        ["mx", ["margin-left", "margin-right"]],
        ["my", ["margin-top", "margin-bottom"]]
      ],
      [
        ["ms", ["margin-inline-start"]],
        ["me", ["margin-inline-end"]],
        ["mt", ["margin-top"]],
        ["mr", ["margin-right"]],
        ["mb", ["margin-bottom"]],
        ["ml", ["margin-left"]]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  boxSizing: ({ addUtilities }) => {
    addUtilities({
      ".box-border": { "box-sizing": "border-box" },
      ".box-content": { "box-sizing": "content-box" }
    });
  },
  lineClamp: ({ matchUtilities, addUtilities, theme }) => {
    matchUtilities(
      {
        "line-clamp": (value2) => ({
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": `${value2}`
        })
      },
      { values: theme("lineClamp") }
    );
    addUtilities({
      ".line-clamp-none": {
        overflow: "visible",
        display: "block",
        "-webkit-box-orient": "horizontal",
        "-webkit-line-clamp": "none"
      }
    });
  },
  display: ({ addUtilities }) => {
    addUtilities({
      ".block": { display: "block" },
      ".inline-block": { display: "inline-block" },
      ".inline": { display: "inline" },
      ".flex": { display: "flex" },
      ".inline-flex": { display: "inline-flex" },
      ".table": { display: "table" },
      ".inline-table": { display: "inline-table" },
      ".table-caption": { display: "table-caption" },
      ".table-cell": { display: "table-cell" },
      ".table-column": { display: "table-column" },
      ".table-column-group": { display: "table-column-group" },
      ".table-footer-group": { display: "table-footer-group" },
      ".table-header-group": { display: "table-header-group" },
      ".table-row-group": { display: "table-row-group" },
      ".table-row": { display: "table-row" },
      ".flow-root": { display: "flow-root" },
      ".grid": { display: "grid" },
      ".inline-grid": { display: "inline-grid" },
      ".contents": { display: "contents" },
      ".list-item": { display: "list-item" },
      ".hidden": { display: "none" }
    });
  },
  aspectRatio: createUtilityPlugin("aspectRatio", [["aspect", ["aspect-ratio"]]]),
  size: createUtilityPlugin("size", [["size", ["width", "height"]]]),
  height: createUtilityPlugin("height", [["h", ["height"]]]),
  maxHeight: createUtilityPlugin("maxHeight", [["max-h", ["maxHeight"]]]),
  minHeight: createUtilityPlugin("minHeight", [["min-h", ["minHeight"]]]),
  width: createUtilityPlugin("width", [["w", ["width"]]]),
  minWidth: createUtilityPlugin("minWidth", [["min-w", ["minWidth"]]]),
  maxWidth: createUtilityPlugin("maxWidth", [["max-w", ["maxWidth"]]]),
  flex: createUtilityPlugin("flex"),
  flexShrink: createUtilityPlugin("flexShrink", [
    ["flex-shrink", ["flex-shrink"]],
    ["shrink", ["flex-shrink"]]
  ]),
  flexGrow: createUtilityPlugin("flexGrow", [
    ["flex-grow", ["flex-grow"]],
    ["grow", ["flex-grow"]]
  ]),
  flexBasis: createUtilityPlugin("flexBasis", [["basis", ["flex-basis"]]]),
  tableLayout: ({ addUtilities }) => {
    addUtilities({
      ".table-auto": { "table-layout": "auto" },
      ".table-fixed": { "table-layout": "fixed" }
    });
  },
  captionSide: ({ addUtilities }) => {
    addUtilities({
      ".caption-top": { "caption-side": "top" },
      ".caption-bottom": { "caption-side": "bottom" }
    });
  },
  borderCollapse: ({ addUtilities }) => {
    addUtilities({
      ".border-collapse": { "border-collapse": "collapse" },
      ".border-separate": { "border-collapse": "separate" }
    });
  },
  borderSpacing: ({ addDefaults, matchUtilities, theme }) => {
    addDefaults("border-spacing", {
      "--tw-border-spacing-x": 0,
      "--tw-border-spacing-y": 0
    });
    matchUtilities(
      {
        "border-spacing": (value2) => {
          return {
            "--tw-border-spacing-x": value2,
            "--tw-border-spacing-y": value2,
            "@defaults border-spacing": {},
            "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
          };
        },
        "border-spacing-x": (value2) => {
          return {
            "--tw-border-spacing-x": value2,
            "@defaults border-spacing": {},
            "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
          };
        },
        "border-spacing-y": (value2) => {
          return {
            "--tw-border-spacing-y": value2,
            "@defaults border-spacing": {},
            "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
          };
        }
      },
      { values: theme("borderSpacing") }
    );
  },
  transformOrigin: createUtilityPlugin("transformOrigin", [["origin", ["transformOrigin"]]]),
  translate: createUtilityPlugin(
    "translate",
    [
      [
        [
          "translate-x",
          [["@defaults transform", {}], "--tw-translate-x", ["transform", cssTransformValue]]
        ],
        [
          "translate-y",
          [["@defaults transform", {}], "--tw-translate-y", ["transform", cssTransformValue]]
        ]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  rotate: createUtilityPlugin(
    "rotate",
    [["rotate", [["@defaults transform", {}], "--tw-rotate", ["transform", cssTransformValue]]]],
    { supportsNegativeValues: true }
  ),
  skew: createUtilityPlugin(
    "skew",
    [
      [
        ["skew-x", [["@defaults transform", {}], "--tw-skew-x", ["transform", cssTransformValue]]],
        ["skew-y", [["@defaults transform", {}], "--tw-skew-y", ["transform", cssTransformValue]]]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  scale: createUtilityPlugin(
    "scale",
    [
      [
        "scale",
        [
          ["@defaults transform", {}],
          "--tw-scale-x",
          "--tw-scale-y",
          ["transform", cssTransformValue]
        ]
      ],
      [
        [
          "scale-x",
          [["@defaults transform", {}], "--tw-scale-x", ["transform", cssTransformValue]]
        ],
        [
          "scale-y",
          [["@defaults transform", {}], "--tw-scale-y", ["transform", cssTransformValue]]
        ]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  transform: ({ addDefaults, addUtilities }) => {
    addDefaults("transform", {
      "--tw-translate-x": "0",
      "--tw-translate-y": "0",
      "--tw-rotate": "0",
      "--tw-skew-x": "0",
      "--tw-skew-y": "0",
      "--tw-scale-x": "1",
      "--tw-scale-y": "1"
    });
    addUtilities({
      ".transform": { "@defaults transform": {}, transform: cssTransformValue },
      ".transform-cpu": {
        transform: cssTransformValue
      },
      ".transform-gpu": {
        transform: cssTransformValue.replace(
          "translate(var(--tw-translate-x), var(--tw-translate-y))",
          "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)"
        )
      },
      ".transform-none": { transform: "none" }
    });
  },
  animation: ({ matchUtilities, theme, config: config2 }) => {
    let prefixName = (name) => escapeClassName(config2("prefix") + name);
    let keyframes = Object.fromEntries(
      Object.entries(theme("keyframes") ?? {}).map(([key, value2]) => {
        return [key, { [`@keyframes ${prefixName(key)}`]: value2 }];
      })
    );
    matchUtilities(
      {
        animate: (value2) => {
          let animations = parseAnimationValue(value2);
          return [
            ...animations.flatMap((animation) => keyframes[animation.name]),
            {
              animation: animations.map(({ name, value: value3 }) => {
                if (name === void 0 || keyframes[name] === void 0) {
                  return value3;
                }
                return value3.replace(name, prefixName(name));
              }).join(", ")
            }
          ];
        }
      },
      { values: theme("animation") }
    );
  },
  cursor: createUtilityPlugin("cursor"),
  touchAction: ({ addDefaults, addUtilities }) => {
    addDefaults("touch-action", {
      "--tw-pan-x": " ",
      "--tw-pan-y": " ",
      "--tw-pinch-zoom": " "
    });
    let cssTouchActionValue = "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)";
    addUtilities({
      ".touch-auto": { "touch-action": "auto" },
      ".touch-none": { "touch-action": "none" },
      ".touch-pan-x": {
        "@defaults touch-action": {},
        "--tw-pan-x": "pan-x",
        "touch-action": cssTouchActionValue
      },
      ".touch-pan-left": {
        "@defaults touch-action": {},
        "--tw-pan-x": "pan-left",
        "touch-action": cssTouchActionValue
      },
      ".touch-pan-right": {
        "@defaults touch-action": {},
        "--tw-pan-x": "pan-right",
        "touch-action": cssTouchActionValue
      },
      ".touch-pan-y": {
        "@defaults touch-action": {},
        "--tw-pan-y": "pan-y",
        "touch-action": cssTouchActionValue
      },
      ".touch-pan-up": {
        "@defaults touch-action": {},
        "--tw-pan-y": "pan-up",
        "touch-action": cssTouchActionValue
      },
      ".touch-pan-down": {
        "@defaults touch-action": {},
        "--tw-pan-y": "pan-down",
        "touch-action": cssTouchActionValue
      },
      ".touch-pinch-zoom": {
        "@defaults touch-action": {},
        "--tw-pinch-zoom": "pinch-zoom",
        "touch-action": cssTouchActionValue
      },
      ".touch-manipulation": { "touch-action": "manipulation" }
    });
  },
  userSelect: ({ addUtilities }) => {
    addUtilities({
      ".select-none": { "user-select": "none" },
      ".select-text": { "user-select": "text" },
      ".select-all": { "user-select": "all" },
      ".select-auto": { "user-select": "auto" }
    });
  },
  resize: ({ addUtilities }) => {
    addUtilities({
      ".resize-none": { resize: "none" },
      ".resize-y": { resize: "vertical" },
      ".resize-x": { resize: "horizontal" },
      ".resize": { resize: "both" }
    });
  },
  scrollSnapType: ({ addDefaults, addUtilities }) => {
    addDefaults("scroll-snap-type", {
      "--tw-scroll-snap-strictness": "proximity"
    });
    addUtilities({
      ".snap-none": { "scroll-snap-type": "none" },
      ".snap-x": {
        "@defaults scroll-snap-type": {},
        "scroll-snap-type": "x var(--tw-scroll-snap-strictness)"
      },
      ".snap-y": {
        "@defaults scroll-snap-type": {},
        "scroll-snap-type": "y var(--tw-scroll-snap-strictness)"
      },
      ".snap-both": {
        "@defaults scroll-snap-type": {},
        "scroll-snap-type": "both var(--tw-scroll-snap-strictness)"
      },
      ".snap-mandatory": { "--tw-scroll-snap-strictness": "mandatory" },
      ".snap-proximity": { "--tw-scroll-snap-strictness": "proximity" }
    });
  },
  scrollSnapAlign: ({ addUtilities }) => {
    addUtilities({
      ".snap-start": { "scroll-snap-align": "start" },
      ".snap-end": { "scroll-snap-align": "end" },
      ".snap-center": { "scroll-snap-align": "center" },
      ".snap-align-none": { "scroll-snap-align": "none" }
    });
  },
  scrollSnapStop: ({ addUtilities }) => {
    addUtilities({
      ".snap-normal": { "scroll-snap-stop": "normal" },
      ".snap-always": { "scroll-snap-stop": "always" }
    });
  },
  scrollMargin: createUtilityPlugin(
    "scrollMargin",
    [
      ["scroll-m", ["scroll-margin"]],
      [
        ["scroll-mx", ["scroll-margin-left", "scroll-margin-right"]],
        ["scroll-my", ["scroll-margin-top", "scroll-margin-bottom"]]
      ],
      [
        ["scroll-ms", ["scroll-margin-inline-start"]],
        ["scroll-me", ["scroll-margin-inline-end"]],
        ["scroll-mt", ["scroll-margin-top"]],
        ["scroll-mr", ["scroll-margin-right"]],
        ["scroll-mb", ["scroll-margin-bottom"]],
        ["scroll-ml", ["scroll-margin-left"]]
      ]
    ],
    { supportsNegativeValues: true }
  ),
  scrollPadding: createUtilityPlugin("scrollPadding", [
    ["scroll-p", ["scroll-padding"]],
    [
      ["scroll-px", ["scroll-padding-left", "scroll-padding-right"]],
      ["scroll-py", ["scroll-padding-top", "scroll-padding-bottom"]]
    ],
    [
      ["scroll-ps", ["scroll-padding-inline-start"]],
      ["scroll-pe", ["scroll-padding-inline-end"]],
      ["scroll-pt", ["scroll-padding-top"]],
      ["scroll-pr", ["scroll-padding-right"]],
      ["scroll-pb", ["scroll-padding-bottom"]],
      ["scroll-pl", ["scroll-padding-left"]]
    ]
  ]),
  listStylePosition: ({ addUtilities }) => {
    addUtilities({
      ".list-inside": { "list-style-position": "inside" },
      ".list-outside": { "list-style-position": "outside" }
    });
  },
  listStyleType: createUtilityPlugin("listStyleType", [["list", ["listStyleType"]]]),
  listStyleImage: createUtilityPlugin("listStyleImage", [["list-image", ["listStyleImage"]]]),
  appearance: ({ addUtilities }) => {
    addUtilities({
      ".appearance-none": { appearance: "none" },
      ".appearance-auto": { appearance: "auto" }
    });
  },
  columns: createUtilityPlugin("columns", [["columns", ["columns"]]]),
  breakBefore: ({ addUtilities }) => {
    addUtilities({
      ".break-before-auto": { "break-before": "auto" },
      ".break-before-avoid": { "break-before": "avoid" },
      ".break-before-all": { "break-before": "all" },
      ".break-before-avoid-page": { "break-before": "avoid-page" },
      ".break-before-page": { "break-before": "page" },
      ".break-before-left": { "break-before": "left" },
      ".break-before-right": { "break-before": "right" },
      ".break-before-column": { "break-before": "column" }
    });
  },
  breakInside: ({ addUtilities }) => {
    addUtilities({
      ".break-inside-auto": { "break-inside": "auto" },
      ".break-inside-avoid": { "break-inside": "avoid" },
      ".break-inside-avoid-page": { "break-inside": "avoid-page" },
      ".break-inside-avoid-column": { "break-inside": "avoid-column" }
    });
  },
  breakAfter: ({ addUtilities }) => {
    addUtilities({
      ".break-after-auto": { "break-after": "auto" },
      ".break-after-avoid": { "break-after": "avoid" },
      ".break-after-all": { "break-after": "all" },
      ".break-after-avoid-page": { "break-after": "avoid-page" },
      ".break-after-page": { "break-after": "page" },
      ".break-after-left": { "break-after": "left" },
      ".break-after-right": { "break-after": "right" },
      ".break-after-column": { "break-after": "column" }
    });
  },
  gridAutoColumns: createUtilityPlugin("gridAutoColumns", [["auto-cols", ["gridAutoColumns"]]]),
  gridAutoFlow: ({ addUtilities }) => {
    addUtilities({
      ".grid-flow-row": { gridAutoFlow: "row" },
      ".grid-flow-col": { gridAutoFlow: "column" },
      ".grid-flow-dense": { gridAutoFlow: "dense" },
      ".grid-flow-row-dense": { gridAutoFlow: "row dense" },
      ".grid-flow-col-dense": { gridAutoFlow: "column dense" }
    });
  },
  gridAutoRows: createUtilityPlugin("gridAutoRows", [["auto-rows", ["gridAutoRows"]]]),
  gridTemplateColumns: createUtilityPlugin("gridTemplateColumns", [
    ["grid-cols", ["gridTemplateColumns"]]
  ]),
  gridTemplateRows: createUtilityPlugin("gridTemplateRows", [["grid-rows", ["gridTemplateRows"]]]),
  flexDirection: ({ addUtilities }) => {
    addUtilities({
      ".flex-row": { "flex-direction": "row" },
      ".flex-row-reverse": { "flex-direction": "row-reverse" },
      ".flex-col": { "flex-direction": "column" },
      ".flex-col-reverse": { "flex-direction": "column-reverse" }
    });
  },
  flexWrap: ({ addUtilities }) => {
    addUtilities({
      ".flex-wrap": { "flex-wrap": "wrap" },
      ".flex-wrap-reverse": { "flex-wrap": "wrap-reverse" },
      ".flex-nowrap": { "flex-wrap": "nowrap" }
    });
  },
  placeContent: ({ addUtilities }) => {
    addUtilities({
      ".place-content-center": { "place-content": "center" },
      ".place-content-start": { "place-content": "start" },
      ".place-content-end": { "place-content": "end" },
      ".place-content-between": { "place-content": "space-between" },
      ".place-content-around": { "place-content": "space-around" },
      ".place-content-evenly": { "place-content": "space-evenly" },
      ".place-content-baseline": { "place-content": "baseline" },
      ".place-content-stretch": { "place-content": "stretch" }
    });
  },
  placeItems: ({ addUtilities }) => {
    addUtilities({
      ".place-items-start": { "place-items": "start" },
      ".place-items-end": { "place-items": "end" },
      ".place-items-center": { "place-items": "center" },
      ".place-items-baseline": { "place-items": "baseline" },
      ".place-items-stretch": { "place-items": "stretch" }
    });
  },
  alignContent: ({ addUtilities }) => {
    addUtilities({
      ".content-normal": { "align-content": "normal" },
      ".content-center": { "align-content": "center" },
      ".content-start": { "align-content": "flex-start" },
      ".content-end": { "align-content": "flex-end" },
      ".content-between": { "align-content": "space-between" },
      ".content-around": { "align-content": "space-around" },
      ".content-evenly": { "align-content": "space-evenly" },
      ".content-baseline": { "align-content": "baseline" },
      ".content-stretch": { "align-content": "stretch" }
    });
  },
  alignItems: ({ addUtilities }) => {
    addUtilities({
      ".items-start": { "align-items": "flex-start" },
      ".items-end": { "align-items": "flex-end" },
      ".items-center": { "align-items": "center" },
      ".items-baseline": { "align-items": "baseline" },
      ".items-stretch": { "align-items": "stretch" }
    });
  },
  justifyContent: ({ addUtilities }) => {
    addUtilities({
      ".justify-normal": { "justify-content": "normal" },
      ".justify-start": { "justify-content": "flex-start" },
      ".justify-end": { "justify-content": "flex-end" },
      ".justify-center": { "justify-content": "center" },
      ".justify-between": { "justify-content": "space-between" },
      ".justify-around": { "justify-content": "space-around" },
      ".justify-evenly": { "justify-content": "space-evenly" },
      ".justify-stretch": { "justify-content": "stretch" }
    });
  },
  justifyItems: ({ addUtilities }) => {
    addUtilities({
      ".justify-items-start": { "justify-items": "start" },
      ".justify-items-end": { "justify-items": "end" },
      ".justify-items-center": { "justify-items": "center" },
      ".justify-items-stretch": { "justify-items": "stretch" }
    });
  },
  gap: createUtilityPlugin("gap", [
    ["gap", ["gap"]],
    [
      ["gap-x", ["columnGap"]],
      ["gap-y", ["rowGap"]]
    ]
  ]),
  space: ({ matchUtilities, addUtilities, theme }) => {
    matchUtilities(
      {
        "space-x": (value2) => {
          value2 = value2 === "0" ? "0px" : value2;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-space-x-reverse": "0",
              "margin-right": `calc(${value2} * var(--tw-space-x-reverse))`,
              "margin-left": `calc(${value2} * calc(1 - var(--tw-space-x-reverse)))`
            }
          };
        },
        "space-y": (value2) => {
          value2 = value2 === "0" ? "0px" : value2;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "--tw-space-y-reverse": "0",
              "margin-top": `calc(${value2} * calc(1 - var(--tw-space-y-reverse)))`,
              "margin-bottom": `calc(${value2} * var(--tw-space-y-reverse))`
            }
          };
        }
      },
      { values: theme("space"), supportsNegativeValues: true }
    );
    addUtilities({
      ".space-y-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-space-y-reverse": "1" },
      ".space-x-reverse > :not([hidden]) ~ :not([hidden])": { "--tw-space-x-reverse": "1" }
    });
  },
  divideWidth: ({ matchUtilities, addUtilities, theme }) => {
    matchUtilities(
      {
        "divide-x": (value2) => {
          value2 = value2 === "0" ? "0px" : value2;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "@defaults border-width": {},
              "--tw-divide-x-reverse": "0",
              "border-right-width": `calc(${value2} * var(--tw-divide-x-reverse))`,
              "border-left-width": `calc(${value2} * calc(1 - var(--tw-divide-x-reverse)))`
            }
          };
        },
        "divide-y": (value2) => {
          value2 = value2 === "0" ? "0px" : value2;
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              "@defaults border-width": {},
              "--tw-divide-y-reverse": "0",
              "border-top-width": `calc(${value2} * calc(1 - var(--tw-divide-y-reverse)))`,
              "border-bottom-width": `calc(${value2} * var(--tw-divide-y-reverse))`
            }
          };
        }
      },
      { values: theme("divideWidth"), type: ["line-width", "length", "any"] }
    );
    addUtilities({
      ".divide-y-reverse > :not([hidden]) ~ :not([hidden])": {
        "@defaults border-width": {},
        "--tw-divide-y-reverse": "1"
      },
      ".divide-x-reverse > :not([hidden]) ~ :not([hidden])": {
        "@defaults border-width": {},
        "--tw-divide-x-reverse": "1"
      }
    });
  },
  divideStyle: ({ addUtilities }) => {
    addUtilities({
      ".divide-solid > :not([hidden]) ~ :not([hidden])": { "border-style": "solid" },
      ".divide-dashed > :not([hidden]) ~ :not([hidden])": { "border-style": "dashed" },
      ".divide-dotted > :not([hidden]) ~ :not([hidden])": { "border-style": "dotted" },
      ".divide-double > :not([hidden]) ~ :not([hidden])": { "border-style": "double" },
      ".divide-none > :not([hidden]) ~ :not([hidden])": { "border-style": "none" }
    });
  },
  divideColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        divide: (value2) => {
          if (!corePlugins2("divideOpacity")) {
            return {
              ["& > :not([hidden]) ~ :not([hidden])"]: {
                "border-color": toColorValue(value2)
              }
            };
          }
          return {
            ["& > :not([hidden]) ~ :not([hidden])"]: withAlphaVariable({
              color: value2,
              property: "border-color",
              variable: "--tw-divide-opacity"
            })
          };
        }
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette_default(theme("divideColor"))),
        type: ["color", "any"]
      }
    );
  },
  divideOpacity: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "divide-opacity": (value2) => {
          return { [`& > :not([hidden]) ~ :not([hidden])`]: { "--tw-divide-opacity": value2 } };
        }
      },
      { values: theme("divideOpacity") }
    );
  },
  placeSelf: ({ addUtilities }) => {
    addUtilities({
      ".place-self-auto": { "place-self": "auto" },
      ".place-self-start": { "place-self": "start" },
      ".place-self-end": { "place-self": "end" },
      ".place-self-center": { "place-self": "center" },
      ".place-self-stretch": { "place-self": "stretch" }
    });
  },
  alignSelf: ({ addUtilities }) => {
    addUtilities({
      ".self-auto": { "align-self": "auto" },
      ".self-start": { "align-self": "flex-start" },
      ".self-end": { "align-self": "flex-end" },
      ".self-center": { "align-self": "center" },
      ".self-stretch": { "align-self": "stretch" },
      ".self-baseline": { "align-self": "baseline" }
    });
  },
  justifySelf: ({ addUtilities }) => {
    addUtilities({
      ".justify-self-auto": { "justify-self": "auto" },
      ".justify-self-start": { "justify-self": "start" },
      ".justify-self-end": { "justify-self": "end" },
      ".justify-self-center": { "justify-self": "center" },
      ".justify-self-stretch": { "justify-self": "stretch" }
    });
  },
  overflow: ({ addUtilities }) => {
    addUtilities({
      ".overflow-auto": { overflow: "auto" },
      ".overflow-hidden": { overflow: "hidden" },
      ".overflow-clip": { overflow: "clip" },
      ".overflow-visible": { overflow: "visible" },
      ".overflow-scroll": { overflow: "scroll" },
      ".overflow-x-auto": { "overflow-x": "auto" },
      ".overflow-y-auto": { "overflow-y": "auto" },
      ".overflow-x-hidden": { "overflow-x": "hidden" },
      ".overflow-y-hidden": { "overflow-y": "hidden" },
      ".overflow-x-clip": { "overflow-x": "clip" },
      ".overflow-y-clip": { "overflow-y": "clip" },
      ".overflow-x-visible": { "overflow-x": "visible" },
      ".overflow-y-visible": { "overflow-y": "visible" },
      ".overflow-x-scroll": { "overflow-x": "scroll" },
      ".overflow-y-scroll": { "overflow-y": "scroll" }
    });
  },
  overscrollBehavior: ({ addUtilities }) => {
    addUtilities({
      ".overscroll-auto": { "overscroll-behavior": "auto" },
      ".overscroll-contain": { "overscroll-behavior": "contain" },
      ".overscroll-none": { "overscroll-behavior": "none" },
      ".overscroll-y-auto": { "overscroll-behavior-y": "auto" },
      ".overscroll-y-contain": { "overscroll-behavior-y": "contain" },
      ".overscroll-y-none": { "overscroll-behavior-y": "none" },
      ".overscroll-x-auto": { "overscroll-behavior-x": "auto" },
      ".overscroll-x-contain": { "overscroll-behavior-x": "contain" },
      ".overscroll-x-none": { "overscroll-behavior-x": "none" }
    });
  },
  scrollBehavior: ({ addUtilities }) => {
    addUtilities({
      ".scroll-auto": { "scroll-behavior": "auto" },
      ".scroll-smooth": { "scroll-behavior": "smooth" }
    });
  },
  textOverflow: ({ addUtilities }) => {
    addUtilities({
      ".truncate": { overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" },
      ".overflow-ellipsis": { "text-overflow": "ellipsis" },
      ".text-ellipsis": { "text-overflow": "ellipsis" },
      ".text-clip": { "text-overflow": "clip" }
    });
  },
  hyphens: ({ addUtilities }) => {
    addUtilities({
      ".hyphens-none": { hyphens: "none" },
      ".hyphens-manual": { hyphens: "manual" },
      ".hyphens-auto": { hyphens: "auto" }
    });
  },
  whitespace: ({ addUtilities }) => {
    addUtilities({
      ".whitespace-normal": { "white-space": "normal" },
      ".whitespace-nowrap": { "white-space": "nowrap" },
      ".whitespace-pre": { "white-space": "pre" },
      ".whitespace-pre-line": { "white-space": "pre-line" },
      ".whitespace-pre-wrap": { "white-space": "pre-wrap" },
      ".whitespace-break-spaces": { "white-space": "break-spaces" }
    });
  },
  textWrap: ({ addUtilities }) => {
    addUtilities({
      ".text-wrap": { "text-wrap": "wrap" },
      ".text-nowrap": { "text-wrap": "nowrap" },
      ".text-balance": { "text-wrap": "balance" },
      ".text-pretty": { "text-wrap": "pretty" }
    });
  },
  wordBreak: ({ addUtilities }) => {
    addUtilities({
      ".break-normal": { "overflow-wrap": "normal", "word-break": "normal" },
      ".break-words": { "overflow-wrap": "break-word" },
      ".break-all": { "word-break": "break-all" },
      ".break-keep": { "word-break": "keep-all" }
    });
  },
  borderRadius: createUtilityPlugin("borderRadius", [
    ["rounded", ["border-radius"]],
    [
      ["rounded-s", ["border-start-start-radius", "border-end-start-radius"]],
      ["rounded-e", ["border-start-end-radius", "border-end-end-radius"]],
      ["rounded-t", ["border-top-left-radius", "border-top-right-radius"]],
      ["rounded-r", ["border-top-right-radius", "border-bottom-right-radius"]],
      ["rounded-b", ["border-bottom-right-radius", "border-bottom-left-radius"]],
      ["rounded-l", ["border-top-left-radius", "border-bottom-left-radius"]]
    ],
    [
      ["rounded-ss", ["border-start-start-radius"]],
      ["rounded-se", ["border-start-end-radius"]],
      ["rounded-ee", ["border-end-end-radius"]],
      ["rounded-es", ["border-end-start-radius"]],
      ["rounded-tl", ["border-top-left-radius"]],
      ["rounded-tr", ["border-top-right-radius"]],
      ["rounded-br", ["border-bottom-right-radius"]],
      ["rounded-bl", ["border-bottom-left-radius"]]
    ]
  ]),
  borderWidth: createUtilityPlugin(
    "borderWidth",
    [
      ["border", [["@defaults border-width", {}], "border-width"]],
      [
        ["border-x", [["@defaults border-width", {}], "border-left-width", "border-right-width"]],
        ["border-y", [["@defaults border-width", {}], "border-top-width", "border-bottom-width"]]
      ],
      [
        ["border-s", [["@defaults border-width", {}], "border-inline-start-width"]],
        ["border-e", [["@defaults border-width", {}], "border-inline-end-width"]],
        ["border-t", [["@defaults border-width", {}], "border-top-width"]],
        ["border-r", [["@defaults border-width", {}], "border-right-width"]],
        ["border-b", [["@defaults border-width", {}], "border-bottom-width"]],
        ["border-l", [["@defaults border-width", {}], "border-left-width"]]
      ]
    ],
    { type: ["line-width", "length"] }
  ),
  borderStyle: ({ addUtilities }) => {
    addUtilities({
      ".border-solid": { "border-style": "solid" },
      ".border-dashed": { "border-style": "dashed" },
      ".border-dotted": { "border-style": "dotted" },
      ".border-double": { "border-style": "double" },
      ".border-hidden": { "border-style": "hidden" },
      ".border-none": { "border-style": "none" }
    });
  },
  borderColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        border: (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-color",
            variable: "--tw-border-opacity"
          });
        }
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette_default(theme("borderColor"))),
        type: ["color", "any"]
      }
    );
    matchUtilities(
      {
        "border-x": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-left-color": toColorValue(value2),
              "border-right-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: ["border-left-color", "border-right-color"],
            variable: "--tw-border-opacity"
          });
        },
        "border-y": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-top-color": toColorValue(value2),
              "border-bottom-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: ["border-top-color", "border-bottom-color"],
            variable: "--tw-border-opacity"
          });
        }
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette_default(theme("borderColor"))),
        type: ["color", "any"]
      }
    );
    matchUtilities(
      {
        "border-s": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-inline-start-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-inline-start-color",
            variable: "--tw-border-opacity"
          });
        },
        "border-e": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-inline-end-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-inline-end-color",
            variable: "--tw-border-opacity"
          });
        },
        "border-t": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-top-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-top-color",
            variable: "--tw-border-opacity"
          });
        },
        "border-r": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-right-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-right-color",
            variable: "--tw-border-opacity"
          });
        },
        "border-b": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-bottom-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-bottom-color",
            variable: "--tw-border-opacity"
          });
        },
        "border-l": (value2) => {
          if (!corePlugins2("borderOpacity")) {
            return {
              "border-left-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "border-left-color",
            variable: "--tw-border-opacity"
          });
        }
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette_default(theme("borderColor"))),
        type: ["color", "any"]
      }
    );
  },
  borderOpacity: createUtilityPlugin("borderOpacity", [
    ["border-opacity", ["--tw-border-opacity"]]
  ]),
  backgroundColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        bg: (value2) => {
          if (!corePlugins2("backgroundOpacity")) {
            return {
              "background-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "background-color",
            variable: "--tw-bg-opacity"
          });
        }
      },
      { values: flattenColorPalette_default(theme("backgroundColor")), type: ["color", "any"] }
    );
  },
  backgroundOpacity: createUtilityPlugin("backgroundOpacity", [
    ["bg-opacity", ["--tw-bg-opacity"]]
  ]),
  backgroundImage: createUtilityPlugin("backgroundImage", [["bg", ["background-image"]]], {
    type: ["lookup", "image", "url"]
  }),
  gradientColorStops: /* @__PURE__ */ (() => {
    function transparentTo(value2) {
      return withAlphaValue(value2, 0, "rgb(255 255 255 / 0)");
    }
    return function({ matchUtilities, theme, addDefaults }) {
      addDefaults("gradient-color-stops", {
        "--tw-gradient-from-position": " ",
        "--tw-gradient-via-position": " ",
        "--tw-gradient-to-position": " "
      });
      let options = {
        values: flattenColorPalette_default(theme("gradientColorStops")),
        type: ["color", "any"]
      };
      let positionOptions = {
        values: theme("gradientColorStopPositions"),
        type: ["length", "percentage"]
      };
      matchUtilities(
        {
          from: (value2) => {
            let transparentToValue = transparentTo(value2);
            return {
              "@defaults gradient-color-stops": {},
              "--tw-gradient-from": `${toColorValue(value2)} var(--tw-gradient-from-position)`,
              "--tw-gradient-to": `${transparentToValue} var(--tw-gradient-to-position)`,
              "--tw-gradient-stops": `var(--tw-gradient-from), var(--tw-gradient-to)`
            };
          }
        },
        options
      );
      matchUtilities(
        {
          from: (value2) => {
            return {
              "--tw-gradient-from-position": value2
            };
          }
        },
        positionOptions
      );
      matchUtilities(
        {
          via: (value2) => {
            let transparentToValue = transparentTo(value2);
            return {
              "@defaults gradient-color-stops": {},
              "--tw-gradient-to": `${transparentToValue}  var(--tw-gradient-to-position)`,
              "--tw-gradient-stops": `var(--tw-gradient-from), ${toColorValue(
                value2
              )} var(--tw-gradient-via-position), var(--tw-gradient-to)`
            };
          }
        },
        options
      );
      matchUtilities(
        {
          via: (value2) => {
            return {
              "--tw-gradient-via-position": value2
            };
          }
        },
        positionOptions
      );
      matchUtilities(
        {
          to: (value2) => ({
            "@defaults gradient-color-stops": {},
            "--tw-gradient-to": `${toColorValue(value2)} var(--tw-gradient-to-position)`
          })
        },
        options
      );
      matchUtilities(
        {
          to: (value2) => {
            return {
              "--tw-gradient-to-position": value2
            };
          }
        },
        positionOptions
      );
    };
  })(),
  boxDecorationBreak: ({ addUtilities }) => {
    addUtilities({
      ".decoration-slice": { "box-decoration-break": "slice" },
      ".decoration-clone": { "box-decoration-break": "clone" },
      ".box-decoration-slice": { "box-decoration-break": "slice" },
      ".box-decoration-clone": { "box-decoration-break": "clone" }
    });
  },
  backgroundSize: createUtilityPlugin("backgroundSize", [["bg", ["background-size"]]], {
    type: ["lookup", "length", "percentage", "size"]
  }),
  backgroundAttachment: ({ addUtilities }) => {
    addUtilities({
      ".bg-fixed": { "background-attachment": "fixed" },
      ".bg-local": { "background-attachment": "local" },
      ".bg-scroll": { "background-attachment": "scroll" }
    });
  },
  backgroundClip: ({ addUtilities }) => {
    addUtilities({
      ".bg-clip-border": { "background-clip": "border-box" },
      ".bg-clip-padding": { "background-clip": "padding-box" },
      ".bg-clip-content": { "background-clip": "content-box" },
      ".bg-clip-text": { "background-clip": "text" }
    });
  },
  backgroundPosition: createUtilityPlugin("backgroundPosition", [["bg", ["background-position"]]], {
    type: ["lookup", ["position", { preferOnConflict: true }]]
  }),
  backgroundRepeat: ({ addUtilities }) => {
    addUtilities({
      ".bg-repeat": { "background-repeat": "repeat" },
      ".bg-no-repeat": { "background-repeat": "no-repeat" },
      ".bg-repeat-x": { "background-repeat": "repeat-x" },
      ".bg-repeat-y": { "background-repeat": "repeat-y" },
      ".bg-repeat-round": { "background-repeat": "round" },
      ".bg-repeat-space": { "background-repeat": "space" }
    });
  },
  backgroundOrigin: ({ addUtilities }) => {
    addUtilities({
      ".bg-origin-border": { "background-origin": "border-box" },
      ".bg-origin-padding": { "background-origin": "padding-box" },
      ".bg-origin-content": { "background-origin": "content-box" }
    });
  },
  fill: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        fill: (value2) => {
          return { fill: toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("fill")), type: ["color", "any"] }
    );
  },
  stroke: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        stroke: (value2) => {
          return { stroke: toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("stroke")), type: ["color", "url", "any"] }
    );
  },
  strokeWidth: createUtilityPlugin("strokeWidth", [["stroke", ["stroke-width"]]], {
    type: ["length", "number", "percentage"]
  }),
  objectFit: ({ addUtilities }) => {
    addUtilities({
      ".object-contain": { "object-fit": "contain" },
      ".object-cover": { "object-fit": "cover" },
      ".object-fill": { "object-fit": "fill" },
      ".object-none": { "object-fit": "none" },
      ".object-scale-down": { "object-fit": "scale-down" }
    });
  },
  objectPosition: createUtilityPlugin("objectPosition", [["object", ["object-position"]]]),
  padding: createUtilityPlugin("padding", [
    ["p", ["padding"]],
    [
      ["px", ["padding-left", "padding-right"]],
      ["py", ["padding-top", "padding-bottom"]]
    ],
    [
      ["ps", ["padding-inline-start"]],
      ["pe", ["padding-inline-end"]],
      ["pt", ["padding-top"]],
      ["pr", ["padding-right"]],
      ["pb", ["padding-bottom"]],
      ["pl", ["padding-left"]]
    ]
  ]),
  textAlign: ({ addUtilities }) => {
    addUtilities({
      ".text-left": { "text-align": "left" },
      ".text-center": { "text-align": "center" },
      ".text-right": { "text-align": "right" },
      ".text-justify": { "text-align": "justify" },
      ".text-start": { "text-align": "start" },
      ".text-end": { "text-align": "end" }
    });
  },
  textIndent: createUtilityPlugin("textIndent", [["indent", ["text-indent"]]], {
    supportsNegativeValues: true
  }),
  verticalAlign: ({ addUtilities, matchUtilities }) => {
    addUtilities({
      ".align-baseline": { "vertical-align": "baseline" },
      ".align-top": { "vertical-align": "top" },
      ".align-middle": { "vertical-align": "middle" },
      ".align-bottom": { "vertical-align": "bottom" },
      ".align-text-top": { "vertical-align": "text-top" },
      ".align-text-bottom": { "vertical-align": "text-bottom" },
      ".align-sub": { "vertical-align": "sub" },
      ".align-super": { "vertical-align": "super" }
    });
    matchUtilities({ align: (value2) => ({ "vertical-align": value2 }) });
  },
  fontFamily: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        font: (value2) => {
          let [families, options = {}] = Array.isArray(value2) && isPlainObject(value2[1]) ? value2 : [value2];
          let { fontFeatureSettings, fontVariationSettings } = options;
          return {
            "font-family": Array.isArray(families) ? families.join(", ") : families,
            ...fontFeatureSettings === void 0 ? {} : { "font-feature-settings": fontFeatureSettings },
            ...fontVariationSettings === void 0 ? {} : { "font-variation-settings": fontVariationSettings }
          };
        }
      },
      {
        values: theme("fontFamily"),
        type: ["lookup", "generic-name", "family-name"]
      }
    );
  },
  fontSize: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        text: (value2, { modifier }) => {
          let [fontSize, options] = Array.isArray(value2) ? value2 : [value2];
          if (modifier) {
            return {
              "font-size": fontSize,
              "line-height": modifier
            };
          }
          let { lineHeight, letterSpacing, fontWeight } = isPlainObject(options) ? options : { lineHeight: options };
          return {
            "font-size": fontSize,
            ...lineHeight === void 0 ? {} : { "line-height": lineHeight },
            ...letterSpacing === void 0 ? {} : { "letter-spacing": letterSpacing },
            ...fontWeight === void 0 ? {} : { "font-weight": fontWeight }
          };
        }
      },
      {
        values: theme("fontSize"),
        modifiers: theme("lineHeight"),
        type: ["absolute-size", "relative-size", "length", "percentage"]
      }
    );
  },
  fontWeight: createUtilityPlugin("fontWeight", [["font", ["fontWeight"]]], {
    type: ["lookup", "number", "any"]
  }),
  textTransform: ({ addUtilities }) => {
    addUtilities({
      ".uppercase": { "text-transform": "uppercase" },
      ".lowercase": { "text-transform": "lowercase" },
      ".capitalize": { "text-transform": "capitalize" },
      ".normal-case": { "text-transform": "none" }
    });
  },
  fontStyle: ({ addUtilities }) => {
    addUtilities({
      ".italic": { "font-style": "italic" },
      ".not-italic": { "font-style": "normal" }
    });
  },
  fontVariantNumeric: ({ addDefaults, addUtilities }) => {
    let cssFontVariantNumericValue = "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)";
    addDefaults("font-variant-numeric", {
      "--tw-ordinal": " ",
      "--tw-slashed-zero": " ",
      "--tw-numeric-figure": " ",
      "--tw-numeric-spacing": " ",
      "--tw-numeric-fraction": " "
    });
    addUtilities({
      ".normal-nums": { "font-variant-numeric": "normal" },
      ".ordinal": {
        "@defaults font-variant-numeric": {},
        "--tw-ordinal": "ordinal",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".slashed-zero": {
        "@defaults font-variant-numeric": {},
        "--tw-slashed-zero": "slashed-zero",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".lining-nums": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-figure": "lining-nums",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".oldstyle-nums": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-figure": "oldstyle-nums",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".proportional-nums": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-spacing": "proportional-nums",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".tabular-nums": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-spacing": "tabular-nums",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".diagonal-fractions": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-fraction": "diagonal-fractions",
        "font-variant-numeric": cssFontVariantNumericValue
      },
      ".stacked-fractions": {
        "@defaults font-variant-numeric": {},
        "--tw-numeric-fraction": "stacked-fractions",
        "font-variant-numeric": cssFontVariantNumericValue
      }
    });
  },
  lineHeight: createUtilityPlugin("lineHeight", [["leading", ["lineHeight"]]]),
  letterSpacing: createUtilityPlugin("letterSpacing", [["tracking", ["letterSpacing"]]], {
    supportsNegativeValues: true
  }),
  textColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        text: (value2) => {
          if (!corePlugins2("textOpacity")) {
            return { color: toColorValue(value2) };
          }
          return withAlphaVariable({
            color: value2,
            property: "color",
            variable: "--tw-text-opacity"
          });
        }
      },
      { values: flattenColorPalette_default(theme("textColor")), type: ["color", "any"] }
    );
  },
  textOpacity: createUtilityPlugin("textOpacity", [["text-opacity", ["--tw-text-opacity"]]]),
  textDecoration: ({ addUtilities }) => {
    addUtilities({
      ".underline": { "text-decoration-line": "underline" },
      ".overline": { "text-decoration-line": "overline" },
      ".line-through": { "text-decoration-line": "line-through" },
      ".no-underline": { "text-decoration-line": "none" }
    });
  },
  textDecorationColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        decoration: (value2) => {
          return { "text-decoration-color": toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("textDecorationColor")), type: ["color", "any"] }
    );
  },
  textDecorationStyle: ({ addUtilities }) => {
    addUtilities({
      ".decoration-solid": { "text-decoration-style": "solid" },
      ".decoration-double": { "text-decoration-style": "double" },
      ".decoration-dotted": { "text-decoration-style": "dotted" },
      ".decoration-dashed": { "text-decoration-style": "dashed" },
      ".decoration-wavy": { "text-decoration-style": "wavy" }
    });
  },
  textDecorationThickness: createUtilityPlugin(
    "textDecorationThickness",
    [["decoration", ["text-decoration-thickness"]]],
    { type: ["length", "percentage"] }
  ),
  textUnderlineOffset: createUtilityPlugin(
    "textUnderlineOffset",
    [["underline-offset", ["text-underline-offset"]]],
    { type: ["length", "percentage", "any"] }
  ),
  fontSmoothing: ({ addUtilities }) => {
    addUtilities({
      ".antialiased": {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale"
      },
      ".subpixel-antialiased": {
        "-webkit-font-smoothing": "auto",
        "-moz-osx-font-smoothing": "auto"
      }
    });
  },
  placeholderColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        placeholder: (value2) => {
          if (!corePlugins2("placeholderOpacity")) {
            return {
              "&::placeholder": {
                color: toColorValue(value2)
              }
            };
          }
          return {
            "&::placeholder": withAlphaVariable({
              color: value2,
              property: "color",
              variable: "--tw-placeholder-opacity"
            })
          };
        }
      },
      { values: flattenColorPalette_default(theme("placeholderColor")), type: ["color", "any"] }
    );
  },
  placeholderOpacity: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "placeholder-opacity": (value2) => {
          return { ["&::placeholder"]: { "--tw-placeholder-opacity": value2 } };
        }
      },
      { values: theme("placeholderOpacity") }
    );
  },
  caretColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        caret: (value2) => {
          return { "caret-color": toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("caretColor")), type: ["color", "any"] }
    );
  },
  accentColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        accent: (value2) => {
          return { "accent-color": toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("accentColor")), type: ["color", "any"] }
    );
  },
  opacity: createUtilityPlugin("opacity", [["opacity", ["opacity"]]]),
  backgroundBlendMode: ({ addUtilities }) => {
    addUtilities({
      ".bg-blend-normal": { "background-blend-mode": "normal" },
      ".bg-blend-multiply": { "background-blend-mode": "multiply" },
      ".bg-blend-screen": { "background-blend-mode": "screen" },
      ".bg-blend-overlay": { "background-blend-mode": "overlay" },
      ".bg-blend-darken": { "background-blend-mode": "darken" },
      ".bg-blend-lighten": { "background-blend-mode": "lighten" },
      ".bg-blend-color-dodge": { "background-blend-mode": "color-dodge" },
      ".bg-blend-color-burn": { "background-blend-mode": "color-burn" },
      ".bg-blend-hard-light": { "background-blend-mode": "hard-light" },
      ".bg-blend-soft-light": { "background-blend-mode": "soft-light" },
      ".bg-blend-difference": { "background-blend-mode": "difference" },
      ".bg-blend-exclusion": { "background-blend-mode": "exclusion" },
      ".bg-blend-hue": { "background-blend-mode": "hue" },
      ".bg-blend-saturation": { "background-blend-mode": "saturation" },
      ".bg-blend-color": { "background-blend-mode": "color" },
      ".bg-blend-luminosity": { "background-blend-mode": "luminosity" }
    });
  },
  mixBlendMode: ({ addUtilities }) => {
    addUtilities({
      ".mix-blend-normal": { "mix-blend-mode": "normal" },
      ".mix-blend-multiply": { "mix-blend-mode": "multiply" },
      ".mix-blend-screen": { "mix-blend-mode": "screen" },
      ".mix-blend-overlay": { "mix-blend-mode": "overlay" },
      ".mix-blend-darken": { "mix-blend-mode": "darken" },
      ".mix-blend-lighten": { "mix-blend-mode": "lighten" },
      ".mix-blend-color-dodge": { "mix-blend-mode": "color-dodge" },
      ".mix-blend-color-burn": { "mix-blend-mode": "color-burn" },
      ".mix-blend-hard-light": { "mix-blend-mode": "hard-light" },
      ".mix-blend-soft-light": { "mix-blend-mode": "soft-light" },
      ".mix-blend-difference": { "mix-blend-mode": "difference" },
      ".mix-blend-exclusion": { "mix-blend-mode": "exclusion" },
      ".mix-blend-hue": { "mix-blend-mode": "hue" },
      ".mix-blend-saturation": { "mix-blend-mode": "saturation" },
      ".mix-blend-color": { "mix-blend-mode": "color" },
      ".mix-blend-luminosity": { "mix-blend-mode": "luminosity" },
      ".mix-blend-plus-lighter": { "mix-blend-mode": "plus-lighter" }
    });
  },
  boxShadow: (() => {
    let transformValue = transformThemeValue("boxShadow");
    let defaultBoxShadow = [
      `var(--tw-ring-offset-shadow, 0 0 #0000)`,
      `var(--tw-ring-shadow, 0 0 #0000)`,
      `var(--tw-shadow)`
    ].join(", ");
    return function({ matchUtilities, addDefaults, theme }) {
      addDefaults(" box-shadow", {
        "--tw-ring-offset-shadow": "0 0 #0000",
        "--tw-ring-shadow": "0 0 #0000",
        "--tw-shadow": "0 0 #0000",
        "--tw-shadow-colored": "0 0 #0000"
      });
      matchUtilities(
        {
          shadow: (value2) => {
            value2 = transformValue(value2);
            let ast = parseBoxShadowValue(value2);
            for (let shadow2 of ast) {
              if (!shadow2.valid) {
                continue;
              }
              shadow2.color = "var(--tw-shadow-color)";
            }
            return {
              "@defaults box-shadow": {},
              "--tw-shadow": value2 === "none" ? "0 0 #0000" : value2,
              "--tw-shadow-colored": value2 === "none" ? "0 0 #0000" : formatBoxShadowValue(ast),
              "box-shadow": defaultBoxShadow
            };
          }
        },
        { values: theme("boxShadow"), type: ["shadow"] }
      );
    };
  })(),
  boxShadowColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        shadow: (value2) => {
          return {
            "--tw-shadow-color": toColorValue(value2),
            "--tw-shadow": "var(--tw-shadow-colored)"
          };
        }
      },
      { values: flattenColorPalette_default(theme("boxShadowColor")), type: ["color", "any"] }
    );
  },
  outlineStyle: ({ addUtilities }) => {
    addUtilities({
      ".outline-none": {
        outline: "2px solid transparent",
        "outline-offset": "2px"
      },
      ".outline": { "outline-style": "solid" },
      ".outline-dashed": { "outline-style": "dashed" },
      ".outline-dotted": { "outline-style": "dotted" },
      ".outline-double": { "outline-style": "double" }
    });
  },
  outlineWidth: createUtilityPlugin("outlineWidth", [["outline", ["outline-width"]]], {
    type: ["length", "number", "percentage"]
  }),
  outlineOffset: createUtilityPlugin("outlineOffset", [["outline-offset", ["outline-offset"]]], {
    type: ["length", "number", "percentage", "any"],
    supportsNegativeValues: true
  }),
  outlineColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        outline: (value2) => {
          return { "outline-color": toColorValue(value2) };
        }
      },
      { values: flattenColorPalette_default(theme("outlineColor")), type: ["color", "any"] }
    );
  },
  ringWidth: ({ matchUtilities, addDefaults, addUtilities, theme, config: config2 }) => {
    let ringColorDefault = (() => {
      var _a, _b;
      if (flagEnabled(config2(), "respectDefaultRingColorOpacity")) {
        return theme("ringColor.DEFAULT");
      }
      let ringOpacityDefault = theme("ringOpacity.DEFAULT", "0.5");
      if (!((_a = theme("ringColor")) == null ? void 0 : _a.DEFAULT)) {
        return `rgb(147 197 253 / ${ringOpacityDefault})`;
      }
      return withAlphaValue(
        (_b = theme("ringColor")) == null ? void 0 : _b.DEFAULT,
        ringOpacityDefault,
        `rgb(147 197 253 / ${ringOpacityDefault})`
      );
    })();
    addDefaults("ring-width", {
      "--tw-ring-inset": " ",
      "--tw-ring-offset-width": theme("ringOffsetWidth.DEFAULT", "0px"),
      "--tw-ring-offset-color": theme("ringOffsetColor.DEFAULT", "#fff"),
      "--tw-ring-color": ringColorDefault,
      "--tw-ring-offset-shadow": "0 0 #0000",
      "--tw-ring-shadow": "0 0 #0000",
      "--tw-shadow": "0 0 #0000",
      "--tw-shadow-colored": "0 0 #0000"
    });
    matchUtilities(
      {
        ring: (value2) => {
          return {
            "@defaults ring-width": {},
            "--tw-ring-offset-shadow": `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
            "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${value2} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            "box-shadow": [
              `var(--tw-ring-offset-shadow)`,
              `var(--tw-ring-shadow)`,
              `var(--tw-shadow, 0 0 #0000)`
            ].join(", ")
          };
        }
      },
      { values: theme("ringWidth"), type: "length" }
    );
    addUtilities({
      ".ring-inset": { "@defaults ring-width": {}, "--tw-ring-inset": "inset" }
    });
  },
  ringColor: ({ matchUtilities, theme, corePlugins: corePlugins2 }) => {
    matchUtilities(
      {
        ring: (value2) => {
          if (!corePlugins2("ringOpacity")) {
            return {
              "--tw-ring-color": toColorValue(value2)
            };
          }
          return withAlphaVariable({
            color: value2,
            property: "--tw-ring-color",
            variable: "--tw-ring-opacity"
          });
        }
      },
      {
        values: Object.fromEntries(
          Object.entries(flattenColorPalette_default(theme("ringColor"))).filter(
            ([modifier]) => modifier !== "DEFAULT"
          )
        ),
        type: ["color", "any"]
      }
    );
  },
  ringOpacity: (helpers) => {
    let { config: config2 } = helpers;
    return createUtilityPlugin("ringOpacity", [["ring-opacity", ["--tw-ring-opacity"]]], {
      filterDefault: !flagEnabled(config2(), "respectDefaultRingColorOpacity")
    })(helpers);
  },
  ringOffsetWidth: createUtilityPlugin(
    "ringOffsetWidth",
    [["ring-offset", ["--tw-ring-offset-width"]]],
    { type: "length" }
  ),
  ringOffsetColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "ring-offset": (value2) => {
          return {
            "--tw-ring-offset-color": toColorValue(value2)
          };
        }
      },
      { values: flattenColorPalette_default(theme("ringOffsetColor")), type: ["color", "any"] }
    );
  },
  blur: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        blur: (value2) => {
          return {
            "--tw-blur": `blur(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("blur") }
    );
  },
  brightness: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        brightness: (value2) => {
          return {
            "--tw-brightness": `brightness(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("brightness") }
    );
  },
  contrast: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        contrast: (value2) => {
          return {
            "--tw-contrast": `contrast(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("contrast") }
    );
  },
  dropShadow: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "drop-shadow": (value2) => {
          return {
            "--tw-drop-shadow": Array.isArray(value2) ? value2.map((v) => `drop-shadow(${v})`).join(" ") : `drop-shadow(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("dropShadow") }
    );
  },
  grayscale: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        grayscale: (value2) => {
          return {
            "--tw-grayscale": `grayscale(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("grayscale") }
    );
  },
  hueRotate: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "hue-rotate": (value2) => {
          return {
            "--tw-hue-rotate": `hue-rotate(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("hueRotate"), supportsNegativeValues: true }
    );
  },
  invert: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        invert: (value2) => {
          return {
            "--tw-invert": `invert(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("invert") }
    );
  },
  saturate: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        saturate: (value2) => {
          return {
            "--tw-saturate": `saturate(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("saturate") }
    );
  },
  sepia: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        sepia: (value2) => {
          return {
            "--tw-sepia": `sepia(${value2})`,
            "@defaults filter": {},
            filter: cssFilterValue
          };
        }
      },
      { values: theme("sepia") }
    );
  },
  filter: ({ addDefaults, addUtilities }) => {
    addDefaults("filter", {
      "--tw-blur": " ",
      "--tw-brightness": " ",
      "--tw-contrast": " ",
      "--tw-grayscale": " ",
      "--tw-hue-rotate": " ",
      "--tw-invert": " ",
      "--tw-saturate": " ",
      "--tw-sepia": " ",
      "--tw-drop-shadow": " "
    });
    addUtilities({
      ".filter": { "@defaults filter": {}, filter: cssFilterValue },
      ".filter-none": { filter: "none" }
    });
  },
  backdropBlur: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-blur": (value2) => {
          return {
            "--tw-backdrop-blur": `blur(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropBlur") }
    );
  },
  backdropBrightness: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-brightness": (value2) => {
          return {
            "--tw-backdrop-brightness": `brightness(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropBrightness") }
    );
  },
  backdropContrast: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-contrast": (value2) => {
          return {
            "--tw-backdrop-contrast": `contrast(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropContrast") }
    );
  },
  backdropGrayscale: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-grayscale": (value2) => {
          return {
            "--tw-backdrop-grayscale": `grayscale(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropGrayscale") }
    );
  },
  backdropHueRotate: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-hue-rotate": (value2) => {
          return {
            "--tw-backdrop-hue-rotate": `hue-rotate(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropHueRotate"), supportsNegativeValues: true }
    );
  },
  backdropInvert: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-invert": (value2) => {
          return {
            "--tw-backdrop-invert": `invert(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropInvert") }
    );
  },
  backdropOpacity: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-opacity": (value2) => {
          return {
            "--tw-backdrop-opacity": `opacity(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropOpacity") }
    );
  },
  backdropSaturate: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-saturate": (value2) => {
          return {
            "--tw-backdrop-saturate": `saturate(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropSaturate") }
    );
  },
  backdropSepia: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "backdrop-sepia": (value2) => {
          return {
            "--tw-backdrop-sepia": `sepia(${value2})`,
            "@defaults backdrop-filter": {},
            "backdrop-filter": cssBackdropFilterValue
          };
        }
      },
      { values: theme("backdropSepia") }
    );
  },
  backdropFilter: ({ addDefaults, addUtilities }) => {
    addDefaults("backdrop-filter", {
      "--tw-backdrop-blur": " ",
      "--tw-backdrop-brightness": " ",
      "--tw-backdrop-contrast": " ",
      "--tw-backdrop-grayscale": " ",
      "--tw-backdrop-hue-rotate": " ",
      "--tw-backdrop-invert": " ",
      "--tw-backdrop-opacity": " ",
      "--tw-backdrop-saturate": " ",
      "--tw-backdrop-sepia": " "
    });
    addUtilities({
      ".backdrop-filter": {
        "@defaults backdrop-filter": {},
        "backdrop-filter": cssBackdropFilterValue
      },
      ".backdrop-filter-none": { "backdrop-filter": "none" }
    });
  },
  transitionProperty: ({ matchUtilities, theme }) => {
    let defaultTimingFunction = theme("transitionTimingFunction.DEFAULT");
    let defaultDuration = theme("transitionDuration.DEFAULT");
    matchUtilities(
      {
        transition: (value2) => {
          return {
            "transition-property": value2,
            ...value2 === "none" ? {} : {
              "transition-timing-function": defaultTimingFunction,
              "transition-duration": defaultDuration
            }
          };
        }
      },
      { values: theme("transitionProperty") }
    );
  },
  transitionDelay: createUtilityPlugin("transitionDelay", [["delay", ["transitionDelay"]]]),
  transitionDuration: createUtilityPlugin(
    "transitionDuration",
    [["duration", ["transitionDuration"]]],
    { filterDefault: true }
  ),
  transitionTimingFunction: createUtilityPlugin(
    "transitionTimingFunction",
    [["ease", ["transitionTimingFunction"]]],
    { filterDefault: true }
  ),
  willChange: createUtilityPlugin("willChange", [["will-change", ["will-change"]]]),
  content: createUtilityPlugin("content", [
    ["content", ["--tw-content", ["content", "var(--tw-content)"]]]
  ]),
  forcedColorAdjust: ({ addUtilities }) => {
    addUtilities({
      ".forced-color-adjust-auto": { "forced-color-adjust": "auto" },
      ".forced-color-adjust-none": { "forced-color-adjust": "none" }
    });
  }
};
function toPath(path) {
  if (Array.isArray(path))
    return path;
  let openBrackets = path.split("[").length - 1;
  let closedBrackets = path.split("]").length - 1;
  if (openBrackets !== closedBrackets) {
    throw new Error(`Path is invalid. Has unbalanced brackets: ${path}`);
  }
  return path.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean);
}
var matchingBrackets = /* @__PURE__ */ new Map([
  ["{", "}"],
  ["[", "]"],
  ["(", ")"]
]);
var inverseMatchingBrackets = new Map(
  Array.from(matchingBrackets.entries()).map(([k, v]) => [v, k])
);
var quotes = /* @__PURE__ */ new Set(['"', "'", "`"]);
function isSyntacticallyValidPropertyValue(value2) {
  let stack = [];
  let inQuotes = false;
  for (let i = 0; i < value2.length; i++) {
    let char = value2[i];
    if (char === ":" && !inQuotes && stack.length === 0) {
      return false;
    }
    if (quotes.has(char) && value2[i - 1] !== "\\") {
      inQuotes = !inQuotes;
    }
    if (inQuotes)
      continue;
    if (value2[i - 1] === "\\")
      continue;
    if (matchingBrackets.has(char)) {
      stack.push(char);
    } else if (inverseMatchingBrackets.has(char)) {
      let inverse = inverseMatchingBrackets.get(char);
      if (stack.length <= 0) {
        return false;
      }
      if (stack.pop() !== inverse) {
        return false;
      }
    }
  }
  if (stack.length > 0) {
    return false;
  }
  return true;
}
function bigSign(bigIntValue) {
  return (bigIntValue > 0n) - (bigIntValue < 0n);
}
function remapBitfield(num, mapping) {
  let oldMask = 0n;
  let newMask = 0n;
  for (let [oldBit, newBit] of mapping) {
    if (num & oldBit) {
      oldMask = oldMask | oldBit;
      newMask = newMask | newBit;
    }
  }
  return num & ~oldMask | newMask;
}
var Offsets = class {
  constructor() {
    this.offsets = {
      defaults: 0n,
      base: 0n,
      components: 0n,
      utilities: 0n,
      variants: 0n,
      user: 0n
    };
    this.layerPositions = {
      defaults: 0n,
      base: 1n,
      components: 2n,
      utilities: 3n,
      user: 4n,
      variants: 5n
    };
    this.reservedVariantBits = 0n;
    this.variantOffsets = /* @__PURE__ */ new Map();
  }
  create(layer) {
    return {
      layer,
      parentLayer: layer,
      arbitrary: 0n,
      variants: 0n,
      parallelIndex: 0n,
      index: this.offsets[layer]++,
      options: []
    };
  }
  arbitraryProperty() {
    return {
      ...this.create("utilities"),
      arbitrary: 1n
    };
  }
  forVariant(variant, index2 = 0) {
    let offset = this.variantOffsets.get(variant);
    if (offset === void 0) {
      throw new Error(`Cannot find offset for unknown variant ${variant}`);
    }
    return {
      ...this.create("variants"),
      variants: offset << BigInt(index2)
    };
  }
  applyVariantOffset(rule2, variant, options) {
    options.variant = variant.variants;
    return {
      ...rule2,
      layer: "variants",
      parentLayer: rule2.layer === "variants" ? rule2.parentLayer : rule2.layer,
      variants: rule2.variants | variant.variants,
      options: options.sort ? [].concat(options, rule2.options) : rule2.options,
      parallelIndex: max([rule2.parallelIndex, variant.parallelIndex])
    };
  }
  applyParallelOffset(offset, parallelIndex) {
    return {
      ...offset,
      parallelIndex: BigInt(parallelIndex)
    };
  }
  recordVariants(variants, getLength) {
    for (let variant of variants) {
      this.recordVariant(variant, getLength(variant));
    }
  }
  recordVariant(variant, fnCount = 1) {
    this.variantOffsets.set(variant, 1n << this.reservedVariantBits);
    this.reservedVariantBits += BigInt(fnCount);
    return {
      ...this.create("variants"),
      variants: this.variantOffsets.get(variant)
    };
  }
  compare(a, b) {
    if (a.layer !== b.layer) {
      return this.layerPositions[a.layer] - this.layerPositions[b.layer];
    }
    if (a.parentLayer !== b.parentLayer) {
      return this.layerPositions[a.parentLayer] - this.layerPositions[b.parentLayer];
    }
    for (let aOptions of a.options) {
      for (let bOptions of b.options) {
        if (aOptions.id !== bOptions.id)
          continue;
        if (!aOptions.sort || !bOptions.sort)
          continue;
        let maxFnVariant = max([aOptions.variant, bOptions.variant]) ?? 0n;
        let mask = ~(maxFnVariant | maxFnVariant - 1n);
        let aVariantsAfterFn = a.variants & mask;
        let bVariantsAfterFn = b.variants & mask;
        if (aVariantsAfterFn !== bVariantsAfterFn) {
          continue;
        }
        let result2 = aOptions.sort(
          {
            value: aOptions.value,
            modifier: aOptions.modifier
          },
          {
            value: bOptions.value,
            modifier: bOptions.modifier
          }
        );
        if (result2 !== 0)
          return result2;
      }
    }
    if (a.variants !== b.variants) {
      return a.variants - b.variants;
    }
    if (a.parallelIndex !== b.parallelIndex) {
      return a.parallelIndex - b.parallelIndex;
    }
    if (a.arbitrary !== b.arbitrary) {
      return a.arbitrary - b.arbitrary;
    }
    return a.index - b.index;
  }
  recalculateVariantOffsets() {
    let variants = Array.from(this.variantOffsets.entries()).filter(([v]) => v.startsWith("[")).sort(([a], [z]) => fastCompare(a, z));
    let newOffsets = variants.map(([, offset]) => offset).sort((a, z) => bigSign(a - z));
    let mapping = variants.map(([, oldOffset], i) => [oldOffset, newOffsets[i]]);
    return mapping.filter(([a, z]) => a !== z);
  }
  remapArbitraryVariantOffsets(list2) {
    let mapping = this.recalculateVariantOffsets();
    if (mapping.length === 0) {
      return list2;
    }
    return list2.map((item) => {
      let [offset, rule2] = item;
      offset = {
        ...offset,
        variants: remapBitfield(offset.variants, mapping)
      };
      return [offset, rule2];
    });
  }
  sort(list2) {
    list2 = this.remapArbitraryVariantOffsets(list2);
    return list2.sort(([a], [b]) => bigSign(this.compare(a, b)));
  }
};
function max(nums) {
  let max2 = null;
  for (const num of nums) {
    max2 = max2 ?? num;
    max2 = max2 > num ? max2 : num;
  }
  return max2;
}
function fastCompare(a, b) {
  let aLen = a.length;
  let bLen = b.length;
  let minLen = aLen < bLen ? aLen : bLen;
  for (let i = 0; i < minLen; i++) {
    let cmp = a.charCodeAt(i) - b.charCodeAt(i);
    if (cmp !== 0)
      return cmp;
  }
  return aLen - bLen;
}
var INTERNAL_FEATURES = Symbol();
var VARIANT_TYPES = {
  AddVariant: Symbol.for("ADD_VARIANT"),
  MatchVariant: Symbol.for("MATCH_VARIANT")
};
var VARIANT_INFO = {
  Base: 1 << 0,
  Dynamic: 1 << 1
};
function prefix(context, selector3) {
  let prefix3 = context.tailwindConfig.prefix;
  return typeof prefix3 === "function" ? prefix3(selector3) : prefix3 + selector3;
}
function normalizeOptionTypes({ type = "any", ...options }) {
  let types2 = [].concat(type);
  return {
    ...options,
    types: types2.map((type2) => {
      if (Array.isArray(type2)) {
        return { type: type2[0], ...type2[1] };
      }
      return { type: type2, preferOnConflict: false };
    })
  };
}
function parseVariantFormatString(input2) {
  let parts = [];
  let current = "";
  let depth = 0;
  for (let idx = 0; idx < input2.length; idx++) {
    let char = input2[idx];
    if (char === "\\") {
      current += "\\" + input2[++idx];
    } else if (char === "{") {
      ++depth;
      parts.push(current.trim());
      current = "";
    } else if (char === "}") {
      if (--depth < 0) {
        throw new Error(`Your { and } are unbalanced.`);
      }
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.length > 0) {
    parts.push(current.trim());
  }
  parts = parts.filter((part) => part !== "");
  return parts;
}
function insertInto(list2, value2, { before = [] } = {}) {
  before = [].concat(before);
  if (before.length <= 0) {
    list2.push(value2);
    return;
  }
  let idx = list2.length - 1;
  for (let other of before) {
    let iidx = list2.indexOf(other);
    if (iidx === -1)
      continue;
    idx = Math.min(idx, iidx);
  }
  list2.splice(idx, 0, value2);
}
function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles]);
  }
  return styles.flatMap((style) => {
    let isNode2 = !Array.isArray(style) && !isPlainObject(style);
    return isNode2 ? style : parseObjectStyles(style);
  });
}
function getClasses(selector3, mutate) {
  let parser5 = selectorParser4((selectors2) => {
    let allClasses = [];
    if (mutate) {
      mutate(selectors2);
    }
    selectors2.walkClasses((classNode) => {
      allClasses.push(classNode.value);
    });
    return allClasses;
  });
  return parser5.transformSync(selector3);
}
function ignoreNot(selectors2) {
  selectors2.walkPseudos((pseudo3) => {
    if (pseudo3.value === ":not") {
      pseudo3.remove();
    }
  });
}
function extractCandidates(node2, state = { containsNonOnDemandable: false }, depth = 0) {
  let classes = [];
  let selectors2 = [];
  if (node2.type === "rule") {
    selectors2.push(...node2.selectors);
  } else if (node2.type === "atrule") {
    node2.walkRules((rule2) => selectors2.push(...rule2.selectors));
  }
  for (let selector3 of selectors2) {
    let classCandidates = getClasses(selector3, ignoreNot);
    if (classCandidates.length === 0) {
      state.containsNonOnDemandable = true;
    }
    for (let classCandidate of classCandidates) {
      classes.push(classCandidate);
    }
  }
  if (depth === 0) {
    return [state.containsNonOnDemandable || classes.length === 0, classes];
  }
  return classes;
}
function withIdentifiers(styles) {
  return parseStyles(styles).flatMap((node2) => {
    let nodeMap = /* @__PURE__ */ new Map();
    let [containsNonOnDemandableSelectors, candidates] = extractCandidates(node2);
    if (containsNonOnDemandableSelectors) {
      candidates.unshift(NOT_ON_DEMAND);
    }
    return candidates.map((c) => {
      if (!nodeMap.has(node2)) {
        nodeMap.set(node2, node2);
      }
      return [c, nodeMap.get(node2)];
    });
  });
}
function isValidVariantFormatString(format) {
  return format.startsWith("@") || format.includes("&");
}
function parseVariant(variant) {
  variant = variant.replace(/\n+/g, "").replace(/\s{1,}/g, " ").trim();
  let fns = parseVariantFormatString(variant).map((str2) => {
    if (!str2.startsWith("@")) {
      return ({ format }) => format(str2);
    }
    let [, name, params] = /@(\S*)( .+|[({].*)?/g.exec(str2);
    return ({ wrap }) => wrap(postcss$5.atRule({ name, params: (params == null ? void 0 : params.trim()) ?? "" }));
  }).reverse();
  return (api) => {
    for (let fn of fns) {
      fn(api);
    }
  };
}
function buildPluginApi(tailwindConfig, context, { variantList, variantMap, offsets, classList }) {
  function getConfigValue(path, defaultValue) {
    return path ? dlv2(tailwindConfig, path, defaultValue) : tailwindConfig;
  }
  function applyConfiguredPrefix(selector3) {
    return prefixSelector_default(tailwindConfig.prefix, selector3);
  }
  function prefixIdentifier(identifier2, options) {
    if (identifier2 === NOT_ON_DEMAND) {
      return NOT_ON_DEMAND;
    }
    if (!options.respectPrefix) {
      return identifier2;
    }
    return context.tailwindConfig.prefix + identifier2;
  }
  function resolveThemeValue(path, defaultValue, opts = {}) {
    let parts = toPath(path);
    let value2 = getConfigValue(["theme", ...parts], defaultValue);
    return transformThemeValue(parts[0])(value2, opts);
  }
  let variantIdentifier = 0;
  let api = {
    postcss: postcss$5,
    prefix: applyConfiguredPrefix,
    e: escapeClassName,
    config: getConfigValue,
    theme: resolveThemeValue,
    corePlugins: (path) => {
      if (Array.isArray(tailwindConfig.corePlugins)) {
        return tailwindConfig.corePlugins.includes(path);
      }
      return getConfigValue(["corePlugins", path], true);
    },
    variants: () => {
      return [];
    },
    addBase(base) {
      for (let [identifier2, rule2] of withIdentifiers(base)) {
        let prefixedIdentifier = prefixIdentifier(identifier2, {});
        let offset = offsets.create("base");
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push([{ sort: offset, layer: "base" }, rule2]);
      }
    },
    addDefaults(group, declarations) {
      const groups = {
        [`@defaults ${group}`]: declarations
      };
      for (let [identifier2, rule2] of withIdentifiers(groups)) {
        let prefixedIdentifier = prefixIdentifier(identifier2, {});
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push([{ sort: offsets.create("defaults"), layer: "defaults" }, rule2]);
      }
    },
    addComponents(components, options) {
      let defaultOptions = {
        preserveSource: false,
        respectPrefix: true,
        respectImportant: false
      };
      options = Object.assign({}, defaultOptions, Array.isArray(options) ? {} : options);
      for (let [identifier2, rule2] of withIdentifiers(components)) {
        let prefixedIdentifier = prefixIdentifier(identifier2, options);
        classList.add(prefixedIdentifier);
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push([{ sort: offsets.create("components"), layer: "components", options }, rule2]);
      }
    },
    addUtilities(utilities, options) {
      let defaultOptions = {
        preserveSource: false,
        respectPrefix: true,
        respectImportant: true
      };
      options = Object.assign({}, defaultOptions, Array.isArray(options) ? {} : options);
      for (let [identifier2, rule2] of withIdentifiers(utilities)) {
        let prefixedIdentifier = prefixIdentifier(identifier2, options);
        classList.add(prefixedIdentifier);
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push([{ sort: offsets.create("utilities"), layer: "utilities", options }, rule2]);
      }
    },
    matchUtilities: function(utilities, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: true,
        modifiers: false
      };
      options = normalizeOptionTypes({ ...defaultOptions, ...options });
      let offset = offsets.create("utilities");
      for (let identifier2 in utilities) {
        let wrapped = function(modifier, { isOnlyPlugin }) {
          let [value2, coercedType, utilityModifier] = coerceValue(
            options.types,
            modifier,
            options,
            tailwindConfig
          );
          if (value2 === void 0) {
            return [];
          }
          if (!options.types.some(({ type }) => type === coercedType)) {
            if (isOnlyPlugin) {
              log_default.warn([
                `Unnecessary typehint \`${coercedType}\` in \`${identifier2}-${modifier}\`.`,
                `You can safely update it to \`${identifier2}-${modifier.replace(
                  coercedType + ":",
                  ""
                )}\`.`
              ]);
            } else {
              return [];
            }
          }
          if (!isSyntacticallyValidPropertyValue(value2)) {
            return [];
          }
          let extras = {
            get modifier() {
              if (!options.modifiers)
                ;
              return utilityModifier;
            }
          };
          let modifiersEnabled = flagEnabled(tailwindConfig, "generalizedModifiers");
          let ruleSets = [].concat(modifiersEnabled ? rule2(value2, extras) : rule2(value2)).filter(Boolean).map((declaration2) => ({
            [nameClass(identifier2, modifier)]: declaration2
          }));
          return ruleSets;
        };
        let prefixedIdentifier = prefixIdentifier(identifier2, options);
        let rule2 = utilities[identifier2];
        classList.add([prefixedIdentifier, options]);
        let withOffsets = [{ sort: offset, layer: "utilities", options }, wrapped];
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets);
      }
    },
    matchComponents: function(components, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: false,
        modifiers: false
      };
      options = normalizeOptionTypes({ ...defaultOptions, ...options });
      let offset = offsets.create("components");
      for (let identifier2 in components) {
        let wrapped = function(modifier, { isOnlyPlugin }) {
          let [value2, coercedType, utilityModifier] = coerceValue(
            options.types,
            modifier,
            options,
            tailwindConfig
          );
          if (value2 === void 0) {
            return [];
          }
          if (!options.types.some(({ type }) => type === coercedType)) {
            if (isOnlyPlugin) {
              log_default.warn([
                `Unnecessary typehint \`${coercedType}\` in \`${identifier2}-${modifier}\`.`,
                `You can safely update it to \`${identifier2}-${modifier.replace(
                  coercedType + ":",
                  ""
                )}\`.`
              ]);
            } else {
              return [];
            }
          }
          if (!isSyntacticallyValidPropertyValue(value2)) {
            return [];
          }
          let extras = {
            get modifier() {
              if (!options.modifiers)
                ;
              return utilityModifier;
            }
          };
          let modifiersEnabled = flagEnabled(tailwindConfig, "generalizedModifiers");
          let ruleSets = [].concat(modifiersEnabled ? rule2(value2, extras) : rule2(value2)).filter(Boolean).map((declaration2) => ({
            [nameClass(identifier2, modifier)]: declaration2
          }));
          return ruleSets;
        };
        let prefixedIdentifier = prefixIdentifier(identifier2, options);
        let rule2 = components[identifier2];
        classList.add([prefixedIdentifier, options]);
        let withOffsets = [{ sort: offset, layer: "components", options }, wrapped];
        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, []);
        }
        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets);
      }
    },
    addVariant(variantName, variantFunctions, options = {}) {
      variantFunctions = [].concat(variantFunctions).map((variantFunction) => {
        if (typeof variantFunction !== "string") {
          return (api2 = {}) => {
            let { args, modifySelectors, container: container2, separator, wrap, format } = api2;
            let result2 = variantFunction(
              Object.assign(
                { modifySelectors, container: container2, separator },
                options.type === VARIANT_TYPES.MatchVariant && { args, wrap, format }
              )
            );
            if (typeof result2 === "string" && !isValidVariantFormatString(result2)) {
              throw new Error(
                `Your custom variant \`${variantName}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
              );
            }
            if (Array.isArray(result2)) {
              return result2.filter((variant) => typeof variant === "string").map((variant) => parseVariant(variant));
            }
            return result2 && typeof result2 === "string" && parseVariant(result2)(api2);
          };
        }
        if (!isValidVariantFormatString(variantFunction)) {
          throw new Error(
            `Your custom variant \`${variantName}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
          );
        }
        return parseVariant(variantFunction);
      });
      insertInto(variantList, variantName, options);
      variantMap.set(variantName, variantFunctions);
      context.variantOptions.set(variantName, options);
    },
    matchVariant(variant, variantFn, options) {
      let id3 = (options == null ? void 0 : options.id) ?? ++variantIdentifier;
      let isSpecial = variant === "@";
      let modifiersEnabled = flagEnabled(tailwindConfig, "generalizedModifiers");
      for (let [key, value2] of Object.entries((options == null ? void 0 : options.values) ?? {})) {
        if (key === "DEFAULT")
          continue;
        api.addVariant(
          isSpecial ? `${variant}${key}` : `${variant}-${key}`,
          ({ args, container: container2 }) => {
            return variantFn(
              value2,
              modifiersEnabled ? { modifier: args == null ? void 0 : args.modifier, container: container2 } : { container: container2 }
            );
          },
          {
            ...options,
            value: value2,
            id: id3,
            type: VARIANT_TYPES.MatchVariant,
            variantInfo: VARIANT_INFO.Base
          }
        );
      }
      let hasDefault = "DEFAULT" in ((options == null ? void 0 : options.values) ?? {});
      api.addVariant(
        variant,
        ({ args, container: container2 }) => {
          if ((args == null ? void 0 : args.value) === NONE && !hasDefault) {
            return null;
          }
          return variantFn(
            (args == null ? void 0 : args.value) === NONE ? options.values.DEFAULT : (args == null ? void 0 : args.value) ?? (typeof args === "string" ? args : ""),
            modifiersEnabled ? { modifier: args == null ? void 0 : args.modifier, container: container2 } : { container: container2 }
          );
        },
        {
          ...options,
          id: id3,
          type: VARIANT_TYPES.MatchVariant,
          variantInfo: VARIANT_INFO.Dynamic
        }
      );
    }
  };
  return api;
}
function extractVariantAtRules(node2) {
  node2.walkAtRules((atRule2) => {
    if (["responsive", "variants"].includes(atRule2.name)) {
      extractVariantAtRules(atRule2);
      atRule2.before(atRule2.nodes);
      atRule2.remove();
    }
  });
}
function collectLayerPlugins(root3) {
  let layerPlugins = [];
  root3.each((node2) => {
    if (node2.type === "atrule" && ["responsive", "variants"].includes(node2.name)) {
      node2.name = "layer";
      node2.params = "utilities";
    }
  });
  root3.walkAtRules("layer", (layerRule) => {
    extractVariantAtRules(layerRule);
    if (layerRule.params === "base") {
      for (let node2 of layerRule.nodes) {
        layerPlugins.push(function({ addBase }) {
          addBase(node2, { respectPrefix: false });
        });
      }
      layerRule.remove();
    } else if (layerRule.params === "components") {
      for (let node2 of layerRule.nodes) {
        layerPlugins.push(function({ addComponents }) {
          addComponents(node2, { respectPrefix: false, preserveSource: true });
        });
      }
      layerRule.remove();
    } else if (layerRule.params === "utilities") {
      for (let node2 of layerRule.nodes) {
        layerPlugins.push(function({ addUtilities }) {
          addUtilities(node2, { respectPrefix: false, preserveSource: true });
        });
      }
      layerRule.remove();
    }
  });
  return layerPlugins;
}
function resolvePlugins(context, root3) {
  let corePluginList = Object.entries({ ...variantPlugins, ...corePlugins }).map(([name, plugin3]) => {
    if (!context.tailwindConfig.corePlugins.includes(name)) {
      return null;
    }
    return plugin3;
  }).filter(Boolean);
  let userPlugins = context.tailwindConfig.plugins.map((plugin3) => {
    if (plugin3.__isOptionsFunction) {
      plugin3 = plugin3();
    }
    return typeof plugin3 === "function" ? plugin3 : plugin3.handler;
  });
  let layerPlugins = collectLayerPlugins(root3);
  let beforeVariants = [
    variantPlugins["childVariant"],
    variantPlugins["pseudoElementVariants"],
    variantPlugins["pseudoClassVariants"],
    variantPlugins["hasVariants"],
    variantPlugins["ariaVariants"],
    variantPlugins["dataVariants"]
  ];
  let afterVariants = [
    variantPlugins["supportsVariants"],
    variantPlugins["reducedMotionVariants"],
    variantPlugins["prefersContrastVariants"],
    variantPlugins["screenVariants"],
    variantPlugins["orientationVariants"],
    variantPlugins["directionVariants"],
    variantPlugins["darkVariants"],
    variantPlugins["forcedColorsVariants"],
    variantPlugins["printVariant"]
  ];
  let isLegacyDarkMode = context.tailwindConfig.darkMode === "class" || Array.isArray(context.tailwindConfig.darkMode) && context.tailwindConfig.darkMode[0] === "class";
  if (isLegacyDarkMode) {
    afterVariants = [
      variantPlugins["supportsVariants"],
      variantPlugins["reducedMotionVariants"],
      variantPlugins["prefersContrastVariants"],
      variantPlugins["darkVariants"],
      variantPlugins["screenVariants"],
      variantPlugins["orientationVariants"],
      variantPlugins["directionVariants"],
      variantPlugins["forcedColorsVariants"],
      variantPlugins["printVariant"]
    ];
  }
  return [...corePluginList, ...beforeVariants, ...userPlugins, ...afterVariants, ...layerPlugins];
}
function registerPlugins(plugins, context) {
  let variantList = [];
  let variantMap = /* @__PURE__ */ new Map();
  context.variantMap = variantMap;
  let offsets = new Offsets();
  context.offsets = offsets;
  let classList = /* @__PURE__ */ new Set();
  let pluginApi = buildPluginApi(context.tailwindConfig, context, {
    variantList,
    variantMap,
    offsets,
    classList
  });
  for (let plugin3 of plugins) {
    if (Array.isArray(plugin3)) {
      for (let pluginItem of plugin3) {
        pluginItem(pluginApi);
      }
    } else {
      plugin3 == null ? void 0 : plugin3(pluginApi);
    }
  }
  offsets.recordVariants(variantList, (variant) => variantMap.get(variant).length);
  for (let [variantName, variantFunctions] of variantMap.entries()) {
    context.variantMap.set(
      variantName,
      variantFunctions.map((variantFunction, idx) => [
        offsets.forVariant(variantName, idx),
        variantFunction
      ])
    );
  }
  let safelist = (context.tailwindConfig.safelist ?? []).filter(Boolean);
  if (safelist.length > 0) {
    let checks = [];
    for (let value2 of safelist) {
      if (typeof value2 === "string") {
        context.changedContent.push({ content: value2, extension: "html" });
        continue;
      }
      if (value2 instanceof RegExp) {
        continue;
      }
      checks.push(value2);
    }
    if (checks.length > 0) {
      let patternMatchingCount = /* @__PURE__ */ new Map();
      let prefixLength = context.tailwindConfig.prefix.length;
      let checkImportantUtils = checks.some((check) => check.pattern.source.includes("!"));
      for (let util2 of classList) {
        let utils = Array.isArray(util2) ? (() => {
          let [utilName, options] = util2;
          let values = Object.keys((options == null ? void 0 : options.values) ?? {});
          let classes = values.map((value2) => formatClass(utilName, value2));
          if (options == null ? void 0 : options.supportsNegativeValues) {
            classes = [...classes, ...classes.map((cls) => "-" + cls)];
            classes = [
              ...classes,
              ...classes.map(
                (cls) => cls.slice(0, prefixLength) + "-" + cls.slice(prefixLength)
              )
            ];
          }
          if (options.types.some(({ type }) => type === "color")) {
            classes = [
              ...classes,
              ...classes.flatMap(
                (cls) => Object.keys(context.tailwindConfig.theme.opacity).map(
                  (opacity) => `${cls}/${opacity}`
                )
              )
            ];
          }
          if (checkImportantUtils && (options == null ? void 0 : options.respectImportant)) {
            classes = [...classes, ...classes.map((cls) => "!" + cls)];
          }
          return classes;
        })() : [util2];
        for (let util22 of utils) {
          for (let { pattern: pattern2, variants = [] } of checks) {
            pattern2.lastIndex = 0;
            if (!patternMatchingCount.has(pattern2)) {
              patternMatchingCount.set(pattern2, 0);
            }
            if (!pattern2.test(util22))
              continue;
            patternMatchingCount.set(pattern2, patternMatchingCount.get(pattern2) + 1);
            context.changedContent.push({ content: util22, extension: "html" });
            for (let variant of variants) {
              context.changedContent.push({
                content: variant + context.tailwindConfig.separator + util22,
                extension: "html"
              });
            }
          }
        }
      }
      for (let [regex, count] of patternMatchingCount.entries()) {
        if (count !== 0)
          continue;
      }
    }
  }
  let darkClassName = [].concat(context.tailwindConfig.darkMode ?? "media")[1] ?? "dark";
  let parasiteUtilities = [
    prefix(context, darkClassName),
    prefix(context, "group"),
    prefix(context, "peer")
  ];
  context.getClassOrder = function getClassOrder(classes) {
    let sorted = [...classes].sort((a, z) => {
      if (a === z)
        return 0;
      if (a < z)
        return -1;
      return 1;
    });
    let sortedClassNames = new Map(sorted.map((className3) => [className3, null]));
    let rules = generateRules(new Set(sorted), context, true);
    rules = context.offsets.sort(rules);
    let idx = BigInt(parasiteUtilities.length);
    for (const [, rule2] of rules) {
      let candidate = rule2.raws.tailwind.candidate;
      sortedClassNames.set(candidate, sortedClassNames.get(candidate) ?? idx++);
    }
    return classes.map((className3) => {
      let order = sortedClassNames.get(className3) ?? null;
      let parasiteIndex = parasiteUtilities.indexOf(className3);
      if (order === null && parasiteIndex !== -1) {
        order = BigInt(parasiteIndex);
      }
      return [className3, order];
    });
  };
  context.getClassList = function getClassList(options = {}) {
    var _a;
    let output = [];
    for (let util2 of classList) {
      if (Array.isArray(util2)) {
        let [utilName, utilOptions] = util2;
        let negativeClasses = [];
        let modifiers = Object.keys((utilOptions == null ? void 0 : utilOptions.modifiers) ?? {});
        if ((_a = utilOptions == null ? void 0 : utilOptions.types) == null ? void 0 : _a.some(({ type }) => type === "color")) {
          modifiers.push(...Object.keys(context.tailwindConfig.theme.opacity ?? {}));
        }
        let metadata = { modifiers };
        let includeMetadata = options.includeMetadata && modifiers.length > 0;
        for (let [key, value2] of Object.entries((utilOptions == null ? void 0 : utilOptions.values) ?? {})) {
          if (value2 == null) {
            continue;
          }
          let cls = formatClass(utilName, key);
          output.push(includeMetadata ? [cls, metadata] : cls);
          if ((utilOptions == null ? void 0 : utilOptions.supportsNegativeValues) && negateValue(value2)) {
            let cls2 = formatClass(utilName, `-${key}`);
            negativeClasses.push(includeMetadata ? [cls2, metadata] : cls2);
          }
        }
        output.push(...negativeClasses);
      } else {
        output.push(util2);
      }
    }
    return output;
  };
  context.getVariants = function getVariants() {
    let result2 = [];
    for (let [name, options] of context.variantOptions.entries()) {
      if (options.variantInfo === VARIANT_INFO.Base)
        continue;
      result2.push({
        name,
        isArbitrary: options.type === Symbol.for("MATCH_VARIANT"),
        values: Object.keys(options.values ?? {}),
        hasDash: name !== "@",
        selectors({ modifier, value: value2 } = {}) {
          var _a;
          let candidate = "__TAILWIND_PLACEHOLDER__";
          let rule2 = postcss$5.rule({ selector: `.${candidate}` });
          let container2 = postcss$5.root({ nodes: [rule2.clone()] });
          let before = container2.toString();
          let fns = (context.variantMap.get(name) ?? []).flatMap(([_, fn]) => fn);
          let formatStrings = [];
          for (let fn of fns) {
            let localFormatStrings = [];
            let api = {
              args: { modifier, value: ((_a = options.values) == null ? void 0 : _a[value2]) ?? value2 },
              separator: context.tailwindConfig.separator,
              modifySelectors(modifierFunction) {
                container2.each((rule22) => {
                  if (rule22.type !== "rule") {
                    return;
                  }
                  rule22.selectors = rule22.selectors.map((selector3) => {
                    return modifierFunction({
                      get className() {
                        return getClassNameFromSelector(selector3);
                      },
                      selector: selector3
                    });
                  });
                });
                return container2;
              },
              format(str2) {
                localFormatStrings.push(str2);
              },
              wrap(wrapper) {
                localFormatStrings.push(`@${wrapper.name} ${wrapper.params} { & }`);
              },
              container: container2
            };
            let ruleWithVariant = fn(api);
            if (localFormatStrings.length > 0) {
              formatStrings.push(localFormatStrings);
            }
            if (Array.isArray(ruleWithVariant)) {
              for (let variantFunction of ruleWithVariant) {
                localFormatStrings = [];
                variantFunction(api);
                formatStrings.push(localFormatStrings);
              }
            }
          }
          let manualFormatStrings = [];
          let after = container2.toString();
          if (before !== after) {
            container2.walkRules((rule22) => {
              let modified = rule22.selector;
              let rebuiltBase = selectorParser4((selectors2) => {
                selectors2.walkClasses((classNode) => {
                  classNode.value = `${name}${context.tailwindConfig.separator}${classNode.value}`;
                });
              }).processSync(modified);
              manualFormatStrings.push(modified.replace(rebuiltBase, "&").replace(candidate, "&"));
            });
            container2.walkAtRules((atrule) => {
              manualFormatStrings.push(`@${atrule.name} (${atrule.params}) { & }`);
            });
          }
          let isArbitraryVariant = !(value2 in (options.values ?? {}));
          let internalFeatures = options[INTERNAL_FEATURES] ?? {};
          let respectPrefix = (() => {
            if (isArbitraryVariant)
              return false;
            if (internalFeatures.respectPrefix === false)
              return false;
            return true;
          })();
          formatStrings = formatStrings.map(
            (format) => format.map((str2) => ({
              format: str2,
              respectPrefix
            }))
          );
          manualFormatStrings = manualFormatStrings.map((format) => ({
            format,
            respectPrefix
          }));
          let opts = {
            candidate,
            context
          };
          let result22 = formatStrings.map(
            (formats) => finalizeSelector(`.${candidate}`, formatVariantSelector(formats, opts), opts).replace(`.${candidate}`, "&").replace("{ & }", "").trim()
          );
          if (manualFormatStrings.length > 0) {
            result22.push(
              formatVariantSelector(manualFormatStrings, opts).toString().replace(`.${candidate}`, "&")
            );
          }
          return result22;
        }
      });
    }
    return result2;
  };
}
function markInvalidUtilityCandidate(context, candidate) {
  if (!context.classCache.has(candidate)) {
    return;
  }
  context.notClassCache.add(candidate);
  context.classCache.delete(candidate);
  context.applyClassCache.delete(candidate);
  context.candidateRuleMap.delete(candidate);
  context.candidateRuleCache.delete(candidate);
  context.stylesheetCache = null;
}
function markInvalidUtilityNode(context, node2) {
  let candidate = node2.raws.tailwind.candidate;
  if (!candidate) {
    return;
  }
  for (const entry of context.ruleCache) {
    if (entry[1].raws.tailwind.candidate === candidate) {
      context.ruleCache.delete(entry);
    }
  }
  markInvalidUtilityCandidate(context, candidate);
}
function createContext(tailwindConfig, changedContent = [], root3 = postcss$5.root()) {
  let context = {
    disposables: [],
    ruleCache: /* @__PURE__ */ new Set(),
    candidateRuleCache: /* @__PURE__ */ new Map(),
    classCache: /* @__PURE__ */ new Map(),
    applyClassCache: /* @__PURE__ */ new Map(),
    notClassCache: new Set(tailwindConfig.blocklist ?? []),
    postCssNodeCache: /* @__PURE__ */ new Map(),
    candidateRuleMap: /* @__PURE__ */ new Map(),
    tailwindConfig,
    changedContent,
    variantMap: /* @__PURE__ */ new Map(),
    stylesheetCache: null,
    variantOptions: /* @__PURE__ */ new Map(),
    markInvalidUtilityCandidate: (candidate) => markInvalidUtilityCandidate(context, candidate),
    markInvalidUtilityNode: (node2) => markInvalidUtilityNode(context, node2)
  };
  let resolvedPlugins = resolvePlugins(context, root3);
  registerPlugins(resolvedPlugins, context);
  return context;
}
function applyImportantSelector(selector3, important) {
  let sel = selectorParser4().astSync(selector3);
  sel.each((sel2) => {
    let isWrapped = sel2.nodes[0].type === "pseudo" && sel2.nodes[0].value === ":is" && sel2.nodes.every((node2) => node2.type !== "combinator");
    if (!isWrapped) {
      sel2.nodes = [
        selectorParser4.pseudo({
          value: ":is",
          nodes: [sel2.clone()]
        })
      ];
    }
    movePseudos(sel2);
  });
  return `${important} ${sel.toString()}`;
}
var classNameParser = selectorParser4((selectors2) => {
  return selectors2.first.filter(({ type }) => type === "class").pop().value;
});
function getClassNameFromSelector(selector3) {
  return classNameParser.transformSync(selector3);
}
function* candidatePermutations(candidate) {
  let lastIndex = Infinity;
  while (lastIndex >= 0) {
    let dashIdx;
    let wasSlash = false;
    if (lastIndex === Infinity && candidate.endsWith("]")) {
      let bracketIdx = candidate.indexOf("[");
      if (candidate[bracketIdx - 1] === "-") {
        dashIdx = bracketIdx - 1;
      } else if (candidate[bracketIdx - 1] === "/") {
        dashIdx = bracketIdx - 1;
        wasSlash = true;
      } else {
        dashIdx = -1;
      }
    } else if (lastIndex === Infinity && candidate.includes("/")) {
      dashIdx = candidate.lastIndexOf("/");
      wasSlash = true;
    } else {
      dashIdx = candidate.lastIndexOf("-", lastIndex);
    }
    if (dashIdx < 0) {
      break;
    }
    let prefix3 = candidate.slice(0, dashIdx);
    let modifier = candidate.slice(wasSlash ? dashIdx : dashIdx + 1);
    lastIndex = dashIdx - 1;
    if (prefix3 === "" || modifier === "/") {
      continue;
    }
    yield [prefix3, modifier];
  }
}
function applyPrefix(matches, context) {
  if (matches.length === 0 || context.tailwindConfig.prefix === "") {
    return matches;
  }
  for (let match of matches) {
    let [meta] = match;
    if (meta.options.respectPrefix) {
      let container2 = postcss$5.root({ nodes: [match[1].clone()] });
      let classCandidate = match[1].raws.tailwind.classCandidate;
      container2.walkRules((r2) => {
        let shouldPrependNegative = classCandidate.startsWith("-");
        r2.selector = prefixSelector_default(
          context.tailwindConfig.prefix,
          r2.selector,
          shouldPrependNegative
        );
      });
      match[1] = container2.nodes[0];
    }
  }
  return matches;
}
function applyImportant(matches, classCandidate) {
  if (matches.length === 0) {
    return matches;
  }
  let result2 = [];
  function isInKeyframes(rule2) {
    return rule2.parent && rule2.parent.type === "atrule" && rule2.parent.name === "keyframes";
  }
  for (let [meta, rule2] of matches) {
    let container2 = postcss$5.root({ nodes: [rule2.clone()] });
    container2.walkRules((r2) => {
      if (isInKeyframes(r2)) {
        return;
      }
      let ast = selectorParser4().astSync(r2.selector);
      ast.each((sel) => eliminateIrrelevantSelectors(sel, classCandidate));
      updateAllClasses(
        ast,
        (className3) => className3 === classCandidate ? `!${className3}` : className3
      );
      r2.selector = ast.toString();
      r2.walkDecls((d) => d.important = true);
    });
    result2.push([{ ...meta, important: true }, container2.nodes[0]]);
  }
  return result2;
}
function applyVariant(variant, matches, context) {
  var _a;
  if (matches.length === 0) {
    return matches;
  }
  let args = { modifier: null, value: NONE };
  {
    let [baseVariant, ...modifiers] = splitAtTopLevelOnly(variant, "/");
    if (modifiers.length > 1) {
      baseVariant = baseVariant + "/" + modifiers.slice(0, -1).join("/");
      modifiers = modifiers.slice(-1);
    }
    if (modifiers.length && !context.variantMap.has(variant)) {
      variant = baseVariant;
      args.modifier = modifiers[0];
      if (!flagEnabled(context.tailwindConfig, "generalizedModifiers")) {
        return [];
      }
    }
  }
  if (variant.endsWith("]") && !variant.startsWith("[")) {
    let match = /(.)(-?)\[(.*)\]/g.exec(variant);
    if (match) {
      let [, char, separator, value2] = match;
      if (char === "@" && separator === "-")
        return [];
      if (char !== "@" && separator === "")
        return [];
      variant = variant.replace(`${separator}[${value2}]`, "");
      args.value = value2;
    }
  }
  if (isArbitraryValue2(variant) && !context.variantMap.has(variant)) {
    let sort = context.offsets.recordVariant(variant);
    let selector3 = normalize(variant.slice(1, -1));
    let selectors2 = splitAtTopLevelOnly(selector3, ",");
    if (selectors2.length > 1) {
      return [];
    }
    if (!selectors2.every(isValidVariantFormatString)) {
      return [];
    }
    let records = selectors2.map((sel, idx) => [
      context.offsets.applyParallelOffset(sort, idx),
      parseVariant(sel.trim())
    ]);
    context.variantMap.set(variant, records);
  }
  if (context.variantMap.has(variant)) {
    let isArbitraryVariant = isArbitraryValue2(variant);
    let internalFeatures = ((_a = context.variantOptions.get(variant)) == null ? void 0 : _a[INTERNAL_FEATURES]) ?? {};
    let variantFunctionTuples = context.variantMap.get(variant).slice();
    let result2 = [];
    let respectPrefix = (() => {
      if (isArbitraryVariant)
        return false;
      if (internalFeatures.respectPrefix === false)
        return false;
      return true;
    })();
    for (let [meta, rule2] of matches) {
      if (meta.layer === "user") {
        continue;
      }
      let container2 = postcss$5.root({ nodes: [rule2.clone()] });
      for (let [variantSort, variantFunction, containerFromArray] of variantFunctionTuples) {
        let prepareBackup = function() {
          if (clone.raws.neededBackup) {
            return;
          }
          clone.raws.neededBackup = true;
          clone.walkRules((rule22) => rule22.raws.originalSelector = rule22.selector);
        }, modifySelectors = function(modifierFunction) {
          prepareBackup();
          clone.each((rule22) => {
            if (rule22.type !== "rule") {
              return;
            }
            rule22.selectors = rule22.selectors.map((selector3) => {
              return modifierFunction({
                get className() {
                  return getClassNameFromSelector(selector3);
                },
                selector: selector3
              });
            });
          });
          return clone;
        };
        let clone = (containerFromArray ?? container2).clone();
        let collectedFormats = [];
        let ruleWithVariant = variantFunction({
          get container() {
            prepareBackup();
            return clone;
          },
          separator: context.tailwindConfig.separator,
          modifySelectors,
          wrap(wrapper) {
            let nodes = clone.nodes;
            clone.removeAll();
            wrapper.append(nodes);
            clone.append(wrapper);
          },
          format(selectorFormat) {
            collectedFormats.push({
              format: selectorFormat,
              respectPrefix
            });
          },
          args
        });
        if (Array.isArray(ruleWithVariant)) {
          for (let [idx, variantFunction2] of ruleWithVariant.entries()) {
            variantFunctionTuples.push([
              context.offsets.applyParallelOffset(variantSort, idx),
              variantFunction2,
              clone.clone()
            ]);
          }
          continue;
        }
        if (typeof ruleWithVariant === "string") {
          collectedFormats.push({
            format: ruleWithVariant,
            respectPrefix
          });
        }
        if (ruleWithVariant === null) {
          continue;
        }
        if (clone.raws.neededBackup) {
          delete clone.raws.neededBackup;
          clone.walkRules((rule22) => {
            let before = rule22.raws.originalSelector;
            if (!before)
              return;
            delete rule22.raws.originalSelector;
            if (before === rule22.selector)
              return;
            let modified = rule22.selector;
            let rebuiltBase = selectorParser4((selectors2) => {
              selectors2.walkClasses((classNode) => {
                classNode.value = `${variant}${context.tailwindConfig.separator}${classNode.value}`;
              });
            }).processSync(before);
            collectedFormats.push({
              format: modified.replace(rebuiltBase, "&"),
              respectPrefix
            });
            rule22.selector = before;
          });
        }
        clone.nodes[0].raws.tailwind = { ...clone.nodes[0].raws.tailwind, parentLayer: meta.layer };
        let withOffset = [
          {
            ...meta,
            sort: context.offsets.applyVariantOffset(
              meta.sort,
              variantSort,
              Object.assign(args, context.variantOptions.get(variant))
            ),
            collectedFormats: (meta.collectedFormats ?? []).concat(collectedFormats)
          },
          clone.nodes[0]
        ];
        result2.push(withOffset);
      }
    }
    return result2;
  }
  return [];
}
function parseRules(rule2, cache2, options = {}) {
  if (!isPlainObject(rule2) && !Array.isArray(rule2)) {
    return [[rule2], options];
  }
  if (Array.isArray(rule2)) {
    return parseRules(rule2[0], cache2, rule2[1]);
  }
  if (!cache2.has(rule2)) {
    cache2.set(rule2, parseObjectStyles(rule2));
  }
  return [cache2.get(rule2), options];
}
var IS_VALID_PROPERTY_NAME = /^[a-z_-]/;
function isValidPropName(name) {
  return IS_VALID_PROPERTY_NAME.test(name);
}
function looksLikeUri(declaration2) {
  if (!declaration2.includes("://")) {
    return false;
  }
  try {
    const url2 = new URL(declaration2);
    return url2.scheme !== "" && url2.host !== "";
  } catch (err) {
    return false;
  }
}
function isParsableNode(node2) {
  let isParsable = true;
  node2.walkDecls((decl2) => {
    if (!isParsableCssValue(decl2.prop, decl2.value)) {
      isParsable = false;
      return false;
    }
  });
  return isParsable;
}
function isParsableCssValue(property, value2) {
  if (looksLikeUri(`${property}:${value2}`)) {
    return false;
  }
  try {
    postcss$5.parse(`a{${property}:${value2}}`).toResult();
    return true;
  } catch (err) {
    return false;
  }
}
function extractArbitraryProperty(classCandidate, context) {
  let [, property, value2] = classCandidate.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? [];
  if (value2 === void 0) {
    return null;
  }
  if (!isValidPropName(property)) {
    return null;
  }
  if (!isSyntacticallyValidPropertyValue(value2)) {
    return null;
  }
  let normalized = normalize(value2, { property });
  if (!isParsableCssValue(property, normalized)) {
    return null;
  }
  let sort = context.offsets.arbitraryProperty();
  return [
    [
      { sort, layer: "utilities" },
      () => ({
        [asClass(classCandidate)]: {
          [property]: normalized
        }
      })
    ]
  ];
}
function* resolveMatchedPlugins(classCandidate, context) {
  if (context.candidateRuleMap.has(classCandidate)) {
    yield [context.candidateRuleMap.get(classCandidate), "DEFAULT"];
  }
  yield* function* (arbitraryPropertyRule) {
    if (arbitraryPropertyRule !== null) {
      yield [arbitraryPropertyRule, "DEFAULT"];
    }
  }(extractArbitraryProperty(classCandidate, context));
  let candidatePrefix = classCandidate;
  let negative = false;
  const twConfigPrefix = context.tailwindConfig.prefix;
  const twConfigPrefixLen = twConfigPrefix.length;
  const hasMatchingPrefix = candidatePrefix.startsWith(twConfigPrefix) || candidatePrefix.startsWith(`-${twConfigPrefix}`);
  if (candidatePrefix[twConfigPrefixLen] === "-" && hasMatchingPrefix) {
    negative = true;
    candidatePrefix = twConfigPrefix + candidatePrefix.slice(twConfigPrefixLen + 1);
  }
  if (negative && context.candidateRuleMap.has(candidatePrefix)) {
    yield [context.candidateRuleMap.get(candidatePrefix), "-DEFAULT"];
  }
  for (let [prefix3, modifier] of candidatePermutations(candidatePrefix)) {
    if (context.candidateRuleMap.has(prefix3)) {
      yield [context.candidateRuleMap.get(prefix3), negative ? `-${modifier}` : modifier];
    }
  }
}
function splitWithSeparator(input2, separator) {
  if (input2 === NOT_ON_DEMAND) {
    return [NOT_ON_DEMAND];
  }
  return splitAtTopLevelOnly(input2, separator);
}
function* recordCandidates(matches, classCandidate) {
  var _a;
  for (const match of matches) {
    match[1].raws.tailwind = {
      ...match[1].raws.tailwind,
      classCandidate,
      preserveSource: ((_a = match[0].options) == null ? void 0 : _a.preserveSource) ?? false
    };
    yield match;
  }
}
function* resolveMatches(candidate, context) {
  var _a;
  let separator = context.tailwindConfig.separator;
  let [classCandidate, ...variants] = splitWithSeparator(candidate, separator).reverse();
  let important = false;
  if (classCandidate.startsWith("!")) {
    important = true;
    classCandidate = classCandidate.slice(1);
  }
  for (let matchedPlugins of resolveMatchedPlugins(classCandidate, context)) {
    let matches = [];
    let typesByMatches = /* @__PURE__ */ new Map();
    let [plugins, modifier] = matchedPlugins;
    let isOnlyPlugin = plugins.length === 1;
    for (let [sort, plugin3] of plugins) {
      let matchesPerPlugin = [];
      if (typeof plugin3 === "function") {
        for (let ruleSet of [].concat(plugin3(modifier, { isOnlyPlugin }))) {
          let [rules, options] = parseRules(ruleSet, context.postCssNodeCache);
          for (let rule2 of rules) {
            matchesPerPlugin.push([{ ...sort, options: { ...sort.options, ...options } }, rule2]);
          }
        }
      } else if (modifier === "DEFAULT" || modifier === "-DEFAULT") {
        let ruleSet = plugin3;
        let [rules, options] = parseRules(ruleSet, context.postCssNodeCache);
        for (let rule2 of rules) {
          matchesPerPlugin.push([{ ...sort, options: { ...sort.options, ...options } }, rule2]);
        }
      }
      if (matchesPerPlugin.length > 0) {
        let matchingTypes = Array.from(
          getMatchingTypes(
            ((_a = sort.options) == null ? void 0 : _a.types) ?? [],
            modifier,
            sort.options ?? {},
            context.tailwindConfig
          )
        ).map(([_, type]) => type);
        if (matchingTypes.length > 0) {
          typesByMatches.set(matchesPerPlugin, matchingTypes);
        }
        matches.push(matchesPerPlugin);
      }
    }
    if (isArbitraryValue2(modifier)) {
      if (matches.length > 1) {
        let findFallback = function(matches2) {
          if (matches2.length === 1) {
            return matches2[0];
          }
          return matches2.find((rules) => {
            let matchingTypes = typesByMatches.get(rules);
            return rules.some(([{ options }, rule2]) => {
              if (!isParsableNode(rule2)) {
                return false;
              }
              return options.types.some(
                ({ type, preferOnConflict }) => matchingTypes.includes(type) && preferOnConflict
              );
            });
          });
        };
        let [withAny, withoutAny] = matches.reduce(
          (group, plugin3) => {
            let hasAnyType = plugin3.some(
              ([{ options }]) => options.types.some(({ type }) => type === "any")
            );
            if (hasAnyType) {
              group[0].push(plugin3);
            } else {
              group[1].push(plugin3);
            }
            return group;
          },
          [[], []]
        );
        let fallback = findFallback(withoutAny) ?? findFallback(withAny);
        if (fallback) {
          matches = [fallback];
        } else {
          let typesPerPlugin = matches.map(
            (match) => /* @__PURE__ */ new Set([...typesByMatches.get(match) ?? []])
          );
          for (let pluginTypes of typesPerPlugin) {
            for (let type of pluginTypes) {
              let removeFromOwnGroup = false;
              for (let otherGroup of typesPerPlugin) {
                if (pluginTypes === otherGroup)
                  continue;
                if (otherGroup.has(type)) {
                  otherGroup.delete(type);
                  removeFromOwnGroup = true;
                }
              }
              if (removeFromOwnGroup)
                pluginTypes.delete(type);
            }
          }
          let messages = [];
          for (let [idx, group] of typesPerPlugin.entries()) {
            for (let type of group) {
              let rules = matches[idx].map(([, rule2]) => rule2).flat().map(
                (rule2) => rule2.toString().split("\n").slice(1, -1).map((line) => line.trim()).map((x2) => `      ${x2}`).join("\n")
              ).join("\n\n");
              messages.push(
                `  Use \`${candidate.replace("[", `[${type}:`)}\` for \`${rules.trim()}\``
              );
              break;
            }
          }
          log_default.warn([
            `The class \`${candidate}\` is ambiguous and matches multiple utilities.`,
            ...messages,
            `If this is content and not a class, replace it with \`${candidate.replace("[", "&lsqb;").replace("]", "&rsqb;")}\` to silence this warning.`
          ]);
          continue;
        }
      }
      matches = matches.map((list2) => list2.filter((match) => isParsableNode(match[1])));
    }
    matches = matches.flat();
    matches = Array.from(recordCandidates(matches, classCandidate));
    matches = applyPrefix(matches, context);
    if (important) {
      matches = applyImportant(matches, classCandidate);
    }
    for (let variant of variants) {
      matches = applyVariant(variant, matches, context);
    }
    for (let match of matches) {
      match[1].raws.tailwind = { ...match[1].raws.tailwind, candidate };
      match = applyFinalFormat(match, { context, candidate });
      if (match === null) {
        continue;
      }
      yield match;
    }
  }
}
function applyFinalFormat(match, { context, candidate }) {
  if (!match[0].collectedFormats) {
    return match;
  }
  let isValid = true;
  let finalFormat;
  try {
    finalFormat = formatVariantSelector(match[0].collectedFormats, {
      context,
      candidate
    });
  } catch {
    return null;
  }
  let container2 = postcss$5.root({ nodes: [match[1].clone()] });
  container2.walkRules((rule2) => {
    if (inKeyframes(rule2)) {
      return;
    }
    try {
      let selector3 = finalizeSelector(rule2.selector, finalFormat, {
        candidate,
        context
      });
      if (selector3 === null) {
        rule2.remove();
        return;
      }
      rule2.selector = selector3;
    } catch {
      isValid = false;
      return false;
    }
  });
  if (!isValid) {
    return null;
  }
  if (container2.nodes.length === 0) {
    return null;
  }
  match[1] = container2.nodes[0];
  return match;
}
function inKeyframes(rule2) {
  return rule2.parent && rule2.parent.type === "atrule" && rule2.parent.name === "keyframes";
}
function getImportantStrategy(important) {
  if (important === true) {
    return (rule2) => {
      if (inKeyframes(rule2)) {
        return;
      }
      rule2.walkDecls((d) => {
        if (d.parent.type === "rule" && !inKeyframes(d.parent)) {
          d.important = true;
        }
      });
    };
  }
  if (typeof important === "string") {
    return (rule2) => {
      if (inKeyframes(rule2)) {
        return;
      }
      rule2.selectors = rule2.selectors.map((selector3) => {
        return applyImportantSelector(selector3, important);
      });
    };
  }
}
function generateRules(candidates, context, isSorting = false) {
  let allRules = [];
  let strategy = getImportantStrategy(context.tailwindConfig.important);
  for (let candidate of candidates) {
    if (context.notClassCache.has(candidate)) {
      continue;
    }
    if (context.candidateRuleCache.has(candidate)) {
      allRules = allRules.concat(Array.from(context.candidateRuleCache.get(candidate)));
      continue;
    }
    let matches = Array.from(resolveMatches(candidate, context));
    if (matches.length === 0) {
      context.notClassCache.add(candidate);
      continue;
    }
    context.classCache.set(candidate, matches);
    let rules = context.candidateRuleCache.get(candidate) ?? /* @__PURE__ */ new Set();
    context.candidateRuleCache.set(candidate, rules);
    for (const match of matches) {
      let [{ sort, options }, rule2] = match;
      if (options.respectImportant && strategy) {
        let container2 = postcss$5.root({ nodes: [rule2.clone()] });
        container2.walkRules(strategy);
        rule2 = container2.nodes[0];
      }
      let newEntry = [sort, isSorting ? rule2.clone() : rule2];
      rules.add(newEntry);
      context.ruleCache.add(newEntry);
      allRules.push(newEntry);
    }
  }
  return allRules;
}
function isArbitraryValue2(input2) {
  return input2.startsWith("[") && input2.endsWith("]");
}
function cloneNodes(nodes, source = void 0, raws = void 0) {
  return nodes.map((node2) => {
    let cloned = node2.clone();
    if (raws !== void 0) {
      cloned.raws.tailwind = {
        ...cloned.raws.tailwind,
        ...raws
      };
    }
    if (source !== void 0) {
      traverse(cloned, (node22) => {
        var _a;
        let shouldPreserveSource = ((_a = node22.raws.tailwind) == null ? void 0 : _a.preserveSource) === true && node22.source;
        if (shouldPreserveSource) {
          return false;
        }
        node22.source = source;
      });
    }
    return cloned;
  });
}
function traverse(node2, onNode) {
  var _a;
  if (onNode(node2) !== false) {
    (_a = node2.each) == null ? void 0 : _a.call(node2, (child) => traverse(child, onNode));
  }
}
var REGEX_SPECIAL = /[\\^$.*+?()[\]{}|]/g;
var REGEX_HAS_SPECIAL = RegExp(REGEX_SPECIAL.source);
function toSource(source) {
  source = Array.isArray(source) ? source : [source];
  source = source.map((item) => item instanceof RegExp ? item.source : item);
  return source.join("");
}
function pattern(source) {
  return new RegExp(toSource(source), "g");
}
function any(sources) {
  return `(?:${sources.map(toSource).join("|")})`;
}
function optional(source) {
  return `(?:${toSource(source)})?`;
}
function escape(string3) {
  return string3 && REGEX_HAS_SPECIAL.test(string3) ? string3.replace(REGEX_SPECIAL, "\\$&") : string3 || "";
}
function defaultExtractor(context) {
  let patterns = Array.from(buildRegExps(context));
  return (content) => {
    let results = [];
    for (let pattern2 of patterns) {
      for (let result2 of content.match(pattern2) ?? []) {
        results.push(clipAtBalancedParens(result2));
      }
    }
    return results;
  };
}
function* buildRegExps(context) {
  let separator = context.tailwindConfig.separator;
  let prefix3 = context.tailwindConfig.prefix !== "" ? optional(pattern([/-?/, escape(context.tailwindConfig.prefix)])) : "";
  let utility = any([
    /\[[^\s:'"`]+:[^\s\[\]]+\]/,
    /\[[^\s:'"`\]]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
    pattern([
      any([
        /-?(?:\w+)/,
        /@(?:\w+)/
      ]),
      optional(
        any([
          pattern([
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s:\[\]]+\]/
            ]),
            /(?![{([]])/,
            /(?:\/[^\s'"`\\><$]*)?/
          ]),
          pattern([
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s\[\]]+\]/
            ]),
            /(?![{([]])/,
            /(?:\/[^\s'"`\\$]*)?/
          ]),
          /[-\/][^\s'"`\\$={><]*/
        ])
      )
    ])
  ]);
  let variantPatterns = [
    any([
      pattern([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]\/\w+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, separator]),
      pattern([/[^\s"'`\[\\]+/, separator])
    ]),
    any([
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]\/\w+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, separator]),
      pattern([/[^\s`\[\\]+/, separator])
    ])
  ];
  for (const variantPattern of variantPatterns) {
    yield pattern([
      "((?=((",
      variantPattern,
      ")+))\\2)?",
      /!?/,
      prefix3,
      utility
    ]);
  }
  yield /[^<>"'`\s.(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
}
var SPECIALS = /([\[\]'"`])([^\[\]'"`])?/g;
var ALLOWED_CLASS_CHARACTERS = /[^"'`\s<>\]]+/;
function clipAtBalancedParens(input2) {
  if (!input2.includes("-[")) {
    return input2;
  }
  let depth = 0;
  let openStringTypes = [];
  let matches = input2.matchAll(SPECIALS);
  matches = Array.from(matches).flatMap((match) => {
    const [, ...groups] = match;
    return groups.map(
      (group, idx) => Object.assign([], match, {
        index: match.index + idx,
        0: group
      })
    );
  });
  for (let match of matches) {
    let char = match[0];
    let inStringType = openStringTypes[openStringTypes.length - 1];
    if (char === inStringType) {
      openStringTypes.pop();
    } else if (char === "'" || char === '"' || char === "`") {
      openStringTypes.push(char);
    }
    if (inStringType) {
      continue;
    } else if (char === "[") {
      depth++;
      continue;
    } else if (char === "]") {
      depth--;
      continue;
    }
    if (depth < 0) {
      return input2.substring(0, match.index - 1);
    }
    if (depth === 0 && !ALLOWED_CLASS_CHARACTERS.test(char)) {
      return input2.substring(0, match.index);
    }
  }
  return input2;
}
var env2 = env;
var builtInExtractors = {
  DEFAULT: defaultExtractor
};
var builtInTransformers = {
  DEFAULT: (content) => content,
  svelte: (content) => content.replace(/(?:^|\s)class:/g, " ")
};
function getExtractor(context, fileExtension) {
  let extractors = context.tailwindConfig.content.extract;
  return extractors[fileExtension] || extractors.DEFAULT || builtInExtractors[fileExtension] || builtInExtractors.DEFAULT(context);
}
function getTransformer(tailwindConfig, fileExtension) {
  let transformers = tailwindConfig.content.transform;
  return transformers[fileExtension] || transformers.DEFAULT || builtInTransformers[fileExtension] || builtInTransformers.DEFAULT;
}
var extractorCache = /* @__PURE__ */ new WeakMap();
function getClassCandidates(content, extractor, candidates, seen) {
  if (!extractorCache.has(extractor)) {
    extractorCache.set(extractor, new import_quick_lru.default({ maxSize: 25e3 }));
  }
  for (let line of content.split("\n")) {
    line = line.trim();
    if (seen.has(line)) {
      continue;
    }
    seen.add(line);
    if (extractorCache.get(extractor).has(line)) {
      for (let match of extractorCache.get(extractor).get(line)) {
        candidates.add(match);
      }
    } else {
      let extractorMatches = extractor(line).filter((s2) => s2 !== "!*");
      let lineMatchesSet = new Set(extractorMatches);
      for (let match of lineMatchesSet) {
        candidates.add(match);
      }
      extractorCache.get(extractor).set(line, lineMatchesSet);
    }
  }
}
function buildStylesheet(rules, context) {
  let sortedRules = context.offsets.sort(rules);
  let returnValue = {
    base: /* @__PURE__ */ new Set(),
    defaults: /* @__PURE__ */ new Set(),
    components: /* @__PURE__ */ new Set(),
    utilities: /* @__PURE__ */ new Set(),
    variants: /* @__PURE__ */ new Set()
  };
  for (let [sort, rule2] of sortedRules) {
    returnValue[sort.layer].add(rule2);
  }
  return returnValue;
}
function expandTailwindAtRules(context) {
  return async (root3) => {
    let layerNodes = {
      base: null,
      components: null,
      utilities: null,
      variants: null
    };
    root3.walkAtRules((rule2) => {
      if (rule2.name === "tailwind") {
        if (Object.keys(layerNodes).includes(rule2.params)) {
          layerNodes[rule2.params] = rule2;
        }
      }
    });
    if (Object.values(layerNodes).every((n) => n === null)) {
      return root3;
    }
    let candidates = /* @__PURE__ */ new Set([...context.candidates ?? [], NOT_ON_DEMAND]);
    let seen = /* @__PURE__ */ new Set();
    env2.DEBUG && console.time("Reading changed files");
    {
      let regexParserContent = [];
      for (let item of context.changedContent) {
        let transformer = getTransformer(context.tailwindConfig, item.extension);
        let extractor = getExtractor(context, item.extension);
        regexParserContent.push([item, { transformer, extractor }]);
      }
      const BATCH_SIZE = 500;
      for (let i = 0; i < regexParserContent.length; i += BATCH_SIZE) {
        let batch = regexParserContent.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async ([{ file, content }, { transformer, extractor }]) => {
            content = file ? await fs_default.promises.readFile(file, "utf8") : content;
            getClassCandidates(transformer(content), extractor, candidates, seen);
          })
        );
      }
    }
    env2.DEBUG && console.timeEnd("Reading changed files");
    let classCacheCount = context.classCache.size;
    env2.DEBUG && console.time("Generate rules");
    env2.DEBUG && console.time("Sorting candidates");
    let sortedCandidates = new Set(
      [...candidates].sort((a, z) => {
        if (a === z)
          return 0;
        if (a < z)
          return -1;
        return 1;
      })
    );
    env2.DEBUG && console.timeEnd("Sorting candidates");
    generateRules(sortedCandidates, context);
    env2.DEBUG && console.timeEnd("Generate rules");
    env2.DEBUG && console.time("Build stylesheet");
    if (context.stylesheetCache === null || context.classCache.size !== classCacheCount) {
      context.stylesheetCache = buildStylesheet([...context.ruleCache], context);
    }
    env2.DEBUG && console.timeEnd("Build stylesheet");
    let {
      defaults: defaultNodes,
      base: baseNodes,
      components: componentNodes,
      utilities: utilityNodes,
      variants: screenNodes
    } = context.stylesheetCache;
    if (layerNodes.base) {
      layerNodes.base.before(
        cloneNodes([...baseNodes, ...defaultNodes], layerNodes.base.source, {
          layer: "base"
        })
      );
      layerNodes.base.remove();
    }
    if (layerNodes.components) {
      layerNodes.components.before(
        cloneNodes([...componentNodes], layerNodes.components.source, {
          layer: "components"
        })
      );
      layerNodes.components.remove();
    }
    if (layerNodes.utilities) {
      layerNodes.utilities.before(
        cloneNodes([...utilityNodes], layerNodes.utilities.source, {
          layer: "utilities"
        })
      );
      layerNodes.utilities.remove();
    }
    const variantNodes = Array.from(screenNodes).filter((node2) => {
      var _a;
      const parentLayer = (_a = node2.raws.tailwind) == null ? void 0 : _a.parentLayer;
      if (parentLayer === "components") {
        return layerNodes.components !== null;
      }
      if (parentLayer === "utilities") {
        return layerNodes.utilities !== null;
      }
      return true;
    });
    if (layerNodes.variants) {
      layerNodes.variants.before(
        cloneNodes(variantNodes, layerNodes.variants.source, {
          layer: "variants"
        })
      );
      layerNodes.variants.remove();
    } else if (variantNodes.length > 0) {
      root3.append(
        cloneNodes(variantNodes, root3.source, {
          layer: "variants"
        })
      );
    }
    root3.source.end = root3.source.end ?? root3.source.start;
    const hasUtilityVariants = variantNodes.some(
      (node2) => {
        var _a;
        return ((_a = node2.raws.tailwind) == null ? void 0 : _a.parentLayer) === "utilities";
      }
    );
    if (layerNodes.utilities && utilityNodes.size === 0 && !hasUtilityVariants)
      ;
    if (env2.DEBUG) {
      console.log("Potential classes: ", candidates.size);
      console.log("Active contexts: ", contextSourcesMap.size);
    }
    context.changedContent = [];
    root3.walkAtRules("layer", (rule2) => {
      if (Object.keys(layerNodes).includes(rule2.params)) {
        rule2.remove();
      }
    });
  };
}
function extractClasses(node2) {
  let groups = /* @__PURE__ */ new Map();
  let container2 = postcss$5.root({ nodes: [node2.clone()] });
  container2.walkRules((rule2) => {
    selectorParser4((selectors2) => {
      selectors2.walkClasses((classSelector) => {
        let parentSelector = classSelector.parent.toString();
        let classes2 = groups.get(parentSelector);
        if (!classes2) {
          groups.set(parentSelector, classes2 = /* @__PURE__ */ new Set());
        }
        classes2.add(classSelector.value);
      });
    }).processSync(rule2.selector);
  });
  let normalizedGroups = Array.from(groups.values(), (classes2) => Array.from(classes2));
  let classes = normalizedGroups.flat();
  return Object.assign(classes, { groups: normalizedGroups });
}
var selectorExtractor = selectorParser4();
function extractSelectors(ruleSelectors) {
  return selectorExtractor.astSync(ruleSelectors);
}
function extractBaseCandidates(candidates, separator) {
  let baseClasses = /* @__PURE__ */ new Set();
  for (let candidate of candidates) {
    baseClasses.add(candidate.split(separator).pop());
  }
  return Array.from(baseClasses);
}
function prefix2(context, selector3) {
  let prefix3 = context.tailwindConfig.prefix;
  return typeof prefix3 === "function" ? prefix3(selector3) : prefix3 + selector3;
}
function* pathToRoot(node2) {
  yield node2;
  while (node2.parent) {
    yield node2.parent;
    node2 = node2.parent;
  }
}
function shallowClone(node2, overrides = {}) {
  let children = node2.nodes;
  node2.nodes = [];
  let tmp = node2.clone(overrides);
  node2.nodes = children;
  return tmp;
}
function nestedClone(node2) {
  for (let parent of pathToRoot(node2)) {
    if (node2 === parent) {
      continue;
    }
    if (parent.type === "root") {
      break;
    }
    node2 = shallowClone(parent, {
      nodes: [node2]
    });
  }
  return node2;
}
function buildLocalApplyCache(root3, context) {
  let cache2 = /* @__PURE__ */ new Map();
  root3.walkRules((rule2) => {
    var _a;
    for (let node2 of pathToRoot(rule2)) {
      if (((_a = node2.raws.tailwind) == null ? void 0 : _a.layer) !== void 0) {
        return;
      }
    }
    let container2 = nestedClone(rule2);
    let sort = context.offsets.create("user");
    for (let className3 of extractClasses(rule2)) {
      let list2 = cache2.get(className3) || [];
      cache2.set(className3, list2);
      list2.push([
        {
          layer: "user",
          sort,
          important: false
        },
        container2
      ]);
    }
  });
  return cache2;
}
function buildApplyCache(applyCandidates, context) {
  for (let candidate of applyCandidates) {
    if (context.notClassCache.has(candidate) || context.applyClassCache.has(candidate)) {
      continue;
    }
    if (context.classCache.has(candidate)) {
      context.applyClassCache.set(
        candidate,
        context.classCache.get(candidate).map(([meta, rule2]) => [meta, rule2.clone()])
      );
      continue;
    }
    let matches = Array.from(resolveMatches(candidate, context));
    if (matches.length === 0) {
      context.notClassCache.add(candidate);
      continue;
    }
    context.applyClassCache.set(candidate, matches);
  }
  return context.applyClassCache;
}
function lazyCache(buildCacheFn) {
  let cache2 = null;
  return {
    get: (name) => {
      cache2 = cache2 || buildCacheFn();
      return cache2.get(name);
    },
    has: (name) => {
      cache2 = cache2 || buildCacheFn();
      return cache2.has(name);
    }
  };
}
function combineCaches(caches) {
  return {
    get: (name) => caches.flatMap((cache2) => cache2.get(name) || []),
    has: (name) => caches.some((cache2) => cache2.has(name))
  };
}
function extractApplyCandidates(params) {
  let candidates = params.split(/[\s\t\n]+/g);
  if (candidates[candidates.length - 1] === "!important") {
    return [candidates.slice(0, -1), true];
  }
  return [candidates, false];
}
function processApply(root3, context, localCache) {
  let applyCandidates = /* @__PURE__ */ new Set();
  let applies = [];
  root3.walkAtRules("apply", (rule2) => {
    let [candidates] = extractApplyCandidates(rule2.params);
    for (let util2 of candidates) {
      applyCandidates.add(util2);
    }
    applies.push(rule2);
  });
  if (applies.length === 0) {
    return;
  }
  let applyClassCache = combineCaches([localCache, buildApplyCache(applyCandidates, context)]);
  function replaceSelector(selector3, utilitySelectors, candidate) {
    let selectorList = extractSelectors(selector3);
    let utilitySelectorsList = extractSelectors(utilitySelectors);
    let candidateList = extractSelectors(`.${escapeClassName(candidate)}`);
    let candidateClass = candidateList.nodes[0].nodes[0];
    selectorList.each((sel) => {
      let replaced = /* @__PURE__ */ new Set();
      utilitySelectorsList.each((utilitySelector) => {
        let hasReplaced = false;
        utilitySelector = utilitySelector.clone();
        utilitySelector.walkClasses((node2) => {
          if (node2.value !== candidateClass.value) {
            return;
          }
          if (hasReplaced) {
            return;
          }
          node2.replaceWith(...sel.nodes.map((node22) => node22.clone()));
          replaced.add(utilitySelector);
          hasReplaced = true;
        });
      });
      for (let sel2 of replaced) {
        let groups = [[]];
        for (let node2 of sel2.nodes) {
          if (node2.type === "combinator") {
            groups.push(node2);
            groups.push([]);
          } else {
            let last = groups[groups.length - 1];
            last.push(node2);
          }
        }
        sel2.nodes = [];
        for (let group of groups) {
          if (Array.isArray(group)) {
            group.sort((a, b) => {
              if (a.type === "tag" && b.type === "class") {
                return -1;
              } else if (a.type === "class" && b.type === "tag") {
                return 1;
              } else if (a.type === "class" && b.type === "pseudo" && b.value.startsWith("::")) {
                return -1;
              } else if (a.type === "pseudo" && a.value.startsWith("::") && b.type === "class") {
                return 1;
              }
              return 0;
            });
          }
          sel2.nodes = sel2.nodes.concat(group);
        }
      }
      sel.replaceWith(...replaced);
    });
    return selectorList.toString();
  }
  let perParentApplies = /* @__PURE__ */ new Map();
  for (let apply of applies) {
    let [candidates] = perParentApplies.get(apply.parent) || [[], apply.source];
    perParentApplies.set(apply.parent, [candidates, apply.source]);
    let [applyCandidates2, important] = extractApplyCandidates(apply.params);
    if (apply.parent.type === "atrule") {
      if (apply.parent.name === "screen") {
        let screenType = apply.parent.params;
        throw apply.error(
          `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${applyCandidates2.map((c) => `${screenType}:${c}`).join(" ")} instead.`
        );
      }
      throw apply.error(
        `@apply is not supported within nested at-rules like @${apply.parent.name}. You can fix this by un-nesting @${apply.parent.name}.`
      );
    }
    for (let applyCandidate of applyCandidates2) {
      if ([prefix2(context, "group"), prefix2(context, "peer")].includes(applyCandidate)) {
        throw apply.error(`@apply should not be used with the '${applyCandidate}' utility`);
      }
      if (!applyClassCache.has(applyCandidate)) {
        throw apply.error(
          `The \`${applyCandidate}\` class does not exist. If \`${applyCandidate}\` is a custom class, make sure it is defined within a \`@layer\` directive.`
        );
      }
      let rules = applyClassCache.get(applyCandidate);
      candidates.push([applyCandidate, important, rules]);
    }
  }
  for (let [parent, [candidates, atApplySource]] of perParentApplies) {
    let siblings = [];
    for (let [applyCandidate, important, rules] of candidates) {
      let potentialApplyCandidates = [
        applyCandidate,
        ...extractBaseCandidates([applyCandidate], context.tailwindConfig.separator)
      ];
      for (let [meta, node2] of rules) {
        let parentClasses = extractClasses(parent);
        let nodeClasses = extractClasses(node2);
        nodeClasses = nodeClasses.groups.filter(
          (classList) => classList.some((className3) => potentialApplyCandidates.includes(className3))
        ).flat();
        nodeClasses = nodeClasses.concat(
          extractBaseCandidates(nodeClasses, context.tailwindConfig.separator)
        );
        let intersects = parentClasses.some((selector3) => nodeClasses.includes(selector3));
        if (intersects) {
          throw node2.error(
            `You cannot \`@apply\` the \`${applyCandidate}\` utility here because it creates a circular dependency.`
          );
        }
        let root22 = postcss$5.root({ nodes: [node2.clone()] });
        root22.walk((node22) => {
          node22.source = atApplySource;
        });
        let canRewriteSelector = node2.type !== "atrule" || node2.type === "atrule" && node2.name !== "keyframes";
        if (canRewriteSelector) {
          root22.walkRules((rule2) => {
            if (!extractClasses(rule2).some((candidate) => candidate === applyCandidate)) {
              rule2.remove();
              return;
            }
            let importantSelector = typeof context.tailwindConfig.important === "string" ? context.tailwindConfig.important : null;
            let isGenerated = parent.raws.tailwind !== void 0;
            let parentSelector = isGenerated && importantSelector && parent.selector.indexOf(importantSelector) === 0 ? parent.selector.slice(importantSelector.length) : parent.selector;
            if (parentSelector === "") {
              parentSelector = parent.selector;
            }
            rule2.selector = replaceSelector(parentSelector, rule2.selector, applyCandidate);
            if (importantSelector && parentSelector !== parent.selector) {
              rule2.selector = applyImportantSelector(rule2.selector, importantSelector);
            }
            rule2.walkDecls((d) => {
              d.important = meta.important || important;
            });
            let selector3 = selectorParser4().astSync(rule2.selector);
            selector3.each((sel) => movePseudos(sel));
            rule2.selector = selector3.toString();
          });
        }
        if (!root22.nodes[0]) {
          continue;
        }
        siblings.push([meta.sort, root22.nodes[0]]);
      }
    }
    let nodes = context.offsets.sort(siblings).map((s2) => s2[1]);
    parent.after(nodes);
  }
  for (let apply of applies) {
    if (apply.parent.nodes.length > 1) {
      apply.remove();
    } else {
      apply.parent.remove();
    }
  }
  processApply(root3, context, localCache);
}
function expandApplyAtRules(context) {
  return (root3) => {
    let localCache = lazyCache(() => buildLocalApplyCache(root3, context));
    processApply(root3, context, localCache);
  };
}
var import_value_parser = __toESM(require_value_parser());
function isObject$1(input2) {
  return typeof input2 === "object" && input2 !== null;
}
function findClosestExistingPath(theme, path) {
  let parts = toPath(path);
  do {
    parts.pop();
    if (dlv2(theme, parts) !== void 0)
      break;
  } while (parts.length);
  return parts.length ? parts : void 0;
}
function pathToString(path) {
  if (typeof path === "string")
    return path;
  return path.reduce((acc, cur, i) => {
    if (cur.includes("."))
      return `${acc}[${cur}]`;
    return i === 0 ? cur : `${acc}.${cur}`;
  }, "");
}
function list(items) {
  return items.map((key) => `'${key}'`).join(", ");
}
function listKeys(obj2) {
  return list(Object.keys(obj2));
}
function validatePath(config2, path, defaultValue, themeOpts = {}) {
  const pathString = Array.isArray(path) ? pathToString(path) : path.replace(/^['"]+|['"]+$/g, "");
  const pathSegments = Array.isArray(path) ? path : toPath(pathString);
  const value2 = dlv2(config2.theme, pathSegments, defaultValue);
  if (value2 === void 0) {
    let error = `'${pathString}' does not exist in your theme config.`;
    const parentSegments = pathSegments.slice(0, -1);
    const parentValue = dlv2(config2.theme, parentSegments);
    if (isObject$1(parentValue)) {
      const validKeys = Object.keys(parentValue).filter(
        (key) => validatePath(config2, [...parentSegments, key]).isValid
      );
      const suggestion = didYouMean(pathSegments[pathSegments.length - 1], validKeys);
      if (suggestion) {
        error += ` Did you mean '${pathToString([...parentSegments, suggestion])}'?`;
      } else if (validKeys.length > 0) {
        error += ` '${pathToString(parentSegments)}' has the following valid keys: ${list(
          validKeys
        )}`;
      }
    } else {
      const closestPath = findClosestExistingPath(config2.theme, pathString);
      if (closestPath) {
        const closestValue = dlv2(config2.theme, closestPath);
        if (isObject$1(closestValue)) {
          error += ` '${pathToString(closestPath)}' has the following keys: ${listKeys(
            closestValue
          )}`;
        } else {
          error += ` '${pathToString(closestPath)}' is not an object.`;
        }
      } else {
        error += ` Your theme has the following top-level keys: ${listKeys(config2.theme)}`;
      }
    }
    return {
      isValid: false,
      error
    };
  }
  if (!(typeof value2 === "string" || typeof value2 === "number" || typeof value2 === "function" || value2 instanceof String || value2 instanceof Number || Array.isArray(value2))) {
    let error = `'${pathString}' was found but does not resolve to a string.`;
    if (isObject$1(value2)) {
      let validKeys = Object.keys(value2).filter(
        (key) => validatePath(config2, [...pathSegments, key]).isValid
      );
      if (validKeys.length) {
        error += ` Did you mean something like '${pathToString([...pathSegments, validKeys[0]])}'?`;
      }
    }
    return {
      isValid: false,
      error
    };
  }
  const [themeSection] = pathSegments;
  return {
    isValid: true,
    value: transformThemeValue(themeSection)(value2, themeOpts)
  };
}
function extractArgs(node2, vNodes, functions) {
  vNodes = vNodes.map((vNode) => resolveVNode(node2, vNode, functions));
  let args = [""];
  for (let vNode of vNodes) {
    if (vNode.type === "div" && vNode.value === ",") {
      args.push("");
    } else {
      args[args.length - 1] += import_value_parser.default.stringify(vNode);
    }
  }
  return args;
}
function resolveVNode(node2, vNode, functions) {
  if (vNode.type === "function" && functions[vNode.value] !== void 0) {
    let args = extractArgs(node2, vNode.nodes, functions);
    vNode.type = "word";
    vNode.value = functions[vNode.value](node2, ...args);
  }
  return vNode;
}
function resolveFunctions(node2, input2, functions) {
  let hasAnyFn = Object.keys(functions).some((fn) => input2.includes(`${fn}(`));
  if (!hasAnyFn)
    return input2;
  return (0, import_value_parser.default)(input2).walk((vNode) => {
    resolveVNode(node2, vNode, functions);
  }).toString();
}
var nodeTypePropertyMap = {
  atrule: "params",
  decl: "value"
};
function* toPaths(path) {
  path = path.replace(/^['"]+|['"]+$/g, "");
  let matches = path.match(/^([^\s]+)(?![^\[]*\])(?:\s*\/\s*([^\/\s]+))$/);
  let alpha = void 0;
  yield [path, void 0];
  if (matches) {
    path = matches[1];
    alpha = matches[2];
    yield [path, alpha];
  }
}
function resolvePath(config2, path, defaultValue) {
  const results = Array.from(toPaths(path)).map(([path2, alpha]) => {
    return Object.assign(validatePath(config2, path2, defaultValue, { opacityValue: alpha }), {
      resolvedPath: path2,
      alpha
    });
  });
  return results.find((result2) => result2.isValid) ?? results[0];
}
function evaluateTailwindFunctions_default(context) {
  let config2 = context.tailwindConfig;
  let functions = {
    theme: (node2, path, ...defaultValue) => {
      var _a;
      let { isValid, value: value2, error, alpha } = resolvePath(
        config2,
        path,
        defaultValue.length ? defaultValue : void 0
      );
      if (!isValid) {
        let parentNode = node2.parent;
        let candidate = (_a = parentNode == null ? void 0 : parentNode.raws.tailwind) == null ? void 0 : _a.candidate;
        if (parentNode && candidate !== void 0) {
          context.markInvalidUtilityNode(parentNode);
          parentNode.remove();
          return;
        }
        throw node2.error(error);
      }
      let maybeColor = parseColorFormat(value2);
      let isColorFunction = maybeColor !== void 0 && typeof maybeColor === "function";
      if (alpha !== void 0 || isColorFunction) {
        if (alpha === void 0) {
          alpha = 1;
        }
        value2 = withAlphaValue(maybeColor, alpha, maybeColor);
      }
      return value2;
    },
    screen: (node2, screen) => {
      screen = screen.replace(/^['"]+/g, "").replace(/['"]+$/g, "");
      let screens = normalizeScreens(config2.theme.screens);
      let screenDefinition = screens.find(({ name }) => name === screen);
      if (!screenDefinition) {
        throw node2.error(`The '${screen}' screen does not exist in your theme.`);
      }
      return buildMediaQuery(screenDefinition);
    }
  };
  return (root3) => {
    root3.walk((node2) => {
      let property = nodeTypePropertyMap[node2.type];
      if (property === void 0) {
        return;
      }
      node2[property] = resolveFunctions(node2, node2[property], functions);
    });
  };
}
function substituteScreenAtRules_default({ tailwindConfig: { theme } }) {
  return function(css) {
    css.walkAtRules("screen", (atRule2) => {
      let screen = atRule2.params;
      let screens = normalizeScreens(theme.screens);
      let screenDefinition = screens.find(({ name }) => name === screen);
      if (!screenDefinition) {
        throw atRule2.error(`No \`${screen}\` screen found.`);
      }
      atRule2.name = "media";
      atRule2.params = buildMediaQuery(screenDefinition);
    });
  };
}
var getNode = {
  id(node2) {
    return selectorParser4.attribute({
      attribute: "id",
      operator: "=",
      value: node2.value,
      quoteMark: '"'
    });
  }
};
function minimumImpactSelector(nodes) {
  let rest = nodes.filter((node22) => {
    if (node22.type !== "pseudo")
      return true;
    if (node22.nodes.length > 0)
      return true;
    return node22.value.startsWith("::") || [":before", ":after", ":first-line", ":first-letter"].includes(node22.value);
  }).reverse();
  let searchFor = /* @__PURE__ */ new Set(["tag", "class", "id", "attribute"]);
  let splitPointIdx = rest.findIndex((n) => searchFor.has(n.type));
  if (splitPointIdx === -1)
    return rest.reverse().join("").trim();
  let node2 = rest[splitPointIdx];
  let bestNode = getNode[node2.type] ? getNode[node2.type](node2) : node2;
  rest = rest.slice(0, splitPointIdx);
  let combinatorIdx = rest.findIndex((n) => n.type === "combinator" && n.value === ">");
  if (combinatorIdx !== -1) {
    rest.splice(0, combinatorIdx);
    rest.unshift(selectorParser4.universal());
  }
  return [bestNode, ...rest.reverse()].join("").trim();
}
var elementSelectorParser = selectorParser4((selectors2) => {
  return selectors2.map((s2) => {
    let nodes = s2.split((n) => n.type === "combinator" && n.value === " ").pop();
    return minimumImpactSelector(nodes);
  });
});
var cache = /* @__PURE__ */ new Map();
function extractElementSelector(selector3) {
  if (!cache.has(selector3)) {
    cache.set(selector3, elementSelectorParser.transformSync(selector3));
  }
  return cache.get(selector3);
}
function resolveDefaultsAtRules({ tailwindConfig }) {
  return (root3) => {
    let variableNodeMap = /* @__PURE__ */ new Map();
    let universals = /* @__PURE__ */ new Set();
    root3.walkAtRules("defaults", (rule2) => {
      if (rule2.nodes && rule2.nodes.length > 0) {
        universals.add(rule2);
        return;
      }
      let variable = rule2.params;
      if (!variableNodeMap.has(variable)) {
        variableNodeMap.set(variable, /* @__PURE__ */ new Set());
      }
      variableNodeMap.get(variable).add(rule2.parent);
      rule2.remove();
    });
    if (flagEnabled(tailwindConfig, "optimizeUniversalDefaults")) {
      for (let universal3 of universals) {
        let selectorGroups = /* @__PURE__ */ new Map();
        let rules = variableNodeMap.get(universal3.params) ?? [];
        for (let rule2 of rules) {
          for (let selector3 of extractElementSelector(rule2.selector)) {
            let selectorGroupName = selector3.includes(":-") || selector3.includes("::-") ? selector3 : "__DEFAULT__";
            let selectors2 = selectorGroups.get(selectorGroupName) ?? /* @__PURE__ */ new Set();
            selectorGroups.set(selectorGroupName, selectors2);
            selectors2.add(selector3);
          }
        }
        if (flagEnabled(tailwindConfig, "optimizeUniversalDefaults")) {
          if (selectorGroups.size === 0) {
            universal3.remove();
            continue;
          }
          for (let [, selectors2] of selectorGroups) {
            let universalRule = postcss$5.rule({
              source: universal3.source
            });
            universalRule.selectors = [...selectors2];
            universalRule.append(universal3.nodes.map((node2) => node2.clone()));
            universal3.before(universalRule);
          }
        }
        universal3.remove();
      }
    } else if (universals.size) {
      let universalRule = postcss$5.rule({
        selectors: ["*", "::before", "::after"]
      });
      for (let universal3 of universals) {
        universalRule.append(universal3.nodes);
        if (!universalRule.parent) {
          universal3.before(universalRule);
        }
        if (!universalRule.source) {
          universalRule.source = universal3.source;
        }
        universal3.remove();
      }
      let backdropRule = universalRule.clone({
        selectors: ["::backdrop"]
      });
      universalRule.after(backdropRule);
    }
  };
}
var comparisonMap = {
  atrule: ["name", "params"],
  rule: ["selector"]
};
var types = new Set(Object.keys(comparisonMap));
function collapseAdjacentRules() {
  function collapseRulesIn(root3) {
    let currentRule = null;
    root3.each((node2) => {
      if (!types.has(node2.type)) {
        currentRule = null;
        return;
      }
      if (currentRule === null) {
        currentRule = node2;
        return;
      }
      let properties = comparisonMap[node2.type];
      if (node2.type === "atrule" && node2.name === "font-face") {
        currentRule = node2;
      } else if (properties.every(
        (property) => (node2[property] ?? "").replace(/\s+/g, " ") === (currentRule[property] ?? "").replace(/\s+/g, " ")
      )) {
        if (node2.nodes) {
          currentRule.append(node2.nodes);
        }
        node2.remove();
      } else {
        currentRule = node2;
      }
    });
    root3.each((node2) => {
      if (node2.type === "atrule") {
        collapseRulesIn(node2);
      }
    });
  }
  return (root3) => {
    collapseRulesIn(root3);
  };
}
function collapseDuplicateDeclarations() {
  return (root3) => {
    root3.walkRules((node2) => {
      let seen = /* @__PURE__ */ new Map();
      let droppable = /* @__PURE__ */ new Set([]);
      let byProperty = /* @__PURE__ */ new Map();
      node2.walkDecls((decl2) => {
        if (decl2.parent !== node2) {
          return;
        }
        if (seen.has(decl2.prop)) {
          if (seen.get(decl2.prop).value === decl2.value) {
            droppable.add(seen.get(decl2.prop));
            seen.set(decl2.prop, decl2);
            return;
          }
          if (!byProperty.has(decl2.prop)) {
            byProperty.set(decl2.prop, /* @__PURE__ */ new Set());
          }
          byProperty.get(decl2.prop).add(seen.get(decl2.prop));
          byProperty.get(decl2.prop).add(decl2);
        }
        seen.set(decl2.prop, decl2);
      });
      for (let decl2 of droppable) {
        decl2.remove();
      }
      for (let declarations of byProperty.values()) {
        let byUnit = /* @__PURE__ */ new Map();
        for (let decl2 of declarations) {
          let unit = resolveUnit(decl2.value);
          if (unit === null) {
            continue;
          }
          if (!byUnit.has(unit)) {
            byUnit.set(unit, /* @__PURE__ */ new Set());
          }
          byUnit.get(unit).add(decl2);
        }
        for (let declarations2 of byUnit.values()) {
          let removableDeclarations = Array.from(declarations2).slice(0, -1);
          for (let decl2 of removableDeclarations) {
            decl2.remove();
          }
        }
      }
    });
  };
}
var UNITLESS_NUMBER = Symbol("unitless-number");
function resolveUnit(input2) {
  let result2 = /^-?\d*.?\d+([\w%]+)?$/g.exec(input2);
  if (result2) {
    return result2[1] ?? UNITLESS_NUMBER;
  }
  return null;
}
function partitionRules(root3) {
  if (!root3.walkAtRules)
    return;
  let applyParents = /* @__PURE__ */ new Set();
  root3.walkAtRules("apply", (rule2) => {
    applyParents.add(rule2.parent);
  });
  if (applyParents.size === 0) {
    return;
  }
  for (let rule2 of applyParents) {
    let nodeGroups = [];
    let lastGroup = [];
    for (let node2 of rule2.nodes) {
      if (node2.type === "atrule" && node2.name === "apply") {
        if (lastGroup.length > 0) {
          nodeGroups.push(lastGroup);
          lastGroup = [];
        }
        nodeGroups.push([node2]);
      } else {
        lastGroup.push(node2);
      }
    }
    if (lastGroup.length > 0) {
      nodeGroups.push(lastGroup);
    }
    if (nodeGroups.length === 1) {
      continue;
    }
    for (let group of [...nodeGroups].reverse()) {
      let clone = rule2.clone({ nodes: [] });
      clone.append(group);
      rule2.after(clone);
    }
    rule2.remove();
  }
}
function expandApplyAtRules2() {
  return (root3) => {
    partitionRules(root3);
  };
}
function isRoot(node2) {
  return node2.type === "root";
}
function isAtLayer(node2) {
  return node2.type === "atrule" && node2.name === "layer";
}
function detectNesting_default(_context) {
  return (root3, result2) => {
    let found = false;
    root3.walkAtRules("tailwind", (node2) => {
      if (found)
        return false;
      if (node2.parent && !(isRoot(node2.parent) || isAtLayer(node2.parent))) {
        found = true;
        node2.warn(
          result2,
          [
            "Nested @tailwind rules were detected, but are not supported.",
            "Consider using a prefix to scope Tailwind's classes: https://tailwindcss.com/docs/configuration#prefix",
            "Alternatively, use the important selector strategy: https://tailwindcss.com/docs/configuration#selector-strategy"
          ].join("\n")
        );
        return false;
      }
    });
    root3.walkRules((rule2) => {
      if (found)
        return false;
      rule2.walkRules((nestedRule) => {
        found = true;
        nestedRule.warn(
          result2,
          [
            "Nested CSS was detected, but CSS nesting has not been configured correctly.",
            "Please enable a CSS nesting plugin *before* Tailwind in your configuration.",
            "See how here: https://tailwindcss.com/docs/using-with-preprocessors#nesting"
          ].join("\n")
        );
        return false;
      });
    });
  };
}
function processTailwindFeatures(setupContext) {
  return async function(root3, result2) {
    let { tailwindDirectives, applyDirectives } = normalizeTailwindDirectives(root3);
    detectNesting_default()(root3, result2);
    expandApplyAtRules2()(root3, result2);
    let context = setupContext({
      tailwindDirectives,
      applyDirectives,
      registerDependency(dependency) {
        result2.messages.push({
          plugin: "tailwindcss",
          parent: result2.opts.from,
          ...dependency
        });
      },
      createContext(tailwindConfig, changedContent) {
        return createContext(tailwindConfig, changedContent, root3);
      }
    })(root3, result2);
    if (context.tailwindConfig.separator === "-") {
      throw new Error(
        "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
      );
    }
    issueFlagNotices(context.tailwindConfig);
    await expandTailwindAtRules(context)(root3, result2);
    expandApplyAtRules2()(root3, result2);
    expandApplyAtRules(context)(root3, result2);
    evaluateTailwindFunctions_default(context)(root3, result2);
    substituteScreenAtRules_default(context)(root3, result2);
    resolveDefaultsAtRules(context)(root3, result2);
    collapseAdjacentRules()(root3, result2);
    collapseDuplicateDeclarations()(root3, result2);
  };
}
var corePluginList_default = ["preflight", "container", "accessibility", "pointerEvents", "visibility", "position", "inset", "isolation", "zIndex", "order", "gridColumn", "gridColumnStart", "gridColumnEnd", "gridRow", "gridRowStart", "gridRowEnd", "float", "clear", "margin", "boxSizing", "lineClamp", "display", "aspectRatio", "size", "height", "maxHeight", "minHeight", "width", "minWidth", "maxWidth", "flex", "flexShrink", "flexGrow", "flexBasis", "tableLayout", "captionSide", "borderCollapse", "borderSpacing", "transformOrigin", "translate", "rotate", "skew", "scale", "transform", "animation", "cursor", "touchAction", "userSelect", "resize", "scrollSnapType", "scrollSnapAlign", "scrollSnapStop", "scrollMargin", "scrollPadding", "listStylePosition", "listStyleType", "listStyleImage", "appearance", "columns", "breakBefore", "breakInside", "breakAfter", "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateColumns", "gridTemplateRows", "flexDirection", "flexWrap", "placeContent", "placeItems", "alignContent", "alignItems", "justifyContent", "justifyItems", "gap", "space", "divideWidth", "divideStyle", "divideColor", "divideOpacity", "placeSelf", "alignSelf", "justifySelf", "overflow", "overscrollBehavior", "scrollBehavior", "textOverflow", "hyphens", "whitespace", "textWrap", "wordBreak", "borderRadius", "borderWidth", "borderStyle", "borderColor", "borderOpacity", "backgroundColor", "backgroundOpacity", "backgroundImage", "gradientColorStops", "boxDecorationBreak", "backgroundSize", "backgroundAttachment", "backgroundClip", "backgroundPosition", "backgroundRepeat", "backgroundOrigin", "fill", "stroke", "strokeWidth", "objectFit", "objectPosition", "padding", "textAlign", "textIndent", "verticalAlign", "fontFamily", "fontSize", "fontWeight", "textTransform", "fontStyle", "fontVariantNumeric", "lineHeight", "letterSpacing", "textColor", "textOpacity", "textDecoration", "textDecorationColor", "textDecorationStyle", "textDecorationThickness", "textUnderlineOffset", "fontSmoothing", "placeholderColor", "placeholderOpacity", "caretColor", "accentColor", "opacity", "backgroundBlendMode", "mixBlendMode", "boxShadow", "boxShadowColor", "outlineStyle", "outlineWidth", "outlineOffset", "outlineColor", "ringWidth", "ringColor", "ringOpacity", "ringOffsetWidth", "ringOffsetColor", "blur", "brightness", "contrast", "dropShadow", "grayscale", "hueRotate", "invert", "saturate", "sepia", "filter", "backdropBlur", "backdropBrightness", "backdropContrast", "backdropGrayscale", "backdropHueRotate", "backdropInvert", "backdropOpacity", "backdropSaturate", "backdropSepia", "backdropFilter", "transitionProperty", "transitionDelay", "transitionDuration", "transitionTimingFunction", "willChange", "content", "forcedColorAdjust"];
function configurePlugins_default(pluginConfig, plugins) {
  if (pluginConfig === void 0) {
    return plugins;
  }
  const pluginNames = Array.isArray(pluginConfig) ? pluginConfig : [
    ...new Set(
      plugins.filter((pluginName) => {
        return pluginConfig !== false && pluginConfig[pluginName] !== false;
      }).concat(
        Object.keys(pluginConfig).filter((pluginName) => {
          return pluginConfig[pluginName] !== false;
        })
      )
    )
  ];
  return pluginNames;
}
var colors_default = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b"
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09"
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a"
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006"
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05"
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b"
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764"
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e"
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
  },
  get lightBlue() {
    return this.sky;
  },
  get warmGray() {
    return this.stone;
  },
  get trueGray() {
    return this.neutral;
  },
  get coolGray() {
    return this.gray;
  },
  get blueGray() {
    return this.slate;
  }
};
function defaults2(target, ...sources) {
  var _a, _b;
  for (let source of sources) {
    for (let k in source) {
      if (!((_a = target == null ? void 0 : target.hasOwnProperty) == null ? void 0 : _a.call(target, k))) {
        target[k] = source[k];
      }
    }
    for (let k of Object.getOwnPropertySymbols(source)) {
      if (!((_b = target == null ? void 0 : target.hasOwnProperty) == null ? void 0 : _b.call(target, k))) {
        target[k] = source[k];
      }
    }
  }
  return target;
}
function normalizeConfig(config2) {
  (() => {
    if (config2.purge) {
      return false;
    }
    if (!config2.content) {
      return false;
    }
    if (!Array.isArray(config2.content) && !(typeof config2.content === "object" && config2.content !== null)) {
      return false;
    }
    if (Array.isArray(config2.content)) {
      return config2.content.every((path) => {
        if (typeof path === "string")
          return true;
        if (typeof (path == null ? void 0 : path.raw) !== "string")
          return false;
        if ((path == null ? void 0 : path.extension) && typeof (path == null ? void 0 : path.extension) !== "string") {
          return false;
        }
        return true;
      });
    }
    if (typeof config2.content === "object" && config2.content !== null) {
      if (Object.keys(config2.content).some(
        (key) => !["files", "relative", "extract", "transform"].includes(key)
      )) {
        return false;
      }
      if (Array.isArray(config2.content.files)) {
        if (!config2.content.files.every((path) => {
          if (typeof path === "string")
            return true;
          if (typeof (path == null ? void 0 : path.raw) !== "string")
            return false;
          if ((path == null ? void 0 : path.extension) && typeof (path == null ? void 0 : path.extension) !== "string") {
            return false;
          }
          return true;
        })) {
          return false;
        }
        if (typeof config2.content.extract === "object") {
          for (let value2 of Object.values(config2.content.extract)) {
            if (typeof value2 !== "function") {
              return false;
            }
          }
        } else if (!(config2.content.extract === void 0 || typeof config2.content.extract === "function")) {
          return false;
        }
        if (typeof config2.content.transform === "object") {
          for (let value2 of Object.values(config2.content.transform)) {
            if (typeof value2 !== "function") {
              return false;
            }
          }
        } else if (!(config2.content.transform === void 0 || typeof config2.content.transform === "function")) {
          return false;
        }
        if (typeof config2.content.relative !== "boolean" && typeof config2.content.relative !== "undefined") {
          return false;
        }
      }
      return true;
    }
    return false;
  })();
  config2.safelist = (() => {
    var _a;
    let { content, purge, safelist } = config2;
    if (Array.isArray(safelist))
      return safelist;
    if (Array.isArray(content == null ? void 0 : content.safelist))
      return content.safelist;
    if (Array.isArray(purge == null ? void 0 : purge.safelist))
      return purge.safelist;
    if (Array.isArray((_a = purge == null ? void 0 : purge.options) == null ? void 0 : _a.safelist))
      return purge.options.safelist;
    return [];
  })();
  config2.blocklist = (() => {
    let { blocklist } = config2;
    if (Array.isArray(blocklist)) {
      if (blocklist.every((item) => typeof item === "string")) {
        return blocklist;
      }
    }
    return [];
  })();
  if (typeof config2.prefix === "function") {
    config2.prefix = "";
  } else {
    config2.prefix = config2.prefix ?? "";
  }
  config2.content = {
    relative: (() => {
      let { content } = config2;
      if (content == null ? void 0 : content.relative) {
        return content.relative;
      }
      return flagEnabled(config2, "relativeContentPathsByDefault");
    })(),
    files: (() => {
      let { content, purge } = config2;
      if (Array.isArray(purge))
        return purge;
      if (Array.isArray(purge == null ? void 0 : purge.content))
        return purge.content;
      if (Array.isArray(content))
        return content;
      if (Array.isArray(content == null ? void 0 : content.content))
        return content.content;
      if (Array.isArray(content == null ? void 0 : content.files))
        return content.files;
      return [];
    })(),
    extract: (() => {
      let extract = (() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        if ((_a = config2.purge) == null ? void 0 : _a.extract)
          return config2.purge.extract;
        if ((_b = config2.content) == null ? void 0 : _b.extract)
          return config2.content.extract;
        if ((_d = (_c = config2.purge) == null ? void 0 : _c.extract) == null ? void 0 : _d.DEFAULT)
          return config2.purge.extract.DEFAULT;
        if ((_f = (_e = config2.content) == null ? void 0 : _e.extract) == null ? void 0 : _f.DEFAULT)
          return config2.content.extract.DEFAULT;
        if ((_h = (_g = config2.purge) == null ? void 0 : _g.options) == null ? void 0 : _h.extractors)
          return config2.purge.options.extractors;
        if ((_j = (_i = config2.content) == null ? void 0 : _i.options) == null ? void 0 : _j.extractors)
          return config2.content.options.extractors;
        return {};
      })();
      let extractors = {};
      let defaultExtractor2 = (() => {
        var _a, _b, _c, _d;
        if ((_b = (_a = config2.purge) == null ? void 0 : _a.options) == null ? void 0 : _b.defaultExtractor) {
          return config2.purge.options.defaultExtractor;
        }
        if ((_d = (_c = config2.content) == null ? void 0 : _c.options) == null ? void 0 : _d.defaultExtractor) {
          return config2.content.options.defaultExtractor;
        }
        return void 0;
      })();
      if (defaultExtractor2 !== void 0) {
        extractors.DEFAULT = defaultExtractor2;
      }
      if (typeof extract === "function") {
        extractors.DEFAULT = extract;
      } else if (Array.isArray(extract)) {
        for (let { extensions, extractor } of extract ?? []) {
          for (let extension of extensions) {
            extractors[extension] = extractor;
          }
        }
      } else if (typeof extract === "object" && extract !== null) {
        Object.assign(extractors, extract);
      }
      return extractors;
    })(),
    transform: (() => {
      let transform = (() => {
        var _a, _b, _c, _d, _e, _f;
        if ((_a = config2.purge) == null ? void 0 : _a.transform)
          return config2.purge.transform;
        if ((_b = config2.content) == null ? void 0 : _b.transform)
          return config2.content.transform;
        if ((_d = (_c = config2.purge) == null ? void 0 : _c.transform) == null ? void 0 : _d.DEFAULT)
          return config2.purge.transform.DEFAULT;
        if ((_f = (_e = config2.content) == null ? void 0 : _e.transform) == null ? void 0 : _f.DEFAULT)
          return config2.content.transform.DEFAULT;
        return {};
      })();
      let transformers = {};
      if (typeof transform === "function") {
        transformers.DEFAULT = transform;
      }
      if (typeof transform === "object" && transform !== null) {
        Object.assign(transformers, transform);
      }
      return transformers;
    })()
  };
  for (let file of config2.content.files) {
    if (typeof file === "string" && /{([^,]*?)}/g.test(file)) {
      log_default.warn("invalid-glob-braces", [
        `The glob pattern ${dim(file)} in your Tailwind CSS configuration is invalid.`,
        `Update it to ${dim(file.replace(/{([^,]*?)}/g, "$1"))} to silence this warning.`
      ]);
      break;
    }
  }
  return config2;
}
function cloneDeep(value2) {
  if (Array.isArray(value2)) {
    return value2.map((child) => cloneDeep(child));
  }
  if (typeof value2 === "object" && value2 !== null) {
    return Object.fromEntries(Object.entries(value2).map(([k, v]) => [k, cloneDeep(v)]));
  }
  return value2;
}
function isFunction(input2) {
  return typeof input2 === "function";
}
function mergeWith(target, ...sources) {
  let customizer = sources.pop();
  for (let source of sources) {
    for (let k in source) {
      let merged = customizer(target[k], source[k]);
      if (merged === void 0) {
        if (isPlainObject(target[k]) && isPlainObject(source[k])) {
          target[k] = mergeWith({}, target[k], source[k], customizer);
        } else {
          target[k] = source[k];
        }
      } else {
        target[k] = merged;
      }
    }
  }
  return target;
}
var configUtils = {
  colors: colors_default,
  negative(scale2) {
    return Object.keys(scale2).filter((key) => scale2[key] !== "0").reduce((negativeScale, key) => {
      let negativeValue = negateValue(scale2[key]);
      if (negativeValue !== void 0) {
        negativeScale[`-${key}`] = negativeValue;
      }
      return negativeScale;
    }, {});
  },
  breakpoints(screens) {
    return Object.keys(screens).filter((key) => typeof screens[key] === "string").reduce(
      (breakpoints, key) => ({
        ...breakpoints,
        [`screen-${key}`]: screens[key]
      }),
      {}
    );
  }
};
function value(valueToResolve, ...args) {
  return isFunction(valueToResolve) ? valueToResolve(...args) : valueToResolve;
}
function collectExtends(items) {
  return items.reduce((merged, { extend }) => {
    return mergeWith(merged, extend, (mergedValue, extendValue) => {
      if (mergedValue === void 0) {
        return [extendValue];
      }
      if (Array.isArray(mergedValue)) {
        return [extendValue, ...mergedValue];
      }
      return [extendValue, mergedValue];
    });
  }, {});
}
function mergeThemes(themes) {
  return {
    ...themes.reduce((merged, theme) => defaults2(merged, theme), {}),
    extend: collectExtends(themes)
  };
}
function mergeExtensionCustomizer(merged, value2) {
  if (Array.isArray(merged) && isPlainObject(merged[0])) {
    return merged.concat(value2);
  }
  if (Array.isArray(value2) && isPlainObject(value2[0]) && isPlainObject(merged)) {
    return [merged, ...value2];
  }
  if (Array.isArray(value2)) {
    return value2;
  }
  return void 0;
}
function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    if (!isFunction(themeValue) && !extensions.some(isFunction)) {
      return mergeWith({}, themeValue, ...extensions, mergeExtensionCustomizer);
    }
    return (resolveThemePath, utils) => mergeWith(
      {},
      ...[themeValue, ...extensions].map((e) => value(e, resolveThemePath, utils)),
      mergeExtensionCustomizer
    );
  });
}
function* toPaths2(key) {
  let path = toPath(key);
  if (path.length === 0) {
    return;
  }
  yield path;
  if (Array.isArray(key)) {
    return;
  }
  let pattern2 = /^(.*?)\s*\/\s*([^/]+)$/;
  let matches = key.match(pattern2);
  if (matches !== null) {
    let [, prefix3, alpha] = matches;
    let newPath = toPath(prefix3);
    newPath.alpha = alpha;
    yield newPath;
  }
}
function resolveFunctionKeys(object2) {
  const resolvePath2 = (key, defaultValue) => {
    for (const path of toPaths2(key)) {
      let index2 = 0;
      let val = object2;
      while (val !== void 0 && val !== null && index2 < path.length) {
        val = val[path[index2++]];
        let shouldResolveAsFn = isFunction(val) && (path.alpha === void 0 || index2 <= path.length - 1);
        val = shouldResolveAsFn ? val(resolvePath2, configUtils) : val;
      }
      if (val !== void 0) {
        if (path.alpha !== void 0) {
          let normalized = parseColorFormat(val);
          return withAlphaValue(normalized, path.alpha, toColorValue(normalized));
        }
        if (isPlainObject(val)) {
          return cloneDeep(val);
        }
        return val;
      }
    }
    return defaultValue;
  };
  Object.assign(resolvePath2, {
    theme: resolvePath2,
    ...configUtils
  });
  return Object.keys(object2).reduce((resolved, key) => {
    resolved[key] = isFunction(object2[key]) ? object2[key](resolvePath2, configUtils) : object2[key];
    return resolved;
  }, {});
}
function extractPluginConfigs(configs) {
  let allConfigs = [];
  configs.forEach((config2) => {
    allConfigs = [...allConfigs, config2];
    const plugins = (config2 == null ? void 0 : config2.plugins) ?? [];
    if (plugins.length === 0) {
      return;
    }
    plugins.forEach((plugin3) => {
      if (plugin3.__isOptionsFunction) {
        plugin3 = plugin3();
      }
      allConfigs = [...allConfigs, ...extractPluginConfigs([(plugin3 == null ? void 0 : plugin3.config) ?? {}])];
    });
  });
  return allConfigs;
}
function resolveCorePlugins(corePluginConfigs) {
  const result2 = [...corePluginConfigs].reduceRight((resolved, corePluginConfig) => {
    if (isFunction(corePluginConfig)) {
      return corePluginConfig({ corePlugins: resolved });
    }
    return configurePlugins_default(corePluginConfig, resolved);
  }, corePluginList_default);
  return result2;
}
function resolvePluginLists(pluginLists) {
  const result2 = [...pluginLists].reduceRight((resolved, pluginList) => {
    return [...resolved, ...pluginList];
  }, []);
  return result2;
}
function resolveConfig(configs) {
  let allConfigs = [
    ...extractPluginConfigs(configs),
    {
      prefix: "",
      important: false,
      separator: ":"
    }
  ];
  return normalizeConfig(
    defaults2(
      {
        theme: resolveFunctionKeys(
          mergeExtensions(mergeThemes(allConfigs.map((t) => (t == null ? void 0 : t.theme) ?? {})))
        ),
        corePlugins: resolveCorePlugins(allConfigs.map((c) => c.corePlugins)),
        plugins: resolvePluginLists(configs.map((c) => (c == null ? void 0 : c.plugins) ?? []))
      },
      ...allConfigs
    )
  );
}
var import_config_full = __toESM(require_config_full());
function getAllConfigs(config2) {
  const configs = ((config2 == null ? void 0 : config2.presets) ?? [import_config_full.default]).slice().reverse().flatMap((preset) => getAllConfigs(preset instanceof Function ? preset() : preset));
  const features = {
    respectDefaultRingColorOpacity: {
      theme: {
        ringColor: ({ theme }) => ({
          DEFAULT: "#3b82f67f",
          ...theme("colors")
        })
      }
    },
    disableColorOpacityUtilitiesByDefault: {
      corePlugins: {
        backgroundOpacity: false,
        borderOpacity: false,
        divideOpacity: false,
        placeholderOpacity: false,
        ringOpacity: false,
        textOpacity: false
      }
    }
  };
  const experimentals = Object.keys(features).filter((feature) => flagEnabled(config2, feature)).map((feature) => features[feature]);
  return [config2, ...experimentals, ...configs];
}
function resolveConfig2(...configs) {
  let [, ...defaultConfigs] = getAllConfigs(configs[0]);
  return resolveConfig([...configs, ...defaultConfigs]);
}
var createTailwindcss = ({ tailwindConfig } = {}) => {
  let currentTailwindConfig = tailwindConfig;
  return {
    setTailwindConfig(newTailwindConfig) {
      currentTailwindConfig = newTailwindConfig;
    },
    async generateStylesFromContent(css, content) {
      const tailwindcssPlugin = createTailwindcssPlugin({ tailwindConfig: currentTailwindConfig, content });
      const processor2 = postcss$5([tailwindcssPlugin]);
      const result2 = await processor2.process(css, { from: void 0 });
      return result2.css;
    }
  };
};
var createTailwindcssPlugin = ({ tailwindConfig, content: contentCollection }) => {
  const config2 = resolveConfig2(tailwindConfig ?? {});
  const tailwindcssPlugin = processTailwindFeatures(
    (processOptions) => () => processOptions.createContext(
      config2,
      contentCollection.map((content) => typeof content === "string" ? { content } : content)
    )
  );
  return tailwindcssPlugin;
};
const isObject = (value2) => {
  return !!value2 && value2.constructor === Object;
};
function memoize(func, options = {}) {
  const cache2 = /* @__PURE__ */ new Map();
  const { maxCacheSize = Infinity, ttl = Infinity } = options;
  const memoized = function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    if (cache2.has(key)) {
      const cached = cache2.get(key);
      if (now - cached.timestamp <= ttl) {
        return cached.value;
      } else {
        cache2.delete(key);
      }
    }
    const result2 = func.apply(this, args);
    cache2.set(key, { value: result2, timestamp: now });
    if (cache2.size > maxCacheSize) {
      const oldestKey = cache2.keys().next().value;
      cache2.delete(oldestKey);
    }
    return result2;
  };
  memoized.cache = cache2;
  return memoized;
}
const hyphenToCamelCase = (str2) => str2.replace(
  /([-_][a-z])/gi,
  (group) => group.toUpperCase().replace("-", "").replace("_", "")
);
function camelCaseToHyphen(str2) {
  return str2.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
async function compileTailwindCss(css, tailwindConfig) {
  const tailwind = createTailwindcss({
    tailwindConfig
  });
  return await tailwind.generateStylesFromContent(css, [""]);
}
const COLOR_NAMES = {
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
};
const ABSOLUTE_LENGTH_UNITS = ["px", "cm", "mm", "Q", "in", "pc", "pt"];
const RELATIVE_LENGTH_UNITS = [
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
];
const LENGTH_UNITS = [
  ...ABSOLUTE_LENGTH_UNITS,
  ...RELATIVE_LENGTH_UNITS
];
const TIME_UNITS = ["s", "ms"];
const ANGLE_UNITS = ["deg", "rad", "grad", "turn"];
const PERCENTAGE_UNITS = ["%"];
const RESOLUTION_UNITS = ["dpi", "dpcm", "dppx", "cqw"];
const STYLE_NAMES = [
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
];
const valueUnitValueOf = (value2) => {
  if (value2 instanceof ValueUnit) {
    return [void 0, [value2.valueOf()]];
  } else if (Array.isArray(value2)) {
    return [void 0, value2.map((v) => v.valueOf())];
  } else {
    const [name, valueUnitValues] = Object.entries(value2)[0];
    return [name, valueUnitValues.map((v) => v.valueOf())];
  }
};
const flattenObject = (obj2) => {
  const flat = {};
  const flatten = (obj22, parentKey = void 0) => {
    if (Array.isArray(obj22)) {
      obj22.forEach((v, i) => flatten(v, parentKey));
    } else if (obj22 instanceof FunctionValue) {
      const newKey = parentKey ? `${parentKey}.${obj22.name}` : obj22.name;
      obj22.args.forEach((v, i) => flatten(v, newKey));
    } else if (isObject(obj22)) {
      for (const [key, value2] of Object.entries(obj22)) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        flatten(value2, currentKey);
      }
    } else {
      if (flat[parentKey]) {
        flat[parentKey].push(obj22);
      } else {
        flat[parentKey] = new ValueArray(obj22).flat();
      }
    }
  };
  flatten(obj2);
  return flat;
};
const unflattenObjectToString = (flatObj) => {
  const result2 = {};
  for (const [flatKey, values] of Object.entries(flatObj)) {
    const keys = flatKey.split(".");
    const propertyKey = keys[0];
    let current = result2[propertyKey] ?? "";
    let leftS = "";
    let rightS = "";
    for (let i = 1; i < keys.length; i++) {
      leftS += `${keys[i]}(`;
      rightS += ")";
    }
    current += ` ${leftS}${values.toString()}${rightS}`;
    result2[propertyKey] = current.trim();
  }
  return result2;
};
const setStyleNames = new Set(STYLE_NAMES);
function isCSSStyleName(value2) {
  return setStyleNames.has(value2);
}
const unpackMatrixValues = (value2) => {
  const [name, values] = valueUnitValueOf(value2);
  if (!(name == null ? void 0 : name.startsWith("matrix"))) {
    throw new Error("Input must be a matrix or matrix3d value");
  }
  const defaultValues = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skewX: 0,
    skewY: 0,
    skewZ: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspectiveX: 0,
    perspectiveY: 0,
    perspectiveZ: 0,
    perspectiveW: 1
  };
  if (name === "matrix") {
    return {
      ...defaultValues,
      scaleX: values[0] ?? 1,
      skewY: values[1] ?? 0,
      skewX: values[2] ?? 0,
      scaleY: values[3] ?? 1,
      translateX: values[4] ?? 0,
      translateY: values[5] ?? 0,
      rotateZ: Math.atan2(values[1] ?? 0, values[0] ?? 1),
      rotateY: Math.atan2(-(values[2] ?? 0), values[0] ?? 1),
      rotateX: Math.atan2(values[1] ?? 0, values[3] ?? 1)
    };
  } else if (name === "matrix3d") {
    if (values.length === 4) {
      return {
        ...defaultValues,
        translateX: values[0] ?? 0,
        translateY: values[1] ?? 0,
        translateZ: values[2] ?? 0,
        perspectiveW: values[3] ?? 1
      };
    } else if (values.length === 16) {
      return {
        scaleX: values[0] ?? 1,
        skewY: values[1] ?? 0,
        skewX: values[4] ?? 0,
        scaleY: values[5] ?? 1,
        scaleZ: values[10] ?? 1,
        skewZ: values[2] ?? 0,
        translateX: values[12] ?? 0,
        translateY: values[13] ?? 0,
        translateZ: values[14] ?? 0,
        rotateX: Math.atan2(-(values[9] ?? 0), values[10] ?? 1),
        rotateY: Math.atan2(
          values[8] ?? 0,
          Math.sqrt(
            Math.pow(values[0] ?? 1, 2) + Math.pow(values[1] ?? 0, 2)
          )
        ),
        rotateZ: Math.atan2(values[1] ?? 0, values[0] ?? 1),
        perspectiveX: values[3] ?? 0,
        perspectiveY: values[7] ?? 0,
        perspectiveZ: values[11] ?? 0,
        perspectiveW: values[15] ?? 1
      };
    }
  }
  throw new Error("Unsupported matrix type or invalid number of values");
};
function convertAbsoluteUnitToPixels(value2, unit) {
  let pixels = value2;
  if (unit === "cm") {
    pixels *= 96 / 2.54;
  } else if (unit === "mm") {
    pixels *= 96 / 25.4;
  } else if (unit === "in") {
    pixels *= 96;
  } else if (unit === "pt") {
    pixels *= 4 / 3;
  } else if (unit === "pc") {
    pixels *= 16;
  }
  return pixels;
}
function convertToPixels(value2, unit, element, property) {
  if (unit === "em" && element) {
    value2 *= parseFloat(getComputedStyle(element).fontSize);
  } else if (unit === "rem") {
    value2 *= parseFloat(getComputedStyle(document.documentElement).fontSize);
  } else if (unit === "vh") {
    value2 *= window.innerHeight / 100;
  } else if (unit === "vw") {
    value2 *= window.innerWidth / 100;
  } else if (unit === "vmin") {
    value2 *= Math.min(window.innerHeight, window.innerWidth) / 100;
  } else if (unit === "vmax") {
    value2 *= Math.max(window.innerHeight, window.innerWidth) / 100;
  } else if (unit === "%" && (element == null ? void 0 : element.parentElement) && property) {
    const parentValue = parseFloat(
      getComputedStyle(element.parentElement).getPropertyValue(property)
    );
    value2 = value2 / 100 * parentValue;
  } else if (unit === "ex" || unit === "ch") {
    value2 *= parseFloat(getComputedStyle(element).fontSize) ?? 16;
  } else {
    value2 = convertAbsoluteUnitToPixels(value2, unit);
  }
  return value2;
}
function convertToMs(value2, unit) {
  if (unit === "s") {
    value2 *= 1e3;
  }
  return value2;
}
function convertToDegrees(value2, unit) {
  if (unit === "grad") {
    value2 *= 0.9;
  } else if (unit === "rad") {
    value2 *= 180 / Math.PI;
  } else if (unit === "turn") {
    value2 *= 360;
  }
  return value2;
}
function convertToDPI(value2, unit) {
  if (unit === "dpcm") {
    value2 *= 2.54;
  } else if (unit === "dppx") {
    value2 *= 96;
  }
  return value2;
}
const istring = (str2) => P((input2, i) => {
  const s2 = input2.slice(i);
  if (s2.toLowerCase().startsWith(str2.toLowerCase())) {
    return P.makeSuccess(i + str2.length, str2);
  } else {
    return P.makeFailure(i, `Expected ${str2}`);
  }
});
const identifier = P.regexp(/-?[a-zA-Z][a-zA-Z0-9-]*/);
const none = P.string("none");
const integer = P.regexp(/-?\d+/).map(Number);
const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);
const opt = (p) => P.alt(p, P.succeed(void 0));
const createColorValueUnit = (value2, colorType) => {
  return new ValueUnit(value2, "color", ["color", colorType], void 0, "color");
};
const colorOptionalAlpha = (r2, colorType) => {
  const name = P.string(colorType).skip(opt(istring("a")));
  const optionalAlpha = P.alt(
    P.seq(r2.colorValue.skip(r2.alphaSep), r2.colorValue),
    P.seq(r2.colorValue)
  );
  const args = P.seq(
    r2.colorValue.skip(r2.sep),
    r2.colorValue.skip(r2.sep),
    optionalAlpha
  ).trim(P.optWhitespace).wrap(P.string("("), P.string(")"));
  return name.then(args).map(([x2, y, [z, a]]) => {
    return [x2, y, z, a ?? new ValueUnit(1)];
  });
};
const CSSColor = P.createLanguage({
  colorValue: () => P.alt(
    CSSValueUnit.Percentage,
    CSSValueUnit.Angle.map((x2) => {
      const deg = convertToDegrees(x2.value, x2.unit);
      return new ValueUnit(deg, "deg", ["angle"]);
    }),
    P.alt(number, integer).map((x2) => new ValueUnit(x2)),
    none.map(() => new ValueUnit(0))
  ),
  comma: () => P.string(","),
  space: () => P.regex(/\s+/),
  div: () => P.string("/"),
  sep: (r2) => P.alt(r2.comma.trim(P.optWhitespace), r2.space),
  alphaSep: (r2) => P.alt(r2.div.trim(P.optWhitespace), r2.sep),
  name: () => P.alt(
    ...Object.keys(COLOR_NAMES).sort((a, b) => b.length - a.length).map(P.string)
  ).map((x2) => {
    const c = COLOR_NAMES[x2];
    const { r: r2, g, b } = hex2rgb(c);
    return createColorValueUnit(
      {
        r: new ValueUnit(r2),
        g: new ValueUnit(g),
        b: new ValueUnit(b),
        alpha: new ValueUnit(1)
      },
      "rgb"
    );
  }),
  hex: () => P.regexp(/#[0-9a-fA-F]{3,8}/).map((x2) => {
    const { r: r2, g, b, alpha } = hex2rgb(x2);
    return createColorValueUnit(
      {
        r: new ValueUnit(r2),
        g: new ValueUnit(g),
        b: new ValueUnit(b),
        alpha: new ValueUnit(alpha)
      },
      "rgb"
    );
  }),
  kelvin: () => number.skip(istring("k")).map((x2) => {
    const { r: r2, g, b } = kelvin2rgb(x2);
    return createColorValueUnit(
      {
        r: new ValueUnit(r2),
        g: new ValueUnit(g),
        b: new ValueUnit(b),
        alpha: new ValueUnit(1)
      },
      "rgb"
    );
  }),
  rgb: (r2) => colorOptionalAlpha(r2, "rgb").map(
    ([r22, g, b, alpha]) => createColorValueUnit({ r: r22, g, b, alpha }, "rgb")
  ),
  hsl: (r2) => colorOptionalAlpha(r2, "hsl").map(
    ([h, s2, l, alpha]) => createColorValueUnit({ h, s: s2, l, alpha }, "hsl")
  ),
  hsv: (r2) => colorOptionalAlpha(r2, "hsv").map(([h, s2, v, alpha]) => {
    return createColorValueUnit({ h, s: s2, v, alpha }, "hsl");
  }),
  hwb: (r2) => colorOptionalAlpha(r2, "hwb").map(
    ([h, w, b, alpha]) => createColorValueUnit({ h, w, b, alpha }, "hsl")
  ),
  lab: (r2) => colorOptionalAlpha(r2, "lab").map(
    ([l, a, b, alpha]) => createColorValueUnit({ l, a, b, alpha }, "lab")
  ),
  lch: (r2) => colorOptionalAlpha(r2, "lch").map(
    ([l, c, h, alpha]) => createColorValueUnit({ l, c, h, alpha }, "lch")
  ),
  oklab: (r2) => colorOptionalAlpha(r2, "oklab").map(
    ([l, a, b, alpha]) => createColorValueUnit({ l, a, b, alpha }, "oklab")
  ),
  oklch: (r2) => colorOptionalAlpha(r2, "oklch").map(
    ([l, c, h, alpha]) => createColorValueUnit({ l, c, h, alpha }, "oklch")
  ),
  xyz: (r2) => colorOptionalAlpha(r2, "xyz").map(
    ([x2, y, z, alpha]) => createColorValueUnit({ x: x2, y, z, alpha }, "xyz")
  ),
  Value: (r2) => P.alt(
    r2.hex,
    r2.kelvin,
    r2.rgb,
    r2.hsl,
    r2.hsv,
    r2.hwb,
    r2.lab,
    r2.lch,
    r2.oklab,
    r2.oklch,
    r2.xyz,
    r2.name
  ).trim(P.optWhitespace)
});
const CSSValueUnit = P.createLanguage({
  lengthUnit: () => P.alt(...LENGTH_UNITS.map(istring)),
  angleUnit: () => P.alt(...ANGLE_UNITS.map(istring)),
  timeUnit: () => P.alt(...TIME_UNITS.map(istring)),
  resolutionUnit: () => P.alt(...RESOLUTION_UNITS.map(istring)),
  percentageUnit: () => P.alt(...PERCENTAGE_UNITS.map(istring)),
  comma: () => P.string(","),
  space: () => P.string(" "),
  sep: (r2) => r2.comma.or(r2.space).trim(P.optWhitespace),
  Length: (r2) => P.seq(number, r2.lengthUnit).map(([value2, unit]) => {
    let superType = ["length"];
    if (RELATIVE_LENGTH_UNITS.includes(unit)) {
      superType.push("relative");
    } else if (ABSOLUTE_LENGTH_UNITS.includes(unit)) {
      superType.push("absolute");
    }
    return new ValueUnit(value2, unit, superType);
  }),
  Angle: (r2) => P.seq(number, r2.angleUnit).map(([value2, unit]) => {
    return new ValueUnit(value2, unit, ["angle"]);
  }),
  Time: (r2) => P.seq(number, r2.timeUnit).map(([value2, unit]) => {
    return new ValueUnit(value2, unit, ["time"]);
  }),
  TimePercentage: (r2) => P.alt(r2.Percentage, r2.Time),
  Resolution: (r2) => P.seq(number, r2.resolutionUnit).map(([value2, unit]) => {
    return new ValueUnit(value2, unit, ["resolution"]);
  }),
  Percentage: (r2) => P.alt(
    P.seq(number, r2.percentageUnit),
    istring("from").map(() => [0, "%"]),
    istring("to").map(() => [100, "%"])
  ).map(([value2, unit]) => {
    return new ValueUnit(value2, unit, ["percentage"]);
  }),
  Color: (r2) => CSSColor.Value,
  Slash: () => P.string("/").trim(P.optWhitespace).map(() => new ValueUnit("/", "string")),
  Value: (r2) => P.alt(
    r2.Length,
    r2.Angle,
    r2.Time,
    r2.Resolution,
    r2.Percentage,
    r2.Color,
    r2.Slash,
    number.map((x2) => new ValueUnit(x2)),
    none.map(() => new ValueUnit(0))
  ).trim(P.optWhitespace)
});
function parseCSSValueUnit(input2) {
  return CSSValueUnit.Value.tryParse(input2);
}
const handleFunc = (r2, name) => {
  return P.seq(
    name ? name : identifier,
    r2.FunctionArgs.wrap(r2.lparen, r2.rparen)
  );
};
const handleVar = (r2) => {
  return P.string("var").then(r2.String.trim(r2.ws).wrap(r2.lparen, r2.rparen)).map((value2) => {
    return new ValueUnit(value2, "var");
  });
};
const handleCalc = (r2) => {
  const calcContent = P.lazy(
    () => P.alt(
      P.regexp(/[^()]+/),
      calcContent.atLeast(1).wrap(r2.lparen, r2.rparen).map((nested) => `(${nested.join(" ")})`)
    ).atLeast(1)
  );
  return P.string("calc").then(
    P.alt(
      r2.Value.trim(r2.ws).wrap(r2.lparen, r2.rparen).map((v) => v),
      calcContent.wrap(r2.lparen, r2.rparen).map((parts) => parts.join(" "))
    )
  ).map((v) => {
    return v instanceof ValueUnit ? v : new ValueUnit(v, "calc");
  });
};
const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"];
const TRANSFORM_DIMENSIONS = ["x", "y", "z"];
const transformDimensions = TRANSFORM_DIMENSIONS.map(istring);
const transformFunctions = TRANSFORM_FUNCTIONS.map(istring);
const handleTransform = (r2) => {
  const nameParser = P.seq(
    P.alt(...transformFunctions),
    P.alt(...transformDimensions, P.string(""))
  );
  const makeTransformName = (name, dim2) => {
    return name + dim2.toUpperCase();
  };
  const p = handleFunc(r2, nameParser);
  return p.map(([[name, dim2], values]) => {
    name = name.toLowerCase();
    const transformObject = {};
    if (dim2) {
      const newName = name + dim2.toUpperCase();
      transformObject[newName] = values[0];
    } else if (values.length === 1) {
      TRANSFORM_DIMENSIONS.forEach((d, i) => {
        const newName = makeTransformName(name, d);
        transformObject[newName] = values[0];
      });
    } else {
      values.forEach((v, i) => {
        const newName = makeTransformName(name, TRANSFORM_DIMENSIONS[i]);
        transformObject[newName] = v;
      });
    }
    const newValues = Object.entries(transformObject).map(([k, v]) => {
      return new FunctionValue(k, [v]);
    });
    return new ValueArray(...newValues);
  });
};
const gradientDirections = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
};
const handleGradient = (r2) => {
  const name = P.alt(...["linear-gradient", "radial-gradient"].map(istring));
  const sideOrCorner = P.seq(
    P.string("to").skip(r2.ws),
    P.alt(...["left", "right", "top", "bottom"].map(istring))
  ).map(([to, direction2]) => {
    direction2 = gradientDirections[direction2.toLowerCase()];
    return new ValueUnit(direction2, "deg");
  });
  const direction = P.alt(CSSValueUnit.Angle, sideOrCorner);
  const lengthPercentage = P.alt(CSSValueUnit.Length, CSSValueUnit.Percentage);
  const linearColorStop = P.seq(
    CSSValueUnit.Color,
    P.sepBy(lengthPercentage, r2.ws)
  ).map(([color2, stops]) => {
    if (!stops) {
      return [color2];
    } else {
      return [color2, ...stops];
    }
  });
  const colorStopList = P.seq(
    linearColorStop,
    r2.comma.trim(r2.ws).then(linearColorStop.or(lengthPercentage)).many()
  ).map(([first, rest]) => {
    return [first, ...rest];
  });
  const linearGradient = P.seq(
    name,
    P.seq(opt(direction.skip(r2.comma)), colorStopList).trim(r2.ws).wrap(r2.lparen, r2.rparen).map(([direction2, stops]) => {
      if (!direction2) {
        return [stops];
      } else {
        return [direction2, ...stops].flat();
      }
    })
  ).map(([name2, values]) => {
    return new FunctionValue(name2, values);
  });
  return linearGradient;
};
const handleCubicBezier = (r2) => {
  return handleFunc(r2, P.string("cubic-bezier")).map((v) => {
    return new FunctionValue("cubic-bezier", v[1]);
  });
};
const CSSKeyframes = P.createLanguage({
  ws: () => P.optWhitespace,
  semi: () => P.string(";"),
  colon: () => P.string(":"),
  lcurly: () => P.string("{"),
  rcurly: () => P.string("}"),
  lparen: () => P.string("("),
  rparen: () => P.string(")"),
  comma: () => P.string(","),
  Rule: (r2) => P.string("@keyframes").trim(r2.ws).then(identifier),
  String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((x2) => new ValueUnit(x2)),
  FunctionArgs: (r2) => r2.Value.sepBy(r2.comma.or(r2.ws)).trim(r2.ws),
  Function: (r2) => P.alt(
    handleTransform(r2),
    handleVar(r2),
    handleCalc(r2),
    handleGradient(r2),
    handleCubicBezier(r2),
    handleFunc(r2).map(([name, values]) => {
      return new FunctionValue(name, values);
    })
  ),
  JSON: (r) => P.seq(r.lcurly, P.regexp(/[^{}]+/), r.rcurly).map((x) => {
    const s = x.join("\n");
    let obj = eval("(" + s + ")");
    return new ValueUnit(obj, "json");
  }),
  Value: (r2) => P.alt(CSSValueUnit.Value, r2.Function, r2.JSON, r2.String).trim(r2.ws),
  Values: (r2) => r2.Value.sepBy(r2.ws),
  Variables: (r2) => P.seq(
    identifier.skip(r2.colon).trim(r2.ws).map((x2) => hyphenToCamelCase(x2)),
    r2.Values.skip(r2.semi).trim(r2.ws)
  ).map(([name, values]) => {
    values = new ValueArray(...values).flat();
    values.setProperty(name);
    return {
      [name]: values
    };
  }),
  TimePercentage: (r2) => CSSValueUnit.TimePercentage.trim(r2.ws).map((v) => {
    return v.toString();
  }),
  TimePercentages: (r2) => r2.TimePercentage.sepBy(r2.comma).trim(r2.ws),
  Body: (r2) => r2.Variables.many().trim(r2.ws).wrap(r2.lcurly, r2.rcurly).map((values) => Object.assign({}, ...values)),
  Keyframe: (r2) => P.seq(r2.TimePercentages, r2.Body).map(([percents, values]) => {
    return percents.reduce((acc, percent) => {
      acc.set(percent, values);
      return acc;
    }, /* @__PURE__ */ new Map());
  }),
  Keyframes: (r2) => P.alt(
    r2.Rule.then(
      r2.Keyframe.atLeast(1).trim(r2.ws).wrap(r2.lcurly, r2.rcurly).trim(r2.ws)
    ),
    r2.Keyframe.atLeast(1).trim(r2.ws)
  ).map((keyframes) => {
    return keyframes.reduce((acc, keyframe) => {
      for (let [percent, values] of keyframe) {
        if (!acc.has(percent)) {
          acc.set(percent, values);
        } else {
          acc.set(percent, { ...acc.get(percent), ...values });
        }
      }
      return acc;
    }, /* @__PURE__ */ new Map());
  })
});
const CSSClass = P.createLanguage({
  ws: () => P.optWhitespace,
  semi: () => P.string(";"),
  colon: () => P.string(":"),
  lcurly: () => P.string("{"),
  rcurly: () => P.string("}"),
  lparen: () => P.string("("),
  rparen: () => P.string(")"),
  comma: () => P.string(","),
  dot: () => P.string("."),
  Rule: (r2) => r2.dot.trim(r2.ws).then(identifier).trim(r2.ws),
  Class: (r2) => r2.Rule.then(
    CSSKeyframes.Body.map((values) => {
      const options = {};
      for (let [key, value2] of Object.entries(values)) {
        if (key.includes("animation")) {
          const newKey = key.replace(/^animation/i, "").replace(/^\w/, (c) => c.toLowerCase());
          const newValue = camelCaseToHyphen(value2.toString());
          options[newKey] = newValue;
          delete values[key];
        }
      }
      return {
        options,
        values
      };
    })
  )
});
const CSSAnimationKeyframes = P.createLanguage({
  ws: () => P.optWhitespace,
  Value: (r2) => P.alt(
    CSSClass.Class.or(P.whitespace).map((value2) => {
      return value2;
    }),
    CSSKeyframes.Keyframes.map((value2) => {
      return {
        keyframes: value2
      };
    })
  ),
  Values: (r2) => r2.Value.sepBy(r2.ws).map((values) => {
    {
      return Object.assign({}, ...values);
    }
  })
});
const parseCSSKeyframesValue = memoize(
  (input2) => {
    return CSSKeyframes.Value.tryParse(input2);
  }
);
const parseCSSKeyframes = memoize(
  (input2) => CSSKeyframes.Keyframes.tryParse(input2)
);
memoize((input2) => {
  const { options, values, keyframes } = CSSAnimationKeyframes.Values.tryParse(input2);
  return {
    options,
    values,
    keyframes
  };
});
memoize(
  (input2) => CSSKeyframes.Percent.tryParse(String(input2))
);
memoize((input2) => {
  return CSSValueUnit.Time.map((v) => {
    if (v.unit === "ms") {
      return v.value;
    } else if (v.unit === "s") {
      return v.value * 1e3;
    } else {
      return v.value;
    }
  }).tryParse(input2);
});
memoize((time) => {
  if (time >= 5e3) {
    return `${time / 1e3}s`;
  } else {
    return `${time}ms`;
  }
});
memoize((count) => {
  if (count === Infinity) {
    return "infinite";
  } else {
    return String(count);
  }
});
const getComputedValue = memoize(
  (value2, target) => {
    if (value2.unit === "var") {
      const computed = getComputedStyle(target).getPropertyValue(
        value2.toString()
      );
      const newValue = parseCSSValueUnit(computed);
      newValue.setSubProperty(value2.subProperty);
      newValue.setProperty(value2.property);
      newValue.setTargets(value2.targets);
    }
    if (value2.unit === "calc" && value2.property && value2.subProperty && value2.value) {
      const originalValue = target.style[value2.property];
      const newValue = value2.subProperty ? `${value2.subProperty}(${value2.toString()})` : value2.toString();
      target.style[value2.property] = newValue;
      const computed = getComputedStyle(target).getPropertyValue(value2.property);
      target.style[value2.property] = originalValue;
      const p = parseCSSKeyframesValue(computed);
      const [name, values] = valueUnitValueOf(p);
      if (name == null ? void 0 : name.startsWith("matrix")) {
        const matrixValues = unpackMatrixValues(p);
        let matrixSubValue = matrixValues[value2.subProperty];
        if (matrixSubValue != null) {
          return new ValueUnit(
            matrixSubValue,
            "px",
            ["length", "absolute"],
            value2.subProperty,
            value2.property,
            value2.targets
          );
        }
      }
      return p;
    }
    return value2;
  }
);
const normalizeNumericUnits = (a, b) => {
  var _a, _b;
  if (((_a = a == null ? void 0 : a.superType) == null ? void 0 : _a[0]) !== ((_b = b == null ? void 0 : b.superType) == null ? void 0 : _b[0])) {
    return [a, b];
  }
  const convertToNormalizedUnit = (value2) => {
    var _a2, _b2;
    const superType = (_a2 = value2 == null ? void 0 : value2.superType) == null ? void 0 : _a2[0];
    switch (superType) {
      case "length":
        return {
          value: convertToPixels(value2.value, value2.unit, (_b2 = value2.targets) == null ? void 0 : _b2[0]),
          unit: "px"
        };
      case "angle":
        return {
          value: convertToDegrees(value2.value, value2.unit),
          unit: "deg"
        };
      case "time":
        return {
          value: convertToMs(value2.value, value2.unit),
          unit: "ms"
        };
      case "resolution":
        return {
          value: convertToDPI(value2.value, value2.unit),
          unit: "dpi"
        };
      default:
        return { value: value2.value, unit: value2.unit };
    }
  };
  const [newA, newB] = [convertToNormalizedUnit(a), convertToNormalizedUnit(b)];
  return [
    new ValueUnit(
      newA.value,
      newA.unit,
      a.superType,
      a.subProperty,
      a.property,
      a.targets
    ),
    new ValueUnit(
      newB.value,
      newB.unit,
      b.superType,
      b.subProperty,
      b.property,
      b.targets
    )
  ];
};
const ballAnim = (
  /*css*/
  `
    @keyframes ball {
        0% {
            background-color: theme("colors.gray.400");
            border-radius: translate(scale(0), 0) 25% / 25% 25%;
            transform: red translateX(0) translateZ(0) ;
        }
        0% {
           width: 10%;
        }
        25% {
            background-color: hsl(50% 100 50);
            border-radius: translate(scale(2), 2) 50% / 50% 50%;
        }
        100% {
            transform: translate(calc(100% - 20px), calc(50vh + 10%));   
        }
    }`
);
const BLACKLISTED_COALESCE_UNITS = ["string", "var", "calc"];
const COMPUTED_UNITS = ["var", "calc"];
function coalesceValueUnits(left, right) {
  if (!right) {
    return left;
  }
  let leftUnit = left.unit;
  let rightUnit = right.unit;
  if (BLACKLISTED_COALESCE_UNITS.includes(leftUnit) || BLACKLISTED_COALESCE_UNITS.includes(rightUnit)) {
    return left;
  }
  return new ValueUnit(
    left.value,
    leftUnit ?? rightUnit,
    left.superType ?? right.superType,
    left.subProperty ?? right.subProperty,
    left.property ?? right.property,
    left.targets ?? right.targets
  );
}
function normalizeValueUnits(left, right) {
  left = coalesceValueUnits(left, right);
  right = coalesceValueUnits(right, left);
  const out = {
    start: left.value,
    stop: right.value,
    leftValueUnit: left,
    rightValueUnit: right
  };
  if (left.unit === "string") {
    out.start = left.value;
    out.stop = left.value;
  }
  if (right.unit === "string") {
    out.start = right.value;
    out.stop = right.value;
  }
  if (left.unit === "color" && right.unit === "color") {
    const [leftCollapsed, rightCollapsed] = normalizeColorUnitsToLAB(left, right);
    out.start = leftCollapsed.value;
    out.stop = rightCollapsed.value;
    out.leftValueUnit = leftCollapsed;
    out.rightValueUnit = rightCollapsed;
  }
  if (left.unit !== right.unit) {
    const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(left, right);
    out.start = leftCollapsed.value;
    out.stop = rightCollapsed.value;
    out.leftValueUnit = leftCollapsed;
    out.rightValueUnit = rightCollapsed;
  }
  return out;
}
function lerpValue(t, value2) {
  var _a, _b;
  const { start, stop, leftValueUnit, rightValueUnit } = value2;
  if (typeof start === "number" && typeof stop === "number") {
    leftValueUnit.value = lerp(t, start, stop);
  } else if (COMPUTED_UNITS.includes(leftValueUnit.unit) || COMPUTED_UNITS.includes(rightValueUnit.unit)) {
    leftValueUnit.value = getComputedValue(start, (_a = leftValueUnit.targets) == null ? void 0 : _a[0]);
    rightValueUnit.value = getComputedValue(stop, (_b = rightValueUnit.targets) == null ? void 0 : _b[0]);
    leftValueUnit.value = lerp(t, leftValueUnit.value, rightValueUnit.value);
  } else if (leftValueUnit.unit === "color") {
    Object.keys(start).forEach((key) => {
      leftValueUnit.value[key] = lerp(t, start[key], stop[key]);
    });
  }
  return leftValueUnit;
}
function parseAndFlattenObject(input2) {
  const flat = flattenObject(input2);
  const parsedVars = Object.entries(flat).map(([key, value2]) => {
    const childKey = key.split(".").pop();
    if (value2 instanceof ValueUnit || value2 instanceof FunctionValue || value2 instanceof ValueArray) {
      return [key, value2];
    }
    const p = CSSKeyframes.FunctionArgs.map((v) => {
      if (isCSSStyleName(childKey)) {
        return v;
      } else {
        return new FunctionValue(childKey, v);
      }
    }).or(CSSKeyframes.Value).tryParse(String(value2));
    return [key, p];
  }).reduce((acc, [key, value2]) => {
    acc[key] = value2;
    return acc;
  }, {});
  return parsedVars;
}
function seekPreviousValue(ix, values, pred) {
  for (let i = ix - 1; i >= 0; i--) {
    if (pred(values[i])) {
      return i;
    }
  }
  return void 0;
}
const createInterpVarValue = (v, startIx, endIx, vars) => {
  let left = vars[startIx][v];
  let right = vars[endIx][v];
  const maxLength = Math.max(left.length, right.length);
  let newLeft = left.concat(
    Array(Math.abs(maxLength - left.length)).fill(new ValueUnit(0))
  );
  let newRight = right.concat(
    Array(Math.abs(maxLength - right.length)).fill(new ValueUnit(0))
  );
  return newLeft.map((l, i) => normalizeValueUnits(l, newRight[i]));
};
function reconcileVars(ix, vars, frames) {
  const [startVars, endVars] = [vars[ix], vars[ix + 1]];
  const interpVars = {};
  const allVars = [.../* @__PURE__ */ new Set([...Object.keys(startVars), ...Object.keys(endVars)])];
  allVars.forEach((v) => {
    if (v in startVars && v in endVars) {
      interpVars[v] = createInterpVarValue(v, ix, ix + 1, vars);
    } else if (!(v in startVars) && v in endVars) {
      const oldFrameIx = seekPreviousValue(ix, vars, (f) => v in f);
      if (oldFrameIx != null && frames[oldFrameIx] != null) {
        const oldFrame = frames[oldFrameIx];
        oldFrame.interpVars[v] = createInterpVarValue(
          v,
          oldFrameIx,
          ix + 1,
          vars
        );
      } else {
        return;
      }
    }
  });
  if (Object.keys(interpVars).length === 0) {
    return void 0;
  }
  return interpVars;
}
async function main() {
  const compiled = await compileTailwindCss(ballAnim, config$1);
  const parsed = parseCSSKeyframes(compiled);
  const vars = [];
  for (const [key, value2] of parsed.entries()) {
    const flat1 = flattenObject(value2);
    const string1 = unflattenObjectToString(flat1);
    console.log(key, flat1, string1);
    vars.push(flat1);
  }
  const frames = [];
  for (let i = 0; i < vars.length - 1; i++) {
    const interpVars = reconcileVars(i, vars, frames);
    if (interpVars == null) {
      continue;
    }
    frames.push({ interpVars });
  }
  for (const frame of frames) {
    frame.vars = Object.entries(frame.interpVars).reduce((acc, [key, value2]) => {
      acc[key] = value2.map((v) => v.leftValueUnit);
      return acc;
    }, {});
  }
  for (const frame of frames) {
    for (const [key, values] of Object.entries(frame.interpVars)) {
      const lerped = values.map((v, i) => {
        return lerpValue(0.5, v);
      });
      console.log(key, lerped);
    }
    const s2 = unflattenObjectToString(frame.vars);
    console.log(s2);
  }
  console.log(frames);
}
main();
exports.lerpValue = lerpValue;
exports.normalizeValueUnits = normalizeValueUnits;
exports.parseAndFlattenObject = parseAndFlattenObject;
exports.reconcileVars = reconcileVars;
//# sourceMappingURL=index.cjs.map
