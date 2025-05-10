"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HISTORY_KEY = "search_history";
const HISTORY_MAX = 10;

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setHistory(history: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [isPending, startTransition] = useTransition();
  const [history, setHistoryState] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistoryState(getHistory());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // 履歴保存
    let newHistory = getHistory().filter((h) => h !== searchQuery);
    newHistory.unshift(searchQuery);
    if (newHistory.length > HISTORY_MAX)
      newHistory = newHistory.slice(0, HISTORY_MAX);
    setHistory(newHistory);
    setHistoryState(newHistory);

    const params = new URLSearchParams(searchParams);
    params.set("q", searchQuery);
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
    setShowHistory(false);
  };

  const handleFocus = () => {
    setHistoryState(getHistory());
    setShowHistory(true);
  };
  const handleBlur = () => {
    setTimeout(() => setShowHistory(false), 100); // 履歴クリック猶予
  };
  const handleSelectHistory = (h: string) => {
    setSearchQuery(h);
    setShowHistory(false);
    inputRef.current?.focus();
  };
  const handleDeleteHistory = (h: string) => {
    const newHistory = history.filter((item) => item !== h);
    setHistory(newHistory);
    setHistoryState(newHistory);
  };
  const handleClearHistory = () => {
    setHistory([]);
    setHistoryState([]);
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
          <div className="flex-1 relative">
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
              ref={inputRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {showHistory && history.length > 0 && (
              <div className="absolute left-0 right-0 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                  <span>検索履歴</span>
                  <button
                    type="button"
                    className="text-red-400 hover:underline"
                    onClick={handleClearHistory}
                  >
                    全削除
                  </button>
                </div>
                <ul>
                  {history.map((h) => (
                    <li
                      key={h}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                    >
                      <span
                        className="flex-1"
                        onMouseDown={() => handleSelectHistory(h)}
                      >
                        {h}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-xs text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteHistory(h)}
                        aria-label="履歴削除"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
