<template>
    <div class="grid gap-2">
        <span class="text-mono-caption font-semibold text-muted-foreground">properties</span>

        <!-- Name -->
        <div class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
                <label class="font-mono text-admin-label text-muted-foreground">name</label>
                <Input
                    :model-value="asset.name"
                    class="text-mono-caption normal-case h-6"
                    @change="(e: Event) => emit('update', asset.id, { name: (e.target as HTMLInputElement).value })"
                />

                <!-- Position -->
                <label class="font-mono text-admin-label text-muted-foreground">x</label>
                <Input
                    type="number"
                    :model-value="asset.transform.x"
                    class="text-mono-caption normal-case h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { x: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                />

                <label class="font-mono text-admin-label text-muted-foreground">y</label>
                <Input
                    type="number"
                    :model-value="asset.transform.y"
                    class="text-mono-caption normal-case h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { y: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                />

                <!-- Size -->
                <label class="font-mono text-admin-label text-muted-foreground">width</label>
                <Input
                    type="number"
                    :model-value="asset.transform.width"
                    class="text-mono-caption normal-case h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { width: Math.max(1, parseFloat((e.target as HTMLInputElement).value) || 0) })"
                />

                <label class="font-mono text-admin-label text-muted-foreground">height</label>
                <Input
                    type="number"
                    :model-value="asset.transform.height"
                    class="text-mono-caption normal-case h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { height: Math.max(1, parseFloat((e.target as HTMLInputElement).value) || 0) })"
                />

                <!-- Rotation -->
                <label class="font-mono text-admin-label text-muted-foreground">rotation</label>
                <div class="flex items-center gap-2">
                    <Slider
                        class="flex-1"
                        :min="0"
                        :max="360"
                        :step="1"
                        :model-value="[asset.transform.rotation]"
                        @update:model-value="(v: any) => emit('updateTransform', asset.id, { rotation: v[0] })"
                    />
                    <span class="font-mono text-admin-label text-muted-foreground w-8 text-right">{{ Math.round(asset.transform.rotation) }}°</span>
                </div>

                <!-- Kind-specific properties -->
                <template v-if="asset.kind !== 'text' && asset.kind !== 'svg'">
                    <label class="font-mono text-admin-label text-muted-foreground">bg color</label>
                    <Input
                        :model-value="asset.backgroundColor ?? ''"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { backgroundColor: (e.target as HTMLInputElement).value })"
                    />
                </template>

                <template v-if="asset.kind === 'rectangle' || asset.kind === 'circle'">
                    <label class="font-mono text-admin-label text-muted-foreground">radius</label>
                    <Input
                        type="number"
                        :model-value="asset.borderRadius ?? 0"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { borderRadius: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                    />
                </template>

                <template v-if="asset.kind === 'text'">
                    <label class="font-mono text-admin-label text-muted-foreground">text</label>
                    <Input
                        :model-value="asset.text ?? ''"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { text: (e.target as HTMLInputElement).value })"
                    />

                    <label class="font-mono text-admin-label text-muted-foreground">font size</label>
                    <Input
                        type="number"
                        :model-value="asset.fontSize ?? 32"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { fontSize: parseFloat((e.target as HTMLInputElement).value) || 32 })"
                    />

                    <label class="font-mono text-admin-label text-muted-foreground">font</label>
                    <!-- L.W11 S9 — the stale 'Fraunces' default (a since-deleted
                         face) corrected to the display face the system actually
                         ships (Instrument Serif), aligning the control's default to
                         the render path's `var(--font-display)`. -->
                    <Input
                        :model-value="asset.fontFamily ?? 'Instrument Serif'"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { fontFamily: (e.target as HTMLInputElement).value })"
                    />

                    <label class="font-mono text-admin-label text-muted-foreground">color</label>
                    <Input
                        :model-value="asset.color ?? 'var(--foreground)'"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { color: (e.target as HTMLInputElement).value })"
                    />
                </template>

                <!-- S.D3 S4 (DEAD-KINDS) — Image is now REAL: an `imageSrc` URL/
                     data-URI field feeds the `<img :src>` render branch (whose
                     `:alt="asset.name"` a11y binding is asserted by
                     proof:demo-elevate). Until a source is entered the asset is a
                     transparent placeholder box (selectable + bindable), never a
                     permanently-gray dead rect. -->
                <template v-if="asset.kind === 'image'">
                    <label class="font-mono text-admin-label text-muted-foreground">image url</label>
                    <Input
                        :model-value="asset.imageSrc ?? ''"
                        placeholder="https://… or data:image/…"
                        class="text-mono-caption normal-case h-6"
                        @change="(e: Event) => emit('update', asset.id, { imageSrc: (e.target as HTMLInputElement).value })"
                    />
                </template>

                <!-- S.D3 S4 (DEAD-KINDS) — SVG is now REAL: an `svgContent`
                     textarea feeds the sanitized `v-html` render branch (the
                     sanitizer strips <script> in AssetViewport). Until markup is
                     entered the asset is an empty placeholder, never an invisible
                     phantom. -->
                <template v-if="asset.kind === 'svg'">
                    <label class="font-mono text-admin-label text-muted-foreground">svg markup</label>
                    <textarea
                        :value="asset.svgContent ?? ''"
                        rows="4"
                        placeholder="&lt;svg viewBox='0 0 100 100'&gt;&lt;circle …/&gt;&lt;/svg&gt;"
                        class="text-mono-caption normal-case min-h-16 w-full resize-y rounded-md border border-border bg-input/40 px-2 py-1 font-mono"
                        @change="(e: Event) => emit('update', asset.id, { svgContent: (e.target as HTMLTextAreaElement).value })"
                    ></textarea>
                </template>

                <!-- Animation binding — L.W11 S9 the BIND IGNITION trigger.
                     Binding a preset is the page's whole point; the Select now
                     fires `onBindAnimation`, which both updates the asset AND emits
                     a `bind-ignition` event when the binding goes unset→set. The
                     compose scene host (ComposeScene.vue, gated `[data-foundry]`)
                     catches it and IGNITES the asset: a warm key-light bloom + a
                     first-cycle comet-tail tracing the preset's actual easing curve,
                     drawn back onto the page (engine-dogfooded; PRM-collapsed to a
                     state flip). This is generic-safe (the event is inert if nobody
                     listens — the other scenes simply do not wire the ignition). -->
                <template v-if="animationNames && animationNames.length > 0">
                    <label class="font-mono text-admin-label text-muted-foreground">animation</label>
                    <Select
                        :model-value="asset.animationName ?? '__none__'"
                        @update:model-value="(v: any) => onBindAnimation(v)"
                    >
                        <SelectTrigger class="text-mono-caption normal-case h-6">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup class="text-mono-caption normal-case">
                                <SelectItem value="__none__">None</SelectItem>
                                <SelectItem v-for="name in animationNames" :key="name" :value="name">
                                    {{ name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Asset, AssetTransform } from "./assetTypes";
import {
    Slider,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";

const props = defineProps<{
    asset: Asset;
    animationNames?: string[];
}>();

const emit = defineEmits<{
    (e: "update", id: string, updates: Partial<Asset>): void;
    (e: "updateTransform", id: string, transform: Partial<AssetTransform>): void;
    // L.W11 S9 — the BIND IGNITION signal: fired when an asset's animation goes
    // unset→set, so the compose scene foundry can light the asset. Inert if unlistened.
    (e: "bind-ignition", id: string, animationName: string): void;
}>();

// L.W11 S9 — the bind handler. Updates the asset's animationName AND, when the
// binding ignites a preset that was previously unbound, emits `bind-ignition`
// so the foundry key-light blooms + the comet-tail traces the preset curve.
const onBindAnimation = (v: string) => {
    const next = v === "__none__" ? undefined : v;
    const wasBound = !!props.asset.animationName;
    emit("update", props.asset.id, { animationName: next });
    // Ignition fires only on a fresh bind (unset→set), not on a re-pick or clear.
    if (next && !wasBound) emit("bind-ignition", props.asset.id, next);
};
</script>
