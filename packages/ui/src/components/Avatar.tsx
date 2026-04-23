'use client'

import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type AvatarProps = React.ComponentProps<'div'> & {
  initials: string
  tint?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-8 type-caption',
  md: 'size-9 type-body-small',
  lg: 'size-11 type-body',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ initials, tint, size = 'md', className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-serif font-bold',
        sizeClasses[size],
        className
      )}
      style={{ background: tint ?? 'var(--primary)', color: tint ? '#5a3b20' : 'var(--primary-foreground)', ...style }}
      {...props}
    >
      {initials}
    </div>
  )
)
Avatar.displayName = 'Avatar'
