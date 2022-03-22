import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],

    alias: {
      '@': pathResolve('src'),
      '@api': pathResolve('./src/api'),
      '@utils': pathResolve('./src/utils'),
      '@store': pathResolve('./src/store/modules'),
      '@components': pathResolve('./src/components'),
      '@enum': pathResolve('./src/enum'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:3001/socket.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socket.io/, ''),
      },
    },
  },
});
