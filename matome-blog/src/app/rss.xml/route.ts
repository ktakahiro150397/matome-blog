import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // 最新20件の記事を取得（必要に応じて件数調整）
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 20,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <lastBuildDate>${new Date(post.updatedAt).toUTCString()}</lastBuildDate>
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>つべのまとめ - YouTube要約ブログ</title>
    <link>${baseUrl}</link>
    <description>YouTube動画の要約を配信するブログのRSSフィード</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
