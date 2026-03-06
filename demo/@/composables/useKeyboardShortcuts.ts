import { createGlobalState, useEventListener } from "@vueuse/core";
import { onScopeDispose } from "vue";

export interface ShortcutOptions {
    /** Fire even when focus is in input/textarea/contenteditable. Default: false */
    allowInInput?: boolean;
    /** Call preventDefault on the event. Default: false */
    preventDefault?: boolean;
}

interface RegisteredShortcut {
    combo: ParsedCombo;
    handler: (e: KeyboardEvent) => void;
    options: ShortcutOptions;
}

interface ParsedCombo {
    key: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    alt: boolean;
    mod: boolean; // Mod = Meta on mac, Ctrl elsewhere
}

const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function parseCombo(combo: string): ParsedCombo {
    const parts = combo.split("+").map((p) => p.trim());
    const parsed: ParsedCombo = {
        key: "",
        ctrl: false,
        meta: false,
        shift: false,
        alt: false,
        mod: false,
    };

    for (const part of parts) {
        const lower = part.toLowerCase();
        if (lower === "mod") parsed.mod = true;
        else if (lower === "ctrl" || lower === "control") parsed.ctrl = true;
        else if (lower === "meta" || lower === "cmd" || lower === "command")
            parsed.meta = true;
        else if (lower === "shift") parsed.shift = true;
        else if (lower === "alt" || lower === "option") parsed.alt = true;
        else parsed.key = part; // Preserve original case for e.key matching
    }

    return parsed;
}

function matchesCombo(e: KeyboardEvent, combo: ParsedCombo): boolean {
    // Check modifiers
    const wantCtrl = combo.ctrl || (combo.mod && !isMac);
    const wantMeta = combo.meta || (combo.mod && isMac);

    if (e.ctrlKey !== wantCtrl) return false;
    if (e.metaKey !== wantMeta) return false;
    if (e.shiftKey !== combo.shift) return false;
    if (e.altKey !== combo.alt) return false;

    // Match key (case-insensitive for letters, exact for special keys)
    if (e.key === combo.key) return true;
    if (e.key.toLowerCase() === combo.key.toLowerCase()) return true;

    return false;
}

function isEditableTarget(el: Element | null): boolean {
    if (!el) return false;
    const tag = (el as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if ((el as HTMLElement).isContentEditable) return true;
    if (el.closest(".monaco-editor")) return true;
    return false;
}

const useShortcutRegistry = createGlobalState(() => {
    const shortcuts = new Set<RegisteredShortcut>();

    useEventListener(window, "keydown", (e: KeyboardEvent) => {
        for (const shortcut of shortcuts) {
            if (!matchesCombo(e, shortcut.combo)) continue;

            if (
                !shortcut.options.allowInInput &&
                isEditableTarget(e.target as Element)
            ) {
                continue;
            }

            if (shortcut.options.preventDefault) {
                e.preventDefault();
            }

            shortcut.handler(e);
            return; // First match wins
        }
    });

    return { shortcuts };
});

/**
 * Register a keyboard shortcut. Returns cleanup function.
 * Auto-disposed when the current effect scope is disposed.
 */
export function registerShortcut(
    combo: string,
    handler: (e: KeyboardEvent) => void,
    options: ShortcutOptions = {},
): () => void {
    const { shortcuts } = useShortcutRegistry();

    const entry: RegisteredShortcut = {
        combo: parseCombo(combo),
        handler,
        options,
    };

    shortcuts.add(entry);

    const cleanup = () => {
        shortcuts.delete(entry);
    };

    onScopeDispose(cleanup);

    return cleanup;
}
