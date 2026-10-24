import { pageOn } from "../config/featureFlags";
import SmartLink from "./SmartLink";
import Icon from "./Icon";

// Small building blocks shared by the pages.

export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-300 px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ tone = "accent", className = "", children }) {
  const color = { accent: "text-accent", muted: "text-muted", onInk: "text-on-ink-muted" }[tone];
  return (
    <p className={`font-mono text-xs uppercase tracking-widest ${color} ${className}`}>
      {children}
    </p>
  );
}

const BUTTONS = {
  // On paper
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "border border-field text-ink hover:border-ink",
  // On ink
  outlineOnInk: "border border-ink-edge text-on-ink hover:border-on-ink-muted",
  // On ink or the blue accent band
  inverse: "bg-paper text-ink hover:bg-surface",
  outlineOnAccent: "border border-white text-white hover:bg-white/10",
};

export function ButtonLink({ href, variant = "primary", className = "", children }) {
  return (
    <SmartLink
      href={href}
      className={`inline-flex min-h-12 items-center gap-2.5 rounded-lg px-[22px] font-semibold transition-colors ${BUTTONS[variant]} ${className}`}
    >
      {children}
    </SmartLink>
  );
}

// Renders YAML `actions` ({ label, href|to, style: primary|secondary }) with
// the button variants that suit the background they sit on. Buttons to pages
// that are switched off are left out.
export function Actions({ actions = [], on = "paper" }) {
  const variants = {
    paper: { primary: "primary", secondary: "secondary" },
    ink: { primary: "primary", secondary: "outlineOnInk" },
    inkInverse: { primary: "inverse", secondary: "outlineOnInk" },
    accent: { primary: "inverse", secondary: "outlineOnAccent" },
  }[on];
  return (
    <div className="flex flex-wrap gap-3">
      {actions.filter((a) => a && pageOn(a.to ?? a.href)).map((a) => (
        <ButtonLink
          key={a.label}
          href={a.to ?? a.href}
          variant={variants[a.style] ?? variants.primary}
        >
          {a.label}
          {a.style === "primary" && on === "ink" && <Icon name="arrowRight" />}
        </ButtonLink>
      ))}
    </div>
  );
}

export function ArrowLink({ href, icon = "arrowRight", className = "", children }) {
  return (
    <SmartLink
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 font-semibold text-accent hover:text-accent-strong ${className}`}
    >
      {children}
      <Icon name={icon} />
    </SmartLink>
  );
}

// The white title block at the top of inner pages.
export function PageHeader({ eyebrow, title, lede, className = "" }) {
  return (
    <section aria-labelledby="page-title" className="bg-paper">
      <Container className={`flex flex-col gap-4 pt-14 pb-8 ${className}`}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1
          id="page-title"
          className="max-w-[16em] text-[clamp(36px,4.5vw,54px)] leading-[1.05] font-semibold tracking-[-0.025em]"
        >
          {title}
        </h1>
        {lede && <p className="max-w-[38em] text-base leading-relaxed text-muted">{lede}</p>}
      </Container>
    </section>
  );
}
