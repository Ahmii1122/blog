export function YouTubeEmbed({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black">
      <div className="relative aspect-video">
        <iframe
          src={src}
          title="YouTube video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
