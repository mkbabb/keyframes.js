<template>
    <Dialog v-model:open="open">
        <!-- KSM R-2 / R-3 / R-4 / R-22 (W6-I) — THE ONE FadingScroll DECISION
             (§Sequencing 8), authored on the demo's OWN two-axis adoption at
             `EasingTarget.vue` (`axis="x"` for the family filter, `axis="y"`
             for the specimen drawer, the real `./fading-scroll` subpath): this
             register decides how to EXTEND that shipped adoption, and it
             extends it here, to the third mount. Composition, in two halves
             that each own exactly one thing:
             · `scroll` on `DialogContent` — the CONTENT is the viewport-bound
               owner (the primitive emits `max-h-[calc(100dvh-2rem)]
               overflow-y-auto` on the floating form), so a short viewport
               never clips the title or the close;
             · `FadingScroll axis="y"` around the list — the LIST is the
               scroll port with the producer's fade masks at both ends, bounded
               by the demo's own `--panel-max-h` (layout.css) so the dialog's
               height is the list's, not the viewport's, on a tall screen.
             The port is KEYBOARD-REACHABLE by the primitive's own contract:
             the installed `FadingScroll` root carries `tabindex="0"` itself
             and takes `role="region"` with the given `aria-label` (measured at
             `dist/fading-scroll.js`) — so the accessible-name + focusable
             scroller pair is the primitive's, not a departure authored here
             (`.b` §2.5's "departure" is corrected by this measurement). The
             hand-rolled `overflow-y-auto pr-1` port is gone with it.
             KSM C-9 — glass `/command` (a command palette: a filtered input
             over actionable items) was EVALUATED against this surface and is
             NOT adopted: this is a READ-ONLY reference list grouped by
             register, with no action per row and no filter, and a palette's
             input would be a control with nothing to command. Recorded, not
             replaced.

             KSM R-5 (W6-M) — THE `@interact-outside` TOASTER GUARD, the third
             site of a 2-of-3 in-tree precedent (`SharePopover.vue`,
             `CSSPasteDialog.vue`, both on the same `toastGuard` util). This
             dialog is not an incidental third: its OWN live `Mod+S` stays
             registered behind the scrim and copies CSS, which raises the
             house toast, and the `Toaster` is an `<html>`-teleported singleton
             — so tapping the toast this very dialog summoned reads as
             interact-outside and self-dismisses the reference. One attribute,
             copied verbatim from the two siblings.

             KSM M7 (INFO) — EVALUATED, DECLINED IN WRITING. `DialogContent`
             publishes `springPreset`, a one-token opt-in to the JS
             `useSpringMount` entrance, and the dialog's graph already pays for
             the spring engine because the PRIMITIVE imports it — the
             dogfooding irony the row names is real. It is declined anyway: the
             chunk is the producer's import, not a cost a prop can shed, and
             opting a read-only reference panel into a JS entrance would spend
             a motion decision nobody asked for on the one surface whose job is
             to be read. The producer's CSS entrance (PRM-bracketed at the
             producer) stays.

             KSM R-1 (W6-M) — GLASS-OWNED; the consumer tail is OWED ON
             DISCHARGE and is deliberately NOT wired here. Measured at the
             INSTALLED `dist/keyboard.js` (7.0.0, 3706 B): the module's whole
             published surface is `registerShortcut · useRegisteredShortcuts ·
             formatCombo · formatComboParts · isMac` — **zero** occurrences of
             suspend, scope, priority, enabled/disabled, when, guard or pause.
             The dispatcher's only gate is one `target` test against
             INPUT/TEXTAREA/isContentEditable, which is a TYPING guard and not
             a modal one, so the whole registry stays live behind this scrim
             exactly as the row says. There is no consumer lever to pull: the
             only demo-side "fix" available would be a document-level capture
             listener swallowing keys while this is open, which would swallow
             the dialog's own Escape with them and would be a local patch over
             a producer seam — the masking this wave forbids. The ask therefore
             rides the wave's ONE BH relay with its cure-shape intact (the
             dispatcher is LIFO FOR ESCAPE ONLY: a later-registered guard may
             pre-empt Escape and may NEVER pre-empt Space/Delete/Mod+Z, which
             hold FIFO priority forever), and this seat records the interim as
             interim per that relay's order.
             THE ESCALATION TEST, RUN AND REPORTED rather than assumed: the row
             re-promotes to BLOCKER on a destruction path behind the modal with
             NO live undo route. The destruction path is real —
             `useControlsKeyboardShortcuts.ts:65` binds Delete to
             `removeSelectedKeyframe` — but `:70` binds Mod+Z to `undo` in the
             SAME composable, so the undo route is live behind the scrim by the
             identical mechanism that leaves Delete live. Condition NOT met;
             the row stays MAJOR and is not re-promoted. -->
        <DialogContent
            scroll
            class="max-w-md"
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
        >
            <!-- KSM R-19 — the primitive ships `text-center sm:text-left` on
                 `DialogHeader` (measured in the installed `dialog` chunk), so
                 below 640px the title and description CENTRED while all
                 nineteen rows beneath them stayed left: an alignment-axis break
                 exactly where the dialog is most cramped, and this file is the
                 demo's only `DialogHeader` consumer (both sibling dialogs
                 compose Title/Description directly, so nothing else inherits
                 the fix or the break). One class pins the header to the axis
                 its own content uses. -->
            <DialogHeader class="text-left">
                <!-- KSM R-6 — the title was DEMOTED below the shipped default
                     (`text-body` over DialogTitle's own `text-subheading`), the
                     sole downward outlier of three sibling dialogs, while the
                     group headings under it were fixed at 10px: the hierarchy
                     ran upside down and widened with the viewport. The title
                     takes the primitive's register as shipped (root-styling
                     law: no per-instance override), and with the override gone
                     the leading/tracking utilities the `cn` merge could not
                     group no longer compete with it. -->
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <!-- KSM R-15 — ONE copy edit, four faces. The former line
                     ("Press `?` to toggle this panel") hardcoded a binding the
                     General group already derives ~34 rows below, so the `?`
                     rendered TWICE in one dialog and the two paths agreed only
                     by the accident of the formatter's trim fall-through; the
                     literal bypassed the imported formatter that every other
                     cap on this surface goes through; "panel" named a thing
                     this is not (it is a modal dialog, and the demo's panels
                     are the control surfaces); and the instruction was
                     unactionable on touch, where no `?` key exists — the touch
                     route is the header-ribbon button, which is why that
                     button exists. The description now says what the list IS
                     and restates no binding, so there is nothing left to
                     duplicate, mis-format, mis-name or fail on touch.
                     KSM R-18 — `text-muted-foreground` RESTATED the primitive's
                     own DialogDescription tone and silently pinned this call
                     site against any future producer re-tone; the `text-small`
                     half is a real, winning override and stays. -->
                <DialogDescription class="text-small">
                    Every shortcut registered in this session, grouped by
                    register.
                </DialogDescription>
            </DialogHeader>
            <FadingScroll
                axis="y"
                aria-label="Keyboard shortcuts"
                class="max-h-[var(--panel-max-h)] min-h-0"
            >
                <div class="grid gap-4">
                    <div v-for="[group, items] in groupedShortcuts" :key="group">
                        <!-- KSM R-7 — a group HEADING is a UI label, not data: the
                             demo's own Mono-as-data law (DESIGN.md) and its in-tree
                             kill-shot (`.status-badge`, design-idioms.css — "a status
                             WORD is a UI label, not data") rule the mono chip register
                             out of an `<h3>`. W6-G role (d): the TEXT face at the rows'
                             rung, semibold and muted — the heading leads its rows by
                             weight, sits under the title by rung, and the hierarchy
                             reads top-down again.
                             KSM R-13 — the heading carried NO inline padding while
                             every row under it carried `px-2`, so all four headings
                             hung 8px left of their own column, and the caps tracking
                             pushed the same direction; the heading takes the rows'
                             gutter and the column has one left edge.
                             KSM R-20 — a four-group port that ALWAYS overflows shipped
                             no sticky headings, and once a heading scrolls off,
                             proximity is the only grouping signal left — on rows whose
                             own pairing signal R-11 had to add. `sticky top-0` over an
                             opaque plate keeps the register visible for the rows it
                             governs; the negative inline margin lets the plate span the
                             port's full width while the text keeps the rows' gutter. -->
                        <h3
                            :id="`kf-shortcut-group-${group}`"
                            class="text-small font-semibold text-muted-foreground mb-2 px-2 -mx-2 sticky top-0 bg-popover py-1"
                        >
                            {{ group }}
                        </h3>
                        <!-- KSM R-11 — the label↔keys pairing carried NO semantics:
                             no list, no roles, no association, just two spans in a
                             flex row whose adjacency a sighted reader infers and a
                             screen-reader user does not. A shortcut list is the
                             textbook description list — `<dt>` the action, `<dd>`
                             the keys — so the pairing is conveyed by the markup
                             rather than by geometry, and `aria-labelledby` ties each
                             list to the heading that names its register. -->
                        <dl
                            class="grid gap-1"
                            :aria-labelledby="`kf-shortcut-group-${group}`"
                        >
                            <!-- KSM C-7 / L-4 — the key was the bare `raw` combo
                                 over a `Set` with no dedupe and no id: two gates
                                 out from a real collision (one upstream labelled
                                 `Escape` exists, unconsumed and fullscreen-gated),
                                 which is why it stays INFO. The composite key is
                                 the one-liner that closes it for good.
                                 KSM R-12 — the rows wore `hover:bg-muted/50
                                 transition-colors`, a plate that PROMISES
                                 interactivity none of them has: no click, no
                                 role, no tabindex, no cursor, nothing to run.
                                 The two admissible cures are the genuinely good
                                 affordance (click-to-run, which needs a run
                                 route this reference list does not own) and the
                                 honest treatment; the honest one is taken and
                                 the plate is stripped. The `rounded-md px-2
                                 py-1.5` rhythm stays — that is the row's box,
                                 not a hover promise. -->
                            <div
                                v-for="shortcut in items"
                                :key="`${group}:${shortcut.raw}`"
                                class="flex items-center justify-between py-1.5 px-2 rounded-md"
                            >
                                <!-- KSM R-16 — `options.label` is optional on the
                                     producer's unnarrowed return type and is only
                                     present at runtime because an undocumented
                                     `labeled` filter happens to hold; the sibling
                                     optional field (`group`) IS guarded three lines
                                     up, and that asymmetry is the tell. The durable
                                     cure is a producer type-narrowing (relay rider);
                                     the local guard falls back to the combo itself,
                                     so an unlabelled binding renders as its keys
                                     rather than as an empty row. -->
                                <dt class="text-small text-foreground">
                                    {{ shortcut.options.label ?? shortcut.raw }}
                                </dt>
                                <!-- KSM R-8 — the caps are bare platform glyphs
                                     with no accessible text: `⌘ ⇧ ⌥ ⌃ ␣ ⌫` and the
                                     arrows are each the sole text node of a `<kbd>`,
                                     and U+2318 is announced as "place of interest
                                     sign". The demo rightly owns ZERO platform
                                     knowledge, so the durable cure is a producer
                                     accessible-name companion to `formatComboParts`
                                     (GLASS-OWNED rider, already on this wave's BH
                                     relay); the INTERIM is one sr-only twin PER ROW
                                     carrying the registered combo verbatim — the
                                     demo's own platform-neutral datum — with the
                                     glyph group hidden from AT so the row is spoken
                                     once, not twice. -->
                                <dd class="flex items-center gap-1">
                                    <span class="sr-only">{{ spokenCombo(shortcut.raw) }}</span>
                                    <template
                                        v-for="(part, i) in formatComboParts(shortcut.raw)"
                                        :key="i"
                                    >
                                        <!-- KSM R-14 — the platform JOIN RULE was
                                             lost: `formatCombo` encodes it (empty on
                                             Mac, `+` where `+` is the convention) and
                                             shipped UNUSED, so `Ctrl Shift Z` rendered
                                             as three floating caps on every platform
                                             that writes `Ctrl+Shift+Z`. The joiner is
                                             ASKED OF the producer's own pair of
                                             helpers rather than branched on here, so
                                             the demo still owns no platform knowledge;
                                             `gap-0.5` (2px, off the 4px rhythm) goes
                                             with it. -->
                                        <span
                                            v-if="i > 0 && comboJoiner"
                                            aria-hidden="true"
                                            class="text-muted-foreground text-small"
                                            >{{ comboJoiner }}</span
                                        >
                                        <kbd class="kbd" aria-hidden="true">{{ part }}</kbd>
                                    </template>
                                    <!-- KSM R-17 — the Delete row UNDER-REPORTED its
                                         own binding. The producer's dispatcher matches
                                         a combo through an alias table in which
                                         `delete` accepts BOTH `backspace` and
                                         `delete` (measured in the installed
                                         `keyboard.js`), so "Delete keyframe" destroys
                                         on Backspace too while the panel showed one
                                         chip — and a keyboard reference that
                                         under-reports a DESTRUCTIVE binding fails at
                                         precisely its own purpose. The alias is
                                         surfaced beside the primary cap. The mirror
                                         below is INTERIM and declared as such: the
                                         durable cure is alias surfacing in the
                                         formatter API (GLASS-OWNED rider on this
                                         wave's relay), and the producer's table is
                                         the source of record, never this map. -->
                                    <template v-if="aliasFor(shortcut.raw)">
                                        <span
                                            aria-hidden="true"
                                            class="text-muted-foreground text-small"
                                            >or</span
                                        >
                                        <kbd class="kbd" aria-hidden="true">{{
                                            aliasFor(shortcut.raw)
                                        }}</kbd>
                                    </template>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </FadingScroll>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@mkbabb/glass-ui/dialog";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
import {
    useRegisteredShortcuts,
    formatCombo,
    formatComboParts,
} from "@mkbabb/glass-ui/keyboard";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";

const open = defineModel<boolean>('open', { required: true });

const shortcuts = useRegisteredShortcuts();

const groupedShortcuts = computed(() => {
    const groups = new Map<string, typeof shortcuts.value>();

    for (const s of shortcuts.value) {
        const group = s.options.group ?? "General";
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group)!.push(s);
    }

    return groups;
});

// KSM R-14 — the platform join rule, ASKED of the producer instead of branched
// on here. `formatCombo` joins the same parts `formatComboParts` returns, with
// the platform's own separator; comparing the two on a fixed two-part probe
// yields that separator without this file learning what platform it is on (the
// demo's zero-platform-knowledge discipline: `isMac`/`navigator.platform`/`⌘`
// all measure 0 across `demo/`).
const COMBO_PROBE = "Mod+Shift";
const comboJoiner =
    formatCombo(COMBO_PROBE) === formatComboParts(COMBO_PROBE).join("")
        ? ""
        : "+";

// KSM R-8 — the INTERIM accessible name for a cap group: the registered combo
// verbatim. It is the demo's own datum (the string passed to `registerShortcut`),
// it is identical on every platform, and it is speakable where `⌘⇧Z` is not.
// The durable cure is the producer companion to `formatComboParts` on the relay.
const spokenCombo = (raw: string): string => raw.split("+").join(" ");

// KSM R-17 — an INTERIM mirror of the producer dispatcher's alias table, kept to
// the ONE entry whose alias is a DIFFERENT physical key (the table's other
// members — space/enter/escape — alias spellings of the same key, so surfacing
// them would add noise, not information). The producer's table is the source of
// record; the durable cure is alias surfacing in the formatter API.
const KEY_ALIASES: Record<string, string> = { delete: "Backspace" };

const aliasFor = (raw: string): string | undefined => {
    const parts = raw.split("+");
    const last = parts[parts.length - 1]?.trim().toLowerCase() ?? "";
    return KEY_ALIASES[last];
};
</script>
