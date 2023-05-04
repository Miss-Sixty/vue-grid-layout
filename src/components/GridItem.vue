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
  },
  id: {
    type: String,
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

  const childRect = itemRef.value!.getBoundingClientRect()
  const parentRect = parent.gridRef.value!.getBoundingClientRect()
  console.log('start', childRect, parentRect)
  position.value = {
    x: childRect.x - parentRect.x,
    y: childRect.y - parentRect.y
  }

  const pos = {
    x: e.clientX - childRect.left + parentRect.left,
    y: e.clientY - childRect.top + parentRect.top
  }
  console.log('pos', pos)

  pressedDelta.value = pos

  // 传给父组件
  parent.oldChildItem.value = { ...props }
  parent.dragging.value = dragging.value
  console.log('x', parent.newPosition)

  parent.newPosition.value = { x: props.x, y: props.y }
}

const move = (e: PointerEvent) => {
  if (!pressedDelta.value) return
  let { x, y } = position.value
  x = e.clientX - pressedDelta.value.x
  y = e.clientY - pressedDelta.value.y
  position.value = { x, y }
  parent.newPosition.value = getGridItem(x, y)

  parent.moveElementAwayFromCollision()
}

const end = () => {
  if (!pressedDelta.value) return
  pressedDelta.value = undefined
  parent.updateModelValue(props.id)
  setTimeout(() => (parent.dragging.value = dragging.value), 200)
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
    zIndex: 2,
    transition: 'none'
  }
})

// 将移动的坐标转换成网格坐标
const getGridItem = (x: number, y: number) => {
  const [marginX, marginY] = parent.margin
  const [width, height] = parent.size.value

  const gridX = Math.round((x - marginX) / (width + marginX))
  const gridY = Math.round((y - marginY) / (height + marginY))

  return { x: gridX, y: gridY }
}
</script>

<template>
  <div ref="itemRef" class="item" :style="{ ...initStyle, ...dragStyle }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.item {
  position: absolute;
  user-select: none;
  background-color: antiquewhite;
  transition: transform 0.2s ease;
}
</style>
