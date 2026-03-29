import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const target = process.env.VITE_DEPLOY_TARGET;

export default defineConfig({
  plugins: [react()],
  base: target === "gh-pages" ? "/chi-square/" : "/",
  build: {
    sourcemap: true,
  },
});
