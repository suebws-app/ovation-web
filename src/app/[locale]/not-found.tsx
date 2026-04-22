import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('errors')

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">{t('NOT_FOUND')}</p>
    </div>
  )
}
