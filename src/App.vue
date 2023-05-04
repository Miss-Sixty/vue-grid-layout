<script setup lang="ts">
import GridLayout from '@/components/GridLayout.vue'
import GridItem from '@/components/GridItem.vue'
import { ref } from 'vue'
const layout = ref([
  { id: '1', x: 0, y: 0, h: 1, w: 1 },
  { id: '2', x: 1, y: 0, h: 1, w: 1 },
  { id: '3', x: 2, y: 0, h: 1, w: 1 },
  { id: '4', x: 3, y: 2, h: 1, w: 2 },
  { id: '5', x: 4, y: 1, h: 1, w: 1 }
])
</script>

<template>
  <GridLayout v-model="layout" :rowHeight="60" :cols="5" :margin="[10, 10]">
    <GridItem
      v-for="item in layout"
      :key="item.id"
      :id="item.id"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      >{{ item.id }}
    </GridItem>
  </GridLayout>
</template>

<style>
body {
  margin: 0;
}
</style>
