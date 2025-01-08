/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

const plugins = [
  react(),
  // other plugins
];

export default defineConfig({
  plugins: plugins as any[], // Type casting to bypass type checking
  test: {
    ...configDefaults,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    // Additional test configurations
  },
});
