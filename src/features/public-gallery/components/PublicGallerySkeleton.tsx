const PLACEHOLDER_HEIGHTS = [
  220, 300, 180, 260, 320, 200, 240, 280, 210, 300, 190, 250,
];

export const PublicGallerySkeleton = () => (
  <div className="tablet:columns-3 large-desktop:columns-4 columns-2 gap-3">
    {PLACEHOLDER_HEIGHTS.map((height, index) => (
      <div
        key={index}
        className="rounded-12 bg-muted mb-3 w-full animate-pulse break-inside-avoid"
        style={{ height }}
      />
    ))}
  </div>
);
