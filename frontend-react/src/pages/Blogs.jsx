import { useState } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import { ArrowLink, Container, PageHeader } from "../components/ui";
import blogs from "../data/blogs.yml";

export default function Blogs() {
  const posts = (blogs.posts ?? []).filter(Boolean);
  const pageSize = blogs.pageSize ?? 6;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  return (
    <Layout>
      <PageHeader eyebrow={blogs.eyebrow} title={blogs.title ?? "Blogs"} lede={blogs.intro} />
      <section aria-label="Blog posts" className="bg-paper">
        <Container className="flex flex-col gap-8 pt-6 pb-16">
          {blogs.allPosts && (
            <ArrowLink href={blogs.allPosts.href} icon="arrowUpRight" className="self-start">
              {blogs.allPosts.label}
            </ArrowLink>
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
            {posts.slice(0, visibleCount).map((post, i) => (
              <BlogCard key={`${post.link}-${i}`} post={post} />
            ))}
          </div>
          {visibleCount < posts.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + pageSize)}
              className="min-h-12 cursor-pointer self-center rounded-lg border border-field px-6 font-semibold hover:border-ink"
            >
              Show more
            </button>
          )}
        </Container>
      </section>
    </Layout>
  );
}
