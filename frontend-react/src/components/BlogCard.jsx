import { useState } from "react";
import SmartLink from "./SmartLink";
import { asset } from "../lib/asset";

// A blog post from blogs.yml; a missing or broken cover becomes a plain tile.
export default function BlogCard({ post }) {
  const [failed, setFailed] = useState(false);
  const meta = [post.date, post.readTime].filter(Boolean).join(" · ");
  return (
    <SmartLink
      href={post.link}
      className="flex flex-col overflow-hidden rounded-[14px] border border-line text-ink hover:border-field"
    >
      {post.image && !failed ? (
        <img
          src={asset(post.image)}
          alt=""
          onError={() => setFailed(true)}
          className="block h-45 w-full bg-surface object-cover"
        />
      ) : (
        <div aria-hidden="true" className="flex h-45 items-center justify-center bg-surface font-mono text-3xl text-field">
          χ²
        </div>
      )}
      <div className="flex flex-col gap-2.5 px-6 pt-5.5 pb-6">
        {meta && <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{meta}</p>}
        <h3 className="text-xl leading-snug font-semibold">{post.title}</h3>
        <span className="mt-1 text-sm font-semibold text-accent">Read on LinkedIn</span>
      </div>
    </SmartLink>
  );
}
