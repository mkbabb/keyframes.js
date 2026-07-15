<template>
    <div
        ref="containerEl"
        :class="[
            'w-full rounded-lg overflow-hidden',
            border ? 'cartoon-surface' : '',
        ]"
        :style="{ height }"
    ></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
// Monaco (the ~4 MB editor namespace) is the demo's single largest module. A
// static `import * as monaco` here pulled it onto the eager graph of EVERY scene
// chunk that reaches CSSCodeEditor (the Spring sidebar imports it statically),
// so a scene's first paint paid Monaco's bytes before any editor mounted — the
// spring-mobile LCP outlier (E.W4 S1). Everything that statically links the
// `vendor-monaco` chunk is now DYNAMIC, resolved once at first editor mount:
//   • the namespace `import("monaco-editor")`, AND
//   • the two `?worker` entry-points — a STATIC `?worker` import still emits a
//     tiny worker-proxy edge INTO `vendor-monaco`, so a static worker import
//     re-eagerizes the chunk it is meant to defer. Importing the `?worker`
//     modules dynamically (inside the same boot) keeps that edge off every
//     scene's initial graph.
// Vite splits each behind the editor-mount boundary, so a non-editor scene never
// loads `vendor-monaco`. The editor is byte-identical once mounted — only the
// eager load of a not-yet-visible editor disappears. The TYPE side stays static
// (`import type`) — erased under `verbatimModuleSyntax`, no runtime edge.
import type * as Monaco from "monaco-editor";
// Theme JSONs are vendored locally: monaco-themes@0.4.x only exports `.` and
// `./dist/monaco-themes.js` in its `exports` field, so `monaco-themes/themes/*`
// is not resolvable under the strict bundler (Vite 8 / Rolldown). These two
// small theme definitions live alongside this editor instead.
import DarkTheme from "./monaco-themes/Dracula.json";
import LightTheme from "./monaco-themes/GitHub.json";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { clampIOSNoZoomFontSize } from "@components/instrument/utils/iosTextEntry";
import { convert2 } from "@mkbabb/value.js/units";
import { formatCSS } from "@mkbabb/value.js/parsing";
import { debounce } from "@mkbabb/value.js";
import { toast } from "vue-sonner";

// The resolved Monaco namespace + a single in-flight boot promise. The boot is
// idempotent and module-scoped: the FIRST editor to mount loads + configures
// Monaco once (worker env, themes, the `css` language), every later editor
// awaits the same settled promise — no double-register, no second 4 MB fetch.
let monaco: typeof Monaco | undefined;
let monacoBoot: Promise<typeof Monaco> | undefined;

function bootMonaco(): Promise<typeof Monaco> {
    return (monacoBoot ??= Promise.all([
        import("monaco-editor/esm/vs/editor/editor.api"),
        // Each `?worker` virtual module default-exports a Worker constructor; a
        // dynamic import keeps its monaco-proxy edge off the eager scene graph.
        import("monaco-editor/esm/vs/editor/editor.worker?worker"),
        import("monaco-editor/esm/vs/language/css/css.worker?worker"),
    ]).then(([m, editorWorker, cssWorker]) => {
        const EditorWorker = editorWorker.default;
        const CSSWorker = cssWorker.default;
        self.MonacoEnvironment = {
            getWorker(_workerId: string, label: string) {
                if (label === "css" || label === "scss" || label === "less") {
                    return new CSSWorker();
                }
                return new EditorWorker();
            },
        };
        m.editor.defineTheme("dark-theme", DarkTheme as any);
        m.editor.defineTheme("light-theme", LightTheme as any);
        m.languages.register({ id: "css" });
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
    }>(),
    {
        height: "300px",
        fontSize: 14,
        lineNumbers: true,
        padding: 16,
        border: true,
    },
);

const modelValue = defineModel<string>({ required: true });

const containerEl = useTemplateRef<HTMLElement>("containerEl");
const { isDark } = useGlobalDark();

let editor: Monaco.editor.IStandaloneCodeEditor | undefined;
let isSettingValue = false;
// Set on unmount so an `initEditor` that resolves AFTER the component is gone
// (Monaco's chunk was still in flight) disposes its editor instead of leaking
// it over a detached node.
let disposed = false;

const getFormatWidth = () => {
    const el = containerEl.value;
    if (!el || !el.offsetWidth || el.offsetWidth === 0) return undefined;
    const ch = convert2(el.offsetWidth, "px", "ch", el);
    return ch != null ? Math.floor(ch) : undefined;
};

const debouncedEmit = debounce(
    (value: string) => {
        modelValue.value = value;
    },
    200,
    false,
);

const initEditor = async () => {
    const el = containerEl.value;
    // The container may have unmounted while Monaco's chunk was in flight; bail
    // cleanly rather than create an editor over a detached node.
    if (!el) return;
    const m = await bootMonaco();
    // Lost the race: the component unmounted while the chunk loaded. Do not
    // create an editor over the now-detached container.
    if (disposed || !containerEl.value) return;

    editor = m.editor.create(el, {
        value: modelValue.value,
        language: "css",
        fontLigatures: true,
        theme: isDark.value ? "dark-theme" : "light-theme",
        fontSize: clampIOSNoZoomFontSize(props.fontSize),
        fontFamily: "Fira Code",
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: props.lineNumbers ? "on" : "off",
        accessibilitySupport: "off",
        padding: {
            top: props.padding,
            bottom: props.padding,
        },
    });

    editor.onDidChangeModelContent(() => {
        if (isSettingValue) return;
        debouncedEmit(editor!.getValue());
    });
};

const setCodeTheme = () => {
    // No-op until Monaco has booted; `initEditor` sets the correct theme at
    // create time, so a dark-mode toggle before boot loses nothing.
    monaco?.editor.setTheme(isDark.value ? "dark-theme" : "light-theme");
};

watch(isDark, setCodeTheme);

watch(
    modelValue,
    (newVal) => {
        if (editor && editor.getValue() !== newVal) {
            const pos = editor.getPosition();
            isSettingValue = true;
            editor.setValue(newVal);
            if (pos) editor.setPosition(pos);
            isSettingValue = false;
        }
    },
);

const formatCSSContent = async () => {
    if (!editor) return;
    const formatted = await formatCSS(editor.getValue(), getFormatWidth());
    const pos = editor.getPosition();
    isSettingValue = true;
    editor.setValue(formatted);
    if (pos) editor.setPosition(pos);
    isSettingValue = false;
    toast.success("CSS formatted");
};

const setValue = (value: string) => {
    if (editor) {
        isSettingValue = true;
        editor.setValue(value);
        isSettingValue = false;
    }
};

const getValue = () => editor?.getValue() ?? "";

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
    editor?.dispose();
});

defineExpose({
    formatCSS: formatCSSContent,
    setValue,
    getValue,
    editor: () => editor,
});
</script>
