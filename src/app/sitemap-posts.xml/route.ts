import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();

  const postsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts.map(post => {
  const lastmod = new Date(post.date).toISOString();
  const imageTag = post.feature_image ? `
    <image:image>
      <image:loc>${post.feature_image.startsWith('http') ? post.feature_image : `${SITE_URL}${post.feature_image}`}</image:loc>
      <image:caption>${post.title}</image:caption>
    </image:image>` : '';
  
  return `  <url>
    <loc>${SITE_URL}/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(postsXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
}
