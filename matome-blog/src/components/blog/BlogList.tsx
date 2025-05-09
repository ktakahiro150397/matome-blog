import Link from "next/link";
import { BlogCard, BlogCardSkeleton } from "./BlogCard";
import { Button } from "@/components/ui/button";

interface BlogListProps {
  posts: Array<{
    title: string;
    excerpt?: string | null;
    slug: string;
    publishedAt: Date;
    videoId: string;
    tags: Array<{ id: string; name: string; slug: string }>;
  }>;
  currentPage?: number;
  totalPages?: number;
  baseUrl?: string;
}

export function BlogList({ posts, currentPage = 1, totalPages = 1, baseUrl = '' }: BlogListProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link
                href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
                rel="prev"
              >
                前のページ
              </Link>
            </Button>
          )}
          <span className="px-4 py-2 text-sm">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link
                href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
                rel="next"
              >
                次のページ
              </Link>
            </Button>
          )}
        </div>
      )}
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