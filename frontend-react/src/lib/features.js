import features from "../data/features.yml";

// Feature flags from src/data/features.yml. Anything not listed there is on.

// Whether the page at `path` is on. Full URLs and other links that aren't
// pages on this site always are.
export function pageOn(path) {
  if (!path?.startsWith("/")) return true;
  const page = path.toLowerCase().replace(/(.)\/+$/, "$1");
  return features?.pages?.[page] !== false;
}

// Whether section `name` of a page's group in features.yml (home, people)
// is on.
export function sectionOn(page, name) {
  return features?.[page]?.[name] !== false;
}
