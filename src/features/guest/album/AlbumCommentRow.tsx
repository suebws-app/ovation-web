import type { AlbumComment } from "@/lib/api/types";

type AlbumCommentRowProps = {
  comment: AlbumComment;
};

export const AlbumCommentRow = ({ comment }: AlbumCommentRowProps) => (
  <div className="flex flex-col gap-0.5">
    <p className="type-body-small text-foreground font-semibold">
      {comment.guestName}
    </p>
    <p className="type-body-small text-muted-foreground leading-relaxed">
      {comment.body}
    </p>
  </div>
);
