import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogList } from "./BlogList";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function withAppRouterProvider(children: React.ReactNode) {
  const router: Partial<AppRouterInstance> = {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => Promise.resolve(),
  };
  return (
    <AppRouterContext.Provider value={router as AppRouterInstance}>
      {children}
    </AppRouterContext.Provider>
  );
}

const basePosts = [
  {
    title: "Test Post",
    excerpt: "Excerpt",
    slug: "test-post",
    publishedAt: new Date("2025-05-10"),
    videoId: "vid1",
    tags: [{ id: "1", name: "tag1", slug: "tag1" }],
  },
];

describe("BlogList", () => {
  it("renders posts", () => {
    render(withAppRouterProvider(<BlogList posts={basePosts} />));
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("shows pager at top and bottom when enabled and totalPages > 1", () => {
    render(
      withAppRouterProvider(
        <BlogList
          posts={basePosts}
          currentPage={2}
          totalPages={3}
          baseUrl="/blog"
          showPagerTop={true}
          showPagerBottom={true}
        />
      )
    );
    // ページャーが2つ表示される
    expect(screen.getAllByText("前のページ").length).toBe(2);
    expect(screen.getAllByText("次のページ").length).toBe(2);
    expect(screen.getAllByText("2 / 3").length).toBe(2);
  });

  it("shows only next pager on first page", () => {
    render(
      withAppRouterProvider(
        <BlogList
          posts={basePosts}
          currentPage={1}
          totalPages={2}
          baseUrl="/blog"
          showPagerTop={true}
          showPagerBottom={true}
        />
      )
    );
    expect(screen.queryByText("前のページ")).toBeNull();
    expect(screen.getAllByText("次のページ").length).toBe(2);
  });

  it("shows only prev pager on last page", () => {
    render(
      withAppRouterProvider(
        <BlogList
          posts={basePosts}
          currentPage={2}
          totalPages={2}
          baseUrl="/blog"
          showPagerTop={true}
          showPagerBottom={true}
        />
      )
    );
    expect(screen.getAllByText("前のページ").length).toBe(2);
    expect(screen.queryByText("次のページ")).toBeNull();
  });

  it("shows no pager if totalPages is 1", () => {
    render(
      withAppRouterProvider(
        <BlogList
          posts={basePosts}
          currentPage={1}
          totalPages={1}
          baseUrl="/blog"
          showPagerTop={true}
          showPagerBottom={true}
        />
      )
    );
    expect(screen.queryByText("前のページ")).toBeNull();
    expect(screen.queryByText("次のページ")).toBeNull();
  });
});
