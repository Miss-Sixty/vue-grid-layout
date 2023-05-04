import GridItem from './GridItem.vue'
import GridLayout from './GridLayout.vue'

const VueGridLayout = [GridLayout, GridItem]

export const install = (Vue) => {
  VueGridLayout.forEach((com) => {
    Vue.component(com.name, com)
  })
}

export { GridLayout, GridItem }
