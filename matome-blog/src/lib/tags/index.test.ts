import { describe, it, expect } from 'vitest';
import { Post, Tag } from '@prisma/client';
import { tagToSlug, getAllTags, getPostsByTag, findTagBySlug, TagWithCount } from './index';

describe('Tag Utils', () => {
  describe('tagToSlug', () => {
    it('should convert tag name to slug format', () => {
      expect(tagToSlug('JavaScript')).toBe('javascript');
      expect(tagToSlug('Next.js')).toBe('nextjs');
      expect(tagToSlug('Web Development')).toBe('web-development');
      expect(tagToSlug(' React  Native ')).toBe('react-native');
      expect(tagToSlug('C#')).toBe('c');
      expect(tagToSlug('Node.js & Express')).toBe('nodejs-express');
    });

    it('should handle edge cases correctly', () => {
      expect(tagToSlug('')).toBe('');
      expect(tagToSlug('   ')).toBe('');
      expect(tagToSlug('---')).toBe('');
      expect(tagToSlug('---test---')).toBe('test');
    });
  });

  describe('getAllTags', () => {
    it('should extract and count all unique tags from posts', () => {
      // Create mock tags
      const reactTag: Tag = { id: 't1', name: 'React', slug: 'react' };
      const jsTag: Tag = { id: 't2', name: 'JavaScript', slug: 'javascript' };
      const nextTag: Tag = { id: 't3', name: 'Next.js', slug: 'nextjs' };
      const nodeTag: Tag = { id: 't4', name: 'Node.js', slug: 'nodejs' };
      
      // Create mock posts with proper Prisma Post & Tag structure
      const mockPosts: (Post & { tags: Tag[] })[] = [
        { 
          id: '1', 
          title: 'Post 1',
          slug: 'post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          videoId: 'vid1',
          videoUrl: 'url1',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [jsTag, reactTag]
        },
        { 
          id: '2', 
          title: 'Post 2',
          slug: 'post-2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          videoId: 'vid2',
          videoUrl: 'url2',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [reactTag, nextTag]
        },
        { 
          id: '3', 
          title: 'Post 3',
          slug: 'post-3',
          content: 'Content 3',
          excerpt: 'Excerpt 3',
          videoId: 'vid3',
          videoUrl: 'url3',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [jsTag, nodeTag]
        },
      ];

      const result = getAllTags(mockPosts);
      
      expect(result).toHaveLength(4);
      expect(result.find(t => t.name === 'React')?.count).toBe(2);
      expect(result.find(t => t.name === 'JavaScript')?.count).toBe(2);
      expect(result.find(t => t.name === 'Next.js')?.count).toBe(1);
      expect(result.find(t => t.name === 'Node.js')?.count).toBe(1);
      
      // Check sorting (should be sorted by count in descending order)
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
      expect(result[1].count).toBeGreaterThanOrEqual(result[2].count);
    });

    it('should handle posts without tags', () => {
      const mockPosts: (Post & { tags: Tag[] })[] = [
        { 
          id: '1',
          title: 'Post 1',
          slug: 'post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          videoId: 'vid1',
          videoUrl: 'url1',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [{ id: 't1', name: 'JavaScript', slug: 'javascript' }]
        },
        { 
          id: '2',
          title: 'Post 2',
          slug: 'post-2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          videoId: 'vid2',
          videoUrl: 'url2',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: []
        },
        { 
          id: '3',
          title: 'Post 3',
          slug: 'post-3',
          content: 'Content 3',
          excerpt: 'Excerpt 3',
          videoId: 'vid3',
          videoUrl: 'url3',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: []
        },
      ];

      const result = getAllTags(mockPosts);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('JavaScript');
    });
  });

  describe('getPostsByTag', () => {
    it('should filter posts by tag name', () => {
      // Create mock tags
      const reactTag: Tag = { id: 't1', name: 'React', slug: 'react' };
      const jsTag: Tag = { id: 't2', name: 'JavaScript', slug: 'javascript' };
      const nextTag: Tag = { id: 't3', name: 'Next.js', slug: 'nextjs' };
      const nodeTag: Tag = { id: 't4', name: 'Node.js', slug: 'nodejs' };
      
      // Create mock posts with proper Prisma Post & Tag structure
      const mockPosts: (Post & { tags: Tag[] })[] = [
        { 
          id: '1', 
          title: 'Post 1',
          slug: 'post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          videoId: 'vid1',
          videoUrl: 'url1',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [jsTag, reactTag]
        },
        { 
          id: '2', 
          title: 'Post 2',
          slug: 'post-2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          videoId: 'vid2',
          videoUrl: 'url2',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [reactTag, nextTag]
        },
        { 
          id: '3', 
          title: 'Post 3',
          slug: 'post-3',
          content: 'Content 3',
          excerpt: 'Excerpt 3',
          videoId: 'vid3',
          videoUrl: 'url3',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [jsTag, nodeTag]
        },
      ];

      const jsResults = getPostsByTag(mockPosts, 'JavaScript');
      expect(jsResults).toHaveLength(2);
      expect(jsResults[0].id).toBe('1');
      expect(jsResults[1].id).toBe('3');

      const reactResults = getPostsByTag(mockPosts, 'React');
      expect(reactResults).toHaveLength(2);
      expect(reactResults[0].id).toBe('1');
      expect(reactResults[1].id).toBe('2');
    });

    it('should return empty array when no posts match the tag', () => {
      const mockPosts: (Post & { tags: Tag[] })[] = [
        { 
          id: '1',
          title: 'Post 1',
          slug: 'post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          videoId: 'vid1',
          videoUrl: 'url1',
          publishedAt: new Date(),
          updatedAt: new Date(),
          tags: [{ id: 't1', name: 'JavaScript', slug: 'javascript' }]
        },
      ];

      const results = getPostsByTag(mockPosts, 'Vue');
      expect(results).toHaveLength(0);
    });
  });

  describe('findTagBySlug', () => {
    it('should find tag name by slug', () => {
      const tags: TagWithCount[] = [
        { name: 'JavaScript', slug: 'javascript', count: 2 },
        { name: 'Next.js', slug: 'nextjs', count: 1 },
        { name: 'React', slug: 'react', count: 3 },
      ];

      expect(findTagBySlug('javascript', tags)).toBe('JavaScript');
      expect(findTagBySlug('nextjs', tags)).toBe('Next.js');
      expect(findTagBySlug('react', tags)).toBe('React');
    });

    it('should return null when tag slug is not found', () => {
      const tags: TagWithCount[] = [
        { name: 'JavaScript', slug: 'javascript', count: 2 },
      ];

      expect(findTagBySlug('typescript', tags)).toBeNull();
    });
  });
});