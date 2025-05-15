import { BlogList } from "@/components/blog/BlogList";
import { prisma } from "@/lib/db/prisma";
import { PostWithReadingTime } from "@/lib/db/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { JsonLd } from "@/components/blog/JsonLd";

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

interface HomeProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
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

  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page < 1 || (totalPages > 0 && page > totalPages)) notFound();  return (
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
    </>
  );
}
