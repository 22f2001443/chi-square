import features from "../data/features.yml";

// Feature flags from src/data/features.yml. Anything not listed there is on.

// Whether the page at `path` is on. Full URLs and other links that aren't
// pages on this site always are.
export function pageOn(path) {
  if (!path?.startsWith("/")) return true;
  const page = path.toLowerCase().replace(/(.)\/+$/, "$1");
  return features?.pages?.[page] !== false;
}

// Whether the home page section `name` (latest, formats, partners, join) is on.
export function homeSectionOn(name) {
  return features?.home?.[name] !== false;
}
