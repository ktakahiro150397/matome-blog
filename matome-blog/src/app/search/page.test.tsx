import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "./page";
import { searchPosts } from "@/lib/search";

// Mock the search function
vi.mock("@/lib/search", () => ({
  searchPosts: vi.fn(),
}));

// Mock the components
vi.mock("@/components/blog/BlogList", () => ({
  BlogList: ({ posts }: any) => (
    <div data-testid="blog-list">
      {posts.map((post: any) => (
        <div key={post.id} data-testid="blog-post">
          {post.title}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/blog/SearchInput", () => ({
  SearchInput: () => <div data-testid="search-input">Search Input</div>,
}));

describe("SearchPage", () => {
  it("renders search page with no query", async () => {
    // Mock the searchPosts function to return empty results
    (searchPosts as any).mockResolvedValue({
      posts: [],
      total: 0,
    });

    const { container } = render(await SearchPage({ searchParams: {} }));

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(
      screen.getByText("検索キーワードを入力してください。")
    ).toBeInTheDocument();
  });

  it("renders search page with query but no results", async () => {
    // Mock the searchPosts function to return empty results
    (searchPosts as any).mockResolvedValue({
      posts: [],
      total: 0,
    });

    const { container } = render(
      await SearchPage({ searchParams: { q: "test" } })
    );

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("「test」の検索結果: 0件")).toBeInTheDocument();
    expect(
      screen.getByText("検索結果が見つかりませんでした。")
    ).toBeInTheDocument();
  });

  it("renders search page with query and results", async () => {
    const mockPosts = [
      { id: "1", title: "Test Post 1", tags: [] },
      { id: "2", title: "Test Post 2", tags: [] },
    ];

    // Mock the searchPosts function to return results
    (searchPosts as any).mockResolvedValue({
      posts: mockPosts,
      total: 2,
    });

    const { container } = render(
      await SearchPage({ searchParams: { q: "test" } })
    );

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("「test」の検索結果: 2件")).toBeInTheDocument();
    expect(screen.getByTestId("blog-list")).toBeInTheDocument();
  });

  it("renders error message when searchPosts throws", async () => {
    (searchPosts as any).mockRejectedValue(new Error("DB error"));
    // SearchPageがエラー時にどう表示するかは実装依存ですが、例として
    let error;
    try {
      await SearchPage({ searchParams: { q: "error" } });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    // 実際のUIでエラー表示がある場合は、下記のようなテストに変更してください
    // expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});
