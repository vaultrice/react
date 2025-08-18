import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    // Tell Vite to build a library
    lib: {
      // The entry point of your library
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VaultriceReact', // The global variable name in UMD builds
      // The proper extensions will be added to the filename
      fileName: (format) => `vaultrice-react.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})