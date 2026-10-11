import Icon from "./Icon";
import SmartLink from "./SmartLink";
import { EVENT_LINKS } from "../lib/events";

export default function EventLinks({ links }) {
  return EVENT_LINKS.filter(({ key }) => links?.[key]).map(({ key, label, icon }) => (
    <SmartLink
      key={key}
      href={links[key]}
      className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-accent hover:text-accent-strong"
    >
      <Icon name={icon} size={18} />
      {label}
    </SmartLink>
  ));
}
