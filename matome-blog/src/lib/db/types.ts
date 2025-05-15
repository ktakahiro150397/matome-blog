import { Post, Tag } from '@prisma/client';

export interface PostWithTags extends Post {
  tags: Tag[];
}

export interface PostWithReadingTime extends Post {
  readingTimeMinutes?: number | null;
  tags: Tag[];
}
