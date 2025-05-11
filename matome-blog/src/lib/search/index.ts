import { Post, Tag } from "@prisma/client";
import { prisma } from "../db/prisma";

export interface SearchResult {
  posts: (Post & { tags: Tag[] })[];
  total: number;
}

/**
 * Search posts by title and tags
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResult> {
  // Normalize query
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    // Return latest posts if no query provided
    const posts = await prisma.post.findMany({
      include: { tags: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count();

    return {
      posts,
      total,
    };
  }

  // Find posts that match the query in title, tags, excerpt, or content
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: normalizedQuery } },
        { tags: { some: { name: { contains: normalizedQuery } } } },
        { excerpt: { contains: normalizedQuery } },
        { content: { contains: normalizedQuery } },
      ],
    },
    include: { tags: true },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Count total matching posts for pagination
  const total = await prisma.post.count({
    where: {
      OR: [
        { title: { contains: normalizedQuery } },
        { tags: { some: { name: { contains: normalizedQuery } } } },
        { excerpt: { contains: normalizedQuery } },
        { content: { contains: normalizedQuery } },
      ],
    },
  });

  return {
    posts,
    total,
  };
}
