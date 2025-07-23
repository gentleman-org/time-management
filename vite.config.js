import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        {
          'element-plus': [
            'ElMessage',
            'ElNotification',
            'ElMessageBox',
          ]
        }
      ],
      dts: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Vue相关库分离
          vue: ['vue'],
          // 将Element Plus分离
          'element-plus': ['element-plus'],
          // 将图标库分离
          'element-icons': ['@element-plus/icons-vue'],
          // 将拖拽库分离
          'vue-draggable': ['vuedraggable']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用gzip压缩提示
    reportCompressedSize: true,
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 500,
  },
  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'element-plus', '@element-plus/icons-vue', 'vuedraggable']
  }
}) 