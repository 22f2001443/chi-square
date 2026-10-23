import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import site from "../data/site.yml";
import navigation from "../data/navigation.yml";
import { asset } from "../lib/asset";
import { pageOn } from "../lib/features";
import Icon from "./Icon";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="border-b border-ink-line bg-ink text-on-ink">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-3"
      >
        <Link to="/" onClick={close} className="flex min-h-11 items-center gap-3 text-on-ink">
          <img src={asset(site.logo)} alt="" className="size-10 rounded-full bg-paper" />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold">{site.shortName ?? site.name}</span>
            {site.tagline && (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-on-ink-muted">
                {site.tagline}
              </span>
            )}
          </span>
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-on-ink hover:bg-ink-line md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
          <span className="sr-only">Menu</span>
        </button>

        <ul
          id="main-menu"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-0.5 pb-2 text-[13px] font-medium md:flex md:w-auto md:flex-row md:flex-wrap md:pb-0`}
        >
          {navigation.items.filter((item) => item && pageOn(item.to)).map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                onClick={close}
                className={({ isActive }) =>
                  `block p-3 ${
                    isActive
                      ? "text-white shadow-[inset_0_-2px_0_var(--color-accent-bright)]"
                      : "text-on-ink-link hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
