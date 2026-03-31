import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/balanced-ternary-puzzle/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        mobile: 'mobile.html',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
}));
