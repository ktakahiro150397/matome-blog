'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="記事名やタグで検索..."
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
              aria-label="検索クエリ"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? '検索中...' : '検索'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}