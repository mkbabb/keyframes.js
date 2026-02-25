const pn = 16.666666666666668, Te = (e) => !!e && e.constructor === Object;
function ct(e) {
  return Te(e) ? Object.entries(e).map(([t, n]) => [t, ct(n)]).reduce((t, [n, r]) => (t[n] = r, t), {}) : e != null && typeof e.clone == "function" ? e.clone() : Array.isArray(e) ? e.map(ct) : e;
}
async function os(e) {
  return await new Promise((t) => setTimeout(t, e));
}
function Q(e, t = {}) {
  const n = /* @__PURE__ */ new Map(), { maxCacheSize: r = 1 / 0, ttl: s = 1 / 0, keyFn: i = JSON.stringify } = t, o = function(...a) {
    const c = i.apply(this, a), l = Date.now();
    if (n.has(c)) {
      const h = n.get(c);
      if (l - h.timestamp <= s)
        return h.value;
      n.delete(c);
    }
    const u = e.apply(this, a);
    if (n.set(c, { value: u, timestamp: l }), n.size > r) {
      const h = n.keys().next().value;
      n.delete(h);
    }
    return u;
  };
  return o.cache = n, o;
}
const as = (e) => e.replace(
  /([-_][a-z])/gi,
  (t) => t.toUpperCase().replace("-", "").replace("_", "")
);
function cs(e) {
  return e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`);
}
function mn(e, t, n) {
  for (let r = e - 1; r >= 0; r--)
    if (n(t[r]))
      return r;
}
function vt(e) {
  if (typeof window < "u" && window.requestAnimationFrame)
    return window.requestAnimationFrame(e);
  let t = pn, n = Date.now();
  return setTimeout(() => {
    let r = Date.now(), s = r - n;
    n = r, t = Math.max(0, pn - s), e(r);
  }, t);
}
function er(e) {
  if (typeof window < "u" && window.cancelAnimationFrame)
    return window.cancelAnimationFrame(e);
  clearTimeout(e);
}
const nr = ["px", "cm", "mm", "Q", "in", "pc", "pt"], rr = [
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
], ls = [
  ...nr,
  ...rr
], us = ["s", "ms"], hs = ["deg", "rad", "grad", "turn"], ps = ["%"], ms = ["dpi", "dpcm", "dppx", "cqw"], ye = ["var", "calc"], fs = ["string", "var", "calc"], ds = [
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
], fn = (e, t = 2) => typeof e == "number" && Number.isNaN(e) ? "none" : String(e?.toFixed?.(t) ?? e).trim().replace(/\.0+$/, ""), dn = (e, t, n) => `${e}(${t.join(" ")} / ${n})`;
let H = class {
  constructor(e, t = 1) {
    this.colorSpace = e, this.alpha = t, this.components = /* @__PURE__ */ new Map();
  }
  components;
  toString() {
    const e = Array.from(this.components.values()).map(
      (n) => typeof n == "number" && Number.isNaN(n) ? "none" : n
    ), t = typeof this.alpha == "number" && Number.isNaN(this.alpha) ? "none" : this.alpha;
    return dn(this.colorSpace, e, t);
  }
  toFormattedString(e = 2) {
    const t = Array.from(this.components.values()).map(
      (r) => fn(r, e)
    ), n = fn(this.alpha, e);
    return dn(this.colorSpace, t, n);
  }
  valueOf() {
    return [...this.values(), this.alpha];
  }
  toJSON() {
    const e = {};
    for (const [t, n] of this.entries())
      e[t] = n;
    return e.alpha = this.alpha, e;
  }
  clone() {
    const e = this.constructor, t = new e();
    return t.alpha = ct(this.alpha), this.components.forEach((n, r) => {
      t.components.set(r, ct(n));
    }), t;
  }
  keys() {
    return [...this.components.keys(), "alpha"];
  }
  values() {
    return [...this.components.values(), this.alpha];
  }
  entries() {
    return [...this.components.entries(), ["alpha", this.alpha]];
  }
  getComponent(e) {
    return this.components.get(e);
  }
  setComponent(e, t) {
    this.components.set(e, t);
  }
};
class Pe extends H {
  constructor(t, n, r) {
    super(t, n), this.whitePoint = r;
  }
}
class q extends H {
  constructor(t, n, r, s) {
    super("rgb", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class jt extends H {
  constructor(t, n, r, s) {
    super("hsl", s), this.components.set("h", t), this.components.set("s", n), this.components.set("l", r);
  }
  get h() {
    return this.getComponent("h");
  }
  set h(t) {
    this.setComponent("h", t);
  }
  get s() {
    return this.getComponent("s");
  }
  set s(t) {
    this.setComponent("s", t);
  }
  get l() {
    return this.getComponent("l");
  }
  set l(t) {
    this.setComponent("l", t);
  }
}
class ze extends H {
  constructor(t, n, r, s) {
    super("hsv", s), this.components.set("h", t), this.components.set("s", n), this.components.set("v", r);
  }
  get h() {
    return this.getComponent("h");
  }
  set h(t) {
    this.setComponent("h", t);
  }
  get s() {
    return this.getComponent("s");
  }
  set s(t) {
    this.setComponent("s", t);
  }
  get v() {
    return this.getComponent("v");
  }
  set v(t) {
    this.setComponent("v", t);
  }
}
class Oe extends H {
  constructor(t, n, r, s) {
    super("hwb", s), this.components.set("h", t), this.components.set("w", n), this.components.set("b", r);
  }
  get h() {
    return this.getComponent("h");
  }
  set h(t) {
    this.setComponent("h", t);
  }
  get w() {
    return this.getComponent("w");
  }
  set w(t) {
    this.setComponent("w", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class ee extends Pe {
  constructor(t, n, r, s) {
    super("lab", s, "D50"), this.components.set("l", t), this.components.set("a", n), this.components.set("b", r);
  }
  get l() {
    return this.getComponent("l");
  }
  set l(t) {
    this.setComponent("l", t);
  }
  get a() {
    return this.getComponent("a");
  }
  set a(t) {
    this.setComponent("a", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class Ne extends H {
  constructor(t, n, r, s) {
    super("lch", s), this.components.set("l", t), this.components.set("c", n), this.components.set("h", r);
  }
  get l() {
    return this.getComponent("l");
  }
  set l(t) {
    this.setComponent("l", t);
  }
  get c() {
    return this.getComponent("c");
  }
  set c(t) {
    this.setComponent("c", t);
  }
  get h() {
    return this.getComponent("h");
  }
  set h(t) {
    this.setComponent("h", t);
  }
}
class ne extends Pe {
  constructor(t, n, r, s) {
    super("oklab", s, "D50"), this.components.set("l", t), this.components.set("a", n), this.components.set("b", r);
  }
  get l() {
    return this.getComponent("l");
  }
  set l(t) {
    this.setComponent("l", t);
  }
  get a() {
    return this.getComponent("a");
  }
  set a(t) {
    this.setComponent("a", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class $e extends H {
  constructor(t, n, r, s) {
    super("oklch", s), this.components.set("l", t), this.components.set("c", n), this.components.set("h", r);
  }
  get l() {
    return this.getComponent("l");
  }
  set l(t) {
    this.setComponent("l", t);
  }
  get c() {
    return this.getComponent("c");
  }
  set c(t) {
    this.setComponent("c", t);
  }
  get h() {
    return this.getComponent("h");
  }
  set h(t) {
    this.setComponent("h", t);
  }
}
class Y extends Pe {
  constructor(t, n, r, s) {
    super("xyz", s, "D65"), this.components.set("x", t), this.components.set("y", n), this.components.set("z", r);
  }
  get x() {
    return this.getComponent("x");
  }
  set x(t) {
    this.setComponent("x", t);
  }
  get y() {
    return this.getComponent("y");
  }
  set y(t) {
    this.setComponent("y", t);
  }
  get z() {
    return this.getComponent("z");
  }
  set z(t) {
    this.setComponent("z", t);
  }
}
class sr extends H {
  constructor(t, n) {
    super("kelvin", n), this.components.set("kelvin", t);
  }
  get kelvin() {
    return this.getComponent("kelvin");
  }
  set kelvin(t) {
    this.setComponent("kelvin", t);
  }
}
class Fe extends H {
  constructor(t, n, r, s) {
    super("srgb-linear", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class Ae extends H {
  constructor(t, n, r, s) {
    super("display-p3", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class Ve extends H {
  constructor(t, n, r, s) {
    super("a98-rgb", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class Re extends H {
  constructor(t, n, r, s) {
    super("prophoto-rgb", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
class je extends H {
  constructor(t, n, r, s) {
    super("rec2020", s), this.components.set("r", t), this.components.set("g", n), this.components.set("b", r);
  }
  get r() {
    return this.getComponent("r");
  }
  set r(t) {
    this.setComponent("r", t);
  }
  get g() {
    return this.getComponent("g");
  }
  set g(t) {
    this.setComponent("g", t);
  }
  get b() {
    return this.getComponent("b");
  }
  set b(t) {
    this.setComponent("b", t);
  }
}
function xe(e) {
  return e.unit === "color";
}
const ir = (e) => {
  const t = {}, n = (r, s = void 0) => {
    if (Array.isArray(r)) {
      r.forEach((o, a) => n(o, s));
      return;
    } else if (r instanceof _) {
      let o = r.name;
      s && (s.endsWith(r.name) ? o = s : o = `${s}.${r.name}`), r.values.forEach((a, c) => n(a, o));
      return;
    } else if (Te(r)) {
      for (const [o, a] of Object.entries(r)) {
        const c = s ? `${s}.${o}` : o;
        n(a, c);
      }
      return;
    }
    const i = s;
    t[i] == null && (t[i] = new st()), t[i].push(r), t[i] = t[i].flat();
  };
  return n(e), t;
}, bs = (e) => {
  const t = {};
  for (const [n, r] of Object.entries(e)) {
    const s = n.split(".");
    let i = t;
    for (let o = 0; o < s.length; o++) {
      const a = s[o];
      o === s.length - 1 ? Array.isArray(i) ? i.push(r) : i[a] = r : (a in i || (i[a] = {}), i = i[a]);
    }
  }
  return t;
}, gs = (e) => {
  const t = {};
  for (const [n, r] of Object.entries(e)) {
    const s = n.split("."), i = s[0];
    let o = t[i] ?? "", a = "", c = "";
    for (let u = 1; u < s.length; u++)
      a += `${s[u]}(`, c += ")";
    let l = "";
    s.length > 1 && Array.isArray(r) ? l = r.join(", ") : l = r.toString(), o += ` ${a}${l}${c}`, t[i] = o.trim();
  }
  return t;
};
new Set(ds);
const or = (e) => {
  const t = e.name, n = e.valueOf();
  if (!e.name.startsWith("matrix"))
    throw new Error("Input must be a matrix or matrix3d value");
  const r = {
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
  if (e.name === "matrix")
    return {
      ...r,
      scaleX: n[0] ?? 1,
      skewY: n[1] ?? 0,
      skewX: n[2] ?? 0,
      scaleY: n[3] ?? 1,
      translateX: n[4] ?? 0,
      translateY: n[5] ?? 0,
      rotateZ: Math.atan2(n[1] ?? 0, n[0] ?? 1),
      rotateY: Math.atan2(-(n[2] ?? 0), n[0] ?? 1),
      rotateX: Math.atan2(n[1] ?? 0, n[3] ?? 1)
    };
  if (t === "matrix3d") {
    if (n.length === 4)
      return {
        ...r,
        translateX: n[0] ?? 0,
        translateY: n[1] ?? 0,
        translateZ: n[2] ?? 0,
        perspectiveW: n[3] ?? 1
      };
    if (n.length === 16)
      return {
        scaleX: n[0] ?? 1,
        skewY: n[1] ?? 0,
        skewX: n[4] ?? 0,
        scaleY: n[5] ?? 1,
        scaleZ: n[10] ?? 1,
        skewZ: n[2] ?? 0,
        translateX: n[12] ?? 0,
        translateY: n[13] ?? 0,
        translateZ: n[14] ?? 0,
        rotateX: Math.atan2(-(n[9] ?? 0), n[10] ?? 1),
        rotateY: Math.atan2(
          n[8] ?? 0,
          Math.sqrt(
            Math.pow(n[0] ?? 1, 2) + Math.pow(n[1] ?? 0, 2)
          )
        ),
        rotateZ: Math.atan2(n[1] ?? 0, n[0] ?? 1),
        perspectiveX: n[3] ?? 0,
        perspectiveY: n[7] ?? 0,
        perspectiveZ: n[11] ?? 0,
        perspectiveW: n[15] ?? 1
      };
  }
  throw new Error("Unsupported matrix type or invalid number of values");
};
function ws(e, t) {
  let n = e;
  return t === "cm" ? n *= 96 / 2.54 : t === "mm" ? n *= 96 / 25.4 : t === "in" ? n *= 96 : t === "pt" ? n *= 4 / 3 : t === "pc" && (n *= 16), n;
}
function ks(e, t, n, r) {
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
  else if (t === "%" && n?.parentElement && r) {
    const s = parseFloat(
      getComputedStyle(n.parentElement).getPropertyValue(r)
    );
    e = e / 100 * s;
  } else t === "ex" || t === "ch" ? e *= parseFloat(getComputedStyle(n).fontSize) ?? 16 : e = ws(e, t);
  return e;
}
function ar(e, t) {
  return t === "s" && (e *= 1e3), e;
}
function cr(e, t) {
  return t === "grad" ? e *= 0.9 : t === "rad" ? e *= 180 / Math.PI : t === "turn" && (e *= 360), e;
}
function ys(e, t) {
  return t === "dpcm" ? e *= 2.54 : t === "dppx" && (e *= 96), e;
}
class d {
  constructor(t, n, r, s, i, o) {
    this.value = t, this.unit = n, this.superType = r, this.subProperty = s, this.property = i, this.targets = o;
  }
  setSubProperty(t) {
    this.subProperty = t;
  }
  setProperty(t) {
    this.property = t;
  }
  setTargets(t) {
    this.targets = t;
  }
  valueOf() {
    return this.value;
  }
  setValue(t) {
    this.value = t;
  }
  toString() {
    return this.value == null ? "" : this.unit == null || this.unit === "string" ? `${this.value}` : xe(this) ? this.value.toString() : this.unit === "var" ? `var(${this.value})` : this.unit === "calc" ? `calc(${this.value})` : `${this.value}${this.unit}`;
  }
  toJSON() {
    return this.valueOf();
  }
  toFixed(t = 2) {
    const n = Number(this.value).toFixed(t).replace(/\.0+$/, "");
    return new d(n).coalesce(this, !0).toString();
  }
  clone() {
    return new d(
      ct(this.value),
      this.unit,
      ct(this.superType),
      this.subProperty,
      this.property
    );
  }
  coalesce(t, n = !1) {
    return t == null ? this : fs.includes(this.unit) ? this : n ? (this.unit ??= t.unit, this.superType ??= t.superType, this.subProperty ??= t.subProperty, this.property ??= t.property, this.targets ??= t.targets, this) : new d(
      ct(this.value),
      this.unit ?? t.unit,
      ct(this.superType ?? t.superType),
      this.subProperty ?? t.subProperty,
      this.property ?? t.property,
      this.targets ?? t.targets
    );
  }
}
class _ {
  constructor(t, n) {
    this.name = t, this.values = n, n.forEach((r) => {
      this.setSubProperty(t);
    });
  }
  setSubProperty(t) {
    this.values.forEach((n) => n.setSubProperty(t));
  }
  setProperty(t) {
    this.values.forEach((n) => n.setProperty(t));
  }
  setTargets(t) {
    this.values.forEach((n) => n.setTargets(t));
  }
  setValue(t, n) {
    n != null ? this.values[n].setValue(t) : this.values.forEach((r) => r.setValue(t));
  }
  valueOf() {
    return this.values.map((t) => t.valueOf());
  }
  toString() {
    return `${this.name}(${this.values.map((t) => t.toString()).join(", ")})`;
  }
  toJSON() {
    return {
      [this.name]: this.values.map((t) => t.toJSON())
    };
  }
  clone() {
    return new _(
      this.name,
      this.values.map((t) => t.clone())
    );
  }
}
class st extends Array {
  constructor(...t) {
    super(...t);
  }
  setSubProperty(t) {
    this.forEach((n) => n.setSubProperty(t));
  }
  setProperty(t) {
    this.forEach((n) => n.setProperty(t));
  }
  setTargets(t) {
    this.forEach((n) => n.setTargets(t));
  }
  setValue(t, n) {
    n != null ? this[n].setValue(t) : this.forEach((r) => r.setValue(t));
  }
  valueOf() {
    return this.map((t) => t.valueOf());
  }
  toString() {
    return this.map((t) => t.toString()).join(" ");
  }
  toJSON() {
    return this.map((t) => t.toJSON());
  }
  clone() {
    return new st(...this.map((t) => t.clone()));
  }
}
const bn = 4;
function gn(e, t = "^", n = !1) {
  const r = e.src.split(`
`), s = Math.min(r.length - 1, e.getLineNumber()), i = Math.max(s - bn, 0), o = Math.min(s + bn + 1, r.length), a = r.slice(i, o);
  if (t) {
    const c = " ".repeat(e.getColumnNumber()) + t;
    a.splice(s - i + 1, 0, c);
  }
  return a.map((c, l) => `      ${i + l + 1}| ${c}`).join(`
`);
}
const dt = /* @__PURE__ */ new Map();
function lr(e) {
  if (dt.has(e.id))
    return dt.get(e.id);
  const t = (r, s) => {
    if (dt.has(r.id))
      return dt.get(r.id);
    const { name: i, args: o, parser: a } = r.context, c = a != null ? t(a, s) : "unknown", l = (() => {
      switch (i) {
        case "string":
          return `"${o[0]}"`;
        case "regex":
        case "regexConcat":
        case "regexWrap":
          return `${o[0]}`;
        case "wrap":
        case "trim": {
          const [u, h] = o;
          return `${t(u, s)} ${c} ${t(h, s)}`;
        }
        case "trimWhitespace":
          return `${c}?w`;
        case "not":
          return `!${c}`;
        case "opt":
          return `${c}?`;
        case "next": {
          const [u] = o;
          return `${c} >> ${t(u, s)}`;
        }
        case "skip": {
          const [u] = o;
          return `${c} << ${t(u, s)}`;
        }
        case "map":
          return c;
        case "all":
        case "then":
          return `[${o.map(
            (u) => t(u, s)
          ).join(", ")}]`;
        case "any":
        case "or":
          return o.map(
            (u) => t(u, s)
          ).join(" | ");
        case "many": {
          const [u, h] = o, b = h === 1 / 0 ? `${u},` : `${u},${h}`;
          return `${c} {${b}}`;
        }
        case "sepBy":
          return `${c} sepBy ${t(o[0], s)}`;
        case "lazy": {
          const [u] = o, h = hr(u);
          if (s)
            return i;
          {
            const b = t(h, h.id);
            return dt.set(h.id, b), b;
          }
        }
        case "debug":
          return c;
        default:
          return;
      }
    })() ?? i ?? "unknown";
    return s && dt.set(r.id, l), l;
  }, n = t(e);
  return dt.set(e.id, n), n;
}
function ur(e, t = "", n = "") {
  const r = String(e.value), s = e.offset >= e.src.length, i = `${`[${e.isError ? "err" : s ? "done" : "ok"}]`} ${t} offset=${e.offset} value=${r}`, o = e.offset >= e.src.length ? gn(e, "", e.isError) : gn(e, "^", e.isError);
  return `${i}
${o}`;
}
function xs(e, t = "", n = !1, r = console.log) {
  const s = (i) => {
    const o = e.parser(i), a = n ? lr(e) : e.context.name ?? "", c = ur(
      o,
      t,
      a
    );
    return r(c), o;
  };
  return new S(s, I("debug", e, r));
}
class Yt {
  constructor(t, n = void 0, r = 0, s = !1, i = 0) {
    this.src = t, this.value = n, this.offset = r, this.isError = s, this.furthest = i;
  }
  ok(t, n = 0) {
    return n += this.offset, new Yt(this.src, t, n, !1);
  }
  err(t, n = 0) {
    const r = this.ok(t, n);
    return r.isError = !0, r;
  }
  from(t, n = 0) {
    return n += this.offset, new Yt(this.src, t, n, this.isError);
  }
  getColumnNumber() {
    const t = this.offset, n = this.src.lastIndexOf(`
`, t), r = n === -1 ? t : t - (n + 1);
    return Math.max(0, r);
  }
  getLineNumber() {
    const t = this.src.lastIndexOf(`
`, this.offset);
    return t >= 0 ? this.src.slice(0, t).split(`
`).length : 0;
  }
  toString() {
    return ur(this);
  }
}
function I(e, t, ...n) {
  return {
    name: e,
    parser: t,
    args: n
  };
}
let Ss = 0;
const bt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map();
let Ft;
function D(e) {
  return (!Ft || e.offset > Ft.offset) && (Ft = e), Ft;
}
function hr(e) {
  return e.parser ? e.parser : e.parser = e();
}
class S {
  constructor(t, n = {}) {
    this.parser = t, this.context = n;
  }
  id = Ss++;
  state;
  reset() {
    Ft = void 0, bt.clear(), qt.clear();
  }
  parseState(t) {
    this.reset();
    const n = this.parser(new Yt(t));
    return this.state = D(n), this.state.isError = n.isError, this.state.isError, n;
  }
  parse(t) {
    return this.parseState(t).value;
  }
  getCijKey(t) {
    return `${this.id}${t.offset}`;
  }
  atLeftRecursionLimit(t) {
    return (qt.get(this.getCijKey(t)) ?? 0) > t.src.length - t.offset;
  }
  memoize() {
    const t = (n) => {
      const r = this.getCijKey(n), s = qt.get(r) ?? 0;
      let i = bt.get(this.id);
      if (i && i.offset >= n.offset)
        return i;
      if (this.atLeftRecursionLimit(n))
        return n.err(void 0);
      qt.set(r, s + 1);
      const o = this.parser(n);
      return i = bt.get(this.id), i && i.offset > o.offset ? o.offset = i.offset : i || bt.set(this.id, o), o;
    };
    return new S(
      t,
      I("memoize", this)
    );
  }
  mergeMemos() {
    const t = (n) => {
      let r = bt.get(this.id);
      if (r)
        return r;
      if (this.atLeftRecursionLimit(n))
        return n.err(void 0);
      const s = this.parser(n);
      return r = bt.get(this.id), r || bt.set(this.id, s), s;
    };
    return new S(
      t,
      I("mergeMemo", this)
    );
  }
  then(t) {
    const n = (r) => {
      const s = this.parser(r);
      if (!s.isError) {
        const i = t.parser(s);
        if (!i.isError)
          return i.ok([s.value, i.value]);
      }
      return D(r), r.err(void 0);
    };
    return new S(
      n,
      I("then", this, this, t)
    );
  }
  or(t) {
    const n = (r) => {
      const s = this.parser(r);
      return s.isError ? t.parser(r) : s;
    };
    return new S(
      n,
      I("or", this, this, t)
    );
  }
  chain(t, n = !1) {
    const r = (s) => {
      const i = this.parser(s);
      return i.isError ? i : i.value || n ? t(i.value).parser(i) : s;
    };
    return new S(
      r,
      I("chain", this, t)
    );
  }
  map(t, n = !1) {
    const r = (s) => {
      const i = this.parser(s);
      return !i.isError || n ? i.ok(t(i.value)) : i;
    };
    return new S(
      r,
      I("map", this)
    );
  }
  mapState(t) {
    const n = (r) => {
      const s = this.parser(r);
      return t(s, r);
    };
    return new S(
      n,
      I("mapState", this)
    );
  }
  skip(t) {
    const n = (r) => {
      const s = this.parser(r);
      if (!s.isError) {
        const i = t.parser(s);
        if (!i.isError)
          return i.ok(s.value);
      }
      return D(r), r.err(void 0);
    };
    return new S(
      n,
      I("skip", this, t)
    );
  }
  next(t) {
    const n = this.then(t).map(([, r]) => r);
    return n.context = I("next", this, t), n;
  }
  opt() {
    const t = (n) => {
      const r = this.parser(n);
      return r.isError ? (D(n), n.ok(void 0)) : r;
    };
    return new S(
      t,
      I("opt", this)
    );
  }
  not(t) {
    const n = (s) => this.parser(s).isError ? (D(s), s.ok(s.value)) : s.err(void 0), r = (s) => {
      const i = this.parser(s);
      return i.isError ? (D(s), i) : t.parser(s).isError ? i : (D(s), s.err(void 0));
    };
    return new S(
      t ? r : n,
      I("not", this, t)
    );
  }
  wrap(t, n, r = !0) {
    if (!r)
      return T(t, this, n);
    const s = t.next(this).skip(n);
    return s.context = I("wrap", this, t, n), s;
  }
  trim(t = w, n = !0) {
    if (!n)
      return T(t, this, t);
    if (t.context?.name === "whitespace") {
      const r = (s) => {
        const i = kn(s), o = this.parser(i);
        return o.isError ? (D(s), s.err(void 0)) : kn(o);
      };
      return new S(
        r,
        I("trimWhitespace", this)
      );
    }
    return this.wrap(t, t);
  }
  many(t = 0, n = 1 / 0) {
    const r = (s) => {
      const i = [];
      let o = s;
      for (let a = 0; a < n; a += 1) {
        const c = this.parser(o);
        if (c.isError)
          break;
        i.push(c.value), o = c;
      }
      return i.length >= t ? o.ok(i) : (D(s), s.err([]));
    };
    return new S(
      r,
      I("many", this, t, n)
    );
  }
  sepBy(t, n = 0, r = 1 / 0) {
    const s = (i) => {
      const o = [];
      let a = i;
      for (let c = 0; c < r; c += 1) {
        const l = this.parser(a);
        if (l.isError)
          break;
        a = l, o.push(a.value);
        const u = t.parser(a);
        if (u.isError)
          break;
        a = u;
      }
      return o.length > n ? a.ok(o) : (D(i), i.err([]));
    };
    return new S(
      s,
      I("sepBy", this, t)
    );
  }
  eof() {
    const t = this.skip(vs());
    return t.context = I("eof", this), t;
  }
  debug(t = "", n = !1, r = console.log) {
    return xs(this, t, n, r);
  }
  toString() {
    return lr(this);
  }
  static lazy(t) {
    const n = (r) => hr(t).parser(r);
    return new S(
      n,
      I("lazy", void 0, t)
    );
  }
}
function vs() {
  const e = (t) => t.offset >= t.src.length ? t.ok(void 0) : (D(t), t.err());
  return new S(
    e,
    I("eof", void 0)
  );
}
function g(...e) {
  const t = (n) => {
    for (const r of e) {
      const s = r.parser(n);
      if (!s.isError)
        return s;
    }
    return D(n), n.err(void 0);
  };
  return new S(
    e.length === 1 ? e[0].parser : t,
    I("any", void 0, ...e)
  );
}
function T(...e) {
  const t = (n) => {
    const r = [];
    let s = n;
    for (const i of e) {
      const o = i.parser(s);
      if (o.isError)
        return o;
      o.value !== void 0 && r.push(o.value), s = o;
    }
    return D(s), s.ok(r);
  };
  return new S(
    e.length === 1 ? e[0].parser : t,
    I("all", void 0, ...e)
  );
}
function z(e) {
  const t = (n) => {
    if (n.offset >= n.src.length)
      return n.err(void 0);
    const r = n.src.slice(n.offset, n.offset + e.length);
    return r === e ? n.ok(r, r.length) : (D(n), n.err(void 0));
  };
  return new S(
    t,
    I("string", void 0, e)
  );
}
function G(e, t = (n) => n?.[0] ?? null) {
  const n = e.flags.replace(/y/g, ""), r = new RegExp(e, n + "y"), s = (i) => {
    if (i.offset >= i.src.length)
      return i.err(void 0);
    r.lastIndex = i.offset;
    const o = t(i.src.match(r));
    return o ? i.ok(o, r.lastIndex - i.offset) : o === "" ? i.ok(void 0) : (D(i), i.err(void 0));
  };
  return new S(
    s,
    I("regex", void 0, e)
  );
}
const wn = /\s*/y, kn = (e) => {
  if (e.offset >= e.src.length)
    return e;
  wn.lastIndex = e.offset;
  const t = e.src.match(wn)?.[0] ?? "";
  return e.ok(e.value, t.length);
}, w = G(/\s*/);
w.context.name = "whitespace";
const p = (e) => {
  const t = new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return G(t);
}, Lt = G(/-?[a-zA-Z][a-zA-Z0-9-]*/), Le = p("none"), Cs = G(/-?\d+/).map(Number), it = G(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);
function Es(e) {
  return new S((t) => t.ok(e, 0));
}
function Ms(e) {
  return new S((t) => t.err(void 0, 0));
}
function et(e, t) {
  const n = e.parseState(t);
  if (n.isError)
    throw new Error(`Parse error at offset ${n.offset}`);
  return n.value;
}
function N(e, t) {
  const [n, r, s] = e;
  return [
    t[0] * n + t[1] * r + t[2] * s,
    t[3] * n + t[4] * r + t[5] * s,
    t[6] * n + t[7] * r + t[8] * s
  ];
}
function lt(e) {
  const [t, n, r, s, i, o, a, c, l] = e, u = i * l - o * c, h = -(s * l - o * a), b = s * c - i * a, y = 1 / (t * u + n * h + r * b);
  return [
    u * y,
    (r * c - n * l) * y,
    (n * o - r * i) * y,
    h * y,
    (t * l - r * a) * y,
    (r * s - t * o) * y,
    b * y,
    (n * a - t * c) * y,
    (t * i - n * s) * y
  ];
}
const F = 255, m = {
  "%": { min: 0, max: 100 },
  number: { min: 0, max: 1 }
}, me = {
  "%": m["%"],
  number: { min: 0, max: F }
}, L = {
  "%": m["%"],
  number: m.number
}, $t = {
  deg: { min: 0, max: 360 },
  number: { min: 0, max: 360 },
  "%": m["%"]
}, f = {
  rgb: {
    r: me,
    g: me,
    b: me,
    alpha: m
  },
  hsl: {
    h: $t,
    s: { "%": m["%"], number: m.number },
    l: { "%": m["%"], number: m.number },
    alpha: m
  },
  hsv: {
    h: $t,
    s: { "%": m["%"], number: m.number },
    v: { "%": m["%"], number: m.number },
    alpha: m
  },
  hwb: {
    h: $t,
    w: { "%": m["%"], number: m.number },
    b: { "%": m["%"], number: m.number },
    alpha: m
  },
  lab: {
    l: { "%": m["%"], number: m["%"] },
    a: { number: { min: -125, max: 125 }, "%": { min: -100, max: 100 } },
    b: { number: { min: -125, max: 125 }, "%": { min: -100, max: 100 } },
    alpha: m
  },
  lch: {
    l: { "%": m["%"], number: m["%"] },
    c: { number: { min: 0, max: 150 }, "%": m["%"] },
    h: $t,
    alpha: m
  },
  oklab: {
    l: { "%": m["%"], number: m["%"] },
    a: { number: { min: -0.4, max: 0.4 }, "%": { min: -100, max: 100 } },
    b: { number: { min: -0.4, max: 0.4 }, "%": { min: -100, max: 100 } },
    alpha: m
  },
  oklch: {
    l: { "%": m["%"], number: m["%"] },
    c: { number: { min: 0, max: 0.5 }, "%": m["%"] },
    h: $t,
    alpha: m
  },
  xyz: {
    x: { "%": m["%"], number: m.number },
    y: { "%": m["%"], number: m.number },
    z: { "%": m["%"], number: m.number },
    alpha: m
  },
  kelvin: {
    kelvin: { number: { min: 1e3, max: 4e4 } },
    alpha: m
  },
  "srgb-linear": {
    r: L,
    g: L,
    b: L,
    alpha: m
  },
  "display-p3": {
    r: L,
    g: L,
    b: L,
    alpha: m
  },
  "a98-rgb": {
    r: L,
    g: L,
    b: L,
    alpha: m
  },
  "prophoto-rgb": {
    r: L,
    g: L,
    b: L,
    alpha: m
  },
  rec2020: {
    r: L,
    g: L,
    b: L,
    alpha: m
  }
}, W = "%", Is = {
  rgb: {
    r: "",
    g: "",
    b: "",
    alpha: W
  },
  hsl: {
    h: "deg",
    s: "%",
    l: "%",
    alpha: W
  },
  hsv: {
    h: "deg",
    s: "%",
    v: "%",
    alpha: W
  },
  hwb: {
    h: "deg",
    w: "%",
    b: "%",
    alpha: W
  },
  lab: {
    l: "%",
    a: "",
    b: "",
    alpha: W
  },
  lch: {
    l: "%",
    c: "",
    h: "deg",
    alpha: W
  },
  oklab: {
    l: "%",
    a: "",
    b: "",
    alpha: W
  },
  oklch: {
    l: "%",
    c: "",
    h: "deg",
    alpha: W
  },
  xyz: {
    x: "%",
    y: "%",
    z: "%",
    alpha: W
  },
  kelvin: {
    kelvin: "K",
    alpha: W
  },
  "srgb-linear": {
    r: "",
    g: "",
    b: "",
    alpha: W
  },
  "display-p3": {
    r: "",
    g: "",
    b: "",
    alpha: W
  },
  "a98-rgb": {
    r: "",
    g: "",
    b: "",
    alpha: W
  },
  "prophoto-rgb": {
    r: "",
    g: "",
    b: "",
    alpha: W
  },
  rec2020: {
    r: "",
    g: "",
    b: "",
    alpha: W
  }
}, Bs = [
  0.3127 / 0.329,
  1,
  (1 - 0.3127 - 0.329) / 0.329
], Ts = [
  0.3457 / 0.3585,
  1,
  (1 - 0.3457 - 0.3585) / 0.3585
], We = [
  1.0479297925449969,
  0.022946870601609652,
  -0.05019226628920524,
  0.02962780877005599,
  0.9904344267538799,
  -0.017073799063418826,
  -0.009243040646204504,
  0.015055191490298152,
  0.7518742814281371
], pr = lt(We), mr = {
  D65: Bs,
  D50: Ts
}, fr = [
  0.819022437996703,
  0.3619062600528904,
  -0.1288737815209879,
  0.0329836539323885,
  0.9292868615863434,
  0.0361446663506424,
  0.0481771893596242,
  0.2642395317527308,
  0.6335478284694309
], Ps = lt(fr), dr = [
  0.210454268309314,
  0.7936177747023054,
  -0.0040720430116193,
  1.9779985324311684,
  -2.42859224204858,
  0.450593709617411,
  0.0259040424655478,
  0.7827717124575296,
  -0.8086757549230774
], zs = lt(dr), k = [
  4.0767416621,
  -3.3077115913,
  0.2309699292,
  -1.2684380046,
  2.6097574011,
  -0.3413193965,
  -0.0041960863,
  -0.7034186147,
  1.707614701
], nt = [
  0.4122214708,
  0.5363325363,
  0.0514459929,
  0.2119034982,
  0.6806995451,
  0.1073969566,
  0.0883024619,
  0.2817188376,
  0.6299787005
], V = {
  l: [1, 0.3963377774, 0.2158037573],
  m: [1, -0.1055613458, -0.0638541728],
  s: [1, -0.0894841775, -1.291485548]
}, Os = [
  {
    // Red sector: -1.88170328*a - 0.80936493*b > 1
    test: (e, t) => -1.88170328 * e - 0.80936493 * t > 1,
    k0: 1.19086277,
    k1: 1.76576728,
    k2: 0.59662641,
    k3: 0.75515197,
    k4: 0.56771245,
    wl: 4.0767416621,
    wm: -3.3077115913,
    ws: 0.2309699292
  },
  {
    // Green sector: 1.81444104*a - 1.19445276*b > 1
    test: (e, t) => 1.81444104 * e - 1.19445276 * t > 1,
    k0: 0.73956515,
    k1: -0.45954404,
    k2: 0.08285427,
    k3: 0.1254107,
    k4: 0.14503204,
    wl: -1.2684380046,
    wm: 2.6097574011,
    ws: -0.3413193965
  },
  {
    // Blue sector (fallback)
    test: () => !0,
    k0: 1.35733652,
    k1: -915799e-8,
    k2: -1.1513021,
    k3: -0.50559606,
    k4: 692167e-8,
    wl: -0.0041960863,
    wm: -0.7034186147,
    ws: 1.707614701
  }
], yn = {
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
  transparent: "rgba(0, 0, 0, 0)",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
  padaleckipink: "oklch(100% 0.42 360deg / 71.70%)",
  "lodge-blu-color": "rgb(53	101	144)",
  lavendi: "oklch(79.90% 0.11 318.24deg / 100%)",
  shadyshroom: "oklch(53% 0.07 21.60deg / 100%)",
  patriarchalplum: "oklch(31.20% 0.11 19.80deg / 100%)"
};
function J(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function E(e, t, n, r = 0, s = 1) {
  const i = (s - r) / (n - t);
  if (n === t)
    throw new Error("fromMax and fromMin cannot be equal");
  return (e - t) * i + r;
}
function Tt(e, t, n) {
  return (1 - e) * t + e * n;
}
function Gt(e, t) {
  const n = t.length - 1, r = [...t];
  for (let s = 1; s <= n; s++)
    for (let i = 0; i <= n - s; i++)
      r[i] = Tt(e, r[i], r[i + 1]);
  return r[0];
}
function Ns(e, t, n, r, s) {
  return [Gt(e, [0, t, r, 1]), Gt(e, [0, n, s, 1])];
}
function re(e, t) {
  const n = t.map((s) => s[0]), r = t.map((s) => s[1]);
  return [Gt(e, n), Gt(e, r)];
}
const br = 2.4, Ht = 0.055, De = 12.92, $s = 0.04045, gr = $s / De;
function fe(e) {
  const t = e < 0 ? -1 : 1, n = e * t;
  return n <= gr ? e / De : t * ((n + Ht) / (1 + Ht)) ** br;
}
function de(e) {
  const t = e < 0 ? -1 : 1, n = e * t;
  return n <= gr ? e * De : t * ((1 + Ht) * n ** (1 / br) - Ht);
}
function be(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function Ue(e, t, n) {
  const r = e + V.l[1] * t + V.l[2] * n, s = e + V.m[1] * t + V.m[2] * n, i = e + V.s[1] * t + V.s[2] * n, o = r * r * r, a = s * s * s, c = i * i * i;
  return [
    k[0] * o + k[1] * a + k[2] * c,
    k[3] * o + k[4] * a + k[5] * c,
    k[6] * o + k[7] * a + k[8] * c
  ];
}
function Fs(e, t, n) {
  return e >= 0 && e <= 1 && t >= 0 && t <= 1 && n >= 0 && n <= 1;
}
function As(e, t) {
  const n = Os.find((v) => v.test(e, t)), { k0: r, k1: s, k2: i, k3: o, k4: a, wl: c, wm: l, ws: u } = n;
  let h = r + s * e + i * t + o * e * e + a * e * t;
  const b = V.l[1] * e + V.l[2] * t, y = V.m[1] * e + V.m[2] * t, O = V.s[1] * e + V.s[2] * t;
  {
    const v = 1 + h * b, $ = 1 + h * y, x = 1 + h * O, M = v * v * v, j = $ * $ * $, ht = x * x * x, pt = 3 * b * v * v, mt = 3 * y * $ * $, Pt = 3 * O * x * x, zt = 6 * b * b * v, Ot = 6 * y * y * $, Nt = 6 * O * O * x, xt = c * M + l * j + u * ht, ft = c * pt + l * mt + u * Pt, Ut = c * zt + l * Ot + u * Nt;
    h = h - xt * ft / (ft * ft - 0.5 * xt * Ut);
  }
  return h;
}
function Vs(e, t) {
  const n = As(e, t), [r, s, i] = Ue(1, n * e, n * t), o = Math.cbrt(1 / Math.max(r, s, i)), a = o * n;
  return { L: o, C: a };
}
function Rs(e, t, n, r, s, i) {
  let o;
  if ((n - s) * i.C - (i.L - s) * r <= 0)
    o = i.C * s / (r * i.L + i.C * (s - n));
  else {
    o = i.C * (s - 1) / (r * (i.L - 1) + i.C * (s - n));
    const a = n - s, c = r, l = V.l[1] * e + V.l[2] * t, u = V.m[1] * e + V.m[2] * t, h = V.s[1] * e + V.s[2] * t, b = a + c * l, y = a + c * u, O = a + c * h;
    {
      const v = s * (1 - o) + o * n, $ = o * r, x = v + $ * l, M = v + $ * u, j = v + $ * h, ht = x * x * x, pt = M * M * M, mt = j * j * j, Pt = 3 * b * x * x, zt = 3 * y * M * M, Ot = 3 * O * j * j, Nt = 6 * b * b * x, xt = 6 * y * y * M, ft = 6 * O * O * j, Ut = k[0] * ht + k[1] * pt + k[2] * mt - 1, ae = k[0] * Pt + k[1] * zt + k[2] * Ot, rs = k[0] * Nt + k[1] * xt + k[2] * ft, an = ae / (ae * ae - 0.5 * Ut * rs);
      let ce = -Ut * an;
      const cn = k[3] * ht + k[4] * pt + k[5] * mt - 1, le = k[3] * Pt + k[4] * zt + k[5] * Ot, ss = k[3] * Nt + k[4] * xt + k[5] * ft, ln = le / (le * le - 0.5 * cn * ss);
      let ue = -cn * ln;
      const un = k[6] * ht + k[7] * pt + k[8] * mt - 1, he = k[6] * Pt + k[7] * zt + k[8] * Ot, is = k[6] * Nt + k[7] * xt + k[8] * ft, hn = he / (he * he - 0.5 * un * is);
      let pe = -un * hn;
      ce = an >= 0 ? ce : 1 / 0, ue = ln >= 0 ? ue : 1 / 0, pe = hn >= 0 ? pe : 1 / 0, o += Math.min(ce, ue, pe);
    }
  }
  return o;
}
const js = 1e-5, Ls = 0.05;
function Ws(e, t, n) {
  const [r, s, i] = Ue(e, t, n);
  if (Fs(r, s, i))
    return [e, t, n];
  const o = Math.max(js, Math.sqrt(t * t + n * n)), a = t / o, c = n / o, l = Vs(a, c), u = e - 0.5, h = 0.5 + Math.abs(u) + Ls * o, b = 0.5 * (1 + Math.sign(u) * (h - Math.sqrt(h * h - 2 * Math.abs(u)))), y = Rs(a, c, e, o, b, l), O = b * (1 - y) + y * e, v = y * o;
  return [O, v * a, v * c];
}
function Ds(e, t, n) {
  const r = fe(e), s = fe(t), i = fe(n), o = Math.cbrt(nt[0] * r + nt[1] * s + nt[2] * i), a = Math.cbrt(nt[3] * r + nt[4] * s + nt[5] * i), c = Math.cbrt(nt[6] * r + nt[7] * s + nt[8] * i);
  return [
    0.2104542553 * o + 0.793617785 * a - 0.0040720468 * c,
    1.9779984951 * o - 2.428592205 * a + 0.4505937099 * c,
    0.0259040371 * o + 0.7827717662 * a - 0.808675766 * c
  ];
}
function Us(e, t, n) {
  if (e >= 0 && e <= 1 && t >= 0 && t <= 1 && n >= 0 && n <= 1)
    return [e, t, n];
  const [r, s, i] = Ds(e, t, n), [o, a, c] = Ws(r, s, i), [l, u, h] = Ue(o, a, c);
  return [
    be(de(l), 0, 1),
    be(de(u), 0, 1),
    be(de(h), 0, 1)
  ];
}
const at = 16, qs = (e) => {
  if (e = e.slice(1), e.length <= 4) {
    const t = parseInt(e[0] + e[0], at), n = parseInt(e[1] + e[1], at), r = parseInt(e[2] + e[2], at), s = e[3] ? parseInt(e[3] + e[3], at) / F : 1;
    return new q(t, n, r, s);
  } else {
    const t = parseInt(e.slice(0, 2), at), n = parseInt(e.slice(2, 4), at), r = parseInt(e.slice(4, 6), at), s = e.length === 8 ? parseInt(e.slice(6, 8), at) / F : 1;
    return new q(t, n, r, s);
  }
}, wr = 1e3, kr = 4e4, yr = 100, xr = ({ kelvin: e, alpha: t }) => {
  e = J(e, wr, kr) / yr;
  let n, r, s;
  return e <= 66 ? n = F : (n = e - 60, n = 329.698727446 * n ** -0.1332047592), n = J(n, 0, F) / F, e <= 66 ? (r = e, r = 99.4708025861 * Math.log(r) - 161.1195681661) : (r = e - 60, r = 288.1221695283 * r ** -0.0755148492), r = J(r, 0, F) / F, e >= 66 ? s = F : e <= 19 ? s = 0 : (s = e - 10, s = 138.5177312231 * Math.log(s) - 305.0447927307), s = J(s, 0, F) / F, new q(n, r, s, t);
}, Ks = ({ r: e, g: t, b: n, alpha: r }) => {
  e = J(e * F, 0, F), t = J(t * F, 0, F), n = J(n * F, 0, F);
  let s;
  if (n === F ? s = 6600 : n === 0 ? s = 1900 : s = Math.exp((n + 305.0447927307) / 138.5177312231) + 10, e < F) {
    const o = (329.698727446 / e) ** -7.507239275877164 + 60;
    s = Math.max(s, o);
  }
  const i = s <= 6600 ? Math.exp((t + 161.1195681661) / 99.4708025861) : (288.1221695283 / t) ** (1 / -0.0755148492) + 60;
  return s = (s + i) / 2, s = J(Math.round(s * yr), wr, kr), new sr(s, r);
}, Sr = ({ h: e, s: t, v: n, alpha: r }) => {
  const s = n - n * t / 2;
  let i;
  return s === 0 || s === 1 ? i = 0 : i = (n - s) / Math.min(s, 1 - s), new jt(e, i, s, r);
}, vr = ({ h: e, s: t, l: n, alpha: r }) => {
  const s = n + t * Math.min(n, 1 - n);
  let i;
  return s === 0 ? i = 0 : i = 2 * (1 - n / s), new ze(e, i, s, r);
}, Xs = ({ h: e, w: t, b: n, alpha: r }) => {
  let s, i;
  const o = t + n;
  return o >= 1 ? (i = t / o, s = 0) : (i = 1 - n, s = i === 0 ? 0 : 1 - t / i), Sr(new ze(e, s, i, r));
}, Ys = ({ h: e, s: t, l: n, alpha: r }) => {
  const { h: s, s: i, v: o } = vr(new jt(e, t, n, r));
  return new Oe(s, o * (1 - i), 1 - o, r);
}, Gs = ({ r: e, g: t, b: n, alpha: r }) => {
  const s = Math.max(e, t, n), i = Math.min(e, t, n);
  let [o, a, c] = [0, 0, (s + i) / 2];
  const l = s - i;
  switch (a = l / (1 - Math.abs(2 * c - 1)), s) {
    case e:
      o = (t - n) / l + (t < n ? 6 : 0);
      break;
    case t:
      o = (n - e) / l + 2;
      break;
    case n:
      o = (e - t) / l + 4;
      break;
  }
  return o /= 6, a < 0 && (o = (o + 0.5) % 1, a = Math.abs(a) % 1), o >= 1 && (o -= 1), new jt(o, a, c, r);
};
function Hs({ h: e, s: t, l: n, alpha: r }) {
  const s = (1 - Math.abs(2 * n - 1)) * t, i = s * (1 - Math.abs(e * 6 % 2 - 1)), o = n - s / 2;
  let a, c, l;
  return e < 1 / 6 ? [a, c, l] = [s, i, 0] : e < 2 / 6 ? [a, c, l] = [i, s, 0] : e < 3 / 6 ? [a, c, l] = [0, s, i] : e < 4 / 6 ? [a, c, l] = [0, i, s] : e < 5 / 6 ? [a, c, l] = [i, 0, s] : [a, c, l] = [s, 0, i], new q(a + o, c + o, l + o, r);
}
const Zs = 216 / 24389, Js = 24 / 116, Se = 24389 / 27, Qs = 8, Vt = 16, Rt = 116, Cr = 500, Er = 200;
function _s(e) {
  if (e.whitePoint === "D50") return [e.x, e.y, e.z];
  if (e.whitePoint === "D65") return N([e.x, e.y, e.z], We);
  throw new Error(`Unsupported white point: ${e.whitePoint}`);
}
function ti(e) {
  if (e.whitePoint === "D65") return [e.x, e.y, e.z];
  if (e.whitePoint === "D50") return N([e.x, e.y, e.z], pr);
  throw new Error(`Unsupported white point: ${e.whitePoint}`);
}
function Mr(e, t = "D50") {
  const n = (x) => x > Zs ? Math.cbrt(x) : (Se * x + Vt) / Rt, r = mr[t], [s, i, o] = _s(e), a = s / r[0], c = i / r[1], l = o / r[2], u = n(a), h = n(c), b = n(l), y = Rt * h - Vt, O = Cr * (u - h), v = Er * (h - b), $ = new ee(
    E(
      y,
      f.lab.l.number.min,
      f.lab.l.number.max
    ),
    E(
      O,
      f.lab.a.number.min,
      f.lab.a.number.max
    ),
    E(
      v,
      f.lab.b.number.min,
      f.lab.b.number.max
    ),
    e.alpha
  );
  return $.whitePoint = t, $;
}
function Ir(e) {
  const t = (M) => M > Js ? M ** 3 : (Rt * M - Vt) / Se, n = (M) => M > Qs ? ((M + Vt) / Rt) ** 3 : M / Se, r = mr[e.whitePoint];
  let { l: s, a: i, b: o, alpha: a } = e;
  s = E(
    s,
    0,
    1,
    f.lab.l.number.min,
    f.lab.l.number.max
  ), i = E(
    i,
    0,
    1,
    f.lab.a.number.min,
    f.lab.a.number.max
  ), o = E(
    o,
    0,
    1,
    f.lab.b.number.min,
    f.lab.b.number.max
  );
  const c = (s + Vt) / Rt, l = i / Cr + c, u = c - o / Er, [h, b, y] = [t(l), n(s), t(u)];
  let O = h * r[0], v = b * r[1], $ = y * r[2];
  const x = new Y(O, v, $, a);
  return x.whitePoint = e.whitePoint, [O, v, $] = ti(x), x.whitePoint = "D65", x.x = O, x.y = v, x.z = $, x;
}
const qe = [
  0.41239079926595934,
  0.357584339383878,
  0.1804807884018343,
  0.21263900587151027,
  0.715168678767756,
  0.07219231536073371,
  0.01933081871559182,
  0.11919477979462598,
  0.9505321522496607
], Br = lt(qe), Tr = 2.4, Zt = 0.055, Ke = 12.92, ei = 0.04045, Pr = ei / Ke;
function Ct(e) {
  const t = e < 0 ? -1 : 1, n = e * t;
  return n <= Pr ? e / Ke : t * ((n + Zt) / (1 + Zt)) ** Tr;
}
function zr(e) {
  const t = e < 0 ? -1 : 1, n = e * t;
  return n <= Pr ? e * Ke : t * ((1 + Zt) * n ** (1 / Tr) - Zt);
}
function Xe({ r: e, g: t, b: n, alpha: r }) {
  const s = [Ct(e), Ct(t), Ct(n)], [i, o, a] = N(s, qe);
  return new Y(i, o, a, r);
}
const Ye = ({ x: e, y: t, z: n, alpha: r }, s = !0) => {
  const i = N([e, t, n], Br), [o, a, c] = i.map(zr);
  if (s) {
    const l = Ni(new q(o, a, c, r));
    return new q(l.r, l.g, l.b, r);
  } else
    return new q(o, a, c, r);
};
function ni({ l: e, c: t, h: n, alpha: r }) {
  t = E(
    t,
    0,
    1,
    f.lch.c.number.min,
    f.lch.c.number.max
  );
  const s = n * 2 * Math.PI, i = Math.cos(s) * t, o = Math.sin(s) * t;
  return new ee(
    e,
    E(
      i,
      f.lab.a.number.min,
      f.lab.a.number.max
    ),
    E(
      o,
      f.lab.b.number.min,
      f.lab.b.number.max
    ),
    r
  );
}
function ri({ l: e, a: t, b: n, alpha: r }) {
  t = E(
    t,
    0,
    1,
    f.lab.a.number.min,
    f.lab.a.number.max
  ), n = E(
    n,
    0,
    1,
    f.lab.b.number.min,
    f.lab.b.number.max
  );
  const s = Math.hypot(t, n);
  let i = Math.atan2(n, t) / (2 * Math.PI);
  return i < 0 && (i += 1), new Ne(
    e,
    E(
      s,
      f.lch.c.number.min,
      f.lch.c.number.max
    ),
    i,
    r
  );
}
function Or({ l: e, a: t, b: n, alpha: r }) {
  t = E(
    t,
    0,
    1,
    f.oklab.a.number.min,
    f.oklab.a.number.max
  ), n = E(
    n,
    0,
    1,
    f.oklab.b.number.min,
    f.oklab.b.number.max
  );
  const s = N([e, t, n], zs), i = [s[0] * s[0] * s[0], s[1] * s[1] * s[1], s[2] * s[2] * s[2]], [o, a, c] = N(i, Ps);
  return new Y(o, a, c, r);
}
function Nr(e) {
  const { x: t, y: n, z: r } = e, s = N([t, n, r], fr), i = [Math.cbrt(s[0]), Math.cbrt(s[1]), Math.cbrt(s[2])], [o, a, c] = N(i, dr);
  return new ne(
    o,
    E(
      a,
      f.oklab.a.number.min,
      f.oklab.a.number.max
    ),
    E(
      c,
      f.oklab.b.number.min,
      f.oklab.b.number.max
    ),
    e.alpha
  );
}
function si({ l: e, a: t, b: n, alpha: r }) {
  t = E(t, 0, 1, f.oklab.a.number.min, f.oklab.a.number.max), n = E(n, 0, 1, f.oklab.b.number.min, f.oklab.b.number.max);
  const s = Math.hypot(t, n);
  let i = Math.atan2(n, t) / (2 * Math.PI);
  return i < 0 && (i += 1), new $e(
    e,
    E(s, f.oklch.c.number.min, f.oklch.c.number.max),
    i,
    r
  );
}
function ii({ l: e, c: t, h: n, alpha: r }) {
  t = E(t, 0, 1, f.oklch.c.number.min, f.oklch.c.number.max);
  const s = n * 2 * Math.PI, i = Math.cos(s) * t, o = Math.sin(s) * t;
  return new ne(
    e,
    E(i, f.oklab.a.number.min, f.oklab.a.number.max),
    E(o, f.oklab.b.number.min, f.oklab.b.number.max),
    r
  );
}
function Ge(e) {
  const t = Hs(e);
  return Xe(t);
}
function He(e) {
  const t = Ye(e);
  return Gs(t);
}
function oi(e) {
  const t = Sr(e);
  return Ge(t);
}
function ai(e) {
  const t = He(e);
  return vr(t);
}
function ci(e) {
  const t = Xs(e);
  return Ge(t);
}
function li(e) {
  const t = He(e);
  return Ys(t);
}
function ui(e) {
  const t = ni(e);
  return Ir(t);
}
function hi(e) {
  const t = Mr(e);
  return ri(t);
}
function pi(e) {
  const t = ii(e);
  return Or(t);
}
function mi(e) {
  const t = Nr(e);
  return si(t);
}
function fi(e) {
  const t = xr(e);
  return Xe(t);
}
function di(e) {
  const t = Ye(e);
  return Ks(t);
}
const $r = 563 / 256;
function ge(e) {
  return (e < 0 ? -1 : 1) * Math.abs(e) ** $r;
}
function bi(e) {
  return (e < 0 ? -1 : 1) * Math.abs(e) ** (1 / $r);
}
const Fr = 1 / 512, Ar = 1.8;
function we(e) {
  const t = e < 0 ? -1 : 1, n = Math.abs(e);
  return t * (n <= Fr * 16 ? n / 16 : n ** Ar);
}
function gi(e) {
  const t = e < 0 ? -1 : 1, n = Math.abs(e);
  return t * (n >= Fr ? n ** (1 / Ar) : n * 16);
}
const Jt = 1.09929682680944, Vr = 0.018053968510807;
function ke(e) {
  const t = e < 0 ? -1 : 1, n = Math.abs(e);
  return n < Vr * 4.5 ? t * n / 4.5 : t * ((n + Jt - 1) / Jt) ** (1 / 0.45);
}
function wi(e) {
  const t = e < 0 ? -1 : 1, n = Math.abs(e);
  return n >= Vr ? t * (Jt * n ** 0.45 - (Jt - 1)) : t * 4.5 * n;
}
const Rr = [
  0.4865709486482162,
  0.26566769316909306,
  0.1982172852343625,
  0.22897456406974884,
  0.6917385218365064,
  0.079286914093745,
  0,
  0.04511338185890264,
  1.043944368900976
], ki = lt(Rr), jr = [
  0.5766690429101305,
  0.1855582379065463,
  0.1882286462349947,
  0.29734497525053605,
  0.6273635662554661,
  0.07529145849399788,
  0.02703136138641234,
  0.07068885253582723,
  0.9913375368376388
], yi = lt(jr), Lr = [
  0.7977604896723027,
  0.13518583717574031,
  0.0313493495815248,
  0.2880711282292934,
  0.7118432178101014,
  8565396060525902e-20,
  0,
  0,
  0.8251046025104602
], xi = lt(Lr), Wr = [
  0.6369580483012914,
  0.14461690358620832,
  0.1688809751641721,
  0.2627002120112671,
  0.6779980715188708,
  0.05930171646986196,
  0,
  0.028072693049087428,
  1.0609850577107909
], Si = lt(Wr);
function vi({ r: e, g: t, b: n, alpha: r }) {
  const [s, i, o] = N([e, t, n], qe);
  return new Y(s, i, o, r);
}
function Ci({ x: e, y: t, z: n, alpha: r }) {
  const [s, i, o] = N([e, t, n], Br);
  return new Fe(s, i, o, r);
}
function Ei({ r: e, g: t, b: n, alpha: r }) {
  const s = [Ct(e), Ct(t), Ct(n)], [i, o, a] = N(s, Rr);
  return new Y(i, o, a, r);
}
function Mi({ x: e, y: t, z: n, alpha: r }) {
  const s = N([e, t, n], ki), [i, o, a] = s.map(zr);
  return new Ae(i, o, a, r);
}
function Ii({ r: e, g: t, b: n, alpha: r }) {
  const s = [ge(e), ge(t), ge(n)], [i, o, a] = N(s, jr);
  return new Y(i, o, a, r);
}
function Bi({ x: e, y: t, z: n, alpha: r }) {
  const s = N([e, t, n], yi), [i, o, a] = s.map(bi);
  return new Ve(i, o, a, r);
}
function Ti({ r: e, g: t, b: n, alpha: r }) {
  const s = [we(e), we(t), we(n)], i = N(s, Lr), [o, a, c] = N(i, pr);
  return new Y(o, a, c, r);
}
function Pi({ x: e, y: t, z: n, alpha: r }) {
  const s = N([e, t, n], We), i = N(s, xi), [o, a, c] = i.map(gi);
  return new Re(o, a, c, r);
}
function zi({ r: e, g: t, b: n, alpha: r }) {
  const s = [ke(e), ke(t), ke(n)], [i, o, a] = N(s, Wr);
  return new Y(i, o, a, r);
}
function Oi({ x: e, y: t, z: n, alpha: r }) {
  const s = N([e, t, n], Si), [i, o, a] = s.map(wi);
  return new je(i, o, a, r);
}
const xn = {
  rgb: { to: Xe, from: Ye },
  hsl: { to: Ge, from: He },
  hsv: { to: oi, from: ai },
  hwb: { to: ci, from: li },
  lab: { to: Ir, from: Mr },
  lch: { to: ui, from: hi },
  oklab: { to: Or, from: Nr },
  oklch: { to: pi, from: mi },
  kelvin: { to: fi, from: di },
  xyz: { to: (e) => e, from: (e) => e },
  "srgb-linear": { to: vi, from: Ci },
  "display-p3": { to: Ei, from: Mi },
  "a98-rgb": { to: Ii, from: Bi },
  "prophoto-rgb": { to: Ti, from: Pi },
  rec2020: { to: zi, from: Oi }
};
function yt(e, t) {
  if (e.colorSpace === t)
    return e;
  const n = xn[e.colorSpace];
  if (!n)
    throw new Error(`Unknown source color space: "${e.colorSpace}"`);
  const r = xn[t];
  if (!r)
    throw new Error(`Unknown target color space: "${t}"`);
  const s = n.to(e), i = r.from;
  return i(s);
}
const St = 1e-6;
function Ni(e) {
  const t = yt(e, "rgb"), n = Number.isNaN(t.r) ? 0 : t.r, r = Number.isNaN(t.g) ? 0 : t.g, s = Number.isNaN(t.b) ? 0 : t.b;
  if (n >= 0 && n <= 1 && r >= 0 && r <= 1 && s >= 0 && s <= 1)
    return e;
  if (n >= -St && n <= 1 + St && r >= -St && r <= 1 + St && s >= -St && s <= 1 + St) {
    const l = new q(J(n, 0, 1), J(r, 0, 1), J(s, 0, 1), e.alpha);
    return yt(l, e.colorSpace);
  }
  const [i, o, a] = Us(n, r, s), c = new q(i, o, a, e.alpha);
  return yt(c, e.colorSpace);
}
const $i = {
  hsl: "h",
  hsv: "h",
  hwb: "h",
  lch: "h",
  oklch: "h"
};
function Fi(e, t, n, r = "shorter") {
  if (Number.isNaN(e) && Number.isNaN(t)) return 0;
  if (Number.isNaN(e)) return t;
  if (Number.isNaN(t)) return e;
  let s = t - e;
  switch (r) {
    case "shorter":
      s > 0.5 ? e += 1 : s < -0.5 && (t += 1);
      break;
    case "longer":
      s > 0 && s < 0.5 ? e += 1 : s > -0.5 && s <= 0 && (t += 1);
      break;
    case "increasing":
      s < 0 && (t += 1);
      break;
    case "decreasing":
      s > 0 && (e += 1);
      break;
  }
  let i = e + n * (t - e);
  return i = (i % 1 + 1) % 1, i;
}
function Ai(e, t, n, r, s = "oklab", i = "shorter") {
  const o = yt(e, s), a = yt(t, s);
  n < 0 && (n = 0), r < 0 && (r = 0);
  const c = n + r;
  c === 0 ? (n = 0.5, r = 0.5) : c !== 1 && (n = n / c, r = r / c);
  const l = Math.min(c, 1), u = $i[s], h = o.keys().filter((x) => x !== "alpha"), b = Number.isNaN(o.alpha) ? a.alpha : o.alpha, y = Number.isNaN(a.alpha) ? o.alpha : a.alpha, O = Tt(r, b, y) * l, v = [];
  for (const x of h) {
    let M = o[x], j = a[x];
    if (Number.isNaN(M) && Number.isNaN(j)) {
      v.push(0);
      continue;
    }
    if (Number.isNaN(M) && (M = j), Number.isNaN(j) && (j = M), x === u)
      v.push(Fi(M, j, r, i));
    else {
      const ht = M * b, pt = j * y, mt = Tt(r, ht, pt);
      v.push(O > 0 ? mt / O : 0);
    }
  }
  const $ = o.constructor;
  return new $(...v, O);
}
const Vi = (e, t, n) => {
  const r = f[t][n];
  return r[e] ?? r.number;
}, Ri = (e, t, n, r, s = !1) => {
  t = s ? Is[n][r] : t;
  const { min: i, max: o } = Vi(t, n, r), [a, c, l, u] = s ? [i, o, 0, 1] : [0, 1, i, o], h = E(e, l, u, a, c);
  return new d(h, s ? t : "");
}, ji = (e, t = !1) => {
  const n = e.colorSpace;
  return e.keys().forEach((r) => {
    const s = e[r] instanceof d ? e[r].value : e[r];
    e[r] = Ri(
      s,
      e[r]?.unit,
      n,
      r,
      t
    );
  }), e;
}, ve = (e, t = !1, n = !1) => {
  e = n ? e : e.clone();
  const r = ji(e.value, t);
  return n ? e : new d(r).coalesce(e, !0);
}, Sn = (e, t = "lab", n = !1, r = !1, s = !1) => {
  const i = n ? s ? e : e.clone() : ve(e, !1, s), o = yt(i.toJSON(), t);
  return o.entries().forEach(([a, c]) => {
    o[a] = new d(c);
  }), i.value = o, i.superType[1] = t, r ? ve(i, !0, !0) : i;
}, Li = (e, t, n = "lab", r = !1, s = !1, i = !1) => [
  Sn(e, n, r, s, i),
  Sn(t, n, r, s, i)
], K = (e) => new d(
  e,
  "color",
  ["color", e.colorSpace],
  void 0,
  "color"
);
function Ce(e) {
  const t = ve(e).value, n = t.clone();
  for (const r of t.keys()) {
    const s = t[r];
    n[r] = s instanceof d ? s.value : s;
  }
  return n;
}
function Wi(e) {
  const t = e.replace(/[^0-9.+\-*/() e]/g, "");
  return new Function(`return (${t})`)();
}
function vn(e, t) {
  switch (e.type) {
    case "ref":
      return t[e.name] ?? 0;
    case "literal":
      return e.value;
    case "none":
      return NaN;
    case "calc": {
      let n = e.expr;
      const r = Object.keys(t).sort((s, i) => i.length - s.length);
      for (const s of r)
        n = n.replace(new RegExp(`\\b${s}\\b`, "g"), String(t[s]));
      return Wi(n);
    }
  }
}
function Di(e, t, n, r) {
  const s = Ce(e), i = yt(s, t), o = {};
  for (const [h, b] of i.entries())
    o[h] = b;
  const a = n.map((h) => vn(h, o)), c = r ? vn(r, o) : o.alpha ?? 1, l = {
    rgb: q,
    hsl: jt,
    hwb: Oe,
    lab: ee,
    lch: Ne,
    oklab: ne,
    oklch: $e,
    xyz: Y,
    "srgb-linear": Fe,
    "display-p3": Ae,
    "a98-rgb": Ve,
    "prophoto-rgb": Re,
    rec2020: je
  }[t] ?? q, u = new l(...a, c);
  return K(u);
}
const Ui = {
  srgb: "rgb",
  "srgb-linear": "srgb-linear",
  "display-p3": "display-p3",
  "a98-rgb": "a98-rgb",
  "prophoto-rgb": "prophoto-rgb",
  rec2020: "rec2020",
  lab: "lab",
  oklab: "oklab",
  oklch: "oklch",
  hsl: "hsl",
  hwb: "hwb",
  lch: "lch",
  xyz: "xyz",
  "xyz-d65": "xyz",
  "xyz-d50": "xyz"
}, qi = {
  srgb: { space: "rgb", ctor: q },
  "srgb-linear": { space: "srgb-linear", ctor: Fe },
  "display-p3": { space: "display-p3", ctor: Ae },
  "a98-rgb": { space: "a98-rgb", ctor: Ve },
  "prophoto-rgb": { space: "prophoto-rgb", ctor: Re },
  rec2020: { space: "rec2020", ctor: je },
  xyz: { space: "xyz", ctor: Y },
  "xyz-d65": { space: "xyz", ctor: Y },
  "xyz-d50": { space: "xyz", ctor: Y }
}, Ki = z(","), Xi = G(/\s+/), Ze = z("/"), se = z("("), ie = z(")"), Ee = g(Ki.trim(w), Xi), Yi = g(Ze.trim(w), Ee), tt = S.lazy(() => g(
  A.Percentage,
  A.Angle.map((e) => {
    const t = cr(e.value, e.unit);
    return new d(t, "deg", ["angle"]);
  }),
  g(it, Cs).map((e) => new d(e)),
  Le.map(() => new d(NaN))
)), Kt = g(
  // calc(...)
  p("calc").next(
    G(/\(([^)]+)\)/, (e) => e?.[1] ?? null)
  ).map((e) => ({ type: "calc", expr: e })),
  // none
  Le.map(() => ({ type: "none" })),
  // component reference (alpha must be tried before single 'a')
  G(/\b(alpha|r|g|b|h|s|l|c|w|a|x|y|z)\b/).map(
    (e) => ({ type: "ref", name: e })
  ),
  // literal number / percentage / angle
  tt.map((e) => ({ type: "literal", value: e.value }))
), ot = (e) => {
  const t = z(e).skip(p("a").opt()), n = g(
    T(tt.skip(Yi), tt),
    tt.map((s) => [s])
  ), r = T(
    tt.skip(Ee),
    tt.skip(Ee),
    n
  ).trim(w).wrap(se, ie);
  return t.next(r).map(([s, i, [o, a]]) => [s, i, o, a ?? new d(1)]);
};
function ut(e, t) {
  return z(e).skip(p("a").opt()).next(
    T(
      p("from").skip(w).next(S.lazy(() => Je.Value)),
      w.next(Kt),
      w.next(Kt),
      w.next(Kt),
      Ze.trim(w).next(Kt).opt()
    ).trim(w).wrap(se, ie)
  ).map(([n, r, s, i, o]) => Di(n, t, [r, s, i], o));
}
const Gi = G(/#[0-9a-fA-F]{3,8}/).map((e) => {
  const { r: t, g: n, b: r, alpha: s } = qs(e);
  return K(new q(t, n, r, s));
}), Hi = it.skip(p("k")).map((e) => {
  const t = xr(new sr(e));
  return K(t);
}), Zi = g(
  ut("rgb", "rgb"),
  ot("rgb").map(
    ([e, t, n, r]) => K(new q(e, t, n, r))
  )
), Ji = g(
  ut("hsl", "hsl"),
  ot("hsl").map(
    ([e, t, n, r]) => K(new jt(e, t, n, r))
  )
), Qi = ot("hsv").map(
  ([e, t, n, r]) => K(new ze(e, t, n, r))
), _i = g(
  ut("hwb", "hwb"),
  ot("hwb").map(
    ([e, t, n, r]) => K(new Oe(e, t, n, r))
  )
), to = g(
  ut("lab", "lab"),
  ot("lab").map(
    ([e, t, n, r]) => K(new ee(e, t, n, r))
  )
), eo = g(
  ut("lch", "lch"),
  ot("lch").map(
    ([e, t, n, r]) => K(new Ne(e, t, n, r))
  )
), no = g(
  ut("oklab", "oklab"),
  ot("oklab").map(
    ([e, t, n, r]) => K(new ne(e, t, n, r))
  )
), ro = g(
  ut("oklch", "oklch"),
  ot("oklch").map(
    ([e, t, n, r]) => K(new $e(e, t, n, r))
  )
), so = g(
  ut("xyz", "xyz"),
  ot("xyz").map(
    ([e, t, n, r]) => K(new Y(e, t, n, r))
  )
), io = g(
  p("srgb-linear").map(() => "srgb-linear"),
  p("srgb").map(() => "srgb"),
  p("display-p3").map(() => "display-p3"),
  p("a98-rgb").map(() => "a98-rgb"),
  p("prophoto-rgb").map(() => "prophoto-rgb"),
  p("rec2020").map(() => "rec2020"),
  p("oklab").map(() => "oklab"),
  p("oklch").map(() => "oklch"),
  p("lab").map(() => "lab"),
  p("lch").map(() => "lch"),
  p("hsl").map(() => "hsl"),
  p("hwb").map(() => "hwb"),
  p("xyz-d65").map(() => "xyz-d65"),
  p("xyz-d50").map(() => "xyz-d50"),
  p("xyz").map(() => "xyz")
), oo = g(
  p("shorter"),
  p("longer"),
  p("increasing"),
  p("decreasing")
).skip(w).skip(p("hue")), Cn = S.lazy(
  () => T(
    Je.Value,
    w.next(A.Percentage).opt()
  )
), ao = p("color-mix").next(
  T(
    // "in <space> [<hueMethod>]"
    p("in").skip(w).next(
      T(
        io,
        w.next(oo).opt()
      )
    ),
    // ", <color> [<pct>]?"
    z(",").trim(w).next(Cn),
    // ", <color> [<pct>]?"
    z(",").trim(w).next(Cn)
  ).trim(w).wrap(se, ie)
).map(([[e, t], [n, r], [s, i]]) => {
  const o = Ui[e] ?? "oklab", a = t ?? "shorter";
  let c = r != null ? r.value / 100 : -1, l = i != null ? i.value / 100 : -1;
  c < 0 && l < 0 ? (c = 0.5, l = 0.5) : c < 0 ? c = 1 - l : l < 0 && (l = 1 - c);
  const u = Ce(n), h = Ce(s), b = Ai(u, h, c, l, o, a);
  return K(b);
}), co = g(
  p("srgb-linear").map(() => "srgb-linear"),
  p("srgb").map(() => "srgb"),
  p("display-p3").map(() => "display-p3"),
  p("a98-rgb").map(() => "a98-rgb"),
  p("prophoto-rgb").map(() => "prophoto-rgb"),
  p("rec2020").map(() => "rec2020"),
  p("xyz-d65").map(() => "xyz-d65"),
  p("xyz-d50").map(() => "xyz-d50"),
  p("xyz").map(() => "xyz")
), lo = p("color").next(
  T(
    co.skip(w),
    tt.skip(w),
    tt.skip(w),
    g(
      T(
        tt.skip(Ze.trim(w)),
        tt
      ),
      tt.map((e) => [e, void 0])
    )
  ).trim(w).wrap(se, ie)
).map(([e, t, n, [r, s]]) => {
  const i = qi[e];
  if (!i)
    throw new Error(`Unknown color() space: ${e}`);
  const o = s ?? new d(1);
  if (e === "srgb") {
    const c = (l) => l.value * 255;
    return K(new q(c(t), c(n), c(r), o.value));
  }
  const a = new i.ctor(t, n, r, o);
  return K(a);
}), uo = g(
  ...Object.keys(yn).sort((e, t) => t.length - e.length).map(p)
).chain((e) => {
  const t = yn[e.toLowerCase()];
  if (t) {
    const n = oe(t);
    if (n)
      return Es(n);
  }
  return Ms();
}), ho = g(
  ao,
  lo,
  Gi,
  Hi,
  Zi,
  Ji,
  Qi,
  _i,
  to,
  eo,
  no,
  ro,
  so,
  uo
).trim(w), Je = {
  Value: ho
}, po = g(...ls.map(p)), mo = g(...hs.map(p)), fo = g(...us.map(p)), bo = g(...ms.map(p)), go = g(...ps.map(p)), wo = z(","), ko = z(" ");
g(wo, ko).trim(w);
const Dr = T(it, po).map(([e, t]) => {
  const n = ["length"];
  return rr.includes(t) ? n.push("relative") : nr.includes(t) && n.push("absolute"), new d(e, t, n);
}), Ur = T(it, mo).map(([e, t]) => new d(e, t, ["angle"])), Qe = T(it, fo).map(([e, t]) => new d(e, t, ["time"])), yo = S.lazy(() => g(_e, Qe)), xo = T(it, bo).map(([e, t]) => new d(e, t, ["resolution"])), _e = g(
  T(it, go),
  p("from").map(() => [0, "%"]),
  p("to").map(() => [100, "%"])
).map(([e, t]) => new d(e, t, ["percentage"])), qr = S.lazy(() => Je.Value), So = z("/").trim(w).map(() => new d("/", "string")), Kr = g(
  Dr,
  Ur,
  Qe,
  xo,
  _e,
  qr,
  So,
  it.map((e) => new d(e)),
  Le.map(() => new d(NaN))
).trim(w), A = {
  Length: Dr,
  Angle: Ur,
  Time: Qe,
  TimePercentage: yo,
  Percentage: _e,
  Color: qr,
  Value: Kr
};
function oe(e) {
  return et(Kr, e);
}
const Et = z("("), Mt = z(")"), Me = z(","), vo = S.lazy(
  () => Gr.sepBy(g(Me, w)).trim(w).map((e) => new st(...e))
), tn = (e) => T(
  e || Lt,
  vo.wrap(Et, Mt)
), Co = () => {
  const e = G(/[^)]+/);
  return z("var").next(e.trim(w).wrap(Et, Mt)).map((t) => new d(t, "var"));
}, Eo = () => {
  const e = S.lazy(
    () => g(
      G(/[^()]+/),
      e.many(1).wrap(Et, Mt).map((t) => `(${t.join(" ")})`)
    ).many(1)
  );
  return z("calc").next(
    g(
      S.lazy(() => Gr).trim(w).wrap(Et, Mt),
      e.wrap(Et, Mt).map((t) => t.join(" "))
    )
  ).map((t) => t instanceof d ? t : new d(t, "calc"));
}, Mo = ["translate", "scale", "rotate", "skew"], Ie = ["x", "y", "z"], Io = Ie.map(p), Bo = Mo.map(p), To = () => {
  const e = T(
    g(...Bo),
    g(...Io, z(""))
  ), t = (n, r) => n + r.toUpperCase();
  return tn(e).map(([[n, r], s]) => {
    const i = n.toLowerCase(), o = {};
    if (r) {
      const c = i + r.toUpperCase();
      o[c] = s[0];
    } else s.length === 1 ? Ie.forEach((c) => {
      const l = t(i, c);
      o[l] = s[0];
    }) : s.forEach((c, l) => {
      const u = t(i, Ie[l]);
      o[u] = c;
    });
    const a = Object.entries(o).map(([c, l]) => new _(c, [l]));
    return new st(...a);
  });
}, Po = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
}, zo = () => {
  const e = g(...["linear-gradient", "radial-gradient"].map(p)), t = T(
    z("to").skip(w),
    g(...["left", "right", "top", "bottom"].map(p))
  ).map(([, o]) => {
    const a = Po[o.toLowerCase()];
    return new d(a, "deg");
  }), n = g(A.Angle, t), r = g(A.Length, A.Percentage), s = T(
    A.Color,
    r.sepBy(w)
  ).map(([o, a]) => !a || a.length === 0 ? [o] : [o, ...a]), i = T(
    s,
    Me.trim(w).next(g(s, r)).many()
  ).map(([o, a]) => [o, ...a]);
  return T(
    e,
    T(n.skip(Me).opt(), i).trim(w).wrap(Et, Mt).map(([o, a]) => o ? [o, ...a].flat() : [a])
  ).map(([o, a]) => new _(o, a));
}, Oo = () => tn(z("cubic-bezier")).map((e) => new _("cubic-bezier", e[1])), Xr = G(/[^\(\)\{\}\s,;]+/).map((e) => new d(e)), Yr = g(
  To(),
  Co(),
  Eo(),
  zo(),
  Oo(),
  tn().map(([e, t]) => new _(e, t))
), Gr = g(A.Value, Yr, Xr).trim(w), No = T(z("{"), G(/[^{}]+/), z("}")).map(
  (e) => {
    const t = e.join(`
`);
    let n = JSON.parse(t);
    return new d(n, "json");
  }
), Hr = g(A.Value, Yr, No, Xr).trim(w);
Hr.sepBy(w);
const $o = Q((e) => et(Hr, e));
Q(
  (e) => et(A.Percentage, String(e)).valueOf()
);
Q((e) => et(
  A.Time.map((t) => t.unit === "ms" ? t.value : t.unit === "s" ? t.value * 1e3 : t.value),
  e
));
Q(
  (e, t) => (() => {
    if (!t)
      return e;
    if (e.unit === "var") {
      const n = getComputedStyle(t).getPropertyValue(e.value);
      return oe(n);
    }
    if (e.unit === "calc" && e.property && e.subProperty && e.value && t) {
      const n = e.property, r = t.style[n], s = e.subProperty ? `${e.subProperty}(${e.toString()})` : e.toString();
      t.style[n] = s;
      const i = getComputedStyle(t).getPropertyValue(
        n
      );
      t.style[n] = r;
      const o = $o(i);
      if (o instanceof d)
        return o;
      if (o.name.startsWith("matrix")) {
        const a = or(o)[e.subProperty];
        if (a != null)
          return new d(a, "px", [
            "length",
            "absolute"
          ]);
      }
    }
    return e;
  })().coalesce(e),
  { keyFn: (e, t) => `${e.toString()}-${JSON.stringify(t)}` }
);
function Fo(e) {
  return e;
}
function En(e) {
  return e * e;
}
function Mn(e) {
  return -e * (e - 2);
}
function In(e) {
  return (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
}
function Bn(e) {
  return e * e * e;
}
function Tn(e) {
  return (e = e - 1) * e * e + 1;
}
function Qt(e) {
  return (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
}
function Pn(e) {
  return e * e * (3 - 2 * e);
}
const rt = (e, t, n, r) => (s) => (s = Ns(s, e, t, n, r)[1], s);
function zn(e) {
  return e = rt(0.09, 0.91, 0.5, 1.5)(e), e;
}
function On(e) {
  return e = rt(0.09, 0.91, 0.5, 1.5)(e), e;
}
function Nn(e) {
  return e = re(e, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], e;
}
function $n(e) {
  return e = re(e, [
    [0, 0],
    [0.367, 0.94],
    [0.974, 0.254],
    [1, 0]
  ])[1], e;
}
function Fn(e) {
  return e = re(e, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], e;
}
function An(e) {
  return e = re(e, [
    [0, 0],
    [0.026, 1.746],
    [0.633, 1.06],
    [1, 0]
  ])[1], e;
}
function Vn(e) {
  return 1 - Math.cos(e * Math.PI / 2);
}
function Rn(e) {
  return Math.sin(e * Math.PI / 2);
}
function jn(e) {
  return -(Math.cos(Math.PI * e) - 1) / 2;
}
function Ln(e) {
  return 1 - Math.sqrt(1 - e * e);
}
function Wn(e) {
  return Math.sqrt(1 - --e * e);
}
function Dn(e) {
  return (e /= 0.5) < 1 ? -(Math.sqrt(1 - e * e) - 1) / 2 : (Math.sqrt(1 - (e -= 2) * e) + 1) / 2;
}
function Un(e) {
  return e === 0 ? 0 : Math.pow(2, 10 * (e - 1));
}
function qn(e) {
  return e === 1 ? 1 : 1 - Math.pow(2, -10 * e);
}
function Kn(e) {
  return e === 0 ? 0 : e === 1 ? 1 : (e /= 0.5) < 1 ? 0.5 * Math.pow(2, 10 * (e - 1)) : 0.5 * (2 - Math.pow(2, -10 * --e));
}
function Zr(e, t) {
  return Math.floor(e * t) / t;
}
function Ao(e, t) {
  return Math.ceil(e * t) / t;
}
function Vo(e, t) {
  return e === 0 || e === 1 ? e : Zr(e, t);
}
function Ro(e, t) {
  return Math.round(e * t) / t;
}
function en(e, t = "jump-start") {
  switch (t) {
    case "jump-none":
      return (n) => Ro(n, e);
    case "jump-start":
    case "start":
      return (n) => Zr(n, e);
    case "jump-end":
    case "end":
      return (n) => Ao(n, e);
    case "jump-both":
    case "both":
      return (n) => Vo(n, e);
  }
}
function jo() {
  return en(1, "jump-start");
}
function Lo() {
  return en(1, "jump-end");
}
const gt = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "ease-in-back": [0.6, -0.28, 0.735, 0.045],
  "ease-out-back": [0.175, 0.885, 0.32, 1.275],
  "ease-in-out-back": [0.68, -0.55, 0.265, 1.55]
}, Wo = {
  linear: Fo,
  easeInQuad: En,
  "ease-in-quad": En,
  // "easeInQuad",
  easeOutQuad: Mn,
  "ease-out-quad": Mn,
  // "easeOutQuad",
  easeInOutQuad: In,
  "ease-in-out-quad": In,
  // "easeInOutQuad",
  easeInCubic: Bn,
  "ease-in-cubic": Bn,
  easeOutCubic: Tn,
  "ease-out-cubic": Tn,
  easeInOutCubic: Qt,
  "ease-in-out-cubic": Qt,
  easeInBounce: zn,
  "ease-in-bounce": zn,
  // "easeInBounce",
  bounceInEase: On,
  "bounce-in-ease": On,
  bounceInEaseHalf: Nn,
  "bounce-in-ease-half": Nn,
  bounceOutEase: $n,
  "bounce-out-ease": $n,
  bounceOutEaseHalf: Fn,
  "bounce-out-ease-half": Fn,
  bounceInOutEase: An,
  "bounce-in-out-ease": An,
  easeInSine: Vn,
  "ease-in-sine": Vn,
  easeOutSine: Rn,
  "ease-out-sine": Rn,
  easeInOutSine: jn,
  "ease-in-out-sine": jn,
  easeInCirc: Ln,
  "ease-in-circ": Ln,
  easeOutCirc: Wn,
  "ease-out-circ": Wn,
  easeInOutCirc: Dn,
  "ease-in-out-circ": Dn,
  easeInExpo: Un,
  "ease-in-expo": Un,
  easeOutExpo: qn,
  "ease-out-expo": qn,
  easeInOutExpo: Kn,
  "ease-in-out-expo": Kn,
  smoothStep3: Pn,
  "smooth-step-3": Pn,
  ease: rt(...gt.ease),
  "ease-in": rt(...gt["ease-in"]),
  "ease-out": rt(...gt["ease-out"]),
  "ease-in-out": rt(...gt["ease-in-out"]),
  "ease-in-back": rt(...gt["ease-in-back"]),
  "ease-out-back": rt(...gt["ease-out-back"]),
  "ease-in-out-back": rt(...gt["ease-in-out-back"]),
  steps: en,
  "step-start": jo,
  "step-end": Lo
}, Xn = 4;
function Yn(e, t = "^", n = !1) {
  const r = e.src.split(`
`), s = Math.min(r.length - 1, e.getLineNumber()), i = Math.max(s - Xn, 0), o = Math.min(s + Xn + 1, r.length), a = r.slice(i, o);
  if (t) {
    const l = " ".repeat(e.getColumnNumber()) + t;
    a.splice(s - i + 1, 0, l);
  }
  return a.map((l, u) => `      ${i + u + 1}| ${l}`).join(`
`);
}
const wt = /* @__PURE__ */ new Map();
function Jr(e) {
  if (wt.has(e.id))
    return wt.get(e.id);
  const t = (r, s) => {
    if (wt.has(r.id))
      return wt.get(r.id);
    const { name: i, args: o, parser: a } = r.context, c = a != null ? t(a, s) : "unknown", u = (() => {
      switch (i) {
        case "string":
          return `"${o[0]}"`;
        case "regex":
        case "regexConcat":
        case "regexWrap":
          return `${o[0]}`;
        case "wrap":
        case "trim": {
          const [h, b] = o;
          return `${t(h, s)} ${c} ${t(b, s)}`;
        }
        case "trimWhitespace":
          return `${c}?w`;
        case "not":
          return `!${c}`;
        case "opt":
          return `${c}?`;
        case "next": {
          const [h] = o;
          return `${c} >> ${t(h, s)}`;
        }
        case "skip": {
          const [h] = o;
          return `${c} << ${t(h, s)}`;
        }
        case "map":
          return c;
        case "all":
        case "then":
          return `[${o.map(
            (b) => t(b, s)
          ).join(", ")}]`;
        case "any":
        case "or":
          return o.map(
            (b) => t(b, s)
          ).join(" | ");
        case "many": {
          const [h, b] = o, y = b === 1 / 0 ? `${h},` : `${h},${b}`;
          return `${c} {${y}}`;
        }
        case "sepBy":
          return `${c} sepBy ${t(o[0], s)}`;
        case "lazy": {
          const [h] = o, b = _r(h);
          if (s)
            return i;
          {
            const y = t(b, b.id);
            return wt.set(b.id, y), y;
          }
        }
        case "debug":
          return c;
        default:
          return;
      }
    })() ?? i ?? "unknown";
    return s && wt.set(r.id, u), u;
  }, n = t(e);
  return wt.set(e.id, n), n;
}
function Qr(e, t = "", n = "") {
  const r = String(e.value), s = e.offset >= e.src.length, a = `${`[${e.isError ? "err" : s ? "done" : "ok"}]`} ${t} offset=${e.offset} value=${r}`, c = e.offset >= e.src.length ? Yn(e, "", e.isError) : Yn(e, "^", e.isError);
  return `${a}
${c}`;
}
function Do(e, t = "", n = !1, r = console.log) {
  const s = (i) => {
    const o = e.parser(i), a = n ? Jr(e) : e.context.name ?? "", c = Qr(
      o,
      t,
      a
    );
    return r(c), o;
  };
  return new C(s, B("debug", e, r));
}
class _t {
  constructor(t, n = void 0, r = 0, s = !1, i = 0) {
    this.src = t, this.value = n, this.offset = r, this.isError = s, this.furthest = i;
  }
  ok(t, n = 0) {
    return n += this.offset, new _t(this.src, t, n, !1);
  }
  err(t, n = 0) {
    const r = this.ok(t, n);
    return r.isError = !0, r;
  }
  from(t, n = 0) {
    return n += this.offset, new _t(this.src, t, n, this.isError);
  }
  getColumnNumber() {
    const t = this.offset, n = this.src.lastIndexOf(`
`, t), r = n === -1 ? t : t - (n + 1);
    return Math.max(0, r);
  }
  getLineNumber() {
    const t = this.src.lastIndexOf(`
`, this.offset);
    return t >= 0 ? this.src.slice(0, t).split(`
`).length : 0;
  }
  toString() {
    return Qr(this);
  }
}
function B(e, t, ...n) {
  return {
    name: e,
    parser: t,
    args: n
  };
}
let Uo = 0;
const kt = /* @__PURE__ */ new Map(), Xt = /* @__PURE__ */ new Map();
let At;
function U(e) {
  return (!At || e.offset > At.offset) && (At = e), At;
}
function _r(e) {
  return e.parser ? e.parser : e.parser = e();
}
class C {
  constructor(t, n = {}) {
    this.parser = t, this.context = n;
  }
  id = Uo++;
  state;
  reset() {
    At = void 0, kt.clear(), Xt.clear();
  }
  parseState(t) {
    this.reset();
    const n = this.parser(new _t(t));
    return this.state = U(n), this.state.isError = n.isError, this.state.isError, n;
  }
  parse(t) {
    return this.parseState(t).value;
  }
  getCijKey(t) {
    return `${this.id}${t.offset}`;
  }
  atLeftRecursionLimit(t) {
    return (Xt.get(this.getCijKey(t)) ?? 0) > t.src.length - t.offset;
  }
  memoize() {
    const t = (n) => {
      const r = this.getCijKey(n), s = Xt.get(r) ?? 0;
      let i = kt.get(this.id);
      if (i && i.offset >= n.offset)
        return i;
      if (this.atLeftRecursionLimit(n))
        return n.err(void 0);
      Xt.set(r, s + 1);
      const o = this.parser(n);
      return i = kt.get(this.id), i && i.offset > o.offset ? o.offset = i.offset : i || kt.set(this.id, o), o;
    };
    return new C(
      t,
      B("memoize", this)
    );
  }
  mergeMemos() {
    const t = (n) => {
      let r = kt.get(this.id);
      if (r)
        return r;
      if (this.atLeftRecursionLimit(n))
        return n.err(void 0);
      const s = this.parser(n);
      return r = kt.get(this.id), r || kt.set(this.id, s), s;
    };
    return new C(
      t,
      B("mergeMemo", this)
    );
  }
  then(t) {
    const n = (r) => {
      const s = this.parser(r);
      if (!s.isError) {
        const i = t.parser(s);
        if (!i.isError)
          return i.ok([s.value, i.value]);
      }
      return U(r), r.err(void 0);
    };
    return new C(
      n,
      B("then", this, this, t)
    );
  }
  or(t) {
    const n = (r) => {
      const s = this.parser(r);
      return s.isError ? t.parser(r) : s;
    };
    return new C(
      n,
      B("or", this, this, t)
    );
  }
  chain(t, n = !1) {
    const r = (s) => {
      const i = this.parser(s);
      return i.isError ? i : i.value || n ? t(i.value).parser(i) : s;
    };
    return new C(
      r,
      B("chain", this, t)
    );
  }
  map(t, n = !1) {
    const r = (s) => {
      const i = this.parser(s);
      return !i.isError || n ? i.ok(t(i.value)) : i;
    };
    return new C(
      r,
      B("map", this)
    );
  }
  mapState(t) {
    const n = (r) => {
      const s = this.parser(r);
      return t(s, r);
    };
    return new C(
      n,
      B("mapState", this)
    );
  }
  skip(t) {
    const n = (r) => {
      const s = this.parser(r);
      if (!s.isError) {
        const i = t.parser(s);
        if (!i.isError)
          return i.ok(s.value);
      }
      return U(r), r.err(void 0);
    };
    return new C(
      n,
      B("skip", this, t)
    );
  }
  next(t) {
    const n = this.then(t).map(([, r]) => r);
    return n.context = B("next", this, t), n;
  }
  opt() {
    const t = (n) => {
      const r = this.parser(n);
      return r.isError ? (U(n), n.ok(void 0)) : r;
    };
    return new C(
      t,
      B("opt", this)
    );
  }
  not(t) {
    const n = (s) => this.parser(s).isError ? (U(s), s.ok(s.value)) : s.err(void 0), r = (s) => {
      const i = this.parser(s);
      return i.isError ? (U(s), i) : t.parser(s).isError ? i : (U(s), s.err(void 0));
    };
    return new C(
      t ? r : n,
      B("not", this, t)
    );
  }
  wrap(t, n, r = !0) {
    if (!r)
      return Z(t, this, n);
    const s = t.next(this).skip(n);
    return s.context = B("wrap", this, t, n), s;
  }
  trim(t = nn, n = !0) {
    if (!n)
      return Z(t, this, t);
    if (t.context?.name === "whitespace") {
      const r = (s) => {
        const i = Hn(s), o = this.parser(i);
        return o.isError ? (U(s), s.err(void 0)) : Hn(o);
      };
      return new C(
        r,
        B("trimWhitespace", this)
      );
    }
    return this.wrap(t, t);
  }
  many(t = 0, n = 1 / 0) {
    const r = (s) => {
      const i = [];
      let o = s;
      for (let a = 0; a < n; a += 1) {
        const c = this.parser(o);
        if (c.isError)
          break;
        i.push(c.value), o = c;
      }
      return i.length >= t ? o.ok(i) : (U(s), s.err([]));
    };
    return new C(
      r,
      B("many", this, t, n)
    );
  }
  sepBy(t, n = 0, r = 1 / 0) {
    const s = (i) => {
      const o = [];
      let a = i;
      for (let c = 0; c < r; c += 1) {
        const l = this.parser(a);
        if (l.isError)
          break;
        a = l, o.push(a.value);
        const u = t.parser(a);
        if (u.isError)
          break;
        a = u;
      }
      return o.length > n ? a.ok(o) : (U(i), i.err([]));
    };
    return new C(
      s,
      B("sepBy", this, t)
    );
  }
  eof() {
    const t = this.skip(qo());
    return t.context = B("eof", this), t;
  }
  debug(t = "", n = !1, r = console.log) {
    return Do(this, t, n, r);
  }
  toString() {
    return Jr(this);
  }
  static lazy(t) {
    const n = (r) => _r(t).parser(r);
    return new C(
      n,
      B("lazy", void 0, t)
    );
  }
}
function qo() {
  const e = (t) => t.offset >= t.src.length ? t.ok(void 0) : (U(t), t.err());
  return new C(
    e,
    B("eof", void 0)
  );
}
function R(...e) {
  const t = (n) => {
    for (const r of e) {
      const s = r.parser(n);
      if (!s.isError)
        return s;
    }
    return U(n), n.err(void 0);
  };
  return new C(
    e.length === 1 ? e[0].parser : t,
    B("any", void 0, ...e)
  );
}
function Z(...e) {
  const t = (n) => {
    const r = [];
    let s = n;
    for (const i of e) {
      const o = i.parser(s);
      if (o.isError)
        return o;
      o.value !== void 0 && r.push(o.value), s = o;
    }
    return U(s), s.ok(r);
  };
  return new C(
    e.length === 1 ? e[0].parser : t,
    B("all", void 0, ...e)
  );
}
function X(e) {
  const t = (n) => {
    if (n.offset >= n.src.length)
      return n.err(void 0);
    const r = n.src.slice(n.offset, n.offset + e.length);
    return r === e ? n.ok(r, r.length) : (U(n), n.err(void 0));
  };
  return new C(
    t,
    B("string", void 0, e)
  );
}
function Wt(e, t = (n) => n?.[0] ?? null) {
  const n = e.flags.replace(/y/g, ""), r = new RegExp(e, n + "y"), s = (i) => {
    if (i.offset >= i.src.length)
      return i.err(void 0);
    r.lastIndex = i.offset;
    const o = t(i.src.match(r));
    return o ? i.ok(o, r.lastIndex - i.offset) : o === "" ? i.ok(void 0) : (U(i), i.err(void 0));
  };
  return new C(
    s,
    B("regex", void 0, e)
  );
}
const Gn = /\s*/y, Hn = (e) => {
  if (e.offset >= e.src.length)
    return e;
  Gn.lastIndex = e.offset;
  const t = e.src.match(Gn)?.[0] ?? "";
  return e.ok(e.value, t.length);
}, nn = Wt(/\s*/);
nn.context.name = "whitespace";
const It = X("("), Bt = X(")"), Ko = X(";"), Xo = X(":"), rn = X("{"), sn = X("}"), te = X(","), Yo = X("."), P = nn, ts = C.lazy(
  () => Dt.sepBy(R(te, P)).trim(P).map((e) => new st(...e))
), on = (e) => Z(
  e || Lt,
  ts.wrap(It, Bt)
), Go = () => {
  const e = Wt(/[^)]+/);
  return X("var").next(e.trim(P).wrap(It, Bt)).map((t) => new d(t, "var"));
}, Ho = () => {
  const e = C.lazy(
    () => R(
      Wt(/[^()]+/),
      e.many(1).wrap(It, Bt).map((t) => `(${t.join(" ")})`)
    ).many(1)
  );
  return X("calc").next(
    R(
      C.lazy(() => Dt).trim(P).wrap(It, Bt),
      e.wrap(It, Bt).map((t) => t.join(" "))
    )
  ).map((t) => t instanceof d ? t : new d(t, "calc"));
}, Zo = ["translate", "scale", "rotate", "skew"], Be = ["x", "y", "z"], Jo = Be.map(p), Qo = Zo.map(p), _o = () => {
  const e = Z(
    R(...Qo),
    R(...Jo, X(""))
  ), t = (r, s) => r + s.toUpperCase();
  return on(e).map(([[r, s], i]) => {
    const o = r.toLowerCase(), a = {};
    if (s) {
      const l = o + s.toUpperCase();
      a[l] = i[0];
    } else i.length === 1 ? Be.forEach((l) => {
      const u = t(o, l);
      a[u] = i[0];
    }) : i.forEach((l, u) => {
      const h = t(o, Be[u]);
      a[h] = l;
    });
    const c = Object.entries(a).map(([l, u]) => new _(l, [u]));
    return new st(...c);
  });
}, ta = {
  left: "270",
  right: "90",
  top: "0",
  bottom: "180"
}, ea = () => {
  const e = R(...["linear-gradient", "radial-gradient"].map(p)), t = Z(
    X("to").skip(P),
    R(...["left", "right", "top", "bottom"].map(p))
  ).map(([, a]) => {
    const c = ta[a.toLowerCase()];
    return new d(c, "deg");
  }), n = R(A.Angle, t), r = R(A.Length, A.Percentage), s = Z(
    A.Color,
    r.sepBy(P)
  ).map(([a, c]) => !c || c.length === 0 ? [a] : [a, ...c]), i = Z(
    s,
    te.trim(P).next(R(s, r)).many()
  ).map(([a, c]) => [a, ...c]);
  return Z(
    e,
    Z(n.skip(te).opt(), i).trim(P).wrap(It, Bt).map(([a, c]) => a ? [a, ...c].flat() : [c])
  ).map(([a, c]) => new _(a, c));
}, na = () => on(X("cubic-bezier")).map((e) => new _("cubic-bezier", e[1])), ra = Wt(/[^\(\)\{\}\s,;]+/).map((e) => new d(e)), sa = R(
  _o(),
  Go(),
  Ho(),
  ea(),
  na(),
  on().map(([e, t]) => new _(e, t))
), ia = Z(rn, Wt(/[^{}]+/), sn).map(
  (e) => {
    const t = e.join(`
`), n = JSON.parse(t);
    return new d(n, "json");
  }
), Dt = R(A.Value, sa, ia, ra).trim(P), oa = Dt.sepBy(P), aa = Z(
  Lt.skip(Xo).trim(P).map((e) => as(e)),
  oa.skip(Ko).trim(P)
).map(([e, t]) => {
  const n = new st(...t).flat();
  return n.setProperty(e), {
    [e]: n
  };
}), ca = R(
  A.TimePercentage.trim(P).map((e) => e.toString()),
  it.map((e) => `${e}%`)
), la = ca.sepBy(te).trim(P), es = aa.many().trim(P).wrap(rn, sn).map((e) => Object.assign({}, ...e)), ua = X("@keyframes").trim(P).next(Lt), Zn = Z(la, es).map(([e, t]) => e.reduce((n, r) => (n.set(r, t), n), /* @__PURE__ */ new Map())), ns = R(
  ua.next(
    Zn.many(1).trim(P).wrap(rn, sn).trim(P)
  ),
  Zn.many(1).trim(P)
).map((e) => e.reduce((t, n) => {
  for (const [r, s] of n)
    t.has(r) ? t.set(r, { ...t.get(r), ...s }) : t.set(r, s);
  return t;
}, /* @__PURE__ */ new Map())), ha = Yo.trim(P).next(Lt).trim(P), pa = es.map((e) => {
  const t = {};
  for (const [n, r] of Object.entries(e))
    if (n.includes("animation")) {
      const s = n.replace(/^animation/i, "").replace(/^\w/, (o) => o.toLowerCase()), i = cs(r.toString());
      t[s] = i, delete e[n];
    }
  return {
    options: t,
    values: e
  };
}), ma = ha.next(pa), fa = R(
  ma.map((e) => e),
  ns.map((e) => ({
    keyframes: e
  }))
), da = fa.sepBy(P).map((e) => Object.assign({}, ...e)), Jn = {
  Value: Dt,
  FunctionArgs: ts
}, ba = Q(
  (e) => et(Dt, e)
), ga = Q(
  (e) => et(ns, e)
);
Q((e) => {
  const { options: t, values: n, keyframes: r } = et(da, e);
  return {
    options: t,
    values: n,
    keyframes: r
  };
});
Q(
  (e) => et(A.Percentage, String(e)).valueOf()
);
const Qn = Q((e) => et(
  A.Time.map((t) => t.unit === "ms" ? t.value : t.unit === "s" ? t.value * 1e3 : t.value),
  e
));
Q((e) => e >= 5e3 ? `${e / 1e3}s` : `${e}ms`);
Q((e) => e === 1 / 0 ? "infinite" : String(e));
const wa = {
  duration: 1e3,
  delay: 0,
  iterationCount: 1,
  direction: "normal",
  fillMode: "forwards",
  timingFunction: Qt
};
class ka {
  animations = {};
  transform;
  superKey;
  paused = !1;
  started = !1;
  done = !1;
  singleTarget = !0;
  handleId = void 0;
  resolvePromise = null;
  constructor(...t) {
    for (const n of t) {
      this.transform ??= n.frames[0].transform;
      const r = Ta(n);
      this.animations[r] = {
        values: {},
        animation: n
      };
    }
    this.singleTarget = t.every(
      (n) => n.targets[0] === t[0].targets[0]
    );
  }
  setSuperKey(t) {
    return this.superKey = t, Object.values(this.animations).forEach((n) => {
      n.animation.superKey = t;
    }), this;
  }
  setTargets(...t) {
    Object.values(this.animations).forEach((r) => {
      r.animation.setTargets(...t);
    });
    const n = Object.values(this.animations).map(
      (r) => r.animation
    );
    return this.singleTarget = n.every(
      (r) => r.targets[0] === n[0].targets[0]
    ), this;
  }
  onStart() {
    return this.started = !0, this;
  }
  onEnd() {
    return this;
  }
  transformFramesGrouped(t) {
    let n = {}, r = !0;
    for (const s of Object.values(this.animations)) {
      const { animation: i, values: o } = s;
      if (r = r && i.done, !(i.done || i.paused)) {
        const a = i.interpFrames(i.t, !1);
        Object.assign(o, a);
      }
      n = {
        ...n,
        ...o
      };
    }
    return this.done = r, this.transform(n, t), n;
  }
  async tick(t) {
    return this.started || this.onStart(), Object.values(this.animations).forEach(async (n) => {
      (!n.animation.paused || n.animation.pausedTime === 0) && await n.animation.tick(t);
    }), this.done && this.onEnd(), this;
  }
  async draw(t) {
    await this.tick(t), !this.paused && (this.singleTarget ? this.transformFramesGrouped(t) : this.done = Object.values(this.animations).map(({ animation: n }) => (n.interpFrames(n.t, !0), n)).every((n) => n.done), this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = vt(this.draw.bind(this)));
  }
  async play() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = vt(this.draw.bind(this));
    });
  }
  pause() {
    const t = this.paused;
    return this.started && (this.paused = !this.paused, Object.values(this.animations).forEach((n) => {
      n.animation.pause(!1);
    })), t && vt(this.draw.bind(this)), this;
  }
  reset() {
    return Object.values(this.animations).forEach((t) => {
      t.animation.reset();
    }), this.started = !1, this.done = !1, this.paused = !1, this;
  }
  stop() {
    return er(this.handleId), this.reset(), this;
  }
  playing() {
    return !(!this.started || this.paused);
  }
  forcePause() {
    this.paused = !0, Object.values(this.animations).forEach((t) => {
      t.animation.paused = !0;
    });
  }
  forcePlay() {
    this.paused = !1, Object.values(this.animations).forEach((t) => {
      t.animation.paused = !1;
    });
  }
}
const _n = Q(
  (e, t) => (() => {
    if (!t)
      return e;
    if (e.unit === "var") {
      const s = getComputedStyle(t).getPropertyValue(e.value);
      return oe(s);
    }
    if (e.unit === "calc" && e.property && e.subProperty && e.value && t) {
      const s = t.style[e.property], i = e.subProperty ? `${e.subProperty}(${e.toString()})` : e.toString();
      t.style[e.property] = i;
      const o = getComputedStyle(t).getPropertyValue(
        e.property
      );
      t.style[e.property] = s;
      const a = ba(o);
      if (a instanceof d)
        return a;
      if (a.name.startsWith("matrix")) {
        const l = or(a)[e.subProperty];
        if (l != null)
          return new d(l, "px", [
            "length",
            "absolute"
          ]);
      }
    }
    return e;
  })().coalesce(e),
  { keyFn: (e, t) => `${e.toString()}-${JSON.stringify(t)}` }
), ya = (e, t, n = !1) => {
  if (e?.superType?.[0] !== t?.superType?.[0])
    return n ? [e, t] : [e.clone(), t.clone()];
  const r = (o) => {
    switch (o?.superType?.[0]) {
      case "length":
        return {
          value: ks(o.value, o.unit, o.targets?.[0]),
          unit: "px"
        };
      case "angle":
        return {
          value: cr(o.value, o.unit),
          unit: "deg"
        };
      case "time":
        return {
          value: ar(o.value, o.unit),
          unit: "ms"
        };
      case "resolution":
        return {
          value: ys(o.value, o.unit),
          unit: "dpi"
        };
      default:
        return { value: o.value, unit: o.unit };
    }
  }, [s, i] = [r(e), r(t)];
  return n ? (e.value = s.value, e.unit = s.unit, t.value = i.value, t.unit = i.unit, [e, t]) : [
    new d(
      s.value,
      s.unit,
      e.superType,
      e.subProperty,
      e.property,
      e.targets
    ),
    new d(
      i.value,
      i.unit,
      t.superType,
      t.subProperty,
      t.property,
      t.targets
    )
  ];
};
function xa(e, t) {
  e = e.coalesce(t, !0), t = t.coalesce(e, !0);
  const n = {
    start: e,
    stop: t,
    value: e.clone()
  };
  if (xe(e) && xe(t)) {
    const [r, s] = Li(
      e,
      t,
      "lab",
      !0
    );
    n.start = r, n.stop = s, n.value = r.clone();
  }
  if (e.unit !== t.unit) {
    const [r, s] = ya(
      e,
      t,
      !0
    );
    n.start = r, n.stop = s, n.value = r.clone();
  }
  return n.computed = ye.includes(e.unit) || ye.includes(t.unit), n;
}
const tr = (e) => typeof e == "string" ? Wo[e] : e ?? void 0;
function Sa(e, { start: t, stop: n, value: r }) {
  const s = _n(t.clone(), t.targets?.[0]), i = _n(n.clone(), n.targets?.[0]), o = ye.includes(s.unit) ? i.unit : s.unit, a = Tt(e, s.value, i.value);
  return r.value = a, r.unit = o, r;
}
function va(e, { start: t, stop: n, value: r }) {
  return t.value.keys().forEach((s) => {
    r.value[s] = Tt(e, t.value[s], n.value[s]);
  }), r;
}
function Ca(e, t) {
  const { start: n, stop: r, computed: s } = t;
  return typeof n.value == "number" && typeof r.value == "number" ? t.value.value = Tt(e, n.value, r.value) : n.unit === "color" ? va(e, t) : s && Sa(e, t), t;
}
function Ea(e) {
  const t = ir(e), n = (s, i) => {
    const o = s.split(".").pop(), a = s.split(".").shift();
    if (i instanceof d)
      return i.setProperty(a), i;
    if (i instanceof _)
      return i.setProperty(a), i.setSubProperty(o), i.values.flat();
    if (i instanceof st)
      return i.map((l) => n(s, l)).flat();
    const c = et(
      R(
        Jn.FunctionArgs.map((l) => (l.setSubProperty(o), l)),
        Jn.Value
      ),
      String(i)
    );
    return c.setProperty(a), c;
  };
  return Object.entries(t).map(([s, i]) => [s, n(s, i)]).reduce((s, [i, o]) => (s[i] = o, s), {});
}
const Ma = (e, t, n, r) => {
  const s = r[t][e], i = r[n][e], o = Math.max(s.length, i.length), a = s.concat(
    Array(Math.abs(o - s.length)).fill(new d(0))
  ), c = i.concat(
    Array(Math.abs(o - i.length)).fill(new d(0))
  );
  return a.map((l, u) => xa(l, c[u]));
};
function Ia(e, t, n) {
  const [r, s] = [e.start, t.start];
  return {
    start: r.value * n / 100,
    stop: s.value * n / 100
  };
}
function Ba(e, t, n = !0) {
  e = n ? e : ir(e);
  const r = gs(e);
  t.forEach((s) => {
    Object.entries(r).forEach(([i, o]) => {
      s.style[i] = o;
    });
  });
}
const Ta = (e) => typeof e == "string" ? e : e.name ?? String(e.id);
let Pa = 0;
class za {
  id = Pa++;
  name;
  superKey;
  targets;
  options;
  templateFrames = [];
  parsedVars = [];
  frameId = 0;
  frames = [];
  handleId = void 0;
  startTime = void 0;
  pausedTime = 0;
  prevTime = 0;
  t = 0;
  iteration = 0;
  started = !1;
  done = !1;
  reversed = !1;
  paused = !1;
  unflatten = !0;
  resolvePromise = null;
  constructor(t, n, r, s) {
    this.options = {}, this.setOptions({ ...wa, ...t ?? {} }), this.targets = n == null ? [] : Array.isArray(n) ? n : [n], this.name = r, this.superKey = s;
  }
  convertFrameStart(t) {
    if (t.start.unit === "s" || t.start.unit === "ms" || !t.start.unit) {
      const n = ar(t.start.value, t.start.unit);
      t.start.value = n / this.options.duration * 100, t.start.unit = "%";
    }
    return t.start.value = J(t.start.value, 0, 100), t;
  }
  addFrame(t, n, r, s) {
    typeof t == "number" ? t = String(t) + "%" : typeof t == "string" ? t = t : t instanceof d && (t = String(t));
    const i = oe(t);
    let o = {
      id: this.frameId,
      start: i,
      vars: n,
      transform: r,
      timingFunction: tr(s) ?? this.options.timingFunction
    };
    return this.convertFrameStart(o), this.templateFrames.push(o), this.frameId += 1, this;
  }
  createFrame(t, n) {
    const [r, s] = [
      this.templateFrames[t],
      this.templateFrames[n]
    ], i = {
      start: t,
      stop: n
    }, o = Ia(r, s, this.options.duration);
    let a = r.transform;
    if (a == null) {
      const u = mn(
        t,
        this.frames,
        (h) => h.transform != null
      );
      a = this.frames[u].transform;
    }
    let c = r.timingFunction;
    if (c == null) {
      const u = mn(
        t,
        this.frames,
        (h) => h.timingFunction != null
      );
      c = this.frames[u].timingFunction;
    }
    return {
      id: this.frameId++,
      ixs: i,
      start: r.start,
      time: o,
      vars: void 0,
      flatVars: void 0,
      interpVars: {},
      transform: a,
      timingFunction: c
    };
  }
  reconcileVars(t) {
    const n = this.parsedVars[t];
    Object.keys(n).forEach((r) => {
      const s = this.parsedVars.findIndex((l, u) => u > t && l[r] != null);
      if (s === -1)
        return;
      const [i, o] = [t, s], a = this.frames.findIndex(
        (l) => l.ixs.start === i && l.ixs.stop === o
      ), c = a !== -1 ? this.frames[a] : this.createFrame(i, o);
      c.interpVars[r] = Ma(
        r,
        i,
        o,
        this.parsedVars
      ), a === -1 && this.frames.push(c);
    });
  }
  parse() {
    this.frames = [], this.templateFrames.sort((t, n) => t.start.value - n.start.value), this.parsedVars = this.templateFrames.map((t) => {
      const n = Ea(t.vars);
      return Object.values(n).forEach((r) => {
        r.setTargets(this.targets);
      }), n;
    });
    for (let t = 0; t < this.templateFrames.length - 1; t++)
      this.frames.push(this.createFrame(t, t + 1));
    return this.frames.forEach((t, n) => this.reconcileVars(n)), this.frames.sort((t, n) => t.time.start === n.time.start ? t.time.stop - n.time.stop : t.time.start - n.time.start), this.frames = this.frames.filter(
      (t) => t.interpVars != null && Object.keys(t.interpVars).length > 0
    ), this.frames.forEach((t) => {
      t.flatVars = Object.entries(t.interpVars).reduce(
        (n, [r, s]) => (n[r] = s.map((i) => i.value), n),
        {}
      ), t.vars = bs(t.flatVars);
    }), this;
  }
  setTimingFunction(t) {
    return this.options.timingFunction = tr(t) ?? Qt, this;
  }
  setIterationCount(t) {
    return !t || t === "infinite" || t === "∞" || t === "Infinity" ? this.options.iterationCount = 1 / 0 : typeof t == "string" ? this.options.iterationCount = parseFloat(t.trim()) : this.options.iterationCount = t, this;
  }
  setDuration(t) {
    typeof t == "string" && (t = Qn(t));
    const n = this.options.duration, r = t ?? n, s = r / n;
    for (let i = 0; i < this.frames.length; i++) {
      const o = this.frames[i];
      o.time.start *= s, o.time.stop *= s;
    }
    return this.options.duration = r, this;
  }
  setDelay(t) {
    return typeof t == "string" && (t = Qn(t)), this.options.delay = t ?? 0, this;
  }
  setDirection(t) {
    return this.options.direction = t ?? "normal", this;
  }
  setFillMode(t) {
    return this.options.fillMode = t ?? "forwards", this;
  }
  setOptions(t) {
    return this.setTimingFunction(t.timingFunction), this.setDuration(t.duration), this.setIterationCount(t.iterationCount), this.setDelay(t.delay), this.setDirection(t.direction), this.setFillMode(t.fillMode), this;
  }
  reverse() {
    return this.reversed = !this.reversed, this;
  }
  fillForwards() {
    this.interpFrames(this.options.duration, !0);
  }
  fillBackwards() {
    this.interpFrames(0, !0);
  }
  interpFrames(t, n = !1) {
    return t = this.reversed ? this.options.duration - t : t, this.frames.map((r) => {
      const { start: s, stop: i } = r.time;
      if (t < s || t > i)
        return;
      const o = E(t, s, i, 0, 1), a = r.timingFunction(o);
      return Object.values(r.interpVars).forEach((c) => {
        c.forEach((l) => {
          Ca(a, l);
        });
      }), n && r.transform(this.unflatten ? r.vars : r.flatVars, t), r.flatVars;
    }).reduce((r, s) => ({ ...r, ...s }), {});
  }
  async onStart() {
    this.reversed = !1, (this.options.direction === "reverse" || this.options.direction === "alternate-reverse" || this.options.direction === "alternate" && this.iteration % 2 === 1) && this.reverse(), (this.options.fillMode === "backwards" || this.options.fillMode === "both") && this.fillBackwards(), this.options.delay > 0 && (this.pause(), await os(this.options.delay), this.pause()), this.started = !0;
  }
  async onEnd() {
    this.options.fillMode === "forwards" || this.options.fillMode === "both" ? this.fillForwards() : (this.options.fillMode === "none" || this.options.fillMode === "backwards") && this.fillBackwards(), this.startTime = void 0, this.iteration === this.options.iterationCount - 1 ? (this.done = !0, this.iteration = 0) : this.iteration += 1;
  }
  async tick(t) {
    if (this.startTime === void 0 && (await this.onStart(), this.startTime = t + this.options.delay), this.paused && this.pausedTime === 0)
      return this.pausedTime = t, this.t;
    if (this.pausedTime > 0 && !this.paused) {
      const n = t - this.pausedTime;
      this.startTime += n, this.pausedTime = 0;
    }
    return this.t = t - this.startTime, this.t >= this.options.duration && (await this.onEnd(), this.t = this.options.duration), this.t;
  }
  async draw(t) {
    t = await this.tick(t), !this.paused && (this.interpFrames(t, !0), this.done ? (this.reset(), this.resolvePromise && this.resolvePromise()) : this.handleId = vt(this.draw.bind(this)));
  }
  async play() {
    return new Promise((t) => {
      this.resolvePromise = t, this.handleId = vt(this.draw.bind(this));
    });
  }
  pause(t = !0) {
    return this.paused && t && (this.handleId = vt(this.draw.bind(this))), this.started && (this.paused = !this.paused), this;
  }
  stop() {
    er(this.handleId), this.reset();
  }
  playing() {
    return !(!this.started || this.paused);
  }
  reset() {
    return this.done = !1, this.started = !1, this.paused = !1, this;
  }
  setTargets(...t) {
    return this.targets = t, this.frames.forEach((n) => {
      Object.values(n.interpVars).forEach((r) => {
        r.forEach(({ start: s, stop: i, value: o }) => {
          s.setTargets(this.targets), i.setTargets(this.targets), o.setTargets(this.targets);
        });
      });
    }), this;
  }
  group(...t) {
    return new ka(this, ...t);
  }
}
class Oa extends za {
  constructor(t, ...n) {
    super(t, n), this.unflatten = !1;
  }
  fromVars(t, n) {
    this.unflatten = n != null, n ??= this.transform.bind(this);
    for (let r = 0; r < t.length; r++) {
      const s = t[r], i = Math.round(r / (t.length - 1) * 100);
      this.addFrame(i, s, n);
    }
    return this.parse(), this;
  }
  fromKeyframes(t, n) {
    this.unflatten = n != null, n ??= this.transform.bind(this), Te(t) && (t = new Map(Object.entries(t)));
    for (const [r, s] of t.entries())
      this.addFrame(r, s, n);
    return this.parse(), this;
  }
  fromString(t, n) {
    this.unflatten = n != null, n ??= this.transform.bind(this);
    const r = ga(t);
    for (const [s, i] of r.entries())
      this.addFrame(s, i, n), this.parsedVars.push(i);
    return this.parse(), this;
  }
  transform(t) {
    Ba(t, this.targets);
  }
}
export {
  za as Animation,
  Oa as CSSKeyframesAnimation,
  Ta as getAnimationId
};
