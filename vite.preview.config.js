// Builds one self-contained HTML file you can double-click to open.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
export default defineConfig({ plugins: [react(), viteSingleFile()], build: { outDir: process.env.OUT || 'preview-build', emptyOutDir: false } })
