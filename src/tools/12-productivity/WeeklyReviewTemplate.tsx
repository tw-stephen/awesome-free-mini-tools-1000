import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface WeeklyReview {
  id: string
  weekStart: string
  accomplishments: string
  challenges: string
  lessons: string
  gratitude: string
  nextWeekGoals: string
  rating: number
  notes: string
  createdAt: string
}

export default function WeeklyReviewTemplate() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<WeeklyReview[]>([])
  const [currentReview, setCurrentReview] = useState<WeeklyReview | null>(null)
  const [showList, setShowList] = useState(true)

  const getWeekStart = (date: Date = new Date()) => {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay())
    return d.toISOString().split('T')[0]
  }

  useEffect(() => {
    const saved = localStorage.getItem('weekly-reviews')
    if (saved) setReviews(JSON.parse(saved))
  }, [])

  const saveReviews = (updated: WeeklyReview[]) => {
    setReviews(updated)
    localStorage.setItem('weekly-reviews', JSON.stringify(updated))
  }

  const createNew = () => {
    const weekStart = getWeekStart()
    const existing = reviews.find(r => r.weekStart === weekStart)
    if (existing) {
      setCurrentReview(existing)
    } else {
      const review: WeeklyReview = {
        id: Date.now().toString(),
        weekStart,
        accomplishments: '',
        challenges: '',
        lessons: '',
        gratitude: '',
        nextWeekGoals: '',
        rating: 5,
        notes: '',
        createdAt: new Date().toISOString()
      }
      setCurrentReview(review)
    }
    setShowList(false)
  }

  const saveCurrentReview = () => {
    if (!currentReview) return
    const existing = reviews.find(r => r.id === currentReview.id)
    let updated: WeeklyReview[]
    if (existing) {
      updated = reviews.map(r => r.id === currentReview.id ? currentReview : r)
    } else {
      updated = [currentReview, ...reviews]
    }
    saveReviews(updated)
  }

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id)
    saveReviews(updated)
    if (currentReview?.id === id) {
      setCurrentReview(null)
      setShowList(true)
    }
  }

  const updateField = (field: keyof WeeklyReview, value: string | number) => {
    if (!currentReview) return
    setCurrentReview({ ...currentReview, [field]: value })
  }

  const exportReview = () => {
    if (!currentReview) return
    let text = `# Weekly Review: Week of ${currentReview.weekStart}\n\n`
    text += `## What I Accomplished\n${currentReview.accomplishments}\n\n`
    text += `## Challenges Faced\n${currentReview.challenges}\n\n`
    text += `## Lessons Learned\n${currentReview.lessons}\n\n`
    text += `## Gratitude\n${currentReview.gratitude}\n\n`
    text += `## Goals for Next Week\n${currentReview.nextWeekGoals}\n\n`
    text += `## Overall Rating: ${currentReview.rating}/10\n\n`
    if (currentReview.notes) {
      text += `## Additional Notes\n${currentReview.notes}\n`
    }

    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weekly-review-${currentReview.weekStart}.md`
    a.click()
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    return Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length * 10) / 10
  }

  if (showList) {
    return (
      <div className="space-y-4">
        <button
          onClick={createNew}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
        >
          {t('tools.weeklyReviewTemplate.newReview')}
        </button>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.weeklyReviewTemplate.stats')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
              <div className="text-xs text-slate-500">{t('tools.weeklyReviewTemplate.totalReviews')}</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-green-600">{getAverageRating()}</div>
              <div className="text-xs text-slate-500">{t('tools.weeklyReviewTemplate.avgRating')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {reviews.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">
              {t('tools.weeklyReviewTemplate.noReviews')}
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="card p-3">
                <div className="flex justify-between items-start">
                  <button
                    onClick={() => {
                      setCurrentReview(review)
                      setShowList(false)
                    }}
                    className="text-left flex-1"
                  >
                    <div className="font-medium">
                      {t('tools.weeklyReviewTemplate.weekOf')} {review.weekStart}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`}
                          >
                            *
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">{review.rating}/10</span>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-500 text-sm ml-2"
                  >
                    {t('tools.weeklyReviewTemplate.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card p-4 bg-blue-50">
          <h3 className="font-medium mb-2">{t('tools.weeklyReviewTemplate.tips')}</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>- {t('tools.weeklyReviewTemplate.tip1')}</li>
            <li>- {t('tools.weeklyReviewTemplate.tip2')}</li>
            <li>- {t('tools.weeklyReviewTemplate.tip3')}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            saveCurrentReview()
            setShowList(true)
          }}
          className="flex-1 py-2 bg-slate-100 rounded"
        >
          {t('tools.weeklyReviewTemplate.backToList')}
        </button>
        <button
          onClick={saveCurrentReview}
          className="flex-1 py-2 bg-green-500 text-white rounded"
        >
          {t('tools.weeklyReviewTemplate.save')}
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <h2 className="font-bold text-lg text-center">
          {t('tools.weeklyReviewTemplate.weekOf')} {currentReview?.weekStart}
        </h2>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.accomplishments')}
          </label>
          <textarea
            value={currentReview?.accomplishments || ''}
            onChange={(e) => updateField('accomplishments', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.accomplishmentsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.challenges')}
          </label>
          <textarea
            value={currentReview?.challenges || ''}
            onChange={(e) => updateField('challenges', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.challengesPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.lessons')}
          </label>
          <textarea
            value={currentReview?.lessons || ''}
            onChange={(e) => updateField('lessons', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.lessonsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.gratitude')}
          </label>
          <textarea
            value={currentReview?.gratitude || ''}
            onChange={(e) => updateField('gratitude', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.gratitudePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-20"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.nextWeekGoals')}
          </label>
          <textarea
            value={currentReview?.nextWeekGoals || ''}
            onChange={(e) => updateField('nextWeekGoals', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.nextWeekGoalsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-2">
            {t('tools.weeklyReviewTemplate.rating')}: {currentReview?.rating}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={currentReview?.rating || 5}
            onChange={(e) => updateField('rating', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{t('tools.weeklyReviewTemplate.poor')}</span>
            <span>{t('tools.weeklyReviewTemplate.excellent')}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            {t('tools.weeklyReviewTemplate.additionalNotes')}
          </label>
          <textarea
            value={currentReview?.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder={t('tools.weeklyReviewTemplate.notesPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-20"
          />
        </div>
      </div>

      <button
        onClick={exportReview}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        {t('tools.weeklyReviewTemplate.export')}
      </button>
    </div>
  )
}
