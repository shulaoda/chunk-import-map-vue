import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      experimental: {
        chunkImportMap: true
      }
    }
  },
  plugins: [vue(), {
    name: 'apply-import-map',
    transformIndexHtml(html, ctx) {
      if (ctx.bundle) {
        const chunk = ctx.bundle['.chunk-import-map.json']
        if (chunk?.type == 'asset') {
          const chunkImportMap: Record<string, string> = JSON.parse(chunk.source.toString());
          // Customize the base URL prefix for import map entries (defaults to "./")
          // const imports = Object.fromEntries(Object.entries(chunkImportMap).map(([key, value]) => [
          //   path.posix.join('/', key),
          //   path.posix.join('/', value),
          // ]));
          const importMap = { imports: chunkImportMap };
          return {
            html,
            tags: [{
              tag: 'script',
              attrs: { type: 'importmap' },
              children: JSON.stringify(importMap)
            }]
          }
        }
      }
    }
  }]
})
