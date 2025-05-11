import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getAllTags, findTagBySlug, getPostsByTag } from "@/lib/tags";
import { BlogList } from "@/components/blog/BlogList";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const posts = await prisma.post.findMany({
    include: { tags: true },
  });
  const tags = getAllTags(posts);
  const tagName = findTagBySlug(params.slug, tags);

  if (!tagName) {
    return {
      title: "タグが見つかりません | YouTube Summary Blog",
      description: "指定されたタグは存在しません。",
    };
  }

  return {
    title: `${tagName}の記事一覧 | YouTube Summary Blog`,
    description: `${tagName}に関する記事の一覧です。`,
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    include: { tags: true },
  });
  const tags = getAllTags(posts);

  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const awaitedParams = params ? await params : { slug: "" };
  const { slug } = awaitedParams;
  const posts = await prisma.post.findMany({
    include: { tags: true },
  });
  const tags = getAllTags(posts);
  const tagName = findTagBySlug(slug, tags);

  // If tag not found, return 404
  if (!tagName) {
    notFound();
  }

  // Filter posts by the selected tag
  const filteredPosts = getPostsByTag(posts, tagName);

  return (
    <main className="container py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          タグ: {tagName}
        </h1>
        <p className="text-muted-foreground">
          このタグには {filteredPosts.length} 件の記事があります
        </p>
      </header>

      <BlogList posts={filteredPosts} />
    </main>
  );
}
