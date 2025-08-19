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
          color: '#BBC7CC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <section className="copyright" style={{
            display: 'block'
          }}>
            <span style={{
              color: '#3A4145',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>Alex Ellis&apos; Blog</span> <span style={{ color: '#57708A' }}>© 2025</span>
          </section>
          <section className="poweredby" style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <a href="https://github.com/alexellis" target="_blank" rel="noopener noreferrer" style={{
              color: '#57708A',
              textDecoration: 'none',
              marginLeft: '1rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
            <a href="https://x.com/alexellisuk" target="_blank" rel="noopener noreferrer" style={{
              color: '#57708A',
              textDecoration: 'none',
              marginLeft: '1rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </a>
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