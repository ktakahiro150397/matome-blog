import { Post, Tag } from '@prisma/client';

export interface TagWithCount {
  name: string;
  slug: string;
  count: number;
}

/**
 * Convert a tag name to a URL-friendly slug
 */
export function tagToSlug(tag: string): string {
  // For Japanese or other non-Latin characters, use encodeURIComponent instead of just removing them
  if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(tag)) {
    return encodeURIComponent(tag.trim().toLowerCase());
  }
  
  // For Latin characters, use the standard slugification
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Extract all unique tags from a list of posts and count occurrences
 */
export function getAllTags(posts: (Post & { tags: Tag[] })[]): TagWithCount[] {
  const tagMap = new Map<string, number>();
  
  // Count occurrences of each tag
  posts.forEach(post => {
    const tags = post.tags || [];
    tags.forEach(tag => {
      const count = tagMap.get(tag.name) || 0;
      tagMap.set(tag.name, count + 1);
    });
  });
  
  // Convert to array of TagWithCount objects
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      slug: tagToSlug(name),
      count
    }))
    .sort((a, b) => b.count - a.count); // Sort by count in descending order
}

/**
 * Filter posts by tag name
 */
export function getPostsByTag(posts: (Post & { tags: Tag[] })[], tagName: string): (Post & { tags: Tag[] })[] {
  return posts.filter(post => {
    return post.tags.some(tag => tag.name === tagName);
  });
}

/**
 * Find a tag name by its slug
 */
export function findTagBySlug(slug: string, tags: TagWithCount[]): string | null {
  // First, try exact match
  let tag = tags.find(tag => tag.slug === slug);
  
  // If not found and the slug is URL-encoded, try decoding it
  if (!tag && slug.includes('%')) {
    try {
      const decodedSlug = decodeURIComponent(slug);
      tag = tags.find(tag => 
        tag.slug === decodedSlug || 
        tag.name.toLowerCase() === decodedSlug.toLowerCase()
      );
    } catch (e) {
      console.error('Error decoding slug:', e);
    }
  }
  
  // If still not found, try a more flexible match
  if (!tag) {
    tag = tags.find(tag => 
      tag.name.toLowerCase() === slug.toLowerCase() ||
      tagToSlug(tag.name) === slug
    );
  }
  
  return tag ? tag.name : null;
}