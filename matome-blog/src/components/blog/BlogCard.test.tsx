import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCard, BlogCardSkeleton } from "./BlogCard";
import React from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// next/linkのモックを改善
type LinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}>;
vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({ href, children, className, onClick }: LinkProps) => {
      // メインのブログカードリンクとタグリンクで異なるdata-testidを使用
      const dataTestId = href.startsWith("/blog/") ? "blog-link" : "tag-link";
      return (
        <a
          href={href}
          className={className}
          onClick={onClick}
          data-testid={dataTestId}
        >
          {children}
        </a>
      );
    },
  };
});

// Card、CardHeader等のモック
type CardProps = React.PropsWithChildren<{ className?: string }>;
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: CardProps) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: React.PropsWithChildren<object>) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children, className }: CardProps) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className }: CardProps) => (
    <div data-testid="card-description" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: React.PropsWithChildren<object>) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardFooter: ({ children, className }: CardProps) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  ),
}));

// Skeletonのモック
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div
      data-testid="skeleton"
      className={`skeleton-mock ${className || ""}`}
    ></div>
  ),
}));

function withAppRouterProvider(children: React.ReactNode) {
  // ダミーのrouterオブジェクト
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

describe("BlogCard", () => {  const mockProps = {
    title: "Test Blog Post",
    excerpt: "This is a test excerpt for the blog post",
    slug: "test-blog-post",
    publishedAt: new Date("2025-05-09"),
    videoId: "abc123",
    readingTimeMinutes: 5,
    tags: [
      { id: "1", name: "React", slug: "react" },
      { id: "2", name: "Next.js", slug: "nextjs" },
    ],
  };

  // beforeEachブロックをコメントアウト
  // beforeEach(() => {
  //   vi.mocked(MockTagLink).mockClear();
  // });

  it("renders the blog card with all provided information", () => {
    render(withAppRouterProvider(<BlogCard {...mockProps} />));

    // タイトルが表示されていることを確認
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();

    // 抜粋が表示されていることを確認
    expect(
      screen.getByText("This is a test excerpt for the blog post")
    ).toBeInTheDocument();

    // YouTube画像のURLが正しいことを確認
    const image = screen.getByAltText("Test Blog Post") as HTMLImageElement;
    expect(image.src).toContain(
      "https://img.youtube.com/vi/abc123/maxresdefault.jpg"
    );

    // タグが表示されていることを確認
    expect(screen.getByText("#React")).toBeInTheDocument();
    expect(screen.getByText("#Next.js")).toBeInTheDocument();    // 公開日が表示されていることを確認
    // 実際の出力フォーマットに合わせて修正（2025/05/09 09:00）
    const publishedDate = screen.getByText("2025/05/09 09:00");
    expect(publishedDate).toBeInTheDocument();

    // 読書時間が表示されていることを確認
    const readingTime = screen.getByText("5分");
    expect(readingTime).toBeInTheDocument();

    // メインのブログリンクが存在することを確認
    const blogLink = screen.getByTestId("blog-link");
    expect(blogLink).toHaveAttribute("href", "/blog/test-blog-post");

    // タグがbuttonで表示されていることを確認
    const tagButtons = screen.getAllByTestId("tag-link");
    expect(tagButtons).toHaveLength(2);
    expect(tagButtons[0].tagName).toBe("BUTTON");
    expect(tagButtons[1].tagName).toBe("BUTTON");
    expect(tagButtons[0]).toHaveTextContent("#React");
    expect(tagButtons[1]).toHaveTextContent("#Next.js");

    // シェアボタンが表示されていることを確認
    const shareButton = screen.getByRole("button", { name: /Xでシェア/ });
    expect(shareButton).toBeInTheDocument();
  });

  it("handles blog post without excerpt", () => {
    const propsWithoutExcerpt = {
      ...mockProps,
      excerpt: null,
    };

    render(withAppRouterProvider(<BlogCard {...propsWithoutExcerpt} />));

    // タイトルは表示されているが、抜粋は表示されていないことを確認
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(
      screen.queryByText("This is a test excerpt for the blog post")
    ).not.toBeInTheDocument();
  });
  it("handles blog post without tags", () => {
    const propsWithoutTags = {
      ...mockProps,
      tags: [],
    };

    render(withAppRouterProvider(<BlogCard {...propsWithoutTags} />));

    // タグが表示されていないことを確認
    expect(screen.queryByText("#React")).not.toBeInTheDocument();
    expect(screen.queryByText("#Next.js")).not.toBeInTheDocument();
  });
  it("handles blog post without reading time", () => {
    const propsWithoutReadingTime = {
      ...mockProps,
      readingTimeMinutes: 0,
    };

    render(withAppRouterProvider(<BlogCard {...propsWithoutReadingTime} />));

    // 読書時間が表示されていないことを確認
    expect(screen.queryByText(/分/)).not.toBeInTheDocument();
  });
});

describe("BlogCardSkeleton", () => {
  it("renders the skeleton UI components", () => {
    render(withAppRouterProvider(<BlogCardSkeleton />));

    // スケルトンコンポーネントが存在することを確認
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
