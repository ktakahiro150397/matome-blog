import { Post, Tag } from '@prisma/client';

export interface PostWithTags extends Post {
  tags: Tag[];
}
