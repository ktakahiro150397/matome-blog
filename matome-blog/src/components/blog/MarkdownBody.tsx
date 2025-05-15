"use client";
import { MDXProvider } from "@mdx-js/react";
import { markdownComponents } from "./MarkdownComponents";
import type { ReactNode } from "react";

interface MarkdownBodyProps {
  content: ReactNode;
}

export default function MarkdownBody({ content }: MarkdownBodyProps) {
  // 記事ページ側のproseクラスを除去し、ここでのみproseを適用することで二重適用を防ぐ
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none">
      <MDXProvider components={markdownComponents}>{content}</MDXProvider>
    </article>
  );
}
