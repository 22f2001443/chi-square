import eventData from "../data/events.yml";
import seriesData from "../data/series.yml";
import site from "../data/site.yml";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "November 11, 2023" or "January 2025" -> Date, or null. Parsed by hand so
// it doesn't depend on each browser's Date parser.
function parseDate(text) {
  const m = String(text ?? "").trim().match(/^([A-Za-z]+)\s+(?:(\d{1,2}),\s*)?(\d{4})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) return null;
  return new Date(Number(m[3]), month, m[2] ? Number(m[2]) : 1);
}

const shortMonth = (date) => `${SHORT[date.getMonth()]} ${date.getFullYear()}`;

// "#2F4BD8" -> "rgba(47, 75, 216, 0.25)"
export function withAlpha(hex, alpha) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  if (Number.isNaN(n)) return "transparent";
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const FALLBACK_COLOR = "#5B616E";

export const kinds = (eventData.kinds ?? []).filter(Boolean);

function kindFor(type) {
  return (
    kinds.find((k) => k.type === type) ?? {
      type,
      label: type ?? "Event",
      plural: type ?? "Events",
      color: FALLBACK_COLOR,
    }
  );
}

function attendanceLabel(e) {
  const parts = [];
  if (e.registered != null) parts.push(`${e.registered} registered`);
  if (e.attended != null) parts.push(`${e.attended} attended`);
  if (!parts.length && e.participants != null) parts.push(`${e.participants} participants`);
  return parts.join(" · ");
}

function normalize(e) {
  const date = parseDate(e.date);
  const series = seriesData[e.series];
  const partner = (site.collaborators ?? []).find((c) => c.name === e.collaboration);
  return {
    ...e,
    kind: kindFor(e.type),
    // Undated events (e.g. contests) sort by the start of their term.
    sortKey: (date ?? parseDate(e.term) ?? new Date(0)).getTime(),
    date,
    day: date ? String(date.getDate()).padStart(2, "0") : null,
    monthYear: date ? shortMonth(date) : null,
    dateLabel: date ? `${String(date.getDate()).padStart(2, "0")} ${shortMonth(date)}` : e.term,
    seriesLabel: series ? `${series.name} · ${series.topic}` : e.series,
    hosts: (e.hosts ?? []).filter(Boolean),
    attendance: attendanceLabel(e),
    collaborator: e.collaboration ? { name: e.collaboration, logo: partner?.logo } : null,
  };
}

// Every event, newest first.
export const events = (eventData.events ?? [])
  .filter(Boolean)
  .map(normalize)
  .sort((a, b) => b.sortKey - a.sortKey);

export const journeyPage = eventData.page ?? {};

// Consecutive events grouped by term, keeping the newest-first order.
export function groupByTerm(list) {
  const groups = [];
  for (const e of list) {
    const last = groups[groups.length - 1];
    if (last && last.term === e.term) last.items.push(e);
    else groups.push({ term: e.term, items: [e] });
  }
  return groups;
}

// An event's links, in display order; only the ones it has are shown.
export const EVENT_LINKS = [
  { key: "youtube", label: "Watch", icon: "play" },
  { key: "material", label: "Slides & material", icon: "file" },
  { key: "linkedin", label: "LinkedIn post", icon: "linkedin" },
  { key: "instagram", label: "Instagram post", icon: "instagram" },
];

export function hasEventLinks(links) {
  return EVENT_LINKS.some(({ key }) => links?.[key]);
}

export function countByType(type) {
  return events.filter((e) => e.type === type).length;
}

// "Nov 2023 — Feb 2026" across the dated events.
export function dateRange() {
  const dated = events.filter((e) => e.date);
  if (!dated.length) return "";
  return `${shortMonth(dated[dated.length - 1].date)} — ${shortMonth(dated[0].date)}`;
}
