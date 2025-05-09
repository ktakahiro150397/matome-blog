import { BlogList } from "@/components/blog/BlogList";
import { prisma } from "@/lib/db/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      publishedAt: 'desc'
    },
    include: {
      tags: true
    },
    take: 9
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">YouTube Summary Blog</h1>
      <BlogList posts={posts} />
    </main>
  );
}
