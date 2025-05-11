import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButton } from "@/components/blog/ShareButton";
import { prisma } from "@/lib/db/prisma";
import { parseMDX, extractHeadings } from "@/lib/mdx";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import MarkdownBody from "@/components/blog/MarkdownBody";

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
  const { slug } = params;

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
          <div className="flex flex-wrap gap-2 mb-2">
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
          <div className="flex items-center gap-2">
            <time
              dateTime={post.publishedAt.toISOString()}
              className="text-xs text-muted-foreground/80"
            >
              {post.publishedAt.toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            <ShareButton
              url={`https://matome-blog.vercel.app/blog/${post.slug}`}
              text={post.title}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MarkdownBody content={content} />
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
