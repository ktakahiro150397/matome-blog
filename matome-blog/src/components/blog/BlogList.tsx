import { BlogCard, BlogCardSkeleton } from "./BlogCard";

interface BlogListProps {
  posts: Array<{
    title: string;
    excerpt?: string | null;
    slug: string;
    publishedAt: Date;
    videoId: string;
    tags: Array<{ id: string; name: string; slug: string }>;
  }>;
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}