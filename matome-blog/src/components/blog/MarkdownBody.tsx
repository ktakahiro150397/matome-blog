"use client";
import { MDXProvider } from "@mdx-js/react";
import { markdownComponents } from "./MarkdownComponents";
import type { ReactNode } from "react";

interface MarkdownBodyProps {
  content: ReactNode;
}

export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return <MDXProvider components={markdownComponents}>{content}</MDXProvider>;
}
