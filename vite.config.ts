import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      experimental: {
        chunkImportMap: {
          baseUrl: '/',
          fileName: 'importmap.json'
        }
      }
    }
  },
  plugins: [vue(), {
    name: 'inject-import-map',
    transformIndexHtml(html, ctx) {
      if (ctx.bundle) {
        const chunk = ctx.bundle['importmap.json']
        if (chunk?.type == 'asset') {
          return {
            html,
            tags: [{
              tag: 'script',
              attrs: { type: 'importmap' },
              children: chunk.source.toString()
            }]
          }
        }
      }
    }
  }]
})
