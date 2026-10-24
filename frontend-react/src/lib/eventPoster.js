import site from "../data/site.yml";
import { asset } from "./asset";

// Explicit URLs or local paths win. Otherwise use the event's unique ID as
// its Blob filename; series codes are shared by multiple events.
export function eventPoster(event) {
  if (event.poster) return asset(event.poster);
  if (!event.id || !site.posterBaseUrl) return null;
  return `${site.posterBaseUrl.replace(/\/+$/, "")}/${encodeURIComponent(event.id)}.webp`;
}
