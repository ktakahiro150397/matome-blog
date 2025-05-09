import Link from 'next/link';
import { TagWithCount, tagToSlug } from '@/lib/tags';
import { cn } from '@/lib/utils';

interface TagListProps {
  tags: string[];
  className?: string;
}

/**
 * Component to display a list of tags for a post
 */
export function TagList({ tags, className }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tagToSlug(tag)}`}
          className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}

interface TagCloudProps {
  tags: TagWithCount[];
  className?: string;
  limit?: number;
}

/**
 * Component to display a tag cloud with tag sizes relative to post count
 */
export function TagCloud({ tags, className, limit }: TagCloudProps) {
  // Sort tags by count and apply limit if specified
  const displayTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  if (displayTags.length === 0) return null;
  
  // Find max count for relative sizing
  const maxCount = Math.max(...displayTags.map(tag => tag.count));
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tags/${tag.slug}`}
          className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          style={{
            fontSize: `${Math.max(0.75, Math.min(1.5, 0.75 + (tag.count / maxCount) * 0.75))}rem`,
            fontWeight: tag.count > maxCount / 2 ? 600 : 400,
          }}
        >
          {tag.name}
          <span className="ml-1 text-xs text-muted-foreground">({tag.count})</span>
        </Link>
      ))}
    </div>
  );
}