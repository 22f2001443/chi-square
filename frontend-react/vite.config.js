import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";
import { load } from "js-yaml";

const target = process.env.VITE_DEPLOY_TARGET;

// Fills the %SITE_NAME% and %SITE_FAVICON% placeholders in index.html from
// src/data/site.yml, so the page title has a single source.
function siteMeta() {
  const file = new URL("./src/data/site.yml", import.meta.url);
  return {
    name: "site-meta",
    configureServer(server) {
      server.watcher.add(file.pathname);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const site = load(readFileSync(file, "utf8"));
        return html
          .replaceAll("%SITE_NAME%", site.name)
          .replaceAll("%SITE_FAVICON%", `/${site.favicon}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), yaml(), siteMeta()],
  base: target === "gh-pages" ? "/chi-square/" : "/",
  build: {
    sourcemap: false,
  },
});
