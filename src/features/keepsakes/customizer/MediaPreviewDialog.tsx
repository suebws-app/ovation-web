"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const open = item !== null;
  const src = item?.url ?? item?.thumbUrl ?? null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          onClick={(event) => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
          className="data-[state=closed]:animate-scale-fade-out data-[state=open]:animate-scale-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a] p-6 focus:outline-none"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>{t("keepsakes__media_preview__title")}</Dialog.Title>
            <Dialog.Description>
              {t("keepsakes__media_preview__description")}
            </Dialog.Description>
          </VisuallyHidden.Root>
          {src && item?.type === "video" ? (
            <video
              src={src}
              controls
              autoPlay
              className="rounded-12 max-h-full max-w-full"
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
            aria-label={t("keepsakes__media_preview__close")}
            className="bg-background/90 text-foreground hover:bg-background absolute top-6 right-6 flex size-10 items-center justify-center rounded-full transition-colors"
          >
            <XIcon width={18} height={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
