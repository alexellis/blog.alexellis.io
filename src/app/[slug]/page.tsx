import { getPostBySlug, getAllPostsIncludingDrafts, processMarkdownContent, tagToSlug, getAbsoluteImageUrl } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MenuComponent from '@/components/MenuComponent';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, TWITTER_HANDLE, AUTHOR_URL } from '@/lib/config';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = getAllPostsIncludingDrafts();
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    
    console.log('Building static params for all posts:', params.length);
    
    return params;
  } catch (error) {
    console.warn('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Page Not Found',
        description: 'The page you were looking for could not be found.',
      };
    }

    const imageUrl = getAbsoluteImageUrl(post.feature_image || '');

    return {
      title: post.title,
      description: post.meta_description,
      alternates: {
        canonical: `${SITE_URL}/${post.slug}/`,
      },
      openGraph: {
        siteName: SITE_NAME,
        type: 'article',
        title: post.title,
        description: post.meta_description,
        url: `${SITE_URL}/${post.slug}/`,
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: [AUTHOR_NAME],
        tags: post.tags || [],
        ...(imageUrl && { images: [imageUrl] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.meta_description,
        site: TWITTER_HANDLE,
        ...(imageUrl && { images: [imageUrl] }),
      },
      other: {
        'HandheldFriendly': 'True',
        'referrer': 'no-referrer-when-downgrade',
        'article:published_time': post.date,
        'article:modified_time': post.date,
        'twitter:label1': 'Written by',
        'twitter:data1': AUTHOR_NAME,
        'twitter:label2': 'Filed under',
        'twitter:data2': post.tags?.join(', ') || '',
        ...(post.tags && post.tags.length > 0 && {
          'article:tag': post.tags,
        }),
      }
    };
  } catch (error) {
    console.warn('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
      description: 'The page you were looking for could not be found.',
    };
  }
}

export default async function Post({ params }: Props) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const imageUrl = getAbsoluteImageUrl(post.feature_image || '');
    const hasFeatureImage = imageUrl && post.feature_image;
    
    // Process markdown content
    const processedContent = await processMarkdownContent(post.content);

  return (
    <div className="post-template nav-closed" style={{
      fontFamily: '"Merriweather", serif',
      fontSize: '1.8rem',
      lineHeight: '1.75em',
      color: '#3A4145',
      margin: 0,
      minHeight: '100vh'
    }}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME,
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/favicon.ico`,
                "width": 60,
                "height": 60
              }
            },
            "author": {
              "@type": "Person",
              "name": AUTHOR_NAME,
              "image": {
                "@type": "ImageObject",
                "url": "//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x",
                "width": 250,
                "height": 250
              },
              "url": `${SITE_URL}/author/alex/`,
              "sameAs": [
                AUTHOR_URL
              ]
            },
            "headline": post.title,
            "url": `${SITE_URL}/${post.slug}/`,
            "datePublished": post.date,
            "dateModified": post.date,
            "keywords": post.tags?.join(', ') || '',
            "description": post.meta_description,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": SITE_URL
            }
          })
        }}
      />
      {/* Menu Component */}
      <MenuComponent />
      
      <div className="site-wrapper" style={{ 
        position: 'relative', 
        zIndex: 10, 
        minHeight: '100%', 
        background: '#fff' 
      }}>
        
        {/* Header with menu button */}
        <header className={`main-header post-head ${hasFeatureImage ? '' : 'no-cover'}`} style={{
          ...(hasFeatureImage && { backgroundImage: `url(${imageUrl})` })
        }}>
          <nav className={`main-nav ${hasFeatureImage ? 'overlay' : ''} clearfix`} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            border: 'none',
            padding: '35px 40px',
            zIndex: 100
          }}>
            <a className="menu-button icon-menu" href="#" style={{
              textDecoration: 'none'
            }}>
              <span className="word">Menu</span>
              <div className="hamburger-icon">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </div>
            </a>
          </nav>
        </header>

        <main className="content" role="main">
          <article className="post" style={{
            position: 'relative',
            width: '80%',
            maxWidth: '710px',
            margin: '4rem auto',
            paddingBottom: '4rem',
            borderBottom: '#EBF2F6 1px solid',
            wordWrap: 'break-word'
          }}>

            <header className="post-header" style={{ marginBottom: '3.4rem' }}>
              <h1 className="post-title" style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '5rem',
                letterSpacing: '-2px',
                textIndent: '-3px',
                color: '#2E2E2E',
                lineHeight: '1.15em',
                margin: '0 0 0.4em 0',
                marginBottom: 0
              }}>
                {post.title}
              </h1>
              
              <section className="post-meta" style={{
                display: 'block',
                margin: '1.75rem 0 0 0',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '1.5rem',
                lineHeight: '2.2rem',
                color: '#9EABB3'
              }}>
                <time className="post-date" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }).toUpperCase()}
                </time>
                {post.tags && post.tags.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span>Tagged: </span>
                    {post.tags.map((tag: string, index: number) => (
                      <span key={tag}>
                        {index > 0 ? ', ' : ''}
                        <Link href={`/tag/${tagToSlug(tag)}/`} style={{ color: '#9EABB3', textDecoration: 'none' }}>
                          {tag}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}
              </section>
            </header>

            <section className="post-content">
              <div className="kg-card-markdown ghost-content">
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>
            </section>

            {/* Author section */}
            <section className="author-profile clearfix" style={{
              margin: '3rem 0 0 0',
              paddingTop: '3rem',
              borderTop: '#EBF2F6 1px solid'
            }}>
              <figure className="author-image" style={{
                margin: '0 3rem 0 0',
                float: 'left',
                width: '100px',
                height: '100px',
                borderRadius: '100%',
                overflow: 'hidden'
              }}>
                <Link 
                  className="img" 
                  href="/author/alex/" 
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                  }}
                >
                  <span className="hidden">Alex Ellis&apos;s Picture</span>
                </Link>
              </figure>

              <section className="author" style={{
                margin: '0',
                float: 'left'
              }}>
                <h4 style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '1.8rem',
                  margin: '0 0 0.3em 0',
                  color: '#2E2E2E',
                  fontWeight: 700
                }}>
                  <Link href="/author/alex/" style={{
                    color: '#2E2E2E',
                    textDecoration: 'none'
                  }}>Alex Ellis</Link>
                </h4>
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.3em',
                  color: '#50585D',
                  fontStyle: 'italic',
                  margin: '0 0 0.3em 0'
                }}>
                  Read <Link href="/author/alex/" style={{ color: '#50585D' }}>more posts</Link> by this author.
                </p>
                <div className="author-meta" style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.3em',
                  color: '#9EABB3'
                }}>
                  <span className="author-link icon-link">
                    <a href="https://www.alexellis.io/" style={{ color: '#9EABB3', textDecoration: 'none' }}>
                      https://www.alexellis.io/
                    </a>
                  </span>
                </div>
              </section>
            </section>

          </article>
        </main>

        <footer className="site-footer clearfix" style={{
          position: 'relative',
          margin: '8rem 0 0 0',
          padding: '1rem 15px',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '1rem',
          lineHeight: '1.75em',
          color: '#BBC7CC'
        }}>
          <section className="copyright" style={{ 
            display: 'block', 
            width: '45%', 
            float: 'left' 
          }}>
            <Link href="/" style={{ color: '#BBC7CC', textDecoration: 'none', fontWeight: 'bold' }}>
              Alex Ellis&apos; Blog
            </Link> © 2025
          </section>
        </footer>

        {/* Twitter embed script */}
        <script 
          async 
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />

      </div>
    </div>
  );
  } catch (error) {
    console.warn('Error rendering post:', error);
    notFound();
  }
}