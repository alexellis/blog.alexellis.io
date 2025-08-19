import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePage from '../../../components/HomePage';
import { getAllTags, tagToSlug, getPostsByTag } from '../../../lib/posts';
import { SITE_URL, SITE_NAME } from '../../../lib/config';

interface TagPageProps {
  params: Promise<{ tagSlug: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags();
  
  return tags.map((tag) => ({
    tagSlug: tagToSlug(tag),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tagSlug } = await params;
  const tags = getAllTags();
  const tag = tags.find(t => tagToSlug(t) === tagSlug);
  
  if (!tag) {
    return { title: 'Tag not found' };
  }

  return {
    title: `${tag} - ${SITE_NAME}`,
    description: `Posts tagged with ${tag}`,
    alternates: {
      canonical: `${SITE_URL}/tag/${tagSlug}/`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagSlug } = await params;
  const tags = getAllTags();
  const tag = tags.find(t => tagToSlug(t) === tagSlug);
  
  if (!tag) {
    notFound();
  }

  // Get posts by tag
  const taggedPosts = getPostsByTag(tag);

  if (taggedPosts.length === 0) {
    notFound();
  }

  const postsPerPage = 10;
  const paginatedPosts = taggedPosts.slice(0, postsPerPage);
  const totalPages = Math.ceil(taggedPosts.length / postsPerPage);

  return (
    <HomePage 
      posts={paginatedPosts}
      totalPages={totalPages}
      hasNextPage={taggedPosts.length > postsPerPage}
      hasPrevPage={false}
      currentPage={1}
      tagName={tag}
    />
  );
}