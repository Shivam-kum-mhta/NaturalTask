import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.', // Copy manifest.json to the root of the build directory
        },
        {
          src: 'src/alarms/add_alarm.js',
          dest: '.', // Copy and rename add_alarm.js to background.js
          rename: 'background.js',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html', // Entry point for the app
      },
    },
  },
});
