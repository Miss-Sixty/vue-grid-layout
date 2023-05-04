<script setup lang="ts">
import { provide, type PropType, ref, onMounted } from 'vue'
import GridItem from './GridItem.vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<object[]>,
    required: true
  },
  cols: {
    type: [Number],
    default: 10
  },
  margin: {
    type: Array as PropType<number[]>,
    required: true
  },
  rowHeight: {
    type: Number,
    default: 80
  }
})

const gridRef = ref()
const size = ref([0, 0])
const init = () => {
  // 宽度
  const width = gridRef.value.clientWidth
  size.value[0] = (width - (props.cols + 1) * props.margin[0]) / props.cols
  size.value[1] = props.rowHeight
}

const parentBottom = () => {
  // 找到最大的y值
  const maxY = Math.max(...props.modelValue.map((item: any) => item.y))
  gridRef.value.style.height = `${
    (maxY + 1) * (size.value[1] + props.margin[1]) + props.margin[1]
  }px`
}

const oldChildItem = ref({ x: 0, y: 0, w: 0, h: 0, id: '' })
const dragging = ref(false)
const newPosition = ref({ x: 0, y: 0 })

// 更新modelValue
const updateModelValue = (id: string) => {
  const { x, y } = oldChildItem.value
  const { x: newX, y: newY } = newPosition.value
  if (x === newX && y === newY) return

  const newModelValue = props.modelValue.map((item: any) => {
    return item.id === id ? { ...item, x: newX, y: newY } : item
  })
  emit('update:modelValue', newModelValue)
}

// 当getGridItem计算的位置有其他元素时，重排有关联的元素
// TODO: 未完成
const moveElementAwayFromCollision = () => {
  const { x, y } = newPosition.value
  const newModelValue = props.modelValue.map((item: any) => {
    if (item.id === oldChildItem.value.id) return item
    if (item.x === x && item.y === y) {
      return { ...item, y: item.y + 1 }
    }
    return item
  })
  emit('update:modelValue', newModelValue)
}

provide('parent', {
  margin: props.margin,
  size,
  dragging,
  oldChildItem,
  newPosition,
  updateModelValue,
  moveElementAwayFromCollision,
  gridRef
})

onMounted(() => {
  init()
  parentBottom()
})
</script>

<template>
  <div  class="grid" ref="gridRef">
    <GridItem
      v-show="dragging"
      :x="newPosition.x"
      :y="newPosition.y"
      :w="oldChildItem.w"
      :h="oldChildItem.h"
      style="background-color: cadetblue"
      id="-1"
      >
    </GridItem>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  position: relative;
  background-color: aquamarine;
}
</style>
