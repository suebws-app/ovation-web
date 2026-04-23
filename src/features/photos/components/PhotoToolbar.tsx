'use client'

import { Button } from '@ovation/ui/components/Button'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

import { Upload } from '@ovation/icons/Upload'

export const PhotoToolbar = () => (
  <div className="border-b border-border bg-card px-4 py-5 tablet:px-7">
    <div className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between">
      <div>
        <h1 className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight desktop:text-[2rem]">
          <span>64 photographs.</span>{' '}
          <span className="italic text-primary">52 faces.</span>
        </h1>
        <p className="mt-1.5 type-body-small text-muted-foreground">
          From 14 Jun &mdash; 15 Jun &middot; 42 paired with messages &middot; 22 unmatched
        </p>
      </div>
      <div className="flex gap-2">
        <SortButton />
        <ViewToggle />
        <Button className="rounded-10 bg-foreground text-background hover:bg-foreground/90">
          <Upload width={13} height={13} /> Upload photos
        </Button>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2.5">
      <SearchInput />
      <div className="hidden gap-1.5 desktop:flex">
        <FilterChip label="Reception" active />
        <FilterChip label="With audio" />
        <FilterChip label="Family" />
      </div>
    </div>
  </div>
)


const SearchInput = () => (
  <div className="flex flex-1 items-center gap-2.5 rounded-10 border border-border bg-background px-3.5 py-2.5">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
    </svg>
    <input
      placeholder="Search people, venues, moments\u2026"
      className="flex-1 bg-transparent type-body-small text-foreground outline-none placeholder:text-muted-foreground"
    />
    <kbd className="rounded-4 border border-border bg-card px-1.5 py-0.5 type-caption text-muted-foreground">
      \u2318K
    </kbd>
  </div>
)

const SortButton = () => (
  <button type="button" className="hidden cursor-pointer items-center gap-1.5 rounded-10 border border-border bg-card px-3.5 py-2.5 type-body-small font-medium text-muted-foreground transition-colors hover:bg-muted desktop:inline-flex">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l-3 3m3-3l3 3" />
    </svg>
    By reception
  </button>
)

const ViewToggle = () => (
  <div className="hidden cursor-pointer items-center gap-1 rounded-10 border border-border bg-card px-2.5 py-2 desktop:inline-flex">
    <span className="rounded-4 bg-primary/10 p-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </div>
)

const FilterChip = ({ label, active = false }: { label: string; active?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 type-caption font-semibold ${active ? 'bg-primary/10 text-primary' : 'border border-border bg-card text-muted-foreground'}`}>
    {label}
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </span>
)
