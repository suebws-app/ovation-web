const PHOTO_TILE_COUNT = 6;
const photoTiles = Array.from({ length: PHOTO_TILE_COUNT }, (_, i) => i);
const ORDER_ROW_COUNT = 3;
const orderRows = Array.from({ length: ORDER_ROW_COUNT }, (_, i) => i);

const QRWidgetSkeleton = () => (
  <div className="rounded-20 bg-muted relative flex min-h-110 w-full animate-pulse flex-col gap-4 overflow-hidden p-5 shadow-sm">
    <div className="bg-muted-foreground/20 rounded-10 size-9" />
    <div className="bg-background rounded-16 mt-5 flex aspect-square w-full items-center justify-center">
      <div className="bg-muted-foreground/20 rounded-12 size-44" />
    </div>
    <div className="bg-muted-foreground/20 mt-4 h-5 w-3/4 rounded" />
    <div className="bg-muted-foreground/20 mt-3 h-4 w-32 self-center rounded" />
  </div>
);

const MessagesWidgetSkeleton = () => (
  <div className="rounded-20 border-border bg-card desktop:grid-cols-[1fr_1px_1.4fr] grid min-h-62 grid-cols-1 gap-6 border p-6 shadow-sm">
    <div className="flex animate-pulse flex-col justify-between gap-5">
      <div className="bg-muted rounded-12 size-10" />
      <div className="flex flex-col gap-2">
        <div className="bg-muted h-8 w-24 rounded" />
        <div className="bg-muted h-4 w-40 rounded" />
      </div>
      <div className="bg-muted h-4 w-32 rounded" />
    </div>
    <div className="bg-border desktop:block hidden w-px" aria-hidden />
    <div className="flex animate-pulse flex-col gap-3">
      <div className="bg-muted h-3 w-28 rounded" />
      <div className="flex items-center gap-3">
        <div className="bg-muted size-12 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="bg-muted h-4 w-40 rounded" />
          <div className="bg-muted h-3 w-56 max-w-full rounded" />
        </div>
        <div className="bg-muted size-8 shrink-0 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-muted size-12 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="bg-muted h-4 w-36 rounded" />
          <div className="bg-muted h-3 w-48 max-w-full rounded" />
        </div>
        <div className="bg-muted size-8 shrink-0 rounded-full" />
      </div>
    </div>
  </div>
);

const PhotosWidgetSkeleton = () => (
  <div className="rounded-20 border-border bg-card flex min-h-62 w-full animate-pulse flex-col gap-4 border p-5 shadow-sm min-[1300px]:w-80 min-[1300px]:shrink-0">
    <div className="grid grid-cols-3 gap-2">
      {photoTiles.map((i) => (
        <div key={i} className="bg-muted rounded-12 aspect-square w-full" />
      ))}
    </div>
    <div className="flex items-center gap-3">
      <div className="bg-muted rounded-12 size-10 shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="bg-muted h-4 w-24 rounded" />
        <div className="bg-muted h-3 w-32 rounded" />
      </div>
    </div>
    <div className="bg-border h-px w-full" aria-hidden />
    <div className="bg-muted h-4 w-32 self-center rounded" />
  </div>
);

const OrdersWidgetSkeleton = () => (
  <div className="rounded-20 border-border bg-card flex min-h-62 animate-pulse flex-col border p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4 pb-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-12 size-10 shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-4 w-24 rounded" />
          <div className="bg-muted h-3 w-32 rounded" />
        </div>
      </div>
      <div className="bg-muted h-4 w-16 rounded" />
    </div>
    <div className="flex flex-col gap-3">
      {orderRows.map((i) => (
        <div
          key={i}
          className="border-border flex items-center gap-3 border-t pt-3"
        >
          <div className="bg-muted rounded-10 size-10 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="bg-muted h-3.5 w-40 rounded" />
            <div className="bg-muted h-3 w-24 rounded" />
          </div>
          <div className="bg-muted h-6 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="flex w-full flex-col gap-6 p-6">
    <div className="tablet:flex-row tablet:items-start flex flex-col gap-6">
      <div className="tablet:order-2 tablet:w-80 tablet:shrink-0 order-1 flex w-full flex-col gap-6">
        <QRWidgetSkeleton />
        <div className="min-[1300px]:hidden">
          <OrdersWidgetSkeleton />
        </div>
      </div>
      <div className="tablet:order-1 order-2 flex min-w-0 flex-1 flex-col gap-6">
        <MessagesWidgetSkeleton />
        <div className="flex flex-col gap-6 min-[1300px]:flex-row min-[1300px]:items-start">
          <PhotosWidgetSkeleton />
          <div className="hidden min-w-0 flex-1 min-[1300px]:block">
            <OrdersWidgetSkeleton />
          </div>
        </div>
      </div>
    </div>
  </div>
);
