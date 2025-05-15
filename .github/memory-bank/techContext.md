# Technical Context

## Tech Stack
- Framework: Next.js 15.3.2 (App Router)
- UI: shadcn/ui + Tailwind CSS
- Content: MDX
- Database: SQLite + Prisma (for metadata indexing)
- Theming: next-themes
- Other Libraries:
  - clsx + tailwind-merge (class utilities)
  - rehype-* (MDX processing)
  - lucide-react (icons)

## Development Environment
- Version Control: Git
- Node.js: v18+
- Package Manager: npm
- Development Server: Next.js + Turbopack
- Database: SQLite (開発環境)
- IDE: Visual Studio Code

## Architecture Decisions

### Content Management
- MDX files for content storage
  - Pros: Version control, easy deployment, content/code separation
  - Implementation: Store in `/content` directory
  - Frontmatter for metadata
  - Custom MDX components for enhanced functionality

### Search Implementation
- SQLite + Prisma for metadata indexing
  - Stores: title, description, tags, YouTube IDs, dates, reading time
  - Built at compile time
  - Enables efficient client-side search
  - Content sync script for database updates
  - Reading time calculation based on character count

### UI/UX
- shadcn/ui components for consistent design
- Dark/Light theme support via next-themes
- Responsive design principles
- Accessibility first approach
- Client/Server Component separation

## Performance Considerations
- Static Generation (SSG) for content pages
- Dynamic route generation from MDX
- Optimized image loading for thumbnails
- Client-side search with pre-built index
- Component code splitting
- Route-based code splitting

## SEO Strategy
- Static metadata
- Dynamic OG images
- Structured data for articles
- Sitemap generation
- Robots.txt configuration
- RSS feed
- Performance optimization

## Dependencies Management
### Core Dependencies
- next: 15.3.2
- react: ^19.0.0
- react-dom: ^19.0.0
- prisma: ^6.7.0
- @mdx-js/react: ^3.1.0
- next-mdx-remote: ^5.0.0
- next-themes: ^0.4.6

### UI Dependencies
- shadcn/ui components
- tailwindcss: ^4
- tailwindcss-animate: ^1.0.7
- lucide-react: ^0.508.0

### Development Dependencies
- typescript: ^5
- eslint: ^9
- @eslint/eslintrc: ^3
- @tailwindcss/postcss: ^4
- @tailwindcss/typography: ^0.5.16