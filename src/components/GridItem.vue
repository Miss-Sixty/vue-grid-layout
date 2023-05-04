<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
const parent: any = inject('parent')
const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  w: {
    type: Number,
    required: true
  },
  h: {
    type: Number,
    required: true
  }
})

interface Position {
  x: number
  y: number
}
const itemRef = ref()
const pressedDelta = ref<Position>() //鼠标与元素的差的坐标
const dragging = computed(() => !!pressedDelta.value)
const position = ref<Position>({ x: 0, y: 0 }) //元素坐标

const start = (e: PointerEvent) => {
  if (e.which !== 1) return

  const rect = itemRef.value!.getBoundingClientRect()
  position.value = {
    x: rect.x,
    y: rect.y
  }

  const pos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  pressedDelta.value = pos

  // 传给父组件
  parent.oldChildItem.value = { ...props }
  parent.dragging.value = dragging
}

const move = (e: PointerEvent) => {
  if (!pressedDelta.value) return
  let { x, y } = position.value
  x = e.clientX - pressedDelta.value.x
  y = e.clientY - pressedDelta.value.y
  position.value = { x, y }
}

const end = () => {
  if (!pressedDelta.value) return
  pressedDelta.value = undefined
}

useEventListener(itemRef, 'pointerdown', start)
useEventListener(window, 'pointermove', move)
useEventListener(window, 'pointerup', end)

const initStyle = computed(() => {
  const [marginX, marginY] = parent.margin
  const [width, height] = parent.size.value

  return {
    transform: `translate(
        ${props.x * (marginX + width) + marginX}px, 
        ${props.y * (marginY + height) + marginY}px
    )`,
    width: `${props.w * width + (props.w - 1) * marginX}px`,
    height: `${props.h * height + (props.h - 1) * marginY}px`
  }
})

const dragStyle = computed(() => {
  if (!dragging.value) return
  const { x, y } = position.value

  return {
    transform: `translate(${x}px, ${y}px)`,
    zIndex: 2
  }
})
</script>

<template>
  <div ref="itemRef" class="item" :style="{ ...initStyle, ...dragStyle }">
    {{ position }}
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.item {
  position: absolute;
  user-select: none;
  background-color: antiquewhite;
}
</style>
