/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  }
}))
