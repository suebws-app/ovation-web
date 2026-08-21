"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTitle } from "@ovation/ui/components/Sheet";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import {
  useAlbumComments,
  useCreateAlbumComment,
} from "@/lib/query/albumSocialQueries";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { AlbumCommentRow } from "./AlbumCommentRow";

type AlbumCommentsSheetProps = {
  slug: string;
  mediaId: string | null;
  onClose: () => void;
};

export const AlbumCommentsSheet = ({
  slug,
  mediaId,
  onClose,
}: AlbumCommentsSheetProps) => {
  const t = useTranslations();
  const guestName = useGuestSubmissionStore((s) => s.guestName);
  const [body, setBody] = useState("");
  const commentsQuery = useAlbumComments(slug, mediaId, Boolean(mediaId));
  const createComment = useCreateAlbumComment(slug, mediaId);

  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [commentsQuery.data],
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (trimmed.length === 0) return;
    createComment.mutate(
      {
        guestName: guestName.trim() || t("guest_gallery__anonymous"),
        body: trimmed,
      },
      { onSuccess: () => setBody("") },
    );
  };

  return (
    <Sheet open={Boolean(mediaId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-24 max-h-[80vh]">
        <div className="flex max-h-[70vh] flex-col gap-4 p-5">
          <SheetTitle className="type-h3">
            {t("guest__album__comments_title")}
          </SheetTitle>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {comments.length === 0 && !commentsQuery.isPending && (
              <p className="type-body-small text-muted-foreground">
                {t("guest__album__comments_empty")}
              </p>
            )}
            {comments.map((comment) => (
              <AlbumCommentRow key={comment.id} comment={comment} />
            ))}
          </div>

          <form onSubmit={submit} className="flex items-center gap-2">
            <Input
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t("guest__album__comment_placeholder")}
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={body.trim().length === 0 || createComment.isPending}
            >
              {t("guest__album__comment_send")}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
