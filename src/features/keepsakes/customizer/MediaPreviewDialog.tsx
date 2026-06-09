"use client";

import Image from "next/image";
import { Dialog, VisuallyHidden } from "radix-ui";
import { XIcon } from "@ovation/icons/XIcon";
import type { GalleryItem } from "@/lib/api/types";

type MediaPreviewDialogProps = {
  item: GalleryItem | null;
  onOpenChange: (open: boolean) => void;
};

export const MediaPreviewDialog = ({
  item,
  onOpenChange,
}: MediaPreviewDialogProps) => {
  const open = item !== null;
  const src = item?.url ?? item?.thumbUrl ?? null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/80 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-6 focus:outline-none"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Media preview</Dialog.Title>
            <Dialog.Description>
              Full-size preview of the selected media item.
            </Dialog.Description>
          </VisuallyHidden.Root>
          {src && item?.type === "video" ? (
            <video
              src={src}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-12"
            />
          ) : src ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
                priority
              />
            </div>
          ) : null}
          <Dialog.Close
            aria-label="Close preview"
            className="bg-background/90 text-foreground hover:bg-background absolute right-6 top-6 flex size-10 items-center justify-center rounded-full transition-colors"
          >
            <XIcon width={18} height={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
