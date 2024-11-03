import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  server: {
    proxy: mode === 'development' ? { '/api': 'http://localhost:3000' } : undefined
  }
}));
