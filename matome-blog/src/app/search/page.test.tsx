vi.mock("@/lib/search", () => ({
  searchPosts: vi.fn(),
}));

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "./page";
import { searchPosts } from "@/lib/search";

const searchPostsMock = searchPosts as ReturnType<typeof vi.fn>;

// BlogCardPropsをSearchResultのposts型に合わせて拡張
interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  videoId: string;
  videoUrl: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: Array<{ id: string; name: string; slug: string }>;
}

// Mock the components
vi.mock("@/components/blog/BlogList", () => ({
  BlogList: ({ posts }: { posts: BlogCardProps[] }) => (
    <div data-testid="blog-list">
      {posts.map((post) => (
        <div key={post.slug} data-testid="blog-post">
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
    searchPostsMock.mockResolvedValue({
      posts: [],
      total: 0,
    });

    render(await SearchPage({ searchParams: {} }));

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(
      screen.getByText("検索キーワードを入力してください。")
    ).toBeInTheDocument();
  });

  it("renders search page with query but no results", async () => {
    // Mock the searchPosts function to return empty results
    searchPostsMock.mockResolvedValue({
      posts: [],
      total: 0,
    });

    render(await SearchPage({ searchParams: { q: "test" } }));

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("「test」の検索結果: 0件")).toBeInTheDocument();
    expect(
      screen.getByText("検索結果が見つかりませんでした。")
    ).toBeInTheDocument();
  });

  it("renders search page with query and results", async () => {
    const mockPosts: BlogCardProps[] = [
      {
        id: "1",
        title: "Test Post 1",
        slug: "test",
        content: "",
        excerpt: "",
        videoId: "",
        videoUrl: "",
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      },
      {
        id: "2",
        title: "Test Post 2",
        slug: "test2",
        content: "",
        excerpt: "",
        videoId: "",
        videoUrl: "",
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      },
    ];

    searchPostsMock.mockResolvedValue({
      posts: mockPosts,
      total: 2,
    });

    render(await SearchPage({ searchParams: { q: "test" } }));

    expect(screen.getByText("記事検索")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("「test」の検索結果: 2件")).toBeInTheDocument();
    expect(screen.getByTestId("blog-list")).toBeInTheDocument();
  });

  it("renders error message when searchPosts throws", async () => {
    searchPostsMock.mockRejectedValue(new Error("DB error"));
    try {
      render(await SearchPage({ searchParams: { q: "error" } }));
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
