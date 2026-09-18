import Image from "next/image";

type CoverImageProps = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  sizes: string;
};

export function CoverImage({
  src,
  alt = "",
  priority = false,
  className,
  sizes,
}: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
