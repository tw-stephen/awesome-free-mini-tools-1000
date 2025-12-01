import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
        <p className="mb-2">{t('common.footer.privacy')}</p>
        <p>{t('common.footer.copyright')}</p>
      </div>
    </footer>
  )
}
