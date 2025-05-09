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
│   ├── mdx/         # MDX processing
│   └── tags/        # タグ関連ユーティリティ
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
    Meta --> Tags[Tag System]
    Tags --> TagPages[Tag Pages]
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
    Main --> TagPages[Tag Pages]
    
    BlogList --> Card[Blog Card]
    BlogPost --> TOC[Table of Contents]
    BlogPost --> RelatedPosts[Related Posts]
    BlogPost --> TagList[Tag List]
    
    TagPages --> TagCloud[Tag Cloud]
    TagPages --> BlogList
```

### Tag System Architecture
```mermaid
flowchart TD
    TagUtils[Tag Utilities] --> GetAllTags[getAllTags]
    TagUtils --> GetPostsByTag[getPostsByTag]
    TagUtils --> FindTagBySlug[findTagBySlug]
    TagUtils --> TagToSlug[tagToSlug]
    
    GetAllTags --> TagCloud[TagCloud Component]
    GetPostsByTag --> TagDetailPage[Tag Detail Page]
    FindTagBySlug --> TagDetailPage
    TagToSlug --> TagLinks[Tag Links]
    
    TagCloud --> TagsPage[Tags Page]
    TagDetailPage --> FilteredPosts[Filtered Posts]
```

### Data Flow
```mermaid
flowchart LR
    MDX --> Static[Static Generation]
    Static --> Pages[Pages]
    MDX --> Meta[Metadata]
    Meta --> Search[Search Index]
    Search --> Client[Client-side Search]
    Meta --> Tags[Tag Metadata]
    Tags --> TagSystem[Tag System]
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
- Tag list component

### UI Patterns
- Responsive layout system
- Theme switching
- Loading states
- Error boundaries
- Navigation patterns
- Tag visualization patterns

### Data Management
- MDX content handling
- Metadata extraction
- Search indexing
- Content synchronization
- Database migrations
- Tag extraction and normalization