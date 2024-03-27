import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import json from '@rollup/plugin-json'; // Import the plugin

export default defineConfig({
  plugins: [
    react(),
    json(), // Use the @rollup/plugin-json plugin
  ],
  build: {
    outDir: '../build',
    emptyOutDir: true,
    sourcemap: true,
    // Optionally specify a manifest file name and format
    manifest: true, // Generate manifest file
  
 
    // Add any other build options as needed
  },
  server: {
    proxy: {
      '/ask': 'http://localhost:5000',
      '/chat': 'http://localhost:5000',
    },
  },
});
