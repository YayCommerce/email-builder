import react from '@vitejs/plugin-react';
import { pluginExternalConfig } from '@yaymail/configs/src/vite/externalConfig';
import path from 'path';
// import analyze from "rollup-plugin-analyzer"
// import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, loadEnv } from 'vite';
import { dynamicBase } from 'vite-plugin-dynamic-base';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import svgr from 'vite-plugin-svgr';

process.env = { ...process.env, ...loadEnv(process.env.mode || 'development', process.cwd()) };
const rootpath = './src';

// https://vitejs.dev/config/
export default defineConfig({
  root: rootpath,
  base: process.env.NODE_ENV === 'production' ? 'window.yaymailData.urls.vite_dynamic_base' : '/',

  plugins: [
    react(),
    svgr(),
    viteExternalsPlugin(pluginExternalConfig, { disableInServe: false }),
    dynamicBase({
      publicPath: 'window.yaymailData.urls.vite_dynamic_base',
    }),
    // visualizer({ template: "treemap", emitFile: true, filename: "stats.html" }),
  ],

  resolve: {
    alias: [
      { find: '@src', replacement: path.resolve(__dirname, 'src') },
      // fix less import by: @import ~
      { find: /^~/, replacement: '' },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Vite 4 only supports Dart Sass' legacy JS API; the modern compiler API
        // requires Vite 5.4+. Silence the deprecation until Vite is upgraded.
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      output: {
        comments: /translators:/i,
      },
      compress: {
        passes: 2,
      },
      mangle: {
        reserved: ['__', '_n', '_nx', '_x'],
      },
    },
    manifest: true,
    emptyOutDir: true,
    outDir: path.resolve('../../assets', 'dist/yaymail'),
    assetsDir: '',
    rollupOptions: {
      input: {
        'yaymail-main.tsx': path.resolve(__dirname, rootpath, 'yaymail-main.tsx'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('antd/es')) {
              if (id.includes('antd/es/form')) {
                return 'vendor_antd_form';
              }
              if (id.includes('antd/es/table')) {
                return 'vendor_antd_table';
              }
            }
          }
        },
      },
      plugins: [
        // analyze({ summaryOnly: true, limit:10 }),
      ],
    },
  },
  server: {
    cors: true,
    strictPort: true,
    port: 3000,
    origin: `${process.env.VITE_SERVER_ORIGIN}`,
    hmr: {
      port: 3000,
      host: 'localhost',
      protocol: 'ws',
    },
  },
});
