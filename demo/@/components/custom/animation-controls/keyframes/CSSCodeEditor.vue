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
import * as monaco from "monaco-editor";
// Theme JSONs are vendored locally: monaco-themes@0.4.x only exports `.` and
// `./dist/monaco-themes.js` in its `exports` field, so `monaco-themes/themes/*`
// is not resolvable under the strict bundler (Vite 8 / Rolldown). These two
// small theme definitions live alongside this editor instead.
import DarkTheme from "./monaco-themes/Dracula.json";
import LightTheme from "./monaco-themes/GitHub.json";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { clampIOSNoZoomFontSize } from "@utils/iosTextEntry";
import { convert2, debounce, formatCSS } from "@mkbabb/value.js";
import { toast } from "vue-sonner";

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import CSSWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";

self.MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
        if (label === "css" || label === "scss" || label === "less") {
            return new CSSWorker();
        }
        return new EditorWorker();
    },
};

monaco.editor.defineTheme("dark-theme", DarkTheme as any);
monaco.editor.defineTheme("light-theme", LightTheme as any);
monaco.languages.register({ id: "css" });

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

let editor: monaco.editor.IStandaloneCodeEditor | undefined;
let isSettingValue = false;

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

const initEditor = () => {
    const el = containerEl.value!;

    editor = monaco.editor.create(el, {
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
    monaco.editor.setTheme(isDark.value ? "dark-theme" : "light-theme");
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
    editor?.dispose();
});

defineExpose({
    formatCSS: formatCSSContent,
    setValue,
    getValue,
    editor: () => editor,
});
</script>
