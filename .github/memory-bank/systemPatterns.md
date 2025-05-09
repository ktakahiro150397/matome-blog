# System Patterns

## Directory Structure
```
/
├── app/               # Next.js app router pages
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components
│   └── blog/         # Blog specific components
├── content/          # MDX blog posts
├── lib/              # Utility functions
│   ├── db/          # Database related code
│   └── mdx/         # MDX processing
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── scripts/         # Utility scripts
```

## Core Patterns

### Content Management
```mermaid
flowchart TD
    MDX[MDX Files] --> Parser[MDX Parser]
    Parser --> Meta[Metadata Extraction]
    Meta --> DB[SQLite Database]
    Meta --> Pages[Static Pages]
    DB --> Search[Search Index]
```

### Page Generation
- Static Site Generation (SSG) for all content pages
- Dynamic metadata generation
- Incremental Static Regeneration for content updates

### Component Architecture
```mermaid
flowchart TD
    Layout[Layout] --> Header[Header]
    Layout --> Main[Main Content]
    Layout --> Footer[Footer]
    
    Main --> BlogList[Blog List]
    Main --> BlogPost[Blog Post]
    Main --> Search[Search Component]
    
    BlogList --> Card[Blog Card]
    BlogPost --> TOC[Table of Contents]
    BlogPost --> RelatedPosts[Related Posts]
```

### Data Flow
```mermaid
flowchart LR
    MDX --> Static[Static Generation]
    Static --> Pages[Pages]
    MDX --> Meta[Metadata]
    Meta --> Search[Search Index]
    Search --> Client[Client-side Search]
```

## Reusable Patterns

### SEO Components
- Metadata component for consistent SEO
- OG Image generation
- Structured data injection
- Sitemap generation
- RSS feed generation

### Content Components
- YouTube video embed
- Code syntax highlighting
- Table of contents generation
- Related posts suggestion
- Tag cloud component

### UI Patterns
- Responsive layout system
- Theme switching
- Loading states
- Error boundaries
- Navigation patterns

### Data Management
- MDX content handling
- Metadata extraction
- Search indexing
- Content synchronization
- Database migrations