import { BlogList } from "@/components/blog/BlogList";
import { prisma } from "@/lib/db/prisma";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface HomeProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
  const page = searchParams && typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },
      skip,
      take: limit,
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page < 1 || (totalPages > 0 && page > totalPages)) notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">YouTube Summary Blog</h1>
      <BlogList 
        posts={posts} 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl="/" 
        showPagerTop={true}
        showPagerBottom={true}
      />
    </main>
  );
}
