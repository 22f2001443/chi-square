const BASE = import.meta.env.BASE_URL;

// Resolves an image path from src/data/*.yml: full URLs are kept as-is,
// anything else is a file in public/.
export function asset(path) {
  if (!path || /^(https?:)?\/\//.test(path)) return path;
  return BASE + path.replace(/^\//, "");
}
