import React from "react";
import { Link } from "react-router-dom";

// Renders an `href` from src/data/*.yml: "/page" routes inside the app, full
// URLs open in a new tab, and anything else (e.g. "#") is a plain anchor.
const SmartLink = React.forwardRef(function SmartLink({ href, children, ...props }, ref) {
  if (href?.startsWith("/")) {
    return <Link ref={ref} to={href} {...props}>{children}</Link>;
  }
  const external = /^https?:\/\//.test(href ?? "");
  return (
    <a
      ref={ref}
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
});

export default SmartLink;
