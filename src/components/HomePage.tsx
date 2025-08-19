'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { tagToSlug } from '@/lib/utils';
import Pagination from '@/components/Pagination';

interface Post {
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  featured?: boolean;
  feature_image?: string;
  tags?: string[];
}

interface HomePageProps {
  posts: Post[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  currentPage?: number;
  tagName?: string;
}

export default function HomePage({ posts, totalPages, hasNextPage, hasPrevPage = false, currentPage = 1, tagName }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Re-attach event handlers after hydration and handle DOM manipulation
  useEffect(() => {
   
    const handleMenuClick = (e: Event) => {
      e.preventDefault();
      setIsMenuOpen(prev => {
        const newState = !prev;
        return newState;
      });
    };

    const menuButton = document.querySelector('.menu-button');
    const closeButton = document.querySelector('.nav-close-button');
    const backdrop = document.querySelector('.nav-backdrop');

    if (menuButton) {
      menuButton.addEventListener('click', handleMenuClick);
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', handleMenuClick);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', handleMenuClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener('click', handleMenuClick);
      }
      if (closeButton) {
        closeButton.removeEventListener('click', handleMenuClick);
      }
      if (backdrop) {
        backdrop.removeEventListener('click', handleMenuClick);
      }
    };
  }, []);

  // Direct DOM manipulation for static exports - CLASS TOGGLE ONLY
  useEffect(() => {
    
    const navElement = document.querySelector('.nav') as HTMLElement;
    
    if (navElement) {
      if (isMenuOpen) {
        navElement.classList.add('nav-visible');
        // Also force z-index to be sure it's on top
        navElement.style.zIndex = '99999';
      } else {

        navElement.classList.remove('nav-visible');
      }
    }
  }, [isMenuOpen]);


  return (
    <div className={`home-template ${isMenuOpen ? 'nav-opened' : 'nav-closed'}`} style={{
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
            "@type": "WebSite",
            "publisher": {
              "@type": "Organization",
              "name": "Alex Ellis' Blog",
              "logo": {
                "@type": "ImageObject",
                "url": "https://blog.alexellis.io/favicon.ico",
                "width": 60,
                "height": 60
              }
            },
            "url": "https://blog.alexellis.io/",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://blog.alexellis.io/"
            },
            "description": "OSS, Cloud Native & Raspberry Pi"
          })
        }}
      />

      {/* Navigation backdrop - Always present for static exports */}
      <div 
        className="nav-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99998,
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
      />

      {/* Navigation overlay */}
      <div className="nav">
        <button 
          className="nav-close-button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ×
        </button>
        <h3 className="nav-title" style={{
          position: 'absolute',
          top: '45px',
          left: '30px',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '1.6rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#fff',
          margin: 0
        }}>Menu</h3>
        <ul style={{ 
          padding: '90px 9% 5%', 
          listStyle: 'none',
          margin: 0
        }}>
          <li style={{ marginBottom: '2rem' }}>
            <Link href="/" className="nav-link">Home</Link>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://alexellis.io" target="_blank" rel="noopener noreferrer" className="nav-link">About me</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://github.com/alexellis/" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://twitter.com/alexellisuk" target="_blank" rel="noopener noreferrer" className="nav-link">Twitter</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://www.linkedin.com/in/alexellisuk/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
          </li>
          <li style={{ marginBottom: '3rem' }}>
            <h4 style={{
              color: '#fff',
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '1.2rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 1rem 0'
            }}>eBooks</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/everyday-golang" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Everyday Go</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/serverless-for-everyone-else" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Serverless for Everyone Else</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/netbooting-raspberrypi?layout=profile" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Netboot the Raspberry Pi</a>
              </li>
            </ul>
          </li>

        </ul>
      </div>

      <div className="site-wrapper" style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100%',
        background: '#fff'
      }}>
        
        {/* Header with menu button */}
        <header className="main-header home-header no-cover" style={{
          position: 'relative',
          display: 'table',
          width: '100%',
          height: '40vh',
          maxHeight: '28rem',
          textAlign: 'center',
          background: '#f5f8fa no-repeat center center',
          backgroundSize: 'cover'
        }}>
          <nav className="main-nav clearfix" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            border: 'none',
            padding: '35px 40px'
          }}>
            <button 
              className="menu-button icon-menu"
              style={{
                display: 'inline-block',
                float: 'right',
                height: '38px',
                padding: '8px 15px',
                borderStyle: 'solid',
                borderWidth: '1px',
                opacity: 1,
                textAlign: 'center',
                fontSize: '12px',
                textTransform: 'uppercase',
                lineHeight: '22px',
                borderRadius: '3px',
                borderColor: '#3A4145',
                color: '#3A4145',
                fontFamily: '"Open Sans", sans-serif',
                background: 'transparent',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <span className="word">Menu</span>
              <div className="hamburger-icon">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </div>
            </button>
          </nav>
          
          <div className="vertical" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
            <div className="main-header-content inner" style={{
              position: 'relative',
              width: '80%',
              maxWidth: '710px',
              margin: '0 auto',
              padding: '4rem 0 2rem 0'
            }}>
              <h1 className="page-title" style={{
                textAlign: 'center',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '4.2rem',
                letterSpacing: '-1.5px',
                color: '#3A4145',
                fontWeight: 700,
                textShadow: 'none',
                margin: '0 0 0.4em 0'
              }}>
                {tagName ? tagName : "Alex Ellis' Blog"}
              </h1>
              <h2 className="page-description" style={{
                margin: tagName ? '1.6rem 0 0 0' : '1rem 0 0 0',
                color: '#57708A',
                fontSize: '2rem',
                lineHeight: '1.3em',
                fontWeight: 400,
                letterSpacing: '0.01rem',
                textAlign: 'center',
                fontFamily: '"Merriweather", serif'
              }}>
                {tagName ? `A ${posts.length}-post collection` : "Cloud Native & Open Source"}
              </h2>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="content" className="content" role="main">
          <div className="main-content" style={{
            position: 'relative',
            margin: '0 auto',
            padding: '0 4rem',
            maxWidth: '900px'
          }}>
            {/* Top pagination - only show on pages 2+ */}
            {currentPage > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            )}
            
            {posts.map((post, index) => (
              <article 
                key={post.slug} 
                className={`post ${index === 0 ? ' first' : ' '}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  margin: '4rem auto',
                  paddingBottom: '4rem',
                  borderBottom: '#EBF2F6 1px solid',
                  wordWrap: 'break-word'
                }}
              >
                <header className="post-header">
                  <h2 className="post-title" style={{
                    margin: '0 0 0.4em 0',
                    fontSize: '3.6rem',
                    lineHeight: '1.15em',
                    fontFamily: '"Open Sans", sans-serif',
                    letterSpacing: '-1px',
                    textIndent: '-2px',
                    color: '#2E2E2E'
                  }}>
                    <Link href={`/${post.slug}/`} style={{
                      textDecoration: 'none',
                      color: '#2E2E2E'
                    }}>{post.title}</Link>
                  </h2>
                </header>
                <section className="post-excerpt" style={{
                  margin: '1.6rem 0 0 0',
                  lineHeight: '1.6em'
                }}>
                  <p style={{ margin: '1.6rem 0 0 0', fontSize: '1.6rem' }}>
                    {post.excerpt}
                  </p>
                </section>
                <footer className="post-meta" style={{
                  display: 'block',
                  margin: '1.75rem 0 0 0',
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '1.5rem',
                  lineHeight: '2.2rem',
                  color: '#9EABB3'
                }}>
                  <time className="post-date" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }).toUpperCase()}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span> on </span>
                       {post.tags.slice(0, 3).map((tag, index) => (
                         <span key={tag}>
                           {index > 0 ? ', ' : ''}
                           <Link href={`/tag/${tagToSlug(tag)}/`} style={{ color: '#9EABB3', textDecoration: 'none' }}>
                             {tag.toUpperCase()}
                           </Link>
                         </span>
                       ))}
                      {post.tags.length > 3 && <span>, ...</span>}
                    </>
                  )}
                </footer>
              </article>
            ))}

            {/* Bottom pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
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
      </div>
    </div>
  );
}