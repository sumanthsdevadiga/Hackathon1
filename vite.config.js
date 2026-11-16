import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// base must match your GitHub Pages repo name so asset paths resolve correctly
export default defineConfig({
  plugins: [react()],
  base: '/Hackathon1/',   // ← GitHub Pages sub-path fix
  server: {
    port: 3000,
    open: false
  }
});
