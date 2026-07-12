<template>
    <!-- @mbabb dropdown — S8 (BLK-8) / D9 re-cure: DockDropdownTrigger is itself a
         reka trigger (mirroring DockSelectTrigger), so it mounts DIRECTLY inside
         <DropdownMenu>. The former outer <DropdownMenuTrigger as-child> double-
         wrapped it (two triggers, the inner click swallowed); that wrap is GONE.
         reka still OWNS the open/close latch (uncontrolled) — a clean single toggle.

         The D9 race re-surfaced under the J.W7c U1 golden-proportion dock: reka's
         DockSelectTrigger opens on POINTERDOWN (wins instantly), but
         DockDropdownTrigger opens on CLICK — it needs pointerdown AND pointerup on
         the SAME node. The dock-control press-scale
         (`:active { scale: var(--scale-press-dock) /* .96 */ }`, glass-ui's
         affordance shared with the Select) shrinks the pill mid-press, so pointerup
         lands off the trigger and no `click` is ever synthesised → the menu never
         opens (the deterministic born-RED in a fresh context).

         FIX (product seam, no reka/glass-ui patch): on the trigger's POINTERDOWN we
         SYNTHESISE the click reka needs (a reflow-immune actuation mirroring the
         Select's pointerdown-wins behaviour) and kill the trailing native click,
         leaving reka in sole control of the toggle; and we surface the menu's open
         state (`v-model:open`) so the parent DOCK holds itself open — keeping the
         trigger's expanded layer mounted while the menu is open (the slot's own
         useOptionalDockContext can't reach the GlassDock provider). See the handlers
         below for the full rationale. -->
    <DropdownMenu @update:open="onMbabbMenuOpen">
        <DockDropdownTrigger aria-label="@mbabb menu" class="text-mono-caption normal-case lg:text-mono-small" data-register="code" @pointerenter="onMbabbTriggerEnter" @pointerleave="onMbabbTriggerLeave" @pointerdown="onMbabbTriggerPointerdown" @click.capture="onMbabbTriggerClickCapture">@mbabb</DockDropdownTrigger>
        <DropdownMenuContent align="end" :side-offset="8" class="z-modal min-w-[var(--dock-panel-width)] text-body p-1.5">
            <!-- Share -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                <SharePopover :on-scene-restore="onSceneRestore" />
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Share</span>
                    <p class="text-admin-label text-muted-foreground leading-tight">Copy link or load shared state</p>
                </div>
            </DropdownMenuItem>

            <!-- Dark mode — the whole row is the toggle target (F5,
                 mirroring the ppmycota row below): a row-level @click
                 flips the theme, and <DarkModeToggle passive> makes the
                 inner icon a pure INDICATOR (`@click="!passive &&
                 toggleDark()"` short-circuits) so the row fires exactly
                 once — no double-toggle. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="toggleDark()">
                <DarkModeToggle
                    passive
                    title="Toggle dark mode"
                    class="aspect-square w-5"
                />
                <span class="text-small text-foreground">Dark mode</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- ppmycota logo — toggles pp mode -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="togglePpMode">
                <div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>
                <div class="flex-1 min-w-0">
                    <!-- Brand colour consumes the --ppmycota-primary token
                         directly (inline, not a text-[var(...)] arbitrary
                         utility): the dropdown content is portalled, so an
                         inline style is the portal-safe home for the token
                         ref while it co-locates with the brand mark (S2). -->
                    <span class="text-small" :style="{ color: 'var(--ppmycota-primary)' }">ppmycota</span>
                    <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors" @click.stop>ppmycota.com</a>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- T.C2 — Clear all & reload (relocated from the transport dock: a
                 destructive storage reset is a settings action). Confirm-guarded. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer text-destructive" @click="clearAllAndReload">
                <Trash class="w-5 h-5 shrink-0" />
                <div class="flex-1 min-w-0">
                    <span class="text-small">Clear all &amp; reload</span>
                    <p class="text-admin-label text-muted-foreground leading-tight">Reset every saved animation to defaults</p>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- @mbabb -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1">
                <Avatar class="w-7 h-7">
                    <AvatarImage
                        src="https://avatars.githubusercontent.com/u/2848617?v=4"
                    ></AvatarImage>
                </Avatar>
                <div class="flex-1 min-w-0">
                    <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="text-mono-caption normal-case font-semibold text-foreground hover:underline" data-register="code">@mbabb</a>
                    <p class="text-admin-label text-muted-foreground leading-tight">CSS keyframe animation engine</p>
                    <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors">View the project on Github &#x1F389;</a>
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// MbabbMenu — the @mbabb dock dropdown (S.D1 · a23 F2 extraction from App.vue).
//
// This is DOCK CHROME: a glass-ui brand dropdown whose D9 pointerdown-synthesis
// workaround is a glass-ui dock-affordance seam, so it lives beside ChromeDock in
// @components/dock/ (NOT the app shell). App.vue mounts it in ChromeDock's
// #items slot and binds `v-model:open` back to ChromeDock's `:items-popup-open`,
// so the dock holds itself open while the menu is open (part 2 of the D9 fix).
// ─────────────────────────────────────────────────────────────────────────────
import { ref, watchEffect } from "vue";
import { SharePopover } from "@components/instrument/shell";
import { Avatar, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { DockDropdownTrigger } from "@mkbabb/glass-ui/dock";
import { Trash } from "@lucide/vue";
import { getStoredAnimationGroupControlOptions, resetAllStores } from "@state";
// GLASSUI-GAP: dockDropdownPointerdown — the trigger's pointerdown click-synthesis
// (onMbabbTriggerPointerdown / onMbabbTriggerClickCapture) is a band-aid for
// DockDropdownTrigger opening on click while the press-scale reflow drops it (BG-4).
// It is deleted on the re-pin when DockDropdownTrigger gains pointerdown-open parity;
// proof:glass-ui-gap-tripwire flips RED the instant glassCaps.dockDropdownPointerdown
// is satisfied while the synthesis survives. See demo/glass-ui-gaps.ts.

const props = defineProps<{
    // The active superKey — the ppMode store is keyed by it (per-scene brand flag).
    superKey: string;
    // Scene restore from a shared URL (passed straight to SharePopover). The shell
    // owns the real switch (runSceneSwitch); the menu only forwards the id.
    onSceneRestore: (id: string) => void;
}>();

// The dock-hold model: reflects `mbabbMenuOpen || mbabbPressing` so ChromeDock's
// `:items-popup-open` keeps the trigger's expanded layer mounted while the menu
// (or its hover→press window) is live.
const open = defineModel<boolean>("open", { default: false });

function togglePpMode() {
    const stored = getStoredAnimationGroupControlOptions(props.superKey);
    stored.value.ppMode = !(stored.value.ppMode ?? false);
}

// T.C2 — "Clear all & reload" RELOCATED from the transport dock into the @mbabb
// settings menu (a destructive storage reset is a settings action, not transport
// chrome; VERDICT #6 — the transport carried the destructive Clear beside Play).
// Confirm-guarded: resetAllStores() wipes every persisted store (control options,
// the scene-machine persist key) and the reload re-seeds from the cleared state.
function clearAllAndReload() {
    if (
        typeof window !== "undefined" &&
        !window.confirm(
            "Clear all saved animation state and reload? This cannot be undone.",
        )
    ) {
        return;
    }
    resetAllStores();
    window.location.reload();
}

// F5 — the dark-mode dropdown row's click target. The same singleton glass-ui
// `useGlobalDark` the CSS editor consumes (CSSCodeEditor.vue); the row fires
// `toggleDark()` while `<DarkModeToggle passive>` becomes a pure indicator, so
// the theme flips exactly once per row click (no double-toggle).
const { toggleDark } = useGlobalDark();

// ── S8/BLK-8 (D9): the @mbabb menu opens on POINTERDOWN, dock pinned while open ──
//
// THE RACE (BLK-8 root, re-surfaced by the J.W7c U1 golden-proportion dock): reka's
// `DockSelectTrigger` opens on `pointerdown` (it wins instantly), but the
// `DockDropdownTrigger` opens on `click` — it needs pointerdown AND pointerup to
// land on the SAME element. The collapsed dock only stays expanded on hover, and
// the press reflows/collapses the pill between down and up, moving the trigger out
// from under the pointer; no `click` is synthesised → the menu never opens
// (aria-expanded:false, finalOpen:false — the exact born-RED, deterministic in a
// fresh context).
//
// FIX (product seam, no reka/glass-ui patch), two coupled parts:
//
//  (1) THE PRESS-SCALE REFLOW. The dock-control press affordance
//      (`:active { scale: var(--scale-press-dock) /* .96 */ }`, glass-ui, shared
//      with the Select) shrinks the pill mid-press, so the native pointerup/click
//      lands off the trigger and reka — which opens on CLICK — never sees one. On
//      the trigger's POINTERDOWN we SYNTHESISE the click reka listens for (a
//      reflow-immune actuation that mirrors the Select's pointerdown-wins
//      behaviour), and KILL the trailing native click in the capture phase so the
//      latch toggles exactly once. reka stays UNCONTROLLED and owns open/close — a
//      naturally clean toggle (closed→open→closed→open).
//
//  (2) THE LAYER COLLAPSE. The trigger lives in the dock's EXPANDED layer; once the
//      dock collapses, that layer goes `visibility:hidden` and the trigger vanishes
//      (so a second click can't reach it to close). The slot content is set up in
//      App.vue, so its `useOptionalDockContext()` resolves ABOVE the GlassDock
//      provider and CANNOT hold the dock — a keep-open inside this component would
//      be a silent no-op. We instead surface the menu's open state via
//      `v-model:open`, which App.vue feeds to ChromeDock's `:items-popup-open` — the
//      dock then holds via its OWN dockRef (the same hold the scene/controls
//      Selects ride).
const mbabbMenuOpen = ref(false);
// Pins the dock the instant the pointer is over the @mbabb trigger — BEFORE the
// reka open-state round-trips back through @update:open — so a collapse already
// scheduled (the pointer was parked off the dock) is suppressed before it can hide
// the trigger's layer mid-press. Cleared on leave once the menu isn't open.
const mbabbPressing = ref(false);
// True only while OUR synthetic click is in flight — the capture-phase guard lets
// that one reach reka and kills every native (reflow-prone) click.
let mbabbSynthClick = false;

// Project the combined open state onto the dock-hold model.
watchEffect(() => {
    open.value = mbabbMenuOpen.value || mbabbPressing.value;
});

function onMbabbTriggerEnter() {
    mbabbPressing.value = true; // pin the dock open across the hover→press window
}
function onMbabbTriggerLeave() {
    if (!mbabbMenuOpen.value) mbabbPressing.value = false;
}
function onMbabbTriggerPointerdown(event: PointerEvent) {
    // Primary-button, non-ctrl only (match reka's Select pointerdown gate). Mouse,
    // pen AND touch all actuate here: the press-scale reflow can swallow the native
    // click on any input, so we synthesise on pointerdown across the board and kill
    // the trailing native click (the capture guard) for a single clean toggle (D9).
    if (event.button !== 0 || event.ctrlKey) return;
    event.preventDefault();
    mbabbPressing.value = true;
    const el = event.currentTarget as HTMLElement | null;
    mbabbSynthClick = true;
    el?.click(); // reka's trigger onClick toggles on THIS synthetic, reflow-immune click
    mbabbSynthClick = false;
}
function onMbabbTriggerClickCapture(event: MouseEvent) {
    // Our synthetic click passes through to reka; a trailing NATIVE click (if the
    // reflow even let one land) is killed in capture so it cannot double-toggle.
    if (mbabbSynthClick) return;
    event.preventDefault();
    event.stopPropagation();
}
function onMbabbMenuOpen(isOpen: boolean) {
    // reka owns the latch; mirror its open state so ChromeDock's dock hold keeps the
    // trigger's layer mounted (visible) while the menu is open.
    mbabbMenuOpen.value = isOpen;
    if (!isOpen) mbabbPressing.value = false; // closed → drop the press pin
}
</script>
