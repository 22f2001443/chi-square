import site from "../data/site.yml";
import SmartLink from "./SmartLink";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { footer = {}, socials = [] } = site;

  return (
    <footer className="bg-ink text-on-ink-link">
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 pt-12 pb-8">
        <div className="flex flex-wrap gap-x-12 gap-y-8">
          <div className="flex flex-[1_1_280px] flex-col gap-3">
            <span className="text-base font-semibold text-on-ink">{site.name}</span>
            <p className="text-[13px] leading-relaxed">
              {footer.hostedBy && (
                <>
                  Hosted by {footer.hostedBy}
                  <br />
                </>
              )}
              {footer.institution}
              {footer.location && (
                <>
                  <br />
                  {footer.location}
                </>
              )}
            </p>
          </div>
          {(footer.linkGroups ?? []).filter(Boolean).map((group) => (
            <div key={group.title} className="flex flex-[0_1_160px] flex-col gap-1">
              <h2 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-on-ink-muted">
                {group.title}
              </h2>
              {(group.links ?? []).map((link) => (
                <SmartLink key={link.label} href={link.href} className="py-1.5 text-[13px] hover:text-white">
                  {link.label}
                </SmartLink>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-line pt-6 text-xs">
          <span>
            © {currentYear} {site.name}
          </span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {socials.filter(Boolean).map((s) => (
              <li key={s.label}>
                <SmartLink href={s.href} className="inline-block py-2.5 underline hover:text-white">
                  {s.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
