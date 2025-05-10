import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "新着記事 | YouTube Summary Blog",
  description: "最新のYouTubeサマリー記事を新着順で表示します。",
};

interface BlogPageProps {
  searchParams?: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page =
    searchParams && typeof searchParams.page === "string"
      ? parseInt(searchParams.page, 10)
      : 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
      include: { tags: true },
      skip,
      take: limit,
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page < 1 || (totalPages > 0 && page > totalPages)) return null;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新着記事</h1>
      <BlogList
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/blog"
        showPagerTop={true}
        showPagerBottom={true}
      />
    </main>
  );
}
