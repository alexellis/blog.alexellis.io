import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  meta_title?: string;
  meta_description?: string;
  draft?: boolean;
  featured?: boolean;
  feature_image?: string;
  tags?: string[];
}

export interface Post extends PostMeta {
  content: string;
  excerpt: string;
  filePath: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove date prefix and .md extension to get clean slug
      const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const excerpt = content
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .substring(0, 150)
        .trim() + '...';

      return {
        content,  // Keep raw markdown content
        excerpt,
        ...(data as PostMeta),
        slug,
        filePath: fullPath,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return allPostsData;
}

export function getAllPostsIncludingDrafts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove date prefix and .md extension to get clean slug
      const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const excerpt = content
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .substring(0, 150)
        .trim() + '...';

      return {
        content,  // Keep raw markdown content
        excerpt,
        ...(data as PostMeta),
        slug,
        filePath: fullPath,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return allPostsData;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    // Find file that ends with the slug (handles date prefixes)
    const files = fs.readdirSync(postsDirectory);
    const fileName = files.find(file => {
      const fileSlug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      return fileSlug === realSlug;
    });
    
    if (!fileName) return null;
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const excerpt = content
      .replace(/^#+\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .substring(0, 150)
      .trim() + '...';

    return {
      content,
      excerpt,
      ...(data as PostMeta),
      slug: realSlug,
      filePath: fullPath,
    };
  } catch (error) {
    console.warn(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Markdown processing function
export async function processMarkdownContent(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight, {
      // Detect language automatically if not specified
      detect: true,
      // Ignore unknown languages instead of throwing errors
      ignoreMissing: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
}

// Helper function to get absolute image URLs
export function getAbsoluteImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.alexellis.io';
  return `${siteUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}

// Helper function to convert tag to URL-friendly slug
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Get paginated posts
export function getPaginatedPosts(page: number = 1, postsPerPage: number = 5) {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// Get all unique tags
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet).sort();
}

// Get posts by tag
export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.tags && post.tags.some(postTag => 
      tagToSlug(postTag) === tagToSlug(tag)
    )
  );
}
