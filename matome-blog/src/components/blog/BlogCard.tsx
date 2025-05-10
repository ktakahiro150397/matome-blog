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

interface BlogCardProps {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt: Date;
  videoId: string;
  tags: Array<{ id: string; name: string; slug: string }>;
}

export function BlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  videoId,
  tags,
}: BlogCardProps) {
  const handleTagClick = (e: React.MouseEvent, tagSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/tags/${tagSlug}`;
  };

  return (
    <Link href={`/blog/${slug}`} className="block">
      <Card className="h-full transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          {excerpt && (
            <CardDescription className="line-clamp-3">
              {excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-2 cursor-pointer bg-transparent border-none p-0"
                onClick={(e) => handleTagClick(e, tag.slug)}
                tabIndex={0}
                aria-label={`タグ: ${tag.name}`}
                data-testid="tag-link"
              >
                #{tag.name}
              </button>
            ))}
          </div>
          <time
            dateTime={publishedAt.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {publishedAt.toLocaleDateString()}
          </time>
        </CardFooter>
      </Card>
    </Link>
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
