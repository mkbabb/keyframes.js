"use strict";
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp2(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
var __publicField = (obj2, key, value) => {
  __defNormalProp(obj2, typeof key !== "symbol" ? key + "" : key, value);
  return value;
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
const COMPUTED_UNITS = ["var", "calc"];
const BLACKLISTED_COALESCE_UNITS = ["string", "var", "calc"];
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
class ValueUnit {
  constructor(value, unit, superType, subProperty, property, targets) {
    this.value = value;
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
    return this.value;
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
  coalesce(right) {
    if (right == null) {
      return this;
    }
    if (BLACKLISTED_COALESCE_UNITS.includes(this.unit)) {
      return this;
    }
    return new ValueUnit(
      this.value,
      this.unit ?? right.unit,
      this.superType ?? right.superType,
      this.subProperty ?? right.subProperty,
      this.property ?? right.property,
      this.targets ?? right.targets
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
var picocolors_browser = { exports: {} };
var x = String;
var create$2 = function() {
  return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
};
picocolors_browser.exports = create$2();
picocolors_browser.exports.createColors = create$2;
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
  showSourceCode(color) {
    if (!this.source)
      return "";
    let css = this.source;
    if (color == null)
      color = pico.isColorSupported;
    if (terminalHighlight$1) {
      if (color)
        css = terminalHighlight$1(css);
    }
    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);
    let maxWidth = String(end).length;
    let mark, aside;
    if (color) {
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
    let value;
    if (node2.type === "decl") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (node2.type === "comment") {
      value = this.raw(node2, null, "beforeComment");
    } else if (detect === "before") {
      value = this.raw(node2, null, "beforeRule");
    } else {
      value = this.raw(node2, null, "beforeClose");
    }
    let buf = node2.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value.includes("\n")) {
      let indent = this.raw(node2, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++)
          value += indent;
      }
    }
    return value;
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
    let value;
    if (!detect)
      detect = own;
    if (own) {
      value = node2.raws[own];
      if (typeof value !== "undefined")
        return value;
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
        value = this[method](root3, node2);
      } else {
        root3.walk((i) => {
          value = i.raws[own];
          if (typeof value !== "undefined")
            return false;
        });
      }
    }
    if (typeof value === "undefined")
      value = DEFAULT_RAW[detect];
    root3.rawCache[detect] = value;
    return value;
  }
  rawBeforeClose(root3) {
    let value;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== "undefined") {
          value = i.raws.after;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value)
      value = value.replace(/\S/g, "");
    return value;
  }
  rawBeforeComment(root3, node2) {
    let value;
    root3.walkComments((i) => {
      if (typeof i.raws.before !== "undefined") {
        value = i.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeDecl(root3, node2) {
    let value;
    root3.walkDecls((i) => {
      if (typeof i.raws.before !== "undefined") {
        value = i.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeRule");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeOpen(root3) {
    let value;
    root3.walk((i) => {
      if (i.type !== "decl") {
        value = i.raws.between;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawBeforeRule(root3) {
    let value;
    root3.walk((i) => {
      if (i.nodes && (i.parent !== root3 || root3.first !== i)) {
        if (typeof i.raws.before !== "undefined") {
          value = i.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value)
      value = value.replace(/\S/g, "");
    return value;
  }
  rawColon(root3) {
    let value;
    root3.walkDecls((i) => {
      if (typeof i.raws.between !== "undefined") {
        value = i.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value;
  }
  rawEmptyBody(root3) {
    let value;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawIndent(root3) {
    if (root3.raws.indent)
      return root3.raws.indent;
    let value;
    root3.walk((i) => {
      let p = i.parent;
      if (p && p !== root3 && p.parent && p.parent === root3) {
        if (typeof i.raws.before !== "undefined") {
          let parts = i.raws.before.split("\n");
          value = parts[parts.length - 1];
          value = value.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value;
  }
  rawSemicolon(root3) {
    let value;
    root3.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === "decl") {
        value = i.raws.semicolon;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawValue(node2, prop) {
    let value = node2[prop];
    let raw = node2.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw;
    }
    return value;
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
    let value = obj2[i];
    let type = typeof value;
    if (i === "parent" && type === "object") {
      if (parent)
        cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value;
    } else if (Array.isArray(value)) {
      cloned[i] = value.map((j) => cloneNode(j, cloned));
    } else {
      if (type === "object" && value !== null)
        value = cloneNode(value);
      cloned[i] = value;
    }
  }
  return cloned;
}
let Node$5 = class Node2 {
  constructor(defaults = {}) {
    this.raws = {};
    this[isClean$2] = false;
    this[my$2] = true;
    for (let name in defaults) {
      if (name === "nodes") {
        this.nodes = [];
        for (let node2 of defaults[name]) {
          if (typeof node2.clone === "function") {
            this.append(node2.clone());
          } else {
            this.append(node2);
          }
        }
      } else {
        this[name] = defaults[name];
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
      set(node2, prop, value) {
        if (node2[prop] === value)
          return true;
        node2[prop] = value;
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
      let value = this[name];
      if (Array.isArray(value)) {
        fixed[name] = value.map((i) => {
          if (typeof i === "object" && i.toJSON) {
            return i.toJSON(null, inputs);
          } else {
            return i;
          }
        });
      } else if (typeof value === "object" && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          end: value.end,
          inputId,
          start: value.start
        };
      } else {
        fixed[name] = value;
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
  constructor(defaults) {
    if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
      defaults = { ...defaults, value: String(defaults.value) };
    }
    super(defaults);
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
let { dirname: dirname$1, join } = require$$2;
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
        map = join(dirname$1(file), map);
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
      let max = lineToIndex.length - 2;
      let mid;
      while (min < max) {
        mid = min + (max - min >> 1);
        if (offset < lineToIndex[mid]) {
          max = mid - 1;
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
    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    this.memoizedURLs.set(path, url);
    return url;
  }
};
var mapGenerator = MapGenerator$2;
let Node$3 = node$1;
let Comment$5 = class Comment2 extends Node$3 {
  constructor(defaults) {
    super(defaults);
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
      set(node2, prop, value) {
        if (node2[prop] === value)
          return true;
        node2[prop] = value;
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
  constructor(defaults) {
    super({ type: "document", ...defaults });
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
const SPACE = " ".charCodeAt(0);
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
  let code, next, quote, content, escape;
  let escaped, escapePos, prev, n, currentToken;
  let length = css.length;
  let pos = 0;
  let buffer = [];
  let returned = [];
  function position() {
    return pos;
  }
  function unclosed(what) {
    throw input2.error("Unclosed " + what, pos);
  }
  function endOfFile() {
    return returned.length === 0 && pos >= length;
  }
  function nextToken(opts) {
    if (returned.length)
      return returned.pop();
    if (pos >= length)
      return;
    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
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
        if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
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
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE) {
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
    position
  };
};
let Container$6 = container$1;
let AtRule$4 = class AtRule2 extends Container$6 {
  constructor(defaults) {
    super(defaults);
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
  constructor(defaults) {
    super(defaults);
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
let list$3 = {
  comma(string3) {
    return list$3.split(string3, [","], true);
  },
  space(string3) {
    let spaces = [" ", "\n", "	"];
    return list$3.split(string3, spaces);
  },
  split(string3, separators, last) {
    let array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape = false;
    for (let letter of string3) {
      if (escape) {
        escape = false;
      } else if (letter === "\\") {
        escape = true;
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
var list_1 = list$3;
list$3.default = list$3;
let Container$4 = container$1;
let list$2 = list_1;
let Rule$4 = class Rule2 extends Container$4 {
  constructor(defaults) {
    super(defaults);
    this.type = "rule";
    if (!this.nodes)
      this.nodes = [];
  }
  get selectors() {
    return list$2.comma(this.selector);
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
        let cache = tokens.slice(0);
        let str2 = "";
        for (let j = i; j > 0; j--) {
          let type = cache[j][0];
          if (str2.trim().indexOf("!") === 0 && type !== "space") {
            break;
          }
          str2 = cache.pop()[1] + str2;
        }
        if (str2.trim().indexOf("!") === 0) {
          node2.important = true;
          node2.raws.important = str2;
          tokens = cache;
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
    let length = tokens.length;
    let value = "";
    let clean = true;
    let next, prev;
    for (let i = 0; i < length; i += 1) {
      token = tokens[i];
      type = token[0];
      if (type === "space" && i === length - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
        next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value.slice(-1) === ",") {
            clean = false;
          } else {
            value += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], "");
      node2.raws[prop] = { raw, value };
    }
    node2[prop] = value;
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
  let { inputs: ownInputs, ...defaults } = json;
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
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map((n) => fromJSON$2(n, inputs));
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source;
    defaults.source = source;
    if (inputId != null) {
      defaults.source.input = inputs[inputId];
    }
  }
  if (defaults.type === "root") {
    return new Root$2(defaults);
  } else if (defaults.type === "decl") {
    return new Declaration$2(defaults);
  } else if (defaults.type === "rule") {
    return new Rule$2(defaults);
  } else if (defaults.type === "comment") {
    return new Comment$2(defaults);
  } else if (defaults.type === "atrule") {
    return new AtRule$2(defaults);
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
let list$1 = list_1;
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
  let cache;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache)
        cache = creator();
      return cache;
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
postcss$4.list = list$1;
postcss$4.comment = (defaults) => new Comment$1(defaults);
postcss$4.atRule = (defaults) => new AtRule$1(defaults);
postcss$4.decl = (defaults) => new Declaration$1(defaults);
postcss$4.rule = (defaults) => new Rule$1(defaults);
postcss$4.root = (defaults) => new Root$1(defaults);
postcss$4.document = (defaults) => new Document$1(defaults);
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
const list = postcss$5.list;
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
  list,
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
      var value = obj2[i];
      var type = typeof value;
      if (i === "parent" && type === "object") {
        if (parent) {
          cloned[i] = parent;
        }
      } else if (value instanceof Array) {
        cloned[i] = value.map(function(j) {
          return cloneNode3(j, cloned);
        });
      } else {
        cloned[i] = cloneNode3(value, cloned);
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
    _proto.appendToPropertyAndEscape = function appendToPropertyAndEscape(name, value, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }
      var originalValue = this[name];
      var originalEscaped = this.raws[name];
      this[name] = originalValue + value;
      if (originalEscaped || valueEscaped !== value) {
        this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
      } else {
        delete this.raws[name];
      }
    };
    _proto.setPropertyAndEscape = function setPropertyAndEscape(name, value, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }
      this[name] = value;
      this.raws[name] = valueEscaped;
    };
    _proto.setPropertyWithoutEscape = function setPropertyWithoutEscape(name, value) {
      this[name] = value;
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
var types = {};
types.__esModule = true;
types.UNIVERSAL = types.TAG = types.STRING = types.SELECTOR = types.ROOT = types.PSEUDO = types.NESTING = types.ID = types.COMMENT = types.COMBINATOR = types.CLASS = types.ATTRIBUTE = void 0;
var TAG = "tag";
types.TAG = TAG;
var STRING = "string";
types.STRING = STRING;
var SELECTOR = "selector";
types.SELECTOR = SELECTOR;
var ROOT = "root";
types.ROOT = ROOT;
var PSEUDO = "pseudo";
types.PSEUDO = PSEUDO;
var NESTING = "nesting";
types.NESTING = NESTING;
var ID = "id";
types.ID = ID;
var COMMENT = "comment";
types.COMMENT = COMMENT;
var COMBINATOR = "combinator";
types.COMBINATOR = COMBINATOR;
var CLASS = "class";
types.CLASS = CLASS;
var ATTRIBUTE = "attribute";
types.ATTRIBUTE = ATTRIBUTE;
var UNIVERSAL = "universal";
types.UNIVERSAL = UNIVERSAL;
(function(module2, exports2) {
  exports2.__esModule = true;
  exports2["default"] = void 0;
  var _node = _interopRequireDefault2(nodeExports);
  var types$1 = _interopRequireWildcard(types);
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
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj2)) {
      return cache.get(obj2);
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
    if (cache) {
      cache.set(obj2, newObj);
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
        if (selector3.type === types$1.ATTRIBUTE) {
          return callback3.call(_this2, selector3);
        }
      });
    };
    _proto.walkClasses = function walkClasses(callback3) {
      var _this3 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.CLASS) {
          return callback3.call(_this3, selector3);
        }
      });
    };
    _proto.walkCombinators = function walkCombinators(callback3) {
      var _this4 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.COMBINATOR) {
          return callback3.call(_this4, selector3);
        }
      });
    };
    _proto.walkComments = function walkComments(callback3) {
      var _this5 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.COMMENT) {
          return callback3.call(_this5, selector3);
        }
      });
    };
    _proto.walkIds = function walkIds(callback3) {
      var _this6 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.ID) {
          return callback3.call(_this6, selector3);
        }
      });
    };
    _proto.walkNesting = function walkNesting(callback3) {
      var _this7 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.NESTING) {
          return callback3.call(_this7, selector3);
        }
      });
    };
    _proto.walkPseudos = function walkPseudos(callback3) {
      var _this8 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.PSEUDO) {
          return callback3.call(_this8, selector3);
        }
      });
    };
    _proto.walkTags = function walkTags(callback3) {
      var _this9 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.TAG) {
          return callback3.call(_this9, selector3);
        }
      });
    };
    _proto.walkUniversals = function walkUniversals(callback3) {
      var _this10 = this;
      return this.walk(function(selector3) {
        if (selector3.type === types$1.UNIVERSAL) {
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
  var _types2 = types;
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
  var _types2 = types;
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
var merge = function merge2(options, defaults) {
  if (!options) {
    return defaults;
  }
  var result2 = {};
  for (var key in defaults) {
    result2[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
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
  var length = string3.length;
  while (counter < length) {
    var character = string3.charAt(counter++);
    var codePoint = character.charCodeAt();
    var value = void 0;
    if (codePoint < 32 || codePoint > 126) {
      if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
        var extra = string3.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
        } else {
          counter--;
        }
      }
      value = "\\" + codePoint.toString(16).toUpperCase() + " ";
    } else {
      if (options.escapeEverything) {
        if (regexAnySingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        }
      } else if (/[\t\n\f\r\x0B]/.test(character)) {
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else if (character == "\\" || !isIdentifier2 && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier2 && regexSingleEscape.test(character)) {
        value = "\\" + character;
      } else {
        value = character;
      }
    }
    output += value;
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
  var _types2 = types;
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
  var _types2 = types;
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
  var _types2 = types;
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
    _proto.qualifiedName = function qualifiedName(value) {
      if (this.namespace) {
        return this.namespaceString + "|" + value;
      } else {
        return value;
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
  var _types2 = types;
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
  var _types2 = types;
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
  var _types2 = types;
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
  var _types2 = types;
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
  function unescapeValue(value) {
    var deprecatedUsage = false;
    var quoteMark = null;
    var unescaped = value;
    var m = unescaped.match(WRAPPED_IN_QUOTES);
    if (m) {
      quoteMark = m[1];
      unescaped = m[2];
    }
    unescaped = (0, _unesc2["default"])(unescaped);
    if (unescaped !== value) {
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
    _proto.setValue = function setValue(value, options) {
      if (options === void 0) {
        options = {};
      }
      this._value = value;
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
    _proto._handleEscapes = function _handleEscapes(prop, value) {
      if (this._constructed) {
        var escaped = (0, _cssesc["default"])(value, {
          isIdentifier: true
        });
        if (escaped !== value) {
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
      var value = this.stringifyProperty("value");
      if (name === "value") {
        return value ? count : -1;
      }
      count += value.length;
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
      set: function set(value) {
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
  var _types2 = types;
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
  var _types2 = types;
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
  var _types2 = types;
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
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj2)) {
      return cache.get(obj2);
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
    if (cache) {
      cache.set(obj2, newObj);
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
    var _css = css, length = _css.length;
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
    while (start < length) {
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
  var types$1 = _interopRequireWildcard(types);
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
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj2)) {
      return cache.get(obj2);
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
    if (cache) {
      cache.set(obj2, newObj);
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
    var value = node2[prop];
    if (typeof value !== "string") {
      return;
    }
    if (value.indexOf("\\") !== -1) {
      (0, _util.ensureObject)(node2, "raws");
      node2[prop] = (0, _util.unesc)(value);
      if (node2.raws[prop] === void 0) {
        node2.raws[prop] = value;
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
    _proto.isNamedCombinator = function isNamedCombinator(position) {
      if (position === void 0) {
        position = this.position;
      }
      return this.tokens[position + 0] && this.tokens[position + 0][_tokenize.FIELDS.TYPE] === tokens.slash && this.tokens[position + 1] && this.tokens[position + 1][_tokenize.FIELDS.TYPE] === tokens.word && this.tokens[position + 2] && this.tokens[position + 2][_tokenize.FIELDS.TYPE] === tokens.slash;
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
      if (last && last.type === types$1.PSEUDO) {
        var selector3 = new _selector2["default"]({
          source: {
            start: tokenStart(this.tokens[this.position])
          },
          sourceIndex: this.tokens[this.position][_tokenize.FIELDS.START_POS]
        });
        var cache = this.current;
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
        this.current = cache;
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
        this.splitWord(false, function(first, length) {
          pseudoStr += first;
          _this4.newNode(new _pseudo2["default"]({
            value: pseudoStr,
            source: getTokenSourceSpan(startingToken, _this4.currToken),
            sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
          }));
          if (length > 1 && _this4.nextToken && _this4.nextToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
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
        var value = word2.slice(ind, index2);
        if (i === 0 && firstCallback) {
          return firstCallback.call(_this5, value, indices.length);
        }
        var node2;
        var current2 = _this5.currToken;
        var sourceIndex = current2[_tokenize.FIELDS.START_POS] + indices[i];
        var source = getSource(current2[1], current2[2] + ind, current2[3], current2[2] + (index2 - 1));
        if (~hasClass.indexOf(ind)) {
          var classNameOpts = {
            value: value.slice(1),
            source,
            sourceIndex
          };
          node2 = new _className2["default"](unescapeProp(classNameOpts, "value"));
        } else if (~hasId.indexOf(ind)) {
          var idOpts = {
            value: value.slice(1),
            source,
            sourceIndex
          };
          node2 = new _id2["default"](unescapeProp(idOpts, "value"));
        } else {
          var tagOpts = {
            value,
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
guards.isPseudoElement = isPseudoElement;
guards.isUniversal = guards.isTag = guards.isString = guards.isSelector = guards.isRoot = void 0;
var _types = types;
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
var isRoot = isNodeType.bind(null, _types.ROOT);
guards.isRoot = isRoot;
var isSelector = isNodeType.bind(null, _types.SELECTOR);
guards.isSelector = isSelector;
var isString = isNodeType.bind(null, _types.STRING);
guards.isString = isString;
var isTag = isNodeType.bind(null, _types.TAG);
guards.isTag = isTag;
var isUniversal = isNodeType.bind(null, _types.UNIVERSAL);
guards.isUniversal = isUniversal;
function isPseudoElement(node2) {
  return isPseudo(node2) && node2.value && (node2.value.startsWith("::") || node2.value.toLowerCase() === ":before" || node2.value.toLowerCase() === ":after" || node2.value.toLowerCase() === ":first-letter" || node2.value.toLowerCase() === ":first-line");
}
function isPseudoClass(node2) {
  return isPseudo(node2) && !isPseudoElement(node2);
}
function isContainer(node2) {
  return !!(isNode(node2) && node2.walk);
}
function isNamespace(node2) {
  return isAttribute(node2) || isTag(node2);
}
(function(exports2) {
  exports2.__esModule = true;
  var _types2 = types;
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
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj2)) {
      return cache.get(obj2);
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
    if (cache) {
      cache.set(obj2, newObj);
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
var postcssNested = { exports: {} };
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
function atruleNames(defaults, custom) {
  let list2 = {};
  for (let i of defaults) {
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
postcssNested.exports = (opts = {}) => {
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
postcssNested.exports.postcss = true;
var pattern = /-(\w|$)/g;
var callback = function callback2(dashChar, char) {
  return char.toUpperCase();
};
var camelCaseCSS = function camelCaseCSS2(property) {
  property = property.toLowerCase();
  if (property === "float") {
    return "cssFloat";
  } else if (property.charCodeAt(0) === 45 && property.charCodeAt(1) === 109 && property.charCodeAt(2) === 115 && property.charCodeAt(3) === 45) {
    return property.substr(1).replace(pattern, callback);
  } else {
    return property.replace(pattern, callback);
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
      let value = child.value;
      if (!isNaN(child.value) && UNITLESS$1[name]) {
        value = parseFloat(child.value);
      }
      if (child.important)
        value += " !important";
      if (typeof result2[name] === "undefined") {
        result2[name] = value;
      } else if (Array.isArray(result2[name])) {
        result2[name].push(value);
      } else {
        result2[name] = [result2[name], value];
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
function decl(parent, name, value) {
  if (value === false || value === null)
    return;
  if (!name.startsWith("--")) {
    name = dashify(name);
  }
  if (typeof value === "number") {
    if (value === 0 || UNITLESS[name]) {
      value = value.toString();
    } else {
      value += "px";
    }
  }
  if (name === "css-float")
    name = "float";
  if (IMPORTANT.test(value)) {
    value = value.replace(IMPORTANT, "");
    parent.push(postcss$2.decl({ prop: name, value, important: true }));
  } else {
    parent.push(postcss$2.decl({ prop: name, value }));
  }
}
function atRule(parent, parts, value) {
  let node2 = postcss$2.atRule({ name: parts[1], params: parts[3] || "" });
  if (typeof value === "object") {
    node2.nodes = [];
    parse$3(value, node2);
  }
  parent.push(node2);
}
function parse$3(obj2, parent) {
  let name, value, node2;
  for (name in obj2) {
    value = obj2[name];
    if (value === null || typeof value === "undefined") {
      continue;
    } else if (name[0] === "@") {
      let parts = name.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
      if (Array.isArray(value)) {
        for (let i of value) {
          atRule(parent, parts, i);
        }
      } else {
        atRule(parent, parts, value);
      }
    } else if (Array.isArray(value)) {
      for (let i of value) {
        decl(parent, name, i);
      }
    } else if (typeof value === "object") {
      node2 = postcss$2.rule({ selector: name });
      parse$3(value, node2);
      parent.push(node2);
    } else {
      decl(parent, name, value);
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
var didYouMean1_2_1 = { exports: {} };
(function(module2) {
  (function() {
    function didYouMean(str2, list2, key) {
      if (!str2)
        return null;
      if (!didYouMean.caseSensitive) {
        str2 = str2.toLowerCase();
      }
      var thresholdRelative = didYouMean.threshold === null ? null : didYouMean.threshold * str2.length, thresholdAbsolute = didYouMean.thresholdAbsolute, winningVal;
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
        if (!didYouMean.caseSensitive) {
          testCandidate = candidate.toLowerCase();
        } else {
          testCandidate = candidate;
        }
        val = getEditDistance(str2, testCandidate, winningVal);
        if (winningVal === null || val < winningVal) {
          winningVal = val;
          if (key && didYouMean.returnWinningObject)
            winner = list2[i];
          else
            winner = candidate;
          if (didYouMean.returnFirstMatch)
            return winner;
        }
      }
      return winner || didYouMean.nullResultValue;
    }
    didYouMean.threshold = 0.4;
    didYouMean.thresholdAbsolute = 20;
    didYouMean.caseSensitive = false;
    didYouMean.nullResultValue = null;
    didYouMean.returnWinningObject = null;
    didYouMean.returnFirstMatch = false;
    if (module2.exports) {
      module2.exports = didYouMean;
    } else {
      window.didYouMean = didYouMean;
    }
    var MAX_INT = Math.pow(2, 32) - 1;
    function getEditDistance(a, b, max) {
      max = max || max === 0 ? max : MAX_INT;
      var lena = a.length;
      var lenb = b.length;
      if (lena === 0)
        return Math.min(max + 1, lenb);
      if (lenb === 0)
        return Math.min(max + 1, lena);
      if (Math.abs(lena - lenb) > max)
        return max + 1;
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
        if (i > max)
          minJ = i - max;
        maxJ = lenb + 1;
        if (maxJ > max + i)
          maxJ = max + i;
        for (j = 1; j <= lena; j++) {
          if (j < minJ || j > maxJ) {
            matrix[i][j] = max + 1;
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
        if (colMin > max)
          return max + 1;
      }
      return matrix[lenb][lena];
    }
  })();
})(didYouMean1_2_1);
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
__toESM(require_quick_lru());
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
typeof process !== "undefined" ? {
  NODE_ENV: "development",
  DEBUG: resolveDebug(void 0),
  ENGINE: package_default.tailwindcss.engine
} : {
  NODE_ENV: "production",
  DEBUG: false,
  ENGINE: package_default.tailwindcss.engine
};
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
var matchingBrackets = /* @__PURE__ */ new Map([
  ["{", "}"],
  ["[", "]"],
  ["(", ")"]
]);
new Map(
  Array.from(matchingBrackets.entries()).map(([k, v]) => [v, k])
);
selectorParser4((selectors2) => {
  return selectors2.first.filter(({ type }) => type === "class").pop().value;
});
selectorParser4();
__toESM(require_value_parser());
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
selectorParser4((selectors2) => {
  return selectors2.map((s2) => {
    let nodes = s2.split((n) => n.type === "combinator" && n.value === " ").pop();
    return minimumImpactSelector(nodes);
  });
});
var comparisonMap = {
  atrule: ["name", "params"],
  rule: ["selector"]
};
new Set(Object.keys(comparisonMap));
__toESM(require_config_full());
const FRAME_RATE = 1e3 / 60;
const isObject = (value) => {
  return !!value && value.constructor === Object;
};
async function sleep(ms) {
  return await new Promise((resolve2) => setTimeout(resolve2, ms));
}
function memoize(func, options = {}) {
  const cache = /* @__PURE__ */ new Map();
  const { maxCacheSize = Infinity, ttl = Infinity } = options;
  const memoized = function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (now - cached.timestamp <= ttl) {
        return cached.value;
      } else {
        cache.delete(key);
      }
    }
    const result2 = func.apply(this, args);
    cache.set(key, { value: result2, timestamp: now });
    if (cache.size > maxCacheSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    return result2;
  };
  memoized.cache = cache;
  return memoized;
}
const hyphenToCamelCase = (str2) => str2.replace(
  /([-_][a-z])/gi,
  (group) => group.toUpperCase().replace("-", "").replace("_", "")
);
function camelCaseToHyphen(str2) {
  return str2.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
function seekPreviousValue(ix, values, pred) {
  for (let i = ix - 1; i >= 0; i--) {
    if (pred(values[i])) {
      return i;
    }
  }
  return void 0;
}
function requestAnimationFrame$1(callback3) {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback3);
  }
  let delay = FRAME_RATE;
  let prevT = Date.now();
  return setTimeout(() => {
    let t = Date.now();
    let delta = t - prevT;
    prevT = t;
    delay = Math.max(0, FRAME_RATE - delta);
    callback3(t);
  }, delay);
}
function isColorUnit(value) {
  return value.unit === "color";
}
const flattenObject = (obj2) => {
  const flat = {};
  const flatten = (obj22, parentKey = void 0) => {
    if (Array.isArray(obj22)) {
      obj22.forEach((v, i) => flatten(v, parentKey));
      return;
    } else if (obj22 instanceof FunctionValue) {
      const newKey = parentKey ? `${parentKey}.${obj22.name}` : obj22.name;
      obj22.args.forEach((v, i) => flatten(v, newKey));
      return;
    } else if (isObject(obj22)) {
      for (const [key, value] of Object.entries(obj22)) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        flatten(value, currentKey);
      }
      return;
    }
    if (flat[parentKey] == null) {
      flat[parentKey] = new ValueArray();
    }
    flat[parentKey].push(obj22);
    flat[parentKey] = flat[parentKey].flat();
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
function isCSSStyleName(value) {
  return setStyleNames.has(value);
}
const unpackMatrixValues = (value) => {
  const name = value.name;
  const values = value.valueOf();
  if (!value.name.startsWith("matrix")) {
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
  if (value.name === "matrix") {
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
function convertAbsoluteUnitToPixels(value, unit) {
  let pixels = value;
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
function convertToPixels(value, unit, element, property) {
  if (unit === "em" && element) {
    value *= parseFloat(getComputedStyle(element).fontSize);
  } else if (unit === "rem") {
    value *= parseFloat(getComputedStyle(document.documentElement).fontSize);
  } else if (unit === "vh") {
    value *= window.innerHeight / 100;
  } else if (unit === "vw") {
    value *= window.innerWidth / 100;
  } else if (unit === "vmin") {
    value *= Math.min(window.innerHeight, window.innerWidth) / 100;
  } else if (unit === "vmax") {
    value *= Math.max(window.innerHeight, window.innerWidth) / 100;
  } else if (unit === "%" && (element == null ? void 0 : element.parentElement) && property) {
    const parentValue = parseFloat(
      getComputedStyle(element.parentElement).getPropertyValue(property)
    );
    value = value / 100 * parentValue;
  } else if (unit === "ex" || unit === "ch") {
    value *= parseFloat(getComputedStyle(element).fontSize) ?? 16;
  } else {
    value = convertAbsoluteUnitToPixels(value, unit);
  }
  return value;
}
function convertToMs(value, unit) {
  if (unit === "s") {
    value *= 1e3;
  }
  return value;
}
function convertToDegrees(value, unit) {
  if (unit === "grad") {
    value *= 0.9;
  } else if (unit === "rad") {
    value *= 180 / Math.PI;
  } else if (unit === "turn") {
    value *= 360;
  }
  return value;
}
function convertToDPI(value, unit) {
  if (unit === "dpcm") {
    value *= 2.54;
  } else if (unit === "dppx") {
    value *= 96;
  }
  return value;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function scale(value, fromMin, fromMax, toMin = 0, toMax = 1) {
  const slope = (toMax - toMin) / (fromMax - fromMin);
  return (value - fromMin) * slope + toMin;
}
function lerp(t, start, end) {
  return (1 - t) * start + t * end;
}
function deCasteljau(t, points) {
  const n = points.length - 1;
  const b = [...points];
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= n - i; j++) {
      b[j] = lerp(t, b[j], b[j + 1]);
    }
  }
  return b[0];
}
function cubicBezier(t, x1, y1, x2, y2) {
  return [deCasteljau(t, [0, x1, x2, 1]), deCasteljau(t, [0, y1, y2, 1])];
}
function interpBezier(t, points) {
  const xCoords = points.map((xy) => xy[0]);
  const yCoords = points.map((xy) => xy[1]);
  return [deCasteljau(t, xCoords), deCasteljau(t, yCoords)];
}
function linear(t) {
  return t;
}
function easeInQuad(t) {
  return t * t;
}
function easeOutQuad(t) {
  return -t * (t - 2);
}
function easeInOutQuad(t) {
  if ((t /= 0.5) < 1)
    return 0.5 * t * t;
  return -0.5 * (--t * (t - 2) - 1);
}
function easeInCubic(t) {
  return t * t * t;
}
function easeOutCubic(t) {
  return (t = t - 1) * t * t + 1;
}
function easeInOutCubic(t) {
  if ((t /= 0.5) < 1)
    return 0.5 * t * t * t;
  return 0.5 * ((t -= 2) * t * t + 2);
}
function smoothStep3(t) {
  return t * t * (3 - 2 * t);
}
const CSSCubicBezier = (x1, y1, x2, y2) => (t) => {
  {
    t = cubicBezier(t, x1, y1, x2, y2)[1];
    return t;
  }
};
function easeInBounce(t) {
  t = CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
  return t;
}
function bounceInEase(t) {
  t = CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
  return t;
}
function bounceInEaseHalf(t) {
  const points = [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ];
  t = interpBezier(t, points)[1];
  return t;
}
function bounceOutEase(t) {
  const points = [
    [0, 0],
    [0.367, 0.94],
    [0.974, 0.254],
    [1, 0]
  ];
  t = interpBezier(t, points)[1];
  return t;
}
function bounceOutEaseHalf(t) {
  const points = [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ];
  t = interpBezier(t, points)[1];
  return t;
}
function bounceInOutEase(t) {
  const points = [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ];
  t = interpBezier(t, points)[1];
  return t;
}
function easeInSine(t) {
  return 1 - Math.cos(t * Math.PI / 2);
}
function easeOutSine(t) {
  return Math.sin(t * Math.PI / 2);
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeInCirc(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function easeOutCirc(t) {
  return Math.sqrt(1 - --t * t);
}
function easeInOutCirc(t) {
  if ((t /= 0.5) < 1)
    return -(Math.sqrt(1 - t * t) - 1) / 2;
  return (Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
function easeInExpo(t) {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutExpo(t) {
  if (t === 0)
    return 0;
  if (t === 1)
    return 1;
  if ((t /= 0.5) < 1)
    return 0.5 * Math.pow(2, 10 * (t - 1));
  return 0.5 * (2 - Math.pow(2, -10 * --t));
}
function jumpStart(t, steps) {
  return Math.floor(t * steps) / steps;
}
function jumpEnd(t, steps) {
  return Math.ceil(t * steps) / steps;
}
function jumpBoth(t, steps) {
  return t === 0 || t === 1 ? t : jumpStart(t, steps);
}
function jumpNone(t, steps) {
  return Math.round(t * steps) / steps;
}
function steppedEase(steps, jumpTerm = "jump-start") {
  switch (jumpTerm) {
    case "jump-none":
      return (t) => jumpNone(t, steps);
    case "jump-start":
    case "start":
      return (t) => jumpStart(t, steps);
    case "jump-end":
    case "end":
      return (t) => jumpEnd(t, steps);
    case "jump-both":
    case "both":
      return (t) => jumpBoth(t, steps);
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
};
const timingFunctions = {
  linear,
  easeInQuad,
  "ease-in-quad": easeInQuad,
  // "easeInQuad",
  easeOutQuad,
  "ease-out-quad": easeOutQuad,
  // "easeOutQuad",
  easeInOutQuad,
  "ease-in-out-quad": easeInOutQuad,
  // "easeInOutQuad",
  easeInCubic,
  "ease-in-cubic": easeInCubic,
  easeOutCubic,
  "ease-out-cubic": easeOutCubic,
  easeInOutCubic,
  "ease-in-out-cubic": easeInOutCubic,
  easeInBounce,
  "ease-in-bounce": easeInBounce,
  // "easeInBounce",
  bounceInEase,
  "bounce-in-ease": bounceInEase,
  bounceInEaseHalf,
  "bounce-in-ease-half": bounceInEaseHalf,
  bounceOutEase,
  "bounce-out-ease": bounceOutEase,
  bounceOutEaseHalf,
  "bounce-out-ease-half": bounceOutEaseHalf,
  bounceInOutEase,
  "bounce-in-out-ease": bounceInOutEase,
  easeInSine,
  "ease-in-sine": easeInSine,
  easeOutSine,
  "ease-out-sine": easeOutSine,
  easeInOutSine,
  "ease-in-out-sine": easeInOutSine,
  easeInCirc,
  "ease-in-circ": easeInCirc,
  easeOutCirc,
  "ease-out-circ": easeOutCirc,
  easeInOutCirc,
  "ease-in-out-circ": easeInOutCirc,
  easeInExpo,
  "ease-in-expo": easeInExpo,
  easeOutExpo,
  "ease-out-expo": easeOutExpo,
  easeInOutExpo,
  "ease-in-out-expo": easeInOutExpo,
  smoothStep3,
  "smooth-step-3": smoothStep3,
  ease: CSSCubicBezier(...bezierPresets.ease),
  "ease-in": CSSCubicBezier(...bezierPresets["ease-in"]),
  "ease-out": CSSCubicBezier(...bezierPresets["ease-out"]),
  "ease-in-out": CSSCubicBezier(...bezierPresets["ease-in-out"]),
  "ease-in-back": CSSCubicBezier(...bezierPresets["ease-in-back"]),
  "ease-out-back": CSSCubicBezier(...bezierPresets["ease-out-back"]),
  "ease-in-out-back": CSSCubicBezier(...bezierPresets["ease-in-out-back"]),
  steps: steppedEase,
  "step-start": stepStart,
  "step-end": stepEnd
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
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
function create$1() {
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
function create() {
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
  var vec = create();
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
const COLOR_SPACE_KEYS = {
  rgb: ["r", "g", "b"],
  hsl: ["h", "s", "l"],
  hsv: ["h", "s", "v"],
  hwb: ["h", "w", "b"],
  lab: ["l", "a", "b"],
  lch: ["l", "c", "h"],
  oklab: ["l", "a", "b"],
  oklch: ["l", "c", "h"],
  xyz: ["x", "y", "z"],
  kelvin: ["kelvin"]
};
function getColorSpace(color) {
  for (const space2 of Object.keys(COLOR_SPACE_KEYS)) {
    if (COLOR_SPACE_KEYS[space2].every((key) => key in color)) {
      return space2;
    }
  }
  return null;
}
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
const kelvin2rgb = ({ kelvin, alpha }) => {
  kelvin = clamp(kelvin, MIN_TEMP, MAX_TEMP) / TEMP_SCALE;
  let r2, g, b;
  if (kelvin <= 66) {
    r2 = RGBA_MAX;
  } else {
    r2 = kelvin - 60;
    r2 = 329.698727446 * r2 ** -0.1332047592;
  }
  r2 = clamp(r2, 0, RGBA_MAX) / RGBA_MAX;
  if (kelvin <= 66) {
    g = kelvin;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = kelvin - 60;
    g = 288.1221695283 * g ** -0.0755148492;
  }
  g = clamp(g, 0, RGBA_MAX) / RGBA_MAX;
  if (kelvin >= 66) {
    b = RGBA_MAX;
  } else if (kelvin <= 19) {
    b = 0;
  } else {
    b = kelvin - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
  }
  b = clamp(b, 0, RGBA_MAX) / RGBA_MAX;
  return { r: r2, g, b, alpha };
};
const hsv2hsl = ({ h, s: s2, v, alpha }) => {
  const l = v - v * s2 / 2;
  let sl;
  if (l === 0 || l === 1) {
    sl = 0;
  } else {
    sl = (v - l) / Math.min(l, 1 - l);
  }
  return { h, s: sl, l, alpha };
};
const hsl2hsv = ({ h, s: s2, l, alpha }) => {
  const v = l + s2 * Math.min(l, 1 - l);
  let sv;
  if (v === 0) {
    sv = 0;
  } else {
    sv = 2 * (1 - l / v);
  }
  return { h, s: sv, v, alpha };
};
const hwb2hsl = ({ h, w, b, alpha }) => {
  const v = 1 - b;
  let sv;
  if (v === 0) {
    sv = 0;
  } else {
    sv = 1 - w / v;
  }
  return hsv2hsl({ h, s: sv, v, alpha });
};
const hsl2hwb = ({ h, s: s2, l, alpha }) => {
  const v = l + s2 * Math.min(l, 1 - l);
  let w;
  if (v === 0) {
    w = 0;
  } else {
    w = 1 - l / v;
  }
  const b = 1 - v;
  return { h, w, b, alpha };
};
const rgb2hsl = ({ r: r2, g, b, alpha }) => {
  const max = Math.max(r2, g, b);
  const min = Math.min(r2, g, b);
  const l = (max + min) / 2;
  if (Math.abs(max - min) < 1e-6) {
    return { h: 0, s: 0, l, alpha };
  }
  const c = max - min;
  const s2 = c / (1 - Math.abs(2 * l - 1));
  let h;
  switch (max) {
    case r2:
      h = (g - b) / c + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r2) / c + 2;
      break;
    case b:
      h = (r2 - g) / c + 4;
      break;
  }
  h /= 6;
  return { h, s: s2, l, alpha };
};
function hsl2rgb({ h, s: s2, l, alpha }) {
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
function xyz2lab({ x: x2, y, z, alpha }) {
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
function lab2xyz({ l, a, b, alpha }) {
  const fy = (l + LAB_OFFSET) / LAB_SCALE_L;
  const fx = a / LAB_SCALE_A + fy;
  const fz = fy - b / LAB_SCALE_B;
  const xr = fx ** 3 > LAB_EPSILON ? fx ** 3 : (fx * LAB_SCALE_L - LAB_OFFSET) / LAB_KAPPA;
  const yr = l > LAB_KAPPA * LAB_EPSILON ? ((l + LAB_OFFSET) / LAB_SCALE_L) ** 3 : l / LAB_KAPPA;
  const zr = fz ** 3 > LAB_EPSILON ? fz ** 3 : (fz * LAB_SCALE_L - LAB_OFFSET) / LAB_KAPPA;
  const x2 = xr * WHITE_POINT_D65[0];
  const y = yr * WHITE_POINT_D65[1];
  const z = zr * WHITE_POINT_D65[2];
  return { x: x2, y, z, alpha };
}
const RGB_XYZ_MATRIX = fromValues$1(
  ...[0.4124564, 0.3575761, 0.1804375],
  ...[0.2126729, 0.7151522, 0.072175],
  ...[0.0193339, 0.119192, 0.9503041]
);
transpose(RGB_XYZ_MATRIX, RGB_XYZ_MATRIX);
const XYZ_RGB_MATRIX = create$1();
invert(XYZ_RGB_MATRIX, RGB_XYZ_MATRIX);
const SRGB_GAMMA = 2.4;
const SRGB_OFFSET = 0.055;
const SRGB_SLOPE = 12.92;
const SRGB_TRANSITION = 0.04045;
const SRGB_LINEAR_TRANSITION = SRGB_TRANSITION / SRGB_SLOPE;
function srgbToLinear(channel) {
  if (channel <= SRGB_TRANSITION) {
    return channel / SRGB_SLOPE;
  } else {
    return ((channel + SRGB_OFFSET) / (1 + SRGB_OFFSET)) ** SRGB_GAMMA;
  }
}
function linearToSrgb(channel) {
  if (channel <= SRGB_LINEAR_TRANSITION) {
    return channel * SRGB_SLOPE;
  } else {
    return (1 + SRGB_OFFSET) * channel ** (1 / SRGB_GAMMA) - SRGB_OFFSET;
  }
}
function rgb2xyz({ r: r2, g, b, alpha }) {
  const linearRGB = fromValues(
    srgbToLinear(r2),
    srgbToLinear(g),
    srgbToLinear(b)
  );
  const result2 = create();
  transformMat3(result2, linearRGB, RGB_XYZ_MATRIX);
  const [x2, y, z] = result2;
  return { x: x2, y, z, alpha };
}
function xyz2rgb({ x: x2, y, z, alpha }) {
  const linearRGB = create();
  transformMat3(linearRGB, fromValues(x2, y, z), XYZ_RGB_MATRIX);
  const r2 = linearToSrgb(linearRGB[0]);
  const g = linearToSrgb(linearRGB[1]);
  const b = linearToSrgb(linearRGB[2]);
  return { r: r2, g, b, alpha };
}
function lch2lab({ l, c, h, alpha }) {
  const hRad = h * 2 * Math.PI;
  return {
    l,
    a: Math.cos(hRad) * c,
    b: Math.sin(hRad) * c,
    alpha
  };
}
function lab2lch({ l, a, b, alpha }) {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) / (2 * Math.PI);
  if (h < 0)
    h += 1;
  return { l, c, h, alpha };
}
const LMS_TO_XYZ_MATRIX = fromValues$1(
  ...[0.8189330101, 0.0329845436, 0.0482003018],
  ...[0.3618667424, 0.9293118715, 0.2643662691],
  ...[-0.1288597137, 0.0361456387, 0.633851707]
);
transpose(LMS_TO_XYZ_MATRIX, LMS_TO_XYZ_MATRIX);
const XYZ_TO_LMS_MATRIX = create$1();
invert(XYZ_TO_LMS_MATRIX, LMS_TO_XYZ_MATRIX);
const LMS_TO_OKLAB_MATRIX = fromValues$1(
  ...[0.2104542553, 0.793617785, -0.0040720468],
  ...[1.9779984951, -2.428592205, 0.4505937099],
  ...[0.0259040371, 0.7827717662, -0.808675766]
);
transpose(LMS_TO_OKLAB_MATRIX, LMS_TO_OKLAB_MATRIX);
const OKLAB_TO_LMS_MATRIX = create$1();
invert(OKLAB_TO_LMS_MATRIX, LMS_TO_OKLAB_MATRIX);
function oklab2xyz({ l, a, b, alpha }) {
  const lms = create();
  transformMat3(lms, fromValues(l, a, b), OKLAB_TO_LMS_MATRIX);
  lms.forEach((value, index2) => {
    lms[index2] = value ** 3;
  });
  const xyz = create();
  transformMat3(xyz, lms, LMS_TO_XYZ_MATRIX);
  return { x: xyz[0], y: xyz[1], z: xyz[2], alpha };
}
function xyz2oklab({ x: x2, y, z, alpha }) {
  const lms = create();
  transformMat3(lms, fromValues(x2, y, z), XYZ_TO_LMS_MATRIX);
  lms.forEach((value, index2) => {
    lms[index2] = Math.cbrt(value);
  });
  const oklab = create();
  transformMat3(oklab, lms, LMS_TO_OKLAB_MATRIX);
  return { l: oklab[0], a: oklab[1], b: oklab[2], alpha };
}
function oklab2lab({ l, a, b, alpha }) {
  const { x: x2, y, z } = oklab2xyz({ l, a, b, alpha });
  return xyz2lab({ x: x2, y, z, alpha });
}
function lab2oklab({ l, a, b, alpha }) {
  const { x: x2, y, z } = lab2xyz({ l, a, b, alpha });
  return xyz2oklab({ x: x2, y, z, alpha });
}
function oklch2lab({ l, c, h, alpha }) {
  const hRadians = h * 2 * Math.PI;
  const a = c * Math.cos(hRadians);
  const b = c * Math.sin(hRadians);
  return oklab2lab({ l, a, b, alpha });
}
function lab2oklch({ l, a, b, alpha }) {
  const { l: ll, a: aa, b: bb } = lab2oklab({ l, a, b, alpha });
  const c = Math.sqrt(aa * aa + bb * bb);
  let h = Math.atan2(bb, aa) / (2 * Math.PI);
  if (h < 0)
    h += 1;
  return { l, c, h, alpha };
}
function hsl2xyz({ h, s: s2, l, alpha }) {
  const { r: r2, g, b } = hsl2rgb({ h, s: s2, l, alpha });
  return rgb2xyz({ r: r2, g, b, alpha });
}
function xyz2hsl({ x: x2, y, z, alpha }) {
  const { r: r2, g, b } = xyz2rgb({ x: x2, y, z, alpha });
  return rgb2hsl({ r: r2, g, b, alpha });
}
function hsv2xyz({ h, s: s2, v, alpha }) {
  const { h: hh, s: sh, l } = hsv2hsl({ h, s: s2, v, alpha });
  return hsl2xyz({ h: hh, s: sh, l, alpha });
}
function xyz2hsv({ x: x2, y, z, alpha }) {
  const { h, s: s2, l } = xyz2hsl({ x: x2, y, z, alpha });
  return hsl2hsv({ h, s: s2, l, alpha });
}
function hwb2xyz({ h, w, b, alpha }) {
  const { h: hh, s: s2, l } = hwb2hsl({ h, w, b, alpha });
  return hsl2xyz({ h: hh, s: s2, l, alpha });
}
function xyz2hwb({ x: x2, y, z, alpha }) {
  const { h, s: s2, l } = xyz2hsl({ x: x2, y, z, alpha });
  return hsl2hwb({ h, s: s2, l, alpha });
}
function lch2xyz({ l, c, h, alpha }) {
  const { l: ll, a, b } = lch2lab({ l, c, h, alpha });
  return lab2xyz({ l, a, b, alpha });
}
function xyz2lch({ x: x2, y, z, alpha }) {
  const { l, a, b } = xyz2lab({ x: x2, y, z, alpha });
  return lab2lch({ l, a, b, alpha });
}
function oklch2xyz({ l, c, h, alpha }) {
  const { l: ll, a, b } = oklch2lab({ l, c, h, alpha });
  return lab2xyz({ l: ll, a, b, alpha });
}
function xyz2oklch({ x: x2, y, z, alpha }) {
  const { l, a, b } = xyz2lab({ x: x2, y, z, alpha });
  return lab2oklch({ l, a, b, alpha });
}
const XYZ_FUNCTIONS = {
  rgb: { to: rgb2xyz, from: xyz2rgb },
  hsl: { to: hsl2xyz, from: xyz2hsl },
  hsv: { to: hsv2xyz, from: xyz2hsv },
  hwb: { to: hwb2xyz, from: xyz2hwb },
  lab: { to: lab2xyz, from: xyz2lab },
  lch: { to: lch2xyz, from: xyz2lch },
  oklab: { to: oklab2xyz, from: xyz2oklab },
  oklch: { to: oklch2xyz, from: xyz2oklch },
  xyz: { to: (color) => color, from: (color) => color }
};
function color2(color, to) {
  const fromSpace = getColorSpace(color);
  if (!fromSpace) {
    throw new Error("Invalid color object");
  }
  const toXYZFn = XYZ_FUNCTIONS[fromSpace]["to"];
  const xyz = toXYZFn(color);
  const fromXYZFn = XYZ_FUNCTIONS[to]["from"];
  return fromXYZFn(xyz);
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
const createColorValueUnit = (value, colorType) => {
  return new ValueUnit(value, "color", ["color", colorType], void 0, "color");
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
  kelvin: () => number.skip(istring("k")).map((kelvin) => {
    const { r: r2, g, b } = kelvin2rgb({ kelvin });
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
  Length: (r2) => P.seq(number, r2.lengthUnit).map(([value, unit]) => {
    let superType = ["length"];
    if (RELATIVE_LENGTH_UNITS.includes(unit)) {
      superType.push("relative");
    } else if (ABSOLUTE_LENGTH_UNITS.includes(unit)) {
      superType.push("absolute");
    }
    return new ValueUnit(value, unit, superType);
  }),
  Angle: (r2) => P.seq(number, r2.angleUnit).map(([value, unit]) => {
    return new ValueUnit(value, unit, ["angle"]);
  }),
  Time: (r2) => P.seq(number, r2.timeUnit).map(([value, unit]) => {
    return new ValueUnit(value, unit, ["time"]);
  }),
  TimePercentage: (r2) => P.alt(r2.Percentage, r2.Time),
  Resolution: (r2) => P.seq(number, r2.resolutionUnit).map(([value, unit]) => {
    return new ValueUnit(value, unit, ["resolution"]);
  }),
  Percentage: (r2) => P.alt(
    P.seq(number, r2.percentageUnit),
    istring("from").map(() => [0, "%"]),
    istring("to").map(() => [100, "%"])
  ).map(([value, unit]) => {
    return new ValueUnit(value, unit, ["percentage"]);
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
  return P.string("var").then(r2.String.trim(r2.ws).wrap(r2.lparen, r2.rparen)).map((value) => {
    return new ValueUnit(value, "var");
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
  const makeTransformName = (name, dim) => {
    return name + dim.toUpperCase();
  };
  const p = handleFunc(r2, nameParser);
  return p.map(([[name, dim], values]) => {
    name = name.toLowerCase();
    const transformObject = {};
    if (dim) {
      const newName = name + dim.toUpperCase();
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
  ).map(([color, stops]) => {
    if (!stops) {
      return [color];
    } else {
      return [color, ...stops];
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
  FunctionArgs: (r2) => r2.Value.sepBy(r2.comma.or(r2.ws)).trim(r2.ws).map((v) => new ValueArray(...v)),
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
      for (let [key, value] of Object.entries(values)) {
        if (key.includes("animation")) {
          const newKey = key.replace(/^animation/i, "").replace(/^\w/, (c) => c.toLowerCase());
          const newValue = camelCaseToHyphen(value.toString());
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
    CSSClass.Class.or(P.whitespace).map((value) => {
      return value;
    }),
    CSSKeyframes.Keyframes.map((value) => {
      return {
        keyframes: value
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
const parseCSSTime = memoize((input2) => {
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
const defaultOptions = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: easeInOutCubic
};
class AnimationGroup {
  constructor(...animations) {
    __publicField(this, "animations", {});
    __publicField(this, "transform");
    __publicField(this, "superKey");
    __publicField(this, "paused", false);
    __publicField(this, "started", false);
    __publicField(this, "done", false);
    __publicField(this, "singleTarget", true);
    __publicField(this, "handleId");
    __publicField(this, "resolvePromise", null);
    for (const animation of animations) {
      this.transform ?? (this.transform = animation.frames[0].transform);
      const name = getAnimationId(animation);
      this.animations[name] = {
        values: {},
        animation
      };
    }
    this.singleTarget = animations.every(
      (animation) => animation.targets[0] === animations[0].targets[0]
    );
  }
  setSuperKey(superKey) {
    this.superKey = superKey;
    Object.values(this.animations).forEach((groupObject) => {
      groupObject.animation.superKey = superKey;
    });
    return this;
  }
  setTargets(...targets) {
    Object.values(this.animations).forEach((groupObject) => {
      groupObject.animation.setTargets(...targets);
    });
    const animations = Object.values(this.animations).map(
      (groupObject) => groupObject.animation
    );
    this.singleTarget = animations.every(
      (animation) => animation.targets[0] === animations[0].targets[0]
    );
    return this;
  }
  onStart() {
    this.started = true;
    return this;
  }
  onEnd() {
    return this;
  }
  transformFramesGrouped(t) {
    let groupedValues = {};
    let done = true;
    for (const groupObject of Object.values(this.animations)) {
      const { animation, values } = groupObject;
      done = done && animation.done;
      if (!(animation.done || animation.paused)) {
        const vars = animation.interpFrames(animation.t, false);
        Object.assign(values, vars);
      }
      groupedValues = {
        ...groupedValues,
        ...values
      };
    }
    this.done = done;
    this.transform(t, groupedValues);
    return groupedValues;
  }
  async tick(t) {
    if (!this.started) {
      this.onStart();
    }
    Object.values(this.animations).forEach(async (groupObject) => {
      if (!groupObject.animation.paused || groupObject.animation.pausedTime === 0) {
        await groupObject.animation.tick(t);
      }
    });
    if (this.done) {
      this.onEnd();
    }
    return this;
  }
  async draw(t) {
    await this.tick(t);
    if (this.paused) {
      return;
    }
    if (this.singleTarget) {
      this.transformFramesGrouped(t);
    } else {
      this.done = Object.values(this.animations).map(({ animation }) => {
        animation.transformFrames(animation.t);
        return animation;
      }).every((animation) => animation.done);
    }
    if (!this.done) {
      this.handleId = requestAnimationFrame(this.draw.bind(this));
    } else {
      this.reset();
      if (this.resolvePromise) {
        this.resolvePromise();
      }
    }
  }
  async play() {
    return new Promise((resolve2) => {
      this.resolvePromise = resolve2;
      this.handleId = requestAnimationFrame(this.draw.bind(this));
    });
  }
  pause() {
    const prevPaused = this.paused;
    if (this.started) {
      this.paused = !this.paused;
      Object.values(this.animations).forEach((groupObject) => {
        groupObject.animation.pause(false);
      });
    }
    if (prevPaused) {
      requestAnimationFrame(this.draw.bind(this));
    }
    return this;
  }
  reset() {
    Object.values(this.animations).forEach((groupObject) => {
      groupObject.animation.reset();
    });
    this.started = false;
    this.done = false;
    this.paused = false;
    return this;
  }
  stop() {
    cancelAnimationFrame(this.handleId);
    this.reset();
    return this;
  }
  playing() {
    return !(!this.started || this.paused);
  }
  forcePause() {
    this.paused = true;
    Object.values(this.animations).forEach((groupObject) => {
      groupObject.animation.paused = true;
    });
  }
  forcePlay() {
    this.paused = false;
    Object.values(this.animations).forEach((groupObject) => {
      groupObject.animation.paused = false;
    });
  }
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
const normalizeValue = (value, min, max) => scale(value, min, max, 0, 1);
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
const normalizeColorUnit = (color) => {
  var _a;
  const value = color.value;
  const colorType = ((_a = color.superType) == null ? void 0 : _a[1]) ?? "rgb";
  const normalizedValue = (() => {
    switch (colorType) {
      case "rgb":
        return normalizeRGBValueUnits(value);
      case "hsl":
        return normalizeHSLValueUnits(value);
      case "hsv":
        return normalizeHSVValueUnits(value);
      case "hwb":
        return normalizeHWBValueUnits(value);
      case "lab":
        return normalizeLABValueUnits(value);
      case "lch":
        return normalizeLCHValueUnits(value);
      case "oklab":
        return normalizeOKLABValueUnits(value);
      case "oklch":
        return normalizeOKLCHValueUnits(value);
      case "xyz":
        return normalizeXYZValueUnits(value);
      default:
        return value;
    }
  })();
  return new ValueUnit(
    normalizedValue,
    color.unit,
    color.superType ?? ["color", colorType],
    color.subProperty,
    color.property,
    color.targets
  );
};
const normalizeColorUnits = (a, b) => {
  const to = "lab";
  const [newA, newB] = [normalizeColorUnit(a), normalizeColorUnit(b)];
  const [normA, normB] = [color2(newA.value, to), color2(newB.value, to)];
  return [
    new ValueUnit(
      normA,
      "color",
      ["color", to],
      a.subProperty,
      a.property,
      a.targets
    ),
    new ValueUnit(
      normB,
      "color",
      ["color", to],
      b.subProperty,
      b.property,
      b.targets
    )
  ];
};
const getComputedValue = memoize((value, target) => {
  const get = () => {
    if (value.unit === "var") {
      const computed = getComputedStyle(target).getPropertyValue(
        value.toString()
      );
      return parseCSSValueUnit(computed);
    }
    if (value.unit === "calc" && value.property && value.subProperty && value.value && target) {
      const originalValue = target.style[value.property];
      const newValue2 = value.subProperty ? `${value.subProperty}(${value.toString()})` : value.toString();
      target.style[value.property] = newValue2;
      const computed = getComputedStyle(target).getPropertyValue(value.property);
      target.style[value.property] = originalValue;
      const p = parseCSSKeyframesValue(computed);
      if (p instanceof ValueUnit) {
        return p;
      }
      if (p.name.startsWith("matrix")) {
        const matrixValues = unpackMatrixValues(p);
        const matrixSubValue = matrixValues[value.subProperty];
        if (matrixSubValue != null) {
          return new ValueUnit(matrixSubValue, "px", ["length", "absolute"]);
        }
      }
    }
    return value;
  };
  const newValue = get();
  return newValue.coalesce(value);
});
const normalizeNumericUnits = (a, b) => {
  var _a, _b;
  if (((_a = a == null ? void 0 : a.superType) == null ? void 0 : _a[0]) !== ((_b = b == null ? void 0 : b.superType) == null ? void 0 : _b[0])) {
    return [a, b];
  }
  const convertToNormalizedUnit = (value) => {
    var _a2, _b2;
    const superType = (_a2 = value == null ? void 0 : value.superType) == null ? void 0 : _a2[0];
    switch (superType) {
      case "length":
        return {
          value: convertToPixels(value.value, value.unit, (_b2 = value.targets) == null ? void 0 : _b2[0]),
          unit: "px"
        };
      case "angle":
        return {
          value: convertToDegrees(value.value, value.unit),
          unit: "deg"
        };
      case "time":
        return {
          value: convertToMs(value.value, value.unit),
          unit: "ms"
        };
      case "resolution":
        return {
          value: convertToDPI(value.value, value.unit),
          unit: "dpi"
        };
      default:
        return { value: value.value, unit: value.unit };
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
function normalizeValueUnits(left, right) {
  left = left.coalesce(right);
  right = right.coalesce(left);
  const out = {
    start: left.value,
    stop: right.value,
    startValueUnit: left,
    stopValueUnit: right
  };
  if (left.unit === "string") {
    out.start = left.value;
    out.stop = left.value;
  }
  if (right.unit === "string") {
    out.start = right.value;
    out.stop = right.value;
  }
  if (isColorUnit(left) && isColorUnit(right)) {
    const [leftCollapsed, rightCollapsed] = normalizeColorUnits(left, right);
    out.start = leftCollapsed.value;
    out.stop = rightCollapsed.value;
    out.startValueUnit = leftCollapsed;
    out.stopValueUnit = rightCollapsed;
  }
  if (left.unit !== right.unit) {
    const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(left, right);
    out.start = leftCollapsed.value;
    out.stop = rightCollapsed.value;
    out.startValueUnit = leftCollapsed;
    out.stopValueUnit = rightCollapsed;
  }
  return out;
}
const getTimingFunction = (timingFunction) => {
  if (typeof timingFunction === "string") {
    return timingFunctions[timingFunction];
  } else if (timingFunction == null) {
    return void 0;
  }
  return timingFunction;
};
function lerpComputedValue(t, value) {
  var _a, _b;
  const { start, stop, startValueUnit, stopValueUnit } = value;
  startValueUnit.value = start;
  stopValueUnit.value = stop;
  const newstartValueUnit = getComputedValue(
    startValueUnit,
    (_a = startValueUnit.targets) == null ? void 0 : _a[0]
  );
  const newRightValueUnit = getComputedValue(
    stopValueUnit,
    (_b = stopValueUnit.targets) == null ? void 0 : _b[0]
  );
  startValueUnit.value = lerp(
    t,
    newstartValueUnit.value,
    newRightValueUnit.value
  );
}
function lerpObject(t, value) {
  const { start, stop, startValueUnit } = value;
  Object.keys(start).forEach((key) => {
    startValueUnit.value[key] = lerp(t, start[key], stop[key]);
  });
}
function lerpValue(t, value) {
  const { start, stop, startValueUnit, stopValueUnit } = value;
  if (typeof start === "number" && typeof stop === "number") {
    startValueUnit.value = lerp(t, start, stop);
  } else if (COMPUTED_UNITS.includes(startValueUnit.unit) || COMPUTED_UNITS.includes(stopValueUnit.unit)) {
    lerpComputedValue(t, value);
  } else if (startValueUnit.unit === "color") {
    lerpObject(t, value);
  }
  return startValueUnit;
}
function parseAndFlattenObject(input2) {
  const flat = flattenObject(input2);
  const parse2 = (key, childKey, value) => {
    const p = CSSKeyframes.FunctionArgs.map((v) => {
      if (isCSSStyleName(childKey)) {
        return v;
      } else {
        return new FunctionValue(childKey, v);
      }
    }).or(CSSKeyframes.Value).tryParse(String(value));
    const mainKey = key.split(".").shift();
    p.setProperty(mainKey);
    return [key, p];
  };
  const parsedVars = Object.entries(flat).map(([key, value]) => {
    if (value instanceof ValueUnit || value instanceof FunctionValue || value instanceof ValueArray) {
      return [key, value];
    }
    const childKey = key.split(".").pop();
    return parse2(key, childKey, value);
  }).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  return parsedVars;
}
const createInterpVarValue = (v, startIx, endIx, vars) => {
  const left = vars[startIx][v];
  const right = vars[endIx][v];
  const maxLength = Math.max(left.length, right.length);
  const newLeft = left.concat(
    Array(Math.abs(maxLength - left.length)).fill(new ValueUnit(0))
  );
  const newRight = right.concat(
    Array(Math.abs(maxLength - right.length)).fill(new ValueUnit(0))
  );
  return newLeft.map((l, i) => normalizeValueUnits(l, newRight[i]));
};
function calcFrameTime(startFrame, endFrame, duration) {
  const [start, stop] = [startFrame.start, endFrame.start];
  return {
    start: start.value * duration / 100,
    stop: stop.value * duration / 100
  };
}
function transformTargetsStyle(t, vars, targets) {
  const styleStringVars = unflattenObjectToString(vars);
  targets.forEach((target) => {
    Object.entries(styleStringVars).forEach(([key, value]) => {
      target.style.setProperty(key, value);
    });
  });
}
const getAnimationId = (animation) => {
  if (typeof animation === "string")
    return animation;
  return animation.name ?? String(animation.id);
};
let nextId = 0;
class Animation {
  constructor(options, targets, name, superKey) {
    __publicField(this, "id", nextId++);
    __publicField(this, "name");
    __publicField(this, "superKey");
    __publicField(this, "targets");
    __publicField(this, "options");
    __publicField(this, "templateFrames", []);
    __publicField(this, "parsedVars", []);
    __publicField(this, "frameId", 0);
    __publicField(this, "frames", []);
    __publicField(this, "handleId");
    __publicField(this, "startTime");
    __publicField(this, "pausedTime", 0);
    __publicField(this, "prevTime", 0);
    __publicField(this, "t", 0);
    __publicField(this, "iteration", 0);
    __publicField(this, "started", false);
    __publicField(this, "done", false);
    __publicField(this, "reversed", false);
    __publicField(this, "paused", false);
    __publicField(this, "resolvePromise", null);
    this.setOptions({ ...defaultOptions, ...options ?? {} });
    this.targets = targets == null ? [] : Array.isArray(targets) ? targets : [targets];
    this.name = name;
    this.superKey = superKey;
  }
  convertFrameStart(frame) {
    if (frame.start.unit === "s" || frame.start.unit === "ms" || !frame.start.unit) {
      const value = convertToMs(frame.start.value, frame.start.unit);
      frame.start.value = value / this.options.duration * 100;
      frame.start.unit = "%";
    }
    frame.start.value = clamp(frame.start.value, 0, 100);
    return frame;
  }
  addFrame(start, vars, transform, timingFunction) {
    if (typeof start === "number") {
      start = String(start) + "%";
    } else if (typeof start === "string") {
      start = start;
    } else if (start instanceof ValueUnit) {
      start = String(start);
    }
    const parsedStart = parseCSSValueUnit(start);
    let templateFrame = {
      id: this.frameId,
      start: parsedStart,
      vars,
      transform,
      timingFunction: getTimingFunction(timingFunction) ?? this.options.timingFunction
    };
    this.convertFrameStart(templateFrame);
    this.templateFrames.push(templateFrame);
    this.frameId += 1;
    return this;
  }
  createFrame(startIx, endIx) {
    const [startFrame, endFrame] = [
      this.templateFrames[startIx],
      this.templateFrames[endIx]
    ];
    const ixs = {
      start: startIx,
      stop: endIx
    };
    const time = calcFrameTime(startFrame, endFrame, this.options.duration);
    let transform = startFrame.transform;
    if (transform == null) {
      const transformIx = seekPreviousValue(
        startIx,
        this.frames,
        (f) => f.transform != null
      );
      transform = this.frames[transformIx].transform;
    }
    let timingFunction = startFrame.timingFunction;
    if (timingFunction == null) {
      const timingFunctionIx = seekPreviousValue(
        startIx,
        this.frames,
        (f) => f.timingFunction != null
      );
      timingFunction = this.frames[timingFunctionIx].timingFunction;
    }
    const id3 = this.frameId++;
    return {
      id: id3,
      ixs,
      time,
      vars: void 0,
      interpVars: {},
      transform,
      timingFunction
    };
  }
  reconcileVars(ix) {
    const startVars = this.parsedVars[ix];
    Object.keys(startVars).forEach((v) => {
      const varIx = this.parsedVars.findIndex((f, i) => i > ix && f[v] != null);
      if (varIx === -1) {
        return;
      }
      const [startIx, endIx] = [ix, varIx];
      const frameIx = this.frames.findIndex(
        (f) => f.ixs.start === startIx && f.ixs.stop === endIx
      );
      const frame = frameIx !== -1 ? this.frames[frameIx] : this.createFrame(startIx, endIx);
      frame.interpVars[v] = createInterpVarValue(
        v,
        startIx,
        endIx,
        this.parsedVars
      );
      if (frameIx === -1) {
        this.frames.push(frame);
      }
    });
  }
  parseVars() {
    this.parsedVars = this.templateFrames.map((frame) => {
      return parseAndFlattenObject(frame.vars);
    });
    return this;
  }
  parseFrames() {
    this.frames = [];
    this.templateFrames.sort((a, b) => a.start.value - b.start.value);
    for (let i = 0; i < this.templateFrames.length - 1; i++) {
      this.frames.push(this.createFrame(i, i + 1));
    }
    this.frames.forEach((_, ix) => {
      this.reconcileVars(ix);
    });
    this.frames.sort((a, b) => {
      if (a.time.start === b.time.start) {
        return a.time.stop - b.time.stop;
      }
      return a.time.start - b.time.start;
    });
    this.frames = this.frames.filter(
      (frame) => frame.interpVars != null && Object.keys(frame.interpVars).length > 0
    );
    this.frames.forEach((frame) => {
      frame.vars = Object.entries(frame.interpVars).reduce(
        (acc, [key, value]) => {
          acc[key] = value.map((v) => v.startValueUnit);
          return acc;
        },
        {}
      );
    });
    return this;
  }
  setTimingFunction(timingFunction) {
    this.options.timingFunction = getTimingFunction(timingFunction) ?? easeInOutCubic;
    return this;
  }
  setIterationCount(iterationCount) {
    if (!iterationCount || iterationCount === "infinite" || iterationCount === "∞" || iterationCount === "Infinity") {
      this.options.iterationCount = Infinity;
    } else if (typeof iterationCount === "string") {
      this.options.iterationCount = parseFloat(iterationCount.trim());
    } else {
      this.options.iterationCount = iterationCount;
    }
    return this;
  }
  setDuration(duration) {
    if (typeof duration === "string") {
      duration = parseCSSTime(duration);
    }
    const prevDuration = this.options.duration;
    const ratio = duration / prevDuration;
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      frame.time.start *= ratio;
      frame.time.stop *= ratio;
    }
    this.options.duration = duration;
    return this;
  }
  setDelay(delay) {
    if (typeof delay === "string") {
      delay = parseCSSTime(delay);
    }
    this.options.delay = delay;
    return this;
  }
  setDirection(direction) {
    this.options.direction = direction;
    return this;
  }
  setFillMode(fillMode) {
    this.options.fillMode = fillMode;
    return this;
  }
  setOptions(options) {
    this.options = {};
    this.setTimingFunction(options.timingFunction);
    this.setDuration(options.duration);
    this.setIterationCount(options.iterationCount);
    this.setDelay(options.delay);
    this.setDirection(options.direction);
    this.setFillMode(options.fillMode);
    return this;
  }
  parse() {
    this.parseVars().parseFrames();
    return this;
  }
  reverse() {
    this.reversed = !this.reversed;
    return this;
  }
  fillForwards() {
    this.interpFrames(this.options.duration, true);
  }
  fillBackwards() {
    this.interpFrames(0, true);
  }
  interpFrames(t, transformFrames = false) {
    t = this.reversed ? this.options.duration - t : t;
    return this.frames.map((frame) => {
      const { start, stop } = frame.time;
      if (t < start || t > stop) {
        return;
      }
      const scaled = scale(t, start, stop, 0, 1);
      const eased = frame.timingFunction(scaled);
      Object.values(frame.interpVars).forEach((values) => {
        values.forEach((v) => {
          lerpValue(eased, v);
        });
      });
      if (transformFrames) {
        frame.transform(t, frame.vars);
      }
      return frame.vars;
    }).reduce((acc, vars) => {
      return { ...acc, ...vars };
    }, {});
  }
  async onStart() {
    this.reversed = false;
    if (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" || this.options.direction === "alternate" && this.iteration % 2 === 1) {
      this.reverse();
    }
    if (this.options.fillMode === "backwards" || this.options.fillMode === "both") {
      this.fillBackwards();
    }
    if (this.options.delay > 0) {
      this.pause();
      await sleep(this.options.delay);
      this.pause();
    }
    this.started = true;
  }
  async onEnd() {
    if (this.options.fillMode === "forwards" || this.options.fillMode === "both") {
      this.fillForwards();
    } else if (this.options.fillMode === "none" || this.options.fillMode === "backwards") {
      this.fillBackwards();
    }
    this.startTime = void 0;
    if (this.iteration === this.options.iterationCount - 1) {
      this.done = true;
      this.iteration = 0;
    } else {
      this.iteration += 1;
    }
  }
  async tick(t) {
    if (this.startTime === void 0) {
      await this.onStart();
      this.startTime = t + this.options.delay;
    }
    if (this.paused && this.pausedTime === 0) {
      this.pausedTime = t;
      return this.t;
    } else if (this.pausedTime > 0 && !this.paused) {
      const dt = t - this.pausedTime;
      this.startTime += dt;
      this.pausedTime = 0;
    }
    this.t = t - this.startTime;
    if (this.t >= this.options.duration) {
      await this.onEnd();
      this.t = this.options.duration;
    }
    return this.t;
  }
  async draw(t) {
    t = await this.tick(t);
    if (this.paused) {
      return;
    }
    this.interpFrames(t, true);
    if (!this.done) {
      this.handleId = requestAnimationFrame$1(this.draw.bind(this));
    } else {
      this.reset();
      if (this.resolvePromise) {
        this.resolvePromise();
      }
    }
  }
  async play() {
    return new Promise((resolve2) => {
      this.resolvePromise = resolve2;
      this.handleId = requestAnimationFrame$1(this.draw.bind(this));
    });
  }
  pause(draw = true) {
    if (this.paused && draw) {
      this.handleId = requestAnimationFrame$1(this.draw.bind(this));
    }
    if (this.started) {
      this.paused = !this.paused;
    }
    return this;
  }
  stop() {
    cancelAnimationFrame(this.handleId);
    this.reset();
  }
  playing() {
    return !(!this.started || this.paused);
  }
  reset() {
    this.done = false;
    this.started = false;
    this.paused = false;
    return this;
  }
  setTargets(...targets) {
    this.targets = targets;
    return this;
  }
  group(...animations) {
    return new AnimationGroup(this, ...animations);
  }
}
class CSSKeyframesAnimation extends Animation {
  constructor(options, ...targets) {
    super(options, targets);
  }
  fromVars(vars, transform) {
    transform ?? (transform = this.transform.bind(this));
    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      const percent = Math.round(i / (vars.length - 1) * 100);
      this.addFrame(percent, v, transform);
    }
    this.parse();
    return this;
  }
  fromString(keyframes, transform) {
    transform ?? (transform = this.transform.bind(this));
    const p = parseCSSKeyframes(keyframes);
    for (const [percent, frame] of p.entries()) {
      this.addFrame(percent, frame, transform);
      this.parsedVars.push(frame);
    }
    this.parse();
    return this;
  }
  transform(t, vars) {
    transformTargetsStyle(t, vars, this.targets);
  }
}
const ballAnim = (
  /*css*/
  `
@keyframes identifier {
    0% {
      top: 0;
      left: 0;
    }
    30% {
      top: 50px;
    }
    68%,
    72% {
      left: 50px;
    }
    100% {
      top: 100px;
      left: 100%;
    }
  }`
);
async function main() {
  const anim = new CSSKeyframesAnimation().fromString(ballAnim);
  console.log(anim);
}
main();
//# sourceMappingURL=index.cjs.map
