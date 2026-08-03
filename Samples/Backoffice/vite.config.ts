import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const reactRoot = path.resolve(rootDir, '../..')
const nm = path.resolve(reactRoot, 'node_modules')

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Source-aliased workspace packages resolve peers from outside the Vite root;
    // pin them to the monorepo node_modules so Vite can always find them.
    alias: {
      '@raccoonland/theme': path.resolve(reactRoot, 'Modules/theme/src'),
      '@raccoonland/feedback': path.resolve(reactRoot, 'Modules/feedback/src'),
      '@raccoonland/form-kit': path.resolve(reactRoot, 'Modules/form-kit/src'),
      '@raccoonland/layout': path.resolve(reactRoot, 'Modules/layout/src'),
      '@raccoonland/page': path.resolve(reactRoot, 'Modules/page/src'),
      '@raccoonland/pipeline-client': path.resolve(reactRoot, 'Core/pipeline-client/src'),
      '@mui/x-date-pickers': path.resolve(nm, '@mui/x-date-pickers'),
      dayjs: path.resolve(nm, 'dayjs'),
      'react-multi-date-picker': path.resolve(nm, 'react-multi-date-picker'),
      'react-date-object': path.resolve(nm, 'react-date-object'),
    },
    dedupe: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      'dayjs',
      'react-hook-form',
      'react-multi-date-picker',
      'react-date-object',
    ],
  },
  optimizeDeps: {
    // Because `@raccoonland/*` are aliased to source, every re-render that
    // pulls in an MUI component / hook triggers Vite to serve the ESM graph
    // for that dep on demand. Explicitly pre-bundling the hot deps makes the
    // first paint, HMR, and (crucially) theme/locale toggles feel instant in
    // dev. Production builds are unaffected — this only touches `vite dev`.
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-hook-form',
      '@tanstack/react-query',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      'stylis',
      'stylis-plugin-rtl',
      'notistack',
      'axios',
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/CssBaseline',
      '@mui/material/utils',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDayjs',
      'dayjs',
      'react-multi-date-picker',
      'react-date-object',
    ],
    needsInterop: ['react-multi-date-picker', 'react-date-object'],
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(rootDir), reactRoot],
    },
    proxy: {
      '/api': {
        target: 'https://localhost:4970',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
