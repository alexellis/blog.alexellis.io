import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-template nav-closed" style={{
      fontFamily: '"Merriweather", serif',
      fontSize: '1.8rem',
      lineHeight: '1.75em',
      color: '#3A4145',
      margin: 0,
      minHeight: '100vh'
    }}>
      {/* Navigation overlay */}
      <div className="nav" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        width: '240px',
        opacity: 0,
        background: '#111',
        marginBottom: 0,
        textAlign: 'left',
        overflowY: 'auto',
        transition: 'transform 0.5s ease, opacity 0.3s ease 0.7s',
        transform: 'translate3D(97px, 0, 0)'
      }}>
        <h3 className="nav-title" style={{
          position: 'absolute',
          top: '45px',
          left: '30px',
          fontSize: '16px',
          fontWeight: 100,
          textTransform: 'uppercase',
          color: '#fff'
        }}>Menu</h3>
        <ul style={{
          padding: '90px 9% 5%',
          listStyle: 'none',
          counterReset: 'item'
        }}>
          <li style={{ margin: 0 }}>
            <Link href="/" style={{
              textDecoration: 'none',
              lineHeight: 1.4,
              fontSize: '1.4rem',
              display: 'block',
              padding: '0.6rem 4%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              color: '#B8B8B8'
            }}>Home</Link>
          </li>
          <li style={{ margin: 0 }}>
            <a href="https://store.openfaas.com/" style={{
              textDecoration: 'none',
              lineHeight: 1.4,
              fontSize: '1.4rem',
              display: 'block',
              padding: '0.6rem 4%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              color: '#B8B8B8'
            }}>SWAG Store</a>
          </li>
          <li style={{ margin: 0 }}>
            <a href="https://github.com/sponsors/alexellis/" style={{
              textDecoration: 'none',
              lineHeight: 1.4,
              fontSize: '1.4rem',
              display: 'block',
              padding: '0.6rem 4%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              color: '#B8B8B8'
            }}>Subscription Email</a>
          </li>
          <li style={{ margin: 0 }}>
            <a href="https://github.com/alexellis/" style={{
              textDecoration: 'none',
              lineHeight: 1.4,
              fontSize: '1.4rem',
              display: 'block',
              padding: '0.6rem 4%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              color: '#B8B8B8'
            }}>GitHub</a>
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
        <header className="main-header post-head no-cover" style={{
          position: 'relative',
          display: 'table',
          width: '100%',
          height: '85px',
          minHeight: 0,
          marginBottom: 0,
          textAlign: 'center',
          background: 'transparent'
        }}>
          <nav className="main-nav clearfix" style={{
            position: 'relative',
            padding: '35px 40px',
            margin: '0 0 30px 0'
          }}>
            <a className="menu-button icon-menu" href="#" style={{
              display: 'inline-block',
              float: 'right',
              height: '38px',
              padding: '0 15px',
              borderStyle: 'solid',
              borderWidth: '1px',
              opacity: 1,
              textAlign: 'center',
              fontSize: '12px',
              textTransform: 'uppercase',
              lineHeight: '35px',
              borderRadius: '3px',
              borderColor: '#BFC8CD',
              color: '#9EABB3',
              fontFamily: '"Open Sans", sans-serif',
              textDecoration: 'none'
            }}>
              <span className="word">Menu</span>
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
            wordWrap: 'break-word',
            textAlign: 'center'
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
                404
              </h1>
              
              <section className="post-meta" style={{
                display: 'block',
                margin: '1.75rem 0 0 0',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '1.5rem',
                lineHeight: '2.2rem',
                color: '#9EABB3'
              }}>
                Page Not Found
              </section>
            </header>

            <section className="post-content">
              <div className="kg-card-markdown ghost-content" style={{
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: '"Merriweather", serif',
                  fontSize: '1.8rem',
                  lineHeight: '1.75em',
                  color: '#3A4145',
                  margin: '0 0 1.75em 0',
                  textRendering: 'geometricPrecision'
                }}>
                  The page you were looking for could not be found.
                </p>
                
                <p style={{
                  fontFamily: '"Merriweather", serif',
                  fontSize: '1.8rem',
                  lineHeight: '1.75em',
                  color: '#3A4145',
                  margin: '0 0 1.75em 0',
                  textRendering: 'geometricPrecision'
                }}>
                  <Link href="/" style={{
                    color: '#4A4A4A',
                    textDecoration: 'underline'
                  }}>
                    Return to the homepage
                  </Link>
                </p>
              </div>
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

      </div>
    </div>
  );
}