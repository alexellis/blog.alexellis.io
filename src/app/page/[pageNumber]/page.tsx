import { getPaginatedPosts } from '@/lib/posts';
import HomePage from '@/components/HomePage';
import { notFound } from 'next/navigation';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/config';

type Props = {
  params: Promise<{ pageNumber: string }>;
};

export async function generateStaticParams() {
  const { totalPages } = getPaginatedPosts(1, 5);
  
  const params = [];
  for (let i = 2; i <= totalPages; i++) {
    params.push({ pageNumber: i.toString() });
  }
  
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { pageNumber } = await params;
  const page = parseInt(pageNumber);
  
  if (isNaN(page) || page < 1) {
    return {
      title: 'Page Not Found',
      description: 'The page you were looking for could not be found.',
    };
  }

  return {
    title: `${SITE_NAME} - Page ${page}`,
    description: `${SITE_DESCRIPTION} - Page ${page}`,
    alternates: {
      canonical: `${SITE_URL}/page/${page}/`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { pageNumber } = await params;
  const page = parseInt(pageNumber);
  
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const { posts, totalPages, hasNextPage, hasPrevPage, currentPage } = getPaginatedPosts(page, 5);
  
  if (posts.length === 0) {
    notFound();
  }

  return (
    <HomePage 
      posts={posts} 
      totalPages={totalPages} 
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      currentPage={currentPage}
    />
  );
}