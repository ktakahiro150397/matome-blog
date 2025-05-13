import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

interface FrontMatter {
  title: string;
  excerpt?: string;
  publishedAt: string;
  videoId: string;
  videoUrl: string;
  tags?: string[];
}

export async function parseMDX(source: string) {
  const { content, frontmatter } = await compileMDX<FrontMatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: 'github-dark'
            }
          ],
          rehypeAutolinkHeadings
        ]
      }
    }
  })

  return {
    content,
    frontmatter: {
      ...frontmatter,
      publishedAt: new Date(frontmatter.publishedAt)
    }
  }
}

export function extractHeadings(content: string) {
  const headingLines = content.split('\n').filter(line => line.match(/^#{2,4}\s/))
  return headingLines.map((line, index) => {
    const level = line.match(/^(#{2,4})\s/)?.[1].length || 2
    const text = line.replace(/^#{2,4}\s/, '')
    // 日本語などの非ASCII文字を含む場合でも一意のIDを生成するため、
    // テキストのハッシュ化やインデックスを使用
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    // IDが空またはただの '-' になる場合は、インデックスとレベルを使用して一意のIDを生成
    if (!id || id === '-') {
      id = `heading-${level}-${index}`
    }
    return { text, id, level }
  })
}