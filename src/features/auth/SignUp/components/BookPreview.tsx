import { cn } from '@ovation/ui/utils/cn'

type BookPreviewProps = {
  partner1: string
  partner2: string
  date?: string
  venue?: string
  coverImage?: React.ReactNode
  className?: string
}

export const BookPreview = ({
  partner1,
  partner2,
  date,
  venue,
  coverImage,
  className,
}: BookPreviewProps) => (
  <div
    className={cn(
      'relative w-[calc(100%+3rem)] -ml-6 overflow-hidden rounded-12 bg-card shadow-lg -rotate-2',
      className
    )}
  >
    {coverImage && (
      <div className="h-55 overflow-hidden rounded-t-12">
        {coverImage}
      </div>
    )}
    <div className="p-8 text-card-foreground">
      <p className="type-overline tracking-[2px] text-muted-foreground">
        Ovation &middot; Volume I
      </p>
      <p className="mt-2 break-words font-serif text-4xl font-medium italic leading-none tracking-tight">
        {partner1 || 'Partner 1'}
        <br />
        &amp; {partner2 || 'Partner 2'}
      </p>
      {(date || venue) && (
        <p className="mt-1.5 font-mono type-caption text-muted-foreground tracking-wider">
          {date} {date && venue && '—'} {venue}
        </p>
      )}
    </div>
  </div>
)
