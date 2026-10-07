import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";
import { load } from "js-yaml";

const target = process.env.VITE_DEPLOY_TARGET;

const SITE_FILE = fileURLToPath(new URL("./src/data/site.yml", import.meta.url));
const readSite = () => load(readFileSync(SITE_FILE, "utf8"));

// Replaces %SITE_NAME% in every string with the name from site.yml.
function fillSiteName(value, name) {
  if (typeof value === "string") return value.replaceAll("%SITE_NAME%", name);
  if (Array.isArray(value)) return value.map((v) => fillSiteName(v, name));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, fillSiteName(v, name)])
    );
  }
  return value;
}

// Fills the %SITE_NAME% and %SITE_FAVICON% placeholders in index.html from
// site.yml, and reloads every YAML file in dev when site.yml changes.
function siteMeta() {
  return {
    name: "site-meta",
    handleHotUpdate({ file, server }) {
      if (file !== SITE_FILE) return;
      for (const mod of server.moduleGraph.idToModuleMap.values()) {
        if (mod.id?.endsWith(".yml")) server.moduleGraph.invalidateModule(mod);
      }
      server.ws.send({ type: "full-reload" });
      return [];
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const site = readSite();
        return html
          .replaceAll("%SITE_NAME%", site.name)
          .replaceAll("%SITE_FAVICON%", `/${site.favicon}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    yaml({ transform: (data) => fillSiteName(data, readSite().name) }),
    siteMeta(),
  ],
  base: target === "gh-pages" ? "/chi-square/" : "/",
  build: {
    sourcemap: false,
  },
});
