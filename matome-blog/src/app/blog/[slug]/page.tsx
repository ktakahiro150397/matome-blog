import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { prisma } from "@/lib/db/prisma";
import { parseMDX, extractHeadings } from "@/lib/mdx";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const awaitedParams = params ? await params : { slug: "" };
  const { slug } = awaitedParams;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!post) {
    notFound();
  }

  // MDXファイルの読み込み
  const filePath = path.join(process.cwd(), "content", "posts", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");

  const { content } = await parseMDX(source);
  const headings = extractHeadings(source);

  // 関連記事の取得（同じタグを持つ記事）
  const relatedPosts = await prisma.post.findMany({
    where: {
      tags: {
        some: {
          id: {
            in: post.tags.map((tag) => tag.id),
          },
        },
      },
      NOT: {
        id: post.id,
      },
    },
    include: {
      tags: true,
    },
    take: 3,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>
          )}
          <div className="aspect-video w-full mb-8">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${post.videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <a
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content}
          </div>
          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
