# Alex Ellis' Blog - Next.js Version

A static blog built with Next.js, Tailwind CSS, and MDX, designed to match the original Ghost blog design and functionality.

## Features

- 📝 **MDX Support** - Write posts in Markdown with React components
- 🎨 **Tailwind CSS** - Utility-first CSS framework for styling
- 📱 **Responsive Design** - Mobile-first design that matches the original
- 🔗 **URL Preservation** - Same slug structure as the original Ghost blog
- 📊 **Pagination** - Handles large numbers of posts with pagination
- 🚀 **Static Generation** - Exports as static files for CDN deployment
- 🔍 **SEO Optimized** - Proper meta tags and structured data

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the blog.

### Production Build

```bash
# Build static site
npm run build

# The built site is in the 'out' directory
```

### Deployment

The site exports as static HTML/CSS/JS files that can be deployed to any CDN or static hosting service.

## Adding New Posts

1. Create a new `.mdx` file in the `posts/` directory
2. Use the date prefix format: `YYYY-MM-DD-slug.mdx`
3. Include proper front matter:

```yaml
---
title: "Your Post Title"
slug: "your-post-slug"
date: "2025-08-15T12:00:00Z"
author: "Alex Ellis"
meta_title: "SEO Title"
meta_description: "SEO Description"
status: "published"
visibility: "public"
featured: false
---

Your markdown content here...
```

## Project Structure

```
blog-site/
├── src/
│   ├── app/
│   │   ├── [slug]/          # Dynamic post pages
│   │   ├── page.tsx         # Home page with post list
│   │   └── layout.tsx       # Root layout
│   └── lib/
│       └── posts.ts         # Post loading utilities
├── posts/                   # MDX blog posts
├── public/                  # Static assets
└── out/                     # Built static site (after build)
```

## Converting Ghost Posts

Use the `ghost1-2mdx` tool in the parent directory to convert Ghost 1.x export data:

```bash
# Convert single post
../ghost1-2mdx/ghost1-2mdx -posts ../posts.json -users ../users.json -slug your-post-slug

# Convert all posts
../ghost1-2mdx/ghost1-2mdx -posts ../posts.json -users ../users.json -all

# Copy converted posts
cp ../output/*.mdx posts/
```

## Design Matching

The site is designed to closely match the original Ghost blog:

- Same typography and color scheme
- Matching navigation structure
- Identical post layout and styling
- Preserved author information and dates
- Similar pagination design

## Technical Details

- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS v3** for styling
- **MDX** for content processing
- **Gray Matter** for front matter parsing
- **Static Export** for CDN deployment

## Known Issues

- HTML embeds (like Twitter cards) in posts need manual conversion
- Images need to be manually placed in the public directory
- Some advanced Ghost features are not implemented (tags, multiple authors)

## Customization

The design closely matches the original but can be customized by editing:

- `src/app/globals.css` - Global styles
- `tailwind.config.js` - Tailwind configuration
- `src/app/page.tsx` - Home page layout
- `src/app/[slug]/page.tsx` - Post page layout

---

*This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).*
