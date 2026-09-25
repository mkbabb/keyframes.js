<template>
    <!-- DockTrigger owns pointerdown actuation. `v-model:open` is THIS menu's own
         open state — the one the self-hold watches (script below). It is a local
         model, not dock plumbing: nothing outside this file reads or writes it. -->
    <DropdownMenu v-model:open="open">
        <!-- MM-29 (site 1 of 2) — `normal-case` cancels `text-transform` and
             NOTHING else: `text-mono-caption` also binds
             `letter-spacing: var(--type-tracking-caps)` (0.1em), which rides on
             regardless, so a lowercase handle shipped with CAPS tracking. The
             pair is mandatory (G-W6-8 binds this wave and KF.W7 identically).
             The responsive rung pair stays exactly as authored — `lg:` swaps to
             `text-mono-small`, which carries no transform and no caps tracking
             at all — because collapsing it would decide a dock-band magnitude,
             and magnitudes are KF.W9's. -->
        <DockTrigger ref="mbabbTrigger" for="dropdown" aria-label="@mbabb menu" class="text-mono-caption normal-case tracking-normal lg:text-mono-small" data-register="code">@mbabb</DockTrigger>
        <!-- MM-15 — `z-popover`, not `z-modal`. The dock menu is a popover and
             the demo's own written z-contract reserves `--z-modal` (140) for
             modal dialogs. The wrong rung was INERT and therefore invisible:
             the producer's unlayered `z-index: var(--z-popover)` outranked the
             layered utility, so both portalled siblings (this menu and the
             Share popover) sat at 130 and DOM order decided. The moment glass
             layers its sheet (MM-4, relayed as O-26 R-1) the utility ARMS — and
             `z-modal` would then occlude the Share popover. Corrected BEFORE the
             producer fix lands, which is exactly why it rides this motion. -->
        <DropdownMenuContent align="end" :side-offset="8" class="z-popover min-w-[var(--dock-panel-width)] text-body p-1.5" @close-auto-focus="onMenuCloseAutoFocus">
            <!-- Share.
                 MM-8 + MM-9, the one voice pass, applied at all FOUR of its
                 sites (here, the Clear-all sub-line, and the two @mbabb lines).
                 `text-admin-label` is a 10px ALL-CAPS MONO chip register —
                 `font-family: var(--font-mono)`, `text-transform: uppercase`,
                 `letter-spacing: var(--type-tracking-caps)`, `line-height: 1` —
                 and it was carrying four sentence-case English sentences. That
                 is MM-8 (wrong register for prose) and MM-9 (the T.D4 mono
                 contract: none of these leaves is a `monoAllowedSelectors`
                 entry) in one place. `text-micro` is the rung the bank names as
                 sitting unused one step up: 11px, the inherited TEXT face, no
                 transform, no caps tracking. The mono register survives at the
                 one leaf that earns it — the bare URL below. -->
            <!-- MM-22 — every row's class string is ONLY what the primitive does
                 not already stamp: `.dropdown-menu__item` is `display:flex;
                 align-items:center` (unlayered) and `.interactive-item` carries
                 the radius, so the hand-repeated `flex items-center rounded-lg`
                 is gone from all five rows (the one that silently lacked
                 `rounded-lg` now differs from nothing).
                 MM-11 — ONE leading-glyph slot: every row's glyph sits in a
                 28px (`w-7`) centred column, so the label column's left edge
                 stops oscillating 24/20/28/20/28px across the rows.
                 MM-40 — each row names its typeahead key (`text-value`), so the
                 menu's type-to-select no longer keys on condensed slot text. -->
            <!-- X.KF.W13U.d4 · ESC-d-3 (COHESION §0br) — the row's select OPENS
                 Share. The popover's trigger is a button nested in the row, which
                 the menu's roving focus never reaches, so Enter on the row did
                 nothing. Now the select sets the popover's exposed open model:
                 the menu stays open (`.prevent`) as it does under a pointer press,
                 the popover anchors to its trigger in this row and focuses its
                 field, and Escape unwinds popover → menu → the @mbabb trigger.
                 The trigger's own click stays with the trigger (`@click.stop` on
                 its slot): it already toggles the popover, and letting it bubble
                 into the row's select would re-open what a second press closed. -->
            <DropdownMenuItem @select.prevent="openShare" text-value="Share" class="gap-2.5 px-1.5 py-1">
                <span class="w-7 shrink-0 flex justify-center" @click.stop><SharePopover ref="sharePopover" :on-scene-restore="onSceneRestore" /></span>
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Share</span>
                </div>
            </DropdownMenuItem>

            <!-- X.KF.W13X.dock · A2-KE-L2-13 + UIA-KF-137 — the theme is a
                 persisted boolean, so it is a CHECKBOX row, the ppmycota row's
                 idiom below: `menuitemcheckbox` + `aria-checked` + the indicator
                 seat, bound to the one shared dark-mode controller
                 (`useGlobalDark`, the instance every glass surface reads). The
                 row was a layout-only item wrapping a 28 px DarkModeToggle: a
                 tap or Enter on the 258 x 53 px row did nothing, and two
                 booleans in one menu spoke two idioms. `@select.prevent` keeps
                 the menu open, so the mark is the feedback. The producer's
                 menu-item form of the toggle itself (DARK-MENU-ITEM, O-61 R-3)
                 stays relay-only. -->
            <DropdownMenuCheckboxItem :model-value="isDark" @update:model-value="setDark" @select.prevent text-value="Dark mode" class="gap-2.5 px-1.5 py-1">
                <span class="w-7 shrink-0 flex justify-center"><Moon class="w-5 h-5" aria-hidden="true" /></span>
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Dark mode</span>
                </div>
            </DropdownMenuCheckboxItem>

            <!-- X.KF.W13U.d · OA-33 (COHESION §0bi) — Keyboard shortcuts joins its
                 two siblings here: the dock's trailing zone is this menu's trigger
                 alone. Selecting the row opens the shortcuts dialog (the menu
                 closes as it opens, and declines to return focus under it — the
                 same menu→dialog hand-off as Clear all); the producer's own
                 `DropdownMenuShortcut` seat prints the `?` hint. -->
            <DropdownMenuItem text-value="Keyboard shortcuts" class="gap-2.5 px-1.5 py-1" @select="shortcutsOpen = true">
                <span class="w-7 shrink-0 flex justify-center"><Keyboard class="w-5 h-5" aria-hidden="true" /></span>
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Keyboard shortcuts</span>
                </div>
                <DropdownMenuShortcut aria-hidden="true">?</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- ppmycota logo — toggles pp mode.
                 [X.KF.W13R.m — MM-4 DISCHARGED at glass 10.0.0: every library
                 style rule now sits in `@layer components` (MIGRATION §10.0.0),
                 `.menu__item`/`.glass-menu-row` included, so the utility class
                 paints and the inline `:style` came out — the migration the
                 note below names as the whole of it. The history is kept.]
                 MM-4 INTERIM, AND IT IS LABELLED AS ONE. glass-ui emits
                 `.dropdown-menu__item` OUTSIDE its single `@layer components`
                 block (byte 29523 against the block's 2531–18827), and an
                 unlayered rule beats a layered one whatever the source order —
                 so `cursor-pointer` on a row that has an `@click` never paints
                 and the row reads as inert. The DURABLE fix is the producer's
                 (wrap `dropdown-menu/styles.css` + the `_shared/menu.css` tail
                 in `layer(components)`; sent as O-26 R-1 BEFORE this interim was
                 written, per §Sequencing 7). Until it lands, the paint is
                 declared inline — the file's OWN idiom for portalled content,
                 documented five lines below for the brand colour — because an
                 inline declaration outranks any stylesheet rule on either side
                 of the layer question and needs no `:deep` (banned) and no
                 global block. When the producer sheet is layered the class
                 takes over and the `:style` comes out; the class is kept
                 alongside precisely so that removal is the whole migration.
                 MM-44: this file is the demo's ONLY DropdownMenu consumer, so
                 the interim's blast radius is this component. -->
            <!-- MM-18 — `scale-on-hover` is gone from the 28px logo: the press
                 covers the whole ~272×44 row, so a scale on the child pointed
                 the affordance at the wrong object. The row's own hover chrome
                 is the affordance, as on every other row. -->
            <!-- MM-5 — a persisted boolean is a CHECKBOX row: `menuitemcheckbox` +
                 `aria-checked` + the indicator seat, from the design system's own
                 `DropdownMenuCheckboxItem` (the exported seam; no copied selector).
                 `@select.prevent` keeps the menu open, so the mark IS the feedback.
                 MM-1/MM-6 (≡ KF-APP-1 · kf-CubeScene C-14) — the ONE writer binds the
                 plain store bucket directly (no `.value` off a non-ref: the old
                 `togglePpMode` threw on every click), and it binds the `cube` bucket —
                 the only reader (`CubeScene` → `CubeTarget :pp-mode`) keys by
                 `CUBE_SCENE_ID` on every scene, home included, so writing the ACTIVE
                 scene's bucket was inert on 6 of 7 scenes. CubeScene's `setPPMode`
                 twin died with the unmounted header render fn (KF-APP-17, delete arm). -->
            <DropdownMenuCheckboxItem :model-value="cubeControls.ppMode ?? false" @update:model-value="(checked: boolean) => (cubeControls.ppMode = checked)" @select.prevent text-value="ppmycota" class="gap-2.5 px-1.5 py-1 cursor-pointer">
                <div class="ppmycota-logo-sm w-7 h-7 shrink-0"></div>
                <div class="flex-1 min-w-0">
                    <!-- MM-21 — the brand colour is a UTILITY, and the old
                         five-line case for an inline style was mechanically
                         false: `--ppmycota-primary` is a `:root` global, so it
                         inherits into the portal like every other token this
                         content reads through a utility. `text-[var(…)]` emits
                         `color:` on the span itself (no MM-4 layer contest —
                         the unlayered rule is on the ITEM, and a declared
                         colour on the child beats inheritance), and unlike the
                         highest-priority inline style it can be re-tinted.

                         MM-12, RECORDED HERE AND CURED NOWHERE IN THIS WAVE
                         (bounds, not oversight). This label follows the theme —
                         `--ppmycota-primary` is `--accent-kf`, a `light-dark()`
                         pair — while the MARK beside it is repainted by
                         `--filter-brand-color`, a single static filter chain
                         (`brand.css:30` reads it; `style.css:178` declares it)
                         with NO `.dark` arm: `.dark` re-declares only
                         `--accent-red`, `--accent-red-foreground` and
                         `--primary`. So mark and label diverge in dark mode BY
                         CONSTRUCTION. The two lawful cures both live outside
                         every writable set in this wave's plan — a `.dark`
                         `--filter-brand-color` arm in `style.css`, or a
                         mask/inline-SVG mark on `currentColor` in `brand.css` —
                         and inventing a filter chain at this call site would be
                         a third, worse dialect. Declared, never silently
                         dropped; perceptual magnitude is SS-13's. -->
                    <span class="text-small text-[var(--ppmycota-primary)]">ppmycota</span>
                </div>
                <!-- UIA-KF-138 · UIA-KF-246 — the site is a trailing glyph, not a
                     second line (the one subtitle left in this menu is Clear all's). -->
                <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" aria-label="ppmycota.com" title="ppmycota.com" class="text-muted-foreground hover:text-foreground" @click.stop><ExternalLink class="w-4 h-4" aria-hidden="true" /></a>
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <!-- T.C2 — Clear all & reload (relocated from the transport dock: a
                 destructive storage reset is a settings action). Confirm-guarded —
                 MM-13: by the design system's own `Dialog` (below the menu), not
                 an unthemeable `window.confirm()` that Playwright auto-dismisses;
                 selecting the row closes the menu and opens the dialog.

                 X.KF.W13X.dock · UIA-KF-060 — ONE red, the canon's. MM-30 had
                 moved this row onto the demo's `--accent-red`, while the confirm
                 it opens paints the glass `tone="destructive"` Button: two reds
                 for one command, and the demo red failed text contrast on the
                 menu plate (served 2.3:1 light, 4.0:1 dark). The row now reads
                 `--destructive` (`text-destructive`), the token the confirm
                 button is built from. -->
            <DropdownMenuItem text-value="Clear all" class="gap-2.5 px-1.5 py-1 cursor-pointer text-destructive" @select="confirmClearOpen = true">
                <span class="w-7 shrink-0 flex justify-center"><Trash class="w-5 h-5" aria-hidden="true" /></span>
                <div class="flex-1 min-w-0">
                    <span class="text-small">Clear all &amp; reload</span>
                    <p class="text-micro text-muted-foreground leading-tight">Reset every saved animation to defaults</p>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- X.KF.W13X.dock · UIA-KF-138 — the identity is ONE row: avatar +
                 "@mbabb · GitHub", a single item whose select opens the source.
                 It was a three-line label (handle, tagline, "View the source on
                 GitHub") repeating the trigger's handle, with two anchors nested
                 in it. MM-39 — `w-7 h-7` is a necessary escape hatch (every
                 design-system avatar size is ≥40px, and no `sm` rung ships);
                 MM-16 — a fallback plate, and no referrer leak to GitHub. -->
            <DropdownMenuItem text-value="GitHub" class="gap-2.5 px-1.5 py-1" @select="openSource">
                <span class="w-7 shrink-0 flex justify-center">
                    <Avatar decorative class="w-7 h-7">
                        <AvatarImage
                            src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            referrer-policy="no-referrer"
                        ></AvatarImage>
                        <AvatarFallback>MB</AvatarFallback>
                    </Avatar>
                </span>
                <span class="flex-1 min-w-0 text-small text-foreground"><span class="font-mono" data-register="code">@mbabb</span> · GitHub</span>
                <ExternalLink class="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <!-- X.KF.W13U.d · OA-33 — the shortcuts dialog lives with the row that
         opens it and with its `?` shortcut (moved from ChromeDock). -->
    <KeyboardShortcutsModal v-model:open="shortcutsOpen" />

    <!-- MM-13 — the destructive command's confirmation, in the design system's
         own Dialog (the CSSPasteDialog anatomy: title, description, footer).
         Themeable, focus-trapped, and reachable by the harness, which a native
         `window.confirm()` is not. -->
    <!-- X.KF.W13X.dock · UIA-KF-118 — the confirm hands focus BACK to the @mbabb
         trigger when it closes. Its focus scope would return focus to what was
         focused when it opened — the menu row, unmounted with the dropdown — so
         focus fell to <body>; the trigger is the command's stable home. -->
    <Dialog v-model:open="confirmClearOpen">
        <!-- X.KF.W13X.dock · UIA-KF-149 — a destructive confirm takes the canon's
             `deliberate` grammar (Esc · outside; no ✕ beside Cancel). UIA-KF-148 —
             the title/description pair sits in the canon's DialogHeader and the
             canon owns its type: the `text-subheading`/`text-body` overrides
             flattened title-over-description (20.35 px over 18.6 px). -->
        <DialogContent dismiss="deliberate" @close-auto-focus="onConfirmCloseAutoFocus">
            <DialogHeader>
                <DialogTitle>Clear all saved animations?</DialogTitle>
                <DialogDescription>
                    Every saved animation resets to its defaults and the page reloads. This cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose as-child>
                    <Button emphasis="secondary">Cancel</Button>
                </DialogClose>
                <Button emphasis="primary" tone="destructive" @click="clearAllAndReload">Clear &amp; reload</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// MbabbMenu — the @mbabb dock dropdown (S.D1 · a23 F2 extraction from App.vue).
//
// This is DOCK CHROME: App.vue mounts it in ChromeDock's #items slot, and the
// dock stays expanded while the menu is open because THIS FILE takes the hold —
// `useOptionalDockContext()` resolves the `<GlassDock>` that RENDERS this slot
// content (Vue injects along the runtime parent chain), so no open state has to
// travel up to the App and back down as a prop (M-4; the mechanism is executed,
// not asserted, in `test/demo/app/dock-context-slot-resolution.test.ts`).
// ─────────────────────────────────────────────────────────────────────────────
import { onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { SharePopover } from "@components/instrument/shell";
// MM-24 — one subpath discipline: the menu family from `./menu`, the
// dialog from `./dialog`, the button from `./button`. `Avatar*` alone stays on
// the root barrel because `./avatar` is ABSENT from the producer's exports map —
// that gap is a producer row (BH relay), not a local choice.
import { Avatar, AvatarFallback, AvatarImage } from "@mkbabb/glass-ui";
import { Button } from "@mkbabb/glass-ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@mkbabb/glass-ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "@mkbabb/glass-ui/menu";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { DockTrigger, useOptionalDockContext } from "@mkbabb/glass-ui/dock";
import { ExternalLink, Keyboard, Moon, Trash } from "@lucide/vue";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import KeyboardShortcutsModal from "@components/instrument/shell/KeyboardShortcutsModal.vue";
import { getStoredAnimationGroupControlOptions, resetAllStores } from "@state";
import { CUBE_SCENE_ID } from "../../scenes/cube/cubeKeys";
defineProps<{
    // Scene restore from a shared URL (passed straight to SharePopover). The shell
    // owns the real switch (runSceneSwitch); the menu only forwards the id.
    onSceneRestore: (id: string) => void;
}>();

// This menu's own open state. It stays a `defineModel` — glass-ui 7.0.0's
// `DropdownMenu` declares `open`/`defaultOpen` as `{ type: Boolean, default:
// void 0 }` (measured at the installed dist), so an absent binding is genuinely
// uncontrolled now; the local model is what the self-hold below watches and what
// lets a host observe the menu if it ever needs to. Nothing else binds it.
const open = defineModel<boolean>("open", { default: false });

// ── The self-hold (M-4) ──────────────────────────────────────────────────────
// The dock context is injected from the `<GlassDock>` that RENDERS this
// component (ChromeDock's), not the one lexically enclosing App.vue's template —
// Vue resolves `inject` along the runtime parent chain. `null` when the menu is
// mounted outside a dock, which is the "optional" in the producer's name.
const dock = useOptionalDockContext();

// The two dialogs this menu opens (declared here because the hold below reads them;
// their commands are further down).
const confirmClearOpen = ref(false);
const shortcutsOpen = ref(false);

// One release per keepOpen, and never a release we did not take: the producer
// clamps its counter at zero (`Math.max(0, …)`), and this pairing means we never
// lean on that clamp. i-2's unpaired release — reachable only because the old
// prop could arrive true at mount — dies here with the round-trip that fed it.
//
// X.KF.W13X.dock · KFA-113 — the hold is keyed on EVERY surface this menu opens,
// not on the dropdown alone: selecting "Clear all" or "Keyboard shortcuts" closes
// the dropdown as its dialog opens, and a hold keyed on `open` alone let the dock
// collapse behind the open dialog and play its morph through the backdrop.
let held = false;
watch(
    () => open.value || confirmClearOpen.value || shortcutsOpen.value,
    (holds) => {
        if (holds === held) return;
        held = holds;
        if (holds) dock?.keepOpen();
        else dock?.release();
    },
    { immediate: true },
);

// A menu unmounted while open (a scene swap under an open dropdown) must not
// leave its token behind: a leaked hold pins the dock expanded forever.
onBeforeUnmount(() => {
    if (!held) return;
    held = false;
    dock?.release();
});

// MM-1/MM-6 — the ppmycota flag's ONE writer (the CheckboxItem's v-model above).
// The store returns the bucket itself (a reactive member of the persisted
// `useStorage` record), not a ref; and the bucket is the CUBE scene's, because
// the flag's only reader is CubeScene, which keys by `CUBE_SCENE_ID` wherever it
// mounts (home's backdrop included) — C-14's split resolved at the writer.
const cubeControls = getStoredAnimationGroupControlOptions(CUBE_SCENE_ID);

// A2-KE-L2-13 · UIA-KF-137 — the theme row's one writer. `toggleDark` (not a bare
// write to `isDark`) so the flip keeps the controller's transition suppression.
const { isDark, toggleDark } = useGlobalDark();
function setDark(checked: boolean): void {
    if (checked !== isDark.value) toggleDark();
}

// T.C2 — "Clear all & reload" RELOCATED from the transport dock into the @mbabb
// settings menu (a destructive storage reset is a settings action, not transport
// chrome; VERDICT #6 — the transport carried the destructive Clear beside Play).
//
// MM-13 — the guard is the design system's Dialog: the row opens it, and only
// its confirm runs the reset. MM-20 collapses with it: the inverted SSR guard
// (no `window` ⇒ skip the confirm and run the destructive path) is gone because
// there is no `window.confirm` left to guard.

// X.KF.W13U.d4 · ESC-d-3 — the Share row's select opens the popover through
// the model SharePopover exposes (its owner, `useShareState`, keeps closing it
// after a copy or a load). A press on the nested trigger never reaches here —
// the trigger toggles itself and its click does not bubble into the row.
const sharePopover = useTemplateRef<InstanceType<typeof SharePopover>>("sharePopover");
function openShare(): void {
    if (sharePopover.value) sharePopover.value.open = true;
}

// X.KF.W13U.d · OA-33 — the shortcuts dialog's open state and its `?` shortcut,
// with the one command that opens them (moved from ChromeDock's retired zone).
registerShortcut("?", () => { shortcutsOpen.value = !shortcutsOpen.value; }, { label: "Show shortcuts", group: "General" });

// The menu closes as the dialog opens. Its close would hand focus back to the
// @mbabb trigger underneath the dialog's focus scope, so that one return is
// declined while the dialog is taking over (reka's documented menu→dialog idiom).
function onMenuCloseAutoFocus(event: Event): void {
    if (confirmClearOpen.value || shortcutsOpen.value) event.preventDefault();
}

// UIA-KF-118 — the confirm's return target (see the template): the trigger that
// opened the menu the confirm came from.
const mbabbTrigger = useTemplateRef<{ $el: HTMLElement }>("mbabbTrigger");
function onConfirmCloseAutoFocus(event: Event): void {
    event.preventDefault();
    mbabbTrigger.value?.$el.focus();
}

// MM-42 (caveat, recorded where the reset is spent): `resetAllStores()` is
// asymmetric — two stores are ref-reset AND key-removed, the scene machine's
// persisted key is only removed while its live `useStorage` ref is not reset,
// and components that captured a bucket hold detached proxies afterwards. It is
// correct ONLY because the reload below follows it immediately; a caller that
// resets without reloading inherits that asymmetry.
// UIA-KF-138 — the identity row's command: the source, in a new tab, no opener.
function openSource(): void {
    window.open("https://github.com/mkbabb/keyframes.js", "_blank", "noopener,noreferrer");
}

function clearAllAndReload(): void {
    resetAllStores();
    window.location.reload();
}

</script>
