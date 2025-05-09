# Technical Context

## Tech Stack
- Framework: Next.js (App Router)
- UI: shadcn/ui
- Content: MDX
- Search: SQLite + Prisma (for metadata indexing)
- Styling: Tailwind CSS
- Theming: next-themes

## Development Environment
- Version Control: Git
- Hosting: Vercel
- Node.js environment

## Architecture Decisions

### Content Management
- MDX files for content storage
  - Pros: Version control, easy deployment, content/code separation
  - Implementation: Store in `/content` directory
  - Frontmatter for metadata

### Search Implementation
- SQLite + Prisma for metadata indexing
  - Stores: title, description, tags, YouTube IDs, dates
  - Built at compile time
  - Enables efficient client-side search

### UI/UX
- shadcn/ui components for consistent design
- Dark/Light theme support via next-themes
- Responsive design principles
- Accessibility first approach

## Performance Considerations
- Static Generation (SSG) for content pages
- Dynamic route generation from MDX
- Optimized image loading for thumbnails
- Client-side search with pre-built index

## SEO Strategy
- Static metadata
- Dynamic OG images
- Structured data for articles
- Sitemap generation
- Robots.txt configuration