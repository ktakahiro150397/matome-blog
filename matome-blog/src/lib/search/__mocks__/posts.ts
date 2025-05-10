export const mockPost = (id: string) => ({
  id,
  title: `Post ${id}`,
  slug: `post-${id}`,
  content: `Content ${id}`,
  excerpt: `Excerpt ${id}`,
  videoId: `video${id}`,
  videoUrl: `https://youtube.com/video${id}`,
  publishedAt: new Date('2025-05-09'),
  updatedAt: new Date('2025-05-09'),
});

export const mockTag = (id: string, name: string) => ({
  id,
  name,
  slug: name.toLowerCase(),
});

export const mockPosts = {
  empty: [],
  latest: [
    {
      ...mockPost('1'),
      title: 'First Post',
      tags: [mockTag('1', 'nextjs')]
    },
    {
      ...mockPost('2'),
      title: 'Second Post',
      tags: [mockTag('2', 'react')]
    }
  ],
  react: [
    {
      ...mockPost('1'),
      title: 'React Hooks Tutorial',
      tags: [mockTag('1', 'react')]
    }
  ],
  nextjs: [
    {
      ...mockPost('1'),
      title: 'First Post',
      tags: [mockTag('1', 'nextjs')]
    },
    {
      ...mockPost('2'),
      title: 'Second Post',
      tags: [mockTag('2', 'nextjs')]
    }
  ],
  paginated: [
    {
      ...mockPost('3'),
      title: 'Third Post',
      tags: []
    }
  ]
};