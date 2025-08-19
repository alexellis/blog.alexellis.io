interface BlogImageProps {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function BlogImage({ 
  src, 
  alt = '', 
  title, 
  width, 
  height, 
  className,
  style 
}: BlogImageProps) {
  // Determine if this is a hero image (first image in post content or feature image)
  const isHeroImage = className?.includes('kg-image') || className?.includes('feature-image');
  
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={className}
      style={style}
      // Disable preloading for non-hero images
      loading={isHeroImage ? 'eager' : 'lazy'}
      // Prevent automatic preload hints for non-hero images
      fetchPriority={isHeroImage ? 'high' : 'low'}
    />
  );
}