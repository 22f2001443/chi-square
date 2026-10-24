// Shared timeline grid: the line, then the cards. From md up a date column
// comes first; on phones the date moves into the card.
export default function TimelineRow({ className, style, children }) {
  return (
    <div style={style} className={`grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 md:grid-cols-[84px_32px_minmax(0,1fr)] ${className}`}>
      {children}
    </div>
  );
}
