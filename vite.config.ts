import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite + React config.
// Set base to the repository name for GitHub Pages project site deployments:
// https://<user>.github.io/<repo>/
// For local dev this is also supported by Vite's dev server.
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
});
