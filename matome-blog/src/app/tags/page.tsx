import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { getAllTags } from '@/lib/tags';
import { TagCloud } from '@/components/blog/TagComponents';

export const metadata: Metadata = {
  title: 'すべてのタグ | YouTube Summary Blog',
  description: 'YouTube Summary Blogのすべてのタグ一覧ページです。',
};

export default async function TagsPage() {
  // Fetch all posts from the database with tags relation included
  const posts = await prisma.post.findMany({
    include: { tags: true }
  });
  
  // Extract and count all tags
  const tags = getAllTags(posts);
  
  return (
    <main className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">タグ一覧</h1>
      <p className="text-muted-foreground mb-8">
        現在 {tags.length} 個のタグがあります。タグをクリックすると、そのタグの記事一覧が表示されます。
      </p>
      
      <TagCloud tags={tags} className="mt-6" />
    </main>
  );
}