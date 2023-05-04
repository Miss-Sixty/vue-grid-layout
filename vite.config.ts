import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// 打包后的目录
const outDir = resolve(__dirname, './dist')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/components'],
      outputDir: resolve(outDir, 'types')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    target: 'modules',
    // 压缩
    minify: true,
    lib: {
      // 组件的入口文件
      entry: './src/components/index.js',
      name: 'vue3-grid',
      fileName: 'vue3-grid'
    },
    rollupOptions: {
      // 确保外部化处理不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        dir: outDir
      }
    }
  }
})
