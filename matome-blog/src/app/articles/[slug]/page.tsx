import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButton } from "@/components/blog/ShareButton";
import { prisma } from "@/lib/db/prisma";
import { parseMDX, extractHeadings } from "@/lib/mdx";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import MarkdownBody from "@/components/blog/MarkdownBody";
import { type Post, type Tag } from "@prisma/client";
import { Metadata } from "next";
import { JsonLd } from "@/components/blog/JsonLd";
import { PostWithReadingTime } from "@/lib/db/types";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "記事が見つかりません | YouTube Summary Blog",
      description: "指定された記事は存在しません。",
    };
  }
  // Base URL for canonical URL and OG images
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt || '')}`;

  return {
    title: `${post.title} | YouTube Summary Blog`,
    description: post.excerpt || `${post.title}の要約記事です。`,
    authors: [{ name: "YouTube Summary Blog" }],
    keywords: post.tags.map(tag => tag.name),
    openGraph: {
      title: post.title,
      description: post.excerpt || `${post.title}の要約記事です。`,
      type: "article",
      url: `${baseUrl}/articles/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags.map(tag => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `${post.title}の要約記事です。`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/articles/${post.slug}`,
    },
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // 完全なPost型の取得（readingTimeMinutesを含む）
  const post = (await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  })) as unknown as PostWithReadingTime;

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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || `${post.title}の要約記事です。`,
          "image": `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`,
          "datePublished": post.publishedAt.toISOString(),
          "dateModified": post.updatedAt.toISOString(),
          "author": {
            "@type": "Organization",
            "name": "YouTube Summary Blog",
          },
          "publisher": {
            "@type": "Organization",
            "name": "YouTube Summary Blog",
            "logo": {
              "@type": "ImageObject",
              "url": "https://matome-blog.vercel.app/logo.png", // Make sure this logo exists
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://matome-blog.vercel.app/articles/${post.slug}`,
          },
          "video": {
            "@type": "VideoObject",
            "name": post.title,
            "description": post.excerpt || post.title,
            "thumbnailUrl": `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`,
            "uploadDate": post.publishedAt.toISOString(),
            "embedUrl": `https://www.youtube.com/embed/${post.videoId}`,
            "contentUrl": `https://www.youtube.com/watch?v=${post.videoId}`,
          },
          "keywords": post.tags.map(tag => tag.name).join(","),
          "wordCount": source.split(/\s+/).length,
          "timeRequired": `PT${post.readingTimeMinutes || 5}M`,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "ホーム",
                "item": "https://matome-blog.vercel.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "ブログ記事",
                "item": "https://matome-blog.vercel.app/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://matome-blog.vercel.app/articles/${post.slug}`
              }
            ]
          }
        }}
      />
      <Breadcrumb 
        items={[
          { label: "ホーム", href: "/" },
          { label: "ブログ記事", href: "/blog" },
          { label: post.title, href: `/articles/${post.slug}`, active: true }
        ]} 
      />
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
            {post.readingTimeMinutes && (
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
                {post.readingTimeMinutes}分
              </span>
            )}
            <ShareButton
              url={`https://matome-blog.vercel.app/articles/${post.slug}`}
              text={post.title}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <div>
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
