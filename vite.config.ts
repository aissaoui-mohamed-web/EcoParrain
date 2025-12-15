import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Le chemin de base '/' est standard pour Vercel (racine du domaine)
  base: '/', 
  build: {
    // On force 'dist' pour être sûr que Vercel trouve les fichiers au bon endroit
    outDir: 'dist',
    sourcemap: false
  }
});