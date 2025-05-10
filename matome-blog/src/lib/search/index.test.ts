import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchPosts } from '.'
import { prisma } from '../db/prisma'

vi.mock('../db/prisma', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

describe('searchPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.post.findMany).mockResolvedValue([])
    vi.mocked(prisma.post.count).mockResolvedValue(0)
  })

  it('should return latest posts when no query is provided', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        content: 'Content 1',
        excerpt: 'Excerpt 1',
        videoId: 'video1',
        videoUrl: 'https://youtube.com/video1',
        publishedAt: new Date('2025-05-09'),
        updatedAt: new Date('2025-05-09'),
        tags: [{ id: '1', name: 'test', slug: 'test' }],
      },
    ]

    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts)
    vi.mocked(prisma.post.count).mockResolvedValue(1)

    const result = await searchPosts('')

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      include: { tags: true },
      orderBy: { publishedAt: 'desc' },
      skip: 0,
      take: 10,
    })
    expect(prisma.post.count).toHaveBeenCalled()
    expect(result).toEqual({
      posts: mockPosts,
      total: 1,
    })
  })

  it('should search posts by title', async () => {
    const mockPosts = [
      {
        id: '2',
        title: 'React Tutorial',
        slug: 'react-tutorial',
        content: 'React content',
        excerpt: 'React excerpt',
        videoId: 'video2',
        videoUrl: 'https://youtube.com/video2',
        publishedAt: new Date('2025-05-09'),
        updatedAt: new Date('2025-05-09'),
        tags: [{ id: '2', name: 'react', slug: 'react' }],
      },
    ]

    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts)
    vi.mocked(prisma.post.count).mockResolvedValue(1)

    const result = await searchPosts('React')

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'react' } },
          { tags: { some: { name: { contains: 'react' } } } },
          { excerpt: { contains: 'react' } },
        ],
      },
      include: { tags: true },
      orderBy: { publishedAt: 'desc' },
      skip: 0,
      take: 10,
    })
    expect(result).toEqual({
      posts: mockPosts,
      total: 1,
    })
  })

  it('should handle pagination correctly', async () => {
    const mockPosts = [
      {
        id: '3',
        title: 'Third Post',
        slug: 'third-post',
        content: 'Content 3',
        excerpt: 'Excerpt 3',
        videoId: 'video3',
        videoUrl: 'https://youtube.com/video3',
        publishedAt: new Date('2025-05-09'),
        updatedAt: new Date('2025-05-09'),
        tags: [],
      },
    ]

    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts)
    vi.mocked(prisma.post.count).mockResolvedValue(5)

    const result = await searchPosts('post', 2, 2)

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'post' } },
          { tags: { some: { name: { contains: 'post' } } } },
          { excerpt: { contains: 'post' } },
        ],
      },
      include: { tags: true },
      orderBy: { publishedAt: 'desc' },
      skip: 2,
      take: 2,
    })
    expect(result).toEqual({
      posts: mockPosts,
      total: 5,
    })
  })
})