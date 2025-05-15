import { BlogCard } from "@/components/blog/BlogCard";
import { prisma } from "@/lib/db/prisma";
import { PostWithReadingTime } from "@/lib/db/types";
import { Metadata } from "next";
import { JsonLd } from "@/components/blog/JsonLd";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagCloud } from "@/components/blog/TagComponents";
import { getAllTags } from "@/lib/tags";

// Generate metadata for home page
export const metadata: Metadata = {
  title: "YouTube動画の要約ブログ",
  description: "人気YouTube動画の要約とポイントをまとめたブログです。",
  openGraph: {
    title: "YouTube Summary Blog - 動画要約ブログ",
    description: "人気YouTube動画の要約とポイントをまとめたブログです。",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "YouTube Summary Blog",
      }
    ],
  },
};

export default async function Home() {
  // 新着記事（最新5件）を取得
  const latestPosts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
    take: 5,
  });

  // すべての記事を取得してタグクラウド用のデータ準備
  const allPosts = await prisma.post.findMany({
    include: { tags: true },
  });
  const tags = getAllTags(allPosts);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "YouTube Summary Blog",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <main className="container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">YouTube Summary Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            人気のYouTube動画をテキストで効率的に理解できるサマリーブログです。
            気になる動画の内容をすばやく把握したい方におすすめです。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/blog">すべての記事を見る</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tags">タグから探す</Link>
            </Button>
          </div>
        </section>

        {/* 新着記事 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">新着記事</h2>
            <Button asChild variant="ghost">
              <Link href="/blog">もっと見る →</Link>
            </Button>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">            {latestPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                publishedAt={post.publishedAt}
                videoId={post.videoId}
                readingTimeMinutes={(post as PostWithReadingTime).readingTimeMinutes}
                tags={post.tags}
                href={`/articles/${post.slug}`}
              />
            ))}
          </div>
        </section>

        {/* タグクラウド */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>人気のタグ</CardTitle>
              <CardDescription>興味のあるトピックから記事を探す</CardDescription>
            </CardHeader>
            <CardContent>
              <TagCloud tags={tags} limit={20} className="justify-center" />
              <div className="text-center mt-4">
                <Button asChild variant="outline">
                  <Link href="/tags">すべてのタグを見る</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* サイト紹介 */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>このブログについて</CardTitle>
              <CardDescription>YouTube動画の要約コンテンツプラットフォーム</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                このブログは、YouTube動画の要約コンテンツを効果的に配信するためのプラットフォームです。
                検索エンジン最適化（SEO）とAIによる情報解析のしやすさを重視し、MDX形式で管理された記事を
                高速かつ快適に閲覧できます。
              </p>
              <Button asChild>
                <Link href="/about">詳しく見る</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
