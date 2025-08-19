import Link from 'next/link';
import MenuComponent from '@/components/MenuComponent';
import { SITE_NAME, SITE_URL, AUTHOR_NAME, AUTHOR_URL } from '@/lib/config';
import { getAllPosts } from '@/lib/posts';

export async function generateMetadata() {
  return {
    title: `${AUTHOR_NAME} - ${SITE_NAME}`,
    description: `Author profile for ${AUTHOR_NAME}. Read all posts by ${AUTHOR_NAME} on topics including OSS, Cloud Native & Raspberry Pi.`,
    openGraph: {
      title: `${AUTHOR_NAME} - ${SITE_NAME}`,
      description: `Author profile for ${AUTHOR_NAME}. Read all posts by ${AUTHOR_NAME} on topics including OSS, Cloud Native & Raspberry Pi.`,
      url: `${SITE_URL}/author/alex/`,
      siteName: SITE_NAME,
      type: 'profile',
      images: [
        {
          url: '//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x',
          width: 250,
          height: 250,
          alt: `${AUTHOR_NAME}'s Profile Picture`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      site: '@alexellisuk',
      creator: '@alexellisuk',
      title: `${AUTHOR_NAME} - ${SITE_NAME}`,
      description: `Author profile for ${AUTHOR_NAME}. Read all posts by ${AUTHOR_NAME} on topics including OSS, Cloud Native & Raspberry Pi.`,
      images: ['//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x'],
    },
    alternates: {
      canonical: `${SITE_URL}/author/alex/`,
    },
  };
}

export default function AuthorPage() {
  // Get the actual post count at build time
  const posts = getAllPosts();
  const postCount = posts.length;
  return (
    <div className="author-template nav-closed" style={{
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
            "@type": "Person",
            "name": AUTHOR_NAME,
            "url": AUTHOR_URL,
            "image": {
              "@type": "ImageObject",
              "url": "//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x",
              "width": 250,
              "height": 250
            },
            "sameAs": [
              "https://twitter.com/alexellisuk",
              "https://github.com/alexellis",
              "https://www.linkedin.com/in/alexellisuk/"
            ],
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${SITE_URL}/author/alex/`
            }
          })
        }}
      />

      {/* Navigation backdrop */}
      <div className="nav-backdrop" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99998,
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease'
      }}></div>

      <MenuComponent />

      <div className="site-wrapper" style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100%',
        background: '#fff'
      }}>
        {/* Header */}
        <header className="main-header author-head no-cover" style={{
          position: 'relative',
          display: 'table',
          width: '100%',
          height: '40vh',
          maxHeight: '30rem',
          textAlign: 'center',
          background: '#f5f8fa no-repeat center center',
          backgroundSize: 'cover'
        }}>
          <nav className="main-nav overlay clearfix" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            border: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.0) 100%)',
            padding: '35px 40px',
            zIndex: 100
          }}>
            <a className="menu-button icon-menu" href="#" style={{
              textDecoration: 'none'
            }}>
              <span className="word">Menu</span>
            </a>
          </nav>

          <div className="vertical" style={{
            display: 'table-cell',
            verticalAlign: 'middle'
          }}>
            <div className="main-header-content inner" style={{
              position: 'relative',
              width: '80%',
              maxWidth: '710px',
              margin: '4rem auto'
            }}>
              {/* Author Image */}
              <figure className="author-image" style={{
                margin: '0 auto 2rem auto',
                width: '150px',
                height: '150px',
                borderRadius: '100%',
                overflow: 'hidden',
                background: '#fff',
                border: '5px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src="//www.gravatar.com/avatar/666e00e7ae920ab0996688e91cd5a0c8?s=250&d=mm&r=x"
                  alt={`${AUTHOR_NAME}'s Picture`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="eager"
                  fetchPriority="high"
                />
              </figure>

              {/* Author Name */}
              <h1 className="author-title" style={{
                textAlign: 'center',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '4rem',
                letterSpacing: '-1px',
                color: '#2E2E2E',
                fontWeight: 700,
                textShadow: 'none',
                margin: '0 0 1rem 0'
              }}>
                {AUTHOR_NAME}
              </h1>

              {/* Author Website */}
              <p className="author-bio" style={{
                margin: '0 0 1rem 0',
                color: '#57708A',
                fontSize: '1.8rem',
                lineHeight: '1.3em',
                fontWeight: 400,
                textAlign: 'center',
                fontFamily: '"Merriweather", serif'
              }}>
                <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" style={{
                  color: '#57708A',
                  textDecoration: 'none',
                  borderBottom: '1px solid #57708A'
                }}>
                  {AUTHOR_URL.replace('https://', '')}
                </a>
              </p>

              {/* Post Count and Link */}
              <p className="author-meta" style={{
                margin: '1rem 0 0 0',
                color: '#9EABB3',
                fontSize: '1.4rem',
                lineHeight: '1.3em',
                textAlign: 'center',
                fontFamily: '"Open Sans", sans-serif'
              }}>
                {postCount} posts • <Link href="/" style={{
                  color: '#9EABB3',
                  textDecoration: 'none',
                  borderBottom: '1px solid #9EABB3'
                }}>
                  View articles by {AUTHOR_NAME}
                </Link>
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="content" role="main">
          <div className="main-content" style={{
            position: 'relative',
            margin: '0 auto',
            padding: '0 4rem',
            maxWidth: '900px'
          }}>
            <section className="author-profile" style={{
              margin: '4rem 0',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.6rem',
                lineHeight: '1.6em',
                color: '#3A4145',
                margin: '0 0 2rem 0'
              }}>
                Welcome to my blog where I write about Open Source Software, Cloud Native technologies, and Raspberry Pi projects. 
                I&apos;m the founder of OpenFaaS and work on making serverless and cloud native technologies more accessible.
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '3rem'
              }}>
                <Link 
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    background: '#3eb0ef',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '3px',
                    fontSize: '1.4rem',
                    fontFamily: '"Open Sans", sans-serif',
                    fontWeight: 600,
                    transition: 'background 0.3s ease'
                  }}
                >
                  View All Posts
                </Link>
                
                <a 
                  href={AUTHOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#3eb0ef',
                    textDecoration: 'none',
                    border: '1px solid #3eb0ef',
                    borderRadius: '3px',
                    fontSize: '1.4rem',
                    fontFamily: '"Open Sans", sans-serif',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Visit Homepage
                </a>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
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
            <Link href="/" style={{
              color: '#BBC7CC',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              {SITE_NAME}
            </Link> © 2025
          </section>
        </footer>
      </div>
    </div>
  );
}