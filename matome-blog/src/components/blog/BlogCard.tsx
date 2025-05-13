"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShareButton } from "./ShareButton";

interface BlogCardProps {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt: Date;
  videoId: string;
  readingTimeMinutes?: number | null;
  tags: Array<{ id: string; name: string; slug: string }>;
}

export function BlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  videoId,
  readingTimeMinutes,
  tags,
}: BlogCardProps) {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tagSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tags/${tagSlug}`);
  };

  // 日付フォーマット関数
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${d} ${hh}:${mm}`;
  };

  return (
    <div className="h-full">
      <Link
        href={`/blog/${slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl transition-shadow group"
        data-testid="blog-link"
      >
        <Card className="h-full transition-all shadow border border-border bg-card/90 group-hover:border-primary group-focus-visible:border-primary duration-150 ease-in-out rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-2 text-lg font-bold group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {excerpt && (
              <CardDescription className="line-clamp-3 text-base text-muted-foreground/90">
                {excerpt}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0 pb-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm border border-border bg-muted">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-200"
                loading="lazy"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-2 pt-2">
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/60 transition-colors cursor-pointer border-none outline-none min-w-[2.5rem]"
                  onClick={(e) => handleTagClick(e, tag.slug)}
                  tabIndex={0}
                  aria-label={`タグ: ${tag.name}`}
                  data-testid="tag-link"
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <time
                dateTime={publishedAt.toISOString()}
                className="text-xs text-muted-foreground/80"
              >
                {formatDate(publishedAt)}
              </time>
              {readingTimeMinutes && (
                <span className="text-xs text-muted-foreground/80 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {readingTimeMinutes}分
                </span>
              )}
              <ShareButton
                url={`https://matome-blog.vercel.app/blog/${slug}`}
                text={title}
              />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
}
