'use client'

type UrlSuggestionChipProps = {
  slug: string
  onClick?: () => void
}

export const UrlSuggestionChip = ({ slug, onClick }: UrlSuggestionChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer rounded-full border border-border bg-card px-3.5 py-2 font-mono type-body-small text-foreground transition-colors hover:bg-muted"
  >
    {slug}
  </button>
)
