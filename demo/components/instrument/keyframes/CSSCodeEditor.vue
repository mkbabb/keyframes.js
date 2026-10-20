<template>
    <!-- KF-CE-17 + KF-CE-23 (W6-I, ONE radius vocabulary): the framed editor
         is the producer's `<Card :shadow="false">` + `cartoon-surface` (glass 8.0.0
         retired the `cartoon` prop for the class it wrapped) — the same
         `cartoon-surface` recipe, reached through the component instead of as
         a raw utility on a bare `<div>` (the demo's only such site), so the
         plate's hairline is the Card's own and its radius is `rounded-card`
         by construction; the off-ladder `rounded-lg` — the demo's one
         cartoon-stamped surface nested inside a `rounded-card` Card on a
         different corner — is gone. Monaco mounts on the inner box, which
         owns the height. X-DS pass 1 (KF-P1-16): the frame's `#header` slot is
         the well's first row, INSIDE the card, so a consumer's title and
         status sit on the surface they describe instead of on the page grid
         above it.

         KF-CE-14 + KF-CE-10 — the well has THREE states, and the demo's
         largest module is never an empty hard-bordered box: while the chunk
         is in flight the well is `aria-busy` under the producer's `Skeleton`
         sheen (the same primitive-as-sheen the app shell's Suspense fallback
         uses); if the boot REJECTS (a chunk fetch failed offline, a worker
         URL 404'd) the well says so in an alert with the reason and a Retry
         that re-runs the boot — the rejected boot promise is dropped, not
         cached, so the retry is a real second attempt. The frame is the Card
         when `border` is set and a bare box otherwise; one markup, two
         frames. -->
    <component
        :is="border ? Card : 'div'"
        v-bind="border ? { shadow: false } : {}"
        :class="['code-well w-full overflow-hidden', border ? 'cartoon-surface' : '']"
    >
        <slot name="header" />
        <!-- X-DS pass 1, C1 (KF-C1-19) — the well has a right gutter: Monaco
             has no inline padding, so the code ran flush into the card's edge.
             The box insets its end by the gutter and paints it in the active
             theme's own editor ground, so the inset reads as the editor's. -->
        <div class="code-well__body relative" :style="{ '--code-well-ground': wellGround }">
            <div
                ref="containerEl"
                class="code-well__box w-full"
                :style="{ minBlockSize: contentHeight ? `max(${height}, ${contentHeight}px)` : height }"
                :aria-busy="phase === 'pending' || phase === 'booting' ? 'true' : undefined"
            ></div>
            <!-- X-DS r7 pass 11 (KF-C11-01): the sheen (glass's infinite
                 breathe) mounts only once the well has a box and the boot has
                 begun. A well force-mounted in the hidden Keyframes pane is
                 `pending`, busy but with no Skeleton, so a pane that is never
                 opened carries no looping animation. -->
            <Skeleton
                v-if="phase === 'booting'"
                class="absolute inset-0"
                aria-hidden="true"
            />
            <div
                v-else-if="phase === 'failed'"
                role="alert"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
            >
                <p class="text-destructive">The code editor could not load.</p>
                <p class="text-muted-foreground text-sm">{{ bootError }}</p>
                <Button size="sm" emphasis="secondary" @click="initEditor()">
                    Retry
                </Button>
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { useMediaQuery, useResizeObserver } from "@vueuse/core";
// Monaco is the demo's single largest module (`vendor-monaco`, ~2.5 MB
// minified at the `editor.api` surface this boot loads). A static
// `import * as monaco` here pulled it onto the eager graph of EVERY scene
// chunk that reaches CSSCodeEditor (the Spring sidebar imports it statically),
// so a scene's first paint paid Monaco's bytes before any editor mounted — the
// spring-mobile LCP outlier (E.W4 S1). Everything that statically links the
// `vendor-monaco` chunk is DYNAMIC, resolved once at first editor mount:
//   • the API namespace and the language definition, in `bootMonaco`, AND
//   • the `?worker` entry-point, inside `getWorker` — a STATIC `?worker`
//     import still emits a tiny worker-proxy edge INTO `vendor-monaco`, so a
//     static worker import re-eagerizes the chunk it is meant to defer, and
//     an import AWAITED in the boot serializes a fetch monaco does not need
//     at `create` ahead of first mount (KF-CE-39). `getWorker` may return a
//     `Promise<Worker>`, so the worker's chunk is fetched the first time
//     monaco asks for one, and never before.
// Vite splits each behind the editor-mount boundary, so a non-editor scene never
// loads `vendor-monaco`. The TYPE side stays static (`import type`) — erased
// under `verbatimModuleSyntax`, no runtime edge; this ROOT type import is also
// what types `self.MonacoEnvironment`, so it is not deletable.
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api.js";
// Theme JSONs are vendored locally: monaco-themes@0.4.x only exports `.` and
// `./dist/monaco-themes.js` in its `exports` field, so `monaco-themes/themes/*`
// is not resolvable under the strict bundler (Vite 8 / Rolldown). These two
// small theme definitions live alongside this editor instead. Their `base` is
// a JSON string where monaco wants the `BuiltinTheme` literal union; the
// narrow cast at `defineTheme` is exactly that widening and nothing else
// (KF-CE-29 — with the specifier resolving, the cast is load-bearing).
import DarkTheme from "./monaco-themes/Dracula.json";
import LightTheme from "./monaco-themes/GitHub.json";
import { CODE_INK } from "./utils/codeTokens";
import { Card } from "@mkbabb/glass-ui/card";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { clampIOSNoZoomFontSize } from "@utils/iosTextEntry";
import { formatEditorCSS } from "@utils/formatEditorCSS";
import { debounce } from "@utils/helpers";
import { toast } from "@mkbabb/glass-ui/toast";
// `Skeleton` and `Button` are root-barrel-only at glass-ui 7.0.0 (no
// `./skeleton` subpath — the record's killed #2); the root barrel is already
// on the app's eager graph (the ribbon, the shell's Suspense fallback), so
// this import adds no chunk.
import { Button, Skeleton } from "@mkbabb/glass-ui";

// The resolved Monaco namespace + a single in-flight boot promise. The boot is
// idempotent and module-scoped: the FIRST editor to mount loads + configures
// Monaco once (worker env, themes, the `css` language), every later editor
// awaits the same settled promise — no double-register, no second fetch.
//
// THE LANGUAGE (KF-CE-1 / KF-CE-4, arm (b) — decided in the wave record before
// this byte): `editor.api` registers NO language, NO tokenizer and NONE of the
// editor contributions (find, context menu, comment toggle, folding, bracket
// matching, multicursor, hover — the ~110-module set `_.contribution.js`
// would drag back along with the css language SERVICE and its 1 MB worker).
// This boot hand-registers monaco's OWN css grammar — `basic-languages/css/
// css.js`, a zero-import data module: the Monarch tokenizer that colours the
// buffer through the vendored themes' token rules, and the language
// configuration (comments, brackets, auto-closing and surrounding pairs) the
// core editor reads. The contributions stay ABSENT, by decision: this is a
// short-snippet keyframes editor, the keyboard trap is cured by option
// (`tabFocusMode`), and the bytes those affordances cost were measured and
// declined. No css language service runs, so no css worker is ever
// requested; the one worker monaco does ask for is the base editor worker.
let monaco: typeof Monaco | undefined;
let monacoBoot: Promise<typeof Monaco> | undefined;

function bootMonaco(): Promise<typeof Monaco> {
    return (monacoBoot ??= Promise.all([
        import("monaco-editor/esm/vs/editor/editor.api.js"),
        import("monaco-editor/esm/vs/basic-languages/css/css.js"),
    ]).then(([m, css]) => {
        self.MonacoEnvironment = {
            async getWorker() {
                // Each `?worker` virtual module default-exports a Worker
                // constructor; imported here, on first request, its
                // monaco-proxy edge stays off every scene's initial graph AND
                // off the boot's critical path.
                const { default: EditorWorker } = await import(
                    "monaco-editor/esm/vs/editor/editor.worker?worker"
                );
                return new EditorWorker();
            },
        };
        m.languages.register({ id: "css" });
        m.languages.setLanguageConfiguration("css", css.conf);
        m.languages.setMonarchTokensProvider("css", withKeyframeStops(css.language));
        monaco = m;
        return m;
    }));
}

// OD19-K7 — the grammar names what this editor is about. Monaco's css grammar
// tokenizes a keyframe stop (`0%`, `from`) as a value number / value keyword
// and the animation's name as a value, so no theme rule could ink them apart
// from a declaration's `20px` or `ease`. The grammar is data: a copy whose
// `@keyframes` name is a `tag` (the structure, as a selector is) and whose
// keyframe body reads its stops as `keyframe.stop` first. Every other state is
// Monaco's own.
type MonarchLanguage = Monaco.languages.IMonarchLanguage;
function withKeyframeStops(language: MonarchLanguage): MonarchLanguage {
    const { tokenizer } = language;
    return {
        ...language,
        tokenizer: {
            ...tokenizer,
            keyframedeclaration: [
                ["@identifier", "tag"],
                ...tokenizer.keyframedeclaration!.slice(1),
            ],
            keyframebody: [
                [/(?:from|to)\b|-?(?:\d*\.)?\d+%/, "keyframe.stop"],
                ...tokenizer.keyframebody!,
            ],
        },
    };
}

// X-DS pass 4 (KF-C4-01) — THE WELL'S GROUND IS THE APP'S. The vendored
// themes keep their syntax colours, but their editor ground, line highlight and
// gutter were stock (GitHub's ghost-white #F8F8FF with a cream highlight;
// Dracula's slate-blue #282a36), the coolest surface on a warm page in both
// schemes. Those three colours are re-derived from the app's tokens: the ground
// is `--muted`, the highlight a quiet `--foreground` step over it. Monaco takes
// hex strings, not CSS, so the tokens are resolved on the page (a probe
// element's computed colour, then one canvas pixel for the sRGB bytes), and the
// ACTIVE scheme's theme is re-defined on every flip, after the tokens flip.
//
// OD19-ALL (editor open) — ONE probe and ONE canvas per theme definition, not
// one of each per token: the theme resolves eleven colours, and each fresh
// probe appended to <body> re-styled the page inside the editor's boot task.
// The probe is `display: none` (its computed colour still resolves), so it
// never dirties layout.
function tokenResolver(): { hex: (css: string) => string; dispose: () => void } {
    const probe = document.createElement("div");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const ctx = document.createElement("canvas").getContext("2d", {
        willReadFrequently: true,
    });
    const hex = (css: string): string => {
        probe.style.color = css;
        const computed = getComputedStyle(probe).color;
        if (!ctx) return "#00000000";
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = computed;
        ctx.fillRect(0, 0, 1, 1);
        const [r = 0, g = 0, b = 0, a = 255] = ctx.getImageData(0, 0, 1, 1).data;
        return `#${[r, g, b, a].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    };
    return { hex, dispose: () => probe.remove() };
}

function defineGroundedTheme(m: typeof Monaco, dark: boolean): void {
    const base = (dark ? DarkTheme : LightTheme) as Monaco.editor.IStandaloneThemeData;
    const { hex: resolveTokenHex, dispose } = tokenResolver();
    try {
        const ground = resolveTokenHex("var(--muted)");
        const highlight = resolveTokenHex(
            "color-mix(in srgb, var(--foreground) 6%, var(--muted))",
        );
        // X-DS r4 pass 5 (KF-C24-02) — THE INK IS THE APP'S TOO. The vendored
        // themes' rules are TextMate scopes (`entity.other.attribute-name`,
        // `keyword.other…`), and the Monarch css tokenizer emits none of them
        // (`attribute.name.css`, `attribute.value.number.css`, `keyword.css`,
        // `delimiter.bracket.css`…), so stock vs/vs-dark showed through. The rules
        // are written here against the Monarch names, from the app's tokens,
        // resolved as the ground is. Monaco takes rule colours as six-digit hex
        // without the `#`. UIA-KF-097 — the rungs are `CODE_INK`'s, the one table
        // the app's printed code (the spring scene's artifact) is inked from too.
        // OD19-K7 — six rungs (codeTokens.ts): at-rules and selectors, property
        // names, value keywords, numbers with units, keyframe stops, punctuation
        // and comments; the stop also carries the weight, the one mark that
        // anchors each block of the buffer.
        const ink = (css: string) => resolveTokenHex(css).slice(1, 7);
        const fg = ink(CODE_INK.structure);
        const property = ink(CODE_INK.property);
        const value = ink(CODE_INK.value);
        const number = ink(CODE_INK.number);
        const stop = ink(CODE_INK.stop);
        const punct = ink(CODE_INK.punct);
        // X-DS r7 pass 8 (KF-C8r-01) — THE GUTTER AND THE GUIDES ARE THE APP'S.
        // The ground and the ink were re-derived, but the line numbers and indent
        // guides were still stock (vs teal numerals and a navy active number over
        // #D3D3D3 guides; vs-dark's cool #858585 / #404040): the only teal or cool
        // grey marks on a warm page, in the column the eye scans down. They take
        // the muted ink, the structure ink and the border, resolved as above.
        const numeral = resolveTokenHex("var(--muted-foreground)");
        const rule = resolveTokenHex("var(--border)");
        m.editor.defineTheme(dark ? "dark-theme" : "light-theme", {
            base: base.base,
            // The base's rules stay underneath (its default ground and ink keep
            // the colour map whole); every token the css tokenizer emits is
            // re-inked here, including the three vs-dark qualifies with `.css`
            // (a more specific rule outranks a shorter one).
            inherit: true,
            rules: [
                { token: "", foreground: fg },
                { token: "tag", foreground: fg },
                { token: "keyword", foreground: fg },
                { token: "attribute.name", foreground: property },
                { token: "attribute.value", foreground: value },
                { token: "attribute.value.number", foreground: number },
                { token: "attribute.value.unit", foreground: number },
                { token: "attribute.value.number.css", foreground: number },
                { token: "attribute.value.unit.css", foreground: number },
                { token: "attribute.value.hex.css", foreground: number },
                { token: "number", foreground: number },
                { token: "keyframe.stop", foreground: stop, fontStyle: "bold" },
                { token: "string", foreground: value },
                { token: "comment", foreground: punct, fontStyle: "italic" },
                { token: "delimiter", foreground: punct },
            ],
            colors: {
                ...base.colors,
                "editor.foreground": `#${fg}`,
                "editor.background": ground,
                "editorGutter.background": ground,
                "editor.lineHighlightBackground": highlight,
                "editor.lineHighlightBorder": highlight,
                "editorLineNumber.foreground": numeral,
                "editorLineNumber.activeForeground": `#${fg}`,
                "editorIndentGuide.background1": rule,
                "editorIndentGuide.activeBackground1": rule,
                // X-DS r6 pass 4 (KF-R6C4-03) — no `scrollbarSlider.*` re-ink: the
                // well draws no scrollbar (the editor options below).
            },
        });
    } finally {
        dispose();
    }
}

const props = withDefaults(
    defineProps<{
        height?: string;
        fontSize?: number;
        lineNumbers?: boolean;
        padding?: number;
        border?: boolean;
        /**
         * The editor's accessible name (KF-CE-21). Two editors are alive at
         * once in the instrument (the keyframes pane's and the timeline's
         * per-keyframe well); a parent that mounts one names it.
         */
        ariaLabel?: string;
    }>(),
    {
        height: "300px",
        fontSize: 14,
        lineNumbers: true,
        padding: 16,
        border: true,
        ariaLabel: "CSS",
    },
);

const modelValue = defineModel<string>({ required: true });

const containerEl = useTemplateRef<HTMLElement>("containerEl");
const { isDark, onFlipSettled } = useGlobalDark();
// KF-CE-13: an explicit `theme` at create plus `setTheme` on every flip
// pre-empts monaco's own high-contrast detection, and monaco emits
// `forced-color-adjust: none` for its subtree — so under `forced-colors:
// active` the vendored themes would paint over the user's palette. The theme
// is therefore chosen HERE with that query in hand: monaco's built-in
// high-contrast pair when forced colours are active, the vendored pair
// otherwise, re-chosen when either input moves.
const forcedColors = useMediaQuery("(forced-colors: active)");
const themeName = () =>
    forcedColors.value
        ? isDark.value
            ? "hc-black"
            : "hc-light"
        : isDark.value
          ? "dark-theme"
          : "light-theme";

/** The editor ground under the well's right gutter: the editor's own ground,
 *  `--muted` (KF-C4-01; the system Canvas under forced colours). */
const wellGround = computed(() => (forcedColors.value ? "Canvas" : "var(--muted)"));

/** The buffer's laid-out height (wrapped lines and padding included): the
 *  box grows to it, so the well never scrolls inside the pane (KF-R6C4-03). */
const contentHeight = ref(0);

/** pending → booting → ready, or booting → failed (Retry re-enters booting).
 *  `pending` holds until the well first has a box (KF-C11-01): a well in the
 *  hidden pane is busy, but mounts no Skeleton and so runs no breathe loop. */
const phase = ref<"pending" | "booting" | "ready" | "failed">("pending");
const bootError = ref<string>();

let editor: Monaco.editor.IStandaloneCodeEditor | undefined;
let isSettingValue = false;
// Set on unmount so an `initEditor` that resolves AFTER the component is gone
// (Monaco's chunk was still in flight) disposes its editor instead of leaking
// it over a detached node.
let disposed = false;

// The print width prettier formats to, in columns, read from the EDITOR'S OWN
// layout (KF-CE-24 · KF-CE-25 · KF-CE-26 · KF-CE-49): the content area's
// width (gutter, minimap and scrollbar already excluded) over the width of
// one half-width character of the font monaco actually renders — no `ch ≈
// 0.5em` approximation on the container's inherited font, no gutter counted
// as columns, no unreachable guard. Undefined before the editor exists or
// before it has a laid-out width, in which case the formatter takes its own
// default.
const getFormatWidth = () => {
    if (!editor || !monaco) return undefined;
    const { contentWidth } = editor.getLayoutInfo();
    const { typicalHalfwidthCharacterWidth } = editor.getOption(
        monaco.editor.EditorOption.fontInfo,
    );
    if (!(contentWidth > 0) || !(typicalHalfwidthCharacterWidth > 0)) {
        return undefined;
    }
    return Math.floor(contentWidth / typicalHalfwidthCharacterWidth);
};

// ── The model ⇄ buffer contract (KF-CE-2 child half · KF-CE-6 · KF-CE-7 ·
// KF-CE-8 · KF-CE-18 · KF-CE-31) ──────────────────────────────────────────
//
// BUFFER → MODEL. A user edit arms one trailing-edge emit (200 ms). What the
// editor hands the parent is remembered as `lastEmitted`, so the parent's
// echo of it can be told from a genuinely new projection.
//
// MODEL → BUFFER — the re-projection contract, one seam (`replaceContent`):
//   • An inbound model value equal to `lastEmitted` or to the buffer is an
//     ECHO and is ignored (the parent re-serialized what this editor just
//     emitted; the caret is not touched).
//   • An inbound value that differs while the user HOLDS TEXT FOCUS is the
//     parent's lossy round-trip of the user's own keystrokes (a re-serialize
//     or a prettier pass) arriving mid-authoring. It is NOT written under the
//     caret; it is DEFERRED and applied when focus leaves the editor. Nothing
//     but this editor's own emits can move the model while the user is
//     typing in it, so the deferral never hides a foreign write.
//   • An inbound value that differs while the editor is NOT focused is a real
//     projection — another keyframe selected, a Controls-tab option edit
//     re-projected by the parent, a format — and is applied at once.
//   • EVERY application first CANCELS the armed emit: an external write
//     means the parent has moved on, and anything still armed was authored
//     against a buffer that no longer exists — delivering it late is the
//     wrong-keyframe clobber (KF-CE-2). The parent half of that cure —
//     resolving the emit's target at arm time / keying the mount — is the
//     timeline's own (KF.W7), not re-done here.
//   • The write is an EDIT over the full range between two undo stops, not
//     `setValue`: undo/redo history and decorations survive a projection
//     (KF-CE-6), and the caret is restored (monaco clamps it to the new
//     text).
// Unmount cancels the armed emit too (KF-CE-18): a torn-down instance emits
// nothing.
let lastEmitted: string | undefined;
let projectionDeferred = false;

const emitNow = (value: string) => {
    lastEmitted = value;
    modelValue.value = value;
};

const debouncedEmit = debounce(emitNow, 200);

const replaceContent = (next: string) => {
    debouncedEmit.cancel();
    const model = editor?.getModel();
    if (!editor || !model || model.getValue() === next) return;
    const pos = editor.getPosition();
    isSettingValue = true;
    editor.pushUndoStop();
    editor.executeEdits("replaceContent", [
        { range: model.getFullModelRange(), text: next },
    ]);
    editor.pushUndoStop();
    isSettingValue = false;
    if (pos) editor.setPosition(pos);
};

/** Apply the model to the buffer under the contract above. */
const projectModel = (next: string) => {
    if (!editor) return;
    if (next === lastEmitted || next === editor.getValue()) return;
    if (editor.hasTextFocus()) {
        projectionDeferred = true;
        return;
    }
    replaceContent(next);
};

const initEditor = async () => {
    const el = containerEl.value;
    // The container may have unmounted while Monaco's chunk was in flight; bail
    // cleanly rather than create an editor over a detached node.
    if (!el) return;
    phase.value = "booting";
    bootError.value = undefined;
    let m: typeof Monaco;
    try {
        m = await bootMonaco();
    } catch (e: unknown) {
        // KF-CE-10: a rejected boot is NOT cached — the `??=` above would
        // otherwise hand every later mount the same dead promise for the
        // session. Drop it, render the failure, and let Retry boot again.
        monacoBoot = undefined;
        if (disposed) return;
        bootError.value = e instanceof Error ? e.message : String(e);
        phase.value = "failed";
        console.error(e);
        return;
    }
    // Lost the race: the component unmounted while the chunk loaded. Do not
    // create an editor over the now-detached container.
    if (disposed || !containerEl.value) return;

    if (!forcedColors.value) defineGroundedTheme(m, isDark.value);
    editor = m.editor.create(el, {
        value: modelValue.value,
        language: "css",
        // KF-CE-21: the accessible name of the input area.
        ariaLabel: props.ariaLabel,
        theme: themeName(),
        // KF-CE-20 — the font (family from `--font-mono`): `fontOptions()`.
        ...fontOptions(),
        minimap: { enabled: false },
        // X-DS r4 pass 5 (KF-C24-02) — matching the bracket under the cursor
        // stays; the bracket-pair rainbow goes (below, on the model).
        matchBrackets: "always",
        // X-DS r4 pass 5 (KF-C24-04) — the current-line band shows only while
        // someone is editing; at rest it read as a selected or erroring line.
        renderLineHighlight: "line",
        renderLineHighlightOnlyWhenFocus: true,
        // X-DS pass 1, C1 (KF-C1-19) — no overview ruler: its lanes drew a
        // stray tick at the well's top-right with nothing to say in a short
        // snippet editor.
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        // UIA-KF-174 (X.KF.W13X.keyframes) — code never wraps INSIDE a token.
        // In the 316–403 px pane Monaco's default soft wrap cut inside
        // identifiers and before `(` / `:` (`rotateY` / `(0turn)`, a selector
        // over three visual lines at 390), so the wrap was turned off.
        // X-DS r6 pass 4 (KF-R6C4-03) — a line wraps AT ITS SPACES ONLY. With
        // the wrap off, the cube's one-line `transform` list ran out of the
        // well cut mid-token (`rotateY(0turr`), with a loose slider under it.
        // The break opportunities are the spaces and nothing else (no break
        // before `(` or `:`, none after `-` or `.`), so a function call and an
        // identifier never part: the list breaks between its functions, and a
        // wrapped line hangs one indent under its declaration.
        wordWrap: "bounded",
        wordWrapBreakBeforeCharacters: "",
        wordWrapBreakAfterCharacters: " ",
        wrappingIndent: "indent",
        // X-DS r6 pass 4 (KF-R6C4-03) — the well has NO scrollbars. The
        // horizontal slider was the clipped line's cue (KF-C7-12, stepped down
        // to a 4 px hairline tone at KF-C4-05); the buffer wraps now (above),
        // so no line is wider than the well, and a `visible` bar drew a
        // full-width slider over nothing. Nor does it scroll vertically: the
        // box takes the buffer's content height (`contentHeight`, floored at
        // `height`), so the pane's own scroller, with its fold landing and
        // glass's end fade, is the ONE scroller, and a wheel over the code
        // scrolls the pane. Monaco takes the vertical bar's width out of the
        // wrapping width even when the bar is hidden, so its size is 0.
        scrollbar: {
            horizontal: "hidden",
            vertical: "hidden",
            verticalScrollbarSize: 0,
            alwaysConsumeMouseWheel: false,
            useShadows: false,
        },
        scrollBeyondLastLine: false,
        // KF.W13X Repair (C1r2-3) — the WELL's observer lays the editor out
        // (`useResizeObserver` below), not Monaco's own `automaticLayout`.
        // Monaco's observer outlived the component: the outgoing editor, kept
        // until idle so its teardown is no part of a swap's first frame, saw
        // its detached well shrink to 0 and re-wrapped every line inside the
        // destination's frame, before its paint. The component's observer is
        // bound to its scope, so it stops at unmount.
        automaticLayout: false,
        lineNumbers: props.lineNumbers ? "on" : "off",
        // X-DS pass 8 (KF-C8-03) — a snippet gutter, not a file gutter.
        // Monaco's defaults (a five-character number column, a fold margin,
        // a glyph margin, a 10 px decoration lane) took ~70 px of a ~405 px
        // well while the code itself clipped mid-token. An 18-line buffer
        // needs two digits and nothing else; the original editor had no
        // gutter of this weight.
        lineNumbersMinChars: 2,
        lineDecorationsWidth: 8,
        folding: false,
        glyphMargin: false,
        // KF-CE-3 (WCAG 2.1.2): Tab MOVES FOCUS out of this editor. With the
        // `editor.api` boot the `toggleTabFocusMode` contribution (Ctrl+M) is
        // not loaded, so without this option Tab is bound to indentation
        // unconditionally and a keyboard user can enter the well but never
        // leave it. `tabFocusMode` is a create-time editor option that seeds
        // the `tabDoesNotMoveFocus` context key directly — no contribution
        // is needed — and it is the right posture for a short-snippet editor
        // whose indentation is one Format away.
        tabFocusMode: true,
        // KF-CE-5: `accessibilitySupport` is left at monaco's `"auto"` (its
        // own advice) — screen-reader mode is detected, not switched off, so
        // the tab-behaviour state above is announced to the AT that needs it.
        padding: {
            top: props.padding,
            bottom: props.padding,
        },
    });
    // X-DS r4 pass 5 (KF-C24-02) — no bracket-pair rainbow: three hues on the
    // braces of an 18-line snippet carry no meaning. The colouriser is the
    // MODEL's (the standalone editor's `bracketPairColorization` option does
    // not reach the model it creates), so it is switched off there.
    editor.getModel()?.updateOptions({
        bracketColorizationOptions: { enabled: false, independentColorPoolPerBracketType: false },
    });
    phase.value = "ready";
    contentHeight.value = editor.getContentHeight();
    editor.onDidContentSizeChange((e) => {
        if (e.contentHeightChanged) contentHeight.value = e.contentHeight;
    });

    editor.onDidChangeModelContent(() => {
        if (isSettingValue) return;
        debouncedEmit(editor!.getValue());
    });
    // A projection deferred while the user held focus lands now, against the
    // model's CURRENT truth (never a value captured earlier).
    editor.onDidBlurEditorText(() => {
        if (!projectionDeferred) return;
        projectionDeferred = false;
        projectModel(modelValue.value);
    });
};

const setCodeTheme = () => {
    // No-op until Monaco has booted; `initEditor` sets the correct theme at
    // create time, so a dark-mode toggle before boot loses nothing.
    if (!monaco) return;
    if (!forcedColors.value) defineGroundedTheme(monaco, isDark.value);
    monaco.editor.setTheme(themeName());
};

// KF-CE-28: the dark flip re-themes in glass-ui's ONE coalesced post-flip
// task (`onFlipSettled`), beside every other consumer's re-theme, rather
// than in a per-instance watcher racing the chrome's own paint. The
// forced-colours query has no such hook and keeps a watch.
const stopFlipSettled = onFlipSettled(setCodeTheme);
watch(forcedColors, setCodeTheme);

// KF-CE-19: the geometry props are LIVE — re-applied through `updateOptions`
// when a parent changes them — not read once at create.
watch(
    () => [props.fontSize, props.lineNumbers, props.padding] as const,
    ([fontSize, lineNumbers, padding]) => {
        editor?.updateOptions({
            fontSize: clampIOSNoZoomFontSize(fontSize),
            lineNumbers: lineNumbers ? "on" : "off",
            padding: { top: padding, bottom: padding },
        });
    },
);

watch(modelValue, projectModel);

// Format the buffer and hand the RESULT to the model (KF-CE-7): the formatted
// text is written through the seam and emitted at once, so the parent holds
// what the user sees and the next projection cannot revert it. A rejection
// (prettier refuses the mid-edit buffer) propagates to the caller — the ONE
// error boundary is the parent's `formatEditor` (KF-CE-9 + KF-CE-37), which
// both the chord and the ribbon's Format button reach.
const formatCSSContent = async () => {
    if (!editor) return;
    const formatted = await formatEditorCSS(editor.getValue(), getFormatWidth());
    if (disposed || !editor) return;
    replaceContent(formatted);
    emitNow(formatted);
    toast({ title: "CSS formatted", tone: "success" });
};

// X.KF.W13X · KFA-81 (stall limb, ESC-r4shell-1, COHESION §0fa item 3) — the
// boot runs PAST THE PANE'S FIRST PAINT, in the first idle period after it.
// Called inline from `onMounted`, Monaco's chunk evaluation, `editor.create`
// and its first layout landed in the very frame that mounts the pane, so a
// scene entry that reveals the Keyframes surface stalled ~0.5 s before its
// first frame could present. The well paints at once under its Skeleton
// (`phase === 'booting'`) and the editor fills it when the page is idle:
// `requestIdleCallback` where the engine ships it (the house idiom of
// `warmScenesAtIdle` and the Keyframes warm), else one task past the next
// paint. It waits on the frame, never on a clock: no fixed delay. Retry stays
// a direct boot (a user act wants its answer now). The outgoing editor's
// teardown takes the same seat (`onUnmounted`): a scene swap unmounts one pane
// and mounts the next inside one frame, and Monaco's dispose is no part of the
// destination's first paint.
const whenPainted = (run: () => void) => {
    if ("requestIdleCallback" in window) requestIdleCallback(run);
    else requestAnimationFrame(() => setTimeout(run));
};
// OD19-ALL (editor open) — a box that arrives on a pane OPEN boots one frame
// later still: the observer reports inside the reveal frame, and an idle
// period could open before that frame rendered, so `editor.create` forced the
// whole revealed pane's layout inside its own task (a 70–77 ms frame, 28–30 ms
// of it forced layout, LoAF). After one animation frame the pane is laid out
// and painted, and the editor's task lays out only itself.
const initAfterPaint = () =>
    requestAnimationFrame(() =>
        whenPainted(() => {
            if (!disposed) void initEditor();
        }),
    );

// The font the editor measures (Monaco keys its font-measurement cache on it):
// one source for the editor and for the warm below.
// KF-CE-20 (W6-M, the token-read half; the pipeline is EDITOR-UNIT's) —
// the family was the bare literal `"Fira Code"`, with NO generic
// fallback and bypassing `--font-mono` entirely. It was latent only
// because `style.css` self-hosts the OFL payload on the same page: any
// load failure, any consumer that does not ship that payload, and Monaco
// silently renders whatever the platform picks for an unresolvable
// family — with no `monospace` behind it to catch the fall. The token is
// the demo's single mono authority (`--font-mono: "Fira Code",
// monospace`, declared in `style.css`'s `@theme`), and reading it here
// takes BOTH halves at once: the editor follows the same family every
// other code surface reads, and the generic fallback arrives with it.
// Monaco takes a CSS font-family STRING, not an element, so the value is
// resolved once off the document element at create time rather than
// re-read per frame; the literal below is the last resort if the
// stylesheet has not applied yet, and it is a GENERIC, never a face.
const fontOptions = () => ({
    fontLigatures: true,
    fontSize: clampIOSNoZoomFontSize(props.fontSize),
    fontFamily:
        getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
        "monospace",
});

// The first `editor.create` on a page measures the font (character widths,
// read through forced layouts of Monaco's own measuring nodes): the
// `readFontInfo` chain is the open's largest forced layout (CPU profile, OD19
// KF-P3, `profile-open-forced.txt`). Monaco caches that measurement for the
// page, keyed on the font, so the warm primes it: one throwaway editor with
// the SAME font, in an offscreen box of its own at <body> (never the hidden
// well, so the well is still never laid out), disposed in the same task, at
// idle.
function warmFontMeasurement(m: typeof Monaco): void {
    const box = document.createElement("div");
    box.style.cssText =
        "position:fixed;left:-10000px;top:0;width:240px;height:48px;visibility:hidden;contain:strict";
    document.body.appendChild(box);
    try {
        m.editor
            .create(box, {
                ...fontOptions(),
                automaticLayout: false,
                dimension: { width: 240, height: 48 },
                minimap: { enabled: false },
            })
            .dispose();
    } finally {
        box.remove();
    }
}

// OD19-ALL (editor open; KF-P3) — THE CHUNK IS WARM BEFORE THE PANE OPENS.
// The Keyframes pane force-mounts this well hidden at idle (T.G9), and the
// boot waited for the well's first box (C1r2-2), so opening the surface paid
// the Monaco chunk's fetch and evaluation AND `editor.create` in the open's
// frames (276–407 ms input→editor paint, one 128–134 ms frame). The well's
// first idle period after mount now WARMS the chunk: the module boot only
// (`bootMonaco`: the imports, the worker env, the css language) and, one idle
// period later, the font measurement (`warmFontMeasurement`); never an editor
// in the well, never a geometry read of it, so a hidden well stays unlaid-out
// and the open pays the well's own `editor.create` alone. It is the SAME idle seat the boot takes
// (KFA-81): a well that already has a box when that period comes boots in it,
// so there is still one idle callback per mount; a box that arrives later
// boots in an idle period of its own. A failed warm is dropped like a failed
// boot, so the real boot retries the fetch and surfaces its error.
let mountIdleDone = false;
onMounted(() =>
    whenPainted(() => {
        mountIdleDone = true;
        if (disposed) return;
        if (bootQueued) {
            void initEditor();
            return;
        }
        bootMonaco().then(
            (m) =>
                whenPainted(() => {
                    if (!disposed && !editor) warmFontMeasurement(m);
                }),
            () => {
                monacoBoot = undefined;
            },
        );
    }),
);

// KF.W13X Repair (C1r2-2 · C1r2-3) — ONE observer on the well, bound to this
// component's scope: it boots the editor once the well first has a box, and
// lays a live editor out on every later box change. It never reads geometry
// itself. The former synchronous `offsetWidth` read at mount forced a layout
// of a well force-mounted under the Keyframes pane's `content-visibility:
// hidden` cache (Chrome: "Rendering was performed in a subtree hidden by
// content-visibility"), and then booted Monaco into that hidden well. A
// skipped subtree is not laid out, so its observer stays silent until the
// pane is shown, and the boot waits for it.
let bootQueued = false;
useResizeObserver(containerEl, (entries) => {
    const box = entries[0]?.contentRect;
    if (!box || box.width <= 0 || box.height <= 0) return;
    if (editor) {
        editor.layout({ width: box.width, height: box.height });
        return;
    }
    if (bootQueued) return;
    bootQueued = true;
    phase.value = "booting";
    // Before the mount's idle period the boot rides it (above); after, it
    // takes the next one.
    if (mountIdleDone) initAfterPaint();
});

onUnmounted(() => {
    disposed = true;
    debouncedEmit.cancel();
    stopFlipSettled();
    const outgoing = editor;
    editor = undefined;
    if (outgoing) whenPainted(() => outgoing.dispose());
});

// The ONE exposed member (KF-CE-27). `setValue`/`getValue`/`editor()` had no
// consumer (the two parents bind `v-model` and reach only `formatCSS`), and
// each was a model-desync hatch or a raw-instance leak by construction; text
// reaches this buffer through the model alone.
defineExpose({
    formatCSS: formatCSSContent,
});
</script>

<style scoped>
/* UIA-KF-176 + UIA-KF-276 (X.KF.W13X.keyframes) — ONE focus language on the
   pane. Focusing the code drew Monaco's own 1px focusBorder outline (served:
   rgb(0, 144, 241) light / rgb(0, 127, 212) dark) as a square rectangle on the
   node that holds the caret, cutting across the card's 16px corners, while
   every glass control beside it showed the glass ring. The caret's node gives
   up its outline, and the WELL wears the ring instead: glass's own focus-ring
   tokens (`--focus-ring-width`, `--focus-ring-color`, the 2px offset of its
   `.focus-ring:focus-visible`), on the card, so it follows the card's radius.
   A text entry lights `:focus-visible` on a pointer click too, which is the
   contract `design-idioms.css`'s cartoon lift already keys on. Forced colors
   keep the outline (the UA maps its colour to the system ring). */
.code-well:has(:focus-visible) {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
}

/* X-DS pass 11 (KF-C11-01) — the well starts on the pane's one inset. The
   wide default gutter (KF-C8-03 cut it to a snippet gutter) had been acting as
   the well's start margin; with it gone the numerals sat on the frame's inner
   edge (0 px) while the title and footer sit on the 20 px column. The inset is
   padding in the well's own ground, so the gutter stays narrow and the
   numerals land on the column. */
/* X-DS r7 pass 5 (KF-C5-01) — THE WELL FILLS THE ROOM IT IS GIVEN. The box's
   height was its floor (`height`, or the buffer's content height above it),
   so in the desktop rail, where the pane ends on the stage's foot, a 52 px
   blank band stood between the well's end and the ribbon's rule. The well is
   now a column whose box takes the floor AND any block a growing parent hands
   it (`.rail-fill`, ControlsPaneWrapper.css); Monaco lays out at the box's
   size through the well's own observer. The box is size-contained, so its
   contribution is the floor, never the editor it last laid out: a pane that
   shrinks shrinks the well with it. Where no parent grows it (the phone
   sheet, a test mount) the box is exactly its floor, as before. */
.code-well {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
}
.code-well__body {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
}
.code-well__box {
    flex: 1 1 0;
    contain: size;
}
/* X-DS r8 pass 10 (KF-C10x-03) — THE WELL GIVES BACK THE LAYER'S EDGE. Since
   KF-C9x-02 the well sits in glass's ConfiguratorLayer, whose 1 px border
   (transparent here) on each side took 2 px from Monaco's box, and the
   default buffer's line 4 soft-wrapped ('ease-in-out;' alone). The well's own
   gutters each give 1 px back, so the box is the width it was and the
   numerals stay on the 20 px column (the layer's edge plus this inset).
   Glass's border is not touched. */
.code-well__body {
    padding-inline-start: calc(var(--configurator-pad-inline) - 1px);
    padding-inline-end: calc(var(--space-body) - 1px);
    background: var(--code-well-ground);
}

.code-well :deep(.monaco-editor :focus-visible) {
    outline: none;
}
</style>
