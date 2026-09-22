<template>
    <!-- KF-CE-17 + KF-CE-23 (W6-I, ONE radius vocabulary): the framed editor
         is the producer's `<Card cartoon :shadow="false">` — the same
         `cartoon-surface` recipe, reached through the component instead of as
         a raw utility on a bare `<div>` (the demo's only such site), so the
         plate's hairline is the Card's own and its radius is `rounded-card`
         by construction; the off-ladder `rounded-lg` — the demo's one
         cartoon-stamped surface nested inside a `rounded-card` Card on a
         different corner — is gone. The demo's focus-elevation rule
         (`.cartoon-surface:has(:focus-visible)`, design-idioms.css) keys on
         the class the Card carries, so the lift for a focused Monaco well is
         unchanged. Monaco mounts on the inner box, which owns the height.

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
        v-bind="border ? { cartoon: true, shadow: false } : {}"
        class="relative w-full overflow-hidden"
    >
        <div
            ref="containerEl"
            class="w-full"
            :style="{ height }"
            :aria-busy="phase === 'booting' ? 'true' : undefined"
        ></div>
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
    </component>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
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
import { Card } from "@mkbabb/glass-ui/card";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { clampIOSNoZoomFontSize } from "@components/instrument/utils/iosTextEntry";
import { formatEditorCSS } from "@utils/formatEditorCSS";
import { debounce } from "@utils/helpers";
import { toast } from "vue-sonner";
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
        m.editor.defineTheme(
            "dark-theme",
            DarkTheme as Monaco.editor.IStandaloneThemeData,
        );
        m.editor.defineTheme(
            "light-theme",
            LightTheme as Monaco.editor.IStandaloneThemeData,
        );
        m.languages.register({ id: "css" });
        m.languages.setLanguageConfiguration("css", css.conf);
        m.languages.setMonarchTokensProvider("css", css.language);
        monaco = m;
        return m;
    }));
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

/** booting → ready, or booting → failed (Retry re-enters booting). */
const phase = ref<"booting" | "ready" | "failed">("booting");
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

    editor = m.editor.create(el, {
        value: modelValue.value,
        language: "css",
        // KF-CE-21: the accessible name of the input area.
        ariaLabel: props.ariaLabel,
        fontLigatures: true,
        theme: themeName(),
        fontSize: clampIOSNoZoomFontSize(props.fontSize),
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
        fontFamily:
            getComputedStyle(document.documentElement)
                .getPropertyValue("--font-mono")
                .trim() || "monospace",
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: props.lineNumbers ? "on" : "off",
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
    phase.value = "ready";

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
    monaco?.editor.setTheme(themeName());
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
    toast.success("CSS formatted");
};

onMounted(() => {
    const el = containerEl.value!;
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        initEditor();
        return;
    }
    // Deferred init: wait for the container to gain non-zero size, then
    // initialise once and self-stop — the one-shot lifecycle vueuse's
    // `useResizeObserver` expresses via its returned `stop()` handle (and
    // auto-cleans on scope dispose if we unmount before the size resolves).
    const { stop } = useResizeObserver(el, (entries) => {
        const entry = entries[0];
        if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            stop();
            initEditor();
        }
    });
});

onUnmounted(() => {
    disposed = true;
    debouncedEmit.cancel();
    stopFlipSettled();
    editor?.dispose();
});

// The ONE exposed member (KF-CE-27). `setValue`/`getValue`/`editor()` had no
// consumer (the two parents bind `v-model` and reach only `formatCSS`), and
// each was a model-desync hatch or a raw-instance leak by construction; text
// reaches this buffer through the model alone.
defineExpose({
    formatCSS: formatCSSContent,
});
</script>
