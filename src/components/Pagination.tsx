import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationProps) {
  return (
    <nav className="pagination" role="navigation" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '1.3rem',
      lineHeight: '1.3em',
      color: '#9EABB3',
      padding: '2rem 0'
    }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
        {hasPrevPage && (
          <Link 
            className="newer-posts" 
            href={currentPage === 2 ? '/' : `/page/${currentPage - 1}/`}
            style={{
              display: 'inline-block',
              padding: '8px 15px',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: '#bfc8cd',
              textDecoration: 'none',
              borderRadius: '30px',
              transition: 'border ease 0.3s',
              color: '#9EABB3',
              whiteSpace: 'nowrap'
            }}
          >
            ← Newer Posts
          </Link>
        )}
      </div>
      <div style={{ flex: 0, textAlign: 'center', whiteSpace: 'nowrap', margin: '0 1rem' }}>
        <span className="page-number">Page {currentPage} of {totalPages}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
        {hasNextPage && (
          <Link 
            className="older-posts" 
            href={`/page/${currentPage + 1}/`}
            style={{
              display: 'inline-block',
              padding: '8px 15px',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: '#bfc8cd',
              textDecoration: 'none',
              borderRadius: '30px',
              transition: 'border ease 0.3s',
              color: '#9EABB3',
              whiteSpace: 'nowrap'
            }}
          >
            Older Posts →
          </Link>
        )}
      </div>
    </nav>
  );
}