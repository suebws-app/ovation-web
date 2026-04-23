import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type LabelProps = React.ComponentProps<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('type-overline block text-muted-foreground', className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'
