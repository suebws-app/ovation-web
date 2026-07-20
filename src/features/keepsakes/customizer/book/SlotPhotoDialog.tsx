"use client";

import { useTranslations } from "next-intl";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Button } from "@ovation/ui/components/Button";
import { XIcon } from "@ovation/icons/XIcon";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import type { GalleryItem } from "@/lib/api/types";

type SlotPhotoDialogProps = {
  eventId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (mediaId: string, thumbUrl: string) => void;
};

export const SlotPhotoDialog = ({
  eventId,
  open,
  onOpenChange,
  onPick,
}: SlotPhotoDialogProps) => {
  const t = useTranslations();
  const gallery = useInfiniteGallery(eventId ?? "", {
    type: "photo",
    includeOwnerUploads: true,
  });
  const items: GalleryItem[] = (gallery.data?.pages ?? []).flatMap(
    (page) => page.items,
  );

  const pick = (item: GalleryItem) => {
    onPick(item.id, item.thumbUrl ?? item.url ?? "");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-scale-fade-in fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className="bg-card rounded-20 fixed top-1/2 left-1/2 z-50 flex max-h-[80vh] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden p-6 focus:outline-none"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <Dialog.Title className="type-h4 font-semibold">
              {t("keepsakes__book_customizer__cover_slot_dialog_title")}
            </Dialog.Title>
            <Dialog.Close
              aria-label={t("keepsakes__media_preview__close")}
              className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors"
            >
              <XIcon width={18} height={18} />
            </Dialog.Close>
          </div>
          <VisuallyHidden.Root>
            <Dialog.Description>
              {t("keepsakes__book_customizer__cover_slot_dialog_description")}
            </Dialog.Description>
          </VisuallyHidden.Root>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {gallery.isLoading ? (
              <p className="type-body-small text-muted-foreground py-8 text-center">
                {t("common__loading")}
              </p>
            ) : items.length === 0 ? (
              <p className="type-body-small text-muted-foreground py-8 text-center">
                {t("keepsakes__book_customizer__photos_empty_hint")}
              </p>
            ) : (
              <>
                <div className="tablet:grid-cols-5 grid grid-cols-4 gap-2">
                  {items.map((item) => (
                    <SlotPhotoTile key={item.id} item={item} onPick={pick} />
                  ))}
                </div>
                {gallery.hasNextPage && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => gallery.fetchNextPage()}
                      disabled={gallery.isFetchingNextPage}
                      className="rounded-full"
                    >
                      {t("common__load_more")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

type SlotPhotoTileProps = {
  item: GalleryItem;
  onPick: (item: GalleryItem) => void;
};

const SlotPhotoTile = ({ item, onPick }: SlotPhotoTileProps) => {
  const thumb = item.thumbUrl ?? item.url;
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      className="rounded-8 bg-muted hover:border-primary relative aspect-square overflow-hidden border-2 border-transparent transition-colors"
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </button>
  );
};
