import BlogCard from "@/components/BlogCard";
import { ArrowLink, Container, Eyebrow } from "@/components/ui";
import blogs from "@/data/blogs.yml";

// The three newest blog posts, linking on to the Blogs page.
export default function BlogsSection() {
  const posts = (blogs.posts ?? []).filter(Boolean).slice(0, 3);
  if (!posts.length) return null;

  return (
    <section aria-labelledby="blogs-title" className="bg-paper">
      <Container className="flex flex-col gap-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            {blogs.eyebrow && <Eyebrow>{blogs.eyebrow}</Eyebrow>}
            <h2 id="blogs-title" className="text-[32px] leading-[1.1] font-semibold tracking-[-0.02em]">
              {blogs.title}
            </h2>
          </div>
          <ArrowLink href="/blogs">All blog posts</ArrowLink>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          {posts.map((post, i) => (
            <BlogCard key={`${post.link}-${i}`} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
