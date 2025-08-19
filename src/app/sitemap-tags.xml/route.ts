import { getAllTags, tagToSlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  const tags = getAllTags();

  const tagsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tags.map(tag => {
  const tagSlug = tagToSlug(tag);
  return `  <url>
    <loc>${SITE_URL}/tag/${tagSlug}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(tagsXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
