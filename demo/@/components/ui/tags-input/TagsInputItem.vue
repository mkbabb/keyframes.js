<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TagsInputItem, type TagsInputItemProps, useForwardProps } from 'reka-ui'

import { cn } from '@utils/utils'

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItem v-bind="forwardedProps" :class="cn('flex h-6 items-center rounded bg-secondary data-[state=active]:shadow-[0_0_0_2px_hsl(var(--ring)/0.4)]', props.class)">
    <slot />
  </TagsInputItem>
</template>
