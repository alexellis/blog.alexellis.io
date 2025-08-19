import { visit } from 'unist-util-visit';
import { Element, Root } from 'hast';

/**
 * Rehype plugin to prevent automatic image preloading for non-hero images
 */
export function rehypeControlImageLoading() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img') {
        const properties = node.properties || {};
        
        // Check if this is likely a hero/feature image
        const className = properties.className as string[] | string | undefined;
        const classStr = Array.isArray(className) ? className.join(' ') : className || '';
        
        // Consider an image a "hero" if it has certain classes or is the first image
        const isHeroImage = classStr.includes('kg-image') || 
                           classStr.includes('feature-image') ||
                           classStr.includes('hero-image');
        
        // Set loading and fetchpriority attributes
        if (!isHeroImage) {
          properties.loading = 'lazy';
          properties.fetchpriority = 'low';
        } else {
          properties.loading = 'eager';
          properties.fetchpriority = 'high';
        }
        
        // Prevent automatic preload by removing any preload hints
        if (properties.preload) {
          delete properties.preload;
        }
        
        node.properties = properties;
      }
    });
  };
}