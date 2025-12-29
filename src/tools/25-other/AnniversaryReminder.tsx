import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Anniversary {
  id: number
  name: string
  date: string
  type: string
  notes?: string
}

export default function AnniversaryReminder() {
  const { t } = useTranslation()
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([])
  const [newAnniversary, setNewAnniversary] = useState({
    name: '',
    date: '',
    type: 'wedding',
    notes: '',
  })
  const [showAdd, setShowAdd] = useState(false)

  const types = [
    { id: 'wedding', label: t('tools.anniversaryReminder.wedding') },
    { id: 'dating', label: t('tools.anniversaryReminder.dating') },
    { id: 'work', label: t('tools.anniversaryReminder.work') },
    { id: 'friendship', label: t('tools.anniversaryReminder.friendship') },
    { id: 'memorial', label: t('tools.anniversaryReminder.memorial') },
    { id: 'other', label: t('tools.anniversaryReminder.other') },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('anniversary-reminder')
    if (saved) {
      try {
        setAnniversaries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load anniversaries')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('anniversary-reminder', JSON.stringify(anniversaries))
  }, [anniversaries])

  const addAnniversary = () => {
    if (!newAnniversary.name || !newAnniversary.date) return
    setAnniversaries([...anniversaries, {
      id: Date.now(),
      name: newAnniversary.name,
      date: newAnniversary.date,
      type: newAnniversary.type,
      notes: newAnniversary.notes || undefined,
    }])
    setNewAnniversary({ name: '', date: '', type: 'wedding', notes: '' })
    setShowAdd(false)
  }

  const removeAnniversary = (id: number) => {
    setAnniversaries(anniversaries.filter(a => a.id !== id))
  }

  const getYearsCount = (date: string) => {
    const now = new Date()
    const anniv = new Date(date)
    let years = now.getFullYear() - anniv.getFullYear()
    const m = now.getMonth() - anniv.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < anniv.getDate())) {
      years--
    }
    return years
  }

  const getNextAnniversary = (date: string) => {
    const now = new Date()
    const anniv = new Date(date)
    const thisYear = new Date(now.getFullYear(), anniv.getMonth(), anniv.getDate())
    if (thisYear < now) {
      thisYear.setFullYear(now.getFullYear() + 1)
    }
    return thisYear
  }

  const getDaysUntil = (date: string) => {
    const now = new Date()
    const next = getNextAnniversary(date)
    return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getMilestoneLabel = (years: number) => {
    const milestones: Record<number, string> = {
      1: t('tools.anniversaryReminder.paper'),
      5: t('tools.anniversaryReminder.wood'),
      10: t('tools.anniversaryReminder.tin'),
      15: t('tools.anniversaryReminder.crystal'),
      20: t('tools.anniversaryReminder.china'),
      25: t('tools.anniversaryReminder.silver'),
      30: t('tools.anniversaryReminder.pearl'),
      40: t('tools.anniversaryReminder.ruby'),
      50: t('tools.anniversaryReminder.gold'),
      60: t('tools.anniversaryReminder.diamond'),
    }
    return milestones[years] || ''
  }

  const sortedAnniversaries = [...anniversaries].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))

  const upcomingCount = anniversaries.filter(a => getDaysUntil(a.date) <= 30).length
  const todayCount = anniversaries.filter(a => getDaysUntil(a.date) === 0).length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-pink-50 rounded">
            <div className="text-2xl font-bold text-pink-600">{todayCount}</div>
            <div className="text-xs text-slate-500">{t('tools.anniversaryReminder.today')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{upcomingCount}</div>
            <div className="text-xs text-slate-500">{t('tools.anniversaryReminder.thisMonth')}</div>
          </div>
        </div>
      </div>

      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600"
        >
          + {t('tools.anniversaryReminder.addAnniversary')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.anniversaryReminder.addAnniversary')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newAnniversary.name}
              onChange={(e) => setNewAnniversary({ ...newAnniversary, name: e.target.value })}
              placeholder={t('tools.anniversaryReminder.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="date"
              value={newAnniversary.date}
              onChange={(e) => setNewAnniversary({ ...newAnniversary, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={newAnniversary.type}
              onChange={(e) => setNewAnniversary({ ...newAnniversary, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={newAnniversary.notes}
              onChange={(e) => setNewAnniversary({ ...newAnniversary, notes: e.target.value })}
              placeholder={t('tools.anniversaryReminder.notes')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={addAnniversary}
                className="flex-1 py-2 bg-pink-500 text-white rounded font-medium hover:bg-pink-600"
              >
                {t('tools.anniversaryReminder.add')}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.anniversaryReminder.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedAnniversaries.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.anniversaryReminder.noAnniversaries')}
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.anniversaryReminder.yourAnniversaries')}</h3>
          <div className="space-y-3">
            {sortedAnniversaries.map(anniv => {
              const daysUntil = getDaysUntil(anniv.date)
              const years = getYearsCount(anniv.date)
              const nextYears = years + 1
              const milestone = getMilestoneLabel(nextYears)
              const isToday = daysUntil === 0
              const isSoon = daysUntil <= 7

              return (
                <div
                  key={anniv.id}
                  className={`p-3 rounded ${
                    isToday ? 'bg-yellow-100 border-2 border-yellow-300' :
                    isSoon ? 'bg-pink-50 border border-pink-200' :
                    'bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{anniv.name}</div>
                      <div className="text-sm text-slate-500">
                        {types.find(t => t.id === anniv.type)?.label} - {new Date(anniv.date).toLocaleDateString()}
                      </div>
                      {anniv.notes && (
                        <div className="text-xs text-slate-400 mt-1">{anniv.notes}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeAnniversary(anniv.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      x
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-lg font-bold text-pink-600">{nextYears}</span>
                      <span className="text-sm text-slate-500 ml-1">{t('tools.anniversaryReminder.years')}</span>
                      {milestone && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                          {milestone}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-yellow-600' : isSoon ? 'text-pink-600' : 'text-slate-600'
                    }`}>
                      {isToday ? t('tools.anniversaryReminder.today') : `${daysUntil} ${t('tools.anniversaryReminder.daysAway')}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.anniversaryReminder.milestones')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between"><span>1st</span><span className="text-slate-500">Paper</span></div>
          <div className="flex justify-between"><span>5th</span><span className="text-slate-500">Wood</span></div>
          <div className="flex justify-between"><span>10th</span><span className="text-slate-500">Tin</span></div>
          <div className="flex justify-between"><span>25th</span><span className="text-slate-500">Silver</span></div>
          <div className="flex justify-between"><span>50th</span><span className="text-slate-500">Gold</span></div>
          <div className="flex justify-between"><span>60th</span><span className="text-slate-500">Diamond</span></div>
        </div>
      </div>
    </div>
  )
}
