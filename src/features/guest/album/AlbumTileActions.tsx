"use client";

import { HeartIcon } from "@ovation/icons/HeartIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { MapPinIcon } from "@ovation/icons/MapPinIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { cn } from "@ovation/ui/utils/cn";

type AlbumTileActionsProps = {
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isPinned: boolean;
  likeLabel: string;
  commentLabel: string;
  deleteLabel: string;
  onLike: () => void;
  onComment: () => void;
  onDelete?: () => void;
};

export const AlbumTileActions = ({
  likeCount,
  commentCount,
  likedByMe,
  isPinned,
  likeLabel,
  commentLabel,
  deleteLabel,
  onLike,
  onComment,
  onDelete,
}: AlbumTileActionsProps) => (
  <div className="from-foreground/70 absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t to-transparent px-2.5 py-2">
    <button
      type="button"
      aria-label={likeLabel}
      onClick={(event) => {
        event.stopPropagation();
        onLike();
      }}
      className="text-primary-foreground type-caption flex cursor-pointer items-center gap-1 font-semibold"
    >
      <HeartIcon
        className={cn(
          "size-4",
          likedByMe && "fill-destructive text-destructive",
        )}
        aria-hidden
      />
      {likeCount > 0 && likeCount}
    </button>
    <button
      type="button"
      aria-label={commentLabel}
      onClick={(event) => {
        event.stopPropagation();
        onComment();
      }}
      className="text-primary-foreground type-caption flex cursor-pointer items-center gap-1 font-semibold"
    >
      <MessageSquareIcon className="size-4" aria-hidden />
      {commentCount > 0 && commentCount}
    </button>
    {isPinned && (
      <MapPinIcon
        className="text-primary-foreground ml-auto size-4"
        aria-hidden
      />
    )}
    {onDelete && (
      <button
        type="button"
        aria-label={deleteLabel}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        className={cn(
          "text-primary-foreground flex cursor-pointer items-center",
          !isPinned && "ml-auto",
        )}
      >
        <TrashIcon className="size-4" aria-hidden />
      </button>
    )}
  </div>
);
