import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'chi-square';
  
export default defineConfig({
  plugins: [react()],
  base: isProd ? `/${repoName}/` : '/',
  build: {
    sourcemap: true, },
});