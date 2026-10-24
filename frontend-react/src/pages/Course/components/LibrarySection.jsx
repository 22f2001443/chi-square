import SmartLink from "@/components/SmartLink";
import { Container } from "@/components/ui";
import courseData from "@/data/courses.yml";

export default function LibrarySection() {
  const { library = [] } = courseData;
  if (!library.length) return null;

  return (
    <section aria-labelledby="library-title" className="bg-surface">
      <Container className="flex flex-col gap-6 py-14">
        <h2 id="library-title" className="text-[25px] leading-tight font-semibold tracking-[-0.015em]">
          {courseData.libraryTitle}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          {library.filter(Boolean).map((shelf) => {
            const body = (
              <>
                {shelf.status && (
                  <span className="self-start rounded-full bg-warn-soft px-2.5 py-1 font-mono text-xs uppercase tracking-[0.08em] text-warn-ink">
                    {shelf.status}
                  </span>
                )}
                <h3 className="text-lg font-semibold">{shelf.title}</h3>
                {shelf.text && <p className="text-sm leading-relaxed text-muted">{shelf.text}</p>}
              </>
            );
            const box = "flex flex-col gap-2.5 rounded-[14px] border border-line bg-paper p-6 text-ink";
            return shelf.to ? (
              <SmartLink key={shelf.title} href={shelf.to} className={`${box} hover:border-field`}>
                {body}
              </SmartLink>
            ) : (
              <div key={shelf.title} className={box}>
                {body}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
