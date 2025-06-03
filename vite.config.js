import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = 'chi-square';
  
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  build: {
    sourcemap: true, },
});