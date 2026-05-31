type ReviewPhotoTileProps = {
  url: string;
};

export const ReviewPhotoTile = ({ url }: ReviewPhotoTileProps) => (
  <img
    src={url}
    alt=""
    className="rounded-12 aspect-square w-full object-cover"
  />
);
