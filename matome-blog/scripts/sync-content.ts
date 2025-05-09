import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

async function syncContent() {
  try {
    // MDXファイルを読み込む
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const files = await fs.readdir(postsDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    for (const file of mdxFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content: mdxContent } = matter(content);
      const slug = file.replace(/\.mdx$/, '');

      // タグの同期
      const tags = await Promise.all(
        (frontmatter.tags || []).map(async (tagName: string) => {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
              name: tagName,
              slug: tagSlug,
            },
          });
        })
      );

      // 投稿の同期
      await prisma.post.upsert({
        where: { slug },
        update: {
          title: frontmatter.title,
          excerpt: frontmatter.excerpt,
          content: mdxContent,
          videoId: frontmatter.videoId,
          videoUrl: frontmatter.videoUrl,
          publishedAt: new Date(frontmatter.publishedAt),
          tags: {
            set: tags.map(tag => ({ id: tag.id })),
          },
        },
        create: {
          slug,
          title: frontmatter.title,
          excerpt: frontmatter.excerpt,
          content: mdxContent,
          videoId: frontmatter.videoId,
          videoUrl: frontmatter.videoUrl,
          publishedAt: new Date(frontmatter.publishedAt),
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      });
    }

    console.log('Content synced successfully!');
  } catch (error) {
    console.error('Error syncing content:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncContent();