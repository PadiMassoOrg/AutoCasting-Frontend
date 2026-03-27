import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), path.resolve(__dirname, '../AutoCasting-UI-Library-Padimasso')],
    },
  },
});
