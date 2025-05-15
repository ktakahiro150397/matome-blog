import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { PostWithReadingTime } from "@/lib/db/types";
import { BlogList } from "@/components/blog/BlogList";
import Link from "next/link";
import { JsonLd } from "@/components/blog/JsonLd";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

export const metadata: Metadata = {
  title: "新着記事 | YouTube Summary Blog",
  description: "最新のYouTubeサマリー記事を新着順で表示します。",
  openGraph: {
    title: "新着記事 - YouTube動画の要約ブログ",
    description: "最新のYouTubeサマリー記事を新着順で表示します。人気動画の内容をテキストでわかりやすく解説しています。",
  }
};

interface BlogPageProps {
  searchParams?: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = searchParams ? await searchParams : {};
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
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

  const totalPages = Math.max(1, Math.ceil(total / limit));  if (page < 1 || (totalPages > 0 && page > totalPages)) {
    return (
      <>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "新着記事 - ページが見つかりません",
            "description": "要求されたページは存在しません。"
          }}
        />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb 
            items={[
              { label: "ホーム", href: "/" },
              { label: "新着記事", href: "/blog", active: true }
            ]} 
          />
          <h1 className="text-3xl font-bold mb-8">新着記事</h1>
          <div className="text-center py-10">
            <p className="text-xl">ページが見つかりません</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-primary hover:underline"
            >
              最初のページに戻る
            </Link>
          </div>
        </main>
      </>
    );
  }
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "新着記事",
          "description": "最新のYouTubeサマリー記事を新着順で表示します。",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/blog`,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "ホーム",
                "item": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "新着記事",
                "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/blog`
              }
            ]
          }
        }}
      />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "ホーム", href: "/" },
            { label: "新着記事", href: "/blog", active: true }
          ]} 
        />
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
    </>
  );
}
