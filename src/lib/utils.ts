import { SITE_URL } from './config';

// Helper function to convert tag names to URL slugs
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

// Helper function to get absolute URL for images (for meta tags and backgrounds)
export function getAbsoluteImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return SITE_URL + imagePath;
}