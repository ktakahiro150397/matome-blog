import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  // サイトのベースURL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // 静的ページ
  const staticPages = [
    '',
    'about',
    'tags',
    'search',
    'privacy',
    'terms',
  ];

  // 動的記事一覧
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });

  // 動的タグ一覧
  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  let urls = [
    ...staticPages.map((p) => ({
      loc: `${baseUrl}/${p}`.replace(/\/$/, ''),
      lastmod: new Date().toISOString(),
    })),
    ...posts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
    })),
    ...tags.map((tag) => ({
      loc: `${baseUrl}/tags/${tag.slug}`,
      lastmod: new Date().toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (u) => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
