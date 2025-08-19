import { getPaginatedPosts } from '@/lib/posts';
import HomePage from '@/components/HomePage';

export default function Home() {
  const { posts, totalPages, hasNextPage, hasPrevPage, currentPage } = getPaginatedPosts(1, 5);

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