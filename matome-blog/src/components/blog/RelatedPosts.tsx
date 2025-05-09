import { BlogCard } from "./BlogCard";

interface RelatedPostsProps {
  posts: Array<{
    title: string;
    excerpt?: string | null;
    slug: string;
    publishedAt: Date;
    videoId: string;
    tags: Array<{ id: string; name: string; slug: string }>;
  }>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">関連記事</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}