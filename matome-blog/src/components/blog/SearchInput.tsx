"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-stretch gap-2"
          role="search"
          aria-label="記事検索フォーム"
        >
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="記事タイトル・タグ・キーワードで検索"
              className="w-full p-3 text-base border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="検索クエリ"
              autoComplete="search"
              inputMode="search"
              tabIndex={0}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            aria-label="検索実行ボタン"
          >
            {isPending ? "検索中..." : "検索"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
