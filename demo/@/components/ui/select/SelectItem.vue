<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
  useForwardProps,
} from 'reka-ui'
import { Check } from 'lucide-vue-next'
import { cn } from '@utils/utils'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class']; hideIndicator?: boolean }>()

const delegatedProps = computed(() => {
  const { class: _, hideIndicator: __, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        hideIndicator ? 'pl-2' : 'pl-8',
        props.class,
      )
    "
  >
    <span v-if="!hideIndicator" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check class="h-4 w-4" />
      </SelectItemIndicator>
    </span>

    <SelectItemText>
      <slot />
    </SelectItemText>
    <slot name="extra" />
  </SelectItem>
</template>
