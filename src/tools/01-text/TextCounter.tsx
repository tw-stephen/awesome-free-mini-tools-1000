import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getTextStats, TextStats } from '../../utils/textCounter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export default function TextCounter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()

  const stats: TextStats = useMemo(() => {
    return getTextStats(input)
  }, [input])

  const handleClear = () => {
    setInput('')
  }

  const handleCopyStats = () => {
    const statsText = `${t('tools.textCounter.stats.characters')}: ${stats.characters}
${t('tools.textCounter.stats.charactersNoSpaces')}: ${stats.charactersNoSpaces}
${t('tools.textCounter.stats.words')}: ${stats.words}
${t('tools.textCounter.stats.sentences')}: ${stats.sentences}
${t('tools.textCounter.stats.paragraphs')}: ${stats.paragraphs}
${t('tools.textCounter.stats.lines')}: ${stats.lines}
${t('tools.textCounter.stats.readingTime')}: ${stats.readingTime} ${t('tools.textCounter.minutes')}
${t('tools.textCounter.stats.speakingTime')}: ${stats.speakingTime} ${t('tools.textCounter.minutes')}`
    copy(statsText)
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return `< 1 ${t('tools.textCounter.minutes')}`
    return `${minutes} ${t('tools.textCounter.minutes')}`
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={t('tools.textCounter.stats.characters')}
          value={stats.characters}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.charactersNoSpaces')}
          value={stats.charactersNoSpaces}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.words')}
          value={stats.words}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.sentences')}
          value={stats.sentences}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.paragraphs')}
          value={stats.paragraphs}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.lines')}
          value={stats.lines}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.readingTime')}
          value={formatTime(stats.readingTime)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label={t('tools.textCounter.stats.speakingTime')}
          value={formatTime(stats.speakingTime)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          }
        />
      </div>

      {/* Input Section */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('common.input')}
          </label>
        </div>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('common.placeholder')}
          rows={12}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClear} disabled={!input}>
            {t('common.clear')}
          </Button>
          <Button onClick={handleCopyStats} disabled={!input}>
            {copied ? t('common.copied') : t('tools.textCounter.copyStats')}
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        <svg
          className="inline-block w-4 h-4 mr-1 -mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
