<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@utils/utils'

const props = defineProps<{
  defaultValue?: string | number
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string | number>()
</script>

<template>
  <input v-model="modelValue" :class="cn('flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_hsl(var(--ring)/0.4)] disabled:cursor-not-allowed disabled:opacity-50', props.class)">
</template>
