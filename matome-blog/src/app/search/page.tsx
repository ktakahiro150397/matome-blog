import { Metadata } from 'next';
import { searchPosts } from '@/lib/search';
import { BlogList } from '@/components/blog/BlogList';
import { SearchInput } from '@/components/blog/SearchInput';

export const metadata: Metadata = {
  title: '検索 | つべのまとめ',
  description: '記事名やタグで検索できます。',
};

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = 10;

  const { posts, total } = await searchPosts(query, page, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">記事検索</h1>
      
      <SearchInput />
      
      {query && (
        <p className="mb-6">
          「{query}」の検索結果: {total}件
        </p>
      )}
      
      {posts.length > 0 ? (
        <BlogList 
          posts={posts} 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl={`/search?q=${encodeURIComponent(query)}`} 
        />
      ) : (
        <div className="text-center p-12 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {query ? '検索結果が見つかりませんでした。' : '検索キーワードを入力してください。'}
          </p>
        </div>
      )}
    </div>
  );
}