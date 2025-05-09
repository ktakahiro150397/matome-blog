/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/.next/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx']
    },
    setupFiles: ['./src/test-setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})