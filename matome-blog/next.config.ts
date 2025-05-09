import createMDX from '@next/mdx'
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      [
        require('rehype-pretty-code'),
        {
          theme: 'github-dark'
        }
      ]
    ],
  }
})

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
