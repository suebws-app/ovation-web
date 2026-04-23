'use client'

import { cn } from '@ovation/ui/utils/cn'
import { Badge } from '@ovation/ui/components/Badge'
import { Link } from '@/i18n/navigation'

type NavItemProps = {
  label: string
  href: string
  icon: React.ReactNode
  active?: boolean
  badge?: number
}

export const NavItem = ({ label, href, icon, active = false, badge }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      'flex items-center gap-3.5 rounded-10 px-3 py-3 type-body-small font-medium transition-colors',
      active
        ? 'bg-primary/10 font-semibold text-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )}
  >
    <span className={cn('inline-flex', active ? 'text-primary' : 'text-muted-foreground')}>
      {icon}
    </span>
    <span className="flex-1">{label}</span>
    {badge != null && (
      <Badge variant="destructive">{badge}</Badge>
    )}
  </Link>
)
