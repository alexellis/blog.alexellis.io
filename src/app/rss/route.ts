import { getAllPosts, Post } from '@/lib/posts'
import { RSS_FEED_LIMIT, SITE_URL } from '@/lib/config'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

// Force this route to use Node.js runtime for file system access
export const runtime = 'nodejs'
// Configure for static export
export const dynamic = 'force-static'

async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  
  return result.toString()
}

async function generateRssItem(post: Post) {
  const categories = post.tags ? post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') : ''
  const featureImage = post.feature_image ? `<media:content url="${post.feature_image}" medium="image"/>` : ''
  
  // Use meta_description from frontmatter if available, otherwise use generated excerpt
  const description = post.meta_description || post.excerpt
  
  // Convert markdown content to HTML
  const htmlContent = await convertMarkdownToHtml(post.content)
  
  return `<item><title><![CDATA[${post.title}]]></title><description><![CDATA[${description}]]></description><link>${SITE_URL}/${post.slug}/</link><guid isPermaLink="false">${post.slug}</guid>${categories}<dc:creator><![CDATA[${post.author}]]></dc:creator><pubDate>${new Date(post.date).toUTCString()}</pubDate>${featureImage}<content:encoded><![CDATA[${htmlContent}]]></content:encoded></item>`
}

async function generateRss(posts: Post[]) {
  const items = await Promise.all(posts.map(generateRssItem))
  return `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title><![CDATA[Alex Ellis' Blog]]></title><description><![CDATA[OSS, Cloud Native & Raspberry Pi]]></description><link>${SITE_URL}/</link><image><url>${SITE_URL}/favicon.png</url><title>Alex Ellis&apos; Blog</title><link>${SITE_URL}/</link></image><generator>Next.js</generator><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><atom:link href="${SITE_URL}/rss/" rel="self" type="application/rss+xml"/><ttl>60</ttl>${items.join('')}</channel></rss>`
}

export async function GET() {
  const allPosts = getAllPosts()
  // Limit to the most recent RSS_FEED_LIMIT posts
  const recentPosts = allPosts.slice(0, RSS_FEED_LIMIT)
  const rss = await generateRss(recentPosts)

  return new Response(rss, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  })
}
